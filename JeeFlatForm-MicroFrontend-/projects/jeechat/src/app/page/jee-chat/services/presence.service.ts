import { EventEmitter, HostListener, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';

import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConversationModel } from '../models/conversation';
import { environment } from 'projects/jeechat/src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { HttpUtilsService } from 'projects/jeechat/src/modules/crud/utils/http-utils.service';
// const connection = new signalR.HubConnectionBuilder()
//   .withUrl(environment.hubUrl+'presence', {
//     skipNegotiation: true,
//     transport: signalR.HttpTransportType.WebSockets
//   })
//       .build()
@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  hubUrl = environment.HOST_JEECHAT_API + '/hubs';
  private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<any[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();
  // public CallvideoMess = new BehaviorSubject<any>(undefined);
  // CallvideoMess$ = this.CallvideoMess.asObservable();

  public CallvideoMess = new Subject<any>();

  private readonly NewReactionMess = new BehaviorSubject<any>(
    false
  );
  private readonly CallOrther = new BehaviorSubject<any>(
    false
  );
  readonly CallOrther$ = this.CallOrther.asObservable();

  get data_shareCallOrther() {
    return this.CallOrther.getValue();
  }
  set data_shareCallOrther(val) {
    this.CallOrther.next(val);
  }



  readonly NewReactionMess$ = this.NewReactionMess.asObservable();

  get data_shareNewReactionMess() {
    return this.CallOrther.getValue();
  }
  set data_shareNewReactionMess(val) {
    this.NewReactionMess.next(val);
  }



  private _recordingTime = new Subject<string>();
  public NotifyDesktop = new BehaviorSubject<any>(undefined);
  NotifyDesktop$ = this.NotifyDesktop.asObservable();


  public ClosevideoMess = new BehaviorSubject<any>(undefined);
  ClosevideoMess$ = this.ClosevideoMess.asObservable();

  private offlineUsersSource = new BehaviorSubject<any>(null);
  offlineUsers$ = this.offlineUsersSource.asObservable();

  private NewGroupSource = new BehaviorSubject<any>(null);
  NewGroupSource$ = this.NewGroupSource.asObservable();
  // store checkk conect đang kết nối ở preseen 
  private readonly StoreCheckConnect = new BehaviorSubject<any>(
    false
  );
  readonly StoreCheckConnect$ = this.StoreCheckConnect.asObservable();

  get data_StoreCheckConnec() {
    return this.StoreCheckConnect.getValue();
  }
  set data_StoreCheckConnec(val) {
    this.StoreCheckConnect.next(val);
  }
  // private OpenmessageUsernameSource = new ReplaySubject<any>(1);
  // OpenmessageUsername$ = this.OpenmessageUsernameSource.asObservable();
  public OpenmessageUsernameSource = new Subject<any>();
  constructor(private router: Router,
    private cookieService: CookieService,
    private httpUtils: HttpUtilsService
  ) {


  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
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

  connectToken() {
    const token = this.httpUtils.getToken();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + '/presence?token=' + token, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets

      }).withAutomaticReconnect()
      // .configureLogging(LogLevel.Information)
      .build()

    this.hubConnection.start().catch(err => this.hubConnection.start());
    this.hubConnection.serverTimeoutInMilliseconds = 1000 * 60 * 60 * 4;
    this.hubConnection.keepAliveIntervalInMilliseconds = 1000 * 60 * 60 * 2;
    this.hubConnection.onreconnected(() => {
      // nhận sự kiện khi reconnect thành công
      this.data_StoreCheckConnec = "onreconnected"

    })


    this.hubConnection.onclose((error) => {
      console.log("Ngắt kết nối ở pressen")
      // this.reconnectToken()


    });

    // const data=this.auth.getAuthFromLocalStorage();

    //    var _token =`Bearer ${data.access_token}`

    //    this.hubConnection.invoke("onConnectedTokenAsync",_token);

    this.hubConnection.on('UserIsOnline', (username: any) => {

      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        this.onlineUsersSource.next([...usernames, username])
        // console.log('UserIsOnline',this.onlineUsers$)

      })
      // this.toastr.info(username.FullName+' has connect')
      // this.toastr.info(username.displayName+ ' has connect')
    })

    this.hubConnection.on('UserIsOffline', (User: any) => {
      this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
        if (User && usernames) {


          this.onlineUsersSource.next(usernames.filter(x => x.Username != User.Username))
          this.offlineUsersSource.next(User);
        }

        // this.onlineUsersSource.next([...usernames, User])

        // console.log('UserIsOffline',this.onlineUsers$)
      })
    })
    this.hubConnection.on('GetOnlineUsers', (usernames: any[]) => {
      this.onlineUsersSource.next(usernames);
    })
    this.hubConnection.on('CallVideoMessage', data => {
      const event = new CustomEvent('call', { detail: data });
      dispatchEvent(event)
    })
    this.hubConnection.on('CallingOrther', data => {
      this.data_shareCallOrther = (data);
    })

    this.hubConnection.on('CloseCallVideoMesage', data => {
      const event = new CustomEvent('close', { detail: data });
      dispatchEvent(event)
      this.ClosevideoMess.next(data);
    })
    this.hubConnection.on('NotifyDeskTop', data => {
      // console.log('Composing',data)
      this.NotifyDesktop.next(data);
    })
    this.hubConnection.on('NewGroupChatReceived', data => {
      // console.log('NewGroupChatReceived',data)
      this.NewGroupSource.next(data);
    })
    this.hubConnection.on('NewMessageReceived', (res: any) => {
      this.OpenmessageUsernameSource.next(res)
    })
    this.hubConnection.on('NewReactionMessage', (res: any) => {
      this.data_shareNewReactionMess = res
    })






  }

  CheckconnectPress() {
    // console.log("this.hubConnection.state preesen",this.hubConnection.state)
    if (this.hubConnection.state == 'Disconnected') {
      return false
    }
    else {
      return true;
    }
  }
  async TimeCallVideo(idgroup: any) {
    return this.hubConnection.invoke('TimeCallVideo', idgroup)
      .catch(error => console.log(error));
  }

  async CloseCallVideo(idGroup: number, username: string) {
    const token = this.httpUtils.getToken();
    return this.hubConnection.invoke('CloseCallVideo', idGroup, username, token)
      .catch(error => console.log(error));
  }
  async CallingOrther(idGroup: number, username: string) {
    const token = this.httpUtils.getToken();
    return this.hubConnection.invoke('CallingOrther', idGroup, username, token)
      .catch(error => console.log(error));
  }
  async NewGroup(token: string, item: ConversationModel, dl: any) {
    return this.hubConnection.invoke('NewGroupChat', token, item, dl)
      .catch(error => console.log(error));
  }



  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch(error => console.log(error));

    }
  }

  reconnectToken() {

    this.hubConnection.start().catch(err => console.log(err));

  }

  // //endpoints.MapHub<PresenceHub>("hubs/presence") at startup file of backend
  // createHubConnection(user: User) {
  //   debugger
  //   // đây là nơi nó call đến BE
  //   this.hubConnection = new HubConnectionBuilder()
  //     .withUrl(this.hubUrl + 'presence', {
  //       accessTokenFactory: () => user.access_token
  //     })
  //     .withAutomaticReconnect()
  //     .build()

  //   this.hubConnection
  //     .start()
  //     .catch(error => console.log(error));

  //   this.hubConnection.on('UserIsOnline', (username: Member) => {
  //     this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
  //       this.onlineUsersSource.next([...usernames, username])
  //     })
  //     this.toastr.info(' has connect')
  //     // this.toastr.info(username.displayName+ ' has connect')
  //   })

  //   this.hubConnection.on('UserIsOffline', (username: Member) => {
  //     this.onlineUsers$.pipe(take(1)).subscribe(usernames => {
  //       this.onlineUsersSource.next([...usernames.filter(x => x.userName !== username.userName)])
  //     })
  //     this.toastr.warning( ' disconnect')
  //   })

  //   this.hubConnection.on('GetOnlineUsers', (usernames: Member[]) => {
  //     this.onlineUsersSource.next(usernames);
  //   })

  //   // this.hubConnection.on('NewMessageReceived', ({username, diplayName}) => {
  //   //   this.toastr.info(diplayName + ' has sent you a new message!')
  //   // })

  //   this.hubConnection.on('NewMessageReceived', (username: Member) => {
  //     this.messageUsernameSource.next(username)
  //   })
  // }


}
