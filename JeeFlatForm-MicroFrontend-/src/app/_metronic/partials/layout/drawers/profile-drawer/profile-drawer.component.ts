import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'projects/jeechat/src/app/page/jee-chat/services/message.service';
import { PresenceService } from 'projects/jeechat/src/app/page/jee-chat/services/presence.service';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { RemindService } from 'src/app/modules/auth/services/remind.service';
import { MenuServices } from 'src/app/_metronic/core/services/menu.service';
import { ThemeService } from 'src/app/_metronic/core/services/theme.service';
import { ThemeStore } from 'src/app/_metronic/core/services/theme.store';
import { UserModel } from 'src/app/_metronic/layout/components/Model/user.model';
import { environment } from 'src/environments/environment';
import { AsideService } from 'src/app/_metronic/layout/components/aside/aside.service';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { MatDialog } from '@angular/material/dialog';
import { SettingMenuComponent } from 'src/app/_metronic/layout/components/aside/aside-menu-left/setting-menu/setting-menu.component';
@Component({
  selector: 'app-profile-drawer',
  templateUrl: './profile-drawer.component.html',
})
export class ProfileDrawerComponent implements OnInit {
  user$: Observable<UserModel>;
  listNhacNho: any[] = [];
  AppCode: string = '';
  userCurrent: string;
  isEnabledNotify: boolean = false;
  text_notifyJee = "Đăng ký nhận thông báo từ hệ thống";
  //=================================================

  constructor(
    private auth: AuthService,
    public translate: TranslateService,
    private menuServices: MenuServices,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    public messageService: MessageService,
    public presence: PresenceService,
    public themeService: ThemeService,
    public themeStore: ThemeStore,
    private remind_sevices: RemindService,
    private _AsideService: AsideService,
    private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog,
  ) {
    this.themeService.initTheme();
    this.isDarkMode = this.themeService.isDarkMode();
    this.isIframe = this.themeService.isIframe();
    this.auth.getIsOpenChat() == 'true'
      ? (this.isOpenchat = true)
      : (this.isOpenchat = false);
  }

  ngOnInit() {
    this.AppCode = environment.APPCODE;
    this.user$ = this.auth.getAuthFromLocalStorage();
    const dt = this.auth.getAuthFromLocalStorage();
    this.userCurrent = dt.user.username;
    this.remind_sevices.connectToken(this.userCurrent, environment.APPCODE);
    this.LoadDataNhacNho();
    this.EventNhacNho();
    this.loadImgMobile_PC();
    this.loadOnesignal();
    var OneSignal = window['OneSignal'] || [];
    OneSignal.push(() => {
      OneSignal.on('notificationPermissionChange', (permissionChange)=> {
        var currentPermission = permissionChange.to;
        if(currentPermission == 'granted'){
          this.isEnabledNotify = true;
          this.text_notifyJee = "Hủy nhận thông báo từ hệ thống";
        }
        if(currentPermission == 'denied'){
          this.isEnabledNotify = false;
          this.text_notifyJee = "Đăng ký nhận thông báo từ hệ thống";
        }
      });
    });
    OneSignal.push(() => {
      OneSignal.on('subscriptionChange', async (isSubscribed: boolean) => {
        if (isSubscribed) {
          this.isEnabledNotify = true;
          this.text_notifyJee = "Hủy nhận thông báo từ hệ thống";
        }else{
          this.isEnabledNotify = false;
          this.text_notifyJee = "Đăng ký nhận thông báo từ hệ thống";
        }
      })
    });
    //===========================================================
    this.CheckSuDungThietLap();
  }

