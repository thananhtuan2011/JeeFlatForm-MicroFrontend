import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject, of } from "rxjs";
import { Inject, Injectable } from "@angular/core"; 
import { environment } from "projects/jeeadmin/src/environments/environment";
import { HttpUtilsService } from "projects/jeeadmin/src/modules/crud/utils/http-utils.service";
import { QueryParamsModel, QueryParamsModelNew } from "../../../models/query-models/query-params.model";
import { QueryResultsModel } from "../../../models/query-models/query-results.model";

const API_DANGKY = environment.HOST_JEEADMIN_API + '/api/datphonghop';

@Injectable()
export class DatPhongService { 
	lastFilter$: BehaviorSubject<QueryParamsModelNew> = new BehaviorSubject(new QueryParamsModelNew({}, 'asc', '', 0, 50));
	ReadOnlyControl: boolean;
	tabSelected = new BehaviorSubject<any>([]);

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

    //API Đăng ký tài sản ======================================================
    getDataDangKy(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_DANGKY + '/Get_DSDatPhongHop';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	getDetail(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_DANGKY + `/DatPhong_Detail?Id=${Id}`, { headers: httpHeaders });
	}

	getDataQuanLy(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_DANGKY + '/DS_DatPhongHop';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	getDetailAdmin(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_DANGKY + `/DKDatPhong_Detail?Id=${Id}`, { headers: httpHeaders });
	}

    Insert_DatPhongHop(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_DANGKY + '/Insert_DatPhongHop', item, { headers: httpHeaders });
	}

	Delete_PhongHop(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_DANGKY}/Delete_DatPhongHop`;
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	//chỉ admin có thao tác này
	Update_DatPhongHop(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_DANGKY}/Update_DatPhongHop`;
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	Confirm_DatPhongHop(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_DANGKY}/Confirm_DatPhongHop`;
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	Get_DSHuyDatPhong(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_DANGKY + '/Get_DSHuyDatPhong';
		return this.http.get<any>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	getHuyDatPhong(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_DANGKY + '/Get_DSHuyDat';
		return this.http.get<any>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

}
