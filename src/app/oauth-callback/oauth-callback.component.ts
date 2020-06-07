import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Router } from '@angular/router';

import { AuthService } from '../services/auth/auth.service';
import { LoggerService } from '../services/logger/logger.service';
import { MessengerService } from '../services/messenger/messenger.service';

@Component({
  selector: 'app-oauth-callback',
  templateUrl: './oauth-callback.component.html',
  styleUrls: ['./oauth-callback.component.scss']
})
export class OAuthCallbackComponent implements OnInit, OnDestroy {
  params$: Subscription;
  fetchingDetails: boolean;

  constructor (
    private authService: AuthService,
    private loggerService: LoggerService,
    private messengerService: MessengerService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit () {
    this.fetchingDetails = true;
    this.params$ = this.route.params.subscribe(params => {
      let provider = params['provider'];
      if (provider === 'google') {
        this.processGoogleCallback();
      } else if (provider === 'facebook') {
        this.processFacebookCallback();
      }
      this.messengerService.send('login', true);
    });
  }

  ngOnDestroy () {
    this.fetchingDetails = false;
    this.params$.unsubscribe();
  }

  private processGoogleCallback () {
    let idToken = this.getQueryVariable(this.urlHash(), 'id_token');
    if (idToken) this.authService.setProvider('google');
  }

  private processFacebookCallback () {
    let accessToken = this.getQueryVariable(this.urlHash(), 'access_token');
    if (accessToken) this.authService.setProvider('facebook');
  }

  private urlHash () {
    return window.location.hash.substr(1);
  }

  getQueryVariable (query, variable) {
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i += 1) {
      let pair = vars[i].split("=");
      if (pair[0] === variable) { return pair[1]; }
    }
    return false;
  }

}
