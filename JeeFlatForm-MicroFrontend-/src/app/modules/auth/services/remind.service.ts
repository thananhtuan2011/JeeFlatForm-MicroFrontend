import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';

import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from 'src/environments/environment';

@Injectable()
export class RemindService {
  hubUrl = environment.HOST_JEELANDINGPAGE_API + '/hubs';
  username: string;
  private hubConnection: HubConnection;
  public NewMess$ = new BehaviorSubject<any>(1);

  constructor(
    private auth: AuthService,
    private http: HttpClient,
  ) {
  }

  // connectToken() {
  //     this.hubConnection = new HubConnectionBuilder()
  //         .withUrl(this.hubUrl + '/remind', {
  //             skipNegotiation: true,
  //             transport: signalR.HttpTransportType.WebSockets
  //         }).withAutomaticReconnect()
  //         .build();

  //     this.hubConnection.start().then(() => {

  //         const data = this.auth.getAuthFromLocalStorage();

  //         var _token = `Bearer ${data.access_token}`;
  //         this.username = data['user']['username'];
  //         this.hubConnection.invoke('onConnectedTokenAsync', _token, this.username, environment.APPCODE);

  //         this.hubConnection.on('NewMessageReceived', (data: any) => {
  //             this.NewMess$.next(data);
  //         });


  //     }).catch(err => {
  //     });

  // }


  connectToken(usename: string, appcode: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + `/remind?username=${usename}&appcode=${appcode}`, {
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      }).withAutomaticReconnect()
      .build()

    this.hubConnection.start().then(() => {

      this.hubConnection.on('NewMessageReceived', (data: any) => {
        this.NewMess$.next(data)
      })

    }).catch(err => {
    });
  }
  disconnectToken() {
    this.hubConnection.stop().catch(error => console.log(error))
  }
}
