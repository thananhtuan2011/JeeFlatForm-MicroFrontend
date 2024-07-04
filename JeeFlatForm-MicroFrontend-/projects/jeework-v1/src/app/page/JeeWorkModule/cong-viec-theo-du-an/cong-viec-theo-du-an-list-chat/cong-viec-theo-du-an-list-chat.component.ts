import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, of, ReplaySubject, Subject, throwError } from "rxjs";
import { catchError, finalize, map, share, takeUntil, tap } from "rxjs/operators";
import { CongViecTheoDuAnService } from "../services/cong-viec-theo-du-an.services";
import { WeWorkService } from "../../component/Jee-Work/jee-work.servide";
import { WorkModel } from "../../component/Jee-Work/jee-work.model";
import { TranslateService } from "@ngx-translate/core";
import { FormControl } from "@angular/forms";
import { CongViecTheoDuAnPopupComponent } from "../cong-viec-theo-du-an-popup/cong-viec-theo-du-an-popup.component";
import { Router } from "@angular/router";
import { FormatTimeService } from "../../../services/jee-format-time.component";
import { PageWorksService } from "../../../services/page-works.service";
import { HttpUtilsService } from "projects/jeework-v1/src/modules/crud/utils/http-utils.service";
import { QueryParamsModelNew } from "../../../models/query-models/query-params.model";
@Component({
    selector: 'app-cong-viec-theo-du-an-list-chat',
    templateUrl: './cong-viec-theo-du-an-list-chat.component.html',
    styleUrls: ["./cong-viec-theo-du-an-list-chat.component.scss"],
})
export class CongViecTheoDuAnListComponentChat implements OnInit, OnChanges {
    @Input() IdGroup: any;
    @Output() GetLength = new EventEmitter();
    @Output() GetIsGov = new EventEmitter();//Thiên
    dataLazyLoad: any = [];
    public IDDrop: string = '1';
    labelCongViec: string = 'Việc tôi làm';

    labelTimKiem: string = 'Tìm kiếm';
    keyword = "";

