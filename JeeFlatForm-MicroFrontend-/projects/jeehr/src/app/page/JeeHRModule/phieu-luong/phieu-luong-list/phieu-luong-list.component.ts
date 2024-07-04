import { ChangeDetectorRef, Component, OnInit, Pipe, PipeTransform } from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { TranslateService } from "@ngx-translate/core";
import { LayoutUtilsService, MessageType } from "projects/jeehr/src/modules/crud/utils/layout-utils.service";
import { QueryParamsModel } from "../../../models/query-models/query-params.model";
import { DanhMucChungService } from "../../../services/danhmuc.service";
import { BangCongService } from "../../bang-cong/Services/bang-cong.service";
import { XemPhieuLuongService } from "../Services/xem-phieu-luong.service";


@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitized: DomSanitizer) { }
    transform(value) {
        return this.sanitized.bypassSecurityTrustHtml(value);
    }
}

@Component({
    selector: 'm-phieu-luong-list',
    templateUrl: './phieu-luong-list.component.html',
})
export class PhieuLuongListComponent implements OnInit {

    filterNam: string = ''; //cho dropdown năm
    filterThang: string = '';
    loaibangluong:string = 'Chọn bảng lương';
    listBangLuong: any[] = [];
    lstItem: any[] = [];
    filterBL: string = '';
    listThangNam: any[] = [];

    list_thongtinnghiphep: any[] = [];
    tangcangaythuong: string = '';
    tangcangayle: string = '';
    tangcangaynghi: string = '';
    TongGioTangCa: string = '';

    songaydilam: string = '';
    songaytrocapcadem: string = '';
    songayle: string = '';
    tongconglam: string = '';

    constructor(
        private xemPhieuLuongService: XemPhieuLuongService,
        private layoutUtilsService: LayoutUtilsService,
        private changeDetectorRefs: ChangeDetectorRef,
        private danhMucChungService: DanhMucChungService,
        private translate: TranslateService,
        public bangCongService: BangCongService,
    ) {

    }
    ngOnInit(): void {
        this.danhMucChungService.GetListThangNam("2").subscribe(res => {
            if (res && res.status === 1) {
                if (res.data.length > 0) {
                    this.listThangNam = res.data;
                    this.filterThang = res.data[0].Thang;
                    this.filterNam = res.data[0].Nam;
                    this.getDSbangLuong();
                    this.loadDataList();
                } else {
                    this.listThangNam = [];
                }
                this.changeDetectorRefs.detectChanges();
            }
        });
        this.getDSbangLuong();
    }

    getDSbangLuong() {
        this.danhMucChungService.getDSBangLuongPhieuLuong(+this.filterNam, +this.filterThang).subscribe((res) => {
            if (res && res.status == 1) {
                this.listBangLuong = res.data;
                if (res.data.length == 1) {
                    this.filterBL = '' + res.data[0].RowID;
                    this.loaibangluong = '' + res.data[0].Title;
                    this.View();
                }else{
                    this.lstItem = [];
                }
            }
            this.changeDetectorRefs.detectChanges();
        });
    }

    View() {
        this.lstItem = [];
        if (this.filterNam != '' || this.filterThang != '') {
            this.xemPhieuLuongService.InPhieuLuong(this.filterThang, this.filterNam, this.filterBL).subscribe((res) => {
                if (res && res.status === 1) {
                    if (res.data != '') {
                        this.lstItem = res.data;
                    } else {
                        var _messageType =
                            this.translate.instant('inphieuluong.bankhongcobangluong') +
                            ' ' +
                            this.translate.instant('JeeHR.thang') +
                            ' ' +
                            this.filterThang +
                            ' ' +
                            this.translate.instant('JeeHR.nam') +
                            ' ' +
                            this.filterNam;
                        this.layoutUtilsService.showActionNotification(_messageType, MessageType.Read, 99999999999999, true, false, 3000, 'top', 0);
                        this.lstItem = [];
                        return;
                    }
                    this.changeDetectorRefs.detectChanges();
                } else {
                    this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                }
            });
        } else {
            let message = this.translate.instant('JeeHR.khongcodulieu');
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        }
    }

    async loadDataList() {
        // Get chu kỳ tính công
        const queryParams = new QueryParamsModel(this.filterConfiguration());
        this.bangCongService.findData(queryParams).subscribe((res) => {
            if (res && res.status == 1) {
                this.list_thongtinnghiphep = res.data_nghiphep;
                this.tangcangaythuong = res.TangCaNgayThuong;
                this.tangcangayle = res.TangCaNgayLe;
                this.tangcangaynghi = res.TangCaNgayNghi;
                this.TongGioTangCa = res.TongGioTangCa;
                this.songaydilam = res.SoNgayDiLam;
                this.songaytrocapcadem = res.SoNgayTroCapCaDem;
                this.songayle = res.SoNgayLe;
                this.tongconglam = res.TongCongLam;
                this.changeDetectorRefs.detectChanges();
            }
        });
    }

    filterConfiguration(): any {
        const filter: any = {};
        filter.Thang = this.filterThang;
        filter.ID_NV = 0;
        filter.Nam = this.filterNam;
        return filter;
    }

    getHeight(): any {
        let tmp_height = window.innerHeight - 155;
        return tmp_height + "px";
    }

    LoadBangLuong(val){
        this.filterBL = val.RowID;
        this.loaibangluong = val.Title;
        this.View();
    }

    ThangNamChange(val){
        this.filterThang = val.Thang;
        this.filterNam = val.Nam;
        this.loaibangluong = "Chọn bảng lương";
        this.filterBL = "";
        this.getDSbangLuong();
        this.loadDataList();
    }
}