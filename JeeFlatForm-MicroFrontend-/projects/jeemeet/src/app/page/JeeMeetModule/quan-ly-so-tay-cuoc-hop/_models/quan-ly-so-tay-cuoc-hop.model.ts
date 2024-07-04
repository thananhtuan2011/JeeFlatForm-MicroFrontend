import { BaseModel } from "../../../share/models/base.model";

export interface SoTayCuocHopModel extends BaseModel  {
  // Id: number;
  MeetingContent: string;
  DiaDiem: string;
  FromTime:string;
  NoiDungGhiChu:string;
  IsXem:boolean;
  IdCuocHop:number;
	DSDVXuLy: any;
	ChiTietDG: any[];
}

