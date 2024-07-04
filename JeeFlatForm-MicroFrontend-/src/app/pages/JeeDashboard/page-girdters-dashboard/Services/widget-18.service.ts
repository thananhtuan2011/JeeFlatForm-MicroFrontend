import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryParamsModel, QueryResultsModel } from 'src/app/modules/auth/models/query-params.model';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';
import { environment } from 'src/environments/environment';
const API = environment.HOST_JEEWORK_API_2023;
@Injectable({
  providedIn: 'root'
})
export class Widget18Service {
  API_URL = `/api/widgets`;
  public loadData: string = API + this.API_URL + '/tong-thoi-han-nhiem-vu';
  constructor(private http: HttpClient,
    private httpUtils: HttpUtilsService) {
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
