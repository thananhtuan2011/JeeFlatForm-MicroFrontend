

import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { QLCuocHopModel } from '../_models/quan-ly-cuoc-hop.model';
import { environment } from 'projects/jeemeet/src/environments/environment';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';
import { ITableService } from './itable.service';
import { QueryResultsModel } from '../../models/query-models/query-results.model';
import { QueryParamsModel } from '../../models/query-models/query-params.model';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
const API_PRODUCTS_URL = environment.APIROOT + '/api/quanlycuochop';
const API_ROOT_URL = environment.APIROOT + "/api/quanlycuochop";
const API_ROOT_URL_ = environment.APIROOT + "/api/bang-khao-sat";
const API_ROOT_URL_N = environment.APIROOT + "/api/phieulayykien";
const API_URL_CONFIG_NONE = environment.APIROOT + "/dungchung/GetConfigNOLOG";
const API_JEEACCOUNT_URL = environment.HOST_JEEACCOUNT_API + "/api";
const API_ROOT_URL_PH = environment.APIROOT + "/api/ql-phong-hop";
@Injectable({
	providedIn: 'root'
})
export class QuanLyCuocHopService extends ITableService<any> implements OnDestroy {
	API_URL_FIND: string = API_PRODUCTS_URL + '';
	API_URL_CTEATE: string = API_PRODUCTS_URL + '';
	API_URL_EDIT: string = API_PRODUCTS_URL + '';
	API_URL_DELETE: string = API_PRODUCTS_URL + '';
	API_URL: string = API_PRODUCTS_URL;
	hubMeetingConnection: any;
	proxy: any;
	private hubConnection: HubConnection;
	public NewMess$ = new BehaviorSubject<any>(1);
	constructor(@Inject(HttpClient) http: any, @Inject(HttpUtilsService) httpUtils) {
		super(http, httpUtils);
	}
	connectToken(id: string) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(environment.APIROOT + `/meet?meetid=${id}`)
			.build()

