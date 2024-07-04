import {  Subscription } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject, of } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { CATCH_ERROR_VAR } from '@angular/compiler/src/output/output_ast';
import { catchError, finalize, tap } from 'rxjs/operators';
//import { AccountDTO, AccountModel, AccountStatusModel } from '../Model/account-management.model';
import { FileUploadModel, TicKetActivityModel, TicketAgentModel, TicketManagementModel, TicketRequestManagementDTO } from '../_models/ticket-management.model';
import { environment } from 'projects/jeeticket/src/environments/environment';
import { ITableState } from '../_models/table.model';
import { PaginatorState } from '../_models/paginator.model';
import { SortState } from '../_models/sort.model';
import { GroupingState } from '../_models/grouping.model';
import { HttpUtilsService } from '../../../modules/crud/utils/http-utils.service';
import { ResultObjectModel } from '../_models/_base.model';
import { QueryParamsModel, QueryParamsModelNew } from '../_models/query-params.model';
import { QueryResultsModel } from '../_models/query-results.model';
const API_STATUS_URL = environment.HOST_JEETICKET_API + '/api/statusmanagement';
const API_PHANLOAI_URL = environment.HOST_JEETICKET_API + '/api/PhanloaihotroManagement';
const API_PRODUCTS_URL = environment.HOST_JEETICKET_API + '/api/ticketmanagement';
const API_CATEGORY2=environment.HOST_JEETICKET_API+'/api/ListCategory2Management';
const Api_lite = environment.HOST_JEETICKET_API + '/api/general';
const API_LinhVucYeuCau_URL = environment.HOST_JEETICKET_API + '/api/linhvucyeucaumanagement';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
};

@Injectable({
  providedIn: 'root' // just before your class
})
export class TicketRequestManagementService {
  send$= new BehaviorSubject<any>([]);
  // Private fields
  private _items$ = new BehaviorSubject<TicketRequestManagementDTO[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];
  private _tableAppCodeState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
//   // Getters
  get items$() {
    return this._items$.asObservable();
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this._errorMessage.asObservable();
  }
  get subscriptions() {
    return this._subscriptions;
  }
  get filter() {
    return this._tableState$.value.filter;
  }

  public patchState_send(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.GetListTicketByRequest_send();
  }

