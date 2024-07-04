import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import moment from 'moment';
import { getDate } from 'ngx-bootstrap/chronos/utils/date-getters';
import {
  LayoutUtilsService,
  MessageType,
} from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
// import { AuthService } from 'src/app/modules/auth';
import { UserInfoModel, WorkDraftModel, WorkModel } from '../../models/JeeWorkModel';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { DialogSelectdayComponent } from '../dialog-selectday/dialog-selectday.component';
import { MenuWorkService } from '../services/menu-work.services';
import { TranslateService } from '@ngx-translate/core';
import { quillConfig } from '../../editor/Quill_config';
import { UploadFileService } from '../../service-upload-files/service-upload-files.service';
@Component({
  selector: 'app-them-moi-cong-viec-khong-van-ban',
  templateUrl: './them-moi-cong-viec-khong-van-ban.component.html',
  styleUrls: ['./them-moi-cong-viec-khong-van-ban.component.scss']
})
export class ThemMoiCongViecKhongVanBanComponent implements OnInit {
  public quillConfig: {};
  idmeeting: number;
  modalTitle: string;
  modalMessage: string;
  labelNGNV: string = '';
  modalType: ModalType = ModalType.INFO;
  UserID: any;
  listNguoiGiaoViec: any;
  public bankFilterCtrlNGNV: FormControl = new FormControl();
  idDuAn: any;
  labelDuAn: any;
  Assign: any;
  priority: any;
  selectedDate: any = { 'startDate': '', 'endDate': '' };
  title: string;
  Followers: any[];
  listDuAn: any;
  description_tiny: any;
  dept: any;
  giaocho: any;
  theodoi: any[];
  clickup_prioritize: any;
  startDateFormat: any;
  endDateFormat: any;
  startDate: any;
  endDate: any;
  tags: any;
  element: any;
  estimates: any;
  id_parent = 0;
  id_group = 0;
  idProject: any = -1;
  editorStyles = {
    'border': '1px solid #ccc',
    'min-height': '200px',
    'max-height': '200px',
    height: '100%',
    'font-size': '12pt',
    'overflow-y': 'auto',
    // 'width':'80pw'
  };
  douutienintable: any[] = [
    {
      value: '1',
      viewValue: 'Khẩn cấp',
      color: '#FF0000',
      icon: 'fa fa-flag fab pd-r-10 text-danger',
    },
    {
      value: '2',
      viewValue: 'Cao',
      color: '#FFA800',
      icon: 'fa fa-flag fab pd-r-10 text-warning',
    },
    {
      value: '3',
      viewValue: 'Bình thường',
      color: '#0A86FF',
      icon: 'fa fa-flag fab pd-r-10 text-info',
    },
    {
      value: '4',
      viewValue: 'Thấp',
      color: '#B5B5C3',
      icon: 'fa fa-flag fab pd-r-10 text-muted',
    },
    {
      value: '0',
      viewValue: 'Xóa',
      color: '#B5B5C3',
      icon: 'fa fa-times fas pd-r-10 text-danger',
    },
  ];
  errorLog: string;
  isTaskChat: boolean;
  messageid: number;
  groupid: number;
  idLienKet: number;
  list_priority: { name: string; value: number; icon: string; }[];
  IsAdminGroup: any;
  task: any;
  link: any;
  idmenu: any;
  idTag: any = -1;
  ListGroup: any[] = [];
  ParentName = "Chọn vị trí lưu";
  ListDepartmentFolder: any = [];
  ItemParentID: any = {};
  TemplateDetail: any = [];
  constructor(
    public dialogRef: MatDialogRef<ThemMoiCongViecKhongVanBanComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private auth: AuthService,
    public DanhMucChungService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    public congViecTheoDuAnService: MenuWorkService,
    private translate: TranslateService,
    private _UploadFileService: UploadFileService
  ) {
    this.modalTitle = data.title;
    this.modalMessage = data.message;
    this.modalType = data.type;
    // this.UserID = this.auth;
    this.clickup_prioritize = 0;
    this.theodoi = [];
    this.startDate = '';
    this.endDate = '';
    this.startDateFormat = '';
    this.endDateFormat = '';
    this.element = { id_project_team: 0 };
    if (data.dataDetailTask) {
      this.task = data.dataDetailTask;
      this.id_parent = this.task.id_row;
      this.idProject = this.task.id_project_team;
    }
    if (data.idMeeting) {
      this.idmeeting = data.idMeeting;
    }
  }

