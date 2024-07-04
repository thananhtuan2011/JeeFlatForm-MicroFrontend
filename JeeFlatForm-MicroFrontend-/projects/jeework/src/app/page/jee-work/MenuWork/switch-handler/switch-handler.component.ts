import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { DetailTaskModel } from '../../detail-task-component/detail-task-component.component';

@Component({
  selector: 'app-switch-handler',
  templateUrl: './switch-handler.component.html',
  styleUrls: ['./switch-handler.component.scss']
})
export class SwitchHandlerComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SwitchHandlerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _danhmucChungServices: DanhMucChungService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
  ) {
    if (data.w != undefined) {
      this.w = data.w;
    }
    this.dataDetailTask = data.dataDetailTask;
  }
  description_tiny: any;
  w: string = "0";
  reasons: any;
  _data: DetailTaskModel;
  TenNhiemVu: string = '';
  dataDetailTask: any;
  UserOld: any;
  UserNew: any;
  ngOnInit(): void {
    this._data = new DetailTaskModel();
    this._data.empty();
    this._data.id_project_team = this.dataDetailTask.id_project_team;
    this.getInfor(this.dataDetailTask);
  }
  isOld: boolean = false;
  getInfor(data_task) {
    let User;
    if (this.data.dataGiao) {
      User = this.data.dataGiao;
      if (Object.keys(User).length !== 0) {
        this._data.nguoiduocgiao = {
          hoten: User.hoten,
          tenchucdanh: User.tenchucdanh,
          username: User.username,
          image: User.image,
          id_nv: User.id_nv,
        };
      }
      this.UserOld = this.data.id_nv;
      this.UserNew = this._data.nguoiduocgiao.id_nv;
    }
    else {
      User = data_task.Users;
      if (User == undefined) {
        User = data_task.User
      }
      if (Object.keys(User).length !== 0) {
        this._data.nguoiduocgiao = {
          hoten: User.hoten,
          tenchucdanh: User.jobtitle,
          username: User.username,
          image: User.image,
          id_nv: User.id_nv,
        };
      }
      this.UserOld = this._data.nguoiduocgiao.id_nv;
    }
  }
  options_assign: any = {};
  ItemSelected(event: any, key) {
    // chọn item
    if (!this.CheckRule('assign')) {
      this.layoutUtilsService.showError(
        this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
      );
    }
    else {
      this._data.nguoiduocgiao = {
        hoten: event.hoten,
        tenchucdanh: event.tenchucdanh,
        username: event.username,
        image: event.image,
        id_nv: event.id_nv
      };
      this.UserNew = this._data.nguoiduocgiao.id_nv;
    }
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
  chonUser: boolean = false;
  RemoveAssign(id_nv) {
    this._data.nguoiduocgiao = {
      hoten: '',
      tenchucdanh: '',
      username: '',
      image: '',
    };
    this.UserNew = undefined;
  }
  isload: any;
  goBack() {
    this.dialogRef.close(this.isload);
  }
  requireAss: boolean = false;
  onSubmit(withBack: boolean = false, typeSave = 1) {
    let item = new ChangeAssigneeModel();
    item.Userid_assignee_new = this.UserNew;
    item.Userid_assignee_old = +this.UserOld > 0 ? this.UserOld : 0;
    item.note = this.reasons;
    item.title = this.dataDetailTask.title;
    item.taskid = this.dataDetailTask.id_row;
    item.projectid = this.dataDetailTask.id_project_team;
    this._danhmucChungServices.Change_Assignee(item).subscribe(res => {
      if (res && res.status == 1) {
        this.layoutUtilsService.showActionNotification(
          'Chuyển giao thành công',
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          'top',
          1
        );
        if (withBack == true) {
          this.dialogRef.close({
            _item: res.data,
          });
        }
      }
      else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          'top',
          0
        );
      }
    })

  }
  CheckRule(key)//key là langkey của rule, được cung cấp từ db
  {
    // console.log('=========================================ver---->',this._data);
    // if (this.dataDetailTask.IsAdmin == true) {
    //   return true; // nếu là admin thì có full quyền
    // }
    // switch (key) {
    //   case 'assign': {
    //     if (this.dataDetailTask.Rule.indexOf('4') !== -1) {
    //       return true; // Quyền giao công việc của người khác khi không phải là quản trị viên
    //     }
    //     return false;
    //   }
    //   default: {
    //     return false;
    //   }
    // }
    return true;
  }
  getMoreInformation(item): string {
    return item.hoten + ' - ' + item.username + ' \n ' + item.tenchucdanh;
  }
}
export class ChangeAssigneeModel {
  taskid: number;
  Userid_assignee_old: number;
  Userid_assignee_new: number;
  note: string;
  title: string;
  projectid: number;
  clear() {
    this.taskid = 0;
    this.Userid_assignee_old = 0;
    this.Userid_assignee_new = 0;
    this.note = '';
    this.title = '';
    this.projectid = 0;
  }
}
