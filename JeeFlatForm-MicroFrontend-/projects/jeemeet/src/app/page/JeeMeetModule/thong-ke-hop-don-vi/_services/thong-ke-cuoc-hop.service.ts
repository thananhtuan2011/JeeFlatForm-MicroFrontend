
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, OnDestroy } from '@angular/core';
import { environment } from 'projects/jeemeet/src/environments/environment';
import { ITableService } from '../../_services/itable.service';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';


const API_PRODUCTS_URL = environment.APIROOT + '/api/quanlycuochop';
const API_URL_JEEACCOUNT = environment.HOST_JEEACCOUNT_API

@Injectable({
  providedIn: 'root'

})


export class ThongKeCuocHopService extends ITableService<any> implements OnDestroy {
  API_URL: string = API_PRODUCTS_URL;
  API_URL_FIND: string = API_PRODUCTS_URL + '';
  API_URL_EDIT: string = API_PRODUCTS_URL + '';
  API_URL_CTEATE: string = API_PRODUCTS_URL + '';
  API_URL_DELETE: string = API_PRODUCTS_URL + '';


  constructor(@Inject(HttpClient) http: any, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }


  GetDetail_DuyetByIdCH(RowID: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(environment.APIROOT + '/api/quanlycuochop' + `/Get_ChiTietCuocHopAdmin?meetingid=${RowID}`, { headers: httpHeaders });
  }

  GetListDonVi(): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(environment.APIROOT + '/api/quanlyfile' + `/danh-sach-phong-ban`,
      {
        headers: httpHeaders
      });
  }
  GetDSChucDanh(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_URL_JEEACCOUNT}/api/jobtitlemanagement/GetListJobtitleManagement?query.more=true`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  exportExcelDetail(filter): Observable<any> {

    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.parseFilter(filter);
    var url = API_PRODUCTS_URL + `/Excel_ThongKeCuocHop?page=${filter.page}&record=${filter.record}`;
    return this.http.get<any>(url, { headers: httpHeaders, params: httpParams });

  }

  danhDauDaXuLy(meetingid: number): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<QueryResultsModel>(
      environment.APIROOT + '/api/quanlycuochop' + `/DanhDauDaXuLy?meetingid=${meetingid}`,
      { headers: httpHeaders }
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());

  }


  //   changeIsSendSMS(key: any, type: any, value: any): Observable<any> {
  //     const httpHeaders = this.httpUtils.getHTTPHeaders();
  //     const url = this.API_URL + `/UpdateIsSendSMS?key=${key}&type=${type}&value=${value}`;

  //     return this.http.post<any>(url, null, { headers: httpHeaders });

  //   }
  // getDetailId(UserId: any): Observable<any> {
  //   const httpHeaders = this.httpUtils.getHTTPHeaders();
  //   return this.http.get<any>(API_PRODUCTS_URL + `/Detail_ThongKeBaoCaoCuocHop?id=${UserId}`, { headers: httpHeaders });
  // }
  ActiveThongKeVangCuocHop(IdCuocHop: any, IsActive: any): Observable<any> {

    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = this.API_URL_EDIT + `/Active_YKienGopY?IdCuocHop=${IdCuocHop}&IsActive=${IsActive}`;
    return this.http.post<any>(url, null, { headers: httpHeaders });
  }
  getThongKeVangCuocHopById(RowID: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(this.API_URL_FIND + `/GetListYKienGopY_detail?id=${RowID}`, { headers: httpHeaders });
  }

  deleteThongKeVangCuocHop(Id: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = this.API_URL + ` /Delete_KhoaHop?id=${Id}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  // CREATE =>  POST: add a new user to the server

  activeDetail(IdRow: any, IsActive: any): Observable<any> {

    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = this.API_URL_EDIT + `/Active_YKienGopYDetail?IdRow=${IdRow}&IsActive=${IsActive}`;
    return this.http.post<any>(url, null, { headers: httpHeaders });
  }
  getListVoteByStatus(id, voteStatus): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(
      this.API_URL + `/GetListVoteByStatus?id=${id}&voteStatus=${voteStatus}`,
      { headers: httpHeaders }
    );

  }



}

