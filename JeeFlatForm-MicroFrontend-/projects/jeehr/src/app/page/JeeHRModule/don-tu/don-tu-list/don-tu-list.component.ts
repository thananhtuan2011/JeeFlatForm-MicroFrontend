import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { environment } from "projects/jeehr/src/environments/environment";
import { LayoutUtilsService, MessageType } from "projects/jeehr/src/modules/crud/utils/layout-utils.service";
import { TranslationService } from "projects/jeehr/src/modules/i18n/translation.service";
import { tap } from "rxjs/operators";
import { QueryParamsModelNew } from "../../../models/query-models/query-params.model";
// import { OvertimeRegistrationService } from "src/app/pages/JeeCalendarModule/calendar/services/Overtime-registration.service";
// import { QueryParamsModel, QueryParamsModelNew } from "src/app/pages/models/query-models/query-params.model";
import { DynamicSearchFormService } from "../../component/dynamic-search-form/dynamic-search-form.service";
import { DonTuPopupComponent } from "../don-tu-popup/don-tu-popup.component";
import { DonTuService } from "../services/don-tu.services";
import { locale as viLang } from 'projects/jeehr/src/modules/i18n/vocabs/vi';
import { HttpParams } from "@angular/common/http";
import { LeavePersonalService } from "../../../JeeCalendarModule/calendar/services/dang-ky-phep-ca-nhan.service";
import { MatTabChangeEvent } from "@angular/material/tabs";

