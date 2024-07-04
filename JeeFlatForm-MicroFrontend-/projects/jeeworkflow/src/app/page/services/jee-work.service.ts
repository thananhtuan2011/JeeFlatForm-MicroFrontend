import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, BehaviorSubject, of, Subject } from 'rxjs';
import { QueryParamsModel, QueryParamsModelNew } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';
import { WorkViewModel } from '../models/jee-work.model';
import { HttpUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeeworkflow/src/environments/environment';

const API_Project_Team = environment.HOST_JEEWORK_API + '/api/project-team';
const API_My_Work = environment.HOST_JEEWORK_API + '/api/personal';
const API_work = environment.HOST_JEEWORK_API + '/api/work';
const API_tag = environment.HOST_JEEWORK_API + '/api/tag';
// const API_WORK = environment.HOST_JEEWORK_API + '/api/tp-tasks';
const API_Status = environment.HOST_JEEWORK_API + '/api/status-dynamic';
const api_department = environment.HOST_JEEWORK_API + '/api/department';
const api_work_click_up = environment.HOST_JEEWORK_API + '/api/work-click-up';
//=============================================================================
const API_GENERAL = environment.HOST_JEEWORK_API_2023 + '/api/general';
const API_WORK = environment.HOST_JEEWORK_API_2023 + '/api/work';
const API_WE_FIELDS = environment.HOST_JEEWORK_API_2023 + '/api/we-fields';
@Injectable({
    providedIn: 'root'
})
export class ProjectsTeamService {
    lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
    ReadOnlyControl: boolean;
    // khi thao tác thay đổi thông tin dự án thì gọi subject để update dữ liệu
    messageSource = new BehaviorSubject<any>(false);
    currentMessage = this.messageSource.asObservable();

    changeMessage(message) {
        this.messageSource.next(message);
    }

    //end
    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) {
    }




    findDataProjectByDepartment(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_Project_Team + '/List-by-department';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    findAllDataProjectByDepartment(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_Project_Team + '/List-all-by-department';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    listView(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_work + '/List-by-project';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    PeriodView(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_work + '/period-view';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    findListActivities(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_Project_Team + '/List-activities';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    findStreamView(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_work + '/stream-view';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    findUsers(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_GENERAL + '/lite_account';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    InsertProjectTeam(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Project_Team + '/Insert', item, { headers: httpHeaders });
    }

    InsertFasttProjectTeam(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        // headerOptions.set('Content-Type', 'application/json');
        return this.http.post<any>(API_Project_Team + '/Insert_Quick', item, { headers: httpHeaders });
    }

    UpdateProjectTeam(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Project_Team + '/update', item, { headers: httpHeaders });
    }

    UpdateStage(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Project_Team + '/Update-stage', item, { headers: httpHeaders });
    }

    UpdateByKey(id, key, val): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Project_Team + `/update-by-key?id=${id}&key=${key}&value=${val}`, { headers: httpHeaders });
    }

    ClosedProject(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Project_Team + '/Close', item, { headers: httpHeaders });
    }

    OpenProject(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Project_Team + '/Open', item, { headers: httpHeaders });
    }

    Duplicate(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Project_Team + '/Duplicate', item, { headers: httpHeaders });
    }

    //#region quyền
    ListRole(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_Project_Team}/list-role?id_project_team=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    UpdateRole(id, key, role): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Project_Team + `/Update-role?id=${id}&key=${key}&role=${role}`, { headers: httpHeaders });
    }

    //#endregion
    Detail(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_Project_Team}/Detail?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    MyWork(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_My_Work}/my-work`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    OverView(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_Project_Team}/overview?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    DeleteProject(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_Project_Team}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    ChangeType(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_Project_Team}/Change-type?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    LogDetail(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_work}/log-detail?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    //#region member
    List_user(id): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_Project_Team}/List-user?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    Add_user(data: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_Project_Team}/Add-user`;
        return this.http.post<any>(url, data, { headers: httpHeaders });
    }

    Delete_user(id): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_Project_Team}/Delete-user?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    update_user(id, admin): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_Project_Team}/Update-user?id=${id}&admin=${admin}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    favourireproject(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_My_Work}/favourite-project?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    UpdateTags(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_tag + '/Update', item, { headers: httpHeaders });
    }

    InsertTags(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_tag + '/Insert', item, { headers: httpHeaders });
    }

    DeleteTag(id): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_tag}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    //#endregion


    //tìm id department từ id project team
    FindDepartmentFromProjectteam(id) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_Project_Team}/get-department?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    // get data từ work click up
    GetDataWorkCU(queryParams: QueryParamsModelNew): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_WORK + '/list-work';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }
    // get data work mới ok
    ListTask(queryParams: QueryParamsModelNew): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_WORK + '/list-task';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    // drap-drop-item
    DragDropItemWork(item: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WORK + '/drap-drop-item';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    UpdateColumnWork(item: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WE_FIELDS + '/update-column-work';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    UpdateColumnNewField(item: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WE_FIELDS + '/update-column-new-field';//Thiên thao tác 10/10/2022
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    UpdateNewField(item: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WE_FIELDS + '/update_new-field';//Thiên thao tác 10/10/2022
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    InsertTask(item: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WORK + '/Insert-task';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    UpdateTask(item: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WORK + '/Update';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    DeleteTask(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WORK + '/Delete?id=' + id;
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
        });
    }

    _UpdateByKey(item: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WORK + '/Update-by-key';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    ClosedTask(id, closed): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WORK + `/Close?id=${id}&closed=${closed}`;
        return this.http.get<any>(url, {
            headers: httpHeaders,
        });
    }

    Google_Calender(item: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WORK + '/google-calender';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    // get log-detail
    LogDetailCU(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WORK + '/log-detail-by-work?id=' + id;
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
        });
    }

    WorkDetail(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_WORK}/detail-task?id=${id}`;
        // const url = `${API_WORK}/Detail?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    //detail column update
    Detail_column_new_field(id: any, type: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${api_work_click_up}/detail-column-new-field?field=${id}&type=${type}`;//Thiên thao tác 10/10/2022
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    DuplicateCU(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_WORK + '/Duplicate', item, { headers: httpHeaders });
    }

    ListByUserCU(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_WORK + '/my-list';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    ListByFilter(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_WORK + '/list-work-by-filter';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    ListByManageCU(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_WORK + '/list-work-user-by-manager';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    update_hidden(id, type, hidden, isdeleted = false): Observable<any> {
        let query = `id=${id}&&type=${type}&&hidden=${hidden}&&isdeleted=${isdeleted}`;
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = api_work_click_up + '/update-hidden?' + query;//Thiên thao tác 10/10/2022
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
        });
    }

    //
    InsertStatus(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Status + '/Insert', item, { headers: httpHeaders });
    }

    UpdateStatus(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Status + '/Update', item, { headers: httpHeaders });
    }

    DeleteStatus(id): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Status + '/Delete?id=' + id, { headers: httpHeaders });
    }

    Different_Statuses(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Status + '/different-statuses', item, { headers: httpHeaders });
    }

    dropPosition(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Status + '/drop-position', item, { headers: httpHeaders });
    }
    dropPositionTemplate(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Status + '/drop-position-template', item, { headers: httpHeaders });
    }

    // view update
    Add_View(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Project_Team + '/add-view', item, { headers: httpHeaders });
    }

    update_view(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Project_Team + '/update-view', item, { headers: httpHeaders });
    }

    Delete_View(id): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Project_Team + '/delete-view?id=' + id, { headers: httpHeaders });
    }

    department_detail(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${api_department}/Detail?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }
}

//================================================================================================================
const API_department = environment.HOST_JEEWORK_API + '/api/department';
const API_milestone = environment.HOST_JEEWORK_API + '/api/milestone';
const API_Process = environment.HOST_JEEWORK_API + '/api/workprocess';
const API_Template = environment.HOST_JEEWORK_API + '/api/template';

@Injectable()
export class ListDepartmentService {
    lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
    ReadOnlyControl: boolean;

    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) {
    }

    // CREATE =>  POST: add a new oduct to the server
    UpdateDept(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_department + '/Update', item, { headers: httpHeaders });
    }

    InsertDept(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_department + '/Insert', item, { headers: httpHeaders });
    }

    InsertQuickFolder(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_department + '/Insert-quick-folder', item, { headers: httpHeaders });
    }

    UpdateTemplateCenter(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Template + '/update-template-center', item, { headers: httpHeaders });
    }

    SaveAsTemplateCenter(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Template + '/save-as-template', item, { headers: httpHeaders });
    }

    DeptDetail(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_department}/Detail?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    findDataDept(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_department + '/List';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }
    FindProject1(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_Project_Team + '/List-by-department';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    findDataProject(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_Project_Team + '/List-by-department';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    findDataMilestone(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_milestone + '/List';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    Delete_Dept(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_department}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    //=====================Tab hoạt động==============================
    getActivityLog(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_Process + '/getActivityLog';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    Get_MilestoneDetail(itemId: number): Observable<any> {//Lấy chi tiết quy trình
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_milestone}/Detail?id=${itemId}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    UpdatMilestone(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_milestone + '/Update', item, { headers: httpHeaders });
    }

    InsertMilestone(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_milestone + '/Insert', item, { headers: httpHeaders });
    }

    // api template

    Update_Quick_Template(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Template + '/Update_Quick', item, { headers: httpHeaders });
    }

    Delete_Templete(id, isDelStatus): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Template + `/Delete?id=${id}&&isDelStatus=${isDelStatus}`, { headers: httpHeaders });
    }
}

//================================================================================================================
const API_Lite = environment.HOST_JEEWORK_API + '/api/wework-lite';
const APIROOTS = environment.HOST_JEEWORK_API;
const API_TP_Lite = environment.HOST_JEEWORK_API + '/api/tp-lite';

@Injectable()
export class WeWorkService {
    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) {
    }

    // list priority
    list_priority = [
        {
            name: 'Urgent',
            value: 1,
            icon: 'fab fa-font-awesome-flag text-danger',
        },
        {
            name: 'High',
            value: 2,
            icon: 'fab fa-font-awesome-flag text-warning',
        },
        {
            name: 'Normal',
            value: 3,
            icon: 'fab fa-font-awesome-flag text-info',
        },
        {
            name: 'Low',
            value: 4,
            icon: 'fab fa-font-awesome-flag text-muted',
        },
        {
            name: 'Clear',
            value: 0,
            icon: 'fas fa-times text-danger',
        },
    ];

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

    getName(val) {
        var x = val.split(' ');
        return x[x.length - 1];
    }

    list_account(filter: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        let params = this.httpUtils.parseFilter(filter);
        return this.http.get<any>(API_GENERAL + `/lite_account`, { headers: httpHeaders, params: params });
    }
    // https://localhost:44366/api/wework-lite/lite-account-by-project_manager?id=31000&BaoGomUserLogin=true
    list_account_gov(id: any, BaoGomUserLogin: boolean = true): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite-account-by-project_manager?id=${id}&&BaoGomUserLogin${BaoGomUserLogin}`, { headers: httpHeaders });
    }

    list_gov_acc_join_dept(filter: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        let params = this.httpUtils.parseFilter(filter);
        return this.http.get<any>(API_TP_Lite + `/gov-acc-join-dept`, { headers: httpHeaders, params: params });
    }

    //get-list-default-view
    list_default_view(filter: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        let params = this.httpUtils.parseFilter(filter);
        return this.http.get<any>(API_Lite + `/get-list-default-view`, { headers: httpHeaders, params: params });
    }

    ListViewByProject(id): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/list-view-project?id_project_team=${id}`, { headers: httpHeaders });
    }

    lite_workgroup(id_project_team: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_workgroup?id_project_team=${id_project_team}`, { headers: httpHeaders });
    }

    lite_tag(id_project_team: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_tag?id_project_team=${id_project_team}`, { headers: httpHeaders });
    }

    lite_milestone(id_project_team: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_milestone?id_project_team=${id_project_team}`, { headers: httpHeaders });
    }

    lite_department(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_department`, { headers: httpHeaders });
    }

    ListTemplateByCustomer(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_template_by_customer`, { headers: httpHeaders });
    }

    lite_department_byuser(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_department_byuser`, { headers: httpHeaders });
    }

    lite_department_folder_byuser(DepartmentID = 0): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_department_folder_byuser?DepartmentID=` + DepartmentID, { headers: httpHeaders });
    }

    lite_tree_department(DepartmentID = 0): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/tree-department?DepartmentID=` + DepartmentID, { headers: httpHeaders });
    }

    lite_project_team_byuser(keyword: string = ''): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_project_team_byuser?keyword=${keyword}`, { headers: httpHeaders });
    }

    lite_project_team_bydepartment(keyword: string = ''): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_project_team_bydepartment?id=${keyword}`, { headers: httpHeaders });
    }

    lite_emotion(id: number = 0): Observable<any> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_emotion?id=${id}`, { headers: httpHeaders });
    }

    getColorName(name): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/get-color-name?name=${name}`, { headers: httpHeaders });
    }

    getRolesByProjects(id_project_team): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/roles-by-project?id_project_team=${id_project_team}`, { headers: httpHeaders });
    }

    GetListField(id, _type, isnewfield): Observable<any> {
        const queryParams = `?id=${id}&_type=${_type}&isnewfield=${isnewfield}`;
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_WE_FIELDS + `/list-field${queryParams}`, { headers: httpHeaders });
    }

    GetCustomFields(id, columname): Observable<any> {
        const queryParams = `?id=${id}&columname=${columname}`;
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_WE_FIELDS + `/get-custom-field${queryParams}`, { headers: httpHeaders });
    }

    GetNewField(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_WE_FIELDS + `/list-new-field`, { headers: httpHeaders });
    }

    GetOptions_NewField(id, fieldID, type): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_WE_FIELDS + `/get-options-new-field?id=${id}&&fieldID=${fieldID}&&type=${type}`, { headers: httpHeaders });
    }

    //status
    ListStatusDynamic(id_project_team: any, isDepartment = false): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_GENERAL + `/list-status-dynamic?id_project_team=${id_project_team}&isDepartment=${isDepartment}`, { headers: httpHeaders });
    }
    ListStatusDynamicNew(id_project_team: any, id_task: any): Observable<any> {// Cập nhật 01/11/21 Demo TN
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_GENERAL + `/list-status-by-config?id_project_team=${id_project_team}&id_task=${id_task}`, { headers: httpHeaders });
    }

    ListStatusDynamicByDepartment(id_department: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_GENERAL + `/list-status-dynamic-bydepartment?id_department=${id_department}`, { headers: httpHeaders });
    }

    ListAllStatusDynamic(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_GENERAL + `/list-all-status-dynamic`, { headers: httpHeaders });
    }
    GetValuesNewFields(id_project_team): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/get-value-new-field?id_project_team=${id_project_team}`, { headers: httpHeaders });
    }

    //#region nhắc nhở
    Get_DSNhacNho(): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/widgets/Get_DSNhacNho`, { headers: httpHeaders });
    }

    Count_SoLuongNhacNho(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/widgets/Count_SoLuongNhacNho`, { headers: httpHeaders });
    }

    //#region nhắc nhở
    // getTopicObjectIDByComponentName(componentName): Observable<any> {
    //     const httpHeaders = this.httpUtils.getHTTPHeaders();
    // 	const url = APIROOTS + `/api/comments/getByComponentName/${componentName}`;
    //     return this.http.get<any>(url, { headers: httpHeaders });
    // }
    //#endregion

    // setup jee-comment
    getTopicObjectIDByComponentName(componentName: string): Observable<string> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = APIROOTS + `/api/comments/getByComponentName/${componentName}`;
        return this.http.get(url, {
            headers: httpHeaders,
            responseType: 'text'
        });
    }


    // setup avatar
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

    //=====Bổ sung call api đánh dâu xem công việc 28/09/2022
    lite_inset_task_view(item: WorkViewModel): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_Lite + '/insert-task-view';
        return this.http.post<any>(url, item, { headers: httpHeaders });
    }
}

//=================================================================================================================
@Injectable()
export class CommunicateService {

    constructor() { }
    // khúc này giao tiếp service giữa các component
    messageSource = new BehaviorSubject<any>(false);
    currentMessage = this.messageSource.asObservable();
    changeMessage(message) {
        this.messageSource.next(message);
    }
    //end
}

//==================================================================================================================
const API_ROOT_URL = environment.HOST_JEEWORK_API_2023 + '/api/project';
@Injectable()
export class MenuPhanQuyenServices {
    lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
    ReadOnlyControl: boolean;
    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) { }
    GetRole(id: string) {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_ROOT_URL + `/Detail?id=${id}`, { headers: httpHeaders });
    }
}


//=================================================================================================================
const API_personal = environment.HOST_JEEWORK_API + '/api/personal';
const API_filter = environment.HOST_JEEWORK_API + '/api/filter';
const API_checklist = environment.HOST_JEEWORK_API + '/api/checklist';
const API_repeated = environment.HOST_JEEWORK_API + '/api/repeated';
const API_work_group = environment.HOST_JEEWORK_API + '/api/work-group';


@Injectable()
export class WorkService {

    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) {
    }
    lastFilter$: BehaviorSubject<QueryParamsModelNew> = new BehaviorSubject(new QueryParamsModelNew({}, 'asc', '', 0, 10));

    // khúc này giao tiếp service giữa các component
    messageSource = new BehaviorSubject<string>('default message');
    currentMessage = this.messageSource.asObservable();

    buttonSubject: Subject<any> = new Subject();
    buttonObservable = this.buttonSubject.asObservable();

    getEvents(queryParams: QueryParamsModel): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParms = this.httpUtils.getFindHTTPParams(queryParams);

        return this.http.get<any>(API_work + '/list-event',
            { headers: httpHeaders, params: httpParms });

    }

    myList(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_work + '/my-list';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    listFollowing(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_work + '/list-following';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    listByFilter(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_work + '/list-by-filter';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    myStaffList(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_work + '/my-staff-list';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    myStaff(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_personal}/my-staff`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    mymilestone(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_personal}/my-milestone`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    Filter(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_filter}/List`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    list_tag(id_project_team: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(environment.HOST_JEEWORK_API + `/api/wework-lite/lite_tag?id_project_team=${id_project_team}`, { headers: httpHeaders });
    }

    InsertWork(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_work + '/Insert', item, { headers: httpHeaders });
    }

    UpdateWork(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_work + '/Update', item, { headers: httpHeaders });
    }

    Duplicate(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_work + '/Duplicate', item, { headers: httpHeaders });
    }

    WorkDetail(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_work}/Detail?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    WorkDelete(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_work}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    Add_Followers(topic: number, user: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_work}/add-follower?topic=${topic}&&user=${user}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    Delete_Followers(topic: number, user: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_work}/Remove-follower?topic=${topic}&&user=${user}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    CheckList(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_checklist + '/List';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    Update_CheckList(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_checklist + '/Update', item, { headers: httpHeaders });
    }

    Insert_CheckList(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_checklist + '/Insert', item, { headers: httpHeaders });
    }

    Insert_CheckList_Item(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_checklist + '/Insert-item', item, { headers: httpHeaders });
    }

    Update_CheckList_Item(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_checklist + '/Update-item', item, { headers: httpHeaders });
    }

    CheckedItem(id): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_checklist + '/Checked/' + id, { headers: httpHeaders });
    }

    Delete_CheckList(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_checklist}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    DeleteItem(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_checklist}/Delete-item?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    UpdateByKey(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_WORK + '/Update-by-key', item, { headers: httpHeaders });
    }

    UpdateWorkProcess(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_WORK + '/update-work-process', item, { headers: httpHeaders });
    }

    WorkFilter(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_WORK + '/work-filter';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    ImportData(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_WORK + '/ImportData', item, { headers: httpHeaders });
    }

    ExportExcel(params): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpparams = this.httpUtils.getFindHTTPParams(params);
        return this.http.get(API_WORK + '/ExportExcel', { // API_work
            headers: httpHeaders,
            params: httpparams,
            responseType: 'blob',
            observe: 'response'
        });
        // .pipe(
        // 	map((res: any) => {
        // 		var headers = res.headers;
        // 		filename = headers.get('x-filename');
        // 		let blob = new Blob([res.body], { type: 'application/vnd.ms-excel' });
        // 		return blob;
        // 	})
        // );
    }

    DownloadFileImport() {
        const url = `${API_work}/DownloadFileImport`;
        return url;
    }

    // DownloadFileImport(): Observable<any> {
    // 	const httpHeaders = this.httpUtils.getHTTPHeaders();
    // 	const url = `${API_work}/DownloadFileImport`;
    // 	return this.http.get<any>(url, { headers: httpHeaders });
    // }

    findData(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_personal + '/my-staff-overview';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    findDataRepeated(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_repeated + '/List';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    favouritework(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_personal}/favourite-work?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    Add_followers(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_work + '/Add_followers', item, { headers: httpHeaders });
    }

    DeleteWork(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_work}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    ListWorkGroup(queryParams: QueryParamsModelNew): Observable<any> {
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_work_group + '/list', {
            headers: httpHeaders,
            params: httpParams
        });
    }

    InsertWorkGroup(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_work_group + '/Insert', item, { headers: httpHeaders });
    }

    UpdateWorkGroup(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_work_group + '/Update', item, { headers: httpHeaders });
    }

    DeleteWorkGroup(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_work_group}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    CloseWorkGroup(id: number, closed: boolean): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_work_group}/Close?id=${id}&&closed=${closed}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    DetailWorkGroup(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_work_group}/Detail?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    assign(id: number, user: number): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<QueryResultsModel>(API_repeated + `/assign?id=${id}&&user=${user}`, { headers: httpHeaders });
    }

    Locked(id: number, locked: boolean): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<QueryResultsModel>(API_repeated + `/Lock?id=${id}&&locked=${locked}`, { headers: httpHeaders });
    }

    updateProject(id: number, id_project_team: string): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<QueryResultsModel>(API_repeated + `/project_team?id=${id}&&id_project_team=${id_project_team}`, { headers: httpHeaders });
    }

    DeleteRepeatedTask(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_repeated}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    Forcerun(id_repeated: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_repeated}/forcerun?id_repeated=${id_repeated}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    Detail_repeated(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_repeated}/Detail?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    Update_RepeatedTask(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_repeated + '/Update', item, { headers: httpHeaders });
    }

    Insert_RepeatedTask(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_repeated + '/Insert', item, { headers: httpHeaders });
    }

    Sysn_Google_Calender(item: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WORK + '/google-calender';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    changeMessage(message) {
        this.messageSource.next(message);
    }
    LogDetail(id: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WORK + '/log-detail?id=' + id;
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
        });
    }
    LogDetailByWork(id: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_WORK + '/log-detail-by-work?id=' + id;
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
        });
    }
    // end
}

