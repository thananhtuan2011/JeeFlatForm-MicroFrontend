import { ChangePasswordModel, ForgetPasswordDP247Model, ForgetPasswordModel } from './../models/jee-account.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { AppListDTO, PostImgModel } from '../models/jee-account.model';
import { environment } from 'src/environments/environment';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';

const API_JEEACCOUNT_URL = environment.HOST_JEEACCOUNT_API;
const API_IDENTITY_URL = environment.APIIDENTITY;
const key_forgetpass = "sJoPSvHUHmbFvbzGC8Yp4LKUZtQ6M6pRalM3IST9cMJNGk2v2ZQETFJp87XNWAoQ4tUWGIRPwQRBpI1vtWSDgYfzbjXJZwNNT2PujJmP1YNznfURNRjLD10N0fx7qshYsDsk2dE49ifjJ4xnl0yOIUoOLwHf3dm9"

@Injectable()
export class JeeAccountService {
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  public GetListAppByCustomerID(): Observable<ResultModel<AppListDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEEACCOUNT_URL + `/api/accountmanagement/GetListAppByCustomerID`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  public GetListAppByUserId(userid: number): Observable<ResultModel<AppListDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEEACCOUNT_URL + `/api/accountmanagement/GetListAppByUserID?userid=${userid}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }
  public UpdateAvatarWithChangeUrlAvatar(img: PostImgModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEEACCOUNT_URL + `/api/accountmanagement/UpdateAvatarWithChangeUrlAvatar`;
    return this.http.post<any>(url, img, { headers: httpHeaders });
  }

  public changePassword(model: ChangePasswordModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders("1.1");
    const url = API_JEEACCOUNT_URL + `/api/accountmanagement/changePassword`;
    return this.http.post<any>(url, model, { headers: httpHeaders });
  }
  public forgetPassword(model: ForgetPasswordModel): Observable<any> {
    const httpHeader = new HttpHeaders({
      'x-api-version': "1.1",
      'TimeZone': (new Date()).getTimezoneOffset().toString(),
    });
    const url = API_JEEACCOUNT_URL + `/api/accountpassword/forgetPassword`;
    return this.http.post<any>(url, model, { headers: httpHeader });
  }

  public check2fa(): Observable<ResultModel<AppListDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_IDENTITY_URL + `/user/2fa/check`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  public generateQR(): Observable<ResultModel<AppListDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_IDENTITY_URL + `/user/2fa/generate`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  public turnOn2FA(model:any): Observable<ResultModel<AppListDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_IDENTITY_URL + `/user/2fa/turn-on`;
    return this.http.post<any>(url, model, {
      headers: httpHeaders,
    });
  }

  public turnOff2FA(model:any): Observable<ResultModel<AppListDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_IDENTITY_URL + `/user/2fa/turn-off`;
    return this.http.post<any>(url, model, {
      headers: httpHeaders,
    });
  }

  public getDevices(): Observable<ResultModel<AppListDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_IDENTITY_URL + `/user/devices`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  public logoutDevice(device_id:any): Observable<ResultModel<AppListDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_IDENTITY_URL + `/user/logout-device?device_id=${device_id}`;
    return this.http.post<any>(url, null, {
      headers: httpHeaders,
    });
  }

  //=================API quên mật khẩu DP247============
  public ForgetPasswordByPhone(model: ForgetPasswordDP247Model): Observable<any> {
    const httpHeader = new HttpHeaders({
      'x-api-version': "2.0",
      'TimeZone': (new Date()).getTimezoneOffset().toString(),
      Authorization: `Bearer ${key_forgetpass}`,
    });
    const url = API_JEEACCOUNT_URL + `/api/accountpassword/ForgetPasswordByPhone`;
    return this.http.post<any>(url, model, { headers: httpHeader });
  }
}

export interface ResultModel<T> {
  Visible: boolean;
  data: T[];
  error: ErrorModel;
  panigator: number;
  status: number;
}

export interface ErrorModel {
  LastError: string;
  code: number;
  message: string;
}
