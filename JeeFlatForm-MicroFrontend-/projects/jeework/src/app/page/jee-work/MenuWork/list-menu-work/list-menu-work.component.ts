import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ActivatedRoute,
  NavigationStart,
  Router,
} from '@angular/router';
import {
  QueryParamsModelNew,
} from '../../models/query-models/query-params.model';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { ThietLapNhiemVuComponent } from '../ThietLapNhiemVu/ThietLapNhiemVu.component';
import { ThietLapPhongBan } from '../ThietLapPhongBan/ThietLapPhongBan.component';
import { ThietLapThe } from '../ThietLapThe/ThietLapThe.component';
import { fromEvent } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { ThietLapTemplate } from '../ThietLapTemplate/ThietLapTemplate.component';
import { ThietLapNhiemVuCuaDonVi } from '../ThietLapNhiemVuCuaDonVi/ThietLapNhiemVuCuaDonVi.component';
import { ThietLapNhiemVuPhoiHop } from '../ThietLapNhiemVuPhoiHop/ThietLapNhiemVuPhoiHop.component';
import { SocketioService } from '../../services/socketio.service';
import { environment } from 'projects/jeework/src/environments/environment';
import { ProjectTeamEditComponent, ProjectTeamModel } from '../project-team-edit/project-team-edit.component';
@Component({
  selector: 'app-list-menu-work',
  templateUrl: './list-menu-work.component.html',
  styleUrls: ['./list-menu-work.component.scss'],
})
export class ListMenuWorkComponent implements OnInit {
  //dg: da giao; dcg: duoc giao;
  clickedItem: any;
  param: string[];
  idMenu: any;
  currentRoute: string;
  _config = ['nhacnhonhiemvudagiao', 'nhacnhonhiemvudatao', 'nhacnhonhiemvuduocgiao'];

  constructor(
    public DanhMucChungService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private socketioService: SocketioService,
  ) {}

  listMenu: any;
  list: any;
  page: any;
  filter: any;
  tatcadg: any;
  quahandg: any;
  uutiencaodg: any;
  khancapdg: any;

  tatcadcg: any;
  quahandcg: any;
  uutiencaodcg: any;
  khancapdcg: any;

  tatcadt: any;
  quahandt: any;
  uutiencaodt: any;
  khancapdt: any;
  idClicked: any;
  DonViThucHien = [];
  Config_DonViThucHien = [];

  show_dagiao: boolean = true;
  show_duocgiao: boolean = true;
  show_datao: boolean = true;
  count_new: number = 0;

