import { LayoutService } from './../../../../../../../../src/app/_metronic/layout/core/layout.service';
import { MenuServices } from './../../../../../../../../src/app/_metronic/core/services/menu.service';
import { AsideService } from './../../../../../../../../src/app/_metronic/layout/components/aside/aside.service';
import { find } from 'lodash';
import { NavigationStart, Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, merge, of, Subscription, timer } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { CreateConvesationGroupComponent } from '../create-convesation-group/create-convesation-group.component';
import { CreateConversationUserComponent } from '../create-conversation-user/create-conversation-user.component';
import { TranslateService } from '@ngx-translate/core';
import { switchMap } from 'rxjs/operators';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { CallVideoComponent } from '../call-video/call-video.component';
import { UserModelGroup } from '../../models/NotifyMess';
import { ModelNotifyDeskTop } from '../../models/modelNotifyDeskTop';
import { MessageService } from '../../services/message.service';
import { ChatService } from '../../services/chat.service';
import { PresenceService } from '../../services/presence.service';
import { ConversationService } from '../../services/conversation.service';
import { SoundService } from '../../services/sound.service';
import { LayoutUtilsService, MessageType } from 'projects/jeechat/src/modules/crud/utils/layout-utils.service';

@Component({
  selector: 'app-mychat-contact',
  templateUrl: './mychat-contact.component.html',
  styleUrls: ['./mychat-contact.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MychatContactComponent implements OnInit, OnDestroy {

  private _subscriptions: Subscription[] = [];
  draftmessage: any[] = [];
  demmess: number = 0;
  interval1: any;
  interval: any;
  networkStatus: boolean = false;
  networkStatus$: Subscription = Subscription.EMPTY;
  searchText: string;
  contentnotfy: string;
  dem: number = 0;
  active: boolean = false;
  subscription: Subscription;
  customerID: number;
  numberInfo: number;
  networkOff: boolean = false;
  isShowAwait: boolean = false
  listApp: any = []
  listAwaitContact: any = []
  lstUserOnline: any[] = [];
  activeTab: boolean = true;
  constructor(
    private messageService: MessageService,
    private router: Router,
    private titleService: Title,
    protected _sanitizer: DomSanitizer,
    private changeDetectorRefs: ChangeDetectorRef,
    private translate: TranslateService,
    private chatService: ChatService,
    private layout: LayoutService,
    private conversationServices: ConversationService,
    public presence: PresenceService,
    private _ngZone: NgZone,
    private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog,
    private soundsevices: SoundService,
  ) {
    this.presence.OpenmessageUsernameSource.subscribe(data => {

      this.unReadMessageFromSenderUsername(data);
      setTimeout(() => {
        this.CheckNotInContact(data)

      }, 5000);
    })
    const user = this.conversationServices.getAuthFromLocalStorage()['user'];
    this.name = user['customData']['personalInfo']['Fullname'];
    this.Avatar = user['customData']['personalInfo']['Avatar'];
    this.BgColor = user['customData']['personalInfo']['BgColor'];
    this.UserId = user['customData']['jee-account']['userID'];
    this.customerID = user['customData']['jee-account']['customerID'];
    const dt = this.conversationServices.getAuthFromLocalStorage();
    this.userCurrent = dt.user.username;

    // const sb=

    // this._subscriptions.push(sb);
  }


  @HostListener('document:visibilitychange', ['$event'])
  visibilitychange() {
    this.checkHiddenDocument();
  }

  checkHiddenDocument() {
    if (document.hidden) {
      this.activeTab = false;
      this.changeDetectorRefs.detectChanges();
    } else {
      const IdGroup = localStorage.getItem('chatGroup')
      if (IdGroup.toString() != '0') {
        let isGroup;
        let index = this.lstContact.findIndex(x => x.IdGroup == IdGroup);
        if (index >= 0) {
          isGroup = this.lstContact[index].isGroup;
          if (isGroup) {

            // update cho group

            if (this.lstContact[index].UnreadMess > 0) {
              this.chatService.UpdateUnReadGroup(Number.parseInt(IdGroup), this.userCurrent, "read").subscribe(res => {
                if (res) {
                  this.lstContact[index].UnreadMess = 0
                  this.changeDetectorRefs.detectChanges()
                }
              }
              )
            }
          }
          else {
            if (this.lstContact[index].UnreadMess > 0) {
              this.chatService.UpdateDataUnreadForActiveTab(Number.parseInt(IdGroup), this.UserId).subscribe(res => {
                if (res) {
                  this.lstContact[index].UnreadMess = 0
                  this.changeDetectorRefs.detectChanges()
                }
              }
              )
            }
          }
        }

      }
      this.activeTab = true;
      this.changeDetectorRefs.detectChanges();
      this.titleService.setTitle(localStorage.getItem('titleApp'));
    }
  }


  userCurrent: string;
  lstContact: any[] = [];
  name: string;
  UserId: number;
  Avatar: string;
  BgColor: string;

  GetContactAwait(ID) {

    const sb = this.chatService.GetContactChatUser().subscribe(res => {
      if (res) {
        // lưu id
        localStorage.setItem('chatGroup', JSON.stringify(ID));
        this.lstContact = res.data;
        this.router.navigateByUrl('/Chat/Messages/' + ID + '/null');

      }

    })
    this._subscriptions.push(sb)
  }
  UpdateCountMessAwait(IdGroup, UserId) {
    this.chatService.UpdateUnRead(IdGroup, UserId, "read").subscribe(res => {
      if (res) {


      }
      else {
        console.log("Eror")
      }
    })
  }
  AddContact(IdGroup, UserId) {

    this.chatService.UpdateDisableConversation(IdGroup).subscribe(res => {
      if (res) {


        this.UpdateCountMessAwait(IdGroup, UserId)

        this.GetContactAwait(IdGroup);
        setTimeout(() => {
          this.isShowAwait = false;
          this.GetCheckNotInContact();
        }, 500);
        this.changeDetectorRefs.detectChanges();

      }

    })
  }
  getClass(item) {
    return item > 0 ? 'unread lastmess' : 'lastmess'

  }

  myFiles: any[] = [];
  getFileDetails(e) {
    for (var i = 0; i < e.target.files.length; i++) {
      this.myFiles.push(e.target.files[i]);
    }
  }

  ShowAwait() {
    this.isShowAwait = true;
    this.changeDetectorRefs.detectChanges();
  }
  CloseAwait() {
    this.isShowAwait = false;
    this.changeDetectorRefs.detectChanges();
  }
  GetCheckNotInContact() {
    this.chatService.GetConverstationDelete().subscribe(res => {
      if (res) {
        this.listAwaitContact = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  CheckNotInContact(datanotifi: any) {
    let index = this.lstContact.findIndex(x => x.IdGroup == datanotifi[0].IdGroup);
    if (index < 0) {
      this.chatService.GetConverstationDelete().subscribe(res => {

        if (res) {
          this.listAwaitContact = res.data;
          // console.log("listAwaitContact",this.listAwaitContact)
          this.changeDetectorRefs.detectChanges();
        }
      })

      this.changeDetectorRefs.detectChanges();


    }
  }

  unReadMessageFromSenderUsername(datanotifi: any) {

    let isGroup;
    const chatgroup = localStorage.getItem('chatGroup')
    let index = this.lstContact.findIndex(x => x.IdGroup == datanotifi[0].IdGroup);
    if (index >= 0) {
      this.lstContact[index].LastMess.splice(0, 1, datanotifi[0]);
      isGroup = this.lstContact[index].isGroup;
      this.lstContact.unshift(this.lstContact[index]);
      this.lstContact.splice(index + 1, 1);
      this.ScrollToTop();

      // this.lstContact[0].LastMess.splice(0,1,res[0]);
      //this.lstContact[0].LastMess.splice(0,1,res[0]);

      this.changeDetectorRefs.detectChanges();


    }

    let indexlast = this.lstContact.findIndex(x => x.IdGroup == datanotifi[0].IdGroup);
    if (indexlast >= 0) {
      this.lstContact[0].LastMess.splice(0, 1, datanotifi[0]);
      this.changeDetectorRefs.detectChanges();
    }





    if (isGroup) {


      if (chatgroup.toString() !== datanotifi[0].IdGroup.toString() && this.userCurrent !== datanotifi[0].UserName) {
        //  const sb= this.chatService.UpdateUnReadGroup(datanotifi[0].IdGroup,this.userCurrent,"unread").subscribe(res=>{

        //         if(res.status===1)
        //         {
        let vitriafter = this.lstContact.findIndex(x => x.IdGroup == datanotifi[0].IdGroup);
        if (vitriafter >= 0) {
          this.lstContact[vitriafter].LastMess.splice(0, 1, datanotifi[0]);

        }

        const sbs = this.chatService.GetUnreadMessInGroup(datanotifi[0].IdGroup, this.UserId).subscribe(res => {
          if (this.lstContact[index].UnreadMess == null || this.lstContact[index].UnreadMess == 0) {
            this.dem += 1;
            this.SenData()

            //  const data=this.auth.getAuthFromLocalStorage();
            if (datanotifi[0].Attachment.length > 0 || datanotifi[0].Attachment_File.length > 0 || datanotifi[0].Videos.length > 0) {
              this.contentnotfy = "Gửi một file đính kèm";
            }
            else {
              this.contentnotfy = datanotifi[0].Content_mess.replace(/<[^>]+>/g, '');
            }

          }

          if (this.lstContact[index].UnreadMess < res.data[0].slunread && this.userCurrent !== datanotifi[0].UserName) {
            // const data=this.auth.getAuthFromLocalStorage();
            if (datanotifi[0].Attachment.length > 0 || datanotifi[0].Attachment_File.length > 0 || datanotifi[0].Videos.length > 0) {
              this.contentnotfy = "Gửi một file đính kèm";
            }
            else {
              this.contentnotfy = datanotifi[0].Content_mess.replace(/<[^>]+>/g, '');
            }

          }

          // sẽ đưa lên đầu tiên và + thêm số lượng
          this.lstContact[vitriafter].UnreadMess = res.data[0].slunread;
          this.SenData()
          this.changeDetectorRefs.detectChanges();

          this._subscriptions.push(sbs);


        }
        )
        //   }

        // })
      }
      else if (this.userCurrent == datanotifi[0].UserName) {
        // dành cho trường hợp offline

        let useroffline: any[] = [];
        let userpusnotify = [];
        let vitritb = this.lstContact.findIndex(x => x.IdGroup == datanotifi[0].IdGroup)
        if (this.lstUserOnline.length > 0) {


          this.lstUserOnline.forEach(element => {

            useroffline = this.lstContact[vitritb].ListMember.filter(word => word.Username != element.Username && word.Username != this.userCurrent);

            // for(let i=0;i<this.lstContact[vitritb].ListMember.length;i++)
            // {
            //     if(element.Username!=this.lstContact[vitritb].ListMember[i].Username)
            //     {
            //       useroffline.push(this.lstContact[vitritb].ListMember[i].Username)
            //     }
            // }
          });

          useroffline.forEach(element => {
            userpusnotify.push(element.Username)
          });
        }
        else {
          useroffline = this.lstContact[vitritb].ListMember.filter(word => word.Username != this.userCurrent);
          useroffline.forEach(element => {
            userpusnotify.push(element.Username)
          });
        }


        this.chatService.UpdateUnReadGroup(datanotifi[0].IdGroup, this.userCurrent, "read").subscribe(res => {

          if (res.status === 1) {
            if (datanotifi[0].Attachment.length > 0 || datanotifi[0].Attachment_File.length > 0 || datanotifi[0].Videos.length > 0) {
              this.contentnotfy = "Gửi một file đính kèm";
            }
            else {
              this.contentnotfy = datanotifi[0].Content_mess.replace(/<[^>]+>/g, '');
            }

            // const data=this.auth.getAuthFromLocalStorage();
            const us = new UserModelGroup();
            us.lstUserTbGroup = userpusnotify


          }
          else {
            console.log("Eror update status message")
          }
        })

      }
      // notify cho trường hợp không active tab
      if (!this.activeTab && chatgroup.toString() == datanotifi[0].IdGroup.toString() && this.userCurrent !== datanotifi[0].UserName) {
        const data = this.conversationServices.getAuthFromLocalStorage();

        this.chatService.publishMessNotifiWebNoActiveGroup(Number.parseInt(datanotifi[0].IdGroup)
          , datanotifi[0].Content_mess.replace(/<[^>]+>/g, ''), datanotifi[0].FullName, datanotifi[0].Avatar,
          datanotifi[0].isEncode, datanotifi[0].isSticker
        ).subscribe(res => {
          if (res.status == 1) {
            this.chatService.setTitle$.next(true);
          }

        })
      }
    }
    else {

      // cần check ở chỗ này
      // dành cho user lúc online
      //  console.log("chatgroup.toString()",chatgroup.toString())
      if (chatgroup.toString() != datanotifi[0].IdGroup.toString()) {
        let indexunread = this.lstContact.findIndex(x => x.IdGroup == datanotifi[0].IdGroup);

        // if(indexunread>=0)
        // {
        // this.lstContact[indexunread].LastMess.splice(0,1,datanotifi[0]);
        // }
        if (index >= 0 && this.userCurrent !== datanotifi[0].UserName) {


          this.chatService.GetUnreadMess(datanotifi[0].IdGroup).subscribe(res => {
            if (this.lstContact[index].UnreadMess == null || this.lstContact[index].UnreadMess == 0) {
              this.dem += 1;
              this.SenData()
            }
            if (this.lstContact[index].UnreadMess < res.data[0].slunread) {
              this.dem += 1;
              this.SenData()
              this.lstContact[index].UnreadMess = res.data[0].slunread
              if (datanotifi[0].Attachment.length > 0 || datanotifi[0].Attachment_File.length > 0 || datanotifi[0].Videos.length > 0) {
                this.contentnotfy = "Gửi một file đính kèm";
              }
              else {
                this.contentnotfy = datanotifi[0].Content_mess.replace(/<[^>]+>/g, '');

              }


            }
            // sẽ đưa lên đầu tiên và + thêm số lượng

            if (indexunread >= 0) {

              this.lstContact[indexunread].UnreadMess = res.data[0].slunread;
              this.SenData()
              this.changeDetectorRefs.detectChanges();
              // debugger
              // if(this.lstContact[indexunread].LastMess.length==0)
              // {
              //   this.lstContact[indexunread].LastMess.push(datanotifi[0].Content_mess)
              // }
              // else
              // {

              // this.lstContact[indexunread].LastMess[0].Content_mess=datanotifi[0].Content_mess;
              // }


            }


          })

        }


      }
      if (!this.activeTab && chatgroup.toString() == datanotifi[0].IdGroup.toString() && this.userCurrent !== datanotifi[0].UserName) {
        const data = this.conversationServices.getAuthFromLocalStorage();
        this.chatService.publishMessNotifiWebNoActive(Number.parseInt(datanotifi[0].IdGroup)
          , datanotifi[0].Content_mess.replace(/<[^>]+>/g, ''), datanotifi[0].FullName, datanotifi[0].Avatar,
          datanotifi[0].isEncode, datanotifi[0].isSticker
        ).subscribe(res => {

          if (res.status == 1) {


            this.chatService.setTitle$.next(true);
            // this.setIntrvl1();




          }
        })
      }
    }

    // mới thêm fix TH lâu lâu tin nhắn lại hiện lên chưa đọc khi có tin nhắn mới
    setTimeout(() => {
      this.ReloadGetContact()
    }, 1000);
  }

  SenData() {
    // const event = new CustomEvent('event', { detail: "UpdateCountMess" });
    // dispatchEvent(event)
    const busEvent = new CustomEvent('event-submenu', {
      bubbles: true,
      detail: {
        eventType: 'update-sub-jeechat',
        customData: 'some data here'
      }
    });
    dispatchEvent(busEvent);

  }
  UpdateUnreadMess(IdGroup: number, UserId: number, count: number) {

    if (this.searchText) {
      this.searchText = "";
    }
    localStorage.setItem('chatGroup', JSON.stringify(IdGroup));
    if (count > 0) {


      let index = this.lstContact.findIndex(x => x.IdGroup == IdGroup);
      this.lstContact[index].UnreadMess = 0;
      this.dem = this.dem - 1;

      this.chatService.UpdateUnRead(IdGroup, UserId, "read").subscribe(res => {
        if (res) {
          this.SenData()
        }
        else {
          console.log("Eror")
        }
      })

      this.changeDetectorRefs.detectChanges();
    }
  }

  UpdateUnreadMessGroup(IdGroup: number, userUpdateRead: string, count: number) {

    if (this.searchText) {
      this.searchText = "";
    }
    localStorage.setItem('chatGroup', JSON.stringify(IdGroup));
    if (count > 0) {


      let index = this.lstContact.findIndex(x => x.IdGroup == IdGroup);
      this.lstContact[index].UnreadMess = 0;
      this.dem = this.dem - 1;

      this.chatService.UpdateUnReadGroup(IdGroup, userUpdateRead, "read").subscribe(res => {
        if (res) {
          this.SenData()
        }
      })

      this.changeDetectorRefs.detectChanges();
    }
  }



  // đọc tất cả tin nhắn
  listAllread: any[] = [];
  AllRead() {
    this.listAllread = [];
    this.listTam.forEach(item => {
      if (item.UnreadMess > 0) {
        this.listAllread.push(item);

      }

    })
    this.listAllread.forEach(item => {
      //user bt

      let index = this.lstContact.findIndex(x => x.IdGroup == item.IdGroup);
      if (index >= 0) {
        this.lstContact[index].UnreadMess = 0;
      }
      if (item.isGroup) {
        this.chatService.UpdateUnRead(item.IdGroup, item.UserId, "read").subscribe(res => {
          if (res) {

            this.SenData()
          }
          else {
            console.log("Eror")
          }
        })

      }
      else {
        //  group

        this.chatService.UpdateUnReadGroup(item.IdGroup, item.Username, "read").subscribe(res => {
          if (res.status === 1) {
            this.SenData()
          }
          else {
            console.log("Eror")
          }
        })
      }

    })
    this.dem = 0;

    this.changeDetectorRefs.detectChanges();
  }
  listunread: any[] = [];
  listTam: any[] = [];
  changed(item) {
    this.listunread = [];
    if (item == 1) {
      this.GetContact();
    } else if (item == 2) {

      this.listTam.forEach(item => {
        if (item.UnreadMess > 0) {
          this.listunread.push(item);
        }

      })
      this.lstContact = this.listunread.slice();
      this.changeDetectorRefs.detectChanges();
    }
    else if (item == 3) {
      this.listTam.forEach(item => {
        if (item.UnreadMess == 0) {
          this.listunread.push(item);
        }

      })
      this.lstContact = this.listunread.slice();
      this.changeDetectorRefs.detectChanges();
    }
  }
  ReloadGetContact() {

    const sb = this.chatService.GetContactChatUser().subscribe(res => {
      this.lstContact = res.data;
      this.listTam = res.data
      // this.getSoLuongMessUnread();
      this.changeDetectorRefs.detectChanges();
    })
    this._subscriptions.push(sb)
  }
  GetContact() {
    this.lstContact = [];
    if (this.lstContact.length == 0) {
      this.active = true;
    }
    const sb = this.chatService.GetContactChatUser().subscribe(res => {
      this.lstContact = res.data;

      this.listTam = res.data
      this.SenData()
      // this.getSoLuongMessUnread();
      this.active = false;
      this.changeDetectorRefs.detectChanges();
    })
    this._subscriptions.push(sb)
  }
  // Bắt đầu  phần xóa conversation
  creaFormDelete(IdGroup: number, isGroup: boolean) {
    const _title = this.translate.instant('Xóa cuộc hội thoại');
    const _description = this.translate.instant('Bạn có muốn xóa không ?');
    const _waitDesciption = this.translate.instant('Dữ liệu đang được xóa');
    const _deleteMessage = this.translate.instant('Xóa thành công !');
    const _erroMessage = this.translate.instant('Xóa không thành công !');
    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      if (isGroup) {
        // xóa group nhóm thực  chất là rời nhóm
        this.conversationServices.DeleteThanhVienInGroup(IdGroup, this.UserId).subscribe(res => {

          if (res && res.status == 1) {
            this.layoutUtilsService.showActionNotification('Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
            let index = this.lstContact.findIndex(x => x.IdGroup == IdGroup);
            if (index >= 0) {

              this.lstContact.splice(index, 1);
              this.changeDetectorRefs.detectChanges();
              const chatgroup = localStorage.getItem('chatGroup')

              if (IdGroup.toString() == chatgroup) {
                this.messageService.stopHubConnectionChat();
                this.router.navigateByUrl('/Chat')
                localStorage.setItem('chatGroup', '0');
              }

            }

          }
          else {
            this.layoutUtilsService.showActionNotification('Thất bại !', MessageType.Read, 3000, true, false, 3000, 'top', 0);

          }
        })

      }
      else {

        // xóa group user với nhau
        const sb = this.conversationServices.DeleteConversation(IdGroup).subscribe((res) => {

          if (res && res.status === 1) {
            const chatgroup = localStorage.getItem('chatGroup')

            if (IdGroup.toString() == chatgroup) {
              this.messageService.stopHubConnectionChat();
              this.router.navigateByUrl('/Chat')
              localStorage.setItem('chatGroup', '0');
            }
            let index = this.lstContact.findIndex(x => x.IdGroup == IdGroup);
            if (index >= 0) {

              this.lstContact.splice(index, 1)
              this.changeDetectorRefs.detectChanges();
              this.layoutUtilsService.showActionNotification('Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
              // this.GetContact();
            }

            this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
          } else {
            this.layoutUtilsService.showActionNotification(_erroMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 0);
          }


          this._subscriptions.push(sb);

        });
      }
    });
  }

  // getSoLuongMessUnread()
  // {this.dem=0;
  //   if( this.lstContact)
  //   {


  //   this.lstContact.forEach(element => {
  //     if(element.UnreadMess>0)
  //     {
  //       this.dem+=1
  //       this.notify_desktopservices.data_share=true
  //     }
  //   });
  // }
  // }

  EventUpdateMessage() {
    const sb = this.messageService.countMessage$.subscribe(res => {

      if (res) {

        if (res.isGroup) {
          let index = this.lstContact.findIndex(x => x.IdGroup == res.IdGroup)
          if (index >= 0) {
            if (this.lstContact[index].UnreadMess > 0) {
              this.chatService.UpdateUnReadGroup(res.IdGroup, this.userCurrent, "read").subscribe(res => {

              })
            }

            this.lstContact[index].UnreadMess = 0;
            this.SenData()
            this.changeDetectorRefs.detectChanges();
          }
        }
        else {
          //this.chatService.UpdateUnRead(IdGroup,UserId,"read").subscribe(res=>{
          let index = this.lstContact.findIndex(x => x.IdGroup == res.IdGroup)
          if (index >= 0) {
            const userfriend = this.lstContact[index].ListMember.find(element => element.Username != this.userCurrent);
            if (this.lstContact[index].UnreadMess > 0) {
              this.chatService.UpdateUnRead(res.IdGroup, userfriend.ID_user, "read").subscribe(res => {

              })
            }

            this.lstContact[index].UnreadMess = 0;
            this.SenData()
            this.changeDetectorRefs.detectChanges();
          }

        }

      }
    })
    this._subscriptions.push(sb)
  }
  EventLoadDraft() {
    this.conversationServices.draftMessage$.subscribe(res => {
      if (res == true) {
        this.draftmessage = JSON.parse(localStorage.getItem("draftmessage"));
        this.changeDetectorRefs.detectChanges();
      }

    })

  }
  EventNewReactionMess() {


    this.presence.NewReactionMess$
      .pipe(
        switchMap(async (res) => {
          if (res && res.status == 1) {
            if (res.data[0].ReactionUser.CreateBy != this.UserId) {

              let index = this.lstContact.findIndex(x => x.IdGroup == res.data[0].IdGroup);
              if (index >= 0) {
                this.lstContact[index].LastMess[0].ReactionUser = res.data[0].ReactionUser
                this.lstContact.unshift(this.lstContact[index]);
                this.lstContact.splice(index + 1, 1);
                this.ScrollToTop();


                this.changeDetectorRefs.detectChanges();


              }
            }


          }
        })
      )
      .subscribe();
  }

  CheckConnectPresseen() {
    this.presence.StoreCheckConnect$.subscribe(res => {
      if (res == "onreconnected") {
        this.ReloadGetContact();
      }
    })
  }

  ngOnInit(): void {

    try {
      this.presence.connectToken();
    }
    catch {
      console.log('Lỗi kết nối')
    }

    this.EventNewReactionMess();
    this.draftmessage = JSON.parse(localStorage.getItem("draftmessage"));
    // this.notifyservices.connectToken();

    // this.presence.connectToken();
    this.GetContact();
    this.GetCheckNotInContact();
    this.EventLoadDraft();
    this.subscribeToEvents();
    this.subscribeToEventsOffLine();
    this.UpdateNewGroup();
    this.RefreshConverstionWhenDeleteMember();
    // this.subscribeToEventsNewMess();
    this.CheckConnectPresseen();
    this.subscribeToEventsHidenmes();
    this.EventUpdateMessage();
  }
  CheckTempMess(IdGroup) {
    if (this.draftmessage) {

      if (this.draftmessage.length > 0) {

        let index = this.draftmessage.findIndex(x => x.IdGroup == IdGroup);
        if (index < 0) {
          return false
        }
        else {
          return true
        }
      }
    }


  }




  ItemNotifyDeskTop(content: string, id_Group: number, fullname: string, avatar: string): ModelNotifyDeskTop {
    const item = new ModelNotifyDeskTop();
    item.IdGroup = id_Group;
    item.Content = content;
    item.FullName = fullname;
    item.Avatar = avatar;


    return item
  }
  PushNotifyDesktop(datanotifi: any) {
    if (datanotifi[0].Attachment.length > 0 || datanotifi[0].Attachment_File.length > 0 || datanotifi[0].Videos.length > 0) {
      this.contentnotfy = "Gửi một file đính kèm";
    }
    else {
      this.contentnotfy = datanotifi[0].Content_mess.replace(/<[^>]+>/g, '');
    }
    let item = this.ItemNotifyDeskTop(this.contentnotfy, datanotifi[0].IdGroup, datanotifi[0].InfoUser[0].Fullname, datanotifi[0].InfoUser[0].Avatar);
    const sb = this.chatService.publishMessNotifyDeskTop(item).subscribe(res => {

    })
    this._subscriptions.push(sb);
  }

  private subscribeToEventsHidenmes(): void {


    const sb = this.messageService.MyChatHidden$.subscribe(res => {
      if (res) {
        let index = this.lstContact.findIndex(x => x.IdGroup == res.IdGroup);
        if (index >= 0) {
          if (this.lstContact[index].LastMess[0].IdChat == res.IdChat) {
            this.lstContact[index].LastMess[0].isHiden = true;
            this.changeDetectorRefs.detectChanges();
          }

        }

      }
    })



  }




  RefreshConverstionWhenDeleteMember() {
    this.conversationServices.refreshConversation.subscribe(res => {
      // console.log("CCCCC",res)
      if (res) {
        let index = this.lstContact.findIndex(x => x.IdGroup == res.IdGroup && x.UserId === res.UserId.data.UserID);
        if (index >= 0) {
          this.lstContact.splice(index, 1);
          this.changeDetectorRefs.detectChanges();
        }
      }
    })
  }
  UpdateNewGroup() {
    this._ngZone.run(() => {
      this.presence.NewGroupSource$.subscribe(res => {
        if (res && res.customerID == this.customerID) {
          if (res && res.isGroup) {
            if (res.ListMember.findIndex(x => x.Username === this.userCurrent) >= 0) {
              this.lstContact.unshift(res);
              this.ScrollToTop()
              this.changeDetectorRefs.detectChanges();
            }


          }
          else {
            if (res && !res.isGroup) {
              if (res.ListMember.findIndex(x => x.Username === this.userCurrent) >= 0) {
                const userfriend = res.ListMember.find(element => element.Username != this.userCurrent);
                this.chatService.CheckConversation(userfriend.Username).subscribe(newuser => {
                  if (newuser) {
                    let index = this.lstContact.findIndex(x => x.IdGroup === res.IdGroup)
                    if (index < 0) {
                      this.lstContact.unshift(newuser.data[0]);
                      this.ScrollToTop()
                      this.changeDetectorRefs.detectChanges();
                    }
                  }
                })
              }
              //   else
              //   {



              //   let index=this.lstContact.findIndex(x=>x.IdGroup===res.IdGroup)
              //   if(index<0)
              //   {
              //     this.lstContact.unshift(res);
              //     this.ScrollToTop()
              //     this.changeDetectorRefs.detectChanges();
              //   }

              // }
            }
          }
        }

      })
    })
  }

  CreaterGroupChat() {
    // this.dcmt.body.classList.add('header-fixed');
    const dialogRef = this.dialog.open(CreateConvesationGroupComponent, {
      width: '550px',
      // panelClass:'no-padding'

    });
    dialogRef.afterClosed().subscribe(res => {


      if (res) {
        const data = this.conversationServices.getAuthFromLocalStorage();

        var contumer = {
          customerID: this.customerID
        }
        const returnedTarget = Object.assign(res[0], contumer);
        this.presence.NewGroup(data.access_token, res[0], returnedTarget)
        this.router.navigate(['Chat/Messages/' + res[0].IdGroup + '/null']);
        localStorage.setItem('chatGroup', JSON.stringify(res[0].IdGroup));
        // this.GetContact();
        // this.subscribeToEvents();
        // this.GetContact();
        setTimeout(() => {
          this.GetContact();
        }, 500);
        this.changeDetectorRefs.detectChanges();
      }
    })

  }


  CreaterUserChat() {
    // this.dcmt.body.classList.add('header-fixed');
    const dialogRef = this.dialog.open(CreateConversationUserComponent, {
      width: '500px',
      // panelClass:'no-padding'

    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.GetCheckNotInContact();
        let index = this.lstContact.findIndex(x => x.IdGroup == res[0].IdGroup);
        if (index >= 0) {
          localStorage.setItem('chatGroup', JSON.stringify(res[0].IdGroup));
          this.router.navigate(['Chat/Messages/' + res[0].IdGroup + '/null']);
        }

        const data = this.conversationServices.getAuthFromLocalStorage(); var contumer = {
          customerID: this.customerID
        }
        const returnedTarget = Object.assign(res[0], contumer);
        this.presence.NewGroup(data.access_token, res[0], returnedTarget)
        this.router.navigate(['Chat/Messages/' + res[0].IdGroup + '/null']);
        localStorage.setItem('chatGroup', JSON.stringify(res[0].IdGroup));
        // this.GetContact();
        // this.subscribeToEvents();
        // this.GetContact();
        setTimeout(() => {
          this.GetContact();
        }, 500);


        this.changeDetectorRefs.detectChanges();
      }
    })

  }
  private subscribeToEventsOffLine(): void {

    this._ngZone.run(() => {

      this.presence.offlineUsers$.subscribe(res => {

        if (res) {


          if (res.JoinGroup === "changeActive") {
            this.SetActive(res.UserId, true)
          }
          // else if(res[i].JoinGroup==="")
          // {
          //   this.SetActive(res[i].UserId,false)
          // }
          else {
            this.SetActive(res.UserId, false)
          }
        }
      })
    })

  }

  private subscribeToEvents(): void {

    this._ngZone.run(() => {

      this.presence.onlineUsers$.subscribe(res => {
        this.lstUserOnline = res;
        // console.log(" this.lstUserOnline", this.lstUserOnline)

        setTimeout(() => {


          if (res.length > 0) {


            for (let i = 0; i < res.length; i++) {
              if (res[i].JoinGroup === "changeActive") {
                if (res[i].UserId) {
                  this.SetActive(res[i].UserId, true)

                }
              }
              else {
                if (res[i].UserId) {
                  this.SetActive(res[i].UserId, false)
                }
              }
            }
          }
        }, 1000);
      })
    })

  }
  SetActive(item: any, active = true) {
    let index;
    setTimeout(() => {
      index = this.lstContact.findIndex(x => x.UserId === item && x.isGroup === false);



      if (index >= 0) {

        this.lstContact[index].Active = active ? true : false;
        this.changeDetectorRefs.detectChanges();

      }


    }, 500);
  }

  ngOnDestroy() {
    if (this._subscriptions) {

      this._subscriptions.forEach((sb) => sb.unsubscribe());
    }
    this.presence.stopHubConnection()

  }
  @ViewChild('scrollMeChat', { static: false }) scrollMeChat: ElementRef;
  ScrollToTop(): void {
    this.scrollMeChat.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  // Tat()
  // {
  //   this.presence.stopHubConnection();
  // }
  //   bat()
  //   {
  //     this.presence.reconnectToken();
  //   }



























  getWidth() {
    let tmp_width = 0;
    tmp_width = window.innerWidth - 420;
    return tmp_width + 'px';
  }
}
