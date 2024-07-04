import { Component, OnInit, ViewChild, ElementRef, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { merge, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DatPhongService } from '../../Services/dat-phong.service';
import { QueryParamsModel } from 'projects/jeeadmin/src/app/models/query-models/query-params.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DangKyPhongHopDataSource } from '../../Model/data-source/dang-ky-phong-hop.datasource';

@Component({
	selector: 'm-danh-sach-phong-huy-list',
	templateUrl: './danh-sach-phong-huy-list.component.html',
})
export class DanhSachPhongHuyListComponent implements OnInit, OnDestroy {
	private subscriptions: Subscription[] = []  
	item: any;
	displayedColumns = ['STT', 'ThoiGian', 'PhongHop', 'LyDo', 'NgayHuy', 'NguoiHuy'];
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

    dataSource: DangKyPhongHopDataSource;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;

	TuNgay: string = '';
	DenNgay: string = '';
	@ViewChild('searchTuNgay', { static: true }) searchTuNgay: ElementRef;
	@ViewChild('searchDenNgay', { static: true }) searchDenNgay: ElementRef;

	constructor(public dialogRef: MatDialogRef<DanhSachPhongHuyListComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
		public _DangKyDatPhongService: DatPhongService) { }

	/** LOAD DATA */
	ngOnInit() {
		this.dataSource = new DangKyPhongHopDataSource(this._DangKyDatPhongService);
		this.loadDataList(true);
		merge(this.sort.sortChange, this.paginator.page)
			.pipe(
				tap(() => {
					this.loadDataList(true);
				})
			)
		.subscribe();
	}

	loadDataList(page: boolean = true) {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
			this.sort.direction,
			this.sort.active,
			page ? this.paginator.pageIndex : this.paginator.pageIndex = 0,
			this.paginator.pageSize,
		);
		this.dataSource.loadListHuy(queryParams);
	}

	ngOnDestroy() {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		const searchTexttungay = (this.searchTuNgay.nativeElement.value).split('/');
		const searchTextdenngay = (this.searchDenNgay.nativeElement.value).split('/');

		if (searchTexttungay.length == 3) {
			filter.TuNgay = this.searchTuNgay.nativeElement.value;
		}
		if (searchTextdenngay.length == 3) {
			filter.DenNgay = this.searchDenNgay.nativeElement.value;
		}
		return filter;
	}

	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 362;
		return tmp_height + 'px';
	}

	goBack() {
		this.ngOnDestroy()
		this.dialogRef.close();
	}
}
