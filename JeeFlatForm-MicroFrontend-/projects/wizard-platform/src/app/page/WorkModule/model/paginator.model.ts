export const PageSizes = [3, 5, 10, 15, 50, 100];

export interface IPaginatorState {
  page: number;
  pageSize: number;
  total: number;
  recalculatePaginator(total: number): IPaginatorState;
}

export class PaginatorState implements IPaginatorState {
  page = 1;
  pageSize = PageSizes[2];
  total = 0;
  pageSizes: number[] = [];

  recalculatePaginator(total: number): PaginatorState {
    this.total = total;
    return this;
  }
}

export interface IPaginatorView {
  paginator: PaginatorState;
  ngOnInit(): void;
  paginate(paginator: PaginatorState): void;
}

export class PaginatorStateDefault implements IPaginatorState {
  page = 1;
  pageSize = 20;
  total = 0;
  pageSizes: number[] = [];
  totalpage = 0;
  recalculatePaginator(total: number): PaginatorStateDefault {
    this.total = total;
    this.totalpage = total;
    return this;
  }
}
