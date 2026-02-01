-- ============================================================================
// Medical QBank - Database Migration Script
// Run this in your Supabase SQL Editor
// ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
// 1. QUESTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Question" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stem TEXT NOT NULL,
    explanation TEXT,
    educational_objective TEXT,
    system_tag VARCHAR(100),        -- e.g., "GI", "Renal", "Cardio"
    discipline_tag VARCHAR(100),    -- e.g., "Path", "Pharm", "Physio"
    difficulty VARCHAR(20) DEFAULT 'medium',
    peer_performance FLOAT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Question_system_tag_idx" ON "Question"(system_tag);
CREATE INDEX IF NOT EXISTS "Question_discipline_tag_idx" ON "Question"(discipline_tag);
CREATE INDEX IF NOT EXISTS "Question_created_at_idx" ON "Question"(created_at);

-- ============================================================================
// 2. OPTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "Option" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_id UUID NOT NULL REFERENCES "Question"(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    option_index INTEGER NOT NULL,  -- 0-3 for display order
    
    CONSTRAINT "Option_question_id_option_index_key" UNIQUE (question_id, option_index)
);

CREATE INDEX IF NOT EXISTS "Option_question_id_idx" ON "Option"(question_id);

-- ============================================================================
// 3. USER RESPONSES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS "UserResponse" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    question_id UUID NOT NULL REFERENCES "Question"(id) ON DELETE CASCADE,
    selected_option_id UUID REFERENCES "Option"(id),
    time_spent_ms INTEGER DEFAULT 0,
    is_correct BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT "UserResponse_user_id_question_id_key" UNIQUE (user_id, question_id)
);

CREATE INDEX IF NOT EXISTS "UserResponse_user_id_idx" ON "UserResponse"(user_id);
CREATE INDEX IF NOT EXISTS "UserResponse_question_id_idx" ON "UserResponse"(question_id);
CREATE INDEX IF NOT EXISTS "UserResponse_created_at_idx" ON "UserResponse"(created_at);

-- ============================================================================
// 4. EXAM SESSION TABLE (Simulation State Persistence)
// ============================================================================
CREATE TABLE IF NOT EXISTS "ExamSession" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255) NOT NULL,
    mode VARCHAR(20) NOT NULL,  -- "timed", "tutor", "review"
    question_ids UUID[] NOT NULL,  -- Array of question IDs
    current_index INTEGER DEFAULT 0,
    responses JSONB NOT NULL DEFAULT '{}',  -- { questionId: { selectedIndex, timeSpent, flagged } }
    time_remaining INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_saved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_completed BOOLEAN DEFAULT FALSE
);

CREATE INDEX IF NOT EXISTS "ExamSession_user_id_idx" ON "ExamSession"(user_id);
CREATE INDEX IF NOT EXISTS "ExamSession_started_at_idx" ON "ExamSession"(started_at);

-- ============================================================================
// 5. FLASHCARDS TABLE (Enhanced with SM2 Algorithm)
// ============================================================================
CREATE TABLE IF NOT EXISTS "Flashcard" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(255),  -- NULL for system-wide cards
    question_id UUID REFERENCES "Question"(id),
    front TEXT NOT NULL,
    back TEXT NOT NULL,
    category VARCHAR(255),
    
    -- SM2 Algorithm fields
    next_review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    interval INTEGER DEFAULT 1,  -- Days until next review
    ease_factor FLOAT DEFAULT 2.5,
    repetitions INTEGER DEFAULT 0,
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS "Flashcard_user_id_idx" ON "Flashcard"(user_id);
CREATE INDEX IF NOT EXISTS "Flashcard_next_review_date_idx" ON "Flashcard"(next_review_date);
CREATE INDEX IF NOT EXISTS "Flashcard_category_idx" ON "Flashcard"(category);

-- ============================================================================
// VIEWS FOR ANALYTICS
-- ============================================================================

