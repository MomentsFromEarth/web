import { Component, ElementRef, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as AWS from 'aws-sdk';
import * as jwt_decode from 'jwt-decode';
import validate from 'validate.js';

declare const FB: any;

import { AccountService } from '../../services/account/account.service';
import { AuthService } from '../../services/auth/auth.service';
import { FacebookService } from '../../services/facebook/facebook.service';
import { LoggerService } from '../../services/logger/logger.service';

@Component({
  selector: 'app-account-login',
  templateUrl: './account-login.component.html',
  styleUrls: ['./account-login.component.scss']
})
export class AccountLoginComponent implements OnInit {
  @ViewChild('googleButton') googleButton: ElementRef;

  constructor (
    private changeDectectorRef: ChangeDetectorRef,
    private http: Http, 
    private route: ActivatedRoute, 
    private router: Router,
    private accountService: AccountService,
    private authService: AuthService,
    private facebookService: FacebookService,
    private loggerService: LoggerService
  ) { }

  ngOnInit () {
    setTimeout(() => {
      if (window['GoogleAuth']) {
        window['GoogleAuth'].attachClickHandler(this.googleButton.nativeElement, {}, (googleUser) => { 
          this.loggerService.info('Google Auth click handler attached');
        });
      } else {
        this.loggerService.error('Unable to attach click handler to Google Auth');
      }
    }, 1000);
  }

  onGoogleLoginClick (evt) {
    this.accountService.logout(false);
    return true;
  }

  onFacebookLoginClick (evt) {
    this.accountService.logout(false);
    this.facebookService.login();
    return true;
  }

}
