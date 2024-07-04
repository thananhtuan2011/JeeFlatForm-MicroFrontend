import { ChangeDetectorRef, Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DisplayGrid, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ResultModel } from '../../models/_base.model';
import { Router } from '@angular/router';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { BaoCaoDoanhNghiepService } from './Services/bao-cao-doanh-nghiep.service';
import { Dashboard, Widget, WidgetModel, WorkModel } from './Model/bao-cao-doanh-nghiep.model';
import { AddBaoCaoDialogComponent } from './add-bao-cao-dialog/add-bao-cao-dialog.component';
import { DialogSelectdayComponent } from '../dialog-selectday/dialog-selectday.component';

@Component({
  selector: 'app-bao-cao-doanh-nghiep',
  templateUrl: './bao-cao-doanh-nghiep.component.html',
  styleUrls: ['./bao-cao-doanh-nghiep.component.scss']
})
export class BaoCaoDoanhNghiepComponent implements OnInit, OnDestroy {
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
    filterDSThoiHanCV: (res) => {
      this.filterDSThoiHanCV = res;//Widget id 9
    },
    filterDanhSachVaiTro9: (res) => {
      this.filterDSvaitro9 = res;
    },
    filterDSCVHoanThanhTrongNgay: (res) => {
      this.filterDSCVHoanThanhTrongNgay = res;
    },
    filterDanhSachVaiTro3: (res) => {
      this.filterDSvaitro3 = res;
    },
    filterDanhSachVaiTro2: (res) => {
      this.filterDSvaitro2 = res;
    },
    filterDanhSachVaiTro1: (res) => {
      this.filterDSvaitro1 = res;
    },
    filterDSCVNew: (res) => {
      this.filterDSCVNew = res;
    },
    filterDSTongHop: (res) => {
      this.filterDSTongHop = res;
    },
    filterProject5: (res) => {
      this.filterProject5 = res;
    },
    filterType1: (res) => {
      this.filterType1 = res;
    },
    filterType2: (res) => {
      this.filterType2 = res;
    },
    filterType3: (res) => {
      this.filterType3 = res;
    },
    filterType4: (res) => {
      this.filterType4 = res;
    },
    filterDate1: (res) => {
      this.filterDate1 = res;
    },
    filterDate2: (res) => {
      this.filterDate2 = res;
    },
    filterDate3: (res) => {
      this.filterDate3 = res;
    },
    filterDate5: (res) => {
      this.filterDate5 = res;
    },
  };

  //Start khai báo - báo cáo thời hạn công việc
  filterDSThoiHanCV: any = [];
  filterDSTongHop: any = [];
  filterProject5: any = [];
  filterDSCVHoanThanhTrongNgay: any = [];
  filterDSCVNew: any = [];
  filterDSvaitro3: any = [];
  filterDSvaitro2: any = [];
  filterDSvaitro1: any = [];
  filterType1: any = [];
  filterType2: any = [];
  filterType3: any = [];
  filterType4: any = [];
  filterDate1: any = [];
  filterDate2: any = [];
  filterDate3: any = [];
  filterDate5: any = [];
  private btnFilterEventCondition_ThoiHanCV: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterEventThoiHanCV: EventEmitter<any> = new EventEmitter<any>();
  private btnLoaiBieuDo: EventEmitter<any> = new EventEmitter<any>();
  private btnGroup: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterProject: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterSelectDate: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterType: EventEmitter<any> = new EventEmitter<any>();
  ///widget 2
  private btnFilterTypeNew: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterSelectDate2: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterProjectNew: EventEmitter<any> = new EventEmitter<any>();
  private btnVaiTro2: EventEmitter<any> = new EventEmitter<any>();
  //widget 1
  private btnFilterTypeTongHop: EventEmitter<any> = new EventEmitter<any>();
  private btnFiltertDateTongHop: EventEmitter<any> = new EventEmitter<any>();
  private btnFilterProjectTongHop: EventEmitter<any> = new EventEmitter<any>();
  private btnVaiTroTongHop: EventEmitter<any> = new EventEmitter<any>();
  private btnFiltertDate5: EventEmitter<any> = new EventEmitter<any>();
  private btnFiltertProject5: EventEmitter<any> = new EventEmitter<any>();
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
  //Start khai báo widget 3  
  item_Group: any = {
    id_row: 1,
    title: 'Theo công việc của tôi',
  };
  selectedDate = {
    startDate: new Date('09/01/2020'),
    endDate: new Date('09/30/2020'),
  };
  selectedDate2 = {
    startDate: new Date('09/01/2020'),
    endDate: new Date('09/30/2020'),
  };
  ///Start khai báo widget 2
  item_FilterMe: any = {
    id_row: 1,
    title: 'Theo công việc của tôi',
  };
  //start khai báo widget 1
  item_FilterMeTongHop: any = {
    id_row: 1,
    title: 'Nhân viên cấp dưới',
  };
  selectedDateTongHop = {
    startDate: new Date('09/01/2020'),
    endDate: new Date('09/30/2020'),
  };
  selectedDate5 = {
    startDate: new Date('09/01/2020'),
    endDate: new Date('09/30/2020'),
  };
  widget9 = '';
  widget3 = '';
  widget2 = '';
  widget1 = '';
  widget5 = '';
  filterDSvaitro9: any = [];
  private btnFilterEventVaiTro9: EventEmitter<any> = new EventEmitter<any>();
  private btnThietlapFilter_ThoiHanCV: EventEmitter<any> = new EventEmitter<any>();
  //End khai báo widget 9

  public title_Dash: string;
  public istaskbar: string = '0';
  public image: string;





  //Start khai báo các button để lưu tạm giá trị value từng widget======
  btn9value1: string = '';
  btn9value2: string = '';
  btn3value1: string = '';
  btn3value2: string = '';
  btn2value1: string = '';
  btn2value2: string = '';
  btn1value1: string = '';
  btn1value2: string = '';
  btn1value3: string = '';
  btn2value3: string = '';
  btn3value3: string = '';
  btn4value3: string = '';
  btn5value1: string = '';
  btn5startDate: string = '';
  btn5endDate: string = '';
  btn3startDate: string = '';
  btn3endDate: string = '';
  btn2startDate: string = '';
  btn2endDate: string = '';
  btn1startDate: string = '';
  btn1endDate: string = '';
  //End khai báo các button để lưu tạm giá trị value từng widget======
  constructor(
    public _BaoCaoDoanhNghiepService: BaoCaoDoanhNghiepService,
    private _ChangeDetectorRef: ChangeDetectorRef,
    public _MatDialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog,
    private router: Router,
    public DanhMucChungService: DanhMucChungService,
  ) {
    const today = new Date();
    let set_thang = today.getMonth();
    this.selectedDate = {
      startDate: new Date(today.getFullYear(), set_thang, today.getDate()),
      endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    };
    this.selectedDate2 = {
      startDate: new Date(today.getFullYear(), set_thang, today.getDate()),
      endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    };
    this.selectedDateTongHop = {
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: new Date(today.getFullYear(), today.getMonth(), 30),
    };
    this.selectedDate5 = {
      startDate: new Date(today.getFullYear(), set_thang, today.getDate()),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()+7),
    }
  }

  ngOnInit(): void {
    this.DanhMucChungService.getthamso();
    this.listWidget = this._BaoCaoDoanhNghiepService.getWidgets();
    this.WidgetDashboard = new Dashboard();
    this.options = this._BaoCaoDoanhNghiepService.getDashBoardOptions();
    this.options.displayGrid = DisplayGrid.OnDragAndResize;
    this.options.itemChangeCallback = (item: Widget) => {
      const widget = new WidgetModel(item);
      this._BaoCaoDoanhNghiepService
        .postUpdateWidget(widget)
        .pipe(takeUntil(this.subject))
        .subscribe((res) => {
          this.resizeEvent.emit(item);
        });
    };

    this._BaoCaoDoanhNghiepService
      .getDSReport()
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
    const dialogRef = this._MatDialog.open(AddBaoCaoDialogComponent, {
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
    this._BaoCaoDoanhNghiepService
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
      btnLoaiBieuDo: this.btnLoaiBieuDo,//id = 4
      btnFilterEventCondition_ThoiHanCV: this.btnFilterEventCondition_ThoiHanCV,//id = 4
      btnFilterEventThoiHanCV: this.btnFilterEventThoiHanCV,//id = 4
      btnThietlapFilter_ThoiHanCV: this.btnThietlapFilter_ThoiHanCV,//id = 4
      btnFilterEventVaiTro9: this.btnFilterEventVaiTro9,
      btnFilterProject: this.btnFilterProject,//id=3
      btnGroup: this.btnGroup,//id=3
      btnFilterType: this.btnFilterType,//id=3
      btnFilterSelectDate: this.btnFilterSelectDate,//id=3
      btnFilterTypeNew: this.btnFilterTypeNew,//id =2
      btnFilterSelectDate2: this.btnFilterSelectDate2,//id=2
      btnFilterProjectNew: this.btnFilterProjectNew,//id=2
      btnVaiTro2: this.btnVaiTro2,//id=2
      btnFilterTypeTongHop: this.btnFilterTypeTongHop,
      btnFiltertDateTongHop: this.btnFiltertDateTongHop,
      btnFilterProjectTongHop: this.btnFilterProjectTongHop,
      btnVaiTroTongHop: this.btnVaiTroTongHop,
      btnFiltertDate5: this.btnFiltertDate5,
      btnFiltertProject5: this.btnFiltertProject5,
    };
    return inputs;
  }

  filterWidgetHeader(widget) {
    if (widget.id == 4) {
      return this.filterDSThoiHanCV;
    }
    if (widget.id == 3) {
      return this.filterDSCVHoanThanhTrongNgay;
    }
    if (widget.id == 2) {
      return this.filterDSCVNew;
    }
    if (widget.id == 1) {
      return this.filterDSTongHop;
    }
  }

  clickFilter(widget, filter: any) {
    if (widget.id == 4) {
      this.btnFilterEventThoiHanCV.emit(filter.id_row);
      //Xử lý data thứ 1
      this.btn9value1 = filter.id_row
      let btn9value = this.btn9value1 + '|' + this.btn9value2;
      this.updateVals(widget, btn9value);
      this.widget9 = filter.id_row;
    }
  }



  updateVals(item, vals) {
    const widget = new WidgetModel(item);
    widget.vals = vals;
    this._BaoCaoDoanhNghiepService
      .postUpdateWidget(widget)
      .pipe(takeUntil(this.subject))
      .subscribe((res) => {

      });
  }

  FindIDprojectteam(DanhSach) {
    setTimeout(() => {
      DanhSach.forEach((item) => {
        if (item.id == 4 && item.vals) {
          let obj9 = item.vals.split('|');
          if (obj9.length == 2) {
            this.widget9 = obj9[0];
            this.btnFilterEventThoiHanCV.emit(obj9[0]);
            this.btn9value1 = obj9[0];
            this.btnFilterEventVaiTro9.emit(obj9[1]);
            this.btn9value2 = obj9[1];
          } else {
            this.btnFilterEventThoiHanCV.emit(obj9[0]);
            this.widget9 = obj9[0];
            this.btn9value1 = obj9[0];
          }
        }
        if (item.id == 3 && item.vals) {
          let obj3 = item.vals.split('|');
          if (obj3.length == 5) {
            this.widget3 = obj3[0];
            this.btnFilterProject.emit(obj3[0]);
            this.btn3value1 = obj3[0];
            this.btnGroup.emit(obj3[1]);
            this.btn3value2 = obj3[1];
            this.btnFilterType.emit(obj3[2]);
            this.btn3value3 = obj3[2];
            if(obj3[3] != '' && obj3[4] !=''){
              this.btn3startDate=obj3[3];
              this.btn3endDate=obj3[4];
              this.selectedDate.startDate=new Date(this.btn3startDate)
              this.selectedDate.endDate=new Date(this.btn3endDate)
            }
            this.btnFilterSelectDate.emit(this.selectedDate);
          }
          else {
            this.btnFilterProject.emit(obj3[0]);
            this.widget3 = obj3[0];
            this.btn3value1 = obj3[0];
          }
        }
        if (item.id == 2 && item.vals) {
          let obj2 = item.vals.split('|');
          if (obj2.length == 5) {
            this.widget2 = obj2[0];
            this.btnFilterProjectNew.emit(obj2[0]);
            this.btn2value1 = obj2[0];
            this.btnVaiTro2.emit(obj2[1]);
            this.btn2value2 = obj2[1];
            this.btnFilterTypeNew.emit(obj2[2]);
            this.btn2value3 = obj2[2];
            if(obj2[3] != '' && obj2[4] !=''){
              this.btn2startDate=obj2[3];
              this.btn2endDate=obj2[4];
              this.selectedDate2.startDate=new Date(this.btn2startDate)
              this.selectedDate2.endDate=new Date(this.btn2endDate)
            }
            this.btnFilterSelectDate2.emit(this.selectedDate2);
          }
          else {
            this.btnFilterProject.emit(obj2[0]);
            this.widget2 = obj2[0];
            this.btn2value1 = obj2[0];
          }
        }
        if (item.id == 1 && item.vals) {
          let obj1 = item.vals.split('|');
          if (obj1.length == 5) {
            this.widget1 = obj1[0];
            this.btnFilterProjectTongHop.emit(obj1[0]);
            this.btn1value1 = obj1[0];
            this.btnVaiTroTongHop.emit(obj1[1]);
            this.btn1value2 = obj1[1];
            this.btnFilterTypeTongHop.emit(obj1[2]);
            this.btn1value3 = obj1[2];
            if(obj1[3] != '' && obj1[4] !=''){
              this.btn1startDate=obj1[3] ;
              this.btn1endDate=obj1[4];
              this.selectedDateTongHop.startDate=new Date(this.btn1startDate)
              this.selectedDateTongHop.endDate=new Date(this.btn1endDate)  
            }
            this.btnFiltertDateTongHop.emit(this.selectedDateTongHop);
          }
          else {
            this.btnFilterProjectTongHop.emit(obj1[0]);
            this.widget1 = obj1[0];
            this.btn1value1 = obj1[0];
          }
        }
        if (item.id == 5 && item.vals){
          let obj5 = item.vals.split('|');
          if (obj5.length == 3) {
            this.widget5 = obj5[0];
            this.btnFiltertProject5.emit(obj5[0]);
            this.btn5value1 = obj5[0];
            if(obj5[1] != '' && obj5[2] !=''){
              this.btn5startDate=obj5[1];
              this.btn5endDate=obj5[2];
              this.selectedDate5.startDate=new Date(this.btn5startDate)
              this.selectedDate5.endDate=new Date(this.btn5endDate)
            }

            this.btnFiltertDate5.emit(this.selectedDate5);
            
          }
          else{
            this.widget5 = obj5[0];
            this.btnFiltertProject5.emit(obj5[0]);
            this.btn5value1 = obj5[0];
          }
        }
        this._ChangeDetectorRef.detectChanges();
      });
    }, 1000);
  }

  deleteDK(item) {
    this._BaoCaoDoanhNghiepService.Delete_Custom_Widget(item.RowID).subscribe(res => {
      if (res && res.status == 1) {
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
      }
    })
  }

  clickbtnThietlapFilter_ThoiHanCV() {
    this.btnThietlapFilter_ThoiHanCV.emit();
  }


  //===========================================================================
  setMyStyles(id_row: string, widgetid: number) {
    let styles = {};
    if (widgetid == 4) {
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
  clickFilterDieuKien_ThoiHanCV(widget, filter: any) {
    this.btnFilterEventCondition_ThoiHanCV.emit(filter);
  }
  //==========================================================================

  clickFilterVaiTro(widget, filter: any) {
    if (widget.id == 4) {
      this.btnFilterEventVaiTro9.emit(filter.id);
      this.btn9value2 = filter.id;
      let btn9value = this.btn9value1 + '|' + this.btn9value2;
      this.updateVals(widget, btn9value);
    }
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
    tmp_height = window.innerHeight - 5;
    return tmp_height + 'px';
  }

  LoadGroup(widget, item) {
    if (widget.id == 3) {
      this.btnGroup.emit(item.id);
      this.btn3value2 = item.id;
      let btn3value = this.btn3value1 + '|' + this.btn3value2 + '|' + this.btn3value3 + '|'+this.btn3startDate+'|'+this.btn3endDate;
      this.updateVals(widget, btn3value);
    }
  }
  LoadProject(widget, item) {
    if (widget.id == 3) {
      this.btnFilterProject.emit(item.id_row);
      this.btn3value1 = item.id_row
      let btn3value = this.btn3value1 + '|' + this.btn3value2 + '|' + this.btn3value3 + '|'+this.btn3startDate+'|'+this.btn3endDate;
      this.updateVals(widget, btn3value);
      this.widget3 = item.id_row;
    }

  }
  loadFilterType(widget, item) {
    if (widget.id == 3) {
      this.btnFilterType.emit(item.id_row)
      this.btn3value3 = item.id_row
      let btn3value = this.btn3value1 + '|' + this.btn3value2 + '|' + this.btn3value3 + '|'+this.btn3startDate+'|'+this.btn3endDate;
      this.updateVals(widget, btn3value);
    }

  }

  SelectFilterDate(widget) {
    const dialogRef = this.dialog.open(DialogSelectdayComponent, {
      width: "500px",
      data: this.selectedDate,
      panelClass: 'sky-padding-0',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if(widget.id==3){
          this.selectedDate.startDate = new Date(result.startDate);
          this.selectedDate.endDate = new Date(result.endDate);
          this.btnFilterSelectDate.emit(this.selectedDate);
          this.btn3startDate=this.selectedDate.startDate.toString();
          this.btn3endDate=this.selectedDate.endDate.toString();
          let btn3value = this.btn3value1 + '|' + this.btn3value2 + '|' + this.btn3value3 + '|'+this.btn3startDate+'|'+this.btn3endDate;
          this.updateVals(widget, btn3value);
        }
      }
    });

  }
  loadFilterTypeNew(widget, item) {
    if (widget.id == 2) {
      this.btnFilterTypeNew.emit(item.id_row);
      this.btn2value3 = item.id_row
      let btn2value = this.btn2value1 + '|' + this.btn2value2 + '|' + this.btn2value3 + '|'+this.btn2startDate+'|'+this.btn2endDate;
      this.updateVals(widget, btn2value);
    }

  }
  SelectFilterDate2(widget) {
    const dialogRef = this.dialog.open(DialogSelectdayComponent, {
      width: "500px",
      data: this.selectedDate2,
      panelClass: 'sky-padding-0',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if(widget.id==2){
          this.selectedDate2.startDate = new Date(result.startDate);
          this.selectedDate2.endDate = new Date(result.endDate);
          this.btnFilterSelectDate2.emit(this.selectedDate2);
          this.btn2startDate=this.selectedDate2.startDate.toString();
          this.btn2endDate=this.selectedDate2.endDate.toString();
          let btn2value = this.btn2value1 + '|' + this.btn2value2 + '|' + this.btn2value3 + '|'+this.btn2startDate+'|'+this.btn2endDate;
          this.updateVals(widget, btn2value);
        }
      }
    });

  }
  LoadProjectNew(widget, item) {
    if (widget.id == 2) {
      this.btnFilterProjectNew.emit(item.id_row);
      this.btn2value1 = item.id_row
      let btn2value = this.btn2value1 + '|' + this.btn2value2 + '|' + this.btn2value3 + '|'+this.btn2startDate+'|'+this.btn2endDate;
      this.updateVals(widget, btn2value);
      this.widget2 = item.id_row;
    }
  }
  LoadCVTrongNgay(widget, item) {
    if (widget.id == 2) {
      this.btnVaiTro2.emit(item.id);
      this.btn2value2 = item.id;
      let btn2value = this.btn2value1 + '|' + this.btn2value2 + '|' + this.btn2value3 + '|'+this.btn2startDate+'|'+this.btn2endDate;
      this.updateVals(widget, btn2value);
    }
  }
  loadFilterTypeTongHop(widget, item) {
    if (widget.id == 1) {
      this.btnFilterTypeTongHop.emit(item.id_row);
      this.btn1value3 = item.id_row;
      let btn1value = this.btn1value1 + '|' + this.btn1value2 + '|' + this.btn1value3 + '|'+this.btn1startDate+'|'+this.btn1endDate;
      this.updateVals(widget, btn1value);
    }

  }
  LoadTypeStaffTongHop(widget, item) {
    if (widget.id == 1) {
      this.btnVaiTroTongHop.emit(item.id_row);
      this.btn1value2 = item.id_row;
      let btn1value = this.btn1value1 + '|' + this.btn1value2 + '|' + this.btn1value3 + '|'+this.btn1startDate+'|'+this.btn1endDate;
      this.updateVals(widget, btn1value);
    }
  }
  LoadProjectTongHop(widget, item) {
    if (widget.id == 1) {
      this.btnFilterProjectTongHop.emit(item.id_row);
      this.btn1value1 = item.id_row
      let btn1value = this.btn1value1 + '|' + this.btn1value2 + '|' + this.btn1value3 + '|'+this.btn1startDate+'|'+this.btn1endDate;
      this.updateVals(widget, btn1value);
      this.widget1 = item.id_row;
    }

  }
  SelectFilterDateTongHop(widget) {
    const dialogRef = this.dialog.open(DialogSelectdayComponent, {
      width: "500px",
      data: this.selectedDateTongHop,
      panelClass: 'sky-padding-0',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if(widget.id==1){
          this.selectedDateTongHop.startDate = new Date(result.startDate);
          this.selectedDateTongHop.endDate = new Date(result.endDate);
          this.btnFiltertDateTongHop.emit(this.selectedDateTongHop);
          this.btn1startDate=this.selectedDateTongHop.startDate.toString();
          this.btn1endDate=this.selectedDateTongHop.endDate.toString();
          let btn1value = this.btn1value1 + '|' + this.btn1value2 + '|' + this.btn1value3 + '|'+this.btn1startDate+'|'+this.btn1endDate;
          this.updateVals(widget, btn1value);
        }
      }
    });

  }
  SelectFilterDate5(widget) {
    const dialogRef = this.dialog.open(DialogSelectdayComponent, {
      width: "500px",
      data: this.selectedDate5,
      panelClass: 'sky-padding-0',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if(widget.id==5){
          this.selectedDate5.startDate = new Date(result.startDate);
          this.selectedDate5.endDate = new Date(result.endDate);
          this.btnFiltertDate5.emit(this.selectedDate5);
          this.btn5startDate=this.selectedDate5.startDate.toString();
          this.btn5endDate=this.selectedDate5.endDate.toString();
          let btn5value = this.btn5value1 + '|'+this.btn5startDate+'|'+this.btn5endDate;
          this.updateVals(widget, btn5value);
        }
      }
    });

  }
  LoadProject5(widget, item) {
    if (widget.id == 5) {
      this.btnFiltertProject5.emit(item.id_row);
      this.btn5value1 = item.id_row
      let btn5value = this.btn5value1 + '|'+this.btn5startDate+'|'+this.btn5endDate;
      this.updateVals(widget, btn5value);
      this.widget5 = item.id_row;
    }
  }
  @ViewChild('Input1', {static: false}) Input1: ElementRef;
  @ViewChild('Input2', {static: false}) Input2: ElementRef;
  @ViewChild('Input3', {static: false}) Input3: ElementRef;
  @ViewChild('Input4', {static: false}) Input4: ElementRef;
  @ViewChild('Input5', {static: false}) Input5: ElementRef;
  stopPropagation(event) {
    event.stopPropagation();
  }
  keyup1(event) { 
    event = event.toLowerCase();
    if (event[0] == '@') {
      this.filterDSTongHop.list = this.filterDSTongHop.listFull.filter(
        (bank) => bank.title.toLowerCase().indexOf(event.replace('@', '')) > -1
      );
    } else {
      this.filterDSTongHop.list = this.filterDSTongHop.listFull.filter(
        (bank) => bank.title.toLowerCase().indexOf(event) > -1
      );
    }
  }
  keyup2(event) { 
    event = event.toLowerCase();
    if (event[0] == '@') {
      this.filterDSCVNew.list = this.filterDSCVNew.listFull.filter(
        (bank) => bank.title.toLowerCase().indexOf(event.replace('@', '')) > -1
      );
    } else {
      this.filterDSCVNew.list = this.filterDSCVNew.listFull.filter(
        (bank) => bank.title.toLowerCase().indexOf(event) > -1
      );
    }
  }
  keyup3(event) { 
    event = event.toLowerCase();
    if (event[0] == '@') {
      this.filterDSCVHoanThanhTrongNgay.list = this.filterDSCVHoanThanhTrongNgay.listFull.filter(
        (bank) => bank.title.toLowerCase().indexOf(event.replace('@', '')) > -1
      );
    } else {
      this.filterDSCVHoanThanhTrongNgay.list = this.filterDSCVHoanThanhTrongNgay.listFull.filter(
        (bank) => bank.title.toLowerCase().indexOf(event) > -1
      );
    }
  }
  
  keyup4(event) { 
    event = event.toLowerCase();
    if (event[0] == '@') {
      this.filterDSThoiHanCV.list = this.filterDSThoiHanCV.listFull.filter(
        (bank) => bank.title.toLowerCase().indexOf(event.replace('@', '')) > -1
      );
    } else {
      this.filterDSThoiHanCV.list = this.filterDSThoiHanCV.listFull.filter(
        (bank) => bank.title.toLowerCase().indexOf(event) > -1
      );
    }
  }
  keyup5(event) { 
    event = event.toLowerCase();
    if (event[0] == '@') {
      this.filterProject5.list = this.filterProject5.listFull.filter(
        (bank) => bank.title.toLowerCase().indexOf(event.replace('@', '')) > -1
      );
    } else {
      this.filterProject5.list = this.filterProject5.listFull.filter(
        (bank) => bank.title.toLowerCase().indexOf(event) > -1
      );
    }
  }
  onBlur(event) {
    this.Input1.nativeElement.focus()
  }
  onBlur3(event) {
    this.Input3.nativeElement.focus()
  }
  onBlur5(event) {
    this.Input5.nativeElement.focus()
  }
  onBlur2(event) {
    this.Input2.nativeElement.focus()
  }
  onBlur4(event) {
    this.Input4.nativeElement.focus()
  }
  
}
