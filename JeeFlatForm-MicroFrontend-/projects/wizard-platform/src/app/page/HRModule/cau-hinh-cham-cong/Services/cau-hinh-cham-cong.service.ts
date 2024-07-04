import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { HttpUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { QuanLyThietBiModel } from '../Model/cau-hinh-cham-cong.model';
const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/timekeepermanagement';

@Injectable()
export class CauHinhChamCongService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	tongphep: string;
	ngayphep: string;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	getAllItems(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PRODUCTS_URL + '/Get_DSMayChamCong_HR?more=true', { headers: httpHeaders });
	}

	Create(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_MayChamCong_HR', item, { headers: httpHeaders });
	}

	Update_Field(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_Field_HR', item, { headers: httpHeaders });
	}

	// DELETE => delete the product from the server
	deleteItem(itemId: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Delete_MayChamCong_HR?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
}
