import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { fromEvent, merge, BehaviorSubject, Subscription } from 'rxjs';
// RXJS
// Services

// Models
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatDatepicker } from '@angular/material/datepicker';
import { BangCongService } from '../Services/bang-cong.service';
import { GhiChuBCCComponent } from '../ghi-chu-bcc/ghi-chu-bcc.component';
import { MatDialog } from '@angular/material/dialog';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { DanhMucChungService } from '../../../services/danhmuc.service';
import { LayoutUtilsService, MessageType } from 'projects/jeehr/src/modules/crud/utils/layout-utils.service';
import { BangCongModel } from '../Model/bang-cong.model';
import { BangCongDataSource } from '../Model/data-sources/bang-cong.datasource';


@Component({
    selector: 'm-bang-cong-list',
    templateUrl: './bang-cong-list.component.html',
    styleUrls: ["./bang-cong-list.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BangCongListComponent implements OnInit {
    // Table fields
    dataSource: any;
    displayedColumnsComment = ['STT', 'Noidung', 'SendDate', 'Processeddate', 'Note_admin', 'IsProcessed'];
    displayedColumns: any[] = [];
    columnsToDisplay: any[] = [];

    // Filter fields
    filterThang: string = '';
    filterYear: string = ''; //cho dropdown năm
    view: any[] = [];
    list_thongtinnghiphep: any[] = [];

    //Form
    itemForm: FormGroup;
    loadingSubject = new BehaviorSubject<boolean>(false);
    loadingControl = new BehaviorSubject<boolean>(false);
    loading1$ = this.loadingSubject.asObservable();
    hasFormErrors: boolean = false;
    item: any;
    oldItem: any;

    selectedTab: number = 0;
    // Selection
    selection = new SelectionModel<any>(true, []);
    BangCongResult: any[] = [];
    p: string = '1';
    @ViewChild('TABLE') table: ElementRef;
    viewLoading: boolean = false;
    loadingAfterSubmit: boolean = false;

    public data: any = [];
    public dataNgayCongThuong: any = [];
    tangcangaythuong: string = '';
    tangcangayle: string = '';
    tangcangaynghi: string = '';
    TongGioTangCa: string = '';
    ThoiGian: string = '';
    listNam: any[] = [];
    songaydilam: string = '';
    songaytrocapcadem: string = '';
    songayle: string = '';
    tongconglam: string = '';
    ID_comment: string = '';
    listcomments: any[] = [];
    public showButton: boolean = true;
    disableBt: boolean = true;
    showconfirm: boolean = true;
    iscomment: boolean = true;
    tinhtrangxacnhan: string = '';
    loadingDone: number = 0;
    disabledBtn: boolean = false;
    dataSourceComments = new MatTableDataSource(this.listcomments);
    dialogRef: any;

    listThangNam: any[] = [];

    constructor(
        public bangCongService: BangCongService,
        private danhMucChungService: DanhMucChungService,
        public dialog: MatDialog,
        public datePipe: DatePipe,
        private changeDetectorRefs: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private translate: TranslateService,
    ) { }
    daTV: boolean = false;
    /** LOAD DATA */
    ngOnInit() {
        this.loadingSubject.next(true);
        const newBangCong = new BangCongModel();
        newBangCong.clear();

        this.dataSource = new BangCongDataSource(this.bangCongService);
        this.dataSource.entitySubject.subscribe((res) => (this.BangCongResult = res));

        this.danhMucChungService.GetListThangNam("1").subscribe(res => {
            if (res && res.status === 1) {
                if (res.data.length > 0) {
                    this.listThangNam = res.data;
                    this.filterThang = '' + res.thangbcc;
                    this.filterYear = '' + res.nambcc;
                    this.loadDataList();
                } else {
                    this.listThangNam = [];
                }
                this.changeDetectorRefs.detectChanges();
            }
        });
    }
    async loadDataList() {
        const queryParams = new QueryParamsModel(this.filterConfiguration());
        this.bangCongService.findData(queryParams).subscribe((res) => {
            if (res && res.status == 1) {
                this.data = res.data;
                this.buildDisplayedColumns();
                this.item = res;
                this.list_thongtinnghiphep = res.data_nghiphep;
                this.tangcangaythuong = res.TangCaNgayThuong;
                this.tangcangayle = res.TangCaNgayLe;
                this.tangcangaynghi = res.TangCaNgayNghi;
                this.TongGioTangCa = res.TongGioTangCa;
                this.songaydilam = res.SoNgayDiLam;
                this.songaytrocapcadem = res.SoNgayTroCapCaDem;
                this.songayle = res.SoNgayLe;
                this.tongconglam = res.TongCongLam;
                this.ID_comment = res.ID;
                this.listcomments = res.data_ghichu;

                if (res.IsConfirm) {
                    this.tinhtrangxacnhan = this.translate.instant('BangCong.bangchamcongdaduocxacnhan');
                    this.disableBt = true;
                    this.showconfirm = false;
                } else {
                    this.tinhtrangxacnhan = '';
                    this.showButton = true;
                    this.disableBt = false;
                    this.showconfirm = true;
                }
                if (res.data == '') {
                    this.tinhtrangxacnhan = res.error.message;
                }
                if (res.data_ghichu.length > 0) {
                    if (res.data_ghichu[0].IsProcessed) this.iscomment = true;
                    else this.iscomment = false;
                }

                this.changeDetectorRefs.detectChanges();
            }
        });
    }

    filterConfiguration(): any {
        const filter: any = {};
        filter.Thang = this.filterThang;
        filter.ID_NV = 0;
        filter.Nam = this.filterYear;
        if (this.filterYear == null || this.filterYear == '') {
            const _messageType = this.translate.instant('BangCong.namkhonghople');
            this.layoutUtilsService.showActionNotification(_messageType, MessageType.Read, 9999999999, true, false, 0, 'top', 0);
            return null;
        }
        return filter;
    }
    
    ThemGhiChu(_item: BangCongModel) {
        _item.ID = 0;
        _item.Noidung = '';
        _item.thang = this.filterThang;
        _item.nam = this.filterYear;
        let _saveMessage = this.translate.instant('JeeHR.capnhatthanhcong');
        const dialogRef = this.dialog.open(GhiChuBCCComponent, { data: { _item }, panelClass: ['sky-padding-0', 'width600'], });
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            } else {
                this.layoutUtilsService.showActionNotification(_saveMessage, MessageType.Update, 4000, true, false);
                this.loadDataList();
            }
        });
    }
    CapNhatGhiChu(_item: BangCongModel) {
        let _saveMessage = this.translate.instant('JeeHR.capnhatthanhcong');
        const dialogRef = this.dialog.open(GhiChuBCCComponent, { data: { _item }, panelClass: ['sky-padding-0', 'width600'], });
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            } else {
                this.layoutUtilsService.showActionNotification(_saveMessage, MessageType.Update, 4000, true, false);
                this.loadDataList();
            }
        });
    }
    prepareComments(): BangCongModel {
        const controls = this.itemForm.controls;
        const _item = new BangCongModel();
        _item.Comment = controls['Comment'].value; // lấy tên biến trong formControlName
        _item.thang = this.filterThang;
        _item.nam = this.filterYear;
        return _item;
    }
    ConfirmTimesheets() {
        const _title = this.translate.instant('timesheets.xacnhanbangchamcong');
        const _description = this.translate.instant('timesheets.notifyconfirm');
        const _waitDesciption = this.translate.instant('timesheets.dangxacnhan');
        const _deleteMessage = this.translate.instant('timesheets.xacnhanthanhcong');

        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            }

            this.disabledBtn = true;
            this.bangCongService.ConfirmTimesheet(this.filterThang, this.filterYear).subscribe((res) => {
                this.disabledBtn = false;
                this.changeDetectorRefs.detectChanges();
                if (res && res.status === 1) {
                    this.disableBt = true;
                    this.showconfirm = false;
                    this.changeDetectorRefs.detectChanges();
                } else {
                    this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                    this.changeDetectorRefs.detectChanges();
                }
                this.loadDataList();
            });
        });
    }
    /** ACTIONS */

    buildDisplayedColumns() {
        this.displayedColumns = [];
        this.columnsToDisplay = [];
        let _data = this.data[0];
        if (_data == undefined) {
            // const _messageType = this.translate.instant('BangCong.bankhongcobangchamcong') + ' ' + this.translate.instant('JeeHR.thang') + ' ' + this.filterThang + ' ' + this.translate.instant('JeeHR.nam') + ' ' + this.filterYear;
            // this.layoutUtilsService.showActionNotification(_messageType, MessageType.Read, 9999999999999, true, false, 0, 'top', 0);
            return null;
        }
        Object.keys(_data).forEach((result) => {
            this.displayedColumns.push(result);
            this.columnsToDisplay.push(result);
        });
        this.changeDetectorRefs.detectChanges();
    }

    BindTooltipDataTimesheets(element: any) {
        try {
            return element[0]['ToolTip'];
        } catch (error) {
            return 'Không có dữ liệu';
        }
    }

    buildStyleBold(column: any) {
        return column && column.Style == '' ? '' : column.Style;
    }

    f_number(value: any) {
        return Number((value + '').replace(/,/g, ''));
    }

    f_currency(value: any, args?: any): any {
        let nbr = Number((value + '').replace(/,|-/g, ''));
        return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    }
    textPres(e: any, vi: any) {
        if (
            isNaN(e.key) &&
            //&& e.keyCode != 8 // backspace
            //&& e.keyCode != 46 // delete
            e.keyCode != 32 && // space
            e.keyCode != 189 &&
            e.keyCode != 45
        ) {
            // -
            e.preventDefault();
        }
    }
    text(e: any, vi: any) {
        if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 45 && e.keyCode < 58) || e.keyCode == 8)) {
            e.preventDefault();
        }
    }
    textNam(e: any) {
        if (!((e.keyCode > 95 && e.keyCode < 106) || (e.keyCode > 47 && e.keyCode < 58) || e.keyCode == 8)) {
            e.preventDefault();
        }
    }

    f_date_comments(value: any, args?: any): any {
        let latest_date = this.datePipe.transform(value, 'dd/MM/yyyy HH:mm');
        return latest_date;
    }
    getTieuDeButton() {
        let name = '';
        name = this.translate.instant('BangCong.guicomment');
        return name;
    }
    getItemStatusString(status: boolean): string {
        switch (status) {
            case false:
                return 'Chưa xử lý';
            case true:
                return 'Đã xử lý';
        }
    }
    //===============================Comment=====================
    @ViewChild('focusInput') focusInput: ElementRef;
    ChinhSua(comment) {
        comment.Edit = !comment.Edit;
        this.changeDetectorRefs.detectChanges();
        if (comment.Edit) {
            document.getElementById('comment').focus();
        }
    }

    onKeydownHandlerEdit(comment) {
        const wh = new BangCongModel();
        wh.thang = comment.Thang;
        wh.nam = comment.Nam;
        wh.ID = comment.ID;
        wh.Comment = comment.Noidung;
        this.Create(wh);
    }

    Create(_item: any) {
        this.bangCongService.SendComment(_item).subscribe((res) => {
            this.changeDetectorRefs.detectChanges();
            if (res && res.status === 1) {
                this.comment = '';
                this.loadDataList();
            } else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    comment: string = '';
    onKeydownHandler() {
        if (this.comment == '' || this.comment == null) {
            return;
        } else {
            const wh = new BangCongModel();
            wh.thang = this.filterThang;
            wh.nam = this.filterYear;
            wh.Comment = this.comment;
            this.Create(wh);
        }
    }
    //=========================Câp nhật tháng năm=============================
    year = new FormControl();
    @ViewChild(MatDatepicker) picker: any;
    monthSelected(params: any) {
        this.year.setValue(params);
        this.picker.close();
        let Thang = params.getMonth() + 1;
        let Nam = params.getFullYear();
        this.filterThang = Thang;
        this.filterYear = Nam;
        this.loadDataList();
    }

    getColorNameUser(value: any) {
        let result = "";
        switch (value) {
            case "A":
                return result = "rgb(51 152 219)";
            case "Ă":
                return result = "rgb(241, 196, 15)";
            case "Â":
                return result = "rgb(142, 68, 173)";
            case "B":
                return result = "#0cb929";
            case "C":
                return result = "rgb(91, 101, 243)";
            case "D":
                return result = "rgb(44, 62, 80)";
            case "Đ":
                return result = "rgb(127, 140, 141)";
            case "E":
                return result = "rgb(26, 188, 156)";
            case "Ê":
                return result = "rgb(51 152 219)";
            case "G":
                return result = "rgb(241, 196, 15)";
            case "H":
                return result = "rgb(248, 48, 109)";
            case "I":
                return result = "rgb(142, 68, 173)";
            case "K":
                return result = "#2209b7";
            case "L":
                return result = "rgb(44, 62, 80)";
            case "M":
                return result = "rgb(127, 140, 141)";
            case "N":
                return result = "rgb(197, 90, 240)";
            case "O":
                return result = "rgb(51 152 219)";
            case "Ô":
                return result = "rgb(241, 196, 15)";
            case "Ơ":
                return result = "rgb(142, 68, 173)";
            case "P":
                return result = "#02c7ad";
            case "Q":
                return result = "rgb(211, 84, 0)";
            case "R":
                return result = "rgb(44, 62, 80)";
            case "S":
                return result = "rgb(127, 140, 141)";
            case "T":
                return result = "#bd3d0a";
            case "U":
                return result = "rgb(51 152 219)";
            case "Ư":
                return result = "rgb(241, 196, 15)";
            case "V":
                return result = "#759e13";
            case "X":
                return result = "rgb(142, 68, 173)";
            case "W":
                return result = "rgb(211, 84, 0)";
        }
        return result;
    }

    ThangNamChange(val) {
        this.filterThang = val.Thang;
        this.filterYear = val.Nam;
        this.loadDataList();
    }

    getHeight(): any {
        let tmp_height = window.innerHeight - 190;
        return tmp_height + "px";
    }
}
