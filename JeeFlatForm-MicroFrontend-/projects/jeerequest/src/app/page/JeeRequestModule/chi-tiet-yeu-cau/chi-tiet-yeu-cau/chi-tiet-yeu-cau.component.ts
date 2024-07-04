// Angular
import { DatePipe } from "@angular/common";
import {
	Component,
	ChangeDetectionStrategy,
	OnInit,
	OnDestroy,
	ChangeDetectorRef,
	HostListener,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Router } from "@angular/router";
import * as moment from "moment";
// RxJS
import { BehaviorSubject, Observable } from "rxjs";
import { DanhSachLoaiYeuCauDialogComponent } from "../../components/danh-sach-loai-yeu-cau/danh-sach-loai-yeu-cau.component";
import { DynamicSearchFormService } from "../../components/dynamic-search-form/dynamic-search-form.service";

import { YeuCauService } from "../../_services/yeu-cau.services";
import { TranslationService } from "projects/jeerequest/src/modules/i18n/translation.service";
import { TranslateService } from "@ngx-translate/core";
import { locale as viLang } from '../../../../../../src/modules/i18n/vocabs/vi';
@Component({
	selector: "chi-tiet-yeu-cau",
	templateUrl: "./chi-tiet-yeu-cau.component.html",
	styleUrls: ["./chi-tiet-yeu-cau.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChiTietYeuCauComponent implements OnInit {
	activeTabId:
      | 'kt_quick_panel_logs'
      | 'kt_quick_panel_notifications'
      | 'kt_quick_panel_settings' = 'kt_quick_panel_logs';
	tinhTrang: string = "0"
	listTypeOption = [
		{title:'Yeucau.toigui'},
		{title:'Yeucau.guidentoi'}];
	minDate: string = ''
	maxDate: string = ''
	TuNgay: string = ''
	DenNgay: string = ''
	keyword:string
	labelFilter: string = 'Tất cả';
	isLoad:string = '';
	selectedTab: number = 0;
	NguoiDuyet:string
  	LoaiYeuCau:number
	constructor(
		public dialog: MatDialog,
		private requestsService: YeuCauService,
		private changeDetectorRefs: ChangeDetectorRef,
		private dynamicSearchFormService:DynamicSearchFormService,
    private translationService: TranslationService,
    private translate: TranslateService,
	) {
    this.translationService.loadTranslations(
      viLang,
  );
  var langcode = localStorage.getItem('language');
  if (langcode == null)
      langcode = this.translate.getDefaultLang();
  this.translationService.setLanguage(langcode);
  }
	ngOnInit() {
		this.requestsService.data_shareActived$.subscribe((data:any)=>{
			if(data && data !=''){
				if(data == 'Gui'){
					this.selectedTab = 0;
				}
				if(data == 'Duyet'){
					this.selectedTab = 1;
				}
			}
		})

		//xử lý dynamic
		let opt = {
			title: "Tìm kiếm",
			controls: [
				{
					type: 5,
					placeholder: "Ngày yêu cầu",
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
				},{
					type: 14,
					placeholder: "Tên yêu cầu",
          name:"keyword"
				},
        {
					type: 16,
					placeholder: "Loại yêu cầu",
          name:"LoaiYeuCau"
				},
			]
		}
		this.dynamicSearchFormService.setOption(opt);
		this.dynamicSearchFormService.filterResult.subscribe(value => {
			this.TuNgay = value.TuNgay
			this.DenNgay = value.DenNgay
			this.keyword = value.keyword
			this.LoaiYeuCau = value.LoaiYeuCau
			this.loadDataList()
		});
	}

	loadDataList(){

	}

	themYeuCau() {

		const dialogRef = this.dialog.open(DanhSachLoaiYeuCauDialogComponent, {
			data: {},
			width: "750px",
			position: { top: "60px" },panelClass:'no-padding'
		});
		dialogRef.afterClosed().subscribe((res) => {

			if (!res) {
				this.ngOnInit();
			} else {
				this.ngOnInit();
				this.requestsService.data_shareLoad$.next(res)
			}
		});
	}
	setActiveTabId(tabId) {
    this.activeTabId = tabId;
	this.isLoad = tabId
  	}

  	getActiveCSSClasses(tabId) {
    if (tabId !== this.activeTabId) {
      return '';
    }
    return 'active show chieucao';
  }
  onLinkClick(selectedTab: any) {
	if (selectedTab == 0) {
		this.tinhTrang = "0";
		this.labelFilter = "Tất cả"
	} else if (selectedTab == 1) {
		this.tinhTrang = "1";
		this.labelFilter = "Đã duyệt"
	} else if (selectedTab == 2) {
		this.tinhTrang = "3";
		this.labelFilter = "Chờ duyệt"
	} else if (selectedTab == 3) {
		this.tinhTrang = "2";
		this.labelFilter = "Không duyệt"
	} else if (selectedTab == 4) {
		this.tinhTrang = "4";
		this.labelFilter = "Quá hạn"
	} else if (selectedTab == 5) {
		this.tinhTrang = "5";
		this.labelFilter = "Đã đánh dấu"
	}
	this.loadDataList();
}
  getWidth(){
    let tmp_width = 0;
    tmp_width = window.innerWidth - 420;
    return tmp_width + 'px';
  }
}