  loadOnesignal(){
    var OneSignal = window['OneSignal'] || [];
    OneSignal.push(() => {
      OneSignal.isPushNotificationsEnabled().then((isEnabled) => {
        if (isEnabled) {
          console.log("Push notifications are enabled!");
          this.isEnabledNotify = true;
          this.text_notifyJee = "Hủy nhận thông báo từ hệ thống";
        } else {
          console.log("Push notifications are not enabled yet.");
          this.isEnabledNotify = false;
          this.text_notifyJee = "Đăng ký nhận thông báo từ hệ thống";
        }
        this.changeDetectorRefs.detectChanges();
      });
    });
  }
  ChangeLink(item) {
    if (item.WebAppLink != null && item.WebAppLink != '') {
      if (this.AppCode == item.AppCode) {
        if (item.Loai == 501 || item.Loai == 502) {
          this.router.navigateByUrl(item.WebAppLink);
        } else {
          this.router.navigate([item.WebAppLink]);
        }
      } else {
        let link = item.Domain + item.WebAppLink;
        window.open(link, '_blank');
      }
    }
  }

  quanlytaikhoan() {
    this.router.navigate(['/ThongTinCaNhan']);
  }
  ClearChatBox() {
    localStorage.removeItem('chatboxusers');
    localStorage.removeItem('chatGroup');
    localStorage.removeItem('draftmessage');
  }
  logout() {
    this.ClearChatBox();
    const event = new CustomEvent('dis', { detail: 'Disconnect' });
    dispatchEvent(event);
    this.ClearInfoLogoTitle();
    if (!environment.production) {
      this.auth.logoutToSSO().subscribe((res) => {
        this.auth.logout();
      });
    } else {
      this.auth.LogOutOs();
    }
  }

  public EventNhacNho() {
    this.remind_sevices.NewMess$.subscribe((res) => {
      if (res) {
        this.LoadDataNhacNho();
      }
    });
  }

