import { Question } from "../types/question";

export const mockQuestions: Question[] = [
  {
    id: "1",
    text: "What is the primary function of the mitochondria in a cell?",
    options: [
      "Protein synthesis",
      "Energy production (ATP synthesis)",
      "DNA replication",
      "Waste removal"
    ],
    correctAnswer: 1,
    explanation: "Mitochondria are known as the 'powerhouses' of the cell. They produce ATP (adenosine triphosphate) through cellular respiration, which is the primary energy currency used by cells for various metabolic processes.",
    category: "Cardiology",
    subcategory: "Heart Failure"
  },
  {
    id: "2",
    text: "Which of the following is NOT a valid HTTP method?",
    options: [
      "GET",
      "POST",
      "FETCH",
      "DELETE"
    ],
    correctAnswer: 2,
    explanation: "FETCH is not a standard HTTP method. The common HTTP methods are GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS, and TRACE. FETCH is actually a JavaScript API for making network requests, not an HTTP method itself.",
    category: "Cardiology",
    subcategory: "Arrhythmias"
  },
  {
    id: "3",
    text: "What is the time complexity of binary search on a sorted array?",
    options: [
      "O(n)",
      "O(log n)",
      "O(n log n)",
      "O(1)"
    ],
    correctAnswer: 1,
    explanation: "Binary search has a time complexity of O(log n) because it eliminates half of the search space with each comparison. This makes it much more efficient than linear search (O(n)) for large sorted arrays.",
    category: "Neurology",
    subcategory: "Stroke"
  },
  {
    id: "4",
    text: "Which hormone is primarily responsible for regulating blood glucose levels?",
    options: [
      "Adrenaline",
      "Insulin",
      "Cortisol",
      "Thyroxine"
    ],
    correctAnswer: 1,
    explanation: "Insulin, produced by the beta cells of the pancreas, is the primary hormone responsible for lowering blood glucose levels by promoting glucose uptake into cells. Glucagon (not listed) works opposite to insulin to raise blood glucose.",
    category: "Cardiology",
    subcategory: "Valvular Disease"
  },
  {
    id: "5",
    text: "In React, what is the purpose of the useEffect hook?",
    options: [
      "To manage component state",
      "To perform side effects after render",
      "To optimize component performance",
      "To handle form submissions"
    ],
    correctAnswer: 1,
    explanation: "useEffect is used to perform side effects in functional components, such as data fetching, subscriptions, or manually changing the DOM. It runs after the render is committed to the screen and can optionally clean up when the component unmounts.",
    category: "Pediatrics",
    subcategory: "Growth & Development"
  },
  {
    id: "6",
    text: "What is the most common cause of acute myocardial infarction?",
    options: [
      "Coronary artery spasm",
      "Atherosclerotic plaque rupture",
      "Viral myocarditis",
      "Cardiac arrhythmia"
    ],
    correctAnswer: 1,
    explanation: "Atherosclerotic plaque rupture with subsequent thrombosis is the most common cause of acute myocardial infarction, accounting for over 90% of cases.",
    category: "Cardiology",
    subcategory: "Arrhythmias"
  },
  {
    id: "7",
    text: "Which medication is first-line for treating atrial fibrillation?",
    options: [
      "Aspirin",
      "Warfarin",
      "Beta-blockers",
      "ACE inhibitors"
    ],
    correctAnswer: 2,
    explanation: "Beta-blockers are often first-line for rate control in atrial fibrillation, though anticoagulation (warfarin or DOACs) is crucial for stroke prevention.",
    category: "Cardiology",
    subcategory: "Arrhythmias"
  },
  {
    id: "8",
    text: "What is the normal ejection fraction of the left ventricle?",
    options: [
      "40-50%",
      "50-60%",
      "55-70%",
      "70-80%"
    ],
    correctAnswer: 2,
    explanation: "The normal left ventricular ejection fraction is 55-70%. Values below 40% indicate systolic heart failure.",
    category: "Cardiology",
    subcategory: "Heart Failure"
  }
];

// Subject categories with subcategories
export const subjectCategories: Record<string, string[]> = {
  Cardiology: ["Arrhythmias", "Valvular Disease", "Heart Failure", "Coronary Artery Disease"],
  Neurology: ["Stroke", "Epilepsy", "Dementia", "Movement Disorders"],
  Pediatrics: ["Growth & Development", "Infectious Diseases", "Congenital Disorders", "Nutrition"],
  Ethics: ["Patient Autonomy", "Informed Consent", "Confidentiality", "End-of-Life Care"]
};
