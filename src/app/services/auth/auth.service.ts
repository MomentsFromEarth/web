import { Injectable } from '@angular/core';
import { CognitoService } from '../cognito/cognito.service';
import { LoggerService } from '../logger/logger.service';
import { StoreService } from '../store/store.service';
import { FacebookService } from '../facebook/facebook.service';
import { GoogleService } from '../google/google.service';

@Injectable()
export class AuthService {
  private authKey: string = 'auth';
  private tokenKey: string = 'token';
  private tokenDelimiter: string = ':';

  private providers: any;

  constructor (
    private cognitoService: CognitoService,
    private facebookService: FacebookService,
    private googleService: GoogleService,
    private loggerService: LoggerService,
    private storeService: StoreService
  ) { }

  init () {
    this.initProviders();
  }

  initProviders () {
    this.providers = { facebook: this.facebookService, google: this.googleService };
    Object.keys(this.providers).map(key => this.providers[key].init());
  }

  login (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authToken().then(token => {
        if (token) {
          let provider = this.getProvider();
          this.loggerService.info('AuthService', 'Login Provider Token', provider, token);
          this.cognitoService.fetchCredentials(provider, token).then(creds => {
            this.loggerService.info('AuthService', 'Login Creds', creds);
            resolve(creds);
          }).catch(err => {
            this.loggerService.error('AuthService', 'Login Error', err);
            reject(err);
          });
        } else {
          this.loggerService.error('AuthService', 'Provider Token not found');
          reject(null);
        }
      }).catch(reject);
    });
  }

  logout (alsoProviders = true) {
    if (alsoProviders) Object.keys(this.providers).map(key => this.providers[key].logout());
    this.clearData();
  }

  details () {
    return new Promise((resolve, reject) => {
      let provider = this.getProvider();
      if (provider) {
        this.providers[provider].details().then(resolve).catch(reject);
      } else {
        reject('No auth provider found');
      }
    });
  }

  authToken () {
    return new Promise((resolve, reject) => {
      let key = this.getProvider();
      if (key) {
        this.providers[key].authToken().then(resolve).catch(reject);
      } else {
        reject(null);
      }
    });
  }

  getProvider () {
    this.loggerService.info('AuthService', 'Getting Provider');
    return this.getData();
  }

  setProvider (provider) {
    this.loggerService.info('AuthService', 'Setting Provider', provider);
    this.clearData();
    this.setData(provider);
  }

  getData () {
    return this.storeService.local.get(this.authKey) || null;
  }

  setData (data) {
    this.storeService.local.set(this.authKey, data);
  }

  clearData () {
    this.storeService.local.remove(this.authKey);
  }

}
