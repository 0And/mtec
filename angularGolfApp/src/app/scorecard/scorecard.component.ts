import { Component, OnInit } from '@angular/core';
import { GolfCoursesApiService } from '../services/golf-courses-api.service';
import { ScorecardService } from '../services/scorecard.service';
import { Router } from '@angular/router';
import { Player } from '../interfaces/player';
import { SessionServiceService } from '../services/session-service.service'

@Component({
	selector: 'app-scorecard',
	templateUrl: './scorecard.component.html',
	styleUrls: ['./scorecard.component.css']
})
export class ScorecardComponent implements OnInit {
	firebaseCode = ""
	players: Player[] = []
	scorecard: object = {}
	tee: string = ""
	name: string = ""
	colors: object = {
		"Black": "#333333",
		"Blue": "#3c5591",
		"Red": "#913c3c",
		"Yellow": "#c1ba47",
		"Green": "#3b5f41"
	}
	par = []
	yards = []
	hcp = []
	showFinal: boolean = true

	constructor(
		public golfCoursesApiService: GolfCoursesApiService,
		public scorecardService: ScorecardService,
		private router: Router,
		public sessionService: SessionServiceService
	) { }

	ngOnInit(): void {
		if (this.scorecardService.scorecardReady()) {
			this.firebaseCode = this.scorecardService.sessionId
			this.tee = this.scorecardService.tee
			this.players = this.scorecardService.players
			this.players.forEach(p => {
				if (p["score"].length < 18) {
					p["score"] = Array(18).fill(0)
				}
			})
			this.scorecardService.getScorecard().subscribe(data => {
				this.scorecard = data["data"] ? data["data"] : data
				this.name = this.scorecard["name"]
				this.scorecard["holes"].forEach(hole => {
					hole["teeBoxes"].forEach(tee => {
						if (tee["teeType"].toLowerCase() == this.tee.toLowerCase()) {
							this.par.push(tee["par"])
							this.yards.push(tee["yards"])
							this.hcp.push(tee["hcp"])
						}
					})
				})
			})
		}
		else {
			this.router.navigate(["/setup"])
		}
		if (this.scorecardService.sessionId !== "") {
			this.sessionService.editSession(this.scorecardService.sessionId, {
				sessionId: this.scorecardService.sessionId,
				players: this.scorecardService.players,
				course: this.scorecardService.course,
				tee: this.scorecardService.tee
			})
		}
	}
	exitGame() {
		this.router.navigate(["/setup"])
	}
	addArray(a) {
		let num: number = 0
		a.forEach(e => num += Number(e))
		return num
	}
	checkInput(id, e) {
		(<HTMLInputElement>document.getElementById(id)).value = e <= 0 ? 0 : e
		if (this.scorecardService.sessionId !== "") {
			this.sessionService.editSession(this.scorecardService.sessionId, {
				sessionId: this.scorecardService.sessionId,
				players: this.scorecardService.players,
				course: this.scorecardService.course,
				tee: this.scorecardService.tee
			})
		}
		//console.log(this.players)
	}
	isComplete(scoreArray) {
		let complete = true
		scoreArray.forEach(e => {
			if (e <= 0) {
				complete = false
			}
		})
		return complete
	}
	hideFinal(val) {
		this.showFinal = val ? !val : false
	}

}
