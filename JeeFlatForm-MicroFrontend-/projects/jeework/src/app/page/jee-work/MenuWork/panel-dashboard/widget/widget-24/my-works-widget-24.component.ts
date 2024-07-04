import { AuthService } from "src/app/modules/auth";
import { ChangeDetectorRef, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Subscription, fromEvent } from "rxjs";
import { debounceTime, distinctUntilChanged, map, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import { UpdateWorkModel } from "../../Model/jee-work.model";
import { QueryParamsModelNew } from "../../../../models/query-models/query-params.model";
import { WidgetWork24Service } from "../../Services/works-widget-24.service";
import { PanelDashboardService } from "../../Services/panel-dashboard.service";
import { LayoutUtilsService } from "projects/jeework/src/modules/crud/utils/layout-utils.service";
import { WorksbyprojectService } from "../../Services/worksbyproject.service";
import { DatePipe } from "@angular/common";
import { DanhMucChungService } from "../../../../services/danhmuc.service";

@Component({
  selector: "my-works-widget-24",
  templateUrl: "./my-works-widget-24.component.html",
  styleUrls: ["./my-works-widget-24.component.scss"],
})
export class MyWorksWidget24Component
  implements
  OnInit,
  OnDestroy {
  isLoading: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  mylist: any = [];
  UserID = 0;
  ListAllStatusDynamic: any = [];
  @Input() cssClass: "";
  list_widgets: any[] = [];
  btnTienDo24: EventEmitter<any> = new EventEmitter<any>();
  btnLoadTienDo24: EventEmitter<any> = new EventEmitter<any>();
  btnFilterSub: Subscription;
  TienDo = '';
  //=====================================================================
  btnPriority24: EventEmitter<any> = new EventEmitter<any>();
  btnLoadPriority24: EventEmitter<any> = new EventEmitter<any>();
  btnFilterSub24: Subscription;
  Priority = 0;
  //====================================================================
  isgov: boolean = false;
  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    public _WidgetWork24Service: WidgetWork24Service,
    public router: Router,
    private translate: TranslateService,
    public dialog: MatDialog,
    private _PanelDashboardService: PanelDashboardService,
    public layoutUtilsService: LayoutUtilsService,
    private _WorksbyprojectService: WorksbyprojectService,
    public datePipe: DatePipe,
    public DanhMucChungService: DanhMucChungService
  ) {
    this.UserID = this._PanelDashboardService.getAuthFromLocalStorage().user.customData["jee-account"].userID;
  }

  startdate: any = "";
  enddate: any = "";
  status = "";
  ngOnInit() {
    this.LoadData();
    this.btnFilterSub = this.btnTienDo24.subscribe((res) => {
      this.TienDo = res;
      this.loadList();
      this.changeDetectorRefs.detectChanges();
    });

    this.btnFilterSub24 = this.btnPriority24.subscribe((res) => {
      if (res) {
        this.Priority = res;
        this.loadList();
        this.changeDetectorRefs.detectChanges();
      }
    });

    //Start-Bổ sung ngày 1/12/23
    this.btnFilterSub24 = this.btnLoadPriority24.subscribe((res) => {
      this.Priority = res;
      this.changeDetectorRefs.detectChanges();
    });

    this.btnFilterSub = this.btnLoadTienDo24.subscribe((res) => {
      this.TienDo = res;
      this.loadList();
      this.changeDetectorRefs.detectChanges();
    });
    //End-Bổ sung ngày 1/12/23

    const $eventload = fromEvent<CustomEvent>(window, 'event-reload-widget').subscribe((e) => this.onEventHandler(e));
  }
  onEventHandler(e: CustomEvent) {
    if (e.detail.eventType === 'load-data') {
      this.loadList();
    }
  }
  reset() { }

  modelChanged(event) {
    this.loadList();
  }
  LoadTatca() {
    this.startdate = "";
    this.enddate = "";
    this.loadList();
  }
  LoadStatus(status = "") {
    this.status = status;
    this.loadList();
  }
  LoadData() {
    this._WorksbyprojectService.ListAllStatusDynamic().subscribe((res) => {
      if (res && res.status === 1) {
        this.ListAllStatusDynamic = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  FindStatus(id_project_team, id_status) {
    var item = this.ListAllStatusDynamic.find(
      (x) => +x.id_row == id_project_team
    );
    var index;
    if (item) {
      index = item.status.find((x) => x.id_row == id_status);
    }
    if (index) {
      return index.statusname;
    }
    return this.translate.instant("widgets.chuagantinhtrang");
  }
  getStyleSTT(id_project_team, id_status) {
    var item = this.ListAllStatusDynamic.find(
      (x) => +x.id_row == id_project_team
    );
    var index;
    if (item) {
      index = item.status.find((x) => x.id_row == id_status);
    }
    if (index) {
      return {
        color: "white",
        backgroundColor: index.color,
      };
    }
    return {
      color: "rgb(0, 0, 0)",
      backgroundColor: this.Opaciti_color("rgb(0, 0, 0)"),
    };
  }

  Opaciti_color(color = "rgb(0, 0, 0)") {
    var result = color.replace(")", ", 0.2)").replace("rgb", "rgba");
    return result;
  }

  filterConfiguration(): any {
    const filter: any = {};
    filter.loaicongviec = 1;
    if (this.startdate) filter.TuNgay = this.f_convertDate(this.startdate);
    if (this.startdate) filter.DenNgay = this.f_convertDate(this.enddate);
    if (this.status) {
      if (this.status == 'New') {
        filter.isNew = 1;
      }
      else if (this.status == 'complete') {
        filter.Done = 1;
      }
      else if (this.status == 'deadline') {
        filter.TreHan = 1;
      }
      else if (this.status == 'todo') {
        filter.Doing = 1;
      }
      else
        filter.tinhtrang = this.status;
    }
    filter.tiendo = this.TienDo;
    filter.collect_by = "CreatedDate";
    filter.clickup_prioritize = this.Priority;

    return filter;
  }
  getColorStatus(status) {
    if (status == "df") {
      status = this.status;
    }
    if (status == "todo") {
      return "rgb(29, 126, 236)";
    }
    if (status == "deadline") {
      return "red";
    }
    if (status == "complete") {
      return "rgb(46, 205, 111)";
    }
    return "white";
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  getClasses(val) {
    return "btn btn-sm text-uppercase item-status";
  }
  GetStringByStatus(status) {
    let result = "";
    if (status == 2)
      return (result = this.translate.instant("projects.chamtiendo"));
    else {
      if (status == 3) result = this.translate.instant("projects.ruirocao");
      else result = this.translate.instant("projects.dungtiendo");
    }
    return result;
  }

  GetColorProgress(status) {
    if (status > 75) return "progress-bar bg-success";
    else {
      if (status < 25) return "progress-bar bg-danger";
      else {
        if (status < 50) return "progress-bar bg-primary";
        return "progress-bar bg-info";
      }
    }
  }

  Xemchitiet(item) {
    this.router.navigate(['', { outlets: { auxName: 'auxWork/DetailsGOV/' + item.id_row }, }]);
  }

  f_convertDate(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return (
        ("0" + a.getDate()).slice(-2) +
        "/" +
        ("0" + (a.getMonth() + 1)).slice(-2) +
        "/" +
        a.getFullYear()
      );
    }
  }

  getHeight(): any {
    let tmp_height = document.getElementById("gridster-height24").clientHeight;
    tmp_height = tmp_height - 120;
    return tmp_height + "px";
  }
  getWidth(): any {
    let tmp_width = document.getElementById("gridster-height24").clientWidth;
    return tmp_width > 500;
  }

  IsAdminGroup = false;
  list_role: any = [];

  UpdateStatus(task, status) {
    if (+task.status === +status.id_row) {
      return;
    }
    this.UpdateByKey(task, "status", status.id_row);
  }
  updateDate(task, date, field) {
    if (!this.KiemTraThayDoiCongViec(task, "datetime", task.id_project_team)) {
      return;
    }
    if (date) {
      this.UpdateByKey(task, field, moment(date).format("MM/DD/YYYY HH:mm"));
    } else {
      this.UpdateByKey(task, field, null);
    }
  }
  UpdateByKey(task, key, value) {
    if (!this.KiemTraThayDoiCongViec(task, key, task.id_project_team)) {
      return;
    }
    const item = new UpdateWorkModel();
    item.id_row = task.id_row;
    item.key = key;
    item.value = value;
    if (task.id_nv > 0) {
      item.IsStaff = true;
    }
    this._WorksbyprojectService.UpdateByKey(item).subscribe((res) => {
      if (res && res.status === 1) {
        this.loadList();
      } else {
        this.layoutUtilsService.showError(res.error.message);
      }
    });
  }
  CheckClosedTask(item) {
    // if (this.IsAdminGroup) {
    //     return true;
    // }
    if (item.closed) {
      return false;
    } else {
      return true;
    }
  }

  IsAdmin(id_project_team) {
    if (this.IsAdminGroup) {
      return true;
    }
    if (this.list_role) {
      const x = this.list_role.find((x) => x.id_row === id_project_team);
      if (x) {
        if (x.admin === true || +x.admin === 1 || +x.owner === 1 || +x.parentowner === 1) {
          return true;
        }
      }
    }
    return false;
  }

  KiemTraThayDoiCongViec(item, key, idprojectteam) {
    if (!this.CheckClosedTask(item)) {
      this.layoutUtilsService.showError("Công việc đã đóng");
      return false;
    }

    if (this.IsAdmin(idprojectteam)) {
      return true;
    } else if (item.createdby?.userid === this.UserID) {
      return true;
    } else {
      if (item.User) {
        const index = item.User.findIndex((x) => x.id_nv === this.UserID);
        if (index >= 0) {
          return true;
        }
      }
    }
    var txtError = "";
    switch (key) {
      case "assign":
        txtError = "Bạn không có quyền thay đổi người làm của công việc này.";
        break;
      case "id_group":
        txtError =
          "Bạn không có quyền thay đổi nhóm công việc của công việc này.";
        break;
      case "status":
        txtError = "Bạn không có quyền thay đổi trạng thái của công việc này.";
        break;
      case "estimates":
        txtError =
          "Bạn không có quyền thay đổi thời gian làm của công việc này.";
        break;
      case "checklist":
        txtError = "Bạn không có quyền chỉnh sửa checklist của công việc này.";
        break;
      case "title":
        txtError = "Bạn không có quyền đổi tên của công việc này.";
        break;
      case "description":
        txtError = "Bạn không có quyền đổi mô tả của công việc này.";
        break;
      default:
        txtError = "Bạn không có quyền chỉnh sửa công việc này.";
        break;
    }
    this.layoutUtilsService.showError(txtError);
    return false;
  }
  //=================Bổ sung đổi api status theo cấu trúc mới==============================
  public listDataStatus: any[] = [];
  statusChange(val) {
    this.listDataStatus = [];
    this._WorksbyprojectService.ListStatusDynamicNew(val.id_project_team, val.id_row).subscribe(res => {
      if (res && res.status == 1) {
        this.listDataStatus = res.data;
      }
      this.changeDetectorRefs.detectChanges();
    })
  }

  // getClassdate(value) {
  //   if (moment(this.DMYtoMDY(value)).format('MM/DD/YYYY HH:mm:ss') < moment(new Date()).format('MM/DD/YYYY HH:mm:ss')) {
  //     return 'trehan';
  //   }
  //   if (moment(value + 'z').format('MM/DD/YYYY') === moment(new Date()).format('MM/DD/YYYY'))
  //     return 'homnay';
  //   return '';
  // }

  // DMYtoMDY(value) {
  //   const cutstring = value.toString().split('/');
  //   if (cutstring.length === 3) {
  //     return cutstring[1] + '/' + cutstring[0] + '/' + cutstring[2];
  //   }
  //   return value;
  // }

  getClassdate(value) {
    let str_tmp1 = this.datePipe.transform(new Date(value) + 'z', 'MM/dd/yyyy HH:mm:ss');
    let str_tmp2 = this.datePipe.transform(new Date(), 'MM/dd/yyyy HH:mm:ss');
    var date_tmp1 = new Date(str_tmp1);
    var date_tmp2 = new Date(str_tmp2);
    let days = (date_tmp1.getTime() - date_tmp2.getTime()) / 1000 / 60 / 60 / 24;
    if (days < 0) {
      return 'trehan';
    }
    if (moment(value + 'z').format('MM/DD/YYYY') === moment(new Date()).format('MM/DD/YYYY'))
      return 'homnay';
    return '';
  }
  //=======================Xử lý load top 20 - 26/12/2022==========================
  _loading = false;
  _HasItem = false;
  crr_page = 0;
  page_size = 20;
  total_page = 0;
  dataLazyLoad: any = [];
  loadList() {
    this.crr_page = 0;
    this.page_size = 20;
    const queryParams = new QueryParamsModelNew(
      this.filterConfiguration(),
      'asc',
      '',
      this.crr_page,
      this.page_size,
    );
    this.isLoading = true;
    this._WidgetWork24Service.loadList(queryParams).subscribe(res => {
      this.isLoading = false;
      if (res && res.status == 1) {
        this.dataLazyLoad = [];

        if (res.data.length > 0) {
          this.dataLazyLoad = [...this.dataLazyLoad, ...res.data];
        }

        this.total_page = res.page.AllPage;
        if (this.dataLazyLoad.length > 0) {
          this._HasItem = true;
        }
        else {
          this._HasItem = false;
        }
        this._loading = false;
      } else {
        this.dataLazyLoad = [];
        this._HasItem = false;
      }
      this.isgov = res.isgov;
      this.changeDetectorRefs.detectChanges();
    });
  }

  loadDataList_Lazy() {
    if (!this._loading) {
      this.crr_page++;
      if (this.crr_page < this.total_page) {
        this._loading = true;
        const queryParams = new QueryParamsModelNew(
          this.filterConfiguration(),
          '',
          '',
          this.crr_page,
          this.page_size,
        );
        this.isLoading = true;
        this._WidgetWork24Service.loadList(queryParams)
          .pipe(
            tap(resultFromServer => {
              this.isLoading = false;
              if (resultFromServer.status == 1) {
                this.dataLazyLoad = [...this.dataLazyLoad, ...resultFromServer.data];

                if (resultFromServer.data.length > 0) {
                  this._HasItem = true;
                }
                else {
                  this._HasItem = false;
                }
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

  submit(val, element) {
    if (val != true) {
      if (val == "delete") {
        element.comments = element.comments - 1;
      } else {
        element.comments = element.comments + 1;
      }
    }
  }

  //===========Thay đổi cách check Rule theo yêu cầu mới ============================
  CheckRules(RuleID: number, element) {
    if (element.Rule) {
      if (element) {
        if (
          element.IsAdmin === true ||
          +element.admin === 1 ||
          +element.owner === 1 ||
          +element.parentowner === 1
        ) {
          return true;
        } else {
          if (
            RuleID === 7 ||
            RuleID === 9 ||
            RuleID === 11 ||
            RuleID === 12 ||
            RuleID === 13
          ) {
            if (element.Rule.find((element) => element == 15)) {
              return false;
            }
          }
          if (RuleID === 10) {
            if (element.Rule.find((element) => element == 16)) {
              return false;
            }
          }
          if (RuleID === 4 || RuleID === 14) {
            if (element.Rule.find((element) => element == 17)) {
              return false;
            }
          }
          const r = element.Rule.find((element) => element == RuleID);
          if (r) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    }
    return false;
  }
  //============================================================================
  reloadData(val) {
    if (val) {
      this.loadDataList_Lazy();
    }
  }
}
