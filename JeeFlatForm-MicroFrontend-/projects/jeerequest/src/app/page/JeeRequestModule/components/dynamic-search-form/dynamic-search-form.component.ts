import { Component, OnInit, Input, ChangeDetectionStrategy, HostListener, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { DynamicSearchFormService } from './dynamic-search-form.service';
import { Observable, fromEvent, of, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged, tap, debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Moment } from 'moment';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { YeuCauService } from "../../_services/yeu-cau.services";
import { LayoutUtilsService, MessageType } from 'projects/jeerequest/src/modules/crud/utils/layout-utils.service';
import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';

@Component({
    selector: 'm-dynamic-search-form',
    templateUrl: './dynamic-search-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
// #region Quy định type:
// 0: input text
// 1: select
// 2: m-dropdown-tree-new
// 3: checkbox
// 4: datetime đơn
// 5: Khoảng thời gian
// Đối với loại 1,2 cần truyền api để tải dữ liệu xổ xuống
// #endregion
export class DynamicSearchFormComponent implements OnInit {

    constructor(public dynamicSearchFormService: DynamicSearchFormService,
        private fb: FormBuilder,
        private datePipe: DatePipe,
        private layoutUtilsService: LayoutUtilsService,
        private translate: TranslateService,
        private changeDetectorRefs: ChangeDetectorRef,private YeuCauService: YeuCauService,) { }

    formSearch: FormGroup;
    @ViewChild('searchbox', { static: true }) searchbox: ElementRef;
    @ViewChild('searchForm', { static: true }) searchForm: ElementRef;
    @ViewChild('container', { static: true }) container: ElementRef;
    showSearch: boolean = false;
    @Input() isNV: boolean = false;
    controls: any[] = [];
    @ViewChild('searchTuNgay', { static: true }) searchTuNgay: ElementRef;
    @ViewChild('searchDenNgay', { static: true }) searchDenNgay: ElementRef;
    ID_Struct: string = '';

    listLoaiYeuCau: any[] = [];
    d_minDate: any;
    d_maxDate: any;
    selectedNode: BehaviorSubject<any> = new BehaviorSubject([]);
    listData: any[] = [];
    tmp_thang: string = '';
    tmp_nam: string = '';
    search: string = '';
    clickSelection: boolean = false;
    listChucDanh: any[] = [];
    listChucVu: any[] = [];
    listPhongBan:  any[] = [];
    ngOnInit(): void {
        this.controls = this.dynamicSearchFormService.controls$.getValue();
        for (var i = 0; i < this.controls.length; i++) {
            //============Thiên===================
            if (this.controls[i].search) {
                let idx = i;
                this.dynamicSearchFormService.getInitDataSearch(this.controls[i].api).then((res:any) => {
                    if (this.controls[idx].type == 2) { //type: drop-down tree
                        this.controls[idx].init = new BehaviorSubject([]);
                        this.controls[idx].init.next(res.data);
                        this.selectedNode.next({
                            RowID: "" + res.data[0].RowID
                        });
                    }
                    else {
                        this.controls[idx].init = res.data;
                    }
                });
            } else {
                if (this.controls[i].api) {
                    let idx = i;
                    this.dynamicSearchFormService.getInitData(this.controls[i].api).subscribe(res => {
                        if (this.controls[idx].type == 2) { //type: drop-down tree
                            this.controls[idx].init = new BehaviorSubject([]);
                            this.controls[idx].init.next(res.data);
                            this.selectedNode.next({
                                RowID: "" + res.data[0].RowID
                            });
                        }
                        else {
                            this.controls[idx].init = res.data;
                        }
                    });
                }
            }
            const queryParams = new QueryParamsModelNew(
                this.filterConfiguration(),
            );
            this.YeuCauService.getDSLoaiYeuCau(queryParams).subscribe((res) => {
                if (res && res.status === 1) {

                    this.listLoaiYeuCau = res.data;
                    this.changeDetectorRefs.detectChanges();
                } else {
                    this.listLoaiYeuCau = [];
                }
            });

            this.dynamicSearchFormService.GetDSChucDanh().subscribe((res) => {
                if (res) {
                    this.listChucDanh = res.data;
                    this.changeDetectorRefs.detectChanges();
                } else {
                    this.listChucDanh = [];
                }
            });

            this.dynamicSearchFormService.GetDSPhongBan().subscribe((res) => {
                if (res) {
                    this.listPhongBan = res.data.flat;
                    this.changeDetectorRefs.detectChanges();
                } else {
                    this.listPhongBan = [];
                }
            });
        }
        this.createForm();
        fromEvent(this.searchbox.nativeElement, 'keyup')
            .pipe(
                debounceTime(150),
                distinctUntilChanged(),
                tap(() => {
                    let kw = this.searchbox.nativeElement.value;
                    if (this.dynamicSearchFormService.searchbox && this.formSearch.controls[this.dynamicSearchFormService.searchbox])
                        this.formSearch.controls[this.dynamicSearchFormService.searchbox].setValue(kw);
                })
            )
            .subscribe();
        document.querySelector('body').appendChild(this.container.nativeElement);
    }
    ngOnDestroy() {
        document.querySelector('body').removeChild(this.container.nativeElement);
    }
    createForm() {
        let item = {};
        for (var i = 0; i < this.controls.length; i++) {
            let control = this.controls[i];
            if (control.type != 5 && control.type != 8 && control.type != 11 && control.type != 12) {
                if (control.type == 3) {
                    item[control.name] = [false];
                } else if (control.type == 6) {
                    item[control.name] = ['' + control.default];
                } else if (control.type == 4) {
                    item[control.name] = [control.default];
                } else if (control.type == -1 || control.type == 10) {
                    item[control.name] = [control.default];
                } else {
                    item[control.name] = [''];
                }
            } else {
                if (control.type == 5) {
                    item[control.from.name] = [control.from.default];
                    item[control.to.name] = [control.to.default];
                    control.from.max = null;
                    control.to.min = null;
                } else if (control.type == 12) {
                    item[control.fromthang.name] = [control.fromthang.default];
                    item[control.tothang.name] = [control.tothang.default];
                    item[control.fromnam.name] = [control.fromnam.default];
                    item[control.tonam.name] = [control.tonam.default];
                }
                else {
                    item[control.from.name] = [''];
                    item[control.to.name] = [''];
                    // this.loadThoiGian();
                }
            }
        }
        this.formSearch = this.fb.group(item);
    }

    //Xử lý nút X để xóa form + textbox search
    clearSearch() {
        this.showSearch = false;
        this.ngOnInit();
        this.searchbox.nativeElement.value = '';
        this.dynamicSearchFormService.setFilter({}, this.isNV);
    }

    //Xử lý hiển thị form search
    showFormSearch() {
        // this.loadThoiGian();
        this.showSearch = !this.showSearch;
        let temp = this.searchbox.nativeElement.getBoundingClientRect();
        this.searchForm.nativeElement.style.top = temp.bottom + 'px';
        this.searchForm.nativeElement.style.left = temp.left + 'px';
        this.searchForm.nativeElement.style.width = (Number(temp.width)+ 230) + 'px';
    }

    //XỬ LÝ DỮ LIỆU TRÊN FROM TRẢ VỀ
    submit() {
        let isFlag = true;
        let str = '';
        const controls = this.formSearch.controls;
        const item = {};
        for (var i = 0; i < this.controls.length; i++) {
            //-- Dùng cho datetime picker to-from
            if (this.controls[i].type == 5 || this.controls[i].type == 8) {
                let from = this.controls[i].from.name;
                if (controls[from].value) {
                    if (str != '')
                        str += ';';
                    let d1 = moment(controls[from].value).format('DD/MM/YYYY');
                    item[from] = d1;
                    str += from + ':' + d1;
                }
                let to = this.controls[i].to.name;
                if (controls[to].value) {
                    if (str != '')
                        str += ';';
                    let d2 = moment(controls[to].value).format('DD/MM/YYYY');
                    item[to] = d2;
                    str += to + ':' + d2
                } else {
                    if (this.controls[i].to.required) {
                        const _messageType = this.translate.instant('JeeHR.denngaykhonghople');
                        this.layoutUtilsService.showActionNotification(_messageType, MessageType.Read, 999999999, true, false, 0, 'top', 0);
                        isFlag = false;
                        return;
                    }
                }
            }
            //-- Dùng cho form quan hệ nhân thân
            // BEGIN
            else if (this.controls[i].type == 11) {
                let from = this.controls[i].from.name;
                if (controls[from].value) {
                    if (str != '')
                        str += ';';
                    item[from] = controls[from].value
                    str += from + ':' + controls[from].value;
                } else {
                    item[from] = "";
                    str += from + ':' + "";
                }
                let to = this.controls[i].to.name;
                if (controls[to].value) {
                    if (str != '')
                        str += ';';
                    item[to] = controls[to].value;
                    str += to + ':' + controls[to].value;
                } else {
                    item[to] = "";
                    str += to + ':' + "";
                }
            }
            // END
            //-- Dùng cho khoảng thời gian thang năm
            // BEGIN
            else if (this.controls[i].type == 12) {
                let from = this.controls[i].fromnam.name;
                if (controls[from].value) {
                    if (str != '')
                        str += ';';
                    item[from] = controls[from].value
                    str += from + ':' + controls[from].value;
                } else {
                    const _messageType = this.translate.instant('JeeHR.tunamkhonghople');
                    this.layoutUtilsService.showActionNotification(_messageType, MessageType.Read, 999999999, true, false, 0, 'top', 0);
                    isFlag = false;
                    return;
                }
                let fromthang = this.controls[i].fromthang.name;
                if (controls[fromthang].value) {
                    if (str != '')
                        str += ';';
                    item[fromthang] = controls[fromthang].value
                    str += fromthang + ':' + controls[fromthang].value;
                } else {

                }
                let to = this.controls[i].tonam.name;
                if (controls[to].value) {
                    if (str != '')
                        str += ';';
                    item[to] = controls[to].value;
                    str += to + ':' + controls[to].value;
                } else {
                    const _messageType = this.translate.instant('JeeHR.dennamkhonghople');
                    this.layoutUtilsService.showActionNotification(_messageType, MessageType.Read, 999999999, true, false, 0, 'top', 0);
                    isFlag = false;
                    return;
                }
                let tothang = this.controls[i].tothang.name;
                if (controls[tothang].value) {
                    if (str != '')
                        str += ';';
                    item[tothang] = controls[tothang].value
                    str += tothang + ':' + controls[tothang].value;
                } else {

                }
            }
            // END
            else {
                let name = this.controls[i].name;
                if (controls[name].value || this.controls[i].type == 3) {
                    if (str != '')
                        str += ';';
                    if (this.controls[i].type == 4) {
                        let d = moment(controls[name].value).format('DD/MM/YYYY');
                        item[name] = d;
                        str += name + ':' + d
                    } else {
                        item[name] = controls[name].value;
                        str += name + ':' + controls[name].value
                    }
                } else {
                    if (this.controls[i].required) {
                        const _messageType = this.translate.instant('Đến ngày không hợp lệ');
                        this.layoutUtilsService.showActionNotification(_messageType, MessageType.Read, 999999999, true, false, 0, 'top', 0);
                        isFlag = false;
                        return;
                    }
                    if (this.controls[i].type == 6) {
                        if (str != '')
                            str += ';';
                        item[name] = controls[name].value;
                        str += name + ':' + "";
                    }
                }
            }
        }

        if (isFlag) {
            this.dynamicSearchFormService.setFilter(item, this.isNV);
            this.showSearch = false;
            // this.searchbox.nativeElement.value = str;
            this.dynamicSearchFormService.search_data$.next(str);
        }

    }

    // Bắt sự kiện khi CLICK NGOÀI form search thì sẽ ĐÓNG FORM
    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (event.target.id == 'id-form-filter-container')
            this.showSearch = false;
    }

    //Bắt sự kiện enter trên text box để trả về
    onKeydownHandler() {
        this.createForm();
        this.selectedNode.next({
            RowID: "",
            Title: "",
        });
        let kw = this.searchbox.nativeElement.value;
        this.dynamicSearchFormService.search_data$.next(kw);
        const filter: any = {};
        filter[this.dynamicSearchFormService.searchbox] = kw;
        this.dynamicSearchFormService.setFilter(filter, this.isNV);
    }

    @HostListener('document:keydown', ['$event'])
    onKeydownHandler1(event: KeyboardEvent) {
        if (this.showSearch) {
            if (event.keyCode == 13)    //phím Enter
            {
                this.submit();
            }
        }
    }

    // Đến ngày luôn lấy min là từ ngày
    DateChangeMin(val: any, index) {
        if (val.value != null && val.value != "") {
            let mindate = val.value.toDate();
            this.controls[index].to.min = mindate;
        } else {
            this.controls[index].to.min = null
        }
    }

    // Từ ngày luôn lấy max là đến ngày
    DateChangemMax(val: any, index) {
        if (val.value != null && val.value != "") {
            let maxdate_cur = val.value.toDate();
            this.controls[index].from.max = maxdate_cur;
        } else {
            this.controls[index].from.max = null
        }
    }

    getFirstDay_LastDay(b_firstday) {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1);       // ngày đầu tháng
        var lastDay = new Date(y, m + 1, 0);    // ngày cuối tháng
        var curent = new Date();                // ngày hiện tại
        return b_firstday ? this.datePipe.transform(firstDay, 'dd/MM/yyyy') : this.datePipe.transform(lastDay, 'dd/MM/yyyy');
    }

    GetValueNode(val: any) {
        // this.ID_Struct = val.RowID;
        // for (var i = 0; i < this.controls.length; i++) {
        //     let control = this.controls[i];
        //     if (control.type == 7) {
        //         this.danhMucService.GetListPositionbyStructure_All(this.ID_Struct).subscribe(res => {
        //             this.listChucDanh = res.data;
        //             this.formSearch.controls[control.name].setValue("");
        //             this.changeDetectorRefs.detectChanges();
        //         });
        //     }
        //     if (control.type == 13) {
        //         this.danhMucService.GetListJobtitleByStructure_All("", this.ID_Struct).subscribe(res => {
        //             this.listChucVu = res.data;
        //             this.formSearch.controls[control.name].setValue("");
        //             this.changeDetectorRefs.detectChanges();
        //         });
        //     }
        // }
    }

    loadThoiGian() {
        // this.danhMucService.Get_ThoiGianCKTinhCong().subscribe(res => {
        //     let fromDate, toDate;
        //     for (var i = 0; i < this.controls.length; i++) {
        //         let control = this.controls[i];
        //         if (control.type == 8) {
        //             /* From */
        //             fromDate = (control.from.input != null && control.from.input != undefined) ? control.from.input : this.f_convertDate(res.TuNgay);
        //             this.formSearch.controls[control.from.name].setValue(fromDate);
        //             /* To */
        //             toDate = (control.to.input != null && control.to.input != undefined) ? control.to.input : this.f_convertDate(res.DenNgay);
        //             this.formSearch.controls[control.to.name].setValue(toDate);
        //             /* Min Max */
        //             this.d_minDate = new Date((control.to.min != null && control.to.min != undefined) ? control.to.min : this.f_convertDate(res.TuNgay));
        //             this.d_maxDate = new Date((control.from.max != null && control.from.max != undefined) ? control.from.max : this.f_convertDate(res.DenNgay));
        //             this.changeDetectorRefs.detectChanges();
        //         }
        //     }
        // });
    }

    //============================================================================
    DateChangeMinCK(val: any) {
        this.d_minDate = val.value;
    }

    DateChangeMaxCK(val: any) {
        this.d_maxDate = val.value;
    }

    f_convertDate(v: any) {
        if (v != "" && v != undefined) {
            let a = new Date(v);
            return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
        }
    }
    ChangeChucDanh(event: any, index) {
        this.controls[index].value = "," + event.value;
    }
    textNam(e: any) {
        if (!((e.keyCode > 95 && e.keyCode < 106)
            || (e.keyCode > 47 && e.keyCode < 58)
            || e.keyCode == 8)) {
            e.preventDefault();
        }
    }

    filterConfiguration(): any {
		const filter: any = {};
		filter.status = 2;
		return filter;
	}
}
