import { GroupingState } from './grouping.model';
import { PaginatorState } from './paginator.model';
import { SortState } from './sort.model';

export interface ITableState {
  filter: {};
  paginator: PaginatorState;
  sorting: SortState;
  searchTerm: string;
  grouping: GroupingState;
  more: boolean;
  entityId: number | undefined;
}

export interface TableResponseModel<T> {
  data: T[];
  total: number;
  error?: ErrorReturnModel;
	status?: number;
	page?: PageModel;
}

export interface ErrorReturnModel {
	error: string;
	statusCode: number;
	message: string;
  }

  export interface PageModel {
	Page: number;
	AllPage: number;
	Size: number;
	TotalCount: number;
  }
  export interface ErrorModel {
    lastError: string;
    code: number;
    message: string;
    }

export interface LP_Panigator{
  //total items
  total: number;
  totalpage: number;//total page
  TotalCount: number;
  page: number;//page index
  pageSize: number;//page size, row per page
}

export interface LP_ErrorModel{
  code: number;
  msg: string;
}

export interface TableResponseModel_LandingPage<T> {
  status: number;
  data: T[];
  panigator: LP_Panigator;
  error: LP_ErrorModel;
}

export interface ICreateAction {
  create(): void;
}

export interface IEditAction {
  edit(id: number): void;
}

export interface IDeleteAction {
  delete(id: number): void;
}

export interface IDeleteSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  deleteSelected(): void;
}

export interface IFetchSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  fetchSelected(): void;
}

export interface IUpdateStatusForSelectedAction {
  grouping: GroupingState;
  ngOnInit(): void;
  updateStatusForSelected(): void;
}

export interface LP_BaseModel<T> {
  status: number;
  data: T[];
  panigator: LP_Panigator;
  error: LP_ErrorModel;
}

export interface LP_BaseModel_Single<T> {
  status: number;
  data: T;
  panigator: LP_Panigator;
  error: LP_ErrorModel;
}

