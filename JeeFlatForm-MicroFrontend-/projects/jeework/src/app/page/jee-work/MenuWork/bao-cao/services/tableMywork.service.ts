import { HttpParams } from '@angular/common/http';
// tslint:disable:variable-name
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { PaginatorState } from '../Model/paginator.model';
import { ITableState, LP_BaseModel, LP_BaseModel_Single, TableResponseModel, TableResponseModel_LandingPage } from '../Model/table.model';
import { SortState } from '../Model/sort.model';
import { GroupingState } from '../Model/grouping.model';
import { environment } from 'projects/jeework/src/environments/environment';
import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';
import { BaseModel } from '../Model/base.model';
import { AuthModel } from '../Model/auth.model';
import { AuthService } from './auth.service';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
};
const DEFAULT_STATE_JEEREQUEST: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
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

export abstract class TableMyWorkService<T> {
  private __responseData$ = new BehaviorSubject<TableResponseModel_LandingPage<any>>(DEFAULT_RESPONSE);

  // Private fields
  private _items$ = new BehaviorSubject<T[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];
  //JeeRequest -- fix bug (chỉ sử dụng cho jeeRequest, trương h)
  private _tableStateJR$ = new BehaviorSubject<ITableState>(DEFAULT_STATE_JEEREQUEST);

  public authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
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
  API_JeeWork = `${environment.HOST_JEEWORK_API}` + `/`;
  API_IDENTITY = `${environment.HOST_IDENTITYSERVER_API}`;
  constructor(http: HttpClient, private auth: AuthService) {
    this.http = http;
  }

