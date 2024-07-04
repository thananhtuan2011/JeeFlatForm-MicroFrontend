import { DanhSachTicketComponent } from "./../danh-sach-ticket/danh-sach-ticket.component";
import {
  ChooseUserDTO,
  FileUploadModel,
  People,
  SeenMessModel,
  TicketAgentModel,
  TicketManagementDTO2,
} from "../_models/ticket-management.model";
import { TicketRequestManagementService } from "../_services/ticket-request-management.service";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import {
  MessageType,
} from "src/app/modules/crud/utils/layout-utils.service";
import { BehaviorSubject, Observable, Observer, of, Subject, Subscription } from "rxjs";
import { catchError, finalize, map, share, takeUntil, tap } from "rxjs/operators";
import moment from 'moment-timezone';
import { MatDialog } from "@angular/material/dialog";
import {
  TicKetActivityModel,
  TicketManagementModel,
  TicketMessagesManagementModel,
  TicketPCManagementDTO,
} from "../_models/ticket-management.model";
import { EditorChangeContent, EditorChangeSelection, QuillEditorComponent } from "ngx-quill";
import Quill from "quill";
import { FormatTimeService } from "../_services/jee-format-time.component";
import { FormBuilder, NgForm, Validators } from "@angular/forms";
import { MessageService } from "../_services/message.service";
import { ListStatusDTO } from "../_models/list-status-list-managament.model";
import { RatingPopupComponent } from "../Rating-popup/rating-popup.component";
import { JeeTicKetLiteService } from "../_services/JeeTicketLite.service";
import { TicKetSendService } from "./../_services/ticket-send.service";
import { TicKetHandleService } from "./../_services/ticket-handle.service";
import { TicKetFollowService } from "./../_services/ticket-follow.service";
import { PermissionManagementService } from "../_services/permission-management.service";
import { LayoutUtilsService } from "../../../modules/crud/utils/layout-utils.service";
import { AuthService } from "../_services/auth.service";
import { TokenStorage } from "../_services/token-storage.service";
import { HttpEventType } from "@angular/common/http";
import * as QuillNamespace from 'quill';
import QuillMention from 'quill-mention';
import { Message } from "../_models/message.model";
import * as CryptoJS from 'crypto-js';
import { formatDate } from "@angular/common";
import { CdkVirtualScrollViewport } from "@angular/cdk/scrolling";
import { MatAccordion } from "@angular/material/expansion";
import { PreviewAllimgComponent } from "../preview-allimg/preview-allimg.component"; 
import { TicketDocumentService } from "../_services/ticket-document.service";
import { QueryParamsModelNew } from "../_models/query-params.model";
import { ScrollToBottomDirective } from "./scroll-to-bottom.directive";
import { environment } from "projects/jeeticket/src/environments/environment";
import { PreviewfileComponent } from "../previewfile/previewfile.component";
@Component({
  selector: "app-chi-tiet-ticket",
  templateUrl: "./chi-tiet-ticket.component.html",
  styleUrls: ["./chi-tiet-ticket.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChiTietTicketComponent implements OnInit {
  @Input() options: any = {
    showSearch: true, //hiển thị search input hoặc truyền keyword
    keyword: "",
    data: [],
  };

  item: TicketManagementModel = new TicketManagementModel();
  @ViewChild(DanhSachTicketComponent) child;
  @ViewChild("messageForm") messageForm: NgForm;
  testmessage_chang: string;
  @ViewChild(ScrollToBottomDirective)
  scroll: ScrollToBottomDirective;
  @Input() id_Group: any;
  message: TicketMessagesManagementModel = new TicketMessagesManagementModel();
  activity: TicKetActivityModel = new TicKetActivityModel();
  UsMessage: string;
  status_ticket: number;
  statusid: number;
  userID: number;
  IdStatus_Dahuyyeucau: number = 64;
  IdStatus_Closed: number = 41;
  Message: string;
  sourceType: number; //0 người,1 app

  form_status = this.fb.group({
    value: ["", [Validators.required]],
  });
  stautsDTO: ListStatusDTO[];
  user_login: number;

  node: any;
  list_milestone: any = [];
  edit: boolean = false;
  Title: string;
  userCurrent: any;

  tab: number;
  status_closed: number = 41;
  close_ticket: boolean = false;

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
  Ratings: any[] = [];
  TicKetID: number;
  tinyMCE = {};
  topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  labelFilter: string = "Tất cả";
  tinhTrang: any = "0";
  check_answer: boolean = true;
  ticketPcDTO: TicketPCManagementDTO;
  listNguoiThamGia: any[] = [];
  listNguoiThamGiaRemove: any[] = [];
  private readonly componentName = "comment-jeemeeting";
  private readonly onDestroy = new Subject<void>();

  //add_agent or folower

  selected: any[] = [];
  selected_Assign: any[] = [];
  listUser: any[] = [];
  UserId = localStorage.getItem("idUser");
  ListFollower: string = "";
  IsChangeUser = false;

  isAccept = false;
  StatusTicket: number;
  Check_huy: boolean = false;
  _userID;

  currentStatus: any;
  isCollapsedsticker = true;
  list_image: any[] = [];

  hideDescription: boolean = true;
  typeDescription: number = 1;//1;thu gọn, 2 phóng to

  hideTabAttachment: boolean = false;
  hideTabActivity: boolean = false;

  @ViewChild('vtabchitiet') vtabchitiet: any;
  @ViewChild('vtabhoatdong') vtabhoatdong: any;
  @ViewChild('vtabtailieu') vtabtailieu: any;

  constructor(
    public TicketRequestManagementService: TicketRequestManagementService,
    private activatedRoute: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    public dialog: MatDialog,
    public FormatTimeService: FormatTimeService,
    public auth: AuthService,
    private fb: FormBuilder,
    public messageService: MessageService,
    public liteService: JeeTicKetLiteService,
    public TicKetSendService: TicKetSendService,
    public TicKetHandleService: TicKetHandleService,
    public TicKetFollowService: TicKetFollowService,
    public permissionService: PermissionManagementService,
    public storage: TokenStorage,
    private ticketDocument: TicketDocumentService,
  ) {

  }

  async ngOnInit(): Promise<void> {
    const Quill: any = QuillNamespace;
    Quill.register({ 'modules/mention': QuillMention }, true);
    const data = await this.storage.getAuthFromLocalStorage().toPromise();
    const obj = JSON.parse(data)
    this._userID = obj.user.customData["jee-account"].userID;// data.user.customData["jee-account"].userID;
    this.userCurrent = obj.user.username;
    this.user_login = this._userID;
    const rowid = Number(this.activatedRoute.snapshot.paramMap.get("id"));



    this.CheckAccess(rowid, this._userID);
    this.node = { showtag: false };

    this.liteService.list_tags().subscribe((res) => {
      this.list_milestone = this.MapDataForTag(res);
      this.changeDetectorRefs.detectChanges();
    });

    const sb = this.activatedRoute.params.subscribe((params) => {
      this.hideTabAttachment = false;
      this.hideTabActivity = false;
      this.typeDescription = 1;
      this.Message = "";
      this.TicKetID = +params.id;
      this.TicketRequestManagementService.getTiceketPCByRowID(
        this.TicKetID
      ).subscribe((res) => {
        if (res.status == 1) {
          res.data[0].Activity.sort(function (a, b) {
            var nameA = a.RowID
            var nameB = b.RowID
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
            // name trùng nhau
            return 0;
          });
          this.ticketPcDTO = Object.assign({}, ...res.data);
          if (this.ticketPcDTO.Document.length == 0) {
            this.hideTabAttachment = true;
          }
          if (this.ticketPcDTO.Activity.length == 0) {
            this.hideTabActivity = true;
          }
          this.statusid = this.ticketPcDTO.Status.RowID;
          this.status_ticket = this.statusid;
          this.currentStatus = this.statusid;
          this.userID = this.ticketPcDTO.User.userid;
          this.sourceType = this.ticketPcDTO.SourceType;
          this.Title = this.ticketPcDTO.Title;

          this.changeDetectorRefs.detectChanges();
          this.isAccept = this.ticketPcDTO.IsAccept;

        }
      });

      this.messageService.connectToken(this.TicKetID);
      if (this._subscriptions_chat) {

        this._subscriptions_chat.forEach((sb) => sb.unsubscribe());
        this.messageService.Newmessage.next(undefined)
      }

      this.subscribeToEventsNewMess();
      this.EventUploadFile();
      this.changeDetectorRefs.detectChanges();
    });

    //

    this.liteService.list_account().subscribe((res) => {
      if (res && res.status === 1) {
        this.listUser = res.data;
        var index = this.listUser.find((x) => x.userid == this.UserId);
        if (index && !(this.item.RowID > 0)) {
          this.selected.push(index);
        }
        this.options = this.getOptions();
        this.changeDetectorRefs.detectChanges();
      }
    });
    //

    this.TicketRequestManagementService.GetStatusNoCustom().subscribe((res) => {
      this.stautsDTO = res.data;
      this.changeDetectorRefs.detectChanges();
    });
    this.check_answer = true;
    this._subscriptions.push(sb);
  }

  zoomDepscription() {
    if (this.typeDescription == 1) this.typeDescription = 2;
    else this.typeDescription = 1;
    this.changeDetectorRefs.detectChanges();
  }

  filter_Attachment(type, att): any//type=1:lọc ra image, 2:còn lại
  {

    let Attacment = [];
    if (type == 1) {
      att.forEach(element => {
        if (this.isImage(element.Type))
          Attacment.push(element);
      })
      return Attacment;
    }
    else {

    }
  }
  isImage(type): boolean {

    if (type == 'jpg' || type == 'png') {
      return true;
    }
    return false;
  }
  backgroupImage(listatt, index) {
    return listatt[index].Link;
  }
  //==========Begin ====

  DisplayTime(item) {
    let currentDate = new Date(new Date().toUTCString());

    let yearcr = currentDate.getFullYear();
    let monthcr = currentDate.getMonth();
    let daycr = currentDate.getDate();
    let d = item + 'Z'

    let date = new Date(d);


    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    if (year == yearcr && monthcr == month && daycr == day) {
      let str_hour = hour.toString();
      let str_minute = minute.toString();
      if (hour < 10) str_hour = '0' + str_hour;
      if (minute < 10) str_minute = '0' + str_minute;
      return str_hour + ':' + str_minute + ' Hôm nay'
    }
    else if (year == yearcr && monthcr == month && daycr - day == 1) {
      let str_hour = hour.toString();
      let str_minute = minute.toString();
      if (hour < 10) str_hour = '0' + str_hour;
      if (minute < 10) str_minute = '0' + str_minute;
      return str_hour + ':' + str_minute + ' Hôm qua'
    }
    else {
      var tz = moment.tz.guess()

      let d = item + 'Z'
      var dec = moment(d);
      return dec.tz(tz).format(' HH:mm DD/MM/YYYY');
    }

  }
  //======End====

  CheckShowMessage() {
    if (this.IdStatus_Dahuyyeucau != this.currentStatus) {
      return true;
    }
    return false;
  }

  loadDataTicket() {
    this.TicketRequestManagementService.getTiceketPCByRowID(
      this.TicKetID
    ).subscribe((res) => {
      if (res.status == 1) {
        res.data[0].Activity.sort(function (a, b) {
          var nameA = a.RowID
          var nameB = b.RowID
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          // name trùng nhau
          return 0;
        });
        this.ticketPcDTO = Object.assign({}, ...res.data);
        this.statusid = this.ticketPcDTO.Status.RowID;
        this.status_ticket = this.statusid;
        this.currentStatus = this.statusid;
        this.userID = this.ticketPcDTO.User.userid;
        this.sourceType = this.ticketPcDTO.SourceType;
        this.Title = this.ticketPcDTO.Title;

        this.changeDetectorRefs.detectChanges();

        // var flag = true;
        // this.ticketPcDTO.Agent.forEach((item) => {
        //   if (item.userid == this._userID && item.createdby == 0) {
        //     this.isAccept = true;
        //     flag = false;
        //   }
        // });
        // if (flag) {
        //   this.isAccept = false;
        // }

        this.isAccept = this.ticketPcDTO.IsAccept;

      }
    });
  }

  CheckAccess(ticketId: number, userId: number) {
    //flag = false => ko co quyen
    //flag = true => co quyen
    var flag = false;
    this.permissionService.GetListUserCanAccess(ticketId).subscribe((res) => {
      if (res && res.status == 1) {
        res.data.forEach((user) => {
          if (user.userid == userId) {
            flag = true;
          }
        });
        if (!flag) {
          this.router.navigate(["/"]);
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

  //agent follow
  getOptions() {
    var options: any = {
      showSearch: true,
      keyword: this.getKeyword(),
      data: this.listUser.filter(
        (x) => this.selected.findIndex((y) => x.userid == y.userid) < 0
      ),
    };
    return options;
  }
  getKeyword() {
    let i = this.ListFollower.lastIndexOf("@");
    if (i >= 0) {
      let temp = this.ListFollower.slice(i);
      if (temp.includes(" ")) return "";
      return this.ListFollower.slice(i);
    }
    return "";
  }

  DeletedEmployee(data: ChooseUserDTO) {
    const item = new TicketManagementModel();
    item.RowID = this.TicKetID;
    this.ticketPcDTO.Follower = this.ticketPcDTO.Follower.filter(
      (item) => item.userid != data.userid
    );

    item.FollowerID = this.GetArrayNumberFromArrayChooseUser(
      this.ticketPcDTO.Follower
    );
    item.CategoryID = this.ticketPcDTO.Category[0].RowID;

    this.TicketRequestManagementService.UpdateFollower(item).subscribe(
      (res) => {
        // this.setDataTicKetActivity(16);
        // this.TicketRequestManagementService.CreateTicketActivityManagement(
        //   this.activity
        // ).subscribe((res) => { });

      }

    );
    this.loadData();
  }

  UpdateAgent(data: ChooseUserDTO) {
    const item = new TicketManagementModel();
    item.RowID = this.TicKetID;
    this.ticketPcDTO.Agent = this.ticketPcDTO.Agent.filter(
      (item) => item.userid != data.userid
    );
    item.AgentID = this.GetArrayNumberFromArrayChooseUser(
      this.ticketPcDTO.Agent
    );
    item.CategoryID = this.ticketPcDTO.Category[0].RowID;

    this.TicketRequestManagementService.UpdateAgent(item).subscribe(
      (res) => {
        // this.setDataTicKetActivity(14);
        // this.TicketRequestManagementService.CreateTicketActivityManagement(
        //   this.activity
        // ).subscribe((res) => { });
      }
    );
    this.loadData();
  }
  GetArrayNumberFromArrayChooseUser(data: People[]) {
    var arrayNum: number[] = [];
    data.forEach((user) => {
      arrayNum.push(user.userid);
    });
    return arrayNum;
  }

  SelectedFollower(data) {
    this.ticketPcDTO.Follower = this.ticketPcDTO.Follower.filter(
      (item) => item.userid != data.userid
    );
    this.ticketPcDTO.Follower.push(data);
    var arrayFollower = this.GetArrayNumberFromArrayChooseUser(
      this.ticketPcDTO.Follower
    );
    var ticketModel = new TicketManagementModel();
    ticketModel.FollowerID = arrayFollower;
    ticketModel.RowID = this.TicKetID;
    ticketModel.CategoryID = this.ticketPcDTO.Category[0].RowID;
    this.TicketRequestManagementService.UpdateFollower(ticketModel).subscribe(
      (data) => {
        // this.setDataTicKetActivity(15);
        // this.TicketRequestManagementService.CreateTicketActivityManagement(
        //   this.activity
        // ).subscribe((res) => { });
      }

    );
    this.loadData();
  }

  SelectedAgent(data: any) {
    this.ticketPcDTO.Agent = this.ticketPcDTO.Agent.filter(
      (item) => item.userid != data.userid
    );
    this.ticketPcDTO.Agent.push(data);
    var arrayAgent = this.GetArrayNumberFromArrayChooseUser(
      this.ticketPcDTO.Agent
    );
    var ticketModel = new TicketManagementModel();
    ticketModel.AgentID = arrayAgent;
    ticketModel.RowID = this.TicKetID;
    ticketModel.CategoryID = this.ticketPcDTO.Category[0].RowID;
    this.TicketRequestManagementService.UpdateAgent(ticketModel).subscribe(
      (data) => {
        // this.setDataTicKetActivity(13);
        // this.TicketRequestManagementService.CreateTicketActivityManagement(
        //   this.activity
        // ).subscribe((res) => { });

      }

    );
    this.loadData()
  }
  //

  MapDataForTag(res: any) {
    var tag: any[] = [];
    res.data.forEach((item) => {
      var object = { id_row: 0, title: "", color: "" };
      object.id_row = item.RowID;
      object.title = item.Tag;
      object.color = item.Color;
      tag.push(object);
    });
    return tag;
  }

  ChangeStage(val) {
    this.status_ticket = val;
  }
  loadData() {
    this.TicketRequestManagementService.getTiceketPCByRowID(
      this.TicKetID
    ).subscribe((res) => {
      if (res.status == 1) {
        res.data[0].Activity.sort(function (a, b) {
          var nameA = a.RowID
          var nameB = b.RowID
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          // name trùng nhau
          return 0;
        });
        this.ticketPcDTO = Object.assign({}, ...res.data);
      }
    });
  }
  prenventInputNonNumber(item: any) {
    this.btnSend = true;
    if (item == "") this.btnSend = false;
  }
  getHeight_Mess(): any {
    let tmp_height = 0;
    // const height_pageInfo = document.getElementById('pageInfoTicket');
    // var rect = height_pageInfo.getBoundingClientRect();
    tmp_height = window.innerHeight - 60 - 60;//Input chat 60 , rect.height là height phần header thông tin
    return tmp_height + "px";
  }
  isViewMota: boolean = false;
  getHeightModalDes(): any {
    if (!this.isViewMota) return "200px";
    return "400px";
  }
  setHeightModalDes() {
    this.isViewMota = !this.isViewMota;
    this.getHeightModalDes();
  }
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 634;
    return tmp_height + "px";
  }
  getHeightEdittor(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 444;
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

  testrating(a: any) {
    this.Ratings.length = 0;
    for (var i = 0; i < a; i++) {
      this.Ratings.push(i);
    }
    return this.Ratings;
  }

  onScroll(event) {
    let _el = event.srcElement;
    if (_el.scrollTop + _el.clientHeight > _el.scrollHeight * 0.9) {

    }
  }
  setDataTicKetActivity(type: number) {
    this.activity.TicketID = this.TicKetID;
    this.activity.ActionType = type;
    if (type == 0) {
      this.activity.ActionText = "đã tạo Ticket";
    } else if (type == 1) {
      this.activity.ActionText = "đã trả lời cho Ticket";
    } else if (type == 13) {
      this.activity.ActionText = "đã thêm người hỗ trợ";
    }
    else if (type == 14) {
      this.activity.ActionText = "đã xóa người hỗ trợ";
    }
    else if (type == 15) {
      this.activity.ActionText = "đã thêm người theo dõi";
    }
    else if (type == 16) {
      this.activity.ActionText = "đã xóa người theo dõi";
    }
    else {
      this.activity.ActionText = "đã chỉnh sửa trạng thái TicKet";
    }
  }
  edit_title() {
    this.edit = true;
  }
  Set_update_title(): TicketManagementModel {
    const item = new TicketManagementModel();
    item.RowID = this.TicKetID;
    item.Title = this.Title;
    return item;
  }
  Update_title() {
    let item = this.Set_update_title();
    if (item.Title != "" && item.Title.length <= 100) {
      this.TicketRequestManagementService.UpdateTitle(item).subscribe((res) => {
        this.edit = false;
        this.TicketRequestManagementService.getTiceketPCByRowID(
          this.TicKetID
        ).subscribe((res) => {
          res.data[0].Activity.sort(function (a, b) {
            var nameA = a.RowID
            var nameB = b.RowID
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
            // name trùng nhau
            return 0;
          });
          this.ticketPcDTO = Object.assign({}, ...res.data);
          this.TicketRequestManagementService.send$.next('Load');
          this.changeDetectorRefs.detectChanges();
        });
        // this.loadDataList2();
      });
    }
    else {
      this.layoutUtilsService.showActionNotification(
        "Tên yêu cầu không được bỏ trống và không được vượt quá 100 ký tự !",
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



  set_item_update_TimeSLA(): TicketAgentModel {
    const item = new TicketAgentModel();
    item.TicketID = this.TicKetID;
    this.changeDetectorRefs.detectChanges();

    return item;
  }

  update_status(id: number) {
    let item = this.set_status(id);
    this.TicketRequestManagementService.updateStauts(item).subscribe((res) => {
      // this.setDataTicKetActivity(2);
      // this.TicketRequestManagementService.CreateTicketActivityManagement(
      //   this.activity
      // ).subscribe((res) => { });

      this.TicketRequestManagementService.getTiceketPCByRowID(
        this.TicKetID
      ).subscribe((res) => {
        res.data[0].Activity.sort(function (a, b) {
          var nameA = a.RowID
          var nameB = b.RowID
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          // name trùng nhau
          return 0;
        });
        this.ticketPcDTO = Object.assign({}, ...res.data);
        // this.TicketRequestManagementService.send$.next('Load');
        this.changeDetectorRefs.detectChanges();
      });
      if (id == 41) {
        let item_timesla = this.set_item_update_TimeSLA();
            this.TicketRequestManagementService.UpdateTimeSLa(item_timesla).subscribe(res => {
            })
      }
      // this.loadDataList2();
    });
  }
  update_priority(id: number) {
    let item = this.set_priority(id);
    this.TicketRequestManagementService.updatePriority(item).subscribe(
      (res) => {
        if (res.statusCode == 1) {
          this.TicketRequestManagementService.getTiceketPCByRowID(
            this.TicKetID
          ).subscribe((res) => {
            if (res.status == 1) {
              res.data[0].Activity.sort(function (a, b) {
                var nameA = a.RowID
                var nameB = b.RowID
                if (nameA < nameB) {
                  return 1;
                }
                if (nameA > nameB) {
                  return -1;
                }
                // name trùng nhau
                return 0;
              });
              this.ticketPcDTO = Object.assign({}, ...res.data);
              this.changeDetectorRefs.detectChanges();

            }
          });
          // this.loadDataList2();
        }

      }
    );
  }
  set_status(id: number): TicketManagementModel {
    const item = new TicketManagementModel();
    item.RowID = this.TicKetID;
    item.Status = id;
    this.changeDetectorRefs.detectChanges();

    return item;
  }
  setDataUpdateStatus(): TicketManagementModel {
    const item = new TicketManagementModel();
    item.RowID = this.TicKetID;
    item.Status = this.status_ticket;
    this.changeDetectorRefs.detectChanges();

    return item;
  }
  ListPriority: any[] = [
    { id: 0, name: "Thấp", color: "#C4C4C4" },
    { id: 1, name: "Bình thường", color: "#00C875" },
    { id: 2, name: "Cao", color: "#FDAB3D" },
    { id: 3, name: "Khẩn cấp", color: "#E2445C" },
  ];

  set_priority(id: number): TicketManagementModel {
    const item = new TicketManagementModel();
    item.RowID = this.TicKetID;
    item.Priority = id;
    item.Title = this.Title;
    item.CategoryID = this.ticketPcDTO.Category[0].RowID;
    this.changeDetectorRefs.detectChanges();

    return item;
  }

  // ItemMessenger(): TicketMessagesManagementModel {
  //   const item = new TicketMessagesManagementModel();
  //   const data = this.auth.getAuthFromLocalStorage();
  //   var _userID = data.user.customData["jee-account"].userID;
  //   if (_userID == this.userID) {
  //     item.IsResponse = false;
  //   } else {
  //     item.IsResponse = true;
  //   }
  //   item.Message = this.Message;
  //   item.TicketID = this.TicKetID;
  //   return item;
  // }

  ItemMessenger(): TicketMessagesManagementModel {

    const item = new TicketMessagesManagementModel();
    const data = this.auth.getAuthFromLocalStorage();
    var _userID = data.user.customData["jee-account"].userID;
    if (_userID == this.userID) {
      item.IsResponse = false;
    } else {
      item.IsResponse = true;
    }

    item.TicketID = this.TicKetID;
    this.messageContent = this.Message;

    this.NotifyTagName(this.messageContent.replace("<p><br></p>", ""));

    if (this.listChoseTagGroup.length > 0) {
      item.isTagName = true
    }
    else {
      item.isTagName = false
    }

    if (this.isEnCode == true && this.messageContent !== "") {
      item.Message = this.encryptUsingAES256(this.messageContent.replace("<p><br></p>", ""));
    }
    else {
      item.Message = this.messageContent.replace("<p><br></p>", "");
    }


    //item.UserName = this.userCurrent;
    item.username = this.userCurrent;
    item.IdGroup = this.TicKetID;
    item.isGroup = this.isGroup;
    if (this.isEnCode) {
      item.isEncode = true;
      // item.keyEncode=this.KeyEnCode

    }
    else {
      item.isEncode = false
      // item.keyEncode="";

    }

    if (this.listReply.length > 0) {
      if (this.listReply[0].Content_mess === "") {
        item.Note = this.listReply[0].FullName + ": Tệp đính kèm";
      }
      else {
        item.Note = this.listReply[0].FullName + ":" + this.decryNote(this.listReply[0].Content_mess);
      }

    }
    else {
      item.Note = "";
    }

    item.IsDelAll = false;
    item.IsVideoFile = this.url ? true : false;
    item.Attachment = this.AttachFileChat.slice();

    return item
  }

  AcceptTask() {
    //Check xem co quyen nhan task vua tao khong ?
    this.TicketRequestManagementService.getTiceketPCByRowID(
      this.TicKetID
    ).subscribe((res) => {
      res.data[0].Activity.sort(function (a, b) {
        var nameA = a.RowID
        var nameB = b.RowID
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        // name trùng nhau
        return 0;
      });
      this.ticketPcDTO = Object.assign({}, ...res.data);
      this.changeDetectorRefs.detectChanges();
    });

    if (this.ticketPcDTO.Agent.length > 1) {
      var model = new TicketManagementModel();
      model.clear();
      model.RowID = this.ticketPcDTO.RowID;
      model.CategoryID = this.ticketPcDTO.Category[0].RowID;
      const data = this.auth.getAuthFromLocalStorage();
      var _userID = data.user.customData["jee-account"].userID;
      model.AgentID.push(_userID);
      this.TicketRequestManagementService.acceptTask(model).subscribe(
        (res) => {
          if (res) {
            // // this.layoutUtilsService.showActionNotification(
            // //   "Nhận việc thành công",
            // //   MessageType.Read,
            // //   4000,
            // //   true,
            // //   false
            // // );

            // this.setDataTicKetActivity(5);
            // this.TicketRequestManagementService.CreateTicketActivityManagement(
            //   this.activity
            // ).subscribe((res) => { });

          }
        }
      );
      this.isAccept = false;
    } else {
      this.layoutUtilsService.showActionNotification(
        "Đã có thành viên nhận việc !",
        MessageType.Read,
        999999999,
        true,
        false,
        3000,
        "top",
        0
      );
      this.router.navigate(["/"]);
    }
  }

  sendMessageTicket() {
    this.TicketRequestManagementService.GetStautsTicket(
      this.TicKetID
    ).subscribe((res) => {
      if (res.status == 1) {
        if (this.isAccept) {
          this.AcceptTask();
        }
        this.TicketRequestManagementService.getTiceketPCByRowID(
          this.TicKetID
        ).subscribe((res) => {
          res.data[0].Activity.sort(function (a, b) {
            var nameA = a.RowID
            var nameB = b.RowID
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
            // name trùng nhau
            return 0;
          });
          this.ticketPcDTO = Object.assign({}, ...res.data);
          this.statusid = this.ticketPcDTO.Status.RowID;
        });


        if (this.IdStatus_Dahuyyeucau != res.data && this.IdStatus_Closed != res.data) {
          let item = this.ItemMessenger();
          let itemstatus = this.setDataUpdateStatus();

          if (item.Message || item.Attachment.length > 0) {
            const data = this.auth.getAuthFromLocalStorage();
            var _token = data.access_token;
            if (this.status_ticket != this.statusid) {

              this.messageService.sendMessage(_token, item, this.TicKetID);

              this.TicketRequestManagementService.updateStauts(
                itemstatus
              ).subscribe((res) => {
                this.TicketRequestManagementService.getTiceketPCByRowID(
                  this.TicKetID
                ).subscribe((res) => {
                  res.data[0].Activity.sort(function (a, b) {
                    var nameA = a.RowID
                    var nameB = b.RowID
                    if (nameA < nameB) {
                      return 1;
                    }
                    if (nameA > nameB) {
                      return -1;
                    }
                    // name trùng nhau
                    return 0;
                  });
                  this.ticketPcDTO = Object.assign({}, ...res.data);
                  this.changeDetectorRefs.detectChanges();
                });
                this.loadData();
              });
              this.messageForm.reset();
            } else {
              this.messageService.sendMessage(_token, item, this.TicKetID);
              this.messageForm.reset();

            }
            if (this.status_ticket != this.status_closed) {
              this.close_ticket = false;

            } else {
              let item_timesla = this.set_item_update_TimeSLA();
              this.close_ticket = true;

            }
            this.list_image = [];
            this.AttachFileChat = [];
            this.Message = "";
            this.loadData();
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
        } else {
          this.layoutUtilsService.showActionNotification(
            "Yêu cầu hỗ trợ này đã đóng hoặc bị hủy",
            MessageType.Read,
            999999999,
            true,
            false,
            3000,
            "top",
            0
          );
          this.TicketRequestManagementService.getTiceketPCByRowID(
            this.TicKetID
          ).subscribe((res) => {
            res.data[0].Activity.sort(function (a, b) {
              var nameA = a.RowID
              var nameB = b.RowID
              if (nameA < nameB) {
                return 1;
              }
              if (nameA > nameB) {
                return -1;
              }
              // name trùng nhau
              return 0;
            });
            this.ticketPcDTO = Object.assign({}, ...res.data);
            this.changeDetectorRefs.detectChanges();
          });
        }
        this.loadDataTicket();
      }
    });
  }

  itemup(): TicketManagementModel {
    const item = new TicketManagementModel();
    item.RowID = this.TicKetID;
    item.Rating = this.ticketPcDTO.Rating;
    item.Content_rating = this.ticketPcDTO.Content_rating;
    return item;
  }

  Update_rating() {
    if (this.IdStatus_Dahuyyeucau == this.status_ticket || this.ticketPcDTO.User.userid != this.user_login) {
      return;
    }
    let item = this.itemup();

    const dialogRef = this.dialog.open(RatingPopupComponent, {
      data: { item },
      width: '350px'
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res != undefined) {
        if (res) {
          this.TicketRequestManagementService.getTiceketPCByRowID(
            this.TicKetID
          ).subscribe((res) => {
            res.data[0].Activity.sort(function (a, b) {
              var nameA = a.RowID
              var nameB = b.RowID
              if (nameA < nameB) {
                return 1;
              }
              if (nameA > nameB) {
                return -1;
              }
              // name trùng nhau
              return 0;
            });
            this.ticketPcDTO = Object.assign({}, ...res.data);
            this.changeDetectorRefs.detectChanges();
          });
        }
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
        this.TicketRequestManagementService.getTiceketPCByRowID(
          this.TicKetID
        ).subscribe((res) => {
          res.data[0].Activity.sort(function (a, b) {
            var nameA = a.RowID
            var nameB = b.RowID
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
            // name trùng nhau
            return 0;
          });
          this.ticketPcDTO = Object.assign({}, ...res.data);
          this.changeDetectorRefs.detectChanges();
        });
      }
    });
    this.changeDetectorRefs.detectChanges();
  }


  set_item_huy(): TicketManagementModel {
    const item = new TicketManagementModel();
    item.RowID = this.TicKetID;
    item.Status = this.IdStatus_Dahuyyeucau;
    return item;
  }
  Huyyeucau() {
    this.Check_huy = true;
    let item = this.set_item_huy();
    this.TicketRequestManagementService.updateStauts(
      item
    ).subscribe((res) => {
      if (res.statusCode == 1) {

        this.TicketRequestManagementService.send$.next('Load');
        this.layoutUtilsService.showActionNotification(
          "Đã hủy yêu cầu",
          MessageType.Update,
          4000,
          true,
          false
        );
        this.TicketRequestManagementService.getTiceketPCByRowID
          (this.TicKetID)
          .subscribe((res) => {
            res.data[0].Activity.sort(function (a, b) {
              var nameA = a.RowID
              var nameB = b.RowID
              if (nameA < nameB) {
                return 1;
              }
              if (nameA > nameB) {
                return -1;
              }
              // name trùng nhau
              return 0;
            });
            this.HoTro = res.data;
            this.ticketPcDTO = Object.assign({}, ...res.data);
            this.TicketRequestManagementService.send$.next('Load');
            this.changeDetectorRefs.detectChanges();
          });
        // this.loadDataList2();
        // this.TicKetSendService.fetch();
        // this.TicKetHandleService.fetch();
        // this.TicKetFollowService.fetch();
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
  }




  getName(val) {
    if (!val) return;
    var x = val.split(" ");
    return x[x.length - 1];
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
  RemoveTag(checkRemove: boolean) {
    if (checkRemove == true) {
      this.TicketRequestManagementService.getTiceketPCByRowID(
        this.TicKetID
      ).subscribe((res) => {
        if (res.status == 1) {
          res.data[0].Activity.sort(function (a, b) {
            var nameA = a.RowID
            var nameB = b.RowID
            if (nameA < nameB) {
              return 1;
            }
            if (nameA > nameB) {
              return -1;
            }
            // name trùng nhau
            return 0;
          });
          this.ticketPcDTO = Object.assign({}, ...res.data);
          // this.TicketRequestManagementService.send$.next('Load');
          this.changeDetectorRefs.detectChanges();
        }
      });
    }


  }
  LoadData(data: any) {
    this.TicketRequestManagementService.getCategory2ByRowID(this.TicKetID);
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
  stopPropagation(event) {
    event.stopPropagation();
  }
  ReloadData(data: any) {
    this.TicketRequestManagementService.getTiceketPCByRowID(
      this.TicKetID
    ).subscribe((res) => {
      if (res.status == 1) {
        res.data[0].Activity.sort(function (a, b) {
          var nameA = a.RowID
          var nameB = b.RowID
          if (nameA < nameB) {
            return 1;
          }
          if (nameA > nameB) {
            return -1;
          }
          // name trùng nhau
          return 0;
        });
        this.ticketPcDTO = Object.assign({}, ...res.data);
        // this.TicketRequestManagementService.send$.next('Load');
        this.changeDetectorRefs.detectChanges();
      }
    });

    // this.loadDataList2()

  }
  created(event: Quill) {
    // tslint:disable-next-line:no-console
  }

  changedEditor(value: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    // this.testmessage_chang = event.editor.html;
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

  PriorityColor(priority: number) {
    if (priority == 0) return "#C4C4C4";
    if (priority == 1) return "#00C875";
    if (priority == 2) return "#FDAB3D";
    if (priority == 3) return "#E2445C";
  }

  getHeightMain(): any {
    let tmp_height = window.innerHeight - 5;
    return tmp_height + "px";
  }

  getHeightMainRight(): any {
    let tmp_height = window.innerHeight;
    return tmp_height + "px";
  }

  getWidthDetails(): any {
    let tmp = window.innerWidth - 350 - 70;
    return tmp + "px";
  }
  getWidthTags(): any {
    let tmp = window.innerWidth - 350 - 350 - 70- 209;
    return tmp + "px";
  }

  getWidthDetailsLeft(): any {
    let tmp = window.innerWidth - 350 - 70 - 350;
    return tmp + "px";
  }
  getpaddingLeft(): any {
    let tmp = window.innerWidth - 350 - 70 - 350;
    tmp = tmp / 2 - 5;
    return tmp + "px";
  }
  getHeight_hoatdong(): any {
    if (this.hideTabActivity) return "0px";
    let tmp_height = 0;
    tmp_height = window.innerHeight - this.vtabchitiet.nativeElement.offsetHeight - this.vtabtailieu.nativeElement.offsetHeight - 55;
    return tmp_height + "px";
  }
  getHeightChiTiet(): any {
    let tmp_height = 675;
    if (this.hideTabAttachment && this.hideTabActivity)
      tmp_height = window.innerHeight - 97;
    return tmp_height + "px";
  }
  getHeight_tailieu(): any {
    if (!this.hideTabAttachment) {
      if (!this.hideTabActivity) {
        return "max-content";
      }
      else {
        let tmp_height = 0;
        tmp_height = window.innerHeight - this.vtabchitiet.nativeElement.offsetHeight - this.vtabhoatdong.nativeElement.offsetHeight - 55;
        return tmp_height + "px";

      }
    }
    else return 0;
  }
  getmaxHeight_tailieu(): any {
    if (!this.hideTabAttachment) {
      if (!this.hideTabActivity) {
        let tmp_maxheight = 150;
        return tmp_maxheight + "px";
      }
      else {
        let tmp_maxheight = 0;
        tmp_maxheight = window.innerHeight - this.vtabchitiet.nativeElement.offsetHeight - this.vtabhoatdong.nativeElement.offsetHeight - 55;
        return tmp_maxheight + "px";

      }
    }
    else return 0;
  }
  getMarginIcon(): any {
    if (this.IdStatus_Dahuyyeucau != this.status_ticket && this.IdStatus_Closed != this.status_ticket) return '5px';
    else return '15px';
  }
  onClickHideTabAttachment(): any {
    this.hideTabAttachment = !this.hideTabAttachment;
    this.changeDetectorRefs.detectChanges();
  }
  onClickHideTabActivity(): any {
    this.hideTabActivity = !this.hideTabActivity;
    this.changeDetectorRefs.detectChanges();
  }

  getDisplayAttachment(): any {
    if (this.hideTabAttachment) return 'none';
    else return 'inline';
  }
  getDisplayActivity(): any {
    if (this.hideTabActivity) return 'none';
    else return 'inline';
  }
  getpaddingTopMess(index): any {
    if (index != 0) return "0";
    return "80px";
  }

  getClassMoreMenu(val: boolean) {
    if (val) return '';
    else return '';
  }
  //===================================tabtailieu==================================

  fileToUpload: any;
  imageUrl: any;
  fileChosen: any;
  flagChangeImage: boolean = false;
  handleFileInput(file: FileList) {
    this.flagChangeImage = true;
    this.fileToUpload = file.item(0);
    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      //this.cd.detectChanges();
    };
    if (this.fileToUpload !== null) {
      reader.readAsDataURL(this.fileToUpload);
    }
    this.fileChosen = file;
    // this.productManagementService.uploadFile(file);
  }

  itemfile: any = [];

  // preview(data: any) {}
  // DownloadFile(data: any) {}
  CheckClosedTask() {
    if (this.itemfile.closed) {
      return false;
    } else {
      return true;
    }
  }
  Delete_File(data: any) { }
  //=============================Tab dữ liệu=========================
  AttFile: any[] = [];
  @ViewChild("myInput") myInput;
  indexItem: number;
  ObjImage: any = { h1: "", h2: "" };
  Image: any;
  TenFile: string = "";

  selectFile() {
    let el: HTMLElement = this.myInput.nativeElement as HTMLElement;
    el.click();
  }
  FileSelected(evt: any) {

    if (evt.target.files && evt.target.files.length) {
      //Nếu có file
      var filesAmount = evt.target.files.length;
      let isFlag = true;
      for (let i = 0; i < filesAmount; i++) {
        var typefile =
          evt.target.files[i].name.split(".")[
          evt.target.files[i].name.split(".").length - 1
          ]; //Lấy loại file
        if (
          typefile != "doc" &&
          typefile != "docx" &&
          typefile != "pdf" &&
          typefile != "rar" &&
          typefile != "zip" &&
          typefile != "jpg" &&
          typefile != "png" &&
          typefile != "xls" &&
          typefile != "xlsx"




        ) {
          this.layoutUtilsService.showActionNotification(
            "Tồn tại tệp không hợp lệ. Vui lòng chọn tệp có định dạng doc, docx, pdf, rar, zip, và định dạng image",
            MessageType.Read,
            9999999999,
            true,
            false,
            3000,
            "top",
            0
          );
          isFlag = false;
          return;
        }
      }
      if (isFlag) {
        // this.UploadFileForm(evt);
        this.UploadFileFormV2(evt);
        setTimeout(() => {
          let ticket = this.prepareDataFromFB();
          this.TicketRequestManagementService.createFileTicket(
            ticket
          ).subscribe((res) => {
            this.TicketRequestManagementService.getTiceketPCByRowID(
              this.TicKetID
            ).subscribe((res) => {
              if (res.status == 1) {
                res.data[0].Activity.sort(function (a, b) {
                  var nameA = a.RowID
                  var nameB = b.RowID
                  if (nameA < nameB) {
                    return 1;
                  }
                  if (nameA > nameB) {
                    return -1;
                  }
                  // name trùng nhau
                  return 0;
                });
                this.ticketPcDTO = Object.assign({}, ...res.data);
                this.loadData();
                this.changeDetectorRefs.detectChanges();
              }
            });
          });
        }, 500);
      }
    }
  }

  UploadFileForm(evt) {
    let ind = 0;
    if (this.AttFile.length > 0) {
      ind = this.AttFile.length;
    }
    if (evt.target.files && evt.target.files[0]) {
      var filesAmount = evt.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          let base64Str = event.target.result;
          var metaIdx = base64Str.indexOf(";base64,");
          base64Str = base64Str.substr(metaIdx + 8);
          this.AttFile[ind].strBase64 = base64Str;
          ind++;
        };

        reader.readAsDataURL(evt.target.files[i]);

        this.AttFile.push({
          filename: evt.target.files[i].name,
          type: evt.target.files[i].name.split(".")[
            evt.target.files[i].name.split(".").length - 1
          ],
          strBase64: "",
          IsAdd: true,
          IsDel: false,
          IsImagePresent: false,
        });
      }
    }
  }
  UploadFileFormV2(event) {

    this.progress = 0;
    // this.interval = setInterval(() => {
    //   if (this.progress < 90) {
    //     this.progress = this.progress + 0.5;
    //     this.changeDetectorRefs.detectChanges();
    //   }

    // }, 400);
    // this.list_file.push(event.target.files);
    let filesToUpload: File[] = event.target.files;
    // console.log(" this.list_file this.list_file", this.list_file)
    const frmData = new FormData();
    Array.from(filesToUpload).map((file, index) => {
      return frmData.append('file' + index, file, file.name);
    });


    this.ticketDocument.CreateDocumentByForm(frmData, this.TicKetID).subscribe(

      {
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress) {

            // this.progress = Math.round((100 / event.total) * event.loaded);
            // console.log("thisprogress",this.progress)


          }

          else if (event.type === HttpEventType.Response) {
            if (event.body) {
              this.loadingfilelarge = false;

              this.progress = 100;

              if (this.progress == 100) {
                clearInterval(this.interval);
              }
              this.changeDetectorRefs.detectChanges();
              // alert("Upload thành công")

            }
          }
        },
      })
  }
  deleteFile(file: any) {
    this.AttFile.splice(file, 1);
    this.myInput.nativeElement.value = "";
    this.changeDetectorRefs.detectChanges();
  }
  deleteTicketDocument(model: any) {
    var documentModel = new FileUploadModel();
    documentModel.IdRow = model.RowID;
    documentModel.src = model.Link;
    this.TicketRequestManagementService.deleteTicketDocument(
      documentModel
    ).subscribe((data) => { });
    this.TicketRequestManagementService.getTiceketPCByRowID(
      this.TicKetID
    ).subscribe((res) => {
      res.data[0].Activity.sort(function (a, b) {
        var nameA = a.RowID
        var nameB = b.RowID
        if (nameA < nameB) {
          return 1;
        }
        if (nameA > nameB) {
          return -1;
        }
        // name trùng nhau
        return 0;
      });
      this.ticketPcDTO = Object.assign({}, ...res.data);
      this.changeDetectorRefs.detectChanges();
    });
  }
  getIcon(type) {
    let icon = "";
    if (type == "doc" || type == "docx") {
      icon = "./../../../../../assets/media/mime/word.png";
    }
    if (type == "pdf") {
      icon = "./../../../../../assets/media/mime/pdf.png";
    }
    if (type == "rar") {
      icon = "./../../../../../assets/media/mime/text2.png";
    }
    if (type == "zip") {
      icon = "./../../../../../assets/media/mime/text2.png";
    }
    if (type == "jpg") {
      icon = "./../../../../../assets/media/mime/jpg.png";
    }
    if (type == "png") {
      icon = "./../../../../../assets/media/mime/png.png";
    }
    if (type == "xls" || type == "xlsx") {
      icon = "./../../../../../assets/media/mime/excel.png";
    }
    if (type == "mp4" || type == "mp3") {
      icon = "./../../../../../assets/media/mime/file-video-icon.png";
    }
    if (type == "text/plain") {
      icon = "./../../../../../assets/media/mime/text2.png";
    }
    return icon;
  }
  DownloadFile(link) {
    window.open(link);
  }
  base64Image: any;
  TaiXuongAnh(item) {
    var a = item;
    let imageUrl = item.Link;

    this.getBase64ImageFromURL(imageUrl).subscribe(base64data => {
      console.log(base64data);
      this.base64Image = "data:image/jpg;base64," + base64data;
      // save image to disk
      var link = document.createElement("a");

      document.body.appendChild(link); // for Firefox

      link.setAttribute("href", this.base64Image);
      link.setAttribute("download", item.Name + '.' + item.Type);
      link.click();
    });
  }
  saveOrOpenBlobFileAll(url, blobName, index) {


    var start = new Date().getTime()
    var blob;
    var xmlHTTP = new XMLHttpRequest();

    xmlHTTP.open('GET', url, true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function (e) {
      blob = new Blob([this.response]);
    };
    xmlHTTP.onprogress = (pr) => {

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

  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }
  getBase64Image(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL: string = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }

  IsImage(file) {
    if (file.Type == "png" || file.Type == "jpg") {
      return true
    } else {
      return false;
    }
  }



  prepareDataFromFB(): TicketManagementModel {
    const ticket = new TicketManagementModel();
    ticket.RowID = this.TicKetID;
    ticket.Attachments = this.AttFile;
    this.AttFile = [];
    return ticket;
  }

  filterMessageThread(array: Observable<any[]>) {
    var lstResult = array.pipe(map(result => result.filter((v, i, a) => a.findIndex(v2 => (v.RowID === v2.RowID)) === i)));
    return lstResult;

  }
  onResize(event) {
    var width_resize = event.target.innerWidth;
    let tmp = width_resize - 350 - 70 - 350;
    const element = document.getElementById('pageResize');
    element.style.width = tmp + "px";
  }
  IsAdmin(userID) {
    var find = this.ticketPcDTO.Admin.find(t => t.userid == userID);
    if (find)
      return true;
    return false;
  }
  IsAgent(userID) {
    var find = this.ticketPcDTO.Agent.find(t => t.userid == userID);
    if (find)
      return true;
    return false;
  }
  IsFollower(userID) {
    var find = this.ticketPcDTO.Follower.find(t => t.userid == userID);
    if (find)
      return true;
    return false;
  }
  CheckRoleByKey(key: string) {
    switch (key) {
      case 'status': {
        if (this.IsAdmin(this.user_login) || this.IsAgent(this.user_login) || this.IsFollower(this.user_login)) {
          return true;
        }
        break;
      }
      case 'priority': {
        if (this.IsAdmin(this.user_login) || this.IsAgent(this.user_login) || this.IsFollower(this.user_login)) {
          return true;
        }
        break;
      }
      default: {
        //statements;
        break;
      }
    }
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
            this.sendMessageTicket()
            //this.sendMessage()
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
        border-radius: 50px;    width: 30px; ;background-color:red !important">
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


  //Code for message

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


  // downloadfile(name: string, url: string,idchat:number,filename:string,check:boolean) {

  //   if(check==true)
  //   {
  // this.layoutUtilsService.showActionNotification('Đang tải file vui lòng đợi', MessageType.Read, 3000, true, false, 3000, 'top', 0);
  //   }
  //   else
  //   {

  //   this.idchatprocess=idchat
  //   this.filenameprocess=filename;
  //   this.download$ = this.downloads.download(url, name)
  //   // this.downloads.download(url, name).subscribe(res=>{
  //   //   console.log("REEEEE",res)
  //   // })
  //   }

  // }



  downloadimage(url: string) {
    this.getBase64ImageFromURL(url).subscribe(base64data => {
      this.base64Image = "data:image/jpg;base64," + base64data;
      // save image to disk
      var link = document.createElement("a");

      document.body.appendChild(link); // for Firefox

      link.setAttribute("href", this.base64Image);
      link.setAttribute("download", "download.jpg");
      link.click();
    });
  }
  RemoveVideos(index) {

    this.myFilesVideo.splice(index, 1);
    this.AttachFileChat.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
    this.url = "";
  }


  myFilesVideo: any[] = [];

  url;
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
      debugger
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

  RemoveChoseFile(index) {
    this.AttachFileChat.splice(index, 1);
    this.listFileChat.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
  }
  RemoveChoseImage(index) {
    this.list_image.splice(index, 1);
    this.AttachFileChat.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
  }
  showPT() {
    if (this.show) {
      this.show = false;
    }
    else {
      this.show = true;
    }

  }
  showEmojiPicker = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  // set = 'twitter';
  set = 'facebook';
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

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


  ItemMessengerMeeting(idMeting, content): Message {

    const item = new Message();

    item.isTagName = false
    item.Content_mess = content;
    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.isGroup = this.isGroup;
    item.IdMeeting = idMeting;
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
    item.Attachment = this.AttachFileChat.slice();

    return item
  }


  f_convertDate(v: any) {
    if (v != "" && v != null) {
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



  f_number(value: any) {
    return Number((value + "").replace(/,/g, ""));
  }

  f_currency(value: any, args?: any): any {
    let nbr = Number((value + "").replace(/,|-/g, ""));
    return (nbr + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }


  convertDateTime(d: any) {
    return moment(d).format("HH:mm");
  }


  EditNameGroup(item: any) {
    // const dialogRef = this.dialog.open(EditGroupNameComponent, {
    //   width: '400px',
    //   data: item
    //   // panelClass:'no-padding'
    // });
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.GetInforUserChatwith(this.id_Group)
    //     this.changeDetectorRefs.detectChanges();
    //   }
    // })

  }
  HidenMess(IdChat: number, IdGroup: number) {
    const data = this.auth.getAuthFromLocalStorage();

    var _token = data.access_token;
    this.messageService.HidenMessage(_token, IdChat, IdGroup)
  }




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
    if (value && this.countsendcomposing <= 3) {

      const data = this.auth.getAuthFromLocalStorage();

      var _token = data.access_token;
      this.messageService.Composing(_token, this.id_Group).then(res => {
        this.countsendcomposing = this.countsendcomposing + 1;
      }

      ).catch()


    }
    else {
      return;

    }
  }


  ItemInsertMessenger(note: string): Message {
    const item = new Message();
    item.Content_mess = 'đã thêm';
    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.isGroup = this.isGroup;
    item.Note = note;
    item.isTagName = false
    item.isInsertMember = true;
    item.IsDelAll = false;
    item.IsVideoFile = this.url ? true : false;
    item.isFile = false;
    item.Attachment = []


    return item
  }



  sendInsertMessage(note: string) {

    this.isloading = false;
    const data = this.auth.getAuthFromLocalStorage();
    var _token = data.access_token;
    let item = this.ItemInsertMessenger(note);
    this.messageService.sendMessage(_token, item, this.id_Group).then(() => {


    })





  }


  loadDataListLayzy(page: number) {




  }

  public appendItems(): void {
    this.isloading = true;
    this.min = 20000;
    this.max = 40000;
    this.listMess = this.listMess.slice()
    this.pageSize += 1;
    this.loadDataListLayzy(this.pageSize);
    this.changeDetectorRefs.detectChanges();
  }



  // send leave mess group


  ItemLeaveMessenger(content: string, note: string): Message {
    const item = new Message();
    item.Content_mess = content;
    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.IsDelAll = true;
    item.isTagName = false
    item.isGroup = this.isGroup;
    item.Note = note

    item.IsVideoFile = this.url ? true : false;
    item.isFile = false;
    item.Attachment = []
    return item
  }



  sendLeaveMessage(mess: string, note: string) {

    this.isloading = false;
    const data = this.auth.getAuthFromLocalStorage();

    var _token = data.access_token;
    let item = this.ItemLeaveMessenger(mess, note);
    this.messageService.sendMessage(_token, item, this.id_Group).then(() => {


    })





  }


  preview(attachment,type_mess = 0)//type_mess =2 : kiểu dữ liệu hình ảnh được trả từ socket
   {
    let type_image = false;
    if(type_mess ==2 || attachment.Type == "png" || attachment.Type == "jpg") type_image = true;
    let file = attachment.Link;
    if (!type_image) {      
      const dialogRef = this.dialog.open(PreviewfileComponent, {
        width: '1000px',
        // /height: '93vh',
        data: { file },
  
  
      });
    } else {
      let ischat=true
      const dialogRef = this.dialog.open(PreviewAllimgComponent, {
        width: 'auto',
        panelClass: 'chat-bg-preview',
        data: {file,ischat}
      }).afterClosed().subscribe(result => {
  
        // this.closeDilog(result);
  
  
      });
    }
  }
  preview2(file) {
    if (file.Type == "png" || file.Type == "jpg") {
      this.DownloadFile(file.Link);
    } else {
      this.layoutUtilsService.ViewDoc(file.Link);
    }
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
  getClassHidenTime(item, idchat) {
    if (this.id_Chat) {
      if (item && this.id_Chat == idchat) {
        return 'HidenTime zoom-in-zoom-out';
      }
      else if (item) {
        return 'HidenTime';
      }
      else if (this.id_Chat == idchat) {
        return 'zoom-in-zoom-out';
      }
      else {
        return '';
      }
    }
    else {


      if (item) {
        return 'HidenTime';
      }
      else {
        return '';
      }
    }
  }

  getClassReply(item) {
    if (item == this.userCurrent) {
      return 'reply';
    }
    else {
      return 'reply-user';
    }
  }


  getClassDownload(item) {
    if (item == true) {
      return 'classdownload';
    }

  }

  getClassUser(item, anh: any, file: any, video: any, content, isHidenTime) {
    if (item == this.userCurrent && (anh.length > 0 || file.length > 0 || video.length > 0) && (content == '' || !content)) {
      return 'curent';
    }
    else if (item !== this.userCurrent && (anh.length > 0 || file.length > 0 || video.length > 0) && (content == '' || !content) && !isHidenTime) {
      return 'notcurent';
    }
    else if (item !== this.userCurrent && (anh.length > 0 || file.length > 0 || video.length > 0) && (content == '' || !content) && isHidenTime) {
      return 'notcurent_hidtime';
    }
    else {
      return ''
    }


  }
  getShowMoreChat(item) {
    if (item !== this.userCurrent) {
      return ' chat right';
    }
    else {
      return ' chat';
    }

  }
  getShowMoreChatLeft(item) {
    if (item == this.userCurrent) {
      return ' chat chatleft';
    }
    else {
      return ' chat chatright';
    }

  }
  getClassFile(item) {
    return 'userfile'
  }
  getClassTime(item) {
    if (item === this.userCurrent) {
      return 'timesent';
    }
    else {
      return 'timereplies';
    }
  }
  getClassHiden(item, time: boolean) {

    if (item !== this.userCurrent && !time) {
      return 'hidenmess diff';
    }
    else if (item !== this.userCurrent && time) {
      return 'hidenmess timehidden';
    }
    else {
      return 'hidenmess';
    }
  }

  getClass(item, key, keyinsert, keyvote) {
    if (key === false && !keyinsert && !keyvote) {


      if (item === this.userCurrent) {
        return 'replies ';
      }
      else {
        return 'sent';
      }
    }
    if (key) {
      return 'leaveGroup';
    }
    if (keyinsert) {
      return 'ImsertGroup';
    }
    if (keyvote) {
      return 'ImsertGroup';
    }
  }

  getNameUser(val) {
    if (val) {
      var list = val.split(' ');
      return list[list.length - 1];
    }
    return "";
  }

  GetInforUserChatwith(IdGroup: number) {

  }

  setIntrvl() {
    setInterval(() => this.isloading = false, 1000);
  }
  // ReconectGroup(){

  //   setInterval(() => this.messageService.connectToken(this.id_Group),1000);
  // }
  GetTagNameisGroup(isGroup) {

  }

  GetImage(idgroup) {
    // this.chatService.GetImage(idgroup).subscribe(res => {
    //   this.LstImagePanel = res.data;
    //   this.changeDetectorRefs.detectChanges();
    // })
  }
  GetImageTop9(idgroup) {
    // this.chatService.GetImageTop9(idgroup).subscribe(res => {
    //   this.LstImagePanelTop9 = res.data;
    //   this.changeDetectorRefs.detectChanges();
    // })
  }
  GetLinkConver(idgroup) {
    // this.chatService.GetLinkConversation(idgroup).subscribe(res => {
    //   this.LstPanelLink = res.data;
    //   this.changeDetectorRefs.detectChanges();
    // })
  }
  setFocus(editor) {

    editor.focus();
  }

  toggleSideNav() {
    // this.sidenav.close()
  }
  ReloadMessage() {
    this.messageService.connectToken(this.TicKetID);
  }
  EventUploadFile() {
    const sb = this.messageService.uploadfile$.subscribe(res => {
      if (res) {
        this.ReloadMessage();
        if (this.TicKetID == res[0].idTicket) {

          // let index = this.listMess.findIndex(x => x.IdChat == res[0].idMessage);
          // if (index >= 0) {
          //   this.listMess[index].Attachment_File.forEach(element => {
          //     element.disabled = null
          //     this.changeDetectorRefs.detectChanges()
          //   });
          // }

        }

      }
    })

    this._subscriptions.push(sb);
  }
  EventInsertJob() {
    // const sb = this.messageService.InsertJob$.subscribe(res => {
    //   if (res) {
    //     let indexcv = this.listMess.findIndex(x => x.IdChat == res.messageid);
    //     if (indexcv >= 0) {
    //       this.listMess[indexcv].TaskID = res.id_row;
    //       this.chatService.ReloadCV$.next(this.id_Group);
    //       this.changeDetectorRefs.detectChanges();
    //     }

    //   }

    // })
    // this._subscriptions_chat.push(sb)
  }
  Event() {
    // fromEvent(window, 'dis').subscribe((res: any) => {

    //   if (res.detail == "Disconnect") {
    //     this.messageService.stopHubConnectionChat();
    //   }

    // })
    // // this._subscriptions_chat.push(sv);
  }
  EventCloseSearch() {
    // const sb = this.conversation_service.SearchTabChat$.subscribe(res => {
    //   if (res) {
    //     if (res == "Close") {
    //       this.searchText = "";
    //       this.opensearch = false;
    //       this.sidenav.close()
    //     }
    //   }
    // })
    // this._subscriptions_chat.push(sb)
  }
  SucribeVote() {


  }
  CheckEnCodeInConversation(IdGroup) {
    // this.chatService.CheckEnCodeInConversation(IdGroup).subscribe(res => {
    //   if (res && res.status == 1) {
    //     this.KeyEnCode = res.data[0].KeyEnCode;

    //     this.changeDetectorRefs.detectChanges();
    //   }
    //   else {
    //     this.KeyEnCode = undefined;
    //     this.changeDetectorRefs.detectChanges();
    //   }
    // }
    // )
  }
  GetStoreSticker() {
    this.messageService.GetStoreSticker().subscribe(res => {
      if (res && res.status == 1) {
        this.listStoreSticker = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  QuanLyStoreSticker() {
    this.messageService.QuanLyStoreSticker().subscribe(res => {
      if (res && res.status == 1) {
        this.listQLStoreSticker = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  listSticker: any[] = []
  GetSticker(GrSticker) {
    this.messageService.GetSticker(GrSticker).subscribe(res => {
      if (res && res.status == 1) {
        this.listSticker = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  listStickermini: any[] = [];
  GetminilistSticker() {
    this.messageService.GetminilistSticker().subscribe(res => {
      if (res && res.status == 1) {
        this.listStickermini = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  CheckConnect(idGroup) {


    // this.messageService.CheckConnect(idGroup).then((res) => {
    //   this.ischeckconnect = false
    //   clearInterval(this.intervalcheck);
    // }
    // ).catch((error) => {
    //   this.ischeckconnect = true
    // }
    // )


  }
  EventcheckConnectMess() {
    // const sb = this.messageService.StoreCheckConnect$.subscribe(res => {
    //   if (res == "onreconnecting") {
    //     this.ischeckconnect = true
    //     this.changeDetectorRefs.detectChanges()

    //   }
    //   else if (res == "onreconnected") {
    //     this.ischeckconnect = false
    //     this.loadDataList();
    //     this.changeDetectorRefs.detectChanges()
    //     // load lại danh sách tin nhắn
    //   }
    // })

    // this._subscriptions_chat.push(sb)
  }



  private subscribeToEventsHidenmes(): void {


    const sb = this.messageService.hidenmess.subscribe(res => {
      if (res) {
        let item = {
          IdGroup: this.id_Group, IdChat: res
        }
        this.messageService.MyChatHidden$.next(item);
        let index = this.listMess.findIndex(x => x.IdChat == res);
        if (index >= 0) {
          this.listMess[index].IsHidenAll = true;
          this.changeDetectorRefs.detectChanges();
        }

      }
    })

    this._subscriptions.push(sb)

  }

  private subscribeToEventsLasttimeMess(): void {



    const sb = this.messageService.lasttimeMess.subscribe(res => {
      if (res) {
        let index = this.listMess.findIndex(x => x.IdChat == res.IdChat)
        if (index >= 0 && res.IsFile) {
          this.listMess[index].isHidenTime = true;
          this.changeDetectorRefs.detectChanges();
        }
        else {
          this.listMess[index].isHidenTime = true;
          this.changeDetectorRefs.detectChanges();
          // alert("xx")

          // this.loadDataList();
        }



      }

    })


    this._subscriptions.push(sb)

  }

  // getClassfile(item, hidentime) {
  //   if (item == this.userCurrent) {
  //     return 'loadcssfileright';
  //   }
  //   else
  //     if (hidentime) {
  //       return 'loadcssfilelefthidden';
  //     }
  //     else {
  //       return 'loadcssfileleft';
  //     }

  // }
  getClassfileRight(item) {
    return 'loadcssfilerightticket';
  }
  getClassfileLeft(item) {
    return 'loadcssfileleft';
  }
  private subscribeToEventsComposing(): void {

    // this.messageService.ComposingMess
    //   .pipe(
    //     finalize(() => { }),
    //     concatMap(x => x))
    //   .subscribe(x => {
    //     if (x) {
    //       if (this.UserId != x.UserId && this.id_Group == x.IdGroup) {

    //         this.composing = true
    //         this.composingname = x.Name;
    //         setTimeout(() => {
    //           this.composing = false;
    //           this.changeDetectorRefs.detectChanges();
    //         }, 4000);
    //         this.changeDetectorRefs.detectChanges();
    //       }
    //     }
    //   });
    // // this._ngZone.run(() => {

    // // const sb=this.messageService.ComposingMess.subscribe(res=>
    // //   {
    // //     if(res)
    // //     {
    // //       if(this.UserId!=res.UserId&&this.id_Group==res.IdGroup)
    // //       {


    // //       this.composing=true
    // //       this.composingname=res.Name;
    // //       setTimeout(() => {
    // //         this.composing =false;
    // //         this.messageService.ComposingMess.next(undefined)
    // //         this.changeDetectorRefs.detectChanges();
    // //        }, 3000);
    // //        this.changeDetectorRefs.detectChanges();
    // //       }
    // //     }
    // //   })
    // //   this._subscriptions_chat.push(sb);
    // // })



  }




  private subscribeToEventsNewMess(): void {
    this.composing = false;

    const sbchat = this.messageService.Newmessage$.subscribe(res => {
      if (this.listMess !== null) {
        if (res) {



          this.id_chat_notify = res[0].RowID;



        }

      }


    })


    this._subscriptions_chat.push(sbchat)

  }

  private subscribeToEvents(): void {



  }
  SetActive(item: any, active = true) {
    setTimeout(() => {



      let index = this.listInfor.findIndex(x => x.UserId === item);

      if (index >= 0) {

        this.listInfor[index].Active = active ? 1 : 0;

        this.changeDetectorRefs.detectChanges();
      }
    }, 500);

  }

  // send mess


  ItemMessengerFile(): TicketMessagesManagementModel {

    const item = new TicketMessagesManagementModel();
    this.messageContent = "";
    this.NotifyTagName(this.messageContent.replace("<p><br></p>", ""));

    if (this.listChoseTagGroup.length > 0) {
      item.isTagName = true
    }
    else {
      item.isTagName = false
    }
    // item.Content_mess = this.messageContent.replace("<p><br></p>", "");
    // item.UserName = this.userCurrent;

    item.Message = this.messageContent.replace("<p><br></p>", "");
    item.username = this.userCurrent;

    item.TicketID = this.TicKetID;
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

  encryptUsingAES256(text) {

    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(text), this.KeyEnCode, {
      keySize: 16,
      iv: this.KeyEnCode,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.ZeroPadding
    });
    return encrypted.toString();
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
  ItemMessengerResend(content): Message {

    const item = new Message();

    this.NotifyTagName(content.replace("<p><br></p>", ""));

    if (this.listChoseTagGroup.length > 0) {
      item.isTagName = true
    }
    else {
      item.isTagName = false
    }

    item.Content_mess = content.replace("<p><br></p>", "");

    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.isGroup = this.isGroup;
    if (this.isEnCode) {
      item.isEncode = true;
      // item.keyEncode=this.KeyEnCode

    }
    else {
      item.isEncode = false
      // item.keyEncode="";

    }

    if (this.listReply.length > 0) {
      if (this.listReply[0].Content_mess === "") {
        item.Note = this.listReply[0].FullName + ": Tệp đính kèm";
      }
      else {
        item.Note = this.listReply[0].FullName + ":" + this.decryNote(this.listReply[0].Content_mess);
      }

    }
    else {
      item.Note = "";
    }

    item.IsDelAll = false;
    item.IsVideoFile = this.url ? true : false;
    item.Attachment = this.AttachFileChat.slice();

    return item
  }

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

  // ItemNotifyMessenger(content: string, idchat: number): NotifyMessage {
  //   // const access_token = this.conversation_service.getAccessToken_cookie();
  //   const item = new NotifyMessage();
  //   item.TenGroup = this.TenGroup;
  //   item.Avatar = this.Avataruser;
  //   item.isEncode = this.isEnCode;
  //   item.IdChat = idchat;
  //   item.IdGroup = this.id_Group;
  //   item.Content = content;
  //   item.ListTagname = this.listChoseTagGroup;
  //   return item
  // }

  ItemMessengerEror(): any {
    // const item = new MessageError();
    // let date2 = new Date();
    // item.IdChat = Number.parseInt(date2.getMilliseconds().toString() + "000");
    // item.isError = true;
    // item.Seen = []
    // if (this.listChoseTagGroup.length > 0) {
    //   item.isTagName = true
    // }
    // else {
    //   item.isTagName = false
    // }
    // item.Content_mess = this.messageContent.replace("<p><br></p>", "");
    // item.UserName = this.userCurrent;
    // item.IdGroup = this.id_Group;
    // item.isGroup = this.isGroup;
    // item.isInsertMember = false;
    // item.Videos = [];
    // if (this.listReply.length > 0) {
    //   if (this.listReply[0].Content_mess === "") {
    //     item.Note = this.listReply[0].FullName + ": Tệp đính kèm";
    //   }
    //   else {
    //     item.Note = this.listReply[0].FullName + ":" + this.listReply[0].Content_mess;
    //   }

    // }
    // else {
    //   item.Note = "";
    // }
    // let temperror = [{
    //   Avatar: this.Avataruser,
    //   BgColor: "rgb(211, 84, 0)",
    //   Department: "",
    //   Fullname: this.Fullname,
    //   ID_user: this.UserId,
    //   Jobtitle: "Developer",
    //   Username: this.userCurrent,
    // }]
    // item.InfoUser = temperror;
    // // item.CreatedDate=this.currentDate;
    // item.IsDelAll = false;
    // item.IsHidenAll = false
    // item.CreatedDate = this.currentDate
    // item.IsVideoFile = this.url ? true : false;
    // item.Attachment_File = [];
    // item.Attachment = [];


    // return item
  }


  sendMessageChat() {

    let item = this.ItemMessenger();
    let itemerro: any = this.ItemMessengerEror();

    this.messageContent = this.Message;

    this.messageContent = this.messageContent.replace("<p></p>", "").replace("<p>", "").replace("</p>", "").toString().trim();

    if ((this.messageContent && this.messageContent != "" && this.messageContent != "<p><br></p>" && this.messageContent.length > 0) || this.AttachFileChat.length > 0) {
      this.messageForm.reset();
      this.isloading = false;
      const data = this.auth.getAuthFromLocalStorage();

      var _token = data.access_token;
      this.messchecklink = this.messageContent.replace("<p></p>", "");
      this.AttachFileChat = [];

      this.lstTagName = [];

      this.list_file = [];
      this.listFileChat = [];
      this.list_image = [];
      this.listReply = [];
      this.myFilesVideo = [];
      this.url = "";
      this.messageContent = "";




      this.messageService.sendMessage(_token, item, this.TicKetID).then((res) => {



        if (this.id_Chat) {

          this.router.navigateByUrl('/Chat/Messages/' + this.id_Group + '/null');

        }
        if (this.draftmessage.length > 0) {
          let indexremove = this.draftmessage.findIndex(x => x.IdGroup == this.id_Group);
          if (indexremove >= 0) {
            this.draftmessage.splice(indexremove, 1);
            localStorage.setItem("draftmessage", JSON.stringify(this.draftmessage));
            //this.conversation_service.draftMessage$.next(true);

          }

        }


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

      })
        .catch((error) => {
          console.log("error", error)
          let dataitem: any[] = []
          dataitem.push(itemerro);
          this.listMess = this.listMess.concat(dataitem);
          this.changeDetectorRefs.detectChanges()

        });

    }
    else {

      this.messageContent = "";
      this.messchecklink = "";
      this.txttam = "";
      this.messageForm.reset();
      this.layoutUtilsService.showActionNotification('Định dạng tin nhắn không phù hợp!', MessageType.Read, 3000, true, false, 3000, 'top', 0);
    }


    if (this.messchecklink.includes("https")) {
      let link = this.getLink(this.messchecklink.replace('</p>', ''));
    }

  }


  sendMessageMeeting(IDMetting: number, content: any) {


    // this.txttam="";

    this.messageForm.reset();

    let itemerro: any = this.ItemMessengerEror();
    this.isloading = false;
    const data = this.auth.getAuthFromLocalStorage();

    var _token = data.access_token;
    let item = this.ItemMessengerMeeting(IDMetting, content);

    this.AttachFileChat = [];

    this.lstTagName = [];

    this.list_file = [];
    this.listFileChat = [];
    this.list_image = [];
    this.listReply = [];
    this.myFilesVideo = [];
    this.url = "";
    this.messageContent = "";


    this.messageService.sendMessage(_token, item, this.id_Group).then((res) => {




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

        dataitem.push(itemerro);
        this.listMess = this.listMess.concat(dataitem);
        // console.log("AAAA",this.listMess)
        this.changeDetectorRefs.detectChanges()

      });







  }





  loadlightbox(id: any) {
    this.imgopen = [];
    // this.viewer.=false

    let index = this.listMess.findIndex((x) => x.IdChat == id);
    this.imgopen = this.listMess[index].Attachment.slice();
    let tamp = {
      item: this.imgopen,
      ischat: true
    }
    const dialogRef = this.dialog.open(PreviewAllimgComponent, {
      width: 'auto',
      panelClass: 'chat-bg-preview',
      data: tamp
    }).afterClosed().subscribe(result => {

      // this.closeDilog(result);


    });

  }

  // ItemLinnk(dt): LinkConver {
  //   const item = new LinkConver();

  //   item.listLink = dt;
  //   return item;
  // }
  getLink(item) {
    // const matches = item.match(/\bhttps?:\/\/\S+/gi);
    // if (matches) {
    //   let item = this.ItemLinnk(matches);
    //   this.chatService.SaveLink(this.id_Group, item).subscribe(res => {
    //     if (res && res.status == 1) {
    //       this.messchecklink = null;
    //     }
    //   })
    // }

  }
  decryNote(item) {
    return this.decryptUsingAES256(item).replace("\\", "").replace("\\", "");
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
  urlify(item, isEndCode) {
    if (isEndCode == true) {
      let mess = this.decryptUsingAES256(item).split('\\').join('');
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





  GetListReaction() {
    // this.chatService.getlist_Reaction().subscribe(res => {
    //   this.list_reaction = res.data;
    //   this.changeDetectorRefs.detectChanges();

    // })
  }

  SendReaction(idchat: number, type: number, isnotify, contentchat, usernamereceivers) {

    const dt = this.auth.getAuthFromLocalStorage();
    //this.messageService.ReactionMessage(dt.access_token, this.id_Group, idchat, type, isnotify, contentchat, usernamereceivers);
  }


  private subscribeToEventsSendReaction(): void {


    // this._ngZone.run(() => {

    //   const sb = this.messageService.reaction.subscribe(res => {

    //     if (res) {
    //       let index = this.listMess.findIndex(x => x.IdChat == res.data[0].IdChat);
    //       if (index >= 0) {
    //         this.listMess[index].ReactionChat = res.data[0].ReactionChat.slice();
    //         if (res.data[0].ReactionUser.CreateBy == this.UserId) {
    //           this.listMess[index].ReactionUser = Object.assign(res.data[0].ReactionUser);
    //         }

    //         this.changeDetectorRefs.detectChanges();
    //       }
    //     }
    //   })
    //   this._subscriptions.push(sb);
    // })



  }


  private subscribeToEventsSeenMess(): void {


    // this._ngZone.run(() => {

    //   const sb = this.messageService.seenmess.subscribe(res => {
    //     if (res && res.status == 1) {

    //       if (res.data[0].IdGroup === this.id_Group && res.data[0].UserName !== this.userCurrent) {


    //         if (!this.isGroup) {
    //           this.listMess[this.listMess.length - 1].Seen.splice(0, 1, res.data[0]);
    //           this.changeDetectorRefs.detectChanges();
    //         }
    //         else {
    //           // let vitri= this.listMess[this.listMess.length-1].Seen
    //           // .findIndex(x=>x.username==res.data[0].UserName)
    //           // console.log("AAAA",vitri)
    //           // if(vitri<0)
    //           // {
    //           this.listMess[this.listMess.length - 1].Seen = res.data;

    //           this.changeDetectorRefs.detectChanges();
    //           // }

    //         }

    //       }

    //       // setTimeout(() => {
    //       //   this.active_SeenMess=false;
    //       // }, 600000);


    //       // if(res.IdGroup)
    //       // let index=this.listMess.findIndex(x=>x.IdChat==res.data[0].IdChat);
    //       //   if(index>=0)
    //       //   {
    //       //     this.listMess[index].ReactionChat=res.data[0].ReactionChat.slice();
    //       //     this.listMess[index].ReactionUser=Object.assign(res.data[0].ReactionUser);
    //       //     this.changeDetectorRefs.detectChanges();
    //       //   }
    //     }
    //   })
    //   this._subscriptions.push(sb);
    // })


  }

  InsertRectionChat(idchat: number, type: number, isnotify, contentchat: string, usernamereceivers: string) {
    let noidung;

    let content = this.decryptUsingAES256(contentchat).split('\\').join('').replace("<p>", "").replace("</p>", "")

    if (content.indexOf(`class=ql-mention-denotation-char`) > 1) {
      noidung = "Đã đánh dấu complete tin nhắn của bạn"
    }
    else {
      noidung = content;
    }
    this.SendReaction(idchat, type, isnotify, noidung, usernamereceivers);



  }
  toggleWithGreeting(idChat: number, type: number) {


    // this.messageService.GetUserReaction(idChat, type).subscribe
    //   (res => {
    //     this.listreaction = res.data;
    //     this.changeDetectorRefs.detectChanges();
    //   })

  }
  ItemSeenMessenger(): SeenMessModel {
    const item = new SeenMessModel();
    item.Avatar = this.Avataruser;
    //item.CreatedBy = this.UserId;
    item.CustomerId = this.customerID;
    item.Fullname = this.Fullname;
    item.id_chat = this.listMess[this.listMess.length - 1].IdChat;
    item.username = this.userCurrent;
    item.IdGroup = this.id_Group;

    return item
  }


  focusFunction = (event) => {
    let itemdt =
    {
      IdGroup: this.id_Group,
      isGroup: this.isGroup
    }
    //this.messageService.data_share = itemdt;
    setTimeout(() => {
      if (this.listMess) {


        if (this.listMess.length > 0) {

          if (event.oldRange == null && this.listMess[this.listMess.length - 1].UserName != this.userCurrent) {

            let item = this.ItemSeenMessenger();

            this.messageService.SeenMessage(item);

          }
        }
      }

    }, 1500);


  }

  DeleteReply() {
    this.listReply = [];
  }


  ChuyenTiepMess(itemmes) {
    // let dt = {
    //   item: itemmes,
    //   content: itemmes.isEncode == true ? this.decryptUsingAES256(itemmes.Content_mess).replace("\\", "").replace("\\", "") : itemmes.Content_mess
    // }
    // // this.dcmt.body.classList.add('header-fixed');
    // const dialogRef = this.dialog.open(ShareMessageComponent, {
    //   width: '600px',

    //   disableClose: true,
    //   data: { dt },


    // });
    // dialogRef.afterClosed().subscribe(res => {


    //   if (res) {
    //     //   const data = this.auth.getAuthFromLocalStorage();
    //     // this.presence.NewGroup(data.access_token,res[0],res[0])

    //     this.changeDetectorRefs.detectChanges();
    //   }
    // })

  }
  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  //@ViewChild(QuillEditorComponent, { static: true })



  // begin call video



  CallVideoDialog(code, callName, img, bg) {
    // var dl = { isGroup: this.isGroup, UserName: this.userCurrent, BG: 'rgb(51, 152, 219)', Avatar: img, PeopleNameCall: callName, status: code, idGroup: this.id_Group, keyid: null };
    // const dialogRef = this.dialog.open(CallVideoComponent, {
    //   // width:'900px',
    //   // height:'500px',
    //   data: { dl },
    //   disableClose: true

    // });
    // dialogRef.afterClosed().subscribe(res => {

    //   if (res) {

    //     const item = new Message();

    //     if (res.timecall == undefined) {
    //       res.status == 'call' ? item.Content_mess = "Đã lỡ cuộc gọi" : item.Content_mess = "Đã lỡ video call";
    //       res.timecall = "00:00"
    //     }
    //     else {
    //       res.status == 'call' ? item.Content_mess = "Cuộc gọi thoại" : item.Content_mess = "Video call";
    //     }



    //     item.UserName = res.UserName;
    //     item.IdGroup = this.id_Group;
    //     item.isCall = true;
    //     item.isTagName = false
    //     item.isGroup = this.isGroup;
    //     item.Note = res.timecall;
    //     item.IsDelAll = false;
    //     item.IsVideoFile = this.url ? true : false;
    //     item.Attachment = this.AttachFileChat.slice();

    //     const data = this.conversation_service.getAuthFromLocalStorage();

    //     var _token = data.access_token;
    //     this.messageService.sendMessage(_token, item, this.id_Group).then(() => {
    //       // this.messageContent="";
    //       // document.getElementById('content').textContent = '';

    //       this.lstTagName = [];
    //       this.AttachFileChat = [];
    //       this.list_file = [];
    //       this.listFileChat = [];
    //       this.list_image = [];
    //       this.listReply = [];
    //       this.myFilesVideo = [];
    //       this.url = "";
    //       // if(this.id_Chat)
    //       // {
    //       //   this.router.navigate(['Chat/Messages/'+this.id_Group+'/null']);
    //       // }

    //       // this.viewPort.scrollToIndex(this.listMess.length-1, 'smooth');
    //       setTimeout(() => {
    //         this.viewPort.scrollTo({
    //           bottom: 0,
    //           behavior: 'auto',
    //         });
    //       }, 0);
    //       setTimeout(() => {
    //         this.viewPort.scrollTo({
    //           bottom: 0,
    //           behavior: 'auto',
    //         });
    //       }, 50);
    //     })
    //   }
    // })

  }
  screenShare(): void {
    this.shareScreen();
  }

  private shareScreen(): void {
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia({
      video: {
        // cursor: 'always'
      },
      audio: {
        echoCancellation: true,
        // noiseSuppression: true
      }
    }).then(stream => {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }).catch(err => {
      console.log('Unable to get display media ' + err);
    });
  }

  private stopScreenShare(): void {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
  }




  //  loadlightboxImage(id_) {
  //   this.imgall=[]
  //   let index = this.LstImagePanel.findIndex((x) => x.id_chat == id_);
  //   if(index>=0)
  //   {
  //     this.imgall.push(this.LstImagePanel[index]);
  //   this.items = this.imgall.map((item) => {
  //     return {
  //       type: 'imageViewer',
  //       data: {
  //         src: item.hinhanh,
  //         thumb: item.hinhanh,
  //         data2: [
  //           item.hinhanh,
  //          // thumb: item.hinhanh,
  //        ],
  //       },
  //     };
  //   });

  //   /** Lightbox Example */

  //   // Get a lightbox gallery ref
  //   const lightboxRef = this.gallery.ref('lightbox');

  //   // Add custom gallery config to the lightbox (optional)
  //   lightboxRef.setConfig({
  //     imageSize: ImageSize.Cover,
  //     thumbPosition: ThumbnailsPosition.Bottom,
  //     itemTemplate: this.itemTemplate,
  //     gestures: false,

  //   });

  //   // Load items into the lightbox gallery ref
  //   let ob = this.items;
  //   lightboxRef.load(this.items);
  // }
  //   this.changeDetectorRefs.detectChanges();
  // }
  Back() {
    this.allfile = false;
  }
  //@ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  selectTab(tabId: number) {
    this.allfile = true;
    this.LoadFile(this.id_Group)
    this.GetImage(this.id_Group);
    this.AllLinkConversation(this.id_Group)
    // setTimeout(() => {
    //   if (this.staticTabs?.tabs[tabId]) {
    //     this.staticTabs.tabs[tabId].active = true;

    //   }
    // }, 100);

  }

  //public filteredFile: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  //public searchControl: FormControl = new FormControl();


  LoadFile(idgroup) {
    // this.chatService.GetAllFile(idgroup)
    //   .subscribe(res => {
    //     this.LstFilePanel = res.data;
    //     this.filteredFile.next(this.LstFilePanel.slice());
    //     this.changeDetectorRefs.detectChanges();
    //   })
  }
  AllLinkConversation(idgroup) {
    // this.chatService.GetAllLinkConversation(idgroup)
    //   .subscribe(res => {
    //     this.LstAllPanelLink = res.data;
    //     this.changeDetectorRefs.detectChanges();
    //   })
  }
  LoadFileTop4(idgroup) {
    // this.chatService.GetTop4File(idgroup)
    //   .subscribe(res => {
    //     this.LstFilePanelTop4 = res.data;
    //     this.changeDetectorRefs.detectChanges();
    //   })
  }
  protected filterBankGroups() {
    // if (!this.list_file) {
    //   return;
    // }
    // // get the search keyword
    // let search = this.searchControl.value;
    // // const bankGroupsCopy = this.copyGroups(this.list_group);
    // if (!search) {
    //   this.filteredFile.next(this.LstFilePanel.slice());

    // } else {
    //   search = search.toLowerCase();
    // }

    // this.filteredFile.next(
    //   this.LstFilePanel.filter(bank => bank.filename.toLowerCase().indexOf(search) > -1)
    // );
  }
  getColor() {

    return this.colornav ? '#3699FF' : '#B5B5C3';
  }

  toogleNav(nav: any) {


    if (nav.opened) {
      this.colornav = false;

      nav.close()
    } else {
      this.GetImageTop9(this.id_Group);
      this.LoadFileTop4(this.id_Group)
      this.GetLinkConver(this.id_Group);

      this.colornav = true

      nav.open();

    }
  }
  zoomIn(data) {
    alert(data)
    // this.viewer.zoomIn();
  }

  toggleFullscreen() {
    this.fullscreen = !this.fullscreen;
  }
  /**
* format bytes
* @param bytes (File size in bytes)
* @param decimals (Decimals point)
*/
  formatBytes(bytes) {
    if (bytes === 0) {
      return '0 KB';
    }
    const k = 1024;
    const dm = 2 <= 0 ? 0 : 2 || 2;
    const sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
  /**
 * Convert Files list to normal array list
 */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {

      let dt = {
        filename: item.name,
        size: item.size,
      }
      this.list_file_large.push(dt);
    }
    const data = this.auth.getAuthFromLocalStorage();
    var _token = data.access_token;
    let item = this.ItemMessengerFile();
    this.messageService.sendMessage(_token, item, this.id_Group).then((res) => {
      this.list_file_large = []
      this.loadingfilelarge = true;
    })
      .catch((error) => {
        this.layoutUtilsService.showActionNotification('Vui lòng gửi lại!', MessageType.Read, 3000, true, false, 3000, 'top', 0);

      });

    setTimeout(() => {


      this.progress = 0;
      this.interval = setInterval(() => {
        if (this.progress < 90) {
          this.progress = this.progress + 0.5;
          this.changeDetectorRefs.detectChanges();
        }

      }, 400);
      // this.list_file.push(event.target.files);
      let filesToUpload: File[] = files;
      // console.log(" this.list_file this.list_file", this.list_file)
      const frmData = new FormData();
      Array.from(filesToUpload).map((file, index) => {
        return frmData.append('file' + index, file, file.name);
      });


      this.messageService.UploadfileLage(frmData, this.id_Group, this.id_chat_notify).subscribe(

        {
          next: (event) => {
            if (event.type === HttpEventType.UploadProgress) {

              // this.progress = Math.round((100 / event.total) * event.loaded);
              // console.log("thisprogress",this.progress)


            }

            else if (event.type === HttpEventType.Response) {
              if (event.body) {
                this.loadingfilelarge = false;

                this.progress = 100;

                if (this.progress == 100) {
                  clearInterval(this.interval);
                }
                this.changeDetectorRefs.detectChanges();
                // alert("Upload thành công")

              }
            }
          },

        })
    }, 2500);
  }
  onFileDropped($event) {
    this.prepareFilesList($event);

    this.showbodyfile = false

  }
  CloseFile($event) {

    this.showbodyfile = false
  }
  HoverFile($event) {
    this.showbodyfile = true
  }
  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }


  isHidden = false;
  // ItemConversation(ten_group: string, data: any): ConversationModel {

  //   let dt = {
  //     Avatar: data.Avatar == "" ? null : data.Avatar,
  //     BgColor: data.BgColor,
  //     FullName: data.Fullname,
  //     UserID: data.ID_user,
  //     UserName: data.Username,
  //     Name: data.Name
  //   }


  //   this.listUser.push(dt);
  //   const item = new ConversationModel();
  //   item.GroupName = ten_group;
  //   item.IsGroup = false;
  //   item.ListMember = this.listUser.slice();


  //   return item
  // }
  ListInforUser: any[] = []
  LoadInforUser(Username: string) {
    // const sb = this.chatService.GetnforUserByUserNameForMobile(Username).subscribe(res => {
    //   this.ListInforUser = res.data;
    //   this.changeDetectorRefs.detectChanges();

    // })
    // this._subscriptions.push(sb)
  }
  CreateConverSation(item) {

    // let dt = null;
    // this.chatService.CheckConversation(item.Username).subscribe(res => {
    //   if (res && res.status == 1) {
    //     if (res.data.length > 0) {
    //       dt = res.data;
    //     }


    //   }
    //   if (dt != null) {

    //     this.router.navigateByUrl('/Chat/Messages/' + dt[0].IdGroup + '/null');
    //     localStorage.setItem('chatGroup', JSON.stringify(dt[0].IdGroup));
    //     // this.CloseDia(res.data);

    //   }
    //   else {


    //     // tạo hội thoại nếu chưa có
    //     let it = this.ItemConversation(item.Fullname, item);
    //     this.conversation_service.CreateConversation(it).subscribe(res => {
    //       if (res && res.status === 1) {

    //         const data = this.conversation_service.getAuthFromLocalStorage(); var contumer = {
    //           customerID: this.customerID
    //         }

    //         const returnedTarget = Object.assign(res.data[0], contumer);
    //         this.presence.NewGroup(data.access_token, res.data[0], returnedTarget)

    //         localStorage.setItem('chatGroup', JSON.stringify(res.data[0].IdGroup));
    //         this.router.navigateByUrl('/Chat/Messages/' + res.data[0].IdGroup + '/null');

    //       }
    //     })
    //   }
    // })
  }


  CreatedJob(itemchat: any) {
    let chuoi = ""
    let giatristart;
    let giatriend;
    if (itemchat.isEncode == true) {
      chuoi = this.decryptUsingAES256(itemchat.Content_mess).replace("\\", "").replace("\\", "");

      giatristart = chuoi.replace('/', "").indexOf(`data-id=`);
      giatriend = chuoi.replace('/', "").indexOf(`data-value=`);
    }
    else {
      chuoi = itemchat.Content_mess;
      giatristart = chuoi.replace('/', "").indexOf(`data-id="`);
      giatriend = chuoi.replace('/', "").indexOf(`data-value="`);
    }


    let tmp;
    // console.log("vvvvv",chuoi.substr(giatristart + 8, giatriend - giatristart - 8).replace("\\", "").replace("\\", ""))
    //   if (chuoi.substr(giatristart + 8, giatriend - giatristart - 8) != "") {

    //     this.chatService.GetInforbyUserName(`${chuoi.substr(giatristart + 8, giatriend - giatristart - 8)}`)
    //       .subscribe(res => {

    //         if (res) {
    //           tmp = {
    //             image: res.data[0].Avatar,
    //             hoten: res.data[0].Fullname,
    //             id_nv: res.data[0].ID_user,
    //           }

    //           if (this.IsGov) {
    //             const dialogRef = this.dialog.open(CongViecTheoDuAnVer1PopupComponent,
    //               {
    //                 data: { _messageid: itemchat.IdChat, _itemid: tmp, _message:chuoi.replace("<p></p>", ""), _type: 2, _groupid: this.id_Group, _ischat: true },
    //                 panelClass: ['sky-padding-0', 'width700'],
    //               });
    //             dialogRef.afterClosed().subscribe(res => {
    //               if (!res) {
    //               }
    //               else {
    //                 // này là tạo thành công
    //                 this.layoutUtilsService.showActionNotification(' Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
    //               }
    //             });
    //           } else {
    //             const dialogRef = this.dialog.open(CongViecTheoDuAnPopupComponent,
    //               {
    //                 data: { _messageid: itemchat.IdChat, _itemid: tmp, _message: chuoi.replace("<p></p>", ""), _type: 2, _groupid: this.id_Group, _ischat: true },
    //                 panelClass: ['sky-padding-0', 'width700'],
    //               });
    //             dialogRef.afterClosed().subscribe(res => {
    //               if (!res) {
    //               }
    //               else {
    //                 // này là tạo thành công
    //                 this.layoutUtilsService.showActionNotification(' Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
    //               }
    //             });
    //           }

    //         }
    //       })
    //   }
    //   else {


    //     this.chatService.GetnforUserByUserNameForMobile(itemchat.UserName).subscribe(res=>
    //       {
    //         if(res&&res.status==1)
    //         {



    //     // không phải nhóm tạo công việc chính mình lấy user kia
    //     if (this.userCurrent == itemchat.UserName && this.isGroup == false) {
    //       tmp = {
    //         image: this.listInfor[0].Avatar?this.listInfor[0].Avatar:"",
    //         hoten: this.listInfor[0].FullName,
    //         id_nv: this.listInfor[0].UserId,
    //       }
    //     }
    //     else {

    //         tmp = {
    //             image: itemchat.Avatar,
    //             hoten: itemchat.FullName,
    //             id_nv: res.data[0].ID_user

    //           }

    //     }

    //     if (this.IsGov) {
    //       const dialogRef = this.dialog.open(CongViecTheoDuAnVer1PopupComponent,
    //         {
    //           data: { _messageid: itemchat.IdChat, _itemid: tmp, _message: chuoi.replace("<p></p>", ""), _type: 2, _groupid: this.id_Group, _ischat: true },
    //           panelClass: ['sky-padding-0', 'width700'],
    //         });
    //       dialogRef.afterClosed().subscribe(res => {
    //         if (!res) {
    //         }
    //         else {
    //           // này là tạo thành công
    //           this.layoutUtilsService.showActionNotification(' Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
    //         }
    //       });
    //     } else {
    //       const dialogRef = this.dialog.open(CongViecTheoDuAnPopupComponent,
    //         {
    //           data: { _messageid: itemchat.IdChat, _itemid: tmp, _message: chuoi.replace("<p></p>", ""), _type: 2, _groupid: this.id_Group, _ischat: true },
    //           panelClass: ['sky-padding-0', 'width700'],
    //         });
    //       dialogRef.afterClosed().subscribe(res => {
    //         if (!res) {
    //         }
    //         else {
    //           // này là tạo thành công
    //           this.layoutUtilsService.showActionNotification(' Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
    //         }
    //       });
    //     }
    //   }

    // })



    //   }

  }
  ResendMessage(reitemchat) {
    localStorage.setItem('RechatGroup', this.id_Group);

    // xóa tin nhắn có lỗi đi
    this.isloadingError = true;
    setTimeout(() => {
      if (this.isloadingError) {

        this.isloadingError = false;
        this.changeDetectorRefs.detectChanges()

      }
      setTimeout(() => {
        let item = this.ItemMessengerResend(reitemchat.Content_mess);

        this.isloading = false;
        this.messageContent = this.messageContent.replace("<p></p>", "");

        const data = this.auth.getAuthFromLocalStorage();

        var _token = data.access_token;

        this.messageForm.reset();
        this.AttachFileChat = [];

        this.lstTagName = [];

        this.list_file = [];
        this.listFileChat = [];
        this.list_image = [];
        this.listReply = [];
        this.myFilesVideo = [];
        this.url = "";
        this.messageContent = "";

        const RechatGroup = localStorage.getItem('RechatGroup')
        this.messageService.sendMessage(_token, item, Number(RechatGroup)).then((res) => {
          let indexerrorchat = this.listMess.findIndex(x => x.IdChat == reitemchat.IdChat)
          if (indexerrorchat >= 0) {
            this.listMess = this.listMess.filter((item, index) => index !== indexerrorchat)
            this.isloadingError = false;
            this.ischeckconnect = false;
            this.changeDetectorRefs.detectChanges()

          }


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
            this.isloadingError = false;
            this.layoutUtilsService.showActionNotification('Không thể gửi tin nhắn!', MessageType.Read, 3000, true, false, 3000, 'top', 0);
          });



      }, 1000);
    }, 10000);


    // if (this.messageService.Resend() == false) {
    //   this.messageService.connectToken(this.id_Group);
    // }
    // this.txttam="";

    this.messageContent = reitemchat.Content_mess;
    setTimeout(() => {
      this.messageForm.reset();
      this.messageContent = this.messageContent.replace("<p></p>", "");
      if ((this.messageContent && this.messageContent != "" && this.messageContent != "<p><br></p>" && this.messageContent.length > 0) || this.AttachFileChat.length > 0) {
        let itemerro: any = this.ItemMessengerEror();
        this.isloading = false;
        const data = this.auth.getAuthFromLocalStorage();

        var _token = data.access_token;
        let item = this.ItemMessenger();

        this.AttachFileChat = [];

        this.lstTagName = [];

        this.list_file = [];
        this.listFileChat = [];
        this.list_image = [];
        this.listReply = [];
        this.myFilesVideo = [];
        this.url = "";
        this.messageContent = "";


        this.messageService.sendMessage(_token, item, this.id_Group).then((res) => {

          let indexerrorchat = this.listMess.findIndex(x => x.IdChat == reitemchat.IdChat)
          if (indexerrorchat >= 0) {
            // this.listMess.splice(indexerrorchat,1);
            this.listMess = this.listMess.filter((item, index) => index !== indexerrorchat)
            this.isloadingError = false;
            this.changeDetectorRefs.detectChanges()

          }

          // this.messageContent="";
          // document.getElementById('content').textContent = '';



          if (this.id_Chat) {

            this.router.navigateByUrl('/Chat/Messages/' + this.id_Group + '/null');
            // this.router.navigate(['DashBoard/Chat/Messages/'+this.id_Group+'/null']);
          }
          if (this.draftmessage.length > 0) {
            let indexremove = this.draftmessage.findIndex(x => x.IdGroup == this.id_Group);
            if (indexremove >= 0) {
              // this.draftmessage.splice(indexremove, 1);
              // localStorage.setItem("draftmessage", JSON.stringify(this.draftmessage));
              // this.conversation_service.draftMessage$.next(true);

            }

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
            // let dataitem:any[]=[]

            //   dataitem.push(itemerro);
            //   this.listMess= this.listMess.concat(dataitem);
            //   this.changeDetectorRefs.detectChanges()

          });




      }

    }, 1000);

  }
  ResendMess(item) {
    this.ResendMessage(item);
  }
  RouterCV(id_cv) {
    this.router.navigate(['', { outlets: { auxName: 'aux/detailWork/' + id_cv }, }]);
  }
  displayCounter(count) {
    this.parentCount = count;
  }
  IsGov: boolean = false;
  displayIsGov(val) {
    this.IsGov = val;
  }
  Changebg(url) {
    this.bgurl = url;
    this.changeDetectorRefs.detectChanges()
  }
  CloseChooseBG() {
    this.isCollapsed = true;
    this.bgurl = "";
    this.changeDetectorRefs.detectChanges()
  }
  // ItemChangeBg(url): ChangeBg {

  //   const item = new ChangeBg();
  //   item.IdGroup = this.id_Group;
  //   item.url = url,

  //     item.UploadBg = this.Lstimg_bg.slice();

  //   return item
  // }
  SaveBgUrl() {
    let item
    if (this.Lstimg_bg.length > 0) {
      //item = this.ItemChangeBg(null)
    }
    else {
      //item = this.ItemChangeBg(this.bgurl)
      this.listInfor[0].BgImage[0].BackgroundURL = this.bgurl;
    }

    // this.chatService.UpdateURLBg(item).subscribe(res => {
    //   if (res) {
    //     if (res.data.length > 0) {
    //       this.listInfor[0].BgImage[0].BackgroundURL = res.data[0].videoUrl;

    //     }
    //     this.bgurl = null;
    //     this.Lstimg_bg = [];
    //     this.layoutUtilsService.showActionNotification('Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
    //   }
    // })
  }

  defaulBG() {
    // this.bgurl = null;
    // let item = this.ItemChangeBg(null)
    // this.listInfor[0].BgImage[0].BackgroundURL = null;
    // this.chatService.UpdateURLBg(item).subscribe(res => {
    //   if (res) {
    //     // this.layoutUtilsService.showActionNotification('Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
    //   }
    // })
    // this.changeDetectorRefs.detectChanges();
  }
  uploadFile(event) {
    let temp: any[] = [];
    this.Lstimg_bg = [];
    let base64Str: any;
    let cat: any;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    var file_name = event.target.files;

    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = (event) => {
        cat = file_name[0].name.substr(file_name[0].name.indexOf('.'));
        if (cat.toLowerCase() === '.png' || cat.toLowerCase() === '.jpg') {
          temp.push(event.target.result);
          var metaIdx = temp[0].indexOf(';base64,');
          base64Str = temp[0].substr(metaIdx + 8);
          this.Lstimg_bg.push({ filename: file_name[0].name, type: file_name[0].type, size: file_name[0].size, strBase64: base64Str });
        }
        this.bgurl = reader.result;

        this.changeDetectorRefs.detectChanges();
        // console.log("sdsadsada",this.bgurl)

      }

    }
  }
  RouterMeeting(id) {
    // this.menu_service.CloseMenu();
    localStorage.setItem("activeTab", null);
    localStorage.setItem('chatGroup', "0");
    this.router.navigateByUrl(`/Meeting/${id}?Type=1`);

  }
  OpenSearch() {


  }


  saverangesearch(value) {

    if (value != "" && this.searchText != undefined) {
      this.getSearch(value)

    }
    else {
      this.listSearch = [];
      this.changeDetectorRefs.detectChanges();
    }

  }

  getSearch(vl: any) {
    // const queryParams1 = new QueryParamsModelNewLazy(
    //   '',
    //   '',
    //   '',
    //   0,
    //   50,
    //   false


    // );
    // this.chatService.getSearch(this.id_Group, vl, queryParams1).subscribe(res => {
    //   if (res.data) {
    //     this.listSearch = res.data;
    //     // console.log(" this.listSearch", this.listSearch)
    //     this.changeDetectorRefs.detectChanges();
    //   }
    // })
  }
  OpenS() {
    //this.conversation_service.data_share = false;
  }
  CreatedVote() {
    // const dialogRef = this.dialog.open(TaoBinhChonComponent, {
    //   width: '600px',
    //   disableClose: true,
    //   data: this.id_Group
    // }).afterClosed().subscribe(result => {

    //   this.loadDataList();
    //   // this.closeDilog(result);


    // });
  }
  getClassvote(item) {
    if (item) {

      if (item.lengthvote > 0) {
        let indexgr = this.listMess.findIndex(x => x.IdChat == item.id_chat)
        let indexvote = this.listMess[indexgr].Vote.findIndex(x => x.id_vote == item.id_vote)

        const progressdowload = document.getElementById("progress" + indexgr + indexvote);
        if (progressdowload) {
          progressdowload.classList.add('progressdown');
          progressdowload.style.width = Math.floor(item.lengthvote / item.allmember * 100) + "%";
        }


      }
    }


  }
  // Itemvote(itemdata): MemberVoteModel {
  //   const item = new MemberVoteModel();
  //   item.ListMmeberVote = itemdata;
  //   return item
  // }
  updatePrice(item, event) {
    let indexgr = this.listMess.findIndex(x => x.IdChat == item.id_chat)
    let indexvote = this.listMess[indexgr].Vote.findIndex(x => x.id_vote == item.id_vote)

    if ((<HTMLInputElement>event.target).checked) {
      this.list_Vote = []

      const progressdowload = document.getElementById("progress" + indexgr + indexvote);
      // const progressText = document.getElementById("progress-text"+bd+index);
      progressdowload.classList.add('progressdown');
      this.listMess[indexgr].Vote[indexvote].lengthvote = item.lengthvote + 1;
      progressdowload.style.width = Math.floor((item.lengthvote + 1) / item.allmember * 100) + "%";
      let ituser =
      {
        id_group: this.id_Group,
        id_vote: item.id_vote,
        avatar: this.Avatar,
        username: this.userCurrent,
        fullname: this.fullname
      }
      this.listMess[indexgr].Vote[indexvote].UserVote.push(ituser)
      // progressText.innerHTML=item.noidung;
      this.list_Vote.push(item);
      //let itemvote = this.Itemvote(this.list_Vote);
      // this.chatService.AddMemberVote(itemvote, "insert").subscribe(res => {
      //   if (res && res.status == 1) {
      //     this.messageService.UpdateVote(item.id_chat, item.id_group, item.id_vote, "insert", this.userCurrent, this.Avatar, this.fullname);
      //   }
      // })
    }
    else {
      this.list_Vote = []
      const progressdowload = document.getElementById("progress" + indexgr + indexvote);
      // const progressText = document.getElementById("progress-text"+bd+index);
      progressdowload.classList.remove('progressdown');
      this.listMess[indexgr].Vote[indexvote].lengthvote = item.lengthvote - 1;
      progressdowload.style.width = Math.floor((item.lengthvote - 1) / item.allmember * 100) + "%"

      let indexvt = this.listMess[indexgr].Vote[indexvote].UserVote.findIndex(x => x.id_vote == item.id_vote && x.username == this.userCurrent);
      this.listMess[indexgr].Vote[indexvote].UserVote.splice(indexvt, 1)
      // progressText.innerHTML="";
      this.list_Vote.push(item);
      // let indexremove=this.list_Vote.findIndex(x=>x.id_vote==item.id_vote)
      // this.list_Vote.splice(indexremove,1);
      this.changeDetectorRefs.detectChanges();
      //let itemvote = this.Itemvote(this.list_Vote);

      // this.chatService.AddMemberVote(itemvote, "remove").subscribe(res => {
      //   if (res && res.status == 1) {
      //     this.messageService.UpdateVote(item.id_chat, item.id_group, item.id_vote, "remove", this.userCurrent, this.Avatar, this.fullname);
      //   }
      // })
    }
  }
  LoadVote(item) {
    //
    var data = Object.assign({}, item);
    // var data = Object.assign({}, item);
    // const dialogRef = this.dialog.open(LoadVoteComponent, {
    //   // disableClose: true,
    //   data: data,
    //   height: 'auto',
    //   width: '550px',
    // });
    // dialogRef.afterClosed().subscribe((res) => {
    // 	if (res) {
    // 	} else {
    // 		return;
    // 	}
    // });
  }

  RecoveryMess() {
    // const _title = this.translate.instant('Khôi phục tin nhắn');
    // const _description = this.translate.instant('Bạn có muốn khôi phục không ?');
    // const _waitDesciption = this.translate.instant('Dữ liệu đang được khôi phục');
    // const _deleteMessage = this.translate.instant('Thành công !');
    // const _erroMessage = this.translate.instant('Lỗi không xác định!');
    // const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    // dialogRef.afterClosed().subscribe((res) => {
    //   if (!res) {
    //     return;
    //   }



    //   // xóa group user với nhau
    //   const sb = this.chatService.RecoveryMess(this.id_Group).subscribe((res) => {

    //     if (res && res.status === 1) {

    //       this.loadDataList();
    //       this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
    //     }
    //     this._subscriptions.push(sb);

    //   });
    // });
  }

  Previewall_Img(img) {
    // const dialogRef = this.dialog.open(PreviewAllimgComponent, {
    //   width: 'auto',
    //   panelClass: 'chat-bg-preview',
    //   data: img
    // }).afterClosed().subscribe(result => {

    //   // this.closeDilog(result);


    // });
  }



  DownUp() {
    this.isshowdouwn = false
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
    this.changeDetectorRefs.detectChanges();
  }

  EnCode() {
    // let dt = {
    //   IdGroup: this.id_Group,
    //   isEnCode: this.isEnCode

    // }
    // const dialogRef = this.dialog.open(EncodeChatComponent, {
    //   width: 'auto',
    //   data: dt
    // }).afterClosed().subscribe(result => {

    //   this.GetInforUserChatwith(this.id_Group)
    //   this.CheckEnCodeInConversation(this.id_Group)
    //   // this.closeDilog(result);



    // });
  }

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
    // this.chatService.ActionSticker(GrSticker, key).subscribe(res => {
    //   if (res) {
    //     let indexsticker = this.listStoreSticker.findIndex(x => x.GrSticker == GrSticker);
    //     if (indexsticker >= 0) {
    //       if (key == "insert") {
    //         this.listStoreSticker[indexsticker].check = true;
    //         // this.GetStoreSticker()
    //         this.QuanLyStoreSticker();
    //         this.GetminilistSticker()

    //       }
    //     }
    //     if (key == "remove") {
    //       let indexstickerremove = this.listQLStoreSticker.findIndex(x => x.GrSticker == GrSticker);
    //       this.listQLStoreSticker.splice(indexstickerremove, 1);

    //       this.GetStoreSticker();
    //       this.GetminilistSticker()
    //       this.QuanLyStoreSticker();
    //       this.changeDetectorRefs.detectChanges();
    //     }
    //   }
    // })
  }
  conditiontime: boolean = true;
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
    const data = this.auth.getAuthFromLocalStorage();

    var _token = data.access_token;
    let item = this.ItemMessengerSticker(UrlSticker);
    this.AttachFileChat = [];

    this.lstTagName = [];

    this.list_file = [];
    this.listFileChat = [];
    this.list_image = [];
    this.AttachFileChat = [];
    this.listReply = [];
    this.myFilesVideo = [];
    this.url = "";
    this.messageService.sendMessage(_token, item, this.id_Group).then((res) => {


      if (this.id_Chat) {

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
  Collapsedsticker() {
    this.isCollapsedsticker = !this.isCollapsedsticker;
    this.ShowTimeSticker();
    this.GetStoreSticker()
    this.QuanLyStoreSticker();
    this.GetminilistSticker();
  }

  private _scrollingUp = new Subject<number>();
  private _scrollingDown = new Subject<number>();

  countsendcomposing: number = 0
  formats = [
    'background',
    'bold',
    'color',
    'font',
    'code',
    'italic',
    'link',
    'size',
    'strike',
    'script',
    'mention',
    'underline',
    'blockquote',
    'header',
    'indent',
    'list',
    'align',
    'direction',
    'code-block',
    'formula',
    // 'image',
    // 'video'
  ];
  ischeckconnect: boolean = false
  selectedTab: number = 0;
  showstoresticker: boolean = false;
  selectedTabstore: number = 1;
  min: number = 1000;
  max: number = 2000;
  isDropup = true;
  KeyEnCode: string;
  parentCount = 0;
  listStickerTime: any[] = []
  cssfileuser: boolean;
  isEnCode: boolean;
  opensearch: boolean = false
  isshowdouwn: boolean = false
  searchText: string;
  messchecklink: string;
  Avatar: string;
  isloadingError: boolean = false
  themdark: boolean = false
  bgurl: any;
  listStoreSticker: any[] = []
  listQLStoreSticker: any[] = []
  imgopen: any[] = []
  imgall: any[] = []
  listSearch: any[] = []
  isCollapsed = true;

  listbgimg = [
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen1.jpg",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen2.jpg",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen3.jfif",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen4.jpg",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen5.jpg",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen6.jpg",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen8.jpg",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen9.jpg",

  ]
  draftmessage: any[] = [];
  tabs = ['Ảnh', 'File',];
  showbodyfile: boolean = false

  // draft:any[]=[]
  interval: any;
  intervalcheck: any;
  intervaldownload: any;
  loadingfilelarge: boolean = true
  progress: number;
  progressdown: number = 0;
  loadingchat: boolean = false
  pdfSrc: string = ""

  config = {
    wheelZoom: true,
  }
  id_attprocess: number
  filenameprocess: string;
  datadownload: any;
  // @ViewChild("imageViewer")
  // viewer: ImageViewerComponent;

  fullscreen: boolean = false;
  imageIndex: number = 0;

  colornav: boolean;
  // images = [
  //   'https://cdn.jee.vn/jee-chat/File/287337338_1067007664244632_5046690837796979134_n103033.jpg',
  // ]
  LstImagePanel: any[] = [];
  LstImagePanelTop9: any[] = [];
  LstPanelLink: any[] = [];
  LstAllPanelLink: any[] = [];
  Lstimg_bg: any[] = [];
  LstFilePanel: any[] = [];
  LstFilePanelTop4: any[] = [];
  loading_file: boolean = false;
  list_file_large: any[] = [];
  list_loading_image: any[] = [

    { id: 1 }, { id: 2 }
  ];
  list_loading_file: any[] = [];
  list_loading_video: any[] = [];
  allfile: boolean = false;
  allfileImage: boolean = false;
  thanhviennhomn: number;
  active_SeenMess: boolean = false;
  active_tagname: boolean = true;
  active_danhan: boolean = false;
  listtagname: any[] = [];
  isGroup: boolean = false;
  listReply: any[] = [];
  lstThamGia: any[] = [];
  tam: any[] = [];
  id_chat_notify: number;
  listTagGroupAll: any[] = [];
  _lstChatMessMoreDetail: any[] = [];
  public listChoseTagGroup: any[] = [];

  listInfor: any[] = [];
  list_reaction: any[] = [];
  isloading: boolean = false;

  @ViewChild('myFileInput') myFileInput;
  //@ViewChild('sideNav', { static: true }) sidenav: MatSidenav;
  //@ViewChild('myPopoverC', { static: true }) myPopover: PopoverContentComponent;
  acivepush: boolean = true;
  //@ViewChild('messageForm') messageForm: NgForm;
  messageContent: string;
  txttam: string = "";
  composingname: string;
  TenGroup: string;
  show: boolean = false;
  pageSize: number = 0;
  pageSizedetailbottom: number = 0;
  pageSizedetailtop: number = 4;
  lstChatMess: any[] = []
  lstTagName: any[] = []
  listMess: any[] = [];
  composing: boolean = false

  valtxt: string;

  Fullname: string;

  @Input() id_Chat: any;
  loading: boolean = false;

  list_file: any[] = [];
  AttachFileChat: any[] = [];
  AttachFileChatLage: any[] = [];
  listFileChat: any[] = [];
  active: boolean = false;
  listreaction: any[] = [];
  Avataruser: string;
  fullname: string;
  //   call video và  share creen
  peerIdShare: string;
  peerId: string;
  private lazyStream: any;
  currentPeer: any;
  private peerList: Array<any> = [];
  panelOpenState = false;
  customerID: number;
  list_Vote: any[] = [];
  currentDate = formatDate(new Date(), 'yyyy-MM-dd h:mm', 'en')

  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  private _subscriptions: Subscription[] = [];
  private _subscriptions_chat: Subscription[] = [];
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  getBottomImage() {
    if (this.listFileChat.length > 0) {
      return "150px";
    }
    return "100px"
  }


  // async onSelectFile_PDF(event) {


  //   for (let i = 0; i < event.target.files.length; i++) {
  //     let dt = {
  //       filename: event.target.files[i].name,
  //       size: event.target.files[i].size,
  //     }
  //     this.list_file_large.push(dt)
  //   }


  //   const data = this.auth.getAuthFromLocalStorage();
  //   // id_chat_notify
  //   var _token = data.access_token;
  //   let item = this.ItemMessengerFile();
  //   // this.messageService.sendMessage(_token, item, this.id_Group).then((res) => {
  //   //   this.list_file_large = []
  //   //   this.loadingfilelarge = true;
  //   // })

  //   await this.messageService.sendMessage(_token, item, this.TicKetID).then((res) => {
  //     this.list_file_large = []
  //     this.loadingfilelarge = true;
  //   })

  //   setTimeout(() => {


  //     this.progress = 0;
  //     this.interval = setInterval(() => {
  //       if (this.progress < 90) {
  //         this.progress = this.progress + 0.5;
  //         this.changeDetectorRefs.detectChanges();
  //       }

  //     }, 400);
  //     // this.list_file.push(event.target.files);
  //     let filesToUpload: File[] = event.target.files;

  //     const frmData = new FormData();
  //     Array.from(filesToUpload).map((file, index) => {

  //       return frmData.append('file' + index, file, file.name);
  //     });

  //     this.messageService.UploadfileLage(frmData, this.TicKetID, this.id_chat_notify).subscribe(

  //       {
  //         next: (event) => {
  //           if (event.type === HttpEventType.UploadProgress) {

  //             // this.progress = Math.round((100 / event.total) * event.loaded);
  //             // console.log("thisprogress",this.progress)


  //           }

  //           else if (event.type === HttpEventType.Response) {
  //             if (event.body) {
  //               this.loadingfilelarge = false;

  //               this.progress = 100;

  //               if (this.progress == 100) {
  //                 clearInterval(this.interval);
  //               }
  //               this.changeDetectorRefs.detectChanges();
  //               // alert("Upload thành công")

  //             }
  //           }
  //         },

  //       })
  //   }, 500);
  //   //  this.layoutUtilsService.showActionNotification('File quá lớn!', MessageType.Read, 3000, true, false, 3000, 'top', 0);

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






    setTimeout(() => {


      this.progress = 0;
      this.interval = setInterval(() => {
        if (this.progress < 90) {
          this.progress = this.progress + 0.5;
          this.changeDetectorRefs.detectChanges();
        }

      }, 400);
      // this.list_file.push(event.target.files);
      let filesToUpload: File[] = event.target.files;


      const frmData = new FormData();
      Array.from(filesToUpload).map((file, index) => {

        return frmData.append('file' + index, file, file.name);
      });

      this.messageService.UploadfileLage2(frmData, this.TicKetID).subscribe(

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
                this.loadData()
                this.changeDetectorRefs.detectChanges();
                // alert("Upload thành công")

              }
            }
          },

        })
    }, 500);
    //  this.layoutUtilsService.showActionNotification('File quá lớn!', MessageType.Read, 3000, true, false, 3000, 'top', 0);

    setTimeout(() => {
      event.srcElement.value = "";

    }, 1000);
  }
  getBottomVideo() {
    if (this.list_image.length > 0 && this.listFileChat.length > 0) {
      return "200px";
    }
    if (this.list_image.length > 0 || this.listFileChat.length > 0) {
      return "150px";
    }
    return "100px"
  }

  filterConfiguration(): any {
    const filter: any = {};
    // filter.search = this.search_yc;
    return filter;
  }
  innerHTMLDescription(description) {
    if (description) return description;
    else return '';
  }
}
