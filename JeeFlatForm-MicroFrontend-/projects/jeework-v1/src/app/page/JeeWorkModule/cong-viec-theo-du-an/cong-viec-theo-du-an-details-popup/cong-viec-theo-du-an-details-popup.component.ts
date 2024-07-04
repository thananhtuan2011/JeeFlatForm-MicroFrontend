import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BehaviorSubject, of, ReplaySubject, Subject, throwError } from "rxjs";
import { catchError, finalize, map, share, takeUntil, tap } from "rxjs/operators";
import { CongViecTheoDuAnService } from "../services/cong-viec-theo-du-an.services";
import { AttachmentService, ProjectsTeamService, UpdateByKeyService, WeWorkService, WorkService } from "../../component/Jee-Work/jee-work.servide";
import { AttachmentModel, ChecklistItemModel, ChecklistModel, FileUploadModel, UpdateByKeyModel, UpdateWorkModel, WorkModel, WorkViewModel } from "../../component/Jee-Work/jee-work.model";
import { TranslateService } from "@ngx-translate/core";
import { FormControl } from "@angular/forms";
import { LogWorkDescriptionComponent } from "../../component/Jee-Work/log-work-description/log-work-description.component";
import { tinyMCE } from "../../component/Jee-Work/tinyMCE";
import { CongViecTheoDuAnVer1PopupComponent } from "../cong-viec-theo-du-an-v1-popup/cong-viec-theo-du-an-v1-popup.component";
import { CongViecTheoDuAnPopupComponent } from "../cong-viec-theo-du-an-popup/cong-viec-theo-du-an-popup.component";
import { CongViecTheoDuAnChartComponent } from "../cong-viec-theo-du-an-chart/cong-viec-theo-du-an-chart.component";
import * as moment from 'moment';
import { DialogDeadlineComponent } from "../../component/Jee-Work/dialog-deadline/dialog-deadline.component";
import { FormatTimeService } from "../../../services/jee-format-time.component";
import { LayoutUtilsService, MessageType } from "projects/jeework-v1/src/modules/crud/utils/layout-utils.service";
import { PageWorkDetailStore } from "../../../services/page-work-detail.store";
import { PageWorksService } from "../../../services/page-works.service";
import { QueryParamsModelNew } from "../../../models/query-models/query-params.model";
import { HttpUtilsService } from "projects/jeework-v1/src/modules/crud/utils/http-utils.service";
import { EditorGeneralComponent } from "../../component/editor/editor.component";
import { SocketioService } from "../../../services/socketio.service";
import { JeeWorkV1Store } from "../../auxiliary-router/auxiliary-router-jw.store";
import { quillConfig } from "../../component/Jee-Work/Quill_config";
@Component({
    selector: 'app-cong-viec-theo-du-an-details-popup',
    templateUrl: './cong-viec-theo-du-an-details-popup.component.html',
    styleUrls: ["./cong-viec-theo-du-an-details-popup.component.scss"],
})
export class CongViecTheoDuAnDetaisPopupComponent implements OnInit {
    //giữ tạm giá trị update status nếu isCommnet==true
    task: any;
    id_status: number = 0;
    //end giữ tạm giá trị update status nếu isCommnet==true
    dataLazyLoad: any = [];
    public IDDrop: string = '1';
    labelCongViec: string = 'Việc tôi làm';

    labelTimKiem: string = 'Tìm kiếm';
    keyword = "";
    public quillConfig: {};
    labelDuAn: string = "";
    idDuAn: string = "";
    listDuAn: any[] = [];

    listNhanVien: any[] = [];
    ID_NV: number = 0;
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

    //====================Hình thức====================
    public bankFilterCtrlDuAn: FormControl = new FormControl();
    public filteredBanksDuAn: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    //==================Ẩn hiện công việc con - công việc liên kết========
    isgov: boolean = false;
    listTaskByDes: any[] = [];
    listTaskBySrc: any[] = [];
    //====================================================================
    txtMoTa: string = '';
    IsShow_CheckList:boolean= false;
    checklist :string= '';
    CheckList: any[] = [];
    old_description_tiny: string;
    IsShow_MoTaCV = false;
    description = '';
    checklist_item = '';
    //===(09/02/2023)====Thay đổi tiện ích tiny -> quill=================
    public editorStyles1 = {
        'min-height': '400px',
        'max-height': '400px',
        'height': '100%',
        'font-size': '12pt',
        'overflow-y': 'auto',
        'padding-bottom': '3%',
    };
    UserCurrent_lib: string = '';
    constructor(public dialogRef: MatDialogRef<CongViecTheoDuAnDetaisPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private changeDetectorRef: ChangeDetectorRef,
        public congViecTheoDuAnService: CongViecTheoDuAnService,
        public datepipe: DatePipe,
        public dialog: MatDialog,
        public _FormatTimeService: FormatTimeService,
        public workService: WorkService,
        private layoutUtilsService: LayoutUtilsService,
        public store: PageWorkDetailStore,
        private projectsTeamService: ProjectsTeamService,
        private translate: TranslateService,
        private weworkService: WeWorkService,
        private _attservice: AttachmentService,
        private socketService: SocketioService,
        public jeeWorkV1Store: JeeWorkV1Store,
        public pageWorkService: PageWorksService,
        private httpUtils: HttpUtilsService,
        private updateByKeyService:UpdateByKeyService,
    ) {
        this.UserCurrent_lib = this.httpUtils.getUsername();
        console.log("UserCurrent_lib", this.UserCurrent_lib)
    }
    ngOnInit(): void {
        this.quillConfig = quillConfig;
        this.UserID = this.httpUtils.getUserID();
        this.tinyMCE = tinyMCE;
        this.DataID = +this.data._item._id;
        this.DataID_Project = +this.data._item._id_project;
        this.ShowMain = false;
        this.LoadData();
        this.LoadDetails();
        //=====Bổ sung call api đánh dâu xem công việc 28/09/2022
        this.CheckViewWork();
        this.pageWorkService.ListAllStatusDynamic().subscribe((res) => {
            if (res && res.status == 1) {
                this.ListAllStatusDynamic = res.data;
            }
        });
        //=====Gọi tham số hiển thị text mô tả=================
        this.congViecTheoDuAnService.getThamSo(15).subscribe(res => {
            if (res && res.status == 1) {
                this.txtMoTa = res.data;
                this.changeDetectorRef.detectChanges();
            }
        })
        this.LoadChecklist();
    }

