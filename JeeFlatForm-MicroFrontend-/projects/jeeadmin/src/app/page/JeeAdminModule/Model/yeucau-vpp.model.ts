import { BaseModel } from "../../../models/_base.model"

export class YeuCauVPPModel extends BaseModel {
	IdPhieuYC: number
	MaPhieuYC: string
	IdPhongBan: number
	ThangNam: string
	LyDo: string
	listDetail: CT_YeuCauVPP_Model[]

	TenPhongBan: string
	NguoiYeuCau: any
	TrangThai: number
	NgayYeuCau: string
	AllowHuy: boolean
	IsDaNhan: boolean
	IsDaGiao: boolean
	LyDoKhongDuyet: string

	clear(){
		this.IdPhieuYC = 0;
		this.MaPhieuYC = '';
		this.IdPhongBan = 0;
		this.ThangNam = '';
		this.LyDo = '';
		this.listDetail = [];

		this.TenPhongBan = "";
		this.NguoiYeuCau = {};
		this.TrangThai = 0;
		this.NgayYeuCau = "";
		this.AllowHuy = false;
		this.IsDaNhan = false;
		this.IsDaGiao = false;
		this.LyDoKhongDuyet = '';
	}

}

export class CT_YeuCauVPP_Model extends BaseModel {
	IdRow: number
	IdPhieu: number
	IdVPP: number
	SLSuDung: number
	SLConLai: number
	SLYeuCau: number
	LyDoCT: string
	IsVuotHM: number

	clear(){
		this.IdRow = 0;
		this.IdPhieu = 0;
		this.IdVPP = 0;
		this.SLSuDung = 0;
		this.SLConLai = 0;
		this.SLYeuCau = 0;
		this.LyDoCT = "";
		this.IsVuotHM = 0;
	}

}

export class XuLyDuyetModel extends BaseModel {
	IdPhieuYC: number
	RowID: number
	Title: string
	IdRef: string
	LyDoKhongDuyet: string
	NodeID: number
	NodeType : number
	Loai: number

	clear(){
		this.IdPhieuYC = 0;
		this.RowID = 0;
		this.Title = "";
		this.IdRef = "";
		this.LyDoKhongDuyet = "";
		this.NodeID = 0;
		this.NodeType = 0;
		this.Loai = 0;
	}
}

export class XacNhanYeuCauModel extends BaseModel {
	IdPhieuYC: number;
	RowID: number
	Title: string
	IdRef: string
	NodeID: number
	NodeType : number
	Loai: number
	NgayGiao: string;

	clear() {
		this.IdPhieuYC = 0;
		this.NgayGiao = '';
		this.RowID = 0;
		this.Title = "";
		this.IdRef = "";
		this.NodeID = 0;
		this.NodeType = 0;
		this.Loai = 0;
	}
}