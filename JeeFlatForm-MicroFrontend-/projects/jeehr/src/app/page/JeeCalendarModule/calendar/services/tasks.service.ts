import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/jeehr/src/environments/environment';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';


const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/tasks';
const API_DashBoard = environment.HOST_JEEHR_API + '/api/dashboard';
const API_JeeWork = environment.HOST_JEEWORK_API_2023 + '/api/calendar';
const API_JeeMeet = environment.HOST_JEEMEETING_API + '/api/Meeting';
@Injectable()
export class CalendarService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	ReadOnlyControl: boolean;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new oduct to the server
	CreateItem(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_PRODUCTS_URL + '/LuuTask', item, { headers: httpHeaders });
	}
	getTypes(): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PRODUCTS_URL + '/Get_DSTasksType', { headers: httpHeaders });
	}
	// READ
	getAllItems(loai): Observable<any[]> {
		
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any[]>(API_PRODUCTS_URL + `/Get_DSTasks?more=true&Loai=${loai}`, { headers: httpHeaders });
	}
	findData(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/Get_DSTasks';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	// UPDATE => PUT: update the product on the server
	UpdateItem(item: any): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(API_PRODUCTS_URL + '/LuuTask', item, { headers: httpHeaders });
	}
	// UPDATE => PUT: update the product on the server
	ChangeStatusTask(item: any): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_PRODUCTS_URL + '/ChangeStatusTask', item, { headers: httpHeaders });
	}
	// UPDATE => PUT: update the product on the server
	SortTask(id, index, loai): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get(API_PRODUCTS_URL + `/SortTask?id=${id}&index=${index}&loai=${loai}`, { headers: httpHeaders });
	}
	// DELETE => delete the product from the server
	DeleteItem(itemId: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/XoaTask?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	// DELETE => delete the product from the server
	DeleteSuccess(typeId: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/XoaTaskSucess?id=${typeId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	// UPDATE => PUT: update the product on the server
	UpdateType(item: any): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post(API_PRODUCTS_URL + '/LuuTaskType', item, { headers: httpHeaders });
	}
	// DELETE => delete the product from the server
	DeleteType(itemId: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/XoaTaskType?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	//========================================Dùng cho phần đăng ký phép=================================================================================
	Get_ThoiGian(tungay: string, denngay: string): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_DashBoard + `/Get_ThoiGian?tungay=${tungay}&denngay=${denngay}`, { headers: httpHeaders });
	}
	
	 //=======================Load danh sách đăng ký==============================
	 findDataCalendar(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_DashBoard + '/Get_DSDangKy';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

	findDataJeeWork(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_JeeWork + '/list-event';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

	findDataJeeMeet(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_JeeMeet + '/calendar-event';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }
}
