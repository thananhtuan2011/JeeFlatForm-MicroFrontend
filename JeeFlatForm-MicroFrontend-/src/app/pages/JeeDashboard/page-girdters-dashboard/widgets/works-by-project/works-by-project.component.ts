import * as moment from "moment";
import { map, tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Input,
  EventEmitter,
  OnDestroy,
} from "@angular/core";
import { BehaviorSubject, ReplaySubject, Subscription, fromEvent } from "rxjs";
import { WorksbyprojectService } from "../../Services/worksbyproject.service";
import { PageGirdtersDashboardService } from "../../Services/page-girdters-dashboard.service";
import { WorkGeneralService } from "../../Services/work-general.services";
import { UpdateWorkModel, WorkModel } from "../../Model/work-general.model";
import { LayoutUtilsService } from "src/app/modules/crud/utils/layout-utils.service";
import { QueryParamsModelNew } from "src/app/_metronic/core/models/pagram";

@Component({
  selector: "works-by-project",
  templateUrl: "./works-by-project.component.html",
})
export class WorksByProjectComponent implements OnInit, OnDestroy {
  @Input() cssClass: "";
  ListProject: any = [];
  Team = 0;
  UserID = 0;
  btnFilterSub: Subscription;
  btnFilterSubThem: Subscription;
  btnFilterEventCongviecDuan: EventEmitter<string> = new EventEmitter<string>();
  btnFilterEventThemCongViecDuan: EventEmitter<string> =
    new EventEmitter<string>();
  filterDanhSachDuAn: EventEmitter<any> = new EventEmitter<any>();
  isgov: boolean = false;
  //=====================================================================
  btnPriority10: EventEmitter<any> = new EventEmitter<any>();
  btnFilterSub10: Subscription;
  Priority = 0;
  //=========================================================================
  btnFilterEventVaiTro10: EventEmitter<string> = new EventEmitter<string>();
  btnFilterSubVaiTro10: Subscription;
  filterDanhSachVaiTro10: EventEmitter<any> = new EventEmitter<any>();
  ListVaiTro: any[] = [];
  idRole: number = -1;
  constructor(
    public _WorksbyprojectService: WorksbyprojectService,
    private router: Router,
    public dialog: MatDialog,
    public layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private _PageGirdtersDashboardService: PageGirdtersDashboardService,
    public _WorkGeneralService: WorkGeneralService,
  ) {
    this.UserID = this._PageGirdtersDashboardService.getAuthFromLocalStorage().user.customData["jee-account"].userID;
  }
  public filteredTeams: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  ListStatus: any = [];
  displayedColumns = [
    "congviec",
    "tinhtrang",
    "ngayhethan",
    "binhluan",
  ];
  list_priority = [
    {
      name: "Quan trọng",
      value: 1,
      color: "#dc3545", //bg-danger
    },
    {
      name: "Cao",
      value: 2,
      color: "#ffc107", //bg-warning
    },
    {
      name: "Thường",
      value: 3,
      color: "#17a2b8", //bg-info
    },
    {
      name: "Thấp",
      value: 4,
      color: "#6c757d", //bg-secondary
    },
    {
      name: "",
      value: 0,
      color: "#0e800047", //bg-secondary
    },
  ];

  public defaultColors: string[] = [
    "#848E9E",
    // 'rgb(187, 181, 181)',
    "rgb(29, 126, 236)",
    "rgb(250, 162, 140)",
    "rgb(14, 201, 204)",
    "rgb(11, 165, 11)",
    "rgb(123, 58, 245)",
    "rgb(238, 177, 8)",
    "rgb(236, 100, 27)",
    "rgb(124, 212, 8)",
    "rgb(240, 56, 102)",
    "rgb(255, 0, 0)",
    "rgb(0, 0, 0)",
    "rgb(255, 0, 255)",
  ];

