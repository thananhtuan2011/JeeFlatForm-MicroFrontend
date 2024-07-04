import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/modules/auth/services/token-storage.service';
import { MenuServices } from 'src/app/_metronic/core/services/menu.service';
import { SocketioService } from 'src/app/_metronic/core/services/socketio.service';
import { SocketioStore } from 'src/app/_metronic/core/services/socketio.store';
import { AsideService } from 'src/app/_metronic/layout/components/aside/aside.service';
import { environment } from 'src/environments/environment';
import moment from 'moment';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-notify-drawer',
  templateUrl: './notify-drawer.component.html',
  styleUrls: ['./notify-drawer.component.scss']
})
export class NotifyDrawerComponent implements OnInit {
  extrasNotificationsOffcanvasDirectionCSSClass: string;
  @Output() loadUnreadList = new EventEmitter();
  listNoti: any[] = []
  list_menudesktop: any[] = []
  active: boolean = true;
  constructor(
    public translate: TranslateService,
    private socketService: SocketioService,
    private router: Router,
    // private conver_services: ConversationService,
    private aside_service: AsideService,
    private changeDetectorRefs: ChangeDetectorRef,
    private menu_service: MenuServices,
    private datePipe: DatePipe,
    public socketioStore: SocketioStore,
    private tokenStorage: TokenStorage,) {

  }

  ngOnInit(): void {
    this.LoadMenuDeskTop();
    this.getListNoti();
    const $eventload = fromEvent<CustomEvent>(window, 'event-notify-drawer').subscribe((e) => this.onEventLoadNotify(e));
  }

  LoadMenuDeskTop() {
    this.aside_service.GetMenuLeftDeskTop().subscribe(res => {
      this.list_menudesktop = res.data;
      this.list_menudesktop.map((item, index) => {
        let _title = "";
        if (item.Title != "") {
          _title = this.translate.instant('MainMenu.' + '' + item.Title);
        }
        item.Title = _title;
      })
      this.changeDetectorRefs.detectChanges();
    })
  }
  clickRead(noti: any) {
    this.socketService.readNotification(noti._id).subscribe(res => {
      this.listNoti.forEach(x => {
        if (x.id == noti.id) {
          x.read = true;
        }
      });
      this.getListNoti();
      if (noti.message_json.Link != null && noti.message_json.Link != "") {
        let domain = ""
        let indexapp = this.list_menudesktop.findIndex(x => x.AppCode == noti.message_json.AppCode);
        if (indexapp < 0 && noti.message_json.AppCode != environment.APPCODE) {
          domain = noti.message_json.Domain
          window.open(domain + noti.message_json.Link, '_blank');
        } else {
          if (noti.message_json.AppCode == "JEECHAT") {

            // this.conver_services.data_share = "Close"
            localStorage.setItem("activeTab", noti.message_json.AppCode);
            this.menu_service.OpenTabChat$.next("JEECHAT");

          } else {
            localStorage.setItem("activeTab", null);
          }

          if (noti.AppCode == "WORK") {//Thiên bổ sung ngày 08/09/2022
            if ((noti.menuID && noti.menuID == 2) && (noti.submenuID && noti.submenuID == 7)) {
              this.router.navigate(['', { outlets: { auxNameV1: 'auxWorkV1/detailWork/' + noti.idObject }, }]);
            } else {

              this.router.navigateByUrl(noti.message_json.LinkDesktop);
            }
          } else if (noti.AppCode == "WORKV2") {//Thiên bổ sung ngày 06/07/2023
            if ((noti.menuID && noti.menuID == 12)) {
              this.router.navigate(['', { outlets: { auxName: 'auxWork/DetailsGOV/' + noti.idObject }, }]);
            } else {
              this.router.navigateByUrl(noti.message_json.LinkDesktop);
            }
          } else {
            if (noti.message_json.AppCode == "TEAM") //  begin dành cho jeeteam
            {
              if (noti.message_json.key = "cmt" && noti.message_json.key) {
                this.router.navigateByUrl(noti.message_json.LinkDesktop);
                localStorage.setItem("activeTab", "TEAM");
                this.menu_service.OpenTabChat$.next("TEAM");

                // this.topic_services.data_share_OpenComment = noti.message_json.IdTopic
              }
              else {
                this.router.navigateByUrl(noti.message_json.LinkDesktop);
                // this.topic_services.data_share_OpenComment = undefined;
                this.menu_service.OpenTabChat$.next("TEAM");
                localStorage.setItem("activeTab", "TEAM");
              }
            }
            // end dành cho jeeteam
            else {
              this.router.navigateByUrl(noti.message_json.LinkDesktop);

            }
          }

        }
      }
      else {
        localStorage.setItem("activeTab", null);

        if (noti.message_json.AppCode == "WORK") {//Thiên bổ sung ngày 08/09/2022
          if ((noti.menuID && noti.menuID == 2) && (noti.submenuID && noti.submenuID == 7)) {
            this.router.navigate(['', { outlets: { auxName: 'aux/detailWork/' + noti.idObject }, }]);
          } else {
            this.router.navigateByUrl(noti.message_json.LinkDesktop);
          }
        } else {

          this.router.navigateByUrl(noti.message_json.LinkDesktop);
        }
      }
      this.reloadMainSub();
    });
  }

