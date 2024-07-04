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
export class CongViecMoiTrongNgayService {

  constructor(
    private http: HttpClient,
		private httpUtils: HttpUtilsService,
  ) { }
  loadCongViecMoiTrongNgay(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_Report + '/BaoCao_CongViecMoiTrongNgay';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
  _UpdateByKey(item: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_WORK+ '/Update-by-key';
    return this.http.post<QueryResultsModel>(url, item, {
        headers: httpHeaders,
    });
}
}
