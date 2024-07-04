import {  Subscription } from 'rxjs';


import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject, of } from "rxjs";
import { Inject, Injectable } from "@angular/core";
import { CATCH_ERROR_VAR } from '@angular/compiler/src/output/output_ast';
import { catchError, finalize, tap } from 'rxjs/operators';
//import { AccountDTO, AccountModel, AccountStatusModel } from '../Model/account-management.model';
import { TicKetActivityModel, TicketManagementModel, TicketMessagesManagementModel, TicketRequestManagementDTO } from '../_models/ticket-management.model';
import { environment } from 'projects/jeesupport/src/environments/environment';
import { ITableState } from '../_models/table.model';
import { PaginatorState } from '../_models/paginator.model';
import { SortState } from '../_models/sort.model';
import { GroupingState } from '../_models/grouping.model';
import { ResultObjectModel } from '../_models/_base.model';
import { HttpUtilsService } from '../../modules/crud/utils/http-utils.service';
const API_STATUS_URL = environment.HOST_JEETICKET_API + '/api/statusmanagement';
const API_PHANLOAI_URL = environment.HOST_JEETICKET_API + '/api/PhanloaihotroManagement';
const API_PRODUCTS_URL = environment.HOST_JEETICKET_API + '/api/ticketmanagement';
const API_CATEGORY2=environment.HOST_JEETICKET_API+'/api/ListCategory2Management';
const Api_lite = environment.HOST_JEETICKET_API + '/api/general';
const API_THIRDPARTYAPP_URL = environment.HOST_JEETICKET_API + '/api/ThirdPartyAppmanagement';
const API_SUPPORT_URL = environment.HOST_JEESUPPORT_API + '/api/webhook';
const API_SUPPORT_CATE = environment.HOST_JEESUPPORT_API + '/api/category';

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
  // Private fields
  send$ = new BehaviorSubject<any>([]);
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

  public patchState(patch: Partial<ITableState>,typeRequest: number) {
    this.patchStateWithoutFetch(patch);
    this.GetListTicketByRequest(typeRequest);
  }

  public fetchStateSort(patch: Partial<ITableState>,typeRequest: number) {
    this.patchStateWithoutFetch(patch);
    this.GetListTicketByRequest(typeRequest);
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


    // const url = this.API_URL_FIND;

    // const httpHeaders = this.httpUtils.getHTTPHeaders();
    // const httpParams = this.httpUtils.getFindHTTPParamsITableState(tableState);
    // this._errorMessage.next('');
    // console.log('url',url);
    // return this.http
    //   .get<any>(url, {

    //     headers: httpHeaders,
    //     params: httpParams,
    //   })
    //   .pipe(
    //     catchError((err) => {
    //       this._errorMessage.next(err);
    //       return of({ items: [], total: 0 });
    //     })
    //   );
  }

  GetStatusNoCustom(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_STATUS_URL + `/GetListStatusNoCustomer`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  getLinhvucyeucauCombo(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PHANLOAI_URL + `/getLinhvucyeucauCombo`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  getTiceketPCByRowID(rowid: number): Observable<any>{
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/GetTicketPCManagementByRowID/${rowid}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  CreateTicketActivityManagement(item: TicKetActivityModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/CreateTicketActivityManagement';
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  updateStauts(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateStatus`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  updateStautsThirdPartyApp(item: TicketManagementModel): Observable<any> {

    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_THIRDPARTYAPP_URL + `/UpdateStatusThirdPartyApp`;
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


  getCategory2(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_CATEGORY2 + `/GetListListCategory2Management`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  getCategory2ByRowID(RowID: number): Observable<any>{
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_CATEGORY2 + `/GetListListCategory2Management/${RowID}`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  getCategorySupport(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_SUPPORT_CATE + `/GetListListCategoryManagement`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  createTicket(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/CreateTicketJeeLanding`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  createTicketThirdParyApp(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_THIRDPARTYAPP_URL + `/CreateTicketThirdPartyApp`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  createMessageThirdParyApp(item: TicketMessagesManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_THIRDPARTYAPP_URL + `/CreateMessageThirdPartyApp`;
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  getAccess(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_SUPPORT_URL + `/GetAccess`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  list_account(): Observable<any> {
      const httpHeaders = this.httpUtils.getHTTPHeaders();
      //let params = this.httpUtils.parseFilter(filter);
      return this.http.get<any>(Api_lite + `/list-account`, {headers: httpHeaders});
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
    const url = API_PRODUCTS_URL + `/UpdateRating`;
    console.log('model update',item);
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  updateRatingThirdPartyApp(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_THIRDPARTYAPP_URL + `/UpdateRatingThirdPartyApp`;
    console.log('model update',item);
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  UpdateTitle(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/UpdateTitleJeePlatform`;
    console.log('model update',item);
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  UpdateTitleThirdPartyApp(item: TicketManagementModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_THIRDPARTYAPP_URL + `/UpdateTitleThirdPartyApp`;
    console.log('model update',item);
    return this.http.post<any>(url, item, { headers: httpHeaders });
  }
  
}
