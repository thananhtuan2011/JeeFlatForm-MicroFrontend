import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { DetailTaskModel } from '../../detail-task-component/detail-task-component.component';
import { UpdateModel } from '../../detail-task-v2-component/detail-task-v2-component.component';
import { MenuWorkService } from '../services/menu-work.services';
import { FormatTimeService } from '../../services/jee-format-time.component';
import { elementAt } from 'rxjs/operators';

@Component({
  selector: 'app-status-attached',
  templateUrl: './status-attached.component.html',
  styleUrls: ['./status-attached.component.scss']
})
export class StatusAttachedComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<StatusAttachedComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _danhmucChungServices: DanhMucChungService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private changeDetectorRefs: ChangeDetectorRef,
    private _menuWorkServices: MenuWorkService,
    public _FormatTimeService: FormatTimeService,
  ) {
    if(this.data.ketqua=='status'){
      this.value=this.data.value;
      this.checked=true;
      this._data = this.data.value.statusname;
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
      this.checked = true;
      this.ProcessFinal = true;// Check xem có check hoàn thành chưa nếu có thì bắt buộc đính kèm các thông tin
      this.checkht = true; // dùng để disable nếu nhiệm vụ đã hoàn thành /
    }
    this.id_task = this.data.id_task;
    this.value = this.data.value;
    this.id_status=this.data.id_status;
  }
  id_task: any;
  id_status:any;
  value: any;
  checked: boolean = false;
  _data: any;
  _old_data: any;
  checkht: boolean = false;
  is_confirm: boolean;
  datanodes: any;
  checkhtstatus:boolean=false;
  evt_file = new FormData();
  ngOnInit(): void {
    if (this.data.ketqua != 'ketqua'&& this.data.ketqua!='status') {
      this._data = this.data._value;
      this._old_data = this.data._value;
    }
    this._menuWorkServices.FlowProgress(this.id_task).subscribe(res => {
      if (res && res.status == 1) {
        if (res.data && res.data.length > 0) {
          this.datanodes = res.data;
        }
      } else {
        this.datanodes = [];
      }
      this.changeDetectorRefs.detectChanges();
    });
  }
  Close() {
    this.dialogRef.close();
  }
  ProcessFinal: boolean = false;
  isCheckProgess(event) {
    if (event) {
      this._data = 'Hoàn thành';
      this.ProcessFinal = true;
    }
    else {
      this.ProcessFinal = false;
      this._data = this._old_data;
    }
  }
  Save() {
    this.update();
  }
  onChangeNote() {
    if (this._data != this._old_data) {
      this.is_confirm = true;
    } else {
      this.is_confirm = false;
    }
  }
  // update() {
  //   let model = new UpdateModel();
  //   if(this.checkhtstatus){
  //     model.key='status';
  //     model.value=this.value.id_row;
  //   }
  //   else{
  //     model.key = 'progress';
  //     model.value = this._data;
  //     model.id_status=this.id_status;
  //   }
  //   model.id_row = this.id_task;
  //   model.values = this.AttFile;
  //   model.ProcessFinal = this.ProcessFinal;
  //   this._danhmucChungServices.updateTask(model).subscribe(res => {
  //     if (res && res.status == 1) {
  //       this.layoutUtilsService.showActionNotification(
  //         'Cập nhật thành công',
  //         MessageType.Read,
  //         9999999999,
  //         true,
  //         false,
  //         3000,
  //         'top',
  //         1
  //       );
  //       this.dialogRef.close({
  //         _result: model,
  //       });
  //     }
  //     else {
  //       this.layoutUtilsService.showActionNotification(
  //         res.error.message,
  //         MessageType.Read,
  //         9999999999,
  //         true,
  //         false,
  //         3000,
  //         'top',
  //         0
  //       );
  //     }
  //   })
  // }
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
  UploadFileForm(evt) {
    // this.files=evt.target.files;
    let filesToUpload: File[] = evt.target.files;
    let keys = '';
    Array.from(filesToUpload).map((file) => {
      keys = 'file' + this.AttFile.length + 1;
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
      keys:keys
    }
    this.AttFile.push(file);

    this.changeDetectorRefs.detectChanges();
  }
  update() {

    this.evt_file.delete('UpdateModel');
    let model = new UpdateModel();
    if (this.checkhtstatus) {
      model.key = 'status';
      model.value = this.value.id_row;
    }
    else {
      model.key = 'progress';
      model.value = this._data;
      model.id_status=this.id_status;
    }
    model.id_row = this.id_task;
    model.values = [];
    model.ProcessFinal = this.ProcessFinal;
    this.evt_file.append('UpdateModel', JSON.stringify(model));

    // this.weworkService.updateTaskProgress(formData);
    this._danhmucChungServices.updateTaskformData(this.evt_file).subscribe(res => {
      if (res && res.status == 1) {
        // this.uploadfile();
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
}
