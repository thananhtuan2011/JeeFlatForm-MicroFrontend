
import {HttpClient} from '@angular/common/http';
import {Observable, forkJoin, BehaviorSubject, of} from 'rxjs';
import {Injectable} from '@angular/core';
import { environment } from 'projects/jeemeeting/src/environments/environment';
import { HttpUtilsService } from 'projects/jeemeeting/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../../models/query-models/query-results.model';

const API_Lite = environment.HOST_JEEWORK_API + '/api/wework-lite';
const APIROOTS = environment.HOST_JEEWORK_API;


@Injectable()
export class JeeWorkLiteService {
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
        return this.http.get<any>(API_Lite + `/lite_account`, {headers: httpHeaders, params: params});
    }

    //get-list-default-view
    list_default_view(filter: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        let params = this.httpUtils.parseFilter(filter);
        return this.http.get<any>(API_Lite + `/get-list-default-view`, {headers: httpHeaders, params: params});
    }

    ListViewByProject(id): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/list-view-project?id_project_team=${id}`, {headers: httpHeaders});
    }

    lite_workgroup(id_project_team: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_workgroup?id_project_team=${id_project_team}`, {headers: httpHeaders});
    }

    lite_tag(id_project_team: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_tag?id_project_team=${id_project_team}`, {headers: httpHeaders});
    }

    lite_milestone(id_project_team: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_milestone?id_project_team=${id_project_team}`, {headers: httpHeaders});
    }

    lite_department(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_department`, {headers: httpHeaders});
    }

    ListTemplateByCustomer(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_template_by_customer`, {headers: httpHeaders});
    }

    lite_department_byuser(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_department_byuser`, {headers: httpHeaders});
    }

    lite_department_folder_byuser(DepartmentID = 0): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_department_folder_byuser?DepartmentID=` + DepartmentID, {headers: httpHeaders});
    }

    lite_tree_department(DepartmentID = 0): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/tree-department?DepartmentID=` + DepartmentID, {headers: httpHeaders});
    }

    lite_project_team_byuser(keyword: string = ''): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_project_team_byuser?keyword=${keyword}`, {headers: httpHeaders});
    }

    lite_project_team_bydepartment(keyword: string = ''): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_project_team_bydepartment?id=${keyword}`, {headers: httpHeaders});
    }

    lite_emotion(id: number = 0): Observable<any> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_emotion?id=${id}`, {headers: httpHeaders});
    }

    getColorName(name): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/get-color-name?name=${name}`, {headers: httpHeaders});
    }

    getRolesByProjects(id_project_team): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/roles-by-project?id_project_team=${id_project_team}`, {headers: httpHeaders});
    }

    GetListField(id, _type, isnewfield): Observable<any> {
        const queryParams = `?id=${id}&_type=${_type}&isnewfield=${isnewfield}`;
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/list-field${queryParams}`, {headers: httpHeaders});
    }

    GetCustomFields(id, columname): Observable<any> {
        const queryParams = `?id=${id}&columname=${columname}`;
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/get-custom-field${queryParams}`, {headers: httpHeaders});
    }

    GetNewField(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/list-new-field`, {headers: httpHeaders});
    }

    GetOptions_NewField(id, fieldID, type): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/get-options-new-field?id=${id}&&fieldID=${fieldID}&&type=${type}`, {headers: httpHeaders});
    }

    //status
    ListStatusDynamic(id_project_team: any,isDepartment = false): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/list-status-dynamic?id_project_team=${id_project_team}&isDepartment=${isDepartment}`, {headers: httpHeaders});
    }

    ListStatusDynamicByDepartment(id_department: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/list-status-dynamic-bydepartment?id_department=${id_department}`, {headers: httpHeaders});
    }

    ListAllStatusDynamic(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/list-all-status-dynamic`, {headers: httpHeaders});
    }
    GetValuesNewFields(id_project_team): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/get-value-new-field?id_project_team=${id_project_team}`, {headers: httpHeaders});
    }

    //#region nhắc nhở
    Get_DSNhacNho(): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/widgets/Get_DSNhacNho`, {headers: httpHeaders});
    }

    Count_SoLuongNhacNho(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(environment.HOST_JEELANDINGPAGE_API + `/api/widgets/Count_SoLuongNhacNho`, {headers: httpHeaders});
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
    Get_listCustom(): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(environment.HOST_JEEWORK_API + `/api/wework-lite/list-custom`, {headers: httpHeaders});
    }
    Insert_custom_widget(Widget:any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Lite + `/Insert-custom-widget`,Widget, {headers: httpHeaders});
    }
    Update_custom_widget(Widget:any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Lite + `/Update-custom-widget`,Widget, {headers: httpHeaders});
    }
    Get_listCustomWidgetByUser(id): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(environment.HOST_JEEWORK_API + `/api/wework-lite/list-custom-widget-by-user?id=${id}`, {headers: httpHeaders});
    }

    Delete_Custom_Widget(id): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(environment.HOST_JEEWORK_API + `/api/wework-lite/Delete-custom-widget?id=${id}`, {headers: httpHeaders});
    }
    Detail_custom(id): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(environment.HOST_JEEWORK_API + `/api/wework-lite/Detail-custom?id=${id}`, {headers: httpHeaders});
    }
}
