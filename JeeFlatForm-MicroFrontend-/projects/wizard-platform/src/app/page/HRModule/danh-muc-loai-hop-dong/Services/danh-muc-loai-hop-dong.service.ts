import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { HttpUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/ContractType';
const API_URL = environment.HOST_JEEHR_API + '/api';

@Injectable()
export class DanhMucLoaiHopDongService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	tongphep: string;
	ngayphep: string;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	GetListStaffType(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + `/controllergeneral/GetListStaffType`, { headers: httpHeaders });
	}

	GetListPrintedForm(loai: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + `/controllergeneral/GetListPrintedForm?loai=${loai}`, { headers: httpHeaders });
	}

	GetListMauDanhGia(): Observable<QueryResultsModel> {// Danh sách mẫu đánh giá hợp đồng
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + `/controllergeneral/GetListMauDanhGia`, { headers: httpHeaders });
	}

	GetDSDonViThoiHanHD(langcode: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + `/controllergeneral/GetDSDonViThoiHanHD?langcode=${langcode}`, { headers: httpHeaders });
	}

	getAllItems(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PRODUCTS_URL + '/Get_DSLoaiHopDong?more=true', { headers: httpHeaders });
	}

	Create(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_LoaiHopDong', item, { headers: httpHeaders });
	}

	// DELETE => delete the product from the server

	deleteItem(itemId: number, tenloai: string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Delete_LoaiHopDong?id=${itemId}&TenLoai=${tenloai}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
}
