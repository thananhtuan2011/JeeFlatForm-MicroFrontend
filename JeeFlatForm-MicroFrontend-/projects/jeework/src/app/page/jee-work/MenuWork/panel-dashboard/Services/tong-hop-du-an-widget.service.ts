import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeework/src/environments/environment';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
const API = environment.HOST_JEEWORK_API_2023;
const API_OLD = environment.HOST_JEEWORK_API;
@Injectable({
  providedIn: 'root'
})
export class WidgetTongHopDuAnService {
  // public loadData: string = API_OLD + '/api/widgets/gov-report-by-project';
  public loadData: string = API + '/api/widgets/tinh-hinh-nhiem-vu';
  constructor(
    private httpUtils: HttpUtilsService, private http: HttpClient,) {

  }
  
  loadList(queryParams: QueryParamsModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = this.loadData;
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }
}
