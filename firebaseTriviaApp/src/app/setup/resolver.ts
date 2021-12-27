import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { TriviaService } from '../services/trivia.service';

@Injectable()
export class Resolver implements Resolve<Observable<string>> {
  constructor(private triviaService: TriviaService) { }

  resolve():Observable<any> {
    return this.triviaService.getCategoriesObservable();
  }
}