import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { of, Subject } from "rxjs";
import { catchError, finalize, share, takeUntil, tap } from "rxjs/operators";
// import { TemplateCenterComponent } from "../../component/Jee-Work/template-center/template-center.component";
import { tinyMCE } from "../../component/tinyMCE/tinyMCE";
import { PageWorkDetailStore } from "../../page-work-detail.store";
import { CongViecTheoQuyTrinhService } from "../services/cong-viec-theo-quy-trinh.services";
import { DanhMucChungService } from "../../../services/danhmuc.service";
import { LayoutUtilsService, MessageType } from "projects/jeeworkflow/src/modules/crud/utils/layout-utils.service";
import { FormatTimeService } from "../../../services/jee-format-time.component";
import { ProcessWorkService } from "../../../services/process-work.service";
import { DynamicSearchFormService } from "../../component/dynamic-search-form/dynamic-search-form.service";
import { QueryParamsModel, QueryParamsModelNew } from "../../../models/query-models/query-params.model";
import { DialogDecision } from "../../component/dialog-decision/dialog-decision.component";
import { ProcessWorkEditComponent } from "../../component/process-work-edit/process-work-edit.component";
import { CongViecDialogUpdateComponent } from "../../component/cong-viec-dialog-update/cong-viec-dialog-update.component";
import { JeeChooseMemberComponent } from "../../component/jee-choose-member/jee-choose-member.component";
@Component({
    selector: 'app-cong-viec-theo-quy-trinh-list',
    templateUrl: './cong-viec-theo-quy-trinh-list.component.html',
})
export class CongViecTheoQuyTrinhListComponent implements OnInit {

    dataLazyLoad: any = [];
    public IDDrop: string = '';
    ListProcess: any[] = [];
    filterViecToiLam:string = '1';
    filtertinhtrang: string = '';
    filterCongvieccon: boolean = false;
    keyword = "";
    //==========Dropdown Search==============
    filter: any = {};
    isnew: boolean = false//Ẩn hiện nhấp nháy
    constructor(
        private danhMucChungService: DanhMucChungService,
        private changeDetectorRef: ChangeDetectorRef,
        public congViecTheoQuyTrinhService: CongViecTheoQuyTrinhService,
        private translate: TranslateService,
        public datepipe: DatePipe,
        private layoutUtilsService: LayoutUtilsService,
        public dialog: MatDialog,
        public _FormatTimeService: FormatTimeService,
        public processWorkService: ProcessWorkService,
        private router: Router,
        public store: PageWorkDetailStore,
        private dynamicSearchFormService: DynamicSearchFormService,
    ) {

    }
    ngOnInit(): void {
        setInterval(() => {
            this.isnew = !this.isnew;
            this.changeDetectorRef.detectChanges();
        }, 1000);
        this.tinyMCE = tinyMCE;
        this.dataLazyLoad = [];
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
        this.dynamicSearchFormService.filterResult.subscribe((value) => {
            this.filter = value;
            this.loadDataDropdown();
        });
        const sb = this.store.wfupdateEvent$.subscribe(res => {
            if (res) {
                this.loadDataList();
            }
        })
    }

    loadDataDropdown() {
        this.danhMucChungService.GetDSQuyTrinh(0).subscribe(res => {
            if (res && res.status == 1) {
                this.ListProcess = res.data;
                this.loadDataList();
            }
            this.changeDetectorRef.detectChanges();
        })
    }

    changeDropDown(val) {
        this.IDDrop = val;
        this.loadDataList();
    }

    //================Tìm kiếm theo tình trạng và hiển thị công việc con==========================
    changedTinhTrang(val) {
        this.filtertinhtrang = val.value;
        this.loadDataList();
    }
    changedViecToiLam(val){
        this.filterViecToiLam = val.value;
        this.loadDataList();
    }
    changedCongViecCon() {
        this.filterCongvieccon = !this.filterCongvieccon;
        this.loadDataList();
    }

    loadDataList() {
        const queryParams = new QueryParamsModelNew(
            this.filterConfiguration(),
            'asc',
            '',
            this.crr_page,
            this.page_size,
        );
        this.congViecTheoQuyTrinhService.loadCongViecTheoQuyTrinh(queryParams).subscribe(res => {
            if (res && res.status == 1) {
                this.dataLazyLoad = [];
                this.dataLazyLoad = [...this.dataLazyLoad, ...res.data];
                this.total_page = res.page.AllPage;
                if (this.dataLazyLoad.length > 0) {
                    this._HasItem = true;
                    this.dataLazyLoad.map((item, index) => {
                        if (item.stage_implementer.length > 0) {
                            let manager1 = [];
                            let manager2 = [];
                            item.stage_implementer.map((im, index) => {
                                if (index < 1) {
                                    manager1.push(im);
                                } else {
                                    manager2.push(im);
                                }
                            })
                            item.Manager1 = manager1;
                            item.Manager2 = manager2;
                            item.Manager2_count = manager2.length;
                        }
                    })
                }
                else {
                    this._HasItem = false;
                }
                this._loading = false;
                this.changeDetectorRef.detectChanges();
            }
            this.changeDetectorRef.detectChanges();
        });
    }

