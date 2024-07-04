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
const Api_tags = environment.HOST_JEETICKET_API + '/api/listtags';

@Injectable()
export class TagsManagementService extends ITableService<TicketManagementDTO2[]> {
	data_share$ = new BehaviorSubject<any>([]);
    data_shareLoad$ = new BehaviorSubject<any>([]);
	API_URL = `/api/YeuCau`;

    API_URL_FIND= Api_tags + '/GetListTags';
    	API_URL_CTEATE: string = Api_tags + '';
	API_URL_EDIT: string = Api_tags + '';
	API_URL_DELETE: string = Api_tags + '';


	constructor(@Inject(HttpClient) http, @Inject(HttpUtilsService) httpUtils) {
		super(http, httpUtils);
	 }
     CreateTags(item: TagsModel): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = Api_tags + '/CreateTags';
        return this.http.post<any>(url, item, { headers: httpHeaders });
      }
    
      UpdateTags(item: TagsModel): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = Api_tags + '/UpdateTags';
        return this.http.post<any>(url, item, { headers: httpHeaders });
      }
    
      // changeTinhTrang(acc: JobChangeTinhTrangModel): Observable<any> {
      //   const httpHeaders = this.httpUtils.getHTTPHeaders();
      //   const url = API_PRODUCTS_URL + `/ChangeTinhTrang`;
      //   return this.http.post<any>(url, acc, {
      //     headers: httpHeaders,
      //   });
      // }
      ngOnDestroy(): void {
        this.subscriptions.forEach((sb) => sb.unsubscribe());
      }
    
      GetTagsByRowID(rowid: number): Observable<TagsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = Api_tags + `/GetTagsByRowID/${rowid}`;
        return this.http.get<any>(url, { headers: httpHeaders });
      }
    
      DeleteTags(rowid: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = Api_tags + `/DeleteTags/${rowid}`;
        return this.http.delete<any>(url, {
          headers: httpHeaders,
        });
      }
    

}
