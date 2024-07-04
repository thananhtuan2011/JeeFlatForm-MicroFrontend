import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'projects/jeework/src/environments/environment';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';

const API = environment.HOST_JEEWORK_API_2023;
const API_Report = API + '/api/report';
const API_Lite = environment.HOST_JEEWORK_API_2023 + '/api/general';

@Injectable({
	providedIn: 'root'
})
export class CongViecHoanThanhTrongNgayService {

	constructor(
		private http: HttpClient,
		private httpUtils: HttpUtilsService,
	) { }
	//tham số theo customer
	ts_phongban: string = '';
	ts_thumuc: string = '';
	ts_duan: string = '';
	ts_congviec: string = '';
	//viết hoa chữ đầu
	ts_duan_ToUpper: string = '';
	ts_congviec_ToUpper: string = '';
	ts_phongban_ToUpper: string = '';
	ts_thumuc_ToUpper: string = '';
	getthamso() {
		this.ts_phongban = localStorage.getItem("ts_phongban");
		this.ts_duan = localStorage.getItem("ts_duan");
		this.ts_thumuc = localStorage.getItem("ts_thumuc");
		this.ts_congviec = localStorage.getItem("ts_congviec")
		this.ts_phongban_ToUpper = localStorage.getItem("ts_phongban_ToUpper")
		this.ts_duan_ToUpper = localStorage.getItem("ts_duan_ToUpper")
		this.ts_thumuc_ToUpper = localStorage.getItem("ts_thumuc_ToUpper")
		this.ts_congviec_ToUpper = localStorage.getItem("ts_congviec_ToUpper")
	}
	loadCongViecTrongNgay(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_Report + '/BaoCao_CongViecHoanThanhTrongNgay';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	list_project_by_me_rule(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/list_project_by_me_all_or_viewall`, { headers: httpHeaders });
	}
}
