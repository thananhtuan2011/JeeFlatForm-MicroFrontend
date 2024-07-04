import { JeeAccountService } from './../../services/jee-account.service';
import { AppListDTO, PersonalInfo, PostImgModel } from './../../models/jee-account.model';
import { AuthService } from 'src/app/modules/auth';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { catchError, finalize, tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ChangePasswordEditDialogComponent } from '../change-password-dialog/change-password-dialog.component';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { TwoFactorAuthenticationDialog } from '../two-factor-authentication-dialog/two-factor-authentication-dialog.component';

@Component({
  selector: 'app-jee-account-info',
  templateUrl: './jee-account-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountInfoComponent implements OnInit, OnDestroy {
  private _isLoading$ = new BehaviorSubject<boolean>(true);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _errorMessage$ = new BehaviorSubject<string>('');
  private subscriptions: Subscription[] = [];
  public isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  personalInfo: PersonalInfo;
  uuid: string;
  imgFile: string = '';
  userid: number;
  username: string;
  newpassword: string;
  listApp: AppListDTO[] = [];
  devices: any[] = [];
  menuid: number = 9;
  showTruyCapNhanh: boolean = true;
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this.errorMessage$.asObservable();
  }
  // End


  isEnabled2FA = false;
  constructor(
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public datepipe: DatePipe,
    private translate: TranslateService,
    private auth: AuthService,
    public dialog: MatDialog,
    public accountManagementService: JeeAccountService
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    const user = this.auth.getAuthFromLocalStorage();
    this.personalInfo = user['user']['customData'].personalInfo;
    this.userid = user['user']['customData']['jee-account'].userID;
    this.username = user['user'].username;
    this.uuid = user['uuid'];
    this.getPassword();
    const sb = this.accountManagementService
      .GetListAppByUserId(this.userid)
      .pipe(
        tap((res) => {
          this.listApp = res.data;
          this.changeDetect.detectChanges();
        }),
        finalize(() => {
          this._isFirstLoading$.next(false);
          this._isLoading$.next(false);
        }),
        catchError((err) => {
          this._errorMessage$.next(err);
          return of();
        })
      )
      .subscribe();
    this.subscriptions.push(sb);

    this.checkTurnOnOff2Fa();
    this.getDevices()
  }

  checkTurnOnOff2Fa() {
    const sb2fa = this.accountManagementService
      .check2fa()
      .pipe(
        tap((res: any) => {
          this.isEnabled2FA = res.isEnabled2FA;
          this.changeDetect.detectChanges();
        }),
        finalize(() => {
          this._isFirstLoading$.next(false);
          this._isLoading$.next(false);
        }),
        catchError((err) => {
          this.isEnabled2FA = false;
          this._errorMessage$.next(err);
          return of();
        })
      )
      .subscribe();
    this.subscriptions.push(sb2fa);
  }

  getDevices() {
    const sb2fa = this.accountManagementService
      .getDevices()
      .pipe(
        tap((res: any) => {
          this.devices = this.sortByTimestampDescending(res.lst_device);
          this.changeDetect.detectChanges();
        }),
        finalize(() => {
          this._isFirstLoading$.next(false);
          this._isLoading$.next(false);
        }),
        catchError((err) => {
          this.devices = [];
          this._errorMessage$.next(err);
          return of();
        })
      )
      .subscribe();
    this.subscriptions.push(sb2fa);
  }

  onFileChange(event, username: string) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'DASHBOARD.THEMTHANHCONG';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      const imgfile = event.target.files[0];
      reader.readAsDataURL(imgfile);
      reader.onload = async () => {
        await this.resizeImage(reader.result as string).then((resolve: any) => {
          this.imgFile = resolve;
          console.log("a", this.imgFile);
        });
        const postimg = new PostImgModel();
        postimg.imgFile = this.imgFile.split(',')[1];
        postimg.Username = username;

          const sb = this.accountManagementService
          .UpdateAvatarWithChangeUrlAvatar(postimg)
          .pipe(
            tap((res) => {
              this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
              this.imgFile = '';
              this.ngOnInit();
            }),
            catchError((err) => {
              this.layoutUtilsService.showActionNotification(err.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
              this.imgFile = '';
              return of();
            })
          )
          .subscribe();
        this.subscriptions.push(sb);
      };

      // reader.onload = async (e: any) => {
      //   debugger
      //   this.imgFile = e.target.result.split(',')[1];
      //   const postimg = new PostImgModel();
      //   postimg.imgFile = this.imgFile;
      //   postimg.Username = username;

      //   const sb = this.accountManagementService
      //     .UpdateAvatarWithChangeUrlAvatar(postimg)
      //     .pipe(
      //       tap((res) => {
      //         this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
      //         this.imgFile = '';
      //         this.ngOnInit();
      //       }),
      //       catchError((err) => {
      //         this.layoutUtilsService.showActionNotification(err.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      //         this.imgFile = '';
      //         return of();
      //       })
      //     )
      //     .subscribe();
      //   this.subscriptions.push(sb);
      // };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  resizeImage(imageURL: any): Promise<any> {
    return new Promise((resolve) => {
      const image = new Image();
      image.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 80;
        canvas.height = 80;
        const ctx = canvas.getContext('2d');
        if (ctx != null) {
          ctx.drawImage(image, 0, 0, 80, 80);
        }
        var data = canvas.toDataURL('image/jpeg', 1);
        resolve(data);
      };
      image.src = imageURL;
    });
  }

  getPassword() {
    var out = [];
    for (var i = 0; i < this.username.length; i++) {
      out.push('*');
    }
    this.newpassword = out.join('');
  }
  newTab(url) {
    if (url) window.open(url);
  }
  resetPassword() {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'JEEACCOUNT.INFO.DOIMATKHAUTHANHCONG';
    let saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(ChangePasswordEditDialogComponent, {
      data: { username: this.username, isshow: true },
      panelClass: ['sky-padding-0', 'mat-dialog-popup', 'with40'],
    });
    const sb = dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      } else {
        this.auth.logout();
      }
    });
    this.subscriptions.push(sb);
  }


  enable2fa() {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += "Bật xác minh 2 bước thành công";
    if (this.isEnabled2FA) {
      saveMessageTranslateParam = "Tắt xác minh 2 bước thành công";
    }
    let saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(TwoFactorAuthenticationDialog, {
      data: { username: this.username, isshow: true }, width: '35%',
      panelClass: ['sky-padding-0', 'mat-dialog-popup'],
    });
    const sb = dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.checkTurnOnOff2Fa();
      }
    });
    this.subscriptions.push(sb);
  }

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 440;
    return tmp_height + 'px';
  }

  getHeightFull(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 1;
    return tmp_height + 'px';
  }

  convertTimestampToFormattedDate(timestamp: number): string {
    if (!timestamp) return 'Không xác định được thời gian đăng nhập';
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = this.getMonthName(date.getMonth());
    const year = date.getFullYear();

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    return `${day} ${month}, ${year} ${this.formatTime(hours, minutes, seconds)}`;
  }

  private getMonthName(monthIndex: number): string {
    const monthNames = [
      'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4',
      'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8',
      'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
    ];

    return monthNames[monthIndex];
  }

  private formatTime(hours: number, minutes: number, seconds: number): string {
    const formattedHours = this.padZero(hours);
    const formattedMinutes = this.padZero(minutes);
    const formattedSeconds = this.padZero(seconds);

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }
  sortByTimestampDescending(array: any[]): any[] {
    return array.sort((a, b) => {
      const timestampA = a.login_date;
      const timestampB = b.login_date;

      if (timestampA === undefined && timestampB === undefined) {
        return 0;
      } else if (timestampA === undefined) {
        return 1;
      } else if (timestampB === undefined) {
        return -1;
      } else {
        // Sort in descending order
        return timestampB - timestampA;
      }
    });
  }
  logoutDevice(id) {
    this.accountManagementService
      .logoutDevice(id)
      .pipe(
        tap((res) => {
          const messageType = MessageType.Delete;
          this.layoutUtilsService.showActionNotification('Đăng xuất thiết bị thành công', messageType, 4000, true, false);
          this.getDevices()
          this.changeDetect.detectChanges();
        }),
        finalize(() => {
          this._isFirstLoading$.next(false);
          this._isLoading$.next(false);
        }),
        catchError((err) => {
          this._errorMessage$.next(err);
          return of();
        })
      )
      .subscribe();
  }
}
