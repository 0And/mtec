import { CategoryAnswer } from './categoryAnswer';

export interface User {
  uid: string,
  displayName: string,
  photoURL: string,
  email: string,
  phoneNumber: string,
  providerId: string,
  categoryAnswers?: CategoryAnswer[],
  totalGamesLost?: number,
  totalGamesWon?: number,
  totalQuestionsAnswered?: number,
  totalQuestionsAnsweredIncorrectly?: number,
  totalQuestionsAnsweredCorrectly?: number,
  totalGamesPlayed?: number
}