    labelDuAn: string = "";
    idDuAn: string = "";
    listDuAn: any[] = [];

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
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        public congViecTheoDuAnService: CongViecTheoDuAnService,
        public datepipe: DatePipe,
        public dialog: MatDialog,
        public _FormatTimeService: FormatTimeService,
        public pageWorkService: PageWorksService,
        private translate: TranslateService,
        private weworkService: WeWorkService,
        private router: Router,
        private httpUtils: HttpUtilsService,
    ) {

    }
    ngOnChanges(changes: SimpleChanges) {
        this.IdGroup = changes.IdGroup.currentValue;
        this.loadDataList(changes.IdGroup.currentValue);
        this.changeDetectorRef.detectChanges();

    }
    ReloadData() {
        // this.chatservice.ReloadCV$.subscribe(res => {
        //     if (res) {
        //         this.loadDataList(res);
        //     }
        // })

    }
    ngOnInit(): void {
        this.ReloadData();
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
        this.loadDataList(this.IdGroup);
     
        setInterval(() => {
            this.isnew = !this.isnew;
            this.changeDetectorRef.detectChanges();
        }, 1000);
        this.UserID = this.httpUtils.getUserID();
        this.dataLazyLoad = [];
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
    }

    changeDropDown(val, title: string) {
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
            this.loadDataDuAn();
        } else if (this.IDDrop == "3") {
            this.loadNhanVienCapDuoi();
        } else if (this.IDDrop == "0") {
            // this.loadDataList();
            this.changeDetectorRef.detectChanges();
        } else {
            this.idTinhTrang = "1";
            this.labelTinhTrangDuAn = "Tất cả";
            // this.loadDataList();
        }
    }

    //=======================Start xử lý drop việc dự án===================
    loadDataDuAn() {
        this.congViecTheoDuAnService.listDuAn().subscribe(res => {
            if (res && res.status == 1) {
                if (res.data.length > 0) {
                    this.listDuAn = res.data.filter(x => x.locked == false);
                    this.idDuAn = this.listDuAn[0].id_row;
                    this.labelDuAn = this.listDuAn[0].title;
                    this.setUpDropSearchDuAn();
                    //=========Load tình trạng theo dự án==========
                    this.congViecTheoDuAnService.listTinhTrangDuAn(this.idDuAn).subscribe(res => {
                        if (res && res.status == 1) {
                            this.listTinhTrang = res.data;
                        }
                    })
                }
                // this.loadDataList();

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
            this.listDuAn.filter(bank => bank.title.toLowerCase().indexOf(search) > -1)
        );
    }

    changeDuAn(item) {
        this.labelDuAn = item.title;
        this.idDuAn = item.id_row;
        this.bankFilterCtrlDuAn.setValue("");
        this.congViecTheoDuAnService.listTinhTrangDuAn(this.idDuAn).subscribe(res => {
            if (res && res.status == 1) {
                this.listTinhTrang = res.data;
            }
            this.changeDetectorRef.detectChanges();
        })
        // this.loadDataList();
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
        // this.loadDataList();
    }

    changeNhanVien(item) {
        this.label_NV = item.fullname;
        this.ID_NV = item.userid;
        this.List_ID_NV = "";
        this.bankFilterCtrlNhanVien.setValue("");
        // this.loadDataList();
    }
    //=======================End xử lý drop việc cấp dưới===================
    tinhTrangchange(val, title) {
        this.labelTinhTrang = title;
        this.idTinhTrang = val;
        // this.loadDataList();
    }

    changeTinhTrangDuAn(val, title) {
        this.labelTinhTrangDuAn = title;
        this.idTinhTrangDuAN = val;
        // this.loadDataList();
    }

    isLoad = true;
    loadDataList(idGroup) {
        this.crr_page = 0;
        this.page_size = 20;
        const queryParams = new QueryParamsModelNew(
            this.filterConfigurationChat(idGroup),
            'asc',
            '',
            this.crr_page,
            this.page_size,
        );
        this.isLoad = true;
        this.congViecTheoDuAnService.loadCongViecTheoDuAnForChat(queryParams).subscribe(res => {
            this.isLoad = false;
            this.GetIsGov.emit(res.isgov);
            if (res && res.status == 1) {
                this.dataLazyLoad = [];

                this.dataLazyLoad = [...this.dataLazyLoad, ...res.data];
                this.GetLength.emit(this.dataLazyLoad.length);
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
            }
            this.changeDetectorRef.detectChanges();
        });
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
                            if (resultFromServer.status == 1) {
                                this.dataLazyLoad = [...this.dataLazyLoad, ...resultFromServer.data];

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
            this.filter.status = this.idTinhTrangDuAN;
        }
        else {
            this.filter.filter = this.IDDrop;
        }
        if (this.IDDrop == "1" || this.IDDrop == "2" || this.IDDrop == "3") {
            this.filter.status_default = this.idTinhTrang;
        } else {
            this.filter.status_default = "1";
        }
        this.filter.displayChild = "1";

        this.filter.sort = "NgayGiao_Giam";//sắp xếp theo ngày giao giảm
        this.filter.isclose = "0";//Công việc chưa đóng

        return this.filter;
    }
    filterConfigurationChat(id): any {
        // let filter: any = {};\
        this.filter.conversationid = id;//id group chat

        return this.filter;
    }

    getHeight(): any {
        let tmp_height = window.innerHeight - 390;
        return tmp_height + "px";
    }

    getHeightMain(): any {
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



        this.router.navigate(['', { outlets: { auxName: 'aux/detailWork/' + item.id_row }, }]);
        // this.router.navigateByUrl(`Work/CongViecTheoDuAn/${this.DataID_Project}/${this.DataID}`);
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
    Add() {
        const workModel = new WorkModel();
        workModel.clear(); // Set all defaults fields
        this.Update(workModel);
    }

    Update(_item: WorkModel) {
        const dialogRef = this.dialog.open(CongViecTheoDuAnPopupComponent, { data: { _item, _id_duan: this.idDuAn, _type: this.IDDrop }, panelClass: ['sky-padding-0', 'width700'], });
        // let tmp = {
        //     image: 'https://cdn.jee.vn/jee-hr/images/nhanvien/25/2324.jpg',
        //     hoten: 'Phan Thị Thanh Hằng',
        //     id_nv: 2324
        // }
        // const dialogRef = this.dialog.open(CongViecTheoDuAnPopupComponent,
        //     {
        //         data: { _messageid: 1, _itemid: tmp, _message: "Mô tả chức năng", _type: 2, _groupid: 1 },
        //         panelClass: ['sky-padding-0', 'width700'],
        //     });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                // this.loadDataList();
            }
            else {
                // this.loadDataList();
            }
        });
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
            if (res && res.status == 1) {
                this.dataLazyLoad = [];

                this.dataLazyLoad = [...this.dataLazyLoad, ...res.data];

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
                // this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
            this.changeDetectorRef.detectChanges();
        });
    }
}