-- View: User Performance by System
CREATE OR REPLACE VIEW "UserPerformanceBySystem" AS
SELECT 
    ur.user_id,
    q.system_tag,
    COUNT(*) as total_questions,
    SUM(CASE WHEN ur.is_correct THEN 1 ELSE 0 END) as correct_count,
    ROUND(
        100.0 * SUM(CASE WHEN ur.is_correct THEN 1 ELSE 0 END) / COUNT(*),
        2
    ) as accuracy_percentage,
    AVG(ur.time_spent_ms) as avg_time_ms
FROM "UserResponse" ur
JOIN "Question" q ON ur.question_id = q.id
WHERE q.system_tag IS NOT NULL
GROUP BY ur.user_id, q.system_tag
ORDER BY ur.user_id, q.system_tag;

-- View: Questions Due for Review
CREATE OR REPLACE VIEW "FlashcardsDueForReview" AS
SELECT 
    f.*
FROM "Flashcard" f
WHERE f.next_review_date <= NOW()
ORDER BY f.next_review_date ASC;

-- ============================================================================
// FUNCTIONS
// ============================================================================

-- Function to update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at trigger to all tables
DROP TRIGGER IF EXISTS update_question_updated_at ON "Question";
CREATE TRIGGER update_question_updated_at
    BEFORE UPDATE ON "Question"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_flashcard_updated_at ON "Flashcard";
CREATE TRIGGER update_flashcard_updated_at
    BEFORE UPDATE ON "Flashcard"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate SM2 next review
CREATE OR REPLACE FUNCTION calculate_sm2_interval(
    p_repetitions INTEGER,
    p_ease_factor FLOAT,
    p_quality INTEGER  -- 0-5 rating: 0=Again, 3=Hard, 4=Good, 5=Easy
) RETURNS TABLE (new_interval INTEGER, new_ease_factor FLOAT, new_repetitions INTEGER) AS $$
DECLARE
    v_interval INTEGER;
    v_ease_factor FLOAT;
    v_repetitions INTEGER;
BEGIN
    -- Calculate new ease factor (SM2 formula)
    v_ease_factor := p_ease_factor + (0.1 - (5 - p_quality) * (0.08 + (5 - p_quality) * 0.02));
    IF v_ease_factor < 1.3 THEN
        v_ease_factor := 1.3;
    END IF;

    -- Calculate new interval based on quality rating
    IF p_quality < 3 THEN
        -- Failed: reset repetitions
        v_repetitions := 0;
        v_interval := 1;
    ELSE
        v_repetitions := p_repetitions + 1;
        
        CASE v_repetitions
            WHEN 1 THEN v_interval := 1;
            WHEN 2 THEN v_interval := 6;
            ELSE v_interval := ROUND(p_interval * v_ease_factor);
        END CASE;
    END IF;

    RETURN QUERY SELECT v_interval, v_ease_factor, v_repetitions;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
// SAMPLE DATA (Optional - for testing)
// ============================================================================

-- Sample Question
INSERT INTO "Question" (stem, explanation, system_tag, discipline_tag, difficulty)
VALUES 
    ('A 45-year-old man presents with epigastric pain that improves with eating. He has a history of regular NSAID use. What is the most likely diagnosis?',
     'This patient has epigastric pain that improves with eating, classic for duodenal ulcer. NSAID use is a major risk factor for peptic ulcer disease.',
     'GI', 'Path', 'medium');

-- Add options for the question (you need to get the question ID first)
-- INSERT INTO "Option" (question_id, text, is_correct, option_index)
-- VALUES ('<question_uuid>', 'Duodenal ulcer', true, 0),
--        ('<question_uuid>', 'Gastric ulcer', false, 1),
--        ('<question_uuid>', 'GERD', false, 2),
--        ('<question_uuid>', 'Pancreatitis', false, 3);

PRINT 'Medical QBank database migration completed successfully!';
