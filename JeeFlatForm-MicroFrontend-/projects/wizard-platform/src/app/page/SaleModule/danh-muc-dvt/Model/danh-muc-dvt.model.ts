import { BaseModel } from "../../../models/_base.model";

export class DM_DVTModel extends BaseModel {
	IDDVT: number
	DonViTinh: string
	GhiChu: string

	isError: boolean
	Message: string

	clear() {
			this.IDDVT = 0;
			this.DonViTinh = '';
			this.GhiChu = '';
			this.isError = false;
			this.Message = "";
	}
	copy(item: DM_DVTModel) {
			this.IDDVT = item.IDDVT;
			this.DonViTinh = item.DonViTinh;
			this.GhiChu = item.GhiChu;
			this.isError = item.isError;
			this.Message = item.Message;
	}
}