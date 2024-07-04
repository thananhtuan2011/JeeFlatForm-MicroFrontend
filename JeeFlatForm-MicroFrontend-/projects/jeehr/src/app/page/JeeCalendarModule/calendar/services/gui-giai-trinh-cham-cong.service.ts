import { Inject, Injectable } from '@angular/core';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'projects/jeehr/src/environments/environment';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';

const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/giaitrinhchamcong';

@Injectable()
export class GuiGiaiTrinhChamCongService{
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	Visible: boolean;
	constructor(
		private http: HttpClient,
		private httpUtils: HttpUtilsService) {
	}

	//====Danh sách giải trình===
	findData(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/Get_DSGiaiTrinh';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	//====Danh sách chi tiết giải trình===
	Get_DSChiTietGiaiTrinh(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/Get_DSChiTietGiaiTrinh';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	//====Danh sách ngày===
	Get_DSNgay(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/Get_DSNgay';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	//=======Get tên người duyệt
	Get_TenNguoiDuyet(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_PRODUCTS_URL + `/Get_TenNguoiDuyet`, { headers: httpHeaders });
	}

	//============Hủy==================
	HuyGiaiTrinh(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/HuyGiaiTrinh?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	HuyChiTietGiaiTrinh(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/HuyChiTietGiaiTrinh?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	// CREATE =>  POST: add a new product to the server 
	// Get_Info(): Observable<any> {
	// 	const httpHeaders = this.httpUtils.getHTTPHeaders();
	// 	return this.http.get<QueryResultsModel>(API_PRODUCTS_URL + `/GetInfo`, { headers: httpHeaders });
	// }
	GuiGiaiTrinh(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_PRODUCTS_URL + '/GuiGiaiTrinh', item, { headers: httpHeaders });
	}

	Insert_ChiTietGiaiTrinh(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_PRODUCTS_URL + '/Insert_ChiTietGiaiTrinh', item, { headers: httpHeaders });
	}

}
