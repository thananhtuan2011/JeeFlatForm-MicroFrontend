import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { BehaviorSubject, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { QueryParamsModel, QueryParamsModelNew } from 'projects/jeeadmin/src/app/models/query-models/query-params.model';
import { DynamicSearchFormService } from '../../component/dynamic-search-form/dynamic-search-form.service';
import { YeuCauVPPModel } from '../../Model/yeucau-vpp.model';
import { VanPhongPhamService } from '../../Services/van-phong-pham.service';
import { TranslationService } from 'projects/jeeadmin/src/modules/i18n/translation.service';
import { locale as viLang } from 'projects/jeeadmin/src/modules/i18n/vocabs/vi';
import { JeeAdminService } from '../../Services/jeeadmin.service';

@Component({
	selector: 'm-yeucau-vpp-list',
	templateUrl: './yeucau-vpp-list.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class YeuCauVPP_ListComponent implements OnInit, OnDestroy {
	isLoading: boolean = false;
	private subscriptions: Subscription[] = []  
	@ViewChild('searchTuNgay', { static: true }) searchTuNgay: ElementRef;
	@ViewChild('searchDenNgay', { static: true }) searchDenNgay: ElementRef;

	listTrangThaiNV = []
	selectTrangThai: any[] = []

	minDate: string = "";
	maxDate: string = "";
	currentURL: string = "";

	constructor(
		public objectService: VanPhongPhamService,
		public dialog: MatDialog,
		public datepipe: DatePipe,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private dynamicSearchFormService: DynamicSearchFormService,
		public dungChungService: JeeAdminService,
		private translate: TranslateService,
		private translationService: TranslationService,
		private changeDetectorRef: ChangeDetectorRef) 
	{
		this.translationService.loadTranslations(
            viLang,
        );
        var langcode = localStorage.getItem('language');
        if (langcode == null)
            langcode = this.translate.getDefaultLang();
        this.translationService.setLanguage(langcode);
	}

	/** LOAD DATA */
	ngOnInit() {
		//xử lý dynamic
		let opt = {
			title: this.translate.instant("COMMON.SEARCH"),
			controls: [
				{
					type: 5,
					placeholder: this.translate.instant("Ngày"),
					from: {
						name: 'TuNgay',
						max: this.maxDate,
						input: this.minDate
					},
					to: {
						name: 'DenNgay',
						min: this.minDate,
						input: this.maxDate
					}
				},
			]
		}
		this.dynamicSearchFormService.setOption(opt);
		// xử lý khi dynamic search form find data hoặc clear filter
		this.dynamicSearchFormService.filterResult.subscribe(value => {
			this.filter = value;
			this.loadTypeOption();
		});

		//reload list
		this.objectService.data_IsLoad$.subscribe((data: any) => {
            if (data && data != '') {
                if (data == 'Load') {
					this.crr_page = 0;
                    this.loadDataList();
                    this.objectService.data_IsLoad$.next('')
                }
            }
        })

		this.objectService.activeID$.subscribe(res => {
			if (res && res != '') {
				let id = +res;
				if (id > 0) {
					this.__RowID = id.toString();
					this.objectService.activeID$.next('');
				}
			}
		})
	}

	filterStatusID: string = "";
	dataLazyLoad: any = [];
    listTypeOption: any = [];
    selectedTab: number = 0;
	__RowID: string = '';
	filter: any = {};
	IsToiGui: boolean = true;
	loadTypeOption() {
        const queryParams = new QueryParamsModelNew(
            this.filterConfiguration(),
            "asc",
            "",
            0,
            100,
            true
        );
        this.objectService.loadTypeOption(queryParams).subscribe(res => {
            if (res && res.status == 1) {
                this.listTypeOption = res.data;
                this.loadDataList();
            }
            this.changeDetectorRef.detectChanges();
        });
    }

	_loading = false;
    _HasItem = false;
    crr_page = 0;
    page_size = 15;
    total_page = 0;
	loadDataList() {
        this.dataLazyLoad = [];
        const queryParams = new QueryParamsModel(
            this.filterConfiguration(),
            "asc",
            "",
            this.crr_page,
            this.page_size,
        );
        this.objectService.loadYeuCau(queryParams).subscribe(res => {
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
			this.changeDetectorRef.detectChanges();	
        });
    }

	loadDataList_Lazy() {
        if (!this._loading) {
            this.crr_page++;
            if (this.crr_page < this.total_page) {
                this._loading = true;
                const queryParams = new QueryParamsModel(
                    this.filterConfiguration(),
                    '',
                    '',
                    this.crr_page,
                    this.page_size,
                );
                this.objectService.loadYeuCau(queryParams)
                    .pipe(
                        tap(resultFromServer => {
                            if (resultFromServer.status == 1) {
                                this.dataLazyLoad = [...this.dataLazyLoad, ...resultFromServer.data];

                                if (resultFromServer.data.length > 0) {
                                    this._HasItem = true;
                                }
                                else {
                                    this._HasItem = false;
                                }
                                this.changeDetectorRef.detectChanges();
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

	filterConfiguration(): any {
        this.filter.StatusID = this.filterStatusID;
		this.filter.TypeID = this.IsToiGui ? "1" : "0";
        return this.filter;
    }

	getHeightTab(): any {
        let tmp_height = window.innerHeight - 215;
        return tmp_height + "px";
    }

	onLinkClick() {
		this.crr_page = 0; //reset page vì độ dài item 2 tab là khác nhau
		this.page_size = 15;	
		this.objectService.tabSelected.subscribe((res: any) => {
			if (res && res != '') {
				this.selectedTab = +res;
				this.changeDetectorRef.detectChanges()
				this.objectService.tabSelected.next('')
			}
		})

		if (this.selectedTab == 0) {
            this.IsToiGui = true;
			this.loadDataList();
        } else {
            this.IsToiGui = false;
			this.loadDataList();
        }
    }

	ngOnDestroy() {
		this.subscriptions.forEach((sb) => sb.unsubscribe());
	}

	//==========================================================
	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 130;
		return tmp_height + 'px';
	}

	getWidthDetails(): any {
        let tmp = window.innerWidth - 350 - 70;
        return tmp + "px";
    }

	add() {
		this.router.navigateByUrl('Admin/yeucau-vpp/add');
	}

	GetDetails(val, isView = 1) {
		this.__RowID = val.IdPhieuYC;
		this.router.navigateByUrl(`Admin/yeucau-vpp/${val.IdPhieuYC}/${isView}/${this.IsToiGui}`);
    }
}