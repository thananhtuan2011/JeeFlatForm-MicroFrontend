import { DatePipe } from "@angular/common";
import { HttpParams } from "@angular/common/http";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { RolesFormComponent } from "../../component/roles-form/roles-form.component";
import { DonTuService } from "../services/don-tu.services";
import { environment } from "src/environments/environment";
import { QueryParamsModel } from "../../../models/query-models/query-params.model";
import { DanhMucChungService } from "../../../services/danhmuc.service";
import { LeavePersonalService } from "../../../JeeCalendarModule/calendar/services/dang-ky-phep-ca-nhan.service";
import { OvertimeRegistrationService } from "../../../JeeCalendarModule/calendar/services/Overtime-registration.service";
import { ChangeShiftStaffbyStaffService } from "../../../JeeCalendarModule/calendar/services/doi-ca-lam-viec.service";
import { GuiGiaiTrinhChamCongService } from "../../../JeeCalendarModule/calendar/services/gui-giai-trinh-cham-cong.service";
import { XinThoiViecService } from "../../../JeeCalendarModule/calendar/services/xin-thoi-viec.service";
import { QuanLyDuyetService } from "../../../JeeCalendarModule/calendar/services/quan-ly-duyet.service";
import { FormatTimeService } from "../../../services/jee-format-time.component";
import { ApprovalOTModel, QuanLyDuyetModel } from "../../../JeeCalendarModule/calendar/Model/calendar.model";
import { LayoutUtilsService, MessageType } from "projects/jeehr/src/modules/crud/utils/layout-utils.service";

@Component({
    selector: 'app-don-tu-details',
    templateUrl: './don-tu-details.component.html',
})
export class DonTuDetailsComponent implements OnInit {
    filterStatusID: string = "";
    dataLazyLoad: any = [];
    listTypeOption: any = [];
    selectedTab: number = 0;
    //==========Dropdown Search==============
    filter: any = {};
    //=======================================
    __TypeID: string = '';
    __RowID: string = '';
    //=======================================
    IsToiGui: boolean = true;
    constructor(
        public danhMucChungService: DanhMucChungService,
        private changeDetectorRef: ChangeDetectorRef,
        public donTuServices: DonTuService,
        private translate: TranslateService,
        public datepipe: DatePipe,
        public leavePersonalService: LeavePersonalService,
        private layoutUtilsService: LayoutUtilsService,
        public dialog: MatDialog,
        public overtimeRegistrationService: OvertimeRegistrationService,
        private cahngeshiftService: ChangeShiftStaffbyStaffService,
        private guiGiaiTrinhChamCongService: GuiGiaiTrinhChamCongService,
        private xinThoiViecService: XinThoiViecService,
        private quanLyDuyetService: QuanLyDuyetService,
        private itemFB: FormBuilder,
        private activatedRoute: ActivatedRoute,
        public _FormatTimeService: FormatTimeService,
        private router: Router,
    ) {

    }
    ngOnInit(): void {
        this.activatedRoute.params.subscribe(params => {
            let item = {
                TypeID: params.idtype,
                ID_NV: params.idnv,
                RowID: params.id,
            }
            this.getParamType();
            this.GetDetails(item);
        });
    }

    getParamType() {
        const url = window.location.href;
        if (url.includes('?')) {
            const httpParams = new HttpParams({ fromString: url.split('?')[1] });
            if (httpParams.get('IsGui') == "1") {
                this.donTuServices.data_IsGui$.next('Gui')
                this.IsToiGui = true;
            }
            if (httpParams.get('IsGui') == "0") {
                this.donTuServices.data_IsGui$.next('Duyet')
                this.IsToiGui = false;
            }
        }
    }

    getHeight(): any {
        let tmp_height = window.innerHeight - 215;
        return tmp_height + "px";
    }

    getHeightCenter(): any {
        let tmp_height = window.innerHeight - 80;
        return tmp_height + "px";
    }

