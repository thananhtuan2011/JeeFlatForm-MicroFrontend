
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { getElSeg } from '@fullcalendar/core';
import { environment } from 'projects/jeemeeting/src/environments/environment';
import { QueryParamsModel } from '../../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeemeeting/src/modules/crud/utils/http-utils.service';
import { QueryResultsModel } from '../../../../models/query-models/query-results.model';

const API_ROOT_URL = environment.HOST_JEEWORK_API + '/api/menu';
// const API_ROOT_URL = 'https://api-jeework.vts-demo.com/api/menu';

// const API_ROOT_URL = 'https://api-jeework.vts-demo.com/api/menu';
@Injectable()
export class MenuPhanQuyenServices {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	ReadOnlyControl: boolean;
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	layMenuChucNang(mod: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
			return this.http.get<any>(API_ROOT_URL + `/LayMenuChucNang?v_module=${mod}`, { headers: httpHeaders });
	}
	// Get quyền cấp 2- WeWork
	GetRoleWeWork(id_nv: string) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_ROOT_URL + `/GetRoleWeWork?id_nv=${id_nv}`, { headers: httpHeaders });
	}
	// Get quyền cấp 1 (Menu) - WeWork
	WW_Roles(username): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API + `/api/ww_userrights/GetRolesForUser_WeWork?username=${username}`, { headers: httpHeaders });
	}

}
