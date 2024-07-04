export  class  Message {
  keyEncode:string;
  IdChat: number;
  UserName: string;
  Content_mess: string;
  PathFile: string;
  IsDelAll: boolean;
  IsHidenAll: boolean;
  IsVideoFile: boolean;
  isFile: boolean;
  isTagName:boolean;
  isCall: boolean;
  isVote:boolean;
  TenFile: string;
  isGroup:boolean;
  isSticker:boolean;
  UrlSticker:string;
  IdGroup: number;
  Note:string;
  Attachment:any[];
  Attachment_File:any[];
  Videos:any[];
  isEncode:boolean;
  isInsertMember:boolean;
  //dateRead?: Date;
  IdMeeting:number
  CreatedDate: Date;
}
export  class  MessageError {
  IdChat: number;
  UserName: string;
  Content_mess: string;
  PathFile: string;
  IsDelAll: boolean;
  IsHidenAll: boolean;
  IsVideoFile: boolean;
  isFile: boolean;
  isTagName:boolean;
  isCall: boolean;
  isError: boolean;
  TenFile: string;
  isGroup:boolean;
  IdGroup: number;
  Note:string;
  Attachment:any[];
  InfoUser:any[];
  Attachment_File:any[];
  Videos:any[];
  Seen:any[];
  isInsertMember:boolean;
  //dateRead?: Date;
  CreatedDate: string;
}

