import { catchError, finalize, share, tap } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { QueryParamsModelNew } from '../models/query-models/query-params.model';
import { DanhMucChungService } from '../services/danhmuc.service';
import moment from 'moment';
import { TimezonePipe } from '../pipe/timezone.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuWorkService } from '../MenuWork/services/menu-work.services';
import { formatDate } from '@angular/common';
import { CongViecTheoDuAnChartComponent } from '../MenuWork/cong-viec-theo-du-an-chart/cong-viec-theo-du-an-chart.component';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { PageWorkDetailStore } from '../services/page-work-detail.store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { ThemMoiCongViecComponent } from '../MenuWork/them-moi-cong-viec/them-moi-cong-viec.component';
import { EditorJeeWorkComponent } from '../MenuWork/editor-jeework/editor-jeework';
import { BaseModel } from '../models/_base.model';
import { Location } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ThemMoiCongViecKhongVanBanComponent } from '../MenuWork/them-moi-cong-viec-khong-van-ban/them-moi-cong-viec-khong-van-ban.component';
import { SocketioService } from '../services/socketio.service';
import { formats, quillConfig } from '../editor/Quill_config';
import { ThemMoiCongViecVer2Component } from '../MenuWork/them-moi-cong-viec-ver2/them-moi-cong-viec-ver2.component';
import { CongViecTuChoiHistoryComponent } from '../MenuWork/cong-viec-tu-choi-history/cong-viec-tu-choi-history.component';
import { ChuyenXuLyNhiemVuComponent } from '../MenuWork/chuyen-xu-ly-nhiem-vu/chuyen-xu-ly-nhiem-vu.component';
import { SwitchHandlerComponent } from '../MenuWork/switch-handler/switch-handler.component';
import { LogWorkDescriptionComponent } from '../MenuWork/log-work-description/log-work-description.component';
import { StatusAttachedComponent } from '../MenuWork/status-attched/status-attached.component';
import { FormatTimeService } from '../services/jee-format-time.component';
import { WorkResultDialogComponent } from '../MenuWork/update-workresult-editor/update-workresult-editor.component';
import { UploadFileService } from '../service-upload-files/service-upload-files.service';
@Component({
  selector: 'app-detail-task-component',
  templateUrl: './detail-task-component.component.html',
  styleUrls: ['./detail-task-component.component.scss'],
})
export class DetailTaskComponentComponent implements OnInit {
  quillConfig = quillConfig;
  formats = formats;
  editorStyles = {
    height: '200px',
    'font-size': '12pt',
    'overflow-y': 'auto',
    border: '1px solid #ccc',
    'border-bottom-right-radius': '4px',
    'border-bottom-left-radius': '4px',
  };
  options_assign: any = {};
  id_task: any;
  status: any;
  User: any;
  title: string = '';
  clickup_prioritize = 0;
  _data: DetailTaskModel;
  date: Date = new Date();
  selectedMoment = new Date();
  list_priority = [];
  // date :any = '';
  param: any[];
  _chinhsua: boolean = false;
  _listTags = [];
  _old_desreption: string;
  is_confirm: boolean;
  LogDetail: any = [];
  dataDetailTask: any;
  topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>('');
  _showIconChangeDeadline: boolean;
  listCongViecCon: any;
  soNhiemVuCon: any;
  listCongViecLienQuan: any;
  id_row: any;
  isPopup: any;
  oldDeadline: any;
  isgov: boolean;
  Id_project_team: string;
  item: any;
  isUpdate: boolean = false;
  isProgress: boolean = false;
  sttType: any;
  data_progress: any;
  editTitle: boolean = false;
  oldstartdate: any;
  //abc
  //======Đơn vị phối hợp=============
  titleDonViPhoiHop: string = '';

  constructor(
    @Optional() public dialogRef: MatDialogRef<DetailTaskComponentComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any,
    public _danhmucChungServices: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    private pipetimezone: TimezonePipe,
    private route: ActivatedRoute,
    private _menuWorkServices: MenuWorkService,
    public dialog: MatDialog,
    public store: PageWorkDetailStore,
    // private layoutUtilsService: LayoutUtilsService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private router: Router,
    private location: Location,
    private sanitizer: DomSanitizer,
    private socketioService: SocketioService,
    public DanhMucChungService: DanhMucChungService,
    public _FormatTimeService: FormatTimeService,
    private _UploadFileService: UploadFileService,
  ) {
    if (data) {
      this.id_row = data.id_row;
      if (data.isPopup) {
        this.isPopup = data.isPopup;
      } else {
        this.isPopup = false;
      }

    }
    this.dataDetailTask = { Tags: [] };
  }

