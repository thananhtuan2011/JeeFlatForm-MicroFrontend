import { EventEmitter, HostListener, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as signalR from '@microsoft/signalr';

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';


import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
// const connection = new signalR.HubConnectionBuilder()
//   .withUrl(environment.hubUrl+'presence', {
//     skipNegotiation: true,
//     transport: signalR.HttpTransportType.WebSockets
//   })
//       .build()

@Injectable({
  providedIn: 'root'
})
export class NotifyDeskTopService {
  hubUrl = environment.hubUrldesktop+'/hubs';
   private hubConnection: HubConnection;
 
  public NotifyDesktop$ = new BehaviorSubject<any>(undefined);


  private readonly countMessage = new BehaviorSubject<boolean>(
		false
	);
	readonly countMessage$ = this.countMessage.asObservable();

	get data_share() {
		return this.countMessage.getValue();
	}
	set data_share(val) {
		this.countMessage.next(val);
	}
  public UpdateSLUnread$ = new BehaviorSubject<any>(undefined);
 

  public MessageClickNotify = new BehaviorSubject<any>(undefined);
  MessageClickNotify$ = this.MessageClickNotify.asObservable();


  constructor( private router: Router,

    ) {

    //   this.connectToken();
    //   connection.onclose(()=>{
    //     setTimeout(r=>{
    //       this.reconnectToken();
    //     },5000);
    //  })
    }




stopHubConnection() {
  this.hubConnection.stop().catch(error => console.log(error));
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
