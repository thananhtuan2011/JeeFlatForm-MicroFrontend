import { SelectionModel } from "@angular/cdk/collections";
import { CdkDragDrop, CdkDragStart } from "@angular/cdk/drag-drop";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ContextMenuComponent, ContextMenuService } from "ngx-contextmenu";
import { BehaviorSubject, merge } from "rxjs";
import { ImportXepCaLamViecComponent } from "../import-xep-ca-lam-viec/import-xep-ca-lam-viec.component";
import { ThayDoiCaLamViecNewModel } from "../Model/xep-ca-lam-viec.model";
import { XepCaLamViecService } from "../Services/xep-ca-lam-viec.service";
import { DownloadCameraHanetComponent } from "../download-camera-hanet/download-camera-hanet.component";
import { QueryParamsModelNew } from "../../../models/query-models/query-params.model";
import { LayoutUtilsService, MessageType } from "projects/jeehr/src/modules/crud/utils/layout-utils.service";
import { DanhMucChungService } from "../../../services/danhmuc.service";

@Component({
	selector: 'kt-xep-ca-lam-viec-list',
	templateUrl: './xep-ca-lam-viec-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class XepCaLamViecListComponent implements OnInit {
	@ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: true }) sort: MatSort;
	// Table fields
	loadingSubject = new BehaviorSubject<boolean>(false);
	loadingControl = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	hasFormErrors: boolean = false;
	// Selection
	selection = new SelectionModel<any>(true, []);
	productsResult: any[] = [];
	//======================================
	loadingAfterSubmit: boolean = false;
	viewLoading: boolean = false;
	//======================================
	public datatree: BehaviorSubject<any[]> = new BehaviorSubject([]);
	hoTen: string;
	idCoCau: number = 0;
	listChucDanh: any[] = [];
	idChucDanh: number = 0;
	idChucVu: number = 0;
	listChucVu: any[] = [];
	filterLBC: string = '2';//0 Tháng; 1 Tuần; 2 Ngày
	filterNgay: string = '';
	filterThang: string = '';
	filterNam: string = '';
	Data_Day: any[] = [];
	//======================================================
	listHeader: any[] = [];
	listData: any[] = [];
	listCaLamViec: any[] = [];
	_loading: boolean = false;
	showData: boolean = true;
	pageSize: number = 50;
	totalCount: number;
	CustemerID: number = 0;
	showBT: boolean = false;
	selected: any;
	@ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
	@ViewChild(ContextMenuComponent) public basicMenuDay: ContextMenuComponent;
	id_menu: number = 11;

	constructor(
		public _XepCaLamViecService: XepCaLamViecService,
		private danhMucChungService: DanhMucChungService,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private changeDetectorRefs: ChangeDetectorRef,
		public layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private contextMenuService: ContextMenuService,
		private contextMenuDayService: ContextMenuService,
	) { }

	/** LOAD DATA */
	ngOnInit() {
		this.loadData();
		this.dateCur = new Date();
		this.filterNgay = '' + this.dateCur.getDate();
		this.filterThang = '' + (this.dateCur.getMonth() + 1);
		this.filterNam = '' + this.dateCur.getFullYear();
		this.CreateDay();
	}


	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	stopPropagation(event) {
		event.stopPropagation();
	}

	loadData() {
		this.danhMucChungService.getCoCauTheoQuyenXepCa().subscribe(res => {
			if (res && res.status == 1) {
				this.datatree.next(res.data);
			}
		});

		this.danhMucChungService.GetListCaLamViec().subscribe(res => {
			this.listCaLamViec = res.data;
		});
	}

	GetValueNode(val: any) {
		this.idCoCau = val.RowID;
		this.idChucDanh = 0;
		this.idChucVu = 0;
		this.danhMucChungService.getListPositionbyStructure_All(+this.idCoCau).subscribe(res => {
			if (res && res.status == 1) {
				this.listChucDanh = res.data;
			}
		})
	}

	loadChucVu() {
		this.idChucVu = 0;
		this.danhMucChungService.getListJobtitleByStructure_All(+this.idChucDanh, +this.idCoCau).subscribe(res => {
			if (res && res.status == 1) {
				this.listChucVu = res.data;
			}
		})
	}

	loadDataListDay(page: boolean = false) {
		const queryParams = new QueryParamsModelNew(
			this.filterConfiguration(),
			'',
			'',
			0,
			100,
			true
		);
		this.layoutUtilsService.showWaitingDiv();
		this._XepCaLamViecService.loadDay(queryParams).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			this._XepCaLamViecService.Visible = res.Visible;
			if (res && res.status == 1) {
				if (res.data.length > 0) {
					this.Data_Day = res.data;
				}
				else {
					this.Data_Day = [];
				}
			} else {
				this.Data_Day = [];
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
			this.changeDetectorRefs.detectChanges();
		})
	}


	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		// filter.date = this.data._date;
		if (this.idCoCau > 0)
			filter.StructureID = this.idCoCau;
		if (this.idChucDanh > 0)
			filter.jobTitleId = this.idChucDanh;
		if (this.idChucVu > 0)
			filter.positionId = this.idChucVu;
		filter.TenNV = this.hoTen;
		if (this.filterLBC == "0") {
			filter.Thang = this.filterThang;
			filter.Nam = this.filterNam;
		} else {
			filter.date = this.Ngay;
		}
		filter.IDLoai = "0";
		return filter;
	}

	timKiem() {
		if (this.filterLBC == "0") {
			this.loadDataList();
		} else if (this.filterLBC == "1") {
			this.loadDataList();
		} else {
			this.loadDataListDay();
		}
	}

	clickLBC(val) {
		this.filterLBC = val;
		this.dateCur = new Date();
		this.filterNgay = '' + this.dateCur.getDate();
		this.filterThang = '' + (this.dateCur.getMonth() + 1);
		this.filterNam = '' + this.dateCur.getFullYear();
		if (this.filterLBC == "0") {
			this.CreateMonth();
		} else if (this.filterLBC == "1") {
			this.CreateWeek();
		} else {
			this.CreateDay();
		}
		this.changeDetectorRefs.detectChanges();
	}
	//=============================================================================
	getWidth(): any {
		let tmp_height = 0;
		tmp_height = window.innerWidth - 305 - 70;
		return tmp_height + 'px';
	}

	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 40;
		return tmp_height + 'px';
	}

	getHeightKB(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 120;
		return tmp_height + 'px';
	}

	getHeightDTS(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 190;
		return tmp_height + 'px';
	}
	//========================================================================
	TitleCalendar: string;
	dateCur: Date;
	//Xử lý cho trường hợp lịch ngày
	Ngay: string;
	CreateDay() {
		var today, todayNumber, mondayNumber, sundayNumber, monday, sunday;
		today = new Date(this.dateCur);
		monday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
		this.Ngay = this.dateCur.getDate() + "/" + (this.dateCur.getMonth() + 1) + "/" + this.dateCur.getFullYear();
		this.XuLyDate(monday, sunday);
		this.loadDataListDay();
	}

	XuLyDate(firstday, lastday) {
		this.TitleCalendar = firstday.getDate() + " tháng " + (firstday.getMonth() + 1) + ", " + firstday.getFullYear();
	}

	//Xử lý cho trường hợp lịch tuần
	CreateWeek() {
		var today, todayNumber, mondayNumber, sundayNumber, monday, sunday;
		today = new Date(this.dateCur);
		todayNumber = today.getDay();
		if (todayNumber > 0) {
			mondayNumber = 1 - todayNumber;
			sundayNumber = 7 - todayNumber;
		} else {
			mondayNumber = todayNumber - 6;
			sundayNumber = todayNumber;
		}
		monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayNumber);
		sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + sundayNumber);
		this.XuLyWeek(monday, sunday);
		this.loadDataList();
	}

	XuLyWeek(firstday, lastday) {
		let date = new Date();
		if (firstday.getFullYear() == lastday.getFullYear()) {
			if ((firstday.getMonth() + 1) == lastday.getMonth() + 1) {
				this.TitleCalendar = firstday.getDate() + " - " + lastday.getDate() + " tháng " + (lastday.getMonth() + 1) + ", " + lastday.getFullYear();
			} else {
				this.TitleCalendar = firstday.getDate() + " tháng " + (firstday.getMonth() + 1) + " - " + lastday.getDate() + " tháng " + (lastday.getMonth() + 1) + ", " + lastday.getFullYear();
			}
		} else {
			this.TitleCalendar = firstday.getDate() + "/" + (firstday.getMonth() + 1) + " - " + lastday.getDate() + "/" + (lastday.getMonth() + 1) + (date.getFullYear() == lastday.getFullYear() ? "" : "/" + lastday.getFullYear());
		}
	}
	//Xử lý cho trường hợp lịch tháng
	CreateMonth() {
		var today;
		today = new Date(this.dateCur);
		this.XuLyDateMonth(today);
		this.loadDataList();
	}

	XuLyDateMonth(today) {
		this.TitleCalendar = "Tháng " + (today.getMonth() + 1) + " năm " + today.getFullYear();
	}

	Before() {
		var today, todayNumber, mondayNumber, sundayNumber, monday, sunday;
		if (this.filterLBC == "0") {
			today = new Date(this.dateCur.setMonth(this.dateCur.getMonth() - 1));
			this.XuLyDateMonth(today);
			this.filterThang = '' + (today.getMonth() + 1);
			this.filterNam = '' + today.getFullYear();
			this.loadDataList();
		} else if (this.filterLBC == "1") {
			today = new Date(this.dateCur.setDate(this.dateCur.getDate() - 7));
			todayNumber = today.getDay();
			if (todayNumber > 0) {
				mondayNumber = 1 - todayNumber;
				sundayNumber = 7 - todayNumber;
			} else {
				mondayNumber = todayNumber - 6;
				sundayNumber = todayNumber;
			}
			monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayNumber);
			sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + sundayNumber);
			this.XuLyWeek(monday, sunday);
			this.Ngay = this.dateCur.getDate() + "/" + (this.dateCur.getMonth() + 1) + "/" + this.dateCur.getFullYear();
			this.loadDataList();
		} else {
			today = new Date(this.dateCur.setDate(this.dateCur.getDate() - 1));
			this.XuLyDate(today, today);
			this.Ngay = this.dateCur.getDate() + "/" + (this.dateCur.getMonth() + 1) + "/" + this.dateCur.getFullYear();
			this.filterNgay = '' + today.getDate();
			this.filterThang = '' + (today.getMonth() + 1);
			this.filterNam = '' + today.getFullYear();
			this.loadDataListDay();
		}
	}

	Next() {
		var today, todayNumber, mondayNumber, sundayNumber, monday, sunday;
		if (this.filterLBC == "0") {
			today = new Date(this.dateCur.setMonth(this.dateCur.getMonth() + 1));
			this.XuLyDateMonth(today);
			this.filterThang = '' + (today.getMonth() + 1);
			this.filterNam = '' + today.getFullYear();
			this.loadDataList();
		} else if (this.filterLBC == "1") {
			today = new Date(this.dateCur.setDate(this.dateCur.getDate() + 7));
			todayNumber = today.getDay();
			if (todayNumber > 0) {
				mondayNumber = 1 - todayNumber;
				sundayNumber = 7 - todayNumber;
			} else {
				mondayNumber = todayNumber - 6;
				sundayNumber = todayNumber;
			}
			monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + mondayNumber);
			sunday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + sundayNumber);
			this.XuLyWeek(monday, sunday);
			this.Ngay = this.dateCur.getDate() + "/" + (this.dateCur.getMonth() + 1) + "/" + this.dateCur.getFullYear();
			this.loadDataList();
		} else {
			today = new Date(this.dateCur.setDate(this.dateCur.getDate() + 1));
			this.XuLyDate(today, today);
			this.Ngay = this.dateCur.getDate() + "/" + (this.dateCur.getMonth() + 1) + "/" + this.dateCur.getFullYear();
			this.filterNgay = '' + today.getDate();
			this.filterThang = '' + (today.getMonth() + 1);
			this.filterNam = '' + today.getFullYear();
			this.loadDataListDay();
		}
	}

	ToDay() {
		if (this.filterLBC == "2") {
			this.dateCur = new Date();
			this.filterNgay = '' + this.dateCur.getDate();
			this.filterThang = '' + (this.dateCur.getMonth() + 1);
			this.filterNam = '' + this.dateCur.getFullYear();
			this.CreateDay();
		}
	}

	previousIndex: number;

	dragStart(event: CdkDragStart, index: number) {
		if (!this._XepCaLamViecService.Visible)
			return;
		this.previousIndex = index;
		event.source.dropContainer.connectedTo = event.source.dropContainer.data[index].Scope; // Đổi connec khi chọn 1 nhiệm vụ di chuyển
	}

	drop(event: CdkDragDrop<any[]>) {
		if (!this._XepCaLamViecService.Visible)
			return;
		if (event.container.id != event.previousContainer.id) {
			let val = this.listCaLamViec.find(x => +x.ID_Row == +event.container.id);
			this.listNhanVien = [];
			this.listDataDoiCa = [];
			this.listNgay = [];
			if (this.basicMenuDay && val != undefined) {
				this.listNhanVien.push({ id_nv: event.previousContainer.data[this.previousIndex].staffId });
				this.listNhanVien.map((item, index) => {
					const ts = new ThayDoiCaLamViecNewModel();
					ts.ID_NV = item.id_nv;
					this.listNgay.push(this.filterNam + "/" + this.filterThang + "/" + this.filterNgay);
					ts.ListNgay = this.listNgay;
					ts.IsKhongTinhCN = false;
					if (val == "") {
						ts.ID_CaLamViec = "";
						ts.CaLamViec = "Không xếp ca";
					} else if (val == "-2") {
						ts.ID_CaLamViec = "-2";
						ts.CaLamViec = "Nghỉ lễ 1 ngày";
					}
					else if (val == "-3") {
						ts.ID_CaLamViec = "-3";
						ts.CaLamViec = "Nghỉ lễ 0.5 ngày";
					}
					else if (val == "0") {
						ts.ID_CaLamViec = "0";
						ts.CaLamViec = "Reset";
					} else {
						ts.ID_CaLamViec = val.ID_Row;
						ts.CaLamViec = val.Title;
					}
					this.listDataDoiCa.push(ts);
				});
				this.UpdateItem(this.listDataDoiCa);
			}
		}
	}
	//============================================================
	//============================================Xét style CSS=================================
	height: number = 1200;
	onScroll($event) {
		let _scroll = 1200;
		let _height = _scroll + $event.currentTarget.scrollTop;
		this.height = _height;
	}
	//===============================================================================
	loadDataList(page: boolean = false) {
		this._loading = true;
		this.selection.clear();
		const queryParams = new QueryParamsModelNew(
			this.filterConfiguration(),
			'',
			'',
			this.paginator != undefined ? page ? this.paginator.pageIndex : this.paginator.pageIndex = 0 : 0,
			this.paginator != undefined ? this.paginator.pageSize : this.pageSize
		);
		this.layoutUtilsService.showWaitingDiv();
		this._XepCaLamViecService.findData(queryParams).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			if (res && res.status == 1) {
				this.showData = false;
				this.CustemerID = res.CustemerID;
				this._XepCaLamViecService.Visible = res.Visible;
				this.listHeader = [];
				if (res.data && res.data.length > 0) {
					this.showBT = true;
					this.listData = res.data;
					this.totalCount = res.page.TotalCount;
					res.data[0].Data.map((item, index) => {
						this.listHeader.push(
							{
								Ngay: '' + item.Ngay,
							});
					})

				} else {
					this.showBT = false;
					this.showData = true;
				}
				this.changeDetectorRefs.detectChanges();
			} else {
				this.showBT = false;
				this.showData = true;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		})

	}

	ChangePage(val) {
		this.selection.clear();
		this.paginator.pageIndex = val.pageIndex;
		this.paginator.pageSize = val.pageSize;
		const queryParams = new QueryParamsModelNew(
			this.filterConfiguration(),
			'',
			'',
			val.pageIndex,
			val.pageSize,
		);
		this.layoutUtilsService.showWaitingDiv();
		this._XepCaLamViecService.findData(queryParams).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			this._loading = false
			if (res && res.status == 1) {
				this.showData = false;
				this._XepCaLamViecService.Visible = res.Visible;
				this.listHeader = [];
				this.listData = [];
				if (res.data.length > 0) {
					this.showBT = true;
					this.listData = res.data;
					this.totalCount = res.page.TotalCount;
					res.data[0].Data.map((item, index) => {
						this.listHeader.push(
							{
								Ngay: '' + item.Ngay,
							});
					})

				} else {
					this.totalCount = 0;
					this.showData = true;
				}
				this.changeDetectorRefs.detectChanges();
			} else {
				this.showData = true;
			}
		})
	}

	listDataDoiCa: ThayDoiCaLamViecNewModel[] = [];
	listNhanVien: any[] = [];
	listNgay: any[] = [];
	XepCaLamViec(val: any, data: any) {
		this.listNhanVien = [];
		this.listDataDoiCa = [];
		if (data.length > 0 && val != undefined) {
			data.map((item, index) => {
				let nv = this.listNhanVien.find(x => +x.id_nv === +item.ID_NV);
				if (!nv) {
					this.listNhanVien.push({ id_nv: item.ID_NV });
				}
			});
			this.listNhanVien.map((item, index) => {
				const ts = new ThayDoiCaLamViecNewModel();
				ts.ID_NV = item.id_nv;
				this.listNgay = [];
				let data_ngay = data.filter(x => +x.ID_NV == +item.id_nv);
				if (data_ngay) {
					data_ngay.map((it, index) => {
						this.listNgay.push(it.Nam + "/" + it.Thang + "/" + it.Ngay);
					})
					ts.ListNgay = this.listNgay;
				}
				ts.IsKhongTinhCN = false;
				if (val == "") {
					ts.ID_CaLamViec = "";
					ts.CaLamViec = "Không xếp ca";
				} else if (val == "-2") {
					ts.ID_CaLamViec = "-2";
					ts.CaLamViec = "Nghỉ lễ 1 ngày";
				}
				else if (val == "-3") {
					ts.ID_CaLamViec = "-3";
					ts.CaLamViec = "Nghỉ lễ 0.5 ngày";
				}
				else if (val == "0") {
					ts.ID_CaLamViec = "0";
					ts.CaLamViec = "Reset";
				} else {
					ts.ID_CaLamViec = val.ID_Row;
					ts.CaLamViec = val.Title;
				}
				this.listDataDoiCa.push(ts);
			});
			this.UpdateItem(this.listDataDoiCa);
		}
	}

	XepCaLamViecDay(val: any) {
		if (!this._XepCaLamViecService.Visible)
			return;
		this.listNhanVien = [];
		this.listDataDoiCa = [];
		this.listNgay = [];
		if (this.basicMenuDay && val != undefined) {
			this.listNhanVien.push({ id_nv: this.basicMenuDay.item.staffId });
			this.listNhanVien.map((item, index) => {
				const ts = new ThayDoiCaLamViecNewModel();
				ts.ID_NV = item.id_nv;
				this.listNgay.push(this.filterNam + "/" + this.filterThang + "/" + this.filterNgay);
				ts.ListNgay = this.listNgay;
				ts.IsKhongTinhCN = false;
				if (val == "") {
					ts.ID_CaLamViec = "";
					ts.CaLamViec = "Không xếp ca";
				} else if (val == "-2") {
					ts.ID_CaLamViec = "-2";
					ts.CaLamViec = "Nghỉ lễ 1 ngày";
				}
				else if (val == "-3") {
					ts.ID_CaLamViec = "-3";
					ts.CaLamViec = "Nghỉ lễ 0.5 ngày";
				}
				else if (val == "0") {
					ts.ID_CaLamViec = "0";
					ts.CaLamViec = "Reset";
				} else {
					ts.ID_CaLamViec = val.ID_Row;
					ts.CaLamViec = val.Title;
				}
				this.listDataDoiCa.push(ts);
			});
			this.UpdateItem(this.listDataDoiCa);
		}
	}

	UpdateItem(item: ThayDoiCaLamViecNewModel[]) {
		this.viewLoading = true;
		this.layoutUtilsService.showWaitingDiv();
		this._XepCaLamViecService.Update_CaLamViec(item).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			if (res && res.status === 1) {
				const _messageType = this.translate.instant('landingpagekey.capnhatthanhcong');
				this.layoutUtilsService.showActionNotification(_messageType, MessageType.Create, 4000, true, false);
				this.selection.clear();
				this.timKiem();
				this.changeDetectorRefs.detectChanges();
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	onRightClick(event: any, item: any) {
		this.onContextMenu(event, item);
	}

	public onContextMenu($event: MouseEvent, item: any): void {
		if (item.length == 0 || !this._XepCaLamViecService.Visible) { return; }
		this.contextMenuService.show.next({
			// Optional - if unspecified, all context menu components will open
			contextMenu: this.basicMenu,
			event: $event,
			item: item,
		});
		$event.preventDefault();
		$event.stopPropagation();
	}

	onRightClickDay(event: any, item: any) {
		this.onContextMenuDay(event, item);
	}

	public onContextMenuDay($event: MouseEvent, item: any): void {
		if (!item || !this._XepCaLamViecService.Visible) { return; }
		this.contextMenuDayService.show.next({
			// Optional - if unspecified, all context menu components will open
			contextMenu: this.basicMenuDay,
			event: $event,
			item: item,
		});
		$event.preventDefault();
		$event.stopPropagation();
	}

	Import_Excel() {
		const dialogRef = this.dialog.open(ImportXepCaLamViecComponent, { data: { _thang: this.filterThang, _nam: this.filterNam }, width: '40%', panelClass: ['sky-padding-0'] });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			if (this.filterLBC == "0") {
				this.loadDataList();
			} else if (this.filterLBC == "1") {
				this.loadDataList();
			} else {
				this.loadDataListDay();
			}
		});
	}

	downloadCamera() {
		const dialogRef = this.dialog.open(DownloadCameraHanetComponent, { data: { }, width: '40%', panelClass: ['sky-padding-0'] });
		dialogRef.afterClosed().subscribe(res => {
		});
	}
}
