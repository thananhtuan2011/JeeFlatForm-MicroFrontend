
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { QuanLyCuocHopService } from '../../../_services/quan-ly-cuoc-hop.service';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';
import { DungChungFileModel, QLCuocHopModel } from '../../../_models/quan-ly-cuoc-hop.model';
import moment from 'moment';
import { environment } from 'projects/jeemeet/src/environments/environment';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { CookieService } from 'ngx-cookie-service';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';
import { ChooseMemberV2Component } from '../../jee-choose-member/choose-menber-v2/choose-member-v2.component';
import { dirtyCheck } from '@ngneat/dirty-check-forms';
import { CuocHopInfoComponent } from '../../components/cuoc-hop-info/cuoc-hop-info.component';
@Component({
  selector: 'app-quan-ly-cuoc-hop-edit',
  templateUrl: './quan-ly-cuoc-hop-edit.component.html',
  styleUrls: ['./quan-ly-cuoc-hop-edit.component.scss'],
})
export class QuanLyCuocHopEditV2Component implements OnInit {
  isDirty$: Observable<boolean>;
  store: any
  sub: Subscription
  goBack: boolean
  public error: string;
  //   public user: gapi.auth2.GoogleUser;
  clickPrivate: boolean = false;
  public accsess_token: string;
  flagMeeting: number;
  authRes: any;
  CuocHop: QLCuocHopModel;
  CuocHopForm: FormGroup;
  hasFormErrors: boolean = false;
  filterStatic: Observable<string[]>;
  IsXem: boolean = false;
  R: any = {};
  viewLoading: boolean = false;
  searchHH: string = '';
  filteredId_HH: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  IsErorr: boolean = false;
  HopTrucTuyen: any;
  TypeMeeting: string = '1';
  //controlname
  public startDateHour = { hour: 0, minute: 0 };
  tuGio: any[] = [];
  denGio: any[] = [];
  NgayBatDau: any;
  NgayKetThuc: any;
  GioBatDau: string = '00:00';
  GioKetThuc: string = '00:00';
  //====================Từ Giờ====================
  public bankTuGio: FormControl = new FormControl();
  public filteredBanksTuGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  //====================Đến giờ====================
  public bankDenGio: FormControl = new FormControl();
  public filteredBanksDenGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );
  //chọn user
  options: any = {};
  options1: any = {};
  options2: any = {};

  listNguoiThemTaiLieu: any[] = [];
  listNguoiThamGia: any[] = [];
  listNguoiTheoDoi: any[] = [];
  listNguoiTomTat: any[] = [];
  listKhachMoi: any[] = [];
  listNguoiTPKhac: any[] = [];
  // ------------------
  listNguoiThemTaiLieu_dept: any[] = [];
  listNguoiThamGia_dept: any[] = [];
  listNguoiTheoDoi_dept: any[] = [];
  listNguoiTomTat_dept: any[] = [];
  listKhachMoi_dept: any[] = [];
  listNguoiTPKhac_dept: any[] = [];

  // ------------------
  listNguoiThemTaiLieu_group: any[] = [];
  listNguoiThamGia_group: any[] = [];
  listNguoiTheoDoi_group: any[] = [];
  listNguoiTomTat_group: any[] = [];
  listKhachMoi_group: any[] = [];
  listNguoiTPKhac_group: any[] = [];

  meetingType1_member = 0
  meetingType2_member = 0
  meetingType3_member = 0
  meetingType4_member = 0
  meetingType6_member = 0
  meetingType7_member = 0
  // ----------------------------------------------------------------
  // click radio button nhập tóm tắt
  clickNhapTomTat: boolean = false;
  // danh sách key theo đơn vị
  listKeyDonViZoom: any[] = [];
  listKeyDonViGoogle: any[] = [];
  listKeyDonViWebex: any[] = [];
  @ViewChild('inputSDT', { static: true }) inputSDT: ElementRef;
  @ViewChild('scrollMe', { static: true }) myScrollContainer: ElementRef;
  @ViewChild('focusInput', { static: true }) focusInput: ElementRef;
  @ViewChild('focusInputLink', { static: true }) focusInputLink: ElementRef;
  // Private password
  private componentSubscriptions: Subscription;
  IdThuMoiSelected: any = '0';
  searchThuMoi: string = '';
  selectId_ThuMoi: string = '';
  searchZoom: string = '';
  searchGoogle: string = '';
  searchWebex: string = '';
  filteredId_Zoom: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredId_Google: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredId_Webex: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredId_ThuMoi: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  Id_ThuMoiFilterCtrl: string = '';
  lstThuMoi: any[] = [];
  idZoom: any = '0';
  idGoogle: any = '0';
  idWebex: any = '0';
  idpg: number = 0; //id phòng google
  idpt: number = 0; // id phòng teams
  idpw: number = 0; // id phong webex
  idpz: number = 0; //  id phòng zoom
  clientId: string;
  clientSecret: string;
  currentCheckedValue = null;
  //ẩn thêm người vào danh sách khi chọn lấy từ thư mời
  addNguoiThamGia: boolean = true;
  CuocHopData: any;
  id1: any;
  id2: any;
  loadingSubject = new BehaviorSubject<boolean>(true);

  type: string;
  isLoad: boolean = false;
  disabledBtn: boolean = false;
  showlienket: boolean = false;
  showreset: boolean = false;
  Email: string = '';
  Token: string = '';
  listIdKhoaHop: any[] = [];
  listIdPhienHop: any[] = [];
  listIdKyHop: any[] = [];
  files: any[] = [];
  filesThuMoi: any[] = [];
  DSDonVi: any[] = [];
  ListFileDinhKem: any[] = [];
  ListFileDinhKemThuMoi: any[] = [];
  sizemaxfile: any = environment.DungLuong / 1048576;
  lstPH: any[] = [];
  filteredPH: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  searchPH: string = '';
  dataSource: any[] = [];
  dataSourceKH: any[] = [];
  checkPH: boolean = false;
  ExtensionImg = ['png', 'gif', 'jpeg', 'jpg'];
  strExtensionImg = 'png, .gif, .jpeg, .jpg';
  ExtensionVideo = [
    'mp4',
    'mov',
    'avi',
    'gif',
    'mpeg',
    'flv',
    'wmv',
    'divx',
    'mkv',
    'rmvb',
    'dvd',
    '3gp',
    'webm',
  ];
  strExtensionVideo =
    'mp4, .mov, .avi, .gif, .mpeg, .flv, .wmv, .divx, .mkv, .rmvb, .dvd, .3gp, .webm';
  ExtensionFile = [
    'xls',
    'xlsx',
    'doc',
    'docx',
    'pdf',
    'mp3',
    'zip',
    '7zip',
    'rar',
    'txt',
  ];
  strExtensionFile =
    'xls, .xlsx, .doc, .docx, .pdf, .mp3, .zip, .7zip, .rar, .txt';
  IdTinh: string = '';
  // idDiagramOld: number = 0;
  TypeThanhPhan: number = 1;
  dataTem = {
    MaPX: 0,
    TenPhuongXa: '',
  };
  searchDonVi: string = '';
  ListDonVii: any[] = [];
  TenPhongHop: string = '';
  TenKhoaHop: string = '';
  Description: string = '';
  loadingAfterSubmit: boolean = false;
  listDiagram: any[];
  searchDiagram: string = '';
  listId_Diagram: any[] = [];
  filteredId_Diagram: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  filteredDonVi: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  Avatar: string;
  BgColor: string;
  hoten: string;
  name: string;
  Jobtitle: string;
  userId: string;
  NoiDungThongBao: string
  constructor(
    public dialogRef: MatDialogRef<QuanLyCuocHopEditV2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private CuocHopFB: FormBuilder,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    public CuocHopService: QuanLyCuocHopService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private cookieService: CookieService,
    private http: HttpUtilsService,
  ) {
    const user = this.http.getAuthFromLocalStorage()['user'];
    this.name = user['customData']['personalInfo']['Name'];
    this.userId = user['customData']['jee-account']['userID'];
    this.Avatar = user['customData']['personalInfo']['Avatar'];
    this.hoten = user['customData']['personalInfo']['Fullname'];
    this.Jobtitle = user['customData']['personalInfo']['Jobtitle'];
  }

  /** UI */
  getTitle(): string {
    if (this.CuocHop.Id > 0) {
      return this.translate.instant("QL_CUOCHOP.CUOCHOP.EDIT");
    } else {
      return this.translate.instant("QL_CUOCHOP.CUOCHOP.CREATE");
    }
  }

  ngOnInit() {
    this.loadList();
    this.CuocHopService.Get_GioDatPhongHop("").subscribe((res) => {
      this.tuGio = res.data;
      this.denGio = res.data;
      this.setUpDropSearchTuGio();
      this.setUpDropSearchDenGio();
    });
    this.CuocHop = this.data.QLCuocHop;
    this.createForm();

    if (this.CuocHop.Id > 0) {
      this.CuocHopService.Get_ChiTietCuocHopEdit(this.CuocHop.Id).subscribe((res: any) => {
        if (res && res.status == 1) {
          this.CuocHopData = res.data;
          this.TenPhongHop = this.CuocHopData.TenPhongHop;
          this.createFormEdit();
          this.loadPH();
          this.changeDetectorRefs.detectChanges();
        }
      })
    }
    else {
      var item = {
        ChucVu: this.Jobtitle,
        HoTen: this.hoten,
        Image: this.Avatar,
        idUser: this.userId,
        username: this.name
      }
      this.listNguoiTheoDoi.push(item);
    }
    this.focusInput.nativeElement.focus();
  }

  close() {
    this.dialogRef.close();
  }

  filterPH() {
    if (!this.lstPH) {
      return;
    }
    let search = this.searchPH;
    if (!search) {
      this.filteredPH.next(this.lstPH.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredPH.next(
      this.lstPH.filter((ts) =>
        ts.TenPhongHop != null
          ? ts.TenPhongHop.toLowerCase().indexOf(search) > -1
          : false
      )
    );
    this.changeDetectorRefs.detectChanges();

  }

  checkPHop() {
    if (+this.CuocHopForm.controls["IdPhongHopOffline"].value > 0) {
      this.checkPH = true;
    }
    else
      this.checkPH = false;
  }
  selectPhongHop(e: any) {

    let input = this.lstPH.filter((item) => item.Id == e.value);
    this.TenPhongHop = input[0].TenPhongHop;

    this.changeDetectorRefs.detectChanges();

  }

  loadPH() {
    let thoigianstart = this.f_convertDate(this.NgayBatDau) + " " + this.GioBatDau;
    let thoigianend = this.TypeMeeting == '1' ? this.f_convertDate(this.NgayBatDau) + " " + this.GioKetThuc : this.f_convertDate(this.NgayKetThuc) + " " + this.GioKetThuc;
    let idPhongHop = 0;

    if (this.CuocHopData != undefined && this.CuocHopData.IdPhongHop > 0) {
      idPhongHop = this.CuocHopData.IdPhongHop;
    }

    this.CuocHopService.GetAllPhongHop(thoigianstart, thoigianend, idPhongHop).subscribe((res) => {
      if (res.status == 1 && res.data) {
        this.lstPH = res.data;
        this.filteredPH.next(this.lstPH);
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  createForm() {
    this.CuocHopForm = this.CuocHopFB.group({
      TenCuocHop: ["", [Validators.required, Validators.pattern(/[\S]/)]],
      ThoiGianBatDau: ["" + new Date(), Validators.required],
      thoigianbatdau: ["", Validators.required],
      ThoiGianKetThuc: ["" + new Date(), Validators.required],
      thoigianketthuc: ["", Validators.required],
      IdPhongHopOffline: ["0", [Validators.required, Validators.min(0)]],
      DiaDiem: [""],
      SoKyHieu: [""],
      XacNhanThamGia: [""],
      NhapTomTat: [""],
      GhiChu: [""],
      GhiChuChoNguoiThemTaiLieu: [""],
      linkHopNgoai: [""],
      IDPhongHop: [this.idpz + ""],
      TypeMeeting: [this.TypeMeeting],
      PrivateMeeting: [false],
      LoginMeeting: [""],
    });
    this.changeDetectorRefs.detectChanges();
  }

  createFormEdit() {
    this.CuocHopForm = this.CuocHopFB.group({
      TenCuocHop: [this.CuocHopData.TenCuocHop],
      IdPhongHopOffline: [this.CuocHopData.IdPhongHop > 0 ? this.CuocHopData.IdPhongHop + '' : "0"],
      ThoiGianBatDau: [this.CuocHopData.ThoiGianBatDau + ""],
      ThoiGianKetThuc: [moment(this.f_convertDateStart(this.CuocHopData.ThoiGianBatDau), "YYYY/MM/DD HH:mm").add({
        hours: 0,
        minutes: Number(this.CuocHopData.ThoiLuongPhut)
      }).format("YYYY-MM-DD")],
      thoigianbatdau: [this.CuocHopData.GioBatDau + ''],
      thoigianketthuc: ['' + moment(this.CuocHopData.GioBatDau, "HH:mm").add({
        hours: 0,
        minutes: Number(this.CuocHopData.ThoiLuongPhut)
      }).format("HH:mm")],
      DiaDiem: [this.CuocHopData.DiaChi],
      SoKyHieu: [this.CuocHopData.SoKyHieu],
      XacNhanThamGia: [this.CuocHopData.XacNhanThamGia],
      NhapTomTat: [this.CuocHopData.NhapTomTat],
      GhiChu: [this.CuocHopData.GhiChu],
      GhiChuChoNguoiThemTaiLieu: [this.CuocHopData.GhiChuChoNguoiThemTaiLieu],
      linkHopNgoai: [this.CuocHopData.Link],
      IDPhongHop: ["" + this.CuocHopData.IDPhongHop ? this.CuocHopData.IDPhongHop : this.idpz],
      TypeMeeting: ["" + this.CuocHopData.TypeMeeting],
      PrivateMeeting: [this.CuocHopData.PrivateMeeting],
      LoginMeeting: [this.CuocHopData.LoginMeeting],
    });
    this.TypeThanhPhan = this.CuocHopData.Type
    this.TypeMeeting = "" + this.CuocHopData.TypeMeeting
    this.GioBatDau = this.CuocHopData.GioBatDau;
    this.clickNhapTomTat = this.CuocHopData.NhapTomTat;
    this.listNguoiThamGia = this.CuocHopData.ListThamGia;
    this.listNguoiTheoDoi = this.CuocHopData.ListTheoDoi;
    this.listNguoiTomTat = this.CuocHopData.ListTomTat;
    this.listKhachMoi = this.CuocHopData.ListKhachMoi;
    this.listNguoiThemTaiLieu = this.CuocHopData.ListThemTaiLieu;
    this.listNguoiTPKhac = this.CuocHopData.ListTPKhac;
    this.changeDetectorRefs.detectChanges();
    this.NgayBatDau = '' + this.CuocHopData.ThoiGianBatDau
    this.CuocHopForm.controls["ThoiGianBatDau"].setValue(this.NgayBatDau + "");
    this.NgayKetThuc = moment(this.f_convertDateStart(this.CuocHopData.ThoiGianBatDau), "YYYY/MM/DD HH:mm").add({
      hours: 0,
      minutes: Number(this.CuocHopData.ThoiLuongPhut)
    }).format("YYYY-MM-DD")
    this.CuocHopForm.controls["ThoiGianKetThuc"].setValue(this.NgayKetThuc + "");
    this.GioBatDau = '' + this.CuocHopData.GioBatDau
    this.GioKetThuc = '' + moment(this.GioBatDau, "HH:mm").add({
      hours: 0,
      minutes: Number(this.CuocHopData.ThoiLuongPhut)
    }).format("HH:mm")

    this.ListFileDinhKem = this.CuocHopData.FileDinhKem;
    this.ListFileDinhKemThuMoi = this.CuocHopData.FileDinhKemThuMoi;

    // ------------------------------
    const meetingTypes = ['ThamGia', 'TheoDoi', 'TomTat', 'KhachMoi', 'nodata', 'ThemTaiLieu', 'TPKhac'];
    meetingTypes.forEach((type, index) => {
      if (this.CuocHopData[`ListNhomUser${type}`] && this.CuocHopData[`ListNhomUser${type}`].length > 0) {
        this[`meetingType${index + 1}_member`] = 2;
        this[`listNguoi${type}_group`] = this.CuocHopData[`ListNhomUser${type}`];
      }

      if (this.CuocHopData[`ListDonVi${type}`] && this.CuocHopData[`ListDonVi${type}`].length > 0 && (this.CuocHopData[`List${type}`] && (this.CuocHopData[`List${type}`].length > 0 || this.CuocHopData[`List${type}`].length == 0))) {
        this[`meetingType${index + 1}_member`] = 3;
        this[`listNguoi${type}_dept`] = this.CuocHopData[`ListDonVi${type}`];
        this[`listNguoi${type}`] = this[`listNguoi${type}`].filter(x => x.DeptId == 0);
      }
    });

    this.clickPrivate = this.CuocHopData.PrivateMeeting


    this.store = new BehaviorSubject({
      TenCuocHop: this.CuocHopForm.controls["TenCuocHop"].value,
      ThoiGianBatDau: this.CuocHopForm.controls["ThoiGianBatDau"].value,
      thoigianbatdau: this.CuocHopForm.controls["thoigianbatdau"].value,
      ThoiGianKetThuc: this.CuocHopForm.controls["ThoiGianKetThuc"].value,
      thoigianketthuc: this.CuocHopForm.controls["thoigianketthuc"].value,
      IdPhongHopOffline: this.CuocHopForm.controls["IdPhongHopOffline"].value,
      DiaDiem: this.CuocHopForm.controls["DiaDiem"].value,
      SoKyHieu: this.CuocHopForm.controls["SoKyHieu"].value,
      XacNhanThamGia: this.CuocHopForm.controls["XacNhanThamGia"].value,
      NhapTomTat: this.CuocHopForm.controls["NhapTomTat"].value,
      GhiChu: this.CuocHopForm.controls["GhiChu"].value,
      GhiChuChoNguoiThemTaiLieu: this.CuocHopForm.controls["GhiChuChoNguoiThemTaiLieu"].value,
      linkHopNgoai: this.CuocHopForm.controls["linkHopNgoai"].value,
      IDPhongHop: this.CuocHopForm.controls["IDPhongHop"].value,
      TypeMeeting: this.CuocHopForm.controls["TypeMeeting"].value,
      PrivateMeeting: this.CuocHopForm.controls["PrivateMeeting"].value,
      LoginMeeting: this.CuocHopForm.controls["LoginMeeting"].value,
    });

    this.isDirty$ = dirtyCheck(this.CuocHopForm, this.store);
    this.sub = this.isDirty$.subscribe((res) => {
      this.goBack = res
    })
  }

  ngAfterViewInit() {
    if (this.CuocHop.Id == 0) {
      // Lấy giờ hiện tại
      let date = new Date();

      // Chuyển giờ hiện tại thành phút
      let minutes = date.getMinutes() + date.getHours() * 60;

      // Làm tròn số phút lên đến phút chia hết cho 5 gần nhất
      let roundedMinutes = Math.ceil(minutes / 5) * 5;

      // Tính lại giờ từ phút đã làm tròn
      let hours = Math.floor(roundedMinutes / 60);
      let mins = roundedMinutes % 60;

      // Định dạng giờ phút thành chuỗi hh:mm
      let time = hours.toString().padStart(2, '0') + ":" + mins.toString().padStart(2, '0');

      // Thêm 5 phút nếu kết quả trả về không lớn hơn giờ hiện tại
      if (new Date().getHours() * 60 + new Date().getMinutes() >= roundedMinutes) {
        roundedMinutes += 5;
        hours = Math.floor(roundedMinutes / 60);
        mins = roundedMinutes % 60;
        time = hours.toString().padStart(2, '0') + ":" + mins.toString().padStart(2, '0');
      }

      this.GioBatDau = time
      this.GioKetThuc = moment(this.GioBatDau, "HH:mm").add({
        hours: 0,
        minutes: 30
      }).format("HH:mm");
      this.NgayBatDau = new Date();
      this.CuocHopForm.controls["ThoiGianBatDau"].setValue(this.NgayBatDau + "");
      this.NgayKetThuc = new Date();
      this.CuocHopForm.controls["ThoiGianKetThuc"].setValue(this.NgayKetThuc + "");

      if (this.data.QLCuocHop.GioBatDau && this.data.QLCuocHop.ThoiLuongPhut && this.data.QLCuocHop.TypeMeeting) {
        this.NgayBatDau = this.data.QLCuocHop.GioBatDau;
        this.NgayKetThuc = moment(this.data.QLCuocHop.GioBatDau).add({
          hours: 0,
          minutes: Number(this.data.QLCuocHop.ThoiLuongPhut)
        })
        this.GioBatDau = moment(this.data.QLCuocHop.GioBatDau).format("HH:mm")
        this.GioKetThuc = moment(this.GioBatDau, "HH:mm").add({
          hours: 0,
          minutes: Number(this.data.QLCuocHop.ThoiLuongPhut)
        }).format("HH:mm");
        this.CuocHopForm.controls["ThoiGianBatDau"].setValue(this.data.QLCuocHop.GioBatDau + "");
        this.CuocHopForm.controls["ThoiGianKetThuc"].setValue('' + moment(moment(this.data.QLCuocHop.GioBatDau).format("DD/MM/YYYY hh:mm"), "HH:mm").add({
          hours: 0,
          minutes: Number(this.data.QLCuocHop.ThoiLuongPhut)
        }).format("HH:mm"));
        this.TypeMeeting = this.data.QLCuocHop.TypeMeeting
        this.CuocHopForm.controls["TypeMeeting"].setValue(this.data.QLCuocHop.TypeMeeting + "");
        this.changeDetectorRefs.detectChanges();
      }
    }
  }
  addEvent(event: any) {
    if (event != undefined && (event != this.NgayBatDau)) {
      this.NgayBatDau = event;
      this.CuocHopForm.controls["ThoiGianBatDau"].setValue(this.f_convertDate(this.NgayBatDau));
      this.loadPH();
    }
  }
  addEvent4(event: any) {
    if (event != undefined) {
      this.NgayKetThuc = event;
      this.loadPH();
    }
  }
  addEvent2(event: any) {
    this.GioBatDau = event;
    if (this.GioBatDau == "00:00")
      return;
    else
      this.loadPH();
  }
  addEvent3(event: any) {
    this.GioKetThuc = event;
    if (this.GioKetThuc == "00:00")
      return;
    else
      this.loadPH();
  }

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


  ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
    this.sub && this.sub.unsubscribe();
  }

  f_convertDate(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return (
        a.getFullYear() +
        "-" +
        ("0" + (a.getMonth() + 1)).slice(-2) +
        "-" + ("0" + a.getDate()).slice(-2)
      );
    }
  }
  f_convertDate00(v: any) {
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

  f_convertDateStart(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return (
        a.getFullYear() +
        "-" +
        ("0" + (a.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + a.getDate()).slice(-2) +
        " " + this.GioBatDau
      );
    }
  }

  f_convertDateEnd(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return (
        a.getFullYear() +
        "-" +
        ("0" + (a.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + a.getDate()).slice(-2) +
        " " + this.GioKetThuc
      );
    }
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.CuocHopForm.controls[controlName];
    const result = control.invalid && control.touched;
    return result;
  }

  @HostListener('keydown.enter')
  onEnterKeyDown() {
    this.onSubmit();
  }

  checkFileNew(listFile, lst) {
    if (listFile && listFile.length > 0) {
      const fileDinhKem = listFile.filter(x => x.IsDel);
      const fileDinhKemNew = listFile.filter(x => x.isnew);
      return fileDinhKem.length > 0 || fileDinhKemNew.length > 0;
    }
    if (lst && lst.length > 0) {
      return true;
    }
    return false;
  }

  async handleDialog() {
    const dialogRef = this.dialog.open(CuocHopInfoComponent, { data: { _title: 'Nội dung thông báo chỉnh sửa' }, width: '40%' });
    const res = await dialogRef.afterClosed().toPromise();
    if (!res) {
      this.disabledBtn = false;
      return false;
    } else {
      this.NoiDungThongBao = res._item;
      if (!this.NoiDungThongBao.trim()) {
        const mes = 'Nội dung thông báo chỉnh sửa không để trống';
        this.layoutUtilsService.showActionNotification(
          mes,
          MessageType.Error,
          2000,
          true,
          false,
          0,
          "top",
          0
        );
        this.disabledBtn = false;
        return false;
      }
      return true;
    }
  }

  async onSubmit() {
    this.disabledBtn = true;
    this.hasFormErrors = false;
    const controls = this.CuocHopForm.controls;

    const isFileNew = this.checkFileNew(this.ListFileDinhKem, this.files) || this.checkFileNew(this.ListFileDinhKemThuMoi, this.filesThuMoi);
    if (this.goBack || (isFileNew && this.CuocHop.Id > 0)) {
      const valueHend = await this.handleDialog();
      if (!valueHend) return;
    }

    if (controls['TenCuocHop'].value == 0 || controls['TenCuocHop'].value == '') {
      const mes = this.translate.instant('QL_CUOCHOP.VUILONGNHAP_TENCUOCHOP');
      this.layoutUtilsService.showActionNotification(
        mes,
        MessageType.Error,
        2000,
        true,
        false,
        0,
        "top",
        0
      );
      this.disabledBtn = false;
      return;
    }

    if (controls['TenCuocHop'].value.length > 1999) {
      const mes = 'Tên cuộc họp không được vượt quá 2000 ký tự';
      this.layoutUtilsService.showActionNotification(
        mes,
        MessageType.Error,
        2000,
        true,
        false,
        0,
        "top",
        0
      );
      this.disabledBtn = false;
      return;
    }

    if (controls['DiaDiem'].value != '' && controls['DiaDiem'].value.length > 1999) {
      const mes = 'Địa điểm cuộc họp không được vượt quá 2000 ký tự';
      this.layoutUtilsService.showActionNotification(
        mes,
        MessageType.Error,
        2000,
        true,
        false,
        0,
        "top",
        0
      );
      this.disabledBtn = false;
      return;
    }

    if (controls['GhiChu'].value != '' && controls['GhiChu'].value.length > 1999) {
      const mes = 'Ghi chú cuộc họp không được vượt quá 2000 ký tự';
      this.layoutUtilsService.showActionNotification(
        mes,
        MessageType.Error,
        2000,
        true,
        false,
        0,
        "top",
        0
      );
      this.disabledBtn = false;
      return;
    }


    if (!controls['ThoiGianBatDau'].value || controls['ThoiGianBatDau'].value == '') {
      const mes = this.translate.instant('QL_CUOCHOP.VUILONGCHON_THOIGIANDIENRA');
      this.layoutUtilsService.showActionNotification(
        mes,
        MessageType.Error,
        2000,
        true,
        false,
        0,
        "top",
        0
      );
      this.disabledBtn = false;
      return;
    }

    if (!controls['IdPhongHopOffline'].value) {
      const mes = this.translate.instant('QL_CUOCHOP.VUILONGCHON_TENPHONGHOP');
      this.layoutUtilsService.showActionNotification(
        mes,
        MessageType.Error,
        2000,
        true,
        false,
        0,
        "top",
        0
      );
      this.disabledBtn = false;
      return;
    }
    if (this.CuocHopForm.invalid) {
      Object.keys(controls).forEach(controlName => {
        controls[controlName].markAsTouched();
      }
      );
      this.hasFormErrors = true;
      let element = this.myScrollContainer.nativeElement
      this.myScrollContainer.nativeElement.scrollTop = 0;
      this.changeDetectorRefs.detectChanges();
      this.disabledBtn = false;
      return;
    }

    let editedCuocHop = this.prepareCuocHop(this.Token);
    if (this.CuocHop.Id > 0) {
      this.updateCuocHop(editedCuocHop)
      return;
    }
    this.addCuocHop(editedCuocHop);
  }

  prepareCuocHop(token: string = ""): QLCuocHopModel {
    const controls = this.CuocHopForm.controls;
    const _CuocHop = new QLCuocHopModel();

    if (this.CuocHop.Id > 0) {
      _CuocHop.Id = this.CuocHop.Id;
      if (this.goBack) {
        _CuocHop.NoiDungThongBao = this.NoiDungThongBao
      }
    }
    _CuocHop.TenCuocHop = controls['TenCuocHop'].value;

    let phut = moment(controls["thoigianketthuc"].value, "HH:mm").diff(
      moment(controls["thoigianbatdau"].value, "HH:mm"),
      "minute"
    );

    _CuocHop.ThoiGianBatDau = this.f_convertDate00(controls['ThoiGianBatDau'].value);
    _CuocHop.GioBatDau = controls['thoigianbatdau'].value;
    _CuocHop.ThoiLuongPhut = phut + '';
    _CuocHop.DiaChi = controls['DiaDiem'].value;
    _CuocHop.SoKyHieu = controls['SoKyHieu'].value;
    _CuocHop.XacNhanThamGia = false,
      _CuocHop.NhapTomTat = controls["NhapTomTat"].value == "" ? false : controls["NhapTomTat"].value,
      _CuocHop.GhiChu = controls['GhiChu'].value;
    _CuocHop.GhiChuChoNguoiThemTaiLieu = controls['GhiChuChoNguoiThemTaiLieu'].value;

    _CuocHop.TypeMeeting = this.TypeMeeting

    if (this.TypeMeeting == '2') {
      let phut = moment(this.f_convertDateStart(controls["ThoiGianBatDau"].value)).diff(
        moment(this.f_convertDateEnd(controls["ThoiGianKetThuc"].value)),
        "minute"
      );
      _CuocHop.ThoiLuongPhut = Math.abs(phut) + '';
    }
    if (this.meetingType1_member == 3) {
      let data_user = []
      this.listNguoiThamGia_dept.forEach(element => {
        if (element.UserIdList && element.UserIdList.length > 0) {
          element.UserIdList.forEach(el => {
            let fields = {
              idUser: el.UserId,
              username: el.Username,
              DeptId: element.RowID,
              GroupId: 0,
            }
            data_user.push(fields)
          });
        }
      });
      this.listNguoiThamGia.push(...data_user);
    }
    _CuocHop.ListThamGia = this.listNguoiThamGia;

    if (this.meetingType2_member == 3) {
      let data_user = []
      this.listNguoiTheoDoi_dept.forEach(element => {
        if (element.UserIdList && element.UserIdList.length > 0) {
          element.UserIdList.forEach(el => {
            let fields = {
              idUser: el.UserId,
              username: el.Username,
              DeptId: element.RowID,
              GroupId: 0,
            }
            data_user.push(fields)
          });
        }
      });
      this.listNguoiTheoDoi.push(...data_user);
    }
    _CuocHop.ListTheoDoi = this.listNguoiTheoDoi;

    // kiểm tra khi bỏ trống thư ký
    if (this.listNguoiTheoDoi.length == 0) {
      this.layoutUtilsService.showActionNotification(
        this.translate.instant("QL_CUOCHOP.NOTI_CHON_THUKY"),
        MessageType.Error,
        2000,
        true,
        false,
        0,
        "top",
        0
      );

      this.disabledBtn = false;
      return;
    }

    if (this.meetingType3_member == 3) {
      let data_user = []
      this.listNguoiTomTat_dept.forEach(element => {
        if (element.UserIdList && element.UserIdList.length > 0) {
          element.UserIdList.forEach(el => {
            let fields = {
              idUser: el.UserId,
              username: el.Username,
              DeptId: element.RowID,
              GroupId: 0,
            }
            data_user.push(fields)
          });
        }
      });
      this.listNguoiTomTat.push(...data_user);
    }
    _CuocHop.ListTomTat = this.listNguoiTomTat;

    // kiểm tra khi bỏ trống người nhập tóm tắt kết luận
    if (controls["NhapTomTat"].value == true) {
      if (this.listNguoiTomTat.length == 0) {
        this.layoutUtilsService.showActionNotification(
          this.translate.instant("QL_CUOCHOP.NOTI_CHON_NHAPTTKL"),
          MessageType.Error,
          2000,
          true,
          false,
          0,
          "top",
          0
        );
        this.disabledBtn = false;
        return;
      }
    }

    if (this.meetingType6_member == 3) {
      let data_user = []
      this.listNguoiThemTaiLieu_dept.forEach(element => {
        if (element.UserIdList && element.UserIdList.length > 0) {
          element.UserIdList.forEach(el => {
            let fields = {
              idUser: el.UserId,
              username: el.Username,
              DeptId: element.RowID,
              GroupId: 0,
            }
            data_user.push(fields)
          });
        }
      });
      this.listNguoiThemTaiLieu.push(...data_user);
    }
    _CuocHop.ListThemTaiLieu = this.listNguoiThemTaiLieu;


    if (this.meetingType4_member == 3) {
      let data_user = []
      this.listKhachMoi_dept.forEach(element => {
        if (element.UserIdList && element.UserIdList.length > 0) {
          element.UserIdList.forEach(el => {
            let fields = {
              idUser: el.UserId,
              username: el.Username,
              DeptId: element.RowID,
              GroupId: 0,
            }
            data_user.push(fields)
          });
        }
      });
      this.listKhachMoi.push(...data_user);
    }
    if (this.meetingType7_member == 3) {
      let data_user = []
      this.listNguoiTPKhac_dept.forEach(element => {
        if (element.UserIdList && element.UserIdList.length > 0) {
          element.UserIdList.forEach(el => {
            let fields = {
              idUser: el.UserId,
              username: el.Username,
              DeptId: element.RowID,
              GroupId: 0,
            }
            data_user.push(fields)
          });
        }
      });
      this.listNguoiTPKhac.push(...data_user);
    }

    _CuocHop.ListTPKhac = this.listNguoiTPKhac;
    _CuocHop.ListKhachMoi = this.listKhachMoi;

    _CuocHop.TenKhoaHop = this.TenKhoaHop;
    _CuocHop.IsDuyet = this.CuocHop.IsDuyet;
    _CuocHop.TenPhongHop = this.TenPhongHop;
    _CuocHop.IdPhongHop = controls['IdPhongHopOffline'].value;
    _CuocHop.FileDinhKem = [];
    if (this.ListFileDinhKem) {
      _CuocHop.FileDinhKem = this.ListFileDinhKem.filter(x => x.IsDel);
      for (var i = 0; i < this.files.length; i++) {
        if (this.files[i] && this.files[i].strBase64) {
          _CuocHop.FileDinhKem.push(Object.assign({}, this.files[i]));
        }
      }
    }

    _CuocHop.FileDinhKemThuMoi = [];
    if (this.ListFileDinhKemThuMoi) {
      _CuocHop.FileDinhKemThuMoi = this.ListFileDinhKemThuMoi.filter(x => x.IsDel);
      for (var i = 0; i < this.filesThuMoi.length; i++) {
        if (this.filesThuMoi[i] && this.filesThuMoi[i].strBase64) {
          _CuocHop.FileDinhKemThuMoi.push(Object.assign({}, this.filesThuMoi[i]));
        }
      }
    }
    _CuocHop.PrivateMeeting = controls['PrivateMeeting'].value
    return _CuocHop;
  }

  addCuocHop(_CuocHop: QLCuocHopModel, withBack: boolean = false) {

    if (_CuocHop.Type == 3) {
      const _title: string = this.translate.instant("QL_CUOCHOP.ADD_CHECK");
      const _description: string = this.translate.instant("QL_CUOCHOP.CHECK_QUESTION");
      const _waitDesciption: string = this.translate.instant("QL_CUOCHOP.CHECK_WAIT");
      const dialogRef = this.layoutUtilsService.deleteElement(
        _title,
        _description,
        _waitDesciption
      );
      dialogRef.afterClosed().subscribe((res) => {
        if (!res) {
          _CuocHop.TaiLieu = 1;
          this.viewLoading = true;
          this.changeDetectorRefs.detectChanges();
          this.CuocHopService.createCuocHop(_CuocHop).subscribe(res => {
            this.viewLoading = false;
            if (res.status == 1) {
              this.disabledBtn = false;
              const message = this.translate.instant("QL_CUOCHOP.CUOCHOP.ADDED");
              this.layoutUtilsService.showActionNotification(message, MessageType.Create, 2000, true, false);
              this.focusInput.nativeElement.focus();
              this.dialogRef.close({ isEdit: false, RowID: res.data });
            }
            else
              this.disabledBtn = false;
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false);
            this.focusInput.nativeElement.focus();
          });
          this.changeDetectorRefs.detectChanges();
          return;
        }
        else {
          this.viewLoading = true;
          this.changeDetectorRefs.detectChanges();
          _CuocHop.TaiLieu = 2;
          this.CuocHopService.createCuocHop(_CuocHop).subscribe(res => {
            this.viewLoading = false;
            if (res.status == 1) {
              this.disabledBtn = false;
              const message = this.translate.instant("QL_CUOCHOP.CUOCHOP.ADDED");
              this.layoutUtilsService.showActionNotification(message, MessageType.Create, 2000, true, false);
              this.focusInput.nativeElement.focus();
              this.dialogRef.close({ isEdit: false, RowID: res.data });
            }
            else
              this.disabledBtn = false;
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false);
            this.focusInput.nativeElement.focus();
          });
          this.changeDetectorRefs.detectChanges();
        }
      });
    }
    else {
      this.viewLoading = true;
      this.CuocHopService.createCuocHop(_CuocHop).subscribe(res => {
        this.viewLoading = false;
        if (res.status == 1) {
          const message = this.translate.instant("QL_CUOCHOP.CUOCHOP.ADDED");
          this.layoutUtilsService.showActionNotification(message, MessageType.Create, 5000, true, false);
          this.focusInput.nativeElement.focus();
          this.disabledBtn = false;
          this.changeDetectorRefs.detectChanges();
          this.dialogRef.close({ isEdit: false, RowID: res.data });
        }
        else {
          this.disabledBtn = false;
          this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false);
          this.focusInput.nativeElement.focus();
        }
      });

      this.changeDetectorRefs.detectChanges();
    }
  }

  updateCuocHop(_CuocHop: QLCuocHopModel, withBack: boolean = false) {
    this.viewLoading = true;
    this.changeDetectorRefs.detectChanges();
    this.CuocHopService.updateCuocHop(_CuocHop).subscribe(res => {
      this.viewLoading = false;
      if (res.status == 1) {
        this.disabledBtn = false;
        const message = this.translate.instant("QL_CUOCHOP.CUOCHOP.EDITED");
        this.layoutUtilsService.showActionNotification(message, MessageType.Update, 2000, true, false);
        this.focusInput.nativeElement.focus();
        this.dialogRef.close({ isEdit: true });
      }
      else {
        this.disabledBtn = false;
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false);
        this.focusInput.nativeElement.focus();
      }
    });
    this.changeDetectorRefs.detectChanges();
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  extractDataUser(data, type) {
    let data_user = [];
    data.forEach(element => {
      if (element.UserIdList && element.UserIdList.length > 0) {
        element.UserIdList.forEach(el => {
          let fields = {
            idUser: el.UserId,
            username: el.Username,
            DeptId: type == 1 ? element.RowID : 0,
            GroupId: type == 2 ? element.RowID : 0,
          }
          data_user.push(fields);
        });
      }
    });
    return data_user;
  }
  AddThanhVien(loai: number) {
    let private_meeet = this.clickPrivate;
    let _item = [];
    let meetingType_member = this.meetingType1_member;

    if (loai == 1) {
      switch (this.meetingType1_member) {
        case 0:
        case 1:
          _item = this.meetingType1_member == 0 ? this.listNguoiThamGia_group : this.listNguoiThamGia_dept;
          meetingType_member = 3;
          break;
        case 2:
          _item = this.listNguoiThamGia_group;
          break;
      }

      if ([0, 1, 3].includes(this.meetingType1_member)) {
        const list1 = this.listNguoiThamGia.map((obj) => obj.idUser + '##').join(',');
        const list2 = this.listNguoiThamGia_dept.map((obj) => obj.RowID).join(',');
        var inputNodeId = list1.concat(',', list2);
      }

      let meeet_type_nember = loai;
      const dialogRef = this.dialog.open(ChooseMemberV2Component, { data: { _item, inputNodeId, meetingType_member, private_meeet, meeet_type_nember }, width: '60%' });

      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.meetingType1_member = res.type;
        switch (res.type) {
          case 0:
            this.listNguoiThamGia = res.data;
            break;
          case 1:
          case 2:
            this.listNguoiThamGia_dept = res.type == 1 ? res.data : [];
            this.listNguoiThamGia_group = res.type == 2 ? res.data : [];
            this.listNguoiThamGia = this.extractDataUser(res.data, res.type);
            break;
          case 3:
            this.listNguoiThamGia = res.data;
            this.listNguoiThamGia_dept = res.data2;
            break;
        }
        this.changeDetectorRefs.detectChanges();
      });
    }
    if (loai == 2) {
      let _item = this.listNguoiTheoDoi;
      let meetingType_member = this.meetingType2_member;

      switch (this.meetingType2_member) {
        case 0:
        case 1:
          _item = this.meetingType2_member == 0 ? this.listNguoiTheoDoi : this.listNguoiTheoDoi_dept;
          meetingType_member = 3;
          break;
        case 2:
          _item = this.listNguoiTheoDoi_group;
          break;
      }

      if ([0, 1, 3].includes(this.meetingType2_member)) {
        const list1 = this.listNguoiTheoDoi.map((obj) => obj.idUser + '##').join(',');
        const list2 = this.listNguoiTheoDoi_dept.map((obj) => obj.RowID).join(',');
        var inputNodeId = list1.concat(',', list2);
      }

      let meeet_type_nember = loai;
      const dialogRef = this.dialog.open(ChooseMemberV2Component, { data: { _item, inputNodeId, meetingType_member, private_meeet, meeet_type_nember }, width: '60%' });

      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.meetingType2_member = res.type;
        switch (res.type) {
          case 0:
            this.listNguoiTheoDoi = res.data;
            break;
          case 1:
          case 2:
            this.listNguoiTheoDoi_dept = res.type == 1 ? res.data : [];
            this.listNguoiTheoDoi_group = res.type == 2 ? res.data : [];
            this.listNguoiTheoDoi = this.extractDataUser(res.data, res.type);
            break;
          case 3:
            this.listNguoiTheoDoi = res.data;
            this.listNguoiTheoDoi_dept = res.data2;
            break;
        }
        this.changeDetectorRefs.detectChanges();
      });
    }

    if (loai == 3) {
      let _item = this.listNguoiTomTat;
      let meetingType_member = this.meetingType3_member


      switch (this.meetingType3_member) {
        case 0:
        case 1:
          _item = this.meetingType3_member == 0 ? this.listNguoiTomTat : this.listNguoiTomTat_dept;
          meetingType_member = 3;
          break;
        case 2:
          _item = this.listNguoiTomTat_group;
          break;
      }


      if ([0, 1, 3].includes(this.meetingType3_member)) {
        const list1 = this.listNguoiTomTat.map((obj) => obj.idUser + '##').join(',');
        const list2 = this.listNguoiTomTat_dept.map((obj) => obj.RowID).join(',');
        var inputNodeId = list1.concat(',', list2);
      }
      let meeet_type_nember = 5
      const dialogRef = this.dialog.open(ChooseMemberV2Component, { data: { _item, inputNodeId, meetingType_member, private_meeet, meeet_type_nember }, width: '60%' });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.meetingType3_member = res.type;
        switch (res.type) {
          case 0:
            this.listNguoiTomTat = res.data;
            break;
          case 1:
          case 2:
            this.listNguoiTomTat_dept = res.type == 1 ? res.data : [];
            this.listNguoiTomTat_group = res.type == 2 ? res.data : [];
            this.listNguoiTomTat = this.extractDataUser(res.data, res.type);
            break;
          case 3:
            this.listNguoiTomTat = res.data;
            this.listNguoiTomTat_dept = res.data2;
            break;
        }
        this.changeDetectorRefs.detectChanges();
      });
    }
    if (loai == 4) {
      let _item = this.listKhachMoi;
      let meetingType_member = this.meetingType4_member
      switch (this.meetingType4_member) {
        case 0:
        case 1:
          _item = this.meetingType4_member == 0 ? this.listKhachMoi : this.listKhachMoi_dept;
          meetingType_member = 3;
          break;
        case 2:
          _item = this.listKhachMoi_group;
          break;
      }

      if ([0, 1, 3].includes(this.meetingType4_member)) {
        const list1 = this.listKhachMoi.map((obj) => obj.idUser + '##').join(',');
        const list2 = this.listKhachMoi_dept.map((obj) => obj.RowID).join(',');
        var inputNodeId = list1.concat(',', list2);
      }
      let meeet_type_nember = 3
      const dialogRef = this.dialog.open(ChooseMemberV2Component, { data: { _item, inputNodeId, meetingType_member, private_meeet, meeet_type_nember }, width: '60%' });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }

        this.meetingType4_member = res.type;
        switch (res.type) {
          case 0:
            this.listKhachMoi = res.data;
            break;
          case 1:
          case 2:
            this.listKhachMoi_dept = res.type == 1 ? res.data : [];
            this.listKhachMoi_group = res.type == 2 ? res.data : [];
            this.listKhachMoi = this.extractDataUser(res.data, res.type);
            break;
          case 3:
            this.listKhachMoi = res.data;
            this.listKhachMoi_dept = res.data2;
            break;
        }
        this.changeDetectorRefs.detectChanges();
      });
    }
    if (loai == 6) {
      let _item = this.listNguoiThemTaiLieu;
      let meetingType_member = this.meetingType6_member

      switch (this.meetingType6_member) {
        case 0:
        case 1:
          _item = this.meetingType6_member == 0 ? this.listNguoiThemTaiLieu : this.listNguoiThemTaiLieu_dept;
          meetingType_member = 3;
          break;
        case 2:
          _item = this.listNguoiThemTaiLieu_group;
          break;
      }

      if ([0, 1, 3].includes(this.meetingType6_member)) {
        const list1 = this.listNguoiThemTaiLieu.map((obj) => obj.idUser + '##').join(',');
        const list2 = this.listNguoiThemTaiLieu_dept.map((obj) => obj.RowID).join(',');
        var inputNodeId = list1.concat(',', list2);
      }
      let meeet_type_nember = 4
      const dialogRef = this.dialog.open(ChooseMemberV2Component, { data: { _item, inputNodeId, meetingType_member, private_meeet, meeet_type_nember }, width: '60%' });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
        this.meetingType6_member = res.type;
        switch (res.type) {
          case 0:
            this.listNguoiThemTaiLieu = res.data;
            break;
          case 1:
          case 2:
            this.listNguoiThemTaiLieu_dept = res.type == 1 ? res.data : [];
            this.listNguoiThemTaiLieu_group = res.type == 2 ? res.data : [];
            this.listNguoiThemTaiLieu = this.extractDataUser(res.data, res.type);
            break;
          case 3:
            this.listNguoiThemTaiLieu = res.data;
            this.listNguoiThemTaiLieu_dept = res.data2;
            break;
        }
        this.changeDetectorRefs.detectChanges();
      });
    }
    if (loai == 7) {
      let _item = this.listNguoiTPKhac;
      let meetingType_member = this.meetingType7_member

      switch (this.meetingType7_member) {
        case 0:
        case 1:
          _item = this.meetingType7_member == 0 ? this.listNguoiTPKhac : this.listNguoiTPKhac_dept;
          meetingType_member = 3;
          break;
        case 2:
          _item = this.listNguoiTPKhac_group;
          break;
      }


      if ([0, 1, 3].includes(this.meetingType7_member)) {
        const list1 = this.listNguoiTPKhac.map((obj) => obj.idUser + '##').join(',');
        const list2 = this.listNguoiTPKhac_dept.map((obj) => obj.RowID).join(',');
        var inputNodeId = list1.concat(',', list2);
      }
      let meeet_type_nember = 7
      const dialogRef = this.dialog.open(ChooseMemberV2Component, { data: { _item, inputNodeId, meetingType_member, private_meeet, meeet_type_nember }, width: '60%' });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
        debugger
        this.meetingType7_member = res.type;
        switch (res.type) {
          case 0:
            this.listNguoiTPKhac = res.data;
            break;
          case 1:
          case 2:
            this.listNguoiTPKhac_dept = res.type == 1 ? res.data : [];
            this.listNguoiTPKhac_group = res.type == 2 ? res.data : [];
            this.listNguoiTPKhac = this.extractDataUser(res.data, res.type);
            break;
          case 3:
            this.listNguoiTPKhac = res.data;
            this.listNguoiTPKhac_dept = res.data2;
            break;
        }
        this.changeDetectorRefs.detectChanges();
      });
    }
  }

  deleteUserThamGia(user, doub = 0) {
    if (this.meetingType1_member === 0) {
      var index = this.listNguoiThamGia.findIndex((x) => x.idUser == user.idUser);
      this.listNguoiThamGia.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType1_member === 1) {
      var index = this.listNguoiThamGia_dept.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiThamGia_dept.splice(index, 1);

      var obj = this.listNguoiThamGia.filter((x) => x.DeptId == user.RowID);
      obj.forEach(element => {
        var index = this.listNguoiThamGia.findIndex((x) => x.idUser == element.idUser);
        this.listNguoiThamGia.splice(index, 1);
      });
      this.changeDetectorRefs.detectChanges()
    }

    if (this.meetingType1_member === 2) {
      var index = this.listNguoiThamGia_group.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiThamGia_group.splice(index, 1);

      var obj = this.listNguoiThamGia.filter((x) => x.GroupId == user.RowID);
      obj.forEach(element => {
        var index = this.listNguoiThamGia.findIndex((x) => x.idUser == element.idUser);
        this.listNguoiThamGia.splice(index, 1);
      });
      this.changeDetectorRefs.detectChanges()
    }

    if (this.meetingType1_member === 3 && doub == 0) {
      var index = this.listNguoiThamGia.findIndex((x) => x.idUser == user.idUser);
      this.listNguoiThamGia.splice(index, 1);

      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType1_member === 3 && doub == 1) {
      var index = this.listNguoiThamGia_dept.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiThamGia_dept.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
  }
  deleteUserThemTaiLieu(user, doub = 0) {

    if (this.meetingType6_member === 0) {
      var index = this.listNguoiThemTaiLieu.findIndex((x) => x.idUser == user.idUser);
      this.listNguoiThemTaiLieu.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType6_member === 1) {
      var index = this.listNguoiThemTaiLieu_dept.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiThemTaiLieu_dept.splice(index, 1);

      var obj = this.listNguoiThemTaiLieu.filter((x) => x.DeptId == user.RowID);
      obj.forEach(element => {
        var index = this.listNguoiThemTaiLieu.findIndex((x) => x.idUser == element.idUser);
        this.listNguoiThemTaiLieu.splice(index, 1);
      });

      this.changeDetectorRefs.detectChanges()
    }

    if (this.meetingType6_member === 2) {
      var index = this.listNguoiThemTaiLieu_group.findIndex((x) => x.RowID == user.RowID); ``
      this.listNguoiThemTaiLieu_group.splice(index, 1);

      var obj = this.listNguoiThemTaiLieu.filter((x) => x.GroupId == user.RowID);
      obj.forEach(element => {
        var index = this.listNguoiThemTaiLieu.findIndex((x) => x.idUser == element.idUser);
        this.listNguoiThemTaiLieu.splice(index, 1);
      });
      this.changeDetectorRefs.detectChanges()
    }



    if (this.meetingType6_member === 3 && doub == 0) {
      var index = this.listNguoiThemTaiLieu.findIndex((x) => x.idUser == user.idUser);
      this.listNguoiThemTaiLieu.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType6_member === 3 && doub == 1) {
      var index = this.listNguoiThemTaiLieu_dept.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiThemTaiLieu_dept.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
  }

  deleteUserTPKhach(user, doub = 0) {

    if (this.meetingType7_member === 0) {
      var index = this.listNguoiTPKhac.findIndex((x) => x.idUser == user.idUser);
      this.listNguoiTPKhac.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType7_member === 1) {
      var index = this.listNguoiTPKhac_dept.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiTPKhac_dept.splice(index, 1);

      var obj = this.listNguoiTPKhac.filter((x) => x.DeptId == user.RowID);
      obj.forEach(element => {
        var index = this.listNguoiTPKhac.findIndex((x) => x.idUser == element.idUser);
        this.listNguoiTPKhac.splice(index, 1);
      });

      this.changeDetectorRefs.detectChanges()
    }

    if (this.meetingType7_member === 2) {
      var index = this.listNguoiTPKhac_group.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiTPKhac_group.splice(index, 1);

      var obj = this.listNguoiTPKhac.filter((x) => x.GroupId == user.RowID);
      obj.forEach(element => {
        var index = this.listNguoiTPKhac.findIndex((x) => x.idUser == element.idUser);
        this.listNguoiTPKhac.splice(index, 1);
      });
      this.changeDetectorRefs.detectChanges()
    }



    if (this.meetingType7_member === 3 && doub == 0) {
      var index = this.listNguoiTPKhac.findIndex((x) => x.idUser == user.idUser);
      this.listNguoiTPKhac.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType7_member === 3 && doub == 1) {
      var index = this.listNguoiTPKhac_dept.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiTPKhac_dept.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
  }


  deleteUserTheoDoi(user, doub = 0) {

    if (this.meetingType2_member === 0) {
      var index = this.listNguoiTheoDoi.findIndex((x) => x.idUser == user.idUser);
      this.listNguoiTheoDoi.splice(index, 1)
      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType2_member === 1) {
      var index = this.listNguoiTheoDoi_dept.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiTheoDoi_dept.splice(index, 1);

      var obj = this.listNguoiTheoDoi.filter((x) => x.DeptId == user.RowID);
      obj.forEach(element => {
        var index = this.listNguoiTheoDoi.findIndex((x) => x.idUser == element.idUser);
        this.listNguoiTheoDoi.splice(index, 1);
      });
      this.changeDetectorRefs.detectChanges()
    }

    if (this.meetingType2_member === 2) {
      var index = this.listNguoiTheoDoi_group.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiTheoDoi_group.splice(index, 1);

      var obj = this.listNguoiTheoDoi.filter((x) => x.GroupId == user.RowID);
      obj.forEach(element => {
        var index = this.listNguoiTheoDoi.findIndex((x) => x.idUser == element.idUser);
        this.listNguoiTheoDoi.splice(index, 1);
      });
      this.changeDetectorRefs.detectChanges()
    }


    if (this.meetingType2_member === 3 && doub == 0) {
      var index = this.listNguoiTheoDoi.findIndex((x) => x.idUser == user.idUser);
      this.listNguoiTheoDoi.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType2_member === 3 && doub == 1) {
      var index = this.listNguoiTheoDoi_dept.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiTheoDoi_dept.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
  }

  deleteUserTomTat(user, doub = 0) {
    if (this.meetingType3_member === 0) {
      var index = this.listNguoiTomTat.findIndex((x) => x.idUser == user.idUser);
      this.listNguoiTomTat.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType3_member === 1) {
      var index = this.listNguoiTomTat_dept.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiTomTat_dept.splice(index, 1);

      var obj = this.listNguoiTomTat.filter((x) => x.DeptId == user.RowID);
      obj.forEach(element => {
        var index = this.listNguoiTomTat.findIndex((x) => x.idUser == element.idUser);
        this.listNguoiTomTat.splice(index, 1);
      });

      this.changeDetectorRefs.detectChanges()
    }

    if (this.meetingType3_member === 2) {
      var index = this.listNguoiTomTat_group.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiTomTat_group.splice(index, 1);

      var obj = this.listNguoiTomTat.filter((x) => x.GroupId == user.RowID);
      obj.forEach(element => {
        var index = this.listNguoiTomTat.findIndex((x) => x.idUser == element.idUser);
        this.listNguoiTomTat.splice(index, 1);
      });

      this.changeDetectorRefs.detectChanges()
    }

    if (this.meetingType3_member === 3 && doub == 0) {
      var index = this.listNguoiTomTat.findIndex((x) => x.idUser == user.idUser);
      this.listNguoiTomTat.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType3_member === 3 && doub == 1) {
      var index = this.listNguoiTomTat_dept.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiTomTat_dept.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
  }

  deleteUserKhachMoi(user, doub = 0) {
    if (this.meetingType4_member === 0) {
      var index = this.listKhachMoi.findIndex((x) => x.idUser == user.idUser);
      this.listKhachMoi.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType4_member === 1) {
      var index = this.listKhachMoi_dept.findIndex((x) => x.RowID == user.RowID);
      this.listKhachMoi_dept.splice(index, 1);

      var obj = this.listKhachMoi.filter((x) => x.DeptId == user.RowID);
      obj.forEach(element => {
        var index = this.listKhachMoi.findIndex((x) => x.idUser == element.idUser);
        this.listKhachMoi.splice(index, 1);
      });

      this.changeDetectorRefs.detectChanges()
    }

    if (this.meetingType4_member === 2) {
      var index = this.listKhachMoi_group.findIndex((x) => x.RowID == user.RowID);
      this.listKhachMoi_group.splice(index, 1);
      var obj = this.listKhachMoi.filter((x) => x.GroupId == user.RowID);
      obj.forEach(element => {
        var index = this.listKhachMoi.findIndex((x) => x.idUser == element.idUser);
        this.listKhachMoi.splice(index, 1);
      });

      this.changeDetectorRefs.detectChanges()
    }

    if (this.meetingType4_member === 3 && doub == 0) {
      var index = this.listKhachMoi.findIndex((x) => x.idUser == user.idUser);
      this.listKhachMoi.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType4_member === 3 && doub == 1) {
      var index = this.listKhachMoi_dept.findIndex((x) => x.RowID == user.RowID);
      this.listKhachMoi_dept.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }

  }

  //click nhập tóm tắt
  showOptions(e: any) {
    this.clickNhapTomTat = e.checked;
  }
  showOptionsPrivate(e: any) {
    this.clickPrivate = e.checked;
    if (e.checked) {
      this.meetingType1_member = 0
      this.meetingType2_member = 0
      this.meetingType3_member = 0
      this.meetingType4_member = 0
      this.meetingType6_member = 0
      this.listNguoiThemTaiLieu = [];
      this.listNguoiThamGia = [];
      this.listNguoiTheoDoi = [];
      this.listNguoiTomTat = [];
      this.listKhachMoi = [];
      this.listNguoiThemTaiLieu_dept = [];
      this.listNguoiThamGia_dept = [];
      this.listNguoiTheoDoi_dept = [];
      this.listNguoiTomTat_dept = [];
      this.listKhachMoi_dept = [];
      this.listNguoiThemTaiLieu_group = [];
      this.listNguoiThamGia_group = [];
      this.listNguoiTheoDoi_group = [];
      this.listNguoiTomTat_group = [];
      this.listKhachMoi_group = [];
    }
  }

  close_ask() {
    const dialogRef = this.layoutUtilsService.deleteElement(this.translate.instant('COMMON.XACNHANDONG'), this.translate.instant('COMMON.CLOSED'));
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dialogRef.close();
    });
  }

  new_row() {
    this.files.push({});
  }
  selectFile(i) {
    let f = document.getElementById("FileUpLoad" + i);
    f.click();
  }
  FileChoose(evt: any, index) {
    evt.stopPropagation();
    if (evt.target.files && evt.target.files.length) {
      let file = evt.target.files[0];
      var condition_type = file.type.split('/')[0];
      var condition_name = file.name.split('.').pop();
      if (condition_type == 'image') {
        if (file.size > environment.DungLuong) {
          var a = environment.DungLuong / 1048576;
          const message = this.translate.instant('QL_SOS.NOTI_REFUSE_HINHANH_1') + ` ${a} MB.`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          return;
        }
        condition_name = condition_name.toLowerCase();
        const index_ = this.ExtensionImg.findIndex(ex => ex === condition_name);
        if (index_ < 0) {
          const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_HINHANH_1') + ` (.${this.strExtensionImg})`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          return;
        }
      }
      else if (condition_type == 'video') {
        if (file.size > environment.DungLuong) {
          var a = environment.DungLuong / 1048576;
          const message = this.translate.instant('QL_SOS.NOTI_REFUSE_VIDEO_1') + `  ${a} MB.`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          return;
        }
        condition_name = condition_name.toLowerCase();
        const index_ = this.ExtensionVideo.findIndex(ex => ex === condition_name);
        if (index_ < 0) {
          const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_VIDEO_1') + ` (.${this.strExtensionVideo})`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          return;
        }
      }
      else {
        if (file.size > environment.DungLuong) {
          var a = environment.DungLuong / 1048576;
          const message = this.translate.instant('QL_SOS.NOTI_REFUSE_FILE_1') + ` ${a} MB.`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          return;
        }
        condition_name = condition_name.toLowerCase();
        const index_ = this.ExtensionFile.findIndex(ex => ex === condition_name);
        if (index_ < 0) {
          const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_FILE_1') + `  (.${this.strExtensionFile})`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          return;
        }
      }
      var filename = `${evt.target.files[0].name}`;
      let extension = "";
      for (var i = 0; i < this.files.length; i++) {
        if (this.files[i] && this.files[i].filename == filename) {
          const message = `"${filename}" this.Translate.instant('QL_SOS.DATHEM_1')`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, false);
          evt.target.value = '';
          return;
        }
      }
      let reader = new FileReader();
      reader.readAsDataURL(evt.target.files[0]);
      let base64Str;
      reader.onload = function () {
        base64Str = reader.result as String;
        let lengName = evt.target.files[0].name.split('.').length;
        extension = `.${evt.target.files[0].name.split('.')[lengName - 1]}`;
        var metaIdx = base64Str.indexOf(';base64,');
        base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
      };
      setTimeout(res => {
        var _file: any = {};
        _file.strBase64 = base64Str;
        _file.filename = filename;
        _file.extension = extension;
        _file.type = evt.target.files[0].type.includes('image') ? 1 : 2;
        _file.isnew = true;
        this.files[index] = _file;
        this.changeDetectorRefs.detectChanges();
      }, 1000);
    }
  }
  remove(index) {
    this.files.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
  }
  removeFile(index) {
    this.ListFileDinhKem[index].IsDel = true;
    this.changeDetectorRefs.detectChanges();
  }

  new_rowThuMoi() {
    this.filesThuMoi.push({});
  }
  selectFileThuMoi(i) {
    let f = document.getElementById("FileUpLoadThuMoi" + i);
    f.click();
  }
  FileChooseThuMoi(evt: any, index) {
    evt.stopPropagation();
    if (evt.target.files && evt.target.files.length) {
      let file = evt.target.files[0];
      var condition_type = file.type.split('/')[0];
      var condition_name = file.name.split('.').pop();
      if (condition_type == 'image') {
        if (file.size > environment.DungLuong) {
          var a = environment.DungLuong / 1048576;
          const message = this.translate.instant('QL_SOS.NOTI_REFUSE_HINHANH_1') + ` ${a} MB.`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          return;
        }
        condition_name = condition_name.toLowerCase();
        const index_ = this.ExtensionImg.findIndex(ex => ex === condition_name);
        if (index_ < 0) {
          const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_HINHANH_1') + ` (.${this.strExtensionImg})`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          return;
        }
      }
      else if (condition_type == 'video') {
        if (file.size > environment.DungLuong) {
          var a = environment.DungLuong / 1048576;
          const message = this.translate.instant('QL_SOS.NOTI_REFUSE_VIDEO_1') + `  ${a} MB.`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          return;
        }
        condition_name = condition_name.toLowerCase();
        const index_ = this.ExtensionVideo.findIndex(ex => ex === condition_name);
        if (index_ < 0) {
          const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_VIDEO_1') + ` (.${this.strExtensionVideo})`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          return;
        }
      }
      else {
        if (file.size > environment.DungLuong) {
          var a = environment.DungLuong / 1048576;
          const message = this.translate.instant('QL_SOS.NOTI_REFUSE_FILE_1') + ` ${a} MB.`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          return;
        }
        condition_name = condition_name.toLowerCase();
        const index_ = this.ExtensionFile.findIndex(ex => ex === condition_name);
        if (index_ < 0) {
          const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_FILE_1') + `  (.${this.strExtensionFile})`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          return;
        }
      }
      var filename = `${evt.target.files[0].name}`;
      let extension = "";
      for (var i = 0; i < this.filesThuMoi.length; i++) {
        if (this.filesThuMoi[i] && this.filesThuMoi[i].filename == filename) {
          const message = `"${filename}" this.Translate.instant('QL_SOS.DATHEM_1')`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          evt.target.value = '';
          return;
        }
      }
      let reader = new FileReader();
      reader.readAsDataURL(evt.target.files[0]);
      let base64Str;
      reader.onload = function () {
        base64Str = reader.result as String;
        let lengName = evt.target.files[0].name.split('.').length;
        extension = `.${evt.target.files[0].name.split('.')[lengName - 1]}`;
        var metaIdx = base64Str.indexOf(';base64,');
        base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
      };
      setTimeout(res => {
        var _file: any = {};
        _file.strBase64 = base64Str;
        _file.filename = filename;
        _file.extension = extension;
        _file.type = evt.target.files[0].type.includes('image') ? 1 : 2;
        _file.isnew = true;
        this.filesThuMoi[index] = _file;
        this.changeDetectorRefs.detectChanges();
      }, 1000);
    }
  }

  FileChoosesThuMoi(evt: any, index) {
    evt.stopPropagation();
    if (evt.target.files && evt.target.files.length) {
      const newFiles = [];

      for (let i = 0; i < evt.target.files.length; i++) {
        const file = evt.target.files[i];
        const filename = `${file.name}`;
        var condition_type = file.type.split('/')[0];
        var condition_name = file.name.split('.').pop();
        if (condition_type == 'image') {
          if (file.size > environment.DungLuong) {
            var a = environment.DungLuong / 1048576;
            const message = this.translate.instant('QL_SOS.NOTI_REFUSE_HINHANH_1') + ` ${a} MB.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
            return;
          }
          condition_name = condition_name.toLowerCase();
          const index_ = this.ExtensionImg.findIndex(ex => ex === condition_name);
          if (index_ < 0) {
            const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_HINHANH_1') + ` (.${this.strExtensionImg})`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
            return;
          }
        }
        else if (condition_type == 'video') {
          if (file.size > environment.DungLuong) {
            var a = environment.DungLuong / 1048576;
            const message = this.translate.instant('QL_SOS.NOTI_REFUSE_VIDEO_1') + `  ${a} MB.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
            return;
          }
          condition_name = condition_name.toLowerCase();
          const index_ = this.ExtensionVideo.findIndex(ex => ex === condition_name);
          if (index_ < 0) {
            const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_VIDEO_1') + ` (.${this.strExtensionVideo})`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
            return;
          }
        }
        else {
          if (file.size > environment.DungLuong) {
            var a = environment.DungLuong / 1048576;
            const message = this.translate.instant('QL_SOS.NOTI_REFUSE_FILE_1') + ` ${a} MB.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
            return;
          }
          condition_name = condition_name.toLowerCase();
          const index_ = this.ExtensionFile.findIndex(ex => ex === condition_name);
          if (index_ < 0) {
            const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_FILE_1') + `  (.${this.strExtensionFile})`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
            return;
          }
        }
        // Check if the file with the same filename already exists
        if (this.filesThuMoi.some(item => item && item.filename === filename)) {
          const message = `"${filename}" this.Translate.instant('QL_SOS.DATHEM_1')`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          evt.target.value = '';
          break;
        }

        const reader = new FileReader();

        reader.onload = () => {
          const base64Str = (reader.result as string).split(';base64,')[1];
          const lengName = file.name.split('.').length;
          const extension = `.${file.name.split('.')[lengName - 1]}`;

          const _file = {
            strBase64: base64Str,
            filename: filename,
            extension: extension,
            type: file.type.includes('image') ? 1 : 2,
            isnew: true,
          };

          newFiles.push(_file);
          this.changeDetectorRefs.detectChanges();

          if (i === evt.target.files.length - 1) {
            // If this is the last file, update the main array
            this.filesThuMoi = [...this.filesThuMoi, ...newFiles];
          }
        };

        // Read the file as data URL
        reader.readAsDataURL(file);
      }
    }
  }

  FileChooses(evt: any, index) {
    evt.stopPropagation();
    if (evt.target.files && evt.target.files.length) {
      const newFiles = [];

      for (let i = 0; i < evt.target.files.length; i++) {
        const file = evt.target.files[i];
        const filename = `${file.name}`;
        var condition_type = file.type.split('/')[0];
        var condition_name = file.name.split('.').pop();
        if (condition_type == 'image') {
          if (file.size > environment.DungLuong) {
            var a = environment.DungLuong / 1048576;
            const message = this.translate.instant('QL_SOS.NOTI_REFUSE_HINHANH_1') + ` ${a} MB.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
            return;
          }
          condition_name = condition_name.toLowerCase();
          const index_ = this.ExtensionImg.findIndex(ex => ex === condition_name);
          if (index_ < 0) {
            const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_HINHANH_1') + ` (.${this.strExtensionImg})`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
            return;
          }
        }
        else if (condition_type == 'video') {
          if (file.size > environment.DungLuong) {
            var a = environment.DungLuong / 1048576;
            const message = this.translate.instant('QL_SOS.NOTI_REFUSE_VIDEO_1') + `  ${a} MB.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
            return;
          }
          condition_name = condition_name.toLowerCase();
          const index_ = this.ExtensionVideo.findIndex(ex => ex === condition_name);
          if (index_ < 0) {
            const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_VIDEO_1') + ` (.${this.strExtensionVideo})`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
            return;
          }
        }
        else {
          if (file.size > environment.DungLuong) {
            var a = environment.DungLuong / 1048576;
            const message = this.translate.instant('QL_SOS.NOTI_REFUSE_FILE_1') + ` ${a} MB.`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
            return;
          }
          condition_name = condition_name.toLowerCase();
          const index_ = this.ExtensionFile.findIndex(ex => ex === condition_name);
          if (index_ < 0) {
            const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_FILE_1') + `  (.${this.strExtensionFile})`;
            this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
            return;
          }
        }
        // Check if the file with the same filename already exists
        if (this.files.some(item => item && item.filename === filename)) {
          const message = `"${filename}" this.Translate.instant('QL_SOS.DATHEM_1')`;
          this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
          evt.target.value = '';
          break;
        }

        const reader = new FileReader();

        reader.onload = () => {
          const base64Str = (reader.result as string).split(';base64,')[1];
          const lengName = file.name.split('.').length;
          const extension = `.${file.name.split('.')[lengName - 1]}`;

          const _file = {
            strBase64: base64Str,
            filename: filename,
            extension: extension,
            type: file.type.includes('image') ? 1 : 2,
            isnew: true,
          };

          newFiles.push(_file);
          this.changeDetectorRefs.detectChanges();

          if (i === evt.target.files.length - 1) {
            // If this is the last file, update the main array
            this.files = [...this.files, ...newFiles];
          }
        };

        // Read the file as data URL
        reader.readAsDataURL(file);
      }
    }
  }

  removeThuMoi(index) {
    this.filesThuMoi.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
  }
  removeFileThuMoi(index) {
    this.ListFileDinhKemThuMoi[index].IsDel = true;
    this.changeDetectorRefs.detectChanges();
  }

  DongForm() {

    const dialogRef = this.layoutUtilsService.deleteElement(this.translate.instant('ComMon.XACNHANDONG'), this.translate.instant('ComMon.CLOSE_U'));
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dialogRef.close();
    });
  }
  changeTypeMeeting(ev) {
    this.TypeMeeting = ev.value
  }

  loadList() {
    this.CuocHopService.list().subscribe((res: any) => {
      if (res && res.status == 1) {
        if (res.data) {
          this.listDiagram = res.data;
          this.filteredId_Diagram.next(this.listDiagram.slice());
          this.changeDetectorRefs.detectChanges();
        }
      }
    }
    )
  }

  SelectChangeTypeThanhPhan(event) {

    this.TypeThanhPhan = event.value;
    this.changeDetectorRefs.detectChanges();

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

}
