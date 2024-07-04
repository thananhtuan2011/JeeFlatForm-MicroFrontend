import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { environment } from 'projects/jeeworkflow/src/environments/environment';
import { HttpUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/http-utils.service';

const API_JEEWF_GENERAL = environment.HOST_JEEWORKFLOW_API + '/api/controllergeneral';
@Injectable()
export class DanhMucChungService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService, private datePipe: DatePipe,) { }

  public getAuthFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }

  GetDSGiaiDoan(id: number): Observable<any> {//Lấy danh sách giai đoạn theo quy trình
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_JEEWF_GENERAL + `/GetDSGiaiDoan?id=${id}`, { headers: httpHeaders });
  }

  GetDSNguoiTheoDoi(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_JEEWF_GENERAL + `/GetDSNguoiTheoDoi`, { headers: httpHeaders });
  }

  GetDSNguoiApDung(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_JEEWF_GENERAL + `/GetDSNguoiApDung`, { headers: httpHeaders });
  }

  GetDSQuyTrinh(typeid: number): Observable<any> {//Lấy danh sách giai quy trình
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_JEEWF_GENERAL + `/processes-by-userid/${typeid}`, { headers: httpHeaders });
  }

  getInfoProcessName(id: number): Observable<any> {//Lấy thông tin quy trìnnh
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_JEEWF_GENERAL + `/getInfoProcessName?id=${id}`, { headers: httpHeaders });
  }

  getProcessName(id: number): Observable<any> {//Lấy tên quy trình
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_JEEWF_GENERAL + `/getProcessName?id=${id}`, { headers: httpHeaders });
  }
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
}
