import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { SettingsService } from '../settings/settings.service';

@Injectable()
export class ApiService {

  constructor (
    protected _http: Http,
    protected _settingsService: SettingsService
  ) { }

  url (path, opts?) {
    let mfeHost = this._settingsService.env('mfeHost') || 'api';
    let mfeDomain = this._settingsService.env('mfeDomain') || 'momentsfrom.earth';
    let mfeProtocol = this._settingsService.env('mfeProtocol') || 'https';

    if (opts && opts.host) { 
      mfeHost = opts.host;
      delete opts.host;
    }
    if (opts && opts.domain) { 
      mfeDomain = opts.domain;
      delete opts.domain;
    }
    if (opts && opts.protocol) { 
      mfeProtocol = opts.protocol;
      delete opts.protocol;
    }

    let template = `${mfeProtocol}://${mfeHost}.${mfeDomain}${path}`;

    // clone the input opts so we can use it for scratch work
    let workingOpts = Object.assign({}, opts);
    let templateVars = template.match(/:[^\/$\?\#\&]+/g);

    if (templateVars) {
      // perform the var substitution from the opts object
      for (let v of templateVars) {
        let varName = v.substr(1);
        template = template.replace(v, workingOpts[varName] || '');
        delete workingOpts[varName];
      };
    }

    template = this.removeTrailingSlash(template);

    // find the options that weren't used in the variable substitution
    let params = Object.keys(workingOpts);

    // now add on the parameters to the query string
    if (params.length > 0) {
      if (template.includes('?')) {
        template += '&';
      } else {
        template += '?';
      }

      for (let _i = 0; _i < params.length; ++_i) {
        let v = params[_i];
        template += `${v}=${opts[v]}`;
        if (_i !== params.length - 1) template += '&';
      }
    }

    return template;
  }

  removeTrailingSlash(url) {
    while (url[url.length - 1] === '/') {
      url = url.substr(0, url.length - 1);
    }

    // if there's a query string, remove slashes preceding that
    let _i = url.indexOf('?') - 1;
    while (_i >= 0 && url[_i] === '/') {
      url = url.substr(0, _i) + url.substr(_i + 1);
    }
    
    return url;
  }

  get (url, opts?: RequestOptions): Promise<any> {
    return this._http.get(url, this.apiOpts(opts)).toPromise();
  }

  post (url, body, opts?: RequestOptions): Promise<any> {
    return this._http.post(url, body, this.apiOpts(opts)).toPromise();
  }

  put (url, body, opts?: RequestOptions): Promise<any> {
    return this._http.put(url, body, this.apiOpts(opts)).toPromise();
  }

  delete (url, opts?: RequestOptions): Promise<any> {
    return this._http.delete(url, this.apiOpts(opts)).toPromise();
  }

  jsonHeaders () {
    return new Headers({
      'Content-Type': 'application/json;charset=UTF-8'
    });
  }

  private requestOptions () {
    return new RequestOptions();
  }

  private headers () {
    return new Headers();
  }

  private ensureOptsExist (opts?: RequestOptions): RequestOptions {
    if (!opts) opts = this.requestOptions();
    if (!opts.headers) opts.headers = this.headers();
    return opts;
  }

  private apiOpts (opts?: RequestOptions): RequestOptions {
    opts = this.ensureOptsExist(opts);
    return opts;
  }

}
