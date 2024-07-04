import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { BaseModel, ResultObjectModelAccount } from 'src/app/modules/auth/models/_base.model';
import { GroupingState } from 'src/app/modules/crud/models/grouping.model';
import { PaginatorState } from 'src/app/modules/crud/models/paginator.model';
import { SortState } from 'src/app/modules/crud/models/sort.model';
import { ITableState } from 'src/app/modules/crud/models/table.model';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';
import { environment } from 'src/environments/environment';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
};

export abstract class ITableServiceV2<T> {
  // Private fields
  private _items$ = new BehaviorSubject<T>(undefined);
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
  protected httpUtils: HttpUtilsService;
  // API URL has to be overrided
  abstract API_URL_FIND: string;
  abstract API_URL_CTEATE: string;
  abstract API_URL_EDIT: string;
  abstract API_URL_DELETE: string;
  abstract API_VERSION: string;
  constructor(http: HttpClient, httpUtils: HttpUtilsService) {
    this.http = http;
    this.httpUtils = httpUtils;
  }

  // CREATE
  // server should return the object with ID
  create(item: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<any>(this.API_URL_CTEATE, item).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // READ (Returning filtered list of entities)
  find(tableState: ITableState, version:string): Observable<ResultObjectModelAccount<T>> {
    const url = this.API_URL_FIND;
    const httpHeaders = this.httpUtils.getHTTPHeaders(version);
    const httpParams = this.httpUtils.getFindHTTPParamsITableState(tableState);
    this._errorMessage.next('');
    return this.http
      .get<any>(url, {
        headers: httpHeaders,
        params: httpParams,
      })
      .pipe(
        catchError((err) => {
          this._errorMessage.next(err);
          return of({ items: [], total: 0 });
        })
      );
  }

  getItemById(id: number): Observable<any> {
    this._isLoading$.next(true);
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    this._errorMessage.next('');
    const url = `${this.API_URL_FIND}/${id}`;
    return this.http
      .get<any>(url, {
        headers: httpHeaders,
      })
      .pipe(
        catchError((err) => {
          this._errorMessage.next(err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
  }

  // UPDATE
  update(item: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = this.API_URL_EDIT;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http
      .post(url, item, {
        headers: httpHeaders,
      })
      .pipe(
        catchError((err) => {
          this._errorMessage.next(err);
          return of(item);
        }),
        finalize(() => this._isLoading$.next(false))
      );
  }

  // DELETE
  delete(item: any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = this.API_URL_DELETE;
    return this.http.post(url, item).pipe(
      catchError((err) => {
        this._errorMessage.next(err);
        return of({});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  public fetch(version: string = '1.0') {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find(this._tableState$.value, version)
      .pipe(
        tap((res: ResultObjectModelAccount<T>) => {
          this._items$.next(res.data);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(res.panigator ? res.panigator.TotalCount : 0),
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
  public patchState(patch: Partial<ITableState>,version: string = '1.0') {
    this.patchStateWithoutFetch(patch);
    this.fetch(version);
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }

  //=====================Start - Dùng cho trang phân quyền================
  API_WorkFlow = `${environment.HOST_JEEACCOUNT_API}`;
  private _itemsPopup$ = new BehaviorSubject<T[]>([]);
  private _isLoadingPopup$ = new BehaviorSubject<boolean>(false);
  private _tableStatePopup$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);

  get itemsPopup$() {
    return this._itemsPopup$.asObservable();
  }

  public fetch_DS_Popup(apiRoute: string = '', nameKey: string = 'id') {
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoadingPopup$.next(true);
    this._errorMessage.next('');
    const request = this.find_DS_Popup(this._tableStatePopup$.value, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.data.length > 0) {
            resItems = res.data;
            resTotalRow = res.panigator.TotalCount;
          } else {
            resItems = [];
            resTotalRow = 0;
          }
          this._itemsPopup$.next(resItems);
          this.patchStateWithoutFetchPopup({
            paginator: this._tableStatePopup$.value.paginator.recalculatePaginator(resTotalRow),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            status: 0,
            data: [],
            paginator: null,
            error: null,
          });
        }),
        finalize(() => {
          this._isLoadingPopup$.next(false);
          const itemIds = this._itemsPopup$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item[nameKey];
          });
          this.patchStateWithoutFetchPopup({
            grouping: this._tableStatePopup$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }

  find_DS_Popup(tableState: ITableState, routeFind: string = ''): Observable<any> {
    const url = routeFind;
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, tableState, { headers: httpHeaders })
  }

  public patchStatePopup(patch: Partial<ITableState>, apiRoute: string = '') {
    this.patchStateWithoutFetchPopup(patch);
    this.fetch_DS_Popup(apiRoute);
  }

  public patchStateWithoutFetchPopup(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableStatePopup$.value, patch);
    this._tableStatePopup$.next(newState);
  }

  //============Hàm dùng chung load danh sách popup 1============
  private _itemsPopup1$ = new BehaviorSubject<T[]>([]);
  private _isLoadingPopup1$ = new BehaviorSubject<boolean>(false);
  private _tableStatePopup1$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);

  get itemsPopup1$() {
    return this._itemsPopup1$.asObservable();
  }

  public fetch_DS_Popup1(apiRoute: string = '', nameKey: string = 'id') {
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoadingPopup1$.next(true);
    this._errorMessage.next('');
    const request = this.find_DS_Popup1(this._tableStatePopup1$.value, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.data.length > 0) {
            resItems = res.data;
            resTotalRow = res.panigator.TotalCount;
          } else {
            resItems = [];
            resTotalRow = 0;
          }
          this._itemsPopup1$.next(resItems);
          this.patchStateWithoutFetchPopup1({
            paginator: this._tableStatePopup1$.value.paginator.recalculatePaginator(resTotalRow),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            status: 0,
            data: [],
            paginator: null,
            error: null,
          });
        }),
        finalize(() => {
          this._isLoadingPopup1$.next(false);
          const itemIds = this._itemsPopup1$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item[nameKey];
          });
          this.patchStateWithoutFetchPopup1({
            grouping: this._tableStatePopup1$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }
  find_DS_Popup1(tableState: ITableState, routeFind: string = ''): Observable<any> {
    const url = routeFind;
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, tableState, { headers: httpHeaders })
  }
  public patchStatePopup1(patch: Partial<ITableState>, apiRoute: string = '') {
    this.patchStateWithoutFetchPopup1(patch);
    this.fetch_DS_Popup1(apiRoute);
  }
  public patchStateWithoutFetchPopup1(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableStatePopup1$.value, patch);
    this._tableStatePopup1$.next(newState);
  }
  //=====================End - Dùng cho trang phân quyền================
  //=====================Start - Danh sách phòng ban theo phân quyền====
  public fetch_tree_permit() {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find_permit(this._tableState$.value)
      .pipe(
        tap((res: ResultObjectModelAccount<T>) => {
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

  find_permit(tableState: ITableState): Observable<ResultObjectModelAccount<T>> {
    const url = this.API_URL_FIND;
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParamsITableState(tableState);
    this._errorMessage.next('');
    return this.http
      .get<any>(url, {
        headers: httpHeaders,
        params: httpParams,
      })
      .pipe(
        catchError((err) => {
          this._errorMessage.next(err);
          return of({ items: [], total: 0 });
        })
      );
  }
  //=====================End - Danh sách phòng ban theo phân quyền====
}
