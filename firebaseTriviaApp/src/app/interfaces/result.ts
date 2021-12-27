export interface Result {
  category: string,
  type: string,
  difficult: string,
  question: string,
  correct_answer: string,
  incorrect_answers: Array<string>
}