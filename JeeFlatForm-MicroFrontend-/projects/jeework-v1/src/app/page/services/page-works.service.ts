import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { QueryParamsModelNew } from "../models/query-models/query-params.model";
import { QueryResultsModel } from "../models/query-models/query-results.model";
import { environment } from "projects/jeework-v1/src/environments/environment";
import { HttpUtilsService } from "projects/jeework-v1/src/modules/crud/utils/http-utils.service";

const API_JEEWORK_wiget = environment.HOST_JEEWORK_API + "/api/widgets";
const API_JEEWORK_lite = environment.HOST_JEEWORK_API + "/api/wework-lite";
@Injectable({
  providedIn: "root",
})
export class PageWorksService {
	lastFilter$: BehaviorSubject<QueryParamsModelNew> = new BehaviorSubject(new QueryParamsModelNew({}, 'asc', '', 0, 10));
	lastFilter1$: BehaviorSubject<QueryParamsModelNew> = new BehaviorSubject(new QueryParamsModelNew({}, 'asc', '', 0, 10));
	lastFilter2$: BehaviorSubject<QueryParamsModelNew> = new BehaviorSubject(new QueryParamsModelNew({}, 'asc', '', 0, 10));
	ReadOnlyControl: boolean;
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {}

  PageMyWorks(queryParams: QueryParamsModelNew) {
    queryParams.more = true;
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = API_JEEWORK_wiget + "/page-my-work";
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }
  ListAllStatusDynamic() {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEEWORK_lite + "/list-all-status-dynamic";
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
    });
  }
  ChangePage(queryParams: QueryParamsModelNew) {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = API_JEEWORK_wiget + "/my-list-wiget";
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
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
}
