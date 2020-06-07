import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';

@Injectable()
export class CognitoService {
  providerLoginMap = {
    google: 'accounts.google.com',
    facebook: 'graph.facebook.com'
  };
  region: string = 'us-east-1';
  userIdentityPool: string = 'us-east-1:4fc54d30-cfa8-44d2-8ef8-338a206e1cba';
  fetchDelay: number = 250;

  constructor () { }

  fetchCredentials (authProvider, authToken) {
    return new Promise((resolve, reject) => {
      this.clearCredentialCache();
      AWS.config.region = this.region;
      AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: this.userIdentityPool,
        Logins: this.loginsMap(authProvider, authToken)
      });
      AWS.config.credentials['get']((err) => {
        if (err) return reject(err);
        setTimeout(() => resolve(this.awsCreds()), this.fetchDelay);
      });
    });
  }

  clearCredentialCache () {
    if (AWS.config.credentials && AWS.config.credentials['clearCachedId']) AWS.config.credentials['clearCachedId']();
  }

  awsCreds () {
    let accessKeyId = AWS.config.credentials.accessKeyId;
    let secretAccessKey = AWS.config.credentials.secretAccessKey;
    let sessionToken = AWS.config.credentials.sessionToken;
    let identityId = AWS.config.credentials['identityId'];

    if (!accessKeyId || !secretAccessKey || !sessionToken || !identityId) return null;

    return {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
      sessionToken: sessionToken,
      identityId: identityId
    };
  }

  loginsMap (authProvider, authToken) {
    let logins = {};
    logins[this.providerLoginMap[authProvider]] = authToken;
    return logins;
  }

}
