import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';
import { environment } from 'src/environments/environment';

const API_LANDINGPAGE_WIZARD = environment.HOST_JEELANDINGPAGE_API + '/api/wizard';
const API_ACCOUNT_CUSTOMERMANAGER = environment.HOST_JEEACCOUNT_API + '/api/customermanagement';
@Injectable({
  providedIn: 'root'
})
export class GuideSystemService {
  public textStep1: string = "";
  public textStep2: string = "";
  public textStep3: string = "";
  public textStep4: string = "";
  constructor(private http: HttpClient,
    private auth: AuthService,
    private httpUtils: HttpUtilsService) { }

  checkAdmin(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders("2.0");
    const url = API_LANDINGPAGE_WIZARD + '/CheckAdmin';
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  getLogoApp(AppID): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(environment.HOST_JEEACCOUNT_API + `/api/logo/Get_LogoApp?AppID=${AppID}`, {
      headers: httpHeader,
    });
  }

  tickComplete(): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders("2.0");
    return this.http.get<any>(API_LANDINGPAGE_WIZARD + `/TickComplete`, {
      headers: httpHeader,
    });
  }

  //=======================================================
  getStrConfig(stepid: any, type: string = '') {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_LANDINGPAGE_WIZARD + `/getThamSoSystem?appid=${stepid}&type=${type}`, {
      headers: httpHeader,
    });
  }

  //=======================================================
  updateStepCustomer(item: any) {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(API_LANDINGPAGE_WIZARD + `/Update_StepCustomer`, item, {
      headers: httpHeader,
    });
  }

  //===========Bổ sung wizard thông tin doanh nghiệp==============================================
  //Get thông tin doanh nghiệp
  information() {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_ACCOUNT_CUSTOMERMANAGER + `/information`, {
      headers: httpHeader,
    });
  }
  //Cập nhật thông tin doanh nghiệp
  updateInformationCustomer(item: any) {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.post<any>(API_ACCOUNT_CUSTOMERMANAGER + `/compay/information`, item, {
      headers: httpHeader,
    });
  }
}
