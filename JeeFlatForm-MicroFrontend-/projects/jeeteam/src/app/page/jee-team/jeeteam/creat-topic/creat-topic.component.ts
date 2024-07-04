import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/jeeteam/src/modules/crud/utils/layout-utils.service';
import { TopicModel } from '../model/topic';
import { TopicService } from '../services/topic.service';
import { HttpEventType } from '@angular/common/http';
import { quillConfig } from '../Quill_config';

@Component({
  selector: 'app-creat-topic',
  templateUrl: './creat-topic.component.html',
  styleUrls: ['./creat-topic.component.scss']
})
export class CreatTopicComponent implements OnInit {
  content: string = "";
  keymenu: any
  loading: boolean = false;
  list_image: any[] = [];
  list_file: any[] = [];
  listFileChat: any[] = [];

  AttachFileChat: any[] = [];
  AttachFileChatLage: any[] = [];
  loadingfilelarge: boolean = true
  progress: number;
  progressdown: number = 0;
  list_file_large: any[] = []
  public quillConfig: {};
  public editorStyles1 = {
    // 'min-height': '400px',
    'max-height': '400px',
    'border-radius': '5px',
    // 'border': '2px solid gray',
    'height': '130px',
    'font-size': '12pt',
    'overflow-y': 'auto',
  };
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<CreatTopicComponent>,
    private layoutUtilsService: LayoutUtilsService,
    private topic_service: TopicService,
    private changeDetectorRefs: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.loading = false
    this.quillConfig = quillConfig;
  }
  ItemTopic(): TopicModel {

    const item = new TopicModel();


    item.NoiDung = this.content;
    item.RowIdSub = Number.parseInt(this.data.idmenu)
    item.IsPrivate = this.data.IsPrivate
    item.Attachment = this.AttachFileChat
    item.RowIdTeam = Number.parseInt(localStorage.getItem("RowIdTeam"));
    this.keymenu = localStorage.getItem("KeyIdMenu");
    var dt = JSON.parse(this.keymenu)
    item.idSubmenu = dt[0].idSubmenu ? dt[0].idSubmenu : "0";


    return item;
  }
  CloseDia(data = undefined) {
    this.dialogRef.close(data);
  }
  InsertTopic() {
    this.loading = true;
    if (this.content == "" || !this.content) {
      this.layoutUtilsService.showActionNotification("Nội dung không được để trống !", MessageType.Delete, 4000, true, false, 3000, 'top', 0);
    }
    else {

      let item = this.ItemTopic();
      this.topic_service.InsertTopic(item).subscribe(res => {

        if (res.status == 1) {
          this.loading = false
          this.CloseDia(res.data)
          this.content = ""
          // this.layoutUtilsService.showActionNotification("Thêm thành công !", MessageType.Delete, 4000, true, false, 3000, 'top', 1);
        }
      })
    }

  }
  goBack() {
    this.dialogRef.close()
  }
  onSelectFile_PDF(event) {

    if (event.target.files[0].size > 5000000) {
      for (let i = 0; i < event.target.files.length; i++) {
        let dt = {
          filename: event.target.files[i].name,
          size: event.target.files[i].size,
        }
        this.list_file_large.push(dt)
      }


      // const data = this.conversation_service.getAuthFromLocalStorage();
      // // id_chat_notify
      // var _token = data.access_token;
      // let item = this.ItemMessengerFile();
      // this.messageService.sendMessage(_token, item, this.id_Group).then((res) => {
      //   this.list_file_large = []
      //   this.loadingfilelarge = true;
      // })


      // setTimeout(() => {


      //   this.progress = 0;
      //   this.interval = setInterval(() => {
      //     if (this.progress < 90) {
      //       this.progress = this.progress + 0.5;
      //       this.changeDetectorRefs.detectChanges();
      //     }

      //   }, 400);
      //   // this.list_file.push(event.target.files);
      //   let filesToUpload: File[] = event.target.files;
      //   const frmData = new FormData();
      //   Array.from(filesToUpload).map((file, index) => {
      //     return frmData.append('file' + index, file, file.name);
      //   });


      //   this.chatService.UploadfileLage(frmData, this.id_Group, this.id_chat_notify).subscribe(

      //     {
      //       next: (event) => {
      //         if (event.type === HttpEventType.UploadProgress) {

      //           // this.progress = Math.round((100 / event.total) * event.loaded);
      //           // console.log("thisprogress",this.progress)


      //         }

      //         else if (event.type === HttpEventType.Response) {
      //           if (event.body) {
      //             this.loadingfilelarge = false;

      //             this.progress = 100;

      //             if (this.progress == 100) {
      //               clearInterval(this.interval);
      //             }
      //             this.changeDetectorRefs.detectChanges();
      //             // alert("Upload thành công")

      //           }
      //         }
      //       },

      //     })
      // }, 500);
      //  this.layoutUtilsService.showActionNotification('File quá lớn!', MessageType.Read, 3000, true, false, 3000, 'top', 0);
    }
    else {


      // this.show = false;

      if (event.target.files && event.target.files[0]) {

        var filesAmountcheck = event.target.files[0];


        var file_name = event.target.files;
        var filesAmount = event.target.files.length;

        for (var i = 0; i < this.AttachFileChat.length; i++) {
          if (filesAmountcheck.name == this.AttachFileChat[i].filename) {
            this.layoutUtilsService.showInfo("File đã tồn tại");
            return;
          }
        }
        if (filesAmount == 1) {
          // for (let i = 0; i < filesAmount; i++) {
          var reader = new FileReader();
          //this.FileAttachName = filesAmount.name;
          let base64Str: any;
          let cat: any;
          reader.onload = (event) => {
            cat = file_name[0].name.substr(file_name[0].name.indexOf('.'));
            if (cat.toLowerCase() === '.png' || cat.toLowerCase() === '.jpg') {
              this.list_image.push(event.target.result);

              var metaIdx1 = event.target.result.toString().indexOf(';base64,');
              base64Str = event.target.result.toString().substr(metaIdx1 + 8);
              this.AttachFileChat.push({ filename: file_name[0].name, type: file_name[0].type, size: file_name[0].size, strBase64: base64Str });


            }
            else {
              this.list_file.push(event.target.result);

              if (this.list_file[0] != undefined) {
                var metaIdx = event.target.result.toString().indexOf(';base64,');
              }

              if (this.list_file[0] != undefined) {
                base64Str = event.target.result.toString().substr(metaIdx + 8);
              }

              this.AttachFileChat.push({ filename: file_name[0].name, type: file_name[0].type, size: file_name[0].size, strBase64: base64Str });
              this.listFileChat.push({ filename: file_name[0].name, type: file_name[0].type, size: file_name[0].size, strBase64: base64Str });
              // this.list_File_Edit.push({ filename: file_name[i].name,type:file_name[i].type,size:file_name[i].size });
            }
            // console.log("AttachFileChat", this.AttachFileChat)

            this.changeDetectorRefs.detectChanges();

          }


          //  console.log('this.list_image_Edit',this.list_image_Edit)
          reader.readAsDataURL(event.target.files[0]);

        }
        else {


          for (let i = 0; i < filesAmount; i++) {
            var reader = new FileReader();
            //this.FileAttachName = filesAmount.name;
            let base64Str: any;
            let cat: any;
            reader.onload = (event) => {
              cat = file_name[i].name.substr(file_name[i].name.indexOf('.'));
              if (cat.toLowerCase() === '.png' || cat.toLowerCase() === '.jpg') {
                this.list_image.push(event.target.result);
                var metaIdx = this.list_image[i].indexOf(';base64,');
                base64Str = this.list_image[i].substr(metaIdx + 8);
                this.AttachFileChat.push({ filename: file_name[i].name, type: file_name[i].type, size: file_name[i].size, strBase64: base64Str });
              }
              else {
                this.list_file.push(event.target.result);

                if (this.list_file[i] != undefined) {
                  var metaIdx = this.list_file[i].indexOf(';base64,');
                }

                if (this.list_file[i] != undefined) {
                  base64Str = this.list_file[i].substr(metaIdx + 8);
                }

                this.AttachFileChat.push({ filename: file_name[i].name, type: file_name[i].type, size: file_name[i].size, strBase64: base64Str });
                this.listFileChat.push({ filename: file_name[i].name, type: file_name[i].type, size: file_name[i].size, strBase64: base64Str });
                // this.list_File_Edit.push({ filename: file_name[i].name,type:file_name[i].type,size:file_name[i].size });
              }


              this.changeDetectorRefs.detectChanges();

            }



            //  console.log('this.list_image_Edit',this.list_image_Edit)
            reader.readAsDataURL(event.target.files[i]);
          }
        }

      }

    }
    setTimeout(() => {
      event.srcElement.value = "";

    }, 1000);
  }
  formatBytesInsert(bytes) {
    if (bytes === 0) {
      return '0 KB';
    }
    const k = 1024;
    const dm = 2 <= 0 ? 0 : 2 || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  RemoveChoseFile(index) {
    this.AttachFileChat.splice(index, 1);
    this.listFileChat.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
  }
}
