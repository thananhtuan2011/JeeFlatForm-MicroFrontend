
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable, Inject, OnDestroy } from '@angular/core';
import { environment } from 'projects/jeemeet/src/environments/environment';
import { ITableService } from '../../_services/itable.service';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';

const API_PRODUCTS_URL = environment.APIROOT + '/api/quanlycuochop';


@Injectable({
  providedIn: 'root'

})


export class ThongKeCuocHop2Service extends ITableService<any> implements OnDestroy {
  API_URL: string = API_PRODUCTS_URL;
  API_URL_FIND: string = API_PRODUCTS_URL + '';
  API_URL_EDIT: string = API_PRODUCTS_URL + '';
  API_URL_CTEATE: string = API_PRODUCTS_URL + '';
  API_URL_DELETE: string = API_PRODUCTS_URL + '';


  constructor(@Inject(HttpClient) http: any, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }


  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());

  }
  exportExcelDetail(filter): Observable<any> {

    const httpHeaders = this.httpUtils.getHTTPHeaders();
    var url = API_PRODUCTS_URL + `/Excel_ThongKeCuocHop_DetailUser?more=true&filter.keys=id&filter.vals=${filter.id}`;
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

}

