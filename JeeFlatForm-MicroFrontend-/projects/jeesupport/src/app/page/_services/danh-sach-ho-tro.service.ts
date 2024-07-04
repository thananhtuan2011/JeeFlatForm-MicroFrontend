import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject, of } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { TicketManagementDTO2 } from "../_models/ticket-management.model";
import { environment } from "projects/jeesupport/src/environments/environment";
import { ITableService } from "./itable.service";
import { HttpUtilsService } from "../../modules/crud/utils/http-utils.service";
import { QueryResultsModel } from "../_models/query-results.model";
import { QueryParamsModel } from "../_models/query-params.model";
// const API_DatPhong = environment.HOST_JEEADMIN_API;
// const API_general = environment.HOST_JEEMEETING_API + "/api/General";
// const API_Meeting = environment.HOST_JEEMEETING_API + "/api/Meeting";
// const API_Work = environment.HOST_JEEWORK_API + "/api";

//const API_PRODUCTS_URL = environment.HOST_JEEMEETING_API + '/api/Meeting';

//const API_Support_URL = environment.HOST_JEETICKET_API + '/api/ticketmanagement';
const API_Support_URL = environment.HOST_JEESUPPORT_API + "/api/RequestManagement";
const Api_General = environment.HOST_JEESUPPORT_API + '/api/general';

@Injectable()
export class DanhSachHoTroService extends ITableService<
  TicketManagementDTO2[]
