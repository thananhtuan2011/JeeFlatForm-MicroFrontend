
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { finalize, share, tap } from 'rxjs/operators';
import { QueryFilterComment, UserCommentInfo, PostCommentModel, ReactionCommentModel } from './jee-comment.model';
import { NotifiModel } from './notifi.model';
import { environment } from 'src/environments/environment';
import { HttpUtilsService } from 'src/app/modules/crud/utils/http-utils.service';

const API_JEECOMMENT_URL = environment.HOST_JEECOMMENT_API + '/api';
const API_JEEACCOUNT_URL = environment.HOST_JEEACCOUNT_API + '/api';
const JEEWORK_API = environment.HOST_JEEWORK_API_2023 + "/api";
const JEETEAM_API = environment.HOST_JEETEAM_API + '/api';
const API_CMT = environment.HOST_JEEWORK_API_2023 + "/api/comment";

@Injectable()
export class JeeCommentService {
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _errorMessage$ = new BehaviorSubject<string>('');
  private _lstUser: UserCommentInfo[] = [];
  public _usernameRep$ = new BehaviorSubject<any>(null);
  private _mainUser$: BehaviorSubject<UserCommentInfo> = new BehaviorSubject<UserCommentInfo>(new UserCommentInfo());
  private readonly _reloadComment = new BehaviorSubject<any>(
    undefined
  );
  readonly _reloadComment$ = this._reloadComment.asObservable();

  get data_share() {
    return this._reloadComment.getValue();
  }
  set data_share(val) {
    this._reloadComment.next(val);
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }

  get mainUser$() {
    return this._mainUser$.asObservable();
  }

  get mainUser() {
    return this._mainUser$.value;
  }

  get lstUser() {
    return this._lstUser;
  }

  // tiếng việt icon
  public i18n = {
    search: 'Tìm kiếm',
    emojilist: 'Danh sách Emoji',
    notfound: 'Không tìm thấy Emoji ',
    clear: 'Xoá sạch',
    categories: {
      search: 'Kết quả',
      recent: 'Sử dụng thường xuyên',
      people: 'Biểu tượng mặt cười & Con người',
      nature: 'Động vật & Thiên nhiên',
      foods: 'Đồ ăn & Nước uống',
      activity: 'Hoạt động',
      places: 'Du lịch & Nghỉ dưỡng',
      objects: 'Đồ vật',
      symbols: 'Biểu tượng',
      flags: 'Cờ',
      custom: 'Custom',
    },
    skintones: {
      1: 'Default Skin Tone',
      2: 'Light Skin Tone',
      3: 'Medium-Light Skin Tone',
      4: 'Medium Skin Tone',
      5: 'Medium-Dark Skin Tone',
      6: 'Dark Skin Tone',
    },
  };

  constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
    this.getlstUserCommentInfo();
  }

  public showTopicCommentByObjectID(objectID: string, filter: QueryFilterComment): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.getHttpParamsFilter(filter);
    const url = API_JEECOMMENT_URL + `/comments/show/${objectID}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  public showChangeTopicCommentByObjectID(objectID: string, filter: QueryFilterComment): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.getHttpParamsFilter(filter);
    const url = API_JEECOMMENT_URL + `/comments/showChange/${objectID}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  public showChangeComment(objectID: string, commentID: string, filter: QueryFilterComment): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.getHttpParamsFilter(filter);
    const url = API_JEECOMMENT_URL + `/comments/showChange/${objectID}/${commentID}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  public showFullComment(objectID: string, commentID: string, filter: QueryFilterComment): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const httpParams = this.getHttpParamsFilter(filter);
    const url = API_JEECOMMENT_URL + `/comments/show/${objectID}/${commentID}`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
      params: httpParams,
    });
  }

  private getHttpParamsFilter(filter: QueryFilterComment): HttpParams {
    let query = new HttpParams().set('ViewLengthComment', filter.ViewLengthComment.toString()).set('Date', filter.Date.toISOString());
    return query;
  }

  public getAuthFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }

  public getlstUserCommentInfo() {
    this.getDSUserCommentInfo()
      .pipe(
        tap((res) => {
          if (res) {
            const usernamelogin = this.getAuthFromLocalStorage()['user']['username'];
            res.data.forEach((element) => {
              // init ListUserCommentInfo
              const item = new UserCommentInfo();
              item.Username = element.Username;
              item.AvartarImgURL = element.AvartarImgURL;
              item.PhoneNumber = element.PhoneNumber;
              item.Email = element.Email;
              item.Jobtitle = element.Jobtitle;
              item.FullName = element.FullName;
              item.Display = element.FullName ? element.FullName : element.Username;
              item.BgColor = element.BgColor;
              item.FirstName = element.FirstName;
              item.UserId = element.UserId;
              this._lstUser.push(item);

              // init main User Login
              if (usernamelogin === item.Username) this._mainUser$.next(item);
            });
            this._lstUser.sort((a, b) => a.FullName.localeCompare(b.FullName));
          } else {
            this._errorMessage$.next(res.error.message);
            return of();
          }
        }),
        finalize(() => {
          this._isLoading$.next(false);
        }),
        share()
      )
      .subscribe();
  }
  public PushNotifi(item: NotifiModel): Observable<any> {
    const url = JEETEAM_API + '/notifi' + `/PushNotifi`;
    return this.http.post<any>(url, item, {
    });
  }
  public PushNotifiTagNameComment(item: NotifiModel): Observable<any> {
    const url = JEETEAM_API + '/notifi' + `/PushNotifiTagNameComment`;
    return this.http.post<any>(url, item, {
    });
  }
  public getDSUserCommentInfo(): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEEACCOUNT_URL + `/accountmanagement/usernamesByCustermerID`;
    return this.http.get<any>(url, {
      headers: httpHeaders,
    });
  }

  public getDisplay(username?: string): string {
    const object = this._lstUser.find((element) => element.Username === username);
    if (object) return object.Display;
    return username;
  }

  public getUriAvatar(username?: string): string {
    const avatar = this._lstUser.find((element) => element.Username === username);
    if (avatar) return avatar.AvartarImgURL;
    return 'https://cdn.jee.vn/jee-account/images/avatars/default2.png';
  }

  public postCommentModel(model: PostCommentModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEECOMMENT_URL + `/comments/postcomment`;
    return this.http.post<any>(url, model, {
      headers: httpHeaders,
    });
  }

  public postReactionCommentModel(model: ReactionCommentModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEECOMMENT_URL + `/comments/postReactionComment`;
    return this.http.post<any>(url, model, {
      headers: httpHeaders,
    });
  }

  public updateCommentModel(model: PostCommentModel): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEECOMMENT_URL + `/comments/editComment`;
    return this.http.post<any>(url, model, {
      headers: httpHeaders,
    });
  }

  public deleteComment(topiccommentid: string, commentid: string): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEECOMMENT_URL + `/comments/delete/${topiccommentid}/${commentid}`;
    return this.http.delete<any>(url, {
      headers: httpHeaders,
    });
  }

  public deleteReplyComment(topiccommentid: string, commentid: string, replycommentid: string): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_JEECOMMENT_URL + `/comments/delete/${topiccommentid}/${commentid}/${replycommentid}`;
    return this.http.delete<any>(url, {
      headers: httpHeaders,
    });
  }
  public getTopicObjectIDByComponentNameJeeTeam(componentName: number): Observable<string> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = JEETEAM_API + `/comments/getByComponentName/${componentName}`;
    return this.http.get(url, {
      headers: httpHeaders,
      responseType: 'text'
    });
  }
  public getTopicObjectIDByComponentNamePrivate(componentName: number): Observable<string> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = JEETEAM_API + `/comments/GetByComponentNamePrivate/${componentName}`;
    return this.http.get(url, {
      headers: httpHeaders,
      responseType: 'text'
    });
  }
  // hàm notify
  public notifyComment(item: any) { }

  //-----------Sử dung cho form JeeWork=================
  getTopicObjectIDByComponentName(componentName: string): Observable<string> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = JEEWORK_API + `/comments/getByComponentName/${componentName}`;
    return this.http.get(url, {
      headers: httpHeaders,
      responseType: "text",
    });
  }

  LuuLogcomment(model): Observable<any> {
    const httpHeaders = this.httpUtils.getHTTPHeaders();
    const url = API_CMT + `/luu-log-comment`;
    return this.http.post<any>(url, model, {
      headers: httpHeaders,
    });
  }

  //=========================================================
  getName(val) {
    var x = val.split(' ');
    return x[x.length - 1];
  }
  getColorNameUser(fullname) {
    var name = this.getNameUser(fullname).substr(0, 1);
    switch (name) {
      case 'A':
        return '#6FE80C';
      case 'B':
        return '#02c7ad';
      case 'C':
        return 'rgb(123, 104, 238)';
      case 'D':
        return '#16C6E5';
      case 'Đ':
        return '#959001';
      case 'E':
        return '#16AB6B';
      case 'G':
        return '#2757E7';
      case 'H':
        return '#B70B3F';
      case 'I':
        return '#390FE1';
      case 'J':
        return 'rgb(4, 169, 244)';
      case 'K':
        return '#2209b7';
      case 'L':
        return '#759e13';
      case 'M':
        return 'rgb(255, 120, 0)';
      case 'N':
        return '#bd3d0a';
      case 'O':
        return '#10CF99';
      case 'P':
        return '#B60B6F';
      case 'Q':
        return 'rgb(27, 188, 156)';
      case 'R':
        return '#6720F5';
      case 'S':
        return '#14A0DC';
      case 'T':
        return 'rgb(244, 44, 44)';
      case 'U':
        return '#DC338B';
      case 'V':
        return '#DF830B';
      case 'X':
        return 'rgb(230, 81, 0)';
      case 'W':
        return '#BA08C7';
      default:
        return '#21BD1C';
    }
  }
  getNameUser(val) {
    if (val) {
      var list = val.split(' ');
      return list[list.length - 1];
    }
    return '';
  }
}
