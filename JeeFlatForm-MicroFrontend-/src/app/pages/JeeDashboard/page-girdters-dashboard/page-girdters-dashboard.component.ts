import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { Dashboard, Widget, WidgetModel, WorkModel } from './Model/page-girdters-dashboard.model';
import { MatDialog } from '@angular/material/dialog';
import { PageGirdtersDashboardService } from './Services/page-girdters-dashboard.service';
import { AddCloseWidgetDialogComponent } from './widgets/add-widget-dashborad/add-widget-dashborad.component';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'projects/jeehr/src/modules/i18n/translation.service';
const moment = _rollupMoment || _moment;
import { Router } from '@angular/router';
import { EditPopupWidgetTimeComponent } from './widgets/thiet-lap-thoi-gian/edit-popup-widget-time/edit-popup-widget-time.component';
import { ResultModel } from 'src/app/modules/auth/models/_base.model';
import { locale as viLang } from '../../../../app/modules/i18n/vocabs/vi';
import { WorkGeneralService } from './Services/work-general.services';
import { ChangePasswordEditDialogComponent } from '../../JeeAccount/widgets/change-password-dialog/change-password-dialog.component';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { EditPopupWidgetTimeV1Component } from './widgets/WorkV1/thiet-lap-thoi-gian-v1/edit-popup-widget-time-v1/edit-popup-widget-time-v1.component';
import { TourGuideService } from '../../tour-guide/tour-guide.service';
import { LayoutUtilsService } from 'src/app/modules/crud/utils/layout-utils.service';

interface dropdownTienDo {
  value: string;
  viewValue: string;
  checked: boolean;
}

