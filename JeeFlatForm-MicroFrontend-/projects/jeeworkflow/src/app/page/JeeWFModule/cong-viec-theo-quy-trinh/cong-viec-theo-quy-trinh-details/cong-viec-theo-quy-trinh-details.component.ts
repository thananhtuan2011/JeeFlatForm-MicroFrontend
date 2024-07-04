import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2 } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, of, Subject } from "rxjs";
import { catchError, finalize, share, takeUntil, tap } from "rxjs/operators";
import { JeeChooseMemberComponent } from "../../component/jee-choose-member/jee-choose-member.component";
// import { TemplateCenterComponent } from "../../component/Jee-Work/template-center/template-center.component";
import { PageWorkDetailStore } from "../../page-work-detail.store";
import { CongViecTheoQuyTrinhService } from "../services/cong-viec-theo-quy-trinh.services";
import * as moment from 'moment';
import { LayoutUtilsService, MessageType } from "projects/jeeworkflow/src/modules/crud/utils/layout-utils.service";
import { FormatTimeService } from "../../../services/jee-format-time.component";
import { ProcessWorkService } from "../../../services/process-work.service";
import { QueryParamsModelNew } from "../../../models/query-models/query-params.model";
import { DialogDecision } from "../../component/dialog-decision/dialog-decision.component";
import { ProcessWorkEditComponent } from "../../component/process-work-edit/process-work-edit.component";
import { CongViecDialogUpdateComponent } from "../../component/cong-viec-dialog-update/cong-viec-dialog-update.component";
import { environment } from "projects/jeeworkflow/src/environments/environment";
import { TemplateCenterComponent } from "../../component/jeework/template-center/template-center.component";
import { SocketioService } from "../../../services/socketio.service";
import { HttpUtilsService } from "projects/jeeworkflow/src/modules/crud/utils/http-utils.service";
@Component({
    selector: 'app-cong-viec-theo-quy-trinh-details',
    templateUrl: './cong-viec-theo-quy-trinh-details.component.html',
})
export class CongViecTheoQuyTrinhDetailsComponent implements OnInit {

    dataLazyLoad: any = [];
    public IDDrop: string = '';
    ListProcess: any[] = [];
    filtertinhtrang: string = '';
    filterCongvieccon: string = 'false';
    keyword = "";

    public removeEventListener: () => void;
    public anchors;
    //=====================================================================
    UserCurrent_lib: string = '';
    topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    
    constructor(
        private changeDetectorRef: ChangeDetectorRef,
        public congViecTheoQuyTrinhService: CongViecTheoQuyTrinhService,
        private translate: TranslateService,
        public datepipe: DatePipe,
        private layoutUtilsService: LayoutUtilsService,
        public dialog: MatDialog,
        public _FormatTimeService: FormatTimeService,
        public processWorkService: ProcessWorkService,
        private activatedRoute: ActivatedRoute,
        public store: PageWorkDetailStore,
        private elementRef: ElementRef,
        private renderer: Renderer2,
        private socketService: SocketioService,
        private httpUtils: HttpUtilsService,
    ) {
        this.UserCurrent_lib = this.httpUtils.getUsername();
    }
    ngOnInit(): void {
        this.removeEventListener = this.renderer.listen(this.elementRef.nativeElement, 'click', (event) => {
            if (event.target instanceof HTMLAnchorElement) {
                this.handleAnchorClick(event);
            }
        });

        const roles: any = JSON.parse(localStorage.getItem('appCode'));
        this.listAppCode = roles;

        this.activatedRoute.params.subscribe(params => {
            this.TypeID = +params.typeid;
            this.StageID = +params.stageid;
            this.TaskID = +params.taskid;
            this.changeDetectorRef.detectChanges();
            if (this.TypeID == 1) {
                this.itemCV = [];
                this.CheckJeeWork();
                this.LoadDataNhiemVu();
                this.LoadDataGiaiDoan();
                this.LoadComment();
                if (this.IsLKNhiemVu) {
                    this.LoadChiTietQuyTrinh();
                }
            }

            if (this.TypeID == 3) {
                this.itemGD = [];
                this.itemNV = [];
                this.LoadDataCongViecChiTiet();
                this.LoadCommentCongViecChiTiet();
            }
        });
    }

    StageID: number = 0;
    TypeID: number = 1;
    tinyMCE = {};

    getHeight(): any {
        let tmp_height = window.innerHeight - 200;
        return tmp_height + "px";
    }

