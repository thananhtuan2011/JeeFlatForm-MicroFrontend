import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { DangKyCuocHopService } from '../../_services/dang-ky-cuoc-hop.service';
import { ISortView, SortState } from '../../../share/models/sort.model';
import { PaginatorState } from '../../../share/models/paginator.model';

@Component({
  selector: 'app-danh-sach-dang-ky-huy',
  templateUrl: './danh-sach-dang-ky-huy.component.html',
  styleUrls: ['./danh-sach-dang-ky-huy.component.scss']
})
export class DanhSachDangKyHuyComponent implements OnInit,
OnDestroy,
ISortView {
	start_temp: any;
	end_temp: any;
  itemForm: FormGroup;
  disabledBtn: boolean;
  displayedColumns = [];
	availableColumns = [
		{
			stt: 1,
			name: 'STT',
			alwaysChecked: true,
		},
		{
			stt: 2,
			name: 'ThoiGian',
			alwaysChecked: false,
		},
		{
			stt: 3,
			name: 'PhongHop',
			alwaysChecked: false,
		},
		{
			stt: 6,
			name: 'LyDo',
			alwaysChecked: false,
		},
		{
			stt: 7,
			name: 'NgayHuy',
			alwaysChecked: false,
		},
		{
			stt: 9,
			name: 'NguoiHuy',
			alwaysChecked: false,
		},

	];
	selectedColumns = new SelectionModel<any>(true, this.availableColumns);
	selectedValue: any;

	selection = new SelectionModel<any>(true, []);
	productsResult: any[] = [];

	TuNgay: string = '';
	DenNgay: string = '';
  paginator: PaginatorState = new PaginatorState();
	sorting: SortState;
  isLoading: boolean = false;
  private subscriptions: Subscription[] = [];
  constructor(public dialogRef: MatDialogRef<DanhSachDangKyHuyComponent>,private changeDetectorRefs: ChangeDetectorRef,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private translate: TranslateService,
    public dangKyCuocHopService: DangKyCuocHopService,) { }

  ngOnInit(): void {
    // this.applySelectedColumns();
    // this.paginator = this.dangKyCuocHopService.JeeMeeting_paginator;
		// this.sorting = this.dangKyCuocHopService.sorting;
		// const sb = this.dangKyCuocHopService.isLoading$.subscribe(res => this.isLoading = res);
		// this.subscriptions.push(sb);
		// this.LoadDataList()
  }
  /** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		filter.TuNgay  = this.start_temp;
		filter.DenNgay  = this.end_temp;
		return filter;
	}

	/** ACTIONS */
	LoadDataList() {
		// const filter = this.filterConfiguration();
		// this.dangKyCuocHopService.patchStateJeeMeeting({ filter }, this.dangKyCuocHopService.loadDSHuy);
		// this.dangKyCuocHopService.itemsJM$.subscribe(x => console.log(x))
	}

  // sorting
	sort(column: string) {
		const filter = this.filterConfiguration();
		const sorting = this.sorting;
		const isActiveColumn = sorting.column === column;
		if (!isActiveColumn) {
			sorting.column = column;
			sorting.direction = 'asc';
		} else {
			sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
		}
		// this.dangKyCuocHopService.patchStateJeeMeeting({ filter,sorting }, this.dangKyCuocHopService.loadDSHuy);
	}
  // pagination
	paginate(paginator: PaginatorState) {
    // this.dangKyCuocHopService.patchStateJeeMeeting({ paginator }, this.dangKyCuocHopService.loadDSHuy);
}
  goBack(){
    this.dialogRef.close();
  }
  ngOnDestroy() {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}
  applySelectedColumns() {
		const _selectedColumns: string[] = [];
		this.selectedColumns.selected.sort((a, b) => { return a.stt > b.stt ? 1 : 0; }).forEach(col => { _selectedColumns.push(col.name) });
		this.displayedColumns = _selectedColumns;
	}
}
