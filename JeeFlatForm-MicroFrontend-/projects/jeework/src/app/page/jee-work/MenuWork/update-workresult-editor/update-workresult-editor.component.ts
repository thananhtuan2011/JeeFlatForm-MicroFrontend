import { Component, OnInit, Input, Inject, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { quillConfig, formats } from '../../editor/Quill_config';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { TranslateService } from '@ngx-translate/core';
import { FormatTimeService } from '../../services/jee-format-time.component';
import { FileUploadModel, UpdateModel } from '../../detail-task-v2-component/detail-task-v2-component.component';
import { AttachmentModel } from '../../detail-task-component/detail-task-component.component';
import { MenuWorkService } from '../services/menu-work.services';
import { UploadFileService } from '../../service-upload-files/service-upload-files.service';
declare var jQuery: any;
@Component({
  selector: 'app-update-workresult-editor',
  templateUrl: './update-workresult-editor.component.html',
  styleUrls: ['./update-workresult-editor.component.scss']
})
export class WorkResultDialogComponent implements OnInit {
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
  is_tiendo: boolean = false;
  is_status: boolean = false;
  statusname: string = '';
  checked: boolean = false;
  Type: string = "2";
  direction: string = "2";
  checkht: boolean = false;
  value: any;
  id_task: any;
  AttFile_Temp: any[] = [];
  isCloseStatus: boolean = false;
  isDefault: boolean = false;//isdefault của trạng thái hoàn thành
  //Start================12/12/2023 - Thiên bổ sung code sử dụng cho CSSTech==========
  isUseVanBan: boolean = false;
  //End==================12/12/2023 - Thiên bổ sung code sử dụng cho CSSTech==========
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WorkResultDialogComponent>,
    private layoutUtilsService: LayoutUtilsService,
    public _danhmucChungServices: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    private translate: TranslateService,
    public _FormatTimeService: FormatTimeService,
    private _menuWorkServices: MenuWorkService,
    private UploadFileService:UploadFileService
  ) {}

  ngOnInit() {
    this._data = this.data._value;
    this.id_task = this.data.id_task;
    this.AttFile_Temp = this.data._att;
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
    if (file.isImage || file.type == 'png') {
      this.DownloadFile(file.path);
    } else {
      this.layoutUtilsService.ViewDoc(file.path);
      // alert('chức năng đang lỗi');
    }
  }

  DownloadFile(link) {
    window.open(link);
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
  TenFile = '';
  File = '';
  Result = '';
  values = new Array<FileUploadModel>();
  update() {
    this.layoutUtilsService.showWaitingDiv();
    if(this.AttFile && this.AttFile.length>0){
      this.uploadfile();
    }
    else{
      this.update_td();
    }
  }
  update_td(){
    let model = new UpdateModel();
    model.emty();
    model.key = 'result';
    model.value = this._data;
    model.id_row = this.id_task;
    model.ProcessFinal = this.ProcessFinal;
    this._danhmucChungServices.updateTask(model).subscribe(res => {
      if (res && res.status == 1) {
        this.layoutUtilsService.OffWaitingDiv();
        this.layoutUtilsService.showActionNotification(
          'Cập nhật tiến độ thành công',
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
        this.layoutUtilsService.OffWaitingDiv();
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
  uploadfile(){
        this.UploadFileService.upload_file(this.evt_file,11,this.id_task).subscribe(res=>{
      if(res.status ==1){
        this.update_td();
        console.log("upload-success")
      }
    });
  }
  ProcessFinal: boolean = false;

  @ViewChild('myInput') myInput;
  selectFile() {
    let el: HTMLElement = this.myInput.nativeElement as HTMLElement;
    el.click();
  }
  AttFile: any[] = [];
  evt_file=new FormData();
  UploadFileForm(evt) {
    this.evt_file.append('file'+ this.AttFile.length+1, evt.target.files[0], evt.target.files[0].name);
    var file = {
      filename: evt.target.files[0].name,
      type: evt.target.files[0].name.split('.')[
        evt.target.files[0].name.split('.').length - 1
      ],
      IsAdd: true,
      IsDel: false,
      IsImagePresent: false,
      link_cloud:''
    }
    this.AttFile.push(file);
    this.AttFile_Temp.push(file);

    this.changeDetectorRefs.detectChanges();
  }
  getIcon(att) {
    if(att.icon) return att.icon;
    let type=att.type;
    let icon = '';
    if (type == 'doc' || type == 'docx' || type == 'application/vnd.ms-word') {
      icon = './../../../../../assets/media/mime/word.png';
    }
    if (type == 'pdf' || type == 'application/pdf') {
      icon = './../../../../../assets/media/mime/pdf.png';
    }
    if (type == 'rar' || type == 'application/vnd.rar') {
      icon = './../../../../../assets/media/mime/text2.png';
    }
    if (type == 'zip' || type == 'application/zip') {
      icon = './../../../../../assets/media/mime/text2.png';
    }
    if (type == 'jpg') {
      icon = './../../../../../assets/media/mime/jpg.png';
    }
    if (type == 'png' || type == 'png' || type == 'image/png') {
      icon = './../../../../../assets/media/mime/png.png';
    } else {
      icon = './../../../../../assets/media/mime/text2.png';
    }
    return icon;
  }
  Delete_File(val: any) 
  {
  
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
      this._menuWorkServices.delete_attachment(val.id_row).subscribe((res) => {
        if (res && res.status === 1) {
          let index = this.AttFile.findIndex(t => t.filename == val.filename);
          let index_attall = this.AttFile_Temp.findIndex(t => t.filename == val.filename);
          if(index != -1)
              this.AttFile.splice(index, 1);
          if(index_attall != -1)
              this.AttFile_Temp.splice(index_attall, 1);

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
}
