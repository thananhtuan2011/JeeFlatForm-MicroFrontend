export class Category2{
  public  RowID:number;
  public  Title:string;
  public  Agent :People[];
  public  Admin :People[];
}

// export class TicketManagementDTO {
//   RowID: number;
//   IdUser: number;
//   SourceID: string;
//   Title: string;
//   TitleCategory: string;
//   TitleStatus: string;
//   StatusColor: string;
//   StatusID: number;
//   Agent: string;
//   Rating: number;
//   SourceType: number;
//   Follower: string;
//   Priority: number;
//   Tag: string;
//   TagColor: string;
//   AgentID: string;
// }

// import * as internal from "stream";

export class TicketPCManagementDTO{
  RowID :number;
  Title :string;
  Description :string;
  CreatedDate :string;
  Tag :Tag[];
  Rating :number;
  //khung giao dien 3
  Message :Message[];
  //public string CreatedBy { get; set; }
  //public string MeesageDate { get; set; }
  //public bool IsResponse { get; set; }
  //public bool IsRead { get; set; }
  //khung giao dien 4
  SourceType:number;
  Category: Category[];
  LatestReplyTime :string;
 Status :Status;
  Priority :number;
  User :People;
  Follower :People[];
  Agent :People[];
  Admin :People[];
  Activity:Activity[];
  Document:Document[];
  IsAccept: boolean;
  Content_rating:string;
  Time_rating:string;
}

// public class FileUploadModel
//     {
//         public long IdRow { get; set; }
//         public string strBase64 { get; set; }
//         public string filename { get; set; }
//         public string src { get; set; }
//         public bool IsAdd { get; set; }
//         public bool IsDel { get; set; }
//         public bool IsImagePresent { get; set; }
//         public string link_cloud { get; set; }
//     }

export class FileUploadModel{
  IdRow: number;
  strBase64: string;
  filename: string;
  src: string;
  IsAdd: boolean;
  IsDel: boolean;
  IsImagePresent: boolean;
  link_cloud: string;
  clear(){
    this.IdRow = 0;
    this.strBase64 = "";
    this.filename = "";
    this.src = "";
    this.IsAdd = true;
    this.IsDel = true;
    this.IsImagePresent = true;
    this.link_cloud = "";
  }
}

export interface Document{
  RowID:number;
  Link:string;
  Type:string;
  Name:string;

}
export interface Activity{
  RowID:number;
  TicketID:number;
  Time:string;
  ActionType:number;
  ActionText:string;
  userid:number;
  fullname:string;
}
export class TicKetActivityModel{
  RowID:number;
  TicketID:number;
  Time:string;
  ActionType:number;
  ActionText:string;
}
export class TicketMessagesManagementModel{
   RowID :number;
   Message :string;
   CreatedBy :string;
   CreatedDate:string;
   IsResponse:boolean;
   IsRead :boolean
  TicketID:number;
  fullname:string;
  username:string;
  tenchucdanh:string;
  image:string;
  email:string;
  bgcolor:string;

  isTagName:boolean;
  isGroup:boolean;
  IdGroup: number;
  Note:string;
  IsDelAll: boolean;
  IsVideoFile: boolean;
  isFile: boolean;
  Attachment:any[];

  isEncode: boolean;
}

export class TicketRequestManagementDTO{
  RowID :number;
  User :People;
  Title :string;
  Description :string;
  CreatedDate :string;
  Category: Category[];
  SourceType: number;
  Status :Status;
  Agent :People[];
  Rating: number;
  Follower :People[];
  Admin: People;
  Priority: number;
  Tag :Tag[];
}

export interface Message{
  RowID: number,
  Message: string,
  CreateddBy: number,
  CreatedDate: string,
  IsResponse: boolean,
  IsRead: boolean,
  fullname:string,
  username: string,
  tenchucdanh: string,
  image: string,
  email: string,
  bgcolor: string;
  disPlaytimeGroup :string;
}
export class TagColor{
  RowID: string;
  Tag: string;
  Color: string;
}

export class PriorityModel {
  RowID: number;
  Priority: number;
}

export interface DataFilterTicket {
  IsOpen: number;
  IsPending: number;
  IsOnHold: number;
  IsSolved: number;
  IsClosed: number;
  All: number;
  // ListCustomerIDSapHetHan: string[];
  // ListCustomerIDHetHan: string[];
  // ListCustomerIDSDangSuDung: string[];
}

export class UserJeeAccountDTO {
  bgcolor: string;
  customerid: number;
  email: string;
  fullname: string;
  image: string;
  isadmin: boolean;
  mobile: string;
  ngaysinh: Date;
  tenchucdanh: string;
  userid: number;
  username: string;
}

export class ChooseUserDTO {
  userid: number;
  username: string;
  image: string;
  hoten: string;
  tenchucdanh: string;
}

export interface AppListDTO {
  AppID: number;
  AppCode: string;
  AppName: string;
  Description: string;
  BackendURL: string;
  APIUrl: string;
  ReleaseDate: string;
  Note: string;
  CurrentVersion: string;
  LastUpdate: string;
  IsDefaultApp: boolean;
  IsAdmin: boolean;
  StartDate: string;
  EndDate: string;
}