> {
  data_share$ = new BehaviorSubject<any>([]);
  data_shareLoad$ = new BehaviorSubject<any>([]);
  API_URL = `/api/YeuCau`;

  //API_URL_FIND: string = API_Support_URL + '/GetTicketManagementBySend';
  API_URL_FIND: string = API_Support_URL + "/GetListRequestManagement";
  API_URL_CTEATE: string = API_Support_URL + "";
  API_URL_EDIT: string = API_Support_URL + "";
  API_URL_DELETE: string = API_Support_URL + "";

  // lastFilter$: BehaviorSubject<QueryParamsModelNew> = new BehaviorSubject(new QueryParamsModelNew({}, 'asc', '', 0, 50));
  // public loadListCuocHopCuaToi: string = '/api/Meeting' + '/Get_DanhSachCuocHopCuaToi';
  // public loadListCuocHopToiThamGia: string =  '/api/Meeting' + '/Get_DanhSachCuocHopToiThamGia';
  // public loadListCuocHop: string =  '/api/Meeting' + '/Get_DanhSachCuocHop';
  // public loadDSHuy :string = "/api/datphonghop/Get_DSHuyDatPhong"
  // ReadOnlyControl: boolean;
  constructor(@Inject(HttpClient) http, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }
  //=================================================================================================================
  // Get_GioDatPhongHop(gio: string): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_general +  `/Get_GioDatPhongHop?gio=${gio}`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // Insert_DatPhongHop(item: any): Observable<any> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.post(API_DatPhong + '/api/datphonghop/KT_ThoiGianDat', item, { headers: httpHeaders });
  // }
  // Insert_CuocHop(item: any): Observable<any> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.post(API_Meeting + '/Insert_CuocHop', item, { headers: httpHeaders });
  // }
  // Insert_ThanhVien(item: any): Observable<any> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.post(API_Meeting + '/Insert_ThanhVien', item, { headers: httpHeaders });
  // }

  // Delete_ThanhVien(item: any): Observable<any> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.post(API_Meeting + '/Delete_ThanhVien', item, { headers: httpHeaders });
  // }
  // findData(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
  // 	queryParams.more = true;
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	const httpParams = this.httpUtils.getFindHTTPParamsV2(queryParams);
  // 	const url = API_DatPhong + '/api/datphonghop/Get_DSDatPhongHop';
  // 	return this.http.get<QueryResultsModel>(url, {
  // 		headers: httpHeaders,
  // 		params: httpParams
  // 	});
  // }
  // findDataZoom(idPhong:number): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	const url = API_Meeting + `/Get_DSZoom?IdPhongHop=${idPhong}`;
  // 	return this.http.get<QueryResultsModel>(url, {
  // 		headers: httpHeaders
  // 	});
  // }
  // GetListPhongHop(loai:number): Observable<any> {//Dùng cho chức năng đặt phòng họp
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(API_DatPhong + `/api/taisan/Get_ListTaiSan?loai=${loai}`, { headers: httpHeaders });
  // }
  // getDSNhanVien(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
  // const httpHeaders = this.httpUtils.getHTTPHeaders();
  // const httpParams = this.httpUtils.getFindHTTPParamsV2(queryParams);
  // return this.http.get<QueryResultsModel>(
  //     API_general + `/LoadDSNhanVien`,
  //     { headers: httpHeaders ,params: httpParams }
  // );
  // }
  // Get_DSCuocHop(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	const httpParams = this.httpUtils.getFindHTTPParamsV2(queryParams);
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/Get_DanhSachCuocHop`,
  // 		{ headers: httpHeaders,params: httpParams }
  // 	);
  // }
  // Get_ChiTietHoTro(id: number): Observable<QueryResultsModel> {
	// console.log("chay cai nay");
  //   const httpHeaders = this.httpUtils.getHTTPHeaders();
  //   return this.http.get<QueryResultsModel>(
  //     API_Support_URL + `/GetTicketPCManagementByRowID/${id}`,
  //     { headers: httpHeaders }
  //   );
  // }
  Get_ChiTietHoTro(id: number): Observable<QueryResultsModel> {
      const httpHeaders = this.httpUtils.getHTTPHeaders();
      return this.http.get<QueryResultsModel>(
        API_Support_URL + `/GetRequestPCManagementByRowID/${id}`,
        { headers: httpHeaders }
      );
    }
    GetOnlyMessageThread(id: number): Observable<QueryResultsModel> {
      const httpHeaders = this.httpUtils.getHTTPHeaders();
      return this.http.get<QueryResultsModel>(
        API_Support_URL + `/GetOnlyMessageThreadByRequestID/${id}`,
        { headers: httpHeaders }
      );
    }
    getIdCurren(table:any): Observable<any> {
      const httpHeaders = this.httpUtils.getHTTPHeaders();
      //let params = this.httpUtils.parseFilter(filter);
      return this.http.get<any>(Api_General + `/GetIdCurrent/${table}`, {headers: httpHeaders});
  }
  // Get_ChiTietCuocHopEdit(meetingid:number): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/Get_ChiTietCuocHopEdit?meetingid=${meetingid}`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // TaoCongViec(item:any): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.post<QueryResultsModel>(
  // 		API_Meeting +  `/TaoCongViec`,item,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // CapNhatTomTatKetLuan(item:any): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.post<QueryResultsModel>(
  // 		API_Meeting +  `/CapNhatTomTatKetLuan`,item,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // XacNhanThamGia(meetingid:number,Status:number): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/XacNhanThamGia?meetingid=${meetingid}&Status=${Status}`,
  // 		{ headers: httpHeaders }
  // 	);
  // }

  // DongCuocHop(meetingid:number): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/DongCuocHop?meetingid=${meetingid}`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // XoaCuocHop(meetingid:number): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/XoaCuocHop?meetingid=${meetingid}`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // public getTopicObjectIDByComponentName(componentName: string): Observable<string> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	const url = environment.HOST_JEEMEETING_API + `/api/comments/getByComponentName/${componentName}`;
  // 	return this.http.get(url, {
  // 	  headers: httpHeaders,
  // 	  responseType: 'text'
  // 	});
  //   }
  //   Confirm_DatPhongHop(item: any): Observable<any> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	const url = API_DatPhong + '/api/datphonghop/Confirm_DatPhongHop';
  // 	return this.http.post<any>(url, item, { headers: httpHeaders });
  // }
  // setUpConfigZoom(item: any): Observable<any> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	const url = API_Meeting + '/SetupZoom';
  // 	return this.http.post<any>(url, item, { headers: httpHeaders });
  // }
  // setUpConfigGoogle(item: any): Observable<any> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	const url = API_Meeting + '/SetupGoogle';
  // 	return this.http.post<any>(url, item, { headers: httpHeaders });
  // }
  // ZoomConfig(): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/ZoomConfig`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // GoogleConfig(): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/GoogleConfig`,
  // 		{ headers: httpHeaders }
  // 	);
  // }

  // TeamsConfig(): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/TeamsConfig`,
  // 		{ headers: httpHeaders }
  // 	);
  // }

  // GoogleKey(): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/GoogleKey`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // SoLuongChoCapNhat(loai:any): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/SoLuongChoCapNhat?loai=${loai}`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // ListKey(): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/List-Key`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // ListKeyGoogle(): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/List-Key-Google`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // ListKeyTeams(): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/List-Key-Teams`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // setUpConfigWebex(item: any): Observable<any> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	const url = API_Meeting + '/SetupWebex';
  // 	return this.http.post<any>(url, item, { headers: httpHeaders });
  // }

  // WebexKey(): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/WebexKey`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // WebexConfig(): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/WebexConfig`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // WebexKey2(): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/WebexKey2`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // getAccessToken(item: any): Observable<any> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	const url = API_general + '/get-token-by-code';
  // 	return this.http.post<any>(url, item, { headers: httpHeaders });
  // }
  // RefreshToken(item: any): Observable<any> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	const url = API_general + '/refresh-token';
  // 	return this.http.post<any>(url, item, { headers: httpHeaders });
  // }
  // RevokeToken(token:string): Observable<any> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	const url = API_general + `/revoke-token?token=${token}`;
  // 	return this.http.post<any>(url, null, { headers: httpHeaders });
  // }
  // getKeyGoogle(): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_general +  `/getKeyGoogle`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // getMS(): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_general +  `/getMS`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  // StartZoom(meetingid:number): Observable<QueryResultsModel> {
  // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
  // 	return this.http.get<QueryResultsModel>(
  // 		API_Meeting +  `/StartZoom?meetingid=${meetingid}`,
  // 		{ headers: httpHeaders }
  // 	);
  // }
  getNameUser(value: string) {
    return value.substring(0, 1).toUpperCase();
  }

  getColorNameUser(value: any) {
    let result = "";
    switch (value) {
      case "A":
        return (result = "rgb(51 152 219)");
      case "Ă":
        return (result = "rgb(241, 196, 15)");
      case "Â":
        return (result = "rgb(142, 68, 173)");
      case "B":
        return (result = "#0cb929");
      case "C":
        return (result = "rgb(91, 101, 243)");
      case "D":
        return (result = "rgb(44, 62, 80)");
      case "Đ":
        return (result = "rgb(127, 140, 141)");
      case "E":
        return (result = "rgb(26, 188, 156)");
      case "Ê":
        return (result = "rgb(51 152 219)");
      case "G":
        return (result = "rgb(241, 196, 15)");
      case "H":
        return (result = "rgb(248, 48, 109)");
      case "I":
        return (result = "rgb(142, 68, 173)");
      case "K":
        return (result = "#2209b7");
      case "L":
        return (result = "rgb(44, 62, 80)");
      case "M":
        return (result = "rgb(127, 140, 141)");
      case "N":
        return (result = "rgb(197, 90, 240)");
      case "O":
        return (result = "rgb(51 152 219)");
      case "Ô":
        return (result = "rgb(241, 196, 15)");
      case "Ơ":
        return (result = "rgb(142, 68, 173)");
      case "P":
        return (result = "#02c7ad");
      case "Q":
        return (result = "rgb(211, 84, 0)");
      case "R":
        return (result = "rgb(44, 62, 80)");
      case "S":
        return (result = "rgb(127, 140, 141)");
      case "T":
        return (result = "#bd3d0a");
      case "U":
        return (result = "rgb(51 152 219)");
      case "Ư":
        return (result = "rgb(241, 196, 15)");
      case "V":
        return (result = "#759e13");
      case "X":
        return (result = "rgb(142, 68, 173)");
      case "W":
        return (result = "rgb(211, 84, 0)");
    }
    return result;
  }
  loadSupportLazy(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = this.API_URL_FIND;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
}
