import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { TranslateService } from "@ngx-translate/core";
import { LayoutUtilsService, MessageType } from "projects/jeehr/src/modules/crud/utils/layout-utils.service";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { ChangeShiftStaffbyStaffModel, ChiTietGiaiTrinhChamCongModel, GuiGiaiTrinhChamCongModel, LeavePersonalModel, NgayDoiCaModel, OvertimeRegistrationModel, XinThoiViecModel } from "../../../JeeCalendarModule/calendar/Model/calendar.model";
import { LeavePersonalService } from "../../../JeeCalendarModule/calendar/services/dang-ky-phep-ca-nhan.service";
import { ChangeShiftStaffbyStaffService } from "../../../JeeCalendarModule/calendar/services/doi-ca-lam-viec.service";
import { GuiGiaiTrinhChamCongService } from "../../../JeeCalendarModule/calendar/services/gui-giai-trinh-cham-cong.service";
import { OvertimeRegistrationService } from "../../../JeeCalendarModule/calendar/services/Overtime-registration.service";
import { XinThoiViecService } from "../../../JeeCalendarModule/calendar/services/xin-thoi-viec.service";
import { QueryParamsModel } from "../../../models/query-models/query-params.model";
import { DanhMucChungService } from "../../../services/danhmuc.service";
import { tinyMCE_TV } from "../../../services/tinyMCE_TV";
import { DonTuService } from "../services/don-tu.services";
//==============================================================================================
@Component({
    selector: 'app-don-tu-popup',
    templateUrl: './don-tu-popup.component.html',
})
export class DonTuPopupComponent implements OnInit {
    selectedTab: number = 0;
    hasFormErrors: boolean = false;
    viewLoading: boolean = false;
    loadingSubject = new BehaviorSubject<boolean>(false);
    loadingControl = new BehaviorSubject<boolean>(false);
    //============================Phép - Công tác===============================
    itemPhep: LeavePersonalModel;
    oldItemPhep: LeavePersonalModel;
    itemFormPhep: FormGroup;
    ShowText: boolean = false;
    showGio: boolean = true;
    listHinhThuc: any[] = [];
    GioNghi: any[] = [];
    DenGio: any[] = [];
    disabledBtnPhep: boolean = false;
    disableBt: boolean = true;
    NguoiDuyet: string = '';
    SoNgay: string = '0';
    //===Bổ sung chức năng cho viên chức
    ShowVienChuc: boolean = false;
    //============================Tăng ca===============================
    itemTangCa: any;
    oldItemTangCa: any;
    itemFormTangCa: FormGroup;
    GioNghiTC: any[] = [];
    DenGioTC: any[] = [];
    NguoiDuyetTC: string = '';
    disableBtTC: boolean = true;
    NgayTangCa: string;
    GioBatDau: string = '';
    GioKetThuc: string = '';
    isSaiGio: boolean = true;
    SoGio: string = '';
    disabledBtnTC: boolean = false;
    //============================Đổi ca làm việc===============================
    itemFormDCLV: FormGroup;
    listColumn: any[] = [];
    mindateDCLV: Date;
    listCaLamViec: any[] = [];
    showApDung: boolean = false;
    arr_ngaytrung: string = '';
    ngaytrung: string = '';
    count_ngaytrung: number = 0;
    listChiTiet: any[] = [];
    //============================Giải trình chấm công============================
    listNam: any[] = [];
    filterNam: string = '';
    filterThang: string = '';
    id_user: string = '';
    listLyDo: any[] = [];
    ID_GiaiTrinh: number = 0;
    TimeStr: string = '';
    mindate: Date;
    maxdate: Date;
    showButton: boolean = true;
    disabledBtn: boolean = false;
    ShowThangNam: boolean = false;
    //============================Thôi việc============================
    disableDuyet: boolean = false;
    itemTV: XinThoiViecModel;
    oldItemTV: XinThoiViecModel;
    itemFormTV: FormGroup;
    listData_CapDuyet: any[] = [];
    tinyMCE = {};

    constructor(public dialogRef: MatDialogRef<DonTuPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public danhMucChungService: DanhMucChungService,
        private changeDetectorRef: ChangeDetectorRef,
        public donTuServices: DonTuService,
        private layoutUtilsService: LayoutUtilsService,
        private translate: TranslateService,
        public datepipe: DatePipe,
        public leavePersonalService: LeavePersonalService,
        private itemFBPhep: FormBuilder,

        private _overtimeRegistrationService: OvertimeRegistrationService,
        private itemFBTangCa: FormBuilder,

        private cahngeshiftService: ChangeShiftStaffbyStaffService,
        private itemFBDCLV: FormBuilder,

        private guiGiaiTrinhChamCongService: GuiGiaiTrinhChamCongService,

        private xinThoiViecService: XinThoiViecService,
        private itemFBTV: FormBuilder,

        public dialog: MatDialog,
    ) {

    }
    ngOnInit(): void {
        this.createForm();
        if (this.ShowVienChuc) {
            this.itemFormPhep.controls['gioNghi'].setValue('00:00');
            this.itemFormPhep.controls['denGio'].setValue('00:00');
        } else {
            this.itemFormPhep.controls['buoi1'].setValue('AM');
            this.itemFormPhep.controls['buoi2'].setValue('AM');
        }
        this.danhMucChungService.GetListTypeLeaveByTitle().subscribe(res => {
            this.listHinhThuc = res.data;
            this.setUpDropSearchHinhThuc();
            if (this.listHinhThuc.length > 0) {
                let obj = this.listHinhThuc.find(x => x.IsPhepNam == true);
                if (obj) {
                    this.ShowText = true;
                    this.SoNgay = obj.SoNgay;
                    if (obj.SoNgay > 0) {
                        this.itemFormPhep.controls['hinhThuc'].setValue('' + obj.ID_type);
                    } else {
                        let _obj = this.listHinhThuc.find(x => x.TempID == 3);
                        this.itemFormPhep.controls['hinhThuc'].setValue('' + _obj.ID_type);
                    }
                }
            } else {
                this.itemFormPhep.controls['hinhThuc'].setValue('');
            }
            this.changeDetectorRef.detectChanges();
        });
        this.danhMucChungService.getAllGio('').subscribe(res => {
            this.GioNghi = res.data;
            this.DenGio = res.data;

            this.GioNghiTC = res.data;
            this.DenGioTC = res.data;


            this.setUpDropSearchTuGio();
            this.setUpDropSearchDenGio()
            this.changeDetectorRef.detectChanges();
        });
    }

