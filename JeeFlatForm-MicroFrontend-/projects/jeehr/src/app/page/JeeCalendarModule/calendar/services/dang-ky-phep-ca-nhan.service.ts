import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { DuyetNghiPhepCTModel, LeavePersonalModel } from '../Model/calendar.model';
import { environment } from 'projects/jeehr/src/environments/environment';
import { QueryParamsModel, QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';

const API_Leave = environment.HOST_JEEHR_API + '/api/leave';
const API_Dashboard = environment.HOST_JEEHR_API + '/api/dashboard';
const API_Leaveapproval = environment.HOST_JEEHR_API + '/api/leaveapproval';
@Injectable()
export class LeavePersonalService{
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	tongphep: number;
	ngayphep: number;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) {
	}

	//==================================Phép Calendar======================================================
	getDSPhep(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_Leave + `/DSPhep`, { headers: httpHeaders });
	}

	GuiDonXinPhep(item: LeavePersonalModel): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_Leave + '/GuiDonXinPhep', item, { headers: httpHeaders });
	}

	getSoNgayShipper(item: LeavePersonalModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_Leave + '/Get_SoNgay_Shipper', item, { headers: httpHeaders });
	}

	GuiDonXinPhepShipper(item: LeavePersonalModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_Leave + '/GuiDonXinPhep_Shipper', item, { headers: httpHeaders });
	}

	getSoNgay(item: LeavePersonalModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_Leave + '/Get_SoNgay', item, { headers: httpHeaders });
	}

	//======================================================================================================

	findDataNghiPhep(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_Leave + '/Get_DSNghiPhep';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	findDataHanMucPhep(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_Leave + '/Get_DSHanMucPhep';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	//=================================================================================================================
	Get_DSPhep(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_Leave + `/DSPhep`, { headers: httpHeaders });
	}

	//Delete
	deleteItem(id: number, lydo: string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_Leave}/HuyDonXinPhep_New?id=${id}&&lydo=${lydo}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	// UPDATE => PUT: update the product on the server
	

	UpdateDonXinPhep(item: LeavePersonalModel): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_Leave + '/Update_DonXinPhep', item, { headers: httpHeaders });
	}

	

	

	UpdateDonXinPhepShipper(item: LeavePersonalModel): Observable<any> {
		// Note: Add headers if needed (tokens/bearer)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_Leave + '/Update_DonXinPhep_Shipper', item, { headers: httpHeaders });
	}

	



	Get_ThoiGian(tungay: string, denngay: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Dashboard + `/Get_ThoiGian?tungay=${tungay}&denngay=${denngay}`, { headers: httpHeaders });
	}

	Get_ChiTietDuyetPhep(itemId: number, loai: number): Observable<DuyetNghiPhepCTModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Leaveapproval + `/Get_ChiTietDuyetPhep?ID=${itemId}&Loai=${loai}`, { headers: httpHeaders }).pipe(
			map(res => {
				if (res && res.status === 1) {
					let item = new DuyetNghiPhepCTModel();
					item.clear();
					Object.assign(item, {
						HinhThuc: '' + res.HinhThuc,
						HoTen: '' + res.HoTen,
						TenChucDanh: '' + res.TenChucDanh,
						MaNV: '' + res.MaNV,
						BoPhan: '' + res.BoPhan,
						BatDauTu: '' + res.BatDauTu,
						Den: '' + res.Den,
						LyDo: '' + res.LyDo,
						SoGio: '' + res.SoGio,
						Data_CapDuyet: res.Data_CapDuyet,
						Data_ApprovingUser: res.Data_ApprovingUser,
						DataHtml: res.data,
						ShowWord: res.xuatWord,
						NguoiHuy: res.NguoiHuy,
						LyDoHuy: res.LyDoHuy,
						NgayHuy: res.NgayHuy,
						IsDaHuy: res.IsDaHuy,
					});

					return item;
				}
			})
		);
	}
}
