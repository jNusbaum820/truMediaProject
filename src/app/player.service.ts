import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { Player } from './player';
import { Stats } from './stats';
import { AuthTokenService } from './auth-token.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  constructor(private http: HttpClient) { }

  private getPlayersUrl = 'https://project.trumedianetworks.com/api/mlb/players';
  private playerUrl = 'https://project.trumedianetworks.com/api/mlb/player/';
  private retrievedObj = localStorage.getItem('authToken')!;
  private authToken = this.retrievedObj;

  private httpOptions = {
    headers: new HttpHeaders({
      "accept": "application/json",
      "tempToken": this.authToken
    })
  }

  getPlayers(): Observable<Player[]> {
    console.log("Token " + this.retrievedObj);
    return this.http.get<Player[]>(this.getPlayersUrl, this.httpOptions);
  }

  getPlayerStats(playerId: number): Observable<Stats[]>{
    console.log("ID: " + playerId);
    return this.http.get<Stats[]>(this.playerUrl + playerId, this.httpOptions);
  }
}