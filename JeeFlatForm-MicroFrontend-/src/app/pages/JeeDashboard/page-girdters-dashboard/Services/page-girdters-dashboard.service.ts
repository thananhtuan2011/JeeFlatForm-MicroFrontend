import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { Injectable } from '@angular/core';
import { DashboardOptions, Widget, WidgetModel } from '../Model/page-girdters-dashboard.model';
import { GridType, CompactType, DisplayGrid } from 'angular-gridster2';
import { ListMembersWidgetComponent } from '../widgets/member-widget/member-widget.component';
import { TrangThaiCongViecWidgetComponent } from '../widgets/trang-thai-cong-viec-widget/trang-thai-cong-viec-widget.component';
import { MyWorksWidgetComponent } from '../widgets/my-works-widget/my-works-widget.component';
import { WorksByProjectComponent } from '../widgets/works-by-project/works-by-project.component';
import { TongHopDuAnWidgetComponent } from '../widgets/tong-hop-du-an-widget/tong-hop-du-an-widget.component';
import { BieuDoTheoDoiWidgetComponent } from '../widgets/bieu-do-theo-doi/bieu-do-theo-doi-widget.component';
import { BieuDoWidget18Component } from '../widgets/widget-18/widget-18.component';
import { BieuDoWidget19Component } from '../widgets/widget-19/widget-19.component';
import { MyWorksWidget20Component } from '../widgets/widget-20/my-works-widget-20.component';
import { MyWorksWidget21Component } from '../widgets/widget-21/my-works-widget-21.component';
import { MyWorksWidget22Component } from '../widgets/widget-22/my-works-widget-22.component';
import { MyWorksWidget23Component } from '../widgets/widget-23/my-works-widget-23.component';
import { MyWorksWidget24Component } from '../widgets/widget-24/my-works-widget-24.component';
import { WorksByProject25Component } from '../widgets/widget-25/works-by-project-25.component';
import { WidgetCongViecQuanTrongComponent } from '../widgets/widget-cong-viec-quan-trong/widget-cong-viec-quan-trong.component';
import { WidgetTheoDoiNhiemVuDaGiaoComponent } from '../widgets/widget-theo-doi-nhiem-vu-da-giao/widget-theo-doi-nhiem-vu-da-giao.component';
import { WidgetNhiemVuTheoNguoiGiaoComponent } from '../widgets/widget-nhiem-vu-theo-nguoi-giao/widget-nhiem-vu-theo-nguoi-giao.component';
import { WidgetTongHopCongViecComponent } from '../widgets/widget-tong-hop-cong-viec/widget-tong-hop-cong-viec.component';
import { WidgetKhoiLuongCongViecComponent } from '../widgets/widget-khoi-luong-cong-viec/widget-khoi-luong-cong-viec.component';
import { ChartTheoDoiNhiemVuWidgetComponent } from '../widgets/chart-theo-doi-nhiem-vu-widget/chart-theo-doi-nhiem-vu-widget.component';
import { ListWorksDraftComponent } from '../widgets/list-works-draft/list-works-draft.component';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';
import { QueryParamsModel, QueryResultsModel } from 'src/app/modules/auth/models/query-params.model';
import { WidgetYeuCauVPPComponent } from '../widgets/widget-yeu-cau-vpp/widget-yeu-cau-vpp.component';
import { NhacNhoNhiemVuDaGiaoWidgetComponent } from '../widgets/nhac-nho-nhiem-vu-da-giao-widget/nhac-nho-nhiem-vu-da-giao-widget.component';
import { NhacNhoNhiemVuDuocGiaoWidgetComponent } from '../widgets/nhac-nho-nhiem-vu-duoc-giao-widget/nhac-nho-nhiem-vu-duoc-giao-widget.component';
import { DanhSachNhiemVuDonViDuocGiaoWidgetComponent } from '../widgets/danh-sach-nhiem-vu-don-vi-duoc-giao-widget/danh-sach-nhiem-vu-don-vi-duoc-giao-widget.component';
import { ListMembersWidgetV1Component } from '../widgets/WorkV1/member-widget/member-widget-v1.component';
import { MyWorksWidgetV1Component } from '../widgets/WorkV1/my-works-widget/my-works-widget-v1.component';
import { TrangThaiCongViecWidgetV1Component } from '../widgets/WorkV1/trang-thai-cong-viec-v1/trang-thai-cong-viec-widget-v1.component';
import { WorksByProjectV1Component } from '../widgets/WorkV1/works-by-project-v1/works-by-project-v1.component';
import { DanhSachChucNangWidgetComponent } from '../widgets/danh-sach-chuc-nang/danh-sach-chuc-nang.component';

