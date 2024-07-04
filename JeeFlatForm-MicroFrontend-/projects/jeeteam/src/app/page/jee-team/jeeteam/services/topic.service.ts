import { TopicModel } from './../model/topic';

import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { TableJeeTeamService } from './tableJeeTeam.service';
import { environment } from 'projects/jeeteam/src/environments/environment';
import { HttpUtilsService } from 'projects/jeeteam/src/modules/crud/utils/http-utils.service';
import { QueryParamsModelNewLazy, QueryResultsModel } from '../model/pagram';

@Injectable({
  providedIn: 'root'
})
export class TopicService extends TableJeeTeamService<any>  {

  baseUrl = environment.HOST_JEETEAM_API + '/api/topic';
  ;
  constructor(@Inject(HttpClient) http, @Inject(HttpUtilsService) httpUtils,) {
    super(http, httpUtils);
  }

  readonly _Comment$ = new BehaviorSubject<any>(
    undefined
  );
  private readonly _OpenComment = new BehaviorSubject<any>(
    undefined
  );
  readonly _OpenComment$ = this._OpenComment.asObservable();

  get data_share_OpenComment() {
    return this._OpenComment.getValue();
  }
  set data_share_OpenComment(val) {
    this._OpenComment.next(val);
  }

  private readonly _IdMenu = new BehaviorSubject<any>(
    undefined
  );
  readonly _IdMenu$ = this._IdMenu.asObservable();

  get data_share() {
    return this._IdMenu.getValue();
  }
  set data_share(val) {
    this._IdMenu.next(val);
  }
  public GroupHeaderMenu = new BehaviorSubject<any>(undefined);
  GroupHeaderMenu$ = this.GroupHeaderMenu.asObservable();


  public getAuthFromLocalStorage(): any {

    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }
  // httpUtils.getHTTPHeaders() {

  //   const data = this.getAuthFromLocalStorage();

  //   // console.log('auth.token',auth.access_token)
  //   let result = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer ' + data.access_token,
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Headers': 'Content-Type'
  //   });
  //   return result;
  // }
  GetUserReaction(idchat: number, type: number) {
    const url = this.baseUrl + `/GetUserReaction?idtopic=${idchat}&type=${type}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeader });
  }

  getTopicForComment(idTopic: number): Observable<QueryResultsModel> {
    const url = this.baseUrl + `/getTopicForComment?idTopic=${idTopic}`;
    const httpHeader = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.getFindHTTPParams(queryParams);
    return this.http.get<any>(url, { headers: httpHeader });

  }
  InsertReaction(id: number, type: number, idsub: number): Observable<any> {

    const httpHeaders = this.httpUtils.getHTTPHeaders();

    return this.http.post<any>(this.baseUrl + `/InsertReaction?id=${id}&type=${type}&RowIdSub=${idsub}`, null, { headers: httpHeaders });
  }
  InsertTopic(item: TopicModel) {
    const url = this.baseUrl + `/InsertTopic`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, item, { headers: httpHeader });
  }
  UpdateCountComment(IdTopic: number) {
    const url = this.baseUrl + `/UpdateCountComment?IdTopic=${IdTopic}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }

  RemoveCountComment(IdTopic: number) {
    const url = this.baseUrl + `/RemoveCountComment?IdTopic=${IdTopic}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }


  DeleteTopic(IdTopic: number) {
    const url = this.baseUrl + `/DeleteTopic?IdTopic=${IdTopic}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }
  DeleteFile(id_attchment: number,) {
    const url = this.baseUrl + `/DeleteFile?id_attchment=${id_attchment}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }


  getFindHTTPParams(queryParams): HttpParams {
    let params = new HttpParams()
      //.set('filter',  queryParams.filter )
      .set('sortOrder', queryParams.sortOrder)
      .set('sortField', queryParams.sortField)
      .set('page', (queryParams.pageNumber + 1).toString())
      .set('record', queryParams.pageSize.toString());
    let keys = [], values = [];
    if (queryParams.more) {
      params = params.append('more', 'true');
    }
    Object.keys(queryParams.filter).forEach(function (key) {
      if (typeof queryParams.filter[key] !== 'string' || queryParams.filter[key] !== '') {
        keys.push(key);
        values.push(queryParams.filter[key]);
      }
    });
    if (keys.length > 0) {
      params = params.append('filter.keys', keys.join('|'))
        .append('filter.vals', values.join('|'));
    }
    return params;
  }
  GetDSTopic(idmenu: number, isprivate: boolean, queryParams: QueryParamsModelNewLazy): Observable<QueryResultsModel> {
    const url = this.baseUrl + `/getDSTopic?idmenu=${idmenu}&isprivate=${isprivate}`;
    const httpHeader = this.httpUtils.getHTTPHeaders();
    const httpParams = this.getFindHTTPParams(queryParams);
    return this.http.post<any>(url, null, { headers: httpHeader, params: httpParams });

  }
  UpdateTopic(idtopic: number, item: any): Observable<QueryResultsModel> {
    const url = this.baseUrl + `/UpdateTopic?IdTopic=${idtopic}`;
    const httpHeader = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.getFindHTTPParams(queryParams);
    return this.http.post<any>(url, item, { headers: httpHeader });

  }
  GetHeaderMenu(id: number): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(environment.HOST_JEETEAM_API + `/api/menu/GetHeaderMenu?id_headermenu=${id}`, { headers: httpHeaders });
  }


}
