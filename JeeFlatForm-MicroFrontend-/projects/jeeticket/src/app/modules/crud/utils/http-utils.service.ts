import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ITableState } from '../../../pages/jeeticket/_models/table.model';
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

  public getAuthFromLocalStorage(): any {

    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }
  getToken() {
    const access_token = this.cookieService.get(KEY_SSO_TOKEN) + this.cookieService.get(KEY_SSO_TOKEN_2);    // console.log("access_token", access_token)
    if (access_token) {
      return access_token
    }
    else {
      const dt = this.getAuthFromLocalStorage();
      const tokenlocal = dt.access_token;
      // console.log("tokenlocal", tokenlocal)
      return tokenlocal
    }

  }
  getHTTPHeaders(version: any = '1.0'): HttpHeaders {
    const access_token = this.getToken();
    let result = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'TimeZone': (new Date()).getTimezoneOffset().toString(),
      'x-api-version': `${version}`,
    });
    return result;
  }
  getHTTPHeadersWW(): HttpHeaders {
    const access_token = this.getToken();
    let result = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${access_token != null ? access_token : ''}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'TimeZone': (new Date()).getTimezoneOffset().toString()
    });
    return result;
  }
  getFindHTTPParamsITableState(tableState: ITableState, more: boolean = false): HttpParams {
    let params = new HttpParams()
      //.set('filter',  queryParams.filter )
      .set('sortOrder', tableState.sorting.direction)
      .set('sortField', tableState.sorting.column)
      .set('page', tableState.paginator.page.toString())
      .set('record', tableState.paginator.pageSize.toString());
    let keys = [],
      values = [];
    if (more) {
      params = params.append('more', 'true');
    }
    Object.keys(tableState.filter).forEach(function (key) {
      if (typeof tableState.filter[key] !== 'string' || tableState.filter[key] !== '') {
        keys.push(key);
        values.push(tableState.filter[key]);
      }
    });
    if (tableState.searchTerm) {
      keys.push('keyword');
      values.push(tableState.searchTerm);
    }
    if (keys.length > 0) {
      params = params.append('filter.keys', keys.join('|')).append('filter.vals', values.join('|'));
    }
    return params;
  }
  getHttpHeaderFiles() {

    const token = this.getToken();
    let result = new HttpHeaders({
      'Authorization': 'Bearer ' + token,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return result;
  }
}
