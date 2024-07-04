
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
//import { QuanLyYKienGopYService } from '../_services/ql-ykien-gopy.service';
import { TranslateService } from '@ngx-translate/core';
import { QuanLyYKienGopYEditComponent } from '../ql-ykien-gopy-edit/ql-ykien-gopy-edit.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { SelectionModel } from "@angular/cdk/collections";
import { QuanLyYKienGopYModel } from '../_model/ql-ykien-gopy.model';
import { QuanLyYKienGopYService } from '../_service/ql-ykien-gopy.service';
import { GroupingState } from '../../../share/models/grouping.model';
import { PaginatorState } from '../../../share/models/paginator.model';
import { SortState } from '../../../share/models/sort.model';
import { LayoutUtilsService } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
// const EMPTY_CUSTOM: QuanLyYKienGopYModel = {
// RowID : 0,
// NoiDung:'',
// MeetingContent : '',
// CreatedDate: '',
// allowEdit : true,
// IdCuocHop:0,
// IsActive:0,
// danhSachNguoiDung: [],
// refresh_token: ''
// };
const root = '/GetListYKienGopY';
@Component({
  selector: 'app-ql-ykien-gopy-list',
  templateUrl: './ql-ykien-gopy-list.component.html',
})


export class QuanLyYKienGopYListComponent implements OnInit {

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
  availableColumns: any = [
		{
			name: "SoThuTu",
			displayname: this.translate.instant("COMMON.STT"),
			alwaysChecked: false,
			isShow: true,
		},
		{
			name: "MeetingContent",
			displayname:"Tên cuộc họp",
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
	R: any = {};
	private subscriptions: Subscription[] = [];

  constructor(
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,public quanLyYKienGopYService: QuanLyYKienGopYService) { }

  ngOnInit(): void {

    this.loadDataList()
		this.grouping = this.quanLyYKienGopYService.grouping;
		this.paginator = this.quanLyYKienGopYService.paginator;
		this.sorting = this.quanLyYKienGopYService.sorting;
		const sb = this.quanLyYKienGopYService.isLoading$.subscribe((res) => (this.isLoading = res));
		this.subscriptions.push(sb);
  }

  paginate(paginator: PaginatorState) {
		this.quanLyYKienGopYService.patchState({ paginator }, root);
	}

    loadDataList() {
		//this.quanLyYKienGopYService.fetch();
		const filter = this.filterConfiguration();
		this.quanLyYKienGopYService.patchState({ filter }, root);
	}
	filterConfiguration(): any {
		const filter: any = {};
		if (this.keyword != "") {
			filter["keyword"] = this.keyword;
		  }

		return filter;
	}

	changeSelection() {
		let filter = this.filterConfiguration();

		this.quanLyYKienGopYService.patchState({ filter }, root);

	}



  /** Delete */
  editAcTive(QuanLyYKienGopY: QuanLyYKienGopYModel) {
	let data = Object.assign({}, QuanLyYKienGopY);
	data.allowEdit = true;
	this.viewQuanLyYKienGopY(data);
}


ACTIVE(QuanLyYKienGopY: any) {

	const _message: string = this.translate.instant("object.config.message", {
		name: this.translate.instant("menuconfignotify.columnsms")
	});
	// const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
	const _title: string = !QuanLyYKienGopY.IsActive ? this.translate.instant('MODULE.MENU_KHAOSAT.TITLE', {name: this.translate.instant('MODULE.MENU_YKIENGOPY.NAME')}) : this.translate.instant('MODULE.MENU_KHAOSAT.TITLE_', {name: this.translate.instant('MODULE.MENU_YKIENGOPY.NAME')});
	const _description: string = !QuanLyYKienGopY.IsActive ? this.translate.instant('MODULE.MENU_KHAOSAT.DESCRIPTION', {name: this.translate.instant('MODULE.MENU_YKIENGOPY.NAME')}) : this.translate.instant('MODULE.MENU_KHAOSAT.DESCRIPTION_', {name: this.translate.instant('MODULE.MENU_YKIENGOPY.NAME')});
	const _waitDesciption: string = !QuanLyYKienGopY.IsActive ? this.translate.instant('MODULE.MENU_KHAOSAT.WAIT_DESCRIPTION', {name: this.translate.instant('MODULE.MENU_YKIENGOPY.NAME')}) : this.translate.instant('MODULE.MENU_KHAOSAT.WAIT_DESCRIPTION_', {name: this.translate.instant('MODULE.MENU_YKIENGOPY.NAME')});
	const _deleteMessage: string = !QuanLyYKienGopY.IsActive ? this.translate.instant('MODULE.MENU_KHAOSAT.MESSAGE', {name: this.translate.instant('MODULE.MENU_YKIENGOPY.NAME')}) : this.translate.instant('MODULE.MENU_KHAOSAT.MESSAGE_', {name: this.translate.instant('MODULE.MENU_YKIENGOPY.NAME')});
	const _deleteMessageno: string = !QuanLyYKienGopY.IsActive ? this.translate.instant('MODULE.MENU_KHAOSAT.MESSAGENO', {name: this.translate.instant('MODULE.MENU_YKIENGOPY.NAME')}) : this.translate.instant('MODULE.MENU_KHAOSAT.MESSAGENO_', {name: this.translate.instant('MODULE.MENU_YKIENGOPY.NAME')});
	const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
	dialogRef.afterClosed().subscribe(res => {

		if (!res) {
			return;
		}
		this.quanLyYKienGopYService.ActiveQuanLyYKienGopY(QuanLyYKienGopY.IdCuocHop, QuanLyYKienGopY.IsActive).subscribe(res => {
			if (res.status > 0) {
				this.layoutUtilsService.showInfo(_message);
			}
			else {
				this.layoutUtilsService.showError(res.error.message);
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
  xemchitietQuanLyYKienGopY(QuanLyYKienGopY: QuanLyYKienGopYModel) {
		let data = Object.assign({}, QuanLyYKienGopY);
		this.viewQuanLyYKienGopY(data);
	}
  viewQuanLyYKienGopY(QuanLyYKienGopY: QuanLyYKienGopYModel) {
    // _item.IsXem = true;
		const dialogRef = this.dialog.open(QuanLyYKienGopYEditComponent, {
			data: { QuanLyYKienGopY }
		});
		dialogRef.afterClosed().subscribe((res) => {});
	}

}
