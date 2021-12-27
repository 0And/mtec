import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TopLevel } from '../interfaces/toplevel';
import { Category } from '../interfaces/category';
import { Result } from '../interfaces/result';
import { User } from '../interfaces/user';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TriviaService {
  categoriesUrl: string = 'https://opentdb.com/api_category.php';

  constructor(
    private http: HttpClient,
    private af: AngularFirestore
  ) { }

  getCategoriesObservable(): Observable<Array<Category>> {
    return this.http.get<TopLevel>(this.categoriesUrl).pipe(
      map((obj: TopLevel) => {
        return obj.trivia_categories;
      })
    );
  } 

  getQuestionsObservable(
    amountOfQuestions: number,
    categoryId: number,
    difficulty: string,
    questionType: string
  ): Observable<Array<Result>> {
    const a = `amount=${amountOfQuestions}`;
    const c = categoryId ? `category=${categoryId}` : '';
    const d = difficulty ? `difficulty=${difficulty}` : '';
    const qt = questionType ? `type=${questionType}` : '';
    const url = `https://opentdb.com/api.php?${a}&${c}&${d}&${qt}`.replace(/&+$/, '').replace(/&+/, '&');
    return this.http.get<TopLevel>(url).pipe(
      map((obj: TopLevel) => {
        return obj.results;
      })
    )
  }

  getAllUsersObservable(): Observable<Array<User>> {
    return this.af.collection<User>('users').valueChanges();
  }

  getCurrentUserObservable(id: string): Observable<User> {
    return this.af.collection('users').doc<User>(id).valueChanges();
  }

  updateUserStats(users: User[]): void {
    for (let user of users) {
      this.af.collection('users').doc(user.uid).update({
        ...user
      });
    }
  }
}