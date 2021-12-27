import { NgModule } from '@angular/core'
import { Routes, RouterModule } from '@angular/router'
import { SetupComponent } from './setup/setup.component'
import { ScorecardComponent } from './scorecard/scorecard.component'


const routes: Routes = [
	{
		path: "setup",
		component: SetupComponent
	},
	{
		path: "scorecard",
		component: ScorecardComponent
	},
	{
		path: "**",
		redirectTo: "setup"
	}
]

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
