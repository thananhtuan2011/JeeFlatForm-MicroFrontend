import { TranslateService } from '@ngx-translate/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { DOCUMENT, DatePipe } from '@angular/common';
import { Component, OnInit, Input, Inject, ChangeDetectorRef, EventEmitter, Output, AfterViewInit, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import * as moment from 'moment';
import { UserInfoModel, WorkModel } from '../jee-work.model';
import { WeWorkService } from '../jee-work.servide';
import { DialogSelectdayComponent } from '../dialog-selectday/dialog-selectday.component';
import { LayoutUtilsService, MessageType } from 'projects/jeework-v1/src/modules/crud/utils/layout-utils.service';
@Component({
  selector: 'kt-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss']
})
export class AddTaskComponent implements OnInit, AfterViewInit {

  @Input() ID_Project: number = 0;
  @Input() roleassign: boolean = true;
  @Input() rolefollower: boolean = true;
  @Input() roleprioritize: boolean = true;
  @Input() roledeadline: boolean = true;
  @Input() showIconclose: boolean = true;
  @Input() roleestimates: boolean = true;
  @Input() item: any = [];
  @Input() loai: any = [];
  @Output() Close = new EventEmitter();
  @Output() dataTask = new EventEmitter();
  @Input() type: string = "list";
  @Input() nhom: string = "status";
  title = "";
  status = 0;
  id_parent = 0;
  priority = 0
  id_nv_selected = 0
  id_group = 0;
  Tags: any = [];
  list_priority: any = [];
  isError = false;
  // @ViewChildren('input') vc;
  // @ViewChild('myInput', { static: true }) input: MatInput;
  @ViewChild("times", { static: false }) times: ElementRef;
  time: string = '';
  constructor(
    @Inject(DOCUMENT) private document: Document,// multi level
    private router: Router,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private translate: TranslateService,
    public datepipe: DatePipe,
    private weworkService: WeWorkService,
  ) {
    this.list_priority = this.weworkService.list_priority;
  }

  ngOnInit() {
    this.LoadData();
    // let input = document.getElementById("input");
    // if (input != null || input != undefined)
    //   setTimeout(function () { document.getElementById('input').focus(); }, 500);

  }
  ngAfterViewInit() {
    // var idname = "addnewtask";
    // let ele = (<HTMLInputElement>document.getElementById(idname));

    // setTimeout(() => {
    //   if (ele) {
    //     ele.focus();
    //   }
    // }, 10);
    // let input = document.getElementById("input");
    // if (input != null || input != undefined)
    //   setTimeout(function () { document.getElementById('input').focus(); }, 500);

  }

  OnChanges() {
    this.ngOnInit();
  }
  LoadData() {
    this.ResetData();
    if (this.loai == 'subtask') {
      this.id_parent = this.item.id_row;
      //========== Phong ================
      // Mặc định type = 1 để ra cv mới là mới tạo
      var lstStatusNew = this.item.DataStatus.filter(r => r.type == 1);
      this.status = lstStatusNew[0].statusid;
    }
    if (this.nhom == 'status') {
      if (this.loai == 'task') {
        this.status = this.item.id_row;
      }
    }
    else if (this.nhom == 'assignee') {
      if (this.loai == 'task') {
        this.id_nv_selected = this.item.id_row;
      }
      else {
        this.id_nv_selected = this.item.id_nv;
      }

    }
    else if (this.nhom == 'groupwork') {
      if (this.loai == 'task') {
        this.id_group = this.item.id_row;
      }
      else {
        this.id_group = this.item.id_group;
      }
    }
    this.LoadListAccount();
  }
  getAssignees() {
    return this.Assign;
  }
  getFollowers() {
    return this.Followers;
  }


