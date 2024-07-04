import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, OnDestroy } from '@angular/core';
import { ITableService } from '../../_services/itable.service';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeemeet/src/environments/environment';


const API_PRODUCTS_URL = environment.APIROOT + '/api/quanlycuochop';


@Injectable({
  providedIn: 'root'

})


export class QuanLyYKienGopYService extends ITableService<any> implements OnDestroy {
  API_URL: string = API_PRODUCTS_URL;
  API_URL_FIND: string = API_PRODUCTS_URL + '';
  API_URL_EDIT: string = API_PRODUCTS_URL + '';
  API_URL_CTEATE: string = API_PRODUCTS_URL + '';
  API_URL_DELETE: string = API_PRODUCTS_URL + '';


  constructor(@Inject(HttpClient) http: any, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);

  }


  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());

  }


//   changeIsSendSMS(key: any, type: any, value: any): Observable<any> {
//     const httpHeaders = this.httpUtils.getHTTPHeaders();
//     const url = this.API_URL + `/UpdateIsSendSMS?key=${key}&type=${type}&value=${value}`;

//     return this.http.post<any>(url, null, { headers: httpHeaders });

//   }
  ActiveQuanLyYKienGopY(IdCuocHop: any, IsActive: any): Observable<any> {

    const httpHeaders = this.httpUtils.getHTTPHeaders();
	const url = this.API_URL_EDIT+`/Active_YKienGopY?IdCuocHop=${IdCuocHop}&IsActive=${IsActive}`;
	return this.http.post<any>(url, null, { headers: httpHeaders });
}
getQuanLyYKienGopYById(Id: any): Observable<any> {
	const httpHeaders = this.httpUtils.getHTTPHeaders();
	return this.http.get<any>(this.API_URL_FIND + `/GetListYKienGopY_detail?id=${Id}`, { headers: httpHeaders });
}

deleteQuanLyYKienGopY(Id: any): Observable<any> {
	const httpHeaders = this.httpUtils.getHTTPHeaders();
	const url = this.API_URL+` /Delete_KhoaHop?id=${Id}`;
	return this.http.get<any>(url, { headers: httpHeaders });
}

// CREATE =>  POST: add a new user to the server

activeDetail(IdRow: any, IsActive: any): Observable<any> {

	const httpHeaders = this.httpUtils.getHTTPHeaders();
	const url =  this.API_URL_EDIT+`/Active_YKienGopYDetail?IdRow=${IdRow}&IsActive=${IsActive}`;
	return this.http.post<any>(url, null, { headers: httpHeaders });
}
getListVoteByStatus(id, voteStatus): Observable<any> {
	const httpHeaders = this.httpUtils.getHTTPHeaders();
	return this.http.get<any>(
		this.API_URL + `/GetListVoteByStatus?id=${id}&voteStatus=${voteStatus}`,
		{ headers: httpHeaders }
	);

}
//   changeIsSendEmail(key: any, type: any, value: any): Observable<any> {
//     const httpHeaders = this.httpUtils.getHTTPHeaders();
//     const url = this.API_URL + `/UpdateIsSendEmail?key=${key}&type=${type}&value=${value}`;

//     return this.http.post<any>(url, null, { headers: httpHeaders });

//   }


//   changeIsSendApp(key: any, type: any, value: any): Observable<any> {
//     const httpHeaders = this.httpUtils.getHTTPHeaders();
//     const url = this.API_URL + `/UpdateIsSendApp?key=${key}&type=${type}&value=${value}`;

//     return this.http.post<any>(url, null, { headers: httpHeaders });

//   }


}
