import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApprovalOTModel, OvertimeRegistrationModel } from '../Model/calendar.model';
import { environment } from 'projects/jeehr/src/environments/environment';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';

const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/overtimeregister';
const API_TangCa = environment.HOST_JEEHR_API + '/api/otapproval';
@Injectable()
export class OvertimeRegistrationService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	tongphep: number;
	ngayphep: number;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) {
	}

	getTenNguoiDuyet(): Observable<QueryResultsModel> {
		debugger
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_PRODUCTS_URL + `/Get_TenNguoiDuyet`, { headers: httpHeaders });
	}

	Get_SoGioTangCa(item: OvertimeRegistrationModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_PRODUCTS_URL + '/Get_SoGio', item, { headers: httpHeaders });
	}

	GuiTangCa(item: OvertimeRegistrationModel): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_PRODUCTS_URL + '/GuiTangCa', item, { headers: httpHeaders });
	}
	//=============================================================================================================
	Get_DSDangKyTangCa(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/Get_DSDangKyTangCa';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	//Delete
	deleteItem(id: number, LangCode: string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/HuyTangCa?id=${id}&&LangCode=${LangCode}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	// UPDATE => PUT: update the product on the server

	//====================================Tăng ca=========================================
	Get_ChiTietDuyetTangCa(itemId: number): Observable<ApprovalOTModel> {
		// &&LangCode=${LangCode}
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_TangCa + `/Get_ChiTietDuyetTangCa?ID=${itemId}`, { headers: httpHeaders }).pipe(
			map(res => {
				if (res && res.status === 1) {
					let item = new ApprovalOTModel();
					item.clear();
					Object.assign(item, {
						HoTen: '' + res.HoTen,
						NgayTangCa: '' + res.NgayTangCa,
						ThoiGian: '' + res.ThoiGian,
						SoGio: '' + res.SoGio,
						DuAn: '' + res.DuAn == 'null' ? "" : res.DuAn,
						GhiChu: res.GhiChu == 'undefined' ? "" : res.GhiChu,
						Lydo: res.Lydo,
						NgayGui: '' + res.NgayGui,
						IsFinal: res.IsFinal,
						Data_CapDuyet: res.Data_CapDuyet == 'undefined' ? "" : res.Data_CapDuyet,
						Data_ApprovingUser: res.Data_ApprovingUser,
						IsFixHours: res.IsFixHours,
						TextHinhThucChiTra: res.HinhThucChiTra,
						workList: res.workList,
					});
					return item;
				}
			})
		);
	}
}
