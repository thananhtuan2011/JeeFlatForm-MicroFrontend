import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/jeework-v1/src/environments/environment';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeework-v1/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
import { WorkDraftModel } from '../../component/Jee-Work/jee-work.model';

const API_JEEWORK_PC = environment.HOST_JEEWORK_API + '/api/tp-tasks-pc';
const API_JEEWORK_GOV = environment.HOST_JEEWORK_API + '/api/tp-tasks-gov';
const API_JEEWORK = environment.HOST_JEEWORK_API + '/api/tp-lite';
const API_MENU = environment.HOST_JEEWORK_API + '/api/menu';
const API_Lite = environment.HOST_JEEWORK_API + '/api/wework-lite';
const API_PRODUCTS_URL = environment.HOST_JEELANDINGPAGE_API + '/api/widgetdashboard';
const API_WIDGET = environment.HOST_JEEWORK_API + '/api/widgets';
const API_work_CU = environment.HOST_JEEWORK_API + '/api/work-click-up';
const API_attachment = environment.HOST_JEEWORK_API + '/api/attachment';

@Injectable()
export class CongViecTheoDuAnService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	ReadOnlyControl: boolean;
	filterStorage: any;
	filterListItem: any;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	getNameUser(value: string) {
		if(value != null && value != ""){
			return value.substring(0, 1).toUpperCase();
		}
		return "";
	}

	getColorNameUser(value: any) {
		let result = '';
		switch (value) {
			case 'A':
				return (result = 'rgb(51 152 219)');
			case 'Ă':
				return (result = 'rgb(241, 196, 15)');
			case 'Â':
				return (result = 'rgb(142, 68, 173)');
			case 'B':
				return (result = '#0cb929');
			case 'C':
				return (result = 'rgb(91, 101, 243)');
			case 'D':
				return (result = 'rgb(44, 62, 80)');
			case 'Đ':
				return (result = 'rgb(127, 140, 141)');
			case 'E':
				return (result = 'rgb(26, 188, 156)');
			case 'Ê':
				return (result = 'rgb(51 152 219)');
			case 'G':
				return (result = 'rgb(241, 196, 15)');
			case 'H':
				return (result = 'rgb(248, 48, 109)');
			case 'I':
				return (result = 'rgb(142, 68, 173)');
			case 'K':
				return (result = '#2209b7');
			case 'L':
				return (result = 'rgb(44, 62, 80)');
			case 'M':
				return (result = 'rgb(127, 140, 141)');
			case 'N':
				return (result = 'rgb(197, 90, 240)');
			case 'O':
				return (result = 'rgb(51 152 219)');
			case 'Ô':
				return (result = 'rgb(241, 196, 15)');
			case 'Ơ':
				return (result = 'rgb(142, 68, 173)');
			case 'P':
				return (result = '#02c7ad');
			case 'Q':
				return (result = 'rgb(211, 84, 0)');
			case 'R':
				return (result = 'rgb(44, 62, 80)');
			case 'S':
				return (result = 'rgb(127, 140, 141)');
			case 'T':
				return (result = '#bd3d0a');
			case 'U':
				return (result = 'rgb(51 152 219)');
			case 'Ư':
				return (result = 'rgb(241, 196, 15)');
			case 'V':
				return (result = '#759e13');
			case 'X':
				return (result = 'rgb(142, 68, 173)');
			case 'W':
				return (result = 'rgb(211, 84, 0)');
		}
		return result;
	}

	loadCongViecTheoDuAn(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_JEEWORK_PC + '/list-task-pc';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	loadCongViecTheoDuAnForChat(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_JEEWORK_PC + '/list-task-by-conversationid';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}



	WorkDetail(id: any, isviewTaskParent = false): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_JEEWORK_PC}/detail-task?id=${id}&&isviewTaskParent=${isviewTaskParent}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	WorkDetailGOV(id: any, isviewTaskParent = false, desid: any, type: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_JEEWORK_PC}/detail-task?id=${id}&&isviewTaskParent=${isviewTaskParent}&&desid=${desid}&&type=${type}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	//=========Lưu công việc=================
	InsertTask(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_PC + '/Insert';
		return this.http.post<QueryResultsModel>(url, item, {
			headers: httpHeaders,
		});
	}
	//=========Lưu công việc giao diện mới=================
	InsertTask_Gov(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_GOV + '/Insert';
		return this.http.post<QueryResultsModel>(url, item, {
			headers: httpHeaders,
		});
	}
	//=========Lưu nháp công việc giao diện mới=================
	InsertTask_Gov_Draft(item:WorkDraftModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_GOV + '/Insert-draft';
		return this.http.post<QueryResultsModel>(url, item, {
			headers: httpHeaders,
		});
	}


	//=========Lưu nháp công việc giao diện mới=================
	load_Work_Draft(idDraft:any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_GOV + `/detail-draft-by-user?id=${idDraft}`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}

    delete_attachment(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_attachment}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }
	Check_Work_Draft(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_GOV + '/check-draft-by-user';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}

	//add tài liệu cho Gov_docs
	AddAttTask_Gov(item: any,id:any): Observable<any> {
		debugger
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_GOV + `/add-att-gov-docs?id_GovDocs=${id}`;
		return this.http.post<QueryResultsModel>(url, item, {
			headers: httpHeaders,
		});
	}
	//==============Lấy danh sách dự án (Thành viên or quản lý)========================
	listDuAn(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWORK + '/lite_project_team_byuser', { headers: httpHeaders });
	}
	lite_project_by_manager(keyword: string = ""): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/lite_project_by_manager?keyword=${keyword}`, { headers: httpHeaders });
	}
	//==============Lấy danh sách nhân viên cấp dưới========================
	listNhanVienCapDuoi(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWORK + '/lite-account-by-manager', { headers: httpHeaders });
	}
	//==============Lấy danh sách tình trạng theo dự án========================
	listTinhTrangDuAn(id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWORK + `/list-status-dynamic?id_project_team=${id}&&isDepartment=false`, { headers: httpHeaders });
	}
	listTinhTrangDuAnNew(id, id_task): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWORK + `/list-status-by-config?id_project_team=${id}&&id_task=${id_task}`, { headers: httpHeaders });
	}
	//===============Láy danh sách cấp quyền========================
	GetRoleWeWork(id_nv: string) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_MENU + `/GetRoleWeWork?id_nv=${id_nv}`, { headers: httpHeaders });
	}
	//=======================================================================
	GetRelationshipTaskByDesID(DesID: string) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWORK_GOV + `/get-relationship-task-by-desid?DesID=${DesID}`, { headers: httpHeaders });
	}
	GetRelationshipTaskBySourceID(SourceID: string) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWORK_GOV + `/get-relationship-task-by-sourceid?SourceID=${SourceID}`, { headers: httpHeaders });
	}
	//======================Thiết lập dropdown====================================
	getDSWork(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + '/Get_DSWork';
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}

	getDSWorkConfig(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + '/Get_DSWorkConfig';
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}

	Post_UpdateTitleDrd(wiget: any): Observable<any> {
		//WidgetModel
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + '/Post_UpdateTitleDrd';
		return this.http.post<any>(url, wiget, {
			headers: httpHeaders,
		});
	}

	Delete_Drd(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + `/Delete_Drd/Id=${id}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}

	Create_Drd(wiget: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_PRODUCTS_URL + '/Create_Drd';
		return this.http.post<any>(url, wiget, {
			headers: httpHeaders,
		});
	}
	//===============Load danh sách luồng nhiệm vụ=====================
	FlowChart(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_GOV + `/FlowChart?TaskID=${id}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	//==============Lấy danh sách nhân viên theo phòng ban========================
	listNhanVienPB(id_department): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/lite-account-by-department?id_department=${id_department}`, { headers: httpHeaders });
	}
	//=============================================================================

	getThamSo(id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/get-tham-so-by-customer?id=${id}&&checkToUpper=true`, { headers: httpHeaders });
	}

	//==================Lấy danh sách dự án theo phòng ban=========================
	lite_project_team_by_department(id: string = "0"): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWORK + `/lite_project_team_by_department?id=${id}`, { headers: httpHeaders });
	}

	//==================Lấy danh sách công việc widget tổng hợp công việc
	loadTongHopCongViec(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_WIDGET + '/list-task-work-summary';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	DeleteTask(id: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_work_CU + '/Delete?id=' + id;
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
        });
    }



	//========Lưu văn bản===== giao diện mới lưu văn bản trước tạo nhiệm vụ Gov=====//


	Insert_Gov_Docs(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_GOV + '/Insert-gov-docs';
		return this.http.post<QueryResultsModel>(url, item, {
			headers: httpHeaders,
		});
	}


	//End
}
