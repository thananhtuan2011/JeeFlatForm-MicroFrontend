"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
exports.__esModule = true;
exports.ThanhVienGroupComponent = void 0;
var layout_utils_service_1 = require("./../../../../crud/utils/layout-utils.service");
var core_1 = require("@angular/core");
var dialog_1 = require("@angular/material/dialog");
var ThanhVienGroupComponent = /** @class */ (function () {
    function ThanhVienGroupComponent(_service, auth, conversation_service, layoutUtilsService, changeDetectorRefs, router, dialogRef, data) {
        this._service = _service;
        this.auth = auth;
        this.conversation_service = conversation_service;
        this.layoutUtilsService = layoutUtilsService;
        this.changeDetectorRefs = changeDetectorRefs;
        this.router = router;
        this.dialogRef = dialogRef;
        this.data = data;
        this.lstThanhVien = [];
        this.adminGroup = false;
        var authData = this.auth.getAuthFromLocalStorage();
        this.UserIdCurrent = authData.user.customData["jee-account"].userID;
    }
    ThanhVienGroupComponent.prototype.CloseDia = function (data) {
        if (data === void 0) { data = undefined; }
        this.dialogRef.close(data);
    };
    ThanhVienGroupComponent.prototype.goBack = function () {
        this.dialogRef.close();
    };
    ThanhVienGroupComponent.prototype.LeaveGroup = function (UserId) {
        var _this = this;
        this._service.DeleteThanhVienInGroup(this.data, UserId).subscribe(function (res) {
            if (res && res.status == 1) {
                _this.CloseDia(res);
                _this.router.navigateByUrl('/Chat'); //có link thì chuyển link
                var item = { IdGroup: _this.data, UserId: res };
                _this.conversation_service.refreshConversation.next(item);
            }
            else {
                _this.layoutUtilsService.showActionNotification('Thất bại !', layout_utils_service_1.MessageType.Read, 3000, true, false, 3000, 'top', 0);
            }
        });
    };
    ThanhVienGroupComponent.prototype.DeleteMember = function (UserId) {
        var _this = this;
        this._service.DeleteThanhVienInGroup(this.data, UserId).subscribe(function (res) {
            if (res && res.status == 1) {
                _this.layoutUtilsService.showActionNotification('Thành công !', layout_utils_service_1.MessageType.Read, 3000, true, false, 3000, 'top', 1);
                _this.CloseDia(res);
            }
            else {
                _this.layoutUtilsService.showActionNotification('Thất bại !', layout_utils_service_1.MessageType.Read, 3000, true, false, 3000, 'top', 0);
            }
        });
    };
    ThanhVienGroupComponent.prototype.LoadThanhVien = function () {
        var _this = this;
        this._service.GetThanhVienGroup(this.data).subscribe(function (res) {
            _this.lstThanhVien = res.data;
            _this.CheckLoginAdmin();
            _this.changeDetectorRefs.detectChanges();
        });
    };
    ThanhVienGroupComponent.prototype.UpdateAdmin = function (IdUser, key) {
        var _this = this;
        this._service.UpdateAdmin(this.data, IdUser, key).subscribe(function (res) {
            if (res && res.status === 1) {
                var index = _this.lstThanhVien.findIndex(function (x) { return x.UserId === IdUser; });
                _this.lstThanhVien.splice(index, 1, res.data[0]);
            }
        });
    };
    ThanhVienGroupComponent.prototype.CheckLoginAdmin = function () {
        var _this = this;
        if (this.lstThanhVien.length > 0) {
            var id = this.lstThanhVien.find(function (x) { return x.UserId === _this.UserIdCurrent && x.isAdmin == true; });
            if (id) {
                this.adminGroup = true;
                this.changeDetectorRefs.detectChanges();
            }
        }
    };
    ThanhVienGroupComponent.prototype.ngOnInit = function () {
        this.LoadThanhVien();
    };
    ThanhVienGroupComponent = __decorate([
        core_1.Component({
            selector: 'app-thanh-vien-group',
            templateUrl: './thanh-vien-group.component.html',
            styleUrls: ['./thanh-vien-group.component.scss']
        }),
        __param(7, core_1.Inject(dialog_1.MAT_DIALOG_DATA))
    ], ThanhVienGroupComponent);
    return ThanhVienGroupComponent;
}());
exports.ThanhVienGroupComponent = ThanhVienGroupComponent;
