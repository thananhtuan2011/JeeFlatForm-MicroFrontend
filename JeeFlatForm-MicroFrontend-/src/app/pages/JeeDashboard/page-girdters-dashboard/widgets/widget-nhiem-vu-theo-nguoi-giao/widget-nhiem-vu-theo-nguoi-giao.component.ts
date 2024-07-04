import { ChangeDetectorRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { WidgetNhiemVuTheoNguoiGiaoService } from '../../Services/widget-nhiem-vu-theo-nguoi-giao.service';
import { WorkGeneralService } from '../../Services/work-general.services';
import { QueryParamsModelNew } from 'src/app/_metronic/core/models/pagram';

@Component({
  selector: 'widget-nhiem-vu-theo-nguoi-giao',
  templateUrl: './widget-nhiem-vu-theo-nguoi-giao.component.html',
})
export class WidgetNhiemVuTheoNguoiGiaoComponent
  implements
  OnInit,
  OnDestroy {
  isLoading: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  colorCrossbar = ['#3699ff', '#EEB108', '#EC641B', '#FF0000', '#13C07C'];
  @Input() cssClass: '';
  list_widgets: any[] = [];
  selectedDate = {
    start: new Date(),
    end: new Date(),
  }
  @Input()
  //================================================================
  btnFilterEventDepartment28: EventEmitter<string> = new EventEmitter<string>();
  btnFilterSub: Subscription;
  btnFilterEventDanhSachNhanVien: EventEmitter<string> = new EventEmitter<string>();
  btnFilterNhanVien: Subscription;
  idPb: number = 0;
  idUser: number = 0;
  filterDanhSachPhongBan28: EventEmitter<any> = new EventEmitter<any>();
  filterDanhSachNhanVien: EventEmitter<any> = new EventEmitter<any>();
  ListPhongban: any[] = [];
  ListUser: any[] = [];
  constructor(
    private changeDetectorRefs: ChangeDetectorRef,
    public _WidgetNhiemVuTheoNguoiGiaoService: WidgetNhiemVuTheoNguoiGiaoService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    public _WorkGeneralService: WorkGeneralService,
  ) { }
  ngOnInit() {
    this._WorkGeneralService.getthamso();
    this.btnFilterSub = this.btnFilterEventDepartment28.subscribe((res) => {
      this.idPb = +res;
      var object = {
        list: this.ListPhongban,
        name: this.NameofTeam(),
      };
      this.filterDanhSachPhongBan28.emit(object);
      this.LoadListUser();
    });

    this.btnFilterNhanVien = this.btnFilterEventDanhSachNhanVien.subscribe((res) => {
      this.idUser = +res;
      this.loadList();
      var object = {
        list: this.ListUser,
        name: this.NameOfUser(),
      };
      this.filterDanhSachNhanVien.emit(object);
    })

    this._WorkGeneralService.lite_department_by_manager().subscribe(
      (res) => {
        if (res && res.status == 1) {
          this.ListPhongban = res.data;
          var object = {
            list: this.ListPhongban,
            name: this.NameofTeam(),
          };
          this.filterDanhSachPhongBan28.emit(object);

          var object = {
            list: this.ListUser,
            name: this.NameOfUser(),
          };
          this.filterDanhSachNhanVien.emit(object);
        }
      }
    );
  }

  LoadListUser() {
    const filter: any = {};
    filter.id_department = this.idPb;
    this._WorkGeneralService.list_account(filter).subscribe(res => {
      if (res && res.status === 1) {

        this.ListUser = res.data;
        var object = {
          list: this.ListUser,
          name: this.NameOfUser(),
        };
        this.filterDanhSachNhanVien.emit(object);
        this.changeDetectorRefs.detectChanges();
      };

    });
  }

  public _itemsTheoDoi$ = new BehaviorSubject<[]>([]);
  public _s_itemsTheoDoi$ = new BehaviorSubject<[]>([]);
  loadList() {
    var resItems: any = [];
    var s_resItems: any = [];
    const query = new QueryParamsModelNew(this.filterConfiguration());
    this._WidgetNhiemVuTheoNguoiGiaoService.loadList(query).subscribe(res => {
      if (res && res.status == 1) {
        resItems = res.data;
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
    // filter.TuNgay = (this.f_convertDate_S(this.selectedDate.start)).toString();
    // filter.DenNgay = (this.f_convertDate_E(this.selectedDate.end)).toString();
    filter.collect_by = "CreatedDate";
    filter.displayChild = "0";
    filter.id_department = this.idPb;
    filter.loaicongviec = 3;
    filter.id_user = this.idUser;
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
    let tmp_height = document.getElementById("gridster-height28").clientHeight;
    tmp_height = tmp_height - 120;
    return tmp_height + 'px';
  }
  getWidth(): any {
    let tmp_width = document.getElementById("gridster-height28").clientWidth;
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
  NameOfUser() {
    if (this.ListUser) {
      var nhanvien = this.ListUser.find(
        (element) => element.id_nv == this.idUser
      );
      if (nhanvien) return nhanvien.hoten;
    }
    return "Chọn nhân viên";
  }

  open(type, item) {
    this.router.navigate(['', { outlets: { auxName: 'auxWork/List/10/' + item.id_row + '/' + type + '/' + this.idUser }, }]);
  }
}
export interface DialogData {
  start: string;
  end: string;
}