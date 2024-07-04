import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
import { environment } from 'projects/jeemeet/src/environments/environment';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';


const API_JeeMeet = environment.APIROOT + '/api/quanlycuochop';
@Injectable()
export class CalendarService {
    lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
    ReadOnlyControl: boolean;
    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) { }

    findDataJeeMeet(queryParams: QueryParamsModel): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_JeeMeet + '/calendar-event';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }
    GetDetail_DuyetByIdCH(RowID: any): Observable<any> {

        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_JeeMeet + `/Get_ChiTietCuocHopAdmin?meetingid=${RowID}`, { headers: httpHeaders });
    }
}
