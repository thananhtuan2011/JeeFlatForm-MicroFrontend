import { BaseModel } from "../_base.model_new";
import { DepartmentTagModel, GroupStatusModel, StatusDynamicModel } from "../view-config-status/view-config-status.component";

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
export class StatusModel1 {
	id_row: number;
	Type: number;
	color: string;
	StatusName: string;
	title: string;
	Position: number;
	IsDefault: boolean;
	// id_project: number;
	// Status?: any;
	// IsSystem: boolean;
	clear() {
		this.id_row = 0;
		this.Type = 0;
		this.color = "";
		this.StatusName = "";
		this.title = "";
		this.IsDefault = false;
		this.Position = 0;
		// this.id_project = 0;
		// this.Status = [];
		// this.IsSystem = false;
	}
}
export class DepartmentModelV2 extends BaseModel {
	RowID: number;
	title: string;
	dept_name: string;
	IsEdit: boolean;
	id_cocau: number;
	id_row: number;
	// Owners: Array<DepartmentOwnerModel> = [];
	roleUser: any = [];
	IsDataStaff_HR: boolean;
	ReUpdated: boolean;
	TemplateID: number;
	DefaultView: any;
	ParentID: any;
	// templatecenter: TemplateCenterModel;
	status: Array<StatusDynamicModel>;
	department_tag: Array<DepartmentTagModel>;
	lstTagAdd: Array<DepartmentTagModel>;
	lstTagDelete: Array<DepartmentTagModel>;
	groupStatus: GroupStatusModel;

	clear() {
		this.RowID = 0;
		this.dept_name = '';
		this.title = '';
		this.IsEdit = true;
		this.id_cocau = 0;

		this.roleUser = [];
		this.DefaultView = [];
		this.status = [];
		this.groupStatus = {id_row: 0, title:'',id_project:0};
		this.department_tag = [];
		this.IsDataStaff_HR = false;

		this.ReUpdated = false;
		this.TemplateID = 0;

		this.lstTagAdd = [];
		this.ParentID = 0;
	}
}
export class DepartmentRoleUserModel extends BaseModel {
	roleID: number;
	userID: number;
	id: number;
	type: number;
	clear() {
		this.roleID = 0;
		this.userID = 0;
		this.id = 0;
		this.type = 0;
	}
}
export class DepartmentViewModel extends BaseModel {
	id_row: number;
	viewid: number;
	id_department: number;
	is_default: boolean;
	clear() {
		this.id_row = 0;
		this.viewid = 0;
		this.id_department = 0;
		this.is_default = false;

	}
}
export class FileUploadModel extends BaseModel {
    IdRow: number;
    strBase64: string;
    filename: string;
    src: string;
    IsAdd: boolean;
    IsDel: boolean;
    IsImagePresent: boolean;
    link_cloud: string;
    clear() {
        this.IdRow = 0;
        this.strBase64 = '';
        this.filename = '';
        this.src = '';
        this.IsAdd = false;
        this.IsDel = false;
        this.IsImagePresent = false;
        this.link_cloud = '';
    }
}
export class UserModel {
	Email: string;
	hoten: string;
	id_nv: number;
	image: string;
	mobile: string;
	username: string;
	type: number;
	clear() {
		this.Email = "";
		this.hoten = "";
		this.id_nv = 0;
		this.image = "";
		this.mobile = "";
		this.username = "";
		this.type = 0;
	}
}
export class GroupStatusModelTemp {
	id_row: number;
	title: string;
	id_project: number;
	Status?: any;
	IsSystem: boolean;
	clear() {
		this.id_row = 0;
		this.title = "";
		this.id_project = 0;
		this.Status = [];
		this.IsSystem = false;
	}
}
export class GroupModel extends BaseModel {
	id_row: number;
	title: string;
	id: number;
	Categorytype:number;
	IdGroupCopy:number;
	clear() {
		this.id_row = 0;
		this.id = 0;
		this.title = '';
		this.Categorytype=2;
		this.IdGroupCopy=0;
	}
}
export class PositionModelBasic {
	id_row: number;
	position: number;
	clear() {
		this.id_row = 0;
		this.position = 0;
	}
}
export class ListPositionModelBasic {
	data: PositionModelBasic[];
	clear() {
		this.data = [];
	}
}
export class Different_StatusesModel extends BaseModel {
	// Id_row: number;
	// StatusName: string;
	// Description: string;
	id_project_team: number;
	// Type: string;
	// IsDefault: boolean;
	// Color: string;
	// Position: number;
	// Follower: number;
	IsMapAll: boolean;
	TemplateID_New: number;
	// TemplateID_Old: number;
	Map_Detail: Array<MapModel>;
	clear() {
		// this.Id_row = 0;
		// this.StatusName = "";
		// this.Description = "";
		this.id_project_team = 0;
		// this.Type = '';
		// this.IsDefault = false;
		// this.Color = '';
		// this.Position = 0;
		this.IsMapAll = false;
		this.TemplateID_New = 0;
		// this.TemplateID_Old = 0;
		this.Map_Detail = [];
	}
}
export class MapModel {
	old_status: number;
	new_status: number;
	clear() {
		this.old_status = 0;
		this.new_status = 0;
	}
}