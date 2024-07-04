import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeework/src/environments/environment';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
import { WorkDraftModel } from '../../../models/JeeWorkModel';

const API_MENU = environment.HOST_JEEWORK_API + '/api/menu';
const API_Lite = environment.HOST_JEEWORK_API + '/api/general';
const API_PRODUCTS_URL = environment.HOST_JEELANDINGPAGE_API + '/api/widgetdashboard';
const API_WIDGET = environment.HOST_JEEWORK_API + '/api/widgets';
const API_attachment = environment.HOST_JEEWORK_API + '/api/attachment';

@Injectable()
export class CongViecTheoDuAnService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	ReadOnlyControl: boolean;
	filterStorage: any;
	filterListItem: any;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	getNameUser(value: string) {
		if(value != null && value != ""){
			return value.substring(0, 1).toUpperCase();
		}
		return "";
	}

	getColorNameUser(value: any) {
		let result = '';
		switch (value) {
			case 'A':
				return (result = 'rgb(51 152 219)');
			case 'Ă':
				return (result = 'rgb(241, 196, 15)');
			case 'Â':
				return (result = 'rgb(142, 68, 173)');
			case 'B':
				return (result = '#0cb929');
			case 'C':
				return (result = 'rgb(91, 101, 243)');
			case 'D':
				return (result = 'rgb(44, 62, 80)');
			case 'Đ':
				return (result = 'rgb(127, 140, 141)');
			case 'E':
				return (result = 'rgb(26, 188, 156)');
			case 'Ê':
				return (result = 'rgb(51 152 219)');
			case 'G':
				return (result = 'rgb(241, 196, 15)');
			case 'H':
				return (result = 'rgb(248, 48, 109)');
			case 'I':
				return (result = 'rgb(142, 68, 173)');
			case 'K':
				return (result = '#2209b7');
			case 'L':
				return (result = 'rgb(44, 62, 80)');
			case 'M':
				return (result = 'rgb(127, 140, 141)');
			case 'N':
				return (result = 'rgb(197, 90, 240)');
			case 'O':
				return (result = 'rgb(51 152 219)');
			case 'Ô':
				return (result = 'rgb(241, 196, 15)');
			case 'Ơ':
				return (result = 'rgb(142, 68, 173)');
			case 'P':
				return (result = '#02c7ad');
			case 'Q':
				return (result = 'rgb(211, 84, 0)');
			case 'R':
				return (result = 'rgb(44, 62, 80)');
			case 'S':
				return (result = 'rgb(127, 140, 141)');
			case 'T':
				return (result = '#bd3d0a');
			case 'U':
				return (result = 'rgb(51 152 219)');
			case 'Ư':
				return (result = 'rgb(241, 196, 15)');
			case 'V':
				return (result = '#759e13');
			case 'X':
				return (result = 'rgb(142, 68, 173)');
			case 'W':
				return (result = 'rgb(211, 84, 0)');
		}
		return result;
	}


    delete_attachment(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_attachment}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

	lite_project_by_manager(keyword: string = ""): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/lite_project_by_manager?keyword=${keyword}`, { headers: httpHeaders });
	}
	//======================Thiết lập dropdown====================================
	getDSWork(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + '/Get_DSWork';
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}

	getDSWorkConfig(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + '/Get_DSWorkConfig';
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}

	Post_UpdateTitleDrd(wiget: any): Observable<any> {
		//WidgetModel
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + '/Post_UpdateTitleDrd';
		return this.http.post<any>(url, wiget, {
			headers: httpHeaders,
		});
	}

	Delete_Drd(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + `/Delete_Drd/Id=${id}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}

	Create_Drd(wiget: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + '/Create_Drd';
		return this.http.post<any>(url, wiget, {
			headers: httpHeaders,
		});
	}

	//==============Lấy danh sách nhân viên theo phòng ban========================

	//=============================================================================

	getThamSo(id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/get-tham-so-by-customer?id=${id}&&checkToUpper=true`, { headers: httpHeaders });
	}


	//==================Lấy danh sách công việc widget tổng hợp công việc
	loadTongHopCongViec(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_WIDGET + '/list-task-work-summary';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
}
