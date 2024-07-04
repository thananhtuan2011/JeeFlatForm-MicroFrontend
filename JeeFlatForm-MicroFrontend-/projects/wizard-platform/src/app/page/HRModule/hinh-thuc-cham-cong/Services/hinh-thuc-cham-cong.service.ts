import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { HttpUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
import { StaffTypeModel } from '../Model/hinh-thuc-cham-cong.model';
const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/shiftlist';

@Injectable()
export class HinhThucChamCongService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	tongphep: string;
	ngayphep: string;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	Update(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_PRODUCTS_URL + '/auto-timekeeping', "", { headers: httpHeaders });
	}
}
