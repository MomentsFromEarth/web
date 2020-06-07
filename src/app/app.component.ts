import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

import { AccountService } from './services/account/account.service';
import { AuthService } from './services/auth/auth.service';
import { GravatarService } from './services/gravatar/gravatar.service';
import { LoggerService } from './services/logger/logger.service';
import { MessengerService } from './services/messenger/messenger.service';
import { StoreService } from './services/store/store.service';
import { StoreActions as Actions } from './services/store/store.actions';
import { StoreProps as Props } from './services/store/store.props';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  login$: Subscription;

  profile: any;
  profileAvatar: string;
  profile$: Subscription;
  showProfileDropdown: boolean;

  constructor (
    private accountService: AccountService,
    private authService: AuthService,
    private gravatarService: GravatarService,
    private loggerService: LoggerService,
    private messengerService: MessengerService,
    private router: Router,
    private storeService: StoreService
  ) {}

  ngOnInit () {
    this.showProfileDropdown = false;
    this.storeService.init();
    this.accountService.init();
    this.setupSubscriptions();
    if (!this.skipLogin()) this.login(false);
  }

  ngOnDestroy () {
    this.teardownSubscriptions();
  }

  skipLogin (): boolean {
    return (this.getQueryVariable(this.urlHash(), 'id_token') || this.getQueryVariable(this.urlHash(), 'access_token')) 
           ? true : false;
  }

  displayAvatar (url) {
    return url && this.gravatarService.style(url, 'retro', 50) || '';
  }

  urlHash () {
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

  setupSubscriptions () {
    this.login$ = this.messengerService.subscribe('login', this.login.bind(this));
    this.profile$ = this.storeService.subscribe(Props.App.Profile, newProfile => {
      this.profile = (newProfile && newProfile.toJS()) || null;
      this.profileAvatar = this.profile && this.displayAvatar(this.profile.avatar) || '';
    });
  }

  teardownSubscriptions () {
    this.login$.unsubscribe();
    this.profile$.unsubscribe();
  }

  login (createAccount: boolean) {
    this.authService.login().then(authData => {
      if (authData) {
        this.accountService.getProfile(authData).then(profile => {
          this.setProfile(profile, createAccount);
        }).catch(err => {
          if (this.profileDoesNotExistAndWeShouldCreateOne(err, createAccount)) {
            this.loggerService.info('Profile does not exist and we should create one', err);
            this.router.navigate(['account/create']);
          } else {
            this.loggerService.error('Profile Get Error', err);
            this.authService.logout();
            if (createAccount) this.router.navigate(['account/login']);
          }
        });
      }
    }).catch(err => {
      this.loggerService.error('Auth Credentials Error', err);
      if (createAccount) this.router.navigate(['account/login']);
    });
  }

  logout (evt) {
    if (evt) evt.preventDefault();
    this.showProfileDropdown = false;
    this.accountService.logout(true);
    this.router.navigate(['']);
    return false;
  }

  profileDoesNotExistAndWeShouldCreateOne (err, createAccount) {
    let message = err && err.json() && err.json().message;
    return err &&
           err.status === 404 &&
           message === 'profile_does_not_exist' &&
           createAccount ? true : false;
  }

  setProfile (profile, createAccount) {
    this.loggerService.info('Profile Set', profile);
    this.storeService.dispatch(Actions.Init.Profile, profile);
    if (createAccount) this.router.navigate(['']);
  }

}
