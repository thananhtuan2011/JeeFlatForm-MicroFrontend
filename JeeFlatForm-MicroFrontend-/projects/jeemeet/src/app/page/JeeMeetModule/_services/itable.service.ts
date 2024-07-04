
// tslint:disable:variable-name
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ITableState, TableResponseModel } from '../../share/models/table.model';
import { PaginatorState } from '../../share/models/paginator.model';
import { SortState } from '../../share/models/sort.model';
import { GroupingState } from '../../share/models/grouping.model';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';
import { BaseModel } from '../../share/models/base.model';
const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  grouping: new GroupingState(),
  entityId: undefined,
  more: false,
};

export abstract class ITableService<T> {
  // Private fields
  private _items$ = new BehaviorSubject<T[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _tableState$ = new BehaviorSubject<ITableState>({
    filter: {},
    paginator: new PaginatorState(),
    sorting: new SortState(),
    searchTerm: '',
    grouping: new GroupingState(),
    entityId: undefined,
    more:false
  });
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
  abstract API_URL: string;
  constructor(http: HttpClient, httpUtils: HttpUtilsService) {
    this.http = http;
    this.httpUtils = httpUtils;
  }


  // CREATE
  // server should return the object with ID
  create(item: BaseModel, root: string = ''): Observable<BaseModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.post<BaseModel>(this.API_URL_CTEATE + (root === '' ? '' : root), item, {
      headers: httpHeaders,
    }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('CREATE ITEM', err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // READ (Returning filtered list of entities)
  find(tableState: ITableState, root: string = ''): Observable<TableResponseModel<T>> {
    const url = this.API_URL_FIND + (root === '' ? '/find' : root);
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParamsITableState(tableState, tableState.more);
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
  update(item: BaseModel, root: string = ''): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${this.API_URL_EDIT + (root === '' ? '' : root)}/${item.id}`;
    this._isLoading$.next(true);
    this._errorMessage.next('');
    return this.http.put(url, item, {
      headers: httpHeaders,
    }).pipe(
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
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const body = { ids, status };
    const url = this.API_URL_EDIT + '/updateStatus';
    return this.http.put(url, body, {
      headers: httpHeaders,
    }).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE STATUS FOR SELECTED ITEMS', ids, status, err);
        return of([]);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // DELETE
  delete(id: any, root: string = ''): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL_DELETE + (root === '' ? '' : root)}/${id}`;
    return this.http.delete(url, {
      headers: httpHeaders,
    }).pipe(
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
    const url = this.API_URL_DELETE + '/deleteItems';
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

  public fetch(root: string = '') {

    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find(this._tableState$.value, root)
      .pipe(
        tap((res: TableResponseModel<T>) => {
          if(res.status == 1){
            if(res.data==null)
            {
              this._items$.next([]);
            }
            else{
              this._items$.next(res.data);
            }
            this.patchStateWithoutFetch({
              paginator: this._tableState$.value.paginator.recalculatePaginator(res.page.TotalCount),
            });
          }else{
            this._items$.next([]);
            this.patchStateWithoutFetch({
              paginator: this._tableState$.value.paginator.recalculatePaginator(0),
            });
          }
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
      paginator: new PaginatorState()
    });
    this._isFirstLoading$.next(true);
    this._isLoading$.next(true);
    this._tableState$.next(DEFAULT_STATE);
    this._errorMessage.next('');
  }

  // Base Methods
  public patchState(patch: Partial<ITableState>, root: string = '') {
    this.patchStateWithoutFetch(patch);
    this.fetch(root);
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    this._tableState$.value.filter = {};
    this._tableState$.value.searchTerm = '';
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }


}
