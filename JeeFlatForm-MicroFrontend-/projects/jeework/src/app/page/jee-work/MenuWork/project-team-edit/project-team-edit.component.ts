import { Component, OnInit, Inject, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject } from 'rxjs';
import { PopoverContentComponent } from 'ngx-smart-popover';
import { ProjectsTeamService } from '../bao-cao/services/jee-work.service';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { QueryParamsModel } from '../../models/query-models/query-params.model';
import { TemplateCenterModel, ViewConfigStatusComponent } from '../view-config-status/view-config-status.component';
import { BaseModel } from '../../models/_base.model';
import { DanhMucChungService } from '../../services/danhmuc.service';

@Component({
	selector: 'app-project-team-edit',
	templateUrl: './project-team-edit.component.html',
	styleUrls: ['./project-team-edit.component.scss']
})
export class ProjectTeamEditComponent implements OnInit {
	isLoadding:boolean=false;
	id_department: any;
	isShow: boolean = true;
	item: ProjectTeamModelV2;
	oldItem: ProjectTeamModel
	itemForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	// @ViewChild("focusInput", { static: true }) focusInput: ElementRef;
	disabledBtn: boolean = false;
	IsEdit: boolean;
	IsProject: boolean;
	id_project_team: number = 0;
	title: string = '';
	Id_parent: string = '';
	listUser: any[] = [];
	listChecked: any[] = [];
	listRoleUser: any[] = [];
	listUserAdmin: any[] = [];
	listCheck_owner: any[] = [];
	listGroupStatus: any[] = [];
	listRole: any[] = [];
	listTemplate: any[] = [];
	filter: any = {};
	itemsAsObjects = [{ id: 0, name: 'Angular', readonly: true }, { id: 1, name: 'React' }];
	colorCtr: AbstractControl = new FormControl(null);
	tendapb: string = '';
	mota: string = '';
	public filtereproject: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	public filtereTemplate: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	public projectFilterCtrl: FormControl = new FormControl();
	public TemplateFilterCtrl: FormControl = new FormControl();
	listdepartment: any[] = [];
	@ViewChild('follower', { static: true }) myPopover: PopoverContentComponent;
	@ViewChild('Assign', { static: true }) myPopover_Assign: PopoverContentComponent;
	selected: any[] = [];
	selected_adminProject: any[] = [];
	id_dep_default: string = '0';
	@ViewChild('hiddenText', { static: true }) textEl: ElementRef;
	@ViewChild('hiddenText_Assign', { static: true }) text_Assign: ElementRef;
	// ListFollower: string = '';
	// list_follower: any[] = [];
	// list_Assign: any[] = [];
	options: any = {};
	_color: string = '';
	//_Follower: string = '';
	//_Assign: string = '';
	accordionclose: boolean = true;
	isChangeDept = true;
	IsChangeUser = false;
	// @ViewChild(MatAccordion, { static: true }) accordion: MatAccordion;
	@ViewChild(MatAccordion) accordion: MatAccordion;
	//icon
	icon: any = {};
	UserId: any = 0;
	id_dep: any;
	_firstGroupNotAdmin = 0;
	IsEditDVG: boolean = true;
	isQuickChange:boolean=false;
	position:number=0;

