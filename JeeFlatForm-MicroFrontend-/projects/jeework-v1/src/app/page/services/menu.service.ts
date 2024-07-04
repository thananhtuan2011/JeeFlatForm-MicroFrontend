import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpUtilsService } from 'projects/jeework-v1/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { environment } from 'projects/jeework-v1/src/environments/environment';


@Injectable()
export class MenuServices {
	data_share$ = new BehaviorSubject<any>([]);
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	ReadOnlyControl: boolean;
	OpenTabChat$ = new BehaviorSubject<any>(false);
	GetApiForJeeTeam$ = new BehaviorSubject<any>(false);
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }


	GetListMenu(app: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/menu/LayMenu_Desktop?app=${app}`, { headers: httpHeaders });
	}
}
