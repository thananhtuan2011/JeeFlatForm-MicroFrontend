import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, fromEvent, of, ReplaySubject, Subject, throwError } from "rxjs";
import { catchError, finalize, map, share, takeUntil, tap } from "rxjs/operators";
import { CongViecTheoDuAnService } from "../services/cong-viec-theo-du-an.services";
import { WeWorkService } from "../../component/Jee-Work/jee-work.servide";
import { WorkModel } from "../../component/Jee-Work/jee-work.model";
import { TranslateService } from "@ngx-translate/core";
import { FormControl } from "@angular/forms";
import { CongViecTheoDuAnPopupComponent } from "../cong-viec-theo-du-an-popup/cong-viec-theo-du-an-popup.component";
import { Router } from "@angular/router";
import { CongViecTheoDuAnVer1PopupComponent } from "../cong-viec-theo-du-an-v1-popup/cong-viec-theo-du-an-v1-popup.component";
import { FormatTimeService } from "../../../services/jee-format-time.component";
import { FormatCSSTimeService } from "../../../services/jee-format-css-time.component";
import { PageWorksService } from "../../../services/page-works.service";
import { LayoutUtilsService, MessageType } from "projects/jeework-v1/src/modules/crud/utils/layout-utils.service";
import { DynamicSearchFormService } from "../../component/dynamic-search-form/dynamic-search-form.service";
import { SocketioService } from "../../../services/socketio.service";
import { WorksbyprojectService } from "../../../services/worksbyproject.service";
import { HttpUtilsService } from "projects/jeework-v1/src/modules/crud/utils/http-utils.service";
import { QueryParamsModel, QueryParamsModelNew } from "../../../models/query-models/query-params.model";
import { environment } from "projects/jeework-v1/src/environments/environment";
import { PageWorkDetailStore } from "../../../services/page-work-detail.store";
@Component({
    selector: 'app-cong-viec-theo-du-an-list',
    templateUrl: './cong-viec-theo-du-an-list.component.html',
    styleUrls: ["./cong-viec-theo-du-an-list.component.scss"],
})
export class CongViecTheoDuAnListComponent implements OnInit {

