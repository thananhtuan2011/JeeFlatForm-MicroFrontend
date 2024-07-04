import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { finalize, share, tap } from 'rxjs/operators';
import { ReturnFilterComment } from './jee-comment.model';
import * as signalR from '@microsoft/signalr';
import { environment } from 'projects/jeeteam/src/environments/environment';

const HUB_JEECOMMENT_URL = environment.HOST_JEECOMMENT_API + '/hub/commentv2';

@Injectable()
export class JeeCommentSignalrService {
  private hubConnection: HubConnection;
  public _showChange$: BehaviorSubject<ReturnFilterComment> = new BehaviorSubject<ReturnFilterComment>(new ReturnFilterComment());

  get showChange$() {
    return this._showChange$.asObservable();
  }
  constructor(private http: HttpClient) { }

  // connectToken(topicObjectID: string) {
  //   this.hubConnection = new HubConnectionBuilder()
  //     .withUrl(HUB_JEECOMMENT_URL, {
  //       skipNegotiation: true,
  //       transport: signalR.HttpTransportType.WebSockets,
  //     })
  //     .withAutomaticReconnect()
  //     .build();

  //   this.hubConnection
  //     .start()
  //     .then(() => {
  //       const data = this._authService.getAuthFromLocalStorage();
  //       const token = `${data.access_token}`;
  //       this.hubConnection.invoke('JoinGroup', topicObjectID, token);
  //       this.hubConnection.on('changeComment', (data: any) => {
  //         const result = JSON.parse(data);
  //         this._showChange$.next(result);
  //       });
  //     })
  //     .catch((err) => {
  //       console.log('error', err);
  //       this.hubConnection.stop();
  //     });
  // }
  public getAuthFromLocalStorage(): any {

    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }
  connectToken(topicObjectID: string) {

    const data = this.getAuthFromLocalStorage();

    this.hubConnection = new HubConnectionBuilder()

      .withUrl(HUB_JEECOMMENT_URL + '?token=' + data.access_token + '&topicid=' + topicObjectID, {

        // skipNegotiation: true,

        //  transport: signalR.HttpTransportType.WebSockets

      }).withAutomaticReconnect()

      .build()
    this.hubConnection.onclose((error) => {
      console.log("Ngắt kết nối ở comment")


    });
    this.hubConnection.start().catch(err => this.hubConnection.start());

    this.hubConnection.on('changeComment', (data: any) => {

      const result = JSON.parse(data);

      this._showChange$.next(result);

    });

  }
  CheckconnectComent() {
    // console.log("this.hubConnection.state preesen",this.hubConnection.state)
    if (this.hubConnection.state == 'Disconnected') {
      return false
    }
    else {
      return true;
    }
  }
  disconnectToken(topicObjectID: string) {

    const data = this.getAuthFromLocalStorage();
    const token = `${data.access_token}`;
    this.hubConnection.stop();
    // this.hubConnection.invoke('LeaveGroup', topicObjectID, token);
  }
  stopHubConnectionComment() {
    if (this.hubConnection) {
      this.hubConnection.stop().catch(error => console.log(error));

    }
  }
}
