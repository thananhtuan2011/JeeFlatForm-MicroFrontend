
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpUtilsService } from 'projects/jeemeeting/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeemeeting/src/environments/environment';
const API_filter = environment.HOST_JEEWORK_API + '/api/tag';

@Injectable()
export class TagsService {
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	Update(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_filter + '/Update', item, { headers: httpHeaders });
	}
	Insert(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_filter + '/Insert', item, { headers: httpHeaders });
	}
	Delete(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_filter}/Delete?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
}
