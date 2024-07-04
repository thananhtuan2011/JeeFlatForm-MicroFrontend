import { ProjectTeamUserModel } from "../JeeWorkModule/component/Jee-Work/jee-work.model";
import { TemplateCenterModel } from "../JeeWorkModule/component/Jee-Work/template-center/template-model/template.model";
import { BaseModel } from "./_base.model";

export class ToDoDataModel extends BaseModel {
	RowID: number;
	TaskName: string;
	Description: string;
	NumberofTime: string;
	Time_Type: string;
	Data_Implementer: any[] = [];
	Data_Follower: any[] = [];
	Priority: number;
	NodeID: number;
	clear() {
		this.RowID = 0;
		this.TaskName = "";
		this.Description = ""
		this.NumberofTime = "";
		this.Time_Type = "";
		this.Data_Implementer = [];
		this.Data_Follower = [];
		this.Priority = 0;
		this.NodeID;
	}
}

export class BaoCaoCongViecModel {
	id_row: number;
	so_hieu_vb: string;
	ngay_vb: string;
	trich_yeu_vb: string;
	noi_dung: string;
	don_vi_thuc_hien: string;
	han_xu_ly: string;
	is_cht_ch: number;
	is_cht_qh: number;
	is_ht_dh: number;
	is_ht_qh: number;
	constructor(
		id_row: number = 0,
		so_hieu_vb: string = "",
		ngay_vb: string = "",
		trich_yeu_vb: string = "",
		noi_dung: string = "",
		don_vi_thuc_hien: string = "",
		han_xu_ly: string = "",
		is_cht_ch: number = 0,
		is_cht_qh: number = 0,
		is_ht_dh: number = 0,
		is_ht_qh: number = 0,
	) {
		this.id_row = id_row;
		this.so_hieu_vb = so_hieu_vb;
		this.ngay_vb = ngay_vb;
		this.trich_yeu_vb = trich_yeu_vb;
		this.noi_dung = noi_dung;
		this.don_vi_thuc_hien = don_vi_thuc_hien;
		this.han_xu_ly = han_xu_ly;
		this.is_cht_ch = is_cht_ch;
		this.is_cht_qh = is_cht_qh;
		this.is_ht_dh = is_ht_dh;
		this.is_ht_qh = is_ht_qh;
	}
	clear() {
		this.id_row = 0;
		this.so_hieu_vb = "";
		this.ngay_vb = "";
		this.trich_yeu_vb = "";
		this.noi_dung = "";
		this.don_vi_thuc_hien = "";
		this.han_xu_ly = "";
		this.is_cht_ch = 0;
		this.is_cht_qh = 0;
		this.is_ht_dh = 0;
		this.is_ht_qh = 0;
	}
}

export class BaoCaoDuAnModel {
	id_row: number;
	title: string;
	num_work: number;
	hoanthanh: number;
	hoanthanh_dunghan: number;
	hoanthanh_cham: number;
	chuahoanthanh: number;
	chuahoanthanh_quahan: number;
	chuahoanthanh_conhan: number;
	chatluong: string;
	ghichu: string;
	tongvanban: number;
	constructor(
		id_row: number = 0,
		title: string = "",
		num_work: number = 0,
		hoanthanh: number = 0,
		hoanthanh_dunghan: number = 0,
		hoanthanh_cham: number = 0,
		chuahoanthanh: number = 0,
		chuahoanthanh_quahan: number = 0,
		chuahoanthanh_conhan: number = 0,
		chatluong: string = "",
		ghichu: string = "",
		tongvanban: number = 0
	) {
		this.id_row = id_row;
		this.title = title;
		this.num_work = num_work;
		this.hoanthanh = hoanthanh;
		this.hoanthanh_dunghan = hoanthanh_dunghan;
		this.hoanthanh_cham = hoanthanh_cham;
		this.chuahoanthanh = chuahoanthanh;
		this.chuahoanthanh_quahan = chuahoanthanh_quahan;
		this.chuahoanthanh_conhan = chuahoanthanh_conhan;
		this.chatluong = chatluong;
		this.ghichu = ghichu;
		this.tongvanban = tongvanban;
	}
}

export class NhiemVuDuocGiaoModel extends BaseModel {
	Data: any[] = [];
	Tong_data: any[] = [];
}
export class NhiemVuDuocTaoModel extends BaseModel {
	Data: any[] = [];
	Tong_data: any[] = [];
}
export class ExcelModel extends BaseModel {
	Data: any[] = [];
	Tong_data: any[] = [];
}

