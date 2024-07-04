import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DisplayGrid, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResultModel } from '../../models/_base.model';
import { AddCloseWidgetDialogComponent } from './add-close-widget-dialog/add-close-widget-dialog.component';
import { EditPopupWidgetTimeComponent } from './edit-popup-widget-time/edit-popup-widget-time.component';
import { Dashboard, Widget, WidgetModel, WorkModel } from './Model/panel-dashboard.model';
import { PanelDashboardService } from './Services/panel-dashboard.service';
import { Router } from '@angular/router';
import { DanhMucChungService } from '../../services/danhmuc.service';

@Component({
  selector: 'app-panel-dashboard',
  templateUrl: './panel-dashboard.component.html',
  styleUrls: ['./panel-dashboard.component.scss']
})
export class PanelDashboardComponent implements OnInit, OnDestroy {
  public listWidget: Widget[] = [];
  public options: GridsterConfig;
  public WidgetDashboard: Dashboard;
  public dashboard: Array<GridsterItem>;
  subject = new Subject();
  private resizeEvent: EventEmitter<any> = new EventEmitter<any>();

  public inputs = {
    widget: '',
  };
  public outputs = {
    filterDieuKienLoc_TrangThaiCV: (res) => {
      this.filterDieuKienLoc_TrangThaiCV = res;//Widget id 9
    },
    filterDSTrangThaiduan: (res) => {
      this.filterDSTrangThaiduan = res;//Widget id 9
    },
    filterDanhSachPhongBan: (res) => {
      this.filterDSphongban = res;//Widget id 16 
    },
    filterDieuKienLoc_BDTG: (res) => {
      this.filterDieuKienLoc_BDTG = res;//Widget id 17
    },
    filterDSTrangThaiduan17: (res) => {
      this.filterDSTrangThaiduan17 = res;//Widget id 17
    },
    filterDieuKienLoc_Widget18: (res) => {
      this.filterDieuKienLoc_Widget18 = res;//Widget id 18
    },
    filterDSTrangThaiduan18: (res) => {
      this.filterDSTrangThaiduan18 = res;//Widget id 18
    },
    filterDanhSachDuAn25: (res) => {
      this.filterDSduan25 = res;//Widget id 25
    },
    filterDSTrangThaiduan36: (res) => {
      this.filterDSTrangThaiduan36 = res;//Widget id 36
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
    filterDanhSachVaiTro25: (res) => {
      this.filterDSvaitro25 = res;
    },
  };

  //Start khai báo widget 9
  filterDieuKienLoc_TrangThaiCV: any = [];
  filterDSTrangThaiduan: any = [];
  private btnFilterEventCondition_TrangThaiCV: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventTrangThaiCV: EventEmitter<any> = new EventEmitter<any>();
  private btnLoaiBieuDo: EventEmitter<any> = new EventEmitter<any>();
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
  widget9 = '';
  //End khai báo widget 9

  //Start khai báo widget 16
  filterDSphongban: any = []; v
  private btnFilterEventTongHopDuAn: EventEmitter<any> = new EventEmitter<any>();
  private btnThietlapFilter_TrangThaiCV: EventEmitter<any> = new EventEmitter<any>();
  //End khai báo widget 16

  //Start khai báo widget 17
  filterDieuKienLoc_BDTG: any = [];
  filterDSTrangThaiduan17: any = [];
  private btnFilterEventCondition_BDTG: EventEmitter<any> = new EventEmitter<any>();
  private btnLoaiBieuDo17: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventTrangThaiCV17: EventEmitter<any> = new EventEmitter<any>();
  private btnThietlapFilter_BDTG: EventEmitter<any> = new EventEmitter<any>();
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
  widget17 = '';
  //End khai báo widget 17
  //Start khai báo widget 18
  filterDieuKienLoc_Widget18: any = [];
  private btnFilterEventCondition_Widget18: EventEmitter<any> = new EventEmitter<any>();
  private btnLoaiBieuDo18: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventTrangThaiCV18: EventEmitter<any> = new EventEmitter<any>();
  private btnThietlapFilter_Widget18: EventEmitter<any> = new EventEmitter<any>();
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
  filterDSTrangThaiduan18: any = [];
  widget18: string;
  //End khai báo widget 18  

  //Start khai báo widget 20   
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
      icon: 'far fa-flag text-danger',
    },
    {
      name: 'Cao',//High
      value: 2,
      icon: 'far fa-flag text-warning',
    },
    {
      name: 'Bình thường',//Normal
      value: 3,
      icon: 'far fa-flag text-info',
    },
    {
      name: 'Thấp',//Low
      value: 4,
      icon: 'far fa-flag text-muted',
    },

  ];
  private btnPriority20: EventEmitter<any> = new EventEmitter<any>();
  //End khai báo widget 20 

  //Start khai báo widget 21
  itemfilter_chart21: any = {
    name: 'Tất cả',
    value: 0,
    icon: 'far fa-flag fa-flag',
  };
  list_priority_21 = [
    {
      name: 'Tất cả',
      value: 0,
      icon: 'far fa-flag fa-flag',
    },
    {
      name: 'Khẩn cấp',//Urgent
      value: 1,
      icon: 'far fa-flag text-danger',
    },
    {
      name: 'Cao',//High
      value: 2,
      icon: 'far fa-flag text-warning',
    },
    {
      name: 'Bình thường',//Normal
      value: 3,
      icon: 'far fa-flag text-info',
    },
    {
      name: 'Thấp',//Low
      value: 4,
      icon: 'far fa-flag text-muted',
    },

  ];
  private btnPriority21: EventEmitter<any> = new EventEmitter<any>();
  //End khai báo widget 21

  //Start khai báo widget 24
  labelWidget24: string = 'Tất cả'
  idWidget24: string = '0';
  listStatus24: any[] = [];
  //===Xử lý riêng khi click từng drd
  private btnTienDo24: EventEmitter<any> = new EventEmitter<any>();
  private btnPriority24: EventEmitter<any> = new EventEmitter<any>();
  //===Xử lý riêng khi vừa vào trang
  private btnLoadTienDo24: EventEmitter<any> = new EventEmitter<any>();
  private btnLoadPriority24: EventEmitter<any> = new EventEmitter<any>();
  //End khai báo widget 24

  //Start khai báo widget 25
  private btnFilterEventThemCongViecDuan25: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventCongviecDuan25: EventEmitter<any> = new EventEmitter<any>();
  filterDSduan25: any = [];
  private btnPriority25: EventEmitter<any> = new EventEmitter<any>();
  //===Xử lý riêng khi vừa vào trang
  private btnLoadFilterEventCongviecDuan25: EventEmitter<any> = new EventEmitter<any>();
  private btnLoadFilterEventVaiTro25: EventEmitter<any> = new EventEmitter<any>();
  private btnLoadPriority25: EventEmitter<any> = new EventEmitter<any>();
  //End khai báo widget 25

  public title_Dash: string;
  public istaskbar: string = '0';
  public image: string;

  //widget Danh sách nhiệm vụ đơn vị được giao (36)
  widget36 = '';
  filterDSTrangThaiduan36: any = [];
  private btnFilterEventTrangThaiCV36: EventEmitter<any> = new EventEmitter<any>();
  //End khai báo widget 36

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

  //Start khai báo các button để lưu tạm giá trị value từng widget======
  btn9value1: string = '';
  btn9value2: string = '';
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
  //End khai báo các button để lưu tạm giá trị value từng widget======
  constructor(
    private _PanelDashboardService: PanelDashboardService,
    private _ChangeDetectorRef: ChangeDetectorRef,
    public _MatDialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog,
    private router: Router,
    public DanhMucChungService: DanhMucChungService,
  ) { }

  ngOnInit(): void {
    this.DanhMucChungService.getthamso();
    this.listWidget = this._PanelDashboardService.getWidgets();
    this.WidgetDashboard = new Dashboard();
    this.options = this._PanelDashboardService.getDashBoardOptions();
    this.options.displayGrid = DisplayGrid.OnDragAndResize;
    this.options.itemChangeCallback = (item: Widget) => {
      const widget = new WidgetModel(item);
      this._PanelDashboardService
        .postUpdateWidget(widget)
        .pipe(takeUntil(this.subject))
        .subscribe((res) => {
          this.resizeEvent.emit(item);
        });
    };

    this._PanelDashboardService
      .getDSWidget()
      .pipe(takeUntil(this.subject))
      .subscribe((res: ResultModel<Widget>) => {
        if (res.data.length > 0) {
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
        this.FindIDprojectteam(this.dashboard);

        this._ChangeDetectorRef.detectChanges();
      });

    setTimeout(() => {
      this.title_Dash = localStorage.getItem('titlecustomerID');
      this.istaskbar = localStorage.getItem('istaskbarcustomerID');
      this.image = localStorage.getItem('logocustomerID');
      this._ChangeDetectorRef.detectChanges();
    }, 1000);
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  AddCloseWidget() {
    const dialogRef = this._MatDialog.open(AddCloseWidgetDialogComponent, {
      data: { dashboard: this.dashboard },
      panelClass: ['sky-padding-0', 'width700'],
      disableClose: true,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.subject))
      .subscribe((res) => {
        this.ngOnInit();
        setTimeout(() => {
        }, 500);
        this._ChangeDetectorRef.detectChanges();
      });
  }

  closeWidget(id: number) {
    this._PanelDashboardService
      .deleteWidget(id)
      .pipe(takeUntil(this.subject))
      .subscribe((res) => {
        if (res && res.status === 1) {
          this.ngOnInit();
          this._ChangeDetectorRef.detectChanges();
        }
      });
  }

  getInput(wiget: Widget): any {
    const inputs = {
      widget: wiget,
      resizeEvent: this.resizeEvent,
      btnLoaiBieuDo: this.btnLoaiBieuDo,//id = 9
      btnFilterEventCondition_TrangThaiCV: this.btnFilterEventCondition_TrangThaiCV,//id = 9
      btnFilterEventTrangThaiCV: this.btnFilterEventTrangThaiCV,//id = 9
      btnThietlapFilter_TrangThaiCV: this.btnThietlapFilter_TrangThaiCV,//id = 9

      btnFilterEventTongHopDuAn: this.btnFilterEventTongHopDuAn,//id = 16

      btnFilterEventCondition_BDTG: this.btnFilterEventCondition_BDTG,//id = 17
      btnLoaiBieuDo17: this.btnLoaiBieuDo17,//id = 17
      btnFilterEventTrangThaiCV17: this.btnFilterEventTrangThaiCV17,//id = 17
      btnThietlapFilter_BDTG: this.btnThietlapFilter_BDTG,

      btnFilterEventCondition_Widget18: this.btnFilterEventCondition_Widget18,//id = 18
      btnLoaiBieuDo18: this.btnLoaiBieuDo18,//id = 18
      btnFilterEventTrangThaiCV18: this.btnFilterEventTrangThaiCV18,//id = 18
      btnThietlapFilter_Widget18: this.btnThietlapFilter_Widget18,//id = 18

      btnPriority20: this.btnPriority20,//id = 20

      btnPriority21: this.btnPriority21,//id = 21

      btnTienDo24: this.btnTienDo24,//id = 24
      btnPriority24: this.btnPriority24,
      btnLoadTienDo24: this.btnLoadTienDo24,//id = 24
      btnLoadPriority24: this.btnLoadPriority24,

      btnFilterEventThemCongViecDuan25: this.btnFilterEventThemCongViecDuan25,//id = 25
      btnFilterEventCongviecDuan25: this.btnFilterEventCongviecDuan25,//id = 25
      btnPriority25: this.btnPriority25,
      btnLoadFilterEventCongviecDuan25: this.btnLoadFilterEventCongviecDuan25,//id = 25
      btnLoadPriority25: this.btnLoadPriority25,
      btnFilterEventTrangThaiCV36: this.btnFilterEventTrangThaiCV36,//id=36

      //Bổ sung filter lọc theo phạm vi
      btnFilterEventVaiTro: this.btnFilterEventVaiTro,
      btnFilterEventVaiTro9: this.btnFilterEventVaiTro9,
      btnFilterEventVaiTro17: this.btnFilterEventVaiTro17,
      btnFilterEventVaiTro18: this.btnFilterEventVaiTro18,
      btnFilterEventVaiTro25: this.btnFilterEventVaiTro25,
      btnLoadFilterEventVaiTro25: this.btnLoadFilterEventVaiTro25,

      btnFilterEventVaiTro33: this.btnFilterEventVaiTro33,//id = 33

    };
    return inputs;
  }

  filterWidgetHeader(widget) {
    if (widget.id == 9) {
      return this.filterDSTrangThaiduan;
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
    if (widget.id == 25) {
      return this.filterDSduan25;
    }
    if (widget.id == 36) {
      return this.filterDSTrangThaiduan36;
    }
  }

  clickFilter(widget, filter: any) {
    if (widget.id == 9) {
      this.btnFilterEventTrangThaiCV.emit(filter.id_row);
      //Xử lý data thứ 1
      this.btn9value1 = filter.id_row
      let btn9value = this.btn9value1 + '|' + this.btn9value2;
      this.updateVals(widget, btn9value);
      this.widget9 = filter.id_row;
    }
    if (widget.id == 16) {
      this.btnFilterEventTongHopDuAn.emit(filter.id_row);
      //Xử lý data thứ 1
      this.btn16value1 = filter.id_row
      let btn16value = this.btn16value1 + '|' + this.btn16value2;
      this.updateVals(widget, btn16value);
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
    if (widget.id == 25) {
      this.btnFilterEventCongviecDuan25.emit(filter.id_row);
      //Xử lý data thứ 1
      this.btn25value1 = filter.id_row;
      let btn25value = this.btn25value1 + '|' + this.btn25value2 + '|' + this.btn25value3;
      this.updateVals(widget, btn25value);
    }
    if (widget.id == 36) {
      this.btnFilterEventTrangThaiCV36.emit(filter.id_row);
      this.updateVals(widget, filter.id_row);
      this.widget36 = filter.id_row;
    }
  }



  updateVals(item, vals) {
    const widget = new WidgetModel(item);
    widget.vals = vals;
    this._PanelDashboardService
      .postUpdateWidget(widget)
      .pipe(takeUntil(this.subject))
      .subscribe((res) => {

      });
  }

  FindIDprojectteam(DanhSach) {
    setTimeout(() => {
      DanhSach.forEach((item) => {
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

        if (item.id == 24) {//Load widget 24
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
              if (ele == "0") {
                label24 += ", " + "Tất cả";
                title = "Tất cả";
              } else if (ele == "1") {
                label24 += ", " + "Hoàn thành đúng hạn";
                title = "Hoàn thành đúng hạn";
              } else if (ele == "2") {
                label24 += ", " + "Hoàn thành quá hạn";
                title = "Hoàn thành quá hạn";
              } else if (ele == "3") {
                label24 += ", " + "Đang làm trong hạn";
                title = "Đang làm trong hạn";
              } else if (ele == "4") {
                label24 += ", " + "Sắp tới hạn";
                title = "Sắp tới hạn";
              } else if (ele == "5") {
                label24 += ", " + "Tới hạn";
                title = "Tới hạn";
              } else {
                label24 += ", " + "Quá hạn";
                title = "Quá hạn";
              }
              let item = {
                id: ele,
                title: title,
              }
              this.listStatus24.push(item);
            });
            this.idWidget24 = this.btn24value1;
            this.labelWidget24 = label24.substring(1);
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
        }

        if (item.id == 25) {//Load widget 25
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
        if (item.id == 36) {
          if (item.vals) {
            this.btnFilterEventTrangThaiCV36.emit(item.vals);
            this.widget36 = item.vals;
          }
          else {
            this.btnFilterEventTrangThaiCV36.emit(0)
          }
        }

        this._ChangeDetectorRef.detectChanges();
      });
    }, 1000);
  }

  Update_SetTime(item, id_custom = 0) {
    let saveMessageTranslateParam = '';
    const dialogRef = this.dialog.open(EditPopupWidgetTimeComponent, {
      data: { item, id_custom },
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.clickbtnThietlapFilter_TrangThaiCV();
        this.clickbtnThietlapFilter_BDTG();
        this.clickbtnThietlapFilter_Widget18();
        return;
      } else {
        this.clickbtnThietlapFilter_TrangThaiCV();
        this.clickbtnThietlapFilter_BDTG();
        this.clickbtnThietlapFilter_Widget18();
      }
    });
  }

  deleteDK(item) {
    this._PanelDashboardService.Delete_Custom_Widget(item.RowID).subscribe(res => {
      if (res && res.status == 1) {
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
      }
    })
  }

  clickbtnThietlapFilter_TrangThaiCV() {
    this.btnThietlapFilter_TrangThaiCV.emit();
  }
  clickbtnThietlapFilter_BDTG() {
    this.btnThietlapFilter_BDTG.emit();
  }
  clickbtnThietlapFilter_Widget18() {
    this.btnThietlapFilter_Widget18.emit();
  }

  ThemCongViec(loai) {
    if (loai == 25) {
      this.btnFilterEventThemCongViecDuan25.emit(loai);
    }
  }
  //===========================================================================
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
  LoadChart(item) {
    this.btnLoaiBieuDo.emit(item.id_row);
  }
  clickFilterDieuKien_TrangThaiCV(widget, filter: any) {
    this.btnFilterEventCondition_TrangThaiCV.emit(filter);
  }
  //==========================================================================
  clickFilterDieuKien_BDTG(widget, filter: any) {
    this.btnFilterEventCondition_BDTG.emit(filter);
  }
  LoadChart17(item) {
    this.btnLoaiBieuDo17.emit(item.id_row);
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
  //===========================================================================
  clickFilterDieuKien_Widget18(widget, filter: any) {
    this.btnFilterEventCondition_Widget18.emit(filter);
  }
  LoadChart18(item) {
    this.btnLoaiBieuDo18.emit(item.id_row);
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
  //===========================================================================
  LoadPriority20(widget, item) {
    this.btnPriority20.emit(item.value);
    this.updateVals(widget, item.value);
  }
  //===========================================================================
  LoadPriority21(widget, item) {
    this.btnPriority21.emit(item.value);
    this.updateVals(widget, item.value);
  }
  //=========================================================
  getCheck24(val): any {
    let obj = this.idWidget24.split(",").find(x => +x == +val);
    if (obj) {
      return true;
    }
    return false;
  }

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
    //Xử lý data thứ 1
    this.btn24value1 = this.idWidget24;
    let btn24value = this.btn24value1 + '|' + this.btn24value2;
    this.updateVals(widget, btn24value);
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
  //===============================================================
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
      this.btn16value2 = filter.id;
      let btn16value = this.btn16value1 + '|' + this.btn16value2;
      this.updateVals(widget, btn16value);
    }
    if (widget.id == 9) {
      this.btnFilterEventVaiTro9.emit(filter.id);
      this.btn9value2 = filter.id;
      let btn9value = this.btn9value1 + '|' + this.btn9value2;
      this.updateVals(widget, btn9value);
    }
    if (widget.id == 17) {
      this.btnFilterEventVaiTro17.emit(filter.id);
      this.btn17value2 = filter.id;
      let btn17value = this.btn17value1 + '|' + this.btn17value2;
      this.updateVals(widget, btn17value);
    }
    if (widget.id == 18) {
      this.btnFilterEventVaiTro18.emit(filter.id);
      this.btn18value2 = filter.id;
      let btn18value = this.btn18value1 + '|' + this.btn18value2;
      this.updateVals(widget, btn18value);
    }
    if (widget.id == 25) {
      this.btnFilterEventVaiTro25.emit(filter.id);
      //Xử lý data thứ 2
      this.btn25value2 = filter.id;
      let btn25value = this.btn25value1 + '|' + this.btn25value2 + '|' + this.btn25value3;
      this.updateVals(widget, btn25value);
    }
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
  //====================Tạo mới công việc=======================
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

  //=============================================================================
  getHeight(): any {
    let tmp_height = 0;
    if (this.istaskbar == "1") {
      tmp_height = window.innerHeight - 70;
    } else {
      tmp_height = window.innerHeight - 5;
    }
    return tmp_height + 'px';
  }
}
