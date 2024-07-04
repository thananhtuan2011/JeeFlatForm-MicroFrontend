import {
	Component,
	OnInit,
	ElementRef,
	ViewChild,
	ChangeDetectorRef,
	ChangeDetectionStrategy,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
// Material

import { SelectionModel } from "@angular/cdk/collections";
// RXJS
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { BehaviorSubject, ReplaySubject, Subscription, fromEvent, merge } from "rxjs";
//Datasource
//Service


//Model
import { TranslateService } from "@ngx-translate/core";
// Table with EDIT item in new page

import { MatDialog } from "@angular/material/dialog";
import { FormGroup } from "@angular/forms";
import { ThongKeCuocHop2EditComponent } from "../thong-ke-cuoc-hop2-edit/thong-ke-cuoc-hop2-edit.component";
import { ThongKeCuocHopModel } from "../../_models/thong-ke-cuoc-hop-model";
import { PaginatorState } from "../../../../share/models/paginator.model";
import { SortState } from "../../../../share/models/sort.model";
import { GroupingState } from "../../../../share/models/grouping.model";
import { ThongKeCuocHopService } from "../../_services/thong-ke-cuoc-hop.service";
import { LayoutUtilsService, MessageType } from "projects/jeemeet/src/modules/crud/utils/layout-utils.service";
import { QueryParamsModel } from "../../../../models/query-models/query-params.model";
import { DatePipe } from "@angular/common";
import { ThongKeCuocHopViewFileEditComponent } from "../thong-ke-cuoc-hop-view-file-edit/thong-ke-cuoc-hop2-edit.component";


const root = '/ThongKeCuocHopDaXuLy';
@Component({
	selector: "app-thong-ke-cuoc-hop-da-xl-list",
	templateUrl: "./thong-ke-cuoc-hop-list.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThongKeCuocHopDaXLListComponent implements OnInit {
	//show off filter list
	idsDV: any
	keywordChuyenVien: string = ''
	trangthai: string = '0'
	filterTurn: boolean = false;
	filteredDV: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	dataDV: any[] = [];
	searchDV: string = "";
	listIdDV: any[] = [];
	// Table fields
	public nowDate: any
	public startDate: any

	displayedColumns = [];
	R: any = {};
	availableColumns: any = [
		{
			name: "SoThuTu",
			displayname: "Số thứ tự",
			alwaysChecked: false,
			isShow: true,
		},
		{
			name: "MeetingContent",
			displayname: "Tiêu đề cuộc họp",
			alwaysChecked: false,
			isShow: true,
		},
		{
			name: "FullName",
			displayname: "Chuyên viên",
			alwaysChecked: false,
			isShow: true,
		},
		{
			name: "ChucVu",
			displayname: "Chức vụ",
			alwaysChecked: false,
			isShow: true,
		},
		{
			name: "TenPhuongXa",
			displayname: "Đơn vị",
			alwaysChecked: false,
			isShow: true,
		},
		{
			name: "FromTime",
			displayname: "Ngày bắt đầu",
			alwaysChecked: false,
			isShow: true,
		},
		{
			name: "ToDate",
			displayname: "Ngày kết thúc",
			alwaysChecked: false,
			isShow: true,
		},
		{
			name: "Status",
			displayname: "Trạng thái",
			alwaysChecked: false,
			isShow: true,
		},
		{
			name: "TongSoLuongKSCuocHop",
			displayname: "Số phiếu lấy ý kiến",
			alwaysChecked: false,
			isShow: true,
		},
		{
			name: "TongUserThamGia",
			displayname: "Số thành viên tham gia",
			alwaysChecked: false,
			isShow: true,
		}
	];
	selectedColumns = new SelectionModel<any>(true, this.availableColumns);
	@ViewChild("searchInput", { static: true }) searchInput: ElementRef;

	@ViewChild("importtoggle", { static: true }) importtoggle: any;
	filterStatus: string = "";
	filterCondition: string = "";
	filterKeyWord: string = "";
	// Selection
	selection = new SelectionModel<ThongKeCuocHopModel>(true, []);
	QuanLyKhaoSatResult: ThongKeCuocHopModel[] = [];
	resultImport: any;
	showResultImport: boolean = false;
	listPage: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(
		Array.from(new Array(10), (val, index) => index)
	);

	keyword: string = "";
	keywordSoKyHieu: string = "";
	loadingSubject = new BehaviorSubject<boolean>(false);
	filterGroup: FormGroup;
	searchGroup: FormGroup;
	paginator: PaginatorState;
	sorting: SortState;
	grouping: GroupingState;
	isLoading: boolean = false;
	listChuyenMuc: any[] = [];
	currentMsgFromChild1ToChild2 = 0;
	toggleresult: boolean = false;
	private subscriptions: Subscription[] = [];
	constructor(
		public thongKeCuocHopService: ThongKeCuocHopService,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private router: Router,
		// private subheaderService: SubheaderService,
		private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
		// private TokenStorage: TokenStorage
		private datePipe: DatePipe
	) { }

	/** LOAD DATA */
	ngOnInit(): void {

		// this.loadDataList()
		this.grouping = this.thongKeCuocHopService.grouping;
		this.paginator = this.thongKeCuocHopService.paginator;
		this.sorting = this.thongKeCuocHopService.sorting;
		const sb = this.thongKeCuocHopService.isLoading$.subscribe((res) => (this.isLoading = res));
		this.subscriptions.push(sb);

		this.GetListDV();

	}


	GetListDV() {
		this.thongKeCuocHopService.GetListDonVi().subscribe(
			(res: any) => {
				if (res) {
					this.listIdDV = res.data.flat;
					this.filteredDV.next(this.listIdDV);
					this.changeDetectorRefs.detectChanges();
				}
			}
		);

	}
	paginate(paginator: PaginatorState) {
		let filter = this.filterConfiguration();
		this.thongKeCuocHopService.patchState({ paginator, filter }, root);
	}

	loadDataList() {

		//this.ThongKeVangCuocHopService.fetch();
		const filter = this.filterConfiguration();
		filter.tungay = this.datePipe.transform(this.startDate, "dd-MM-yyyy");
		filter.denngay = this.datePipe.transform(this.nowDate, "dd-MM-yyyy");
		this.thongKeCuocHopService.patchState({ filter }, root);

	}


	/** FILTRATION */
	filterConfiguration(): any {
		const filter: any = {};
		if (this.keyword != "") {
			filter["keyword"] = this.keyword;
		}
		if (this.keywordChuyenVien != "") {
			filter["keywordChuyenVien"] = this.keywordChuyenVien;
		}
		if (this.keywordSoKyHieu != "") {
			filter["keywordSoKyHieu"] = this.keywordSoKyHieu;
		}
		if (this.trangthai != "") {
			filter["trangthai"] = this.trangthai;
		}
		if (this.idsDV != "" && this.idsDV != undefined) {
			filter["idsDV"] = this.idsDV.join(",");
		}
		filter.tungay = this.datePipe.transform(this.startDate, "dd-MM-yyyy");
		filter.denngay = this.datePipe.transform(this.nowDate, "dd-MM-yyyy");
		return filter;
	}
	changeSelection() {
		let filter = this.filterConfiguration();

		this.thongKeCuocHopService.patchState({ filter }, root);

	}
	changeEvent() {
		this.loadDataList();

	}


	//Apply selected Column
	IsAllColumnsChecked() {
		const numSelected = this.selectedColumns.selected.length;
		const numRows = this.availableColumns.length;
		return numSelected === numRows;
	}
	// getStringFromHtml(text) {
	// 	return text.replace(/\r?\n|\r/g, '<br>');

	// }
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

	menuChange(e: any, type: 0 | 1 = 0) {
		// this.layoutUtilsService.menuSelectColumns_On_Off();
	}

	/*filter theo Trạng thái */
	filterbyStatus(): number {

		return Number(this.filterStatus);
	}



	/** SELECTION */
	isAllSelected() {
		const numSelected = this.selection.selected.length;
		const numRows = this.QuanLyKhaoSatResult.length;
		return numSelected === numRows;
	}

	/** Selects all rows if they are not all selected; otherwise clear selection. */
	masterToggle() {
		if (this.isAllSelected()) {
			this.selection.clear();
		} else {
			this.QuanLyKhaoSatResult.forEach((row) =>
				this.selection.select(row)
			);
		}
	}
	/* UI */
	getItemStatusString(status: number = 0): string {
		switch (status) {
			case 0:
				return "Inactive";
			case 1:
				return "Active";
		}
		return "";
	}

	getItemCssClassByStatus(status: string): string {
		switch (status) {
			case "Kích hoạt":
				return "metal";
			case "Bị khóa":
				return "success";
		}
		return "";
	}

	/**
	 * Show add QuanLyKhaoSat dialog
	 */
	// addQuanLyKhaoSat() {
	// 	const newQuanLyKhaoSat = new ThongKeCuocHopModel();
	// 	newQuanLyKhaoSat.clear(); // Set all defaults fields
	// 	this.editQuanLyKhaoSat(newQuanLyKhaoSat);
	// }


	// viewQuanLyKhaoSat(item,type:number) {

	// 	//We call the event emmiter function from our service and pass in the details;
	// 	item.UserId=item.UserId;
	// 	item.RowID=item.RowID;
	// 	item.type=type;
	// 	const dialogRef = this.dialog.open(ThongKeCuocHopEditComponent, {
	// 		data: { item },
	// 		width: "900px",
	// 	});
	// 	dialogRef.afterClosed().subscribe(res => {
	// 		if (!res) {
	// 		  return;
	// 		}
	// 		this.loadDataList();
	// 	  });
	// }

	/**
	 * Show Edit QuanLyKhaoSat dialog and save after success close result
	 * @param QuanLyKhaoSat: ThongKeCuocHopModel
	 */
	// editQuanLyKhaoSat(QuanLyKhaoSat: ThongKeCuocHopModel) {
	// 	let saveMessageTranslateParam = "ECOMMERCE.CUSTOMERS.EDIT.";
	// 	saveMessageTranslateParam +=QuanLyKhaoSat.UserId > 0 ? "UPDATE_MESSAGE" : "ADD_MESSAGE";
	// 	const _saveMessage = this.translate.instant(saveMessageTranslateParam);
	// 	const _messageType =QuanLyKhaoSat.UserId > 0 ? MessageType.Update : MessageType.Create;
	// 	const dialogRef = this.dialog.open(ThongKeCuocHopEditComponent, {
	// 		data: { QuanLyKhaoSat },
	// 		width: "900px",
	// 	});
	// 	dialogRef.afterClosed().subscribe((res) => {
	// 		if (!res) {
	// 			return;
	// 		}

	// 		this.loadQuanLyCuocHop();
	// 	});
	// }

	restoreState(queryParams: QueryParamsModel) {
		if (!queryParams.filter) {
			return;
		}
		if (queryParams.filter) {
			this.searchInput.nativeElement.value =
				queryParams.filter.flt_search == undefined
					? ""
					: queryParams.filter.flt_search;
			this.filterKeyWord = this.searchInput.nativeElement.value;
		}
	}

	// getBreadcrumb(href, title) {
	// 	this.layoutUtilsService.getBreadcrumb(href).subscribe((res) => {
	// 		let groupname = "";
	// 		if (res) {
	// 			groupname = res;
	// 		}
	// 		// // Set title to page breadCrumbs
	// 		this.subheaderService.setTitle(groupname);
	// 		this.subheaderService.setBreadcrumbs([
	// 			{ title: title, page: `/` + href },
	// 		]);
	// 	});
	// }

	// viewDetail(item) {

	// 	//We call the event emmiter function from our service and pass in the details;
	// 	item.id=item.UserID;
	// 	const dialogRef = this.dialog.open(ThongKeCuocHopEditComponent, {
	// 		data: { item },
	// 		width: "900px",
	// 	});
	// 	dialogRef.afterClosed().subscribe((res) => {});
	// }
	viewDetail2(item) {


		//We call the event emmiter function from our service and pass in the details;
		item.id = item.UserId;
		const dialogRef = this.dialog.open(ThongKeCuocHop2EditComponent, {
			data: { item },
			width: "500px",
		});
		dialogRef.afterClosed().subscribe((res) => { });
	}


	viewDetailFile(item, title, type) {
		item.id = item.UserId;
		item.title = title;
		this.thongKeCuocHopService.GetDetail_DuyetByIdCH(item.RowID).subscribe(res => {
			if (res.status == 1) {
				const dialogRef = this.dialog.open(ThongKeCuocHopViewFileEditComponent, {
					data: { item: res.data[0], title, type },
					width: "900px",
				});
				dialogRef.afterClosed().subscribe((res) => { });
			}
		});

	}

	fwdMsgToSib2($event) {
		this.currentMsgFromChild1ToChild2 = $event;
	}



	filterExcel(): any {
		const filter: any = {};
		filter.page = this.paginator.page;
		filter.record = this.paginator.pageSize;
		filter.tungay = this.datePipe.transform(this.startDate, "dd-MM-yyyy");
		filter.denngay = this.datePipe.transform(this.nowDate, "dd-MM-yyyy");
		if (this.keyword != "") {
			filter["keyword"] = this.keyword;
		}
		if (this.keywordChuyenVien != "") {
			filter["keywordChuyenVien"] = this.keywordChuyenVien;
		}
		if (this.keywordSoKyHieu != "") {
			filter["keywordSoKyHieu"] = this.keywordSoKyHieu;
		}
		if (this.trangthai != "") {
			filter["trangthai"] = this.trangthai;
		}
		if (this.idsDV != "" && this.idsDV != undefined) {
			filter["idsDV"] = this.idsDV.join(",");
		}
		return filter;
	}
	xuatExcel() {

		let filter = this.filterExcel();
		var request = new XMLHttpRequest();
		this.thongKeCuocHopService.exportExcelDetail(filter).subscribe(res => {
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

	selectDonVi(e: any) {
		let datatam = [];
		// this.changeDonVi = false;
		// e.value.forEach(element => {
		// 	let input = this.listIdDV.filter((item) => item.RowID == element);
		// 	let inputDrop = {
		// 		RowID: input[0].RowID,
		// 		DepartmentName: input[0].DepartmentName,
		// 		IsDel: false,
		// 	};
		// 	datatam.push(inputDrop);
		// });
		// this.dataSourceDV = datatam.filter((x) => !x.IsDel);
		// if (this.dataSourceDV && this.dataSourceDV.length > 0) {
		// 	var flags = [], outputId = [], l = this.dataSourceDV.length, i;
		// 	for (i = 0; i < l; i++) {
		// 		if (flags[this.dataSourceDV[i].RowID]) continue;
		// 		flags[this.dataSourceDV[i].RowID] = true;
		// 		outputId.push(this.dataSourceDV[i].RowID);
		// 	}
		// 	this.inputId = outputId;
		// }
		// if (JSON.stringify(this.dataSourceDV) != JSON.stringify(this.dataSourceDVcheck)) {
		// 	this.changeDonVi = true;
		// 	this.changeDetect.detectChanges();
		// }
	}

	filterSEARCH() {
		if (!this.listIdDV) {
			return;
		}
		let search = this.searchDV;
		if (!search) {
			this.filteredDV.next(this.listIdDV.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filteredDV.next(
			this.listIdDV.filter(ts =>
				ts.DepartmentName.toLowerCase().indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();
	}

	togglegroupfilter() {
		this.filterTurn = !this.filterTurn;
		this.changeDetectorRefs.detectChanges();
		var height;
		let cardbody = document.getElementById("cardbody");
		let header = document.getElementById("cardbodyhead");
		let tmp_height = 0;
		tmp_height = window.innerHeight - 236;
		cardbody.style.height = tmp_height + "px";
		height =
			window.innerHeight -
			header.clientHeight -
			(window.innerHeight - cardbody.clientHeight);
		if (this.filterTurn) {
			cardbody.style.height = height + 30 + "px";
			this.changeDetectorRefs.detectChanges();
		} else {
			tmp_height = window.innerHeight - 280;
			cardbody.style.height = tmp_height + 'px';
		}
	}

	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 280;
		return tmp_height + 'px';
	}

	getHeightEmty(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 230;
		return tmp_height + 'px';
	}

	Detail(evt: any, id: any) {
		if (id.DaXacNhanUyQuyenTuHaiBen == 0 && id.NguoiDuocUyQuyen == 1)
			evt.stopPropagation();
		return;
	}
	danhDauDaXuLy(item) {
		const _title: string = 'Xác nhận hủy lưu trữ cuộc họp ';
		const _description: string = 'Bạn có chắc muốn đưa cuộc họp này vào danh sách hiển thị?';
		const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, '', false);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.thongKeCuocHopService.danhDauDaXuLy(item.RowID).subscribe((res: any) => {
				if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(
						'Hủy lưu trữ thành công',
						MessageType.Read,
						4000,
						true,
						false,
						3000,
						"top"
					);
					this.loadDataList();
					this.changeDetectorRefs.detectChanges()
				} else {
					this.layoutUtilsService.showActionNotification(
						res.error.message,
						MessageType.Read,
						9999999999,
						true,
						false,
					);
					this.changeDetectorRefs.detectChanges()
				}
			});
		});

	}

}
