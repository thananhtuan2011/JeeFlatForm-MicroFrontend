import { BaseModel } from "../../../models/_base.model";

export class DM_MatHangModel extends BaseModel {
        IDMatHang: number 
        MaHang: string  
        TenMatHang: string 
        TenKhac: string 
        IDLoaiMatHang: number 
        IDDVCB: number 
        IDNhanHieu: number 
        IDXuatXu: number 
        MoTa: string 
        Model: string 
        IsHangCu: boolean 
        DonGia: number 
        GiaVon: number 
        QuyDoi_DVT_Ban: number 
        ChiTietNhaCungCap: any 
        ChiTietMoTa: string 
        VAT: number 
        Barcode: string
        NgungKinhDoanh: boolean 
        Priority: number 
        ThuocTinhRieng: any 
        IDDVTCapHai: number 
        QuyDoi: number 
        GiaQuyDoi: number 
        TenHienThiWebsite: string 
        TonToiThieu: number
        TonToiDa: number
        
        //import
        LoaiMatHang: string 
        DonViTinh: string 
        NhaCungCap: string 

        isError: boolean
        Message: string

        HinhAnh: string
        listLinkImage: ListImageModel[]
        IsDepot: boolean
        IDDanhMuc: number
        IsHanSuDung: boolean
        GiaSi: number;
        GiaKhuyenMai: number

        clear() {
                this.IDMatHang = 0;
                this.MaHang = '';
                this.TenMatHang = '';
                this.TenKhac = '';
                this.IDLoaiMatHang = 0;
                this.IDDVCB = 0;
                this.IDNhanHieu = 0;
                this.IDXuatXu = 0;
                this.MoTa = '';
                this.Model = '';
                this.IsHangCu = false;
                this.DonGia = 0;
                this.GiaVon = 0;
                this.QuyDoi_DVT_Ban = 0;
                this.ChiTietNhaCungCap = [];
                this.ChiTietMoTa = '';
                this.VAT = 0;
                this.Barcode = '';
                this.NgungKinhDoanh = false;
                this.Priority = 3;
                this.IDDVTCapHai = 0;
                this.QuyDoi = 0;
                this.GiaQuyDoi = 0;
                this.TenHienThiWebsite = '';
                this.TonToiThieu = 0;
                this.TonToiDa = 0;
                this.isError = false;
                this.Message = "";
                this.HinhAnh = '';
                this.listLinkImage = [];
                this.IsDepot = true;
                this.IDDanhMuc = 0;
                this.IsHanSuDung = false;
                this.GiaSi = 0;
                this.GiaKhuyenMai = 0;
        }

        copy (item: DM_MatHangModel) {
                this.IDMatHang = item.IDMatHang;
                this.MaHang = item.MaHang;
                this.TenMatHang = item.TenMatHang;
                this.TenKhac = item.TenKhac;
                this.IDLoaiMatHang = item.IDLoaiMatHang;
                this.IDDVCB = item.IDDVCB;
                this.IDNhanHieu = item.IDNhanHieu;
                this.IDXuatXu = item.IDXuatXu;
                this.MoTa = item.MoTa;
                this.Model = item.Model;
                this.IsHangCu = item.IsHangCu;
                this.DonGia = item.DonGia;
                this.GiaVon = item.GiaVon;
                this.QuyDoi_DVT_Ban = item.QuyDoi_DVT_Ban;
                this.ChiTietNhaCungCap = item.ChiTietNhaCungCap
                this.ChiTietMoTa = item.ChiTietMoTa;
                this.VAT = item.VAT;
                this.Barcode = item.Barcode;
                this.NgungKinhDoanh = item.NgungKinhDoanh;
                this.Priority = item.Priority;
                this.IDDVTCapHai = item.IDDVTCapHai;
                this.QuyDoi = item.QuyDoi;
                this.GiaQuyDoi = item.GiaQuyDoi;
                this.TenHienThiWebsite = item.TenHienThiWebsite;
                this.TonToiThieu = item.TonToiThieu;
                this.TonToiDa = item.TonToiDa;
                this.isError = item.isError
                this.Message = item.Message
                this.HinhAnh = item.HinhAnh
                this.listLinkImage = item.listLinkImage
                this.IsDepot = item.IsDepot
                this.IDDanhMuc = item.IDDanhMuc
                this.IsHanSuDung = item.IsHanSuDung
                this.GiaSi = item.GiaSi
                this.GiaKhuyenMai = item.GiaKhuyenMai
        }
}

export class ListImageModel {
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

export class DM_MatHangImport extends DM_MatHangModel {

        isError: boolean 
        Message: string
}
