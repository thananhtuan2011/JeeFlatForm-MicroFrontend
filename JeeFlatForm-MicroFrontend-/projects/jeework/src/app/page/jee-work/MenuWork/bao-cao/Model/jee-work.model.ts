import { BaseModel } from "../../../models/_base.model";


export class ToDoDataModel extends BaseModel {
	RowID: number;
	TaskName: string;
	Description: string;
	NumberofTime: string;
	Time_Type: string;
	Data_Implementer: any[] = [];
	Data_Follower: any[] = [];
	Priority: number;
	NodeID: number;
	clear() {
		this.RowID = 0;
		this.TaskName = "";
		this.Description = ""
		this.NumberofTime = "";
		this.Time_Type = "";
		this.Data_Implementer = [];
		this.Data_Follower = [];
		this.Priority = 0;
		this.NodeID;
	}
}

export class BaoCaoCongViecModel {
	id_row: number;
	so_hieu_vb: string;
	ngay_vb: string;
	trich_yeu_vb: string;
	dsfollower: string;
	noi_dung: string;
	don_vi_thuc_hien: string;
	han_xu_ly: string;
	is_cht_ch: number;
	is_cht_qh: number;
	is_ht_dh: number;
	is_ht_qh: number;
	constructor(
		id_row: number = 0,
		so_hieu_vb: string = "",
		ngay_vb: string = "",
		trich_yeu_vb: string = "",
		dsfollower: string = "",
		noi_dung: string = "",
		don_vi_thuc_hien: string = "",
		han_xu_ly: string = "",
		is_cht_ch: number = 0,
		is_cht_qh: number = 0,
		is_ht_dh: number = 0,
		is_ht_qh: number = 0,
		){
		this.id_row = id_row;
		this.so_hieu_vb = so_hieu_vb;
		this.ngay_vb = ngay_vb;
		this.trich_yeu_vb = trich_yeu_vb;
		this.dsfollower = dsfollower;
		this.noi_dung = noi_dung;
		this.don_vi_thuc_hien = don_vi_thuc_hien;
		this.han_xu_ly = han_xu_ly;
		this.is_cht_ch = is_cht_ch;
		this.is_cht_qh = is_cht_qh;
		this.is_ht_dh = is_ht_dh;
		this.is_ht_qh = is_ht_qh;
	}
	clear() {
		this.id_row = 0;
		this.so_hieu_vb = "";
		this.ngay_vb = "";
		this.trich_yeu_vb = "";
		this.dsfollower ="";
		this.noi_dung = "";
		this.don_vi_thuc_hien = "";
		this.han_xu_ly = "";
		this.is_cht_ch = 0;
		this.is_cht_qh = 0;
		this.is_ht_dh = 0;
		this.is_ht_qh = 0;
	}
}


