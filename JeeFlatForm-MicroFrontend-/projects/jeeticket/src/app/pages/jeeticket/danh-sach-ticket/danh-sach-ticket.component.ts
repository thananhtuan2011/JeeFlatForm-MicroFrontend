import { MatDialog } from "@angular/material/dialog";
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import moment from "moment";
import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, filter, tap } from "rxjs/operators";
import { ListStatusDTO } from "../_models/list-status-list-managament.model";
import { PhanloaihotroModel } from "../_models/phan-loai-ho-tro-management.model";
import { FormatTimeService } from "../_services/jee-format-time.component";
import { TicketRequestManagementService } from "../_services/ticket-request-management.service";
import { AddTicketPopupComponent } from "../add-ticket-popup/add-ticket-popup.component";
import { TicKetSendService } from "../_services/ticket-send.service";
import { TicKetHandleService } from "../_services/ticket-handle.service";
import { TicKetFollowService } from "../_services/ticket-follow.service";
import { I } from "@angular/cdk/keycodes";
import { PaginatorState } from '../_models/paginator.model';
import { SortState } from '../_models/sort.model';
import { GroupingState } from '../_models/grouping.model';
import { QueryParamsModel, QueryParamsModelNew } from '../_models/query-params.model';
import { SocketioService } from '../_services/socketio.service';
import { LayoutUtilsService, MessageType } from '../../../modules/crud/utils/layout-utils.service';
import { TranslationService } from '../../../modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as viLang } from 'projects/jeeticket/src/app/modules/i18n/vocabs/vi'
import { MatTableDataSource } from '@angular/material/table';
// import { SocketioService } from '../_services/socketio.service';
// import { DangKyCuocHopService } from '../../_services/dang-ky-cuoc-hop.service';
@Component({
  selector: "app-danh-sach-ticket",
  templateUrl: "./danh-sach-ticket.component.html",
  styleUrls: ["./danh-sach-ticket.component.scss"],
})
export class DanhSachTicketComponent implements OnInit {
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
  stautsDTO: ListStatusDTO[];
  // Category1: PhanloaihotroModel[];
  Category2: PhanloaihotroModel[];
  Ticketid: number;
  GetTicketManagementBySend: any[] = [];
  GetTicketManagementByFollow: any[] = [];
  GetTicketManagementByHandle: any[] = [];
  tab_select: number = 1;
  currentStatus: any;
  currentCategory: any;
  page: number;
  record: number;
  more: boolean;
  AllPage: any;
  flag: boolean;
  //
  listNoti: any = [];
  @Output() loadUnreadList = new EventEmitter();

  search_yc: string = "";
  userQuestionUpdate = new Subject<string>();
  item_selected:number = 0 ;
  constructor(
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    public TicketRequestManagementService: TicketRequestManagementService,
    // public ListStatusManagementService:ListStatusManagementService,
    // public PhanloaihotroService:PhanloaihotroService,
    private activateRoute: ActivatedRoute,
    public FormatTimeService: FormatTimeService,
    public dialog: MatDialog,
    public TicKetSendService: TicKetSendService,
    public TicKetHandleService: TicKetHandleService,
    public TicKetFollowService: TicKetFollowService,
    private socketService: SocketioService,
    private translationService: TranslationService,
    private translate: TranslateService,
    private layoutUtilsService: LayoutUtilsService,
  ) {
    this.userQuestionUpdate.pipe(
      debounceTime(200),)
      .subscribe(value => {
        this.loadcbb();
      });
    this.translationService.loadTranslations(
      viLang,
    );
    var langcode = localStorage.getItem('language');
    if (langcode == null)
      langcode = this.translate.getDefaultLang();
    this.translationService.setLanguage(langcode);
  }
  ngOnInit() {

    this.activateRoute.params.subscribe((params) => {
      this.Ticketid = +params.id;
    });
    this.loadDataList();
    //cbb
    this.TicketRequestManagementService.GetStatusNoCustom().subscribe((res) => {
      this.stautsDTO = res.data;
      this.changeDetectorRefs.detectChanges();
    });
    this.loadcbb();
    this.sortOrder = 'asc';
    this.sortField = '';
    this.page = 0;
    this.record = 15;
    this.more = false;
    this.flag = true;

    this.TicketRequestManagementService.send$.subscribe((data:any)=>{
      if(data&&data!=""){
        if(data=='Load')
        this.loadDataList();
        this.TicketRequestManagementService.send$.next("");
      }
    })
    this.searchForm();
  }


