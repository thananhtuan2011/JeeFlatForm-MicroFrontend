import { find } from "lodash";
import { DatePipe } from "@angular/common";
import { HttpClient, HttpParams } from "@angular/common/http";
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { LayoutUtilsService, MessageType } from 'projects/jeemeeting/src/modules/crud/utils/layout-utils.service';
import { CuocHopModel, TaiSanModel } from "../../_models/DuLieuCuocHop.model";
import { DangKyCuocHopService } from "../../_services/dang-ky-cuoc-hop.service";
import { MeetingStore } from "../../_services/meeting.store";
import { StateService } from "../../_services/state.service";
import { JeeChooseMemberComponent } from "../jee-choose-member/jee-choose-member.component";
import * as moment from "moment";
import { environment } from "projects/jeemeeting/src/environments/environment";

@Component({
  selector: "app-tao-cuoc-hop-dialog",
  templateUrl: "./tao-cuoc-hop-dialog.component.html",
  styleUrls: ["./tao-cuoc-hop-dialog.component.scss"],
})
export class TaoCuocHopDialogComponent implements OnInit, AfterViewInit {
  formControls: FormGroup;
  CuocHop: CuocHopModel;
  NgayBatDau: any;
  GioBatDau: string = "00:00"
  GioKetThuc: string = "00:00"

  tuGio: any[] = [];
  denGio: any[] = [];
  disabledBtn: boolean = false;
  showlienket: boolean = false;
  showreset: boolean = false;
  checkedZoom: boolean = false;
  checkedWebex: boolean = false;
  checkedGoogle: boolean = false;
  checkedTeams: boolean = false;
  selectedTeams: boolean = false;
  selectedZoom: boolean = false;
  selectedGoogle: boolean = false;
  selectedWebex: boolean = false;
  selectedOther: boolean = false;
  checkedOther: boolean = false;

  TaiSan: TaiSanModel;
  TaiSanKhac: TaiSanModel;
  listValues: any[] = [];

  listKey: any[] = [];
  listKeyGoogle: any[] = [];

  listKeyTeams: any[] = [];

  flagMeeting: number;
  currentCheckedValue = null;

  listNguoiThamGia: any[] = [];
  listNguoiTheoDoi: any[] = [];
  listNguoiTomTat: any[] = [];

  clickNhapTomTat: boolean = false;

  idpg: number = 0; //id phòng google
  idpt: number = 0; // id phòng teams
  idpw: number = 0; // id phong webex
  idpz: number = 0; //  id phòng zoom
  clientId: string = '0wYSyTBbRlmPwKqXpfw6A';
  clientSecret: string;
  scopes: string = 'meeting:write user:write:admin user:write';
  scopesGoogle: string = 'https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar'
  clientId2: string;
  clientSecret2: string;
  scopes2: string;
  Email: string = ""
  Token: string = ""
  UserID: number;
  thongtinphonghop: string = ""

