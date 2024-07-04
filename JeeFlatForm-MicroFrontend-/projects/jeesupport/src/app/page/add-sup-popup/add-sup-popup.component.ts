import { DatePipe } from "@angular/common";
import {
  ChangeDetectorRef,
  Component,
  HostListener,
  Inject,
  Input,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, of, ReplaySubject, Subscription } from "rxjs";
import { EditorChangeContent, EditorChangeSelection } from "ngx-quill";
import Quill from "quill";
import {
  AppListDTO,
  Category2,
  CategorySupport,
  ChooseUserDTO,
  People,
  TicKetActivityModel,
  TicketManagementDTO2,
  TicketManagementModel,
  TicketMessagesManagementModel,
  RequestPCManagementDTO,
  UserJeeAccountDTO,
} from "../_models/ticket-management.model";
import { ListStatusDTO } from "../_models/list-status-list-managament.model";
import { TicketRequestManagementService } from "../_services/ticket-request-management.service";
import { catchError, finalize, tap } from "rxjs/operators";
import { ActivatedRoute, Router } from "@angular/router";
import { MessageService } from "../_services/message.service";
import { AccessModel } from "../_models/access.model";
import { AuthService } from "../_services/auth.service";
import { LayoutUtilsService, MessageType } from "../../modules/crud/utils/layout-utils.service";
import { TranslationService } from "../../modules/i18n/translation.service";
import { locale as viLang } from 'projects/jeesupport/src/app/modules/i18n/vocabs/vi'


@Component({
  selector: "app-add-sup-popup",
  templateUrl: "./add-sup-popup.component.html",
  styleUrls: ["./add-sup-popup.component.scss"],

})
export class AddSupPopupComponent implements OnInit {
  Message: string;
  activity: TicKetActivityModel = new TicKetActivityModel();
  ticket_currentID: number;
  blurred = false;
  focused = false;
  listAccount: any[] = [];
  item_ticket: TicketManagementDTO2;
  // item_cate: Category2;
  istUser: any[] = [];
  options: any = {};
  selectedUser: ChooseUserDTO[] = [];
  selectedEmployee: ChooseUserDTO[] = [];
  TicKetID: number;
  mess: string;

  // selectCategory2: number = 0;
  selectCategory2: string = "";