		this.hubConnection.start().then(() => {

			this.hubConnection.on('MessageReceivedMeet', (data: any) => {
				this.NewMess$.next(data)
			})

		}).catch(err => console.log(err));
	}
	disconnectToken() {
		this.hubConnection.stop().catch(error => console.log(error))
	}

	GenQR(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL_PH + `/gen-room-qr?id=${Id}`,
			{ headers: httpHeaders }
		);
	}
	getTreeDonVi(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEACCOUNT_URL + "/accountdepartmentmanagement/tree", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}
	sendNotifyComment(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + '/SendNotify';
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	XacNhanThamGiaThongQuaUyQuyen(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/XacNhanThamGiaThongQuaUyQuyen`, item, {
			headers: httpHeaders,
		});
	}
	XacNhanThamGiaThongQuaUyQuyenTuThuKyCuocHop(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/XacNhanThamGiaThongQuaUyQuyenTuThuKyCuocHop`, item, {
			headers: httpHeaders,
		});
	}
	public getTopicObjectIDByComponentName(componentName: string): Observable<string> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.APIROOT + `/api/comments/getByComponentName/${componentName}`;
		return this.http.get(url, {
			headers: httpHeaders,
			responseType: 'text'
		});
	}

	Project_Detail(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API + '/api/project' + `/Detail?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	getDonVi(): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();

		const url = `${API_ROOT_URL}/GetList_DonVi?query.more=true`;

		return this.http.get<any>(url, { headers: httpHeaders });
	}
	getData(queryParams: QueryParamsModel): Observable<QueryResultsModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);

		return this.http.get<any>(API_ROOT_URL + "/GetList_CuocHop", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}
	Get_ChiTietCuocHopEdit(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_ChiTietCuocHopEdit?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}

	deleteQLCuocHop(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/Delete_CuocHop?Id=${Id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	// CREATE =>  POST: add a new user to the server
	createCuocHop(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = item;
		return this.http.post<any>(API_ROOT_URL + "/Insert_CuocHop", data, {
			headers: httpHeaders,
		});
	}
	createSoTayGhiChu(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = item;
		return this.http.post<any>(API_ROOT_URL + "/Insert_SoTayGhiChu", data, {
			headers: httpHeaders,
		});
	}
	updateCuocHop(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = item;
		return this.http.post<QLCuocHopModel>(
			API_ROOT_URL + "/Update_CuocHop",
			data,
			{ headers: httpHeaders }
		);
	}
	getData_(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);
		return this.http.get<any>(API_ROOT_URL + "/GetListSoTayGhiChuCuocHop", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}
	SendNotifyRemind(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/SendNotifyRemind", item, {
			headers: httpHeaders,
		});
	}
	UpdateNguoiThemTaiLieu(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = item;
		return this.http.post<any>(
			API_ROOT_URL + "/UpdateNguoiThemTaiLieu",
			data,
			{ headers: httpHeaders }
		);
	}

	getQuanLySoTayGhiChuCuocHopById(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/GetListSoTayGhiChuCuocHop_detail?id=${Id}`,
			{ headers: httpHeaders }
		);
	}
	GetListAllCauHoi(IdCuocHop: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		//	const url = `${API_ROOT_URL}/GetListAllCauHoi?IdParent=${IdParent}`;
		return this.http.get<any>(
			API_ROOT_URL + `/GetListAllCauHoi?IdCuocHop=${IdCuocHop}`,
			{ headers: httpHeaders }
		);
		//return this.http.get<any>(url, { headers: httpHeaders });
	}
	Delete_SoTayGhiChu(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/Delete_SoTayGhiChu?id=${Id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	sendNotifySurvey(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/SendNotifySurvey", item, {
			headers: httpHeaders,
		});
	}
	SendNotify(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/SendNotifyCuocHop", item, {
			headers: httpHeaders,
		});
	}
	GetListThongBaoByIdCuocHop(IdCuocHop: any, record: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		//	const url = `${API_ROOT_URL}/GetListAllCauHoi?IdParent=${IdParent}`;
		return this.http.get<any>(
			API_ROOT_URL_ + `/GetListThongBaoByIdCuocHop?IdCuocHop=${IdCuocHop}&record=${record}`,
			{ headers: httpHeaders }
		);
		//return this.http.get<any>(url, { headers: httpHeaders });
	}
	update(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/Update_SoTayGhiChu", item, {
			headers: httpHeaders,
		});
	}
	// getDSDonVi(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
	// 	const httpHeaders = this.httpUtils.getHTTPHeaders();
	// 	const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
	// 	const url = API_ROOT_URL + "/GetList_DM_HeThong";
	// 	return this.http.get<QueryResultsModel>(url, {
	// 		headers: httpHeaders,
	// 		params: httpParams,
	// 	});
	// }
	Get_GioDatPhongHop(gio: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_GioDatPhongHop?gio=${gio}`,
			{ headers: httpHeaders }
		);
	}
	Get_DSCuocHop(
		queryParams: QueryParamsModel
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_DanhSachCuocHop`,
			{ headers: httpHeaders, params: httpParams }
		);
	}
	Get_ChiTietCuocHop(meetingid: number, type = ''): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let path = `/Get_ChiTietCuocHop?meetingid=${meetingid}`
		if (type === '3') {
			path = `/Get_ChiTietCuocHopAdmin?meetingid=${meetingid}`
		}
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + path,
			{ headers: httpHeaders }
		);
	}
	Get_ChiTietCuocHop_UyQuyen(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_ChiTietCuocHop_UyQuyen?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	Get_ChiTietCuocHopZoom(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_ChiTietCuocHopZoom?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	CapNhatTomTatKetLuan(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/CapNhatTomTatKetLuan`,
			item,
			{ headers: httpHeaders }
		);
	}
	DongCuocHop(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/DongCuocHop?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	HoanCuocHop(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/HoanCuochop?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	danhDauDaXuLy(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/DanhDauDaXuLy?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	GetListFileKetLuanCuocHop(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/GetListFileKetLuanCuocHop?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	XoaCuocHop(meetingid: number, IsDuyet: number): Observable<QueryResultsModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/XoaCuocHop?meetingid=${meetingid}&IsDuyet=${IsDuyet}`,
			{ headers: httpHeaders }
		);
	}
	SoLuongChoCapNhat(loai: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/SoLuongChoCapNhat?loai=${loai}`,
			{ headers: httpHeaders }
		);
	}

	// public disconnect() {
	// 	this.hubMeetingConnection.stop();
	// }

	// public disconnectToken(id:string): void {
	// 	this.hubMeetingConnection.start().done((data: any) => {
	// 		this.proxy.invoke('OutRoom',  id)
	// 		  .done((data: any) => {
	// 		  this.disconnect();
	// 		})
	// 	  .catch((error: any) => {
	// 	  });

	// 	  }).fail((error: any) => {
	// 	   }, 3000);
	// }

	getDSNhanVien(
		queryParams: QueryParamsModel
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/DanhSachNguoiDung`,
			{ headers: httpHeaders, params: httpParams }
		);
	}

	getDSDonVi(
		queryParams: QueryParamsModel
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/DanhSachDonVi`,
			{ headers: httpHeaders, params: httpParams }
		);
	}

	getDSNhomNhanVien(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/danh-sach-nhom-nguoi-dung`,
			{ headers: httpHeaders, params: httpParams }
		);
	}
	getDanhsachDonVi(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/danh-sach-don-vi`,
			{ headers: httpHeaders, params: httpParams }
		);
	}
	listKey(type: number): Observable<any> {
		//type == 1 key của zoom
		//type == 2 key của google
		//type == 3 key của sisco webex
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL + `/GetKey?type=${type}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	getThuMoi(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL + "/GetAllThuMoi", {
			headers: httpHeaders,
		});
	}
	getThanhPhanThuMoi(iDThuMoi: string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/GetDSThanhPhanThuMoi?IdThuMoi=${iDThuMoi}`,
			{ headers: httpHeaders }
		);
	}
	Config(type: number, idKey: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/ConfigMeeting?type=${type}&idKey=${idKey}`,
			{ headers: httpHeaders }
		);
	}

	StartZoom(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/StartZoom?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	XacNhanThamGia(
		meetingid: number,
		Status: number
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL +
			`/XacNhanThamGia?meetingid=${meetingid}&Status=${Status}`,
			{ headers: httpHeaders }
		);
	}

	XacNhanThamGiaCuocHop(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/XacNhanThamGiaCuocHop`,
			item,
			{ headers: httpHeaders }
		);
	}

	XinPhatBieuCuocHop(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/CapNhatTrangThaiPhatBieu`,
			item,
			{ headers: httpHeaders }
		);
	}

	getAccessToken(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL + "/get-token-by-code";
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}
	RefreshToken(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL + "/refresh-token";
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	ConfigCheckToken(id: number, type: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/config?id=${id}&type=${type}`,
			{ headers: httpHeaders }
		);
	}
	updateKey(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/UpdateToken", item, {
			headers: httpHeaders,
		});
	}
	resetKey(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(
			API_ROOT_URL + "/ResetToken/" + item.Id,
			item,
			{ headers: httpHeaders }
		);
	}

	Insert_ThanhVien(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + "/Insert_ThanhVien", item, {
			headers: httpHeaders,
		});
	}

	Delete_ThanhVien(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + "/Delete_ThanhVien", item, {
			headers: httpHeaders,
		});
	}

	XuatFile(params: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get(API_ROOT_URL + "/XuatWord", {
			headers: httpHeaders,
			params: params,
		});
	}

	listIdKhoaHop(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		const url = API_ROOT_URL + "/GetListAllKhoaHop";

		return this.http.get<any>(url, { headers: httpHeaders });
	}
	Get_NoidungDienBien(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_NoidungDienBien?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}

	getDataQuanLyDiemDanh(
		queryParams: QueryParamsModel
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);

		return this.http.get<any>(API_ROOT_URL + "/Get_DanhSachDiemDanh", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}

	getDataQuanLyPhatBieu(
		queryParams: QueryParamsModel
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);

		return this.http.get<any>(API_ROOT_URL + "/Get_DanhSachPhatBieu", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}
	TaoCongViec(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/TaoCongViec`, item,
			{ headers: httpHeaders }
		);
	}
	swapHost(Id: any, userid: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/Swap_Host?meetingid=${Id}&userid=${userid}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	// setup avatar
	getNameUser(val) {
		if (val) {
			var list = val.split(" ");
			return list[list.length - 1];
		}
		return "";
	}

	getColorNameUser(fullname) {
		var name = this.getNameUser(fullname).substr(0, 1);
		var result = "#bd3d0a";
		switch (name) {
			case "A":
				result = "rgb(197, 90, 240)";
				break;
			case "Ă":
				result = "rgb(241, 196, 15)";
				break;
			case "Â":
				result = "rgb(142, 68, 173)";
				break;
			case "B":
				result = "#02c7ad";
				break;
			case "C":
				result = "#0cb929";
				break;
			case "D":
				result = "rgb(44, 62, 80)";
				break;
			case "Đ":
				result = "rgb(127, 140, 141)";
				break;
			case "E":
				result = "rgb(26, 188, 156)";
				break;
			case "Ê":
				result = "rgb(51 152 219)";
				break;
			case "G":
				result = "rgb(44, 62, 80)";
				break;
			case "H":
				result = "rgb(248, 48, 109)";
				break;
			case "I":
				result = "rgb(142, 68, 173)";
				break;
			case "K":
				result = "#2209b7";
				break;
			case "L":
				result = "#759e13";
				break;
			case "M":
				result = "rgb(236, 157, 92)";
				break;
			case "N":
				result = "#bd3d0a";
				break;
			case "O":
				result = "rgb(51 152 219)";
				break;
			case "Ô":
				result = "rgb(241, 196, 15)";
				break;
			case "Ơ":
				result = "rgb(142, 68, 173)";
				break;
			case "P":
				result = "rgb(142, 68, 173)";
				break;
			case "Q":
				result = "rgb(91, 101, 243)";
				break;
			case "R":
				result = "rgb(44, 62, 80)";
				break;
			case "S":
				result = "rgb(122, 8, 56)";
				break;
			case "T":
				result = "rgb(120, 76, 240)";
				break;
			case "U":
				result = "rgb(51 152 219)";
				break;
			case "Ư":
				result = "rgb(241, 196, 15)";
				break;
			case "V":
				result = "rgb(142, 68, 173)";
				break;
			case "X":
				result = "rgb(142, 68, 173)";
				break;
			case "W":
				result = "rgb(211, 84, 0)";
				break;
		}
		return result;
	}
	// setup avatar
	getNameUserv2(val) {
		if (val) {
			var listname = val.split(' ');
			return listname[listname.length - 1].substr(0, 1);
		}
		return "";
	}
	getColorNameUserv2(fullname) {
		var name = this.getNameUserv2(fullname).substr(0, 1);
		var result = "#bd3d0a";
		switch (name) {
			case "A":
				result = "rgb(197, 90, 240)";
				break;
			case "Ă":
				result = "rgb(241, 196, 15)";
				break;
			case "Â":
				result = "rgb(142, 68, 173)";
				break;
			case "B":
				result = "#02c7ad";
				break;
			case "C":
				result = "#0cb929";
				break;
			case "D":
				result = "rgb(44, 62, 80)";
				break;
			case "Đ":
				result = "rgb(127, 140, 141)";
				break;
			case "E":
				result = "rgb(26, 188, 156)";
				break;
			case "Ê":
				result = "rgb(51 152 219)";
				break;
			case "G":
				result = "rgb(44, 62, 80)";
				break;
			case "H":
				result = "rgb(248, 48, 109)";
				break;
			case "I":
				result = "rgb(142, 68, 173)";
				break;
			case "K":
				result = "#2209b7";
				break;
			case "L":
				result = "#759e13";
				break;
			case "M":
				result = "rgb(236, 157, 92)";
				break;
			case "N":
				result = "#bd3d0a";
				break;
			case "O":
				result = "rgb(51 152 219)";
				break;
			case "Ô":
				result = "rgb(241, 196, 15)";
				break;
			case "Ơ":
				result = "rgb(142, 68, 173)";
				break;
			case "P":
				result = "rgb(142, 68, 173)";
				break;
			case "Q":
				result = "rgb(91, 101, 243)";
				break;
			case "R":
				result = "rgb(44, 62, 80)";
				break;
			case "S":
				result = "rgb(122, 8, 56)";
				break;
			case "T":
				result = "rgb(120, 76, 240)";
				break;
			case "U":
				result = "rgb(51 152 219)";
				break;
			case "Ư":
				result = "rgb(241, 196, 15)";
				break;
			case "V":
				result = "rgb(142, 68, 173)";
				break;
			case "X":
				result = "rgb(142, 68, 173)";
				break;
			case "W":
				result = "rgb(211, 84, 0)";
				break;
		}
		return result;
	}
	getSurveyList(
		id: number = 0,
		type: number = 0
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL_ + `/GetDSKhaoSat?Type=${type}&IdCuocHop=${id}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	DownloadFile(
		Id: number = 0,
		//path: number = 0
	): Observable<QueryResultsModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL + `/DownloadFile?Id=${Id}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	DocThuMoi(
		Id: number = 0,
		//path: number = 0
	): Observable<QueryResultsModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL + `/DocThuMoi?Id=${Id}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	ExportWord(params): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/XuatWordKhaoSat", params, {
			headers: httpHeaders,
		});
	}
	XuatWordKetQuaKhaoSat(params): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/XuatWordKetQuaKhaoSat", params, {
			headers: httpHeaders,
		});
	}
	getListCauHoi(
		id: number = 0,
		type: number = 0
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL_ +
			`/GetDSCacCauHoiDaDuocTraLoi?Type=${type}&IdCuocHop=${id}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}

	add(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL_ + "/ThucHienDanhGia", item, {
			headers: httpHeaders,
		});
	}

	getResultSurveyList(
		idM: number = 0,
		idS: number = 0
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL_ + `/TKBangKhaoSat?idCuocHop=${idM}&idKhaoSat=${idS}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}

	getSurveyLists(idM: number = 0): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL_ + `/GetSurveyLists?idM=${idM}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	getWebsiteConfigNoLogin(codes): any {
		// const httpHeaders1 = new HttpHeaders().set("Token", environment.salt);
		// const httpHeaders = new HttpHeaders({
		// 	Token: environment.salt,
		// 	Authorization: "Bearer " + environment.salt,
		// });
		// const url = API_URL_CONFIG_NONE + `?codes=${codes}`;
		// return this.http.post<any>(url, null, { headers: httpHeaders1 });
	}

	refreshSurveyList(idM, idS): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL_}/RefreshSurveyList?IdCuocHop=${idM}&IdKhaoSat=${idS}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });
	}

	GetAllPhongHop(tungay: string, denngay: string, Id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL + `/GetAllPhongHop?tungay=${tungay}&denngay=${denngay}&Id=${Id}`,
			{ headers: httpHeaders }
		);
	}


	getDetail(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL + `/ViewMeetingRoomDiagram?id=${id}`, { headers: httpHeaders });

	}

	getDetail_token(id: any, token: string): Observable<any> {
		let result = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Content-Type',
			'TimeZone': (new Date()).getTimezoneOffset().toString()
		});
		return this.http.get<any>(API_ROOT_URL + `/ViewMeetingRoomDiagram?id=${id}`, { headers: result });

	}
	getResultSurveyList_(
		IdCuocHop: number = 0
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL_N + `/GetDSKhaoSatDaDuocTraLoi_cuochop?IdCuocHop=${IdCuocHop}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	getSurveyLists_(IdKhaoSat: number = 0): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL_N + `/GetDSKhaoSat?IdKhaoSat=${IdKhaoSat}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}

	updatekhaosat(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL_ + "/ThucHienDanhGiaLai", item, {
			headers: httpHeaders,
		});
	}
	getData__(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);
		return this.http.get<any>(API_ROOT_URL_N + "/GetListPhieuLayYKien", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}


	getIsObligate(idM: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL_ + `/GetIsObligate?idM=${idM}`,
			{ headers: httpHeaders }
		);

	}


	// Begin: Feedback
	onOffFeedback(idM: any, isFeedback: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/OnOffFeedback?idM=${idM}&isFeedback=${isFeedback}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });

	}


	addUpdateFeedback(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/AddEditMeetingFeedback", data, {
			headers: httpHeaders,
		});

	}
	addUpdateHoanHop(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/AddEditHoanHop", data, {
			headers: httpHeaders,
		});

	}

	getDetailFeedback(id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/GetDetailMeetingFeedback?id=${id}`,
			{ headers: httpHeaders }
		);

	}
	getDetailHoanHop(id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/GetDetaiHoanHop?id=${id}`,
			{ headers: httpHeaders }
		);

	}
	getList(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);
		return this.http.get<any>(API_ROOT_URL + "/GetListMeetingFeedback", {
			headers: httpHeaders,
			// params: httpParams,
		});

	}


	deleteMeetingFeedback(idRow, idM): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/DeleteMeetingFeedback?idRow=${idRow}&idM=${idM}`;
		return this.http.get<any>(url, { headers: httpHeaders });

	}
	// End: Feedback


	// Begin: Support
	resolveSupport(id: any, idM: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/ResolveSupport?id=${id}&idM=${idM}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });

	}


	addMeetingSupport(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/AddMeetingSupport", data, {
			headers: httpHeaders,
		});

	}


	getListMeetingSupport(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);
		return this.http.get<any>(API_ROOT_URL + "/GetListMeetingSupport", {
			headers: httpHeaders,
			// params: httpParams,
		});

	}


	deleteMeetingSupport(id: any, idM: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/DeleteMeetingSupport?id=${id}&idM=${idM}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });

	}
	// End: Support


	list(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_ROOT_URL + '/GetListMeetingRoomDiagram';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			// params: httpParams
		});

	}


	savePrivateDiagram(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + '/SavePrivateDiagram', item, { headers: httpHeaders });

	}


	getParticipants(idM: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/GetParticipants?idM=${idM}`,
			{ headers: httpHeaders }
		);

	}


	voteMeetingFeedback(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/VoteMeetingFeedback", data, {
			headers: httpHeaders,
		});

	}


	getListVoteByStatus(id, voteStatus): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/GetListVoteByStatus?id=${id}&voteStatus=${voteStatus}`,
			{ headers: httpHeaders }
		);

	}

	listIdPhienHop(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		const url = API_ROOT_URL + "/GetListAllPhienHop";

		return this.http.get<any>(url, { headers: httpHeaders });
	}

	listIdKyHop(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		const url = API_ROOT_URL + "/GetListAllKyHop";

		return this.http.get<any>(url, { headers: httpHeaders });
	}
	addaudio(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/InsertAudio", item, {
			headers: httpHeaders,
		});
	}
	getDetailNotify(IdThongBao: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL_ + `/getDetailNotify?IdThongBao=${IdThongBao}`,
			{ headers: httpHeaders });

	}

	XemThongBaoCuocHop(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL_}/XemThongBaoCuocHop?id=${id}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });

	}

	getdetail_ViewerDocument(Id, IdDocument): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/Detail_ViewerDocument?Id=${Id}&IdDocument=${IdDocument}`,
			{ headers: httpHeaders }
		);

	}
	getdetail_ViewerCuocHop(Id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/Detail_ViewerCuocHop?Id=${Id}`,
			{ headers: httpHeaders }
		);

	}
	getdetail_ViewerDocumentThuMoi(Id, IdDocument): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/Detail_ViewerDocumentThuMoi?Id=${Id}&IdDocument=${IdDocument}`,
			{ headers: httpHeaders }
		);

	}
	gethistory_docs(Id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/history-docs?Id=${Id}`,
			{ headers: httpHeaders }
		);
	}

	gethistory_meet(Id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/history-meet?Id=${Id}`,
			{ headers: httpHeaders }
		);
	}
	createFile(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders_FormData();
		return this.http.post<any>(API_ROOT_URL + `/CreateFile`, item, { headers: httpHeaders });
	}
	createFilelichcongtat(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders_FormData();
		return this.http.post<any>(API_ROOT_URL + `/CreateFileLichHop`, item, { headers: httpHeaders });
	}
	CreateFileHoanHop(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders_FormData();
		return this.http.post<any>(API_ROOT_URL + `/CreateFileHoanHop`, item, { headers: httpHeaders });
	}
	getFilelichcongtac(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders_FormData();
		return this.http.get<any>(API_ROOT_URL + `/getFileLichHop`, { headers: httpHeaders });
	}
	DeleteFile(id: any, name): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/DeleteFile?Id=${id}&name=${name}`, null, {
			headers: httpHeaders,
		});
	}

	XacNhanCuocHop(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/XacNhanCuocHop?Id=${id}`, null, {
			headers: httpHeaders,
		});
	}
	DuyetTaiLieu(id: any, trangthaiduyet, lydo): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/DuyetTaiLieu?Id=${id}&trangthaiduyet=${trangthaiduyet}&lydo=${lydo}`, null, {
			headers: httpHeaders,
		});
	}
	XacNhanNhieuThanhVienThamGiaThongQuaUyQuyenTuThuKyCuocHop(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/XacNhanNhieuThanhVienThamGiaThongQuaUyQuyenTuThuKyCuocHop`, item, {
			headers: httpHeaders,
		});
	}
	Delete_NhieuThanhVien(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + "/Delete_NhieuThanhVien", item, {
			headers: httpHeaders,
		});
	}
}


