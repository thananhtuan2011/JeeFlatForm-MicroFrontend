import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { HttpUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { JobtitleManagementDTO } from './danh-muc-nhan-vien/Model/danh-muc-nhan-vien.model';

const API_LANDINGPAGE_WIZARD = environment.HOST_JEELANDINGPAGE_API + '/api/wizard';
const API_URL = environment.HOST_JEEHR_API + '/api';
const API_HR_GENERAL = environment.HOST_JEEHR_API + '/api/controllergeneral';

@Injectable()
export class DanhMucChungService {
  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
  public textHR1: string = "";
  public textHR2: string = "";
  public textHR3: string = "";
  public textHR4: string = "";
  public textHR5: string = "";
  public textHR6: string = "";
  public textHR7: string = "";
  public textHR8_1: string = "";
  public textHR8_3_1: string = "";
  public textHR8_3_2: string = "";
  public textHR8_4: string = "";
  public textHR9: string = "";
  public textHR10: string = "";//Menu danh sách nhân viên
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
  //=============Start Menu danh sách nhân viên====================
  Get_CoCauToChuc(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + `/controllergeneral/Get_CoCauToChuc_HR`, { headers: httpHeaders });
	}

  GetListStaffType(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + `/controllergeneral/GetListStaffType`, { headers: httpHeaders });
	}

  GetListPositionbyStructure(structureid: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + `/controllergeneral/GetListPositionbyStructure?structureid=${structureid}`, { headers: httpHeaders });
	}
	GetListJobtitleByStructure(id_cv: string, structureid: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + `/controllergeneral/GetListJobtitleByStructure?id_cv=${id_cv}&&structureid=${structureid}`, { headers: httpHeaders });
	}

  GetListWorkplaceByBranch(id_dv: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + `/controllergeneral/GetListWorkplaceByBranch?id_dv=${id_dv}`, { headers: httpHeaders });
	}

  getDSChucvu_HR(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_HR_GENERAL}/GetListOnlyNhomChucDanh`;
    return this.http.get<any>(url, { headers: httpHeaders });
  }
  //=============End Menu danh sách nhân viên====================
  getListApp(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEACCOUNT_API+'/api/accountmanagement/GetListAppByUserID', {
				headers: httpHeaders,
			});
	}

  UpdateInitStatusApp(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEACCOUNT_API + `/api/permissionmanagement/UpdateInitStatusApp/1/2`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
}
