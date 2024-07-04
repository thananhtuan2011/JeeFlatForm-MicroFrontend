import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTabChangeEvent } from "@angular/material/tabs";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { AuthService } from "../services/auth.service";
import { PageWorkDetailStore } from "../../../services/page-work-detail.store";
import { LayoutUtilsService,MessageType } from "projects/jeework/src/modules/crud/utils/layout-utils.service";
import { CongViecTheoDuAnService } from "../services/cong-viec-theo-du-an.services";
import { QueryParamsModel, QueryParamsModelNew } from "../../../models/query-models/query-params.model";
import { WeWorkService } from "../services/jee-work.service";
import { PageWorksService } from "../services/page-works.service";


@Component({
    selector: 'app-cong-viec-theo-widget-popup',
    templateUrl: './cong-viec-theo-widget-popup.component.html',
    styleUrls: ["./cong-viec-theo-widget-popup.component.scss"],
})
export class CongViecTheoWidgetPopupComponent implements OnInit {
    selectedTab: number = 0;
    hasFormErrors: boolean = false;
    viewLoading: boolean = false;
    loadingSubject = new BehaviorSubject<boolean>(false);
    loadingControl = new BehaviorSubject<boolean>(false);

    roleassign: boolean = true;//Quyền người thực hiện
    rolefollower: boolean = true;//Quyền người theo dõi
    roleprioritize: boolean = true;//Quyền độ ưu tiên
    roledeadline: boolean = true;// Quyền thời hạn làm việc
    loadTags = false;

    UserID = 0;

    labelDuAn: string = "";
    idDuAn: string = "";
    listDuAn: any[] = [];

    Assign: any = [];
    id_nv_selected = 0
    Followers: any = [];
    options_assign: any = [];
    priority = 0;
    title: string = '';

    selectedDate: any = {
        startDate: '',
        endDate: '',
    };

    list_role: any[] = [];
    IsAdminGroup = false;

    list_priority: any[] = [];

    // load task
    list_Tag: any = [];
    project_team: any = "";

    tinyMCE = {};
    description_tiny: string;

    type: string = ""//nếu là việc dự án (type = 4) thì chọn dự án truyền từ trang list
    //======================================================================
    isTaskChat: boolean = false;
    messageid: number = 0;
    groupid: number = 0;

    //Bổ sung thêm phần công việc liên kết 
    idLienKet: number = 0;

    //---------------------------------------------
    listField: any[] = [];
    dataLazyLoad: any = [];
    isEdittitle = -1;
    public IDDrop: string = '-1';
    isLoad = true;
    IsGov: boolean = false;
    dataLazyLoad_ID: any = [];
    filter: any = {};
    ID_NV: number = 0;
    idTienDo: string = "0";
    idTinhTrangDuAN: string = '';
    idPhongBan: string = "0";
    idNhanVienPB: string = "";
    idTinhTrang: string = '1';
    filterCongvieccon: boolean = true;
    assign = false;
    id_user
    //-------------------------------------------------------------

