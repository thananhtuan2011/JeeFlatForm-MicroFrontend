import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { environment } from 'projects/jeehr/src/environments/environment';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';

const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/p_payroll';

@Injectable()
export class XemPhieuLuongService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	// CREATE =>  POST: add a new product to the server
		
	InPhieuLuong(thang:string, nam:string, bangluongid:string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get(API_PRODUCTS_URL + `/InPhieuLuong?Thang=${thang}&&Nam=${nam}&&bangluongid=${bangluongid}`, { headers: httpHeaders });
	}


}
