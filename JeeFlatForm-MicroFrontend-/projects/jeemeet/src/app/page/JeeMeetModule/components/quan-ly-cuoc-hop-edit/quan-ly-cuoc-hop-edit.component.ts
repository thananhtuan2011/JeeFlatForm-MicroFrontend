
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
import { QuanLyCuocHopService } from '../../_services/quan-ly-cuoc-hop.service';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';
import { DungChungFileModel, QLCuocHopModel } from '../../_models/quan-ly-cuoc-hop.model';
import moment from 'moment';
import { environment } from 'projects/jeemeet/src/environments/environment';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { JeeChooseMemberComponent } from '../jee-choose-member/jee-choose-member.component';
import { CookieService } from 'ngx-cookie-service';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';
import { ChooseMemberV2Component } from '../jee-choose-member/choose-menber-v2/choose-member-v2.component';
import { TreeMenberComponent } from '../jee-choose-member/tree-menber/tree-menber.component';
import { dirtyCheck } from '@ngneat/dirty-check-forms';
@Component({
  selector: 'app-quan-ly-cuoc-hop-edit',
  templateUrl: './quan-ly-cuoc-hop-edit.component.html',
  styleUrls: ['./quan-ly-cuoc-hop-edit.component.scss'],
})
export class QuanLyCuocHopEditComponent implements OnInit {
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
  client_id: string;
  client_secret: string;
  inputId: any[] = [];
  tabIndexValue = 0;
  //end google
  // Public properties
  isPopupOpen: boolean = false;
  DungChungDropdown: DungChungFileModel = new DungChungFileModel();
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
  listNguoiKhac: any[] = [];
  // ------------------
  listNguoiThemTaiLieu_dept: any[] = [];
  listNguoiThamGia_dept: any[] = [];
  listNguoiTheoDoi_dept: any[] = [];
  listNguoiTomTat_dept: any[] = [];
  listKhachMoi_dept: any[] = [];
  listNguoiKhac_dept: any[] = [];