	constructor(public dialogRef: MatDialogRef<ProjectTeamEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		public dialog: MatDialog,
		private changeDetectorRefs: ChangeDetectorRef,
		private _service: ProjectsTeamService,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		public _DanhMucChungService: DanhMucChungService,
		) {

		if(this.data.isQuickChange!=undefined){
			this.isQuickChange = this.data.isQuickChange;
		}
	}
	/** LOAD DATA */
	ngOnInit() {
		this._DanhMucChungService.getthamso();
		this.isLoadding=true;
		this.UserId = this._DanhMucChungService.getAuthFromLocalStorage().user.customData["jee-account"].userID;
		this.dialogRef.disableClose = true;
		this.title = this.translate.instant("GeneralKey.choncocautochuc") + '';
		this.item = this.data._item;
		this.id_project_team = this.data._item.id_row;
		this.IsEdit = this.data._IsEdit;
		if (this.data._item.IsEditDVG != undefined)
			this.IsEditDVG = this.data._item.IsEditDVG;
		this.IsProject = this.data.is_project;
		this.id_department = this.item.id_department;
		this.loadaccount();
		const filter: any = {};
		filter.id_department = this.item.id_department;

		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
		this.loadListRole(queryParams);
		if (this.item.id_row) {
			this.isShow = false;
		}
		if (this.IsProject) {
			this.tendapb = this.translate.instant("projects.tenduan") + '';
			this.mota = this.translate.instant("projects.motangangonveduan") + '';
		}
		else {
			this.tendapb = this.translate.instant("projects.phongban") + '';
			this.mota = this.translate.instant("projects.motangangonvephongban") + '';
		}
		if (+this.item.id_department > 0 && this.id_project_team > 0) {
			this.isChangeDept = false;
		} else {
			this.isChangeDept = true;
		}

		this._service.lite_department().subscribe(res => {
			this.disabledBtn = false;
			if (res && res.status === 1) {
				this.listdepartment = res.data;
				this.id_dep_default = this.item.id_department;
				if (!this.item.id_row) {
					this.id_dep_default = this.item.id_department;
					this.itemForm.controls['id_project_team'].setValue(this.item.id_department);
					this.BindUserDepartment(this.itemForm.controls['id_project_team'].value);
				}
				this.loadGroupStatus();
				this.SearchProject();
				this.changeDetectorRefs.detectChanges();
			};
		});


		this._service.get_template(queryParams).subscribe(res => {
			if (res && res.status === 1) {
				this.listTemplate = res.data;
				this.SearchTemplate();
				this.changeDetectorRefs.detectChanges();
			};
		});
		if (this.item.id_row > 0) {
			this.viewLoading = true;
			this._service.Project_Detail(this.item.id_row).subscribe(res => {
				if (res && res.status == 1) {
					this.item = res.data;
					if (this.item.Users == undefined)
						this.item.Users = this.item.Users;
					this.itemForm.controls["statusgroup"].setValue(this.item.status);
					this.selected_adminProject = this.item.Users;
					this.selected = this.item.RoleUser;
					this._selected_old = this.selected;
					this.item.RoleUser.forEach(element => {
						var index_role = this.listRole.findIndex(x => x.RowID == element.RoleID);						
						if (index_role >= 0) {
							this.listRole[index_role].lstUser.push(element);
							if (this.listRole[index_role].RoleName.includes("Đơn vị giao nhiệm vụ") && !this.IsEditDVG) 
								this.listRole[index_role].isEdit = false;
						}
					})
					this.createForm();
					this.isLoadding=false;
					this.changeDetectorRefs.detectChanges();
				}
				else
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
			});
		} 
		this.createForm();
	}
	loadListRole(queryParams) {
		this._service.findRoleListProject(queryParams).subscribe(res => {
			if (res && res.status === 1) {
				this.listRole = res.data;	
				this.listRole.forEach(x => x.isEdit = true);			
				this.changeDetectorRefs.detectChanges();
			};
		});
	}
	loadaccount() {
		this.options = {};
		this.selected = [];
		const filter: any = {};
		filter.id_department = this.id_department;
		this._service.list_account_customer().subscribe(res => {
			this.disabledBtn = false;
			if (res && res.status === 1) {
				this.listUser = res.data;
				this.options = this.getOptions();

				this.changeDetectorRefs.detectChanges();
			};
		});
	}
	loadGroupStatus() {
		const filter: any = {};
		if (this.itemForm.controls['id_project_team'].value && this.id_project_team != 0) {
			filter.id_department = this.itemForm.controls['id_project_team'].value;
			filter.type = 3;
			filter.id_project_team = this.id_project_team;
		}
		else {
			if (this.id_project_team > 0) {
				filter.id_project_team = this.id_project_team;
			}
			filter.id_department = this.id_dep_default;
			filter.type = 1;
		}


		const queryParams1 = new QueryParamsModel(
			filter,
			'',
			'',
			1,
			50,
			true
		);

		this._service.ListGroupStatus(queryParams1).subscribe(res => {
			if (res && res.status == 1) {
				this.listGroupStatus = res.data;
				// this.itemForm.controls['statusgroup'].setValue(this.listGroupStatus[0].id_row);
				this.changeDetectorRefs.detectChanges();
			}
		})
	}
	getStatus() {
		if (this.itemForm.controls["statusgroup"].valid) {
			let id_row = this.itemForm.controls["statusgroup"].value;
			let index = this.listGroupStatus.findIndex(x => x.id_row == id_row);
			if (index >= 0) {

				return this.listGroupStatus[index].Status;
			}
		}
		return [];
	}
	viewStatus(listGroupStatus) {
		const dialogRef = this.dialog.open(ViewConfigStatusComponent, {
			data: { listItem: listGroupStatus, selected: this.item.status },
			minWidth: "800px",
			minHeight: "400px",
			panelClass:['sky-padding-0'],
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (res) {
				this.ngOnInit();
			}
		});
	}
	createForm() {
		this.icon = {};
		let t = this.item.status == '1' ? '' : this.item.status;
		if (this.item.icon)
			this.icon.src = this.item.icon;
		else {
			this.icon.src = "https://img.icons8.com/fluent/48/000000/add-image.png";
		}
		this.itemForm = this.fb.group({
			id_project_team: [this.item.id_department == '' ? '' : Number(this.item.id_department), [Validators.required]],
			title: ['' + this.item.title, [Validators.required]],
			description: [this.item.description],
			statusgroup: [t, [Validators.required]],
			TemplateID: [this.item.NotifyTemplateID, [Validators.required]],
			position:[this.item.Position?this.item.Position:0,[Validators.required,Validators.pattern('^[0-9]\\d*$')]],
		});
		this.itemForm.controls["id_project_team"].markAsTouched();
		this.itemForm.controls["title"].markAsTouched();
		this.itemForm.controls["statusgroup"].markAsTouched();
		this.itemForm.controls["TemplateID"].markAsTouched();
		this.itemForm.controls["position"].markAsTouched();
	}
	collapse() {
		if (this.accordionclose)
			this.accordion.openAll();
		else
			this.accordion.closeAll();
		this.accordionclose = !this.accordionclose;
	}
	//build
	Selected_Color(event): any {
		this._color = event.value;
		this._color = event;
	}
	f_convertDateTime(date: string) {
		var componentsDateTime = date.split("/");
		var date = componentsDateTime[0];
		var month = componentsDateTime[1];
		var year = componentsDateTime[2];
		var formatConvert = year + "-" + month + "-" + date + "T00:00:00.0000000";
		return new Date(formatConvert);
	}
	f_convertDate(p_Val: any) {
		if (p_Val == null)
			return '1/1/0001';
		let a = p_Val === "" ? new Date() : new Date(p_Val);
		return a.getFullYear() + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + ("0" + (a.getDate())).slice(-2);
	}
	getKeyword() {
		let i = this.listUser.lastIndexOf('@');
		if (i >= 0) {
			let temp = this.listUser.slice(i);
			if (temp.includes(' '))
				return '';
			return this.listUser.slice(i);
		}
		return '';
	}
	getOptions() {
		var options: any = {
			showSearch: true,
			keyword: this.getKeyword(),
			data: this.listUser.filter(x => this.selected.findIndex(y => x.id_nv == y.id_nv) < 0),
		};
		return options;
	}

