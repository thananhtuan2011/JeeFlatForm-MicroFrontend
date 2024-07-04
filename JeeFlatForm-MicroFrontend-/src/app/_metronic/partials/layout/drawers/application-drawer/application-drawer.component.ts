import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { NotifyServices } from 'src/app/_metronic/core/services/notify.service';
import { SocketioStore } from 'src/app/_metronic/core/services/socketio.store';
import { ThemeService } from 'src/app/_metronic/core/services/theme.service';

@Component({
  selector: 'app-application-drawer',
  templateUrl: './application-drawer.component.html',
})
export class ApplicationDrawerComponent implements OnInit {

  constructor(private notify: NotifyServices,
    private router: Router, private auth: AuthService,
    public themeService: ThemeService,
    public socketioStore: SocketioStore,
    private _ChangeDetectorRef: ChangeDetectorRef,) {

  }
  listApp: any = [];
  useIframe: string = '0';
  userID: number;
  isIframe: boolean;//Mở ứng dụng trong tab mới

  ngOnInit(): void {
    this.userID = this.auth.getUserId();
    this.notify.getListApp().subscribe(res => {
      if (res.status == 1) {
        this.listApp = res.data
      }
      this._ChangeDetectorRef.detectChanges();
    })
  }
  routerLink(app) {
    this.socketioStore.updateMinimize = false;
    // let link = window.location.protocol + "//" + app.BackendURL.split("://")[1];
    if (this.themeService.isIframe()) {
      window.open(app.BackendURL, "_blank");
    } else {
      this.socketioStore.updateMinimize = true;
      if (app.AppCode == "LANDING") {
        this.router.navigateByUrl('Dashboard');
      } else {
        this.router.navigateByUrl(`Iframe/${app.AppID}?redirectUrl=` + app.BackendURL);
      }
    }
  }

  getHeight() {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 74;
    return tmp_height + "px";
  }
}
