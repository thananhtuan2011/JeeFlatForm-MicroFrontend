
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'projects/jeeteam/src/environments/environment';
import { TableJeeTeamService } from './tableJeeTeam.service';
import { HttpUtilsService } from 'projects/jeeteam/src/modules/crud/utils/http-utils.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class JeeTeamService extends TableJeeTeamService<any>  {
  baseUrl = environment.HOST_JEETEAM_API + '/api/dashboard';

  baseUrlchat = environment.HOST_JEECHAT_API + '/api';
  public rt_loadUserinteam: string = this.baseUrl + `/GetDSUserInTeam`;
  public rt_Quanlymemberteam: string = this.baseUrl + `/QuanlyMemberTeam`;
  public rt_phanquyen: string = this.baseUrl + `/DSPhanQuyen`;
  baseMenuUrl = environment.HOST_JEETEAM_API + '/api/menu';
  public refreshConversation = new BehaviorSubject<any>(null);
  RefreshConversation$ = this.refreshConversation.asObservable();
  public created_group = new BehaviorSubject<boolean>(false);
  created_group$ = this.created_group.asObservable();
  public readonly _Search_Team = new BehaviorSubject<any>(
    undefined
  );
  readonly _Search_Team$ = this._Search_Team.asObservable();

  get data_share__Search() {
    return this._Search_Team.getValue();
  }
  set data_share__Search(val) {
    this._Search_Team.next(val);
  }
  public sub_title = new BehaviorSubject<any>(undefined);
  sub_title$ = this.sub_title.asObservable();
  constructor(@Inject(HttpClient) http, @Inject(HttpUtilsService) httpUtils, private cookieService: CookieService) {
    super(http, httpUtils);
  }


  readonly _ContentTopic$ = new BehaviorSubject<any>(
    undefined
  );

  public GroupHeaderMenu = new BehaviorSubject<any>(undefined);
  GroupHeaderMenu$ = this.GroupHeaderMenu.asObservable();

  // public getAuthFromLocalStorage(): any {
  //   return this.auth.getAuthFromLocalStorage();
  // }
  public getAuthFromLocalStorage(): any {

    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }

  getlist_Reaction() {
    const url = this.baseUrlchat + '/chat/GetDSReaction'
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeader });
  }



  GetDanhBaNotConversation() {
    const url = this.baseUrl + '/Get_DanhBa_NotConversation'
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeader });
  }
  GetPhanQuyen() {
    const url = this.baseUrl + '/GetPhanQuyen'
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeader });
  }


  GetPhanQuyenByUserName(username: string) {
    const url = this.baseUrl + `/GetPhanQuyenByUserName?username=${username}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeader });
  }

  EditNameGroup(IdGroup: number, grname: string) {
    const url = this.baseUrl + `/UpdateGroupName?IdGroup=${IdGroup}&nameGroup=${grname}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }

  UpdateRolesMember(username: string, key: any, userid: string) {
    const url = this.baseUrl + `/UpdateRolesMember?username=${username}&key=${key}&userId=${userid}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }

  DeleteThanhVienInGroup(IdGroup: number, IdUser: number) {
    const url = this.baseUrl + `/DeleteThanhVienInGroup?IdGroup=${IdGroup}&UserId=${IdUser}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }


  UpdateAdmin(IdGroup: number, IdUser: number, key: number) {
    const url = this.baseUrl + `/UpdateAdminGroup?IdGroup=${IdGroup}&UserId=${IdUser}&key=${key}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }
  GetThanhVienGroup(IdGroup: number) {
    const url = this.baseUrl + `/GetThanhVienGroup?IdGroup=${IdGroup}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeader });
  }


  CreateGroupMenu(item: any) {
    const url = this.baseMenuUrl + '/InsertMenu'
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, item, { headers: httpHeader });
  }

  EditNameMenu(RowIdMenu: number, title: string) {
    const url = this.baseMenuUrl + `/EditNameMenu?RowIdMenu=${RowIdMenu}&&title=${title}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }

  EditNameMenuChanel(RowSubId: number, title: string, isprivate: boolean) {
    const url = this.baseMenuUrl + `/EditNameMenuChanel?RowSubId=${RowSubId}&title=${title}&isprivate=${isprivate}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }


  InsertThanhVien(IdGroup: number, item: any) {
    const url = this.baseUrl + `/InsertThanhVienInGroup?IdGroup=${IdGroup}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, item, { headers: httpHeader });
  }

  DeleteConversation(item: any) {
    const url = this.baseUrl + `/DeleteConverSation?IdGroup=${item}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, item, { headers: httpHeader });
  }
  getAllUsers(): any {
    const url = this.baseUrl + '/GetAllUser'
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  GetDSUser_NotIn_InGroupMenu(idmenu: number): any {
    const url = this.baseUrl + `/GetDSUser_NotIn_InGroupMenu?id_menu=${idmenu}`
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  getDSThanhVienNotInGroup(IdGroup: number): any {
    const url = this.baseUrl + `/GetDSThanhVienNotInGroup?IdGroup=${IdGroup}`
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeaders });
  }


}
