import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'projects/jeeworkflow/src/environments/environment';
import { HttpUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/http-utils.service';
const API_URL = environment.HOST_JEEWORKFLOW_API + '/api/controllergeneral';
const API_PRODUCTS_URL = environment.HOST_JEEWORKFLOW_API + '/api/workprocess';
@Injectable()
export class DynamicFormService {
    title$: BehaviorSubject<string> = new BehaviorSubject('');
    controls$: BehaviorSubject<any[]> = new BehaviorSubject([]);

    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) { }


    Get_ControlsList(itemId: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_PRODUCTS_URL}/Get_FieldsBeginNode?id=${itemId}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    Get_ControlsListNext(itemId: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_PRODUCTS_URL}/Get_FieldsNode?id=${itemId}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    GetImplementerList(itemId: number): Observable<any> {//Lấy danh sách người thực hiện
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_PRODUCTS_URL}/GetImplementerList?id=${itemId}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    getInitData(api): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_URL}${api}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    CreateWorkProcess(item): Observable<any> {//Lưu mới công việc
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_PRODUCTS_URL + '/CreateWorkProcess', item, { headers: httpHeaders });
    }

    Get_NextImplementer(itemId: number): Observable<any> {//Lấy thông tin đê chuyển giai đoạn
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_PRODUCTS_URL}/Get_NextImplementer?id=${itemId}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    Get_FieldsNode(itemId: number, nodelistid: number): Observable<any> {//Lấy thông tin control trong chuyển giai đoạn
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_PRODUCTS_URL}/Get_FieldsNode?id=${itemId}&nodelistid=${nodelistid}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    ChuyenGiaiDoan(item): Observable<any> {//Chuyển giai đoạn
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_PRODUCTS_URL + '/ChuyenGiaiDoan', item, { headers: httpHeaders });
    }

    copyTasks(id:number): Observable<any> {//lấy data nhân bản nhiệm vụ
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_PRODUCTS_URL + `/copyTasks?id=${id}`, { headers: httpHeaders });
    }

    updateThongTinCanNhap(item): Observable<any> {//Cập nhật thông tin chi tiết process-work-details
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_PRODUCTS_URL + '/updateThongTinCanNhap', item, { headers: httpHeaders });
    }

    getNameUser(value: string) {
		return value.substring(0, 1).toUpperCase();
	}

	getColorNameUser(value: any) {
		let result = '';
		switch (value) {
			case 'A':
				return (result = 'rgb(51 152 219)');
			case 'Ă':
				return (result = 'rgb(241, 196, 15)');
			case 'Â':
				return (result = 'rgb(142, 68, 173)');
			case 'B':
				return (result = '#0cb929');
			case 'C':
				return (result = 'rgb(91, 101, 243)');
			case 'D':
				return (result = 'rgb(44, 62, 80)');
			case 'Đ':
				return (result = 'rgb(127, 140, 141)');
			case 'E':
				return (result = 'rgb(26, 188, 156)');
			case 'Ê':
				return (result = 'rgb(51 152 219)');
			case 'G':
				return (result = 'rgb(241, 196, 15)');
			case 'H':
				return (result = 'rgb(248, 48, 109)');
			case 'I':
				return (result = 'rgb(142, 68, 173)');
			case 'K':
				return (result = '#2209b7');
			case 'L':
				return (result = 'rgb(44, 62, 80)');
			case 'M':
				return (result = 'rgb(127, 140, 141)');
			case 'N':
				return (result = 'rgb(197, 90, 240)');
			case 'O':
				return (result = 'rgb(51 152 219)');
			case 'Ô':
				return (result = 'rgb(241, 196, 15)');
			case 'Ơ':
				return (result = 'rgb(142, 68, 173)');
			case 'P':
				return (result = '#02c7ad');
			case 'Q':
				return (result = 'rgb(211, 84, 0)');
			case 'R':
				return (result = 'rgb(44, 62, 80)');
			case 'S':
				return (result = 'rgb(127, 140, 141)');
			case 'T':
				return (result = '#bd3d0a');
			case 'U':
				return (result = 'rgb(51 152 219)');
			case 'Ư':
				return (result = 'rgb(241, 196, 15)');
			case 'V':
				return (result = '#759e13');
			case 'X':
				return (result = 'rgb(142, 68, 173)');
			case 'W':
				return (result = 'rgb(211, 84, 0)');
		}
		return result;
	}
}
