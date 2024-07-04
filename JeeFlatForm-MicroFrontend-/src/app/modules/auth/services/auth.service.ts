import { Injectable, OnDestroy } from '@angular/core';
import { Observable, BehaviorSubject, of, Subscription, merge, fromEvent } from 'rxjs';
import { map, catchError, switchMap, finalize } from 'rxjs/operators';
import { UserModel } from '../models/user.model';
import { AuthModel } from '../models/auth.model';
import { AuthHTTPService } from './auth-http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { QueryParamsModel, QueryResultsModel } from '../models/query-params.model';
import { CookieService } from 'ngx-cookie-service';
import jwt_decode from 'jwt-decode';
import { AuthSSO } from '../models/authSSO.model';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { TokenStorage } from './token-storage.service';

export type UserType = UserModel | undefined;
// const redirectUrl = environment.HOST_REDIRECTURL + '/sso?redirectUrl=';//Thiên đóng
// const DOMAIN = environment.DOMAIN_COOKIES;//Thiên đóng
const API_IDENTITY = `${environment.HOST_IDENTITYSERVER_API}`;
const API_IDENTITY_LOGOUT = `${API_IDENTITY}/user/logout`;
const API_IDENTITY_USER = `${API_IDENTITY}/user/me`;
const API_IDENTITY_REFESHTOKEN = `${API_IDENTITY}/user/refresh`;
const KEY_SSO_TOKEN = 'sso_token';
const KEY_RESRESH_TOKEN = 'sso_token_refresh';
const API_JEEACCOUNT = environment.HOST_JEEACCOUNT_API;
const API_WORK_2023 = environment.HOST_JEEWORK_API_2023;

const KEY_SSO_TOKEN_2 = 'sso_token_2';