    filterConfiguration(): any {
        // let filter: any = {};
        // filter.keyword = this.keyword;

        this.filter.isprocess = true;
        this.filter.processid = this.IDDrop;
        this.filter.stageid = "";

        this.filter.typeid = this.filtertinhtrang;
        this.filter.isviewtodo = this.filterCongvieccon ? 'True' : 'False';
        this.filter.role = this.filterViecToiLam;

        return this.filter;
    }

    StageID: number = 0;
    TypeID: number = 1;
    tinyMCE = {};
    changeRoute(item, typeid) {
        this.StageID = item.stageid;
        this.TaskID = item.taskid;
        this.TypeID = typeid;
        this.router.navigateByUrl(`Workflow/CongViecTheoQuyTrinh/${this.TypeID}/${this.StageID}/${this.TaskID}`);
    }

    getHeight(): any {
        let tmp_height = window.innerHeight - 200;
        return tmp_height + "px";
    }

    getHeightMain(): any {
        let tmp_height = window.innerHeight - 60;
        return tmp_height + "px";
    }

    DrawPie(item: any) {
        if (item.IsQuaHan) {
            return 'quahan';
        } else {
            if (item.stage_statusid == 1) {
                return 'thuchien';
            } else if (item.stage_statusid == 2) {
                return 'hoanthanh';
            } else if (item.stage_statusid == 0) {
                return 'tamdung';
            } else {
                return 'chuathuchien';
            }
        }
    }

