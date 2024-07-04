import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject, of } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { TicketManagementDTO2 } from "../_models/ticket-management.model";
import { environment } from "projects/jeeticket/src/environments/environment";
import { ITableService } from "./itable.service";
import { HttpUtilsService } from "../../../modules/crud/utils/http-utils.service";

const Api_lite = environment.HOST_JEETICKET_API + '/api/general';
@Injectable()
export class JeeTicKetLiteService extends ITableService<any> {
  constructor(@Inject(HttpClient) http, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }
  API_URL_FIND: string;
  API_URL_CTEATE: string;
  API_URL_EDIT: string;
  API_URL_DELETE: string;


  list_account(): Observable<any> {
      this.API_URL_FIND=Api_lite+ `/list-account`;
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        //let params = this.httpUtils.parseFilter(filter);
        return this.http.get<any>(Api_lite + `/list-account`, {headers: httpHeaders});
    }
    getIdCurren(table:any): Observable<any> {
          const httpHeaders = this.httpUtils.getHTTPHeaders();
          //let params = this.httpUtils.parseFilter(filter);
          return this.http.get<any>(Api_lite + `/GetIdCurrent/${table}`, {headers: httpHeaders});
      }

    list_status(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(Api_lite + `/list-status`, {headers: httpHeaders});
    }

    list_app_code_tp3(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(Api_lite + `/list-app-code-tp3`, {headers: httpHeaders});
    }


    list_tags(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = Api_lite + `/list-tags`;
        return this.http.get<any>(url, { headers: httpHeaders });
      }
    list_linhvucyeucau(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(Api_lite + `/list-linhvucyeucau`, {headers: httpHeaders});
    }

    list_phanloaihotro(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(Api_lite + `/list-phanloaihotro`, {headers: httpHeaders});
    }
}
