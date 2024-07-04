// Angular
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  ElementRef,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  Validators,
} from "@angular/forms";
import * as moment from "moment";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DatePipe } from '@angular/common';
import { CustomWidget, Operators } from "./settimewidget.model";
import { LayoutUtilsService } from "projects/jeework/src/modules/crud/utils/layout-utils.service";
import { WorksbyprojectService } from "../Services/worksbyproject.service";
import { PanelDashboardService } from "../Services/panel-dashboard.service";
import { MotanoidungSetTimeComponent } from "../motanoidung-set-time/motanoidung-set-time.component";
@Component({
  selector: 'app-set-up-widget-time',
  templateUrl: './set-up-widget-time.component.html',
  styleUrls: ['./set-up-widget-time.component.scss']
})
export class SetUpWidgetTimeComponent implements OnInit {

  List_Operators: Operators[] = [];
  add_operator: boolean = false;
  Operator = [
    { id: '=', title: 'Bằng' },
    { id: '<>', title: 'Khác' },
    { id: '>', title: 'Lớn hơn' },
    { id: '>=', title: 'Lớn hơn hoặc bằng' },
    { id: '<', title: 'Nhỏ hơn' },
    { id: '<=', title: 'Nhỏ hơn hoặc bằng' }
  ];
  Time = [
    { id: 'day', title: 'Ngày' },
    { id: 'week', title: 'Tuần' },
    { id: 'month', title: 'Tháng' },
    { id: 'year', title: 'Năm' },

  ];
  List_dk = [
    { id: '1', Title: 'Theo ngày tạo', FieldSQL: 'w.CreatedDate' },
    { id: '2', Title: 'Theo ngày hết hạn', FieldSQL: 'w.deadline' },
    { id: '3', Title: 'Theo ngày bắt đầu', FieldSQL: 'w.start_date' },
    { id: '4', Title: 'Theo ngày hoàn thành', FieldSQL: 'w.end_date' },

  ];

  List_date: any[] = [];
  widget_name: string = '';
  itemForm: FormGroup;

  Date_: any;
  End_date: any;
  Operators: string = '';
  Operators_title: string = '';
  CustomID: string = '';

  FieldSQL: string = '';
  check_date: boolean = true;// biến này để xác định ngày khi nhập vào không có dấu (-),ex :@StartofDate('1d')
  Sql_query: string = '';
  check_start_week: boolean = true;// biến này để xác định ngày khi nhập vào không có dấu (-),ex :@StartofWeek('1w')
  check_end_week: boolean = true;// biến này để xác định ngày khi nhập vào không có dấu (-),ex :@StartofDWeek('1w')
  constructor(
    public _WorksbyprojectService: WorksbyprojectService,
    public dialogRef: MatDialogRef<SetUpWidgetTimeComponent>,
    private FormControlFB: FormBuilder,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private el: ElementRef,
    public _PanelDashboardService: PanelDashboardService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private datepipe: DatePipe
  ) {

  }
  edit_time: string = '';
  edit_id: number = 0;
  edit: string = '0';
  type: boolean = false;
  Detail_Custom: any[] = [];
  Title: string = '';
  ngOnInit() {
    this.createForm();
    if (this.data.id_custom != 0) {
      this.Detail_custom();
    }


    console.log('id_customid_customid_custom', this.data.id_custom)
    this.widget_name = this.data.item.name;
    this.loaddieukien();

  }
  Detail_custom() {
    this._PanelDashboardService.Detail_custom(this.data.id_custom).subscribe(res => {
      if (res && res.status == 1) {
        this.Detail_Custom = res.data;
        this.set_value_form();
      }
    })
  }
  getTitle(): string {
    let Name: string = 'Thêm mới';
    if (this.data.id_custom != 0) {
      Name = 'Chỉnh Sửa';
      return Name;
    }
    return Name;
  }
  createForm() {
    this.itemForm = this.FormControlFB.group({
      Title: ["", Validators.required],
      dieukien: ["", Validators.required],
      toantu: ["", Validators.required],
      giatri: ["", Validators.required],
      Time: [""],
    });
    const invalidControl = this.el.nativeElement.querySelector('[formcontrolname="Title"]');
    if (invalidControl) {
      invalidControl.focus();
    }

  }
  set_value_form() {
    if (this.Detail_Custom.length > 0) {
      this.Detail_Custom.forEach(item => {
        this.FieldSQL = item.FieldSQL;
        this.itemForm.controls["Title"].setValue(item.Title)
        this.List_dk.forEach(element => {
          if (element.FieldSQL == item.FieldSQL) {
            this.itemForm.controls["dieukien"].setValue(element)
          }
        })
      })

    }
  }
  close() {
    this.dialogRef.close();
  }
  f_convertDate(v: any) {
    if (v != "" && v != undefined) {
      const a = new Date(v);
      return (

        ("0" + a.getDate()).slice(-2) +
        "/" +
        ("0" + (a.getMonth() + 1)).slice(-2) +
        "/" +
        a.getFullYear()
      );
    }
  }

