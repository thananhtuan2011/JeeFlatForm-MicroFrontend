import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VoteModel } from '../../models/vote.model';
import { FormControl } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { PopoverContentComponent } from 'ngx-smart-popover';
import { Message } from '../../models/message';
import { MessageService } from '../../services/message.service';
import { ChatService } from '../../services/chat.service';
import { LayoutUtilsService, MessageType } from 'projects/jeechat/src/modules/crud/utils/layout-utils.service';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-tao-binh-chon',
  templateUrl: './tao-binh-chon.component.html',
  styleUrls: ['./tao-binh-chon.component.scss']
})
export class TaoBinhChonComponent implements OnInit {

  newPrice = {};
  vehicle = {};
  products = [{ id: '1', value: '' }, { id: '2', value: '', },

  ]
  userCurrent: string;
  fullname: string;
  active: boolean = false
  public filteredGroups: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public groupFilterCtrl: FormControl = new FormControl();
  constructor(

    private dialogRef: MatDialogRef<TaoBinhChonComponent>,
    public dialog: MatDialog,
    private chat_services: ChatService,
    private changeDetectorRefs: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public messageService: MessageService,
    private conversation_services: ConversationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    const dt = this.conversation_services.getAuthFromLocalStorage();
    this.userCurrent = dt.user.username;
    this.fullname = dt['user']['customData']['personalInfo']['Fullname'];
  }
  @ViewChild('myPopoverC', { static: true }) myPopover: PopoverContentComponent;
  listTT_user: any = {};
  list_group: any[] = [];
  list_tag_user: any[] = [];
  tin: string = '';
  tam: string
  item: any[] = [];
  strbase64: string;
  id_loaibaidang: number;
  congkhai = 'Công Khai';
  isDisabled = true;
  selected: number;
  id_user: number;
  id_loai_bai_dang: string;
  tieude: string;
  id: number
  id_group: any;
  image: any;
  images: any[] = [];
  filesAmount: File = null;
  imgURL: any;
  AttachFileBaiDang: any[] = [];
  base64Image: string;
  nameimg: any;
  list_image = [];
  list_file = [];
  listTT_Group: any[] = [];
  // Bắt đầu phần comment
  date: Date;

  closeDilog(data = undefined) {
    this.dialogRef.close(data);

  }
  // products= [{id:'1', title:'pick 1'},{id:'2', price:'pick 2',},

  // ]
  AddBinhChon() {
    let itembc = {
      id: `${this.products.length + 1}`, value: ""
    }
    this.products.push(itembc);
    this.products = this.products.map(v => {

      if (this.newPrice[v.id]) {
        v.value = this.newPrice[v.id];
        // v.id =this.newPrice[v.value]
      }
      return v
    })


    this.changeDetectorRefs.detectChanges();

  }
  Remove(vi) {
    if (this.products.length > 2) {
      this.products.splice(vi, 1);
      this.changeDetectorRefs.detectChanges();
    }
    else {
      this.layoutUtilsService.showActionNotification('Không thể tạo lựa chọn ít hơn 2', MessageType.Read, 3000, true, false, 3000, 'top', 0);
    }

  }




  item_vote(itemdata: any): VoteModel {
    const item = new VoteModel();

    item.ListBinhChon = itemdata;
    this.changeDetectorRefs.detectChanges();
    return item;
  }
  ItemMessenger(): Message {

    const item = new Message();

    item.isTagName = false
    item.Content_mess = this.tin;
    item.UserName = this.userCurrent;
    item.IdGroup = this.data;
    item.isGroup = true;
    item.isVote = true;
    item.Note = "";
    item.IsDelAll = false;
    item.IsVideoFile = false;
    item.Attachment = [];

    return item
  }


  // item_baidang():BaiDangModel
  // {
  //   const item = new BaiDangModel();

  //       item.id_loaibaidang=this.id_loaibaidang;
  //       item.NoiDung=this.tin;
  //       let d = new Date(null) ;
  //       d.setTime( d.getTime() - new Date().getTimezoneOffset()*60*1000 );
  //       item.Timeline="";
  //       item.template="";
  //        item.title='';
  //        item.typepost='';

  //        if(this.id_group.value==='Công Khai')
  //        {
  //         item.Id_Group=0;
  //        }
  //        else

  //        {
  //         item.Id_Group=this.id_group.value;
  //        }
  //        item.Attachment=this.AttachFileBaiDang.slice();
  //        item.TagName=this.list_tag_user.slice();

  // this.changeDetectorRefs.detectChanges();
  // return item;
  // }






  InsertVote(itemBC: any[]) {
    if (itemBC.length > 0) {
      let item = this.item_vote(itemBC);

      this.chat_services.addBinhChon(this.id_group, item).subscribe(res => {

        if (res.status == 1 && res) {
          this.layoutUtilsService.showActionNotification('Tạo thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);

        }
      });
    }
  }

  // AddBaiDang(item: BaiDangModel, withBack: boolean,itemBC:any) {




  //   this._services.Insert(item,this._services.rt_addbaidang).subscribe(res => {
  //     if (res && res.status === 1) {
  //         this.InsertVote(itemBC);
  //       this.closeDilog(res.status);
  //     //  this.dataSource.loadListBaiDang();


  //     }
  //     else {
  //       this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999, true, false, 3000, 'top',0 );
  //     }
  //   });

  // }
  submit() {
    this.products = this.products.map(v => {

      if (this.newPrice[v.id]) {
        // v.value =document.getElementById("searchTxt").value;

        v.value = this.newPrice[v.id];
      }
      return v
    })

    // this.id_loaibaidang=this.data.id_loaibaidang;
    let item = this.ItemMessenger();
    // this.AddBaiDang(ItemBd,false,this.products);
    this.active = true;
    const data = this.conversation_services.getAuthFromLocalStorage();

    // id_chat_notify
    var _token = data.access_token;
    this.messageService.sendMessage(_token, item, this.data).then((res) => {
      this.InsertVote(this.products);
      this.closeDilog(1);
    })
      .catch((error) => {
        console.log("error bình chọn", error)

      });
    this.changeDetectorRefs.detectChanges();
  }
  flip() {
    // debugger
    if (this.tin != "")
      this.isDisabled = !this.isDisabled;
  }





  loadTTuser() {

    const authData = this.conversation_services.getAuthFromLocalStorage()
    this.listTT_user = authData.user.customData.personalInfo;
  }


  ngOnInit() {
    this.loadTTuser();

    this.id_group = this.data;

  }

  // updatePrice(val, flag){
  //   if(flag){
  //     console.log("sss",val)
  //     this.products = this.products.map(v => {
  //     if(v.id === val.id){        
  //           v.value = this.newPrice[v.id];
  //     }
  //     return v
  //   })
  //   }
  //   console.log(this.newPrice[val.id]);
  // }
  // updatePricecheck(val, flag){
  //   if(flag){
  //     console.log("check",val)
  //     this.products = this.products.map(v => {
  //     if(v.id === val.id){        
  //           v.value = this.newPrice[v.id];
  //     }
  //     return v
  //   })
  //   }
  //   console.log(this.newPrice[val.id]);
  // }


}
