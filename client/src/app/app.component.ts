import { Component, OnInit } from '@angular/core';

import {AuthService} from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'vehicles-app';

  constructor(private auth: AuthService) {}

  loggedIn() {
  	return this.auth.loggedIn;
  }

  logout(){
    this.auth.logout();
  }
  ngOnInit() {

  }
}