    getHeightMain(): any {
        let tmp_height = window.innerHeight - 60;
        return tmp_height + "px";
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
        let tmp = window.innerWidth - 350 - 70 - 350;
        return tmp + "px";
    }

    onScroll(event) {
        let _el = event.srcElement;
        if (_el.scrollTop + _el.clientHeight > _el.scrollHeight * 0.9) {
            // this.loadDataList_Lazy();
        }
    }

    getHeighWork(): any {
        let tmp_height = window.innerHeight - 110;
        return tmp_height + "px";
    }
    //============================Code xử lý cho phần click chi tiết nhiệm vụ or công việc==========================================
    //Page thông tin
    itemNV: any;
    TaskID: number = 0;
    DatFieldView: any; //Dữ liệu đầu vào
    LoadDataNhiemVu() {
        // this.layoutUtilsService.showWaitingDiv();
        this.processWorkService.Get_ProcessDetail(this.TaskID).subscribe(res => {
            // this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status == 1) {
                this.itemNV = res.data;
                this.NodeRoot = res.data.NodeRoot;
                this.DatFieldView = res.data.datafields;
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    //=============Load thông tin nhiệm vụ theo giai đoan=========
    public itemGD: any;
    DatField: any;
    CongViecChiTiet: any;
    ShowTTD: boolean = false;
    GiaiDoan: string;
    LoadDataGiaiDoan() {
        this.ShowTTD = false;
        this.layoutUtilsService.showWaitingDiv();
        this.processWorkService.Get_NodeDetail(this.StageID).subscribe(res => {
            this.layoutUtilsService.OffWaitingDiv();
            if (res.status == 1) {
                if (res.data.IsNew) {
                    this.updateReadMenu(this.StageID);
                }
                this.itemGD = res.data;
                this.DatField = res.data.DataFields;
                this.DatField.map((item, index) => {
                    if (item.IsFieldNode) {
                        this.ShowTTD = true;
                    }
                })
                this.CongViecChiTiet = res.data.DataToDo;
                if (res.data.stage_typeid == 2) {
                    this.ShowBieuMau = true;
                    this.ContentStr = res.data.ContentStr;
                    if (res.data && res.data.DataFields.length > 0) {
                        res.data.DataFields.forEach(ele => {
                            if (ele.ControlID == 10 || ele.ControlID == 12 || ele.ControlID == 13 || ele.ControlID == 14) {
                                let replace = "";
                                if (ele.Value.length > 0) {
                                    ele.Value.forEach(e => {
                                        replace += '<a style="cursor: pointer; padding-right: 10px;" href="' + e.link + '"' + ' id="' + e.strBase64 + '">' + e.filename + '</a >'
                                    })
                                }
                                if (replace != "") {
                                    this.ContentStr = this.ContentStr.replace('$' + ele.keyword + '$', replace);
                                } else {
                                    this.ContentStr = this.ContentStr.replace('$' + ele.keyword + '$', '<a>' + ele.Title + '</a >')
                                }
                            }
                        });
                    }
                    this.ListKetQua = res.data.stage_result;
                } else {
                    this.ShowBieuMau = false;
                }
                this.ID_Project_GD = this.itemGD.listid;
                this.ThongTinLienQuan = this.itemGD.ThongTinLienQuan;
                res.data.DataFields.forEach(ele => {
                    if (ele.ControlID == 10 || ele.ControlID == 12 || ele.ControlID == 13 || ele.ControlID == 14) {
                        let replace = "";
                        if (ele.Value.length > 0) {
                            ele.Value.forEach(e => {
                                replace += '<a style="cursor: pointer; padding-right: 10px;" href="' + e.link + '"' + ' id="' + e.strBase64 + '">' + e.filename + '</a >'
                            })
                        }
                        if (replace != "") {
                            this.ThongTinLienQuan = this.ThongTinLienQuan.replace('$' + ele.keyword + '$', replace);
                        } else {
                            this.ThongTinLienQuan = this.ThongTinLienQuan.replace('$' + ele.keyword + '$', '<a>' + ele.Title + '</a >')
                        }
                    }
                });
            }
            this.changeDetectorRef.detectChanges();
        })

        this.LoadHoatDong();
    }

    //======================Change tình trạng thực hiện nhiệm vụ========================
    CapNhatGiaiDoan(val) {
        const _title = this.translate.instant('workprocess.capnhatgiaidoan');
        let _description: any;
        if (val == 0) {
            _description = this.translate.instant('workprocess.bancochacchanmuontamdung');
        }
        if (val == 1) {
            _description = this.translate.instant('workprocess.bancochacchanmuonthuchien');
        }
        if (val == 2) {
            _description = this.translate.instant('workprocess.bancochacchanmuonhoanthanh');
        }
        const _waitDesciption = this.translate.instant('workprocess.dulieudangduocxyly');

        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            if (val == 0) {
                const dialogRef = this.dialog.open(DialogDecision, {
                    data: { _type: 2, _GiaiDoanID: this.StageID },
                    panelClass: 'sky-padding-0',
                });
                this.store.wfupdateEvent = false;
                dialogRef.afterClosed().subscribe(res => {
                    if (!res) {
                        return;
                    }
                    this.LoadDataGiaiDoan();
                    this.store.wfupdateEvent = true;
                    // this.loadDataList();// load danh sách nhiệm vụ công việc
                });
            } else {
                let item = {
                    ID: +this.StageID,
                    Status: +val,
                }
                this.store.wfupdateEvent = false;
                this.processWorkService.updateStatusNode(item).subscribe(res => {
                    if (res && res.status == 1) {
                        this.LoadDataGiaiDoan();
                        this.store.wfupdateEvent = true;
                        // this.loadDataList();// load danh sách nhiệm vụ công việc
                    } else if (res && res.status == 2) {
                        this.ChuyenGiaiDoan();
                    } else {
                        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                    }
                });
            }
        });

    }

    ChuyenGiaiDoan() {
        this.store.wfupdateEvent = false;
        this.processWorkService.Get_FieldsNode(this.StageID, 0).subscribe(res => {
            if (res.status == 1) {
                if (res.data.length > 0) {
                    this.loadDynamic(this.StageID, 0, true);
                } else {
                    this.LoadDataGiaiDoan();
                    this.store.wfupdateEvent = true;
                    // this.loadDataList();// load danh sách nhiệm vụ công việc
                }
            }
            else if (res.status == -1)
                this.ChinhSuaGiaiDoanNhiemVu();
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
        })
    }

    loadDynamic(val: any, NodeListID: number, IsNext: boolean) {
        let saveMessageTranslateParam = '';
        saveMessageTranslateParam = 'landingpagekey.thanhcong';
        const _saveMessage = this.translate.instant(saveMessageTranslateParam);
        const _messageType = MessageType.Create;
        const dialogRef = this.dialog.open(ProcessWorkEditComponent, { data: { _val: val, _type: 1, _NodeListID: NodeListID, _IsNext: IsNext } });
        this.store.wfupdateEvent = false;
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            else {
                this.LoadDataGiaiDoan();
                this.store.wfupdateEvent = true;
                // this.loadDataList();// load danh sách nhiệm vụ công việc
                this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
            }
        });
    }

    ChinhSuaGiaiDoanNhiemVu() {
        this.processWorkService.Get_NodeDetail(this.StageID).subscribe(res => {
            if (res.status == 1) {
                if (res.data.DataFields.length > 0) {
                    let isFlag = false;
                    res.data.DataFields.map((item, index) => {
                        if (item.IsFieldNode) {
                            isFlag = true;
                        }
                    })
                    if (isFlag) {
                        const dialogRef = this.dialog.open(DialogDecision, {
                            data: { _item: {}, _type: 13, _DatField: res.data.DataFields },
                            panelClass: 'sky-padding-0',
                        });
                        this.store.wfupdateEvent = false;
                        dialogRef.afterClosed().subscribe(res => {
                            if (!res) {
                                return;
                            }
                            this.LoadDataGiaiDoan();
                            this.store.wfupdateEvent = true;
                            // this.loadDataList();// load danh sách nhiệm vụ công việc
                        });
                    } else {
                        this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                    }
                } else {
                    this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                }

                this.changeDetectorRef.detectChanges();
            } else {
                this.changeDetectorRef.detectChanges();
            }
        })
    }

    //====Cập nhật dữ liệu đầu vào hoặc dữ liệu giai đoạn
    NodeRoot: string = '';
    ChinhSua(TypeID: string) {
        let ID = 0;
        if (TypeID == "1") {
            ID = +this.NodeRoot;
        } else {
            ID = this.StageID;
        }
        this.processWorkService.Get_NodeDetail(+ID).subscribe(res => {
            if (res.status == 1) {
                if (res.data.DataFields.length > 0) {
                    let isFlag = false;
                    res.data.DataFields.map((item, index) => {
                        if (item.IsFieldNode) {
                            isFlag = true;
                        }
                    })
                    if (isFlag) {
                        const dialogRef = this.dialog.open(DialogDecision, {
                            data: { _item: {}, _type: 13, _DatField: res.data.DataFields },
                            panelClass: 'sky-padding-0',
                        });
                        this.store.wfupdateEvent = false;
                        dialogRef.afterClosed().subscribe(res => {
                            if (!res) {
                                return;
                            } else {
                                if (TypeID == "1") {
                                    this.LoadDataNhiemVu();
                                } else {
                                    this.LoadDataGiaiDoan();
                                    this.store.wfupdateEvent = true;
                                    // this.loadDataList();
                                }
                            }
                        });
                    } else {
                        this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                    }
                } else {
                    this.layoutUtilsService.showActionNotification("Không có dữ liệu", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                }

                this.changeDetectorRef.detectChanges();
            } else {
                this.changeDetectorRef.detectChanges();
            }
        })
    }

    checkShowTTD() {
        let isFlag = false;
        if (this.DatField.length > 0) {
            this.DatField.map((item, index) => {
                if (item.IsFieldNode) {
                    isFlag = true;
                }
            })
        }
        return isFlag;
    }
    //===================Start Tab mẫu quyết định====================
    ContentStr: string = '';
    ListKetQua: any[] = [];
    ShowBieuMau: boolean = false;

    ChangeMauQuyetDinh(item) {
        this.loadDynamic(item, 0, true);
    }
    //===================End Tab mẫu quyết định======================

    //===================Start công việc chi tiết====================
    //=====================================================Cập nhật công việc chi tiết==================================
    CapNhatCongViec(val, data) {
        const _title = this.translate.instant('workprocess.capnhatcongviec');
        let _description: any;
        if (val == 0) {
            _description = this.translate.instant('workprocess.bancochacchanmuontamdungcongviec');
        }
        if (val == 1) {
            _description = this.translate.instant('workprocess.bancochacchanmuonthuchiencongviec');
        }
        if (val == 2) {
            _description = this.translate.instant('workprocess.bancochacchanmuonhoanthanhcongviec');
        }
        const _waitDesciption = this.translate.instant('workprocess.dulieudangduocxyly');

        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            if (val == 0) {
                const dialogRef = this.dialog.open(CongViecDialogUpdateComponent, {
                    data: { _item: data, _type: 5 }, panelClass: 'sky-padding-0'
                });
                this.store.wfupdateEvent = false;
                dialogRef.afterClosed().subscribe(res => {
                    if (!res) {
                        return;
                    }
                    if (+this.TypeID == 3) {
                        this.LoadDataCongViecChiTiet();
                    } else {
                        this.LoadDataGiaiDoan();
                    }
                    this.store.wfupdateEvent = true;
                    // this.loadDataList();// load danh sách nhiệm vụ công việc
                });
            } else {
                let item = {
                    ID: +data.RowID,
                    Status: +val,
                }
                this.store.wfupdateEvent = false;
                this.processWorkService.updateStatusToDo(item).subscribe(res => {
                    if (res && res.status == 1) {
                        if (+this.TypeID == 3) {
                            this.LoadDataCongViecChiTiet();
                        } else {
                            this.LoadDataGiaiDoan();
                        }
                        this.store.wfupdateEvent = true;
                        // this.loadDataList();// load danh sách nhiệm vụ công việc
                    } else {
                        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                    }
                });
            }
        });

    }

    loadCongViec() {
        this.store.wfupdateEvent = false;
        this.LoadDataGiaiDoan();
        this.store.wfupdateEvent = true;
        // this.loadDataList();// load danh sách nhiệm vụ công việc
    }

    itemCV: any;
    TenQuyTrinh: string = '';
    TenGiaiDoan: string = '';
    TenNhiemVu: string = '';
    TenCongViec: string = '';
    public IsEditMoTa = false;
    LoadCommentCongViecChiTiet() {
        this.InitComment("kt-cong-viec-dialog" + this.StageID);
    }
    LoadDataCongViecChiTiet() {
        this.processWorkService.getToDoDetail(this.StageID).subscribe(res => {
            if (res && res.status == 1) {
                this.itemCV = res.data;
                this.TenQuyTrinh = res.data.Process;
                this.TenGiaiDoan = res.data.Stage;
                this.TenNhiemVu = res.data.Tasks;
                this.TenCongViec = res.data.ToDo;
                this.changeDetectorRef.detectChanges();
            } else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        })
    }

    ChinhSuaMoTa() {
        if (!this.IsEditMoTa) {
            this.IsEditMoTa = !this.IsEditMoTa;
            return;
        } else {
            this.UpdateTodo();
            this.IsEditMoTa = !this.IsEditMoTa;
        }
    }
    UpdateTodo() {
        const ele = document.getElementById(
            "txttitle" + this.StageID
        ) as HTMLInputElement;
        let item = {
            RowID: this.StageID,
            TaskName: ele.value.toString().trim() == "" ? this.itemCV.ToDo : ele.value.toString().trim(),
            Description: this.itemCV.Description,
            Priority: this.itemCV.Priority
        }
        this.store.wfupdateEvent = false;
        this.processWorkService.updateToDo(item).subscribe(res => {
            if (res && res.status === 1) {
                this.LoadDataCongViecChiTiet();
                this.store.wfupdateEvent = true;
                // this.loadDataList();// load danh sách nhiệm vụ công việc
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }
    goBackMoTa() {
        this.IsEditMoTa = !this.IsEditMoTa;
    }
    AddNguoiTheoDoi() {
        let _item = [];
        this.itemCV.Data_Follower.map((item, index) => {
            _item.push('' + item.ObjectID);
        });
        const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item }, panelClass: ['m-mat-dialog-container__wrapper', 'choose_member'] });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }

            let _data = [];
            if (res.data.length > 0) {
                res.data.map((item, index) => {
                    _data.push(item.UserId)
                })
            }
            let item = {
                ID: this.StageID,/// 1: id node; 2: id todo; 3: id process 
                Type: 3,  /// 1: người thực hiện, 2: người theo dõi (quy trình); 3: người theo dõi (công việc chi tiết) 
                WorkType: 2,  /// 1: công việc; 2: công việc chi tiết; 3: quy trình
                NVIDList: _data
            }
            this.processWorkService.updateImplementer(item).subscribe(res => {
                if (res && res.status == 1) {
                    this.LoadDataCongViecChiTiet();
                } else {
                    this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                }
            });
        });
    }

    Delete(_item: any) {
        const _title = this.translate.instant('landingpagekey.xoa');
        const _description = this.translate.instant('landingpagekey.bancochacchanmuonxoakhong');
        const _waitDesciption = this.translate.instant('landingpagekey.dulieudangduocxoa');
        const _deleteMessage = this.translate.instant('landingpagekey.xoathanhcong');

        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.store.wfupdateEvent = false;
            this.processWorkService.delToDo(_item.RowID).subscribe(res => {
                if (res && res.status === 1) {
                    this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
                }
                else {
                    this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                }
                this.LoadDataGiaiDoan();
                this.store.wfupdateEvent = true;
                // this.loaddata.emit();// load danh sách nhiệm vụ công việc
                // this.loadDataList();// load danh sách nhiệm vụ công việc
            });
        });
    }

    DrawPie_CVCT(item: any) {
        if (item.IsQuaHan) {
            return 'quahan';
        } else {
            if (item.Status == 1) {
                return 'thuchien';
            } else if (item.Status == 2) {
                return 'hoanthanh';
            } else if (item.Status == 0) {
                return 'tamdung';
            } else {
                return 'chuathuchien';
            }
        }
    }

    isEditStatus(item: any) {
        if (!item.IsEditStatus) {
            return 'disabled-menu';
        }
        return '';
    }
    //===================Start Tab độ ưu tiên công việc==================
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

    getPriorityName(id) {
        if (id > 0) {
            const item = this.list_priority.find((x) => x.value === id);
            if (item) {
                let name = this.translate.instant('priority.' + '' + item.name);
                return name;
            }
            return "";
        } else {
            return "";
        }
    }

    updatePriority(value) {
        this.itemCV.Priority = value;
        this.UpdateTodo();
    }
    //===================End Tab độ ưu tiên công việc====================

    //===================Start Tab tài liệu công việc====================
    XemTruocCV(item) {
        let obj = item.filename.split(".")[item.filename.split(".").length - 1];
        if (obj == "jpg" || obj == "png" || obj == "jpeg") {
            window.open(item.link);
        }
        if (obj == "xls" || obj == "xlsx" || obj == "doc" || obj == "docx") {
            this.layoutUtilsService.ViewDoc_WF(item.link);
        }
        if (obj == "pdf") {
            this.layoutUtilsService.ViewPdf_WF(item.link);
        }
    }

    ShowXemTruocCV(item) {
        let show = false;
        let obj = item.filename.split(".")[item.filename.split(".").length - 1];
        if (obj == "jpg" || obj == "png" || obj == "jpeg" || obj == "xls" || obj == "xlsx" || obj == "doc" || obj == "docx" || obj == "pdf") {
            show = true;
        }
        return show;
    }

    TaiXuongCV(item) {
        let obj = item.filename.split(".")[item.filename.split(".").length - 1];
        if (obj == "jpg" || obj == "png" || obj == "jpeg") {
            const splitUrl = item.link.split("/");
            const filename = splitUrl[splitUrl.length - 1];
            fetch(item.link)
                .then((response) => {
                    response.arrayBuffer().then(function (buffer) {
                        const url = window.URL.createObjectURL(new Blob([buffer]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", filename); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
                })
                .catch((err) => {
                });
        } else {
            window.open(item.link);
        }
    }


    ThemTaiLieuCV(type: number) {
        const dialogRef = this.dialog.open(DialogDecision, { data: { _type: 17, _TaskID: this.StageID, _Loai: type }, panelClass: 'sky-padding-0', });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.LoadDataCongViecChiTiet();
        });
    }

    XoaTaiLieuCV(item, type) {
        const _title = this.translate.instant('landingpagekey.xoa');
        const _description = this.translate.instant('landingpagekey.bancochacchanmuonxoakhong');
        const _waitDesciption = this.translate.instant('landingpagekey.dulieudangduocxoa');
        const _deleteMessage = this.translate.instant('landingpagekey.xoathanhcong');

        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            let _item = {
                RowID: +this.StageID,
                DescriptionFileDelete: item.filename_full,
                isAdd: false,
                Type: type
            }
            this.processWorkService.updateTaiLieuCongViec(_item).subscribe(res => {
                if (res && res.status === 1) {
                    this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
                }
                else {
                    this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                }
                this.LoadDataCongViecChiTiet();
            });
        });
    }

    public IsEditKetQua: boolean = false;
    CapNhatKetQua() {
        if (!this.IsEditKetQua) {
            this.IsEditKetQua = !this.IsEditKetQua;
            return;
        } else {
            this.UpdateTodoResult();
            this.IsEditKetQua = !this.IsEditKetQua;
        }
    }
    UpdateTodoResult() {
        let item = {
            RowID: this.StageID,
            Description: this.itemCV.DescriptionResult,
            Type: 3
        }
        this.processWorkService.updateTaiLieuCongViec(item).subscribe(res => {
            if (res && res.status === 1) {
                this.LoadDataCongViecChiTiet();
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }
    goBackKetQua() {
        this.IsEditKetQua = !this.IsEditKetQua;
    }
    //===================End Tab tài liệu công việc======================

    //===================End công việc chi tiết======================

    //===================Start công việc liên kết nhiệm vụ và giai đoạn==============
    ShowCongViecLK: boolean = false;
    listAppCode: any[] = [];
    CheckJeeWork() {
        let obj = this.listAppCode.find(x => x == environment.APPCODE_JEEWORK)
        if (obj) {
            this.ShowCongViecLK = true;
        } else {
            this.ShowCongViecLK = false;
        }
    }
    CongViecLienKetNhiemVu() {
        this.IsLKNhiemVu = true;
        this.LoadChiTietQuyTrinh();
    }
    //===================End công việc liên kết nhiệm vụ và giai đoạn================

    //===================Start Tab công việc liên kết giai đoạn =========
    @Input() ID_Project_GD: number = 0;
    TaoCongViecLienKet_GD() {
        if (this.ShowCongViecLK) {
            const item = this.itemGD.CongViec;
            const dialogRef = this.dialog.open(TemplateCenterComponent, {
                data: { item, _isThietLap: false, _nodeID: 0 },
                width: '50vw',
                panelClass: 'sky-padding-0'
            });
            dialogRef.afterClosed().subscribe((res) => {
                if (!res) {
                    return;
                } else {
                    this.UpdateDuAn_NhiemVu_GD(res.ListID);
                    this.changeDetectorRef.detectChanges();
                }
            });
        }
    }

    UpdateDuAn_NhiemVu_GD(id) {
        let item = {
            GiaiDoanID: this.StageID,
            ListID: id,
        }
        this.processWorkService.Update_DuAn_NhiemVu_GD(item).subscribe(res => {
            if (res && res.status == 1) {
                this.ID_Project_GD = id;
                this.LoadDataGiaiDoan();
                this.changeDetectorRef.detectChanges();
            }
        })
    }
    getWidthWW_GD() {
        let tmp_width = 0;
        if (this.itemGD && this.ID_Project_GD > 0) {
            tmp_width = document.getElementById("width-ww-gd").clientWidth;
        }
        return tmp_width + "px";
    }

    //=================Start Tab Bình Luận==================
    // topicObjectID: string;
    private readonly onDestroy = new Subject<void>();
    LoadComment() {
        this.InitComment("kt-process-work-details" + this.TaskID);
    }
    InitComment(id: string) {
        this.topicObjectID$.next("");
        this.processWorkService.getTopicObjectIDByComponentName(id).pipe(
            tap((res) => {
                this.topicObjectID$.next(res);
                this.changeDetectorRef.detectChanges();
            }),
            catchError(err => {
                return of();
            }),
            finalize(() => { }),
            share(),
            takeUntil(this.onDestroy),
        ).subscribe();
    }

    //=================End Tab Bình Luận====================

    //===============Start các hàm xử lý chung===================
    getItemStatusString(status: number): string {
        switch (status) {
            case 0:
                return 'Đang tạm dừng';
            case 1:
                return 'Đang thực hiện';
            case 2:
                return 'Hoàn thành';
        }
        return 'Chưa thực hiện';
    }

    BgButton(status: number): any {
        switch (status) {
            case 0:
                return 'btn-tamdung';
            case 1:
                return 'btn-thuchien';
            case 2:
                return 'btn-hoanthanh';

        }
        return 'btn-chuathuchien';
    }
    //===============End các hàm xử lý chung=====================

    //===================Start Tab tài liệu====================
    XemTruoc(item) {
        let obj = item.filename.split(".")[item.filename.split(".").length - 1];
        if (obj == "jpg" || obj == "png" || obj == "jpeg") {
            window.open(item.link);
        }
        if (obj == "xls" || obj == "xlsx" || obj == "doc" || obj == "docx") {
            this.layoutUtilsService.ViewDoc_WF(item.link);
        }
        if (obj == "pdf") {
            this.layoutUtilsService.ViewPdf_WF(item.link);
        }
    }

    ShowXemTruoc(item) {
        let show = false;
        let obj = item.filename.split(".")[item.filename.split(".").length - 1];
        if (obj == "jpg" || obj == "png" || obj == "jpeg" || obj == "xls" || obj == "xlsx" || obj == "doc" || obj == "docx" || obj == "pdf") {
            show = true;
        }
        return show;
    }

    meImage;
    TaiXuong(item) {
        let obj = item.filename.split(".")[item.filename.split(".").length - 1];
        if (obj == "jpg" || obj == "png" || obj == "jpeg") {
            const splitUrl = item.link.split("/");
            const filename = splitUrl[splitUrl.length - 1];
            fetch(item.link)
                .then((response) => {
                    response.arrayBuffer().then(function (buffer) {
                        const url = window.URL.createObjectURL(new Blob([buffer]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", filename); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
                })
                .catch((err) => {
                });
        } else {
            window.open(item.link);
        }
    }


    ThemTaiLieu() {
        const dialogRef = this.dialog.open(DialogDecision, { data: { _type: 16, _TaskID: this.TaskID }, panelClass: 'sky-padding-0', });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.LoadDataNhiemVu();
        });
    }

    XoaTaiLieu(item) {
        const _title = this.translate.instant('landingpagekey.xoa');
        const _description = this.translate.instant('landingpagekey.bancochacchanmuonxoakhong');
        const _waitDesciption = this.translate.instant('landingpagekey.dulieudangduocxoa');
        const _deleteMessage = this.translate.instant('landingpagekey.xoathanhcong');

        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            let _item = {
                RowID: +this.TaskID,
                DescriptionFileDelete: item.filename_full,
                isAdd: false,
            }
            this.processWorkService.updateTaiLieu(_item).subscribe(res => {
                if (res && res.status === 1) {
                    this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
                }
                else {
                    this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                }
                this.LoadDataNhiemVu();
            });
        });
    }
    //===================End Tab tài liệu======================

    //===================Start Tab hoạt động==================
    ListData: any[] = [];
    LoadHoatDong() {
        const queryParams = new QueryParamsModelNew(
            this.filterHoatDong(),
            '',
            '',
            0,
            100,
            true
        );

        // this.layoutUtilsService.showWaitingDiv();
        this.processWorkService.getActivityLog_Process(queryParams)
            .pipe(
                tap(resultFromServer => {
                    // this.layoutUtilsService.OffWaitingDiv();
                    if (resultFromServer.status == 1) {
                        if (resultFromServer.data.length > 0) {
                            this.ListData = resultFromServer.data;
                        }
                        else {
                            this.ListData = [];
                        }
                    }
                    else {
                        this.ListData = [];
                    }
                    this.changeDetectorRef.detectChanges();
                })
            ).subscribe();
    }

    filterHoatDong(): any {
        const filter: any = {};
        filter.stageid = this.StageID;
        return filter;
    }
    //===================End Tab hoạt động====================

    //==============================================================Start code button công việc liên kết nhiệm vụ========================================================
    IsLKNhiemVu: boolean = false;
    @Input() ID_Project: number = 0;
    goBackNhiemVu() {
        this.IsLKNhiemVu = false;
        this.itemCV = [];
        this.CheckJeeWork();
        this.LoadDataNhiemVu();
        this.LoadDataGiaiDoan();
        this.LoadComment();
    }
    TaoCongViecLienKet() {
        const item = this.TenNhiemVu;
        const dialogRef = this.dialog.open(TemplateCenterComponent, {
            data: { item, _isThietLap: false, _nodeID: 0 },
            width: '50vw',
            panelClass: 'sky-padding-0'
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            } else {
                this.UpdateDuAn_NhiemVu(res.ListID);
                this.changeDetectorRef.detectChanges();
            }
        });
    }

    UpdateDuAn_NhiemVu(id) {
        let item = {
            ProcessID: this.TaskID,
            ListID: id,
        }
        this.processWorkService.Update_DuAn_NhiemVu(item).subscribe(res => {
            if (res && res.status == 1) {
                this.ID_Project = id;
                this.LoadChiTietQuyTrinh();
                this.changeDetectorRef.detectChanges();
            }
        })
    }

    LoadChiTietQuyTrinh() {
        this.processWorkService.Get_ProcessDetail(this.TaskID).subscribe(res => {
            if (res.status == 1) {
                this.itemNV = res.data;
                this.ID_Project = this.itemNV.DuAnListID;
                this.TenNhiemVu = this.itemNV.TaskName;
                this.ShowCongViecLK = true;
                this.changeDetectorRef.detectChanges();
            } else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        })
    }

    //===================================================================
    updateReadMenu(id) {
        let _item = {
            "appCode": "WORKFLOW",
            "mainMenuID": 9,
            "subMenuID": 8,
            "itemID": id,
        }
        this.store.wfupdateEvent = false;
        this.socketService.readNotification_menu(_item).subscribe(res => {
            this.store.wfupdateEvent = true;

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
                    eventType: 'update-sub-jeewf',
                    customData: 'some data here'
                }
            });
            dispatchEvent(busEventSub);
        })
    }

    public ngOnDestroy() {
        this.onDestroy.next();
        if (this.anchors) {
            this.anchors.forEach((anchor: HTMLAnchorElement) => {
                anchor.removeEventListener('click', this.handleAnchorClick)
            })
        }
    }

    public handleAnchorClick = (event: Event) => {
        event.preventDefault();
        const anchor = event.target as HTMLAnchorElement;
        let item = {
            filename: anchor.innerText,
            link: anchor.href,
            strBase64: anchor.id,
        };
        this.downFile(item);
    }

    downFile(item) {
        let obj = item.filename.split(".")[item.filename.split(".").length - 1];
        if (obj == "jpg" || obj == "png" || obj == "jpeg") {
            const splitUrl = item.link.split("/");
            const filename = splitUrl[splitUrl.length - 1];
            fetch(item.link)
                .then((response) => {
                    response.arrayBuffer().then(function (buffer) {
                        const url = window.URL.createObjectURL(new Blob([buffer]));
                        const link = document.createElement("a");
                        link.href = url;
                        link.setAttribute("download", filename); //or any other extension
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            window.open(item.link);
        }
    }

    //================ngày 05/09/2022 cập nhật hạn chót================================================
    getHanChot(item): string {
        if (item.IsEditDeadline) {
            return 'css-hanchot'
        }
        return '';
    }

    //=======================Gọi form cập nhật hạn chót===========================================
    date: any = '';
    UpdateHanChot(_item: any) {
        if (_item.IsEditDeadline) {
            let item = {
                ID: +this.StageID,
                Date: moment(this.date).utc().format("YYYY-MM-DDTHH:mm:ss"),
            }
            this.store.wfupdateEvent = false;
            this.processWorkService.updateDeadline(item.ID, item.Date).subscribe(res => {
                if (res && res.status == 1) {
                    this.store.wfupdateEvent = true;
                    this.LoadDataGiaiDoan();
                } else {
                    this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                }
            });
        }
    }

    //======================Bổ sung node thông tin liên quan=====================
    ThongTinLienQuan: string;
}