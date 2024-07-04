import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { _ParseAST } from '@angular/compiler';
import { environment } from 'src/environments/environment';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryResultsModel } from 'src/app/modules/auth/models/query-params.model';
const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/controllergeneral';
const API_NHAPHOSO = environment.HOST_JEEHR_API + '/api/satff-info';

@Injectable()
export class DropdownProvinceService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }
	Get_Province(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/GetListProvinces`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}
	Get_District(id_provinces: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/GetListDistrictByProvinces?id_provinces=` + id_provinces;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}
	Get_Ward(id_district: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/GetListWardByDistrict?id_district=` + id_district;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}
	Get_TextWard(id_ward: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/GetWardByWardID?id_ward=` + id_ward;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}

	//====================================================Dùng cho nhận hồ sơ online======================================
	Get_Province_Rec(VacancyID: number, ID_KH: number): Observable<QueryResultsModel> {
		const url = `${API_PRODUCTS_URL}/GetListProvinces_Rec?VacancyID=${VacancyID}&ID_KH=${ID_KH}`;
		return this.http.get<QueryResultsModel>(url);
	}
	Get_District_Rec(VacancyID: number, id_provinces: string, ID_KH: number): Observable<QueryResultsModel> {
		const url = `${API_PRODUCTS_URL}/GetListDistrictByProvinces_Rec?VacancyID=${VacancyID}&id_provinces=${id_provinces}&ID_KH=${ID_KH}`;
		return this.http.get<QueryResultsModel>(url);
	}
	Get_Ward_Rec(VacancyID: number, id_district: string, ID_KH: number): Observable<QueryResultsModel> {
		const url = `${API_PRODUCTS_URL}/GetListWardByDistrict_Rec?VacancyID=${VacancyID}&id_district=${id_district}&ID_KH=${ID_KH}`;
		return this.http.get<QueryResultsModel>(url);
	}
	Get_TextWard_Rec(id_ward: string, ID_KH: number): Observable<QueryResultsModel> {
		const url = `${API_PRODUCTS_URL}/GetWardByWardID_Rec?id_ward=${id_ward}&ID_KH=${ID_KH}`;
		return this.http.get<QueryResultsModel>(url);
	}

	//====================================================Dùng cho nhập hồ sơ online======================================
	GetListProvincesByToken(token: string): Observable<QueryResultsModel> {
		const url = `${API_NHAPHOSO}/GetListProvincesByToken?token=${token}`;
		return this.http.get<QueryResultsModel>(url);
	}
	GetListDistrictByProvinces_Token(token: string, id_provinces: string): Observable<QueryResultsModel> {
		const url = `${API_NHAPHOSO}/GetListDistrictByProvinces_Token?token=${token}&id_provinces=` + id_provinces;
		return this.http.get<QueryResultsModel>(url);
	}
	GetListWardByDistrict_Token(token: string, id_district: string): Observable<QueryResultsModel> {
		const url = `${API_NHAPHOSO}/GetListWardByDistrict_Token?token=${token}&id_district=` + id_district;
		return this.http.get<QueryResultsModel>(url);
	}
	GetWardByWardID_Token(token: string, id_ward: string): Observable<QueryResultsModel> {
		const url = `${API_NHAPHOSO}/GetWardByWardID_Token?token=${token}&id_ward=` + id_ward;
		return this.http.get<QueryResultsModel>(url);
	}
}
