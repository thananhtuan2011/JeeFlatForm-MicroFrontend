import { DatePipe } from "@angular/common";
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, of, ReplaySubject, Subject, throwError } from "rxjs";
import { BaoCaoService } from "../services/bao-cao.services";
import { TranslateService } from "@ngx-translate/core";
import { FormControl } from "@angular/forms";

import { HttpParams } from "@angular/common/http";
import { BaoCaoTheoDoiTinhHinhTHNVComponent } from "../bao-cao-thoe-doi-tinh-hinh-thuc-hien-nhiem-vu/bao-cao-thoe-doi-tinh-hinh-thuc-hien-nhiem-vu.component";
import { TheoDoiNVModel } from "../Model/baocao.model";
import { BaoCaoCongViecComponent } from "../bao-cao-cong-viec/bao-cao-cong-viec.component";
import { BaoCaoDuAnComponent } from "../bao-cao-du-an/bao-cao-du-an.component";
import { BaoCaoNhiemVuDuocGiaoComponent } from "../bao-cao-nhiem-vu-duoc-giao/bao-cao-nhiem-vu-duoc-giao.component";
import { first } from 'rxjs/operators'
import { BaoCaoNhiemVuDuocTaoComponent } from "../bao-cao-nhiem-vu-duoc-tao/bao-cao-nhiem-vu-duoc-tao.component";
import { BaoCaoChiTietTheoThanhVienComponent } from "../bao-cao-chi-tiet-theo-thanh-vien/bao-cao-chi-tiet-theo-thanh-vien.component";
import { BaoCaoTheoDoiNhiemVuDaGiaoComponent } from "../bao-cao-theo-doi-nhiem-vu-da-giao/bao-cao-theo-doi-nhiem-vu-da-giao.component";
import { BaoCaoNhiemVuTheoNguoiGiaoComponent } from "../bao-cao-nhiem-vu-theo-nguoi-giao/bao-cao-nhiem-vu-theo-nguoi-giao.component";
import { BaoCaoNhiemVuQuanTrongComponent } from "../bao-cao-nhiem-vu-quan-trong/bao-cao-nhiem-vu-quan-trong.component";
import { BaoCaoTongGioLamComponent } from "../bao-cao-tong-gio-lam/bao-cao-tong-gio-lam.component";
import { NhiemVuDuocGiaoModel, NhiemVuDuocTaoModel } from "../Model/jee-work.model";
import { QueryParamsModel } from "../../../models/query-models/query-params.model";
import { LayoutUtilsService, MessageType } from "projects/jeework/src/modules/crud/utils/layout-utils.service";
import { DialogSelectdayComponent } from "../../dialog-selectday/dialog-selectday.component";
import { WidgetNhiemVuTheoNguoiGiaoService } from "../services/widget-nhiem-vu-theo-nguoi-giao.service";
import { WeWorkService } from "../services/jee-work.service";
import { WidgetWork22Service } from "../services/works-widget-22.service";
import { TranslationService } from "projects/jeework/src/modules/i18n/translation.service";
import { locale as viLang } from 'projects/jeework/src/modules/i18n/vocabs/vi';
import { BaoCaoNhiemVuCanBoComponent } from "../bao-cao-nhiem-vu-can-bo/bao-cao-nhiem-vu-can-bo.component";
import { BaoCaoTheoDoiNhiemVuDuocGiaoComponent } from "../bao-cao-theo-doi-nhiem-vu-duoc-giao/bao-cao-theo-doi-nhiem-vu-duoc-giao.component";
import { BaoCaoNhiemVuDaXoaComponent } from "../bao-cao-nhiem-vu-da-xoa/bao-cao-nhiem-vu-da-xoa.component";
import { DanhMucChungService } from "../../../services/danhmuc.service";


