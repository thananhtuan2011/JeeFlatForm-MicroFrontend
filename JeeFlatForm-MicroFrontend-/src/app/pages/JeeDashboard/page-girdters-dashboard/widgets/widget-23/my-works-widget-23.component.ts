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
import { PageGirdtersDashboardService } from "../../Services/page-girdters-dashboard.service";
import { WidgetWork23Service } from "../../Services/works-widget-23.service";
import { WorkGeneralService } from "../../Services/work-general.services";
import { UpdateWorkModel } from "../../Model/work-general.model";
import { LayoutUtilsService } from "src/app/modules/crud/utils/layout-utils.service";
import { QueryParamsModelNew } from "src/app/_metronic/core/models/pagram";

@Component({
  selector: "my-works-widget-23",
  templateUrl: "./my-works-widget-23.component.html",
  styleUrls: ["./my-works-widget-23.component.scss"],
})
export class MyWorksWidget23Component
  implements
  OnInit,
  OnDestroy {
  isLoading: boolean = false;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  mylist: any = [];
  UserID = 0;
  ListAllStatusDynamic: any = [];
  @Input() cssClass: "";

  btnFilterTag23: EventEmitter<any> = new EventEmitter<any>();
  btnFilterTag: Subscription;
  Tag = 0;
  filterEvent23: EventEmitter<any> = new EventEmitter<any>();
  filterTag23: EventEmitter<any> = new EventEmitter<any>();
  ListTag: any = [];//Phòng ban
  //====================================================================
  isgov: boolean = false;
  constructor(
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    public _WidgetWork23Service: WidgetWork23Service,
    public router: Router,
    private translate: TranslateService,
    public dialog: MatDialog,
    private _PageGirdtersDashboardService: PageGirdtersDashboardService,
    public _WorkGeneralService: WorkGeneralService,
    public layoutUtilsService: LayoutUtilsService,
  ) {
    this.UserID = this._PageGirdtersDashboardService.getAuthFromLocalStorage().user.customData["jee-account"].userID;
  }

  startdate: any = "";
  enddate: any = "";
  status = "";

  ngOnInit() {
    this.LoadData();
    // const sb = this._WidgetWork23Service.isLoading$.subscribe(
    //   (res) => (this.isLoading = res)
    // );
    // this.subscriptions.push(sb);
    //this.loadPage();
    const $eventload = fromEvent<CustomEvent>(window, 'event-reload-widget').subscribe((e) => this.onEventHandler(e));
    this.btnFilterTag = this.btnFilterTag23.subscribe((res) => {
      if (res != this.Tag || this.Tag == 0) {
        this.Tag = res;
        this.loadList();
        var object = {
          list: this.ListTag,
          name: this.NameofTag(),
        };
        this.filterTag23.emit(object);
      }
    });
    this.loadTag();
  }

  onEventHandler(e: CustomEvent) {
    if (e.detail.eventType === 'load-data') {
      this.loadList();
    }
  }

  reset() { }
  // loadList() {
  //   this.layoutUtilsService.showWaitingDiv();
  //   this._WidgetWork23Service.MyWorks(this.filterConfiguration());
  // }
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
    this._WidgetWork23Service.loadList(queryParams).subscribe(res => {
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
        this._WidgetWork23Service.loadList(queryParams)
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
  // loadPage() {
  //   this.layoutUtilsService.showWaitingDiv();
  //   var arrayData = [];
  //   this._WidgetWork23Service.items$.subscribe((res) => {
  //     this.layoutUtilsService.OffWaitingDiv();
  //   });
  // }
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
    filter.loaicongviec = 3;
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

    // if (this.Tag > 0) {
    //   filter.id_tag = this.Tag;
    // }

    //---Tuan-12/1/2023-----//
    //Khi truyen id_tag = 0 thi se lay tat ca nhiem vu co gan the
    filter.id_tag = this.Tag;
    //-----------------------//

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
    let tmp_height = document.getElementById("gridster-height23").clientHeight;
    tmp_height = tmp_height - 120;
    return tmp_height + "px";
  }
  getWidth(): any {
    let tmp_width = document.getElementById("gridster-height23").clientWidth;
    return tmp_width > 500;
  }

  UpdateStatus(task, status) {
    if (+task.status === +status.id_row) {
      return;
    }
    this.UpdateByKey(task, "status", status.id_row);
  }
  updateDate(task, date, field) {
    if (date) {
      this.UpdateByKey(task, field, moment(date).format("MM/DD/YYYY HH:mm"));
    } else {
      this.UpdateByKey(task, field, null);
    }
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

  loadTag() {
    this._WorkGeneralService.lite_tag_default().subscribe(
      (res) => {
        if (res && res.status == 1) {
          this.ListTag = res.data;
          var object = {
            list: this.ListTag,
            name: this.NameofTag(),
          };
          this.filterTag23.emit(object);
        }
      }
    );
  }
  NameofTag() {
    if (this.ListTag) {
      var team = this.ListTag.find(
        (element) => element.RowID == this.Tag
      );
      if (team) return team.Title;
    }
    return "Tất cả";
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

  //============================================================================
  reloadData(val) {
    if (val) {
      this.loadDataList_Lazy();
    }
  }
}
