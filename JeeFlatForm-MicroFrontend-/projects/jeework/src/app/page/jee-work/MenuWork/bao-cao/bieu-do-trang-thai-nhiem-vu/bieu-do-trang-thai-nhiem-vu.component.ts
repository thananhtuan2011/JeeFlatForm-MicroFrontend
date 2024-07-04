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
import { ICreateAction, IDeleteAction, IDeleteSelectedAction, IEditAction, IFetchSelectedAction, IUpdateStatusForSelectedAction } from "../Model/table.model";
import { PaginatorState } from "../Model/paginator.model";
import { SortState } from "../Model/sort.model";
import { GroupingState } from "../Model/grouping.model";
import { QueryParamsModelNew } from "../../../models/query-models/query-params.model";
import { BieuDoTheoDoiService } from "../services/bieu-do-theo-doi-widget.service";
// import { BieuDoTheoDoiService } from "../../Services/bieu-do-trang-thai-nhiem-vu.service";
// import { LandingPageService } from "../../Services/landing-page.service";

@Component({
  selector: "bieu-do-trang-thai-nhiem-vu",
  templateUrl: "./bieu-do-trang-thai-nhiem-vu.component.html",
})
export class BieuDoTrangThaiNhiemVuComponent
  implements
  OnInit,
  OnDestroy,
  ICreateAction,
  IEditAction,
  IDeleteAction,
  IDeleteSelectedAction,
  IFetchSelectedAction,
  IUpdateStatusForSelectedAction {
  paginator: PaginatorState = new PaginatorState();
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean = false;
  filterGroup: FormGroup;
  searchGroup: FormGroup;
  private subscriptions: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/
  colorCrossbar = ["red", "blue", "#ff9900", "green", "violet"];
  @Input() cssClass: "";
  @Input() startDate: "";
  @Input() endDate: "";
  @Input() typeChart = 0;
  @Input() id_project_team = 0;
  @Input() collect_by = "";
  @Input() id_department = 0;
  @Input() priority = 0;
  @Input() important = 0;
  @Input() id_role = 0;

  list_widgets: any[] = [];
  selectedDate = {
    start: new Date(null),
    end: new Date(null),
  };
  ListProject: any = [];
  @Input()
  campaign17StartEvent: EventEmitter<any> = new EventEmitter<any>();
  campaign17StartSub: Subscription;
  campaign17EndEvent: EventEmitter<any> = new EventEmitter<any>();
  campaign17EndSub: Subscription;
  campaign17RangeEvent: EventEmitter<any> = new EventEmitter<any>();
  campaign17RangeSub: Subscription;
  btnFilterEventTrangThaiCV17: EventEmitter<any> = new EventEmitter<any>();
  filterDSTrangThaiduan17: EventEmitter<any> = new EventEmitter<any>();
  btnLoaiBieuDo17: EventEmitter<any> = new EventEmitter<any>();
  btnFilterSub: Subscription;
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
  RoleID=0;
  Department = 0;
  type_collect = "";
  LoaiBD = 0;
  Priority = 0;
  Important = 0;
  public pieChartType = "pie";
  public Tongcongviec = 0;
  item: any = [];
  Trangthai: any[];
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
    public _BieuDoTheoDoiService: BieuDoTheoDoiService,
    // public landingeService: LandingPageService,
    private translate: TranslateService,
    public dialog: MatDialog,
  ) { }
  ngOnInit() {
    const query = new QueryParamsModelNew(this.filterConfiguration());
    this.btnFilterSub = this.btnFilterEventTrangThaiCV17.subscribe((res) => {
      if (res != this.Team) {
        this.Team = res;
        setTimeout(() => {
          this.loadList(query);
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
    this.campaign17RangeSub = this.campaign17RangeEvent.subscribe((res) => {
      this.selectedDate = res;
      this.campaign17EndSub = this.campaign17EndEvent.subscribe((res) => {
        this.selectedDate.end = res;
        setTimeout(() => {
          this.loadList(query);
          this.changeDetectorRefs.detectChanges();
        }, 1000);
      })
    });
    // this._BieuDoTheoDoiService.lite_project_by_manager().subscribe(
    //   (res) => {
    //     if (res && res.status == 1) {
    //       this.ListProject = res.data;
    //       var object = {
    //         list: this.ListProject,
    //         name: this.NameofTeam(),
    //       };
    //       this.filterDSTrangThaiduan17.emit(object);
    //     }
    //   }
    // );
    
    if(this.Department != undefined){
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
      this.Department = changes.id_department.currentValue;
    }
    if(changes.priority != null && changes.priority != undefined){
      this.Priority = changes.priority.currentValue;
    }
    if(changes.important != null && changes.important != undefined){
      this.Important = changes.important.currentValue;
    }
    
    if(changes.id_role != null && changes.id_role != undefined){
      this.RoleID = changes.id_role.currentValue;
    }

    const query = new QueryParamsModelNew(this.filterConfiguration());
    if(this.Department != undefined){
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
    this._BieuDoTheoDoiService.fetch_Report_Bieudotrangthai("", query);
    this._BieuDoTheoDoiService.items$.subscribe((res) => {
      if (res && res["TrangThaiCongViec"]) {
        this.pieChartLabel = res["TrangThaiCongViec"];
        this.changeDetectorRefs.detectChanges();
      }
      if (res && res["ColorList"]) {
        this.pieChartColor = [
          {
            backgroundColor: res["ColorList"],
          },
        ];
        this.changeDetectorRefs.detectChanges();
      }
      if (res["DataTrangThaiCongViec"]) {
        this.pieChartData = res["DataTrangThaiCongViec"];
        this.changeDetectorRefs.detectChanges();
      }
    });
    this.Tongcongviec = 129;
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
    this._BieuDoTheoDoiService.fetch_Report_Bieudotrangthai("", query);
    this.chartDataLoaded.next(false);
    this._BieuDoTheoDoiService.items$.subscribe((res) => {
      this.barChartLabels = [];
      this.barChartData = [];
      this.barChartColors = [];
      if (res && res["DataBarChart"]) {
        for (let item of res["DataBarChart"]) {
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
    filter.id_role = this.id_role;
    if (this.Team > 0)
      filter.id_projectteam = this.Team;
    if (this.convert(this.selectedDate.start) != '1970-01-01')
      filter.TuNgay = this.f_convertDate(this.selectedDate.start).toString();
    if (this.convert(this.selectedDate.end) != '1970-01-01')
      filter.DenNgay = this.f_convertDate(this.selectedDate.end).toString();
    
    if(this.type_collect != "")
      filter.collect_by = this.type_collect;
    
    if (this.Department > 0)
      filter.id_department = this.Department;
    
    if (this.Priority > 0)
      filter.priority = this.Priority;

    if (this.Important > 0)
      filter.important = this.Important;

    return filter;
  }
  ngOnDestroy() {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
    this.campaign17RangeSub.unsubscribe();
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
  create() {
    this.edit(undefined);
  }
  edit(id: number) {

  }

  delete(id: number) {

  }

  deleteSelected() {

  }

  updateStatusForSelected() {

  }

  fetchSelected() {
    // s
  }
  filter() {

  }
  // search
  searchForm() {

  }

  search(searchTerm: string) {

  }
  // sorting
  sort(column: string) {

  }

  paginate(paginator: PaginatorState) {

  }

  getIndexOfList(v: any) {
    var ind = 0;
    this._BieuDoTheoDoiService.items$.subscribe((r) => {
      ind = r.indexOf(v);
    });
    return ind;
  }
}
export interface DialogData {
  start: string;
  end: string;
}
