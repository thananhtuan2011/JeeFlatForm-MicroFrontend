import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { LyLichNhanVienModel } from '../Model/so-do-to-chuc.model';
import { environment } from 'projects/jeehr/src/environments/environment';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';

const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/viewsdtc';
const API_Searchemployee = environment.HOST_JEEHR_API + '/api/searchemployee';

@Injectable()
export class SoDoToChucService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	GetOrganizationalChartById(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/ViewSDTC`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}

	getItemById(itemId: number): Observable<LyLichNhanVienModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Searchemployee + `/Get_LyLich_Nhanvien?id_nv=${itemId}`, { headers: httpHeaders }).pipe(
			map(res => {

				if (res && res.status === 1) {
					let item = new LyLichNhanVienModel();
					item.clear();
					Object.assign(item, {
						Image: '' + res.Image,
						MaNV: '' + res.MaNV,
						HoTen: '' + res.HoTen,
						GioiTinh: '' + res.GioiTinh,
						NgaySinh: '' + res.NgaySinh,
						NoiSinh: '' + res.NoiSinh,
						NguyenQuan: '' + res.NguyenQuan,
						SoDienThoaiNha: '' + res.SoDienThoaiNha,
						DiDong: '' + res.DiDong,
						DiaChiThuongTru: '' + res.DiaChiThuongTru,
						DiaChiTamTru: '' + res.DiaChiTamTru,
						EmailCongTy: '' + res.EmailCongTy,
						SosoBHXH: '' + res.SosoBHXH,
						TinhTrangHonNhan: '' + res.TinhTrangHonNhan,
						MaSoThue: '' + res.MaSoThue,
						CMND: '' + res.CMND,
						NgayCapCMND: '' + res.NgayCapCMND,
						NoiCapCMND: '' + res.NoiCapCMND,
						TrinhDoHocVan: '' + res.TrinhDoHocVan,
						TruongTotNghiep: '' + res.TruongTotNghiep,
						ChuyenMon: '' + res.ChuyenMon,
						TrinhDotinHoc: '' + res.TrinhDotinHoc,
						DanToc: '' + res.DanToc,
						TonGiao: '' + res.TonGiao,
						TrinhDoThongTin: res.TrinhDoThongTin,
						BangCapKhac: res.BangCapKhac,
						NguoiThan: res.NguoiThan,
						Structure: '' + res.Structure,
						ChucDanh: '' + res.ChucDanh,
						NgayBatDauLamViec: '' + res.NgayBatDauLamViec,
						NgayVaoChinhThuc: '' + res.NgayVaoChinhThuc,
						QuanLyHienTai: '' + res.QuanLyHienTai,
						HopDong: res.HopDong,
						TruocKhiVaoCty: res.TruocKhiVaoCty,
						QuaTrinhCongTac: res.QuaTrinhCongTac,
						QuaTrinhDanhGia: res.QuaTrinhDanhGia,
						QuaTrinhNghiDaiHan: res.QuaTrinhNghiDaiHan,
						KhenThuong: res.KhenThuong,
						KyLuat: res.KyLuat,
					});

					return item;
				}
			})
		);
	}

	ExportExcel(id_nv: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_Searchemployee + `/Export_LyLich?id_nv=${id_nv}`;
		return this.http.get(url, {
			headers: httpHeaders,
			responseType: 'blob',
			observe: 'response'
		});
	}
}
