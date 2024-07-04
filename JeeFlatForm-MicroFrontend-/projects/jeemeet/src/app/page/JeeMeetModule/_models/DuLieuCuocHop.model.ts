
export class CuocHopModel {
	TenCuocHop: string;
	thoigiandate: any;
	thoigiantime: string;
	thoigianminute: string;
    SuDungPhongHop: string;
	SuDungPhongHopInput: any;
	XacNhanThamGia: boolean;
	NhapTomTat: boolean;
	GhiChu: string;
    ListThamGia: any ;
	ListTheoDoi: any;
	ListTomTat: any; 
    TaiSanKhac:any;
	LoaiTaiSan:number;
	isEdit:number;
	isAdd:number;
	RowID:number;
	IDPhongHop:any;
	IDPhongHopGoogle:any
	IDPhongHopTeams:any
	ZoomMeeting:boolean
	GoogleMeeting:boolean
	WebexMeeting:boolean
	TeamsMeeting:boolean
	OtherMeeting:boolean
	TimeZone:string = Intl.DateTimeFormat().resolvedOptions().timeZone
	OpenApp:any;
	OpenURL:any;
	PhongHopDangKy:any
	Link:string

	clear() {
		this.TenCuocHop = ''
        this.thoigiandate= ''
        this.thoigiantime= ''
        this.thoigianminute= ''
		this.SuDungPhongHop = ''
        this.SuDungPhongHopInput = [];
        this.XacNhanThamGia= false;
        this.NhapTomTat = false;
        this.GhiChu = ''
        this.ListThamGia= [];
        this.ListTheoDoi= [];
        this.ListTomTat= []; 
        this.TaiSanKhac = [];
		this.LoaiTaiSan = 1;
		this.isEdit = 0;
		this.isAdd = 0;
		this.RowID = 0
		this.ZoomMeeting = false
		this.GoogleMeeting = false
		this.WebexMeeting = false
		this.OtherMeeting = false
		this.IDPhongHop = ''
		this.Link = ''
	}
}
export class TaiSanModel {
	IdPhieu:number = -1;	
	RoomID: number = 0;
	BookingDate: any;
	FromTime: string;
	ToTime: string;
    MeetingContent: string;
	NVID: any;
	TenPhong: string;
    DiaDiem:string ;
	chitiet:string = "";
}

export class DepartmentModel {
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
export class StatusDynamicModel {
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

export class TemplateCenterModel {
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
	is_projectdates: boolean;
	share_with: number;
	list_share: Array<TempalteUserModel> = [];
	list_field_name: Array<ListFieldModel> = [];
	list_status: Array<StatusListModel> = [];
	// public List<StatusListModel> list_status { get; set; } // Dùng khi save as

	start_date: string;
	end_date: string;
	save_as_id: string;
	sample_id: string;
	//=================Sử dụng cho JeeWorkFlow===================
	nodeid: number;
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
		this.viewid = "";
		this.group_statusid = "";
		this.template_typeid = 0;
		this.img_temp = "";
		this.field_id = "";
		this.is_customitems = false;
		this.is_task = false;
		this.is_views = false;
		this.is_projectdates = false;
		this.list_field_name = [];
		this.save_as_id = '';
		this.sample_id = '0';
		this.nodeid = 0;
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

export class ListFieldModel {
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

export class StatusListModel {
	id_row: number;
	StatusName: string;
	Description: string;
	color: string;
	Type: number;
	IsDefault: boolean;
	IsFinal: boolean;
	IsDeadline: boolean;
	IsToDo: boolean;
	clear() {
		this.id_row = 0;
		this.StatusName = '';
		this.Description = '';
		this.color = '';
		this.Type = 0;
		this.IsDefault = false;
		this.IsFinal = false;
		this.IsDeadline = false;
		this.IsToDo = false;
	}
}