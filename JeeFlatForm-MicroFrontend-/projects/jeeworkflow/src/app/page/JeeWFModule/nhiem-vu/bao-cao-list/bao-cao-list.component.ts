import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, HostListener, Input, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// RXJS
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import Exporting from 'highcharts/modules/exporting';
import funnel from 'highcharts/modules/funnel';
import Highcharts from 'highcharts';
import { ProcessWorkService } from '../../../services/process-work.service';
import { LayoutUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/layout-utils.service';
import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';


Exporting(Highcharts);
funnel(Highcharts);

@Component({
	selector: 'kt-bao-cao-list',
	templateUrl: './bao-cao-list.component.html',
	styleUrls: ['./bao-cao-list.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})


export class BaoCaoListComponent {

	@Input() ID_QuyTrinh: any;
	@Input() TenQuyTrinh: any;
	ListData: any[] = [];

	date = new Date();
	range = new FormGroup({
		start: new FormControl(new Date(this.date.getFullYear(), this.date.getMonth(), 1)),
		end: new FormControl(new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0))
	});

	constructor(public _ProcessWorkService: ProcessWorkService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private router: Router,) {
	}

	ngOnChanges(changes: SimpleChange) {
		if (changes['ID_QuyTrinh']) {
			this.Load();
		}
	}
	/** LOAD DATA */
	async Load() {
		await this.TyLeChuyenDoi();
		await this.TrangThai();
		await this.ThoiGianHoanThanh();
		await this.LyDoThatBai();
		await this.LyDoHoanThanh();
		await this.GD_NguoiThucHien();
		await this.NguoiThucHien();
	}

	filter(): any {
		const filter: any = {};
		filter.quytrinhid = this.ID_QuyTrinh;
		filter.tungay = this.range.value.start.toJSON();
		filter.denngay = this.range.value.end.toJSON();
		return filter;
	}

	startChange(event: any) {
		this.range.value.start = event.value;
	}
	endChange(event: any) {
		this.range.value.end = event.value;
		this.TyLeChuyenDoi();
		this.TrangThai();
		this.ThoiGianHoanThanh();
		this.LyDoThatBai();
		this.LyDoHoanThanh();
		this.GD_NguoiThucHien();
		this.NguoiThucHien();
	}
	//==========================Start Tỷ lệ chuyển đổi==========================
	@ViewChild('container', { read: ElementRef }) container: ElementRef;
	ShowFunnelChart: boolean = true;
	async TyLeChuyenDoi() {
		const queryParams = new QueryParamsModelNew(
			this.filter(),
		);
		// this.layoutUtilsService.showWaitingDiv();
		this._ProcessWorkService.gettylechuyendoi(queryParams)
			.pipe(
				tap(resultFromServer => {
					// this.layoutUtilsService.OffWaitingDiv();
					if (resultFromServer.status == 1) {
						let list = [];
						if (resultFromServer.data.length > 0) {
							this.ShowFunnelChart = true;
							resultFromServer.data.map((item, index) => {
								list.push([item.giaidoan, item.soluong])
							})
							Highcharts.chart(this.container.nativeElement, {
								chart: {
									type: 'funnel'
								},
								title: {
									text: 'Tỷ lệ chuyển đổi'
								},
								plotOptions: {
									series: {
										dataLabels: {
											enabled: true,
											format: '<b>{point.name}</b> ({point.y:,.0f})',
											color:
												(Highcharts.theme && Highcharts.theme.contrastTextColor) ||
												'black',
											softConnector: true
										},
										center: ['40%', '50%'],
										neckWidth: '30%',
										neckHeight: '25%',
										width: '60%',
										height: '60%',
									}
								},
								legend: {
									enabled: false
								},
								series: [
									{
										data: list
									}
								]
							});
						}
						else {
							this.ShowFunnelChart = false;
						}
					}
					else {
						this.ShowFunnelChart = false;
					}
					this.changeDetectorRefs.detectChanges();
				})
			).subscribe();;
	}

	//==========================End Tỷ lệ chuyển đổi==========================

	//==========================Start Trạng thái nhiệm vụ========================
	listColor = ['#7cb5ec', '#90ed7d', '#434348']
	public pieChartData = [];
	public pieChartLabel: string[] = [
		this.translate.instant('workprocess.dangxuly'),
		this.translate.instant('workprocess.hoanthanh'),
		this.translate.instant('workprocess.thatbai'),
	];
	public pieChartOptions = { cutoutPercentage: 80 };
	public pieChartLegend = false;
	public pieChartColor = [{
		backgroundColor: this.listColor,
	}];
	public pieChartType = 'pie';
	public Tongcongviec = 0;

	Trangthai: any[];

	async TrangThai() {
		const queryParams = new QueryParamsModelNew(
			this.filter(),
		);
		this._ProcessWorkService.gettrangthai(queryParams).subscribe(res => {
			if (res && res.status == 1) {
				this.Trangthai = res.data;
				for (var i = 0; i < this.Trangthai.length; i++) {
					this.Trangthai[i].color = this.listColor[i];
				}
				this.pieChartData = this.ElementObjectToArr(this.Trangthai, 'tyle');
			}
			this.changeDetectorRefs.detectChanges();
		});
	}

	ElementObjectToArr(arr, eml) {
		var newArr = [];
		for (let item of arr) {
			newArr.push(item[eml])
		}
		return newArr;
	}

	exportExcel_trangthai() {
		const queryParams = new QueryParamsModelNew(
			this.filter(),
		);
		this._ProcessWorkService.exportExcel_trangthai(queryParams).subscribe(response => {
			var headers = response.headers;
			let filename = headers.get('x-filename');
			let type = headers.get('content-type');
			let blob = new Blob([response.body], { type: type });
			const fileURL = URL.createObjectURL(blob);
			var link = document.createElement('a');
			link.href = fileURL;
			link.download = filename;
			link.click();
		});
	}
	//==========================End Trạng thái nhiệm vụ==========================

	//==========================Start Thời gian hoàn thành========================
	listHoanThanh: any[] = [];

	async ThoiGianHoanThanh() {
		const queryParams = new QueryParamsModelNew(
			this.filter(),
		);
		this._ProcessWorkService.getthoigianhoanthanh(queryParams).subscribe(res => {
			if (res && res.status == 1) {
				if (res.data.length > 0) {
					this.listHoanThanh = res.data;
				} else {
					this.listHoanThanh = [];
				}
			}
			this.changeDetectorRefs.detectChanges();
		});
	}

	//----------Xử lý excel------------------
	exportExcel_thoigianhoanthanh() {
		const queryParams = new QueryParamsModelNew(
			this.filter(),
		);
		this._ProcessWorkService.exportExcel_thoigianhoanthanh(queryParams).subscribe(response => {
			var headers = response.headers;
			let filename = headers.get('x-filename');
			let type = headers.get('content-type');
			let blob = new Blob([response.body], { type: type });
			const fileURL = URL.createObjectURL(blob);
			var link = document.createElement('a');
			link.href = fileURL;
			link.download = filename;
			link.click();
		});
	}

	//==========================End Thời gian hoàn thành==========================

	//==========================Start Lý do thất bại========================
	listLyDoThatBai: any[] = [];

	async LyDoThatBai() {
		const queryParams = new QueryParamsModelNew(
			this.filterNew(0),
		);
		this._ProcessWorkService.getlydothatbai(queryParams).subscribe(res => {
			if (res && res.status == 1) {
				if (res.data.length > 0) {
					this.listLyDoThatBai = res.data;
				} else {
					this.listLyDoThatBai = [];
				}
			}
			this.changeDetectorRefs.detectChanges();
		});
	}

	filterNew(type: number): any {
		const filter: any = {};
		filter.quytrinhid = this.ID_QuyTrinh;
		filter.tungay = this.range.value.start.toJSON();
		filter.denngay = this.range.value.end.toJSON();
		filter.lydoid = type;
		return filter;
	}

	exportExcel_lydothatbai(id: number) {
		const queryParams = new QueryParamsModelNew(
			this.filterNew(id),
		);
		this._ProcessWorkService.exportExcel_lydothatbai(queryParams).subscribe(response => {
			var headers = response.headers;
			let filename = headers.get('x-filename');
			let type = headers.get('content-type');
			let blob = new Blob([response.body], { type: type });
			const fileURL = URL.createObjectURL(blob);
			var link = document.createElement('a');
			link.href = fileURL;
			link.download = filename;
			link.click();
		});
	}
	//==========================End Lý do thất bại==========================

	//==========================Start Lý do hoàn thành========================
	listLyDoHoanThanh: any[] = [];

	async LyDoHoanThanh() {
		const queryParams = new QueryParamsModelNew(
			this.filterNew(1),
		);
		this._ProcessWorkService.getlydothatbai(queryParams).subscribe(res => {
			if (res && res.status == 1) {
				if (res.data.length > 0) {
					this.listLyDoHoanThanh = res.data;
				} else {
					this.listLyDoHoanThanh = [];
				}
			}
			this.changeDetectorRefs.detectChanges();
		});
	}
	//==========================End Lý do hoành thành==========================
	//==========================Start giai đoạn người thực hiện========================
	listGD_NguoiThucHien: any[] = [];

	async GD_NguoiThucHien() {
		this.listGD_NguoiThucHien = [];
		const queryParams = new QueryParamsModelNew(
			this.filter(),
		);
		this._ProcessWorkService.getgiaidoan_nguoithuchien(queryParams).subscribe(res => {
			if (res && res.status == 1) {
				if (res.data.length > 0) {
					res.data.map((item, index) => {
						let data1 = {
							GiaiDoan: item.giaidoan,
							Type: 0,
							IDGiaiDoan: item.idgiaidoan,
						}
						this.listGD_NguoiThucHien.push(data1);
						item.data.map((it) => {
							let data2 = {
								ten: it.ten,
								hoten: it.hoten,
								avatar: it.avatar,
								chucdanh: it.chucdanh,
								solanduocgiao: it.solanduocgiao,
								tgyeucau: it.tgyeucau,
								tglamtrungbinh: it.tglamtrungbinh,
								solanquahan: it.solanquahan,
								tgquahantrungbinh: it.tgquahantrungbinh,
								Type: 1
							}
							this.listGD_NguoiThucHien.push(data2);
						})
					})
				} else {
					this.listGD_NguoiThucHien = [];
				}
			}
			this.changeDetectorRefs.detectChanges();
		});
	}

	exportExcel_nguoithuchientronggiaidoan(id: any) {
		const queryParams = new QueryParamsModelNew(
			this.filter_nguoithuchientronggiaidoan(id),
		);
		this._ProcessWorkService.exportExcel_giaidoan_nguoithuchien(queryParams).subscribe(response => {
			var headers = response.headers;
			let filename = headers.get('x-filename');
			let type = headers.get('content-type');
			let blob = new Blob([response.body], { type: type });
			const fileURL = URL.createObjectURL(blob);
			var link = document.createElement('a');
			link.href = fileURL;
			link.download = filename;
			link.click();
		});
	}
	filter_nguoithuchientronggiaidoan(id): any {
		const filter: any = {};
		filter.quytrinhid = this.ID_QuyTrinh;
		filter.giaidoanid = id;
		filter.tungay = this.range.value.start.toJSON();
		filter.denngay = this.range.value.end.toJSON();
		return filter;
	}
	//==========================End giai đoạn người thực hiện==========================
	//==========================Start người thực hiện========================
	listNguoiThucHien: any[] = [];

	async NguoiThucHien() {
		this.listNguoiThucHien = [];
		const queryParams = new QueryParamsModelNew(
			this.filter(),
		);
		this._ProcessWorkService.getnguoithuchien(queryParams).subscribe(res => {
			if (res && res.status == 1) {
				if (res.data.length > 0) {
					res.data.map((item, index) => {
					})
					this.listNguoiThucHien = res.data;
				} else {
					this.listNguoiThucHien = [];
				}
			}
			this.changeDetectorRefs.detectChanges();
		});
	}

	exportExcel_nguoithuchien() {
		const queryParams = new QueryParamsModelNew(
			this.filter(),
		);
		this._ProcessWorkService.exportExcel_nguoithuchien(queryParams).subscribe(response => {
			var headers = response.headers;
			let filename = headers.get('x-filename');
			let type = headers.get('content-type');
			let blob = new Blob([response.body], { type: type });
			const fileURL = URL.createObjectURL(blob);
			var link = document.createElement('a');
			link.href = fileURL;
			link.download = filename;
			link.click();
		});
	}
	//==========================End người thực hiện==========================
	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 191;
		return tmp_height + 'px';
	}
}
