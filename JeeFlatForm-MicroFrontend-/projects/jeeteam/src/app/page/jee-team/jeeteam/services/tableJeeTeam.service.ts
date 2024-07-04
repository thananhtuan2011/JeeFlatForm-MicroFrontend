// tslint:disable:variable-name
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { SortState } from '../model/sort.model';
import { GroupingState } from '../model/grouping.model';
import { environment } from '../../../../../environments/environment';
import { ITableState, TableResponseModel } from '../model/table.model';
import { BaseModel } from '../model/base.model';
import { PaginatorState } from '../model/paginator.model';
import { HttpUtilsService } from 'projects/jeeteam/src/modules/crud/utils/http-utils.service';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined
};
// const DEFAULT_RESPONSE: TableResponseModel_JeeSocial<any> = {
//   status: 1,
//   data: [],
//   error: {
//     code: 0,
//     msg: ""
//   },
//   panigator: null
// };
export abstract class TableJeeTeamService<T> {
  // Private fields
  private _items$ = new BehaviorSubject<T[]>([]);
  private _itemsteam$ = new BehaviorSubject<T[]>([]);
  public _itemsteam_loadfile$ = new BehaviorSubject<T[]>([]);
  private _itemsteamphanquyen$ = new BehaviorSubject<T[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];
  private __responseData$ = new BehaviorSubject<any>(DEFAULT_STATE);
  // Getters
  get items$() {
    return this._items$.asObservable();
  }
  get itemsteam$() {
    return this._itemsteam$.asObservable();
  }

  get itemsteamphanquyen$() {
    return this._itemsteamphanquyen$.asObservable();
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
  API_URL = `${environment}/endpoint`;
  constructor(http: HttpClient, httpUtils: HttpUtilsService) {
    this.http = http;
    this.httpUtils = httpUtils;
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
  public patchStateAllfile(patch: Partial<ITableState>, apiRoute: string = '', IdTopic: number) {
    this.patchStateWithoutFetch(patch);
    this.fetch_allFile(apiRoute, "", IdTopic);
  }
  public patchStatethanhvienphanquyenuser(patch: Partial<ITableState>, apiRoute: string = '', RowIdmenu: number, isprivate: any) {
    this.patchStateWithoutFetch(patch);
    this.fetch_Thanhvienphanquyenuser(apiRoute, "", RowIdmenu, isprivate);
  }
  public patchStatethanhvien(patch: Partial<ITableState>, apiRoute: string = '', RowIdmenu: number, isprivate: any) {
    this.patchStateWithoutFetch(patch);
    this.fetch_Thanhvien(apiRoute, "", RowIdmenu, isprivate);
  }
  public patchStateQuanlyTeamthanhvien(patch: Partial<ITableState>, apiRoute: string = '', RowIdmenu: number) {
    this.patchStateWithoutFetch(patch);
    this.fetch_QuanlyTeamthanhvien(apiRoute, "", RowIdmenu);
  }
  public patchStateQuanlyTeamthanhvienPhanQuyen(patch: Partial<ITableState>, apiRoute: string = '') {
    this.patchStateWithoutFetch(patch);
    this.fetch_QuanlyTeamthanhvienPhanquyen(apiRoute, "");
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
  find_Thanhvien(tableState: ITableState, routeFind: string = '', RowIdmenu: number, isprivate: any): Observable<any> {
    const url = routeFind + `?RowIdMenu=${RowIdmenu}&&isprivate=${isprivate}`;
    const httpHeader = this.httpUtils.getHTTPHeaders();
    this._errorMessage.next('');
    return this.http.post<any>(url, tableState, { headers: httpHeader }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ status: 0, data: [], panigator: null, error: null });
      })
    );
  }
  find_Allfile(tableState: ITableState, routeFind: string = '', RowIdSub: number): Observable<any> {
    const url = routeFind + `?RowIdSub=${RowIdSub}`;
    const httpHeader = this.httpUtils.getHTTPHeaders();
    this._errorMessage.next('');
    return this.http.post<any>(url, tableState, { headers: httpHeader }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ status: 0, data: [], panigator: null, error: null });
      })
    );
  }
  find_QuanlyThanhvienTeam(tableState: ITableState, routeFind: string = '', RowIdmenu: number): Observable<any> {
    const url = routeFind + `?RowIdMenu=${RowIdmenu}`;
    const httpHeader = this.httpUtils.getHTTPHeaders();
    this._errorMessage.next('');
    return this.http.post<any>(url, tableState, { headers: httpHeader }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ status: 0, data: [], panigator: null, error: null });
      })
    );
  }
  find_QuanlyThanhvienTeamPhanQuyen(tableState: ITableState, routeFind: string = '',): Observable<any> {
    const url = routeFind;
    const httpHeader = this.httpUtils.getHTTPHeaders();
    this._errorMessage.next('');
    return this.http.post<any>(url, tableState, { headers: httpHeader }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ status: 0, data: [], panigator: null, error: null });
      })
    );
  }
  public fetch_allFile(apiRoute: string = '', nameKey: string = 'id', IdTopic: number) {
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find_Allfile(this._tableState$.value, apiRoute, IdTopic)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.panigator.total;
          }


          this._itemsteam_loadfile$.next(resItems);
          this.__responseData$.next(res);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              resTotalRow
            ),
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
          const itemIds = this._itemsteam$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
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
  public fetch_Thanhvienphanquyenuser(apiRoute: string = '', nameKey: string = 'id', RowIdmenu: number, isprivate: any) {
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find_QuanlyThanhvienTeam(this._tableState$.value, apiRoute, RowIdmenu)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.panigator.total;
          }

          this._itemsteam$.next(resItems);
          this.__responseData$.next(res);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              resTotalRow
            ),
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
          const itemIds = this._itemsteam$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
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
  public fetch_QuanlyTeamthanhvien(apiRoute: string = '', nameKey: string = 'id', RowIdmenu: number) {
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find_QuanlyThanhvienTeam(this._tableState$.value, apiRoute, RowIdmenu)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.panigator.total;
          }

          this._itemsteam$.next(resItems);
          this.__responseData$.next(res);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              resTotalRow
            ),
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
          const itemIds = this._itemsteam$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
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
  public fetch_QuanlyTeamthanhvienPhanquyen(apiRoute: string = '', nameKey: string = 'id') {
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find_QuanlyThanhvienTeamPhanQuyen(this._tableState$.value, apiRoute)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;

            resTotalRow = res.panigator.total;
          }

          this._itemsteamphanquyen$.next(resItems);
          this.__responseData$.next(res);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              resTotalRow
            ),
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
          const itemIds = this._itemsteamphanquyen$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
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
  public fetch_Thanhvien(apiRoute: string = '', nameKey: string = 'id', RowIdmenu: number, isprivate: any) {
    var resItems: any = [];
    var resTotalRow: number = 0;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find_Thanhvien(this._tableState$.value, apiRoute, RowIdmenu, isprivate)
      .pipe(
        tap((res: any) => {
          if (res && res.status == 1) {
            resItems = res.data;
            resTotalRow = res.panigator.total;
          }

          this._items$.next(resItems);
          this.__responseData$.next(res);
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              resTotalRow
            ),
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
            const item = (el as unknown) as BaseModel;
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
}
