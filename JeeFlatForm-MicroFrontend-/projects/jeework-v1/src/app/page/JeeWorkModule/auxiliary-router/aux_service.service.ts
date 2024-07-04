import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from 'src/app/modules/auth';
import { HttpUtilsService } from 'projects/jeechat/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeechat/src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
const KEY_SSO_TOKEN = 'sso_token';
@Injectable({
    providedIn: 'platform'
})
export class AUXService {

    constructor(private http: HttpClient, private cookieService: CookieService) { }

    baseUrl = environment.HOST_JEECHAT_API + '/api';
    public getAuthFromLocalStorage(): any {

        return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
    }
    Get_ItemChatForWork(IdChat) {
        const httpHeaders = this.getHttpHeaders();
        const url = this.baseUrl + `/chat/Get_ItemChatForWork?IdChat=${IdChat}`;
        return this.http.get<any>(url, { headers: httpHeaders });

    }
    GetInforUserChatWith(IdGroup: number) {
        const url = this.baseUrl + `/chat/GetInforUserChatWith?IdGroup=${IdGroup}`;
        const httpHeader = this.getHttpHeaders();
        return this.http.get<any>(url, { headers: httpHeader });
    }
    GetInforbyUserName(username: string) {
        const user = username.replace("\",\"", ";");
        const url = this.baseUrl + `/chat/GetnforUserByUserName?username=${username}`;
        const httpHeader = this.getHttpHeaders();
        return this.http.get<any>(url, { headers: httpHeader });
    }
    GetnforUserByUserNameForMobile(username: string) {
        const url = this.baseUrl + `/chat/GetnforUserByUserNameForMobile?username=${username}`;
        const httpHeader = this.getHttpHeaders();
        return this.http.get<any>(url, { headers: httpHeader });
    }
    CheckEnCodeInConversation(IdGroup: number) {
        const url = this.baseUrl + `/chat/CheckEnCodeInConversation?IdGroup=${IdGroup}`;
        const httpHeader = this.getHttpHeaders();
        return this.http.get<any>(url, { headers: httpHeader });
    }

    getToken() {
        const access_token = this.cookieService.get(KEY_SSO_TOKEN);
        // console.log("access_token", access_token)
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
    getHttpHeaders(): HttpHeaders {
        const access_token = this.getToken();
        let result = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access_token}`,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'TimeZone': (new Date()).getTimezoneOffset().toString()
        });
        return result;
    }
}