//==================================================================================================================
@Injectable()
export class UpdateByKeyService {
    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) { }

    UpdateByKey(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_work + '/Update-by-key', item, { headers: httpHeaders });
    }
    Update_CheckList(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_checklist + '/Update', item, { headers: httpHeaders });
    }
    Insert_CheckList(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_checklist + '/Insert', item, { headers: httpHeaders });
    }
    Insert_CheckList_Item(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_checklist + '/Insert-item', item, { headers: httpHeaders });
    }
}

//==================================================================================================================
const API_attachment = environment.HOST_JEEWORK_API + '/api/attachment';

@Injectable()
export class AttachmentService {
    lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
    ReadOnlyControl: boolean;

    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) {
    }

    delete_attachment(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_attachment}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    Upload_attachment(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_attachment + '/Insert', item, { headers: httpHeaders });
    }
}

//=============================================================================================================
const API_Tag = environment.HOST_JEEWORK_API + '/api/tag';
@Injectable()
export class TagsService {
    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) { }

    Update(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Tag + '/Update', item, { headers: httpHeaders });
    }
    Insert(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Tag + '/Insert', item, { headers: httpHeaders });
    }
    Delete(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_Tag}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }
}

@Injectable()
export class WorkGeneralService {
    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) {
    }

    list_priority = [
        {
            name: 'Urgent',
            value: 1,
            icon: 'fab fa-font-awesome-flag text-danger',
        },
        {
            name: 'High',
            value: 2,
            icon: 'fab fa-font-awesome-flag text-warning',
        },
        {
            name: 'Normal',
            value: 3,
            icon: 'fab fa-font-awesome-flag text-info',
        },
        {
            name: 'Low',
            value: 4,
            icon: 'fab fa-font-awesome-flag text-muted',
        },
        {
            name: 'Clear',
            value: 0,
            icon: 'fas fa-times text-danger',
        },
    ];

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
    //=========Check quyền thao tác=========
    //===========Thay đổi cách check Rule theo yêu cầu mới ============================
    CheckRules(RuleID: number, element) {
        if (element.Rule) {
            if (element) {
                if (
                    element.IsAdmin === true ||
                    +element.admin === 1 ||
                    +element.owner === 1 ||
                    +element.parentowner === 1
                ) {
                    return true;
                } else {
                    if (
                        RuleID === 7 ||
                        RuleID === 9 ||
                        RuleID === 11 ||
                        RuleID === 12 ||
                        RuleID === 13
                    ) {
                        if (element.Rule.find((element) => element == 15)) {
                            return false;
                        }
                    }
                    if (RuleID === 10) {
                        if (element.Rule.find((element) => element == 16)) {
                            return false;
                        }
                    }
                    if (RuleID === 4 || RuleID === 14) {
                        if (element.Rule.find((element) => element == 17)) {
                            return false;
                        }
                    }
                    const r = element.Rule.find((element) => element == RuleID);
                    if (r) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
        return false;
    }

    CheckRuleskeypermit(key, element) {
        if (element.IsAdmin) {
            return true;
        }
        if (element.Rule) {
            if (element) {
                if (
                    element.IsAdmin === true ||
                    +element.admin === 1 ||
                    +element.owner === 1 ||
                    +element.parentowner === 1
                ) {
                    return true;
                } else {
                    if (
                        key === 'title' ||
                        key === 'description' ||
                        key === 'status' ||
                        key === 'checklist' ||
                        key === 'delete'
                    ) {
                        if (element.Rule.find((r) => r.id_Rule === 15)) {
                            return false;
                        }
                    }
                    if (key === 'deadline') {
                        if (element.Rule.find((r) => r.id_Rule === 16)) {
                            return false;
                        }
                    }
                    if (key === 'id_nv' || key === 'assign') {
                        if (element.Rule.find((r) => r.id_Rule === 17)) {
                            return false;
                        }
                    }
                    const r = element.Rule.find((Rule) => Rule.keypermit == key);
                    if (r) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
        return false;
    }

    CheckClosedTask(item) {
        if (item.closed) {
            return false;
        } else {
            return true;
        }
    }
}