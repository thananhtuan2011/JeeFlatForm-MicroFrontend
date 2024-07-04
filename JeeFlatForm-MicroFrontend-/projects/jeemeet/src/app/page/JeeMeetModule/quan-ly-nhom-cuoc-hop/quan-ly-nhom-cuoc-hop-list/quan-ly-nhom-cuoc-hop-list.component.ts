
import { Component, OnInit,ViewChild } from '@angular/core';
import { QuanLyNhomCuocHopService } from '../_services/quan-ly-nhom-cuoc-hop.service';
import { TranslateService } from '@ngx-translate/core';
import { NhomCuocHopModel } from '../_models/quan-ly-nhom-cuoc-hop.model';
import { QuanLyNhomCuocHopEditComponent } from '../quan-ly-nhom-cuoc-hop-edit/quan-ly-nhom-cuoc-hop-edit.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { SelectionModel } from "@angular/cdk/collections";
// Material
import { MatSort} from "@angular/material/sort";
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { GroupingState } from '../../../share/models/grouping.model';
import { PaginatorState } from '../../../share/models/paginator.model';
import { SortState } from '../../../share/models/sort.model';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
const EMPTY_CUSTOM: NhomCuocHopModel = {
  id: '',
  TenNhom: "",
  listUsers: []
};
const root = '/GetList_NhomCuocHop';
@Component({
  selector: 'app-quan-ly-nhom-cuoc-hop-list',
  templateUrl: './quan-ly-nhom-cuoc-hop-list.component.html',
  styleUrls: ['./quan-ly-nhom-cuoc-hop-list.component.scss']
})


export class QuanLyNhomCuocHopListComponent implements OnInit {

  keyword: string = "";
  loadingSubject = new BehaviorSubject<boolean>(false);
	filterGroup: FormGroup;
	searchGroup: FormGroup;
	paginator: PaginatorState;
	sorting: SortState;
	grouping: GroupingState;
	isLoading: boolean = false;
  check: boolean = false;
  displayedColumns = [];

  IdCuocHopSelected: string = "0";
  availableColumns: any = [
		{
			name: "SoThuTu",
			displayname: this.translate.instant("COMMON.STT"),
			alwaysChecked: false,
			isShow: true,
		},
		{
			name: "actions",
			displayname: this.translate.instant(
				"COMMON.TACVU"
			),
			alwaysChecked: false,
			isShow: true,
		},
	];
	selectedColumns = new SelectionModel<any>(true, this.availableColumns);
  // paginatorlinhvuc: MatPaginator;
  // @ViewChild("sort1", { static: true }) sort: MatSort;
	private subscriptions: Subscription[] = [];

  constructor(public NhomCuocHopService: QuanLyNhomCuocHopService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService) { }

  ngOnInit(): void {
    this.loadDataList();
		this.grouping = this.NhomCuocHopService.grouping;
		this.paginator = this.NhomCuocHopService.paginator;
		this.sorting = this.NhomCuocHopService.sorting;
		const sb = this.NhomCuocHopService.isLoading$.subscribe((res) => (this.isLoading = res));
		this.subscriptions.push(sb);
  }

	search(searchTerm: string) {
		this.NhomCuocHopService.patchState({ searchTerm }, root);
	}

	// sorting
	sort(column: string) {
		const sorting = this.sorting;
		const isActiveColumn = sorting.column === column;
		if (!isActiveColumn) {
			sorting.column = column;
			sorting.direction = 'asc';
		} else {
			sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
		}
    this.NhomCuocHopService.patchState({ sorting }, root);
	}
// pagination
paginate(paginator: PaginatorState) {
  this.NhomCuocHopService.patchState({ paginator }, root);
}

 // form actions
 create() {
  this.edit(undefined);
}

edit(id: number) {
}

delete(id: number) {
}

deleteSelected() {
}

updateStatusForSelected() {
}

fetchSelected() {
}

  loadDataList() {
		this.NhomCuocHopService.fetch(root);
	}

  Add() {
		this.Update(EMPTY_CUSTOM);
	}

