import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { NhapHoSoOnlineModel } from '../Model/nhap-ho-so-online.model';
import { environment } from 'src/environments/environment';
import { HttpUtilsService } from '../../crud/utils/http-utils.service';
import { QueryParamsModel } from '../../auth/models/query-models/query-params.model';
import { QueryResultsModel } from '../../auth/models/query-models/query-results.model';

const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/satff-info';
const API_PRODUCTS_URL6 = environment.HOST_JEEHR_API + '/api/user';

@Injectable()
export class NhapHoSoOnlineService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	Visible: boolean;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	//Kiểm tra token tồn tại để xử lý yêu cầu nhập hồ sơ
	checkToken(token: string): Observable<any> {
		return this.http.post(API_PRODUCTS_URL + `/token/${token}`, token);
	}

	checkPass(password: string): Observable<any> {
		return this.http.post(API_PRODUCTS_URL + `/password?password=${password}`, password);
	}

	FindYeuCauDoManhPassWord(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL6 + '/GetYeuCauDoManhPassword';
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	// UPDATE => PUT: update the product on the server
	CreateItem(item: NhapHoSoOnlineModel): Observable<any> {
		return this.http.post(API_PRODUCTS_URL, item);
	}

	// Lấy danh sách tỉnh theo token
	GetListProvincesByToken(token: string): Observable<QueryResultsModel> {
		return this.http.get<QueryResultsModel>(API_PRODUCTS_URL + `/GetListProvincesByToken?token=${token}`);
	}

	// Lấy danh sách bằng cấp theo token
	GetListDegreeByToken(token: string): Observable<QueryResultsModel> {
		return this.http.get<QueryResultsModel>(API_PRODUCTS_URL + `/GetListDegreeByToken?token=${token}`);
	}

	// Lấy danh sách dân tộc theo token
	GetListNationByToken(token: string): Observable<QueryResultsModel> {
		return this.http.get<QueryResultsModel>(API_PRODUCTS_URL + `/GetListNationByToken?token=${token}`);
	}

	// Lấy danh sách tôn giáo theo token
	GetListReligionByToken(token: string): Observable<QueryResultsModel> {
		return this.http.get<QueryResultsModel>(API_PRODUCTS_URL + `/GetListReligionByToken?token=${token}`);
	}

	// Lấy danh sách tình trạng hôn nhân theo token
	GetListMaritalStatusByToken(token: string): Observable<QueryResultsModel> {
		return this.http.get<QueryResultsModel>(API_PRODUCTS_URL + `/GetListMaritalStatusByToken?token=${token}`);
	}
}