@Injectable({
	providedIn: 'root'
})
export class QuanLyPhatBieuService extends ITableService<any> implements OnDestroy {
	API_URL_FIND: string = API_PRODUCTS_URL + '';
	API_URL_CTEATE: string = API_PRODUCTS_URL + '';
	API_URL_EDIT: string = API_PRODUCTS_URL + '';
	API_URL_DELETE: string = API_PRODUCTS_URL + '';
	API_URL: string = API_PRODUCTS_URL;
	hubMeetingConnection: any;
	proxy: any;
	private hubConnection: HubConnection;
	public NewMess$ = new BehaviorSubject<any>(1);
	data_shareLoad$ = new BehaviorSubject<any>([]);
	constructor(@Inject(HttpClient) http: any, @Inject(HttpUtilsService) httpUtils) {
		super(http, httpUtils);
	}



	connectToken(id: string) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(environment.APIROOT + `/meet?meetid=${id}`)
			.build()

		this.hubConnection.start().then(() => {

			this.hubConnection.on('MessageReceivedMeet', (data: any) => {
				this.NewMess$.next(data)
			})

		}).catch(err => console.log(err));
	}
	disconnectToken() {
		this.hubConnection.stop().catch(error => console.log(error))
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	XinPhatBieuCuocHop(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/CapNhatTrangThaiPhatBieu`,
			item,
			{ headers: httpHeaders }
		);
	}


	// setup avatar
	getNameUser(val) {
		if (val) {
			var list = val.split(" ");
			return list[list.length - 1];
		}
		return "";
	}

	getColorNameUser(fullname) {
		var name = this.getNameUser(fullname).substr(0, 1);
		var result = "#bd3d0a";
		switch (name) {
			case "A":
				result = "rgb(197, 90, 240)";
				break;
			case "Ă":
				result = "rgb(241, 196, 15)";
				break;
			case "Â":
				result = "rgb(142, 68, 173)";
				break;
			case "B":
				result = "#02c7ad";
				break;
			case "C":
				result = "#0cb929";
				break;
			case "D":
				result = "rgb(44, 62, 80)";
				break;
			case "Đ":
				result = "rgb(127, 140, 141)";
				break;
			case "E":
				result = "rgb(26, 188, 156)";
				break;
			case "Ê":
				result = "rgb(51 152 219)";
				break;
			case "G":
				result = "rgb(44, 62, 80)";
				break;
			case "H":
				result = "rgb(248, 48, 109)";
				break;
			case "I":
				result = "rgb(142, 68, 173)";
				break;
			case "K":
				result = "#2209b7";
				break;
			case "L":
				result = "#759e13";
				break;
			case "M":
				result = "rgb(236, 157, 92)";
				break;
			case "N":
				result = "#bd3d0a";
				break;
			case "O":
				result = "rgb(51 152 219)";
				break;
			case "Ô":
				result = "rgb(241, 196, 15)";
				break;
			case "Ơ":
				result = "rgb(142, 68, 173)";
				break;
			case "P":
				result = "rgb(142, 68, 173)";
				break;
			case "Q":
				result = "rgb(91, 101, 243)";
				break;
			case "R":
				result = "rgb(44, 62, 80)";
				break;
			case "S":
				result = "rgb(122, 8, 56)";
				break;
			case "T":
				result = "rgb(120, 76, 240)";
				break;
			case "U":
				result = "rgb(51 152 219)";
				break;
			case "Ư":
				result = "rgb(241, 196, 15)";
				break;
			case "V":
				result = "rgb(142, 68, 173)";
				break;
			case "X":
				result = "rgb(142, 68, 173)";
				break;
			case "W":
				result = "rgb(211, 84, 0)";
				break;
		}
		return result;
	}
}

@Injectable({
	providedIn: 'root'
})
export class QuanLyDaPhatBieuService extends ITableService<any> implements OnDestroy {
	API_URL_FIND: string = API_PRODUCTS_URL + '';
	API_URL_CTEATE: string = API_PRODUCTS_URL + '';
	API_URL_EDIT: string = API_PRODUCTS_URL + '';
	API_URL_DELETE: string = API_PRODUCTS_URL + '';
	API_URL: string = API_PRODUCTS_URL;
	hubMeetingConnection: any;
	proxy: any;
	private hubConnection: HubConnection;
	public NewMess$ = new BehaviorSubject<any>(1);
	data_shareLoad$ = new BehaviorSubject<any>([]);
	constructor(@Inject(HttpClient) http: any, @Inject(HttpUtilsService) httpUtils) {
		super(http, httpUtils);
	}



	connectToken(id: string) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(environment.APIROOT + `/meet?meetid=${id}`)
			.build()

		this.hubConnection.start().then(() => {

			this.hubConnection.on('MessageReceivedMeet', (data: any) => {
				this.NewMess$.next(data)
			})

		}).catch(err => console.log(err));
	}
	disconnectToken() {
		this.hubConnection.stop().catch(error => console.log(error))
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	XinPhatBieuCuocHop(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/CapNhatTrangThaiPhatBieu`,
			item,
			{ headers: httpHeaders }
		);
	}


	// setup avatar
	getNameUser(val) {
		if (val) {
			var list = val.split(" ");
			return list[list.length - 1];
		}
		return "";
	}

	getColorNameUser(fullname) {
		var name = this.getNameUser(fullname).substr(0, 1);
		var result = "#bd3d0a";
		switch (name) {
			case "A":
				result = "rgb(197, 90, 240)";
				break;
			case "Ă":
				result = "rgb(241, 196, 15)";
				break;
			case "Â":
				result = "rgb(142, 68, 173)";
				break;
			case "B":
				result = "#02c7ad";
				break;
			case "C":
				result = "#0cb929";
				break;
			case "D":
				result = "rgb(44, 62, 80)";
				break;
			case "Đ":
				result = "rgb(127, 140, 141)";
				break;
			case "E":
				result = "rgb(26, 188, 156)";
				break;
			case "Ê":
				result = "rgb(51 152 219)";
				break;
			case "G":
				result = "rgb(44, 62, 80)";
				break;
			case "H":
				result = "rgb(248, 48, 109)";
				break;
			case "I":
				result = "rgb(142, 68, 173)";
				break;
			case "K":
				result = "#2209b7";
				break;
			case "L":
				result = "#759e13";
				break;
			case "M":
				result = "rgb(236, 157, 92)";
				break;
			case "N":
				result = "#bd3d0a";
				break;
			case "O":
				result = "rgb(51 152 219)";
				break;
			case "Ô":
				result = "rgb(241, 196, 15)";
				break;
			case "Ơ":
				result = "rgb(142, 68, 173)";
				break;
			case "P":
				result = "rgb(142, 68, 173)";
				break;
			case "Q":
				result = "rgb(91, 101, 243)";
				break;
			case "R":
				result = "rgb(44, 62, 80)";
				break;
			case "S":
				result = "rgb(122, 8, 56)";
				break;
			case "T":
				result = "rgb(120, 76, 240)";
				break;
			case "U":
				result = "rgb(51 152 219)";
				break;
			case "Ư":
				result = "rgb(241, 196, 15)";
				break;
			case "V":
				result = "rgb(142, 68, 173)";
				break;
			case "X":
				result = "rgb(142, 68, 173)";
				break;
			case "W":
				result = "rgb(211, 84, 0)";
				break;
		}
		return result;
	}
}

