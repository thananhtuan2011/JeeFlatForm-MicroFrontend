import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ImportXepCaModel } from '../Model/xep-ca-lam-viec.model';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';

const API_Landingpage_XepCa = environment.HOST_JEEHR_API + '/api/xepca';
const API_Camera_Hanet = environment.HOST_JEEHR_API + '/api/thietlapchamcongcamerahanet'

@Injectable()
export class XepCaLamViecService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	public Visible: boolean;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	loadDay(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_Landingpage_XepCa + '/day';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	findData(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_Landingpage_XepCa + '/Get_DSNhanVien_New';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	Update_CaLamViec(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_Landingpage_XepCa + '/Update_CaLamViec', item, { headers: httpHeaders });
	}

	ImportData(item: ImportXepCaModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_Landingpage_XepCa + '/ImportData', item, { headers: httpHeaders });
	}

	DownloadFileMauImport_Shift(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get(API_Landingpage_XepCa + `/DownloadFileMauImport_Shift`, {
			headers: httpHeaders,
			responseType: 'blob',
			observe: 'response'
		});
	}

	getDSDiaDiemChamCong(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpHeaders = this.httpUtils.getHTTPHR();
		const url = API_Camera_Hanet + '/Get_DSPlaces';
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}

	DownloadCameraHanet(placeID, CustomerID, UserName, date): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpHeaders = this.httpUtils.getHTTPHR();
		const url = API_Camera_Hanet + `/DownloadCheckinFromHanet?placeID=${placeID}&CustomerID=${CustomerID}
		&UserName=${UserName}&date=${date}`;
		return this.http.get<QueryResultsModel>(url, { headers: httpHeaders });
	}


}