    createForm() {
        //Dùng cho phần phép
        this.itemFormPhep = this.itemFBPhep.group({
            ngayBatDauNghi: ['', [Validators.required]],
            denNgay: ['', [Validators.required]],
            soNgay: [''],
            ghiChu: ['', Validators.required],
            hinhThuc: ['', Validators.required],
            gioNghi: ['', Validators.required],
            denGio: ['', Validators.required],
            //====Dùng cho viên chức
            buoi1: ['', Validators.required],
            buoi2: ['', Validators.required],
        });
        this.itemFormPhep.controls["ngayBatDauNghi"].markAsTouched();
        this.itemFormPhep.controls["denNgay"].markAsTouched();
        this.itemFormPhep.controls["hinhThuc"].markAsTouched();
        this.itemFormPhep.controls["gioNghi"].markAsTouched();
        this.itemFormPhep.controls["denGio"].markAsTouched();
        this.itemFormPhep.controls["ghiChu"].markAsTouched();
        this.itemFormPhep.controls["buoi1"].markAsTouched();
        this.itemFormPhep.controls["buoi2"].markAsTouched();
    }

    onLinkClick(eventTab: MatTabChangeEvent) {
        if (eventTab.index == 0) {
            this.selectedTab = 0;
        } else if (eventTab.index == 1) {
            this.createFormTangCa();
            this.selectedTab = 1;
            this._overtimeRegistrationService.getTenNguoiDuyet().subscribe(res => {
                this.NguoiDuyetTC = res.NguoiDuyet;
                if (this.NguoiDuyetTC != "") {
                    this.disableBtTC = false;
                }
                else {
                    this.disableBtTC = true;
                }
            })
        } else if (eventTab.index == 2) {
            this.createFormDCLV();
            this.selectedTab = 2;
            this.cahngeshiftService.Get_TenNguoiDuyet().subscribe(res => {
                if (res && res.status == 1) {
                    this.NguoiDuyet = res.NguoiDuyet;
                    if (this.NguoiDuyet != "") {
                        this.disableBt = false;
                    }
                    else {
                        this.disableBt = true;
                    }
                    this.changeDetectorRef.detectChanges();
                }
            });

            this.danhMucChungService.GetListCaLamViec().subscribe(res => {
                if (res && res.status == 1 && res.data.length > 0) {
                    this.listCaLamViec = res.data;
                    this.changeDetectorRef.detectChanges();
                }
            })
            this.listColumn = [];
            this.themcot();
        } else if (eventTab.index == 3) {
            this.selectedTab = 3;
            this.ShowThangNam = true;
            this.id_user = localStorage.getItem('staffID');
            this.LoadNgayGio();
            this.LoadNguoiDuyet();
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
        } else if (eventTab.index == 4) {
            this.selectedTab = 4;
            this.tinyMCE = tinyMCE_TV;
            this.resetTV();
            this.xinThoiViecService.Get_Info().subscribe(res => {
                this.itemTV = res;
                this.listData_CapDuyet = this.itemTV.KhungDuyet;
                this.oldItemTV = Object.assign({}, res);
                this.initProduct();
                this.changeDetectorRef.detectChanges();
            });
        } else {

        }
    }

    goBack() {
        this.dialogRef.close();
    }

