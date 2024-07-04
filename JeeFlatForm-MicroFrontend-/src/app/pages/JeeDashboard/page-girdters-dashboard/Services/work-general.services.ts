
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, BehaviorSubject, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { environment } from "src/environments/environment";
import { QueryParamsModel, QueryResultsModel } from "src/app/modules/auth/models/query-params.model";
import { HttpUtilsService } from "src/app/modules/crud/utils/http-utils.service";


const API_Lite = environment.HOST_JEEWORK_API_2023 + '/api/wework-lite';
//=====================================================================
const API_tag = environment.HOST_JEEWORK_API_2023 + '/api/tag';
const API_GENERAL = environment.HOST_JEEWORK_API_2023 + '/api/general';
const API_WORK = environment.HOST_JEEWORK_API_2023 + '/api/work';
const API_STATUS = environment.HOST_JEEWORK_API_2023 + '/api/status';
const API_WIDGETS = environment.HOST_JEEWORK_API_2023 + '/api/widgets';
const API_REPORT = environment.HOST_JEEWORK_API_2023 + '/api/report';

@Injectable()
export class WorkGeneralService {
    constructor(private http: HttpClient,
        private httpUtils: HttpUtilsService) {
    }

    list_priority = [
		{
			name: 'Noset',
			value: 0,
			icon: 'grey-flag',
		},
		{
			name: 'Urgent',
			value: 1,
			icon: 'red-flag',
		},
		{
			name: 'High',
			value: 2,
			icon: 'yellow-flag',
		},
		{
			name: 'Normal',
			value: 3,
			icon: 'blue-flag',
		},
		{
			name: 'Low',
			value: 4,
			icon: 'low-flag',
		},
	];

    public defaultColors: string[] = [
        '#848E9E',
        // 'rgb(187, 181, 181)',
        'rgb(29, 126, 236)',
        'rgb(250, 162, 140)',
        'rgb(14, 201, 204)',
        'rgb(11, 165, 11)',
        'rgb(123, 58, 245)',
        'rgb(238, 177, 8)',
        'rgb(236, 100, 27)',
        'rgb(124, 212, 8)',
        'rgb(240, 56, 102)',
        'rgb(255, 0, 0)',
        'rgb(0, 0, 0)',
        'rgb(255, 0, 255)',
    ];

    getNameUser(val) {
        if (val) {
            var list = val.split(' ');
            return list[list.length - 1];
        }
        return '';
    }

