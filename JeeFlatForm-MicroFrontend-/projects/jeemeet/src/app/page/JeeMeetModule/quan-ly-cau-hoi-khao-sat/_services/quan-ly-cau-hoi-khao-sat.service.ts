
import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITableService } from '../../_services/itable.service';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeemeet/src/environments/environment';

const API_PRODUCTS_URL = environment.APIROOT + '/api/cau-hoi-khao-sat';
@Injectable({
  providedIn: 'root'
})
export class QuanLyCauHoiKhaoSatService extends ITableService<any> implements OnDestroy {
  API_URL_FIND: string = API_PRODUCTS_URL + '';
	API_URL_CTEATE: string = API_PRODUCTS_URL + '';
	API_URL_EDIT: string = API_PRODUCTS_URL + '';
	API_URL_DELETE: string = API_PRODUCTS_URL + '';
	API_URL: string = API_PRODUCTS_URL;
  constructor(@Inject(HttpClient) http: any, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  getloainhan(StrDonVi:string=''){
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.APIROOT + '/nguoidan' + `/DanhSachCongDan?query.more=true` + (StrDonVi==''?'':`&query.filter.keys=DonVi&query.filter.vals=${StrDonVi}`), { headers: httpHeaders });
	}
	getListKhaoSat(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PRODUCTS_URL + `/GetListAllKhaoSat`, { headers: httpHeaders });
	  }

	GetListAllCauTraLoi(): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/GetListAllCauTraLoi`;
		return this.http.get<any>(url, { headers: httpHeaders });
	  }


	getQuanLyCauHoiKhaoSatById(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_PRODUCTS_URL + `/GetDetail_CauHoiKhaoSat?id=${Id}`, { headers: httpHeaders });
	}

	deleteQuanLyCauHoiKhaoSat(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Delete_CauHoiKhaoSat?id=${Id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}


	// CREATE =>  POST: add a new user to the server
	createQuanLyCauHoiKhaoSat(item): Observable<any> {
	//
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = this.convertItemServerType(item);
		return this.http.post<any>(API_PRODUCTS_URL + '/InsertCauHoiKhaoSat', data, { headers: httpHeaders });
	}
	createQuanLyCauTraLoi(item): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = this.convertItemServerType(item);
		return this.http.post<any>(API_PRODUCTS_URL + '/InsertCauTraLoi', data, { headers: httpHeaders });
	}
	updateQuanLyCauHoiKhaoSat(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = this.convertItemServerType(item);
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_CauHoiKhaoSat', data, { headers: httpHeaders });
	}
	updateCauTraLoi(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = this.convertItemServerType(item);
		return this.http.post<any>(API_PRODUCTS_URL + '/Update_CauTraLoi', data, { headers: httpHeaders });
	}
	convertItemServerType(item: any) {

		let rs: any = {};
		Object.assign(rs, item);

		rs.Id = item.Id;
		rs.NoiDungCauHoi = item.NoiDungCauHoi;

		return rs;
	  }
}
