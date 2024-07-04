import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { NhanHoSoOnlineModel, DuyetModel } from '../Model/nhan-ho-so-online.model';
import { QueryParamsModel, QueryResultsModel } from '../../auth/models/query-params.model';

const API_PRODUCTS_URL = environment.HOST_JEEHR_API + '/api/user';
const API_JEEHR_GENERAL = environment.HOST_JEEHR_API + '/api/controllergeneral';

@Injectable()
export class NhanHoSoOnlineService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	Visible: boolean;
	constructor(private http: HttpClient,) { }


	// UPDATE => PUT: update the product on the server
	CreateItem(item: NhanHoSoOnlineModel): Observable<any> {
		return this.http.post(API_PRODUCTS_URL + '/Insert_Candidate', item);
	}

	GetListProvincesByVacancyID(VacancyID: string, ID_KH: string): Observable<QueryResultsModel> {// Lấy danh sách tỉnh theo chức danh tuyển dụng
		return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetListProvincesByVacancyID?VacancyID=${VacancyID}&ID_KH=${ID_KH}`);
	}
	GetListDegreeByVacancyID(VacancyID: string, ID_KH: string): Observable<QueryResultsModel> {// Lấy danh sách bằng cấp theo chức danh tuyển dụng
		return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetListDegreeByVacancyID?VacancyID=${VacancyID}&ID_KH=${ID_KH}`);
	}
	GetListSchoolByVacancyID(VacancyID: string, ID_KH: string): Observable<QueryResultsModel> {// Lấy danh sách bằng cấp theo chức danh tuyển dụng
		return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetListSchoolByVacancyID?VacancyID=${VacancyID}&ID_KH=${ID_KH}`);
	}
	GetContentVacancyID(VacancyID: string, ID_KH: string): Observable<any> {// Lấy nội dung
		return this.http.get<QueryResultsModel>(API_JEEHR_GENERAL + `/GetContentVacancyID?VacancyID=${VacancyID}&ID_KH=${ID_KH}`);
	}

}
