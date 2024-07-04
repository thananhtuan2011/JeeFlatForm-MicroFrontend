import { BaseModel } from "../../../models/_base.model";

export class ThayDoiCaLamViecNewModel extends BaseModel {
	ID_Row:string;
	ID_Row1:string
	ID_NV: string;;
	Thang:string;
	Nam:string;
	TuNgay:string;
	DenNgay:string;
	IsKhongTinhCN: boolean;
	ID_CaLamViec: string;
	ID_Loai:string;
	CaLamViec:string;
	CaID:string;
	Ngay:string;
	ListNgay: any[] = [];
	clear() {
		this.ID_Row = '';
		this.ID_Row1 = '';
		this.ID_NV = '';
		this.Thang = '';
		this.Nam = '';
		this.TuNgay = '';
		this.DenNgay = '';
		this.IsKhongTinhCN = true;
		this.ID_CaLamViec = '';
		this.ID_Loai = '';
		this.CaLamViec = '';
		this.CaID = '';
		this.Ngay = '';
		this.ListNgay = [];
	}
}

export class ImportXepCaModel extends BaseModel {
	File: string;
	FileName: string;
	Sheet:string;
	Image: string;
	strBase64: string;
	Year:string;
	Month:string;
	clear() {
		this.File = '';
		this.FileName = '';
		this.Sheet = '';
		this.Image = '';
		this.strBase64 = '';
		this.Year = '';
		this.Month = '';
	}
}
