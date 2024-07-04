import { filter } from 'rxjs/operators';
import { TopicModel } from './../model/topic';
import { Component, Input, OnInit, ViewChild, OnDestroy, ChangeDetectorRef, ElementRef, HostListener } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { TopicService } from '../services/topic.service';
import { tinyMCE_MT } from '../tinyMCE-MT';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, fromEvent } from 'rxjs';
import { PopoverContentComponent } from 'ngx-smart-popover';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { EditTopicComponent } from '../edit-topic/edit-topic.component';
import { IPageInfo, VirtualScrollerComponent } from 'ngx-virtual-scroller';
import { isThisTypeNode } from 'typescript';
import { JeeTeamService } from '../services/jeeteam.service';
import { LayoutUtilsService, MessageType } from 'projects/jeeteam/src/modules/crud/utils/layout-utils.service';
import { QueryParamsModelNewLazy } from '../model/pagram';
import { quillConfig } from '../Quill_config';
import { NgbDate, NgbDateAdapter, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { CreatTopicComponent } from '../creat-topic/creat-topic.component';
import { LoadCommentComponent } from '../load-comment/load-comment.component';
import { FormatTimeService } from './fotmat-time.service';
import { CustomAdapter, CustomDateParserFormatter } from './date-picker.utils';
@Component({
  selector: 'app-load-thaoluan',
  templateUrl: './load-thaoluan.component.html',
  styleUrls: ['./load-thaoluan.component.scss'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter }
  ]
})
export class LoadThaoluanComponent implements OnInit, OnDestroy {
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  tinyMCE = {};
  themdark: boolean = false
  title: string;
  dtchanel = {};
  search_date: any = ''
  pageSize: number = 0;
  list_reaction: any[] = [];
  listreaction: any[] = []
  userCurrent: string;
  keymenu: any
  @ViewChild('myPopoverC', { static: true }) myPopover: PopoverContentComponent;
  private _subscriptions: Subscription[] = [];
  idmenu: number;
  public quillConfig: {};
  public editorStyles1 = {
    // 'min-height': '400px',
    // 'max-height': '400px',
    'border-radius': '5px',
    'border': '2px solid gray',
    'height': '100%',
    'font-size': '12pt',
    'overflow-y': 'auto',
  };
  isprivate: boolean
  nodata: boolean = false
  list_topic: any[] = []
  UserID: any;
  constructor(
    private dashboar_service: JeeTeamService,
    private changeDetectorRefs: ChangeDetectorRef,
    private translate: TranslateService,
    private router: Router,
    public dialog: MatDialog,
    public _FormatTimeService: FormatTimeService,
    private route: ActivatedRoute,
    private layoutUtilsService: LayoutUtilsService,
    private topic_service: TopicService,
  ) {

    const dt = this.dashboar_service.getAuthFromLocalStorage();
    this.userCurrent = dt.user.username;
    this.UserID = dt['user']['customData']['jee-account']['userID'];
    this.tinyMCE = tinyMCE_MT;
  }
  content: string = "";


  ItemTopic(): TopicModel {

    const item = new TopicModel();


    item.NoiDung = this.content;
    item.RowIdSub = this.idmenu
    item.IsPrivate = this.isprivate
    item.RowIdTeam = Number.parseInt(localStorage.getItem("RowIdTeam"));
    this.keymenu = localStorage.getItem("KeyIdMenu");
    var dt = JSON.parse(this.keymenu)
    item.idSubmenu = dt[0].idSubmenu ? dt[0].idSubmenu : "0";


    return item;
  }
  Submit() {

    this.InsertTopic()
  }
  ShowMode(id: number) {
    let index = this.list_topic.findIndex((x) => x.Id_Topic == id);
    this.list_topic[index].showMore = false;
    this.changeDetectorRefs.detectChanges();
  }

