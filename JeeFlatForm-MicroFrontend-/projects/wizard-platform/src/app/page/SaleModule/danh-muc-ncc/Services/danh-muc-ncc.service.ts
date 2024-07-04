import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { HttpUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
import { DM_NCCModel } from '../Model/danh-muc-ncc.model';

const API_PRODUCTS_URL = environment.HOST_JEESALE_API + '/api/supplier';

@Injectable()
export class DanhMucNCCService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	tongphep: string;
	ngayphep: string;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	findData(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/list';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	getDM_NCCById(itemId: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PRODUCTS_URL + `/${itemId}`, { headers: httpHeaders });
	}

	Update(item: DM_NCCModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_PRODUCTS_URL, item, { headers: httpHeaders });
	}

	Delete(itemId: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/${itemId}`;
		return this.http.delete<any>(url, { headers: httpHeaders });
	}
}
