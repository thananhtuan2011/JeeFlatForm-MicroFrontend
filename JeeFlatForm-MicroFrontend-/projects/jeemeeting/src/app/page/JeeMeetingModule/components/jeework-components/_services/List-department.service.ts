
import {HttpClient} from '@angular/common/http';
import {Observable, forkJoin, BehaviorSubject, of} from 'rxjs';
import {map, retry} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import { environment } from 'projects/jeemeeting/src/environments/environment';
import { HttpUtilsService } from 'projects/jeemeeting/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryParamsModelNew } from '../../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../../models/query-models/query-results.model';

const API_department = environment.HOST_JEEWORK_API + '/api/department';
const API_Project_Team = environment.HOST_JEEWORK_API + '/api/project-team';
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
        return this.http.post<any>(API_department + '/Update', item, {headers: httpHeaders});
    }

    InsertDept(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_department + '/Insert', item, {headers: httpHeaders});
    }

    InsertQuickFolder(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_department + '/Insert-quick-folder', item, {headers: httpHeaders});
    }

    UpdateTemplateCenter(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Template + '/update-template-center', item, {headers: httpHeaders});
    }

    SaveAsTemplateCenter(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Template + '/save-as-template', item, {headers: httpHeaders});
    }

    DeptDetail(id: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_department}/Detail?id=${id}`;
        return this.http.get<any>(url, {headers: httpHeaders});
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
        return this.http.get<any>(url, {headers: httpHeaders});
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
        return this.http.get<any>(url, {headers: httpHeaders});
    }

    UpdatMilestone(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_milestone + '/Update', item, {headers: httpHeaders});
    }

    InsertMilestone(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_milestone + '/Insert', item, {headers: httpHeaders});
    }

    // api template

    Update_Quick_Template(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_Template + '/Update_Quick', item, {headers: httpHeaders});
    }

    Delete_Templete(id, isDelStatus): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Template + `/Delete?id=${id}&&isDelStatus=${isDelStatus}`, {headers: httpHeaders});
    }
}