  Tags: any[];
  RuleBaoCao: boolean = false;
  id_priority:any;
  landkey:any;
  filterID:any;
  linkJee:any;
  ngOnInit(): void {
    this.getRoleWW()
    this.SetConfigDashboard();
    this.linkJee = window.location.href.split('/')[2];
    this.param = window.location.href.split('/');
    this.idMenu = this.param[this.param.length - 2];
    this.filter = this.param[this.param.length - 1];
    if (this.filter == 'home') {
      this.clickedItem = 'mainPage';
    }
    if (this.filter == 'BaoCao') {
      this.clickedItem = 'report';
    }
    if (+this.idMenu == 6) {
      this.clickedItem = 'new';
    }
    this.loadData();
    const $eventloadchat = fromEvent<CustomEvent>(window, 'event-count-isnew').subscribe((e) => this.onEventCountNew(e));
    const $eventloadgoback = fromEvent<CustomEvent>(window, 'event-list-task').subscribe((e) => this.onEventCountNew(e));
    this.DanhMucChungService.send$.subscribe((data: any) => {
      if (data == "LoadMenu") {
        this.loadData();
        this.DanhMucChungService.send$.next('');
      }
    })
    this.getTemplate();
    //========Check quyền xem báo cáo===========
    this.DanhMucChungService.CheckAuthorizeReport().subscribe(res => {
      if (res && res.status == 1) {
        this.RuleBaoCao = true;
      } else {
        this.RuleBaoCao = false;
      }
      this.changeDetectorRefs.detectChanges();
    })
  }
  getTag() {
    this.DanhMucChungService.ListTagAll().subscribe(res => {
      if (res && res.data) {
        this.Tags = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }

  SetConfigDashboard() {
    this._config.forEach(ele => {
      if (this.CheckNull(ele)) {
        localStorage.setItem(ele, 'true');
      }
    })
  }
  CheckNull(name) {
    let rs = localStorage.getItem(name);
    if (rs == null) {
      return true;
    }
    return false;
  }
  loadData() {
    this.DanhMucChungService.getMenuDSNV().subscribe((res) => {
      if (res && res.status == 1) {
        this.listMenu = res.data;
        // let a=this.listMenu[0].ListFillter[this.listMenu[0].ListFillter.length]
        if (this.idMenu == 1 || this.idMenu == 2 || this.idMenu == 3) {

          let item = this.listMenu[Number(this.idMenu) - 1].ListFillter.find(t => t.FilterID == this.filter);
          if (this.idClicked) {
            this.clickedItem = this.idClicked;
          } else {
            this.clickedItem = item.image;
            this.id_priority=item.id_priority;
            this.landkey=item.image;
            this.filterID=item.FilterID;
          }
        }
      }
      this.count_new = +res.id;
      this.changeDetectorRefs.detectChanges();
    });
    this.loadDataDVTH();
    this.getTag();
  }

  filterConfiguration(a: any): any {
    const filter: any = {};
    return filter;
  }
  filterConfigurationUuTien(a: any, b: any): any {
    const filter: any = { tien_do: a, clickup_prioritize: b };
    return filter;
  }

  loadDataDVTH() {
    const queryParams = new QueryParamsModelNew('', 'asc', '');
    this.DanhMucChungService.getDonViThucHien(queryParams).subscribe((res) => {
      if (res && res.status == 1) {
        this.DonViThucHien = res.data;
        this.Config_DonViThucHien = res.config;
        this.clickedItem = this.idMenu;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  onClick(item, key) {
    let idMenu;
    this.idClicked = item.image;
    switch (key) {
      case 'nhiemvudagiao': { idMenu = 1; break; }
      case 'nhiemvuduocgiao': { idMenu = 2; break; }
      case 'nhiemvudatao': { idMenu = 3; break; }
      case 'nhiemvutheodoi': { idMenu = 5; break; }
      case 'nhiemvucuadonvi': { idMenu = 8; break; }
      case 'nhiemvuphoihop': { idMenu = 9; break; }
      case 'nhiemvuthamgia': { idMenu = 10; break; }
      case 'nhiemvulaplai': { idMenu = 11; break; }
      case 'choduyetketqua': { idMenu = 12; break; }
      case 'nhiemvucuatoi': { idMenu = 13; break; }
      
    }
    this.clickedItem = item.image;
    this.id_priority=item.id_priority;
    this.landkey=item.image;
    this.filterID=item.FilterID;
    localStorage.setItem('config_status', JSON.stringify(item.Filter_StatusType));
    this.router.navigate(['/WorkV2/list', idMenu, item.FilterID]);
  }

  openSetting() {
    // const dialogRef = this.dialog.open(ThietLapNhiemVuComponent, { data: { title, filter: {}, excludes: excludes, owner: owner }, width: '500px' });
    const dialogRef = this.dialog.open(ThietLapNhiemVuComponent, { 
    data:{landkey:this.landkey , id_priority:this.id_priority,filterID:this.filterID},disableClose: true, width: '60vw', height: '65vh', panelClass: ['pn-thietlap'],autoFocus:false });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        this.loadData();
        this.updateReadItem();
      }
    });
  }
  openSettingDept() {
    // const dialogRef = this.dialog.open(ThietLapNhiemVuComponent, { data: { title, filter: {}, excludes: excludes, owner: owner }, width: '500px' });
    const dialogRef = this.dialog.open(ThietLapPhongBan, { disableClose: true, width: '60vw', height: '65vh', panelClass: ['pn-thietlap'] });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        this.loadData();
      }
    });
  }
  onClickForProject(dv) {
    let id_menu = 4;
    this.clickedItem = dv.id_row;
    localStorage.setItem('titleDept', dv.title);
    localStorage.setItem('config', JSON.stringify(this.Config_DonViThucHien));
    this.router.navigate(['/WorkV2/list', id_menu, 0, dv.id_row, 0]);
  }
  onClickForTags(tag) {
    let id_menu = 7;
    this.clickedItem = tag.rowid;
    localStorage.setItem('titleProject', tag.ProjectName);
    let idTag = 0;
    if (tag.CategoryType != 0) {
      idTag = tag.CategoryID;
    }
    localStorage.setItem('config_status', JSON.stringify(tag.Filter_StatusType));
    this.router.navigate(['/WorkV2/list', id_menu, 0, idTag, tag.rowid]);
  }
  onClickMainPage() {
    this.clickedItem = 'mainPage';
    this.router.navigate(['/WorkV2']);
  }
  onClickReport() {
    let isGov = this.DanhMucChungService.isGov();
    this.clickedItem = 'report';
    if(!isGov){
      this.router.navigate(['/WorkV2/BaoCaoDN']);
    }
    else{
      this.router.navigate(['/WorkV2/BaoCao']);
    }
  }
  onClickNew() {
    this.clickedItem = 'new';
    this.router.navigate(['/WorkV2/list', 6, 5]);
  }
  openTags() {
    const dialogRef = this.dialog.open(ThietLapThe, {
      disableClose: true,
      width: '68vw', height: '65vh', panelClass: ['pn-thietlap']
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        this.loadData();
      }
    });
  }
  updateReadItem() {
    let _item = {
      "appCode": "WORKV2",
      "mainMenuID": 12,
      "subMenuID": 7,
      "itemID": +0,
    }
    this.socketioService.readNotification_menu(_item).subscribe(res => {
      //event để reload lại list nhiệm vụ trạng thái
      const busEvent1 = new CustomEvent('event-list-task-status', {
        bubbles: true,
        detail: {
          eventType: 'update-task-status',
          customData: 'some data here'
        }
      });
      dispatchEvent(busEvent1);
    })
  }