    dataLazyLoad: any = [];
    dataLazyLoad_ID: any = [];//Bổ sung ngày 11/10/2022 dùng để lấy danh sách id đánh dấu đã xem
    public IDDrop: string = '-1';
    labelCongViec: string = '';
    listDropDown: any[] = [];

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
    IsGov: boolean = false;
    //--------------------Thiên-6/1/2023------------------------------------
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
        private socketService: SocketioService,
        public workService: WorksbyprojectService,
        private httpUtils: HttpUtilsService,
        public store: PageWorkDetailStore,
    ) {

    }
    ngOnInit(): void {
        let opt = {
            title: this.translate.instant('landingpagekey.timkiem'),
            searchbox: 'keyword',
            controls: [
                {
                    type: -2,
                    name: 'keyword',
                    placeholder: this.translate.instant('landingpagekey.tukhoa'),
                    default: this.congViecTheoDuAnService.filterListItem ? this.congViecTheoDuAnService.filterListItem.keyword : ''
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
                        this.resetPage();
                    }
                    if (this.congViecTheoDuAnService.filterListItem && this.congViecTheoDuAnService.filterStorage) {
                        this.DataID = +this.congViecTheoDuAnService.filterListItem.DataID;
                        this.DataID_Project = +this.congViecTheoDuAnService.filterListItem.DataID_Project;

                        this.filter = this.congViecTheoDuAnService.filterStorage;
                        this.IDDrop = this.congViecTheoDuAnService.filterListItem.IDDrop;
                        this.labelCongViec = this.congViecTheoDuAnService.filterListItem.labelCongViec;
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

                        this.labelTimKiem = this.congViecTheoDuAnService.filterListItem.labelTimKiem;
                        this.keyword = this.congViecTheoDuAnService.filterListItem.keyword;

                        this.labelDuAn = this.congViecTheoDuAnService.filterListItem.labelDuAn;
                        this.idDuAn = this.congViecTheoDuAnService.filterListItem.idDuAn;

                        this.labelTienDo = this.congViecTheoDuAnService.filterListItem.labelTienDo;
                        this.idTienDo = this.congViecTheoDuAnService.filterListItem.idTienDo;

                        this.ID_NV = this.congViecTheoDuAnService.filterListItem.ID_NV;
                        this.List_ID_NV = this.congViecTheoDuAnService.filterListItem.List_ID_NV;
                        this.label_NV = this.congViecTheoDuAnService.filterListItem.label_NV;

                        this.labelTinhTrang = this.congViecTheoDuAnService.filterListItem.labelTinhTrang;
                        this.idTinhTrang = this.congViecTheoDuAnService.filterListItem.idTinhTrang;
                        this.listStatus = this.congViecTheoDuAnService.filterListItem.listStatus;

                        this.labelTinhTrangDuAn = this.congViecTheoDuAnService.filterListItem.labelTinhTrangDuAn;
                        this.idTinhTrangDuAN = this.congViecTheoDuAnService.filterListItem.idTinhTrangDuAN;
                        this.listStatusDuAn = this.congViecTheoDuAnService.filterListItem.listStatusDuAn;

                        this.filterCongvieccon = this.congViecTheoDuAnService.filterListItem.filterCongvieccon;

                        this.idPhongBan = this.congViecTheoDuAnService.filterListItem.idPhongBan;
                        this.labelPhongBan = this.congViecTheoDuAnService.filterListItem.labelPhongBan;
                        this.idNhanVienPB = this.congViecTheoDuAnService.filterListItem.idNhanVienPB;
                        this.labelNhanVienPB = this.congViecTheoDuAnService.filterListItem.labelNhanVienPB;
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

                            if (+this.idDuAn >= 0) {
                                this.TuNgay = this.congViecTheoDuAnService.filterListItem.TuNgay;
                                this.DenNgay = this.congViecTheoDuAnService.filterListItem.DenNgay;
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
                                    }
                                    this.changeDetectorRef.detectChanges();
                                })
                            }

                        }

                        //========reset filter tạm=========
                        this.congViecTheoDuAnService.filterListItem = null;
                        this.congViecTheoDuAnService.filterStorage = null;
                    } else {
                        this.filter = value;
                    }
                    this.loadDataList();
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
        this.pageWorkService.ListAllStatusDynamic().subscribe((res) => {
            if (res && res.status == 1) {
                this.ListStatus = res.data;
            }
        });

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
    }

    changeDropDown(val, title: string) {
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
            this.loadDataDuAn();
        } else if (this.IDDrop == "6" || this.IDDrop == "7") {
            this.labelTienDo = "Tất cả";
            this.idTienDo = "0";
            this.idDuAn = "-1";
            this.loadDataPhongBan();
        } else if (this.IDDrop == "3") {
            this.idTinhTrang = "1";
            this.labelTinhTrang = "Tất cả";
            this.listStatus = [];
            this.loadNhanVienCapDuoi();
        } else if (this.IDDrop == "0") {
            this.resetPage();
            this.loadDataList();
            this.changeDetectorRef.detectChanges();
        } else {
            this.idTinhTrang = "1";
            this.labelTinhTrang = "Tất cả";
            this.listStatus = [];
            this.resetPage();
            this.loadDataList();
        }
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
                this.resetPage();
                this.loadDataList();

            }
            this.changeDetectorRef.detectChanges();
        })
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
        this.resetPage();
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
        this.resetPage();
        this.loadDataList();
    }

    changeNhanVien(item) {
        this.label_NV = item.fullname;
        this.ID_NV = item.userid;
        this.List_ID_NV = "";
        this.bankFilterCtrlNhanVien.setValue("");
        this.resetPage();
        this.loadDataList();
    }
    //=======================End xử lý drop việc cấp dưới===================
    tinhTrangchange(val, title) {
        this.labelTinhTrang = title;
        this.idTinhTrang = val;
        this.resetPage();
        this.loadDataList();
    }

    changeTinhTrangDuAn(val, title) {
        this.labelTinhTrangDuAn = title;
        this.idTinhTrangDuAN = val;
        this.resetPage();
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
                    if (res.data_id && res.data_id.length > 0) {
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

    }

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
                const queryParams = new QueryParamsModel(
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
                this.filter.list_id_nv = this.List_ID_NV;
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

    getHeight(): any {
        let tmp_height = 0;
        if (this.IDDrop == "4") {
            tmp_height = window.innerHeight - 225;

        } else {
            tmp_height = window.innerHeight - 155;
        }
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
        this.router.navigateByUrl(environment.HOST_ALINK + `/CongViecTheoDuAn/Details/${this.DataID_Project}/${this.DataID}`);
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
    //=========================================================================
    ListStatus: any = [];
    getTinhtrangCV(item, field = "title", IsbackgroundColor = false) {
        var liststatus;
        if (this.ListStatus.find((x) => x.id_row == item.id_project_team)) {
            liststatus = this.ListStatus.find((x) => x.id_row == item.id_project_team)
                .status;
        } else return "";
        var status = liststatus.find((x) => x.id_row == item.status);
        if (!status) return;
        if (field == "color") {
            {
                if (IsbackgroundColor || status.color != 'rgb(181, 188, 194)')
                    return status.color;
                else {
                    return '#424242';
                }
            }
        } else {
            return status.statusname;
        }
    }

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

    list_priority_new = [
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
        if (+id > 0 && this.list_priority_new) {
            const prio = this.list_priority_new.find((x) => x.value === +id);
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

    getPriorityLog(id) {
        if (+id > 0 && this.list_priority_new) {
            const prio = this.list_priority_new.find((x) => x.value === +id);
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

    getPriorityMain(id) {
        if (id > 0) {
            const item = this.list_priority.find((x) => x.value === id);
            if (item) {
                return item.icon;
            }
            return "far fa-flag";
        } else {
            return "far fa-flag";
        }
    }

    getActionActivities(value) {
        let text = "";
        text = value.action;
        if (text) {
            return text.replace("{0}", "");
        }
        return "";
    }

    bindStatus(val) {
        const stt = this.status_dynamic.find((x) => +x.id_row == +val);
        if (stt) {
            return stt.statusname;
        }
        return this.translate.instant("landingpagekey.chuagantinhtrang");
    }

    getColorStatus(val) {
        const index = this.status_dynamic.find((x) => x.id_row == val);
        if (index) {
            return index.color;
        } else {
            return "gray";
        }
    }

    stopPropagation(event) {
        event.stopPropagation();
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
                        this.resetPage();
                        this.loadDataList();
                    }
                    else {
                        this.resetPage();
                        this.loadDataList();
                    }
                    this.btnAdd = false;
                });
            }
        }, 500)
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
                this.dataLazyLoad_ID = [...this.dataLazyLoad_ID, ...res.data_id];

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
    resetPage() {
        this.DataID = 0;
        this.DataID_Project = 0;
        this.router.navigateByUrl(environment.HOST_ALINK + `/CongViecTheoDuAn/Details`);
    }

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

    //===============================================================
    checkStatus(val) {
        let obj = this.listStatus.find(x => x.id == val);
        if (obj) {
            return true;
        }
        return false;
    }

    checkStatusDuAn(val) {
        let obj = this.listStatusDuAn.find(x => x.id == val);
        if (obj) {
            return true;
        }
        return false;
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

    //=============bổ sung lọc theo công việc cha con===================
    filterCongvieccon: boolean = true;
    changedCongViecCon(val) {
        this.filterCongvieccon = val.checked;
        this.loadDataList();
    }

    //==========================================================
    getMoreInformation(item): string {
        return item.hoten + ' \n ' + item.jobtitle;
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

    //================Sự kiện load lại danh sách công việc========================
    onLoadTask(e: CustomEvent) {
        if(e.detail.eventType == 'load-task-list'){
            this.loadDataListEmit();
        }
    }
}