import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit } from '@angular/core';
import { CongViecHoanThanhTrongNgayService } from '../../Services/cong-viec-hoan-thanh-trong-ngay.service';
import { QueryParamsModel, QueryParamsModelNew } from 'projects/jeework/src/app/page/models/query-models/query-params.model';
import { Subscription } from 'rxjs';
import { BaoCaoDoanhNghiepService } from '../../Services/bao-cao-doanh-nghiep.service';

@Component({
  selector: 'app-cong-viec-hoan-thanh-trong-ngay',
  templateUrl: './cong-viec-hoan-thanh-trong-ngay.component.html',
  styleUrls: ['./cong-viec-hoan-thanh-trong-ngay.component.scss']
})
export class CongViecHoanThanhTrongNgayComponent implements OnInit, OnDestroy {

  @Input()
  filterDSCVHoanThanhTrongNgay: EventEmitter<any> = new EventEmitter<any>();
  btnGroup: EventEmitter<any> = new EventEmitter<any>();
  btnFilterProject: EventEmitter<any> = new EventEmitter<any>();
  btnFilterSelectDate: EventEmitter<any> = new EventEmitter<any>();
  btnFilterType: EventEmitter<any> = new EventEmitter<any>();
  filterDanhSachVaiTro3: EventEmitter<any> = new EventEmitter<any>();
  filterType3: EventEmitter<any> = new EventEmitter<any>();
  filterDate3:EventEmitter<any> = new EventEmitter<any>();
  btnFilterSub: Subscription;
  id_project_team: number = 0;
  id_department: number;
  crr_page = 0;
  page_size = 20;
  total_page = 0;
  filter: any = {};
  listDepartment: any = [];
  id_role = 0;
  type_filter = 1;
  dataCongViecTrongNgay: any = [];
  selectedDate = {
    startDate: new Date('09/01/2020'),
    endDate: new Date('09/30/2020'),
  };
  private subscriptions: Subscription[] = [];
  constructor(
    public BaoCaoService: CongViecHoanThanhTrongNgayService,
    private changeDetectorRefs: ChangeDetectorRef,
    private _BaoCaoDoanhNghiepService: BaoCaoDoanhNghiepService,
  ) {
    const today = new Date();
    let set_thang = today.getMonth();
    this.selectedDate = {
      startDate: new Date(today.getFullYear(), set_thang, today.getDate()),
      endDate: new Date(today.getFullYear(), today.getMonth() + 1, 0),
    };
  }

  ngOnInit(): void {
    this.BaoCaoService.getthamso();
    var object2 = {
      list: this.filter_Group,
      name: this.NameofCV(),
      id_row: this.type_filter,
    };
    this.filterType3.emit(object2);
    var dateobj1={
      startDate:this.selectedDate.startDate,
      endDate:this.selectedDate.endDate,
    }
    this.filterDate3.emit(dateobj1);
    this.loadDanhSachVaiTro();
    this.BaoCaoService.list_project_by_me_rule().subscribe(res => {
      if (res && res.status == 1) {
        this.listProject = res.data;
        var object = {
          list: this.listProject,
          listFull: this.listProject,
          name: this.NameofTeam(),
        };
        this.filterDSCVHoanThanhTrongNgay.emit(object);
      }
    })
    this.btnFilterSub = this.btnFilterType.subscribe(res => {
      this.type_filter = +res;
      setTimeout(() => {
        this.LoadData();
        var object2 = {
          list: this.filter_Group,
          name: this.NameofCV(),
          id_row: this.type_filter,
        };
        this.filterType3.emit(object2);
      }, 1000);
    })
    this.btnFilterSub = this.btnGroup.subscribe(res => {
      this.idRole = +res;
      setTimeout(() => {
        this.LoadData();
        var object = {
          list: this.ListVaiTro,
          name: this.NameofRole(),
        };
        this.filterDanhSachVaiTro3.emit(object);
      }, 1000);
    })
    this.btnFilterSub = this.btnFilterProject.subscribe(res => {
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
        this.filterDSCVHoanThanhTrongNgay.emit(object);
      }
    })
    this.btnFilterSub = this.btnFilterSelectDate.subscribe(res => {
      if (res) {
        this.selectedDate.startDate = res.startDate;
        this.selectedDate.endDate = res.endDate;
        setTimeout(() => {
          this.LoadData();
          var dateobj={
            startDate:this.selectedDate.startDate,
            endDate:this.selectedDate.endDate,
          }
          this.filterDate3.emit(dateobj);
        }, 1000);
      }
    })
    this.LoadData();
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
  LoadData() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      'asc',
      '',
      this.crr_page,
      this.page_size,
    );
    this.BaoCaoService.loadCongViecTrongNgay(queryParams).subscribe(res => {
      if (res && res.status == 1) {
        this.dataCongViecTrongNgay = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  newdate: any;
  formatdate(date) {
    if (date == "") {
      return;
    }
    this.newdate = date.split(" ");
    return this.newdate[1];
  }
  ChangeResult(data: any) {
    if (data == 1) return "X";
    return "";
  }
  listProject: any = [];
  NameofTeam() {
    if (this.listProject) {
      var team = this.listProject.find(
        (element) => element.id_row == this.id_project_team
      );
      if (team) return team.title;
    }
    return "";
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
  // getWidth(): any {
  //   let tmp = 0;
  //   tmp = (window.innerWidth / 2) - 100;
  //   return tmp + 'px';
  // }
  getHeight(): any {
    let tmp_height = document.getElementById("gridster-height3").clientHeight;
    tmp_height = tmp_height - 120;
    return tmp_height + "px";
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
          this.filterDanhSachVaiTro3.emit(object);
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
