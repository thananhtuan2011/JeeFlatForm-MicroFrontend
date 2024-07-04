import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject, of } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { TicketManagementDTO2 } from "../_models/ticket-management.model";
import { TicketDocumentDTO } from "../_models/ticket-document-management.model";
import { environment } from "projects/jeeticket/src/environments/environment";
import { ITableService } from "./itable.service";
import { HttpUtilsService } from "../../../modules/crud/utils/http-utils.service";
// const API_DatPhong = environment.HOST_JEEADMIN_API;
// const API_general = environment.HOST_JEEMEETING_API + "/api/General";
// const API_Meeting = environment.HOST_JEEMEETING_API + "/api/Meeting";
// const API_Work = environment.HOST_JEEWORK_API + "/api";

//const API_PRODUCTS_URL = environment.HOST_JEEMEETING_API + '/api/Meeting';
const API_Ticket_URL = environment.HOST_JEETICKET_API + "/api/ticketmanagement";
const API_DOC_Ticket_URL=environment.HOST_JEETICKET_API+"/api/ticketdocumentmanagement";

@Injectable()
export class TicketDocumentService extends ITableService<TicketDocumentDTO[]> {
  data_share$ = new BehaviorSubject<any>([]);
  data_shareLoad$ = new BehaviorSubject<any>([]);
  API_URL = `/api/TicketDocumentManagement`;

  API_URL_FIND = API_Ticket_URL + "/GetListTicketDocument";
  API_URL_CTEATE: string = API_Ticket_URL + "";
  API_URL_EDIT: string = API_Ticket_URL + "";
  API_URL_DELETE: string = API_Ticket_URL + "";
  API_DOC_CREATE:string=API_DOC_Ticket_URL+"";

  constructor(@Inject(HttpClient) http, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }
  GetListDocumentByTicketID(ticketID: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeadersWW();
    const url = `${this.API_URL}/GetListTicketDocument/${ticketID}`;
    // const url = `${API_work_CU}/Detail?id=${id}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  CreateDocumentByForm(item: any, idTicket: number) {
    const url = this.API_DOC_CREATE + `/CreateDocumentByForm?idTicket=${idTicket}`
    const httpHeader = this.httpUtils.getHttpHeaderFiles();
    return this.http.post(url, item, { reportProgress: true, observe: 'events', headers: httpHeader });
  }
}
