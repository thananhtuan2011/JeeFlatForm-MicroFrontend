import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { RecaptchaComponent } from 'ng-recaptcha';
import { LayoutUtilsService, MessageType } from '../../crud/utils/layout-utils.service';
import { ForgetPasswordEditDialogComponent } from 'src/app/pages/JeeAccount/widgets/forget-password-dialog/forget-password-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { DeviceDetectorService, DeviceInfo } from 'ngx-device-detector';
import { HttpClient } from '@angular/common/http';
enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
  selector: 'app-forgot-password-new',
  templateUrl: './forgot-password-new.component.html',
  styleUrls: ['./forgot-password-new.component.scss'],
})
export class ForgotPasswordNewComponent implements OnInit {
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
  IsGuiMa: boolean = true;
  Type: number; //0 - mobile ; 1-mail
  IsSuDungLienHe: string = '0';//1 có sử dụng - ngược lại
  NoiDungLienHe: string;
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
    setInterval(() => {
      this.IsGuiMa = true;
    }, 120000);
    this.getIPAddress();
    this.getDeviceName();
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
          Validators.minLength(3),
        ]),
      ],
      otp: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10),
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
        this.authService.checkUsenameCapcha(this.model).subscribe(res => {
          this.layoutUtilsService.OffWaitingRouter();
          this.recapcha = "";
          if (res && res.status == 1) {
            this.model.useid = res.data.UserID;
            this.Type = res.data.Type;
            if (this.Type == 0) {

            } else {
              this.model.email = res.data.Email;
              this.model.RowID = res.data.RowID;
            }
            this.ShowChuoi = true;
            this.IsSuDungLienHe = res.data.IsSuDungLienHe;
            this.NoiDungLienHe = res.data.NoiDungLienHe;
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
        this.authService.checkChuoiKyTu(this.model).subscribe(res => {
          this.layoutUtilsService.OffWaitingRouter();
          if (res && res.status == 1) {
            const dialogRef = this.dialog.open(ForgetPasswordEditDialogComponent, {
              data: { username: this.model.username, code: this.model.code, userid: this.model.useid },
              panelClass: 'sky-padding-0',
              disableClose: true
            });
            const sb = dialogRef.afterClosed().subscribe((res) => {
              if (!res) {
                return;
              }
              this.router.navigateByUrl("/");
            });
          } else {
            this.model.solan = res.soluong;
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
      this.authService.GuiLaiMa(this.model).subscribe(res => {
        this.layoutUtilsService.OffWaitingRouter();
        if (res && res.status == 1) {
          this.IsGuiMa = false;
          this.model.useid = res.data.UserID;
          this.model.code = res.data.Code;
          this.layoutUtilsService.showActionNotification("Yêu cầu gửi lại mã thành công. Vui lòng kiểm tra email", MessageType.Read, 4000, true, false, 3000, 'top', 1);
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
}
