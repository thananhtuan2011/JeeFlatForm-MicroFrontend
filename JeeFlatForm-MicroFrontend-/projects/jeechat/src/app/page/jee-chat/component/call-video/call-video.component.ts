import { VideoRecordingService } from './../../services/video-recording.service';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { fromEvent, Subject, of as observableOf } from 'rxjs';
import moment from "moment";
import { AfterViewInit, ChangeDetectorRef, Component, Directive, ElementRef, Inject, NgZone, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
// import * as Peer from 'peerjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MessageService } from '../../services/message.service';
import { PresenceService } from '../../services/presence.service';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { CallOrtherComponent } from '../call-orther/call-orther.component';
import { ConversationService } from '../../services/conversation.service';

@Component({
  selector: 'app-call-video',
  templateUrl: './call-video.component.html',
  styleUrls: ['./call-video.component.scss']
})
export class CallVideoComponent implements OnInit, OnDestroy {
  isGroup: boolean;
  startTime;
  private _subscriptions: Subscription[] = [];
  acticall: boolean = true;

  callTime;
  @ViewChild('videoElement') videoElement: any;
  videorecord: any;
  activeimgconnect: boolean = true;
  status: string;
  acticlose: boolean = false;
  error: boolean = false;
  Fullname: string;
  videoBlobUrl;
  Avatar: string;
  CallPeople: string;
  AvatarSend: string;
  NameCall: string;
  interval: any;
  intervaltime: any;
  intervalawait: any;
  audioawait = new Audio();
  audiocall = new Audio();
  peerIdShare: string;
  peerId: string;
  public lazyStream: any;
  public lazyStreammini: any;
  currentPeer: any;
  private peerList: Array<any> = [];
  userCurrent: string
  BgColor: string;
  offmic: boolean = false;
  offvideo: boolean = false
  chatgroup: number;
  BgColorSend: string;
  videoStream: MediaStream;
  mm = 0;
  ss = 0;
  ms = 0;
  timerId: any = 0;
  isRunning = false;
  videoConf = { video: { facingMode: "user", width: 320 }, audio: false }
  configService: any = "stun:stun.l.google.com:19320";
  constructor(
    private dialogRef: MatDialogRef<CallVideoComponent>,
    private messageService: MessageService,
    public videoRecordingService: VideoRecordingService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private conversation_sevices: ConversationService,
    private presence: PresenceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(PLATFORM_ID) private _platform: Object
  ) {
    // this.peer = new Peer()
    // ;hihi tuan

    const dt = this.conversation_sevices.getAuthFromLocalStorage();
    this.userCurrent = dt.user.username;
    this.Fullname = dt['user']['customData']['personalInfo']['Fullname'];
    this.Avatar = dt['user']['customData']['personalInfo']['Avatar'];
    this.BgColor = dt['user']['customData']['personalInfo']['BgColor'];
    // this.peer = new Peer( {
    //   config: {
    //     'iceServers': [{
    //       urls:"stun:stun.l.google.com:19320",          
    //     },
    //     {
    //       urls:'turn:numb.viagenie.ca',
    //       username:'webrtc@live.com',
    //       credential:'muazkh'
    //     }
    //   ]
    //   }
    // });


    this.videoRecordingService.getStream().subscribe((stream) => {
      this.videoStream = stream;
      this.changeDetectorRefs.detectChanges();
    });

    this.videoRecordingService.getRecordedBlob().subscribe((data) => {

      this.videoBlobUrl = this.sanitizer.bypassSecurityTrustUrl(data.url);
      this.changeDetectorRefs.detectChanges();
    });
  }
  startVideoRecording() {

    this.videoRecordingService.startRecording(this.videoConf)
      .then(stream => {
        this.lazyStreammini = stream;
        //  this.video.src = window.URL.createObjectURL(stream);
        // this.videorecord.srcObject = stream;
        // this.videorecord.play();
        const video = document.createElement('video');

        video.style.cssText = "width: 200px; height: 100px;"


        video.classList.add('videomini');
        video.srcObject = stream;
        video.play();
        document.getElementById('record-video').append(video);
        this.changeDetectorRefs.detectChanges();
        // var element = document.getElementById("record-video");
        // element.classList.add("videomini");
      })
      .catch(function (err) {
        console.log(err.name + ": " + err.message);
      });
  }

  @ViewChild('video', { static: true }) video: ElementRef<HTMLVideoElement>;

  private getPeerId = () => {
    if (this.lazyStream) {

    }

  }

  SendCallVideo(id: any, isGroup: boolean) {
    this.messageService.sendCallVideo(isGroup, this.data.dl.status, this.data.dl.idGroup
      , this.userCurrent, this.Fullname, this.Avatar, this.BgColor, id).catch(err => {
        console.log(err)

        this.messageService.connectToken(this.data.dl.idGroup);
        setTimeout(() => {
          this.messageService.sendCallVideo(isGroup, this.data.dl.status, this.data.dl.idGroup
            , this.userCurrent, this.Fullname, this.Avatar, this.BgColor, id)
        }, 1000);


      });;

  }
  format(num: number) {
    return (num + '').length === 1 ? '0' + num : num + '';
  }

  private toString(value) {
    let val = value;
    if (!value) {
      val = '00';
    }
    if (value < 10) {
      val = '0' + value;
    }
    return val;
  }

  clickHandlerTime() {
    this.startTime = moment();
    this.intervaltime = setInterval(
      () => {
        const currentTime = moment();
        const diffTime = moment.duration(currentTime.diff(this.startTime));
        const time = this.toString(diffTime.minutes()) + ':' + this.toString(diffTime.seconds());
        this.callTime = time;
        this.changeDetectorRefs.detectChanges();
      },
      500
    );
  }
  // TimeCall()

  // {
  //   this.presence.TimeCallVideo(this.data.dl.idGroup);
  // }
  ChapNhan() {

    clearInterval(this.interval);
    this.audiocall.pause();
    // this.TimeCall();
    this.acticall = true;


    // if(this.data.dl.status=='video')
    // {

    // }
    // else
    // {
    //   this.acticall=true;
    //   clearInterval(this.interval);
    //   this.callPeervoid(this.data.dl.keyid);
    // }


    this.changeDetectorRefs.detectChanges();
  }


  BackCall() {

    this.acticlose = false;

    setTimeout(() => {
      this.SendCallVideo(this.peerId, this.isGroup)
    }, 3000);
  }
  private EventSubcibeCloseCallVideo(): void {
    fromEvent(window, 'close').subscribe((res: any) => {

      if (res) {

        this.status = this.data.dl.status;

        if (this.data.dl.idGroup == res.detail.IdGroup) {
          // setTimeout(() => {
          //   this.CloseCall();
          // }, 1000);
          this.acticlose = true;
          this.audiocall.pause();
          clearInterval(this.intervaltime);

          this.dialogRef.updateSize('150px', '150px')
          if (this.lazyStream) {
            this.lazyStream.getTracks().forEach(function (track) {
              track.stop();
            });
            this.lazyStream.stop();

          }

          setTimeout(() => {
            this.Close()
          }, 300000);
          this.Disconnect();
          this.changeDetectorRefs.detectChanges();
        }
      }

    })
  }


  // closeCallVideoDialog() {
  //   const dialogRef = this.dialog.open(CloseCallComponent, {
  // // width:'800px',
  // // height:'auto',
  // disableClose: true

  //   });
  //   dialogRef.afterClosed().subscribe(res => {

  //     if(res)
  // {

  // }
  //     })

  // }
  // ngAfterViewInit(): void {
  //    this.videorecord = this.videoElement.nativeElement;
  // }
  CallingOrther() {
    let dl = {
      avatar: this.AvatarSend,
      BgColorSend: this.BgColorSend,
      CallPeople: this.CallPeople
    }

    const dialogRef = this.dialog.open(CallOrtherComponent, {
      data: dl
    });


  }
  EventCallOrther() {
    const sb = this.presence.CallOrther$.subscribe(res => {
      if (res) {

        if (res.UserName == this.userCurrent) {
          this.CallingOrther();
          this.Disconnect();
        }
      }

    })
    this._subscriptions.push(sb)
  }
  ngOnInit(): void {


    this.presence.ClosevideoMess.next(undefined)
    this.acticlose = false;
    this.isGroup = this.data.dl.isGroup;
    this.acticall = true;
    this.AvatarSend = this.data.dl.Avatar;
    this.status = this.data.dl.status
    this.NameCall = this.data.dl.Name;
    this.BgColorSend = this.data.dl.BG;
    this.CallPeople = this.data.dl.PeopleNameCall;


    this.getPeerId();
    if (this.data.dl.keyid == null && this.data.dl.UserName == this.userCurrent) {
      this.audioawait.src = "../../sound/nhaccho.mp3";
      this.audioawait.load();
      this.audioawait.play();
      this.intervalawait = setInterval(() => {

        this.audioawait.src = "../../sound/nhaccho.mp3";
        this.audioawait.load();
        this.audioawait.play();
        // this.soundservice.playAudiocallWait();

      }, 10000);
      setTimeout(() => {
        this.SendCallVideo(this.peerId, this.isGroup);
        // this.clickHandlerTime();
      }, 3000);
    }
    else {
      this.acticall = false;
      this.audiocall.src = "../../sound/nhaccho.mp3";
      this.audiocall.load();
      this.audiocall.play();
      this.interval = setInterval(() => {

        this.audiocall.src = "../../sound/nhaccho.mp3";
        this.audiocall.load();
        this.audiocall.play();
        // this.soundservice.playAudiocallWait();

      }, 10000);
      // this.changeDetectorRefs.detectChanges();
    }
    // setTimeout(() => {
    //
    // }, 3000);
    this.EventSubcibeCloseCallVideo();
    this.EventCallOrther();

  }







  private streamRemoteVideo(stream: any): void {

    const video = document.createElement('video');
    video.style.cssText = "width:1000px;height:600px"
    video.classList.add('videocall');
    video.srcObject = stream;
    video.play();
    this.audioawait.pause();
    clearInterval(this.intervalawait);
    document.getElementById('remote-video').append(video);
    //   var element = document.getElementById("remote-video");
    // element.classList.add("videocall");
    this.clickHandlerTime();
    this.startVideoRecording();
    localStorage.setItem('isCall', "calling");
  }
  private streamRemoteAudio(stream: any): void {
    const audio = document.createElement('audio');

    audio.srcObject = stream;
    audio.play();
    this.audioawait.pause();
    clearInterval(this.intervalawait);
    document.getElementById('remote-call').append(audio);
    localStorage.setItem('isCall', "calling");

  }
  Disconnect() {
    this.startTime = null;
    this.audioawait.pause();
    if (this.lazyStreammini) {
      this.lazyStreammini.getTracks().forEach(function (track) {
        track.stop();
      });

    }
    clearInterval(this.intervalawait);
    clearInterval(this.interval);
    clearInterval(this.intervaltime);
    localStorage.setItem('isCall', null);
    // if(this.lazyStream)
    // {
    try {


      this.lazyStream.getTracks().forEach(function (track) {
        track.stop();
      });
    } catch
    {
    }

    // }


    // setTimeout(() => {
    //   this.presence.CloseCallVideo(this.data.dl.idGroup,this.userCurrent);
    // }, 3010);

    this.presence.CloseCallVideo(this.data.dl.idGroup, this.userCurrent);
    this.CloseDia(this.data.dl)
    this.changeDetectorRefs.detectChanges();



  }
  CloseCall() {
    if (this.lazyStream) {
      this.lazyStream.getTracks().forEach(function (track) {
        track.stop();
      });
      this.lazyStream.stop();

    }

    // this.dialogRef.close();

    this.CloseDia(this.data.dl)
  }

  CloseDia(data = undefined) {
    // let time=(this.mm+":"+this.ss)
    // let schuoi=JSON.stringify(time)
    // console.log("Puschuoish schuoi",schuoi)
    let timec =
    {
      timecall: this.callTime
    }
    let dl = Object.assign(data, timec);
    // console.log("Push mảng",dl)
    // this.dialogRef.close()

    this.dialogRef.close(dl);
  }



  Close() {
    if (this.lazyStream) {
      this.lazyStream.getTracks().forEach(function (track) {
        track.stop();
      });

    }
    if (this.lazyStreammini) {
      this.lazyStreammini.getTracks().forEach(function (track) {
        track.stop();
      });
    }
    this.presence.ClosevideoMess.next(undefined)
    localStorage.setItem('isCall', null);
    clearInterval(this.interval);
    this.CloseDia(this.data.dl)
    // this.dialogRef.close();
  }
  screenShare(): void {
    this.shareScreen();
  }
  private shareScreen(): void {
    // @ts-ignore
    navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always'
      },
      audio: {
        echoCancellation: true,
        noiseSuppression: true
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

  OffMic() {
    if (this.offmic) {
      this.offmic = false;
      if (this.lazyStream) {
        if (this.lazyStream.getAudioTracks()[0]) {
          this.lazyStream.getAudioTracks()[0].enabled = true;
        }
      }
    }
    else {
      this.offmic = true;
      if (this.lazyStream) {
        if (this.lazyStream.getAudioTracks()[0]) {
          this.lazyStream.getAudioTracks()[0].enabled = false;
        }
      }
    }

    this.changeDetectorRefs.detectChanges();
  }

  OffVideo() {
    if (this.offvideo) {
      this.offvideo = false;
      if (this.lazyStream) {

        if (this.lazyStream.getVideoTracks()[0]) {
          this.lazyStream.getVideoTracks()[0].enabled = true;
        }
      }


    }
    else {
      this.offvideo = true;
      if (this.lazyStream) {

        if (this.lazyStream.getVideoTracks()[0]) {
          this.lazyStream.getVideoTracks()[0].enabled = false;
        }
      }
    }

    this.changeDetectorRefs.detectChanges();
  }
  ngOnDestroy() {
    if (this._subscriptions) {
      this._subscriptions.forEach((sb) => sb.unsubscribe());
    }
    // this.messageService.Newmessage.unsubscribe();
  }


}

@Directive({
  selector: '[appJpDraggableDialog]',
})
export class JpDraggableDialogDirective implements OnInit, OnDestroy {
  // Element to be dragged
  private _target: HTMLElement;

  // dialog container element to resize
  private _container: HTMLElement;

  // Drag handle
  private _handle: HTMLElement;
  private _delta = { x: 0, y: 0 };
  private _offset = { x: 0, y: 0 };

  private _destroy$ = new Subject<void>();

  private _isResized = false;

  constructor(
    private _elementRef: ElementRef,
    private _zone: NgZone,
    private _cd: ChangeDetectorRef,
  ) { }

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
        this._delta = { x: 0, y: 0 };
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


