import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription, merge, fromEvent } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { TokenStorage } from './token-storage.service';
import { UserModel } from '../_models/user.model';
import { AuthSSO } from '../_models/authSSO.model';
import { AuthHTTPService } from './auth-http.service';
import { CookieService } from 'ngx-cookie-service';

export type UserType = UserModel | undefined;
const redirectUrl = environment.HOST_REDIRECTURL + '/sso?redirectUrl=';
const DOMAIN = environment.DOMAIN_COOKIES;
const API_IDENTITY = `${environment.HOST_IDENTITYSERVER_API}`;
const API_IDENTITY_LOGOUT = `${API_IDENTITY}/user/logout`;
const API_IDENTITY_USER = `${API_IDENTITY}/user/me`;
const API_IDENTITY_REFESHTOKEN = `${API_IDENTITY}/user/refresh`;
const KEY_SSO_TOKEN = 'sso_token';
const KEY_SSO_TOKEN_2 = 'sso_token_2';
const KEY_RESRESH_TOKEN = 'sso_token_refresh';
const API_JEEACCOUNT = environment.HOST_JEEACCOUNT_API;

@Injectable({
  providedIn: 'root',
})
export class AuthService implements OnDestroy {
  // private fields
  private unsubscribe: Subscription[] = [];
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;
  //Kiểm tra kết nối internet
  networkOff: boolean = false;
  //show dialog
  horizontalPosition: MatSnackBarHorizontalPosition = 'left';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';
  // public fields
  currentUser$: Observable<UserModel>;
  // isLoading$: Observable<boolean>;
  currentUserSubject: BehaviorSubject<UserModel>;
  isLoadingSubject: BehaviorSubject<boolean>;



  // public fields

  authSSOModelSubject$: BehaviorSubject<AuthSSO> = new BehaviorSubject<AuthSSO>(undefined);
  // Private fields
  isLoading$ = new BehaviorSubject<boolean>(false);
  isFirstLoading$ = new BehaviorSubject<boolean>(true);
  errorMessage = new BehaviorSubject<string>(undefined);
  subscriptions: Subscription[] = [];

  // private userSubject = new BehaviorSubject<any | null>(null);

  public userSubject = new BehaviorSubject<any>(undefined);

  User$: Observable<any> = this.userSubject.asObservable();

  constructor(private _snackBar: MatSnackBar, private http: HttpClient,

    private authHttpService: AuthHTTPService, private cookieService: CookieService
    , private tokenStorage: TokenStorage) {
    this.isLoading$ = new BehaviorSubject<boolean>(false);
  }

  getUserId() {
    var auth = this.getAuthFromLocalStorage();
    return auth.user.customData['jee-account'].userID;
  }
  public getAuthFromLocalStorageStore(): any {

    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }
  getToken() {
    const access_token = this.cookieService.get(KEY_SSO_TOKEN) + this.cookieService.get(KEY_SSO_TOKEN_2);
    if (access_token) {
      return access_token
    }
    else {
      const dt = this.getAuthFromLocalStorageStore();
      const tokenlocal = dt.access_token;
      return tokenlocal
    }

  }

  getAccessToken_cookie() {

    const access_token = this.getToken();
    return access_token;
  }

  saveToken_cookie(access_token?: string, refresh_token?: string) {
    if (access_token) this.cookieService.set(KEY_SSO_TOKEN, access_token, 365, '/', DOMAIN);
    if (refresh_token) this.cookieService.set(KEY_RESRESH_TOKEN, refresh_token, 365, '/', DOMAIN);
  }

  getRefreshToken_cookie() {
    const sso_token = this.cookieService.get(KEY_RESRESH_TOKEN);
    return sso_token;
  }

  deleteAccessRefreshToken_cookie() {
    this.cookieService.delete(KEY_SSO_TOKEN, '/', DOMAIN);
    this.cookieService.delete(KEY_RESRESH_TOKEN, '/', DOMAIN);
  }

  autoGetUserFromSSO() {
    const auth = this.getAuthFromLocalStorage();
    if (auth) {
      this.saveNewUserMe();
    }
  }

  saveNewUserMe(data?: any) {
    debugger
    if (data) {
      this.userSubject.next(data);
      localStorage.setItem('getAuthFromLocalStorage', JSON.stringify(data));//Tuấn sử dụng
      this.saveToken_cookie(data.access_token, data.refresh_token);
    }
    this.getUserMeFromSSO().subscribe(
      (data) => {
        if (data && data.access_token) {
          localStorage.setItem('customerID', data.user.customData["jee-account"].customerID);
          localStorage.setItem('staffID', data.user.customData["jee-account"].staffID);//Thiên sử dụng
          localStorage.setItem('appCode', JSON.stringify(data.user.customData['jee-account'].appCode));//Thiên sử dụng
          this.userSubject.next(data);
          localStorage.setItem('getAuthFromLocalStorage', JSON.stringify(data));//Tuấn sử dụng
          this.saveToken_cookie(data.access_token, data.refresh_token);
        }
      },
      (error) => {
        this.refreshToken().subscribe(
          (data: AuthSSO) => {
            if (data && data.access_token) {
              localStorage.setItem('customerID', data.user.customData["jee-account"].customerID);
              localStorage.setItem('staffID', data.user.customData["jee-account"].staffID);//Thiên sử dụng
              localStorage.setItem('appCode', JSON.stringify(data.user.customData['jee-account'].appCode));//Thiên sử dụng
              this.userSubject.next(data);
              localStorage.setItem('getAuthFromLocalStorage', JSON.stringify(data));//Tuấn sử dụng
              this.saveToken_cookie(data.access_token, data.refresh_token);
            }
          },
          (error) => {
            this.logout();
          }
        );
      }
    );
  }


