import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { WidgetModel } from '../../page-girdters-dashboard/Model/page-girdters-dashboard.model';
import { QueryParamsModelNew } from 'src/app/_metronic/core/models/pagram';
import { QueryParamsModel, QueryResultsModel } from 'src/app/modules/auth/models/query-params.model';
import { environment } from 'src/environments/environment';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';

const API_PRODUCTS_URL = environment.HOST_JEELANDINGPAGE_API + '/api/widgetdashboard';

@Injectable()
export class TemplateDashboardService {
	lastFilter$: BehaviorSubject<QueryParamsModelNew> = new BehaviorSubject(new QueryParamsModelNew({}, 'asc', '', 0, 50));
	ReadOnlyControl: boolean;
	API_PRODUCTS_URL = environment.HOST_JEELANDINGPAGE_API + `/api/widgetdashboard`;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) {
	}

	findData(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/Get_TemplateList';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	Update_Template(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + `/Update_Template`, item, { headers: httpHeaders });
	}

	Delete_Template(itemId: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Delete_Template?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	postUpdateWidget_Template(wiget: WidgetModel, id_temp: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + `/Post_UpdateWidget_Template?TempID=${id_temp}`;
		return this.http.post<any>(url, wiget, {
			headers: httpHeaders,
		});
	}

	getDSWidget_Template(id_temp: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + `/Get_DSWidget_Template?TempID=${id_temp}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}

	deleteWidget_Template(id: number, id_temp: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + `/Delete_Widget_Template/WidgetId=${id}?TempID=${id_temp}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}

	getDSWidgetConfig_Template(id_temp: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + `/Get_DSWidgetConfig_Template?TempID=${id_temp}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}

	createWidget_template(wiget: WidgetModel, id_temp: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + `/Create_Widget_Template?TempID=${id_temp}`;
		return this.http.post<any>(url, wiget, {
			headers: httpHeaders,
		});
	}

	PostUpdateTitleWidget_Template(wiget: WidgetModel, id_temp: number): Observable<any> {
		//WidgetModel
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + `/Post_UpdateTitleWidget_Template?TempID=${id_temp}`;
		return this.http.post<any>(url, wiget, {
			headers: httpHeaders,
		});
	}
}
