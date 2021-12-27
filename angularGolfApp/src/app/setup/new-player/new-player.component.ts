import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
	selector: 'app-new-player',
	templateUrl: './new-player.component.html',
	styleUrls: ['./new-player.component.css']
})
export class NewPlayerComponent implements OnInit {
	maxLength: number = 3
	playerData = {
		nickname: "",
		color: "",
	}
	colors: string[] = []
	playerForm: FormGroup

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogRef:MatDialogRef<NewPlayerComponent>
	) { }
	ngOnInit(): void {
		this.maxLength = this.data["charLimit"]
		this.colors = this.data["colors"] ? this.data["colors"] : []
		let usedNicknames: string = "^("
		if (this.data["nicknames"].length > 0) {
			this.data["nicknames"].forEach((n, i) => {
				usedNicknames += `(?!\\b${n}\\b)`
				if (i >= this.data["nicknames"].length - 1) {
					usedNicknames += ".)*$"
				}
			})
		}
		else {
			usedNicknames = ""
		}
		this.playerForm = new FormGroup({
			"nickname": new FormControl(this.playerData.nickname, [
				Validators.required,
				Validators.maxLength(this.maxLength),
				Validators.minLength(1),
				Validators.pattern(new RegExp(usedNicknames))
			]),
			"color": new FormControl(this.playerData.color, [
				Validators.required,
				Validators.minLength(1)
			])
		})
	}
	submitDialog() {
		this.playerData.nickname = this.playerForm.get("nickname").value
		this.playerData.color = this.playerForm.get("color").value
		this.dialogRef.close(this.playerData)
	}
	nicknameChange(e) {
		if (/[^A-Z]/g.test(e)) {
			this.playerForm.setValue({
				"nickname": e.toUpperCase().replace(/[^A-Z]/g, "").slice(0, this.maxLength),
				"color": this.playerForm.get("color").value
			})
		}
	}

}
