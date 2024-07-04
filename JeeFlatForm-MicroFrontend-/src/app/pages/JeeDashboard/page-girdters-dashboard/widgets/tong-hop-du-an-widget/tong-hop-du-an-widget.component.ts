import { ChangeDetectorRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { WidgetTongHopDuAnService } from '../../Services/tong-hop-du-an-widget.service';
import { WorkGeneralService } from '../../Services/work-general.services';
import { QueryParamsModelNew } from 'src/app/_metronic/core/models/pagram';

@Component({
  selector: 'tong-hop-du-an-widget',
  templateUrl: './tong-hop-du-an-widget.component.html',
})
export class TongHopDuAnWidgetComponent
  implements
  OnInit,
  OnDestroy {
  isLoading: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  // colorCrossbar = ['#3699ff', '#EEB108', '#EC641B', '#FF0000', '#13C07C'];
  colorCrossbar = ['#50CD89', '#A0522D', '#3E97FF', '#8A50FC', '#FFA800', '#F64D60'];
  @Input() cssClass: '';
  list_widgets: any[] = [];
  @Input()
  //================================================================
  btnFilterEventTongHopDuAn: EventEmitter<string> = new EventEmitter<string>();
  btnFilterSub: Subscription;
  idPb: number = 0;
  filterDanhSachPhongBan: EventEmitter<any> = new EventEmitter<any>();
  ListPhongban: any[] = [];

  btnFilterEventVaiTro: EventEmitter<string> = new EventEmitter<string>();
  btnFilterSubVaiTro: Subscription;
  filterDanhSachVaiTro: EventEmitter<any> = new EventEmitter<any>();
  ListVaiTro: any[] = [];
  idRole: number = -1;

  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    public _WidgetTongHopDuAnService: WidgetTongHopDuAnService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    public _WorkGeneralService: WorkGeneralService,
  ) { }
  ngOnInit() {
    this._WorkGeneralService.getthamso();
    this.btnFilterSub = this.btnFilterEventTongHopDuAn.subscribe((res) => {
      this.idPb = +res;
      var object = {
        list: this.ListPhongban,
        name: this.NameofTeam(),
      };
      this.filterDanhSachPhongBan.emit(object);
      this.loadDanhSachVaiTro();
    });
    this.changeDetectorRefs.detectChanges();

    this._WorkGeneralService.lite_department_by_manager().subscribe(
      (res) => {
        if (res && res.status == 1) {
          this.ListPhongban = res.data;
          var object = {
            list: this.ListPhongban,
            name: this.NameofTeam(),
          };
          this.filterDanhSachPhongBan.emit(object);
          this.loadDanhSachVaiTro();
        }
      }
    );

    this.btnFilterSubVaiTro = this.btnFilterEventVaiTro.subscribe((res) => {
      this.idRole = +res;
      this.loadList();
      var object = {
        list: this.ListVaiTro,
        name: this.NameofRole(),
      };
      this.filterDanhSachVaiTro.emit(object);
    });
  }
  reset() {

  }


  public _itemsTheoDoi$ = new BehaviorSubject<[]>([]);
  public _s_itemsTheoDoi$ = new BehaviorSubject<[]>([]);
  loadList() {
    var resItems: any = [];
    var s_resItems: any = [];
    var resTotalRow: number = 0;
    const query = new QueryParamsModelNew(this.filterConfiguration());
    this._WidgetTongHopDuAnService.loadList(query).subscribe(res => {
      if (res && res.status == 1) {
        resItems = res.data;
        resTotalRow = res.page?.TotalCount;
        let sum = {
          s_num_work: res.isgov ? res.isgov[0].s_num_work : 0,
          s_hoanthanh_dunghan: res.isgov ? res.isgov[0].s_hoanthanh_dunghan : 0,
          s_hoanthanh_quahan: res.isgov ? res.isgov[0].s_hoanthanh_quahan : 0,
          s_conhan: res.isgov ? res.isgov[0].s_conhan : 0,
          s_saptoihan: res.isgov ? res.isgov[0].s_saptoihan : 0,
          s_toihan: res.isgov ? res.isgov[0].s_toihan : 0,
          s_quahan: res.isgov ? res.isgov[0].s_quahan : 0,
        }
        s_resItems.push(sum);
      }
      this._itemsTheoDoi$.next(resItems);
      this._s_itemsTheoDoi$.next(s_resItems);
    });
  }
  f_convertDate(p_Val: any) {
    let a = p_Val === "" ? new Date() : new Date(p_Val);
    return ("0" + (a.getDate())).slice(-2) + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + a.getFullYear();
  }

  f_convertDate_S(v: any) {
    if (v != "" && v != undefined) {
      const a = new Date(v);
      return (
        "01/01/" + a.getFullYear()
      );
    }
  }

  f_convertDate_E(v: any) {
    if (v != "" && v != undefined) {
      const a = new Date(v);
      return (
        "31/12/" + a.getFullYear()
      );
    }
  }

  filterConfiguration(): any {
    const filter: any = {};
    filter.collect_by = "CreatedDate";
    filter.displayChild = "0";
    filter.id_department = this.idPb;
    filter.id_role = this.idRole;
    return filter;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  getClasses(val) {
    if (val == 2)
      return 'label label-lg label-light-warning label-inline';
    else {
      if (val == 3)
        return 'label label-lg label-light-danger label-inline';
      return 'label label-lg label-light-success label-inline';
    }
  }
  GetStringByStatus(status) {
    let result = "";
    if (status == 2)
      return result = this.translate.instant('projects.chamtiendo');
    else {
      if (status == 3)
        result = this.translate.instant('projects.ruirocao');
      else
        result = this.translate.instant('projects.dungtiendo');
    }
    return result;
  }
  GetColorProgress(status) {
    if (status > 75)
      return 'progress-bar bg-success';
    else {
      if (status < 25)
        return 'progress-bar bg-danger';
      else {
        if (status < 50)
          return 'progress-bar bg-primary';
        return 'progress-bar bg-info';
      }
    }
  }

  getHeight(): any {
    let tmp_height = document.getElementById("gridster-height16").clientHeight;
    tmp_height = tmp_height - 120;
    return tmp_height + 'px';
  }
  getWidth(): any {
    let tmp_width = document.getElementById("gridster-height16").clientWidth;
    return tmp_width > 500;
  }
  //========================================================================
  NameofTeam() {
    if (this.ListPhongban) {
      var team = this.ListPhongban.find(
        (element) => element.id_row == this.idPb
      );
      if (team) return team.title;
    }
    return "";
  }

  view(type, item) {
    switch (Number(this.idRole)) {
      case 1: {//Tôi tạo
        this.router.navigate(['', { outlets: { auxName: 'auxWork/List/2/' + item.id_row + '/' + type }, }]);
        break;
      }
      case 2: {//Tôi giao
        this.router.navigate(['', { outlets: { auxName: 'auxWork/List/3/' + item.id_row + '/' + type }, }]);
        break;
      }
      case 3: {//Tôi theo dõi
        this.router.navigate(['', { outlets: { auxName: 'auxWork/List/7/' + item.id_row + '/' + type }, }]);
        break;
      }
      default: {
        this.router.navigate(['', { outlets: { auxName: 'auxWork/List/10/' + item.id_row + '/' + type }, }]);
        break;
      }
    }
  }

  //=========================================================================
  loadDanhSachVaiTro() {
    const queryParams = new QueryParamsModelNew(
      this.filterConfigurationVaiTro(),
      'asc',
      '',
      0,
      100,
      true,
    );
    this._WorkGeneralService.listrole_filterbyreport(queryParams).subscribe(
      (res) => {
        if (res && res.status == 1) {
          this.ListVaiTro = res.data;
          if (+this.idRole == -1) {
            this.idRole = res.data[0].id;
          }
          var object = {
            list: this.ListVaiTro,
            name: this.NameofRole(),
          };
          this.filterDanhSachVaiTro.emit(object);
        }
        this.loadList();
      }
    );
  }

  filterConfigurationVaiTro(): any {
    let filter: any = {};
    filter.id_department = this.idPb;
    return filter;
  }

  NameofRole() {
    if (this.ListVaiTro) {
      var team = this.ListVaiTro.find(
        (element) => +element.id == +this.idRole
      );
      if (team) return team.title;
    }
    return "Chọn phạm vi";
  }

  getValue(val) {
    if (+val > 0) {
      return val;
    } else {
      return '-';
    }
  }
}
export interface DialogData {
  start: string;
  end: string;
}