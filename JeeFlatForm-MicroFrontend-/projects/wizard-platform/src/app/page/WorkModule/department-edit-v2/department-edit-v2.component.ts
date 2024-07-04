import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

import {
  Component,
  OnInit,
  Inject,
  HostListener,
  ChangeDetectorRef,
} from "@angular/core";

import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ReplaySubject, BehaviorSubject } from "rxjs";
import { DepartmentModel, DepartmentTagModel, GroupStatusModel, StatusDynamicModel } from "../view-config-status/view-config-status.component";
import { PopoverContentComponent } from "ngx-smart-popover";
import { DepartmentModelV2, DepartmentRoleUserModel, DepartmentViewModel, GroupModel, GroupStatusModelTemp, StatusModel1, UserModel } from "../model/danh-muc-du-an.model";
import { LayoutUtilsService, MessageType } from "projects/wizard-platform/src/modules/crud/utils/layout-utils.service";
import { WorkwizardChungService } from "../work.service";
import { QueryParamsModel } from "../../models/query-models/query-params.model";
import { TemplateCenterComponent } from "../template-center/template-center.component";
import { StatusModel } from "../status-dynamic-dialog/status-dynamic-dialog.component";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";

@Component({
  selector: "kt-department-edit-v2",
  templateUrl: "./department-edit-v2.component.html",
  styleUrls: ["./department-edit-v2.component.scss"],
})
export class DepartmentEditV2Component implements OnInit {
  step = 1;
  item: DepartmentModel;
  dataParent: DepartmentModel;
  oldItem: DepartmentModel;
  itemFormGroup: FormGroup = new FormGroup({});
  hasFormErrors: boolean = false;
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;
  // @ViewChild("focusInput", { static: true }) focusInput: ElementRef;
  disabledBtn: boolean = false;
  IsEdit: boolean;
  //====================Người Áp dụng====================
  public bankFilterCtrlAD: FormControl = new FormControl();
  public filteredBanksAD: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  //====================Người theo dõi===================
  public bankFilterCtrlTD: FormControl = new FormControl();
  public filteredBanksTD: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public datatree: BehaviorSubject<any[]> = new BehaviorSubject([]);
  title: string = "";
  selectedNode: BehaviorSubject<any> = new BehaviorSubject([]);
  ID_Struct: string = "";
  Id_parent: string = "";
  options: any = {};
  id_project_team: number;
  admins: any[] = [];
  members: any[] = [];
  IsAdmin: boolean = false;
  myPopover: PopoverContentComponent;
  selected: any[] = [];
  listUser: any[] = [];
  CommentTemp: string = "";
  listChiTiet: any[] = [];
  list_Owners: any[] = [];
  list_Assign: any[] = [];
  litsTemplateDemo: any = [];
  listSpaceStatus: any = [];
  IsDataStaff_HR = false;
  ReUpdated = false;
  UserId: any = 0;
  listSTT: any = [];
  listTag: any = [];
  listTagAdd: any = [];
  listTagDelete: any = [];
  listDefaultView: any = [];
  IsUpdate: any;
  IsSystem:boolean=false;
  IsUpdate_Tag: any;
  check_tags: boolean = false;
  formData: any;
  UseParentTemplate = false;
  isSpaceStatus = false;
  id_department:number=0;
  _isSystem: boolean = false;
  public defaultColors: string[] = [
    "#848E9E",
    // 'rgb(187, 181, 181)',
    "rgb(29, 126, 236)",
    "rgb(250, 162, 140)",
    "rgb(14, 201, 204)",
    "rgb(11, 165, 11)",
    "rgb(123, 58, 245)",
    "rgb(238, 177, 8)",
    "rgb(236, 100, 27)",
    "rgb(124, 212, 8)",
    "rgb(240, 56, 102)",
    "rgb(255, 0, 0)",
    "rgb(0, 0, 0)",
    "rgb(255, 0, 255)",
    "rgb(255,0,0)",
    "rgb(0,255,0)",
    "rgb(0,0,255)",
    "rgb(255,255,0)",
    "rgb(0,255,255)",
  ];

  isComplete = false;
  _listSTTHoatDong: StatusModel1[] = [];
  _listSTTMoitao: StatusModel1[] = [];
  _listSTTDeadline: StatusModel1[] = [];
  _listSTTFinal: StatusModel1[] = [];
  constructor(
    public dialogRef: MatDialogRef<DepartmentEditV2Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    public _WorkwizardChungService: WorkwizardChungService,
    public dialog: MatDialog) {
    this.itemFormGroup = this.fb.group({
      title: [""],
      dept_name: [""],
    });
  }

