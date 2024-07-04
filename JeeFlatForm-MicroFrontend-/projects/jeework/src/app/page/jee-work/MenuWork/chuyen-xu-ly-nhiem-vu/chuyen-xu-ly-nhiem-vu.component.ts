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
import { WorkDraftModel, WorkModel } from '../../models/JeeWorkModel';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { DialogSelectdayComponent } from '../dialog-selectday/dialog-selectday.component';
import { MenuWorkService } from '../services/menu-work.services';
import {
  LayoutUtilsService,
  MessageType,
} from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { quillConfig } from '../../editor/Quill_config';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-chuyen-xu-ly-nhiem-vu',
  templateUrl: './chuyen-xu-ly-nhiem-vu.component.html',
  styleUrls: ['./chuyen-xu-ly-nhiem-vu.component.scss'],
})
export class ChuyenXuLyNhiemVuComponent implements OnInit {
  modalTitle: string;
  modalMessage: string;
  labelNGNV: string = '--- Chọn người giao ---';
  modalType: ModalType = ModalType.INFO;
  UserID: any;
  public quillConfig: {};
  listNguoiGiaoViec: any;
  public bankFilterCtrlNGNV: FormControl = new FormControl();
  idDuAn: any;
  labelDuAn: any;
  Assign: any;
  priority: any;
  selectedDate: any;
  title: string;
  Followers: any[];
  listDuAn: any;
  listNhiemVu: Array<any> = [];
  avatarFirst: any;
  description_tiny: any;
  nguoigiaonhiemvu: any;
  editorStyles = {
    'border': '1px solid #ccc',
    'min-height': '200px',
    'max-height': '200px',
    height: '100%',
    'font-size': '12pt',
    'overflow-y': 'auto',
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
  task: any;
  idDraft: any;
  taskDraft: any;
  list_priority: any;
  DocsID = 0;
  TenNhiemVu: string = '';
  ListDonViPhoiHop: any[] = [{
    donvi: '',
    type: '',
    userdonvi: '',
  }];
  w: string = "0";
  isGiaoVB: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<ChuyenXuLyNhiemVuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private auth: AuthService,
    public DanhMucChungService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    public congViecTheoDuAnService: MenuWorkService,
    private translate: TranslateService,
    private datePipe: DatePipe,
  ) {
    if (data.w != undefined) {
      this.w = data.w;
    }
    this.modalTitle = data.title;
    this.modalMessage = data.message;
    this.modalType = data.type;
    this.avatarFirst = { image: '', hoten: '' };
    if (data) {
      this.task = data.dataDetailTask;
    }
  }

  ngOnInit(): void {
    this.quillConfig = quillConfig;
    this.douutienintable = this.DanhMucChungService.list_priority;
    this.UserID =
      this.congViecTheoDuAnService.getAuthFromLocalStorage().user.customData[
        'jee-account'
      ].userID;
    this.LoadDataDuAn();
    this.LoadDataNguoiGiaoViec();
    this.listNhiemVu = [];
    this.listNhiemVu.push({
      sonhiemvu: 1,
      title: '',
      dept: '',
      user: '',
      startDate: '',
      endDate: this.f_convertDate(this.DMYtoMDY(this.task.deadline)),
      startDateFormat: '',
      endDateFormat: this.f_convertDate(this.DMYtoMDY(this.task.deadline)),
      clickup_prioritize: this.task.clickup_prioritize,
    });
    this.description_tiny = '';
  }

