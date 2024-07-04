
import { ChangeDetectorRef, Component, Directive, ElementRef, Inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { MessageService } from '../../services/message.service';
import { ChatService } from '../../services/chat.service';
import { AuthService } from 'src/app/modules/auth';
import { Message } from '../../models/message';
import { QuillEditorComponent } from 'ngx-quill';
import { fromEvent, Subject, of as observableOf } from 'rxjs';
import { takeUntil, map, switchMap } from 'rxjs/operators';
import { ConversationService } from '../../services/conversation.service';
@Component({
  selector: 'app-share-message',
  templateUrl: './share-message.component.html',
  styleUrls: ['./share-message.component.scss']
})
export class ShareMessageComponent implements OnInit {
  dulieu:string;
  searchText:string;
  userCurrent:string;
  Attachment:any[]=[];
  
  @ViewChild(QuillEditorComponent, { static: true })
  editor: QuillEditorComponent;
  modules = {
    toolbar: false,
 
  };
  list_image:any[]=[]
  list_video:any[]=[]
  list_file:any[]=[]
  KeyEnCode:string;
  AttachFileChat:any[]=[]
  AttacVideoChat:any[]=[]
  Attachment_File:any[]=[];
   public filteredGroups: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
   public searchControl: FormControl = new FormControl();
list_contact:any[]=[];
list_choose:any[]=[];
list_delete:any[]=[];

  constructor(private dialogRef:MatDialogRef<ShareMessageComponent>,
    private changeDetectorRefs: ChangeDetectorRef,
    private messageService:MessageService,
    private _ngZone:NgZone,
    private conversationServices:ConversationService,
    private chat_services:ChatService,
    @Inject(MAT_DIALOG_DATA) public data: any,

    ) {  
      const dt=this.conversationServices.getAuthFromLocalStorage();
      this.userCurrent=dt.user.username
   }
    LoadDSThanhVien()
    {
        this.chat_services.GetContactChatUser().subscribe(res=>{
          this.list_contact=res.data;
          this.changeDetectorRefs.detectChanges();
        })
    }
    RouterLink(item){
      window.open(item,"_blank")
    }


  ngOnInit(): void {
    this.LoadDSThanhVien();
 console.log("ggg",this.data)
      this.dulieu=this.data.dt.content;
 
    this.Attachment=this.data.dt.item.Attachment;
    this.Attachment_File=this.data.dt.item.Attachment_File;
    this.AttacVideoChat=this.data.dt.item.Videos;
    this.Attachment.forEach(element => {
      this.getBase64FromUrl(element.hinhanh).then(data=>{
        
        let item={
          filename:element.filename,
          size:element.size,
          dt:data
        }
      this.list_image.push(item);

  
    
    })
    });
    this.AttacVideoChat.forEach(element => {
      this.getBase64FromUrl(element.path).then(data=>{
        
        let item={
          filename:element.filename,
          size:element.size,
          dt:data
        }
      this.list_video.push(item);

    
    })
    });
 
   
    this.Attachment_File.forEach(element => {
      this.getBase64FromUrl(element.Link).then(data=>{
        let item={
          filename:element.filename,
          size:element.size,
          dt:data
        }
      this.list_file.push(item);
    //   var metaIdx = this.list_image[0].indexOf(';base64,');
    // let  base64Str =  this.list_image[0].substr(metaIdx + 8);
    //  var typefile=this.list_image[0].substr(5,metaIdx-5);
    // this.AttachFileChat.push({ filename: element.filename,type:typefile,size:element.size,strBase64: base64Str });
    
    })
    });
  }



  RemoveChooseMemeber(index)
  {this.list_contact.unshift(this.list_choose[index]);
    this.list_choose.splice(index,1);

  }
  ChooseMember(item)
  {
    let vitri=this.list_contact.findIndex(x=>x.IdGroup==item);
    if(vitri>=0)
    {
      this.searchText="";

      this.list_choose.push(this.list_contact[vitri]);
      this.list_contact.splice(vitri,1)
      // this.filteredGroups.next(this.list_thanhvien.slice());
      this.changeDetectorRefs.detectChanges();
    }
  }


  CloseDia(data = undefined)
  {
      this.dialogRef.close(data);
  }
  goBack() {

    this.dialogRef.close();

  }

  ItemMessenger(idGroup,isGroup): Message {
    if( this.list_image.length>0)
    {
    this.list_image.forEach(elementimg => {
      var metaIdx = elementimg.dt.indexOf(';base64,');
      let  base64Str =  elementimg.dt.substr(metaIdx + 8);
       var typefile=elementimg.dt.substr(5,metaIdx-5);
      this.AttachFileChat.push({ filename: elementimg.filename,type:typefile,size:elementimg.size,strBase64: base64Str });
    });
  }
  if( this.list_video.length>0)
  {
  this.list_video.forEach(elementimg => {
    var metaIdx = elementimg.dt.indexOf(';base64,');
    let  base64Str =  elementimg.dt.substr(metaIdx + 8);
     var typefile=elementimg.dt.substr(5,metaIdx-5);
    this.AttachFileChat.push({ filename: elementimg.filename,type:typefile,size:elementimg.size,strBase64: base64Str });
  });
}
    if( this.list_file.length>0)
    {

    this.list_file.forEach(elementimg => {
      var metaIdx = elementimg.dt.indexOf(';base64,');
      let  base64Str =  elementimg.dt.substr(metaIdx + 8);
       var typefile=elementimg.dt.substr(5,metaIdx-5);
      this.AttachFileChat.push({ filename: elementimg.filename,type:typefile,size:elementimg.size,strBase64: base64Str });
    });
  }

    const item = new Message();
    item.isGroup=isGroup;
    item.Content_mess=this.dulieu;
    item.isTagName=false
    item.UserName=this.userCurrent;
    item.IdGroup=idGroup;
item.isEncode=false;
      item.Note=this.data.dt.item.Note;

    item.IsDelAll=this.data.dt.item.IsDelAll;
    item.IsVideoFile=this.data.dt.item.IsVideoFile;
    item.Attachment=this.AttachFileChat;

    return item;
  }
 getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob); 
      reader.onloadend = () => {
   
        const base64data = reader.result;   
        resolve(base64data);
      }
    });
  }

  submit()
  {
    
    for(let i=0;i<this.list_choose.length;i++)
    {

      this._ngZone.run(() => {
      // this.messageService.connectToken(this.list_choose[i].IdGroup);

    })

    setTimeout(() => {

    let  item =this.ItemMessenger(this.list_choose[i].IdGroup,this.list_choose[i].isGroup)
    const dt=this.conversationServices.getAuthFromLocalStorage();
    this.messageService.sendMessage(dt.access_token,item,this.list_choose[i].IdGroup).then((data) => {

    })

  }, 5000);
  }
  this.dialogRef.close();
  }

}

