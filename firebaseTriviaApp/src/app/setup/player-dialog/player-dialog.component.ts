import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { TriviaService } from 'src/app/services/trivia.service';

@Component({
  selector: 'app-player-dialog',
  templateUrl: './player-dialog.component.html',
  styleUrls: ['./player-dialog.component.scss']
})
export class PlayerDialogComponent implements OnInit {
  players;
  playersPlaying = [this.data.currentUser];
  nextPlayer = false;
  isDisabled = false;
  chosenPlayers = 1;

  defaultAvatarURL: string = 'https://i0.wp.com/www.mvhsoracle.com/wp-content/uploads/2018/08/default-avatar.jpg?ssl=1';

  constructor(
    public dialogRef: MatDialogRef<PlayerDialogComponent>,
    private authService: AuthService,
    private triviaService: TriviaService,
    @Inject(MAT_DIALOG_DATA) public data
  ) { }

  ngOnInit(): void {
    this.triviaService.getAllUsersObservable()
      .subscribe(players => {
        let filtered = players.filter(player => player.uid !== this.data.currentUser.uid)

        this.players = filtered
      })
  }

  playerClicked(player, event) {

    if (Number(this.data.amount) <= 2) {
      this.playersPlaying.push(player)
      this.dialogRef.close(this.playersPlaying);
    } else {
      if (event.target.tagName === 'MAT-CARD') {
        // make players already chosen disabled
        event.target.classList.add('disabled')
      }
      else {
        event.target.parentNode.classList.add('disabled')
      }
        this.nextPlayer = true
        this.playersPlaying.push(player)
        this.chosenPlayers++
        if (this.chosenPlayers === Number(this.data.amount)) {
          this.dialogRef.close(this.playersPlaying)
        }
    }
  }

  onCancel() {
    this.dialogRef.close("canceled")
  }

  getDefaultUsername(email: string): string {
    return email.replace(/@.+/, '');
  }
}