  Update(_item: any) {
    let saveMessageTranslateParam = "ECOMMERCE.CUSTOMERS.EDIT.";
		_item.IsXem=false;
		saveMessageTranslateParam +=_item.id > 0 ? "UPDATE_MESSAGE" : "ADD_MESSAGE";
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType =_item.id > 0 ? MessageType.Update : MessageType.Create;
		_item.allowEdit = true;
		const dialogRef = this.dialog.open(QuanLyNhomCuocHopEditComponent, { disableClose: true,data: { _item } });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				this.loadDataList();
			}
			else {
				this.loadDataList();
			}
		});
	}

  /** Delete */
	Delete(_item: NhomCuocHopModel) {
    let ten=_item.TenNhom;
    let name =  'Nhóm họp';

		const _title: string = 'Xóa nhóm họp cá nhân';
		const _description= 'Bạn có chắc muốn xóa nhóm họp này không?';
		const _waitDesciption = 'Đang xóa'
		const _deleteMessage = 'Xóa nhóm họp thành công';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}			this.NhomCuocHopService.delete(_item.id, '/Delete_NhomCuocHop').subscribe(res => {
        if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 10000, true, false, 3000, 'top', 0);
				}
				this.loadDataList();
			});
		});
	}

  getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 250;
		return tmp_height + 'px';
	}

  //Button hiển thị cột
  menuChange(e: any, type: 0 | 1 = 0) {
		// this.layoutUtilsService.menuSelectColumns_On_Off();
	}
  CheckAllColumns() {
		if (this.IsAllColumnsChecked()) {
			this.availableColumns.forEach((row) => {
				if (!row.alwaysChecked) this.selectedColumns.deselect(row);
			});
		} else {
			this.availableColumns.forEach((row) =>
				this.selectedColumns.select(row)
			);
		}
	}
  	//Apply selected Column
	IsAllColumnsChecked() {
		const numSelected = this.selectedColumns.selected.length;
		const numRows = this.availableColumns.length;
		return numSelected === numRows;
	}
  applySelectedColumns() {
		let _selectedColumns = this.selectedColumns.selected;
		this.selectedColumns = new SelectionModel<any>(
			true,
			this.availableColumns
		);
		for (let i = 0; i < this.availableColumns.length; i++) {
			this.selectedColumns.toggle(this.availableColumns[i]);
			for (let j = 0; j < _selectedColumns.length; j++) {
				if (this.availableColumns[i].name == _selectedColumns[j].name) {
					this.selectedColumns.toggle(this.availableColumns[i]);
					break;
				}
			}
		}
		const _applySelectedColumns: string[] = [];
		this.selectedColumns.selected.forEach((col) => {
			_applySelectedColumns.push(col.name);
		});
		this.displayedColumns = _applySelectedColumns;
	}



  //Xem chi tiet
  xemchitietQuanLyNhomCuocHop(_item: any) {
		let data = Object.assign({}, _item);
    data.allowEdit = false;
		this.viewQuanLyNhomCuocHop(data);
	}
  viewQuanLyNhomCuocHop(_item: any) {
    _item.IsXem=true;
		const dialogRef = this.dialog.open(QuanLyNhomCuocHopEditComponent, {
			data: { _item }
		});
		dialogRef.afterClosed().subscribe((res) => {});
	}

  filterConfiguration(): any {
		let filter: any = {};

		if (this.keyword != "") {
		  filter["keyword"] = this.keyword;
		}

		return filter;
	}
  changeSelection() {
		let filter = this.filterConfiguration();

		this.NhomCuocHopService.patchState({ filter }, root);

	}
// loaddataList(holdCurrentPage: boolean = true) {
// 		const queryParams = new QueryParamsModel(
// 			this.filterConfiguration(),
// 			this.sort.direction,
// 			this.sort.active,
// 			holdCurrentPage
// 				? this.paginatorlinhvuc.pageIndex
// 				: (this.paginatorlinhvuc.pageIndex = 0),
// 			this.paginatorlinhvuc.pageSize
// 		);
// 		this.dataSource.loaddata(queryParams);
// 	}
}
