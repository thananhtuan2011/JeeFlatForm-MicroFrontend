import { BaseModel } from "../../../share/models/base.model";
export interface BangKhaoSatModel extends BaseModel  {
  IdKhaoSat: number;
  TieuDe: string;
	allowEdit : boolean;
  CreatedDate:string;
  Id:number;
  NoiDungCauHoi:string
  RowID:number;
  // CauHoiKhaoSat:any
  CauHoiKhaoSat: any[];
  IsDel:number;
  IsActive:number;
  IsBatBuoc:number;
  IdCuocHop:number;
  IsAction:number;
  Type:number;
  NgayGiaHan:number;

	DSDVXuLy: any;
	ChiTietDG: any[];
	refresh_token: string
}

