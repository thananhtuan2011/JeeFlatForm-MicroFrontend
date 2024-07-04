import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryResultsModel } from 'src/app/modules/auth/models/query-params.model';

const API = environment.HOST_JEEWORK_API_2023;
@Injectable({
  providedIn: 'root'
})
export class WidgetMembersService{
  public loadData: string = API + '/api/widgets/members';

  constructor(private http: HttpClient,
    private httpUtils: HttpUtilsService,) {

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
