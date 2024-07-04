import * as moment from "moment";
import { map, tap } from "rxjs/operators";
import { MatDialog, MatDialogConfig } from "@angular/material/dialog";
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
import { DatePipe } from "@angular/common";
import { UpdateWorkModel } from "../../Model/jee-work.model";
import { Worksbyproject25Service } from "../../Services/worksbyproject-25.service";
import { PanelDashboardService } from "../../Services/panel-dashboard.service";
import { WorkModel } from "../../Model/panel-dashboard.model";
import { LayoutUtilsService } from "projects/jeework/src/modules/crud/utils/layout-utils.service";
import { QueryParamsModelNew } from "../../../../models/query-models/query-params.model";
import { WorksbyprojectService } from "../../Services/worksbyproject.service";
import { ThemMoiCongViecKhongVanBanComponent } from "../../../them-moi-cong-viec-khong-van-ban/them-moi-cong-viec-khong-van-ban.component";
import { ThemMoiCongViecComponent } from "../../../them-moi-cong-viec/them-moi-cong-viec.component";
import { DanhMucChungService } from "../../../../services/danhmuc.service";
import { ThemMoiCongViecVer2Component } from "../../../them-moi-cong-viec-ver2/them-moi-cong-viec-ver2.component";
import { ThemMoiCongViecVer3Component } from "../../../them-moi-cong-viec-ver3/them-moi-cong-viec-ver3.component";
import { environment } from "projects/jeework/src/environments/environment";

