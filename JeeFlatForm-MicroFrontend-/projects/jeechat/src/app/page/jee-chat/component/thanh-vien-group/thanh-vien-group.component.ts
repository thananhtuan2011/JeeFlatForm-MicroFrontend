import { LayoutUtilsService, MessageType } from './../../../../../modules/crud/utils/layout-utils.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConversationService } from '../../services/conversation.service';
import { PresenceService } from '../../services/presence.service';
import { ChatService } from '../../services/chat.service';
import { InsertThanhvienComponent } from '../insert-thanhvien/insert-thanhvien.component';
import { ConversationModel } from '../../models/conversation';
import { MessageService } from '../../services/message.service';
import { Message } from '../../models/message';

@Component({
  selector: 'app-thanh-vien-group',
  templateUrl: './thanh-vien-group.component.html',
  styleUrls: ['./thanh-vien-group.component.scss']
})
export class ThanhVienGroupComponent implements OnInit {
  userCurrent: string;
  constructor(
    private conversation_service: ConversationService,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    public presence: PresenceService,
    private chat_services: ChatService,
    public messageService: MessageService,
    private dialogRef: MatDialogRef<InsertThanhvienComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {

    const authData = this.conversation_service.getAuthFromLocalStorage();
    this.userCurrent = authData.user.username;
    this.UserIdCurrent = authData.user.customData["jee-account"].userID

    this.customerID = authData.user.customData["jee-account"].customerID
  }
  listUser: any[] = []
  // listRemoveMember:any[]=[];
  lstThanhVien: any[] = [];
  UserIdCurrent: number;
  adminGroup: boolean = false;
  customerID: number

  ItemConversation(ten_group: string, data: any): ConversationModel {

    let dt = {
      Avatar: data.InforUser[0].Avatar,
      BgColor: data.InforUser[0].BgColor,
      FullName: data.InforUser[0].Fullname,
      UserID: data.InforUser[0].UserId,
      UserName: data.InforUser[0].Username,
      Name: data.InforUser[0].Name,

    }
    this.listUser.push(dt);
    const item = new ConversationModel();
    item.GroupName = ten_group;
    item.IsGroup = false;
    item.ListMember = this.listUser.slice();

    return item
  }

  CreateConverSation(item) {

    let dt = null;
    this.chat_services.CheckConversation(item.UserName).subscribe(res => {
      if (res && res.status == 1) {
        if (res.data.length > 0) {
          dt = res.data;
        }


      }
      if (dt != null) {

        this.router.navigateByUrl('/Chat/Messages/' + dt[0].IdGroup + '/null');
        localStorage.setItem('chatGroup', JSON.stringify(dt[0].IdGroup));
        this.goBack()
        // this.CloseDia(res.data);

      }
      else {


        // tạo hội thoại nếu chưa có
        let it = this.ItemConversation(item.FullName, item);
        this.conversation_service.CreateConversation(it).subscribe(res => {
          if (res && res.status === 1) {

            const data = this.conversation_service.getAuthFromLocalStorage(); var contumer = {
              customerID: this.customerID
            }
            const returnedTarget = Object.assign(res.data[0], contumer);
            this.presence.NewGroup(data.access_token, res.data[0], returnedTarget)
            this.listUser = []
            localStorage.setItem('chatGroup', JSON.stringify(res.data[0].IdGroup));
            this.router.navigateByUrl('/Chat/Messages/' + res.data[0].IdGroup + '/null');

            this.goBack()
          }
        })
      }
    })

  }
  CloseDia(data = undefined) {
    this.dialogRef.close(data);
  }
  goBack() {

    this.dialogRef.close();

  }

  ItemLeaveMessenger(content: string, note: string): Message {
    const item = new Message();
    item.Content_mess = content;
    item.UserName = this.userCurrent;
    item.IdGroup = this.data;
    item.IsDelAll = true;
    item.isTagName = false
    item.isGroup = true;
    item.Note = note

    item.IsVideoFile = false;
    item.isFile = false;
    item.Attachment = []
    return item
  }



  sendLeaveMessage(mess: string, note: string) {

    const data = this.conversation_service.getAuthFromLocalStorage();

    var _token = data.access_token;
    let item = this.ItemLeaveMessenger(mess, note);
    this.messageService.sendMessage(_token, item, this.data).then(() => {
      this.LoadThanhVien();

    })





  }

  LeaveGroup(UserId: number) {
    this.conversation_service.DeleteThanhVienInGroup(this.data, UserId).subscribe(res => {

      if (res && res.status == 1) {


        this.CloseDia(res);

        this.router.navigate([`/Chat`]);
        var item = { IdGroup: this.data, UserId: res }
        this.conversation_service.refreshConversation.next(item);
      }
      else {
        this.layoutUtilsService.showActionNotification('Thất bại !', MessageType.Read, 3000, true, false, 3000, 'top', 0);

      }
    })
  }

  DeleteMember(UserId: number) {
    let note;
    let noidung;
    this.conversation_service.DeleteThanhVienInGroup(this.data, UserId).subscribe(res => {
      if (res && res.status == 1) {

        noidung = 'đã xóa '
        this.chat_services.GetUserById(res.data.UserID).subscribe(notedata => {
          if (notedata) {
            note = notedata.data[0].Fullname
            this.sendLeaveMessage(noidung, note);
          }
        })

        this.layoutUtilsService.showActionNotification('Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);

        // this.listRemoveMember.push(res)
        // this.CloseDia(res);
      }
      else {
        this.layoutUtilsService.showActionNotification('Thất bại !', MessageType.Read, 3000, true, false, 3000, 'top', 0);

      }
    })
  }
  LoadThanhVien() {
    this.conversation_service.GetThanhVienGroup(this.data).subscribe(res => {
      this.lstThanhVien = res.data;
      this.CheckLoginAdmin();
      this.changeDetectorRefs.detectChanges();
    })
  }
  UpdateAdmin(IdUser: number, key: number) {
    this.conversation_service.UpdateAdmin(this.data, IdUser, key).subscribe(res => {
      if (res && res.status === 1) {
        let index = this.lstThanhVien.findIndex(x => x.UserId === IdUser);
        this.lstThanhVien.splice(index, 1, res.data[0])
      }
    })
  }
  CheckLoginAdmin() {

    if (this.lstThanhVien.length > 0) {
      let id = this.lstThanhVien.find(x => x.UserId === this.UserIdCurrent && x.isAdmin == true);
      if (id) {
        this.adminGroup = true;
        this.changeDetectorRefs.detectChanges();
      }
    }
  }
  ngOnInit(): void {
    this.LoadThanhVien();


  }

}
