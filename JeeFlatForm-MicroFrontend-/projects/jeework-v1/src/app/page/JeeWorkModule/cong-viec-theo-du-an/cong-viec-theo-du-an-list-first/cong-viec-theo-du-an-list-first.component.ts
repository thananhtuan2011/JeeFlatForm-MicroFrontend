import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, fromEvent, of, ReplaySubject, throwError } from "rxjs";
import { catchError, finalize, map, share, tap } from "rxjs/operators";
import { CongViecTheoDuAnService } from "../services/cong-viec-theo-du-an.services";
import { ProjectsTeamService, WeWorkService } from "../../component/Jee-Work/jee-work.servide";
import { UpdateWorkModel, WorkModel } from "../../component/Jee-Work/jee-work.model";
import { TranslateService } from "@ngx-translate/core";
import { FormControl } from "@angular/forms";
import { CongViecTheoDuAnPopupComponent } from "../cong-viec-theo-du-an-popup/cong-viec-theo-du-an-popup.component";
import { Router } from "@angular/router";
import * as moment from 'moment';
import { CongViecTheoDuAnVer1PopupComponent } from "../cong-viec-theo-du-an-v1-popup/cong-viec-theo-du-an-v1-popup.component";
import { AddDropDownDialogComponent } from "../add-dropdown-dialog/add-dropdown-dialog.component";
import { HttpParams } from "@angular/common/http";
import { CommentTaskUpdateStatusComponent } from "../../custom/comment-task-update-status/comment-task-update-status.component";
import { FormatTimeService } from "../../../services/jee-format-time.component";
import { FormatCSSTimeService } from "../../../services/jee-format-css-time.component";
import { DynamicSearchFormService } from "../../component/dynamic-search-form/dynamic-search-form.service";
import { SocketioService } from "../../../services/socketio.service";
import { WorksbyprojectService } from "../../../services/worksbyproject.service";
import { PageWorksService } from "../../../services/page-works.service";
import { QueryParamsModelNew } from "../../../models/query-models/query-params.model";
import { HttpUtilsService } from "projects/jeework-v1/src/modules/crud/utils/http-utils.service";
import { LayoutUtilsService, MessageType } from "projects/jeework-v1/src/modules/crud/utils/layout-utils.service";
import { environment } from "projects/jeework-v1/src/environments/environment";
import { PageWorkDetailStore } from "../../../services/page-work-detail.store";

@Component({
    selector: 'app-cong-viec-theo-du-an-list-first',
    templateUrl: './cong-viec-theo-du-an-list-first.component.html',
    styleUrls: ["./cong-viec-theo-du-an-list-first.component.scss"],
})
export class CongViecTheoDuAnListFirstComponent implements OnInit {

    dataLazyLoad: any = [];
    dataLazyLoad_ID: any = [];//Bổ sung ngày 11/10/2022 dùng để lấy danh sách id đánh dấu đã xem

    listDropDown: any = [];
    public IDDrop: string = '-1';
    labelCongViec: string = '';

    labelTimKiem: string = 'Tìm kiếm';
    keyword = "";

    labelDuAn: string = "Tất cả";
    idDuAn: string = "-1";
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
    //============================================================
    listField: any[] = [];
    isEdittitle = -1;
    list_role: any = [];
    IsAdminGroup = false;

    IsGov: boolean = false;
    options: any = {};

