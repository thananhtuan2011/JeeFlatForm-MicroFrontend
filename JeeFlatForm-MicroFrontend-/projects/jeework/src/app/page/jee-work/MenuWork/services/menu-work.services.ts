import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
// import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';
// import { QueryResultsModel } from '../../../models/query-models/query-results.model';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeework/src/environments/environment';
import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';


const API_TP_TASK_URL = environment.HOST_JEEWORK_API + '/api/tp-tasks/';
const API_WEWORK_LITE_URL = environment.HOST_JEEWORK_API + '/api/wework-lite/';
const API_JEEWORK_GOV = environment.HOST_JEEWORK_API + '/api/tp-tasks-gov';
const APIROOTS = environment.HOST_JEEWORK_API;
const API_attachment = environment.HOST_JEEWORK_API + '/api/attachment';

// api mới
const API_WORK = environment.HOST_JEEWORK_API_2023 + '/api/work/';
const API_MENU = environment.HOST_JEEWORK_API_2023 + '/api/menu/';
const API_ATTACHMENT = environment.HOST_JEEWORK_API_2023 + '/api/attachment';
const API_ACTIVITY = environment.HOST_JEEWORK_API_2023 + '/api/activity/';
const API_PROGRESS = environment.HOST_JEEWORK_API_2023 + '/api/progress/';


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
		const url = environment.HOST_JEEWORK_API_2023 + `/api/comments/getByComponentName/${componentName}`;
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
	FlowChartLive(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_WORK + `FlowChartLive?TaskID=${id}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	delete_attachment(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ATTACHMENT}/Delete?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	//=====Bổ sung call api đánh dâu xem công việc 05/07/2023
	lite_inset_task_view(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_WORK + 'insert-task-view';
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}


	FlowProgress(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PROGRESS + `flow-progress?TaskID=${id}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}

	HistoryRefuse(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_WORK + `history-refuse?TaskID=${id}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	HistoryChangeAssignee(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_WORK + `histoty-change-assignee?taskid=${id}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	LogDetailByWork2(id: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_ACTIVITY + 'list-log-for-work?id=' + id;
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
        });
    }
	// setup avatar
    getNameUser(val) {
        if (val) {
            var list = val.split(' ');
            return list[list.length - 1];
        }
        return '';
    }

    getColorNameUser(fullname) {
        var name = this.getNameUser(fullname).substr(0, 1);
        switch (name) {
            case 'A':
                return '#6FE80C';
            case 'B':
                return '#02c7ad';
            case 'C':
                return 'rgb(123, 104, 238)';
            case 'D':
                return '#16C6E5';
            case 'Đ':
                return '#959001';
            case 'E':
                return '#16AB6B';
            case 'G':
                return '#2757E7';
            case 'H':
                return '#B70B3F';
            case 'I':
                return '#390FE1';
            case 'J':
                return 'rgb(4, 169, 244)';
            case 'K':
                return '#2209b7';
            case 'L':
                return '#759e13';
            case 'M':
                return 'rgb(255, 120, 0)';
            case 'N':
                return '#bd3d0a';
            case 'O':
                return '#10CF99';
            case 'P':
                return '#B60B6F';
            case 'Q':
                return 'rgb(27, 188, 156)';
            case 'R':
                return '#6720F5';
            case 'S':
                return '#14A0DC';
            case 'T':
                return 'rgb(244, 44, 44)';
            case 'U':
                return '#DC338B';
            case 'V':
                return '#DF830B';
            case 'X':
                return 'rgb(230, 81, 0)';
            case 'W':
                return '#BA08C7';
            default:
                return '#21BD1C';
        }
    }

	Get_VerWeb(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/menu/Get_VerWeb?id=${id}`, { headers: httpHeaders });
	}

	ListUrdesTask(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.2);
		const url = API_WORK + `list-urges-task?TaskID=${id}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
}
