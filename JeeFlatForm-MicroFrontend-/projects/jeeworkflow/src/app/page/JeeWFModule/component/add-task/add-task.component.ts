
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT, DatePipe } from '@angular/common';
import { Component, OnInit, Input, Inject, ChangeDetectorRef, EventEmitter, Output, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { JeeChooseMemberComponent } from '../jee-choose-member/jee-choose-member.component';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { ProcessWorkService } from '../../../services/process-work.service';
import { ToDoDataModel } from '../../../models/jee-work.model';
@Component({
  selector: 'kt-add-task-wf',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit, AfterViewInit {

  @Input() roleassign: boolean = true;
  @Input() rolefollower: boolean = true;
  @Input() roleprioritize: boolean = true;
  @Input() roledeadline: boolean = true;
  @Input() showIconclose: boolean = true;
  @Input() showtime: boolean = true;
  @Input() item: any = [];
  @Input() loai: any = [];
  @Output() Close = new EventEmitter();
  @Output() dataTask = new EventEmitter();
  @Input() type: string = "list";
  @Input() nhom: string = "status";
  disabledBtn: boolean = false;
  title = "";
  status = 0;
  priority = 0
  list_priority: any = [
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
  isError = false;
  //==================================================
  @Input() NodeID: string;
  @Input() showSave: boolean = false;
  ListNguoiThucHien: any[] = [];
  ListNguoiTheoDoi: any[] = [];
  @ViewChild("times", { static: false }) times: ElementRef;
  time: string = '';
  @Output() close = new EventEmitter<any>();
  constructor(
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    public datepipe: DatePipe,
    private _ProcessWorkService: ProcessWorkService,
  ) {

  }

  ngOnInit() {

  }

  ngAfterViewInit() {

  }

  getPriority(id) {
    if (id > 0) {
      var item = this.list_priority.find(x => x.value == id)
      if (item)
        return item.icon;
      return 'far fa-flag';
    } else {
      return 'far fa-flag'
    }
  }

  CloseAddnewTask() {
    this.Close.emit(true);
  }

  listUser: any[];

  stopPropagation(event) {
    event.stopPropagation();
  }

  getOptions_Assign() {
    var options_assign: any = {
      showSearch: true,
      keyword: '',
      data: this.listUser,
    };
    return options_assign;
  }

  selectedDate: any = {
    startDate: '',
    endDate: '',
  };

  f_convertDate(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return ("0" + (a.getDate())).slice(-2) + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + a.getFullYear();
    }
  }

  AddNguoiThucHien() {
    let _item = [];
    this.ListNguoiThucHien.map((item, index) => {
      _item.push('' + item.ObjectID);
    });
    const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item }, panelClass: ['sky-padding-0', 'choose_member'] });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      if (res.data.length > 0) {
        this.ListNguoiThucHien = [];
        res.data.map((item, index) => {
          let data = {
            ObjectID: item.UserId,
            ObjectName: item.FullName,
            FirstName: item.FirstName,
            AvartarImgURL: item.AvartarImgURL,
            Jobtitle: item.Jobtitle,

          }
          this.ListNguoiThucHien.push(data);
        })
      } else {
        this.ListNguoiThucHien = [];
      }
      this.changeDetectorRefs.detectChanges();
    });
  }

  AddNguoiTheoDoi() {
    let _item = [];
    this.ListNguoiTheoDoi.map((item, index) => {
      _item.push('' + item.ObjectID);
    });
    const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item }, panelClass: ['sky-padding-0', 'choose_member']  });
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

  submitOut() {
    this.time = this.times.nativeElement.value;
  }

  AddTask() {
    const updatedegree = this.prepareCustomer();
    if(updatedegree.TaskName == ""){
      let message = "Tên công việc không được bỏ trống";
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			return;
    }
    if (this.ListNguoiThucHien.length == 0) {
      let message = 'Vui lòng chọn người thực hiện công việc';
      this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
      return;
  }
    this.Create(updatedegree);
  }

  prepareCustomer(): ToDoDataModel {

    const _item = new ToDoDataModel();
    _item.RowID = 0;
    _item.NodeID = +this.NodeID;
    _item.TaskName = this.title;
    _item.Time_Type = "1";
    _item.NumberofTime = this.time != "" ? this.time : '0';

    //============Xử lý cho phần lưu người thực hiện============
    let dataThucHien = [];
    if (this.ListNguoiThucHien.length > 0) {
      this.ListNguoiThucHien.map((item, index) => {
        let dt = {
          ObjectID: item.ObjectID,
          ObjectType: "3",
        }
        dataThucHien.push(dt);
      });
    }
    _item.Data_Implementer = dataThucHien;

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
    _item.Data_Follower = dataTheoDoi;

    _item.Description = "";
    return _item;
  }

  Create(_item: ToDoDataModel) {
    this.disabledBtn = true;
    this._ProcessWorkService.updateToDo(_item).subscribe(res => {
      this.disabledBtn = false;
      this.changeDetectorRefs.detectChanges();
      if (res && res.status === 1) {
        this.title = "";
        this.time = "";
        this.ListNguoiThucHien = [];
        this.ListNguoiTheoDoi = [];
        this.close.emit();
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
      }
    });
  }
}
