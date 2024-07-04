
import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'projects/jeeteam/src/environments/environment';
import { TableJeeTeamService } from './tableJeeTeam.service';
import { HttpUtilsService } from 'projects/jeeteam/src/modules/crud/utils/http-utils.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService extends TableJeeTeamService<any>  {

  baseUrl = environment.HOST_JEETEAM_API + '/api/member';
  ;
  constructor(@Inject(HttpClient) http, @Inject(HttpUtilsService) httpUtils,) {
    super(http, httpUtils);
  }



  public GroupHeaderMenu = new BehaviorSubject<any>(undefined);
  GroupHeaderMenu$ = this.GroupHeaderMenu.asObservable();

  public getAuthFromLocalStorage(): any {

    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }


  GetDanhBaNotConversation() {
    const url = this.baseUrl + '/Get_DanhBa_NotConversation'
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeader });
  }

  EditNameGroup(IdGroup: number, grname: string) {
    const url = this.baseUrl + `/UpdateGroupName?IdGroup=${IdGroup}&nameGroup=${grname}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }

  DeleteThanhVienInGroup(IdGroup: number, IdUser: number) {
    const url = this.baseUrl + `/DeleteThanhVienInGroup?IdGroup=${IdGroup}&UserId=${IdUser}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }

  PhanquyeninTeam(RowIdMenu: number, IdUser: number, value: any) {
    const url = this.baseUrl + `/UpdateRolesMember?RowIdMenu=${RowIdMenu}&IdUser=${IdUser}&value=${value}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }

  UpdateAdmin(RowIdMenu: number, IdUser: number, key: number) {
    const url = this.baseUrl + `/UpdateAdminGroup?RowIdMenu=${RowIdMenu}&UserId=${IdUser}&key=${key}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }

  GetThanhVienTeam(RowIdMenu: number) {
    const url = this.baseUrl + `/GetThanhVienTeam?RowIdMenu=${RowIdMenu}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeader });
  }

  InsertThanhVienChannel(item: any, RowIdTeam: number, Idsub: number, IdChildsub: number) {
    const url = this.baseUrl + `/AddMemberChanel?RowIdTeam=${RowIdTeam}&&RowIdSub=${Idsub}&&RowIdChidSub=${IdChildsub}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, item, { headers: httpHeader });
  }


  DeleteMember(RowIdSub: number, IdUser: number) {
    const url = this.baseUrl + `/DeleteMember?RowIdSub=${RowIdSub}&&IdUser=${IdUser}`
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(url, null, { headers: httpHeader });
  }
  getAllUsers(): any {
    const url = this.baseUrl + '/GetAllUser'
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  GetDSUser_NotIn_InChannelPrivate(idmenu: number): any {
    const url = this.baseUrl + `/GetDSUser_NotIn_InChannelPrivate?id_menu=${idmenu}`
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeaders });
  }

  getDSThanhVienNotInGroup(IdGroup: number): any {
    const url = this.baseUrl + `/GetDSThanhVienNotInGroup?IdGroup=${IdGroup}`
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeaders });
  }


}
