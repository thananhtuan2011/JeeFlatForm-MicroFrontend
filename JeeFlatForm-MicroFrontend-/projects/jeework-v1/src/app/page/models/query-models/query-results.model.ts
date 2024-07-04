export class QueryResultsModel {
	[x: string]: any;
	// fields
	data: any[];
	page: any;
	items: any[];
	totalCount: number;
	errorMessage: string;
	status: number;
	Visible:boolean;
	constructor(_items: any[] = [], _errorMessage: string = '') {
		this.items = this.data = _items;
		this.totalCount = _items.length;
	}
}

export class QueryParamsModelNewLazy {
	// fields
	filter: any;
	sortOrder: string; // asc || desc
	sortField: string;
	pageNumber: number;
	pageSize: number;
	more: boolean;
  
	// constructor overrides
	constructor(_filter: any,
	  _sortOrder: string = 'asc',
	  _sortField: string = '',
	  _pageNumber: number,
	  _pageSize: number,
	  _more: boolean = false) {
	  this.filter = _filter;
	  this.sortOrder = _sortOrder;
	  this.sortField = _sortField;
	  this.pageNumber = _pageNumber;
	  this.pageSize = _pageSize;
	  this.more = _more;
	}
  }

export class QueryResultsModel2 {
	// fields
	data: any[];
	page: any;
	error: ErrorModel;
	status: number;
}

class ErrorModel {
	code: string;
	message: string;
	constructor(_code: string = '', _errorMessage: string = '') {
		this.code = _code;
		this.message = _errorMessage;
	}
}

//data: null
//error: { message: "Tổng số ngày cấp phép mỗi tháng không lớn hơn số ngày đã cho", code: "107" }
//page: null
//status: 0
