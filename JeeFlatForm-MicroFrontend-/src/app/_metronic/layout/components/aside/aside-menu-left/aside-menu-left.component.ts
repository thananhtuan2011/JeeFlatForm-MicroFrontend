import { Component, EventEmitter, Inject, OnInit, Renderer2 } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { LayoutService } from '../../../core/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { MenuServices } from 'src/app/_metronic/core/services/menu.service';
import { SocketioService } from 'src/app/_metronic/core/services/socketio.service';
import { AsideService } from '../aside.service';
import { ThemeService } from 'src/app/_metronic/core/services/theme.service';
import { SocketioStore } from 'src/app/_metronic/core/services/socketio.store';
import { TokenStorage } from 'src/app/modules/auth/services/token-storage.service';
import { Title } from '@angular/platform-browser';
import { switchMap, takeUntil } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SettingMenuComponent } from './setting-menu/setting-menu.component';
import { SocketioChatService } from 'src/app/_metronic/core/services/socketiochat.service';
import { Router } from '@angular/router';
@Component({
  selector: 'aside-menu-left',
  templateUrl: './aside-menu-left.component.html',
  styleUrls: ['./aside-menu-left.component.scss'],
})
export class AsideMenuLeftComponent implements OnInit {
  TABS: string[] = [
    'kt_aside_tab_0',
    'kt_aside_tab_1',
    'kt_aside_tab_2',
    'kt_aside_tab_3',
    'kt_aside_tab_4',
    'kt_aside_tab_5',
    'kt_aside_tab_6',
    'kt_aside_tab_7',
    'kt_aside_tab_8'];
  activeTabId;
  private subscriptions: Subscription[] = [];
  disableAsideSelfDisplay: boolean;
  asideMenuStatic: any;
  unread: number;
  numberInfo: number;
  disableAsideSecondaryDisplay: any;
  ulCSSClasses: any;
  asideMenuHTMLAttributes: any = {};
  asideMenuCSSClasses: string;
  asideMenuDropdown;
  brandClasses: any;
  asideMenuScroll = 0;
  asideSelfMinimizeToggle: any = false;
  list_menudesktop: any[] = [];
  list_menudesktop_hidden: any[] = [];
  Avatar: string;
  BgColor: string;
  name: string;
  active: boolean = true;
  //=======THEME=======
  isDarkMode: boolean;
  numberSupport: number = 0;
  listAppCode: any = [];
  btnClass: string =
    'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';

  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  //================================================
  isSupport: boolean = false;//Dùng để ẩn hiện menu support
  isSupportAI: boolean = false;//Dùng để ẩn hiện menu support chat bot
  constructor(private layout: LayoutService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private menu_service: MenuServices,
    private socketService: SocketioService,
    private socketchatService: SocketioChatService,
    private aside_service: AsideService,
    private themeService: ThemeService,
    private translate: TranslateService,
    public socketioStore: SocketioStore,
    private tokenStorage: TokenStorage,
    private titleService: Title,
    private renderer2: Renderer2,
    public dialog: MatDialog,
    @Inject(DOCUMENT) private _document: HTMLDocument,
    private router: Router,) {
    const user = this.auth.getAuthFromLocalStorage()['user'];
    this.name = user['customData']['personalInfo']['Name'];
    this.Avatar = user['customData']['personalInfo']['Avatar'];
    this.BgColor = user['customData']['personalInfo']['BgColor'];
    this.themeService.initTheme();
    this.isDarkMode = this.themeService.isDarkMode();
    const appCode: any = JSON.parse(localStorage.getItem('appCode'));
    this.listAppCode = appCode;
  }

  LoadMenuDeskTop() {
    this.aside_service.GetMenuLeftDeskTop().subscribe(res => {
      if (res.data && res.data.length > 0) {
        this.list_menudesktop = res.data;
        this.list_menudesktop.map((item, index) => {
          let _title = "";
          if (item.Title != "") {
            _title = this.translate.instant('MainMenu.' + '' + item.Title);
          }
          item.Title = _title;
        })
      } else {
        this.list_menudesktop = [];
      }

      if (res.data_hidden && res.data_hidden.length > 0) {
        this.list_menudesktop_hidden = res.data_hidden;
        this.list_menudesktop_hidden.map((item, index) => {
          let _title = "";
          if (item.Title != "") {
            _title = this.translate.instant('MainMenu.' + '' + item.Title);
          }
          item.Title = _title;
        })
      } else {
        this.list_menudesktop_hidden = [];
      }

      this.getNewNotiMainMenu();
      this.cdr.detectChanges();

    })
  }
  EventClose() {
    this.aside_service.active_close$.subscribe(res => {
      if (res) {
        this.active = true;
        this.cdr.detectChanges();
      }
    })
  }
  EventOpenTabChat() {
    const sb = this.menu_service.OpenTabChat$.subscribe(res => {
      if (res) {

        if (res == "JEECHAT") {

          this.menu_service.OpenMenu();
          this.activeTabId = this.TABS[1];
          this.cdr.detectChanges();
        }

        else if (res == "TEAM") {
          this.menu_service.OpenMenu();
          this.activeTabId = this.TABS[5];
          this.cdr.detectChanges();
        }
      }
    })
    this.subscriptions.push(sb)
  }

