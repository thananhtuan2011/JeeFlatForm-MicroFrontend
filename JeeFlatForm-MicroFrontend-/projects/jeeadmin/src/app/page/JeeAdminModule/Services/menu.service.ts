
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { QueryParamsModel } from 'src/app/modules/auth/models/query-models/query-params.model';
import { QueryResultsModel } from 'src/app/modules/auth/models/query-models/query-results.model';
import { HttpUtilsService } from 'projects/jeeadmin/src/modules/crud/utils/http-utils.service';

@Injectable()
export class MenuServices {
	data_share$ = new BehaviorSubject<any>([]);
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	ReadOnlyControl: boolean;

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	GetListMenu(app: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();		return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/menu/LayMenu_Desktop?app=${app}`, { headers: httpHeaders });

	}

	CloseMenu() {
	  document.body.classList.add('aside-minimize');
	}
	OpenMenu() {
	  document.body.classList.remove('aside-minimize');
	}
}