  getListNoti() {
    this.socketService.getNotificationList('').subscribe(res => {
      res.forEach(x => {
        // x.createdDate = moment(x.createdDate).format("hh:mm A - DD/MM/YYYY")
        x.createdDate = this.format_convertDate(x.createdDate);
        if ((x.message_json == null || x.message_json.Content == null) && x.message_text == null) {
          x.message_text = "Thông báo không có nội dung"
        }
      });
      this.listNoti = res;

      // this.loadUnreadList.emit(true) //load thành công list load số thông báo chưa đọc
      this.changeDetectorRefs.detectChanges();
    })
  }

  DanhDauDaXem() {
    let appCode = this.tokenStorage.getMainmenu();//Thiên bổ sung để load submenu theo các main tương ứng
    if (appCode == "WORK") {
      this.socketioStore.updateSub = false;
    }
    this.socketService.ReadAll().subscribe(res => {
      this.socketioStore.updateMain = true;
      if (appCode == "WORK") {
        this.socketioStore.updateSub = true;
      }
      if (appCode == "JeeHR") {
        const busEvent = new CustomEvent('event-submenu', {
          bubbles: true,
          detail: {
            eventType: 'update-sub-jeehr',
            customData: 'some data here'
          }
        });
        dispatchEvent(busEvent);
      }

      if (appCode == "ADMIN") {
        const busEvent = new CustomEvent('event-submenu', {
          bubbles: true,
          detail: {
            eventType: 'update-sub-admin',
            customData: 'some data here'
          }
        });
        dispatchEvent(busEvent);
      }
      const busEvent = new CustomEvent('event-mainmenu', {
        bubbles: true,
        detail: {
          eventType: 'update-main',
          customData: 'some data here'
        }
      });
      dispatchEvent(busEvent);

      this.loadUnreadList.emit(true)
    });
    this.listNoti.forEach(res => {
      res.isRead = true;//Xử lý theo client
    })
  }

  reloadMainSub() {
    const busEvent = new CustomEvent('event-mainmenu', {
      bubbles: true,
      detail: {
        eventType: 'update-main',
        customData: 'some data here'
      }
    });
    dispatchEvent(busEvent);
    let appCode = this.tokenStorage.getMainmenu();//Thiên bổ sung để load submenu theo các main tương ứng

    if (appCode == "JeeHR") {
      const busEvent = new CustomEvent('event-submenu', {
        bubbles: true,
        detail: {
          eventType: 'update-sub-jeehr',
          customData: 'some data here'
        }
      });
      dispatchEvent(busEvent);
    }

    if (appCode == "ADMIN") {
      const busEvent = new CustomEvent('event-submenu', {
        bubbles: true,
        detail: {
          eventType: 'update-sub-admin',
          customData: 'some data here'
        }
      });
      dispatchEvent(busEvent);
    }

  }
  //========================= Hiển thị theo định dạng Số ngày trước thời điểm hiện tại================
  format_convertDate(Value: any) {
    if (Value == "" || Value == null) {
      return "";
    }

    let langcode = "";
    if (localStorage.getItem('language') == null) {
      langcode = "vi";
    } else {
      langcode = localStorage.getItem('language');
    }
    //Giá trị đầu vào
    let date_value = new Date(Value);
    let date_now = new Date();

    //Convert ngày về dạng string MM/dd/yyyy

    let str_tmp1 = this.datePipe.transform(date_value, 'MM/dd/yyyy');
    let str_tmp2 = this.datePipe.transform(date_now, 'MM/dd/yyyy');

    //Part giá trị này về lại dạng ngày
    var date_tmp1 = new Date(str_tmp1);
    var date_tmp2 = new Date(str_tmp2);
    //Tính ra số ngày
    let daays = (date_tmp1.getTime() - date_tmp2.getTime()) / 1000 / 60 / 60 / 24;
    let date_return = '';
    if (daays < 0) {
      if (langcode == "vi") {
        date_return = (daays * (-1)) + " ngày trước";
      } else {
        date_return = (daays * (-1)) + " days ago";
      }
    } else {
      date_return = moment(Value).format("hh:mm A")
    }

    return date_return;
  }

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 76;
    return tmp_height + 'px';
  }

  //=============================================
  onEventLoadNotify(e: CustomEvent) {
    if (e.detail.eventType === 'load-notify') {
      this.getListNoti();
      this.loadUnreadList.emit(true)
    }
  }
}