    getColorNameUser(fullname) {
        var name = this.getNameUser(fullname).substr(0, 1);
        switch (name) {
            case 'A':
                return '#6FE80C';
            case 'B':
                return '#02c7ad';
            case 'C':
                return 'rgb(123, 104, 238)';
            case 'D':
                return '#16C6E5';
            case 'Đ':
                return '#959001';
            case 'E':
                return '#16AB6B';
            case 'G':
                return '#2757E7';
            case 'H':
                return '#B70B3F';
            case 'I':
                return '#390FE1';
            case 'J':
                return 'rgb(4, 169, 244)';
            case 'K':
                return '#2209b7';
            case 'L':
                return '#759e13';
            case 'M':
                return 'rgb(255, 120, 0)';
            case 'N':
                return '#bd3d0a';
            case 'O':
                return '#10CF99';
            case 'P':
                return '#B60B6F';
            case 'Q':
                return 'rgb(27, 188, 156)';
            case 'R':
                return '#6720F5';
            case 'S':
                return '#14A0DC';
            case 'T':
                return 'rgb(244, 44, 44)';
            case 'U':
                return '#DC338B';
            case 'V':
                return '#DF830B';
            case 'X':
                return 'rgb(230, 81, 0)';
            case 'W':
                return '#BA08C7';
            default:
                return '#21BD1C';
        }
    }
    //============================================================================================
    lite_project_by_manager(keyword: string = ""): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_GENERAL + `/lite_project_by_manager?keyword=${keyword}`, { headers: httpHeaders });
    }
    lite_project_team_byuser(keyword: string = ""): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_GENERAL + `/lite_project_team_byuser?keyword=${keyword}`, { headers: httpHeaders });
    }
    ListAllStatusDynamic(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_GENERAL + `/list-all-status-dynamic`, { headers: httpHeaders });
    }

    UpdateByKey(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_WORK + '/Update-by-key', item, { headers: httpHeaders });
    }

    ListStatusDynamicNew(id_project_team: any, id_task: any): Observable<any> {// Cập nhật 01/11/21 Demo TN
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_STATUS + `/list-status-by-config?id_project_team=${id_project_team}&id_task=${id_task}`, { headers: httpHeaders });
    }

    lite_tag(id_project_team: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_GENERAL + `/lite_tag?id_project_team=${id_project_team}`, { headers: httpHeaders });
    }

    lite_milestone(id_project_team: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_Lite + `/lite_milestone?id_project_team=${id_project_team}`, { headers: httpHeaders });
    }

    lite_department_by_manager(keyword: string = ""): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_GENERAL + `/lite_department_by_manager?keyword=${keyword}`, { headers: httpHeaders });
    }

    lite_tag_default(id: string = ""): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_GENERAL + `/lite_tag_default`, { headers: httpHeaders });
    }

    list_account(filter: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        let params = this.httpUtils.parseFilter(filter);
        return this.http.get<any>(API_GENERAL + `/list_account_by_department`, {
            headers: httpHeaders,
            params: params,
        });
    }
    //=====Start - Tag==================
    Update(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_tag + '/Update', item, { headers: httpHeaders });
    }
    Insert(item): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_tag + '/Insert', item, { headers: httpHeaders });
    }
    Delete(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        const url = `${API_tag}/Delete?id=${id}`;
        return this.http.get<any>(url, { headers: httpHeaders });
    }

    //--v2
    ListTagByProject(id_project: any) {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = environment.HOST_JEEWORK_API_2023 + `/api/general/lite_customer_tag?id=${id_project}&key=0`;
		return this.http.get<QueryResultsModel>(url, {
			headers: httpHeaders,
		});
	}
    //=========Nhãn=================
	//new
	UpdateTag(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(environment.HOST_JEEWORK_API_2023 + '/api/tag/Update', item, { headers: httpHeaders });
	}
	//new
	InsertTag(item): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(environment.HOST_JEEWORK_API_2023 + '/api/tag/Insert', item, { headers: httpHeaders });
	}
	//new
	DeleteTag(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${environment.HOST_JEEWORK_API_2023}/api/tag/Delete?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

    //=====End - Tag
    //=====Start - Dùng cho button thiết lập điều khiện=====
    Get_listCustomWidgetByUser(id): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_WIDGETS + `/list-custom-widget-by-user?id=${id}`, { headers: httpHeaders });
    }
    Delete_Custom_Widget(id): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_WIDGETS + `/Delete-custom-widget?id=${id}`, { headers: httpHeaders });
    }
    Insert_custom_widget(Widget: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_WIDGETS + `/Insert-custom-widget`, Widget, { headers: httpHeaders });
    }
    Update_custom_widget(Widget: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.post<any>(API_WIDGETS + `/Update-custom-widget`, Widget, { headers: httpHeaders });
    }
    Detail_custom(id): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_WIDGETS + `/Detail-custom?id=${id}`, { headers: httpHeaders });
    }
    Get_listCustom(): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_WIDGETS + `/list-custom`, { headers: httpHeaders });
    }
    //=====End - Dùng cho button thiết lập điều khiện=====
    //=========Check quyền thao tác=========
    //===========Thay đổi cách check Rule theo yêu cầu mới ============================
    CheckRules(RuleID: number, element) {
        if (element.Rule) {
            if (element) {
                if (
                    element.IsAdmin === true ||
                    +element.admin === 1 ||
                    +element.owner === 1 ||
                    +element.parentowner === 1
                ) {
                    return true;
                } else {
                    if (
                        RuleID === 7 ||
                        RuleID === 9 ||
                        RuleID === 11 ||
                        RuleID === 12 ||
                        RuleID === 13
                    ) {
                        if (element.Rule.find((element) => element == 15)) {
                            return false;
                        }
                    }
                    if (RuleID === 10) {
                        if (element.Rule.find((element) => element == 16)) {
                            return false;
                        }
                    }
                    if (RuleID === 4 || RuleID === 14) {
                        if (element.Rule.find((element) => element == 17)) {
                            return false;
                        }
                    }
                    const r = element.Rule.find((element) => element == RuleID);
                    if (r) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
        return false;
    }

    CheckRuleskeypermit(key, element) {
        if (element.IsAdmin) {
            return true;
        }
        if (element.Rule) {
            if (element) {
                if (
                    element.IsAdmin === true ||
                    +element.admin === 1 ||
                    +element.owner === 1 ||
                    +element.parentowner === 1
                ) {
                    return true;
                } else {
                    if (
                        key === 'title' ||
                        key === 'description' ||
                        key === 'status' ||
                        key === 'checklist' ||
                        key === 'delete'
                    ) {
                        if (element.Rule.find((r) => r.id_Rule === 15)) {
                            return false;
                        }
                    }
                    if (key === 'deadline') {
                        if (element.Rule.find((r) => r.id_Rule === 16)) {
                            return false;
                        }
                    }
                    if (key === 'id_nv' || key === 'assign') {
                        if (element.Rule.find((r) => r.id_Rule === 17)) {
                            return false;
                        }
                    }
                    const r = element.Rule.find((Rule) => Rule.keypermit == key);
                    if (r) {
                        return true;
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        }
        return false;
    }

    CheckClosedTask(item) {
        if (item.closed) {
            return false;
        } else {
            return true;
        }
    }

    CheckRule(val, id) {
		if (val.indexOf(id) !== -1) {
			return true;
		}
		return false;
	}
    //========================================================================
    listrole_filterbyreport(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<any>(API_REPORT + "/list-role-filter-report", {
			headers: httpHeaders,
			params: httpParams,
		});
	}

    //=========================================================================
    ts_phongban: string = '';
	ts_thumuc: string = '';
	ts_duan: string = '';
	ts_congviec: string = '';
	//viết hoa chữ đầu
	ts_duan_ToUpper: string = '';
	ts_congviec_ToUpper: string = '';
	ts_phongban_ToUpper: string = '';
	ts_thumuc_ToUpper: string = '';
    cf_ten: string = '0';
	cf_tag: string = '0';
    GetThamSoByCustomer(id: any, checkToUpper: boolean): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(environment.HOST_JEEWORK_API_2023 + `/api/general/get-tham-so-by-customer?id=${id}&checkToUpper=${checkToUpper}`, { headers: httpHeaders });
	}
	getthamso() {
        this.ts_phongban = localStorage.getItem("ts_phongban");
		this.ts_duan = localStorage.getItem("ts_duan");
		this.ts_thumuc = localStorage.getItem("ts_thumuc");
		this.ts_congviec = localStorage.getItem("ts_congviec")
		this.ts_phongban_ToUpper = localStorage.getItem("ts_phongban_ToUpper")
		this.ts_duan_ToUpper = localStorage.getItem("ts_duan_ToUpper")
		this.ts_thumuc_ToUpper = localStorage.getItem("ts_thumuc_ToUpper")
		this.ts_congviec_ToUpper = localStorage.getItem("ts_congviec_ToUpper")
		this.cf_ten = localStorage.getItem("cf_ten")
		this.cf_tag = localStorage.getItem("cf_tag")
		// this.GetThamSoByCustomer(2, false).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_phongban = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(3, false).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_thumuc = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(4, false).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_duan = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(5, false).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_congviec = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(2, true).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_phongban_ToUpper = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(3, true).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_thumuc_ToUpper = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(4, true).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_duan_ToUpper = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(5, true).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.ts_congviec_ToUpper = res.data;
		// 	}
		// })
        // this.GetThamSoByCustomer(32, true).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.cf_ten = res.data;
		// 	}
		// })
		// this.GetThamSoByCustomer(33, true).subscribe(res => {
		// 	if (res.status == 1) {
		// 		this.cf_tag = res.data;
		// 	}
		// })
	}

    gov_account_assignee_by_project(id_project_team: any): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.get<any>(API_GENERAL + `/gov-acc-assignee-by-project?keys=id_project_team&vals=${id_project_team}`, {
			headers: httpHeaders,
		});
	}

    //new
	DeleteTask(id: number): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const url = `${environment.HOST_JEEWORK_API_2023}/api/work/DeleteWork?id=${id}`;
		return this.http.get<any>(url, { headers: httpHeaders });
	}

    //new
	updateTask(item: any): Observable<QueryResultsModel> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		return this.http.post<any>(environment.HOST_JEEWORK_API_2023 + '/api/work/Update-by-key', item, { headers: httpHeaders, });
	}
}
