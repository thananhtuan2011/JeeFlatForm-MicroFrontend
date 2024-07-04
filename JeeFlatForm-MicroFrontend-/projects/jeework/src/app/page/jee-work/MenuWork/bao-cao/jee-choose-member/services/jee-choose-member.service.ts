import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'projects/jeework/src/environments/environment';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';

const API_JEEACCOUNT_URL = environment.HOST_JEEACCOUNT_API + '/api';

@Injectable()
export class JeeChooseMemberService {
    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) { }
    getAllUsers(): any {
        const url = API_JEEACCOUNT_URL + '/accountmanagement/usernamesByCustermerID';
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(url, { headers: httpHeaders });
    }
}