  /** LOAD DATA */
  ngOnInit() {
    this.dialogRef.disableClose = true;
    this.IsUpdate = this.data.IsUpdate;
    if(this.data.isSystem) this.IsSystem=true;
    this.IsUpdate_Tag = this.data.IsUpdate_Tag;
    // console.log('this.dataaaaaaaaaaaaaaaaaaa-edit-dep', this.data)
    // console.log('this.IsUpdate_TagIsUpdate_TagIsUpdate_Tag', this.IsUpdate_Tag)
    if (this.IsUpdate) {
      this.step = 6;
      this.isComplete = true;
      // this.TempSelected = this.data.StatusGroupID;
    }
    if (this.IsUpdate_Tag) {
      this.check_tags = true;
      this.step = 4;
      this.isComplete = true;
    }
    this._WorkwizardChungService.getthamso();
    //get các giá trị khởi tạo
    this.UserId = this._WorkwizardChungService.getAuthFromLocalStorage().user.customData["jee-account"].userID;
    //------------------
    this.title = this.translate.instant("JeeWork.choncocautochuc") + "";
    this.item = this.data._item;
    if (this.item.RowID > 0) {
      this.isSpaceStatus = true;
      this.id_department=this.item.RowID;
    }
    this.options = this.getOptions();
    this._WorkwizardChungService.list_account_2023({}).subscribe((res) => {
      if (res && res.status === 1) {
        this.listUser = res.data;
        if (!this.IsUpdate) {
          var index = this.listUser.find((x) => x.id_nv == this.UserId);
          if (index) {
            index.type = 1;
            this.list_Owners.push(index);
          }
        }
      } else {
      }
      this.options = this.getOptions();
    });

    this._WorkwizardChungService.list_default_view({}).subscribe((res) => {
      if (res && res.status === 1) {
        this.listDefaultView = res.data;
        if (this.item.RowID > 0) {
          this.LoadDeparment();
          this.viewLoading = true;
          this.changeDetectorRefs.detectChanges();
        } else {
          this.getListRole();
          if (+this.item.ParentID > 0) {
            this.LoadDataParent();
          }
          this.viewLoading = false;
          this.createForm();

          this.listDefaultView.forEach((x) => {
            if (x.is_default) {
              x.isCheck = true;
            }
            else{
              x.isCheck=false;
            }
          });
        }
      }
    });

    this.LoadDataTemp();
    // this.ListStatusDynamic();
    this.IsEdit = this.data._IsEdit;

  }
  ngAfterContentChecked(): void {
    this.changeDetectorRefs.detectChanges();
  }
  ListRole;
  getListRole() {
    this.ListRole = []
    this._WorkwizardChungService.GetRoleList('TypePermit', 2).subscribe((res) => {
      if (res && res.status == 1) {
        this.ListRole = this.ListRole.concat(res.data);
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  LoadDeparment() {
    this._WorkwizardChungService.DeptDetail(this.item.RowID).subscribe((res) => {
      if (res && res.status == 1) {
        this.item = res.data;
        this.item.RowID = res.data.id_row;
        this.list_Owners = res.data.Owners;
        this.ListRole = res.data.UserRole;
        this.LoadDetail(res.data);
        if (+this.item.ParentID > 0) {
          this.LoadDataParent();
        }
        this.createForm();
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  LoadDataParent() {
    
  }

  LoadParentStatus() {
    var x = this.litsTemplateDemo.find(
      (x) => x.id_row == this.dataParent.TemplateID
    );
    if (x) {
      this.listSTT = x.status;
      this.GetAllListSTT();
    }
  }

  LoadListSTT(check) {
    this.listSTT = [];
    let x;
    if (!this.TempSelected) {
      x = this.litsTemplateDemo[0];
    } else {
      x = this.litsTemplateDemo.find((x) => x.id_row == this.TempSelected);
    }
    if (x) {
      this._isSystem = x.IsSystem;
      if (check) {
        this.listSTT=x.ListStatus;
      }else{
        this.listSTT = x.Status;
      }
      this.GetAllListSTT();
    }
  }

  LoadDetail(item) {
    // if (
    //   item.Template[0] &&
    //   item.Template[0].TemplateID &&
    //   this.IsInListCustom(item.Template[0].TemplateID)                 load tempalte
    // ) {
    //   this.TempSelected = item.Template[0].TemplateID;
    // }

    // item.Owners.forEach(element => {
    //   this.ItemSelected(element,1);
    // });
    item.UserRole.forEach(element => {
      element.List_User.forEach(element1 => {
        this.ItemSelected(element1, element.RowID);
      });
    });

    this.listTagAdd = this.listTagAdd.concat(item.ListTag);

    this.TempSelected = item.StatusGroupID ? item.StatusGroupID : this.litsTemplateDemo[0].id_row;
    this.LoadListSTT(false);


    // this.LoadListSTT();
    if (this.item.RowID == 0) {
      this.LoadListSTT(false);
    }
    this.listDefaultView.forEach((x) => {
      var isCheck = item.DefaultView.find((view) => view.Type == x.id_row);

      // if(isCheck){
      //   x.isCheck = true;
      // }
      if (isCheck || x.is_default) {
        x.isCheck = true;
      } else {
        x.isCheck = false;
      }
    });
  }

  loadListTagCustom() {
    // if (this.item.RowID > 0) {
    this._WorkwizardChungService.ListTagDepartment_2023().subscribe((res) => {
      if (res && res.status === 1) {
        this.listTag = res.data;
        this.listAllTag = res.data;
      }
    })
    // }

  }

  LoadDataTemp() {
    //load lại
    // let filter = {keys: 'type',vals: 2};
    // let model = new QueryParamsModel(filter);

    // do không dùng được QueryParamsModel(truyền bị lỗi truy xuất) - nên truyền thẳng

    let filter: any = {};
    filter.type = 2;
    if (this.IsUpdate) {
      filter.type = 4;
      filter.id_department = this.item.RowID;
    }


    let model = new QueryParamsModel(
      filter
    )

    this._WorkwizardChungService.ListStatusById_2023(model).subscribe((res) => {
      if (res && res.status === 1) {
        this.litsTemplateDemo = res.data;
        // this._groupStatus = res.data;
        if (this.TempSelected == 0 || !this.IsInListCustom(this.TempSelected)) {
          this.TempSelected = this.litsTemplateDemo[0].id_row;

        }
        if (this.item.RowID == 0) {
          this.LoadListSTT(false);
        }
      }
      else {
        this.layoutUtilsService.showError(res.error.message);
      }
      this.changeDetectorRefs.detectChanges();
    });

    this.loadListTagCustom();
  }

  IsInListCustom(idtemplate) {
    if (this.litsTemplateDemo?.length > 0) {
      const index = this.litsTemplateDemo.findIndex(
        (x) => x.id_row == idtemplate
      );
      if (index >= 0) {
        return true;
      }
    }
    return false;
  }

  clickOnUser = (event: Event) => {
    // Prevent opening anchors the default way
    event.preventDefault();
    const anchor = event.target as HTMLAnchorElement;

    this.layoutUtilsService.showInfo("user clicked");
  };

  isCompleteStep1() {
    if (this.itemFormGroup) {
      const controls = this.itemFormGroup.controls;
      if (this.itemFormGroup.invalid) {
        Object.keys(controls).forEach((controlName) =>
          controls[controlName].markAsTouched()
        );
        this.hasFormErrors = true;
        return true;
      }
      if (this.itemFormGroup.controls["title"].value.trim() == "") {
        return true;
      }
    }

    return false;
  }




  createForm() {
    this.itemFormGroup = this.fb.group({
      title: [this.item.title, Validators.required],
      dept_name: [this.item.id_cocau],
    });
    this.formData = this.fb.group({
      title: [this.item.title, Validators.required],
      dept_name: [this.item.id_cocau],
    });
    // this.itemFormGroup.controls["title"].markAsTouched();
    // this.itemFormGroup.controls["dept_name"].markAsTouched();
  }

  /** UI */
  getTitle(): string {
    let result = this.translate.instant("department.allgood");
    if (!this.item || !this.item.id_row) {
      return result;
    }
    result = this.translate.instant("JeeWork.chinhsua") + ' ' + this._WorkwizardChungService.ts_phongban;
    if (this.item.ParentID > 0) {
      result = this.translate.instant("JeeWork.chinhsua") + ' ' + this._WorkwizardChungService.ts_thumuc;
    }
    return result;
  }

  /** ACTIONS */
  prepare(): DepartmentModelV2 {
    const controls = this.itemFormGroup.controls;
    const _item = new DepartmentModelV2();
    _item.clear();
    _item.id_row = this.item.id_row;
    _item.ParentID = this.item.ParentID ? this.item.ParentID : 0;
    _item.id_cocau = controls["dept_name"].value
      ? controls["dept_name"].value
      : 0;
    _item.title = controls["title"].value.trim();
    _item.roleUser = [];

    this.list_Owners.map((item, index) => {
      const ct = new DepartmentRoleUserModel();
      if (item.id_row == undefined) {
        item.id_row = 0;
      }

      ct.roleID = item.type;
      ct.id = this.item.id_row ? this.item.id_row : 0;
      ct.userID = item.id_nv;
      ct.type = 0;

      _item.roleUser.push(ct);
    });

    _item.IsDataStaff_HR = this.IsDataStaff_HR;
    _item.ReUpdated = this.ReUpdated;
    _item.DefaultView = [];
    this.listDefaultView
      .filter((x) => x.isCheck == true)
      .map((item, index) => {
        const ct = new DepartmentViewModel();
        if (item.id_row == undefined) {
          item.id_row = 0;
        }
        ct.id_row = item.id_row;
        ct.id_department = this.item.id_row ? this.item.id_row : 0;
        ct.viewid = item.view_id ? item.view_id : 0;
        ct.is_default = item.is_default;
        _item.DefaultView.push(ct);
      });
    _item.TemplateID = this.TempSelected;
    if (this.UseParentTemplate && +this.item.ParentID > 0) {
      _item.TemplateID = this.dataParent.TemplateID;
    }

    this.listSTT.forEach((element, index) => {
      const item = new StatusDynamicModel();
      item.clear();
      item.Id_row = element.id_row ? element.id_row : 0;
      item.StatusName = element.title;
      item.Color = element.color ? element.color : "";

      item.Description = element.Description ? element.Description : "";
      item.Id_project_team = element.id_project_team
        ? element.id_project_team
        : 0;
      item.id_department = element.id_department
        ? element.id_department
        : this.item.RowID;
      item.IsDefault = element.IsDefault ? element.IsDefault : false;
      //   item.Follower = status.Follower;
      item.Type = element.Type ? element.Type : "2";
      item.Position = index;
      _item.status.push(item);
    });

    // this.listTag.forEach(element => {
    //   const item = new DepartmentTagModel()
    //   item.clear();
    //   item.id_row = element.id_row ? element.id_row : 0;
    //   item.id_department = this.item.id_row ? this.item.id_row : 0;
    //   item.name = element.name ? element.name : "";
    //   item.color_tag = element.color_tag ? element.color_tag : "";
    //   _item.department_tag.push(item);
    // });

    // _item.lstTagAdd = this.listTagAdd;
    this.listTagAdd.forEach(element => {
      const item = new DepartmentTagModel()
      item.clear();
      item.id_row = element.rowid ? element.rowid : 0;
      item.id_department = this.item.id_row ? this.item.id_row : 0;
      item.name = element.title ? element.title : "";
      item.color_tag = element.color ? element.color : "";
      _item.department_tag.push(item);
    });
    _item.lstTagDelete = this.listTagDelete;

    let index = this.litsTemplateDemo.findIndex(x => x.id_row == this.TempSelected);
    _item.groupStatus.title = this.litsTemplateDemo[index].title;
    _item.groupStatus.id_row = this.TempSelected;
    return _item;
  }

  onSubmit(withBack: boolean = false) {
    this.hasFormErrors = false;
    this.loadingAfterSubmit = false;
    const controls = this.itemFormGroup.controls;
    /* check form */
    if (this.itemFormGroup.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }
    const updatedegree = this.prepare();
    if (updatedegree.roleUser.length == 0) {
      this.layoutUtilsService.showError("Người sở hữu là bắt buộc");
      return;
    }
    if (updatedegree.id_row > 0) {
      this.Update(updatedegree, withBack);
    } else {
      this.Create(updatedegree, withBack);
    }
  }

  _groupStatusSelected: GroupStatusModel;
  _status;
  // chonSuDung(id_row){
  //   if(id_row <= 0){
  //      let index = this._groupStatus.findIndex(x => x.id_row == id_row);
  //      if(index != -1){
  //       let t = this._groupStatus[index];
  //       let model = new GroupStatusModel();
  //       model.clear();
  //       model.title = t.title;
  //       this._groupStatusSelected = model;
  //       this._status = t.Status;
  //      }
  //   }
  // }

  AddTemplate() {
    const item = "Danh sách giao diện template";
    const dialogRef = this.dialog.open(TemplateCenterComponent, {
      data: { item },
      width: "50vw",
      height: "95vh",
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      } else {
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  Update(_item: DepartmentModelV2, withBack: boolean) {
    this.loadingAfterSubmit = true;
    this.viewLoading = true;
    this.disabledBtn = true;
    this.layoutUtilsService.showWaitingDiv();
    this._WorkwizardChungService.UpdateDept(_item).subscribe((res) => {
      /* Server loading imitation. Remove this on real code */
      this.layoutUtilsService.OffWaitingDiv();
      this.disabledBtn = false;
      if (res && res.status === 1) {
        if (withBack == true) {
          this.dialogRef.close({
            _item,
          });
        } else {
          this.ngOnInit();
          const _messageType = this.translate.instant(
            "JeeWork.capnhatthanhcong"
          );
          this.layoutUtilsService
            .showActionNotification(
              _messageType,
              MessageType.Update,
              4000,
              true,
              false
            )
            .afterDismissed()
            .subscribe((tt) => { });
          // this.focusInput.nativeElement.focus();
        }
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          "top",
          0
        );
      }
      this.changeDetectorRefs.detectChanges();
    });
  }

  Create(_item: DepartmentModelV2, withBack: boolean) {
    this.loadingAfterSubmit = true;
    this.disabledBtn = true;
    this.layoutUtilsService.showWaitingDiv();
    this._WorkwizardChungService.InsertDept(_item).subscribe((res) => {
      this.layoutUtilsService.OffWaitingDiv();
      this.disabledBtn = false;
      if (res && res.status === 1) {
        if (withBack == true) {
          this.dialogRef.close({
            _item,
          });
        } else {
          this.dialogRef.close();
        }
      } else {
        this.viewLoading = false;
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          "top",
          0
        );
      }
      this.changeDetectorRefs.detectChanges();
    });
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  close() {
    const _title = this.translate.instant("JeeWork.xacnhanthoat");
    const _description = this.translate.instant("JeeWork.bancomuonthoat");
    const _waitDesciption = this.translate.instant("JeeWork.dangdong");
    const _deleteMessage = this.translate.instant(
      "JeeWork.thaydoithanhcong"
    );
    this.dialogRef.close();
    // if (this.isChangeData()) {
    //   const dialogRef = this.layoutUtilsService.deleteElement(
    //     _title,
    //     _description,
    //     _waitDesciption
    //   );
    //   dialogRef.afterClosed().subscribe((res) => {
    //     if (!res) {
    //       return;
    //     }
    //     this.dialogRef.close();
    //   });
    // } else {
    //   this.dialogRef.close();
    // }
  }

  isChangeData() {
    const val1 = this.prepare();
    if (val1.title != this.item.title) {
      return true;
    }
    if (this.item.RowID > 0 && val1.roleUser != this.item.Owners) {
      return true;
    }
    return false;
  }

  reset() {
    this.item = Object.assign({}, this.item);
    this.createForm();
    this.hasFormErrors = false;
    this.itemFormGroup.markAsPristine();
    this.itemFormGroup.markAsUntouched();
    this.itemFormGroup.updateValueAndValidity();
  }

  getKeyword() {
    let i = this.CommentTemp.lastIndexOf("@");
    if (i >= 0) {
      let temp = this.CommentTemp.slice(i);
      if (temp.includes(" ")) {
        return "";
      }
      return this.CommentTemp.slice(i);
    }
    return "";
  }

  getOptions() {
    var options: any = {
      showSearch: true,
      keyword: this.getKeyword(),
      data: this.listUser.filter(
        (x) => this.selected.findIndex((y) => x.id_nv == y.id_nv) < 0
      ),
    };
    return options;
  }

  onSearchChange($event) {
    this.CommentTemp = (<HTMLInputElement>(
      document.getElementById("InputUser")
    )).value;

    if (this.selected.length > 0) {
      var reg = /@\w*(\.[A-Za-z]\w*)|\@[A-Za-z]\w*/gm;
      var match = this.CommentTemp.match(reg);
      if (match != null && match.length > 0) {
        let arr = match.map((x) => x);
        this.selected = this.selected.filter((x) =>
          arr.includes("@" + x.username)
        );
      } else {
        this.selected = [];
      }
    }
    this.options = this.getOptions();
    if (this.options.keyword) {
      let el = $event.currentTarget;
      let rect = el.getBoundingClientRect();
      this.myPopover.show();
      this.changeDetectorRefs.detectChanges();
    }
  }

  click($event, vi = -1) {
    this.myPopover.hide();
  }

  ItemSelected(data, type = 1, isAdmin: boolean = false) {
    if (data.id_nv == this.UserId && isAdmin == true) {
      return;
    }
    var index = this.list_Owners.findIndex((x) => x.id_nv == data.id_nv && x.type == type);

    if (index >= 0) {
      if (type == this.list_Owners[index].type) {
        this.list_Owners.splice(index, 1);
      } else {
        // this.list_Owners[index].type = type;
        var dataUser = new UserModel();
        dataUser.clear();
        dataUser.Email = data.Email;
        dataUser.hoten = data.hoten;
        dataUser.id_nv = data.id_nv;
        dataUser.image = data.image;
        dataUser.mobile = data.mobile;
        dataUser.username = data.username;
        dataUser.type = type
        this.list_Owners.unshift(dataUser);
      }
    } else {
      // data.type = type;
      // this.list_Owners.push(data);
      var dataUser = new UserModel();
      dataUser.clear();
      dataUser.Email = data.Email;
      dataUser.hoten = data.hoten;
      dataUser.id_nv = data.id_nv;
      dataUser.image = data.image;
      dataUser.mobile = data.mobile;
      dataUser.username = data.username;
      dataUser.type = type
      this.list_Owners.unshift(dataUser);
    }





    // if (type==1) {
    // 	if (data.id_nv == this.UserId) {
    // 		return;
    // 	}
    // 	var index = this.list_Owners.findIndex(
    // 		(x) => x.id_nv == data.id_nv
    // 	);
    // 	if (index >= 0) {
    // 		this.list_Owners.splice(index, 1);
    // 	} else {
    // 		this.list_Owners.push(data);
    // 	}
    // } else {
    // 	var index = this.list_Assign.findIndex(
    // 		(x) => x.id_nv == data.id_nv
    // 	);
    // 	if (index >= 0) {
    // 		this.list_Assign.splice(index, 1);
    // 	} else {
    // 		this.list_Assign.push(data);
    // 	}
    // }
  }


  getlist_Create() {
    var x = this.list_Owners.filter((x) => x.type == 3);
    if (x) {
      return x;
    }
    return x;
  }

  getlist_Assign() {
    var x = this.list_Owners.filter((x) => x.type == 2);
    if (x) {
      return x;
    }
    return x;
  }

  getlist_Owners() {
    var x = this.list_Owners.filter((x) => x.type == 1);
    if (x) {
      return x;
    }
    return x;
  }
  getlist_Users(type, isAdmin: boolean = false) {
    // lấy id của group để làm type bind động
    var x = this.list_Owners.filter((x) => x.type == type || (x.type == 1 && isAdmin == true));
    if (x) {
      let y = x.findIndex(x => x.type == 1);
      if (y != -1) {
        x[y].type = type;
      }
      return x;
    }
    return x;
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  Next() {
    if (this.IsUpdate_Tag) {

    }
    else if (this.isComplete) {
      this.step = 6;
    } else {
      this.step += 1;
    }
  }
  listAllTag;
  getListTag() {
    this.listAllTag = this.listTag.concat(this.listTagAdd);
  }
  Pre() {
    if (this.isComplete) {
      this.step = 6;
    } else {
      this.step -= 1;
    }
  }

  viewDetail(val) {
    this.step = val;
  }

  idfocus = 0;

  sttFocus(value) {
    this.idfocus = value;
  }


  sttFocusout(value, status) {
    this.idfocus = 0;
    const index = this.listSTT.findIndex(
      (x) => x.StatusName.trim() === value.trim()
    );
    if (index >= 0 && value.trim() != status.StatusName.trim()) {
      this.layoutUtilsService.showError("Trạng thái đã tồn tại");
      status.StatusName = status.StatusName + " ";
      return;
    }
    if (!value) {
      status.StatusName = status.StatusName + " ";
      // this.LoadListSTT();
      return;
    }
    status.StatusName = value;
    // const _item = new UpdateQuickModel();
    // _item.clear();
    // _item.id_row = status.id_row;
    // _item.columname = 'StatusName';
    // _item.values = value;
    // _item.id_template = this.TempSelected;
    // this.UpdateQuick(_item);
  }

  idTagFocus = 0;
  tagFocus(value) {
    this.idTagFocus = value;
  }
  tagFocusout(value, tag) {

    this.idTagFocus = 0;
    const index = this.listTag.findIndex(
      (x) => x.name.trim() === value.trim()
    );
    if (index >= 0 && value.trim() != tag.name.trim()) {
      this.layoutUtilsService.showError("Nhãn đã tồn tại");
      tag.name = tag.name + " ";
      return;
    }
    if (!value) {
      tag.name = tag.name + " ";
      // this.LoadListSTT();
      return;
    }
    tag.name = value;
  }

  ChangeColor(value, status) {
    status.color = value;
    // const _item = new UpdateQuickModel();
    // _item.clear();
    // _item.id_row = status.id_row;
    // _item.columname = 'color';
    // _item.values = value;
    // _item.id_template = this.TempSelected;
    // this.UpdateQuick(_item);
  }

  ChangeTagColor(value, tag) {
    tag.color = value;
    // const _item = new UpdateQuickModel();
    // _item.clear();
    // _item.id_row = status.id_row;
    // _item.columname = 'color';
    // _item.values = value;
    // _item.id_template = this.TempSelected;
    // this.UpdateQuick(_item);
  }

  // ChangeTemplate(id) {
  //   this.TempSelected = id;
  //   this.LoadListSTT();
  // }
  ChangeTemplate(item) {
    this.TempSelected = item.id_row;
    this._isSystem = item.IsSystem;
    this.LoadListSTT(true);
  }
  selectStatus(item){
    // 
    this.TempSelected = item.id_row;
    this._isSystem = item.IsSystem;
    this.LoadListSTT(true);
  }
  refreshTemplate(item){
    this.litsTemplateDemo=item;
    this.LoadListSTT(true);
  }

  isAddTemplate = false;
  updateTemp = 0;
  isAddStatus = false;
  isAddStatusNew = false;
  isAddStatusDone = false;
  isAddStatusDeadline = false;
  isAddTag = false;
  TempSelected = 0;

  addTemplate() {
    this.isAddTemplate = true;
  }

  // tạo nhóm trạng thái mới
  _groupStatus: GroupStatusModelTemp[] = [];
  focusOutTemp(value, temp, isUpdate = false) {
    if (isUpdate) {
      this.updateTemp = 0;
      if (!value) {
        return;
      }
      let index = this.litsTemplateDemo.findIndex(x => x.id_row == temp.id_row);
      if (index != -1) {
        this.litsTemplateDemo[index].title = value;
      }

      // temp.title = value;
      // let _item = new GroupStatusModelTemp();
      // _item.clear();
      // _item.id_row = temp.id_row;
      // _item.title = value;
      // _item.id_project = 0;
      // this._groupStatus.push(_item);
      // const _item = new UpdateQuickModel();
      // _item.clear();
      // _item.id_row = temp.id_row;
      // _item.columname = "title";
      // _item.values = value;
      // _item.istemplate = true;
      // this.UpdateQuick(_item);
    } else {
      this.isAddTemplate = false;
      if (!value) {
        return;
      }
      // let _item = new GroupStatusModelTemp();
      // _item.clear();
      // _item.id_row = Math.floor(Date.now() / 1000000000) * -1; //tránh trùng lặp id               // lấy id âm để tránh đụng độ với id có sẵn
      // _item.title = value;
      // _item.Status = [];
      // // _item.id_project = 0;
      // // this._groupStatus.push(_item);
      // this.litsTemplateDemo.push(_item);
      // this.changeDetectorRefs.detectChanges();

      const _item = new GroupModel();
      _item.clear();
      _item.id_row = 0;
      _item.title = value;
      _item.id = this.data._item.id_project_team;
      _item.Categorytype = 0;
      _item.IdGroupCopy = this.TempSelected;
      this.InserGroup(_item);
    }
  }


  InserGroup(item) {
    this._WorkwizardChungService.InsertGroup(item).subscribe((res) => {
      if (res && res.status == 1) {
        // let message = 'Cập nhật thành công';
        // this._update = true;
        // this.layoutUtilsService.showInfo(message);
          this.LoadDataTemp();
      } else {
        this.layoutUtilsService.showError(res.error.message);
      }
    });
  }

  UpdateQuick(item) {

  }

  Delete_Templete(id, isDelStatus) {
    const _title = this.translate.instant('JeeWork.xoa');
    const _description = this.translate.instant(
      'JeeWork.bancochacchanmuonxoakhong'
    );
    const _waitDesciption = this.translate.instant(
      'JeeWork.dulieudangduocxoa'
    );
    const _deleteMessage = this.translate.instant('JeeWork.xoathanhcong');
    const dialogRef = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDesciption
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }

      if (id <= 0) {
        let index = this.litsTemplateDemo.findIndex(x => x.id_row == id)
        if (index != -1) {
          this.litsTemplateDemo.splice(index, 1);
          return;
        }
      }

      if (id.id_row <= 0) {
        let index = this.litsTemplateDemo.findIndex(x => x.id_row == this.TempSelected)
        if (index != -1) {
          let i = this.litsTemplateDemo[index].Status.findIndex(x => x.id_row == id.id_row);
          if (i != -1) {
            this.litsTemplateDemo[index].Status.splice(i, 1);
            return;
          }
        }
      }


    });
  }
  Delete_Status(stt) {
    const index = this.listSTT.findIndex(
      (x) => x.StatusName === stt.StatusName
    );
    if (index >= 0) {
      this.listSTT.splice(index, 1);
    }
  }
  Delete_Tag(tag) {
    const index = this.listTagAdd.findIndex(
      (x) => x.title === tag.title
    );
    if (index >= 0) {
      this.listTagDelete.push(this.listTagAdd[index]);
      this.listTagAdd.splice(index, 1);
    }
    // this.listTagDelete.push(tag);                vì không cho xóa tag hệ thống. nên chỗ này ko cần

    // const index = this.listTag.findIndex(
    //   (x) => x.name === tag.name
    // );
    // if (index >= 0) {
    //   this.listTag.splice(index, 1);
    // }
    // this.listTagDelete.push(tag);
  }

  focusOutSTT(value, type) {
    //1: moi tao, 2: dang hoat dong, 4:hoan thanh
    if (type == 1) {
      this.isAddStatusNew = false;
    } else if (type == 2) {
      this.isAddStatus = false;
    } else if (type == 3) {
      this.isAddStatusDeadline = false;
    } else {
      this.isAddStatusDone = false;
    }

    if (!value) {
      return;
    }
    const index = this.listSTT.findIndex((x) => x.title === value);
    if (index >= 0) {
      this.layoutUtilsService.showError("Trạng thái đã tồn tại");
      return;
    }

    let _item = {

      id_row: Date.now() * -1,
      title: value,
      color: "rgb(255, 0, 0)",
      id_project_team: 0,
      id_department: this.item.RowID,
      Type: type,
    };
    this.listSTT.push(_item);
    // const _item = new UpdateQuickModel();
    // _item.clear();
    // _item.id_row = 0;
    // _item.columname = 'StatusName';
    // _item.values = value;
    // _item.istemplate = false;
    // _item.id_template = this.TempSelected;
    // this.UpdateQuick(_item);
  }

  setData(){
    let _itemtemp = {id_row: 0,id_project_team:0, id_template:this.TempSelected,id_department:this.id_department};
    let isSystem=this.IsSystem?true: false;
    
    for (let index = 0; index < this.litsTemplateDemo.length; index++) {
      const element = this.litsTemplateDemo[index];
      element.ListStatus=element.Status;
    }
    let data={item:this.litsTemplateDemo,_item:_itemtemp,hethong:isSystem}
    return data;
  }


  focusOutTag(value) {
    this.isAddTag = false;
    if (!value) {
      return;
    }
    const index = this.listTag.findIndex((x) => x.title === value);
    const index1 = this.listTagAdd.findIndex((x) => x.title === value);

    if (index >= 0 || index1 >= 0) {
      this.layoutUtilsService.showError("Nhãn đã tồn tại");
      return;
    }

    let _item = {
      rowid: 0,
      title: value,
      color: this.defaultColors[this.getRandomInt(0, this.defaultColors.length)],
      id_department: this.item.RowID,
    };
    // this.listTag.push(_item);
    this.listTagAdd.push(_item);
    this.getListTag();
    // const _item = new UpdateQuickModel();
    // _item.clear();
    // _item.id_row = 0;
    // _item.columname = 'StatusName';
    // _item.values = value;
    // _item.istemplate = false;
    // _item.id_template = this.TempSelected;
    // this.UpdateQuick(_item);
  }

  ListStatusDynamic() {
    if (this.item.RowID > 0) {
      this.layoutUtilsService.showWaitingDiv();
      this._WorkwizardChungService
        .ListStatusDynamic(this.item.RowID, true)
        .subscribe((res) => {
          this.layoutUtilsService.OffWaitingDiv();
          if (res && res.status == 1) {
            this.listSpaceStatus = res.data;
            this.listSpaceStatus.forEach((element) => {
              element.newvalue = 0;
            });
            this.LoadSpaceStatus();
            this.changeDetectorRefs.detectChanges();
          }
        });
    }
  }

  LoadSpaceStatus() {
    if (this.listSpaceStatus && this.isSpaceStatus) {
      // this.listSTT = this.listStatus;
      const listTemp = [];
      this.listSpaceStatus.forEach((element) => {
        let item = {
          IsDefault: element.isdefault,
          Type: element.Type,
          Position: element.position,
          StatusName: element.statusname,
          color: element.color,
          description: element.Description,
          id_project_team: element.id_project_team,
          id_department: element.id_department,
          id_row: element.id_row,
          SL_Tasks: element.SL_Tasks,
        };
        listTemp.push(item);
      });
      this.listSTT = listTemp;
      this.changeDetectorRefs.detectChanges();
    }
  }

  listSTTDeadline() {
    return this.listSTT.filter((x) => x.Type === 3);
  }
  listSTTHoatdong() {
    return this.listSTT.filter((x) => x.Type === 2);
  }

  listSTTMoitao() {
    return this.listSTT.filter((x) => x.Type === 1);
  }

  listSTTFinal() {
    return this.listSTT.filter((x) => x.Type === 4);
  }

  SubmitData() {
    const controls = this.itemFormGroup.controls;
    if (this.itemFormGroup.invalid) {
      Object.keys(controls).forEach((controlName) =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }
    const updatedegree = this.prepare();
    // return;
    if (updatedegree.id_row > 0) {
      this.Update(updatedegree, true);
    } else {
      this.Create(updatedegree, true);
    }
  }

  //add Tag Department theo customer_tags
  Submit_Tags() {

  }

  /*
    Đổi vị trí
  */
  drop(event: CdkDragDrop<StatusModel[]>, list) {
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    this.listSTT = this._listSTTMoitao.concat(this._listSTTHoatDong, this._listSTTFinal);
    // moveItemInArray(
    //   this.listSTTHoatdong(),
    //   event.previousIndex,
    //   event.currentIndex
    // );
    // const previous = this.listSTTHoatdong()[event.previousIndex];
    // const curent = this.listSTTHoatdong()[event.currentIndex];
    // // this.listSTTHoatdong()[event.previousIndex] = curent;
    // // this.listSTTHoatdong()[event.currentIndex] = previous;
    // // const positon = new PositionModel();
    // // positon.id_row_from = previous.id_row;
    // // positon.position_from = previous.Position;
    // // positon.id_row_to = curent.id_row;
    // // positon.position_to = curent.Position;
    // // positon.columnname = this.data.columnname;
    // // positon.id_columnname = this.data.id_row;
    // // this.dropPosition(positon);
    // this.MoveItem2(curent, previous);
    // // if (event.previousContainer === event.container) {
    // //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    // //   } else {
    // //     transferArrayItem(event.previousContainer.data,
    // //       event.container.data,
    // //       event.previousIndex,
    // //       event.currentIndex);
    // //   }
  }
  GetAllListSTT() {
    this._listSTTHoatDong = this.GetListSTT(2);
    this._listSTTMoitao = this.GetListSTT(1);
    this._listSTTDeadline = this.GetListSTT(3);
    this._listSTTFinal = this.GetListSTT(4);
  }
  GetListSTT(type) {
    let array: StatusModel1[] = [];
    let t = this.listSTT.filter(x => x.Type == type);
    t.forEach(element => {
      let n: StatusModel1 = new StatusModel1();
      n.clear();
      n.StatusName = element.StatusName;
      n.Type = element.Type;
      n.color = element.color;
      n.id_row = element.id_row;
      n.title = element.title;
      n.IsDefault = element.IsDefault;
      n.Position = element.Position;
      array.push(n);
    });
    array.sort((a, b) => a.Position - b.Position);
    return array;
  }
  dropListMoiTao(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.listSTTMoitao(),
      event.previousIndex,
      event.currentIndex
    );
    const previous = this.listSTTMoitao()[event.previousIndex];
    const curent = this.listSTTMoitao()[event.currentIndex];
    // this.listSTTHoatdong()[event.previousIndex] = curent;
    // this.listSTTHoatdong()[event.currentIndex] = previous;
    // const positon = new PositionModel();
    // positon.id_row_from = previous.id_row;
    // positon.position_from = previous.Position;
    // positon.id_row_to = curent.id_row;
    // positon.position_to = curent.Position;
    // positon.columnname = this.data.columnname;
    // positon.id_columnname = this.data.id_row;
    // this.dropPosition(positon);
    this.MoveItem2(curent, previous);
    // if (event.previousContainer === event.container) {
    //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    //   } else {
    //     transferArrayItem(event.previousContainer.data,
    //       event.container.data,
    //       event.previousIndex,
    //       event.currentIndex);
    //   }
  }

  dropListFinal(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.listSTTMoitao(),
      event.previousIndex,
      event.currentIndex
    );
    const previous = this.listSTTFinal()[event.previousIndex];
    const curent = this.listSTTFinal()[event.currentIndex];
    // this.listSTTHoatdong()[event.previousIndex] = curent;
    // this.listSTTHoatdong()[event.currentIndex] = previous;
    // const positon = new PositionModel();
    // positon.id_row_from = previous.id_row;
    // positon.position_from = previous.Position;
    // positon.id_row_to = curent.id_row;
    // positon.position_to = curent.Position;
    // positon.columnname = this.data.columnname;
    // positon.id_columnname = this.data.id_row;
    // this.dropPosition(positon);
    this.MoveItem2(curent, previous);
    // if (event.previousContainer === event.container) {
    //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    //   } else {
    //     transferArrayItem(event.previousContainer.data,
    //       event.container.data,
    //       event.previousIndex,
    //       event.currentIndex);
    //   }
  }

  MoveItem(curent, previous) {
    const position_from = previous.Position;
    const position_to = curent.Position;
    previous.Position = position_to;
    curent.Position = position_from;
    const indexcurent = this.listSTT.findIndex(
      (x) => x.StatusName.trim() == curent.StatusName.trim()
    );
    const indexprevious = this.listSTT.findIndex(
      (x) => x.StatusName.trim() == previous.StatusName.trim()
    );
    if (indexcurent >= 0 && indexprevious >= 0) {
      this.listSTT[indexcurent] = previous;
      this.listSTT[indexprevious] = curent;
    }
  }
  MoveItem2(curent, previous) {
    //curent. vi tri bat dau keo chuot
    //previous: vi tri keo chuot xuong
    const position_from = previous.Position;
    const position_to = curent.Position;
    const indexcurent = this.listSTT.findIndex(
      (x) => x.StatusName.trim() == curent.StatusName.trim()
    );
    const indexprevious = this.listSTT.findIndex(
      (x) => x.StatusName.trim() == previous.StatusName.trim()
    );

    //Keo tu tren keo xuong
    if (position_to > position_from) {
      var length = position_to - position_from;
      length += indexprevious;
      var newPosition = this.listSTT[indexprevious].Position;
      var keepPostition;
      for (var i = indexprevious; i < length; i++) {
        keepPostition = this.listSTT[i + 1].Position;
        this.listSTT[i + 1].Position = newPosition;
        newPosition = keepPostition;
        var c = this.listSTT[i + 1].Position;
        this.listSTT[i] = this.listSTT[i + 1];
      }
      previous.Position = position_to;
      if (indexcurent >= 0) {
        this.listSTT[indexcurent] = previous;
      }
      this.listSTT.forEach(element => {
      });
    }
    //Keo tu duoi keo len
    else {
      var length = position_from - position_to;
      length += indexcurent;
      var keep1 = this.listSTT[indexcurent];
      var keep2;
      for (var i = indexcurent; i < length; i++) {

        keep2 = this.listSTT[i + 1];
        keep1.Position = this.listSTT[i + 1].Position;
        this.listSTT[i + 1] = keep1;
        keep1 = keep2;
      }
      previous.Position = position_to;
      if (indexcurent >= 0) {
        this.listSTT[indexcurent] = previous;
      }
      this.listSTT.forEach(element => {
      });
    }
  }
  
  
  /*
    End đổi vị trí
  */
  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
  }

  @HostListener("document:keydown", ["$event"])
  onKeydownHandler1(event: KeyboardEvent) {
    if (event.keyCode == 27) {
      //phím ESC
    }
  }
  check(ListRole){
    if (ListRole.length>2) {
      return false;
    }
    return true;
  }
}
