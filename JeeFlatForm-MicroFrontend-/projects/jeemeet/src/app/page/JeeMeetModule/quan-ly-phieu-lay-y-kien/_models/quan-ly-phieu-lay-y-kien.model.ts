import { BaseModel } from "../../../share/models/base.model";

export interface PhieuLayYKienModel extends BaseModel  {
	Id: number;
  TenPhongHop: string;
  MeetingContent: string;
  GhiChu: string;
  DiaDiem: string;
  FromTime:string;
  NoiDungGhiChu:string;
  IdCuocHop:number;
  IsXem:boolean;
	// DSDVXuLy: any;
	// ChiTietDG: any[];
}

