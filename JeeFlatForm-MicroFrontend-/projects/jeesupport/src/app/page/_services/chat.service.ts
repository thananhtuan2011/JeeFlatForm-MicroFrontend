
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReplaySubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { HttpUtilsService } from '../../modules/crud/utils/http-utils.service';
import { QueryParamsModelNewLazy, QueryResultsModel } from '../_models/query-results.model';
import { environment } from 'projects/jeesupport/src/environments/environment';
import { NotifyMessage } from '../_models/NotifyMess';
@Injectable({
  providedIn: 'platform'
})
export class ChatService {
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  public reload$ = new BehaviorSubject<boolean>(false);
  public setTitle$ = new BehaviorSubject<boolean>(false);
  public InforUserChatWith$ = new BehaviorSubject<any>([]);
  public notify$ = new BehaviorSubject<any>(null);
  public ReloadCV$ = new BehaviorSubject<any>(null);
  public   data_share_count$ = new BehaviorSubject<any>("ress");

  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  public UpdateThemEvent = new BehaviorSubject<any>(null);


  private readonly countMessage = new BehaviorSubject<boolean>(
		false
	);
	readonly countMessage$ = this.countMessage.asObservable();

	get data_share() {
		return this.countMessage.getValue();
	}
	set data_share(val) {
		this.countMessage.next(val);
	}

  public CloseSearch = new ReplaySubject<boolean>(null);
  CloseSearch$ = this.CloseSearch.asObservable();

  private unreadmessageSource = new ReplaySubject<number>(1);
  countUnreadmessage$ = this.unreadmessageSource.asObservable();

  baseUrl = environment.apiUrl+'/api';
  private currentUserSource = new ReplaySubject<any>(1);
  currentUser$ = this.currentUserSource.asObservable();

  // public authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  constructor(private http: HttpClient,private httpUtils: HttpUtilsService)


  { }
  getSearch(id_group:number,vl:string,queryParams: QueryParamsModelNewLazy) {
    const httpHeaders = this.getHttpHeaders();
    const url =this.baseUrl+`/chat/Get_ListMessSearch?IdGroup=${id_group}&valueser=${vl}`;
		const httpParams = this.getFindHTTPParams(queryParams);
		return this.http.get<any>(url,{ headers: httpHeaders,params:  httpParams });
		
	}
  GetStoreSticker() {
    const httpHeaders = this.getHttpHeaders();
    const url =this.baseUrl+`/chat/GetStoreSticker`;
		return this.http.get<any>(url,{ headers: httpHeaders });
		
	}
  GetminilistSticker() {
    const httpHeaders = this.getHttpHeaders();
    const url =this.baseUrl+`/chat/GetminilistSticker`;
		return this.http.get<any>(url,{ headers: httpHeaders });
		
	}
  