  ngOnInit(): void {
    this.link = window.location.href.split('/');
    if (this.link.length == 9) {
      this.idmenu = this.link[5];
      this.idProject = this.link[7];
      if (this.idmenu == "7") {
        this.idTag = Number(this.link[8]);
      }
    }
    this.list_priority = this.DanhMucChungService.list_priority;
    this.estimates = 0;
    this.quillConfig = quillConfig;
    this.UserID =
      this.congViecTheoDuAnService.getAuthFromLocalStorage().user.customData[
        'jee-account'
      ].userID;
    this.LoadDepartmentFolder();
    // this.LoadDataDuAn();
    this.tags = [];
    if (this.data._messageid && this.data._messageid > 0) {
      this.isTaskChat = true;
      this.messageid = this.data._messageid;
      this.groupid = this.data._groupid;
      this.description_tiny = this.data._message;
      this.giaocho = this.data._itemid;
      this.changeDetectorRefs.detectChanges();
    }
    else {
      this.description_tiny = '';
    }
    this.DanhMucChungService.send$.subscribe((res: any) => {
      if (res == "LoadGroup") {
        this.LoadGroupTask();
        this.DanhMucChungService.send$.next('');
      }
    });

  }
  getHeight() {
    let height = 0;
    height = window.innerHeight - 180;
    return height + 'px';
  }

  //=======================Chon tai lieu=====================
  AttFile: any[] = [];
  @ViewChild('myInput') myInput;
  indexItem: number;
  ObjImage: any = { h1: '', h2: '' };
  Image: any;
  TenFile: string = '';
  selectFile() {
    let el: HTMLElement = this.myInput.nativeElement as HTMLElement;
    el.click();
  }
  evt_file = new FormData();
  UploadFileForm(evt) {
    // this.files=evt.target.files;
    let keys='';
    let filesToUpload: File[] = evt.target.files;
    Array.from(filesToUpload).map((file) => {
      keys='file' + this.AttFile.length + 1;
      return this.evt_file.append(keys, file, file.name);
    });
    // this.evt_file.append('file' + this.AttFile.length + 1, evt.target.files);
    var file = {
      filename: evt.target.files[0].name,
      type: evt.target.files[0].name.split('.')[
        evt.target.files[0].name.split('.').length - 1
      ],
      IsAdd: true,
      IsDel: false,
      IsImagePresent: false,
      link_cloud: '',
      keys:keys,
    }
    this.AttFile.push(file);

    this.changeDetectorRefs.detectChanges();
  }
  uploadfile(id) {
    this._UploadFileService.upload_file(this.evt_file, 1, id).subscribe(res => {
      if (res.status == 1) {
        console.log("upload-success")
      }
    });
  }
  // UploadFileForm2(evt) {
  //   let ind = 0;
  //   if (this.AttFile.length > 0) {
  //     ind = this.AttFile.length;
  //   }

  //   if (evt.target.files && evt.target.files[0]) {
  //     var filesAmount = evt.target.files.length;
  //     for (let i = 0; i < filesAmount; i++) {
  //       var reader = new FileReader();

  //       reader.onload = (event: any) => {
  //         let base64Str = event.target.result;
  //         var metaIdx = base64Str.indexOf(';base64,');
  //         base64Str = base64Str.substr(metaIdx + 8);
  //         this.AttFile[ind].strBase64 = base64Str;
  //         ind++;
  //       };
  //       reader.readAsDataURL(evt.target.files[i]);
  //       this.AttFile.push({
  //         filename: evt.target.files[i].name,
  //         type: evt.target.files[i].name.split('.')[
  //           evt.target.files[i].name.split('.').length - 1
  //         ],
  //         strBase64: '',
  //         IsAdd: true,
  //         IsDel: false,
  //         IsImagePresent: false,
  //       });
  //     }
  //   }
  // }
  getIcon(type) {
    let icon = '';
    if (type == 'doc' || type == 'docx') {
      icon = './../../../../../assets/media/mime/word.png';
    }
    if (type == 'pdf') {
      icon = './../../../../../assets/media/mime/pdf.png';
    }
    if (type == 'rar') {
      icon = './../../../../../assets/media/mime/text2.png';
    }
    if (type == 'zip') {
      icon = './../../../../../assets/media/mime/text2.png';
    }
    if (type == 'jpg') {
      icon = './../../../../../assets/media/mime/jpg.png';
    }
    if (type == 'png') {
      icon = './../../../../../assets/media/mime/png.png';
    } else {
      icon = './../../../../../assets/media/mime/text2.png';
    }
    return icon;
  }
  deleteFile(file: any) {
    let index = this.AttFile.findIndex(t => t.filename == file.filename);
    this.AttFile.splice(index, 1);
    this.myInput.nativeElement.value = '';
    this.evt_file.delete(file.keys);
    this.changeDetectorRefs.detectChanges();
  }
  //=======================Nhiem vu=====================

