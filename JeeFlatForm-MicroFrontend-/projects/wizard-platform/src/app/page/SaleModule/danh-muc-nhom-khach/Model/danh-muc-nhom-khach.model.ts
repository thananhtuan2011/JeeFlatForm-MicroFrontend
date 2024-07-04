import { BaseModel } from "../../../models/_base.model";

export class DM_Loai_KHModel extends BaseModel {
	IDNhomKH: number
	MaNhomKH: string
	TenNhomKH: string
	GhiChu: string

	clear() {
			this.IDNhomKH = 0;
			this.MaNhomKH = '';
			this.TenNhomKH = '';
			this.GhiChu = '';
	}
	copy(item: DM_Loai_KHModel) {
			this.IDNhomKH = item.IDNhomKH;
			this.MaNhomKH = item.MaNhomKH;
			this.TenNhomKH = item.TenNhomKH;
			this.GhiChu = item.GhiChu;
	}
}