  status: ListStatusDTO[] = [];
  listApp: AppListDTO[] = [];
  CompanyCode: string;
  imgFile = "../assets/media/Img/NoImage.jpg";
  // ngx-mat-search area
  userJeeAccount: UserJeeAccountDTO[] = [];
  listChooseUser: ChooseUserDTO[] = [];
  cbbCategory2: CategorySupport[];
  filterGroup: FormGroup;
  dataAccess: AccessModel;
  filterStatus: ReplaySubject<ListStatusDTO[]> = new ReplaySubject<
    ListStatusDTO[]
  >();

  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _errorMessage$ = new BehaviorSubject<string>("");
  private subscriptions: Subscription[] = [];
  public isLoadingSubmit$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this.errorMessage$.asObservable();
  }

  Title: string;
  Note: string;

  ticketPcDTO: RequestPCManagementDTO;
  @ViewChild("messageForm") messageForm: NgForm;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddSupPopupComponent>,
    private fb: FormBuilder,
    public TicketRequestManagementService: TicketRequestManagementService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public datepipe: DatePipe,
    private translateService: TranslationService,
    private translate: TranslateService,
    public auth: AuthService,
    private activatedRoute: ActivatedRoute,
    public messageService: MessageService,
    private router: Router
  )
  {
    this.translateService.loadTranslations(
      viLang,
    );
    var langcode = localStorage.getItem('language');
    if (langcode == null)
      langcode = this.translate.getDefaultLang();
    this.translateService.setLanguage(langcode);
  }
  ngOnInit(): void {
    // this.TicketRequestManagementService.getCategory2().subscribe(res => {

    //   this.cbbCategory2 = res.data;
    //   this.changeDetect.detectChanges();
    // });
    this.TicketRequestManagementService.getCategorySupport().subscribe(
      (res) => {
        this.cbbCategory2 = res.data;
        this.changeDetect.detectChanges();
      }
    );

    // this.loadStatus();
    this.loadUserJeeAccount();
  }

  ChangeStage(val) {
    this.selectCategory2 = val;
    this.TicketRequestManagementService.getCategory2ByRowID(val).subscribe(
      (res) => {
        // this.item_cate = Object.assign({}, ...res.data);
        this.changeDetect.detectChanges();
      }
    );
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

  loadUserJeeAccount() {
    const sb5 = this.TicketRequestManagementService.list_account()
      .pipe(
        tap((res) => {
          this.userJeeAccount = [...res.data];
          //console.log('User jeeaccount nhan duoc',this.userJeeAccount);
          //Load du lieu cho selected khi thuc hien edit
          if (this.item_ticket.RowID > 0) {
            this.userJeeAccount.forEach((element) => {
              if (element.userid == this.item_ticket.User.userid) {
                var chooseUser = new ChooseUserDTO();
                chooseUser.hoten = element.fullname;
                chooseUser.image = element.image;
                chooseUser.tenchucdanh = element.tenchucdanh;
                chooseUser.userid = element.userid;
                chooseUser.username = element.username;
                this.selectedUser.push(chooseUser);
              }
              this.item_ticket.Agent.forEach((agent) => {
                if (element.userid == agent.userid) {
                  var chooseEmployee = new ChooseUserDTO();
                  chooseEmployee.hoten = element.fullname;
                  chooseEmployee.image = element.image;
                  chooseEmployee.tenchucdanh = element.tenchucdanh;
                  chooseEmployee.userid = element.userid;
                  chooseEmployee.username = element.username;
                  this.selectedEmployee.push(chooseEmployee);
                }
              });
            });
          }
          //end
          this.listChooseUser = this.ReturnDataForChooseUser(
            this.userJeeAccount
          );
          this.options = this.getOptions();
        }),
        finalize(() => {
          this._isFirstLoading$.next(false);
          this._isLoading$.next(false);
        }),
        catchError((err) => {
          console.log(err);
          this._errorMessage$.next(err);
          return of();
        })
      )
      .subscribe();
    this.subscriptions.push(sb5);
  }
  getKeyword() {
    // let i = this.ListFollower.lastIndexOf('@');
    // if (i >= 0) {
    // 	let temp = this.ListFollower.slice(i);
    // 	if (temp.includes(' '))
    // 		return '';
    // 	return this.ListFollower.slice(i);
    // }
    return "";
  }
  getOptions() {
    var options: any = {
      showSearch: true,
      keyword: this.getKeyword(),
      data: this.listChooseUser,
    };
    return options;
  }
  // loadStatus() {
  //   console.log('chay load status');
  //   const sb20 = this.liteService
  //     .list_status()
  //     .pipe(
  //       tap((res) => {
  //         this.status = [...res.data];
  //         this.filterStatus.next([...res.data]);
  //         this.itemForm.controls.StatusFilterCtrl.valueChanges.subscribe(() => {
  //           this.profilterStatus();
  //         });
  //       }),
  //       finalize(() => {
  //         this._isFirstLoading$.next(false);
  //         this._isLoading$.next(false);
  //       }),
  //       catchError((err) => {
  //         console.log(err);
  //         this._errorMessage$.next(err);
  //         return of();
  //       })
  //     )
  //     .subscribe();
  //   this.subscriptions.push(sb20);
  // }

  // protected profilterStatus() {
  //   if (!this.itemForm.controls.Status) {
  //     return;
  //   }
  //   let search = this.itemForm.controls.StatusFilterCtrl.value;
  //   if (!search) {
  //     this.filterStatus.next([...this.status]);
  //     return;
  //   } else {
  //     search = search.toLowerCase();
  //   }
  //   this.filterStatus.next(
  //     this.status.filter(
  //       (item) => item.Title.toLowerCase().indexOf(search) > -1
  //     )
  //   );
  // }

  getTitle() {
    if (this.item_ticket.RowID > 0) {
      return this.translateService.instant("TICKETMANAGEMENT.SUADOIYEUCAU");
    }
    return this.translateService.instant("TICKETMANAGEMENT.THEMMOIYEUCAU");
  }
  setDataTicKetActivity(rowid: number) {
    this.activity.TicketID = rowid;
    this.activity.ActionType = 0;
    this.activity.ActionText = "đã tạo Ticket";
  }

  prepareDataFromFB(): any {
    const ticket = new TicketManagementModel();
    // this.TicketRequestManagementService.getAccess().subscribe((res) => {
    //   if (res) {
    //     this.dataAccess = res;

    //   }
    // });

    ticket.AppID = this.translateService.instant("ACCESS.APPID");
    ticket.AppKey = this.translateService.instant("ACCESS.APPKEY");
    ticket.Title = this.Title;
    ticket.Description=this.Note;
    // if (this.selectCategory2 != 0) {
    //   ticket.CategoryID = this.selectCategory2;
    // }
    if (this.selectCategory2 != "") {
      ticket.MappingCode = this.selectCategory2;
    }
    ticket.Attachments = this.AttFile;
    ticket.SourceType = 1;
    const data = this.auth.getAuthFromLocalStorage();

    var _userID = data.user.customData["jee-account"].userID;
    var customerID = data.user.customData["jee-account"].customerID;
    // ticket.CustomerID = this.translateService.instant("ACCESS.CUSTOMERID");
    ticket.CustomerID = customerID;
    ticket.SenderID = _userID;
    return ticket;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  GetStringID(listUser: ChooseUserDTO[]) {
    var result = "";
    listUser.forEach((element) => {
      result = result + element.userid + ",";
    });
    result = result.slice(0, -1);
    return result;
  }

  // update(ticketModel: TicketManagementModel) {
  //   const _title = this.translateService.instant("POPUPEDIT.TITLE");
  //   const _description = this.translateService.instant("POPUPEDIT.DESCRIPTION");
  //   const _waitDesciption = this.translateService.instant(
  //     "POPUPEDIT.WAITDESCRIPTION"
  //   );
  //   const popup = this.layoutUtilsService.deleteElement(
  //     _title,
  //     _description,
  //     _waitDesciption
  //   );
  //   popup.afterClosed().subscribe((res) => {
  //     if (res) {
  //       this.dialogRef.close();
  //       // thuc hien them
  //       this.isLoadingSubmit$.next(true);
  //       this.ticketManagementService.updateTicket(ticketModel).subscribe(
  //         (res) => {
  //           this.isLoadingSubmit$.next(false);
  //           this.dialogRef.close(res);
  //         },
  //         (error) => {
  //           this.isLoadingSubmit$.next(false);
  //           this.layoutUtilsService.showActionNotification(
  //             error.error.message,
  //             MessageType.Read,
  //             999999999,
  //             true,
  //             false,
  //             3000,
  //             "top",
  //             0
  //           );
  //         }
  //       );
  //     } else undefined;
  //   });
  // }
  ItemMessenger(rowid: number): TicketMessagesManagementModel {
    const item = new TicketMessagesManagementModel();
    item.IsResponse = false;
    item.Message = this.Message;
    item.TicketID = rowid;
    item.AppID = this.translateService.instant("ACCESS.APPID");
    item.AppKey = this.translateService.instant("ACCESS.APPKEY");
    item.CustomerID = this.translateService.instant("ACCESS.CUSTOMERID");
    return item;
  }

  sendMessageeeee(rowid: number) {
    let item = this.ItemMessenger(rowid);

    const data = this.auth.getAuthFromLocalStorage();
    var _token = data.access_token;
    this.TicketRequestManagementService.createMessageThirdParyApp(
      item
    ).subscribe((data) => {});
    //this.messageService.sendMessage(_token, item, rowid);
    this.messageForm.reset();
  }

  onSubmit(withBack: boolean) {
    if (this.Title) {
      if (this.selectCategory2 != "") {
        if (this.Message) {
          const ticket = this.prepareDataFromFB();
          this.create(ticket, withBack);
        } else {
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
      } else {
        this.layoutUtilsService.showActionNotification(
          "Bắt buộc chọn loại yêu cầu",
          MessageType.Read,
          999999999,
          true,
          false,
          3000,
          "top",
          0
        );
      }
    } else {
      this.layoutUtilsService.showActionNotification(
        "Tiêu đề không được bỏ trống",
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

  create(ticketModel: TicketManagementModel, withBack: boolean = false) {
    this.isLoadingSubmit$.next(true);
    const sb = this.TicketRequestManagementService.createTicketThirdParyApp(
      ticketModel
    )
      .pipe(
        tap((res) => {
          if (res.status == 1) {
            this.TicketRequestManagementService.getIdCurren(
              "Tickets"
            ).subscribe((res) => {
              this.ticket_currentID = res.data;
              this.messageService.connectToken(this.ticket_currentID, this.translateService.instant("ACCESS.CUSTOMERID"));
              setTimeout(() => {
                this.sendMessageeeee(this.ticket_currentID);
              }, 1000);
              this.setDataTicKetActivity(this.ticket_currentID);
              this.TicketRequestManagementService.CreateTicketActivityManagement(
                this.activity
              ).subscribe((res) => {
                this.TicketRequestManagementService.send$.next('Load');
              });
              this.TicketRequestManagementService.GetListTicketByRequest(0);
            });
          }
          this.isLoadingSubmit$.next(false);
          if (withBack) {
            setTimeout(() => {
              this.dialogRef.close(res);
              this.AnnounceAddSuccess();
            }, 1100);
          } else {
            this.AnnounceAddSuccess();
            this.reset_data();
          }
        })
      )
      .subscribe(
        () => {},
        (error) => {
          this.layoutUtilsService.showActionNotification(
            error.error.message,
            MessageType.Read,
            999999999,
            true,
            false,
            3000,
            "top",
            0
          );
          console.log(error);
          this.isLoadingSubmit$.next(false);
          this._errorMessage$.next(error);
        }
      );
    this.subscriptions.push(sb);
  }

  AnnounceAddSuccess(){
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
  }

  i: number = 0;
  reset_data() {
    setTimeout(() => {
      this.Message = "";
      this.Title = "";
      this.Note="";
      // this.AttFile=[];
      for (this.i; this.i < this.AttFile.length; this.i++) {
        this.AttFile.pop();
      }
    }, 1500);
  }

  onScroll(event) {
    let _el = event.srcElement;
    if (_el.scrollTop + _el.clientHeight > _el.scrollHeight * 0.95) {
      // this.loadDataList_Lazy();
    }
  }

  format_date(value: any, args?: any): any {
    let latest_date = this.datepipe.transform(value, "dd/MM/yyyy");
    return latest_date;
  }

  checkDataBeforeClose(): boolean {
    const model = this.prepareDataFromFB();
    if (!this.item_ticket.RowID) {
      const empty = new TicketManagementModel();
      empty.clear();
      return this.TicketRequestManagementService.isEqual(empty, model);
    }
    //danh cho sua
    return this.CompareDataModelAndDTO(model, this.item_ticket);
  }

  CompareDataModelAndDTO(
    model: TicketManagementModel,
    item: TicketManagementDTO2
  ): boolean {
    var arrayAgentModel = model.AgentID.sort();
    var arrayAgentDTO: number[] = [];
    item.Agent.forEach((agent) => {
      arrayAgentDTO.push(agent.userid);
    });
    arrayAgentDTO = arrayAgentDTO.sort();
    var con1 = this.TicketRequestManagementService.isEqual(
      arrayAgentDTO,
      arrayAgentModel
    );
    var con2 = this.TicketRequestManagementService.isEqual(
      model.RowID,
      item.RowID
    );
    var con3 = model.SourceType == item.SourceType ? true : false;
    var con4 = model.Status == item.Status.RowID ? true : false;
    var con5 = this.TicketRequestManagementService.isEqual(
      model.Title,
      item.Title
    );
    var con6 = model.UserID == item.User.userid ? true : false;
    if (con1 && con2 && con3 && con4 && con5 && con6) return true;
    return false;
  }

  ReturnDataForChooseUser(data: UserJeeAccountDTO[]) {
    var listChooseUser: ChooseUserDTO[] = [];
    data.forEach((user) => {
      var chooseUser = new ChooseUserDTO();
      chooseUser.userid = user.userid;
      chooseUser.username = user.username;
      chooseUser.image = user.image;
      chooseUser.hoten = user.fullname;
      chooseUser.tenchucdanh = user.tenchucdanh;
      listChooseUser.push(chooseUser);
    });
    return listChooseUser;
  }
  MapPeopleFromChooseUser(data: ChooseUserDTO) {
    var people: People;
    people.userid = data.userid;
    people.username = data.username;
    people.fullname = data.hoten;
    people.image = data.image;
    people.tenchucdanh = data.tenchucdanh;
    return people;
  }
  GetArrayNumberFromArrayChooseUser(data: ChooseUserDTO[]) {
    var arrayNum: number[] = [];
    data.forEach((user) => {
      arrayNum.push(user.userid);
    });
    return arrayNum;
  }

  SelectedUser(data: any) {
    //Mac du truyen ChooUserDTO nhung lai nhan duoc gia tri cua UserJeeAccount nen cho nay phai chinh lai
    if (this.selectedUser.length > 0) {
      this.selectedUser.pop();
    }
    //this.selectedUser = this.selectedUser.filter(item => item.userid != data.userid);
    var chooUser = new ChooseUserDTO();
    chooUser.hoten = data.fullname;
    chooUser.image = data.image;
    chooUser.tenchucdanh = data.tenchucdanh;
    chooUser.userid = data.userid;
    chooUser.username = data.username;
    this.selectedUser.push(chooUser);
  }
  DeletedUser(data: ChooseUserDTO) {
    this.selectedUser = this.selectedUser.filter(
      (item) => item.userid != data.userid
    );
  }
  SelectedEmployee(data: any) {
    //Mac du truyen ChooUserDTO nhung lai nhan duoc gia tri cua UserJeeAccount
    this.selectedEmployee = this.selectedEmployee.filter(
      (item) => item.userid != data.userid
    );
    var chooUser = new ChooseUserDTO();
    chooUser.hoten = data.fullname;
    chooUser.image = data.image;
    chooUser.tenchucdanh = data.tenchucdanh;
    chooUser.userid = data.userid;
    chooUser.username = data.username;
    this.selectedEmployee.push(chooUser);
  }
  DeletedEmployee(data: ChooseUserDTO) {
    this.selectedEmployee = this.selectedEmployee.filter(
      (item) => item.userid != data.userid
    );
  }
  IsSearch(event) {
    event.stopPropagation();
  }
  ClearSelected() {
    this.selectedUser.pop();
    this.selectedEmployee = [];
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
  ListSourceType: any[] = [
    { id: 0, name: "Từ người dùng" },
    { id: 1, name: "Từ app trong thirdparty app" },
  ];
  @HostListener("window:beforeunload", ["$event"])
  beforeunloadHandler(e) {
    if (!this.checkDataBeforeClose()) {
      e.preventDefault(); //for Firefox
      return (e.returnValue = ""); //for Chorme
    }
  }
  @HostListener("keydown", ["$event"])
  onKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && e.ctrlKey) {
      // Do nothing
      this.onSubmit(false);
    }
  }

  ///

  created(event: Quill) {
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
  changedEditor(event: EditorChangeContent | EditorChangeSelection) {
    // tslint:disable-next-line:no-console
    this.changeDetect.detectChanges();
  }

  goBack() {
    this.dialogRef.close(false);
  }
  //====================Dự án====================

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

  item: any = [];

  preview(data: any) {}
  DownloadFile(data: any) {}
  CheckClosedTask() {
    if (this.item.closed) {
      return false;
    } else {
      return true;
    }
  }
  Delete_File(data: any) {}
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
          typefile != "png"
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
        this.UploadFileForm(evt);
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
  deleteFile(file: any) {
    this.AttFile.splice(file, 1);
    this.myInput.nativeElement.value = "";
    this.changeDetect.detectChanges();
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
    return icon;
  }

  getHeight() {
    let height = 0;
    height = window.innerHeight - 250;
    return height + "px";
  }

}
