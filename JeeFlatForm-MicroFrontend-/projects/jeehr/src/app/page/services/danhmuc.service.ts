import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from 'projects/jeehr/src/environments/environment';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import jwt_decode from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';

const API_JEEHR_GENERAL = environment.HOST_JEEHR_API + '/api/controllergeneral';
const API_JEEHR_DASHBOARD = environment.HOST_JEEHR_API + '/api/dashboard';
const KEY_SSO_TOKEN = 'sso_token';
const KEY_SSO_TOKEN_2 = 'sso_token_2';

@Injectable()
export class DanhMucChungService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private datePipe: DatePipe,
    private cookieService: CookieService) { }

  //===========================Start dùng cho nhân sự JeeHR=============================================
  GetListDanhMuc_CapCoCau(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_JEEHR_GENERAL + '/GetListDanhMuc_CapCoCau', { headers: httpHeaders });
  }
  GetListTypeLeaveByTitle(): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_JEEHR_GENERAL + `/GetListTypeLeaveByTitle`, { headers: httpHeaders });
  }
  getAllGio(gio: string): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_JEEHR_GENERAL + `/Get_Gio?Gio=${gio}`, { headers: httpHeaders });
  }
  GetListTypeApproval(): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetListTypeApproval`, { headers: httpHeaders });
  }
  GetListCaLamViec(): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetListCaLamViec`, { headers: httpHeaders });
  }
  GetListLyDoGiaiTrinh(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetListLyDoGiaiTrinh`, { headers: httpHeaders });
  }
  Get_ThoiGianCKTinhCong(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/Get_ThoiGianCKTinhCong`, { headers: httpHeaders });
  }
  GetListYearByEmp(id: string): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetListYearByEmp?id_nv=${id}`, { headers: httpHeaders });
  }
  GetListThangNam(type: string): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetListThangNam?type=${type}`, { headers: httpHeaders });
  }
  getDSBangLuongPhieuLuong(nam: number, thang: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/getDSBangLuongPhieuLuong?nam=${nam}&thang=${thang}`, {
      headers: httpHeaders,
    });
  }
  GetListYearByCustemerID(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetListYearByCustemerID`, { headers: httpHeaders });
  }
  Gettime(date: string): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<QueryResultsModel>(API_JEEHR_DASHBOARD + `/time?date=${date}`, { headers: httpHeaders });
  }
  Get_DSNhanVien(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    queryParams.more = true;
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = API_JEEHR_GENERAL + `/Get_DSNhanVien`;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  Get_DSNhanVien_All(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
    queryParams.more = true;
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = API_JEEHR_GENERAL + `/Get_DSNhanVien_All`;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  GetListProvincesByVacancyID(VacancyID: string, ID_KH: string): Observable<QueryResultsModel> {// Lấy danh sách tỉnh theo chức danh tuyển dụng
    return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetListProvincesByVacancyID?VacancyID=${VacancyID}&ID_KH=${ID_KH}`);
  }
  GetListDegreeByVacancyID(VacancyID: string, ID_KH: string): Observable<QueryResultsModel> {// Lấy danh sách bằng cấp theo chức danh tuyển dụng
    return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetListDegreeByVacancyID?VacancyID=${VacancyID}&ID_KH=${ID_KH}`);
  }
  GetListSchoolByVacancyID(VacancyID: string, ID_KH: string): Observable<QueryResultsModel> {// Lấy danh sách bằng cấp theo chức danh tuyển dụng
    return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetListSchoolByVacancyID?VacancyID=${VacancyID}&ID_KH=${ID_KH}`);
  }
  GetContentVacancyID(VacancyID: string, ID_KH: string): Observable<any> {// Lấy nội dung
    return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetContentVacancyID?VacancyID=${VacancyID}&ID_KH=${ID_KH}`);
  }
  GetListCachTinhTangCa(): Observable<QueryResultsModel> {//Get cách tính tăng ca
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + '/GetListCachTinhTangCa', { headers: httpHeaders });
  }
  getCoCauTheoQuyenXepCa(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(API_JEEHR_GENERAL + `/Get_CoCauToChuc_HR`, { headers: httpHeaders });
  }
  getListPositionbyStructure_All(idcocau: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(API_JEEHR_GENERAL + `/GetListPositionbyStructure_All?structureid=${idcocau}`, { headers: httpHeaders });
  }
  getListJobtitleByStructure_All(idcv: number, idcocau: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get(API_JEEHR_GENERAL + `/GetListJobtitleByStructure_All?structureid=${idcocau}&id_cv=${idcv}`, { headers: httpHeaders });
  }
  //===========================End dùng cho nhân sự JeeHR=============================================
  //==================================================================================================
  //Hàm convert thời gian sang định dang yyyy-MM-dd 00:00:00.000 để lưu dạng ngày vào db
  f_convertDateUTC(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + " 00:00:00.000";
    }
  }

  f_convertDate(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
    }
  }

  //====================Load image nếu không có avatar================
  getNameUser(value: string) {
    if (value != null && value != "") {
      return value.substring(0, 1).toUpperCase();
    }
  }

  getColorNameUser(value: any) {
    let result = '';
    switch (value) {
      case 'A':
        return (result = 'rgb(51 152 219)');
      case 'Ă':
        return (result = 'rgb(241, 196, 15)');
      case 'Â':
        return (result = 'rgb(142, 68, 173)');
      case 'B':
        return (result = '#0cb929');
      case 'C':
        return (result = 'rgb(91, 101, 243)');
      case 'D':
        return (result = 'rgb(44, 62, 80)');
      case 'Đ':
        return (result = 'rgb(127, 140, 141)');
      case 'E':
        return (result = 'rgb(26, 188, 156)');
      case 'Ê':
        return (result = 'rgb(51 152 219)');
      case 'G':
        return (result = 'rgb(241, 196, 15)');
      case 'H':
        return (result = 'rgb(248, 48, 109)');
      case 'I':
        return (result = 'rgb(142, 68, 173)');
      case 'K':
        return (result = '#2209b7');
      case 'L':
        return (result = 'rgb(44, 62, 80)');
      case 'M':
        return (result = 'rgb(127, 140, 141)');
      case 'N':
        return (result = 'rgb(197, 90, 240)');
      case 'O':
        return (result = 'rgb(51 152 219)');
      case 'Ô':
        return (result = 'rgb(241, 196, 15)');
      case 'Ơ':
        return (result = 'rgb(142, 68, 173)');
      case 'P':
        return (result = '#02c7ad');
      case 'Q':
        return (result = 'rgb(211, 84, 0)');
      case 'R':
        return (result = 'rgb(44, 62, 80)');
      case 'S':
        return (result = 'rgb(127, 140, 141)');
      case 'T':
        return (result = '#bd3d0a');
      case 'U':
        return (result = 'rgb(51 152 219)');
      case 'Ư':
        return (result = 'rgb(241, 196, 15)');
      case 'V':
        return (result = '#759e13');
      case 'X':
        return (result = 'rgb(142, 68, 173)');
      case 'W':
        return (result = 'rgb(211, 84, 0)');
    }
    return result;
  }

  getRoles() {
    const access_token = this.cookieService.get(KEY_SSO_TOKEN) + this.cookieService.get(KEY_SSO_TOKEN_2);
    if (access_token) {
      const data = jwt_decode(access_token)
      let role = data["customdata"]["jee-hr"].roles
      return role;
    }
  }
}
