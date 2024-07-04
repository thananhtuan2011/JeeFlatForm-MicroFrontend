import { async } from '@angular/core/testing';
import { TaoCuocHopDialogComponent } from './../../../../../../../jeemeeting/src/app/page/JeeMeetingModule/components/tao-cuoc-hop-dialog/tao-cuoc-hop-dialog.component';
import { HubConnection } from '@microsoft/signalr';
import { ConversationService } from '../../services/conversation.service';
import * as CryptoJS from 'crypto-js';
import { ChangeDetectorRef, Component, Input, OnInit, NgZone, ElementRef, ViewChild, HostListener, OnDestroy, TemplateRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CdkVirtualScrollViewport, ScrollDispatcher } from '@angular/cdk/scrolling';
import { FormControl, NgForm } from '@angular/forms';
import { BehaviorSubject, fromEvent, Observable, Observer, ReplaySubject, Subject, Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ThanhVienGroupComponent } from '../thanh-vien-group/thanh-vien-group.component';
import moment from 'moment-timezone';
import { PopoverContentComponent } from 'ngx-smart-popover';

import { QuillEditorComponent } from 'ngx-quill';
import "quill-mention";
import { ShareMessageComponent } from '../share-message/share-message.component';
// import * as Peer from 'peerjs';
import { MatAccordion, MatExpansionPanelState, matExpansionAnimations } from '@angular/material/expansion';
import { CdkAccordionItem } from '@angular/cdk/accordion';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import { PresenceService } from '../../services/presence.service';
import { MessageService } from '../../services/message.service';

import { MatSidenav } from '@angular/material/sidenav';

import { HttpEventType } from '@angular/common/http';
import { PreviewfileComponent } from '../previewfile/previewfile.component';
import { concatMap, filter, finalize } from 'rxjs/operators';
import { formatDate } from '@angular/common';
import { ThisReceiver } from '@angular/compiler';
import { ChangeBg } from '../../models/Bgchange';
import { TaoBinhChonComponent } from '../tao-binh-chon/tao-binh-chon.component';
import { MemberVoteModel } from '../../models/membervote.model';
import { LoadVoteComponent } from '../load-vote/load-vote.component';
import { TranslateService } from '@ngx-translate/core';
import { PreviewAllimgComponent } from '../preview-allimg/preview-allimg.component';
import { EncodeChatComponent } from '../encode-chat/encode-chat.component';
import { ChatService } from '../../services/chat.service';
import { ThemeService } from 'src/app/_metronic/core/services/theme.service';
import { Message, MessageError } from '../../models/message';
import { EditGroupNameComponent } from '../edit-group-name/edit-group-name.component';
import { InsertThanhvienComponent } from '../insert-thanhvien/insert-thanhvien.component';
import { QueryParamsModelNewLazy } from '../../models/pagram';
import { NotifyMessage } from '../../models/NotifyMess';
import { LinkConver } from '../../models/LinkConversation';
import { SeenMessModel } from '../../models/SeenMess';
import { CallVideoComponent } from '../call-video/call-video.component';
import { ConversationModel } from '../../models/conversation';
import { locale as viLang } from 'projects/jeechat/src/modules/i18n/vocabs/vi';
import { LayoutUtilsService, MessageType } from 'projects/jeechat/src/modules/crud/utils/layout-utils.service';
import { TranslationService } from 'projects/jeechat/src/modules/i18n/translation.service';
import { GhimModel } from '../../models/Ghim';

@Component({
  selector: 'app-detail-chat',
  templateUrl: './detail-chat.component.html',
  styleUrls: ['./detail-chat.component.scss']
})
export class DetailChatComponent implements OnInit, OnDestroy {
  private _scrollingUp = new Subject<number>();
  private _scrollingDown = new Subject<number>();

  appCodeVTS = "VTSWORK"
  countsendcomposing: number = 0
  formats = [
    'background',
    'bold',
    'color',
    'font',
    'code',
    'italic',
    'link',
    'size',
    'strike',
    'script',
    'mention',
    'underline',
    'blockquote',
    'header',
    'indent',
    'list',
    'align',
    'direction',
    'code-block',
    'formula',
    // 'image',
    // 'video'
  ];
  ischeckconnect: boolean = false
  selectedTab: number = 0;
  showstoresticker: boolean = false;
  selectedTabstore: number = 1;
  min: number = 1000;
  max: number = 2000;
  IdChatReplay: number = 0;
  isDropup = true;
  KeyEnCode: string;
  parentCount = 0;
  listStickerTime: any[] = []
  cssfileuser: boolean;
  isEnCode: boolean;
  opensearch: boolean = false
  isshowdouwn: boolean = false
  searchText: string;
  messchecklink: string;
  Avatar: string;
  isloadingError: boolean = false
  themdark: boolean = false
  bgurl: any;
  listStoreSticker: any[] = []
  listQLStoreSticker: any[] = []
  imgopen: any[] = []
  imgall: any[] = []
  listSearch: any[] = []
  isCollapsed = true;
  isCollapsedsticker = true;
  listbgimg = [
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen1.jpg",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen2.jpg",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen3.jfif",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen4.jpg",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen5.jpg",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen6.jpg",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen8.jpg",
    "https://cdn.jee.vn/jee-chat/Icon/hinhnen9.jpg",

  ]
  draftmessage: any[] = [];
  tabs = ['Ảnh', 'File',];
  showbodyfile: boolean = false
  listUser: any[] = []
  // draft:any[]=[]
  interval: any;
  intervalcheck: any;
  intervaldownload: any;
  loadingfilelarge: boolean = true
  progress: number;
  progressdown: number = 0;
  loadingchat: boolean = false
  pdfSrc: string = ""
  base64Image: any;
  config = {
    wheelZoom: true,
  }
  id_attprocess: number
  filenameprocess: string;
  datadownload: any;
  // @ViewChild("imageViewer")
  // viewer: ImageViewerComponent;

  fullscreen: boolean = false;
  imageIndex: number = 0;
  selected = new FormControl(0);
  colornav: boolean;
  // images = [
  //   'https://cdn.jee.vn/jee-chat/File/287337338_1067007664244632_5046690837796979134_n103033.jpg',
  // ]
  LstImagePanel: any[] = [];
  LstImagePanelTop9: any[] = [];
  LstPanelLink: any[] = [];
  LstAllPanelLink: any[] = [];
  Lstimg_bg: any[] = [];
  LstFilePanel: any[] = [];
  LstFilePanelTop4: any[] = [];
  loading_file: boolean = false;
  list_file_large: any[] = [];
  list_loading_image: any[] = [

    { id: 1 }, { id: 2 }
  ];
  list_loading_file: any[] = [];
  list_loading_video: any[] = [];
  allfile: boolean = false;
  allfileImage: boolean = false;
  thanhviennhomn: number;
  active_SeenMess: boolean = false;
  active_tagname: boolean = true;
  active_danhan: boolean = false;
  listtagname: any[] = [];
  isGroup: boolean = false;
  listReply: any[] = [];
  lstThamGia: any[] = [];
  tam: any[] = [];
  id_chat_notify: number;
  listTagGroupAll: any[] = [];
  _lstChatMessMoreDetail: any[] = [];
  public listChoseTagGroup: any[] = [];
  lisTagGroup: any[] = [];
  listInfor: any[] = [];
  list_reaction: any[] = [];
  isloading: boolean = false;

  @ViewChild('myFileInput') myFileInput;
  @ViewChild('sideNav', { static: true }) sidenav: MatSidenav;
  @ViewChild('myPopoverC', { static: true }) myPopover: PopoverContentComponent;
  acivepush: boolean = true;
  @ViewChild('messageForm') messageForm: NgForm;
  messageContent: string;
  txttam: string = "";
  composingname: string;
  TenGroup: string;
  show: boolean = false;
  pageSize: number = 0;
  pageSizedetailbottom: number = 0;
  pageSizedetailtop: number = 4;
  lstChatMess: any[] = []
  lstTagName: any[] = []
  listMess: any[] = [];
  composing: boolean = false
  userCurrent: string;
  valtxt: string;
  UserId: number;
  Fullname: string;
  @Input() id_Group: any;
  @Input() id_Chat: any;
  loading: boolean = false;
  list_image: any[] = [];
  list_file: any[] = [];
  AttachFileChat: any[] = [];
  AttachFileChatLage: any[] = [];
  listFileChat: any[] = [];
  active: boolean = false;
  listreaction: any[] = [];
  Avataruser: string;
  fullname: string;
  //   call video và  share creen
  peerIdShare: string;
  peerId: string;
  private lazyStream: any;
  currentPeer: any;
  private peerList: Array<any> = [];
  panelOpenState = false;
  customerID: number;
  list_Vote: any[] = [];


  messerror: any[] = [];
  protected ngUnsubscribe: Subject<void> = new Subject<void>();
  private _subscriptions: Subscription[] = [];

