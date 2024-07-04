import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as CryptoJS from 'crypto-js';
import { LayoutUtilsService, MessageType } from 'projects/jeechat/src/modules/crud/utils/layout-utils.service';
import { ChatService } from '../../services/chat.service';
@Component({
  selector: 'app-encode-chat',
  templateUrl: './encode-chat.component.html',
  styleUrls: ['./encode-chat.component.scss']
})
export class EncodeChatComponent implements OnInit {
sucess:boolean=false
isEnCode:boolean=false;
  constructor(private dialogRef:MatDialogRef<EncodeChatComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private changeDetectorRefs: ChangeDetectorRef,
    private chat_services:ChatService,
    private layoutUtilsService:LayoutUtilsService,
    
    ) { }

  ngOnInit(): void {
    console.log("datadata",this.data)
    this.isEnCode=this.data.isEnCode
  }
  
EnCode()
{ 
 
    this.chat_services.EnCode(this.data.IdGroup,"insert").subscribe(res=>
      {
        if(res.status==1)
        {
            this.sucess=true;
            this.changeDetectorRefs.detectChanges();
            setTimeout(() => {
              this.layoutUtilsService.showActionNotification(' Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
              this.dialogRef.close();
            }, 1800);

        }

      })
}
Submit()
{
  this.EnCode();
}
  CloseDia(data = undefined)
  {
      this.dialogRef.close(data);
  }
  goBack() {

    this.dialogRef.close();

  }
  HuyEncode()
  {
    this.chat_services.EnCode(this.data.IdGroup,"remove").subscribe(res=>
        {
          if(res.status==1)
          {
            this.layoutUtilsService.showActionNotification(' Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
            this.dialogRef.close();
          }
        })
  }
}
