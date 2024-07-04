import { BaseModel } from "../../../models/_base.model";

export class ProcessWorkModel extends BaseModel {
	RowID: number;
	clear() {
		this.RowID = 0;
	}
}

export class TemplateModel extends BaseModel {
	RowID: number;
	Title: string;
	File: string;
	FileName: string;
	ContentType: string;
	ProcessID: number;
	clear() {
		this.RowID = 0;
		this.Title = "";
		this.File = ""
		this.FileName = "";
		this.ContentType = "";
		this.ProcessID;
	}
}

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

export class ProcessModel extends BaseModel {
	RowID: number;
	ProcessName: string;
	ObjectID: string;
	Data_Apply: any[] = [];
	Data_Follower: any[] = [];
	NodeFieldID: number;
	ProcessTypeID: string;
	Data_administration: any[] = [];
	Data_createtask: any[] = [];
	Data_view: any[] = [];
	ViewOptions: string;
	Data_FailReason: any[] = [];
	Data_DoneReason: any[] = [];

	clear() {
		this.RowID = 0;
		this.ProcessName = '';
		this.ObjectID = '';
		this.Data_Apply = [];
		this.Data_Follower = [];
		this.NodeFieldID = 0;
		this.ProcessTypeID = '';
		this.Data_administration = [];
		this.Data_createtask = [];
		this.Data_view = [];
		this.ViewOptions = '';
		this.Data_FailReason = [];
		this.Data_DoneReason = [];
	}
}

export class NodeProcessDetailsModel extends BaseModel {
	NodeID: number;
	title: string;
	NumberofTime: string;
	Time_Type: string;
	Description: string;
	Data_Implementer: any[] = [];
	Data_Assigner: any[] = [];
	Data_Follower: any[] = [];
	NextProcessID: string;
	CachGiaoViec: string;
	ProcessID: number;
	ObjectID: number;
	Data_ToDo: any[] = [];
	Data_Fields: any[] = [];
	IsEdit: string;
	IsCompleteAll: boolean;
	NodeType: number;
	TemplateStr: string;
	Tuychonbatdau: number;
	Object_EventName: string;
	NodeObjectID: number;
	ExtConditonID: number;
	ExtCondition_Operation: string;
	ExtCondition_Value: string;
	clear() {
		this.NodeID = 0;
		this.title = "";
		this.NumberofTime = "";
		this.Time_Type = "";
		this.Description = "";
		this.Data_Implementer = [];
		this.Data_Assigner = [];
		this.Data_Follower = [];
		this.NextProcessID = '';
		this.CachGiaoViec = '';
		this.ProcessID = 0;
		this.ObjectID = 0;
		this.Data_ToDo = [];
		this.Data_Fields = [];
		this.IsEdit = '';
		this.IsCompleteAll = false;
		this.NodeType = 0;
		this.TemplateStr = '';
		this.Tuychonbatdau = 0;
		this.Object_EventName = '';
		this.NodeObjectID = 0;
		this.ExtConditonID = 0;
	}
}

export class ForwardInfoModel extends BaseModel {
	RowID: number;
	Title: string;
	FieldID: string;
	NodeID: number;
	clear() {
		this.RowID = 0;
		this.Title = "";
		this.FieldID = "";
		this.NodeID = 0;;
	}
}

export class ProcessDetailsModel extends BaseModel {
	RowID: number;
	NodeID: number;
	ProcessID: number;
	Title: string;
	ControlID: string;
	IsRequired: boolean;
	Description: string;
	Values: any[] = [];
	KeyValue: string;
	FieldID: string;

	clear() {
		this.RowID = 0;
		this.NodeID = 0;
		this.ProcessID = 0;
		this.Title = '';
		this.ControlID = '';
		this.IsRequired = false;
		this.Description = '';
		this.Values = [];
		this.KeyValue = '';
		this.FieldID = '';
	}
}

export class ProcessDetailsListModel extends BaseModel {
	NodeID: number;
	ProcessID: number;
	Checked: boolean;
	Data_Fields: any[] = [];
	clear() {
		this.NodeID = 0;
		this.ProcessID = 0;
		this.Checked = false;
		this.Data_Fields = [];
	}
}

export class NodeProcessModel extends BaseModel {
	ProcessID: number;
	NodeList: any[] = [];
	RelationshipListData: any[] = [];


	clear() {
		this.ProcessID = 0;
		this.NodeList = [];
		this.RelationshipListData = [];
	}
}

export class Other_SettingsDataModel extends BaseModel {
	processid: number;

	A_istask_manager: boolean;
	A_isstage_manager: boolean;
	A_isstage_implementer: boolean;
	A_istask_start: boolean;
	A_stage_manager_stageid: string;
	A_stage_manager_stageid_array: any[] = [];
	A_stage_implementer_stageid: string;
	A_stage_implementer_stageid_array: any[] = [];

	M_istask_manager: boolean;
	M_isstage_manager: boolean;
	M_isstage_implementer: boolean;
	M_istask_start: boolean;
	M_stage_manager_stageid: string;
	M_stage_manager_stageid_array: any[] = [];
	M_stage_implementer_stageid: string;
	M_stage_implementer_stageid_array: any[] = [];

	clear() {
		this.processid = 0;

		this.A_istask_manager = false;
		this.A_isstage_manager = false;
		this.A_isstage_implementer = false;
		this.A_istask_start = false;
		this.A_stage_manager_stageid = '';
		this.A_stage_implementer_stageid = '';

		this.M_istask_manager = false;
		this.M_isstage_manager = false;
		this.M_isstage_implementer = false;
		this.M_istask_start = false;
		this.M_stage_manager_stageid = '';
		this.M_stage_implementer_stageid = '';

	}
}


