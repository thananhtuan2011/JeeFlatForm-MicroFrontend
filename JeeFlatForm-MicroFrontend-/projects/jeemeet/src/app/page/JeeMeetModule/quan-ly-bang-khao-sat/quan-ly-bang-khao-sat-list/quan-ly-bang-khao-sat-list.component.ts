
import { Component, OnInit, ChangeDetectorRef, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QuanLyBangKhaoSatService } from '../_services/quan-ly-bang-khao-sat.service';
import { TranslateService } from '@ngx-translate/core';
import { BangKhaoSatModel } from '../_models/quan-ly-bang-khao-sat.model';
import { QuanLyBangKhaoSatEditComponent } from '../quan-ly-bang-khao-sat-edit/quan-ly-bang-khao-sat-edit.component';
import { BehaviorSubject, Subscription, ReplaySubject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { SelectionModel } from "@angular/cdk/collections";
import { ActivatedRoute } from '@angular/router';
import { QuanLyGiaHanKhaoSatComponent } from '../quan-ly-khao-sat-giahan/quan-ly-khao-sat-giahan.component';
import { GroupingState } from '../../../share/models/grouping.model';
import { PaginatorState } from '../../../share/models/paginator.model';
import { SortState } from '../../../share/models/sort.model';
import { DungChungFileModel } from '../../_models/quan-ly-cuoc-hop.model';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';

const EMPTY_CUSTOM: BangKhaoSatModel = {
	id: '',
	IdKhaoSat: 0,
	TieuDe: '',
	allowEdit: false,
	CreatedDate: '',
	Id: 0,
	NoiDungCauHoi: '',
	RowID: 0,
	IsDel: 0,
	CauHoiKhaoSat: [],
	IsActive: 0,
	IsBatBuoc: 0,
	IdCuocHop: 0,
	IsAction: 0,
	Type: 0,
	NgayGiaHan: 0,
	DSDVXuLy: '',
	ChiTietDG: [],
	refresh_token: '',
};
const root = '/GetList_BangKhaoSat';

@Component({
	selector: 'app-quan-ly-bang-khao-sat-list',
	templateUrl: './quan-ly-bang-khao-sat-list.component.html',
	styleUrls: ['./quan-ly-bang-khao-sat-list.component.scss']
})


export class QuanLyBangKhaoSatListComponent implements OnInit {

	keyword: string = "";
	loadingSubject = new BehaviorSubject<boolean>(false);
	filterGroup: FormGroup;
	searchGroup: FormGroup;
	paginator: PaginatorState;
	sorting: SortState;
	grouping: GroupingState;
	isLoading: boolean = false;
	displayedColumns = [];
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
	settingsSurvey: boolean = false;
	private subscriptions: Subscription[] = [];
	DungChungDropdown: DungChungFileModel = new DungChungFileModel();
	filteredId_CuocHop: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	lstKhaoSat: any[] = [];
	idM: number = 0;
	type: -100;
	check: boolean = false;
	IdCuocHopSelected: string = "0";
	searchCuocHop: string = "";
  filterStatus: string = "";
	constructor(
		@Inject(MAT_DIALOG_DATA) public data: any,
		public bangkhaosatService: QuanLyBangKhaoSatService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private route: ActivatedRoute
	) { }

	ngOnInit(): void {

		this.route.params.subscribe(params => {
			this.type = params['type'];
			if (params["type"] != undefined) {
				this.type = params["type"];
				this.check = true;
			}
		});

    if (this.data._data) {
			this.idM = this.data._data.IdM;
			this.settingsSurvey = this.data._data.SettingsSurvey ? this.data._data.SettingsSurvey : false;
		}
		this.loadDataList();
		if(this.type>0)
		{
			this.GetListCuocHop();
      if (this.data._data) {
        this.idM = this.data._data.IdM;
        this.settingsSurvey = this.data._data.SettingsSurvey ? this.data._data.SettingsSurvey : false;
      }
		}
		//const filter = this.filterConfiguration();
		this.grouping = this.bangkhaosatService.grouping;
		this.paginator = this.bangkhaosatService.paginator;
		this.sorting = this.bangkhaosatService.sorting;
		const sb = this.bangkhaosatService.isLoading$.subscribe((res) => (this.isLoading = res));
		this.subscriptions.push(sb);

	}

	paginate(paginator: PaginatorState) {
		 const filter = this.filterConfiguration();
			this.bangkhaosatService.patchState({ paginator,filter }, root);

	}

	loadDataList() {

		const filter = this.filterConfiguration();
		this.bangkhaosatService.patchState({ filter }, root);
	}
	filterConfiguration(): any {

		let filter: any = {};

		if (this.keyword != "") {
			filter["keyword"] = this.keyword;
		}
    	filter.IdCuocHop = 0;
		if (this.settingsSurvey) {
			filter.IdCuocHop = this.idM;
		}
		if (!this.settingsSurvey) {
			filter.IdCuocHop = 0;
		}
		if (this.filterStatus && this.filterStatus.length > 0) {
			filter.danhmucFB = +this.filterStatus;
		}
		filter.type = this.type;
		if (filter.type == "1") {
			filter.IdCuocHop = this.IdCuocHopSelected;
		} else {
			filter.IdCuocHop = this.IdCuocHopSelected;
		}
    if (this.settingsSurvey) {
			filter.IdCuocHop = this.idM;
		}
		return filter;
	}
	changeSelection() {
		let filter = this.filterConfiguration();

		this.bangkhaosatService.patchState({ filter }, root);
// this.loadDataList();
	}
	Add() {
		this.Update(EMPTY_CUSTOM);
	}
	ngOnDestroy() {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}
  Update(_item: any) {
		let saveMessageTranslateParam = "ECOMMERCE.CUSTOMERS.EDIT.";
		_item.IsXem = false;
		saveMessageTranslateParam += _item.IdKhaoSat > 0 ? "UPDATE_MESSAGE" : "ADD_MESSAGE";
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = _item.IdKhaoSat > 0 ? MessageType.Update : MessageType.Create;
		_item.allowEdit = true;
		const _data: any = {};
		_data.IdM = this.idM;
		_data.SettingsSurvey = this.settingsSurvey;
		if ((_item.IdCuocHop == 0 && _item.NgayGiaHan == 0 || (_item.IdCuocHop > 0 && !_item.IsAction))) {
			const dialogRef = this.dialog.open(QuanLyBangKhaoSatEditComponent, { data: { _item, _data }, width: "1000px", });
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
          return;
				}
				else {
					this.loadDataList();
				}
			});
		}
		else {
			const dialogRef = this.dialog.open(QuanLyGiaHanKhaoSatComponent, {
				data: { _item, _data },
				width: "650px",
				height: "500px",
			});
			dialogRef.afterClosed().subscribe((res) => {
				if (!res) {
					return;
				}
				this.loadDataList();
			});
		}
	}

  editQuanLyKhaoSat(QuanLyKhaoSat: BangKhaoSatModel) {
		const _data: any = {};
		_data.IdM = this.idM;
		_data.SettingsSurvey = this.settingsSurvey;
		let saveMessageTranslateParam = "ECOMMERCE.CUSTOMERS.EDIT.";
		saveMessageTranslateParam +=QuanLyKhaoSat.IdKhaoSat > 0 ? "UPDATE_MESSAGE" : "ADD_MESSAGE";
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType =QuanLyKhaoSat.IdKhaoSat > 0 ? MessageType.Update : MessageType.Create;
		if (QuanLyKhaoSat.IdKhaoSat > 0) {
			QuanLyKhaoSat.allowEdit = true;
		}
		if(QuanLyKhaoSat.NgayGiaHan==0&&QuanLyKhaoSat.IdCuocHop==0||QuanLyKhaoSat.IdCuocHop>0)
		{
		const dialogRef = this.dialog.open(QuanLyBangKhaoSatEditComponent, {
			data: { QuanLyKhaoSat, _data },
			width: "900px",
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}

			this.loadDataList();
		});
	}
	else{
		const dialogRef = this.dialog.open(QuanLyGiaHanKhaoSatComponent, {
			data: { QuanLyKhaoSat, _data },
			width: "500px",
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}

			this.loadDataList();
		});
	}

	}

	/** Delete */
	Delete(_item: BangKhaoSatModel) {
		let ten = "<b>" + _item.TieuDe + "</b>";
		//let ten=_item.moTa;
		let name = this.translate.instant("MENU_KHAOSAT.NAME");

		const _title: string = this.translate.instant("OBJECT.DELETE.TITLE", {
			name: name.toLowerCase(),
		});
		//const _title = this.translate.instant('Thông báo');
		const _description = this.translate.instant("MENU_KHAOSAT.TEN", { ten: ten.toLowerCase() });
		const _waitDesciption = this.translate.instant("OBJECT.DELETE.WAIT_DESCRIPTION",
			{ ten: ten });
		const _deleteMessage = this.translate.instant("OBJECT.DELETE.MESSAGE", { ten: ten });

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.bangkhaosatService.deleteQuanLyKhaoSat(_item.IdKhaoSat).subscribe(res => {
				if (res && res.status === 1) {
					this.layoutUtilsService.showInfo(_deleteMessage);
				}
				else {
					this.layoutUtilsService.showError(res.error.message);;
				}
					 this.loadDataList();
			});
		});
	}
	ACTIVE(QuanLyKhaoSat: any) {
		const _title: string = !QuanLyKhaoSat.IsActive ? this.translate.instant('MENU_KHAOSAT.TITLE', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') }) : this.translate.instant('MENU_KHAOSAT.TITLE_', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') });
		const _description: string = !QuanLyKhaoSat.IsActive ? this.translate.instant('MENU_KHAOSAT.DESCRIPTION', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') }) : this.translate.instant('MENU_KHAOSAT.DESCRIPTION_', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') });
		const _waitDesciption: string = !QuanLyKhaoSat.IsActive ? this.translate.instant('MENU_KHAOSAT.WAIT_DESCRIPTION', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') }) : this.translate.instant('MENU_KHAOSAT.WAIT_DESCRIPTION_', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') });
		const _deleteMessage: string = !QuanLyKhaoSat.IsActive ? this.translate.instant('MENU_KHAOSAT.MESSAGE', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') }) : this.translate.instant('MENU_KHAOSAT.MESSAGE_', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') });
		const _deleteMessageno: string = !QuanLyKhaoSat.IsActive ? this.translate.instant('MENU_KHAOSAT.MESSAGENO', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') }) : this.translate.instant('MENU_KHAOSAT.MESSAGENO_', { name: this.translate.instant('MENU_KHAOSAT.NAME_OBJ') });
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		if (this.settingsSurvey) {
			QuanLyKhaoSat.IdCuocHop = this.idM;
		}
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.bangkhaosatService.ActiveQuanLyKhaoSat(QuanLyKhaoSat.IdKhaoSat, QuanLyKhaoSat.IsActive, QuanLyKhaoSat.IdCuocHop, QuanLyKhaoSat.TieuDe).subscribe(res => {
				if (res.status > 0) {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 2000, true, false);
				}
				else {
					this.layoutUtilsService.showActionNotification(_deleteMessageno, MessageType.Read, 2000, true, false);
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
	xemchitietBangKhaoSat(_item: any) {
		let data = Object.assign({}, _item);
    // data.allowEdit = false;
		this.viewDetail(data);
	}
	viewDetail(_item: BangKhaoSatModel) {
    const _data: any = {};
		_data.IdM = this.idM;
		_data.SettingsSurvey = this.settingsSurvey;
		const dialogRef = this.dialog.open(QuanLyBangKhaoSatEditComponent, {
			data: { _item , _data}
			, width: '60%'
		});
		dialogRef.afterClosed().subscribe((res) => { });
	}
	GetListCuocHop() {
		this.filteredId_CuocHop.next([]);
		this.lstKhaoSat = [];
		this.bangkhaosatService.listCuocHop(-1).subscribe(
			res => {
				if (res && res.status == 1) {
					if (res.data) {
						this.lstKhaoSat = res.data;
						this.filteredId_CuocHop.next(this.lstKhaoSat.slice());
						this.changeDetectorRefs.detectChanges();
					}
				} else {
					// this.layoutUtilsService.showActionNotification(
					// 	this.translate.instant(
					// 		"MENU_CAUHOIKHAOSAT.GETDATAERROR"
					// 	),
					// 	MessageType.Error,
					// 	2000,
					// 	true,
					// 	false
					// );
				}
			},
			(err) => {
				const message = err.error.error.message;
				this.layoutUtilsService.showActionNotification(
					message,
					MessageType.Warning,
					2000,
					true,
					false
				);
			}
		);
		const filter = this.filterConfiguration();
		this.bangkhaosatService.patchState({ filter }, root);
		//this.loadDataList();
	}
	filterConfigurationExcel(more = 1): any {

		const filter: any = {};
		filter.more = more == 1;
		filter.page = this.paginator.page;
		filter.record = this.paginator.pageSize;
		//   filter.type = this.type;
		//   filter.IdCuocHop = 0;
		// if (this.settingsSurvey) {
		// 	filter.IdCuocHop = this.idM;
		// }
		// if (!this.settingsSurvey) {
		// 	filter.IdCuocHop = 0;
		// }
		//   if(filter.type=="1")
		//   {
		// 	  filter.IdCuocHop=this.IdCuocHopSelected;
		//   }
		//   if (this.keyword != "") {
		// 	filter["keyword"] = this.keyword;
		// }
		filter.type = this.type;
		if (filter.type == "1") {
			filter.IdCuocHop = this.IdCuocHopSelected;
		} else {
			filter.IdCuocHop = this.IdCuocHopSelected;
		}

		return filter;
	  }


	xuatExcelDetail(more = 1) {

		let filter = this.filterConfigurationExcel(more);
		var request = new XMLHttpRequest();
			if (filter.type != null && filter.type != undefined) {
			if (filter.type != '') {
				filter.type = this.type;
				filter.IdCuocHop=this.IdCuocHopSelected;
			}
			else {
			    filter.type = '';
			}
		  }
		  else
		  {
			filter.type = '';
		  }

		this.bangkhaosatService.exportExcel(filter).subscribe(res => {
			if (res && res.status == 1) {
				const linkSource = `data:application/octet-stream;base64,${res.data}`;
				const downloadLink = document.createElement("a");
				const fileName = res.data_FileName;
				downloadLink.href = linkSource;
				downloadLink.download = fileName;
				downloadLink.click();
			}
			else
				this.layoutUtilsService.showInfo(this.translate.instant('GeneralKey.ERROREXPORTFILE'));
		});

	}
	filterId_CuocHop() {
		if (!this.lstKhaoSat) {
			return;
		}
		let search = this.DungChungDropdown.nonAccentVietnamese(
			this.searchCuocHop
		); //this.searchLoaiTienIch;
		if (!search) {
			this.filteredId_CuocHop.next(this.lstKhaoSat.slice());
			return;
		}
		// else {
		//   search = search.toLowerCase();
		// }
		this.filteredId_CuocHop.next(
			this.lstKhaoSat.filter(
				(ts) =>
					this.DungChungDropdown.nonAccentVietnamese(
						ts.MeetingContent
					).indexOf(search) > -1
			) //ts.TenLoai.toLowerCase().indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();
	}
  sendNotifySurvey(item: any) {
		if (this.settingsSurvey) {
			item.IdCuocHop = this.idM;
		}
		let name = this.translate.instant("MODULE.MENU_KHAOSAT.NAME_OBJ");
		const _title: string = this.translate.instant("OBJECT.NOTIFY.TITLE", {
			name: name.toLowerCase(),
		});
		const _description: string = this.translate.instant(
			"OBJECT.NOTIFY.DESCRIPTION",
			{ name: name.toLowerCase() }
		);
		const _waitDesciption: string = this.translate.instant(
			"OBJECT.NOTIFY.WAIT_DESCRIPTION",
			{ name: name }
		);

		const dialogRef = this.layoutUtilsService.deleteElement(
			_title,
			_description,
			_waitDesciption
		);
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
			this.bangkhaosatService.sendNotifySurvey(item).subscribe(res => {
				if (res && res.status == 1) {
					this.layoutUtilsService.showActionNotification(
						res.error.message,
						MessageType.Create,
						2000,
						true,
						false
					);
					this.loadDataList();
				} else {
					this.layoutUtilsService.showActionNotification(
						res.error.message,
						MessageType.Error,
						2000,
						true,
						false
					);
				}
			});
		});

	}
}
