import { ExamQuestion } from './types';

export const sampleQuestions: ExamQuestion[] = [
  {
    id: 'q1',
    stem: `
      <p>A 58-year-old man presents to the emergency department with crushing substernal chest pain that radiates to his left arm and jaw. The pain started 2 hours ago while he was shoveling snow. He has a history of hypertension, hyperlipidemia, and type 2 diabetes mellitus. He smoked 1 pack of cigarettes per day for 30 years before quitting 5 years ago.</p>
      
      <p>On physical examination, his blood pressure is 165/95 mmHg, heart rate is 102 beats per minute, and oxygen saturation is 94% on room air. He appears diaphoretic and in obvious distress. Cardiac examination reveals an S4 gallop without murmurs. Lung examination is clear to auscultation bilaterally.</p>
      
      <p>An electrocardiogram shows ST-segment elevation in leads V1-V4, V5, and aVL with reciprocal ST-segment depression in leads II, III, and aVF.</p>
      
      <p><strong>Question:</strong> Which of the following is the most appropriate initial management for this patient?</p>
    `,
    options: [
      'Administer sublingual nitroglycerin and observe',
      'Start thrombolytic therapy within 30 minutes',
      'Perform urgent cardiac catheterization with percutaneous coronary intervention',
      'Begin warfarin therapy and monitor INR',
      'Schedule elective stress testing in 1 week'
    ],
    correctIndex: 2,
    explanation: 'This patient is presenting with an acute ST-elevation myocardial infarction (STEMI) involving the anterior wall. The most appropriate initial management is urgent cardiac catheterization with percutaneous coronary intervention (PCI), which should be performed within 90 minutes of first medical contact. Thrombolytic therapy is an alternative if PCI cannot be performed within 120 minutes, but primary PCI is the preferred strategy when available.',
    educationalObjective: 'Recognize the appropriate initial management of acute STEMI, including the importance of timely reperfusion therapy.',
    topicTags: ['Acute Coronary Syndrome', 'STEMI', 'Reperfusion Therapy', 'PCI'],
    category: 'Cardiology',
    subcategory: 'Acute Coronary Syndrome',
    peerPerformance: 78,
    difficulty: 'medium'
  },
  {
    id: 'q2',
    stem: `
      <p>A 32-year-old woman presents to her primary care physician with a 3-month history of progressive fatigue, weight loss, and palpitations. She reports increased appetite but has lost 10 pounds despite eating more. She also notes heat intolerance, tremor, and difficulty sleeping. On examination, her thyroid gland is diffusely enlarged and nontender. She has fine tremor of her outstretched hands and warm, moist skin.</p>
      
      <p>Laboratory studies reveal:</p>
      <ul>
        <li>TSH: 0.02 mIU/L (low)</li>
        <li>Free T4: 3.5 ng/dL (elevated)</li>
        <li>Free T3: 8.2 pg/mL (elevated)</li>
        <li>Thyroid-stimulating immunoglobulin: Positive</li>
      </ul>
      
      <p><strong>Question:</strong> What is the most likely diagnosis?</p>
    `,
    options: [
      'Subacute thyroiditis',
      'Hashimoto thyroiditis',
      'Graves disease',
      'Toxic multinodular goiter',
      'Thyroid carcinoma'
    ],
    correctIndex: 2,
    explanation: 'This patient has Graves disease, an autoimmune disorder caused by thyroid-stimulating immunoglobulins that activate the TSH receptor. The classic presentation includes hyperthyroidism symptoms (weight loss, palpitations, heat intolerance), diffuse goiter, and pretibial myxedema. The positive thyroid-stimulating immunoglobulin confirms the diagnosis.',
    educationalObjective: 'Differentiate between causes of hyperthyroidism and recognize the clinical features of Graves disease.',
    topicTags: ['Hyperthyroidism', 'Graves Disease', 'Autoimmune Thyroid Disease', 'TSH Receptor Antibodies'],
    category: 'Endocrinology',
    subcategory: 'Thyroid Disorders',
    peerPerformance: 85,
    difficulty: 'easy'
  },
  {
    id: 'q3',
    stem: `
      <p>A 45-year-old man with a history of alcoholic cirrhosis presents to the emergency department with abdominal distension and shortness of breath. He reports that his abdomen has been progressively getting larger over the past 2 weeks. He also notes swelling in his ankles.</p>
      
      <p>On physical examination, his blood pressure is 98/62 mmHg, heart rate is 98 beats per minute, and respiratory rate is 22 breaths per minute. He appears cachectic with temporal wasting. Abdominal examination reveals a distended abdomen with shifting dullness and a positive fluid wave. He has 2+ pitting edema bilaterally up to his knees.</p>
      
      <p>Paracentesis is performed and reveals:</p>
      <ul>
        <li>Fluid appearance: Straw-colored</li>
        <li>Fluid protein: 1.2 g/dL</li>
        <li>Fluid albumin: 0.8 g/dL</li>
        <li>Fluid WBC: 280/μL (75% neutrophils)</li>
      </ul>
      
      <p><strong>Question:</strong> What is the most appropriate treatment for this patient?</p>
    `,
    options: [
      'Observation and diuretic therapy',
      'Antibiotic therapy and albumin infusion',
      'Large-volume paracentesis with albumin infusion',
      'Transjugular intrahepatic portosystemic shunt (TIPS)',
      'Liver transplantation evaluation'
    ],
    correctIndex: 1,
    explanation: 'This patient has spontaneous bacterial peritonitis (SBP), as evidenced by an ascitic fluid neutrophil count >250 cells/μL (280 with 75% neutrophils = 210 neutrophils). SBP is a medical emergency requiring prompt antibiotic therapy (typically cefotaxime) along with albumin infusion to reduce the risk of hepatorenal syndrome.',
    educationalObjective: 'Recognize the diagnostic criteria for spontaneous bacterial peritonitis and understand appropriate management.',
    topicTags: ['Cirrhosis', 'Ascites', 'Spontaneous Bacterial Peritonitis', 'SBP'],
    category: 'Gastroenterology',
    subcategory: 'Liver Disease',
    peerPerformance: 72,
    difficulty: 'medium'
  },
  {
    id: 'q4',
    stem: `
      <p>A 28-year-old woman presents to the clinic with a 6-month history of progressive symmetric weakness, particularly in her proximal muscles. She reports difficulty climbing stairs, rising from a chair, and lifting objects above her head. She also notes a rash on her cheeks and knuckles that has developed over the same time period.</p>
      
      <p>On examination, she has a heliotrope rash (purplish discoloration around the eyes) and Gottron papules (raised, scaly lesions over the knuckles). Muscle strength testing reveals 4-/5 strength in the proximal upper and lower extremities. Reflexes are intact throughout.</p>
      
      <p>Laboratory studies show:</p>
      <ul>
        <li>CK: 2,800 U/L (elevated)</li>
        <li>AST: 180 U/L (elevated)</li>
        <li>ALT: 165 U/L (elevated)</li>
        <li>ANA: 1:40 (weakly positive)</li>
        <li>Anti-Jo-1 antibody: Positive</li>
      </ul>
      
      <p><strong>Question:</strong> What is the most likely diagnosis?</p>
    `,
    options: [
      'Polymyositis',
      'Dermatomyositis',
      'Systemic lupus erythematosus',
      'Myasthenia gravis',
      'Lambert-Eaton myasthenic syndrome'
    ],
    correctIndex: 1,
    explanation: 'This patient has dermatomyositis, characterized by symmetric proximal muscle weakness, elevated muscle enzymes, and the classic cutaneous manifestations including heliotrope rash and Gottron papules. The anti-Jo-1 antibody is highly specific for dermatomyositis and is associated with the antisynthetase syndrome.',
    educationalObjective: 'Differentiate between inflammatory myopathies and recognize the characteristic features of dermatomyositis.',
    topicTags: ['Dermatomyositis', 'Inflammatory Myopathy', 'Autoimmune Disease', 'Anti-Jo-1'],
    category: 'Rheumatology',
    subcategory: 'Connective Tissue Disease',
    peerPerformance: 68,
    difficulty: 'medium'
  },
  {
    id: 'q5',
    stem: `
      <p>A 62-year-old man is brought to the emergency department after being found unresponsive at home. His wife reports that he has had progressive memory loss over the past 2 years, which has worsened significantly in the last 6 months. He has been having difficulty finding words and has gotten lost while driving in familiar areas. She also notes that he has been having visual hallucinations for the past 3 months.</p>
      
      <p>On neurological examination, he is alert but disoriented to time and place. He has a Mini-Mental State Examination score of 18/30. His visual fields are intact, and he has no motor weakness. His gait is slightly stooped with decreased arm swing bilaterally.</p>
      
      <p><strong>Question:</strong> Which of the following is the most likely diagnosis?</p>
    `,
    options: [
      'Alzheimer disease',
      'Vascular dementia',
      'Lewy body dementia',
      'Frontotemporal dementia',
      'Normal pressure hydrocephalus'
    ],
    correctIndex: 2,
    explanation: 'This patient most likely has Lewy body dementia, characterized by progressive cognitive decline, visual hallucinations, and parkinsonism. The core clinical features include fluctuating cognition, visual hallucinations, and parkinsonism. Unlike Alzheimer disease, memory may be relatively preserved early on, and visual hallucinations are a prominent feature.',
    educationalObjective: 'Differentiate between types of dementia and recognize the clinical features of Lewy body dementia.',
    topicTags: ['Dementia', 'Lewy Body Dementia', 'Parkinsonism', 'Visual Hallucinations'],
    category: 'Neurology',
    subcategory: 'Cognitive Disorders',
    peerPerformance: 65,
    difficulty: 'hard'
  },
  {
    id: 'q6',
    stem: `
      <p>A 35-year-old woman, G2P1 at 28 weeks gestation, presents to the obstetric clinic for a routine prenatal visit. She reports normal fetal movements and has no complaints. Her prenatal course has been uncomplicated. She takes prenatal vitamins daily and has no significant medical history.</p>
      
      <p>On examination, her blood pressure is 118/72 mmHg, weight gain is appropriate for gestational age, and fundal height is 26 cm (2 weeks less than expected). Fetal heart rate is 140 beats per minute and reactive.</p>
      
      <p>Ultrasound is performed and shows:</p>
      <ul>
        <li>Single live fetus in vertex presentation</li>
        <li>Estimated fetal weight: 1,800 g (10th percentile)</li>
        <li>Amniotic fluid index: 5 cm (reduced)</li>
        <li>Umbilical artery Doppler: Elevated systolic/diastolic ratio</li>
      </ul>
      
      <p><strong>Question:</strong> What is the most likely diagnosis?</p>
    `,
    options: [
      'Placental abruption',
      'Placenta previa',
      'Intrauterine growth restriction',
      'Oligohydramnios',
      'Normal variant'
    ],
    correctIndex: 2,
    explanation: 'This patient has intrauterine growth restriction (IUGR), characterized by estimated fetal weight below the 10th percentile for gestational age. The findings of reduced amniotic fluid and abnormal umbilical artery Doppler studies suggest placental insufficiency as the etiology. IUGR is associated with increased perinatal morbidity and mortality.',
    educationalObjective: 'Recognize the sonographic criteria for intrauterine growth restriction and understand its clinical significance.',
    topicTags: ['IUGR', 'Placental Insufficiency', 'Fetal Growth Restriction', 'Prenatal Diagnosis'],
    category: 'Obstetrics',
    subcategory: 'Fetal Medicine',
    peerPerformance: 74,
    difficulty: 'medium'
  },
  {
    id: 'q7',
    stem: `
      <p>A 55-year-old man with a history of type 2 diabetes mellitus and hypertension presents to the emergency department with a 3-day history of progressive shortness of breath and swelling in his legs. He reports that he can only sleep on 3 pillows and wakes up short of breath at night. He has not taken his medications regularly.</p>
      
      <p>On examination, his blood pressure is 165/100 mmHg, heart rate is 110 beats per minute, respiratory rate is 28 breaths per minute, and oxygen saturation is 89% on room air. He appears in respiratory distress with jugular venous distension to the angle of the mandible. Lung examination reveals bilateral crackles at the bases extending to the mid-lung fields. Cardiac examination reveals an S3 gallop and a systolic murmur at the apex radiating to the axilla.</p>
      
      <p>Chest X-ray shows cardiomegaly with pulmonary edema.</p>
      
      <p><strong>Question:</strong> What is the most appropriate initial management?</p>
    `,
    options: [
      'Oral furosemide and outpatient follow-up',
      'IV nitroglycerin and IV furosemide',
      'Beta-blocker therapy',
      'ACE inhibitor therapy alone',
      'Urgent dialysis'
    ],
    correctIndex: 1,
    explanation: 'This patient is presenting with acute decompensated heart failure with pulmonary edema. The most appropriate initial management includes IV nitroglycerin (for afterload reduction and venodilation) and IV loop diuretics (such as furosemide) to promote diuresis and reduce preload. Oxygen should also be administered to maintain adequate oxygenation.',
    educationalObjective: 'Recognize the clinical presentation of acute decompensated heart failure and understand initial management strategies.',
    topicTags: ['Heart Failure', 'Acute Decompensated HF', 'Pulmonary Edema', 'IV Diuretics'],
    category: 'Cardiology',
    subcategory: 'Heart Failure',
    peerPerformance: 82,
    difficulty: 'medium'
  },
  {
    id: 'q8',
    stem: `
      <p>A 25-year-old woman presents to the emergency department with a 2-day history of severe headache, fever, and stiff neck. She reports that the headache is the worst she has ever experienced and is worsened by movement. She also notes photophobia and nausea.</p>
      
      <p>On examination, her temperature is 39.2°C (102.6°F), blood pressure is 118/76 mmHg, heart rate is 105 beats per minute, and neck stiffness is present with positive Kernig and Brudzinski signs.</p>
      
      <p>CT scan of the head is normal. Lumbar puncture is performed and shows:</p>
      <ul>
        <li>Opening pressure: 280 mm H2O (elevated)</li>
        <li>WBC: 2,500/μL (85% neutrophils)</li>
        <li>Protein: 180 mg/dL (elevated)</li>
        <li>Glucose: 35 mg/dL (low)</li>
        <li>Gram stain: Gram-negative diplococci</li>
      </ul>
      
      <p><strong>Question:</strong> What is the most appropriate antibiotic regimen?</p>
    `,
    options: [
      'Vancomycin alone',
      'Ceftriaxone and vancomycin',
      'Ceftriaxone, vancomycin, and ampicillin',
      'Acyclovir',
      'Isoniazid, rifampin, pyrazinamide, and ethambutol'
    ],
    correctIndex: 2,
    explanation: 'This patient has meningococcal meningitis, as evidenced by the Gram stain showing Gram-negative diplococci. Empiric treatment for bacterial meningitis should include a third-generation cephalosporin (ceftriaxone) plus vancomycin to cover resistant Streptococcus pneumoniae. Ampicillin should be added for Listeria coverage in patients at risk, including those over 50 years old or immunocompromised.',
    educationalObjective: 'Recognize the clinical presentation and CSF findings of meningococcal meningitis and understand appropriate antibiotic therapy.',
    topicTags: ['Meningitis', 'Neisseria meningitidis', 'Bacterial Meningitis', 'CSF Analysis'],
    category: 'Infectious Disease',
    subcategory: 'CNS Infections',
    peerPerformance: 88,
    difficulty: 'easy'
  }
];
