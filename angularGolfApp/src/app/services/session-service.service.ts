import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Session } from '../interfaces/session';

@Injectable({
	providedIn: 'root'
})
export class SessionServiceService {

	constructor(
		private af: AngularFirestore
	) { }

	getSessions(): Observable<Session[]> {
		return this.af.collection<Session>("sessions").valueChanges()
	}
	addSession(): Promise<DocumentReference> {
		return this.af.collection("sessions").add({})
	}
	editSession(sessionId: string, newValue: Session): void {
		this.af.collection("sessions").doc(sessionId).set(newValue)
	}
}
