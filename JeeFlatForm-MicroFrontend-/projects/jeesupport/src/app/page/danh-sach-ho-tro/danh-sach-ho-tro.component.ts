import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import moment from "moment";
import { Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, tap } from "rxjs/operators";
import { AddSupPopupComponent } from "../add-sup-popup/add-sup-popup.component";
import { ListStatusDTO } from "../_models/list-status-list-managament.model";
import { DanhSachHoTroService } from "../_services/danh-sach-ho-tro.service";
// import { DangKyCuocHopService } from '../../_services/dang-ky-cuoc-hop.service';
import { TicketRequestManagementService } from '../_services/ticket-request-management.service';
import { FormatTimeService } from "../_services/jee-format-time.component";
import { PaginatorState } from "../_models/paginator.model";
import { SortState } from "../_models/sort.model";
import { GroupingState } from "../_models/grouping.model";
import { SocketioService } from "../_services/socketio.service";
import { QueryParamsModel } from "../_models/query-params.model";
import { QueryParamsModelNew } from "../_models/pagram";
import { LayoutUtilsService } from "../../modules/crud/utils/layout-utils.service";


@Component({
  selector: "app-danh-sach-ho-tro",
  templateUrl: "./danh-sach-ho-tro.component.html",
  styleUrls: ["./danh-sach-ho-tro.component.scss"],
})
export class DanhSachHoTroComponent implements OnInit {
  activeTabId:
    | "kt_quick_panel_logs"
    | "kt_quick_panel_notifications"
    | "kt_quick_panel_settings" = "kt_quick_panel_logs";
  searchGroup: FormGroup;
  tinhTrang: string = "0";
  minDate: string = "";
  maxDate: string = "";
  TuNgay: string = "";
  DenNgay: string = "";
  keyword: string;
  labelFilter: string = "Tất cả";
  isLoad: string = "";
  status: string = "1";
  Type: string = "1";
  createType: boolean = false;
  soluongtoithamgia: any = 0;
  soluongtoicapnhat: any = 0;
  selectedTab: number = 0;
  // constructor(
  //   private changeDetectorRefs: ChangeDetectorRef,
  //   private router: Router
  //   ) { }
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  private subscriptions: Subscription[] = [];
  isData: any;

  currentStatus = "";
  currentRange = "";
  Ticketid: number;
  stautsDTO: ListStatusDTO[];

  constructor(
    private fb: FormBuilder,
    public danhSachHoTroService: DanhSachHoTroService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    private socketService: SocketioService,
    private TicketRequestManagementService: TicketRequestManagementService,
    public messageService: DanhSachHoTroService,
    public FormatTimeService: FormatTimeService,
    private layoutUtilsService: LayoutUtilsService,

  ) { }

  ngOnInit() {

    //this.danhSachHoTroService.fetch();
    this.ChangeStageRange(1);
    this.loadDataList2();
    this.danhSachHoTroService.items$.subscribe((data) => {
      if (data) {
        data.forEach((element) => {
          this.socketService
            .getNewNotificationList(element.RowID)
            .subscribe((res) => {
              if (res) {
                element.CountMessage = res.length;
              }
            });
        });
      }
    });
    this.TicketRequestManagementService.send$.subscribe((data:any)=>{
      if(data&&data!=""){
        if(data=='Load')
        this.loadDataList2();
        this.TicketRequestManagementService.send$.next("");
      }
    })
    // this.grouping = this.danhSachHoTroService.grouping;
    // this.paginator = this.danhSachHoTroService.paginator;
    // this.sorting = this.danhSachHoTroService.sorting;
    const sb = this.danhSachHoTroService.isLoading$.subscribe((res) => {
      this.isLoading = res;
    });
    this.subscriptions.push(sb);

    this.searchForm();

  }
  setActiveTabId(tabId, type) {
    this.activeTabId = tabId;
    this.isLoad = tabId;
    this.Type = type;
  }

  item: any = [];
  changeRoute(item) {
    this.Ticketid = item.RowID;
    this.router.navigateByUrl(`Support/${this.Ticketid}`);
  }
  ChangeStage(val) {
    if (this.currentRange != "") {
      this.rangee = this.currentRange;
    }
    if (val == "4") {
      this.statuss = "";
      this.currentStatus = "";
    } else {
      this.statuss = val;
      this.currentStatus = val;
    }
    this.loadDataList2();
  }

  ChangeStageRange(val) {
    const filter = {};
    this.rangee = val;
    if (this.currentStatus != "") {
      this.statuss = this.currentStatus;
    }
    this.currentRange = val;
    this.loadDataList2();
  }

  getColorStatus(value: number) {
    if (!value) return;
    let result = "";
    switch (value) {
      case 0:
        return (result = "#848E9E");
      case 1:
        return (result = "rgb(11, 165, 11)");
      case 2:
        return (result = "rgb(240, 56, 102)");
      case 3:
        return (result = "rgb(255, 0, 0)");
    }
    return result;
  }


