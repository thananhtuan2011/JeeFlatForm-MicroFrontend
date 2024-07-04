
import { Injectable, Inject, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { BangKhaoSatModel } from '../_models/quan-ly-bang-khao-sat.model';
import { ITableService } from '../../_services/itable.service';
import { HttpUtilsService } from 'projects/jeemeet/src/modules/crud/utils/http-utils.service';
import { environment } from 'projects/jeemeet/src/environments/environment';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';

const API_PRODUCTS_URL = environment.APIROOT + '/api/bang-khao-sat';
const API_GENERAL_URL = environment.APIROOT + '/api/General';
const API_ROOT_URLCH = environment.APIROOT + "/api/quanlycuochop";
@Injectable({
  providedIn: 'root'
})
export class QuanLyBangKhaoSatService extends ITableService<any> implements OnDestroy {
  API_URL_FIND: string = API_PRODUCTS_URL + '';
	API_URL_CTEATE: string = API_PRODUCTS_URL + '';
	API_URL_EDIT: string = API_PRODUCTS_URL + '';
	API_URL_DELETE: string = API_PRODUCTS_URL + '';
	API_URL: string = API_PRODUCTS_URL;

  lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(
		new QueryParamsModel({}, "asc", "", 0, 10)
	);
	allowEdit: boolean;
  constructor(@Inject(HttpClient) http: any, @Inject(HttpUtilsService) httpUtils) {
    super(http, httpUtils);
  }
  getloainhan() {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_ROOT_URLCH}/GetUser`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
  getDSNhanVien(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_GENERAL_URL + `/LoadDSNhanVien`,
			{ headers: httpHeaders }
		);
	}
  GetListAllCauHoi(IdCuocHop: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		//	const url = `${API_ROOT_URL}/GetListAllCauHoi?IdParent=${IdParent}`;
		return this.http.get<any>(
			API_PRODUCTS_URL + `/GetListAllCauHoi/?IdCuocHop=${IdCuocHop}`,
			{ headers: httpHeaders }
		);
		//return this.http.get<any>(url, { headers: httpHeaders });
	}
  // CREATE =>  POST: add a new user to the server
	createQuanLyKhaoSat(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_PRODUCTS_URL + "/InsertBangKhaoSat", item, {
			headers: httpHeaders,
		});
	}

	updateQuanLyKhaoSat(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(
			API_PRODUCTS_URL + "/Update_BangKhaoSat",
			item,
			{ headers: httpHeaders }
		);
	}
  getQuanLyKhaoSatById(Id: any): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(
			API_PRODUCTS_URL + `/GetDetail_BangKhaoSat?id=${Id}`,
			{ headers: httpHeaders }
		);
	}
  deleteQuanLyKhaoSat(Id: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Delete_BangKhaoSat?id=${Id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
  listCuocHop(Id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();

		const url = `${API_PRODUCTS_URL}/GetListAllCuocHop?IdCuocHop=${Id}`;

		return this.http.get<any>(url, { headers: httpHeaders });
	}
  getTitle(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = this.convertItemServerType(item);
		return this.http.post<any>(API_PRODUCTS_URL + "/CreateTitle", data, {
			headers: httpHeaders,
		});

	}

  ActiveQuanLyKhaoSat(IdKhaoSat: any, IsActive: any,IdCuocHop:any,TieuDe:string): Observable<any> {

		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/Active_khaosat?IdKhaoSat=${IdKhaoSat}&IsActive=${IsActive}&IdCuocHop=${IdCuocHop}&TieuDe=${TieuDe}`;
		return this.http.post<any>(url, null, { headers: httpHeaders });
	}
	exportExcel(filter): Observable<any> {

	  const httpHeaders = this.httpUtils.getHTTPHeaders();
	  var url =API_PRODUCTS_URL + `/Excel_DanhSachLayYKien?filter.keys=type|IdCuocHop&filter.vals=${filter.type}|${filter.IdCuocHop}&more=${filter.more}&page=${filter.page}&record=${filter.record}`;
	  return this.http.get<any>(url, { headers: httpHeaders });

	  }
	BatBuocKhaoSat(IdKhaoSat:any,IsBatBuoc:any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_PRODUCTS_URL}/BatTatBatBuoc_khaosat?IdKhaoSat=${IdKhaoSat}&IsBatBuoc=${IsBatBuoc}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}
	copySurvey(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		let data = this.convertItemServerType(item);
		return this.http.post<any>(API_PRODUCTS_URL + "/CopySurvey", data, {
			headers: httpHeaders,
		});

	}
	convertItemServerType(item: BangKhaoSatModel) {
		let rs: any = {};
		Object.assign(rs, item);

		rs.IdKhaoSat = item.IdKhaoSat;
		rs.TieuDe = item.TieuDe;

		return rs;
	}
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
  GetThanhPhanThamDuByIdCuocHop(IdCuocHop:any): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = `${API_ROOT_URLCH}/GetThanhPhanThamDuByIdCuocHop?IdCuocHop=${IdCuocHop}`;
    return this.http.get<any>(url, { headers: httpHeaders });
    }
    sendNotifySurvey(item): Observable<any> {
      const httpHeaders = this.httpUtils.getHTTPHeaders();
      return this.http.post<any>(API_PRODUCTS_URL + "/SendNotifySurvey", item, {
        headers: httpHeaders,
      });
    }
}