  EventLoadUnreadMessageChat() {

    fromEvent(window, 'event').subscribe((res: any) => {
      if (res.detail == "UpdateCountMess") {
        this.GetCountMessage()
      }
    })
  }
  onEventLoadChat(e: CustomEvent) {
    if (e.detail.eventType === 'update-sub-jeechat') {
      // dùng để đếm lại sl chat
      // console.log("Vào đây đếm lại sl")
      this.GetCountMessage();
    }
  }

  ngOnInit(): void {
    const $eventloadchat = fromEvent<CustomEvent>(window, 'event-submenu').subscribe((e) => this.onEventLoadChat(e));

    this.EventClose();
    let indexchat = this.listAppCode.findIndex(x => x == environment.APPCODE_CHAT)
    if (indexchat >= 0) {
      this.GetCountMessage();
    }
    this.LoadMenuDeskTop();
    this.EventOpenTabChat();
    // load view settings
    this.disableAsideSelfDisplay =
      this.layout.getProp('aside.self.display') === false;
    this.asideMenuStatic = this.layout.getProp('aside.menu.static');
    this.ulCSSClasses = this.layout.getProp('aside_menu_nav');
    this.asideMenuCSSClasses = this.layout.getStringCSSClasses('aside_menu');
    this.asideMenuHTMLAttributes = this.layout.getHTMLAttributes('aside_menu');
    this.asideMenuDropdown = this.layout.getProp('aside.menu.dropdown') ? '1' : '0';
    this.brandClasses = this.layout.getProp('brand');
    this.asideSelfMinimizeToggle = this.layout.getProp(
      'aside.self.minimize.toggle'
    );
    this.asideMenuScroll = this.layout.getProp('aside.menu.scroll') ? 1 : 0;
    this.asideMenuCSSClasses = `${this.asideMenuCSSClasses} ${this.asideMenuScroll === 1 ? 'scroll my-4 ps ps--active-y' : ''}`;
    this.disableAsideSecondaryDisplay = this.layout.getProp('aside.secondary.display');

    this.socketService.connect();
    this.socketchatService.connect();
    this.socketchatService.listen().subscribe((res: any) => {
      this.GetCountMessage();
    })
    this.socketService.listen().subscribe((res: any) => {
      this.getNewNotiMainMenu();
      this.getNotiSuppport();
      this.getNotiUnread();
      //Dùng để load thông báo trong app-notify-drawer khi có thông báo mới
      const busEvent = new CustomEvent('event-notify-drawer', {
        bubbles: true,
        detail: {
          eventType: 'load-notify',
          customData: 'some data here'
        }
      });
      dispatchEvent(busEvent);
    })

    this.getNotiUnread();
    this.getNotiSuppport();
    const minimize = this.socketioStore.updateMinimize$.subscribe(res => {
      if (res) {
        this.clear_aside_minimizeChat();
      }
    })
    this.getInfoTitle();
    this.checkUseChatAI();
    const $eventload = fromEvent<CustomEvent>(window, 'event-mainmenu').subscribe((e) => this.onEventLoadMenu(e));
  }

  CloseMenuTemplateDashboard() {
    // this.messageService.stopHubConnectionChat();
    // this.menu_service.CloseMenu();
    // this.active = false;
    // localStorage.setItem('chatGroup', '0');
    // localStorage.setItem("activeTab", null);
    // this.cdr.detectChanges();
  }
  CloseMenuTemplate() {
    this.menu_service.CloseMenu();
    this.active = false;
    this.cdr.detectChanges();
  }
  OpenMenuTemplate() {
    this.menu_service.OpenMenu();
    this.active = true;
    this.cdr.detectChanges();
  }


  setTab(id, appcode) {
    const event = new CustomEvent('dis', { detail: "Disconnect" });
    dispatchEvent(event)

    if (id == null && appcode == null) {

      localStorage.setItem("activeTab", null);

    }
    if (appcode == "TEAM") {
      localStorage.setItem('chatGroup', "0");
    }
    if (appcode == "JEECHAT") {
      localStorage.setItem('chatGroup', "0");
    }

    if (appcode != null) {
      localStorage.setItem("activeTab", appcode);

    }
    this.activeTabId = id;

    // console.log(" this.activeTabId", this.activeTabId)
    if (this.activeTabId === 'kt_aside_tab_2' || this.activeTabId === 'kt_aside_tab_5') {
      this.aside_service.active_close$.next(true);
    }
    document.body.classList.remove('aside-minimize'); // mở menu left
    this.cdr.detectChanges();
  }

  clear_aside_minimizeChat() {//Thiên code
    document.body.classList.add('aside-minimize');// đóng menu left
  }

  loadUnreadList: EventEmitter<boolean> = new EventEmitter<boolean>();
  updateNumberNoti(value) {
    if (value == true) {
      this.getNotiUnread()
    }
  }

  readAllNew() {
    this.socketService.ReadAllNew().subscribe(res => {
      this.getNotiUnread()
    })
  }

