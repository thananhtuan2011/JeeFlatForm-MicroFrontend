
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from "@angular/forms";
// Angular

import {
	Component,
	OnInit,
	Inject,
	ChangeDetectionStrategy,
	OnDestroy,
	ElementRef,
	ViewChild,
	ChangeDetectorRef,
} from "@angular/core";

// RxJS
import { BehaviorSubject, merge, Observable, of, Subscription } from "rxjs";
// Lodash
import { each, find, some } from "lodash";
// NGRX
import { SelectionModel } from "@angular/cdk/collections";
import { Overlay } from '@angular/cdk/overlay';
import { TaoYeuCauDialogComponent } from "../tao-yeu-cau/tao-yeu-cau.component";
import { PageEvent } from "@angular/material/paginator";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { YeuCauService } from "../../_services/yeu-cau.services";
import { QueryParamsModelNew } from "../../../models/query-models/query-params.model";
@Component({
	selector: "kt-danh-sach-loai-yeu-cau-dialog",
	templateUrl: "./danh-sach-loai-yeu-cau.component.html",
	changeDetection: ChangeDetectionStrategy.Default,
})
export class DanhSachLoaiYeuCauDialogComponent implements OnInit, OnDestroy {
	keyword: string = '';
	LoaiYeuCauForm: FormGroup;
	disthEdit: boolean = false;
	disthRead: boolean = false;
	Edit: boolean = false;
	Read: boolean = false;
	item: any;
	listQuyen: any[] = [];
	disabledBtn: boolean = false;

	loadingSubject = new BehaviorSubject<boolean>(false);

	@ViewChild("focusInput", { static: true }) focusInput: ElementRef;

	//=================PageSize Table=====================
	pageEvent: PageEvent;
	pageSize: number;
	listStatus: any[] = [];
	listData: any[] = [];
	// Private properties
	private componentSubscriptions: Subscription;

	/**
	 * Component constructor
	 *
	 * @param dialogRef: MatDialogRef<RoleEditDialogComponent>
	 * @param store: Store<AppState>
	 */
	constructor(
		public dialogRef: MatDialogRef<DanhSachLoaiYeuCauDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		// private ChucDanhService: ChucDanhService,
		private fb: FormBuilder,
		private changeDetectorRefs: ChangeDetectorRef,
		// private tokenStorage: TokenStorage,
		// private layoutUtilsService: LayoutUtilsService,
		private YeuCauService: YeuCauService,
		public dialog: MatDialog,
		// private overlay: Overlay
	) {}

	/**
	 * On init
	 */
	ngOnInit(): void {
	this.loadDataList();
	this.changeDetectorRefs.detectChanges();
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

	loadDataList() {
		const queryParams = new QueryParamsModelNew(
			this.filterConfiguration()
		);
		this.YeuCauService.getDSLoaiYeuCau(queryParams).subscribe((res) => {
			if (res && res.status === 1) {
        if(res.data){
          this.item = res.data;
          this.changeDetectorRefs.detectChanges();
        }

			} else {
				this.item = [];
			}
		});
		setTimeout((x) => {
			this.loadPage();
		}, 500);
	}
	loadPage() {

				const queryParams1 = new QueryParamsModelNew(
					this.filterConfiguration(),
				);
				this.YeuCauService.getDSLoaiYeuCau(queryParams1).subscribe((res) => {
					if (res && res.status === 1) {
						this.item = res.data;
						this.changeDetectorRefs.detectChanges();
					} else {
						this.item = [];
					}
				});

		}

	filterConfiguration(): any {
		const filter: any = {};
		filter.status = 1;
		filter.keyWord = this.keyword;
		return filter;
	}

	taoYeuCau(item:any) {
		const dialogRef = this.dialog.open(TaoYeuCauDialogComponent, {disableClose: true,data: {_Id_LoaiYeuCau: item.Id_LoaiYeuCau,_Id_QuyTrinh:item.Id_QuyTrinh, _tenLoai:item.TenLoaiYeuCau,_Loai:3,_MoTaLoaiYeuCau:item.MoTa},width:"750px", position: {top: '60px'},panelClass:'no-padding'
		});

		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				this.ngOnInit()
			} else {
				let _item = {item:0}
				this.dialogRef.close({
					_item
				});
			}
		});
	}
}
