import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'projects/jeeworkflow/src/environments/environment';
import { HttpUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/http-utils.service';
import { CookieService } from 'ngx-cookie-service';
var API_URL = environment.HOST_JEEHR_API + '/api';
const KEY_SSO_TOKEN = 'sso_token';
const KEY_SSO_TOKEN_2 = 'sso_token_2';
@Injectable()
export class DynamicSearchFormService {
    title$: BehaviorSubject<string> = new BehaviorSubject('');
    controls$: BehaviorSubject<any[]> = new BehaviorSubject([]);
    filterResult: BehaviorSubject<any> = new BehaviorSubject({});
    filterResultNV: BehaviorSubject<any> = new BehaviorSubject({});
    searchbox: string = 'keyword'
    search_data$: BehaviorSubject<string> = new BehaviorSubject('');
    key$: BehaviorSubject<string> = new BehaviorSubject('');

    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService,
        private cookieService: CookieService) { }
    public getAuthFromLocalStorage(): any {

        return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
    }
    getToken() {
        const access_token = this.cookieService.get(KEY_SSO_TOKEN) + this.cookieService.get(KEY_SSO_TOKEN_2);
        if (access_token) {
            return access_token
        }
        else {
            const dt = this.getAuthFromLocalStorage();
            const tokenlocal = dt.access_token;
            return tokenlocal
        }

    }

    //clear dữ liệu cũ
    clear() {
        this.title$ = new BehaviorSubject('');
        this.controls$ = new BehaviorSubject([]);
        this.filterResult = new BehaviorSubject({});
        this.searchbox = 'keyword';
        this.search_data$ = new BehaviorSubject('');
        this.key$ = new BehaviorSubject('');
    }

    //Gán dữ liệu option cho module
    setOption(option: any) {
        this.clear();
        this.search_data$.next('');
        if (option.searchbox)
            this.searchbox = option.searchbox;
        if (option.title)
            this.title$.next(option.title);
        if (option.controls)
            this.controls$.next(option.controls);
    }

    //Lưu trữ và trả về giá trị filter
    setFilter(filter, isNV = false) {
        if (!isNV) {
            if (this.filterResult.getValue() !== filter)
                this.filterResult.next(filter);
        } else {
            if (this.filterResultNV.getValue() !== filter)
                this.filterResultNV.next(filter);
        }
    }

    //Xử lý các dữ liệu khóa ngoại
    getInitData(api): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_URL}${api}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    //Xử lý các dữ liệu khóa ngoại search =====Thiên=========
    async getInitDataSearch(api) {
        const access_token = this.getToken();
        let myHeaders1 = new Headers();
        myHeaders1.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        myHeaders1.append('Token', access_token ? access_token : '');
        let reques3 = new Request(`${API_URL}${api}`, {
            method: 'GET',
            headers: myHeaders1
        });

        return fetch(reques3)
            .then((res) => {
                return res.text();//giá trị trả về convert về dạng text
            })
            //trả về giá trị, succes hay ko vào đây check
            .then((resTxt) => {
                return JSON.parse(resTxt);
            })
            //catch nếu có Exception văng ra
            .catch((error) => {
                return error
            });

    }
}
