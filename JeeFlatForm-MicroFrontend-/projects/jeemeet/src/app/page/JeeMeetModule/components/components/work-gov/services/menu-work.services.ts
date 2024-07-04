import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';

import { QueryParamsModelNew } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeemeet/src/environments/environment';
// import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';
// import { QueryResultsModel } from '../../../models/query-models/query-results.model';



const API_TP_TASK_URL = environment.HOST_JEEWORK_API + '/api/tp-tasks/';
const API_WEWORK_LITE_URL = environment.HOST_JEEWORK_API + '/api/wework-lite/';
const API_JEEWORK_GOV = environment.HOST_JEEWORK_API + '/api/tp-tasks-gov';
const APIROOTS = environment.HOST_JEEWORK_API;
const API_attachment = environment.HOST_JEEWORK_API + '/api/attachment';

// api mới
const API_WORK = environment.HOST_JEEWORK_API + '/api/work/';
const API_MENU =environment.HOST_JEEWORK_API + '/api/menu/';
const API_ATTACHMENT = environment.HOST_JEEWORK_API + '/api/attachment';
const API_ACTIVITY = environment.HOST_JEEWORK_API + '/api/activity/';


@Injectable()
export class MenuWorkService {
	// lastFilter$: BehaviorSubject<QueryParamsModelNew> = new BehaviorSubject(new QueryParamsModelNew({}, 'asc', '', 0, 50));
	// ReadOnlyControl: boolean;
	// data_IsGui$ = new BehaviorSubject<any>([]);
	// data_IsLoad$ = new BehaviorSubject<any>([]);
	constructor(
		private http: HttpClient,
		private httpUtils: HttpUtilsService) { }


	public getAuthFromLocalStorage(): any {

		return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
	}

	// setup jee-comment
	getTopicObjectIDByComponentName(componentName: string): Observable<string> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API + `/api/comments/getByComponentName/${componentName}`;
		return this.http.get(url, {
			headers: httpHeaders,
			responseType: 'text'
		});
	}

	getDonViThucHien(queryParams: QueryParamsModelNew): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_MENU + 'list-menu-project';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	updateChiTietNhiemVu(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		// const url = API_TP_TASK_URL + 'Update-by-key';
		const url = API_WORK + 'Update-by-key';
		return this.http.post<QueryResultsModel>(url, item, {
			headers: httpHeaders,
			// params: httpParams
		});
	}
	getListTags(id_project_team): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_WEWORK_LITE_URL + `lite_tag?id_project_team=${id_project_team}`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			// params: httpParams
		});
	}
	getDataHoatDong(id_project_team): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ACTIVITY + `log-detail-by-work?id=${id_project_team}`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			// params: httpParams
		});
	}

  getDataHoatDong2(id_project_team): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ACTIVITY + `list-log-for-work?id=${id_project_team}`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			// params: httpParams
		});
	}

	//new [Kiên]
	FlowChart(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_WORK + `FlowChart?TaskID=${id}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	delete_attachment(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_ATTACHMENT}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }
}
