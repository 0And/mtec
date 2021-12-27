import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from './interfaces/user';
import { TriviaService } from './services/trivia.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'trivia';

  loggedIn: boolean;
  firstName: string;

  userAvatarURL: string;

  defaultAvatarURL: string = 'https://i0.wp.com/www.mvhsoracle.com/wp-content/uploads/2018/08/default-avatar.jpg?ssl=1';

  constructor(
    private authService: AuthService,
    private triviaService: TriviaService
  ) { }

  ngOnInit() {
    this.authService.userIdChange.subscribe(id => {
      if (id !== '') {
        this.triviaService.getCurrentUserObservable(id).subscribe(user => {
          this.userAvatarURL = user.photoURL;
        });
      }
    });

    this.authService.loggedInChange.subscribe(bool => {
      this.loggedIn = bool;
    });

    this.authService.firstNameChange.subscribe(firstName => {
      this.firstName = firstName;
    });
  }

  logout() {
    this.authService.logout();
  }

  getDefaultUsername(email: string): string {
    return email.replace(/@.+/, '');
  }
}