const key_forgetpass = "sJoPSvHUHmbFvbzGC8Yp4LKUZtQ6M6pRalM3IST9cMJNGk2v2ZQETFJp87XNWAoQ4tUWGIRPwQRBpI1vtWSDgYfzbjXJZwNNT2PujJmP1YNznfURNRjLD10N0fx7qshYsDsk2dE49ifjJ4xnl0yOIUoOLwHf3dm9"

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
    if (this.getAccessToken_cookie()) {
      this.getUserMeFromSSO().subscribe(
        (data) => {
          if (data && data.access_token) {
            localStorage.setItem('customerID', data.user.customData["jee-account"].customerID);
            localStorage.setItem('getAuthFromLocalStorage', JSON.stringify(data));//Tuấn sử dụng
            localStorage.setItem('staffID', data.user.customData["jee-account"].staffID);//Thiên sử dụng
            localStorage.setItem('appCode', JSON.stringify(data.user.customData['jee-account'].appCode));//Thiên sử dụng
            this.userSubject.next(data);
            this.saveToken_cookie(data.access_token, data.refresh_token);
            this.getCode().subscribe((res) => {
              if (res && res.status == 1) {
                localStorage.setItem('cusCode', res.data);
                if (res.OpenTab) {
                  localStorage.setItem('use-iframe', 'yes');
                } else {
                  localStorage.setItem('use-iframe', 'no');
                }
              }
            })
            this.RefreshThamSoByUserLogin();
            caches.keys().then(keys => {
              keys.forEach(key => {
                caches.delete(key);
              })
            })
          }
        },
        (error) => {
          this.refreshToken().subscribe(
            (data: AuthSSO) => {
              if (data && data.access_token) {

                localStorage.setItem('customerID', data.user.customData["jee-account"].customerID);
                localStorage.setItem('staffID', data.user.customData["jee-account"].staffID);//Thiên sử dụng
                localStorage.setItem('getAuthFromLocalStorage', JSON.stringify(data));//Tuấn sử dụng
                localStorage.setItem('appCode', JSON.stringify(data.user.customData['jee-account'].appCode));//Thiên sử dụng
                this.userSubject.next(data);

                this.saveToken_cookie(data.access_token, data.refresh_token);
              }
            },
            (error) => {
              if (error.status === 401 || error.status === 500) {
                this.logout();
              }
            }
          );
        },
        () => {
          setInterval(() => {
            if (!this.getAccessToken_cookie() && !this.getRefreshToken_cookie()) this.prepareLogout();
          }, 2000);
        }
      );
    }
    this.networkStatus = navigator.onLine;
    this.networkStatus$ = merge(
      of(null),
      fromEvent(window, 'online'),
      fromEvent(window, 'offline')
    )
      .pipe(map(() => navigator.onLine))
      .subscribe(status => {
        if (!status) {
          //show dialog
          this._snackBar.open('Bạn đang offline.', 'Đóng', {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
          });
          this.networkOff = true
        } else {
          if (this.networkOff) {
            //show dialog
            this._snackBar.open('Đã khôi phục kết nối Internet.', 'Đóng', {
              horizontalPosition: this.horizontalPosition,
              verticalPosition: this.verticalPosition,
              duration: 5000
            });
          }
        }
        this.networkStatus = status;
      });
    if (window.navigator.onLine) {
      setInterval(() => {
        if (this.networkStatus) {
          this.autoGetUserFromSSO()
        }
      }, 30000);
    }
  }

  get currentUserValue(): UserModel {
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: UserModel) {
    this.currentUserSubject.next(user);
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
      if (dt) {
        const tokenlocal = dt.access_token;
        return tokenlocal
      }
      else {
        return access_token
      }
    }
  }

  getAccessToken_cookie() {
    const access_token = this.getToken();
    return access_token;
  }

  saveToken_cookie(access_token?: string, refresh_token?: string) {
    const DOMAIN = this.getDomainCookie();
    if (access_token) {
      this.cookieService.set(KEY_SSO_TOKEN, access_token.slice(0, 4000), 365, '/', DOMAIN);
      this.cookieService.set(KEY_SSO_TOKEN_2, access_token.slice(4000), 365, '/', DOMAIN);
    }
    if (refresh_token) this.cookieService.set(KEY_RESRESH_TOKEN, refresh_token, 365, '/', DOMAIN);
  }

  getRefreshToken_cookie() {
    const sso_token = this.cookieService.get(KEY_RESRESH_TOKEN);
    return sso_token;
  }

  deleteAccessRefreshToken_cookie() {
    const DOMAIN = this.getDomainCookie();
    this.cookieService.delete(KEY_SSO_TOKEN, '/', DOMAIN);
    this.cookieService.delete(KEY_SSO_TOKEN_2, '/', DOMAIN);
    this.cookieService.delete(KEY_RESRESH_TOKEN, '/', DOMAIN);
  }

  autoGetUserFromSSO() {
    const auth = this.getAuthFromLocalStorage();
    if (auth) {
      this.saveNewUserMe();
    }
  }

  saveNewUserMe(data?: any) {
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
            if (error.status === 401 || error.status === 500) {
              this.logout();
            }
          }
        );
      }
    );
  }

  isAuthenticated(): boolean {
    const access_token = this.getAccessToken_cookie();
    const refresh_token = this.getRefreshToken_cookie();
    if (access_token) {
      if (this.isTokenExpired(access_token)) {
        this.saveToken_cookie(access_token);
        return true;
      }
    }
    if (refresh_token) {
      if (this.isTokenExpired(refresh_token)) {
        this.saveToken_cookie(undefined, refresh_token);
        return true;
      }
    }
    return false;
  }

  isTokenExpired(token: string): boolean {
    const date = this.getTokenExpirationDate(token);
    if (!date) return false;
    return date.valueOf() > new Date().valueOf();
  }

  getTokenExpirationDate(auth: string): Date {
    let decoded: any = jwt_decode(auth);
    if (!decoded.exp) return null;
    const date = new Date(0);
    date.setUTCSeconds(decoded.exp);
    return date;
  }

  async LogOutOs() {
    const w = window as any
    const onesignal = w.OneSignal || []
    onesignal.push(function () {
      onesignal.isPushNotificationsEnabled(async function (isEnabled) {
        if (isEnabled) {
          await onesignal.setSubscription(false)
        }
      });
    });
    this.logout();
    // let host = "https://portal." + this.getDomainRedirect();
    // const iframeSource = `${host}/?logout=true`
    // const iframe = document.createElement('iframe')
    // iframe.setAttribute('src', iframeSource)
    // iframe.style.display = 'none'
    // document.body.appendChild(iframe)
    // window.addEventListener(
    //   'message',
    //   () => {
    //     this.logout();
    //   },
    //   false
    // )
  }

  logout() {
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
    localStorage.removeItem('getAuthFromLocalStorage');
    localStorage.removeItem('isSearchLog');
    let url = '';
    const redirectUrl = document.location.protocol + "//portal." + this.getDomainRedirect() + '/sso?redirectUrl=';
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
    localStorage.removeItem('getAuthFromLocalStorage');
    localStorage.removeItem('filterSearchLog');
    localStorage.removeItem('isSearchLog');
    let url = '';
    const link = window.location.href;
    const redirectUrl = document.location.protocol + "//portal." + this.getDomainRedirect() + '/sso?redirectUrl=';
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
    const redirectUrl = document.location.protocol + "//portal." + this.getDomainRedirect() + '/sso?redirectUrl=';
    if (document.location.port) {
      url = redirectUrl + document.location.protocol + '//' + document.location.hostname + ':' + document.location.port;
    } else {
      url = redirectUrl + document.location.protocol + '//' + document.location.hostname;
    }
    window.location.href = url;
  }

  getParamsSSO() {
    const url = window.location.href;
    let paramValue = undefined;
    if (url.includes('?')) {
      const httpParams = new HttpParams({ fromString: url.split('?')[1] });
      paramValue = httpParams.get('sso_token');
    }
    return paramValue;
  }

  getAuthFromLocalStorage() {

    return this.userSubject.value;

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

  // end call api identity server

  // method metronic call
  getUserByToken(): Observable<UserModel> {
    const auth = this.getAuthFromLocalStorage();
    if (!auth || !auth.accessToken) {
      return of(undefined);
    }
    this.isLoading$.next(true);
    return this.authHttpService.getUserByToken(auth.accessToken).pipe(
      map((user: UserModel) => {
        if (user) {
          this.currentUserSubject = new BehaviorSubject<UserModel>(user);
        } else {
          this.logout();
        }
        return user;
      }),
      finalize(() => this.isLoading$.next(false))
    );
  }

  forgotPassword(value: any): Observable<any> {
    throw new Error('Method not implemented.');
  }
  registration(newUser: UserModel): Observable<any> {
    throw new Error('Method not implemented.');
  }

  getStaffId() {
    var auth = this.getAuthFromLocalStorage();
    return auth.user.customData['jee-account'].staffID;
  }
  getAppCodeId() {
    var auth = this.getAuthFromLocalStorage();
    return auth.user.customData['jee-account'].appCode;
  }
  getcustomerID() {
    var auth = this.getAuthFromLocalStorage();
    return auth.user.customData['jee-account'].customerID;
  }
  getUsername() {
    var auth = this.getAuthFromLocalStorage();
    return auth.user.username;
  }

  //===========================================================================
  public checkUsenameCapcha(credential: any): Observable<any> {
    const httpHeader = new HttpHeaders({
      'x-api-version': "1.1",
    });
    return this.http.post<any>(API_JEEACCOUNT + '/api/accountpassword/CheckForgetPass',
      {
        UserName: credential.username,
        GCCode: credential.recapcha,
        LangCode: credential.langcode,
        DeviceName: credential.DeviceName,
        IP: credential.IP,
      }, {
      headers: httpHeader,
    }).pipe(
      map((result: any) => {
        if (result && result.status !== 1) {
          return result;
        }
        let rs = {
          status: 1,
          data: result.data,
        };
        return rs;
      })
    );
  }

  public GuiLaiMa(credential: any): Observable<any> {
    const httpHeader = new HttpHeaders({
      'x-api-version': "1.1",
    });
    return this.http.post<any>(API_JEEACCOUNT + '/api/accountpassword/GuiLaiMa',
      {
        UserName: credential.username,
        LangCode: credential.langcode,
        DeviceName: credential.DeviceName,
        IP: credential.IP,
        RowID: credential.RowID,
      }, {
      headers: httpHeader,
    }).pipe(
      map((result: any) => {
        if (result && result.status !== 1) {
          return result;
        }
        let rs = {
          status: 1,
          data: result.data,
        };
        return rs;
      })
    );
  }

  public checkChuoiKyTu(credential: any): Observable<any> {
    const httpHeader = new HttpHeaders({
      'x-api-version': "1.1",
    });
    return this.http.get<any>(API_JEEACCOUNT + `/api/accountpassword/CheckChuoiKyTu?RowID=${credential.RowID}&id_nv=${credential.useid}&code=${credential.code}&solan=${credential.solan}`, {
      headers: httpHeader,
    }).pipe(
      map((result: any) => {
        return result;
      })
    );
  }

  public cancelPassword(item: any): Observable<any> {
    return this.http.post<any>(API_JEEACCOUNT + `/api/accountpassword/cancelPassword`, item).pipe(
      map((result: any) => {
        return result;
      })
    );
  }
  //=======OpenChat======
  getIsOpenChat() {
    const isopenchat = this.cookieService.get('isOpenChat');
    return isopenchat;
  }
  setIsOpenChat(value) {
    const DOMAIN = this.getDomainCookie();
    this.cookieService.set('isOpenChat', value, 365, '/', DOMAIN);
  }


  getHTTPHeaders(): HttpHeaders {
    const access_token = this.getAccessToken_cookie();
    const httpHeaders = new HttpHeaders({
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': `application/json`,
    });
    return httpHeaders;
  }
  getFindHTTPParams(queryParams: any): HttpParams {
    let params = new HttpParams()
      .set('sortOrder', queryParams.sortOrder)
      .set('sortField', queryParams.sortField)
      .set('page', (queryParams.pageNumber + 1).toString())
      .set('record', queryParams.pageSize.toString());
    let keys: any = [];
    let values: any = [];
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
    let grp_keys: any = [], grp_values: any = [];
    if (queryParams.filterGroup) {
      Object.keys(queryParams.filterGroup).forEach(function (key) {
        if (typeof queryParams.filterGroup[key] !== 'string' || queryParams.filterGroup[key] !== '') {
          grp_keys.push(key);
          let value_str = "";
          if (queryParams.filterGroup[key] && queryParams.filterGroup[key].length > 0) {
            value_str = queryParams.filterGroup[key].join(',')
          }
          grp_values.push(value_str);
        }
      });
      if (grp_keys.length > 0) {
        params = params.append('filterGroup.keys', grp_keys.join('|'))
          .append('filterGroup.vals', grp_values.join('|'));
      }
    }
    return params;
  }
  public getRoles() {
    const auth = this.currentUserSubject.value;
    return auth.roles;
  }
  public getDataUser() {
    const auth = this.currentUserSubject.value;
    return auth;
  }

  //==============Start=Using nhắc nhở================
  Get_DSNhacNho(): Observable<any> {
    const httpHeaders = this.getHTTPHeaders();
    return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/widgets/Get_DSNhacNho`, { headers: httpHeaders });
  }

  Count_SoLuongNhacNho(): Observable<any> {
    const httpHeaders = this.getHTTPHeaders();
    return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/widgets/Count_SoLuongNhacNho`, { headers: httpHeaders });
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
  //==============Start - Xử lý get domain cookie theo domain=============
  getDomainCookie(): string {
    let domain = '';
    let _hostname = window.location.hostname;
    if (_hostname == 'localhost') {
      domain = _hostname
    } else {
      let hostname = ''
      hostname = _hostname.replace(_hostname.split('.')[0] + '.', '');
      domain = hostname
    }
    return domain;
  }

  getDomainRedirect(): string {
    let domain = '';
    let _hostname = window.location.hostname;
    if (_hostname == 'localhost') {
      domain = 'jee.vn'
    } else {
      let hostname = ''
      hostname = _hostname.replace(_hostname.split('.')[0] + '.', '');
      domain = hostname
    }
    return domain;
  }
  //==============End - Xử lý get domain cookie theo domain===============
  updateOpenTab(isopen): Observable<any> {
    const auth = this.getAuthFromLocalStorage();
    const httpHeader = new HttpHeaders({
      Authorization: `Bearer ${auth != null ? auth.access_token : ''}`,
    });
    return this.http.get<any>(environment.HOST_JEEACCOUNT_API + `/api/accountmanagement/changeOpenTab?isopen=${isopen}`, {
      headers: httpHeader,
    });
  }
  //=================Ngày 29/01/2024====================
  //ToUpper: viết hoa chữ đầu
  RefreshThamSoByUserLogin() {
    this.GetListThamSoUIByCustomer(1.0).subscribe(res => {
      if (res && res.status == 1) {
        res.data.forEach(element => {
          switch (element.id_row) {
            case 2: {
              if (element.toUpper == 0) {
                localStorage.setItem('ts_phongban', element.giatri);
              }
              else {
                localStorage.setItem('ts_phongban_ToUpper', element.giatri);
              }
              break;
            }
            case 3: {
              if (element.toUpper == 0) {
                localStorage.setItem('ts_thumuc', element.giatri);
              }
              else {
                localStorage.setItem('ts_thumuc_ToUpper', element.giatri);
              }
              break;
            }
            case 4: {
              if (element.toUpper == 0) {
                localStorage.setItem('ts_duan', element.giatri);
              }
              else {
                localStorage.setItem('ts_duan_ToUpper', element.giatri);
              }
              break;
            }
            case 5: {
              if (element.toUpper == 0) {
                localStorage.setItem('ts_congviec', element.giatri);
              }
              else {
                localStorage.setItem('ts_congviec_ToUpper', element.giatri);
              }
              break;
            }
            case 15: {
              localStorage.setItem('ts_description', element.giatri);
              break;
            }
            case 32: {
              localStorage.setItem('cf_ten', element.giatri);
              break;
            }
            case 33: {
              localStorage.setItem('cf_tag', element.giatri);
              break;
            }
            default: break;
          }
        });
      }
    })
  }
  GetListThamSoUIByCustomer(version): Observable<any> {
    const access_token = this.getAccessToken_cookie();
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${access_token}`,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'TimeZone': (new Date()).getTimezoneOffset().toString(),
      'x-api-version': `${version}`,
    });
    return this.http.get<any>(API_WORK_2023 + `/api/general/get-list-tham-so-by-customer`, { headers: httpHeader });
  }

  //====================Bộ API quên mật khẩu DP247========================
  public getThamSoDP(): Observable<any> {
    const httpHeader = new HttpHeaders({
      Authorization: `Bearer ${key_forgetpass}`,
    });
    return this.http.get<any>(API_JEEACCOUNT + `/api/accountpassword/getConfig`, {
      headers: httpHeader,
    }).pipe(
      map((result: any) => {
        return result;
      })
    );
  }

  public CheckForgetPassByPhone(credential: any): Observable<any> {
    const httpHeader = new HttpHeaders({
      'x-api-version': "2.0",
      Authorization: `Bearer ${key_forgetpass}`,
    });
    return this.http.post<any>(API_JEEACCOUNT + '/api/accountpassword/CheckForgetPassByPhone',
      {
        Phone: credential.username,
        GCCode: credential.recapcha,
        LangCode: credential.langcode,
        DeviceName: credential.DeviceName,
        IP: credential.IP,
      }, {
      headers: httpHeader,
    }).pipe(
      map((result: any) => {
        if (result && result.status !== 1) {
          return result;
        }
        let rs = {
          status: 1,
          data: result.data,
        };
        return rs;
      })
    );
  }

  public CheckOTPByPhone(credential: any): Observable<any> {
    const httpHeader = new HttpHeaders({
      'x-api-version': "2.0",
      Authorization: `Bearer ${key_forgetpass}`,
    });
    return this.http.get<any>(API_JEEACCOUNT + `/api/accountpassword/CheckOTPByPhone?RowID=${credential.RowID}&code=${credential.code}`, {
      headers: httpHeader,
    }).pipe(
      map((result: any) => {
        return result;
      })
    );
  }
  
  public SendOTPByPhone(credential: any): Observable<any> {
    const httpHeader = new HttpHeaders({
      'x-api-version': "2.0",
      Authorization: `Bearer ${key_forgetpass}`,
    });
    return this.http.post<any>(API_JEEACCOUNT + '/api/accountpassword/SendOTPByPhone',
      {
        Phone: credential.username,
        RowID: credential.RowID,
        activeId: 1,
      }, {
      headers: httpHeader,
    }).pipe(
      map((result: any) => {
        if (result && result.status !== 1) {
          return result;
        }
        let rs = {
          status: 1,
          data: result.data,
        };
        return rs;
      })
    );
  }
}
