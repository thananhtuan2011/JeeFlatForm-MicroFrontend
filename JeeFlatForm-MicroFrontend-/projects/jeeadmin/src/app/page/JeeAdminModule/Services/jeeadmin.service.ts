import { HttpClient } from "@angular/common/http";
import { Observable, forkJoin, BehaviorSubject, of } from "rxjs";
import { Inject, Injectable } from "@angular/core"; 
import { environment } from "projects/jeeadmin/src/environments/environment";
import { HttpUtilsService } from "projects/jeeadmin/src/modules/crud/utils/http-utils.service";
import { QueryResultsModel } from "../../../models/query-models/query-results.model";

const API_TAISAN = environment.HOST_JEEADMIN_API + '/api/taisan';
const API_LITE = environment.HOST_JEEADMIN_API + '/api/lite'

@Injectable()
export class JeeAdminService { 

	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	checkAdmin(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_LITE + `/CheckAdminApp`, { headers: httpHeaders });
	}

	GetListPhongHop(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_TAISAN +`/Get_ListTaiSan`, { headers: httpHeaders });
	}
    
	Get_GioDatPhongHop(gio: string): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_LITE + `/Get_GioDatPhongHop?gio=${gio}`, { headers: httpHeaders });
	}

	getUsersByPhong(pbID: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_LITE}/GetUser_ByDepartment?departmentID=${pbID}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}
	
	getList_PhongBan(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_LITE + '/Get_ListDepartment', { headers: httpHeaders });
	}


	/* UI */
	getItemStatusString(status: any): string {
		switch (status) {
			case 0:
				return 'Không duyệt';
			case 1:
				return 'Chờ quản lý duyệt';
			case 2:
				return 'Chờ hành chính xác nhận';
			case 3:
			case 4: //không hiện trạng thái đã giao, trạng thái 4 mới cho tick đã nhận
				return 'Hành chính đã xác nhận';
			case 5:
				return 'Đã nhận văn phòng phẩm';
		}
		return '';
	}

	getBackgroundByStatus(status: any): string {
		switch (status) {
			case 0:
				return 'bgcolor0';
			case 1:
				return 'bgcolor1';
			case 2:
				return 'bgcolor2';
			case 3:
			case 4:
				return 'bgcolor4';
			case 5:
				return 'bgcolor5';
		}
		return '';
	}

	getColorByStatus(status: any): string {
		switch (status) {
			case 0:
				return 'color0';
			case 1:
				return 'color1';
			case 2:
				return 'color2';
			case 3:
			case 4:
				return 'color4';
			case 5:
				return 'color5';
		}
		return '';
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
