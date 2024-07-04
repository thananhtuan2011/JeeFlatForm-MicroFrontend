import {
  AfterViewInit,
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
import { AlternativeKeywordListComponent } from '../alternative-keyword-list/alternative-keyword-list.component';
import { UploadFileService } from '../../service-upload-files/service-upload-files.service';
declare var jQuery: any;
@Component({
  selector: 'app-them-moi-cong-viec-ver2',
  templateUrl: './them-moi-cong-viec-ver2.component.html',
  styleUrls: ['./them-moi-cong-viec-ver2.component.scss'],
})
export class ThemMoiCongViecVer2Component implements OnInit, AfterViewInit {
  idmeeting: number;
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
  w: string = "0";
  isGiaoVB: boolean = true;
  //============================================================
  listDataNhiemVu: Array<any> = [];
  constructor(
    public dialogRef: MatDialogRef<ThemMoiCongViecVer2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    // private auth: AuthService,
    public DanhMucChungService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    public congViecTheoDuAnService: MenuWorkService,
    private translate: TranslateService,
    private _UploadFileService:UploadFileService
  ) {
    if (data.w != undefined) {
      this.w = data.w;
    }
    this.modalTitle = data.title;
    this.modalMessage = data.message;
    this.modalType = data.type;
    this.idDraft = data.idDraft;
    // this.UserID = this.auth;
    this.avatarFirst = { image: '', hoten: '' };
    if (data) {
      this.task = data.dataDetailTask;
    }

    if (data.idMeeting) {
      this.idmeeting = data.idMeeting;
    }
  }

  ngAfterViewInit(): void {
    jQuery("input").on("change", function () {
      const ele3 = document.getElementById('txtngayvanban') as HTMLInputElement;
      this.setAttribute(
        "data-date",
        moment(ele3.value, "YYYY-MM-DD")
          .format(this.getAttribute("data-date-format"))
      )
    }).trigger("change")
  }

  ngOnInit(): void {
    this.DanhMucChungService.getthamso();
    this.loadDataDonViGiaoNhiemVu();
    this.quillConfig = quillConfig;
    this.douutienintable = this.DanhMucChungService.list_priority;
    this.UserID =
      this.congViecTheoDuAnService.getAuthFromLocalStorage().user.customData[
        'jee-account'
      ].userID;
    this.loadDefaultData();
    // this.LoadDataNguoiGiaoViec(); //Thiên đóng 1/11/2023
    this.listNhiemVu = [];
    this.listNhiemVu.push({
      sonhiemvu: 1,
      title: '',
      dept: '',
      user: '',
      startDate: '',
      endDate: '',
      startDateFormat: '',
      endDateFormat: '',
      clickup_prioritize: 0,
      requireAss : 0,
      IsAssignee:0,
    });
    this.theodoi = [];
    if (this.idDraft) {
      this.loadDetailDraft();
    }
    this.description_tiny = '';
    //=========Xử lý giao diện ngày 31/10/2023=========
    this.loadDataNhiemVu();
    //=========Xử lý công việc lặp lại 13/12/2023======
    this.LoadDataTuan_Thang();
  }

  // ================================load du lieu================================
  loadDefaultData() {
    const ele2 = document.getElementById('txtsokyhieu') as HTMLInputElement;
    ele2.value = '';
    const ele4 = document.getElementById('txttrichyeu') as HTMLInputElement;
    ele4.value = '';
    let date = new Date();
    const ele3 = document.getElementById('txtngayvanban') as HTMLInputElement;
    ele3.value =
      date.getFullYear() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2);
    const ele_nguoiky = document.getElementById('txtnguoiky') as HTMLInputElement;
    ele_nguoiky.value = "";
    const ele_donvibanhanh = document.getElementById('txtdonvitrinhbanhanh') as HTMLInputElement;
    ele_donvibanhanh.value = "";
    if (this.task) {
      ele2.value = this.task.Gov_SoHieuVB;
      ele4.value = this.task.Gov_TrichYeuVB;
      ele3.value = moment(this.task.Gov_NgayVB).format('yyyy-MM-DD');
      this.isGiaoVB = this.task.IsGiaoVB;
      ele_nguoiky.value = this.task.Gov_Nguoiky;
      ele_donvibanhanh.value = this.task.Gov_Donvibanhanh;
    }
  }
  LoadDataNguoiGiaoViec() {
    this.DanhMucChungService.list_gov_acc_join_dept('', this.donvigiaogiaonhiemvu.id_row).subscribe((res) => {
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

  loadDetailDraft() {
    this.DanhMucChungService.getDetailDraft(this.idDraft).subscribe((res) => {
      if (res && res.status === 1) {
        this.taskDraft = res.data[0];
        const ele2 = document.getElementById('txtsokyhieu') as HTMLInputElement;
        const ele4 = document.getElementById('txttrichyeu') as HTMLInputElement;
        const ele3 = document.getElementById('txtngayvanban') as HTMLInputElement;
        if (this.taskDraft) {
          ele2.value = this.taskDraft.Gov_SoHieuVB;
          ele4.value = this.taskDraft.Gov_TrichYeuVB;
          ele3.value = moment(this.taskDraft.Gov_NgayVB).format('yyyy-MM-DD');
          this.nguoigiaonhiemvu = this.taskDraft.Assignor;
          this.labelNGNV =
            this.taskDraft.Assignor.tenchucdanh +
            ' - ' +
            this.taskDraft.Assignor.fullname;
          this.listNhiemVu = [];
          for (let index = 0; index < this.taskDraft.Project.length; index++) {
            const element = this.taskDraft.Project[index];

            this.listNhiemVu.push({
              sonhiemvu: index + 1,
              id_row: element.id_row,
              title: element.title,
              dept: { title_full: element.labelDuAn, id_row: element.idDuAn },
              user: element.Assign,
              startDate: element.startDate,
              endDate: element.endDate,
              startDateFormat: moment(element.startDate).format(
                'MM/DD/YYYY'
              ),
              endDateFormat: moment(element.endDate).format(
                'MM/DD/YYYY'
              ),
              clickup_prioritize: element.priority,
            });
          }
          this.DocsID = this.taskDraft.DocsID;
        }

        this.changeDetectorRefs.detectChanges();


      }
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
  uploadfile(id,type) {
    this._UploadFileService.upload_file(this.evt_file, type, id).subscribe(res => {
      if (res.status == 1) {
        console.log("upload-success")
      }
    });
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
  listGiaoCho: any[] = [];
  listGiaoCho_Finish: any[] = [];
  ThemNV(element) {
    element.listNhiemVu.push({
      sonhiemvu: element.listNhiemVu.length + 1,
      title: '',
      dept: {},
      user: '',
      startDate: '',
      endDate: '',
      startDateFormat: '',
      endDateFormat: '',
      clickup_prioritize: 0,
      nguoigiaonhiemvu: '',
      requireAss: 0,
      IsAssignee:0,
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
  requireAss: number = 0;
  IsAssignee:number=0;
  ItemSelectedProject(val: any, element, list) {
    //=========Check nếu đơn vị giao có trùng với đơn vị phối hợp
    let isFlag = true;
    this.requireAss = val.requireAssign;
    this.IsAssignee=val.IsAssignee;
    list.ListDonViPhoiHop.forEach(ele => {
      if (ele.donvi != "" && ele.donvi.id_row == val.id_row) {
        isFlag = false;
        return;
      }
    });
    if (isFlag) {
      if (element.dept.id_row == undefined) {
        this.ThemNV(list);
      }
      element.dept = val;
      element.user = '';
      element.endDate = this.task ? this.f_convertDate(this.task.deadline) : '';
      element.endDateFormat = this.task ? this.f_convertDate(this.task.deadline) : '';
      element.clickup_prioritize = this.task ? this.task.clickup_prioritize : 0;
      element.requireAss = val.requireAssign;
      element.IsAssignee=val.IsAssignee;
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
    if ((this.requireAss == 1 && this.IsAssignee == 1) && !this.chonUser) {
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

    if (this.isGiaoVB) { //check giao nv có vb
      const ele2 = document.getElementById('txtsokyhieu') as HTMLInputElement;
      if (ele2.value.length > 50) {
        this.layoutUtilsService.showActionNotification(
          this.translate.instant('jeework.sokyhieuvanbankhongduoclonhon50kytu'),
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
      if (ele2.value.toString().trim() == '') {
        isFlag = false;
        this.layoutUtilsService.showActionNotification(
          this.translate.instant('jeework.sokyhieuvanbankhongduocbotrong'),
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
      const ele3 = document.getElementById('txtngayvanban') as HTMLInputElement;
      if (ele3.value.toString().trim() == '') {
        isFlag = false;
        this.layoutUtilsService.showActionNotification(
          this.translate.instant('jeework.ngayvanbankhongduocbotrong'),
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
      const ele_nguoiky = document.getElementById('txtnguoiky') as HTMLInputElement;
      if (ele_nguoiky.value.length > 200) {
        this.layoutUtilsService.showActionNotification(
          this.translate.instant('jeework.nguoikykhongduoclonhon200kytu'),
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
      if (ele_nguoiky.value.toString().trim() == '') {
        isFlag = false;
        this.layoutUtilsService.showActionNotification(
          this.translate.instant('jeework.nguoikykhongduocbotrong'),
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
      const ele_donvibanhanh = document.getElementById('txtdonvitrinhbanhanh') as HTMLInputElement;
      if (ele_donvibanhanh.value.length > 200) {
        this.layoutUtilsService.showActionNotification(
          this.translate.instant('jeework.donvibanhanhkhongduoclonhon200kytu'),
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
      const ele_tennhiemvu = document.getElementById('txttitle') as HTMLInputElement;
      if (ele_tennhiemvu.value.length > 500) {
        this.layoutUtilsService.showActionNotification(
          this.translate.instant('jeework.tennhiemvukhongduoclonhon500kytu'),
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
      const ele4 = document.getElementById('txttrichyeu') as HTMLInputElement;
      if (ele4.value.toString().trim() == '') {
        isFlag = false;
        this.layoutUtilsService.showActionNotification(
          this.translate.instant('jeework.trichyeuvanbankhongduocbotrong'),
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
    for (let i = 0; i < this.listDataNhiemVu.length; i++) {
      const element = this.listDataNhiemVu[i];
      if (element.title == '') {
        if (typeSave == 2) {
          element.title = '';
        } else {
          isFlag = false;
          // alert('Nhiệm vụ không được bỏ trống');
          this.layoutUtilsService.showActionNotification(
            "Tên nhiêm vụ không được bỏ trống",
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
      if (this.listDataNhiemVu[i].listNhiemVu.length == 1) {
        isFlag = false;
        this.layoutUtilsService.showActionNotification(
          this.translate.instant('jeework.vuilongchondonviduocgiaocho'),
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
      for (let index = 0; index < this.listDataNhiemVu[i].listNhiemVu.length; index++) {
        const element = this.listDataNhiemVu[i].listNhiemVu[index];
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
    }

    if (this.isBaoCaoDinhKy) { //check nếu có áp dụng báo cáo định kỳ 
      if (this.title_repeat == '') {
        isFlag = false;
        this.layoutUtilsService.showActionNotification(
          "Tên nhiêm vụ lặp lại không được bỏ trống",
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

      if (this.idChuKy == 0) {
        this.layoutUtilsService.showActionNotification(
          this.translate.instant('jeework.vuilongchonchukylap'),
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          'top',
          0
        );
        return;
      } else {
        if (this.TuNgayLapCK == "" || this.DenNgayLapCK == "") {
          this.layoutUtilsService.showActionNotification(
            this.translate.instant('jeework.vuilongchonthoigianlap'),
            MessageType.Read,
            9999999999,
            true,
            false,
            3000,
            'top',
            0
          );
          return;
        } else {
          let date = new Date(moment(new Date()).format('MM/DD/YYYY'));
          let date_TuNgay = new Date(this.TuNgayLapCK);
          let date_DenNgay = new Date(this.DenNgayLapCK);
          if (date_TuNgay < date) {
            this.layoutUtilsService.showActionNotification(
              this.translate.instant('jeework.tungaykhonghople'),
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
          if (date_DenNgay < date_TuNgay) {
            this.layoutUtilsService.showActionNotification(
              this.translate.instant('jeework.thoigianlapkhonghople'),
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
        if (this.idChuKy == 1) {
          let obj = this.check_weekdays.filter(x => x.Checked);
          if (obj && obj.length <= 0) {
            this.layoutUtilsService.showActionNotification(
              this.translate.instant('jeework.vuilongchoncacngaylap'),
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
        if (this.idChuKy == 2) {
          let obj = this.dayofmonth.filter(x => x.Checked);
          if (obj && obj.length <= 0) {
            this.layoutUtilsService.showActionNotification(
              this.translate.instant('jeework.vuilongchoncacngaylap'),
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
    } else {
      this.layoutUtilsService.showWaitingDiv();
      this.DanhMucChungService.Insert_Gov_Docs(item).subscribe((res) => {
        this.layoutUtilsService.OffWaitingDiv();
        if (res && res.status === 1) {
          item.DocsID = res.data;
          const updatedegree1 = this.prepareDraftCustomer();
          updatedegree1.DocsID = res.data;
          // this.CreateTaskDraft(updatedegree1, withBack);
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
  }
  CreateTaskDraft(val: WorkDraftModel, withBack: boolean) {
    this.layoutUtilsService.showWaitingDiv();

    this.DanhMucChungService.InsertTask_Gov_Draft(val).subscribe((res) => {
      this.layoutUtilsService.OffWaitingDiv();
      if (res && res.status === 1) {

        if (this.idDraft > 0) {
          this.layoutUtilsService.showActionNotification(
            'Cập nhật thành công',
            MessageType.Read,
            9999999999,
            true,
            false,
            3000,
            'top',
            1
          );
        } else {
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
        }



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
  prepareDraftCustomer(): WorkDraftModel {
    const task = new WorkDraftModel();
    let project = [];
    let user = [];
    this.listNhiemVu.forEach((element) => {
      let _project = {
        id_row: element.id_row,
        id_project_team: element.dept.id_row,
        Users: user,
        title: this.TenNhiemVu,
        clickup_prioritize: element.clickup_prioritize,
        deadline: element.endDateFormat,
        start_date: element.startDateFormat,
        id_user_assign: element.user.id_nv, //tạm thời chỉ dùng cho work_draft
        Combinations: [],
      };

      // this.ListDonViPhoiHop.forEach(ele => {
      //   if (ele.donvi != "") {
      //     let item = {
      //       ProjectID: ele.donvi.id_row,
      //       Type: 1,
      //       Assignee: 0,
      //     }
      //     _project.Combinations.push(item);
      //   }
      // });

      if (element.dept.id_row != undefined) {
        project.push(_project);
      }
    });

    task.Projects = project;


    task.description = this.description_tiny;

    task.Attachments = this.AttFile;
    task.id_row = this.idDraft;
    return task;
  }
  CreateTask(val, withBack: boolean) {
    this.layoutUtilsService.showWaitingDiv();
    this.DanhMucChungService.InsertTask_Gov(val).subscribe((res) => {
      this.layoutUtilsService.OffWaitingDiv();
      if (res && res.status === 1) {
        if (this.AttFile.length > 0) {        
          if(res.data.DocsID && res.data.DocsID != 0){
            this.uploadfile(res.data.DocsID,5)
          }
          else{
            if(res.data.Projects && res.data.Projects.length >0){
              res.data.Projects.forEach(element=>{
                this.uploadfile(element.id_row,1)
              })
            }        
          }
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
          this.isload = true;
          this.description_tiny = '';
          //Chỉnh sửa theo yêu cầu mới (08/11/2023) khi lưu tiếp tục chỉ xóa thông tin nhiệm vụ
          this.loadDataNhiemVu();
          //Chỉnh sửa theo yêu cầu mới (13/12/2023 - Thiên) Xử lý code báo cáo định kỳ
          this.LoadDataTuan_Thang();
          this.clearDataChuKy();
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
  removeNhiemVu(element, list) {
    const index = list.listNhiemVu.indexOf(element);
    list.listNhiemVu.splice(index, 1);
  }
  prepareCustomer(): WorkModel {
    let task = new WorkModel();
    let project = [];
    let user = [];
    this.listDataNhiemVu.forEach(list => {

      list.listNhiemVu.forEach((element) => {
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
        //=====Xử lý data người theo dõi====
        if (this.theodoi && this.theodoi.length > 0) {
          this.theodoi.forEach(ele => {
            let _user = {
              id_user: ele.id_nv,
              loai: 2,
            };
            user.push(_user);
          });
        }
        let _project = {
          id_project_team: element.dept.id_row,
          Users: user,
          title: list.title,
          clickup_prioritize: element.clickup_prioritize,
          deadline: element.endDateFormat,
          start_date: element.startDateFormat,
          id_user_assign: element.user.id_nv, //tạm thời chỉ dùng cho work_draft
          Combinations: [],
        };
        list.ListDonViPhoiHop.forEach(ele => {
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

    })


    task.Projects = project;
    task.description = this.description_tiny;
    task.Attachments = [];

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
    task.DepartmentID = +this.donvigiaogiaonhiemvu.id_row;
    if (this.isGiaoVB) {
      task.IsGiaoVB = true;
      //Bổ sung thêm 4 field thông tin
      const ele2 = document.getElementById('txtsokyhieu') as HTMLInputElement;
      task.Gov_SoHieuVB = ele2.value;
      const ele3 = document.getElementById('txtngayvanban') as HTMLInputElement;
      task.Gov_NgayVB = moment(ele3.value).utc().format('MM/DD/YYYY HH:mm:ss');
      const ele4 = document.getElementById('txttrichyeu') as HTMLInputElement;
      task.Gov_TrichYeuVB = ele4.value;

      //Bổ sung thêm 2 field thông tin = Ngày 22/09/2023
      const ele_nguoiky = document.getElementById('txtnguoiky') as HTMLInputElement;
      task.Gov_Nguoiky = ele_nguoiky.value;
      const ele_donvibanhanh = document.getElementById('txtdonvitrinhbanhanh') as HTMLInputElement;
      task.Gov_Donvibanhanh = ele_donvibanhanh.value;
    }

    if (this.task) {
      task.SourceID = this.task.id_row;
      task.IsRelationshipTask = true;
    }
    task.DocsID = this.DocsID;

    if (this.idmeeting) {
      task.MeetingID = this.idmeeting
    }
    if (this.isBaoCaoDinhKy) {//Có áp dụng báo cáo định kỳ 
      task.IsRepeated = true;
      task.frequency = this.idChuKy;
      let _ngaylaplai = "";
      if (this.idChuKy == 1) {
        this.check_weekdays.forEach(element => {
          if (element.Checked) {
            _ngaylaplai += "," + element.Code;
          }
        });
      }
      if (this.idChuKy == 2) {
        this.dayofmonth.forEach(element => {
          if (element.Checked) {
            _ngaylaplai += "," + element.Code;
          }
        });
      }
      task.repeated_day = _ngaylaplai.substring(1);
      task.First_StartDate = this.TuNgayLapCK;
      task.First_EndDate = this.DenNgayLapCK;
      task.IsActive = 1;
      task.title_repeat = this.title_repeat;
      task.Expired_Type = this.Expired_Type;
      task.Expired_Value = this.Expired_Value;
      task.Expired_Period = this.Expired_Period;
    } else {
      task.IsRepeated = false;
    }
    return task;
  }
  isload: any;
  goBack() {
    this.dialogRef.close(this.isload);
  }
  Openkey() {
    const dialogRef = this.dialog.open(AlternativeKeywordListComponent, {
      width: '50rem',
      height: '50rem',
      panelClass: 'alternative-keyword',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
      }
    });
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
      return '--- Chọn đơn vị ---';
    }
  }

  //====================================bổ sung chức năng đơn vị phối hợp==================
  ItemSelectedDVPH(val: any, dvph, element) {
    //Kiểm tra đơn vị phối hợp có trùng với đơn vị giao hay không
    let isFlag1 = true;
    element.listNhiemVu.forEach(ele => {
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
    element.ListDonViPhoiHop.forEach(element => {
      if (+element.donvi.id_row == +val.id_row) {
        isFlag2 = false;
      }
    });
    if (isFlag2) {
      dvph.donvi = val;
      dvph.userdonvi = '';
      //push thêm đơn vị phối hợp nếu có dùng
      let _count = 0;
      element.ListDonViPhoiHop.forEach(element => {
        if (element.donvi == "") {
          _count++;
        }
      });
      if (_count == 0) {
        element.ListDonViPhoiHop.push({
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

  //=================================Bổ sung chọn người theo dõi=======================
  theodoi: any[];
  theodoi_default: any;
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

  ItemSelectedTheoDoiDefault(val: any) {
    if (this.idDraft != undefined && this.idDraft != null && +this.idDraft > 0) {
      this.chonUser = false;
    } else {
      this.theodoi = [];
      this.theodoi.push(val);
      this.theodoi_default = val;
    }
  }
  //==//=========Xử lý giao diện ngày 31/10/2023===========//===//
  loadDataNhiemVu() {
    this.listDataNhiemVu = [];
    this.listDataNhiemVu.push({
      stt: 1,
      title: '',
      listNhiemVu: [{
        sonhiemvu: 1,
        title: '',
        dept: '',
        user: '',
        startDate: '',
        endDate: '',
        startDateFormat: '',
        endDateFormat: '',
        clickup_prioritize: 0,
      }],
      ListDonViPhoiHop: [{
        donvi: '',
        type: '',
        userdonvi: '',
      }],
    });
  }

  removeDataNhiemVu(element) {
    const index = this.listDataNhiemVu.indexOf(element);
    this.listDataNhiemVu.splice(index, 1);
  }

  ThemDataNV() {
    this.listDataNhiemVu.push({
      stt: this.listDataNhiemVu.length + 1,
      title: '',
      listNhiemVu: [{
        sonhiemvu: 1,
        title: '',
        dept: '',
        user: '',
        startDate: '',
        endDate: '',
        startDateFormat: '',
        endDateFormat: '',
        clickup_prioritize: 0,
      }],
      ListDonViPhoiHop: [{
        donvi: '',
        type: '',
        userdonvi: '',
      }],
    });
  }
  //======Thêm đơn vị giao=====
  labelDVGNV: string = '--- Chọn đơn vị giao ---';
  donvigiaogiaonhiemvu: any;
  listDonViGiaoNhiemVu: any[] = [];
  idDept: number = 0;
  ItemSelectedDVGNV(val: any) {
    this.labelDVGNV = val.title;
    this.donvigiaogiaonhiemvu = val;
    this.idDept = val.id_row;
    this.LoadDataNguoiGiaoViec();
    this.loadDataNhiemVu();
    this.changeDetectorRefs.detectChanges();
  }

  loadDataDonViGiaoNhiemVu() {
    this.DanhMucChungService.list_department_gov_rule42().subscribe((res) => {
      if (res && res.status === 1) {
        this.listDonViGiaoNhiemVu = res.data;
        if (this.listDonViGiaoNhiemVu.length > 0) {
          this.donvigiaogiaonhiemvu = this.listDonViGiaoNhiemVu[0];
          this.labelDVGNV = this.listDonViGiaoNhiemVu[0].title;
          this.idDept = this.listDonViGiaoNhiemVu[0].id_row;
          this.LoadDataNguoiGiaoViec();
        }
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  f_convertDate(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
    }
  }

  //==============================Xử lý code báo cáo định kỳ - 13/12/2023 (Thiên)==============
  isBaoCaoDinhKy: boolean = false;
  show_frequency: boolean = false;
  labelChuKy: string = '--- Chọn chu kỳ lặp ---';
  idChuKy: number = 0;
  TuNgayLapCK: string = "";
  DenNgayLapCK: string = "";
  check_weekdays: any[] = [];
  list_weekdays: any[] = [
    {
      Code: "2",
      Title: this.translate.instant("day.thu2"),
    },
    {
      Code: "3",
      Title: this.translate.instant("day.thu3"),
    },
    {
      Code: "4",
      Title: this.translate.instant("day.thu4"),
    },
    {
      Code: "5",
      Title: this.translate.instant("day.thu5"),
    },
    {
      Code: "6",
      Title: this.translate.instant("day.thu6"),
    },
    {
      Code: "7",
      Title: this.translate.instant("day.thu7"),
    },
    {
      Code: "8",
      Title: this.translate.instant("day.chunhat"),
    }];
  dayofmonth: any = [];
  isActive: boolean = false;
  LoadDataTuan_Thang() {
    this.check_weekdays = [];
    this.dayofmonth = [];
    for (var i = 0; i < this.list_weekdays.length; i++) {
      var bool = false;
      this.check_weekdays.push({
        Code: this.list_weekdays[i].Code,
        Title: this.list_weekdays[i].Title,
        Checked: bool,
      });
    }
    for (let i = 1; i < 32; i++) {
      var bool = false;
      this.dayofmonth.push({
        Code: i,
        Checked: bool,
      });
    }
  }

  Change_frequency(id: any, title: string) {
    if (id > 1) {
      this.show_frequency = true;
    } else {
      this.show_frequency = false;
    }
    this.labelChuKy = title;
    this.idChuKy = id;
    this.changeDetectorRefs.detectChanges();

  }

  SelectdateCK() {
    this.selectedDate = {
      startDate: new Date(this.TuNgayLapCK),
      endDate: new Date(this.DenNgayLapCK),
    };
    const dialogRef = this.dialog.open(DialogSelectdayComponent, {
      width: '500px',
      data: this.selectedDate,
      panelClass: 'sky-padding-0',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        if (moment(result.startDate).format('MM/DD/YYYY') != 'Invalid date') {
          this.TuNgayLapCK = this.selectedDate.startDate;
          this.TuNgayLapCK = moment(this.selectedDate.startDate).format(
            'MM/DD/YYYY'
          );
        } else {
          this.TuNgayLapCK = "";
        }

        if (moment(result.endDate).format('MM/DD/YYYY') != 'Invalid date') {
          this.DenNgayLapCK = this.selectedDate.endDate;
          this.DenNgayLapCK = moment(this.selectedDate.endDate).format(
            'MM/DD/YYYY'
          );
        } else {
          this.DenNgayLapCK = "";
        }
      }
    });
  }

  Checked(id: string, check: any) {
    for (var i = 0; i < this.check_weekdays.length; i++) {
      if (id == this.check_weekdays[i].Code) {
        this.check_weekdays[i].Checked = check;
      }
    }
  }

  CheckedMonth(id: string, check: any) {
    for (var i = 0; i < this.dayofmonth.length; i++) {
      if (id == this.dayofmonth[i].Code) {
        this.dayofmonth[i].Checked = check;
      }
    }
  }

  clearDataChuKy() {
    this.idChuKy = 0;
    this.labelChuKy = "--- Chọn chu kỳ lặp ---";
    this.TuNgayLapCK = "";
    this.DenNgayLapCK = "";
  }

  changeBaoCaoDinhKy(val) {
    if (val.checked) {
      this.TuNgayLapCK = moment(new Date()).format(
        'MM/DD/YYYY'
      );
    } else {
      this.TuNgayLapCK = "";
    }
  }

  //=============Bổ sung giao diện báo cáo định kỳ - 20/12/2023=========================
  title_repeat: string = "";
  Expired_Type: string = "1";
  label_Expired_Type: string = "Sau ngày bắt đầu";
  Expired_Value: string = "1";
  Expired_Period: string = "1";
  label_Expired_Period: string = "Ngày";

  Change_Expired_Type(id: any, title: string) {
    this.label_Expired_Type = title;
    this.Expired_Type = id;
    this.changeDetectorRefs.detectChanges();
  }

  Change_Expired_Period(id: any, title: string) {
    this.label_Expired_Period = title;
    this.Expired_Period = id;
    this.changeDetectorRefs.detectChanges();
  }

  checkValue(e: any) {
    if (!((e.keyCode >= 48 && e.keyCode <= 57))
      || (e.keyCode >= 96 && e.keyCode <= 105)) {
      e.preventDefault();
    }
  }
  getStypeAssingeeIcon(item){
    if(item.IsAssignee==0) return 'red';
    else{
      if(item.requireAss==1) return 'red';
      else{
        return '';
      }
    }
  }
  
}
export enum ModalType {
  INFO = 'info',
  WARN = 'warn',
}
