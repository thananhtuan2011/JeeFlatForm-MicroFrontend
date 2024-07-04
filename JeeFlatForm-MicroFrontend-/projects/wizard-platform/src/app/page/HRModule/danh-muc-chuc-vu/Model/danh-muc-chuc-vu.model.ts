import { BaseModel } from "../../../models/_base.model";

export class ChucVuModel extends BaseModel {
	Id_row: number;
	Id_CV: string;
	Tenchucdanh: string;
	Tentienganh: string;
	tenchucvu: string;

	clear() {
		this.Id_CV = '';
		this.Tenchucdanh = '';
		this.Tentienganh = '';
		this.tenchucvu = '';
		this.Id_row=0;
	}
}