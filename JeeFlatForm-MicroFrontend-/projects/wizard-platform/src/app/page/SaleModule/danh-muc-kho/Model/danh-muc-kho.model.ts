import { BaseModel } from "../../../models/_base.model";

export class DM_KhoModel extends BaseModel {
	IDKho : number
	MaKho : string
	TenKho : string
	IDChiNhanh : number
	DiaChi: string
	DienThoai: string
	GhiChu: string
	TrangThai : number
	IsXetTon: boolean

	clear() {
			this.IDKho = 0;
			this.MaKho = '';
			this.TenKho = '';
			this.IDChiNhanh = 0;
			this.DiaChi = '';
			this.DienThoai = '';
			this.GhiChu = '';
			this.TrangThai = 1;
			this.IsXetTon = true;
	}

	copy(item:DM_KhoModel) {
			this.IDKho = item.IDKho;
			this.MaKho = item.MaKho;
			this.TenKho = item.TenKho;
			this.IDChiNhanh = item.IDChiNhanh;
			this.DiaChi = item.DiaChi;
			this.DienThoai = item.DienThoai;
			this.GhiChu = item.GhiChu;
			this.TrangThai = item.TrangThai;
			this.IsXetTon = item.IsXetTon;
	}
}