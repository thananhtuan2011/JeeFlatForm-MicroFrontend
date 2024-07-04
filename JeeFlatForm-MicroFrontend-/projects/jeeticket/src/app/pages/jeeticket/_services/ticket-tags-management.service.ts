import { TicketTagsDTO, TicketTagsModel } from './../_models/ticket-tags-management.model';
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject, of } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { TicketManagementDTO2 } from "../_models/ticket-management.model";
import { environment } from 'projects/jeeticket/src/environments/environment';
import { ITableService } from './itable.service';
import { HttpUtilsService } from '../../../modules/crud/utils/http-utils.service';

const API_PRODUCTS_URL = environment.HOST_JEETICKET_API + '/api/TicketTags';

@Injectable()
export class TicketTagsManagementService extends ITableService<TicketTagsDTO[]> {
  constructor(@Inject(HttpClient) http, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }
  API_URL_FIND: string = API_PRODUCTS_URL + '/GetListTags';
  API_URL_CTEATE: string = API_PRODUCTS_URL + '/CreateTags';
  API_URL_EDIT: string = API_PRODUCTS_URL + '/UpdateTags';
  API_URL_DELETE: string = API_PRODUCTS_URL + '/DeleteTags';
  API_URL: string = API_PRODUCTS_URL;


  
  CreateTicketTags(item: TicketTagsModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/CreateTicketTags';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  UpdateTicketTags(item: TicketTagsModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/update-tag-ticket';
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

  GetTicketTagsByRowID(rowid: number): Observable<TicketTagsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetTagsByRowID/${rowid}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  DeleteTicketTags(rowid: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/DeleteTags/${rowid}`;
    return this.http.delete<any>(url, {
      headers: httpHeaders,
    });
  }

  DeleteTicketTagsByTagId(tagId: number): Observable<any>{
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/DeleteTicketTagsByTagId/${tagId}`;
    return this.http.delete<any>(url, {
      headers: httpHeaders,
    });
  }
}