@Component({
    selector: 'app-bao-cao-list',
    templateUrl: './bao-cao-list.component.html',
    styleUrls: ["./bao-cao-list.component.scss"],
})
export class BaoCaoListComponent implements OnInit, AfterViewInit {
    @ViewChild('baoCaoCongViec') baoCaoCongViec: BaoCaoCongViecComponent;
    @ViewChild('baoCaoTDNVDuocGiao') baoCaoTDNVDuocGiao: BaoCaoTheoDoiNhiemVuDuocGiaoComponent;
    @ViewChild('baoCaoDuAn') baoCaoDuAn: BaoCaoDuAnComponent;
    @ViewChild('baoCaoNVDG') baoCaoNVDG: BaoCaoNhiemVuDuocGiaoComponent;
    @ViewChild('baoCaoNVDT') baoCaoNVDT: BaoCaoNhiemVuDuocTaoComponent;
    @ViewChild('baoCaoCTTTV') baoCaoCTTTV: BaoCaoChiTietTheoThanhVienComponent;
    @ViewChild('baoCaoNVQT') baoCaoNVQT: BaoCaoNhiemVuQuanTrongComponent;
    @ViewChild('baoCaoTDNVDG') baoCaoTDNVDG: BaoCaoTheoDoiNhiemVuDaGiaoComponent;
    @ViewChild('baoCaoNVTNG') baoCaoNVTNG: BaoCaoNhiemVuTheoNguoiGiaoComponent;
    @ViewChild('baoCaoTGL') baoCaoTGL: BaoCaoTongGioLamComponent;
    @ViewChild('baoCaoCB') baoCaoCB: BaoCaoNhiemVuCanBoComponent;
    @ViewChild('baoCaoNhiemVuDaXoa') baoCaoNhiemVuDaXoa: BaoCaoNhiemVuDaXoaComponent;

    dataLazyLoad: any = [];
    dataLazyLoad_ID: any = [];//Bổ sung ngày 11/10/2022 dùng để lấy danh sách id đánh dấu đã xem
    dt: TheoDoiNVModel;
    dtNVDG: NhiemVuDuocGiaoModel;
    dtNVDT: NhiemVuDuocTaoModel;
    listReport: any = [];
    id_report: number;
    listDepartment: any = [];
    listProject: any = [];
    listRole: any = [];
    id_department: number;
    selectedDepartment: number = 0;
    selectedProject: number = 0;
    id_role: number = 0;
    selectedReport: number = 0;
    selectedImportant: number = 0;
    selectedPriority: number = 0;
    id_project_team: number = 0;
    linkrouter_default: string;
    public IDDrop: string = '';
    labelReport: string = '';
    labelRole: string = '';
    labelDepartment: string = '';
    labelProject: string = 'Tất cả';

    labelTimKiem: string = 'Tìm kiếm';
    keyword = "";

    labelDuAn: string = "";
    idDuAn: string = "";
    listDuAn: any[] = [];
    labelTienDo: string = "Tất cả";
    idTienDo: string = "0";

    listNhanVien: any[] = [];
    ID_NV: number = 0;
    List_ID_NV: string = "";
    label_NV: string = 'Tất cả';

    labelTinhTrang: string = 'Tất cả';
    idTinhTrang: string = '1';
    listTinhTrang: any[] = [];
    labelTinhTrangDuAn: string = 'Tất cả';
    idTinhTrangDuAN: string = '';

    ShowMain: boolean = false;
    DataID: any = 0;
    DataID_Project: any = 0;
    UserID = 0;
    isclosed = true;
    disabledBtn = false;
    showsuccess = false;
    loading = true;
    loadTags = false;
    chinhsuamota = false;
    newtask = true;
    topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>("");

    isnew: boolean = false//Ẩn hiện nhấp nháy

    //====================Dự án====================
    public bankFilterCtrlDuAn: FormControl = new FormControl();
    public filteredBanksDuAn: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    //====================Nhân viên cấp dưới====================
    public bankFilterCtrlNhanVien: FormControl = new FormControl();
    public filteredBanksNhanVien: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    //==========Dropdown Search==============
    filter: any = {};
    filter_role: any = {};
    //============================================================
    listField: any[] = [];
    isEdittitle = -1;
    list_role: any = [];
    IsAdminGroup = false;

    IsGov: boolean = false;