  loaddieukien() {
    this._PanelDashboardService.Get_listCustom().subscribe(res => {
      if (res && res.status == 1) {
        this.List_date = res.data;

      }
    })
  }
  Add() {
    if (this.check_ts()) {
      this.convert_time();
    }
    //let check: boolean = true;
    const item = new Operators();
    item.clear();

    item.operators = this.Operators;
    item.operators_title = this.Operators_title;
    item.startdate = this.Date_;
    if (this.List_Operators.length > 0) {
      if (this.type != null) {
        item.type = this.type;
      }
      else {
        this.layoutUtilsService.showError(
          "Chưa chọn loại!"
        );
      }

    } else {
      if (this.type) {
        item.type = this.type;
      }
      else item.type = false;
    }
    this.List_Operators.push(item);
    this.changeDetectorRefs.detectChanges();

  }
  Delete_operator(item) {
    this.List_Operators.forEach((element, index) => {
      if (element.operators == item.operators && element.startdate == item.startdate) this.List_Operators.splice(index, 1);
    });
    this.changeDetectorRefs.detectChanges();
  }
  BindText(event) {
    this.CustomID = event.RowID;
    this.Sql_query = event.SQL_Query;
    this.itemForm.controls["Time"].setValue(event.Title);
    this.edit_time = this.itemForm.controls["Time"].value;
    this.edit_id = event.RowID;
    if (this.check_ts()) {
      this.convert_time();
    }
  }
  ChangeAndOr(val) {
    if (val == 0) {
      this.type = false;
    }
    else {
      this.type = true;
    }
  }

  ChangDK(val) {
    this.FieldSQL = val.FieldSQL;

  }
  ChangeOperator(val) {
    this.Operators = val.id;
    this.Operators_title = val.title;

  }
  clear_time() {
    this.itemForm.controls["Time"].setValue("");
    this.edit_time = "";
    this.edit_id = 0;
  }


