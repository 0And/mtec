import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { SetupComponent } from './setup/setup.component';
import { ScorecardComponent } from './scorecard/scorecard.component';
import { NewPlayerComponent } from './setup/new-player/new-player.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input'
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select'
import { HttpClientModule } from '@angular/common/http';
import { MatListModule } from '@angular/material/list';
import { AddArrayPipe } from './pipes/add-array.pipe';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
	declarations: [
		AppComponent,
		SetupComponent,
		ScorecardComponent,
		NewPlayerComponent,
		AddArrayPipe
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		BrowserAnimationsModule,
		MatCardModule,
		MatButtonModule,
		MatButtonToggleModule,
		MatDividerModule,
		MatIconModule,
		MatDialogModule,
		MatInputModule,
		FormsModule,
		ReactiveFormsModule,
		MatSelectModule,
		HttpClientModule,
		MatListModule,
		AngularFireModule.initializeApp(environment.firebase),
		AngularFirestoreModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
