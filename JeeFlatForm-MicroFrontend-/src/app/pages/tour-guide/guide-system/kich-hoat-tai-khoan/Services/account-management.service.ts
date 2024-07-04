import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inject, Injectable, OnDestroy } from '@angular/core';
import {
  AccChangeTinhTrangModel,
  AccDirectManagerModel,
  AccountManagementDTO,
  AccountManagementModel,
  AppListDTO,
  CheckEditAppListByDTO,
  InfoUserDTO,
  JeeHRNhanVien,
  JobtitleManagementDTO,
  PostImgModel,
} from '../Model/account-management.model';
import { environment } from 'src/environments/environment';
import { ResultModel, ResultObjModel, ResultObjectModelAccount } from 'src/app/modules/auth/models/_base.model';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';
import { ITableServiceV2 } from './itable.service_v2';

const API_PRODUCTS_URL = environment.HOST_JEEACCOUNT_API + '/api/accountmanagement';
const API_URL = environment.HOST_JEEACCOUNT_API + '/api';
const API_URL_GENERAL = API_URL + '/general';
const API_NV_URL = environment.HOST_JEEHR_API + '/api/interaction/staff';
const API_HR_GENERAL = environment.HOST_JEEHR_API + '/api/controllergeneral';
const API_HR_EMPLOYEE = environment.HOST_JEEHR_API + '/api/employee';

@Injectable()
export class AccountManagementService extends ITableServiceV2<AccountManagementDTO[]> implements OnDestroy {
  API_URL_FIND: string = API_PRODUCTS_URL + '/GetListAccountManagement_New_V2';
  API_URL_CTEATE: string = API_PRODUCTS_URL + '/createAccount';
  API_URL_EDIT: string = API_PRODUCTS_URL + '/createAccount';
  API_URL_DELETE: string = API_PRODUCTS_URL + '/Delete';
  API_URL: string = API_PRODUCTS_URL;
  API_VERSION: string = '2.0';
  constructor(@Inject(HttpClient) http, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  GetListAppByCustomerID(): Observable<ResultModel<AppListDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetListAppByCustomerID`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  GetListAppByUserId(userid: number): Observable<ResultModel<AppListDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetListAppByUserID?userid=${userid}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  GetEditListAppByUserIDByListCustomerId(userid: number): Observable<ResultModel<CheckEditAppListByDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetEditListAppByUserIDByListCustomerId?userid=${userid}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  GetListJeeHR(): Observable<JeeHRNhanVien[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetDSJeeHR`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  GetDSJeeHRToUpdate(): Observable<JeeHRNhanVien[]> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetDSJeeHRToUpdate`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  createAccount(item: AccountManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/createAccount`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  UpdateAccount(item: AccountManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateAccount`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  UpdateAvatarWithChangeUrlAvatar(img: PostImgModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateAvatarWithChangeUrlAvatar`;
    return this.http.post<any>(url, img, { headers: httpHeaders });
  }

  UpdateDirectManager(acc: AccDirectManagerModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateDirectManager`;
    return this.http.post<any>(url, acc, {
      headers: httpHeaders,
    });
  }

  changeTinhTrang(acc: AccChangeTinhTrangModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/ChangeTinhTrang`;
    return this.http.post<any>(url, acc, {
      headers: httpHeaders,
    });
  }

  GetInfoByUsername(username: string): Observable<ResultObjModel<InfoUserDTO>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetInfoByUsername/username=${username}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }
  Delete(UserID: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/Delete/${UserID}`;
    return this.http.delete<any>(url, {
      headers: httpHeaders,
    });
  }
  ResetPassword(username: string): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/resetPassword/?username=${username}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  //====================Thay đổi API sử dụng cho DPC======================
  DetailsStaffID(staffid: string): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/hr/${staffid}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  createAccount_V2(item: AccountManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders("2.0");
    const url = API_PRODUCTS_URL + `/createAccount_V2`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  capNhatThongTinNV(item: AccountManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_NV_URL + `/infomation`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  DeleteHR(UserID: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_HR_EMPLOYEE + `/DeleteNhanVien?id=${UserID}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  capNhatThongTinNV_V2(item: AccountManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_URL + `/customermanagement/update_information`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  //======================================================
  isAdminHeThong(userid: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_URL + `/accountmanagement/CheckAdminHeThong/${userid}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  isAdminApp(userid: number, appid: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_URL + `/accountmanagement/CheckAdminApp/${userid}/${appid}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  sortObject(obj) {
    return Object.keys(obj)
      .sort()
      .reduce(function (result, key) {
        result[key] = obj[key];
        return result;
      }, {});
  }

  isEqual(object, otherObject) {
    return Object.entries(this.sortObject(object)).toString() === Object.entries(this.sortObject(otherObject)).toString();
  }

  f_string_date(value: string): Date {
    return new Date(value.split('/')[2] + '-' + value.split('/')[1] + '-' + value.split('/')[0]);
  }

  getDSPhongBan(): Observable<ResultObjectModelAccount<any>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const url = API_URL + `/accountdepartmentmanagement/GetListDepartmentManagement?query.more=true`;
    const url = API_URL + `/accountdepartmentmanagement/GetListDepartmentManagement_New?query.more=true`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  getDSChucvu(): Observable<ResultObjectModelAccount<JobtitleManagementDTO[]>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_URL + `/jobtitlemanagement/GetListJobtitleManagement?query.more=true`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  getCompanyCode(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_URL + `/customermanagement/GetCompanyCode`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  GetCommonAccount(userid: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_URL + `/accountmanagement/GetCommonAccount/${userid}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  GetUnit_Level(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders("1.01");
    const url = `${API_URL_GENERAL}/unit-level`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  CheckRoles(id: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_URL + `/accountmanagement/CheckRole/${id}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  //================Start - Sử dụng gọi đến API HR============
  getDSChucvu_HR(): Observable<ResultObjectModelAccount<JobtitleManagementDTO[]>> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_HR_GENERAL}/GetListOnlyNhomChucDanh`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  GetListLoaiNhanVien(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_HR_GENERAL}/GetListStaffType`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  GetListNoiSinh(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_HR_GENERAL}/GetListProvinces`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  //================End - Sử dụng gọi đến API HR============
}