  public fetchStateSort(patch: Partial<ITableState>,typeRequest: number) {
    this.patchStateWithoutFetch(patch);
    this.GetListTicketByRequest_send();
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }
  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  public GetListTicketByRequest(typeRequest: number){
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.findData(this._tableState$.value,typeRequest)
      .pipe(
        tap((res: ResultObjectModel<TicketRequestManagementDTO[]>) => {

          this._items$.next(res.data);
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0,
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }
  // Base Methods




  private findData(tableState: ITableState, request: number): Observable<any> {
    this._errorMessage.next('');
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL +`/GetTicketManagementByRequest/${request}`;
    //const url = API_PRODUCTS_URL +`/GetTicketManagementByRequest`;
    const httpParams = this.httpUtils.getFindHTTPParamsITableState(tableState);
    return this.http
    .get<any>(url, {
      headers: httpHeaders,
      params: httpParams,
    }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        return of({ items: [], total: 0 });
      })
    );

  }

  public GetListTicketByRequest_send(){
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.findData_send(this._tableState$.value)
      .pipe(
        tap((res: ResultObjectModel<TicketRequestManagementDTO[]>) => {

          this._items$.next(res.data);
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0,
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }
  // Base Methods




  private findData_send(tableState: ITableState): Observable<any> {
    this._errorMessage.next('');
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL +`/GetTicketManagementBySend`;
    //const url = API_PRODUCTS_URL +`/GetTicketManagementByRequest`;
    const httpParams = this.httpUtils.getFindHTTPParamsITableState(tableState);
    return this.http
    .get<any>(url, {
      headers: httpHeaders,
      params: httpParams,
    }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        return of({ items: [], total: 0 });
      })
    );

  }




  GetStatusNoCustom(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_STATUS_URL + `/GetListStatusNoCustomerJeePlatform`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  getLinhvucyeucauCombo(queryParams:QueryParamsModelNew): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = API_PHANLOAI_URL + `/getLinhvucyeucauCombo`;
    return this.http.get<any>(url, { headers: httpHeaders,params: httpParams  });
  }

  getAllLinhVucHoTro(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PHANLOAI_URL + `/GetAllPhanLoaiHoTroJeePlatform`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  getTiceketPCByRowID(rowid: number): Observable<any>{
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetTicketPCManagementByRowIDJeePlatform/${rowid}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  // CreateTicketActivityManagement(item: TicKetActivityModel): Observable<any> {
  //   const httpHeaders = this.httpUtils.getHTTPHeaders();
  //   const url = API_PRODUCTS_URL + '/CreateTicketActivityManagementJeePlatform';
  //   return this.http.post<any>(url, item, { headers: httpHeaders });
  // }
  updateStauts(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateStatusJeePlatform`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  //
  sortObject(obj) {
    return Object.keys(obj)
      .sort()
      .reduce(function (result, key) {
        result[key] = obj[key];
        return result;
      }, {});
  }
  isEqual(object, otherObject) {
    return Object.entries(this.sortObject(object)).toString() === Object.entries(this.sortObject(otherObject)).toString();
  }


  getCategory2(queryParams:QueryParamsModelNew): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = API_CATEGORY2 + `/GetListListCategory2Management`;
    return this.http.get<QueryResultsModel>(url, { headers: httpHeaders,params: httpParams });
  }
  getCategory2ByRowID(RowID: number): Observable<any>{
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_CATEGORY2 + `/GetListListCategory2Management/${RowID}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  createTicket(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/CreateTicketJeeLanding`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  createTicketByForm(item: any): Observable<any> {
    const url = API_PRODUCTS_URL + `/CreateTicketByForm`;
    const httpHeader = this.httpUtils.getHttpHeaderFiles();
    return this.http.post(url, item, { reportProgress: true, observe: 'events', headers: httpHeader });
  }

  list_account(): Observable<any> {
      const httpHeaders = this.httpUtils.getHTTPHeaders();
      //let params = this.httpUtils.parseFilter(filter);
      return this.http.get<any>(Api_lite + `/list-account`, {headers: httpHeaders});
  }
  GetListLinhvucyeucauManagement(queryParams:QueryParamsModelNew): Observable<any> {
  const httpHeaders = this.httpUtils.getHTTPHeaders();
  const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
  const url = API_LinhVucYeuCau_URL + `/GetListLinhvucyeucauManagement`;
  return this.http.get<any>(url, { headers: httpHeaders,params: httpParams });
}
  getIdCurren(table:any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    //let params = this.httpUtils.parseFilter(filter);
    return this.http.get<any>(Api_lite + `/GetIdCurrent/${table}`, {headers: httpHeaders});
}
  getticketjeelanding(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetListTicketJeeLanding`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  updateRating(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateRatingJeePlatform`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  GetTicketManagementBySend(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetTicketManagementBySend`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  GetTicketManagementByHandle(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetTicketManagementByHandle`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  GetTicketManagementByFollow(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetTicketManagementByFollow`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  updatePriority(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdatePriorityJeePlatform`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  UpdateTitle(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateTitleJeePlatform`;
    console.log('model update',item);
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  UpdateAgent(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateAgentJeePlatform`;
    console.log('model update',item);
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  UpdateFollower(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateFollowerJeePlatform`;
    console.log('model update',item);
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  acceptTask(item: TicketManagementModel): Observable<any> {

    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/AcceptTaskJeePlatform`;

    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  GetStautsTicket(rowid:number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    //let params = this.httpUtils.parseFilter(filter);
    return this.http.get<any>(Api_lite + `/GetStautsTicket/${rowid}`, {headers: httpHeaders});
  }

  createFileTicket(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/CreateFileTicketJeePlatform  `;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }

  deleteTicketDocument(item: FileUploadModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/DeleteTicketDocument`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }


  UpdateTimeSLa(item: TicketAgentModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateTimeSLa`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  loadTicketBySend(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = environment.HOST_JEETICKET_API + '/api/ticketmanagement/GetTicketManagementBySend';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
  loadTicketByFollow(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = environment.HOST_JEETICKET_API + '/api/ticketmanagement/GetTicketManagementByFollow';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
  loadTicketByHandle(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = environment.HOST_JEETICKET_API + '/api/ticketmanagement/GetTicketManagementByHandle';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
  getAllLinhVucHoTro2(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PHANLOAI_URL + `/GetAllPhanLoaiHoTroJeePlatform`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
}