  LoadDataNguoiGiaoViec() {
    this.DanhMucChungService.list_gov_acc_join_dept('').subscribe((res) => {
      if (res && res.status === 1) {
        this.listNguoiGiaoViec = res.data;
        if (this.listNguoiGiaoViec.length > 0) {
          this.nguoigiaonhiemvu = this.listNguoiGiaoViec[0];
          this.labelNGNV =
            this.listNguoiGiaoViec[0].tenchucdanh +
            ' - ' +
            this.listNguoiGiaoViec[0].fullname;
        } else {
          let obj = this.listUser.find((x) => x.userid == this.UserID);
          if (obj) {
            this.nguoigiaonhiemvu = obj;
          }
        }
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  LoadDataDuAn() {
    this.DanhMucChungService.lite_project_by_manager().subscribe((res) => {
      if (res && res.status == 1) {
        if (res.data.length > 0) {
          this.listDuAn = res.data;
          if (this.listDuAn.length > 0) {
            // this.listNhiemVu[0].dept = this.listDuAn[0];//Thiên đóng 16/08/2023
          }
        }
      }
      this.changeDetectorRefs.detectChanges();
    });
  }

  getHeight() {
    let height = 0;
    height = window.innerHeight - 180;
    return height + 'px';
  }
  // ================================ket thuc load du lieu================================
  changeNGNV(val) { }
  stopPropagation(event) {
    event.stopPropagation();
  }
  ItemSelected(val: any) {
    this.labelNGNV = val.tenchucdanh + ' - ' + val.fullname;
    this.nguoigiaonhiemvu = val;
    this.changeDetectorRefs.detectChanges();
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
  UploadFileForm(evt) {
    let ind = 0;
    if (this.AttFile.length > 0) {
      ind = this.AttFile.length;
    }

    if (evt.target.files && evt.target.files[0]) {
      var filesAmount = evt.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          let base64Str = event.target.result;
          var metaIdx = base64Str.indexOf(';base64,');
          base64Str = base64Str.substr(metaIdx + 8);
          this.AttFile[ind].strBase64 = base64Str;
          ind++;
        };
        reader.readAsDataURL(evt.target.files[i]);
        this.AttFile.push({
          filename: evt.target.files[i].name,
          type: evt.target.files[i].name.split('.')[
            evt.target.files[i].name.split('.').length - 1
          ],
          strBase64: '',
          IsAdd: true,
          IsDel: false,
          IsImagePresent: false,
        });
      }
    }
  }
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

    this.changeDetectorRefs.detectChanges();
  }
  //=======================Nhiem vu=====================
  listGiaoCho: any[] = [];
  listGiaoCho_Finish: any[] = [];
  ThemNV() {
    this.listNhiemVu.push({
      sonhiemvu: this.listNhiemVu.length + 1,
      title: '',
      dept: {},
      user: '',
      startDate: '',
      endDate: this.f_convertDate(this.DMYtoMDY(this.task.deadline)),
      startDateFormat: '',
      endDateFormat: this.f_convertDate(this.DMYtoMDY(this.task.deadline)),
      clickup_prioritize: this.task.clickup_prioritize,
      nguoigiaonhiemvu: '',
    });
  }
  listUser: any[] = [];

  ReSetNhiemVu() {
    const ele = document.getElementById('txttitle') as HTMLInputElement;
    ele.value = '';
    this.title = '';
    this.Assign = [];
    this.Followers = [];
    this.selectedDate = {
      startDate: '',
      endDate: '',
    };
    this.priority = 0;
  }
  getOptions_Assign_Dynamic(data) {
    var options_assign: any = {
      showSearch: true,
      keyword: '',
      data: data,
    };
    return options_assign;
  }
  stopPropagation1(event) {
    event.stopPropagation();
  }
  requireAss: boolean = false;
  ItemSelected1(val: any, element) {
    //=========Check nếu đơn vị giao có trùng với đơn vị phối hợp
    let isFlag = true;
    this.requireAss = val.requireAssign;
    this.ListDonViPhoiHop.forEach(ele => {
      if (ele.donvi != "" && ele.donvi.id_row == val.id_row) {
        isFlag = false;
        return;
      }
    });
    if (isFlag) {
      if (element.dept.id_row == undefined) {
        this.ThemNV();
      }
      element.dept = val;
      element.user = '';
    } else {
      this.layoutUtilsService.showActionNotification(
        "Đơn vị được giao đã trùng với đơn vị phối hợp",
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
  }

  stopPropagation2(event) {
    event.stopPropagation();
  }

  ItemSelected2(val: any, element) {
    if (element.user.id_nv && element.user.id_nv == val.id_nv) {
      element.user = '';
      this.chonUser = false;
    } else {
      element.user = val;
      this.chonUser = true;
    }
  }
  chonUser: boolean = false;
  ItemSelectedDefault(val: any, element) {
    if (element.user.id_nv && element.user.id_nv == val.id_nv) {
      element.user = '';
    } else {
      element.user = val;
    }
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
  changeDoUuTienInTable(val, clickup_prioritize) {
    val.clickup_prioritize = Number(clickup_prioritize.value);
    this.changeDetectorRefs.detectChanges();
  }
  Selectdate(element) {
    this.selectedDate = {
      startDate: element.startDate,
      endDate: element.endDate,
    };
    const dialogRef = this.dialog.open(DialogSelectdayComponent, {
      width: '500px',
      data: this.selectedDate,
      panelClass: 'sky-padding-0',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (moment(result.startDate).format('MM/DD/YYYY') != 'Invalid date') {
          element.startDate = this.selectedDate.startDate;
          element.startDateFormat = moment(this.selectedDate.startDate).format(
            'MM/DD/YYYY'
          );
        }

        if (moment(result.endDate).format('MM/DD/YYYY') != 'Invalid date') {
          element.endDate = this.selectedDate.endDate;
          element.endDateFormat = moment(this.selectedDate.endDate).format(
            'MM/DD/YYYY'
          );
        }
      }
    });
  }

  dateTime: any;
  updateDate(day: Date, element) {
    if (moment(day).format('MM/DD/YYYY') != 'Invalid date') {
      element.endDate = moment(day).format(
        'MM/DD/YYYY'
      );
      element.endDateFormat = moment(day).format(
        'MM/DD/YYYY'
      );
    }
  }
  //typeSave 1-Lưu công việc, 2- lưu nháp
  onSubmit(withBack: boolean = false, typeSave = 1) {
    let isFlag = true;
    if (this.requireAss && !this.chonUser) {
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

    if (this.nguoigiaonhiemvu == '') {
      isFlag = false;
      this.layoutUtilsService.showActionNotification(
        this.translate.instant('jeework.vuilongchonnguoigiaonhiemvu'),
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

    if (this.TenNhiemVu == '') {
      if (typeSave == 2) {
        this.TenNhiemVu = '';
      } else {
        isFlag = false;
        this.layoutUtilsService.showActionNotification(
          this.translate.instant('jeework.nhiemvukhongduocbotrong'),
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
    }

    for (let index = 0; index < this.listNhiemVu.length; index++) {
      const element = this.listNhiemVu[index];
      if (element.dept.id_row != undefined) {
        if (element.endDate == '') {
          if (typeSave == 2) {
            element.endDate = '0001-01-01T00:00:00';
          } else {
            isFlag = false;
            this.layoutUtilsService.showActionNotification(
              this.translate.instant('jeework.hancuoikhongduocbotrong'),
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
        }
        if (this.task) {
          // kiem tra han chot
          let temp = this.task.deadline.split(' ', 2);
          let deadline = moment(element.endDate).format('DD/MM/YYYY');
          const date1 = this.process(deadline);
          const date2 = this.process(temp[1]);
          let check = date1 > date2;
          if (check) {
            isFlag = false;
            this.layoutUtilsService.showActionNotification(
              this.translate.instant('jeework.hancuoikhongduoclonhonhancuoicuacongvieccha') + '(' +
              temp[1] +
              ')',
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

          //kiem tra do uu tien
          let prioDad = this.task.clickup_prioritize;
          if (prioDad && prioDad != 0) {
            if (element.clickup_prioritize == 0 || element.clickup_prioritize > prioDad) {
              this.layoutUtilsService.showActionNotification(
                this.translate.instant('jeework.douutienphailonhondouutiencuacongvieccha'),
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
          }

        }
      }
    }

    if (isFlag) {
      const updatedegree = this.prepareCustomer();
      this.InserGovDoc(updatedegree, withBack, typeSave);
    }
  }

  process(date) {
    var parts = date.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
  }
  InserGovDoc(item, withBack: boolean, typeSave) {
    if (typeSave == 1) {
      this.CreateTask(item, withBack);
    }
  }

  CreateTask(val, withBack: boolean) {
    this.layoutUtilsService.showWaitingDiv();
    this.DanhMucChungService.InsertTask_Gov(val).subscribe((res) => {
      this.layoutUtilsService.OffWaitingDiv();
      if (res && res.status === 1) {
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
          this.isload = true;
          this.AttFile = [];
          this.description_tiny = '';
          this.TenNhiemVu = '';
          this.ListDonViPhoiHop = [{
            donvi: '',
            type: '',
            userdonvi: '',
          }];
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
  onChangeNote(val, element) {
    element.title = val.target.value;
  }
  removeNhiemVu(element) {
    const index = this.listNhiemVu.indexOf(element);
    this.listNhiemVu.splice(index, 1);
  }
  prepareCustomer(): WorkModel {
    let task = new WorkModel();
    let project = [];
    let user = [];
    this.listNhiemVu.forEach((element) => {
      user = [];
      if (element.user.id_nv != '' && element.user.id_nv != null) {
        let _user = {
          id_user: element.user.id_nv,
          loai: 1,
        };
        user.push(_user);
      }
      if (element.startDateFormat == '') {
        element.startDateFormat = moment(Date()).format('MM/DD/YYYY');
      }
      let _project = {
        id_project_team: element.dept.id_row,
        Users: user,
        title: this.TenNhiemVu,
        clickup_prioritize: element.clickup_prioritize,
        deadline: element.endDateFormat,
        start_date: element.startDateFormat,
        id_user_assign: element.user.id_nv, //tạm thời chỉ dùng cho work_draft
        Combinations: [],
      };
      this.ListDonViPhoiHop.forEach(ele => {
        if (ele.donvi != "") {
          let item = {
            ProjectID: ele.donvi.id_row,
            Type: 1,
            Assignee: 0,
          }
          _project.Combinations.push(item);
        }
      });

      if (element.dept.id_row != undefined) {
        project.push(_project);
      }
    });

    task.Projects = project;
    task.description = this.description_tiny;
    task.Attachments = this.AttFile;

    if (this.data._messageid && this.data._messageid > 0 && this.isTaskChat) {
      task.messageid = this.messageid;
      task.groupid = this.groupid;
    } else {
      task.messageid = 0;
      task.groupid = 0;
    }

    task.typeInsert = 2;
    task.IsGiaoVB = false;
    task.Userid_nguoigiao = +this.nguoigiaonhiemvu.userid;

    if (this.task) {
      task.SourceID = this.task.id_row;
      task.IsRelationshipTask = true;
    }
    task.DocsID = this.DocsID;
    return task;
  }
  isload: any;
  goBack() {
    this.dialogRef.close(this.isload);
  }
  getMoreInformation(item): string {
    return item.hoten + ' - ' + item.username + ' \n ' + item.tenchucdanh;
  }
  RemoveAssign(element) {
    element.user = '';
    this.chonUser = false;
  }

  minimizeText(text) {
    let cd = 35;
    let c = window.innerWidth;
    if (this.w == "40vw" && c < 1920) {
      if (c <= 1280) {
        cd = cd - 28;
      } else {
        cd = cd - 20;
      }
    }
    if (text) {
      if (text.length > cd) {
        return text.slice(0, cd) + '...';
      }
      return text;
    } else {
      return '--- Chọn đơn vị ---'
    }
  }

  //====================================bổ sung chức năng đơn vị phối hợp==================
  ItemSelectedDVPH(val: any, dvph, element) {
    //Kiểm tra đơn vị phối hợp có trùng với đơn vị giao hay không
    let isFlag1 = true;
    this.listNhiemVu.forEach(ele => {
      if (+ele.dept.id_row == +val.id_row) {
        isFlag1 = false;
        return;
      }
    });
    if (!isFlag1) {
      this.layoutUtilsService.showActionNotification(
        "Đơn vị phối hợp đã trùng với đơn vị được giao",
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

    let isFlag2 = true;
    this.ListDonViPhoiHop.forEach(element => {
      if (+element.donvi.id_row == +val.id_row) {
        isFlag2 = false;
      }
    });
    if (isFlag2) {
      dvph.donvi = val;
      dvph.userdonvi = '';
      //push thêm đơn vị phối hợp nếu có dùng
      let _count = 0;
      this.ListDonViPhoiHop.forEach(element => {
        if (element.donvi == "") {
          _count++;
        }
      });
      if (_count == 0) {
        this.ListDonViPhoiHop.push({
          donvi: '',
          type: '',
          userdonvi: '',
        });
      }
    } else {
      this.layoutUtilsService.showActionNotification(
        "Đơn vị phối hợp đã tồn tại",
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
  }

  minimizeTextDVPH(text) {
    if (text) {
      if (text.length > 35) {
        return text.slice(0, 35) + '...';
      }
      return text;
    } else {
      return '--- Chọn đơn vị ---';
    }
  }

  removeDVPH(dvph, element) {
    const index = element.indexOf(dvph);
    element.splice(index, 1);
  }

  //===================================================================
  f_convertDate(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
    }
  }

  DMYtoMDY(value) {
    const cutstring = value.toString().split('/');
    if (cutstring.length === 3) {
      return cutstring[1] + '/' + cutstring[0] + '/' + cutstring[2];
    }
    return value;
  }
}
export enum ModalType {
  INFO = 'info',
  WARN = 'warn',
}
