import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { GridType, CompactType, DisplayGrid } from 'angular-gridster2';
import { environment } from 'projects/jeework/src/environments/environment';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { QueryResultsModel } from '../../../models/query-models/query-results.model';
import { DashboardOptions, Widget, WidgetModel } from '../Model/bao-cao-doanh-nghiep.model';
import { ThoiHanCongViecBaoCaoComponent } from '../bao-cao/thoi-han-cong-viec/thoi-han-cong-viec.component';
import { CongViecHoanThanhTrongNgayComponent } from '../bao-cao/cong-viec-hoan-thanh-trong-ngay/cong-viec-hoan-thanh-trong-ngay.component';
import { CongViecMoiTrongNgayComponent } from '../bao-cao/cong-viec-moi-trong-ngay/cong-viec-moi-trong-ngay.component';
import { TongHopCongViecComponent } from '../bao-cao/tong-hop-cong-viec/tong-hop-cong-viec.component';
import { CongViecHoanThanhTheoNgayComponent } from '../bao-cao/cong-viec-hoan-thanh-theo-ngay/cong-viec-hoan-thanh-theo-ngay.component';
interface IDashboardService {
    saveUserDashBoard(): void;
    getDashBoardOptions(): DashboardOptions;
}
const API_PRODUCTS_URL = environment.HOST_JEELANDINGPAGE_API + '/api/widgetwork';
const API_JEEWORK = environment.HOST_JEEWORK_API;
const API_WIDGETS = environment.HOST_JEEWORK_API_2023 + '/api/widgets';
const API_REPORT = environment.HOST_JEEWORK_API_2023 + '/api/report';

@Injectable()
export class BaoCaoDoanhNghiepService implements IDashboardService {
    constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

    saveUserDashBoard(): void { }

    public getWidgets(): Widget[] {
        const listWidget: Widget[] = [
            {
                id: '1',
                name: 'Tổng hợp công việc',
                componentName: 'app-tong-hop-cong-viec',
                componentType: TongHopCongViecComponent,
                cols: 12,
                rows: 7,
                y: 0,
                x: 0,
                vals: '',
            },
            {
                id: '2',
                name: 'Công việc mới trong ngày',
                componentName: 'app-cong-viec-moi-trong-ngay',
                componentType: CongViecMoiTrongNgayComponent,
                cols: 12,
                rows: 7,
                y: 0,
                x: 0,
                vals: '',
            },
            {
                id: '4',
                name: 'Thời hạn công việc',
                componentName: 'bao-cao-thoi-han-cong-viec',
                componentType: ThoiHanCongViecBaoCaoComponent,
                cols: 12,
                rows: 7,
                y: 0,
                x: 0,
                vals: '',
            },
            {
                id: '3',
                name: 'Công việc hoàn thành trong ngày',
                componentName: 'app-cong-viec-hoan-thanh-trong-ngay',
                componentType: CongViecHoanThanhTrongNgayComponent,
                cols: 12,
                rows: 7,
                y: 0,
                x: 0,
                vals: '',
            },
            {
                id: '5',
                name: 'Công việc hoàn thành theo ngày',
                componentName: 'app-cong-viec-hoan-thanh-theo-ngay',
                componentType: CongViecHoanThanhTheoNgayComponent,
                cols: 12,
                rows: 7,
                y: 0,
                x: 0,
                vals: '',
            },
        ];
        return listWidget;
    }

    public getDashBoardOptions(): DashboardOptions {
        return {
            gridType: GridType.ScrollVertical,
            compactType: CompactType.None,
            margin: 10,
            outerMargin: true,
            outerMarginTop: null,
            outerMarginRight: null,
            outerMarginBottom: null,
            outerMarginLeft: null,
            mobileBreakpoint: 734,
            //
            minCols: 24,
            //
            maxCols: 24,
            //
            minRows: 10,
            maxRows: 200,
            //
            maxItemCols: 24,
            //
            minItemCols: 6,
            maxItemRows: 100,
            //
            minItemRows: 4,
            maxItemArea: 2500,
            minItemArea: 1,
            defaultItemCols: 1,
            defaultItemRows: 1,
            fixedColWidth: 68.75,
            fixedRowHeight: 75,
            keepFixedHeightInMobile: false,
            keepFixedWidthInMobile: false,
            scrollSensitivity: 10,
            scrollSpeed: 20,
            enableEmptyCellClick: false,
            enableEmptyCellContextMenu: false,
            enableEmptyCellDrop: false,
            enableEmptyCellDrag: false,
            emptyCellDragMaxCols: 100,
            emptyCellDragMaxRows: 100,
            ignoreMarginInRow: false,
            draggable: {
                delayStart: 0,
                enabled: true,
                ignoreContentClass: 'gridster-item-content',
                ignoreContent: true,
                dragHandleClass: 'drag-handler',
                dropOverItems: false,
            },
            resizable: {
                enabled: true,
            },
            swap: false,
            pushResizeItems: false,
            pushItems: false,
            disablePushOnDrag: false,
            disablePushOnResize: false,
            pushDirections: { north: true, east: true, south: true, west: true },
            displayGrid: function () { },
            //displayGrid: DisplayGrid.None,
            disableWindowResize: false,
            disableWarnings: false,
            scrollToNewItems: false,
            itemChangeCallback: function () { },
            itemResizeCallback: function () { },
        };
    }

    getDSReportConfig(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        const url = API_REPORT + '/Get_DSReportConfig';
        return this.http.get<any>(url, {
            headers: httpHeaders,
        });
    }

