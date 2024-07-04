import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApprovalOTModel, ChangeApproverData, QuanLyDuyetModel } from '../Model/calendar.model';
import { environment } from 'projects/jeehr/src/environments/environment';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel, QueryResultsModel2 } from '../../../models/query-models/query-results.model';

const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/leaveapproval';
const API_TangCa = environment.HOST_JEEHR_API + '/api/otapproval';
const API_DoiCa = environment.HOST_JEEHR_API + '/api/changeshiftapproval';
const API_GiaiTrinh = environment.HOST_JEEHR_API + '/api/giaitrinhchamcongapproval';
const API_ThoiViec = environment.HOST_JEEHR_API + '/api/resignapproval';
const API_TuyenDung = environment.HOST_JEEHR_API + '/api/recruitmentapproval';

@Injectable()
export class QuanLyDuyetService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	//====================================Phép============================================
	getItemById(itemId: number, loai: number): Observable<QuanLyDuyetModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PRODUCTS_URL + `/Get_ChiTietDuyetPhep?ID=${itemId}&Loai=${loai}`, { headers: httpHeaders }).pipe(
			map(res => {
				if (res && res.status === 1) {
					let item = new QuanLyDuyetModel();
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
					});

					return item;
				}
			})
		);
	}

	DuyetPhepCT(item: QuanLyDuyetModel): Observable<QueryResultsModel2> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/DuyetPhep', item, { headers: httpHeaders, });
	}

	KyDuyetPhep(item: QuanLyDuyetModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/KyDuyetPhep', item, { headers: httpHeaders, });
	}

	ChuyenPhep(item: ChangeApproverData): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/change-approver', item, { headers: httpHeaders, });
	}
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
						IsDuyet: res.IsDuyet,
						TextHinhThucChiTra: res.HinhThucChiTra,
						workList: res.workList,
					});
					return item;
				}
			})
		);
	}

	ApprovalOTDetail(item: ApprovalOTModel): Observable<QueryResultsModel2> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_TangCa + '/DuyetTangCa', item, { headers: httpHeaders, });
	}

	ChuyenTangCa(item: ChangeApproverData): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_TangCa + '/change-approver', item, { headers: httpHeaders, });
	}
	//===================================Đổi ca========================================
	DuyetDonXinDoiCa(item: QuanLyDuyetModel): Observable<QueryResultsModel2> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_DoiCa + '/DuyetDonXinDoiCa', item, { headers: httpHeaders, });
	}

	Get_ChiTietDonXinDoiCa(itemId: number): Observable<QuanLyDuyetModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_DoiCa + `/Get_ChiTietDonXinDoiCa?ID=${itemId}`, { headers: httpHeaders }).pipe(
			map(res => {
				if (res && res.status === 1) {
					let item = new QuanLyDuyetModel();
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

	ChuyenDoiCa(item: ChangeApproverData): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_DoiCa + '/change-approver', item, { headers: httpHeaders, });
	}
	//===================================Giải trình chấm công==========================

	Get_ChiTiet(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_GiaiTrinh + `/Get_ChiTiet?id=${id}`, { headers: httpHeaders });
	}

	DuyetDanhGia(item: QuanLyDuyetModel): Observable<QueryResultsModel2> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_GiaiTrinh + '/DuyetDanhGia', item, { headers: httpHeaders, });
	}

	Duyet(item: QuanLyDuyetModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_GiaiTrinh + '/Duyet', item, { headers: httpHeaders, });
	}

	DuyetTatCaDonGiaiTrinh(item: QuanLyDuyetModel[]): Observable<QueryResultsModel2> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_GiaiTrinh + '/DuyetTatCa', item, { headers: httpHeaders, });
	}

	ChuyenGiaiTrinh(item: ChangeApproverData): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_GiaiTrinh + '/change-approver', item, { headers: httpHeaders, });
	}
	//==================================Thôi việc=======================================
	DuyetDonThoiViec(item: QuanLyDuyetModel): Observable<QueryResultsModel2> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ThoiViec + '/DuyetDonThoiViec', item, { headers: httpHeaders, });
	}

	DuyetDonThoiViecTatCa(item: QuanLyDuyetModel[]): Observable<QueryResultsModel2> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ThoiViec + '/DuyetTatCaDonThoiViec', item, { headers: httpHeaders, });
	}

	Get_ChiTietDonThoiViec(itemId: number): Observable<QuanLyDuyetModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ThoiViec + `/Get_ChiTietDonThoiViec?ID=${itemId}`, { headers: httpHeaders }).pipe(
			map(res => {
				if (res && res.status === 1) {
					
					let item = new QuanLyDuyetModel();
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
					});

					return item;
				}
			})
		);
	}

	ChuyenThoiViec(item: ChangeApproverData): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ThoiViec + '/change-approver', item, { headers: httpHeaders, });
	}
	//==================================Tuyển dụng========================================

	Get_DetailRecruitmentApproval(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_TuyenDung + `/Get_DetailRecruitmentApproval?ID=${id}`, { headers: httpHeaders });
	}

	Approval(item: QuanLyDuyetModel): Observable<QueryResultsModel2> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_TuyenDung + '/Approval', item, { headers: httpHeaders, });
	}

	DuyetTatCaYeuCauTuyenDung(item: QuanLyDuyetModel[]): Observable<QueryResultsModel2> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_TuyenDung + '/DuyetTatCa', item, { headers: httpHeaders, });
	}
}
