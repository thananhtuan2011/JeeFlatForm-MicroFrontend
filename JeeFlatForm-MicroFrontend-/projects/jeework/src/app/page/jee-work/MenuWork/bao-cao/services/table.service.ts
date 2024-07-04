// tslint:disable:variable-name
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ITableState, TableResponseModel, TableResponseModel_LandingPage } from '../Model/table.model';
import { PaginatorState } from '../Model/paginator.model';
import { SortState } from '../Model/sort.model';
import { GroupingState } from '../Model/grouping.model';
import { AuthService } from './auth.service';
import { environment } from 'projects/jeework/src/environments/environment';
import { BaseModel } from '../Model/base.model';
import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined
};

const DEFAULT_RESPONSE: TableResponseModel_LandingPage<any> = {
  status: 1,
  data: [],
  error: {
    code: 0,
    msg: '',
  },
  panigator: null,
};

export abstract class TableService<T> {
  // Private fields
  private _items$ = new BehaviorSubject<T[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];

  // Getters
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
  // State getters
  get paginator() {
    return this._tableState$.value.paginator;
  }
  get filter() {
    return this._tableState$.value.filter;
  }
  get sorting() {
    return this._tableState$.value.sorting;
  }
  get searchTerm() {
    return this._tableState$.value.searchTerm;
  }
  get grouping() {
    return this._tableState$.value.grouping;
  }

  protected http: HttpClient;
  // API URL has to be overrided
  API_URL = `${environment.apiUrl}/endpoint`;
  API_JeeWork = `${environment.HOST_JEEWORK_API_2023}` + `/`;
  constructor(http: HttpClient, private auth: AuthService) {
    this.http = http;
    this.auth = auth;
  }

