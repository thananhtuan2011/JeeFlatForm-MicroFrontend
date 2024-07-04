import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'projects/jeechat/src/environments/environment';
import { HttpUtilsService } from 'projects/jeechat/src/modules/crud/utils/http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {
  baseUrl = environment.HOST_JEECHAT_API + '/api/conversation';
  public refreshConversation = new BehaviorSubject<any>(null);
  RefreshConversation$ = this.refreshConversation.asObservable();
  private readonly SearchTabChat = new BehaviorSubject<any>(null);

  readonly SearchTabChat$ = this.SearchTabChat.asObservable();

  get data_share() {
    return this.SearchTabChat.getValue();
  }
  set data_share(val) {
    this.SearchTabChat.next(val);

  }

  private readonly countMessage = new BehaviorSubject<boolean>(
    false
  );
  readonly countMessage$ = this.countMessage.asObservable();

  get data_share_countmenu() {
    return this.countMessage.getValue();
  }
  set data_share_countmenu(val) {
    this.countMessage.next(val);
  }
  public draftMessage$ = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }


  public getAuthFromLocalStorage(): any {

    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }
  getHttpHeaders() {
    const token = this.httpUtils.getToken()

    // console.log('auth.token',auth.access_token)
    let result = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return result;
  }
  GetDanhBaNotConversation() {
    const url = this.baseUrl + '/Get_DanhBa_NotConversation'
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url, { headers: httpHeader });
  }

  EditNameGroup(IdGroup: number, grname: string) {
    const url = this.baseUrl + `/UpdateGroupName?IdGroup=${IdGroup}&nameGroup=${grname}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }

  DeleteThanhVienInGroup(IdGroup: number, IdUser: number) {
    const url = this.baseUrl + `/DeleteThanhVienInGroup?IdGroup=${IdGroup}&UserId=${IdUser}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }

  UpdateAdmin(IdGroup: number, IdUser: number, key: number) {
    const url = this.baseUrl + `/UpdateAdminGroup?IdGroup=${IdGroup}&UserId=${IdUser}&key=${key}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }
  GetThanhVienGroup(IdGroup: number) {
    const url = this.baseUrl + `/GetThanhVienGroup?IdGroup=${IdGroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url, { headers: httpHeader });
  }
  CreateConversation(item: any) {
    const url = this.baseUrl + '/CreateConversation'
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url, item, { headers: httpHeader });
  }
  InsertThanhVien(IdGroup: number, item: any) {
    const url = this.baseUrl + `/InsertThanhVienInGroup?IdGroup=${IdGroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url, item, { headers: httpHeader });
  }

  DeleteConversation(item: any) {
    const url = this.baseUrl + `/DeleteConverSation?IdGroup=${item}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url, item, { headers: httpHeader });
  }
  getAllUsers(): any {
    const url = this.baseUrl + '/GetAllUser'
    const httpHeaders = this.getHttpHeaders();
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  getDSThanhVienNotInGroup(IdGroup: number): any {
    const url = this.baseUrl + `/GetDSThanhVienNotInGroup?IdGroup=${IdGroup}`
    const httpHeaders = this.getHttpHeaders();
    return this.http.get<any>(url, { headers: httpHeaders });
  }


}