@Component({
  selector: "works-by-project-25",
  templateUrl: "./works-by-project-25.component.html",
})
export class WorksByProject25Component implements OnInit, OnDestroy {
  @Input() cssClass: "";
  ListProject: any = [];
  Team = 0;
  UserID = 0;
  btnFilterSub: Subscription;
  btnFilterSubThem: Subscription;
  btnFilterEventCongviecDuan25: EventEmitter<string> = new EventEmitter<string>();
  btnFilterEventThemCongViecDuan25: EventEmitter<string> =
    new EventEmitter<string>();
  filterDanhSachDuAn25: EventEmitter<any> = new EventEmitter<any>();
  isgov: boolean = false;
  //=====================================================================
  btnPriority25: EventEmitter<any> = new EventEmitter<any>();
  btnFilterSub25: Subscription;
  Priority = 0;
  //=========================================================================
  btnFilterEventVaiTro25: EventEmitter<string> = new EventEmitter<string>();
  btnFilterSubVaiTro25: Subscription;
  filterDanhSachVaiTro25: EventEmitter<any> = new EventEmitter<any>();
  ListVaiTro: any[] = [];
  idRole: number = -1;
  //=============================================================
  btnLoadFilterEventCongviecDuan25: EventEmitter<string> = new EventEmitter<string>();
  btnLoadPriority25: EventEmitter<any> = new EventEmitter<any>();
  btnLoadFilterEventVaiTro25: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    public _Worksbyproject25Service: Worksbyproject25Service,
    private router: Router,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    public datePipe: DatePipe,
    public _PanelDashboardService: PanelDashboardService,
    public layoutUtilsService: LayoutUtilsService,
    private _WorksbyprojectService: WorksbyprojectService,
    public DanhMucChungService: DanhMucChungService,
  ) {
    this.UserID = this._PanelDashboardService.getAuthFromLocalStorage().user.customData["jee-account"].userID;
  }
  public filteredTeams: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  ListStatus: any = [];
  displayedColumns = [
    "congviec",
    "nguoigiao",
    "nguoitheodoi",
    "tinhtrang",
    "ngaygiao",
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
    this.linkApp = window.location.href.split('/')[2];
    this.btnFilterSub = this.btnFilterEventCongviecDuan25.subscribe((res) => {
      this.Team = +res;
      this.loadDanhSachVaiTro();
      var object = {
        list: this.ListProject,
        name: this.NameofTeam(),
        isgov: this.isgov,
      };
      this.filterDanhSachDuAn25.emit(object);
    });

    this.btnFilterSubThem = this.btnFilterEventThemCongViecDuan25.subscribe(
      (res) => {
        this.Themmoi();
      }
    );

    this._WorksbyprojectService.ListAllStatusDynamic().subscribe((res) => {
      if (res && res.status == 1) {
        this.ListStatus = res.data;
      }
    });

    this._WorksbyprojectService.lite_project_by_manager().subscribe(
      (res) => {
        if (res && res.status == 1) {
          this.ListProject = res.data;
          this.isgov = res.isgov;
          var object = {
            list: this.ListProject,
            name: this.NameofTeam(),
            isgov: this.isgov,
          };
          this.filterDanhSachDuAn25.emit(object);
          this.Search();
        }
      }
    );

    this.btnFilterSub25 = this.btnPriority25.subscribe((res) => {
      this.Priority = res;
      this.loadList();
      this.changeDetectorRefs.detectChanges();
    });

    this.btnFilterSubVaiTro25 = this.btnFilterEventVaiTro25.subscribe((res) => {
      if (res) {
        this.idRole = +res;
        this.loadList();
        var object = {
          list: this.ListVaiTro,
          name: this.NameofRole(),
        };
        this.filterDanhSachVaiTro25.emit(object);
      }
    });

    //Start-Bổ sung ngày 1/12/23
    this.btnFilterSub = this.btnLoadFilterEventCongviecDuan25.subscribe((res) => {
      this.Team = +res;
      this.loadDanhSachVaiTro();
      var object = {
        list: this.ListProject,
        name: this.NameofTeam(),
        isgov: this.isgov,
      };
      this.filterDanhSachDuAn25.emit(object);
    });

    this.btnFilterSub25 = this.btnLoadPriority25.subscribe((res) => {
      this.Priority = res;
      this.changeDetectorRefs.detectChanges();
    });

    this.btnFilterSubVaiTro25 = this.btnLoadFilterEventVaiTro25.subscribe((res) => {
      if (res) {
        this.idRole = +res;
        var object = {
          list: this.ListVaiTro,
          name: this.NameofRole(),
        };
        this.filterDanhSachVaiTro25.emit(object);
      }
    });
    //End-Bổ sung ngày 1/12/23

    const $eventload = fromEvent<CustomEvent>(window, 'event-reload-widget').subscribe((e) => this.onEventHandler(e));
  }
  onEventHandler(e: CustomEvent) {
    if (e.detail.eventType === 'load-data') {
      this.loadList();
    }
  }
  ngOnChanges() {
    // if (this.dataSource) this.loadList();
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

  ChangeTeam(item) {
    if (this.Team == item.id_row) return;
    this.Team = item.id_row;
    this.loadList();
  }

  NameofTeam() {
    if (this.ListProject) {
      var team = this.ListProject.find(
        (element) => element.id_row == this.Team
      );
      if (team) return team.title_full;
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
  linkApp:any;
  Themmoi() {
    if (this.isgov) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        title: '',
        message: '',
      };
      dialogConfig.width = '40vw';
      dialogConfig.panelClass = 'my-custom-dialog-class';
      let item;
      if (this.linkApp == environment.Key_Soffice) {//app.csstech.vnlocalhost:1200
        item = ThemMoiCongViecVer3Component;
      }
      else {
        item = ThemMoiCongViecVer2Component;
      }
      const dialogRef = this.dialog.open(item, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          this.loadList();
        }
        else {
          this.loadList();
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          this.loadList();
        }
        else {
          this.loadList();
        }
      });
    } else {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        title: '',
        message: '',
      };
      dialogConfig.width = '40vw';
      dialogConfig.panelClass = 'my-custom-dialog-class';
      const dialogRef = this.dialog.open(ThemMoiCongViecKhongVanBanComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          this.loadList();
        }
        else {
          this.loadList();
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          this.loadList();
        }
        else {
          this.loadList();
        }
      });
    }
  }

  getHeight(): any {
    let tmp_height = document.getElementById("gridster-height25").clientHeight;
    tmp_height = tmp_height - 120;
    return tmp_height + "px";
  }
  getWidth(): any {
    let tmp_width = document.getElementById("gridster-height25").clientWidth;
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
  IsAdminGroup = false;
  list_role: any = [];

  UpdateStatus(task, status) {
    if (+task.status === +status.id_row) {
      return;
    }
    this.UpdateByKey(task, "status", status.id_row);
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
    return item.hoten + ' \n ' + item.jobtitle;
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

  getClassdate(value) {
    //Convert ngày về dạng string MM/dd/yyyy
    let str_tmp1 = this.datePipe.transform(new Date(value) + 'z', 'MM/dd/yyyy HH:mm:ss');
    let str_tmp2 = this.datePipe.transform(new Date(), 'MM/dd/yyyy HH:mm:ss');
    //Part giá trị này về lại dạng ngày
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
    this._Worksbyproject25Service.loadList(queryParams).subscribe(res => {
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
      this.changeDetectorRefs.detectChanges();
    });
  }

  filterConfiguration(): any {
    let filter: any = {};
    filter.id_project_team = this.Team;
    filter.clickup_prioritize = this.Priority;
    filter.id_role = this.idRole;
    return filter;
  }

  loadList_Lazy() {
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
        this._Worksbyproject25Service.loadList(queryParams)
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
    this._PanelDashboardService.listrole_filterbyreport(queryParams).subscribe(
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
          this.filterDanhSachVaiTro25.emit(object);
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
      this.loadList_Lazy();
    }
  }
}
