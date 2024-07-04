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
  selector: 'chart-theo-doi-nhiem-vu-widget',
  templateUrl: './chart-theo-doi-nhiem-vu-widget.component.html',
})
export class ChartTheoDoiNhiemVuWidgetComponent
  implements
  OnInit,
  OnDestroy {
  isLoading: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  public chartDataLoaded = new BehaviorSubject<boolean>(false);
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  colorCrossbar = ['#3699ff', '#EEB108', '#EC641B', '#FF0000', '#13C07C'];
  @Input() cssClass: '';
  list_widgets: any[] = [];
  selectedDate = {
    start: new Date(),
    end: new Date(),
  }
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
            xAxes: [{
                stacked: true,
            }],
            yAxes: [{
                stacked: true,
            }]
        }
  };


  public barChartLabels: any[];
  public temp: any[];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;
  

  public barChartData: any[] = [
    // { data: [], label: 'Hoàn thành đúng hạn' },
    // { data: [], label: 'Hoàn thành quá hạn' },
    { data: [], label: 'Còn hạn' },
    { data: [], label: 'Sắp tới hạn' },
    { data: [], label: 'Tới hạn' },
    { data: [], label: 'Quá hạn' },
  ];
  @Input()
  //================================================================
  btnFilterEventChartTheoDoiNhiemVu: EventEmitter<string> = new EventEmitter<string>();
  btnFilterSub: Subscription;
  idPb: number = 0;
  filterDanhSachPhongBan31: EventEmitter<any> = new EventEmitter<any>();
  ListPhongban: any[] = [];
  constructor(
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    public _WidgetTongHopDuAnService: WidgetTongHopDuAnService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private router: Router,
    public _WorkGeneralService: WorkGeneralService,
  ) { }
  ngOnInit() {
    this.btnFilterSub = this.btnFilterEventChartTheoDoiNhiemVu.subscribe((res) => {
      this.idPb = +res;
      this.loadList();
      var object = {
        list: this.ListPhongban,
        name: this.NameofTeam(),
      };
      this.filterDanhSachPhongBan31.emit(object);
    });
    this._WorkGeneralService.lite_department_by_manager().subscribe(
      (res) => {
        if (res && res.status == 1) {
          this.ListPhongban = res.data;
          var object = {
            list: this.ListPhongban,
            name: this.NameofTeam(),
          };
          
          this.filterDanhSachPhongBan31.emit(object);
        }
      }
    );
  }


  loadList() {
    const query = new QueryParamsModelNew(this.filterConfiguration());
    this._WidgetTongHopDuAnService.loadList(query).subscribe(res => {
      if (res && res.status == 1) {
        this.barChartLabels = [];
        this.barChartData = [
          { data: [], label: 'Còn hạn' },
          { data: [], label: 'Sắp tới hạn' },
          { data: [], label: 'Tới hạn' },
          { data: [], label: 'Quá hạn' },
        ];
        this.temp = Object.values(res.data);
        for (let index = 0; index < this.temp.length; index++) {
          let s=this.temp[index];
          if (s!=undefined&& s!='') {
            this.barChartLabels.push(s.title);
            this.barChartData[0].data.push(s.conhan);
            this.barChartData[1].data.push(s.saptoihan);
            this.barChartData[2].data.push(s.toihan);
            this.barChartData[3].data.push(s.quahan);
          }
        }
        this.changeDetectorRefs.detectChanges();
      }
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
  getWidth(): any {
    let tmp = 0;
    tmp = (window.innerWidth / 2) - 200;
    return tmp + 'px';
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
    this.router.navigateByUrl(`Work/CongViecTheoDuAn?IDDrop=4&&IDPr=${item.id_row}&&ID=${type}`);//
  }

}
export interface DialogData {
  start: string;
  end: string;
}