    constructor(public dialogRef: MatDialogRef<CongViecTheoWidgetPopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private changeDetectorRef: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private translate: TranslateService,
        public datepipe: DatePipe,
        private authService: AuthService,
        
        
        
        public dialog: MatDialog,
        private weworkService: WeWorkService,
        public congViecTheoDuAnService: CongViecTheoDuAnService,
        public store: PageWorkDetailStore,
        public pageWorkService: PageWorksService,
    ) {

    }
    ngOnInit(): void {

        this.IDDrop = this.data.IDDrop;
        this.type = this.data.type;
        this.idDuAn = this.data.IDPr;
        this.idTienDo = this.type
        this.assign = this.data.assign;
        this.id_user = this.data.iduser;
        // if (this.type == "4") {
        //     this.idDuAn = this.data.IDPr;
        // }


        this.LoadData();
        this.loadDataList();

        this.UserID = this.authService.getUserId();
       
        
        
        this.dataLazyLoad = [];
        const read = this.store.updateRead$.subscribe(res => {
            if (res && res > 0) {
                let obj = this.dataLazyLoad.find(x => +x.id_row == +res);
                if (obj) {
                    obj.isnewchange = false;
                }
                this.changeDetectorRef.detectChanges();
            }
        })
    }
    onScroll(event) {
        let _el = event.srcElement;
        if (_el.scrollTop + _el.clientHeight > _el.scrollHeight * 0.9) {
            //this.loadDataList_Lazy();
        }
    }
    getHeight(): any {
        let tmp_height = window.innerHeight - 125;
        return tmp_height + "px";
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
    public listDataStatus: any[] = [];
    ListAllStatusDynamic: any = [];
    statusChange(val) {
        // this.listDataStatus = [];
        // this.congViecTheoDuAnService.listTinhTrangDuAnNew(val.id_project_team, val.id_row).subscribe(res => {
        //     if (res && res.status == 1) {
        //         this.listDataStatus = res.data;
        //     }
        //     this.changeDetectorRef.detectChanges();
        // })
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
        if (+task.status === +status.id_row) {
            return;
        }
        //this.UpdateByKeyNew(task, 'status', status.id_row);
    }
    focusOutFunction(event, node) {
        this.isEdittitle = -1;
        if (event.target.value.trim() === node.title.trim() || event.target.value.trim() === '') {
            event.target.value = node.title;
            return;
        }
        //this.UpdateByKeyNew(node, 'title', event.target.value.trim());
    }
    OpenDetail(item) {
       
    }
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

    editTitle(val) {
        this.isEdittitle = val;
        const ele = (document.getElementById('task' + val) as HTMLInputElement);
        setTimeout(() => {
            ele.focus();
        }, 50);
    }
    popupTask(item) {
        // this.jeeWorkStore.updateEvent = false;
        // this.router.navigate(['', { outlets: { auxName: 'aux/detailWorkNew/' + item.id_row + '|' + item.id_project_team }, }]);

    }
    RemoveTag(tag, item) {
        //this.UpdateByKeyNew(item, 'Tags', tag.id_row);
    }
    ReloadData(event) {
        //this.loadDataList();
    }
    updateDate(task, date, field) {
        // if (date) {
        //     this.UpdateByKeyNew(task, field, moment(date).format('MM/DD/YYYY HH:mm'));
        // } else {
        //     this.UpdateByKeyNew(task, field, null);
        // }
    }
    Updateestimates(task, event) {
        //this.UpdateByKeyNew(task, 'estimates', event);
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
        return this.translate.instant('GeneralKey.chuagantinhtrang');
    }
    ItemSelected(val: any, task) { // chọn item
        if (val.id_nv) {
            val.userid = val.id_nv;
        }
        //this.UpdateByKeyNew(task, 'assign', val.userid);
    }
    loadOptionprojectteam(node) {
        const id_project_team = node.id_project_team;
        //this.LoadUserByProject(id_project_team);
    }
    stopPropagation(event) {
        event.stopPropagation();
    }
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
        //this.UpdateByKeyNew(task, field, value);
    }
    _loading = false;
    _HasItem = false;
    crr_page = 0;
    page_size = 20;
    total_page = 0;
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
            // if (this.isSearchLog) {//Có lưu tùy chọn xem
            //     this.changedLog(true);
            // }
            this.isLoad = true;
            setTimeout(() => {
                if (this.isLoad) {
                    this.layoutUtilsService.showWaitingDiv();
                }
            }, 2000);
            // this.congViecTheoDuAnService.loadCongViecTheoDuAn(queryParams).subscribe(res => {
            //     this.isLoad = false;
            //     this.layoutUtilsService.OffWaitingDiv();
            //     this.IsGov = res.isgov;
            //     if (res && res.status == 1) {
            //         this.dataLazyLoad = [];
            //         if (res.data.length > 0) {
            //             this.dataLazyLoad = [...this.dataLazyLoad, ...res.data];
            //         }

            //         this.dataLazyLoad_ID = [];
            //         if (res.data_id != null) {
            //             this.dataLazyLoad_ID = [...this.dataLazyLoad_ID, ...res.data_id];
            //         }