  type: string
  isLoad: boolean = false
  //====================Từ Giờ====================
  public bankTuGio: FormControl = new FormControl();
  public filteredBanksTuGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  //====================Đến giờ====================
  public bankDenGio: FormControl = new FormControl();
  public filteredBanksDenGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );
  listTaiSan: any[];
  @ViewChild("focusInput", { static: true }) focusInput: ElementRef;
  constructor(
    public dialogRef: MatDialogRef<TaoCuocHopDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private dangKyCuocHopService: DangKyCuocHopService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private stateService: StateService,
    private layoutUtilsService: LayoutUtilsService,
    private ren: Renderer2,
    private http: HttpClient,
    private cookieService: CookieService,
    private activatedRoute: ActivatedRoute,
    private itemFB: FormBuilder
  ) {
    this.UserID = Number(localStorage.getItem('staffID'))
  }
  ngAfterViewInit() {
    if (this.CuocHop.RowID == 0) {
      let currentdate = new Date();
      let minutes = currentdate.getMinutes();

      let phut;
      if (minutes % 5 == 0) {
        if (minutes == 60) {
          this.GioBatDau = ("0" + currentdate.getHours() + 1).slice(-2) + ":" + "00";
        } else {
          if (minutes < 10) {
            this.GioBatDau = ("0" + currentdate.getHours()).slice(-2) + ":" + "0" + minutes;
          } else {
            this.GioBatDau = ("0" + currentdate.getHours()).slice(-2) + ":" + minutes;
          }
        }
      } else {
        do {
          minutes = minutes + 1;
          if (minutes % 5 == 0) {
            phut = minutes;
          }
        } while (minutes % 5 !== 0);
        if (phut < 10) {
          phut = "0" + phut;
        }
        if (phut == 60) {
          this.GioBatDau = ("0" + currentdate.getHours() + 1).slice(-2) + ":" + 0;
        } else {
          this.GioBatDau = ("0" + currentdate.getHours()).slice(-2) + ":" + phut;
        }
      }
      this.GioKetThuc = moment(this.GioBatDau, "HH:mm").add({
        hours: 0,
        minutes: 30
      }).format("HH:mm");
      this.NgayBatDau = new Date();
      this.formControls.controls["thoigiandate"].setValue(this.NgayBatDau + "");
    }
    if (this.data != undefined) {
      if (this.data.listThamGia.length > 0) {
        this.listNguoiThamGia = this.data.listThamGia
        this.changeDetectorRefs.detectChanges();
      }
      if (this.data.type != undefined) {
        this.type = this.data.type
      }
    }
  }
  /** LOAD DATA */
  ngOnInit() {
    debugger
    this.CuocHop = new CuocHopModel();
    if (this.data != undefined) {
      if (this.data._item != null && this.data._item != undefined) {
        this.CuocHop = this.data._item;
      } else {
        this.CuocHop.clear();
      }
    } else {
      this.CuocHop.clear();
    }

    this.listTaiSan = [
      {
        name: "Phòng họp",
        taisan: [],
      },
      {
        name: "Tài sản",
        taisan: [],
      },
    ];
    this.dangKyCuocHopService.GetListPhongHop(1).subscribe((res) => {
      if (res.data.length > 0) {
        let Data_ts = [];
        res.data.forEach((element) => {
          let _field = {
            value: element.RowID,
            viewValue: element.Title,
          };
          Data_ts.push(_field);
        });
        this.listTaiSan[0].taisan = Data_ts;
        this.dangKyCuocHopService.GetListPhongHop(2).subscribe((res) => {
          if (res.data.length > 0) {
            let Data_ts = [];
            res.data.forEach((element) => {
              let _field = {
                value: element.RowID,
                viewValue: element.Title,
              };
              Data_ts.push(_field);
            });
            this.listTaiSan[1].taisan = Data_ts;
          }
        });
      }
    });
    //Lấy key cấu hình google
    // this.dangKyCuocHopService.getKeyGoogle().subscribe((res: any) => {
    //   if (res && res.status == 1) {
    //     this.clientId = res.data[0].clientId;
    //     this.clientSecret = res.data[0].clientSecret;
    //     this.scopes = res.data[0].scopes;
    //   }
    // });
    //lấy key cấu hình microsoft team
    // this.dangKyCuocHopService.getMS().subscribe((res: any) => {
    //   if (res && res.status == 1) {
    //     this.clientId2 = res.data[0].clientId;
    //     this.clientSecret2 = res.data[0].clientSecret;
    //     this.scopes2 = res.data[0].scopes;
    //   }
    // });
    //lấy danh sách phòng zoom (Dropdown)
    this.dangKyCuocHopService.ListKey().subscribe((res) => {
      this.listKey = res.data;
      this.idpz = res.data[0].Id
      this.formControls.controls["IDPhongHop"].setValue(this.idpz + "")
      this.changeDetectorRefs.detectChanges();
    });
    // //lấy danh sách phòng họp google (Dropdown)
    // this.dangKyCuocHopService.ListKeyGoogle().subscribe((res) => {
    //   this.listKeyGoogle = res.data;
    //   this.idpg = res.data[0].Id; // vì có 1 phòng cá nhân nên lấy luôn cái đầu tiên
    //   this.changeDetectorRefs.detectChanges();
    // });
    // //lấy danh sách phòng họp microsoft team (Dropdown)
    // this.dangKyCuocHopService.ListKeyTeams().subscribe((res) => {
    //   this.listKeyTeams = res.data;
    //   this.idpt = res.data[0].Id; // vì có 1 phòng cá nhân nên lấy luôn cái đầu tiên
    //   this.changeDetectorRefs.detectChanges();
    // });
    this.focusInput.nativeElement.focus();

    this.createForm();

    this.dangKyCuocHopService.Get_GioDatPhongHop("").subscribe((res) => {
      this.tuGio = res.data;
      this.denGio = res.data;
      this.setUpDropSearchTuGio();
      this.setUpDropSearchDenGio();
    });
  }

  createForm() {
    this.formControls = this.itemFB.group({
      TenCuocHop: new FormControl(
        "" + this.CuocHop.TenCuocHop,
        Validators.required
      ),
      thoigiandate: new FormControl('' + this.CuocHop.thoigiandate, Validators.required),
      thoigianbatdau: new FormControl('' + this.CuocHop.thoigiantime, Validators.required),
      thoigianketthuc: new FormControl('' + moment(this.GioBatDau, "HH:mm").add({
        hours: 0,
        minutes: Number(this.CuocHop.thoigianminute)
      }).format("HH:mm"), Validators.required),
      XacNhanThamGia: new FormControl(this.CuocHop.XacNhanThamGia),
      NhapTomTat: new FormControl(this.CuocHop.NhapTomTat),
      GhiChu: new FormControl("" + this.CuocHop.GhiChu),
      IDPhongHop: new FormControl("" + this.CuocHop.IDPhongHop ? this.CuocHop.IDPhongHop : this.idpz),
      IDPhongHopGoogle: new FormControl("" + this.idpg),
      IDPhongHopTeams: new FormControl("" + this.idpt),
      taisan: new FormControl(""),
      linkHopNgoai: new FormControl("" + this.CuocHop.Link),
    });
    this.idpz = this.CuocHop.IDPhongHop

    this.formControls.controls["TenCuocHop"].markAsTouched();
    this.formControls.controls["thoigiandate"].markAsTouched();
    this.formControls.controls["thoigianbatdau"].markAsTouched();
    this.formControls.controls["thoigianketthuc"].markAsTouched();
    this.listNguoiThamGia = this.CuocHop.ListThamGia;
    this.listNguoiTheoDoi = this.CuocHop.ListTheoDoi;
    this.listNguoiTomTat = this.CuocHop.ListTomTat;
    if (this.CuocHop.RowID != 0) {
      this.NgayBatDau = '' + this.CuocHop.thoigiandate
      this.formControls.controls["thoigiandate"].setValue(this.NgayBatDau + "");
      this.GioBatDau = '' + this.CuocHop.thoigiantime
      this.GioKetThuc = '' + moment(this.GioBatDau, "HH:mm").add({
        hours: 0,
        minutes: Number(this.CuocHop.thoigianminute)
      }).format("HH:mm")

      //for danh sách tài sản
      if (this.CuocHop.PhongHopDangKy) {
        let data = [];
        this.thongtinphonghop =
          this.CuocHop.PhongHopDangKy.TenPhong +
          ", " +
          this.LayThu(
            this.convertDate(this.CuocHop.PhongHopDangKy.BookingDate)
          ) +
          " " +
          this.f_convertDate(
            this.convertDate(this.CuocHop.PhongHopDangKy.BookingDate)
          ) +
          ", " +
          this.CuocHop.PhongHopDangKy.FromTime +
          " - " +
          this.CuocHop.PhongHopDangKy.ToTime;
        if (this.CuocHop.PhongHopDangKy) {
          this.CuocHop.TaiSanKhac.forEach((element) => {
            data.push(element.RoomID);
          });
          this.listValues = this.CuocHop.TaiSanKhac;
        }
        this.TaiSan = new TaiSanModel();
        this.TaiSan.RoomID = this.CuocHop.PhongHopDangKy.RoomID;
        this.TaiSan.IdPhieu = this.CuocHop.PhongHopDangKy.IdPhieu;
        this.TaiSan.BookingDate = this.CuocHop.PhongHopDangKy.BookingDate;
        this.TaiSan.FromTime = this.CuocHop.PhongHopDangKy.FromTime;
        this.TaiSan.ToTime = this.CuocHop.PhongHopDangKy.ToTime;
        this.TaiSan.MeetingContent = this.CuocHop.PhongHopDangKy.MeetingContent;
        this.TaiSan.TenPhong = this.CuocHop.PhongHopDangKy.TenPhong;
        this.TaiSan.DiaDiem = this.thongtinphonghop;

        data.push(this.CuocHop.PhongHopDangKy.RoomID);
        this.formControls.controls["taisan"].setValue(data);
      }
      this.loadFlagMeeting(this.CuocHop.ZoomMeeting, this.CuocHop.GoogleMeeting, this.CuocHop.WebexMeeting, this.CuocHop.TeamsMeeting, this.CuocHop.OtherMeeting)

    }
    this.hideShowRooms();
    if (this.CuocHop.ZoomMeeting) {
      this.checkedZoom = true;
      this.selectedZoom = true;
    } else if (this.CuocHop.GoogleMeeting) {
      this.checkedGoogle = true;
      this.selectedGoogle = true;
    } else if (this.CuocHop.WebexMeeting) {
      this.checkedWebex = true;
      this.selectedWebex = true;
    } else if (this.CuocHop.TeamsMeeting) {
      this.selectedTeams = true;
      this.checkedTeams = true;
    } else if (this.CuocHop.OtherMeeting) {
      this.selectedOther = true;
      this.checkedOther = true;
    }
  }

  reset() {
    this.formControls = this.itemFB.group({
      TenCuocHop: new FormControl("", Validators.required),
      thoigiandate: new FormControl(new Date(), Validators.required),
      thoigianbatdau: new FormControl(
        "",
        Validators.required
      ),
      thoigianketthuc: new FormControl(
        "",
        Validators.required
      ),
      XacNhanThamGia: new FormControl(false),
      NhapTomTat: new FormControl(false),
      GhiChu: new FormControl(""),
      IDPhongHop: new FormControl(""),
      IDPhongHopGoogle: new FormControl("" + this.idpg),
      IDPhongHopTeams: new FormControl("" + this.idpt),
      taisan: new FormControl(""),
      linkHopNgoai: new FormControl(""),
    });
    this.formControls.controls["TenCuocHop"].markAsTouched();
    this.formControls.controls["thoigiandate"].markAsTouched();
    this.formControls.controls["thoigianbatdau"].markAsTouched();
    this.formControls.controls["thoigianketthuc"].markAsTouched();
    let currentdate = new Date();
    let minutes = currentdate.getMinutes();

    let phut;
    if (minutes % 5 == 0) {
      if (minutes == 60) {
        this.GioBatDau = ("0" + currentdate.getHours() + 1).slice(-2) + ":" + "00";
      } else {
        if (minutes < 10) {
          this.GioBatDau = ("0" + currentdate.getHours()).slice(-2) + ":" + "0" + minutes;
        } else {
          this.GioBatDau = ("0" + currentdate.getHours()).slice(-2) + ":" + minutes;
        }
      }
    } else {
      do {
        minutes = minutes + 1;
        if (minutes % 5 == 0) {
          phut = minutes;
        }
      } while (minutes % 5 !== 0);
      if (phut < 10) {
        phut = "0" + phut;
      }
      if (phut == 60) {
        this.GioBatDau = ("0" + currentdate.getHours() + 1).slice(-2) + ":" + 0;
      } else {
        this.GioBatDau = ("0" + currentdate.getHours()).slice(-2) + ":" + phut;
      }
    }
    this.GioKetThuc = moment(this.GioBatDau, "HH:mm").add({
      hours: 0,
      minutes: 30
    }).format("HH:mm");
    this.NgayBatDau = new Date();
    this.formControls.controls["thoigiandate"].setValue(this.NgayBatDau + "");
    this.listNguoiThamGia = [];
    this.listNguoiTheoDoi = [];
    this.listNguoiTomTat = [];
    this.hideShowRooms();
    this.clickNhapTomTat = false;
  }
  //kiểm tra trạng thái hiện tại để gắn flag khi tạo hoặc chỉnh sửa
  loadFlagMeeting(el, el2, el3, el4, el5) {
    if (el == true) {
      this.flagMeeting = 1;
      this.currentCheckedValue = "1"
      this.BindListZoom(this.idpz)
    }

    if (el2 == true) {
      this.flagMeeting = 2;
      this.currentCheckedValue = "2"
      this.BindList(1)
    }

    if (el3 == true) {
      this.flagMeeting = 3;
      this.currentCheckedValue = "3"
      this.BindList(2)
    }

    if (el4 == true) {
      this.flagMeeting = 4;
      this.currentCheckedValue = "4"
      this.BindList(3)
    }

    if (el5 == true) {
      this.flagMeeting = 5;
      this.currentCheckedValue = "5"
    }
  }
  hideShowRooms() {
    this.checkedGoogle = false;
    this.checkedZoom = false;
    this.checkedWebex = false;
    this.selectedZoom = false;
    this.selectedGoogle = false;
    this.selectedTeams = false;
    this.checkedTeams = false;
    this.selectedWebex = false;
    this.selectedOther = false;
    this.checkedOther = false;
  }
  getTitle() {
    if (this.CuocHop.RowID == 0) {
      return "Tạo cuộc họp";
    } else {
      return "Chỉnh sửa cuộc họp";
    }
  }
  //============ Begin - Từ giờ =============
  setUpDropSearchTuGio() {
    this.bankTuGio.setValue("");
    this.filterBanksTuGio();
    this.bankTuGio.valueChanges.pipe().subscribe(() => {
      this.filterBanksTuGio();
    });
  }

  protected filterBanksTuGio() {
    if (!this.tuGio) {
      return;
    }
    // get the search keyword
    let search = this.bankTuGio.value;
    if (!search) {
      this.filteredBanksTuGio.next(this.tuGio.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksTuGio.next(
      this.tuGio.filter((bank) => bank.Gio.toLowerCase().indexOf(search) > -1)
    );
    this.changeDetectorRefs.detectChanges();
  }
  //============ End - Từ giờ =============

  //============ Begin - Đến giờ =============
  setUpDropSearchDenGio() {
    this.bankDenGio.setValue("");
    this.filterBanksDenGio();
    this.bankDenGio.valueChanges.pipe().subscribe(() => {
      this.filterBanksDenGio();
    });
  }

  protected filterBanksDenGio() {
    if (!this.denGio) {
      return;
    }
    // get the search keyword
    let search = this.bankDenGio.value;
    if (!search) {
      this.filteredBanksDenGio.next(this.denGio.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredBanksDenGio.next(
      this.denGio.filter((bank) => bank.Gio.toLowerCase().indexOf(search) > -1)
    );
    this.changeDetectorRefs.detectChanges();
  }
  //============ End - Đến giờ =============

  //kiểm tra khi check vào option phòng họp online
  checkState(el) {
    if (this.isLoad) return;
    setTimeout(() => {
      if (this.currentCheckedValue && this.currentCheckedValue === el.value) {
        el.checked = false;
        this.removeClass(el);
        this.currentCheckedValue = null;
        this.removeSelected();
        this.changeDetectorRefs.detectChanges();
      } else {
        this.currentCheckedValue = el.value;
        if (el.value == "1") {
          this.removeSelected();
          this.flagMeeting = 1;
          this.selectedZoom = true;
          this.changeDetectorRefs.detectChanges();
          this.BindListZoom(this.idpz)
        } else if (el.value == "2") {
          this.removeSelected();
          this.flagMeeting = 2;
          this.selectedGoogle = true;
          this.BindList(1)
        } else if (el.value == "3") {
          this.removeSelected();
          this.flagMeeting = 3;
          this.selectedWebex = true;
          this.BindList(2)
          this.changeDetectorRefs.detectChanges();
          this.dangKyCuocHopService.WebexConfig().subscribe((res: any) => {
            if (res && res.status === 1) {

            }
          });
        } else if (el.value == "4") {
          this.removeSelected();
          this.flagMeeting = 4;
          this.selectedTeams = true;
          this.BindList(3)
          this.changeDetectorRefs.detectChanges();
          this.dangKyCuocHopService.TeamsConfig().subscribe((res: any) => {
            if (res && res.status === 1) {

            }
          });
        } else if (el.value == "5") {
          this.removeSelected();
          this.flagMeeting = 5;
          this.changeDetectorRefs.detectChanges();
          this.selectedOther = true;
        }
      }
    });
  }

  //xóa class checked trong select phòng họp online
  removeClass(el: any) {
    this.ren.removeClass(el["_elementRef"].nativeElement, "cdk-focused");
    this.ren.removeClass(
      el["_elementRef"].nativeElement,
      "cdk-program-focused"
    );
  }
  //làm mới option phòng họp online
  removeSelected() {
    this.flagMeeting = 0;
    this.selectedZoom = false;
    this.selectedGoogle = false;
    this.selectedTeams = false;
    this.selectedWebex = false;
    this.selectedOther = false;
    this.showreset = false;
    this.showlienket = false;
  }

  //add và remove user
  AddThanhVien(loai: number) {
    if (loai == 1) {
      let _item = this.listNguoiThamGia;
      const dialogRef = this.dialog.open(JeeChooseMemberComponent, {
        data: { _item },
        width: "40%",
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          return;
        }
        this.listNguoiThamGia = res.data;
        this.changeDetectorRefs.detectChanges();
      });
    }
    if (loai == 2) {
      let _item = this.listNguoiTheoDoi;
      const dialogRef = this.dialog.open(JeeChooseMemberComponent, {
        data: { _item },
        width: "40%",
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          return;
        }
        this.listNguoiTheoDoi = res.data;
        this.changeDetectorRefs.detectChanges();
      });
    }
    if (loai == 3) {
      let _item = this.listNguoiTomTat;
      const dialogRef = this.dialog.open(JeeChooseMemberComponent, {
        data: { _item },
        width: "40%",
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          return;
        }
        this.listNguoiTomTat = res.data;
        this.changeDetectorRefs.detectChanges();
      });
    }
  }

  deleteUserThamGia(user) {
    var index = this.listNguoiThamGia.findIndex((x) => x.idUser == user.idUser);
    this.listNguoiThamGia.splice(index, 1);
  }

  deleteUserTheoDoi(user) {
    var index = this.listNguoiTheoDoi.findIndex((x) => x.idUser == user.idUser);
    this.listNguoiTheoDoi.splice(index, 1);
  }

  deleteUserTomTat(user) {
    var index = this.listNguoiTomTat.findIndex((x) => x.idUser == user.idUser);
    this.listNguoiTomTat.splice(index, 1);
  }

  //show chọn người nhập tóm tắt kết luận
  showOptions(e: any) {
    this.clickNhapTomTat = e.checked;
  }

  goBack() {
    this.dialogRef.close();
  }

  //conver time UTC
  f_convertDateUTC(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return (
        a.getFullYear() +
        "-" +
        ("0" + (a.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + a.getDate()).slice(-2) +
        " 00:00:00.000"
      );
    }
  }

  f_convertDateUTC_new(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return (
        a.getFullYear() +
        "-" +
        ("0" + (a.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + a.getDate()).slice(-2) +
        "T00:00:00.0000000"
      );
    }
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

  f_convertHour(v: any) {
    if (v != "" && v != null) {
      let a = new Date(v);
      return (
        ("0" + a.getHours()).slice(-2) + ":" + ("0" + a.getMinutes()).slice(-2)
      );
    }
  }

  convertDate(d: any) {
    if (d == "") {
      return moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.sss");
    }
    return moment(d).format("YYYY-MM-DDTHH:mm:ss.sss");
  }

  prepareItem(room: any): TaiSanModel {
    const controls = this.formControls.controls;
    const _item = new TaiSanModel();
    _item.BookingDate = this.f_convertDateUTC_new(controls["thoigiandate"].value);
    _item.FromTime = controls["thoigianbatdau"].value;
    _item.ToTime = controls["thoigianketthuc"].value;
    _item.MeetingContent = controls["TenCuocHop"].value;
    _item.NVID = this.UserID;
    _item.RoomID = room;
    return _item;
  }

  onClickTaiSan(ev, selected) {
    const controls = this.formControls.controls;
    this.dangKyCuocHopService
      .Insert_DatPhongHop(this.prepareItem(ev))
      .subscribe((re) => {
        if (re && re.status == 1) {
          let object = this.listTaiSan[0].taisan.find((x) => x.value == ev);
          if (object) {
            // xóa tất cả các checked của phòng phọp
            let data = this.formControls.controls["taisan"].value;
            for (
              let index = 0;
              index < this.listTaiSan[0].taisan.length;
              index++
            ) {
              const element = this.listTaiSan[0].taisan[index];
              let id = data.findIndex((x) => x == element.value);
              if (id >= 0) {
                data.splice(id, 1);
              }
            }
            // phòng họp
            if (selected == true) {
              data.push(ev);
              this.TaiSan = new TaiSanModel();
              this.TaiSan.BookingDate = this.f_convertDateUTC(controls["thoigiandate"].value);
              this.TaiSan.FromTime = controls["thoigianbatdau"].value;
              this.TaiSan.ToTime = controls["thoigianketthuc"].value;
              this.TaiSan.IdPhieu = -1;
              this.TaiSan.MeetingContent = controls["TenCuocHop"].value;
              this.TaiSan.NVID = this.UserID;
              this.TaiSan.RoomID = ev;
              this.TaiSan.TenPhong = object.viewValue;
              this.TaiSan.DiaDiem = object.viewValue +
                ", " +
                this.LayThu(
                  this.convertDate(controls["thoigiandate"].value)
                ) +
                " " +
                this.f_convertDate(
                  this.convertDate(controls["thoigiandate"].value)
                ) +
                ", " +
                controls["thoigianbatdau"].value +
                " - " +
                controls["thoigianketthuc"].value;
            } else {
              this.TaiSan = new TaiSanModel();
            }
            this.formControls.controls["taisan"].setValue(data);
          } else {
            let object = this.listTaiSan[1].taisan.find((x) => x.value == ev);
            //tài sản khác
            if (selected == true) {
              this.TaiSanKhac = new TaiSanModel();
              this.TaiSanKhac.BookingDate = this.f_convertDateUTC(controls["thoigiandate"].value);
              this.TaiSanKhac.FromTime = controls["thoigianbatdau"].value;
              this.TaiSanKhac.ToTime = controls["thoigianketthuc"].value;
              this.TaiSanKhac.IdPhieu = -1;
              this.TaiSanKhac.MeetingContent = controls["TenCuocHop"].value;
              this.TaiSanKhac.NVID = this.UserID;
              this.TaiSanKhac.RoomID = ev;
              this.TaiSanKhac.TenPhong = object.viewValue;
              this.listValues.push(this.TaiSanKhac);
            } else {
              let id = this.listValues.findIndex((x) => x.RoomID == ev);
              if (id >= 0) {
                this.listValues.splice(id, 1);
              }
            }
          }
        } else {
          this.layoutUtilsService.showActionNotification(
            re.error.msg,
            MessageType.Read,
            9999999999,
            true,
            false,
            3000,
            "top",
            0
          );
          this.formControls.controls["taisan"].setValue([]);
        }
      });
  }

  openJeeAdmin() {
    window.open(
      environment.HOST_JEELANDINGPAGE + `/Admin/dang-ky-tai-san`,
      "_blank"
    );
  }

  submit(type) {
    this.disabledBtn = true;
    this.changeDetectorRefs.detectChanges();
    if (this.currentCheckedValue == "1") {
      //lách
      this.formControls.controls["IDPhongHopGoogle"].setValue(0);
      this.formControls.controls["IDPhongHopTeams"].setValue(0);
      this.formControls.controls["linkHopNgoai"].setValue(" ");
    }
    if (this.currentCheckedValue == "2") {
      //lách
      this.formControls.controls["IDPhongHop"].setValue(0);
      this.formControls.controls["IDPhongHopTeams"].setValue(0);
      this.formControls.controls["linkHopNgoai"].setValue(" ");
    }
    if (this.currentCheckedValue == "4") {
      //lách
      this.formControls.controls["IDPhongHopGoogle"].setValue(0);
      this.formControls.controls["IDPhongHop"].setValue(0);
      this.formControls.controls["linkHopNgoai"].setValue(" ");
    }
    if (this.currentCheckedValue == "5") {
      //lách
      this.formControls.controls["IDPhongHopGoogle"].setValue(0);
      this.formControls.controls["IDPhongHopTeams"].setValue(0);
      this.formControls.controls["IDPhongHop"].setValue(0);
    }
    const controls = this.formControls.controls;
    if (this.formControls.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );
      this.disabledBtn = false;
      this.changeDetectorRefs.detectChanges();
      return;
    }
    // if (this.flagMeeting == 2) {
    //   this.authenticate();
    // } else if (this.flagMeeting == 3) {
    //   this.authenticate();
    // } else if (this.flagMeeting == 4) {
    //   this.authenticateTeams();
    // } else {

    // }
    this.dangKyCuocHopService
      .Insert_CuocHop(this.PrepareData(this.Token))
      .subscribe((res: any) => {
        if (res && res.status === 1) {
          this.disabledBtn = false;
          this.changeDetectorRefs.detectChanges();
          this.layoutUtilsService.showActionNotification(
            this.CuocHop.RowID == 0
              ? "Thêm thành công"
              : "Chỉnh sửa thành công",
            MessageType.Read,
            4000,
            true,
            false
          );
          if (type == 2) {
            this.reset();
            // if(this.CuocHop.RowID == 0){
            //   this.dialogRef.close({ data: res });
            // }
          } else {
            if (this.type != 'CHAT') {
              this.stateService.state$.next(null);
              this.router.navigate(
                [
                  this.CuocHop.RowID == 0
                    ? res.data[0].RowID
                      ? `/Meeting/${res.data[0].RowID}`
                      : "/Meeting"
                    : `/Meeting/${this.CuocHop.RowID}`,
                ],
                { queryParams: { Type: 0 } }
              );
            }
            if (this.CuocHop.RowID == 0) {
              this.dialogRef.close({ data: res });
            } else {
              this.dialogRef.close({});
            }


          }
        } else {
          this.disabledBtn = false;
          this.changeDetectorRefs.detectChanges();
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Read,
            9999999999,
            true,
            false,
            3000,
            "top",
            0
          );
        }
      });
  }

  PrepareData(token: string = "") {
    const controls = this.formControls.controls;
    if (controls["NhapTomTat"].value == true) {
      if (this.listNguoiTomTat.length == 0) {
        this.layoutUtilsService.showActionNotification(
          "Vui lòng chọn người nhập tóm tắt, kết luận",
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          "top",
          0
        );
        this.disabledBtn = false;
        this.changeDetectorRefs.detectChanges();
        return;
      }
    } else {
      this.listNguoiTomTat = [];
    }
    let phut = moment(controls["thoigianketthuc"].value, "HH:mm").diff(
      moment(controls["thoigianbatdau"].value, "HH:mm"),
      "minute"
    );
    let _field = {
      RowID: this.CuocHop.RowID,
      TenCuocHop: controls["TenCuocHop"].value,
      thoigiandate: this.f_convertDateUTC(controls["thoigiandate"].value),
      thoigiantime: controls["thoigianbatdau"].value,
      thoigianminute: phut + '',
      XacNhanThamGia:
        controls["XacNhanThamGia"].value == null
          ? false
          : controls["XacNhanThamGia"].value,
      NhapTomTat:
        controls["NhapTomTat"].value == null
          ? false
          : controls["NhapTomTat"].value,
      GhiChu: controls["GhiChu"].value,
      ListThamGia: this.listNguoiThamGia,
      ListTheoDoi: this.listNguoiTheoDoi,
      ListTomTat: this.listNguoiTomTat,
      TaiSanKhac: this.listValues,
      ZoomMeeting: this.currentCheckedValue == "1" ? true : false,
      GoogleMeeting: this.currentCheckedValue == "2" ? true : false,
      WebexMeeting: this.currentCheckedValue == "3" ? true : false,
      TeamsMeeting: this.currentCheckedValue == "4" ? true : false,
      OtherMeeting: this.currentCheckedValue == "5" ? true : false,
      token: token,
      TimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      IDPhongHop:
        this.currentCheckedValue == "1"
          ? controls["IDPhongHop"].value == null
            ? ""
            : controls["IDPhongHop"].value
          : 0,
      TypeOpen: 3,
      Link: controls["linkHopNgoai"].value == null
        ? '' : controls["linkHopNgoai"].value,
    };
    if (this.TaiSan != null && this.TaiSan != undefined) {
      if (this.TaiSan.BookingDate) {
        _field["PhongHopDangKy"] = this.TaiSan
      }
    }

    return _field;
  }

  //Dùng refresh token của phòng họp để lấy access token offline của ms teams
  async authenticateTeams() {
    this.disabledBtn = false;
    this.changeDetectorRefs.detectChanges();
    const refresh_token = this.listKeyTeams.find(
      (x) => x.Id == this.formControls.controls["IDPhongHopTeams"].value
    );
    var domainredirect = environment.HOST_JEEMEETING;
    const DOMAIN_COOKIES = this.getDomainCookie();
    if (DOMAIN_COOKIES !== 'jee.vn') {
      domainredirect = domainredirect.replace('jee.vn', DOMAIN_COOKIES)
      domainredirect = domainredirect.replace('jeemeeting', 'meeting')
    }
    const redirectURI = domainredirect + "/oauth2callbackMS";
    let field = {
      client_id: this.clientId2,
      client_secret: this.clientSecret2,
      refresh_token: refresh_token.Token,
      scope: this.scopes2,
      grant_type: "refresh_token",
      redirect_uri: redirectURI,
    };
    this.dangKyCuocHopService.RefreshToken(field).subscribe((data: any) => {
      this.dangKyCuocHopService
        .Insert_CuocHop(this.PrepareData(data.access_token))
        .subscribe((res: any) => {
          if (res && res.status === 1) {
            this.disabledBtn = false;
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              this.CuocHop.RowID == 0
                ? "Thêm thành công"
                : "Chỉnh sửa thành công",
              MessageType.Read,
              4000,
              true,
              false
            );
            this.stateService.state$.next(null);
            this.router.navigate(
              [
                this.CuocHop.RowID == 0
                  ? res.data[0].RowID
                    ? `/Meeting/${res.data[0].RowID}`
                    : "/Meeting"
                  : `/Meeting/${this.CuocHop.RowID}`,
              ],
              { queryParams: { Type: 0 } }
            );
          } else {
            this.disabledBtn = false;
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Read,
              9999999999,
              true,
              false,
              3000,
              "top",
              0
            );
          }
        });
    }),
      (error) => {
        this.disabledBtn = false;
        this.changeDetectorRefs.detectChanges();
        this.layoutUtilsService.showActionNotification(
          "Vui lòng tạo lại phòng họp Teams",
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          "top",
          0
        );
      };
  }

  //Dùng refresh token của phòng họp để lấy access token offline của google
  async authenticate() {
    this.disabledBtn = false;
    this.changeDetectorRefs.detectChanges();
    this.dangKyCuocHopService
      .Insert_CuocHop(this.PrepareData(this.Token))
      .subscribe((res: any) => {
        if (res && res.status === 1) {
          this.disabledBtn = false;
          this.changeDetectorRefs.detectChanges();
          this.layoutUtilsService.showActionNotification(
            this.CuocHop.RowID == 0
              ? "Thêm thành công"
              : "Chỉnh sửa thành công",
            MessageType.Read,
            4000,
            true,
            false
          );
          this.stateService.state$.next(null);
          this.router.navigate(
            [
              this.CuocHop.RowID == 0
                ? res.data[0].RowID
                  ? `/Meeting/${res.data[0].RowID}`
                  : "/Meeting"
                : `/Meeting/${this.CuocHop.RowID}`,
            ],
            { queryParams: { Type: 0 } }
          );
        } else {
          this.disabledBtn = false;
          this.changeDetectorRefs.detectChanges();
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Read,
            9999999999,
            true,
            false,
            3000,
            "top",
            0
          );
        }
      });
  }

  WebexClick() {
    const DOMAIN_COOKIES = this.getDomainCookie();
    this.cookieService.delete("webex_token", "/", DOMAIN_COOKIES);
    var left = screen.width / 2 - 400 / 2;
    var top = screen.height / 2 - 400 / 2;
    var domainredirect = environment.HOST_JEEMEETING;
    if (DOMAIN_COOKIES !== 'jee.vn') {
      domainredirect = domainredirect.replace('jee.vn', DOMAIN_COOKIES)
      domainredirect = domainredirect.replace('jeemeeting', 'meeting')
    }
    var win = window.open(
      domainredirect + `/callback`,
      "",
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
      400 +
      ", height=" +
      400 +
      ", top=" +
      top +
      ", left=" +
      left
    );
    var timer = setInterval(() => {
      if (win.closed) {
        clearInterval(timer);
        //this.inset_webex();
      }
    }, 500);
  }

  inset_webex() {
    this.dangKyCuocHopService
      .Insert_CuocHop(this.PrepareData(this.cookieService.get("webex_token")))
      .subscribe((res: any) => {
        if (res && res.status === 1) {
          this.disabledBtn = false;
          this.changeDetectorRefs.detectChanges();
          this.layoutUtilsService.showActionNotification(
            this.CuocHop.RowID == 0
              ? "Thêm thành công"
              : "Chỉnh sửa thành công",
            MessageType.Read,
            4000,
            true,
            false
          );
          this.stateService.state$.next(null);
          this.router.navigate(
            [
              this.CuocHop.RowID == 0
                ? res.data[0].RowID
                  ? `/Meeting/${res.data[0].RowID}`
                  : "/Meeting"
                : `/Meeting/${this.CuocHop.RowID}`,
            ],
            { queryParams: { Type: 0 } }
          );
        } else {
          this.disabledBtn = false;
          this.changeDetectorRefs.detectChanges();
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Read,
            9999999999,
            true,
            false,
            3000,
            "top",
            0
          );
        }
      });
  }

  getTimeDiff(start, end) {
    return moment.duration(moment(end, "HH:mm").diff(moment(start, "HH:mm")));
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
  hiddenContinue() {
    if (this.CuocHop.RowID == 0) {
      return true
    } return false
  }

  ketNoi(type) {

    switch (type) {
      case 1:
        this.ChuyenHuongZoom()
        break;
      case 2:
        this.ChuyenHuongGoogle()
        break;
      case 3:
        this.ChuyenHuongWebex()
        break;
      case 4:
        this.ChuyenHuongTeams()
        break;
    }
  }
  getDomainCookie(): string {
    let domain = '';
    let _hostname = window.location.hostname;
    if (_hostname == 'localhost') {
      domain = _hostname
    } else {
      let hostname = ''
      hostname = _hostname.replace(_hostname.split('.')[0] + '.', '');
      domain = hostname
    }
    return domain;
  }

  ChuyenHuongZoom() {
    const DOMAIN_COOKIES = this.getDomainCookie();
    this.cookieService.set("zoom_refresh_token", "", 365, '/', DOMAIN_COOKIES)
    this.isLoad = true
    var left = screen.width / 2 - 600 / 2;
    var top = screen.height / 2 - 600 / 2;
    var domainredirect = environment.HOST_JEEMEETING;
    if (DOMAIN_COOKIES !== 'jee.vn') {
      domainredirect = domainredirect.replace('jee.vn', DOMAIN_COOKIES)
      domainredirect = domainredirect.replace('jeemeeting', 'meeting')
    }
    const redirectURI = domainredirect + "/oauth2callbackZoom";
    var initiateURL =
      "https://zoom.us/oauth/authorize?" +
      "client_id=" +
      this.clientId +
      "&response_type=code" +
      "&redirect_uri=" +
      encodeURIComponent(redirectURI) +
      "&scope=" +
      encodeURIComponent(this.scopes);
    this.changeDetectorRefs.detectChanges();
    var win = window.open(
      initiateURL,
      "",
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
      600 +
      ", height=" +
      600 +
      ", top=" +
      top +
      ", left=" +
      left
    );
    var timer = setInterval(() => {
      if (win.closed) {
        this.isLoad = false
        clearInterval(timer);
        setTimeout(() => {
          if (this.cookieService.get("zoom_refresh_token")) {
            let data = {
              Id: this.idpz,
              Refresh_Token: this.cookieService.get("zoom_refresh_token")
            }
            this.dangKyCuocHopService.updateKeyZoom(data).subscribe((res: any) => {
              console.log(res)
              if (res && res.status === 1) {
                this.BindListZoom(this.idpz)
              } else {
                this.layoutUtilsService.showError(res.error.message);
              }
            });
          }
        }, 500);
      }
    }, 500);
  }


  ChuyenHuongGoogle() {
    const DOMAIN_COOKIES = this.getDomainCookie();
    this.cookieService.set("google_refresh_token", "", 365, '/', DOMAIN_COOKIES)
    this.isLoad = true
    var left = screen.width / 2 - 600 / 2;
    var top = screen.height / 2 - 600 / 2;
    var domainredirect = environment.HOST_JEEMEETING;
    if (DOMAIN_COOKIES !== 'jee.vn') {
      domainredirect = domainredirect.replace('jee.vn', DOMAIN_COOKIES)
      domainredirect = domainredirect.replace('jeemeeting', 'meeting')
    }
    const redirectURI = domainredirect + "/oauth2callback";
    var initiateURL =
      "https://accounts.google.com/o/oauth2/v2/auth?" +
      "client_id=" +
      this.clientId +
      "&access_type=offline" +
      "&response_type=code" +
      "&prompt=consent" +
      "&redirect_uri=" +
      encodeURIComponent(redirectURI) +
      "&scope=" +
      encodeURIComponent(this.scopesGoogle);
    this.changeDetectorRefs.detectChanges();
    var win = window.open(
      initiateURL,
      "",
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
      600 +
      ", height=" +
      600 +
      ", top=" +
      top +
      ", left=" +
      left
    );
    var timer = setInterval(() => {
      if (win.closed) {
        this.isLoad = false
        clearInterval(timer);
        setTimeout(() => {
          if (this.cookieService.get("google_refresh_token")) {
            let data = {
              Id: this.idpg,
              Refresh_Token: this.cookieService.get("google_refresh_token")
            }
            this.dangKyCuocHopService.updateKeyGoogle(data).subscribe((res: any) => {
              console.log(res)
              if (res && res.status === 1) {
                this.BindList(1)
              } else {
                this.layoutUtilsService.showError(res.error.message);
              }
            });
          }
        }, 500);
      }
    }, 500);
  }

  ChuyenHuongWebex() {
    const DOMAIN_COOKIES = this.getDomainCookie();
    this.cookieService.set("webex_refresh_token", "", 365, '/', DOMAIN_COOKIES)
    this.isLoad = true
    var left = screen.width / 2 - 600 / 2;
    var top = screen.height / 2 - 600 / 2;
    var domainredirect = environment.HOST_JEEMEETING;
    if (DOMAIN_COOKIES !== 'jee.vn') {
      domainredirect = domainredirect.replace('jee.vn', DOMAIN_COOKIES)
      domainredirect = domainredirect.replace('jeemeeting', 'meeting')
    }
    const redirectURI = domainredirect + "/callback";
    var initiateURL = "https://webexapis.com/v1/authorize?" +
      "client_id=" + this.clientId +
      "&response_type=code" +
      "&redirect_uri=" + encodeURIComponent(redirectURI) +
      "&scope=" + encodeURIComponent("meeting:schedules_write spark:people_read");
    this.changeDetectorRefs.detectChanges();
    var win = window.open(
      initiateURL,
      "",
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
      600 +
      ", height=" +
      600 +
      ", top=" +
      top +
      ", left=" +
      left
    );
    var timer = setInterval(() => {
      if (win.closed) {
        this.isLoad = false
        clearInterval(timer);
        setTimeout(() => {
          if (this.cookieService.get("webex_refresh_token")) {
            let data = {
              Id: this.idpw,
              Refresh_Token: this.cookieService.get("webex_refresh_token")
            }
            this.dangKyCuocHopService.updateKeyWebex(data).subscribe((res: any) => {
              console.log(res)
              if (res && res.status === 1) {
                this.BindList(2)
              } else {
                this.layoutUtilsService.showError(res.error.message);
              }
            });
          }
        }, 500);
      }
    }, 500);
  }


  ChuyenHuongTeams() {
    const DOMAIN_COOKIES = this.getDomainCookie();
    this.cookieService.set("ms_refresh_token", "", 365, '/', DOMAIN_COOKIES)
    this.isLoad = true
    var left = screen.width / 2 - 600 / 2;
    var top = screen.height / 2 - 600 / 2;
    var domainredirect = environment.HOST_JEEMEETING;
    if (DOMAIN_COOKIES !== 'jee.vn') {
      domainredirect = domainredirect.replace('jee.vn', DOMAIN_COOKIES)
      domainredirect = domainredirect.replace('jeemeeting', 'meeting')
    }
    const redirectURI = domainredirect + "/oauth2callbackMS";
    var initiateURL = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?" +
      "client_id=" + this.clientId +
      "&response_type=code" +
      "&redirect_uri=" + encodeURIComponent(redirectURI) +
      "&scope=" + "offline_access user.read OnlineMeetings.ReadWrite";
    this.changeDetectorRefs.detectChanges();
    var win = window.open(
      initiateURL,
      "",
      "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=" +
      600 +
      ", height=" +
      600 +
      ", top=" +
      top +
      ", left=" +
      left
    );
    var timer = setInterval(() => {
      if (win.closed) {
        this.isLoad = false
        clearInterval(timer);
        setTimeout(() => {
          if (this.cookieService.get("ms_refresh_token")) {
            let data = {
              Id: this.idpt,
              Refresh_Token: this.cookieService.get("ms_refresh_token")
            }
            this.dangKyCuocHopService.updateKeyGoogle(data).subscribe((res: any) => {
              console.log(res)
              if (res && res.status === 1) {
                this.BindList(3)
              } else {
                this.layoutUtilsService.showError(res.error.message);
              }
            });
          }
        }, 500);
      }
    }, 500);
  }

  BindListZoom(event) {
    this.idpz = event
    this.isLoad = true
    this.dangKyCuocHopService.ZoomConfigCheckToken(event).subscribe((res: any) => {
      if (res && res.status === 1) {
        this.showlienket = res.data.check
        this.clientId = res.data.clientId
        this.Token = res.data.token
        if (res.data.data == 1) {
          this.showreset = true
        } else {
          this.showreset = false
        }
      } else {
        this.layoutUtilsService.showError(res.error.message);
      }
      this.isLoad = false
    });
  }

  BindList(event) {
    switch (event) {
      case 1:
        this.isLoad = true
        this.dangKyCuocHopService.GoogleConfigCheckToken().subscribe((res: any) => {
          if (res && res.status === 1) {
            this.showlienket = res.data.check
            this.idpg = res.data.id
            this.Email = res.data.email
            this.Token = res.data.token
            this.clientId = res.data.clientId
            if (res.data.data == 1) {
              this.showreset = true
            } else {
              this.showreset = false
            }
          } else {
            this.layoutUtilsService.showError(res.error.message);
          }
          this.isLoad = false
        });
        break;
      case 2:
        this.isLoad = true
        this.dangKyCuocHopService.WebexConfigCheckToken().subscribe((res: any) => {
          if (res && res.status === 1) {
            this.showlienket = res.data.check
            this.idpw = res.data.id
            this.Email = res.data.email
            this.Token = res.data.token
            this.clientId = res.data.clientId
            if (res.data.data == 1) {
              this.showreset = true
            } else {
              this.showreset = false
            }
          } else {
            this.layoutUtilsService.showError(res.error.message);
          }
          this.isLoad = false
        });
        break;
      case 3:
        this.isLoad = true
        this.dangKyCuocHopService.TeamsConfigCheckToken().subscribe((res: any) => {
          if (res && res.status === 1) {
            this.showlienket = res.data.check
            this.idpt = res.data.id
            this.Email = res.data.email
            this.Token = res.data.token
            this.clientId = res.data.clientId
            if (res.data.data == 1) {
              this.showreset = true
            } else {
              this.showreset = false
            }
          } else {
            this.layoutUtilsService.showError(res.error.message);
          }
          this.isLoad = false
        });
        break;
      case 4:

        break;
    }

  }

  resetTokenZoom() {
    let data = {
      Id: this.idpz
    }
    this.isLoad = true
    this.dangKyCuocHopService.resetKeyZoom(data).subscribe((res: any) => {
      if (res && res.status === 1) {
        this.BindListZoom(this.idpz)
      } else {
        this.layoutUtilsService.showError(res.error.message);
      }
      this.isLoad = false
    });
  }

  checkshow() {
    if (this.showlienket) {
      this.showreset = false
      return true
    }
    if (this.showreset) {
      this.showlienket = false
      return true
    }
    return false
  }

  resetTokenGoogle() {
    let data = {
      Id: this.idpg
    }
    this.isLoad = true
    this.dangKyCuocHopService.resetKeyGoogle(data).subscribe((res: any) => {
      if (res && res.status === 1) {
        this.BindList(1)
      } else {
        this.layoutUtilsService.showError(res.error.message);
      }
      this.isLoad = false
    });
  }

  resetTokenWebex() {
    let data = {
      Id: this.idpw
    }
    this.isLoad = true
    this.dangKyCuocHopService.resetKeyWebex(data).subscribe((res: any) => {
      if (res && res.status === 1) {
        this.BindList(2)
      } else {
        this.layoutUtilsService.showError(res.error.message);
      }
      this.isLoad = false
    });
  }

  resetTokenTeams() {
    let data = {
      Id: this.idpt
    }
    this.isLoad = true
    this.dangKyCuocHopService.resetKeyTeams(data).subscribe((res: any) => {
      if (res && res.status === 1) {
        this.BindList(3)
      } else {
        this.layoutUtilsService.showError(res.error.message);
      }
      this.isLoad = false
    });
  }

  ChangeTimeMeet(ev) {
    this.formControls.controls["taisan"].setValue("");
  }
}