    getHeightRight(): any {
        let tmp_height = window.innerHeight - 70;
        return tmp_height + "px";
    }
    //===================================================
    getImage(val) {
        let image = "";
        if (val.TypeID == "1") {//Phép - công tác
            image = environment.HOST_MINIO + "/jee-hr/images/dontu/NPCT.png";
        }
        if (val.TypeID == "6") {//Yêu cầu tuyển dụng
            image = environment.HOST_MINIO + "/jee-hr/images/dontu/TD.png";
        }
        if (val.TypeID == "12") {//Tăng ca
            image = environment.HOST_MINIO + "/jee-hr/images/dontu/TC.png";
        }
        if (val.TypeID == "13") {//Thôi việc
            image = environment.HOST_MINIO + "/jee-hr/images/dontu/TV.png";
        }
        if (val.TypeID == "18") {//Đổi ca
            image = environment.HOST_MINIO + "/jee-hr/images/dontu/DCLV.png";
        }
        if (val.TypeID == "19") {//Giải trình
            image = environment.HOST_MINIO + "/jee-hr/images/dontu/GTCC.png";
        }
        return image;
    }
    getInfoTime(val) {
        let image = "";
        if (val.TypeID == "1") {//Phép - công tác
            image = val.Time;
        }
        if (val.TypeID == "6") {//Yêu cầu tuyển dụng
            image = "";
        }
        if (val.TypeID == "12") {//Tăng ca
            image = val.Time;
        }
        if (val.TypeID == "13") {//Thôi việc
            image = "Bắt đầu từ " + this.datepipe.transform(val.startdate, 'dd/MM/yyyy');
        }
        if (val.TypeID == "18") {//Đổi ca
            image = val.Time;
        }
        if (val.TypeID == "19") {//Giải trình
            image = "Tháng " + val.Time;
        }
        return image;
    }
    getInfoMoTa(val) {
        let image = "";
        if (val.TypeID == "1") {//Phép - công tác
            image = val.Note;
        }
        if (val.TypeID == "6") {//Yêu cầu tuyển dụng
            image = "";
        }
        if (val.TypeID == "12") {//Tăng ca
            image = val.Note;
        }
        if (val.TypeID == "13") {//Thôi việc
            image = ""
        }
        if (val.TypeID == "18") {//Đổi ca
            image = val.Note;
        }
        if (val.TypeID == "19") {//Giải trình
            image = val.Note;
        }
        return image;
    }
    getColor(val) {
        let color = "";
        if (val.Valid == null) {
            color = "orange";
        } else {
            if (val.Valid) {
                color = "#0A9562";
            } else {
                color = "red";
            }
        }
        return color;
    }
    GetDetails(val) {
        this.__TypeID = '' + val.TypeID;
        this.__RowID = '' + val.RowID;
        this.ID_NV = val.ID_NV;
        if (val.TypeID == "1") {//Phép - công tác
            this.ShowInfoTC = false;
            this.ShowInfoDCLV = false;
            this.ShowInfoGTCC = false;
            this.ShowInfoTV = false;
            this.ShowInfoPhep = true;
            this.loadDataPhep();
            if (this.IsToiGui) {
                this.GetInfoPhep(val.RowID);
            } else {
                this.GetInfoPhep_Manager(val.RowID);
            }
        }
        if (val.TypeID == "12") {//Tăng ca
            this.ShowInfoPhep = false;
            this.ShowInfoDCLV = false;
            this.ShowInfoGTCC = false;
            this.ShowInfoTV = false;
            this.ShowInfoTC = true;
            if (this.IsToiGui) {
                this.GetInfoTC(val.RowID);
            } else {
                this.GetInfoTC_Manager(val.RowID);
                this.danhMucChungService.GetListCachTinhTangCa().subscribe(res => {
                    this.listCachTinhTangCa = res.data;
                    this.changeDetectorRef.detectChanges();
                })
            }
        }
        if (val.TypeID == "18") {//Đổi ca
            this.ShowInfoPhep = false;
            this.ShowInfoTC = false;
            this.ShowInfoGTCC = false;
            this.ShowInfoTV = false;
            this.ShowInfoDCLV = true;
            if (this.IsToiGui) {
                this.GetInfoDCLV(val.RowID);
            } else {
                this.GetInfoDCLV_Manager(val.RowID);
            }
        }
        if (val.TypeID == "19") {//GTCC
            this.ShowInfoPhep = false;
            this.ShowInfoTC = false;
            this.ShowInfoDCLV = false;
            this.ShowInfoTV = false;
            this.ShowInfoGTCC = true;
            this.danhMucChungService.GetListLyDoGiaiTrinh().subscribe(res => {
                if (res && res.status === 1) {
                    if (res.data.length > 0) {
                        this.listLyDo = res.data;
                    } else {
                        this.listLyDo = [];
                    }
                    this.changeDetectorRef.detectChanges();
                }
            });
            this.ID_GiaiTrinh = val.RowID;
            if (this.IsToiGui) {
                this.GetInfoGTCC();
            } else {
                this.GetInfoGTCC_Manager();
            }
        }
        if (val.TypeID == "13") {//TV
            this.ShowInfoPhep = false;
            this.ShowInfoTC = false;
            this.ShowInfoDCLV = false;
            this.ShowInfoGTCC = false;
            this.ShowInfoTV = true;
            this.RowIDTV = val.RowID;
            if (this.IsToiGui) {
                this.GetInfoTV();
            } else {
                this.GetInfoTV_Manager();
            }
        }
    }
    //================================Xử lý cho phần phép-công tác=======================================
    itemPhep: any;
    oldItemPhep: any;
    ChoDuyet: string = 'Chờ duyệt';
    listData_CapDuyet: any[] = [];
    listData_ApprovingUser: any[] = [];
    ShowInfoPhep: boolean = false;
    listphep: any[] = [];
    SoNgayPhepThamNien: number = 0;
    TongNgayPhepNam: number = 0;
    f_duyet(value: any): any {
        let latest_date = ''
        if (value.Valid == true) {
            latest_date = this.translate.instant("dontu.daduyet");
        } else if (value.Valid == false) {
            latest_date = this.translate.instant("dontu.khongduyet");
        } else {
            if (value.Checker != null) {
                latest_date = this.translate.instant("dontu.choduyet");
            }
        }
        return latest_date;
    }
    f_date(value: any): any {
        let latest_date = this.datepipe.transform(value, 'dd/MM/yyyy');
        return latest_date;
    }
    GetInfoPhep(id) {
        this.listData_CapDuyet = [];
        this.listData_ApprovingUser = [];
        this.leavePersonalService.Get_ChiTietDuyetPhep(+id, 1).subscribe(res => {
            this.itemPhep = res;
            this.listData_CapDuyet = this.itemPhep.Data_CapDuyet;
            this.listData_ApprovingUser = this.itemPhep.Data_ApprovingUser;
            this.oldItemPhep = Object.assign({}, res);
            this.changeDetectorRef.detectChanges();
        });
    }