  public LoadDataNhacNho() {
    this.menuServices.Get_DSNhacNho().subscribe((res) => {
      if (res.status == 1 && res.data.length > 0) {
        this.listNhacNho = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }
  getColorNameUser(value: any) {
    let result = '';
    switch (value) {
      case 'A':
        return (result = 'rgb(51 152 219)');
      case 'Ă':
        return (result = 'rgb(241, 196, 15)');
      case 'Â':
        return (result = 'rgb(142, 68, 173)');
      case 'B':
        return (result = '#0cb929');
      case 'C':
        return (result = 'rgb(91, 101, 243)');
      case 'D':
        return (result = 'rgb(44, 62, 80)');
      case 'Đ':
        return (result = 'rgb(127, 140, 141)');
      case 'E':
        return (result = 'rgb(26, 188, 156)');
      case 'Ê':
        return (result = 'rgb(51 152 219)');
      case 'G':
        return (result = 'rgb(241, 196, 15)');
      case 'H':
        return (result = 'rgb(248, 48, 109)');
      case 'I':
        return (result = 'rgb(142, 68, 173)');
      case 'K':
        return (result = '#2209b7');
      case 'L':
        return (result = 'rgb(44, 62, 80)');
      case 'M':
        return (result = 'rgb(127, 140, 141)');
      case 'N':
        return (result = 'rgb(197, 90, 240)');
      case 'O':
        return (result = 'rgb(51 152 219)');
      case 'Ô':
        return (result = 'rgb(241, 196, 15)');
      case 'Ơ':
        return (result = 'rgb(142, 68, 173)');
      case 'P':
        return (result = '#02c7ad');
      case 'Q':
        return (result = 'rgb(211, 84, 0)');
      case 'R':
        return (result = 'rgb(44, 62, 80)');
      case 'S':
        return (result = 'rgb(127, 140, 141)');
      case 'T':
        return (result = '#bd3d0a');
      case 'U':
        return (result = 'rgb(51 152 219)');
      case 'Ư':
        return (result = 'rgb(241, 196, 15)');
      case 'V':
        return (result = '#759e13');
      case 'X':
        return (result = 'rgb(142, 68, 173)');
      case 'W':
        return (result = 'rgb(211, 84, 0)');
    }
    return result;
  }

  //========================Dark Light=========================
  //=======THEME=======
  isDarkMode: boolean;
  toggleDarkMode() {
    this.themeStore.themeupdateEvent = false;
    this.isDarkMode = this.themeService.isDarkMode();
    this.isDarkMode
      ? this.themeService.update('light-mode')
      : this.themeService.update('dark-mode');
    this.themeStore.themeupdateEvent = true;
  }

  //=======IFRAME=======
  isIframe: boolean;

  toggleIframe() {
    this.isIframe = this.themeService.isIframe();
    this.isIframe
      ? this.themeService.updateIframe('no')
      : this.themeService.updateIframe('yes');
    this.auth.updateOpenTab(!this.isIframe).subscribe(res=>{})
  }

  //=======OpenChat======
  isOpenchat: boolean;
  UpdateisOpen() {
    this.isOpenchat == true
      ? this.auth.setIsOpenChat(false)
      : this.auth.setIsOpenChat(true);
  }

  //=====clear tokenstorage==========
  ClearInfoLogoTitle() {
    localStorage.removeItem('logocustomerID');
    localStorage.removeItem('titlecustomerID');
    localStorage.removeItem('istaskbarcustomerID');
  }
  //=====================================

  nofifyJee() {
    // const host = {
    //   portal: 'https://portal.jee.vn',
    // }
    // var left = screen.width / 2 + 515 / 2;
    // var top = screen.height / 2 - 685 / 2;
    // window.open(
    //   `${host.portal}/notificationsubscribe`, // username điền vào đây
    //   'childWin',
    //   'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=515,height=285'
    //   + ", top=" + top + ", left=-" + left
    // )
    var OneSignal = window['OneSignal'] || [];
    if(this.isEnabledNotify){
      OneSignal.push(()  =>{
        OneSignal.isPushNotificationsEnabled( async (isEnabled) =>{
          if (isEnabled)
          {
            await OneSignal.setSubscription(false)
            this.loadOnesignal();
          }
        });
      });
     }else{

      OneSignal.push(["getNotificationPermission", (permission) => {
        console.log("Site Notification Permission:", permission);
        if(permission == 'granted'){
          OneSignal.push(async ()  =>{
            await OneSignal.setSubscription(true)
            this.loadOnesignal();
          });
        }

        if(permission == 'denied'){
          alert('Thông báo bị chặn. Vui lòng nhấp vào hình ổ khóa bên cạnh thanh địa chỉ web để thay đổi tùy chọn thông báo của bạn')
        }

        if(permission == 'default'){
          OneSignal.push(async () =>{
            await OneSignal.showNativePrompt();
          });
        }
      }]);
    }
  }

  //==============================================
  imgAndroid: string = '';
  imgIOS: string = '';
  imgWindow: string = '';
  imgMac: string = '';
  loadImgMobile_PC() {
    this._AsideService.getInfoTitle().subscribe(res => {
      if (res && res.status == 1) {
        this.imgAndroid = res.imgAndroid != "" ? environment.HOST_MINIO + res.imgAndroid : "";
        this.imgIOS = res.imgIos != "" ? environment.HOST_MINIO + res.imgIos : "";
        this.imgWindow = res.pcWindow != "" ? environment.HOST_MINIO + res.pcWindow : "";
        this.imgMac = res.pcMac != "" ? environment.HOST_MINIO + res.pcMac : "";
      }
      this.changeDetectorRefs.detectChanges();
    })
  }

  open(link) {
    window.open(link);
  }

  //=================Bổ sung chức năng thiết lập menu thường dùng=================
  AddMenuThuongDung() {
    const dialogRef = this.dialog.open(SettingMenuComponent, {
      data: {},
      panelClass: ['sky-padding-0', 'width700'],
    });
    dialogRef
      .afterClosed()
      .pipe()
      .subscribe((res) => {
        if(!res){
          return;
        }
        //Bắn event reload menu
        const busEvent = new CustomEvent('event-mainmenu', {
          bubbles: true,
          detail: {
            eventType: 'load-menu',
            customData: 'some data here'
          }
        });
        dispatchEvent(busEvent);
      });
  }

  //===================Gọi trang thiết lập phần mêm=================
  isThietLap:boolean = false
  ThietLapPhanMem(){
    this.router.navigate(['/Guide']);
  }

  CheckSuDungThietLap(){
    this.menuServices.CheckUseWizard().subscribe((res) => {
      if (res.status == 1 ) {
        this.isThietLap = true;
      }else{
        this.isThietLap = false;
      }
      this.changeDetectorRefs.detectChanges();
    });
  }
}