    onScroll(event) {
        let _el = event.srcElement;
        if (_el.scrollTop + _el.clientHeight > _el.scrollHeight * 0.9) {
            // this.loadDataList_Lazy();
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
                this.congViecTheoQuyTrinhService.loadCongViecTheoQuyTrinh(queryParams)
                    .pipe(
                        tap(resultFromServer => {
                            if (resultFromServer.status == 1) {
                                this.dataLazyLoad = [...this.dataLazyLoad, ...resultFromServer.data];
                                if (resultFromServer.data.length > 0) {
                                    this._HasItem = true;
                                    this.dataLazyLoad.map((item, index) => {
                                        if (item.stage_implementer.length > 0) {
                                            let manager1 = [];
                                            let manager2 = [];
                                            item.stage_implementer.map((im, index) => {
                                                if (index < 1) {
                                                    manager1.push(im);
                                                } else {
                                                    manager2.push(im);
                                                }
                                            })
                                            item.Manager1 = manager1;
                                            item.Manager2 = manager2;
                                            item.Manager2_count = manager2.length;
                                        }
                                    })
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

                    });
            }
        }
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
        // this.layoutUtilsService.showWaitingDiv();
        this.processWorkService.Get_NodeDetail(this.StageID).subscribe(res => {
            // this.layoutUtilsService.OffWaitingDiv();
            if (res.status == 1) {
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
                    this.LoadMauQuyetDinh();
                } else {
                    this.ShowBieuMau = false;
                }
                this.ID_Project_GD = this.itemGD.listid;
            }
            this.changeDetectorRef.detectChanges();
        })

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
                dialogRef.afterClosed().subscribe(res => {
                    if (!res) {
                        return;
                    }
                    this.LoadDataGiaiDoan();
                    this.loadDataList();// load danh sách nhiệm vụ công việc
                });
            } else {
                let item = {
                    ID: +this.StageID,
                    Status: +val,
                }
                this.processWorkService.updateStatusNode(item).subscribe(res => {
                    if (res && res.status == 1) {
                        this.LoadDataGiaiDoan();
                        this.loadDataList();// load danh sách nhiệm vụ công việc
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
        this.processWorkService.Get_FieldsNode(this.StageID, 0).subscribe(res => {
            if (res.status == 1) {
                if (res.data.length > 0) {
                    this.loadDynamic(this.StageID, 0, true);
                } else {
                    this.LoadDataGiaiDoan();
                    this.loadDataList();// load danh sách nhiệm vụ công việc
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
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            else {
                this.LoadDataGiaiDoan();
                this.loadDataList();// load danh sách nhiệm vụ công việc
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
                        dialogRef.afterClosed().subscribe(res => {
                            if (!res) {
                                return;
                            }
                            this.LoadDataGiaiDoan();
                            this.loadDataList();// load danh sách nhiệm vụ công việc
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
                        dialogRef.afterClosed().subscribe(res => {
                            if (!res) {
                                return;
                            } else {
                                if (TypeID == "1") {
                                    // this.LoadChiTietQuyTrinh();
                                } else {
                                    this.LoadDataGiaiDoan();
                                    this.loadDataList();
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
    LoadMauQuyetDinh() {
        this.processWorkService.Get_FieldsNode(this.StageID, 0).subscribe(res => {
            if (res && res.status == 1) {
                if (res.KetQua.length > 0) {
                    this.ContentStr = res.ContentStr;
                    this.ListKetQua = res.KetQua;
                    this.changeDetectorRef.detectChanges();
                }
            } else {
                this.ContentStr = "";
                this.ListKetQua = [];
            }
        })
    }

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
                    data: { _item: data, _type: 5 }
                });
                dialogRef.afterClosed().subscribe(res => {
                    if (!res) {
                        return;
                    }
                    if (+this.TypeID == 3) {
                        this.LoadDataCongViecChiTiet();
                    } else {
                        this.LoadDataGiaiDoan();
                    }
                    this.loadDataList();// load danh sách nhiệm vụ công việc
                });
            } else {
                let item = {
                    ID: +data.RowID,
                    Status: +val,
                }
                this.processWorkService.updateStatusToDo(item).subscribe(res => {
                    if (res && res.status == 1) {
                        if (+this.TypeID == 3) {
                            this.LoadDataCongViecChiTiet();
                        } else {
                            this.LoadDataGiaiDoan();
                        }
                        this.loadDataList();// load danh sách nhiệm vụ công việc
                    } else {
                        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                    }
                });
            }
        });

    }

    loadCongViec() {
        this.LoadDataGiaiDoan();
        this.loadDataList();// load danh sách nhiệm vụ công việc
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
        this.processWorkService.updateToDo(item).subscribe(res => {
            if (res && res.status === 1) {
                this.LoadDataCongViecChiTiet();
                this.loadDataList();// load danh sách nhiệm vụ công việc
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

            this.processWorkService.delToDo(_item.RowID).subscribe(res => {
                if (res && res.status === 1) {
                    this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
                }
                else {
                    this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                }
                this.LoadDataGiaiDoan();
                // this.loaddata.emit();// load danh sách nhiệm vụ công việc
                this.loadDataList();// load danh sách nhiệm vụ công việc
            });
        });
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
        // this.listAppCode = this.authService.getAppCodeId();
        // let obj = this.listAppCode.find(x => x == environment.APPCODE_JEEWORK)
        // if (obj) {
        //     this.ShowCongViecLK = true;
        // } else {
        //     this.ShowCongViecLK = false;
        // }
    }

    //===================End công việc liên kết nhiệm vụ và giai đoạn================

    //===================Start Tab công việc liên kết giai đoạn =========
    @Input() ID_Project_GD: number = 0;
    TaoCongViecLienKet_GD() {
        if (this.ShowCongViecLK) {
            const item = this.itemGD.CongViec;
            // const dialogRef = this.dialog.open(TemplateCenterComponent, {
            //     data: { item, _isThietLap: false, _nodeID: 0 },
            //     width: '50vw',
            // });
            // dialogRef.afterClosed().subscribe((res) => {
            //     if (!res) {
            //         return;
            //     } else {
            //         this.UpdateDuAn_NhiemVu_GD(res.ListID);
            //         this.changeDetectorRef.detectChanges();
            //     }
            // });
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
    topicObjectID: string;
    private readonly onDestroy = new Subject<void>();
    LoadComment() {
        this.InitComment("kt-process-work-details" + this.TaskID);
    }
    InitComment(id: string) {
        this.topicObjectID = "";
        this.processWorkService.getTopicObjectIDByComponentName(id).pipe(
            tap((res) => {
                this.topicObjectID = res;
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

    BgStatus(status: number): any {
        switch (status) {
            case 0:
                return 'stt-thatbai';
            case 0:
                return 'stt-tamdung';
            case 1:
                return 'stt-thuchien';
            case 2:
                return 'stt-hoanthanh';

        }
        return 'stt-chuathuchien';
    }

    ColorTitle(status: number): any {
        switch (status) {
            case 0:
                return 'cl-thatbai';
            case -1:
                return 'cl-tamdung';
            case 1:
                return 'cl-thuchien';
            case 2:
                return 'cl-hoanthanh';

        }
        return 'cl-chuathuchien';
    }
    //===============End các hàm xử lý chung=====================

   

   
}