	click($event, vi = -1) {

		this.myPopover.hide();
	}

	ItemSelected(data, role) {
		// 
		data.UserID = data.UserID ? data.UserID : data.id_nv;

		let user = new RoleUserModelv2();
		user.clear();
		user.RoleID = role.RowID;
		user.UserID = data.id_nv ? data.id_nv : data.UserID;
		user.hoten = data.hoten;
		user.image = data.image;
		user.tenchucdanh = data.tenchucdanh;
		user.username = data.username;
		var index = this.selected.findIndex(
			(x) => (x.UserID == user.UserID && x.RoleID == role.RowID)
		);
		this.IsChangeUser = true;

		if (index >= 0) {
			this.selected.splice(index, 1);
		}
		else {
			this.selected.unshift(user);
		}
		this._selected_old = this.selected;
		var index_role = this.listRole.findIndex(
			(x) => (x.RowID == role.RowID)
		);
		if (index_role>= 0) {
			var index_ref = this.listRole[index_role].lstUser.findIndex(
				(x) => (x.UserID == user.UserID)
			);
			if (index_ref >= 0) {
				this.listRole[index_role].lstUser.splice(index_ref, 1);
			}
			else {
				this.listRole[index_role].lstUser.unshift(user);
			}
		}
	}

	getUserByRole(role) {
		let list = this.selected.filter(x => x.RoleID == role.RowID || (x.RoleID == 0 && role.IsAdmin == true));
		if (list.length > 0) {
			let t = this.selected.findIndex(x => x.RoleID == 0); // tìm user đăng nhập sửa RoleID theo RowID đã load từ api
			if (t != -1) {
				list[t].RoleID = role.RowID;
			}
		}
		return list;
	}


	click_Assign($event, vi = -1) {
		this.myPopover_Assign.hide();
	}

