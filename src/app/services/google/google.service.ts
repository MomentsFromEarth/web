import { Injectable } from '@angular/core';

@Injectable()
export class GoogleService {

  constructor() { }

  init () {
  }

  gapi () {
    return window['gapi'];
  }

  getProfile () {
    let ga = this.googleAuth();
    return (ga && ga.currentUser && ga.currentUser.get() && ga.currentUser.get().getBasicProfile()) || null;
  }

  getAuthResponse () {
    let ga = this.googleAuth();
    return (ga && ga.currentUser && ga.currentUser.get() && ga.currentUser.get().getAuthResponse()) || null;
  }

  details (): Promise<any> {
    return new Promise ((resolve, reject) => {
      let profile = this.getProfile();
      if (profile) {
        resolve({
          email: profile.getEmail(),
          name: profile.getName()
        });
      } else {
        resolve(null);
      }
    });
  }

  authToken (): Promise<any> {
    return new Promise((resolve, reject) => {
      let token = this.getToken();
      if (token) {
        resolve(token);
      } else {
        let counter = 0;
        let attempts = 10;
        let intervalTime = 1000;
        let intervalId = setInterval(() => {
          counter += 1;
          console.log('GoogleService, attempt to get token, retry number...', counter);
          let token = this.getToken();
          if (token) {
            clearInterval(intervalId);
            resolve(token);
          } else {
            if (counter >= attempts) {
              clearInterval(intervalId);
              reject('Google not connected');
            }
          }
        }, intervalTime);
      }
    });
  }

  googleAuth () {
    return window['GoogleAuth'];
  }

  logout () {
    let ga = this.googleAuth();
    if (ga && ga.isSignedIn.get()) {
      console.log('Google logout');
      ga.signOut().then(() => {
        console.log('Google logged out');
      });
    }
  }

  private getToken () {
    let auth = this.getAuthResponse();
    return auth ? auth.id_token : null;
  }

}
