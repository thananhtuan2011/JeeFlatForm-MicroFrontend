import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of, Subject } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from 'projects/jeemeeting/src/environments/environment';
import { QueryParamsModel, QueryParamsModelNew } from '../../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeemeeting/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../../models/query-models/query-results.model';

const API_Project_Team = environment.HOST_JEEWORK_API + '/api/project-team';
const API_My_Work = environment.HOST_JEEWORK_API + '/api/personal';
const API_work = environment.HOST_JEEWORK_API + '/api/work';
const API_topic = environment.HOST_JEEWORK_API + '/api/topic';
const API_tag = environment.HOST_JEEWORK_API + '/api/tag';
const API_work_CU = environment.HOST_JEEWORK_API + '/api/work-click-up';
const API_Status = environment.HOST_JEEWORK_API + '/api/status-dynamic';
const api_department = environment.HOST_JEEWORK_API + '/api/department';
const api_template = environment.HOST_JEEWORK_API + '/api/template';
const api_config_notify = environment.HOST_JEEWORK_API + '/api/config-notify';




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


    findDataProject(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_Project_Team + '/List';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
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

    findListTopic(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_topic + '/list';
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

    findGantt(queryParams: QueryParamsModelNew): Observable<any> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_work_CU + '/gantt-view';
        return this.http.get<any>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    find_gantt_editor(queryParams: QueryParamsModelNew): Observable<any> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_work_CU + '/gantt-editor';
        return this.http.get<any>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    findUsers(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_Project_Team + '/lite_account';
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

    get_config_email(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_Project_Team}/get-config-email?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }
    get_list_config(id: any, langcode: string): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${api_config_notify}/get-list-config?id=${id}&langcode=${langcode}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }
    save_notify(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(api_config_notify + '/save_notify', item, { headers: httpHeaders });
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
    Project_Detail(id: any): Observable<any> {
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

    TopicDetail(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_topic}/detail?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    Add_Followers(topic: number, user: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_topic}/add-follower?topic=${topic}&&user=${user}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    Delete_Followers(topic: number, user: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_topic}/Remove-follower?topic=${topic}&&user=${user}`;
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
        const url = API_work_CU + '/list-work';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }
    // get data work mới ok
    ListTask(queryParams: QueryParamsModelNew): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_work_CU + '/list-task-by-status';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    // drap-drop-item
    DragDropItemWork(item: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_work_CU + '/drap-drop-item';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    UpdateColumnWork(item: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_work_CU + '/update-column-work';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    UpdateColumnNewField(item: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_work_CU + '/update-column-new-field';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    UpdateNewField(item: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_work_CU + '/update_new-field';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    InsertTask(item: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_work_CU + '/Insert';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    UpdateTask(item: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_work_CU + '/Update';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    DeleteTask(id: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_work_CU + '/Delete?id=' + id;
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
        });
    }

    _UpdateByKey(item: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_work_CU + '/Update-by-key';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    ClosedTask(id, closed): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_work_CU + `/Close?id=${id}&closed=${closed}`;
        return this.http.get<any>(url, {
            headers: httpHeaders,
        });
    }

    Google_Calender(item: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_work_CU + '/google-calender';
        return this.http.post<QueryResultsModel>(url, item, {
            headers: httpHeaders,
        });
    }

    // get log-detail
    LogDetailCU(id: any): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_work_CU + '/log-detail-by-work?id=' + id;
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
        });
    }

    WorkDetail(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_work_CU}/detail-task?id=${id}`;
        // const url = `${API_work_CU}/Detail?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    //detail column update
    Detail_column_new_field(id: any, type: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_work_CU}/detail-column-new-field?field=${id}&type=${type}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    DuplicateCU(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_work_CU + '/Duplicate', item, { headers: httpHeaders });
    }

    ListByUserCU(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_work_CU + '/my-list';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    ListByFilter(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_work_CU + '/list-work-by-filter';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    ListByManageCU(queryParams: QueryParamsModelNew): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_work_CU + '/list-work-user-by-manager';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    update_hidden(id, type, hidden, isdeleted = false): Observable<QueryResultsModel> {
        let query = `id=${id}&&type=${type}&&hidden=${hidden}&&isdeleted=${isdeleted}`;
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = API_work_CU + '/update-hidden?' + query;
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
    ChangeTemplate(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(api_template + '/change-template', item, { headers: httpHeaders });
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