    getDSReport(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        const url = API_REPORT + '/Get_DSReport';
        return this.http.get<any>(url, {
            headers: httpHeaders,
        });
    }

    postUpdateWidget(wiget: WidgetModel): Observable<any> {
        //WidgetModel
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        const url = API_REPORT + '/Post_UpdateReport';
        return this.http.post<any>(url, wiget, {
            headers: httpHeaders,
        });
    }

    PostUpdateTitleWidget(wiget: WidgetModel): Observable<any> {
        //WidgetModel
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        const url = API_REPORT + '/Post_UpdateTitleReport';
        return this.http.post<any>(url, wiget, {
            headers: httpHeaders,
        });
    }

    deleteWidget(id: number): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        const url = API_REPORT + `/Delete/ReportId=${id}`;
        return this.http.get<any>(url, {
            headers: httpHeaders,
        });
    }

    createWidget(wiget: WidgetModel): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        const url = API_REPORT + '/Create_Report';
        return this.http.post<any>(url, wiget, {
            headers: httpHeaders,
        });
    }

    checkWidget(): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        const url = API_PRODUCTS_URL + `/CheckUseWidget`;
        return this.http.get<any>(url, {
            headers: httpHeaders,
        });
    }

    public getAuthFromLocalStorage(): any {
        return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
    }

    getNameUser(val) {
        if (val) {
            var list = val.split(' ');
            return list[list.length - 1];
        }
        return "";
    }

    getColorNameUser(fullname) {
        var name = this.getNameUser(fullname).substr(0, 1);
        var result = "#bd3d0a";
        switch (name) {
            case "A":
                result = "rgb(197, 90, 240)";
                break;
            case "Ă":
                result = "rgb(241, 196, 15)";
                break;
            case "Â":
                result = "rgb(142, 68, 173)";
                break;
            case "B":
                result = "#02c7ad";
                break;
            case "C":
                result = "#0cb929";
                break;
            case "D":
                result = "rgb(44, 62, 80)";
                break;
            case "Đ":
                result = "rgb(127, 140, 141)";
                break;
            case "E":
                result = "rgb(26, 188, 156)";
                break;
            case "Ê":
                result = "rgb(51 152 219)";
                break;
            case "G":
                result = "rgb(44, 62, 80)";
                break;
            case "H":
                result = "rgb(248, 48, 109)";
                break;
            case "I":
                result = "rgb(142, 68, 173)";
                break;
            case "K":
                result = "#2209b7";
                break;
            case "L":
                result = "#759e13";
                break;
            case "M":
                result = "rgb(236, 157, 92)";
                break;
            case "N":
                result = "#bd3d0a";
                break;
            case "O":
                result = "rgb(51 152 219)";
                break;
            case "Ô":
                result = "rgb(241, 196, 15)";
                break;
            case "Ơ":
                result = "rgb(142, 68, 173)";
                break;
            case "P":
                result = "rgb(142, 68, 173)";
                break;
            case "Q":
                result = "rgb(91, 101, 243)";
                break;
            case "R":
                result = "rgb(44, 62, 80)";
                break;
            case "S":
                result = "rgb(122, 8, 56)";
                break;
            case "T":
                result = "rgb(120, 76, 240)";
                break;
            case "U":
                result = "rgb(51 152 219)";
                break;
            case "Ư":
                result = "rgb(241, 196, 15)";
                break;
            case "V":
                result = "rgb(142, 68, 173)";
                break;
            case "X":
                result = "rgb(142, 68, 173)";
                break;
            case "W":
                result = "rgb(211, 84, 0)";
                break;
        }
        return result;
    }
    //============================================================================

    getTongHopCongViec(queryParams: QueryParamsModel): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = environment.HOST_JEEWORK_API + '/api/widgets/work-summary';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    getWorkLoad(queryParams: QueryParamsModel): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
        const url = API_JEEWORK + '/api/tp-tasks-pc/work-summary-pc';
        return this.http.get<QueryResultsModel>(url, {
            headers: httpHeaders,
            params: httpParams
        });
    }

    //=========Hàm sử dụng thiết lập thời gian=====================================
    Get_listCustomWidgetByUser(id): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders();
        return this.http.get<any>(API_WIDGETS + `/list-custom-widget-by-user?id=${id}`, { headers: httpHeaders });
    }
    Delete_Custom_Widget(id): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        return this.http.get<any>(API_WIDGETS + `/Delete-custom-widget?id=${id}`, { headers: httpHeaders });
    }
    Insert_custom_widget(Widget: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        return this.http.post<any>(API_WIDGETS + `/Insert-custom-widget`, Widget, { headers: httpHeaders });
    }
    Update_custom_widget(Widget: any): Observable<any> {
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        return this.http.post<any>(API_WIDGETS + `/Update-custom-widget`, Widget, { headers: httpHeaders });
    }
    Detail_custom(id): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        return this.http.get<any>(API_WIDGETS + `/Detail-custom?id=${id}`, { headers: httpHeaders });
    }
    Get_listCustom(): Observable<QueryResultsModel> {
        const httpHeaders = this.httpUtils.getHTTPHeaders(1.3);
        return this.http.get<any>(API_WIDGETS + `/list-custom`, { headers: httpHeaders });
    }
    listrole_filterbyreport(queryParams: QueryParamsModel): Observable<any> {
		const httpHeaders = this.httpUtils.getHTTPHeaders();
		const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
		return this.http.get<any>(API_REPORT + "/list-role-filter-report", {
			headers: httpHeaders,
			params: httpParams,
		});
	}
}