            //         this.total_page = res.page ? res.page.AllPage : 0;
            //         if (this.dataLazyLoad.length > 0) {
            //             this._HasItem = true;
            //         }
            //         else {
            //             this._HasItem = false;
            //         }
            //         this._loading = false;
            //     } else {
            //         this.dataLazyLoad = [];
            //         this.dataLazyLoad_ID = [];
            //         this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            //     }
            //     this.changeDetectorRef.detectChanges();
            // });
        }
    }
    loadDataList_Lazy() {
        // if (!this._loading) {
        //     this.crr_page++;
        //     if (this.crr_page < this.total_page) {
        //         this._loading = true;
        //         const queryParams = new QueryParamsModel(
        //             this.filterConfiguration(),
        //             'asc',
        //             '',
        //             this.crr_page,
        //             this.page_size,
        //         );
        //         this.congViecTheoDuAnService.loadCongViecTheoDuAn(queryParams)
        //             .pipe(
        //                 tap(resultFromServer => {
        //                     this.IsGov = resultFromServer.isgov;
        //                     if (resultFromServer.status == 1) {
        //                         this.dataLazyLoad = [...this.dataLazyLoad, ...resultFromServer.data];
        //                         this.dataLazyLoad_ID = [...this.dataLazyLoad_ID, ...resultFromServer.data_id];
        //                         if (resultFromServer.data.length > 0) {
        //                             this._HasItem = true;
        //                         }
        //                         else {
        //                             this._HasItem = false;
        //                         }
        //                         this.changeDetectorRef.detectChanges();
        //                     }
        //                     else {
        //                         this._loading = false;
        //                         this._HasItem = false;
        //                     }

        //                 })
        //             ).subscribe(res => {
        //                 this._loading = false;
        //             });
        //     }
        // }
    }
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
        // this.congViecTheoDuAnService.loadCongViecTheoDuAn(queryParams).subscribe(res => {
        //     this.IsGov = res.isgov;
        //     if (res && res.status == 1) {
        //         this.dataLazyLoad = [];
        //         this.dataLazyLoad = [...this.dataLazyLoad, ...res.data];

        //         this.dataLazyLoad_ID = [];
        //         if (res.data_id) {
        //             this.dataLazyLoad_ID = [...this.dataLazyLoad_ID, ...res.data_id];
        //         }

        //         this.total_page = res.page ? res.page.AllPage : 0;
        //         if (this.dataLazyLoad.length > 0) {
        //             this._HasItem = true;
        //         }
        //         else {
        //             this._HasItem = false;
        //         }
        //         this._loading = false;
        //     } else {
        //         this.dataLazyLoad = [];
        //         this.dataLazyLoad_ID = [];
        //         this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
        //     }
        //     this.changeDetectorRef.detectChanges();
        // });
    }
   
    filterConfiguration(): any {
        // let filter: any = {};
        if (this.IDDrop == "-1") {
            return null;
        }
        if (this.IDDrop == "2") {//Việc cấp dưới
            if (this.ID_NV > 0) {
                this.filter.filter = "2";
                //this.filter.id_nv = this.ID_NV;
                //this.filter.list_id_nv = "";
            } else {
                this.filter.filter = "2";
                //this.filter.list_id_nv = "";
            }
        }
        else if (this.IDDrop == "3") {//Việc cấp dưới
            if (this.ID_NV > 0) {
                this.filter.filter = "3";
                this.filter.id_nv = this.ID_NV;
                this.filter.list_id_nv = "";
            } else {
                this.filter.filter = "3";
                this.filter.list_id_nv = "";
            }
        } 
        else if (this.IDDrop == "4") {//Việc dự án
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
                this.filter.id_user_giao = this.idNhanVienPB;
            }
        }
        else {
            this.filter.filter = this.IDDrop;
        }
        if (this.IDDrop == "1" || this.IDDrop == "2" || this.IDDrop == "3") {
            this.filter.status_list = this.idTinhTrang;
        }
        this.filter.displayChild = this.filterCongvieccon ? '1' : '0';

        this.filter.sort = "NgayGiao_Giam";//sắp xếp theo ngày giao giảm
        this.filter.isclose = "0";//Công việc chưa đóng

        

        if(this.assign){
            this.filter.assign = true;
        }
        if(this.id_user != 0){
            this.filter.id_user = this.id_user;
        }

        return this.filter;
    }

    LoadData() {
       
        this.pageWorkService.ListAllStatusDynamic().subscribe((res) => {
            if (res && res.status == 1) {
                this.ListAllStatusDynamic = res.data;
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
    changeTienDo(data1,data2){

    }
    closeDialog(){
        this.dialogRef.close();
    }
}