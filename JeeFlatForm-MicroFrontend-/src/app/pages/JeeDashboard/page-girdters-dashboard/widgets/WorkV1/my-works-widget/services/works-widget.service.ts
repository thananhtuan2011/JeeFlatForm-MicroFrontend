import { Injectable, Inject, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { AuthService } from "src/app/modules/auth";
import { QueryParamsModel, QueryResultsModel } from "src/app/modules/auth/models/query-params.model";
import { HttpUtilsService } from "src/app/modules/crud/utils/http-utils.service";

const API = environment.HOST_JEEWORK_API;
const API_WORK_CLICKUP = environment.HOST_JEEWORK_API + `/api/work-click-up`;
const API_Lite = environment.HOST_JEEWORK_API + '/api/wework-lite';
const API_work_CU = environment.HOST_JEEWORK_API + '/api/work-click-up';
const API_ROOT_URL = environment.HOST_JEEWORK_API + '/api/menu'; 

@Injectable({
  providedIn: "root",
})
export class WidgetWorkService{

  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));


  API_URL = `/api/work-click-up`;
  public loadData: string = API + this.API_URL + "/my-list-wiget";
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService,auth: AuthService) {
  }

 
  ListAllStatusDynamic(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/list-all-status-dynamic`, { headers: httpHeaders });
	}

  UpdateByKey(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_work_CU + '/Update-by-key', item, { headers: httpHeaders });
	}

  GetRoleWeWork(id_nv: string) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL + `/GetRoleWeWork?id_nv=${id_nv}`, { headers: httpHeaders });
	}

  //============================================================================
  loadList(queryParams: QueryParamsModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = API + '/api/widgets/page-my-work';
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }
}
