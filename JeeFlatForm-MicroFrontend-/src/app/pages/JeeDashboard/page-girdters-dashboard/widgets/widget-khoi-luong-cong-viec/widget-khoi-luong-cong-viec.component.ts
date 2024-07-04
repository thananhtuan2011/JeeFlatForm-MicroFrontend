import { ChangeDetectorRef, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { PageGirdtersDashboardService } from "../../Services/page-girdters-dashboard.service";
import { WorkGeneralService } from "../../Services/work-general.services";
import { LayoutUtilsService } from "src/app/modules/crud/utils/layout-utils.service";
import { QueryParamsModelNew } from "src/app/_metronic/core/models/pagram";

@Component({
  selector: "widget-khoi-luong-cong-viec",
  templateUrl: "./widget-khoi-luong-cong-viec.component.html",
  styleUrls: ["./widget-khoi-luong-cong-viec.component.scss"],
})
export class WidgetKhoiLuongCongViecComponent
  implements
  OnInit,
  OnDestroy {
  isLoading: boolean = false;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  mylist: any = [];
  UserID = 0;
  ListAllStatusDynamic: any = [];
  @Input() cssClass: "";
  btn30: EventEmitter<any> = new EventEmitter<any>();
  btnFilterSub: Subscription;
  btn = 0;
  TongSoGio: number = 0;
  HoanThanh: number = 0;
  HoanThanhQuaHan: number = 0;
  btnFilterEventCondition_Widget30: EventEmitter<any> = new EventEmitter<any>();
  btnFilterDK_Widget30: Subscription;
  btnThietlapFilter_Widget30: EventEmitter<any> = new EventEmitter<any>();
  btnThietlap_Widget30: Subscription;

  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    public _PageGirdtersDashboardService: PageGirdtersDashboardService,
    public layoutUtilsService: LayoutUtilsService,
    public router: Router,
    public dialog: MatDialog,
    private _WorkGeneralService: WorkGeneralService,
  ) {
    // this.UserID = auth.getUserId();
  }

  ngOnInit() {
    this.btnFilterSub = this.btn30.subscribe((res) => {
      this.btn = res;
      this.loadList();
      this.changeDetectorRefs.detectChanges();
    });
    this.btnFilterDK_Widget30 = this.btnFilterEventCondition_Widget30.subscribe((res) => {
      if (res != this.idDK) {
        this.idDK = res.RowID;
        this.SQL_Custom = res.SQL_Custom;
        setTimeout(() => {
          this.loadList();
          this.changeDetectorRefs.detectChanges();
        }, 1000);
        var object = {
          list: this.ListDK,
          name: this.NameofDK(),
        };
        this.filterDieuKienLoc_Widget30.emit(object);
      }
    });
    this.btnThietlap_Widget30 = this.btnThietlapFilter_Widget30.subscribe((res) => {
      this.load_đk();
    });
    this.load_đk();
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
    filter.loaicongviec = this.btn;
    if (this.SQL_Custom) {
      filter.SQL_Custom = this.idDK;
    }
    else filter.SQL_Custom = 0;
    return filter;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  getClasses(val) {
    return "btn btn-sm text-uppercase item-status";
  }

  //=======================Xử lý load top 20 - 26/12/2022==========================
  _loading = false;
  _HasItem = false;
  crr_page = 0;
  page_size = 20;
  total_page = 0;
  dataLazyLoad: any = [];
  loadList() {
    const queryParams = new QueryParamsModelNew(
      this.filterConfiguration(),
      'asc',
      '',
      this.crr_page,
      this.page_size,
      true
    );
    this._PageGirdtersDashboardService.getWorkLoad(queryParams).subscribe(res => {
      if (res && res.status == 1) {
        this.HoanThanh = res.data.ht_dunghan;
        this.TongSoGio = res.data.sum_est;
        this.HoanThanhQuaHan = res.data.dt_quahan;
      }
      this.changeDetectorRefs.detectChanges();
    });
  }

  getHeight(): any {
    let tmp_height = document.getElementById("gridster-height29").clientHeight;
    tmp_height = tmp_height - 90;
    return tmp_height + "px";
  }

  View(id) {
    // const dialogRef = this.dialog.open(CongViecTheoDuAnListPopupComponent, { data: { _idTienDo: id, _IDDrop: this.btn }, panelClass: ['sky-padding-0', 'width90'], disableClose: true });
    // dialogRef.afterClosed().subscribe(res => {
    //   this.loadList();
    // });
  }
  //========================================================================
  ListDK: any = [];
  idDK = 0;
  SQL_Custom: string = '';
  filterDieuKienLoc_Widget30: EventEmitter<any> = new EventEmitter<any>();
  load_đk() {
    this._WorkGeneralService.Get_listCustomWidgetByUser(30).subscribe(res => {
      if (res && res.status == 1) {

        this.ListDK = res.data;
        var object = {
          list: this.ListDK,
          name: this.NameofDK(),
        };
        this.filterDieuKienLoc_Widget30.emit(object);
      }
    })
  }
  NameofDK() {
    if (this.ListDK) {
      var team = this.ListDK.find(
        (element) => element.RowID == this.idDK
      );
      if (team) return team.Title;
    }
    return "Chọn điều kiện";
  }
}