export interface CheckEditAppListByDTO {
  AppID: number;
  AppCode: string;
  AppName: string;
  IsUsed: boolean;
  Disable: boolean;
}
// export class TicketManagementModel {
//   Fullname: string;
//   ImageAvatar: string;
//   Email: string;
//   Username: string;
//   Jobtitle: string;
//   Departmemt: string;
//   Phonemumber: string;
//   Password: string;
//   Birthday: string;
//   AppCode: string[];
//   AppID: number[];
//   DepartmemtID: number;
//   JobtitleID: number;
//   StaffID: number;
//   constructor() {
//     this.Fullname = '';
//     this.ImageAvatar = '';
//     this.Email = '';
//     this.Username = '';
//     this.Jobtitle = '';
//     this.JobtitleID = 0;
//     this.DepartmemtID = 0;
//     this.Departmemt = '';
//     this.Phonemumber = '';
//     this.Password = '';
//     this.AppCode = [];
//     this.AppID = [];
//     this.Birthday = '';
//     this.StaffID = 0;
//   }
// }

export class PostImgModel {
  imgFile: string;
  Username: string;
}

export class AccDirectManagerModel {
  Username: string;
  DirectManager: string;

  clear() {
    this.Username = "";
    this.DirectManager = "";
  }
}

export class AccChangeTinhTrangModel {
  Username: string;
  Note: string;

  clear() {
    this.Username = "";
    this.Note = "";
  }
}

export class InfoUserDTO {
  Fullname: string;
  Name: string;
  Avatar: string;
  Jobtitle: string;
  Departmemt: string;
  Email: string;
  PhoneNumber: string;
  LastName: string;
  Username: string;

  clear() {
    this.Fullname = "";
    this.Name = "";
    this.Avatar = "";
    this.Jobtitle = "";
    this.Departmemt = "";
    this.Email = "";
    this.PhoneNumber = "";
    this.LastName = "";
    this.Username = "";
  }
}

export interface JeeHRNhanVien {
  HoTen: string;
  NgaySinh: string;
  Structure: string;
  Phai: string;
  TenChucVu: string;
  MaNV: string;
  ID_NV: number;
  Email: string;
  TuNgay: string;
  NgayBatDauLamViec: Date;
  IDNV: number;
  Title: string;
  cmnd: string;
  avatar: string;
  username: string;
  structureid: number;
  jobtitleid: number;
  managerid: number;
  manager: string;
}
//--------------------------------------------------------------------------------------------------------------

export interface People {
  userid: number;
  fullname: string;
  username: string;
  tenchucdanh: string;
  image: string;
  email: string;
  bgcolor: string;
  createdby: number;
}

export interface Category {
  RowID:number;
  Title: string;
}
export interface Status {
  RowID: number;
  Title: string;
  Color: string;
}
export interface Tag {
  RowID: string;
  Tag: string;
  Color: string;
}

export class TicketManagementDTO2 {
  RowID: number;
  User: People;
  Title: string;
  Description: string;
  CreatedDate: string;
  Category: Category[];
  Status: Status;
  Agent: People[];
  Rating: number;
  SourceType: number;
  Follower: People[];
  Priority: number;
  Tag: Tag[];
  isNewChange: number = 0;
  SumMessage: number = 0;
}

export class TicketManagementModel {
  RowID: number;
  UserID: number;
  Title: string;
  Status: number;
  AgentID: number[];
  FollowerID: number[];
  SourceType: number;
  CategoryID:number;
  Priority: number;
  Rating: number;
  Description: string;
  Attachments: any[];
  Content_rating:string;
  clear() {
    this.UserID = 0;
    this.Title = "";
    this.Status = 0;
    this.AgentID = [];
    this.FollowerID = [];
    this.SourceType = 0;
    this.CategoryID=0;
    this.Priority = 0;
    this.Rating = 0;
    this.Description = "";
    this.Content_rating="";
  }
}


export interface Message {
  RowID: number;
  Message: string;
  CreateddBy: number;
  CreatedDate: string;
  IsResponse: boolean;
  IsRead: boolean;
  fullname: string;
  username: string;
  tenchucdanh: string;
  image: string;
  email: string;
  bgcolor: string;
}

export class ThirdPartyAppModel {
  RowID: number;
  AppName: string;
  CustomerID: number;
  LogoImg: string;
  Icon: Image;
  clear(){
    this.RowID = 0;
    this.AppName = "";
    this.CustomerID = 0;
    this.LogoImg = "";
    this.Icon = {strBase64:"",filename:""};
  }
}
export interface Image{
  strBase64: string;
  filename: string;
}


export class TicketAgentModel{
  RowID:number;
  UserID:number;
  TicketID:number;
  CreatedDate:string;
  CreatedBy:number;
  TimeSLA:number;
}

export  class  SeenMessModel {
  id_chat: number;

  CreatedBy: number;
  IdGroup: number;
  Avatar: string;
  Fullname:string;
  username:string;
  CustomerId:number;
}
