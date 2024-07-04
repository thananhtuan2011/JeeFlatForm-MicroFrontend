import { ChangePasswordModel } from './../../models/jee-account.model';
import { JeeAccountService } from './../../services/jee-account.service';
import { MatSelect } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-two-factor-authentication-dialog',
  templateUrl: './two-factor-authentication-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFactorAuthenticationDialog implements OnInit, OnDestroy {
  @ViewChild('ngOtpInput') ngOtpInputRef:any;
  isLoadingSubmit$: BehaviorSubject<boolean>;
  isLoading$: BehaviorSubject<boolean>;
  private subscriptions: Subscription[] = [];
  isEnabled2FA: boolean = false
  linkURL = ''
  // End
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TwoFactorAuthenticationDialog>,
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

  ngAfterViewInit(): void {
    setTimeout(() => {
      let eleId=this.ngOtpInputRef.getBoxId(0);
    this.ngOtpInputRef.focusTo(eleId);
    }, 300);
  }
  ngOnInit(): void {
    this.isLoadingSubmit$ = new BehaviorSubject(false);
    this.isLoading$ = new BehaviorSubject(true);

    const sb = this.accountManagementService
      .generateQR()
      .pipe(
        tap((res:any) => {
          this.linkURL = res.text
          this.isEnabled2FA = false;
          this.cd.detectChanges();
        }),
        finalize(() => {
        }),
        catchError((err) => {
          this.ngOtpInputRef.setValue('');
          this.isEnabled2FA = true;
          return of();
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }
  onSubmit() {

  }
  update(item: ChangePasswordModel) {
    this.isLoadingSubmit$.next(true);
    this.accountManagementService.changePassword(item).subscribe(
      (res) => {
        this.isLoadingSubmit$.next(false);
        this.dialogRef.close(item);
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
  onOtpChange(ev){
    if(ev.length == 6)
    {
      this.ngOtpInputRef.otpForm.disable();
      var otp = {
        twoFactorAuthenticationCode:ev
      }
      if(!this.isEnabled2FA){
        const sb = this.accountManagementService
      .turnOn2FA(otp)
      .pipe(
        tap((res:any) => {
          this.isEnabled2FA = true;
          this.dialogRef.close(res);
          this.cd.detectChanges();
        }),
        finalize(() => {
        }),
        catchError((err) => {
          this.ngOtpInputRef.otpForm.enable();
          this.layoutUtilsService.showActionNotification("Sai mã xác minh", MessageType.Read, 999999999, true, false, 3000, 'top', 0);
          return of();
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
      }else{
        const sb = this.accountManagementService
        .turnOff2FA(otp)
        .pipe(
          tap((res:any) => {
            this.isEnabled2FA = true;
            this.dialogRef.close(res);
            this.cd.detectChanges();
          }),
          finalize(() => {
          }),
          catchError((err) => {
            this.ngOtpInputRef.otpForm.enable();
            this.layoutUtilsService.showActionNotification("Sai mã xác minh", MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            return of();
          })
        )
        .subscribe();
      this.subscriptions.push(sb);
      }

    }
  }

  goBack() {
    this.dialogRef.close();
  }
}
