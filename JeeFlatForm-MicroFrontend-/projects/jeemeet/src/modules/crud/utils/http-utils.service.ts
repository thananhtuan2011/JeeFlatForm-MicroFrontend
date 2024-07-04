import { Injectable } from '@angular/core';
import { HttpParams, HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { ITableState } from 'projects/jeemeeting/src/app/page/share/models/table.model';
import jwt_decode from 'jwt-decode';
const KEY_SSO_TOKEN = 'sso_token';
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
      .set('pageNumber', (queryParams.pageNumber + 1).toString())
      .set('pageSize', queryParams.pageSize.toString());
    let keys = [], values = [];
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

  getFindHTTPParamsV2(queryParams): HttpParams {
    let params = new HttpParams()
      //.set('filter',  queryParams.filter )
      .set('sortOrder', queryParams.sortOrder)
      .set('sortField', queryParams.sortField)
      .set('pageNumber', (queryParams.pageNumber + 1).toString())
      .set('pageSize', queryParams.pageSize.toString());
    let keys = [], values = [];
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
      params = params.append('filter.keys', keys.join('|'))
        .append('filter.vals', values.join('|'));
    }
    return params;
  }

  parseFilter(data) {
    let keys = [], values = [];
    let params = new HttpParams()
    Object.keys(data).forEach(function (key) {
      if (typeof data[key] !== 'string' || data[key] !== '') {
        keys.push(key);
        values.push(data[key]);
      }
    });
    if (keys.length > 0) {
      params = params.append('filter.keys', keys.join('|'))
        .append('filter.vals', values.join('|'));
    }
    return params;
  }
  public getAuthFromLocalStorage(): any {

    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }
  getToken() {
    const access_token = this.cookieService.get(KEY_SSO_TOKEN);
    // console.log("access_token", access_token)
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

  getHTTPHeaders_FormData(): HttpHeaders {
    const auth = this.getAuthFromLocalStorage();
    let result = new HttpHeaders({
      'Accept': 'application/json',
      Authorization: `Bearer ${auth.access_token}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Accept',
    });
    return result;
  }
  getUserID() {
    const access_token = this.getToken();
    const data = jwt_decode(
      access_token.replace('Bearer ', '').replace('bearer ', '')

    )
    return data['customdata']['jee-account']['userID'];
  }
}
