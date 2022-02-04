import { Component, OnInit } from '@angular/core';
import { makeStateKey } from '@angular/platform-browser';
import { AuthToken } from './authToken';
import { AuthTokenService } from './auth-token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = "Josiah Nusbaum's TruMedia Networks Interview Project";
  authToken: AuthToken = {
    token: '',
    expires: ''
  };
  test = "";

  constructor(private authTokenService: AuthTokenService) {}

  ngOnInit(): void {
      this.getAuthToken();
  }

  getAuthToken(): void{
    this.authTokenService.getTempToken()
    .subscribe(authToken => {console.log(authToken.token), 
      this.authToken = authToken, 
      localStorage.setItem('authToken', authToken.token)});
  }
}