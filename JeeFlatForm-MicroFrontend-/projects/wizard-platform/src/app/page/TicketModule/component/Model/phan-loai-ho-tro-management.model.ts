
export class PhanloaihotroModel {
    public RowID: number;
    public Title: string;
    public CategoryID1: number;
    public AssignMethod: number;
    public Code: string;
    public SLA: number;
    public ThanhVienHoTro: any[];
    public ThanhVienHoTroDelete: any[];
    public NguoiQuanLy: any[];
    public NguoiQuanLyDelete: any[];
    public UserID_Username: string;
    clear() {
        this.RowID = 0;
        this.Title = '';
        this.CategoryID1 = 0;
        this.AssignMethod = 0;
        this.SLA = 0;
        this.Code = '';
        this.ThanhVienHoTro = [];
        this.ThanhVienHoTroDelete = [];
        this.NguoiQuanLy = [];
        this.NguoiQuanLyDelete = [];
    }
}

export interface PhanloaihotroDTO {
    RowID: number;
    Title: string;
    CategoryID1_Title: string;
    CategoryID1: number;
    AssignMethod: number;
    SLA: number;
    CreatedBy: number;
    CreatedDate: Date;
    Code: string;
    admin: Array_Admin[];
    agent: Array_Admin[];
} 

export interface CachgiaoviecCombo {
    value: number;
    viewValue: string; 
}
export interface Array_Admin {
    userid: number;
    fullname: string;
    username: string;
    mobile: string;
    tenchucdanh: string;
    image: string;
    email: string;
    isadmin: string;
    bgcolor: string;
    ngaysinh: string;
    customerid: string;
}

export interface LinhvucyeucauComboDTO {
    RowID: number;
    Title: string;
}