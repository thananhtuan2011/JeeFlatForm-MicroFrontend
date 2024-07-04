import { BaseModel } from "src/app/modules/auth/models/query-params.model";

export class QLCuocHopModel extends BaseModel {
    ListDonVi: any[];
    TenCuocHop: string;
    ThoiGianBatDau: any;
    GioBatDau: string;
    ThoiLuongPhut: string;
    DiaChi: string;
    SoKyHieu: string;
    XacNhanThamGia: boolean;
    NhapTomTat: boolean;
    GhiChu: string;
    GhiChuChoNguoiThemTaiLieu: string;
    ListThamGia: any;
    ListTheoDoi: any;
    ListTomTat: any;
    ListKhachMoi: any;
    ListTPKhac: any;
    TenKhoaHop: string
    TenPhongHop: string;
    Id: number;
    IsDuyet: number;
    // IdKhaoSat:number;
    IdKey: number;
    IdThuMoi: number
    ZoomMeeting: boolean
    GoogleMeeting: boolean
    WebexMeeting: boolean
    TeamsMeeting: boolean
    OtherMeeting: boolean
    ListThemTaiLieu: any;
    token: string
    Link: string
    FileDinhKem: any[];
    FileDinhKemThuMoi: any[];
    TypeMeeting: string
    IdKhoaHop: number
    IdPhongHop: number
    IdDiagram: number
    IdDiagramOld: number
    LoginMeeting: boolean
    IdPhienHop: number
    PrivateMeeting: boolean = false;
    IdKyHop: number
    Type: number
    MaPX: number;
    isPopupOpen: boolean;
    ListDonVi_: any[];
    TaiLieu: number;
    VanThu: boolean;
    RowID: number;
    NoiDungThongBao: string
    clear() {
        this.MaPX = 0;
        this.TenCuocHop = "";
        // this.IdKhaoSat=0;
        this.ThoiGianBatDau = "";
        this.GioBatDau = "";
        this.ThoiLuongPhut = "";
        this.DiaChi = ""
        this.XacNhanThamGia = false;
        this.NhapTomTat = false;
        this.GhiChu = "";
        this.GhiChuChoNguoiThemTaiLieu = "";
        this.ListThamGia = [];
        this.ListTheoDoi = [];
        this.ListTomTat = [];
        this.ListThemTaiLieu = [];
        this.Id = 0
        this.IdKey = 0
        this.IdThuMoi = 0
        this.ZoomMeeting = false
        this.GoogleMeeting = false
        this.WebexMeeting = false
        this.token = "";
        this.IdKhoaHop = 0
        this.IdPhongHop = 0
        this.IdDiagram = 0
        this.IdDiagramOld = 0
        this.IdPhienHop = 0
        this.IdKyHop = 0
        this.Type = 0
    }
}


export class SurveyListModel {
    IdKhaoSat: number;
    IdRow: number;
    IdUser: number;
    Id: number;
    IdCuocHop: number;
    KetQua: number;
    IsDel: boolean
    CreatedDate: string;
    CreatedBy: number;
    DanhSachKetQua: any[];
    FileDinhKem: any[];

    clear() {
        this.IdKhaoSat = 0;
        this.IdRow = 0;
        this.IdUser = 0;
        this.Id = 0;
        this.IdCuocHop = 0;
        this.KetQua = 0;
        this.IsDel = false;
        this.CreatedDate = "";
        this.CreatedBy = 0;
        this.DanhSachKetQua = [];

    }

}
export class QuanLyPhieuLayYKienModel extends BaseModel {
    Id: number;
    TenPhongHop: string;
    MeetingContent: string;
    GhiChu: string;
    DiaDiem: string;
    FromTime: string;
    NoiDungGhiChu: string;
    IdCuocHop: number;
    IsXem: boolean;
    DSDVXuLy: any;
    ChiTietDG: any[];
    clear() {
        this.Id = 0;
        this.TenPhongHop = '';
        this.MeetingContent = '';
        this.GhiChu = '';
        this.DiaDiem = '';
        this.FromTime = '';
        this.NoiDungGhiChu = '';
        this.IdCuocHop = 0;
        this.IsXem = false;
    }
}

// export class ResultListModel  {
//     IdCauTraLoi: number;
//     Id: number;
//     KetQua: number;
//     GhiChu: string;
//     AnswerIdsModel: AnswerIdsModel[];
//     clear() {
//         this.IdCauTraLoi = 0;
//         this.Id = 0;
//         this.KetQua = 0;
//         this.GhiChu = "";
//         this.AnswerIdsModel=[];

//     }

// }


// export class AnswerIdsModel  {
//     IdCauTraLoi: number;
//     IdCauTraLois: number[];
//     clear() {
//         this.IdCauTraLoi = 0;
//         this.IdCauTraLois=[];

//     }

// }


export class DungChungFileModel extends BaseModel {
    ExtensionImg: any;
    strExtensionImg: string;
    ExtensionVideo: any;
    strExtensionVideo: string;
    ExtensionFile: any;
    strExtensionFile: string;
    ExtensionAudio: any;
    strExtensionAudio: string;

    // dùng quy định extension của file đính kèm
    clear() {
        this.ExtensionImg = ["png", "gif", "jpeg", "jpg"];
        this.strExtensionImg = "png, .gif, .jpeg, .jpg";
        this.ExtensionVideo = ["mp4", "mov", "avi", "gif", "mpeg", "flv", "wmv", "divx", "mkv", "rmvb", "dvd", "3gp", "webm"];
        this.strExtensionVideo = "mp4, .mov, .avi, .gif, .mpeg, .flv, .wmv, .divx, .mkv, .rmvb, .dvd, .3gp, .webm";
        this.ExtensionFile = ["xls", "xlsx", "doc", "docx", "pdf", "mp3", "zip", "7zip", "rar", "txt"];
        this.strExtensionFile = "xls, .xlsx, .doc, .docx, .pdf, .mp3, .zip, .7zip, .rar, .txt";
        this.ExtensionAudio = ["wav", "mp3", "ogg"];
        this.strExtensionAudio = "wav, .mp3, .ogg";

    }

    // dùng với dropdown có hỗ trợ tìm kiếm
    nonAccentVietnamese(str) {
        str = str.toLowerCase();
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
        str = str.replace(/đ/g, "d");
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, "");
        str = str.replace(/\u02C6|\u0306|\u031B/g, "");
        return str;

    }

    checkEmptyEditor(value): Boolean {//Kiểm tra nếu editor chỉ chứa khoảng trắng: true
        const html = value;
        const div = document.createElement('div');
        div.innerHTML = html;
        if (div.textContent.trim() == '') {
            let nodes = div.querySelectorAll("img,iframe,audio,video");
            if (nodes.length == 0) {//Không chứa các thẻ ở trên
                return true;
            }
        }
        return false;
    }
}
export class QuanLySoTayGhiChuCuocHopModel extends BaseModel {
    Id: number;
    MeetingContent: string;
    DiaDiem: string;
    FromTime: string;
    NoiDungGhiChu: string;
    IsXem: boolean;
    IdCuocHop: number;
    DSDVXuLy: any;
    ChiTietDG: any[];
    clear() {
        this.Id = 0;
        this.MeetingContent = '';
        this.DiaDiem = '';
        this.FromTime = '';
        this.NoiDungGhiChu = '';
        this.IdCuocHop = 0;
        this.IsXem = false;
    }
}

export class ThongKeDangCauHoiModel extends BaseModel {
    IdKhaoSat: number;
    IdCuocHop: number
    clear() {
        this.IdKhaoSat = 0;
        this.IdCuocHop = 0
    }
}
