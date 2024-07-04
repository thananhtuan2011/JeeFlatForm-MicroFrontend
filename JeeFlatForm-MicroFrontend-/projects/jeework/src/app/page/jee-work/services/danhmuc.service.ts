import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { environment, version } from 'projects/jeework/src/environments/environment';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { QueryParamsModel, QueryParamsModelNew } from '../models/query-models/query-params.model';
import { TagsModel, TicketTagsModel, WorkDraftModel } from '../models/JeeWorkModel';

//api mới
const API_JEEWF_GENERAL = environment.HOST_JEEWORKFLOW_API + '/api/controllergeneral';
const API_GENERAL = environment.HOST_JEEWORK_API_2023 + '/api/general';
const API_JEEWORK_MENU = environment.HOST_JEEWORK_API_2023 + '/api/menu';
const API_WORK_2023 = environment.HOST_JEEWORK_API_2023 + '/api/work';
const API_TemplateMiniApp = environment.HOST_JEEWORK_API_2023 + '/api/template';
@Injectable({
	providedIn: 'root'
})
export class DanhMucChungService {
	send$ = new BehaviorSubject<any>([]);
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	ts_phongban: string = '';
	ts_thumuc: string = '';
	ts_duan: string = '';
	ts_congviec: string = '';
	cf_ten: string = '0';
	cf_tag: string = '0';
	ts_description: string = '';
	//viết hoa chữ đầu
	ts_duan_ToUpper: string = '';
	ts_congviec_ToUpper: string = '';
	ts_phongban_ToUpper: string = '';
	ts_thumuc_ToUpper: string = '';
	list_priority = [
		{
			name: 'Noset',
			value: 0,
			icon: 'grey-flag',
		},
		{
			name: 'Urgent',
			value: 1,
			icon: 'red-flag',
		},
		{
			name: 'High',
			value: 2,
			icon: 'yellow-flag',
		},
		{
			name: 'Normal',
			value: 3,
			icon: 'blue-flag',
		},
		{
			name: 'Low',
			value: 4,
			icon: 'low-flag',
		},
	];

	constructor(private http: HttpClient, private httpUtils: HttpUtilsService,) { }

