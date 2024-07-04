import { BaseModel } from "../../../models/_base.model";

export class DM_NCCModel extends BaseModel {
	IDNhaCungCap: number
	MaNhaCungCap: string
	TenNhaCungCap: string
	DiaChi: string
	Email: string
	DienThoai: string
	GhiChu: string

	IDQuanHuyen: number 
	IDTinhThanh: number
	IDPhuongXa: number 

	isError: boolean
	Message: string

	clear() {
			this.IDNhaCungCap = 0;
			this.MaNhaCungCap = '';
			this.TenNhaCungCap = '';
			this.DiaChi = '';
			this.Email = '';
			this.DienThoai = '';
			this.GhiChu = '';
			this.IDQuanHuyen = 0;
			this.IDTinhThanh = 0;
			this.IDPhuongXa = 0;
			this.isError = false;
			this.Message = "";
	}
	copy(item: DM_NCCModel) {
			this.IDNhaCungCap = item.IDNhaCungCap;
			this.MaNhaCungCap = item.MaNhaCungCap;
			this.TenNhaCungCap = item.TenNhaCungCap;
			this.DiaChi = item.DiaChi;
			this.Email = item.Email;
			this.DienThoai = item.DienThoai;
			this.GhiChu = item.GhiChu;
			this.IDQuanHuyen = item.IDQuanHuyen;
			this.IDTinhThanh = item.IDTinhThanh;
			this.IDPhuongXa = item.IDPhuongXa;
			this.isError =  item.isError;
			this.Message = item.Message;
	}
}
