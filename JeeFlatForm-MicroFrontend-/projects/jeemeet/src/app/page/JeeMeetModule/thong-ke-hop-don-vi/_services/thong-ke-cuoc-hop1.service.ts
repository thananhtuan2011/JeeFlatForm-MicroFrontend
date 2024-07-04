
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


export class ThongKeCuocHop1Service extends ITableService<any> implements OnDestroy {
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
    var url = API_PRODUCTS_URL + `/Excel_ThongKeCuocHop_DetailCuocHop?more=true&filter.keys=id&filter.vals=${filter.id}`;
    return this.http.get<any>(url, { headers: httpHeaders });

  }


}

