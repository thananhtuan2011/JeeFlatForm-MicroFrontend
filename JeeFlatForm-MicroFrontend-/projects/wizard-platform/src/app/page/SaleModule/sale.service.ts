import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { HttpUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/http-utils.service';

const API_LANDINGPAGE_WIZARD = environment.HOST_JEELANDINGPAGE_API + '/api/wizard';

@Injectable()
export class DanhMucChungService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
  public textSale1: string = "";
  constructor(private http: HttpClient,
    private httpUtils: HttpUtilsService, private datePipe: DatePipe,) { }

  //=======================================================
  getStrConfig(stepid: any, type: string) {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(API_LANDINGPAGE_WIZARD + `/getThamSoSystem?appid=${stepid}&type=${type}`, {
      headers: httpHeader,
    });
  }

  getLogoApp(AppID): Observable<any> {
    const httpHeader = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(environment.HOST_JEEACCOUNT_API + `/api/logo/Get_LogoApp?AppID=${AppID}`, {
      headers: httpHeader,
    });
  }

  f_convertDate(v: any) {
		if (v != "" && v != null) {
			let a = new Date(v);
			return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
		}
	}

  getListApp(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEACCOUNT_API+'/api/accountmanagement/GetListAppByUserID', {
				headers: httpHeaders,
			});
	}
  //=============End Menu danh sách nhân viên====================
  UpdateInitStatusApp(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEACCOUNT_API + `/api/permissionmanagement/UpdateInitStatusApp/38/2`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
}
