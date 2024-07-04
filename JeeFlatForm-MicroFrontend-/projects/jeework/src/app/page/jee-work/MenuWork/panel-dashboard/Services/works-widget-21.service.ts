import { Injectable, Inject, OnDestroy } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { environment } from "projects/jeework/src/environments/environment";
import { QueryParamsModel } from "../../../models/query-models/query-params.model";
import { HttpUtilsService } from "projects/jeework/src/modules/crud/utils/http-utils.service";
import { QueryResultsModel } from "../../../models/query-models/query-results.model";

const API = environment.HOST_JEEWORK_API_2023;
const API_ROOT_URL = environment.HOST_JEEWORK_API + '/api/menu'; 

@Injectable({
  providedIn: "root",
})
export class WidgetWork21Service{

  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
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
