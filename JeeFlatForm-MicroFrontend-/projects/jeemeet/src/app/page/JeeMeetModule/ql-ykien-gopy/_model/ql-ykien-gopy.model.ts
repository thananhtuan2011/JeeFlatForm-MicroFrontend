import { BaseModel } from "../../../share/models/base.model";

export interface QuanLyYKienGopYModel extends BaseModel {
  RowID: number;
  MeetingContent: string;
  NoiDung: string;
    CreatedDate: string;
	allowEdit : boolean;
  IdCuocHop:number;
  IsActive:number;
  danhSachNguoiDung: []
	refresh_token: string
}
