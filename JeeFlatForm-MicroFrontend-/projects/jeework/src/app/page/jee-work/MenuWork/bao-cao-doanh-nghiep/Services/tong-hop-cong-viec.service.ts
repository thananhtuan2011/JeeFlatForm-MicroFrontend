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
export class TongHopCongViecService {

  constructor(
    private http: HttpClient,
		private httpUtils: HttpUtilsService,
  ) { }
  loadTongHopCongViec(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_Report + '/BaoCao_TongHopCongViec';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	loadDSTongHopCongViec(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_Report + '/BaoCao_TongHopCongViecDanhSach';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
  list_project_by_me_rule43(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/list_project_by_me_rule_viewall`, { headers: httpHeaders });
	}
}
