
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { PhieuLayYKienService } from '../_services/quan-ly-phieu-lay-y-kien.service';
import { TranslateService } from '@ngx-translate/core';
import { PhieuLayYKienModel } from '../_models/quan-ly-phieu-lay-y-kien.model';
import { QuanLyPhieuLayYKienEditComponent } from '../quan-ly-phieu-lay-y-kien-edit/quan-ly-phieu-lay-y-kien-edit.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { SelectionModel } from "@angular/cdk/collections";
import { DatePipe } from "@angular/common";
import { SurveyPhieuKhaoSatListComponent } from "../ds-phieu-khao-sat/ds-phieu-khao-sat.component";
import { filter } from 'rxjs/operators';
import { GroupingState } from '../../../share/models/grouping.model';
import { PaginatorState } from '../../../share/models/paginator.model';
import { SortState } from '../../../share/models/sort.model';
import { QLCuocHopModel } from '../../_models/quan-ly-cuoc-hop.model';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
const EMPTY_CUSTOM: PhieuLayYKienModel = {
	id: 0,
	Id: 0,
	TenPhongHop: '',
	MeetingContent: '',
	GhiChu: '',
	DiaDiem: '',
	FromTime: '',
	NoiDungGhiChu: '',
	IdCuocHop: 0,

	IsXem: false,
	// NguoiTao: '',
};
const root = '/GetListPhieuLayYKien';
@Component({
	selector: 'app-quan-ly-phieu-lay-y-kien-list-dialog',
	templateUrl: './quan-ly-phieu-lay-y-kien-list.component.html',
	styleUrls: ['./quan-ly-phieu-lay-y-kien-list.component.scss']
})


export class QuanLyPhieuLayYKienListDialogComponent implements OnInit {

	keyword: string = "";
	loadingSubject = new BehaviorSubject<boolean>(false);
	filterGroup: FormGroup;
	searchGroup: FormGroup;
	paginator: PaginatorState;
	sorting: SortState;
	grouping: GroupingState;
	isLoading: boolean = false;
	displayedColumns = [];
	key = 1;
	TrangThai_: string = '';
	type: -100;
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

	filterStatus: string = "";
	filterCondition: string = "";
	filterKeyWord: string = "";

	public nowDate_: any
	public nowDate: any
	public startDate: any

	selectedColumns = new SelectionModel<any>(true, this.availableColumns);
	selection = new SelectionModel<PhieuLayYKienModel>(true, []);
	QuanLyPhieuLayYKienResult: PhieuLayYKienModel[] = [];
	resultImport: any;
	showResultImport: boolean = false;
	listPage: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(
		Array.from(new Array(10), (val, index) => index)
	);
	listChuyenMuc: any[] = [];
	currentMsgFromChild1ToChild2 = 0;
	isObligate: boolean = false;
  idM: number = 0;
	private subscriptions: Subscription[] = [];

	constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public phieuLayYKienService: PhieuLayYKienService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private datePipe: DatePipe,) { }

	ngOnInit(): void {
    if (this.data.objData) {
      this.idM = this.data.objData.Id;
		}
		this.applySelectedColumns();

    this.loadDataList();
		this.grouping = this.phieuLayYKienService.grouping;
		this.paginator = this.phieuLayYKienService.paginator;
		this.sorting = this.phieuLayYKienService.sorting;
		const sb = this.phieuLayYKienService.isLoading$.subscribe((res) => (this.isLoading = res));
		this.subscriptions.push(sb);

	}

	search(searchTerm: string) {
		this.phieuLayYKienService.patchState({ searchTerm }, root);
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
		this.phieuLayYKienService.patchState({ sorting }, root);
	}
	// pagination
	paginate(paginator: PaginatorState) {
		const filter = this.filterConfiguration();
		this.phieuLayYKienService.patchState({ paginator, filter }, root);
	}
	Title(item) {
		return this.translate.instant('MENU_PHIEULAYYKIEN.CHUAQUAHAN')
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
		// this.phieuLayYKienService.fetch(root);

		const filter = this.filterConfiguration();
		this.phieuLayYKienService.patchState({ filter }, root);
	}

	Add() {
		this.Update(EMPTY_CUSTOM);
	}

	Update(QuanLyPhieuLayYKien: any) {
		QuanLyPhieuLayYKien.IsXem = false;
		const objData = new QLCuocHopModel();
		objData.Id = this.idM;
		const dialogRef = this.dialog.open(SurveyPhieuKhaoSatListComponent, {
			data: { QuanLyPhieuLayYKien ,objData},
			width: "1000px",
		});
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
	Delete(_item: PhieuLayYKienModel) {
		let ten = "<b>" + _item.TenPhongHop + "</b>";
		let name = this.translate.instant("MENU_PHONGHOP.NAME");

		const _title: string = this.translate.instant("OBJECT.DELETE.TITLE", { name: name.toLowerCase(), });
		const _description = this.translate.instant("MENU_PHONGHOP.TEN", { ten: ten.toLowerCase() });
		const _waitDesciption = this.translate.instant("OBJECT.DELETE.WAIT_DESCRIPTION", { ten: ten });
		const _deleteMessage = this.translate.instant("OBJECT.DELETE.MESSAGE", { ten: ten });

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.phieuLayYKienService.delete(_item.id, '/Delete_PhongHop').subscribe(res => {
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
		tmp_height = window.innerHeight - 350;
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




	filterConfiguration(): any {

		const filter: any = {};

		if (this.keyword != "") {
			filter["keyword"] = this.keyword;
		}
		if (this.filterStatus && this.filterStatus.length > 0) {
			filter.danhmucFB = +this.filterStatus;
		}
    if(this.idM != 0){
		filter['IdCuocHop'] = this.idM;
    }
		filter['type'] = this.key;
		filter.type = this.key;
		filter.TrangThai_ = this.TrangThai_;
		filter.TuNgay = this.datePipe.transform(this.startDate, "dd-MM-yyyy");
		filter.DenNgay = this.datePipe.transform(this.nowDate, "dd-MM-yyyy");

		return filter;
	}
	changeSelection() {
		let filter = this.filterConfiguration();

		this.phieuLayYKienService.patchState({ filter }, root);

	}
	Background(item) {
		if (item.TrangThai == 0) {
			return "blue"
		}
		else {
			return "green"
		}
	}
	changeEvent() {
		let filter = this.filterConfiguration();
		this.loadDataList();
	}


}
