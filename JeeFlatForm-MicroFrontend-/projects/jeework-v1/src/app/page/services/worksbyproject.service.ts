import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { environment } from "projects/jeework-v1/src/environments/environment";
import { QueryParamsModelNew } from "../models/query-models/query-params.model";
import { HttpUtilsService } from "projects/jeework-v1/src/modules/crud/utils/http-utils.service";
import { QueryResultsModel } from "../models/query-models/query-results.model";

const API_JEEWORK_wiget = environment.HOST_JEEWORK_API + "/api/widgets";
const API_Project_Team = environment.HOST_JEEWORK_API + "/api/project-team";
const API_JEEWORK_lite = environment.HOST_JEEWORK_API + "/api/wework-lite";
const API_Lite = environment.HOST_JEEWORK_API + '/api/wework-lite';
const API_ROOT_URL = environment.HOST_JEEWORK_API + '/api/menu'; 
const API_work_CU = environment.HOST_JEEWORK_API + '/api/work-click-up';

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
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = API_JEEWORK_wiget + "/works-by-project";
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }
  ListAllStatusDynamic() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEEWORK_lite + "/list-all-status-dynamic";
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  findListActivities(
    queryParams: QueryParamsModelNew
  ): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = API_JEEWORK_wiget + "/List-activities";
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }
  LogDetail(id: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_JEEWORK_wiget}/log-detail?id=${id}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  // setup avatar
  getNameUser(val) {
    if (val) {
      var list = val.split(" ");
      return list[list.length - 1];
    }
    return "";
  }

  getColorNameUser(fullname) {
    var name = this.getNameUser(fullname).substr(0, 1);
    var result = "#bd3d0a";
    switch (name) {
      case "A":
        result = "rgb(197, 90, 240)";
        break;
      case "Ă":
        result = "rgb(241, 196, 15)";
        break;
      case "Â":
        result = "rgb(142, 68, 173)";
        break;
      case "B":
        result = "#02c7ad";
        break;
      case "C":
        result = "#0cb929";
        break;
      case "D":
        result = "rgb(44, 62, 80)";
        break;
      case "Đ":
        result = "rgb(127, 140, 141)";
        break;
      case "E":
        result = "rgb(26, 188, 156)";
        break;
      case "Ê":
        result = "rgb(51 152 219)";
        break;
      case "G":
        result = "rgb(44, 62, 80)";
        break;
      case "H":
        result = "rgb(248, 48, 109)";
        break;
      case "I":
        result = "rgb(142, 68, 173)";
        break;
      case "K":
        result = "#2209b7";
        break;
      case "L":
        result = "#759e13";
        break;
      case "M":
        result = "rgb(236, 157, 92)";
        break;
      case "N":
        result = "#bd3d0a";
        break;
      case "O":
        result = "rgb(51 152 219)";
        break;
      case "Ô":
        result = "rgb(241, 196, 15)";
        break;
      case "Ơ":
        result = "rgb(142, 68, 173)";
        break;
      case "P":
        result = "rgb(142, 68, 173)";
        break;
      case "Q":
        result = "rgb(91, 101, 243)";
        break;
      case "R":
        result = "rgb(44, 62, 80)";
        break;
      case "S":
        result = "rgb(122, 8, 56)";
        break;
      case "T":
        result = "rgb(120, 76, 240)";
        break;
      case "U":
        result = "rgb(51 152 219)";
        break;
      case "Ư":
        result = "rgb(241, 196, 15)";
        break;
      case "V":
        result = "rgb(142, 68, 173)";
        break;
      case "X":
        result = "rgb(142, 68, 173)";
        break;
      case "W":
        result = "rgb(211, 84, 0)";
        break;
    }
    return result;
  }

  lite_project_by_manager(keyword: string = ""): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/lite_project_by_manager?keyword=${keyword}`, { headers: httpHeaders });
	}

  lite_department_by_manager(keyword: string = ""): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/lite_department_by_manager?keyword=${keyword}`, { headers: httpHeaders });
	}

  lite_department_by_manager31(keyword: string = ""): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/lite_department_by_manager?keyword=${keyword}`, { headers: httpHeaders });
	}

  lite_project_team_byuser(keyword: string = ""): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/lite_project_team_byuser?keyword=${keyword}`, { headers: httpHeaders });
	}

  GetRoleWeWork(id_nv: string) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL + `/GetRoleWeWork?id_nv=${id_nv}`, { headers: httpHeaders });
	}

  lite_tag(id_project_team: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/lite_tag?id_project_team=${id_project_team}`, { headers: httpHeaders });
	}

  UpdateByKey(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_work_CU + '/Update-by-key', item, { headers: httpHeaders });
	}

  list_account(filter: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let params = this.httpUtils.parseFilter(filter);
		return this.http.get<any>(API_Lite + `/lite_account`, { headers: httpHeaders, params: params });
	}

  InsertTask(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_work_CU + '/Insert';
		return this.http.post<QueryResultsModel>(url, item, {
			headers: httpHeaders,
		});
	}
}