  // CREATE
  // server should return the object with ID
  create(item: BaseModel): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<BaseModel>(this.API_URL, item).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('CREATE ITEM', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // READ (Returning filtered list of entities)
  find(tableState: ITableState): Observable<TableResponseModel<T>> {
    const url = this.API_URL + '/find';
    this._errorMessage.next('');
    return this.http.post<TableResponseModel<T>>(url, tableState).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [], total: 0 });
      })
    );
  }

  getItemById(id: number): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${id}`;
    return this.http.get<BaseModel>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('GET ITEM BY IT', id, err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // UPDATE
  update(item: BaseModel): Observable<any> {
    const url = `${this.API_URL}/${item.id}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.put(url, item).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE ITEM', item, err);
        return of(item);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // UPDATE Status
  updateStatusForItems(ids: number[], status: number): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const body = { ids, status };
    const url = this.API_URL + '/updateStatus';
    return this.http.put(url, body).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE STATUS FOR SELECTED ITEMS', ids, status, err);
        return of([]);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // DELETE
  delete(id: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${id}`;
    return this.http.delete(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('DELETE ITEM', id, err);
        return of({});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // delete list of items
  deleteItems(ids: number[] = []): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = this.API_URL + '/deleteItems';
    const body = { ids };
    return this.http.put(url, body).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('DELETE SELECTED ITEMS', ids, err);
        return of([]);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  public fetch() {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find(this._tableState$.value)
      .pipe(
        tap((res: TableResponseModel<T>) => {
          this._items$.next(res.items);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              res.total
            ),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item.id;
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  public setDefaults() {
    this.patchStateWithoutFetch({ filter: {} });
    this.patchStateWithoutFetch({ sorting: new SortState() });
    this.patchStateWithoutFetch({ grouping: new GroupingState() });
    this.patchStateWithoutFetch({ searchTerm: '' });
    this.patchStateWithoutFetch({
      paginator: new PaginatorState()
    });
    this._isFirstLoading$.next(true);
    this._isLoading$.next(true);
    this._tableState$.next(DEFAULT_STATE);
    this._errorMessage.next('');
  }

  // Base Methods
  public patchState(patch: Partial<ITableState>) {
    this.patchStateWithoutFetch(patch);
    this.fetch();
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }

  //=================Start widget===================
  getHttpHeaders() {
    const auth = this.auth.getAuthFromLocalStorage();
    var p = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth != null ? auth.access_token : ''}`,
      'Accept-Language': `Bearer ${auth != null ? auth.access_token : ''}`,
      'TimeZone': (new Date()).getTimezoneOffset().toString()
    });
    return p;
  }
  getFindHTTPParams(queryParams): HttpParams {
    let params = new HttpParams()
      //.set('filter',  queryParams.filter )
      .set('sortOrder', queryParams.sortOrder)
      .set('sortField', queryParams.sortField)
      .set('page', (queryParams.pageNumber + 1).toString())
      .set('record', queryParams.pageSize.toString());
    let keys = [],
      values = [];
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
      params = params.append('filter.keys', keys.join('|')).append('filter.vals', values.join('|'));
    }
    return params;
  }
  //W_Công việc của thành viên======================
  private _itemsUser$ = new BehaviorSubject<T[]>([]);
  get itemsUser$() {
    return this._itemsUser$.asObservable();
  }
  private _isLoadingmember$ = new BehaviorSubject<boolean>(false);
  private _tableStatemember$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessagemember = new BehaviorSubject<string>('');
  private __responseDatamember$ = new BehaviorSubject<TableResponseModel_LandingPage<any>>(DEFAULT_RESPONSE);
  public fetch_Members_by_Projects(query, nameKey: string = 'id') {
    var apiRoute = 'api/widgets/members';
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoadingmember$.next(true);
    this._errorMessagemember.next('');
    const request = this.Get_Members(this._tableStatemember$.value, query, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.page?.TotalCount;
          }
          this._itemsUser$.next(resItems);
          this.__responseDatamember$.next(res);
          this.patchStateWithoutFetch({
            paginator: this._tableStatemember$.value.paginator.recalculatePaginator(resTotalRow),
          });
        }),
        catchError((err) => {
          this._errorMessagemember.next(err);
          return of({
            status: 0,
            data: [],
            panigator: null,
            error: null,
          });
        }),
        finalize(() => {
          this._isLoadingmember$.next(false);
          const itemIds = this._itemsUser$.value.map((el: T) => {
            const item = el as unknown as BaseModel;
            return item[nameKey];
          });
          this.patchStateWithoutFetch({
            grouping: this._tableStatemember$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }
  Get_Members(tableState: ITableState, query: any, routeFind: string = ''): Observable<TableResponseModel_LandingPage<T>> {
    const page = tableState.paginator;
    const url = this.API_JeeWork + routeFind;
    const httpHeader = this.getHttpHeaders();
    const httpParams = this.getFindHTTPParams(query);
    this._errorMessage.next('');
    return this.http.get<TableResponseModel_LandingPage<T>>(url, { headers: httpHeader, params: httpParams }).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ status: 0, data: [], panigator: null, error: null });
      })
    );
  }
  public patchStateLandingPagemember(patch: Partial<ITableState>, query) {
    this.patchStateWithoutFetchmember(patch);
    this.fetch_Members_by_Projects(query);
  }
  public patchStateWithoutFetchmember(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableStatemember$.value, patch);
    this._tableStatemember$.next(newState);
  }
  //W_Danh sách dự án====================================================
  private __responseData$ = new BehaviorSubject<TableResponseModel_LandingPage<any>>(DEFAULT_RESPONSE);
  public fetch_Project_Team(query, loadfull: boolean, nameKey: string = 'id') {
    var apiRoute = 'api/widgets/my-projects';
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.Get_My_Projects(this._tableState$.value, query, loadfull, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.page?.TotalCount;
          }
          this._items$.next(resItems);
          this.__responseData$.next(res);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(resTotalRow),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            status: 0,
            data: [],
            panigator: null,
            error: null,
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = el as unknown as BaseModel;
            return item[nameKey];
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }
  Get_My_Projects(
    tableState: ITableState,
    query,
    loadfull: boolean,
    routeFind: string = ''
  ): Observable<TableResponseModel_LandingPage<T>> {
    // routeFind = "";
    const page = tableState.paginator;
    const url = this.API_JeeWork + routeFind;
    const httpHeader = this.getHttpHeaders();
    const queryParams = new QueryParamsModelNew(query, '', '', page.page - 1, page.pageSize, loadfull);
    const httpParams = this.getFindHTTPParams(queryParams);
    this._errorMessage.next('');
    return this.http.get<TableResponseModel_LandingPage<T>>(url, { headers: httpHeader, params: httpParams }).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ status: 0, data: [], panigator: null, error: null });
      })
    );
  }
  public jeework_list_project_by_manager(patch: Partial<ITableState>, query, loadfull: boolean) {
    this.patchStateWithoutFetch(patch);
    this.fetch_Project_Team(query, loadfull);
  }
  //W_Trạng thái công việc===============
  public fetch_Trangthaicongviec(apiRoute: string = '', query, nameKey: string = 'id') {
    apiRoute = 'api/widgets/trang-thai-cv';
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.Get_Members(this._tableState$.value, query, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.page?.TotalCount;
          }
          this._items$.next(resItems);
          this.__responseData$.next(res);
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            status: 0,
            data: [],
            panigator: null,
            error: null,
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }


  public getReportThoiHanNhiemVu(query) {
    const apiRoute = 'api/report/trang-thai-cv';
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.Get_Members(this._tableState$.value, query, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.page?.TotalCount;
          }
          this._items$.next(resItems);
          this.__responseData$.next(res);
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            status: 0,
            data: [],
            panigator: null,
            error: null,
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }




  //==================Widget Theo dõi tình hình thực hiên nhiệm vụ=====
  private _itemsTheoDoi$ = new BehaviorSubject<T[]>([]);
  get itemsTheoDoi$() {
    return this._itemsTheoDoi$.asObservable();
  }
  private _s_itemsTheoDoi$ = new BehaviorSubject<T[]>([]);
  get s_itemsTheoDoi$() {
    return this._s_itemsTheoDoi$.asObservable();
  }
  private _isLoadingtheodoi$ = new BehaviorSubject<boolean>(false);
  private _tableStatetheodoi$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessagetheodoi = new BehaviorSubject<string>('');
  private __responseDatatheodoi$ = new BehaviorSubject<TableResponseModel_LandingPage<any>>(DEFAULT_RESPONSE);

  public fetch_Projects_by_Deparment(query, nameKey: string = 'id') {
    var apiRoute = 'api/widgets/gov-report-by-project';
    var resItems: any = [];
    var s_resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoadingtheodoi$.next(true);
    this._errorMessagetheodoi.next('');
    const request = this.Get_Members(this._tableStatetheodoi$.value, query, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.page?.TotalCount;
            let sum = {
              s_num_work: res.isgov ? res.isgov[0].s_num_work : 0,
              s_hoanthanh_dunghan: res.isgov ? res.isgov[0].s_hoanthanh_dunghan : 0,
              s_hoanthanh_quahan: res.isgov ? res.isgov[0].s_hoanthanh_quahan : 0,
              s_conhan: res.isgov ? res.isgov[0].s_conhan : 0,
              s_saptoihan: res.isgov ? res.isgov[0].s_saptoihan : 0,
              s_toihan: res.isgov ? res.isgov[0].s_toihan : 0,
              s_quahan: res.isgov ? res.isgov[0].s_quahan : 0,
            }
            s_resItems.push(sum);
          }
          this._itemsTheoDoi$.next(resItems);
          this._s_itemsTheoDoi$.next(s_resItems);
          this.__responseDatatheodoi$.next(res);
          this.patchStateWithoutFetch({
            paginator: this._tableStatetheodoi$.value.paginator.recalculatePaginator(resTotalRow),
          });
        }),
        catchError((err) => {
          this._errorMessagetheodoi.next(err);
          return of({
            status: 0,
            data: [],
            panigator: null,
            error: null,
          });
        }),
        finalize(() => {
          this._isLoadingtheodoi$.next(false);
          const itemIds = this._itemsTheoDoi$.value.map((el: T) => {
            const item = el as unknown as BaseModel;
            return item[nameKey];
          });
          this.patchStateWithoutFetch({
            grouping: this._tableStatetheodoi$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  //==================Widget Biểu đồ theo dõi tình hình thực hiên nhiệm vụ=====
  private _itemsTheoDoiChart$ = new BehaviorSubject<T[]>([]);
  get itemsTheoDoiChart$() {
    return this._itemsTheoDoiChart$.asObservable();
  }
  private _s_itemsTheoDoiChart$ = new BehaviorSubject<T[]>([]);
  get s_itemsTheoDoiChart$() {
    return this._s_itemsTheoDoiChart$.asObservable();
  }
  private _isLoadingtheodoiChart$ = new BehaviorSubject<boolean>(false);
  private _tableStatetheodoiChart$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessagetheodoiChart = new BehaviorSubject<string>('');
  private __responseDatatheodoiChart$ = new BehaviorSubject<TableResponseModel_LandingPage<any>>(DEFAULT_RESPONSE);

  public fetch_Projects_by_DeparmentChart(query, nameKey: string = 'id') {
    var apiRoute = 'api/widgets/gov-report-by-project';
    var resItems: any = [];
    var s_resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoadingtheodoiChart$.next(true);
    this._errorMessagetheodoiChart.next('');
    const request = this.Get_Members(this._tableStatetheodoiChart$.value, query, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.page?.TotalCount;
            let sum = {
              s_num_workChart: res.isgov ? res.isgov[0].s_num_work : 0,
              s_hoanthanh_dunghanChart: res.isgov ? res.isgov[0].s_hoanthanh_dunghan : 0,
              s_hoanthanh_quahanChart: res.isgov ? res.isgov[0].s_hoanthanh_quahan : 0,
              s_conhanChart: res.isgov ? res.isgov[0].s_conhan : 0,
              s_saptoihanChart: res.isgov ? res.isgov[0].s_saptoihan : 0,
              s_toihanChart: res.isgov ? res.isgov[0].s_toihan : 0,
              s_quahanChart: res.isgov ? res.isgov[0].s_quahan : 0,
            }
            s_resItems.push(sum);
          }
          this._itemsTheoDoiChart$.next(resItems);
          this._s_itemsTheoDoiChart$.next(s_resItems);
          this.__responseDatatheodoiChart$.next(res);
          this.patchStateWithoutFetch({
            paginator: this._tableStatetheodoiChart$.value.paginator.recalculatePaginator(resTotalRow),
          });
        }),
        catchError((err) => {
          this._errorMessagetheodoiChart.next(err);
          return of({
            status: 0,
            data: [],
            panigator: null,
            error: null,
          });
        }),
        finalize(() => {
          this._isLoadingtheodoiChart$.next(false);
          const itemIds = this._itemsTheoDoiChart$.value.map((el: T) => {
            const item = el as unknown as BaseModel;
            return item[nameKey];
          });
          this.patchStateWithoutFetch({
            grouping: this._tableStatetheodoiChart$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }
  
  //W_Biêu đồ theo dõi===============
  public fetch_Bieudotheodoi(apiRoute: string = '', query, nameKey: string = 'id') {
    apiRoute = 'api/widgets/gov-status';
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.Get_Members(this._tableState$.value, query, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.page?.TotalCount;
          }
          this._items$.next(resItems);
          this.__responseData$.next(res);
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            status: 0,
            data: [],
            panigator: null,
            error: null,
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }
  
  //W_Biêu đồ theo dõi 18===============
  public fetch_Bieudotheodoi18(apiRoute: string = '', query, nameKey: string = 'id') {
    apiRoute = 'api/widgets/gov-task-department';
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.Get_Members(this._tableState$.value, query, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.page?.TotalCount;
          }
          this._items$.next(resItems);
          this.__responseData$.next(res);
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            status: 0,
            data: [],
            panigator: null,
            error: null,
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }
  //W_Biêu đồ theo dõi 19===============
  public fetch_Bieudotheodoi19(apiRoute: string = '', query, nameKey: string = 'id') {
    apiRoute = 'api/widgets/gov-status-department';
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.Get_Members(this._tableState$.value, query, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.page?.TotalCount;
          }
          this._items$.next(resItems);
          this.__responseData$.next(res);
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            status: 0,
            data: [],
            panigator: null,
            error: null,
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }


  // REPORT bieu do cho----------------------------------------------------------------------------------------------------
  public fetch_Report_Bieudotheodoi(apiRoute: string = '', query, nameKey: string = 'id') {
    apiRoute = 'api/report/report-theo-doi-nhiem-vu';
    // apiRoute = 'api/report/report-gov-status';
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.Get_Members(this._tableState$.value, query, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.page?.TotalCount;
          }
          this._items$.next(resItems);
          this.__responseData$.next(res);
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            status: 0,
            data: [],
            panigator: null,
            error: null,
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }
  public fetch_Report_Bieudotrangthai(apiRoute: string = '', query, nameKey: string = 'id') {
    apiRoute = 'api/report/report-trang-thai-nhiem-vu';
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.Get_Members(this._tableState$.value, query, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.page?.TotalCount;
          }
          this._items$.next(resItems);
          this.__responseData$.next(res);
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            status: 0,
            data: [],
            panigator: null,
            error: null,
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }
  //------------------------------------------------------------------------------------------------------
}
