import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'
import { HttpClient } from '@angular/common/http';
import { Course } from '../interfaces/course';
import { Player } from '../interfaces/player';


@Injectable({
  providedIn: 'root'
})
export class ScorecardService {
	scorecardObservable: Observable<object>
	players: Player[] = []
	course: string = ""
	tee: string = ""
	sessionId: string = ""
	scorecard: object = {}

	constructor(
		private http: HttpClient,
	) { }
	scorecardReady(): boolean {
		if (this.players.length > 0 && this.course != "" && this.tee != "") {
			return true
		}
		else {
			return false
		}
	}
	getScorecard(): Observable<object> {
		return this.http.get("https://golf-courses-api.herokuapp.com/courses/" + this.course)
	}
}