  InsertTopic() {
    if (this.content == "" || !this.content) {
      this.layoutUtilsService.showActionNotification("Nội dung không được để trống !", MessageType.Delete, 4000, true, false, 3000, 'top', 0);
    }
    else {

      let item = this.ItemTopic();
      this.topic_service.InsertTopic(item).subscribe(res => {

        if (res.status == 1) {
          this.loadDataList(res.data.IdMenu, '')
          this.content = ""
          this.layoutUtilsService.showActionNotification("Thêm thành công !", MessageType.Delete, 4000, true, false, 3000, 'top', 1);
        }
      })
    }

  }
  LoadComment(item) {

    //	debugger

    // var data = Object.assign({}, dt);
    // var data = Object.assign({}, item);
    const dialogRef = this.dialog.open(LoadCommentComponent, {
      // disableClose: true,
      data: item,
      height: 'auto',
      width: '850px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {

        // this.loadDataList();


        this.changeDetectorRefs.detectChanges();
      } else {
        return;
      }
    });
  }
  Created_tOPIC() {

    //	debugger
    let dt = {
      IsPrivate: this.isprivate,
      idmenu: this.idmenu
    }
    var data = Object.assign({}, dt);
    // var data = Object.assign({}, item);
    const dialogRef = this.dialog.open(CreatTopicComponent, {
      // disableClose: true,
      data: data,
      height: 'auto',
      width: '850px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.topic_service._IdMenu$.subscribe(res => {
          if (res) {
            this.pageSize = 0;
            this.quillConfig = quillConfig;
            this.dtchanel = res;
            this.content = "";
            this.list_topic = [];
            this.topic_service._Comment$.next(undefined)
            if (res.idchildmenu) {
              this.isprivate = true
              this.loadDataList(res.idchildmenu, '');
              this.idmenu = res.idchildmenu
            }
            else {
              this.isprivate = false;
              this.loadDataList(res.id, '');
              this.idmenu = res.id
            }




            // }
          }
        })

        // this.loadDataList();


        this.layoutUtilsService.showActionNotification('Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
        this.changeDetectorRefs.detectChanges();
      } else {
        return;
      }
    });
  }
  Update_tOPIC(item, indexvi) {

    //	debugger
    let dt = {
      it: item,
      chanel: this.dtchanel
    }
    var data = Object.assign({}, dt);
    // var data = Object.assign({}, item);
    const dialogRef = this.dialog.open(EditTopicComponent, {
      // disableClose: true,
      data: data,
      // height: 'auto',
      // width: '550px',
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {

        // this.loadDataList();
        var tam = Object.assign(res[0]);
        let vi = this.list_topic.findIndex((x) => x.Id_Topic == item.Id_Topic);

        if (vi >= 0) {
          // this.list_topic.splice(vi, 1);
          this.list_topic.splice(vi, 1, tam)
        }
        // this.list_topic = [tam,...this.list_topic]

        this.layoutUtilsService.showActionNotification('Cập nhật thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
        this.changeDetectorRefs.detectChanges();
      } else {
        return;
      }
    });
  }
  creaFormDelete(IdTopic: number) {
    const _title = this.translate.instant('Xóa Bài Viết');
    const _description = this.translate.instant('Bạn có muốn xóa không ?');
    const _waitDesciption = this.translate.instant('Dữ liệu đang được xóa');
    const _deleteMessage = this.translate.instant('Xóa thành công !');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      const sb = this.topic_service.DeleteTopic(IdTopic).subscribe((res) => {
        //	this.loadDataList();
        if (res && res.status === 1) {

          let vi = this.list_topic.findIndex((x) => x.Id_Topic == IdTopic);
          if (vi >= 0) {
            this.list_topic.splice(vi, 1);
            // this.list_topic = this.list_topic.filter((item, index) => index !== vi)
            // this.list_topic.re

            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);

          }

          // this.layoutUtilsService.OffWaitingDiv();


        } else {
        }

        this._subscriptions.push(sb);
      });
    });
  }
  loadDataListLayzy(page: number) {
    const queryParams1 = new QueryParamsModelNewLazy(

      '',
      '',
      '',

      page,
      10,
      false,



    );
    const sb = this.topic_service
      .GetDSTopic(this.idmenu, this.isprivate, queryParams1).subscribe(res => {


        if (res.data) {

          this.list_topic = res.data.concat(this.list_topic);
          this.myScrollContainer.nativeElement.scrollTop = res.data.length - 1
          this.changeDetectorRefs.detectChanges();

        }

      })

    this._subscriptions.push(sb)

  }
  reverseString(item) {
    let dt = item.split(" ")
    return dt[dt.length - 1];
  }
  loadDataList(idmenu, filter) {
    this.pageSize = 0;
    const queryParams1 = new QueryParamsModelNewLazy(

      filter,
      '',
      '',

      this.pageSize,
      10,
      false,



    );
    this.topic_service
      .GetDSTopic(idmenu, this.isprivate, queryParams1).subscribe(res => {
        if (res.data) {

          this.list_topic = res.data;
          this.changeDetectorRefs.detectChanges();

          if (this.list_topic) {

            if (this.list_topic.length > 0) {
              this.nodata = false

            }
            else {
              this.nodata = true
            }
          }
          else {
            this.list_topic = [];
            this.nodata = true
          }

          setTimeout(() => {

            this.scrollToBottom();


          }, 50);

        }
        else {

          this.list_topic = [];
          this.nodata = true;
          this.changeDetectorRefs.detectChanges();

        }

      })

  }
  toggleWithGreeting(idtopic: number, type: number) {


    this.topic_service.GetUserReaction(idtopic, type).subscribe
      (res => {
        this.listreaction = res.data;

        this.changeDetectorRefs.detectChanges();
      })

  }

  formatBytesInsert(bytes) {
    if (bytes === 0) {
      return '0 KB';
    }
  }
  RouterLink(link) {
    window.open(
      link,
      'Independent Window'
    );
  }
  // LoadComment(idtopic: number, item: any, userTopic: any, key: any) {

  //   let dt = {
  //     IdTopic: idtopic,
  //     isprivate: this.isprivate,
  //     userTopic: userTopic,
  //     ShowAll: key == "noti" ? true : false
  //   }
  //   this.dashboar_service._ContentTopic$.next(item);
  //   this.topic_service._Comment$.next(dt);
  //   this.changeDetectorRefs.detectChanges();
  // }
  GetListReaction() {
    this.dashboar_service.getlist_Reaction().subscribe(res => {
      this.list_reaction = res.data;
      this.changeDetectorRefs.detectChanges();

    })
  }
  SendReaction(id: number, type: number) {

    const sb = this.topic_service.InsertReaction(id, type, this.idmenu).subscribe((res) => {
      if (res && res.status == 1) {

        let index = this.list_topic.findIndex((x) => x.Id_Topic === id);

        if (this.list_topic[index].Like === null) {
          this.list_topic[index].Like = Object.assign(res.data[0].Like);
        } else {
          if (type === 0) {
            this.list_topic[index].Like = null;
          } else {
            delete this.list_topic[index].Like;
            this.list_topic[index].Like = Object.assign(res.data[0].Like);
          }
        }
        if (this.list_topic[index].Like_Topic === null) {
          this.list_topic[index].Like_Topic = res.data[0].Like_Topic.slice();
        } else {

          this.list_topic[index].Like_Topic = null;
          if (res.data[0].Like_Topic.length > 0) {
            this.list_topic[index].Like_Topic = res.data[0].Like_Topic.slice();
          } else {
            this.list_topic[index].Like_Topic = [];
          }
        }
        this._subscriptions.push(sb);
        this.changeDetectorRefs.detectChanges();
      }
    });
  }
  InsertRectionChat(idchat: number, type: number) {

    this.SendReaction(idchat, type);

  }
  EventOpencomment() {
    const sb = this.topic_service._OpenComment$.subscribe(res => {

      if (res) {
        this.topic_service.getTopicForComment(res).subscribe(dt => {
          if (dt) {
            if (dt.data.length > 0) {
              // this.LoadComment(res, dt.data[0], dt.data[0].UserTopic[0].Username, "noti");
              this.topic_service.data_share_OpenComment = undefined;
            }
          }
        })

      }
    })
    this._subscriptions.push(sb)
  }
  GetTitle() {
    this.dashboar_service.sub_title$.subscribe(res => {
      if (res) {
        this.title = res
        this.changeDetectorRefs.detectChanges();
      }

    })
  }
  Event() {
    fromEvent(window, 'event').subscribe((res: any) => {

      if (res.detail == "UpdateTheme") {
        let them = localStorage.getItem('user-theme');

        if (them == 'dark-mode') {
          this.themdark = true
        }
        else {
          this.themdark = false
        }
      }
    })
  }
  ngOnInit(): void {
    this.Event()
    let them = localStorage.getItem('user-theme');
    if (them == 'dark-mode') {
      this.themdark = true
    }
    else {
      this.themdark = false
    }
    this.GetTitle();
    this.EventOpencomment();
    const sb = this.topic_service._IdMenu$.subscribe(res => {
      if (res) {
        this.pageSize = 0;
        this.quillConfig = quillConfig;
        this.dtchanel = res;
        this.content = "";
        this.list_topic = [];
        this.topic_service._Comment$.next(undefined)
        if (res.idchildmenu) {
          this.isprivate = true
          this.loadDataList(res.idchildmenu, '');
          this.idmenu = res.idchildmenu
        }
        else {
          this.isprivate = false;
          this.loadDataList(res.id, '');
          this.idmenu = res.id
        }



        this.GetListReaction();

      }
    })
    this._subscriptions.push(sb);



  }

  ngOnDestroy() {
    if (this._subscriptions) {
      this._subscriptions.forEach((sb) => sb.unsubscribe());
    }
    this.pageSize = 0;
  }
  DeleteText() {
    this.content = "";

  }
  // @ViewChild(QuillEditorComponent, { static: true })
  // editor: QuillEditorComponent;
  // modules = {

  //   toolbar: [

  //     ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
  //     ['blockquote', 'code-block'],

  //     [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  //     [{ 'list': 'ordered'}, { 'list': 'bullet' }],
  //     [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  //     [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  //     [{ 'direction': 'rtl' }],                         // text direction

  //     [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  //     [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  //     [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  //     [{ 'font': [] }],
  //     [{ 'align': [] }],

  //     ['clean'],                                         // remove formatting button

  //     ['link', 'image', 'video']                         // link and image, video
  //   ]

  // //   mention: {
  // //     mentionListClass: "ql-mention-list mat-elevation-z8",
  // //     allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
  // //     showDenotationChar: false,
  // //     // mentionDenotationChars: ["@", "#"],
  // //     spaceAfterInsert: false,

  // //     onSelect: (item, insertItem) => {


  // //       let index=this.lstTagName.findIndex(x=>x==item.id);
  // //       if(index<0)
  // //       {
  // //         this.lstTagName.push(item.id)
  // //       }





  // //      console.log("IIIIIIIIII", this.lstTagName)
  // //       const editor = this.editor.quillEditor;
  // //       insertItem(item);
  // //       // necessary because quill-mention triggers changes as 'api' instead of 'user'
  // //       editor.insertText(editor.getLength() - 1, "", "user");
  // //     },
  // //     renderItem : function (item, searchTerm)
  // //     {

  // //       if(item.Avatar)
  // //       {



  // //       return `
  // //     <div >

  // //     <img  style="    width: 30px;
  // //     height: 30px;
  // //     border-radius: 50px;" src="${item.Avatar}">
  // //     ${item.value}



  // //     </div>`;
  // //   }
  // //   else if(item.id!=="All")
  // //   {
  // //     return `
  // //     <div style="    display: flex;
  // //     align-items: center;" >

  // //       <div  style="     height: 30px;
  // //       border-radius: 50px;    width: 30px; ;background-color:${item.BgColor}">
  // //       </div>
  // //       <span style=" position: absolute;     left: 20px;  color: white;">${item.value.slice(0,1)}</span>
  // //       <span style=" padding-left: 5px;">  ${item.value}</span>

  // //     </div>`;
  // //   }
  // //   else
  // //   {
  // //     return `
  // //     <div style="    display: flex;
  // //     align-items: center;" >

  // //       <div  style="     height: 30px;
  // //       border-radius: 50px;    width: 30px; ;background-color:#F3D79F">
  // //       </div>
  // //       <span style=" position: absolute;     left: 20px;  color: white;">@</span>
  // //       <span style=" padding-left: 5px;">${item.note}</span>
  // //       <span style=" padding-left: 5px;">  ${item.value}</span>

  // //     </div>`;
  // //   }
  // // },
  // //     source: (searchTerm, renderItem) => {
  // //        const values = this.lisTagGroup;


  // //       if (searchTerm.length === 0) {
  // //         renderItem(values, searchTerm);

  // //       } else {
  // //         const matches = [];

  // //         values.forEach(entry => {
  // //           if (
  // //             entry.value.toLowerCase().replace(/\s/g, '').indexOf(searchTerm.toLowerCase()) !== -1
  // //           ) {
  // //             matches.push(entry);
  // //           }
  // //         });
  // //         renderItem(matches, searchTerm)

  // //       }
  // //     }
  // //   }
  // };
  public prependItems(): void {
    this.pageSize += 1;
    this.loadDataListLayzy(this.pageSize)
  }


  saverange(value) {
    this.search(value)

  }

  search(value) {
    // filter.HOTEN =filter;
    //  this.accountManagementService.patchState({ filter }

    if (value != "") {


      const filter = {};
      filter['CreatedDate'] = value
      this.loadDataList(this.idmenu, filter);
    }
    // else {

    //   const filter = {};
    //   this._team_services.patchStateAllfile({ filter }, this.api_allfile, this.RowId);

    // }

  }

  Reload() {
    this.search_date = '';
    this.loadDataList(this.idmenu, "");

  }
  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    if (event.target.scrollTop == 0) {
      this.prependItems();
    }

  }
}

