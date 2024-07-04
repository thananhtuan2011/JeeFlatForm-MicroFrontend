import { BaseModel } from "../../../models/_base.model";

export class DM_LoaiMatHangModel extends BaseModel {
	IDLoaiMatHang: number
	TenLoaiMatHang: string
	MoTaLMH: string
	DoUuTien: number
	IDCha: number
	IDLoaiRef: number
	GhiChu: string
	Loai: number

	HinhAnh: string
	listLinkImage: ListImageModel[]

	clear() {
			this.IDLoaiMatHang = 0;
			this.TenLoaiMatHang = '';
			this.MoTaLMH = '';
			this.DoUuTien = 1;
			this.IDCha = 0;
			this.GhiChu = '';
			this.IDLoaiRef = 0;
			this.Loai = 2; //1: loại, 2: danh mục

			this.HinhAnh = '';
	}
	copy(item: DM_LoaiMatHangModel) {
			this.IDLoaiMatHang = item.IDLoaiMatHang;
			this.GhiChu = item.GhiChu;
			this.TenLoaiMatHang = item.TenLoaiMatHang;
			this.MoTaLMH = item.MoTaLMH;
			this.DoUuTien = item.DoUuTien;
			this.IDCha = item.IDCha;
			this.IDLoaiRef = item.IDLoaiRef;
			this.Loai = item.Loai;

			this.HinhAnh = item.HinhAnh;
	}
}


export class ListImageModel  {
	strBase64: string;
	filename: string;
	src: string;
	IsAdd: boolean;
	IsDel: boolean;

	clear() {
		this.strBase64 = '';
		this.filename = '';
		this.src = '';
		this.IsAdd = true;
		this.IsDel = false;
	}
}
