import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatbotService {
  baseUrl = 'https://hischatbot.bt.vts-demo.com/api/his';
  constructor(private http: HttpClient,
    private auth: AuthService) { }
 
  getHttpHeaders() {
    const auth = this.auth.getAuthFromLocalStorage();
    let result = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + auth.access_token,
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