  Create() {
    const dialogRef = this.dialog.open(AddSupPopupComponent);
    dialogRef.afterClosed().subscribe((res) => {
      // debugger;
      if (res) {

        this.messageService.getIdCurren('Requests').subscribe(res => {
          this.Ticketid = res.data;
          this.loadDataList2();

          this.danhSachHoTroService
            .Get_ChiTietHoTro(this.Ticketid)
            .subscribe((res) => {
              this.changeDetectorRefs.detectChanges();
            });
          this.messageService
            .GetOnlyMessageThread(this.Ticketid)
            .subscribe((res) => {
            });
          this.router.navigateByUrl(`Support/${this.Ticketid}`);

        })



      }
    });
  }
  searchForm() {
    this.searchGroup = this.fb.group({
      searchTerm: [""],
    });
    const searchEvent = this.searchGroup.controls.searchTerm.valueChanges
      .pipe(
        /*
      The user can type quite quickly in the input box, and that could trigger a lot of server requests. With this operator,
      we are limiting the amount of server requests emitted to a maximum of one every 150ms
      */
        debounceTime(150),
        distinctUntilChanged()
      )
      .subscribe((val) => this.search(val));
    this.subscriptions.push(searchEvent);
  }
  search(searchTerm: string) {
    this.keywordd=searchTerm;
    this.loadDataList2();
  }

  getActiveCSSClasses(tabId) {
    if (tabId !== this.activeTabId) {
      return "";
    }
    return "active show chieucao";
  }

  taoMoiCuocHop() {
    // this.router.navigate(['/Meeting/create/',0]);
    // this.dangKyCuocHopService.data_share$.next('load')
  }

  getWidth() {
    let tmp_width = 0;
    tmp_width = window.innerWidth - 420;
    return tmp_width + "px";
  }

  ngOnDestroy(): void {
    this.createType = false;
    this.changeDetectorRefs.detectChanges();
  }
  getColor2(condition: number = 0): string {
    switch (condition) {
      case 1:
        return "#0A9562";
      case -2:
        return "#0A9562";
    }
    return "#ff6a00";
  }

  // getHeight(): any {
  //   let tmp_height = 0;
  //   tmp_height = window.innerHeight - 100;
  //   return tmp_height + 'px';
  // }
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 200;
    return tmp_height + "px";
  }
  onScroll(event) {
    let _el = event.srcElement;
    if (_el.scrollTop + _el.clientHeight > _el.scrollHeight * 0.95) {
      this.LoadDataLazy();
    }
  }
  convertDateExpired(d: any, t: number) {
    if (d == null || d == "") return "";
    let now = new Date(new Date().toString());
    let date = new Date(moment(d).add(t, "minutes").toString());
    let dateAdd = new Date(moment(now).add(t, "minutes").toString());
    if (date >= now && date <= dateAdd) return 1;
    return 0;
  }
  changed(item) {
    const filter = {};
    if (item == 4) {
      this.statuss = "Pending"; //đã trả lời
      this.labelFilter = "Đã trả lời";
    }
    if (item == 2) {
      this.statuss = "Solved"; //chưa trả lời
      this.labelFilter = "Chưa trả lời";
    }
    if (item == 3) {
      this.statuss = "Closed"; //đã hủy
      this.labelFilter = "Đã hủy";
    }
    if (item == 1) {
      this.statuss = ""; //tất cả
      this.labelFilter = "Tất cả";
    }
    // this.loadDataList2();
  }

  categoryy:any;
  statuss:any
  rangee:any;
  keywordd:any;
  filterConfiguration(): any {
    const filter: any = {};
    filter.range = this.rangee;
    filter.keyword=this.keywordd;
    filter.status=this.statuss;
    filter.category=this.categoryy;
    return filter;
  }
  isGov: any;
  sortOrder: string;
  sortField: string;
  _loading = false;
  _HasItem = false;
  crr_page = 0;
  page_size = 7;
  total_page = 0;
  dataLazyLoad: any = [];
  LoadDataLazy() {
    if (!this._loading) {
      this.crr_page++;
      if (this.crr_page < this.total_page) {
        this._loading = true;
        const queryParams = new QueryParamsModel(
          this.filterConfiguration(),
          'asc',
          '',
          this.crr_page,
          this.page_size,
        );
        this.danhSachHoTroService.loadSupportLazy(queryParams)
          .pipe(
            tap(resultFromServer => {
              // this.isGov = resultFromServer.isgov;
              if (resultFromServer.status == 1) {
                this.dataLazyLoad = [...this.dataLazyLoad, ...resultFromServer.data];
                if (resultFromServer.data.length > 0) {
                  this._HasItem = true;
                }
                else {
                  this._HasItem = false
                }
                this.changeDetectorRefs.detectChanges();
              }
              else {
                this._loading = false;
                this._HasItem = false;
              }
            })
          ).subscribe(res => {
            this._loading = false
          });
      }

    }
  }
  isload = true;
  loadDataList2() {
    this.crr_page = 0;
    this.page_size =10;
    this.dataLazyLoad = [];
    const queryParams = new QueryParamsModelNew(
      this.filterConfiguration(),
      'asc',
      '',
      this.crr_page,
      this.page_size,
    );
    if (this.filterConfiguration() != null) {
      this.isload = true;
      let api_service;
        api_service = this.danhSachHoTroService.loadSupportLazy(queryParams)
      setTimeout(() => {
        if (this.isload) {
          this.layoutUtilsService.showWaitingDiv();
        }
      }, 2000);
      api_service.subscribe(res => {
        if (res && res.status == 1) {
          this.dataLazyLoad = [];
          if (res.data.length > 0) {
            this.dataLazyLoad = [...this.dataLazyLoad, ...res.data];
          }
          this.total_page = res.panigator ? res.panigator.AllPage : 0;
          if (this.dataLazyLoad.length > 0) {
            this._HasItem = true;
          }
          else {
            this._HasItem = false;
          }
          this._loading = false;
        } else {
          this.dataLazyLoad = [];
        }
        this.changeDetectorRefs.detectChanges();
      });
    }
  }
}
//