import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { QueryParamsModel, QueryParamsModelNew } from '../../../../models/query-models/query-params.model';
import { CongViecMoiTrongNgayService } from '../../Services/cong-viec-moi-trong-ngay.service';
import { CongViecHoanThanhTrongNgayService } from '../../Services/cong-viec-hoan-thanh-trong-ngay.service';
import { UpdateWorkModel } from '../../Model/jee-work.model';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { Router } from '@angular/router';
import { BaoCaoDoanhNghiepService } from '../../Services/bao-cao-doanh-nghiep.service';

@Component({
  selector: 'app-cong-viec-moi-trong-ngay',
  templateUrl: './cong-viec-moi-trong-ngay.component.html',
  styleUrls: ['./cong-viec-moi-trong-ngay.component.scss']
})
export class CongViecMoiTrongNgayComponent implements OnInit, OnDestroy {

  constructor(
    public _CongViecHoanThanhTrongNgayService: CongViecHoanThanhTrongNgayService,
    public _CongViecMoiTrongNgayService: CongViecMoiTrongNgayService,
    private _BaoCaoDoanhNghiepService: BaoCaoDoanhNghiepService,
    private changeDetectorRefs: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
  ) {
    const today = new Date();
    let set_thang = today.getMonth();
    this.selectedDate = {
      startDate: new Date(today.getFullYear(), set_thang, today.getDate()),
      endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    };
  }
  @Input()
  btnFilterSub: Subscription;
  btnFilterTypeNew: EventEmitter<any> = new EventEmitter<any>();
  btnFilterSelectDate2: EventEmitter<any> = new EventEmitter<any>();
  filterDSCVNew: EventEmitter<any> = new EventEmitter<any>();
  btnFilterProjectNew: EventEmitter<any> = new EventEmitter<any>();
  btnVaiTro2: EventEmitter<any> = new EventEmitter<any>();
  filterDanhSachVaiTro2: EventEmitter<any> = new EventEmitter<any>();
  filterType2:EventEmitter<any> = new EventEmitter<any>();
  filterDate2:EventEmitter<any> = new EventEmitter<any>();

  private subscriptions: Subscription[] = [];
  crr_page = 0;
  page_size = 20;
  total_page = 0;
  filter: any = {};
  dataLoadCVNew: any[] = [];
  selectedDate = {
    startDate: new Date('09/01/2020'),
    endDate: new Date('09/30/2020'),
  };
  id_role = 0;
  type_filter = 1;
  id_project_team: number = 0;
  listProject: any[] = [];

