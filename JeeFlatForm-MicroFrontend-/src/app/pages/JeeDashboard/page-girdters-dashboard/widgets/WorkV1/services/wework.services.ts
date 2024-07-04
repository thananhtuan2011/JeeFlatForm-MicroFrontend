
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from 'src/app/modules/auth/models/query-params.model';
import { TagsModel } from '../../../Model/work-general.model';

const API_Lite = environment.HOST_JEEWORK_API + '/api/wework-lite';
const APIROOTS = environment.HOST_JEEWORK_API;
const API_work_CU = environment.HOST_JEEWORK_API + '/api/work-click-up';
const API_TP_Lite = environment.HOST_JEEWORK_API + '/api/tp-lite';
const API_ROOT_URL = environment.HOST_JEEWORK_API + '/api/menu'; 

@Injectable()
export class JeeWorkLiteService {
    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) {
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

    // setup jee-comment
    getTopicObjectIDByComponentName(componentName: string): Observable<string> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = APIROOTS + `/api/comments/getByComponentName/${componentName}`;
        return this.http.get(url, {
            headers: httpHeaders,
            responseType: 'text'
        });
    }

    LuuLogcomment(model): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = APIROOTS + `/api/comment/luu-log-comment`;
        return this.http.post<any>(url, model, {
            headers: httpHeaders,
        });
    }

    // setup avatar
    Get_listCustom(): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(environment.HOST_JEEWORK_API + `/api/wework-lite/list-custom`, { headers: httpHeaders });
    }
    Insert_custom_widget(Widget: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Lite + `/Insert-custom-widget`, Widget, { headers: httpHeaders });
    }
    Update_custom_widget(Widget: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Lite + `/Update-custom-widget`, Widget, { headers: httpHeaders });
    }
    Get_listCustomWidgetByUser(id): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(environment.HOST_JEEWORK_API + `/api/wework-lite/list-custom-widget-by-user?id=${id}`, { headers: httpHeaders });
    }

    Delete_Custom_Widget(id): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(environment.HOST_JEEWORK_API + `/api/wework-lite/Delete-custom-widget?id=${id}`, { headers: httpHeaders });
    }
    Detail_custom(id): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(environment.HOST_JEEWORK_API + `/api/wework-lite/Detail-custom?id=${id}`, { headers: httpHeaders });
    }

    //==========================================================================
    lite_project_by_manager(keyword: string = ""): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_project_by_manager?keyword=${keyword}`, { headers: httpHeaders });
    }

    ListAllStatusDynamic(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/list-all-status-dynamic`, { headers: httpHeaders });
    }

    UpdateByKey(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_work_CU + '/Update-by-key', item, { headers: httpHeaders });
    }

    ListStatusDynamicNew(id_project_team: any, id_task: any): Observable<any> {// Cập nhật 01/11/21 Demo TN
        const httpHeaders = this.httpUtils.getHTTPHeadersWW();
        return this.http.get<any>(API_TP_Lite + `/list-status-by-config?id_project_team=${id_project_team}&id_task=${id_task}`, { headers: httpHeaders });
    }

    lite_tag(id_project_team: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_Lite + `/lite_tag?id_project_team=${id_project_team}`, { headers: httpHeaders });
	}

    GetRoleWeWork(id_nv: string) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL + `/GetRoleWeWork?id_nv=${id_nv}`, { headers: httpHeaders });
    }
}

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

    lite_tag(id_project_team: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_tag?id_project_team=${id_project_team}`, { headers: httpHeaders });
    }
}
