export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of the correct option
  explanation: string;
  category: string; // Main subject category
  subcategory?: string; // Optional subcategory
}
