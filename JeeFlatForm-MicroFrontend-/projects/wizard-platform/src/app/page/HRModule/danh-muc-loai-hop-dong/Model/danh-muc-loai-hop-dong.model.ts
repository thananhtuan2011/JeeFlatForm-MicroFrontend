import { BaseModel } from "../../../models/_base.model";

export class ContractTypeModel extends BaseModel {
	Id_Row: number;
	TenLoai: string;
	MaLoai: string;
	IsBHXH: boolean;
	LaHopDongThuViec: boolean;
	ThoiHanHD: number;
	BatDauDongBH: boolean;
	KhongXacDinhThoiHan: boolean;
	NhacNhoHetHanHD: string;
	TenLoaiKhiIn: string;
	ThoiHanBaoTruoc: string;
	ID_FileIn: number;
	ID_LoaiNhanVien: number;
	DVThoiHanHD: number;
	ThuTuKyHD: string;
	MauDanhGiaID: number;
	clear() {
		this.Id_Row = 0;
		this.TenLoai = '';
		this.MaLoai = '';
		this.ThoiHanBaoTruoc = '';
		this.ID_FileIn = 0;
		this.ID_LoaiNhanVien = 0;
		this.ThoiHanHD = 0;
		this.DVThoiHanHD = 0;
		this.NhacNhoHetHanHD = '';
		this.ThuTuKyHD = '';
		this.MauDanhGiaID = 0;
		this.LaHopDongThuViec = false;
		this.BatDauDongBH = false;
		this.KhongXacDinhThoiHan = false;

	}
}