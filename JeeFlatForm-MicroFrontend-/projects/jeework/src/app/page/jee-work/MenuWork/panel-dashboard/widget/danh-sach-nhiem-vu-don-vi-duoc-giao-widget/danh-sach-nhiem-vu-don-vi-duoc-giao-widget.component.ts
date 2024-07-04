import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { Subscription, fromEvent } from 'rxjs';
import { QueryParamsModelNew } from '../../../../models/query-models/query-params.model';
import { PanelDashboardService } from '../../Services/panel-dashboard.service';
import { DanhSachNhiemVuDonViService } from '../../Services/danh-sach-nhiem-vu-don-vi-widget.service';
import { WorksbyprojectService } from '../../Services/worksbyproject.service';
import { map, tap } from 'rxjs/operators';
import { LayoutUtilsService } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { UpdateWorkModel } from '../../Model/jee-work.model';
import { Router } from '@angular/router';
import { DanhMucChungService } from "../../../../services/danhmuc.service";

@Component({
  selector: 'app-danh-sach-nhiem-vu-don-vi-duoc-giao-widget',
  templateUrl: './danh-sach-nhiem-vu-don-vi-duoc-giao-widget.component.html',
  styleUrls: ['./danh-sach-nhiem-vu-don-vi-duoc-giao-widget.component.scss']
})
export class DanhSachNhiemVuDonViDuocGiaoWidgetComponent implements OnInit, OnDestroy {

  id_row:0;
  Team = 0;
  UserID = 0;
  idDK = 0;
  SQL_Custom: string = '';
  ListDK: any = [];
  selectedDate = {
    start: new Date(null),
    end: new Date(null),
  };
  idRole: number = -1;
  ListVaiTro: any[] = [];
  ListPhongban: any = [];
  @Input()
  idPb = 0;
  btnFilterSub: Subscription;
  _loading = false;
  _HasItem = false;
  crr_page = 0;
  page_size = 20;
  total_page = 0;
  isLoading: boolean = false;
  ListAllStatusDynamic: any = [];
  dataLazyLoad: any = [];
  ListStatus: any = [];
  ListProject:any=[];
  isgov: boolean = false;
  private subscriptions: Subscription[] = [];
  btnFilterEventTrangThaiCV36: EventEmitter<any> = new EventEmitter<any>();
  filterDSTrangThaiduan36: EventEmitter<any> = new EventEmitter<any>();
  constructor( private translate: TranslateService,
    public datePipe: DatePipe,
    private router: Router,
    private changeDetectorRefs: ChangeDetectorRef,
    private _PanelDashboardService: PanelDashboardService,
    private _DanhsachnhiemvudonviService:DanhSachNhiemVuDonViService,
    public workService: WorksbyprojectService,
    public layoutUtilsService: LayoutUtilsService,
    public DanhMucChungService:DanhMucChungService
    ) { 
      this.UserID = this._PanelDashboardService.getAuthFromLocalStorage().user.customData["jee-account"].userID;
    }

  ngOnInit(): void {
    this.LoadData();
    this.btnFilterSub = this.btnFilterEventTrangThaiCV36.subscribe((res) => {
      this.idPb = +res;
      this.loadList();
      var object = {
        list: this.ListProject,
        name: this.NameofTeam(),
        isgov: this.isgov,
        
      };
      this.filterDSTrangThaiduan36.emit(object);
    });
    this.workService.lite_project_by_manager().subscribe(
      (res) => {
        if (res && res.status == 1) {
          this.ListProject = res.data;
          this.isgov = res.isgov;
          var object = {
            list: this.ListProject,
            name: this.NameofTeam(),
            isgov: this.isgov,
          };
          this.filterDSTrangThaiduan36.emit(object);
          // this.Search();
        }
      }
    );
    const $eventload = fromEvent<CustomEvent>(window, 'event-reload-widget').subscribe((e) => this.onEventHandler(e));
  }
  onEventHandler(e: CustomEvent) {
    if (e.detail.eventType === 'load-data') {
      this.loadList();
    }
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  NameofTeam() {
    if (this.ListProject) {
      var team = this.ListProject.find(
        (element) => element.id_row == this.idPb
      );
      if (team) return team.title;
    }
    return "";
  }
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
    this._DanhsachnhiemvudonviService.loadList(queryParams).subscribe(res => {
      this.isLoading = false;
      if (res && res.status == 1) {
        this.dataLazyLoad = [];

        if(res.data.length > 0){
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
  NameofRole() {
    if (this.ListPhongban) {
      var team = this.ListVaiTro.find(
        (element) => +element.id == +this.idRole
      );
      if (team) return team.title;
      return "Chọn phạm vi";
    }
    return "Chọn phạm vi";
  }
  submit(val, element) {
    if (val != true) {
      if(val == "delete"){
        element.comments = element.comments - 1;
      }else{
        element.comments = element.comments + 1;
      }
    }
  }
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
  //=================Bổ sung đổi api status theo cấu trúc mới==============================
  public listDataStatus: any[] = [];
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
    this.workService.UpdateByKey(item).subscribe((res) => {
      if (res && res.status === 1) {
        this.loadList();
      } else {
        this.layoutUtilsService.showError(res.error.message);
      }
    });
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
  Xemchitiet(item) {
    this.router.navigate(['', { outlets: { auxName: 'auxWork/DetailsGOV/' + item.id_row }, }]);
  }
  getHeight(): any {
    let tmp_height = document.getElementById("gridster-height36").clientHeight;
    tmp_height = tmp_height - 120;
    return tmp_height + "px";
  }
  getWidth(): any {
    let tmp_width = document.getElementById("gridster-height36").clientWidth;
    return tmp_width > 500;
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
  f_convertDate(p_Val: any) {
    let a = p_Val === "" ? new Date() : new Date(p_Val);
    var date = moment(a).isValid();
    if (date) {
      return (
        ("0" + a.getDate()).slice(-2) +
        "/" +
        ("0" + (a.getMonth() + 1)).slice(-2) +
        "/" +
        a.getFullYear()
      );
    }
    else
      return null;
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  filterConfiguration(): any {
    let filter: any = {};
    filter.id_project_team = this.idPb;
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
        this._DanhsachnhiemvudonviService.loadList(queryParams)
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
  statusChange(val) {
    this.listDataStatus = [];
    this.workService.ListStatusDynamicNew(val.id_project_team, val.id_row).subscribe(res => {
      if (res && res.status == 1) {
        this.listDataStatus = res.data;
      }
      this.changeDetectorRefs.detectChanges();
    })
  }
  IsAdminGroup = false;
  list_role: any = [];
  LoadData() {
    this.workService.ListAllStatusDynamic().subscribe((res) => {
      if (res && res.status === 1) {
        this.ListAllStatusDynamic = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    }); 
  }
  //============================================================================
  reloadData(val){
    if(val){
      this.loadList_Lazy();
    }
  }
}
