import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { DangKyCuocHopService } from '../../_services/dang-ky-cuoc-hop.service';
import { MeetingStore } from '../../_services/meeting.store';
import { TranslationService } from 'projects/jeemeet/src/modules/i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as viLang } from '../../../../../../src/modules/i18n/vocabs/vi';
import { QuanLyCuocHopEditComponent } from '../quan-ly-cuoc-hop-edit/quan-ly-cuoc-hop-edit.component';
import { QLCuocHopModel } from '../../_models/quan-ly-cuoc-hop.model';
import { MenuServices } from '../../_services/menu.service';
@Component({
  selector: 'app-menu-cuoc-hop',
  templateUrl: './menu-cuoc-hop.component.html',
  styleUrls: ['./menu-cuoc-hop.component.scss']
})
export class MenuCuocHopComponent implements OnInit {
  activeTabId:
    | 'kt_quick_panel_logs'
    | 'kt_quick_panel_notifications'
    | 'kt_quick_panel_settings' = 'kt_quick_panel_logs';
  tinhTrang: string = "1"
  minDate: string = ''
  maxDate: string = ''
  TuNgay: string = ''
  DenNgay: string = ''
  keyword: string
  labelFilter: string = "Sắp/đang diễn ra";
  isLoad: string = '';
  status: string = '1'
  Type: string = '1';
  createType: boolean = false;
  soluongtoithamgia: any = 0
  soluongtoicapnhat: any = 0
  selectedTab: number = 0
  sapDang: number = 3
  listMenu: any[] = [];
  constructor(public dangKyCuocHopService: DangKyCuocHopService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private store: MeetingStore,
    public dialog: MatDialog,
    private translationService: TranslationService,
    private translate: TranslateService,
    private menuServices: MenuServices,
  ) {
    this.translationService.loadTranslations(
      viLang,
    );
    var langcode = localStorage.getItem('language');
    if (langcode == null)
      langcode = this.translate.getDefaultLang();
    this.translationService.setLanguage(langcode);
  }

  ngOnInit() {
    this.GetListMenu()
    this.store.data_shareActived$.subscribe((data: any) => {
      if (data && data != '') {
        if (data == '0') {
          this.selectedTab = 0;
          this.changeDetectorRefs.detectChanges()
        }
        if (data == '1') {
          this.selectedTab = 1;
          this.changeDetectorRefs.detectChanges()
        }
        if (data == '2') {
          this.selectedTab = 2;
          this.changeDetectorRefs.detectChanges()
        }
        if (data == '3') {
          this.selectedTab = 2;
          this.changeDetectorRefs.detectChanges()
        }
      }
    })
    // this.dangKyCuocHopService.SoLuongChoCapNhat(4).subscribe(res => {
    // 	if (res) {
    // 		 this.soluongtoithamgia = res
    //   }
    //   this.changeDetectorRefs.detectChanges()
    // });
    // this.dangKyCuocHopService.SoLuongChoCapNhat(5).subscribe(res => {
    // 	if (res) {
    // 		 this.soluongtoicapnhat = res
    //   }
    //   this.changeDetectorRefs.detectChanges()
    // });
    this.createType = false
  }
  setActiveTabId(tabId, type) {
    this.activeTabId = tabId;
    this.isLoad = tabId
    this.Type = type
  }

  getActiveCSSClasses(tabId) {
    if (tabId !== this.activeTabId) {
      return '';
    }
    return 'active show chieucao';
  }

  onLinkClick(eventTab: MatTabChangeEvent) {
    this.selectedTab = eventTab.index;
    this.changeDetectorRefs.detectChanges();

  }
  loadDataList() {

  }

  taoMoiCuocHop() {
    const QLCuocHop = new QLCuocHopModel();
    QLCuocHop.clear();
    const dialogRef = this.dialog.open(QuanLyCuocHopEditComponent, {
      disableClose: true,
      panelClass: 'no-padding', data: { QLCuocHop }, width: '60%'
    });
    dialogRef.afterClosed().subscribe(res => {

      if (!res) {
        return;
      } else {
        this.dangKyCuocHopService.data_shareLoad$.next(res)
      }

    })
  }

  getWidth() {
    let tmp_width = 0;
    tmp_width = window.innerWidth - 420;
    return tmp_width + 'px';
  }
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 50;
    return tmp_height + 'px';
  }

  ngOnDestroy(): void {
    this.createType = false
    this.changeDetectorRefs.detectChanges();
  }

  onLinkClickFilter(selectedTab: any, type = 0) {
    if (selectedTab == 0) {
      this.tinhTrang = "0";
      this.labelFilter = "Tất cả"
      this.sapDang = type
    } else if (selectedTab == 1) {
      this.tinhTrang = "1";
      if (type == 1) {
        this.labelFilter = "Sắp diễn ra"
      } else {
        this.labelFilter = "Đang diễn ra"
      }
      this.sapDang = type
    } else if (selectedTab == 2) {
      this.tinhTrang = "2";
      this.labelFilter = "Đã diễn ra"
    } else if (selectedTab == 3) {
      this.tinhTrang = "3";
      this.labelFilter = "Đã đóng"
    } else if (selectedTab == 4) {
      this.tinhTrang = "1";
      this.sapDang = type
      this.labelFilter = "Sắp/đang diễn ra"
    }
    else if (selectedTab == 5) {
      this.tinhTrang = "6";
      this.labelFilter = "Đã hoãn"
    }
    this.loadDataList();
  }

  public getAuthFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }

  GetListMenu() {
    this.menuServices.GetListMenu("MEET").subscribe(res => {
      if (res && res.status == 1) {
        this.listMenu = res.data;
        const user = this.getAuthFromLocalStorage()['user'];
        debugger
        let roles = user['customData']["jee-meet"].roles;
        if (roles.includes('11400')) {
          this.listMenu.push({
            "RowID": 99,
            "Title": "lichhopdonvi",
            "Title_Res": null,
            "Icon": "",
            "ALink": "/lich-hop-don-vi",
            "SoLuong": 1
          })
        }
        if (roles.includes('11393')) {
          this.listMenu.push({
            "RowID": 98,
            "Title": "thongkecuochop",
            "Title_Res": null,
            "Icon": "",
            "ALink": "/thong-ke-hop-don-vi",
            "SoLuong": 1
          })
        }
        this.listMenu.map((item, index) => {
          let _title = "";
          if (item.Title != "") {
            _title = this.translate.instant('SubMenu.' + '' + item.Title);
          }
          item.Title = _title;
        })
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  //========================================================
  __selectedNode = "/Meet";
  RouterLink(val) {
    let obj = this.listMenu.find(x => x.ALink === val.ALink);
    if (obj && obj.SoLuong > 0) {
      // this.updateReadMenu(obj);
    }
    this.__selectedNode = val.ALink;
    let link = "/Meet" + val.ALink;
    this.router.navigate([`${link}`]);
  }
  getSelectNode(): string {
    this.__selectedNode = window.location.pathname.split("/Meet")[1];
    let split = this.__selectedNode.split("/");
    if (split.length > 2) {
      this.__selectedNode = "/" + this.__selectedNode.split("/")[1];
    }
    if (split.length == 2) {

      if (split[1] == '') {
        return ''
      } else {
        return '/' + split[1]
      }
    }
    return this.__selectedNode;
  }

  onEventLoadMenu(e: CustomEvent) {
    if (e.detail.eventType === 'update-sub-admin') {
      this.GetListMenu();
    }
  }
}
