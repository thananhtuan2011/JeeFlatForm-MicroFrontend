import { TicketRequestManagementService } from "../_services/ticket-request-management.service";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
  Pipe,
  Input,
} from "@angular/core";
import { environment } from "src/environments/environment";
import { ActivatedRoute, Router } from "@angular/router";

import { BehaviorSubject, Observable, of, ReplaySubject, Subject, Subscription, SubscriptionLike } from "rxjs";
import { catchError, finalize, map, share, takeUntil, tap } from "rxjs/operators";
import * as moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import { DanhSachHoTroService } from "../_services/danh-sach-ho-tro.service";
import {
  TicKetActivityModel,
  TicketManagementModel,
  TicketMessagesManagementModel,
  RequestPCManagementDTO,
} from "../_models/ticket-management.model";
import { EditorChangeContent, EditorChangeSelection, QuillEditorComponent } from "ngx-quill";
import Quill from "quill";
import { MessageService } from "../_services/message.service";
import { NgForm } from "@angular/forms";
import { FormatTimeService } from "../_services/jee-format-time.component";
import { RatingPopupComponent } from "../Rating-popup/rating-popup.component";
import { PermissionManagementService } from "../_services/permission-management.service";
import { TranslateService } from "@ngx-translate/core";
import { WorkListNewStore } from "../work-list-new.store";
import { AuthService } from "../_services/auth.service";
import { LayoutUtilsService, MessageType } from "../../modules/crud/utils/layout-utils.service";
import { TranslationService } from "../../modules/i18n/translation.service";
import { locale as viLang } from 'projects/jeesupport/src/app/modules/i18n/vocabs/vi';
import * as QuillNamespace from 'quill';
import QuillMention from 'quill-mention';
import { ChatService } from "../_services/chat.service";
import { Message } from "../_models/message";
import { ConversationService } from "../_services/conversation.service";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { HttpEventType } from "@angular/common/http";
import * as CryptoJS from 'crypto-js';
@Component({
  selector: "app-chi-tiet-ho-tro",
  templateUrl: "./chi-tiet-ho-tro.component.html",
  styleUrls: ["./chi-tiet-ho-tro.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChiTietHoTroComponent implements OnInit {
  @ViewChild("messageForm") messageForm: NgForm;
  testmessage_chang: string;
  @ViewChild("scrollMe") private myScrollContainer: ElementRef;
  RequestID: number;
  IdStatus_Dahuyyeucau: number = 3;
  IdStatus_dongyeucau: number = 2;

  NoiDungKetLuan: string;
  NoiDungTomTat: string;
  ShowEditorTomTat: boolean = false;
  ShowEditorKetLuan: boolean = false;
  ShowCongViec: boolean = false;
  btnSend: boolean = false;
  TenDuAn: string;
  isLoader: boolean = false;
  blurred = false;
  focused = false;
  HoTro: any[] = [];
  public filteredHoTro: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  Ratings: any[] = [];
  tinyMCE = {};
  topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  labelFilter: string = "Tất cả";
  tinhTrang: any = "0";
  check_answer: boolean = true;
  requestPcDTO: RequestPCManagementDTO;
  listNguoiThamGia: any[] = [];
  listNguoiThamGiaRemove: any[] = [];
  ticketID: number;

  isCollapsedsticker = true;
  private _subscriptions_chat: Subscription[] = [];

  private readonly componentName = "comment-jeemeeting";
  private readonly onDestroy = new Subject<void>();


  LstFilePanel: any[] = [];
  KeyEnCode: string;
  activity: TicKetActivityModel = new TicKetActivityModel();
  Message: string;
  edit: boolean = false;
  Title: string;
  Check_huy: boolean = false;
  lstMessage: any;
  id_chat_notify: number;
  loadingSubject = new BehaviorSubject<boolean>(false);
  public filteredTasks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public filterSearch: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  subscription: SubscriptionLike;
  constructor(
    public danhSachHoTroService: DanhSachHoTroService,
    private activatedRoute: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    // public messageService: MessageService,
    public messageServicexxx: DanhSachHoTroService,
    public auth: AuthService,
    public TicketRequestManagementService: TicketRequestManagementService,
    public FormatTimeService: FormatTimeService,
    public permissionService: PermissionManagementService,
    private translateService: TranslationService,
    private translate: TranslateService,
    public store: WorkListNewStore,
    public MessageService: MessageService,
    private chatService:ChatService,
    private conversation_service: ConversationService,
  ) {
    this.translateService.loadTranslations(
      viLang,
    );
    var langcode = localStorage.getItem('language');
    if (langcode == null)
      langcode = this.translate.getDefaultLang();
    this.translateService.setLanguage(langcode);
  }

  ngOnInit(): void {
    const dt = this.conversation_service.getAuthFromLocalStorage();
    this.userCurrent = dt.user.username;
    const Quill: any = QuillNamespace;
    Quill.register({ 'modules/mention': QuillMention }, true);
    this.subscription = this.store.updateEvent$.subscribe(res => {
      if (res) {
        // this.Forme(true);
        this.LoadDataNew();
        //this.LoadDataStatusDynamic();
        this.changeDetectorRefs.detectChanges();
      }
    })

    const rowid = Number(this.activatedRoute.snapshot.paramMap.get("id"));
    // const data = this.auth.getAuthFromLocalStorage();
    // var _userID = data.user.customData["jee-account"].userID;
    //this.CheckAccess(rowid, _userID);
    this.RequestID = rowid;
    // this.messageServicexxx
    // .GetOnlyMessageThread(this.RequestID)
    // .subscribe((res) => {
    //   this.lstMessage = res.data;
    //   this.ticketID=this.lstMessage[0].Idticket;

    // });
    this.activatedRoute.params.subscribe((params) => {
      this.Message = "";
      this.RequestID = +params.id;
      // this.danhSachHoTroService
      //   .Get_ChiTietHoTro(this.RequestID)
      //   .subscribe((res) => {
      //     if (res.status == 1) {
      //       this.HoTro = res.data;
      //       this.filteredHoTro.next(res.data);
      //       this.requestPcDTO = Object.assign({}, ...res.data);
      //       this.Title = this.requestPcDTO.Title;
      //       this.ticketID=this.requestPcDTO.TicketID;

      //       this.changeDetectorRefs.detectChanges();

      //     }
      //   });
      this.subscribeToEventsNewMess();
      this.LoadDataNew();
      this.messageServicexxx
        .GetOnlyMessageThread(this.RequestID)
        .subscribe((res) => {
          this.lstMessage = res.data;
          this.ticketID = this.lstMessage[0].Idticket;
          this.MessageService.connectToken(this.ticketID, this.translateService.instant("ACCESS.CUSTOMERID"));
          this.changeDetectorRefs.detectChanges();
        });

    });
    this.check_answer = true;

    this.scrollToBottom();



  }
  LoadDataNew() {
    this.danhSachHoTroService
      .Get_ChiTietHoTro(this.RequestID)
      .subscribe((res) => {
        if (res.status == 1) {
          this.HoTro = res.data;
          this.filteredHoTro.next(res.data);
          this.requestPcDTO = Object.assign({}, ...res.data);
          this.Title = this.requestPcDTO.Title;
          this.ticketID = this.requestPcDTO.TicketID;

          this.changeDetectorRefs.detectChanges();

        }
      });
  }


  CheckAccess(ticketId: number, userId: number) {
    //flag = false => ko co quyen
    //flag = true => co quyen
    var flag = false;
    this.permissionService.GetUserCanAccess(ticketId).subscribe((res) => {
      if (res && res.status == 1) {
        res.data.forEach((user) => {
          if (user.userid == userId) {
            flag = true;
          }
        });
        if (!flag) {
          this.router.navigate(["/Support/"]);
          this.layoutUtilsService.showActionNotification(
            "Tài khoản không có quyền truy cập ticket này",
            MessageType.Read,
            999999999,
            true,
            false,
            3000,
            "top",
            0
          );
        }
      }
    });
  }
  ngOnDestroy(): void {
    this.onDestroy.next();
  }
  edit_title() {
    this.edit = true;
  }
  Set_update_title(): TicketManagementModel {
    const item = new TicketManagementModel();
    item.RowID = this.ticketID;
    item.Title = this.Title;
    item.AppID = this.translateService.instant("ACCESS.APPID");
    item.AppKey = this.translateService.instant("ACCESS.APPKEY");
    item.CustomerID = this.translateService.instant("ACCESS.CUSTOMERID");
    return item;
  }
  Update_title() {
    let item = this.Set_update_title();

    if (item.Title != "" && item.Title.length < 200) {
      this.TicketRequestManagementService.UpdateTitleThirdPartyApp(
        item
      ).subscribe((res) => {
        if(res.status == 1){

          this.edit = false;
          this.danhSachHoTroService
            .Get_ChiTietHoTro(this.RequestID)
            .subscribe((res) => {
              if (res.status == 1) {
                this.HoTro = res.data;
                this.danhSachHoTroService.fetch();
                this.Title = this.requestPcDTO.Title;

                this.filteredHoTro.next(res.data);

                this.changeDetectorRefs.detectChanges();
              }
            });
        }

      });
    }
    else {
      this.layoutUtilsService.showActionNotification(
        "Tên yêu cầu không được bỏ trống và không được vượt quá 200 ký tự !",
        MessageType.Update,
        999999999,
        true,
        false,
        3000,
        "top",
        0
      );
    }


  }
  // loadData() {
  //   this.danhSachHoTroService
  //     .Get_ChiTietHoTro(this.RequestID)
  //     .subscribe((res) => {
  //       if (res.data.length > 0) {
  //         this.HoTro = res.data;
  //         this.filteredHoTro.next(res.data);
  //       }
  //       this.changeDetectorRefs.detectChanges();
  //     });

  //   this.LoadDataNew();
  // }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  setDataTicKetActivity() {
    this.activity.TicketID = this.RequestID;
    this.activity.ActionType = 1;
    this.activity.ActionText = "đã trả lời cho Ticket";
  }
  ItemMessenger(): TicketMessagesManagementModel {
    const item = new TicketMessagesManagementModel();
    item.IsResponse = false;
    item.Message = this.Message;
    //request -> ticketid
    //Nho sua doan nay vi hien dang tra ve requestid
    item.TicketID = this.ticketID;
    item.AppID = this.translateService.instant("ACCESS.APPID");
    item.AppKey = this.translateService.instant("ACCESS.APPKEY");
    item.CustomerID = Number.parseInt(this.translateService.instant("ACCESS.CUSTOMERID"));
    return item;
  }

  sendMessageeeee() {
    let item = this.ItemMessenger();
    if (item.Message) {
      this.setDataTicKetActivity();
      // this.TicketRequestManagementService.CreateTicketActivityManagement(
      //   this.activity
      // ).subscribe((res) => { });
      const data = this.auth.getAuthFromLocalStorage();
      var _token = data.access_token;
      // this.TicketRequestManagementService.createMessageThirdParyApp(
      //   item
      // ).subscribe((data) => {

      // });
      this.MessageService.sendMessageThirdPartyApp(item, this.ticketID);
      //this.MessageService.sendMessage(_token, item, this.ticketID);
      this.messageServicexxx
        .GetOnlyMessageThread(this.RequestID)
        .subscribe((res) => {
          this.lstMessage = res.data;
        });
      this.Message = '';

      this.messageForm.reset();
      this.scrollToBottom();
      this.changeDetectorRefs.detectChanges();
    } else
      this.layoutUtilsService.showActionNotification(
        "Chưa nhập nội dung",
        MessageType.Read,
        999999999,
        true,
        false,
        3000,
        "top",
        0
      );

  }

  set_item_huy(): TicketManagementModel {
    const item = new TicketManagementModel();
    item.RowID = this.ticketID;
    item.Status = this.IdStatus_Dahuyyeucau;
    item.StatusTicket = 64;
    item.AppID = this.translateService.instant("ACCESS.APPID");
    item.AppKey = this.translateService.instant("ACCESS.APPKEY");
    item.CustomerID = this.translateService.instant("ACCESS.CUSTOMERID");
    return item;
  }
  Huyyeucau() {

    const _title = this.translateService.instant("POPUPCANCEL.TITLE");
    const _description = this.translateService.instant("POPUPCANCEL.DESCRIPTION");
    const _waitDesciption = this.translateService.instant(
      "POPUPCANCEL.WAITDESCRIPTION"
    );
    const popup = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDesciption
    );


    popup.afterClosed().subscribe((res) => {
      if (res) {
        this.Check_huy = true;
        let item = this.set_item_huy();
        this.TicketRequestManagementService.updateStautsThirdPartyApp(
          item
        ).subscribe((res) => {
          if (res.status == 1) {
            this.danhSachHoTroService.fetch();
            this.layoutUtilsService.showActionNotification(
              "Đã hủy yêu cầu",
              MessageType.Update,
              4000,
              true,
              false
            );
            // this.danhSachHoTroService
            //   .Get_ChiTietHoTro(this.RequestID)
            //   .subscribe((res) => {
            //       this.HoTro = res.data;
            //       this.filteredHoTro.next(res.data);
            //       this.requestPcDTO = Object.assign({}, ...res.data);

            //     this.changeDetectorRefs.detectChanges();
            //   });
            this.LoadDataNew();
            this.danhSachHoTroService.fetch();

          } else {
            this.layoutUtilsService.showActionNotification(
              "Hủy yêu cầu không thành công",
              MessageType.Read,
              999999999,
              true,
              false,
              3000,
              "top",
              0
            );
          }
        });
      } else undefined;
    });


    // this.Check_huy = true;
    // let item = this.set_item_huy();
    // this.TicketRequestManagementService.updateStautsThirdPartyApp(
    //   item
    // ).subscribe((res) => {
    //   if (res.status == 1) {
    //     this.danhSachHoTroService.fetch();
    //     this.layoutUtilsService.showActionNotification(
    //       "Đã hủy yêu cầu",
    //       MessageType.Update,
    //       4000,
    //       true,
    //       false
    //     );
    //     this.danhSachHoTroService
    //       .Get_ChiTietHoTro(this.RequestID)
    //       .subscribe((res) => {
    //           this.HoTro = res.data;
    //           this.requestPcDTO = Object.assign({}, ...res.data);

    //         this.changeDetectorRefs.detectChanges();
    //       });
    //     this.danhSachHoTroService.fetch();
    //   } else {
    //     this.layoutUtilsService.showActionNotification(
    //       "Hủy yêu cầu không thành công",
    //       MessageType.Read,
    //       999999999,
    //       true,
    //       false,
    //       3000,
    //       "top",
    //       0
    //     );
    //   }
    // });
  }

  prenventInputNonNumber(item: any) {
    this.btnSend = true;
    if (item == "") this.btnSend = false;
  }
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 629;
    return tmp_height + "px";
  }
  getHeightChat(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 200;
    if (this.check_answer == false) return tmp_height + "px";
    else return tmp_height + 130 + "px";
  }
  getHeightEdittor(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 439;
    return tmp_height + "px";
  }
  f_convertHour(v: any) {
    if (v != "" && v != null) {
      let a = new Date(v);
      return (
        ("0" + a.getHours()).slice(-2) + ":" + ("0" + a.getMinutes()).slice(-2)
      );
    }
  }

  convertDate(d: any) {
    return moment(d + "z").format("DD/MM/YYYY hh:mm");
  }
  convertDateTitle(d: any) {
    return moment(d + "z").format("hh:mm DD/MM/YYYY");
  }
  f_convertHour2(v: any) {
    if (v != "" && v != null) {
      let a = new Date(v);
      return (
        ("0" + a.getHours()).slice(-2) + ":" + ("0" + a.getMinutes()).slice(-2)
      );
    }
  }
  converDate(v: any) {
    let a = new Date(v);
    return (
      ("0" + a.getDate()).slice(-2) +
      " - " +
      ("0" + (a.getMonth() + 1)).slice(-2)
    );
  }
  LayThu(v: any) {
    let day = new Date(v);
    switch (day.getDay()) {
      case 0:
        return "Chủ nhật";
      case 1:
        return "Thứ 2";
      case 2:
        return "Thứ 3";
      case 3:
        return "Thứ 4";
      case 4:
        return "Thứ 5";
      case 5:
        return "Thứ 6";
      case 6:
        return "Thứ 7";
    }
  }
  checkClass1(item: any) {
    if (item == -1) return "date-edit";
    return "date";
  }
  checkClass2(item: any) {
    if (item == -1) return "w-edit";
    return "w";
  }
  copy(inputElement) {
    inputElement.select();
    document.execCommand("copy");
    inputElement.setSelectionRange(0, 0);
  }

  QuayVe() {
    this.router.navigate(["/Meeting/"]);
  }

  activeTabId: "kt1" | "kt2" | "kt3" | "kt4" = "kt1";
  setActiveTabId(tabId, type) {
    this.activeTabId = tabId;
  }
  getActiveCSSClasses(tabId) {
    if (tabId !== this.activeTabId) {
      return "";
    }
    return "soluong-active active show chieucao";
  }

  getActiveCSSClasses2(tabId) {
    if (tabId !== this.activeTabId) {
      return "";
    }
    return "active show chieucao";
  }

  getColor2(condition: number = 0, xacnhan: any): string {
    if (!xacnhan) return "#0A9562";
    switch (condition) {
      case 1:
        return "#0A9562";
      case 2:
        return "#DC3545";
    }
    return "#F48120";
  }

  getTenTinhTrang(condition: number = 0, xacnhan: any): string {
    if (!xacnhan) return "Tham gia";
    switch (condition) {
      case 1:
        return "Tham gia";
      case 2:
        return "Từ chối tham gia";
    }
    return "Chờ xác nhận";
  }

  getWidth() {
    let tmp_width = 0;
    tmp_width = window.innerWidth - 420;
    return tmp_width + "px";
  }
  //   Update_rating(item) {
  //     const dialogRef = this.dialog.open(RatingPopupComponent);
  //     dialogRef.afterClosed().subscribe(res => {
  //         if (!res) {
  //         }
  //         else {
  //         }
  //     });
  // }
  itemup(): TicketManagementModel {
    const item = new TicketManagementModel();
    item.RowID = this.ticketID;
    item.Rating = this.requestPcDTO.Rating;
    return item;
  }
  Update_rating() {
    let item = this.itemup();
    const dialogRef = this.dialog.open(RatingPopupComponent, {
      data: { item }
    });
    dialogRef.afterClosed().subscribe((res) => {

      if (!res) {

        // this.danhSachHoTroService
        //   .Get_ChiTietHoTro(this.RequestID)
        //   .subscribe((res) => {
        //     if(res && res.status == 1){
        //       this.filteredHoTro.next(res.data);
        //       this.requestPcDTO = Object.assign({}, ...res.data);
        //       this.changeDetectorRefs.detectChanges();
        //       console.log("number rating", this.filteredHoTro);
        //     }
        //   });
        setTimeout(() => {
          this.LoadDataNew();
        }, 2000);

      } else {
        this.layoutUtilsService.showActionNotification(
          "Đánh giá không thành công !! Vui lòng thử lại",
          MessageType.Read,
          999999999,
          true,
          false,
          3000,
          "top",
          0
        );
        // this.danhSachHoTroService
        //   .Get_ChiTietHoTro(this.RequestID)
        //   .subscribe((res) => {
        //     if (res.status == 1) {
        //       this.HoTro = res.data;
        //       this.filteredHoTro.next(res.data);
        //       this.requestPcDTO = Object.assign({}, ...res.data);
        //     }
        //     this.changeDetectorRefs.detectChanges();
        //   });
        setTimeout(() => {
          this.LoadDataNew();
        }, 2000);
      }
    });
    this.LoadDataNew();
  }
  testrating(a: any) {
    this.Ratings.length = 0;
    for (var i = 0; i < a; i++) {
      this.Ratings.push(i);
    }
    return this.Ratings;
  }

  onScroll(event) {
    let _el = event.srcElement;
    if (_el.scrollTop + _el.clientHeight > _el.scrollHeight * 0.95) {
      // this.loadDataList_Lazy();
    }
  }

  getName(val) {
    var x = val.split(" ");
    return x[x.length - 1];
  }





  getColorNameUser(item: any) {
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

  created(event: Quill) {
    // tslint:disable-next-line:no-console
  }

  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
  }

  focus($event) {
    // tslint:disable-next-line:no-console
    this.focused = true;
    this.blurred = false;
  }

  blur($event) {
    // tslint:disable-next-line:no-console
    this.focused = false;
    this.blurred = true;
  }
  OpenEdit(check: boolean) {
    // this.check_answer = check;

    this.check_answer = check;
  }
  filterMessageThread(array: Observable<any[]>) {
    var lstResult = array.pipe(map(result => result.filter((v, i, a) => a.findIndex(v2 => (v.RowID === v2.RowID)) === i)));
    console.log("Kết quả",lstResult)
    return lstResult;
  }
  lisTagGroup: any[] = [];
  @ViewChild(QuillEditorComponent, { static: true })
  editor: QuillEditorComponent;
  modules = {

    toolbar: false,
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          // shiftKey: true,
          handler: (range, ctx) => {
            this.sendMessageeeee()
          }
        }
      }
    },

    mention: {
      mentionListClass: "ql-mention-list mat-elevation-z8",
      // allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      allowedChars: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+/,
      showDenotationChar: false,
      // mentionDenotationChars: ["@", "#"],
      spaceAfterInsert: false,

      onSelect: (item, insertItem) => {

        // let index = this.lstTagName.findIndex(x => x == item.id);
        // if (index < 0) {
        //   this.lstTagName.push(item.id)
        // }





        const editor = this.editor.quillEditor;

        insertItem(item);
        // necessary because quill-mention triggers changes as 'api' instead of 'user'
        editor.insertText(editor.getLength() - 1, "", "user");
      },
      renderItem: function (item, searchTerm) {

        if (item.Avatar) {



          return `
      <div >

      <img  style="    width: 30px;
      height: 30px;
      border-radius: 50px;" src="${item.Avatar}">
      ${item.value}



      </div>`;
        }
        else if (item.id !== "All") {
          return `
      <div style="    display: flex;
      align-items: center;" >

        <div  style="     height: 30px;
        border-radius: 50px;    width: 30px; ;background-color:${item.BgColor}">
        </div>
        <span style=" position: absolute;     left: 20px;  color: white;">${item.value.slice(0, 1)}</span>
        <span style=" padding-left: 5px;">  ${item.value}</span>

      </div>`;
        }
        else {
          return `
      <div style="    display: flex;
      align-items: center;" >

        <div  style="     height: 30px;
        border-radius: 50px;    width: 30px; ;background-color:#F3D79F">
        </div>
        <span style=" position: absolute;     left: 20px;  color: white;">@</span>
        <span style=" padding-left: 5px;">${item.note}</span>
        <span style=" padding-left: 5px;">  ${item.value}</span>

      </div>`;
        }
      },
      source: (searchTerm, renderItem) => {
        const values = this.lisTagGroup;


        if (searchTerm.length === 0) {
          renderItem(values, searchTerm);

        } else {
          const matches = [];
          values.forEach(entry => {
            if (
              entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
            ) {
              matches.push(entry);
            }
          });
          renderItem(matches, searchTerm)

        }
      }
    }
  };

  selectedTabstore: number = 1;
  Collapsedsticker() {

    this.isCollapsedsticker = !this.isCollapsedsticker;
    this.ShowTimeSticker();
    this.GetStoreSticker()
    this.QuanLyStoreSticker();
    this.GetminilistSticker();
  }
  listStickerTime: any[] = [];
  conditiontime: boolean = true;
  selectedTab: number = 0;
  ShowSticker(GrSticker) {
    // this.conditiontime =true;
    this.GetSticker(GrSticker);
    this.listStickerTime = [];
    this.conditiontime = false;
  }
  ShowTimeSticker() {
    this.conditiontime = true;
    this.listSticker = [];
    this.listStickerTime = JSON.parse(localStorage.getItem("Sticker"));
    if (!this.listStickerTime) {
      this.listStickerTime = [];
    }
    this.changeDetectorRefs.detectChanges();
  }
  listSticker: any[] = []
  GetSticker(GrSticker) {
    this.chatService.GetSticker(GrSticker).subscribe(res => {
      if (res && res.status == 1) {
        this.listSticker = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }

  isGroup: boolean = false;
  @Input() id_Group: any;
  userCurrent: string;
  messageContent: string;
  url;
  AttachFileChat: any[] = [];
  isloading: boolean = false;
  lstTagName: any[] = []
  ItemMessengerSticker(UrlSticker: any): Message {

    const item = new Message();



    item.isTagName = false


    item.Content_mess = this.messageContent.replace("<p><br></p>", "");

    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.isGroup = this.isGroup;
    item.isSticker = true;
    item.UrlSticker = UrlSticker;
    item.isEncode = false
    item.Note = "";
    item.IsDelAll = false;
    item.IsVideoFile = this.url ? true : false;
    item.Attachment = this.AttachFileChat.slice();

    return item
  }

  list_file: any[] = [];
  listFileChat: any[] = [];
  list_image: any[] = [];
  listReply: any[] = [];
  myFilesVideo: any[] = [];
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;
  sendMessageSticker(UrlSticker: any, GrSticker: any, IdSticker: any) {
    this.listStickerTime = JSON.parse(localStorage.getItem("Sticker"));
    if (!this.listStickerTime) {
      this.listStickerTime = [];
    }
    let indexxsticker = this.listStickerTime.findIndex(x => x.GrSticker == GrSticker && x.IdSticker == IdSticker);
    if (indexxsticker < 0) {
      // let tampsticker=[]
      let dtsticker = {
        GrSticker: GrSticker,
        UrlSticker: UrlSticker,
        IdSticker: IdSticker
      }
      this.listStickerTime.push(dtsticker)
      localStorage.setItem("Sticker", JSON.stringify(this.listStickerTime))
    }
    this.messageForm.reset();
    this.isCollapsedsticker = true
    this.isloading = false;
    const data = this.conversation_service.getAuthFromLocalStorage();

    var _token = data.access_token;
    let item = this.ItemMessengerSticker(UrlSticker);
    this.AttachFileChat = [];

    this.lstTagName = [];

    this.list_file = [];
    this.listFileChat = [];
    this.list_image = [];
    this.listReply = [];
    this.myFilesVideo = [];
    this.url = "";
    this.MessageService.sendMessage(_token, item, this.id_Group).then((res) => {


      if (this.ticketID) {

        this.router.navigateByUrl('/Chat/Messages/' + this.id_Group + '/null');
        // this.router.navigate(['DashBoard/Chat/Messages/'+this.id_Group+'/null']);
      }


      // this.viewPort.scrollToIndex(this.listMess.length-1, 'smooth');
      setTimeout(() => {
        this.viewPort.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 0);
      setTimeout(() => {
        this.viewPort.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 50);
      //  this.messageForm.reset();

    })
      .catch((error) => {
        let dataitem: any[] = []
        this.layoutUtilsService.showActionNotification('Kết nối không ổn định !', MessageType.Read, 3000, true, false, 3000, 'top', 0);
        // console.log("AAAA",this.listMess)
        this.changeDetectorRefs.detectChanges()

      });

  }
  listStoreSticker:any[]=[];
  GetStoreSticker() {
    this.chatService.GetStoreSticker().subscribe(res => {
      if (res && res.status == 1) {
        this.listStoreSticker = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }

  listQLStoreSticker:any[]=[];
  QuanLyStoreSticker() {
    this.chatService.QuanLyStoreSticker().subscribe(res => {
      if (res && res.status == 1) {
        this.listQLStoreSticker = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }

  listStickermini: any[] = [];
  GetminilistSticker() {
    this.chatService.GetminilistSticker().subscribe(res => {
      if (res && res.status == 1) {
        this.listStickermini = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  showstoresticker: boolean = false;
  StoreSticker() {
    this.showstoresticker = true;
    this.changeDetectorRefs.detectChanges()
  }
  onTabChanged(event) {
    if (event.index == 0) {
      this.showstoresticker = false;
      this.changeDetectorRefs.detectChanges()
    }
  }
  downloadSticker(GrSticker: number, key: string) {
    this.chatService.ActionSticker(GrSticker, key).subscribe(res => {
      if (res) {
        let indexsticker = this.listStoreSticker.findIndex(x => x.GrSticker == GrSticker);
        if (indexsticker >= 0) {
          if (key == "insert") {
            this.listStoreSticker[indexsticker].check = true;
            // this.GetStoreSticker()
            this.QuanLyStoreSticker();
            this.GetminilistSticker()

          }
        }
        if (key == "remove") {
          let indexstickerremove = this.listQLStoreSticker.findIndex(x => x.GrSticker == GrSticker);
          this.listQLStoreSticker.splice(indexstickerremove, 1);

          this.GetStoreSticker();
          this.GetminilistSticker()
          this.QuanLyStoreSticker();
          this.changeDetectorRefs.detectChanges();
        }
      }
    })
  }
  txttam: string = "";
  addEmoji(event) {
    let { txttam } = this;

    if (txttam === null) {
      txttam = '';
    }
    const text = `${txttam}${event.emoji.native}`;

    // this.txttam = text;
    this.Message += text;
    this.messageContent = text
    // this.showEmojiPicker = false;
  }
  set='facebook';
  countsendcomposing: number = 0
  saverange(value) {
    if (value) {

      if (value.includes("href")) {

        var href = value.match('<a.*href="([^"]*)".*?<\/a>')[1];
        // this.messageContent=value.replace(/<a(.*?)a>/g, href).replace("</a>","");
        this.txttam = value.replace(/<a(.*?)a>/g, href).replace("</a>", "");
        this.messageContent = this.txttam;

      }
      else {
        this.messageContent = value.replace(/<a(.*?)>/g, "").replace("</a>", "");
      }

      //   value=value.replace("<p><br></p>", "");
      // // xóa thẻ a không cần thiết
      //     this.messageContent=value;
      //     console.log(" this.messageContent", this.messageContent)
    }
    else {
      this.messageContent = ''
      this.countsendcomposing = 0;
    }
    setTimeout(() => {
      if (value && this.countsendcomposing <= 3) {

        const data = this.conversation_service.getAuthFromLocalStorage();

        var _token = data.access_token;
        this.MessageService.Composing(_token, this.id_Group).then(res => {
          this.countsendcomposing = this.countsendcomposing + 1;
        }

        ).catch()


      }
      else {
        return;

      }
    }, 3000);
  }
  onSelectVideo(event) {

    let base64Str: any;
    const file = event.target.files && event.target.files;
    if (file) {
      var reader = new FileReader();

      reader.onload = (event) => {
        this.myFilesVideo.push(event.target.result);
        var metaIdx = event.target.result.toString().indexOf(';base64,');
        base64Str = event.target.result.toString().substr(metaIdx + 8);


        this.AttachFileChat.push({ filename: file[0].name, type: file[0].type, size: file[0].size, strBase64: base64Str });
        this.url = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(file[0]);
    }
  }

  progress: number;
  interval: any;
  loadingfilelarge: boolean = true;
  show: boolean = false;
  list_file_large: any[] = [];
  // onSelectFile_PDF(event) {
  //   if (event.target.files[0].size > 5000000) {
  //     for (let i = 0; i < event.target.files.length; i++) {
  //       let dt = {
  //         filename: event.target.files[i].name,
  //         size: event.target.files[i].size,
  //       }
  //       this.list_file_large.push(dt)
  //     }


  //     const data = this.conversation_service.getAuthFromLocalStorage();
  //     // id_chat_notify
  //     var _token = data.access_token;
  //     let item = this.ItemMessengerFile();
  //     this.MessageService.sendMessage(_token, item, this.id_Group).then((res) => {
  //       this.list_file_large = []
  //       this.loadingfilelarge = true;
  //     })


  //     setTimeout(() => {


  //       this.progress = 0;
  //       this.interval = setInterval(() => {
  //         if (this.progress < 90) {
  //           this.progress = this.progress + 0.5;
  //           this.changeDetectorRefs.detectChanges();
  //         }

  //       }, 400);
  //       // this.list_file.push(event.target.files);
  //       let filesToUpload: File[] = event.target.files;
  //       const frmData = new FormData();
  //       Array.from(filesToUpload).map((file, index) => {
  //         return frmData.append('file' + index, file, file.name);
  //       });


  //       this.chatService.UploadfileLage(frmData, this.id_Group, this.ticketID).subscribe(

  //         {
  //           next: (event) => {
  //             if (event.type === HttpEventType.UploadProgress) {

  //               // this.progress = Math.round((100 / event.total) * event.loaded);
  //               // console.log("thisprogress",this.progress)


  //             }

  //             else if (event.type === HttpEventType.Response) {
  //               if (event.body) {
  //                 this.loadingfilelarge = false;

  //                 this.progress = 100;

  //                 if (this.progress == 100) {
  //                   clearInterval(this.interval);
  //                 }
  //                 this.changeDetectorRefs.detectChanges();
  //                 // alert("Upload thành công")

  //               }
  //             }
  //           },

  //         })
  //     }, 500);
  //     //  this.layoutUtilsService.showActionNotification('File quá lớn!', MessageType.Read, 3000, true, false, 3000, 'top', 0);
  //   }
  //   else {


  //     this.show = false;

  //     if (event.target.files && event.target.files[0]) {

  //       var filesAmountcheck = event.target.files[0];


  //       var file_name = event.target.files;
  //       var filesAmount = event.target.files.length;

  //       for (var i = 0; i < this.AttachFileChat.length; i++) {
  //         if (filesAmountcheck.name == this.AttachFileChat[i].filename) {
  //           this.layoutUtilsService.showInfo("File đã tồn tại");
  //           return;
  //         }
  //       }
  //       if (filesAmount == 1) {
  //         // for (let i = 0; i < filesAmount; i++) {
  //         var reader = new FileReader();
  //         //this.FileAttachName = filesAmount.name;
  //         let base64Str: any;
  //         let cat: any;
  //         reader.onload = (event) => {
  //           cat = file_name[0].name.substr(file_name[0].name.indexOf('.'));
  //           if (cat.toLowerCase() === '.png' || cat.toLowerCase() === '.jpg') {
  //             this.list_image.push(event.target.result);

  //             var metaIdx1 = event.target.result.toString().indexOf(';base64,');
  //             base64Str = event.target.result.toString().substr(metaIdx1 + 8);
  //             this.AttachFileChat.push({ filename: file_name[0].name, type: file_name[0].type, size: file_name[0].size, strBase64: base64Str });


  //           }
  //           else {
  //             this.list_file.push(event.target.result);

  //             if (this.list_file[0] != undefined) {
  //               var metaIdx = event.target.result.toString().indexOf(';base64,');
  //             }

  //             if (this.list_file[0] != undefined) {
  //               base64Str = event.target.result.toString().substr(metaIdx + 8);
  //             }

  //             this.AttachFileChat.push({ filename: file_name[0].name, type: file_name[0].type, size: file_name[0].size, strBase64: base64Str });
  //             this.listFileChat.push({ filename: file_name[0].name, type: file_name[0].type, size: file_name[0].size, strBase64: base64Str });
  //             // this.list_File_Edit.push({ filename: file_name[i].name,type:file_name[i].type,size:file_name[i].size });
  //           }


  //           this.changeDetectorRefs.detectChanges();

  //         }


  //         //  console.log('this.list_image_Edit',this.list_image_Edit)
  //         reader.readAsDataURL(event.target.files[0]);

  //       }
  //       else {


  //         for (let i = 0; i < filesAmount; i++) {
  //           var reader = new FileReader();
  //           //this.FileAttachName = filesAmount.name;
  //           let base64Str: any;
  //           let cat: any;
  //           reader.onload = (event) => {
  //             cat = file_name[i].name.substr(file_name[i].name.indexOf('.'));
  //             if (cat.toLowerCase() === '.png' || cat.toLowerCase() === '.jpg') {
  //               this.list_image.push(event.target.result);
  //               var metaIdx = this.list_image[i].indexOf(';base64,');
  //               base64Str = this.list_image[i].substr(metaIdx + 8);
  //               this.AttachFileChat.push({ filename: file_name[i].name, type: file_name[i].type, size: file_name[i].size, strBase64: base64Str });
  //             }
  //             else {
  //               this.list_file.push(event.target.result);

  //               if (this.list_file[i] != undefined) {
  //                 var metaIdx = this.list_file[i].indexOf(';base64,');
  //               }

  //               if (this.list_file[i] != undefined) {
  //                 base64Str = this.list_file[i].substr(metaIdx + 8);
  //               }

  //               this.AttachFileChat.push({ filename: file_name[i].name, type: file_name[i].type, size: file_name[i].size, strBase64: base64Str });
  //               this.listFileChat.push({ filename: file_name[i].name, type: file_name[i].type, size: file_name[i].size, strBase64: base64Str });
  //               // this.list_File_Edit.push({ filename: file_name[i].name,type:file_name[i].type,size:file_name[i].size });
  //             }


  //             this.changeDetectorRefs.detectChanges();

  //           }


  //           //  console.log('this.list_image_Edit',this.list_image_Edit)
  //           reader.readAsDataURL(event.target.files[i]);
  //         }
  //       }

  //     }

  //   }
  //   setTimeout(() => {
  //     event.srcElement.value = "";

  //   }, 1000);
  // }
  async onSelectFile_PDF(event) {


 
    for (let i = 0; i < event.target.files.length; i++) {
      let dt = {
        filename: event.target.files[i].name,
        size: event.target.files[i].size,
      }
      this.list_file_large.push(dt)
    }






    // setTimeout(() => {


      this.progress = 0;
      // this.interval = setInterval(() => {
      //   if (this.progress < 90) {
      //     this.progress = this.progress + 0.5;
      //     this.changeDetect.detectChanges();
      //   }

      // }, 400);
      // this.list_file.push(event.target.files);
      let filesToUpload: File[] = event.target.files;

      const frmData = new FormData();
      Array.from(filesToUpload).map((file, index) => {

        return frmData.append('file' + index, file, file.name);
      });

      this.MessageService.UploadfileLage2(frmData, this.ticketID).subscribe(

        {
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {

              // this.progress = Math.round((100 / event.total) * event.loaded);
              // console.log("thisprogress",this.progress)


            }

            else if (event.type === HttpEventType.Response) {
              if (event.body) {
                this.loadingfilelarge = false;

                // this.progress = 100;

                // if (this.progress == 100) {
                //   clearInterval(this.interval);
                // }
                this.LoadDataNew()
                this.changeDetectorRefs.detectChanges();
                // alert("Upload thành công")

              }
            }
          },

        })
    // }, 500);
    //  this.layoutUtilsService.showActionNotification('File quá lớn!', MessageType.Read, 3000, true, false, 3000, 'top', 0);

    setTimeout(() => {
      event.srcElement.value = "";

    }, 1000);
  }
  ItemMessengerFile(): Message {

    const item = new Message();

    this.NotifyTagName(this.messageContent.replace("<p><br></p>", ""));

    if (this.listChoseTagGroup.length > 0) {
      item.isTagName = true
    }
    else {
      item.isTagName = false
    }
    item.Content_mess = this.messageContent.replace("<p><br></p>", "");
    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.isGroup = this.isGroup;

    if (this.listReply.length > 0) {
      if (this.listReply[0].Content_mess === "") {
        item.Note = this.listReply[0].FullName + ": Tệp đính kèm";
      }
      else {
        item.Note = this.listReply[0].FullName + ":" + this.listReply[0].Content_mess;
      }

    }
    else {
      item.Note = "";
    }

    item.IsDelAll = false;
    item.IsVideoFile = this.url ? true : false;
    item.isFile = true;
    item.Attachment = this.list_file_large.slice();

    return item
  }

  public listChoseTagGroup: any[] = [];
  listTagGroupAll: any[] = [];
  NotifyTagName(content: string) {

    for (let i = 0; i < this.lstTagName.length; i++) {
      if (this.lstTagName[i] == "All") {

        let giatri = content.replace('/', "").indexOf(`data-id="All"`);
        if (giatri > -1) {

          this.listTagGroupAll.forEach(element => {
            this.listChoseTagGroup.push(element.id);
          });
        }


      }
      else {



        let giatri = content.replace('/', "").indexOf(`data-id="${this.lstTagName[i]}`);
        // console.log("Check giá tri",giatri)
        if (giatri > -1) {
          this.listChoseTagGroup.push(this.lstTagName[i]);

        }
      }
    }
    // console.log("listChoseTagGroup",this.listChoseTagGroup)
  }

  onPaste(event: any) {

    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    let blob = null;
    var filesAmount = event.clipboardData.files.length;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
      }
    }

    // load image if there is a pasted image
    if (blob !== null) {
      let base64Str: any;
      var file_name = blob;
      const reader = new FileReader();
      reader.onload = (evt: any) => {
        this.list_image.push(evt.target.result);
        let tamp = []
        tamp.push(evt.target.result);
        var metaIdx = tamp[0].indexOf(';base64,');
        base64Str = tamp[0].substr(metaIdx + 8);
        let sepPos = file_name.name.lastIndexOf('.');
        this.AttachFileChat.push({ filename: file_name.name.substr(0, sepPos) + file_name.lastModified + file_name.name.substr(file_name.name.indexOf('.')), type: file_name.type, size: file_name.size, strBase64: base64Str });
        this.changeDetectorRefs.detectChanges();
      };
      reader.readAsDataURL(blob);
    }
  }
  RemoveVideos(index) {

    this.myFilesVideo.splice(index, 1);
    this.AttachFileChat.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
    this.url = "";
  }

  RemoveChoseImage(index) {
    this.list_image.splice(index, 1);
    this.AttachFileChat.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
  }
  RemoveChoseFile(index) {
    this.AttachFileChat.splice(index, 1);
    this.listFileChat.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
  }
  formatBytesInsert(bytes) {
    if (bytes === 0) {
      return '0 KB';
    }
    const k = 1024;
    const dm = 2 <= 0 ? 0 : 2 || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  DeleteReply() {
    this.listReply = [];
  }
  decryRep(item, isEndCode) {
    if (isEndCode == true) {
      let mess = this.decryptUsingAES256(item).replace("\\", "").replace("\\", "");
      let chuoi = "";
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      if (mess.includes("https")) {
        chuoi = mess.replace(/(<([^>]+)>)/gi, "");
      }
      else {
        chuoi = mess;
      }
      return chuoi.replace(urlRegex, function (url) {

        return '<a target="_blank" href="' + url.replace("</p>", '') + '">' + url.replace("</p>", '') + '</a>';
      })
    }

    else {
      let chuoi = "";
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      if (item.includes("https")) {
        chuoi = item.replace(/(<([^>]+)>)/gi, "");
      }
      else {
        chuoi = item;
      }

      // var urlRegex = /(https?:\/\/[^\s]+)/g;
      return chuoi.replace(urlRegex, function (url) {

        return '<a target="_blank" href="' + url.replace("</p>", '') + '">' + url.replace("</p>", '') + '</a>';
      })
    }

  }
  decryNote(item) {
    return this.decryptUsingAES256(item).replace("\\", "").replace("\\", "");
  }
  decryptUsingAES256(text) {

    try {
      return CryptoJS.AES.decrypt(
        text, this.KeyEnCode, {
        keySize: 16,
        iv: this.KeyEnCode,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.ZeroPadding
      }).toString(CryptoJS.enc.Utf8).replace(/['"]+/g, '');


      //  .replace("\\", "").replace("\\", "");;
    }
    catch (ex) {
      return text
    }

  }
  setFocus(editor) {

    editor.focus();
  }
  getClassfileRight(item) {
    return 'loadcssfileright';
  }
  getClassfileLeft(item) {
    return 'loadcssfileleft';
  }
  getClassDownload(item) {
    if (item == true) {
      return 'classdownload';
    }

  }
  saveOrOpenBlobFileAll(url, blobName, index, idchat: number, id_attch: number) {


    const progressdowload = document.getElementById("progressleft" + index);
    const progressText = document.getElementById("progress-textleft" + index);
    const kbdownload = document.getElementById("kbdownloadleft" + index);
    const downloadfile = document.getElementById("downloadfileleft" + index);


    var start = new Date().getTime()
    var blob;
    var xmlHTTP = new XMLHttpRequest();

    xmlHTTP.open('GET', url, true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function (e) {
      blob = new Blob([this.response]);
    };
    xmlHTTP.onprogress = (pr) => {

      progressdowload.classList.add('progressdownchat');
      downloadfile.classList.add('downloadfile');
      progressdowload.style.width = Math.floor((pr.loaded / pr.total) * 100) + "px"
      progressText.innerHTML = Math.floor((pr.loaded / pr.total) * 100) + "%";
      // this.kbdownload=pr.total-pr.loaded
      var end = new Date().getTime()
      let duration = (end - start) / 1000;
      let bps = pr.loaded / duration;
      let kbps = bps / 1024
      kbdownload.innerHTML = Math.floor(kbps) + " KB/s"
      this.changeDetectorRefs.detectChanges();
    };
    xmlHTTP.onloadend = function (e) {

      var fileName = blobName;
      var tempEl = document.createElement("a");
      document.body.appendChild(tempEl);

      url = window.URL.createObjectURL(blob);
      tempEl.href = url;
      tempEl.download = fileName;

      tempEl.click();
      window.URL.revokeObjectURL(url);

    }
    xmlHTTP.send();

    this.UpdateisDownloadPanelAll(this.id_Group, idchat, id_attch);

  }
  saveOrOpenBlobFile(url, blobName, index, idchat: number, id_attch: number) {

    const progressdowload = document.getElementById("progressleft" + index);
    const progressText = document.getElementById("progress-textleft" + index);
    const kbdownload = document.getElementById("kbdownloadleft" + index);
    const downloadfile = document.getElementById("downloadfileleft" + index);


    var start = new Date().getTime()
    var blob;
    var xmlHTTP = new XMLHttpRequest();

    xmlHTTP.open('GET', url, true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function (e) {
      blob = new Blob([this.response]);
    };
    xmlHTTP.onprogress = (pr) => {

      progressdowload.classList.add('progressdownchat');
      downloadfile.classList.add('downloadfile');
      progressdowload.style.width = Math.floor((pr.loaded / pr.total) * 100) + "px"
      progressText.innerHTML = Math.floor((pr.loaded / pr.total) * 100) + "%";
      // this.kbdownload=pr.total-pr.loaded
      var end = new Date().getTime()
      let duration = (end - start) / 1000;
      let bps = pr.loaded / duration;
      let kbps = bps / 1024
      kbdownload.innerHTML = Math.floor(kbps) + " KB/s"
      this.changeDetectorRefs.detectChanges();
    };
    xmlHTTP.onloadend = function (e) {
      var fileName = blobName;
      var tempEl = document.createElement("a");
      document.body.appendChild(tempEl);

      url = window.URL.createObjectURL(blob);
      tempEl.href = url;
      tempEl.download = fileName;

      tempEl.click();
      window.URL.revokeObjectURL(url);

    }
    xmlHTTP.send();

    this.UpdateisDownloadPanel(this.id_Group, idchat, id_attch);

  }
  UpdateisDownloadPanelAll(idgroup: number, idchat: number, id_attch: number) {
    // const sb = this.messageService.UpdateIsDownload(idgroup, idchat, id_attch).subscribe((res: any) => {
    //   if (res) {

    //     let indexfile = this.LstFilePanel.findIndex(r => r.id_att == id_attch);
    //     if (indexfile >= 0) {
    //       this.LstFilePanel[indexfile].isDownload = true;
    //       this.filteredFile.next(this.LstFilePanel.slice());
    //       this.changeDetectorRefs.detectChanges();
    //     }

    //   }
    // })

    // this._subscriptions.push(sb)

    let indexfile = this.LstFilePanel.findIndex(r => r.id_att == id_attch);
        if (indexfile >= 0) {
          this.LstFilePanel[indexfile].isDownload = true;
          //this.filteredFile.next(this.LstFilePanel.slice());
          this.changeDetectorRefs.detectChanges();
        }

  }
  UpdateisDownloadPanel(idgroup: number, idchat: number, id_attch: number) {
    // const sb = this.messageService.UpdateIsDownload(idgroup, idchat, id_attch).subscribe((res: any) => {
    //   if (res) {

    //     let indexfile = this.LstFilePanelTop4.findIndex(r => r.id_att == id_attch);
    //     if (indexfile >= 0) {
    //       this.LstFilePanelTop4[indexfile].isDownload = true;

    //       this.changeDetectorRefs.detectChanges();
    //     }

    //   }
    // })

    //this._subscriptions.push(sb)
  }

  UpdateisDownload(idgroup: number, idchat: number, id_attch: number) {
    // const sb = this.messageService.UpdateIsDownload(idgroup, idchat, id_attch).subscribe((res: any) => {

    //   if (res) {
    //     let indexdown = this.listMess.findIndex(x => x.IdChat == res.data.IdChat);
    //     if (indexdown >= 0) {
    //       let indexfile = this.listMess[indexdown].Attachment_File.findIndex(r => r.id_att == id_attch);
    //       if (indexfile >= 0) {
    //         this.listMess[indexdown].Attachment_File[indexfile].isDownload = true
    //         this.changeDetectorRefs.detectChanges();
    //       }

    //     }
    //   }
    // })

    //this._subscriptions.push(sb)
  }
  saveOrOpenBlob(url, blobName, check, index, indexfile, idgroup: number, idchat: number, id_attch: number) {
    const progressdowload = document.getElementById("progress" + index + indexfile);
    const progressText = document.getElementById("progress-text" + index + indexfile);
    const kbdownload = document.getElementById("kbdownload" + index + indexfile);
    const downloadfile = document.getElementById("downloadfile" + index + indexfile);

    if (check == true) {
      this.layoutUtilsService.showActionNotification('Đang tải file vui lòng đợi', MessageType.Read, 3000, true, false, 3000, 'top', 0);
    }
    else {

      var start = new Date().getTime()
      var blob;
      var xmlHTTP = new XMLHttpRequest();

      xmlHTTP.open('GET', url, true);
      xmlHTTP.responseType = 'arraybuffer';
      xmlHTTP.onload = function (e) {
        blob = new Blob([this.response]);
      };
      xmlHTTP.onprogress = (pr) => {
        progressdowload.classList.add('progressdownchat');
        downloadfile.classList.add('downloadfile');
        progressdowload.style.width = Math.floor((pr.loaded / pr.total) * 100) + "px"
        progressText.innerHTML = Math.floor((pr.loaded / pr.total) * 100) + "%";
        // this.kbdownload=pr.total-pr.loaded
        var end = new Date().getTime()
        let duration = (end - start) / 1000;
        let bps = pr.loaded / duration;
        let kbps = bps / 1024
        kbdownload.innerHTML = Math.floor(kbps) + " KB/s"
        this.changeDetectorRefs.detectChanges();
      };
      xmlHTTP.onloadend = function (e) {
        var fileName = blobName;
        var tempEl = document.createElement("a");
        document.body.appendChild(tempEl);

        url = window.URL.createObjectURL(blob);
        tempEl.href = url;
        tempEl.download = fileName;

        tempEl.click();
        window.URL.revokeObjectURL(url);

      }
      xmlHTTP.send();
    }
    this.UpdateisDownload(idgroup, idchat, id_attch);
  }
  listMess: any[] = [];
  composing: boolean = false
  private subscribeToEventsNewMess(): void {
    this.composing = false;

    const sbchat = this.MessageService.Newmessage$.subscribe(res => {
      if (this.listMess !== null) {
        if (res) {



          this.id_chat_notify = res[0].RowID;

        }

      }
      

    })


    this._subscriptions_chat.push(sbchat)

  }
  
}
