import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkModel } from '../Model/page-girdters-dashboard.model';
import { environment } from 'projects/jeehr/src/environments/environment';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryResultsModel } from 'src/app/modules/auth/models/query-params.model';
const API = environment.HOST_JEEWORK_API_2023;
@Injectable({
  providedIn: 'root'
})
export class Widget19Service {
  API_URL = `/api/widgets`;
  public loadData: string = API + this.API_URL + '/gov-status-department';
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
