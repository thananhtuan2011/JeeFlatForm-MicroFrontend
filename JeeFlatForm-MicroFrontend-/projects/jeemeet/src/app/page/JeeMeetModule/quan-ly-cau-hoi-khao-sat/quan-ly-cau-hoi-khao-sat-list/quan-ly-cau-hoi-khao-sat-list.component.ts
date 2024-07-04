import { CauHoiKhaoSatModel } from './../_models/quan-ly-cau-hoi-khao-sat.model';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuanLyCauHoiKhaoSatService } from '../_services/quan-ly-cau-hoi-khao-sat.service';
import { TranslateService } from '@ngx-translate/core';
import { QuanLyCauHoiKhaoSatEditComponent } from '../quan-ly-cau-hoi-khao-sat-edit/quan-ly-cau-hoi-khao-sat-edit.component';
import { BehaviorSubject, Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SelectionModel } from "@angular/cdk/collections";
import { GroupingState } from '../../../share/models/grouping.model';
import { PaginatorState } from '../../../share/models/paginator.model';
import { SortState } from '../../../share/models/sort.model';
import { LayoutUtilsService } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
const EMPTY_CUSTOM: CauHoiKhaoSatModel = {
  id: '',
  Id: 0,
  NoiDungCauHoi: '',
  allowEdit: false,
  CreatedDate: '',
  IdCauTraLoi: 0,
  CauTraLoi: '',
  Type: 0,
  // DanhSachNguoiDung: [],
  // refresh_token: ''
};
const root = '/GetList_CauHoiKhaoSat';
@Component({
  selector: 'app-quan-ly-cau-hoi-khao-sat-list',
  templateUrl: './quan-ly-cau-hoi-khao-sat-list.component.html',
  styleUrls: ['./quan-ly-cau-hoi-khao-sat-list.component.scss']
})


export class QuanLyCauHoiKhaoSatListComponent implements OnInit {
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

	private subscriptions: Subscription[] = [];

  constructor(public khoaHopService: QuanLyCauHoiKhaoSatService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
    private fb: FormBuilder,
		private translate: TranslateService,) { }

  ngOnInit(): void {
    this.khoaHopService.fetch(root);
		this.grouping = this.khoaHopService.grouping;
		this.paginator = this.khoaHopService.paginator;
		this.sorting = this.khoaHopService.sorting;
		const sb = this.khoaHopService.isLoading$.subscribe((res) => (this.isLoading = res));
		this.subscriptions.push(sb);
  }

  paginate(paginator: PaginatorState) {
		this.khoaHopService.patchState({ paginator });
	}

    loadDataList() {
      const filter = this.filterConfiguration();
      this.khoaHopService.patchState({ filter }, root);
	}
  changeSelection() {
		let filter = this.filterConfiguration();

		this.khoaHopService.patchState({ filter }, root);

	}
  /** FILTRATION */
  filterConfiguration(): any {
    let filter: any = {};

    if (this.keyword != "") {
      filter["keyword"] = this.keyword;
    }

    return filter;
  }
    // filtration
  filterForm() {
    this.filterGroup = this.fb.group({
      status: [''],
      type: [''],
      searchTerm: [''],
    });
    this.subscriptions.push(
      this.filterGroup.controls.status.valueChanges.subscribe(() =>
        this.filter()
      )
    );
    this.subscriptions.push(
      this.filterGroup.controls.type.valueChanges.subscribe(() => this.filter())
    );
  }

  filter() {
    const filter = this.filterConfiguration();
    this.khoaHopService.patchState({ filter }, root);
  }
  Add() {
		this.Update(EMPTY_CUSTOM);
	}

  Update(_item: CauHoiKhaoSatModel) {
    let ask = 1;
		const dialogRef = this.dialog.open(QuanLyCauHoiKhaoSatEditComponent, { data: { _item ,ask} });
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
	Delete(_item: CauHoiKhaoSatModel) {
    let ten="<b>"+_item.NoiDungCauHoi+"</b>";
    //let ten=_item.moTa;
    let name = this.translate.instant("MENU_KHOAHOP.NAME");

		const _title: string = this.translate.instant("OBJECT.DELETE.TITLE", {
			name: name.toLowerCase(),
		});
		//const _title = this.translate.instant('Thông báo');
		const _description= this.translate.instant("MENU_KHOAHOP.TEN",{ ten: ten.toLowerCase() });
		const _waitDesciption = this.translate.instant("OBJECT.DELETE.WAIT_DESCRIPTION",
    { ten: ten });
		const _deleteMessage = this.translate.instant("OBJECT.DELETE.MESSAGE",{ten:ten});

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}

			this.khoaHopService.deleteQuanLyCauHoiKhaoSat(_item.Id).subscribe(res => {
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
  xemchitietQuanLyCauHoiKhaoSat(item: CauHoiKhaoSatModel) {
		let data = Object.assign({}, item);
		this.viewQuanLyCauHoiKhaoSat(data);
	}
  viewQuanLyCauHoiKhaoSat(item: CauHoiKhaoSatModel) {
		const dialogRef = this.dialog.open(QuanLyCauHoiKhaoSatEditComponent, {
			data: { item }
		});
		dialogRef.afterClosed().subscribe((res) => {});
	}

}
