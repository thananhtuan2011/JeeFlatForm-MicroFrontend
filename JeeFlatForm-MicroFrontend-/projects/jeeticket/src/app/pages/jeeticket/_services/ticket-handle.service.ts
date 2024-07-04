import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject, of } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { TicketManagementDTO2 } from "../_models/ticket-management.model";
import { environment } from "projects/jeeticket/src/environments/environment";
import { ITableService } from "./itable.service";
import { HttpUtilsService } from "../../../modules/crud/utils/http-utils.service";
// const API_DatPhong = environment.HOST_JEEADMIN_API;
// const API_general = environment.HOST_JEEMEETING_API + "/api/General";
// const API_Meeting = environment.HOST_JEEMEETING_API + "/api/Meeting";
// const API_Work = environment.HOST_JEEWORK_API + "/api";

 //const API_PRODUCTS_URL = environment.HOST_JEEMEETING_API + '/api/Meeting';
const API_Ticket_URL = environment.HOST_JEETICKET_API + '/api/ticketmanagement';

@Injectable()
export class TicKetHandleService extends ITableService<TicketManagementDTO2[]> {
	data_share$ = new BehaviorSubject<any>([]);
    data_shareLoad$ = new BehaviorSubject<any>([]);
	API_URL = `/api/YeuCau`;

    API_URL_FIND= API_Ticket_URL + '/GetTicketManagementByHandle';
    	API_URL_CTEATE: string = API_Ticket_URL + '';
	API_URL_EDIT: string = API_Ticket_URL + '';
	API_URL_DELETE: string = API_Ticket_URL + '';


	constructor(@Inject(HttpClient) http, @Inject(HttpUtilsService) httpUtils) {
		super(http, httpUtils);
	 }


}
