
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/jeemeet/src/environments/environment';
import { QueryParamsModel } from '../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../models/query-models/query-results.model';
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
