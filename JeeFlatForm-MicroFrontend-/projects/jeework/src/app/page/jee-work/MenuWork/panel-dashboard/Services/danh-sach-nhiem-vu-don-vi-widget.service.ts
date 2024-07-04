import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { HttpClient } from '@angular/common/http';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeework/src/environments/environment';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';

const API_JEEWORK = environment.HOST_JEEWORK_API_2023 + "/api/widgets";
const API_ROOT_URL = environment.HOST_JEEWORK_API + '/api/menu';
@Injectable({
  providedIn: 'root',
})
export class DanhSachNhiemVuDonViService {
  lastFilter$: BehaviorSubject<QueryParamsModelNew> = new BehaviorSubject(
    new QueryParamsModelNew({}, "asc", "", 0, 10)
  );
  ReadOnlyControl: boolean;
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  loadList(queryParams: QueryParamsModelNew) {
    const httpHeaders = this.httpUtils.getHTTPHeaders(1.2);
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = API_JEEWORK + "/works-by-project2";
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }


}