  ngOnInit(): void {
    var object2 = {
      list: this.filter_Group,
      name: this.NameofCV(),
      id_row:this.type_filter,
    };
    this.filterType2.emit(object2);
    var dateobj1={
      startDate:this.selectedDate.startDate,
      endDate:this.selectedDate.endDate,
    }
    this.filterDate2.emit(dateobj1);
    this.loadDanhSachVaiTro();
    this._CongViecHoanThanhTrongNgayService.list_project_by_me_rule().subscribe(res => {
      if (res && res.status == 1) {
        this.listProject = res.data;
        var object = {
          list: this.listProject,
          listFull: this.listProject,
          name: this.NameofTeam(),
        };
        this.filterDSCVNew.emit(object);
      }
    })
    this.btnFilterSub = this.btnVaiTro2.subscribe(res => {
      this.idRole = +res;
      setTimeout(() => {
        this.LoadData();
        var object = {
          list: this.ListVaiTro,
          name: this.NameofRole(),
        };
        this.filterDanhSachVaiTro2.emit(object);
      }, 1000);
    })
    this.btnFilterSub = this.btnFilterTypeNew.subscribe(res => {
      this.type_filter = +res;
      setTimeout(() => {
        this.LoadData();
        var object2 = {
          list: this.filter_Group,
          name: this.NameofCV(),
          id_row:this.type_filter,
        };
        this.filterType2.emit(object2);
      }, 1000);
    })
    this.btnFilterSub = this.btnFilterSelectDate2.subscribe(res => {
      if (res) {
        this.selectedDate.startDate = res.startDate;
        this.selectedDate.endDate = res.endDate;
        setTimeout(() => {
          this.LoadData();
          var dateobj={
            startDate:this.selectedDate.startDate,
            endDate:this.selectedDate.endDate,
          }
          this.filterDate2.emit(dateobj);
        }, 1000);
      }
    })
    this.btnFilterSub = this.btnFilterProjectNew.subscribe(res => {
      if (res != this.id_project_team) {
        this.id_project_team = res;
        setTimeout(() => {
          this.LoadData();
        }, 1000);
        var object = {
          list: this.listProject,
          listFull: this.listProject,
          name: this.NameofTeam(),
        };
        this.filterDSCVNew.emit(object);
      }
    })
    this.LoadData();
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  LoadData() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      'asc',
      '',
      this.crr_page,
      this.page_size,
    );
    this._CongViecMoiTrongNgayService.loadCongViecMoiTrongNgay(queryParams).subscribe(res => {
      if (res && res.status == 1) {
        this.dataLoadCVNew = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  filterConfiguration() {
    this.filter.type_filter = this.type_filter;
    this.filter.id_role = this.idRole;
    this.filter.id_project_team = this.id_project_team;
    this.filter.TuNgay = (this.f_convertDate(this.selectedDate.startDate)).toString();
    this.filter.DenNgay = (this.f_convertDate(this.selectedDate.endDate)).toString();
    return this.filter;
  }
  f_convertDate(p_Val: any) {
    let a = p_Val === '' ? new Date() : new Date(p_Val);
    return ('0' + (a.getDate())).slice(-2) + '/' + ('0' + (a.getMonth() + 1)).slice(-2) + '/' + a.getFullYear();
  }
  NameofTeam() {
    if (this.listProject) {
      var team = this.listProject.find(
        (element) => element.id_row == this.id_project_team
      );
      if (team) return team.title;
    }
    return "";
  }
  getColorStatus(item) {
    return item.StatusInfo.color;
  }
  UpdateByKey(node, key, value) {
    // if (!this.KiemTraThayDoiCongViec(+, key)) `{
    //   return;
    // }
    const item = new UpdateWorkModel();
    item.id_row = node.id_row;
    item.key = key;
    item.value = value;
    if (node.userId > 0) {
      item.IsStaff = true;
    }
    this._CongViecMoiTrongNgayService._UpdateByKey(item).subscribe((res) => {
      if (res && res.status == 1) {
        this.LoadData();
        this.changeDetectorRefs.detectChanges();
      } else {

        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
      }
    });
  }
  UpdateStatus(node, status) {
    if (+node.status == +status.id_row) {
      return;
    }
    this.UpdateByKey(node, "status", status.id_row);
  }
  public listDataStatus: any[] = [];
  CheckClosedTask(item) {
    // if (this.IsAdminGroup) {
    //     return true;
    // }
    if (item.closed) {
      return false;
    } else {
      return true;
    }
  }
  getHeight(): any {
    let tmp_height = document.getElementById("gridster-height2").clientHeight;
    tmp_height = tmp_height - 120;
    return tmp_height + "px";
  }
  OpenDetail(val) {
    this.router.navigate([
      '',
      { outlets: { auxName: 'auxWork/DetailsGOV/' + val.id_row } },
    ]);
  }
  filterConfigurationVaiTro(): any {
    let filter: any = {};
    filter.id_project = 0;
    return filter;
  }
  ListVaiTro: any[] = [];
  idRole: number = -1;
  loadDanhSachVaiTro() {
    const queryParams = new QueryParamsModelNew(
      this.filterConfigurationVaiTro(),
      'asc',
      '',
      0,
      100,
      true,
    );
    this._BaoCaoDoanhNghiepService.listrole_filterbyreport(queryParams).subscribe(
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
          this.LoadData();
          this.filterDanhSachVaiTro2.emit(object);
        }
      }
    );
  }
  NameofRole() {
    var team = this.ListVaiTro.find(
      (element) => +element.id == +this.idRole
    );
    if (team) return team.title;
    return "Tất cả";
  }
  filter_Group: any[] = [
    {
      id_row: 1,
      title: 'Theo công việc của tôi',
    },
    {
      id_row: 2,
      title: 'Theo dự án',
    }
  ];
  NameofCV() {
    var team = this.filter_Group.find(
      (element) => +element.id_row == +this.type_filter
    );
    if (team) return team.title;
    return "";
  }
}
