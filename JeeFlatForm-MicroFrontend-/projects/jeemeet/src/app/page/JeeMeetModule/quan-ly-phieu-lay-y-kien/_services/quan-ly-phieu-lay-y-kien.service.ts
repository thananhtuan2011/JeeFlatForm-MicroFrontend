
import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITableService } from '../../_services/itable.service';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeemeet/src/environments/environment';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';

const API_PRODUCTS_URL = environment.APIROOT + '/api/phieulayykien';
const API_ROOT_URL_KS = environment.APIROOT + '/api/bang-khao-sat';
const API_ROOT_URL_ = environment.APIROOT + "/bang-khao-sat";
@Injectable({
  providedIn: 'root'
})
export class PhieuLayYKienService extends ITableService<any> implements OnDestroy {
  API_URL_FIND: string = API_PRODUCTS_URL + '';
	API_URL_CTEATE: string = API_PRODUCTS_URL + '';
	API_URL_EDIT: string = API_PRODUCTS_URL + '';
	API_URL_DELETE: string = API_PRODUCTS_URL + '';
	API_URL: string = API_PRODUCTS_URL;
  constructor(@Inject(HttpClient) http: any, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }

  // getData__(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
	// 	const httpHeaders = this.httpUtils.getHTTPHeaders();
	// 	// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);
	// 	return this.http.get<any>(API_PRODUCTS_URL + "/GetListPhieuLayYKien", {
	// 		headers: httpHeaders,
	// 		// params: httpParams,
	// 	});
	// }
  getPhongHopById(Id: any): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_PRODUCTS_URL + `/GetDetail_PhongHop?id=${Id}`,
			{ headers: httpHeaders }
		);
	}
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  getResultSurveyList(
		IdKhaoSat: number = 0
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
		API_PRODUCTS_URL + `/GetDSKhaoSatDaDuocTraLoi?IdKhaoSat=${IdKhaoSat}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	getSurveyLists(IdKhaoSat: number = 0): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + `/GetDSKhaoSat?IdKhaoSat=${IdKhaoSat}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}

  checkTraLoi(IdKhaoSat: number = 0): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + `/check-tra-loi?IdKhaoSat=${IdKhaoSat}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
  add(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL_KS + "/ThucHienDanhGia", item, {
			headers: httpHeaders,
		});
	}
	updatekhaosat(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL_KS + "/ThucHienDanhGiaLai", item, {
			headers: httpHeaders,
		});
	}
	getQuanLyPhieuLayYKienById(Id: any): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_PRODUCTS_URL + `/GetListPhongHop_detail?id=${Id}`,
			{ headers: httpHeaders }
		);
	}
	GetAllPhongHop(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PRODUCTS_URL + `/GetAllPhongHop`,
			{ headers: httpHeaders }
		);
	}
	Delete_PhongHop(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Delete_PhongHop?id=${Id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	// update(item): Observable<any> {
	// 	const httpHeaders = this.httpUtils.getHTTPHeaders();
	// 	return this.http.post<any>(API_PRODUCTS_URL + '/Update_PhongHop', item, { headers: httpHeaders });
	// }
	// create(item): Observable<any> {
	// 	const httpHeaders = this.httpUtils.getHTTPHeaders();
	// 	return this.http.post<any>(API_PRODUCTS_URL + '/Insert_PhongHop', item, { headers: httpHeaders });
	// }
	// getWebsiteConfigNoLogin(codes): any {
	// 	const httpHeaders1 = new HttpHeaders().set("Token", environment.salt);
	// 	const httpHeaders = new HttpHeaders({
	// 		Token: environment.salt,
	// 		Authorization: "Bearer " + environment.salt,
	// 	});
	// 	const url = API_URL_CONFIG_NONE + `?codes=${codes}`;
	// 	return this.http.post<any>(url, null, { headers: httpHeaders1 });
	// }

	GetIsObligatePYKien(IdKhaoSat: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL_KS + `/GetIsObligatePYKien?IdKhaoSat=${IdKhaoSat}`,
			{ headers: httpHeaders }
		);

	}
}
