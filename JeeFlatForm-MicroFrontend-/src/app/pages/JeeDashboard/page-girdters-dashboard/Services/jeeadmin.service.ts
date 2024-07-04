import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryResultsModel } from 'src/app/_metronic/core/models/pagram';

const API_JEEADMIN = environment.HOST_JEEADMIN_API + "/api/yeucau-vpp";

@Injectable()
export class JeeAdminWidgetService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 50));
	ReadOnlyControl: boolean;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	loadYeuCau(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_JEEADMIN + '/list-yeucau';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
          
    listTrangThaiNV(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEADMIN + '/StatusList?loai=1';
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
    
    xacNhanDaNhan(Id: number){
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEADMIN + '/Received?Id='+Id;
		return this.http.post<any>(url, [], {
			headers: httpHeaders,
		});
	}

}