  ngOnInit(): void {
    this.btnFilterSub = this.btnFilterEventCongviecDuan.subscribe((res) => {
      this.Team = +res;
      setTimeout(() => {
        this.loadDanhSachVaiTro();
        this.changeDetectorRefs.detectChanges();
      }, 1000);
      var object = {
        list: this.ListProject,
        name: this.NameofTeam(),
        isgov: this.isgov,
      };
      this.filterDanhSachDuAn.emit(object);
    });
    this.btnFilterSubThem = this.btnFilterEventThemCongViecDuan.subscribe(
      (res) => {
        this.Themmoi();
      }
    );

    this._WorkGeneralService.ListAllStatusDynamic().subscribe((res) => {
      if (res && res.status == 1) {
        this.ListStatus = res.data;
      }
    });

    this._WorkGeneralService.lite_project_by_manager().subscribe(
      (res) => {
        if (res && res.status == 1) {
          this.ListProject = res.data;
          this.isgov = res.isgov;
          var object = {
            list: this.ListProject,
            name: this.NameofTeam(),
            isgov: this.isgov,
          };
          this.filterDanhSachDuAn.emit(object);
          var object_role = {
            list: this.ListVaiTro,
            name: this.NameofRole(),
          };
          this.filterDanhSachVaiTro10.emit(object_role);
        }
      }
    );

    this.btnFilterSubVaiTro10 = this.btnFilterEventVaiTro10.subscribe((res) => {
      this.idRole = +res;
      this.loadList();
      var object = {
        list: this.ListVaiTro,
        name: this.NameofRole(),
      };
      this.filterDanhSachVaiTro10.emit(object);
    });

    this.btnFilterSub10 = this.btnPriority10.subscribe((res) => {
      this.Priority = res;
      this.loadList();
      this.changeDetectorRefs.detectChanges();
    });

    const $eventload = fromEvent<CustomEvent>(window, 'event-reload-widget').subscribe((e) => this.onEventHandler(e));
  }

  onEventHandler(e: CustomEvent) {
    if (e.detail.eventType === 'load-data') {
      this.loadList();
    }
  }

  ngOnChanges() {
  }

