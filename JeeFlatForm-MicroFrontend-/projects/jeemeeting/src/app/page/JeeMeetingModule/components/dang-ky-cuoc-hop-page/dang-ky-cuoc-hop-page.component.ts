import { HttpClient, HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { ReplaySubject } from 'rxjs';
import { CuocHopModel, TaiSanModel } from '../../_models/DuLieuCuocHop.model';
import { DangKyCuocHopService } from '../../_services/dang-ky-cuoc-hop.service';
import { MeetingStore } from '../../_services/meeting.store';
import { StateService } from '../../_services/state.service';
import { JeeChooseMemberComponent } from '../jee-choose-member/jee-choose-member.component';
import { LayoutUtilsService, MessageType } from 'projects/jeemeeting/src/modules/crud/utils/layout-utils.service';
import { environment } from 'projects/jeemeeting/src/environments/environment';

@Component({
  selector: "app-dang-ky-cuoc-hop-page",
  templateUrl: "./dang-ky-cuoc-hop-page.component.html",
  styleUrls: ["./dang-ky-cuoc-hop-page.component.scss"],
})
export class DangKyCuocHopPageComponent implements OnInit {
    public accsess_token: string;
    flagMeeting: number;
    authRes: any;
    options: any = {};
    options1: any = {};
    options2: any = {};
    formControls: FormGroup;
    item: any;
    ShowDangKyTaiSanKhac: boolean = false;
    ShowDangKyTaiSanKhac2: boolean = false;
    disabledBtn: boolean = false;
    chosenZoom: any;
    chosenGoogle: any;
    chosenItem: any;
    ThoiGianPhongHop: any = "08:00";
    GioNghi: any[] = [];
    DenGio: any[] = [];
    ListPhongHop: any[] = [];
    ListPhongHopCustom: any[] = [];
    currentDate: any;
    listNguoiThamGia: any[] = [];
    listNguoiTheoDoi: any[] = [];
    listNguoiTomTat: any[] = [];
    state: CuocHopModel;
    GioBatDau: any;
    GioKetThuc: any;
    NgayBatDau: any;
    clickNhapTomTat: boolean = false;
    thongtinphonghop: string = "";
    TaiSan: TaiSanModel;
    flag: number = 1;
    UserID: number;
    loaiTaiSan: number = 1;
    listValues: any[] = [];
    currentCheckedValue = null;
    client_id: string;
    checkedZoom: boolean = false;
    checkedGoogle: boolean = false;
    selectedZoom: boolean = false;
    selectedGoogle: boolean = false;
    checkedWebex: boolean = false;
    listKey:any[]=[]
    listKeyGoogle:any[]=[]
    selectedTeams: boolean = false
    listKeyTeams:any[]=[]
    checkedTeams: boolean = false;
    clientId:string
    clientSecret:string
    scopes:string
    clientId2:string
    clientSecret2:string
    scopes2:string
    CuocHop: any;
    ID_Meeting: number = 0;
    idpg:number
    idpt:number
    idpw:number
    //====================Dropdown search============================
    //====================Nhân viên====================
    public bankFilterCtrl: FormControl = new FormControl();
    public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    //====================Từ Giờ====================
    public bankTuGio: FormControl = new FormControl();
    public filteredBanksTuGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    //====================End - Từ Giờ====================
    public phonghopname: FormControl = new FormControl();
    public filteredPhongHop: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    constructor(
      public dialog: MatDialog,
      private dangKyCuocHopService: DangKyCuocHopService,
      private store: MeetingStore,
      private changeDetectorRefs: ChangeDetectorRef,
      private router: Router,
      private stateService: StateService,
      private layoutUtilsService: LayoutUtilsService,
      private ren: Renderer2,
      private http: HttpClient,
      private cookieService: CookieService,
      private activatedRoute: ActivatedRoute,
    ){
      // const authdata = auth.getAuthFromLocalStorage();
      // this.UserID = +authdata != null ? authdata["user"]["customData"]["jee-account"]["userID"] : 0;
    }

    ngOnInit(): void {
      //Lấy key cấu hình google
      this.dangKyCuocHopService.getKeyGoogle()
      .subscribe((res: any) => {
          if(res && res.status == 1){
            this.clientId = res.data[0].clientId
            this.clientSecret = res.data[0].clientSecret
            this.scopes = res.data[0].scopes
          }
        }
      );
      //lấy key cấu hình microsoft team
      this.dangKyCuocHopService.getMS()
      .subscribe((res: any) => {
          if(res && res.status == 1){
            this.clientId2 = res.data[0].clientId
            this.clientSecret2 = res.data[0].clientSecret
            this.scopes2 = res.data[0].scopes
          }
        }
      );
      //lấy danh sách phòng zoom (Dropdown)
      this.dangKyCuocHopService.ListKey().subscribe((res) => {
        this.listKey = res.data;
        this.changeDetectorRefs.detectChanges();
      });
      //lấy danh sách phòng họp google (Dropdown)
      this.dangKyCuocHopService.ListKeyGoogle().subscribe((res) => {
        this.listKeyGoogle = res.data;
        this.idpg = res.data[0].Id // vì có 1 phòng cá nhân nên lấy luôn cái đầu tiên
        this.changeDetectorRefs.detectChanges();
      });
      //lấy danh sách phòng họp microsoft team (Dropdown)
      this.dangKyCuocHopService.ListKeyTeams().subscribe((res) => {
        this.listKeyTeams = res.data;
        this.idpt = res.data[0].Id // vì có 1 phòng cá nhân nên lấy luôn cái đầu tiên
        this.changeDetectorRefs.detectChanges();
      });
      this.formControls = new FormGroup({
        TenCuocHop: new FormControl(),
        thoigiandate: new FormControl(),
        thoigiantime: new FormControl(),
        thoigianminute: new FormControl(),
        SuDungPhongHopInput: new FormControl(),
        XacNhanThamGia: new FormControl(),
        NhapTomTat: new FormControl(),
        GhiChu: new FormControl(),
        IDPhongHop: new FormControl(),
        IDPhongHopGoogle: new FormControl(),
        IDPhongHopTeams: new FormControl(),
        OpenURL: new FormControl(true),
        OpenApp: new FormControl(true),
      });
      this.activatedRoute.params.subscribe((params) => {
        this.ID_Meeting = +params.id;
        this.state = this.stateService.state$.getValue() || null;
        //Lấy state đã lưu khi chuyển qua trang đăng ký tài sản
        if (this.state != null) {
          this.listValues = [];
        this.ShowDangKyTaiSanKhac = true;
        this.thongtinphonghop =
          this.state.SuDungPhongHopInput.TenPhong +
          ", " +
          this.LayThu(this.state.SuDungPhongHopInput.BookingDate) +
          " " +
          this.f_convertDate(this.state.SuDungPhongHopInput.BookingDate) +
          ", " +
          this.state.SuDungPhongHopInput.FromTime +
          " - " +
          this.state.SuDungPhongHopInput.ToTime;
        this.GioBatDau = this.state.SuDungPhongHopInput.FromTime;
        if( this.state.isEdit == 1 ){
          if(this.f_convertHour(this.convertDate(this.state.SuDungPhongHopInput.FromTime)) == "aN:aN"){
            this.GioBatDau = this.state.SuDungPhongHopInput.FromTime
          }
          if(this.state.SuDungPhongHopInput.chitiet){
            this.thongtinphonghop = this.state.SuDungPhongHopInput.chitiet
          };
        }
        this.NgayBatDau = this.state.SuDungPhongHopInput.BookingDate;
        this.TaiSan = new TaiSanModel();
        this.TaiSan.RoomID = this.state.SuDungPhongHopInput.RoomID;
        this.TaiSan.BookingDate = this.state.SuDungPhongHopInput.BookingDate;
        this.TaiSan.FromTime = this.state.SuDungPhongHopInput.FromTime;
        this.TaiSan.ToTime = this.state.SuDungPhongHopInput.ToTime;
        this.TaiSan.MeetingContent =
        this.state.SuDungPhongHopInput.MeetingContent;
        this.TaiSan.TenPhong = this.state.SuDungPhongHopInput.TenPhong;
        this.TaiSan.NVID = this.state.SuDungPhongHopInput.NVID;
        this.TaiSan.DiaDiem = this.thongtinphonghop;
        this.TaiSan.chitiet = this.thongtinphonghop
        this.TaiSan.IdPhieu = this.state.SuDungPhongHopInput.IdPhieu

        this.hideShowRooms()
        //Kiểm tra trang thái đang chọn option phòng họp nào để hiện dropdown danh sach phòng lên
        if(this.state.ZoomMeeting){
          this.checkedZoom = true
          this.selectedZoom = true
        }else if(this.state.GoogleMeeting){
          this.checkedGoogle = true
          this.selectedGoogle = true
        }else if(this.state.WebexMeeting){
          this.checkedWebex = true
        }else if(this.state.TeamsMeeting){
          this.selectedTeams = true
          this.checkedTeams = true
        }

        this.loadFlagMeeting(this.state.ZoomMeeting,this.state.GoogleMeeting,this.state.WebexMeeting,this.state.TeamsMeeting)

        if (this.state.TaiSanKhac) {
          this.ShowDangKyTaiSanKhac2 = true;
          this.ThemCotTaiSan();
        }
        if(this.state.NhapTomTat){
          this.clickNhapTomTat = true
        }
        this.formControls = new FormGroup({
          TenCuocHop: new FormControl(this.state.TenCuocHop),
          thoigiandate: new FormControl(this.state.thoigiandate),
          thoigiantime: new FormControl(this.state.thoigiantime),
          thoigianminute: new FormControl(this.state.thoigianminute),
          SuDungPhongHopInput: new FormControl(this.thongtinphonghop),
          XacNhanThamGia: new FormControl(this.state.XacNhanThamGia),
          NhapTomTat: new FormControl(this.state.NhapTomTat),
          GhiChu: new FormControl(this.state.GhiChu),
          IDPhongHop: new FormControl(this.state.IDPhongHop),
          IDPhongHopGoogle: new FormControl(this.state.IDPhongHopGoogle),
          IDPhongHopTeams: new FormControl(this.state.IDPhongHopTeams),
          OpenURL: new FormControl(this.state.OpenURL),
          OpenApp: new FormControl(this.state.OpenApp),
        });
        this.listNguoiThamGia = this.state.ListThamGia;
        this.listNguoiTheoDoi = this.state.ListTheoDoi;
        this.listNguoiTomTat = this.state.ListTomTat;
        this.state.clear();
        this.stateService.state$.next(null);
        } else if(this.ID_Meeting != 0) {
          this.dangKyCuocHopService
          .Get_ChiTietCuocHopEdit(this.ID_Meeting)
          .subscribe((res) => {
            if (res.status == 1) {
            this.CuocHop = res.data;
            this.listValues = [];
            this.hideShowRooms()
            if(this.CuocHop.ZoomMeeting){
              this.checkedZoom = true
              this.selectedZoom = true
              }else if(this.CuocHop.GoogleMeeting){
                this.checkedGoogle = true
                this.selectedGoogle = true
              }else if(this.CuocHop.WebexMeeting){
                this.checkedWebex = true
              }
              else if(this.CuocHop.TeamsMeeting){
                this.selectedTeams = true
                this.checkedTeams = true
              }
            this.loadFlagMeeting(this.CuocHop.ZoomMeeting,this.CuocHop.GoogleMeeting,this.CuocHop.WebexMeeting,this.CuocHop.TeamsMeeting)
            this.clickNhapTomTat = this.CuocHop.NhapTomTat;
            if (this.CuocHop.PhongHopDangKy) {
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
              this.ShowDangKyTaiSanKhac = true;
              if (this.CuocHop.TaiSanKhac) {
                this.ShowDangKyTaiSanKhac2 = true;
                this.CuocHop.TaiSanKhac.forEach((element) => {
                element.chitiet =
                  element.TenPhong +
                  ", " +
                  this.LayThu(this.convertDate(element.BookingDate)) +
                  " " +
                  this.f_convertDate(
                  this.convertDate(element.BookingDate)
                  ) +
                  ", " +
                  element.FromTime +
                  " - " +
                  element.ToTime;
                });
                this.listValues = this.CuocHop.TaiSanKhac;
              }
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
            }
            this.formControls = new FormGroup({
              TenCuocHop: new FormControl("" + this.CuocHop.TenCuocHop),
              thoigiandate: new FormControl(
              "" + this.convertDate(this.CuocHop.thoigiandate)
              ),
              thoigiantime: new FormControl(
              "" +
              this.CuocHop.thoigiantime
              ),
              thoigianminute: new FormControl(
              "" + this.CuocHop.thoigianminute
              ),
              SuDungPhongHopInput: new FormControl(
              "" + this.thongtinphonghop
              ),
              XacNhanThamGia: new FormControl(this.CuocHop.XacNhanThamGia),
              NhapTomTat: new FormControl(this.CuocHop.NhapTomTat),
              GhiChu: new FormControl("" + this.CuocHop.GhiChu),
              IDPhongHop: new FormControl('' + this.CuocHop.IDPhongHop),
              IDPhongHopGoogle: new FormControl('' + this.idpg),
              IDPhongHopTeams: new FormControl('' + this.idpt),
            });
            this.listNguoiThamGia = this.CuocHop.ListThamGia;
            this.listNguoiTheoDoi = this.CuocHop.ListTheoDoi;
            this.listNguoiTomTat = this.CuocHop.ListTomTat;
            }
            this.changeDetectorRefs.detectChanges();
          });
        }
        });
      this.dangKyCuocHopService.Get_GioDatPhongHop("").subscribe((res) => {
        this.GioNghi = res.data;
        this.DenGio = res.data;
        this.setUpDropSearchTuGio();
        this.changeDetectorRefs.detectChanges();
      });
    }

    hideShowRooms(){
      this.checkedGoogle = false
      this.checkedZoom = false
      this.checkedWebex = false
      this.selectedZoom = false
      this.selectedGoogle = false
      this.selectedTeams = false
      this.checkedTeams = false
    }

    //Lưu trạng thái hiện tại
    PrepareDataState() {
      const controls = this.formControls.controls;
      const _item = new CuocHopModel();
      _item.TenCuocHop = controls["TenCuocHop"].value;
      _item.thoigiandate = controls["thoigiandate"].value;
      _item.thoigiantime = controls["thoigiantime"].value;
      _item.thoigianminute = controls["thoigianminute"].value;
      // _item.SuDungPhongHop = controls["SuDungPhongHop"].value
      _item.SuDungPhongHopInput = this.TaiSan;
      _item.XacNhanThamGia = controls["XacNhanThamGia"].value;
      _item.NhapTomTat = controls["NhapTomTat"].value;
      _item.GhiChu =
        controls["GhiChu"].value == null ? "" : controls["GhiChu"].value;
      _item.ListThamGia = this.listNguoiThamGia;
      _item.ListTheoDoi = this.listNguoiTheoDoi;
      _item.ListTomTat = this.listNguoiTomTat;
      _item.LoaiTaiSan = this.loaiTaiSan;
      _item.TaiSanKhac = this.listValues;
      _item.isAdd = 0;
      _item.ZoomMeeting = this.currentCheckedValue == "1" ? true : false;
      _item.GoogleMeeting = this.currentCheckedValue == "2" ? true : false;
      _item.WebexMeeting = this.currentCheckedValue == "3" ? true : false;
      _item.TeamsMeeting = this.currentCheckedValue == "4" ? true : false;
      if(this.currentCheckedValue == "1" ){
        _item.IDPhongHop =  controls["IDPhongHop"].value == null ? "" : controls["IDPhongHop"].value
        _item.OpenURL = true //controls["OpenURL"].value
      _item.OpenApp = true //controls["OpenApp"].value
      }
      if(this.ID_Meeting != 0){
        _item.RowID = this.ID_Meeting
      }
      this.stateService.state$.next(_item);
    }

    PrepareData(token: string = "") {
      const controls = this.formControls.controls;
      if(controls["NhapTomTat"].value == true){
        if(this.listNguoiTomTat.length == 0){
          this.layoutUtilsService.showActionNotification(
            "Vui lòng chọn người nhập tóm tắt, kết luận",
            MessageType.Read,
            9999999999,
            true,
            false,
            3000,
            "top",
            0
          );this.disabledBtn = false
          this.changeDetectorRefs.detectChanges();
          return;
        }
      }else{
        this.listNguoiTomTat = []
      }
      var typeopen = 0;
      // if(this.currentCheckedValue == "1"){
      //   if(controls["OpenURL"].value == true){
      //     typeopen = 1
      //   }
      //   if(controls["OpenApp"].value == true){
      //     typeopen = 2
      //   }
      //   if(controls["OpenURL"].value == true && controls["OpenApp"].value == true){
      //     typeopen = 3
      //   }
      //   if((controls["OpenURL"].value == false && controls["OpenApp"].value == false) || (controls["OpenURL"].value == null && controls["OpenApp"].value == null)){
      //     this.layoutUtilsService.showActionNotification(
      //       "Vui lòng chọn hình thức tham gia cuộc họp",
      //       MessageType.Read,
      //       9999999999,
      //       true,
      //       false,
      //       3000,
      //       "top",
      //       0
      //     );
      //     this.disabledBtn = false
      //     this.changeDetectorRefs.detectChanges();
      //     return;
      //   }
      // }
      let _field = {
        RowID: this.ID_Meeting,
        TenCuocHop: controls["TenCuocHop"].value,
        thoigiandate: this.f_convertDateUTC(controls["thoigiandate"].value),
        thoigiantime: controls["thoigiantime"].value,
        thoigianminute: controls["thoigianminute"].value,
        XacNhanThamGia:
          controls["XacNhanThamGia"].value == null
            ? false
            : controls["XacNhanThamGia"].value,
        NhapTomTat:
          controls["NhapTomTat"].value == null
            ? false
            : controls["NhapTomTat"].value,
        GhiChu: controls["GhiChu"].value,
        PhongHopDangKy: this.TaiSan,
        ListThamGia: this.listNguoiThamGia,
        ListTheoDoi: this.listNguoiTheoDoi,
        ListTomTat: this.listNguoiTomTat,
        TaiSanKhac: this.listValues,
        ZoomMeeting: this.currentCheckedValue == "1" ? true : false,
        GoogleMeeting: this.currentCheckedValue == "2" ? true : false,
        WebexMeeting: this.currentCheckedValue == "3" ? true : false,
        TeamsMeeting: this.currentCheckedValue == "4" ? true : false,
        token: token,
        TimeZone : Intl.DateTimeFormat().resolvedOptions().timeZone,
        IDPhongHop : this.currentCheckedValue == "1" ?(controls["IDPhongHop"].value == null ? "" : controls["IDPhongHop"].value):0,
        TypeOpen: 3
      };
      return _field;
    }

    prenventInputNonNumber(event) {
      if (event.which < 48 || event.which > 57) {
        event.preventDefault();
      }
    }

    //Dùng refresh token của phòng họp để lấy access token offline của ms teams
    async authenticateTeams() {
      this.disabledBtn = false
      this.changeDetectorRefs.detectChanges();
      const refresh_token = this.listKeyTeams.find(x =>x.Id == this.formControls.controls['IDPhongHopTeams'].value)
      const redirectURI = environment.HOST_JEEMEETING + "/oauth2callbackMS";
          let field = {
            client_id: this.clientId2,
            client_secret: this.clientSecret2,
            refresh_token: refresh_token.Token,
            scope: this.scopes2,
            grant_type:'refresh_token',
            redirect_uri:redirectURI
          }
        this.dangKyCuocHopService.RefreshToken(field)
        .subscribe((data: any) => {
          this.dangKyCuocHopService
              .Insert_CuocHop(this.PrepareData(data.access_token))
              .subscribe((res: any) => {
                if (res && res.status === 1) {
                  this.disabledBtn = false
                  this.changeDetectorRefs.detectChanges();
                  this.layoutUtilsService.showActionNotification(
                    this.ID_Meeting == 0?"Thêm thành công":"Chỉnh sửa thành công",
                    MessageType.Read,
                    4000,
                    true,
                    false
                  );
                  this.stateService.state$.next(null);
                  this.store.data_shareLoad = (res)
                  this.router.navigate([this.ID_Meeting == 0?(res.data[0].RowID?`/Meeting/${res.data[0].RowID}`:"/Meeting"):`/Meeting/${this.ID_Meeting}`], { queryParams: {Type: 0}});
                } else {
                  this.disabledBtn = false
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
        ),
        (error) => {
          this.disabledBtn = false
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
      this.disabledBtn = false
      this.changeDetectorRefs.detectChanges();
      const refresh_token = this.listKeyGoogle.find(x =>x.Id == this.formControls.controls['IDPhongHopGoogle'].value)
        let params = new HttpParams()
        .set("client_id", this.clientId)
        .set("client_secret", this.clientSecret)
        .set("grant_type", 'refresh_token')
        .set("refresh_token", refresh_token.Token);
        this.http.post("https://oauth2.googleapis.com/token", null, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          params: params,
        })
        .subscribe((data: any) => {
          this.dangKyCuocHopService
              .Insert_CuocHop(this.PrepareData(data.access_token))
              .subscribe((res: any) => {
                if (res && res.status === 1) {
                  this.disabledBtn = false
                  this.changeDetectorRefs.detectChanges();
                  this.layoutUtilsService.showActionNotification(
                    this.ID_Meeting == 0?"Thêm thành công":"Chỉnh sửa thành công",
                    MessageType.Read,
                    4000,
                    true,
                    false
                  );
                  this.stateService.state$.next(null);
                  this.store.data_shareLoad = (res)
                  this.router.navigate([this.ID_Meeting == 0?(res.data[0].RowID?`/Meeting/${res.data[0].RowID}`:"/Meeting"):`/Meeting/${this.ID_Meeting}`], { queryParams: {Type: 0}});

                } else {
                  this.disabledBtn = false
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
          },
          (error) => {
            this.disabledBtn = false
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              "Vui lòng tạo lại phòng họp google",
              MessageType.Read,
              9999999999,
              true,
              false,
              3000,
              "top",
              0
            );
          }
        );
    }

    TaoCuocHop() {
      this.disabledBtn = true
      this.changeDetectorRefs.detectChanges();
      if(this.currentCheckedValue == "1"){
        //lách
        this.formControls.controls['IDPhongHopGoogle'].setValue(0);
        this.formControls.controls['IDPhongHopTeams'].setValue(0);
     }
     if(this.currentCheckedValue == "2"){
        //lách
        this.formControls.controls['IDPhongHop'].setValue(0);
        this.formControls.controls['IDPhongHopTeams'].setValue(0);
     }
     if(this.currentCheckedValue == "4"){
       //lách
       this.formControls.controls['IDPhongHopGoogle'].setValue(0);
       this.formControls.controls['IDPhongHop'].setValue(0);
    }
      const controls = this.formControls.controls;
      if (this.formControls.invalid) {
        Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
        );
        this.disabledBtn = false
        this.changeDetectorRefs.detectChanges();
        return;
      }
      if (this.flagMeeting == 2) {
        this.authenticate();
      } else  if (this.flagMeeting == 3){
        this.WebexClick()
      } else  if (this.flagMeeting == 4){
      this.authenticateTeams()
      } else {
        this.dangKyCuocHopService
          .Insert_CuocHop(this.PrepareData())
          .subscribe((res: any) => {
            if (res && res.status === 1) {
              this.disabledBtn = false
              this.changeDetectorRefs.detectChanges();
              this.layoutUtilsService.showActionNotification(
                this.ID_Meeting == 0?"Thêm thành công":"Chỉnh sửa thành công",
                MessageType.Read,
                4000,
                true,
                false
              );
              this.stateService.state$.next(null);
              this.store.data_shareLoad = (res)
              this.router.navigate([this.ID_Meeting == 0?(res.data[0].RowID?`/Meeting/${res.data[0].RowID}`:"/Meeting"):`/Meeting/${this.ID_Meeting}`], { queryParams: {Type: 0}});
            } else {
              this.disabledBtn = false
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
    }

    filterConfigurationDK(): any {
      const filter: any = {};
      this.currentDate = new Date();
      filter.TuNgay =
        this.currentDate.getDate() +
        "/" +
        (this.currentDate.getMonth() + 1) +
        "/" +
        this.currentDate.getFullYear();
      return filter;
    }

    //stop action
    stopPropagation(event) {
      event.stopPropagation();
    }


    //add và remove user
    AddThanhVien(loai:number) {
      if(loai == 1){
        let _item = this.listNguoiThamGia;
        const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item }, width: '40%' });
        dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
        this.listNguoiThamGia = res.data
        this.changeDetectorRefs.detectChanges();
        });
      }
      if(loai == 2){
        let _item = this.listNguoiTheoDoi;
        const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item }, width: '40%' });
        dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
        this.listNguoiTheoDoi = res.data
        this.changeDetectorRefs.detectChanges();
        });
      }
      if(loai == 3){
        let _item = this.listNguoiTomTat;
        const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item }, width: '40%'});
        dialogRef.afterClosed().subscribe(res => {
        if (!res) {
          return;
        }
        this.listNguoiTomTat = res.data
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

    dangKyTaiSan() {
      this.loaiTaiSan = 2;
      this.PrepareDataState();
      this.router.navigate(['/Meeting/dang-ky-tai-san/',0]);
      this.dangKyCuocHopService.data_share$.next('load')

    }

    //Thêm tài sản
    ThemCotTaiSan() {
      this.listValues = this.state.TaiSanKhac;
    }

    remove(item) {
      const index = this.listValues.indexOf(item, 0);
      if (index > -1) {
        this.listValues.splice(index, 1);
        this.changeDetectorRefs.detectChanges();
      }
    }

    //chuyển hướng đến trang đăng ký tài sản và lưu trạng thái hiện tại
    dangKyPhongHop() {
      this.loaiTaiSan = 1;
      this.ShowDangKyTaiSanKhac = false;
      //Lưu trạng thái hiện tại
      this.PrepareDataState();
      this.router.navigate(['/Meeting/dang-ky-tai-san/',0]);
      this.dangKyCuocHopService.data_share$.next('load')

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
      if (!this.GioNghi) {
        return;
      }
      // get the search keyword
      let search = this.bankTuGio.value;
      if (!search) {
        this.filteredBanksTuGio.next(this.GioNghi.slice());
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the banks
      this.filteredBanksTuGio.next(
        this.GioNghi.filter((bank) => bank.Gio.toLowerCase().indexOf(search) > -1)
      );
    }
    //============ End - Từ giờ =============

    goBack() {
      this.router.navigate([this.ID_Meeting == 0?"/Meeting/":`/Meeting/${this.ID_Meeting}`]);
      this.dangKyCuocHopService.data_share$.next('show')
    }

    ngOnDestroy() {

    }

    getHeight(): any {
      let tmp_height = 0;
      tmp_height = window.innerHeight - 20;
      return tmp_height + "px";
    }

    //show chọn người nhập tóm tắt kết luận
    showOptions(e: any) {
      this.clickNhapTomTat = e.checked;
    }

    //kiểm tra khi check vào option phòng họp online
    checkState(el) {
      setTimeout(() => {
        if (this.currentCheckedValue && this.currentCheckedValue === el.value) {
          el.checked = false;
          this.removeClass(el);
          this.currentCheckedValue = null;
          this.chosenItem = null;
          this.removeSelected();
        this.changeDetectorRefs.detectChanges();
        } else {
          this.currentCheckedValue = el.value;
          if (el.value == "1") {
            this.removeSelected();
            this.flagMeeting = 1;
            this.selectedZoom = true
            this.changeDetectorRefs.detectChanges();
            //kiểm tra để thông báo có danh sách phòng họp zoom không
            this.dangKyCuocHopService.ZoomConfig().subscribe((res: any) => {
              if (res && res.status === 1) {
                if (res.data == false) {
                  const _description = "Chưa có thông tin phòng họp Zoom";
                  this.layoutUtilsService.showActionNotification(
                    _description,
                    MessageType.Read,
                    9999999999,
                    true,
                    false,
                    3000,
                    "top",
                    0
                  );
                }
              }
            });
          } else if (el.value == "2"){
            this.removeSelected();
            this.flagMeeting = 2;
            this.selectedGoogle = true
            this.changeDetectorRefs.detectChanges();
            this.dangKyCuocHopService.GoogleConfig().subscribe((res: any) => {
              if (res && res.status === 1) {
                if (res.data == false) {
                  const _description = "Bạn chưa tạo phòng họp Google Meet";
                  this.layoutUtilsService.showActionNotification(
                    _description,
                    MessageType.Read,
                    9999999999,
                    true,
                    false,
                    3000,
                    "top",
                    0
                  );
                }
              }
            });
          } else if (el.value == "3") {
            this.removeSelected();
            this.flagMeeting = 3;
            this.changeDetectorRefs.detectChanges();
            this.dangKyCuocHopService.WebexConfig().subscribe((res: any) => {
              if (res && res.status === 1) {
                if (res.data == false) {
                  const _description = "Bạn chưa tạo phòng họp WebEx";
                  this.layoutUtilsService.showActionNotification(
                    _description,
                    MessageType.Read,
                    9999999999,
                    true,
                    false,
                    3000,
                    "top",
                    0
                  );
                }
              }
            });
          }else if (el.value == "4") {
            this.removeSelected();
            this.flagMeeting = 4;
            this.selectedTeams = true
            this.changeDetectorRefs.detectChanges();
            this.dangKyCuocHopService.TeamsConfig().subscribe((res: any) => {
              if (res && res.status === 1) {
                if (res.data == false) {
                  const _description = "Bạn chưa tạo phòng họp WebEx";
                  this.layoutUtilsService.showActionNotification(
                    _description,
                    MessageType.Read,
                    9999999999,
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
        }
      });
    }

    //làm mới option phòng họp online
    removeSelected(){
      this.flagMeeting = 0;
      this.selectedZoom = false
      this.selectedGoogle = false
      this.selectedTeams = false
    }

    //xóa class checked trong select phòng họp online
    removeClass(el:any){
      this.ren.removeClass(
        el["_elementRef"].nativeElement,
        "cdk-focused"
      );
      this.ren.removeClass(
        el["_elementRef"].nativeElement,
        "cdk-program-focused"
      );
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

    //kiểm tra trạng thái hiện tại để gắn flag khi tạo hoặc chỉnh sửa
    loadFlagMeeting(el, el2, el3, el4){
      if (el == true) {
        this.flagMeeting = 1;
        this.currentCheckedValue = "1"
      }

      if(el2 == true) {
        this.flagMeeting = 2;
        this.currentCheckedValue = "2"
      }

      if(el3 == true) {
        this.flagMeeting = 3;
        this.currentCheckedValue = "3"
      }

      if(el4 == true) {
        this.flagMeeting = 4;
        this.currentCheckedValue = "4"
      }
    }

    WebexClick(){
      this.cookieService.delete('webex_token', '/', environment.DOMAIN_COOKIES);
      var left = (screen.width/2)-(400/2);
      var top = (screen.height/2)-(400/2);
      var win = window.open(
        environment.HOST_JEEMEETING + `/callback`,
        '',  'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+400+', height='+400+', top='+top+', left='+left
      )
      var timer = setInterval(()=>{
        if (win.closed)
        {
          clearInterval(timer);
          this.inset_webex()
        } },500);

    }

    inset_webex(){
      this.dangKyCuocHopService.Insert_CuocHop(this.PrepareData(this.cookieService.get('webex_token')))
            .subscribe((res: any) => {
              if (res && res.status === 1) {
                this.disabledBtn = false
                this.changeDetectorRefs.detectChanges();
                this.layoutUtilsService.showActionNotification(
                  this.ID_Meeting == 0?"Thêm thành công":"Chỉnh sửa thành công",
                  MessageType.Read,
                  4000,
                  true,
                  false
                );
                this.stateService.state$.next(null);
                this.store.data_shareLoad = (res)
                this.router.navigate([this.ID_Meeting == 0?(res.data[0].RowID?`/Meeting/${res.data[0].RowID}`:"/Meeting"):`/Meeting/${this.ID_Meeting}`], { queryParams: {Type: 0}});
                
              } else {
                this.disabledBtn = false
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

    //====================================Begin - Customs========================================

    CustomNamePhongHop(item: any) {
      this.ThoiGianPhongHop = this.f_convertHour(item.start);
      let temp =
        "Phòng họp số 1" +
        ", " +
        this.LayThu(item.start) +
        " " +
        this.f_convertDate(item.start) +
        ", " +
        this.f_convertHour(item.start) +
        " - " +
        this.f_convertHour(item.end);
      return temp;
    }

    formatDate(item: any) {
      let v = item.start;
      if (!v) return v;
      let t = moment(v).format("HH:mm");
      t = t != "00:00" ? ", " + t : "";
      let str = moment(v).format("DD/MM/YYYY");
      if (str == moment().format("DD/MM/YYYY")) return "Hôm nay" + t;
      if (str == moment(new Date()).add(1, "days").format("DD/MM/YYYY"))
        return "Ngày mai" + t;
      if (str == moment(new Date()).add(-1, "days").format("DD/MM/YYYY"))
        return "Hôm qua";
      return moment(v) < moment() ? str : str + t;
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

    f_number(value: any) {
      return Number((value + "").replace(/,/g, ""));
    }

    f_currency(value: any, args?: any): any {
      let nbr = Number((value + "").replace(/,|-/g, ""));
      return (nbr + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    }

    convertDate(d: any) {
      return moment(d).format("YYYY-MM-DDTHH:mm:ss.sss");
    }
     //====================================End - Customs========================================
}
