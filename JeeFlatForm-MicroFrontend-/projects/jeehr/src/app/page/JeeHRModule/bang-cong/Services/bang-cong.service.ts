import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/jeehr/src/environments/environment';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
import { BangCongModel } from '../Model/bang-cong.model';

const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/timesheets';

@Injectable()
export class BangCongService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	tongphep: string;
	ngayphep: string;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	findData(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/Get_BangChamCong';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	findDuLieuChamCong(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/Get_ChiTietChamCong';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	//Xác nhận bảng chấm công
	ConfirmTimesheet(thang: string, nam: string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Confirm_BCC?thang=${thang}&nam=${nam}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	// UPDATE => PUT: update the product on the server
	SendComment(item: BangCongModel): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_PRODUCTS_URL + '/SendComment', item, { headers: httpHeaders });
	}
	
	getNameUser(value: string) {
		return value.substring(0, 1).toUpperCase();
	}

	getColorNameUser(value: any) {
		let result = "";
		switch (value) {
			case "A":
				return result = "rgb(51 152 219)";
			case "Ă":
				return result = "rgb(241, 196, 15)";
			case "Â":
				return result = "rgb(142, 68, 173)";
			case "B":
				return result = "#0cb929";
			case "C":
				return result = "rgb(91, 101, 243)";
			case "D":
				return result = "rgb(44, 62, 80)";
			case "Đ":
				return result = "rgb(127, 140, 141)";
			case "E":
				return result = "rgb(26, 188, 156)";
			case "Ê":
				return result = "rgb(51 152 219)";
			case "G":
				return result = "rgb(241, 196, 15)";
			case "H":
				return result = "rgb(248, 48, 109)";
			case "I":
				return result = "rgb(142, 68, 173)";
			case "K":
				return result = "#2209b7";
			case "L":
				return result = "rgb(44, 62, 80)";
			case "M":
				return result = "rgb(127, 140, 141)";
			case "N":
				return result = "rgb(197, 90, 240)";
			case "O":
				return result = "rgb(51 152 219)";
			case "Ô":
				return result = "rgb(241, 196, 15)";
			case "Ơ":
				return result = "rgb(142, 68, 173)";
			case "P":
				return result = "#02c7ad";
			case "Q":
				return result = "rgb(211, 84, 0)";
			case "R":
				return result = "rgb(44, 62, 80)";
			case "S":
				return result = "rgb(127, 140, 141)";
			case "T":
				return result = "#bd3d0a";
			case "U":
				return result = "rgb(51 152 219)";
			case "Ư":
				return result = "rgb(241, 196, 15)";
			case "V":
				return result = "#759e13";
			case "X":
				return result = "rgb(142, 68, 173)";
			case "W":
				return result = "rgb(211, 84, 0)";
		}
		return result;
	}
}
