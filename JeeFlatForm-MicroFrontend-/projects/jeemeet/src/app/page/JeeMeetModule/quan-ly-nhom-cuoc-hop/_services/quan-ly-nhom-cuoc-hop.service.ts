
import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITableService } from '../../_services/itable.service';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeemeet/src/environments/environment';

const API_PRODUCTS_URL = environment.APIROOT + '/api/ql-nhom-hop';
@Injectable({
  providedIn: 'root'
})
export class QuanLyNhomCuocHopService extends ITableService<any> implements OnDestroy {
  API_URL_FIND: string = API_PRODUCTS_URL + '';
	API_URL_CTEATE: string = API_PRODUCTS_URL + '';
	API_URL_EDIT: string = API_PRODUCTS_URL + '';
	API_URL_DELETE: string = API_PRODUCTS_URL + '';
	API_URL: string = API_PRODUCTS_URL;
  constructor(@Inject(HttpClient) http: any, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }
  getQuanLyNhomGhiChuCuocHopById(Id: any): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_PRODUCTS_URL + `/GetDetail_NhomHop?id=${Id}`,
			{ headers: httpHeaders }
		);
	}
  updateNhomGhiChuCuocHop(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(
			API_PRODUCTS_URL + "/Update_NhomCuocHop",
			item,
			{ headers: httpHeaders }
		);
	}
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
