import { User } from './user';
import { Result } from './result';

export interface Data {
  users: User[],
  questions: Result[]
}