  Thongtin() {
    let item = this.List_date;
    let saveMessageTranslateParam = '';
    const dialogRef = this.dialog.open(MotanoidungSetTimeComponent, { data: { item }, width: '700px' });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        this.ngOnInit();
      }
    });
  }
  filterConfig() {
    const filter: any = {};
    filter.id = this.data.item.id;
    filter.operators = this.Operators;
    filter.customid = this.CustomID;

    if (this.Date_) {
      filter.startdate = this.Date_;
    }
    if (this.End_date) {
      filter.enddate = this.End_date;
    }

    return filter;
  }
  Onsubmit(withBack: boolean) {
    if (this.Date_ && this.Operators && this.CustomID) {
      let item = new CustomWidget();
      item.clear();
      item.RowID = this.data.id_custom;
      item.id = this.data.item.id
      item.Title = this.itemForm.controls["Title"].value;
      item.Operators = this.List_Operators;
      item.FieldSQL = this.FieldSQL;
      item.customid = Number(this.CustomID);
      item.SQL_Custom = this.Sql_query;
      if (this.data.id_custom != 0) {
        this._PanelDashboardService.Update_custom_widget(item).subscribe(res => {
          if (res && res.status == 1) {
            this.dialogRef.close();
          }
        })
      }
      else {
        this._PanelDashboardService.Insert_custom_widget(item).subscribe(res => {
          if (res && res.status == 1) {
            if (withBack) {
              this.dialogRef.close();
            }
            else {
              this.setEmtyForm();
            }
          }
        })
      }
    }
    else {
      this.layoutUtilsService.showError(
        "Chưa nhập đủ trường thông tin bắt buộc!"
      );
    }

  }
  setEmtyForm() {
    this.itemForm.controls["Title"].setValue("");
    this.itemForm.controls["Time"].setValue("");
    this.edit_time = this.itemForm.controls["Time"].value;
    this.List_Operators = [];
    this.loaddieukien();
  }

  check_ts() {
    this.edit_time = this.itemForm.controls["Time"].value;

    if (this.edit_id == 1) {
      if (this.edit_time == "@StartOfDay") {
        return true;
      }
      if (this.edit_time.includes("@StartOfDay('") && this.edit_time.includes("d')")) {
        this.edit = this.edit_time.split("'")[1];
        this.edit = this.edit.split("d")[0];
        const list = this.edit.split("-");
        if (list.length > 1) {
          this.check_date = true;
          this.edit = this.edit.split("-")[1];
        }
        else {
          this.check_date = false;
          this.edit = this.edit.split("-")[0];
        }
        return true;
      }
    }

    if (this.edit_id == 2) {
      // Start Thiên Code
      if (this.edit_time == "@StartOfWeek") {
        return true;
      }
      if (this.edit_time.includes("@StartOfWeek('") && this.edit_time.includes("w')")) {
        this.edit = this.edit_time.split("'")[1];
        this.edit = this.edit.split("w")[0];
        const list = this.edit.split("-");
        if (list.length > 1) {
          this.check_start_week = true;
          this.edit = this.edit.split("-")[1];
        }
        else {
          this.check_start_week = false;
          this.edit = this.edit.split("-")[0];
        }
        return true;
      }
      // End Thiên Code
    }
    if (this.edit_id == 3) {
      // Start Thiên Code
      if (this.edit_time == "@EndOfWeek") {
        return true;
      }
      if (this.edit_time.includes("@EndOfWeek('") && this.edit_time.includes("w')")) {
        this.edit = this.edit_time.split("'")[1];
        this.edit = this.edit.split("w")[0];
        const list = this.edit.split("-");
        if (list.length > 1) {
          this.check_end_week = true;
          this.edit = this.edit.split("-")[1];
        }
        else {
          this.check_end_week = false;
          this.edit = this.edit.split("-")[0];
        }
        return true;
      }
      // End Thiên Code
    }
    if (this.edit_id == 4) {
      if (this.edit_time == "@StartOfMonth") {
        return true;
      }
      if (this.edit_time.includes("@StartOfMonth('") && this.edit_time.includes("m')")) {
        this.edit = this.edit_time.split("'")[1];
        this.edit = this.edit.split("m")[0];
        const list = this.edit.split("-");
        if (list.length > 1) {
          this.check_date = true;
          this.edit = this.edit.split("-")[1];
        }
        else {
          this.check_date = false;
          this.edit = this.edit.split("-")[0];
        }
        return true;
      }


    }

    if (this.edit_id == 5) {
      if (this.edit_time == "@EndOfMonth") {
        return true;
      }
      if (this.edit_time.includes("@EndOfMonth('") && this.edit_time.includes("m')")) {
        this.edit = this.edit_time.split("'")[1];
        this.edit = this.edit.split("m")[0];
        const list = this.edit.split("-");
        if (list.length > 1) {
          this.check_date = true;
          this.edit = this.edit.split("-")[1];
        }
        else {
          this.check_date = false;
          this.edit = this.edit.split("-")[0];
        }
        return true;
      }

    }
    if (this.edit_id == 6) {
      if (this.edit_time == "@StartOfYear") {
        return true;
      }
      if (this.edit_time.includes("@StartOfYear('") && this.edit_time.includes("y')")) {
        this.edit = this.edit_time.split("'")[1];
        this.edit = this.edit.split("y")[0];
        const list = this.edit.split("-");
        if (list.length > 1) {
          this.check_date = true;
          this.edit = this.edit.split("-")[1];
        }
        else {
          this.check_date = false;
          this.edit = this.edit.split("-")[0];
        }
        return true;
      }

    }
    if (this.edit_id == 7) {
      if (this.edit_time == "@EndOfYear") {
        return true;
      }
      if (this.edit_time.includes("@EndOfYear('") && this.edit_time.includes("y')")) {
        this.edit = this.edit_time.split("'")[1];
        this.edit = this.edit.split("y")[0];
        const list = this.edit.split("-");
        if (list.length > 1) {
          this.check_date = true;
          this.edit = this.edit.split("-")[1];
        }
        else {
          this.check_date = false;
          this.edit = this.edit.split("-")[0];
        }
        return true;
      }
    }
    else {
      return false;
    }
  }

  convert_time() {
    const today = new Date();
    this.Date_ = today;
    // if (this.edit_id == 1) {
    //   this.Date_ = this.datepipe.transform(this.Date_, 'yyyy-MM-dd');
    // }
    if (this.edit_id == 1) {
      if (this.edit_time == "@StartOfDay") {
        this.Date_ = this.datepipe.transform(this.Date_, 'yyyy-MM-dd');
      }
      else if (this.check_date) {
        this.Date_ = new Date(today.getFullYear(), today.getMonth(), today.getDate() - Number(this.edit), 1)

      }
      else {
        this.Date_ = new Date(today.getFullYear(), today.getMonth(), today.getDate() + Number(this.edit), 1)

      }
      this.Date_ = this.datepipe.transform(this.Date_, 'yyyy-MM-dd');
    }

    // //đầu tuần này
    // if (this.edit_id == 2) {
    //   var startOfWeek = moment().startOf('isoWeeks').toDate();
    //   this.Date_ = this.datepipe.transform(startOfWeek, 'yyyy-MM-dd');

    // }
    // //cuối tuần này
    // if (this.edit_id == 3) {
    //   var endOfWeek = moment().endOf('isoWeeks').toDate();
    //   this.Date_ = this.datepipe.transform(endOfWeek, 'yyyy-MM-dd');

    // }

    //đầu tuần này
    if (this.edit_id == 2) {
      // Start Thiên Code
      var startOfWeek = moment().startOf('isoWeeks').toDate();
      if (this.edit_time == "@StartOfWeek") {
        this.Date_ = this.datepipe.transform(startOfWeek, 'yyyy-MM-dd');
      } else {
        if (this.check_start_week) {
          var S_Week = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() - Number(+this.edit * 7), 1)
          this.Date_ = this.datepipe.transform(S_Week, 'yyyy-MM-dd');
        }
        else {
          var S_Week = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + Number(+this.edit * 7), 1)
          this.Date_ = this.datepipe.transform(S_Week, 'yyyy-MM-dd');
        }
      }
      // End Thiên Code
    }

    //cuối tuần này
    if (this.edit_id == 3) {
      // Start Thiên Code
      var endOfWeek = moment().endOf('isoWeeks').toDate();
      if (this.edit_time == "@EndOfWeek") {
        this.Date_ = this.datepipe.transform(endOfWeek, 'yyyy-MM-dd');
      } else {
        if (this.check_end_week) {
          var E_Week = new Date(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate() - Number(+this.edit * 7), 1)
          this.Date_ = this.datepipe.transform(E_Week, 'yyyy-MM-dd');
        }
        else {
          var E_Week = new Date(endOfWeek.getFullYear(), endOfWeek.getMonth(), endOfWeek.getDate() + Number(+this.edit * 7), 1)
          this.Date_ = this.datepipe.transform(E_Week, 'yyyy-MM-dd');
        }
      }
      // End Thiên Code
    }

    //đầu tháng này
    if (this.edit_id == 4) {

      // var startOfMonth = moment().startOf('month').toDate();
      // this.Date_ = this.datepipe.transform(startOfMonth, 'yyyy-MM-dd');
      if (this.edit_time == "@StartOfMonth") {

        var startOfMonth = moment().startOf('month').toDate();
        this.Date_ = this.datepipe.transform(startOfMonth, 'yyyy-MM-dd');
      }
      else if (this.check_date) {
        var startOfMonth = moment().startOf('month').toDate();

        this.Date_ = new Date(today.getFullYear(), today.getMonth() - Number(this.edit), startOfMonth.getDate(), 1)



      }
      else {
        var startOfMonth = moment().startOf('month').toDate();

        this.Date_ = new Date(today.getFullYear(), today.getMonth() + Number(this.edit), startOfMonth.getDate(), 1)

      }
      this.Date_ = this.datepipe.transform(this.Date_, 'yyyy-MM-dd');
    }
    //cuối tháng này
    if (this.edit_id == 5) {


      if (this.edit_time == "@EndOfMonth") {

        var endOfMonth = moment().endOf('month').toDate();
        this.Date_ = this.datepipe.transform(endOfMonth, 'yyyy-MM-dd');
      }
      else if (this.check_date) {
        var day = new Date(today.getFullYear(), today.getMonth() - Number(this.edit), today.getDate(), 1)
        var year = day.getFullYear();
        var lastDay = this.daysInMonth(day.getFullYear(), day.getMonth() + 1);
        var endOfMonth = moment().endOf('month').toDate();
        //var DayInMonth=this.daysInMonth(today.getMonth() - Number(this.edit) + 1,today.getFullYear());
        //var month = today.getMonth();
        //var lastDay = this.getLastDayOfMonth(today.getMonth() - Number(this.edit) + 1);
        this.Date_ = year + '-' + (day.getMonth() + 1) + '-' + lastDay;



      }
      else {
        var day = new Date(today.getFullYear(), today.getMonth() + Number(this.edit) + 1, today.getDate(), 1)
        var lastDay = this.daysInMonth(day.getFullYear(), day.getMonth());

        var endOfMonth = moment().endOf('month').toDate();
        //var month = today.getMonth();
        //var lastDay = this.getLastDayOfMonth(today.getMonth() + Number(this.edit) + 1);
        this.Date_ = new Date(today.getFullYear(), today.getMonth() + Number(this.edit), lastDay, 1)

      }
      this.Date_ = this.datepipe.transform(this.Date_, 'yyyy-MM-dd');

    }
    //đầu năm này
    if (this.edit_id == 6) {


      if (this.edit_time == "@StartOfYear") {
        var startOfYear = moment().startOf('year').toDate();
        this.Date_ = this.datepipe.transform(startOfYear, 'yyyy-MM-dd');
      }
      else if (this.check_date) {
        var startOfYear = moment().startOf('year').toDate();
        this.Date_ = new Date(today.getFullYear() - Number(this.edit), startOfYear.getMonth(), startOfYear.getDate(), 1)

      }
      else {
        var startOfYear = moment().startOf('year').toDate();
        this.Date_ = new Date(today.getFullYear() + Number(this.edit), startOfYear.getMonth(), startOfYear.getDate(), 1)

      }
      this.Date_ = this.datepipe.transform(this.Date_, 'yyyy-MM-dd');

    }

    //cuối năm này
    if (this.edit_id == 7) {
      // var endOfYear = moment().endOf('year').toDate();
      // this.Date_ = this.datepipe.transform(endOfYear, 'yyyy-MM-dd');

      if (this.edit_time == "@EndOfYear") {
        var endOfYear = moment().endOf('year').toDate();
        this.Date_ = this.datepipe.transform(endOfYear, 'yyyy-MM-dd');
      }
      else if (this.check_date) {
        var endOfYear = moment().endOf('year').toDate();
        this.Date_ = new Date(today.getFullYear() - Number(this.edit), endOfYear.getMonth(), endOfYear.getDate(), 1)

      }
      else {
        var endOfYear = moment().endOf('year').toDate();
        this.Date_ = new Date(today.getFullYear() + Number(this.edit), endOfYear.getMonth(), endOfYear.getDate(), 1)

      }
      this.Date_ = this.datepipe.transform(this.Date_, 'yyyy-MM-dd');
    }
    this.changeDetectorRefs.detectChanges();
  }
  //   listDayByMonth = [
  //     { "month": 1, "day": 31 },
  //     { "month": 2, "day": 27 },
  //     { "month": 3, "day": 31 },
  //     { "month": 4, "day": 30 },
  //     { "month": 5, "day": 31 },
  //     { "month": 6, "day": 30 },
  //     { "month": 7, "day": 31 },
  //     { "month": 8, "day": 31 },
  //     { "month": 9, "day": 30 },
  //     { "month": 10, "day": 31 },
  //     { "month": 11, "day": 30 },
  //     { "month": 12, "day": 31 },
  // ];
  // getLastDayOfMonth(month){
  //   var result = 0;
  //   this.listDayByMonth.forEach(item => {
  //     if(month == item.month){
  //       result = item.day;
  //     }
  //   })
  //   return result;
  // }
  daysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

}
