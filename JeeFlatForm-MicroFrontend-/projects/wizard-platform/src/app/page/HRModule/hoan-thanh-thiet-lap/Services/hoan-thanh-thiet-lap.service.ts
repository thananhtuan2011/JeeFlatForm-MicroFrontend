import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { HttpUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/timesheets';
const HOST_JEEACCOUNT_API = environment.HOST_JEEACCOUNT_API ;
@Injectable()
export class HoanhThanhThietLapService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	tongphep: string;
	ngayphep: string;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	UpdateInitStatusApp(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = HOST_JEEACCOUNT_API + `/api/permissionmanagement/UpdateInitStatusApp/1/2`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
}