  getNotiUnread() {
    this.socketService.getNotificationList('new').subscribe(res => {
      let dem = 0;
      res.forEach(x => dem++);
      this.numberInfo = dem;
      this.cdr.detectChanges();
    })
  }

  updatereadmenu(item) {
    const lstAppCode: string[] = ["MEETING", "REQUEST", "TICKET", "SUPPORT", "MEET"];
    if (lstAppCode.indexOf(item.AppCode) !== -1) {
      let _item = {
        "appCode": item.AppCode,
        "mainMenuID": item.RowID,
      }
      this.socketService.readNotification_menu(_item).subscribe(res => {
        this.getNewNotiMainMenu()
        this.getNotiUnread()
      })
    }
    //=========Thiên xet appcode storage dùng để gọi load submenu======
    this.tokenStorage.setMainmenu(item.AppCode);
  }
  GetCountMessage() {

    const sb = this.menu_service.GetCountUnreadMessage().subscribe(res => {
      if (res && res.data) {
        this.unread = res.data.length;

        this.cdr.detectChanges();
      }

    })
    this.subscriptions.push(sb)
  }
  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach(element => {
        element.unsubscribe()
      });
    }

  }
  getNotiSuppport() {
    this.socketService.getNewNotiSupport().subscribe(res => {
      let dem = 0;
      res.forEach(x => dem++);
      this.numberSupport = dem;
      this.cdr.detectChanges();
    })
  }

  readNotiSuppport() {

    if (this.numberSupport > 0) {
      let _item = {
        "appCode": "SUPPORT",
        "mainMenuID": 11,
      }
      this.socketService.readNotification_menu(_item).subscribe(res => {
        this.getNotiUnread()
        this.getNotiSuppport();
      })
    }
  }

  //==================================21/10/2022 - Thiên set logo and title browser============
  getInfoTitle() {
    this.aside_service.getInfoTitle().subscribe(res => {
      if (res && res.status == 1) {
        this.isSupport = res.issupport == "1" ? true : false;
        localStorage.setItem('titlecustomerID', res.title);
        localStorage.setItem('istaskbarcustomerID', res.istaskbar);
        //Xét class để đổi màu theo customer
        let classApp = res.classapp;
        this.renderer2.addClass(document.body, classApp);
        this.cdr.detectChanges();
      }
    })

    this.aside_service.getLogoApp(3).subscribe(res => {
      if (res && res.status == 1) {
        localStorage.setItem('titleApp', res.data.TitleApp);
        localStorage.setItem('logocustomerID', res.data.IconApp);
        localStorage.setItem('logoLoad', res.data.IconApp);
        let iconApp = res.data.IconApp;
        this._document.getElementById('iconApp').setAttribute('href', iconApp);//fav Icon
        this.titleService.setTitle(localStorage.getItem('titleApp'));
      }
    })
  }

  getHeight(): any {
    let height_header = 0;
    height_header = document.getElementById("kt_brand").scrollHeight;
    let height_footer = 0;
    height_footer = document.getElementById("kt_footer").scrollHeight;
    let tmp_height = 0;
    tmp_height = window.innerHeight - height_header - height_footer - 40;
    return tmp_height + 'px';
  }

  onEventLoadMenu(e: CustomEvent) {
    if (e.detail.eventType === 'update-main') {
      this.LoadMenuDeskTop();
      this.getNotiSuppport();
    }
    if (e.detail.eventType === 'load-menu') {
      this.LoadMenuDeskTop();
    }
  }
  //================================================================
  getNewNotiMainMenu() {
    this.socketService.getNewNotiMainMenu().subscribe(res => {
      this.list_menudesktop.forEach(e => {
        e.SoLuong = res.filter(x => x.AppCode == e.AppCode && x.menuID == e.RowID).length;
        //====Thiên bổ sung xử lý đối với APP CODE WORKV2=========
        if (e.AppCode == "WORKV2") {
          const busEvent = new CustomEvent('event-count-isnew', {
            bubbles: true,
            detail: {
              eventType: 'count-isnew',
              customData: e.SoLuong
            }
          });
          dispatchEvent(busEvent);
        }
      });
      this.list_menudesktop_hidden.forEach(e => {
        e.SoLuong = res.filter(x => x.AppCode == e.AppCode && x.menuID == e.RowID).length;
        //====Thiên bổ sung xử lý đối với APP CODE WORKV2=========
        if (e.AppCode == "WORKV2") {
          const busEvent = new CustomEvent('event-count-isnew', {
            bubbles: true,
            detail: {
              eventType: 'count-isnew',
              customData: e.SoLuong
            }
          });
          dispatchEvent(busEvent);
        }
      });
      this.cdr.detectChanges();
    })
  }

  checkUseChatAI(){
    this.aside_service.GetCheckOpenAI().subscribe(res => {
      if (res && res.status == 1) {
        this.isSupportAI = res.data == "1" ? true : false;
        this.cdr.detectChanges();
      }
    })
  }

  clickOpenAI(){
    this.router.navigateByUrl(`IframeSupport/Chat`);
  }
}
