import { BaseModel } from "../../../models/_base.model";

export class StaffTypeModel extends BaseModel {
	Id_row: number;
	Tenloai: string;
	Code: string;
	IsBHXH: boolean;
	IsAnnualLeave: boolean;
	clear() {
		this.Id_row = 0;
		this.Tenloai = '';
		this.Code = '';
		this.IsBHXH = false;
		this.IsAnnualLeave = false;
	}
}