@Injectable({
	providedIn: 'root'
})
export class QuanLyDiemDanhService extends ITableService<any> implements OnDestroy {
	API_URL_FIND: string = API_PRODUCTS_URL + '';
	API_URL_CTEATE: string = API_PRODUCTS_URL + '';
	API_URL_EDIT: string = API_PRODUCTS_URL + '';
	API_URL_DELETE: string = API_PRODUCTS_URL + '';
	API_URL: string = API_PRODUCTS_URL;
	hubMeetingConnection: any;
	proxy: any;
	private hubConnection: HubConnection;
	public NewMess$ = new BehaviorSubject<any>(1);
	constructor(@Inject(HttpClient) http: any, @Inject(HttpUtilsService) httpUtils) {
		super(http, httpUtils);
	}
	connectToken(id: string) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(environment.APIROOT + `/meet?meetid=${id}`)
			.build()

		this.hubConnection.start().then(() => {

			this.hubConnection.on('MessageReceivedMeet', (data: any) => {
				this.NewMess$.next(data)
			})

		}).catch(err => console.log(err));
	}
	disconnectToken() {
		this.hubConnection.stop().catch(error => console.log(error))
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}

	XacNhanThamGiaCuocHop(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/XacNhanThamGiaCuocHop`,
			item,
			{ headers: httpHeaders }
		);
	}

	// setup avatar
	getNameUser(val) {
		if (val) {
			var list = val.split(" ");
			return list[list.length - 1];
		}
		return "";
	}

	getColorNameUser(fullname) {
		var name = this.getNameUser(fullname).substr(0, 1);
		var result = "#bd3d0a";
		switch (name) {
			case "A":
				result = "rgb(197, 90, 240)";
				break;
			case "Ă":
				result = "rgb(241, 196, 15)";
				break;
			case "Â":
				result = "rgb(142, 68, 173)";
				break;
			case "B":
				result = "#02c7ad";
				break;
			case "C":
				result = "#0cb929";
				break;
			case "D":
				result = "rgb(44, 62, 80)";
				break;
			case "Đ":
				result = "rgb(127, 140, 141)";
				break;
			case "E":
				result = "rgb(26, 188, 156)";
				break;
			case "Ê":
				result = "rgb(51 152 219)";
				break;
			case "G":
				result = "rgb(44, 62, 80)";
				break;
			case "H":
				result = "rgb(248, 48, 109)";
				break;
			case "I":
				result = "rgb(142, 68, 173)";
				break;
			case "K":
				result = "#2209b7";
				break;
			case "L":
				result = "#759e13";
				break;
			case "M":
				result = "rgb(236, 157, 92)";
				break;
			case "N":
				result = "#bd3d0a";
				break;
			case "O":
				result = "rgb(51 152 219)";
				break;
			case "Ô":
				result = "rgb(241, 196, 15)";
				break;
			case "Ơ":
				result = "rgb(142, 68, 173)";
				break;
			case "P":
				result = "rgb(142, 68, 173)";
				break;
			case "Q":
				result = "rgb(91, 101, 243)";
				break;
			case "R":
				result = "rgb(44, 62, 80)";
				break;
			case "S":
				result = "rgb(122, 8, 56)";
				break;
			case "T":
				result = "rgb(120, 76, 240)";
				break;
			case "U":
				result = "rgb(51 152 219)";
				break;
			case "Ư":
				result = "rgb(241, 196, 15)";
				break;
			case "V":
				result = "rgb(142, 68, 173)";
				break;
			case "X":
				result = "rgb(142, 68, 173)";
				break;
			case "W":
				result = "rgb(211, 84, 0)";
				break;
		}
		return result;
	}


}





@Injectable({
	providedIn: 'root'
})
export class QuanLyCuocHopYKienService extends ITableService<any> implements OnDestroy {
	API_URL_FIND: string = API_PRODUCTS_URL + '';
	API_URL_CTEATE: string = API_PRODUCTS_URL + '';
	API_URL_EDIT: string = API_PRODUCTS_URL + '';
	API_URL_DELETE: string = API_PRODUCTS_URL + '';
	API_URL: string = API_PRODUCTS_URL;
	hubMeetingConnection: any;
	proxy: any;
	private hubConnection: HubConnection;
	public NewMess$ = new BehaviorSubject<any>(1);
	constructor(@Inject(HttpClient) http: any, @Inject(HttpUtilsService) httpUtils) {
		super(http, httpUtils);
	}
	connectToken(id: string) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(environment.APIROOT + `/meet?meetid=${id}`)
			.build()

		this.hubConnection.start().then(() => {

			this.hubConnection.on('MessageReceivedMeet', (data: any) => {
				this.NewMess$.next(data)
			})

		}).catch(err => console.log(err));
	}
	disconnectToken() {
		this.hubConnection.stop().catch(error => console.log(error))
	}
	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	XacNhanThamGiaThongQuaUyQuyen(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/XacNhanThamGiaThongQuaUyQuyen`, item, {
			headers: httpHeaders,
		});
	}
	XacNhanThamGiaThongQuaUyQuyenTuThuKyCuocHop(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/XacNhanThamGiaThongQuaUyQuyenTuThuKyCuocHop`, item, {
			headers: httpHeaders,
		});
	}
	public getTopicObjectIDByComponentName(componentName: string): Observable<string> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.APIROOT + `/api/comments/getByComponentName/${componentName}`;
		return this.http.get(url, {
			headers: httpHeaders,
			responseType: 'text'
		});
	}

	Project_Detail(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API + '/api/project' + `/Detail?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	getDonVi(): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();

		const url = `${API_ROOT_URL}/GetList_DonVi?query.more=true`;

		return this.http.get<any>(url, { headers: httpHeaders });
	}
	getData(queryParams: QueryParamsModel): Observable<QueryResultsModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);

		return this.http.get<any>(API_ROOT_URL + "/GetList_CuocHop", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}
	Get_ChiTietCuocHopEdit(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_ChiTietCuocHopEdit?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}

	deleteQLCuocHop(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/Delete_CuocHop?Id=${Id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	// CREATE =>  POST: add a new user to the server
	createCuocHop(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = item;
		return this.http.post<any>(API_ROOT_URL + "/Insert_CuocHop", data, {
			headers: httpHeaders,
		});
	}
	createSoTayGhiChu(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = item;
		return this.http.post<any>(API_ROOT_URL + "/Insert_SoTayGhiChu", data, {
			headers: httpHeaders,
		});
	}
	updateCuocHop(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = item;
		return this.http.post<QLCuocHopModel>(
			API_ROOT_URL + "/Update_CuocHop",
			data,
			{ headers: httpHeaders }
		);
	}
	getData_(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);
		return this.http.get<any>(API_ROOT_URL + "/GetListSoTayGhiChuCuocHop", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}

	getQuanLySoTayGhiChuCuocHopById(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/GetListSoTayGhiChuCuocHop_detail?id=${Id}`,
			{ headers: httpHeaders }
		);
	}
	GetListAllCauHoi(IdCuocHop: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		//	const url = `${API_ROOT_URL}/GetListAllCauHoi?IdParent=${IdParent}`;
		return this.http.get<any>(
			API_ROOT_URL + `/GetListAllCauHoi?IdCuocHop=${IdCuocHop}`,
			{ headers: httpHeaders }
		);
		//return this.http.get<any>(url, { headers: httpHeaders });
	}
	Delete_SoTayGhiChu(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/Delete_SoTayGhiChu?id=${Id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	sendNotifySurvey(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/SendNotifySurvey", item, {
			headers: httpHeaders,
		});
	}
	SendNotify(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/SendNotifyCuocHop", item, {
			headers: httpHeaders,
		});
	}
	GetListThongBaoByIdCuocHop(IdCuocHop: any, record: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		//	const url = `${API_ROOT_URL}/GetListAllCauHoi?IdParent=${IdParent}`;
		return this.http.get<any>(
			API_ROOT_URL_ + `/GetListThongBaoByIdCuocHop?IdCuocHop=${IdCuocHop}&record=${record}`,
			{ headers: httpHeaders }
		);
		//return this.http.get<any>(url, { headers: httpHeaders });
	}
	update(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/Update_SoTayGhiChu", item, {
			headers: httpHeaders,
		});
	}
	// getDSDonVi(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
	// 	const httpHeaders = this.httpUtils.getHTTPHeaders();
	// 	const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
	// 	const url = API_ROOT_URL + "/GetList_DM_HeThong";
	// 	return this.http.get<QueryResultsModel>(url, {
	// 		headers: httpHeaders,
	// 		params: httpParams,
	// 	});
	// }
	Get_GioDatPhongHop(gio: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_GioDatPhongHop?gio=${gio}`,
			{ headers: httpHeaders }
		);
	}
	Get_DSCuocHop(
		queryParams: QueryParamsModel
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_DanhSachCuocHop`,
			{ headers: httpHeaders, params: httpParams }
		);
	}
	Get_ChiTietCuocHop(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_ChiTietCuocHop?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	Get_ChiTietCuocHopZoom(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_ChiTietCuocHopZoom?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	CapNhatTomTatKetLuan(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/CapNhatTomTatKetLuan`,
			item,
			{ headers: httpHeaders }
		);
	}
	DongCuocHop(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/DongCuocHop?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	GetListFileKetLuanCuocHop(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/GetListFileKetLuanCuocHop?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	XoaCuocHop(meetingid: number, IsDuyet: number): Observable<QueryResultsModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/XoaCuocHop?meetingid=${meetingid}&IsDuyet=${IsDuyet}`,
			{ headers: httpHeaders }
		);
	}
	SoLuongChoCapNhat(loai: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/SoLuongChoCapNhat?loai=${loai}`,
			{ headers: httpHeaders }
		);
	}

	// public disconnect() {
	// 	this.hubMeetingConnection.stop();
	// }

	// public disconnectToken(id:string): void {
	// 	this.hubMeetingConnection.start().done((data: any) => {
	// 		this.proxy.invoke('OutRoom',  id)
	// 		  .done((data: any) => {
	// 		  this.disconnect();
	// 		})
	// 	  .catch((error: any) => {
	// 	  });

	// 	  }).fail((error: any) => {
	// 	   }, 3000);
	// }

	getDSNhanVien(
		queryParams: QueryParamsModel
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/DanhSachNguoiDung`,
			{ headers: httpHeaders, params: httpParams }
		);
	}

	getDSNhomNhanVien(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/danh-sach-nhom-nguoi-dung`,
			{ headers: httpHeaders, params: httpParams }
		);
	}
	getDanhsachDonVi(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/danh-sach-don-vi`,
			{ headers: httpHeaders, params: httpParams }
		);
	}
	listKey(type: number): Observable<any> {
		//type == 1 key của zoom
		//type == 2 key của google
		//type == 3 key của sisco webex
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL + `/GetKey?type=${type}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	getThuMoi(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL + "/GetAllThuMoi", {
			headers: httpHeaders,
		});
	}
	getThanhPhanThuMoi(iDThuMoi: string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/GetDSThanhPhanThuMoi?IdThuMoi=${iDThuMoi}`,
			{ headers: httpHeaders }
		);
	}
	Config(type: number, idKey: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/ConfigMeeting?type=${type}&idKey=${idKey}`,
			{ headers: httpHeaders }
		);
	}

	StartZoom(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/StartZoom?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	XacNhanThamGia(
		meetingid: number,
		Status: number
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL +
			`/XacNhanThamGia?meetingid=${meetingid}&Status=${Status}`,
			{ headers: httpHeaders }
		);
	}

	XacNhanThamGiaCuocHop(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/XacNhanThamGiaCuocHop`,
			item,
			{ headers: httpHeaders }
		);
	}

	XinPhatBieuCuocHop(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/CapNhatTrangThaiPhatBieu`,
			item,
			{ headers: httpHeaders }
		);
	}

	getAccessToken(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL + "/get-token-by-code";
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}
	RefreshToken(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL + "/refresh-token";
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	ConfigCheckToken(id: number, type: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/config?id=${id}&type=${type}`,
			{ headers: httpHeaders }
		);
	}
	updateKey(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/UpdateToken", item, {
			headers: httpHeaders,
		});
	}
	resetKey(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(
			API_ROOT_URL + "/ResetToken/" + item.Id,
			item,
			{ headers: httpHeaders }
		);
	}

	Insert_ThanhVien(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + "/Insert_ThanhVien", item, {
			headers: httpHeaders,
		});
	}

	Delete_ThanhVien(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + "/Delete_ThanhVien", item, {
			headers: httpHeaders,
		});
	}

	XuatFile(params: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get(API_ROOT_URL + "/XuatWord", {
			headers: httpHeaders,
			params: params,
		});
	}

	listIdKhoaHop(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		const url = API_ROOT_URL + "/GetListAllKhoaHop";

		return this.http.get<any>(url, { headers: httpHeaders });
	}
	Get_NoidungDienBien(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_NoidungDienBien?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}

	getDataQuanLyDiemDanh(
		queryParams: QueryParamsModel
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);

		return this.http.get<any>(API_ROOT_URL + "/Get_DanhSachDiemDanh", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}

	getDataQuanLyPhatBieu(
		queryParams: QueryParamsModel
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);

		return this.http.get<any>(API_ROOT_URL + "/Get_DanhSachPhatBieu", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}
	TaoCongViec(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/TaoCongViec`, item,
			{ headers: httpHeaders }
		);
	}
	swapHost(Id: any, userid: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/Swap_Host?meetingid=${Id}&userid=${userid}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	// setup avatar
	getNameUser(val) {
		if (val) {
			var list = val.split(" ");
			return list[list.length - 1];
		}
		return "";
	}

	getColorNameUser(fullname) {
		var name = this.getNameUser(fullname).substr(0, 1);
		var result = "#bd3d0a";
		switch (name) {
			case "A":
				result = "rgb(197, 90, 240)";
				break;
			case "Ă":
				result = "rgb(241, 196, 15)";
				break;
			case "Â":
				result = "rgb(142, 68, 173)";
				break;
			case "B":
				result = "#02c7ad";
				break;
			case "C":
				result = "#0cb929";
				break;
			case "D":
				result = "rgb(44, 62, 80)";
				break;
			case "Đ":
				result = "rgb(127, 140, 141)";
				break;
			case "E":
				result = "rgb(26, 188, 156)";
				break;
			case "Ê":
				result = "rgb(51 152 219)";
				break;
			case "G":
				result = "rgb(44, 62, 80)";
				break;
			case "H":
				result = "rgb(248, 48, 109)";
				break;
			case "I":
				result = "rgb(142, 68, 173)";
				break;
			case "K":
				result = "#2209b7";
				break;
			case "L":
				result = "#759e13";
				break;
			case "M":
				result = "rgb(236, 157, 92)";
				break;
			case "N":
				result = "#bd3d0a";
				break;
			case "O":
				result = "rgb(51 152 219)";
				break;
			case "Ô":
				result = "rgb(241, 196, 15)";
				break;
			case "Ơ":
				result = "rgb(142, 68, 173)";
				break;
			case "P":
				result = "rgb(142, 68, 173)";
				break;
			case "Q":
				result = "rgb(91, 101, 243)";
				break;
			case "R":
				result = "rgb(44, 62, 80)";
				break;
			case "S":
				result = "rgb(122, 8, 56)";
				break;
			case "T":
				result = "rgb(120, 76, 240)";
				break;
			case "U":
				result = "rgb(51 152 219)";
				break;
			case "Ư":
				result = "rgb(241, 196, 15)";
				break;
			case "V":
				result = "rgb(142, 68, 173)";
				break;
			case "X":
				result = "rgb(142, 68, 173)";
				break;
			case "W":
				result = "rgb(211, 84, 0)";
				break;
		}
		return result;
	}

	getSurveyList(
		id: number = 0,
		type: number = 0
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL_ + `/GetDSKhaoSat?Type=${type}&IdCuocHop=${id}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	DownloadFile(
		Id: number = 0,
		//path: number = 0
	): Observable<QueryResultsModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL + `/DownloadFile?Id=${Id}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	ExportWord(params): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/XuatWordKhaoSat", params, {
			headers: httpHeaders,
		});
	}
	XuatWordKetQuaKhaoSat(params): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/XuatWordKetQuaKhaoSat", params, {
			headers: httpHeaders,
		});
	}
	getListCauHoi(
		id: number = 0,
		type: number = 0
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL_ +
			`/GetDSCacCauHoiDaDuocTraLoi?Type=${type}&IdCuocHop=${id}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}

	add(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL_ + "/ThucHienDanhGia", item, {
			headers: httpHeaders,
		});
	}

	getResultSurveyList(
		idM: number = 0,
		idS: number = 0
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL_ + `/TKBangKhaoSat?idCuocHop=${idM}&idKhaoSat=${idS}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}

	getSurveyLists(idM: number = 0): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL_ + `/GetSurveyLists?idM=${idM}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	getWebsiteConfigNoLogin(codes): any {
		// const httpHeaders1 = new HttpHeaders().set("Token", environment.salt);
		// const httpHeaders = new HttpHeaders({
		// 	Token: environment.salt,
		// 	Authorization: "Bearer " + environment.salt,
		// });
		// const url = API_URL_CONFIG_NONE + `?codes=${codes}`;
		// return this.http.post<any>(url, null, { headers: httpHeaders1 });
	}

	refreshSurveyList(idM, idS): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL_}/RefreshSurveyList?IdCuocHop=${idM}&IdKhaoSat=${idS}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });
	}

	GetAllPhongHop(tungay: string, denngay: string, Id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL + `/GetAllPhongHop?tungay=${tungay}&denngay=${denngay}&Id=${Id}`,
			{ headers: httpHeaders }
		);
	}


	getDetail(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL + `/ViewMeetingRoomDiagram?id=${id}`, { headers: httpHeaders });

	}

	getDetail_token(id: any, token: string): Observable<any> {
		let result = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Content-Type',
			'TimeZone': (new Date()).getTimezoneOffset().toString()
		});
		return this.http.get<any>(API_ROOT_URL + `/ViewMeetingRoomDiagram?id=${id}`, { headers: result });

	}
	getResultSurveyList_(
		IdCuocHop: number = 0
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL_N + `/GetDSKhaoSatDaDuocTraLoi_cuochop?IdCuocHop=${IdCuocHop}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	getSurveyLists_(IdKhaoSat: number = 0): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL_N + `/GetDSKhaoSat?IdKhaoSat=${IdKhaoSat}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}

	updatekhaosat(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL_ + "/ThucHienDanhGiaLai", item, {
			headers: httpHeaders,
		});
	}
	getData__(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);
		return this.http.get<any>(API_ROOT_URL_N + "/GetListPhieuLayYKien", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}


	getIsObligate(idM: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL_ + `/GetIsObligate?idM=${idM}`,
			{ headers: httpHeaders }
		);

	}


	// Begin: Feedback
	onOffFeedback(idM: any, isFeedback: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/OnOffFeedback?idM=${idM}&isFeedback=${isFeedback}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });

	}


	addUpdateFeedback(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/AddEditMeetingFeedback", data, {
			headers: httpHeaders,
		});

	}


	getDetailFeedback(id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/GetDetailMeetingFeedback?id=${id}`,
			{ headers: httpHeaders }
		);

	}


	getList(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);
		return this.http.get<any>(API_ROOT_URL + "/GetListMeetingFeedback", {
			headers: httpHeaders,
			// params: httpParams,
		});

	}


	deleteMeetingFeedback(idRow, idM): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/DeleteMeetingFeedback?idRow=${idRow}&idM=${idM}`;
		return this.http.get<any>(url, { headers: httpHeaders });

	}
	// End: Feedback


	// Begin: Support
	resolveSupport(id: any, idM: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/ResolveSupport?id=${id}&idM=${idM}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });

	}


	addMeetingSupport(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/AddMeetingSupport", data, {
			headers: httpHeaders,
		});

	}


	getListMeetingSupport(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);
		return this.http.get<any>(API_ROOT_URL + "/GetListMeetingSupport", {
			headers: httpHeaders,
			// params: httpParams,
		});

	}


	deleteMeetingSupport(id: any, idM: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/DeleteMeetingSupport?id=${id}&idM=${idM}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });

	}
	// End: Support


	list(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_ROOT_URL + '/GetListMeetingRoomDiagram';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			// params: httpParams
		});

	}


	savePrivateDiagram(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + '/SavePrivateDiagram', item, { headers: httpHeaders });

	}


	getParticipants(idM: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/GetParticipants?idM=${idM}`,
			{ headers: httpHeaders }
		);

	}


	voteMeetingFeedback(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/VoteMeetingFeedback", data, {
			headers: httpHeaders,
		});

	}


	getListVoteByStatus(id, voteStatus): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/GetListVoteByStatus?id=${id}&voteStatus=${voteStatus}`,
			{ headers: httpHeaders }
		);

	}

	listIdPhienHop(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		const url = API_ROOT_URL + "/GetListAllPhienHop";

		return this.http.get<any>(url, { headers: httpHeaders });
	}

	listIdKyHop(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		const url = API_ROOT_URL + "/GetListAllKyHop";

		return this.http.get<any>(url, { headers: httpHeaders });
	}
	addaudio(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/InsertAudio", item, {
			headers: httpHeaders,
		});
	}
	getDetailNotify(IdThongBao: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL_ + `/getDetailNotify?IdThongBao=${IdThongBao}`,
			{ headers: httpHeaders });

	}

	XemThongBaoCuocHop(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL_}/XemThongBaoCuocHop?id=${id}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });

	}

	getdetail_ViewerDocument(Id, IdDocument): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/Detail_ViewerDocument?Id=${Id}&IdDocument=${IdDocument}`,
			{ headers: httpHeaders }
		);

	}
	createFile(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders_FormData();
		return this.http.post<any>(API_ROOT_URL + `/CreateFile`, item, { headers: httpHeaders });
	}
	DeleteFile(id: any, name): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/DeleteFile?Id=${id}&name=${name}`, null, {
			headers: httpHeaders,
		});
	}

	XacNhanCuocHop(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/XacNhanCuocHop?Id=${id}`, null, {
			headers: httpHeaders,
		});
	}
	DuyetTaiLieu(id: any, trangthaiduyet, lydo): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/DuyetTaiLieu?Id=${id}&trangthaiduyet=${trangthaiduyet}&lydo=${lydo}`, null, {
			headers: httpHeaders,
		});
	}
}


@Injectable({
	providedIn: 'root'
})
export class QuanLyCuocHopFeedBackService extends ITableService<any> implements OnDestroy {
	API_URL_FIND: string = API_PRODUCTS_URL + '';
	API_URL_CTEATE: string = API_PRODUCTS_URL + '';
	API_URL_EDIT: string = API_PRODUCTS_URL + '';
	API_URL_DELETE: string = API_PRODUCTS_URL + '';
	API_URL: string = API_PRODUCTS_URL;
	hubMeetingConnection: any;
	proxy: any;
	private hubConnection: HubConnection;
	public NewMess$ = new BehaviorSubject<any>(1);
	constructor(@Inject(HttpClient) http: any, @Inject(HttpUtilsService) httpUtils) {
		super(http, httpUtils);
	}
	connectToken(id: string) {
		this.hubConnection = new HubConnectionBuilder()
			.withUrl(environment.APIROOT + `/meet?meetid=${id}`)
			.build()

		this.hubConnection.start().then(() => {

			this.hubConnection.on('MessageReceivedMeet', (data: any) => {
				this.NewMess$.next(data)
			})

		}).catch(err => console.log(err));
	}
	disconnectToken() {
		this.hubConnection.stop().catch(error => console.log(error))
	}

	sendNotifyComment(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + '/SendNotify';
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	ngOnDestroy() {
		this.subscriptions.forEach(sb => sb.unsubscribe());
	}
	XacNhanThamGiaThongQuaUyQuyen(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/XacNhanThamGiaThongQuaUyQuyen`, item, {
			headers: httpHeaders,
		});
	}
	XacNhanThamGiaThongQuaUyQuyenTuThuKyCuocHop(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/XacNhanThamGiaThongQuaUyQuyenTuThuKyCuocHop`, item, {
			headers: httpHeaders,
		});
	}
	public getTopicObjectIDByComponentName(componentName: string): Observable<string> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.APIROOT + `/api/comments/getByComponentName/${componentName}`;
		return this.http.get(url, {
			headers: httpHeaders,
			responseType: 'text'
		});
	}

	Project_Detail(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API + '/api/project' + `/Detail?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	getDonVi(): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();

		const url = `${API_ROOT_URL}/GetList_DonVi?query.more=true`;

		return this.http.get<any>(url, { headers: httpHeaders });
	}
	getData(queryParams: QueryParamsModel): Observable<QueryResultsModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);

		return this.http.get<any>(API_ROOT_URL + "/GetList_CuocHop", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}
	Get_ChiTietCuocHopEdit(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_ChiTietCuocHopEdit?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}

	deleteQLCuocHop(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/Delete_CuocHop?Id=${Id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	// CREATE =>  POST: add a new user to the server
	createCuocHop(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = item;
		return this.http.post<any>(API_ROOT_URL + "/Insert_CuocHop", data, {
			headers: httpHeaders,
		});
	}
	createSoTayGhiChu(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = item;
		return this.http.post<any>(API_ROOT_URL + "/Insert_SoTayGhiChu", data, {
			headers: httpHeaders,
		});
	}
	updateCuocHop(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = item;
		return this.http.post<QLCuocHopModel>(
			API_ROOT_URL + "/Update_CuocHop",
			data,
			{ headers: httpHeaders }
		);
	}
	getData_(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);
		return this.http.get<any>(API_ROOT_URL + "/GetListSoTayGhiChuCuocHop", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}
	SendNotifyRemind(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/SendNotifyRemind", item, {
			headers: httpHeaders,
		});
	}
	UpdateNguoiThemTaiLieu(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = item;
		return this.http.post<any>(
			API_ROOT_URL + "/UpdateNguoiThemTaiLieu",
			data,
			{ headers: httpHeaders }
		);
	}

	getQuanLySoTayGhiChuCuocHopById(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/GetListSoTayGhiChuCuocHop_detail?id=${Id}`,
			{ headers: httpHeaders }
		);
	}
	GetListAllCauHoi(IdCuocHop: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		//	const url = `${API_ROOT_URL}/GetListAllCauHoi?IdParent=${IdParent}`;
		return this.http.get<any>(
			API_ROOT_URL + `/GetListAllCauHoi?IdCuocHop=${IdCuocHop}`,
			{ headers: httpHeaders }
		);
		//return this.http.get<any>(url, { headers: httpHeaders });
	}
	Delete_SoTayGhiChu(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/Delete_SoTayGhiChu?id=${Id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	sendNotifySurvey(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/SendNotifySurvey", item, {
			headers: httpHeaders,
		});
	}
	SendNotify(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/SendNotifyCuocHop", item, {
			headers: httpHeaders,
		});
	}
	GetListThongBaoByIdCuocHop(IdCuocHop: any, record: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		//	const url = `${API_ROOT_URL}/GetListAllCauHoi?IdParent=${IdParent}`;
		return this.http.get<any>(
			API_ROOT_URL_ + `/GetListThongBaoByIdCuocHop?IdCuocHop=${IdCuocHop}&record=${record}`,
			{ headers: httpHeaders }
		);
		//return this.http.get<any>(url, { headers: httpHeaders });
	}
	update(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/Update_SoTayGhiChu", item, {
			headers: httpHeaders,
		});
	}
	// getDSDonVi(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
	// 	const httpHeaders = this.httpUtils.getHTTPHeaders();
	// 	const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
	// 	const url = API_ROOT_URL + "/GetList_DM_HeThong";
	// 	return this.http.get<QueryResultsModel>(url, {
	// 		headers: httpHeaders,
	// 		params: httpParams,
	// 	});
	// }
	Get_GioDatPhongHop(gio: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_GioDatPhongHop?gio=${gio}`,
			{ headers: httpHeaders }
		);
	}
	Get_DSCuocHop(
		queryParams: QueryParamsModel
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_DanhSachCuocHop`,
			{ headers: httpHeaders, params: httpParams }
		);
	}
	Get_ChiTietCuocHop(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_ChiTietCuocHop?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	Get_ChiTietCuocHopZoom(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_ChiTietCuocHopZoom?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	CapNhatTomTatKetLuan(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/CapNhatTomTatKetLuan`,
			item,
			{ headers: httpHeaders }
		);
	}
	DongCuocHop(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/DongCuocHop?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	GetListFileKetLuanCuocHop(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/GetListFileKetLuanCuocHop?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	XoaCuocHop(meetingid: number, IsDuyet: number): Observable<QueryResultsModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/XoaCuocHop?meetingid=${meetingid}&IsDuyet=${IsDuyet}`,
			{ headers: httpHeaders }
		);
	}
	SoLuongChoCapNhat(loai: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/SoLuongChoCapNhat?loai=${loai}`,
			{ headers: httpHeaders }
		);
	}

	// public disconnect() {
	// 	this.hubMeetingConnection.stop();
	// }

	// public disconnectToken(id:string): void {
	// 	this.hubMeetingConnection.start().done((data: any) => {
	// 		this.proxy.invoke('OutRoom',  id)
	// 		  .done((data: any) => {
	// 		  this.disconnect();
	// 		})
	// 	  .catch((error: any) => {
	// 	  });

	// 	  }).fail((error: any) => {
	// 	   }, 3000);
	// }

	getDSNhanVien(
		queryParams: QueryParamsModel
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/DanhSachNguoiDung`,
			{ headers: httpHeaders, params: httpParams }
		);
	}

	getDSNhomNhanVien(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/danh-sach-nhom-nguoi-dung`,
			{ headers: httpHeaders, params: httpParams }
		);
	}
	getDanhsachDonVi(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/danh-sach-don-vi`,
			{ headers: httpHeaders, params: httpParams }
		);
	}
	listKey(type: number): Observable<any> {
		//type == 1 key của zoom
		//type == 2 key của google
		//type == 3 key của sisco webex
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL + `/GetKey?type=${type}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	getThuMoi(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL + "/GetAllThuMoi", {
			headers: httpHeaders,
		});
	}
	getThanhPhanThuMoi(iDThuMoi: string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/GetDSThanhPhanThuMoi?IdThuMoi=${iDThuMoi}`,
			{ headers: httpHeaders }
		);
	}
	Config(type: number, idKey: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/ConfigMeeting?type=${type}&idKey=${idKey}`,
			{ headers: httpHeaders }
		);
	}

	StartZoom(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/StartZoom?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}
	XacNhanThamGia(
		meetingid: number,
		Status: number
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL +
			`/XacNhanThamGia?meetingid=${meetingid}&Status=${Status}`,
			{ headers: httpHeaders }
		);
	}

	XacNhanThamGiaCuocHop(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/XacNhanThamGiaCuocHop`,
			item,
			{ headers: httpHeaders }
		);
	}

	XinPhatBieuCuocHop(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/CapNhatTrangThaiPhatBieu`,
			item,
			{ headers: httpHeaders }
		);
	}

	getAccessToken(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL + "/get-token-by-code";
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}
	RefreshToken(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL + "/refresh-token";
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	ConfigCheckToken(id: number, type: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/config?id=${id}&type=${type}`,
			{ headers: httpHeaders }
		);
	}
	updateKey(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/UpdateToken", item, {
			headers: httpHeaders,
		});
	}
	resetKey(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(
			API_ROOT_URL + "/ResetToken/" + item.Id,
			item,
			{ headers: httpHeaders }
		);
	}

	Insert_ThanhVien(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + "/Insert_ThanhVien", item, {
			headers: httpHeaders,
		});
	}

	Delete_ThanhVien(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + "/Delete_ThanhVien", item, {
			headers: httpHeaders,
		});
	}

	XuatFile(params: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get(API_ROOT_URL + "/XuatWord", {
			headers: httpHeaders,
			params: params,
		});
	}

	listIdKhoaHop(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		const url = API_ROOT_URL + "/GetListAllKhoaHop";

		return this.http.get<any>(url, { headers: httpHeaders });
	}
	Get_NoidungDienBien(meetingid: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/Get_NoidungDienBien?meetingid=${meetingid}`,
			{ headers: httpHeaders }
		);
	}

	getDataQuanLyDiemDanh(
		queryParams: QueryParamsModel
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);

		return this.http.get<any>(API_ROOT_URL + "/Get_DanhSachDiemDanh", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}

	getDataQuanLyPhatBieu(
		queryParams: QueryParamsModel
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);

		return this.http.get<any>(API_ROOT_URL + "/Get_DanhSachPhatBieu", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}
	TaoCongViec(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<QueryResultsModel>(
			API_ROOT_URL + `/TaoCongViec`, item,
			{ headers: httpHeaders }
		);
	}
	swapHost(Id: any, userid: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/Swap_Host?meetingid=${Id}&userid=${userid}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	// setup avatar
	getNameUser(val) {
		if (val) {
			var list = val.split(" ");
			return list[list.length - 1];
		}
		return "";
	}

	getColorNameUser(fullname) {
		var name = this.getNameUser(fullname).substr(0, 1);
		var result = "#bd3d0a";
		switch (name) {
			case "A":
				result = "rgb(197, 90, 240)";
				break;
			case "Ă":
				result = "rgb(241, 196, 15)";
				break;
			case "Â":
				result = "rgb(142, 68, 173)";
				break;
			case "B":
				result = "#02c7ad";
				break;
			case "C":
				result = "#0cb929";
				break;
			case "D":
				result = "rgb(44, 62, 80)";
				break;
			case "Đ":
				result = "rgb(127, 140, 141)";
				break;
			case "E":
				result = "rgb(26, 188, 156)";
				break;
			case "Ê":
				result = "rgb(51 152 219)";
				break;
			case "G":
				result = "rgb(44, 62, 80)";
				break;
			case "H":
				result = "rgb(248, 48, 109)";
				break;
			case "I":
				result = "rgb(142, 68, 173)";
				break;
			case "K":
				result = "#2209b7";
				break;
			case "L":
				result = "#759e13";
				break;
			case "M":
				result = "rgb(236, 157, 92)";
				break;
			case "N":
				result = "#bd3d0a";
				break;
			case "O":
				result = "rgb(51 152 219)";
				break;
			case "Ô":
				result = "rgb(241, 196, 15)";
				break;
			case "Ơ":
				result = "rgb(142, 68, 173)";
				break;
			case "P":
				result = "rgb(142, 68, 173)";
				break;
			case "Q":
				result = "rgb(91, 101, 243)";
				break;
			case "R":
				result = "rgb(44, 62, 80)";
				break;
			case "S":
				result = "rgb(122, 8, 56)";
				break;
			case "T":
				result = "rgb(120, 76, 240)";
				break;
			case "U":
				result = "rgb(51 152 219)";
				break;
			case "Ư":
				result = "rgb(241, 196, 15)";
				break;
			case "V":
				result = "rgb(142, 68, 173)";
				break;
			case "X":
				result = "rgb(142, 68, 173)";
				break;
			case "W":
				result = "rgb(211, 84, 0)";
				break;
		}
		return result;
	}

	getSurveyList(
		id: number = 0,
		type: number = 0
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL_ + `/GetDSKhaoSat?Type=${type}&IdCuocHop=${id}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	DownloadFile(
		Id: number = 0,
		//path: number = 0
	): Observable<QueryResultsModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL + `/DownloadFile?Id=${Id}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	ExportWord(params): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/XuatWordKhaoSat", params, {
			headers: httpHeaders,
		});
	}
	XuatWordKetQuaKhaoSat(params): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/XuatWordKetQuaKhaoSat", params, {
			headers: httpHeaders,
		});
	}
	getListCauHoi(
		id: number = 0,
		type: number = 0
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL_ +
			`/GetDSCacCauHoiDaDuocTraLoi?Type=${type}&IdCuocHop=${id}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}

	add(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL_ + "/ThucHienDanhGia", item, {
			headers: httpHeaders,
		});
	}

	getResultSurveyList(
		idM: number = 0,
		idS: number = 0
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL_ + `/TKBangKhaoSat?idCuocHop=${idM}&idKhaoSat=${idS}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}

	getSurveyLists(idM: number = 0): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL_ + `/GetSurveyLists?idM=${idM}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	getWebsiteConfigNoLogin(codes): any {
		// const httpHeaders1 = new HttpHeaders().set("Token", environment.salt);
		// const httpHeaders = new HttpHeaders({
		// 	Token: environment.salt,
		// 	Authorization: "Bearer " + environment.salt,
		// });
		// const url = API_URL_CONFIG_NONE + `?codes=${codes}`;
		// return this.http.post<any>(url, null, { headers: httpHeaders1 });
	}

	refreshSurveyList(idM, idS): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL_}/RefreshSurveyList?IdCuocHop=${idM}&IdKhaoSat=${idS}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });
	}

	GetAllPhongHop(tungay: string, denngay: string, Id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL + `/GetAllPhongHop?tungay=${tungay}&denngay=${denngay}&Id=${Id}`,
			{ headers: httpHeaders }
		);
	}


	getDetail(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL + `/ViewMeetingRoomDiagram?id=${id}`, { headers: httpHeaders });

	}

	getDetail_token(id: any, token: string): Observable<any> {
		let result = new HttpHeaders({
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${token}`,
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Content-Type',
			'TimeZone': (new Date()).getTimezoneOffset().toString()
		});
		return this.http.get<any>(API_ROOT_URL + `/ViewMeetingRoomDiagram?id=${id}`, { headers: result });

	}
	getResultSurveyList_(
		IdCuocHop: number = 0
	): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url =
			API_ROOT_URL_N + `/GetDSKhaoSatDaDuocTraLoi_cuochop?IdCuocHop=${IdCuocHop}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}
	getSurveyLists_(IdKhaoSat: number = 0): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_ROOT_URL_N + `/GetDSKhaoSat?IdKhaoSat=${IdKhaoSat}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}

	updatekhaosat(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL_ + "/ThucHienDanhGiaLai", item, {
			headers: httpHeaders,
		});
	}
	getData__(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);
		return this.http.get<any>(API_ROOT_URL_N + "/GetListPhieuLayYKien", {
			headers: httpHeaders,
			// params: httpParams,
		});
	}


	getIsObligate(idM: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL_ + `/GetIsObligate?idM=${idM}`,
			{ headers: httpHeaders }
		);

	}


	// Begin: Feedback
	onOffFeedback(idM: any, isFeedback: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/OnOffFeedback?idM=${idM}&isFeedback=${isFeedback}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });

	}


	addUpdateFeedback(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/AddEditMeetingFeedback", data, {
			headers: httpHeaders,
		});

	}


	getDetailFeedback(id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/GetDetailMeetingFeedback?id=${id}`,
			{ headers: httpHeaders }
		);

	}


	getList(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);
		return this.http.get<any>(API_ROOT_URL + "/GetListMeetingFeedback", {
			headers: httpHeaders,
			// params: httpParams,
		});

	}


	deleteMeetingFeedback(idRow, idM): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/DeleteMeetingFeedback?idRow=${idRow}&idM=${idM}`;
		return this.http.get<any>(url, { headers: httpHeaders });

	}
	// End: Feedback


	// Begin: Support
	resolveSupport(id: any, idM: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/ResolveSupport?id=${id}&idM=${idM}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });

	}


	addMeetingSupport(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/AddMeetingSupport", data, {
			headers: httpHeaders,
		});

	}


	getListMeetingSupport(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParamsCommon(queryParams);
		return this.http.get<any>(API_ROOT_URL + "/GetListMeetingSupport", {
			headers: httpHeaders,
			// params: httpParams,
		});

	}


	deleteMeetingSupport(id: any, idM: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL}/DeleteMeetingSupport?id=${id}&idM=${idM}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });

	}
	// End: Support


	list(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_ROOT_URL + '/GetListMeetingRoomDiagram';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			// params: httpParams
		});

	}


	savePrivateDiagram(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + '/SavePrivateDiagram', item, { headers: httpHeaders });

	}


	getParticipants(idM: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(
			API_ROOT_URL + `/GetParticipants?idM=${idM}`,
			{ headers: httpHeaders }
		);

	}


	voteMeetingFeedback(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/VoteMeetingFeedback", data, {
			headers: httpHeaders,
		});

	}


	getListVoteByStatus(id, voteStatus): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/GetListVoteByStatus?id=${id}&voteStatus=${voteStatus}`,
			{ headers: httpHeaders }
		);

	}

	listIdPhienHop(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		const url = API_ROOT_URL + "/GetListAllPhienHop";

		return this.http.get<any>(url, { headers: httpHeaders });
	}

	listIdKyHop(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		const url = API_ROOT_URL + "/GetListAllKyHop";

		return this.http.get<any>(url, { headers: httpHeaders });
	}
	addaudio(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ROOT_URL + "/InsertAudio", item, {
			headers: httpHeaders,
		});
	}
	getDetailNotify(IdThongBao: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL_ + `/getDetailNotify?IdThongBao=${IdThongBao}`,
			{ headers: httpHeaders });

	}

	XemThongBaoCuocHop(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URL_}/XemThongBaoCuocHop?id=${id}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });

	}

	getdetail_ViewerDocument(Id, IdDocument): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_ROOT_URL + `/Detail_ViewerDocument?Id=${Id}&IdDocument=${IdDocument}`,
			{ headers: httpHeaders }
		);

	}
	createFile(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders_FormData();
		return this.http.post<any>(API_ROOT_URL + `/CreateFile`, item, { headers: httpHeaders });
	}
	DeleteFile(id: any, name): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/DeleteFile?Id=${id}&name=${name}`, null, {
			headers: httpHeaders,
		});
	}

	XacNhanCuocHop(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/XacNhanCuocHop?Id=${id}`, null, {
			headers: httpHeaders,
		});
	}
	DuyetTaiLieu(id: any, trangthaiduyet, lydo): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_ROOT_URL + `/DuyetTaiLieu?Id=${id}&trangthaiduyet=${trangthaiduyet}&lydo=${lydo}`, null, {
			headers: httpHeaders,
		});
	}
	exportExcelGopY(id: number): Observable<QueryResultsModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		var url = API_PRODUCTS_URL + `/exportExcelGopY?id=${id}`;

		return this.http.get<any>(url, { headers: httpHeaders });

	}
}
