import { ConversationModel } from './../../models/conversation';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { ConversationService } from '../../services/conversation.service';
import { ChatService } from '../../services/chat.service';
import { LayoutUtilsService } from 'projects/jeechat/src/modules/crud/utils/layout-utils.service';
import { CreateGroupModel } from '../../models/CreateGroup';

@Component({
  selector: 'app-create-conversation-user',
  templateUrl: './create-conversation-user.component.html',
  styleUrls: ['./create-conversation-user.component.scss']
})
export class CreateConversationUserComponent implements OnInit {
  public searchControl: FormControl = new FormControl();
  loading: boolean = false;
  public filteredGroups: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  constructor(private conversation_sevices: ConversationService,
    private dialogRef: MatDialogRef<CreateConversationUserComponent>,
    private changeDetectorRefs: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private chat_services: ChatService

  ) { }

  listDanhBa: any[] = [];
  listUser: any[] = []
  listUsernotify: any[] = []
  ItemConversation(ten_group: string, data: any): ConversationModel {

    this.listUser.push(data);
    const item = new ConversationModel();
    item.GroupName = ten_group;
    item.IsGroup = false;

    item.ListMember = this.listUser.slice();


    return item
  }

  ItemConversationNotify(idGroup: number, isGroup: boolean, usernamerecive: any): CreateGroupModel {

    this.listUsernotify.push(usernamerecive)
    const item = new CreateGroupModel();
    item.idGroup = idGroup;
    item.mesage = "đã tạo một hội thoại với bạn"
    item.isGroup = isGroup;
    item.usernamereveice = this.listUsernotify.slice();


    return item
  }

  CreateConverSation(item) {

    this.loading = true;
    let dt = null;
    this.chat_services.CheckConversation(item.UserName).subscribe(res => {

      if (res && res.status == 1) {
        if (res.data.length > 0) {
          this.chat_services.UpdateDisableConversation(res.data[0].IdGroup).subscribe(res => {

          })


          dt = res.data;
        }
        //xử lý chỗ này push thêm 1 phần tử khác để check không gửi newGroup

      }
      if (dt != null) {
        // let vl=res.data
        this.CloseDia(res.data);
        this.loading = false
      }
      else {


        // tạo hội thoại nếu chưa có
        let it = this.ItemConversation(item.FullName, item);
        this.conversation_sevices.CreateConversation(it).subscribe(res => {
          if (res && res.status === 1) {
            this.loading = false
            this.listUser = []
            this.CloseDia(res.data);


            // thông báo
            let itemnoty = this.ItemConversationNotify(res.data[0].IdGroup, res.data[0].isGroup, res.data[0].Username)

            this.chat_services.publishCreateGroup(itemnoty).subscribe(res => {
              this.listUsernotify = [];
            })
          }
          // else
          // {
          //   this.layoutUtilsService.showActionNotification('Hội thoại đã tồn tại!', MessageType.Read, 3000, true, false, 3000, 'top', 0);
          // }
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

  protected filterBankGroups() {
    if (!this.listDanhBa) {
      return;
    }
    // get the search keyword
    let search = this.searchControl.value;
    // const bankGroupsCopy = this.copyGroups(this.list_group);
    if (!search) {
      this.filteredGroups.next(this.listDanhBa.slice());

    } else {
      search = search.toLowerCase();
    }

    this.filteredGroups.next(
      this.listDanhBa.filter(bank => (bank.FullName.toLowerCase().indexOf(search) > -1)))
  }

  GetDanhBa() {
    this.conversation_sevices.GetDanhBaNotConversation().subscribe(res => {
      this.listDanhBa = res.data;
      // console.log('	  this.listDanhBa',	  this.listDanhBa)
      this.filteredGroups.next(this.listDanhBa.slice());
      this.changeDetectorRefs.detectChanges();
    })

  }
  ngOnInit(): void {
    this.GetDanhBa();
    this.searchControl.valueChanges
      .pipe()
      .subscribe(() => {
        this.filterBankGroups();
      });
  }

}