    public column_sort: any = [];
    type_sort = "CreatedDate";
    listData: any[] = [];
    listData_Tong: any[] = [];
    currentYear = new Date().getFullYear();
    listType = [
        { "id": 0, "name": "Hình cột" },
        { "id": 1, "name": "Hình tròn" }
    ];
    listPriority = [
        { "id": 0, "name": "Tất cả" },
        { "id": 1, "name": "Khẩn cấp" },
        { "id": 2, "name": "Cao" },
        { "id": 3, "name": "Bình thường" },
        { "id": 4, "name": "Thấp" }
    ];
    listLoaiCV = [
        { "id": 1, "name": "Nhiệm vụ tôi làm" },
        { "id": 3, "name": "Nhiệm vụ tôi giao" },
    ];
    listCustomerTag = [];
    labelType: string = this.listType[0].name;
    labelPriority: string = this.listPriority[0].name;
    type = 0;
    priority = 0;
    important = 0;
    loai_cv = 0;
    id_nv = 0;
    IsAllDonVi: boolean = false;
    id_follower = 0;
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        public BaoCaoService: BaoCaoService,
        public datepipe: DatePipe,
        public dialog: MatDialog,
        private widgetWork22Service: WidgetWork22Service,
        public membersServices: WidgetNhiemVuTheoNguoiGiaoService,
        private translate: TranslateService,
        private weworkService: WeWorkService,
        private layoutUtilsService: LayoutUtilsService,
        private transtation: TranslationService,
        public _DanhMucChungService: DanhMucChungService,
    ) {
        this.transtation.loadTranslations(viLang);
        var langcode = localStorage.getItem('language');
        if (langcode == null) {
            langcode = this.translate.getDefaultLang();
            this.transtation.setLanguage(langcode);
        }
    }

    ngOnInit(): void {
        this.BaoCaoService.getthamso();

        setInterval(() => {
            this.isnew = !this.isnew;
            this.changeDetectorRef.detectChanges();
        }, 1000);
        const queryParams = new QueryParamsModel(
            this.filterConfiguration(),
            'asc',
            '',
            this.crr_page,
            this.page_size,
        );
        this.getInitData();
        this.BaoCaoService.getListReport(queryParams).pipe(first()).subscribe(res => {
            if (res && res.status == 1) {
                res.data.forEach(item => {
                    this.BaoCaoService.GetThamSoByKeyAndCustomer(item.LangKey, true).subscribe(res2 => {
                        if (res2) {
                            item.LangKey = res2.data;
                        }
                        this.labelReport = res.data[0].LangKey;

                    })
                });

                this.listReport = res.data;
                this.linkrouter_default = res.data[0].LinkRoute;
                this.id_report = res.data[0].id_row;
                this.selectedReport = res.data[0].id_row;
                //---------------------------------------------------------------------------------------------
                this.BaoCaoService.lite_department_by_manager().subscribe(res => {
                    if (res && res.status == 1) {
                        this.listDepartment = res.data;
                        if (this.listDepartment.length > 0) {
                            this.id_department = res.data[0].id_row;
                            this.labelDepartment = res.data[0].title;
                            this.selectedDepartment = res.data[0].id_row;
                        }
                        else {
                            var message = "Chưa có " + this.BaoCaoService.ts_duan;
                            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
                        }
                        this.loadProject();
                        this.LoadRole();
                        if (this.linkrouter_default == "CongViec") {
                            this.LoadListUserFollow_Dept();
                        }
                        if (this.linkrouter_default == "ChiTietNhiemVuTheoNguoiGiao") {
                            this.LoadListUser();
                        }
                    }
                })
            }
        })

        this.CheckShow();
        this.isShowDay = true;
        this.isShowRole = true;
        this.isShowExcel = true;
        this.isShowDepartment = true;
        this.isShowNhanVienTheoDoi = true;
        this.loadListCustomerTag();
    }
    loadProject() {
        if (this.linkrouter_default != "Theodoinhiemvuduocgiao") {
            this.BaoCaoService.lite_project_team_by_department2(this.id_department.toString()).subscribe(res => {
                if (res && res.status == 1) {
                    this.listProject = [];
                    this.listProject = res.data;
                    if (this.listProject.length > 0) {
                        // this.labelProject = "Tất cả"
                        this.ChangeLablelProjectDefault();
                    }
                    this.selectedProject = 0;
                }
            })
        }
        else {
            this.BaoCaoService.list_project_by_me_rule_viewall().subscribe(res => {
                if (res && res.status == 1) {
                    this.listProject = [];
                    this.listProject = res.data;
                    if (this.listProject.length > 0) {
                        // this.labelProject = "Tất cả"
                        this.ChangeLablelProjectDefault();
                    }
                    this.selectedProject = 0;
                }
            })
        }


    }
    LoadRole() {
        const queryParams = new QueryParamsModel(
            this.filterConfigurationRole(),
            'asc',
            '',
            1,
            10,
        );
        this.BaoCaoService.list_role_filter_report(queryParams).subscribe(res => {
            if (res && res.status == 1) {
                this.listRole = [];
                this.listRole = res.data;
                this.labelRole = this.listRole[0].title;
                this.listRole[0].id == "1" ? this.id_role = 1 : this.id_role = 0;
                this.changeDetectorRef.detectChanges();
            }
        })
    }
    SelectedRole(item) {
        this.id_role = Number(item.id);
        this.labelRole = item.title;
    }
    filterConfigurationRole(): any {
        this.filter_role.id_department = this.id_department;

        return this.filter_role;
    }
    loadListCustomerTag() {
        const queryParams = new QueryParamsModel(
            this.filterConfiguration(),
            'asc',
            '',
            this.crr_page,
            this.page_size,
        );
        this.widgetWork22Service.ListCustomerTag(queryParams).subscribe(res => {
            if (res && res.status == 1) {
                this.listCustomerTag = res.data;
            }
        })
    }


    ngAfterViewInit() {
    }
    selectedType: number = 0
    changeTypeChart(val) {
        this.selectedType = val;
        let type = this.listType.find(x => +x.id == +val)
        if (type) {
            this.labelType = type.name;
            this.type = type.id;
        }
    }
    changePriority(priority) {
        // this.labelPriority = priority.name;
        // this.priority = priority.id;

        this.priority = priority;
    }
    changeImportant(value) {
        this.important = value;
    }
    changeLoaiCongViec(value) {
        this.loai_cv = value;
    }
    changeNhanVien(value) {
        this.id_nv = value;
    }
    changeReport(id) {
        //Thiên thay đổi cách sủ dụng dropdown
        let val = this.listReport.find(x => +x.id_row == +id);
        if (val) {
            this.selectedReport = val.id_row;
            //==========================
            this.id_project_team = 0;
            this.ChangeLablelProjectDefault();
            this.id_report = val.id_row;
            this.labelReport = val.LangKey;
            this.linkrouter_default = val.LinkRoute;
            this.CheckShow();
            this.ResetData();
            this.reloadProject();
            if (this.linkrouter_default == "ChiTietNhiemVuTheoNguoiGiao") {
                this.LoadListUser()
            }
            if (this.linkrouter_default == "CongViec") {
                this.LoadListUserFollow_Dept();
            }
        }
    }
    reloadProject() {
        if (this.linkrouter_default != "Theodoinhiemvuduocgiao") {
            this.BaoCaoService.lite_project_team_by_department2(this.id_department.toString()).subscribe(res => {
                if (res && res.status == 1) {
                    this.listProject = [];
                    this.listProject = res.data;
                    if (this.listProject.length > 0) {
                        // this.labelProject = "Tất cả"
                        this.ChangeLablelProjectDefault();
                    }
                    this.selectedProject = 0;
                }
            })
        }
        else {
            this.BaoCaoService.list_project_by_me_rule_viewall().subscribe(res => {
                if (res && res.status == 1) {
                    this.listProject = [];
                    this.listProject = res.data;
                    if (this.listProject.length > 0) {
                        // this.labelProject = "Tất cả"
                        this.ChangeLablelProjectDefault();
                    }
                    this.selectedProject = 0;
                }
            })
        }
    }
    ResetData() {
        this.id_nv = 0;
        this.loai_cv = 0;
        this.id_follower = 0;
    }

    changeDepartment2(val) {
        this.id_project_team = 0;
        this.id_department = val;

        // this.labelProject = "Tất cả"
        this.ChangeLablelProjectDefault();
        this.LoadRole();
        this.loadProject();
        if (this.linkrouter_default == "ChiTietNhiemVuTheoNguoiGiao") {
            this.LoadListUser()
        }
        if (this.linkrouter_default == "CongViec") {
            this.LoadListUserFollow_Dept();
        }
    }

    changeProject(val) {
        if (val == 0) {
            this.id_project_team = 0;
            // this.labelProject="Tất cả";
            this.ChangeLablelProjectDefault();
        } else {
            this.id_project_team = val.id_row;
            this.labelProject = val.title;
        }
    }

    changeProject2(val) {
        if (val == 0) {
            this.id_project_team = 0;
            // this.labelProject="Tất cả";
            this.ChangeLablelProjectDefault();
        } else {
            this.id_project_team = val;
        }
    }

    ChangeLablelProjectDefault() {
        this.labelProject = "Tất cả";
        this.selectedProject = 0;
    }

    //=======================Start xử lý drop việc dự án===================
    filterConfiguration_theodoi(): any {
        // let filter: any = {};
        this.filter.id_department = this.id_department;
        this.filter.loai_role = this.id_role;
        this.filter.collect_by = this.type_sort;
        this.filter.TuNgay = this.datepipe.transform(this.filterDay.startDate, "yyyy-MM-dd");
        this.filter.DenNgay = this.datepipe.transform(this.filterDay.endDate, "yyyy-MM-dd");
        this.filter.id_project_team = this.id_project_team;
        return this.filter;
    }

    _loading = false;
    _HasItem = false;
    crr_page = 0;
    page_size = 20;
    total_page = 0;

    filterConfiguration(): any {
        // let filter: any = {};
        if (this.IDDrop == "3") {//Việc cấp dưới
            if (this.ID_NV > 0) {
                this.filter.filter = "3";
                this.filter.id_nv = this.ID_NV;
                this.filter.list_id_nv = "";
            } else {
                this.filter.filter = "3";
                this.filter.list_id_nv = "";
            }
        } else if (this.IDDrop == "4") {//Việc dự án
            this.filter.filter = "4";
            this.filter.id_project_team = this.idDuAn;
            this.filter.tiendo = this.idTienDo;
            this.filter.status_list = this.idTinhTrangDuAN;
        }
        else {
            this.filter.filter = this.IDDrop;
        }
        if (this.IDDrop == "1" || this.IDDrop == "2" || this.IDDrop == "3") {
            this.filter.status_list = this.idTinhTrang;
        }


        this.filter.sort = "NgayGiao_Giam";//sắp xếp theo ngày giao giảm
        this.filter.isclose = "0";//Công việc chưa đóng

        return this.filter;
    }

    tinyMCE = {};
    getHeight(): any {
        let a = document.getElementById("height-header").clientHeight;
        let tmp_height = window.innerHeight - (a + 20);
        return tmp_height + "px";
    }

    onScroll(event) {
        let _el = event.srcElement;
        if (_el.scrollTop + _el.clientHeight > _el.scrollHeight * 0.9) {

        }
    }

    //==========================Xử lý Khi click vào 1 item=====================
    item: any = [];
    changeRoute(item) {
        this.DataID = item.id_row;
        this.DataID_Project = item.id_project_team;
        //this.router.navigateByUrl(`Work/BaoCao/${this.DataID_Project}/${this.DataID}`);
    }

    description_tiny: string;
    status_dynamic: any[] = [];
    listUser: any[] = [];
    public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public bankFilterCtrl: FormControl = new FormControl();
    options_assign: any = {};
    // load task
    list_Tag: any = [];
    project_team: any = "";


    //===========================================================
    stopPropagation(event) {
        event.stopPropagation();
    }

    ExportExcel() {
        //báo cáo theo dõi thực hiện nhiệm vụ 
        if (this.linkrouter_default == "CongViec") {
            this.baoCaoCongViec.ExportExcel();
        }
        //báo cáo theo dõi nhiệm vụ được giao 
        if (this.linkrouter_default == "Theodoinhiemvuduocgiao") {
            this.baoCaoTDNVDuocGiao.ExportExcel();
        }
        //báo cáo tổng hợp thực hiện nhiệm vụ -- BaoCaoDuAnComponent
        if (this.linkrouter_default == "DuAn") {
            this.baoCaoDuAn.ExportExcel();
        }
        //báo cáo theo dõi tình hình thực hiện nhiệm vụ -- BaoCaoTheoDoiTinhHinhTHNVComponent
        // if (this.id_report == 14) {
        //     this.ExportExcel3();
        // }
        //15 21
        if (this.linkrouter_default == "TongHopNhiemVuTheoNguoiGiao") {
            this.baoCaoNVDG.ExportExcel();
        }
        //16
        if (this.linkrouter_default == "CongViecDuocTao") {
            this.baoCaoNVDT.ExportExcel();
        }
        //17
        if (this.linkrouter_default == "ThanhVien") {
            // this.ExportExcel6('member');
            this.baoCaoCTTTV.ExportExcel('member');
        }
        if (this.linkrouter_default == "CongViecQuanTrong") {
            this.baoCaoNVQT.ExportExcel();
        }
        if (this.linkrouter_default == "TheoDoiNhiemVuDaGiao") {
            this.baoCaoTDNVDG.ExportExcel();
        }
        if (this.linkrouter_default == "ChiTietNhiemVuTheoNguoiGiao") {
            this.baoCaoNVTNG.ExportExcel();
        }
        if (this.linkrouter_default == "TongGioLam") {
            this.baoCaoTGL.ExportExcel();
        }
        if (this.linkrouter_default == "TongHopNhiemVuCanBo") {
            this.baoCaoCB.ExportExcel();
        }
        //báo cáo nhiệm vụ đã xóa 
        if (this.linkrouter_default == "nhiemvudaxoa") {
            this.baoCaoNhiemVuDaXoa.ExportExcel();
        }
    }


    sortField = [
        {
            title: this.translate.instant("day.theongaytao"),
            value: "CreatedDate",
        },
        {
            title: this.translate.instant("day.theothoihan"),
            value: "deadline",
        },
        {
            title: this.translate.instant("day.theongaybatdau"),
            value: "start_date",
        }
    ];
    SelectedField(item) {
        this.column_sort.title = item.title;
        this.type_sort = item.value
        //this.UpdateInfoProject();
        //this.LoadData();
        this.filterConfiguration_theodoi();
        this.clearData();
        //this.getDataByFilterDate();
        if(this.sortField.length<4) {
            this.sortField = [
                {
                    title: this.translate.instant("day.theongaytao"),
                    value: "CreatedDate",
                },
                {
                    title: this.translate.instant("day.theothoihan"),
                    value: "deadline",
                },
                {
                    title: this.translate.instant("day.theongaybatdau"),
                    value: "start_date",
                },
            ];
        }
        else{
            this.sortField = [
                {
                    title: this.translate.instant("day.theongaytao"),
                    value: "CreatedDate",
                },
                {
                    title: this.translate.instant("day.theothoihan"),
                    value: "deadline",
                },
                {
                    title: this.translate.instant("day.theongaybatdau"),
                    value: "start_date",
                },
                {
                    title: this.translate.instant("day.theongaygiao"),
                    value: "NgayGiao",
                }
            ];
        }
        

    }


    filterDay = {
        startDate: new Date("01/01/" + this.currentYear),
        endDate: new Date("12/31/" + this.currentYear),
    };
    SelectFilterDate() {
        const dialogRef = this.dialog.open(DialogSelectdayComponent, {
            width: "500px",
            data: this.filterDay,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result != undefined) {
                this.filterDay.startDate = new Date(result.startDate);
                this.filterDay.endDate = new Date(result.endDate);
                //this.UpdateInfoProject();
                // this.LoadDataTaskNew();
                this.filterConfiguration_theodoi();
                this.clearData()
            }
        });

    }
    clearData() {
        this.listData = [];
        this.listData_Tong = [];
    }
    getInitData() {
        this.column_sort = this.sortField[0];
        this.type_sort = this.sortField[0].value;

    }
    isShowDay = true;
    isShowProject = true;
    isShowType = true;
    isShowPriority = true;
    isShowExcel = true;
    isShowImportant = true;
    isShowLoaiCV = true;
    isShowDepartment = true;
    isShowNhanVien = true;
    isShowAllDVTrucThuoc = true;
    isShowRole = true;
    isShowDayDelete = true;
    isShowNhanVienTheoDoi = true;
    HideAll() {
        this.isShowDay = false;
        this.isShowProject = false;

        this.isShowType = false;
        this.isShowPriority = false;
        this.isShowExcel = false;
        this.isShowImportant = false;
        this.isShowLoaiCV = false;
        this.isShowDepartment = false;

        this.isShowNhanVien = false;
        this.isShowRole = false;
        this.isShowAllDVTrucThuoc = false;

        this.column_sort = this.sortField[0];
        this.type_sort = this.sortField[0].value;
        this.sortField = this.sortField.filter(x => x.value != "NgayGiao");

        this.isShowDayDelete = false;

        this.isShowNhanVienTheoDoi = false;
    }

    CheckShow() {
        this.HideAll();
        if (this.linkrouter_default == "CongViec") {
            this.isShowDay = true;
            this.isShowExcel = true;
            this.isShowDepartment = true;
            this.isShowRole = true;
            this.isShowNhanVienTheoDoi = true;//Thiên bổ sung ngày 18/01/2024
        }
        if (this.linkrouter_default == "Theodoinhiemvuduocgiao") {
            this.isShowDay = true;
            this.isShowExcel = true;
            this.isShowProject = true;
            this.isShowRole = true;
        }
        if (this.linkrouter_default == "DuAn") {
            this.isShowDay = true;
            this.isShowProject = true;
            this.isShowExcel = true;
            this.isShowDepartment = true;
            this.isShowRole = true;
        }
        if (this.linkrouter_default == "TongHopNhiemVuTheoNguoiGiao") {
            this.isShowDay = true;
            this.isShowProject = true;
            this.isShowExcel = true;
            this.isShowDepartment = true;
            this.isShowRole = true;
        }
        if (this.linkrouter_default == "CongViecDuocTao") {
            this.isShowDay = true;
            this.isShowProject = true;
            this.isShowExcel = true;
            this.isShowDepartment = true;
            this.isShowRole = true;
        }
        if (this.linkrouter_default == "ThanhVien") {
            this.isShowExcel = true;
            this.isShowDepartment = true;
            this.isShowRole = true;
        }
        if (this.linkrouter_default == "ThoiHanNhiemVu") {
            this.isShowDay = true;
            this.isShowProject = true;
            this.isShowType = true;
            this.isShowDepartment = true;
            this.isShowRole = true;
        }
        if (this.linkrouter_default == "TheoDoiNhiemVu") {
            this.isShowDay = true;
            this.isShowProject = true;
            this.isShowType = true;
            this.isShowDepartment = true;
            this.isShowRole = true;
        }
        if (this.linkrouter_default == "TrangThaiNhiemVu") {
            this.isShowDay = true;
            this.isShowProject = true;
            this.isShowType = true;
            this.isShowPriority = true;
            this.isShowImportant = true;
            this.isShowDepartment = true;
            this.isShowRole = true;
        }
        if (this.linkrouter_default == "CongViecQuanTrong") {
            this.isShowLoaiCV = true;
            this.isShowExcel = true;
            this.isShowDay=true;
        }
        if (this.linkrouter_default == "TheoDoiNhiemVuDaGiao") {
            this.isShowExcel = true;
            this.isShowDepartment = true;
            this.isShowDay=true;
            this.sortField.push({
                title: this.translate.instant("day.theongaygiao"),
                value: "NgayGiao",
            },)
        }
        if (this.linkrouter_default == "ChiTietNhiemVuTheoNguoiGiao") {
            this.isShowExcel = true;
            this.isShowDepartment = true;
            this.isShowNhanVien = true;
            this.isShowDay=true;
        }
        if (this.linkrouter_default == "TongGioLam") {
            this.isShowDay = true;
            this.isShowProject = true;
            //this.isShowExcel = true;
            this.isShowDepartment = true;
            this.isShowRole = true;
        }
        if (this.linkrouter_default == "TongHopNhiemVuCanBo") {
            this.isShowDay = true;
            this.isShowExcel = true;
            this.isShowDepartment = true;
            this.isShowRole = true;
            this.isShowAllDVTrucThuoc = true;
            this.sortField.push({
                title: this.translate.instant("day.theongaygiao"),
                value: "NgayGiao",
            },)
        }

        if (this.linkrouter_default == "nhiemvudaxoa") {
            this.isShowDayDelete = true;
            this.isShowExcel = true;
            this.isShowDepartment = true;
        }
    }


    GetTitleByKey(key: any) {
        var title = "";
        this.BaoCaoService.GetThamSoByKeyAndCustomer(key, true).pipe(first()).subscribe(res => {
            if (res) {
                title = res.data;
            }
        })
        return title;
    }

    LoadListUser() {
        const filter: any = {};
        filter.id_department = this.id_department;
        this.weworkService.list_gov_acc_join_dept('').subscribe(res => {
            if (res && res.status === 1) {
                this.listNhanVien = [];
                this.listNhanVien = res.data;
                this.changeDetectorRef.detectChanges();
            };

        });
    }

    //==============================================================
    LoadListUserFollow_Dept() {
        this._DanhMucChungService.gov_account_follower_by_department(this.id_department).subscribe((res) => {
            if (res && res.status == 1) {
                this.listNhanVien = [];
                this.listNhanVien = res.data;
                this.id_follower = 0;
                this.changeDetectorRef.detectChanges();
            }
        });
    }
    changeNhanVienTheoDoi(value) {
        this.id_follower = value;
    }
}
