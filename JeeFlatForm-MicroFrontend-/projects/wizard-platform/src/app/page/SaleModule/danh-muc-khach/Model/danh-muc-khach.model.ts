import { BaseModel } from "../../../models/_base.model";

export class DM_KHModel extends BaseModel {
	IDKhachHang: number 
	IDNhomKhachHang: number
	IDKhachHangCha: number 
	MaKhachHang: string 
	TenKhachHang: string 
	IDQuanHuyen: number 
	IDTinhThanh: number
	IDPhuongXa: number 
	DiaChi: string 
	Email: string 
	DienThoai: string 
	Fax: string 
	GioiTinh: number 
	NgaySinh: string 
	MaSoThue: string 
	NguoiDaiDien: string 
	ThoiHanThanhToan: number
	GioiHanNo: number
	GhiChu: string 
	CMND: string

	isError: boolean
	Message: string
	NhomKhachHang: string
	TinhThanh: string
	QuanHuyen: string

	NoDauKy: number
	GroupsID: any[];

	clear() {
			this.IDKhachHang = 0;
			this.IDNhomKhachHang = 0;
			this.IDKhachHangCha = 0;
			this.MaKhachHang = '';
			this.TenKhachHang = '';
			this.IDQuanHuyen = 0;
			this.IDTinhThanh = 0;
			this.IDPhuongXa = 0;
			this.DiaChi = '';
			this.Email = '';
			this.DienThoai = '';
			this.Fax = '';
			this.GioiTinh = 0;
			this.NgaySinh = null;
			this.MaSoThue = '';
			this.NguoiDaiDien = '';
			this.ThoiHanThanhToan = 0;
			this.GioiHanNo = 0;
			this.GhiChu = '';
			this.CMND = ''

			this.isError = false;
			this.Message = "";
			this.NhomKhachHang = "";
			this.TinhThanh = "";
			this.QuanHuyen = "";

			this.NoDauKy = 0;
			this.GroupsID = [];
	}

	copy(item: DM_KHModel) {
			this.IDKhachHang = item.IDKhachHang;
			this.IDNhomKhachHang = item.IDNhomKhachHang;
			this.IDKhachHangCha = item.IDKhachHangCha;
			this.MaKhachHang = item.MaKhachHang;
			this.TenKhachHang = item.TenKhachHang;
			this.IDQuanHuyen = item.IDQuanHuyen;
			this.IDTinhThanh = item.IDTinhThanh;
			this.IDPhuongXa = item.IDPhuongXa;
			this.DiaChi = item.DiaChi;
			this.Email = item.Email;
			this.DienThoai = item.DienThoai;
			this.Fax = item.Fax;
			this.GioiTinh = item.GioiTinh;
			this.NgaySinh = item.NgaySinh;
			this.MaSoThue = item.MaSoThue;
			this.NguoiDaiDien = item.NguoiDaiDien;
			this.ThoiHanThanhToan = item.ThoiHanThanhToan;
			this.GioiHanNo = item.GioiHanNo;
			this.GhiChu = item.GhiChu;
			this.CMND = item.CMND;

			this.isError =  item.isError;
			this.Message = item.Message;
			this.NhomKhachHang = item.NhomKhachHang;
			this.TinhThanh = item.TinhThanh;
			this.QuanHuyen = item.QuanHuyen;

			this.NoDauKy = item.NoDauKy;
			this.GroupsID = item.GroupsID;
	}
}