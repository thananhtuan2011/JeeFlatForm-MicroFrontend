import { BaseModel } from "./_base.model";

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
    Gov_Nguoiky: string;
    Gov_Donvibanhanh: string;
    IsGiaoVB: boolean;
    DepartmentID: number;
    MeetingID: number;
    //======Bổ sung field áp dụng cho báo cáo định kỳ=========
    IsRepeated: boolean;
    frequency: number;
    repeated_day: string;
    First_StartDate: string;
    First_EndDate: string;
    IsActive: number;
    title_repeat:string;
    Expired_Type:string;
    Expired_Value:string;
    Expired_Period:string;
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
        this.IsGiaoVB = true;
        this.DepartmentID = 0;
        //======Bổ sung field áp dụng cho báo cáo định kỳ=========
        this.IsRepeated = false;
        this.frequency = 0;
        this.repeated_day = '';
        this.First_StartDate = '';
        this.First_EndDate = '';
        this.IsActive = 0;
        this.title_repeat = '';
        this.Expired_Type = '';
        this.Expired_Value = '';
        this.Expired_Period = '';
    }
}



export class WorkDraftModel {
    DocsID: number;//idrow của GOV_Docs nếu là trường hợp inser nhiệm vụ có văn bản
    id_row: number;
    //deadline: string;
    description: string;
    Attachments: any[];
    Projects: any[];
    clear() {
        this.DocsID = 0;
        this.id_row = 0;
        //this.deadline = '';
        this.description = '';
        this.Attachments = [];
        this.Projects = [];
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


export interface TagsDTO {
    RowID: number;
    Tag: string;
    Color: string;
    CustomerID: number;
}

export class TicketTagsModel {
    public RowID: number;
    public TagID: number;
    public TicketID: number;
    public CreatedDate: string;
    public CreatedBy: number;

    clear() {
        this.RowID = 0;
        this.TagID = 0;
        this.TicketID = 0;
        this.CreatedBy = 0;
        this.CreatedDate = '';

    }
}


export interface TicketTagsDTO {
    RowID: number;
    Tag: string;
    Color: string;
    CustomerID: number;
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
