import { BaseModel } from "../../../share/models/base.model";
export interface CauHoiKhaoSatModel extends BaseModel  {
  Id: number;
  NoiDungCauHoi: string;
	allowEdit : boolean;
  CreatedDate:string;
  IdCauTraLoi:number;
  CauTraLoi:string;
  Type:number;
}

