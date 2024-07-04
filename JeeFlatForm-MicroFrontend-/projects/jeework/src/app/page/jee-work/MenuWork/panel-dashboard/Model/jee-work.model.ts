import { BaseModel } from "../../../models/_base.model";

export class FileUploadModel extends BaseModel {
    IdRow: number;
    strBase64: string;
    filename: string;
    src: string;
    IsAdd: boolean;
    IsDel: boolean;
    IsImagePresent: boolean;
    link_cloud: string;
    clear() {
        this.IdRow = 0;
        this.strBase64 = '';
        this.filename = '';
        this.src = '';
        this.IsAdd = false;
        this.IsDel = false;
        this.IsImagePresent = false;
        this.link_cloud = '';
    }
}

export class UpdateWorkModel {
    id_row: number;
    key: string;
    value: string;
    id_log_action: string;
    IsStaff: boolean;
    values: Array<FileUploadModel> = [];
    status_type: string;
    FieldID: number;
    Value: string;
    WorkID: string;
    TypeID: string;

    clear() {
        this.id_row = 0;
        this.key = '';
        this.value = '';
        this.id_log_action = '';
        this.values = [];
        this.IsStaff = false;
    }
}

export class ExportBaocaoNhiemVuDaGiaoModel {
    id_row: number;
	so_hieu_vb: string;
	ngay_vb: string;
	trich_yeu_vb: string;
	noi_dung: string;
	don_vi_thuchien:string;
	don_vi_giao: string;
	nguoixuly:string;
	han_xu_ly: string;
	
	constructor(
		id_row: number = 0,
		so_hieu_vb: string = "",
		ngay_vb: string = "",
		trich_yeu_vb: string = "",
		noi_dung: string = "",
		don_vi_thuchien: string = "",
		don_vi_giao: string = "",
		nguoixuly:string="",
		han_xu_ly: string = "",

		){
		this.id_row = id_row;
		this.so_hieu_vb = so_hieu_vb;
		this.ngay_vb = ngay_vb;
		this.trich_yeu_vb = trich_yeu_vb;
		this.noi_dung = noi_dung;
		this.don_vi_thuchien = don_vi_thuchien;
		this.don_vi_giao = don_vi_giao;
		this.nguoixuly = nguoixuly;
		this.han_xu_ly = han_xu_ly;
	}
	clear() {
		this.id_row = 0;
		this.so_hieu_vb = "";
		this.ngay_vb = "";
		this.trich_yeu_vb = "";
		this.noi_dung = "";
		this.don_vi_thuchien = "";
		this.don_vi_giao = "";
        this.nguoixuly = "";
		this.han_xu_ly = "";
		
	}
}