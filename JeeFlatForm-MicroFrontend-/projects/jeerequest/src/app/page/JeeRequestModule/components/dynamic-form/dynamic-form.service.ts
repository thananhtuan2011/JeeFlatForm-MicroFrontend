import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs'; 
import { environment } from 'projects/jeerequest/src/environments/environment';
import { HttpUtilsService } from 'projects/jeerequest/src/modules/crud/utils/http-utils.service';
const API_URL = environment.HOST_JEEREQUEST_API + '/api/LoaiYeuCau';
const API = environment.HOST_JEEREQUEST_API + '/api/YeuCau';
@Injectable()
export class DynamicFormService {
	title$: BehaviorSubject<string> = new BehaviorSubject('');
    controls$: BehaviorSubject<any[]> = new BehaviorSubject([]);

    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService, ) { }

		subject = new Subject<any>()
		sendClickEvent(){
			this.subject.next();
		  }
		  getClickEvent():Observable<any>{
			return this.subject.asObservable();
		 }
	//lấy values của control
    getInitData(api): Observable<any> {
		
        const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_URL}${api}`;
        return this.http.get<any>(url, { headers: httpHeaders });
	}
	LuuDataFormDong(item): Observable<any> {
		item 
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(
			API + "/LuuData",
			item,
			{ headers: httpHeaders }
		);
	}
	ChinhSuaDataFormDong(item): Observable<any> {
		item 
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(
			API + "/ChinhSuaYeuCau",
			item,
			{ headers: httpHeaders }
		);
	}
}
