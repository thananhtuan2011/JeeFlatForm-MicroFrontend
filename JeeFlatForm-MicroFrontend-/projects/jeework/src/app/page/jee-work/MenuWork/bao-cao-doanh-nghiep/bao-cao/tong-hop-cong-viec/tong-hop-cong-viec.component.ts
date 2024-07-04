import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit } from '@angular/core';
import { TongHopCongViecService } from '../../Services/tong-hop-cong-viec.service';
import { Subscription } from 'rxjs';
import { QueryParamsModel } from '../../../../models/query-models/query-params.model';
import { CongViecHoanThanhTrongNgayService } from '../../Services/cong-viec-hoan-thanh-trong-ngay.service';
import { Router } from '@angular/router';
import { state } from '@angular/animations';

@Component({
  selector: 'app-tong-hop-cong-viec',
  templateUrl: './tong-hop-cong-viec.component.html',
  styleUrls: ['./tong-hop-cong-viec.component.scss']
})
export class TongHopCongViecComponent implements OnInit {

  constructor(
    public _TongHopCongViecService: TongHopCongViecService,
    private changeDetectorRefs: ChangeDetectorRef,
    public _CongViecHoanThanhTrongNgayService: CongViecHoanThanhTrongNgayService,
    private router: Router,
  ) {
    const today = new Date();
    this.selectedDate = {
      startDate: new Date(today.getFullYear(), today.getMonth(), 1),
      endDate: new Date(today.getFullYear(), today.getMonth(), 30),
    };
  }
  @Input()
  btnFilterSub: Subscription;
  btnFilterTypeTongHop: EventEmitter<any> = new EventEmitter<any>();
  btnFiltertDateTongHop: EventEmitter<any> = new EventEmitter<any>();
  filterDSTongHop: EventEmitter<any> = new EventEmitter<any>();
  btnFilterProjectTongHop: EventEmitter<any> = new EventEmitter<any>();
  btnVaiTroTongHop: EventEmitter<any> = new EventEmitter<any>();
  filterDanhSachVaiTro1: EventEmitter<any> = new EventEmitter<any>();
  filterType1: EventEmitter<any> = new EventEmitter<any>();
  filterDate1:EventEmitter<any> = new EventEmitter<any>();
  private subscriptions: Subscription[] = [];
  crr_page = 0;
  page_size = 20;
  total_page = 0;
  filter: any = {};
  Staff: any[] = [];
  selectedDate = {
    startDate: new Date('09/01/2020'),
    endDate: new Date('09/30/2020'),
  };
  type_staff = 1;
  type_filter = 1;
  id_project_team: number = 0;
  listProject: any[] = [];
  colorCrossbar = ['red', 'blue', '#ff9900', 'green', 'violet'];

  ngOnInit(): void {
    var object1 = {
      list: this.filtertype_staff,
      name: this.NameofRole(),
    };
    var object2 = {
      list: this.filter_CapDuoi,
      name: this.NameofNhanVien(),
      id_row:this.type_filter,
    };
    this.filterDanhSachVaiTro1.emit(object1);
    this.filterType1.emit(object2);
    var dateobj1={
      startDate:this.selectedDate.startDate,
      endDate:this.selectedDate.endDate,
    }
    this.filterDate1.emit(dateobj1);
    this._TongHopCongViecService.list_project_by_me_rule43().subscribe(res => {
      if (res && res.status == 1) {
        this.listProject = res.data;
        var object = {
          list: this.listProject,
          listFull:this.listProject,
          name: this.NameofTeam(),
        };
        this.filterDSTongHop.emit(object);
      }
    })
    this.btnFilterSub = this.btnVaiTroTongHop.subscribe(res => {
      this.type_staff = +res;
      setTimeout(() => {
        this.LoadData();
        var object1 = {
          list: this.filtertype_staff,
          name: this.NameofRole(),
        };
        this.filterDanhSachVaiTro1.emit(object1)
      }, 1000);
    })
    this.btnFilterSub = this.btnFilterTypeTongHop.subscribe(res => {
      this.type_filter = +res;
      setTimeout(() => {
        this.LoadData();
        var object2 = {
          list: this.filter_CapDuoi,
          name: this.NameofNhanVien(),
          id_row:this.type_filter,
        };
        this.filterType1.emit(object2);
      }, 1000);
    })
    this.btnFilterSub = this.btnFiltertDateTongHop.subscribe(res => {
      if (res) {
        this.selectedDate.startDate = res.startDate;
        this.selectedDate.endDate = res.endDate;
        setTimeout(() => {
          this.LoadData();
          var dateobj={
            startDate:this.selectedDate.startDate,
            endDate:this.selectedDate.endDate,
          }
          this.filterDate1.emit(dateobj);
        }, 1000);
      }
    })
    this.btnFilterSub = this.btnFilterProjectTongHop.subscribe(res => {
      if (res != this.id_project_team) {
        this.id_project_team = res;
        setTimeout(() => {
          this.LoadData();
        }, 1000);
        var object = {
          list: this.listProject,
          listFull:this.listProject,
          name: this.NameofTeam(),
        };
        this.filterDSTongHop.emit(object);
      }
    })
  }
  LoadData() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      'asc',
      '',
      this.crr_page,
      this.page_size,
    );
    this._TongHopCongViecService.loadTongHopCongViec(queryParams).subscribe(res => {
      if (res && res.status == 1) {
        this.Staff = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  filterConfiguration() {
    this.filter.type_filter = this.type_filter;
    this.filter.type_staff = this.type_staff;
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
  getHeight(): any {
    let tmp_height = document.getElementById("gridster-height1").clientHeight;
    tmp_height = tmp_height - 120;
    return tmp_height + "px";
  }
  filtertype_staff: any[] = [
    {
      id_row: 2,
      title: 'Tất cả cấp dưới',
    },
    {
      id_row: 1,
      title: 'Cấp dưới trực tiếp',
    },

  ]
  NameofRole() {
    var team = this.filtertype_staff.find(
      (element) => +element.id_row == +this.type_staff
    );
    if (team) return team.title;
    return "";
  }
  filter_CapDuoi: any[] = [
    {
      id_row: 1,
      title: 'Nhân viên cấp dưới',
    },
    {
      id_row: 2,
      title: 'Theo dự án',
    }
  ];
  NameofNhanVien() {
    var team = this.filter_CapDuoi.find(
      (element) => +element.id_row == +this.type_filter
    );
    if (team) return team.title;
    return "";
  }
  view(type,item){
    let tungay =this.filter.TuNgay;
    let denngay =this.filter.DenNgay;
    this.router.navigate(['', { outlets: { auxName: 'auxWork/List/25/'+this.id_project_team +'/' + type +'/'+item.id_nv+'/'+this.type_filter+'/'+this.type_staff }, }],{state:{TuNgay:tungay,DenNgay:denngay }});
  }

}