  ngOnInit(): void {
    this._danhmucChungServices.getthamso();
    this.list_priority = this._danhmucChungServices.list_priority;

    if (this.id_row) {
      this.id_task = this.id_row;
    } else {
      this.param = window.location.href.split('/');
      this.id_task = this.param[this.param.length - 1];
    }
    this.listCongViecCon = [];
    this.listCongViecLienQuan = [];
    this.soNhiemVuCon = 0;
    this._data = new DetailTaskModel();
    this._data.empty();
    this.get_data();
    this.LoadProgress();
    this.LoadCongViecLienQuan();
    //=====Bổ sung call api đánh dâu xem công việc 05/07/2023
    this.CheckViewWork();
  }
  changeTitle() {
    this.editTitle = this.CheckRule('title');
    this.changeDetectorRefs.detectChanges()
  }
  UpdateTitle(event) {
    //Lưu cập nhật tên công việc
    const ele = event.target;
    if (ele.value.toString().trim() == '') {
      ele.value = this._data.title;
      return;
    }
    if (ele.value.toString().trim() != this._data.title.toString().trim()) {
      this._data.title = ele.value;
      this.update('title', this._data.title);
      this.editTitle = false;
    }
  }
  checkAddCVCD() {
    if (!this.CheckRule('createchart')) {
      return false;
    }
    return true;
  }
  checkIsComplete() {
    if (this.dataDetailTask && this.dataDetailTask.StatusInfo != undefined && this.dataDetailTask.StatusInfo.length > 0) {
      return this.dataDetailTask.StatusInfo[0].type != 4;
    }
    return false;
  }
  AddCongViecCapDuoi() {
    const dialogRef = this.dialog.open(ThemMoiCongViecComponent, {
      width: '70vw',
    });
    dialogRef.afterClosed().subscribe((res) => {
      return;
    });
  }
  LoadCongViecCapDuoi() {
    this._danhmucChungServices.getCongViecCon(this.id_task).subscribe((res) => {
      if (res) {
        if (res.status == 1) {
          this.listCongViecCon = res.data;
          this.getDataStatusById(this.listCongViecCon);
          this.soNhiemVuCon = this.listCongViecCon.length;
        }
      }
    });
  }
  LoadProgress() {
    this._menuWorkServices.FlowProgress(this.id_task).subscribe(res => {
      if (res && res.status == 1) {
        if (res.data && res.data.length > 0) {
          this.data_progress = res.data;
        }
      } else {
        this.data_progress = [];
      }
      this.changeDetectorRefs.detectChanges();
    });
  }
  getCssprogress(index) {
    if (index == 0) {
      return 'first-progress';
    }
    return '';
  }
  loadTaskChild() {
    const queryParams = new QueryParamsModelNew({});
    queryParams.filter.id_project_team = this.Id_project_team;
    queryParams.filter.taskid = this.id_task;
    queryParams.filter.groupid = 0;
    queryParams.more = true;
    this._danhmucChungServices.LoadTaskChild(queryParams).subscribe((res) => {
      if (res && res.status == 1) {
        this.listCongViecCon = res.data;
        this.getDataStatusById(this.listCongViecCon);
        this.changeDetectorRefs.detectChanges();
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  LoadCongViecLienQuan() {
    this._danhmucChungServices.getCongViecLienQuan(this.id_task).subscribe((res) => {

      if (res) {
        if (res.status == 1) {
          this.listCongViecLienQuan = res.data;
          this.getDataStatusById(this.listCongViecLienQuan);
        }
      }
    });
  }
  formatdatedate(val) {
    if (val == null || val == undefined) return '';
    let a = moment(val, ['HH:mm DD/MM/YYYY']).format('HH:mm DD/MM/YYYY');
    if (a == 'Invalid date') {
      a = moment(val).format('HH:mm DD/MM/YYYY');
    }
    let splitted;
    if (a == 'Invalid date') {
      splitted = val.split(' ', 2);
    } else {
      let b = a.split(' ', 3);
      return b[1];
    }
    return splitted[1];
  }

  themMoiNhiemVu() {
    var data = null; //call api
    this.openModal(
      'Title1',
      'Message Test',
      () => {
        //confirmed
        console.log('Yes');
      },
      () => {
        //not confirmed
        console.log('No');
      }
    );
  }
  openModal(
    title: string,
    message: string,
    yes: Function = null,
    no: Function = null
  ) {
    if (!this.CheckRule('createchart')) {
      this.layoutUtilsService.showError(
        this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
      );
      return false;
    }
    const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      title: title,
      message: message,
      dataDetailTask: this.dataDetailTask,
    };
    dialogConfig.width = '40vw';
    let item;
    if (this.isgov) {
      item = ThemMoiCongViecComponent;
    } else {
      item = ThemMoiCongViecKhongVanBanComponent;
    }
    const dialogRef = this.dialog.open(item, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.ngOnInit();
      }
    });
  }

  LoadObjectID() {
    this.topicObjectID$.next('');
    if (this.getComponentName()) {
      this._menuWorkServices
        .getTopicObjectIDByComponentName(this.getComponentName())
        .pipe(
          tap((res) => {
            this.topicObjectID$.next(res);
          }),
          catchError((err) => {
            return of();
          }),
          finalize(() => { }),
          share()
        )
        .subscribe();
      this.changeDetectorRefs.detectChanges();
    }
  }
  private readonly componentName: string = 'kt-task_';
  getComponentName() {
    if (this.id_task) {
      return this.componentName + this.id_task;
    } else {
      return '';
    }
  }
  CountComment() {
    this.store.updateEvent = false;
    this.store.updateEvent = true;
  }

  XemLuongNhiemVu() {
    const dialogRef = this.dialog.open(CongViecTheoDuAnChartComponent, {
      data: { _id: this.id_task },
      panelClass: ['sky-padding-0', 'width70'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }

  XemLuongTienDo() {
    const dialogRef = this.dialog.open(CongViecTheoDuAnChartComponent, {
      data: { _id: this.id_task, _type: 2 },
      panelClass: ['sky-padding-0', 'width70'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }

  XemTuChoi() {
    const dialogRef = this.dialog.open(CongViecTuChoiHistoryComponent, {
      data: { _id: this.id_task },
      panelClass: ['sky-padding-0', 'width60'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
    });
  }

  RemoveAssign(id_nv) {
    this._data.nguoiduocgiao = {
      hoten: '',
      tenchucdanh: '',
      username: '',
      image: '',
    };
    this.update('assign', id_nv);
  }
  Selected_Assign(id_nv) {
    this.update('follower', id_nv);
    // let t;
    // if (t) {
    //   let index = this._data.Followers.findIndex(x => x.id_nv == id_nv);
    //   this._data.Followers.splice(index, 1);
    //   this.changeDetectorRefs.detectChanges();

    // }; // nếu đã tồn tại flwer thì gọi lại hàm upd sẽ xóa flw đó
  }
  getoptions_assign(val) {
    this.DanhMucChungService.gov_account_follower_by_project(val).subscribe((res) => {
      if (res && res.status == 1) {
        this.options_assign = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
  ItemSelected(event: any, key) {
    // chọn item
    if (key == 'nguoitheodoi') {
      let index = this._data.Followers.findIndex((x) => x.id_nv == event.id_nv);
      if (index == -1) {
        this.update('follower', event.id_nv);
        // this._data.Followers.push(event);
        // }
      }
    } else if (key == 'nguoiduocgiao') {
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
        this.update('assign', event.id_nv);
      }

    }
  }

  CheckRule(key)//key là langkey của rule, được cung cấp từ db
  {
    // console.log('=========================================ver---->',this._data);
    if (this._data.IsAdmin == true) {
      return true; // nếu là admin thì có full quyền
    }
    switch (key) {
      case 'create': {
        if (this._data.Rule.indexOf('1') !== -1) {
          return true;// Tạo nhiệm vụ
        }
        return false;
      }
      case 'createchart': {
        if (this._data.Rule.indexOf('16') !== -1) {
          return true;// Tạo nhiệm vụ cấp dưới
        }
        return false;
      }
      case 'progress': {
        if (this._data.Rule.indexOf('15') !== -1) {
          return true;// Chỉnh sửa Tiến độ
        }
        return false;
      }
      case 'giaoviec': {
        if (this._data.Rule.indexOf('3') !== -1) {
          return true; // Xem chi tiết nhiệm vụ
        }
        return false;
      }
      case 'viewTaskNotAdmin': {
        if (this._data.Rule.indexOf('3') !== -1) {
          return true; // Xem chi tiết nhiệm vụ
        }
        return false;
      }
      case 'assign': {
        if (this._data.Rule.indexOf('4') !== -1) {
          return true; // Quyền giao công việc của người khác khi không phải là quản trị viên
        }
        return false;
      }
      case 'title': {
        if (this._data.Rule.indexOf('7') !== -1) {
          return true; // Chỉnh sửa tên công việc
        }
        return false;
      }
      case 'description': {
        if (this._data.Rule.indexOf('9') !== -1) {
          return true; // Quyền chỉnh sửa mô tả công việc
        }
        return false;
      }
      case 'deadline': {
        if (this._data.Rule.indexOf('10') !== -1) {
          return true; // Quyền chỉnh sửa thời gian (Ngày bắt đầu và hạn chót) của công việc
        }
        return false;
      }
      // case 'status': {
      //   if (this._data.Rule.indexOf('11') !== -1) {
      //     return true; // Quyền cập nhật trạng thái công việc
      //   }
      //   return false;
      // }
      case 'checklist': {
        if (this._data.Rule.indexOf('12') !== -1) {
          return true; // Quyền tạo và cập nhật checklist
        }
        return false;
      }
      case 'delete': {
        if (this._data.Rule.indexOf('13') !== -1) {
          return true; // Quyền xóa công việc
        }
        return false;
      }
      case 'follower': {
        if (this._data.Rule.indexOf('14') !== -1) {
          return true; // Quyền chọn người theo dõi vào công việc
        }
        return false;
      }
      case 'estimates': {
        if (this._data.Rule.indexOf('19') !== -1) {
          return true; // Quyền cập nhật thời gian dự kiến công việc
        }
        return false;
      }
      case 'Tags': {
        if (this._data.Rule.indexOf('20') !== -1) {
          return true; // Quyền cập nhật thời gian dự kiến công việc
        }
        return false;
      }
      case 'id_group': {
        if (this._data.Rule.indexOf('21') !== -1) {
          return true; // Quyền cập nhật nhóm công việc
        }
        return false;
      }
      case 'closed': {
        if (this._data.Rule.indexOf('22') !== -1) {
          return true; // Quyền đóng công việc
        }
        return false;
      }
      case 'update_storage': {
        if (this._data.Rule.indexOf('23') !== -1) {
          return true; //Quyền cập nhật lưu trữ công việc
        }
        return false;
      }
      case 'Attachments': {
        if (this._data.Rule.indexOf('6') !== -1) {
          return true; // Quyền đính kèm tài liệu
        }
        return false;
      }
      case 'Attachments_result': {
        if (this._data.Rule.indexOf('24') !== -1) {
          return true; // Quyền thay đổi cập nhật kết quả
        }
        return false;
      }
      case 'result': {
        if (this._data.Rule.indexOf('24') !== -1) {
          return true; // Quyền thay đổi cập nhật kết quả
        }

        return false;
      }
      case 'clickup_prioritize': {
        if (this._data.Rule.indexOf('25') !== -1) {
          return true; // Quyền thay đổi cập nhật kết quả
        }

        return false;
      }
      default: {
        return false;
      }
    }
  }
  checkRuleUserOfChildNotUse(key, item) {
    if (item.IsAdmin == true) {
      return true; // nếu là admin thì có full quyền
    }
    /* #region các quyền đặc biêt */
    // if (item.Rule.indexOf('15') !== -1) {
    //   return false; // không cho phép người được giao chỉnh sửa cách thông tin liên quan đến công việc
    // }
    // if (item.Rule.indexOf('16') !== -1 && key == 'deadline') {
    //   return false; // không cho phép người được giao chỉnh sửa hạn chót công việc
    // }
    // if (item.Rule.indexOf('17') !== -1 && key == 'assign') {
    //   return false; // không cho phép người được giao xóa công việc hoặc chuyển giao cho người khác
    // }
    /* #endregion */

    let id_rule = item.Rule.filter((x) => x.key.includes(key));
    if (id_rule.length == 0) {
      return true; // không xết quyền
    }

    if (item.Rule.indexOf(id_rule[0].value) !== -1) {
      return true; // có quyền thay đổi
    }

    return false; // không có quyền thay đổi
  }
  Dinhkemketqua(val) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = false;
    const dialogRef = this.dialog.open(StatusAttachedComponent, {
      data: {
        id_task: this.id_task,
        value: val,
        isProgress: this.CheckRule('Attachments_result'), type: this.sttType,
        ketqua: 'status',
      },
      width: '55%',
      panelClass: ['editorstt-v2']
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.get_data();
    });
  }
  updateReason(val) {
    const dialogRef = this.dialog.open(EditorJeeWorkComponent, {
      data: { _value: this._data['status'], statusname: val.statusname },
      width: '55%',
      maxHeight: '60%',
      panelClass: ['editor-v2']
    });
    dialogRef.componentInstance.is_status = true;
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      let item = new UpdateModel();
      item.ReasonRefuse = res._result
      item.id_row = val.id_row
      this.update('status', item);
    });
  }
  update(key: string, val, reload: boolean = false): boolean {
    if (!this.CheckRule(key) && key != 'status') {
      this.layoutUtilsService.showError(
        this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
      );
      this.get_data();
      return false;
    }
    if (key == "status" && val.isRefuse == 1) {
      this.updateReason(val);
      return false;
    }
    if (key == "status" && val.id_row == this._data.status.id_row) {
      return false;
    }
    if (key == "status" && val.isAttachment == 1) {
      this.Dinhkemketqua(val);
      return false;
    }
    // if (key == "status" && val.isAttachment == 1 && this._data.result == "" && this._data.Attachments_Result.length == 0) {
    //   this.layoutUtilsService.showError(
    //     this.translate.instant('work.vuilongdinhkemketqua')
    //   );
    // }

    let model = new UpdateModel();
    model.emty();
    model.key = key;
    model.id_row = this.id_task;
    // model.value = val;

    switch (key) {
      case 'status': {
        model.value = val.id_row;
        model.ReasonRefuse = val.ReasonRefuse;
        break;
      }
      case 'clickup_prioritize':
      case 'result':

      case 'deadline':
      case 'start_date':
      case 'title':
      case 'progress':
      case 'description': {
        model.value = val;
        break;
      }
      case 'estimates':
      case 'Tags':
      case 'assign':
      case 'follower': {
        model.value = val;
        reload = true;
        break;
      }
      case 'Attachments':
      case 'Attachments_result': {
        reload = true;
        model.values = val;
        break;
      }
    }
    this._danhmucChungServices.updateTask(model).subscribe((res) => {
      if (res) {
        if (res.status == 1) {
          this.isUpdate = true;
          switch (key) {
            case 'progress': {
              this._data.progress = val;
              this.getDataTienDo();
              break;
            }
            case 'status': {
              this._data.status = val;
              this.getDataStatus();
              this.get_data();
              break;
            }
            case 'clickup_prioritize': {
              this.clickup_prioritize = val;
              this.dataDetailTask.clickup_prioritize = val;
              this._danhmucChungServices.send$.next('LoadMenu');
              this.getDataHoatDong();
              break;
            }
            case 'description': {
              this._chinhsua = false;
              break;
            }
            case 'result': {
              this._data.result = val;
              break;
            }
            case 'deadline':
            case 'start_date': {
              this._danhmucChungServices.send$.next('LoadMenu');
              break;
            }
          }

          if (reload) {
            this.get_data(); //chỉ reload lại data khi nào cần
          }

          // this.layoutUtilsService.showActionNotification(
          //   "Thay đổi thành công",
          //   MessageType.Update,
          //   10000,
          //   true,
          //   false
          // );
          this.LoadObjectID();
          this.changeDetectorRefs.detectChanges();
        } else {
          if (key == 'deadline') {
            this._data.deadline = this.oldDeadline;
            this.changeDetectorRefs.detectChanges();
          }
          if (key == 'start_date') {
            this._data.start_date = this.oldstartdate;
            this.changeDetectorRefs.detectChanges();
          }
          this.layoutUtilsService.showError(res.error.message);
        }
      }

      // them thon bao khi loi res
    });
    // return true;
  }
  ThemTaiLieu(val, type = 1) {
    if (type == 1) {
      if (!this.CheckRule('Attachments')) {
        this.layoutUtilsService.showError(
          this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
        );
        return false;
      }
    }
    else {
      if (!this.CheckRule('Attachments_result')) {
        this.layoutUtilsService.showError(
          this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
        );
        return false;
      }
    }
    val.click();
  }
  get_data() {
    this._danhmucChungServices
      .get_Detail_Task(this.id_task)
      .subscribe((res) => {
        if (res) {
          if (res.status == 1) {
            this.dataDetailTask = res.data[0];
            let data_task = res.data[0];
            this._data.id_project_team = data_task.id_project_team;
            this.Id_project_team = this._data.id_project_team;
            this._data.title = data_task.title;
            this._data.nguoitao.hoten = data_task.createdby.hoten;
            this._data.nguoitao.department = data_task.createdby.department;
            this._data.nguoitao.jobtitle = data_task.createdby.jobtitle;
            this._data.createddate = data_task.createddate;
            this._data.estimates = data_task.estimates;
            this._data.TaskView = data_task.TaskView;

            let status = data_task.StatusInfo[0];
            this.sttType = status.Type;
            this._data.status.color = status.color;
            this._data.status.statusname = status.statusname;
            this._data.status.id_row = status.id_row;
            if (data_task.progress != null) {
              this._data.progress = data_task.progress;
            }
            this._data.Attachments = data_task.Attachments;
            this._data.Rule = data_task.Rule;
            let User = data_task.Users;
            if (Object.keys(User).length !== 0) {
              this._data.nguoiduocgiao = {
                hoten: User.hoten,
                tenchucdanh: User.jobtitle,
                username: User.username,
                image: User.image,
                id_nv: User.id_nv,
              };
            }

            this._data.Tags = data_task.Tags;

            this._data.Followers = data_task.Followers;

            this._data.isgov = res.isgov;
            this.isgov = this._data.isgov;
            if (this._data.isgov) {
              this._data.Gov_NgayVB = data_task.Gov_NgayVB != null ? new Date(data_task.Gov_NgayVB) : null;
              this._data.Gov_SoHieuVB = data_task.Gov_SoHieuVB;
              this._data.Gov_TrichYeuVB = data_task.Gov_TrichYeuVB;
              this._data.nguoigiao = data_task.nguoigiao;
              this._data.Gov_Nguoiky = data_task.Gov_Nguoiky;
              this._data.Gov_Donvibanhanh = data_task.Gov_Donvibanhanh;
            }
            this._data.closed = data_task.closed;
            this._data.result = data_task.result;
            this._data.IsAdmin = data_task.IsAdmin;

            if (data_task.start_date != null && data_task.start_date != "") {
              let t1 = data_task.start_date.split(' ');
              let d1 =
                this.pipetimezone.transform(t1[1], 'YYYY-MM-DD') +
                'T' +
                this.pipetimezone.transform(t1[0], 'HH:mm:ss');
              this._data.start_date = moment(d1).toDate();
            }
            this.oldstartdate = this._data.deadline;
            if (data_task.deadline != null && data_task.deadline != "") {
              let t = data_task.deadline.split(' ');
              let d =
                this.pipetimezone.transform(t[1], 'YYYY-MM-DD') +
                'T' +
                this.pipetimezone.transform(t[0], 'HH:mm:ss');
              this._data.deadline = moment(d).toDate();
            }
            this.oldDeadline = this._data.deadline;
            if (data_task.description == null) {
              data_task.description = "";
            }
            this._data.description = data_task.description;
            this._old_desreption = data_task.description;

            this._data.id_project_team = data_task.id_project_team;

            // this.date = this.pipetimezone.transform(this.value,'YYYY-MM-DD')+'T'+this.pipetimezone.transform(this.value,'HH:mm:ss');

            this._data.Attachments_Result = data_task.Attachments_Result;

            // this._data.DataStatus = data_task.DataStatus;
            this.title = data_task.title;
            this.clickup_prioritize = data_task.clickup_prioritize;
            if (this.isgov) {
              this.LoadCongViecCapDuoi();
            } else {
              this.loadTaskChild();
            }
            this.getDataStatus();
            this.getListTags();
            this.getDataHoatDong();
            this.getDataTienDo();

            this._showIconChangeDeadline = this.CheckRule('deadline');

            //=================Bổ sung cập nhật đanh dấu isnewchange - 05/07/2023=============
            if (data_task.isnewchange) {
              this.updateReadItem();
            }
            //================Bổ sung thông tin đơn vị phối hợp nếu có - 08-09-2023============
            let _title = '';
            if (data_task.Combinations != undefined) {
              data_task.Combinations.forEach(element => {
                _title += ", " + element.Title;
              });
              this.titleDonViPhoiHop = _title.substring(1);

              this.changeDetectorRefs.detectChanges();
            }
            this.LoadObjectID();
          } else {
            this.layoutUtilsService.showError(
              res.error.message
            );
            this.onclickReturn();
          }
        }
      });
  }
  getDataStatus() {
    this._danhmucChungServices
      .listTinhTrangDuAn(this._data.id_project_team, this.id_task)
      .subscribe((res) => {
        if (res.status == 1) {
          this._data.DataStatus = res.data;
          this.changeDetectorRefs.detectChanges();
        }
      });
  }
  getDataTienDo() {
    this._danhmucChungServices.listTienDo(0, 0).subscribe(res => {
      if (res.status == 1) {
        this._data.DataProgress = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  changeProgressName(item) {

  }
  getDataStatusById(listCongViec) {
    for (let index = 0; index < listCongViec.length; index++) {
      const element = listCongViec[index];
      element.statusList = [];
      this._danhmucChungServices
        .listTinhTrangDuAn(element.id_project_team, element.id_row)
        .subscribe((res) => {
          if (res.status == 1) {
            element.statusList = res.data;
          }
        });
    }
    this.changeDetectorRefs.detectChanges();
  }
  preview(file) {
    let obj = file.filename.split('.')[file.filename.split('.').length - 1];
    if (file.isImage || file.type == 'png') {
      this.DownloadFile(file.path);
    } else if (obj == 'pdf') {
      this.layoutUtilsService.ViewDoc2(file.path, 'google');
      // alert('chức năng đang lỗi');
    }
    else {
      this.layoutUtilsService.ViewDoc2(file.path, 'office');
    }
  }
  ShowXemTruoc(item) {
    let show = false;
    let obj = item.filename.split('.')[item.filename.split('.').length - 1];
    if (
      obj == 'jpg' ||
      obj == 'png' ||
      obj == 'jpeg' ||
      obj == 'xls' ||
      obj == 'xlsx' ||
      obj == 'doc' ||
      obj == 'docx' ||
      obj == 'pdf'
    ) {
      show = true;
    }
    return show;
  }
  Delete_File(val: any, type: number) //type: 1-tài liệu đính kèm,2-tài liệu kết quả
  {
    if (type == 1) {
      if (!this.CheckRule('Attachments')) {
        this.layoutUtilsService.showError(
          this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
        );
        return false;
      }
    }
    else {
      if (!this.CheckRule('Attachments_result')) {
        this.layoutUtilsService.showError(
          this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
        );
        return false;
      }
    }

    const _title = this.translate.instant('landingpagekey.xoa');
    const _description = this.translate.instant(
      'landingpagekey.bancochacchanmuonxoakhong'
    );
    const _waitDesciption = this.translate.instant(
      'landingpagekey.dulieudangduocxoa'
    );
    const _deleteMessage = this.translate.instant(
      'landingpagekey.xoathanhcong'
    );
    const dialogRef = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDesciption
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this._menuWorkServices.delete_attachment(val).subscribe((res) => {
        if (res && res.status === 1) {
          this.get_data();
          this.changeDetectorRefs.detectChanges();
          this.layoutUtilsService.showActionNotification(
            _deleteMessage,
            MessageType.Delete,
            4000,
            true,
            false
          );
        } else {
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Read,
            999999999,
            true,
            false,
            3000,
            'top',
            0
          );
        }
      });
    });
  }
  DownloadFile(link) {
    window.open(link);
  }

  getDataHoatDong() {
    this._menuWorkServices.getDataHoatDong2(this.id_task).subscribe((res) => {
      if (res && res.status === 1) {
        this.LogDetail = res.data;
        this.changeDetectorRefs.detectChanges();
      } else {
        // this.layoutUtilsService.showError(res.error.message);
      }
    });
  }


  //=============================Tab dữ liệu=========================
  TenFile = '';
  File = '';
  IsShow_Result = false;
  Result = '';
  evt_file = new FormData();
  AttFile: any[] = [];
  UploadFileForm(evt) {
    this.evt_file = new FormData();
    this.evt_file.append('file' + this.AttFile.length + 1, evt.target.files[0], evt.target.files[0].name);
    this.uploadfile(this.id_task);

    this.changeDetectorRefs.detectChanges();
  }
  uploadfile(id) {
    this._UploadFileService.upload_file(this.evt_file, 1, id).subscribe(res => {
      if (res.status == 1) {
        this.get_data();
        this.LoadObjectID();
        this.getDataHoatDong();
      }
      else{
        this.layoutUtilsService.showActionNotification(res.error, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });
  }
  // save_file_Direct(evt: any, type: string) {
  //   if (type == '1') {
  //     if (!this.CheckRule('Attachments')) {
  //       this.layoutUtilsService.showError(
  //         this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
  //       );
  //       return false;
  //     }
  //   }
  //   else//==11, thêm tài liệu cho kết quả
  //   {
  //     if (!this.CheckRule('Attachments_result')) {
  //       this.layoutUtilsService.showError(
  //         this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
  //       );
  //       return false;
  //     }
  //   }
  //   if (evt.target.files && evt.target.files.length) {
  //     // Nếu có file
  //     const file = evt.target.files[0]; // Ví dụ chỉ lấy file đầu tiên
  //     var size = evt.target.files[0].size;
  //     if (size / 1024 / 1024 > 16) {
  //       this.layoutUtilsService.showActionNotification(
  //         'Tồn tại tệp không hợp lệ. Vui lòng chọn tệp không được vượt quá 16 MB',
  //         MessageType.Read,
  //         9999999999,
  //         true,
  //         false,
  //         3000,
  //         'top',
  //         0
  //       );
  //       return;
  //     }
  //     this.TenFile = file.name;
  //     const reader = new FileReader();
  //     reader.readAsDataURL(evt.target.files[0]);
  //     let base64Str;
  //     setTimeout(() => {
  //       base64Str = reader.result as String;
  //       const metaIdx = base64Str?.indexOf(';base64,');
  //       base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
  //       this.File = base64Str;
  //       const _model = new AttachmentModel();
  //       _model.object_type = parseInt(type);
  //       _model.object_id = this.id_task;
  //       const ct = new FileUploadModel();
  //       ct.strBase64 = this.File;
  //       ct.filename = this.TenFile;
  //       ct.IsAdd = true;

  //       let key = type == '1' ? 'Attachments' : 'Attachments_result';
  //       let values = new Array<FileUploadModel>(ct);
  //       this.update(key, values);
  //     }, 100);
  //   } else {
  //     this.File = '';
  //   }
  // }
  transformHtml(htmlTextWithStyle) {
    return this.sanitizer.bypassSecurityTrustHtml(htmlTextWithStyle);
  }
  trackByFn(index, item) {
    return item.id_row;
  }
  getActionActivities(value) {
    let text = '';
    text = value.action;
    if (text) {
      return text.replace('{0}', '');
    }
    return '';
  }
  getPriorityLog(id) {
    if (+id > 0 && this.list_priority) {
      const prio = this.list_priority.find((x) => x.value === +id);
      if (prio) {
        return prio;
      }
    }
    return {
      name: 'Noset',
      value: 0,
      icon: 'grey-flag',
    };
  }
  changeTag(val) {
    let index = this._data.Tags.findIndex((x) => x.id_row == val.rowid);
    if (index == -1) {
      this.update('Tags', val.rowid);
      // let tag: Tag = { color: val.color, title: val.title, id_row: val.rowid }; // do tên biến id_row từ Tags của detail khác rowid từ list tag
      // this._data.Tags.push(tag);
    }
  }
  getListTags() {
    this._danhmucChungServices
      .ListTagByProject(this._data.id_project_team)
      .subscribe((res) => {
        if (res.status == 1) {
          this._listTags = res.data;
          this.changeDetectorRefs.detectChanges();
        }
      });
  }
  ChinhSuaMoTa() {
    if (!this.CheckRule('description')) {
      this.layoutUtilsService.showError(
        this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
      );
      return;
    }
    this._chinhsua = true;
    this.changeDetectorRefs.detectChanges();
  }
  LuuThayDoi() {
    if (this.is_confirm) {
      if (this._data.description == null) {
        this._data.description = "";
      }
      this._old_desreption = this._data.description;
      this.update('description', this._data.description);
    }
  }
  HuyThayDoi() {
    if (this.is_confirm) {
      this._data.description = this._old_desreption;
    }
    this._chinhsua = false;
  }
  getMoreInformation(item): string {
    return item.hoten + ' - ' + item.username + ' \n ' + item.tenchucdanh;
  }
  filterConfiguration(): any {
    let filter: any = {};
    // filter.TimeZone = -420;
    return filter;
  }
  get_bg_tag_color(rgb_color: string): string {
    var result = rgb_color.replace(')', ', 0.2)').replace('rgb', 'rgba');
    return result;
  }
  get_flag_color() {
    switch (this.clickup_prioritize) {
      case 0:
        return 'grey-flag';
      case 1:
        return 'red-flag';
      case 2:
        return 'yellow-flag';
      case 3:
        return 'blue-flag';
      case 4:
        return 'low-flag';
    }
    // return'red-flag1';
  }
  ngaybanhanh: boolean = false;
  updateDate(day: Date) {
    let date = formatDate(day, 'dd/MM/YYYY hh:mm:ssA', 'en-US', 'GMT+7');
    // day.setHours(day.getHours());
    let t = day.toISOString();
    this.update('deadline', t);
  }
  updateDate2(day: Date) {
    // day.setHours(day.getHours());
    let t = day.toISOString();
    this.update('start_date', t);
  }
  timeinput: string = '';
  dataChanged(date_input) { }
  value = '';
  isToday = false;
  ngOnChanges(changes: SimpleChanges) {
    // if (this.value){
    //   this.isToday = moment(this.value).format('MM/DD/YYYY') === moment(new Date()).utc().format('MM/DD/YYYY');
    // }
    // this.date = this.pipetimezone.transform(this.value,'YYYY-MM-DD')+'T'+this.pipetimezone.transform(this.value,'HH:mm:ss');
    // this.changeDetectorRefs.detectChanges()
  }
  updatePriority(value) { }
  onChangeNote(event) {
    if (event != this._old_desreption) {
      this.is_confirm = true;
    } else {
      this.is_confirm = false;
    }
  }

  //
  //
  getColorText(_color) {
    if (_color == '#848E9E') {
      return 'white';
    } else return _color;
  }
  Rename() {
    // this.isRename = true;
    // // var result = document.getElementById('renameText');
    // // result.focus();
    // var idname = "renameText" + this.tag.id_row + this.node.id_row + (this.detail ? '1' : '0');
    // let ele = (<HTMLInputElement>document.getElementById(idname));
    // ele.value = this.tag.title;
    // setTimeout(() => {
    //   ele.focus();
    // }, 10);
  }
  RemoveTags(val) {
    let index = this._data.Tags.findIndex(x => x.id_row == val.id_row)
    this._data.Tags.splice(index, 1)
    this.updateItem(this.id_task, val.id_row, 'Tags');
  }
  ColorPickerStatus(val) {
    // this.tag.color = val;
    // this.onSubmit();
  }
  getbackgroundColor(_color) {
    if (_color == 'rgb(132, 142, 158)') {
      return '#B5BBC0';
    } else return _color;
  }
  UpdateResult() {
    if (!this.CheckRule('result')) {
      this.layoutUtilsService.showError(
        this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
      );
      return;
    }
    const dialogRef = this.dialog.open(EditorJeeWorkComponent, {
      data: { _value: this._data['result'] },
      width: '55%',
      maxHeight: '60%',
      panelClass: ['editor-v2']
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      let _result = res._result;
      this.update('result', _result);
    });
  }
  UpdateTienDo(val) {
    const dialogRef = this.dialog.open(StatusAttachedComponent, {
      data: {
        _value: this._data['progress'], id_task: this.id_task,
        isProgress: this.CheckRule('Attachments_result'), type: this.sttType,
        ketqua: val,id_status:this.dataDetailTask.status
      },
      width: '55%',
      panelClass: ['editor-v2']
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      else {
        this.isUpdate = true;
        this.get_data();
        this.LoadProgress();
      }
    });
  }
  UpdateKetQuaCongViec(val) {
    const dialogRef = this.dialog.open(WorkResultDialogComponent, {
      data: {
        _value: this._data['result'], _att: this._data['Attachments_Result'], id_task: this.id_task,
      },
      width: '55%',
      panelClass: ['editor-v2']
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      else {
        this.isUpdate = true;
        this.get_data();
        this.LoadProgress();
      }
    });
  }
  dulieu: any = [{
    kiemtra: false
  }]
  onclickReturn() {
    if (this.data) {
      this.dialogRef.close();
      // this.directURL();
      if (this.isUpdate) {
        this.updateReadItem();
      }
    } else {
      this.location.back();
    }
  }
  View_Log_Description() {
    var ID_log = this.id_task;
    let saveMessageTranslateParam = ID_log > 0 ? 'GeneralKey.capnhatthanhcong' : 'GeneralKey.themthanhcong';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = MessageType.Read;
    const dialogRef = this.dialog.open(LogWorkDescriptionComponent, { data: { ID_log }, width: '70vw', panelClass: ['view_description'] });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.get_data();
        // this.LoadDataWorkDetail(this.DataID);
      } else {
        this.get_data();
        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
        // this.LoadDataWorkDetail(this.DataID);
      }
    });
  }

  onClickOpenChildTask(item) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = false;
    dialogConfig.data = {
      title: '',
      message: '',
      id_row: item.id_row,
      isPopup: true
    };
    dialogConfig.width = '90%';
    dialogConfig.panelClass = ['pn-detail-work'];
    const dialogRef = this.dialog.open(
      DetailTaskComponentComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        //this.ngOnInit();
      }
    });
  }

  updateStatusChild(item, status) {
    item.StatusInfo[0] = status;
    this.updateItem(item.id_row, Number(status.id_row), 'status');
  }

  ItemSelected2(event, item) {
    item.id_nv = event;
    this.updateItem(item.id_row, Number(event.id_nv), 'assign');
  }

  RemoveAssignForChild(element) {
    if (!this.CheckRule('assign')) {
      this.layoutUtilsService.showError(
        this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
      );
    }
    else {
      if (this.isgov) {
        this.updateItem(element.id_row, Number(element.id_nv.id_nv), 'assign');
        element.id_nv = {};
      } else {
        this.updateItem(element.id_row, Number(element.Users.id_nv), 'assign');
        element.Users = {};
      }
    }
  }
  minimizeText(text) {
    if (text.length > 80) {
      return text.slice(0, 80) + '...';
    }
    return text;
  }
  updateItem(val: any, newvalue: any, key: any) {
    let item = { values: [], id_row: val, key: key, value: newvalue };
    this.layoutUtilsService.showWaitingDiv();
    this._danhmucChungServices.updateTask(item).subscribe((res) => {
      this.layoutUtilsService.OffWaitingDiv();
      if (res && res.status == 1) {
        this.isUpdate = true;
        this.ngOnInit();
      } else {
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
    });
  }
  formatThoiGianTao(createddate) {
    let date = moment(createddate).format('HH:mm DD/MM/YYYY');
    return date;
  }
  stopPropagation1(event) {
    event.stopPropagation();
  }
  ItemSelected1(val: any) {
    let t: Tag = {
      id_row: val.rowid,
      title: val.title,
      color: val.color
    }
    if (this._data.Tags.length > 0) {
      let a = this._data.Tags.find((i) => i.id_row == val.rowid);
      if (a) {
        let index = this._data.Tags.indexOf(a);
        this._data.Tags.splice(index, 1);
      } else {
        this._data.Tags.push(t);
      }
    } else {
      this._data.Tags.push(t);
    }
    this.changeDetectorRefs.detectChanges();
    this.updateItem(this.id_task, val.rowid, 'Tags');
  }
  RemoveTag(value) {
    let index = this._data.Tags.indexOf(value);
    this._data.Tags.splice(index, 1);
    this.updateItem(this.id_task, value.id_row, 'Tags');
  }
  CheckRulesNotUse(RuleID: number, element) {
    // if (element.IsAdmin) {
    //   return true;
    // }
    // const x = element.Rule.find(x => x.id_row === id_project_team);
    // if (x) {
    //     if (x.locked) {
    //         return false;
    //     }
    // }
    if (element.Rule) {
      if (element) {
        if (
          element.IsAdmin === true ||
          +element.admin === 1 ||
          +element.owner === 1 ||
          +element.parentowner === 1
        ) {
          return true;
        } else {
          if (
            RuleID === 7 ||
            RuleID === 9 ||
            RuleID === 11 ||
            RuleID === 12 ||
            RuleID === 13
          ) {
            if (element.Rule.find((element) => element == 15)) {
              return false;
            }
          }
          if (RuleID === 10) {
            if (element.Rule.find((element) => element == 16)) {
              return false;
            }
          }
          if (RuleID === 4 || RuleID === 14) {
            if (element.Rule.find((element) => element == 17)) {
              return false;
            }
          }
          const r = element.Rule.find((element) => element == RuleID);
          if (r) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    }
    return false;
  }
  CheckClosedTask(element) {
    if (element.closed) {
      return false;
    } else {
      return true;
    }
  }
  minimizeTextTag(text) {
    if (text != '' && text != null) {
      if (text.length > 10) {
        return text.slice(0, 10) + '...';
      }
      return text;
    }
  }
  minimizeTextTagChild(text) {

    if (text.length > 5) {
      return text.slice(0, 5) + '...';
    }
    return text;
  }

  //=======================Bổ sung chức năng ngày 05/07/2023=====================
  CheckViewWork() {
    const item_wv = new WorkViewModel();
    item_wv.workid = this.id_task;
    this._menuWorkServices.lite_inset_task_view(item_wv).subscribe(res => { })
  }

  updateReadItem() {
    let _item = {
      "appCode": "WORKV2",
      "mainMenuID": 12,
      "subMenuID": 7,
      "itemID": +this.id_task,
    }
    this.socketioService.readNotification_menu(_item).subscribe(res => {
      //event để reload lại mainmenu
      const busEvent = new CustomEvent('event-mainmenu', {
        bubbles: true,
        detail: {
          eventType: 'update-main',
          customData: 'some data here'
        }
      });
      dispatchEvent(busEvent);
      //event để reload lại list nhiệm vụ
      const busEvent1 = new CustomEvent('event-list-task', {
        bubbles: true,
        detail: {
          eventType: 'update-task',
          customData: 'some data here'
        }
      });
      dispatchEvent(busEvent1);
    })
  }

  //==============================Bổ sung button thêm nhanh==================================
  themMoiNhiemVuNhanh() {
    var data = null; //call api
    this.openModalFast(
      'Title1',
      'Message Test',
      () => {
        //confirmed
        console.log('Yes');
      },
      () => {
        //not confirmed
        console.log('No');
      }
    );
  }
  openModalFast(
    title: string,
    message: string,
    yes: Function = null,
    no: Function = null
  ) {
    if (!this.CheckRule('giaoviec')) {
      this.layoutUtilsService.showError(
        this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
      );
      return false;
    }
    const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.data = {
      title: title,
      message: message,
      dataDetailTask: this.dataDetailTask,
      w: '40vw',
    };
    dialogConfig.width = '40vw';
    let item;
    if (this.isgov) {
      item = ThemMoiCongViecVer2Component;
    }
    const dialogRef = this.dialog.open(item, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.ngOnInit();
      }
    });
  }
  //===================================Check quyền sử dụng comment==========================
  checkRule(id) {
    if (this.dataDetailTask) {
      let obj = this.dataDetailTask.Rule.find(x => x == id);
      if (obj) {
        return true;
      }
      return false;
    }
    return false;
  }

  //======================================================================================
  getHeightRight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 76;
    return tmp_height + 'px';
  }

  //==============================Bổ sung button chuyển xử lý==================================
  chuyenXuLy() {
    var data = null; //call api
    this.openModalChuyenXuLy(
      'Title1',
      'Message Test',
      () => {
        //confirmed
      },
      () => {
        //not confirmed
      }
    );
  }
  openModalChuyenXuLy(
    title: string,
    message: string,
    yes: Function = null,
    no: Function = null
  ) {
    if (!this.CheckRule('assign')) {
      this.layoutUtilsService.showError(
        this.translate.instant('work.bankhongcoquyenthuchienthaotacnay')
      );
      return false;
    }
    const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose = true;
    dialogConfig.panelClass = ['handler1'];
    dialogConfig.data = {
      title: title,
      message: message,
      dataDetailTask: this.dataDetailTask,
      w: '40vw',
    };
    dialogConfig.width = '40vw';
    let item;
    if (this.isgov) {
      item = SwitchHandlerComponent;
    }
    const dialogRef = this.dialog.open(item, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.ngOnInit();
        this.isUpdate = true;
      }
    });
  }
  Updateestimates(event) {
    this.update('estimates', event);
  }
  SaveWork() {
    debugger
    if (!this.dataDetailTask.isStorage) {
      const item = new UpdateWorkModel();
      item.id_row = this.dataDetailTask.id_row;
      item.key = 'isStorage';
      item.value = "1";
      //item.status_type = type;
      if (this.dataDetailTask.assign != null) {
        if (this.dataDetailTask.assign.id_nv > 0) {
          item.IsStaff = true;
        }
      }
      this.layoutUtilsService.showWaitingDiv();
      this.DanhMucChungService.updateTask(item).subscribe((res) => {
        this.layoutUtilsService.OffWaitingDiv();
        if (res && res.status == 1) {
          this.get_data();
          this.getDataHoatDong();
          this.updateReadItem();
          let message = this.translate.instant('GeneralKey.luucongviec');
          this.layoutUtilsService.showActionNotification(message, MessageType.Read, 4000, true, false, 3000, 'top', 1);
        } else {
          this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
        }
      });
    }
    this.dataDetailTask.isStorage = true;
  }
  DeleteUnSavedWork() {
    if (this.dataDetailTask.isStorage) {
      const item = new UpdateWorkModel();
      item.id_row = this.dataDetailTask.id_row;
      //item.key = 'deleteStorage';
      item.key = 'isStorage';
      item.value = "0";
      //item.status_type = type;
      if (this.dataDetailTask.assign != null) {
        if (this.dataDetailTask.assign.id_nv > 0) {
          item.IsStaff = true;
        }
      }
      this.layoutUtilsService.showWaitingDiv();
      this.DanhMucChungService.updateTask(item).subscribe((res) => {
        this.layoutUtilsService.OffWaitingDiv();
        if (res && res.status == 1) {
          this.get_data();
          this.getDataHoatDong();
          this.updateReadItem();
          let message = this.translate.instant('work.xoaluucongviec');
          this.layoutUtilsService.showActionNotification(message, MessageType.Read, 4000, true, false, 3000, 'top', 1);
        } else {
          this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
        }
      });
    }
    this.dataDetailTask.isStorage = false;
  }
}
export class DetailTaskModel {
  title: string;
  nguoitao: UserInfo;
  createddate: string;
  status: Status;
  nguoiduocgiao: UserInfo;
  Tags: Tag[];
  Followers: UserInfo[];
  deadline: any;
  description: string;
  id_project_team: string;
  DataStatus: any[];
  Attachments_Result: any[];
  nguoigiao: any;

  isgov: boolean;
  Gov_NgayVB?: Date;
  Gov_SoHieuVB?: string;
  Gov_TrichYeuVB?: string;
  Attachments: any[];
  result: any;
  Rule: any[];
  IsAdmin: boolean;
  closed: boolean;
  progress: string;
  DataProgress: any[];
  Gov_Nguoiky?: string;
  Gov_Donvibanhanh?: string;
  start_date: any;
  estimates: any;
  TaskView: any;
  empty() {
    this.title = '';
    this.nguoitao = { hoten: '', jobtitle: '', department: '' };
    this.createddate = '';
    this.status = { color: '', statusname: '', id_row: '' };
    this.nguoiduocgiao = {
      hoten: '',
      tenchucdanh: '',
      username: '',
      image: '',
      id_nv: '',
    };
    this.Tags = [];
    this.Followers = [];
    this.deadline = '';
    this.description = '';
    this.id_project_team = '';
    this.DataStatus = [];
    this.Attachments_Result = [];

    this.isgov = false;
    this.Gov_NgayVB = new Date();
    this.Gov_SoHieuVB = '';
    this.Gov_TrichYeuVB = '';
    this.Attachments = [];
    this.Rule = [];
    this.progress = '';// { id_row: 0, color: '', name: '', position: 0 };
    this.DataProgress = [];
    this.start_date = '';
    this.estimates = '';
    this.TaskView = '';
  }
}
export interface UserInfo {
  hoten: string;
  jobtitle?: string;
  department?: string;
  username?: string;
  tenchucdanh?: string;
  image?: string;
  id_nv?: string;
}
export interface Status {
  color: string;
  statusname: string;
  id_row: string;
}
export interface Tag {
  color: string;
  title: string;
  id_row: string;
}
export class UpdateModel {
  values: any[];
  id_row: string;
  key: string;
  value: string;
  ReasonRefuse: string;
  ProcessFinal: boolean;
  emty() {
    this.values = [];
    this.id_row = '';
    this.key = '';
    this.value = '';
    this.ReasonRefuse = '';
    this.ProcessFinal = false;
  }
}
export class AttachmentModel extends BaseModel {
  object_type: number;
  object_id: number;
  id_user: number;
  item: FileUploadModel;
  clear() {
    this.object_type = 0;
    this.object_id = 0;
    this.id_user = 0;
    this.item;
  }
}
export class FileUploadModel extends BaseModel {
  IdRow: number;
  strBase64: string;
  filename: string;
  src: string;
  IsAdd: boolean;
  IsDel: boolean;
  IsImagePresent: boolean;
  link_cloud: string;
  value: string;
  clear() {
    this.IdRow = 0;
    this.strBase64 = '';
    this.filename = '';
    this.src = '';
    this.IsAdd = false;
    this.IsDel = false;
    this.IsImagePresent = false;
    this.link_cloud = '';
    this.value = ''
  }
}
export class UpdateWorkModel {
  id_row: number;
  key: string;
  value: string;
  id_log_action: string;
  IsStaff: boolean;
  values: Array<FileUploadModel> = [];
  status_type: string;
  FieldID: number;
  Value: string;
  WorkID: string;
  TypeID: string;

  clear() {
    this.id_row = 0;
    this.key = '';
    this.value = '';
    this.id_log_action = '';
    this.values = [];
    this.IsStaff = false;
  }
}
export interface Rule {
  key: string;
  value: string;
}

export class WorkViewModel extends BaseModel {
  id_row: number;
  workid: number;
  id_user: number;
  CreatedDate: string;
  clear() {
    this.id_row = 0;
    this.workid = 0;
    this.id_user = 0;
    this.CreatedDate = '';
  }
}
export class TienDo {
  id_row: number;
  color: string;
  name: string;
  position: number;
}
export const MY_CUSTOM_FORMATS = {
  parseInput: 'LL LT',
  fullPickerInput: 'LL LT',
  datePickerInput: 'LL',
  timePickerInput: 'LT',
  monthYearLabel: 'MMM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MMMM YYYY',
};