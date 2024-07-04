export interface PersonalInfo {
  Birthday: string;
  Phonenumber: string;
  Fullname: string;
  Name: string;
  Avatar: string;
  Jobtitle: string;
  Departmemt: string;
  Email: string;
  BgColor: string;
  Structure: string;
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
  StartDate: string;
  EndDate: string;
  Icon: string;
}
export class PostImgModel {
  imgFile: string;
  Username: string;
}

export class ChangePasswordModel {
  Username: string;
  PasswordOld: string;
  PaswordNew: string;
  isChange: boolean;
  DeviceName: string;
  IP:string;
}

export class ForgetPasswordModel {
  Code: string;
  UserID: string;
  Username: string;
  PaswordNew: string;
}

export class ForgetPasswordDP247Model {
  Code: string;
  Phone: string;
  PaswordNew: string;
  Hash: string;
  DeviceName: string;
}