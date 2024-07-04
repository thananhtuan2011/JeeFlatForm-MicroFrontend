import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { QueryParamsModel, QueryParamsModelNew } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { environment } from 'projects/jeeworkflow/src/environments/environment';
import { HttpUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/http-utils.service';

const API_PRODUCTS_URL = environment.HOST_JEEWORKFLOW_API + '/api/workprocess';
const API_REPORT = environment.HOST_JEEWORKFLOW_API + '/api/report';
const API_Template = environment.HOST_JEEWORKFLOW_API + '/api/template';
const API_Comment = environment.HOST_JEECOMMENT_API + '/api/comments';
const API_WF_process = environment.HOST_JEEWORKFLOW_API + '/api/process';
const API_TASK = environment.HOST_JEEWORKFLOW_API + '/api/task';
@Injectable()
export class ProcessWorkService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	ReadOnlyControl: boolean;
	public selectTab_Kanban: number = 0;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) {
	}

	findData(queryParams: QueryParamsModelNew): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_TASK + '/list';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	Get_NodeProcess(itemId: number): Observable<any> {//Lấy danh sách note của quy trình
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Get_NodeProcess?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	Get_ProcessDetail(itemId: number): Observable<any> {//Lấy chi tiết quy trình
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Get_ProcessDetail?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	Get_NodeDetail(itemId: number): Observable<any> {//Lấy chi tiết giai đoạn
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Get_NodeDetail?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}


	Get_TaskDetail(itemId: number): Observable<any> {//Lấy chi tiết nhiệm vụ
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/nhiem-vu-chi-tiet?id=${itemId}`;
		return this.http.post<any>(url, itemId, { headers: httpHeaders });
	}

	getToDoDetail(itemId: number): Observable<any> {//Lấy chi tiết công việc của công việc chi tiết
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/getToDoDetail?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	Get_NextImplementer(itemId: number): Observable<any> {//Lấy thông tin đê chuyển giai đoạn
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Get_NextImplementer?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	Delete_WorkProcess(itemId: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Delete_WorkProcess?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	Get_FieldsNode(itemId: number, nodelistid: number): Observable<any> {//Lấy thông tin control trong chuyển giai đoạn
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Get_FieldsNode?id=${itemId}&nodelistid=${nodelistid}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	//===============================Xử lý công việc chi tiết trong quy trình=======================
	updateToDo(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/updateToDo', item, { headers: httpHeaders });
	}

	delToDo(itemId: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/delToDo?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	//=======================Giao người thực hiện====================================
	getNguoiThucHienDuKien(itemId: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/getNguoiThucHienDuKien?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	updateImplementer(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + `/updateImplementer`, item, { headers: httpHeaders });
	}

	//==============================Xóa người theo dõi===============================
	delFollower(id: number, id_nv: number, worktype: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PRODUCTS_URL + `/delFollower?id=${id}&id_nv=${id_nv}&worktype=${worktype}`, { headers: httpHeaders });
	}
	//===========================Cập nhật tình trạng giai đoạn========================
	updateStatusNode(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + `/updateStatusNode`, item, { headers: httpHeaders });
	}
	//===========================Cập nhật hạn chót==================================
	updateDeadline(id: number, date: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PRODUCTS_URL + `/updateDeadline?id=${id}&date=${date}`, { headers: httpHeaders });
	}
	//==============================Follow chi tiết công việc===============================
	FollowNode(id: number, isfollow: boolean, worktype: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PRODUCTS_URL + `/FollowNode?id=${id}&isfollow=${isfollow}&worktype=${worktype}`, { headers: httpHeaders });
	}
	//===========================Cập nhật tình trạng công việc chi tiết========================
	updateStatusToDo(item: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + `/updateStatusToDo`, item, { headers: httpHeaders });
	}

	//================================Các danh sách liên quan đến kanban===========================
	findDataQuyTrinh(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/getProcessList';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	getTasksList_KanBan(queryParams: QueryParamsModelNew): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_TASK + '/kanban';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}
	//===================Cập nhật tùy chọn kéo ngược==============================
	updateOptionBackward(id: number, option: number, stageidlist: string): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/updateOptionBackward?id=${id}&option=${option}&stageidlist=${stageidlist}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	getFollowerList(id: number): Observable<any> {//Lấy danh sách người thẽo dõi nhiệm vụ (Dùng cho quản lý người theo dõi)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/getFollowerList?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	getChildProcess(id: number): Observable<any> {//Lấy danh sách quy trình con theo nhiệm vụ (Dùng cho chuyển tiếp đến wf khác)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/getChildProcess?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	updateTasks(item: any): Observable<any> {//Cập nhật thông tin nhiệm vụ
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + `/updateTasks`, item, { headers: httpHeaders });
	}

	updateProcessImportant(id: number, isimportant: boolean): Observable<any> {//Đánh dấu quy trình quan trọng
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/updateProcessImportant?id=${id}&isImportant=${isimportant}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	updateProcessLock(id: number, isLock: boolean): Observable<any> {//Khóa quy trình
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/updateProcessLock?id=${id}&isLock=${isLock}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	getReasonList(type: any, processid: any): Observable<any> {//Lấy danh sách lý do khi thiết lập quy trình
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/getReasonList?type=${type}&processid=${processid}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	updateReason(item: any): Observable<any> {//Cập nhật lý do khi thiết lập quy trình
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/updateReason`;
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	updateStatusTasks(item: any): Observable<any> {//Đánh dấu tình trạng hoàn thành hay thất bại của nhiệm vụ
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/updateStatusTasks`;
		return this.http.post<any>(url, item, { headers: httpHeaders });
	}

	copyProcess(id: any): Observable<any> {//Nhân bản quy trình
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/copyProcess?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	Delete_Process(id: any): Observable<any> {//Xóa quy trình
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Delete_Process?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	Get_Process_General(itemId: number): Observable<any> {//Lấy chi tiết thông tin quy trình chung
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Get_Process_General?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	Update_Process_General(item): Observable<any> {//Update quy trình chung
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_Process_General', item, { headers: httpHeaders });
	}

	Export_BieuMau(id: number, idbieumau: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = API_Template + `/Export_BieuMau?id=${id}&idbieumau=${idbieumau}`
		return this.http.get(url, {
			headers: httpHeaders,
			responseType: 'blob',
			observe: 'response'
		});
	}
	//==========================================Start chức năng cập nhật giai đoạn (kanban)========================================
	Get_NodeDetail_General(itemId: number): Observable<any> { //Load thông tin giai đoạn
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Get_NodeDetail_General?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	Update_NodeDetail_General(item): Observable<any> { //Lưu cập nhật thông tin (Tab 1)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_NodeDetail_General', item, { headers: httpHeaders });
	}

	Update_ToDo_General(item): Observable<any> { //Cập nhật công việc chi tiết theo giai đoạn (Tab 2)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_ToDo_General', item, { headers: httpHeaders });
	}

	Delete_ToDo_General(itemId: number): Observable<any> {// Xóa xông việc chi tiết theo giai đoạn (Tab 2)
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Delete_ToDo_General?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	Update_ObjectDetails_General(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_ObjectDetails_General', item, { headers: httpHeaders });
	}

	Delete_ObjectDetails_General(id: number, processid: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Delete_ObjectDetails_General?id=${id}&processid=${processid}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	Update_NodeField_General(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_NodeField_General', item, { headers: httpHeaders });
	}

	Delete_NodeField_General(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Delete_NodeField_General?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	handleDropOrgChart(idfrom: any, idto: any, IsAbove: boolean): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/ChuyenViTri_General?idfrom=${idfrom}&idto=${idto}&IsAbove=${IsAbove}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	//============================Giai đoạn quy trình con=========================
	updateForwardInfo_General(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/updateForwardInfo_General', item, { headers: httpHeaders });
	}

	delForwardInfo_General(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/delForwardInfo_General?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	getFieldList_General(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/getFieldList_General?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	//==========================================End chức năng cập nhật giai đoạn (kanban)========================================


	//=====================Tab hoạt động==============================
	getActivityLog(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/activity-log';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	//==========================Tab thành viên============================================================
	getListThanhVien(processid: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/getListThanhVien?processid=${processid}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	//===============Comment==========================
	public getTopicObjectIDByComponentName(componentName: string): Observable<string> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORKFLOW_API + `/api/comments/getByComponentName/${componentName}`;
		return this.http.get(url, {
			headers: httpHeaders,
			responseType: 'text'
		});
	}
	//=======================================Tab báo cáo====================================================
	gettylechuyendoi(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/tylechuyendoi';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	gettrangthai(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/trangthai';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	exportExcel_trangthai(queryParams: QueryParamsModel): Observable<any> {
		queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/exportExcel_trangthai';
		return this.http.get(url, {
			headers: httpHeaders,
			params: httpParams,
			responseType: 'blob',
			observe: 'response'
		});
	}

	getthoigianhoanthanh(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/thoigianhoanthanh';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	exportExcel_thoigianhoanthanh(queryParams: QueryParamsModel): Observable<any> {
		queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/exportExcel_thoigianhoanthanh';
		return this.http.get(url, {
			headers: httpHeaders,
			params: httpParams,
			responseType: 'blob',
			observe: 'response'
		});
	}

	getlydothatbai(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/lydothatbai';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	exportExcel_lydothatbai(queryParams: QueryParamsModel): Observable<any> {
		queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/exportExcel_lydothatbai';
		return this.http.get(url, {
			headers: httpHeaders,
			params: httpParams,
			responseType: 'blob',
			observe: 'response'
		});
	}

	getgiaidoan_nguoithuchien(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/giaidoan-nguoithuchien';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	exportExcel_giaidoan_nguoithuchien(queryParams: QueryParamsModel): Observable<any> {
		queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/exportExcel_giaidoan_nguoithuchien';
		return this.http.get(url, {
			headers: httpHeaders,
			params: httpParams,
			responseType: 'blob',
			observe: 'response'
		});
	}

	getnguoithuchien(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/nguoithuchien';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	exportExcel_nguoithuchien(queryParams: QueryParamsModel): Observable<any> {
		queryParams.more = true;
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_REPORT + '/exportExcel_nguoithuchien';
		return this.http.get(url, {
			headers: httpHeaders,
			params: httpParams,
			responseType: 'blob',
			observe: 'response'
		});
	}

	//===================================Tab biểu mẫu===================================
	Get_DSTemplate(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_Template + '/Get_DSTemplate';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	Update_Template(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_Template + '/Update_Template', item, { headers: httpHeaders });
	}

	Delete_Template(itemId: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_Template}/Delete_Template?id=${itemId}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

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
	Update_Priority(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/updatePriority', item, { headers: httpHeaders });
	}

	updateTaiLieu(item: any): Observable<any> {//Thêm tài liệu cho nhiêm vụ
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + `/updateTaiLieu`, item, { headers: httpHeaders });
	}

	Update_NodePosition(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_NodePosition', item, { headers: httpHeaders });
	}

	Update_TyLe(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_TyLe', item, { headers: httpHeaders });
	}

	Count_Comment(id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_Comment}/show/${id}?ViewLengthComment=999`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

	getActivityLog_Process(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/activity-log';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	getActivityLog_ProcessNode(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		const url = API_PRODUCTS_URL + '/activity-log';
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
			params: httpParams
		});
	}

	//Danh sách giai đoạn thoe quy trình người quản lý
	GetDSGiaiDoan(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/stage/list?id=${id}`;
		return this.http.post<any>(url, id, { headers: httpHeaders });
	}

	updateTaiLieuCongViec(item: any): Observable<any> {//Thêm tài liệu cho công việc
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + `/updateTaiLieuCongViec`, item, { headers: httpHeaders });
	}

	// Start tab công việc liên kết
	Update_DuAn_NhiemVu(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_DuAn_NhiemVu', item, { headers: httpHeaders });
	}

	Update_DuAn_NhiemVu_GD(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_DuAn_NhiemVu_GD', item, { headers: httpHeaders });
	}
	// End tab công việc liên kết
	//=======================Thiết lập khác khi quy trình hoàn tất============================
	other_settings_info(id): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_WF_process + `/other-settings/info?processid=${id}`, { headers: httpHeaders });
	}

	other_settings_update(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_WF_process + '/other-settings/update', item, { headers: httpHeaders });
	}
}
