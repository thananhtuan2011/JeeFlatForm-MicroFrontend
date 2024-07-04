import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, ReplaySubject } from "rxjs";
import { DialogSelectdayComponent } from "../../component/Jee-Work/dialog-selectday/dialog-selectday.component";
import { MenuPhanQuyenServices, WeWorkService } from "../../component/Jee-Work/jee-work.servide";
import { CongViecTheoDuAnService } from "../services/cong-viec-theo-du-an.services";
import * as moment from 'moment';
import { FileUploadModel, UpdateFileModel, UserInfoModel, WorkDraftModel, WorkModel } from "../../component/Jee-Work/jee-work.model";
import { tinyMCE } from "../../component/Jee-Work/tinyMCEGOV";
import { quillConfig } from "../../component/Jee-Work/Quill_config";
import { HttpUtilsService } from "projects/jeework-v1/src/modules/crud/utils/http-utils.service";
import { LayoutUtilsService, MessageType } from "projects/jeework-v1/src/modules/crud/utils/layout-utils.service";

@Component({
    selector: 'app-cong-viec-theo-du-an-v1-popup',
    templateUrl: './cong-viec-theo-du-an-v1-popup.component.html',
})
export class CongViecTheoDuAnVer1PopupComponent implements OnInit {
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

    //Start sử dụng check cho Work_Draft và GOV_Docs
    Use_Draft: boolean = false;//biến này check người dùng có dùng bản nháp hay không
    DocsID: number = 0;

    Assign_dynamic: any = [] = [];
    //ENd Work_Draft và GOV_Docs

    UserID = 0;

    titleNhiemvu: string = "";
    labelDuAn: string = "";
    idDuAn: string = "";
    listDuAn: any[] = [];
    data_WorkDraft: any[];
    data_Ass: any[] = [];

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
    //====================================================================
    txtMoTa: string = '';
    //===(09/02/2023)====Thay đổi tiện ích tiny -> quill=================
    public quillConfig: {};
    public editorStyles1 = {
        'min-height': '100px',
        'max-height': '800px',
        'height': '300px',
        'font-size': '12pt',
        'overflow-y': 'auto',
        'padding-bottom': '3%',
    };
    constructor(public dialogRef: MatDialogRef<CongViecTheoDuAnVer1PopupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private changeDetectorRef: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private translate: TranslateService,
        public datepipe: DatePipe,
        public congViecTheoDuAnService: CongViecTheoDuAnService,
        private weworkService: WeWorkService,
        private menuServices: MenuPhanQuyenServices,
        public dialog: MatDialog,
        private httpUtils: HttpUtilsService,
    ) {

    }
    ngOnInit(): void {       
        if(this.data.idDraft && this.data.idDraft!=0){
            this.LoadWorkDraft(this.data.idDraft);
        }
        else{
            this.LoadData();
        }
        
    }
    LoadData() {
        this.UserID = this.httpUtils.getUserID();
        this.tinyMCE = tinyMCE;
        this.quillConfig = quillConfig;
        this.type = this.data._type;
        if (this.type == "4") {
            this.idDuAn = this.data._id_duan;
        }
        this.LoadDataDuAn();
        this.ResetData();
        this.list_priority = this.weworkService.list_priority;
        if (this.data._messageid && this.data._messageid > 0) {
            this.isTaskChat = true;
            this.messageid = this.data._messageid;
            this.groupid = this.data._groupid;
        }
        if (this.data._idLienKet && this.data._idLienKet > 0) {
            let date = new Date(this.data._ngayvanban + 'Z');
            this.idLienKet = this.data._idLienKet;
            const ele2 = document.getElementById("txtsokyhieu") as HTMLInputElement;
            ele2.value = this.data._sokyhieu;
            const ele3 = document.getElementById("txtngayvanban") as HTMLInputElement;
            ele3.value = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
            const ele4 = document.getElementById("txttrichyeu") as HTMLInputElement;
            ele4.value = this.data._trichyeu;
        }
        //=====Gọi tham số hiển thị text mô tả=================
        this.congViecTheoDuAnService.getThamSo(15).subscribe(res => {
            if (res && res.status == 1) {
                this.txtMoTa = res.data;
                this.changeDetectorRef.detectChanges();
            }
        })

    }
    LoadDataDuAn() {
        this.congViecTheoDuAnService.lite_project_by_manager().subscribe(res => {
            if (res && res.status == 1) {
                if (res.data.length > 0) {
                    this.listDuAn = res.data.filter(x => x.locked == false);
                    if (this.type == "4") {
                        let obj = this.listDuAn.find(x => +x.id_row == +this.idDuAn);
                        if (obj) {
                            this.labelDuAn = obj.title;
                            if (obj.is_use_template) {
                                this.description_tiny = obj.template_description;
                            } else {
                                if (this.data._messageid && this.data._messageid > 0) {
                                    this.description_tiny = this.data._message;
                                }
                                else {
                                    this.description_tiny = "";
                                }

                            }
                        } else {
                            this.idDuAn = this.listDuAn[0].id_row;
                            this.labelDuAn = this.listDuAn[0].title;
                        }
                    } else {
                        this.idDuAn = this.listDuAn[0].id_row;
                        this.labelDuAn = this.listDuAn[0].title;
                        if (this.data._messageid && this.data._messageid > 0) {
                            this.description_tiny = this.data._message;
                        } {
                            if (this.listDuAn[0].is_use_template) {
                                this.description_tiny = this.listDuAn[0].template_description;
                            } else {
                                if (this.data._messageid && this.data._messageid > 0) {
                                    this.description_tiny = this.data._message;
                                }
                                else {
                                    this.description_tiny = "";
                                }

                            }
                        }
                    }

                    this.setUpDropSearchDuAn();
                    this.loadDataForDuAn();
                }
            }
            this.changeDetectorRef.detectChanges();
        })

    }

