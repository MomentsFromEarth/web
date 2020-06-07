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
import { MessengerService } from '../../services/messenger/messenger.service';
import { StoreService } from '../../services/store/store.service';
import { StoreActions as Actions } from '../../services/store/store.actions';
import { StoreProps as Props } from '../../services/store/store.props';


@Component({
  selector: 'app-account-profile',
  templateUrl: './account-profile.component.html',
  styleUrls: ['./account-profile.component.scss']
})
export class AccountProfileComponent implements OnInit, OnDestroy {
  profile: any;
  profileAvatar: string;
  profile$: Subscription;

  constructor (
    private changeDectectorRef: ChangeDetectorRef,
    private http: Http, 
    private route: ActivatedRoute, 
    private router: Router,
    private accountService: AccountService,
    private authService: AuthService,
    private gravatarService: GravatarService,
    private storeService: StoreService,
    private loggerService: LoggerService) { }

  ngOnInit () {
    this.profile$ = this.storeService.subscribe(Props.App.Profile, newProfile => {
      this.profile = (newProfile && newProfile.toJS()) || null;
      this.profileAvatar = this.profile && this.displayAvatar(this.profile.avatar) || '';
    });
  }

  ngOnDestroy () {

  }

  displayAvatar (url) {
    return url && this.gravatarService.style(url, 'retro', 300) || '';
  }

}
