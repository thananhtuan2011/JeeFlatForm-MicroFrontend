import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  baseUrl = environment.HOST_JEECHATBOT_API + '/api/his';
  constructor(private http: HttpClient) { }
  public getAuthFromLocalStorage(): any {

    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }
  getHttpHeaders() {

    const data = this.getAuthFromLocalStorage();
    // console.log('auth.token',auth.access_token)
    let result = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + data.access_token,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return result;
  }
  AddHis(item: any) {
    const url = this.baseUrl + `/AddHis`;
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url, item, { headers: httpHeader });
  }
}
