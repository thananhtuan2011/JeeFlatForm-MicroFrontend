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
import { tinyMCE } from "../../component/Jee-Work/tinyMCE";
import { UserInfoModel, WorkModel } from "../../component/Jee-Work/jee-work.model";
import { LayoutUtilsService, MessageType } from "projects/jeework-v1/src/modules/crud/utils/layout-utils.service";
import { HttpUtilsService } from "projects/jeework-v1/src/modules/crud/utils/http-utils.service";
import { formatsNew,quillConfigNew } from "../../editor/Quill_config";

@Component({
    selector: 'app-cong-viec-theo-du-an-popup',
    templateUrl: './cong-viec-theo-du-an-popup.component.html',
})
export class CongViecTheoDuAnPopupComponent implements OnInit {
    quillConfig = quillConfigNew;
    formats = formatsNew;
    editorStyles = {
      'min-height': '200px',
      'max-height': '200px',
      height: '100%',
      'font-size': '12pt',
      'overflow-y': 'auto',
      border: 'none',
    };

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
    //===(09/02/2023)====Thay đổi tiện ích tiny -> quill=================
    public editorStyles1 = {
        'min-height': '400px',
        'max-height': '400px',
        'height': '100%',
        'font-size': '12pt',
        'overflow-y': 'auto',
        'padding-bottom': '3%',
    };
    btnSave: boolean = false; //Chặn trường hợp click nhiều lần lưu popup công việc
    constructor(public dialogRef: MatDialogRef<CongViecTheoDuAnPopupComponent>,
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
        //Xem lại code phần dòng 225
    }
    ngOnInit(): void {
        this.UserID = this.httpUtils.getUserID();
        this.tinyMCE = tinyMCE;
        this.quillConfig = quillConfigNew;
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
            this.description_tiny = this.data._message;
        }
    }

    LoadDataDuAn() {
        this.congViecTheoDuAnService.listDuAn().subscribe(res => {
            if (res && res.status == 1) {
                if (res.data.length > 0) {
                    this.listDuAn = res.data.filter(x => x.locked == false);
                    if (this.type == "4") {
                        let obj = this.listDuAn.find(x => +x.id_row == +this.idDuAn);
                        if (obj) {
                            this.labelDuAn = obj.title_full;
                            if (obj.is_use_template) {
                                this.description_tiny = obj.template_description;
                            } else {
                                if (this.data._messageid && this.data._messageid > 0) {
                                    this.description_tiny = this.data._message
                                }
                                else {
                                    this.description_tiny = "";
                                }
                            }
                        }
                    } else {
                        this.idDuAn = this.listDuAn[0].id_row;
                        this.labelDuAn = this.listDuAn[0].title_full;
                        if (this.listDuAn[0].is_use_template) {
                            this.description_tiny = this.listDuAn[0].template_description;
                        } else {

                            if (this.data._messageid && this.data._messageid > 0) {
                                this.description_tiny = this.data._message
                            }
                            else {
                                this.description_tiny = "";
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
        this.roleassign = this.CheckRoles(4);
        this.rolefollower = this.CheckRoles(14);
        this.roleprioritize = this.CheckRoleskeypermit('clickup_prioritize');
        this.roledeadline = this.CheckRoles(10);
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
        this.LoadListAccount();
        this.menuServices.GetRoleWeWork("" + this.UserID).subscribe((res) => {
            if (res && res.status == 1) {

                // this.list_role = res.data.dataRole;
                this.list_role = res.data.dataRole ? res.data.dataRole : [];
                this.IsAdminGroup = res.data.IsAdminGroup;
                //================Các biến cần xét quyền===========
                this.getRoles();
                this.LoadListAccount();
            }
        });
    }

    listUser: any[];
    LoadListAccount() {
        const filter: any = {};
        filter.id_project_team = this.idDuAn;
        this.weworkService.list_account(filter).subscribe(res => {
            if (res && res.status === 1) {
                this.listUser = res.data;
                //Xử lý cho phần công việc liên quan đến chat 12/08/2022
                //Nếu có id chat thì chỉ chọn user theo id, ngược lại tạo bình thường
                if (this.data._messageid && this.data._messageid > 0) {
                    this.Assign = [];
                    this.Assign.push(this.data._itemid);
                    // add người" Followers là người tạo
                    // const dt = this.authService.getAuthFromLocalStorage();
                    // let userflowchat = {
                    //     Email: "",
                    //     hoten: dt['user']['customData']['personalInfo']['Fullname'],
                    //     id_nv: dt['user']['customData']['jee-account']['userID'],
                    //     image: dt['user']['customData']['personalInfo']['Avatar'],
                    //     mobile: dt['user']['customData']['personalInfo']['Phonenumber'],
                    //     tenchucdanh: dt['user']['customData']['personalInfo']['Jobtitle'],
                    //     username: dt.user.username
                    // }
                    // if (this.data._itemid.id_nv != dt['user']['customData']['jee-account']['userID']) {
                    //     this.Followers = [];
                    //     this.Followers.push(userflowchat);
                    // }
                } else {
                    if (!this.roleassign) {
                        this.id_nv_selected = +localStorage.getItem("idUser");
                    }
                    if (this.id_nv_selected > 0) {
                        var x = this.listUser.find(x => x.id_nv == this.id_nv_selected)
                        if (x) {
                            this.Assign.push(x);
                        }
                    }
                }
                this.options_assign = this.getOptions_Assign();
                this.changeDetectorRef.detectChanges();
            };

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
        this.title = "";
        this.Assign = [];
        this.Followers = [];
        this.selectedDate = {
            startDate: '',
            endDate: '',
        }
        this.priority = 0;
        this.listTagChoose = [];
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
        this.labelDuAn = item.title_full;
        this.idDuAn = item.id_row;
        this.bankFilterCtrlDuAn.setValue("");
        if (item.is_use_template) {
            this.description_tiny = item.template_description;
        } else {
            if (this.data._messageid && this.data._messageid > 0) {
                this.description_tiny = this.data._message
            }
            else {
            }
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
        else {
            var index = this.Followers.findIndex(x => x.id_nv == val.id_nv)
            if (index < 0) {
                this.Followers.push(val);

            } else {
                this.Followers.splice(index, 1);
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

    //======================Xử lý chon tags=================================
    listTagChoose: any[] = [];
    ReloadDatasTag(event) {
        if (event.title == 'delete') {
            let ind = this.listTagChoose.findIndex(x => x.id_row == event.id_row);
            this.listTagChoose.splice(ind, 1);
        } else {
            let ind = this.listTagChoose.findIndex(x => x.id_row == event.id_row);
            if (ind < 0) {
                this.listTagChoose.push(event);
            } else {
                this.listTagChoose.splice(ind, 1);
            }
        }
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
        return icon;
    }

    deleteFile(file: any) {
        this.AttFile.splice(file, 1);
        this.myInput.nativeElement.value = "";
        this.changeDetectorRef.detectChanges();
    }

    getHeight() {
        let height = 0;
        height = window.innerHeight - 180;
        return height + "px";
    }

    onSubmit(withBack: boolean = false) {
        const ele = document.getElementById("txttitle") as HTMLInputElement;
        if (ele.value.toString().trim() == "") {
            this.layoutUtilsService.showActionNotification('Tên công việc không được bỏ trống', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
            return;
        }
        const updatedegree = this.prepareCustomer();
        this.CreateTask(updatedegree, withBack);
    }

    prepareCustomer(): WorkModel {
        const task = new WorkModel();
        const ele = document.getElementById("txttitle") as HTMLInputElement;
        task.title = ele.value;
        let data_Users = [];
        task.Users = [];
        this.Assign.forEach(element => {
            var assign = this.AssignInsert(element.id_nv, 1);
            data_Users.push(assign);
        });

        this.Followers.forEach(element => {
            var follower = this.AssignInsert(element.id_nv, 2);
            data_Users.push(follower);
        });
        task.Users = data_Users;
        task.urgent = this.priority;
        this.listTagChoose.map((item, index) => {
            let listTag = [];
            let _item = {
                id_row: 0,
                id_work: 0,
                id_tag: item.id_row,
            }
            listTag.push(_item);
            task.Tags = listTag;
        })

        task.estimates = this.estimates;
        const start = moment();
        if (moment(this.selectedDate.startDate).format('MM/DD/YYYY') != "Invalid date")
            task.start_date = moment(this.selectedDate.startDate).utc().format('MM/DD/YYYY HH:mm:ss');
        if (moment(this.selectedDate.endDate).format('MM/DD/YYYY') != "Invalid date") {
            task.deadline = moment(this.selectedDate.endDate).utc().format('MM/DD/YYYY HH:mm:ss');
            task.end_date = moment(this.selectedDate.endDate).utc().format('MM/DD/YYYY HH:mm:ss');
        }
        task.id_project_team = +this.idDuAn;
        task.description = this.description_tiny;
        task.Attachments = this.AttFile;
        if (this.data._messageid && this.data._messageid > 0 && this.isTaskChat) {
            task.messageid = this.messageid;
            task.groupid = this.groupid;
        } else {
            task.messageid = 0;
            task.groupid = 0;
        }
        return task;
    }

    AssignInsert(id_nv, loai) {
        var NV = new UserInfoModel();
        NV.id_user = id_nv;
        NV.loai = loai;
        return NV;
    }

    CreateTask(val, withBack: boolean) {
        // this.layoutUtilsService.showWaitingDiv();
        this.btnSave = true;
        this.congViecTheoDuAnService.InsertTask(val).subscribe((res) => {
            this.btnSave = false;
            // this.layoutUtilsService.OffWaitingDiv();
            if (res && res.status === 1) {
                if (withBack == true) {
                    this.dialogRef.close({
                        _item: res.data
                    });

                }
                else {
                    this.AttFile = [];
                    this.description_tiny = "";
                    this.ResetData();
                }
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }
}