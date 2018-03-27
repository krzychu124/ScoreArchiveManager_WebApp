import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { OrchestraComponent } from './orchestra/orchestra.component';
import { ScoresComponent } from './scores/scores.component';
import { ScoreBookTitlesComponent } from './score-book-titles/score-book-titles.component';
import { ScoreTitlesComponent } from './score-titles/score-titles.component';
import { InstrumentsComponent } from './instruments/instruments.component';
import { ScoreBooksComponent } from '@app/score-books/score-books.component';
import { StorageManagerComponent } from '@app/storage-manager/storage-manager.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent, pathMatch: 'full' },
  {
    path: 'dashboard', component: DashboardComponent,
    children: [
      { path: 'scores', component: ScoresComponent },
      { path: 'score-books', component: ScoreBooksComponent },
      { path: 'score-book-titles', component: ScoreBookTitlesComponent },
      { path: 'score-titles', component: ScoreTitlesComponent },
      { path: 'instruments', component: InstrumentsComponent },
      { path: 'storage', component: StorageManagerComponent }      
    ]
  },
  { path: 'band', component: DashboardComponent },
  { path: 'orchestra', component: OrchestraComponent },
  {
    path: 'admindashboard', component: DashboardComponent,
    children: [
      { path: 'scores', component: ScoresComponent },
      { path: 'score-books', component: ScoreBooksComponent },
      { path: 'score-book-titles', component: ScoreBookTitlesComponent },
      { path: 'score-titles', component: ScoreTitlesComponent },
      { path: 'instruments', component: InstrumentsComponent },
      { path: 'storage', component: StorageManagerComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
