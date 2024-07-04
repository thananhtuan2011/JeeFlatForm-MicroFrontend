"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ChatService = void 0;
var environment_1 = require("src/environments/environment");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var rxjs_2 = require("rxjs");
var http_1 = require("@angular/common/http");
var ChatService = /** @class */ (function () {
    function ChatService(http, presence, auth) {
        this.http = http;
        this.presence = presence;
        this.auth = auth;
        this._isLoading$ = new rxjs_1.BehaviorSubject(false);
        this.reload$ = new rxjs_1.BehaviorSubject(false);
        this.InforUserChatWith$ = new rxjs_1.BehaviorSubject([]);
        this.notify$ = new rxjs_1.BehaviorSubject(null);
        this.UpdateSLMess$ = new rxjs_1.BehaviorSubject(undefined);
        this.UnreadMess$ = new rxjs_1.BehaviorSubject(0);
        this.unreadmessageSource = new rxjs_2.ReplaySubject(1);
        this.countUnreadmessage$ = this.unreadmessageSource.asObservable();
        this.baseUrl = environment_1.environment.apiUrl + '/api';
        this.currentUserSource = new rxjs_2.ReplaySubject(1);
        this.currentUser$ = this.currentUserSource.asObservable();
        this.authLocalStorageToken = environment_1.environment.appVersion + "-" + environment_1.environment.USERDATA_KEY;
    }
    Object.defineProperty(ChatService.prototype, "isLoading$", {
        get: function () {
            return this._isLoading$.asObservable();
        },
        enumerable: false,
        configurable: true
    });
    ChatService.prototype.CheckConversation = function (usernamefriend) {
        var url = this.baseUrl + ("/chat/GetChatWithFriend?usernamefriend=" + usernamefriend);
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.GetCountUnreadMessage = function () {
        var url = this.baseUrl + "/chat/GetCountUnreadMessage";
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.setCurrentUser = function (user) {
        if (user) {
            localStorage.setItem(this.authLocalStorageToken, JSON.stringify(user));
            this.currentUserSource.next(user.user.username);
        }
    };
    ChatService.prototype.getAuthFromLocalStorage = function () {
        return this.auth.getAuthFromLocalStorage();
    };
    ChatService.prototype.getHttpHeaders = function () {
        var data = this.getAuthFromLocalStorage();
        // console.log('auth.token',auth.access_token)
        var result = new http_1.HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + data.access_token,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return result;
    };
    ChatService.prototype.getHttpHeaderFiles = function () {
        var data = this.getAuthFromLocalStorage();
        var result = new http_1.HttpHeaders({
            'Authorization': 'Bearer ' + data.access_token,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        return result;
    };
    ChatService.prototype.GetContactChatUser = function () {
        var url = this.baseUrl + '/chat/Get_Contact_Chat';
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.GetUserReaction = function (idchat, type) {
        var url = this.baseUrl + ("/chat/GetUserReaction?idchat=" + idchat + "&type=" + type);
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.GetTaoUserTaoCuocHop = function (IdGroup) {
        var url = this.baseUrl + ("/chat/GetTaoUserTaoCuocHop?IdGroup=" + IdGroup);
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.GetAllFile = function (IdGroup) {
        var url = this.baseUrl + ("/chat/GetAllFile?IdGroup=" + IdGroup);
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.GetImage = function (IdGroup) {
        var url = this.baseUrl + ("/chat/GetImage?IdGroup=" + IdGroup);
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.GetTagNameGroup = function (IdGroup) {
        var url = this.baseUrl + ("/chat/GetTagNameisGroup?IdGroup=" + IdGroup);
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.InsertReaction = function (idchat, IdGroup, type) {
        var url = this.baseUrl + ("/chat/InsertReactionChat?idchat=" + idchat + "&IdGroup=" + IdGroup + "\n    &type=" + type);
        var httpHeader = this.getHttpHeaders();
        return this.http.post(url, null, { headers: httpHeader });
    };
    ChatService.prototype.getlist_Reaction = function () {
        var url = this.baseUrl + '/chat/GetDSReaction';
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.GetInforUserChatWith = function (IdGroup) {
        var url = this.baseUrl + ("/chat/GetInforUserChatWith?IdGroup=" + IdGroup);
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.GetUnreadMess = function (IdGroup) {
        var url = this.baseUrl + ("/chat/GetUnreadMess?IdGroup=" + IdGroup);
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.GetUnreadMessInGroup = function (IdGroup, UserId) {
        var url = this.baseUrl + ("/chat/GetUnreadMessInGroup?IdGroup=" + IdGroup + "&UserId=" + UserId);
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.publishMessNotifi = function (token, IdGroup, mesage, fullname, avatar) {
        var url = this.baseUrl + ("/notifi/publishMessNotifiTwoUser?token=" + token + "&IdGroup=" + IdGroup + "\n    &mesage=" + mesage + "&fullname=" + fullname + "&avatar=" + avatar);
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.publishMessNotifiOfline = function (token, IdGroup, mesage, fullname, avatar) {
        var url = this.baseUrl + ("/notifi/publishMessNotifiTwoUserOffLine?token=" + token + "&IdGroup=" + IdGroup + "\n    &mesage=" + mesage + "&fullname=" + fullname + "&avatar=" + avatar);
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.publishNotifi = function (item) {
        var url = this.baseUrl + "/notifi/PushNotifiTagName";
        var httpHeader = this.getHttpHeaders();
        return this.http.post(url, item, { headers: httpHeader });
    };
    ChatService.prototype.publishMessNotifiGroup = function (token, IdGroup, mesage, fullname) {
        var url = this.baseUrl + ("/notifi/publishMessNotifiGroup?token=" + token + "&IdGroup=" + IdGroup + "\n    &mesage=" + mesage + "&fullname=" + fullname);
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.getGroupName = function (idgroup, customerId) {
        var url = this.baseUrl + ("/notifi/getGroupName?IdGroup=" + idgroup + "&customerId=" + customerId);
        // const httpHeader = this.getHttpHeaders();
        return this.http.post(url, null);
    };
    ChatService.prototype.publishMessNotifiGroupOffline = function (token, item, IdGroup, mesage, fullname) {
        var url = this.baseUrl + ("/notifi/publishMessNotifiGroupOffline?token=" + token + "&IdGroup=" + IdGroup + "\n    &mesage=" + mesage + "&fullname=" + fullname);
        var httpHeader = this.getHttpHeaders();
        return this.http.post(url, item, { headers: httpHeader });
    };
    ChatService.prototype.GetUserById = function (IdUser) {
        var url = this.baseUrl + ("/chat/GetnforUserById?IdUser=" + IdUser);
        var httpHeader = this.getHttpHeaders();
        return this.http.get(url, { headers: httpHeader });
    };
    ChatService.prototype.GetMessDetailDefault = function (idgroup, idchat, queryParams) {
        var url = this.baseUrl + ("/chat/Get_DetailMessDefault?IdGroup=" + idgroup + "&IdChat=" + idchat);
        var httpHeader = this.getHttpHeaders();
        var httpParams = this.getFindHTTPParams(queryParams);
        return this.http.get(url, { headers: httpHeader, params: httpParams });
    };
    ChatService.prototype.getFindHTTPParams = function (queryParams) {
        var params = new http_1.HttpParams()
            //.set('filter',  queryParams.filter )
            .set('sortOrder', queryParams.sortOrder)
            .set('sortField', queryParams.sortField)
            .set('page', (queryParams.pageNumber + 1).toString())
            .set('record', queryParams.pageSize.toString());
        var keys = [], values = [];
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
    };
    //begin load page-home
    ChatService.prototype.GetListMess = function (queryParams, routeFind) {
        if (routeFind === void 0) { routeFind = ''; }
        var url = this.baseUrl + routeFind;
        var httpHeader = this.getHttpHeaders();
        var httpParams = this.getFindHTTPParams(queryParams);
        return this.http.get(url, { headers: httpHeader, params: httpParams });
    };
    ChatService.prototype.GetListMessDetailBottom = function (queryParams, routeFind) {
        if (routeFind === void 0) { routeFind = ''; }
        var url = this.baseUrl + routeFind;
        var httpHeader = this.getHttpHeaders();
        var httpParams = this.getFindHTTPParams(queryParams);
        return this.http.get(url, { headers: httpHeader, params: httpParams });
    };
    ChatService.prototype.GetListMessDetailTop = function (queryParams, routeFind) {
        if (routeFind === void 0) { routeFind = ''; }
        var url = this.baseUrl + routeFind;
        var httpHeader = this.getHttpHeaders();
        var httpParams = this.getFindHTTPParams(queryParams);
        return this.http.get(url, { headers: httpHeader, params: httpParams });
    };
    ChatService.prototype.UpdateUnReadGroup = function (IdGroup, userUpdateRead, key) {
        var url = this.baseUrl + ("/chat/UpdateDataUnreadInGroup?IdGroup=" + IdGroup + "&userUpdateRead=" + userUpdateRead + "&key=" + key);
        var httpHeader = this.getHttpHeaders();
        return this.http.post(url, null, { headers: httpHeader });
    };
    ChatService.prototype.UpdateUnRead = function (IdGroup, UserId, key) {
        var url = this.baseUrl + ("/chat/UpdateDataUnread?IdGroup=" + IdGroup + "&UserID=" + UserId + "&key=" + key);
        var httpHeader = this.getHttpHeaders();
        return this.http.post(url, null, { headers: httpHeader });
    };
    ChatService.prototype.UploadVideo = function (item) {
        var url = this.baseUrl + "/chat/UploadVideos";
        var httpHeader = this.getHttpHeaderFiles();
        return this.http.post(url, item, { headers: httpHeader });
    };
    Object.defineProperty(ChatService.prototype, "countUnreadMessage", {
        set: function (value) {
            this.unreadmessageSource.next(value);
        },
        enumerable: false,
        configurable: true
    });
    ChatService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], ChatService);
    return ChatService;
}());
exports.ChatService = ChatService;