interface IDashboardService {
  saveUserDashBoard(): void;
  getDashBoardOptions(): DashboardOptions;
}
const API_PRODUCTS_URL = environment.HOST_JEELANDINGPAGE_API + '/api/widgetdashboard';
const API_JEEWORK = environment.HOST_JEEWORK_API_2023;
const API_LANDINGPAGE_WIZARD = environment.HOST_JEELANDINGPAGE_API + '/api/wizard';

@Injectable()
export class PageGirdtersDashboardService implements IDashboardService {
  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }

  saveUserDashBoard(): void { }

  public getWidgets(): Widget[] {
    const listWidget: Widget[] = [
      {
        id: '1',
        name: 'Chức năng',
        componentName: 'm-danh-sach-chuc-nang',
        componentType: DanhSachChucNangWidgetComponent,
        cols: 12,
        rows: 4,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '2',
        name: 'Tổng hợp nhiệm vụ',
        componentName: 'member-widget',
        componentType: ListMembersWidgetComponent,
        cols: 12,
        rows: 5,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '3',
        name: 'Yêu cầu văn phòng phẩm',
        componentName: 'widget-yeu-cau-vpp',
        componentType: WidgetYeuCauVPPComponent,
        cols: 12,
        rows: 5,
        y: 0,
        x: 0,
        vals: '',
      },
      // {
      //   id: '5',
      //   name: 'Yêu cầu chờ duyệt',
      //   componentName: 'widget-yeu-cau-cho-duyet',
      //   componentType: ListYeuCauChoDuyetWidgetComponent,
      //   cols: 12,
      //   rows: 5,
      //   y: 0,
      //   x: 0,
      //   vals: '',
      // },
      // {
      //   id: '6',
      //   name: 'Danh sách dự án',
      //   componentName: 'projects-team-widget',
      //   componentType: ListProjectsTeamWidgetComponent,
      //   cols: 12,
      //   rows: 5,
      //   y: 0,
      //   x: 0,
      //   vals: '',
      // },
      {
        id: '7',
        name: 'Nhiệm vụ được giao',//Công việc của tôi
        componentName: 'my-works-widget',
        componentType: MyWorksWidgetComponent,
        cols: 12,
        rows: 5,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '9',
        name: 'Thời hạn nhiệm vụ',
        componentName: 'trang-thai-cong-viec-widget',
        componentType: TrangThaiCongViecWidgetComponent,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '10',
        name: 'Danh sách nhiệm vụ',
        componentName: 'works-by-project',
        componentType: WorksByProjectComponent,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      // {
      //   id: '11',
      //   name: 'Hoạt động dự án',
      //   componentName: 'works-by-project',
      //   componentType: WorksByProjectComponent,
      //   cols: 12,
      //   rows: 7,
      //   y: 0,
      //   x: 0,
      //   vals: '',
      // },
      // {
      //   id: '14',
      //   name: 'Nhiệm vụ của tôi',
      //   componentName: 'kt-nhiem-vu-cua-toi',
      //   componentType: NhiemVuWidgetComponent,
      //   cols: 12,
      //   rows: 7,
      //   y: 0,
      //   x: 0,
      //   vals: '',
      // },
      {
        id: '16',
        name: 'Theo dõi tình hình thực hiện nhiệm vụ',
        componentName: 'tong-hop-du-an-widget',
        componentType: TongHopDuAnWidgetComponent,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '17',
        name: 'Trạng thái nhiệm vụ',
        componentName: 'bieu-do-theo-doi-widget',
        componentType: BieuDoTheoDoiWidgetComponent,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '18',
        name: 'Tổng hợp thời hạn nhiệm vụ',
        componentName: 'widget-18',
        componentType: BieuDoWidget18Component,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '19',
        name: 'Tổng hợp trạng thái nhiệm vụ',
        componentName: 'widget-19',
        componentType: BieuDoWidget19Component,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '20',
        name: 'Mức độ ưu tiên của nhiệm vụ được giao',
        componentName: 'my-works-widget-20',
        componentType: MyWorksWidget20Component,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '21',
        name: 'Mức độ ưu tiên của nhiệm vụ đã giao',
        componentName: 'my-works-widget-21',
        componentType: MyWorksWidget21Component,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '22',
        name: 'Nhiệm vụ được giao theo thẻ',
        componentName: 'my-works-widget-22',
        componentType: MyWorksWidget22Component,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '23',
        name: 'Nhiệm vụ đã giao theo thẻ',
        componentName: 'my-works-widget-23',
        componentType: MyWorksWidget23Component,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '24',
        name: 'Nhiệm vụ được giao',
        componentName: 'my-works-widget-24',
        componentType: MyWorksWidget24Component,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '25',
        name: 'Nhiệm vụ đã giao',
        componentName: 'works-by-project-25',
        componentType: WorksByProject25Component,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '26',
        name: 'Công việc quan trọng',
        componentName: 'widget-cong-viec-quan-trong',
        componentType: WidgetCongViecQuanTrongComponent,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '27',
        name: 'Theo dõi nhiệm vụ đã giao',
        componentName: 'widget-theo-doi-nhiem-vu-da-giao',
        componentType: WidgetTheoDoiNhiemVuDaGiaoComponent,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '28',
        name: 'Nhiệm vụ theo người giao',
        componentName: 'widget-nhiem-vu-theo-nguoi-giao',
        componentType: WidgetNhiemVuTheoNguoiGiaoComponent,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '29',
        name: 'Tổng hợp công việc',
        componentName: 'widget-tong-hop-cong-viec',
        componentType: WidgetTongHopCongViecComponent,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '30',
        name: 'Khối lượng công việc',
        componentName: 'widget-khoi-luong-cong-viec',
        componentType: WidgetKhoiLuongCongViecComponent,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '31',
        name: 'Biểu đồ tình hình thực hiện nhiệm vụ',
        componentName: 'chart-theo-doi-nhiem-vu-widget',
        componentType: ChartTheoDoiNhiemVuWidgetComponent,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '32',
        name: 'Danh sách lưu tạm',//Công việc của tôi
        componentName: 'list-works-draft',
        componentType: ListWorksDraftComponent,
        cols: 12,
        rows: 5,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '33',
        name: 'Nhắc nhở nhiệm vụ đã giao',
        componentName: 'nhac-nho-nhiem-vu-da-giao-widget',
        componentType: NhacNhoNhiemVuDaGiaoWidgetComponent,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '34',
        name: 'Nhắc nhở nhiệm vụ được giao',
        componentName: 'nhac-nho-nhiem-vu-duoc-giao-widget',
        componentType: NhacNhoNhiemVuDuocGiaoWidgetComponent,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '36',
        name: 'Danh sách nhiệm vụ đơn vị được giao',
        componentName: 'danh-sach-nhiem-vu-don-vi-duoc-giao-widget',
        componentType: DanhSachNhiemVuDonViDuocGiaoWidgetComponent,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      //=====Start dùng cho WorkV1======
      {
        id: '37',
        name: 'Tổng hợp nhiệm vụ',
        componentName: 'member-widget-v1',
        componentType: ListMembersWidgetV1Component,
        cols: 12,
        rows: 5,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '38',
        name: 'Nhiệm vụ được giao',
        componentName: 'my-works-widget-v1',
        componentType: MyWorksWidgetV1Component,
        cols: 12,
        rows: 5,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '39',
        name: 'Thời hạn nhiệm vụ',
        componentName: 'trang-thai-cong-viec-widget-v1',
        componentType: TrangThaiCongViecWidgetV1Component,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      {
        id: '40',
        name: 'Danh sách nhiệm vụ',
        componentName: 'works-by-project-v1',
        componentType: WorksByProjectV1Component,
        cols: 12,
        rows: 7,
        y: 0,
        x: 0,
        vals: '',
      },
      //=====End dùng cho WorkV1========
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

  getDSWidgetConfig(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/Get_DSWidgetConfig';
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  getDSWidget(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/Get_DSWidget';
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  postUpdateWidget(wiget: WidgetModel): Observable<any> {
    //WidgetModel
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/Post_UpdateWidget';
    return this.http.post<any>(url, wiget, {
      headers: httpHeaders,
    });
  }

  PostUpdateTitleWidget(wiget: WidgetModel): Observable<any> {
    //WidgetModel
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/Post_UpdateTitleWidget';
    return this.http.post<any>(url, wiget, {
      headers: httpHeaders,
    });
  }

  deleteWidget(id: number): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/Delete/WidgetId=${id}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  createWidget(wiget: WidgetModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + '/Create_Widget';
    return this.http.post<any>(url, wiget, {
      headers: httpHeaders,
    });
  }

  checkWidget(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_PRODUCTS_URL + `/CheckUseWidget`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  getTongHopCongViec(queryParams: QueryParamsModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = environment.HOST_JEEWORK_API_2023 + '/api/widgets/work-summary';
    //loaicongviec: 0:tất cả, 1:được giao, 2:tôi giao, 3:tôi theo dõi, 4:tôi tạo
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  getWorkLoad(queryParams: QueryParamsModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.httpUtils.getFindHTTPParams(queryParams);
    const url = API_JEEWORK + '/api/widgets/work-summary-pc';
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
      params: httpParams
    });
  }

  public getAuthFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }

  getCode(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    return this.http.get<any>(environment.HOST_JEEACCOUNT_API + '/api/accountpassword/getCode', {
      headers: httpHeaders,
    });
  }

  getChucNang(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = environment.HOST_JEELANDINGPAGE_API + '/api/menu/Get_Menu_ChucNang';
    return this.http.get<QueryResultsModel>(url, {
      headers: httpHeaders,
    });
  }

  checkAdmin(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders("2.0");
    const url = API_LANDINGPAGE_WIZARD + '/CheckAdmin';
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }
}
