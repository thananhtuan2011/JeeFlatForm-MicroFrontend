import { Component, OnInit, OnDestroy, ChangeDetectorRef, HostBinding, Input, ViewChild, TemplateRef, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription, fromEvent } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { JeeTeamService } from '../services/jeeteam.service';
import { MenuJeeTeamServices } from '../services/menu_jeeteam.service';
import { DynamicAsideMenuService } from '../services/dynamic-aside-menu.service';
import { AddMemberComponent } from '../add-member/add-member.component';
import { CreatedChannelComponent } from '../created-channel/created-channel.component';
import { QuanlyTeamComponent } from '../quanly-team/quanly-team.component';
import { CreatedGroupComponent } from '../created-group/created-group.component';
import { EditNameTeamComponent } from '../edit-name-team/edit-name-team.component';
import { EditNameChanelComponent } from '../edit-name-chanel/edit-name-chanel.component';
import { LayoutJeeTeamService } from '../services/layout-jee-team.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { LayoutUtilsService, MessageType } from 'projects/jeeteam/src/modules/crud/utils/layout-utils.service';

@Component({
  selector: 'app-aside-dynamic',
  templateUrl: './aside-dynamic.component.html',
  styleUrls: ['./aside-dynamic.component.scss'],

})
export class AsideDynamicComponent implements OnInit, OnDestroy {
  Admin: any
  menuConfig: any;
  subscriptions: Subscription[] = [];
  expanded: boolean = false;
  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() item: any;
  @Input() depth: number;
  disableAsideSelfDisplay: boolean;
  headerLogo: string;
  brandSkin: string;
  ulCSSClasses: string;
  asideMenuHTMLAttributes: any = {};
  asideMenuCSSClasses: string;
  asideMenuDropdown;
  brandClasses: string;
  asideMenuScroll = 1;
  asideSelfMinimizeToggle = false;
  UserID: any;
  currentUrl: string;
  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    public router: Router,
    public overlay: Overlay,
    public viewContainerRef: ViewContainerRef,
    private layout: LayoutJeeTeamService,
    private dashboar_service: JeeTeamService,
    private menu_services: MenuJeeTeamServices,
    private menu: DynamicAsideMenuService,
    private cdr: ChangeDetectorRef) {
    const user = this.dashboar_service.getAuthFromLocalStorage();
    if (user) {
      this.UserID = user['user']['customData']['jee-account']['userID'];

    }
  }
  // Test()
  // {

  // var dt=document.body.classList;
  //   alert(dt)
  //   if (dt.in) {
  //     alert("CCC")
  //     // document.body.classList.add('aside-minimize');
  //   }
  // }
  step = null;

  setStep(index: number) {
    this.step = index;
    localStorage.setItem("indexteam", index.toString())
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  sub: Subscription;
  close() {
    this.sub && this.sub.unsubscribe();
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
  @ViewChild('userMenu') userMenu: TemplateRef<any>;
  @ViewChild('userSubMenu') userSubMenu: TemplateRef<any>;
  @ViewChild('userSubMenuHiden') userSubMenuHiden: TemplateRef<any>;
  overlayRef: OverlayRef | null;
  open({ x, y }: MouseEvent, user) {
    this.close();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef.attach(new TemplatePortal(this.userMenu, this.viewContainerRef, {
      $implicit: user
    }));

    this.sub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => {
          const clickTarget = event.target as HTMLElement;
          return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
        }),
        take(1)
      ).subscribe(() => this.close())
  }
  opensub({ x, y }: MouseEvent, user) {
    this.close();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef.attach(new TemplatePortal(this.userSubMenu, this.viewContainerRef, {
      $implicit: user
    }));

    this.sub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => {
          const clickTarget = event.target as HTMLElement;
          return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
        }),
        take(1)
      ).subscribe(() => this.close())
  }
  opensubhiden({ x, y }: MouseEvent, user) {
    this.close();
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo({ x, y })
      .withPositions([
        {
          originX: 'end',
          originY: 'bottom',
          overlayX: 'end',
          overlayY: 'top',
        }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.close()
    });

    this.overlayRef.attach(new TemplatePortal(this.userSubMenuHiden, this.viewContainerRef, {
      $implicit: user
    }));

    this.sub = fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => {
          const clickTarget = event.target as HTMLElement;
          return !!this.overlayRef && !this.overlayRef.overlayElement.contains(clickTarget);
        }),
        take(1)
      ).subscribe(() => this.close())
  }

  // GetPhanQuyen() {
  //   this.dashboar_service.GetPhanQuyen().subscribe(res => {

  //     if (res) {
  //       if (res.data.length > 0)
  //         this.Admin = res.data[0].IdGroup
  //     }

  //   })
  // }
  Router() {
    this.router.navigateByUrl("/Group")
  }
  EventGetPhanQuyenInJeeTeam() {

    // this.GetPhanQuyen();
    this.menu.loadMenu("");
  }
  // CheckTabOpenWhenReload()
  // {

  //   let indexmenu=this.menuConfig.items.findindex(x=>x.RowId==res.data.IdMenu)
  //       console.log("indexmenu",indexmenu)
  // }
  AddGroup() {
    const sb = this.dashboar_service.created_group$.subscribe(res => {
      if (res == true) {
        this.CreaterGroupMenu();
      }
    })
    this.subscriptions.push(sb);

  }
  EventSearch() {
    const sb = this.dashboar_service._Search_Team$.subscribe(res => {
      if (res) {
        this.menu.loadMenu(res);
      }
      else {
        this.menu.loadMenu("");
      }
    })
    this.subscriptions.push(sb);
  }
  ngOnInit(): void {
    this.EventSearch();
    this.AddGroup();
    let indexteam = localStorage.getItem("indexteam")
    this.setStep(Number.parseInt(indexteam))
    // load view settings
    this.EventGetPhanQuyenInJeeTeam();

    // this.GetPhanQuyen();
    // this.menu.loadMenu("");


    // router subscription
    this.currentUrl = this.router.url.split(/[?#]/)[0];
    const routerSubscr = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
      this.cdr.detectChanges();
    });
    this.subscriptions.push(routerSubscr);

    // menu load động
    // this.GetDSMeNuGroup();
    const menuSubscr = this.menu.menuConfig$.subscribe(res => {
      this.menuConfig = res;
      this.cdr.detectChanges();
    });

    this.subscriptions.push(menuSubscr);
  }


  AddMember(RowId: any) {
    // alert(RowId)
    const dialogRef = this.dialog.open(AddMemberComponent, {
      width: '600px',
      data: { RowId },
      // height:'600px',

      // panelClass:'no-padding'

    });
    dialogRef.afterClosed().subscribe(res => {


      if (res) {
        // this.menu.loadMenu();

        this.changeDetectorRefs.detectChanges();
      }
    })

  }
  QuanlyTeam(RowId: any) {
    // alert(RowId)
    const dialogRef = this.dialog.open(QuanlyTeamComponent, {
      // width:'600px',
      data: { RowId },
      // height:'600px',

      // panelClass:'no-padding'

    });
    dialogRef.afterClosed().subscribe(res => {


      if (res) {
        // this.menu.loadMenu();

        this.changeDetectorRefs.detectChanges();
      }
    })

  }
  AddChannel(RowId: any) {
    // alert(RowId)
    const dialogRef = this.dialog.open(CreatedChannelComponent, {
      width: '550px',
      data: { RowId },
      // height:'600px',

      // panelClass:'no-padding'

    });
    dialogRef.afterClosed().subscribe(res => {

      if (res) {
        this.menu.ReloadMenu();
        this.router.navigateByUrl(res.data.page.replace('dashboard', 'Group'))
        // let indexmenu=this.menuConfig.items.findindex(x=>x.RowId==res.data.IdMenu)
        // console.log("indexmenu",indexmenu)
        // this.menuConfig[indexmenu].submenu.push(res.data)
        // this.menu.loadMenu();

        this.changeDetectorRefs.detectChanges();
      }
    })

  }
  creaFormPrivateDelete(idmenu: number) {
    const _title = this.translate.instant('Xóa Kênh');
    const _description = this.translate.instant('Bạn có muốn xóa không ?');
    const _waitDesciption = this.translate.instant('Dữ liệu đang được xóa');
    const _deleteMessage = this.translate.instant('Xóa thành công !');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.menu_services.DeletePrivateMenu(idmenu).subscribe(res => {




        // this.layoutUtilsService.OffWaitingDiv();
        if (res && res.status === 1) {
          this.menu.ReloadMenu();
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
        } else {
        }
      })

    });
  }
  creaFormSubDelete(idmenu: number, idchilsub: number, isprivate: boolean) {


    const _title = this.translate.instant('Xóa Kênh');
    const _description = this.translate.instant('Bạn có muốn xóa không ?');
    const _waitDesciption = this.translate.instant('Dữ liệu đang được xóa');
    const _deleteMessage = this.translate.instant('Xóa thành công !');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      if (isprivate == true) {
        this.menu_services.DeletePrivateMenu(idchilsub).subscribe(res => {




          // this.layoutUtilsService.OffWaitingDiv();
          if (res && res.status === 1) {
            this.menu.ReloadMenu();
            var dt = JSON.parse(localStorage.getItem("KeyIdMenu"))
            if (idchilsub == dt[0].Idmenu) {
              this.router.navigateByUrl("/Group")
            }

            this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
          } else {
          }
        })
      }
      else {

        this.menu_services.DeleteSubMenu(idmenu).subscribe(res => {

          // this.layoutUtilsService.OffWaitingDiv();
          if (res && res.status === 1) {
            var dt = JSON.parse(localStorage.getItem("KeyIdMenu"))
            if (idmenu == dt[0].Idmenu) {
              this.router.navigateByUrl("/Group")
            }
            this.menu.ReloadMenu();
            this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
          } else {
          }
        })
      }

    });
  }
  creaFormDelete(idmenu: number) {
    const _title = this.translate.instant('Xóa Kênh');
    const _description = this.translate.instant('Bạn có muốn xóa không ?');
    const _waitDesciption = this.translate.instant('Dữ liệu đang được xóa');
    const _deleteMessage = this.translate.instant('Xóa thành công !');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      this.menu_services.DeleteMenu(idmenu).subscribe(res => {




        // this.layoutUtilsService.OffWaitingDiv();
        if (res && res.status === 1) {
          this.menu.ReloadMenu();
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
        } else {
        }
      })

    });
  }
  GetDSMeNuGroup() {

  }
  CreaterGroupMenu() {
    // this.dcmt.body.classList.add('header-fixed');
    const dialogRef = this.dialog.open(CreatedGroupComponent, {
      width: '550px',
      // height:'600px',

      // panelClass:'no-padding'

    });
    dialogRef.afterClosed().subscribe(res => {
      // console.log("HHHHHHHHHHHHHHHHHHHH",res)
      this.dashboar_service.created_group.next(false)
      if (res) {

        this.menu.loadMenu("");
        // this.GetContact();
        // this.subscribeToEvents();
        // this.GetContact();
        this.changeDetectorRefs.detectChanges();
      }
    })

  }
  private getLogo() {
    if (this.brandSkin === 'light') {
      return './assets/media/logos/mynhom.png';
    } else {
      return './assets/media/logos/mynhom.png';
      // return './assets/media/logos/logo-light.png';
    }
  }


  isMenuItemActive(path) {


    if (!this.currentUrl || !path) {
      return false;
    }

    if (this.currentUrl === path) {
      return true;
    }


    let cutlink = this.currentUrl.split("chanel")[0];
    if (path == cutlink) {
      return true;
    }
    if (this.currentUrl.indexOf(path) > -1) {
      return true;
    }

    return false;

  }


  Editnameteam(RowId: any, title: any) {
    // alert(RowId)
    const dialogRef = this.dialog.open(EditNameTeamComponent, {
      width: '600px',
      data: { RowId: RowId, title: title },
      // height:'600px',

      // panelClass:'no-padding'

    });
    dialogRef.afterClosed().subscribe(res => {


      if (res) {
        this.menu.ReloadMenu();

        this.changeDetectorRefs.detectChanges();
      }
    })

  }


  Editnamechanel(RowId: any, title: any, RowIdSubChild: number) {
    // alert(RowId)
    const dialogRef = this.dialog.open(EditNameChanelComponent, {
      width: '600px',
      data: { RowId: RowId, title: title, RowIdSubChild: RowIdSubChild },
      // height:'600px',

      // panelClass:'no-padding'

    });
    dialogRef.afterClosed().subscribe(res => {


      if (res) {
        this.menu.ReloadMenu();

        this.changeDetectorRefs.detectChanges();
      }
    })

  }

  AddHidden(item) {

    this.menu_services.AddHidden(item).subscribe(res => {
      if (res) {
        this.menu.ReloadMenu();
        this.layoutUtilsService.showActionNotification("Thành công", MessageType.Delete, 4000, true, false, 3000, 'top', 1);
      }

    })
  }
  CheckAn(item) {
    if (item.submenu.length > 0) {
      return true
    }
    else {
      return false
    }
  }
  DeleteHidden(item) {
    this.menu_services.DeleteHidden(item).subscribe(res => {
      if (res) {
        this.menu.ReloadMenu();
        this.layoutUtilsService.showActionNotification("Thành công", MessageType.Delete, 4000, true, false, 3000, 'top', 1);
      }

    })
  }


  ngOnDestroy() {
    localStorage.removeItem("indexteam")
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
