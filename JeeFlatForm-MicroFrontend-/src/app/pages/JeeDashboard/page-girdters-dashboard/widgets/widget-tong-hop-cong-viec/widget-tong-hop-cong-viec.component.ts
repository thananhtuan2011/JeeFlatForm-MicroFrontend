import { ChangeDetectorRef, EventEmitter, OnDestroy, OnInit } from "@angular/core";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";
import { PageGirdtersDashboardService } from "../../Services/page-girdters-dashboard.service";
import { LayoutUtilsService } from "src/app/modules/crud/utils/layout-utils.service";
import { QueryParamsModelNew } from "src/app/_metronic/core/models/pagram";

@Component({
  selector: "widget-tong-hop-cong-viec",
  templateUrl: "./widget-tong-hop-cong-viec.component.html",
  styleUrls: ["./widget-tong-hop-cong-viec.component.scss"],
})
export class WidgetTongHopCongViecComponent
  implements
  OnInit,
  OnDestroy {
  isLoading: boolean = false;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  mylist: any = [];
  UserID = 0;
  ListAllStatusDynamic: any = [];
  @Input() cssClass: "";
  btn29: EventEmitter<any> = new EventEmitter<any>();
  btnFilterSub: Subscription;
  btn = 0;
  QuaHan: number = 0;
  ToiHan: number = 0;
  SapToiHan: number = 0;
  TrongHan: number = 0;

  constructor(
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    public _PageGirdtersDashboardService: PageGirdtersDashboardService,
    public layoutUtilsService: LayoutUtilsService,
    public router: Router,
    public dialog: MatDialog,
  ) {
    // this.UserID = auth.getUserId();
  }

  ngOnInit() {
    // const sb1 = this.jeeWorkStore.updateEvent$.subscribe(res => {
    //   if (res) {
    //     this.loadList();
    //     this.changeDetectorRefs.detectChanges();
    //   }
    // })
    this.btnFilterSub = this.btn29.subscribe((res) => {
      this.btn = res;
      this.loadList();
      this.changeDetectorRefs.detectChanges();
    });

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
    filter.SQL_Custom = 0;
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
    this._PageGirdtersDashboardService.getTongHopCongViec(queryParams).subscribe(res => {
      if (res && res.status == 1) {
        this.QuaHan = res.data.quahan;
        this.ToiHan = res.data.toihan;
        this.SapToiHan = res.data.saptoihan;
        this.TrongHan = res.data.tronghan;
      }
      this.changeDetectorRefs.detectChanges();
    });
  }

  getHeight(): any {
    let tmp_height = document.getElementById("gridster-height29").clientHeight;
    tmp_height = tmp_height - 90;
    return tmp_height + "px";
  }

  View(type) {
    let id = 8;
    switch (Number(this.btn)) {
      case 1: {//Được giao
        id = 1;
        break;
      }
      case 2: {//Đã giao
        id = 3;
        break;
      }
      case 3: {//Theo dõi
        id = 7;
        break;
      }
    }
    this.router.navigate(['', { outlets: { auxName: 'auxWork/List/' + id + '/-1/' + type }, }]);
  }
}