@Directive({
  selector: '[appJpDraggableDialogShare]',
})
export class JpDraggableDialogShareDirective implements OnInit, OnDestroy {
  // Element to be dragged
  private _target: HTMLElement;

  // dialog container element to resize
  private _container: HTMLElement;

  // Drag handle
  private _handle: HTMLElement;
  private _delta = {x: 0, y: 0};
  private _offset = {x: 0, y: 0};

  private _destroy$ = new Subject<void>();

  private _isResized = false;

  constructor(
    private _elementRef: ElementRef,
    private _zone: NgZone,
    private _cd: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this._elementRef.nativeElement.style.cursor = 'default';
    this._handle = this._elementRef.nativeElement.parentElement.parentElement.parentElement;
    this._target = this._elementRef.nativeElement.parentElement.parentElement.parentElement;
    this._container = this._elementRef.nativeElement.parentElement.parentElement;
    this._container.style.resize = 'both';
    this._container.style.overflow = 'hidden';

    this._setupEvents();
  }

  public ngOnDestroy(): void {
    if (!!this._destroy$ && !this._destroy$.closed) {
      this._destroy$.next();
      this._destroy$.complete();
    }
  }

  private _setupEvents() {
    this._zone.runOutsideAngular(() => {
      const mousedown$ = fromEvent(this._handle, 'mousedown');
      const mousemove$ = fromEvent(document, 'mousemove');
      const mouseup$ = fromEvent(document, 'mouseup');

      const mousedrag$ = mousedown$.pipe(
        switchMap((event: MouseEvent) => {
          const startX = event.clientX;
          const startY = event.clientY;

          const rectX = this._container.getBoundingClientRect();
          if (
            // if the user is clicking on the bottom-right corner, he will resize the dialog
            startY > rectX.bottom - 15 &&
            startY <= rectX.bottom &&
            startX > rectX.right - 15 &&
            startX <= rectX.right
          ) {
            this._isResized = true;
            return observableOf(null);
          }

          return mousemove$.pipe(
            map((innerEvent: MouseEvent) => {
              innerEvent.preventDefault();
              this._delta = {
                x: innerEvent.clientX - startX,
                y: innerEvent.clientY - startY,
              };
            }),
            takeUntil(mouseup$),
          );
        }),
        takeUntil(this._destroy$),
      );

      mousedrag$.subscribe(() => {
        if (this._delta.x === 0 && this._delta.y === 0) {
          return;
        }

        this._translate();
      });

      mouseup$.pipe(takeUntil(this._destroy$)).subscribe(() => {
        if (this._isResized) {
          this._handle.style.width = 'auto';
        }

        this._offset.x += this._delta.x;
        this._offset.y += this._delta.y;
        this._delta = {x: 0, y: 0};
        this._cd.markForCheck();
      });
    });
  }

  private _translate() {
    // this._target.style.left = `${this._offset.x + this._delta.x}px`;
    // this._target.style.top = `${this._offset.y + this._delta.y}px`;
    // this._target.style.position = 'relative';
    requestAnimationFrame(() => {
      this._target.style.transform = `
        translate(${this._offset.x + this._delta.x}px,
                  ${this._offset.y + this._delta.y}px)
      `;
    });
  }
  
}


