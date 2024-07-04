"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.PresenceService = void 0;
var core_1 = require("@angular/core");
var signalr_1 = require("@microsoft/signalr");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var environment_1 = require("src/environments/environment");
// const connection = new signalR.HubConnectionBuilder()
//   .withUrl(environment.hubUrl+'presence', {
//     skipNegotiation: true,
//     transport: signalR.HttpTransportType.WebSockets
//   })
//       .build()
var PresenceService = /** @class */ (function () {
    function PresenceService(toastr, router, auth) {
        this.toastr = toastr;
        this.router = router;
        this.auth = auth;
        this.hubUrl = environment_1.environment.hubUrl + '/hubs';
        this.onlineUsersSource = new rxjs_1.BehaviorSubject([]);
        this.onlineUsers$ = this.onlineUsersSource.asObservable();
        this.CallvideoMess = new rxjs_1.BehaviorSubject(undefined);
        this.CallvideoMess$ = this.CallvideoMess.asObservable();
        this.timeCallvideoMess = new rxjs_1.BehaviorSubject(undefined);
        this.timeCallvideoMess$ = this.timeCallvideoMess.asObservable();
        this.NotifyDesktop = new rxjs_1.BehaviorSubject(undefined);
        this.NotifyDesktop$ = this.NotifyDesktop.asObservable();
        this.ClosevideoMess = new rxjs_1.BehaviorSubject(undefined);
        this.ClosevideoMess$ = this.ClosevideoMess.asObservable();
        this.offlineUsersSource = new rxjs_1.BehaviorSubject(null);
        this.offlineUsers$ = this.offlineUsersSource.asObservable();
        this.NewGroupSource = new rxjs_1.BehaviorSubject(null);
        this.NewGroupSource$ = this.NewGroupSource.asObservable();
        this.OpenmessageUsernameSource = new rxjs_1.ReplaySubject(1);
        this.OpenmessageUsername$ = this.OpenmessageUsernameSource.asObservable();
        //   this.connectToken();
        //   connection.onclose(()=>{
        //     setTimeout(r=>{
        //       this.reconnectToken();
        //     },5000);
        //  })
    }
    PresenceService.prototype.connectToken = function () {
        var _this = this;
        var data = this.auth.getAuthFromLocalStorage();
        this.hubConnection = new signalr_1.HubConnectionBuilder()
            .withUrl(this.hubUrl + '/presence?token=' + data.access_token, {
        // skipNegotiation: true,
        // transport: signalR.HttpTransportType.WebSockets
        }).withAutomaticReconnect()
            .build();
        this.hubConnection.start()["catch"](function (err) { return console.log(err); });
        // const data=this.auth.getAuthFromLocalStorage();
        //    var _token =`Bearer ${data.access_token}`
        //    this.hubConnection.invoke("onConnectedTokenAsync",_token);
        this.hubConnection.on('UserIsOnline', function (username) {
            _this.onlineUsers$.pipe(operators_1.take(1)).subscribe(function (usernames) {
                _this.onlineUsersSource.next(__spreadArrays(usernames, [username]));
                // console.log('UserIsOnline',this.onlineUsers$)
            });
            // this.toastr.info(username.FullName+' has connect')
            // this.toastr.info(username.displayName+ ' has connect')
        });
        this.hubConnection.on('UserIsOffline', function (User) {
            _this.onlineUsers$.pipe(operators_1.take(1)).subscribe(function (usernames) {
                _this.onlineUsersSource.next(usernames.filter(function (x) { return x.Username != User.Username; }));
                _this.offlineUsersSource.next(User);
                // this.onlineUsersSource.next([...usernames, User])
                // console.log('UserIsOffline',this.onlineUsers$)
            });
        });
        this.hubConnection.on('GetOnlineUsers', function (usernames) {
            _this.onlineUsersSource.next(usernames);
        });
        this.hubConnection.on('CallVideoMessage', function (data) {
            // console.log('Composing',data)
            _this.CallvideoMess.next(data);
        });
        this.hubConnection.on('TimeCallVideoMesage', function (data) {
            // console.log('Composing',data)
            _this.timeCallvideoMess.next(data);
        });
        this.hubConnection.on('CloseCallVideoMesage', function (data) {
            // console.log('Composing',data)
            _this.ClosevideoMess.next(data);
        });
        this.hubConnection.on('NotifyDeskTop', function (data) {
            // console.log('Composing',data)
            _this.NotifyDesktop.next(data);
        });
        this.hubConnection.on('NewGroupChatReceived', function (data) {
            // console.log('NewGroupChatReceived',data)
            _this.NewGroupSource.next(data);
        });
        this.hubConnection.on('NewMessageReceived', function (res) {
            console.log('NewMessageReceived', res);
            _this.OpenmessageUsernameSource.next(res);
        });
    };
    PresenceService.prototype.CloseCallVideo = function (idGroup, username) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.hubConnection.invoke('CloseCallVideo', idGroup, username)["catch"](function (error) { return console.log(error); })];
            });
        });
    };
    PresenceService.prototype.TimeCallVideo = function (idgroup) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.hubConnection.invoke('TimeCallVideo', idgroup)["catch"](function (error) { return console.log(error); })];
            });
        });
    };
    PresenceService.prototype.NewGroup = function (token, item, dl) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.hubConnection.invoke('NewGroupChat', token, item, dl)["catch"](function (error) { return console.log(error); })];
            });
        });
    };
    PresenceService.prototype.disconnectToken = function () {
        var _token = '';
        var _userID = -1;
        var data = this.auth.getAuthFromLocalStorage();
        console.log("data", data);
        var _token = "Bearer " + data.access_token;
        this.hubConnection.invoke("onDisconnectToken", _token);
    };
    PresenceService.prototype.stopHubConnection = function () {
        this.hubConnection.stop()["catch"](function (error) { return console.log(error); });
    };
    PresenceService.prototype.reconnectToken = function () {
        var _this = this;
        var data = this.auth.getAuthFromLocalStorage();
        console.log("data", data);
        var _token = "Bearer " + data.access_token;
        this.hubConnection.start().then(function (data) {
            console.log('Connect with ID', data);
            _this.hubConnection.invoke("ReconnectToken", _token).then(function () {
            });
        })["catch"](function (error) {
            console.log('Could not ReconnectToken! ', error);
        });
        ///  console.log('Connect with ID',this.proxy.id);
    };
    PresenceService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], PresenceService);
    return PresenceService;
}());
exports.PresenceService = PresenceService;
