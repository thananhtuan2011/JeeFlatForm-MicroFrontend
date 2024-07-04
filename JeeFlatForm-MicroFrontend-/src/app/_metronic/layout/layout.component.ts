import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import { LayoutService } from './core/layout.service';
import { LayoutInitService } from './core/layout-init.service';
import { PresenceService } from 'projects/jeechat/src/app/page/jee-chat/services/presence.service';
import { MatDialog } from '@angular/material/dialog';
import { fromEvent } from 'rxjs';
import { MenuServices } from '../core/services/menu.service';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
const KEY_SSO_TOKEN = 'sso_token';
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  // Public variables
  selfLayout = 'default';
  asideSelfDisplay: true;
  asideMenuStatic: true;
  contentClasses = '';
  contentContainerClasses = '';
  toolbarDisplay = true;
  contentExtended: false;
  asideCSSClasses: string;
  asideHTMLAttributes: any = {};
  headerMobileClasses = '';
  headerMobileAttributes = {};
  footerDisplay: boolean;
  footerCSSClasses: string;
  headerCSSClasses: string;
  headerHTMLAttributes: any = {};
  // offcanvases
  lstContact: any[] = []
  extrasSearchOffcanvasDisplay = false;
  extrasNotificationsOffcanvasDisplay = false;
  extrasQuickActionsOffcanvasDisplay = false;
  extrasCartOffcanvasDisplay = false;
  extrasUserOffcanvasDisplay = false;
  extrasQuickPanelDisplay = false;
  extrasScrollTopDisplay = false;
  asideDisplay: boolean;
  @ViewChild('ktAside', { static: true }) ktAside: ElementRef;
  @ViewChild('ktHeaderMobile', { static: true }) ktHeaderMobile: ElementRef;
  @ViewChild('ktHeader', { static: true }) ktHeader: ElementRef;
  userCurrent: string;
  listAppCode: any = [];
  constructor(
    private initService: LayoutInitService,
    private layout: LayoutService,
    public dialog: MatDialog,
    private menu_services: MenuServices,
    private changeDetectorRefs: ChangeDetectorRef,
    public presence: PresenceService,
    private cookieService: CookieService
  ) {
    this.initService.init();
    const appCode: any = JSON.parse(localStorage.getItem('appCode'));
    this.listAppCode = appCode;
    const dt = this.layout.getAuthFromLocalStorage();
    this.userCurrent = dt.user.username;
    const access_token = this.cookieService.get(KEY_SSO_TOKEN);
    const manifestURL = `${environment.HOST_JEELANDINGPAGE_API}/api/chucnang?token=${access_token}&location=${window.location.href}&AppID=${3}`;
    document.querySelector('#my-manifest-placeholder').setAttribute('type', '"application/manifest+json"');
    document.querySelector('#my-manifest-placeholder').setAttribute('href', manifestURL);

  }

  GetContact() {
    const sb = this.menu_services.GetContactChatUser().subscribe(res => {
      this.lstContact = res.data;
      this.changeDetectorRefs.detectChanges();
    })
  }
  ngOnInit(): void {
    let indexchat = this.listAppCode.findIndex(x => x == environment.APPCODE_CHAT)
    if (indexchat >= 0) {
      this.GetContact()

    }
    this.asideDisplay = this.layout.getProp('aside.display') as boolean;
    this.toolbarDisplay = this.layout.getProp('toolbar.display') as boolean;
    this.contentContainerClasses = this.layout.getStringCSSClasses('contentContainer');
    this.asideCSSClasses = this.layout.getStringCSSClasses('aside');
    this.headerCSSClasses = this.layout.getStringCSSClasses('header');
    this.headerHTMLAttributes = this.layout.getHTMLAttributes('headerMenu');
    // try{
    //   this.presence.connectToken();
    // }
    // catch
    // {
    //   console.log('Lỗi kết nối')
    // }
    this.EventSubcibeCallVideo();
  }

  private EventSubcibeCallVideo(): void {

    fromEvent(window, 'call').subscribe((res: any) => {
      if (res) {


        const calling = localStorage.getItem('isCall');
        if (calling == "calling" && this.CheckCall(res.detail.IdGroup)) {
          // res.UserName
          // alert("đã có cuộc gọ khác")
          //   this.CallingOrther();
          this.presence.CallingOrther(res.detail.IdGroup, res.detail.UserName);
        }
        else {
          if (res && this.CheckCall(res.detail.IdGroup) && res.detail.UserName !== this.userCurrent) {

            this.CallVideoDialogEvent(res.detail.isGroup, res.detail.UserName, res.detail.Status, res.detail.keyid, res.detail.IdGroup, res.detail.FullName, res.detail.Avatar, res.detail.BGcolor);

          }
        }

      }

    })

  }
  CallVideoDialogEvent(isGroup, username, code, key, idgroup, fullname, img, bg) {


    // var dl = { isGroup: isGroup, UserName: username, BG: bg, Avatar: img, PeopleNameCall: fullname, status: code, idGroup: idgroup, keyid: key, Name: fullname };
    // const dialogRef = this.dialog.open(CallvideolayoutComponent, {

    //   data: { dl },
    //   disableClose: true

    // });
    // dialogRef.afterClosed().subscribe(res => {

    //   if (res) {
    //     this.presence.ClosevideoMess.next(undefined)

    //     this.changeDetectorRefs.detectChanges();
    //   }
    // })

  }
  CheckCall(idGroup) {

    let index = this.lstContact.findIndex(x => x.IdGroup == idGroup);
    if (index >= 0) {
      return true
    }
    else {
      return false
    }
  }
  ngAfterViewInit(): void {
    for (const key in this.headerHTMLAttributes) {
      if (this.headerHTMLAttributes.hasOwnProperty(key)) {
        this.ktHeader.nativeElement.attributes[key] =
          this.headerHTMLAttributes[key];
      }
    }
  }

  //=====Xử lý nếu link là menu thiếp lập ban đầu các phân hệ thì ẩn menu left
  //=====24/03/2024 - SKY
  getDisplay() {
    let Alink = window.location.pathname.split('/');
    let _count = 0;
    Alink.forEach(ele => {
      switch (ele) {
        case "WizardHR":
          _count++
          break;
        case "WizardTicket":
          _count++
          break;
        case "WizardWork":
          _count++
          break;
        case "WizardSale":
          _count++
          break;
        default:
          break;
      }
    });
    return _count;
  }
  //==========================================================================
}
