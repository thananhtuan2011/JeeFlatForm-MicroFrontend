import { Injectable } from '@angular/core';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { Observable } from 'rxjs';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/jeework/src/environments/environment';
const API = environment.HOST_JEEWORK_API_2023;
const API_Report = API + '/api/report';
const API_Lite = environment.HOST_JEEWORK_API_2023 + '/api/general';
const API_WORK = environment.HOST_JEEWORK_API_2023 + '/api/work';

@Injectable({
  providedIn: 'root'
})
export class QuaTrinhHoanThanhTheoNgayService {

  constructor(
    private http: HttpClient,
		private httpUtils: HttpUtilsService,
  ) { }
  loadQuatrinhhoanthanh(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_Report + '/qua-trinh-hoan-thanh';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
}
