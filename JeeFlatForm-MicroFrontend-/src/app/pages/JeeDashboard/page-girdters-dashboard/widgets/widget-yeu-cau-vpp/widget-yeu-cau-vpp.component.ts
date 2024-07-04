import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, ElementRef, EventEmitter, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Component, Input } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { TranslateService } from "@ngx-translate/core";
import { JeeAdminWidgetService } from "../../Services/jeeadmin.service";
import { LayoutUtilsService, MessageType } from "src/app/modules/crud/utils/layout-utils.service";
import { QueryParamsModel } from "src/app/modules/auth/models/query-params.model";
import { tap } from "rxjs/operators";

@Component({
	selector: "widget-yeu-cau-vpp",
	templateUrl: "./widget-yeu-cau-vpp.component.html",
	styleUrls: ["widget-yeu-cau-vpp.component.scss"],
})
export class WidgetYeuCauVPPComponent implements OnInit, OnDestroy {
	isLoading: boolean = false;
	private subscriptions: Subscription[] = []
	// Table fields
	displayedColumns = ['#', 'ThangNam', 'NgayYeuCau', 'isVuotHanMuc', 'LyDo', 'TrangThai', 'NgayNhan', 'isDaNhan', 'actions'];
	@ViewChild('searchTuNgay', { static: true }) searchTuNgay: ElementRef;
	@ViewChild('searchDenNgay', { static: true }) searchDenNgay: ElementRef;
	listTinhTrang: any[] = [];
	// Filter fields
	listTrangThaiNV = []
	selectTrangThai: string = "";
	dataLazyLoad: any = [];

	minDate: string = "";
	maxDate: string = "";

	data: any[] = [];
	pageEvent: PageEvent;
	pageSize: number;
	pageLength: number;

	filterYeuCauVPPEvent: EventEmitter<number[]> = new EventEmitter<number[]>();
	btnFilterEventJAdmin: EventEmitter<string> = new EventEmitter<string>();
	btnFilterSub: Subscription;
	btnAddJAdminEvent: EventEmitter<boolean>;
	btnThemMoiSub: Subscription;

	constructor(
		public jeeAdminService: JeeAdminWidgetService,
		public dialog: MatDialog,
		public datepipe: DatePipe,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
		private translate: TranslateService,
	) { }

	/** LOAD DATA */
	ngOnInit() {
		this.listTrangThai();
		this.loadDataList();

		this.btnThemMoiSub = this.btnAddJAdminEvent.subscribe((res) => {
			this.router.navigateByUrl('Admin/yeucau-vpp/add')
		});

		this.btnFilterEventJAdmin.subscribe((res) => {
			if (res && res != "") {
				this.selectTrangThai = res;
				this.loadDataList();
			}	
		})
	}

	_loading = false;
    _HasItem = false;
    crr_page = 0;
    page_size = 15;
    total_page = 0;
	loadDataList() {
        this.dataLazyLoad = [];
        const queryParams = new QueryParamsModel(
            this.filter(),
            "asc",
            "",
            this.crr_page,
            this.page_size,
        );
        this.jeeAdminService.loadYeuCau(queryParams).subscribe(res => {
			if (res && res.status == 1) {
				this.dataLazyLoad = [];
				this.dataLazyLoad = [...this.dataLazyLoad, ...res.data];

				this.total_page = res.panigator.total;
				if (this.dataLazyLoad.length > 0) {
					this._HasItem = true;
				}
				else {
					this._HasItem = false;
				}
				this._loading = false;
			} else {
				this.dataLazyLoad = [];
				// this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
			this.changeDetectorRefs.detectChanges();	
        });
    }

	loadDataList_Lazy() {
        if (!this._loading) {
            this.crr_page++;
            if (this.crr_page < this.total_page) {
                this._loading = true;
                const queryParams = new QueryParamsModel(
                    this.filter(),
                    '',
                    '',
                    this.crr_page,
                    this.page_size,
                );
                this.jeeAdminService.loadYeuCau(queryParams)
                    .pipe(
                        tap(resultFromServer => {
                            if (resultFromServer.status == 1) {
                                this.dataLazyLoad = [...this.dataLazyLoad, ...resultFromServer.data];
								this._HasItem = resultFromServer.data.length > 0;
                                this.changeDetectorRefs.detectChanges();
                            }
                            else {
                                this._loading = false;
                                this._HasItem = false;
                            }

                        })
                    ).subscribe(res => {
                        this._loading = false;
                    });
            }
        }
    }

	onScroll(event) {
        let _el = event.srcElement;
        if (_el.scrollTop + _el.clientHeight > _el.scrollHeight * 0.9) {
            this.loadDataList_Lazy();
        }
    }

	ngOnDestroy() {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	f_date(value: any, args?: any): any {
		let latest_date = this.datepipe.transform(value, 'dd/MM/yyyy');
		return latest_date;
	}

	listTrangThai() {
		this.jeeAdminService.listTrangThaiNV().subscribe(res => {
			if (res.status == 1) {
				this.listTrangThaiNV = res.data
				this.filterYeuCauVPPEvent.emit(this.listTrangThaiNV);
			}
			this.changeDetectorRefs.detectChanges();
		})
	}

	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 235;
		return tmp_height + 'px';
	}

	/* UI */
	getItemStatusString(status: any): string {
		switch (status) {
			case 0:
				return 'Không duyệt';
			case 1:
				return 'Chờ QL duyệt';
			case 2:
				return 'Chờ HC xác nhận';
			case 3:
			case 4: //không hiện trạng thái đã giao, trạng thái 4 mới cho tick đã nhận
				return 'HC đã xác nhận';
			case 5:
				return 'Đã nhận VPP';
		}
		return '';
	}
	getBackgroundByStatus(status: any): string {
		switch (status) {
			case 0:
				return '#F3B2B2';
			case 1:
				return '#d1d1d1';
			case 2:
				return '#FBCA32';
			case 3:
			case 4:
				return '#E1F0FF';
			case 5:
				return '#AFFFD5';
		}
		return '';
	}
	getFontByStatus(status: any): string {
		switch (status) {
			case 0:
				return '#703F25';
			case 1:
				return '#FFFFFF';
			case 2:
				return '#FFFFFF';
			case 3:
			case 4:
				return '#62A4FF';
			case 5:
				return '#40CE82';
		}
		return '';
	}

	xacNhan(item: any){
		let _name = this.translate.instant("JeeAdmin.Stationery.phieuyeucau")
		let _type = this.translate.instant("JeeAdmin.Stationery.received")
		const _title: string = this.translate.instant("JeeAdmin.Object.XACNHAN.TITLE", { name: '' });
		const _description: string = this.translate.instant("JeeAdmin.Object.XACNHAN.DESCRIPTION", { type: _type, name: _name });
		const _waitDesciption: string = this.translate.instant("JeeAdmin.Object.XACNHAN.WAIT_DESCRIPTION", { name: _name });
		const _checkMessage = this.translate.instant("JeeAdmin.Common.xnthanhcong");

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, '', false);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				this.loadDataList();
				return;
			}
			this.jeeAdminService.xacNhanDaNhan(item.IdPhieuYC).subscribe(res => {
				if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(_checkMessage, MessageType.Delete, 5000, true, false);
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Delete, 0);
				}
				this.loadDataList();
			});		
		})
	}

	editYC(id, isView = 1) {
		this.router.navigateByUrl(`Admin/yeucau-vpp/edit/${id}/${isView}`, {
			state: {
				isView: isView,
			}
		});
	}

	filter() {
		const filter: any = {};
		filter.TrangThai = this.selectTrangThai.toString();
		return filter;
	}

}
