import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';
import { environment } from 'src/environments/environment';
const API_LANDINGPAGE = environment.HOST_JEELANDINGPAGE_API + '/api/menu';
@Injectable({
  providedIn: 'root'
})
export class AsideService {
  baseUrl = environment.apiUrl + '/api';
  private currentUserSource = new ReplaySubject<any>(1);
  currentUser$ = this.currentUserSource.asObservable();
  public active_close$ = new BehaviorSubject<boolean>(true);

  public authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  constructor(private http: HttpClient, private auth: AuthService,
    private httpUtils: HttpUtilsService) { }

  setCurrentUser(user: any) {
    if (user) {
      localStorage.setItem(this.authLocalStorageToken, JSON.stringify(user));
      this.currentUserSource.next(user.user.username);
    }
  }

  getInfoTitle(): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_LANDINGPAGE + '/getInfo', {
      headers: httpHeader,
    });
  }

  getLogoApp(AppID): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(environment.HOST_JEEACCOUNT_API + `/api/logo/Get_LogoApp?AppID=${AppID}`, {
      headers: httpHeader,
    });
  }

  Get_MenuLeftConfig(): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_LANDINGPAGE + '/Get_MenuLeftConfig', {
      headers: httpHeader,
    });
  }

  Update_MenuThuongDung(item: any): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    const url = API_LANDINGPAGE + '/Update_MenuThuongDung';
    return this.http.post<any>(url, item, {
      headers: httpHeader,
    });
  }

  GetMenuLeftDeskTop() {
    const url = API_LANDINGPAGE + "/Get_MenuLeftThuongDung_New";
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeader });
  }

  GetCheckOpenAI() {
    const url = environment.HOST_JEEACCOUNT_API + '/api/accountpassword/CheckOpenAI';
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(url, { headers: httpHeader });
  }
}
