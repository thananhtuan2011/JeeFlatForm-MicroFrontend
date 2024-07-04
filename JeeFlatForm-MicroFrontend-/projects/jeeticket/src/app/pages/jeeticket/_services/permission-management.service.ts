import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject, of } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { TicketManagementDTO2 } from "../_models/ticket-management.model";
import { TagsModel } from "../_models/listtag-management.model";
import { environment } from "projects/jeeticket/src/environments/environment";
import { ITableService } from "./itable.service";
import { HttpUtilsService } from "../../../modules/crud/utils/http-utils.service";
// const API_DatPhong = environment.HOST_JEEADMIN_API;
// const API_general = environment.HOST_JEEMEETING_API + "/api/General";
// const API_Meeting = environment.HOST_JEEMEETING_API + "/api/Meeting";
// const API_Work = environment.HOST_JEEWORK_API + "/api";

//const API_PRODUCTS_URL = environment.HOST_JEEMEETING_API + '/api/Meeting';
const Api_permission =
  environment.HOST_JEETICKET_API + "/api/permissionmanagement";

@Injectable()
export class PermissionManagementService extends ITableService<
  TicketManagementDTO2[]
> {
  data_share$ = new BehaviorSubject<any>([]);
  data_shareLoad$ = new BehaviorSubject<any>([]);
  API_URL = `/api/YeuCau`;

  API_URL_FIND = Api_permission + "/GetListTags";
  API_URL_CTEATE: string = Api_permission + "";
  API_URL_EDIT: string = Api_permission + "";
  API_URL_DELETE: string = Api_permission + "";

  constructor(@Inject(HttpClient) http, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  GetListUserCanAccess(ticketId: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = Api_permission + `/list-user-can-access-JeePlatform/${ticketId}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
}
