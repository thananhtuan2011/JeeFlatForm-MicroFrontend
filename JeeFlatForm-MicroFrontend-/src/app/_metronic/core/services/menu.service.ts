import { HttpUtilsService } from './../../../modules/crud/utils/http-utils.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { QueryParamsModel } from 'src/app/modules/auth/models/query-models/query-params.model';
import { QueryResultsModel } from 'src/app/modules/auth/models/query-models/query-results.model';


@Injectable()
export class MenuServices {
	data_share$ = new BehaviorSubject<any>([]);


	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	ReadOnlyControl: boolean;
	OpenTabChat$ = new BehaviorSubject<any>(false);
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	LayMenuLeft_Desktop(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/menu/LayMenuLeft_Desktop`, { headers: httpHeaders });
	}

	GetListMenu(app: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/menu/LayMenu_Desktop?app=${app}`, { headers: httpHeaders });
	}

	CloseMenu() {
		document.body.classList.add('aside-minimize');
	}
	OpenMenu() {
		document.body.classList.remove('aside-minimize');
	}
	Coun
	Count_SoLuongNhacNho(): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();

		return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/widgets/Count_SoLuongNhacNho`, { headers: httpHeaders });

	}
	Get_DSNhacNho(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/widgets/Get_DSNhacNho`, { headers: httpHeaders });
	}

	GetContactChatUser() {
		const url = environment.HOST_JEECHAT_API + '/api/chat/Get_Contact_Chat'
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	GetCountUnreadMessage() {
		const url = environment.HOST_JEECHAT_API + `/api/chat/GetCountUnreadMessage`;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	CheckUseWizard(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/wizard/CheckUseWizard`, { headers: httpHeaders });
	}
}
