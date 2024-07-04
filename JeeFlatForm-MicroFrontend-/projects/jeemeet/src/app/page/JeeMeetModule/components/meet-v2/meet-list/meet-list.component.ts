import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { MenuServices } from '../../../_services/menu.service';
import { TranslateService } from '@ngx-translate/core';
import { MeetingStore } from '../../../_services/meeting.store';
import { TranslationService } from 'projects/jeemeet/src/modules/i18n/translation.service';
import { locale as viLang } from '../../../../../../../src/modules/i18n/vocabs/vi';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { DangKyCuocHopService } from '../../../_services/dang-ky-cuoc-hop.service';
import { MatDialog } from '@angular/material/dialog';
import { QLCuocHopModel } from '../../../_models/quan-ly-cuoc-hop.model';
import { QuanLyCuocHopEditComponent } from '../../quan-ly-cuoc-hop-edit/quan-ly-cuoc-hop-edit.component';
import { DynamicSearchFormService } from '../../dynamic-search-form/dynamic-search-form.service';
import { QuanLyCuocHopEditV2Component } from '../quan-ly-cuoc-hop-edit/quan-ly-cuoc-hop-edit.component';
@Component({
  selector: 'app-meet-list',
  templateUrl: './meet-list.component.html',
  styleUrls: ['./meet-list.component.scss']
})
export class MeetListComponent implements OnInit {
  //filter
  keyword: string
  minDate: string = ''
  maxDate: string = ''
  TuNgay: string = ''
  DenNgay: string = ''
  SoKyHieu: string = ''
  KeyNguoiTao: string = ''
  DonVi: string = ''
  KeyView: string = ''
  //
  selectedTab: number = 0
  sapDang: number = 3
  labelFilter: string = "Sắp/đang diễn ra";
  isLoad: string = '';
  status: string = '1'
  Type: string = '1';
  tinhTrang: string = "1"
  //fields
  isList: boolean = true;
  listMenu: any[] = [];


  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private menuServices: MenuServices,
    private changeDetectorRefs: ChangeDetectorRef,
    private translate: TranslateService,
    private store: MeetingStore,
    private translationService: TranslationService,
    public dangKyCuocHopService: DangKyCuocHopService,
    public dialog: MatDialog,
    private dynamicSearchFormService: DynamicSearchFormService,
  ) {
    this.translationService.loadTranslations(
      viLang,
    );
    var langcode = localStorage.getItem('language');
    if (langcode == null)
      langcode = this.translate.getDefaultLang();
    this.translationService.setLanguage(langcode);
  }

  ngOnInit(): void {
    this.GetListMenu()

    const url = window.location.pathname;
    const regex = /\/Meet\/\d+/;
    this.isList = !regex.test(url);
    this.getSelectNode()
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const meetParamIndex = event.url.indexOf('/Meet/');
        if (meetParamIndex !== -1) {
          this.isList = false;
          const slicedString = event.url.slice(meetParamIndex + '/Meet/'.length);
          const parts = slicedString.split('?Type=');

          if (parts.length === 1) {
            this.isList = false;
          }
        } else {
          this.isList = true;
        }
      }
    });

    //xử lý dynamic
    let opt = {
      title: "Tìm kiếm tên cuộc họp và ấn enter",
      controls: [
        {
          type: 5,
          placeholder: "Ngày bắt đầu/kết thúc",
          from: {
            name: 'TuNgay',
            max: this.maxDate,
            input: this.minDate
          },
          to: {
            name: 'DenNgay',
            min: this.minDate,
            input: this.maxDate
          }
        }, {
          type: 14,
          placeholder: "Tên cuộc họp",
          name: "keyword"
        },
        {
          type: 14,
          placeholder: "Số hiệu",
          name: "SoKyHieu"
        },
        {
          type: 22,
          placeholder: "Đơn vị mời họp",
          name: "DonVi"
        },
        {
          type: 14,
          placeholder: "Người tạo ",
          name: "KeyNguoiTao"
        },
        {
          type: 21,
          placeholder: "Đã/chưa xem",
          name: "KeyView"
        },
      ]
    }
    this.dynamicSearchFormService.setOption(opt);
    this.dynamicSearchFormService.filterResult.subscribe(value => {
      this.keyword = value.keyword
      this.TuNgay = value.TuNgay
      this.DenNgay = value.DenNgay
      this.SoKyHieu = value.SoKyHieu
      this.KeyNguoiTao = value.KeyNguoiTao
      this.DonVi = value.DonVi
      this.KeyView = value.KeyView
    });
  }

  GetListMenu() {
    this.menuServices.GetListMenu("MEET").subscribe(res => {
      if (res && res.status == 1) {
        this.listMenu = res.data;
        const user = this.getAuthFromLocalStorage()['user'];
        let roles = user['customData']["jee-meet"].roles;
        if (roles.includes('11400')) {
          this.listMenu.push({
            "RowID": 99,
            "Title": "lichhopdonvi",
            "Title_Res": null,
            "Icon": "",
            "ALink": "/lich-hop-don-vi",
            "SoLuong": 1,
            "link": "../../../../../../assets/icons/imennu_calendar.svg"
          })
        }
        // if (roles.includes('11393')) {
        //   this.listMenu.push({
        //     "RowID": 98,
        //     "Title": "thongkecuochop",
        //     "Title_Res": null,
        //     "Icon": "",
        //     "ALink": "/thong-ke-hop-don-vi",
        //     "SoLuong": 1,
        //     "link": "../../../../../../assets/icons/imenu_thongke.svg",
        //   })
        // }
        // if (roles.includes('11393')) {
        //   this.listMenu.push({
        //     "RowID": 98,
        //     "Title": "thongkecuochopdonvithamgia",
        //     "Title_Res": null,
        //     "Icon": "",
        //     "ALink": "/thong-ke-cuoc-hop-don-vi-tham-gia",
        //     "SoLuong": 1,
        //     "link": "../../../../../../assets/icons/imenu_thongke.svg"
        //   })
        // }
        if (roles.includes('11393')) {
          this.listMenu.push({
            "RowID": 999,
            "Title": "thongkedropdown",
            "Title_Res": null,
            "Icon": "",
            "ALink": "/thong-ke-hop-don-vi",
            "SoLuong": 1,
            "link": "../../../../../../assets/icons/imenu_thongke.svg",
            "SubMenu": [{
              "RowID": 98,
              "Title": this.translate.instant('SubMenu.' + '' + "thongkecuochop"),
              "Title_Res": null,
              "Icon": "",
              "ALink": "/thong-ke-hop-don-vi",
              "SoLuong": 1,
              "link": "../../../../../../assets/icons/imenu_thongke.svg"
            }, {
              "RowID": 92,
              "Title": this.translate.instant('SubMenu.' + '' + "thongkecuochopdonvithamgia"),
              "Title_Res": null,
              "Icon": "",
              "ALink": "/thong-ke-cuoc-hop-don-vi-tham-gia",
              "SoLuong": 1,
              "link": "../../../../../../assets/icons/imenu_thongke.svg"
            }, {
              "RowID": 91,
              "Title": this.translate.instant('SubMenu.' + '' + "thongkecuochoptheochucvu"),
              "Title_Res": null,
              "Icon": "",
              "ALink": "/thong-ke-cuoc-hop-theo-chuc-vu",
              "SoLuong": 1,
              "link": "../../../../../../assets/icons/imenu_thongke.svg"
            }]
          })
        }
        this.listMenu.push({
          "RowID": 97,
          "Title": "cuochopluutru",
          "Title_Res": null,
          "Icon": "",
          "ALink": "/luu-tru",
          "SoLuong": 1,
          "link": "../../../../../../assets/icons/imenu_-form.svg"
        })

        this.listMenu.push({
          "RowID": 96,
          "Title": "lichcongtac",
          "Title_Res": null,
          "Icon": "",
          "ALink": "/lich-cong-tac",
          "SoLuong": 1,
          "link": "../../../../../../assets/icons/imennu_calendar.svg"
        })
        this.listMenu.map((item, index) => {
          let _title = "";
          if (item.Title != "") {
            _title = this.translate.instant('SubMenu.' + '' + item.Title);
          }
          if (item.RowID == 16) {
            item.link = "../../../../../../assets/icons/imenu_nhomhop.svg";
          }
          if (item.RowID == 15) {
            item.link = "../../../../../../assets/icons/imenu_-form.svg";
          }
          item.Title = _title;
        })
        this.listMenu = this.listMenu.filter((item) => { return item.RowID != 14 })
        this.changeDetectorRefs.detectChanges();
      }
    })
  }

  __selectedNode = "/Meet";
  RouterLink(val) {
    let obj = this.listMenu.find(x => x.ALink === val.ALink);
    if (obj && obj.SoLuong > 0) {
      // this.updateReadMenu(obj);
    }
    debugger
    this.__selectedNode = val.ALink;
    let link = "/Meet" + val.ALink;
    if (!val.SubMenu) {
      this.router.navigate([`${link}`]);
    }
  }

  getSelectNode() {
    this.__selectedNode = window.location.pathname.split("/Meet")[1];
    let split = this.__selectedNode.split("/");
    if (split.length > 2) {
      this.__selectedNode = "/" + this.__selectedNode.split("/")[1];
    }
    if (split.length == 2) {

      if (split[1] == '') {
        this.isList = true;
      } else {
        this.isList = false;
      }
    };
  }

  public getAuthFromLocalStorage(): any {
    return JSON.parse(localStorage.getItem("getAuthFromLocalStorage"));
  }

  //load menu
  loadDataList() {

  }
  // tao cuoc hop
  taoMoiCuocHop() {
    const QLCuocHop = new QLCuocHopModel();
    QLCuocHop.clear();
    const dialogRef = this.dialog.open(QuanLyCuocHopEditV2Component, {
      disableClose: true,
      panelClass: 'no-padding', data: { QLCuocHop }, width: '60%'
    });
    dialogRef.afterClosed().subscribe(res => {

      if (!res) {
        return;
      } else {
        this.router.navigate(
          [
            `/Meet/${res.RowID}`
          ],
          { queryParams: { Type: 0 } }
        );
      }

    })
  }
  onLinkClick(eventTab: MatTabChangeEvent) {
    this.selectedTab = eventTab.index;
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
  }

}