    getRoles() {
        this.roleassign = this.CheckRoles(14);
        this.roleprioritize = this.CheckRoleskeypermit('clickup_prioritize');
        this.roledeadline = this.CheckRoles(10);
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
    //====================Dự án====================
    public bankFilterCtrlDuAn: FormControl = new FormControl();
    public filteredBanksDuAn: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
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

    loadDataForDuAn() {
        this.weworkService.lite_tag(this.idDuAn).subscribe((res) => {
            if (res && res.status === 1) {
                this.list_Tag = res.data;
                this.changeDetectorRef.detectChanges();
            }
        });
        this.menuServices.GetRoleWeWork("" + this.UserID).subscribe((res) => {
            if (res && res.status == 1) {
                // this.list_role = res.data.dataRole;
                this.list_role = res.data.dataRole ? res.data.dataRole : [];
                this.IsAdminGroup = res.data.IsAdminGroup;
                //================Các biến cần xét quyền===========
                this.getRoles();
            }
        });
        this.LoadListAccount();
    }

    listUser: any[];
    LoadListAccount() {
        this.weworkService.list_account_gov(this.idDuAn).subscribe(res => {
            if (res && res.status === 1) {
                this.listUser = res.data;

                //Nếu có id chat thì chỉ chọn user theo id, ngược lại tạo bình thường
                this.Assign = [];
                if (this.data._messageid && this.data._messageid > 0) {
                    this.Assign.push(this.data._itemid);
                } else {
                    let obj = this.listUser.find(x => x.IsOwner);
                    if (obj) {
                        this.Assign.push(obj);
                    }
                }
                this.options_assign = this.getOptions_Assign();
                this.changeDetectorRef.detectChanges();
            };
            this.LoadDataNguoiGiaoViec();
        });
    }

    getOptions_Assign() {
        var options_assign: any = {
            showSearch: true,
            keyword: '',
            data: this.listUser,
        };
        return options_assign;
    }

    ResetData() {
        const ele = document.getElementById("txttitle") as HTMLInputElement;
        ele.value = "";
        this.title = "";
        this.Assign = [];
        this.Followers = [];
        this.selectedDate = {
            startDate: '',
            endDate: '',
        }
        this.priority = 0;
        this.listTagChoose = [];

        this.listGiaoCho_Finish = [];
        this.NguoiGiaoViec = [];
        //=================Cập nhật field mới================

        if (!this.data_WorkDraft) {

            this.listGiaoCho = [];
            let date = new Date();
            const ele2 = document.getElementById("txtsokyhieu") as HTMLInputElement;
            ele2.value = "";
            const ele3 = document.getElementById("txtngayvanban") as HTMLInputElement;
            ele3.value = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
            const ele4 = document.getElementById("txttrichyeu") as HTMLInputElement;
            ele4.value = "";
        }
    }

    goBack() {
        this.dialogRef.close();
    }

    //===========================Check role=================================
    CheckRoles(roleID: number) {
        const x = this.list_role.find((res) => res.id_row == this.idDuAn);
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
                (res) => res.id_row == this.idDuAn
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

    CheckRoleskeypermit(key) {
        const x = this.list_role.find((res) => res.id_row == this.idDuAn);
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

    //=======================================================================
    changeDuAn(item) {
        this.labelDuAn = item.title;
        this.idDuAn = item.id_row;
        this.bankFilterCtrlDuAn.setValue("");
        if (item.is_use_template) {
            this.description_tiny = item.template_description;
        } else {
            this.description_tiny = "";
        }
        this.getRoles();
        this.loadDataForDuAn();
    }

    //============Xử lý người thực hiện và người theo dõi công việc==================
    getAssignees() {
        return this.Assign;
    }
    getFollowers() {
        return this.Followers;
    }
    stopPropagation(event) {
        event.stopPropagation();
    }
    ItemSelected(val: any, loai) {
        if (loai == 1) {
            var index = this.Assign.findIndex(x => x.id_nv == val.id_nv)
            if (index < 0) {
                this.Assign[0] = val;
            } else {
                this.Assign.splice(index, 1);
            }
        }
        else {//người giao việc
            var index = this.NguoiGiaoViec.findIndex(x => x.userid == val.userid)
            if (index < 0) {
                this.NguoiGiaoViec[0] = val;
            } else {
                this.NguoiGiaoViec.splice(index, 1);
            }
        }
    }
    //==========================Xử lý chọn độ ưu tiên================================
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

    //======================Xử lý chon tags=================================
    listTagChoose: any[] = [];
    ReloadDatasTag(event) {
        this.listTagChoose.push(event);
    }

    RemoveTag(tag) {
        const index = this.listTagChoose.indexOf(tag, 0);
        this.listTagChoose.splice(index, 1);
    }

    //=====================Xử lý chọn thời gian thực hiên==================
    estimates: string = '';
    Updateestimates(event) {
        this.estimates = event;
    }

    //=====================Xử lý thơi gian bắt đầu kết thúc=================
    viewdate() {
        if (this.selectedDate.startDate == '' && this.selectedDate.endDate == '') {
            return this.translate.instant('work.chonthoigian')
        }
        else {
            var start = this.f_convertDate(this.selectedDate.startDate) ? this.f_convertDate(this.selectedDate.startDate) : '...';
            var end = this.f_convertDate(this.selectedDate.endDate) ? this.f_convertDate(this.selectedDate.endDate) : '...';
            return 'Ngày bắt đầu: ' + start + ' - ' + 'Deadline: ' + end
        }
    }

    f_convertDate(v: any) {
        if (v != "" && v != undefined) {
            let a = new Date(v);
            return ("0" + (a.getDate())).slice(-2) + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + a.getFullYear();
        }
    }

    Selectdate() {
        const dialogRef = this.dialog.open(DialogSelectdayComponent, {
            width: '500px',
            data: this.selectedDate,
            panelClass: 'sky-padding-0'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != undefined) {
                if (moment(result.startDate).format('MM/DD/YYYY') != "Invalid date")
                    this.selectedDate.startDate = moment(this.selectedDate.startDate).format('MM/DD/YYYY');
                if (moment(result.endDate).format('MM/DD/YYYY') != "Invalid date") {
                    this.selectedDate.endDate = moment(this.selectedDate.endDate).format('MM/DD/YYYY');
                }
            }
        });
    }
    SelectdateisVanBan(vi) {
        let selectedDateVB: any = {
            startDate: this.listGiaoCho[vi].startDate,
            endDate: this.listGiaoCho[vi].endDate,
        };

        const dialogRef = this.dialog.open(DialogSelectdayComponent, {
            width: '500px',
            data: selectedDateVB,
            panelClass: 'sky-padding-0'
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result != undefined) {
                if (this.listGiaoCho[vi]) {

                    if (moment(result.startDate).format('MM/DD/YYYY') != "Invalid date")
                        this.listGiaoCho[vi].startDate = moment(selectedDateVB.startDate).format('MM/DD/YYYY');
                    if (moment(result.endDate).format('MM/DD/YYYY') != "Invalid date") {
                        this.listGiaoCho[vi].endDate = moment(selectedDateVB.endDate).format('MM/DD/YYYY');
                    }
                }

            }
        });
    }
    //=======================Xử lý cho phần chọn tài liệu=====================
    AttFile: any[] = [];
    @ViewChild('myInput') myInput;
    indexItem: number;
    ObjImage: any = { h1: "", h2: "" };
    Image: any;
    TenFile: string = '';

    selectFile() {
        let el: HTMLElement = this.myInput.nativeElement as HTMLElement;
        el.click();
    }

    images = [];
    myForm = new FormGroup({
        file: new FormControl(''),
        fileSource: new FormControl('')
    });

    FileSelected(evt: any) {
        if (evt.target.files && evt.target.files.length) {//Nếu có file
            var filesAmount = evt.target.files.length;
            let isFlag = true;
            for (let i = 0; i < filesAmount; i++) {
                // var typefile = evt.target.files[i].name.split(".")[evt.target.files[i].name.split(".").length - 1];//Lấy loại file
                // if (typefile != "doc" && typefile != "docx" && typefile != "xls" && typefile != "xlsx" && typefile != "pdf" && typefile != "rar" && typefile != "zip"
                //     && typefile != "jpg" && typefile != "png") {
                //     this.layoutUtilsService.showActionNotification("Tồn tại tệp không hợp lệ. Vui lòng chọn tệp có định dạng doc, docx, xls, xlsx, pdf, rar, zip, và định dạng image", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                //     isFlag = false;
                //     return;
                // }
                var size = evt.target.files[i].size;
                if (size / 1024 / 1024 > 16) {
                    this.layoutUtilsService.showActionNotification("Tồn tại tệp không hợp lệ. Vui lòng chọn tệp không được vượt quá 16 MB", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                    isFlag = false;
                    return;
                }
            }
            if (isFlag) {
                this.UploadFileForm(evt);
            }
        }
    }

    UploadFileForm(evt) {
        let ind = 0;
        if (this.AttFile.length > 0) {
            ind = this.AttFile.length;
        }

        if (evt.target.files && evt.target.files[0]) {
            var filesAmount = evt.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                var reader = new FileReader();

                reader.onload = (event: any) => {
                    let base64Str = event.target.result;
                    var metaIdx = base64Str.indexOf(';base64,');
                    base64Str = base64Str.substr(metaIdx + 8);
                    this.AttFile[ind].strBase64 = base64Str;
                    ind++;
                }
                reader.readAsDataURL(evt.target.files[i]);
                this.AttFile.push({
                    filename: evt.target.files[i].name,
                    type: evt.target.files[i].name.split(".")[evt.target.files[i].name.split(".").length - 1],
                    strBase64: '',
                    IsAdd: true,
                    IsDel: false,
                    IsImagePresent: false,
                })
            }
        }
    }
    //=============================Tab dữ liệu=========================
    TenFile1 = "";
    File = "";
    IsShow_Result = false;
    Result = "";
    save_file_Direct(evt: any) {
        let ind = 0;
        if (this.AttFile.length > 0) {
            ind = this.AttFile.length;
        }
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
                const ct = new FileUploadModel();
                ct.strBase64 = this.File;
                ct.filename = this.TenFile;
                ct.IsAdd = true;
                const item = new UpdateFileModel();
                item.id_row = this.DocsID;
                item.values = new Array<FileUploadModel>(ct);
                this.layoutUtilsService.showWaitingDiv();
                
                if (this.DocsID != 0) {
                    this.congViecTheoDuAnService.AddAttTask_Gov(item, this.DocsID).subscribe((res) => {
                        this.layoutUtilsService.OffWaitingDiv();
                        if (res && res.status == 1) {
                            this.LoadWorkDraft(this.data.idDraft);
                        }
                    });
                }
                // else {
                //     if (evt.target.files && evt.target.files[0]) {
                //         var filesAmount = evt.target.files.length;
                //         for (let i = 0; i < filesAmount; i++) {
                //             // var reader = new FileReader();

                //             // reader.onload = (event: any) => {
                //             //     let base64Str = event.target.result;
                //             //     var metaIdx = base64Str.indexOf(';base64,');
                //             //     base64Str = base64Str.substr(metaIdx + 8);
                //             //     this.AttFile[ind].strBase64 = base64Str;
                //             //     ind++;
                //             // }

                //             // reader.readAsDataURL(evt.target.files[i]);

                //             debugger
                //             this.AttFile.push({
                //                 filename: this.TenFile,
                //                 type: evt.target.files[i].name.split(".")[evt.target.files[i].name.split(".").length - 1],
                //                 strBase64: this.File,
                //                 IsAdd: true,
                //                 IsDel: false,
                //                 IsImagePresent: false,
                //             })
                //         }
                //     }
                // }
            }, 100);
        } else {
            this.File = "";
        }
    }

    getIcon(type) {
        let icon = "";
        if (type == "doc" || type == "docx") {
            icon = "./../../../../../assets/media/mime/word.png"
        }
        if (type == "pdf") {
            icon = "./../../../../../assets/media/mime/pdf.png"
        }
        if (type == "rar") {
            icon = "./../../../../../assets/media/mime/text2.png"
        }
        if (type == "zip") {
            icon = "./../../../../../assets/media/mime/text2.png"
        }
        if (type == "jpg") {
            icon = "./../../../../../assets/media/mime/jpg.png"
        }
        if (type == "png") {
            icon = "./../../../../../assets/media/mime/png.png"
        }
        else{
            icon = "./../../../../../assets/media/mime/text2.png"
        }
        return icon;
    }

    deleteFile(file: any) {
        this.AttFile.splice(file, 1);
        this.myInput.nativeElement.value = "";

        if (this.DocsID != 0) {
            this.congViecTheoDuAnService.delete_attachment(file.id_row).subscribe();
        }
        this.changeDetectorRef.detectChanges();
    }

    getHeight() {
        let height = 0;
        height = window.innerHeight - 180;
        return height + "px";
    }

    //typeSave 1-Lưu công việc, 2- lưu nháp
    onSubmit(withBack: boolean = false, typeSave = 1) {
        let isFlag = true;
        //Kiêm tra dữ liệu bắt buộc
        const ele = document.getElementById("txttitle") as HTMLInputElement;
        if (typeSave == 1) {
            if (ele.value.toString().trim() == "") {
                isFlag = false;
                this.layoutUtilsService.showActionNotification('Nhiệm vụ không được bỏ trống', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
                return;
            }
        }

        if (this.idNGNV == "") {
            isFlag = false;
            this.layoutUtilsService.showActionNotification('Vui lòng chọn người giao nhiệm vụ', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
            return;
        }
        const ele2 = document.getElementById("txtsokyhieu") as HTMLInputElement;
        if (ele2.value.toString().trim() == "") {
            isFlag = false;
            this.layoutUtilsService.showActionNotification('Số, ký hiệu văn bản không được bỏ trống', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
            return;
        }
        const ele3 = document.getElementById("txtngayvanban") as HTMLInputElement;
        if (ele3.value.toString().trim() == "") {
            isFlag = false;
            this.layoutUtilsService.showActionNotification('Ngày văn bản không được bỏ trống', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
            return;
        }
        const ele4 = document.getElementById("txttrichyeu") as HTMLInputElement;
        if (ele4.value.toString().trim() == "") {
            isFlag = false;
            this.layoutUtilsService.showActionNotification('Trích yếu văn bản không được bỏ trống', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
            return;
        }

        //Add data nhiệm vụ đang giao đầu tiên vào list
        this.listGiaoCho_Finish = [];
        let _item = {
            id_project_team: +this.idDuAn,
            labelDuAn: this.labelDuAn,
            id_user: this.Assign.length > 0 ? this.Assign[0].id_nv : '',
            title: ele.value.toString(),
            clickup_prioritize: this.priority ? this.priority : undefined,
            deadline: this.selectedDate.endDate ? this.selectedDate.endDate : undefined,
            start_date: this.selectedDate.startDate ? this.selectedDate.startDate : undefined,
            id_user_assign: this.Assign.length > 0 ? this.Assign[0].id_nv : undefined,
        }
        this.listGiaoCho_Finish.push(_item);
        if (this.listGiaoCho.length > 0) {
            if (typeSave == 1) {
                this.listGiaoCho.forEach(element => {
                    if (element.title.toString().trim() == "") {
                        isFlag = false;
                        this.layoutUtilsService.showActionNotification('Nhiệm vụ không được bỏ trống', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
                        return;
                    }
                    if (element.endDate == "" || element.endDate == null) {
                        isFlag = false;
                        let message = "Vui lòng chọn ngày kết thúc của hạn xử lý";
                        this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                        return;
                    }
                })
            }


            this.listGiaoCho.forEach(element => {
                let obj: any;

                if (element.Assign && element.Assign.length > 0) {
                    obj = this.listGiaoCho_Finish.find(x => +x.id_project_team == +element.idDuAn && +x.id_user == +element.Assign[0].id_nv);
                    if (obj) {
                        isFlag = false;
                        let message = "Lỗi dữ liệu giao cho bị trùng";
                        this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                        return;
                    }
                }
                // }else{
                //     obj = this.listGiaoCho_Finish.find(x => +x.id_project_team == +element.idDuAn);
                // }
                let start, deadline, clickup_prioritize;
                if (element.priority) {
                    clickup_prioritize = element.priority;
                }
                if (element.startDate) {
                    start = moment(element.startDate).utc().format('MM/DD/YYYY HH:mm:ss')
                }
                if (element.endDate) {
                    deadline = moment(element.endDate).utc().format('MM/DD/YYYY HH:mm:ss')
                }
                let _itemChild = {
                    id_project_team: element.idDuAn,
                    labelDuAn: element.labelDuAn,
                    id_user: element.Assign.length > 0 ? element.Assign[0].id_nv : '',
                    title: element.title ? element.title : '',
                    clickup_prioritize: clickup_prioritize ? clickup_prioritize : undefined,
                    deadline: deadline ? deadline : undefined,
                    start_date: start ? start : undefined,
                    id_user_assign: element.Assign.length > 0 ? element.Assign[0].id_nv : undefined,
                };
                this.listGiaoCho_Finish.push(_itemChild);


            })
        }
        if (typeSave == 1) {
            if (this.selectedDate.endDate == "" || this.selectedDate.endDate == null) {
                isFlag = false;
                let message = "Vui lòng chọn ngày kết thúc của hạn xử lý";
                this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
                return;
            }
        }

        if (isFlag) {
            const updatedegree = this.prepareCustomer();
            this.InserGovDoc(updatedegree, withBack, typeSave);

        }

    }

    prepareCustomer(): WorkModel {
        const task = new WorkModel();
        let project = [];
        let user = [];
        this.listGiaoCho_Finish.forEach(element => {
            user = [];

            if (element.id_user != "" && element.id_user != null) {
                let _user = {
                    id_user: element.id_user,
                    loai: 1,
                };
                user.push(_user)
            }
            let _project = {
                id_project_team: element.id_project_team,
                Users: user,
                title: element.title,
                clickup_prioritize: element.clickup_prioritize,
                deadline: element.deadline,
                start_date: element.start_date,
                id_user_assign: element.id_user_assign //tạm thời chỉ dùng cho work_draft
            };
            project.push(_project);
        });

        task.Projects = project;
        // const ele = document.getElementById("txttitle") as HTMLInputElement;
        // task.title = ele.value;
        //task.clickup_prioritize = this.priority;

        // const start = moment();
        // if (moment(this.selectedDate.startDate).format('MM/DD/YYYY') != "Invalid date")
        //     task.start_date = moment(this.selectedDate.startDate).utc().format('MM/DD/YYYY HH:mm:ss');
        // if (moment(this.selectedDate.endDate).format('MM/DD/YYYY') != "Invalid date") {
        //     task.deadline = moment(this.selectedDate.endDate).utc().format('MM/DD/YYYY HH:mm:ss');
        //     task.end_date = moment(this.selectedDate.endDate).utc().format('MM/DD/YYYY HH:mm:ss');
        // }

        task.description = this.description_tiny;

        task.Attachments = this.AttFile;

        if (this.data._messageid && this.data._messageid > 0 && this.isTaskChat) {
            task.messageid = this.messageid;
            task.groupid = this.groupid;
        } else {
            task.messageid = 0;
            task.groupid = 0;
        }

        if (this.idLienKet > 0) {
            task.SourceID = this.idLienKet;
            task.IsRelationshipTask = true;
        }

        //Bổ sung thêm 4 field thông tin
        task.Userid_nguoigiao = +this.idNGNV;
        const ele2 = document.getElementById("txtsokyhieu") as HTMLInputElement;
        task.Gov_SoHieuVB = ele2.value;
        const ele3 = document.getElementById("txtngayvanban") as HTMLInputElement;
        task.Gov_NgayVB = moment(ele3.value).utc().format('MM/DD/YYYY HH:mm:ss');
        const ele4 = document.getElementById("txttrichyeu") as HTMLInputElement;
        task.Gov_TrichYeuVB = ele4.value;
        task.typeInsert = 2;
        if (this.DocsID != 0) {
            task.DocsID = this.DocsID;
        }
        return task;
    }
    prepareDraftCustomer(): WorkDraftModel {
        const task = new WorkDraftModel();
        let project = [];
        let user = [];
        this.listGiaoCho_Finish.forEach(element => {
            let _project = {
                id_project_team: element.id_project_team,
                labelDuAn: element.labelDuAn,
                title: element.title,
                clickup_prioritize: element.clickup_prioritize,
                deadline: element.deadline,
                start_date: element.start_date,
                id_user_assign: element.id_user_assign //tạm thời chỉ dùng cho work_draft
            };
            project.push(_project);
        });

        task.Projects = project;
        // const ele = document.getElementById("txttitle") as HTMLInputElement;
        // task.title = ele.value;
        //task.clickup_prioritize = this.priority;

        // const start = moment();
        // if (moment(this.selectedDate.startDate).format('MM/DD/YYYY') != "Invalid date")
        //     task.start_date = moment(this.selectedDate.startDate).utc().format('MM/DD/YYYY HH:mm:ss');
        // if (moment(this.selectedDate.endDate).format('MM/DD/YYYY') != "Invalid date") {
        //     task.deadline = moment(this.selectedDate.endDate).utc().format('MM/DD/YYYY HH:mm:ss');
        //     task.end_date = moment(this.selectedDate.endDate).utc().format('MM/DD/YYYY HH:mm:ss');
        // }

        task.description = this.description_tiny;

        task.Attachments = this.AttFile;
        return task;
    }
    AssignInsert(id_nv, loai) {
        var NV = new UserInfoModel();
        NV.id_user = id_nv;
        NV.loai = loai;
        return NV;
    }

    //type check xem lưu nháp hay k
    InserGovDoc(item, withBack: boolean, typeSave) {
        this.layoutUtilsService.showWaitingDiv();
        this.congViecTheoDuAnService.Insert_Gov_Docs(item).subscribe((res) => {
            this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status === 1) {
                item.DocsID = res.data;

                if (typeSave == 1) {
                    this.CreateTask(item, withBack);
                }
                else {
                    const updatedegree1 = this.prepareDraftCustomer();
                    updatedegree1.DocsID = res.data;
                    this.CreateTaskDraft(updatedegree1, withBack);
                }

            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }
    //type check xem lưu nháp hay k
    UpdateGovDocs(item, withBack: boolean, typeSave) {
        this.layoutUtilsService.showWaitingDiv();
        this.congViecTheoDuAnService.Insert_Gov_Docs(item).subscribe((res) => {
            this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status === 1) {
                item.DocsID = res.data;

                if (typeSave == 1) {
                    this.CreateTask(item, withBack);
                }
                else {
                    this.CreateTaskDraft(item, withBack);
                }

            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }
    CreateTask(val, withBack: boolean) {
        this.layoutUtilsService.showWaitingDiv();
        this.congViecTheoDuAnService.InsertTask_Gov(val).subscribe((res) => {
            this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status === 1) {
                if (withBack == true) {
                    this.dialogRef.close({
                        _item: res.data
                    });
                }
                else {
                    this.AttFile = [];
                    this.description_tiny = "";
                    this.ngOnInit();
                }
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }
    //=========================Xử lý giao diện mới=====================
    listGiaoCho: any[] = [];
    listGiaoCho_Finish: any[] = [];
    // Them() {
    //     let obj = this.listUser.find(x => x.IsOwner);
    //     let item = {
    //         idDuAn: this.idDuAn,
    //         labelDuAn: this.labelDuAn,
    //         Assign: obj ? [obj] : [],
    //         options_assign: this.getOptions_Assign_Dynamic(this.listUser),
    //     };
    //     this.listGiaoCho.push(item);
    // }
    ThemVB() {
        let cssPri = '';
        if (this.priority != 0) {
            cssPri = this.getPriorityVB(this.priority)
        }
        else {
            cssPri = 'far fa-flag';
        }
        const ele = document.getElementById("txttitle") as HTMLInputElement;
        let item = {
            idDuAn: this.idDuAn,
            labelDuAn: this.labelDuAn,
            Assign: this.Assign ? this.Assign : [],
            priority: this.priority ? this.priority : '',
            cssPriority: cssPri,
            title: ele.value.toString(),
            startDate: this.selectedDate.startDate,
            endDate: this.selectedDate.endDate,
            options_assign: this.getOptions_Assign_Dynamic(this.listUser),
        };
        this.listGiaoCho.push(item);
        this.ReSetNhiemVu();
    }
    ReSetNhiemVu() {
        const ele = document.getElementById("txttitle") as HTMLInputElement;
        ele.value = "";
        this.title = "";
        this.Assign = [];
        this.Followers = [];
        this.selectedDate = {
            startDate: '',
            endDate: '',
        }
        this.priority = 0;
    }
    setTitle(data) {
        return data.title;
    }
    updateTitleNV(event, vi) {
        let id = "txttitle_" + vi;
        const ele = document.getElementById(id) as HTMLInputElement;
        if (ele.value.toString().trim() == "") {
            this.layoutUtilsService.showActionNotification('Nhiệm vụ không được bỏ trống', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
            return;
        }
        if (this.listGiaoCho[vi]) {
            this.listGiaoCho[vi].title = ele.value.toString();
        }
    }
    SetPriDynamic(vi, val) {
        if (this.listGiaoCho[vi]) {
            this.listGiaoCho[vi].priority = val;
            this.listGiaoCho[vi].cssPri = this.getPriority(val);
        }
    }
    deleteRow(vi) {

        this.listGiaoCho.splice(vi, 1);
        this.changeDetectorRef.detectChanges();
    }

    ItemSelectedDynamic(val: any, loai, index) {
        if (loai == 1) {
            if (this.listGiaoCho[index])
                var ind = this.listGiaoCho[index].Assign.findIndex(x => x.value == val)
            if (ind < 0) {
                this.listGiaoCho[index].Assign[0] = val;
            }
            else {
                this.listGiaoCho[index].Assign[0] = [];
            }
        }
        this.changeDetectorRef.detectChanges();
    }

    changeDuAnDynamic(item, data, i) {
        data.labelDuAn = item.title;
        data.idDuAn = item.id_row;
        if (this.listGiaoCho[i]) {
            this.listGiaoCho[i].idDuAn = item.id_row;
            this.listGiaoCho[i].labelDuAn = item.title;
        }
        data.Assign = [];
        this.bankFilterCtrlDuAn.setValue("");
        this.LoadListAccountDynamicNew(item.id_row, i);
    }
    LoadListAccountDynamicNew(idDuAn, i) {
        this.weworkService.list_account_gov(idDuAn).subscribe(res => {
            if (res && res.status === 1) {
                this.Assign_dynamic = [];
                let listUser = res.data;
                this.Assign_dynamic.push(listUser[0]);
                if (this.listGiaoCho[i]) {
                    this.listGiaoCho[i].Assign = this.Assign_dynamic;
                    this.listGiaoCho[i].options_assign = this.getOptions_Assign_Dynamic(listUser);
                }
                this.changeDetectorRef.detectChanges();
            };
        });
    }
    LoadListAccountDynacmic(data) {

        const filter: any = {};
        filter.id_project_team = data.idDuAn;
        this.weworkService.list_account(filter).subscribe(res => {
            if (res && res.status === 1) {

                let listUser = res.data;
                // if (!this.roleassign) {//Trương hợp không có quyền chọn người thực hiện
                //     this.id_nv_selected = +localStorage.getItem("idUser");

                //     if (this.id_nv_selected > 0) {
                //         var x = listUser.find(x => x.id_nv == this.id_nv_selected)
                //         if (x) {
                //             data.Assign.push(x);
                //         }
                //     }
                // } else {
                //     data.Assign.push(listUser[0]);
                //     data.options_assign = {
                //         showSearch: true,
                //         keyword: '',
                //         data: listUser,
                //     }
                // }
                data.Assign.push(listUser[0]);
                data.options_assign = {
                    showSearch: true,
                    keyword: '',
                    data: listUser,
                }
                this.changeDetectorRef.detectChanges();
            };

        });
    }

    getOptions_Assign_Dynamic(data) {
        var options_assign: any = {
            showSearch: true,
            keyword: '',
            data: data,
        };
        return options_assign;
    }

    viewdateDynamic() {
        if (this.selectedDate.startDate == '' && this.selectedDate.endDate == '') {
            return ""
        }
        else {
            var start = this.f_convertDate(this.selectedDate.startDate) ? this.f_convertDate(this.selectedDate.startDate) : '...';
            var end = this.f_convertDate(this.selectedDate.endDate) ? this.f_convertDate(this.selectedDate.endDate) : '...';

            return start + ' - ' + end + ' ';
        }
    }
    //=======================Bổ sung chọn người giao việc 07/11/2022=================
    NguoiGiaoViec: any = [];
    options_nguoigiaoviec: any = [];
    listNguoiGiaoViec: any = [];
    labelNGNV: string = "";
    idNGNV: string = "";
    public bankFilterCtrlNGNV: FormControl = new FormControl();
    public filteredBanksNGNV: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    getNguoiGiaoViec() {
        return this.NguoiGiaoViec;
    }
    LoadDataNguoiGiaoViec() {
        this.weworkService.list_gov_acc_join_dept('').subscribe(res => {
            if (res && res.status === 1) {
                this.listNguoiGiaoViec = res.data;
                if (this.listNguoiGiaoViec.length == 0) {
                    let obj = this.listUser.find(x => x.userid == this.UserID);
                    if (obj) {
                        if (!this.data_WorkDraft) {
                            this.labelNGNV = obj.tenchucdanh + " - " + obj.fullname;
                            this.idNGNV = obj.userid;
                        }

                    }
                } else {
                    if (!this.data_WorkDraft) {
                        this.labelNGNV = res.data[0].tenchucdanh + " - " + res.data[0].fullname;
                        this.idNGNV = res.data[0].userid;
                    }

                }
                this.setUpDropSearchNGNV();
                this.changeDetectorRef.detectChanges();
            };

        });
    }

    setUpDropSearchNGNV() {
        this.bankFilterCtrlNGNV.setValue('');
        this.filterBanksNGNV();
        this.bankFilterCtrlNGNV.valueChanges
            .pipe()
            .subscribe(() => {
                this.filterBanksNGNV();
            });
    }

    protected filterBanksNGNV() {
        if (!this.listNguoiGiaoViec) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrlNGNV.value;
        if (!search) {
            this.filteredBanksNGNV.next(this.listNguoiGiaoViec.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanksNGNV.next(
            this.listNguoiGiaoViec.filter(bank => bank.hoten.toLowerCase().indexOf(search) > -1 || bank.tenchucdanh.toLowerCase().indexOf(search) > -1)
        );
    }

    changeNGNV(item) {
        this.labelNGNV = item.tenchucdanh + " - " + item.fullname;
        this.idNGNV = item.userid;
        this.bankFilterCtrlNGNV.setValue("");
    }
    getPriorityVB(id) {

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
    SelectPriDynamic(data, val, vi) {
        var ind = data.priority.findIndex(x => x.value == val)
        if (ind < 0) {
            data.priority = val;
        }
        if (this.listGiaoCho[vi]) {
            this.listGiaoCho[vi].priority = val;
        }
        this.changeDetectorRef.detectChanges();
    }
    viewdateDynamicPri(id) {
        if (this.priority) {
            return ""
        }
        else {
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
    }

    CreateTaskDraft(val: WorkDraftModel, withBack: boolean) {

        this.layoutUtilsService.showWaitingDiv();
        this.congViecTheoDuAnService.InsertTask_Gov_Draft(val).subscribe((res) => {
            this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status === 1) {
                if (withBack == true) {
                    this.dialogRef.close({
                        _item: res.data
                    });
                }
                else {
                    this.AttFile = [];
                    this.description_tiny = "";
                    this.ngOnInit();
                }
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }


    viewdateDynamicVB(data) {
        if (data) {
            if (!data.startDate && !data.endDate) {
                return ""
            }
            else {
                let stringTime = '';
                if (data.startDate) {
                    var start = this.f_convertDate(data.startDate) ? this.f_convertDate(data.startDate) : '...';
                    stringTime += start;
                    if (data.endDate) {
                        var end = this.f_convertDate(data.endDate) ? this.f_convertDate(data.endDate) : '...';
                        stringTime += ' - ' + end + '  ';
                    }
                    else stringTime += ' - ...';

                }
                else {
                    if (data.endDate) {
                        var end = this.f_convertDate(data.endDate) ? this.f_convertDate(data.endDate) : '...';
                        stringTime = '... - ' + end + ' ';
                    }
                }
                return stringTime;

            }
        }
        return ' ... '

    }


    //Load và xử lý Work_Draft

    // Check_Work_Draft() {
    //     this.congViecTheoDuAnService.Check_Work_Draft().subscribe(res => {
    //         if (res && res.status == 1) {
    //             this.XacNhan();
    //         }
    //         else {
    //             this.LoadData();
    //         }
    //     })
    // }

    // XacNhan() {
    //     const _title = this.translate.instant('GeneralKey.sudungbanluutam');
    //     const _description = 'Có bản lưu tạm, Tiếp tục giao nhiệm vụ đã làm trước đó?';
    //     const _waitDesciption = this.translate.instant(
    //         'GeneralKey.dangtai'
    //     );
    //     //const _deleteMessage = this.translate.instant('GeneralKey.xoathanhcong');
    //     const dialogRef = this.layoutUtilsService.deleteElement(
    //         _title,
    //         _description,
    //         _waitDesciption
    //     );
    //     dialogRef.afterClosed().subscribe((res) => {
    //         if (!res) {
    //             this.LoadData();
    //             return;
    //         }
    //         this.LoadWorkDraft();
    //     });
    // }


    LoadWorkDraft(idDraft) {
        debugger
        this.congViecTheoDuAnService.load_Work_Draft(idDraft).subscribe((res) => {
            if (res && res.status === 1) {
                this.Use_Draft = true;
                this.data_WorkDraft = res.data;
                if (this.data_WorkDraft) {

                    this.LoadData();
                    this.SetUpVanBan();
                }
                this.changeDetectorRef.detectChanges();
            }
        });
    }
    SetUpVanBan() {
        this.changeNGNV_VB();

        //=================Lấy dữ liệu cũ để check cập nhật GOV_Docs=================

        // this.txt_sohieuvanbanOld = this.data_WorkDraft[0].Gov_SoHieuVB;
        // this.txt_ngayvanbanOld = this.data_WorkDraft[0].Gov_NgayVB
        // this.txt_idNguoiGiaoOld = this.data_WorkDraft[0].Assignor.userid;
        // this.txt_trichyeuvanbanOld = this.data_WorkDraft[0].Gov_TrichYeuVB;
        // this.Arr_AttachmnetOld = this.data_WorkDraft[0].Attachments;




        //=================Cập nhật field mới================


        this.DocsID = this.data_WorkDraft[0].DocsID;
        let date = new Date(this.data_WorkDraft[0].Gov_NgayVB);
        const ele2 = document.getElementById("txtsokyhieu") as HTMLInputElement;
        ele2.value = this.data_WorkDraft[0].Gov_SoHieuVB;
        const ele3 = document.getElementById("txtngayvanban") as HTMLInputElement;
        ele3.value = this.data_WorkDraft[0].Gov_NgayVB;
        const ele4 = document.getElementById("txttrichyeu") as HTMLInputElement;
        ele4.value = this.data_WorkDraft[0].Gov_TrichYeuVB;
        // if (this.data_WorkDraft[0].Attachments) {
        //     this.AttFile = this.data_WorkDraft[0].Attachments;
        // }

        if (this.data_WorkDraft[0].Project.length > 0) {
            let i = 0;
            this.data_WorkDraft[0].Project.forEach((element, index) => {
                this.data_Ass = [];
                this.data_Ass.push(element.Assign);

                if (index == 1) {
                    const ele = document.getElementById("txttitle") as HTMLInputElement;
                    this.idDuAn = element.idDuAn,
                        this.labelDuAn = element.labelDuAn,
                        this.Assign = this.data_Ass ? this.data_Ass : [],
                        this.priority = element.priority ? element.priority : '',
                        ele.value = element.title,
                        this.selectedDate.startDate = element.startDate,
                        this.selectedDate.endDate = element.endDate
                }
                else {


                    let item = {
                        idDuAn: element.idDuAn,
                        labelDuAn: element.labelDuAn,
                        Assign: this.data_Ass ? this.data_Ass : [],
                        priority: element.priority ? element.priority : '',
                        cssPriority: this.getPriority(element.priority),
                        title: element.title,
                        startDate: element.startDate,
                        endDate: element.endDate,
                        options_assign: {
                            showSearch: true,
                            keyword: '',
                            data: element.options_assign
                        }
                    }
                    this.listGiaoCho.push(item)
                }

            })
        }
        this.AttFile = this.data_WorkDraft[0].Attachments;
        this.description_tiny = this.data_WorkDraft[0].description;
        this.changeDetectorRef.detectChanges();
    }

    changeNGNV_VB() {
        this.labelNGNV = this.data_WorkDraft[0].Assignor.jobtitle + ' - ' + this.data_WorkDraft[0].Assignor.hoten;
        this.idNGNV = this.data_WorkDraft[0].Assignor.userid.toString();
        this.bankFilterCtrlNGNV.setValue("");
    }

    //End

}