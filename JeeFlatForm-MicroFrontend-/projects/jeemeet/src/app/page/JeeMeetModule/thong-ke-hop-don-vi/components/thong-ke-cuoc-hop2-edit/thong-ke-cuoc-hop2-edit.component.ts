import { PaginatorState } from './../../../../../../../../jeesupport/src/app/page/_models/paginator.model';
// Angular
import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Inject,
	ViewChild,
	ElementRef,
} from "@angular/core";
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from "rxjs";
// Material

import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { SortState } from '../../../../share/models/sort.model';
import { GroupingState } from '../../../../share/models/grouping.model';
import { ThongKeCuocHopModel } from '../../_models/thong-ke-cuoc-hop-model';
import { LayoutUtilsService } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { ThongKeCuocHop2Service } from '../../_services/thong-ke-cuoc-hop2.service';



const root = '/ThongKeCuocHop_DetailUser';
@Component({
	selector: "kt-thong-ke-cuoc-hop2-edit.component",
	templateUrl: "./thong-ke-cuoc-hop2-edit.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThongKeCuocHop2EditComponent implements OnInit {
	listGroupDept: any = []
	listGroupDeptOrigin: any = []
	toppings = new FormControl("");
	// Public properties
	QuanLyCuocHop: any = {};
	QuanLyCuocHopForm: FormGroup;
	hasFormErrors: boolean = false;
	filterStatic: Observable<string[]>;
	ListTieuChiPL3: any[] = [];
	isShowImage: boolean = false;
	IsXem: boolean = false;
	IsDel: boolean = false;
	viewLoading: boolean = false;
	@ViewChild("inputSDT", { static: true }) inputSDT: ElementRef;
	@ViewChild("scrollMe", { static: true }) myScrollContainer: ElementRef;
	@ViewChild("sort", { static: true }) sort: MatSort;
	// @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	accs: any[] = [];
	searcTieuChiDTI: string = "";
	dataNguoiDung: any[] = [];
	searchNguoiDung: string = "";
	filteredNguoiDungs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	filteredTieuChiPL3s: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	filteredndchs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	listPage: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(
		Array.from(new Array(10), (val, index) => index)
	);
	// Private password
	selectIDCuocHop: string = "0";
	IdCuocHop: string = "0";
	DSDanhGiaTam: any[] = [];
	DSCauHoi: any[] = [];
	DSCauHoiTam: any[] = [];
	ListFileDinhKem: any[] = [];
	displayedColumns = [];
	private componentSubscriptions: Subscription;
	DataResult: any[] = [];
	files: any[] = [{ data: {} }];
	ListFile: any[] = [];
	lstDVXLSelected: any[] = [];
	file: string = "";
	file1: string = "";
	file2: string = "";
	lstCuocHop: any[] = [];
	RowID: number = 1;
	filterGroup: FormGroup;
	searchGroup: FormGroup;
	paginator: PaginatorState;
	sorting: SortState;
	grouping: GroupingState;
	isLoading: boolean = false;
	item: ThongKeCuocHopModel;
	private subscriptions: Subscription[] = [];
	availableColumns: any[] = ['STT', 'TieuDe', 'SoLuongCauHoi', 'SoLuongNguoiDG', 'TongSLChuaDanhGia']
	/**
	 * Component constructor
	 *
	 * @param dialog: MatDialog
	 * @param data: any
	 * @param QuanLyCuocHopFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService,
	 * @param ThongKeNguoiTaoService: ThongKeNguoiTaoService, *
	 * @param changeDetectorRefs: ChangeDetectorRef
	 */
	constructor(
		public dialogRef: MatDialogRef<ThongKeCuocHop2EditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private QuanLyCuocHopFB: FormBuilder,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		public thongKeCuocHop2Service: ThongKeCuocHop2Service,
		private changeDetectorRefs: ChangeDetectorRef,
		// private TokenStorage: TokenStorage,
		private translate: TranslateService
	) { }

	/**
	 * On init
	 */
	ngOnInit() {
		this.data = this.data.item;
		const filter = this.filterConfiguration();
		this.thongKeCuocHop2Service.patchState({ filter }, root);

		this.grouping = this.thongKeCuocHop2Service.grouping;
		this.paginator = this.thongKeCuocHop2Service.paginator;
		this.sorting = this.thongKeCuocHop2Service.sorting;
		const sb = this.thongKeCuocHop2Service.isLoading$.subscribe((res) => (this.isLoading = res));
		this.subscriptions.push(sb);

		const sb2 = this.thongKeCuocHop2Service.items$.subscribe((res: any) => {
			this.listGroupDept = this.GroupDept(res);
			this.changeDetectorRefs.detectChanges();
		});

	}

	GroupDept(inputArray) {
		const resultArray = inputArray.reduce((acc, curr) => {
			if (curr.StructureID !== 0 && curr.TenPhuongXa) {
				const existingDept = acc.find(item => item.DepartmentID === curr.StructureID);
				if (existingDept) {
					existingDept.listUser.push(curr);
				} else {
					acc.push({ DepartmentID: curr.StructureID, DepartmentName: curr.TenPhuongXa, listUser: [curr] });
				}
			}
			return acc;
		}, []);
		return resultArray;
	}
	paginate(paginator: PaginatorState) {

		const filter = this.filterConfiguration();
		this.thongKeCuocHop2Service.patchState({ filter, paginator }, root);
	}

	filterConfiguration(): any {

		// this.item = this.data.item;
		const filter: any = {};
		// if (this.data && this.data.item) {
		filter.id = this.data.RowID;
		// filter.type=this.data.type;
		// }
		return filter;
	}

	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}

	close() {

		this.dialogRef.close();
	}
	filterExcel(): any {
		const filter: any = {};
		filter.id = this.data.RowID;
		filter.type = this.data.type;
		return filter;
	}
	xuatExcel() {

		let filter = this.filterExcel();
		var request = new XMLHttpRequest();
		this.thongKeCuocHop2Service.exportExcelDetail(filter).subscribe(res => {
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
}