//===========================================================================
export class WorkModel {
	DocsID: number;//idrow của GOV_Docs nếu là trường hợp inser nhiệm vụ có văn bản
	typeInsert: number;//trường hợp inser nhiệm vụ có văn bản : 1-Inser bình thường, 2- Inser có văn bản
	id_row: number;
	title: string;
	deadline: string;
	start_date: string;
	end_date: string;
	description: string;
	id_project_team: number;
	id_milestone: number;
	id_group: number;
	prioritize: boolean;
	urgent: number;
	id_parent: number = 0;
	Users: any[];
	Attachments: any[];
	Tags: any[];
	Followers: any[];
	assign: UserInfoModel;
	status: number;
	Activities: any;
	estimates: string = '';
	clickup_prioritize: number;
	messageid: number;
	groupid: number;
	Projects: any[];
	SourceID: number;
	DesID: number;
	IsRelationshipTask: boolean;
	Userid_nguoigiao: number;
	Gov_SoHieuVB: string;
	Gov_NgayVB: string;
	Gov_TrichYeuVB: string;
	type: number; // Cho GOV : type=1 tạo công việc bình thường, type=1 tạo công việc bằng cách tạo văn bản trước
	clear() {
		this.DocsID = 0;
		this.typeInsert = 0;
		this.id_row = 0;
		this.title = '';
		this.deadline = '';
		this.id_group = 0;
		this.start_date = '';
		this.end_date = '';
		this.description = '';
		this.id_project_team = 0;
		this.id_milestone = 0;
		this.prioritize = false;
		this.Users = [];
		this.Attachments = [];
		this.Tags = [];
		this.id_parent = 0;
		this.urgent = 0;
		this.status = 0;
		this.Activities = [];
		this.estimates = '';
		this.clickup_prioritize = 0;
		this.messageid = 0;
		this.groupid = 0;
		this.SourceID = 0;
		this.DesID = 0;
		this.IsRelationshipTask = false;
		this.Userid_nguoigiao = 0;
		this.Gov_SoHieuVB = '';
		this.Gov_NgayVB = '';
		this.Gov_TrichYeuVB = '';
		this.type = 0;
	}
}

export class UserInfoModel extends BaseModel {
	id_nv: number;
	id_user: number;
	hoten: string;
	tenchucdanh: string;
	image: string;
	mobile: string;
	username: string;
	admin: boolean;
	loai: number;
	id_row: number;

	clear() {
		this.id_nv = 0;
		this.id_user = 0;
		this.hoten = '';
		this.tenchucdanh = '';
		this.image = '';
		this.mobile = '';
		this.username = '';
		this.admin = false;
		this.id_row = 0;
		this.loai = 1; //1:giao việc, 2: theo dõi
	}
}

export class UpdateWorkModel {
    id_row: number;
    key: string;
    value: string;
    id_log_action: string;
    IsStaff: boolean;
    values: Array<FileUploadModel> = [];
    status_type: string;
    FieldID: number;
    Value: string;
    WorkID: string;
    TypeID: string;

    clear() {
        this.id_row = 0;
        this.key = '';
        this.value = '';
        this.id_log_action = '';
        this.values = [];
        this.IsStaff = false;
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

export class ColumnWorkModel {
    id_row: number = 0;
    id_project_team: number = 0;
    id_department: number = 0;
    columnname: string;
    isnewfield: boolean = false;
    Options: any;
    type: number;
    title: string;
}

export class WorkViewModel extends BaseModel {
    id_row: number;
    workid: number;
    id_user: number;
    CreatedDate: string;
    clear() {
        this.id_row = 0;
        this.workid = 0;
        this.id_user = 0;
        this.CreatedDate = '';
    }
}

export class OptionsModel {
    rowid: number;
    FieldID: number;
    TypeID: number;
    ID_project_team: number;
    Value: string;
    Color: string;
    Note: string;
    constructor() {
        this.rowid = 0;
        this.FieldID = 0;
        this.TypeID = 0;
        this.ID_project_team = 0;
        this.Value = "";
        this.Color = "";
        this.Note = "";
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
    DefaultView: any;
    ParentID: any;
    templatecenter: TemplateCenterModel;
    status: Array<StatusDynamicModel>;
    clear() {
        this.RowID = 0;
        this.dept_name = '';
        this.title = '';
        this.IsEdit = true;
        this.id_cocau = 0;
        this.Owners = [];
        this.DefaultView = [];
        this.status = [];
        this.IsDataStaff_HR = false;
        this.ReUpdated = false;
        this.TemplateID = 0;
        this.ParentID = 0;
    }
}

export class StatusDynamicModel extends BaseModel {
    Id_row: number;
    StatusName: string;
    Title: string;
    Description: string;
    Id_project_team: number;
    id_department: number;
    Type: string;
    IsDefault: boolean;
    Color: string;
    Position: number;
    Follower: string;
    IsDeadline: boolean;
    IsFinal: boolean;
    IsToDo: boolean;
    clear() {
        this.Id_row = 0;
        this.StatusName = '';
        this.Title = '';
        this.Id_project_team = 0;
        this.id_department = 0;
        this.Type = '2';
        this.Description = '';
        this.Color = '';
        this.IsDefault = true;
        this.Position = 0;
        this.Follower = '0';
        this.IsDefault = false;
        this.IsFinal = false;
        this.IsToDo = false;
    }
}

export class ProjectTeamModel extends BaseModel {
    id_row: number;
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
    users: Array<ProjectTeamUserModel> = [];
    Count: any;
    DueToday: any;
    NotStarted: any;
    // DueToday: any[];
    child: any;
    person_in_charge: any;
    id_project_team: string;
    templatecenter: TemplateCenterModel;
    id_template: any;

    clear() {
        this.id_row = 0;
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
    }
}