import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkModel } from '../../../models/JeeWorkModel';
import { TableService } from './table.service';
import { environment } from 'projects/jeework/src/environments/environment';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { AuthService } from './auth.service';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
const API = environment.HOST_JEEWORK_API;
const API_Lite = environment.HOST_JEEWORK_API + '/api/general';
@Injectable({
  providedIn: 'root'
})
export class BieuDoTheoDoiService extends TableService<WorkModel> implements OnDestroy {
  API_URL = `/api/project-team`;
  public loadData: string = API + this.API_URL + '/List';
  constructor(@Inject(HttpClient) http,
    private httpUtils: HttpUtilsService,auth: AuthService,) {

    super(http,auth);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  ListMembers(queryParams: QueryParamsModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParamsJeeRequest(queryParams);
    return this.http.post<any>(
      this.loadData, queryParams,
      {
        headers: httpHeaders,
        params: httpParams
      }
    );
  }
  // lite_project_team_byuser(keyword: string = ""): Observable<any> {
	// 	const httpHeaders = this.httpUtils.getHTTPHeaders();
	// 	return this.http.get<any>(API_Lite + `/lite_project_team_byuser?keyword=${keyword}`, { headers: httpHeaders });
	// }
  lite_project_by_manager(keyword: string = ""): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/lite_project_by_manager?keyword=${keyword}`, { headers: httpHeaders });
	}
  getNameUser(val) {
    if (val) {
      var list = val.split(' ');
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
}
