

import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject, of } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { environment } from "projects/jeerequest/src/environments/environment";
import { QueryResultsModel } from "../../models/query-models/query-results.model";
import { QueryParamsModelNew } from "../../models/query-models/query-params.model";
import { HttpUtilsService } from "projects/jeerequest/src/modules/crud/utils/http-utils.service";

const API_PHEDUYET = environment.HOST_JEEREQUEST_API + "/api/YeuCau";
const API = environment.HOST_JEEREQUEST_API + "/api/LoaiYeuCau";
const API_JEEWORK = environment.HOST_JEEWORK_API;
const API_JEEWORKV2 = environment.HOST_JEEWORKV2_API;
const API_JEEWORKFLOW = environment.HOST_JEEWORKFLOW_API;
@Injectable()
export class YeuCauService{
    stateCD$ = new BehaviorSubject<number>(null);
    stateCN$ = new BehaviorSubject<number>(null);
	data_share$ = new BehaviorSubject<any>([]);
	data_shareGui$ = new BehaviorSubject<any>([]);
	data_shareDuyet$ = new BehaviorSubject<any>([]);
	data_shareActived$ = new BehaviorSubject<any>([]);
	data_shareLoad$ = new BehaviorSubject<any>([]);
	data_shareLoadDetail$ = new BehaviorSubject<any>([]);
	API_URL = `/api/YeuCau`;
	lastFilter$: BehaviorSubject<QueryParamsModelNew> = new BehaviorSubject(new QueryParamsModelNew({}, 'asc', '', 0, 50));
	public loadListYeuCauGui: string = this.API_URL + '/getDanhSachYeuCauGui';
	public loadListYeuCauDuyet: string = this.API_URL + '/getDanhSachYeuCauDuyet';
	ReadOnlyControl: boolean;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService
	) {
	}
	//=================================================================================================================

  getDSNhanVien(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<QueryResultsModel>(
      API_PHEDUYET + `/LoadDSNhanVien`,
        { headers: httpHeaders,params: httpParams }
    );
}