  // ------------------
  listNguoiThemTaiLieu_group: any[] = [];
  listNguoiThamGia_group: any[] = [];
  listNguoiTheoDoi_group: any[] = [];
  listNguoiTomTat_group: any[] = [];
  listKhachMoi_group: any[] = [];
  listNguoiKhac_group: any[] = [];

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
  constructor(
    public dialogRef: MatDialogRef<QuanLyCuocHopEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private CuocHopFB: FormBuilder,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    public CuocHopService: QuanLyCuocHopService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private ren: Renderer2,
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
      // this.ListIdKhoaHop();

      // if (this.IdTinh == "919") {
      //   this.ListIdPhienHop();
      //   this.ListIdKyHop();
      // }

      this.denGio = res.data;
      this.setUpDropSearchTuGio();
      this.setUpDropSearchDenGio();
    });
    this.CuocHop = this.data.QLCuocHop;
    this.GetListKeyZoom()
    // this.GetListThuMoi()
    // this.GetListAllDonVi();
    this.createForm();

    if (this.CuocHop.Id > 0) {
      this.CuocHopService.Get_ChiTietCuocHopEdit(this.CuocHop.Id).subscribe((res: any) => {
        if (res && res.status == 1) {

          this.CuocHopData = res.data;
          this.dataSource = this.CuocHopData.ListDonVi_;
          this.TenPhongHop = this.CuocHopData.TenPhongHop;
          this.TenKhoaHop = this.CuocHopData.MoTa;
          // this.Description=this.CuocHopData.Description;
          if (this.dataSource && this.dataSource.length > 0) {
            var flags = [], outputId = [], l = this.dataSource.length, i;
            for (i = 0; i < l; i++) {
              if (flags[this.dataSource[i].IdDonVi]) continue;
              flags[this.dataSource[i].IdDonVi] = true;
              outputId.push(this.dataSource[i].IdDonVi);
            }
            this.inputId = outputId;
          }

          this.createFormEdit();
          // this.loadList();
          this.loadPH();

          this.loadEditMeet(this.CuocHopData.ZoomMeeting, this.CuocHopData.GoogleMeeting, this.CuocHopData.WebexMeeting, this.CuocHopData.TeamsMeeting, this.CuocHopData.OtherMeeting)

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



    // e.value.forEach(element => {



    this.changeDetectorRefs.detectChanges();

  }
  selectKhoaHop(e: any) {


    let input = this.listIdKhoaHop.filter((item) => item.IdKhoaHop == e.value);
    this.TenKhoaHop = input[0].MoTa,



      // e.value.forEach(element => {



      this.changeDetectorRefs.detectChanges();

  }
  selectDonVi(e: any) {

    let dataBeta = []

    e.value.forEach(element => {

      let input = this.ListDonVii.filter((item) => item.MaPX == element);
      var l = input.length, i;
      for (i = 0; i < l; i++) {
        let inputDrop = {
          MaPX: input[i].MaPX,
          TenPhuongXa: input[i].TenPhuongXa,
          Email: input[i].Email
        };
        dataBeta.push(inputDrop);
      }
    });
    this.dataSource = dataBeta.filter((x) => !x.IsDel);
    if (this.dataSource && this.dataSource.length > 0) {
      var flags = [], outputId = [], l = this.dataSource.length, i;
      for (i = 0; i < l; i++) {
        if (flags[this.dataSource[i].MaPX]) continue;
        flags[this.dataSource[i].MaPX] = true;
        outputId.push(this.dataSource[i].MaPX);
      }
      this.inputId = outputId;
    }
    this.changeDetectorRefs.detectChanges();

  }

  DonViChange() {

    if (!this.ListDonVii) {
      return;
    }
    let search = this.searchDonVi;
    if (!search) {
      this.filteredDonVi.next(this.ListDonVii.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredDonVi.next(
      this.ListDonVii.filter((ts) =>
        this.DungChungDropdown.nonAccentVietnamese(
          ts.TenPhuongXa
        ).indexOf(search) > -1
      ) //ts.TenLoai.toLowerCase().indexOf(search) > -1)
    );
    // this.filteredId_CuocHop.next(
    // 	this.lstKhaoSat.filter(
    // 		(ts) =>
    // 			this.DungChungDropdown.nonAccentVietnamese(
    // 				ts.TieuDe
    // 			).indexOf(search) > -1
    // 	) //ts.TenLoai.toLowerCase().indexOf(search) > -1)
    // );
    this.changeDetectorRefs.detectChanges();

  }
  GetListAllDonVi() {

    // this.IdCuocHop = this.IdCuocHop;

    this.CuocHopService.getDonVi().subscribe(
      (res) => {
        if (res && res.status == 1) {
          this.ListDonVii = res.data;

          this.filteredDonVi.next(this.ListDonVii);
          this.changeDetectorRefs.detectChanges();

        }
      }
    );

  }

  loadPH() {

    if (this.TypeMeeting == '1') {
      if (this.CuocHopData != undefined) {
        if (this.CuocHopData.IdPhongHop > 0) {
          let thoigianstart = this.f_convertDate(this.NgayBatDau) + " " + this.GioBatDau;
          let thoigianend = this.f_convertDate(this.NgayBatDau) + " " + this.GioKetThuc;
          this.CuocHopService.GetAllPhongHop(thoigianstart, thoigianend, this.CuocHopData.IdPhongHop).subscribe((res) => {
            if (res.status == 1 && res.data) {
              this.lstPH = res.data;
              this.filteredPH.next(this.lstPH);
              this.changeDetectorRefs.detectChanges();
            }
          });
        }
        else {
          let thoigianstart = this.f_convertDate(this.NgayBatDau) + " " + this.GioBatDau;
          let thoigianend = this.f_convertDate(this.NgayBatDau) + " " + this.GioKetThuc;
          this.CuocHopService.GetAllPhongHop(thoigianstart, thoigianend, 0).subscribe((res) => {
            if (res.status == 1 && res.data) {
              this.lstPH = res.data;
              this.filteredPH.next(this.lstPH);
              this.changeDetectorRefs.detectChanges();
            }
          });
        }
      }
      else {
        let thoigianstart = this.f_convertDate(this.NgayBatDau) + " " + this.GioBatDau;
        let thoigianend = this.f_convertDate(this.NgayBatDau) + " " + this.GioKetThuc;
        this.CuocHopService.GetAllPhongHop(thoigianstart, thoigianend, 0).subscribe((res) => {
          if (res.status == 1 && res.data) {
            this.lstPH = res.data;
            this.filteredPH.next(this.lstPH);
            this.changeDetectorRefs.detectChanges();
          }
        });
      }
    }

    if (this.TypeMeeting == '2') {
      if (this.CuocHopData != undefined) {
        if (this.CuocHopData.IdPhongHop > 0) {
          let thoigianstart = this.f_convertDate(this.NgayBatDau) + " " + this.GioBatDau;
          let thoigianend = this.f_convertDate(this.NgayKetThuc) + " " + this.GioKetThuc;
          this.CuocHopService.GetAllPhongHop(thoigianstart, thoigianend, this.CuocHopData.IdPhongHop).subscribe((res) => {
            if (res.status == 1 && res.data) {
              this.lstPH = res.data;
              this.filteredPH.next(this.lstPH);
              this.changeDetectorRefs.detectChanges();
            }
          });
        }
        else {
          let thoigianstart = this.f_convertDate(this.NgayBatDau) + " " + this.GioBatDau;
          let thoigianend = this.f_convertDate(this.NgayKetThuc) + " " + this.GioKetThuc;
          this.CuocHopService.GetAllPhongHop(thoigianstart, thoigianend, 0).subscribe((res) => {
            if (res.status == 1 && res.data) {
              this.lstPH = res.data;
              this.filteredPH.next(this.lstPH);
              this.changeDetectorRefs.detectChanges();
            }
          });
        }
      }
      else {
        let thoigianstart = this.f_convertDate(this.NgayBatDau) + " " + this.GioBatDau;
        let thoigianend = this.f_convertDate(this.NgayKetThuc) + " " + this.GioKetThuc;
        this.CuocHopService.GetAllPhongHop(thoigianstart, thoigianend, 0).subscribe((res) => {
          if (res.status == 1 && res.data) {
            this.lstPH = res.data;
            this.filteredPH.next(this.lstPH);
            this.changeDetectorRefs.detectChanges();
          }
        });
      }
    }
  }

  loadEditMeet(el, el2, el3, el4, el5) {
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
  createForm() {
    this.CuocHopForm = this.CuocHopFB.group({
      TenCuocHop: ["", [Validators.required, Validators.pattern(/[\S]/)]],
      ThoiGianBatDau: ["" + new Date(), Validators.required],
      thoigianbatdau: ["", Validators.required],
      ThoiGianKetThuc: ["" + new Date(), Validators.required],
      thoigianketthuc: ["", Validators.required],
      IdPhongHopOffline: ["0", [Validators.required, Validators.min(0)]],
      IdDiagram: ["0"],
      DiaDiem: [""],
      SoKyHieu: [""],
      Type: [this.selectedZoom],
      ThuMoi: [this.IdThuMoiSelected],
      XacNhanThamGia: [""],
      NhapTomTat: [""],
      GhiChu: [""],
      GhiChuChoNguoiThemTaiLieu: [""],
      linkHopNgoai: [""],
      IDPhongHop: [this.idpz + ""],
      TypeMeeting: [this.TypeMeeting],
      PrivateMeeting: [false],
      IdKhoaHop: [""],
      IdPhienHop: ["0"],
      IdKyHop: ["0"],
      LoginMeeting: [""],
      TypeThanhPhan: [this.TypeThanhPhan],//Type 1: cuộc họp bình thường, Type 2: cuộc họp theo luồng mới
    });

    // this.store = new BehaviorSubject({
    //   TenCuocHop: this.CuocHopForm.controls["TenCuocHop"],
    //   ThoiGianBatDau: this.CuocHopForm.controls["ThoiGianBatDau"],
    //   thoigianbatdau: this.CuocHopForm.controls["thoigianbatdau"],
    //   ThoiGianKetThuc: this.CuocHopForm.controls["ThoiGianKetThuc"],
    //   thoigianketthuc: this.CuocHopForm.controls["thoigianketthuc"],
    //   IdPhongHopOffline: this.CuocHopForm.controls["IdPhongHopOffline"],
    //   IdDiagram: this.CuocHopForm.controls["IdDiagram"],
    //   DiaDiem: this.CuocHopForm.controls["DiaDiem"],
    //   SoKyHieu: this.CuocHopForm.controls["SoKyHieu"],
    //   Type: this.CuocHopForm.controls["Type"],
    //   ThuMoi: this.CuocHopForm.controls["ThuMoi"],
    //   XacNhanThamGia: this.CuocHopForm.controls["XacNhanThamGia"],
    //   NhapTomTat: this.CuocHopForm.controls["NhapTomTat"],
    //   GhiChu: this.CuocHopForm.controls["GhiChu"],
    //   GhiChuChoNguoiThemTaiLieu: this.CuocHopForm.controls["GhiChuChoNguoiThemTaiLieu"],
    //   linkHopNgoai: this.CuocHopForm.controls["linkHopNgoai"],
    //   IDPhongHop: this.CuocHopForm.controls["IDPhongHop"],
    //   TypeMeeting: this.CuocHopForm.controls["TypeMeeting"],
    //   PrivateMeeting: this.CuocHopForm.controls["PrivateMeeting"],
    //   IdKhoaHop: this.CuocHopForm.controls["IdKhoaHop"],
    //   IdPhienHop: this.CuocHopForm.controls["IdPhienHop"],
    //   IdKyHop: this.CuocHopForm.controls["IdKyHop"],
    //   LoginMeeting: this.CuocHopForm.controls["LoginMeeting"],
    //   TypeThanhPhan: this.CuocHopForm.controls["TypeThanhPhan"],
    // });
    // this.isDirty$ = dirtyCheck(this.CuocHopForm, this.store);
    // this.sub = this.isDirty$.subscribe((res) => {
    //   this.goBack = res
    //   console.log(this.goBack)
    // })
    this.changeDetectorRefs.detectChanges();
  }
  createFormEdit() {

    this.selectedZoom = this.CuocHopData.ZoomMeeting;
    this.selectedGoogle = this.CuocHopData.GoogleMeeting;
    this.selectedWebex = this.CuocHopData.WebexMeeting;
    if (this.selectedZoom) {
      this.idZoom = this.CuocHopData.IdKey
    }
    if (this.selectedGoogle) {
      this.idGoogle = this.CuocHopData.IdKey
    }
    if (this.selectedWebex) {
      this.idWebex = this.CuocHopData.IdKey
    }
    this.IdThuMoiSelected = this.CuocHopData.IdThuMoi
    if (this.IdThuMoiSelected != "0") {

      this.addNguoiThamGia = false
    }
    this.CuocHopForm = this.CuocHopFB.group({
      TenCuocHop: [this.CuocHopData.TenCuocHop],
      IdKhoaHop: ['' + this.CuocHopData.IdKhoaHop],
      IdPhienHop: ['' + this.CuocHopData.IdPhienHop],
      IdKyHop: ['' + this.CuocHopData.IdKyHop],
      IdPhongHopOffline: [this.CuocHopData.IdPhongHop > 0 ? this.CuocHopData.IdPhongHop + '' : "0"],
      IdDiagram: [this.CuocHopData.IdDiagram > 0 ? this.CuocHopData.IdDiagram + '' : "0"],
      //   IdDiagram: [this.CuocHopData.IdDiagram > 0 ? -100 : "0"], // -100 or anything, but not exits in dropdown value // IdDiagram: [this.CuocHopData.IdDiagram > 0 ? this.CuocHopData.IdDiagram : "0"],
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
      ThuMoi: [this.CuocHopData.IdThuMoi],
      XacNhanThamGia: [this.CuocHopData.XacNhanThamGia],
      NhapTomTat: [this.CuocHopData.NhapTomTat],
      GhiChu: [this.CuocHopData.GhiChu],
      GhiChuChoNguoiThemTaiLieu: [this.CuocHopData.GhiChuChoNguoiThemTaiLieu],
      linkHopNgoai: [this.CuocHopData.Link],
      IDPhongHop: ["" + this.CuocHopData.IDPhongHop ? this.CuocHopData.IDPhongHop : this.idpz],
      TypeMeeting: ["" + this.CuocHopData.TypeMeeting],
      PrivateMeeting: [this.CuocHopData.PrivateMeeting],
      LoginMeeting: [this.CuocHopData.LoginMeeting],
      TypeThanhPhan: [this.CuocHopData.Type],
      MaPX: [this.inputId ? this.inputId : ""],
    });
    // this.ListDonVi=this.CuocHopData.ListDonVi_
    this.TypeThanhPhan = this.CuocHopData.Type
    this.TypeMeeting = "" + this.CuocHopData.TypeMeeting
    this.GioBatDau = this.CuocHopData.GioBatDau;
    this.clickNhapTomTat = this.CuocHopData.NhapTomTat;
    this.listNguoiThamGia = this.CuocHopData.ListThamGia;
    this.listNguoiTheoDoi = this.CuocHopData.ListTheoDoi;
    this.listNguoiTomTat = this.CuocHopData.ListTomTat;
    this.listKhachMoi = this.CuocHopData.ListKhachMoi;
    this.listNguoiThemTaiLieu = this.CuocHopData.ListThemTaiLieu;
    this.listNguoiKhac = this.CuocHopData.ListTPKhac;
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

    if (this.CuocHopData.ZoomMeeting) {
      this.checkedZoom = true;
      this.selectedZoom = true;
    } else if (this.CuocHopData.GoogleMeeting) {
      this.checkedGoogle = true;
      this.selectedGoogle = true;
    } else if (this.CuocHopData.WebexMeeting) {
      this.checkedWebex = true;
      this.selectedWebex = true;
    } else if (this.CuocHopData.TeamsMeeting) {
      this.selectedTeams = true;
      this.checkedTeams = true;
    } else if (this.CuocHopData.OtherMeeting) {
      this.selectedOther = true;
      this.checkedOther = true;
    }
    this.ListFileDinhKem = this.CuocHopData.FileDinhKem;
    this.ListFileDinhKemThuMoi = this.CuocHopData.FileDinhKemThuMoi;


    // if(this.CuocHopData.ListDonViThamGia.length > 0){
    //   this.meetingType1_member = 1
    //   this.listNguoiThamGia_dept = this.CuocHopData.ListDonViThamGia
    // }
    // if(this.CuocHopData.ListDonViTheoDoi.length > 0){
    //   this.meetingType2_member = 1
    //   this.listNguoiTheoDoi_dept = this.CuocHopData.ListDonViTheoDoi
    // }
    // if(this.CuocHopData.ListDonViTomTat.length > 0){
    //   this.meetingType3_member = 1
    //   this.listNguoiTomTat_dept = this.CuocHopData.ListDonViTomTat
    // }
    // if(this.CuocHopData.ListDonViKhachMoi.length > 0){
    //   this.meetingType4_member = 1
    //   this.listKhachMoi_dept = this.CuocHopData.ListDonViKhachMoi
    // }
    // if(this.CuocHopData.ListDonViThemTaiLieu.length > 0){
    //   this.meetingType6_member = 1
    //   this.listNguoiThemTaiLieu_dept = this.CuocHopData.ListDonViThemTaiLieu
    // }
    // ------------------------------
    if (this.CuocHopData.ListNhomUserThamGia.length > 0) {
      this.meetingType1_member = 2
      this.listNguoiThamGia_group = this.CuocHopData.ListNhomUserThamGia
    }
    if (this.CuocHopData.ListNhomUserTheoDoi.length > 0) {
      this.meetingType2_member = 2
      this.listNguoiTheoDoi_group = this.CuocHopData.ListNhomUserTheoDoi
    }
    if (this.CuocHopData.ListNhomUserTomTat.length > 0) {
      this.meetingType3_member = 2
      this.listNguoiTomTat_group = this.CuocHopData.ListNhomUserTomTat
    }
    if (this.CuocHopData.ListNhomUserKhachMoi.length > 0) {
      this.meetingType4_member = 2
      this.listKhachMoi_group = this.CuocHopData.ListNhomUserKhachMoi
    }
    if (this.CuocHopData.ListNhomUserThemTaiLieu.length > 0) {
      this.meetingType6_member = 2
      this.listNguoiThemTaiLieu_group = this.CuocHopData.ListNhomUserThemTaiLieu
    }

    if (this.CuocHopData.ListNhomUserThanhPhanKhac.length > 0) {
      this.meetingType7_member = 2
      this.listNguoiKhac_group = this.CuocHopData.ListNhomUserThanhPhanKhac
    }
    // -----------------
    if (this.CuocHopData.ListDonViThamGia.length > 0 && (this.CuocHopData.ListThamGia.length > 0 || this.CuocHopData.ListThamGia.length == 0)) {
      this.meetingType1_member = 3
      this.listNguoiThamGia_dept = this.CuocHopData.ListDonViThamGia
      this.listNguoiThamGia = this.listNguoiThamGia.filter(x => x.DeptId == 0)
    }

    if (this.CuocHopData.ListDonViTheoDoi.length > 0 && (this.CuocHopData.ListThamGia.length > 0 || this.CuocHopData.ListThamGia.length == 0)) {
      this.meetingType2_member = 3
      this.listNguoiTheoDoi_dept = this.CuocHopData.ListDonViTheoDoi
      this.listNguoiTheoDoi = this.listNguoiTheoDoi.filter(x => x.DeptId == 0)
    }

    if (this.CuocHopData.ListDonViTomTat.length > 0 && (this.CuocHopData.ListThamGia.length > 0 || this.CuocHopData.ListThamGia.length == 0)) {
      this.meetingType3_member = 3
      this.listNguoiTomTat_dept = this.CuocHopData.ListDonViTomTat
      this.listNguoiTomTat = this.listNguoiTomTat.filter(x => x.DeptId == 0)
    }

    if (this.CuocHopData.ListDonViKhachMoi.length > 0 && (this.CuocHopData.ListThamGia.length > 0 || this.CuocHopData.ListThamGia.length == 0)) {
      this.meetingType4_member = 3
      this.listKhachMoi_dept = this.CuocHopData.ListDonViKhachMoi
      this.listKhachMoi = this.listKhachMoi.filter(x => x.DeptId == 0)
    }

    if (this.CuocHopData.ListDonViThemTaiLieu.length > 0 && (this.CuocHopData.ListThamGia.length > 0 || this.CuocHopData.ListThamGia.length == 0)) {
      this.meetingType6_member = 3
      this.listNguoiThemTaiLieu_dept = this.CuocHopData.ListDonViThemTaiLieu
      this.listNguoiThemTaiLieu = this.listNguoiThemTaiLieu.filter(x => x.DeptId == 0)
    }

    if (this.CuocHopData.ListDonViThanhPhanKhac.length > 0 && (this.CuocHopData.ListThanhPhanKhac.length > 0 || this.CuocHopData.ListThanhPhanKhac.length == 0)) {
      this.meetingType7_member = 3
      this.listNguoiKhac_dept = this.CuocHopData.ListDonViThanhPhanKhac
      this.listNguoiKhac = this.listNguoiThemTaiLieu.filter(x => x.DeptId == 0)
    }

    this.clickPrivate = this.CuocHopData.PrivateMeeting

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
  ListKeyDonViZoom() {
    this.CuocHopService.listKey(1).subscribe(res => {
      if (res && res.status === 1) {
        this.listKeyDonViZoom = res.data;
        this.changeDetectorRefs.detectChanges();
      };
    });
  }
  ListKeyDonViGoogle() {
    this.CuocHopService.listKey(2).subscribe(res => {
      if (res && res.status === 1) {
        this.listKeyDonViGoogle = res.data;
        this.changeDetectorRefs.detectChanges();
      };
    });
  }
  detectChanges() {
    this.inputId.push(this.dataTem.MaPX);
    this.dataSource.push(this.dataTem);
    this.DSDonVi = this.dataSource;
    this.dataSource = this.DSDonVi.filter((x) => !x.IsDel);
    this.CuocHopForm.controls['MaPX'].setValue(this.inputId);
    this.changeDetectorRefs.detectChanges();

  }



  ListKeyDonViWebex() {
    this.CuocHopService.listKey(3).subscribe(res => {
      if (res && res.status === 1) {
        this.listKeyDonViWebex = res.data;
        this.changeDetectorRefs.detectChanges();
      };
    });
  }
  selectThuMoi($event) {
    this.IdThuMoiSelected = $event.value;
    if (this.IdThuMoiSelected == "0") {
      this.listNguoiThamGia = []
      this.addNguoiThamGia = true
    } else {
      this.listNguoiThamGia = []
      this.CuocHopService.getThanhPhanThuMoi(this.IdThuMoiSelected).subscribe(res => {
        if (res && res.status === 1) {
          this.listNguoiThamGia = res.data;
          this.addNguoiThamGia = false
          this.changeDetectorRefs.detectChanges();
        };
      });
    }
  }

  ListIdKhoaHop() {
    this.CuocHopService.listIdKhoaHop().subscribe(res => {

      this.loadingSubject.next(false);
      if (res && res.status === 1) {
        this.listIdKhoaHop = res.data;
        //this.selectIdNhomDonVi = '' + this.listIdNhomDonVi[0].IdNhom;
        this.changeDetectorRefs.detectChanges();
      };
    });
  }

  ListIdPhienHop() {
    this.CuocHopService.listIdPhienHop().subscribe(res => {

      this.loadingSubject.next(false);
      if (res && res.status === 1) {
        this.listIdPhienHop = res.data;
        //this.selectIdNhomDonVi = '' + this.listIdNhomDonVi[0].IdNhom;
        this.changeDetectorRefs.detectChanges();
      };
    });
  }
  ListIdKyHop() {
    this.CuocHopService.listIdKyHop().subscribe(res => {
      this.loadingSubject.next(false);
      if (res && res.status === 1) {
        this.listIdKyHop = res.data;
        //this.selectIdNhomDonVi = '' + this.listIdNhomDonVi[0].IdNhom;
        this.changeDetectorRefs.detectChanges();
      };
    });
  }
  selectGoogleMeet($event) {
    this.idGoogle = $event.value;
    this.CuocHopService.Config(2, -1).subscribe((res: any) => {
      if (res && res.status === 1) {
        if (res.data.config == false) {
          const _description =
            this.translate.instant("QL_CUOCHOP.NOTI_GGMEET_NOTYET");
          this.layoutUtilsService.showActionNotification(_description, MessageType.Read, 999999999);
          return;
        } else {
          //Lấy client_id để có thể tạo phòng họp google meet theo đơn vị
          this.client_id = res.data.client_id
        }
      }
    });

  }
  selectWebexMeet($event) {
    this.idWebex = $event.value;
    this.CuocHopService.Config(3, -1).subscribe((res: any) => {
      if (res && res.status === 1) {
        if (res.data.config == false) {
          const _description =
            this.translate.instant("QL_CUOCHOP.NOTI_CWEBEX_NOTYET");
          this.layoutUtilsService.showActionNotification(_description, MessageType.Read, 999999999);
          return;
        } else {
          localStorage.setItem('webex_id', this.idWebex);
          this.client_id = res.data.client_id
          this.client_secret = res.data.client_secret
        }
      }
    });

  }
  GetListThuMoi() {
    this.filteredId_ThuMoi.next([]);
    this.lstThuMoi = [];
    this.CuocHopService.getThuMoi().subscribe(res => {
      if (res && res.status === 1) {
        if (res.data) {
          this.lstThuMoi = res.data;
          this.filteredId_ThuMoi.next(this.lstThuMoi.slice());
          this.changeDetectorRefs.detectChanges();
        }
      }
    },
      err => {
        const message = err.error.error.message;
        this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 2000, true, false);
      },
    )
  }
  filterId_ThuMoi() {
    //
    if (!this.lstThuMoi) {
      return;
    }
    let search = this.DungChungDropdown.nonAccentVietnamese(this.searchThuMoi)//this.searchThuMoi;
    if (!search) {
      this.filteredId_ThuMoi.next(this.lstThuMoi.slice());
      return;
    }
    // else {
    // 	search = search.toLowerCase();
    // }
    this.filteredId_ThuMoi.next(
      this.lstThuMoi.filter(ts =>
        this.DungChungDropdown.nonAccentVietnamese(ts.TieuDe).indexOf(search) > -1)//ts.TieuDe.toLowerCase().indexOf(search) > -1)
    );
    this.changeDetectorRefs.detectChanges();
  }


  //zoom
  GetListKeyZoom() {
    this.filteredId_Zoom.next([]);
    this.listKeyDonViZoom = [];
    this.CuocHopService.listKey(1).subscribe(res => {
      if (res && res.status === 1) {
        this.listKeyDonViZoom = res.data;
        this.idpz = res.data[0].RowID;

        this.filteredId_Zoom.next(this.listKeyDonViZoom.slice());
        this.CuocHopForm.get("IDPhongHop").setValue(this.idpz)
        this.changeDetectorRefs.detectChanges();
      };
    },
      err => {
        const message = err.error.error.message;
        this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 2000, true, false);
      },
    );
  }
  filterId_Zoom() {
    //
    if (!this.listKeyDonViZoom) {
      return;
    }
    let search = this.searchZoom;
    if (!search) {
      this.filteredId_Zoom.next(this.listKeyDonViZoom.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredId_Zoom.next(
      this.listKeyDonViZoom.filter(ts =>
        ts.Noidung.toLowerCase().indexOf(search) > -1)
    );
    this.changeDetectorRefs.detectChanges();
  }
  //google
  GetListKeyGoogle() {
    this.filteredId_Google.next([]);
    this.listKeyDonViGoogle = [];
    this.CuocHopService.listKey(2).subscribe(res => {
      if (res && res.status === 1) {
        this.listKeyDonViGoogle = res.data;
        this.filteredId_Google.next(this.listKeyDonViGoogle.slice());
        this.changeDetectorRefs.detectChanges();
      };
    },
      err => {
        const message = err.error.error.message;
        this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 2000, true, false);
      },
    );
  }
  filterId_Google() {
    //
    if (!this.listKeyDonViGoogle) {
      return;
    }
    let search = this.searchGoogle;
    if (!search) {
      this.filteredId_Google.next(this.listKeyDonViGoogle.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredId_Google.next(
      this.listKeyDonViGoogle.filter(ts =>
        ts.Noidung.toLowerCase().indexOf(search) > -1)
    );
    this.changeDetectorRefs.detectChanges();
  }
  //webex
  GetListKeyWebex() {
    this.filteredId_Webex.next([]);
    this.listKeyDonViWebex = [];
    this.CuocHopService.listKey(3).subscribe(res => {
      if (res && res.status === 1) {
        this.listKeyDonViWebex = res.data;
        this.filteredId_Webex.next(this.listKeyDonViWebex.slice());
        this.changeDetectorRefs.detectChanges();
      };
    },
      err => {
        const message = err.error.error.message;
        this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 2000, true, false);
      },
    );
  }
  filterId_Webex() {
    if (!this.listKeyDonViWebex) {
      return;
    }
    let search = this.searchWebex;
    if (!search) {
      this.filteredId_Webex.next(this.listKeyDonViWebex.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredId_Webex.next(
      this.listKeyDonViWebex.filter(ts =>
        ts.Noidung.toLowerCase().indexOf(search) > -1)
    );
    this.changeDetectorRefs.detectChanges();
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
  onSubmit() {
    if (!this.goBack) {
      alert('có thay đổi')
      return;
    }
    this.disabledBtn = true;
    this.hasFormErrors = false;
    const controls = this.CuocHopForm.controls;
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

    // kiểm tra khi bỏ trống key zoom
    if (this.selectedZoom) {
      if (controls['IDPhongHop'].value == null || controls['IDPhongHop'].value == '0') {
        this.layoutUtilsService.showActionNotification(
          this.translate.instant("QL_CUOCHOP.NOTI_ZOOM_KEY"),
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



    // if (this.listNguoiThemTaiLieu.length==0&&this.files[0].data.strBase64==undefined) {
    //     this.layoutUtilsService.showActionNotification(
    //       this.translate.instant("QL_CUOCHOP.NOTI_CHON_NGUOITHEMTAILIEU"),
    //       MessageType.Warning,
    //       2000,
    //       true,
    //       false,
    //       1
    //     );
    //     this.disabledBtn = false;
    //     return;
    // }
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
    }
    _CuocHop.TenCuocHop = controls['TenCuocHop'].value;

    let phut = moment(controls["thoigianketthuc"].value, "HH:mm").diff(
      moment(controls["thoigianbatdau"].value, "HH:mm"),
      "minute"
    );

    _CuocHop.ThoiGianBatDau = this.f_convertDate00(controls['ThoiGianBatDau'].value);
    _CuocHop.GioBatDau = controls['thoigianbatdau'].value;
    _CuocHop.ThoiLuongPhut = phut + '';
    _CuocHop.IdKhoaHop = controls['IdKhoaHop'].value == "" ? 0 : Number(controls['IdKhoaHop'].value);
    _CuocHop.IdPhienHop = controls['IdPhienHop'].value;
    _CuocHop.IdKyHop = controls['IdKyHop'].value;
    _CuocHop.DiaChi = controls['DiaDiem'].value;
    _CuocHop.SoKyHieu = controls['SoKyHieu'].value;
    _CuocHop.XacNhanThamGia = false,
      _CuocHop.NhapTomTat = controls["NhapTomTat"].value == "" ? false : controls["NhapTomTat"].value,
      _CuocHop.GhiChu = controls['GhiChu'].value;
    _CuocHop.GhiChuChoNguoiThemTaiLieu = controls['GhiChuChoNguoiThemTaiLieu'].value;
    _CuocHop.Type = +controls['TypeThanhPhan'].value;
    _CuocHop.ListDonVi = this.dataSource;
    if (this.selectedZoom) {
      _CuocHop.IdKey = controls['IDPhongHop'].value;
    }

    _CuocHop.TypeMeeting = this.TypeMeeting

    if (this.TypeMeeting == '2') {
      debugger
      let phut = moment(this.f_convertDateStart(controls["ThoiGianBatDau"].value)).diff(
        moment(this.f_convertDateEnd(controls["ThoiGianKetThuc"].value)),
        "minute"
      );
      _CuocHop.ThoiLuongPhut = Math.abs(phut) + '';
    }
    // if(this.selectedGoogle){
    //   _CuocHop.IdKey = controls['IDGoogle'].value;
    // }
    // if(this.selectedWebex){
    //   _CuocHop.IdKey = controls['IDWebex'].value;
    // }
    _CuocHop.IdThuMoi = controls['ThuMoi'].value;
    _CuocHop.ZoomMeeting = this.selectedZoom;
    _CuocHop.GoogleMeeting = this.selectedGoogle;
    _CuocHop.WebexMeeting = this.selectedWebex;
    _CuocHop.TeamsMeeting = this.selectedTeams
    _CuocHop.OtherMeeting = this.selectedOther
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
      this.listNguoiKhac_dept.forEach(element => {
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
      this.listNguoiKhac.push(...data_user);
    }

    _CuocHop.ListTPKhac = this.listNguoiKhac;
    _CuocHop.ListKhachMoi = this.listKhachMoi;

    _CuocHop.TenKhoaHop = this.TenKhoaHop;
    _CuocHop.IsDuyet = this.CuocHop.IsDuyet;
    _CuocHop.TenPhongHop = this.TenPhongHop;
    _CuocHop.IdPhongHop = controls['IdPhongHopOffline'].value;
    // _CuocHop.IdDiagramOld = this.idDiagramOld;
    _CuocHop.IdDiagram = controls['IdDiagram'].value;
    _CuocHop.token = token;
    _CuocHop.Link = controls["linkHopNgoai"].value == ""
      ? '' : controls["linkHopNgoai"].value;
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
    _CuocHop.LoginMeeting = controls['LoginMeeting'].value == "" ? false : controls['LoginMeeting'].value;

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

  //Component chọn user tham gia, theo dõi và nhập nội dung, tóm tăt

  AddThanhVien(loai: number) {
    let private_meeet = this.clickPrivate
    if (loai == 1) {
      let _item = []
      let meetingType_member = this.meetingType1_member
      if (this.meetingType1_member == 0) {
        _item = this.listNguoiThamGia_group
        meetingType_member = 3
      }
      if (this.meetingType1_member == 1) {
        _item = this.listNguoiThamGia_dept
        meetingType_member = 3
      }
      if (this.meetingType1_member == 2) {
        _item = this.listNguoiThamGia_group
      }
      if (this.meetingType1_member == 3 || this.meetingType1_member == 0 || this.meetingType1_member == 1) {
        const list1 = this.listNguoiThamGia.map((obj) => obj.idUser + '##').join(',');
        const list2 = this.listNguoiThamGia_dept.map((obj) => obj.RowID).join(',');
        var inputNodeId = list1.concat(',', list2);
      }
      let meeet_type_nember = loai
      const dialogRef = this.dialog.open(ChooseMemberV2Component, { data: { _item, inputNodeId, meetingType_member, private_meeet, meeet_type_nember }, width: '60%' });
      // const dialogRef = this.dialog.open(TreeMenberComponent, { data: { _item,inputNodeId, meetingType_member,private_meeet,meeet_type_nember }, width: '85%' });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
        if (res.type == 0) {
          this.meetingType1_member = 0
          this.listNguoiThamGia = res.data
        }
        if (res.type == 1) {
          this.meetingType1_member = 1
          this.listNguoiThamGia_dept = res.data

          let data_user = []
          res.data.forEach(element => {
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
          this.listNguoiThamGia = data_user
        }
        if (res.type == 2) {
          this.meetingType1_member = 2
          this.listNguoiThamGia_group = res.data
          let data_user = []
          res.data.forEach(element => {
            if (element.UserIdList && element.UserIdList.length > 0) {
              element.UserIdList.forEach(el => {
                let fields = {
                  idUser: el.UserId,
                  username: el.Username,
                  DeptId: 0,
                  GroupId: element.RowID,
                }
                data_user.push(fields)
              });
            }
          });
          this.listNguoiThamGia = data_user
        }

        if (res.type == 3) {
          this.meetingType1_member = 3
          this.listNguoiThamGia = res.data
          this.listNguoiThamGia_dept = res.data2
        }
        this.changeDetectorRefs.detectChanges();
      });
    }
    if (loai == 2) {
      let _item = this.listNguoiTheoDoi;
      let meetingType_member = this.meetingType2_member
      if (this.meetingType2_member == 0) {
        _item = this.listNguoiTheoDoi
        meetingType_member = 3
      }
      if (this.meetingType2_member == 1) {
        _item = this.listNguoiTheoDoi_dept
        meetingType_member = 3
      }
      if (this.meetingType2_member == 2) {
        _item = this.listNguoiTheoDoi_group
      }
      if (this.meetingType2_member == 3 || this.meetingType2_member == 0 || this.meetingType2_member == 1) {
        const list1 = this.listNguoiTheoDoi.map((obj) => obj.idUser + '##').join(',');
        const list2 = this.listNguoiTheoDoi_dept.map((obj) => obj.RowID).join(',');
        var inputNodeId = list1.concat(',', list2);
      }
      let meeet_type_nember = loai
      const dialogRef = this.dialog.open(ChooseMemberV2Component, { data: { _item, inputNodeId, meetingType_member, private_meeet, meeet_type_nember }, width: '60%' });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
        if (res.type == 0) {
          this.meetingType2_member = 0
          this.listNguoiTheoDoi = res.data
        }
        if (res.type == 1) {
          this.meetingType2_member = 1
          this.listNguoiTheoDoi_dept = res.data
          let data_user = []
          res.data.forEach(element => {
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
          this.listNguoiTheoDoi = data_user
        }
        if (res.type == 2) {
          this.meetingType2_member = 2
          this.listNguoiTheoDoi_group = res.data
          let data_user = []
          res.data.forEach(element => {
            if (element.UserIdList && element.UserIdList.length > 0) {
              element.UserIdList.forEach(el => {
                let fields = {
                  idUser: el.UserId,
                  username: el.Username,
                  DeptId: 0,
                  GroupId: element.RowID,
                }
                data_user.push(fields)
              });
            }
          });
          this.listNguoiTheoDoi = data_user
        }

        if (res.type == 3) {
          this.meetingType2_member = 3
          this.listNguoiTheoDoi = res.data
          this.listNguoiTheoDoi_dept = res.data2
        }
        this.changeDetectorRefs.detectChanges();
      });
    }
    if (loai == 3) {
      let _item = this.listNguoiTomTat;
      let meetingType_member = this.meetingType3_member
      if (this.meetingType3_member == 0) {
        _item = this.listNguoiTomTat
        meetingType_member = 3
      }
      if (this.meetingType3_member == 1) {
        _item = this.listNguoiTomTat_dept
        meetingType_member = 3
      }
      if (this.meetingType3_member == 2) {
        _item = this.listNguoiTomTat_group
      }
      if (this.meetingType3_member == 3 || this.meetingType3_member == 0 || this.meetingType3_member == 1) {
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
        if (res.type == 0) {
          this.meetingType3_member = 0
          this.listNguoiTomTat = res.data
        }
        if (res.type == 1) {
          this.meetingType3_member = 1
          this.listNguoiTomTat_dept = res.data

          let data_user = []
          res.data.forEach(element => {
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
          this.listNguoiTomTat = data_user
        }
        if (res.type == 2) {
          this.meetingType3_member = 2
          this.listNguoiTomTat_group = res.data
          let data_user = []
          res.data.forEach(element => {
            if (element.UserIdList && element.UserIdList.length > 0) {
              element.UserIdList.forEach(el => {
                let fields = {
                  idUser: el.UserId,
                  username: el.Username,
                  DeptId: 0,
                  GroupId: element.RowID,
                }
                data_user.push(fields)
              });
            }
          });
          this.listNguoiTomTat = data_user
        }

        if (res.type == 3) {
          this.meetingType3_member = 3
          this.listNguoiTomTat = res.data
          this.listNguoiTomTat_dept = res.data2
        }
        this.changeDetectorRefs.detectChanges();
      });
    }
    if (loai == 4) {
      // let _item = this.listKhachMoi;
      let _item = this.listKhachMoi;
      let meetingType_member = this.meetingType4_member
      if (this.meetingType4_member == 0) {
        _item = this.listKhachMoi
        meetingType_member = 3
      }
      if (this.meetingType4_member == 1) {
        _item = this.listKhachMoi_dept
        meetingType_member = 3
      }
      if (this.meetingType4_member == 2) {
        _item = this.listKhachMoi_group
      }
      if (this.meetingType4_member == 3 || this.meetingType4_member == 0 || this.meetingType4_member == 1) {
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
        // this.listKhachMoi = res.data
        // this.changeDetectorRefs.detectChanges();
        if (res.type == 0) {
          this.meetingType4_member = 0
          this.listKhachMoi = res.data
        }
        if (res.type == 1) {
          this.meetingType4_member = 1
          this.listKhachMoi_dept = res.data
          let data_user = []
          res.data.forEach(element => {
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
          this.listKhachMoi = data_user
        }
        if (res.type == 2) {
          this.meetingType4_member = 2
          this.listKhachMoi_group = res.data
          let data_user = []
          res.data.forEach(element => {
            if (element.UserIdList && element.UserIdList.length > 0) {
              element.UserIdList.forEach(el => {
                let fields = {
                  idUser: el.UserId,
                  username: el.Username,
                  DeptId: 0,
                  GroupId: element.RowID,
                }
                data_user.push(fields)
              });
            }
          });
          this.listKhachMoi = data_user
        }

        if (res.type == 3) {
          this.meetingType4_member = 3
          this.listKhachMoi = res.data
          this.listKhachMoi_dept = res.data2
        }
        this.changeDetectorRefs.detectChanges();
      });
    }
    if (loai == 6) {
      // let _item = this.listNguoiThemTaiLieu;
      let _item = this.listNguoiThemTaiLieu;
      let meetingType_member = this.meetingType6_member
      if (this.meetingType6_member == 0) {
        _item = this.listNguoiThemTaiLieu
        meetingType_member = 3
      }
      if (this.meetingType6_member == 1) {
        _item = this.listNguoiThemTaiLieu_dept
        meetingType_member = 3
      }
      if (this.meetingType6_member == 2) {
        _item = this.listNguoiThemTaiLieu_group
      }
      if (this.meetingType6_member == 3 || this.meetingType6_member == 0 || this.meetingType6_member == 1) {
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
        // this.listNguoiThemTaiLieu = res.data
        // this.changeDetectorRefs.detectChanges();

        if (res.type == 0) {
          this.meetingType6_member = 0
          this.listNguoiThemTaiLieu = res.data
        }
        if (res.type == 1) {
          this.meetingType6_member = 1
          this.listNguoiThemTaiLieu_dept = res.data
          let data_user = []
          res.data.forEach(element => {
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
          this.listNguoiThemTaiLieu = data_user
        }
        if (res.type == 2) {
          this.meetingType6_member = 2
          this.listNguoiThemTaiLieu_group = res.data
          let data_user = []
          res.data.forEach(element => {
            if (element.UserIdList && element.UserIdList.length > 0) {
              element.UserIdList.forEach(el => {
                let fields = {
                  idUser: el.UserId,
                  username: el.Username,
                  DeptId: 0,
                  GroupId: element.RowID,
                }
                data_user.push(fields)
              });
            }
          });
          this.listNguoiThemTaiLieu = data_user
        }

        if (res.type == 3) {
          this.meetingType6_member = 3
          this.listNguoiThemTaiLieu = res.data
          this.listNguoiThemTaiLieu_dept = res.data2
        }
        this.changeDetectorRefs.detectChanges();
      });
    }


    if (loai == 7) {
      // let _item = this.listNguoiThemTaiLieu;
      let _item = this.listNguoiKhac;
      let meetingType_member = this.meetingType7_member
      if (this.meetingType7_member == 0) {
        _item = this.listNguoiKhac
        meetingType_member = 3
      }
      if (this.meetingType7_member == 1) {
        _item = this.listNguoiKhac_dept
        meetingType_member = 3
      }
      if (this.meetingType7_member == 2) {
        _item = this.listNguoiKhac_group
      }
      if (this.meetingType7_member == 3 || this.meetingType7_member == 0 || this.meetingType7_member == 1) {
        const list1 = this.listNguoiKhac.map((obj) => obj.idUser + '##').join(',');
        const list2 = this.listNguoiKhac_dept.map((obj) => obj.RowID).join(',');
        var inputNodeId = list1.concat(',', list2);
      }
      let meeet_type_nember = 7
      const dialogRef = this.dialog.open(ChooseMemberV2Component, { data: { _item, inputNodeId, meetingType_member, private_meeet, meeet_type_nember }, width: '60%' });
      dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
        // this.listNguoiThemTaiLieu = res.data
        // this.changeDetectorRefs.detectChanges();

        if (res.type == 0) {
          this.meetingType7_member = 0
          this.listNguoiKhac = res.data
        }
        if (res.type == 1) {
          this.meetingType7_member = 1
          this.listNguoiKhac_dept = res.data
          let data_user = []
          res.data.forEach(element => {
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
          this.listNguoiKhac = data_user
        }
        if (res.type == 2) {
          this.meetingType7_member = 2
          this.listNguoiKhac_group = res.data
          let data_user = []
          res.data.forEach(element => {
            if (element.UserIdList && element.UserIdList.length > 0) {
              element.UserIdList.forEach(el => {
                let fields = {
                  idUser: el.UserId,
                  username: el.Username,
                  DeptId: 0,
                  GroupId: element.RowID,
                }
                data_user.push(fields)
              });
            }
          });
          this.listNguoiKhac = data_user
        }

        if (res.type == 3) {
          this.meetingType7_member = 3
          this.listNguoiKhac = res.data
          this.listNguoiKhac_dept = res.data2
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
      var index = this.listNguoiThemTaiLieu_group.findIndex((x) => x.RowID == user.RowID);
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
      var index = this.listNguoiKhac.findIndex((x) => x.idUser == user.idUser);
      this.listNguoiKhac.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType7_member === 1) {
      var index = this.listNguoiKhac_dept.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiKhac_dept.splice(index, 1);

      var obj = this.listNguoiKhac.filter((x) => x.DeptId == user.RowID);
      obj.forEach(element => {
        var index = this.listNguoiKhac.findIndex((x) => x.idUser == element.idUser);
        this.listNguoiKhac.splice(index, 1);
      });

      this.changeDetectorRefs.detectChanges()
    }

    if (this.meetingType7_member === 2) {
      var index = this.listNguoiKhac_group.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiKhac_group.splice(index, 1);

      var obj = this.listNguoiKhac.filter((x) => x.GroupId == user.RowID);
      obj.forEach(element => {
        var index = this.listNguoiKhac.findIndex((x) => x.idUser == element.idUser);
        this.listNguoiKhac.splice(index, 1);
      });
      this.changeDetectorRefs.detectChanges()
    }



    if (this.meetingType7_member === 3 && doub == 0) {
      var index = this.listNguoiKhac.findIndex((x) => x.idUser == user.idUser);
      this.listNguoiKhac.splice(index, 1);
      this.changeDetectorRefs.detectChanges();
    }
    if (this.meetingType7_member === 3 && doub == 1) {
      var index = this.listNguoiKhac_dept.findIndex((x) => x.RowID == user.RowID);
      this.listNguoiKhac_dept.splice(index, 1);
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
  //click zoom
  showOptionsZoom(e: any) {
    // if (e.value == "2") {
    //   this.CuocHopService.Config(2,this.idGoogle).subscribe((res: any) => {
    //     if (res && res.status === 1) {
    //       if (res.data.config == false) {
    //         const _description =
    //         "Bạn chưa có thông tin cấu hình Google cho đơn vị này";
    //         this.layoutUtilsService.showActionNotification(_description, MessageType.Read, 999999999);
    //         return;
    //       }else{
    //         //Lấy client_id để có thể tạo phòng họp google meet theo đơn vị
    //         this.client_id = res.data.client_id
    //       }
    //     }
    //   });
    // }
  }
  removeClassKey(el) {
    this.ren.removeClass(
      el["_elementRef"].nativeElement,
      "cdk-focused"
    );
    this.ren.removeClass(
      el["_elementRef"].nativeElement,
      "cdk-program-focused"
    );
  }
  //   checkState(el) {
  //     setTimeout(() => {
  //       if (this.currentCheckedValue && this.currentCheckedValue === el.value) {
  //         el.checked = false;
  //         this.ren.removeClass(el["_elementRef"].nativeElement, "cdk-focused");
  //         this.ren.removeClass(
  //           el["_elementRef"].nativeElement,
  //           "cdk-program-focused"
  //         );
  //         this.currentCheckedValue = null;
  //         this.flagMeeting = 0;
  //         this.selectedZoom = false
  //         this.selectedGoogle = false
  //         this.changeDetectorRefs.detectChanges();
  //       } else {
  //         this.currentCheckedValue = el.value;
  //         if (el.value == "1") {
  //           this.flagMeeting = 1;
  //           this.selectedGoogle = false
  //           this.selectedZoom = true
  //           this.CuocHopService.Config(1,this.idZoom).subscribe((res: any) => {
  //             if (res && res.status === 1) {
  //               if (res.data.config == false) {
  //                 const _description =
  //                 this.translate.instant("QL_CUOCHOP.NOTI_ZOOM_NOTYET");
  //                 this.layoutUtilsService.showActionNotification(_description, MessageType.Read, 999999999);

  //                 // ở đây có thể mở dialog để nhập nhanh key

  //                 //
  //                 //Xóa tích
  //                 this.removeClassKey(el)
  //                 this.currentCheckedValue = null;
  //                 this.flagMeeting = 0;
  //                 this.selectedZoom = false
  //                 this.selectedGoogle = false
  //                 this.selectedWebex = false
  //                 this.changeDetectorRefs.detectChanges();
  //                 //
  //               }else{
  //                 this.currentCheckedValue = el.value
  //                 this.selectedZoom = true // hiện dropdown
  //                 this.selectedGoogle = false
  //                 this.selectedWebex = false
  //                 this.changeDetectorRefs.detectChanges();
  //               }
  //             }
  //           });
  //         } else if(el.value == "2") {
  //           this.flagMeeting = 2;
  //           // -1 kiểm tra lấy key do dev cấu hình
  //           this.CuocHopService.Config(2,-1).subscribe((res: any) => {
  //             if (res && res.status === 1) {
  //               if (res.data.config == false) {
  //                 const _description =
  //                 this.translate.instant("QL_CUOCHOP.NOTI_GGMEET_NOTYET");
  //                 this.layoutUtilsService.showActionNotification(_description, MessageType.Read, 999999999);
  //                 // ở đây có thể mở dialog để nhập nhanh key

  //                 //
  //                 //Xóa tích
  //                 this.removeClassKey(el)
  //                 this.currentCheckedValue = null;
  //                 this.flagMeeting = 0;
  //                 this.selectedZoom = false
  //                 this.selectedGoogle = false
  //                 this.selectedWebex = false
  //                 this.changeDetectorRefs.detectChanges();
  //                 //
  //               }else{
  //                 this.selectedGoogle = true // ẩn dropdown
  //                 this.selectedZoom = false
  //                 this.selectedWebex = false
  //                 //Lấy client_id để có thể tạo phòng họp google meet
  //                 this.client_id = res.data.client_id
  //                 this.currentCheckedValue = el.value
  //                 this.changeDetectorRefs.detectChanges();
  //               }
  //             }
  //           });
  //         }else if(el.value == "3") {
  //           this.flagMeeting = 3;
  //            // -1 kiểm tra lấy key do dev cấu hình
  //           this.CuocHopService.Config(3,-1).subscribe((res: any) => {
  //             if (res && res.status === 1) {
  //               if (res.data.config == false) {
  //                 const _description =
  //                 this.translate.instant("QL_CUOCHOP.NOTI_CWEBEX_NOTYET");
  //                 this.layoutUtilsService.showActionNotification(_description, MessageType.Read, 999999999);
  //                 // ở đây có thể mở dialog để nhập nhanh key

  //                 //
  //                 //Xóa tích
  //                 this.removeClassKey(el)
  //                 this.currentCheckedValue = null;
  //                 this.flagMeeting = 0;
  //                 this.selectedZoom = false
  //                 this.selectedGoogle = false
  //                 this.selectedWebex = false
  //                 this.changeDetectorRefs.detectChanges();
  //                 //
  //               }else{
  //                 this.selectedGoogle = false // ẩn dropdown
  //                 this.selectedZoom = false
  //                 this.selectedWebex = true
  //                 //Lấy client_id để có thể tạo phòng họp webex meet
  //                 localStorage.setItem('webex_id', "-1");
  //                 this.client_id = res.data.client_id
  //                 this.client_secret = res.data.client_secret
  //                 this.currentCheckedValue = el.value
  //                 this.changeDetectorRefs.detectChanges();
  //               }
  //             }
  //           });
  //         }
  //       }
  //     });
  //   }


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
          this.BindListZoom(this.idpz)
          this.changeDetectorRefs.detectChanges();
          this.CuocHopForm.get("IDPhongHop").setValue(this.idpz)
        } else if (el.value == "2") {
          this.removeSelected();
          this.flagMeeting = 2;
          this.selectedGoogle = true;
          this.BindList(1)
          this.changeDetectorRefs.detectChanges();
        } else if (el.value == "3") {
          this.removeSelected();
          this.flagMeeting = 3;
          this.selectedWebex = true;
          this.BindList(2)
          this.changeDetectorRefs.detectChanges();
          this.CuocHopService.Config(3, -1).subscribe((res: any) => {
            if (res && res.status === 1) {

            }
          });
        } else if (el.value == "4") {
          this.removeSelected();
          this.flagMeeting = 4;
          this.selectedTeams = true;
          this.BindList(3)
          this.changeDetectorRefs.detectChanges();
          this.CuocHopService.Config(3, -1).subscribe((res: any) => {
            if (res && res.status === 1) {

            }
          });
        } else if (el.value == "5") {
          this.removeSelected();
          this.flagMeeting = 5;
          this.selectedOther = true;
          this.BindList(0)
          this.changeDetectorRefs.detectChanges();
          //   this.CuocHopService.Config(3,-1).subscribe((res: any) => {
          //     if (res && res.status === 1) {

          //     }
          //   });
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

  WebexClick() {
    localStorage.removeItem("webex_token");
    var left = (screen.width / 2) - (400 / 2);
    var top = (screen.height / 2) - (400 / 2);

    const clientId = this.client_id
    const clientSecret = this.client_secret
    const scopes = "meeting:schedules_write spark:people_read";
    const redirectURI = environment.DomainBackend + "callbackWebex";
    var initiateURL = "https://webexapis.com/v1/authorize?" +
      "client_id=" + clientId +
      "&response_type=code" +
      "&redirect_uri=" + encodeURIComponent(redirectURI) +
      "&scope=" + encodeURIComponent(scopes);
    this.changeDetectorRefs.detectChanges();

    var win = window.open(
      initiateURL,
      '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + 400 + ', height=' + 400 + ', top=' + top + ', left=' + left
    )
    //
    var timer = setInterval(() => {
      if (win.closed) {
        clearInterval(timer);
        this.init_webex()
      }
    }, 500);

  }
  init_webex() {
    this.accsess_token = localStorage.getItem('webex_token');
    let editedCuocHop = this.prepareCuocHop(this.accsess_token);
    if (this.CuocHop.Id > 0) {
      this.updateCuocHop(editedCuocHop)
      return;
    }
    this.addCuocHop(editedCuocHop);
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


  ChuyenHuongZoom() {
    // localStorage.removeItem("zoom_refresh_token");
    const DOMAIN_COOKIES = this.getDomainCookie();
    this.cookieService.set("zoom_refresh_token", "", 365, '/', DOMAIN_COOKIES)
    this.isLoad = true
    this.changeDetectorRefs.detectChanges();
    var left = screen.width / 2 - 600 / 2;
    var top = screen.height / 2 - 600 / 2;
    const redirectURI = environment.DomainBackend + "oauth2callbackZoom";
    var initiateURL =
      "https://zoom.us/oauth/authorize?" +
      "client_id=" +
      this.clientId +
      "&response_type=code" +
      "&redirect_uri=" +
      encodeURIComponent(redirectURI) +
      "&scope=" +
      encodeURIComponent("meeting:write user:write:admin user:write");
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
        this.changeDetectorRefs.detectChanges();
        clearInterval(timer);
        setTimeout(() => {

          if (this.cookieService.get("zoom_refresh_token")) {
            let data = {
              Id: this.idpz,
              Refresh_Token: this.cookieService.get("zoom_refresh_token"),
              type: 1
            }
            this.CuocHopService.updateKey(data).subscribe((res: any) => {

              if (res && res.status === 1) {
                this.BindListZoom(this.idpz)
              } else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false);
              }
            });
            this.cookieService.delete("zoom_refresh_token")
          }
        }, 1500);
      }
    }, 500);
  }


  ChuyenHuongGoogle() {
    // localStorage.removeItem("google_refresh_token");
    const DOMAIN_COOKIES = this.getDomainCookie();
    this.cookieService.set("google_refresh_token", "", 365, '/', DOMAIN_COOKIES)
    this.isLoad = true
    this.changeDetectorRefs.detectChanges();
    var left = screen.width / 2 - 600 / 2;
    var top = screen.height / 2 - 600 / 2;
    const redirectURI = environment.DomainBackend + "oauth2callback";
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
      encodeURIComponent('https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/calendar');
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
        this.changeDetectorRefs.detectChanges();
        clearInterval(timer);
        setTimeout(() => {
          if (this.cookieService.get("google_refresh_token")) {
            let data = {
              Id: this.idpg,
              Refresh_Token: this.cookieService.get("google_refresh_token"),
              type: 2
            }
            this.CuocHopService.updateKey(data).subscribe((res: any) => {

              if (res && res.status === 1) {
                this.BindList(1)
              } else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false);
              }
            });
            this.cookieService.delete("google_refresh_token")
          }
        }, 1500);
      }
    }, 500);
  }

  ChuyenHuongWebex() {
    // localStorage.removeItem('webex_refresh_token')
    const DOMAIN_COOKIES = this.getDomainCookie();
    this.cookieService.set("webex_refresh_token", "", 365, '/', DOMAIN_COOKIES)
    this.isLoad = true
    this.changeDetectorRefs.detectChanges();
    var left = screen.width / 2 - 600 / 2;
    var top = screen.height / 2 - 600 / 2;
    const redirectURI = environment.DomainBackend + "callbackWebex";
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
        this.changeDetectorRefs.detectChanges();
        clearInterval(timer);
        setTimeout(() => {
          if (this.cookieService.get("webex_refresh_token")) {
            let data = {
              Id: this.idpw,
              Refresh_Token: this.cookieService.get("webex_refresh_token"),
              type: 3
            }
            this.CuocHopService.updateKey(data).subscribe((res: any) => {

              if (res && res.status === 1) {
                this.BindList(2)
              } else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false);

              }
            });
            this.cookieService.delete("webex_refresh_token")
          }
        }, 1500);
      }
    }, 500);
  }


  ChuyenHuongTeams() {
    // localStorage.removeItem('ms_refresh_token')
    const DOMAIN_COOKIES = this.getDomainCookie();
    this.cookieService.set("ms_refresh_token", "", 365, '/', DOMAIN_COOKIES)
    this.isLoad = true
    this.changeDetectorRefs.detectChanges();
    var left = screen.width / 2 - 600 / 2;
    var top = screen.height / 2 - 600 / 2;
    const redirectURI = environment.DomainBackend + "oauth2callbackMS";
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
        this.changeDetectorRefs.detectChanges();
        clearInterval(timer);
        setTimeout(() => {
          if (this.cookieService.get("ms_refresh_token")) {
            let data = {
              Id: this.idpt,
              Refresh_Token: this.cookieService.get("ms_refresh_token"),
              type: 4
            }
            this.CuocHopService.updateKey(data).subscribe((res: any) => {

              if (res && res.status === 1) {
                this.BindList(3)
              } else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false);

              }
            });
            this.cookieService.delete("ms_refresh_token")
          }
        }, 1500);
      }
    }, 500);
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
  BindListZoom(event) {
    this.idpz = event
    this.isLoad = true
    this.changeDetectorRefs.detectChanges();
    this.CuocHopService.ConfigCheckToken(event, 1).subscribe((res: any) => {
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
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false, 0);
      }
      this.isLoad = false
      this.changeDetectorRefs.detectChanges();
    });
  }

  BindList(event) {

    switch (event) {
      case 1:
        this.isLoad = true
        this.CuocHopService.ConfigCheckToken(0, 2).subscribe((res: any) => {
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
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false, 0);
          }
          this.isLoad = false
          this.changeDetectorRefs.detectChanges();
        });
        break;
      case 2:
        this.isLoad = true
        this.CuocHopService.ConfigCheckToken(0, 3).subscribe((res: any) => {
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
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false, 0);
          }
          this.isLoad = false
          this.changeDetectorRefs.detectChanges();
        });
        break;
      case 3:
        this.isLoad = true
        this.CuocHopService.ConfigCheckToken(0, 4).subscribe((res: any) => {
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
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false, 0);
          }
          this.isLoad = false
          this.changeDetectorRefs.detectChanges();
        });
        break;
      case 4:
        this.focusInputLink.nativeElement.focus();
        break;
    }

  }

  resetTokenZoom() {
    let data = {
      Id: this.idpz
    }
    this.isLoad = true
    this.CuocHopService.resetKey(data).subscribe((res: any) => {
      if (res && res.status === 1) {
        this.BindListZoom(this.idpz)
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false, 0);
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
    this.CuocHopService.resetKey(data).subscribe((res: any) => {
      if (res && res.status === 1) {
        this.BindList(1)
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false, 0);
      }
      this.isLoad = false
    });
  }

  resetTokenWebex() {
    let data = {
      Id: this.idpw
    }
    this.isLoad = true
    this.CuocHopService.resetKey(data).subscribe((res: any) => {
      if (res && res.status === 1) {
        this.BindList(2)
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false, 0);
      }
      this.isLoad = false
    });
  }

  resetTokenTeams() {
    let data = {
      Id: this.idpt
    }
    this.isLoad = true
    this.CuocHopService.resetKey(data).subscribe((res: any) => {
      if (res && res.status === 1) {
        this.BindList(3)
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Error, 5000, true, false, 0);
      }
      this.isLoad = false
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
      // let size = file.size;
      // if (size >= environment.DungLuong) {
      // 	const message = `Không thể upload hình dung lượng cao hơn ${environment.DungLuong / 1000000}MB.`;
      // 	this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, false);
      // 	return;
      // }
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
      // let size = file.size;
      // if (size >= environment.DungLuong) {
      // 	const message = `Không thể upload hình dung lượng cao hơn ${environment.DungLuong / 1000000}MB.`;
      // 	this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, false);
      // 	return;
      // }
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

    // let queryParams = new QueryParamsModel({});
    // queryParams.more = true;
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


  filterId_Diagram() {
    if (!this.listDiagram) {
      return;
    }
    let search = this.DungChungDropdown.nonAccentVietnamese(this.searchDiagram)
    if (!search) {
      this.filteredId_Diagram.next(this.listDiagram.slice());
      return;
    }

    this.filteredId_Diagram.next(
      this.listDiagram.filter(ts =>
        this.DungChungDropdown.nonAccentVietnamese(ts.Description).indexOf(search) > -1)
    );
    this.changeDetectorRefs.detectChanges();

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
