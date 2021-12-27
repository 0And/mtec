import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

import { faGoogle } from '@fortawesome/free-brands-svg-icons/faGoogle';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  google = faGoogle;
  facebook = faFacebook;

  signinForm: FormGroup;
  signupForm: FormGroup;

  signinError: string;
  signupError: string;

  signinSubmit: boolean = false;
  signupSubmit: boolean = false;

  isSignIn: boolean = true;
  isSignUp: boolean = false;

  emailRegex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      signinEmail: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailRegex)
      ]),
      signinPassword: new FormControl('', [Validators.required])
    });

    this.signupForm = this.fb.group({
      signupEmail: new FormControl('', [
        Validators.required,
        Validators.pattern(this.emailRegex)
      ]),
      signupPassword: new FormControl('', [Validators.required])
    });

    this.authService.signinErrorChange.subscribe(error => {
      this.signinError = error;
    });

    this.authService.signupErrorChange.subscribe(error => {
      this.signupError = error;
    });

    this.authService.loggedInChange.subscribe(bool => {
      if (bool) {
        this.router.navigate(['set-up']);
      }
    });
  }

  signInWithGoogle(): void {
    this.authService.loginWithGoogle();
  }

  signInWithFacebook(): void {
    this.authService.loginWithFacebook();
  }

  signup(): void {
    if (this.signupForm.valid) {
      this.authService.signup(this.signupForm.value.signupEmail, this.signupForm.value.signupPassword);
    }

    this.signupSubmit = true;
  }

  signin(): void {
    if (this.signinForm.valid) {
      this.authService.signin(this.signinForm.value.signinEmail, this.signinForm.value.signinPassword);
    }

    this.signinSubmit = true;
  }

  resetSigninError(): void {
    this.signinError = '';
  }

  resetSignupError(): void {
    this.signupError = '';
  }

  signInOrSignUp(indicator?: boolean) {
    this.isSignIn = !this.isSignIn;
    this.isSignUp = !this.isSignUp;

    const signInList = document.getElementById('sign-in').classList;
    const signUpList = document.getElementById('sign-up').classList;

    if (indicator) {
      signInList.add('active');
      signUpList.remove('active');
    } else {
      signUpList.add('active');
      signInList.remove('active');
    }
  }

  get signinEmail(): AbstractControl { return this.signinForm.get('signinEmail'); }

  get signinPassword(): AbstractControl { return this.signinForm.get('signinPassword'); }

  get signupEmail(): AbstractControl { return this.signupForm.get('signupEmail'); }

  get signupPassword(): AbstractControl { return this.signupForm.get('signupPassword'); }
}
