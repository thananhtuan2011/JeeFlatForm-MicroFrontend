import { DatePipe } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnInit, SimpleChange } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Gallery } from "ng-gallery";
import { BehaviorSubject } from "rxjs";
import { DynamicFormService } from "./dynamic-form.service";
import { LayoutUtilsService } from "projects/jeeworkflow/src/modules/crud/utils/layout-utils.service";
import { DanhMucChungService } from "../../../services/danhmuc.service";

@Component({
    selector: 'm-dynamic-form-view',
    templateUrl: './dynamic-form-view.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
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
//16: Table
//#endregion
export class DynamicFormViewComponent {
    constructor(public dynamicFormService: DynamicFormService,
        private fb: FormBuilder,
        private datePipe: DatePipe,
        private changeDetectorRefs: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        public danhMucChungService: DanhMucChungService,
        public gallery: Gallery,
    ) { }

    showSearch: boolean = false;
    controls: any[] = [];
    ID_Struct: string = '';
    listChucDanh: any[] = [];
    listChucVu: any[] = [];
    d_minDate: any;
    d_maxDate: any;
    listData: any[] = [];
    tmp_thang: string = '';
    tmp_nam: string = '';
    search: string = '';

    listControls: any[] = [];
    @Input() ViewData: any; //Dùng cho xem chi tiết dữ liệu
    tinyMCE: any = {};
    ProcessID: number;
    listProcess: any[] = [];
    listNguoiThucHien: any[] = [];
    disabledBtn: boolean;
    //=================Bổ sung control bảng================
    listTables: any[] = [];
    //=====================================================
    @Input() TypeID: any; //1-Dữ liệu đầu vào ; 2-Các giai đoạn còn lại
    ngOnChanges(changes: SimpleChange) {
        if (changes['ViewData'] || changes['TypeID']) {
            this.viewForm();
        }
    }

    viewForm() {
        if(this.ViewData){
            this.controls = this.ViewData;
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
            this.createViewForm();
        }
    }
    createViewForm() {
        for (var i = 0; i < this.controls.length; i++) {
            let control = this.controls[i];
            if (control.ControlID == 16) {
                control.dataTable = [];
                if (control.Value[0] != '' && control.Value[0] != null) {
                    let data = JSON.parse(control.Value[0]);
                    Object.keys(data).map((index) => {
                        control.dataTable.push(data[index]);
                    })
                } else {
                    control.dataTable = []
                }
            }
        }
    }

    getValueDynamic(item) {
        let value = "";
        switch (item.ControlID) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
            case 15:
                value = item.Value[0];
                break;
            case 5:
            case 9:
                if(item.init){
                    let obj = item.init.find(x => x.RowID == +item.Value[0]);
                    if (obj) {
                        value = obj.Title;
                    } else {
                        value = "";
                    }
                }
                
                break;
            case 6:
                if(item.init){
                    item.Value.map((it, inedx) => {
                        let obj = item.init.find(x => x.RowID == +it);
                        if (obj) {
                            value += ", " + obj.Title;
                        }
                    })
                    value = value.substring(1);
                }
                break;
            case 7:
            case 8:
                if(item.Value[0] == "True"){
                    value = "Có";
                }else{
                    value = "Không";
                }
                break;
        }
        return value;
    }

    Download(item) {
        window.open(item.link);
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
                    console.log(err);
                });
        } else {
            window.open(item.link);
        }
    }
    //=======================Bổ sung xử lý nếu control là table==================

    getValue(row: any, list: any) {
        let text = "";
        text = row[list.RowID];
        return text;
    }
    //============================================================================
    ShowXemTruoc(item) {
        let show = false;
        let obj = item.filename.split(".")[item.filename.split(".").length - 1];
        if (obj == "jpg" || obj == "png" || obj == "jpeg" || obj == "xls" || obj == "xlsx" || obj == "doc" || obj == "docx" || obj == "pdf") {
            show = true;
        }
        return show;
    }
}