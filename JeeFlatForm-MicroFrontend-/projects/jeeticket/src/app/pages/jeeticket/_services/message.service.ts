import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { BehaviorSubject, Observable, ReplaySubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { environment } from 'projects/jeeticket/src/environments/environment';
import { AuthService } from './auth.service';
import { TokenStorage } from './token-storage.service';
import { HttpUtilsService } from '../../../modules/crud/utils/http-utils.service';
import { SeenMessModel } from '../_models/ticket-management.model';
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

  baseUrl = environment.HOST_JEETICKET_API+'/api';
  hubUrl = environment.HOST_JEETICKET_API+'/hubs';
  baseUrlChat = 'https://jeechat-api.jee.vn'+'/api';

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


  public Newmessage = new ReplaySubject<any>(null);
	Newmessage$ = this.Newmessage.asObservable();

	get data_share() {
		//return this.Newmessage.getValue();
    return "";
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

  public uploadfile = new BehaviorSubject<any>(undefined);
  uploadfile$ = this.uploadfile.asObservable();



  constructor(
    private auth:AuthService,
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


  async connectToken(TicKetID){
    const data=await this.storage.getAuthFromLocalStorage().toPromise();
    const obj = JSON.parse(data)
    this.hubConnection = new HubConnectionBuilder()
    .withUrl(this.hubUrl+'/message?TicKetID='+TicKetID+'&token='+obj.access_token
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
            this.hubConnection.on('UpdateFile', data => {

              this.uploadfile.next(data);
            })
            this.hubConnection.on('LastTimeMessage', data => {
              // console.log('LastTimeMessageTTTTTTTTTTTTT',data)
              this.lasttimeMess.next(data);
            })
            this.hubConnection.on('NewMessage', message => {

              //this.Newmessage.next(undefined);
              this.Newmessage.next(message);
              console.log('NewMessage')
              this.messageThread$.pipe(take(1)).subscribe(messages => {
                  console.log('mesenger',message)
                this.messageThreadSource.next([...messages, message[0]])
                this.data_share=message;



              })
            })




}

stopHubConnectionChat() {
  if(this.hubConnection)
  {
    this.hubConnection.stop().catch();
  }

}


stopHubConnection() {
  try
  {
     this.hubConnection.stop().catch();

  }
  catch
  {

  }

}


reconnectToken(): void {
  var _token = '',_idUser="0";
  const data=this.auth.getAuthFromLocalStorage();
  let infoTokenCon = { "Token": _token,"UserID":_idUser};
  this.hubConnection .start().then((data: any) => {
      console.log('Connect with ID',data);
      this.hubConnection .invoke("ReconnectToken", JSON.stringify(infoTokenCon)).then(()=>{
      });
    }).catch((error: any) => {
     console.log('Could not ReconnectToken! ',error);
    });
 ///  console.log('Connect with ID',this.proxy.id);
  }



  async sendMessage(token:string,item:any,TicKetID:number, ){

    return  this.hubConnection.invoke('SendMessage',token,item,TicKetID)
      .catch(error => console.log(error));
  }
  async sendCallVideo(isGroup:boolean,statuscode:string,TicKetID:number,usernmae:string,fullname:string,img :string,bg:string,keyid:string){
    return  this.hubConnection.invoke('CallVideo',isGroup,statuscode,TicKetID,usernmae,fullname,img,bg,keyid)
      .catch(error => console.log(error));
  }

  async HidenMessage(token:string,IdChat:number,TicKetID:number){
    return  this.hubConnection.invoke('DeleteMessage',token,IdChat,TicKetID)
      .catch(error => console.log(error));
  }
  async  Composing(token:string,TicKetID:number){
    return  this.hubConnection.invoke('ComposingMessage',token,TicKetID)
      .catch(error => console.log(error));
  }
  async  ReactionMessage(token:string,TicKetID:number,idchat:number,type){
    return  this.hubConnection.invoke('ReactionMessage',token,TicKetID,idchat,type)
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
  async SeenMessage(item: SeenMessModel) {
    return this.hubConnection.invoke('SeenMessage', item)
      .catch();
  }

  getHttpHeaderFiles() {

    const token = this.httpUtils.getToken()
    let result = new HttpHeaders({
      'Authorization':'Bearer '+token,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return result;
  }
  
  getHttpHeaders() {

    const token = this.httpUtils.getToken()

    // console.log('auth.token',auth.access_token)
    let result = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':'Bearer '+token,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return result;
  }

  UploadfileLage(item:any,idTicket:number,IdMessate:number)
  {
    const url =this.baseUrl+`/TicketDocumentManagement/UploadfileLage?idTicket=${idTicket}&idMessage=${IdMessate}`
    const httpHeader = this.getHttpHeaderFiles();
    return this.http.post(url,item,{reportProgress: true, observe: 'events',headers: httpHeader});
  }
  UploadfileLage2(item:any,idTicket:number)
  {
    const url =this.baseUrl+`/TicketDocumentManagement/UploadfileLage2?idTicket=${idTicket}`
    const httpHeader = this.getHttpHeaderFiles();
    return this.http.post(url,item,{reportProgress: true, observe: 'events',headers: httpHeader});
  }
  upload_img(item:any)
  {
    const url =this.baseUrl+`/general/upload-img`
    const httpHeader = this.getHttpHeaders();
    return this.http.post(url,item,{headers: httpHeader});
  }
  ActionSticker(GrSticker:any,keyaction:string)
  {
    const url =this.baseUrl+`/chat/ActionSticker?GrSticker=${GrSticker}&keyaction=${keyaction}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null,{ headers: httpHeader});
  }
  GetStoreSticker() {
    const httpHeaders = this.getHttpHeaders();
    const url =this.baseUrlChat+`/chat/GetStoreSticker`;
		return this.http.get<any>(url,{ headers: httpHeaders });

	}

  QuanLyStoreSticker() {
    const httpHeaders = this.getHttpHeaders();
    const url =this.baseUrlChat+`/chat/QuanLyStoreSticker`;
		return this.http.get<any>(url,{ headers: httpHeaders });

	}

  GetminilistSticker() {
    const httpHeaders = this.getHttpHeaders();
    const url =this.baseUrlChat+`/chat/GetminilistSticker`;
		return this.http.get<any>(url,{ headers: httpHeaders });

	}
  GetSticker(GrSticker:any)
  {
    const url =this.baseUrl+`/chat/GetSticker?GrSticker=${GrSticker}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }

}
