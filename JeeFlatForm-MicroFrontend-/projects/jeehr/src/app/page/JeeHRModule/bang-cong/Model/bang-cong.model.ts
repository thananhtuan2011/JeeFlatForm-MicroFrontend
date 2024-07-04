
export class BangCongModel{
	ID_Row: number
	ID_HinhThuc: number;
	HinhThuc: string;
	SoNgay: string;
	GhiChu: string;
	GioNghi: string;
	NgayBatDau: string;
	NgayKetThuc: string;
	GioBatDau: string;
	GioKetThuc: string;
	Comment: string;
	thang: string;
	nam: string;
	ID: number;
	IsProcessed: string;
	Noidung: string;
	NoiDung: string;

	clear() {
		this.ID_Row = 0;
		this.ID = 0;
		this.ID_HinhThuc = 0;
		this.HinhThuc = '';
		this.SoNgay = '';
		this.GhiChu = '';
		this.GioNghi = '';
		this.NgayBatDau = '';
		this.NgayKetThuc = '';
		this.GioBatDau = '';
		this.GioKetThuc = '';
		this.Comment = '';
		this.NoiDung = '';

	}
}
