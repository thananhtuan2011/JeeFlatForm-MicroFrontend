
import { Component, OnInit,ViewChild } from '@angular/core';
import { QuanLySoTayCuocHopService } from '../_services/quan-ly-so-tay-cuoc-hop.service';
import { TranslateService } from '@ngx-translate/core';
import { SoTayCuocHopModel } from '../_models/quan-ly-so-tay-cuoc-hop.model';
import { QuanLySoTayCuocHopEditComponent } from '../quan-ly-so-tay-cuoc-hop-edit/quan-ly-so-tay-cuoc-hop-edit.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { SelectionModel } from "@angular/cdk/collections";
// Material
import { MatSort} from "@angular/material/sort";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { GroupingState } from '../../../share/models/grouping.model';
import { PaginatorState } from '../../../share/models/paginator.model';
import { SortState } from '../../../share/models/sort.model';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
const EMPTY_CUSTOM: SoTayCuocHopModel = {
  id: '',
  MeetingContent: "",
  DiaDiem: "",
  FromTime:"",
  NoiDungGhiChu:"",
  IsXem:false,
  IdCuocHop:0,
	DSDVXuLy: "",
	ChiTietDG: [],
  // NguoiTao: '',
};
const root = '/GetList_SoTayCuocHop';
@Component({
  selector: 'app-quan-ly-so-tay-cuoc-hop-list-v2',
  templateUrl: './quan-ly-so-tay-cuoc-hop-list-v2.component.html',
  styleUrls: ['./quan-ly-so-tay-cuoc-hop-list-v2.component.scss']
})


export class QuanLySoTayCuocHopListV2Component implements OnInit {

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

  constructor(public soTayCuocHopService: QuanLySoTayCuocHopService,
    public dialogRef: MatDialogRef<QuanLySoTayCuocHopListV2Component>,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService) { }

  ngOnInit(): void {
    this.loadDataList();
		this.grouping = this.soTayCuocHopService.grouping;
		this.paginator = this.soTayCuocHopService.paginator;
		this.sorting = this.soTayCuocHopService.sorting;
		const sb = this.soTayCuocHopService.isLoading$.subscribe((res) => (this.isLoading = res));
		this.subscriptions.push(sb);
  }

	search(searchTerm: string) {
		this.soTayCuocHopService.patchState({ searchTerm }, root);
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
    this.soTayCuocHopService.patchState({ sorting }, root);
	}
// pagination
paginate(paginator: PaginatorState) {
  this.soTayCuocHopService.patchState({ paginator }, root);
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
		this.soTayCuocHopService.fetch(root);
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
		const dialogRef = this.dialog.open(QuanLySoTayCuocHopEditComponent, { disableClose: true,data: { _item } });
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
	Delete(_item: SoTayCuocHopModel) {
    let ten="<b>"+_item.MeetingContent+"</b>";
    let name =  this.translate.instant("MENU_STCUOCHOP.NAME");

		const _title: string = this.translate.instant("OBJECT.DELETE.TITLE", {name: name.toLowerCase(),});
		const _description= this.translate.instant("MENU_STCUOCHOP.TEN",{ ten: ten.toLowerCase() });
		const _waitDesciption = this.translate.instant("OBJECT.DELETE.WAIT_DESCRIPTION",{ name: ten });
		const _deleteMessage = this.translate.instant("OBJECT.DELETE.MESSAGE",{name:ten});

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}			this.soTayCuocHopService.delete(_item.id, '/Delete_SoTayCuocHop').subscribe(res => {
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
  xemchitietQuanLySoTayCuocHop(_item: any) {
		let data = Object.assign({}, _item);
    data.allowEdit = false;
		this.viewQuanLySoTayCuocHop(data);
	}
  viewQuanLySoTayCuocHop(_item: any) {
    _item.IsXem=true;
		const dialogRef = this.dialog.open(QuanLySoTayCuocHopEditComponent, {
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

		this.soTayCuocHopService.patchState({ filter }, root);

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
close() {
  this.dialogRef.close();
}
}
