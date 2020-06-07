import { Injectable } from '@angular/core';
import { CookieService } from 'ng2-cookies';

@Injectable()
export class FacebookService {

  constructor (private cookieService: CookieService) { }

  init () {
    this.ensureLogoutCookieIsRemoved();
  }

  details (): Promise<any> {
    return new Promise ((resolve, reject) => {
      this.ensureLogoutCookieIsRemoved();
      window['FB'].getLoginStatus(response => {
        if (response && response.status === 'connected') {
          window['FB'].api('/me', { fields: "picture.width(2048),email,name" }, data => {
            resolve(data);
          });
        } else {
          resolve(null);
        }
      });
    });
  }

  getToken (): Promise<any> {
    return new Promise((resolve, reject) => {
      window['FB'].getLoginStatus((res) => {
        if (res && res.status === 'connected') {
          resolve(res.authResponse.accessToken);
        } else {
          reject('Facebook not connected');
        }
      });
    });
  }

  authToken (): Promise<any> {
    return new Promise((resolve, reject) => {
      this.getToken().then(res => {
        if (res && res.status === 'connected') {
          resolve(res.authResponse.accessToken);
        } else {
          let counter = 0;
          let attempts = 10;
          let intervalTime = 1000;
          let intervalId = setTimeout(() => {
            counter += 1;
            console.log('FacebookService, attempt to get token, retry number...', counter);
            this.getToken().then(token => {
             if (token) {
                clearInterval(intervalId);
                resolve(token);
              } else {
                if (counter >= attempts) {
                  clearInterval(intervalId);
                  reject('Facebook not connected');
                }
              }
            }).catch(reject);
          }, intervalTime);
        }
      }).catch(reject);
    });
  }

  logout () {
    window['FB'].getLoginStatus((response) => {
      if (response && response.status === 'connected') {
        console.log('Facebook logout');
        window['FB'].logout(() => {
          console.log('Facebook logged out')
        });
      }
    });
  }

  callbackUrl (provider) {
    return location.protocol + "//" + 
           location.hostname + 
           (location.port ? ":"+location.port : "") + 
           "/oauthcallback/" + provider;
  }

  login () {
    var oauth_url = 'https://www.facebook.com/v2.10/dialog/oauth/';
    oauth_url += '?client_id=460765837628870';
    oauth_url += '&redirect_uri=' + encodeURIComponent(this.callbackUrl('facebook'));
    oauth_url += '&scope=public_profile,email';
    oauth_url += '&response_type=token';
    window.location.href = oauth_url;
  }

  deleteCookie (name) {
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  ensureLogoutCookieIsRemoved () {
    this.deleteCookie('fblo_460765837628870');
  }

}
