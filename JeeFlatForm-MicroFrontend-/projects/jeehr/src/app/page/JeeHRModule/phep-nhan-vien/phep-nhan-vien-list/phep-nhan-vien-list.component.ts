import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { LayoutUtilsService } from "src/app/modules/crud/utils/layout-utils.service";
import { NghiPhepInfoComponent } from "../../../JeeCalendarModule/calendar/nghi-phep-info/nghi-phep-info.component";
import { LeavePersonalService } from "../../../JeeCalendarModule/calendar/services/dang-ky-phep-ca-nhan.service";
import { OvertimeRegistrationService } from "../../../JeeCalendarModule/calendar/services/Overtime-registration.service";
import { QueryParamsModel, QueryParamsModelNew } from "../../../models/query-models/query-params.model";
import { DanhMucChungService } from "../../../services/danhmuc.service";
import { PhepNhanVienService } from "../services/phep-nhan-vien.services";
@Component({
    selector: 'app-phep-nhan-vien-list',
    templateUrl: './phep-nhan-vien-list.component.html',
})
export class PhepNhanVienListComponent implements OnInit {
    Nam: string = "";
    labelNam: string = "";
    listYears: any = [];
    dataLazyLoad: any = [];
    dataLazyLoadLeave: any = [];
    //=======================================
    _ID_NV: string = '';
    keyword = "";
    constructor(
        private danhMucChungService: DanhMucChungService,
        private changeDetectorRef: ChangeDetectorRef,
        public phepNhanVienServices: PhepNhanVienService,
        private translate: TranslateService,
        public datepipe: DatePipe,
        public leavePersonalService: LeavePersonalService,
        public dialog: MatDialog,
        public overtimeRegistrationService: OvertimeRegistrationService,
    ) {

    }
    ngOnInit(): void {
        this.loadNam();
    }

    loadNam() {
        this.danhMucChungService.GetListYearByCustemerID().subscribe(res => {
            if (res && res.status == 1) {
                this.listYears = res.data;
                this.Nam = res.data[0].ID_Row;
                this.labelNam = res.data[0].Title;
                this.loadDataList();
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    changeNam(item) {
        this.labelNam = item.Title;
        this.Nam = item.ID_Row;
        this.loadDataList();
    }

    loadDataList() {
        this.dataLazyLoad = [];
        const queryParams = new QueryParamsModelNew(
            this.filterConfiguration(),
            "asc",
            "",
            0,
            100,
            true
        );
        this.phepNhanVienServices.Get_DanhSachNV(queryParams).subscribe(res => {
            if (res && res.status == 1) {
                if (res.data.length > 0) {
                    this.dataLazyLoad = res.data;
                    this.GetDetails(res.data[0].ID_NV);
                }
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    filterConfiguration(): any {
        const filter: any = {};
        filter.Nam = this.Nam;
        filter.keyword = this.keyword;
        filter.ID_NV = this._ID_NV;
        filter.TuNgay = "01/01/" + this.Nam;
        filter.DenNgay = "31/12/" + this.Nam;
        return filter;
    }

    getHeight(): any {
        let tmp_height = window.innerHeight - 215;
        return tmp_height + "px";
    }

    getHeightCenter(): any {
        let tmp_height = window.innerHeight - 70;
        return tmp_height + "px";
    }
    //===================================================
    GetDetails(val) {
        this._ID_NV = val;
        this.ShowInfoPhep = true;
        this.loadListPhepStaff();
        this.loadDataPhep();
    }

    loadListPhepStaff() {
        this.dataLazyLoadLeave = [];
        const queryParams = new QueryParamsModelNew(
            this.filterConfiguration(),
            "asc",
            "",
            0,
            100,
            true
        );
        this.phepNhanVienServices.Get_DSNghiPhep(queryParams).subscribe(res => {
            if (res && res.status == 1) {
                this.dataLazyLoadLeave = res.data;
            }
            this.changeDetectorRef.detectChanges();
        });
    }
    //================================Xử lý cho phần phép-công tác=======================================
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
        const filter: any = {};
        filter.ID_NV = this._ID_NV;
        filter.Nam = this.Nam;
        return filter;
    }

    getPhepHuong(item: any, phepTN: number): any {
        let _tong = 0;
        if (item.IsPhepNam) {
            _tong = item.PhepDuocHuong - (+phepTN);
        }
        return _tong;
    }

    ChiTiet(item) {
        const dialogRef = this.dialog.open(NghiPhepInfoComponent, { data: { _item: { ID_Row: item.RowID } }, panelClass: ['sky-padding-0', 'width70'] });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
        });
    }

    getWidthDetails(): any {
        let tmp = window.innerWidth - 350 - 70 - 350;
        return tmp + "px";
    }
}