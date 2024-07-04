export class LeavePersonalModel {
	ID_Row: number
	ID_HinhThuc: string;
	HinhThuc: string;
	SoNgay: string;
	GhiChu: string;
	GioNghi: string;
	NgayBatDau: string;
	NgayKetThuc: string;
	GioBatDau: string;
	GioKetThuc: string;
	LyDo: string;
	//Shipper
	Buoi_NgayNghi: string;
	Buoi_NgayVaoLam: string;
	IsNghiDiDuLich: boolean;
	DiaDiem: string;

	clear() {
		this.ID_Row = 0;
		this.ID_HinhThuc = '';
		this.HinhThuc = '';
		this.SoNgay = '';
		this.GhiChu = '';
		this.GioNghi = '';
		this.NgayBatDau = '';
		this.NgayKetThuc = '';
		this.GioBatDau = '';
		this.GioKetThuc = '';
		this.LyDo = '';
		this.Buoi_NgayNghi = '';
		this.Buoi_NgayVaoLam = '';
		this.IsNghiDiDuLich = false;
		this.DiaDiem = '';
	}
}

export class OvertimeRegistrationModel {
	ID_Row: number
	id_duan: number;
	HinhThuc: string;
	SoGio: string;
	GhiChu: string;
	GioNghi: string;
	NgayTangCa: string;
	GioBatDau: string;
	GioKetThuc: string;
	LyDo: string;
	NguoiDuyet: string;
	OverTime: boolean;
	IsFixHours: boolean;
	workId: string;
	taskId: string;
	task_WorkId: string;
	clear() {
		this.ID_Row = 0;
		this.id_duan = 0;
		this.HinhThuc = '';
		this.SoGio = '';
		this.GhiChu = '';
		this.GioNghi = '';
		this.NgayTangCa = '';
		this.GioBatDau = '';
		this.GioKetThuc = '';
		this.LyDo = '';
		this.OverTime = false;
		this.IsFixHours = false;
		this.workId = '';
		this.taskId = '';
		this.task_WorkId = '';
	}
}

export class UserInfoModel {
	id_nv: number;
	id_user: number;
	hoten: string;
	tenchucdanh: string;
	image: string;
	mobile: string;
	username: string;
	admin: boolean;
	loai: number;
	id_row: number;
	clear() {
		this.id_nv = 0;
		this.id_user = 0;
		this.hoten = '';
		this.tenchucdanh = '';
		this.image = '';
		this.mobile = '';
		this.username = '';
		this.admin = false;
		this.id_row = 0;
		this.loai = 1; //1:giao việc, 2: theo dõi
	}
}

export class DuyetNghiPhepCTModel {
	ID_Row: number;
	ID: number;
	IsAccept: boolean;
	loai: number;
	HoTen: string;
	TenChucDanh: string;
	MaNV: string;
	BoPhan: string;
	BatDauTu: string;
	Den: string;
	HinhThuc: string;
	LyDo: string;
	Data_CapDuyet: any[] = [];
	Data_ApprovingUser: any[] = [];
	GhiChu: string;
	SoGio: string;
	LangCode: string;
	DataHtml: string;
	ShowWord: boolean;
	NguoiHuy: string;
	LyDoHuy: string;
	NgayHuy: string;
	IsDaHuy: boolean;
	clear() {
		this.ID_Row = 0;
		this.ID = 0;
		this.IsAccept = false;
		this.loai = 0;
		this.HoTen = '';
		this.TenChucDanh = '';
		this.MaNV = '';
		this.BoPhan = '';
		this.BatDauTu = '';
		this.Den = '';
		this.HinhThuc = '';
		this.LyDo = '';
		this.Data_CapDuyet = []
		this.Data_ApprovingUser = [];
		this.GhiChu = '';
		this.SoGio = '';
		this.LangCode = '';
		this.DataHtml = '';
		this.ShowWord = false;
		this.NguoiHuy = '';
		this.LyDoHuy = '';
		this.NgayHuy = '';
		this.IsDaHuy = false;
	}
}

export class ApprovalOTModel {
	ID_Row: number;
	ID: number;
	GhiChu: string;
	IsFinal: boolean;
	HoTen: string;
	Lydo: string;
	NgayTangCa: string;
	ThoiGian: string;
	SoGio: string;
	DuAn: string;
	lyDo: string;
	NgayGui: string;
	HinhThucChiTra: string;
	Data_CapDuyet: any[] = [];
	Data_ApprovingUser: any[] = [];
	LangCode: string;
	IsAccept: boolean;
	IsFixHours: boolean;
	TextHinhThucChiTra: string;
	workList: any[] = [];
	clear() {
		this.ID_Row = 0;
		this.GhiChu = '';
		this.IsFinal = false;
		this.HoTen = '';
		this.Lydo = '';
		this.NgayTangCa = '';
		this.ThoiGian = '';
		this.SoGio = '';
		this.DuAn = '';
		this.lyDo = '';
		this.NgayGui = '';
		this.Data_CapDuyet = []
		this.Data_ApprovingUser = [];
		this.LangCode = '';
		this.HinhThucChiTra = '';
		this.IsAccept = false;
		this.ID = 0;
		this.IsFixHours = false;
		this.TextHinhThucChiTra = '';
		this.workList = [];
	}
}

