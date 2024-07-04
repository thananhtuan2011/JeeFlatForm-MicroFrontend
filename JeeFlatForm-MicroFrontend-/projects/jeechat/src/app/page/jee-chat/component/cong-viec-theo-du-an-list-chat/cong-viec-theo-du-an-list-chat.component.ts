import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, of, ReplaySubject, Subject, throwError } from "rxjs";
import { catchError, finalize, map, share, takeUntil, tap } from "rxjs/operators";
import { TranslateService } from "@ngx-translate/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import * as moment from 'moment';
import { ChatService } from "../../services/chat.service";
import { QueryParamsModel, QueryParamsModelNew } from "../../models/pagram";
import { LayoutUtilsService } from "projects/jeechat/src/modules/crud/utils/layout-utils.service";
import { FormatTimeService } from "./jee-format-time.component";
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
        public datePipe: DatePipe,
        public dialog: MatDialog,
        public _FormatTimeService: FormatTimeService,
        private chatservice: ChatService,
        private layoutUtilsService: LayoutUtilsService,
        private translate: TranslateService,
        private router: Router,
    ) {

    }
    ngOnChanges(changes: SimpleChanges) {
        this.IdGroup = changes.IdGroup.currentValue;
        // console.log("changes.currentValue",changes.IdGroup.currentValue)
        this.loadDataList(changes.IdGroup.currentValue);
        this.changeDetectorRef.detectChanges();

    }
    case_priority_1_istimechat(daynum: any, date_value, date_now, langcode: string) {
        let date = '';
        if (daynum > 1) {//Sau hiện tại hơn 1 ngày
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value, 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value, 'MM/dd/yyyy');
                }
            }
        } else if (daynum == 1) {//Sau hiện tại 1 ngày
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " ngày mai";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " tomorrow";
            }
        } else if (daynum == 0) {//Ngày hiện tại
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " hôm nay";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " today";
            }
        } else if (daynum == -1) {//Trước hiện tại 1 ngày
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " hôm qua";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " yesterday";
            }
        } else if (daynum > -8) {//Trước hiện tại dưới 8 ngày
            if (langcode == "vi") {
                date = (daynum * (-1)) + " ngày";
            } else {
                date = (daynum * (-1)) + " days ago";
            }
        }
        else {//Trước hiện tại từ 8 ngày trở lên
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value, 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value, 'MM/dd/yyyy');
                }
            }
        }
        return date;
    }
    case_priority_1_notistimechat(daynum: any, date_value, date_now, langcode: string) {
        let date = '';
        if (daynum > 1) {//Sau hiện tại hơn 1 ngày
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value, 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value, 'MM/dd/yyyy');
                }
            }
        } else if (daynum == 1) {//Sau hiện tại 1 ngày
            if (langcode == "vi") {
                date = "Ngày mai";
            } else {
                date = "Tomorrow";
            }
        } else if (daynum == 0) {//Ngày hiện tại
            if (langcode == "vi") {
                date = "Hôm nay";
            } else {
                date = "Today";
            }
        } else if (daynum == -1) {//Trước hiện tại 1 ngày
            if (langcode == "vi") {
                date = "Hôm qua";
            } else {
                date = "Yesterday";
            }
        } else if (daynum > -8) {//Trước hiện tại dưới 8 ngày
            if (langcode == "vi") {
                date = (daynum * (-1)) + " ngày";
            } else {
                date = (daynum * (-1)) + " days ago";
            }
        } else {//Trước hiện tại từ 8 ngày trở lên
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = this.datePipe.transform(date_value, 'dd/MM/yyyy');
                } else {
                    date = this.datePipe.transform(date_value, 'MM/dd/yyyy');
                }
            }
        }
        return date;
    }
    f_date_thu(value: any): any {
        let e = this.datePipe.transform(value, 'EEEE');
        let latest_date = this.datePipe.transform(value, 'EEEE, dd/MM/yyy HH:mm');
        switch (e) {
            case "Monday":
                latest_date = latest_date.replace("Monday", "Thứ hai");
                break;
            case "Tuesday":
                latest_date = latest_date.replace("Tuesday", "Thứ ba");
                break;
            case "Wednesday":
                latest_date = latest_date.replace("Wednesday", "Thứ tư");
                break;
            case "Thursday":
                latest_date = latest_date.replace("Thursday", "Thứ năm");
                break;
            case "Friday":
                latest_date = latest_date.replace("Friday", "Thứ sáu");
                break;
            case "Saturday":
                latest_date = latest_date.replace("Saturday", "Thứ bảy");
                break;
            default:
                latest_date = latest_date.replace("Sunday", "Chủ nhật");
                break;
        }
        return latest_date;
    }

    f_date_thuso(value: any): any {
        if (value == null || value == "") {
            return "";
        }
        let e = this.datePipe.transform(value, 'EEEE');
        let latest_date = this.datePipe.transform(value, 'EEEE, dd/MM/yyy');
        switch (e) {
            case "Monday":
                latest_date = latest_date.replace("Monday", "Thứ 2");
                break;
            case "Tuesday":
                latest_date = latest_date.replace("Tuesday", "Thứ 3");
                break;
            case "Wednesday":
                latest_date = latest_date.replace("Wednesday", "Thứ 4");
                break;
            case "Thursday":
                latest_date = latest_date.replace("Thursday", "Thứ 5");
                break;
            case "Friday":
                latest_date = latest_date.replace("Friday", "Thứ 6");
                break;
            case "Saturday":
                latest_date = latest_date.replace("Saturday", "Thứ 7");
                break;
            default:
                latest_date = latest_date.replace("Sunday", "Chủ nhật");
                break;
        }
        return latest_date;
    }
    case_priority_0_istime(daynum: any, date_value, date_now, langcode: string) {
        let date = '';
        if (daynum > 1) {//Sau hiện tại hơn 1 ngày
            if (langcode == "vi") {
                date = this.f_date_thu(date_value);
            } else {
                date = this.datePipe.transform(date_value, 'EEEE, MM/dd/yyy HH:mm');
            }
        } else if (daynum == 1) {//Sau hiện tại 1 ngày
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " ngày mai";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " tomorrow";
            }
        } else if (daynum == 0) {//Ngày hiện tại
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " Hôm nay";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " today";
            }
        } else if (daynum == -1) {//Trước hiện tại 1 ngày
            if (langcode == "vi") {
                date = this.datePipe.transform(date_value, 'HH:mm') + " hôm qua";
            } else {
                date = this.datePipe.transform(date_value, 'HH:mm') + " yesterday";
            }
        } else {//Trước hiện tại trên 1 ngày
            if (langcode == "vi") {
                date = this.f_date_thu(date_value);
            } else {
                date = this.datePipe.transform(date_value, 'EEEE, MM/dd/yyy HH:mm');
            }
        }
        return date;
    }

    //=======================Thời gian đầy đủ không có hiển thị giờ==================================
    case_priority_0_notistime(daynum: any, date_value, date_now, langcode: string) {
        let date = '';
        if (daynum > 1) {//Sau hiện tại hơn 1 ngày
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2) + ", " + date_value.getFullYear();
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d, yyyy');
                }
            }
        } else if (daynum == 1) {//Sau hiện tại 1 ngày
            if (langcode == "vi") {
                date = "Ngày mai";
            } else {
                date = "Tomorrow";
            }
        } else if (daynum == 0) {//Ngày hiện tại
            if (langcode == "vi") {
                date = "Hôm nay";
            } else {
                date = "Today";
            }
        } else if (daynum == -1) {//Trước hiện tại 1 ngày
            if (langcode == "vi") {
                date = "Hôm qua";
            } else {
                date = "Yesterday";
            }
        } else if (daynum > -8) {//Trước hiện tại dưới 8 ngày
            if (langcode == "vi") {
                date = (daynum * (-1)) + " ngày trước";
            } else {
                date = (daynum * (-1)) + " days ago";
            }
        } else {//Trước hiện tại từ 8 ngày trở lên
            if (date_value.getFullYear() == date_now.getFullYear()) {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2);
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d');
                }
            } else {
                if (langcode == "vi") {
                    date = ("0" + (date_value.getDate())).slice(-2) + " thg " + ("0" + (date_value.getMonth() + 1)).slice(-2) + ", " + date_value.getFullYear();
                } else {
                    date = this.datePipe.transform(date_value, 'MMM d, yyyy');
                }
            }
        }
        return date;
    }
    format_convertDateChat(Value: any, Type: any, IsTime: boolean) {
        console.log("Value", Value)
        if (Value == "" || Value == null) {
            return "";
        }

        let langcode = "";
        if (localStorage.getItem('language') == null) {
            langcode = "vi";
        } else {
            langcode = localStorage.getItem('language');
        }
        //Giá trị đầu vào
        let date_value = new Date(Value);
        let date_now = new Date();

        //Convert ngày về dạng string MM/dd/yyyy
        let str_tmp1 = this.datePipe.transform(date_value, 'MM/dd/yyyy');
        let str_tmp2 = this.datePipe.transform(date_now, 'MM/dd/yyyy');

        //Part giá trị này về lại dạng ngày
        var date_tmp1 = new Date(str_tmp1);
        var date_tmp2 = new Date(str_tmp2);
        //Tính ra số ngày
        let days = (date_tmp1.getTime() - date_tmp2.getTime()) / 1000 / 60 / 60 / 24;

        let date_return = '';

        if (Type == 1) {
            if (IsTime) {
                date_return = this.case_priority_1_istimechat(days, date_value, date_now, langcode)
            } else {
                date_return = this.case_priority_1_notistimechat(days, date_value, date_now, langcode)
            }
        } else {
            if (IsTime) {
                date_return = this.case_priority_0_istime(days, date_value, date_now, langcode)
            } else {
                date_return = this.case_priority_0_notistime(days, date_value, date_now, langcode)
            }
        }
        return date_return;
    }
    ReloadData() {
        this.chatservice.ReloadCV$.subscribe(res => {
            if (res) {
                this.loadDataList(res);
            }
        })

    }
    ngOnInit(): void {
        // this.chatservice.ListAllStatusDynamic().subscribe((res) => {
        //     if (res && res.status == 1) {
        //         this.ListStatus = res.data;
        //         console.log("ListStatus", this.ListStatus)
        //     }
        // });
        // this.ReloadData();
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
        // this.loadDataList(this.IdGroup);
        // this.dynamicSearchFormService.filterResult.subscribe((value) => {
        //     this.filter = value;
        //     this.loadDataList();
        // });
        setInterval(() => {
            this.isnew = !this.isnew;
            this.changeDetectorRef.detectChanges();
        }, 1000);
        this.dataLazyLoad = [];



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
        // this.congViecTheoDuAnService.listDuAn().subscribe(res => {
        //     if (res && res.status == 1) {
        //         if (res.data.length > 0) {
        //             this.listDuAn = res.data.filter(x => x.locked == false);
        //             this.idDuAn = this.listDuAn[0].id_row;
        //             this.labelDuAn = this.listDuAn[0].title;
        //             this.setUpDropSearchDuAn();
        //             //=========Load tình trạng theo dự án==========
        //             this.congViecTheoDuAnService.listTinhTrangDuAn(this.idDuAn).subscribe(res => {
        //                 if (res && res.status == 1) {
        //                     this.listTinhTrang = res.data;
        //                 }
        //             })
        //         }
        //         // this.loadDataList();

        //     }
        //     this.changeDetectorRef.detectChanges();
        // })
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
        // this.labelDuAn = item.title;
        // this.idDuAn = item.id_row;
        // this.bankFilterCtrlDuAn.setValue("");
        // this.congViecTheoDuAnService.listTinhTrangDuAn(this.idDuAn).subscribe(res => {
        //     if (res && res.status == 1) {
        //         this.listTinhTrang = res.data;
        //     }
        //     this.changeDetectorRef.detectChanges();
        // })
        // this.loadDataList();
    }
    //=======================End xử lý drop việc dự án====================
    //=======================Start xử lý drop việc cấp dưới===================
    loadNhanVienCapDuoi() {
        // this.congViecTheoDuAnService.listNhanVienCapDuoi().subscribe(res => {
        //     if (res && res.status == 1) {
        //         this.listNhanVien = res.data;
        //         this.setUpDropSearchNhanVien();
        //     }
        //     this.changeNhanVienAll();
        //     this.changeDetectorRef.detectChanges();
        // })
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
        // this.router.navigateByUrl(`Work/CongViecTheoDuAn`);
        this.crr_page = 0;
        this.page_size = 10;
        const queryParams = new QueryParamsModelNew(
            this.filterConfigurationChat(idGroup),
            'asc',
            '',
            this.crr_page,
            this.page_size,
        );
        this.isLoad = true;
        // setTimeout(() => {
        //     if (this.isLoad) {
        //         this.layoutUtilsService.showWaitingDiv();
        //     }
        // }, 2000);
        this.chatservice.loadCongViecTheoDuAnForChat(queryParams).subscribe(res => {
            this.isLoad = false;
            // console.log("resss danh sach cv", res)
            // this.layoutUtilsService.OffWaitingDiv();
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
                // this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
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
                const queryParams = new QueryParamsModel(
                    this.filterConfiguration(),
                    'asc',
                    '',
                    this.crr_page,
                    this.page_size,
                );
                // this.chatservice.loadCongViecTheoDuAn(queryParams)
                //     .pipe(
                //         tap((resultFromServer:any) => {
                //             if (resultFromServer.status == 1) {
                //                 this.dataLazyLoad = [...this.dataLazyLoad, ...resultFromServer.data];

                //                 if (resultFromServer.data.length > 0) {
                //                     this._HasItem = true;
                //                 }
                //                 else {
                //                     this._HasItem = false;
                //                 }
                //                 this.changeDetectorRef.detectChanges();
                //             }
                //             else {
                //                 this._loading = false;
                //                 this._HasItem = false;
                //             }

                //         })
                //     ).subscribe(res => {
                //         this._loading = false;
                //     });
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
        this.filter.conversionid = id;//id group chat


        return this.filter;
    }
    tinyMCE = {};


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
        // this.topicObjectID$.next("");
        // if (this.getComponentName()) {
        //     this.weworkService
        //         .getTopicObjectIDByComponentName(this.getComponentName())
        //         .pipe(
        //             tap((res) => {
        //                 this.topicObjectID$.next(res);
        //             }),
        //             catchError((err) => {
        //                 return of();
        //             }),
        //             finalize(() => { }),
        //             share()
        //         )
        //         .subscribe();
        // }
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


}