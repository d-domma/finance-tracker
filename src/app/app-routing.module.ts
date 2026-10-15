import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BotComponent } from './bot/bot.component';
import { HomeComponent } from './home/home.component';
import { OrganizerComponent } from './organizer/organizer.component';
import { TrackComponent } from './track/track.component';
import { TrendsComponent } from './trends/trends.component';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './signup/signup.component';
import { LogoutComponent } from './logout/logout.component';
import { KidsModeComponent } from './kids/kids-mode.component'; // ✅ Corrected Import

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }, // Ensures correct redirect
  { path: 'bot', component: BotComponent },
  { path: 'organizer', component: OrganizerComponent },
  { path: 'track', component: TrackComponent },
  { path: 'trends', component: TrendsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'logout', component: LogoutComponent },
  { path: 'kids-mode', component: KidsModeComponent }, // ✅ Updated to match your file name
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })], // ✅ Optimized for deployment
  exports: [RouterModule]
})
export class AppRoutingModule {}
