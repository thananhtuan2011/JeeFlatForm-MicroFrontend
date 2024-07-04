import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'projects/jeework/src/environments/environment';
const KEY_SSO_TOKEN = 'sso_token';
const KEY_SSO_TOKEN_2 = 'sso_token_2';

@Injectable()
export class SocketioService {
  socket: any
  constructor(private cookieService: CookieService, private http: HttpClient) {
  }
  public getAuthFromLocalStorage(): any {

    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }
  getToken() {
    const access_token = this.cookieService.get(KEY_SSO_TOKEN) + this.cookieService.get(KEY_SSO_TOKEN_2);
    if (access_token) {
      return access_token
    }
    else {
      const dt = this.getAuthFromLocalStorage();
      const tokenlocal = dt.access_token;
      // console.log("tokenlocal", tokenlocal)
      return tokenlocal
    }

  }
  connect() {
    const auth = this.getToken();
    this.socket = io(environment.HOST_SOCKET + '/notification', {
      transportOptions: {
        polling: {
          extraHeaders: {
            "x-auth-token": `${auth ?? ''}`
          }
        }
      }
    });
    this.socket.on('reconnect_attempt', () => {
      const auth = this.getToken();
      this.socket.io.opts.transportOptions.polling.extraHeaders["x-auth-token"] = `${auth ?? ''}`
      this.socket.io.opts.transports = ['polling', 'websocket'];
    });
    this.socket.on('connect', (data) => {
    });

    this.socket.on('disconnect', (data) => {
      console.log('disconnected: ', data)
      if (data === 'io server disconnect') {
        const auth = this.getToken();
        this.socket.io.opts.transportOptions.polling.extraHeaders["x-auth-token"] = `${auth ?? ''}`
        this.socket.connect();
      }
    });

    const host = {
      portal: 'https://portal.jee.vn',
    }
    // Thiết lập iframe đến trang đăng ký
    const iframeSource = `${host.portal}/?getstatus=true`
    const iframe = document.createElement('iframe')
    iframe.setAttribute('src', iframeSource)
    iframe.style.display = 'none'
    document.body.appendChild(iframe)
  }


  ReadAll(): Observable<any> {
    const access_token = this.getToken();
    const httpHeader = new HttpHeaders({
      Authorization: access_token
    });
    let item = {};
    return this.http.post<any>(environment.HOST_NOTIFICATION + `/notification/readall`, item, { headers: httpHeader });
  }

  listen() {
    return new Observable((subscriber) => {
      this.socket.on('notification', (data) => {
        //console.log("Received message from Websocket Server", data)
        subscriber.next(data)
      })
    })
  }

  readNotification_menu(item): Observable<any> {
    const access_token = this.getToken();
    const httpHeader = new HttpHeaders({
      Authorization: access_token
    });
    return this.http.post<any>(environment.HOST_NOTIFICATION + '/notification/readnew', item, { headers: httpHeader });
  }
}
