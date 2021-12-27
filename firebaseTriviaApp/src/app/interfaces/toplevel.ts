import { Category } from './category';
import { Result } from './result';

export interface TopLevel {
  trivia_categories?: Array<Category>;
  results?: Array<Result>
}