  onEventCountNew(e: CustomEvent) {
    if (e.detail.eventType === 'count-isnew') {
      // this.count_new = e.detail.customData;
      // this.changeDetectorRefs.detectChanges();
      this.DanhMucChungService.getMenuDSNV().subscribe((res) => {
        this.count_new = +res.id;
        this.changeDetectorRefs.detectChanges();
      });
    }
    if (e.detail.eventType === 'update-task') {
      // this.count_new = e.detail.customData;
      // this.changeDetectorRefs.detectChanges();
      this.loadData();
    }
  }

  //=====================Xử lý css backgroung menu=======================
  //1 :Main page
  getMainPage(type) {
    switch (type) {
      case 1:
        if (window.location.pathname == "/WorkV2") {
          return true;
        } return false;
      case 2:
        if (window.location.pathname == "/WorkV2/BaoCao" || window.location.pathname == "/WorkV2/BaoCaoDN") {
          return true;
        } return false;
      case 3:
        if (window.location.pathname == "/WorkV2/list/6/5") {
          return true;
        } return false;
      default:
        return false;
    }
  }

  getNhiemVu(menu, item) {
    let idMenu;
    let check = false;
    switch (menu.Langkey) {
      case 'nhiemvudagiao': { idMenu = 1; break; }
      case 'nhiemvuduocgiao': { idMenu = 2; break; }
      case 'nhiemvudatao': { idMenu = 3; break; }
      case 'nhiemvutheodoi': { idMenu = 5; break; }
      case 'nhiemvucuadonvi': { idMenu = 8; break; }
      case 'nhiemvuphoihop': { idMenu = 9; break; }
      case 'nhiemvuthamgia': { idMenu = 10; break; }
      case 'nhiemvulaplai': { idMenu = 11; break; }
      case 'choduyetketqua': { idMenu = 12; break; }
      case 'nhiemvucuatoi': { idMenu = 13; break; }
    }
    let obj = window.location.pathname.split("/");
    if (obj) {
      if (obj[3] == idMenu && obj[4] == item.FilterID) {
        check = true;
      }
    }
    return check;
  }
  getCSSDuAn(id) {
    let check = false;
    let obj = window.location.pathname.split("/");
    if (obj) {
      if (+obj[3] == 4 && obj[5] == id) {
        check = true;
      }
    }
    return check;
  }
  getCSSThe(id) {
    let check = false;
    let obj = window.location.pathname.split("/");
    if (obj) {
      if (+obj[3] == 7 && obj[6] == id) {
        check = true;
      }
    }
    return check;
  }