	getName(val) {
		var x = val.split(' ');
		return x[x.length - 1];
	}
	getColorNameUser(fullname) {
		var name = this.getNameUser(fullname).substr(0, 1);
		switch (name) {
			case 'A':
				return '#6FE80C';
			case 'B':
				return '#02c7ad';
			case 'C':
				return 'rgb(123, 104, 238)';
			case 'D':
				return '#16C6E5';
			case 'Đ':
				return '#959001';
			case 'E':
				return '#16AB6B';
			case 'G':
				return '#2757E7';
			case 'H':
				return '#B70B3F';
			case 'I':
				return '#390FE1';
			case 'J':
				return 'rgb(4, 169, 244)';
			case 'K':
				return '#2209b7';
			case 'L':
				return '#759e13';
			case 'M':
				return 'rgb(255, 120, 0)';
			case 'N':
				return '#bd3d0a';
			case 'O':
				return '#10CF99';
			case 'P':
				return '#B60B6F';
			case 'Q':
				return 'rgb(27, 188, 156)';
			case 'R':
				return '#6720F5';
			case 'S':
				return '#14A0DC';
			case 'T':
				return 'rgb(244, 44, 44)';
			case 'U':
				return '#DC338B';
			case 'V':
				return '#DF830B';
			case 'X':
				return 'rgb(230, 81, 0)';
			case 'W':
				return '#BA08C7';
			default:
				return '#21BD1C';
		}
	}
	CheckRule(val, id) {
		if (val.indexOf(id) !== -1) {
			return true;
		}
		return false;
	}
	getNameUser(val) {
		if (val) {
			var list = val.split(' ');
			return list[list.length - 1];
		}
		return '';
	}
	public getAuthFromLocalStorage(): any {
		return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
	}
	isGov()//xét isgov (csstech k phải gov)
	{
		var customerID = JSON.parse(localStorage.getItem("customerID"));
		let IsGov: boolean = false;
		switch (customerID) {
			case 123165://tây ninh(tn.)
				{
					IsGov = true;
					break;
				}
			case 123166:
				{
					IsGov = true;
					break;
				}
			case 123168:
				{
					IsGov = true;
					break;
				}
			case 123169://dak nông
				{
					IsGov = true;
					break;
				}
			case 123173://đồng nai
				{
					IsGov = true;
					break;
				}
			case 123180://bình thuận (btn.)
				{
					IsGov = true;
					break;
				}
			case 123186://bình thuận (binhthuan.)
				{
					IsGov = true;
					break;
				}
			case 123190://tây ninh (tptn.)
				{
					IsGov = true;
					break;
				}
			default:
				{
					IsGov = false;
					break;
				}
		}
		return IsGov;
	}
	//n
	//======================Thiết lập dropdown====================================
	//new
	getDSCongViec(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.2);
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_WORK_2023 + '/List-work-by-me';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams,
		});
	}
	//new
	getDSCongViecByIdMeet(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = environment.HOST_JEEWORK_API_2023 + '/api/third-party/list-task-by-meeting';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams,
		});
	}
	//new
	getDonViThucHien(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = environment.HOST_JEEWORK_API_2023 + '/api/menu/list-menu-project';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	//api mới [Kiên]
	getConfigMenu(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_MENU + '/list-config-menu-tablet';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}

	getListStatusByProject(id_project): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_GENERAL + `/list-status-by-project?idProject=${id_project}`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}

	getConfigMenuProjectTeam(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_MENU + '/get-role-all-project-byme';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}

	getListStatusType(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + `/api/status/status-type-list`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}

	//api mới [Kiên]
	updateConfigMenu(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_MENU + '/config-menu-tablet';
		return this.http.post<QueryResultsModel>(url, data, {
			headers: httpHeaders,
		});
	}

	updateConfigMenuProjectTeam(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_MENU + '/config-menu-project-role';
		return this.http.post<QueryResultsModel>(url, data, {
			headers: httpHeaders,
		});
	}
	updateConfigMenuProjectTeamType(id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_MENU + '/config-menu-project-type?value=' + id;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}
	//new
	ListAllTag(search: string = "") {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + `/api/general/lite_customer_tag?id=0&key=0&keyword=${search}`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}
	//new
	ListTagByProject(id_project: any) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + `/api/general/lite_customer_tag?id=${id_project}&key=0`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}
	//new
	getDSNhiemVuByProject(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.4);
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = environment.HOST_JEEWORK_API_2023 + '/api/work/page-my-work';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams,
		});
	}
	//new
	get_Detail_Task(id_task): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.2);
		const url = environment.HOST_JEEWORK_API_2023 + `/api/work/detail-task?id=${id_task}&isviewTaskParent=true`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}

	//new
	get_Detail_Task_Widget(id_task): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + `/api/widgets/detail-task?id=${id_task}&isviewTaskParent=true`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}

	//new 
	gov_account_assignee_by_project(id_project_team: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_GENERAL + `/gov-acc-assignee-by-project?keys=id_project_team&vals=${id_project_team}`, {
			headers: httpHeaders,
		});
	}
	//new 
	gov_account_follower_by_project(id_project_team: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_GENERAL + `/gov-acc-follower-by-project?keys=id_project_team&vals=${id_project_team}`, {
			headers: httpHeaders,
		});
	}
	//new 
	gov_account_follower_by_department(idDept: any = 0): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_GENERAL + `/gov-acc-follower-by-department?DepartmentID=${idDept}`, {
			headers: httpHeaders,
		});
	}
	//new
	getMenuDSNV(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + '/api/menu/LayMenuChucNangTablet';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}
	//new
	getCongViecCon(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.2);
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/work/get-relationship-task-by-sourceid?SourceID=${id}`, {
			headers: httpHeaders,
		});
	}
	LoadTaskChild(queryParams: QueryParamsModelNew): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_WORK_2023 + '/list-child-by-task';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	//new
	getCongViecLienQuan(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/work/get-relationship-task-by-desid?DesID=${id}`, {
			headers: httpHeaders,
		});
	}
	//new
	updateTask(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.2);
		return this.http.post<any>(environment.HOST_JEEWORK_API_2023 + '/api/work/Update-by-key', item, { headers: httpHeaders, });
	}
	updateTaskformData(formData: any): Observable<any>{
        const httpHeaders = this.httpUtils.getHttpHeaderFiles(1.4);
		// const httpHeaders = this.httpUtils.getHTTPHeaders(1.2);
		return this.http.post<any>(environment.HOST_JEEWORK_API_2023 + '/api/work/Update-by-key-formdata', formData, { headers: httpHeaders, });
	}
	//new
	listTinhTrangDuAn(id, id_task): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// return this.http.get<any>(API_JEEWORK + `/list-status-by-config?id_project_team=${id}&&id_task=${id_task}`, { headers: httpHeaders });
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/status/list-status-by-config?id_project_team=${id}&&id_task=${id_task}`, { headers: httpHeaders });

	}
	//new
	list_gov_acc_join_dept(filter: any, DepartmentID: number = 0): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let params = this.httpUtils.parseFilter(filter);
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/general/gov-acc-join-dept?DepartmentID=${DepartmentID}`, { headers: httpHeaders, params: params });
	}
	//new
	//lay danh sach du an
	lite_project_by_manager(DepartmentID: number = 0, keyword: string = ""): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/general/lite_project_by_manager?DepartmentID=${DepartmentID}&&keyword=${keyword}`, { headers: httpHeaders });
	}
	//new
	list_account_gov(id: any, BaoGomUserLogin: boolean = true): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/general/lite-account-by-project_manager?id=${id}&&BaoGomUserLogin${BaoGomUserLogin}`, { headers: httpHeaders });
	}
	//new
	Insert_Gov_Docs(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + '/api/document/Insert-gov-docs';
		return this.http.post<QueryResultsModel>(url, item, {
			headers: httpHeaders,
		});
	}
	//Start - Dùng cho form tạo nhiệm vụ
	//Danh sách đơn vị giao quyền 42
	list_department_gov_rule42(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/general/Lite_department_by_rule42`, { headers: httpHeaders });
	}
	//End - Dùng cho form tạo nhiệm vụ
	//=========Lưu công việc giao diện mới=================
	//new
	InsertTask_Gov(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders("1.3");
		const url = environment.HOST_JEEWORK_API_2023 + '/api/work/Insert';
		return this.http.post<QueryResultsModel>(url, item, {
			headers: httpHeaders,
		});
	}
	InsertTask(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
		const url = environment.HOST_JEEWORK_API_2023 + '/api/work/Insert-task';
		return this.http.post<QueryResultsModel>(url, item, {
			headers: httpHeaders,
		});
	}
	//=========Lưu nháp công việc giao diện mới=================
	//new
	InsertTask_Gov_Draft(item: WorkDraftModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + '/api/draft/Insert-draft';
		return this.http.post<QueryResultsModel>(url, item, {
			headers: httpHeaders,
		});
	}
	//=========Thống kê nhiệm vụ=================
	//new
	getWorkSumaryByProject(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = environment.HOST_JEEWORK_API_2023 + '/api/work/work-summary-by-project';
		// const url = environment.HOST_JEEWORK_API + '/api/tp-tasks/work-summary-by-project';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams,
		});
	}
	//=========Nhãn=================
	//new
	UpdateTag(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(environment.HOST_JEEWORK_API_2023 + '/api/tag/Update', item, { headers: httpHeaders });
	}
	//new
	InsertTag(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(environment.HOST_JEEWORK_API_2023 + '/api/tag/Insert', item, { headers: httpHeaders });
	}
	//new
	DeleteTag(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${environment.HOST_JEEWORK_API_2023}/api/tag/Delete?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	//new
	DeleteTask(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.2);
		const url = `${environment.HOST_JEEWORK_API_2023}/api/work/DeleteWork`;
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	DeleteTaskV1(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${environment.HOST_JEEWORK_API_2023}/api/work/DeleteWork?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	//new
	getDetailDraft(id: any,): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/work/detail-draft-by-user?id=${id}`, { headers: httpHeaders });
	}
	GetThamSoByCustomer(id: any, checkToUpper: boolean): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/general/get-tham-so-by-customer?id=${id}&checkToUpper=${checkToUpper}`, { headers: httpHeaders });
	}
	getthamso() {
		this.ts_phongban = localStorage.getItem("ts_phongban");
		this.ts_duan = localStorage.getItem("ts_duan");
		this.ts_thumuc = localStorage.getItem("ts_thumuc");
		this.ts_congviec = localStorage.getItem("ts_congviec")
		this.ts_phongban_ToUpper = localStorage.getItem("ts_phongban_ToUpper")
		this.ts_duan_ToUpper = localStorage.getItem("ts_duan_ToUpper")
		this.ts_thumuc_ToUpper = localStorage.getItem("ts_thumuc_ToUpper")
		this.ts_congviec_ToUpper = localStorage.getItem("ts_congviec_ToUpper")
		this.ts_description = localStorage.getItem("ts_description")
		this.cf_ten = localStorage.getItem("cf_ten")
		this.cf_tag = localStorage.getItem("cf_tag")
		// this.GetThamSoByCustomer(2, false).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_phongban = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(3, false).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_thumuc = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(4, false).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_duan = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(5, false).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_congviec = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(2, true).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_phongban_ToUpper = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(3, true).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_thumuc_ToUpper = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(4, true).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_duan_ToUpper = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(5, true).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_congviec_ToUpper = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(32, true).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.cf_ten = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(33, true).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.cf_tag = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(15, false).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_description = res.data;
		// 	}
		// })
	}
	GetDSGiaiDoan(id: number): Observable<any> {//Lấy danh sách giai đoạn theo quy trình
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWF_GENERAL + `/GetDSGiaiDoan?id=${id}`, { headers: httpHeaders });
	}
	GetDSNguoiTheoDoi(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWF_GENERAL + `/GetDSNguoiTheoDoi`, { headers: httpHeaders });
	}
	getDuan(id: number): Observable<any> {
		// queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + `/api/general/lite_project_by_me?options=${id}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	getDuanbyMeWithRoleID(RoleID: number): Observable<any> {
		// queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + `/api/general/lite_project_by_me_with_role?RoleID=${RoleID}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	getPhongBanbyMeWithRuleID(RuleID: number): Observable<any> {
		// queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + `/api/general/lite_department_by_me_with_rule?RuleID=${RuleID}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	SelectDuan(id: number, key: number): Observable<any> {
		// queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + `/api/general/lite_customer_tag?id=${id}&&key=${key}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	Listtags(id: number): Observable<any> {
		// queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.4);
		const url = environment.HOST_JEEWORK_API_2023 + `/api/general/List_tag_by_ProjectConfig?id=${id}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	ListtagsDept(id: number): Observable<any> {
		// queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.4);
		const url = environment.HOST_JEEWORK_API_2023 + `/api/general/List_tag_by_DepartmentConfig?id=${id}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	ListTagDepartment_2023(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/general/lite_customer_tag?id=0&key=1`, { headers: httpHeaders });
	}
	updateConfigMenuTag(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_JEEWORK_MENU + `/config-menu-project-tags`;
		return this.http.post<QueryResultsModel>(url, data, {
			headers: httpHeaders,
		});
	}
	InsertTagss(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + `/api/tag/Insert`;
		return this.http.post<QueryResultsModel>(url, data, {
			headers: httpHeaders,
		});
	}
	ListTagAll(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.4);
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/menu/list-tags-config-byuser`, { headers: httpHeaders });
	}
	ListTagChungAll(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.4);
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/tag/List-tag-system`, { headers: httpHeaders });
	}
	ListTagConfigByCategory(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders(1.4);
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/menu/list-tags-config-byuser`, { headers: httpHeaders,params: httpParams,});
	}
	//========================Start - (Thiết lập hiển thị phạm vi)=====================================================
	list_department_by_me(): Observable<any> {//Lấy danh sách phòng ban 
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/general/list_department_by_me`, { headers: httpHeaders });
	}

	list_roleconfig_byme(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<any>(API_JEEWORK_MENU + "/get-role-roleconfig-byme", {
			headers: httpHeaders,
			params: httpParams,
		});
	}
	update_roleconfig_byuser(Departmentid: number, value: number): Observable<any> {//Lấy danh sách phòng ban 
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_JEEWORK_MENU + `/update-role-config-byuser?Departmentid=${Departmentid}&value=${value}`, { headers: httpHeaders });
	}
	//new
	listTienDo(idpro, id_status): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// return this.http.get<any>(API_JEEWORK + `/list-status-by-config?id_project_team=${id}&&id_task=${id_task}`, { headers: httpHeaders });
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/general/lite-progress?idProject=${idpro}&&statusID=${id_status}`, { headers: httpHeaders });

	}
	//========================End - (Thiết lập hiển thị phạm vi)=====================================================

	//==============Start - Bổ sung chức năng chọn template sử dụng===============
	ListTemplate(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/menu/Get_ListTemplate`, { headers: httpHeaders });
	}
	UpdateTemplate(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEELANDINGPAGE_API + `/api/workv2template/Update_UserTemplate`;
		return this.http.post<QueryResultsModel>(url, data, {
			headers: httpHeaders,
		});
	}
	//==============End - Bổ sung chức năng chọn template sử dụng===============
	CheckAuthorizeReport(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/general/CheckAuthorizeReport`, { headers: httpHeaders });
	}
	//==============Start - Bổ sung chức năng - Menu nhiệm vụ của đơn vị=============
	ListProject_NVCDV(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/general/list_project_by_me_rule_viewall`, { headers: httpHeaders });
	}
	UpdateNhiemVuCuaDV(ProjectID: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/menu/update-role-config-nvcdv?ProjectID=${ProjectID}`, { headers: httpHeaders });
	}
	Post_UpdateValueWidget(wiget: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEELANDINGPAGE_API + '/api/widgetwork/Post_UpdateValueWidget';
		return this.http.post<any>(url, wiget, {
			headers: httpHeaders,
		});
	}
	//==============End - Bổ sung chức năng - Menu nhiệm vụ của đơn vị===============
	//==============Start - Bổ sung chức năng - Menu nhiệm vụ phối hợp=============
	ListProject_NVPH(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/general/list_project_by_me_rule_viewcombination`, { headers: httpHeaders });
	}
	UpdateNhiemVuPH(ProjectID: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/menu/update-role-config-nvph?ProjectID=${ProjectID}`, { headers: httpHeaders });
	}
	//==============End - Bổ sung chức năng - Menu nhiệm vụ phối hợp===============
	//==============Start đổi cách gọi api load status 19092023 - Thiên =============================
	getListStatusTypeList(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + `/api/status/status-type-list`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}
	getListStatusByNVCDV(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + `/api/general/list-status-by-project-nvcdv`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}
	getListStatusByNVPH(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + `/api/general/list-status-by-project-nvph`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}
	//=============End đổi cách gọi api load status==========================
	//===============Gọi API hiển thị column===============================
	gov_display_column(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_GENERAL + `/display-column`, {
			headers: httpHeaders,
		});
	}
	Change_Assignee(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + '/api/work/change-assignee';
		return this.http.post<any>(url, item, {
			headers: httpHeaders,
		});
	}
	//===================================================================
	getDSCongViecLapLai(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders("1.1");
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_WORK_2023 + '/List-work-repeated';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams,
		});
	}

	updateTrangThaiCongViecLapLai(workid: any, active: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders("1.1");
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/work/active-work-repeated?workid=${workid}&active=${active}`, { headers: httpHeaders, });
	}

	deleteCongViecLapLai(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders("1.1");
		const url = `${environment.HOST_JEEWORK_API_2023}/api/work/delete-work-repeated?workid=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	WW_Roles(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/ww_userrights/GetRolesForUser_WeWork`, { headers: httpHeaders });
	}
	lite_workgroup(id_project_team: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/general/lite_workgroup?id_project_team=${id_project_team}`, { headers: httpHeaders });
	}
	Lite_WorkSpace_tree_By_User(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_TemplateMiniApp + '/lite-workspace-tree-by-user',
			{ headers: httpHeaders });
	}
	Lite_WorkSpace_tree_By_User_New(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_TemplateMiniApp + '/lite-workspace-tree-by-user-new',
			{ headers: httpHeaders });
	}
	getDetailTemplate(id, istemplatelist = false): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_TemplateMiniApp + `/detail?id=${id}&istemplatelist=${istemplatelist}`,
			{ headers: httpHeaders });
	}


}