  f_convertDate(v: any, type = "dmy") {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      if (type == "dmy")
        return (
          ("0" + a.getDate()).slice(-2) +
          "/" +
          ("0" + (a.getMonth() + 1)).slice(-2) +
          "/" +
          a.getFullYear()
        );
      else {
        return (
          (("0" + (a.getMonth() + 1)).slice(-2) + "0" + a.getDate()).slice(-2) +
          "/" +
          "/" +
          a.getFullYear()
        );
      }
    }
  }

  NameofTeam() {
    if (this.ListProject) {
      var team = this.ListProject.find(
        (element) => element.id_row == this.Team
      );
      if (team) return team.title;
    }
    return "Tất cả";
  }

  getTinhtrangCV(item, field = "title") {
    var liststatus;
    if (this.ListStatus.find((x) => x.id_row == item.id_project_team)) {
      liststatus = this.ListStatus.find(
        (x) => x.id_row == item.id_project_team
      ).status;
    } else return "";
    var status = liststatus.find((x) => x.id_row == item.status);
    if (!status) return;
    if (field == "color") {
      return status.color;
    } else {
      return status.statusname;
    }
  }

  filterConfiguration(): any {
    let filter: any = {};
    filter.id_project_team = this.Team;
    filter.clickup_prioritize = this.Priority;
    filter.id_role = this.idRole;
    return filter;
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
  Search() {
    var ele = <HTMLInputElement>document.getElementById("searchTeam");
    var text = ele ? ele.value : "";
    this.filteredTeams.next(
      this.ListProject.filter(
        (bank) => bank.title.toLowerCase().indexOf(text) > -1 && bank.id_row > 0
      )
    );
  }

  ngOnDestroy() {
    this.btnFilterSub.unsubscribe();
    this.btnFilterSubThem.unsubscribe();
  }
  endOfWeek(date) {
    var lastday = date.getDate() - (date.getDay() - 1) + 6;
    return new Date(date.setDate(lastday));
  }

  Xemchitiet(item) {
    this.router.navigate(['', { outlets: { auxName: 'auxWork/DetailsGOV/' + item.id_row }, }]);
  }

  Themmoi() {
    if (this.isgov) {
      this.router.navigate(['', { outlets: { auxName: 'auxWork/AddGOV2/0' }, }]);
    } else {
      this.router.navigate(['', { outlets: { auxName: 'auxWork/Add' }, }]);
    }
  }

  getHeight(): any {
    let tmp_height = document.getElementById("gridster-height10").clientHeight;
    tmp_height = tmp_height - 120;
    return tmp_height + "px";
  }
  getWidth(): any {
    let tmp_width = document.getElementById("gridster-height10").clientWidth;
    return tmp_width > 650;
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
  RemoveTag(tag, item) {
    const model = new UpdateWorkModel();
    model.id_row = item.id_row;
    model.key = "Tags";
    model.value = tag.id_row;
    this._WorkGeneralService.UpdateByKey(model).subscribe((res) => {
      if (res && res.status == 1) {
        this.loadList();
      } else {
        this.layoutUtilsService.showError(res.error.message);
      }
    });
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
    const x = this.list_role.find((x) => x.id_row === id_project_team);
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
        if (
          x.admin === true ||
          +x.admin === 1 ||
          +x.owner === 1 ||
          +x.parentowner === 1
        ) {
          return true;
        } else {
          // if (key === 'id_nv') {
          //   if (x.isuyquyen) {
          //     return true;
          //   }
          // }
          if (
            key === "title" ||
            key === "description" ||
            key === "status" ||
            key === "checklist" ||
            key === "delete"
          ) {
            if (x.Roles.find((r) => r.id_role === 15)) {
              return false;
            }
          }
          if (key === "deadline") {
            if (x.Roles.find((r) => r.id_role === 16)) {
              return false;
            }
          }
          if (key === "id_nv" || key === "assign") {
            if (x.Roles.find((r) => r.id_role === 17)) {
              return false;
            }
          }
          const r = x.Roles.find((role) => role.keypermit === key);
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

  UpdateByKey(task, key, value) {
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
        if (
          x.admin === true ||
          +x.admin === 1 ||
          +x.owner === 1 ||
          +x.parentowner === 1
        ) {
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

  //==========================================================
  getMoreInformation(item): string {
    return item.hoten + ' \n ' + item.tenchucdanh;
  }

  // tags
  list_Tag = [];
  mark_tag(val) {
    this._WorkGeneralService.lite_tag(val.id_project_team).subscribe((res) => {
      if (res && res.status === 1) {
        this.list_Tag = res.data;
      }
    });
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
  isLoading: boolean = false;
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
    this._WorksbyprojectService.WorksByProject(queryParams).subscribe(res => {
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
        this._WorksbyprojectService.WorksByProject(queryParams)
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

  //=========================================================================
  loadDanhSachVaiTro() {
    const queryParams = new QueryParamsModelNew(
      this.filterConfigurationVaiTro(),
      'asc',
      '',
      0,
      100,
      true,
    );
    this._WorkGeneralService.listrole_filterbyreport(queryParams).subscribe(
      (res) => {
        if (res && res.status == 1) {
          this.ListVaiTro = res.data;
          if (this.idRole == -1) {
            this.idRole = res.data[0].id;
          }
          var object = {
            list: this.ListVaiTro,
            name: this.NameofRole(),
          };
          this.loadList();
          this.filterDanhSachVaiTro10.emit(object);
        }
      }
    );
  }

  filterConfigurationVaiTro(): any {
    let filter: any = {};
    filter.id_project = this.Team;
    return filter;
  }

  NameofRole() {
    if (this.ListProject) {
      var team = this.ListVaiTro.find(
        (element) => +element.id == +this.idRole
      );
      if (team) return team.title;
      return "Chọn phạm vi";
    }
    return "Chọn phạm vi";
  }

  //============================================================================
  reloadData(val) {
    if (val) {
      this.loadDataList_Lazy();
    }
  }
}