  private _subscriptions_chat: Subscription[] = [];
  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;
  @ViewChild('scrollMe') private scrollMeChat: ElementRef;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    private el: ElementRef,
    private themservice: ThemeService,
    private translate: TranslateService,
    private scrollDispatcher: ScrollDispatcher,
    private changeDetectorRefs: ChangeDetectorRef,
    private chatService: ChatService,
    private route: ActivatedRoute,
    private router: Router,
    // private menu_service: MenuServices,
    private conversation_service: ConversationService,
    // private auth:AuthService,
    public dialog: MatDialog,
    private _ngZone: NgZone,
    private layoutUtilsService: LayoutUtilsService,
    public presence: PresenceService,
    public messageService: MessageService,
    private translationService: TranslationService,
  ) {


    const dt = this.conversation_service.getAuthFromLocalStorage();
    this.userCurrent = dt.user.username;
    this.UserId = dt['user']['customData']['jee-account']['userID'];
    this.Fullname = dt['user']['customData']['personalInfo']['Fullname'];
    this.Avataruser = dt['user']['customData']['personalInfo']['Avatar'];
    this.customerID = dt['user']['customData']['jee-account']['customerID'];
    this.Avatar = dt['user']['customData']['personalInfo']['Avatar'];
    this.fullname = dt['user']['customData']['personalInfo']['Fullname'];
    this.isloading = false;
    this.translationService.loadTranslations(
      viLang,
    );
    var langcode = localStorage.getItem('language');
    if (langcode == null)
      langcode = this.translate.getDefaultLang();
    this.translationService.setLanguage(langcode);

  }
  saveOrOpenBlobFileAll(url, blobName, index, idchat: number, id_attch: number) {

    const progressdowload = document.getElementById("progressleft" + index);
    const progressText = document.getElementById("progress-textleft" + index);
    const kbdownload = document.getElementById("kbdownloadleft" + index);
    const downloadfile = document.getElementById("downloadfileleft" + index);


    var start = new Date().getTime()
    var blob;
    var xmlHTTP = new XMLHttpRequest();

    xmlHTTP.open('GET', url, true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function (e) {
      blob = new Blob([this.response]);
    };
    xmlHTTP.onprogress = (pr) => {

      progressdowload.classList.add('progressdownchat');
      downloadfile.classList.add('downloadfile');
      progressdowload.style.width = Math.floor((pr.loaded / pr.total) * 100) + "px"
      progressText.innerHTML = Math.floor((pr.loaded / pr.total) * 100) + "%";
      // this.kbdownload=pr.total-pr.loaded
      var end = new Date().getTime()
      let duration = (end - start) / 1000;
      let bps = pr.loaded / duration;
      let kbps = bps / 1024
      kbdownload.innerHTML = Math.floor(kbps) + " KB/s"
      this.changeDetectorRefs.detectChanges();
    };
    xmlHTTP.onloadend = function (e) {
      var fileName = blobName;
      var tempEl = document.createElement("a");
      document.body.appendChild(tempEl);

      url = window.URL.createObjectURL(blob);
      tempEl.href = url;
      tempEl.download = fileName;

      tempEl.click();
      window.URL.revokeObjectURL(url);

    }
    xmlHTTP.send();

    this.UpdateisDownloadPanelAll(this.id_Group, idchat, id_attch);

  }
  saveOrOpenBlobFile(url, blobName, index, idchat: number, id_attch: number) {

    const progressdowload = document.getElementById("progressleft" + index);
    const progressText = document.getElementById("progress-textleft" + index);
    const kbdownload = document.getElementById("kbdownloadleft" + index);
    const downloadfile = document.getElementById("downloadfileleft" + index);


    var start = new Date().getTime()
    var blob;
    var xmlHTTP = new XMLHttpRequest();

    xmlHTTP.open('GET', url, true);
    xmlHTTP.responseType = 'arraybuffer';
    xmlHTTP.onload = function (e) {
      blob = new Blob([this.response]);
    };
    xmlHTTP.onprogress = (pr) => {

      progressdowload.classList.add('progressdownchat');
      downloadfile.classList.add('downloadfile');
      progressdowload.style.width = Math.floor((pr.loaded / pr.total) * 100) + "px"
      progressText.innerHTML = Math.floor((pr.loaded / pr.total) * 100) + "%";
      // this.kbdownload=pr.total-pr.loaded
      var end = new Date().getTime()
      let duration = (end - start) / 1000;
      let bps = pr.loaded / duration;
      let kbps = bps / 1024
      kbdownload.innerHTML = Math.floor(kbps) + " KB/s"
      this.changeDetectorRefs.detectChanges();
    };
    xmlHTTP.onloadend = function (e) {
      var fileName = blobName;
      var tempEl = document.createElement("a");
      document.body.appendChild(tempEl);

      url = window.URL.createObjectURL(blob);
      tempEl.href = url;
      tempEl.download = fileName;

      tempEl.click();
      window.URL.revokeObjectURL(url);

    }
    xmlHTTP.send();

    this.UpdateisDownloadPanel(this.id_Group, idchat, id_attch);

  }
  UpdateisDownloadPanelAll(idgroup: number, idchat: number, id_attch: number) {
    const sb = this.chatService.UpdateIsDownload(idgroup, idchat, id_attch).subscribe((res: any) => {
      if (res) {

        let indexfile = this.LstFilePanel.findIndex(r => r.id_att == id_attch);
        if (indexfile >= 0) {
          this.LstFilePanel[indexfile].isDownload = true;
          this.filteredFile.next(this.LstFilePanel.slice());
          this.changeDetectorRefs.detectChanges();
        }

      }
    })

    this._subscriptions.push(sb)
  }
  UpdateisDownloadPanel(idgroup: number, idchat: number, id_attch: number) {
    const sb = this.chatService.UpdateIsDownload(idgroup, idchat, id_attch).subscribe((res: any) => {
      if (res) {

        let indexfile = this.LstFilePanelTop4.findIndex(r => r.id_att == id_attch);
        if (indexfile >= 0) {
          this.LstFilePanelTop4[indexfile].isDownload = true;

          this.changeDetectorRefs.detectChanges();
        }

      }
    })

    this._subscriptions.push(sb)
  }

  UpdateisDownload(idgroup: number, idchat: number, id_attch: number) {
    const sb = this.chatService.UpdateIsDownload(idgroup, idchat, id_attch).subscribe((res: any) => {

      if (res) {
        let indexdown = this.listMess.findIndex(x => x.IdChat == res.data.IdChat);
        if (indexdown >= 0) {
          let indexfile = this.listMess[indexdown].Attachment_File.findIndex(r => r.id_att == id_attch);
          if (indexfile >= 0) {
            this.listMess[indexdown].Attachment_File[indexfile].isDownload = true
            this.changeDetectorRefs.detectChanges();
          }

        }
      }
    })

    this._subscriptions.push(sb)
  }
  saveOrOpenBlob(url, blobName, check, index, indexfile, idgroup: number, idchat: number, id_attch: number) {

    const progressdowload = document.getElementById("progress" + index + indexfile);
    const progressText = document.getElementById("progress-text" + index + indexfile);
    const kbdownload = document.getElementById("kbdownload" + index + indexfile);
    const downloadfile = document.getElementById("downloadfile" + index + indexfile);

    if (check == true) {
      this.layoutUtilsService.showActionNotification('Đang tải file vui lòng đợi', MessageType.Read, 3000, true, false, 3000, 'top', 0);
    }
    else {

      var start = new Date().getTime()
      var blob;
      var xmlHTTP = new XMLHttpRequest();

      xmlHTTP.open('GET', url, true);
      xmlHTTP.responseType = 'arraybuffer';
      xmlHTTP.onload = function (e) {
        blob = new Blob([this.response]);
      };
      xmlHTTP.onprogress = (pr) => {

        progressdowload.classList.add('progressdownchat');
        downloadfile.classList.add('downloadfile');
        progressdowload.style.width = Math.floor((pr.loaded / pr.total) * 100) + "px"
        progressText.innerHTML = Math.floor((pr.loaded / pr.total) * 100) + "%";
        // this.kbdownload=pr.total-pr.loaded
        var end = new Date().getTime()
        let duration = (end - start) / 1000;
        let bps = pr.loaded / duration;
        let kbps = bps / 1024
        kbdownload.innerHTML = Math.floor(kbps) + " KB/s"
        this.changeDetectorRefs.detectChanges();
      };
      xmlHTTP.onloadend = function (e) {
        var fileName = blobName;
        var tempEl = document.createElement("a");
        document.body.appendChild(tempEl);

        url = window.URL.createObjectURL(blob);
        tempEl.href = url;
        tempEl.download = fileName;

        tempEl.click();
        window.URL.revokeObjectURL(url);

      }
      xmlHTTP.send();
    }
    this.UpdateisDownload(idgroup, idchat, id_attch);
  }


  // downloadfile(name: string, url: string,idchat:number,filename:string,check:boolean) {

  //   if(check==true)
  //   {
  // this.layoutUtilsService.showActionNotification('Đang tải file vui lòng đợi', MessageType.Read, 3000, true, false, 3000, 'top', 0);
  //   }
  //   else
  //   {

  //   this.idchatprocess=idchat
  //   this.filenameprocess=filename;
  //   this.download$ = this.downloads.download(url, name)
  //   // this.downloads.download(url, name).subscribe(res=>{
  //   //   console.log("REEEEE",res)
  //   // })
  //   }

  // }
  getBase64ImageFromURL(url: string) {
    return Observable.create((observer: Observer<string>) => {
      const img: HTMLImageElement = new Image();
      img.crossOrigin = "Anonymous";
      img.src = url;
      if (!img.complete) {
        img.onload = () => {
          observer.next(this.getBase64Image(img));
          observer.complete();
        };
        img.onerror = err => {
          observer.error(err);
        };
      } else {
        observer.next(this.getBase64Image(img));
        observer.complete();
      }
    });
  }

  getBase64Image(img: HTMLImageElement) {
    const canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const dataURL: string = canvas.toDataURL("image/png");

    return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  }
  downloadimage(url: string) {
    this.getBase64ImageFromURL(url).subscribe(base64data => {
      this.base64Image = "data:image/jpg;base64," + base64data;
      // save image to disk
      var link = document.createElement("a");

      document.body.appendChild(link); // for Firefox

      link.setAttribute("href", this.base64Image);
      link.setAttribute("download", "download.jpg");
      link.click();
    });
  }
  RemoveVideos(index) {

    this.myFilesVideo.splice(index, 1);
    this.AttachFileChat.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
    this.url = "";
  }


  myFilesVideo: any[] = [];

  url;
  onSelectVideo(event) {

    let base64Str: any;
    const file = event.target.files && event.target.files;
    if (file) {
      var reader = new FileReader();

      reader.onload = (event) => {
        this.myFilesVideo.push(event.target.result);
        var metaIdx = event.target.result.toString().indexOf(';base64,');
        base64Str = event.target.result.toString().substr(metaIdx + 8);


        this.AttachFileChat.push({ filename: file[0].name, type: file[0].type, size: file[0].size, strBase64: base64Str });
        this.url = (<FileReader>event.target).result;
      }
      reader.readAsDataURL(file[0]);
    }
  }

  onPaste(event: any) {

    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    let blob = null;
    var filesAmount = event.clipboardData.files.length;
    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
      }
    }

    // load image if there is a pasted image
    if (blob !== null) {
      let base64Str: any;
      var file_name = blob;
      const reader = new FileReader();
      reader.onload = (evt: any) => {
        this.list_image.push(evt.target.result);
        let tamp = []
        tamp.push(evt.target.result);
        var metaIdx = tamp[0].indexOf(';base64,');
        base64Str = tamp[0].substr(metaIdx + 8);
        let sepPos = file_name.name.lastIndexOf('.');
        this.AttachFileChat.push({ filename: file_name.name.substr(0, sepPos) + file_name.lastModified + file_name.name.substr(file_name.name.indexOf('.')), type: file_name.type, size: file_name.size, strBase64: base64Str });
        console.log('this.AttachFileChatthis.AttachFileChatthis.AttachFileChat', this.AttachFileChat)
        this.changeDetectorRefs.detectChanges();
      };
      reader.readAsDataURL(blob);
    }
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


      const data = this.conversation_service.getAuthFromLocalStorage();
      // id_chat_notify
      var _token = data.access_token;
      let item = this.ItemMessengerFile();
      this.messageService.sendMessage(_token, item, this.id_Group).then((res) => {
        this.list_file_large = []
        this.listReply = [];
        this.loadingfilelarge = true;
      })


      setTimeout(() => {


        this.progress = 0;
        this.interval = setInterval(() => {
          if (this.progress < 90) {
            this.progress = this.progress + 0.5;
            this.changeDetectorRefs.detectChanges();
          }

        }, 400);
        // this.list_file.push(event.target.files);
        let filesToUpload: File[] = event.target.files;
        const frmData = new FormData();
        Array.from(filesToUpload).map((file, index) => {
          return frmData.append('file' + index, file, file.name);
        });


        this.chatService.UploadfileLage(frmData, this.id_Group, this.id_chat_notify).subscribe(

          {
            next: (event) => {
              if (event.type === HttpEventType.UploadProgress) {

                // this.progress = Math.round((100 / event.total) * event.loaded);
                // console.log("thisprogress",this.progress)


              }

              else if (event.type === HttpEventType.Response) {
                if (event.body) {
                  this.loadingfilelarge = false;

                  this.progress = 100;

                  if (this.progress == 100) {
                    clearInterval(this.interval);
                  }
                  this.changeDetectorRefs.detectChanges();
                  // alert("Upload thành công")

                }
              }
            },

          })
      }, 500);
      //  this.layoutUtilsService.showActionNotification('File quá lớn!', MessageType.Read, 3000, true, false, 3000, 'top', 0);
    }
    else {


      this.show = false;

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

  RemoveChoseFile(index) {
    this.AttachFileChat.splice(index, 1);
    this.listFileChat.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
  }
  RemoveChoseImage(index) {
    this.list_image.splice(index, 1);
    this.AttachFileChat.splice(index, 1);
    this.changeDetectorRefs.detectChanges();
  }
  showPT() {
    if (this.show) {
      this.show = false;
    }
    else {
      this.show = true;
    }

  }
  showEmojiPicker = false;
  sets = [
    'native',
    'google',
    'twitter',
    'facebook',
    'emojione',
    'apple',
    'messenger'
  ]
  // set = 'twitter';
  set = 'facebook';
  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event) {
    let { txttam } = this;

    if (txttam === null) {
      txttam = '';
    }
    const text = `${txttam}${event.emoji.native}`;

    this.txttam = text;
    this.messageContent = text
    // this.showEmojiPicker = false;
  }


  ItemMessengerMeeting(idMeting, content): Message {

    const item = new Message();

    item.isTagName = false
    item.Content_mess = content;
    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.isGroup = this.isGroup;
    item.IdMeeting = idMeting;
    if (this.listReply.length > 0) {
      if (this.listReply[0].Content_mess === "") {
        item.Note = this.listReply[0].FullName + ": Tệp đính kèm";
      }
      else {
        item.Note = this.listReply[0].FullName + ":" + this.listReply[0].Content_mess;
      }

    }
    else {
      item.Note = "";
    }

    item.IsDelAll = false;
    item.IsVideoFile = this.url ? true : false;
    item.Attachment = this.AttachFileChat.slice();

    return item
  }

  LayThu(v: any) {
    let day = new Date(v);
    switch (day.getDay()) {
      case 0:
        return "Chủ nhật";
      case 1:
        return "Thứ 2";
      case 2:
        return "Thứ 3";
      case 3:
        return "Thứ 4";
      case 4:
        return "Thứ 5";
      case 5:
        return "Thứ 6";
      case 6:
        return "Thứ 7";
    }
  }
  f_convertDate(v: any) {
    if (v != "" && v != null) {
      let a = new Date(v);
      return (
        ("0" + a.getDate()).slice(-2) +
        "/" +
        ("0" + (a.getMonth() + 1)).slice(-2) +
        "/" +
        a.getFullYear()
      );
    }
  }

  f_convertHour(v: any) {
    if (v != "" && v != null) {
      let a = new Date(v);
      return (
        ("0" + a.getHours()).slice(-2) + ":" + ("0" + a.getMinutes()).slice(-2)
      );
    }
  }

  f_number(value: any) {
    return Number((value + "").replace(/,/g, ""));
  }

  f_currency(value: any, args?: any): any {
    let nbr = Number((value + "").replace(/,|-/g, ""));
    return (nbr + "").replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  }

  convertDate(d: any) {
    return moment(d).format("YYYY-MM-DDTHH:mm:ss.sss");
  }
  convertDateTime(d: any) {
    return moment(d).format("HH:mm");
  }


  TaoCuocHop() {

    this.chatService.GetTaoUserTaoCuocHop(this.id_Group).subscribe(res => {
      this.lstThamGia = res.data;
      let lstThamGiaTemp = []
      if (this.lstThamGia.length > 0) {
        this.lstThamGia.forEach(element => {
          if (element.InfoMemberUser.length > 0) {
            let a = {
              username: element.Username,
              idUser: element.idUser,
              HoTen: element.Fullname,
              ChucVu: element.InfoMemberUser[0].ChucVu,
              Image: element.InfoMemberUser[0].Image
            }
            lstThamGiaTemp.push(a)
          }
        });
      }
      const dialogRef = this.dialog.open(TaoCuocHopDialogComponent, {
        // disableClose: true,
        panelClass: 'no-padding', data: { listThamGia: lstThamGiaTemp, type: 'CHAT' }, width: '40%',
        height: '90vh'

      });
      //   const dialogRef = this.dialog.open(DangKyCuocHopPageComponent, {

      // data:this.lstThamGia
      //     // panelClass:'no-padding'
      //   });
      dialogRef.afterClosed().subscribe(res => {
        if (res) {
          let txt = "";
          if (res.data.data[0].TaiSanSuDung == null) {
            // var futureDate = new Date(res.data.data[0].FromTime +res.data.data[0].TimeLimit);
            // var futureDate = new Date(res.data.data[0].FromTime.get()
            var futureDate = '' + moment(moment(res.data.data[0].FromTime).format("HH:mm"), "HH:mm").add({
              hours: 0,
              minutes: Number(res.data.data[0].TimeLimit)
            }).format("HH:mm")
            txt = '<div class="demomeeting">' + this.LayThu(
              this.convertDate(res.data.data[0].BookingDate)
            ) +
              " " +
              this.f_convertDate(
                this.convertDate(res.data.data[0].BookingDate)
              ) +
              ", " +
              this.convertDateTime(res.data.data[0].FromTime) +
              " - " +
              futureDate + '<br/>'
              + '<span class="demo">' + res.data.data[0].MeetingContent + '</span>' + '</div>'
              ;

            this.sendMessageMeeting(res.data.data[0].RowID, txt);
          }
          else {


            if (res.data.data[0].TaiSanSuDung[0].LoaiTaiSan == 1) {

              txt = '<div class="demomeeting">' + res.data.data[0].TaiSanSuDung[0].TenTaiSan + ' <br/>' + this.LayThu(
                this.convertDate(res.data.data[0].TaiSanSuDung[0].BookingDate)
              ) +
                " " +
                this.f_convertDate(
                  this.convertDate(res.data.data[0].TaiSanSuDung[0].BookingDate)
                ) +
                ", " +
                this.convertDateTime(res.data.data[0].TaiSanSuDung[0].FromTime) +
                " - " +
                this.convertDateTime(res.data.data[0].TaiSanSuDung[0].ToTime) + '<br/>'
                + '<span class="demo">' + res.data.data[0].TaiSanSuDung[0].ContentNote + '</span>' + '</div>'
                ;


              this.sendMessageMeeting(res.data.data[0].RowID, txt);
              //console.log("dữ liệu tạo cuộc họp",res)
              // console.log("Tạo cuộc họp",txt)

              // this.GetInforUserChatwith(this.id_Group)
              this.changeDetectorRefs.detectChanges();
            }
          }
        }

      })
    })
  }
  EditNameGroup(item: any) {
    const dialogRef = this.dialog.open(EditGroupNameComponent, {
      width: '400px',
      data: item
      // panelClass:'no-padding'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.GetInforUserChatwith(this.id_Group)
        this.changeDetectorRefs.detectChanges();
      }
    })

  }
  HidenMess(IdChat: number, IdGroup: number) {
    const data = this.conversation_service.getAuthFromLocalStorage();

    var _token = data.access_token;
    this.messageService.HidenMessage(_token, IdChat, IdGroup)
  }

  ReplyMess(item) {
    this.listReply = [];
    this.IdChatReplay = item.IdChat
    this.listReply.push(item);
    //  this.editor.focus()
    setTimeout(() => {
      this.editor.quillEditor.focus()
    }, 500);

    this.changeDetectorRefs.detectChanges();
  }



  saverange(value) {
    if (value) {

      if (value.includes("href")) {

        var href = value.match('<a.*href="([^"]*)".*?<\/a>')[1];
        // this.messageContent=value.replace(/<a(.*?)a>/g, href).replace("</a>","");
        this.txttam = value.replace(/<a(.*?)a>/g, href).replace("</a>", "");
        this.messageContent = this.txttam;

      }
      else {
        this.messageContent = value.replace(/<a(.*?)>/g, "").replace("</a>", "");
      }

      //   value=value.replace("<p><br></p>", "");
      // // xóa thẻ a không cần thiết
      //     this.messageContent=value;
      //     console.log(" this.messageContent", this.messageContent)
    }
    else {
      this.messageContent = ''
      this.countsendcomposing = 0;
    }
    setTimeout(() => {
      if (value && this.countsendcomposing <= 3) {

        const data = this.conversation_service.getAuthFromLocalStorage();

        var _token = data.access_token;
        this.messageService.Composing(_token, this.id_Group).then(res => {
          this.countsendcomposing = this.countsendcomposing + 1;
        }

        ).catch()


      }
      else {
        return;

      }
    }, 3000);
  }


  ItemInsertMessenger(note: string): Message {
    const item = new Message();
    item.Content_mess = 'đã thêm';
    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.isGroup = this.isGroup;
    item.Note = note;
    item.isTagName = false
    item.isInsertMember = true;
    item.IsDelAll = false;
    item.IsVideoFile = this.url ? true : false;
    item.isFile = false;
    item.Attachment = []


    return item
  }



  sendInsertMessage(note: string) {

    this.isloading = false;
    const data = this.conversation_service.getAuthFromLocalStorage();
    var _token = data.access_token;
    let item = this.ItemInsertMessenger(note);
    this.messageService.sendMessage(_token, item, this.id_Group).then(() => {


    })





  }
  InsertThanhVienGroup() {
    const dialogRef = this.dialog.open(InsertThanhvienComponent, {
      width: '500px',
      data: this.id_Group

      // panelClass:'no-padding'

    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        let chuoi = "";
        res.data.forEach(element => {
          chuoi = chuoi + ',' + element.FullName
        });


        this.sendInsertMessage(chuoi.substring(1));
        this.GetInforUserChatwith(this.id_Group)
        this.changeDetectorRefs.detectChanges();
      }
    })

  }
  // LoadDataDetailDefaultMessSearch(idGroup,IdChat)
  // {
  //   const queryParams1 = new QueryParamsModelNewLazy(

  //     '',
  //     '',
  //     '',

  //       0,
  //     50,
  //     false,



  //   );
  //   this.chatService.GetMessDetailDefault(idGroup,IdChat,queryParams1).subscribe(res=>
  //     {
  //       this.listMess = res.data;
  //       this.loadingchat=false;
  //       let index=this.listMess.findIndex(x=>x.IdChat==this.id_Chat);
  //       setTimeout(() => {
  //       this.viewPort.scrollToIndex(index);

  //       }, 500);

  //       //  this._scrollToBottom();
  //       this.changeDetectorRefs.detectChanges();
  //     })



  // }
  LoadDataReply(idchat) {
    this.router.navigate(['Chat/Messages/' + this.id_Group + '/' + idchat]);
  }
  GoBack() {
    this.id_Chat = undefined
    this.router.navigate(['Chat/Messages/' + this.id_Group + '/null']);
  }
  LoadDataDetailDefaultMess(idGroup, IdChat) {
    const queryParams1 = new QueryParamsModelNewLazy(

      '',
      '',
      '',

      0,
      50,
      false,



    );
    this.chatService.GetMessDetailDefault(idGroup, IdChat, queryParams1).subscribe(res => {
      this.listMess = res.data;

      this.loadingchat = false;
      let index = this.listMess.findIndex(x => x.IdChat == this.id_Chat);

      this.viewPort.scrollTo({
        bottom: 0,
        behavior: 'auto',
      });
      setTimeout(() => {
        this.viewPort.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 0);
      setTimeout(() => {
        this.viewPort.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 50);

      setTimeout(() => {
        this.viewPort.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 100);
      setTimeout(() => {
        this.viewPort.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 200);

      this.changeDetectorRefs.detectChanges();
    })



  }
  loadDataListReconnect() {
    // this.loading=true;


    const queryParams1 = new QueryParamsModelNewLazy(

      '',
      '',
      '',

      0,
      50,
      false,

    );
    const sb = this.chatService.GetListMess(queryParams1, `/chat/Get_ListMess?IdGroup=${this.id_Group}&key=default`).subscribe((res) => {
      this.listMess = res.data;
      if (this.messerror) {
        if (this.messerror.length > 0) {
          this.listMess = this.listMess.concat(this.messerror);
        }
      }
      this.loadingchat = false;
      this.isloading = false;
      this.changeDetectorRefs.detectChanges();

      setTimeout(() => {


        if (this.listMess) {
          this.viewPort.scrollToIndex(this.listMess.length - 1);

          setTimeout(() => {
            this.viewPort.scrollTo({
              bottom: 0,
              behavior: 'auto',
            });
          }, 0);
          setTimeout(() => {
            this.viewPort.scrollTo({
              bottom: 0,
              behavior: 'auto',
            });
          }, 50);

        }
      }, 1000);
    })


    this._subscriptions.push(sb)
  }
  loadDataList() {
    // this.loading=true;


    const queryParams1 = new QueryParamsModelNewLazy(

      '',
      '',
      '',

      0,
      50,
      false,

    );
    const sb = this.chatService.GetListMess(queryParams1, `/chat/Get_ListMess?IdGroup=${this.id_Group}&key=default`).subscribe((res) => {
      this.listMess = res.data;
      this.loadingchat = false;
      this.isloading = false;
      this.listSearch = [];
      this.changeDetectorRefs.detectChanges();

      setTimeout(() => {


        if (this.listMess) {
          this.viewPort.scrollToIndex(this.listMess.length - 1);

          setTimeout(() => {
            this.viewPort.scrollTo({
              bottom: 0,
              behavior: 'auto',
            });
          }, 0);
          setTimeout(() => {
            this.viewPort.scrollTo({
              bottom: 0,
              behavior: 'auto',
            });
          }, 50);

        }
      }, 1000);
    })


    this._subscriptions.push(sb)
  }


  //  scroll top add thêm item
  public appendItemsDetailTop(): void {

    this.loadDataListLayzyDetailTop();


    this.changeDetectorRefs.detectChanges();
  }

  loadDataListLayzyDetailTop() {
    this.pageSizedetailtop += 1;
    const queryParams1 = new QueryParamsModelNewLazy(

      '',
      '',
      '',
      this.pageSizedetailtop,
      10,
      false,



    );



    const sb = this.chatService.GetMessDetailDefault(this.id_Group, this.id_Chat, queryParams1).subscribe((res) => {
      this._lstChatMessMoreDetail = [];

      if (res.data != null && res.status === 1) {
        this._lstChatMessMoreDetail = res.data.reverse();
        if (res.data) {
          for (let i = 0; i < this._lstChatMessMoreDetail.length; i++) {

            this.listMess = [this._lstChatMessMoreDetail[i], ...this.listMess];

            this.isloading = false;

            this.changeDetectorRefs.detectChanges();
          }

          // console.log('listMess detail sau khi push',this.listMess)
        }

      }
    })

    if (this._lstChatMessMoreDetail.length > 0) {
      this.scroll();
    }

    this.changeDetectorRefs.detectChanges();
    this._subscriptions.push(sb)
    // return result;

  }

  private _scrollToBottom() {
    setTimeout(() => {
      this.viewPort.scrollTo({
        bottom: 0,
        behavior: 'auto',
      });
    }, 0);
    setTimeout(() => {
      this.viewPort.scrollTo({
        bottom: 10,
        behavior: 'auto',
      });
    }, 50);

  }
  loadDataListLayzy(page: number) {


    const queryParams1 = new QueryParamsModelNewLazy(

      '',
      '',
      '',
      page,
      50,
      false,



    );

    let measureRenderedContentSizeBefore = this.viewPort.measureRenderedContentSize()
    const sb = this.chatService.GetListMess(queryParams1, `/chat/Get_ListMess?IdGroup=${this.id_Group}`).subscribe((res) => {
      let _lstChatMessMore = [];
      if (res.data != null && res.status === 1 && res.page.Page <= res.page.AllPage) {

        _lstChatMessMore = res.data;
        if (res.data != null) {


          this.listMess = _lstChatMessMore.concat(this.listMess);

          // const offset = this.viewPort.measureScrollOffset("top");
          // if (offset > 0) {

          //   const topPosition =
          //     offset +
          //     _lstChatMessMore.length *
          //      50;
          //       // console.log("topPosition",topPosition)
          //   this.viewPort.scrollTo({
          //     top: topPosition
          //   });

          // }

          this.changeDetectorRefs.detectChanges();

          // for (let i = 0; i < _lstChatMessMore.length; i++) {



          //   this.listMess=[_lstChatMessMore[i],...this.listMess];

          //   this.isloading=false;

          //   this.changeDetectorRefs.detectChanges();
          // }

        }

        let measureRenderedContentSizeAfter = this.viewPort.measureRenderedContentSize()
        setTimeout(() => {
          this.isloading = false;
          const offer = measureRenderedContentSizeAfter - measureRenderedContentSizeBefore;
          this.viewPort.scrollTo({
            top: offer
          });
          // this.viewPort.scrollToIndex(indexscroll + _lstChatMessMore.length, 'auto');
        }, 200);

      }
      else {
        this.isloading = false;
        this.changeDetectorRefs.detectChanges();
      }
    })



    this.changeDetectorRefs.detectChanges();
    this._subscriptions.push(sb)

  }

  scroll() {
    this.isloading = false;
    this.viewPort.scrollToIndex(10, 'smooth');

  }
  public appendItems(): void {
    this.isloading = true;
    this.min = 20000;
    this.max = 40000;
    this.listMess = this.listMess.slice()
    this.pageSize += 1;
    this.loadDataListLayzy(this.pageSize);
    this.changeDetectorRefs.detectChanges();
  }



  // send leave mess group


  ItemLeaveMessenger(content: string, note: string): Message {
    const item = new Message();
    item.Content_mess = content;
    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.IsDelAll = true;
    item.isTagName = false
    item.isGroup = this.isGroup;
    item.Note = note

    item.IsVideoFile = this.url ? true : false;
    item.isFile = false;
    item.Attachment = []
    return item
  }



  sendLeaveMessage(mess: string, note: string) {

    this.isloading = false;
    const data = this.conversation_service.getAuthFromLocalStorage();

    var _token = data.access_token;
    let item = this.ItemLeaveMessenger(mess, note);
    this.messageService.sendMessage(_token, item, this.id_Group).then(() => {


    })





  }

  OpenThanhVien() {
    let noidung;
    let note;
    const dialogRef = this.dialog.open(ThanhVienGroupComponent, {
      width: '500px',
      data: this.id_Group,

      // panelClass:'no-padding'

    });
    dialogRef.afterClosed().subscribe(res => {

      if (res) {

        this.GetInforUserChatwith(this.id_Group)
        if (this.UserId == res.data.UserID) {
          noidung = 'đã rời'

          this.sendLeaveMessage(noidung, '');
        }
        // else {
        //   // xóa thành viên 
        //   // console.log("ress xoa thành viên",res)
        //   // this.chatService.GetUserById(res.data.UserID).subscribe(notedata => {
        //   //   if (notedata) {
        //   //     note = notedata.data[0].Fullname
        //   //     this.sendLeaveMessage(noidung, note);
        //   //   }
        //   // })
        //   // noidung = 'đã xóa '
        // }

        this.changeDetectorRefs.detectChanges();
      }
    })

  }

  // @HostListener('scroll', ['$event'])
  // scrollHandler(event) {
  //   // this._isLoading$.next(true);

  //   this.isloading=false;
  //   if(this.id_Chat)
  //   {

  //     if (event.srcElement.scrollTop ==0) {

  //       // this.appendItems();
  //       // alert("top bằng 0")
  //       this.appendItemsDetailTop();

  //     }

  //       // if (event.target.scrollHeight  - Math.round(event.target.scrollTop+1)==event.target.clientHeight) {

  //       //      this.appendItemsDetailBottom();

  //       // }

  //   // }

  //   // else
  //   // {

  //   // if (event.srcElement.scrollTop==0) {

  //   //   // this.appendItems();
  //   // }


  //   }






  // }



  RouterLink(item) {
    // window.open(item,"_blank")
    // this.dcmt.body.classList.add('header-fixed');
    const dialogRef = this.dialog.open(PreviewfileComponent, {
      width: '1000px',
      data: { item },


    });
    // dialogRef.afterClosed().subscribe(res => {


    //         if(res)
    //   {


    //     this.changeDetectorRefs.detectChanges();
    //   }
    //         })

  }

  getClassHidenTime(item, idchat) {
    if (this.id_Chat) {
      if (item && this.id_Chat == idchat) {
        return 'HidenTime zoom-in-zoom-out';
      }
      else if (item) {
        return 'HidenTime';
      }
      else if (this.id_Chat == idchat) {
        return 'zoom-in-zoom-out';
      }
      else {
        return '';
      }
    }
    else {


      if (item) {
        return 'HidenTime';
      }
      else {
        return '';
      }
    }
  }

  getClassReply(item) {
    if (item == this.userCurrent) {
      return 'reply';
    }
    else {
      return 'reply-user';
    }
  }


  getClassDownload(item) {
    if (item == true) {
      return 'classdownload';
    }

  }

  getClassUser(item, anh: any, file: any, video: any, content, isHidenTime) {
    if (item == this.userCurrent && (anh.length > 0 || file.length > 0 || video.length > 0) && (content == '' || !content)) {
      return 'curent';
    }
    else if (item !== this.userCurrent && (anh.length > 0 || file.length > 0 || video.length > 0) && (content == '' || !content) && !isHidenTime) {
      return 'notcurent';
    }
    else if (item !== this.userCurrent && (anh.length > 0 || file.length > 0 || video.length > 0) && (content == '' || !content) && isHidenTime) {
      return 'notcurent_hidtime';
    }
    else {
      return ''
    }


  }
  getShowMoreChat(item) {
    if (item !== this.userCurrent) {
      return ' chat right';
    }
    else {
      return ' chat';
    }

  }
  getShowMoreChatLeft(item) {
    if (item == this.userCurrent) {
      return ' chat chatleft';
    }
    else {
      return ' chat chatright';
    }

  }
  getClassFile(item) {
    return 'userfile'
  }
  getClassTime(item) {
    if (item === this.userCurrent) {
      return 'timesent';
    }
    else {
      return 'timereplies';
    }
  }
  getClassHiden(item, time: boolean) {

    if (item !== this.userCurrent && !time) {
      return 'hidenmess diff';
    }
    else if (item !== this.userCurrent && time) {
      return 'hidenmess timehidden';
    }
    else {
      return 'hidenmess';
    }
  }

  getClass(item, key, keyinsert, keyvote) {
    if (key === false && !keyinsert && !keyvote) {


      if (item === this.userCurrent) {
        return 'replies ';
      }
      else {
        return 'sent';
      }
    }
    if (key) {
      return 'leaveGroup';
    }
    if (keyinsert) {
      return 'ImsertGroup';
    }
    if (keyvote) {
      return 'ImsertGroup';
    }
  }

  getNameUser(val) {
    if (val) {
      var list = val.split(' ');
      return list[list.length - 1];
    }
    return "";
  }
  getColorNameUser(fullname) {
    var name = this.getNameUser(fullname).substr(0, 1);
    var result = "#bd3d0a";
    switch (name) {
      case "A":
        result = "rgb(197, 90, 240)";
        break;
      case "Ă":
        result = "rgb(241, 196, 15)";
        break;
      case "Â":
        result = "rgb(142, 68, 173)";
        break;
      case "B":
        result = "#02c7ad";
        break;
      case "C":
        result = "#0cb929";
        break;
      case "D":
        result = "rgb(44, 62, 80)";
        break;
      case "Đ":
        result = "rgb(127, 140, 141)";
        break;
      case "E":
        result = "rgb(26, 188, 156)";
        break;
      case "Ê":
        result = "rgb(51 152 219)";
        break;
      case "G":
        result = "rgb(44, 62, 80)";
        break;
      case "H":
        result = "rgb(248, 48, 109)";
        break;
      case "I":
        result = "rgb(142, 68, 173)";
        break;
      case "K":
        result = "#2209b7";
        break;
      case "L":
        result = "#759e13";
        break;
      case "M":
        result = "rgb(236, 157, 92)";
        break;
      case "N":
        result = "#bd3d0a";
        break;
      case "O":
        result = "rgb(51 152 219)";
        break;
      case "Ô":
        result = "rgb(241, 196, 15)";
        break;
      case "Ơ":
        result = "rgb(142, 68, 173)";
        break;
      case "P":
        result = "rgb(142, 68, 173)";
        break;
      case "Q":
        result = "rgb(91, 101, 243)";
        break;
      case "R":
        result = "rgb(44, 62, 80)";
        break;
      case "S":
        result = "rgb(122, 8, 56)";
        break;
      case "T":
        result = "rgb(120, 76, 240)";
        break;
      case "U":
        result = "rgb(51 152 219)";
        break;
      case "Ư":
        result = "rgb(241, 196, 15)";
        break;
      case "V":
        result = "rgb(142, 68, 173)";
        break;
      case "X":
        result = "rgb(142, 68, 173)";
        break;
      case "W":
        result = "rgb(211, 84, 0)";
        break;
    }
    return result;
  }
  GetInforUserChatwith(IdGroup: number) {
    const sb = this.chatService.GetInforUserChatWith(IdGroup).subscribe(res => {
      if (res) {

        if (res.data.length > 0) {
          this.GetTagNameisGroup(res.data[0].isGroup);

        }
        this.listInfor = res.data;
        // console.log("   this.listInfor", this.listInfor)
        this.isGroup = this.listInfor[0].isGroup;
        this.TenGroup = this.listInfor[0].GroupName;
        this.isEnCode = this.listInfor[0].IsEnCode ? this.listInfor[0].IsEnCode : false;
        this.thanhviennhomn = this.listInfor[0].slthanhvien;
        this.changeDetectorRefs.detectChanges();
      }
    })
    this._subscriptions.push(sb)
  }

  setIntrvl() {
    setInterval(() => this.isloading = false, 1000);
  }
  // ReconectGroup(){

  //   setInterval(() => this.messageService.connectToken(this.id_Group),1000);
  // }
  GetTagNameisGroup(isGroup) {
    if (isGroup) {
      this.tam = [
        {
          id: "All", note: "Nhắc cả nhóm ", value: "@All"
        }
      ]
    }
    else {
      this.tam = [];
    }




    const sb = this.chatService.GetTagNameGroup(this.id_Group).subscribe(res => {

      this.lisTagGroup = this.tam.concat(res.data);

      this.listTagGroupAll = res.data;

      this.changeDetectorRefs.detectChanges();
    })
    this._subscriptions.push(sb)
  }

  GetImage(idgroup) {
    this.chatService.GetImage(idgroup).subscribe(res => {
      this.LstImagePanel = res.data;
      this.changeDetectorRefs.detectChanges();
    })
  }
  GetImageTop9(idgroup) {
    this.chatService.GetImageTop9(idgroup).subscribe(res => {
      this.LstImagePanelTop9 = res.data;
      this.changeDetectorRefs.detectChanges();
    })
  }
  GetLinkConver(idgroup) {
    this.chatService.GetLinkConversation(idgroup).subscribe(res => {
      this.LstPanelLink = res.data;
      this.changeDetectorRefs.detectChanges();
    })
  }
  setFocus(editor) {

    editor.focus();
  }

  toggleSideNav() {
    // this.sidenav.close()
  }
  EventUploadFile() {
    const sb = this.messageService.uploadfile$.subscribe(res => {

      if (res) {

        if (this.id_Group == res[0].idGroup) {


          let index = this.listMess.findIndex(x => x.IdChat == res[0].idchat);
          if (index >= 0) {
            this.listMess[index].Attachment_File.forEach(element => {
              element.disabled = null
              this.changeDetectorRefs.detectChanges()
            });
          }
        }

      }
    })

    this._subscriptions.push(sb);
  }
  EventInsertJob() {
    const sb = this.messageService.InsertJob$.subscribe(res => {
      if (res) {
        let indexcv = this.listMess.findIndex(x => x.IdChat == res.messageid);
        if (indexcv >= 0) {
          this.listMess[indexcv].TaskID = res.id_row;
          this.chatService.ReloadCV$.next(this.id_Group);
          this.changeDetectorRefs.detectChanges();
        }

      }

    })
    this._subscriptions_chat.push(sb)
  }
  Event() {
    fromEvent(window, 'dis').subscribe((res: any) => {

      if (res.detail == "Disconnect") {
        this.messageService.stopHubConnectionChat();
      }

    })
    // this._subscriptions_chat.push(sv);
  }
  EventCloseSearch() {
    const sb = this.conversation_service.SearchTabChat$.subscribe(res => {
      if (res) {
        if (res == "Close") {
          this.searchText = "";
          this.opensearch = false;
          this.sidenav.close()
        }
      }
    })
    this._subscriptions_chat.push(sb)
  }
  SucribeVote() {
    this.messageService.Vote$.subscribe(res => {
      if (res) {
        if (res.username != this.userCurrent) {

          let indexgr = this.listMess.findIndex(x => x.IdChat == res.id_chat)
          let indexvote = this.listMess[indexgr].Vote.findIndex(x => x.id_vote == res.id_vote)
          if (indexgr >= 0) {


            if (res.key == "insert") {

              const progressdowload = document.getElementById("progress" + indexgr + indexvote);
              if (progressdowload) {
                progressdowload.classList.add('progressdown');

              }
              if (this.listMess[indexgr].Vote[indexvote].lengthvote == 0) {
                this.listMess[indexgr].Vote[indexvote].lengthvote = 1;

              }
              else {
                this.listMess[indexgr].Vote[indexvote].lengthvote = this.listMess[indexgr].Vote[indexvote].lengthvote + 1;

              }
              progressdowload.style.width = Math.floor((this.listMess[indexgr].Vote[indexvote].lengthvote) / this.listMess[indexgr].Vote[indexvote].allmember * 100) + "%"
              this.listMess[indexgr].Vote[indexvote].UserVote.push(res);
              this.changeDetectorRefs.detectChanges();
              // progressText.innerHTML=item.noidung;
            }
            else if (res.key == "remove") {
              const progressdowload = document.getElementById("progress" + indexgr + indexvote);
              if (progressdowload) {
                progressdowload.classList.remove('progressdown');
              }

              this.listMess[indexgr].Vote[indexvote].lengthvote = this.listMess[indexgr].Vote[indexvote].lengthvote - 1;
              progressdowload.style.width = Math.floor((this.listMess[indexgr].Vote[indexvote].lengthvote) / this.listMess[indexgr].Vote[indexvote].allmember * 100) + "%"
              let indexvt = this.listMess[indexgr].Vote[indexvote].UserVote.findIndex(x => x.id_vote == res.id_vote && x.username == res.username);
              this.listMess[indexgr].Vote[indexvote].UserVote.splice(indexvt, 1)
              this.changeDetectorRefs.detectChanges();

            }

          }
        }
      }

    })

  }
  CheckEnCodeInConversation(IdGroup) {
    this.chatService.CheckEnCodeInConversation(IdGroup).subscribe(res => {
      if (res && res.status == 1) {
        this.KeyEnCode = res.data[0].KeyEnCode;

        this.changeDetectorRefs.detectChanges();
      }
      else {
        this.KeyEnCode = undefined;
        this.changeDetectorRefs.detectChanges();
      }
    }
    )
  }
  GetStoreSticker() {
    this.chatService.GetStoreSticker().subscribe(res => {
      if (res && res.status == 1) {
        this.listStoreSticker = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  QuanLyStoreSticker() {
    this.chatService.QuanLyStoreSticker().subscribe(res => {
      if (res && res.status == 1) {
        this.listQLStoreSticker = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  listSticker: any[] = []
  GetSticker(GrSticker) {
    this.chatService.GetSticker(GrSticker).subscribe(res => {
      if (res && res.status == 1) {
        this.listSticker = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  listStickermini: any[] = [];
  GetminilistSticker() {
    this.chatService.GetminilistSticker().subscribe(res => {
      if (res && res.status == 1) {
        this.listStickermini = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  CheckConnect(idGroup) {


    this.messageService.CheckConnect(idGroup).then((res) => {
      this.ischeckconnect = false
      clearInterval(this.intervalcheck);
    }
    ).catch((error) => {
      this.ischeckconnect = true
    }
    )


  }
  EventcheckConnectMess() {
    const sb = this.messageService.StoreCheckConnect$.subscribe(res => {
      if (res == "onreconnecting") {
        this.ischeckconnect = true
        this.changeDetectorRefs.detectChanges()

      }
      else if (res == "onreconnected") {
        this.ischeckconnect = false
        this.loadDataListReconnect();
        this.changeDetectorRefs.detectChanges()
        // load lại danh sách tin nhắn
      }
    })

    this._subscriptions_chat.push(sb)
  }
  ngOnInit(): void {
    //  this.Test()
    this.Event();

    let them = localStorage.getItem('user-theme');
    if (them == 'dark-mode') {
      this.themdark = true
    }
    else {
      this.themdark = false
    }

    this.colornav = false;


    const sb = this.route.params.subscribe(params => {
      this.messageService.stopHubConnectionChat();
      this.showstoresticker = false
      this.allfile = false;
      this.messerror = [];
      this.listSearch = [];
      this.IdChatReplay = 0;
      if (this.txttam == '' || this.txttam == undefined) {
        let indexdelete = this.draftmessage.findIndex(x => x.IdGroup == this.id_Group);

        if (indexdelete >= 0) {
          this.draftmessage.splice(indexdelete, 1);
          localStorage.setItem("draftmessage", JSON.stringify(this.draftmessage))
          this.conversation_service.draftMessage$.next(true);
        }
      }
      else {

        let draftitem = {
          content: this.txttam.replace("<p></p>", ""),
          IdGroup: this.id_Group
        }

        let indexremove = this.draftmessage.findIndex(x => x.IdGroup == this.id_Group);

        if (indexremove < 0) {
          if (draftitem.content.replace("<p></p>", "").replace("<p>", "").replace("</p>", "").toString().trim() != "") {
            this.draftmessage.push(draftitem);
            localStorage.setItem("draftmessage", JSON.stringify(this.draftmessage))
            this.conversation_service.draftMessage$.next(true);
          }

        }
        else {
          this.draftmessage.splice(indexremove, 1, draftitem);
          localStorage.setItem("draftmessage", JSON.stringify(this.draftmessage))
          this.conversation_service.draftMessage$.next(true);
        }



      }
      this.id_Group = +params.id;
      this.id_Chat = +params.idchat;
      this.bgurl = "";
      this.opensearch = false
      this.isCollapsed = true;

      this.isCollapsedsticker = true
      this.isshowdouwn = false
      this.loadingchat = true;
      this.CheckEnCodeInConversation(this.id_Group)
      this.GetInforUserChatwith(this.id_Group);
      this.LoadGhim(this.id_Group);
      this.draftmessage = JSON.parse(localStorage.getItem("draftmessage"));
      if (!this.draftmessage) {
        this.draftmessage = [];
      }

      // this.editor.quillEditor.focus()

      if (this._subscriptions_chat) {

        this._subscriptions_chat.forEach((sb) => sb.unsubscribe());
        this.messageService.Newmessage.next(undefined)
      }
      this._subscriptions_chat = []
      this.toggleSideNav();

      // document.getElementById('focustxt').focus();



      this.pageSize = 0;
      this.listReply = [];
      this.lstChatMess = [];
      this.list_image = [];
      this.AttachFileChat = [];



      this.txttam = "";

      if (this.draftmessage) {

        let index = this.draftmessage.findIndex(x => x.IdGroup == this.id_Group);
        if (index < 0) {
          this.messageContent = '';
        }
        else {

          this.txttam = this.draftmessage[index].content;
          this.messageContent = this.txttam;

        }
      }
      this.messageService.connectToken(this.id_Group);

      this.SucribeVote();
      this.EventCloseSearch();



      this.subscribeToEventsNewMess();
      this.subscribeToEventsLasttimeMess();
      this.subscribeToEvents();
      this.subscribeToEventsHidenmes();
      this.subscribeToEventsComposing();
      this.subscribeToEventsSendReaction();
      this.subscribeToEventsSeenMess();
      this.EventUploadFile();
      this.EventInsertJob();
      this.EventcheckConnectMess()
      if (this.id_Chat) {
        this.min = 4000;
        this.max = 4000;
        this.LoadDataDetailDefaultMess(this.id_Group, this.id_Chat);
        localStorage.setItem('chatGroup', JSON.stringify(this.id_Group));
        if (this.searchText != "" && this.searchText != undefined) {
          this.opensearch = true
          this.sidenav.open()
        }

      }
      else {
        this.min = 1000;
        this.max = 2000;
        this.searchText = ""
        this.loadDataList();
        //

      }
      this.listStickerTime = JSON.parse(localStorage.getItem("Sticker"));
      if (!this.listStickerTime) {
        this.listStickerTime = [];
      }
      this.searchControl.valueChanges
        .pipe()
        .subscribe(() => {
          this.filterBankGroups();
        });
      this.GetListReaction();


      setTimeout(() => {
        this.editor.quillEditor.focus()
      }, 1000);
      //  this.viewPort.scrollToIndex(this.listMess.length, 'smooth');
      this.intervalcheck = setInterval(() => {
        setTimeout(() => {
          this.CheckConnect(this.id_Group);

        }, 100);

      }, 300);


      this.changeDetectorRefs.detectChanges();

    });
    // this.watchScroll();
    // this.handleScrollingUp();
    // this.GetStoreSticker()
    // this.QuanLyStoreSticker();
    // this.GetminilistSticker();
    this._subscriptions.push(sb)
  }


  private subscribeToEventsHidenmes(): void {


    const sb = this.messageService.hidenmess.subscribe(res => {
      if (res) {
        let item = {
          IdGroup: this.id_Group, IdChat: res
        }
        this.messageService.MyChatHidden$.next(item);
        let index = this.listMess.findIndex(x => x.IdChat == res);
        if (index >= 0) {
          this.listMess[index].IsHidenAll = true;
          this.changeDetectorRefs.detectChanges();
        }

      }
    })

    this._subscriptions.push(sb)

  }

  private subscribeToEventsLasttimeMess(): void {



    const sb = this.messageService.lasttimeMess.subscribe(res => {
      if (res) {
        let index = this.listMess.findIndex(x => x.IdChat == res.IdChat)
        if (index >= 0 && res.IsFile) {
          this.listMess[index].isHidenTime = true;
          this.changeDetectorRefs.detectChanges();
        }
        else {
          this.listMess[index].isHidenTime = true;
          this.changeDetectorRefs.detectChanges();
          // alert("xx")

          // this.loadDataList();
        }



      }

    })


    this._subscriptions.push(sb)

  }

  getClassfile(item, hidentime) {
    if (item == this.userCurrent) {
      return 'loadcssfileright';
    }
    else
      if (hidentime) {
        return 'loadcssfilelefthidden';
      }
      else {
        return 'loadcssfileleft';
      }

  }
  private subscribeToEventsComposing(): void {

    this.messageService.ComposingMess
      .pipe(
        finalize(() => { }),
        concatMap(x => x))
      .subscribe(x => {
        if (x) {
          if (this.UserId != x.UserId && this.id_Group == x.IdGroup) {

            this.composing = true
            this.composingname = x.Name;
            setTimeout(() => {
              this.composing = false;
              this.changeDetectorRefs.detectChanges();
            }, 4000);
            this.changeDetectorRefs.detectChanges();
          }
        }
      });
    // this._ngZone.run(() => {

    // const sb=this.messageService.ComposingMess.subscribe(res=>
    //   {
    //     if(res)
    //     {
    //       if(this.UserId!=res.UserId&&this.id_Group==res.IdGroup)
    //       {


    //       this.composing=true
    //       this.composingname=res.Name;
    //       setTimeout(() => {
    //         this.composing =false;
    //         this.messageService.ComposingMess.next(undefined)
    //         this.changeDetectorRefs.detectChanges();
    //        }, 3000);
    //        this.changeDetectorRefs.detectChanges();
    //       }
    //     }
    //   })
    //   this._subscriptions_chat.push(sb);
    // })



  }

  private subscribeToEventsNewMess(): void {
    this.composing = false;

    const sbchat = this.messageService.Newmessage$.subscribe(res => {
      if (this.listMess !== null) {
        if (res) {


          this.id_chat_notify = res[0].IdChat

          if (this.listMess.length > 0) {
            if (res.length > 0) {

              if (res[0].IdGroup == this.id_Group) {
                if (!res[0].isFile && !res[0].isVote) {
                  this.listMess = [...this.listMess, res[0]];
                  // setTimeout(() => {
                  //   this.viewPort.scrollTo({
                  //     bottom: 0,
                  //     behavior: 'auto',
                  //   });
                  // }, 0);
                  // setTimeout(() => {
                  //   this.viewPort.scrollTo({
                  //     bottom: 0,
                  //     behavior: 'auto',
                  //   });
                  // }, 50);

                  // setTimeout(() => {
                  //   this.viewPort.scrollTo({
                  //     bottom: 0,
                  //     behavior: 'auto',
                  //   });
                  // }, 100);


                  // this.ReLoadLightbox();
                }

                this.cssfileuser = res[0].UserName == this.userCurrent ? false : true;
                this.list_loading_image = res[0].Attachment.slice();
                this.list_loading_file = res[0].Attachment_File.slice();
                this.list_loading_video = res[0].Videos.slice();
                // phần dành cho tin nhắn có file
                if (res[0].isFile) {
                  this.loading_file = true
                  setTimeout(() => {
                    this.loading_file = false;
                    this.changeDetectorRefs.detectChanges();
                    let indexfile = this.listMess.findIndex(x => x.IdChat == res[0].IdChat)
                    if (indexfile < 0) {
                      this.listMess = [...this.listMess, res[0]];

                    }

                    setTimeout(() => {
                      this.viewPort.scrollTo({
                        bottom: 0,
                        behavior: 'auto',
                      });
                    }, 0);
                    setTimeout(() => {
                      this.viewPort.scrollTo({
                        bottom: 0,
                        behavior: 'auto',
                      });
                    }, 50);

                    setTimeout(() => {
                      this.viewPort.scrollTo({
                        bottom: 0,
                        behavior: 'auto',
                      });
                    }, 100);
                    setTimeout(() => {
                      this.viewPort.scrollTo({
                        bottom: 0,
                        behavior: 'auto',
                      });
                    }, 200);
                    if (this.colornav = true
                    ) {

                      this.GetImageTop9(this.id_Group);
                      this.LoadFileTop4(this.id_Group)
                      this.GetLinkConver(this.id_Group);
                    }
                    // this.ReLoadLightbox();
                    this.viewPort.scrollToIndex(this.listMess.length - 1, 'smooth');
                  }, 2000);
                  this.changeDetectorRefs.detectChanges();
                }
                else if (res[0].isVote == true) {
                  setTimeout(() => {

                    this.loadDataList();

                  }, 1000);
                }


                // this.lstChatMess.splice(0,1,res[0])

                // this.lstChatMess==[];
                if (this.listChoseTagGroup.length > 0) {
                  let notify = this.ItemNotifyMessenger(res[0].Content_mess, res[0].IdChat);
                  this.chatService.publishNotifi(notify).subscribe(res => {

                  })
                  this.listChoseTagGroup = []
                }
                //  this.messageService.Newmessage.next()
                this.ngUnsubscribe.next();
                this.ngUnsubscribe.complete();
                this.changeDetectorRefs.detectChanges();

              }

            }


            // }
            // }
            // }
          }
        }

      }
      else {

        if (res.length > 0) {


          if (res[0].IdGroup == this.id_Group) {

            this.id_chat_notify = res[0].IdChat
            this.lstChatMess.push(res[0])
            if (this.lstChatMess.length > 0) {
              this.listMess = [...this.listMess, this.lstChatMess[this.lstChatMess.length - 1]];
              this.lstChatMess = [];
              setTimeout(() => {
                this.viewPort.scrollTo({
                  bottom: 0,
                  behavior: 'auto',
                });
              }, 0);
              setTimeout(() => {
                this.viewPort.scrollTo({
                  bottom: 0,
                  behavior: 'auto',
                });
              }, 50);

              this.messageService.Newmessage.next(undefined)
              this.changeDetectorRefs.detectChanges();
            }
            else if (res[0].isVote == true) {
              setTimeout(() => {

                this.loadDataList();

              }, 2000);
            }
          }

        }
        else {

          this.loadDataList()
        }
      }

      if (this.listMess.length == 0 && res) {
        this.loadDataList();
      }

    })


    this._subscriptions_chat.push(sbchat)

  }

  private subscribeToEvents(): void {

    this._ngZone.run(() => {

      this.presence.onlineUsers$.subscribe(res => {
        if (res) {

          setTimeout(() => {

            for (let i = 0; i < res.length; i++) {
              if (res[i].JoinGroup === "changeActive") {
                this.SetActive(res[i].UserId, true)
              }
              else {
                this.SetActive(res[i].UserId, false)
              }
            }

          }, 1000);
        }
      })

    })

  }
  SetActive(item: any, active = true) {
    setTimeout(() => {



      let index = this.listInfor.findIndex(x => x.UserId === item);

      if (index >= 0) {

        this.listInfor[index].Active = active ? 1 : 0;

        this.changeDetectorRefs.detectChanges();
      }
    }, 500);

  }

  // send mess


  ItemMessengerFile(): Message {

    const item = new Message();

    this.NotifyTagName(this.messageContent.replace("<p><br></p>", ""));

    if (this.listChoseTagGroup.length > 0) {
      item.isTagName = true
    }
    else {
      item.isTagName = false
    }
    item.Content_mess = this.messageContent.replace("<p><br></p>", "");
    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.isGroup = this.isGroup;
    item.IdChatReplay = this.IdChatReplay;
    if (this.listReply.length > 0) {
      if (this.listReply[0].Content_mess === "") {
        item.Note = this.listReply[0].FullName + ": Tệp đính kèm";
      }
      else {
        item.Note = this.listReply[0].FullName + ":" + this.decryNote(this.listReply[0].Content_mess);
      }

    }
    else {
      item.Note = "";
    }

    item.IsDelAll = false;
    item.IsVideoFile = this.url ? true : false;
    item.isFile = true;
    item.Attachment = this.list_file_large.slice();

    return item
  }

  encryptUsingAES256(text) {

    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(text), this.KeyEnCode, {
      keySize: 16,
      iv: this.KeyEnCode,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.ZeroPadding
    });
    return encrypted.toString();
  }
  decryptUsingAES256(text) {

    try {
      return CryptoJS.AES.decrypt(
        text, this.KeyEnCode, {
        keySize: 16,
        iv: this.KeyEnCode,
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.ZeroPadding
      }).toString(CryptoJS.enc.Utf8).replace(/['"]+/g, '');


      //  .replace("\\", "").replace("\\", "");;
    }
    catch (ex) {
      return text
    }

  }
  ItemMessengerResend(content): Message {

    const item = new Message();

    this.NotifyTagName(content.replace("<p><br></p>", ""));

    if (this.listChoseTagGroup.length > 0) {
      item.isTagName = true
    }
    else {
      item.isTagName = false
    }

    item.Content_mess = content.replace("<p><br></p>", "");

    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.isGroup = this.isGroup;
    if (this.isEnCode) {
      item.isEncode = true;
      // item.keyEncode=this.KeyEnCode

    }
    else {
      item.isEncode = false
      // item.keyEncode="";

    }

    if (this.listReply.length > 0) {
      if (this.listReply[0].Content_mess === "") {
        item.Note = this.listReply[0].FullName + ": Tệp đính kèm";
      }
      else {
        item.Note = this.listReply[0].FullName + ":" + this.decryNote(this.listReply[0].Content_mess);
      }

    }
    else {
      item.Note = "";
    }

    item.IsDelAll = false;
    item.IsVideoFile = this.url ? true : false;
    item.Attachment = this.AttachFileChat.slice();

    return item
  }
  ItemMessenger(): Message {

    const item = new Message();

    this.NotifyTagName(this.messageContent.replace("<p><br></p>", ""));

    if (this.listChoseTagGroup.length > 0) {
      item.isTagName = true
    }
    else {
      item.isTagName = false
    }

    if (this.isEnCode == true && this.messageContent !== "") {
      item.Content_mess = this.encryptUsingAES256(this.messageContent.replace("<p><br></p>", ""));
    }
    else {
      item.Content_mess = this.messageContent.replace("<p><br></p>", "");
    }

    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.isGroup = this.isGroup;
    if (this.isEnCode) {
      item.isEncode = true;
      // item.keyEncode=this.KeyEnCode

    }
    else {
      item.isEncode = false
      // item.keyEncode="";

    }

    if (this.listReply.length > 0) {
      if (this.listReply[0].Content_mess === "") {
        item.Note = this.listReply[0].FullName + ": Tệp đính kèm";
      }
      else {
        item.Note = this.listReply[0].FullName + ":" + this.decryNote(this.listReply[0].Content_mess);
      }

    }
    else {
      item.Note = "";
    }
    item.IdChatReplay = this.IdChatReplay;
    item.IsDelAll = false;
    item.IsVideoFile = this.url ? true : false;
    item.Attachment = this.AttachFileChat.slice();

    return item
  }

  NotifyTagName(content: string) {

    for (let i = 0; i < this.lstTagName.length; i++) {
      if (this.lstTagName[i] == "All") {

        let giatri = content.replace('/', "").indexOf(`data-id="All"`);
        if (giatri > -1) {

          this.listTagGroupAll.forEach(element => {
            this.listChoseTagGroup.push(element.id);
          });
        }


      }
      else {



        let giatri = content.replace('/', "").indexOf(`data-id="${this.lstTagName[i]}`);
        // console.log("Check giá tri",giatri)
        if (giatri > -1) {
          this.listChoseTagGroup.push(this.lstTagName[i]);

        }
      }
    }
    // console.log("listChoseTagGroup",this.listChoseTagGroup)
  }

  ItemNotifyMessenger(content: string, idchat: number): NotifyMessage {
    // const access_token = this.conversation_service.getAccessToken_cookie();
    const item = new NotifyMessage();
    item.TenGroup = this.TenGroup;
    item.Avatar = this.Avataruser;
    item.isEncode = this.isEnCode;
    item.IdChat = idchat;
    item.IdGroup = this.id_Group;
    item.Content = content;
    item.ListTagname = this.listChoseTagGroup;
    return item
  }

  ItemMessengerEror(): any {
    let now = new Date();
    let currentDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
    const item = new MessageError();
    let date2 = new Date();
    item.IdChat = Number.parseInt(date2.getMilliseconds().toString() + "000");
    item.isError = true;
    item.Seen = []
    if (this.listChoseTagGroup.length > 0) {
      item.isTagName = true
    }
    else {
      item.isTagName = false
    }
    item.Content_mess = this.messageContent.replace("<p><br></p>", "");
    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.isGroup = this.isGroup;
    item.isInsertMember = false;
    item.Videos = [];
    if (this.listReply.length > 0) {
      if (this.listReply[0].Content_mess === "") {
        item.Note = this.listReply[0].FullName + ": Tệp đính kèm";
      }
      else {
        item.Note = this.listReply[0].FullName + ":" + this.listReply[0].Content_mess;
      }

    }
    else {
      item.Note = "";
    }
    let temperror = [{
      Avatar: this.Avataruser,
      BgColor: "rgb(211, 84, 0)",
      Department: "",
      Fullname: this.Fullname,
      ID_user: this.UserId,
      Jobtitle: "Developer",
      Username: this.userCurrent,
    }]
    item.InfoUser = temperror;
    // item.CreatedDate=this.currentDate;
    item.IsDelAll = false;
    item.IsHidenAll = false
    item.CreatedDate = currentDate.toString();
    item.IsVideoFile = this.url ? true : false;
    item.Attachment_File = [];
    item.Attachment = [];


    return item
  }
  sendMessage() {
    // this.txttam="";
    // replace(/^\s+|\s+$/g, "")
    let item = this.ItemMessenger();
    let itemerro: any = this.ItemMessengerEror();
    // console.log("cccc",value.replace("<p>", "").replace("</p>", "").toString().trim())
    this.messageContent = this.messageContent.replace("<p></p>", "").replace("<p>", "").replace("</p>", "").toString().trim();

    if ((this.messageContent && this.messageContent != "" && this.messageContent != "<p><br></p>" && this.messageContent.length > 0) || this.AttachFileChat.length > 0) {
      this.messchecklink = this.messageContent.replace("<p></p>", "");
      this.messageForm.reset();
      this.isloading = false;
      const data = this.conversation_service.getAuthFromLocalStorage();

      var _token = data.access_token;

      this.AttachFileChat = [];

      this.lstTagName = [];
      this.IdChatReplay = 0;
      this.list_file = [];
      this.listFileChat = [];
      this.list_image = [];
      this.listReply = [];
      this.myFilesVideo = [];
      this.url = "";
      this.messageContent = "";


      this.messageService.sendMessage(_token, item, this.id_Group).then((res) => {


        // this.messageContent="";
        // document.getElementById('content').textContent = '';

        if (this.id_Chat) {

          this.router.navigateByUrl('/Chat/Messages/' + this.id_Group + '/null');
          // this.router.navigate(['DashBoard/Chat/Messages/'+this.id_Group+'/null']);
        }
        if (this.draftmessage.length > 0) {
          let indexremove = this.draftmessage.findIndex(x => x.IdGroup == this.id_Group);
          if (indexremove >= 0) {
            this.draftmessage.splice(indexremove, 1);
            localStorage.setItem("draftmessage", JSON.stringify(this.draftmessage));
            this.conversation_service.draftMessage$.next(true);

          }

        }

        // this.viewPort.scrollToIndex(this.listMess.length-1, 'smooth');
        setTimeout(() => {
          this.viewPort.scrollTo({
            bottom: 0,
            behavior: 'auto',
          });
        }, 0);
        setTimeout(() => {
          this.viewPort.scrollTo({
            bottom: 0,
            behavior: 'auto',
          });
        }, 50);
        //  this.messageForm.reset();

      })
        .catch((error) => {
          console.log("error", error)
          let dataitem: any[] = []
          this.messerror.push(itemerro)
          dataitem.push(itemerro);
          this.listMess = this.listMess.concat(dataitem);
          this.changeDetectorRefs.detectChanges()

        });




    }
    else {

      this.messageContent = "";
      this.messchecklink = "";
      this.txttam = "";
      this.messageForm.reset();
      this.layoutUtilsService.showActionNotification('Định dạng tin nhắn không phù hợp!', MessageType.Read, 3000, true, false, 3000, 'top', 0);
    }


    if (this.messchecklink.includes("https")) {
      let link = this.getLink(this.messchecklink.replace('</p>', ''));
    }

  }


  sendMessageMeeting(IDMetting: number, content: any) {


    // this.txttam="";

    this.messageForm.reset();

    let itemerro: any = this.ItemMessengerEror();
    this.isloading = false;
    const data = this.conversation_service.getAuthFromLocalStorage();

    var _token = data.access_token;
    let item = this.ItemMessengerMeeting(IDMetting, content);

    this.AttachFileChat = [];

    this.lstTagName = [];

    this.list_file = [];
    this.listFileChat = [];
    this.list_image = [];
    this.listReply = [];
    this.myFilesVideo = [];
    this.url = "";
    this.messageContent = "";


    this.messageService.sendMessage(_token, item, this.id_Group).then((res) => {




      setTimeout(() => {
        this.viewPort.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 0);
      setTimeout(() => {
        this.viewPort.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 50);
      //  this.messageForm.reset();

    })
      .catch((error) => {
        let dataitem: any[] = []

        dataitem.push(itemerro);
        this.messerror.push(itemerro)
        this.listMess = this.listMess.concat(dataitem);
        // console.log("AAAA",this.listMess)
        this.changeDetectorRefs.detectChanges()

      });







  }





  loadlightbox(id: any) {
    this.imgopen = [];
    // this.viewer.=false

    let index = this.listMess.findIndex((x) => x.IdChat == id);
    this.imgopen = this.listMess[index].Attachment.slice();
    let tamp = {
      item: this.imgopen,
      ischat: true
    }
    const dialogRef = this.dialog.open(PreviewAllimgComponent, {
      width: 'auto',
      panelClass: 'chat-bg-preview',
      data: tamp
    }).afterClosed().subscribe(result => {

      // this.closeDilog(result);


    });

  }
  DisplayTime(item) {
    let currentDate = new Date(new Date().toUTCString());

    let yearcr = currentDate.getFullYear();
    let monthcr = currentDate.getMonth();
    let daycr = currentDate.getDate();



    let d = item + 'Z'

    let date = new Date(d);


    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    if (year == yearcr && monthcr == month && daycr == day) {
      return hour + ':' + minute + ' Hôm nay'
    }
    else if (year == yearcr && monthcr == month && daycr - day == 1) {
      return hour + ':' + minute + ' Hôm qua'
    }
    else {
      var tz = moment.tz.guess()

      let d = item + 'Z'
      var dec = moment(d);
      return dec.tz(tz).format(' HH:mm DD/MM/YYYY');

    }

  }

  ItemLinnk(dt): LinkConver {
    const item = new LinkConver();

    item.listLink = dt;
    return item;
  }
  getLink(item) {
    const matches = item.match(/\bhttps?:\/\/\S+/gi);
    if (matches) {
      let item = this.ItemLinnk(matches);
      this.chatService.SaveLink(this.id_Group, item).subscribe(res => {
        if (res && res.status == 1) {
          this.messchecklink = null;
        }
      })
    }

  }
  decryNote(item) {
    return this.decryptUsingAES256(item).replace("\\", "").replace("\\", "");
  }
  decryRep(item, isEndCode) {
    if (isEndCode == true) {
      let mess = this.decryptUsingAES256(item).replace("\\", "").replace("\\", "");
      let chuoi = "";
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      if (mess.includes("https")) {
        chuoi = mess.replace(/(<([^>]+)>)/gi, "");
      }
      else {
        chuoi = mess;
      }
      return chuoi.replace(urlRegex, function (url) {

        return '<a target="_blank" href="' + url.replace("</p>", '') + '">' + url.replace("</p>", '') + '</a>';
      })
    }

    else {
      let chuoi = "";
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      if (item.includes("https")) {
        chuoi = item.replace(/(<([^>]+)>)/gi, "");
      }
      else {
        chuoi = item;
      }

      // var urlRegex = /(https?:\/\/[^\s]+)/g;
      return chuoi.replace(urlRegex, function (url) {

        return '<a target="_blank" href="' + url.replace("</p>", '') + '">' + url.replace("</p>", '') + '</a>';
      })
    }

  }
  urlify(item, isEndCode) {
    if (isEndCode == true) {
      let mess = this.decryptUsingAES256(item).split('\\').join('');
      let chuoi = "";
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      if (mess.includes("https")) {
        chuoi = mess.replace(/<\/p>/g, ' </p>' + ' ');
      }
      else {
        chuoi = mess;
      }
      return chuoi.replace(urlRegex, function (url) {

        return '<a target="_blank" href="' + url.replace("</p>", '') + '">' + url.replace("</p>", '') + '</a>';
      })
    }

    else {
      let t;
      let chuoi = "";
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      if (item.includes("https")) {
        chuoi = item.replace(/<\/p>/g, ' </p>' + ' ');
      }
      else {
        chuoi = item;
      }

      // var urlRegex = /(https?:\/\/[^\s]+)/g;
      return chuoi.replace(urlRegex, function (url) {
        return '<a target="_blank" href="' + url.replace("</p>", '') + '">' + url.replace("</p>", '') + '</a>';
      })
    }

  }





  GetListReaction() {
    this.chatService.getlist_Reaction().subscribe(res => {
      this.list_reaction = res.data;
      this.changeDetectorRefs.detectChanges();

    })
  }

  SendReaction(idchat: number, type: number, isnotify, contentchat, usernamereceivers) {

    const dt = this.conversation_service.getAuthFromLocalStorage();
    this.messageService.ReactionMessage(dt.access_token, this.id_Group, idchat, type, isnotify, contentchat, usernamereceivers);
  }


  private subscribeToEventsSendReaction(): void {


    this._ngZone.run(() => {

      const sb = this.messageService.reaction.subscribe(res => {

        if (res) {
          let index = this.listMess.findIndex(x => x.IdChat == res.data[0].IdChat);
          if (index >= 0) {
            this.listMess[index].ReactionChat = res.data[0].ReactionChat.slice();
            if (res.data[0].ReactionUser.CreateBy == this.UserId) {
              this.listMess[index].ReactionUser = Object.assign(res.data[0].ReactionUser);
            }

            this.changeDetectorRefs.detectChanges();
          }
        }
      })
      this._subscriptions.push(sb);
    })



  }


  private subscribeToEventsSeenMess(): void {


    this._ngZone.run(() => {

      const sb = this.messageService.seenmess.subscribe(res => {
        if (res && res.status == 1) {

          if (res.data[0].IdGroup === this.id_Group && res.data[0].UserName !== this.userCurrent) {


            if (!this.isGroup) {
              if (this.listMess[this.listMess.length - 1]) {

                this.listMess[this.listMess.length - 1].Seen.splice(0, 1, res.data[0]);
              }

              this.changeDetectorRefs.detectChanges();
            }
            else {
              // let vitri= this.listMess[this.listMess.length-1].Seen
              // .findIndex(x=>x.username==res.data[0].UserName)
              // console.log("AAAA",vitri)
              // if(vitri<0)
              // {
              this.listMess[this.listMess.length - 1].Seen = res.data;

              this.changeDetectorRefs.detectChanges();
              // }

            }

          }

          // setTimeout(() => {
          //   this.active_SeenMess=false;
          // }, 600000);


          // if(res.IdGroup)
          // let index=this.listMess.findIndex(x=>x.IdChat==res.data[0].IdChat);
          //   if(index>=0)
          //   {
          //     this.listMess[index].ReactionChat=res.data[0].ReactionChat.slice();
          //     this.listMess[index].ReactionUser=Object.assign(res.data[0].ReactionUser);
          //     this.changeDetectorRefs.detectChanges();
          //   }
        }
      })
      this._subscriptions.push(sb);
    })


  }

  InsertRectionChat(idchat: number, type: number, isnotify, contentchat: string, usernamereceivers: string) {

    let noidung;

    let content = this.decryptUsingAES256(contentchat).split('\\').join('').replace("<p>", "").replace("</p>", "")

    if (content.indexOf(`class=ql-mention-denotation-char`) > 1) {
      noidung = "Đã đánh dấu complete tin nhắn của bạn"
    }
    else {
      noidung = content.replace(/<[^>]*>?/gm, '');;
    }
    this.SendReaction(idchat, type, isnotify, noidung, usernamereceivers);



  }
  toggleWithGreeting(idChat: number, type: number) {


    this.chatService.GetUserReaction(idChat, type).subscribe
      (res => {
        this.listreaction = res.data;
        this.changeDetectorRefs.detectChanges();
      })

  }
  ItemSeenMessenger(): SeenMessModel {
    const item = new SeenMessModel();
    item.Avatar = this.Avataruser;
    item.CreatedBy = this.UserId;
    item.CustomerId = this.customerID;
    item.Fullname = this.Fullname;
    item.id_chat = this.listMess[this.listMess.length - 1].IdChat;
    item.username = this.userCurrent;
    item.IdGroup = this.id_Group;

    return item
  }


  focusFunction = (event) => {
    let itemdt =
    {
      IdGroup: this.id_Group,
      isGroup: this.isGroup
    }
    this.messageService.data_share = itemdt;
    setTimeout(() => {
      if (this.listMess) {


        if (this.listMess.length > 0) {

          if (event.oldRange == null && this.listMess[this.listMess.length - 1].UserName != this.userCurrent) {

            let item = this.ItemSeenMessenger();

            this.messageService.SeenMessage(item);

          }
        }
      }

    }, 1500);


  }

  DeleteReply() {
    this.listReply = [];
  }


  ChuyenTiepMess(itemmes) {
    let dt = {
      item: itemmes,
      content: itemmes.isEncode == true ? this.decryptUsingAES256(itemmes.Content_mess).replace("\\", "").replace("\\", "") : itemmes.Content_mess
    }
    // this.dcmt.body.classList.add('header-fixed');
    const dialogRef = this.dialog.open(ShareMessageComponent, {
      width: '600px',

      disableClose: true,
      data: { dt },


    });
    dialogRef.afterClosed().subscribe(res => {


      if (res) {
        //   const data = this.auth.getAuthFromLocalStorage();
        // this.presence.NewGroup(data.access_token,res[0],res[0])

        this.changeDetectorRefs.detectChanges();
      }
    })

  }
  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }

  @ViewChild(QuillEditorComponent, { static: true })
  editor: QuillEditorComponent;
  modules = {

    toolbar: false,
    keyboard: {
      bindings: {
        enter: {
          key: 13,
          // shiftKey: true,
          handler: (range, ctx) => {
            this.sendMessage()
          }
        }
      }
    },

    mention: {
      mentionListClass: "ql-mention-list mat-elevation-z8",
      // allowedChars: /^[A-Za-z\sÅÄÖåäö]*$/,
      allowedChars: /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+/,
      showDenotationChar: false,
      // mentionDenotationChars: ["@", "#"],
      spaceAfterInsert: false,

      onSelect: (item, insertItem) => {


        let index = this.lstTagName.findIndex(x => x == item.id);
        if (index < 0) {
          this.lstTagName.push(item.id)
        }





        const editor = this.editor.quillEditor;

        insertItem(item);
        // necessary because quill-mention triggers changes as 'api' instead of 'user'
        editor.insertText(editor.getLength() - 1, "", "user");
      },
      renderItem: function (item, searchTerm) {

        if (item.Avatar) {



          return `
      <div >

      <img  style="    width: 30px;
      height: 30px;
      border-radius: 50px;" src="${item.Avatar}">
      ${item.value}



      </div>`;
        }
        else if (item.id !== "All") {
          return `
      <div style="    display: flex;
      align-items: center;" >

        <div  style="     height: 30px;
        border-radius: 50px;    width: 30px; ;background-color:${item.BgColor}">
        </div>
        <span style=" position: absolute;     left: 20px;  color: white;">${item.value.slice(0, 1)}</span>
        <span style=" padding-left: 5px;">  ${item.value}</span>

      </div>`;
        }
        else {
          return `
      <div style="    display: flex;
      align-items: center;" >

        <div  style="     height: 30px;
        border-radius: 50px;    width: 30px; ;background-color:#F3D79F">
        </div>
        <span style=" position: absolute;     left: 20px;  color: white;">@</span>
        <span style=" padding-left: 5px;">${item.note}</span>
        <span style=" padding-left: 5px;">  ${item.value}</span>

      </div>`;
        }
      },
      source: (searchTerm, renderItem) => {
        const values = this.lisTagGroup;


        if (searchTerm.length === 0) {
          renderItem(values, searchTerm);

        } else {
          const matches = [];
          values.forEach(entry => {
            if (
              entry.value.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1
            ) {
              matches.push(entry);
            }
          });
          renderItem(matches, searchTerm)

        }
      }
    }
  };

  // begin call video



  CallVideoDialog(code, callName, img, bg) {
    var dl = { isGroup: this.isGroup, UserName: this.userCurrent, BG: 'rgb(51, 152, 219)', Avatar: img, PeopleNameCall: callName, status: code, idGroup: this.id_Group, keyid: null };
    const dialogRef = this.dialog.open(CallVideoComponent, {
      // width:'900px',
      // height:'500px',
      data: { dl },
      disableClose: true

    });
    dialogRef.afterClosed().subscribe(res => {

      if (res) {

        const item = new Message();

        if (res.timecall == undefined) {
          res.status == 'call' ? item.Content_mess = "Đã lỡ cuộc gọi" : item.Content_mess = "Đã lỡ video call";
          res.timecall = "00:00"
        }
        else {
          res.status == 'call' ? item.Content_mess = "Cuộc gọi thoại" : item.Content_mess = "Video call";
        }



        item.UserName = res.UserName;
        item.IdGroup = this.id_Group;
        item.isCall = true;
        item.isTagName = false
        item.isGroup = this.isGroup;
        item.Note = res.timecall;
        item.IsDelAll = false;
        item.IsVideoFile = this.url ? true : false;
        item.Attachment = this.AttachFileChat.slice();

        const data = this.conversation_service.getAuthFromLocalStorage();

        var _token = data.access_token;
        this.messageService.sendMessage(_token, item, this.id_Group).then(() => {
          // this.messageContent="";
          // document.getElementById('content').textContent = '';

          this.lstTagName = [];
          this.AttachFileChat = [];
          this.list_file = [];
          this.listFileChat = [];
          this.list_image = [];
          this.listReply = [];
          this.myFilesVideo = [];
          this.url = "";
          // if(this.id_Chat)
          // {
          //   this.router.navigate(['Chat/Messages/'+this.id_Group+'/null']);
          // }

          // this.viewPort.scrollToIndex(this.listMess.length-1, 'smooth');
          setTimeout(() => {
            this.viewPort.scrollTo({
              bottom: 0,
              behavior: 'auto',
            });
          }, 0);
          setTimeout(() => {
            this.viewPort.scrollTo({
              bottom: 0,
              behavior: 'auto',
            });
          }, 50);
        })
      }
    })

  }
  screenShare(): void {
    this.shareScreen();
  }

  private shareScreen(): void {
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia({
      video: {
        // cursor: 'always'
      },
      audio: {
        echoCancellation: true,
        // noiseSuppression: true
      }
    }).then(stream => {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        this.stopScreenShare();
      };

      const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
      sender.replaceTrack(videoTrack);
    }).catch(err => {
      console.log('Unable to get display media ' + err);
    });
  }

  private stopScreenShare(): void {
    const videoTrack = this.lazyStream.getVideoTracks()[0];
    const sender = this.currentPeer.getSenders().find(s => s.track.kind === videoTrack.kind);
    sender.replaceTrack(videoTrack);
  }


  ngOnDestroy() {
    if (this._subscriptions) {
      this._subscriptions.forEach((sb) => sb.unsubscribe());
    }
    if (this.intervaldownload) {
      clearInterval(this.intervaldownload);

    }
    if (this.interval) {
      clearInterval(this.interval);

    }
    this.messageService.stopHubConnectionChat();
    //  this.messageService.Newmessage.unsubscribe();
  }

  //  loadlightboxImage(id_) {
  //   this.imgall=[]
  //   let index = this.LstImagePanel.findIndex((x) => x.id_chat == id_);
  //   if(index>=0)
  //   {
  //     this.imgall.push(this.LstImagePanel[index]);
  //   this.items = this.imgall.map((item) => {
  //     return {
  //       type: 'imageViewer',
  //       data: {
  //         src: item.hinhanh,
  //         thumb: item.hinhanh,
  //         data2: [
  //           item.hinhanh,
  //          // thumb: item.hinhanh,
  //        ],
  //       },
  //     };
  //   });

  //   /** Lightbox Example */

  //   // Get a lightbox gallery ref
  //   const lightboxRef = this.gallery.ref('lightbox');

  //   // Add custom gallery config to the lightbox (optional)
  //   lightboxRef.setConfig({
  //     imageSize: ImageSize.Cover,
  //     thumbPosition: ThumbnailsPosition.Bottom,
  //     itemTemplate: this.itemTemplate,
  //     gestures: false,

  //   });

  //   // Load items into the lightbox gallery ref
  //   let ob = this.items;
  //   lightboxRef.load(this.items);
  // }
  //   this.changeDetectorRefs.detectChanges();
  // }
  Back() {
    this.allfile = false;
  }
  @ViewChild('staticTabs', { static: false }) staticTabs?: TabsetComponent;
  selectTab(tabId: number) {
    this.allfile = true;
    this.LoadFile(this.id_Group)
    this.GetImage(this.id_Group);
    this.AllLinkConversation(this.id_Group)
    setTimeout(() => {
      if (this.staticTabs?.tabs[tabId]) {
        this.staticTabs.tabs[tabId].active = true;

      }
    }, 100);

  }

  public filteredFile: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  public searchControl: FormControl = new FormControl();


  LoadFile(idgroup) {
    const sb = this.chatService.GetAllFile(idgroup)
      .subscribe(res => {
        this.LstFilePanel = res.data;
        this.filteredFile.next(this.LstFilePanel.slice());
        this.changeDetectorRefs.detectChanges();
      })
    this._subscriptions.push(sb)
  }
  AllLinkConversation(idgroup) {
    const sb = this.chatService.GetAllLinkConversation(idgroup)
      .subscribe(res => {
        this.LstAllPanelLink = res.data;
        this.changeDetectorRefs.detectChanges();
      })
    this._subscriptions.push(sb)
  }
  LoadFileTop4(idgroup) {
    const sb = this.chatService.GetTop4File(idgroup)
      .subscribe(res => {
        this.LstFilePanelTop4 = res.data;
        this.changeDetectorRefs.detectChanges();
      })
    this._subscriptions.push(sb)
  }
  protected filterBankGroups() {
    if (!this.list_file) {
      return;
    }
    // get the search keyword
    let search = this.searchControl.value;
    // const bankGroupsCopy = this.copyGroups(this.list_group);
    if (!search) {
      this.filteredFile.next(this.LstFilePanel.slice());

    } else {
      search = search.toLowerCase();
    }

    this.filteredFile.next(
      this.LstFilePanel.filter(bank => bank.filename.toLowerCase().indexOf(search) > -1)
    );
  }
  getColor() {

    return this.colornav ? '#3699FF' : '#B5B5C3';
  }

  toogleNav(nav: any) {


    if (nav.opened) {
      this.colornav = false;

      nav.close()
    } else {
      this.GetImageTop9(this.id_Group);
      this.LoadFileTop4(this.id_Group)
      this.GetLinkConver(this.id_Group);

      this.colornav = true

      nav.open();

    }
  }
  zoomIn(data) {
    alert(data)
    // this.viewer.zoomIn();
  }

  toggleFullscreen() {
    this.fullscreen = !this.fullscreen;
  }
  /**
* format bytes
* @param bytes (File size in bytes)
* @param decimals (Decimals point)
*/
  formatBytes(bytes) {
    if (bytes === 0) {
      return '0 KB';
    }
    const k = 1024;
    const dm = 2 <= 0 ? 0 : 2 || 2;
    const sizes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
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
  /**
 * Convert Files list to normal array list
 */
  prepareFilesList(files: Array<any>) {
    for (const item of files) {

      let dt = {
        filename: item.name,
        size: item.size,
      }
      this.list_file_large.push(dt);
    }
    const data = this.conversation_service.getAuthFromLocalStorage();
    var _token = data.access_token;
    let item = this.ItemMessengerFile();
    this.messageService.sendMessageFile(_token, item, this.id_Group).then((res) => {
      if (res) {
        setTimeout(() => {


          this.progress = 0;
          this.interval = setInterval(() => {
            if (this.progress < 90) {
              this.progress = this.progress + 0.5;
              this.changeDetectorRefs.detectChanges();
            }

          }, 400);
          // this.list_file.push(event.target.files);
          let filesToUpload: File[] = files;
          // console.log(" this.list_file this.list_file", this.list_file)
          const frmData = new FormData();
          Array.from(filesToUpload).map((file, index) => {
            return frmData.append('file' + index, file, file.name);
          });


          this.chatService.UploadfileLage(frmData, res[0].IdGroup, res[0].IdChat).subscribe(

            {
              next: (event) => {
                if (event.type === HttpEventType.UploadProgress) {

                  // this.progress = Math.round((100 / event.total) * event.loaded);
                  // console.log("thisprogress",this.progress)


                }

                else if (event.type === HttpEventType.Response) {
                  if (event.body) {
                    this.loadingfilelarge = false;

                    this.progress = 100;

                    if (this.progress == 100) {
                      clearInterval(this.interval);
                    }
                    this.changeDetectorRefs.detectChanges();
                    // alert("Upload thành công")

                  }
                }
              },

            })
        }, 2700);
      }
      this.list_file_large = []
      this.loadingfilelarge = true;
    })
      .catch((error) => {
        this.layoutUtilsService.showActionNotification('Vui lòng gửi lại!', MessageType.Read, 3000, true, false, 3000, 'top', 0);

      });


  }
  onFileDropped($event) {
    this.prepareFilesList($event);

    this.showbodyfile = false

  }
  CloseFile($event) {

    this.showbodyfile = false
  }
  HoverFile($event) {
    this.showbodyfile = true
  }
  /**
   * handle file from browsing
   */
  fileBrowseHandler(files) {
    this.prepareFilesList(files);
  }


  isHidden = false;
  ItemConversation(ten_group: string, data: any): ConversationModel {

    let dt = {
      Avatar: data.Avatar == "" ? null : data.Avatar,
      BgColor: data.BgColor,
      FullName: data.Fullname,
      UserID: data.ID_user,
      UserName: data.Username,
      Name: data.Name
    }


    this.listUser.push(dt);
    const item = new ConversationModel();
    item.GroupName = ten_group;
    item.IsGroup = false;
    item.ListMember = this.listUser.slice();


    return item
  }
  ListInforUser: any[] = []
  LoadInforUser(Username: string) {
    const sb = this.chatService.GetnforUserByUserNameForMobile(Username).subscribe(res => {
      this.ListInforUser = res.data;
      this.changeDetectorRefs.detectChanges();

    })
    this._subscriptions.push(sb)
  }
  CreateConverSation(item) {

    let dt = null;
    this.chatService.CheckConversation(item.Username).subscribe(res => {
      if (res && res.status == 1) {
        if (res.data.length > 0) {
          dt = res.data;
        }


      }
      if (dt != null) {

        this.router.navigateByUrl('/Chat/Messages/' + dt[0].IdGroup + '/null');
        localStorage.setItem('chatGroup', JSON.stringify(dt[0].IdGroup));
        // this.CloseDia(res.data);

      }
      else {


        // tạo hội thoại nếu chưa có
        let it = this.ItemConversation(item.Fullname, item);
        this.conversation_service.CreateConversation(it).subscribe(res => {
          if (res && res.status === 1) {

            const data = this.conversation_service.getAuthFromLocalStorage(); var contumer = {
              customerID: this.customerID
            }

            const returnedTarget = Object.assign(res.data[0], contumer);
            this.presence.NewGroup(data.access_token, res.data[0], returnedTarget)

            localStorage.setItem('chatGroup', JSON.stringify(res.data[0].IdGroup));
            this.router.navigateByUrl('/Chat/Messages/' + res.data[0].IdGroup + '/null');

          }
        })
      }
    })
  }

  ngAfterViewInit(): void {
    if (this.id_Chat) {
      this.isshowdouwn = true;
      this.changeDetectorRefs.detectChanges();
    }
    else {
      const sb = this.scrollDispatcher.scrolled()
        .subscribe(event => {
          const fromTop = this.viewPort.measureScrollOffset('top');
          if (fromTop == 0) {
            if (this.listMess.length > 0) {
              this.appendItems();
            }

          }

        })
      this._subscriptions.push(sb)

      const sb1 = this.scrollDispatcher.scrolled()
        .subscribe(event => {
          const fromBottom = this.viewPort.measureScrollOffset('bottom');
          if (fromBottom > 100) {
            this.isshowdouwn = true
          }
          else {
            this.isshowdouwn = false
          }


        })
      this._subscriptions.push(sb1)

    }


  }
  CreatedJob(itemchat: any) {
    this.chatService.CheckGov().subscribe(res => {
      if (res && res.status == 1) {
        if (res.data == true) {
          this.router.navigate(['', { outlets: { auxName: `auxWork/createTask/1/${itemchat.IdChat}/${this.id_Group}` }, }]);
        }
        else {
          this.router.navigate(['', { outlets: { auxName: `auxWork/createTask/0/${itemchat.IdChat}/${this.id_Group}` }, }]);
        }
      }
    })
    // mặc định truyền v2 và check vtswork để truyền gov =1
    // const data = this.conversation_service.getAuthFromLocalStorage();
    // const lstAppCode: string[] = data['user']['customData']['jee-account']['appCode'];
    // if (lstAppCode) {
    //   if (lstAppCode.indexOf(this.appCodeVTS) === -1) {
    //     // không có app code
    //     this.router.navigate(['', { outlets: { auxName: `auxWork/createTask/0/${itemchat.IdChat}/${this.id_Group}` }, }]);
    //   }
    //   else {
    //     //có app code  VTS truyền gov=1
    //     this.router.navigate(['', { outlets: { auxName: `auxWork/createTask/1/${itemchat.IdChat}/${this.id_Group}` }, }]);
    //   }
    // }
    // else {
    //   this.router.navigate(['', { outlets: { auxName: `auxWork/createTask/0/${itemchat.IdChat}/${this.id_Group}` }, }]);
    // }

    // this.router.navigate(['', { outlets: { auxName: 'auxWork/createTask/1/1' }, }]);
    // this.router.navigate(['', { outlets: { auxNameV1: `auxWorkV1/createTask/0/${itemchat.IdChat}/${this.id_Group}` }, }])






    // let chuoi = ""
    // let giatristart;
    // let giatriend;
    // if (itemchat.isEncode == true) {
    //   chuoi = this.decryptUsingAES256(itemchat.Content_mess).replace("\\", "").replace("\\", "");

    //   giatristart = chuoi.replace('/', "").indexOf(`data-id=`);
    //   giatriend = chuoi.replace('/', "").indexOf(`data-value=`);
    // }
    // else {
    //   chuoi = itemchat.Content_mess;
    //   giatristart = chuoi.replace('/', "").indexOf(`data-id="`);
    //   giatriend = chuoi.replace('/', "").indexOf(`data-value="`);
    // }


    let tmp;
    // console.log("vvvvv",chuoi.substr(giatristart + 8, giatriend - giatristart - 8).replace("\\", "").replace("\\", ""))
    //   if (chuoi.substr(giatristart + 8, giatriend - giatristart - 8) != "") {

    //     this.chatService.GetInforbyUserName(`${chuoi.substr(giatristart + 8, giatriend - giatristart - 8)}`)
    //       .subscribe(res => {

    //         if (res) {
    //           tmp = {
    //             image: res.data[0].Avatar,
    //             hoten: res.data[0].Fullname,
    //             id_nv: res.data[0].ID_user,
    //           }

    //           if (this.IsGov) {
    //             const dialogRef = this.dialog.open(CongViecTheoDuAnVer1PopupComponent,
    //               {
    //                 data: { _messageid: itemchat.IdChat, _itemid: tmp, _message:chuoi.replace("<p></p>", ""), _type: 2, _groupid: this.id_Group, _ischat: true },
    //                 panelClass: ['sky-padding-0', 'width700'],
    //               });
    //             dialogRef.afterClosed().subscribe(res => {
    //               if (!res) {
    //               }
    //               else {
    //                 // này là tạo thành công
    //                 this.layoutUtilsService.showActionNotification(' Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
    //               }
    //             });
    //           } else {
    //             const dialogRef = this.dialog.open(CongViecTheoDuAnPopupComponent,
    //               {
    //                 data: { _messageid: itemchat.IdChat, _itemid: tmp, _message: chuoi.replace("<p></p>", ""), _type: 2, _groupid: this.id_Group, _ischat: true },
    //                 panelClass: ['sky-padding-0', 'width700'],
    //               });
    //             dialogRef.afterClosed().subscribe(res => {
    //               if (!res) {
    //               }
    //               else {
    //                 // này là tạo thành công
    //                 this.layoutUtilsService.showActionNotification(' Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
    //               }
    //             });
    //           }

    //         }
    //       })
    //   }
    //   else {


    //     this.chatService.GetnforUserByUserNameForMobile(itemchat.UserName).subscribe(res=>
    //       {
    //         if(res&&res.status==1)
    //         {



    //     // không phải nhóm tạo công việc chính mình lấy user kia
    //     if (this.userCurrent == itemchat.UserName && this.isGroup == false) {
    //       tmp = {
    //         image: this.listInfor[0].Avatar?this.listInfor[0].Avatar:"",
    //         hoten: this.listInfor[0].FullName,
    //         id_nv: this.listInfor[0].UserId,
    //       }
    //     }
    //     else {

    //         tmp = {
    //             image: itemchat.Avatar,
    //             hoten: itemchat.FullName,
    //             id_nv: res.data[0].ID_user

    //           }

    //     }

    //     if (this.IsGov) {
    //       const dialogRef = this.dialog.open(CongViecTheoDuAnVer1PopupComponent,
    //         {
    //           data: { _messageid: itemchat.IdChat, _itemid: tmp, _message: chuoi.replace("<p></p>", ""), _type: 2, _groupid: this.id_Group, _ischat: true },
    //           panelClass: ['sky-padding-0', 'width700'],
    //         });
    //       dialogRef.afterClosed().subscribe(res => {
    //         if (!res) {
    //         }
    //         else {
    //           // này là tạo thành công
    //           this.layoutUtilsService.showActionNotification(' Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
    //         }
    //       });
    //     } else {
    //       const dialogRef = this.dialog.open(CongViecTheoDuAnPopupComponent,
    //         {
    //           data: { _messageid: itemchat.IdChat, _itemid: tmp, _message: chuoi.replace("<p></p>", ""), _type: 2, _groupid: this.id_Group, _ischat: true },
    //           panelClass: ['sky-padding-0', 'width700'],
    //         });
    //       dialogRef.afterClosed().subscribe(res => {
    //         if (!res) {
    //         }
    //         else {
    //           // này là tạo thành công
    //           this.layoutUtilsService.showActionNotification(' Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
    //         }
    //       });
    //     }
    //   }

    // })



    //   }

  }
  ResendMessage(reitemchat) {
    localStorage.setItem('RechatGroup', this.id_Group);

    // xóa tin nhắn có lỗi đi
    this.isloadingError = true;
    setTimeout(() => {
      if (this.isloadingError) {

        this.isloadingError = false;
        this.changeDetectorRefs.detectChanges()

      }
      setTimeout(() => {
        let item = this.ItemMessengerResend(reitemchat.Content_mess);

        this.isloading = false;
        this.messageContent = this.messageContent.replace("<p></p>", "");

        const data = this.conversation_service.getAuthFromLocalStorage();

        var _token = data.access_token;

        this.messageForm.reset();
        this.AttachFileChat = [];

        this.lstTagName = [];

        this.list_file = [];
        this.listFileChat = [];
        this.list_image = [];
        this.listReply = [];
        this.myFilesVideo = [];
        this.url = "";
        this.messageContent = "";

        const RechatGroup = localStorage.getItem('RechatGroup')
        this.messageService.sendMessage(_token, item, Number(RechatGroup)).then((res) => {
          let indexerrorchat = this.listMess.findIndex(x => x.IdChat == reitemchat.IdChat)
          if (indexerrorchat >= 0) {
            this.listMess = this.listMess.filter((item, index) => index !== indexerrorchat)
            this.isloadingError = false;
            this.ischeckconnect = false;
            this.changeDetectorRefs.detectChanges()

          }


          // this.viewPort.scrollToIndex(this.listMess.length-1, 'smooth');
          setTimeout(() => {
            this.viewPort.scrollTo({
              bottom: 0,
              behavior: 'auto',
            });
          }, 0);
          setTimeout(() => {
            this.viewPort.scrollTo({
              bottom: 0,
              behavior: 'auto',
            });
          }, 50);
          //  this.messageForm.reset();

        })
          .catch((error) => {
            this.isloadingError = false;
            this.layoutUtilsService.showActionNotification('Không thể gửi tin nhắn!', MessageType.Read, 3000, true, false, 3000, 'top', 0);
          });



      }, 1000);
    }, 10000);


    if (this.messageService.Resend() == false) {
      this.messageService.connectToken(this.id_Group);
    }
    // this.txttam="";

    this.messageContent = reitemchat.Content_mess;
    setTimeout(() => {
      this.messageForm.reset();
      this.messageContent = this.messageContent.replace("<p></p>", "");
      if ((this.messageContent && this.messageContent != "" && this.messageContent != "<p><br></p>" && this.messageContent.length > 0) || this.AttachFileChat.length > 0) {
        let itemerro: any = this.ItemMessengerEror();
        this.isloading = false;
        const data = this.conversation_service.getAuthFromLocalStorage();

        var _token = data.access_token;
        let item = this.ItemMessenger();

        this.AttachFileChat = [];

        this.lstTagName = [];

        this.list_file = [];
        this.listFileChat = [];
        this.list_image = [];
        this.listReply = [];
        this.myFilesVideo = [];
        this.url = "";
        this.messageContent = "";


        this.messageService.sendMessage(_token, item, this.id_Group).then((res) => {

          let indexerrorchat = this.listMess.findIndex(x => x.IdChat == reitemchat.IdChat)
          if (indexerrorchat >= 0) {
            // this.listMess.splice(indexerrorchat,1);
            this.listMess = this.listMess.filter((item, index) => index !== indexerrorchat)
            this.isloadingError = false;
            this.changeDetectorRefs.detectChanges()

          }

          // this.messageContent="";
          // document.getElementById('content').textContent = '';



          if (this.id_Chat) {

            this.router.navigateByUrl('/Chat/Messages/' + this.id_Group + '/null');
            // this.router.navigate(['DashBoard/Chat/Messages/'+this.id_Group+'/null']);
          }
          if (this.draftmessage.length > 0) {
            let indexremove = this.draftmessage.findIndex(x => x.IdGroup == this.id_Group);
            if (indexremove >= 0) {
              this.draftmessage.splice(indexremove, 1);
              localStorage.setItem("draftmessage", JSON.stringify(this.draftmessage));
              this.conversation_service.draftMessage$.next(true);

            }

          }

          // this.viewPort.scrollToIndex(this.listMess.length-1, 'smooth');
          setTimeout(() => {
            this.viewPort.scrollTo({
              bottom: 0,
              behavior: 'auto',
            });
          }, 0);
          setTimeout(() => {
            this.viewPort.scrollTo({
              bottom: 0,
              behavior: 'auto',
            });
          }, 50);
          //  this.messageForm.reset();

        })
          .catch((error) => {
            // let dataitem:any[]=[]

            //   dataitem.push(itemerro);
            //   this.listMess= this.listMess.concat(dataitem);
            //   this.changeDetectorRefs.detectChanges()

          });




      }

    }, 1000);

  }
  ResendMess(item) {
    this.ResendMessage(item);
  }
  RouterCV(id_cv) {
    this.router.navigate(['', { outlets: { auxName: 'auxWork/DetailsGOV/' + id_cv }, }]);
  }
  displayCounter(count) {
    this.parentCount = count;
  }
  IsGov: boolean = false;
  displayIsGov(val) {
    this.IsGov = val;
  }
  Changebg(url) {
    this.bgurl = url;
    this.changeDetectorRefs.detectChanges()
  }
  CloseChooseBG() {
    this.isCollapsed = true;
    this.bgurl = "";
    this.changeDetectorRefs.detectChanges()
  }
  ItemChangeBg(url): ChangeBg {

    const item = new ChangeBg();
    item.IdGroup = this.id_Group;
    item.url = url,

      item.UploadBg = this.Lstimg_bg.slice();

    return item
  }
  SaveBgUrl() {
    let item
    if (this.Lstimg_bg.length > 0) {
      item = this.ItemChangeBg(null)
    }
    else {
      item = this.ItemChangeBg(this.bgurl)
      this.listInfor[0].BgImage[0].BackgroundURL = this.bgurl;
    }

    this.chatService.UpdateURLBg(item).subscribe(res => {
      if (res) {
        if (res.data.length > 0) {
          this.listInfor[0].BgImage[0].BackgroundURL = res.data[0].videoUrl;

        }
        this.bgurl = null;
        this.Lstimg_bg = [];
        this.layoutUtilsService.showActionNotification('Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
      }
    })
  }

  defaulBG() {
    this.bgurl = null;
    let item = this.ItemChangeBg(null)
    this.listInfor[0].BgImage[0].BackgroundURL = null;
    this.chatService.UpdateURLBg(item).subscribe(res => {
      if (res) {
        // this.layoutUtilsService.showActionNotification('Thành công !', MessageType.Read, 3000, true, false, 3000, 'top', 1);
      }
    })
    this.changeDetectorRefs.detectChanges();
  }
  uploadFile(event) {
    let temp: any[] = [];
    this.Lstimg_bg = [];
    let base64Str: any;
    let cat: any;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    var file_name = event.target.files;

    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);

      // When file uploads set it to file formcontrol
      reader.onload = (event) => {
        cat = file_name[0].name.substr(file_name[0].name.indexOf('.'));
        if (cat.toLowerCase() === '.png' || cat.toLowerCase() === '.jpg') {
          temp.push(event.target.result);
          var metaIdx = temp[0].indexOf(';base64,');
          base64Str = temp[0].substr(metaIdx + 8);
          this.Lstimg_bg.push({ filename: file_name[0].name, type: file_name[0].type, size: file_name[0].size, strBase64: base64Str });
        }
        this.bgurl = reader.result;

        this.changeDetectorRefs.detectChanges();
        // console.log("sdsadsada",this.bgurl)

      }

    }
  }
  RouterMeeting(id) {
    // this.menu_service.CloseMenu();
    localStorage.setItem("activeTab", null);
    localStorage.setItem('chatGroup', "0");
    this.router.navigateByUrl(`/Meeting/${id}?Type=1`);

  }
  OpenSearch() {

    this.opensearch == true ? this.opensearch = false : this.opensearch = true;
    if (this.opensearch == true) {
      this.sidenav.open()
    }
    else {
      this.sidenav.close()
    }
    setTimeout(() => {
      document.getElementById("idsearchchat").focus();

    }, 200);
    // this.listSearch=[];
    this.changeDetectorRefs.detectChanges();
  }


  saverangesearch(value) {

    if (value != "" && this.searchText != undefined) {
      this.getSearch(value)

    }
    else {
      this.listSearch = [];
      this.changeDetectorRefs.detectChanges();
    }

  }

  getSearch(vl: any) {
    const queryParams1 = new QueryParamsModelNewLazy(
      '',
      '',
      '',
      0,
      50,
      false


    );
    this.chatService.getSearch(this.id_Group, vl, queryParams1).subscribe(res => {
      if (res.data) {
        this.listSearch = res.data;
        // console.log(" this.listSearch", this.listSearch)
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  OpenS() {
    this.conversation_service.data_share = false;
  }
  CreatedVote() {
    const dialogRef = this.dialog.open(TaoBinhChonComponent, {
      width: '600px',
      disableClose: true,
      data: this.id_Group
    }).afterClosed().subscribe(result => {

      this.loadDataList();
      // this.closeDilog(result);


    });
  }
  getClassvote(item) {
    if (item) {

      if (item.lengthvote > 0) {
        let indexgr = this.listMess.findIndex(x => x.IdChat == item.id_chat)
        let indexvote = this.listMess[indexgr].Vote.findIndex(x => x.id_vote == item.id_vote)

        const progressdowload = document.getElementById("progress" + indexgr + indexvote);
        if (progressdowload) {
          progressdowload.classList.add('progressdown');
          progressdowload.style.width = Math.floor(item.lengthvote / item.allmember * 100) + "%";
        }


      }
    }


  }
  Itemvote(itemdata): MemberVoteModel {
    const item = new MemberVoteModel();
    item.ListMmeberVote = itemdata;
    return item
  }
  updatePrice(item, event) {
    let indexgr = this.listMess.findIndex(x => x.IdChat == item.id_chat)
    let indexvote = this.listMess[indexgr].Vote.findIndex(x => x.id_vote == item.id_vote)

    if ((<HTMLInputElement>event.target).checked) {
      this.list_Vote = []

      const progressdowload = document.getElementById("progress" + indexgr + indexvote);
      // const progressText = document.getElementById("progress-text"+bd+index);
      progressdowload.classList.add('progressdown');
      this.listMess[indexgr].Vote[indexvote].lengthvote = item.lengthvote + 1;
      progressdowload.style.width = Math.floor((item.lengthvote + 1) / item.allmember * 100) + "%";
      let ituser =
      {
        id_group: this.id_Group,
        id_vote: item.id_vote,
        avatar: this.Avatar,
        username: this.userCurrent,
        fullname: this.fullname
      }
      this.listMess[indexgr].Vote[indexvote].UserVote.push(ituser)
      // progressText.innerHTML=item.noidung;
      this.list_Vote.push(item);
      let itemvote = this.Itemvote(this.list_Vote);
      this.chatService.AddMemberVote(itemvote, "insert").subscribe(res => {
        if (res && res.status == 1) {
          this.messageService.UpdateVote(item.id_chat, item.id_group, item.id_vote, "insert", this.userCurrent, this.Avatar, this.fullname);
        }
      })
    }
    else {
      this.list_Vote = []
      const progressdowload = document.getElementById("progress" + indexgr + indexvote);
      // const progressText = document.getElementById("progress-text"+bd+index);
      progressdowload.classList.remove('progressdown');
      this.listMess[indexgr].Vote[indexvote].lengthvote = item.lengthvote - 1;
      progressdowload.style.width = Math.floor((item.lengthvote - 1) / item.allmember * 100) + "%"

      let indexvt = this.listMess[indexgr].Vote[indexvote].UserVote.findIndex(x => x.id_vote == item.id_vote && x.username == this.userCurrent);
      this.listMess[indexgr].Vote[indexvote].UserVote.splice(indexvt, 1)
      // progressText.innerHTML="";
      this.list_Vote.push(item);
      // let indexremove=this.list_Vote.findIndex(x=>x.id_vote==item.id_vote)
      // this.list_Vote.splice(indexremove,1);
      this.changeDetectorRefs.detectChanges();
      let itemvote = this.Itemvote(this.list_Vote);

      this.chatService.AddMemberVote(itemvote, "remove").subscribe(res => {
        if (res && res.status == 1) {
          this.messageService.UpdateVote(item.id_chat, item.id_group, item.id_vote, "remove", this.userCurrent, this.Avatar, this.fullname);
        }
      })
    }
  }
  LoadVote(item) {
    //	debugger
    var data = Object.assign({}, item);
    // var data = Object.assign({}, item);
    const dialogRef = this.dialog.open(LoadVoteComponent, {
      // disableClose: true,
      data: data,
      height: 'auto',
      width: '550px',
    });
    // dialogRef.afterClosed().subscribe((res) => {
    // 	if (res) {
    // 	} else {
    // 		return;
    // 	}
    // });
  }

  RecoveryMess() {
    const _title = this.translate.instant('Khôi phục tin nhắn');
    const _description = this.translate.instant('Bạn có muốn khôi phục không ?');
    const _waitDesciption = this.translate.instant('Dữ liệu đang được khôi phục');
    const _deleteMessage = this.translate.instant('Thành công !');
    const _erroMessage = this.translate.instant('Lỗi không xác định!');
    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }



      // xóa group user với nhau
      const sb = this.chatService.RecoveryMess(this.id_Group).subscribe((res) => {

        if (res && res.status === 1) {

          this.loadDataList();
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
        }
        this._subscriptions.push(sb);

      });
    });
  }

  Previewall_Img(img) {
    const dialogRef = this.dialog.open(PreviewAllimgComponent, {
      width: 'auto',
      panelClass: 'chat-bg-preview',
      data: img
    }).afterClosed().subscribe(result => {

      // this.closeDilog(result);


    });
  }

  // private watchScroll() {
  //   let currentOffset: number = 0;
  //   this.viewPort.elementScrolled().subscribe(event => {
  //     const newOffset = this.viewPort.measureScrollOffset();
  //     if (newOffset === currentOffset) return;

  //     if (newOffset >currentOffset) {

  //       this._scrollingDown.next(newOffset);
  //     }

  //     currentOffset = newOffset;
  //   })
  // }
  // private handleScrollingDown() {
  //   this._scrollingDown.subscribe(offset => {
  //     const fromBottom = this.viewPort.measureScrollOffset('bottom');
  //     if(fromBottom==0)
  //     {
  //       alert("0")
  //     }
  //     if (fromBottom < 200) {
  //     }
  //   });
  // }

  DownUp() {
    this.isshowdouwn = false
    setTimeout(() => {
      this.viewPort.scrollTo({
        bottom: 0,
        behavior: 'auto',
      });
    }, 0);
    setTimeout(() => {
      this.viewPort.scrollTo({
        bottom: 0,
        behavior: 'auto',
      });
    }, 50);
    this.changeDetectorRefs.detectChanges();
  }

  EnCode() {
    let dt = {
      IdGroup: this.id_Group,
      isEnCode: this.isEnCode

    }
    const dialogRef = this.dialog.open(EncodeChatComponent, {
      width: 'auto',
      data: dt
    }).afterClosed().subscribe(result => {

      this.GetInforUserChatwith(this.id_Group)
      this.CheckEnCodeInConversation(this.id_Group)
      // this.closeDilog(result);



    });
  }

  StoreSticker() {
    this.showstoresticker = true;
    this.changeDetectorRefs.detectChanges()
  }

  onTabChanged(event) {
    if (event.index == 0) {
      this.showstoresticker = false;
      this.changeDetectorRefs.detectChanges()
    }
  }
  downloadSticker(GrSticker: number, key: string) {
    this.chatService.ActionSticker(GrSticker, key).subscribe(res => {
      if (res) {
        let indexsticker = this.listStoreSticker.findIndex(x => x.GrSticker == GrSticker);
        if (indexsticker >= 0) {
          if (key == "insert") {
            this.listStoreSticker[indexsticker].check = true;
            // this.GetStoreSticker()
            this.QuanLyStoreSticker();
            this.GetminilistSticker()

          }
        }
        if (key == "remove") {
          let indexstickerremove = this.listQLStoreSticker.findIndex(x => x.GrSticker == GrSticker);
          this.listQLStoreSticker.splice(indexstickerremove, 1);

          this.GetStoreSticker();
          this.GetminilistSticker()
          this.QuanLyStoreSticker();
          this.changeDetectorRefs.detectChanges();
        }
      }
    })
  }
  conditiontime: boolean = true;
  ShowSticker(GrSticker) {
    // this.conditiontime =true;
    this.GetSticker(GrSticker);
    this.listStickerTime = [];
    this.conditiontime = false;
  }
  ShowTimeSticker() {
    this.conditiontime = true;
    this.listSticker = [];
    this.listStickerTime = JSON.parse(localStorage.getItem("Sticker"));
    if (!this.listStickerTime) {
      this.listStickerTime = [];
    }
    this.changeDetectorRefs.detectChanges();
  }
  ItemMessengerSticker(UrlSticker: any): Message {

    const item = new Message();



    item.isTagName = false


    item.Content_mess = this.messageContent.replace("<p><br></p>", "");

    item.UserName = this.userCurrent;
    item.IdGroup = this.id_Group;
    item.isGroup = this.isGroup;
    item.isSticker = true;
    item.UrlSticker = UrlSticker;
    item.isEncode = false
    item.Note = "";
    item.IsDelAll = false;
    item.IsVideoFile = this.url ? true : false;
    item.Attachment = this.AttachFileChat.slice();

    return item
  }

  sendMessageSticker(UrlSticker: any, GrSticker: any, IdSticker: any) {
    this.listStickerTime = JSON.parse(localStorage.getItem("Sticker"));
    if (!this.listStickerTime) {
      this.listStickerTime = [];
    }
    let indexxsticker = this.listStickerTime.findIndex(x => x.GrSticker == GrSticker && x.IdSticker == IdSticker);
    if (indexxsticker < 0) {
      // let tampsticker=[]
      let dtsticker = {
        GrSticker: GrSticker,
        UrlSticker: UrlSticker,
        IdSticker: IdSticker
      }
      this.listStickerTime.push(dtsticker)
      localStorage.setItem("Sticker", JSON.stringify(this.listStickerTime))
    }
    this.messageForm.reset();
    this.isCollapsedsticker = true
    this.isloading = false;
    const data = this.conversation_service.getAuthFromLocalStorage();

    var _token = data.access_token;
    let item = this.ItemMessengerSticker(UrlSticker);
    this.AttachFileChat = [];

    this.lstTagName = [];

    this.list_file = [];
    this.listFileChat = [];
    this.list_image = [];
    this.listReply = [];
    this.myFilesVideo = [];
    this.url = "";
    this.messageService.sendMessage(_token, item, this.id_Group).then((res) => {


      if (this.id_Chat) {

        this.router.navigateByUrl('/Chat/Messages/' + this.id_Group + '/null');
        // this.router.navigate(['DashBoard/Chat/Messages/'+this.id_Group+'/null']);
      }


      // this.viewPort.scrollToIndex(this.listMess.length-1, 'smooth');
      setTimeout(() => {
        this.viewPort.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 0);
      setTimeout(() => {
        this.viewPort.scrollTo({
          bottom: 0,
          behavior: 'auto',
        });
      }, 50);
      //  this.messageForm.reset();

    })
      .catch((error) => {
        let dataitem: any[] = []
        this.layoutUtilsService.showActionNotification('Kết nối không ổn định !', MessageType.Read, 3000, true, false, 3000, 'top', 0);
        // console.log("AAAA",this.listMess)
        this.changeDetectorRefs.detectChanges()

      });

  }
  Collapsedsticker() {

    this.isCollapsedsticker = !this.isCollapsedsticker;
    this.ShowTimeSticker();
    this.GetStoreSticker()
    this.QuanLyStoreSticker();
    this.GetminilistSticker();
  }
  ItemGhim(data): GhimModel {
    const item = new GhimModel();
    item.IdGroup = this.id_Group;
    if (data.Content_mess == '') {
      item.Content_mess = "File đính kèm"
    }
    else {
      item.Content_mess = data.isEncode ? this.decryNote(data.Content_mess) : data.Content_mess;

    }
    item.FullName = data.FullName;
    item.IdChat = data.IdChat;
    if (data.Attachment.length > 0 || data.Attachment_File.length > 0) {
      item.isFile = true;
    }
    else {
      item.isFile = false;

    }
    return item
  }
  listGhim: any
  LoadGhim(idGroup) {
    const sb = this.chatService.GetGhimGroup(idGroup).subscribe(res => {
      if (res) {
        this.listGhim = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
    this._subscriptions.push(sb)
  }
  removeGhim() {
    const sb = this.chatService.removeGhim(this.id_Group).subscribe(res => {
      if (res && res.status == 1) {
        this.LoadGhim(this.id_Group)

        this.changeDetectorRefs.detectChanges();
      }
    })
    this._subscriptions.push(sb)
  }
  AddGhim(dt) {
    let item = this.ItemGhim(dt);

    this.chatService.addGhim(item).subscribe(res => {
      if (res && res.status == 1) {
        // thông báo
        this.LoadGhim(this.id_Group);
        const data = this.conversation_service.getAuthFromLocalStorage();

        var _token = data.access_token;
        this.chatService.publishMessNotifiGhim(_token, this.id_Group, this.fullname + ' đã ghim tin nhắn : ' + item.Content_mess.replace(/(<([^>]+)>)/gi, ""), item.IdChat).subscribe(res => {

        })


      }
    })
  }

}
