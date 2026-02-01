import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin, isAdmin } from '@/lib/auth-helpers';
import type { AddQuestionRequest, AddQuestionResponse } from '@/types/database';

// POST /api/admin/add-question - Add a new question (admin only)
export async function POST(request: NextRequest) {
  // Server-side check: Verify admin role in app_metadata
  const authError = await requireAdmin(request);
  if (authError) {
    return NextResponse.json(
      { error: authError.error },
      { status: authError.status }
    );
  }

  try {
    const body: AddQuestionRequest = await request.json();

    // Validate required fields
    if (!body.stem || !body.system_tag || !body.discipline_tag || !body.options || body.options.length < 2) {
      return NextResponse.json(
        { error: 'Missing required fields: stem, system_tag, discipline_tag, options (min 2)' },
        { status: 400 }
      );
    }

    // Validate that exactly one option is correct
    const correctOptions = body.options.filter(o => o.is_correct);
    if (correctOptions.length !== 1) {
      return NextResponse.json(
        { error: 'Exactly one option must be marked as correct' },
        { status: 400 }
      );
    }

    // Create the question with options in a transaction
    const question = await db.$transaction(async (tx: any) => {
      // Create the question
      const createdQuestion = await tx.question.create({
        data: {
          stem: body.stem,
          explanation: body.explanation || null,
          educational_objective: body.educational_objective || null,
          system_tag: body.system_tag,
          discipline_tag: body.discipline_tag,
          difficulty: body.difficulty || 'medium',
        },
      });

      // Create the options
      await tx.option.createMany({
        data: body.options.map((option, index) => ({
          question_id: createdQuestion.id,
          text: option.text,
          is_correct: option.is_correct,
          option_index: index,
        })),
      });

      return createdQuestion;
    });

    const response: AddQuestionResponse = {
      question_id: question.id,
      created_at: question.created_at.toISOString(),
    };

    return NextResponse.json(response, { status: 201 });

  } catch (error) {
    console.error('Error adding question:', error);
    return NextResponse.json(
      { error: 'Failed to add question' },
      { status: 500 }
    );
  }
}

// GET /api/admin/add-question - Get question form schema (for validation)
export async function GET() {
  return NextResponse.json({
    schema: {
      type: 'object',
      required: ['stem', 'system_tag', 'discipline_tag', 'options'],
      properties: {
        stem: { type: 'string', description: 'The question stem' },
        explanation: { type: 'string', description: 'Explanation of the correct answer' },
        educational_objective: { type: 'string', description: 'Learning objective' },
        system_tag: { type: 'string', description: 'Organ system (e.g., GI, Renal, Cardio)' },
        discipline_tag: { type: 'string', description: 'Discipline (e.g., Path, Pharm, Physio)' },
        difficulty: { type: 'string', enum: ['easy', 'medium', 'hard'] },
        options: {
          type: 'array',
          items: {
            type: 'object',
            required: ['text', 'is_correct'],
            properties: {
              text: { type: 'string' },
              is_correct: { type: 'boolean' },
            },
          },
          minItems: 2,
        },
      },
    },
    validSystemTags: [
      'GI', 'Renal', 'Cardio', 'Pulm', 'Neuro', 'Endo', 'Heme', 'ID',
      'MSK', 'Derm', 'Psych', 'OBGYN', 'Pediatrics', 'Geriatrics'
    ],
    validDisciplineTags: [
      'Path', 'Pharm', 'Physio', 'Anatomy', 'Microbio', 'Behavioral',
      'Biochem', 'Genetics', 'Embryology', 'Histology'
    ],
  });
}
