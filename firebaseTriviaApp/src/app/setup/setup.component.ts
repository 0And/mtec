import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { TriviaService } from '../services/trivia.service';
import { Observable, Subscription } from 'rxjs';
import { Category } from '../interfaces/category';
import { sameAmountValidator } from './same-amount.directive';
import { SendDataService } from '../services/send-data.service';
import { MatDialog } from '@angular/material/dialog';
import { PlayerDialogComponent } from './player-dialog/player-dialog.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Result } from '../interfaces/result';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { Data } from '../interfaces/data';
import { User } from '../interfaces/user';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.scss']
})
export class SetupComponent implements OnInit {
  categories: Category[];
  currentUser: User;
  data: Data = {
    questions: [],
    users: []
    }



  categoriesSubscription: Subscription;

  game = { amount: 1, questionNum: 10, category: "any", difficulty: "any", type: "any" };
  playerAmount = [1, 2, 3];

  setUpForm: FormGroup;
  selected = 'any';

  constructor(
    private triviaService: TriviaService,
    private authService: AuthService,
    private sendDataService: SendDataService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getCurrentUser()
    this.categories = this.route.snapshot.data.categories
    this.setUpForm = new FormGroup({
      'amount': new FormControl(this.game.amount),
      'questionNum': new FormControl(this.game.questionNum, [
        Validators.required,
        Validators.max(50),
        Validators.min(1),
        sameAmountValidator
      ]),
      'category': new FormControl(this.game.category),
      'difficulty': new FormControl(this.game.difficulty),
      'type': new FormControl(this.game.type)
    }, { validators: sameAmountValidator })

    this.getCategories()
  }

  ngOnDestroy() {
    this.categoriesSubscription.unsubscribe();
  }

  get questionNum() { return this.setUpForm.get('questionNum') }

  getCategories() {
    this.categoriesSubscription = this.triviaService.getCategoriesObservable()
      .subscribe(categories => this.categories = categories);
  }

  chooseUser() {
    this.data.users = []
    if (Number(this.setUpForm.value.amount) > 1) {
      const dialogRef = this.dialog.open(PlayerDialogComponent, {
        width: '1000px',
        disableClose: true,
        data: { amount: this.setUpForm.value.amount, currentUser: this.currentUser }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result === "canceled") {
          this.setUpForm.get('amount').setValue(1)
        }
        else {
          this.data.users = result
        }
      });
    }
  }

  getCurrentUser() {
    this.authService.userIdChange.subscribe(id => {
      if(id !== '') {
        this.triviaService.getCurrentUserObservable(id).subscribe(user => this.currentUser = user)
      }
    })
  }

  sendData(data) {
    this.sendDataService.sendGameData(data);
  }

  submitForm() {
    let category = this.setUpForm.value.category;
    let difficulty = this.setUpForm.value.difficulty;
    let type = this.setUpForm.value.type;

    this.triviaService.getQuestionsObservable(
      this.setUpForm.value.questionNum,
      category === "any" ? null : category,
      difficulty === "any" ? null : difficulty,
      type === "any" ? null : type
    ).subscribe(questions => {
      this.data.questions = questions
      if (this.data.questions.length !== 0) {
        if(Number(this.setUpForm.value.amount) === 1){
          this.data.users = [this.currentUser]
        }
        this.router.navigate(['/game'])
        this.sendData(this.data)
      }
      else {
        this.snackBar.open("OOPS! There doesn't seem to be any questions matching your set up!", "Close", {
          duration: 2000,
          panelClass: ['mat-toolbar', 'mat-warn']
        })
      }
    });

  }

}