  keywordd:any;
  filterConfiguration(): any {
    const filter: any = {};
    filter.search = this.search_yc;
    filter.keyword=this.keywordd;
    filter.status=this.statuss;
    filter.category=this.categoryy;
    return filter;
  }


  loadcbb() {
    const queryParams = new QueryParamsModelNew(
      this.filterConfiguration(),
      "",
      "",
      0,
      50,
      true
    );
    // this.TicketRequestManagementService.getLinhvucyeucauCombo(queryParams).subscribe(
    //   (res) => {
    //     this.Category1 = res.data;
    //     this.changeDetectorRefs.detectChanges();  
    //   }
    // );
    this.TicketRequestManagementService.getAllLinhVucHoTro2(queryParams).subscribe(
      (res) => {
        this.Category2 = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    );
  }
  //==========================Xử lý Khi click vào 1 item=====================
  item: any = [];
  changeRoute(item) {
    this.item_selected=item.RowID;
    this.changeDetectorRefs.detectChanges();
    this.Ticketid = item.RowID;
    this.socketService.readNewNotification(this.Ticketid).subscribe((res) => {
      this.listNoti.forEach((x) => {
        if (x.id == this.Ticketid) {
          x.read = true;
        }
      });
      this.loadUnreadList.emit(true);
    });
    this.router.navigateByUrl(`Ticket/${this.Ticketid}`);
  }
  RefreshData() {
    this.loadDataList();
  }
  SetItemSelect(rowid: number) {
    if (rowid == this.Ticketid) return true;
    else return false;
  }
  ReadMessage(ticketID: any) {
    this.socketService.readNewNotification(ticketID).subscribe((res) => {
      this.listNoti.forEach((x) => {
        if (x.id == ticketID) {
          x.read = true;
        }
      });
      this.loadUnreadList.emit(true);
    });
  }
  onTabClick(event) {
    if (event.tab.textLabel == "Tôi gửi") {
      this.tab_select = 1;
      this.loadDataList();
    } else if (event.tab.textLabel == "Tôi xử lý") {
      this.tab_select = 2;
      this.loadDataList();
    } else {
      this.tab_select = 3;
      this.loadDataList();
    }
  }
  PriorityColor(priority: number) {
    if (priority == 0) return "#C4C4C4";
    if (priority == 1) return "#00C875";
    if (priority == 2) return "#FDAB3D";
    if (priority == 3) return "#E2445C";
  }

  ListStatus: any = [];
  getTinhtrangCV(item, field = "title", IsbackgroundColor = false) {
    var liststatus;
    if (this.ListStatus.find((x) => x.id_row == item.id_project_team)) {
      liststatus = this.ListStatus.find(
        (x) => x.id_row == item.id_project_team
      ).status;
    } else return "";
    var status = liststatus.find((x) => x.id_row == item.status);
    if (!status) return;
    if (field == "color") {
      {
        if (IsbackgroundColor || status.color != "rgb(181, 188, 194)")
          return status.color;
        else {
          return "#424242";
        }
      }
    } else {
      return status.statusname;
    }
  }


  statuss:any;
  categoryy:any;
  ChangeStage(val) {
    if (!this.currentCategory) {
      this.categoryy = "";
    } else {
      this.categoryy = this.currentCategory;
    }
    // this.TicKetSendService.patchStateWithoutFetch({ filter });
    if (val == "0") {
      this.statuss = "";
      if (this.tab_select == 1) {
        this.loadDataList();
      } else if (this.tab_select == 2) {
        this.loadDataList();
      } else {
        this.loadDataList();
      }
    } else {
      this.statuss = val;
      if (this.tab_select == 1) {
        this.loadDataList();
      } else if (this.tab_select == 2) {
        this.loadDataList();
      } else {
        this.loadDataList();
      }
    }
    this.currentStatus = val;
  }
  ChangeStage_Phanloai(val) {
    const filter = {};
    if (!this.currentStatus) {
      this.statuss = "";
    } else {
      this.statuss = this.currentStatus;
    }
    // this.TicKetSendService.patchStateWithoutFetch({ filter });
    if (val == "0") {
      this.categoryy = "";
      if (this.tab_select == 1) {
        this.loadDataList();
        // this.TicKetSendService.patchState({ filter });
      } else if (this.tab_select == 2) {
        this.loadDataList();
        // this.TicKetHandleService.patchState({ filter });
      } else {
        this.loadDataList();
        // this.TicKetFollowService.patchState({ filter });
      }
    } else {
      this.categoryy = val;
      if (this.tab_select == 1) {
        this.loadDataList();
      } else if (this.tab_select == 2) {
        this.loadDataList();
      } else {
        this.loadDataList();
      }
    }
    this.currentCategory = val;
  }
  getColorNameUser(item: any) {
    if (!item) return;
    let value = item.split(" ")[item.split(" ").length - 1];
    let result = "";
    switch (value.slice(0, 1)) {
      case "A":
        return (result = "rgb(51 152 219)");
      case "Ă":
        return (result = "rgb(241, 196, 15)");
      case "Â":
        return (result = "rgb(142, 68, 173)");
      case "B":
        return (result = "#0cb929");
      case "C":
        return (result = "rgb(91, 101, 243)");
      case "D":
        return (result = "rgb(44, 62, 80)");
      case "Đ":
        return (result = "rgb(127, 140, 141)");
      case "E":
        return (result = "rgb(26, 188, 156)");
      case "Ê":
        return (result = "rgb(51 152 219)");
      case "G":
        return (result = "rgb(241, 196, 15)");
      case "H":
        return (result = "rgb(248, 48, 109)");
      case "I":
        return (result = "rgb(142, 68, 173)");
      case "K":
        return (result = "#2209b7");
      case "L":
        return (result = "rgb(44, 62, 80)");
      case "M":
        return (result = "rgb(127, 140, 141)");
      case "N":
        return (result = "rgb(197, 90, 240)");
      case "O":
        return (result = "rgb(51 152 219)");
      case "Ô":
        return (result = "rgb(241, 196, 15)");
      case "Ơ":
        return (result = "rgb(142, 68, 173)");
      case "P":
        return (result = "#02c7ad");
      case "Q":
        return (result = "rgb(211, 84, 0)");
      case "R":
        return (result = "rgb(44, 62, 80)");
      case "S":
        return (result = "rgb(127, 140, 141)");
      case "T":
        return (result = "#bd3d0a");
      case "U":
        return (result = "rgb(51 152 219)");
      case "Ư":
        return (result = "rgb(241, 196, 15)");
      case "V":
        return (result = "#759e13");
      case "X":
        return (result = "rgb(142, 68, 173)");
      case "W":
        return (result = "rgb(211, 84, 0)");
    }
    return result;
  }
  getName(val) {
    if (!val) return;
    var x = val.split(" ");
    return x[x.length - 1];
  }

  Create() {
    const dialogRef = this.dialog.open(AddTicketPopupComponent);
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.tab_select = 1;
        this.TicketRequestManagementService.getIdCurren('Tickets').subscribe(res => {
          this.Ticketid = res.data;
          this.loadDataList();
          // this.TicKetSendService.fetch();
          // this.grouping = this.TicKetSendService.grouping;
          // this.paginator = this.TicKetSendService.paginator;
          // this.sorting = this.TicKetSendService.sorting;
          const sb = this.TicKetSendService.isLoading$.subscribe((res) => {
            this.isLoading = res;
          });
          this.subscriptions.push(sb);
         // this.MessageService.stopHubConnectionChat();
          this.router.navigateByUrl(`Ticket/${this.Ticketid}`);
        })
        let saveMessageTranslateParam = "";
        saveMessageTranslateParam += "COMMOM.THEMTHANHCONG";
        const saveMessage = "Thêm thành công";
        const messageType = MessageType.Create;
        this.layoutUtilsService.showActionNotification(
          saveMessage,
          messageType,
          4000,
          true,
          false
        );

      } else {
        //TH close ticket (tro lai)
        this.loadDataList();
      }
    });
    //debugger;
  }

  TransformIntoObjectTag(id_row: string, title: string, color: string) {
    var object = { id_row: "", title: "", color: "" };
    object.id_row = id_row;
    object.title = title;
    object.color = color;
    return object;
  }
  TransformIntoObjectNode(rowId: number) {
    var object = { id_row: 0, title: "", color: "" };
    object.id_row = rowId;
    return object;
  }

  setActiveTabId(tabId, type) {
    this.activeTabId = tabId;
    this.isLoad = tabId;
    this.Type = type;
  }
  // ChangeStage(val) {
  //   const filter = {};

  //   if(val =="0")
  //   {
  //     filter["status"] = '';
  //     this.TicketRequestManagementService.patchState({ filter },1);

  //   }
  //   else{
  //     filter["status"] = val;
  //     this.TicketRequestManagementService.patchState({ filter },1);
  //   }
  // }
  // ChangeStage_Phanloai(val) {
  //   const filter = {};

  //   if(val =="0")
  //   {

  //     filter["category"] = '';
  //     this.TicketRequestManagementService.patchState({ filter },1);
  //   }
  //   else{
  //     filter["category"] = val;
  //     this.TicketRequestManagementService.patchState({ filter },1);
  //   }
  // }
  changeKeyword(val) {
    this.search(val);
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
    if (this.tab_select == 1) {
      this.loadDataList();
    } else if (this.tab_select == 2) {
      this.loadDataList();
    } else {
      this.loadDataList();
    }
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
    tmp_height = window.innerHeight - 180;
    return tmp_height + "px";
  }
  onScroll(event) {
    let _el = event.srcElement;
    if (_el.scrollTop + _el.clientHeight > _el.scrollHeight * 0.9) {
      this.LoadDataLazy();
    }
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
        if (this.tab_select == 1) {
          this.TicketRequestManagementService.loadTicketBySend(queryParams)
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
        if(this.tab_select==2){
          this.TicketRequestManagementService.loadTicketByHandle(queryParams)
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
        else if(this.tab_select==3){
          this.TicketRequestManagementService.loadTicketByFollow(queryParams)
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
  }
  isload = true;
  loadDataList() {
    this.crr_page = 0;
    this.page_size = 7;
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
      if (this.tab_select == 1) {
        api_service = this.TicketRequestManagementService.loadTicketBySend(queryParams)
      }
      else if (this.tab_select == 2) {
        api_service = this.TicketRequestManagementService.loadTicketByHandle(queryParams)
      }
      else if(this.tab_select==3){
        api_service = this.TicketRequestManagementService.loadTicketByFollow(queryParams)
      }
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
          this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
        }
        this.changeDetectorRefs.detectChanges();
      });
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
    // this.danhSachHoTroService.patchState({ filter });
  }
  get_flag_color(val) {
    switch (val) {
      case 4://không có
        return 'grey-flag_list';
      case 3:
        return 'red-flag_list';
      case 2:
        return 'yellow-flag_list';
      case 1:
        return 'blue-flag_list';
      case 0:
        return 'low-flag_list';
    }
  }
}