export class BaoCaoTheodoinhiemvuduocgiaoModel {
	id_row: number;
	so_hieu_vb: string;
	ngay_vb: string;
	trich_yeu_vb: string;
	noi_dung: string;
	dsfollower:string;
	don_vi_giao: string;
	nguoixuly:string;
	han_xu_ly: string;
	is_cht_ch: number;
	is_cht_qh: number;
	is_ht_dh: number;
	is_ht_qh: number;
	constructor(
		id_row: number = 0,
		so_hieu_vb: string = "",
		ngay_vb: string = "",
		trich_yeu_vb: string = "",
		noi_dung: string = "",
		dsfollower: string = "",
		don_vi_giao: string = "",
		nguoixuly:string="",
		han_xu_ly: string = "",
		is_cht_ch: number = 0,
		is_cht_qh: number = 0,
		is_ht_dh: number = 0,
		is_ht_qh: number = 0,
		){
		this.id_row = id_row;
		this.so_hieu_vb = so_hieu_vb;
		this.ngay_vb = ngay_vb;
		this.trich_yeu_vb = trich_yeu_vb;
		this.noi_dung = noi_dung;
		this.dsfollower = dsfollower;
		this.don_vi_giao = don_vi_giao;
		this.nguoixuly = nguoixuly;
		this.han_xu_ly = han_xu_ly;
		this.is_cht_ch = is_cht_ch;
		this.is_cht_qh = is_cht_qh;
		this.is_ht_dh = is_ht_dh;
		this.is_ht_qh = is_ht_qh;
	}
	clear() {
		this.id_row = 0;
		this.so_hieu_vb = "";
		this.ngay_vb = "";
		this.trich_yeu_vb = "";
		this.noi_dung = "";
		this.dsfollower = "";
		this.don_vi_giao = "";
		this.han_xu_ly = "";
		this.nguoixuly = "";
		this.is_cht_ch = 0;
		this.is_cht_qh = 0;
		this.is_ht_dh = 0;
		this.is_ht_qh = 0;
	}
}export class BaoCaoDuAnModel {
	id_row: number;
	title: string;
	num_work: number;
	hoanthanh: number;
	hoanthanh_dunghan: number;
	hoanthanh_cham: number;
	chuahoanthanh: number;
	chuahoanthanh_quahan: number;
	chuahoanthanh_conhan: number;
	chatluong: string;
	ghichu: string;
	tongvanban: number;
	constructor(
		id_row: number = 0,
		title: string = "",
		num_work: number = 0,
		hoanthanh: number = 0,
		hoanthanh_dunghan: number = 0,
		hoanthanh_cham: number = 0,
		chuahoanthanh: number = 0,
		chuahoanthanh_quahan: number = 0,
		chuahoanthanh_conhan: number = 0,
		chatluong: string = "",
		ghichu: string = "",
		tongvanban: number = 0
		){
		this.id_row = id_row;
		this.title = title;
		this.num_work = num_work;
		this.hoanthanh = hoanthanh;
		this.hoanthanh_dunghan = hoanthanh_dunghan;
		this.hoanthanh_cham = hoanthanh_cham;
		this.chuahoanthanh = chuahoanthanh;
		this.chuahoanthanh_quahan = chuahoanthanh_quahan;
		this.chuahoanthanh_conhan = chuahoanthanh_conhan;
		this.chatluong = chatluong;
		this.ghichu = ghichu;
		this.tongvanban = tongvanban;
	}
}

export class ReportModel extends BaseModel {
  loaicv: number;
  id_department: number;
  tien_do: number;
  id_user_giao: number;
  id_user_tao: number;
  TuNgay: string;
  DenNgay: string;
  collect_by: number;
  filter: number;
  id_project_team: number;
  all: boolean;
  clear(){
    this.loaicv = 0;
    this.id_department = 0;
    this.tien_do = 0;
    this.id_user_giao = 0;
    this.id_user_tao = 0;
    this.TuNgay = "";
    this.DenNgay = "";
    this.collect_by = 0;
    this.filter = 0;
    this.id_project_team = 0;
    this.all = true;
  }
}

export class NhiemVuDuocGiaoModel extends BaseModel {
    Data: any[] = [];
	Tong_data: any[] =[];
}
export class NhiemVuDuocTaoModel extends BaseModel {
    Data: any[] = [];
	Tong_data: any[] =[];
}
export class ExcelModel extends BaseModel {
    Data: any[] = [];
	Tong_data: any[] =[];
}
export class WorkViewModel extends BaseModel {
    id_row: number;
    workid: number;
    id_user: number;
    CreatedDate: string;
    clear() {
        this.id_row = 0;
        this.workid = 0;
        this.id_user = 0;
        this.CreatedDate = '';
    }
}

export class BaoCaoNhiemVuDaXoaModel {
	id_row: number;
	so_hieu_vb: string;
	ngay_vb: string;
	trich_yeu_vb: string;
	noi_dung: string;
	don_vi_thuc_hien: string;
	DeletedDate: string;
	DeletedBy: string;
	DeletedReason: string;
	constructor(
		id_row: number = 0,
		so_hieu_vb: string = "",
		ngay_vb: string = "",
		trich_yeu_vb: string = "",
		noi_dung: string = "",
		don_vi_thuc_hien: string = "",
		DeletedDate:string = "",
		DeletedBy:string = "",
		DeletedReason:string = "",
		){
		this.id_row = id_row;
		this.so_hieu_vb = so_hieu_vb;
		this.ngay_vb = ngay_vb;
		this.trich_yeu_vb = trich_yeu_vb;
		this.noi_dung = noi_dung;
		this.don_vi_thuc_hien = don_vi_thuc_hien;
		this.DeletedDate = DeletedDate;
		this.DeletedBy = DeletedBy;
		this.DeletedReason = DeletedReason;
	}
	clear() {
		this.id_row = 0;
		this.so_hieu_vb = "";
		this.ngay_vb = "";
		this.trich_yeu_vb = "";
		this.noi_dung = "";
		this.don_vi_thuc_hien = "";
		this.DeletedDate = "";
		this.DeletedBy = "";
		this.DeletedReason = "";
	}
}
