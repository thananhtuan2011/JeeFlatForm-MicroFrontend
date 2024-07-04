import { BaseModel } from "src/app/modules/auth/models/query-params.model";

export interface DashboardOptions {
	gridType: any;
	compactType: any;
	margin: number;
	outerMargin: boolean;
	outerMarginTop: null;
	outerMarginRight: null;
	outerMarginBottom: null;
	outerMarginLeft: null;
	mobileBreakpoint: number;
	minCols: number;
	maxCols: number;
	minRows: number;
	maxRows: number;
	maxItemCols: number;
	minItemCols: number;
	maxItemRows: number;
	minItemRows: number;
	maxItemArea: number;
	minItemArea: number;
	defaultItemCols: number;
	defaultItemRows: number;
	fixedColWidth: number;
	fixedRowHeight: number;
	keepFixedHeightInMobile: boolean;
	keepFixedWidthInMobile: boolean;
	scrollSensitivity: number;
	scrollSpeed: number;
	enableEmptyCellClick: boolean;
	enableEmptyCellContextMenu: boolean;
	enableEmptyCellDrop: boolean;
	enableEmptyCellDrag: boolean;
	emptyCellDragMaxCols: number;
	emptyCellDragMaxRows: number;
	ignoreMarginInRow: boolean;
	draggable: any;
	resizable: {
		enabled: boolean;
	};
	swap: boolean;
	pushItems: boolean;
	disablePushOnDrag: boolean;
	disablePushOnResize: boolean;
	pushDirections: { north: true; east: true; south: true; west: true };
	pushResizeItems: boolean;
	displayGrid: any;
	disableWindowResize: boolean;
	disableWarnings: boolean;
	scrollToNewItems: boolean;
	itemChangeCallback: any;
	itemResizeCallback: any;
}

export class Dashboard {
	widgets: Widget[];
	constructor() {
		this.widgets = [];
	}
}

export class WidgetShow {
	Id: string;
	Title: string;
	IsShow: boolean;
	IsHienThi: boolean;
	Note: string;
}

export class Widget {
	id: string;
	name: string;
	componentName: string;
	componentType: Object;
	cols: number;
	rows: number;
	y: number;
	x: number;
	vals: string;
}

export class WidgetModel {
	Id: number;
	Name: string;
	ComponentName: string;
	Cols: number;
	Rows: number;
	x: number;
	y: number;
	vals: string;
	constructor(widget: Widget) {
		this.Id = +widget.id;
		this.Name = widget.name;
		this.ComponentName = widget.componentName;
		this.Cols = widget.cols;
		this.Rows = widget.rows;
		this.x = widget.x;
		this.y = widget.y;
		this.vals = widget.vals;
	}
}

//====================Start dùng liên quan đến JeeWork=====================
export class WorkModel {
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
	estimates: number;
	id_parent: number = 0;
	Users: UserInfoModel[];
	Attachments: FileUploadModel[];
	Tags: WorkTagModel[];
	Followers: UserInfoModel[];
	assign: UserInfoModel;
	status: number;
	Activities: any;
	clear() {
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
		this.estimates = 0;
		this.status = 0;
		this.Activities = [];
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

export class FileUploadModel extends BaseModel {
	IdRow: number;
	strBase64: string;
	filename: string;
	src: string;
	IsAdd: boolean;
	IsDel: boolean;
	IsImagePresent: boolean;
	clear() {
		this.IdRow = 0;
		this.strBase64 = '';
		this.filename = '';
		this.src = '';
		this.IsAdd = false;
		this.IsDel = false;
		this.IsImagePresent = false;
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

export interface ProjectsInfoModel extends BaseModel {
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
	Users: Array<ProjectTeamUserModel>[];
	users: Array<ProjectTeamUserModel>[];
	Count: any;
	DueToday: any;
	NotStarted: any;
	// DueToday: any[];
	child: any;
	person_in_charge: any;
	id_project_team: string;
}

export class ProjectTeamUserModel {
	id_row: number;
	id_project_team: number;
	id_user: number;
	admin: boolean;
	id_nv: number;
}