    filterConfiguration(): any {
        let filter: any = {};
        filter.keyword = this.keyword;
        if (this.IDDrop == "3") {//Việc cấp dưới
            filter.filter = "1";
            filter.id_nv = this.ID_NV > 0 ? this.ID_NV : '';
        } else if (this.IDDrop == "4") {//Việc dự án
            filter.filter = "4";
            filter.id_project_team = this.idDuAn;
            filter.status = this.idTinhTrangDuAN;
        }
        else {
            filter.filter = this.IDDrop;
        }
        if (this.IDDrop == "1" || this.IDDrop == "2") {
            filter.status_default = this.idTinhTrang;
        } else {
            filter.status_default = "1";
        }
        filter.displayChild = "0";
        return filter;
    }

    tinyMCE = {};


    getHeightMain(): any {
        let tmp_height = window.innerHeight - 65;
        return tmp_height + "px";
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

    getHeightMainRight(): any {
        let tmp_height = window.innerHeight - 60;
        return tmp_height + "px";
    }

    getWidthDetails(): any {
        let tmp = window.innerWidth - 350 - 70;
        return tmp + "px";
    }

    getWidthDetailsLeft(): any {
        let tmp = document.getElementById("body-details").clientWidth - 400;
        return tmp + "px";
    }

    //==========================Xử lý Khi click vào 1 item=====================
    item: any = [];
    description_tiny: string;
    status_dynamic: any[] = [];
    listUser: any[] = [];
    public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
    public bankFilterCtrl: FormControl = new FormControl();
    options_assign: any = {};
    // load task
    list_Tag: any = [];
    project_team: any = "";
    LoadDetails() {
        this.congViecTheoDuAnService.GetRoleWeWork("" + this.UserID).subscribe((res) => {//Lấy danh sách quyền JeeWork
            if (res && res.status == 1) {
                this.list_role = res.data.dataRole ? res.data.dataRole : [];
                this.IsAdminGroup = res.data.IsAdminGroup;
                // this.CheckUserInProject(res.data);
            }
        });

        this.weworkService.ListStatusDynamic(this.DataID_Project, this.DataID).subscribe((res) => {
            if (res && res.status === 1) {
                this.status_dynamic = res.data;
                this.changeDetectorRef.detectChanges();
            }
        });

        setTimeout((x) => {
            const filter: any = {};
            filter.id_project_team = this.DataID_Project;
            this.weworkService.list_account(filter).subscribe((res) => {
                this.changeDetectorRef.detectChanges();
                if (res && res.status === 1) {
                    this.listUser = res.data;
                    this.setUpDropSearchNhanVien();
                    this.changeDetectorRef.detectChanges();
                }
                this.options_assign = this.getOptions_Assign();
            });
        }, 500);

        this.weworkService.lite_tag(this.DataID_Project).subscribe((res) => {
            if (res && res.status === 1) {
                this.list_Tag = res.data;
                this.changeDetectorRef.detectChanges();
            }
        });

        this.LoadObjectID();
    }

    setUpDropSearchNhanVien() {
        this.bankFilterCtrl.setValue("");
        this.filterBanks();
        this.bankFilterCtrl.valueChanges.pipe().subscribe(() => {
            this.filterBanks();
        });
    }
    protected filterBanks() {
        if (!this.listUser) {
            return;
        }
        let search = this.bankFilterCtrl.value;
        if (!search) {
            this.filteredBanks.next(this.listUser.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanks.next(
            this.listUser.filter(
                (bank) => bank.hoten.toLowerCase().indexOf(search) > -1
            )
        );
    }

    LoadData() {
        this.congViecTheoDuAnService.WorkDetail(this.DataID).subscribe((res) => {
            if (res && res.status == 1) {
                this.item = res.data;
                this.isclosed = this.item.closed;
                if (!this.chinhsuamota) {
                    // this.description_tiny = this.item.description;
                    let repcale = this.item.description.replaceAll('color: rgb(0, 0, 0)', '');
                    this.description_tiny = repcale;
                }
                this.ShowMain = true;
                if (this.item.isnewchange) {
                    this.updateReadItem();
                }
                this.isgov = res.isgov;
                if (this.isgov) {
                    this.listTaskBySrc = [];
                    this.congViecTheoDuAnService.GetRelationshipTaskBySourceID(this.DataID).subscribe(res => {
                        if (res && res.status == 1 && res.data.length > 0) {
                            this.listTaskBySrc = res.data;
                        }
                        this.changeDetectorRef.detectChanges();
                    })

                    this.listTaskByDes = [];
                    this.congViecTheoDuAnService.GetRelationshipTaskByDesID(this.DataID).subscribe(res => {
                        if (res && res.status == 1 && res.data.length > 0) {
                            this.listTaskByDes = res.data;
                        }
                        this.changeDetectorRef.detectChanges();
                    })
                }
                this.changeDetectorRef.detectChanges();
            } else {
                this.layoutUtilsService.showError(res.error.message);
            }
        });
        this.LoadLog();
    }

    LoadDataParent() {
        this.congViecTheoDuAnService.WorkDetail(this.DataID, true).subscribe((res) => {
            if (res && res.status == 1) {
                this.item = res.data;
                this.isclosed = this.item.closed;
                let repcale = this.item.description.replaceAll('color: rgb(0, 0, 0)', '');
                this.description_tiny = repcale;
                this.ShowMain = true;
                this.isgov = res.isgov;
                if (this.isgov) {
                    this.listTaskBySrc = [];
                    this.congViecTheoDuAnService.GetRelationshipTaskBySourceID(this.DataID).subscribe(res => {
                        if (res && res.status == 1 && res.data.length > 0) {
                            this.listTaskBySrc = res.data;
                        }
                        this.changeDetectorRef.detectChanges();
                    })

                    this.listTaskByDes = [];
                    this.congViecTheoDuAnService.GetRelationshipTaskByDesID(this.DataID).subscribe(res => {
                        if (res && res.status == 1 && res.data.length > 0) {
                            this.listTaskByDes = res.data;
                        }
                        this.changeDetectorRef.detectChanges();
                    })
                }
                this.changeDetectorRef.detectChanges();
            } else {
                this.layoutUtilsService.showError(res.error.message);
            }
        });
        this.LoadLog();
    }

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
    deletext(id_checkList) {
        const text = (
            document.getElementById('checklist' + id_checkList)
        ) as HTMLInputElement;
        if (text && text.value != '') {
            return true;
        }
        return false;
    }
    Update_CheckList_Item(_item, id_checklist) {
        const item = new ChecklistItemModel();
        item.id_row = _item.id_row;
        item.title = _item.title;
        item.id_checklist = id_checklist;
        item.checker = _item.checker ? 1 : 0;
        this.workService.Update_CheckList_Item(item).subscribe((res) => {
            if (res && res.status === 1) {
                // this.layoutUtilsService.showActionNotification('Update thành công', MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            } else {
                this.layoutUtilsService.showActionNotification(
                    res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                this.LoadChecklist();
            }
            this.changeDetectorRef.detectChanges();
        });
    }
    CheckedChecklist(items) {
        this.workService.CheckedItem(items.id_row).subscribe((res) => {
            if (res && res.status === 1) {
                items.checked = !items.checked;
            } else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
            this.changeDetectorRef.detectChanges();
        });
    }
    DeleteItem(_item: ChecklistItemModel) {
        const _title = this.translate.instant('landingpagekey.xoa');
        const _description = this.translate.instant(
            'landingpagekey.bancochacchanmuonxoakhong'
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
                this.LoadDataWorkDetail(this.DataID);
                return;
            }
            this.workService.DeleteItem(_item.id_row).subscribe((res) => {
                if (res && res.status === 1) {
                    this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
                    this.LoadChecklist();
                } else {
                    this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                }
            });
        });
        this.LoadDataWorkDetail(this.DataID);
    }
    hidebuttondelete(id_checkList) {
        ((
            document.getElementById('checklist' + id_checkList)
        ) as HTMLInputElement).value = '';
    }
    Delete_CheckList(_item: ChecklistModel) {
        const _title = this.translate.instant('landingpagekey.xoa');
        const _description = this.translate.instant(
            'landingpagekey.bancochacchanmuonxoakhong'
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
                this.LoadDataWorkDetail(this.DataID);
                return;
            }

            this.workService.Delete_CheckList(_item.id_row).subscribe((res) => {
                if (res && res.status === 1) {
                    this.layoutUtilsService.showActionNotification(
                        _deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
                    this.LoadChecklist();
                } else {
                    this.layoutUtilsService.showActionNotification(
                        res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                }
            });
        });
        this.LoadDataWorkDetail(this.DataID);
    }
    updateNewChecklist(_item) {
        const item = new ChecklistModel();
        item.id_row = _item.id_row;
        item.title = _item.title;
        this.workService.Update_CheckList(item).subscribe((res) => {
            this.changeDetectorRef.detectChanges();
            if (res && res.status === 1) {
                // this.layoutUtilsService.showActionNotification('Update thành công', MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            } else {
                this.layoutUtilsService.showActionNotification(
                    res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                this.LoadChecklist();
            }
        });
    }
    InsertCheckListItem(id_checkList: number) {
        const text = ((
            document.getElementById('checklist' + id_checkList)
        ) as HTMLInputElement).value;
        const model = new ChecklistItemModel();
        model.id_checklist = id_checkList;
        model.title = text; // item.id_row
        this.updateByKeyService.Insert_CheckList_Item(model).subscribe((res) => {
            this.changeDetectorRef.detectChanges();
            if (res && res.status === 1) {
                this.LoadChecklist();
                this.changeDetectorRef.detectChanges();
                ((
                    document.getElementById('checklist' + id_checkList)
                ) as HTMLInputElement).value = '';
            } else {
                this.layoutUtilsService.showActionNotification(
                    res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }
    Update_CheckList() {
        this.IsShow_CheckList = !this.IsShow_CheckList;
        this.checklist = '';
    }
    Value = '';
    MoTaCongViec = '';
    Get_ValueByKey(key: string): string {
        switch (key) {
            case '16':
                return (this.Value = this.MoTaCongViec);
            case '0':
                return (this.Value = this.checklist);
        }
        return '';
    }
    UpdateByKey(id_log_action: string, key: string, IsQuick: boolean) {
        // if (!this.KiemTraThayDoiCongViec(this.item, id_log_action == '0' ? 'checklist' : key)) {
        //     return;
        // }
        this.Get_ValueByKey(id_log_action);
        const model = new UpdateByKeyModel();
        if (IsQuick) {
            model.id_row = this.item.id_row;
            model.id_log_action = id_log_action;
            model.value = this.Value;
            model.key = key;
            if (id_log_action == '0') {
                const checklist_model = new ChecklistModel();
                checklist_model.id_work = this.item.id_row;
                checklist_model.title = this.Value;

                this.workService.Insert_CheckList(checklist_model)
                    .subscribe((res) => {
                        if (res && res.status === 1) {
                            this.IsShow_CheckList = !this.IsShow_CheckList;
                            this.LoadChecklist();
                            this.LoadDataWorkDetail(this.DataID);
                            this.changeDetectorRef.detectChanges();
                        } else {
                            this.layoutUtilsService.showError(
                                res.error.message
                            );
                        }
                    });
            } else {
                this.updateByKeyService.UpdateByKey(model).subscribe((res) => {
                    this.changeDetectorRef.detectChanges();
                    if (res && res.status === 1) {
                        this.IsShow_MoTaCV = !this.IsShow_MoTaCV;
                        this.projectsTeamService.WorkDetail(model.id_row).subscribe((res) => {

                            if (res && res.status == 1) {
                                this.description = res.data.description;
                                this.description_tiny = this.description;
                                this.old_description_tiny = this.description;
                                this.LoadDataWorkDetail(this.DataID);
                                // this.checklist = res.data.description;
                                // this.ngOnInit();
                                this.changeDetectorRef.detectChanges();
                            }
                        });
                        this.changeDetectorRef.detectChanges();
                    } else {
                        this.layoutUtilsService.showActionNotification(
                            res.error.message,
                            MessageType.Read,
                            9999999999,
                            true,
                            false,
                            3000,
                            'top',
                            0
                        );
                    }
                });
            }
        } else {
            model.clear(); // Set all defaults fields
            // this.UpdateKey(model);
        }
    }
    // UpdateKey(_item: UpdateByKeyModel) {
    //     let saveMessageTranslateParam = '';
    //     saveMessageTranslateParam +=
    //         _item.id_row > 0
    //             ? 'GeneralKey.capnhatthanhcong'
    //             : 'GeneralKey.themthanhcong';
    //     const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    //     const _messageType =
    //         _item.id_row > 0 ? MessageType.Update : MessageType.Create;
    //     const dialogRef = this.dialog.open(UpdateByKeysComponent, {
    //         data: { _item },
    //     });
    //     dialogRef.afterClosed().subscribe((res) => {
    //         if (!res) {
    //             this.LoadDataWorkDetail(this.DataID);
    //             // this.ngOnInit();
    //         } else {
    //             this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
    //             // this.ngOnInit();
    //         }
    //     });
    //     this.LoadDataWorkDetail(this.DataID);
    // }
    is_confirm = false;
    LoadDataWorkDetail(WorkID) {
        this.layoutUtilsService.showWaitingDiv();
        this.projectsTeamService.WorkDetail(WorkID).subscribe((res) => {
            this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status == 1) {
                this.item = res.data;
                this.isgov = res.isgov;
                this.isclosed = this.item.closed;
                if (!this.is_confirm) {
                    this.old_description_tiny = this.item.description;
                    this.description_tiny = this.item.description;
                }
                this.changeDetectorRef.detectChanges();
            } else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }
    //====================Các hàm check role======================
    list_role: any[] = [];
    IsAdminGroup = false;
    CheckRoles(roleID: number) {
        const x = this.list_role.find((res) => res.id_row == this.DataID_Project);
        if (x) {
            if (x.locked) {
                return false;
            }
        }
        if (this.IsAdminGroup) {
            return true;
        }
        if (this.list_role) {
            const x = this.list_role.find(
                (res) => res.id_row == this.DataID_Project
            );
            if (x) {
                if (
                    x.admin == true ||
                    x.admin == 1 ||
                    +x.owner == 1 ||
                    +x.parentowner == 1
                ) {
                    return true;
                } else {
                    if (
                        roleID == 7 ||
                        roleID == 9 ||
                        roleID == 11 ||
                        roleID == 12 ||
                        roleID == 13
                    ) {
                        if (x.Roles.find((r) => r.id_role == 15)) {
                            return false;
                        }
                    }
                    if (roleID == 10) {
                        if (x.Roles.find((r) => r.id_role == 16)) {
                            return false;
                        }
                    }
                    if (roleID == 4 || roleID == 14) {
                        if (x.Roles.find((r) => r.id_role == 17)) {
                            return false;
                        }
                    }
                    const r = x.Roles.find((r) => r.id_role == roleID);
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
    IsCheck() {
        var item = this.item;
        if (!this.IsAdmin()) {
            if (item.createdby.userid != this.UserID) {
                if (item.Users) {
                    const index = item.Users.findIndex((x) => x.id_nv == this.UserID);
                    if (index < 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    HasupdateResult() {
        if (!this.CheckClosedTask()) {
            return false;
        }
        if (this.IsAdmin()) {
            return true;
        } else if (this.item.createdby.userid == this.UserID) {
            return true;
        } else {
            if (this.item.Users) {
                const index = this.item.Users.findIndex((x) => x.id_nv == this.UserID);
                if (index >= 0) {
                    return true;
                }
            }
        }
        return false;
    }
    IsAdmin() {
        if (this.IsAdminGroup) {
            return true;
        }
        if (this.list_role) {
            const x = this.list_role.find((x) => x.id_row == this.DataID_Project);
            if (x) {
                if (
                    x.admin == true ||
                    x.admin == 1 ||
                    +x.owner == 1 ||
                    +x.parentowner == 1
                ) {
                    return true;
                }
            }
        }
        return false;
    }
    CheckClosedTask() {
        if (this.item.closed) {
            return false;
        } else {
            return true;
        }
    }
    KiemTraThayDoiCongViec(item, key, closeTask = false) {
        if (!this.CheckClosedTask() && !closeTask) {
            this.layoutUtilsService.showError("Công việc đã đóng");
            return false;
        }
        if (this.IsAdmin()) {
            return true;
        } else if (item.createdby.userid == this.UserID) {
            return true;
        } else {
            if (item.Users) {
                const index = item.Users.findIndex((x) => x.id_nv == this.UserID);
                if (index >= 0) {
                    return true;
                }
            }
        }
        var txtError = "";
        switch (key) {
            case "assign":
                txtError = "Bạn không có quyền thay đổi người làm của công việc này.";
                break;
            case "status":
                txtError = "Bạn không có quyền thay đổi trạng thái của công việc này.";
                break;
            case "estimates":
                txtError =
                    "Bạn không có quyền thay đổi thời gian làm của công việc này.";
                break;
            case "checklist":
                txtError = "Bạn không có quyền chỉnh sửa checklist của công việc này.";
                break;
            case "title":
                txtError = "Bạn không có quyền đổi tên của công việc này.";
                break;
            case "description":
                txtError = "Bạn không có quyền đổi mô tả của công việc này.";
                break;
            default:
                txtError = "Bạn không có quyền chỉnh sửa công việc này.";
                break;
        }
        this.layoutUtilsService.showError(txtError);
        this.disabledBtn = false;
        return false;
    }
    CheckUserInProject(data) {
        if (data.IsAdminGroup) {
            return true;
        }
        if (data.dataRole) {
            const x = data.dataRole.find((x) => x.id_row === this.DataID_Project);
            if (x) {
                return true;
            } else {
                this.layoutUtilsService.showError("Bạn không tham gia vào dự án");
            }
        }
        return false;
    }
    CheckClosedProject() {
        if (this.list_role) {
            const x = this.list_role.find((x) => x.id_row == this.DataID_Project);
            if (x) {
                if (x.locked) {
                    return false;
                }
            }
        }
        return true;
    }
    CheckRoleskeypermit(key) {
        const x = this.list_role.find((res) => res.id_row == this.DataID_Project);
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
                if (
                    x.admin == true ||
                    x.admin == 1 ||
                    +x.owner == 1 ||
                    +x.parentowner == 1
                ) {
                    return true;
                } else {
                    if (
                        key == "title" ||
                        key == "description" ||
                        key == "status" ||
                        key == "checklist" ||
                        key == "delete"
                    ) {
                        if (x.Roles.find((r) => r.id_role == 15)) {
                            return false;
                        }
                    }
                    if (key == "deadline") {
                        if (x.Roles.find((r) => r.id_role == 16)) {
                            return false;
                        }
                    }
                    if (key == "id_nv" || key == "assign") {
                        if (x.Roles.find((r) => r.id_role == 17)) {
                            return false;
                        }
                    }

                    const r = x.Roles.find((r) => r.keypermit == key);
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
    //===========================Các hàm lưu thay đổi=================
    UpdateTitle() {//Lưu cập nhật tên công việc
        const ele = document.getElementById(
            "txttitle" + this.DataID
        ) as HTMLInputElement;
        if (ele.value.toString().trim() == "") {
            ele.value = this.item.title;
            return;
        }
        if (ele.value.toString().trim() != this.item.title.toString().trim()) {
            if (!this.KiemTraThayDoiCongViec(this.item, "title")) {
                ele.value = this.item.title;
                return;
            }

            this.item.title = ele.value;
            this.UpdateByKeyNew(this.item, "title", this.item.title);
        }
    }

    UpdateByKeyNew(task, key, value) {
        if (!this.KiemTraThayDoiCongViec(task, key)) {
            return;
        }
        const item = new UpdateWorkModel();
        item.id_row = task.id_row;
        item.key = key;
        item.value = value;
        if (task.assign && task.assign.id_nv > 0) {
            item.IsStaff = true;
        }
        this.projectsTeamService._UpdateByKey(item)
            .pipe(tap(() => { }), map((res) => {
                if (res && res.status == 1) {
                    this.LoadData();
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
                },
                (error) => {
                    this.disabledBtn = false;
                }
            );
    }

    ClosedTask(value) {
        if (!this.KiemTraThayDoiCongViec(this.item, "closetask", true)) {
            this.item.closed = !value;
            return;
        }
        this.layoutUtilsService.showWaitingDiv();
        this.projectsTeamService
            .ClosedTask(this.item.id_row, value)
            .subscribe((res) => {
                this.layoutUtilsService.OffWaitingDiv();
                if (res && res.status == 1) {
                    this.layoutUtilsService.showActionNotification("Đóng công việc thành công", MessageType.Read, 4000, true, false, 3000, 'top', 1);
                    this.close();
                } else {
                    this.layoutUtilsService.showError(res.error.message);
                }
            });
    }

    DeleteTask() {
        const _title = this.translate.instant("landingpagekey.xoa");
        const _description = this.translate.instant(
            "landingpagekey.bancochacchanmuonxoakhong"
        );
        const _waitDesciption = this.translate.instant(
            "landingpagekey.dulieudangduocxoa"
        );
        const _deleteMessage = this.translate.instant(
            "landingpagekey.xoathanhcong"
        );
        const dialogRef = this.layoutUtilsService.deleteElement(
            _title,
            _description,
            _waitDesciption
        );
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            }
            this.projectsTeamService
                .DeleteTask(this.item.id_row)
                .pipe(
                    tap(() => {
                        if (this.loading) {
                        }
                    }),
                    map((res) => {
                        if (res && res.status == 1) {
                        } else {
                            this.layoutUtilsService.showError(res.error.message);
                        }
                    }),
                    catchError((err) => throwError(err)),
                    finalize(() => this.layoutUtilsService.OffWaitingDiv())
                )
                .subscribe(() => {
                    this.close();
                });
        });
    }

    NextStatus(type) {
        if (!this.KiemTraThayDoiCongViec(this.item, "status")) {
            return;
        }
        const item = new UpdateWorkModel();
        item.id_row = this.item.id_row;
        item.key = "status";
        item.value = this.item.status;
        item.status_type = type;

        if (this.item.assign != null) {
            if (this.item.assign.id_nv > 0) {
                item.IsStaff = true;
            }
        }
        this.projectsTeamService._UpdateByKey(item).subscribe((res) => {
            if (res && res.status == 1) {
                this.LoadData();
            } else {
                this.layoutUtilsService.showError(res.error.message);
            }
        });
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
                this.task = task;
                this.id_status = status.id_row;
                this.layoutUtilsService.showActionNotification("Bạn vui lòng nhập ghi chú trong phần bình luận",
                    MessageType.Create, 9999999999, true, false, 3000, "top", 2);


            }
        }
    }


    updateDate(event, field) {//Cập nhật ngày
        if (event) {
            this.UpdateByKeyNew(this.item, field, event);
        } else {
            this.UpdateByKeyNew(this.item, field, null);
        }
    }

    Updateestimates(event) {
        if (+event != this.item.estimates) {
            this.item.estimates = event;
            this.UpdateByKeyNew(this.item, "estimates", event);
        }
    }

    updatePriority(value) {
        this.UpdateByKeyNew(this.item, "clickup_prioritize", value);
        this.changeDetectorRef.detectChanges();
    }

    ItemSelected(val: any) {
        this.UpdateByKeyNew(this.item, "assign", val.id_nv);
    }

    ItemFollower(val: any) {
        this.UpdateByKeyNew(this.item, 'follower', val.id_nv);
    }

    RemoveTag(tag) {
        if (!this.KiemTraThayDoiCongViec(this.item, "tags")) {
            return;
        }
        const model = new UpdateWorkModel();
        model.id_row = this.item.id_row;
        model.key = "Tags";
        model.value = tag.id_row;
        this.workService.UpdateByKey(model).subscribe((res) => {
            if (res && res.status == 1) {
                this.LoadData();

                this.changeDetectorRef.detectChanges();
            } else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, "top", 0);
            }
        });
        this.changeDetectorRef.detectChanges();
    }

    ReloadDatas(event) {
        this.LoadData();
    }

    UpdateDescription() {
        if (!this.chinhsuamota) {
            this.chinhsuamota = !this.chinhsuamota;
            return;
        } else {
            if (this.item.description.trim() != this.description_tiny.trim()) {
                this.disabledBtn = true;
                if (!this.KiemTraThayDoiCongViec(this.item, "description")) {
                    this.description_tiny = this.item.description;
                    return;
                }
                this.item.description = this.description_tiny;
                this.UpdateByKeyNew(this.item, "description", this.description_tiny);
            }
            this.chinhsuamota = !this.chinhsuamota;
        }
    }

    goBack() {
        let repcale = this.item.description.replaceAll('color: rgb(0, 0, 0)', '');
        this.description_tiny = repcale;
        this.chinhsuamota = !this.chinhsuamota;
    }

    View_Log_Description() {
        var ID_log = this.item.id_row;
        let saveMessageTranslateParam = "";
        saveMessageTranslateParam +=
            ID_log > 0
                ? "landingpagekey.capnhatthanhcong"
                : "landingpagekey.themthanhcong";
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);
        const _messageType =
            this.item.id_row > 0 ? MessageType.Update : MessageType.Create;
        const dialogRef = this.dialog.open(LogWorkDescriptionComponent, {
            data: { ID_log },
            width: "700px",
            maxHeight: "80vh",
            panelClass: ['view_descriptionv1']
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                this.LoadData();
                this.LoadDetails();
            } else {
                this.LoadData();
                this.LoadDetails();
                this.layoutUtilsService.showActionNotification(
                    _saveMessage,
                    _messageType,
                    4000,
                    true,
                    false
                );
            }
        });
    }

    ItemSelectedSubtask(val, node) {
        this.UpdateByKeyNew(node, "assign", val.id_nv);
    }

    //========Xử lý công việc con========
    LoadChild(item) {
        this.DataID = item.id_row;
        this.chinhsuamota = false;
        this.LoadData();
        this.LoadChecklist();
        this.LoadDetails();
    }
    filterConfiguration2(): any {
        const filter: any = {};
        filter.id_work = this.DataID;
        return filter;
    }
    LoadChecklist() {
        const queryParams = new QueryParamsModelNew(
            this.filterConfiguration2(),
            "",
            "",
            0,
            50,
            true
        );
        this.workService.CheckList(queryParams).subscribe((res) => {
            if (res && res.status === 1) {
                this.CheckList = res.data;
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    CreateTask(val) {
        this.newtask = true;
        this.projectsTeamService.InsertTask(val).subscribe((res) => {
            if (res && res.status == 1) {
                this.newtask = false;
                setTimeout(() => {
                    this.newtask = true;
                }, 1000);
                this.LoadData();
                this.changeDetectorRef.detectChanges();
            } else {
                this.layoutUtilsService.showError(res.error.message);
            }
        });
    }

    //=============================Tab dữ liệu=========================
    TenFile = "";
    File = "";
    IsShow_Result = false;
    Result = "";
    save_file_Direct(evt: any, type: string) {
        if (evt.target.files && evt.target.files.length) {
            // Nếu có file
            const file = evt.target.files[0]; // Ví dụ chỉ lấy file đầu tiên
            var size = evt.target.files[0].size;
            if (size / 1024 / 1024 > 16) {
                this.layoutUtilsService.showActionNotification("Tồn tại tệp không hợp lệ. Vui lòng chọn tệp không được vượt quá 16 MB", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                return;
            }
            this.TenFile = file.name;
            const reader = new FileReader();
            reader.readAsDataURL(evt.target.files[0]);
            let base64Str;
            setTimeout(() => {
                base64Str = reader.result as String;
                const metaIdx = base64Str?.indexOf(";base64,");
                base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
                this.File = base64Str;
                const _model = new AttachmentModel();
                _model.object_type = parseInt(type);
                _model.object_id = this.item.id_row;
                const ct = new FileUploadModel();
                ct.strBase64 = this.File;
                ct.filename = this.TenFile;
                ct.IsAdd = true;
                const item = new UpdateWorkModel();
                item.id_row = this.item.id_row;
                item.key = type == "1" ? "Attachments" : "Attachments_result";
                item.values = new Array<FileUploadModel>(ct);
                this.layoutUtilsService.showWaitingDiv();
                this.projectsTeamService._UpdateByKey(item).subscribe((res) => {
                    this.layoutUtilsService.OffWaitingDiv();
                    if (res && res.status == 1) {
                        this.LoadData();
                    }
                });
            }, 100);
        } else {
            this.File = "";
        }
    }

    preview(file) {
        if (file.isImage) {
            this.DownloadFile(file.path);
        } else {
            this.layoutUtilsService.ViewDoc(file.path);
        }
    }

    DownloadFile(link) {
        window.open(link);
    }

    Delete_File(val: any) {
        const _title = this.translate.instant("landingpagekey.xoa");
        const _description = this.translate.instant(
            "landingpagekey.bancochacchanmuonxoakhong"
        );
        const _waitDesciption = this.translate.instant(
            "landingpagekey.dulieudangduocxoa"
        );
        const _deleteMessage = this.translate.instant(
            "landingpagekey.xoathanhcong"
        );
        const dialogRef = this.layoutUtilsService.deleteElement(
            _title,
            _description,
            _waitDesciption
        );
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            }
            this._attservice.delete_attachment(val).subscribe((res) => {
                if (res && res.status === 1) {
                    this.LoadData();
                    this.changeDetectorRef.detectChanges();
                    this.layoutUtilsService.showActionNotification(
                        _deleteMessage, MessageType.Delete, 4000, true, false);
                } else {
                    this.layoutUtilsService.showActionNotification(
                        res.error.message, MessageType.Read, 999999999, true, false, 3000, "top", 0
                    );
                }
            });
        });
    }

    Update_Result() {
        this.IsShow_Result = !this.IsShow_Result;
        this.Result = this.Result;
    }

    //==============================Ngày 20/10/2022===============================
    UpdateResult() {
        const dialogRef = this.dialog.open(EditorGeneralComponent, { data: { _value: this.item.result }, panelClass: ['sky-padding-0'], });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            let _result = res._result;
            this.UpdateByKeyNew(this.item, "result", _result);
        });
    }
    //================Load tab hoạt động=================
    LogDetail: any[] = [];
    LoadLog() {
        this.projectsTeamService.LogDetailCU(this.DataID).subscribe((res) => {
            if (res && res.status === 1) {
                this.LogDetail = res.data;
                this.LogDetail = this.LogDetail.filter((x) => x.id_action != 16).sort();
                this.changeDetectorRef.detectChanges();
            } else {
                this.layoutUtilsService.showError(res.error.message);
            }
        });
    }

    trackByFn(index, item) {
        return item.id_row;
    }

    //=================================================================================================
    //===================Xem chi tiết công việc cha=======================
    viewParent(item) {
        this.DataID = +item.id_row;
        this.DataID_Project = +item.id_project_team;
        this.ShowMain = false;
        this.chinhsuamota = false;
        this.LoadDataParent();
        this.LoadDetails();
        this.LoadObjectID();
    }
    //===================Xem chi tiết công việc cha=======================
    updateReadItem() {
        let _item = {
            "appCode": "WORK",
            "mainMenuID": 2,
            "subMenuID": 7,
            "itemID": this.DataID,
        }
        this.store.updateRead = 0;
        this.socketService.readNotification_menu(_item).subscribe(res => {
            this.store.updateRead = this.DataID;

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


    UpdateStatus_BeforComment(task, status) {
        if (+task.status == +status) {

            return;
        }
        this.UpdateByKeyNew(task, "status", status);
    }

    NotifyComent(event: any) {
        if (this.task && this.id_status) {
            this.UpdateStatus_BeforComment(this.task, this.id_status)
        }
        const objSave: any = {};
        // objSave.id_topic = res.Id;
        objSave.comment = event.Text ? event.Text : 'has comment';
        objSave.id_parent = 0;
        objSave.object_type = 0;
        objSave.object_id_new = event.TopicCommentID;
        this.Luulogcomment(objSave);
    }

    Luulogcomment(model) {
        this.weworkService.LuuLogcomment(model)
            .subscribe(() => {
                this.pustEventLoad();//Bắn sự kiện để load danh sách task
            });
    }

    close() {
        // this.jeeWorkV1Store.updateEvent = true;
        this.pustEventLoad();//Bắn sự kiện để load danh sách task
        this.dialog.closeAll();
    }

    //=============================================================
    ShowXemTruoc(item) {
        let show = false;
        let obj = item.filename.split(".")[item.filename.split(".").length - 1];
        if (obj == "jpg" || obj == "png" || obj == "jpeg" || obj == "xls" || obj == "xlsx" || obj == "doc" || obj == "docx" || obj == "pdf") {
            show = true;
        }
        return show;
    }

    CheckViewWork() {
        const item_wv = new WorkViewModel();
        item_wv.workid = this.DataID;
        this.weworkService.lite_inset_task_view(item_wv).subscribe(res => { })
    }
    //======================Xử lý cho phần công việc cấp dưới gov====================
    checkAddCVCD() {
        let obj = this.item.Users.find(x => +x.id_nv == +this.UserID)
        if (obj) {
            return true;
        } else {
            return false;
        }
    }

    AddCongViecCapDuoi() {
        const workModel = new WorkModel();
        workModel.clear(); // Set all defaults fields
        this.UpdateCongViecCapDuoi(workModel);
    }

    UpdateCongViecCapDuoi(_item: WorkModel) {
        if (this.isgov) {
            const dialogRef = this.dialog.open(CongViecTheoDuAnVer1PopupComponent, {
                data: {
                    _item, _id_duan: this.idDuAn, _type: this.IDDrop,
                    _idLienKet: this.DataID, _sokyhieu: this.item.Gov_SoHieuVB,
                    _ngayvanban: this.item.Gov_NgayVB, _trichyeu: this.item.Gov_TrichYeuVB
                }, panelClass: ['sky-padding-0', 'width700'],
            });
            dialogRef.afterClosed().subscribe(res => {
                if (!res) {
                    this.LoadData();
                }
                else {
                    this.LoadData();
                }
            });
        } else {
            const dialogRef = this.dialog.open(CongViecTheoDuAnPopupComponent, { data: { _item, _id_duan: this.idDuAn, _type: this.IDDrop, _idLienKet: this.DataID }, panelClass: ['sky-padding-0', 'width700'], });
            dialogRef.afterClosed().subscribe(res => {
                if (!res) {
                    this.LoadData();
                }
                else {
                    this.LoadData();
                }
            });
        }
    }

    //=============================================================================
    //========Xử lý tab nhiệm vụ liên quan========
    DataOldID: number;//Id nhiệm vụ trước khi click nhiệm vụ khác
    viewNVLQ(item) {
        this.DataOldID = this.DataID;
        this.DataID = +item.id_row;
        this.DataID_Project = +item.id_project_team;
        this.LoadDataNVLQ();
        this.LoadDetails();
    }

    LoadDataNVLQ() {
        this.congViecTheoDuAnService.WorkDetailGOV(this.DataID, true, this.DataOldID, 0).subscribe((res) => {
            if (res && res.status == 1) {
                this.item = res.data;
                this.isclosed = this.item.closed;
                let repcale = this.item.description.replaceAll('color: rgb(0, 0, 0)', '');
                this.description_tiny = repcale;
                this.ShowMain = true;
                this.isgov = res.isgov;
                if (this.isgov) {
                    this.listTaskBySrc = [];
                    this.congViecTheoDuAnService.GetRelationshipTaskBySourceID(this.DataID).subscribe(res => {
                        if (res && res.status == 1 && res.data.length > 0) {
                            this.listTaskBySrc = res.data;
                        }
                        this.changeDetectorRef.detectChanges();
                    })

                    this.listTaskByDes = [];
                    this.congViecTheoDuAnService.GetRelationshipTaskByDesID(this.DataID).subscribe(res => {
                        if (res && res.status == 1 && res.data.length > 0) {
                            this.listTaskByDes = res.data;
                        }
                        this.changeDetectorRef.detectChanges();
                    })
                }
                this.changeDetectorRef.detectChanges();
            } else {
                this.layoutUtilsService.showError(res.error.message);
            }
        });
        this.LoadLog();
    }
    //========Xử lý tab nhiệm vụ cấp dưới========
    viewNVCD(item) {
        this.DataOldID = this.DataID;
        this.DataID = item.id_row;
        this.DataID_Project = item.id_project_team;
        this.LoadDataNVCD();
        this.LoadDetails();
    }

    LoadDataNVCD() {
        this.congViecTheoDuAnService.WorkDetailGOV(this.DataOldID, true, this.DataID, 1).subscribe((res) => {
            if (res && res.status == 1) {
                this.item = res.data;
                this.isclosed = this.item.closed;
                let repcale = this.item.description.replaceAll('color: rgb(0, 0, 0)', '');
                this.description_tiny = repcale;
                this.ShowMain = true;
                this.isgov = res.isgov;
                if (this.isgov) {
                    this.listTaskBySrc = [];
                    this.congViecTheoDuAnService.GetRelationshipTaskBySourceID(this.DataID).subscribe(res => {
                        if (res && res.status == 1 && res.data.length > 0) {
                            this.listTaskBySrc = res.data;
                        }
                        this.changeDetectorRef.detectChanges();
                    })

                    this.listTaskByDes = [];
                    this.congViecTheoDuAnService.GetRelationshipTaskByDesID(this.DataID).subscribe(res => {
                        if (res && res.status == 1 && res.data.length > 0) {
                            this.listTaskByDes = res.data;
                        }
                        this.changeDetectorRef.detectChanges();
                    })
                }
                this.changeDetectorRef.detectChanges();
            } else {
                this.layoutUtilsService.showError(res.error.message);
            }
        });
        this.LoadLog();
    }

    getColorStatusCVCD(data, val) {
        const item = this.ListAllStatusDynamic.find(x => +x.id_row === data.id_project_team);
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

    getTextStatusCVCD(data, val) {
        const item = this.ListAllStatusDynamic.find(x => +x.id_row === data.id_project_team);
        let index;
        if (item) {
            index = item.status.find(x => x.id_row === val);
        }
        if (index) {
            return index.statusname;
        } else {
            return '';
        }
    }

    getColorStatusCVLQ(data, val) {
        const item = this.ListAllStatusDynamic.find(x => +x.id_row === data.id_project_team);
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

    //=================Bổ sung đổi api status theo cấu trúc mới==============================
    ListAllStatusDynamic: any = [];
    public listDataStatus: any[] = [];
    statusChange(val) {
        this.listDataStatus = [];
        this.weworkService.ListStatusDynamicNew(val.id_project_team, val.id_row).subscribe(res => {
            if (res && res.status == 1) {
                this.listDataStatus = res.data;
            }
            this.changeDetectorRef.detectChanges();
        })
    }

    //===============Bổ sung chức năng xem luồng nhiệm vụ====================================
    XemLuongNhiemVu() {
        const dialogRef = this.dialog.open(CongViecTheoDuAnChartComponent, { data: { _id: this.DataID }, panelClass: ['sky-padding-0', 'width70'], disableClose: true });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return
            }
        });
    }
    //===============Bổ sung chức năng chỉnh sửa deadline=====================
    Selectdate() {
        const dialogRef = this.dialog.open(DialogDeadlineComponent, {
            width: '500px',
            data: { endDate: this.item.deadline },
            panelClass: 'sky-padding-0'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != undefined) {
                if (moment(result.endDate).format('MM/DD/YYYY') != "Invalid date") {
                    this.UpdateByKeyNew(this.item, 'deadline', moment(result.endDate).format('MM/DD/YYYY HH:mm'));
                }
            }
        });
    }
    //==============Bổ sung event reload data khi có thay đổi trong công việc======================
    pustEventLoad() {
        const busEvent = new CustomEvent('event-task-workv1', {
            bubbles: true,
            detail: {
                eventType: 'load-task-list',
                customDat: 'Load list task'
            }
        });
        dispatchEvent(busEvent);
    }
}