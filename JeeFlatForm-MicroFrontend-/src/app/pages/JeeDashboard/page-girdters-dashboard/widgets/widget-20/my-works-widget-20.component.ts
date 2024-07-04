import { AuthService } from "src/app/modules/auth";
import { ChangeDetectorRef, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { Subscription, fromEvent } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import { WidgetWork20Service } from "../../Services/works-widget-20.service";
import { WorkGeneralService } from "../../Services/work-general.services";
import { PageGirdtersDashboardService } from "../../Services/page-girdters-dashboard.service";
import { UpdateWorkModel } from "../../Model/work-general.model";
import { LayoutUtilsService } from "src/app/modules/crud/utils/layout-utils.service";
import { QueryParamsModelNew } from "src/app/_metronic/core/models/pagram";


@Component({
  selector: "my-works-widget-20",
  templateUrl: "./my-works-widget-20.component.html",
  styleUrls: ["./my-works-widget-20.component.scss"],
})
export class MyWorksWidget20Component
  implements
  OnInit,
  OnDestroy {
  isLoading: boolean = false;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  mylist: any = [];
  UserID = 0;
  ListAllStatusDynamic: any = [];
  @Input() cssClass: "";

  btnPriority20: EventEmitter<any> = new EventEmitter<any>();
  btnFilterSub: Subscription;
  Priority = 0;
  constructor(
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    public _WidgetWork20Service: WidgetWork20Service,
    public layoutUtilsService: LayoutUtilsService,
    public router: Router,
    private translate: TranslateService,
    public dialog: MatDialog,
    public _WorkGeneralService: WorkGeneralService,
    private _PageGirdtersDashboardService: PageGirdtersDashboardService,
  ) {
    this.UserID = this._PageGirdtersDashboardService.getAuthFromLocalStorage().user.customData["jee-account"].userID;
  }

  startdate: any = "";
  enddate: any = "";
  status = "";


  ngOnInit() {
    this.LoadData();
    const $eventload = fromEvent<CustomEvent>(window, 'event-reload-widget').subscribe((e) => this.onEventHandler(e));
    this.btnFilterSub = this.btnPriority20.subscribe((res) => {
      this.Priority = res;
      this.loadList();
      this.changeDetectorRefs.detectChanges();
    });

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
    this._WorkGeneralService.ListAllStatusDynamic().subscribe((res) => {
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
    filter.collect_by = "CreatedDate";

    // if (this.Priority > 0) {
    //   filter.clickup_prioritize = this.Priority;
    // }
    //Truyen bang 0 => Lay tat ca. Truyen cac so khac thi lay theo do uu tien cua so do
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
    // this.jeeWorkStore.updateEvent = false;
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
    let tmp_height = document.getElementById("gridster-height20").clientHeight;
    tmp_height = tmp_height - 120;
    return tmp_height + "px";
  }
  getWidth(): any {
    let tmp_width = document.getElementById("gridster-height20").clientWidth;
    return tmp_width > 500;
  }

  IsAdminGroup = false;
  list_role: any = [];
  CheckRoles(roleID: number, id_project_team) {
    if (this.IsAdminGroup) return true;
    if (this.list_role) {
      var x = this.list_role.find((x) => x.id_row == id_project_team);
      if (x) {
        if (
          x.admin == true ||
          x.admin == 1 ||
          +x.owner == 1 ||
          +x.parentowner == 1
        ) {
          return true;
        } else {
          if (
            roleID == 7 ||
            roleID == 9 ||
            roleID == 11 ||
            roleID == 12 ||
            roleID == 13
          ) {
            if (x.Roles.find((r) => r.id_role == 15)) return false;
          }
          if (roleID == 10) {
            if (x.Roles.find((r) => r.id_role == 16)) return false;
          }
          if (roleID == 4 || roleID == 14) {
            if (x.Roles.find((r) => r.id_role == 17)) return false;
          }
          var r = x.Roles.find((r) => r.id_role == roleID);
          if (r) {
            return true;
          } else {
            return false;
          }
        }
      }
    }
    return false;
  }
  CheckRoleskeypermit(key, id_project_team) {
    const x = this.list_role.find(x => x.id_row === id_project_team);
    if (x) {
      if (x.locked) {
        return false;
      }
    }
    if (this.IsAdminGroup) {
      return true;
    }
    if (this.list_role) {
      if (x) {
        if (x.admin === true || +x.admin === 1 || +x.owner === 1 || +x.parentowner === 1) {
          return true;
        } else {
          // if (key === 'id_nv') {
          //   if (x.isuyquyen) {
          //     return true;
          //   }
          // }
          if (key === 'title' || key === 'description' || key === 'status' || key === 'checklist' || key === 'delete') {
            if (x.Roles.find((r) => r.id_role === 15)) {
              return false;
            }
          }
          if (key === 'deadline') {
            if (x.Roles.find((r) => r.id_role === 16)) {
              return false;
            }
          }
          if (key === 'id_nv' || key === 'assign') {
            if (x.Roles.find((r) => r.id_role === 17)) {
              return false;
            }
          }
          const r = x.Roles.find(role => role.keypermit === key);
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
    this._WorkGeneralService.UpdateByKey(item).subscribe((res) => {
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
    this._WorkGeneralService.ListStatusDynamicNew(val.id_project_team, val.id_row).subscribe(res => {
      if (res && res.status == 1) {
        this.listDataStatus = res.data;
      }
      this.changeDetectorRefs.detectChanges();
    })
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
    this._WidgetWork20Service.loadList(queryParams).subscribe(res => {
      this.isLoading = false;
      if (res && res.status == 1) {
        this.dataLazyLoad = [];

        this.dataLazyLoad = [...this.dataLazyLoad, ...res.data];

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
        this._WidgetWork20Service.loadList(queryParams)
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

  submit(val,element){
    if (val!=true) {
      element.comments=element.comments+1;
    }
  }
}