    //=============================Lưu dữ liệu====================================
    onSubmit(withBack: boolean = false, type: string) {
        this.hasFormErrors = false;
        /** check form */
        if (type == '1') {
            const controls = this.itemFormPhep.controls;
            if (this.itemFormPhep.invalid) {
                Object.keys(controls).forEach(controlName =>
                    controls[controlName].markAsTouched()
                );

                this.hasFormErrors = true;
                this.selectedTab = 0
                return;
            }
            let updatedonvi = this.Prepareleave();
            if (this.ShowVienChuc) {
                // this.AddItemCCVC(updatedonvi, withBack);
            } else {
                this.AddItemPhep(updatedonvi, withBack);
            }
        } else if (type == '12') {
            const controls = this.itemFormTangCa.controls;
            if (this.itemFormTangCa.invalid) {
                Object.keys(controls).forEach(controlName =>
                    controls[controlName].markAsTouched()
                );

                this.hasFormErrors = true;
                this.selectedTab = 1
                return;
            }
            if (this.listChon.length > 0) {//Chọn công việc đăng ký tăng ca
                let _work = [];
                let _task = [];
                let _taskWork = [];
                this.listChon.map((item, index) => {
                    if (item.type == 1) {
                        _work.push(item);
                    } else if (item.type == 2){
                        _task.push(item);
                    }else{
                        _taskWork.push(item);
                    }
                })
                this.listWork = _work;
                this.listTask = _task;
                this.listTaskWork = _taskWork;
            }
            let updatedonvi = this.PrepareleaveTC();
            this.AddItemTC(updatedonvi, withBack);
        } else if (type == '18') {
            const controls = this.itemFormDCLV.controls;
            if (this.itemFormDCLV.invalid) {
                Object.keys(controls).forEach(controlName =>
                    controls[controlName].markAsTouched()
                );

                this.hasFormErrors = true;
                return;
            }
            let items = this.PrepareleaveDCLV();
            this.arr_ngaytrung = '';
            for (var i = 0; i < items.CaThayDoiList.length; i++) {
                this.count_ngaytrung = 0;
                for (var j = 0; j < items.CaThayDoiList.length; j++) {
                    if ((items.CaThayDoiList[j].ngaylamviec) >= (items.CaThayDoiList[i].ngaylamviec) && (items.CaThayDoiList[j].ngaylamviec) <= (items.CaThayDoiList[i].denngay) ||
                        (items.CaThayDoiList[j].denngay) >= (items.CaThayDoiList[i].ngaylamviec) && (items.CaThayDoiList[j].denngay) <= (items.CaThayDoiList[i].denngay) ||
                        (items.CaThayDoiList[j].ngaylamviec) <= (items.CaThayDoiList[i].ngaylamviec) && (items.CaThayDoiList[j].denngay) >= (items.CaThayDoiList[i].denngay)) {
                        this.count_ngaytrung++;
                    }
                }
                if (this.count_ngaytrung == 2) {
                    this.layoutUtilsService.showActionNotification("Dữ liệu đổi ca bị trùng. Vui lòng kiểm tra lại dữ liệu", MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                    return;
                }
            }
            //Xử lý lại thời gian để truyền API cho đúng chuẩn
            for (var i = 0; i < items.CaThayDoiList.length; i++) {
                items.CaThayDoiList[i].ngaylamviec = this.danhMucChungService.f_convertDateUTC(items.CaThayDoiList[i].ngaylamviec);
                items.CaThayDoiList[i].denngay = this.danhMucChungService.f_convertDateUTC(items.CaThayDoiList[i].denngay);
            }
            this.AddItemDCLV(items);
        } else if (type == '19') {
            let isflag = true;
            if (this.listColumn.length > 0) {
                this.listColumn.map((item, index) => {
                    if (item.RowID == null || item.RowID == 0) {
                        let message = "Vui lòng lưu dữ liệu trước khi gửi " + this.NguoiDuyet + " duyệt";
                        this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                        isflag = false;
                        return;
                    }
                })
            } else {
                let message = "Vui lòng thêm giải trình trước khi gửi " + this.NguoiDuyet + " duyệt";
                this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                isflag = false;
                return;
            }

            if (isflag) {
                let _item = new GuiGiaiTrinhChamCongModel();
                _item.RowID = this.ID_GiaiTrinh;
                _item.TimeStr = this.TimeStr;
                this.disabledBtn = true;
                this.guiGiaiTrinhChamCongService.GuiGiaiTrinh(_item).subscribe(res => {
                    this.disabledBtn = false;
                    this.changeDetectorRef.detectChanges();
                    if (res && res.status === 1) {
                        this.dialogRef.close({
                            _item
                        });
                    }
                    else {
                        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                    }
                });
            }
        } else if (type == '13') {
            const controls = this.itemFormTV.controls;
            if (this.itemFormTV.invalid) {
                Object.keys(controls).forEach(controlName =>
                    controls[controlName].markAsTouched()
                );

                this.hasFormErrors = true;
                this.selectedTab = 0;
                return;
            }
            if (controls['noiDung'].value == "" || controls['noiDung'].value == null) {
                let message = "Vui lòng nhập lý do thôi việc";
                this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                return;
            }
            let editedProduct = this.prepareProductTV();
            this.updateProductTV(editedProduct, withBack)
        } else {

        }

    }
    //==========================Xử lý cho phần đơn từ  nghỉ phép/công tác=============================
    //==========Dropdown Hình thức
    public bankFilterCtrl: FormControl = new FormControl();
    public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    setUpDropSearchHinhThuc() {
        this.bankFilterCtrl.setValue('');
        this.filterBanks();
        this.bankFilterCtrl.valueChanges
            .pipe()
            .subscribe(() => {
                this.filterBanks();
            });
    }
    protected filterBanks() {
        if (!this.listHinhThuc) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrl.value;
        if (!search) {
            this.filteredBanks.next(this.listHinhThuc.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanks.next(
            this.listHinhThuc.filter(bank => bank.title.toLowerCase().indexOf(search) > -1)
        );
    }
    //========Deopdown giờ 
    //====================Từ Giờ====================
    public bankTuGio: FormControl = new FormControl();
    public filteredBanksTuGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    //====================Đến giờ====================
    public bankDenGio: FormControl = new FormControl();
    public filteredBanksDenGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    setUpDropSearchTuGio() {
        this.bankTuGio.setValue('');
        this.filterBanksTuGio();
        this.bankTuGio.valueChanges
            .pipe()
            .subscribe(() => {
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
            this.GioNghi.filter(bank => bank.Gio.toLowerCase().indexOf(search) > -1)
        );
    }
    //===========================
    setUpDropSearchDenGio() {
        this.bankDenGio.setValue('');
        this.filterBanksDenGio();
        this.bankDenGio.valueChanges
            .pipe()
            .subscribe(() => {
                this.filterBanksDenGio();
            });
    }

    protected filterBanksDenGio() {
        if (!this.DenGio) {
            return;
        }
        // get the search keyword
        let search = this.bankDenGio.value;
        if (!search) {
            this.filteredBanksDenGio.next(this.DenGio.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanksDenGio.next(
            this.DenGio.filter(bank => bank.Gio.toLowerCase().indexOf(search) > -1)
        );
    }

    getTieuDeButton() {
        let name = "";
        if (this.NguoiDuyet != "") {
            name = this.translate.instant('phepcanhan.guicho') + " " + this.NguoiDuyet + " " + this.translate.instant('phepcanhan.duyet');
        }
        else {
            name = this.translate.instant('phepcanhan.khongtimthaynguoi') + " " + this.translate.instant('phepcanhan.duyet');
        }
        return name;
    }

    ChangeHinhThuc(val: string) {
        this.ShowText = true;
        let obj = this.listHinhThuc.find(x => x.ID_type === +val);
        if (obj) {
            this.SoNgay = obj.SoNgay;
        }
    }


    ngaynghi: string;
    denngay: string;
    gionghi: string = '';
    dengio: string = '';
    hinhthuc: string = '';
    buoi1: string = '';
    buoi2: string = '';
    loadNgayNghi() {
        if (this.ShowVienChuc) {
            const _product = new LeavePersonalModel();
            const controls = this.itemFormPhep.controls;
            this.ngaynghi = this.danhMucChungService.f_convertDate(controls["ngayBatDauNghi"].value);
            this.denngay = this.danhMucChungService.f_convertDate(controls["denNgay"].value);
            this.buoi1 = controls["buoi1"].value;
            this.buoi2 = controls["buoi2"].value;
            this.hinhthuc = controls["hinhThuc"].value;
            if (this.ngaynghi != undefined && this.denngay != undefined && this.buoi1 != undefined && this.buoi2 != undefined) {
                {
                    if (this.ngaynghi != "" && this.denngay != "" && this.ngaynghi != "" && this.denngay != "") {
                        _product.NgayBatDau = this.ngaynghi;
                        _product.NgayKetThuc = this.denngay;
                        _product.Buoi_NgayNghi = this.buoi1;
                        _product.Buoi_NgayVaoLam = this.buoi2;
                        _product.ID_HinhThuc = this.hinhthuc;
                        if (this.ShowVienChuc) {
                            // this.tinhSoNgayCCVC(_product, false);
                        }
                    }
                }
            }
        } else {
            const _product = new LeavePersonalModel();
            const controls = this.itemFormPhep.controls;
            this.ngaynghi = this.danhMucChungService.f_convertDate(controls["ngayBatDauNghi"].value);
            this.denngay = this.danhMucChungService.f_convertDate(controls["denNgay"].value);
            this.gionghi = controls["gioNghi"].value;
            this.dengio = controls["denGio"].value;
            this.hinhthuc = controls["hinhThuc"].value;

            if (this.ngaynghi != undefined && this.denngay != undefined && this.gionghi != undefined && this.dengio != undefined && this.hinhthuc != undefined) {
                {
                    if (this.ngaynghi != "" && this.denngay != "" && this.gionghi != "" && this.dengio != "" && this.hinhthuc != "") {
                        _product.NgayBatDau = this.ngaynghi;
                        _product.NgayKetThuc = this.denngay;
                        _product.GioBatDau = this.gionghi;
                        _product.GioKetThuc = this.dengio;
                        _product.ID_HinhThuc = this.hinhthuc;
                        this.tinhSoNgay(_product, false);
                    }
                }
            }
        }
    }

    tinhSoNgay(product: LeavePersonalModel, withBack: boolean = false) {
        // this.layoutUtilsService.showWaitingDiv();
        this.leavePersonalService.getSoNgay(product).subscribe(res => {
            // this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status === 1) {
                this.NguoiDuyet = res.NguoiDuyet;
                if (this.NguoiDuyet != "") {
                    this.disableBt = false;
                }
                else {
                    this.disableBt = true;
                }
                this.itemFormPhep.controls["soNgay"].setValue(res.SoNgay);
                this.changeDetectorRef.detectChanges();
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    Prepareleave(): LeavePersonalModel {
        const controls = this.itemFormPhep.controls;
        const bhxh = new LeavePersonalModel();
        bhxh.NgayBatDau = this.danhMucChungService.f_convertDate(controls["ngayBatDauNghi"].value);
        bhxh.NgayKetThuc = this.danhMucChungService.f_convertDate(controls["denNgay"].value);
        bhxh.GioBatDau = controls['gioNghi'].value;
        bhxh.GioKetThuc = controls['denGio'].value;
        bhxh.ID_HinhThuc = controls['hinhThuc'].value;
        let obj = this.listHinhThuc.find(x => +x.ID_type == +controls['hinhThuc'].value)
        bhxh.HinhThuc = obj.title;
        bhxh.GhiChu = controls['ghiChu'].value;
        bhxh.Buoi_NgayNghi = controls['buoi1'].value;
        bhxh.Buoi_NgayVaoLam = controls['buoi2'].value;
        bhxh.SoNgay = controls['soNgay'].value;
        return bhxh;
    }

    AddItemPhep(item: LeavePersonalModel, withBack: boolean) {
        this.disabledBtnPhep = true;
        // this.layoutUtilsService.showWaitingDiv();
        this.leavePersonalService.GuiDonXinPhep(item).subscribe(res => {
            // this.layoutUtilsService.OffWaitingDiv();
            this.disabledBtnPhep = false;
            this.changeDetectorRef.detectChanges();
            if (res && res.status === 1) {
                this.dialogRef.close({
                    item
                });
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    getGio(type: string) {
        const controls = this.itemFormPhep.controls;
        if (type == "tungay") {
            this.danhMucChungService.Gettime(this.danhMucChungService.f_convertDate(controls["ngayBatDauNghi"].value)).subscribe(res => {
                if (res && res.status == 1) {
                    this.ShowVienChuc = res.IsvienChuc;
                    if (this.ShowVienChuc) {
                        this.itemFormPhep.controls['buoi1'].setValue('' + res.TuGio);
                    } else {
                        this.itemFormPhep.controls['gioNghi'].setValue('' + res.TuGio);
                    }
                    this.loadNgayNghi();
                }
            })
        }
        if (type == "denngay") {
            this.danhMucChungService.Gettime(this.danhMucChungService.f_convertDate(controls["denNgay"].value)).subscribe(res => {
                if (res && res.status == 1) {
                    this.ShowVienChuc = res.IsvienChuc;
                    if (this.ShowVienChuc) {
                        this.itemFormPhep.controls['buoi2'].setValue('' + res.DenGio);
                    } else {
                        this.itemFormPhep.controls['denGio'].setValue('' + res.DenGio);
                    }
                }
                this.loadNgayNghi();
            })
        }
    }
    //==========================Xử lý cho phần đơn từ  tăng ca============================
    createFormTangCa() {
        //Dùng cho phần tăng ca
        this.itemFormTangCa = this.itemFBTangCa.group({
            NgayTangCa: ['', [Validators.required]],
            Hours: ['', Validators.required],
            ghiChu: ['', Validators.required],
            tugio: ['', Validators.required],
            dengio: ['', Validators.required],
            OverTime: [false],
            IsFixHours: [false],
        });
        this.itemFormTangCa.controls["NgayTangCa"].markAsTouched();
        this.itemFormTangCa.controls["tugio"].markAsTouched();
        this.itemFormTangCa.controls["dengio"].markAsTouched();
        this.itemFormTangCa.controls["ghiChu"].markAsTouched();
    }

    TinhSoGioOTCanCuVaoGioOT() {
        const sogiotangca = new OvertimeRegistrationModel();
        const controls = this.itemFormTangCa.controls;
        this.NgayTangCa = this.danhMucChungService.f_convertDate(controls["NgayTangCa"].value);
        this.GioBatDau = controls["tugio"].value;
        this.GioKetThuc = controls["dengio"].value;
        if (this.NgayTangCa != undefined && this.GioBatDau != undefined && this.GioKetThuc != undefined) {
            {
                if (this.NgayTangCa != "" && this.GioBatDau != "" && this.GioKetThuc != "") {
                    sogiotangca.NgayTangCa = this.NgayTangCa;
                    sogiotangca.GioBatDau = this.GioBatDau;
                    sogiotangca.GioKetThuc = this.GioKetThuc;
                    sogiotangca.OverTime = controls["OverTime"].value ? controls["OverTime"].value : false;
                    sogiotangca.IsFixHours = controls["IsFixHours"].value ? controls["IsFixHours"].value : false;
                    this.GetSoGioTangCa(sogiotangca, false);
                }
            }
        }
    }

    GetSoGioTangCa(sogiotangca: OvertimeRegistrationModel, withBack: boolean = false) {
        // this.layoutUtilsService.showWaitingDiv();
        this._overtimeRegistrationService.Get_SoGioTangCa(sogiotangca).subscribe(res => {
            // this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status === 1) {
                this.itemFormTangCa.controls["Hours"].setValue(res.S_SoGio);
                this.SoGio = res.SoGio;
                this.changeDetectorRef.detectChanges();
                this.isSaiGio = true;
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Create, 999999999, true, false, 0, 'top', 0);
                this.itemFormTangCa.controls["Hours"].setValue(res.S_SoGio);
                this.SoGio = res.SoGio;
                this.isSaiGio = false;
            }
        });
    }

    TenNguoiDuyet() {
        let name = "";
        if (this.NguoiDuyetTC != "" && this.NguoiDuyetTC != undefined) {
            name = this.translate.instant('landingpagekey.gui') + " " + this.NguoiDuyetTC + " " + this.translate.instant('landingpagekey.duyet');
        }
        else {
            name = this.translate.instant('landingpagekey.khongtimthaynguoiduyet');
        }
        return name;
    }

    PrepareleaveTC(): OvertimeRegistrationModel {
        const controls = this.itemFormTangCa.controls;
        const guitangca = new OvertimeRegistrationModel();
        guitangca.NgayTangCa = this.danhMucChungService.f_convertDate(controls['NgayTangCa'].value);
        guitangca.GioBatDau = controls['tugio'].value;
        guitangca.GioKetThuc = controls['dengio'].value;
        guitangca.LyDo = controls['ghiChu'].value;
        guitangca.SoGio = this.SoGio;
        guitangca.OverTime = controls["OverTime"].value ? controls["OverTime"].value : false;
        guitangca.IsFixHours = controls["IsFixHours"].value ? controls["IsFixHours"].value : false;
        if (this.listWork.length > 0) {
            let id = "";
            this.listWork.forEach(element => {
                id += "," + element.id_row;
            });
            guitangca.workId = id.substring(1);
        }
        if (this.listTask.length > 0) {
            let id = "";
            this.listTask.forEach(element => {
                id += "," + element.stageid;
            });
            guitangca.taskId = id.substring(1);
        }
        if (this.listTaskWork.length > 0) {
            let id = "";
            this.listTaskWork.forEach(element => {
                id += "," + element.stageid;
            });
            guitangca.task_WorkId = id.substring(1);
        }
        return guitangca;
    }

    AddItemTC(item: OvertimeRegistrationModel, withBack: boolean) {
        this.viewLoading = true;
        this.disabledBtnTC = true;
        // this.layoutUtilsService.showWaitingDiv();
        this._overtimeRegistrationService.GuiTangCa(item).subscribe(res => {
            // this.layoutUtilsService.OffWaitingDiv();
            this.disabledBtnTC = false;
            this.changeDetectorRef.detectChanges();
            if (res && res.status === 1) {
                this.dialogRef.close({
                    item
                });
            }
            else {
                this.viewLoading = false;
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 0, 'top', 0);
            }
        });
    }

    listChon: any[] = [];
    listWork: any[] = [];
    listTask: any[] = [];
    listTaskWork: any[] = [];
    ChonCongViec() {
        // const dialogRef = this.dialog.open(DonTuPopupCongViecComponent, {
        //     data: {}, panelClass: ['sky-padding-0', 'width900'],
        //     disableClose: true
        // });
        // dialogRef.afterClosed().subscribe((res) => {
        //     if (!res) {
        //         return
        //     }
        //     this.listChon = res.listChon;
        // });
    }

    removeWork(item: any): void {
        const index = this.listChon.indexOf(item);
        if (index >= 0) {
            this.listChon.splice(index, 1);
            this.changeDetectorRef.detectChanges();
        }
    }
    //==========================Xử lý cho phần đơn từ đổi ca làm việc============================
    createFormDCLV() {
        this.itemFormDCLV = this.itemFBDCLV.group({
            lydo: ['', Validators.required],
            ghiChu: [''],
        });
        this.itemFormDCLV.controls["lydo"].markAsTouched();
    }

    DateChange(val: any) {
        this.mindateDCLV = val.value;
        this.listColumn.map((item, index) => {
            if (item.ngaylamviec != "") {
                const ct = new NgayDoiCaModel();
                ct.ngaythaydoichange = val.value;
            }
        });
    }

    DateChangeDenNgay(val: any) {
        this.mindateDCLV = val.value;
        this.listColumn.map((item, index) => {
            if (item.denngay != "") {
                const ct = new NgayDoiCaModel();
                ct.denngay = val.value;
            }
        });
    }

    themcot() {
        this.showApDung = true;
        this.listColumn.push(
            {
                ID_Row: "",
                Title_Merge: "",
                ngaylamviec: "",
                denngay: "",
            }
        );
        this.updateChanges();
        this.changeDetectorRef.detectChanges();
    }

    fieldChanged(e: any, ind: number) {
        let obj = this.listCaLamViec.find(x => +x.CaThayDoiID === +e.value);
        if (obj) {
            this.listColumn[ind].Title_Merge = obj.CaThayDoi;
            this.listColumn[ind].ID_Row = '' + obj.CaThayDoiID;
        }
        this.showApDung = false;
        this.changeDetectorRef.detectChanges();
    }

    remove(item) {
        this.listColumn.splice(item, 1);
        this.showApDung = false;
        this.changeDetectorRef.detectChanges();
    }

    addcot() {
        this.showApDung = true;
        this.listColumn.push(
            {
                ID_Row: "",
                Title_Merge: "",
                ngaylamviec: "",
                denngay: "",
            }
        );
        this.updateChanges();
        this.changeDetectorRef.detectChanges();
    }

    updateChanges() {
        this.onChange(this.listColumn);
    }

    onChange: (_: any) => void = (_: any) => { };

    PrepareleaveDCLV(): ChangeShiftStaffbyStaffModel {
        const controls = this.itemFormDCLV.controls;
        const it = new ChangeShiftStaffbyStaffModel();
        it.LyDo = controls['lydo'].value;
        it.GhiChu = controls['ghiChu'].value;
        if (this.listColumn.length > 0) {
            this.listChiTiet = [];
            this.listColumn.map((item, index) => {
                if ((item.ID_Row != "" && item.ngaylamviec != "" && item.denngay != "")) {
                    const ct = new NgayDoiCaModel();

                    ct.CaThayDoiID = item.ID_Row;
                    ct.Title_Merge = item.Title_Merge;
                    ct.ngaythaydoichange = item.ngaylamviec;

                    if (item.ngaylamviec != "") {
                        ct.ngaylamviec = item.ngaylamviec;
                    } else {
                        ct.ngaylamviec = '';
                    }

                    if (item.denngay != "") {
                        ct.denngay = item.denngay;
                    } else {
                        ct.denngay = '';
                    }
                    this.listChiTiet.push(ct);
                }
            });
            it.CaThayDoiList = this.listChiTiet;
        }
        return it;
    }

    AddItemDCLV(item: ChangeShiftStaffbyStaffModel) {
        this.viewLoading = true;
        // this.layoutUtilsService.showWaitingDiv();
        this.cahngeshiftService.GuiDonXinDoiCa(item).subscribe(res => {
            // this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status === 1) {
                this.dialogRef.close({
                    item
                });
            }
            else {
                this.viewLoading = false;
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            }
        });

    }

    //==========================Xử lý cho phần đơn từ giải trình chấm công============================
    LoadNguoiDuyet() {
        this.guiGiaiTrinhChamCongService.Get_TenNguoiDuyet().subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status === 1) {
                this.NguoiDuyet = res.NguoiDuyet;
                if (this.NguoiDuyet != "") {
                    this.disableBt = false;
                }
                else {
                    this.disableBt = true;
                }
                this.changeDetectorRef.detectChanges();
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    LoadNgayGio() {
        if (this.ID_GiaiTrinh == 0) {
            this.danhMucChungService.Get_ThoiGianCKTinhCong().subscribe(res => {
                this.filterThang = '' + res.Thang;
                this.filterNam = '' + res.Nam;
                this.danhMucChungService.GetListYearByEmp(this.id_user).subscribe(res => {
                    this.listNam = res.data;
                    this.changeDetectorRef.detectChanges();
                });
                this.loadDataList();
            })
        } else {
            this.loadDataList();
        }
    }

    DateChangeGTCC(val: any, item: any) {
        const queryParams = new QueryParamsModel(
            this.filterConfigurationDate(val), "", "", 0, 10, true
        );
        this.guiGiaiTrinhChamCongService.Get_DSNgay(queryParams).subscribe(res => {
            if (res.status == 1) {
                item.Ngay = val.value;
                item.GioChamCong = res.data[0].GioChamCong;
                item.GioCanSua = '' + res.data[0].GioCanSua;
                this.changeDetectorRef.detectChanges();
            } else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                this.changeDetectorRef.detectChanges();
                return;
            }
        });
    }

    filterConfigurationDate(item: any): any {
        const filter: any = {};
        if (this.ID_GiaiTrinh > 0) {
            filter.ID = this.ID_GiaiTrinh;
        }
        filter.Ngay = this.f_convertDate(item.value);
        return filter;
    }

    f_convertDate(v: any) {
        if (v != "") {
            let a = new Date(v);
            return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
        }
    }

    loadDataList(IsThangNam: boolean = false) {
        const queryParams = new QueryParamsModel(
            this.filterConfiguration(IsThangNam), "", "", 0, 10, true
        );
        // this.layoutUtilsService.showWaitingDiv();
        this.guiGiaiTrinhChamCongService.Get_DSChiTietGiaiTrinh(queryParams).subscribe(res => {
            // this.layoutUtilsService.OffWaitingDiv();
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
    filterConfiguration(IsThangNam: boolean): any {
        const filter: any = {};
        if (IsThangNam) {
            filter.Thang = this.filterThang;
            filter.Nam = this.filterNam;
        } else {
            if (this.ID_GiaiTrinh > 0) {
                filter.ID = this.ID_GiaiTrinh;
            } else {
                filter.Thang = this.filterThang;
                filter.Nam = this.filterNam;
            }
        }

        return filter;
    }

    ThemCotGTCC() {
        let item = {
            RowID: 0,
            Ngay: "",
            GioChamCong: "",
            GioCanSua: "",
            GioVaoDung: "",
            GioRaDung: "",
            LyDoID: "",
            LyDo: "",
            strBase64: "",
            TenFile: "",
            Image: "",
            ContentType: "",
        };
        this.listColumn.splice(this.listColumn.length, 0, item);
        this.changeDetectorRef.detectChanges();

    }

    removeGTCC(item) {
        if (+item.RowID > 0) {
            const _title = this.translate.instant('landingpagekey.xoa');
            const _description = this.translate.instant('landingpagekey.bancochacchanmuonxoakhong');
            const _waitDesciption = this.translate.instant('landingpagekey.dulieudangduocxoa');
            const _deleteMessage = this.translate.instant('landingpagekey.xoathanhcong');
            const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
            dialogRef.afterClosed().subscribe(res => {
                if (!res) {
                    return;
                }
                this.guiGiaiTrinhChamCongService.HuyChiTietGiaiTrinh(item.RowID).subscribe(res => {
                    if (res && res.status === 1) {
                        const index = this.listColumn.indexOf(item, 0);
                        if (index > -1) {
                            this.listColumn.splice(index, 1);
                            this.changeDetectorRef.detectChanges();
                        }
                    }
                    else {
                        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                    }

                });
            });
        } else {
            const index = this.listColumn.indexOf(item, 0);
            if (index > -1) {
                this.listColumn.splice(index, 1);
                this.changeDetectorRef.detectChanges();
            }
        }
    }

    LuuGTCC(item: any) {
        let isflag = true;
        if (item.Ngay == "" || item.Ngay == null) {
            let message = "Ngày không hợp lệ";
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            isflag = false;
            return;
        }
        if (item.GioCanSua == "0") {
            if (item.GioVaoDung == "" || item.GioVaoDung == null) {
                let message = "Vui lòng nhập giờ vào đúng";
                this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                isflag = false;
                return;
            } else {
                if ((item.GioVaoDung || '').trim()) {
                    let a = item.GioVaoDung.split(":");
                    if (a.length == 2 && item.GioVaoDung.length == 5) {
                        if (+a[0] > 23 || +a[0] < 0) {
                            let message = item.GioVaoDung + ' không hợp lệ';
                            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                            isflag = false;
                            return;
                        } else if (+a[1] > 59 || +a[1] < 0) {
                            let message = item.GioVaoDung + ' không hợp lệ';
                            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                            isflag = false;
                            return;
                        } else {

                        }
                    } else {
                        let obj = this.checkThoiGian(item.GioVaoDung);
                        if (!obj) {
                            let message = item.GioVaoDung + ' không hợp lệ';
                            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                            isflag = false;
                            return;
                        }
                    }
                }
            }
        } else if (item.GioCanSua == "1") {
            if (item.GioRaDung == "" || item.GioRaDung == null) {
                let message = "Vui lòng chọn giờ ra đúng";
                this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                isflag = false;
                return;
            } else {
                if ((item.GioRaDung || '').trim()) {
                    let a = item.GioRaDung.split(":");
                    if (a.length == 2 && item.GioRaDung.length == 5) {
                        if (+a[0] > 23 || +a[0] < 0) {
                            let message = item.GioRaDung + ' không hợp lệ';
                            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                            isflag = false;
                            return;
                        } else if (+a[1] > 59 || +a[1] < 0) {
                            let message = item.GioRaDung + ' không hợp lệ';
                            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                            isflag = false;
                            return;
                        } else {

                        }
                    } else {
                        let obj = this.checkThoiGian(item.GioRaDung);
                        if (!obj) {
                            let message = item.GioRaDung + ' không hợp lệ';
                            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                            isflag = false;
                            return;
                        }
                    }
                }
            }
        } else if (item.GioCanSua == "2") {
            if (item.GioVaoDung == "" || item.GioRaDung == "" || item.GioVaoDung == null || item.GioRaDung == null) {
                let message = "Vui lòng chọn giờ vào đúng và giờ ra đúng";
                this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                isflag = false;
                return;
            } else if (item.GioVaoDung != "" && item.GioVaoDung != null) {
                if ((item.GioVaoDung || '').trim()) {
                    let a = item.GioVaoDung.split(":");
                    if (a.length == 2 && item.GioVaoDung.length == 5) {
                        if (+a[0] > 23 || +a[0] < 0) {
                            let message = item.GioVaoDung + ' không hợp lệ';
                            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                            isflag = false;
                            return;
                        } else if (+a[1] > 59 || +a[1] < 0) {
                            let message = item.GioVaoDung + ' không hợp lệ';
                            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                            isflag = false;
                            return;
                        } else {

                        }
                    } else {
                        let obj = this.checkThoiGian(item.GioVaoDung);
                        if (!obj) {
                            let message = item.GioVaoDung + ' không hợp lệ';
                            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                            isflag = false;
                            return;
                        }
                    }
                }
            } else if (item.GioRaDung != "" && item.GioRaDung != null) {
                if ((item.GioRaDung || '').trim()) {
                    let a = item.GioRaDung.split(":");
                    if (a.length == 2 && item.GioRaDung.length == 5) {
                        if (+a[0] > 23 || +a[0] < 0) {
                            let message = item.GioRaDung + ' không hợp lệ';
                            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                            isflag = false;
                            return;
                        } else if (+a[1] > 59 || +a[1] < 0) {
                            let message = item.GioRaDung + ' không hợp lệ';
                            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                            isflag = false;
                            return;
                        } else {

                        }
                    } else {
                        let obj = this.checkThoiGian(item.GioRaDung);
                        if (!obj) {
                            let message = item.GioRaDung + ' không hợp lệ';
                            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                            isflag = false;
                            return;
                        }
                    }
                }
            } else {

            }
        } else {
            let message = "Vui lòng chọn giờ cần sửa";
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            isflag = false;
            return;
        }

        if (this.listLyDo.length > 0) {
            if (item.LyDoID == "" || item.LyDoID == null) {
                let message = "Vui lòng chọn lý do giải trình";
                this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                isflag = false;
                return;
            }
        }

        if (item.LyDo == "" || item.LyDo == null) {
            let message = "Vui lòng nhập lý do giải trình";
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            isflag = false;
            return;
        }
        if (isflag) {
            let _item = new ChiTietGiaiTrinhChamCongModel();
            _item.RowID = this.ID_GiaiTrinh;
            _item.Ngay = this.danhMucChungService.f_convertDateUTC(item.Ngay);
            _item.GioVao = item.GioVaoDung;
            _item.GioRa = item.GioRaDung;
            _item.GioCanSua = item.GioCanSua;
            _item.LyDo = item.LyDo;
            _item.Thang = +this.filterThang;
            _item.Nam = +this.filterNam;
            _item.File = item.strBase64;
            _item.FileName = item.TenFile;
            _item.LyDoID = +item.LyDoID;
            _item.ContentType = item.ContentType;

            this.disabledBtn = true;
            this.guiGiaiTrinhChamCongService.Insert_ChiTietGiaiTrinh(_item).subscribe(res => {
                this.disabledBtn = false;
                if (res && res.status === 1) {
                    item.RowID = +res.data.RowID;
                    if (this.ID_GiaiTrinh == 0 || this.ID_GiaiTrinh == undefined) {
                        this.ID_GiaiTrinh = +res.ID_GiaiTrinh;
                        this.loadDataList();
                    }
                    const _messageType = this.translate.instant('landingpagekey.themthanhcong');
                    this.layoutUtilsService.showActionNotification(_messageType, MessageType.Create, 4000, true, false);
                    this.changeDetectorRef.detectChanges();
                }
                else {
                    if (this.ID_GiaiTrinh == 0 || this.ID_GiaiTrinh == undefined) {
                        this.ID_GiaiTrinh = +res.ID_GiaiTrinh;
                    }
                    this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                    this.changeDetectorRef.detectChanges();
                }
            });
        }
    }

    checkThoiGian(v: any): any {
        var regex = /^([1-9]|([012][0-9])|(3[01]))\/([0]{0,1}[1-9]|1[012])\/\d\d\d\d\s([0-1]?[0-9]|2?[0-3]):([0-5]\d)$/g;
        var found = v.match(regex);
        if (found == null) {
            return false;
        }
        return true;
    }

    getHeight(): any {
        let tmp_height = window.innerHeight - 350;
        return tmp_height + "px";
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
    //==========================Xử lý cho phần đơn từ thôi việc============================
    resetTV() {
        this.itemTV = Object.assign({}, this.oldItemTV);
        this.createFormTV();
        this.hasFormErrors = false;
        this.itemFormTV.markAsPristine();
        this.itemFormTV.markAsUntouched();
        this.itemFormTV.updateValueAndValidity();
    }
    initProduct() {
        this.createFormTV();
        this.loadingSubject.next(false);
        this.loadingControl.next(true);
    }
    createFormTV() {
        this.itemFormTV = this.itemFBTV.group({
            ngaythoiviecdukien: [this.f_convertDate(this.itemTV.Ngay), [Validators.required]],
            noiDung: [this.itemTV.Lydo],
        });
        this.itemFormTV.controls["ngaythoiviecdukien"].markAsTouched();
    }
    getTieuDeButtonTV() {
        let name = "";
        if (this.itemTV.NguoiDuyet != "" && this.itemTV.NguoiDuyet != null) {
            this.disableDuyet = false;
            name = this.translate.instant('xinthoiviec.gui') + " " + this.itemTV.NguoiDuyet + " " + this.translate.instant('xinthoiviec.duyet');
        }
        else {
            this.disableDuyet = true;
            name = this.translate.instant('xinthoiviec.khongtimthaynguoiduyet');
        }
        return name;
    }

    prepareProductTV(): XinThoiViecModel {
        const _product = new XinThoiViecModel();
        const controls = this.itemFormTV.controls;
        _product.Ngay = controls["ngaythoiviecdukien"].value;
        _product.Lydo = controls['noiDung'].value;
        return _product;
    }

    updateProductTV(_product: XinThoiViecModel, withBack: boolean = false) {
        this.loadingSubject.next(true);
        this.disabledBtn = true;
        this.xinThoiViecService.GuiDonXinThoiViec(_product).subscribe(res => {
            this.loadingSubject.next(false);
            this.disabledBtn = false;
            this.changeDetectorRef.detectChanges();
            if (res && res.status === 1) {
                this.dialogRef.close({
                    _product
                });
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            }
        });
    }
}