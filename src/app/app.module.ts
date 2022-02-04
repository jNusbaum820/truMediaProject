import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PlayersComponent } from './players/players.component';
import { PlayerStatsComponent } from './player-stats/player-stats.component';
import { LoadingPlayerComponent } from './loading-player/loading-player.component';

import { NgChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    AppComponent,
    PlayersComponent,
    PlayerStatsComponent,
    LoadingPlayerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
