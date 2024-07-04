import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from 'projects/jeework-v1/src/environments/environment';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeework-v1/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';

const API_JEEWORK_PC = environment.HOST_JEEWORK_API + '/api/tp-tasks-pc';
const API_JEEWORK_GOV = environment.HOST_JEEWORK_API + '/api/tp-tasks-gov';
const API_JEEWORK = environment.HOST_JEEWORK_API + '/api/tp-lite';
const API_MENU = environment.HOST_JEEWORK_API + '/api/menu';
const API_Lite = environment.HOST_JEEWORK_API + '/api/wework-lite';
const API_REPORT = environment.HOST_JEEWORK_API + '/api/report';

const API_PRODUCTS_URL = environment.HOST_JEELANDINGPAGE_API + '/api/widgetdashboard';
const API = environment.HOST_JEEWORK_API;
const API_Tag_Customer = environment.HOST_JEEWORK_API + '/api/tag-customer';

@Injectable()
export class BaoCaoService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	ReadOnlyControl: boolean;
	filterStorage: any;
	filterListItem: any;
	startDay: any;
	endDay: any;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	getNameUser(value: string) {
		return value.substring(0, 1).toUpperCase();
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

	loadBaoCao(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_JEEWORK_PC + '/list-task-pc';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	loadBaoCaoForChat(queryParams: QueryParamsModel): Observable<any> {
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
	//----------------------------------------------------------------------
	getListReport(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/list-report';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	getListTaskReport(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/list-task-report';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	ReportByDepartment(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/report-by-dep';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	ExcelReportByDep(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_REPORT + `/excel-report-by-dep`, item, { // API_work
			headers: httpHeaders,
			responseType: 'blob',
			observe: 'response'
		});
	}




	lite_department_by_manager(keyword: string = ""): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/lite_department_by_manager?keyword=${keyword}`, { headers: httpHeaders });
	}

	lite_project_team_by_department(id: string = ""): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWORK + `/lite_project_team_by_department?id=${id}`, { headers: httpHeaders });
	}

	lite_project_team_by_department2(id: string = ""): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWORK + `/lite_project_team_by_department?id=${id}`, { headers: httpHeaders });
	}


	ExportExcelTaskByDepartment(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_REPORT + '/Excel-list-task-report-2';
		return this.http.post<QueryResultsModel>(url, item, {
			headers: httpHeaders
		});
	}
	getListProjectReport(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/list-project-report';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	ExportExcelProjectByDepartment(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_REPORT + '/Excel-list-project-report';
		return this.http.post<QueryResultsModel>(url, item, {
			headers: httpHeaders
		});
	}

	getListReportTaskAssign(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/list-report-task-assign';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	ExcelReportListTaskAssign(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_REPORT + `/Excel-list-report-task-assign`, item, { // API_work
			headers: httpHeaders,
			responseType: 'blob',
			observe: 'response'
		});
	}
	ExcelReportSumWorkTime(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_REPORT + `/Excel-report-sum-work-time`, item, { // API_work
			headers: httpHeaders,
			responseType: 'blob',
			observe: 'response'
		});
	}

	ReportByStaff(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/report-by-staff';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	ExportExcel(queryParams: QueryParamsModel,filename: string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/ExportExcel?FileName=' + filename;
		return this.http.get(url, {
			headers: httpHeaders,
			responseType: 'blob',
			observe: 'response',
			params: httpParams
		});
	}
	getListReportTaskCreated(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/list-report-task-created';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	ExcelReportListTaskCreated(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_REPORT + `/Excel-list-report-task-created`, item, { // API_work
			headers: httpHeaders,
			responseType: 'blob',
			observe: 'response'
		});
	}
	GetThamSoByCustomer(id: any, checkToUpper: boolean): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/get-tham-so-by-customer?id=${id}&checkToUpper=${checkToUpper}`, { headers: httpHeaders });
	}
	GetThamSoByKeyAndCustomer(key: any, checkToUpper: boolean): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/get-tham-so-by-key-customer?key=${key}&checkToUpper=${checkToUpper}`, { headers: httpHeaders });
	}


	//tham số theo customer
	ts_phongban: string = '';
	ts_thumuc: string = '';
	ts_duan: string = '';
	ts_congviec: string = '';
	//viết hoa chữ đầu
	ts_duan_ToUpper: string = '';
	ts_congviec_ToUpper: string = '';
	ts_phongban_ToUpper: string = '';
	ts_thumuc_ToUpper: string = '';
	getthamso() {
		this.GetThamSoByCustomer(2, false).subscribe(res => {
			if (res.status == 1) {
				this.ts_phongban = res.data;
			}
		})
		this.GetThamSoByCustomer(3, false).subscribe(res => {
			if (res.status == 1) {
				this.ts_thumuc = res.data;
			}
		})
		this.GetThamSoByCustomer(4, false).subscribe(res => {
			if (res.status == 1) {
				this.ts_duan = res.data;
			}
		})
		this.GetThamSoByCustomer(5, false).subscribe(res => {
			if (res.status == 1) {
				this.ts_congviec = res.data;
			}
		})
		this.GetThamSoByCustomer(2, true).subscribe(res => {
			if (res.status == 1) {
				this.ts_phongban_ToUpper = res.data;
			}
		})
		this.GetThamSoByCustomer(3, true).subscribe(res => {
			if (res.status == 1) {
				this.ts_thumuc_ToUpper = res.data;
			}
		})
		this.GetThamSoByCustomer(4, true).subscribe(res => {
			if (res.status == 1) {
				this.ts_duan_ToUpper = res.data;
			}
		})
		this.GetThamSoByCustomer(5, true).subscribe(res => {
			if (res.status == 1) {
				this.ts_congviec_ToUpper = res.data;
			}
		})
	}

	//=======Start bổ sung code 25/11/2022 Thiên=================


	//=======End bổ sung code 25/11/2022 Thiên===================

	getReportCongViecQuanTrong(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API + '/api/widgets/page-my-work';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	getReportTheoDoiNhiemVuDaGiao(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API + '/api/widgets/gov-report-by-project';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	ExcelBaoCaoTDNVDG(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_REPORT + `/Excel-bao-cao-TDNVDG`, item, { // API_work
			headers: httpHeaders,
			responseType: 'blob',
			observe: 'response'
		});
	}
	ExcelBaoCaoNVTNG(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_REPORT + `/Excel-bao-cao-NVTNG`, item, { // API_work
			headers: httpHeaders,
			responseType: 'blob',
			observe: 'response'
		});
	}
	ExcelBaoCaoNVQT(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post(API_REPORT + `/Excel-bao-cao-NVQT`, item, { // API_work
			headers: httpHeaders,
			responseType: 'blob',
			observe: 'response'
		});
	}

	getListSumWorkTime(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/list-report-sum-work-time';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	ListCustomerTag(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<any>(API_Tag_Customer + "/List", {
			headers: httpHeaders,
			params: httpParams,
		});
	}

	ListAllStatusDynamic(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/list-all-status-dynamic`, { headers: httpHeaders });
	}
}
