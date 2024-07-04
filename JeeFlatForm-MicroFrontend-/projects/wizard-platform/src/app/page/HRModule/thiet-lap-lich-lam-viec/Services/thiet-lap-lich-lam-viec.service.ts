import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { HttpUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
import { StaffTypeModel } from '../Model/thiet-lap-lich-lam-viec.model';
const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/StaffType';
const API_URL = environment.HOST_JEEHR_API + '/api';

@Injectable()
export class ThietLapLichLamViecService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	tongphep: string;
	ngayphep: string;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	getAllItems(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_URL + '/shiftlist/template', { headers: httpHeaders });
	}


	Update(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_URL + `/shiftlist/template/${id}`, id, { headers: httpHeaders });
	}
}