@Component({
    selector: 'app-don-tu-list',
    templateUrl: './don-tu-list-new.component.html',
    styleUrls: ['./don-tu-list-new.component.scss']

})
export class DonTuListComponent implements OnInit {
    filterStatusID: string = "";
    labelTinhTrang: string = 'Tất cả';
    dataLazyLoad: any = [];
    listTypeOption: any = [];
    selectedTab: number = 0;
    //==========Dropdown Search==============
    filter: any = {};
    //=======================================
    __TypeID: string = '';
    __RowID: string = '';
    ID_NV: number = 0;
    //=======================================
    IsToiGui: boolean = true;
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        public donTuServices: DonTuService,
        private dynamicSearchFormService: DynamicSearchFormService,
        private translate: TranslateService,
        public datepipe: DatePipe,
        public leavePersonalService: LeavePersonalService,
        private layoutUtilsService: LayoutUtilsService,
        public dialog: MatDialog,
        // public overtimeRegistrationService: OvertimeRegistrationService,
        private router: Router,
        private translationService: TranslationService,
    ) {
        this.translationService.loadTranslations(
            viLang,
        );
        var langcode = localStorage.getItem('language');
        if (langcode == null)
            langcode = this.translate.getDefaultLang();
        this.translationService.setLanguage(langcode);
    }
    ngOnInit(): void {
        this.dateCur = new Date();
        this.filterNam = '' + this.dateCur.getFullYear();
        this.CreateYear();
        let opt = {
            title: this.translate.instant('landingpagekey.timkiem'),
            searchbox: 'keyword',
            controls: [
                {
                    type: 0,
                    name: 'keyword',
                    placeholder: this.translate.instant('landingpagekey.tukhoa'),
                },
                {
                    type: 5,
                    placeholder: this.translate.instant('landingpagekey.khoangthoigian'),
                    from: {
                        name: 'StartDate',
                    },
                    to: {
                        name: 'EndDate',
                    },
                },
                {
                    type: 1,
                    name: 'TypeID',
                    placeholder: this.translate.instant('dontu.loaiyeucau'),
                    api: `/controllergeneral/GetListTypeApproval`,
                    idname: 'RowID',
                    titlename: 'Title',
                },
            ],
        };
        this.dynamicSearchFormService.setOption(opt);
        this.dynamicSearchFormService.filterResult.subscribe((value) => {
            this.filter = value;
            this.loadTypeOption();
        });

        this.donTuServices.data_IsLoad$.subscribe((data: any) => {
            if (data && data != '') {
                if (data == 'Load') {
                    this.loadTypeOption();
                    this.donTuServices.data_IsLoad$.next('')
                }
            }
        })


    }

    loadTypeOption() {
        const queryParams = new QueryParamsModelNew(
            this.filterConfigurationType(),
            "asc",
            "",
            0,
            100,
            true
        );
        this.donTuServices.loadTypeOption(queryParams).subscribe(res => {
            if (res && res.status == 1) {
                this.listTypeOption = res.data;
                this.changeDetectorRef.detectChanges();
                setTimeout(() => {
                    this.getParamType();
                }, 500);
            }
        });
    }

    filterConfigurationType(): any {
        this.filter.StatusID = 2;
        if (this.IsToiGui == true) {
            this.filter.typeid = "0";
        } else {
            this.filter.typeid = "1";
        }
        return this.filter;
    }

    tinhTrangchange(val, title) {
        this.labelTinhTrang = title;
        this.filterStatusID = val;
        this.loadTypeOption();
    }
    //=======================Xử lý load top 20==========================
    _loading = false;
    _HasItem = false;
    crr_page = 0;
    page_size = 20;
    total_page = 0;
    loadDataList() {
        this.crr_page = 0;
        this.page_size = 20;
        const queryParams = new QueryParamsModelNew(
            this.filterConfiguration(),
            'asc',
            '',
            this.crr_page,
            this.page_size,
        );
        this.donTuServices.loadDonTu(queryParams, this.IsToiGui).subscribe(res => {
            if (res && res.status == 1) {
                this.dataLazyLoad = [];

                this.dataLazyLoad = [...this.dataLazyLoad, ...res.data];

                this.total_page = res.page.AllPage;
                if (this.dataLazyLoad.length > 0) {
                    this._HasItem = true;
                }
                else {
                    this._HasItem = false;
                }
                this._loading = false;
            } else {
                this.dataLazyLoad = [];
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    loadDataList_Lazy() {
        if (!this._loading) {
            this.crr_page++;
            if (this.crr_page < this.total_page) {
                this._loading = true;
                const queryParams = new QueryParamsModelNew(
                    this.filterConfiguration(),
                    '',
                    '',
                    this.crr_page,
                    this.page_size,
                );
                this.donTuServices.loadDonTu(queryParams, this.IsToiGui)
                    .pipe(
                        tap(resultFromServer => {
                            if (resultFromServer.status == 1) {
                                this.dataLazyLoad = [...this.dataLazyLoad, ...resultFromServer.data];

                                if (resultFromServer.data.length > 0) {
                                    this._HasItem = true;
                                }
                                else {
                                    this._HasItem = false;
                                }
                                this.changeDetectorRef.detectChanges();
                            }
                            else {
                                this._loading = false;
                                this._HasItem = false;
                            }

                        })
                    ).subscribe(res => {
                        this._loading = false;
                    });
            }
        }
    }

    filterConfiguration(): any {
        this.filter.StatusID = this.filterStatusID;
        if (this.IsToiGui == true) {
            this.filter.typeid = "0";
        } else {
            this.filter.typeid = "1";
        }
        return this.filter;
    }

    onScroll(event) {
        let _el = event.srcElement;
        if (_el.scrollTop + _el.clientHeight > _el.scrollHeight * 0.9) {
            this.loadDataList_Lazy();
        }
    }
    //=================================================================================================

    ShowInfoTC: boolean = false;
    ShowInfoDCLV: boolean = false;
    ShowInfoGTCC: boolean = false;
    ShowInfoTV: boolean = false;
    ShowInfoPhep: boolean = false;
    onLinkClick(ind) {
        this.ShowInfoTC = false;
        this.ShowInfoDCLV = false;
        this.ShowInfoGTCC = false;
        this.ShowInfoTV = false;
        this.ShowInfoPhep = false;
        this.selectedTab = ind;
        this.__RowID = "";
        this.__TypeID = "";
        this.router.navigateByUrl(`HR/DonTu`);
        if (this.selectedTab == 0) {
            this.selectedTab = 0;
            this.IsToiGui = true;
            this.loadDataPhep();
        }
        else {
            this.selectedTab = 1;
            this.IsToiGui = false;
        }
        this.loadDataList();
    }

    getParamType() {
        const url = window.location.href;
        if (url.includes('?')) {
            const httpParams = new HttpParams({ fromString: url.split('?')[1] });
            if (httpParams.get('IsGui') == "1") {
                this.IsToiGui = true;
                this.selectedTab = 0;
                this.loadDataList();
                this.loadDataPhep();

            }
            if (httpParams.get('IsGui') == "0") {
                this.IsToiGui = false;
                this.selectedTab = 1;
                this.loadDataList();
            }
        } else {
            this.IsToiGui = this.selectedTab == 0 ? true : false;
            this.loadDataList();
            this.loadDataPhep();
        }
    }

    getHeight(): any {
        let tmp_height = window.innerHeight - 215;
        return tmp_height + "px";
    }

    getHeightCenter(): any {
        let tmp_height = window.innerHeight - 65;
        return tmp_height + "px";
    }

    AddDonTu() {
        let saveMessageTranslateParam = '';
        saveMessageTranslateParam = this.translate.instant('landingpagekey.thanhcong');
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);
        const _messageType = MessageType.Create;
        const dialogRef = this.dialog.open(DonTuPopupComponent, {
            data: {}, panelClass: ['sky-padding-0', 'width900'],
            disableClose: true
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return
            } else {
                this.loadDataList();
                this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
            }
        });
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
            color = "#F48120";
        } else {
            if (val.Valid) {
                //Thiên thay đổi code để đồng bộ color theo custemer
                const styles = window.getComputedStyle(document.body);
                let _color = styles.getPropertyValue("--btn-add-plus");
                color = _color;
            } else {
                color = "#DC3545";
            }
        }
        return color;
    }
    GetDetails(val) {
        this.__TypeID = '' + val.TypeID;
        this.ID_NV = val.ID_NV;
        this.__RowID = '' + val.RowID;
        if (this.IsToiGui) {
            this.router.navigateByUrl(`HR/DonTu/${this.__TypeID}/${this.ID_NV}/${this.__RowID}?IsGui=1`);
        } else {
            this.router.navigateByUrl(`HR/DonTu/${this.__TypeID}/${this.ID_NV}/${this.__RowID}?IsGui=0`);
        }
    }

    getMoreInformation(item): string {
        return item.CreatedBy + ' - ' + item.MaNV + ' \n ' + item.TenChucDanh;
    }
    //===============================================================================
    listphep: any[] = [];
    SoNgayPhepThamNien: number = 0;
    TongNgayPhepNam: number = 0;

    loadDataPhep(page: boolean = false) {
        const queryParams = new QueryParamsModelNew(
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
        // filter.ID_NV = this.ID_NV;
        filter.ID_NV = +localStorage.getItem('staffID');
        filter.Nam = this.filterNam;
        return filter;
    }

    getPhepHuong(item: any, phepTN: number): any {
        let _tong = 0;
        if (item.IsPhepNam) {
            _tong = item.PhepDuocHuong - (+phepTN);
        }
        return _tong;
    }

    getPadding() {
        let w = 0;
        w = window.innerWidth - 350 - 70 - 300;
        return w + 'px'
    }

    //===========================Xử lý năm cho loại đơn từ phép============================
    dateCur: Date;
    TitleMonthCalendar: string = '';
    filterNam: string = '';
    showNextY: boolean = true;
    CreateYear() {
        var today;
        today = new Date(this.dateCur);
        this.XuLyDateMonth(today);
        this.checkShowNextY();
    }
    BeforeYear() {
        var today;
        today = new Date(this.dateCur.setFullYear(this.dateCur.getFullYear() - 1));
        this.XuLyDateMonth(today);
        this.filterNam = '' + today.getFullYear();
        this.filter.Nam = this.filterNam;
        this.loadDataPhep();
        this.checkShowNextY();
    }

    NextYear() {
        var today;
        today = new Date(this.dateCur.setFullYear(this.dateCur.getFullYear() + 1));
        this.XuLyDateMonth(today);
        this.filterNam = '' + today.getFullYear();
        this.filter.Nam = this.filterNam;
        this.loadDataPhep();
        this.checkShowNextY()
    }

    XuLyDateMonth(today) {
        this.TitleMonthCalendar = today.getFullYear();
    }

    checkShowNextY() {
        let date = new Date();
        if (+this.filterNam < +date.getFullYear()) {
            this.showNextY = true;
        } else {
            this.showNextY = false;
        }
    }

    minimizeText(text, TypeID) {
        if (TypeID == 1) {
            let cd = 20;
            if (text) {
                if (text.length > cd) {
                    return text.slice(0, cd) + '...';
                }
                return text;
            }
        } else {
            return text;
        }

    }

    checkLink() {
        const url = window.location.href;
        if (url.includes('?')) {
            return false;
        } else {
            return true;
        }
    }
}