import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { AccountManagementDTO } from '../../kich-hoat-tai-khoan/Model/account-management.model';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

const API_PRODUCTS_URL = environment.HOST_JEEACCOUNT_API + '/api/permissionmanagement';
const API_HR = environment.HOST_JEEHR_API + '/api';

@Injectable({
  providedIn: 'root'
})
export class PhanQuyenTaiKhoanService {
  constructor(private http: HttpClient,
    private auth: AuthService,
    private httpUtils: HttpUtilsService) {
  }

  getAllItems(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_PRODUCTS_URL + '/GetListPermissionAccountApp?more=true', { headers: httpHeaders });
  }

  createAdminApp(item: any, appid: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/CreateAdminApp/${appid}`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  RemoveAdminApp(userid: number, appid: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/RemoveAdminApp/${appid}/${userid}`;
    return this.http.delete<any>(url, { headers: httpHeaders });
  }

  //=========================================================

  GetListCustomerAppInit(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_PRODUCTS_URL + '/GetListCustomerAppInit?more=true', { headers: httpHeaders });
  }

  UpdateInitStatusApp(appID: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateInitStatusApp/${appID}/1`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  UpdateInfoCustemer(item: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_HR + `/user/UpdateInfoCustemer`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
}
