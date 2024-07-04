import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { HttpUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/orgstructure';
const API_URL = environment.HOST_JEEHR_API + '/api';

@Injectable()
export class DanhMucPhongBanService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	tongphep: string;
	ngayphep: string;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	GetListDanhMuc_CapCoCau(): Observable<any> {//Load danh sách cấp cơ cấu
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_URL + '/controllergeneral/GetListDanhMuc_CapCoCau', { headers: httpHeaders });
	}

	getListPhongBan(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + '/orgstructure/list', { headers: httpHeaders });
	}

	Create(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/AddNode', item, { headers: httpHeaders });
	}

	// DELETE => delete the product from the server
	deleteItem(itemId: number, title: string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/DeleteNode?id=${itemId}&title=${title}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
}
