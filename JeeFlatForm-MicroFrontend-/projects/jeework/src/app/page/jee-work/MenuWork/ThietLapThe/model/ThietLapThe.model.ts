export class MenuModel {
    id_project: number;
    id_priority: number;
    isHidden: boolean;
    loainhiemvu: string;
    nameEdit: string;
    langkey: string;
    FilterID0: boolean;
    FilterID1: boolean;
    FilterID2: boolean;
    FilterID3: boolean;
    FilterID4: boolean;
    FilterID5: boolean;
    FilterID6: boolean;
    FilterID7: boolean;
    FilterID8: boolean;

    emty() {
        this.id_project = 0;
        this.id_priority = 0;
        this.isHidden = false;
        this.loainhiemvu = '';
        this.nameEdit = '';
        this.langkey = '';
        this.FilterID0 = false;
        this.FilterID1 = false;
        this.FilterID2 = false;
        this.FilterID3 = false;
        this.FilterID4 = false;
        this.FilterID5 = false;
        this.FilterID6 = false;
        this.FilterID7 = false;
        this.FilterID8 = false;
    }
}
export class Duan {
    options: number;
    keyword: string;
    emty() {
        this.options = 0;
        this.keyword = '';
    }
}
export class InsertTags {
    _isEditMode: boolean;
    _isNew: boolean;
    _isUpdate: boolean;
    _isDeleted: boolean;
    _defaultFieldName: string;
    _userId: number;
    id_row: number;
    color: string;
    title: string;
    id_project_team: number;
    project_team: string;
    rowid: number;
    type: number;
    id: number;
    emty() {
        this._isEditMode=false;
        this._isNew=false;
        this._isUpdate=false;
        this._isDeleted=false;
        this._defaultFieldName="";
        this._userId=0;
        this.id_row=0;
        this.color="";
        this.title="";
        this.id_project_team=0;
        this.project_team="";
        this.rowid=0;
        this.type=0;
        this.id=0;
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
export class ProjectTags{
    ProjectID:number;
    TagID:number;
    IsCheck:Boolean;
    emty(){
        this.ProjectID=0;
        this.TagID=0;
        this.IsCheck=false;
    }
}