  // CREATE
  // server should return the object with ID
  create(item: BaseModel): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<BaseModel>(this.API_URL, item).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
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
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ items: [], total: 0 });
      })
    );
  }

  getItemById(id: number): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${id}`;
    return this.http.get<BaseModel>(url).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
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
      catchError((err) => {
        this._errorMessage.next(err);
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
      catchError((err) => {
        this._errorMessage.next(err);
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
      catchError((err) => {
        this._errorMessage.next(err);
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
      catchError((err) => {
        this._errorMessage.next(err);
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
            paginator: this._tableState$.value.paginator.recalculatePaginator(res.total),
          });
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
          const itemIds = this._items$.value.map((el: T) => {
            const item = el as unknown as BaseModel;
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
      paginator: new PaginatorState(),
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

  public MyWorks(query, nameKey: string = 'id') {
    var apiRoute = 'api/widgets/page-my-work';
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find_My_Work(this._tableState$.value, query, apiRoute)
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

  private setAuthFromLocalStorage(auth: AuthModel): boolean {
    if (auth && auth.accessToken) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(auth));
      return true;
    }
    return false;
  }

  public getAuthFromLocalStorage(): any {
    return this.auth.getAuthFromLocalStorage();
  }

  getHttpHeaders() {
    const auth = this.auth.getAuthFromLocalStorage();
    var p = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${auth != null ? auth.access_token : ''}`,
      'Accept-Language': `Bearer ${auth != null ? auth.access_token : ''}`,
    });
    // p.append( 'Content-Type', 'application/json')
    return p;
    // const auth = this.getAuthFromLocalStorage();
    // let result = new HttpHeaders({
    //   'Content-Type': 'application/json',
    //   'Authorization': `Bearer ${auth.access_token}`,
    //   'Access-Control-Allow-Origin': '*',
    //   'Access-Control-Allow-Headers': 'Content-Type'
    // });
    // return result;
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

  // READ (Returning filtered list of entities)
  find_My_Work(tableState: ITableState, query, routeFind: string = ''): Observable<TableResponseModel_LandingPage<T>> {
    // routeFind = "";
    const page = tableState.paginator;
    const url = this.API_JeeWork + routeFind;
    const httpHeader = this.getHttpHeaders();
    const queryParams = new QueryParamsModelNew(query, '', '', page.page - 1, page.pageSize, true);
    const httpParams = this.getFindHTTPParams(queryParams);
    this._errorMessage.next('');
    return this.http.get<TableResponseModel_LandingPage<T>>(url, { headers: httpHeader, params: httpParams }).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ status: 0, data: [], panigator: null, error: null });
      })
    );
  }

  // Base Methods

  public patchStateLandingPageMyWork(patch: Partial<ITableState>, query) {
    this.patchStateWithoutFetch(patch);
    this.MyWorks(query);
  }

  getItemById_LandingPage(id: number, routeGet: string = ''): Observable<BaseModel> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const httpHeader = this.getHttpHeaders();
    // const url = `${this.API_URL}/${id}`;
    const url = this.API_JeeWork + routeGet + `${id}`;
    return this.http.get<BaseModel>(url, { headers: httpHeader }).pipe(
      tap((resID) => {}),
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  getItemById_LandingPage_POST(id: number, routePost: string = ''): Observable<LP_BaseModel<T>> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const httpHeader = this.getHttpHeaders();
    const url = this.API_JeeWork + routePost;
    return this.http.post<LP_BaseModel<T>>(url, { htid: +id }, { headers: httpHeader }).pipe(
      tap((resID) => {
        this.__responseData$.next(resID);
      }),
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ status: 0, data: [], panigator: null, error: null });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // CREATE
  // server should return the object with ID
  createLandingPage(item: any, routePost: string = ''): Observable<LP_BaseModel<T>> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const httpHeader = this.getHttpHeaders();
    const url = this.API_JeeWork + routePost;
    return this.http.post<LP_BaseModel<T>>(url, item, { headers: httpHeader }).pipe(
      tap((res: TableResponseModel_LandingPage<T>) => {
        this.__responseData$.next(res);
      }),
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ status: 1, data: [], panigator: null, error: null });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // UPDATE
  updateLandingPage(item: any, routePost: string = ''): Observable<LP_BaseModel_Single<any>> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const httpHeader = this.getHttpHeaders();
    const url = this.API_JeeWork + routePost;
    return this.http.post<LP_BaseModel_Single<any>>(url, item, { headers: httpHeader }).pipe(
      tap((res: TableResponseModel_LandingPage<T>) => {
        this.__responseData$.next(res);
      }),
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ status: 1, data: null, panigator: null, error: null });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // DELETE
  deleteLandingPage(id: number, routePost: string = ''): Observable<LP_BaseModel_Single<any>> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const httpHeader = this.getHttpHeaders();
    const url = this.API_JeeWork + routePost;
    return this.http.post<LP_BaseModel_Single<any>>(url, { htid: id }, { headers: httpHeader }).pipe(
      tap((res: TableResponseModel_LandingPage<T>) => {
        this.__responseData$.next(res);
      }),
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ status: 0, data: [], panigator: null, error: null });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // delete list of items
  deleteItemsLandingPage(ids: number[] = [], routePost: string = ''): Observable<LP_BaseModel_Single<any>> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const httpHeader = this.getHttpHeaders();
    const url = this.API_JeeWork + routePost;
    ids = [...ids.map((k) => +k)];
    return this.http.post<LP_BaseModel_Single<any>>(url, { htids: ids }, { headers: httpHeader }).pipe(
      tap((res: TableResponseModel_LandingPage<T>) => {
        this.__responseData$.next(res);
      }),
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ status: 0, data: [], panigator: null, error: null });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // Đăng nhập
  // lay jwt + data tu sso_token
  getDataUser_LandingPage(routeFind: string = '', sso_token: string = ''): Observable<BaseModel> {
    const url = this.API_IDENTITY + routeFind;
    const httpHeader = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: sso_token,
    });
    return this.http.get<BaseModel>(url, { headers: httpHeader }).pipe(
      tap((res) => {}),
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ id: undefined });
      })
    );
  }
  // logout
  logOutUser_LandingPage(routeFind: string = ''): Observable<BaseModel> {
    const url = this.API_IDENTITY + routeFind;
    const httpHeader = this.getHttpHeaders();
    return this.http.post<BaseModel>(url, null, { headers: httpHeader }).pipe(
      tap((res) => {}),
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ id: undefined });
      })
    );
  }
}