  ResetData() {
    this.title = "";
    this.Assign = [];
    this.selectedDate = {
      startDate: '',
      endDate: '',
    }
    this.priority = 0;
    this.Tags = [];
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
  get_flag_color(val) {
    switch (val) {
      case 0:
        return 'grey-flag_list'; //không sét
      case 1:
        return 'red-flag_list'; //khẩn cấp
      case 2:
        return 'yellow-flag_list'; //cao
      case 3:
        return 'blue-flag_list'; //bình thường
      case 4:
        return 'low-flag_list'; //thấp
    }
  }

  taskinsert = new WorkModel();
  Assign: any = [];
  Followers: any = [];
  options_assign: any = [];

  CloseAddnewTask() {
    this.Close.emit(true);
  }

  listUser: any[];
  LoadListAccount() {

    const filter: any = {};
    // filter.key = 'id_project_team';
    // filter.value = this.ID_Project;
    filter.id_project_team = this.ID_Project;
    this.weworkService.list_account(filter).subscribe(res => {
      if (res && res.status === 1) {
        this.listUser = res.data;
        if (!this.roleassign) {
          this.id_nv_selected = +localStorage.getItem("idUser");
        }
        if (this.id_nv_selected > 0) {
          var x = this.listUser.find(x => x.id_nv == this.id_nv_selected)
          if (x) {
            this.Assign.push(x);
          }
        }
        this.changeDetectorRefs.detectChanges();
      };
      this.options_assign = this.getOptions_Assign();
    });
  }
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
  Selectdate() {
    const dialogRef = this.dialog.open(DialogSelectdayComponent, {
      width: '500px',
      data: this.selectedDate,
      panelClass: 'sky-padding-0'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        if (moment(result.startDate).format('MM/DD/YYYY') != "Invalid date")
          this.selectedDate.startDate = moment(this.selectedDate.startDate).format('MM/DD/YYYY');
        if (moment(result.endDate).format('MM/DD/YYYY') != "Invalid date") {
          this.selectedDate.endDate = moment(this.selectedDate.endDate).format('MM/DD/YYYY');
        }
      }
    });
  }

  ItemSelected(val: any, loai) {
    if (loai == 1) {
      var index = this.Assign.findIndex(x => x.id_nv == val.id_nv)
      if (index < 0) {
        this.Assign[0] = val;
      } else {
        this.Assign.splice(index, 1);
      }
    }
    else {
      var index = this.Followers.findIndex(x => x.id_nv == val.id_nv)
      if (index < 0) {
        this.Followers.push(val);
      } else {
        this.Followers.splice(index, 1);
      }
    }
  }
  viewdate() {
    if (this.selectedDate.startDate == '' && this.selectedDate.endDate == '') {
      return this.translate.instant('work.chonthoigian')
    }
    else {
      var start = this.f_convertDate(this.selectedDate.startDate) ? this.f_convertDate(this.selectedDate.startDate) : '...';
      var end = this.f_convertDate(this.selectedDate.endDate) ? this.f_convertDate(this.selectedDate.endDate) : '...';
      return 'Ngày bắt đầu: ' + start + ' - ' + 'Deadline: ' + end
    }
  }
  f_convertDate(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return ("0" + (a.getDate())).slice(-2) + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + a.getFullYear();
    }
  }

  AssignInsert(id_nv, loai) {
    var NV = new UserInfoModel();
    NV.id_user = id_nv;
    NV.loai = loai;
    return NV;
  }
  AddTask() {
    if (this.title == '') {
      this.isError = true;
      this.layoutUtilsService.showActionNotification("Tên công việc không được bỏ trống", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
      return;
    }
    var task = new WorkModel();
    // task = this.taskinsert;
    task.status = this.status;
    task.title = this.title;
    task.id_project_team = this.ID_Project;
    task.id_parent = this.id_parent;
    task.urgent = this.priority;
    task.Users = [];
    task.id_group = this.id_group;
    this.Assign.forEach(element => {
      var assign = this.AssignInsert(element.id_nv, 1);
      task.Users.push(assign);
    });
    this.changeDetectorRefs.detectChanges();
    this.Followers.forEach(element => {
      var follower = this.AssignInsert(element.id_nv, 2);
      task.Users.push(follower);
    });
    task.estimates = this.time;
    //  const start = moment()
    const start = moment();
    if (moment(this.selectedDate.startDate).format('MM/DD/YYYY') != "Invalid date")
      task.start_date = moment(this.selectedDate.startDate).utc().format('MM/DD/YYYY HH:mm:ss');
    if (moment(this.selectedDate.endDate).format('MM/DD/YYYY') != "Invalid date") {
      task.deadline = moment(this.selectedDate.endDate).utc().format('MM/DD/YYYY HH:mm:ss');
    }
    this.dataTask.emit(task);

  }

  submitOut() {
    if (this.times.nativeElement.value) {
      this.time = this.times.nativeElement.value;
    }
  }
}
