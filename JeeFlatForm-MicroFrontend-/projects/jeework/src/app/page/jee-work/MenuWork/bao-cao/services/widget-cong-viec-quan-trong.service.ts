import { Injectable, Inject, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { BehaviorSubject, Observable } from "rxjs";
import { ProjectsInfoModel } from "../../panel-dashboard/Model/panel-dashboard.model";
import { TableMyWorkService } from "./tableMywork.service";
import { HttpUtilsService } from "projects/jeework/src/modules/crud/utils/http-utils.service";
import { QueryParamsModel } from "../../../models/query-models/query-params.model";
import { QueryResultsModel } from "../../../models/query-models/query-results.model";
import { AuthService } from "./auth.service";

const API = environment.HOST_JEEWORK_API;
const API_WORK_CLICKUP = environment.HOST_JEEWORK_API + `/api/work-click-up`;
const API_Lite = environment.HOST_JEEWORK_API_2023 + '/api/general';
const API_work_CU = environment.HOST_JEEWORK_API + '/api/work-click-up';
const API_ROOT_URL = environment.HOST_JEEWORK_API + '/api/menu';
const API_Tag_Customer = environment.HOST_JEEWORK_API + '/api/tag-customer'; 

@Injectable({
  providedIn: "root",
})
export class WidgetCongViecQuanTrongService
  extends TableMyWorkService<ProjectsInfoModel>
  implements OnDestroy {

  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));


  API_URL = `/api/work-click-up`;
  public loadData: string = API + this.API_URL + "/my-list-wiget";
  constructor(@Inject(HttpClient) http, private httpUtils: HttpUtilsService,auth: AuthService) {
    super(http,auth);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  MyList(queryParams: QueryParamsModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    return this.http.get<any>(API_WORK_CLICKUP + "/my-list-wiget", {
      headers: httpHeaders,
      params: httpParams,
    });
  }
  ListAllStatusDynamic(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/list-all-status-dynamic`, { headers: httpHeaders });
	}

  UpdateByKey(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_work_CU + '/Update-by-key', item, { headers: httpHeaders });
	}

  lite_department_byuser(keyword: string = ""): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/lite_department_byuser?keyword=${keyword}`, { headers: httpHeaders });
	}
  
  lite_customer_tag(id: string = ""): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/lite_customer_tag`, { headers: httpHeaders });
	}
  ListCustomerTag(queryParams: QueryParamsModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    return this.http.get<any>(API_Tag_Customer + "/List", {
      headers: httpHeaders,
      params: httpParams,
    });
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
