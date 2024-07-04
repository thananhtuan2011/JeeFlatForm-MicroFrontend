"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.NotifyDeskTopService = void 0;
var core_1 = require("@angular/core");
var signalR = require("@microsoft/signalr");
var signalr_1 = require("@microsoft/signalr");
var rxjs_1 = require("rxjs");
var environment_1 = require("src/environments/environment");
// const connection = new signalR.HubConnectionBuilder()
//   .withUrl(environment.hubUrl+'presence', {
//     skipNegotiation: true,
//     transport: signalR.HttpTransportType.WebSockets
//   })
//       .build()
var NotifyDeskTopService = /** @class */ (function () {
    function NotifyDeskTopService(toastr, router, auth) {
        this.toastr = toastr;
        this.router = router;
        this.auth = auth;
        this.hubUrl = environment_1.environment.hubUrldesktop + '/hubs';
        this.NotifyDesktop = new rxjs_1.BehaviorSubject(undefined);
        this.NotifyDesktop$ = this.NotifyDesktop.asObservable();
        this.MessageClickNotify = new rxjs_1.BehaviorSubject(undefined);
        this.MessageClickNotify$ = this.MessageClickNotify.asObservable();
        //   this.connectToken();
        //   connection.onclose(()=>{
        //     setTimeout(r=>{
        //       this.reconnectToken();
        //     },5000);
        //  })
    }
    NotifyDeskTopService.prototype.connectToken = function () {
        var _this = this;
        var data = this.auth.getAuthFromLocalStorage();
        this.hubConnection = new signalr_1.HubConnectionBuilder()
            .withUrl(this.hubUrl + '/notifydesktop?token=' + data.access_token, {
            skipNegotiation: true,
            transport: signalR.HttpTransportType.WebSockets
        }).withAutomaticReconnect()
            .build();
        this.hubConnection.start()["catch"](function (err) { return console.log(err); });
        // const data=this.auth.getAuthFromLocalStorage();
        //    var _token =`Bearer ${data.access_token}`
        //    this.hubConnection.invoke("onConnectedTokenAsync",_token);
        this.hubConnection.on('NotifyDeskTop', function (data) {
            // console.log('Composing',data)
            _this.NotifyDesktop.next(data);
        });
    };
    NotifyDeskTopService.prototype.disconnectToken = function () {
        var _token = '';
        var _userID = -1;
        var data = this.auth.getAuthFromLocalStorage();
        console.log("data", data);
        var _token = "Bearer " + data.access_token;
        this.hubConnection.invoke("onDisconnectToken", _token);
    };
    NotifyDeskTopService.prototype.stopHubConnection = function () {
        this.hubConnection.stop()["catch"](function (error) { return console.log(error); });
    };
    NotifyDeskTopService.prototype.reconnectToken = function () {
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
    NotifyDeskTopService = __decorate([
        core_1.Injectable({
            providedIn: 'root'
        })
    ], NotifyDeskTopService);
    return NotifyDeskTopService;
}());
exports.NotifyDeskTopService = NotifyDeskTopService;
