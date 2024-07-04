import { Component, OnInit, Input, Inject, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { quillConfig, formats } from '../../editor/Quill_config';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { TranslateService } from '@ngx-translate/core';
import { MenuWorkService } from '../services/menu-work.services';
import { FormatTimeService } from '../../services/jee-format-time.component';
import { FileUploadModel, UpdateModel } from '../../detail-task-v2-component/detail-task-v2-component.component';
import moment from 'moment';
import { environment } from 'projects/jeework/src/environments/environment';
declare var jQuery: any;
@Component({
  selector: 'app-editor-urges',
  templateUrl: './editor-urges.html',
  styleUrls: ['./editor-urges.scss']
})
export class EditorUrgesComponent implements OnInit, AfterViewInit {
  quillConfig = quillConfig;
  formats = formats;
  editorStyles = {
    'min-height': '200px',
    'max-height': '200px',
    'height': '100%',
    'font-size': '12pt',
    'overflow-y': 'auto',
    'border': '1px solid #ccc'
  };
  _data: any;
  _old_data: any;
  is_confirm: boolean;
  is_urges: boolean = false;
  statusname: string = '';
  checked: boolean = false;
  Type: string = "2";
  direction: string = "2";
  checkht: boolean = false;
  value: any;
  isCloseStatus: boolean = false;
  isDefault: boolean = false;//isdefault của trạng thái hoàn thành
  //Start================12/12/2023 - Thiên bổ sung code sử dụng cho CSSTech==========
  isUseVanBan: boolean = false;
  //End==================12/12/2023 - Thiên bổ sung code sử dụng cho CSSTech==========
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditorUrgesComponent>,
    private layoutUtilsService: LayoutUtilsService,
    public _danhmucChungServices: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    private translate: TranslateService,
    private _menuWorkServices: MenuWorkService,
    public _FormatTimeService: FormatTimeService,
  ) {
    this.isDefault = this.data.isDefault;
    this.statusname = this.data.statusname;
    this.id_task = this.data.id_task;
    if (this.data.ketqua == 'status') {
      this.value = this.data.value;
      this.checked = true;
      this._data = 'Hoàn thành';
      this.ProcessFinal = true;
      this.checkhtstatus = true;//disable nếu chọn trạng thái hoàn thành
    }
    if (this.data.ketqua == 'ketqua') { // Kiểm tra xem nếu người dùng chọn cập nhật kết quả thì auto check hoàn thành
      this.checked = true;
      this._data = 'Hoàn thành';
      this.ProcessFinal = true;
      this._old_data = this.data._value;
    }
    if (this.data.type != undefined && this.data.type == 4) {
      if (this.isDefault) {
        this.checkDocument = true;
      }
      if (this.isDefault || this.data.ketqua == 'progress') {
        this.checked = true;
        this.ProcessFinal = true;
        this.checkht = true; // dùng để disable nếu nhiệm vụ đã hoàn thành // Check xem có check hoàn thành chưa nếu có thì bắt buộc đính kèm các thông tin  
      }
    }
    let link = window.location.href.split('/')[2];
    if (link == environment.Key_Soffice) {
      this.isUseVanBan = false;
    } else {
      this.isUseVanBan = true;
    }
  }
  @Input() resutl: string;
  datanodes: any;
  checkDocument: boolean = false;
  checkhtstatus: boolean = false;
  ngAfterViewInit(): void {
    if (this.isUseVanBan) {
      setTimeout(() => {
        jQuery("input").on("change", function () {
          const ele3 = document.getElementById('txtngayvanban') as HTMLInputElement;
          let date = new Date();
          this.setAttribute(
            "data-date",
            moment(ele3 ? ele3.value : date.getFullYear() +
              '-' +
              ('0' + (date.getMonth() + 1)).slice(-2) +
              '-' +
              ('0' + date.getDate()).slice(-2), "YYYY-MM-DD")
              .format(this.getAttribute("data-date-format"))
          )
        }).trigger("change")
      }, 200);
    }
  }
  ngOnInit() {
    // if (this.data.ketqua != 'ketqua' && this.data.ketqua != 'status') {
    //   this._data = this.data._value;
    //   this._old_data = this.data._value;
    // }
    if (this.is_urges) {

      this._menuWorkServices.ListUrdesTask(this.id_task).subscribe(res => {
        if (res && res.status == 1) {
          if (res.data && res.data.length > 0) {
            this.datanodes = res.data;
          }
        } else {
          this.datanodes = [];
        }
        this.changeDetectorRefs.detectChanges();
      });
      if (this.data.isUrges) {
        setTimeout(() => {
          this.loadDefaultData();
        }, 200);
      }
    }
  }
  Close() {
    this.dialogRef.close();
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
  preview(file) {
    let obj = file.filename.split('.')[file.filename.split('.').length - 1];
    if (file.isImage || file.type == 'png') {
      this.DownloadFile(file.path);
    } else if(obj == 'pdf') {
      this.layoutUtilsService.ViewDoc2(file.path,'google');
      // alert('chức năng đang lỗi');
    }
    else{
      this.layoutUtilsService.ViewDoc2(file.path,'office');
    }
  }

  DownloadFile(link) {
    window.open(link);
  }
  Save() {
    if (this._data == null) {
      this._data = "";
    }

    if (this.is_urges) {
      if (this.AttFile.length == 0) {
        this.layoutUtilsService.showActionNotification(
          "Bạn chưa đính kèm file",
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
      if (this.isUseVanBan) {
        const ele2 = document.getElementById('txtsokyhieu') as HTMLInputElement;
        if (ele2.value.toString().trim() == '') {
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
        if (ele_nguoiky.value.toString().trim() == '') {
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
        const ele4 = document.getElementById('txttrichyeu') as HTMLInputElement;
        if (ele4.value.toString().trim() == '') {
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
      this.update();
    } else {
      this.dialogRef.close({
        _result: this._data,
      });
    }
  }
  onChangeNote() {
    if (this._data != this._old_data) {
      this.is_confirm = true;
    } else {
      this.is_confirm = false;
    }
  }
  ThemTaiLieu(val) {
    val.click();
  }
  id_task: any;
  TenFile = '';
  File = '';
  IsShow_Result = false;
  Result = '';
  values = new Array<FileUploadModel>();
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
  update() {
    this.evt_file.delete('UpdateModel');
    let model = new UpdateModel();
    model.emty();
    model.key = 'urges';
    model.value = this._data;
    model.id_row = this.id_task;
    model.values = [];
    model.ProcessFinal = this.ProcessFinal;
    if (this.isUseVanBan) {
      const ele2 = document.getElementById('txtsokyhieu') as HTMLInputElement;
      model.SoVB_Result = ele2.value;
      const ele3 = document.getElementById('txtngayvanban') as HTMLInputElement;
      model.NgayVB_Result = ele3.value;
      const ele4 = document.getElementById('txttrichyeu') as HTMLInputElement;
      model.TrichyeuVB_Result = ele4.value;
      const ele_nguoiky = document.getElementById('txtnguoiky') as HTMLInputElement;
      model.NguoikyVB_Result = ele_nguoiky.value;
    }
    this.evt_file.append('UpdateModel', JSON.stringify(model));
    this._danhmucChungServices.updateTaskformData(this.evt_file).subscribe(res => {
      if (res && res.status == 1) {
        this.layoutUtilsService.showActionNotification(
          'Cập nhật đôn đốc thành công',
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          'top',
          1
        );
        this.dialogRef.close({
          _result: model,
        });
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
  ProcessFinal: boolean = false;

  @ViewChild('myInput') myInput;
  selectFile() {
    let el: HTMLElement = this.myInput.nativeElement as HTMLElement;
    el.click();
  }
  AttFile: any[] = [];
  // UploadFileForm(evt) {
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
  loadDefaultData() {
    if (this.isUseVanBan) {
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
    }
  }
}
