import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AuthToken } from './authToken';

@Injectable({
  providedIn: 'root'
})
export class AuthTokenService {

  constructor(private http: HttpClient) { }

  private tokenUrl = 'https://project.trumedianetworks.com/api/token';
  private httpOptions = {
    headers: new HttpHeaders({"accept": "application/json", "apiKey": "fa0d8c63-cb8b-414f-8d0a-b7f5a7cbb967"})
  }

  getTempToken(): Observable<AuthToken> {
    return this.http.get<AuthToken>(this.tokenUrl, this.httpOptions);
  }
}