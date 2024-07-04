import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject, of } from "rxjs";
import { Inject, Injectable } from "@angular/core"; 
import { environment } from "projects/jeeadmin/src/environments/environment";
import { HttpUtilsService } from "projects/jeeadmin/src/modules/crud/utils/http-utils.service";
import { QueryParamsModel, QueryParamsModelNew } from "../../../models/query-models/query-params.model";
import { QueryResultsModel } from "../../../models/query-models/query-results.model";
import { XacNhanYeuCauModel, YeuCauVPPModel } from "../Model/yeucau-vpp.model";

const API_YEUCAU = environment.HOST_JEEADMIN_API + '/api/yeucau-vpp';
const API_HANMUC = environment.HOST_JEEADMIN_API + '/api/hanmuc-phongban';

@Injectable()
export class VanPhongPhamService { 
	lastFilter$: BehaviorSubject<QueryParamsModelNew> = new BehaviorSubject(new QueryParamsModelNew({}, 'asc', '', 0, 50));
	ReadOnlyControl: boolean;
	tabSelected = new BehaviorSubject<any>([]);
	data_IsLoad$ = new BehaviorSubject<any>([]);
	activeID$ = new BehaviorSubject<string>('');

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }
	
	getHanMucDetail(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_HANMUC + '/GetDetailByDepartment';
		return this.http.get<any>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	getDetailById(itemId: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_YEUCAU + `/${itemId}`, { headers: httpHeaders });
	}

	getIdPhongBan(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_YEUCAU + `/GetIdDepartment`, { headers: httpHeaders });
	}

	deletePhieuYeuCau(itemId: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_YEUCAU}/${itemId}`;
		return this.http.delete<any>(url, { headers: httpHeaders });
	}

	createPhieuYeuCau(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<YeuCauVPPModel>(API_YEUCAU, item, { headers: httpHeaders });
	}

	xacNhanDaNhan(Id: number){
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_YEUCAU + '/Received?Id='+Id;
		return this.http.post<any>(url, [], {
			headers: httpHeaders,
		});
	}

	loadTypeOption(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_YEUCAU + '/tab-request';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	loadYeuCau(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_YEUCAU + '/list-request';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	processTask(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_YEUCAU + '/ProcessTask';
		return this.http.post<any>(url, item, {
			headers: httpHeaders,
		});
	}

	xacNhanYeuCau(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_YEUCAU + '/Confirm';
		return this.http.post<XacNhanYeuCauModel>(url, item, {
			headers: httpHeaders,
		});
	}

	xacNhanDaGiao(Id: number){
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_YEUCAU + '/Delivered?Id='+Id;
		return this.http.post<any>(url, [], {
			headers: httpHeaders,
		});
	}
}