export class ChangeShiftStaffbyStaffModel {
	RowID: number;
	NgayThayDoi: string;
	NgayLamViec: string;
	HoTen: string;
	IDNV: string;
	CaThayDoi: string;
	CaThayDoiID: string;
	CaLamViecID: string;
	CaLamViec: string;
	GhiChu: string;
	LyDo: string;
	ngaythaydoichange: string;
	CaThayDoiList: any[] = [];
	clear() {
		this.RowID = 0;
		this.NgayThayDoi = '';
		this.NgayLamViec = '';
		this.IDNV = '';
		this.GhiChu = '';
		this.LyDo = '';
		this.CaThayDoi = '';
		this.CaLamViecID = '';
		this.CaThayDoiID = '';
		this.HoTen = '';
		this.LyDo = '';
		this.ngaythaydoichange = '';
	}
}

export class ChiTietDoiCaModel {
	ID_Row: number;
	ID: number;
	IsAccept: boolean;
	loai: number;
	HoTen: string;
	TenChucDanh: string;
	MaNV: string;
	BoPhan: string;
	BatDauTu: string;
	Den: string;
	HinhThuc: string;
	LyDo: string;
	Data_CapDuyet: any[] = [];
	Data_ApprovingUser: any[] = [];
	GhiChu: string;
	SoGio: string;
	LangCode: string;
	DataHtml: string;
	data: string;
	ShowWord: boolean;
	clear() {
		this.ID_Row = 0;
		this.ID = 0;
		this.IsAccept = false;
		this.loai = 0;
		this.HoTen = '';
		this.TenChucDanh = '';
		this.MaNV = '';
		this.BoPhan = '';
		this.BatDauTu = '';
		this.Den = '';
		this.HinhThuc = '';
		this.LyDo = '';
		this.Data_CapDuyet = []
		this.Data_ApprovingUser = [];
		this.GhiChu = '';
		this.SoGio = '';
		this.LangCode = '';
		this.DataHtml = '';
		this.data = '';
		this.ShowWord = false;
	}
}

export class NgayDoiCaModel {
	CaThayDoiID: string;
	Title_Merge: string;
	ngaylamviec: string;
	ngaythaydoichange: string;
	denngay: string;
	clear() {
		this.CaThayDoiID = '';
		this.Title_Merge = '';
		this.ngaylamviec = '';
		this.ngaythaydoichange = '';
		this.denngay = '';
	}
}

export class GuiGiaiTrinhChamCongModel {
	RowID: number;
	TimeStr: string;
	clear() {
		this.RowID = 0;
		this.TimeStr = '';
	}
}

export class ChiTietGiaiTrinhChamCongModel {
	RowID: number;
	Ngay: string;
	GioVao: string;
	GioRa: string;
	GioCanSua: string;
	LyDo: string;
	Thang: number;
	Nam: number;
	File: string;
	FileName: string;
	LyDoID: number;
	ContentType: string;
	clear() {
		this.RowID = 0;
		this.Ngay = '';
		this.GioVao = '';
		this.GioRa = '';
		this.GioCanSua = '';
		this.LyDo = '';
		this.Thang = 0;
		this.Nam = 0;
		this.File = '';
		this.FileName = '';
		this.LyDoID = 0;
		this.ContentType = '';
	}
}

export class XinThoiViecModel {
	Ngay: string;
	Lydo: string;
	NguoiDuyet: string;
	KhungDuyet: any[] = [];
	Status: string;
	lydo_duyet: string;
	clear() {
		this.Ngay = '';
		this.Lydo = '';
		this.NguoiDuyet = '';
		this.KhungDuyet = [];
		this.Status = '0';
		this.lydo_duyet = '';
	}
}

export class QuanLyDuyetModel {
	ID_Row: number;
	ID: number;
	IsAccept: boolean;
	loai: number;
	HoTen: string;
	TenChucDanh: string;
	MaNV: string;
	BoPhan: string;
	BatDauTu: string;
	Den: string;
	HinhThuc: string;
	LyDo: string;
	Data_CapDuyet: any[] = [];
	Data_ApprovingUser: any[] = [];
	GhiChu: string;
	SoGio: string;
	LangCode: string;
	DataHtml: string;
	data: string;
	ShowWord: boolean;
	clear() {
		this.ID_Row = 0;
		this.ID = 0;
		this.IsAccept = false;
		this.loai = 0;
		this.HoTen = '';
		this.TenChucDanh = '';
		this.MaNV = '';
		this.BoPhan = '';
		this.BatDauTu = '';
		this.Den = '';
		this.HinhThuc = '';
		this.LyDo = '';
		this.Data_CapDuyet = []
		this.Data_ApprovingUser = [];
		this.GhiChu = '';
		this.SoGio = '';
		this.LangCode = '';
		this.DataHtml = '';
		this.data = '';
		this.ShowWord = false;
	}
}

export class ChangeApproverData {
	id: string;
	note: string;
	approverId: string;
	roleId: string;
	formId:string;
	clear() {
		this.id = '';
		this.note = '';
		this.approverId = '';
		this.roleId = '';
		this.formId = '0';
	}
}
