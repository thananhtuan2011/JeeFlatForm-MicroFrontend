import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

import { BehaviorSubject, Observable, ReplaySubject, Subject, timer } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { Message } from '../models/message';
import { Member } from '../models/member';
import { SeenMessModel } from '../models/SeenMess';
import { HttpUtilsService } from 'projects/jeechat/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeechat/src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.HOST_JEECHAT_API + '/api';
  hubUrl = environment.HOST_JEECHAT_API + '/hubs';
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<Message[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();
  public UpdateEvent$ = new BehaviorSubject<any>(undefined);


  private readonly countMessage = new BehaviorSubject<any>(
    false
  );
  readonly countMessage$ = this.countMessage.asObservable();

  get data_share() {
    return this.countMessage.getValue();
  }
  set data_share(val) {
    this.countMessage.next(val);
  }

  private seenMessageSource = new ReplaySubject<string>(1);
  seenMessage$ = this.seenMessageSource.asObservable();
  messageReceived: EventEmitter<Message[]> = new EventEmitter<Message[]>();
  // public messageReceived: EventEmitter<any>;///tin nhan ca nhan
  public MyChatHidden$ = new BehaviorSubject<any>(null);
  public Newmessage = new BehaviorSubject<any[]>([]);
  Newmessage$ = this.Newmessage.asObservable();
  // // constructor(private http: HttpClient) { }

  private readonly InsertJob = new BehaviorSubject<any>(
    null
  );
  readonly InsertJob$ = this.InsertJob.asObservable();

  get data_share_InsertJob() {
    return this.InsertJob.getValue();
  }
  set data_share_InsertJob(val) {
    this.InsertJob.next(val);
  }

  private readonly Vote = new BehaviorSubject<any>(
    false
  );
  readonly Vote$ = this.Vote.asObservable();

  get data_shareVote() {
    return this.Vote.getValue();
  }
  set data_shareVote(val) {
    this.Vote.next(val);
  }
  private readonly StoreCheckConnect = new BehaviorSubject<any>(
    false
  );
  readonly StoreCheckConnect$ = this.StoreCheckConnect.asObservable();

  get data_StoreCheckConnect() {
    return this.StoreCheckConnect.getValue();
  }
  set data_StoreCheckConnect(val) {
    this.StoreCheckConnect.next(val);
  }

  // private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<Member[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  private messageUsernameSource = new ReplaySubject<Member>(1);
  messageUsername$ = this.messageUsernameSource.asObservable();


  public hidenmess = new BehaviorSubject<any>(undefined);
  hidenmess$ = this.hidenmess.asObservable();


  public uploadfile = new BehaviorSubject<any>(undefined);
  uploadfile$ = this.uploadfile.asObservable();
  public reaction = new BehaviorSubject<any>(undefined);
  reaction$ = this.reaction.asObservable();

  public seenmess = new BehaviorSubject<any>(undefined);
  seenmess$ = this.seenmess.asObservable();





  public ComposingMess = new Subject<Observable<any>>()
  public lasttimeMess = new BehaviorSubject<any>(undefined);
  lastimeMess$ = this.lasttimeMess.asObservable();
  constructor(
    private httpUtils: HttpUtilsService

  ) {

  }


  connectToken(idgroup) {
    // this.stopHubConnectionChat();
    const token = this.httpUtils.getToken();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + '/message?IdGroup=' + idgroup + '&token=' + token
        , {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets
        }).withAutomaticReconnect()
      .build()

    this.hubConnection.start().catch(err => this.hubConnection.start());
    this.hubConnection.serverTimeoutInMilliseconds = 1000 * 60 * 60 * 4;
    this.hubConnection.keepAliveIntervalInMilliseconds = 1000 * 60 * 60 * 2;
    this.hubConnection.onreconnecting(() => {

      this.data_StoreCheckConnect = "onreconnecting"
    })

    this.hubConnection.onreconnected(() => {
      // nhận sự kiện khi reconnect thành công
      this.data_StoreCheckConnect = "onreconnected"

    })
    this.hubConnection.onclose((error) => {
      const id = localStorage.getItem('chatGroup');
      console.log("ngắt kết nối chat messge")
      // if(id!="0"&& this.hubConnection["_connectionState"]=="Disconnected")
      // {
      //   this.reconnectToken(id)

      // }

    });


    //     const data=this.auth.getAuthFromLocalStorage();

    //        var _token =`Bearer ${data.access_token}`
    //        localStorage.setItem('chatGroup', JSON.stringify(idgroup));
    // const chatgroup=localStorage.getItem('chatGroup');
    //  this.hubConnection .invoke("onConnectedTokenAsync", _token,Number.parseInt(chatgroup));
    //  const chatgroup=localStorage.getItem('chatGroup');
    //  this.hubConnection .invoke("onConnectedTokenAsync", _token,Number.parseInt(chatgroup));
    // if(idGroup)
    // {
    //   this.hubConnection .invoke("onConnectedTokenAsync", _token,idGroup);
    // }
    // else
    // {
    //   const chatgroup=localStorage.getItem('chatGroup');
    //   this.hubConnection .invoke("onConnectedTokenAsync", _token,chatgroup);
    // }




    // load mess khi
    this.hubConnection.on('ReceiveMessageThread', messages => {
      // console.log('ReceiveMessageThread',messages)
      const reversed = messages.reverse();
      this.messageThreadSource.next(reversed);
    })

    // this.hubConnection.on('SeenMessageReceived', username => {
    //   this.seenMessageSource.next(username);
    // })
    this.hubConnection.on('InsertJob', data => {
      this.data_share_InsertJob = data;
    })
    this.hubConnection.on('HidenMessage', data => {
      this.hidenmess.next(data);
    })
    this.hubConnection.on('UpdateFile', data => {
      this.uploadfile.next(data);
    })
    this.hubConnection.on('ReactionMessage', data => {
      this.reaction.next(data);
    })
    this.hubConnection.on('checkConnect', data => {
    })

    this.hubConnection.on('VoteMesage', (data: any[]) => {
      this.data_shareVote = data
    })
    this.hubConnection.on('SeenMessage', data => {
      this.seenmess.next(data);
    })
    this.hubConnection.on('Composing', data => {
      const subject = timer(1000).pipe(map(x => data));
      this.ComposingMess.next(subject)
    })

    this.hubConnection.on('LastTimeMessage', data => {
      this.lasttimeMess.next(data);
    })
    this.hubConnection.on('NewMessage', message => {
      this.Newmessage.next(message)
      this.messageThread$.pipe(take(1)).subscribe(messages => {
        this.messageThreadSource.next([...messages, message[0]])

      })
    })




  }




  stopHubConnection() {

    this.hubConnection.stop().catch(error => console.log(error));
  }
  stopHubConnectionChat() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch();

    }
  }

  reconnectToken(id) {

    localStorage.setItem('ReconnectId', id)


  }
  Resend() {

    if (this.hubConnection) {

      if (this.hubConnection.state == 'Disconnected') {
        return false
      }
      else {
        this.hubConnection.start().catch(err => this.hubConnection.start());
        return true;
      }
    }
    else {
      return false;
    }

  }

  ReconnectChat() {
    this.hubConnection.start().catch(err => this.hubConnection.start());
  }
  CheckconnectMess() {

    if (this.hubConnection) {
      if (this.hubConnection.state == 'Disconnected') {
        return false
      }
      else {
        return true;
      }
    }
    else {
      return true;
    }

  }

  async CheckConnect(IdGroup: number) {
    const token = this.httpUtils.getToken();
    return this.hubConnection.invoke('CheckConnect', token, IdGroup);
  }

  async UpdateVote(id_chat: any, id_group: any, idvote: any, key: any, username: any, avatar: any, fullname: any) {
    const token = this.httpUtils.getToken();
    return this.hubConnection.invoke('UpdateVote', id_chat, id_group, token, idvote, key, username, avatar, fullname)
      .catch(error => console.log(error));
  }


  async sendMessage(token: string, item: any, IdGroup: number) {
    return this.hubConnection.invoke('SendMessage', token, item, IdGroup);
    //.catch(error => console.log(error),console.log(error));
    //.catch(error => error?error: console.log(error));
  }
  async sendMessageFile(token: string, item: any, IdGroup: number) {
    return this.hubConnection.invoke('SendMessageFile', token, item, IdGroup);
    //.catch(error => console.log(error),console.log(error));
    //.catch(error => error?error: console.log(error));
  }
  async sendCallVideo(isGroup: boolean, statuscode: string, IdGroup: number, usernmae: string, fullname: string, img: string, bg: string, keyid: string) {
    const token = this.httpUtils.getToken();
    return this.hubConnection.invoke('CallVideo', isGroup, statuscode, IdGroup, usernmae, fullname, img, bg, keyid, token)
      .catch(error => console.log(error));
  }

  async HidenMessage(token: string, IdChat: number, IdGroup: number) {
    return this.hubConnection.invoke('DeleteMessage', token, IdChat, IdGroup)
      .catch(error => console.log(error));
  }
  async Composing(token: string, IdGroup: number) {
    return this.hubConnection.invoke('ComposingMessage', token, IdGroup)
      .catch(error => console.log(error));
  }
  async ReactionMessage(token: string, IdGroup: number, idchat: number, type, isnotify, contentchat, usernamereceivers) {
    return this.hubConnection.invoke('ReactionMessage', token, IdGroup, idchat, type, isnotify, contentchat, usernamereceivers)
      .catch(error => console.log(error));
  }
  async SeenMessage(item: SeenMessModel) {
    return this.hubConnection.invoke('SeenMessage', item)
      .catch();
  }


  // async seenMessage(recipientUsername: string){
  //   return this.hubConnection.invoke('SeenMessage', recipientUsername)
  //     .catch(error => console.log(error));
  // }
}
