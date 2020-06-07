import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';

import { ApiService } from '../api/api.service';
import { AuthService } from '../auth/auth.service';
import { LoggerService } from '../logger/logger.service';
import { SettingsService } from '../settings/settings.service';
import { StoreService } from '../store/store.service';
import { StoreActions as Actions } from '../store/store.actions';
import { StoreProps as Props } from '../store/store.props';

@Injectable()
export class MomentService extends ApiService {

  constructor (private authService: AuthService, private loggerService: LoggerService, _http: Http, _settingsService: SettingsService, private storeService: StoreService) { 
    super(_http, _settingsService);
  }

  add (moment): Promise<any> {
    return new Promise((resolve, reject) => {
      this.loggerService.info('MomentService', 'Add Moment', moment);
      this.authService.login().then(awsCreds => {

        let url = this.addMomentUrl();
        let body = this.apiBody(moment, awsCreds);
        let opts = this.momentOptions({ headers: this.jsonHeaders() });

        this.post(url, body, opts).then(res => {
          let profile = res.json();
          this.loggerService.info('MomentService', 'Add Moment Success', profile);
          resolve(profile);
        }).catch(reject);

      }).catch(reject);
    });
  }

  apiBody (data, auth) {
    return {
      data: data,
      auth: auth
    }
  }

  private momentOptions (opts) {
    return new RequestOptions(opts);
  }

  addMomentUrl () {
    return this.url(this._settingsService.app('addMoment'));
  }

}