    ID_NV: number = 0;
    loadDataPhep(page: boolean = false) {
        const queryParams = new QueryParamsModel(
            this.filterPhepConfiguration(),
            '',
            '',
            0,
            50,
            true,
        );

        this.leavePersonalService.findDataHanMucPhep(queryParams).subscribe(res => {
            if (res && res.status == 1 && res.data) {
                this.listphep = res.data;
            } else {
                this.listphep = [];
            }
            this.SoNgayPhepThamNien = res.SoNgayPhepThamNien;
            this.TongNgayPhepNam = res.TongNgayPhepNam;
            this.changeDetectorRef.detectChanges();
        })
    }

    filterPhepConfiguration(): any {
        let datenow = new Date();
        const filter: any = {};
        // filter.ID_NV = this.authService.getStaffId();
        filter.ID_NV = this.ID_NV;
        filter.Nam = datenow.getFullYear();
        // filter.Nam = 2021;
        return filter;
    }

    getPhepHuong(item: any, phepTN: number): any {
        let _tong = 0;
        if (item.IsPhepNam) {
            _tong = item.PhepDuocHuong - (+phepTN);
        }
        return _tong;
    }

    //================================Xử lý cho phần tăng ca=======================================
    itemTC: any;
    oldItemTC: any;
    ShowInfoTC: boolean = false;
    listWork: any[] = [];
    GetInfoTC(id) {
        this.listData_CapDuyet = [];
        this.listData_ApprovingUser = [];
        this.overtimeRegistrationService.Get_ChiTietDuyetTangCa(+id).subscribe(res => {
            this.itemTC = res;
            this.listData_CapDuyet = this.itemTC.Data_CapDuyet;
            this.listData_ApprovingUser = this.itemTC.Data_ApprovingUser;
            this.listWork = this.itemTC.workList;
            this.oldItemTC = Object.assign({}, res);
            this.changeDetectorRef.detectChanges();
        });
    }

