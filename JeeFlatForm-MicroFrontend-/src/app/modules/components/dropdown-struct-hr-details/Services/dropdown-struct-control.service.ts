import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { _ParseAST } from '@angular/compiler';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth';
import { QueryParamsModel } from 'src/app/_metronic/core/models/pagram';

const API_JEEACCOUNT_URL = environment.HOST_JEEACCOUNT_API + '/api';
const API_JEEHR_URL = environment.HOST_JEEHR_API + '/api';

@Injectable()
export class DropdownStructControlService {
    lastFilter$: BehaviorSubject<QueryParamsModel> = new BehaviorSubject(new QueryParamsModel({}, 'asc', '', 0, 10));

    constructor(private http: HttpClient,
        private auth: AuthService) { }
    async Get_Text(id: string) {
        const auth = this.auth.getAuthFromLocalStorage();
        let myHeaders1 = new Headers();
        myHeaders1.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        myHeaders1.append('Authorization', `Bearer ${auth.access_token}`);
        let reques3 = new Request(`${API_JEEACCOUNT_URL}` + `/general/DepartmentById/${id}`, {
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

    async Get_Text_HR(id: string) {
        const auth = this.auth.getAuthFromLocalStorage();
        let myHeaders1 = new Headers();
        myHeaders1.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        myHeaders1.append('Authorization', `Bearer ${auth.access_token}`);
        let reques3 = new Request(`${API_JEEHR_URL}` + `/controllergeneral/cocautochucbyid/${id}`, {
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
