import {
  ChangeDetectorRef,
  EventEmitter,
  OnDestroy,
  OnInit,
} from "@angular/core";
import { Component, Input } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import Chart from "chart.js";
import moment from "moment";
import { BehaviorSubject, Subscription } from "rxjs";
import { BieuDoTheoDoiService } from "../../Services/bieu-do-theo-doi-widget.service";
import { WorkGeneralService } from "../../Services/work-general.services";
import { QueryParamsModelNew } from "src/app/_metronic/core/models/pagram";

@Component({
  selector: "bieu-do-theo-doi-widget",
  templateUrl: "./bieu-do-theo-doi-widget.component.html",
})
export class BieuDoTheoDoiWidgetComponent
  implements
  OnInit {
  isLoading: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  colorCrossbar = ["red", "blue", "#ff9900", "green", "violet"];
  @Input() cssClass: "";
  list_widgets: any[] = [];
  selectedDate = {
    start: new Date(null),
    end: new Date(null),
  };
  ListProject: any = [];
  @Input()
  btnFilterEventTrangThaiCV17: EventEmitter<any> = new EventEmitter<any>();
  filterDSTrangThaiduan17: EventEmitter<any> = new EventEmitter<any>();
  btnLoaiBieuDo17: EventEmitter<any> = new EventEmitter<any>();
  btnDeleteFilterEventCondition_BDTG: EventEmitter<any> = new EventEmitter<any>();
  btnFilterEventCondition_BDTG: EventEmitter<any> = new EventEmitter<any>();
  btnThietlapFilter_BDTG: EventEmitter<any> = new EventEmitter<any>();
  filterDieuKienLoc_BDTG: EventEmitter<any> = new EventEmitter<any>();

  btnFilterSub: Subscription;
  btnFilterDK_BDTG: Subscription;
  btnDeleteFilterDK_BDTG: Subscription;
  btnThietlap_BDTG: Subscription;
  public chartDataLoaded = new BehaviorSubject<boolean>(false);
  public pieChartData = [0, 0, 0, 0];
  public pieChartLabel: string[] = [];
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
  // public barChartLabels: string[] = ['2006', '2007', '2008', '2009', '2010', '2011', '2012'];
  public barChartLabels: string[] = [];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    // { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' }
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
  LoaiBD = 0;
  ListDK: any = [];
  idDK = 0;
  SQL_Custom: string = '';
  public pieChartType = "pie";
  public Tongcongviec = 0;
  item: any = [];
  Trangthai: any[];
  public barChartColors: Array<any> = [
    {
      backgroundColor: [],
      hoverBackgroundColor: [],
      borderColor: [],
      borderWidth: 1,
    }
  ];
  //=========================================================================
  btnFilterEventVaiTro17: EventEmitter<string> = new EventEmitter<string>();
  btnFilterSubVaiTro17: Subscription;
  filterDanhSachVaiTro17: EventEmitter<any> = new EventEmitter<any>();
  ListVaiTro: any[] = [];
  idRole: number = -1;
  constructor(
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    public _BieuDoTheoDoiService: BieuDoTheoDoiService,
    private translate: TranslateService,
    public dialog: MatDialog,
    public _WorkGeneralService: WorkGeneralService,
  ) { }
  ngOnInit() {
    const query = new QueryParamsModelNew(this.filterConfiguration());
    this.btnFilterSub = this.btnFilterEventTrangThaiCV17.subscribe((res) => {
      if (res != this.Team) {
        this.Team = res;
        setTimeout(() => {
          this.loadDanhSachVaiTro();
          this.changeDetectorRefs.detectChanges();
        }, 1000);
        var object = {
          list: this.ListProject,
          name: this.NameofTeam(),
        };
        this.filterDSTrangThaiduan17.emit(object);
      }
    });

    this.btnFilterSub = this.btnLoaiBieuDo17.subscribe((res) => {
      this.LoaiBD = res;
      this.loadList(query);
      this.changeDetectorRefs.detectChanges();
    });

    this._WorkGeneralService.lite_project_by_manager().subscribe(
      (res) => {
        if (res && res.status == 1) {
          this.ListProject = res.data;
          var object = {
            list: this.ListProject,
            name: this.NameofTeam(),
          };
          this.filterDSTrangThaiduan17.emit(object);
        }
      }
    );
    this.btnFilterDK_BDTG = this.btnFilterEventCondition_BDTG.subscribe((res) => {
      if (res != this.idDK) {
        this.idDK = res.RowID;
        this.SQL_Custom = res.SQL_Custom;
        setTimeout(() => {
          this.loadList(query);
          this.changeDetectorRefs.detectChanges();
        }, 1000);
        var object = {
          list: this.ListDK,
          name: this.NameofDK(),
        };
        this.filterDieuKienLoc_BDTG.emit(object);
      }
    });
    this.btnDeleteFilterDK_BDTG = this.btnDeleteFilterEventCondition_BDTG.subscribe((res) => {
      this.delete_dk(res);

    });
    this.btnThietlap_BDTG = this.btnThietlapFilter_BDTG.subscribe((res) => {
      this.load_đk();
      setTimeout(() => {
        this.loadList(query);
      }, 1000);
    });
    this.load_đk();
    this.loadList(query);

    this.btnFilterSubVaiTro17 = this.btnFilterEventVaiTro17.subscribe((res) => {
      this.idRole = +res;
      this.loadList(query);
      var object = {
        list: this.ListVaiTro,
        name: this.NameofRole(),
      };
      this.filterDanhSachVaiTro17.emit(object);
    });

    this.changeDetectorRefs.detectChanges();
  }

  load_đk() {
    this._WorkGeneralService.Get_listCustomWidgetByUser(17).subscribe(res => {
      if (res && res.status == 1) {

        this.ListDK = res.data;
        var object = {
          list: this.ListDK,
          name: this.NameofDK(),
        };
        this.filterDieuKienLoc_BDTG.emit(object);
      }
    })
  }
  delete_dk(id) {
    this._WorkGeneralService.Delete_Custom_Widget(id).subscribe(res => {
      if (res && res.status == 1) {
        this.load_đk();
      }
    })
  }
  NameofDK() {
    if (this.ListDK) {
      var team = this.ListDK.find(
        (element) => element.RowID == this.idDK
      );
      if (team) return team.Title;
    }
    return "Chọn điều kiện";
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
    return "";
  }
  pieChart(query) {
    this._BieuDoTheoDoiService.loadList(query).subscribe(res => {
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
    this._BieuDoTheoDoiService.loadList(query).subscribe(res => {
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
    if (this.ListDK.length > 0) {
      if (this.SQL_Custom) {
        filter.SQL_Custom = this.idDK;
      }
      else filter.SQL_Custom = 0;
    } else {
      filter.SQL_Custom = 0;
    }
    filter.id_role = this.idRole;
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

  getWidth(): any {
    let tmp = 0;
    tmp = (window.innerWidth / 2) - 100;
    return tmp + 'px';
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
          if(+this.idRole == -1){
            this.idRole = res.data[0].id;
          }
          var object = {
            list: this.ListVaiTro,
            name: this.NameofRole(),
          };
          const query = new QueryParamsModelNew(this.filterConfiguration());
          this.loadList(query);
          this.filterDanhSachVaiTro17.emit(object);
        }
      }
    );
  }

  filterConfigurationVaiTro(): any {
    let filter: any = {};
    filter.id_project = this.Team;
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
}
export interface DialogData {
  start: string;
  end: string;
}
