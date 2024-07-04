
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';

import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'projects/jeesupport/src/environments/environment';
import { AuthService } from './auth.service';
import { TokenStorage } from './token-storage.service';
import { HttpUtilsService } from '../../modules/crud/utils/http-utils.service';
// import { AuthService } from '../auth/_services/auth.service';
// import { Member } from '../ChatAppModule/models/member';
// import { Message } from '../ChatAppModule/models/message';
// import { SeenMessModel } from '../ChatAppModule/models/SeenMess';

// const connection = new signalR.HubConnectionBuilder()
//   .withUrl(environment.hubUrl+'message', {
//     skipNegotiation: true,
//     transport: signalR.HttpTransportType.WebSockets
//   })
//   .build();

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.HOST_JEETICKET_API + '/api';
  hubUrl = environment.HOST_JEETICKET_API + '/hubs';
  private hubConnection: HubConnection;
  private messageThreadSource = new BehaviorSubject<any[]>([]);
  messageThread$ = this.messageThreadSource.asObservable();

  private seenMessageSource = new ReplaySubject<string>(1);
  seenMessage$ = this.seenMessageSource.asObservable();
  messageReceived: EventEmitter<any[]> = new EventEmitter<any[]>();
  // public messageReceived: EventEmitter<any>;///tin nhan ca nhan
  public MyChatHidden$ = new BehaviorSubject<any>(null);
  // public Newmessage = new BehaviorSubject<Message[]>([]);
  // Newmessage$ = this.Newmessage.asObservable();
  // // constructor(private http: HttpClient) { }


  private readonly Newmessage = new BehaviorSubject<any>(null);

  readonly Newmessage$ = this.Newmessage.asObservable();

  get data_share() {
    return this.Newmessage.getValue();
  }
  set data_share(val) {
    this.Newmessage.next(val);

  }
  // private hubConnection: HubConnection;
  private onlineUsersSource = new BehaviorSubject<any[]>([]);
  onlineUsers$ = this.onlineUsersSource.asObservable();

  private messageUsernameSource = new ReplaySubject<any>(1);
  messageUsername$ = this.messageUsernameSource.asObservable();


  public hidenmess = new BehaviorSubject<any>(undefined);
  hidenmess$ = this.hidenmess.asObservable();

  public reaction = new BehaviorSubject<any>(undefined);
  reaction$ = this.reaction.asObservable();

  public seenmess = new BehaviorSubject<any>(undefined);
  seenmess$ = this.seenmess.asObservable();





  public ComposingMess = new BehaviorSubject<any>(undefined);
  ComposingMess$ = this.ComposingMess.asObservable();


  public lasttimeMess = new BehaviorSubject<any>(undefined);
  lastimeMess$ = this.lasttimeMess.asObservable();
  constructor(
    private auth: AuthService,
    private storage:TokenStorage,
    private httpUtils: HttpUtilsService,
    private http: HttpClient,
  ) {

    //   connection.onclose(()=>{
    //     setTimeout(r=>{
    //       this.reconnectToken();
    //     },5000);
    //  })
}


  // connectToken(TicKetID) {
  //   const data = this.auth.getAuthFromLocalStorage();
  //   this.hubConnection = new HubConnectionBuilder()
  //     .withUrl(this.hubUrl + '/message?TicKetID=' + TicKetID + '&token=' +
  //       'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNTU1NjdiMzItZmMyNS00NzJmLWIzOGItN2ZlY2Y0YjVjMDk1IiwidXNlcklkIjoiNjE2MTE4NTVkMDU0OTQyMmM5MzFhNTQwIiwidXNlcm5hbWUiOiJkZW1vMS5hZG1pbiIsImN1c3RvbWRhdGEiOnsicGVyc29uYWxJbmZvIjp7IkJpcnRoZGF5IjoiMTQvMDQvMTk5NSIsIlBob25lbnVtYmVyIjoiMDkwNDcxMDE3MCIsIkZ1bGxuYW1lIjoiVHLhuqduIFbEg24gSHV5IiwiTmFtZSI6Ikh1eSIsIkF2YXRhciI6Imh0dHBzOi8vY2RuLmplZS52bi9qZWUtYWNjb3VudC8xMjMxNDkvaW1hZ2VzL2F2YXRhcnMvZGVtbzEuYWRtaW4ucG5nIiwiSm9idGl0bGVJRCI6IjIwIiwiSm9idGl0bGUiOiJQaMOzIEdpw6FtIMSQ4buRYyIsIkRlcGFydG1lbXQiOiJCYW4gR2nDoW0gxJDhu5FjIiwiRGVwYXJ0bWVtdElEIjoiMTMiLCJFbWFpbCI6Imh1eXR2QGRwcy5jb20udm4iLCJTdHJ1Y3R1cmVJRCI6IjMzIiwiU3RydWN0dXJlIjoiQmFuIEdpw6FtIMSQ4buRYyIsIkJnQ29sb3IiOiJyZ2IoMjQ4LCA0OCwgMTA5KSIsIkNodWN2dUlEIjoiMzMiLCJEaXJlY3RNYW5hZ2VyIjpudWxsfSwiamVlLWFjY291bnQiOnsiY3VzdG9tZXJJRCI6MTIzMTQ5LCJhcHBDb2RlIjpbIkxBTkRJTkciLCJTT0NJQUwiLCJBQ0NPVU5UIiwiSmVlSFIiLCJBRE1JTiIsIlJFUVVFU1QiLCJXT1JLIiwiV09SS0ZMT1ciLCJPRkZJQ0UiLCJET0MiLCJGTE9XIiwiSkVFQ0hBVCIsIk1FRVRJTkciLCJUSUNLRVQiLCJURUFNIiwiU1VQUE9SVCJdLCJ1c2VySUQiOjc5MjkyLCJzdGFmZklEIjoxN30sImlkZW50aXR5U2VydmVyIjp7ImFjdGlvbnMiOlsiY3JlYXRlX25ld191c2VyIiwidXBkYXRlX2N1c3RvbV9kYXRhIiwiY2hhbmdlX3VzZXJfc3RhdGUiXX0sImplZS1zb2NpYWwiOnsicm9sZXMiOiIxLDIsMyw0LDUifSwiamVlLW1lZXRpbmciOnsicm9sZXMiOiIxLDIifSwiamVlLWRvYyI6eyJpZCI6Mzg3LCJhY3Rpb25zIjpbInVwbG9hZF9kb2N1bWVudCIsInNlYXJjaF9kb2N1bWVudCJdfSwiamVlLWFkbWluIjp7InJvbGVzIjoiNCw1LDEwLDEyLDEzLDE0LDE1LDE2LDIwLDIyLDIzLDI1In0sImplZS1ociI6eyJyb2xlcyI6IjQwLDYxLDYxMiw2MTMsNjE0LDYxNSw2MTYsMzM4MCwyMSwzMSwzMywzNCwzNSwzNywzOCwzOSw0MCw2MSw2Myw2Niw2Nyw2OCw2OSw3MCwyMzgsMjM5LDI0MCwyNDIsMzE0LDMxNSwzMTYsMzE3LDMxOSwzMjUsMzI3LDMyOCwzMjksMzM0LDMzNSwzNDMsMzQ0LDM0NSwzNDYsMzQ3LDM0OSwzNTEsMzU1LDM1OSwzNjIsMzY1LDM2NiwzNjksMzcxLDM3NCwzNzYsMzgzLDM4NCwzODUsMzg2LDM4NywzODgsMzg5LDM5NiwzOTcsMzk4LDM5OSw0MDAsNDAxLDQzOCw1MDAsNTAxLDUwMiw1MDMsNTA4LDUwOSw1MTAsNTExLDUyNSw2MTAsNjEyLDYxMyw2MTQsNjE1LDYxNiw2MTgsNzA5LDgwMSw4MDIsODAzLDgwNCw4MDUsODA3LDgwOCw4MjIsODI0LDgzMSw4MzIsODM1LDgzNiw4MzgsODQwLDg0MSw4NDIsODQzLDg0NSwxMDAxLDEwMDIsMTAwMywzMTA1LDMxMDYsMzEwNywzMTA4LDMxMTIsMzExMywzMTE1LDMxMTgsMzEyMSwzMTI2LDMxMjcsMzEzMCwzMTMxLDMxMzIsMzEzMywzMTM0LDMxMzcsMzE0MSwzMTQzLDMxNDUsMzE0NywzMTQ5LDMxNTAsMzE1MSwzMTU0LDMxNTcsMzE2NSwzMTcxLDMxNzMsMzE3NCwzMTgzLDMyMDMsMzIwNCwzMjA1LDMyMTAsMzIxMSwzMjU0LDMyNTcsMzI1OSwzMjYwLDMyNjIsMzI2MywzMjY0LDMyNzAsMzI3MSwzMjcyLDMyOTYsMzI5NywzMjk4LDMzMTQsMzMzMCwzMzQ3LDMzNDgsMzM1MCwzMzU0LDMzNTUsMzM1NiwzMzU4LDMzNTksMzM2MCwzMzYxLDMzNjYsMzM2NywzMzY4LDMzNjksMzM3MCwzMzcyLDMzNzQsMzM3NSwzMzc4LDMzNzksMzM4MCwzMzgxLDMzODIsMzM4MywzMzg0LDMzODUsMzM4NiwzMzg3LDMzODgsMzM4OSwzMzkxLDMzOTIsMzM5MywzMzk0LDMzOTUsMzM5NywzMzk4LDMzOTksNDAwMCw0MDAxIn0sImplZS13b3JrIjp7IldlV29ya1JvbGVzIjoiMzQwMCwzNDAyLDM0MDMsMzUwMCwzNTAxLDM1MDIsMzUwMywzNjEwLDM3MDAsMzgwMCwzOTAwIn0sImplZS1yZXF1ZXN0Ijp7InJvbGVzIjoiMSwyLDQsNSJ9LCJqZWUtd29ya2Zsb3ciOnsicm9sZXMiOiIxLDIsMyw0LDUifSwiamVlLXRpY2tldCI6eyJyb2xlcyI6IjMsNCw3LDgsOSwxMCwxMSwxMiwxMywxNCwxNSJ9LCJqZWUtdGVhbSI6eyJyb2xlcyI6IjEsMiJ9fSwiaWF0IjoxNjYxOTE4MDk2LCJleHAiOjE2NjE5MTgzOTZ9.W2JHikFsuwLjxtvZZp3zX_sWlGxsa8PEiaLg7ybRT3c'
  //       , {
  //       }).withAutomaticReconnect()
  //     .build()

  //   this.hubConnection.start().catch(err => console.log(err));


  connectToken(TicKetID, CustomerID) {
    const data = this.auth.getAuthFromLocalStorage();
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + '/message?TicKetID=' + TicKetID + '&CustomerID='+CustomerID
        , {
        }).withAutomaticReconnect()
      .build()

    this.hubConnection.start().catch(err => console.log(err));

    //     const data=this.auth.getAuthFromLocalStorage();

    //        var _token =`Bearer ${data.access_token}`
    //        localStorage.setItem('chatGroup', JSON.stringify(TicKetID));
    // const chatgroup=localStorage.getItem('chatGroup');
    //  this.hubConnection .invoke("onConnectedTokenAsync", _token,Number.parseInt(chatgroup));
    //  const chatgroup=localStorage.getItem('chatGroup');
    //  this.hubConnection .invoke("onConnectedTokenAsync", _token,Number.parseInt(chatgroup));
    // if(TicKetID)
    // {
    //   this.hubConnection .invoke("onConnectedTokenAsync", _token,TicKetID);
    // }
    // else
    // {
    //   const chatgroup=localStorage.getItem('chatGroup');
    //   this.hubConnection .invoke("onConnectedTokenAsync", _token,chatgroup);
    // }




    // load mess khi
    this.hubConnection.on('ReceiveMessageThread', messages => {
      console.log('ReceiveMessageThread', messages)
      const reversed = messages.reverse();
      this.messageThreadSource.next(reversed);
    })

    // this.hubConnection.on('SeenMessageReceived', username => {
