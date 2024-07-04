import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { DatePipe } from '@angular/common';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel } from './step2-component/step2-component.component';
import { QueryParamsModelNew } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { environment } from 'projects/wizard-platform/src/environments/environment';

//api mới
const API_GENERAL = environment.HOST_JEEWORK_API_2023 + '/api/general';
const API_GroupStatus = environment.HOST_JEEWORK_API_2023 + '/api/group-status';
const API_Status = environment.HOST_JEEWORK_API_2023 + '/api/status';
const API_departmentMiniAPP = environment.HOST_JEEWORK_API_2023 + '/api/department';
const API_ProjectMiniAPP = environment.HOST_JEEWORK_API_2023 + '/api/project';
const API_WWUserRightSMiniAPp = environment.HOST_JEEWORK_API_2023 + '/api/ww_userrights';
const API_TemplateMiniApp = environment.HOST_JEEWORK_API_2023 + '/api/template';
@Injectable({
	providedIn: 'root'
})
export class WorkwizardChungService {

	constructor(private http: HttpClient, private httpUtils: HttpUtilsService,) { }

	getLogoApp(AppID): Observable<any> {
		const httpHeader = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEACCOUNT_API + `/api/logo/Get_LogoApp?AppID=${AppID}`, {
			headers: httpHeader,
		});
	}

	getListApp(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEACCOUNT_API + '/api/accountmanagement/GetListAppByUserID', {
			headers: httpHeaders,
		});
	}

	GetWizard(id: number): Observable<any> {//Lấy danh sách giai đoạn theo quy trình
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_GENERAL + `/wizard?id=${id}`, { headers: httpHeaders });
	}
	Delete_Status_Template_2023(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_Status}/delete-status?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	NhomTrangThai(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + '/api/status/List-status-group-wizard';
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	ListStatusType(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams)
		const url = API_Status + `/status-type-list`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	InsertStatusConfig(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_Status + '/insert-status', item, { headers: httpHeaders });
	}
	UpdateStatusConfig(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_Status + '/update-status', item, { headers: httpHeaders });
	}
	list_account(filter: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let params = this.httpUtils.parseFilter(filter);
		return this.http.get<any>(API_GENERAL + `/lite_account`, { headers: httpHeaders, params: params });
	}
	UpdateTypeStatus(Statusid: number, typeid: number = 0): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_Status}/update-typeid?Statusid=${Statusid}&typeid=${typeid}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	findDataDept(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_departmentMiniAPP + '/List';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	getNameUser(val) {
		if (val) {
			var list = val.split(' ');
			return list[list.length - 1];
		}
		return '';
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
	findDataProjectMiniAPP(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_ProjectMiniAPP + '/List';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	lite_department(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_GENERAL + `/lite_department`, { headers: httpHeaders });
	}
	get_template(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = `${environment.HOST_JEEWORK_API_2023}/api/tempConfigNotify/List-config`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	Project_Detail(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ProjectMiniAPP}/Detail?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	findRoleListProject(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_WWUserRightSMiniAPp + `/get-roles-list`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
			params: httpParams,
		});
	}
	list_account_customer(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_GENERAL + `/lite_account_customer`, { headers: httpHeaders });
	}
	ListGroupStatus(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_GroupStatus + '/list-group-status';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	toNonAccentVietnamese(str) {
		str = str.replace(/A|Á|À|Ã|Ạ|Â|Ấ|Ầ|Ẫ|Ậ|Ă|Ắ|Ằ|Ẵ|Ặ/g, "A");
		str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
		str = str.replace(/E|É|È|Ẽ|Ẹ|Ê|Ế|Ề|Ễ|Ệ/, "E");
		str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
		str = str.replace(/I|Í|Ì|Ĩ|Ị/g, "I");
		str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
		str = str.replace(/O|Ó|Ò|Õ|Ọ|Ô|Ố|Ồ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ỡ|Ợ/g, "O");
		str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
		str = str.replace(/U|Ú|Ù|Ũ|Ụ|Ư|Ứ|Ừ|Ữ|Ự/g, "U");
		str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
		str = str.replace(/Y|Ý|Ỳ|Ỹ|Ỵ/g, "Y");
		str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
		str = str.replace(/Đ/g, "D");
		str = str.replace(/đ/g, "d");
		// Some system encode vietnamese combining accent as individual utf-8 characters
		str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
		str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
		return str;
	}
	UpdateProjectTeam2(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ProjectMiniAPP + '/update', item, { headers: httpHeaders });
	}
	list_account_department(id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// let params = this.httpUtils.parseFilter(filter);
		return this.http.get<any>(API_GENERAL + `/list_account_department?DepartmentID=${id}`, { headers: httpHeaders });
	}
	InsertProjectTeam2(item): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ProjectMiniAPP + '/Insert-project', item, { headers: httpHeaders });
	}
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
	}
	public getAuthFromLocalStorage(): any {
		return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
	}
	DeleteProject(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ProjectMiniAPP}/Delete?idProject=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	getTemplateTypes(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_TemplateMiniApp + '/lite_template_types',
			{ headers: httpHeaders });
	}
	Lite_WorkSpace_tree_By_User(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_TemplateMiniApp + '/lite-workspace-tree-by-user',
			{ headers: httpHeaders });
	}
	LiteListField(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_TemplateMiniApp + '/list-field-template',
			{ headers: httpHeaders });
	}
	getTemplateCenter(queryParams: QueryParamsModelNew): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParms = this.httpUtils.getFindHTTPParams(queryParams)

		return this.http.get<any>(API_TemplateMiniApp + '/get-list-template-center',
			{ headers: httpHeaders, params: httpParms });

	}
	getDetailTemplate(id, istemplatelist = false): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_TemplateMiniApp + `/detail?id=${id}&istemplatelist=${istemplatelist}`,
			{ headers: httpHeaders });
	}
	Sudungmau(data, istemplatelist): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_TemplateMiniApp + `/use-template?istemplatelist=${istemplatelist}`, data,
			{ headers: httpHeaders });
	}
	add_template_library(data): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_TemplateMiniApp + `/add-template-library`, data,
			{ headers: httpHeaders });
	}
	delete_library(id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_TemplateMiniApp + `/delete-library/${id}`,
			{ headers: httpHeaders });
	}
	InsertDept(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_departmentMiniAPP + '/Insert', item, { headers: httpHeaders });
	}
	InsertProjectTeam(item): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_ProjectMiniAPP + '/Insert-project', item, { headers: httpHeaders });
	}
	list_account_2023(filter: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let params = this.httpUtils.parseFilter(filter);
		return this.http.get<any>(API_GENERAL + `/lite_account_customer`, { headers: httpHeaders, params: params });
	}
	list_default_view(filter: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let params = this.httpUtils.parseFilter(filter);
		return this.http.get<any>(API_GENERAL + `/get-list-default-view`, { headers: httpHeaders, params: params });
	}
	ListStatusById_2023(query: QueryParamsModelNew): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(query);
		return this.http.get<any>(API_GroupStatus + `/list-group-status`, { params: httpParams, headers: httpHeaders });
	}
	ListStatusDynamic(id_project_team: any, isDepartment = false): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_GENERAL + `/list-status-dynamic?id_project_team=${id_project_team}&isDepartment=${isDepartment}`, { headers: httpHeaders });
	}
	GetRoleList(key, value): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		// const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = `${API_WWUserRightSMiniAPp}/get-roles-list?filter.keys=${key}&filter.vals=${value}`;
		return this.http.get<any>(url, {
			// params: httpParams 
			headers: httpHeaders
		});
	}
	DeptDetail(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_departmentMiniAPP}/Detail?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	ListTagDepartment_2023(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_GENERAL + `/lite_customer_tag?id=0&key=1`, { headers: httpHeaders });
	}
	UpdateDept(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_departmentMiniAPP + '/Update', item, { headers: httpHeaders });
	}
	InsertGroup(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_GroupStatus + '/insert-group-status', item, { headers: httpHeaders });
	}
	public defaultColors: string[] = [
		'#848E9E',
		// 'rgb(187, 181, 181)',
		'rgb(29, 126, 236)',
		'rgb(250, 162, 140)',
		'rgb(14, 201, 204)',
		'rgb(11, 165, 11)',
		'rgb(123, 58, 245)',
		'rgb(238, 177, 8)',
		'rgb(236, 100, 27)',
		'rgb(124, 212, 8)',
		'rgb(240, 56, 102)',
		'rgb(255, 0, 0)',
		'rgb(0, 0, 0)',
		'rgb(255, 0, 255)',
	];
	updateAllPosition(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_Status + '/update-all-position', item, { headers: httpHeaders });
	}
	UpdateStatus(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_Status + '/update-status', item, { headers: httpHeaders });
	}
	UpdateGroup(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_GroupStatus + '/Update-group-status', item, { headers: httpHeaders });
	}
	DeleteStatus(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_Status}/delete-status?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	DeleteGroupStatus(id: number, isSystem: number = 0): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_GroupStatus}/delete-group-status?id_group=${id}&isSystem=${isSystem}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	UpdateNhomTrangThai(id_group: any, id = false, type: number = 0): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_GroupStatus + `/change-status-group?id_group=${id_group}&id=${id}&type=${type}`, { headers: httpHeaders });
	}
	InsertStatus(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_Status + '/insert-status', item, { headers: httpHeaders });
	}
	Delete_Dept(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_departmentMiniAPP}/Delete?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	UpdateInitStatusApp(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEACCOUNT_API + `/api/permissionmanagement/UpdateInitStatusApp/34/2`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
}
