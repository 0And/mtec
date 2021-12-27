import { Component, OnInit } from '@angular/core';
import { Player } from '../interfaces/player';
import { Course } from '../interfaces/course';
import { MatDialog } from '@angular/material/dialog';
import { NewPlayerComponent } from './new-player/new-player.component';
import { GolfCoursesApiService } from '../services/golf-courses-api.service';
import { ScorecardService } from '../services/scorecard.service';
import { Router } from '@angular/router';
import { SessionServiceService } from '../services/session-service.service';
import { Session } from '../interfaces/session';

@Component({
	selector: 'app-setup',
	templateUrl: './setup.component.html',
	styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

	players: Player[] = []
	colors: object = {
		"Black": "#333333",
		"Blue": "#3c5591",
		"Red": "#913c3c",
		"Yellow": "#c1ba47",
		"Green": "#3b5f41"
	}
	courses: Course[] = []
	course: string = ""
	tees: string[] = ["Pro", "Champion", "Men", "Women"]
	tee: string = ""
	sessionId = ""
	newSessionId = ""
	sessionAvailable: boolean = false

	sessionList: Session[] = []

	constructor(
		public dialog: MatDialog,
		public golfCoursesApiService: GolfCoursesApiService,
		public scorecardService: ScorecardService,
		public sessionService: SessionServiceService,
		private router: Router
	) { }
	ngOnInit(): void {
		this.sessionService.getSessions().subscribe(data => {
			this.sessionList = data
		})
		this.golfCoursesApiService.getCourses().subscribe(data => {
			this.courses = data["courses"]
		})
	}
	newPlayer(): void {
		let availableColors: string[] = []
		let usedNicknames: string[] = this.players.map(p => p["name"])
		Object.keys(this.colors).forEach((c) => {
			let available = true
			this.players.forEach(p => {
				if (p["color"] === c) {
					available = false
				}
			})
			if (available) {
				availableColors.push(c)
			}
		})
		const dialogRef = this.dialog.open(NewPlayerComponent, {
			width: "300",
			disableClose: false,
			data: {
				nicknames: usedNicknames,
				colors: availableColors,
				charLimit: 3
			}
		})
		dialogRef.afterClosed().subscribe(result => {
			if (typeof result !== "undefined") {
				this.players.push({
					name: result["nickname"],
					color: result["color"],
					score: []
				})
			}
		})
	}
	removePlayer(n) {
		this.players.forEach((p, i) => {
			if (p["name"] === n) {
				this.players.splice(i, 1)
			}
		})
	}
	changeCourse(c) {
		this.course = c
	}
	changeTee(t) {
		this.tee = t
	}
	continueFirebaseChange() {
		this.sessionAvailable = false
		this.sessionId = (<HTMLInputElement>document.getElementById("continueFirebaseCode")).value
		this.sessionList.forEach(s => {
			if (s["sessionId"] === this.sessionId) {
				this.sessionAvailable = true
			}
		})
	}
	continueGame() {
		this.sessionList.forEach(s => {
			if (s["sessionId"] === this.sessionId) {
				this.scorecardService.course = s["course"]
				this.scorecardService.tee = s["tee"]
				this.scorecardService.players = s["players"]
				this.scorecardService.sessionId = s["sessionId"]
				this.router.navigate(['/scorecard'])
			}
		})
	}
	startFirebase() {
		this.sessionService.addSession().then(res => {
			this.newSessionId = res.id
		})
	}
	newGame() {
		this.scorecardService.course = this.course
		this.scorecardService.tee = this.tee
		this.scorecardService.players = this.players
		this.scorecardService.sessionId = this.newSessionId
		this.router.navigate(['/scorecard'])
	}
}
