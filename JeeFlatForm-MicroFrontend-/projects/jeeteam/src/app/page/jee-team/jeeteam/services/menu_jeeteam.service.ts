import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/jeeteam/src/environments/environment';
import { QueryParamsModel, QueryResultsModel } from '../model/pagram';
import { HttpUtilsService } from 'projects/jeeteam/src/modules/crud/utils/http-utils.service';


@Injectable()
export class MenuJeeTeamServices {
	data_share$ = new BehaviorSubject<any>([]);



	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	ReadOnlyControl: boolean;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	layMenuChucNang(search: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEETEAM_API + `/api/menu/GetMenu?valueser=${search}`, { headers: httpHeaders });
	}

	DeletePrivateMenu(RowIdChildSub: number) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(environment.HOST_JEETEAM_API + `/api/menu/DeletePrivateMenu	?RowIdChildSub=${RowIdChildSub}`, null, { headers: httpHeaders });
	}

	DeleteSubMenu(RowIdSubMenu: number) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(environment.HOST_JEETEAM_API + `/api/menu/DeleteSubMenu?RowIdSubMenu=${RowIdSubMenu}`, null, { headers: httpHeaders });
	}
	public getAuthFromLocalStorage(): any {

		return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
	}
	AddHidden(item: any) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(environment.HOST_JEETEAM_API + `/api/menu/AddHidden`, item, { headers: httpHeaders });
	}
	DeleteHidden(item: any) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(environment.HOST_JEETEAM_API + `/api/menu/DeleteHidden`, item, { headers: httpHeaders });
	}
	DeleteMenu(IdMenu: number) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(environment.HOST_JEETEAM_API + `/api/menu/DeleteMenu?RowIdMenu=${IdMenu}`, null, { headers: httpHeaders });
	}
	addMemberMenu(item: any) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(environment.HOST_JEETEAM_API + `/api/menu/AddMemberGroup`, item, { headers: httpHeaders });
	}
	DeleteMemberTeam(RowIdMenu: number, IdUser: number) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(environment.HOST_JEETEAM_API + `/api/menu/DeleteMemberTeam?RowIdMenu=${RowIdMenu}&&IdUser=${IdUser}`, null, { headers: httpHeaders });
	}
	addChannel(item: any) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(environment.HOST_JEETEAM_API + `/api/menu/InsertChannel`, item, { headers: httpHeaders });
	}

	GetHeaderMenu(id: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEETEAM_API + `/api/menu/GetHeaderMenu?id_headermenu=${id}`, { headers: httpHeaders });
	}

	GetHeaderMenuChild(id: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEETEAM_API + `/api/menu/GetHeaderMenuPrivate?id_headermenuchild=${id}`, { headers: httpHeaders });
	}


}
