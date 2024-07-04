import { BaseModel } from "../../../models/_base.model";
import { TemplateCenterModel } from "./template-center/template-model/template.model";

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

export class ProjectTeamUserModel {
    id_row: number;
    id_project_team: number;
    id_user: number;
    admin: boolean;
    id_nv: number;

    clear() {
        this.id_row = 0;
        this.id_project_team = 0;
        this.id_user = 0;
        this.admin = false;
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

export class WorkModel {
    DocsID:number;//idrow của GOV_Docs nếu là trường hợp inser nhiệm vụ có văn bản
    typeInsert:number;//trường hợp inser nhiệm vụ có văn bản : 1-Inser bình thường, 2- Inser có văn bản
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
    type:number; // Cho GOV : type=1 tạo công việc bình thường, type=1 tạo công việc bằng cách tạo văn bản trước
    clear() {
        this.DocsID=0;
        this.typeInsert=0;
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
        this.type=0;
    }
}



export class WorkDraftModel {
    DocsID:number;//idrow của GOV_Docs nếu là trường hợp inser nhiệm vụ có văn bản
    id_row: number;
    deadline: string;
    description: string;
    Attachments: any[];
    Projects: any[];
    clear() {
        this.DocsID=0;
        this.id_row = 0;
        this.deadline = '';
        this.description = '';
        this.Attachments = [];
        this.Projects = [];
    }
}
export class WorkAttModel {
    Userid_nguoigiao: number;
    labelNGNV: string;
    Gov_SoHieuVB: string;
    Gov_NgayVB: string;
    Gov_TrichYeuVB: string;
    Attachments: any[];
    clear() {
        this.Userid_nguoigiao = 0;
        this.labelNGNV='';
        this.Gov_SoHieuVB = '';
        this.Gov_NgayVB = '';
        this.Gov_TrichYeuVB = '';
        this.Attachments = [];
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

export class WorkTagModel extends BaseModel {
    id_row: number;
    id_work: number;
    id_tag: number;

    clear() {
        this.id_row = 0;
        this.id_work = 0;
        this.id_tag = 0;
    }
}
export class UpdateFileModel {
    id_row: number;
    values: Array<FileUploadModel> = [];

    clear() {
        this.id_row=0;
        this.values = [];

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

export class UpdateByKeyModel {
    id_row: number;
    key: string;
    value: string;
    id_log_action: string;
    values: Array<FileUploadModel> = [];
    clear() {
        this.id_row = 0;
        this.key = '';
        this.value = '';
        this.id_log_action = '';
        this.values = [];
    }
}

export class ChecklistModel {
    id_row: number;
    title: string;
    id_work: number;
    clear() {
        this.id_row = 0;
        this.title = '';
        this.id_work = 0;
    }
}

export class ChecklistItemModel {
    id_row: number;
    id_checklist: number;
    title: string;
    checker: number;
    clear() {
        this.id_row = 0;
        this.title = '';
        this.id_checklist = 0;
        this.checker = 0;
    }
}

export class AttachmentModel extends BaseModel {
    object_type: number;
    object_id: number;
    id_user: number;
    item: FileUploadModel;
    clear() {
        this.object_type = 0;
        this.object_id = 0;
        this.id_user = 0;
        this.item;
    }
}

export class TagsModel extends BaseModel {
    id_row: number;
    title: string;
    color: string;
    id_project_team: string;
    project_team: string;

    clear() {
        this.id_row = 0;
        this.color = '';
        this.title = '';
        this.id_project_team = '0';
        this.project_team = '';
    }
}

export class MilestoneModel extends BaseModel {
    id_row: number;
    title: string;
    description: string;
    person_in_charge: string;
    deadline: string;
    id_project_team: number;
    id_department: number;

    clear() {
        this.id_row = 0;
        this.description = '';
        this.title = '';
        this.person_in_charge = '';
        this.deadline = '';
        this.id_project_team = 0;
        this.id_department = 0;
    }
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