@Component({
  selector: 'm-page-girdters-dashboard',
  templateUrl: './page-girdters-dashboard.component.html',
  styleUrls: ['page-girdters-dashboard.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageGidtersDashboardComponent implements OnInit, OnDestroy {
  public listWidget: Widget[] = [];
  public options: GridsterConfig;
  public WidgetDashboard: Dashboard;
  public dashboard: Array<GridsterItem>;
  private btnThemMoiEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  private btnAddJAdminEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  private btnThemMoiJeeRequestEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showConfig: boolean = false;
  campaign17: FormGroup;
  campaign18: FormGroup;
  campaign19: FormGroup;
  filterLoaibieudo: string = '0';
  filterYCCN: string = "Chờ duyệt";
  filterYCCD: string = "Tất cả";
  private resizeEvent: EventEmitter<any> = new EventEmitter<any>();
  public inputs = {
    widget: '',
  };

  public outputs = {
    filterAccountEvent: (res) => {
      this.filterAccount = res;
    },
    filterDSTruyCapNhanhEvent: (res) => {
      this.filterDSnhanh = res;
    },
    filterYeuCauVPPEvent: (res) => {
      this.filterYeuCauVPP = res;
    },
    filterYeuCauChoDuyetEvent: (res) => {
      this.filterDSYeuCauChoDuyet = res;
    },
    SoYeuChoDuyetEvent: (res) => {
      this.soLuong = res;
      this.changeDetectorRefs.detectChanges();
    },
    SoYeuCauCaNhantEvent: (res) => {
      this.soLuongYC = res;
      this.changeDetectorRefs.detectChanges();
    },
    filterYeuCauCaNhanEvent: (res) => {
      this.filterDSYeuCauCaNhanEvent = res;
    },
    filterDonTuNhanSuEvent: (res) => {
      this.filterLoaiDonTuEvent = res;
    },
    filterTinhTrangEvent: (res) => {
      this.filterTinhTrangEvent = res;
    },
    filterTinhTrangDuyetEvent: (res) => {
      this.filterTinhTrangDuyetEvent = res;
    },
    filterDanhSachDuAn: (res) => {
      this.filterDSduan = res;
    },
    filterDanhSachDuAn25: (res) => {
      this.filterDSduan25 = res;
    },
    filterDanhSachLogDuAn: (res) => {
      this.filterDSLogduan = res;
    },
    filterDSTrangThaiduan: (res) => {
      this.filterDSTrangThaiduan = res;
    },
    filterDSTrangthaiMember: (res) => {
      this.filterDSTrangthaiMember = res;
    },
    filterNhiemVuEvent: (res) => {
      this.filterLoaiNhiemVuEvent = res;
    },
    filterTinhTrangNhiemVuEvent: (res) => {
      if (res.length > 0) {
        let obj = res.find((x) => x.RowID == 0);
        if (obj && this.tinhtrangnhiemvu == '') {
          this.tinhtrangnhiemvu = obj.Title + ' (' + obj.Value + ')';
        }
      }
      this.filterTinhTrangNhiemVuEvent = res;
    },
    filterDanhSachPhongBan: (res) => {
      this.filterDSphongban = res;
    },
    filterDanhSachPhongBan31: (res) => {
      this.filterDSphongban31 = res;
    },
    filterDSTrangThaiduan17: (res) => {
      this.filterDSTrangThaiduan17 = res;
    },
    filterDSTrangThaiduan18: (res) => {
      this.filterDSTrangThaiduan18 = res;
    },
    filterDSTrangThaiduan19: (res) => {
      this.filterDSTrangThaiduan19 = res;
    },
    filterTag22: (res) => {
      this.filterTag22 = res;
    },
    filterTag23: (res) => {
      this.filterTag23 = res;
    },
    filterDieuKienLoc: (res) => {
      this.filterDieuKienLoc = res;
    },
    filterDieuKienLoc_TrangThaiCV: (res) => {
      this.filterDieuKienLoc_TrangThaiCV = res;
    },
    filterDieuKienLoc_Widget18: (res) => {
      this.filterDieuKienLoc_Widget18 = res;
    },
    filterDieuKienLoc_Widget19: (res) => {
      this.filterDieuKienLoc_Widget19 = res;
    },
    filterDieuKienLoc_BDTG: (res) => {
      this.filterDieuKienLoc_BDTG = res;
    },
    filterDanhSachPhongBan27: (res) => {
      this.filterDSphongban27 = res;
    },
    filterDanhSachPhongBan28: (res) => {
      this.filterDSphongban28 = res;
    },
    filterDanhSachNhanVien: (res) => {
      this.filterDSNV = res;
    },
    filterDieuKienLoc_Widget30: (res) => {
      this.filterDieuKienLoc_Widget30 = res;
    },
    filterDSTrangThaiduan36: (res) => {
      this.filterDSTrangThaiduan36 = res;//Widget id 36
    },
    filterDieuKienLoc_Widget37: (res) => {
      this.filterDieuKienLoc_Widget37 = res;
    },

    filterDSTrangthaiMember_Widget37: (res) => {
      this.filterDSTrangthaiMember_Widget37 = res;
    },

    filterDieuKienLoc_Widget39: (res) => {
      this.filterDieuKienLoc_Widget39 = res;
    },

    filterDSTrangThaiduan_Widget39: (res) => {
      this.filterDSTrangThaiduan_Widget39 = res;
    },

    filterDanhSachDuAn40: (res) => {
      this.filterDSduan40 = res;
    },
    //==================Bổ sung filter phạm vi các widget sau==============
    filterDanhSachVaiTro: (res) => {
      this.filterDSvaitro = res;
    },
    filterDanhSachVaiTro9: (res) => {
      this.filterDSvaitro9 = res;
    },
    filterDanhSachVaiTro17: (res) => {
      this.filterDSvaitro17 = res;
    },
    filterDanhSachVaiTro18: (res) => {
      this.filterDSvaitro18 = res;
    },
    filterDanhSachVaiTro10: (res) => {
      this.filterDSvaitro10 = res;
    },
    filterDanhSachVaiTro25: (res) => {
      this.filterDSvaitro25 = res;
    },
    filterDanhSachVaiTro39: (res) => {
      this.filterDSvaitro39 = res;
    },
    filterDanhSachVaiTro40: (res) => {
      this.filterDSvaitro40 = res;
    },
  };
  filterAccount: string[] = [];
  filterDSnhanh: number[] = [];
  filterYeuCauVPP: number[] = [];

  //request
  filterDSYeuCauCaNhanEvent: any[] = [];
  filterDSYeuCauChoDuyet: any[] = [];
  soLuong: number;
  soLuongYC: number;
  //end-requset

  //Start khai bao sử dụng cho JW
  filterDSduan: any = [];
  filterDSduan25: any = [];
  filterDSLogduan: any = [];
  filterDSTrangThaiduan: any = [];
  filterDSTrangthaiMember: any = [];
  itemfilter_chart: any = {
    id_row: 0,
    title: 'Hình cột',
  };
  filter_chart: any[] = [
    {
      id_row: 0,
      title: 'Hình cột',
    },
    {
      id_row: 1,
      title: 'Hình tròn',
    },
  ];
  itemfilter_chart17: any = {
    id_row: 0,
    title: 'Hình cột',
  };
  filter_chart17: any[] = [
    {
      id_row: 0,
      title: 'Hình cột',
    },
    {
      id_row: 1,
      title: 'Hình tròn',
    },
  ];
  itemfilter_chart18: any = {
    id_row: 0,
    title: 'Hình cột',
  };
  filter_chart18: any[] = [
    {
      id_row: 0,
      title: 'Hình cột',
    },
    {
      id_row: 1,
      title: 'Hình tròn',
    },
  ];
  itemfilter_chart19: any = {
    id_row: 0,
    title: 'Hình cột',
  };
  filter_chart19: any[] = [
    {
      id_row: 0,
      title: 'Hình cột',
    },
    {
      id_row: 1,
      title: 'Hình tròn',
    },
  ];
  labelCongViec = "Công việc tôi làm"
  filterDSTrangThaiduan17: any = [];
  filterDSTrangThaiduan18: any = [];
  filterDSTrangThaiduan19: any = [];
  filterTag22: any = [];
  filterTag23: any = [];
  filterDieuKienLoc: any = [];
  filterDieuKienLoc_TrangThaiCV: any = [];
  filterDieuKienLoc_BDTG: any = [];
  filterDieuKienLoc_Widget18: any = [];
  filterDieuKienLoc_Widget19: any = [];
  filterDieuKienLoc_Widget30: any = [];
  filterDSTrangThaiduan36: any = [];
  private btnFilterEventCongviecDuan: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventCongviecDuan25: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventLogDuan: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventTrangThaiCV: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventMember: EventEmitter<any> = new EventEmitter<any>();

  private btnLoaiCongViec: EventEmitter<any> = new EventEmitter<any>();
  private btnLoaiBieuDo: EventEmitter<any> = new EventEmitter<any>();
  private btnLoaiBieuDo17: EventEmitter<any> = new EventEmitter<any>();
  private btnLoaiBieuDo18: EventEmitter<any> = new EventEmitter<any>();
  private btnLoaiBieuDo19: EventEmitter<any> = new EventEmitter<any>();
  private btnPriority20: EventEmitter<any> = new EventEmitter<any>();
  private btnPriority21: EventEmitter<any> = new EventEmitter<any>();
  private btnPriority10: EventEmitter<any> = new EventEmitter<any>();
  private btnPriority25: EventEmitter<any> = new EventEmitter<any>();
  private btnPriority24: EventEmitter<any> = new EventEmitter<any>();

  private btnTienDo7: EventEmitter<any> = new EventEmitter<any>();
  private btnTienDo24: EventEmitter<any> = new EventEmitter<any>();
  private btn29: EventEmitter<any> = new EventEmitter<any>();
  private btn30: EventEmitter<any> = new EventEmitter<any>();

  private btnFilterEventThemCongViecDuan: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventThemCongViecDuan25: EventEmitter<any> = new EventEmitter<any>();
  private btnThemMoiCongviecDuan: EventEmitter<any> = new EventEmitter<any>();

  private btnFilterEventTrangThaiCV17: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventTrangThaiCV18: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventTrangThaiCV19: EventEmitter<any> = new EventEmitter<any>();


  private btnFilterTag22: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterTag23: EventEmitter<any> = new EventEmitter<any>();
  ////widget2
  private btnFilterEventCondition: EventEmitter<any> = new EventEmitter<any>();
  private btnDeleteFilterEventCondition: EventEmitter<any> = new EventEmitter<any>();
  private btnThietlapFilter: EventEmitter<any> = new EventEmitter<any>();

  //widget9
  private btnFilterEventCondition_TrangThaiCV: EventEmitter<any> = new EventEmitter<any>();
  private btnDeleteFilterEventCondition_TrangThaiCV: EventEmitter<any> = new EventEmitter<any>();
  private btnThietlapFilter_TrangThaiCV: EventEmitter<any> = new EventEmitter<any>();


  //widget17
  private btnFilterEventCondition_BDTG: EventEmitter<any> = new EventEmitter<any>();
  private btnDeleteFilterEventCondition_BDTG: EventEmitter<any> = new EventEmitter<any>();
  private btnThietlapFilter_BDTG: EventEmitter<any> = new EventEmitter<any>();


  //widget18
  private btnFilterEventCondition_Widget18: EventEmitter<any> = new EventEmitter<any>();
  private btnDeleteFilterEventCondition_Widget18: EventEmitter<any> = new EventEmitter<any>();
  private btnThietlapFilter_Widget18: EventEmitter<any> = new EventEmitter<any>();

  //widget19
  private btnFilterEventCondition_Widget19: EventEmitter<any> = new EventEmitter<any>();
  private btnDeleteFilterEventCondition_Widget19: EventEmitter<any> = new EventEmitter<any>();
  private btnThietlapFilter_Widget19: EventEmitter<any> = new EventEmitter<any>();
  //
  private btnFilterEventCondition_Widget30: EventEmitter<any> = new EventEmitter<any>();
  private btnThietlapFilter_Widget30: EventEmitter<any> = new EventEmitter<any>();
  //End khai bao sử dụng cho JW

  //Start khai bao sử dụng cho HR
  filterLoaiDonTuEvent: any[] = [];
  ShowThemMoi: boolean = true;
  loaiDonTu: string = 'Nghỉ phép/công tác';
  IDloaiDonTu: number = 1;
  private btnFilterEventDTNS: EventEmitter<any> = new EventEmitter<any>();
  private btnThemMoiJeeHREvent: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventTinhTrangDTNS: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventTinhTrangDuyetDTNS: EventEmitter<any> = new EventEmitter<any>();
  filterTinhTrangEvent: any[] = [];
  tinhTrang: string = 'Chờ duyệt';
  filterTinhTrangDuyetEvent: any[] = [];
  tinhTrangDuyet: string = 'Chờ duyệt';
  //End khai bao sử dụng cho HR
  //Start khai bao sử dụng cho JeeWF
  loainhiemvu: string = 'Giao cho tôi';
  filterLoaiNhiemVuEvent: any[] = [];
  private btnFilterEventLoaiNhiemVu: EventEmitter<any> = new EventEmitter<any>();

  tinhtrangnhiemvu: string = '';
  filterTinhTrangNhiemVuEvent: any[] = [];
  private btnFilterEventTinhTrangNhiemVu: EventEmitter<any> = new EventEmitter<any>();
  //End khai bao sử dụng cho JeeWF
  //Start khai bao sử dụng cho JeeW-Thien
  //Widget tổng hợp theo dự án 
  filterDSphongban: any = [];
  filterDSphongban31: any = [];
  private btnFilterEventTongHopDuAn: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventChartTheoDoiNhiemVu: EventEmitter<any> = new EventEmitter<any>();
  //End khai bao sử dụng cho JeeW-Thien


  //Start khai bao sử dụng cho JeeW-Tuan
  //Widget nhiệm vụ theo người giao 
  filterDSphongban27: any = [];
  private btnFilterEventDepartment27: EventEmitter<any> = new EventEmitter<any>();
  filterDSphongban28: any = [];
  private btnFilterEventDepartment28: EventEmitter<any> = new EventEmitter<any>();
  filterDSNV: any = [];
  private btnFilterEventDanhSachNhanVien: EventEmitter<any> = new EventEmitter<any>();
  //End khai bao sử dụng cho JeeW-Tuan

  // eventEmitter campaign widget17
  private campaign17StartEvent: EventEmitter<any> = new EventEmitter<any>();
  private campaign17EndEvent: EventEmitter<any> = new EventEmitter<any>();
  private campaign17RangeEvent: EventEmitter<any> = new EventEmitter<any>();
  // end ampaign widget17

  // eventEmitter campaign widget18
  private campaign18StartEvent: EventEmitter<any> = new EventEmitter<any>();
  private campaign18EndEvent: EventEmitter<any> = new EventEmitter<any>();
  private campaign18RangeEvent: EventEmitter<any> = new EventEmitter<any>();
  // end campaign widget18

  // eventEmitter campaign widget19
  private campaign19StartEvent: EventEmitter<any> = new EventEmitter<any>();
  private campaign19EndEvent: EventEmitter<any> = new EventEmitter<any>();
  private campaign19RangeEvent: EventEmitter<any> = new EventEmitter<any>();
  // end campaign widget19


  // phong add for unsubcribe
  subject = new Subject();
  // end phong add
  //========================================================
  //Bổ sung filter phạm vi các widget sau
  //Widget Theo dõi tình hình thực hiện nhiệm vụ (16)
  filterDSvaitro: any = [];
  private btnFilterEventVaiTro: EventEmitter<any> = new EventEmitter<any>();
  //Widget Thời hạn nhiệm vụ (9)
  filterDSvaitro9: any = [];
  private btnFilterEventVaiTro9: EventEmitter<any> = new EventEmitter<any>();
  //Widget Trạng thái nhiệm vụ (17)
  filterDSvaitro17: any = [];
  private btnFilterEventVaiTro17: EventEmitter<any> = new EventEmitter<any>();
  //Widget Tổng hợp thời hạn nhiệm vụ (18)
  filterDSvaitro18: any = [];
  private btnFilterEventVaiTro18: EventEmitter<any> = new EventEmitter<any>();
  //Widget Danh sách nhiệm vụ (10)
  filterDSvaitro10: any = [];
  private btnFilterEventVaiTro10: EventEmitter<any> = new EventEmitter<any>();
  //Widget Nhiệm vụ đã giao (25)
  filterDSvaitro25: any = [];
  private btnFilterEventVaiTro25: EventEmitter<any> = new EventEmitter<any>();
  //Widget Nhắc nhở nhiệm vụ đã giao (33)
  itemfilter_VaiTro33: any = {
    name: 'Tôi tạo',
    value: 1,
  };
  list_VaiTro_33 = [
    {
      name: 'Tôi tạo',
      value: 1,
    },
    {
      name: 'Tôi giao',
      value: 2,
    },
    {
      name: 'Tôi theo dõi',
      value: 3,
    },
  ];
  private btnFilterEventVaiTro33: EventEmitter<any> = new EventEmitter<any>();
  //End khai báo widget 33
  //widget Danh sách nhiệm vụ đơn vị được giao (36)
  private btnFilterEventTrangThaiCV36: EventEmitter<any> = new EventEmitter<any>();
  //========================================
  isUseWidget: boolean = true;
  //Start khai báo các button để lưu tạm giá trị value từng widget======
  btn9value1: string = '';
  btn9value2: string = '';
  btn10value1: string = '';
  btn10value2: string = '';
  btn10value3: string = '';
  btn16value1: string = '';
  btn16value2: string = '';
  btn17value1: string = '';
  btn17value2: string = '';
  btn18value1: string = '';
  btn18value2: string = '';
  btn24value1: string = '';
  btn24value2: string = '';
  btn25value1: string = '';
  btn25value2: string = '';
  btn25value3: string = '';
  btn28value1: string = '';
  btn28value2: string = '';
  btn39value1: string = '';
  btn39value2: string = '';
  btn40value1: string = '';
  btn40value2: string = '';
  btn40value3: string = '';
  //End khai báo các button để lưu tạm giá trị value từng widget======
  //===Xử lý riêng khi vừa vào trang 01/12/2023 - widget 24
  private btnLoadTienDo24: EventEmitter<any> = new EventEmitter<any>();
  private btnLoadPriority24: EventEmitter<any> = new EventEmitter<any>();
  //===Xử lý riêng khi vừa vào trang 01/12/2023- widget 25
  private btnLoadFilterEventCongviecDuan25: EventEmitter<any> = new EventEmitter<any>();
  private btnLoadFilterEventVaiTro25: EventEmitter<any> = new EventEmitter<any>();
  private btnLoadPriority25: EventEmitter<any> = new EventEmitter<any>();
  constructor(
    private changeDetect: ChangeDetectorRef,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private pageGirdtersDashboardService: PageGirdtersDashboardService,
    private translationService: TranslationService,
    private translate: TranslateService,
    private router: Router,
    public _WorkGeneralService: WorkGeneralService,
    private auth: AuthService,
    public tourGuideService: TourGuideService,
    private layoutUtilsService: LayoutUtilsService
  ) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaign17 = new FormGroup({
      start: new FormControl('null'),
      end: new FormControl(new Date('null')),
    });

    this.campaign18 = new FormGroup({
      start: new FormControl('null'),
      end: new FormControl(new Date('null')),
    });

    this.campaign19 = new FormGroup({
      start: new FormControl('null'),
      end: new FormControl(new Date('null')),
    });

    this.translationService.loadTranslations(
      viLang,
    );
    var langcode = localStorage.getItem('language');
    if (langcode == null)
      langcode = this.translate.getDefaultLang();
    this.translationService.setLanguage(langcode);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
  data_dk: any[] = [];
  ngOnInit() {
    this._WorkGeneralService.getthamso();
    localStorage.setItem('chatGroup', '0');
    localStorage.setItem("activeTab", null);
    this.listWidget = this.pageGirdtersDashboardService.getWidgets();
    this.WidgetDashboard = new Dashboard();
    this.options = this.pageGirdtersDashboardService.getDashBoardOptions();
    this.options.displayGrid = DisplayGrid.OnDragAndResize;
    this.options.itemChangeCallback = (item: Widget) => {
      const widget = new WidgetModel(item);
      this.pageGirdtersDashboardService
        .postUpdateWidget(widget)
        .pipe(takeUntil(this.subject))
        .subscribe((res) => {
          this.resizeEvent.emit(item);
        });
    };

    this.pageGirdtersDashboardService.checkWidget().subscribe(res => {
      this.isUseWidget = res;
      this.options.draggable.enabled = this.isUseWidget;
      this.options.resizable.enabled = this.isUseWidget;
      this.options.api.optionsChanged();
    })

    this.pageGirdtersDashboardService
      .getDSWidget()
      .pipe(takeUntil(this.subject))
      .subscribe((res: ResultModel<Widget>) => {
        if (res.data && res.data.length > 0) {
          this.WidgetDashboard.widgets = res.data;
          this.WidgetDashboard.widgets.forEach((widget: Widget) => {
            for (let index = 0; index < this.listWidget.length; index++) {
              if (widget.componentName === this.listWidget[index].componentName) {
                widget.componentType = this.listWidget[index].componentType;
              }
            }
          });
        } else {
          this.dashboard = [];
        }
        this.dashboard = this.WidgetDashboard.widgets;
        console.log("ds widget", this.dashboard);
        this.FindIDprojectteam(this.dashboard);

        this.changeDetectorRefs.detectChanges();
      });

    //Start Widget17========
    this.campaign17
      .get('start')
      .valueChanges.pipe(takeUntil(this.subject))
      .subscribe((res) => {
        this.campaign17StartEvent.emit(res);
      });

    this.campaign17
      .get('end')
      .valueChanges.pipe(takeUntil(this.subject))
      .subscribe((res) => {
        this.campaign17EndEvent.emit(res);
      });

    this.campaign17.valueChanges.pipe(takeUntil(this.subject)).subscribe((res) => {
      this.campaign17RangeEvent.emit(res);
    });
    //End Widget 17=========

    //Start Widget18========
    this.campaign18
      .get('start')
      .valueChanges.pipe(takeUntil(this.subject))
      .subscribe((res) => {
        this.campaign18StartEvent.emit(res);
      });

    this.campaign18
      .get('end')
      .valueChanges.pipe(takeUntil(this.subject))
      .subscribe((res) => {
        this.campaign18EndEvent.emit(res);
      });

    this.campaign18.valueChanges.pipe(takeUntil(this.subject)).subscribe((res) => {
      this.campaign18RangeEvent.emit(res);
    });
    //End Widget 18=========

    //Start Widget19========
    this.campaign19
      .get('start')
      .valueChanges.pipe(takeUntil(this.subject))
      .subscribe((res) => {
        this.campaign19StartEvent.emit(res);
      });

    this.campaign19
      .get('end')
      .valueChanges.pipe(takeUntil(this.subject))
      .subscribe((res) => {
        this.campaign19EndEvent.emit(res);
      });

    this.campaign19.valueChanges.pipe(takeUntil(this.subject)).subscribe((res) => {
      this.campaign19RangeEvent.emit(res);
    });
    //End Widget 19=========
    //===============Cập nhất đơn từ nhân sự===============================
    this.loaiDonTu = 'Nghỉ phép/công tác';
    this.IDloaiDonTu = 1;

    setTimeout(() => {
      this.title_Dash = localStorage.getItem('titlecustomerID');
      this.istaskbar = localStorage.getItem('istaskbarcustomerID');
      this.image = localStorage.getItem('logocustomerID');
      this.changeDetect.detectChanges();
    }, 1000);

    //================14-03-2025 Chức năng Wizarad cho khách hàng lần đầu vô hệ thống======
    this.CheckAdmin();
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  closeWidget(id: number) {
    this.pageGirdtersDashboardService
      .deleteWidget(id)
      .pipe(takeUntil(this.subject))
      .subscribe((res) => {
        if (res && res.status === 1) {
          this.ngOnInit();
          this.changeDetect.detectChanges();
        }
      });
  }

  AddCloseWidget() {
    const dialogRef = this.dialog.open(AddCloseWidgetDialogComponent, {
      data: { dashboard: this.dashboard },
      panelClass: 'sky-padding-0',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.subject))
      .subscribe((res) => {
        this.ngOnInit();
        setTimeout(() => {
        }, 500);
        this.changeDetect.detectChanges();
      });
  }

  clickThemMoi(widget) {
    if (widget.id == 8) {
      this.btnThemMoiEvent.emit(true);
    }
    if (widget.id == 4) {
      this.btnThemMoiJeeRequestEvent.emit(true);
    }
    if (widget.id == 3) {
      this.btnAddJAdminEvent.emit(true);
    }
    if (widget.id == 12) {
      this.btnThemMoiJeeHREvent.emit(this.IDloaiDonTu);
    }
  }

  filterWidgetHeader(widget) {
    if (widget.id == 8) {
      return this.filterAccount;
    }
    if (widget.id == 3) {
      return this.filterYeuCauVPP;
    }
    if (widget.id == 1) {
      return this.filterDSnhanh;
    }
    if (widget.id == 5) {
      return this.filterDSYeuCauChoDuyet;
    }
    if (widget.id == 4) {
      return this.filterDSYeuCauCaNhanEvent;
    }
    if (widget.id == 12) {
      return this.filterLoaiDonTuEvent;
    }
    if (widget.id == 10) {
      return this.filterDSduan;
    }
    if (widget.id == 11) {
      return this.filterDSLogduan;
    }
    if (widget.id == 9) {
      return this.filterDSTrangThaiduan;
    }
    if (widget.id == 2) {
      return this.filterDSTrangthaiMember;
    }
    if (widget.id == 14) {
      return this.filterLoaiNhiemVuEvent;
    }
    if (widget.id == 16) {
      return this.filterDSphongban;
    }
    if (widget.id == 17) {
      return this.filterDSTrangThaiduan17;
    }
    if (widget.id == 18) {
      return this.filterDSTrangThaiduan18;
    }
    if (widget.id == 19) {
      return this.filterDSTrangThaiduan19;
    }
    if (widget.id == 22) {
      return this.filterTag22;
    }
    if (widget.id == 23) {
      return this.filterTag23;
    }
    if (widget.id == 25) {
      return this.filterDSduan25;
    }
    if (widget.id == 27) {
      return this.filterDSphongban27;
    }
    if (widget.id == 28) {
      return this.filterDSphongban28;
    }
    if (widget.id == 31) {
      return this.filterDSphongban31;
    }
    if (widget.id == 36) {
      return this.filterDSTrangThaiduan36;
    }
    if (widget.id == 37) {
      return this.filterDSTrangthaiMember_Widget37;
    }
    if (widget.id == 40) {
      return this.filterDSduan40;
    }
  }

  filterWidgetHeaderTinhTrang(widget) {
    if (widget.id == 12) {
      //Tình trạng đơn từ nhân sự
      return this.filterTinhTrangEvent;
    }
    if (widget.id == 13) {
      //Tình trạng đơn từ nhân sự
      return this.filterTinhTrangDuyetEvent;
    }
    if (widget.id == 14) {
      //Tình trạng nhiệm vụ
      return this.filterTinhTrangNhiemVuEvent;
    }
  }
  getInput(wiget: Widget): any {
    const inputs = {
      widget: wiget,
      resizeEvent: this.resizeEvent,
      btnThemMoiEvent: this.btnThemMoiEvent,
      btnThemMoiJeeRequestEvent: this.btnThemMoiJeeRequestEvent,
      btnAddJAdminEvent: this.btnAddJAdminEvent,
      btnFilterEvent: this.btnFilterEvent,
      btnFilterEventJAdmin: this.btnFilterEventJAdmin,
      btnFilterEventJR: this.btnFilterEventJR,
      btnFilterEventJRYCCN: this.btnFilterEventJRYCCN,
      // campaign widget17
      campaign17StartEvent: this.campaign17StartEvent,
      campaign17EndEvent: this.campaign17EndEvent,
      campaign17RangeEvent: this.campaign17RangeEvent,
      // end campaign widget17
      // campaign widget18
      campaign18StartEvent: this.campaign18StartEvent,
      campaign18EndEvent: this.campaign18EndEvent,
      campaign18RangeEvent: this.campaign18RangeEvent,
      // end campaign widget18
      // campaign widget19
      campaign19StartEvent: this.campaign19StartEvent,
      campaign19EndEvent: this.campaign19EndEvent,
      campaign19RangeEvent: this.campaign19RangeEvent,
      // end campaign widget19
      //Start JeeHR
      btnFilterEventDTNS: this.btnFilterEventDTNS,
      btnThemMoiJeeHREvent: this.btnThemMoiJeeHREvent,
      btnFilterEventTinhTrangDTNS: this.btnFilterEventTinhTrangDTNS,
      btnFilterEventTinhTrangDuyetDTNS: this.btnFilterEventTinhTrangDuyetDTNS,
      //End JeeHR
      //Start jeework
      btnFilterEventCongviecDuan: this.btnFilterEventCongviecDuan,
      btnFilterEventCongviecDuan25: this.btnFilterEventCongviecDuan25,
      btnLoadFilterEventCongviecDuan25: this.btnLoadFilterEventCongviecDuan25,//id = 25
      btnFilterEventLogDuan: this.btnFilterEventLogDuan,
      btnFilterEventTrangThaiCV: this.btnFilterEventTrangThaiCV,
      btnFilterEventMember: this.btnFilterEventMember,
      btnFilterEventCondition: this.btnFilterEventCondition,
      btnDeleteFilterEventCondition: this.btnDeleteFilterEventCondition,
      btnThietlapFilter: this.btnThietlapFilter,

      btnFilterEventCondition_TrangThaiCV: this.btnFilterEventCondition_TrangThaiCV,
      btnDeleteFilterEventCondition_TrangThaiCV: this.btnDeleteFilterEventCondition_TrangThaiCV,
      btnThietlapFilter_TrangThaiCV: this.btnThietlapFilter_TrangThaiCV,


      btnFilterEventCondition_Widget18: this.btnFilterEventCondition_Widget18,
      btnDeleteFilterEventCondition_Widget18: this.btnDeleteFilterEventCondition_Widget18,
      btnThietlapFilter_Widget18: this.btnThietlapFilter_Widget18,

      btnFilterEventCondition_Widget19: this.btnFilterEventCondition_Widget19,
      btnDeleteFilterEventCondition_Widget19: this.btnDeleteFilterEventCondition_Widget19,
      btnThietlapFilter_Widget19: this.btnThietlapFilter_Widget19,

      btnFilterEventCondition_BDTG: this.btnFilterEventCondition_BDTG,
      btnDeleteFilterEventCondition_BDTG: this.btnDeleteFilterEventCondition_BDTG,
      btnThietlapFilter_BDTG: this.btnThietlapFilter_BDTG,


      btnLoaiBieuDo: this.btnLoaiBieuDo,
      btnFilterEventThemCongViecDuan: this.btnFilterEventThemCongViecDuan,
      btnFilterEventThemCongViecDuan25: this.btnFilterEventThemCongViecDuan25,
      btnThemMoiCongviecDuan: this.btnThemMoiCongviecDuan,
      btnFilterEventTongHopDuAn: this.btnFilterEventTongHopDuAn,
      btnFilterEventChartTheoDoiNhiemVu: this.btnFilterEventChartTheoDoiNhiemVu,

      btnFilterEventTrangThaiCV17: this.btnFilterEventTrangThaiCV17,
      btnLoaiBieuDo17: this.btnLoaiBieuDo17,

      btnFilterEventTrangThaiCV18: this.btnFilterEventTrangThaiCV18,
      btnLoaiBieuDo18: this.btnLoaiBieuDo18,

      btnFilterEventTrangThaiCV19: this.btnFilterEventTrangThaiCV19,
      btnLoaiBieuDo19: this.btnLoaiBieuDo19,
      btnPriority20: this.btnPriority20,
      btnPriority21: this.btnPriority21,
      btnPriority10: this.btnPriority10,
      btnPriority25: this.btnPriority25,
      btnLoadPriority25: this.btnLoadPriority25,
      btnPriority24: this.btnPriority24,

      btnTienDo7: this.btnTienDo7,
      btnTienDo24: this.btnTienDo24,
      btn29: this.btn29,
      btn30: this.btn30,
      btnFilterEventCondition_Widget30: this.btnFilterEventCondition_Widget30,
      btnThietlapFilter_Widget30: this.btnThietlapFilter_Widget30,


      btnFilterTag22: this.btnFilterTag22,
      btnFilterTag23: this.btnFilterTag23,


      //End jeework
      //Start JeeWF
      btnFilterEventLoaiNhiemVu: this.btnFilterEventLoaiNhiemVu,
      btnFilterEventTinhTrangNhiemVu: this.btnFilterEventTinhTrangNhiemVu,
      //End JeeWF
      btnLoaiCongViec: this.btnLoaiCongViec,
      btnFilterEventDanhSachNhanVien: this.btnFilterEventDanhSachNhanVien,
      btnFilterEventDepartment27: this.btnFilterEventDepartment27,
      btnFilterEventDepartment28: this.btnFilterEventDepartment28,

      btnFilterEventTrangThaiCV36: this.btnFilterEventTrangThaiCV36,

      //Bổ sung filter lọc theo phạm vi
      btnFilterEventVaiTro: this.btnFilterEventVaiTro,
      btnFilterEventVaiTro9: this.btnFilterEventVaiTro9,
      btnFilterEventVaiTro17: this.btnFilterEventVaiTro17,
      btnFilterEventVaiTro18: this.btnFilterEventVaiTro18,
      btnFilterEventVaiTro10: this.btnFilterEventVaiTro10,
      btnFilterEventVaiTro25: this.btnFilterEventVaiTro25,
      btnLoadFilterEventVaiTro25: this.btnLoadFilterEventVaiTro25,

      btnFilterEventVaiTro33: this.btnFilterEventVaiTro33,//id = 33

      btnFilterEventCondition_Widget37: this.btnFilterEventCondition_Widget37,
      btnDeleteFilterEventCondition_Widget37: this.btnDeleteFilterEventCondition_Widget37,
      btnThietlapFilter_Widget37: this.btnThietlapFilter_Widget37,
      btnFilterEventMember_Widget37: this.btnFilterEventMember_Widget37,

      btnTienDo38: this.btnTienDo38,

      btnFilterEventCondition_Widget39: this.btnFilterEventCondition_Widget39,
      btnDeleteFilterEventCondition_Widget39: this.btnDeleteFilterEventCondition_Widget39,
      btnThietlapFilter_Widget39: this.btnThietlapFilter_Widget39,
      btnFilterEventTrangThaiCV39: this.btnFilterEventTrangThaiCV39,
      btnLoaiBieuDo39: this.btnLoaiBieuDo39,
      btnFilterEventVaiTro39: this.btnFilterEventVaiTro39,

      btnFilterEventThemCongViecDuan40: this.btnFilterEventThemCongViecDuan40,
      btnFilterEventCongviecDuan40: this.btnFilterEventCongviecDuan40,
      btnFilterEventVaiTro40: this.btnFilterEventVaiTro40,
      btnPriority40: this.btnPriority40,

      btnLoadTienDo24: this.btnLoadTienDo24,//id = 24
      btnLoadPriority24: this.btnLoadPriority24,
    };
    return inputs;
  }
  private btnFilterEvent: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventJAdmin: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventJR: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventJRYCCN: EventEmitter<any> = new EventEmitter<any>();

  LoadCongViec(widget, id_loaicongviec) {

    if (id_loaicongviec == 1) {
      this.labelCongViec = "Công việc tôi làm";
    } else {
      this.labelCongViec = "Công việc tôi giao";
    }
    this.updateVals(widget, id_loaicongviec);
    this.btnLoaiCongViec.emit(id_loaicongviec);
  }

  LoadChart(item) {
    this.btnLoaiBieuDo.emit(item.id_row);
  }

  LoadChart17(item) {
    this.btnLoaiBieuDo17.emit(item.id_row);
  }

  LoadChart18(item) {
    this.btnLoaiBieuDo18.emit(item.id_row);
  }

  LoadChart19(item) {
    this.btnLoaiBieuDo19.emit(item.id_row);
  }

  clickFilter(widget, filter: any) {
    if (widget.id == 5) {
      this.btnFilterEventJR.emit(filter.id);
      this.filterYCCD = filter.Title

    }
    if (widget.id == 4) {
      this.btnFilterEventJRYCCN.emit(filter.id);
      this.filterYCCN = filter.Title
    }

    if (widget.id == 3) {
      this.btnFilterEventJAdmin.emit(filter.id);
    }
    if (widget.id == 10) {
      this.btnFilterEventCongviecDuan.emit(filter.id_row);
      //Xử lý data thứ 1
      this.btn10value1 = filter.id_row
      let btn10value = this.btn10value1 + '|' + this.btn10value2 + '|' + this.btn10value3;
      this.updateVals(widget, btn10value);
    }
    if (widget.id == 11) {
      this.btnFilterEventLogDuan.emit(filter.id_row);
      this.updateVals(widget, filter.id_row);
    }
    if (widget.id == 9) {
      this.btnFilterEventTrangThaiCV.emit(filter.id_row);
      //Xử lý data thứ 1
      this.btn9value1 = filter.id_row
      let btn9value = this.btn9value1 + '|' + this.btn9value2;
      this.updateVals(widget, btn9value);
      this.widget9 = filter.id_row;
    }
    if (widget.id == 2) {
      this.btnFilterEventMember.emit(filter.id_row);
      this.updateVals(widget, filter.id_row);
      this.widget2 = filter.id_row;
    }

    if (widget.id == 12) {
      if (filter.id == 1) {
        this.loaiDonTu = 'Nghỉ phép/công tác';
      } else if (filter.id == 2) {
        this.loaiDonTu = 'Làm thêm giờ';
      } else if (filter.id == 3) {
        this.loaiDonTu = 'Đổi ca làm việc';
      } else {
        this.loaiDonTu = 'Giải trình chấm công';
      }
      this.IDloaiDonTu = filter.id;
      this.ShowThemMoi = true;
      this.tinhTrang = 'Chờ duyệt';
      this.btnFilterEventDTNS.emit(filter.id);
    }

    if (widget.id == 14) {
      if (filter.id == 1) {
        this.loainhiemvu = 'Giao cho tôi';
      } else if (filter.id == 2) {
        this.loainhiemvu = 'Tôi tạo';
      } else {
        this.loainhiemvu = 'Tôi theo dõi';
      }
      this.btnFilterEventLoaiNhiemVu.emit(filter.id);
    }
    if (widget.id == 16) {
      this.btnFilterEventTongHopDuAn.emit(filter.id_row);
      this.updateVals(widget, filter.id_row);
    }
    if (widget.id == 17) {
      this.btnFilterEventTrangThaiCV17.emit(filter.id_row);
      //Xử lý data thứ 1
      this.btn17value1 = filter.id_row
      let btn17value = this.btn17value1 + '|' + this.btn17value2;
      this.updateVals(widget, btn17value);
      this.widget17 = filter.id_row;
    }
    if (widget.id == 18) {
      this.btnFilterEventTrangThaiCV18.emit(filter.id_row);
      //Xử lý data thứ 1
      this.btn18value1 = filter.id_row
      let btn18value = this.btn18value1 + '|' + this.btn18value2;
      this.updateVals(widget, btn18value);

      this.widget18 = filter.id_row;
    }
    if (widget.id == 19) {
      this.btnFilterEventTrangThaiCV19.emit(filter.id_row);
      this.updateVals(widget, filter.id_row);
      this.widget19 = filter.id_row;
    }
    if (widget.id == 22) {
      this.btnFilterTag22.emit(filter.RowID);
      this.updateVals(widget, filter.RowID);
      this.widget22 = filter.RowID;
    }
    if (widget.id == 23) {
      this.btnFilterTag23.emit(filter.RowID);
      this.updateVals(widget, filter.RowID);
      this.widget23 = filter.RowID;
    }
    if (widget.id == 25) {
      this.btnFilterEventCongviecDuan25.emit(filter.id_row);
      this.updateVals(widget, filter.id_row);
    }
    if (widget.id == 27) {
      this.btnFilterEventDepartment27.emit(filter.id_row);
      this.updateVals(widget, filter.id_row);
    }
    if (widget.id == 28) {
      this.btnFilterEventDepartment28.emit(filter.id_row);
      //Xử lý data thứ 1
      this.btn28value1 = filter.id_row
      let btn28value = this.btn28value1 + '|' + this.btn28value2;
      this.updateVals(widget, btn28value);
    }
    if (widget.id == 31) {
      this.btnFilterEventChartTheoDoiNhiemVu.emit(filter.id_row);
      this.updateVals(widget, filter.id_row);
    }
    if (widget.id == 36) {
      this.btnFilterEventTrangThaiCV36.emit(filter.id_row);
      this.updateVals(widget, filter.id_row);
    }

    if (widget.id == 37) {
      this.btnFilterEventMember_Widget37.emit(filter.id_row);
      this.updateVals(widget, filter.id_row);
      this.widget37 = filter.id_row;
    }

    if (widget.id == 39) {
      this.btnFilterEventTrangThaiCV39.emit(filter.id_row);
      //Xử lý data thứ 1
      this.btn39value1 = filter.id_row
      let btn39value = this.btn39value1 + '|' + this.btn39value2;
      this.updateVals(widget, btn39value);
      this.widget39 = filter.id_row;
    }

    if (widget.id == 40) {
      this.btnFilterEventCongviecDuan40.emit(filter.id_row);
      //Xử lý data thứ 1
      this.btn40value1 = filter.id_row
      let btn40value = this.btn40value1 + '|' + this.btn40value2 + '|' + this.btn40value3;
      this.updateVals(widget, btn40value);
    }
  }

  clickFilterNhanVien(widget, filter: any) {
    this.btnFilterEventDanhSachNhanVien.emit(filter.id_nv);
    //Xử lý data thứ 2
    this.btn28value2 = filter.id_nv
    let btn28value = this.btn28value1 + '|' + this.btn28value2;
    this.updateVals(widget, btn28value);
  }

  clickFilterDieuKien(widget, filter: any) {
    this.btnFilterEventCondition.emit(filter);
    //this.updateVals(widget, filter.id_row);

  }
  clickDeleteFilterDieuKien(filter: any) {
    this.btnDeleteFilterEventCondition.emit(filter);
    //this.updateVals(widget, filter.id_row);

  }
  clickFilterDieuKien_TrangThaiCV(widget, filter: any) {
    this.btnFilterEventCondition_TrangThaiCV.emit(filter);
    //this.updateVals(widget, filter.id_row);

  }

  clickDeleteFilterDieuKien_TrangThaiCV(filter: any) {
    this.btnDeleteFilterEventCondition_TrangThaiCV.emit(filter);
    //this.updateVals(widget, filter.id_row);

  }

  clickDeleteFilterDieuKien_BDTG(filter: any) {
    this.btnDeleteFilterEventCondition_BDTG.emit(filter);
    //this.updateVals(widget, filter.id_row);

  }
  clickFilterDieuKien_BDTG(widget, filter: any) {
    this.btnFilterEventCondition_BDTG.emit(filter);
    //this.updateVals(widget, filter.id_row);

  }


  //widget18
  clickFilterDieuKien_Widget18(widget, filter: any) {
    this.btnFilterEventCondition_Widget18.emit(filter);
    //this.updateVals(widget, filter.id_row);

  }

  clickDeleteFilterDieuKien_Widget18(filter: any) {
    this.btnDeleteFilterEventCondition_Widget18.emit(filter);
    //this.updateVals(widget, filter.id_row);

  }


  //widget19
  clickFilterDieuKien_Widget19(widget, filter: any) {
    this.btnFilterEventCondition_Widget19.emit(filter);
    //this.updateVals(widget, filter.id_row);
  }

  clickDeleteFilterDieuKien_Widget19(filter: any) {
    this.btnDeleteFilterEventCondition_Widget19.emit(filter);
    //this.updateVals(widget, filter.id_row);

  }
  //hàm này dùng để reload dropdown thiết lập time
  clickbtnThietlapFilter() {
    this.btnThietlapFilter.emit();
    //this.updateVals(widget, filter.id_row);

  }

  clickbtnThietlapFilter_TrangThaiCV() {
    this.btnThietlapFilter_TrangThaiCV.emit();
    //this.updateVals(widget, filter.id_row);

  }
  clickbtnThietlapFilter_Widget18() {
    this.btnThietlapFilter_Widget18.emit();
    //this.updateVals(widget, filter.id_row);

  }
  clickbtnThietlapFilter_Widget19() {
    this.btnThietlapFilter_Widget19.emit();
    //this.updateVals(widget, filter.id_row);

  }
  clickbtnThietlapFilter_BDTG() {
    this.btnThietlapFilter_BDTG.emit();
    //this.updateVals(widget, filter.id_row);

  }

  clickFilterTinhTrang(widget, filter: any) {
    if (widget.id == 12) {
      if (filter.ID_Row == '') {
        this.tinhTrang = 'Tất cả';
      } else {
        if (filter.ID_Row == 1) {
          this.tinhTrang = 'Đã duyệt';
        } else if (filter.ID_Row == 2) {
          this.tinhTrang = 'Chờ duyệt';
        } else if (filter.ID_Row == 3) {
          if (this.IDloaiDonTu == 1) {
            this.tinhTrang = 'Đã hủy';
          }
          if (this.IDloaiDonTu == 4) {
            this.tinhTrang = 'Chưa gửi';
          }
        } else {
          this.tinhTrang = 'Không duyệt';
        }
      }

      this.btnFilterEventTinhTrangDTNS.emit(filter.ID_Row);
    }
    if (widget.id == 13) {
      if (filter.ID_Row == '') {
        this.tinhTrangDuyet = 'Tất cả';
      } else {
        if (filter.ID_Row == 1) {
          this.tinhTrangDuyet = 'Đã duyệt';
        } else if (filter.ID_Row == 2) {
          this.tinhTrangDuyet = 'Chờ duyệt';
        } else {
          this.tinhTrangDuyet = 'Không duyệt';
        }
      }
      this.btnFilterEventTinhTrangDuyetDTNS.emit(filter.ID_Row);
    }

    if (widget.id == 14) {
      this.tinhtrangnhiemvu = filter.Title + ' (' + filter.Value + ')';
      this.btnFilterEventTinhTrangNhiemVu.emit(filter.RowID);
    }
  }

  _iscolumnchart: boolean = false;
  _ispiechart: boolean = false;
  loaddata() {
    if (this.filterLoaibieudo == '0') {
      this._iscolumnchart = true;
      this._ispiechart = false;
    }
    if (this.filterLoaibieudo == '2') {
      this._ispiechart = true;
      this._iscolumnchart = false;
    }
  }
  updateVals(item, vals) {
    const widget = new WidgetModel(item);
    widget.vals = vals;
    this.pageGirdtersDashboardService
      .postUpdateWidget(widget)
      .pipe(takeUntil(this.subject))
      .subscribe((res) => {

      });
  }
  widget2 = '';
  widget9 = '';
  widget17 = '';
  widget18 = '';
  widget19 = '';
  widget22 = '';
  widget23 = '';
  FindIDprojectteam(DanhSach) {
    setTimeout(() => {
      DanhSach.forEach((item) => {
        if (item.id == 10) {
          let obj10 = item.vals.split('|');
          if (obj10.length > 0) {
            this.btn10value1 = obj10[0];
            this.btnFilterEventCongviecDuan.emit(obj10[0]);

            this.btnFilterEventVaiTro10.emit(obj10[1]);
            this.btn10value2 = obj10[1];

            this.btn10value3 = obj10[2] ? obj10[2] : '0';
            this.btnPriority10.emit(this.btn10value3);
            let objPriority = this.list_priority_10.find(x => +x.value == +this.btn10value3);
            if (objPriority) {
              this.itemfilter_chart10 = objPriority;
            }
          } else {
            this.btn10value1 = '0';
            this.btnFilterEventCongviecDuan.emit(0);
          }
        }
        if (item.id == 11 && item.vals) {
          this.btnFilterEventLogDuan.emit(item.vals);
        }
        if (item.id == 9 && item.vals) {
          let obj9 = item.vals.split('|');
          if (obj9.length == 2) {
            this.widget9 = obj9[0];
            this.btnFilterEventTrangThaiCV.emit(obj9[0]);
            this.btn9value1 = obj9[0];
            this.btnFilterEventVaiTro9.emit(obj9[1]);
            this.btn9value2 = obj9[1];
          } else {
            this.btnFilterEventTrangThaiCV.emit(obj9[0]);
            this.widget9 = obj9[0];
            this.btn9value1 = obj9[0];
          }
        }
        if (item.id == 2 && item.vals) {
          this.btnFilterEventMember.emit(item.vals);
          this.widget2 = item.vals;
        }
        if (item.id == 16 && item.vals) {
          let obj16 = item.vals.split('|');
          if (obj16.length == 2) {
            this.btnFilterEventTongHopDuAn.emit(obj16[0]);
            this.btn16value1 = obj16[0];
            this.btnFilterEventVaiTro.emit(obj16[1]);
            this.btn16value2 = obj16[1];
          } else {
            this.btnFilterEventTongHopDuAn.emit(obj16[0]);
            this.btn16value1 = obj16[0];
          }
        }
        if (item.id == 31 && item.vals) {
          this.btnFilterEventChartTheoDoiNhiemVu.emit(item.vals);
        }
        if (item.id == 17 && item.vals) {
          let obj17 = item.vals.split('|');
          if (obj17.length == 2) {
            this.btnFilterEventTrangThaiCV17.emit(obj17[0]);
            this.widget17 = obj17[0];
            this.btn17value1 = obj17[0];
            this.btnFilterEventVaiTro17.emit(obj17[1]);
            this.btn17value2 = obj17[1];
          } else {
            this.btnFilterEventTrangThaiCV17.emit(obj17[0]);
            this.btn17value1 = obj17[0];
          }
        }
        if (item.id == 18 && item.vals) {
          let obj18 = item.vals.split('|');
          if (obj18.length == 2) {
            this.btnFilterEventTrangThaiCV18.emit(obj18[0]);
            this.widget18 = obj18[0];
            this.btn18value1 = obj18[0];
            this.btnFilterEventVaiTro18.emit(obj18[1]);
            this.btn18value2 = obj18[1];
          } else {
            this.btnFilterEventTrangThaiCV18.emit(obj18[0]);
            this.btn18value1 = obj18[0];
          }
        }
        if (item.id == 19) {
          if (item.vals) {
            this.btnFilterEventTrangThaiCV19.emit(item.vals);
            this.widget19 = item.vals;
          } else {
            this.btnFilterEventTrangThaiCV19.emit(0);
          }
        }
        if (item.id == 7) {
          this.listStatus = [];
          if (item.vals) {
            this.btnTienDo7.emit(item.vals);
            let label7 = "";
            let title = "";
            item.vals.split(",").forEach(ele => {
              if (ele == "0") {
                label7 += ", " + "Tất cả";
                title = "Tất cả";
              } else if (ele == "1") {
                label7 += ", " + "Hoàn thành đúng hạn";
                title = "Hoàn thành đúng hạn";
              } else if (ele == "2") {
                label7 += ", " + "Hoàn thành quá hạn";
                title = "Hoàn thành quá hạn";
              } else if (ele == "3") {
                label7 += ", " + "Đang làm trong hạn";
                title = "Đang làm trong hạn";
              } else if (ele == "4") {
                label7 += ", " + "Sắp tới hạn";
                title = "Sắp tới hạn";
              } else if (ele == "5") {
                label7 += ", " + "Tới hạn";
                title = "Tới hạn";
              } else {
                label7 += ", " + "Quá hạn";
                title = "Quá hạn";
              }
              let item = {
                id: ele,
                title: title,
              }
              this.listStatus.push(item);
            });
            this.idWidget7 = item.vals;
            this.labelWidget7 = label7.substring(1);
          } else {
            this.btnTienDo7.emit("0");
            this.idWidget7 = "0";
            this.labelWidget7 = "Tất cả";
            let item = {
              id: this.idWidget7,
              title: this.labelWidget7,
            }
            this.listStatus.push(item)
          }
        }
        if (item.id == 20) {
          if (item.vals) {
            this.btnPriority20.emit(item.vals);
            let obj = this.list_priority_20.find(x => x.value == item.vals);
            if (obj) {
              this.itemfilter_chart20 = obj;
            }
          } else {
            this.btnPriority20.emit(0);
            this.itemfilter_chart20 = {
              name: 'Tất cả',
              value: 0,
              icon: 'far fa-flag',
            };
          }
        }
        if (item.id == 21) {
          if (item.vals) {
            this.btnPriority21.emit(item.vals);
            let obj = this.list_priority_21.find(x => x.value == item.vals);
            if (obj) {
              this.itemfilter_chart21 = obj;
            }
          } else {
            this.btnPriority21.emit(0);
            this.itemfilter_chart21 = {
              name: 'Tất cả',
              value: 0,
              icon: 'far fa-flag',
            };
          }
        }
        if (item.id == 22) {
          if (item.vals) {
            this.btnFilterTag22.emit(item.vals);
            this.widget22 = item.vals;
          } else {
            this.widget22 = '0';
            this.btnFilterTag22.emit(0);
          }
        }
        if (item.id == 23) {
          if (item.vals) {
            this.btnFilterTag23.emit(item.vals);
            this.widget23 = item.vals;
          } else {
            this.widget23 = '0';
            this.btnFilterTag23.emit(0);
          }
        }
        if (item.id == 24) {
          this.listStatus24 = [];
          let obj24 = item.vals.split('|');
          if (obj24.length == 2) {
            this.btn24value1 = obj24[0];
            this.btn24value2 = obj24[1] ? obj24[1] : '0';
            this.btnLoadPriority24.emit(this.btn24value2);
            let objPriority = this.list_priority_24.find(x => +x.value == +this.btn24value2);
            if (objPriority) {
              this.itemfilter_chart24 = objPriority;
            }
          } else {
            this.btn24value1 = obj24[0];
          }

          if (this.btn24value1) {
            this.btnLoadTienDo24.emit(this.btn24value1);
            let label24 = "";
            let title = "";
            this.btn24value1.split(",").forEach(ele => {
              // if (ele == "0") {
              //   label24 += ", " + "Tất cả";
              //   title = "Tất cả";
              // } else if (ele == "1") {
              //   label24 += ", " + "Hoàn thành đúng hạn";
              //   title = "Hoàn thành đúng hạn";
              // } else if (ele == "2") {
              //   label24 += ", " + "Hoàn thành quá hạn";
              //   title = "Hoàn thành quá hạn";
              // } else if (ele == "3") {
              //   label24 += ", " + "Đang làm trong hạn";
              //   title = "Đang làm trong hạn";
              // } else if (ele == "4") {
              //   label24 += ", " + "Sắp tới hạn";
              //   title = "Sắp tới hạn";
              // } else if (ele == "5") {
              //   label24 += ", " + "Tới hạn";
              //   title = "Tới hạn";
              // } else {
              //   label24 += ", " + "Quá hạn";
              //   title = "Quá hạn";
              // }
              // let item = {
              //   id: ele,
              //   title: title,
              // }
              // this.listStatus24.push(item);

              //Xử lý lại filter tien_do -> thay bằng 
              let obj_tiendo = this.tiendo.find(x => x.value == ele);
              if (obj_tiendo) {
                obj_tiendo.checked = true;
              }
            });


            // this.idWidget24 = this.btn24value1;
            // this.labelWidget24 = label24.substring(1);
            let t = this.tiendo.filter(t => t.checked);
            let a = '';
            for (let index = 0; index < t.length; index++) {
              const element = t[index];
              a = a + element.viewValue;
              if (index != t.length - 1) {
                a = a + ', '
              }
            }

            if (a == "") {
              this.labelWidget24 = "Tất cả";
              this.idWidget24 = "";
            } else {
              let labble = t.map(a => a.viewValue);
              this.labelWidget24 = labble.toString();
              let id = t.map(a => a.value);
              this.idWidget24 = id.toString();
            }

            this.updateAllTienDo();

          } else {
            this.btnLoadTienDo24.emit("0");
            this.idWidget24 = "0";
            this.labelWidget24 = "Tất cả";
            let item = {
              id: this.idWidget24,
              title: this.labelWidget24,
            }
            this.listStatus24.push(item)
          }
          this.changeDetect.detectChanges();
        }
        if (item.id == 25) {
          let obj25 = item.vals.split('|');
          if (obj25.length > 0) {
            if (obj25[1]) {
              this.btnLoadFilterEventVaiTro25.emit(obj25[1]);
              this.btn25value2 = obj25[1];
            }

            this.btn25value3 = obj25[2] ? obj25[2] : '0';
            this.btnLoadPriority25.emit(this.btn25value3);
            let objPriority = this.list_priority_25.find(x => +x.value == +this.btn25value3);
            if (objPriority) {
              this.itemfilter_chart25 = objPriority;
            }

            this.btn25value1 = obj25[0];
            this.btnLoadFilterEventCongviecDuan25.emit(obj25[0]);
          } else {
            this.btn25value1 = '0';
            this.btnLoadFilterEventCongviecDuan25.emit(0);
          }
        }
        if (item.id == 26 && item.vals) {
          if (item.vals == 1) {
            this.labelCongViec = "Công việc tôi làm";
          } else {
            this.labelCongViec = "Công việc tôi giao";
          }
          this.btnLoaiCongViec.emit(item.vals);

        }
        if (item.id == 27 && item.vals) {

          this.btnFilterEventDepartment27.emit(item.vals);

        }
        if (item.id == 28 && item.vals) {
          let arrayVal = item.vals.split("|");
          if (arrayVal[0] != undefined && arrayVal[0] != null) {
            this.btnFilterEventDepartment28.emit(arrayVal[0]);
            this.btn28value1 = arrayVal[0].toString();
          }
          if (arrayVal[1] != undefined && arrayVal[1] != null) {
            this.btnFilterEventDanhSachNhanVien.emit(arrayVal[1]);
            this.btn28value2 = arrayVal[1].toString();
          }
        }
        if (item.id == 29) {
          if (item.vals) {
            this.btn29.emit(item.vals);
            let obj = this.list_29.find(x => +x.value == +item.vals);
            if (obj) {
              this.item_29 = obj;
            }
          } else {
            this.btn29.emit(0);
            this.item_29 = {
              name: 'Tất cả',
              value: 0,
            };
          }
          this.changeDetectorRefs.detectChanges();
        }
        if (item.id == 30) {
          if (item.vals) {
            this.btn30.emit(item.vals);
            let obj = this.list_30.find(x => +x.value == +item.vals);
            if (obj) {
              this.item_30 = obj;
            }
          } else {
            this.btn30.emit(0);
            this.item_30 = {
              name: 'Tất cả',
              value: 0,
            };
          }
          this.changeDetectorRefs.detectChanges();
        }
        if (item.id == 33) {
          if (item.vals) {
            this.btnFilterEventVaiTro33.emit(item.vals);
            let obj = this.list_VaiTro_33.find(x => x.value == item.vals);
            if (obj) {
              this.itemfilter_VaiTro33 = obj;
            }
          } else {
            this.btnFilterEventVaiTro33.emit(1);
            this.itemfilter_VaiTro33 = {
              name: 'Tôi tạo',
              value: 1,
            };
          }
        }
        if (item.id == 36 && item.vals) {
          if (item.vals) {
            this.btnFilterEventTrangThaiCV36.emit(item.vals);
          }
          else {
            this.btnFilterEventTrangThaiCV36.emit(0)
          }
        }
        if (item.id == 37 && item.vals) {
          this.btnFilterEventMember_Widget37.emit(item.vals);
          this.widget37 = item.vals;
        }
        if (item.id == 38) {
          this.listStatus38 = [];
          if (item.vals) {
            this.btnTienDo38.emit(item.vals);
            let label38 = "";
            let title = "";
            item.vals.split(",").forEach(ele => {
              if (ele == "0") {
                label38 += ", " + "Tất cả";
                title = "Tất cả";
              } else if (ele == "1") {
                label38 += ", " + "Hoàn thành đúng hạn";
                title = "Hoàn thành đúng hạn";
              } else if (ele == "2") {
                label38 += ", " + "Hoàn thành quá hạn";
                title = "Hoàn thành quá hạn";
              } else if (ele == "3") {
                label38 += ", " + "Đang làm trong hạn";
                title = "Đang làm trong hạn";
              } else if (ele == "4") {
                label38 += ", " + "Sắp tới hạn";
                title = "Sắp tới hạn";
              } else if (ele == "5") {
                label38 += ", " + "Tới hạn";
                title = "Tới hạn";
              } else {
                label38 += ", " + "Quá hạn";
                title = "Quá hạn";
              }
              let item = {
                id: ele,
                title: title,
              }
              this.listStatus38.push(item);
            });
            this.idWidget38 = item.vals;
            this.labelWidget38 = label38.substring(1);
          } else {
            this.btnTienDo38.emit("0");
            this.idWidget38 = "0";
            this.labelWidget38 = "Tất cả";
            let item = {
              id: this.idWidget38,
              title: this.labelWidget38,
            }
            this.listStatus38.push(item)
          }
        }
        if (item.id == 39 && item.vals) {
          let obj39 = item.vals.split('|');
          if (obj39.length == 2) {
            this.widget39 = obj39[0];
            this.btnFilterEventTrangThaiCV39.emit(obj39[0]);
            this.btn39value1 = obj39[0];
            this.btnFilterEventVaiTro39.emit(obj39[1]);
            this.btn39value2 = obj39[1];
          } else {
            this.btnFilterEventTrangThaiCV39.emit(obj39[0]);
            this.widget39 = obj39[0];
            this.btn39value1 = obj39[0];
          }
        }
        if (item.id == 40) {
          let obj40 = item.vals.split('|');
          if (obj40.length > 0) {
            this.btn40value1 = obj40[0];
            this.btnFilterEventCongviecDuan40.emit(obj40[0]);

            this.btnFilterEventVaiTro40.emit(obj40[1]);
            this.btn40value2 = obj40[1];

            this.btn40value3 = obj40[2] ? obj40[2] : '0';
            this.btnPriority40.emit(this.btn40value3);
            let objPriority = this.list_priority_40.find(x => +x.value == +this.btn40value3);
            if (objPriority) {
              this.itemfilter_chart40 = objPriority;
            }
          } else {
            this.btn40value1 = '0';
            this.btnFilterEventCongviecDuan40.emit(0);
          }
        }
      });
    }, 1000);
  }
  setMyStyles(id_row: string, widgetid: number) {
    let styles = {};
    if (widgetid == 9) {
      styles = {
        'background-color': this.widget9 == '' + id_row ? '#d9e7fc' : '',
        'font-weight': this.widget9 == '' + id_row ? 'bold' : 'normal',
        color: this.widget9 == '' + id_row ? '#62a4ff' : (document.getElementsByClassName("light-mode").length > 0 ? 'black' : 'white'),
      };
    }

    return styles;
  }
  setMyStyles2(id_row: string, widgetid: number) {
    let styles = {};
    if (widgetid == 2) {
      styles = {
        'background-color': this.widget2 == '' + id_row ? '#d9e7fc' : '',
        'font-weight': this.widget2 == '' + id_row ? 'bold' : 'normal',
        color: this.widget2 == '' + id_row ? '#62a4ff' : (document.getElementsByClassName("light-mode").length > 0 ? 'black' : 'white'),
      };
    }

    return styles;
  }
  setMyStyles17(id_row: string, widgetid: number) {
    let styles = {};
    if (widgetid == 17) {
      styles = {
        'background-color': this.widget17 == '' + id_row ? '#d9e7fc' : '',
        'font-weight': this.widget17 == '' + id_row ? 'bold' : 'normal',
        color: this.widget17 == '' + id_row ? '#62a4ff' : (document.getElementsByClassName("light-mode").length > 0 ? 'black' : 'white'),
      };
    }

    return styles;
  }
  setMyStyles18(id_row: string, widgetid: number) {
    let styles = {};
    if (widgetid == 18) {
      styles = {
        'background-color': this.widget18 == '' + id_row ? '#d9e7fc' : '',
        'font-weight': this.widget18 == '' + id_row ? 'bold' : 'normal',
        color: this.widget18 == '' + id_row ? '#62a4ff' : (document.getElementsByClassName("light-mode").length > 0 ? 'black' : 'white'),
      };
    }

    return styles;
  }
  setMyStyles19(id_row: string, widgetid: number) {
    let styles = {};
    if (widgetid == 19) {
      styles = {
        'background-color': this.widget19 == '' + id_row ? '#d9e7fc' : '',
        'font-weight': this.widget19 == '' + id_row ? 'bold' : 'normal',
        color: this.widget19 == '' + id_row ? '#62a4ff' : (document.getElementsByClassName("light-mode").length > 0 ? 'black' : 'white'),
      };
    }

    return styles;
  }
  setMyStyles22(id_row: string, widgetid: number) {
    let styles = {};
    if (widgetid == 22) {
      styles = {
        'background-color': this.widget22 == '' + id_row ? '#d9e7fc' : '',
        'font-weight': this.widget22 == '' + id_row ? 'bold' : 'normal',
        color: this.widget22 == '' + id_row ? '#62a4ff' : (document.getElementsByClassName("light-mode").length > 0 ? 'black' : 'white'),
      };
    }
    return styles;
  }
  setMyStyles23(id_row: string, widgetid: number) {
    let styles = {};
    if (widgetid == 23) {
      styles = {
        'background-color': this.widget23 == '' + id_row ? '#d9e7fc' : '',
        'font-weight': this.widget23 == '' + id_row ? 'bold' : 'normal',
        color: this.widget23 == '' + id_row ? '#62a4ff' : (document.getElementsByClassName("light-mode").length > 0 ? 'black' : 'white'),
      };
    }
    return styles;
  }
  ThemCongViec(loai) {
    if (loai == 1) {
      this.btnFilterEventThemCongViecDuan.emit(loai);
    }
    if (loai == 25) {
      this.btnFilterEventThemCongViecDuan25.emit(loai);
    }
    if (loai == 40) {
      this.btnFilterEventThemCongViecDuan40.emit(loai);
    }
  }
  //=============================Xử lý cho widget = 16================
  date = new FormControl(moment());

  chosenYearHandler(normalizedYear: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  clickFilter10(widget, id_row: any) {
    if (widget.id == 10) {
      this.btnFilterEventCongviecDuan.emit(id_row);
      this.updateVals(widget, id_row);
    }
  }
  clickFilter22(widget, id_row: any) {
    if (widget.id == 22) {
      this.btnFilterTag22.emit(id_row);
      this.updateVals(widget, id_row);
      this.widget22 = id_row;
    }
  }
  clickFilter23(widget, id_row: any) {
    if (widget.id == 23) {
      this.btnFilterTag23.emit(id_row);
      this.updateVals(widget, id_row);
      this.widget23 = id_row;
    }
  }
  clickFilter25(widget, id_row: any) {
    if (widget.id == 25) {
      this.btnFilterEventCongviecDuan25.emit(id_row);
      //Xử lý data thứ 1
      this.btn25value1 = id_row;
      let btn25value = this.btn25value1 + '|' + this.btn25value2 + '|' + this.btn25value3;
      this.updateVals(widget, btn25value);
    }
  }

  clickFilterVaiTro(widget, filter: any) {
    if (widget.id == 16) {
      this.btnFilterEventVaiTro.emit(filter.id);
    }
    if (widget.id == 9) {
      this.btnFilterEventVaiTro9.emit(filter.id);
      this.btn9value2 = filter.id;
      let btn9value = this.btn9value1 + '|' + this.btn9value2;
      this.updateVals(widget, btn9value);
    }
    if (widget.id == 17) {
      this.btnFilterEventVaiTro17.emit(filter.id);
      //Xử lý data thứ 2
      this.btn17value2 = filter.id;
      let btn17value = this.btn17value1 + '|' + this.btn17value2;
      this.updateVals(widget, btn17value);
    }
    if (widget.id == 18) {
      this.btnFilterEventVaiTro18.emit(filter.id);
      //Xử lý data thứ 2
      this.btn18value2 = filter.id;
      let btn18value = this.btn18value1 + '|' + this.btn18value2;
      this.updateVals(widget, btn18value);
    }
    if (widget.id == 10) {
      this.btnFilterEventVaiTro10.emit(filter.id);
      //Xử lý data thứ 2
      this.btn10value2 = filter.id;
      let btn10value = this.btn10value1 + '|' + this.btn10value2 + '|' + this.btn10value3;
      this.updateVals(widget, btn10value);
    }
    if (widget.id == 25) {
      this.btnFilterEventVaiTro25.emit(filter.id);
      //Xử lý data thứ 2
      this.btn25value2 = filter.id;
      let btn25value = this.btn25value1 + '|' + this.btn25value2 + '|' + this.btn25value3;
      this.updateVals(widget, btn25value);
    }

    if (widget.id == 39) {
      this.btnFilterEventVaiTro39.emit(filter.id);
      //Xử lý data thứ 2
      this.btn39value2 = filter.id;
      let btn39value = this.btn39value1 + '|' + this.btn39value2;
      this.updateVals(widget, btn39value);
    }

    if (widget.id == 40) {
      this.btnFilterEventVaiTro40.emit(filter.id);
      //Xử lý data thứ 2
      this.btn40value2 = filter.id;
      let btn40value = this.btn40value1 + '|' + this.btn40value2 + '|' + this.btn40value3;
      this.updateVals(widget, btn40value);
    }
  }
  //===========================Xử lý cho widget 7 - Nhiệm vụ được giao=======================
  labelWidget7: string = 'Tất cả'
  idWidget7: string = '0';
  listStatus: any[] = [];
  changeStatus(val, id, title) {
    let item = {
      id: id,
      title: title,
    }
    if (val.checked) {
      this.listStatus.push(item);
    } else {
      let index = this.listStatus.findIndex(x => x.id == id);
      this.listStatus.splice(index, 1);
    }
  }

  changeStatusAll(widget) {
    let id = '';
    let label = '';
    this.listStatus.map((item, index) => {
      id += ',' + item.id;
      label += ',' + item.title;
    })
    if (id == "") {
      this.labelWidget7 = "Tất cả";
      this.idWidget7 = "";
    } else {
      this.labelWidget7 = label.substring(1);
      this.idWidget7 = id.substring(1);
    }
    this.btnTienDo7.emit(this.idWidget7);
    this.updateVals(widget, this.idWidget7);
  }

  getCheck(val): any {
    let obj = this.idWidget7.split(",").find(x => +x == +val);
    if (obj) {
      return true;
    }
    return false;
  }
  //===========================Xử lý cho widget 20=======================
  itemfilter_chart20: any = {
    name: 'Tất cả',
    value: 0,
    icon: 'far fa-flag',
  };
  list_priority_20 = [
    {
      name: 'Tất cả',
      value: 0,
      icon: 'far fa-flag',
    },
    {
      name: 'Khẩn cấp',//Urgent
      value: 1,
      icon: 'fab fa-font-awesome-flag text-danger',
    },
    {
      name: 'Cao',//High
      value: 2,
      icon: 'fab fa-font-awesome-flag text-warning',
    },
    {
      name: 'Bình thường',//Normal
      value: 3,
      icon: 'fab fa-font-awesome-flag text-info',
    },
    {
      name: 'Thấp',//Low
      value: 4,
      icon: 'fab fa-font-awesome-flag text-muted',
    },

  ];
  LoadPriority20(widget, item) {
    this.btnPriority20.emit(item.value);
    this.updateVals(widget, item.value);
  }
  LoadTienDo7(widget, item) {
    this.btnTienDo7.emit(item.value);
    this.updateVals(widget, item.value);
  }
  LoadTienDo24(widget, item) {
    this.btnTienDo24.emit(item.value);
    this.updateVals(widget, item.value);
  }
  Load29(widget, item) {
    this.btn29.emit(item.value);
    this.updateVals(widget, item.value);
  }
  Load30(widget, item) {
    this.btn30.emit(item.value);
    this.updateVals(widget, item.value);
  }
  //===========================Xử lý cho widget 21=======================
  itemfilter_chart21: any = {
    name: 'Tất cả',
    value: 0,
    icon: 'far fa-flag',
  };
  list_priority_21 = [
    {
      name: 'Tất cả',
      value: 0,
      icon: 'far fa-flag',
    },
    {
      name: 'Khẩn cấp',//Urgent
      value: 1,
      icon: 'fab fa-font-awesome-flag text-danger',
    },
    {
      name: 'Cao',//High
      value: 2,
      icon: 'fab fa-font-awesome-flag text-warning',
    },
    {
      name: 'Bình thường',//Normal
      value: 3,
      icon: 'fab fa-font-awesome-flag text-info',
    },
    {
      name: 'Thấp',//Low
      value: 4,
      icon: 'fab fa-font-awesome-flag text-muted',
    },

  ];
  LoadPriority21(widget, item) {
    this.btnPriority21.emit(item.value);
    this.updateVals(widget, item.value);
  }

  //===========================Xử lý cho widget 24 - Nhiệm vụ được giao=======================
  labelWidget24: string = 'Tất cả'
  idWidget24: string = '0';
  listStatus24: any[] = [];
  changeStatus24(val, id, title) {
    let item = {
      id: id,
      title: title,
    }
    if (val.checked) {
      this.listStatus24.push(item);
    } else {
      let index = this.listStatus24.findIndex(x => x.id == id);
      this.listStatus24.splice(index, 1);
    }
  }

  changeStatusAll24(widget) {
    let id = '';
    let label = '';
    this.listStatus24.map((item, index) => {
      id += ',' + item.id;
      label += ',' + item.title;
    })
    if (id == "") {
      this.labelWidget24 = "Tất cả";
      this.idWidget24 = "";
    } else {
      this.labelWidget24 = label.substring(1);
      this.idWidget24 = id.substring(1);
    }
    this.btnTienDo24.emit(this.idWidget24);
    this.updateVals(widget, this.idWidget24);
  }

  getCheck24(val): any {
    let obj = this.idWidget24.split(",").find(x => +x == +val);
    if (obj) {
      return true;
    }
    return false;
  }

  itemfilter_chart24: any = {
    name: 'Tất cả',
    value: 0,
    icon: 'far fa-flag',
  };
  list_priority_24 = [
    {
      name: 'Tất cả',
      value: 0,
      icon: 'far fa-flag',
    },
    {
      name: 'Khẩn cấp',//Urgent
      value: 1,
      icon: 'fab fa-font-awesome-flag text-danger',
    },
    {
      name: 'Cao',//High
      value: 2,
      icon: 'fab fa-font-awesome-flag text-warning',
    },
    {
      name: 'Bình thường',//Normal
      value: 3,
      icon: 'fab fa-font-awesome-flag text-info',
    },
    {
      name: 'Thấp',//Low
      value: 4,
      icon: 'fab fa-font-awesome-flag text-muted',
    },

  ];
  LoadPriority24(widget, item) {
    this.btnPriority24.emit(item.value);
    this.btn24value2 = item.value;
    let btn24value = this.btn24value1 + '|' + this.btn24value2;
    this.updateVals(widget, btn24value);
  }

  allTienDo;
  updateAllTienDo() {
    this.allTienDo = this.tiendo != null && this.tiendo.every(t => t.checked);
  }

  someCompleteTienDo(): boolean {
    if (this.tiendo == null) {
      return false;
    }
    return this.tiendo.filter(t => t.checked).length > 0 && !this.allTienDo;
  }
  setAllTienDo(completed: boolean) {
    this.allTienDo = completed;
    if (this.tiendo == null) {
      return;
    }
    this.tiendo.forEach(t => (t.checked = completed));
  }

  tiendo: dropdownTienDo[] = [
    { value: '1', viewValue: 'Hoàn thành đúng hạn', checked: false },
    { value: '2', viewValue: 'Hoàn thành quá hạn', checked: false },
    { value: '3', viewValue: 'Còn trong hạn', checked: false },
    { value: '4', viewValue: 'Sắp tới hạn', checked: false },
    { value: '5', viewValue: 'Tới hạn', checked: false },
    { value: '6', viewValue: 'Quá hạn', checked: false },
  ];

  changeTienDo(widget) {

    let t = this.tiendo.filter(t => t.checked);
    let a = '';
    for (let index = 0; index < t.length; index++) {
      const element = t[index];
      a = a + element.viewValue;
      if (index != t.length - 1) {
        a = a + ', '
      }
    }

    if (a == "") {
      this.labelWidget24 = "Tất cả";
      this.idWidget24 = "";
    } else {
      let labble = t.map(a => a.viewValue);
      this.labelWidget24 = labble.toString();
      let id = t.map(a => a.value);
      this.idWidget24 = id.toString();
    }
    this.btnTienDo24.emit(this.idWidget24);
    this.updateVals(widget, this.idWidget24);


  }
  //====================Xử lý cho widget tổng hợp công việc 29============
  //===========================Xử lý cho widget 29=======================
  item_29: any = {
    name: 'Tất cả',
    value: 0,
  };
  list_29 = [
    {
      name: 'Tất cả',
      value: 0,
    },
    {
      name: 'Được giao',
      value: 1,
    },
    {
      name: 'Đã giao',
      value: 2,
    },
    {
      name: 'Theo dõi',
      value: 3,
    },
  ];
  //====================Xử lý cho widget khối lượng công việc 30============
  item_30: any = {
    name: 'Tất cả',
    value: 0,
  };
  list_30 = [
    {
      name: 'Tất cả',
      value: 0,
    },
    {
      name: 'Được giao',
      value: 1,
    },
    {
      name: 'Đã giao',
      value: 2,
    },
    {
      name: 'Theo dõi',
      value: 3,
    },
  ];
  clickFilterDieuKien_Widget30(widget, filter: any) {
    this.btnFilterEventCondition_Widget30.emit(filter);
  }
  clickbtnThietlapFilter_Widget30() {
    this.btnThietlapFilter_Widget30.emit();
  }

  Update_SetTime(item, id_custom = 0) {
    const dialogRef = this.dialog.open(EditPopupWidgetTimeComponent, {
      data: { item, id_custom },
      panelClass: 'sky-padding-0',
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.clickbtnThietlapFilter();
        this.clickbtnThietlapFilter_TrangThaiCV();
        this.clickbtnThietlapFilter_BDTG();
        this.clickbtnThietlapFilter_Widget18();
        this.clickbtnThietlapFilter_Widget19();
        this.clickbtnThietlapFilter_Widget30();
        this.clickbtnThietlapFilter_Widget37();
        this.clickbtnThietlapFilter_Widget39();
        return;
      } else {
        this.clickbtnThietlapFilter();
        this.clickbtnThietlapFilter_TrangThaiCV();
        this.clickbtnThietlapFilter_BDTG();
        this.clickbtnThietlapFilter_Widget18();
        this.clickbtnThietlapFilter_Widget19();
        this.clickbtnThietlapFilter_Widget30();
        this.clickbtnThietlapFilter_Widget37();
        this.clickbtnThietlapFilter_Widget39();
        // this.changeDetect.detectChanges();
      }
    });
  }

  Update_SetTime_WorkV1(item, id_custom = 0) {
    const dialogRef = this.dialog.open(EditPopupWidgetTimeV1Component, {
      data: { item, id_custom },
      panelClass: 'sky-padding-0',
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.clickbtnThietlapFilter_Widget37();
        this.clickbtnThietlapFilter_Widget39();
        return;
      } else {
        this.clickbtnThietlapFilter_Widget37();
        this.clickbtnThietlapFilter_Widget39();
      }
    });
  }
  //===========================Xử lý cho widget 10 (bổ sung lọc theo độ ưu tiên)=======================
  itemfilter_chart10: any = {
    name: 'Tất cả',
    value: 0,
    icon: 'far fa-flag',
  };
  list_priority_10 = [
    {
      name: 'Tất cả',
      value: 0,
      icon: 'far fa-flag',
    },
    {
      name: 'Khẩn cấp',//Urgent
      value: 1,
      icon: 'fab fa-font-awesome-flag text-danger',
    },
    {
      name: 'Cao',//High
      value: 2,
      icon: 'fab fa-font-awesome-flag text-warning',
    },
    {
      name: 'Bình thường',//Normal
      value: 3,
      icon: 'fab fa-font-awesome-flag text-info',
    },
    {
      name: 'Thấp',//Low
      value: 4,
      icon: 'fab fa-font-awesome-flag text-muted',
    },

  ];
  LoadPriority10(widget, item) {
    this.btnPriority10.emit(item.value);
    this.btn10value3 = item.value;
    let btn10value = this.btn10value1 + '|' + this.btn10value2 + '|' + this.btn10value3;
    this.updateVals(widget, btn10value);
  }

  //===========================Xử lý cho widget 25 (bổ sung lọc theo độ ưu tiên)=======================
  itemfilter_chart25: any = {
    name: 'Tất cả',
    value: 0,
    icon: 'far fa-flag',
  };
  list_priority_25 = [
    {
      name: 'Tất cả',
      value: 0,
      icon: 'far fa-flag',
    },
    {
      name: 'Khẩn cấp',//Urgent
      value: 1,
      icon: 'fab fa-font-awesome-flag text-danger',
    },
    {
      name: 'Cao',//High
      value: 2,
      icon: 'fab fa-font-awesome-flag text-warning',
    },
    {
      name: 'Bình thường',//Normal
      value: 3,
      icon: 'fab fa-font-awesome-flag text-info',
    },
    {
      name: 'Thấp',//Low
      value: 4,
      icon: 'fab fa-font-awesome-flag text-muted',
    },

  ];
  LoadPriority25(widget, item) {
    this.btnPriority25.emit(item.value);
    this.btn25value3 = item.value;
    let btn25value = this.btn25value1 + '|' + this.btn25value2 + '|' + this.btn25value3;
    this.updateVals(widget, btn25value);
  }
  //====================Xử lý cho widget 33=====================
  LoadVaiTro33(widget, item) {
    this.btnFilterEventVaiTro33.emit(item.value);
    this.updateVals(widget, item.value);
  }
  //===============Hiển thị title and add work==========================
  public title_Dash: string;
  public istaskbar: string = '0';
  public image: string;
  btnAdd: boolean = false; //Chặn trường hợp click nhiều lần mở popup công việc

  Add() {
    this.btnAdd = true;
    const workModel = new WorkModel();
    workModel.clear(); // Set all defaults fields
    this.Update(workModel);
  }

  Update(_item: any) {
    this.router.navigate(['', { outlets: { auxName: 'auxWork/AddGOV/0' }, }]);
  }

  Add2() {
    this.btnAdd = true;
    const workModel = new WorkModel();
    workModel.clear(); // Set all defaults fields
    this.Update2(workModel);
  }

  Update2(_item: any) {
    this.router.navigate(['', { outlets: { auxName: 'auxWork/AddGOV2/0' }, }]);
  }

  //===========Xử lý trường hợp widget 37 - Tổng hợp nhiệm vụ - Work===================
  filterDieuKienLoc_Widget37: any = [];
  private btnFilterEventCondition_Widget37: EventEmitter<any> = new EventEmitter<any>();
  private btnDeleteFilterEventCondition_Widget37: EventEmitter<any> = new EventEmitter<any>();
  private btnThietlapFilter_Widget37: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventMember_Widget37: EventEmitter<any> = new EventEmitter<any>();
  widget37: string = '';
  filterDSTrangthaiMember_Widget37: any = [];

  clickFilterDieuKien_Widget37(widget, filter: any) {
    this.btnFilterEventCondition_Widget37.emit(filter);
  }

  clickbtnThietlapFilter_Widget37() {
    this.btnThietlapFilter_Widget37.emit();
  }

  setMyStyles37(id_row: string, widgetid: number) {
    let styles = {};
    if (widgetid == 37) {
      styles = {
        'background-color': this.widget37 == '' + id_row ? '#d9e7fc' : '',
        'font-weight': this.widget37 == '' + id_row ? 'bold' : 'normal',
        color: this.widget37 == '' + id_row ? '#62a4ff' : (document.getElementsByClassName("light-mode").length > 0 ? 'black' : 'white'),
      };
    }
    return styles;
  }
  //===========Xử lý trường hợp widget 38 - Nhiệm vụ được giao - Work============
  private btnTienDo38: EventEmitter<any> = new EventEmitter<any>();

  labelWidget38: string = 'Tất cả'
  idWidget38: string = '0';
  listStatus38: any[] = [];
  changeStatus_Widget38(val, id, title) {
    let item = {
      id: id,
      title: title,
    }
    if (val.checked) {
      this.listStatus38.push(item);
    } else {
      let index = this.listStatus38.findIndex(x => x.id == id);
      this.listStatus38.splice(index, 1);
    }
  }

  changeStatusAll_Widget38(widget) {
    let id = '';
    let label = '';
    this.listStatus38.map((item, index) => {
      id += ',' + item.id;
      label += ',' + item.title;
    })
    if (id == "") {
      this.labelWidget38 = "Tất cả";
      this.idWidget38 = "";
    } else {
      this.labelWidget38 = label.substring(1);
      this.idWidget38 = id.substring(1);
    }
    this.btnTienDo38.emit(this.idWidget38);
    this.updateVals(widget, this.idWidget38);
  }

  getCheck_Widget38(val): any {
    let obj = this.idWidget38.split(",").find(x => +x == +val);
    if (obj) {
      return true;
    }
    return false;
  }
  //===========Xử lý trường hợp widget 39 - Thời hạn nhiệm vụ - Work===================
  filterDieuKienLoc_Widget39: any = [];
  filterDSTrangThaiduan_Widget39: any = [];
  widget39 = '';
  itemfilter_chart39: any = {
    id_row: 0,
    title: 'Hình cột',
  };
  filter_chart39: any[] = [
    {
      id_row: 0,
      title: 'Hình cột',
    },
    {
      id_row: 1,
      title: 'Hình tròn',
    },
  ];
  private btnFilterEventCondition_Widget39: EventEmitter<any> = new EventEmitter<any>();
  private btnDeleteFilterEventCondition_Widget39: EventEmitter<any> = new EventEmitter<any>();
  private btnThietlapFilter_Widget39: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventTrangThaiCV39: EventEmitter<any> = new EventEmitter<any>();

  clickFilterDieuKien_Widget39(widget, filter: any) {
    this.btnFilterEventCondition_Widget39.emit(filter);
  }

  clickbtnThietlapFilter_Widget39() {
    this.btnThietlapFilter_Widget39.emit();
  }

  setMyStyles_Widget39(id_row: string, widgetid: number) {
    let styles = {};
    if (widgetid == 9) {
      styles = {
        'background-color': this.widget39 == '' + id_row ? '#d9e7fc' : '',
        'font-weight': this.widget39 == '' + id_row ? 'bold' : 'normal',
        color: this.widget39 == '' + id_row ? '#62a4ff' : (document.getElementsByClassName("light-mode").length > 0 ? 'black' : 'white'),
      };
    }

    return styles;
  }

  filterDSvaitro39: any = [];
  private btnFilterEventVaiTro39: EventEmitter<any> = new EventEmitter<any>();

  private btnLoaiBieuDo39: EventEmitter<any> = new EventEmitter<any>();
  LoadChart39(item) {
    this.btnLoaiBieuDo39.emit(item.id_row);
  }
  //===========Xử lý trường hợp widget 40 - Danh sách nhiệm vụ - Work===================
  private btnFilterEventThemCongViecDuan40: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventCongviecDuan40: EventEmitter<any> = new EventEmitter<any>();
  filterDSduan40: any = [];
  clickFilter40(widget, id_row: any) {
    if (widget.id == 40) {
      this.btnFilterEventCongviecDuan40.emit(id_row);
      this.updateVals(widget, id_row);
    }
  }
  filterDSvaitro40: any = [];
  private btnFilterEventVaiTro40: EventEmitter<any> = new EventEmitter<any>();

  itemfilter_chart40: any = {
    name: 'Tất cả',
    value: 0,
    icon: 'far fa-flag',
  };
  list_priority_40 = [
    {
      name: 'Tất cả',
      value: 0,
      icon: 'far fa-flag',
    },
    {
      name: 'Khẩn cấp',//Urgent
      value: 1,
      icon: 'fab fa-font-awesome-flag text-danger',
    },
    {
      name: 'Cao',//High
      value: 2,
      icon: 'fab fa-font-awesome-flag text-warning',
    },
    {
      name: 'Bình thường',//Normal
      value: 3,
      icon: 'fab fa-font-awesome-flag text-info',
    },
    {
      name: 'Thấp',//Low
      value: 4,
      icon: 'fab fa-font-awesome-flag text-muted',
    },

  ];
  LoadPriority40(widget, item) {
    this.btnPriority40.emit(item.value);
    this.btn10value3 = item.value;
    let btn10value = this.btn10value1 + '|' + this.btn10value2 + '|' + this.btn10value3;
    this.updateVals(widget, btn10value);
  }

  private btnPriority40: EventEmitter<any> = new EventEmitter<any>();

  //=============================================================================

  getHeight(): any {
    let tmp_height = 0;
    if (this.istaskbar == "1") {
      tmp_height = window.innerHeight - 70;
    } else {
      tmp_height = window.innerHeight - 10;
    }
    return tmp_height + 'px';
  }

  //===============================================================================
  CheckAdmin() {
    // this.checkchangePass();
    this.pageGirdtersDashboardService.checkAdmin().subscribe(res => {
      if (res && res.status == 1) {
        if (res.data.Type == 1) {
          if(res.data.StepID == 0){
            this.router.navigate(['/Config-System']);
          }else{
            this.router.navigate(['/Config-System/' + res.data.StepID]);
          }
        } else if (res.data.Type == 2) {
          this.layoutUtilsService.Confirm_APP('Xác nhận', 'Một số ứng dụng bạn quản trị chưa được khởi tạo',
            "Để sau", "Đồng ý")
            .then((res) => {
              if (res) {
                this.router.navigate(['/Guide']);
              }else{
                this.checkchangePass();
              }
            })
            .catch((err) => { });
        } else {
          this.checkchangePass();
        }
      }else {
        this.checkchangePass();
      }
    })
  }

  //=================================================================
  checkchangePass() {
    this.pageGirdtersDashboardService.getCode().subscribe(res => {
      if (res && res.status == 1) {
        if (res.RequirePassChange) {
          this.resetPassword();
        }
        //=======================Bổ sung chức năng hướng dẫn====================
        if (window.location.host != "app.egov.binhthuan.gov.vn") {
          this.tourGuideService.checkTourGuide('dashboard', 5);
        }
      }
    })
  }

  resetPassword() {
    const user = this.auth.getAuthFromLocalStorage();
    let username = user['user'].username;
    const dialogRef = this.dialog.open(ChangePasswordEditDialogComponent, {
      data: { username: username, isshow: false },
      panelClass: ['sky-padding-0', 'mat-dialog-popup', 'with40'],
      disableClose: true
    });
    const sb = dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      } else {
        this.auth.logout();
      }
    });
  }
}
