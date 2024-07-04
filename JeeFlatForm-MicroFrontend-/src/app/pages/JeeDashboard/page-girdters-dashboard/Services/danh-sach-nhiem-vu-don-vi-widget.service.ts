import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { QueryParamsModelNew, QueryResultsModel } from 'src/app/_metronic/core/models/pagram';
import { environment } from 'src/environments/environment';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';

const API_JEEWORK = environment.HOST_JEEWORK_API_2023 + "/api/widgets";
const API_ROOT_URL = environment.HOST_JEEWORK_API_2023 + '/api/menu';
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