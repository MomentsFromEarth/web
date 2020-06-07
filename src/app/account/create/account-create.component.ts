import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import * as AWS from 'aws-sdk';
import * as jwt_decode from 'jwt-decode';
import validate from 'validate.js';

declare const FB: any;

import { AccountService } from '../../services/account/account.service';
import { AuthService } from '../../services/auth/auth.service';
import { GravatarService } from '../../services/gravatar/gravatar.service';
import { LoggerService } from '../../services/logger/logger.service';
import { StoreService } from '../../services/store/store.service';
import { StoreActions as Actions } from '../../services/store/store.actions';


@Component({
  selector: 'app-account-create',
  templateUrl: './account-create.component.html',
  styleUrls: ['./account-create.component.scss']
})
export class AccountCreateComponent implements OnInit {

  userEmail: string;
  userName: string;
  userGravatar: string;

  userEmailValidation: any = null;
  userNameValidation: any = null;

  loadingDetails: boolean;

  constructor (
    private changeDectectorRef: ChangeDetectorRef,
    private http: Http, 
    private route: ActivatedRoute, 
    private router: Router,
    private accountService: AccountService,
    private authService: AuthService,
    private gravatarService: GravatarService,
    private loggerService: LoggerService,
    private storeService: StoreService
  ) { }

  ngOnInit() {
    this.loadingDetails = true;
    this.userGravatar = this.gravatarService.url('');
    setTimeout(() => {
      this.accountService.details().then(details => {
        if (details) {
          this.userEmail = details['email'];
          this.userName = details['name'] || this.nameFromEmail(this.userEmail)
          this.userGravatar = this.displayGravatar(this.userEmail);
          let emailValidation = this.validateEmail(this.userEmail);
          this.userEmailValidation = emailValidation ? false : true;
        }
        this.loadingDetails = false;
      });
    }, 1000);
  }

  nameFromEmail (email) {
    return (email && email.split('@')[0]) || null;
  }

  userData () {
    return {
      email: this.userEmail,
      name: this.userName,
      avatar: this.gravatarService.url(this.userEmail)
    };
  }

  createAccount () {
    if (this.validateFields()) {
      this.accountService.createProfile(this.userData()).then(profile => {
        console.log('Account Profile created', profile);
        this.storeService.dispatch(Actions.Init.Profile, profile);
        this.returnToRoot();
      }).catch(err => {
        this.loggerService.error('AccountCreate', 'error creating profile', err);
        this.authService.logout(false);
        this.returnToLogin();
      });
    }
  }

  displayGravatar (email) {
    let url = this.gravatarService.url(email);
    return this.gravatarService.style(url, 'retro', 200);
  }

  onEmailChange (email) {
    return this.displayGravatar(email);
  }

  returnToRoot () {
    window.location.href = "/?nocache=" + (new Date()).getTime();
  }

  returnToLogin () {
    window.location.href = "/account/login?nocache=" + (new Date()).getTime();
  }

  validateFields () {
    let nameValidation = this.validateName(this.userName);
    this.userNameValidation = nameValidation ? false : true;

    let emailValidation = this.validateEmail(this.userEmail);
    this.userEmailValidation = emailValidation ? false : true;

    return (this.userNameValidation && this.userEmailValidation) ? true : false;
  }

  blank (str) {
    return !str || !str.length || str.trim().length === 0;
  }

  validateEmail (email: string) {
    let constraints = { email: { email: true, presence: true} };
    return validate({ email: email }, constraints);
  }

  emailIsValid (email: string): boolean {
    return !this.validateEmail(email) ? true : null;
  }

  validateName (name: string) {
    let constraints = { 
      name: { 
        presence: true,
        format: {
          pattern: "[a-z 0-9]+",
          flags: "i",
          message: "should contain alphanumeric characters and spaces only"
        }
      } 
    };
    return validate({ name: name }, constraints);
  }

}