  QuanLyStoreSticker() {
    const httpHeaders = this.getHttpHeaders();
    const url =this.baseUrl+`/chat/QuanLyStoreSticker`;
		return this.http.get<any>(url,{ headers: httpHeaders });
		
	}
  CheckConversation(usernamefriend:string)
  {
    const url =this.baseUrl+`/chat/GetChatWithFriend?usernamefriend=${usernamefriend}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetInforbyUserName(username:string)
  {
   const user=username.replace("\",\"", ";");
    const url =this.baseUrl+`/chat/GetnforUserByUserName?username=${username}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetnforUserByUserNameForMobile(username:string)
  {
    const url =this.baseUrl+`/chat/GetnforUserByUserNameForMobile?username=${username}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  
  GetCountUnreadMessage()
  {
    const url =this.baseUrl+`/chat/GetCountUnreadMessage`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  
  publishMessNotifyDeskTop(item:any)
  {
    const url =this.baseUrl+`/notifi/PushNotifyDesktop`;
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,item,{ headers: httpHeader});
  }
  // setCurrentUser(user: any){
  //   if(user){

  //     localStorage.setItem(this.authLocalStorageToken, JSON.stringify(user));
  //     this.currentUserSource.next(user.user.username);
  //   }
  // }

  getHttpHeaders() {

    const token = this.httpUtils.getToken()

    // console.log('auth.token',auth.access_token)
    let result = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization':'Bearer '+token,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return result;
  }
  getHttpHeaderFiles() {

    const token = this.httpUtils.getToken()
    let result = new HttpHeaders({
      'Authorization':'Bearer '+token,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return result;
  }
  GetContactChatUser()
  {
    const url =this.baseUrl+'/chat/Get_Contact_Chat'
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }


  
  GetUserReaction(idchat:number,type:number)
  {
    const url =this.baseUrl+`/chat/GetUserReaction?idchat=${idchat}&type=${type}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }


  // {reportProgress: true, observe: 'events'}

  GetTaoUserTaoCuocHop(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetTaoUserTaoCuocHop?IdGroup=${IdGroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetAllFile(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetAllFile?IdGroup=${IdGroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetTop4File(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetTop4File?IdGroup=${IdGroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  public getAuthFromLocalStorage(): any {
    
    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
      }
  GetImage(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetImage?IdGroup=${IdGroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetImageTop9(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetImageTop9?IdGroup=${IdGroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetConverstationDelete()
  {
    const url =this.baseUrl+`/chat/GetConverstationDelete`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }

  
  GetTagNameGroup(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetTagNameisGroup?IdGroup=${IdGroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  
    
  SearchTagNameisGroup(IdGroup:number,keysearch:string)
  {
    const url =this.baseUrl+`/chat/SearchTagNameisGroup?IdGroup=${IdGroup}&keysearch=${keysearch}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  AddMemberVote(item:any,key:string)
  {
    const url =this.baseUrl+`/chat/AddMemberVote?key=${key}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,item,{ headers: httpHeader});
  }
  EnCode(IdGroup:any,keyaction:string)
  {
    const url =this.baseUrl+`/chat/EnCode?IdGroup=${IdGroup}&keyaction=${keyaction}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null,{ headers: httpHeader});
  }
  GetSticker(GrSticker:any)
  {
    const url =this.baseUrl+`/chat/GetSticker?GrSticker=${GrSticker}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  ActionSticker(GrSticker:any,keyaction:string)
  {
    const url =this.baseUrl+`/chat/ActionSticker?GrSticker=${GrSticker}&keyaction=${keyaction}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null,{ headers: httpHeader});
  }
  
  HuyEnCode(IdGroup:any,)
  {
    const url =this.baseUrl+`/chat/HuyEnCode?IdGroup=${IdGroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null,{ headers: httpHeader});
  }
  
  
  RecoveryMess(idgroup:any)
  {
    const url =this.baseUrl+`/chat/RecoveryMess?IdGroup=${idgroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null,{ headers: httpHeader});
  }

  UpdateDisableConversation(idgroup:any)
  {
    const url =this.baseUrl+`/chat/UpdateDisableConversation?IdGroup=${idgroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null,{ headers: httpHeader});
  }

  

  
  
  addBinhChon(idroup:any,item:any)
  {
    const url =this.baseUrl+`/chat/addBinhChon?idGroup=${idroup}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,item,{ headers: httpHeader});
  }
  InsertReaction(idchat:number,IdGroup:number,type:number)
  {
    const url =this.baseUrl+`/chat/InsertReactionChat?idchat=${idchat}&IdGroup=${IdGroup}
    &type=${type}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null,{ headers: httpHeader});
  }
  getlist_Reaction()
  {
    const url =this.baseUrl+'/chat/GetDSReaction'
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  Get_DSVote(IdGroup,IdChat)
  {
    const url =this.baseUrl+`/chat/Get_DSVote?IdGroup=${IdGroup}&IdChat=${IdChat}`
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  
  GetInforUserChatWith(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetInforUserChatWith?IdGroup=${IdGroup}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  CheckEnCodeInConversation(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/CheckEnCodeInConversation?IdGroup=${IdGroup}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetLinkConversation(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetLinkConversation?IdGroup=${IdGroup}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetAllLinkConversation(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetAllLinkConversation?IdGroup=${IdGroup}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  
  UpdateURLBg(item)
  {
    const url =this.baseUrl+`/chat/UpdateURLBg`;
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,item,{ headers: httpHeader});
  }
    
  SaveLink(idGroup:number,data:any)
  {
    const url =this.baseUrl+`/chat/addLink?idGroup=${idGroup}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,data,{ headers: httpHeader});
  }
  
  GetUnreadMess(IdGroup:number)
  {
    const url =this.baseUrl+`/chat/GetUnreadMess?IdGroup=${IdGroup}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetUnreadMessInGroup(IdGroup:number,UserId:number)
  {
    const url =this.baseUrl+`/chat/GetUnreadMessInGroup?IdGroup=${IdGroup}&UserId=${UserId}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  publishMessNotifi(token:string,IdGroup:number,mesage:string,fullname:string,avatar:string,
    usernamereveice:any,isEncode:boolean,isSticker:boolean
    )
  {
    const url =this.baseUrl+`/notifi/publishMessNotifiTwoUser?token=${token}&IdGroup=${IdGroup}
    &mesage=${mesage}&fullname=${fullname}&avatar=${avatar}&usernamereveice=${usernamereveice}&isEncode=${isEncode}&isSticker=${isSticker}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  publishMessNotifiWebNoActive(token:string,IdGroup:number,mesage:string,fullname:string,avatar:string,
  isEncode:boolean,isSticker:boolean
    )
  {
    const url =this.baseUrl+`/notifi/publishMessNotifiTwoUserWeb?token=${token}&IdGroup=${IdGroup}
    &mesage=${mesage}&fullname=${fullname}&avatar=${avatar}&isEncode=${isEncode}&isSticker=${isSticker}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  publishMessNotifiWebNoActiveGroup(token:string,IdGroup:number,mesage:string,fullname:string,avatar:string,
    isEncode:boolean,isSticker:boolean
      )
    {
      const url =this.baseUrl+`/notifi/publishMessNotifiGroupWeb?token=${token}&IdGroup=${IdGroup}
      &mesage=${mesage}&fullname=${fullname}&avatar=${avatar}&isEncode=${isEncode}&isSticker=${isSticker}`;
      const httpHeader = this.getHttpHeaders();
      return this.http.get<any>(url,{ headers: httpHeader});
    }

  publishMessNotifiOfline(token:string,IdGroup:number,mesage:string,fullname:string,avatar:string)
  {
    const url =this.baseUrl+`/notifi/publishMessNotifiTwoUserOffLine?token=${token}&IdGroup=${IdGroup}
    &mesage=${mesage}&fullname=${fullname}&avatar=${avatar}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  publishNotifi(item:NotifyMessage): Observable<any>
  {

    const url =this.baseUrl+`/notifi/PushNotifiTagName`;
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,item,{ headers: httpHeader});
  }
  publishMessNotifiGroup(token:string,IdGroup:number,mesage:string,fullname:string)
  {
    const url =this.baseUrl+`/notifi/publishMessNotifiGroup?token=${token}&IdGroup=${IdGroup}
    &mesage=${mesage}&fullname=${fullname}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  getGroupName(idgroup:number,customerId:number)
  {
    const url =this.baseUrl+`/notifi/getGroupName?IdGroup=${idgroup}&customerId=${customerId}`
    // const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null);
  }

  publishMessNotifiGroupOffline(token:string,item:any,IdGroup:number,mesage:string,fullname:string)
  {
    const url =this.baseUrl+`/notifi/publishMessNotifiGroupOffline?token=${token}&IdGroup=${IdGroup}
    &mesage=${mesage}&fullname=${fullname}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,item,{ headers: httpHeader});
  }
  GetUserById(IdUser:number)
  {
    const url =this.baseUrl+`/chat/GetnforUserById?IdUser=${IdUser}`;
    const httpHeader = this.getHttpHeaders();
    return this.http.get<any>(url,{ headers: httpHeader});
  }
  GetMessDetailDefault(idgroup:number,idchat:number,queryParams:QueryParamsModelNewLazy )
  {

    const url =this.baseUrl+`/chat/Get_DetailMessDefault?IdGroup=${idgroup}&IdChat=${idchat}`;
    const httpHeader = this.getHttpHeaders();
    const httpParams = this.getFindHTTPParams(queryParams);
		return this.http.get<any>(url,{ headers: httpHeader,params:  httpParams });
  }


  getFindHTTPParams(queryParams): HttpParams {
		let params = new HttpParams()
			//.set('filter',  queryParams.filter )
			.set('sortOrder', queryParams.sortOrder)
			.set('sortField', queryParams.sortField)
			.set('page', (queryParams.pageNumber + 1).toString())
			.set('record', queryParams.pageSize.toString());
		let keys = [], values = [];
		if (queryParams.more) {
			params = params.append('more', 'true');
		}
		Object.keys(queryParams.filter).forEach(function (key) {
			if (typeof queryParams.filter[key] !== 'string' || queryParams.filter[key] !== '') {
				keys.push(key);
				values.push(queryParams.filter[key]);
			}
		});
		if (keys.length > 0) {
			params = params.append('filter.keys', keys.join('|'))
				.append('filter.vals', values.join('|'));
		}
		return params;
	}

   //begin load page-home
   GetListMess(queryParams:QueryParamsModelNewLazy , routeFind: string = ''): Observable<QueryResultsModel> {
    const url = this.baseUrl+routeFind;
    const httpHeader = this.getHttpHeaders();
    const httpParams = this.getFindHTTPParams(queryParams);
		return this.http.get<any>(url,{ headers: httpHeader,params:  httpParams });

	}
  GetListMessDetailBottom(queryParams:QueryParamsModelNewLazy , routeFind: string = ''): Observable<QueryResultsModel> {
    const url = this.baseUrl+routeFind;
    const httpHeader = this.getHttpHeaders();
    const httpParams = this.getFindHTTPParams(queryParams);
		return this.http.get<any>(url,{ headers: httpHeader,params:  httpParams });

	}

  GetListMessDetailTop(queryParams:QueryParamsModelNewLazy , routeFind: string = ''): Observable<QueryResultsModel> {
    const url = this.baseUrl+routeFind;
    const httpHeader = this.getHttpHeaders();
    const httpParams = this.getFindHTTPParams(queryParams);
		return this.http.get<any>(url,{ headers: httpHeader,params:  httpParams });

	}
  UpdateUnReadGroup(IdGroup:number,userUpdateRead:any,key:string)
  {
    const url =this.baseUrl+`/chat/UpdateDataUnreadInGroup?IdGroup=${IdGroup}&userUpdateRead=${userUpdateRead}&key=${key}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null,{ headers: httpHeader});
  }
  UpdateUnRead(IdGroup:number,UserId:number,key:string)
  {
    const url =this.baseUrl+`/chat/UpdateDataUnread?IdGroup=${IdGroup}&UserID=${UserId}&key=${key}`
    const httpHeader = this.getHttpHeaders();
    return this.http.post<any>(url,null,{ headers: httpHeader});
  }

  UploadfileLage(item:any,idGroup:number,IdChat:number)
  {
    const url =this.baseUrl+`/chat/UploadfileLage?IdGroup=${idGroup}&idchat=${IdChat}`
    const httpHeader = this.getHttpHeaderFiles();
    return this.http.post(url,item,{reportProgress: true, observe: 'events',headers: httpHeader});
  }
  UpdateIsDownload(idGroup:number,IdChat:number,id_attch:number)
  {
    const url =this.baseUrl+`/chat/UpdateIsDownload?idGroup=${idGroup}&idchat=${IdChat}&id_attch=${id_attch}`
    const httpHeader = this.getHttpHeaderFiles();
    return this.http.post(url,null,{headers: httpHeader});
  }
  
  set countUnreadMessage(value: number) {
    this.unreadmessageSource.next(value);
  }
}
