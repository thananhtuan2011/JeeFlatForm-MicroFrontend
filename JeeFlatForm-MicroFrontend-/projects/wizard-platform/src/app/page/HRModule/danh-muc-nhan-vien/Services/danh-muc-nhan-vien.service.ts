import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { HttpUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
import { PersonalInfoModel } from '../Model/danh-muc-nhan-vien.model';
import { map } from 'rxjs/operators';
const API_PRODUCTS_URL = environment.HOST_JEEHR_API;
const API_ACCOUNTMANAGEMENT = environment.HOST_JEEACCOUNT_API + '/api/accountmanagement';
@Injectable()
export class DanhMucNhanVienService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	tongphep: string;
	ngayphep: string;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	findData(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/api/searchemployee/Get_DSNhanVien';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	DetailsStaffID(staffid: string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ACCOUNTMANAGEMENT + `/hr/${staffid}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}

	Update_NhanVien_TTCV(item: PersonalInfoModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_PRODUCTS_URL + '/api/interaction/staff/wizard_infomation', item, { headers: httpHeaders });
	}
}
