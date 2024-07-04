import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CongViecHoanThanhTrongNgayService } from '../../Services/cong-viec-hoan-thanh-trong-ngay.service';
import { QueryParamsModelNew } from '../../../../models/query-models/query-params.model';
import { QuaTrinhHoanThanhTheoNgayService } from '../../Services/qua-trinh-hoan-thanh-theo-ngay.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cong-viec-hoan-thanh-theo-ngay',
  templateUrl: './cong-viec-hoan-thanh-theo-ngay.component.html',
  styleUrls: ['./cong-viec-hoan-thanh-theo-ngay.component.scss']
})
export class CongViecHoanThanhTheoNgayComponent implements OnInit {

  constructor(
    private translate: TranslateService,
    public _CVHTTrongNgayService: CongViecHoanThanhTrongNgayService,
    private _QuaTrinhHoanThanhTheoNgayService: QuaTrinhHoanThanhTheoNgayService,
    private changeDetectorRefs: ChangeDetectorRef,
  ) {
    const today = new Date();
    let set_thang = today.getMonth();
    this.selectedDate = {
      startDate: new Date(today.getFullYear(), set_thang, today.getDate()),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate()+7),
    };
  }

  filter: any = {};
  selectedDate = {
    startDate: new Date('09/01/2020'),
    endDate: new Date('09/30/2020'),
  };
  id_project_team: number = 0;
  public chart2Ready = false;
  public chartData2 = [];
  public chartLabel2: string[] = [''];
  public chartOptions2 = {
    responsive: true,
    scales: {
      yAxes: [{
        ticks: {
            beginAtZero: true,
            min:0,
        }
    }]
    }
  };
  public chartLegend2 = false;
  DataChart2 = [];
  listColor2 = ['rgb(72, 133, 108)', 'rgb(245, 78, 59)', 'rgb(20, 204, 63)'];
  public chartType2 = 'bar';
  ListLabel = [this.translate.instant('filter.tatca'), this.translate.instant('filter.quahan'), this.translate.instant('filter.hoanthanh')];
  @Input()
  btnFilterSub: Subscription;
  btnFiltertProject5: EventEmitter<any> = new EventEmitter<any>();
  filterProject5: EventEmitter<any> = new EventEmitter<any>();
  btnFiltertDate5:EventEmitter<any> = new EventEmitter<any>();
  filterDate5:EventEmitter<any> = new EventEmitter<any>();
  listProject:any[]=[];
  ngOnInit(): void {
    this._CVHTTrongNgayService.getthamso();
    this._CVHTTrongNgayService.list_project_by_me_rule().subscribe(res => {
      if (res && res.status == 1) {
        this.listProject = res.data;
        var object = {
          list: this.listProject,
          listFull: this.listProject,
          name: this.NameofTeam(),
        };
        this.filterProject5.emit(object);
      }
    })
    var dateobj1={
      startDate:this.selectedDate.startDate,
      endDate:this.selectedDate.endDate,
    }
    this.filterDate5.emit(dateobj1);
    this.btnFilterSub = this.btnFiltertProject5.subscribe(res => {
      if (res != this.id_project_team) {
        this.id_project_team = res;
        setTimeout(() => {
          this.getChart2();
        }, 1000);
        var object = {
          list: this.listProject,
          listFull: this.listProject,
          name: this.NameofTeam(),
        };
        this.filterProject5.emit(object);
      }
    });
    this.btnFilterSub=this.btnFiltertDate5.subscribe(res=>{
      if (res) {
        this.selectedDate.startDate = res.startDate;
        this.selectedDate.endDate = res.endDate;
        setTimeout(() => {
          this.getChart2();
          var dateobj={
            startDate:this.selectedDate.startDate,
            endDate:this.selectedDate.endDate,
          }
          this.filterDate5.emit(dateobj);
        }, 1000);
      }
    })
    this.getChart2();
  }
  getChart2() {
    const queryParams = new QueryParamsModelNew(
      this.filterConfiguration(),
    );
    //queryParams.sortField = this.column_sort.value;
    this._QuaTrinhHoanThanhTheoNgayService.loadQuatrinhhoanthanh(queryParams).subscribe(data => {
      if (data && data.status == 1) {
        this.chartData2 = [];
        this.chartLabel2 = [];
        this.DataChart2=[];
        this.DataChart2 = data.data;
        this.chartLabel2 = this.ElementObjectToArr(this.DataChart2, 'tencot');
        this.chartData2.push(
          {
            'data': this.ElementObjectToArr(this.DataChart2, 'tatca'),
            'label': this.translate.instant('filter.congviecdatao'),
            'type': 'line',
            backgroundColor: this.listColor2[0],
            fill: false,
            borderColor: this.listColor2[0],
          },
          {
            'data': this.ElementObjectToArr(this.DataChart2, 'quahan'),
            'label': this.translate.instant('filter.quahan'),
            'stack': 'a',
            backgroundColor: this.listColor2[1]
          },
          {
            'data': this.ElementObjectToArr(this.DataChart2, 'hoanthanh'),
            'label': this.translate.instant('filter.hoanthanh'),
            'stack': 'a',
            backgroundColor: this.listColor2[2]
          }
        );
        this.chart2Ready = true;
      }
      this.changeDetectorRefs.detectChanges();
    });
  }
  filterConfiguration() {
    this.filter.id_project_team = this.id_project_team;
    this.filter.TuNgay = (this.f_convertDate(this.selectedDate.startDate)).toString();
    this.filter.DenNgay = (this.f_convertDate(this.selectedDate.endDate)).toString();
    return this.filter;
  }
  f_convertDate(p_Val: any) {
    let a = p_Val === '' ? new Date() : new Date(p_Val);
    return ('0' + (a.getDate())).slice(-2) + '/' + ('0' + (a.getMonth() + 1)).slice(-2) + '/' + a.getFullYear();
  }
  ElementObjectToArr(arr, eml) {
    var newArr = [];
    for (let item of arr) {
      newArr.push(item[eml]);
    }
    return newArr;
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
    let tmp_height = document.getElementById("gridster-height5").clientHeight;
    tmp_height = tmp_height - 120;
    return tmp_height + "px";
  }
}