chuyen_tiep_yeu_cau(item: any): Observable<any> {
  const httpHeaders = this.httpUtils.getHTTPHeaders();
  const url = API_PHEDUYET + '/chuyen-tiep-yeu-cau';
  return this.http.post<any>(url, item, { headers: httpHeaders });
}
	getDSLoaiYeuCau(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParamsV2(queryParams);
		return this.http.get<QueryResultsModel>(
			API + `/getDSLoaiYeuCauLazyLoad`,
			{ headers: httpHeaders,params: httpParams, }
		);
	}
	LoadControlList(queryParams: QueryParamsModelNew): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParamsV2(queryParams);
		return this.http.get<QueryResultsModel>(API + `/getControls`, {
			headers: httpHeaders,
			params: httpParams,
		});
	}
	getDSYeuCauGui(queryParams: QueryParamsModelNew): Observable<any>  {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParamsV2(queryParams);

		return this.http.get<any>(
			API_PHEDUYET + `/getDSYeuCauGui`,
			{ headers: httpHeaders,
				params: httpParams  }
		);
	}
	getDSYeuCauDuyet(queryParams: QueryParamsModelNew): Observable<any>  {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParamsV2(queryParams);

		return this.http.get<any>(
			API_PHEDUYET + `/getDSYeuCauDuyet`,
			{ headers: httpHeaders,
				params: httpParams  }
		);
	}
	DanhDauYeuCau(item:number,id:number): Observable<QueryResultsModel>{
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		return this.http.post<any>(
			API_PHEDUYET + `/DanhDauYeuCau?value=${item}&id=${id}`,null,
			{ headers: httpHeaders }
		);
	}
	DanhDauYeuCauGui(item:number,id:number): Observable<QueryResultsModel>{
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		return this.http.post<any>(
			API_PHEDUYET + `/DanhDauYeuCauGui?value=${item}&id=${id}`,null,
			{ headers: httpHeaders }
		);
	}
	DanhDauYeuCauDuyet(item:number,id:number): Observable<QueryResultsModel>{
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		return this.http.post<any>(
			API_PHEDUYET + `/DanhDauYeuCauDuyet?value=${item}&id=${id}`,null,
			{ headers: httpHeaders }
		);
	}
	getDSChiTietYeuCau(id:number, nodeID:number):any {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_PHEDUYET + `/loadChiTietYeuCau?idRowYeuCau=${id}&NodeID=${nodeID}`,
			{ headers: httpHeaders }
		);
	}
	getDSChiTietYeuCauConTrol(id:number):any {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_PHEDUYET + `/loadChiTietNoiDungConTrol?idRowYeuCau=${id}`,
			{ headers: httpHeaders }
		);
	}
	getValueSaoChepHoacChinhSua(id:number):any {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_PHEDUYET + `/loadChiTietConTrol?idRowYeuCau=${id}`,
			{ headers: httpHeaders }
		);
	}
	XoaYeuCua(id:any){
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PHEDUYET + `/XoaYeuCau?id=${id}`,null, {
			headers: httpHeaders
		});
	}
	LayNguoiDuyetDauTien(id:any){
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PHEDUYET + `/LayNguoiDuyetDauTien?Id=${id}`, {
			headers: httpHeaders
		});

	}
	LayNguoiDuyetCuaQuyTrinh(id:any){
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PHEDUYET + `/LayNguoiDuyetCuaQuyTrinh?Id=${id}`, {
			headers: httpHeaders
		});

	}
	LayNguoiDuyetYeuCau(id:any){
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PHEDUYET + `/LayNguoiDuyetYeuCau?Id=${id}`, {
			headers: httpHeaders
		});

	}
	getTrangThaiToiLuotDuyetYeuCau(id:number):any {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_PHEDUYET + `/getTinhTrangDuyet?ID_YeuCau=${id}`,
			{ headers: httpHeaders }
		);
	}
	PheDuyetYeuCau(id:number,ResultID:number,NodeID:number,ResultText:string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get(API_PHEDUYET + `/PheDuyetYeuCau?idyeucau=${id}&ResultID=${ResultID}&NodeID=${NodeID}&ResultText=${ResultText}`, { headers: httpHeaders });
	}
	ngOnDestroy() {
		// this.subscriptions.forEach(sb => sb.unsubscribe());
	  }
	  public getTopicObjectIDByComponentName(componentName: string): Observable<string> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEREQUEST_API + `/api/comments/getByComponentName/${componentName}`;
		return this.http.get(url, {
		  headers: httpHeaders,
		  responseType: 'text'
		});
	  }
	  GetChiTietCongViec(id_project_team:any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_JEEWORK}/api/tp-tasks/detail-task?id=${id_project_team}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
  GetChiTietCongViecV2(id_project_team:any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_JEEWORKV2}/api/work/detail-task?id=${id_project_team}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	ListStatusDynamic(id_project_team: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWORK + `/api/tp-lite/list-status-dynamic?id_project_team=${id_project_team}`, { headers: httpHeaders });
	}
  ListStatusDynamicV2(id_project_team: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWORKV2 + `/api/general/list-status-dynamic?id_project_team=${id_project_team}`, { headers: httpHeaders });
	}
  ListStatusDetailV2(id_project_team: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWORKV2 + `/api/status/list-status-by-config?id_project_team=${id_project_team}`, { headers: httpHeaders });
	}
	GetChiTietNhiemVu(id_project_team:any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_JEEWORKFLOW}/api/interaction/processes/${id_project_team}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}


	sendNotify(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PHEDUYET + '/SendNotify';
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	getNameUser(value: string) {
		return value.substring(0, 1).toUpperCase();
	}

	getColorNameUser(value: any) {
		let result = '';
		switch (value) {
			case 'A':
				return (result = 'rgb(51 152 219)');
			case 'Ă':
				return (result = 'rgb(241, 196, 15)');
			case 'Â':
				return (result = 'rgb(142, 68, 173)');
			case 'B':
				return (result = '#0cb929');
			case 'C':
				return (result = 'rgb(91, 101, 243)');
			case 'D':
				return (result = 'rgb(44, 62, 80)');
			case 'Đ':
				return (result = 'rgb(127, 140, 141)');
			case 'E':
				return (result = 'rgb(26, 188, 156)');
			case 'Ê':
				return (result = 'rgb(51 152 219)');
			case 'G':
				return (result = 'rgb(241, 196, 15)');
			case 'H':
				return (result = 'rgb(248, 48, 109)');
			case 'I':
				return (result = 'rgb(142, 68, 173)');
			case 'K':
				return (result = '#2209b7');
			case 'L':
				return (result = 'rgb(44, 62, 80)');
			case 'M':
				return (result = 'rgb(127, 140, 141)');
			case 'N':
				return (result = 'rgb(197, 90, 240)');
			case 'O':
				return (result = 'rgb(51 152 219)');
			case 'Ô':
				return (result = 'rgb(241, 196, 15)');
			case 'Ơ':
				return (result = 'rgb(142, 68, 173)');
			case 'P':
				return (result = '#02c7ad');
			case 'Q':
				return (result = 'rgb(211, 84, 0)');
			case 'R':
				return (result = 'rgb(44, 62, 80)');
			case 'S':
				return (result = 'rgb(127, 140, 141)');
			case 'T':
				return (result = '#bd3d0a');
			case 'U':
				return (result = 'rgb(51 152 219)');
			case 'Ư':
				return (result = 'rgb(241, 196, 15)');
			case 'V':
				return (result = '#759e13');
			case 'X':
				return (result = 'rgb(142, 68, 173)');
			case 'W':
				return (result = 'rgb(211, 84, 0)');
		}
		return result;
	}
}
