import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { environment } from "src/environments/environment";
import { QueryParamsModel, QueryResultsModel } from "src/app/modules/auth/models/query-params.model";
import { HttpUtilsService } from "src/app/modules/crud/utils/http-utils.service";
import { QueryParamsModelNew } from "src/app/_metronic/core/models/pagram";

const API_JEEWORK_wiget = environment.HOST_JEEWORK_API_2023 + "/api/widgets";

@Injectable({
  providedIn: "root",
})
export class WorksbyprojectService {
  lastFilter$: BehaviorSubject<QueryParamsModelNew> = new BehaviorSubject(
    new QueryParamsModelNew({}, "asc", "", 0, 10)
  );
  ReadOnlyControl: boolean;
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  WorksByProject(queryParams: QueryParamsModelNew) {
    const httpHeaders = this.httpUtils.getHTTPHeaders(1.2);
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = API_JEEWORK_wiget + "/works-by-project";
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  getWorkSumaryByProject(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = environment.HOST_JEEWORK_API_2023 + '/api/work/work-summary-by-project';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams,
		});
	}
}
