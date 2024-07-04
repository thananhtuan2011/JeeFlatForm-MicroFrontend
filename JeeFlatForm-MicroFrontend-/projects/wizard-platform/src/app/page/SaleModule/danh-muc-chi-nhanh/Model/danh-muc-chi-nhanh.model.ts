import { BaseModel } from "../../../models/_base.model";

export class DM_CNModel extends BaseModel {
	IDChiNhanh: number
	MaChiNhanh: string
	TenChiNhanh: string
	GhiChu: string
	DiaChi: string
	DienThoai: string
	IDTinhThanh: number;
	IDQuanHuyen: number;
	IDPhuongXa: number;
	FromTime: string
	ToTime: string
	IsOpen: boolean
	
	clear() {
			this.IDChiNhanh = 0;
			this.MaChiNhanh = '';
			this.TenChiNhanh = '';
			this.GhiChu = '';
			this.DiaChi = '';
			this.DienThoai = '';
			this.IDTinhThanh = 0;
			this.IDQuanHuyen = 0;
			this.IDPhuongXa = 0;
			this.FromTime = '';
			this.ToTime = '';
			this.IsOpen = false;
	}

}