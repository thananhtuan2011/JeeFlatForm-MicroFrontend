import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ChangeShiftStaffbyStaffModel, ChiTietDoiCaModel } from '../Model/calendar.model';
import { environment } from 'projects/jeehr/src/environments/environment';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';

const API_DoiCa = environment.HOST_JEEHR_API + '/api/changeshiftnv';
const API_DuyetDoiCa = environment.HOST_JEEHR_API + '/api/changeshiftapproval';
@Injectable()
export class ChangeShiftStaffbyStaffService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	tongphep: string;
	ngayphep: string;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	findData(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_DoiCa + '/Get_ChangeShiftList';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	findDataHanMucPhep(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_DoiCa + '/Get_DSHanMucPhep';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	//=================================================================================================================
	Get_DSPhep(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_DoiCa + `/DSPhep`, { headers: httpHeaders });
	}

	//Delete
	deleteItem(id: number, LangCode: string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_DoiCa}/Del_ChangeShift?id=${id}&&LangCode=${LangCode}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	// UPDATE => PUT: update the product on the server
	GuiDonXinDoiCa(item: ChangeShiftStaffbyStaffModel): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_DoiCa + '/Send_ChangeShift', item, { headers: httpHeaders });
	}

	UpdateDonXinPhep(item: ChangeShiftStaffbyStaffModel): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_DoiCa + '/Update_DonXinPhep', item, { headers: httpHeaders });
	}
	Get_TenNguoiDuyet(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_DoiCa}/Get_TenNguoiDuyet`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	getDSPhep(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_DoiCa + `/DSPhep`, { headers: httpHeaders });
	}
    Get_CaLamViecTheoNgay(date: string, id_nv: string): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_DoiCa + `/Get_Shift?date=${date}&id_nv=${id_nv}`, { headers: httpHeaders });
	}
	
	Get_ChiTietDonXinDoiCa(itemId: number): Observable<ChiTietDoiCaModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_DuyetDoiCa + `/Get_ChiTietDonXinDoiCa?ID=${itemId}`, { headers: httpHeaders }).pipe(
			map(res => {
				if (res && res.status === 1) {
					let item = new ChiTietDoiCaModel();
					item.clear();
					Object.assign(item, {
						NhanVien: '' + res.NhanVien,
						NgayGui: '' + res.NgayGui,
						LyDo: '' + res.LyDo,
						// MaNV: '' + res.MaNV,
						Data_CapDuyet: res.Data_CapDuyet,
						Data_ApprovingUser: res.Data_ApprovingUser,
						data: res.data,
					});

					return item;
				}
			})
		);
	}
}
