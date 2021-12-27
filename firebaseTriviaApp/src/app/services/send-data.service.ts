import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Result } from '../interfaces/result';
import { Data } from '../interfaces/data';

@Injectable({
  providedIn: 'root'
})
export class SendDataService {
  data: Data = {
    users: [],
    questions: []
  };

  constructor() { }

  sendGameData(game: Data) {
    this.data = game
  }

  // clearGameData() {
  //   this.subject.next()
  // }

  getGameData() {
    return this.data
  }
}
