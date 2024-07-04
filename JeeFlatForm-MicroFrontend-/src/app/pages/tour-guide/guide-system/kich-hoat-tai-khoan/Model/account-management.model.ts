export class AccountManagementDTO {
  UserId: number;
  Username: string;
  _username: string;//Dùng mới
  FullName: string;
  AvartarImgURL: string;
  CustomerID: number;
  PhoneNumber: string;
  Email: string;
  re;
  Jobtitle: string;
  JobtitleID: number;
  NgaySinh: string;
  BgColor: string;
  FirstName: string;
  LastName: string;
  Department: string;
  DepartmentID: number;
  ChucVuID: string;
  StructureID: string;
  DirectManager: string;
  DirectManagerUserID: number;
  DirectManagerUsername: string;
  IsAdmin: boolean;
  IsActive: boolean;
  Note: string;
  UnitLevel: number;
  AccessLevel: number;
  //===========================================
  userId: number;
  staffId: number;
  gender: number;
  avatarURL: string;
  bgColor: string;
  departmemt: string;
  firstName: string;
  fullName: string;
  jobtitle: string;
  lastname: string;
  manager: string;
  phoneNumber: string;
  username: string;
  status: number;
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
export class AccountManagementModel {
  Fullname: string;
  ImageAvatar: string;
  Email: string;
  Username: string;
  Jobtitle: string;
  Departmemt: string;
  Phonemumber: string;
  Password: string;
  Birthday: string;
  AppCode: string[];
  AppID: number[];
  DepartmemtID: number;
  JobtitleID: number;
  StaffID: number;
  UnitLevel: number;
  AccessLevel: number;
  //===================
  avatar: string;
  departmemt: string;
  departmemtId: number;
  email: string;
  fullName: string;
  gender: number;
  jobtitle: string;
  jobtitleId: number;
  managerUsername: string;
  phoneNumber: string;
  staffId: number;
  staffTypeId: number;
  startDate: string;
  placeOfBirth: string;
  dateOfBirth: string;
  appCode: string[];
  appID: number[];
  constructor() {
    this.Fullname = '';
    this.ImageAvatar = '';
    this.Email = '';
    this.Username = '';
    this.Jobtitle = '';
    this.JobtitleID = 0;
    this.DepartmemtID = 0;
    this.Departmemt = '';
    this.Phonemumber = '';
    this.Password = '';
    this.AppCode = [];
    this.AppID = [];
    this.Birthday = '';
    this.StaffID = 0;
    this.UnitLevel = 0;
    this.AccessLevel = 0;
    //==============================
    this.avatar = '';
    this.departmemt = '';
    this.departmemtId = 0;
    this.email = '';
    this.fullName = '';
    this.gender = 0;
    this.jobtitle = '';
    this.jobtitleId = 0;
    this.managerUsername = '';
    this.phoneNumber = '';
    this.staffId = 0;
    this.dateOfBirth = '';
    this.placeOfBirth = '';
    this.appCode = [];
    this.appID = [];
  }
}

export class PostImgModel {
  imgFile: string;
  Username: string;
}

export class AccDirectManagerModel {
  Username: string;
  DirectManager: string;

  clear() {
    this.Username = '';
    this.DirectManager = '';
  }
}

export class AccChangeTinhTrangModel {
  Username: string;
  Note: string;

  clear() {
    this.Username = '';
    this.Note = '';
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
    this.Fullname = '';
    this.Name = '';
    this.Avatar = '';
    this.Jobtitle = '';
    this.Departmemt = '';
    this.Email = '';
    this.PhoneNumber = '';
    this.LastName = '';
    this.Username = '';
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

export interface DepartmentManagementDTO {
  DepartmentManager: string;
  DepartmentManagerUserID: string;
  DepartmentManagerUsername: string;
  DepartmentName: string;
  IsActive: boolean;
  Note: string;
  RowID: number;
  Description: string;
}

export interface JobtitleManagementDTO {
  Title: string;
  IsActive: boolean;
  Note: string;
  RowID: number;
  tenchucdanh: string;
  id_row: number;
}

export class PersionalInfoDTO {
  fullName: string;
  userID: number;
  gender: number;
  email: string;
  staffId: number;
}