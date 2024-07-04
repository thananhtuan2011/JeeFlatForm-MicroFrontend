import {
  Component,
  OnInit,
  Input,
  Inject,
} from "@angular/core";
// Material
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { SelectionModel } from "@angular/cdk/collections";
import { SortState } from "../model/sort.model";
import { PaginatorState } from "../model/paginator.model";
import { BaseModel } from "../_base.model_new";
// RXJS
// Models
@Component({
  selector: 'app-view-config-status',
  templateUrl: './view-config-status.component.html',
  styleUrls: ['./view-config-status.component.scss']
})
export class ViewConfigStatusComponent implements OnInit {
  dataSource: any[];
  displayedColumns = ['STT', 'ID_Mohinh', 'TenMohinh', 'Status'];
  viewLoading: boolean = false;
  sorting: SortState = new SortState();
  // Filter fields
  liststatus: any[] = [];
  Status: any[] = [];
  // Selection
  selection = new SelectionModel<DepartmentModel>(true, []);
  productsResult: DepartmentModel[] = [];
  //=================PageSize Table=====================
  paginatorNew: PaginatorState = new PaginatorState();
  pageSize: number;
  Id_Department: number = 0;
  @Input() Values: any = {};
  flag: boolean = true;
  data_dropdown: any[];
  selected;
  constructor(
    public dialogRef: MatDialogRef<ViewConfigStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
  ) { }
  ngOnInit(): void {
    this.liststatus = this.data.listItem;
    this.selected = this.data.selected;
    this.dataSource = this.liststatus;
  }

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = 597 - 300;
    return tmp_height + 'px';
  }

}
export class DepartmentModel extends BaseModel {
	RowID: number;
	title: string;
	dept_name: string;
	IsEdit: boolean;
	id_cocau: number;
	id_row: number;
	// Owners: Array<DepartmentOwnerModel> = [];
	Owners: any = [];
	IsDataStaff_HR: boolean;
	ReUpdated: boolean;
	TemplateID: number;
  NotifyTemplateID:number;
	DefaultView: any;
	ParentID: any;
	templatecenter: TemplateCenterModel;
	status: Array<StatusDynamicModel>;
	department_tag: Array<DepartmentTagModel>;
	lstTagAdd: Array<DepartmentTagModel>;
	lstTagDelete: Array<DepartmentTagModel>;
	Rule:any;
	IsAdmin:boolean;
  groupStatus: GroupStatusModel;
	clear() {
		this.RowID = 0;
		this.dept_name = '';
		this.title = '';
		this.IsEdit = true;
		this.id_cocau = 0;
		this.Owners = [];
		this.DefaultView = [];
		this.status = [];
		this.department_tag = [];
		this.IsDataStaff_HR = false;
		this.ReUpdated = false;
		this.TemplateID = 0;
    	this.NotifyTemplateID = 0;
		this.ParentID = 0;
		this.Rule=[];
		this.IsAdmin=false;
    this.groupStatus = {id_row: 0, title:'',id_project:0};
	}
}
export class StatusDynamicModel extends BaseModel {
	Id_row: number;
	StatusName: string;
	Title: string;
	Description: string;
	Id_project_team: number;
	id_department : number;
	id_template: number;
	Type: string;
	IsDefault: boolean;
	Color: string;
	Position: number;
	Follower: string;
  CategoryType: number;
  CategoryID: number;
  id_group: number;
	clear() {
		this.Id_row = 0;
		this.StatusName = '';
		this.Title = '';
		this.Id_project_team = 0;
		this.id_department = 0;
		this.id_template = 0;
		this.Type = '2';
		this.Description = '';
		this.Color = '';
		this.IsDefault = true;
		this.Position = 0;
		this.Follower = '0';
		this.IsDefault = false;
    this.CategoryType = 0;
    this.CategoryID = 0;
    this.id_group = 0;
	}
}
export class TemplateCenterModel extends BaseModel {
	id_row: number;
	title: string;
	description: string;
	templateid: number;
	customerid: number;
	ObjectTypesID: number;
	ParentID: number;
	types: number;
	levels: number;
	viewid: string;
	group_statusid: string;
	template_typeid: number;
	img_temp: string;
	field_id: string;
	is_customitems: boolean;
	is_task: boolean;
	is_views: boolean;
	isConfigNotify: boolean;
	isConfigStatus: boolean;
	is_projectdates: boolean;
	share_with: number;
	id_save:number;
	list_share: Array<TempalteUserModel> = [];
	list_field_name: Array<ListFieldModel> = [];
	list_status : Array<StatusListModel> = [];
	// public List<StatusListModel> list_status { get; set; } // Dùng khi save as

	start_date: string;
	end_date: string;
	save_as_id: string;
	sample_id: string;
	clear() {
		this.id_row = 0;
		this.title = "";
		this.description = "";
		this.templateid = 0;
		this.customerid = 0;
		this.ObjectTypesID = 0;
		this.ParentID = 0;
		this.types = 0;
		this.levels = 0;
		this.id_save=0;
		this.viewid = "";
		this.group_statusid = "";
		this.template_typeid = 0;
		this.img_temp = "";
		this.field_id = "";
		this.is_customitems = false;
		this.is_task = false;
		this.is_views = false;
		this.isConfigNotify = false;
		this.isConfigStatus = false;
		this.is_projectdates = false;
		this.list_field_name = [];
		this.save_as_id = '';
		this.sample_id = '0';
	}
}
export class TempalteUserModel {
	id_row: number;
	id_template: number;
	id_user: number;
	clear() {
		this.id_row = 0;
		this.id_template = 0;
		this.id_user = 0;
	}
}
export class ListFieldModel extends BaseModel {
	id_field: number;
	fieldname: string;
	title: string;
	isvisible: boolean;
	note: string;
	type: string;
	position: number;
	isnewfield: boolean;
	isdefault: boolean;
	typeid: number;
	clear() {
		this.id_field = 0;
		this.fieldname = '';
		this.title = '';
		this.isvisible = false;
		this.note = '';
		this.type = '';
		this.position = 0;
		this.isnewfield = false;
		this.isdefault = false;
		this.typeid = 0;
	}
}
export class StatusListModel extends BaseModel {
	id_row: number;
	StatusName: string;
	Description: string;
	color: string;
	Type: number;
	IsDefault: boolean;
	clear() {
		this.id_row = 0;
		this.StatusName = '';
		this.Description = '';
		this.color = '';
		this.Type = 0;
		this.IsDefault = false;
	}
}
export class DepartmentTagModel extends BaseModel {
  id_row: number;
  id_department: number;
  name: string;
  color_tag: string;
  clear() {
      this.id_row = 0;
      this.id_department = 0;
      this.name = "";
      this.color_tag = "";
  }
}
export interface GroupStatusModel {
	id_row: number;
	title: string;
	id_project: number;
}