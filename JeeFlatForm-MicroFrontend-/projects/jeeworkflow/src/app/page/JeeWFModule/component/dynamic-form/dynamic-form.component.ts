import { Component, OnInit, Input, ChangeDetectionStrategy, HostListener, ElementRef, ChangeDetectorRef, ViewChild, ViewContainerRef, SimpleChange, Output, EventEmitter } from '@angular/core';
import { DynamicFormService } from './dynamic-form.service';
import { Observable, fromEvent, of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { distinctUntilChanged, tap, debounceTime } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Moment } from 'moment';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { ChuyenGiaiDoanData } from './dynamic-form.model';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { tinyMCE } from '../tinyMCE/tinyMCE';
import { JeeChooseMemberComponent } from '../jee-choose-member/jee-choose-member.component';
import { LayoutUtilsService, MessageType } from 'projects/jeeworkflow/src/modules/crud/utils/layout-utils.service';
import { ProcessWorkService } from '../../../services/process-work.service';
import { DanhMucChungService } from '../../../services/danhmuc.service';
//#region Type Control DymaForm Thiên:
//0: 
//1: TextBox (Input)
//2: TextBox (Input_Number)
//3: DateTime
//4: Textarea
//5: Select
//6: Multiselect
//7: boolean
//8: Checkbox
//9: Radio Button
//10: Image
//11: Dropdowntree
//12: Multipleimage
//13: File
//14: Multiplefile
//15: Editor
//16: Editor
//Đối với loại 5,6 cần truyền api để tải dữ liệu xổ xuống
//Đối với loại 16 cần truyền api để tải dữ cột hiển thị
//#endregion


