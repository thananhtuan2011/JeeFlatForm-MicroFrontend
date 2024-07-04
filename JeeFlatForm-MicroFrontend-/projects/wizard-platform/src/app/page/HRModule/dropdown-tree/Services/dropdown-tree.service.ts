import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { _ParseAST } from '@angular/compiler';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';

const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/orgstructure';

@Injectable()
export class DropdownTreeService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }
		Get_CoCauToChuc(): Observable<QueryResultsModel> {
			const httpHeaders = this.httpUtils.getHTTPHeaders();
			const url = `${API_PRODUCTS_URL}/Get_CoCauToChuc`;
			return this.http.get<QueryResultsModel>(url, {
				headers: httpHeaders,
			});
		}
}
