import {
  ChangeDetectorRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import Chart from "chart.js";
import moment from "moment";
import { BehaviorSubject, Subscription } from "rxjs";
import { TrangThaiCongViecService } from "src/app/pages/JeeDashboard/page-girdters-dashboard/Services/trang-thai-cong-viec-widget.service";
import { BaoCaoService } from "../services/bao-cao.services";
import { QueryParamsModelNew } from "../../../models/query-models/query-params.model";

@Component({
  selector: "bao-cao-thoi-han-nhiem-vu",
  templateUrl: "./bao-cao-thoi-han-nhiem-vu.component.html",
})
export class BaoCaoThoiHanNhiemVuComponent implements OnInit {
  selectedDate = {
    start: new Date(null),
    end: new Date(null),
  };
  ListProject: any = [];
  @Input()
  btnFilterEventTrangThaiCV: EventEmitter<any> = new EventEmitter<any>();
  filterDSTrangThaiduan: EventEmitter<any> = new EventEmitter<any>();
  btnLoaiBieuDo: EventEmitter<any> = new EventEmitter<any>();
  btnFilterSub: Subscription;
  public chartDataLoaded = new BehaviorSubject<boolean>(false);
  public pieChartData = [0, 0, 0, 0];
  public pieChartLabel: string[] = [];

  @Input() cssClass: "";
  @Input() startDate: "";
  @Input() endDate: "";
  @Input() typeChart = 0;
  @Input() id_project_team = 0;
  @Input() collect_by = "";
  @Input() id_department = 0;

  public pieChartOptions = {
    cutoutPercentage: 80,
    responsive: true,
    plugins: {
      labels: {
        render: "value",
        fontSize: 14,
        fontStyle: "bold",
        fontColor: "#000",
        fontFamily: '"Lucida Console", Monaco, monospace',
      },
    },
  }; //{ cutoutPercentage: 80 };
  public pieChartLegend = false;
  public pieChartColor = [];
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
      yAxes: [{
        display: true,
        scaleLabel: {
          show: true,
          labelString: 'Value'
        },
        ticks: {
          beginAtZero: true,
          // max: 100,
          min: 0,
        }
      }],
      xAxes: [{
        categoryPercentage: 1,
        // barPercentage: 1,
        ticks: {
          display: false,
          beginAtZero: 0
        }
      }]
    },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (_value, ctx) => {
          return "";
        }
      }
    },
    labels: {
      display: true
    },
    legend: {
      position: 'top',
      fontSize: 100,
      display: true,
    },
    animation: {
      duration: 500,
      easing: "easeOutQuart",
      onComplete: function () {
        var ctx = this.chart.ctx;
        ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';

        this.data.datasets.forEach(function (dataset) {
          for (var i = 0; i < dataset.data.length; i++) {
            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
              scale_max = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._yScale.maxHeight;
            ctx.fillStyle = '#444';
            var y_pos = model.y - 5;
            if ((scale_max - model.y) / scale_max >= 0.13)
              y_pos = model.y + 20;
            ctx.fillText("", model.x, y_pos);
          }
        });
      }
    }

  };
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
  ];
  public pieChartPlugins: any[] = [
    {
      beforeDraw(chart) {
        const ctx = chart.ctx;
        const txt = "";
        const size = chart.config.options.defaultFontSize;
        //Get options from the center object in options
        const sidePadding = 60;
        const sidePaddingCalculated =
          (sidePadding / 100) * (chart.innerRadius * 2);

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        const centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;

        //Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        const stringWidth = ctx.measureText(txt + "   ").width;
        const elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        const widthRatio = elementWidth / stringWidth;
        const newFontSize = Math.floor(30 * widthRatio);
        const elementHeight = chart.innerRadius * 2;

        // Pick a new font size so it will not be larger than the height of label.
        const fontSizeToUse = Math.min(newFontSize, elementHeight);

        ctx.font = fontSizeToUse + "px Arial";
        ctx.fillStyle = "blue";

        // Draw text in center
        ctx.fillText(txt, centerX, centerY);
      },
    },
  ];
  Team = 0;
  Departmemnt = 0;
  LoaiBD = 0;
  public pieChartType = "pie";
  item: any = [];
  Trangthai: any[];
  type_collect = "";
  is_loading = false;
  public barChartColors: Array<any> = [
    {
      backgroundColor: [],
      hoverBackgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    }
  ];
  constructor(
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    public _BaoCaoService: BaoCaoService,
    private translate: TranslateService,
    public dialog: MatDialog,
    public _TrangThaiCongViecService: TrangThaiCongViecService,
  ) { }
  ngOnInit() {
    const query = new QueryParamsModelNew(this.filterConfiguration());

    if(this.Departmemnt != undefined){
      this.loadList(query);
      this.is_loading = true;
    }

    this.changeDetectorRefs.detectChanges();
  }
  ngOnChanges(changes: SimpleChanges) {
    
    if(changes.startDate != null && changes.startDate != undefined){
      this.selectedDate.start = changes.startDate.currentValue;
    }
    if(changes.endDate != null && changes.endDate != undefined){
      this.selectedDate.end = changes.endDate.currentValue;
    }
    if(changes.typeChart != null && changes.typeChart != undefined){
      this.LoaiBD = changes.typeChart.currentValue;
    }
    if(changes.id_project_team != null && changes.id_project_team != undefined){
      this.Team = changes.id_project_team.currentValue;
    }
    if(changes.collect_by != null && changes.collect_by != undefined){
      this.type_collect = changes.collect_by.currentValue;
    }
    if(changes.id_department != null && changes.id_department != undefined){
      this.Departmemnt = changes.id_department.currentValue;
    }

    

    const query = new QueryParamsModelNew(this.filterConfiguration());
    if(this.Departmemnt != undefined){
      this.loadList(query);
      this.is_loading = true;
    }
    
    this.changeDetectorRefs.detectChanges();
    
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values
    
}
  reset() { }
  ChangeTeam(item) {
    if (this.Team == item.id_row) return;
    this.Team = item.id_row;
    const query = new QueryParamsModelNew(this.filterConfiguration());
    this.loadList(query);
  }
  NameofTeam() {
    if (this.ListProject) {
      var team = this.ListProject.find(
        (element) => element.id_row == this.Team
      );
      if (team) return team.title;
    }
    return "Chọn dự án";
  }
  pieChart(query) {
    this._TrangThaiCongViecService.loadList(query).subscribe(res => {
      if (res && res.status == 1) {
        if (res && res.data["TrangThaiCongViec"]) {
          this.pieChartLabel = res.data["TrangThaiCongViec"];
          this.changeDetectorRefs.detectChanges();
        }
        if (res && res.data["ColorList"]) {
          this.pieChartColor = [
            {
              backgroundColor: res.data["ColorList"],
            },
          ];
          this.changeDetectorRefs.detectChanges();
        }
        if (res.data["DataTrangThaiCongViec"]) {
          this.pieChartData = res.data["DataTrangThaiCongViec"];
          this.changeDetectorRefs.detectChanges();
        }
      }
    });
  }
  loadList(query) {
    query = new QueryParamsModelNew(this.filterConfiguration());
    if ((query.filter.TuNgay == undefined && query.filter.DenNgay == undefined) || (query.filter.TuNgay != undefined && query.filter.DenNgay != undefined)) {
      if (this.LoaiBD == 0) {
        this.BarChart(query);
      }
      else {
        this.pieChart(query);
      }


    }
  }
  BarChart(query) {
    this._TrangThaiCongViecService.loadList(query).subscribe(res => {
      this.barChartLabels = [];
      this.barChartData = [];
      this.barChartColors = [];
      if (res && res.status == 1) {
        if (res && res.data["DataBarChart"]) {
          for (let item of res.data["DataBarChart"]) {
            this.barChartData.push({ data: [item.value], label: item.trangthai });
            this.barChartColors.push({ backgroundColor: item.color });
          }
          this.barChartLabels.push('');
          this.chartDataLoaded.next(true);
          this.changeDetectorRefs.detectChanges();
        }
        else {
          this.chartDataLoaded.next(false);
          this.changeDetectorRefs.detectChanges();
        }
      }

    });
  }
  chartClicked(e: any): void {
  }

  chartHovered(e: any): void {
  }
  f_convertDate(p_Val: any) {
    let a = p_Val === "" ? new Date() : new Date(p_Val);
    var date = moment(a).isValid();
    if (date) {
      return (
        ("0" + a.getDate()).slice(-2) +
        "/" +
        ("0" + (a.getMonth() + 1)).slice(-2) +
        "/" +
        a.getFullYear()
      );
    }
    else
      return null;
  }
  convert(str) {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  filterConfiguration(): any {
    const filter: any = {};
    if (this.Team > 0)
      filter.id_projectteam = this.Team;

    if (this.convert(this.selectedDate.start) != '1970-01-01')
      filter.TuNgay = this.f_convertDate(this.selectedDate.start).toString();

    if (this.convert(this.selectedDate.end) != '1970-01-01')
      filter.DenNgay = this.f_convertDate(this.selectedDate.end).toString();

    if(this.type_collect != "")
      filter.collect_by = this.type_collect;
    
    if (this.Departmemnt > 0)
      filter.id_department = this.Departmemnt;

    return filter;
  }

  getClasses(val) {
    if (val == 2) return "label label-lg label-light-warning label-inline";
    else {
      if (val == 3) return "label label-lg label-light-danger label-inline";
      return "label label-lg label-light-success label-inline";
    }
  }
  GetStringByStatus(status) {
    let result = "";
    if (status == 2)
      return (result = this.translate.instant("projects.chamtiendo"));
    else {
      if (status == 3) result = this.translate.instant("projects.ruirocao");
      else result = this.translate.instant("projects.dungtiendo");
    }
    return result;
  }
  GetColorProgress(status) {
    if (status > 75) return "progress-bar bg-success";
    else {
      if (status < 25) return "progress-bar bg-danger";
      else {
        if (status < 50) return "progress-bar bg-primary";
        return "progress-bar bg-info";
      }
    }
  }
  getHeight(): any {
    let tmp_height = window.innerHeight - 300;
    return tmp_height + "px";
  }
}
export interface DialogData {
  start: string;
  end: string;
}