  //=================Bổ sung sủ dụng template===================
  listTemplate: any[] = [];
  getTemplate() {
    this.DanhMucChungService.ListTemplate().subscribe(res => {
      if (res && res.status == 1 && res.data.length > 0) {
        this.listTemplate = res.data;
      } else {
        this.listTemplate = [];
      }
      this.changeDetectorRefs.detectChanges();
    })
  }

  openTemplate() {
    const dialogRef = this.dialog.open(ThietLapTemplate, { data: { _listTemplate: this.listTemplate }, width: '30vw', height: '30vh', panelClass: ['pn-thietlap'] });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        window.location.reload();
      }
    });
  }

  //=================Bổ sung sủ dụng nhiệm vụ của đơn vị===================
  listProject: any[] = [];
  openNhiemVuCuaDonVi() {
    const dialogRef = this.dialog.open(ThietLapNhiemVuCuaDonVi, { data: {}, width: '30vw', height: '30vh', panelClass: ['pn-thietlap'] });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        this.DanhMucChungService.getMenuDSNV().subscribe((res) => {
          if (res && res.status == 1) {
            this.listMenu = res.data;
            if (this.idMenu == 1 || this.idMenu == 2 || this.idMenu == 3) {

              let item = this.listMenu[Number(this.idMenu) - 1].ListFillter.find(t => t.FilterID == this.filter);
              if (this.idClicked) {
                this.clickedItem = this.idClicked;
              } else {
                this.clickedItem = item.image;
              }
            }
          }
          this.count_new = +res.id;
          this.router.navigate(['/WorkV2']);
          this.changeDetectorRefs.detectChanges();
        });
      }
    });
  }

  //=================Bổ sung sủ dụng nhiệm vụ của đơn vị===================
  openNhiemVuPhoiHop() {
    const dialogRef = this.dialog.open(ThietLapNhiemVuPhoiHop, { data: {}, width: '30vw', height: '30vh', panelClass: ['pn-thietlap'] });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        this.DanhMucChungService.getMenuDSNV().subscribe((res) => {
          if (res && res.status == 1) {
            this.listMenu = res.data;
            if (this.idMenu == 1 || this.idMenu == 2 || this.idMenu == 3) {

              let item = this.listMenu[Number(this.idMenu) - 1].ListFillter.find(t => t.FilterID == this.filter);
              if (this.idClicked) {
                this.clickedItem = this.idClicked;
              } else {
                this.clickedItem = item.image;
              }
            }
          }
          this.count_new = +res.id;
          this.router.navigate(['/WorkV2']);
          this.changeDetectorRefs.detectChanges();
        });
      }
    });
  }
  AddProject(is_project: boolean){
		const _project = new ProjectTeamModel();
		_project.clear(); // Set all defaults fields
		_project.is_project = is_project;
		this.UpdateProject(_project);
	}
	UpdateProject(_item: ProjectTeamModel) {
		const dialogRef = this.dialog.open(ProjectTeamEditComponent, { data: { _item, _IsEdit: _item.IsEdit, is_project: _item.is_project },
    width:'700px',
    height:'auto',
    panelClass:['sky-padding-0'] });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			else {
				this.loadData();
			}
		});
	}
  wwRole:any=[];
  getRoleWW(){
    this.DanhMucChungService.WW_Roles().subscribe(res=>{
      if(res){
        this.wwRole=res;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  CheckwwRole(item){
    if(this.wwRole.indexOf(item)!== -1){
      return true;
    }
    return false;
  }
}