  LogOutOs() {
    let host = "https://portal.jee.vn";
    const iframeSource = `${host}/?logout=true`
    const iframe = document.createElement('iframe')
    iframe.setAttribute('src', iframeSource)
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
    window.addEventListener(
      'message',
      () => {
        window.location.reload()
      },
      false
    )
  }

  logout() {
    debugger
    const access_token = this.getAccessToken_cookie();
    if (access_token) {
      this.getCode().subscribe((res) => {
        if (res && res.status == 1) {
          this.code = res.data;
        }
        this.logoutToSSO().subscribe(
          (res) => {
            this.prepareLogoutCode(this.code)
          },
          (err) => {
            this.prepareLogoutCode(this.code)
          }
        );
      })
    } else {
      this.prepareLogoutNotToken();
    }
  }

  prepareLogoutCode(code: any) {
    if (!window.navigator.onLine) return;
    this.LogOutOs();
    this.deleteAccessRefreshToken_cookie();
    localStorage.setItem('id_process', "");
    localStorage.removeItem('filterSearchLog');
    localStorage.removeItem('isSearchLog');
    let url = '';
    if (document.location.port) {
      url = redirectUrl + document.location.protocol + '//' + document.location.hostname + ':' + document.location.port + '&code=' + code;
    } else {
      url = redirectUrl + document.location.protocol + '//' + document.location.hostname + '&code=' + code;
    }
    window.location.href = url;
  }

  prepareLogoutNotToken() {
    if (!window.navigator.onLine) return;
    this.deleteAccessRefreshToken_cookie();
    localStorage.setItem('id_process', "");
    localStorage.removeItem('filterSearchLog');
    localStorage.removeItem('isSearchLog');
    let url = '';
    const link = window.location.href;
    if (link.includes('?')) {
      const httpParams = new HttpParams({ fromString: link.split('?')[1] });
      if (httpParams.get('code') != "") {
        if (document.location.port) {
          url = redirectUrl + document.location.protocol + '//' + document.location.hostname + ':' + document.location.port + '&code=' + httpParams.get('code');
        } else {
          url = redirectUrl + document.location.protocol + '//' + document.location.hostname + '&code=' + httpParams.get('code');
        }
      }
    } else {
      if (document.location.port) {
        if (localStorage.getItem('cusCode') != "" && localStorage.getItem('cusCode') != null) {
          url = redirectUrl + document.location.protocol + '//' + document.location.hostname + ':' + document.location.port + '&code=' + localStorage.getItem('cusCode');
        } else {
          url = redirectUrl + document.location.protocol + '//' + document.location.hostname + ':' + document.location.port;
        }
      } else {
        if (localStorage.getItem('cusCode') != "" && localStorage.getItem('cusCode') != null) {
          url = redirectUrl + document.location.protocol + '//' + document.location.hostname + '&code=' + localStorage.getItem('cusCode');
        } else {
          url = redirectUrl + document.location.protocol + '//' + document.location.hostname;
        }
      }
    }

    window.location.href = url;
  }



  prepareLogout() {
    if (!window.navigator.onLine) return;
    // alert("Check ở đây")
    this.LogOutOs();
    this.deleteAccessRefreshToken_cookie();
    localStorage.setItem('id_process', "");
    localStorage.removeItem('filterSearchLog');
    localStorage.removeItem('isSearchLog');
    let url = '';
    if (document.location.port) {
      url = redirectUrl + document.location.protocol + '//' + document.location.hostname + ':' + document.location.port;
    } else {
      url = redirectUrl + document.location.protocol + '//' + document.location.hostname;
    }
    window.location.href = url;
  }


  // getAuthFromLocalStorage() {
  //   return this.userSubject.value;
  // }

  public getAuthFromLocalStorage(): any {

    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }

  // call api identity server
  getUserMeFromSSO(): Observable<any> {
    const access_token = this.getAccessToken_cookie();
    const url = API_IDENTITY_USER;
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    });
    return this.http.get<any>(url, { headers: httpHeader });
  }

  refreshToken(): Observable<any> {
    const refresh_token = this.getRefreshToken_cookie();
    const url = API_IDENTITY_REFESHTOKEN;
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refresh_token}`,
    });
    return this.http.post<any>(url, null, { headers: httpHeader });
  }

  logoutToSSO(): Observable<any> {
    const access_token = this.getAccessToken_cookie();
    const url = API_IDENTITY_LOGOUT;
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    });
    return this.http.post<any>(url, null, { headers: httpHeader });
  }


  //==============End=Using nhắc nhở================
  code: any;
  getCode(): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    const httpHeader = new HttpHeaders({
      Authorization: `Bearer ${auth != null ? auth.access_token : ''}`,
    });
    return this.http.get<any>(environment.HOST_JEEACCOUNT_API + '/api/accountpassword/getCode', {
      headers: httpHeader,
    });
  }
}