import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
const KEY_SSO_TOKEN = 'sso_token';
const KEY_SSO_TOKEN_2 = 'sso_token_2';
@Injectable({
  providedIn: 'root',
})
export class HttpUtilsService {
  constructor(private cookieService: CookieService) { }
  getFindHTTPParams(queryParams): HttpParams {
    let params = new HttpParams()
      //.set('filter',  queryParams.filter )
      .set('sortOrder', queryParams.sortOrder)
      .set('sortField', queryParams.sortField)
      .set('page', (queryParams.pageNumber + 1).toString())
      .set('record', queryParams.pageSize.toString());
    let keys = [],
      values = [];
    if (queryParams.more) {
      params = params.append('more', 'true');
    }
    Object.keys(queryParams.filter).forEach(function (key) {
      if (typeof queryParams.filter[key] !== 'string' || queryParams.filter[key] !== '') {
        keys.push(key);
        values.push(queryParams.filter[key]);
      }
    });
    if (keys.length > 0) {
      params = params.append('filter.keys', keys.join('|')).append('filter.vals', values.join('|'));
    }
    return params;
  }

  parseFilter(data) {
    var filter = {
      keys: '',
      vals: '',
    };
    let keys = [],
      values = [];
    Object.keys(data).forEach(function (key) {
      if (typeof data[key] !== 'string' || data[key] !== '') {
        keys.push(key);
        values.push(data[key]);
      }
    });
    if (keys.length > 0) {
      filter.keys = keys.join('|');
      filter.vals = values.join('|');
    }
    return filter;
  }

  // getToken()
  // { const access_token = this.cookieService.get(KEY_SSO_TOKEN);
  //   return access_token
  // }
  public getAuthFromLocalStorage(): any {

    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }
  getToken() {
    const access_token = this.cookieService.get(KEY_SSO_TOKEN) + this.cookieService.get(KEY_SSO_TOKEN_2);
    if (access_token) {
      return access_token
    }
    else {
      const dt = this.getAuthFromLocalStorage();
      const tokenlocal = dt.access_token;
      return tokenlocal
    }

  }
  // getHTTPHeaders(): HttpHeaders {
  //   const access_token = this.getToken();
  //   let result = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     Authorization: `Bearer ${access_token}`,
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Headers': 'Content-Type',
  //     'TimeZone': (new Date()).getTimezoneOffset().toString()
  //   });
  //   return result;
  // }
  getHTTPHeaders(): HttpHeaders {
    const access_token = this.getToken();
    let result = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'TimeZone': (new Date()).getTimezoneOffset().toString()
    });
    return result;
  }
}