//Xem thông tin
@Component({
    selector: 'm-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})


//TypeID 0: Tạo công viêc - 2: Chỉ xem
//implements OnInit
export class DynamicFormComponent implements OnInit {
    constructor(public dynamicFormService: DynamicFormService,
        private fb: FormBuilder,
        private datePipe: DatePipe,
        private translate: TranslateService,
        private changeDetectorRefs: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        public processWorkService: ProcessWorkService,) { }

    formControls: FormGroup; 1
    controls: any[] = [];
    ID_Struct: string = '';
    listChucDanh: any[] = [];
    listChucVu: any[] = [];
    d_minDate: any;
    d_maxDate: any;
    selectedNode: BehaviorSubject<any> = new BehaviorSubject([]);
    listData: any[] = [];
    tmp_thang: string = '';
    tmp_nam: string = '';
    search: string = '';

    listControls: any[] = [];
    @Input() ID: any;
    @Input() TypeID: any;
    @Input() ViewData: any; //Dùng cho xem chi tiết dữ liệu
    @Input() IsEditStatus: boolean = true; // Dùng để ân/hiện button lưu theo quyền
    tinyMCE: any = {};
    @Output() Close = new EventEmitter();
    ProcessID: number;
    listProcess: any[] = [];
    listNguoiThucHien: any[] = [];
    disabledBtn: boolean;
    //====================Người theo dõi===================
    listNguoiTheoDoi: any[] = [];
    public bankFilterCtrlNTD: FormControl = new FormControl();
    public filteredBanksNTD: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    showLuu: boolean = false;
    //=================Bổ sung control bảng================
    listTables: any[] = [];
    ngOnChanges(changes: SimpleChange) {
        if (changes['ID']) {
            this.LoadForm();
        }
    }

    ngOnInit(): void {
        this.tinyMCE = Object.assign({}, tinyMCE);
        if (this.TypeID == 2) {
            this.viewForm();
        }
    }

    viewForm() {
        let count_Luu = 0;
        this.controls = this.ViewData;
        for (var i = 0; i < this.controls.length; i++) {
            if (this.controls[i].IsFieldNode) {
                count_Luu++;
            }
            let index = i;
            if (this.controls[i].APIData) {
                if (this.controls[index].ControlID == 5 || this.controls[index].ControlID == 6 || this.controls[index].ControlID == 9 || this.controls[index].ControlID == 11 || this.controls[index].ControlID == 16) {
                    let LinkAPI = "";
                    if (this.controls[index].DependID == null && !this.controls[index].IsDepend) {
                        LinkAPI = this.controls[index].APIData + this.controls[index].FieldID;
                    } else {
                        LinkAPI = this.controls[index].APIData;
                    }
                    if (this.controls[index].ControlID == 5 || this.controls[index].ControlID == 6 || this.controls[index].ControlID == 9) {
                        this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
                            if (res.data.length > 0) {
                                this.controls[index].init = res.data;
                            } else {
                                this.controls[index].init = [];
                            }
                            this.changeDetectorRefs.detectChanges();
                        });
                    } else if (this.controls[index].ControlID == 16) {
                        this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
                            if (res.data.length > 0) {
                                this.controls[index].init = res.data;
                            }
                            this.changeDetectorRefs.detectChanges();
                        });
                    } else {
                        this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
                            this.controls[index].init = new BehaviorSubject([]);
                            if (res.data.length > 0) {
                                this.controls[index].init.next(res.data);
                            } else {
                                this.controls[index].init.next([]);
                            }
                        });
                    }
                }
            }
        }
        if (count_Luu > 0) {
            this.showLuu = true;
            this.createViewForm();
        } else {
            this.showLuu = false;
            // this.goBack();
        }
    }


    reset() {
        let item = {};
        this.formControls = this.fb.group(item);
        if (this.TypeID == 0) {
            this.formControls.addControl('quyTrinh', new FormControl('', [Validators.required]));
            this.formControls.addControl('tenCongViec', new FormControl('', [Validators.required]));
            this.formControls.addControl('nguoiThucHien', new FormControl(''));
            this.formControls.addControl('file', new FormControl(''));
            this.formControls.addControl('noiDung', new FormControl(''));
            this.formControls.addControl('nguoiTheoDoi', new FormControl(''));

            this.formControls.controls['tenCongViec'].markAsTouched();
            this.formControls.controls['quyTrinh'].markAsTouched();
        }
    }

    createViewForm() {
        let item = {};
        this.formControls = this.fb.group(item);
        for (var i = 0; i < this.controls.length; i++) {
            let control = this.controls[i];
            if (control.ControlID == 6) {
                this.formControls.addControl(control.RowID, new FormControl(control.Value ? control.Value : ''));
            } else if (control.ControlID == 7 || control.ControlID == 8) {
                this.formControls.addControl(control.RowID, new FormControl(control.Value == "True" ? true : false));
            } else if (control.ControlID == 10 || control.ControlID == 12 || control.ControlID == 13 || control.ControlID == 14) {
                this.formControls.addControl(control.RowID, new FormControl(control.Files.length > 0 ? control.Files : []));
            } else if (control.ControlID == 16) {
                if (control.Value[0] != '' && control.Value[0] != null) {
                    let data = JSON.parse(control.Value[0]);
                    Object.keys(data).map((index) => {
                        control.dataTable.push(data[index]);
                    })
                } else {
                    control.dataTable = []
                }
            } else {
                this.formControls.addControl(control.RowID, new FormControl(control.Value ? '' + control.Value : ''));
            }
            if (control.Required) {
                if (control.ControlID != 15 && control.ControlID != 16) {
                    this.formControls.controls['' + control.RowID].markAsTouched();
                }
            }
        }
    }



    //====================================Xử lý sự kiện change=========================
    GetValueNode(val: any, item: any) {
        let StructID = val.RowID;
        let obj = this.controls.find(x => x.RowID === item.DependID);
        let index = this.controls.findIndex(x => x.RowID === item.DependID);
        let LinkAPI = obj.APIData + StructID;
        this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
            if (res.data.length > 0) {
                this.controls[index].init = res.data;
            } else {
                this.controls[index].init = [];
            }
        });
    }

    //===========================================================================================

    submit() {
        const controls = this.formControls.controls;
        if (this.formControls.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            return;
        }

        const updatedegree = this.prepareCustomer();
        this.Create(updatedegree);
    }

    prepareCustomer(): any {
        const controls = this.formControls.controls;
        //=========Xử lý cho phần form động=====================
        let Data_Field = [];
        if (this.controls.length > 0) {
            for (var i = 0; i < this.controls.length; i++) {
                let _field = {}
                if (this.controls[i].ControlID == 10 || this.controls[i].ControlID == 12 || this.controls[i].ControlID == 13 || this.controls[i].ControlID == 14) {
                    if (controls[this.controls[i].RowID].value.length > 0) {
                        let Files = [];
                        for (var j = 0; j < controls[this.controls[i].RowID].value.length; j++) {
                            if (!controls[this.controls[i].RowID].value[j].IsDel) {
                                Files.push(controls[this.controls[i].RowID].value[j]);
                            }
                        }
                        _field = {
                            RowID: this.controls[i].RowID,
                            ControlID: this.controls[i].ControlID,
                            Value: Files,
                        }
                    } else {
                        _field = {
                            RowID: this.controls[i].RowID,
                            ControlID: this.controls[i].ControlID,
                            Value: controls[this.controls[i].RowID].value,
                        }
                    }
                } else if (this.controls[i].ControlID == 16) {
                    if (this.controls[i].dataTable.length > 0) {
                        let jsonObject = {};
                        this.controls[i].dataTable.map((it, index) => {
                            jsonObject[index] = it;
                        })
                        let json = JSON.stringify(jsonObject);
                        _field = {
                            RowID: this.controls[i].RowID,
                            ControlID: this.controls[i].ControlID,
                            Value: json,
                        }
                    } else {
                        _field = {
                            RowID: this.controls[i].RowID,
                            ControlID: this.controls[i].ControlID,
                            Value: "",
                        }
                    }
                } else {
                    _field = {
                        RowID: this.controls[i].RowID,
                        ControlID: this.controls[i].ControlID,
                        Value: controls[this.controls[i].RowID].value,
                    }
                }
                Data_Field.push(_field);
            }
        }
        return Data_Field;
    }

    Create(_item: any) {
        this.disabledBtn = true;
        // this.layoutUtilsService.showWaitingDiv();
        this.dynamicFormService.updateThongTinCanNhap(_item).subscribe(res => {
            this.disabledBtn = false;
            // this.layoutUtilsService.OffWaitingDiv();
            this.changeDetectorRefs.detectChanges();
            if (res && res.status === 1) {
                const _messageType = "Câp nhật thành công";
                this.layoutUtilsService.showActionNotification(_messageType, MessageType.Update, 4000, true, false)
                this.goBack();
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    goBack() {
        this.Close.emit();
    }

    LoadForm() {
        this.processWorkService.Get_NodeDetail(this.ID).subscribe(res => {
            if (res.status == 1) {
                this.ViewData = res.data.DataFields;
                this.ngOnInit();
                this.changeDetectorRefs.detectChanges();
            }
        })
    }

    @HostListener('document:keydown', ['$event'])
    onKeydownHandler(event: KeyboardEvent) {
        if (event.ctrlKey && event.keyCode == 13)//phím Ctrl + Enter
        {
            this.submit();
        }
    }

    //đến ngày luôn lấy min là từ ngày
    DateChangeMin(val: any, index) {
        if (val.value != null && val.value != "") {
            let mindate = val.value.toDate();
            this.controls[index].to.min = mindate;
        }
    }

    //từ ngày luôn lấy max là đến ngày
    DateChangemMax(val: any, index) {
        if (val.value != null && val.value != "") {
            let maxdate_cur = val.value.toDate();
            this.controls[index].from.max = maxdate_cur;
        }
    }

    getFirstDay_LastDay(b_firstday) {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1); // ngày đầu tháng
        var lastDay = new Date(y, m + 1, 0); // ngày cuối tháng
        var curent = new Date(); // ngày hiện tại
        return b_firstday ? this.datePipe.transform(firstDay, 'dd/MM/yyyy') : this.datePipe.transform(lastDay, 'dd/MM/yyyy');
    }

    XemTruoc(item) {
        let obj = item.filename.split(".")[item.filename.split(".").length - 1];
        if (obj == "jpg" || obj == "png" || obj == "jpeg") {
            window.open(item.link);
        }
        if (obj == "xls" || obj == "xlsx" || obj == "doc" || obj == "docx") {
            this.layoutUtilsService.ViewDoc_WF(item.link);
        }
    }

    meImage;
    TaiXuong(item) {
        let obj = item.filename.split(".")[item.filename.split(".").length - 1];
        if (obj == "jpg" || obj == "png" || obj == "jpeg") {
            const splitUrl = item.link.split("/");
            const filename = splitUrl[splitUrl.length - 1];
            fetch(item.link)
                .then((response) => {
                    response.arrayBuffer().then(function (buffer) {
                        const url = window.URL.createObjectURL(new Blob([buffer]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", filename); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
                })
                .catch((err) => {
                });
        } else {
            window.open(item.link);
        }
    }
    //=======================Bổ sung xử lý nếu control là table==================
    Themdongmoi(item: any) {
        let it = {};
        item.init.map((item, index) => {
            it[item.RowID] = "";
        })
        item.dataTable.push(it);
    }

    getValue(row: any, list: any) {
        let text = "";
        text = row[list.RowID];
        return text;
    }
    RowChange(val: any, row: any, list: any) {
        row[list.RowID] = val.target.value;
    }
    XoaRow(row: any, item: any) {
        let index = item.dataTable.findIndex(x => x == row);
        item.dataTable.splice(index, 1);
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
}


//Dùng cho chuyển giai đoạn
@Component({
    selector: 'm-dynamic-form-move',
    templateUrl: './dynamic-form-move.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DynamicFormMoveComponent implements OnInit {
    constructor(public dynamicFormService: DynamicFormService,
        private fb: FormBuilder,
        private datePipe: DatePipe,
        private translate: TranslateService,
        private changeDetectorRefs: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,) { }

    formControls: FormGroup;
    showSearch: boolean = false;
    controls: any[] = [];
    ID_Struct: string = '';
    listChucDanh: any[] = [];
    listChucVu: any[] = [];
    d_minDate: any;
    d_maxDate: any;
    selectedNode: BehaviorSubject<any> = new BehaviorSubject([]);
    tmp_thang: string = '';
    tmp_nam: string = '';
    search: string = '';

    listControls: any[] = [];
    @Input() ID: any;
    @Input() TypeID: any;
    @Input() ViewData: any; //Dùng cho xem chi tiết dữ liệu
    @Input() isNext: any;
    @Input() nodeListID: any;//ID giai đoạn chuyển tới (Dùng trong kanban)
    tinyMCE = {};
    @Output() Close = new EventEmitter();
    ProcessID: number;
    listProcess: any[] = [];
    listNguoiThucHien: any[] = [];
    disabledBtn: boolean;
    //====================Người theo dõi===================
    listNguoiTheoDoi: any[] = [];
    public bankFilterCtrlNTD: FormControl = new FormControl();
    public filteredBanksNTD: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    //===============Thông tin chuyển giai đoạn======================
    listData: any[] = [];
    GiaiDoanID: number;
    IsNext: boolean = false;
    NodeListID: number;
    //===============================================================
    ngOnInit(): void {
        this.reset();
        this.GiaiDoanID = this.ID;
        this.IsNext = this.isNext;
        this.NodeListID = this.nodeListID;
        this.dynamicFormService.Get_FieldsNode(this.GiaiDoanID, this.NodeListID).subscribe(res => {
            if (res && res.status == 1) {
                this.listData = res.data;
                this.buildForm();
                this.changeDetectorRefs.detectChanges();
            }
        })
    }


    buildForm() {
        for (let j = 0; j < this.listData.length; j++) {
            for (var i = 0; i < this.listData[j].dt_fieldnode.length; i++) {
                let index = i;
                if (this.listData[j].dt_fieldnode[i].APIData) {
                    if (this.listData[j].dt_fieldnode[index].ControlID == 5 || this.listData[j].dt_fieldnode[index].ControlID == 6 || this.listData[j].dt_fieldnode[index].ControlID == 9 || this.listData[j].dt_fieldnode[index].ControlID == 11) {
                        let LinkAPI = "";
                        if (this.listData[j].dt_fieldnode[index].DependID == null && !this.listData[j].dt_fieldnode[index].IsDepend) {
                            LinkAPI = this.listData[j].dt_fieldnode[index].APIData + this.listData[j].dt_fieldnode[index].FieldID;
                        } else {
                            LinkAPI = this.listData[j].dt_fieldnode[index].APIData;
                        }
                        if (this.listData[j].dt_fieldnode[index].ControlID == 5 || this.listData[j].dt_fieldnode[index].ControlID == 6 || this.listData[j].dt_fieldnode[index].ControlID == 9) {
                            this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
                                if (res.data.length > 0) {
                                    this.listData[j].dt_fieldnode[index].init = res.data;
                                } else {
                                    this.listData[j].dt_fieldnode[index].init = [];
                                }
                                this.changeDetectorRefs.detectChanges();
                            });
                        } else {
                            this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
                                this.listData[j].dt_fieldnode[index].init = new BehaviorSubject([]);
                                if (res.data.length > 0) {
                                    this.listData[j].dt_fieldnode[index].init.next(res.data);
                                } else {
                                    this.listData[j].dt_fieldnode[index].init.next([]);
                                }
                            });
                        }
                    }
                }
            }
        }
        this.createForm();
    }

    reset() {
        let item = {};
        this.formControls = this.fb.group(item);
    }

    createForm() {
        let item = {};
        this.formControls = this.fb.group(item);
        for (let j = 0; j < this.listData.length; j++) {
            for (var i = 0; i < this.listData[j].dt_fieldnode.length; i++) {
                let control = this.listData[j].dt_fieldnode[i];
                if (control.Required) {
                    // if (control.ControlID == 7 || control.ControlID == 8) {
                    //     this.formControls.addControl(control.RowID, new FormControl(false, [Validators.required]));
                    //     this.formControls.controls[control.RowID].markAsTouched();
                    // } else {
                    //     this.formControls.addControl(control.RowID, new FormControl('', [Validators.required]));
                    //     this.formControls.controls[control.RowID].markAsTouched();
                    // }
                    if (control.ControlID == 6) {
                        this.formControls.addControl(control.RowID, new FormControl(control.Value ? control.Value : ''));
                    } else if (control.ControlID == 7 || control.ControlID == 8) {
                        this.formControls.addControl(control.RowID, new FormControl(control.Value == "True" ? true : false));
                    } else if (control.ControlID == 10 || control.ControlID == 12 || control.ControlID == 13 || control.ControlID == 14) {
                        this.formControls.addControl(control.RowID, new FormControl(control.Files ? control.Files : []));
                    } else {
                        this.formControls.addControl(control.RowID, new FormControl(control.Value ? '' + control.Value : ''));
                    }
                    this.formControls.controls[control.RowID].markAsTouched()

                } else {
                    // this.formControls.addControl(control.RowID, new FormControl(''));

                    if (control.ControlID == 6) {
                        this.formControls.addControl(control.RowID, new FormControl(control.Value ? control.Value : ''));
                    } else if (control.ControlID == 7 || control.ControlID == 8) {
                        this.formControls.addControl(control.RowID, new FormControl(control.Value == "True" ? true : false));
                    } else if (control.ControlID == 10 || control.ControlID == 12 || control.ControlID == 13 || control.ControlID == 14) {
                        this.formControls.addControl(control.RowID, new FormControl(control.Files ? control.Files : []));
                    } else {
                        this.formControls.addControl(control.RowID, new FormControl(control.Value ? '' + control.Value : ''));
                    }
                }
            }
        }

    }

    //====================================Xử lý sự kiện change=========================
    GetValueNode(val: any, item: any) {
        let StructID = val.RowID;
        let obj = this.controls.find(x => x.RowID === item.DependID);
        let index = this.controls.findIndex(x => x.RowID === item.DependID);
        let LinkAPI = obj.APIData + StructID;
        this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
            if (res.data.length > 0) {
                this.controls[index].init = res.data;
            } else {
                this.controls[index].init = [];
            }
        });
    }

    nguoiThucHienChange(val: any, item: any) {
        item.IDnguoiThucHien = val;
    }
    //===========================================================================================

    submit() {
        const controls = this.formControls.controls;
        if (this.formControls.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            let message = 'Vui lòng nhập đầy đủ thông tin trường dữ liệu bắt buộc';
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            return;
        }

        const updatedegree = this.prepareCustomer();
        this.Create(updatedegree);

    }

    prepareCustomer(): any {
        const controls = this.formControls.controls;
        let Data_InfoChuyenGiaiDoanData = [];
        //=========Xử lý cho phần form động=====================
        if (this.listData.length > 0) {
            for (var j = 0; j < this.listData.length; j++) {
                let Data_Field = [];
                for (var i = 0; i < this.listData[j].dt_fieldnode.length; i++) {
                    let _field = {
                        RowID: this.listData[j].dt_fieldnode[i].RowID,
                        ControlID: this.listData[j].dt_fieldnode[i].ControlID,
                        Value: controls[this.listData[j].dt_fieldnode[i].RowID].value,
                    }
                    Data_Field.push(_field);
                }
                let _info = {
                    RowID: this.listData[j].RowID,
                    NguoiThucHienID: +this.listData[j].IDnguoiThucHien,
                    FieldNode: Data_Field,
                };
                Data_InfoChuyenGiaiDoanData.push(_info);
            }
        }

        let _item = {
            NodeID: this.GiaiDoanID,
            InfoChuyenGiaiDoanData: Data_InfoChuyenGiaiDoanData,
            IsNext: this.IsNext,
            NodeListID: this.NodeListID,
        };
        return _item;
    }

    Create(_item: any) {
        this.disabledBtn = true;
        // this.layoutUtilsService.showWaitingDiv();
        this.dynamicFormService.ChuyenGiaiDoan(_item).subscribe(res => {
            // this.layoutUtilsService.OffWaitingDiv();
            this.disabledBtn = false;
            this.changeDetectorRefs.detectChanges();
            if (res && res.status === 1) {
                const _messageType = this.translate.instant('workprocess.chuyengiaidoanthanhcong');
                this.layoutUtilsService.showActionNotification(_messageType, MessageType.Update, 4000, true, false)
                this.goBack();
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    goBack() {
        this.Close.emit(true);
    }
    //bắt sự kiện click ngoài form search thì đóng form
    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (event.target.id == 'id-form-filter-container')
            this.showSearch = false;
    }

    @HostListener('document:keydown', ['$event'])
    onKeydownHandler1(event: KeyboardEvent) {
        if (this.showSearch) {
            if (event.keyCode == 13)//phím Enter
            {
                this.submit();
            }
        }
    }

    //đến ngày luôn lấy min là từ ngày
    DateChangeMin(val: any, index) {
        if (val.value != null && val.value != "") {
            let mindate = val.value.toDate();
            this.controls[index].to.min = mindate;
        }
    }

    //từ ngày luôn lấy max là đến ngày
    DateChangemMax(val: any, index) {
        if (val.value != null && val.value != "") {
            let maxdate_cur = val.value.toDate();
            this.controls[index].from.max = maxdate_cur;
        }
    }

    getFirstDay_LastDay(b_firstday) {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1); // ngày đầu tháng
        var lastDay = new Date(y, m + 1, 0); // ngày cuối tháng
        var curent = new Date(); // ngày hiện tại
        return b_firstday ? this.datePipe.transform(firstDay, 'dd/MM/yyyy') : this.datePipe.transform(lastDay, 'dd/MM/yyyy');
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
}


//Dùng cho tạo công việc
@Component({
    selector: 'm-dynamic-form-create',
    templateUrl: './dynamic-form-create.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DynamicFormCreateComponent implements OnInit {
    constructor(public dynamicFormService: DynamicFormService,
        private fb: FormBuilder,
        private datePipe: DatePipe,
        private translate: TranslateService,
        private changeDetectorRefs: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private danhMucChungService: DanhMucChungService,
        private route: Router,
        public dialog: MatDialog,) { }

    formControls: FormGroup;
    showSearch: boolean = false;
    controls: any[] = [];
    ID_Struct: string = '';
    listChucDanh: any[] = [];
    listChucVu: any[] = [];
    d_minDate: any;
    d_maxDate: any;
    selectedNode: BehaviorSubject<any> = new BehaviorSubject([]);
    tmp_thang: string = '';
    tmp_nam: string = '';
    search: string = '';

    listControls: any[] = [];
    @Input() ID: any;
    @Input() TypeID: any;
    @Input() ViewData: any; //Dùng cho xem chi tiết dữ liệu
    @Output() Close = new EventEmitter();
    ProcessID: number;
    listProcess: any[] = [];
    listNguoiThucHien: any[] = [];
    disabledBtn: boolean;
    //====================Người theo dõi===================
    ListNguoiTheoDoi: any[] = [];
    listNguoiTheoDoi: any[] = [];
    public bankFilterCtrlNTD: FormControl = new FormControl();
    public filteredBanksNTD: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    //====================Người quản lý===================
    ListNguoiQuanLy: any[] = [];
    listNguoiQuanLy: any[] = [];
    public bankFilterCtrlNQL: FormControl = new FormControl();
    public filteredBanksNQL: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    //===============Thông tin chuyển giai đoạn======================
    listData: any[] = [];
    GiaiDoanID: number;
    itemFile: any;
    //===============================================================
    tinyMCE: any = {};
    ngOnInit(): void {
        this.reset();
        this.tinyMCE = Object.assign({}, tinyMCE);
        this.itemFile = {
            RowID: "",
            Title: "",
            Description: "",
            Required: false,
            Files: []
        };
        this.changeQuyTrinh(this.ID);
        this.createForm();
        setTimeout(() => {
            document.getElementById("tencongviec").focus();
        }, 100);
    }

    changeQuyTrinh(val: any) {
        this.ProcessID = val;
        this.dynamicFormService.Get_ControlsList(this.ProcessID).subscribe(res => {
            if (res && res.status == 1) {
                if (res.data.length > 0) {
                    this.listData = res.data;
                    this.controls = res.datafields;
                    this.buildForm();
                    this.changeDetectorRefs.detectChanges();
                } else {
                    this.listData = [];
                    this.controls = [];
                    this.buildForm();
                    this.changeDetectorRefs.detectChanges();
                }
            } else {
                this.listData = [];
                this.controls = [];
                this.buildForm();
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                this.changeDetectorRefs.detectChanges();
            }
        })

    }

    loadData() {
        this.danhMucChungService.GetDSNguoiApDung().subscribe(res => {
            if (res.data && res.data.length > 0) {
                this.listNguoiTheoDoi = res.data;
                this.setUpDropSearcTheoDoi();

                this.listNguoiQuanLy = res.data;
                this.setUpDropSearcQuanLy();
                this.changeDetectorRefs.detectChanges();
            }
        });
    }

    //=============================Người theo dõi==================================
    AddNguoiTheoDoi() {
        let _item = [];
        this.ListNguoiTheoDoi.map((item, index) => {
            _item.push('' + item.ObjectID);
        });
        let _itemExcept = [];
        this.ListNguoiQuanLy.map((item, index) => {
            _itemExcept.push('' + item.ObjectID);
        });
        const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item, _itemExcept }, panelClass: ['sky-padding-0', 'width600'], });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            if (res.data.length > 0) {
                this.ListNguoiTheoDoi = [];
                res.data.map((item, index) => {
                    let data = {
                        ObjectID: item.UserId,
                        ObjectName: item.FullName,
                        FirstName: item.FirstName,
                        AvartarImgURL: item.AvartarImgURL,
                        Jobtitle: item.Jobtitle,

                    }
                    this.ListNguoiTheoDoi.push(data);
                })
            } else {
                this.ListNguoiTheoDoi = [];
            }
            this.changeDetectorRefs.detectChanges();
        });
    }

    setUpDropSearcTheoDoi() {
        this.bankFilterCtrlNTD.setValue('');
        this.filterBanksNTD();
        this.bankFilterCtrlNTD.valueChanges
            .pipe()
            .subscribe(() => {
                this.filterBanksNTD();
            });
    }

    protected filterBanksNTD() {
        if (!this.listNguoiTheoDoi) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrlNTD.value;
        if (!search) {
            this.filteredBanksNTD.next(this.listNguoiTheoDoi.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanksNTD.next(
            this.listNguoiTheoDoi.filter(bank => bank.Title.toLowerCase().indexOf(search) > -1)
        );
    }

    //==============================Người quản lý==================================


    AddNguoiQuanLy() {
        let _item = [];
        this.ListNguoiQuanLy.map((item, index) => {
            _item.push('' + item.ObjectID);
        });
        let _itemExcept = [];
        this.ListNguoiQuanLy.map((item, index) => {
            _itemExcept.push('' + item.ObjectID);
        });
        const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item, _itemExcept }, panelClass: ['sky-padding-0', 'width600'], });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            if (res.data.length > 0) {
                this.ListNguoiQuanLy = [];
                res.data.map((item, index) => {
                    let data = {
                        ObjectID: item.UserId,
                        ObjectName: item.FullName,
                        FirstName: item.FirstName,
                        AvartarImgURL: item.AvartarImgURL,
                        Jobtitle: item.Jobtitle,

                    }
                    this.ListNguoiQuanLy.push(data);
                })
            } else {
                this.ListNguoiQuanLy = [];
            }
            this.changeDetectorRefs.detectChanges();
        });
    }

    setUpDropSearcQuanLy() {
        this.bankFilterCtrlNQL.setValue('');
        this.filterBanksNQL();
        this.bankFilterCtrlNQL.valueChanges
            .pipe()
            .subscribe(() => {
                this.filterBanksNQL();
            });
    }

    protected filterBanksNQL() {
        if (!this.listNguoiQuanLy) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrlNQL.value;
        if (!search) {
            this.filteredBanksNQL.next(this.listNguoiQuanLy.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanksNQL.next(
            this.listNguoiQuanLy.filter(bank => bank.Title.toLowerCase().indexOf(search) > -1)
        );
    }

    //==============================================================================
    buildForm() {
        for (var i = 0; i < this.controls.length; i++) {
            let index = i;
            if (this.controls[i].APIData) {
                if (this.controls[index].ControlID == 5 || this.controls[index].ControlID == 6 || this.controls[index].ControlID == 9 || this.controls[index].ControlID == 11 || this.controls[index].ControlID == 16) {
                    let LinkAPI = "";
                    if (this.controls[index].DependID == null && !this.controls[index].IsDepend) {
                        LinkAPI = this.controls[index].APIData + this.controls[index].FieldID;
                    } else {
                        LinkAPI = this.controls[index].APIData;
                    }
                    if (this.controls[index].ControlID == 5 || this.controls[index].ControlID == 6 || this.controls[index].ControlID == 9) {
                        this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
                            if (res.data.length > 0) {
                                this.controls[index].init = res.data;
                            } else {
                                this.controls[index].init = [];
                            }
                            this.changeDetectorRefs.detectChanges();
                        });
                    } else if (this.controls[index].ControlID == 16) {
                        this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
                            if (res.data.length > 0) {
                                this.controls[index].init = res.data;
                            }
                            this.changeDetectorRefs.detectChanges();
                        });
                    } else {
                        this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
                            this.controls[index].init = new BehaviorSubject([]);
                            if (res.data.length > 0) {
                                this.controls[index].init.next(res.data);
                            } else {
                                this.controls[index].init.next([]);
                            }
                        });
                    }
                }
            }
        }
        this.createForm();
    }

    reset() {
        let item = {};
        this.formControls = this.fb.group(item);
        this.formControls.addControl('tenCongViec', new FormControl('', [Validators.required]));
        this.formControls.addControl('file', new FormControl(''));
        this.formControls.addControl('noiDung', new FormControl(''));
        this.formControls.controls['tenCongViec'].markAsTouched();
    }

    createForm() {
        let item = {};
        this.formControls = this.fb.group(item);
        this.formControls.addControl('tenCongViec', new FormControl('', [Validators.required]));
        this.formControls.addControl('file', new FormControl(''));
        this.formControls.addControl('noiDung', new FormControl(''));

        this.formControls.controls['tenCongViec'].markAsTouched();
        for (var i = 0; i < this.controls.length; i++) {
            let control = this.controls[i];
            if (control.ControlID == 6) {
                this.formControls.addControl(control.RowID, new FormControl(control.Value ? control.Value : ''));
            } else if (control.ControlID == 7 || control.ControlID == 8) {
                this.formControls.addControl(control.RowID, new FormControl(control.Value == "True" ? true : false));
            } else if (control.ControlID == 10 || control.ControlID == 12 || control.ControlID == 13 || control.ControlID == 14) {
                this.formControls.addControl(control.RowID, new FormControl(control.Files.length > 0 ? control.Files : []));
            } else if (control.ControlID == 16) {
                if (control.Value[0] != '' && control.Value[0] != null) {
                    let data = JSON.parse(control.Value[0]);
                    Object.keys(data).map((index) => {
                        control.dataTable.push(data[index]);
                    })
                } else {
                    control.dataTable = []
                }
            } else {
                this.formControls.addControl(control.RowID, new FormControl(control.Value ? '' + control.Value : ''));
            }
            if (control.Required) {
                if (control.ControlID != 15 && control.ControlID != 16) {
                    this.formControls.controls['' + control.RowID].markAsTouched();
                }
            }
        }
    }

    //====================================Xử lý sự kiện change=========================
    GetValueNode(val: any, item: any) {
        let StructID = val.RowID;
        let obj = this.controls.find(x => x.RowID === item.DependID);
        let index = this.controls.findIndex(x => x.RowID === item.DependID);
        let LinkAPI = obj.APIData + StructID;
        this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
            if (res.data.length > 0) {
                this.controls[index].init = res.data;
            } else {
                this.controls[index].init = [];
            }
        });
    }

    nguoiThucHienChange(val: any, item: any) {
        item.IDnguoiThucHien = val;
    }
    //===========================================================================================

    submit() {
        const controls = this.formControls.controls;
        if (this.formControls.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            let message = 'Vui lòng nhập đầy đủ thông tin trường dữ liệu bắt buộc';
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            return;
        }

        if (this.ListNguoiQuanLy.length == 0) {
            let message = 'Vui lòng chọn người quản lý nhiệm vụ';
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            return;
        }

        let checkTrung = false;
        if (this.ListNguoiQuanLy.length > 0 && this.ListNguoiTheoDoi.length > 0) {
            this.ListNguoiQuanLy.map((item, index) => {
                this.ListNguoiTheoDoi.map((it, index) => {
                    if (item.ObjectID == it.ObjectID) {
                        checkTrung = true;
                        return;
                    }
                })
            })
        }

        if (checkTrung) {
            let message = 'Người quản lý và người theo dõi không được trùng nhau';
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            return;
        }

        const updatedegree = this.prepareCustomer();
        this.Create(updatedegree);

    }

    prepareCustomer(): any {
        const controls = this.formControls.controls;
        let Data_InfoChuyenGiaiDoanData = [];
        //=========Xử lý người thực hiện form động=====================
        if (this.listData.length > 0) {
            for (var j = 0; j < this.listData.length; j++) {
                let Data_Field = [];
                let _info = {
                    RowID: this.listData[j].RowID,
                    NguoiThucHienID: +this.listData[j].IDnguoiThucHien,
                    FieldNode: Data_Field,
                };
                Data_InfoChuyenGiaiDoanData.push(_info);
            }
        }

        //=========Xử lý cho phần form động============================
        let Data_Field = [];
        if (this.controls.length > 0) {
            for (var i = 0; i < this.controls.length; i++) {
                let _field = {}
                if (this.controls[i].ControlID == 10 || this.controls[i].ControlID == 12 || this.controls[i].ControlID == 13 || this.controls[i].ControlID == 14) {
                    if (controls[this.controls[i].RowID].value.length > 0) {
                        let Files = [];
                        for (var j = 0; j < controls[this.controls[i].RowID].value.length; j++) {
                            if (!controls[this.controls[i].RowID].value[j].IsDel) {
                                Files.push(controls[this.controls[i].RowID].value[j]);
                            }
                        }
                        _field = {
                            RowID: this.controls[i].RowID,
                            ControlID: this.controls[i].ControlID,
                            Value: Files,
                        }
                    } else {
                        _field = {
                            RowID: this.controls[i].RowID,
                            ControlID: this.controls[i].ControlID,
                            Value: controls[this.controls[i].RowID].value,
                        }
                    }
                } else if (this.controls[i].ControlID == 16) {
                    if (this.controls[i].dataTable.length > 0) {
                        let jsonObject = {};
                        this.controls[i].dataTable.map((it, index) => {
                            jsonObject[index] = it;
                        })
                        let json = JSON.stringify(jsonObject);
                        _field = {
                            RowID: this.controls[i].RowID,
                            ControlID: this.controls[i].ControlID,
                            Value: json,
                        }
                    } else {
                        _field = {
                            RowID: this.controls[i].RowID,
                            ControlID: this.controls[i].ControlID,
                            Value: "",
                        }
                    }
                } else if (this.controls[i].ControlID == 3) {
                    _field = {
                        RowID: this.controls[i].RowID,
                        ControlID: this.controls[i].ControlID,
                        Value: this.danhMucChungService.f_convertDateUTC(controls[this.controls[i].RowID].value),
                    }
                }
                else {
                    _field = {
                        RowID: this.controls[i].RowID,
                        ControlID: this.controls[i].ControlID,
                        Value: controls[this.controls[i].RowID].value,
                    }
                }
                Data_Field.push(_field);
            }
        }

        let _ChuyenGiaiDoanData = new ChuyenGiaiDoanData();
        _ChuyenGiaiDoanData.NodeID = 0;
        _ChuyenGiaiDoanData.InfoChuyenGiaiDoanData = Data_InfoChuyenGiaiDoanData;

        //============Xử lý cho phần lưu nhiều file============
        let Data_File = [];
        if (controls['file'].value.length > 0) {
            for (var i = 0; i < controls['file'].value.length; i++) {
                let _file = {
                    File: controls["file"].value[i].strBase64,
                    FileName: controls["file"].value[i].filename,
                    ContentType: controls["file"].value[i].type,
                }
                Data_File.push(_file);
            }
        }
        //============Xử lý cho phần lưu người theo dõi============
        let dataTheoDoi = [];
        if (this.ListNguoiTheoDoi.length > 0) {
            this.ListNguoiTheoDoi.map((item, index) => {
                let dt = {
                    ObjectID: item.ObjectID,
                    ObjectType: "3",
                }
                dataTheoDoi.push(dt);
            });
        }

        //============Xử lý cho phần lưu người quản lý============
        let dataQuanLy = [];
        if (this.ListNguoiQuanLy.length > 0) {
            this.ListNguoiQuanLy.map((item, index) => {
                let dt = {
                    ObjectID: item.ObjectID,
                    ObjectType: "5",
                }
                dataQuanLy.push(dt);
            });
        }

        let _item = {
            TaskName: controls['tenCongViec'].value,
            ProcessID: this.ProcessID,
            Description: controls["noiDung"].value,
            DescriptionFileList: Data_File,
            ChuyenGiaiDoanData: _ChuyenGiaiDoanData,
            Data_Follower: dataTheoDoi,
            nguoiquanly: dataQuanLy,
            datafields: Data_Field
        };

        return _item;
    }

    Create(_item: any) {
        this.disabledBtn = true;
        this.layoutUtilsService.showWaitingDiv();
        this.dynamicFormService.CreateWorkProcess(_item).subscribe(res => {
            this.disabledBtn = false;
            this.layoutUtilsService.OffWaitingDiv();
            this.changeDetectorRefs.detectChanges();
            if (res && res.status === 1) {
                const _messageType = this.translate.instant('workprocess.taocongviecthanhcong');
                this.layoutUtilsService.showActionNotification(_messageType, MessageType.Update, 4000, true, false)
                this.goBack(res.data);
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    goBack(id: any) {
        this.Close.emit(id);
    }
    //bắt sự kiện click ngoài form search thì đóng form
    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (event.target.id == 'id-form-filter-container')
            this.showSearch = false;
    }

    @HostListener('document:keydown', ['$event'])
    onKeydownHandler1(event: KeyboardEvent) {
        if (this.showSearch) {
            if (event.keyCode == 13)//phím Enter
            {
                this.submit();
            }
        }
    }

    //đến ngày luôn lấy min là từ ngày
    DateChangeMin(val: any, index) {
        if (val.value != null && val.value != "") {
            let mindate = val.value.toDate();
            this.controls[index].to.min = mindate;
        }
    }

    //từ ngày luôn lấy max là đến ngày
    DateChangemMax(val: any, index) {
        if (val.value != null && val.value != "") {
            let maxdate_cur = val.value.toDate();
            this.controls[index].from.max = maxdate_cur;
        }
    }

    getFirstDay_LastDay(b_firstday) {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1); // ngày đầu tháng
        var lastDay = new Date(y, m + 1, 0); // ngày cuối tháng
        var curent = new Date(); // ngày hiện tại
        return b_firstday ? this.datePipe.transform(firstDay, 'dd/MM/yyyy') : this.datePipe.transform(lastDay, 'dd/MM/yyyy');
    }

    XemTruoc(item) {
        let obj = item.filename.split(".")[item.filename.split(".").length - 1];
        if (obj == "jpg" || obj == "png" || obj == "jpeg") {
            window.open(item.link);
        }
        if (obj == "xls" || obj == "xlsx" || obj == "doc" || obj == "docx") {
            this.layoutUtilsService.ViewDoc_WF(item.link);
        }
    }

    meImage;
    TaiXuong(item) {
        let obj = item.filename.split(".")[item.filename.split(".").length - 1];
        if (obj == "jpg" || obj == "png" || obj == "jpeg") {
            const splitUrl = item.link.split("/");
            const filename = splitUrl[splitUrl.length - 1];
            fetch(item.link)
                .then((response) => {
                    response.arrayBuffer().then(function (buffer) {
                        const url = window.URL.createObjectURL(new Blob([buffer]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", filename); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
                })
                .catch((err) => {
                });
        } else {
            window.open(item.link);
        }
    }
    //=======================Bổ sung xử lý nếu control là table==================
    Themdongmoi(item: any) {
        let it = {};
        item.init.map((item, index) => {
            it[item.RowID] = "";
        })
        item.dataTable.push(it);
    }

    getValue(row: any, list: any) {
        let text = "";
        text = row[list.RowID];
        return text;
    }
    RowChange(val: any, row: any, list: any) {
        row[list.RowID] = val.target.value;
    }
    XoaRow(row: any, item: any) {
        let index = item.dataTable.findIndex(x => x == row);
        item.dataTable.splice(index, 1);
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
}


//Dùng cho nhân bản nhiệm vụ
@Component({
    selector: 'm-dynamic-form-copy',
    templateUrl: './dynamic-form-copy.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class DynamicFormCopyComponent implements OnInit {
    constructor(public dynamicFormService: DynamicFormService,
        private fb: FormBuilder,
        private datePipe: DatePipe,
        private translate: TranslateService,
        private changeDetectorRefs: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private danhMucChungService: DanhMucChungService,
        public dialog: MatDialog,) { }

    formControls: FormGroup;
    showSearch: boolean = false;
    controls: any[] = [];
    ID_Struct: string = '';
    listChucDanh: any[] = [];
    listChucVu: any[] = [];
    d_minDate: any;
    d_maxDate: any;
    selectedNode: BehaviorSubject<any> = new BehaviorSubject([]);
    tmp_thang: string = '';
    tmp_nam: string = '';
    search: string = '';

    listControls: any[] = [];
    @Input() ID: any;
    @Input() TypeID: any;
    @Input() ViewData: any; //Dùng cho xem chi tiết dữ liệu
    tinyMCE = {};
    @Output() Close = new EventEmitter();
    ProcessID: number;
    TasksID: number;
    listProcess: any[] = [];
    listNguoiThucHien: any[] = [];
    disabledBtn: boolean;
    //====================Người theo dõi===================
    ListNguoiTheoDoi: any[] = [];
    listNguoiTheoDoi: any[] = [];
    public bankFilterCtrlNTD: FormControl = new FormControl();
    public filteredBanksNTD: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    //====================Người quản lý===================
    ListNguoiQuanLy: any[] = [];
    //===============Thông tin nhân bản======================
    TenNhiemVu: string = '';
    NoiDung: string = '';
    listData: any[] = [];
    GiaiDoanID: number;
    itemFile: any;
    //===============================================================
    ngOnInit(): void {
        this.reset();
        this.itemFile = {
            RowID: "",
            Title: "",
            Description: "",
            Required: false,
            Files: []
        };
        this.tinyMCE = tinyMCE;
        this.changeNhiemVu(this.ID);
    }

    changeNhiemVu(val: any) {
        this.TasksID = val;
        this.dynamicFormService.copyTasks(this.TasksID).subscribe(res => {
            if (res && res.status == 1) {
                this.ProcessID = res.ProcessID;
                this.TenNhiemVu = res.CongViec;
                this.NoiDung = res.Description;
                if (res.DescriptionFileList && res.DescriptionFileList.length > 0) {
                    this.itemFile = {
                        RowID: "",
                        Title: "",
                        Description: "",
                        Required: false,
                        Files: [
                            {
                                strBase64: res.DescriptionFileList[0].strBase64,
                                filename: res.DescriptionFileList[0].filename,
                                type: res.DescriptionFileList[0].type,
                            }
                        ]
                    };
                }

                if (res.NguoiQuanLy.length > 0) {
                    this.ListNguoiQuanLy = res.NguoiQuanLy;
                } else {
                    this.ListNguoiQuanLy = [];
                }

                if (res.nguoitheodoi.length > 0) {
                    this.ListNguoiTheoDoi = res.nguoitheodoi;
                } else {
                    this.ListNguoiTheoDoi = [];
                }

                if (res.data.length > 0) {
                    this.listData = res.data;
                    this.buildForm();
                    this.changeDetectorRefs.detectChanges();
                } else {
                    this.listData = [];
                    this.buildForm();
                    this.changeDetectorRefs.detectChanges();
                }
            } else {
                this.listData = [];
                this.buildForm();
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                this.changeDetectorRefs.detectChanges();
            }
        })
    }

    AddNguoiTheoDoi() {
        let _item = [];
        this.ListNguoiTheoDoi.map((item, index) => {
            _item.push('' + item.ObjectID);
        });
        let _itemExcept = [];
        this.ListNguoiQuanLy.map((item, index) => {
            _itemExcept.push('' + item.ObjectID);
        });
        const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item, _itemExcept }, panelClass: ['m-mat-dialog-container__wrapper', 'choose_member'] });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            if (res.data.length > 0) {
                this.ListNguoiTheoDoi = [];
                res.data.map((item, index) => {
                    let data = {
                        ObjectID: item.UserId,
                        ObjectName: item.FullName,
                        FirstName: item.FirstName,
                        AvartarImgURL: item.AvartarImgURL,
                        Jobtitle: item.Jobtitle,

                    }
                    this.ListNguoiTheoDoi.push(data);
                })
            } else {
                this.ListNguoiTheoDoi = [];
            }
            this.changeDetectorRefs.detectChanges();
        });
    }

    AddNguoiQuanLy() {
        let _item = [];
        this.ListNguoiQuanLy.map((item, index) => {
            _item.push('' + item.ObjectID);
        });
        let _itemExcept = [];
        this.ListNguoiTheoDoi.map((item, index) => {
            _itemExcept.push('' + item.ObjectID);
        });
        const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item, _itemExcept }, panelClass: ['m-mat-dialog-container__wrapper', 'choose_member'] });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            if (res.data.length > 0) {
                this.ListNguoiQuanLy = [];
                res.data.map((item, index) => {
                    let data = {
                        ObjectID: item.UserId,
                        ObjectName: item.FullName,
                        FirstName: item.FirstName,
                        AvartarImgURL: item.AvartarImgURL,
                        Jobtitle: item.Jobtitle,

                    }
                    this.ListNguoiQuanLy.push(data);
                })
            } else {
                this.ListNguoiQuanLy = [];
            }
            this.changeDetectorRefs.detectChanges();
        });
    }

    buildForm() {
        for (let j = 0; j < this.listData.length; j++) {
            for (var i = 0; i < this.listData[j].dt_fieldnode.length; i++) {
                let index = i;
                if (this.listData[j].dt_fieldnode[i].APIData) {
                    if (this.listData[j].dt_fieldnode[index].ControlID == 5 || this.listData[j].dt_fieldnode[index].ControlID == 6 || this.listData[j].dt_fieldnode[index].ControlID == 9 || this.listData[j].dt_fieldnode[index].ControlID == 11) {
                        let LinkAPI = "";
                        if (this.listData[j].dt_fieldnode[index].DependID == null && !this.listData[j].dt_fieldnode[index].IsDepend) {
                            LinkAPI = this.listData[j].dt_fieldnode[index].APIData + this.listData[j].dt_fieldnode[index].FieldID;
                        } else {
                            LinkAPI = this.listData[j].dt_fieldnode[index].APIData;
                        }
                        if (this.listData[j].dt_fieldnode[index].ControlID == 5 || this.listData[j].dt_fieldnode[index].ControlID == 6 || this.listData[j].dt_fieldnode[index].ControlID == 9) {
                            this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
                                if (res.data.length > 0) {
                                    this.listData[j].dt_fieldnode[index].init = res.data;
                                } else {
                                    this.listData[j].dt_fieldnode[index].init = [];
                                }
                                this.changeDetectorRefs.detectChanges();
                            });
                        } else {
                            this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
                                this.listData[j].dt_fieldnode[index].init = new BehaviorSubject([]);
                                if (res.data.length > 0) {
                                    this.listData[j].dt_fieldnode[index].init.next(res.data);
                                } else {
                                    this.listData[j].dt_fieldnode[index].init.next([]);
                                }
                            });
                        }
                    }
                }
            }
        }
        this.createForm();
    }

    reset() {
        let item = {};
        this.formControls = this.fb.group(item);
        this.formControls.addControl('tenCongViec', new FormControl('', [Validators.required]));
        this.formControls.addControl('file', new FormControl(this.itemFile));
        this.formControls.addControl('noiDung', new FormControl(''));

        this.formControls.controls['tenCongViec'].markAsTouched();
    }

    createForm() {
        let item = {};
        this.formControls = this.fb.group(item);
        this.formControls.addControl('tenCongViec', new FormControl(this.TenNhiemVu, [Validators.required]));
        this.formControls.addControl('file', new FormControl(this.itemFile.Files));
        this.formControls.addControl('noiDung', new FormControl('' + this.NoiDung));

        this.formControls.controls['tenCongViec'].markAsTouched();
        for (let j = 0; j < this.listData.length; j++) {
            for (var i = 0; i < this.listData[j].dt_fieldnode.length; i++) {
                let control = this.listData[j].dt_fieldnode[i];
                if (control.ControlID == 6) {
                    this.formControls.addControl(control.RowID, new FormControl(control.Value ? control.Value : ''));
                } else if (control.ControlID == 7 || control.ControlID == 8) {
                    this.formControls.addControl(control.RowID, new FormControl(control.Value == "True" ? true : false));
                } else if (control.ControlID == 10 || control.ControlID == 12 || control.ControlID == 13 || control.ControlID == 14) {
                    this.formControls.addControl(control.RowID, new FormControl(control.Files ? control.Files : []));
                } else {
                    this.formControls.addControl(control.RowID, new FormControl(control.Value ? '' + control.Value : ''));
                }
                if (control.Required) {
                    this.formControls.controls[control.RowID].markAsTouched();
                }
            }
        }

    }

    //====================================Xử lý sự kiện change=========================
    GetValueNode(val: any, item: any) {
        let StructID = val.RowID;
        let obj = this.controls.find(x => x.RowID === item.DependID);
        let index = this.controls.findIndex(x => x.RowID === item.DependID);
        let LinkAPI = obj.APIData + StructID;
        this.dynamicFormService.getInitData(LinkAPI).subscribe(res => {
            if (res.data.length > 0) {
                this.controls[index].init = res.data;
            } else {
                this.controls[index].init = [];
            }
        });
    }

    nguoiThucHienChange(val: any, item: any) {
        item.IDnguoiThucHien = val;
    }
    //===========================================================================================

    submit() {
        const controls = this.formControls.controls;
        if (this.formControls.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            let message = 'Vui lòng nhập đầy đủ thông tin trường dữ liệu bắt buộc';
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            return;
        }

        if (this.ListNguoiQuanLy.length == 0) {
            let message = 'Vui lòng chọn người quản lý nhiệm vụ';
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            return;
        }

        let checkTrung = false;
        if (this.ListNguoiQuanLy.length > 0 && this.ListNguoiTheoDoi.length > 0) {
            this.ListNguoiQuanLy.map((item, index) => {
                this.ListNguoiTheoDoi.map((it, index) => {
                    if (item.ObjectID == it.ObjectID) {
                        checkTrung = true;
                        return;
                    }
                })
            })
        }

        if (checkTrung) {
            let message = 'Người quản lý và người theo dõi không được trùng nhau';
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            return;
        }

        const updatedegree = this.prepareCustomer();
        this.Create(updatedegree);

    }

    prepareCustomer(): any {

        const controls = this.formControls.controls;
        let Data_InfoChuyenGiaiDoanData = [];
        //=========Xử lý cho phần form động=====================
        if (this.listData.length > 0) {
            for (var j = 0; j < this.listData.length; j++) {
                let Data_Field = [];
                for (var i = 0; i < this.listData[j].dt_fieldnode.length; i++) {
                    let _field = {
                        RowID: this.listData[j].dt_fieldnode[i].RowID,
                        ControlID: this.listData[j].dt_fieldnode[i].ControlID,
                        Value: controls[this.listData[j].dt_fieldnode[i].RowID].value,
                    }
                    Data_Field.push(_field);
                }
                let _info = {
                    RowID: this.listData[j].RowID,
                    NguoiThucHienID: this.listData[j].IDnguoiThucHien,
                    FieldNode: Data_Field,
                };
                Data_InfoChuyenGiaiDoanData.push(_info);
            }
        }

        let _ChuyenGiaiDoanData = new ChuyenGiaiDoanData();
        _ChuyenGiaiDoanData.NodeID = 0;
        _ChuyenGiaiDoanData.InfoChuyenGiaiDoanData = Data_InfoChuyenGiaiDoanData;

        //============Xử lý cho phần lưu nhiều file============
        let Data_File = [];
        if (controls['file'].value.length > 0) {
            for (var i = 0; i < controls['file'].value.length; i++) {
                if (!controls["file"].value[i].IsDel) {
                    let _file = {
                        File: controls["file"].value[i].strBase64,
                        FileName: controls["file"].value[i].filename,
                        ContentType: controls["file"].value[i].type,
                    }
                    Data_File.push(_file);
                }
            }
        }
        //============Xử lý cho phần lưu người theo dõi============
        let dataTheoDoi = [];
        if (this.ListNguoiTheoDoi.length > 0) {
            this.ListNguoiTheoDoi.map((item, index) => {
                let dt = {
                    ObjectID: item.ObjectID,
                    ObjectType: "3",
                }
                dataTheoDoi.push(dt);
            });
        }

        //============Xử lý cho phần lưu người quản lý============
        let dataQuanLy = [];
        if (this.ListNguoiQuanLy.length > 0) {
            this.ListNguoiQuanLy.map((item, index) => {
                let dt = {
                    ObjectID: item.ObjectID,
                    ObjectType: "5",
                }
                dataQuanLy.push(dt);
            });
        }


        let _item = {
            TaskName: controls['tenCongViec'].value,
            ProcessID: this.ProcessID,
            Description: controls["noiDung"].value,
            DescriptionFileList: Data_File,
            ChuyenGiaiDoanData: _ChuyenGiaiDoanData,
            Data_Follower: dataTheoDoi,
            nguoiquanly: dataQuanLy,
        };

        return _item;
    }

    Create(_item: any) {
        this.disabledBtn = true;
        this.layoutUtilsService.showWaitingDiv();
        this.dynamicFormService.CreateWorkProcess(_item).subscribe(res => {
            this.disabledBtn = false;
            this.layoutUtilsService.OffWaitingDiv();
            this.changeDetectorRefs.detectChanges();
            if (res && res.status === 1) {
                const _messageType = this.translate.instant('workprocess.taocongviecthanhcong');
                this.layoutUtilsService.showActionNotification(_messageType, MessageType.Update, 4000, true, false)
                this.goBack(res.data);
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    goBack(id: any) {
        this.Close.emit(id);
    }
    //bắt sự kiện click ngoài form search thì đóng form
    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (event.target.id == 'id-form-filter-container')
            this.showSearch = false;
    }

    @HostListener('document:keydown', ['$event'])
    onKeydownHandler1(event: KeyboardEvent) {
        if (this.showSearch) {
            if (event.keyCode == 13)//phím Enter
            {
                this.submit();
            }
        }
    }

    //đến ngày luôn lấy min là từ ngày
    DateChangeMin(val: any, index) {
        if (val.value != null && val.value != "") {
            let mindate = val.value.toDate();
            this.controls[index].to.min = mindate;
        }
    }

    //từ ngày luôn lấy max là đến ngày
    DateChangemMax(val: any, index) {
        if (val.value != null && val.value != "") {
            let maxdate_cur = val.value.toDate();
            this.controls[index].from.max = maxdate_cur;
        }
    }

    getFirstDay_LastDay(b_firstday) {
        var date = new Date(), y = date.getFullYear(), m = date.getMonth();
        var firstDay = new Date(y, m, 1); // ngày đầu tháng
        var lastDay = new Date(y, m + 1, 0); // ngày cuối tháng
        var curent = new Date(); // ngày hiện tại
        return b_firstday ? this.datePipe.transform(firstDay, 'dd/MM/yyyy') : this.datePipe.transform(lastDay, 'dd/MM/yyyy');
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
}