  listUser: any[];
  LoadDataDuAn() {
    this.DanhMucChungService.lite_project_by_manager().subscribe((res) => {
      if (res && res.status == 1) {
        if (res.data.length > 0) {
          this.listDuAn = res.data;
          if (this.idmenu == "4" && this.listDuAn.length > 0) {
            let id = Number(this.idProject)
            let index = this.listDuAn.findIndex(t => t.id_row == id)
            if (index >= 0) {
              this.dept = this.listDuAn[index];
              this.element.id_project_team = this.dept.id_row;
            }
          }
          else if (this.listDuAn.length > 0) {
            this.dept = this.listDuAn[0];
            this.element.id_project_team = this.dept.id_row;
            // this.labelDuAn = this.listDuAn[0].title;
          }
          this.LoadGroupTask();
        }
      }
      this.changeDetectorRefs.detectChanges();
    });
  }
  // getOptions_Assign_Dynamic(data) {
  //   var options_assign: any = {
  //     showSearch: true,
  //     keyword: '',
  //     data: data,
  //   };
  //   return options_assign;
  // }
  stopPropagation1(event) {
    event.stopPropagation();
  }
  ItemSelected1(val: any, element) {
    this.dept = val;
    this.giaocho = '';
    this.theodoi = [];
    this.tags = [];
    // this.updateItem(task, Number(val.id_nv), 'assign');
    // if (val.id_nv) {
    //     val.userid = val.id_nv;
    // }
    // this.UpdateByKeyNew(task, 'assign', val.userid);
  }
  stopPropagation2(event) {
    event.stopPropagation();
  }
  ItemSelected2(val: any) {
    if (this.giaocho != undefined && this.giaocho.id_nv && this.giaocho.id_nv == val.id_nv) {
      this.giaocho = '';
    } else {
      this.giaocho = val;
    }
  }
  stopPropagationTheoDoi(event) {
    event.stopPropagation();
  }
  ItemSelectedTheoDoi(val: any) {
    if (this.theodoi != undefined && this.theodoi.length > 0 && this.theodoi.find(element => element.id_nv == val.id_nv)) {
      this.theodoi = this.theodoi.filter(element => element.id_nv != val.id_nv);
    } else {
      this.theodoi.push(val);
    }
  }
  RemoveFollower(val) {
    this.theodoi = this.theodoi.filter(element => element.id_nv != val.id_nv);
  }
  get_flag_color(val) {
    switch (val) {
      case 0:
        return 'img.grey-flag_list';
      case 1:
        return 'img.red-flag_list';
      case 2:
        return 'img.yellow-flag_list';
      case 3:
        return 'img.blue-flag_list';
      case 4:
        return 'img.low-flag_list';
      default:
        return 'img.not_choose_priority';
    }
  }
  changeDoUuTienInTable(clickup_prioritize) {
    this.clickup_prioritize = Number(clickup_prioritize.value);
    this.changeDetectorRefs.detectChanges();
  }
  Selectdate() {
    this.selectedDate = {
      startDate: this.startDate,
      endDate: this.endDate,
    };
    const dialogRef = this.dialog.open(DialogSelectdayComponent, {
      width: '500px',
      data: this.selectedDate,
      panelClass: 'sky-padding-0',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (moment(result.startDate).format('MM/DD/YYYY') != 'Invalid date') {
          this.startDate = this.selectedDate.startDate;
          this.startDateFormat = moment(this.selectedDate.startDate).format(
            'MM/DD/YYYY'
          );
        }

        if (moment(result.endDate).format('MM/DD/YYYY') != 'Invalid date') {
          this.endDate = this.selectedDate.endDate;
          this.endDateFormat = moment(this.selectedDate.endDate).format(
            'MM/DD/YYYY'
          );
        }
      }
    });
  }



  CreateTask(val, withBack: boolean) {
    this.layoutUtilsService.showWaitingDiv();
    this.DanhMucChungService.InsertTask(val).subscribe((res) => {
      this.layoutUtilsService.OffWaitingDiv();
      if (res && res.status === 1) {
        if (this.AttFile.length > 0) {
          this.uploadfile(res.data.id_row)
        }
        this.layoutUtilsService.showActionNotification(
          'Thêm mới thành công',
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
        } else {
          this.AttFile = [];
          this.description_tiny = '';
          this.ngOnInit();
        }
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
  onSubmit(withBack: boolean = false) {
    if ((this.ItemParentID.IsAssignee == 1 && this.ItemParentID.requireAss == 1) && (this.giaocho == undefined || this.giaocho == '')) {
      this.layoutUtilsService.showActionNotification(
        this.translate.instant('jeework.vuilongchonnguoithuchien'),
        MessageType.Read,
        9999999999,
        true,
        false,
        3000,
        'top',
        0
      );
      return;
    }
    const ele = document.getElementById("txttitle") as HTMLInputElement;
    if (ele.value.toString().trim() == "") {
      this.layoutUtilsService.showActionNotification('Tên công việc không được bỏ trống', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
      return;
    }
    if (this.ItemParentID.id_row != undefined && !this.ItemParentID.id_row) {
      this.layoutUtilsService.showActionNotification('Chưa chọn đơn vị thực hiện', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
      return;
    }
    this.title = ele.value.toString().trim();
    const updatedegree = this.prepareCustomer();
    this.CreateTask(updatedegree, withBack);
  }

  AssignInsert(id_nv, loai) {
    var NV = new UserInfoModel();
    NV.id_user = id_nv;
    NV.loai = loai;
    return NV;
  }

  prepareCustomer() {
    var task = new WorkModel();
    // task = this.taskinsert;
    task.status = 0;
    task.title = this.title;
    task.id_project_team = this.ItemParentID.id_row;
    task.id_parent = this.id_parent;
    task.urgent = this.clickup_prioritize;
    task.Users = [];
    task.id_group = this.id_group;
    task.description = this.description_tiny;
    task.Attachments = [];
    let tag = [];

    this.tags.forEach(element => {
      let _tag = {
        id_tag: element.rowid,
        title: element.title,
        CategoryID: element.CategoryID,
        CategoryType: element.CategoryType,
        Is_important: element.Is_important,
        color: element.color,
      }
      tag.push(_tag)
    });
    task.Tags = tag;
    if (this.idmeeting) {
      task.MeetingID = this.idmeeting
    }
    if (this.estimates > 0) {
      task.estimates = this.estimates.toString();
    }
    if (this.giaocho) {
      task.Users.push(this.AssignInsert(this.giaocho.id_nv, 1));
    }
    // this.Assign.forEach(element => {
    //   var assign = this.AssignInsert(element.id_nv, 1);
    //   task.Users.push(assign);
    // });
    this.changeDetectorRefs.detectChanges();
    this.theodoi.forEach(element => {
      var follower = this.AssignInsert(element.id_nv, 2);
      task.Users.push(follower);
    });

    //  const start = moment()
    const start = moment();
    if (moment(this.selectedDate.startDate).format('MM/DD/YYYY') != "Invalid date")
      task.start_date = moment(this.selectedDate.startDate).utc().format('MM/DD/YYYY HH:mm:ss');
    if (moment(this.selectedDate.endDate).format('MM/DD/YYYY') != "Invalid date") {
      task.deadline = moment(this.selectedDate.endDate).utc().format('MM/DD/YYYY HH:mm:ss');
    }
    if (this.data._messageid && this.data._messageid > 0 && this.isTaskChat) {
      task.messageid = this.messageid;
      task.groupid = this.groupid;
    } else {
      task.messageid = 0;
      task.groupid = 0;
    }
    return task;
  }
  goBack() {
    this.dialogRef.close();
  }
  getMoreInformation(item): string {
    return item.hoten + ' - ' + item.username + ' \n ' + item.tenchucdanh;
  }
  RemoveAssign() {
    this.giaocho = '';
  }

  minimizeText(text) {
    if (text) {
      if (text.length > 60) {
        return text.slice(0, 60) + '...';
      }
      return text;
    }
  }
  RemoveTag(value) {
    let index = this.tags.indexOf(value);
    this.tags.splice(index, 1);
  }
  ItemSelectedTag(val: any) {
    if (this.tags.length > 0) {
      let index = this.tags.findIndex(i => i.rowid == val.rowid);
      if (index >= 0) {
        this.tags.splice(index, 1);
      } else {
        this.tags.push(val);
      }
    } else {
      this.tags.push(val);
    }
  }
  UpdateEstimates(event) {
    this.estimates = event;
  }
  GetTooltip() {
    if (this.startDate || this.endDate) {
      return 'Thời gian bắt đầu: ' + this.startDateFormat + ' - Deadline: ' + this.endDateFormat;
    } else {
      return this.translate.instant('jeework.chonthoigianbatdauketthuc')
    }
  }
  LoadGroupTask() {
    this.DanhMucChungService.lite_workgroup(this.ItemParentID.id_row).subscribe((res) => {
      if (res && res.status == 1) {
        this.ListGroup = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }
  UpdateGroup(id_row) {
    this.id_group = id_row;
  }
  LoadDepartmentFolder() {
    this.DanhMucChungService.Lite_WorkSpace_tree_By_User_New().subscribe((res) => {
      if (res && res.status == 1) {
        this.ListDepartmentFolder = res.data;
        if ((this.idmenu == "4" || Number(this.idProject) > 0) && this.ListDepartmentFolder.length > 0) {
          let id = Number(this.idProject)
          let indexfolder = -1;
          let indexproject = -1;
          this.ListDepartmentFolder.forEach(element => {
            if (element.folder.length > 0) {
              for (let f = 0; f < element.folder.length; f++) {
                indexfolder = element.folder[f].project.findIndex(t => t.id_row == id)
                if (indexfolder >= 0) {
                  this.selectedParent(element.folder[f].project[indexfolder]);
                  break;
                }
              }
            }
            else if (element.list.length > 0) {
              indexproject = element.list.findIndex(t => t.id_row == id)
              if (indexproject >= 0) {
                this.selectedParent(element.list[indexproject]);
              }
            }
          });
        }
        else if (this.ListDepartmentFolder.length > 0) {
          if (this.ListDepartmentFolder[0].folder.length > 0 && this.ListDepartmentFolder[0].folder[0].project.length > 0) {
            this.selectedParent(this.ListDepartmentFolder[0].folder[0].project[0]);
          }
          else if (this.ListDepartmentFolder[0].list.length > 0) {
            this.selectedParent(this.ListDepartmentFolder[0].list[0]);
          }

        }
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
      }
    });
  }
  IsChecked(item) {
    if (
      (item.RowID == this.ItemParentID.id_row || item.id_row == this.ItemParentID.id_row) &&
      item.type == this.ItemParentID.type
    ) {
      return true;
    } else {
      return false;
    }
  }
  selectedParent(item) {
    this.ItemParentID.id_row = item.id_row;
    this.ItemParentID.type = item.type;
    this.ItemParentID.requireAss = item.requireAssign;
    this.ItemParentID.IsAssignee = item.IsAssignee;
    this.ParentName = item.title;
    item.expanded = !item.expanded;
    this.ItemParentID.isGroupwork = item.isGroupwork;
    this.ItemParentID.isRole = item.isRole;
    this.id_group = 0;
    this.LoadGroupTask();
    this.changeDetectorRefs.detectChanges();
    this.DanhMucChungService.send$.next("LoadTaskGroup");
  }

  getStypeAssingeeIcon(item) {
    if (item.IsAssignee == 0) return 'red';
    else {
      if (item.requireAss == 1) return 'red';
      else {
        return '';
      }
    }
  }
}
export enum ModalType {
  INFO = 'info',
  WARN = 'warn',
}
