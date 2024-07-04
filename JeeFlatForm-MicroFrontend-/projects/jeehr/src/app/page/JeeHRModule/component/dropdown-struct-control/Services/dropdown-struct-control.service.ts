import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { _ParseAST } from '@angular/compiler';
import { environment } from 'projects/jeehr/src/environments/environment';
import { QueryParamsModel } from '../../../../models/query-models/query-params.model';
import { HttpUtilsService } from 'projects/jeehr/src/modules/crud/utils/http-utils.service';

const API_PRODUCTS_URL = environment.HOST_JEELANDINGPAGE_API;

@Injectable()
export class DropdownStructControlService {
    lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService,) { }

    async Get_CoCauToChuc_Add(IsAdd: boolean = true) {
        const token = this.httpUtils.getToken();
        let myHeaders1 = new Headers();
        myHeaders1.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        myHeaders1.append('Token', token["value"] ? token["value"] : '');
        let reques3 = new Request(`${API_PRODUCTS_URL}` + `/controllergeneral/Get_CoCauToChuc_HR?IsAdd=${IsAdd}`, {
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

    async Get_Text(id: string) {
        const token = this.httpUtils.getToken();
        let myHeaders1 = new Headers();
        myHeaders1.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        myHeaders1.append('Token', token["value"] ? token["value"] : '');
        let reques3 = new Request(`${API_PRODUCTS_URL}` + `/controllergeneral/cocautochucbyid/${id}`, {
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


    async Get_CoCauToChuc(IsAdd: boolean, IsUnit: boolean) {
        const token = this.httpUtils.getToken();
        let myHeaders1 = new Headers();
        myHeaders1.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        myHeaders1.append('Token', token["value"] ? token["value"] : '');
        let reques3 = new Request(`${API_PRODUCTS_URL}` + `/controllergeneral/Get_CoCauToChuc_HR?IsAdd=${IsAdd}&IsUnit=${IsUnit}`, {
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

    async Get_CoCauToChuc_Details(id: any) {
        const token = this.httpUtils.getToken();
        let myHeaders1 = new Headers();
        myHeaders1.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        myHeaders1.append('Token', token["value"] ? token["value"] : '');
        let reques3 = new Request(`${API_PRODUCTS_URL}` + `/controllergeneral/cocautochuc/${id}`, {
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


    Get_CoCauCongViec(id: number = 0): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get(API_PRODUCTS_URL + `/api/nlsx/work-in-progress/`+id, { headers: httpHeaders });

    }
}
