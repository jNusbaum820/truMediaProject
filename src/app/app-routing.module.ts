import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { PlayersComponent } from './players/players.component';
import { LoadingPlayerComponent } from './loading-player/loading-player.component';

const routes: Routes = [
  { path: '', redirectTo: '/loading', pathMatch: 'full' },
  { path: 'loading', component: LoadingPlayerComponent },
  { path: 'stats/:id', component: PlayerStatsComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}