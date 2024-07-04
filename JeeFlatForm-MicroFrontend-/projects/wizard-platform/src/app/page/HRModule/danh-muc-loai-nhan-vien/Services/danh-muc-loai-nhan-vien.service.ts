import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { HttpUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
import { StaffTypeModel } from '../Model/danh-muc-loai-nhan-vien.model';
const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/StaffType';
const API_URL = environment.HOST_JEEHR_API + '/api';

@Injectable()
export class DanhMucLoaiNhanVienService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	tongphep: string;
	ngayphep: string;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	getAllItems(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PRODUCTS_URL + '/ListAll?more=true', { headers: httpHeaders });
	}

	Create(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/Insert', item, { headers: httpHeaders });
	}

	Update(item: StaffTypeModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_PRODUCTS_URL + '/Update', item, { headers: httpHeaders });
	}

	// DELETE => delete the product from the server
	deleteItem(itemId: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Delete?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
}
