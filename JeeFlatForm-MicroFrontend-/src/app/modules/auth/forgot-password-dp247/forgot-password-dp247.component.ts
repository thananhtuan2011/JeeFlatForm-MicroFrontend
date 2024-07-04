import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { RecaptchaComponent } from 'ng-recaptcha';
import { LayoutUtilsService, MessageType } from '../../crud/utils/layout-utils.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
import { ForgetPasswordDP247EditDialogComponent } from 'src/app/pages/JeeAccount/widgets/forget-password-dialog-dp247/forget-password-dialog-dp247.component';
enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password-dp',
  templateUrl: './forgot-password-dp247.component.html',
  styleUrls: ['./forgot-password-dp247.component.scss'],
})
export class ForgotPasswordDP247Component implements OnInit {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  //========================================================
  @ViewChild('captchaElem') captchaElem: RecaptchaComponent;
  ShowChuoi: boolean = false;
  recapcha: string = '';
  public model: any = {
    useid: '', username: '', recapcha: '', langcode: localStorage.getItem('language'), code: '',
    email: '', mobile: '', IP: '', DeviceName: ''
  };
  ShowError: boolean = false;
  IsGuiMa: boolean = false;
  Type: number; //0 - mobile ; 1-mail
  IsSuDungLienHe: string = '0';//1 có sử dụng - ngược lại
  NoiDungLienHe: string;
  countdown: string = '';
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private translate: TranslateService,
    private layoutUtilsService: LayoutUtilsService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private router: Router,
    private deviceService: DeviceDetectorService,
    private http: HttpClient,
  ) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();
    this.getIPAddress();
    this.getDeviceName();
    this.getThamSo();
    this.countdown = "";
    setInterval(() => {
      this.countdown = this.countDown();
      this.changeDetectorRefs.detectChanges();
    }, 1000);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.fb.group({
      username: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
        ]),
      ],
      otp: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(6),
        ]),
      ],
    });
  }

  submit() {
    this.ShowError = false;
    if (!this.ShowChuoi) {
      if (this.f.username.status === 'VALID') {
        this.model.recapcha = this.recapcha;
        this.model.username = this.f.username.value;
        //Bổ sung thêm thông tin thiết bị
        if (this.deviceInfo) {
          if (this.deviceInfo.device == "Unknown") {
            this.model.DeviceName = this.deviceInfo.browser + ", " + this.deviceInfo.os;
          } else {
            this.model.DeviceName = this.deviceInfo.device + " " + this.deviceInfo.browser + ", " + this.deviceInfo.os;
          }
        }
        this.model.IP = this.ipAddress;
        this.layoutUtilsService.OnWaitingRouter();
        this.authService.CheckForgetPassByPhone(this.model).subscribe(res => {
          this.layoutUtilsService.OffWaitingRouter();
          this.recapcha = "";
          if (res && res.status == 1) {
            this.model.RowID = res.data.RowID;
            this.ShowChuoi = true;
            this.seconds = 59;
            this.countdown = "00:59";
            this.IsGuiMa = false;
            this.f.otp.setValue("");
          } else {
            this.captchaElem.reset();
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
          }
          this.changeDetectorRefs.detectChanges();

        });
      } else {
        this.ShowError = true;
        this.changeDetectorRefs.detectChanges();
      }
    } else {
      if (this.f.otp.status === 'VALID') {
        this.model.code = this.f.otp.value;
        this.layoutUtilsService.OnWaitingRouter();
        this.authService.CheckOTPByPhone(this.model).subscribe(res => {
          this.layoutUtilsService.OffWaitingRouter();
          if (res && res.status == 1) {
            const dialogRef = this.dialog.open(ForgetPasswordDP247EditDialogComponent, {
              data: {
                username: this.model.username, code: this.model.code,
                hash: res.data, devicename: this.model.DeviceName
              },
              panelClass: 'sky-padding-0',
              disableClose: true,
              width: '600px'
            });
            const sb = dialogRef.afterClosed().subscribe((res) => {
              if (!res) {
                return;
              }
              this.router.navigateByUrl("/");
            });
          } else {
            this.IsGuiMa = true;
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
          }
        });
      } else {
        this.ShowError = true;
      }
      this.changeDetectorRefs.detectChanges();
    }

  }

  goBack() {
    this.ShowChuoi = false;
  }
  //========================================================================
  resolved(captchaResponse: string) {
    this.recapcha = captchaResponse
  }

  GuiMa() {
    if (this.IsGuiMa) {
      this.layoutUtilsService.OnWaitingRouter();
      this.authService.SendOTPByPhone(this.model).subscribe(res => {
        this.layoutUtilsService.OffWaitingRouter();
        if (res && res.status == 1) {
          this.model.rowid = res.data.RowID;
          this.model.code = res.data.Code;
          this.seconds = 59;
          this.countdown = "00:59";
          this.IsGuiMa = false;
          this.layoutUtilsService.showActionNotification("Yêu cầu gửi lại mã thành công", MessageType.Read, 4000, true, false, 3000, 'top', 1);
        } else {
          this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        }
        this.changeDetectorRefs.detectChanges();
      });
    }
  }

  ipAddress: string = "";
  getIPAddress() {
    this.http.get("https://api.ipify.org/?format=json").subscribe((res: any) => {
      this.ipAddress = res.ip;
    });
  }

  deviceInfo: DeviceInfo;
  getDeviceName() {
    this.deviceInfo = this.deviceService.getDeviceInfo();
  }

  //============================================================
  time_resendotp: number = 1;
  getThamSo() {
    this.authService.getThamSoDP().subscribe(res => {
      if (res && res.status == 1) {
        this.time_resendotp = res.time_resendotp;
      }
      this.changeDetectorRefs.detectChanges();
    })
  }

  seconds: number = 59;
  countDown(): string {
    let time = '';
    if (this.seconds > 0) {
      this.seconds--
      time = "00:" + (this.seconds < 10 ? "0" : "") + String(this.seconds);
    } else {
      time = '00:00'
      this.IsGuiMa = true;
    }
    return time;
  }
}