//   this.seenMessageSource.next(username);
    // })
    this.hubConnection.on('HidenMessage', data => {
      this.hidenmess.next(data);
    })
    this.hubConnection.on('ReactionMessage', data => {
      this.reaction.next(data);
    })

    this.hubConnection.on('SeenMessage', data => {
      this.seenmess.next(data);
    })
    this.hubConnection.on('Composing', data => {
      // console.log('Composing',data)
      this.ComposingMess.next(data);
    })

    this.hubConnection.on('LastTimeMessage', data => {
      // console.log('LastTimeMessageTTTTTTTTTTTTT',data)
      this.lasttimeMess.next(data);
    })
    this.hubConnection.on('NewMessage', message => {
      //
      console.log('mesenger', message)
      this.messageThread$.pipe(take(1)).subscribe(messages => {
       
        this.messageThreadSource.next([...messages, message[0]])
        this.data_share = message;
      })
    })




  }




  stopHubConnection() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch();
    }

  }


  reconnectToken(): void {
    var _token = '', _idUser = "0";
    const data = this.auth.getAuthFromLocalStorage();
    let infoTokenCon = { "Token": _token, "UserID": _idUser };
    this.hubConnection.start().then((data: any) => {
      console.log('Connect with ID', data);
      this.hubConnection.invoke("ReconnectToken", JSON.stringify(infoTokenCon)).then(() => {
      });
    }).catch((error: any) => {
      console.log('Could not ReconnectToken! ', error);
    });
    ///  console.log('Connect with ID',this.proxy.id);
  }



  async sendMessage(token: string, item: any, TicKetID: number) {
    return this.hubConnection.invoke('SendMessage', token, item, TicKetID)
      .catch(error => console.log(error));
  }
  async sendMessageThirdPartyApp(item:any,TicKetID:number){
    return  this.hubConnection.invoke('SendMessageThirdPartyApp',item,TicKetID)
      .catch(error => console.log(error));
  }
  async sendCallVideo(isGroup: boolean, statuscode: string, TicKetID: number, usernmae: string, fullname: string, img: string, bg: string, keyid: string) {
    return this.hubConnection.invoke('CallVideo', isGroup, statuscode, TicKetID, usernmae, fullname, img, bg, keyid)
      .catch(error => console.log(error));
  }

  async HidenMessage(token: string, IdChat: number, TicKetID: number) {
    return this.hubConnection.invoke('DeleteMessage', token, IdChat, TicKetID)
      .catch(error => console.log(error));
  }
  async Composing(token: string, TicKetID: number) {
    return this.hubConnection.invoke('ComposingMessage', token, TicKetID)
      .catch(error => console.log(error));
  }
  async ReactionMessage(token: string, TicKetID: number, idchat: number, type) {
    return this.hubConnection.invoke('ReactionMessage', token, TicKetID, idchat, type)
      .catch(error => console.log(error));
  }
  // async  SeenMessage(item:SeenMessModel){
  //   return  this.hubConnection.invoke('SeenMessage',item)
  //     .catch(error => console.log(error));
  // }


  // async seenMessage(recipientUsername: string){
  //   return this.hubConnection.invoke('SeenMessage', recipientUsername)
  //     .catch(error => console.log(error));
  // }
  getHttpHeaderFiles() {

    const token = this.httpUtils.getToken()
    let result = new HttpHeaders({
      'Authorization':'Bearer '+token,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return result;
  }
  UploadfileLage2(item:any,idTicket:number)
  {
    const url =this.baseUrl+`/TicketDocumentManagement/UploadfileLage2?idTicket=${idTicket}`
    const httpHeader = this.getHttpHeaderFiles();
    return this.http.post(url,item,{reportProgress: true, observe: 'events',headers: httpHeader});
  }
}