    //--------------------Tuan-3/1/2023------------------------------------
    //Cac bien lay tu local storage
    collect_by: string = "";
    TuNgay: string = "";
    DenNgay: string = "";
    //---------------------------------------------------------
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        public congViecTheoDuAnService: CongViecTheoDuAnService,
        public datepipe: DatePipe,
        public dialog: MatDialog,
        public _FormatTimeService: FormatTimeService,
        public _FormatCSSTimeService: FormatCSSTimeService,
        public pageWorkService: PageWorksService,
        private layoutUtilsService: LayoutUtilsService,
        private translate: TranslateService,
        private weworkService: WeWorkService,
        private router: Router,
        private dynamicSearchFormService: DynamicSearchFormService,
        private projectsTeamService: ProjectsTeamService,
        private socketService: SocketioService,
        public workService: WorksbyprojectService,
        private httpUtils: HttpUtilsService,
        public store: PageWorkDetailStore,
    ) {
        this.getIsSearchLog() == 'true' ? this.isSearchLog = true : this.isSearchLog = false
    }
    ngOnInit(): void {
        this.LoadData();
        let opt = {
            title: this.translate.instant('landingpagekey.timkiem'),
            searchbox: 'keyword',
            controls: [
                {
                    type: 0,
                    name: 'keyword',
                    placeholder: this.translate.instant('landingpagekey.tukhoa'),
                },
            ],
        };
        this.dynamicSearchFormService.setOption(opt);
        this.congViecTheoDuAnService.getDSWork().subscribe(res => {
            if (res && res.status == 1) {
                this.listDropDown = res.data;
                this.IDDrop = res.data[0].id;
                this.labelCongViec = res.data[0].name;

                //===============Xử lý sau khi lấy danh sách dropdown==========
                this.dynamicSearchFormService.filterResult.subscribe((value) => {
                    if (Object.keys(value).length > 0) {
                        this.keyword = value.keyword;
                        this.filter.keyword = this.keyword;
                        this.loadDataList();
                    } else {
                        this.getParamType(value);
                    }
                });
            }
        })
        setInterval(() => {
            this.isnew = !this.isnew;
            this.changeDetectorRef.detectChanges();
        }, 1000);
        this.UserID = this.httpUtils.getUserID();
        this.dataLazyLoad = [];
        this.dataLazyLoad_ID = [];

        // const sb = this.store.updateEvent$.subscribe(res => {
        //     if (res) {
        //         this.loadDataListEmit();
        //     }
        // })

        const read = this.store.updateRead$.subscribe(res => {
            if (res && res > 0) {
                let obj = this.dataLazyLoad.find(x => +x.id_row == +res);
                if (obj) {
                    obj.isnewchange = false;
                }
                this.changeDetectorRef.detectChanges();
            }
        })

        //=====Nhận sự kiện load lại danh sách công việc======================
        const $eventload = fromEvent<CustomEvent>(window, 'event-task-workv1').subscribe((e) => this.onLoadTask(e))
        //===================21/09/2022 Bổ sung giao diện đầu tiên khi vào form công việc================
        // const sb1 = this.jeeWorkStore.updateEvent$.subscribe(res => {
        //     if (res) {
        //         this.loadDataList();
        //     }
        // })
    }
    get_flag_color(val) {
        switch (val) {
            case 0:
                return 'grey-flag_list'; //không sét
            case 1:
                return 'red-flag_list'; //khẩn cấp
            case 2:
                return 'yellow-flag_list'; //cao
            case 3:
                return 'blue-flag_list'; //bình thường
            case 4:
                return 'low-flag_list'; //thấp
        }
    }
    list_assignee_task(){
        this.label_NV="Tất cả";
        this.options={};
        this.weworkService.list_assignee_task().subscribe((res)=>{
            this.changeDetectorRef.detectChanges();
            if (res && res.status === 1) {
                this.listUser2 = res.data;
                // this.setUpDropSearchNhanVien();
                this.options = this.getOptions_Assign2();
                this.changeDetectorRef.detectChanges();
            }
            
        })
    }
    ItemSelected2(val:any){
        this.label_NV= val.hoten;
        this.filter.id_assginee=val.id_nv;
        this.loadDataList();
    }
    getParamType(value) {
        const url = window.location.href;
        if (url.includes('?')) {
            const httpParams = new HttpParams({ fromString: url.split('?')[1] });

            this.IDDrop = httpParams.get('IDDrop');
            let obj1 = this.listDropDown.find(x => +x.id == +this.IDDrop);
            if (obj1) {
                this.labelCongViec = obj1.name;
            }
            if (this.IDDrop == "4") {
                this.idDuAn = httpParams.get('IDPr');
                this.congViecTheoDuAnService.listDuAn().subscribe(res => {
                    if (res && res.status == 1) {
                        if (res.data.length > 0) {
                            this.listDuAn = res.data.filter(x => x.locked == false);

                            this.setUpDropSearchDuAn();
                            //=========Load tình trạng theo dự án==========
                            this.congViecTheoDuAnService.listTinhTrangDuAn(this.idDuAn).subscribe(res => {
                                if (res && res.status == 1) {
                                    this.listTinhTrang = res.data;
                                }
                            })
                        }
                        let obj2 = this.listDuAn.find(x => +x.id_row == +this.idDuAn);
                        if (obj2) {
                            this.labelDuAn = obj2.title_full;
                        }

                        this.idTienDo = httpParams.get('ID');
                        this.labelTienDo = +this.idTienDo == 0 ? "Tất cả" : +this.idTienDo == 2 ? "Đang thực hiện trong hạn"
                            : +this.idTienDo == 3 ? "Sắp tới hạn" : +this.idTienDo == 4 ? "Tới hạn" : +this.idTienDo == 5 ? "Quá hạn"
                                : +this.idTienDo == 6 ? "Hoàn thành đúng hạn" : "Hoàn thành quá hạn";

                        this.loadDataList();
                    }
                    this.changeDetectorRef.detectChanges();
                })
            }

            if (this.IDDrop == "6" || this.IDDrop == "7") {
                this.idPhongBan = httpParams.get('IDep');
                this.idNhanVienPB = httpParams.get('IDUser');
                this.idDuAn = httpParams.get('IDPr');//Thiên bổ sung ngày 6/1/23
                this.workService.lite_department_by_manager().subscribe(res => {
                    if (res && res.status == 1) {
                        if (res.data.length > 0) {
                            this.listPhongBan = res.data;
                            this.setUpDropSearchPhongBan();
                            //=========Load tình trạng theo dự án==========
                        }
                        let obj2 = this.listPhongBan.find(x => +x.id_row == +this.idPhongBan);
                        if (obj2) {
                            this.labelPhongBan = obj2.title;
                        }

                        this.idTienDo = httpParams.get('ID');
                        this.labelTienDo = +this.idTienDo == 0 ? "Tất cả" : +this.idTienDo == 2 ? "Đang thực hiện trong hạn"
                            : +this.idTienDo == 3 ? "Sắp tới hạn" : +this.idTienDo == 4 ? "Tới hạn" : +this.idTienDo == 5 ? "Quá hạn"
                                : +this.idTienDo == 6 ? "Hoàn thành đúng hạn" : "Hoàn thành quá hạn";

                        if (+this.idDuAn >= 0) {
                            this.TuNgay = localStorage.getItem('TuNgay');
                            this.DenNgay = localStorage.getItem('DenNgay');
                            this.congViecTheoDuAnService.lite_project_team_by_department(this.idPhongBan).subscribe(res => {
                                if (res && res.status == 1) {
                                    if (res.data.length > 0) {
                                        this.listDuAn = res.data;
                                        this.setUpDropSearchDuAnTheoPhongBan();
                                    }
                                    let obj2 = this.listDuAn.find(x => +x.id_row == +this.idDuAn);
                                    if (obj2) {
                                        this.labelDuAn = obj2.title;
                                    }
                                    this.loadDataList();
                                }
                                this.changeDetectorRef.detectChanges();
                            })
                        } else {
                            this.congViecTheoDuAnService.listNhanVienPB(this.idPhongBan).subscribe(res => {
                                if (res && res.status == 1) {
                                    if (res.data.length > 0) {
                                        this.listNhanVienPB = res.data;
                                        this.setUpDropSearchNhanVienPB();
                                    }
                                    let objnv = this.listNhanVienPB.find(x => +x.userid == +this.idNhanVienPB);
                                    if (objnv) {
                                        this.labelNhanVienPB = objnv.fullname;
                                    }
                                }
                                this.changeDetectorRef.detectChanges();
                            })
                            this.loadDataList();
                        }
                    }
                    this.changeDetectorRef.detectChanges();
                })

            }
        } else {
            if (this.isSearchLog) {//Có lưu tùy chọn xem
                let _parseData = JSON.parse(localStorage.getItem('filterSearchLog'));
                this.handleDataSearchLog(_parseData);
            } else {
                this.filter = value;
                this.loadDataList();
            }

        }
    }

    changeDropDown(val, title: string) {
        this.keyword = "";
        this.filter.keyword = "";
        this.dynamicSearchFormService.search_data$.next("");
        this.filter = {};
        this.IDDrop = val;
        this.labelCongViec = title;
        switch (val) {
            case "1":
                this.labelTimKiem = "Tìm theo tên công việc, tên dự án, tên tình trạng";
                break;
            case "2":
                this.labelTimKiem = "Tìm theo tên công việc, tên dự án, tên tình trạng";
                break;
            case "4":
                this.labelTimKiem = "Tìm theo tên công việc, tên dự án, tên tình trạng";
                break;
            default:
                this.labelTimKiem = "Tìm kiếm";
                break;
        }
        if (this.IDDrop == "4") {
            this.idTinhTrangDuAN = "";
            this.labelTinhTrangDuAn = "Tất cả";
            this.listStatusDuAn = [];
            this.labelTienDo = "Tất cả";
            this.idTienDo = "0";
            this.loadDataDuAn();
        } else if (this.IDDrop == "6" || this.IDDrop == "7") {
            this.labelTienDo = "Tất cả";
            this.idTienDo = "0";
            this.idDuAn = "-1";
            this.labelDuAn = "Tất cả";
            this.loadDataPhongBan();
        } else if (this.IDDrop == "3") {
            this.idTinhTrang = "1";
            this.labelTinhTrang = "Tất cả";
            this.listStatus = [];
            this.loadNhanVienCapDuoi();
        } else if (this.IDDrop == "0") {
            this.loadDataList();
            this.changeDetectorRef.detectChanges();
        } else {
            this.idTinhTrang = "1";
            this.labelTinhTrang = "Tất cả";
            this.listStatus = [];
            if(this.IDDrop == "2"){
                this.list_assignee_task();
            }
            this.loadDataList();
        }
        this.router.navigateByUrl(environment.HOST_ALINK + `/CongViecTheoDuAn`);
        this.removeLocalStorage();
    }

    //=======================Start xử lý drop việc dự án===================
    loadDataDuAn() {
        this.congViecTheoDuAnService.listDuAn().subscribe(res => {
            if (res && res.status == 1) {
                if (res.data.length > 0) {
                    this.listDuAn = res.data.filter(x => x.locked == false);
                    this.idDuAn = this.listDuAn[0].id_row;
                    this.labelDuAn = this.listDuAn[0].title_full;
                    this.setUpDropSearchDuAn();
                    //=========Load tình trạng theo dự án==========
                    this.congViecTheoDuAnService.listTinhTrangDuAn(this.idDuAn).subscribe(res => {
                        if (res && res.status == 1) {
                            this.listTinhTrang = res.data;
                        }
                    })
                }
                this.loadDataList();

            }
            this.changeDetectorRef.detectChanges();
        })
    }

    setUpDropSearchDuAn() {
        this.bankFilterCtrlDuAn.setValue('');
        this.filterBanksDuAn();
        this.bankFilterCtrlDuAn.valueChanges
            .pipe()
            .subscribe(() => {
                this.filterBanksDuAn();
            });
    }

    protected filterBanksDuAn() {
        if (!this.listDuAn) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrlDuAn.value;
        if (!search) {
            this.filteredBanksDuAn.next(this.listDuAn.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanksDuAn.next(
            this.listDuAn.filter(bank => bank.title_full.toLowerCase().indexOf(search) > -1)
        );
    }

    changeDuAn(item) {
        this.labelDuAn = item.title_full;
        this.idDuAn = item.id_row;
        this.bankFilterCtrlDuAn.setValue("");
        this.idTinhTrangDuAN = "";
        this.labelTinhTrangDuAn = "Tất cả";
        this.listStatusDuAn = [];
        this.congViecTheoDuAnService.listTinhTrangDuAn(this.idDuAn).subscribe(res => {
            if (res && res.status == 1) {
                this.listTinhTrang = res.data;
            }
            this.changeDetectorRef.detectChanges();
        })
        this.loadDataList();
    }

    changeTienDo(val, title) {
        this.idTienDo = val;
        this.labelTienDo = title;
        this.loadDataList();
    }
    //=======================End xử lý drop việc dự án====================
    //=======================Start xử lý drop việc cấp dưới===================
    loadNhanVienCapDuoi() {
        this.congViecTheoDuAnService.listNhanVienCapDuoi().subscribe(res => {
            if (res && res.status == 1) {
                this.listNhanVien = res.data;
                this.setUpDropSearchNhanVien();
            }
            this.changeNhanVienAll();
            this.changeDetectorRef.detectChanges();
        })
    }

    setUpDropSearchNhanVien() {
        this.bankFilterCtrlNhanVien.setValue('');
        this.filterBanksNhanVien();
        this.bankFilterCtrlNhanVien.valueChanges
            .pipe()
            .subscribe(() => {
                this.filterBanksNhanVien();
            });
    }

    protected filterBanksNhanVien() {
        if (!this.listNhanVien) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrlNhanVien.value;
        if (!search) {
            this.filteredBanksNhanVien.next(this.listNhanVien.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanksNhanVien.next(
            this.listNhanVien.filter(bank => bank.fullname.toLowerCase().indexOf(search) > -1)
        );
    }

    changeNhanVienAll() {
        this.label_NV = "Tất cả";
        if (this.listNhanVien.length > 0) {
            let id = "";
            this.listNhanVien.map((item, index) => {
                id += "," + item.userid;
            })
            this.List_ID_NV = id.substring(1);
        }
        this.ID_NV = 0;
        this.bankFilterCtrlNhanVien.setValue("");
        this.loadDataList();
    }

    changeNhanVien(item) {
        this.label_NV = item.fullname;
        this.ID_NV = item.userid;
        this.List_ID_NV = "";
        this.bankFilterCtrlNhanVien.setValue("");
        this.loadDataList();
    }
    //=======================End xử lý drop việc cấp dưới===================
    tinhTrangchange(val, title) {
        this.labelTinhTrang = title;
        this.idTinhTrang = val;
        this.loadDataList();
    }

    changeTinhTrangDuAn(val, title) {
        this.labelTinhTrangDuAn = title;
        this.idTinhTrangDuAN = val;
        this.loadDataList();
    }

    listStatus: any[] = [];
    changeStatus(val, id, title) {
        let item = {
            id: id,
            title: title,
        }
        if (val.checked) {
            this.listStatus.push(item);
        } else {
            let index = this.listStatus.findIndex(x => x.id == id);
            this.listStatus.splice(index, 1);
        }
    }

    changeStatusAll() {
        let id = '';
        let label = '';
        this.listStatus.map((item, index) => {
            id += ',' + item.id;
            label += ',' + item.title;
        })
        if (id == "") {
            this.labelTinhTrang = "Tất cả";
            this.idTinhTrang = "";
        } else {
            this.labelTinhTrang = label.substring(1);
            this.idTinhTrang = id.substring(1);
        }
        this.loadDataList();
    }

    listStatusDuAn: any[] = [];
    changeStatusDuAn(val, id, title) {
        let item = {
            id: id,
            title: title,
        }
        if (val.checked) {
            this.listStatusDuAn.push(item);
        } else {
            let index = this.listStatusDuAn.findIndex(x => x.id == id);
            this.listStatusDuAn.splice(index, 1);
        }
    }

    changeStatusDuAnAll() {
        let id = '';
        let label = '';
        this.listStatusDuAn.map((item, index) => {
            id += ',' + item.id;
            label += ',' + item.title;
        })
        if (id == "") {
            this.labelTinhTrangDuAn = "Tất cả";
            this.idTinhTrangDuAN = "";
        } else {
            this.labelTinhTrangDuAn = label.substring(1);
            this.idTinhTrangDuAN = id.substring(1);
        }
        this.loadDataList();
    }


    isLoad = true;
    loadDataList() {
        this.crr_page = 0;
        this.page_size = 20;
        const queryParams = new QueryParamsModelNew(
            this.filterConfiguration(),
            'asc',
            '',
            this.crr_page,
            this.page_size,
        );
        if (this.filterConfiguration() != null) {
            if (this.isSearchLog) {//Có lưu tùy chọn xem
                this.changedLog(this.isSearchLog);
            }
            this.isLoad = true;
            setTimeout(() => {
                if (this.isLoad) {
                    this.layoutUtilsService.showWaitingDiv();
                }
            }, 2000);
            this.congViecTheoDuAnService.loadCongViecTheoDuAn(queryParams).subscribe(res => {
                this.isLoad = false;
                this.layoutUtilsService.OffWaitingDiv();
                this.IsGov = res.isgov;
                if (res && res.status == 1) {
                    this.dataLazyLoad = [];
                    if (res.data.length > 0) {
                        this.dataLazyLoad = [...this.dataLazyLoad, ...res.data];
                    }

                    this.dataLazyLoad_ID = [];
                    if (res.data_id != null) {
                        this.dataLazyLoad_ID = [...this.dataLazyLoad_ID, ...res.data_id];
                    }

                    this.total_page = res.page ? res.page.AllPage : 0;
                    if (this.dataLazyLoad.length > 0) {
                        this._HasItem = true;
                    }
                    else {
                        this._HasItem = false;
                    }
                    this._loading = false;
                    // if (this.IDDrop == "6" || this.IDDrop == "7") {
                    //     this.dataLazyLoad = this.filterByLocalStorage(this.dataLazyLoad);
                    // }

                } else {
                    this.dataLazyLoad = [];
                    this.dataLazyLoad_ID = [];
                    this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                }
                this.changeDetectorRef.detectChanges();
            });
        }

    }

    //-----------Tuan--3/1/2023---------------------------------------------------//
    //Bo sung truong hop truyen tu report co them filter idDuAn, loai ngay, tu ngay, den ngay
    filterByLocalStorage(data: any[]) {
        this.idDuAn = localStorage.getItem('id_project_team');
        this.collect_by = localStorage.getItem('collect_by');
        this.TuNgay = localStorage.getItem('TuNgay');
        this.DenNgay = localStorage.getItem('DenNgay');
        localStorage.removeItem("id_project_team");
        localStorage.removeItem("collect_by");
        localStorage.removeItem("TuNgay");
        localStorage.removeItem("DenNgay");

        var lstResult = [];

        switch (this.collect_by) {
            case "CreatedDate": {
                data.forEach(item => {
                    var ngay = moment(item.createddate).format("MM/DD/YYYY");
                    if (this.CompareDay(ngay, this.TuNgay, 1) && this.CompareDay(ngay, this.DenNgay)) {
                        lstResult.push(item);
                    }

                })
                break;
            }
            case "deadline": {
                data.forEach(item => {
                    var ngay = moment(item.deadline).format("MM/DD/YYYY");
                    if (this.CompareDay(ngay, this.TuNgay, 1) && this.CompareDay(ngay, this.DenNgay)) {
                        lstResult.push(item);
                    }

                })
                break;
            }
            case "start_date": {
                data.forEach(item => {
                    var ngay = moment(item.start_date).format("MM/DD/YYYY");
                    if (this.CompareDay(ngay, this.TuNgay, 1) && this.CompareDay(ngay, this.DenNgay)) {
                        lstResult.push(item);
                    }

                })
                break;
            }
        }

        if (+this.idDuAn > 0 && (this.IDDrop == "6" || this.IDDrop == "7")) {
            let lst;
            if (lstResult.length > 0) {
                lst = lstResult.filter(item => item.id_project_team == Number.parseInt(this.idDuAn))
            } else {
                lst = data.filter(item => item.id_project_team == Number.parseInt(this.idDuAn))
            }
            return lst;
        } else {
            if (lstResult.length > 0) {
                return lstResult;
            } else {
                return data;
            }
        }

    }

    CompareDay(day1, day2, type = 0) {
        //type = 0 => so sanh be hon  con lai la lon hon

        var Date1, Date2;
        Date1 = new Date(day1);
        Date2 = new Date(day2);
        if (type == 0) {
            if (Date1 < Date2) {
                return true;
            } else {
                return false;
            }
        } else {
            if (Date1 > Date2) {
                return true;
            } else {
                return false;
            }
        }



    }

    removeLocalStorage() {//Thiên 6/1/23
        localStorage.removeItem("TuNgay");
        localStorage.removeItem("DenNgay");
    }
    //--------------------------------------------------------------------------------

    _loading = false;
    _HasItem = false;
    crr_page = 0;
    page_size = 20;
    total_page = 0;
    loadDataList_Lazy() {
        if (!this._loading) {
            this.crr_page++;
            if (this.crr_page < this.total_page) {
                this._loading = true;
                const queryParams = new QueryParamsModelNew(
                    this.filterConfiguration(),
                    'asc',
                    '',
                    this.crr_page,
                    this.page_size,
                );
                this.congViecTheoDuAnService.loadCongViecTheoDuAn(queryParams)
                    .pipe(
                        tap(resultFromServer => {
                            this.IsGov = resultFromServer.isgov;
                            if (resultFromServer.status == 1) {
                                this.dataLazyLoad = [...this.dataLazyLoad, ...resultFromServer.data];
                                this.dataLazyLoad_ID = [...this.dataLazyLoad_ID, ...resultFromServer.data_id];
                                if (resultFromServer.data.length > 0) {
                                    this._HasItem = true;
                                }
                                else {
                                    this._HasItem = false;
                                }
                                this.changeDetectorRef.detectChanges();
                            }
                            else {
                                this._loading = false;
                                this._HasItem = false;
                            }

                        })
                    ).subscribe(res => {
                        this._loading = false;
                    });
            }
        }
    }

    filterConfiguration(): any {
        // let filter: any = {};
        if (this.IDDrop == "-1") {
            return null;
        }
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
        } else if (this.IDDrop == "6" || this.IDDrop == "7") {//Việc được giao và được tạo bởi
            this.filter.filter = this.IDDrop;
            this.filter.id_department = this.idPhongBan;
            this.filter.tiendo = this.idTienDo;
            if (this.IDDrop == "6") {
                this.filter.id_user_giao = this.idNhanVienPB;
            } else {
                this.filter.id_user_tao = this.idNhanVienPB;
            }

            if (+this.idDuAn >= 0) {

                if (+this.idDuAn > 0) {
                    this.filter.id_project_team = this.idDuAn;
                }

                if (this.TuNgay) {
                    this.filter.TuNgay = this.TuNgay;
                }

                if (this.DenNgay) {
                    this.filter.DenNgay = this.DenNgay;
                }
            }
        }
        else {
            this.filter.filter = this.IDDrop;
        }
        if (this.IDDrop == "1" || this.IDDrop == "2" || this.IDDrop == "3" || this.IDDrop == "5") {
            this.filter.status_list = this.idTinhTrang;
        }
        this.filter.displayChild = this.filterCongvieccon ? '1' : '0';

        this.filter.sort = "NgayGiao_Giam";//sắp xếp theo ngày giao giảm
        this.filter.isclose = "0";//Công việc chưa đóng

        return this.filter;
    }

    tinyMCE = {};


    getHeight(): any {
        let tmp_height = window.innerHeight - 60;
        return tmp_height + "px";
    }

    onScroll(event) {
        let _el = event.srcElement;
        if (_el.scrollTop + _el.clientHeight > _el.scrollHeight * 0.9) {
            this.loadDataList_Lazy();
        }
    }



    //==========================Xử lý Khi click vào 1 item=====================
    item: any = [];
    changeRoute(item) {
        this.DataID = item.id_row;
        this.DataID_Project = item.id_project_team;
        this.router.navigateByUrl(environment.HOST_ALINK + `/CongViecTheoDuAn/${this.DataID_Project}/${this.DataID}`);
    }

    description_tiny: string;
    status_dynamic: any[] = [];
    listUser: any[] = [];
    listUser2: any[] = [];
    public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public bankFilterCtrl: FormControl = new FormControl();
    options_assign: any = {};
    // load task
    list_Tag: any = [];
    project_team: any = "";

    LoadObjectID() {
        this.topicObjectID$.next("");
        if (this.getComponentName()) {
            this.weworkService
                .getTopicObjectIDByComponentName(this.getComponentName())
                .pipe(
                    tap((res) => {
                        this.topicObjectID$.next(res);
                    }),
                    catchError((err) => {
                        return of();
                    }),
                    finalize(() => { }),
                    share()
                )
                .subscribe();
        }
    }

    private readonly componentName: string = "kt-task_";
    getComponentName() {
        if (this.DataID) {
            return this.componentName + this.DataID;
        } else {
            return "";
        }
    }
    //===========================================================
    stopPropagation(event) {
        event.stopPropagation();
    }
    //====================Tạo mới công việc=======================
    btnAdd: boolean = false; //Chặn trường hợp click nhiều lần mở popup công việc
    Add() {
        this.btnAdd = true;
        const workModel = new WorkModel();
        workModel.clear(); // Set all defaults fields
        this.Update(workModel);
    }

    Update(_item: WorkModel) {
        setTimeout(() => {
            if (this.IsGov) {
                const dialogRef = this.dialog.open(CongViecTheoDuAnVer1PopupComponent, { data: { _item, _id_duan: this.idDuAn, _type: this.IDDrop }, panelClass: ['sky-padding-0', 'width900'], disableClose: true });
                dialogRef.afterClosed().subscribe(res => {
                    if (!res) {
                        this.loadDataList();
                    }
                    else {
                        this.loadDataList();
                    }
                    this.btnAdd = false;
                });
            } else {
                const dialogRef = this.dialog.open(CongViecTheoDuAnPopupComponent, { data: { _item, _id_duan: this.idDuAn, _type: this.IDDrop }, panelClass: ['sky-padding-0', 'width700'], disableClose: true });
                dialogRef.afterClosed().subscribe(res => {
                    if (!res) {
                        this.loadDataList();
                    }
                    else {
                        this.loadDataList();
                    }
                    this.btnAdd = false;
                });
            }
        }, 500);
    }
    //==============================================================
    loadDataListEmit() {
        this.crr_page = 0;
        this.page_size = 20;
        const queryParams = new QueryParamsModelNew(
            this.filterConfiguration(),
            'asc',
            '',
            this.crr_page,
            this.page_size,
        );
        this.congViecTheoDuAnService.loadCongViecTheoDuAn(queryParams).subscribe(res => {
            this.IsGov = res.isgov;
            if (res && res.status == 1) {
                this.dataLazyLoad = [];
                this.dataLazyLoad = [...this.dataLazyLoad, ...res.data];

                this.dataLazyLoad_ID = [];
                if (res.data_id) {
                    this.dataLazyLoad_ID = [...this.dataLazyLoad_ID, ...res.data_id];
                }

                this.total_page = res.page ? res.page.AllPage : 0;
                if (this.dataLazyLoad.length > 0) {
                    this._HasItem = true;
                }
                else {
                    this._HasItem = false;
                }
                this._loading = false;
            } else {
                this.dataLazyLoad = [];
                this.dataLazyLoad_ID = [];
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
            this.changeDetectorRef.detectChanges();
        });
    }
    //==============================================================
    getColorDeadline(item): string {
        let color = '';
        color = this._FormatCSSTimeService.format_convertDate_W(item.deadline, 2);
        return color;
    }

    getDeadline(item): string {
        let name = '';
        name = this._FormatTimeService.format_convertDate_W(item.deadline, 1, false);
        return name;
    }
    //========================================================================================
    //=====================Bổ sung giao diện đầu tiên khi vào form công việc=======================================
    //====================Start Các hàm xét quyền để sử dụng==============================
    CheckRoles(roleID: number, id_project_team) {
        if (this.IsAdminGroup) {
            return true;
        }
        const x = this.list_role.find(x => x.id_row === id_project_team);
        if (x) {
            if (x.locked) {
                return false;
            }
        }
        if (this.list_role) {
            if (x) {
                if (x.admin === true || +x.admin === 1 || +x.owner === 1 || +x.parentowner === 1) {
                    return true;
                } else {
                    if (roleID === 7 || roleID === 9 || roleID === 11 || roleID === 12 || roleID === 13) {
                        if (x.Roles.find((r) => r.id_role === 15)) {
                            return false;
                        }
                    }
                    if (roleID === 10) {
                        if (x.Roles.find((r) => r.id_role === 16)) {
                            return false;
                        }
                    }
                    if (roleID === 4 || roleID === 14) {
                        if (x.Roles.find((r) => r.id_role === 17)) {
                            return false;
                        }
                    }
                    const r = x.Roles.find(r => r.id_role === roleID);
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

    CheckRoleskeypermit(key, id_project_team) {
        const x = this.list_role.find(x => x.id_row === id_project_team);
        if (x) {
            if (x.locked) {
                return false;
            }
        }
        if (this.IsAdminGroup) {
            return true;
        }
        if (this.list_role) {
            if (x) {
                if (x.admin === true || +x.admin === 1 || +x.owner === 1 || +x.parentowner === 1) {
                    return true;
                } else {
                    if (key === 'title' || key === 'description' || key === 'status' || key === 'checklist' || key === 'delete') {
                        if (x.Roles.find((r) => r.id_role === 15)) {
                            return false;
                        }
                    }
                    if (key === 'deadline') {
                        if (x.Roles.find((r) => r.id_role === 16)) {
                            return false;
                        }
                    }
                    if (key === 'id_nv' || key === 'assign') {
                        if (x.Roles.find((r) => r.id_role === 17)) {
                            return false;
                        }
                    }
                    const r = x.Roles.find(role => role.keypermit === key);
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
    //====================End Các hàm xét quyền để sử dụng================================

    //====================Start Tất cả xử lý cho phần cập nhật trạng thái công việc (status)==============================
    public listDataStatus: any[] = [];
    ListAllStatusDynamic: any = [];
    statusChange(val) {
        this.listDataStatus = [];
        this.congViecTheoDuAnService.listTinhTrangDuAnNew(val.id_project_team, val.id_row).subscribe(res => {
            if (res && res.status == 1) {
                this.listDataStatus = res.data;
            }
            this.changeDetectorRef.detectChanges();
        })
    }
    bindStatus(id_project_team, val) {
        const item = this.ListAllStatusDynamic.find(x => +x.id_row === id_project_team);
        let index;
        if (item) {
            index = item.status.find(x => x.id_row === val);
        }
        if (index) {
            return index.statusname;
        }
        return this.translate.instant('landingpagekey.chuagantinhtrang');
    }
    getColorStatus(id_project_team, val) {
        const item = this.ListAllStatusDynamic.find(x => +x.id_row === id_project_team);
        let index;
        if (item) {
            index = item.status.find(x => x.id_row === val);
        }
        if (index) {
            return index.color;
        } else {
            return 'gray';
        }
    }
    UpdateStatus(task, status) {
        if (+task.status == +status.id_row) {
            return;
        }

        else {
            if (!status.isComment) {
                this.UpdateByKeyNew(task, "status", status.id_row);
            }
            else {
                this.UpdateStatus_SauComment(task, status.id_row)

            }
        }
    }

    UpdateStatus_SauComment(task, status) {

        const dialogRef = this.dialog.open(CommentTaskUpdateStatusComponent,
            {
                data: { task, status },
                panelClass: ['sky-padding-0', 'width700'], disableClose: true
            });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                this.loadDataList();
            }
            else {
                this.loadDataList();
            }
        });
    }
    //========================= End Tất cả xử lý cho phần cập nhật trạng thái công việc (status)=============

    //====================Start Cập nhật tên và nhãn (tag)==============================
    editTitle(val) {
        this.isEdittitle = val;
        const ele = (document.getElementById('task' + val) as HTMLInputElement);
        setTimeout(() => {
            ele.focus();
        }, 50);
    }
    DeleteTask(task) {
        const _title = this.translate.instant('landingpagekey.xoa');
        const _description = this.translate.instant(
            "landingpagekey.bancochacchanmuonxoakhong"
        );
        const _waitDesciption = this.translate.instant(
            'landingpagekey.dulieudangduocxoa'
        );
        const _deleteMessage = this.translate.instant('landingpagekey.xoathanhcong');
        const dialogRef = this.layoutUtilsService.deleteElement(
            _title,
            _description,
            _waitDesciption
        );
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            }
            this.congViecTheoDuAnService.DeleteTask(task.id_row).subscribe(res => {
                if (res && res.status === 1) {
                    this.loadDataList();
                    this.layoutUtilsService.showActionNotification(this.translate.instant("landingpagekey.xoathanhcong"), MessageType.Read, 3000, true, false, 3000, "top", 1);

                } else {
                    this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
                }
            });
        });
    }
    SaveWork(task) {
        if (!task.isStorage) {
            const item = new UpdateWorkModel();
            item.id_row = task.id_row;
            item.key = 'isStorage';
            item.value = "1";
            //item.status_type = type;

            if (task.assign != null) {
                if (task.assign.id_nv > 0) {
                    item.IsStaff = true;
                }
            }
            this.layoutUtilsService.showWaitingDiv();
            this.projectsTeamService._UpdateByKey(item).subscribe((res) => {
                this.layoutUtilsService.OffWaitingDiv();
                if (res && res.status == 1) {

                    // this.loadDataList();

                    this.layoutUtilsService.showActionNotification(
                        this.translate.instant('landingpagekey.luucongviec'), MessageType.Read, 4000, true, false, 3000, 'top', 1);
                } else {
                    this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
                }
            });
        }
        //this.item.isStorage = true;
    }
    ClosedTask(task, value) {
        // this.projectsTeamService.ClosedTask(this.item.id_row, value).subscribe((res) => {
        //     this.LoadData();
        //     this.SendMessage(true);
        //     if (res && res.status == 1) {
        //     } else {
        //         this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
        //     }
        // });

        this.UpdateByKeyNew(task, 'closed', value);
    }
    focusOutFunction(event, node) {
        this.isEdittitle = -1;
        if (event.target.value.trim() === node.title.trim() || event.target.value.trim() === '') {
            event.target.value = node.title;
            return;
        }
        this.UpdateByKeyNew(node, 'title', event.target.value.trim());
    }
    RemoveTag(tag, item) {
        this.UpdateByKeyNew(item, 'Tags', tag.id_row);
    }
    //====================End Cập nhật tên và nhãn (tag)==============================

    //====================Start Cập nhật thêm hoặc xóa người thực hiện công việc *ngSwitchCase="'id_nv'"
    loadOptionprojectteam(node) {
        const id_project_team = node.id_project_team;
        this.LoadUserByProject(id_project_team);
    }
    LoadUserByProject(id_project_team) {
        const filter: any = {};
        filter.id_project_team = id_project_team;
        this.weworkService.list_account(filter).subscribe(res => {
            if (res && res.status === 1) {
                this.listUser = res.data;
                this.options_assign = this.getOptions_Assign();
                this.changeDetectorRef.detectChanges();
            }
        });
    }
    selected_Assign: any[] = [];
    getOptions_Assign() {
        const options_assign: any = {
            showSearch: true,
            keyword: this.getKeyword_Assign(),
            data: this.listUser.filter(
                (x) => this.selected_Assign.findIndex((y) => x.id_nv == y.id_nv) < 0
            ),
        };
        return options_assign;
    }
    selected_Assign2: any[] = [];
    getOptions_Assign2() {
        const options_assign: any = {
            showSearch: true,
            keyword: this.getKeyword_Assign2(),
            data: this.listUser2.filter(
                (x) => this.selected_Assign2.findIndex((y) => x.id_nv == y.id_nv) < 0
            ),
        };
        return options_assign;
    }
    _Assign = "";
    getKeyword_Assign() {
        const i = this._Assign.lastIndexOf("@");
        if (i >= 0) {
            const temp = this._Assign.slice(i);
            if (temp.includes(" ")) {
                return "";
            }
            return this._Assign.slice(i);
        }
        return "";
    }
    _Assign2 = "";
    getKeyword_Assign2() {
        const i = this._Assign2.lastIndexOf("@");
        if (i >= 0) {
            const temp = this._Assign2.slice(i);
            if (temp.includes(" ")) {
                return "";
            }
            return this._Assign2.slice(i);
        }
        return "";
    }
    ItemSelected(val: any, task) { // chọn item
        if (val.id_nv) {
            val.userid = val.id_nv;
        }
        this.UpdateByKeyNew(task, 'assign', val.userid);
    }
    //====================End Cập nhật thêm hoặc xóa người thực hiện công việc==============================

    //====================Start Cập nhật độ ưu tiên *ngSwitchCase="'clickup_prioritize'"==============================
    list_priority = [
        {
            name: 'Urgent',
            value: 1,
            icon: 'fab fa-font-awesome-flag text-danger',
        },
        {
            name: 'High',
            value: 2,
            icon: 'fab fa-font-awesome-flag text-warning',
        },
        {
            name: 'Normal',
            value: 3,
            icon: 'fab fa-font-awesome-flag text-info',
        },
        {
            name: 'Low',
            value: 4,
            icon: 'fab fa-font-awesome-flag text-muted',
        },
        {
            name: 'Clear',
            value: 0,
            icon: 'fas fa-times text-danger',
        },
    ];
    getPriority(id) {
        if (+id > 0 && this.list_priority) {
            const prio = this.list_priority.find((x) => x.value === +id);
            if (prio) {
                return prio;
            }
        }
        return {
            name: "Noset",
            value: 0,
            icon: "far fa-flag",
        };
    }
    updatePriority(task, field, value) {
        this.UpdateByKeyNew(task, field, value);
    }
    //====================End Cập nhật độ ưu tiên==============================

    //====================Start Cập nhật ngày bắt đầu và hạn chót============================
    updateDate(task, date, field) {
        if (date) {
            this.UpdateByKeyNew(task, field, moment(date).format('MM/DD/YYYY HH:mm'));
        } else {
            this.UpdateByKeyNew(task, field, null);
        }
    }
    Updateestimates(task, event) {
        this.UpdateByKeyNew(task, 'estimates', event);
    }
    //====================End Cập nhật ngày bắt đầu và hạn chót==============================

    //================Start Hàm dùng chung=================================
    LoadData() {
        this.pageWorkService.ListAllStatusDynamic().subscribe((res) => {
            if (res && res.status == 1) {
                this.ListAllStatusDynamic = res.data;
            }
        });

        this.congViecTheoDuAnService.GetRoleWeWork("" + this.UserID).subscribe((res) => {//Lấy danh sách quyền JeeWork
            if (res && res.status == 1) {
                this.list_role = res.data.dataRole ? res.data.dataRole : [];
                this.IsAdminGroup = res.data.IsAdminGroup;
            }
        });

        this.weworkService.GetListField(0, 3, false).subscribe(res => {//Lấy danh sách các cột hiển thị
            if (res && res.status === 1) {
                this.listField = res.data;
                const colDelete = ['title', 'id_row', 'id_parent'];
                colDelete.forEach(element => {
                    const indextt = this.listField.findIndex(x => x.fieldname === element);
                    if (indextt >= 0) {
                        this.listField.splice(indextt, 1);
                    }
                });
                this.changeDetectorRef.detectChanges();
            } else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }
    UpdateByKeyNew(task, key, value) {
        const item = new UpdateWorkModel();
        item.id_row = task.id_row;
        item.key = key;
        item.value = value;
        if (task.assign && task.assign.id_nv > 0) {
            item.IsStaff = true;
        }
        // this.store.updateEvent = false;
        this.projectsTeamService._UpdateByKey(item)
            .pipe(tap(() => { }), map((res) => {
                if (res && res.status == 1) {
                    this.loadDataList();
                } else {
                    this.layoutUtilsService.showError(res.error.message);
                }
            }),
                catchError((err) => throwError(err)),
                finalize(() => this.layoutUtilsService.OffWaitingDiv())
            )
            .subscribe(
                (res) => {
                    if (key == "description") {
                        this.showsuccess = true;
                        setTimeout(() => {
                            this.showsuccess = false;
                            this.disabledBtn = false;
                        }, 2000);
                    }
                    if (key == "closed") {
                        this.layoutUtilsService.showActionNotification(this.translate.instant("landingpagekey.dongcongviec"), MessageType.Read, 3000, true, false, 3000, "top", 1);
                    }
                },
                (error) => {
                    this.disabledBtn = false;
                }
            );
    }
    ReloadData(event) {
        this.loadDataList();
    }
    OpenDetail(item) {
        this.congViecTheoDuAnService.filterStorage = this.filter;
        let _item = {
            DataID: item.id_row,
            DataID_Project: item.id_project_team,

            IDDrop: this.IDDrop,
            labelCongViec: this.labelCongViec,

            labelTimKiem: this.labelTimKiem,
            keyword: this.keyword,

            labelDuAn: this.labelDuAn,
            idDuAn: this.idDuAn,

            labelTienDo: this.labelTienDo,
            idTienDo: this.idTienDo,

            ID_NV: this.ID_NV,
            List_ID_NV: this.List_ID_NV,
            label_NV: this.label_NV,

            labelTinhTrang: this.labelTinhTrang,
            idTinhTrang: this.idTinhTrang,
            listStatus: this.listStatus,

            labelTinhTrangDuAn: this.labelTinhTrangDuAn,
            idTinhTrangDuAN: this.idTinhTrangDuAN,
            listStatusDuAn: this.listStatusDuAn,

            filterCongvieccon: this.filterCongvieccon,

            idPhongBan: this.idPhongBan,
            labelPhongBan: this.labelPhongBan,
            idNhanVienPB: this.idNhanVienPB,
            labelNhanVienPB: this.labelNhanVienPB,

            TuNgay: this.TuNgay,
            DenNgay: this.DenNgay,
        }
        this.congViecTheoDuAnService.filterListItem = _item;
        this.router.navigateByUrl(environment.HOST_ALINK + `/CongViecTheoDuAn/Details/${item.id_project_team}/${item.id_row}`);
    }
    popupTask(item) {
        this.router.navigate([
            '',
            { outlets: { auxNameV1: 'auxWorkV1/detailWorkNew/' + item.id_row + '|' + item.id_project_team } },
        ]);
    }
    checkViewAll() {
        if (this.IDDrop == "0") {
            let _item = {
                "appCode": "WORK",
                "mainMenuID": 2,
                "subMenuID": 7,
                "itemID": this.DataID,
            }
            this.socketService.readNotification_menu(_item).subscribe(res => {
                this.loadDataList();

                const busEvent = new CustomEvent('event-mainmenu', {
                    bubbles: true,
                    detail: {
                        eventType: 'update-main',
                        customData: 'some data here'
                    }
                });
                dispatchEvent(busEvent);

                const busEventSub = new CustomEvent('event-submenu', {
                    bubbles: true,
                    detail: {
                        eventType: 'update-sub-jeeworkv1',
                        customData: 'some data here'
                    }
                });
                dispatchEvent(busEventSub);
            })
        } else {
            if (this.dataLazyLoad_ID.length > 0) {
                for (let i = 0; i < this.dataLazyLoad_ID.length; i++) {
                    const element = this.dataLazyLoad_ID[i];
                    let _item = {
                        "appCode": "WORK",
                        "mainMenuID": 2,
                        "subMenuID": 7,
                        "itemID": element,
                    }
                    this.socketService.readNotification_menu(_item).subscribe(res => {
                        const busEvent = new CustomEvent('event-mainmenu', {
                            bubbles: true,
                            detail: {
                                eventType: 'update-main',
                                customData: 'some data here'
                            }
                        });
                        dispatchEvent(busEvent);

                        const busEventSub = new CustomEvent('event-submenu', {
                            bubbles: true,
                            detail: {
                                eventType: 'update-sub-jeeworkv1',
                                customData: 'some data here'
                            }
                        });
                        dispatchEvent(busEventSub);
                    })
                }
                this.loadDataList();
            }
        }

    }
    //================End Hàm dùng chung=================
    //=============bổ sung lọc theo công việc cha con===================
    filterCongvieccon: boolean = true;
    changedCongViecCon() {
        this.filterCongvieccon = !this.filterCongvieccon;
        this.loadDataList();
    }
    //============Bổ sung thiết lập theo dropdown=======================
    thietlap() {
        const dialogRef = this.dialog.open(AddDropDownDialogComponent, {
            data: {},
            position: { top: '60px' },
            panelClass: 'no-padding',
        });
        dialogRef.afterClosed().subscribe(res => {
            this.ngOnInit();
        });
    }

    resetPage() {
        this.router.navigateByUrl(environment.HOST_ALINK + `/CongViecTheoDuAn`);
    }

    //=============bổ sung luu log bộ lọc===================
    isSearchLog: boolean;
    changedLog(val) {
        this.isSearchLog = val;
        localStorage.setItem('isSearchLog', '' + this.isSearchLog);
        if (this.isSearchLog) {
            let _data = [];
            let _item = {
                IDDrop: this.IDDrop,
                labelCongViec: this.labelCongViec,

                labelTimKiem: this.labelTimKiem,
                keyword: this.keyword,

                labelDuAn: this.labelDuAn,
                idDuAn: this.idDuAn,

                labelTienDo: this.labelTienDo,
                idTienDo: this.idTienDo,

                ID_NV: this.ID_NV,
                List_ID_NV: this.List_ID_NV,
                label_NV: this.label_NV,

                labelTinhTrang: this.labelTinhTrang,
                idTinhTrang: this.idTinhTrang,
                listStatus: this.listStatus,

                labelTinhTrangDuAn: this.labelTinhTrangDuAn,
                idTinhTrangDuAN: this.idTinhTrangDuAN,
                listStatusDuAn: this.listStatusDuAn,

                filterCongvieccon: this.filterCongvieccon,

                idPhongBan: this.idPhongBan,
                labelPhongBan: this.labelPhongBan,
                idNhanVienPB: this.idNhanVienPB,
                labelNhanVienPB: this.labelNhanVienPB,

                datafilter: this.filter,
            }
            _data.push(_item)
            localStorage.setItem('filterSearchLog', JSON.stringify(_data));
        } else {
            localStorage.removeItem('filterSearchLog');
            this.loadDataList();
        }
    }

    getIsSearchLog() {
        const isopenchat = localStorage.getItem('isSearchLog');
        return isopenchat;
    }

    handleDataSearchLog(item) {
        if (item.length > 0) {
            this.filter = item[0].datafilter;
            this.IDDrop = item[0].IDDrop;
            this.labelCongViec = item[0].labelCongViec;
            if (this.IDDrop == "4") {
                this.congViecTheoDuAnService.listDuAn().subscribe(res => {
                    if (res && res.status == 1) {
                        if (res.data.length > 0) {
                            this.listDuAn = res.data.filter(x => x.locked == false);
                            this.setUpDropSearchDuAn();
                            //=========Load tình trạng theo dự án==========
                            this.congViecTheoDuAnService.listTinhTrangDuAn(this.idDuAn).subscribe(res => {
                                if (res && res.status == 1) {
                                    this.listTinhTrang = res.data;
                                }
                            })
                        }

                    }
                    this.changeDetectorRef.detectChanges();
                })
            }
            if (this.IDDrop == "3") {
                this.congViecTheoDuAnService.listNhanVienCapDuoi().subscribe(res => {
                    if (res && res.status == 1) {
                        this.listNhanVien = res.data;
                        this.setUpDropSearchNhanVien();
                    }
                    this.changeDetectorRef.detectChanges();
                })
            }



            this.labelTimKiem = item[0].labelTimKiem;
            this.keyword = "";
            this.filter.keyword = "";

            this.labelDuAn = item[0].labelDuAn;
            this.idDuAn = item[0].idDuAn;

            this.labelTienDo = item[0].labelTienDo;
            this.idTienDo = item[0].idTienDo;

            this.ID_NV = item[0].ID_NV;
            this.List_ID_NV = item[0].List_ID_NV;
            this.label_NV = item[0].label_NV;

            this.labelTinhTrang = item[0].labelTinhTrang;
            this.idTinhTrang = item[0].idTinhTrang;
            this.listStatus = item[0].listStatus;

            this.labelTinhTrangDuAn = item[0].labelTinhTrangDuAn;
            this.idTinhTrangDuAN = item[0].idTinhTrangDuAN;
            this.listStatusDuAn = item[0].listStatusDuAn;

            this.filterCongvieccon = item[0].filterCongvieccon;

            this.idPhongBan = item[0].idPhongBan;
            this.labelPhongBan = item[0].labelPhongBan;
            this.idNhanVienPB = item[0].idNhanVienPB;
            this.labelNhanVienPB = item[0].labelNhanVienPB;
            if (this.IDDrop == "6" || this.IDDrop == "7") {
                this.workService.lite_department_by_manager().subscribe(res => {
                    if (res && res.status == 1) {
                        if (res.data.length > 0) {
                            this.listPhongBan = res.data;
                            this.setUpDropSearchPhongBan();
                        }
                    }
                    this.changeDetectorRef.detectChanges();
                })

                this.congViecTheoDuAnService.listNhanVienPB(this.idPhongBan).subscribe(res => {
                    if (res && res.status == 1) {
                        if (res.data.length > 0) {
                            this.listNhanVienPB = res.data;
                            this.setUpDropSearchNhanVienPB();
                        }
                    }
                    this.changeDetectorRef.detectChanges();
                })
            }

            this.loadDataList();
        }
    }

    //==================Xử lý bổ sung filter 6 or 7=======
    //Nhiệm vụ theo người giao và nhiệm vụ theo người tạo
    listPhongBan: any[] = [];
    labelPhongBan: string = "Tất cả";
    idPhongBan: string = "0";
    listNhanVienPB: any[] = [];
    labelNhanVienPB: string = "";
    idNhanVienPB: string = "";
    public bankFilterCtrlPhongBan: FormControl = new FormControl();
    public filteredBanksPhongBan: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    public bankFilterCtrlNhanVienPB: FormControl = new FormControl();
    public filteredBanksNhanVienPB: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    loadDataPhongBan() {
        this.workService.lite_department_by_manager().subscribe(res => {
            if (res && res.status == 1) {
                if (res.data.length > 0) {
                    this.listPhongBan = res.data;
                    this.setUpDropSearchPhongBan();
                    this.idPhongBan = res.data[0].id_row;
                    this.labelPhongBan = res.data[0].title;
                }
                this.loadDataNhanVienPB(this.idPhongBan);
            }
            this.changeDetectorRef.detectChanges();
        })
    }

    setUpDropSearchPhongBan() {
        this.bankFilterCtrlPhongBan.setValue('');
        this.filterBanksPhongBan();
        this.bankFilterCtrlPhongBan.valueChanges
            .pipe()
            .subscribe(() => {
                this.filterBanksPhongBan();
            });
    }

    protected filterBanksPhongBan() {
        if (!this.listPhongBan) {
            return;
        }
        let search = this.bankFilterCtrlPhongBan.value;
        if (!search) {
            this.filteredBanksPhongBan.next(this.listPhongBan.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredBanksPhongBan.next(
            this.listPhongBan.filter(bank => bank.title.toLowerCase().indexOf(search) > -1)
        );
    }

    changePhongBan(item) {
        this.labelPhongBan = item.title;
        this.idPhongBan = item.id_row;
        this.bankFilterCtrlPhongBan.setValue("");
        if (+this.idDuAn > 0) {
            this.loadDataDuAnTheoPhongBan(this.idPhongBan);
        } else {
            this.loadDataNhanVienPB(this.idPhongBan);
        }
    }

    loadDataNhanVienPB(id) {
        this.congViecTheoDuAnService.listNhanVienPB(id).subscribe(res => {
            if (res && res.status == 1) {
                if (res.data.length > 0) {
                    this.listNhanVienPB = res.data;
                    this.setUpDropSearchNhanVienPB();
                }
                this.idNhanVienPB = res.data[0].userid;
                this.labelNhanVienPB = res.data[0].fullname;
                this.loadDataList();
            }
            this.changeDetectorRef.detectChanges();
        })
    }

    setUpDropSearchNhanVienPB() {
        this.bankFilterCtrlNhanVienPB.setValue('');
        this.filterBanksNhanVienPB();
        this.bankFilterCtrlNhanVienPB.valueChanges
            .pipe()
            .subscribe(() => {
                this.filterBanksNhanVienPB();
            });
    }

    protected filterBanksNhanVienPB() {
        if (!this.listNhanVienPB) {
            return;
        }
        let search = this.bankFilterCtrlNhanVienPB.value;
        if (!search) {
            this.filteredBanksNhanVienPB.next(this.listNhanVienPB.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        this.filteredBanksNhanVienPB.next(
            this.listNhanVienPB.filter(bank => bank.fullname.toLowerCase().indexOf(search) > -1)
        );
    }

    changeNhanVienPB(item) {
        this.idNhanVienPB = item.userid;
        this.labelNhanVienPB = item.fullname;
        this.bankFilterCtrlNhanVienPB.setValue("");
        this.loadDataList();
    }

    loadDataDuAnTheoPhongBan(id_pb) {
        this.congViecTheoDuAnService.lite_project_team_by_department(id_pb).subscribe(res => {
            if (res && res.status == 1) {
                if (res.data.length > 0) {
                    this.listDuAn = res.data;
                    this.idDuAn = this.listDuAn[0].id_row;
                    this.labelDuAn = this.listDuAn[0].title;
                    this.setUpDropSearchDuAnTheoPhongBan();
                }
                this.loadDataList();

            }
            this.changeDetectorRef.detectChanges();
        })
    }

    setUpDropSearchDuAnTheoPhongBan() {
        this.bankFilterCtrlDuAn.setValue('');
        this.filterBanksDuAnTheoPhongBan();
        this.bankFilterCtrlDuAn.valueChanges
            .pipe()
            .subscribe(() => {
                this.filterBanksDuAnTheoPhongBan();
            });
    }

    protected filterBanksDuAnTheoPhongBan() {
        if (!this.listDuAn) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrlDuAn.value;
        if (!search) {
            this.filteredBanksDuAn.next(this.listDuAn.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanksDuAn.next(
            this.listDuAn.filter(bank => bank.title.toLowerCase().indexOf(search) > -1)
        );
    }

    changeDuAnTheoPhongBan(item) {
        this.labelDuAn = item.title;
        this.idDuAn = item.id_row;
        this.bankFilterCtrlDuAn.setValue("");
        this.loadDataList();
    }

    CheckShow(node) {
        if (this.CheckRoles(13, node.id_project_team) || this.CheckRoleskeypermit('update_storage', node.id_project_team) || this.CheckRoles(7, node.id_project_team)) {
            return true;
        }
        return false;
    }

    //================Sự kiện load lại danh sách công việc========================
    onLoadTask(e: CustomEvent) {
        if (e.detail.eventType == 'load-task-list') {
            this.loadDataListEmit();
        }
    }

}