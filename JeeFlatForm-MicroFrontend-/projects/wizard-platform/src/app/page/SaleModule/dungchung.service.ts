import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { environment } from 'projects/wizard-platform/src/environments/environment';
import { HttpUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { QueryResultsModel } from '../models/query-models/query-results.model';

const API_URL = environment.HOST_JEESALE_API + '/api/lite';

@Injectable()
export class DungChungService {
	lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));
	numDecimal: number = 2;
	
	constructor(private http: HttpClient,
		private httpUtils: HttpUtilsService) { }

	getListTypeCus(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(`${API_URL}/Get_ListTypeCus`, { headers: httpHeaders });
	}

	getListTradeMark(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + '/Get_ListTradeMark', { headers: httpHeaders });
	}

	getListOrigin(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + '/Get_ListOrigin', { headers: httpHeaders });
	}

	getListAgency(Check: boolean=true): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + '/Get_ListAgency/'+Check, { headers: httpHeaders });
	}

	getListCalUnit(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + '/Get_ListCalUnit', { headers: httpHeaders });
	}

	getListProvince(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + '/Get_ListProvince', { headers: httpHeaders });
	}

	getListDistrict(idTinhThanh: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(`${API_URL}/Get_ListDistrict?IdP=${idTinhThanh}`, { headers: httpHeaders });
	}

	getListWard(idQuanHuyen: number): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(`${API_URL}/Get_ListWard?IdP=${idQuanHuyen}`, { headers: httpHeaders });
	}

	getListTypeGoods(isParent: boolean, loai: number=-1): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(`${API_URL}/Get_ListTypeGoods/${isParent}?loai=` + loai, { headers: httpHeaders });
	}

	getListImExSum(loai: number = -1): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(`${API_URL}/Get_ListImExSum/${loai}`, { headers: httpHeaders });
	}

	getListWareHouse(idCN: number=0, Check: boolean=true): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(`${API_URL}/Get_ListWareHouse?IdCN=${idCN}&Check=${Check}`, { headers: httpHeaders });
	}

	getListGoods(idNCC: string=""): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(`${API_URL}/GetListGoods?IdNCC=${idNCC}`, { headers: httpHeaders });
	}

	getListSupp(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + '/Get_ListSupp', { headers: httpHeaders });
	}

	getListCustomer(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + '/Get_ListCustomer', { headers: httpHeaders });
	}

	getListPaymentway(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + '/Get_ListPaymentway', { headers: httpHeaders });
	}

	getListObj(IdObjValue: any = 0) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		var url = "";
		switch (Number(IdObjValue)) {
			case 0:
				url = '/Get_ListCustomer'
				break;
			case 1:
				url = '/Get_ListSupp'
				break;
		}
		return this.http.get<QueryResultsModel>(API_URL + url, { headers: httpHeaders });
	}

	getListInventory(idK : number=0): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(`${API_URL}/Get_ListInventory/${idK}`, { headers: httpHeaders });
	}

	getListInventory2(idK : number=0): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(`${API_URL}/Get_ListInventory2/${idK}`, { headers: httpHeaders });
	}

	getList_PhongBan(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + '/Get_ListDepartment', { headers: httpHeaders });
	}

	getUsersByPhong(pbID: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${API_URL}/GetUser_ByDepartment?departmentID=${pbID}`;
		return this.http.get<any>(url, {
			headers: httpHeaders,
		});
	}

	uploadFile(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(API_URL + '/UpLoadFile', item, { headers: httpHeaders });
	}

	checkRole(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_URL + '/CheckRole/'+id, { headers: httpHeaders });
	}

	getDateFilter(): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_URL + '/get-date-filter', { headers: httpHeaders });
	}

	getGio(): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<QueryResultsModel>(API_URL + '/GetGio', { headers: httpHeaders });
	}


	// ====================================================

	f_currency_V2(value: string): any {
		if (value == null || value == undefined || value == '') value = '0';
		let tmp = Number.parseFloat(value).toFixed(this.numDecimal) //làm tròn bao nhiêu số thập phân
		let nbr = Number((tmp + '').replace(/,/g, ""));
		return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	}

	f_convertDateTime(date: string) {
		var componentsDateTime = date.split("/");
		var date = componentsDateTime[0];
		var month = componentsDateTime[1];
		var year = componentsDateTime[2];
		var formatConvert = year + "-" + month + "-" + date + "T00:00:00.0000000";
		return new Date(formatConvert);
	}
}