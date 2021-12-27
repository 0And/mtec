import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { auth } from 'firebase/app';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { User } from '../interfaces/user';
import { Subject, BehaviorSubject } from 'rxjs';

import { TriviaService } from './trivia.service';
import { CategoryAnswer } from '../interfaces/categoryAnswer';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User;

  loggedInChange: Subject<boolean> = new Subject<boolean>();
  firstNameChange: Subject<string> = new Subject<string>();
  signinErrorChange: BehaviorSubject<string> = new BehaviorSubject<string>('');
  signupErrorChange: BehaviorSubject<string> = new BehaviorSubject<string>('');

  userIdChange: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(
    private af: AngularFirestore,
    private afa: AngularFireAuth,
    private router: Router,
    private triviaService: TriviaService
  ) {
    this.afa.authState.subscribe(user => {
      if (user) {
        this.user = user.providerData[0];
        let displayName = this.user.displayName;
        const email = this.user.email;

        if (displayName) {
          displayName = displayName.replace(/\s.+/, '');
        } else {
          displayName = email.replace(/@.+/, '');
        }

        const usersRef = this.af.collection('users').doc(this.user.uid);

        usersRef.update({...this.user}).then(_ => {
          this.allChanges(displayName);
        }).catch(_ => {
          this.triviaService.getCategoriesObservable().subscribe(categories => {
            const categoryAnswers: CategoryAnswer[] = [];

            for (let categoryObj of categories) {
              categoryAnswers.push({
                answeredCorrectly: 0,
                answeredIncorrectly: 0,
                category: categoryObj.name
              });
            }

            this.af.collection('users').doc(this.user.uid).set({
              ...this.user,
              totalGamesPlayed: 0,
              totalGamesWon: 0,
              totalGamesLost: 0,
              totalQuestionsAnswered: 0,
              totalQuestionsAnsweredIncorrectly: 0,
              totalQuestionsAnsweredCorrectly: 0,
              categoryAnswers
            }).then(_ => {
              this.allChanges(displayName);
            });
          });
        });
      }
    });
  }

  async loginWithGoogle() {
    await this.afa.signInWithPopup(new auth.GoogleAuthProvider());
    this.router.navigate(['set-up']);
  }

  async loginWithFacebook() {
    await this.afa.signInWithPopup(new auth.FacebookAuthProvider());
    this.router.navigate(['set-up']);
  }

  async logout() {
    this.loggedInChange.next(false);
    await this.afa.signOut();
    this.router.navigate(['log-in']);
  }

  signup(email: string, password: string) {
    this.afa.createUserWithEmailAndPassword(email, password)
      .then(_ => {
        console.log('Successfully created an account');
      })
      .catch(e => {
        console.log('Error with signing up:');
        console.log(e.message);

        this.signupErrorChange.next(e.message);
      });
  }

  signin(email: string, password: string) {
    this.afa.signInWithEmailAndPassword(email, password)
      .then(_ => {
        console.log("Successfully signed in using email and password");
      })
      .catch(e => {
        console.log('Error with signing in with email and password:');
        console.log(e.message);

        this.signinErrorChange.next(e.message);
      });
  }

  allChanges(displayName: string): void {
    this.loggedInChange.next(true);
    this.userIdChange.next(this.user.uid);
    this.firstNameChange.next(displayName);
  }
}
