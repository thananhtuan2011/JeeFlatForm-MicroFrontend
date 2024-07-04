import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { QueryParamsModelNew, QueryResultsModel } from 'src/app/_metronic/core/models/pagram';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';
import { environment } from 'src/environments/environment';

const API_LANDINGPAGE_WIZARD = environment.HOST_JEELANDINGPAGE_API + '/api/wizard';

@Injectable({
  providedIn: 'root'
})
export class GuideAdminService {
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

  findData(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = environment.HOST_JEEACCOUNT_API + '/api/permissionmanagement/GetListCustomerAppInit';
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  CheckUseWizard(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/wizard/CheckUseWizard`, { headers: httpHeaders });
	}
}
