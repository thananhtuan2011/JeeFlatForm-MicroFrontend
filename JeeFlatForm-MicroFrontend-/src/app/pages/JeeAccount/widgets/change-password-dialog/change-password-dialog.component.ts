import { ChangePasswordModel } from './../../models/jee-account.model';
import { JeeAccountService } from './../../services/jee-account.service';
import { MatSelect } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordEditDialogComponent implements OnInit, OnDestroy {
  item: ChangePasswordModel = new ChangePasswordModel();
  itemForm = this.fb.group(
    {
      MatKhauCu: ['', [Validators.required]],
      MatKhau: ['', [Validators.required]],
      NhapLaiMatKhau: ['', [Validators.required]],
    },
    { validator: this.checkPasswords }
  );
  // ngx-mat-search area
  isLoadingSubmit$: BehaviorSubject<boolean>;
  isLoading$: BehaviorSubject<boolean>;
  private subscriptions: Subscription[] = [];
  // End
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ChangePasswordEditDialogComponent>,
    private fb: FormBuilder,
    private accountManagementService: JeeAccountService,
    private layoutUtilsService: LayoutUtilsService,
    public cd: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
    private http: HttpClient,
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.isLoadingSubmit$ = new BehaviorSubject(false);
    this.isLoading$ = new BehaviorSubject(true);
    this.item = this.data.username;
    this.getIPAddress();
    this.getDeviceName();
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.MatKhau.value;
    let confirmPass = group.controls.NhapLaiMatKhau.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const job = this.initDataFromFB();
      this.update(job);
    } else {
      this.validateAllFormFields(this.itemForm);
    }
  }
  update(item: ChangePasswordModel) {
    this.isLoadingSubmit$.next(true);
    this.accountManagementService.changePassword(item).subscribe(
      (res) => {
        this.dialogRef.close({
          item
        });
        this.isLoadingSubmit$.next(false);
      },
      (error) => {
        this.isLoadingSubmit$.next(false);
        this.layoutUtilsService.showActionNotification("Đổi mật khẩu thất bại", MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      },
      () => {
        this.isLoadingSubmit$.next(false);
      }
    );
  }

  initDataFromFB(): ChangePasswordModel {
    const acc = new ChangePasswordModel();
    acc.Username = this.data.username;
    acc.PasswordOld = this.itemForm.controls.MatKhauCu.value;
    acc.PaswordNew = this.itemForm.controls.MatKhau.value;
    acc.isChange = true;
    //Bổ sung thêm thông tin thiết bị
    if (this.deviceInfo) {
      if (this.deviceInfo.device == "Unknown") {
        acc.DeviceName = this.deviceInfo.browser + ", " + this.deviceInfo.os;
      } else {
        acc.DeviceName = this.deviceInfo.device + " " + this.deviceInfo.browser + ", " + this.deviceInfo.os;
      }
    }
    acc.IP = this.ipAddress;
    return acc;
  }

  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }

  goBack() {
    this.dialogRef.close();
  }

  //============================================================
  fieldTextType_old: boolean;
  fieldTextType_new: boolean;
  fieldTextType_new_repeat: boolean;
  toggleFieldTextType_old() {
    this.fieldTextType_old = !this.fieldTextType_old;
  }
  toggleFieldTextType_new() {
    this.fieldTextType_new = !this.fieldTextType_new;
  }
  toggleFieldTextType_new_repeat() {
    this.fieldTextType_new_repeat = !this.fieldTextType_new_repeat;
  }

  initDataGoBack(): ChangePasswordModel {
    const acc = new ChangePasswordModel();
    acc.Username = this.data.username;
    acc.isChange = false;
    return acc;
  }

  goBackChangePass() {
    const job = this.initDataGoBack();
    this.updateGoBack(job);
  }

  updateGoBack(item: ChangePasswordModel) {
    this.isLoadingSubmit$.next(true);
    this.accountManagementService.changePassword(item).subscribe(
      (res) => {
        this.isLoadingSubmit$.next(false);
        this.dialogRef.close();
      },
      (error) => {
        this.isLoadingSubmit$.next(false);
      },
      () => {
        this.isLoadingSubmit$.next(false);
      }
    );
  }

  deviceInfo: DeviceInfo;
  getDeviceName() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }

  ipAddress: string = "";
  getIPAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }
}
