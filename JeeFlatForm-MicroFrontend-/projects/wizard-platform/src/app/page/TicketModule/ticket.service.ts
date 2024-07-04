import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { PhanloaihotroModel } from './component/Model/phan-loai-ho-tro-management.model';
import { LinhvucyeucauModel } from './component/Model/linh-vuc-yeu-cau-management.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { ListStatusModel } from './component/Model/list-status-list-managament.model';


const HOST_JEEACCOUNT_API = environment.HOST_JEEACCOUNT_API;
const HOST_TICKET_API = environment.HOST_TICKET_API;
const API_PRODUCTS_URL = environment.HOST_TICKET_API + '/api/PhanloaihotroManagement';
const API_LINHVUCYEUCAU_URL = environment.HOST_TICKET_API + '/api/linhvucyeucaumanagement';
const API_STATUS_URL = environment.HOST_TICKET_API + '/api/statusmanagement';
@Injectable({
	providedIn: 'root'
})
export class TicKetService {
	send$ = new BehaviorSubject<any>([]);


	constructor(private http: HttpClient, private httpUtils: HttpUtilsService,) { }

	isEqual(object, otherObject) {
		return Object.entries(this.sortObject(object)).toString() === Object.entries(this.sortObject(otherObject)).toString();
	}
	sortObject(obj) {
		return Object.keys(obj)
			.sort()
			.reduce(function (result, key) {
				result[key] = obj[key];
				return result;
			}, {});
	}

	getLogoApp(AppID): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEACCOUNT_API + `/api/logo/Get_LogoApp?AppID=${AppID}`, {
			headers: httpHeader,
		});
	}

	getListApp(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEACCOUNT_API + '/api/accountmanagement/GetListAppByUserID', {
			headers: httpHeaders,
		});
	}

	getWizard(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = HOST_TICKET_API + `/api/general/wizard/${id}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	Get_List_Account(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${HOST_TICKET_API}/api/general/list-account`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	DeletePhanloaihotro(rowid: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + `/DeletePhanloaihotro/${rowid}`;
		return this.http.delete<any>(url, {
			headers: httpHeaders,
		});
	}
	GetPhanloaihotro2(rowid: number) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + `/GetPhanloaihotro2/${rowid}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	getLinhvucyeucauCombo(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + `/getLinhvucyeucauCombo`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	CreatePhanloaihotro(item: PhanloaihotroModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + '/CreatePhanloaihotro';
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	UpdateDepart(item: PhanloaihotroModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + '/UpdatePhanloaihotro';
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}
	GetListPhanloaihotro(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + `/GetListPhanloaihotro`;
		return this.http.get<any>(url, { headers: httpHeaders, params: httpParams });
	}
	GetListLinhvucyeucauManagement(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);

		const url = API_LINHVUCYEUCAU_URL + `/GetListLinhvucyeucauManagement`;
		return this.http.get<any>(url, { headers: httpHeaders, params: httpParams });
	}
	CreateLinhvucyeucau(item: LinhvucyeucauModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_LINHVUCYEUCAU_URL + '/CreateLinhvucyeucau';
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	UpdateLinhvucyeucau(item: LinhvucyeucauModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_LINHVUCYEUCAU_URL + '/UpdateLinhvucyeucau';
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}
	DeleteLinhvucyeucau(rowid: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_LINHVUCYEUCAU_URL + `/DeleteLinhvucyeucau/${rowid}`;
		return this.http.delete<any>(url, {
			headers: httpHeaders,
		});
	}
	GetListStatus(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_STATUS_URL + `/GetListStatus`;
		return this.http.get<any>(url, { headers: httpHeaders, params: httpParams });
	}
	GetStatusByRowID(rowid: number): Observable<ListStatusModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_STATUS_URL + `/GetStatusByRowID/${rowid}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	CreateStatus(item: ListStatusModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_STATUS_URL + '/CreateStatus';
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	UpdateStatus(item: ListStatusModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_STATUS_URL + '/UpdateStatus';
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}
	DeleteStatus(rowid: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_STATUS_URL + `/DeleteStatus/${rowid}`;
		return this.http.delete<any>(url, {
			headers: httpHeaders,
		});
	}

	UpdateInitStatusApp(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = HOST_JEEACCOUNT_API + `/api/permissionmanagement/UpdateInitStatusApp/20/2`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
}