    //================================Xử lý cho phần đổi ca làm việc=======================================
    itemDCLV: any;
    oldItemDCLV: any;
    ShowInfoDCLV: boolean = false;
    GetInfoDCLV(id) {
        this.listData_CapDuyet = [];
        this.listData_ApprovingUser = [];
        this.cahngeshiftService.Get_ChiTietDonXinDoiCa(+id).subscribe(res => {
            this.itemDCLV = res;
            this.oldItemDCLV = Object.assign({}, res);
            this.listData_CapDuyet = this.itemDCLV.Data_CapDuyet;
            this.listData_ApprovingUser = this.itemDCLV.Data_ApprovingUser;
            this.changeDetectorRef.detectChanges();

        });
    }
    //================================Xử lý cho phần giải trình chấm công=======================================
    listColumn: any[] = [];
    listLyDo: any[] = [];
    ShowInfoGTCC: boolean = false;
    TimeStr: string = '';
    mindate: Date;
    maxdate: Date;
    showButton: boolean = true;
    ID_GiaiTrinh: number = 0;
    GetInfoGTCC(IsThangNam: boolean = false) {
        const queryParams = new QueryParamsModel(
            this.filterConfigurationGTCC(IsThangNam), "", "", 0, 10, true
        );
        this.layoutUtilsService.showWaitingDiv();
        this.guiGiaiTrinhChamCongService.Get_DSChiTietGiaiTrinh(queryParams).subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            this.mindate = new Date(res.Nam, res.Thang - 1, 1);
            this.maxdate = new Date(res.Nam, res.Thang, 0);
            if (res.status == 1) {
                if (res.data.length > 0) {
                    if (res.SendDate != "" && res.SendDate != null) {
                        this.showButton = false;
                    } else {
                        this.showButton = true;
                    }
                    this.listColumn = res.data;
                } else {
                    this.showButton = true;
                    this.listColumn = []
                }
                this.ID_GiaiTrinh = res.RowID;
                this.TimeStr = res.Timestr;
                this.listData_CapDuyet = res.KhungDuyet;
            } else {
                if (res.status == -1) {
                    this.showButton = false;
                } else {
                    this.showButton = true;
                }
                this.listColumn = []
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            }
            this.changeDetectorRef.detectChanges();
        });

    }

    /** FILTRATION */
    filterConfigurationGTCC(IsThangNam: boolean): any {
        const filter: any = {};
        filter.ID = this.ID_GiaiTrinh;
        return filter;
    }

    getLoaiLyDo(val) {
        let obj = this.listLyDo.find(x => +x.RowID == +val.LyDoID);
        if (obj) {
            return obj.Title + " - ";
        }
        return "";
    }

    //================================Xử lý phần chọn hình============================================
    ObjImage: any = { h1: "", h2: "" };

    FileSelected(evt: any, list: any) {
        if (evt.target.files && evt.target.files.length) {//Nếu có file
            let file = evt.target.files[0]; // Ví dụ chỉ lấy file đầu tiên
            let size = file.size;

            list.TenFile = file.name;
            list.ContentType = file.type;
            let reader = new FileReader();
            let base64Str;

            reader.onload = (e: any) => {
                list.Image = e.target.result;
                this.changeDetectorRef.detectChanges();
            };

            reader.readAsDataURL(evt.target.files[0]);
            setTimeout(() => {
                base64Str = reader.result as String;
                var metaIdx = base64Str.indexOf(';base64,');
                base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
                this.ObjImage.h1 = base64Str;
                list.strBase64 = this.ObjImage.h1
            }, 1000);
        }
        else {

        }
    }

    deleteFile(list: any) {
        list.TenFile = "";
        list.strBase64 = "";
        list.Image = "";
        list.ContentType = "";
    }
    //================================Xử lý cho phần thôi việc=======================================
    ShowInfoTV: boolean = false;
    itemTV: any;
    oldItemTV: any;
    GetInfoTV() {
        this.xinThoiViecService.Get_Info().subscribe(res => {
            this.itemTV = res;
            this.listData_CapDuyet = this.itemTV.KhungDuyet;
            this.oldItemTV = Object.assign({}, res);
            this.changeDetectorRef.detectChanges();
        });
    }
    //===========================================================================================================================================================
    //===============================Duyệt nghỉ phép===================================================
    itemDuyetPhep: any;
    oldItem: any;
    id_row: number = 0;
    showKyDuyet: boolean = false;
    ShowWord: boolean = false;
    tennguoiduyet: string = '';
    vitriduyet: string = '';
    thongbao: string = '';
    showduyet: boolean = false;
    songay: string = '';
    enableBT: boolean = false;
    itemFormDuyetPhep: FormGroup;
    disabledBtn: boolean = false;
    GetInfoPhep_Manager(id) {
        this.resetPhep_M();
        this.id_row = id;
        this.listData_CapDuyet = [];
        this.listData_ApprovingUser = [];
        this.layoutUtilsService.showWaitingDiv();
        this.quanLyDuyetService.getItemById(+this.id_row, 1).subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            this.itemDuyetPhep = res;
            this.ShowWord = this.itemDuyetPhep.ShowWord;
            this.oldItem = Object.assign({}, res);
            this.songay = this.itemDuyetPhep.SoGio;
            this.listData_CapDuyet = this.itemDuyetPhep.Data_CapDuyet;
            this.listData_ApprovingUser = this.itemDuyetPhep.Data_ApprovingUser;
            if (this.listData_ApprovingUser) {
                this.listData_ApprovingUser.map((item, index) => {
                    this.tennguoiduyet = item.TenNguoiDuyet;
                    this.vitriduyet = item.ViTriDuyet;
                    this.thongbao = item.ThongBao;
                    this.showduyet = item.IsEnable_Duyet;
                    this.showKyDuyet = item.IsSignature;
                    if (item.IsEnable_Duyet != "" && item.IsEnable_Duyet == false) {
                        this.enableBT = true;
                    }
                });
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    resetPhep_M() {
        this.itemDuyetPhep = Object.assign({}, this.oldItem);
        this.createFormPhep_M();
        this.itemFormDuyetPhep.markAsPristine();
        this.itemFormDuyetPhep.markAsUntouched();
        this.itemFormDuyetPhep.updateValueAndValidity();
    }

    createFormPhep_M() {
        this.itemFormDuyetPhep = this.itemFB.group({
            ghiChu: [this.itemDuyetPhep.GhiChu],
        });
    }

    DuyetPhep() {
        if (this.showduyet) {
            const controls = this.itemFormDuyetPhep.controls;
            let _prod: QuanLyDuyetModel = new QuanLyDuyetModel();
            _prod.ID = +this.id_row;
            _prod.IsAccept = true;
            _prod.loai = 1;
            _prod.GhiChu = controls["ghiChu"].value;
            _prod.LangCode = localStorage.getItem('language');
            this.LuuThongTinDuyetPhep(_prod);
        }
    }

    KhongDuyetPhep() {
        const controls = this.itemFormDuyetPhep.controls;
        if (controls["ghiChu"].value != "" && controls["ghiChu"].value != null) {
            let _prod: QuanLyDuyetModel = new QuanLyDuyetModel();
            _prod.ID = +this.id_row;
            _prod.IsAccept = false;
            _prod.loai = 1;
            _prod.GhiChu = controls["ghiChu"].value;
            _prod.LangCode = localStorage.getItem('language');
            this.LuuThongTinDuyetPhep(_prod);
        } else {
            let message = "Vui lòng nhập lý do không duyệt";
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        }
    }

    KyDuyetPhep() {
        if (this.showduyet) {
            const controls = this.itemFormDuyetPhep.controls;
            let _prod: QuanLyDuyetModel = new QuanLyDuyetModel();
            _prod.ID = +this.id_row;
            _prod.IsAccept = true;
            _prod.loai = 1;
            _prod.GhiChu = controls["ghiChu"].value;
            _prod.LangCode = localStorage.getItem('language');
            this.LuuThongTinKyDuyetPhep(_prod);
        }
    }

    LuuThongTinDuyetPhep(val: QuanLyDuyetModel) {
        this.layoutUtilsService.showWaitingDiv();
        this.quanLyDuyetService.DuyetPhepCT(val).subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status == 1) {
                const _messageType = this.translate.instant('landingpagekey.thanhcong');
                this.layoutUtilsService.showActionNotification(_messageType, MessageType.Update, 4000, true, false);
                this.GetInfoPhep_Manager(+this.id_row);
                this.loadDataPhep();
                this.donTuServices.data_IsLoad$.next('Load');

            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    LuuThongTinKyDuyetPhep(val: QuanLyDuyetModel) {
        this.disabledBtn = true;
        this.quanLyDuyetService.KyDuyetPhep(val).subscribe(res => {
            this.disabledBtn = false;
            this.changeDetectorRef.detectChanges();
            if (res && res.status == 1) {
                window.open(res.data);
                const _messageType = this.translate.instant('landingpagekey.thanhcong');
                this.layoutUtilsService.showActionNotification(_messageType, MessageType.Update, 4000, true, false);
                this.GetInfoPhep_Manager(+this.id_row);
                // this.loadDataList_Manager();
                this.donTuServices.data_IsLoad$.next('Load');
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    //Cập nhật ngày 22/09/2022 - Bổ sung chức năng chuyển người khác duyệt
    public isBtnChuyen: boolean = true;
    Chuyen() {
        let formid = 0;
        if (this.__TypeID == "12") {
            const controls = this.itemFormDuyetTC.controls;
            formid = this.ShowHinhThuc ? controls["hinhthuc"].value : 0;
        }
        const dialogRef = this.dialog.open(RolesFormComponent, {
            data: {
                _id: this.__RowID, _typeid: this.__TypeID,
                _role: this.listData_ApprovingUser[0].ViTriDuyet,
                _roleid: this.listData_ApprovingUser[0].roleId,
                _formId: formid
            }, panelClass: ['sky-padding-0']
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            if (this.__TypeID == "1") {
                this.GetInfoPhep_Manager(+this.__RowID);
            }
            if (this.__TypeID == "12") {
                this.GetInfoTC_Manager(+this.__RowID);
            }
            if (this.__TypeID == "13") {
                this.RowIDTV = +this.__RowID;
                this.GetInfoTV_Manager();
            }
            if (this.__TypeID == "18") {
                this.GetInfoDCLV_Manager(+this.__RowID);
            }
            if (this.__TypeID == "19") {
                this.ID_GiaiTrinh = +this.__RowID;
                this.GetInfoGTCC_Manager();
            }
        });
    }

    //==========================================Duyệt tăng ca========================================================
    itemDuyetTC: any;
    itemFormDuyetTC: FormGroup;
    ShowHinhThuc: boolean = false;
    ID: number = 0;
    GhiChu: string = '';
    listCachTinhTangCa: any[] = [];
    GetInfoTC_Manager(id) {
        this.resetTC_M();
        this.ID = id;
        this.listData_CapDuyet = [];
        this.listData_ApprovingUser = [];
        this.layoutUtilsService.showWaitingDiv();
        this.quanLyDuyetService.Get_ChiTietDuyetTangCa(this.ID).subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            this.itemDuyetTC = res;

            if (this.itemDuyetTC.HinhThucChiTra == "") {
                this.itemDuyetTC.HinhThucChiTra = "1";
            }
            this.oldItem = Object.assign({}, res);
            if (res.IsFinal) {
                this.ShowHinhThuc = true;
                this.itemFormDuyetTC.controls["hinhthuc"].setValue('1');
                this.changeDetectorRef.detectChanges();
            }
            else {
                this.ShowHinhThuc = false;
                this.itemFormDuyetTC.controls["hinhthuc"].setValue(' ');
            }
            this.listData_CapDuyet = this.itemDuyetTC.Data_CapDuyet;
            this.listData_ApprovingUser = this.itemDuyetTC.Data_ApprovingUser;
            this.listData_ApprovingUser.map((item, index) => {
                this.tennguoiduyet = item.TenNguoiDuyet;
                this.vitriduyet = item.ViTriDuyet;
                this.thongbao = item.ThongBao;
                this.showduyet = item.IsEnable_Duyet;
                if (item.IsEnable_Duyet != "" && item.IsEnable_Duyet == false) {
                    this.enableBT = true;
                }
            });
            this.listWork = this.itemDuyetTC.workList;
            this.createFormTC_M();
            this.changeDetectorRef.detectChanges();
        });
    }

    resetTC_M() {
        this.itemDuyetTC = Object.assign({}, this.oldItem);
        this.createFormTC_M();
        this.itemFormDuyetTC.markAsPristine();
        this.itemFormDuyetTC.markAsUntouched();
        this.itemFormDuyetTC.updateValueAndValidity();
    }

    createFormTC_M() {
        this.itemFormDuyetTC = this.itemFB.group({
            hinhthuc: [this.itemDuyetTC.HinhThucChiTra, [Validators.required]],
        });
        this.itemFormDuyetTC.controls["hinhthuc"].markAsTouched();
    }

    DuyetORKhongDuyet(isaccept: boolean) {
        if (this.showduyet) {
            const controls = this.itemFormDuyetTC.controls;
            let _prod: ApprovalOTModel = new ApprovalOTModel();

            _prod.ID = this.ID;
            _prod.IsAccept = isaccept;
            _prod.GhiChu = this.GhiChu;
            _prod.HinhThucChiTra = controls["hinhthuc"].value;

            if (this.ShowHinhThuc) {
                if (_prod.HinhThucChiTra == "" && isaccept == true) // Chưa chọn hình thức chi trả và không duyệt thì k cần chọn hình thức chi trả
                {
                    this.layoutUtilsService.showActionNotification("Vui lòng chọn hình thức chi trả", MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                    return;
                }
            }
            if (isaccept == false && this.GhiChu == "") // Nhập lý do không duyệt
            {
                this.layoutUtilsService.showActionNotification("Vui lòng nhập lý do không duyệt", MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                return;
            }
            this.saveApproval(_prod);
        }
    }

    saveApproval(val: ApprovalOTModel) {
        this.disabledBtn = true;
        this.layoutUtilsService.showWaitingDiv();
        this.quanLyDuyetService.ApprovalOTDetail(val).subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            this.disabledBtn = false;
            this.changeDetectorRef.detectChanges();
            if (res && res.status == 1) {
                this.GetInfoTC_Manager(this.ID);
                // this.loadDataList_Manager();
                this.donTuServices.data_IsLoad$.next('Load');
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            }
        });
    }
    //==========================================Duyệt đổi ca làm việc========================================================
    RowID: number = 0;
    itemDuyetDCLV: any;
    itemFormDuyetDCLV: FormGroup;
    GetInfoDCLV_Manager(id) {
        this.createFormDCLV_M();
        this.RowID = id;
        this.listData_CapDuyet = [];
        this.listData_ApprovingUser = [];
        this.layoutUtilsService.showWaitingDiv();
        this.quanLyDuyetService.Get_ChiTietDonXinDoiCa(this.RowID).subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            this.itemDuyetDCLV = res;
            this.oldItem = Object.assign({}, res);
            this.songay = this.itemDuyetDCLV.SoGio;
            this.listData_CapDuyet = this.itemDuyetDCLV.Data_CapDuyet;
            this.listData_ApprovingUser = this.itemDuyetDCLV.Data_ApprovingUser;
            this.listData_ApprovingUser.map((item, index) => {
                this.tennguoiduyet = item.TenNguoiDuyet;
                this.vitriduyet = item.ViTriDuyet;
                this.thongbao = item.ThongBao;
                this.showduyet = item.IsEnable_Duyet;
                if (item.IsEnable_Duyet != "" && item.IsEnable_Duyet == false) {
                    this.enableBT = true;
                }
            });
            this.changeDetectorRef.detectChanges();

        });
    }

    createFormDCLV_M() {
        this.itemFormDuyetDCLV = this.itemFB.group({
            ghiChu: [''],
        });
    }

    DuyetDCLV() {
        if (this.showduyet) {
            const controls = this.itemFormDuyetDCLV.controls;
            let _prod: QuanLyDuyetModel = new QuanLyDuyetModel();
            _prod.ID = this.RowID;
            _prod.IsAccept = true;
            _prod.GhiChu = controls["ghiChu"].value;
            _prod.LangCode = localStorage.getItem('language');
            this.LuuThongTinDuyetDCLV(_prod);
        }
    }

    KhongDuyetDCLV() {
        const controls = this.itemFormDuyetDCLV.controls;
        if (controls["ghiChu"].value != "" && controls["ghiChu"].value != null) {
            let _prod: QuanLyDuyetModel = new QuanLyDuyetModel();
            _prod.ID = this.RowID;
            _prod.IsAccept = false;
            _prod.GhiChu = controls["ghiChu"].value;
            _prod.LangCode = localStorage.getItem('language');
            this.LuuThongTinDuyetDCLV(_prod);
        } else {
            let message = "Vui lòng nhập lý do không duyệt";
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        }

    }

    LuuThongTinDuyetDCLV(val: QuanLyDuyetModel) {
        this.disabledBtn = true;
        this.layoutUtilsService.showWaitingDiv();
        this.quanLyDuyetService.DuyetDonXinDoiCa(val).subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            this.disabledBtn = false;
            this.changeDetectorRef.detectChanges();
            if (res && res.status == 1) {
                this.GetInfoDCLV_Manager(this.RowID);
                // this.loadDataList_Manager();
                this.donTuServices.data_IsLoad$.next('Load');
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            }
        });
    }
    //=======================================Duyệt GTCC=========================================================
    NguoiDuyet: string = '';
    disableBt: boolean = false;
    GhiChuDuyet: string = '';
    HoTenNV: string = '';
    MaNV: string = '';
    ChucVuNV: string = '';
    CoCauNV: string = '';
    TimeStrNV: string = '';
    TinhTrang: string = '';
    ClassTinhTrang: string = '';
    GetInfoGTCC_Manager() {
        this.listData_CapDuyet = [];
        this.listData_ApprovingUser = [];
        this.layoutUtilsService.showWaitingDiv();
        this.quanLyDuyetService.Get_ChiTiet(this.ID_GiaiTrinh).subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status == 1) {
                //==============Hiện thị thông tin người gửi giải trình===========
                this.HoTenNV = res.HoTen;
                this.ChucVuNV = res.ChucVu;
                this.MaNV = res.MaNV;
                this.CoCauNV = res.CoCauToChuc;
                this.TimeStrNV = res.TimeStr;
                if (res.IsDuyet == null) {
                    this.TinhTrang = 'Chờ duyệt';
                    this.ClassTinhTrang = 'sauchoduyet';
                } else {
                    if (res.IsDuyet) {
                        this.TinhTrang = 'Đã duyệt';
                        this.ClassTinhTrang = 'saudaduyet';
                    } else {
                        this.TinhTrang = 'Không duyệt';
                        this.ClassTinhTrang = 'saukhongduyet';
                    }
                }
                //================================================================
                this.NguoiDuyet = res.NguoiDuyet;
                this.listColumn = res.data;
                if (this.NguoiDuyet != "") {
                    this.disableBt = false;
                }
                else {
                    this.disableBt = true;
                }
                this.listData_CapDuyet = res.Data_CapDuyet;
                this.listData_ApprovingUser = res.Data_ApprovingUser;
                this.listData_ApprovingUser.map((item, index) => {
                    this.tennguoiduyet = item.TenNguoiDuyet;
                    this.vitriduyet = item.ViTriDuyet;
                    this.thongbao = item.ThongBao;
                    this.showduyet = item.IsEnable_Duyet;
                    if (item.IsEnable_Duyet != "" && item.IsEnable_Duyet == false) {
                        this.enableBT = true;
                    }
                });
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    DuyetChange(val: any, item: any) {
        let _mod = new QuanLyDuyetModel();
        _mod.ID = item.RowID;
        _mod.IsAccept = val.checked;
        this.layoutUtilsService.showWaitingDiv();
        this.quanLyDuyetService.Duyet(_mod).subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status == 1) {
                this.GetInfoGTCC_Manager();
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    DuyetGTCC() {
        if (this.showduyet) {
            let _prod: QuanLyDuyetModel = new QuanLyDuyetModel();
            _prod.ID = +this.ID_GiaiTrinh;
            _prod.IsAccept = true;
            _prod.GhiChu = this.GhiChuDuyet;
            _prod.LangCode = localStorage.getItem('language');
            this.LuuThongTinDuyetGTCC(_prod);
        }
    }

    KhongDuyetGTCC() {
        let _prod: QuanLyDuyetModel = new QuanLyDuyetModel();
        if (this.GhiChuDuyet != "" && this.GhiChuDuyet != null && this.GhiChuDuyet != undefined) {
            _prod.ID = +this.ID_GiaiTrinh;
            _prod.IsAccept = false;
            _prod.GhiChu = this.GhiChuDuyet;
            _prod.LangCode = localStorage.getItem('language');
            this.LuuThongTinDuyetGTCC(_prod);
        } else {
            let message = "Vui lòng nhập lý do không duyệt";
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        }

    }

    LuuThongTinDuyetGTCC(val: QuanLyDuyetModel) {
        this.disabledBtn = true;
        this.layoutUtilsService.showWaitingDiv();
        this.quanLyDuyetService.DuyetDanhGia(val).subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            this.disabledBtn = false;
            if (res && res.status == 1) {
                this.GetInfoGTCC_Manager();
                // this.loadDataList_Manager();
                this.donTuServices.data_IsLoad$.next('Load');
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    openImage(val) {
        window.open(val, "_blank");
    }
    //========================================Duyệt thôi việc===============================================
    RowIDTV: number = 0;
    itemFormDuyetTV: FormGroup;
    GetInfoTV_Manager() {
        this.listData_CapDuyet = [];
        this.listData_ApprovingUser = [];
        this.layoutUtilsService.showWaitingDiv();
        this.quanLyDuyetService.Get_ChiTietDonThoiViec(this.RowIDTV).subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            this.createFormTV_M();
            this.itemTV = res;
            this.listData_CapDuyet = this.itemTV.Data_CapDuyet;
            this.listData_ApprovingUser = this.itemTV.Data_ApprovingUser;
            this.listData_ApprovingUser.map((item, index) => {
                this.tennguoiduyet = item.TenNguoiDuyet;
                this.vitriduyet = item.ViTriDuyet;
                if (item.IsEnable_Duyet != "" && item.IsEnable_Duyet == false) {
                    this.enableBT = true;
                }
            });
            this.changeDetectorRef.detectChanges();
        });
    }

    createFormTV_M() {
        this.itemFormDuyetTV = this.itemFB.group({
            ghiChu: [''],
        });
    }

    DuyetTV() {
        const controls = this.itemFormDuyetTV.controls;
        let _prod: QuanLyDuyetModel = new QuanLyDuyetModel();
        _prod.ID = this.RowIDTV;
        _prod.IsAccept = true;
        _prod.GhiChu = controls["ghiChu"].value;
        _prod.LangCode = localStorage.getItem('language');
        this.LuuThongTinDuyetTV(_prod);

    }

    KhongDuyetTV() {
        const controls = this.itemFormDuyetTV.controls;
        if (controls["ghiChu"].value != "" && controls["ghiChu"].value != null) {
            let _prod: QuanLyDuyetModel = new QuanLyDuyetModel();
            _prod.ID = this.RowIDTV;
            _prod.IsAccept = false;
            _prod.GhiChu = controls["ghiChu"].value;
            _prod.LangCode = localStorage.getItem('language');
            this.LuuThongTinDuyetTV(_prod);
        } else {
            let message = "Vui lòng nhập lý do không duyệt";
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        }

    }

    LuuThongTinDuyetTV(val: QuanLyDuyetModel) {
        this.disabledBtn = true;
        this.layoutUtilsService.showWaitingDiv();
        this.quanLyDuyetService.DuyetDonThoiViec(val).subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            this.disabledBtn = false;
            this.changeDetectorRef.detectChanges();
            if (res && res.status == 1) {
                this.GetInfoTV_Manager();
                // this.loadDataList_Manager();
                this.donTuServices.data_IsLoad$.next('Load');
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    getWidthDetails(): any {
        let tmp = 0;
        if (this.IsToiGui) {
            if (this.__TypeID == "19") {
                tmp = window.innerWidth - 350 - 70;
            } else {
                tmp = window.innerWidth - 350 - 70 - 300;
            }
        } else {
            tmp = window.innerWidth - 350 - 70;
        }
        return tmp + "px";
    }

    //=====================Bổ sung chọn công việc đăng ký tăng ca==================

    list_priority_new = [
        {
            name: 'Urgent',
            value: 1,
            icon: 'fab fa-font-awesome-flag text-danger',
        },
        {
            name: 'High',
            value: 2,
            icon: 'fab fa-font-awesome-flag text-warning',
        },
        {
            name: 'Normal',
            value: 3,
            icon: 'fab fa-font-awesome-flag text-info',
        },
        {
            name: 'Low',
            value: 4,
            icon: 'fab fa-font-awesome-flag text-muted',
        },
        {
            name: 'Clear',
            value: 0,
            icon: 'fas fa-times text-danger',
        },
    ];

    getPriority(id) {
        if (+id > 0 && this.list_priority_new) {
            const prio = this.list_priority_new.find((x) => x.value === +id);
            if (prio) {
                return prio;
            }
        }
        return {
            name: "Noset",
            value: 0,
            icon: "far fa-flag",
        };
    }

    ColorTitle(status: string): any {
        switch (status) {
            case '0':
                return 'cl-tamdung';
            case '-1':
                return 'cl-thatbai';
            case '1':
                return 'cl-thuchien';
            case '2':
                return 'cl-hoanthanh';

        }
        return 'cl-chuathuchien';
    }

    GetDetailsWork(item) {
        this.router.navigate(['', { outlets: { auxName: item.link }, }]);
    }

    getWidthDetails_Center(): any {
        let tmp = 0;
        if (this.__TypeID == "19") {
            tmp = window.innerWidth - 350 - 70;
        } else {
            tmp = window.innerWidth - 350 - 70 - 300;
        }
        return tmp + "px";
    }
}