	SearchProject() {
		this.projectFilterCtrl.setValue('');
		this.filterProject();
		this.projectFilterCtrl.valueChanges
			.pipe()
			.subscribe(() => {
				this.filterProject();
			});
	}
	SearchTemplate() {
		this.TemplateFilterCtrl.setValue('');
		this.filterTemplate();
		this.TemplateFilterCtrl.valueChanges
			.pipe()
			.subscribe(() => {
				this.filterTemplate();
			});
	}
	protected filterProject() {
		if (!this.listdepartment) {
			return;
		}
		let search = this.projectFilterCtrl.value;
		if (!search) {
			this.filtereproject.next(this.listdepartment.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filtereproject.next(
			this.listdepartment.filter(proj => this._service.toNonAccentVietnamese(proj.Title).toLowerCase().indexOf(this._service.toNonAccentVietnamese(search)) > -1)
		);
	}
	protected filterTemplate() {
		if (!this.listTemplate) {
			return;
		}
		let search = this.TemplateFilterCtrl.value;
		if (!search) {
			this.filtereTemplate.next(this.listTemplate.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filtereTemplate.next(
			this.listTemplate.filter(proj => proj.title.toLowerCase().indexOf(search) > -1)
		);
	}


	/** UI */
	getTitle(): string {
		let result = this.translate.instant('GeneralKey.themmoi');
		if (!this.item || !this.item.id_row) {
			return result;
		}
		result = this.translate.instant('GeneralKey.chinhsua');
		return result;
	}

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		const controls = this.itemForm.controls;
		/* check form */
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			this.hasFormErrors = true;
			return;
		}
		const updatedegree = this.prepare();
		if (updatedegree.id_row > 0) {
			this.Update(updatedegree, withBack);
		} else {
			this.Create(updatedegree, withBack);
		}
	}
	/** ACTIONS */
	prepare(): ProjectTeamModelV2 {
		this.listRoleUser = [];
		this.listUserAdmin = [];
		const controls = this.itemForm.controls;
		const _item = new ProjectTeamModelV2();
		_item.id_row = this.item.id_row;
		if (+this.item.id_department == -1) {
			_item.id_department = '' + this.item.id_department;
			_item.projectParentId = this.item.projectParentId;
			_item.projectParent = this.item.projectParent;
		} else {
			_item.id_department = controls['id_project_team'].value;
		}
		_item.title = controls['title'].value;
		_item.description = controls['description'].value;
		_item.is_project = this.IsProject;
		_item.statusGroup = controls['statusgroup'].value;
		_item.NotifyTemplateID = controls['TemplateID'].value;
		_item.position=Number(controls['position'].value);
		if (this.icon.strBase64) {
			_item.icon = this.icon;
		}
		this.selected.map((item, index) => {
			const model = new RoleUserModel();
			model.RoleID = item.RoleID;
			model.UserID = item.UserID ? item.UserID : item.id_nv;
			model.id = 0;
			model.type = 3;
			this.listRoleUser.push(model);
		});
		_item.RoleUser = this.listRoleUser;
		// this.selected_adminProject.map((item, index) => {
		// 	const model = new UserModelv2();
		// 	model.clear();
		// 	model.UserID = item.UserID;
		// 	model.Role = 1;
		// 	this.listUserAdmin.push(model);
		// });
		// _item.Users = this.listUserAdmin;
		return _item;
	}
	filterConfiguration(): any {
		const filter: any = {};
		filter.TypePermit = 3;
		filter.ProjectID = this.id_project_team;
		return filter;
	}
	Update(_item: ProjectTeamModelV2, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.disabledBtn = true;
		// this.layoutUtilsService.showWaitingDiv();
		this._service.UpdateProjectTeam2(_item).subscribe(res => {
			this.disabledBtn = false;
			// this.layoutUtilsService.OffWaitingDiv();
			if (res && res.status === 1) {
				this.dialogRef.close({
					_item
				});
				const _messageType = this.translate.instant('GeneralKey.capnhatthanhcong');
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	_listUserDepartment;
	_selected_old = [];
	BindUserDepartment(id) {
		this.selected = [];
		this.listRole.forEach(element => {
			element.lstUser=[];
		});		/* #region push user đăng nhập vào nhóm quản trị */
		var index = this.listUser.find((x) => x.id_nv == this.UserId);
		if (index) {
			index.type = 1;
			index.RoleID = 0;
			index.UserID = index.id_nv;
			this.selected.push(index);
		}
		/* #endregion */
		/* #region insert user của phòng ban vào gr đầu tiên */
		this._service.list_account_department(id).subscribe((res) => {
			if (res) {
				if (res.status == 1) {
					this._listUserDepartment = res.data;
					this._listUserDepartment.forEach(element => {
						var item_role = this.listRole.findIndex((x) => x.ref_DepartmentRoleID == element.RoleID);
						if (item_role != -1) {
							element.RoleID = this.listRole[item_role].RowID;
							this.listRole[item_role].lstUser.push(element);							
							this.selected.push(element);							
						}
					});
					this.isLoadding=false;
					this.changeDetectorRefs.detectChanges();
				}
			} else {
				this.layoutUtilsService.showError(res.error.message);
			}
		})
		/* #endregion */
	}
	Create(_item: ProjectTeamModelV2, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.disabledBtn = true;
		// this.layoutUtilsService.showWaitingDiv();
		this._service.InsertProjectTeam2(_item).subscribe(res => {
			this.disabledBtn = false;
			// this.layoutUtilsService.OffWaitingDiv();
			if (res && res.status == 1) {
				if (withBack == true) {
					this.dialogRef.close({
						_item
					});
				}
				else {
					this.ngOnInit();
				}
				const _messageType = this.translate.instant('GeneralKey.themthanhcong');
				this.layoutUtilsService.showActionNotification(_messageType, MessageType.Read, 4000, true, false, 3000, 'top', 1);

			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	close() {
		const _title = this.translate.instant('GeneralKey.xacnhanthoat');
		const _description = this.translate.instant('GeneralKey.bancomuonthoat');
		const _waitDesciption = this.translate.instant('GeneralKey.dangdong');
		const _deleteMessage = this.translate.instant('GeneralKey.thaydoithanhcong');
		if (this.isChangeData()) {
			const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}
				this.dialogRef.close();
			});
		} else this.dialogRef.close();
	}

	isChangeData() {

		const val1 = this.prepare();
		if (val1.title != this.item.title) return true;
		//if (val1.color != this.item.color) return true;
		if (val1.id_department != this.item.id_department) return true;
		if (val1.description != this.item.description) return true;
		//if (val1.loai != this.item.loai) return true;
		if (this.IsChangeUser) return true;
		return false;
	}
	reset() {
		this.item = Object.assign({}, this.item);
		this.createForm();
		this.hasFormErrors = false;
		this.itemForm.markAsPristine();
		this.itemForm.markAsUntouched();
		this.itemForm.updateValueAndValidity();
	}

	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
			this.item = this.data._item;
			if (this.viewLoading == true) {
				this.onSubmit(true);
			}
			else {
				this.onSubmit(false);
			}
		}
	}
	chooseFile() {
		let f = document.getElementById("inputIcon");
		f.click();
	}

	stopPropagation(event) {
		event.stopPropagation();
	}

	onSelectFile(event) {
		if (event.target.files && event.target.files[0]) {
			var filesAmount = event.target.files[0];
			var Strfilename = filesAmount.name.split('.');

			event.target.type = 'text';
			event.target.type = 'file';
			var reader = new FileReader();
			let base64Str: any;
			reader.onload = (event) => {
				base64Str = event.target["result"]
				var metaIdx = base64Str.indexOf(';base64,');
				let strBase64 = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
				this.icon = { filename: filesAmount.name, strBase64: strBase64, base64Str: base64Str };
				this.changeDetectorRefs.detectChanges();
			}
			reader.readAsDataURL(filesAmount);
		}
	}

}
export class ProjectTeamModelV2 extends BaseModel {
    id_row: number;
    default_view: number;
    icon: any;
    Role: number;
    title: string;
    description: string;
    detail: string;
    Description: string;
    id_department: string;
    IsEdit: boolean;
    is_project: boolean;
    NotifyTemplateID: string;
    //loai: string;
    status: string;
    statusGroup: string;
    locked: boolean;
    stage_description: string;
    //color: string;
    template: string;
    period_type: number;
    RoleUser: Array<RoleUserModel> = [];
    Users: Array<UserModelv2> = [];
    Count: any;
    DueToday: any;
    NotStarted: any;


    id_project_team: string;
    is_use_template_description: boolean;
    is_use_template_description_child: boolean;
    is_use_template_parent: boolean;
    template_description: string;
    template_description_child: string;

    //=================Thiên bổ sung 28/07/2023==========
    projectParentId: number;
    projectParent: string;
    //================Học bổ sung 2/1/2024============
    position:number; ///truyền dữ liệu xuống
    Position:number;///load dữ liệu lên
    clear() {
        this.id_row = 0;
        this.default_view = 4;
        // this.icon = {};
        this.title = '';
        this.Role = 0;
        this.description = '';
        this.detail = '';
        this.Description = '';
        this.id_department = '';
        this.IsEdit = true;
        this.is_project = false;
        this.NotifyTemplateID = '';
        //this.loai = '1';
        this.status = '1';
        this.statusGroup = '0';
        this.locked = false;
        this.stage_description = '';
        //this.color = '';
        this.template = '';
        this.period_type = 1;
        this.id_project_team = '';
        this.is_use_template_description = false;
        this.is_use_template_description_child = false;
        this.is_use_template_parent = false;
        this.template_description = '';
        this.template_description_child = '';
        this.position=0;
        this.Position=0;
    }
}
export class ProjectTeamModel extends BaseModel {
    id_row: number;
    rowid: number;
    default_view: number;
    icon: any;
    title: string;
    description: string;
    detail: string;
    Description: string;
    id_department: string;
    IsEdit: boolean;
    start_date: string;
    end_date: string;
    is_project: boolean;
    loai: string;
    status: string;
    statusGroup: number;
    locked: boolean;
    stage_description: string;
    color: string;
    template: string;
    allow_percent_done: boolean;
    require_evaluate: boolean;
    evaluate_by_assignner: boolean;
    allow_estimate_time: boolean;
    period_type: number;
    Users: Array<ProjectTeamUserModel> = [];
    Users_owner: Array<ProjectTeamUserModel> = [];
    users: Array<ProjectTeamUserModel> = [];
    RoleUser: Array<RoleUserModel> = [];
    Count: any;
    DueToday: any;
    NotStarted: any;
    NotifyTemplateID: string;
    // DueToday: any[];
    child: any;
    person_in_charge: any;
    id_project_team: string;
    templatecenter: TemplateCenterModel;
    id_template: any;
    is_use_template_description: boolean;
    is_use_template_description_child: boolean;
    is_use_template_parent: boolean;
    template_description: string;
    template_description_child: string;
    //=================Thiên bổ sung 28/07/2023==========
    projectParentId: number;
    projectParent: string;
    //===================================================
    clear() {
        this.id_row = 0;
        this.rowid = 0;
        this.default_view = 4;
        // this.icon = {};
        this.title = '';
        this.description = '';
        this.detail = '';
        this.Description = '';
        this.id_department = '';
        this.IsEdit = true;
        this.start_date = null;
        this.end_date = null;
        this.is_project = false;
        this.loai = '1';
        this.status = '1';
        this.statusGroup = 0;
        this.locked = false;
        this.stage_description = '';
        this.color = '';
        this.template = '';
        this.allow_percent_done = false;
        this.require_evaluate = false;
        this.evaluate_by_assignner = false;
        this.allow_estimate_time = false;
        this.period_type = 1;
        this.id_project_team = '';
        this.is_use_template_description = false;
        this.is_use_template_description_child = false;
        this.is_use_template_parent = false;
        this.template_description = '';
        this.template_description_child = '';
        this.NotifyTemplateID = '';
    }
}
export class RoleUserModel extends BaseModel {
	RoleID: string;
	UserID: string;
	id: number;
	type: number;
	isNew:boolean;
	clear() {
		this.type=0;
		this.id = 0;
		this.RoleID = '';
		this.UserID = '';
		this.isNew=false;
	}
}
export class ProjectTeamUserModel {
    id_row: number;
    id_project_team: number;
    id_user: number;
    admin: boolean;
    id_nv: number;
    IsOwner: boolean
    clear() {
        this.id_row = 0;
        this.id_project_team = 0;
        this.id_user = 0;
        this.admin = false;
        this.IsOwner = false;
    }
}
export class UserModelv2 {
    UserID: number;
    Role: number;
    isChange: number;
    RoleID: any;
    //IsOwner:boolean
    clear() {
        this.UserID = 0;
        this.Role = 0;
        this.isChange = 0;
        //this.IsOwner=false;
    }
}
export class RoleUserModelv2 extends BaseModel {
	RoleID: string;
	UserID: string;
	ProjectID:number;
	hoten:string;
	username:string;
	tenchucdanh:string;
	mobile:string;
	image:string;
	clear() {
		this.RoleID = '';
		this.UserID = '';
		this.ProjectID = 0;
		this.hoten='';
		this.username='';
		this.tenchucdanh='';
		this.mobile='';
		this.image='';
	}
}
