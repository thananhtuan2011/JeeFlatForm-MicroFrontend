import { Observable } from "rxjs";
// State
import {
	Component,
	Inject,
	OnInit,
	ViewChild,
	ChangeDetectorRef,
	ChangeDetectionStrategy,
  Input,
} from "@angular/core";

import { TranslateService } from "@ngx-translate/core";
// Material
import { SelectionModel } from "@angular/cdk/collections";
import {
	FormGroup,
	Validators,
	FormBuilder,
	FormControl,
} from "@angular/forms";
// Model
import { ChartType, ChartOptions } from "chart.js";
import { Label, BaseChartDirective } from "ng2-charts";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import moment from "moment";

import { environment } from "projects/jeemeet/src/environments/environment";
import { LayoutUtilsService, MessageType } from "projects/jeemeet/src/modules/crud/utils/layout-utils.service";
import { PhieuLayYKienService } from "../../../quan-ly-phieu-lay-y-kien/_services/quan-ly-phieu-lay-y-kien.service";
import { SurveyListModel } from "../../../_models/quan-ly-cuoc-hop.model";
import { ActivatedRoute } from "@angular/router";
@Component({
	selector: "app-ds-phieu-khao-sat-meet",
	templateUrl: "./ds-phieu-khao-sat.component.html",
	styleUrls: ["./ds-phieu-khao-sat.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyPhieuKhaoSatListMeetComponent implements OnInit {
	// Public properties
  @Input() data:any
	@ViewChild(BaseChartDirective, { static: true })
	public chart: BaseChartDirective;
	dataI: any;

	title: string = "";
	titlechart: string = "";
	type: number = 1;
	idM: number = 0;
	idS: number = 0;
	dem: number = 0;
	listData: any[] = [];
	isNull: boolean = false;
	domain = environment.CDN_DOMAIN ;
	listLabels: any[] = [];
	public now = new Date();
	R: any = {};
	// Pie
	pieChartOptions: ChartOptions = {
		responsive: true,
		legend: {
			position: "top",
			labels: {
				filter: function (legendItems, data) {
					var value_label = data.labels[legendItems.index];
					return value_label;
				},
			},
		},
		plugins: {
			datalabels: {
				formatter: (value, ctx) => {
					// const label = ctx.chart.data.labels[ctx.dataIndex] + ' (' + value + ')';
					// return label;
					if (ctx.chart.config.type == "pie") {
						let sum = 0;
						let dataArr = ctx.chart.data.datasets[0].data;
						dataArr.forEach((tmp) => {
							sum += tmp;
						});
						let percentage = ((value * 100) / sum).toFixed(2) + "%";
						return percentage;
					} else {
						return value;
					}
				},
				color: "white",
			},
		},
		tooltips: {
			enabled: true,
			mode: "single",
			callbacks: {
				// label: function (tooltipItems, data) {
				// 	let label = data.labels[tooltipItems.index];
				// 	let value = data.datasets[0].data[tooltipItems.index];
				// 	// return label + ' (' + value + ')';
				// 	return label;
				// },
			},
		},
	};

	pieChartLabels: Label[] = [
		/*['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'*/
	];
	pieChartData: number[] = [];
	pieChartType: ChartType = "pie";
	pieChartPlugins = [pluginDataLabels];
	pieChartColors = [
		{
			backgroundColor: [
				/*'rgba(255,0,0,0.3)', 'rgba(0,255,0,0.3)', 'rgba(0,0,255,0.3)'*/
			],
			borderColor: [],
		},
	];
	datasets: any = [
		{
			data: [],
			borderWidth: 0,
		},
	];
	primary_color: string = "";
	isObligate: boolean;
	ListFileDinhKem: any[] = [];
	ExtensionVideo = [
		"mp4",
		"mov",
		"avi",
		"gif",
		"mpeg",
		"flv",
		"wmv",
		"divx",
		"mkv",
		"rmvb",
		"dvd",
		"3gp",
		"webm",
	];
	strExtensionVideo =
		"mp4, .mov, .avi, .gif, .mpeg, .flv, .wmv, .divx, .mkv, .rmvb, .dvd, .3gp, .webm";
	ExtensionFile = [
		"xls",
		"xlsx",
		"doc",
		"docx",
		"pdf",
		"mp3",
		"zip",
		"7zip",
		"rar",
		"txt",
	];
	strExtensionFile =
		"xls, .xlsx, .doc, .docx, .pdf, .mp3, .zip, .7zip, .rar, .txt";
	files: any[] = [{ data: {} }];
	filesToCA: any[] = [{ data: {} }];
	ListFile: any[] = [];
	IsXem: boolean = false;
  isCopy: boolean = false;
	sizemaxfile: any = environment.DungLuong / 1048576;
	ExtensionImg = ["png", "gif", "jpeg", "jpg"];
	strExtensionImg = "png, .gif, .jpeg, .jpg";
	file: string = "";
	file1: string = "";
	file2: string = "";
	demsoluongfilepdf: number = 0;
	constructor(
		private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService,
		private service: PhieuLayYKienService,
		private changeDetectorRefs: ChangeDetectorRef,
		public fb: FormBuilder,
    private activatedRoute: ActivatedRoute,
		// private TokenStorage: TokenStorage
	) {
		// this.service.getWebsiteConfigNoLogin("CSS_APPLY_THEME,CSS_COLOR_ACTIVE").subscribe(res => {
		// 	if (res.status == 1) {
		// 		let show = (res.data && res.data.CSS_APPLY_THEME && res.data.CSS_APPLY_THEME == "1") ? true : false;
		// 		if (show) {
		// 			//
		// 			let color = (res.data && res.data.CSS_COLOR_ACTIVE) ? res.data.CSS_COLOR_ACTIVE : "";
		// 			this.pieChartOptions.legend.labels.fontColor = color;
		// 			this.primary_color = color;
		// 			this.datasets[0].borderWidth = 1;
		// 		}
		// 	}
		// })
	}

	ngOnInit() {
		this.dem = 0;
		// if (this.data.QuanLyPhieuLayYKien.IdKhaoSat) {
		// 	this.idS = this.data.QuanLyPhieuLayYKien.IdKhaoSat;
		// }
		// this.idM = this.data.QuanLyPhieuLayYKien.IdKhaoSat;
		// this.type = this.data.QuanLyPhieuLayYKien.IsTraLoi;
		// this.isObligate = this.data.isObligate ? this.data.isObligate : false;

    this.activatedRoute.params.subscribe((params) => {
      this.idM = params.id;
      this.service.checkTraLoi(this.idM).subscribe((res: any) => {
        this.type = res
        if (this.idM > 0 && this.type == 1) {
          this.service.getSurveyLists(this.idM).subscribe((res: any) => {
            if (res && res.data) {
              this.dataI = res.data;
              this.isObligate = res.data.IsBatBuoc
                ? res.data.IsBatBuoc
                : false;
              this.title = this.dataI.TieuDe ? this.dataI.TieuDe : "";
              if (
                this.dataI.DanhSachCauHoi &&
                this.dataI.DanhSachCauHoi.length > 0
              ) {
                let lQ = this.dataI.DanhSachCauHoi.length,
                  i;
                for (i = 0; i < lQ; i++) {
                  if (this.dataI.DanhSachCauHoi[i].Type == 3) {
                    if (
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi &&
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi.length > 0
                    ) {
                      let lA =
                          this.dataI.DanhSachCauHoi[i]
                            .DanhSachCauTraLoi.length,
                        j;
                      for (j = 0; j < lA; j++) {
                        this.dataI.DanhSachCauHoi[
                          i
                        ].DanhSachCauTraLoi[j]["Checked"] =
                          false;
                      }
                    }
                  } else if (this.dataI.DanhSachCauHoi[i].Type == 1) {
                    this.dataI.DanhSachCauHoi[i]["GhiChu"] = "";
                  } else if (this.dataI.DanhSachCauHoi[i].Type == 2) {
                    if (
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi &&
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi.length > 0
                    ) {
                      let lA =
                          this.dataI.DanhSachCauHoi[i]
                            .DanhSachCauTraLoi.length,
                        j;
                      for (j = 0; j < lA; j++) {
                        this.dataI.DanhSachCauHoi[
                          i
                        ].DanhSachCauTraLoi[j]["Checked"] =
                          false;
                      }
                    }
                  } else if (this.dataI.DanhSachCauHoi[i].Type == 4) {
                    this.dataI.DanhSachCauHoi[i]["GhiChu"] = "";
                    this.dataI.DanhSachCauHoi[i]["Checked"] = false;
                    if (
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi &&
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi.length > 0
                    ) {
                      let lA =
                          this.dataI.DanhSachCauHoi[i]
                            .DanhSachCauTraLoi.length,
                        j;
                      for (j = 0; j < lA; j++) {
                        this.dataI.DanhSachCauHoi[
                          i
                        ].DanhSachCauTraLoi[j]["Checked"] =
                          false;
                      }
                    }
                  } else if (this.dataI.DanhSachCauHoi[i].Type == 5) {
                    let listAns = [
                      {
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.LEVEL1"
                        ),
                        Checked: false,
                        Point: 5,
                      },
                      {
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.LEVEL2"
                        ),
                        Checked: false,
                        Point: 4,
                      },
                      {
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.LEVEL3"
                        ),
                        Checked: false,
                        Point: 3,
                      },
                      {
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.LEVEL4"
                        ),
                        Checked: false,
                        Point: 2,
                      },
                      {
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.LEVEL5"
                        ),
                        Checked: false,
                        Point: 1,
                      },
                    ];
                    this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi =
                      listAns;
                  } else {
                    // == 6
                    let listAns = [
                      {
                        IdCauTraLoi:
                          1 +
                          this.dataI.DanhSachCauHoi[i].Id +
                          i,
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.CUOCHOP.ANSWERYES"
                        ),
                        Checked: false,
                      },
                      {
                        IdCauTraLoi:
                          0 +
                          this.dataI.DanhSachCauHoi[i].Id +
                          i,
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.CUOCHOP.ANSWERNO"
                        ),
                        Checked: false,
                      },
                    ];
                    this.dataI.DanhSachCauHoi[i]["GhiChu"] = "";
                    if (
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi &&
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi.length == 0
                    ) {
                      this.dataI.DanhSachCauHoi[
                        i
                      ].DanhSachCauTraLoi = listAns;
                    } else if (
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi
                    ) {
                      // > 0
                      this.dataI.DanhSachCauHoi[
                        i
                      ].DanhSachCauTraLoi = [];
                      this.dataI.DanhSachCauHoi[
                        i
                      ].DanhSachCauTraLoi = listAns;
                    }
                  }
                }
              }
            }
            this.changeDetectorRefs.detectChanges();
          });
        } else if (this.idM > 0 && this.type == 2) {
          this.service.getResultSurveyList(this.idM).subscribe((res: any) => {
            if (res && res.data) {
              this.dataI = res.data;
              this.ListFileDinhKem = res.data.FileDinhKem;
              this.isObligate = res.data.IsBatBuoc
                ? res.data.IsBatBuoc
                : false;
              this.title = this.dataI.TieuDe ? this.dataI.TieuDe : "";
              if (
                this.dataI.DanhSachCauHoi &&
                this.dataI.DanhSachCauHoi.length > 0
              ) {
                let lQ = this.dataI.DanhSachCauHoi.length,
                  i;
                for (i = 0; i < lQ; i++) {
                  if (this.dataI.DanhSachCauHoi[i].Type == 3) {
                    if (
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi &&
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi.length > 0
                    ) {
                      let lA =
                          this.dataI.DanhSachCauHoi[i]
                            .DanhSachCauTraLoi.length,
                        j;
                      for (j = 0; j < lA; j++) {
                        if (
                          this.dataI.DanhSachCauHoi[i]
                            .DanhSachCauTraLoi[j].choose ==
                          true
                        ) {
                          this.dataI.DanhSachCauHoi[
                            i
                          ].DanhSachCauTraLoi[j]["Checked"] =
                            true;
                        } else {
                          this.dataI.DanhSachCauHoi[
                            i
                          ].DanhSachCauTraLoi[j]["Checked"] =
                            false;
                        }
                      }
                    }
                  } else if (this.dataI.DanhSachCauHoi[i].Type == 1) {
                    this.dataI.DanhSachCauHoi[i]["GhiChu"] =
                      this.dataI.DanhSachCauHoi[i].GhiChu;
                  } else if (this.dataI.DanhSachCauHoi[i].Type == 2) {
                    if (
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi &&
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi.length > 0
                    ) {
                      let lA =
                          this.dataI.DanhSachCauHoi[i]
                            .DanhSachCauTraLoi.length,
                        j;
                      for (j = 0; j < lA; j++) {
                        if (
                          this.dataI.DanhSachCauHoi[i]
                            .DanhSachCauTraLoi[j].choose ==
                          true
                        ) {
                          this.dataI.DanhSachCauHoi[
                            i
                          ].DanhSachCauTraLoi[j]["Checked"] =
                            true;
                        } else {
                          this.dataI.DanhSachCauHoi[
                            i
                          ].DanhSachCauTraLoi[j]["Checked"] =
                            false;
                        }
                      }
                    }
                  } else if (this.dataI.DanhSachCauHoi[i].Type == 4) {
                    this.dataI.DanhSachCauHoi[i]["GhiChu"] =
                      this.dataI.DanhSachCauHoi[i].GhiChu;
                    if (
                      this.dataI.DanhSachCauHoi[i]["GhiChu"] != ""
                    ) {
                      this.dataI.DanhSachCauHoi[i]["Checked"] =
                        true;
                    } else {
                      this.dataI.DanhSachCauHoi[i]["Checked"] =
                        false;
                    }
                    if (
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi &&
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi.length > 0
                    ) {
                      let lA =
                          this.dataI.DanhSachCauHoi[i]
                            .DanhSachCauTraLoi.length,
                        j;
                      for (j = 0; j < lA; j++) {
                        if (
                          this.dataI.DanhSachCauHoi[i]
                            .DanhSachCauTraLoi[j].choose ==
                          true
                        ) {
                          this.dataI.DanhSachCauHoi[
                            i
                          ].DanhSachCauTraLoi[j]["Checked"] =
                            true;
                        } else {
                          this.dataI.DanhSachCauHoi[
                            i
                          ].DanhSachCauTraLoi[j]["Checked"] =
                            false;
                        }
                      }
                    }
                  } else if (this.dataI.DanhSachCauHoi[i].Type == 5) {
                    let listAns = [
                      {
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.LEVEL1"
                        ),
                        Checked:
                          this.dataI.DanhSachCauHoi[i]
                            .KetQua == 5
                            ? true
                            : false,
                        Point: 5,
                      },
                      {
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.LEVEL2"
                        ),
                        Checked:
                          this.dataI.DanhSachCauHoi[i]
                            .KetQua == 4
                            ? true
                            : false,
                        Point: 4,
                      },
                      {
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.LEVEL3"
                        ),
                        Checked:
                          this.dataI.DanhSachCauHoi[i]
                            .KetQua == 3
                            ? true
                            : false,
                        Point: 3,
                      },
                      {
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.LEVEL4"
                        ),
                        Checked:
                          this.dataI.DanhSachCauHoi[i]
                            .KetQua == 2
                            ? true
                            : false,
                        Point: 2,
                      },
                      {
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.LEVEL5"
                        ),
                        Checked:
                          this.dataI.DanhSachCauHoi[i]
                            .KetQua == 1
                            ? true
                            : false,
                        Point: 1,
                      },
                    ];
                    this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi =
                      listAns;
                  } else {
                    // == 6

                    let listAns = [
                      {
                        IdCauTraLoi:
                          1 +
                          this.dataI.DanhSachCauHoi[i].Id +
                          i,
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.CUOCHOP.ANSWERYES"
                        ),
                        Checked:
                          this.dataI.DanhSachCauHoi[i]
                            .KetQua != ""
                            ? this.dataI.DanhSachCauHoi[i]
                                .KetQua == 1
                              ? true
                              : false
                            : false,
                      },
                      {
                        IdCauTraLoi:
                          0 +
                          this.dataI.DanhSachCauHoi[i].Id +
                          i,
                        CauTraLoi: this.translate.instant(
                          "QL_CUOCHOP.CUOCHOP.ANSWERNO"
                        ),
                        Checked:
                          this.dataI.DanhSachCauHoi[i]
                            .KetQua != ""
                            ? this.dataI.DanhSachCauHoi[i]
                                .KetQua == 0
                              ? true
                              : false
                            : false,
                      },
                    ];
                    this.dataI.DanhSachCauHoi[i]["GhiChu"] =
                      this.dataI.DanhSachCauHoi[i].GhiChu;
                    if (
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi &&
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi.length == 0
                    ) {
                      this.dataI.DanhSachCauHoi[
                        i
                      ].DanhSachCauTraLoi = listAns;
                    } else if (
                      this.dataI.DanhSachCauHoi[i]
                        .DanhSachCauTraLoi
                    ) {
                      // > 0
                      this.dataI.DanhSachCauHoi[
                        i
                      ].DanhSachCauTraLoi = [];
                      this.dataI.DanhSachCauHoi[
                        i
                      ].DanhSachCauTraLoi = listAns;
                    }
                  }
                }
              }
            }
            this.changeDetectorRefs.detectChanges();
          });
        }
      })


    });



	}

	prepareData(): SurveyListModel {
		const _dataO = new SurveyListModel();
		_dataO.clear();

		_dataO.IdKhaoSat = this.dataI.IdKhaoSat;
		_dataO.IdCuocHop = this.idM;
		if (this.dataI.DanhSachCauHoi && this.dataI.DanhSachCauHoi.length > 0) {
			let lQ = this.dataI.DanhSachCauHoi.length,
				i;
			for (i = 0; i < lQ; i++) {
				if (this.dataI.DanhSachCauHoi[i].Type == 3) {
					if (
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length >
							0
					) {
						let lA =
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi
									.length,
							j;
						let _data: any = {};
						_data.Id = this.dataI.DanhSachCauHoi[i].Id;
						_data.KetQua = 0;
						_data.IdCauTraLoi = 0;
						_data.GhiChu = "";
						_data.IdCauTraLois = [];
						for (j = 0; j < lA; j++) {
							if (
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[
									j
								].Checked
							) {
								_data.IdCauTraLois.push({
									IdCauTraLoi:
										this.dataI.DanhSachCauHoi[i]
											.DanhSachCauTraLoi[j].IdCauTraLoi,
								});
							}
						}
						if (_data.IdCauTraLois.length == 0) {
							return;
						}
						_dataO.DanhSachKetQua.push(_data);
					}
				} else if (this.dataI.DanhSachCauHoi[i].Type == 1) {
					let _data: any = {};
					_data.Id = this.dataI.DanhSachCauHoi[i].Id;
					_data.KetQua = 0;
					_data.IdCauTraLoi = 0;
					_data.GhiChu = this.dataI.DanhSachCauHoi[i].GhiChu;
					_data.IdCauTraLois = [];

					let check = /\S/.test(_data.GhiChu);
					if (!_data.GhiChu || _data.GhiChu == "" || !check) {
						return;
					}

					_dataO.DanhSachKetQua.push(_data);
				} else if (this.dataI.DanhSachCauHoi[i].Type == 2) {
					if (
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length >
							0
					) {
						let lA =
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi
									.length,
							j;
						let _data: any = {};
						_data.Id = this.dataI.DanhSachCauHoi[i].Id;
						_data.KetQua = 0;
						_data.IdCauTraLoi = 0;
						_data.GhiChu = "";
						_data.IdCauTraLois = [];
						for (j = 0; j < lA; j++) {
							if (
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[
									j
								].Checked
							) {
								_data.IdCauTraLoi =
									this.dataI.DanhSachCauHoi[
										i
									].DanhSachCauTraLoi[j].IdCauTraLoi;
								break;
							}
						}
						if (_data.IdCauTraLoi == 0) {
							return;
						}
						_dataO.DanhSachKetQua.push(_data);
					}
				} else if (this.dataI.DanhSachCauHoi[i].Type == 4) {
					if (
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length >
							0
					) {
						let lA =
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi
									.length,
							j;
						let _data: any = {};
						_data.Id = this.dataI.DanhSachCauHoi[i].Id;
						_data.KetQua = 0;
						_data.IdCauTraLoi = 0;
						_data.GhiChu = "";
						_data.IdCauTraLois = [];
						if (this.dataI.DanhSachCauHoi[i].Checked) {
							_data.GhiChu = this.dataI.DanhSachCauHoi[i].GhiChu;

							let check = /\S/.test(_data.GhiChu);
							if (!_data.GhiChu || !check) {
								return;
							}
						} else {
							for (j = 0; j < lA; j++) {
								if (
									this.dataI.DanhSachCauHoi[i]
										.DanhSachCauTraLoi[j].Checked
								) {
									_data.IdCauTraLoi =
										this.dataI.DanhSachCauHoi[
											i
										].DanhSachCauTraLoi[j].IdCauTraLoi;
									break;
								}
							}
							if (_data.IdCauTraLoi == 0) {
								return;
							}
						}
						_dataO.DanhSachKetQua.push(_data);
					}
				} else if (this.dataI.DanhSachCauHoi[i].Type == 5) {
					let lA =
							this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi
								.length,
						j;
					let len = _dataO.DanhSachKetQua.length;
					let _data: any = {};
					for (j = 0; j < lA; j++) {
						_data = {};
						if (
							this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j]
								.Checked
						) {
							_data.Id = this.dataI.DanhSachCauHoi[i].Id;
							_data.KetQua =
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[
									j
								].Point;
							_data.IdCauTraLoi = 0;
							_data.GhiChu = "";
							_data.IdCauTraLois = [];
							_dataO.DanhSachKetQua.push(_data);
							break;
						}
					}
					if (_dataO.DanhSachKetQua.length == len) {
						return;
					}
				} else {
					// == 6

					if (
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length >
							0
					) {
						let lA =
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi
									.length,
							j;
						let len = _dataO.DanhSachKetQua.length;
						let _data: any = {};
						for (j = 0; j < lA; j++) {
							_data = {};
							if (
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[
									j
								].Checked
							) {
								_data.Id = this.dataI.DanhSachCauHoi[i].Id;
								_data.KetQua = j == 0 ? 1 : 0;
								_data.IdCauTraLoi = 0;
								_data.GhiChu =
									this.dataI.DanhSachCauHoi[i].GhiChu;
								_data.IdCauTraLois = [];
								_dataO.DanhSachKetQua.push(_data);

								// let check = /\S/.test(_data.GhiChu);
								// if (!_data.GhiChu||_data.GhiChu==""|| !check) {
								// 	return;
								// }
								break;
							}
						}
						if (_dataO.DanhSachKetQua.length == len) {
							return;
						}
					}
				}
			}
		}
		_dataO.FileDinhKem = [];
		if (this.ListFileDinhKem) {
			_dataO.FileDinhKem = this.ListFileDinhKem.filter((x) => x.IsDel);
			for (var i = 0; i < this.files.length; i++) {
				if (this.files[i].data && this.files[i].data.strBase64) {
					_dataO.FileDinhKem.push(
						Object.assign({}, this.files[i].data)
					);
				}
			}
		}

		return _dataO;
	}

	prepareData_(): SurveyListModel {
		const _dataO = new SurveyListModel();
		_dataO.clear();

		_dataO.IdKhaoSat = this.dataI.IdKhaoSat;
		_dataO.IdCuocHop = this.idM;
		if (this.dataI.DanhSachCauHoi && this.dataI.DanhSachCauHoi.length > 0) {
			let lQ = this.dataI.DanhSachCauHoi.length,
				i;
			for (i = 0; i < lQ; i++) {
				if (this.dataI.DanhSachCauHoi[i].Type == 3) {
					if (
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length >
							0
					) {
						let lA =
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi
									.length,
							j;
						let _data: any = {};
						_data.Id = this.dataI.DanhSachCauHoi[i].Id;
						_data.KetQua = 0;
						_data.IdCauTraLoi = 0;
						_data.GhiChu = "";
						_data.IdCauTraLois = [];
						for (j = 0; j < lA; j++) {
							if (
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[
									j
								].Checked
							) {
								_data.IdCauTraLois.push({
									IdCauTraLoi:
										this.dataI.DanhSachCauHoi[i]
											.DanhSachCauTraLoi[j].IdCauTraLoi,
								});
							}
						}
						// if (_data.IdCauTraLois.length == 0) {
						// 	return;
						// }
						if (_data.IdCauTraLois.length > 0) {
							_dataO.DanhSachKetQua.push(_data);
						}
					}
				} else if (this.dataI.DanhSachCauHoi[i].Type == 1) {
					let _data: any = {};
					_data.Id = this.dataI.DanhSachCauHoi[i].Id;
					_data.KetQua = 0;
					_data.IdCauTraLoi = 0;
					_data.GhiChu = this.dataI.DanhSachCauHoi[i].GhiChu;
					_data.IdCauTraLois = [];

					let check = /\S/.test(_data.GhiChu);
					// if (!_data.GhiChu || !check) {
					// 	return;
					// }
					if (!_data.GhiChu || !check) {
						continue;
					} else {
						_dataO.DanhSachKetQua.push(_data);
					}
				} else if (this.dataI.DanhSachCauHoi[i].Type == 2) {
					if (
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length >
							0
					) {
						let lA =
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi
									.length,
							j;
						let _data: any = {};
						_data.Id = this.dataI.DanhSachCauHoi[i].Id;
						_data.KetQua = 0;
						_data.IdCauTraLoi = 0;
						_data.GhiChu = "";
						_data.IdCauTraLois = [];
						for (j = 0; j < lA; j++) {
							if (
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[
									j
								].Checked
							) {
								_data.IdCauTraLoi =
									this.dataI.DanhSachCauHoi[
										i
									].DanhSachCauTraLoi[j].IdCauTraLoi;
								_dataO.DanhSachKetQua.push(_data);
								break;
							}
						}
						// if (_data.IdCauTraLoi == 0) {
						// 	return;
						// }
					}
				} else if (this.dataI.DanhSachCauHoi[i].Type == 4) {
					if (
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length >
							0
					) {
						let lA =
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi
									.length,
							j;
						let _data: any = {};
						_data.Id = this.dataI.DanhSachCauHoi[i].Id;
						_data.KetQua = 0;
						_data.IdCauTraLoi = 0;
						_data.GhiChu = "";
						_data.IdCauTraLois = [];
						if (this.dataI.DanhSachCauHoi[i].Checked) {
							_data.GhiChu = this.dataI.DanhSachCauHoi[i].GhiChu;
							let check = /\S/.test(_data.GhiChu);
							if (!_data.GhiChu || !check) {
								continue;
							} else {
								_dataO.DanhSachKetQua.push(_data);
							}
						} else {
							for (j = 0; j < lA; j++) {
								if (
									this.dataI.DanhSachCauHoi[i]
										.DanhSachCauTraLoi[j].Checked
								) {
									_data.IdCauTraLoi =
										this.dataI.DanhSachCauHoi[
											i
										].DanhSachCauTraLoi[j].IdCauTraLoi;
									_dataO.DanhSachKetQua.push(_data);
									break;
								}
							}
							// if (_data.IdCauTraLoi == 0) {
							// 	return;
							// }
						}
					}
				} else if (this.dataI.DanhSachCauHoi[i].Type == 5) {
					let lA =
							this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi
								.length,
						j;
					// let len = _dataO.DanhSachKetQua.length;
					let _data: any = {};
					for (j = 0; j < lA; j++) {
						_data = {};
						if (
							this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j]
								.Checked
						) {
							_data.Id = this.dataI.DanhSachCauHoi[i].Id;
							_data.KetQua =
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[
									j
								].Point;
							_data.IdCauTraLoi = 0;
							_data.GhiChu = "";
							_data.IdCauTraLois = [];
							_dataO.DanhSachKetQua.push(_data);
							break;
						}
					}
					// if (_dataO.DanhSachKetQua.length == len) {
					// 	return;
					// }
				} else {
					// == 6
					if (
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&
						this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length >
							0
					) {
						let lA =
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi
									.length,
							j;
						let len = _dataO.DanhSachKetQua.length;
						let _data: any = {};
						for (j = 0; j < lA; j++) {
							_data = {};
							_data.Id = this.dataI.DanhSachCauHoi[i].Id;
							_data.IdRow = +this.dataI.DanhSachCauHoi[i].IdRow;
							_data.IdCauTraLoi = 0;
							_data.GhiChu = this.dataI.DanhSachCauHoi[i].GhiChu;
							_data.IdCauTraLois = [];
							_data.KetQua = 999;
							if (
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[
									j
								].Checked
							) {
								_data.KetQua = j == 0 ? 1 : 0;
								_dataO.DanhSachKetQua.push(_data);
								break;
							}
						}
						_dataO.DanhSachKetQua.push(_data);
						// if (_dataO.DanhSachKetQua.length == len) {
						// 	return;
						// }
					}
				}
			}
		}
		_dataO.FileDinhKem = [];
		if (this.ListFileDinhKem) {
			_dataO.FileDinhKem = this.ListFileDinhKem.filter((x) => x.IsDel);
			for (var i = 0; i < this.files.length; i++) {
				if (this.files[i].data && this.files[i].data.strBase64) {
					_dataO.FileDinhKem.push(
						Object.assign({}, this.files[i].data)
					);
				}
			}
		}
		return _dataO;
	}

	printCanvas() {
		var canvas = document.getElementById("chartpie") as HTMLCanvasElement;
		var img = canvas.toDataURL();

		let tmp = window.open();
		// this.updatecolorChart("#141414");
		setTimeout(() => {
			let _html =
				"<html>" +
				"<head>" +
				"<style>" +
				"h4 {text-align: center;}" +
				"img.center { display: block; margin: 0 auto;}" +
				"</style>" +
				"</head>" +
				"<body >" +
				"<h4>" +
				this.translate.instant(
					"QL_CUOCHOP.CUOCHOP.SURVEYTABLERESULTCHART"
				) +
				"&nbsp" +
				this.titlechart +
				"</h4>" +
				'<img class="center" src="' +
				img +
				'" onload="window.print()" />' +
				"</body>" +
				"</html>";
			tmp.document.write(_html);
			// this.updatecolorChart(this.primary_color);
			// setTimeout(() => {
			// 	this.updatecolorChart(this.primary_color);
			// }, 500);
		}, 500);
	}

	add(dataO: SurveyListModel) {
		if (this.demsoluongfilepdf > 0)
		{
			const dialogRef = this.layoutUtilsService.deleteElement(
				this.translate.instant("MENU_MEETING.MEETING_SENDCA"),
				this.translate.instant(
					"MENU_MEETING.MEETING_SEND_YKIENLAICA"
				)
			);
			// dialogRef.afterClosed().subscribe((res) => {
			// 	if (res) {
			// 	const dialogReff = this.dialog.open(KySimDialogComponent, {
			// 		data: { IdKhaoSat: this.dataI.IdKhaoSat, data: this.filesToCA },
			// 		width: "50%",
			// 		height: "370px",
			// 	});
			// 	dialogReff.disableClose = true;
			// 	dialogReff.afterClosed().subscribe((res) => {
			// 		if (res) {
			// 		this.service.add(dataO).subscribe(
			// 			(res) => {
			// 				if (res && res.status == 1) {
			// 					this.dialogRef.close(res);
			// 					this.layoutUtilsService.showActionNotification(
			// 						res.error.message,
			// 						MessageType.Create,
			// 						2000,
			// 						true,
			// 						false
			// 					);
			// 				} else {
			// 					this.layoutUtilsService.showActionNotification(
			// 						res.error.message,
			// 						MessageType.Error,
			// 						2000,
			// 						true,
			// 						false
			// 					);
			// 				}
			// 			},
			// 			(error) => {
			// 				this.layoutUtilsService.showActionNotification(
			// 					error.error.error.message,
			// 					MessageType.Error,
			// 					20000,
			// 					true,
			// 					false
			// 				);
			// 			}
			// 		);}
			// 		else
			// 		{
			// 			return;
			// 		}
			// 	});
			// }
			// else
			// {
			// 	this.service.add(dataO).subscribe(
			// 		(res) => {
			// 			if (res && res.status == 1) {
			// 				this.dialogRef.close(res);
			// 				this.layoutUtilsService.showActionNotification(
			// 					res.error.message,
			// 					MessageType.Create,
			// 					2000,
			// 					true,
			// 					false
			// 				);
			// 			} else {
			// 				this.layoutUtilsService.showActionNotification(
			// 					res.error.message,
			// 					MessageType.Error,
			// 					2000,
			// 					true,
			// 					false
			// 				);
			// 			}
			// 		},
			// 		(error) => {
			// 			this.layoutUtilsService.showActionNotification(
			// 				error.error.error.message,
			// 				MessageType.Error,
			// 				20000,
			// 				true,
			// 				false
			// 			);
			// 		}
			// 	);
			// 		return;
			// 	}
			// });
		}
		else
		 {
			const dialogRef = this.layoutUtilsService.deleteElement(
				this.translate.instant("MENU_MEETING.MEETING_SEND"),
				this.translate.instant("MENU_MEETING.MEETING_QUESED")
			);
			dialogRef.afterClosed().subscribe((res) => {
				if (res) {
					this.service.add(dataO).subscribe((res) => {
							if (res && res.status === 1) {
								// this.dialogRef.close(res);
								this.layoutUtilsService.showActionNotification(
									res.error.message,
									MessageType.Create,
									2000,
									true,
									false
								);
								return;
							} else {
								this.layoutUtilsService.showActionNotification(
									res.error.message,
									MessageType.Error,
									2000,
									true,
									false
								);
								return;
							}
						},
						(error) => {
							this.layoutUtilsService.showActionNotification(
								error.error.error.message,
								MessageType.Error,
								20000,
								true,
								false
							);
						}
					);
				}
				else
				{
					return;
				}
			});
		}
	}

	add_(dataO: SurveyListModel) {
		if (this.demsoluongfilepdf > 0)
		{
			const dialogRef = this.layoutUtilsService.deleteElement(
				this.translate.instant("MENU_MEETING.MEETING_SENDCA"),
				this.translate.instant(
					"MENU_MEETING.MEETING_SEND_YKIENLAICA"
				)
			);
			// dialogRef.afterClosed().subscribe((res) => {
			// 	if (res) {
			// 	const dialogReff = this.dialog.open(KySimDialogComponent, {
			// 		data: { IdKhaoSat: this.dataI.IdKhaoSat, data: this.filesToCA },
			// 		width: "50%",
			// 		height: "370px",
			// 	});
			// 	dialogReff.disableClose = true;
			// 	dialogReff.afterClosed().subscribe((res) => {
			// 		if (res) {
			// 		this.service.add(dataO).subscribe(
			// 			(res) => {
			// 				if (res && res.status == 1) {
			// 					this.dialogRef.close(res);
			// 					this.layoutUtilsService.showActionNotification(
			// 						res.error.message,
			// 						MessageType.Create,
			// 						2000,
			// 						true,
			// 						false
			// 					);
			// 				} else {
			// 					this.layoutUtilsService.showActionNotification(
			// 						res.error.message,
			// 						MessageType.Error,
			// 						2000,
			// 						true,
			// 						false
			// 					);
			// 				}
			// 			},
			// 			(error) => {
			// 				this.layoutUtilsService.showActionNotification(
			// 					error.error.error.message,
			// 					MessageType.Error,
			// 					20000,
			// 					true,
			// 					false
			// 				);
			// 			}
			// 		);}
			// 		else
			// 		{
			// 			return;
			// 		}
			// 	});
			// }
			// else
			// {
			// 	this.service.add(dataO).subscribe(
			// 		(res) => {
			// 			if (res && res.status == 1) {
			// 				this.dialogRef.close(res);
			// 				this.layoutUtilsService.showActionNotification(
			// 					res.error.message,
			// 					MessageType.Create,
			// 					2000,
			// 					true,
			// 					false
			// 				);
			// 			} else {
			// 				this.layoutUtilsService.showActionNotification(
			// 					res.error.message,
			// 					MessageType.Error,
			// 					2000,
			// 					true,
			// 					false
			// 				);
			// 			}
			// 		},
			// 		(error) => {
			// 			this.layoutUtilsService.showActionNotification(
			// 				error.error.error.message,
			// 				MessageType.Error,
			// 				20000,
			// 				true,
			// 				false
			// 			);
			// 		}
			// 	);
			// 		return;
			// 	}
			// });
		}
		else
		 {
			const dialogRef = this.layoutUtilsService.deleteElement(
				this.translate.instant("MENU_MEETING.MEETING_SEND"),
				this.translate.instant("MENU_MEETING.MEETING_QUESED")
			);
			dialogRef.afterClosed().subscribe((res) => {
				if (res) {
					this.service.add(dataO).subscribe(
						(res) => {
							if (res && res.status == 1) {
								// this.dialogRef.close(res);
								this.layoutUtilsService.showActionNotification(
									res.error.message,
									MessageType.Create,
									2000,
									true,
									false
								);
								return;
							} else {
								this.layoutUtilsService.showActionNotification(
									res.error.message,
									MessageType.Error,
									2000,
									true,
									false
								);
								return;
							}
						},
						(error) => {
							this.layoutUtilsService.showActionNotification(
								error.error.error.message,
								MessageType.Error,
								20000,
								true,
								false
							);
						}
					);
				}
				else
				{
					return;
				}
			});
		}
	}

	isChanges() {}
  isChangeoneoptionDif(value: any, i: number) {
		this.dataI.DanhSachCauHoi[i].Checked = value;
		let a;
		for (
			a = 0;
			a < this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length;
			a++
		) {
			this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[a].Checked = false;
		}
	}

	isChangeoneoption4(value: any, i: number, j: number) {
		this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Checked = value;
		this.dataI.DanhSachCauHoi[i].Checked = false;
		let a;
		for (
			a = 0;
			a < this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length;
			a++
		) {
			if (a != j)
				this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[a].Checked =
					false;
		}
	}
	isChangeoneoption(value: any, i: number, j: number) {
		this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Checked = value;
		let a;
		for (
			a = 0;
			a < this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length;
			a++
		) {
			if (a != j)
				this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[a].Checked =
					false;
		}
	}

	isChange(i, j) {
		if (j == 0) {
			if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[0].Checked) {
				this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[1].Checked =
					false;
			}
		} else {
			// == 1
			if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[1].Checked) {
				this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[0].Checked =
					false;
			}
		}
	}

	chooseSurveyList(idS, type) {
		// var objData = { Id: 0, IdS: 0 };
		// objData.Id = this.idM;
		// objData.IdS = idS;
		// const dialogRef = this.dialog.open(SurveyPhieuKhaoSatListComponent, {
		// 	data: { objData, type },
		// 	height: "100vh",
		// 	width: "80vw",
		// });
		// dialogRef.afterClosed().subscribe((res) => {
		// 	if (!res) {
		// 		return;
		// 	}
		// });
	}

	getTitle(condition): string {
		if (condition) {
			return this.translate.instant("QL_CUOCHOP.CUOCHOP.SURVEYON");
		}
		return this.translate.instant("QL_CUOCHOP.CUOCHOP.SURVEYOFF");
	}

	getColor(condition): string {
		if (condition) {
			return "#0eaf2a";
		}
		return "#ff7300";
	}

	getRandomColor() {
		var color = Math.floor(0x1000000 * Math.random()).toString(16);
		return "#" + ("000000" + color).slice(-6);
	}

	getRandomColor1() {
		return "#e3eb09";
	}

	getRandomColor2() {
		return "#33691E";
	}

	updatecolorChart(color) {
		this.chart.chart.config.options.legend.labels.fontColor = color;
		if (this.pieChartType != "pie") {
			this.chart.chart.config.options.scales.xAxes = [
				{
					display: true,
					ticks: {
						fontColor: color,
					},
				},
			];
			this.chart.chart.config.options.scales.yAxes = [
				{
					display: true,
					ticks: {
						beginAtZero: true,
						fontColor: color,
					},
				},
			];
		}
		this.chart.chart.update();
	}
	PrintChart() {
		let tmp = window.open();
		setTimeout(() => {
			let b64 = this.datasets.toBase64Image();

			let _html =
				"<html>" +
				"<head>" +
				"<style>" +
				"h4 {text-align: center;}" +
				"img.center { display: block; margin: 0 auto;}" +
				"</style>" +
				"</head>" +
				"<body >" +
				"<h4>" +
				this.translate.instant(
					"MENU_BIEUDOGIAMSAT.BDGS_BIEUDOTONGHOP"
				) +
				"</h4>" +
				'<img class="center" src="' +
				b64 +
				'" onload="window.print()" />' +
				"</body>" +
				"</html>";
			tmp.document.write(_html);
			// this.updatecolorChart(this.primary_color);
			setTimeout(() => {}, 500);
		}, 500);
	}
	DongForm() {
		// const dialogRef = this.layoutUtilsService.deleteElement(
		// 	this.translate.instant("COMMON.XACNHANDONG"),
		// 	this.translate.instant("COMMON.CLOSED")
		// );
		// dialogRef.afterClosed().subscribe((res) => {
		// 	if (!res) {
		// 		return;
		// 	}
		// 	this.dialogRef.close();
		// });
	}
	ExportWord() {
		var params = {
			IdMeeeting: this.idM,
			lstKhaoSat: this.dataI,
		};
		var request = new XMLHttpRequest();
		var salt = moment(
			new Date(
				this.now.getFullYear(),
				this.now.getMonth(),
				this.now.getDate()
			),
			"yyyyMMdd"
		);
		var link = environment.APIROOT + `/quanlycuochop/XuatWordKhaoSat`;
		request.open("POST", link, true);
		request.setRequestHeader(
			"Content-Type",
			"application/json;charset=UTF-8"
		);
		request.responseType = "arraybuffer";
		request.onload = function (e) {
			var file;
			let name = "";
			if (this.status == 200) {
				file = new Blob([this.response], {
					type: "application/msword",
				});
				name = "KhaoSatCuocHop_" + salt + ".doc";
			} else {
				file = new Blob([this.response], { type: "text/plain" });
				name = "ErrorsLog.txt";
			}
			// if (navigator.msSaveBlob) {
			// 	return navigator.msSaveBlob(file);
			// }

			var url = window.URL.createObjectURL(file);
			var df = document.getElementById("downloadFile");
			df.setAttribute("href", url);
			df.setAttribute("download", name);
			df.click();
			window.URL.revokeObjectURL(url);
		};
		request.send(JSON.stringify(params));
	}
	onSubmit() {
		let dataO = this.isObligate ? this.prepareData() : this.prepareData_();
		if (dataO) {
			if (dataO && this.type == 1) {
				this.isObligate ? this.add(dataO) : this.add_(dataO);
			} else if (dataO && this.type == 2) {
				this.isObligate ? this.update(dataO) : this.update_(dataO);
			}
			// this.isObligate ? this.add(dataO) : this.add_(dataO);
			// // this.add(dataO);
		} else {
			const mesWar = this.translate.instant(
				"QL_CUOCHOP.CUOCHOP.MESWAR"
			);
			this.layoutUtilsService.showActionNotification(
				mesWar,
				MessageType.Warning,
				2000,
				true,
				false
			);
		}
	}
	update(dataO: SurveyListModel) {
		if (this.demsoluongfilepdf > 0)
		{
			const dialogRef = this.layoutUtilsService.deleteElement(
				this.translate.instant("MENU_MEETING.MEETING_SENDCA"),
				this.translate.instant(
					"MENU_MEETING.MEETING_SEND_YKIENLAICA"
				)
			);
			// dialogRef.afterClosed().subscribe((res) => {
			// 	if (res) {
			// 	const dialogReff = this.dialog.open(KySimDialogComponent, {
			// 		data: { IdKhaoSat: this.dataI.IdKhaoSat, data: this.filesToCA },
			// 		width: "50%",
			// 		height: "370px",
			// 	});
			// 	dialogReff.disableClose = true;
			// 	dialogReff.afterClosed().subscribe((res) => {
			// 		if (res) {
			// 		this.service.updatekhaosat(dataO).subscribe(
			// 			(res) => {
			// 				if (res && res.status == 1) {
			// 					this.dialogRef.close(res);
			// 					this.layoutUtilsService.showActionNotification(
			// 						res.error.message,
			// 						MessageType.Create,
			// 						2000,
			// 						true,
			// 						false
			// 					);
			// 				} else {
			// 					this.layoutUtilsService.showActionNotification(
			// 						res.error.message,
			// 						MessageType.Error,
			// 						2000,
			// 						true,
			// 						false
			// 					);
			// 				}
			// 			},
			// 			(error) => {
			// 				this.layoutUtilsService.showActionNotification(
			// 					error.error.error.message,
			// 					MessageType.Error,
			// 					20000,
			// 					true,
			// 					false
			// 				);
			// 			}
			// 		);}
			// 		else
			// 		{
			// 			return;
			// 		}
			// 	});
			// }
			// else
			// {
			// 	this.service.updatekhaosat(dataO).subscribe(
			// 		(res) => {
			// 			if (res && res.status == 1) {
			// 				this.dialogRef.close(res);
			// 				this.layoutUtilsService.showActionNotification(
			// 					res.error.message,
			// 					MessageType.Create,
			// 					2000,
			// 					true,
			// 					false
			// 				);
			// 			} else {
			// 				this.layoutUtilsService.showActionNotification(
			// 					res.error.message,
			// 					MessageType.Error,
			// 					2000,
			// 					true,
			// 					false
			// 				);
			// 			}
			// 		},
			// 		(error) => {
			// 			this.layoutUtilsService.showActionNotification(
			// 				error.error.error.message,
			// 				MessageType.Error,
			// 				20000,
			// 				true,
			// 				false
			// 			);
			// 		}
			// 	);
			// 		return;
			// 	}
			// });
		}
		else
		 {
			const dialogRef = this.layoutUtilsService.deleteElement(
				this.translate.instant("MENU_MEETING.MEETING_SEND"),
				this.translate.instant(
					"MENU_MEETING.MEETING_SEND_YKIENLAI"
				)
			);
			dialogRef.afterClosed().subscribe((res) => {
				if (res) {
					this.service.updatekhaosat(dataO).subscribe(
						(res) => {
							if (res && res.status == 1) {
								// this.dialogRef.close(res);
								this.layoutUtilsService.showActionNotification(
									res.error.message,
									MessageType.Create,
									2000,
									true,
									false
								);
								return;
							} else {
								this.layoutUtilsService.showActionNotification(
									res.error.message,
									MessageType.Error,
									2000,
									true,
									false
								);
								return;
							}
						},
						(error) => {
							this.layoutUtilsService.showActionNotification(
								error.error.error.message,
								MessageType.Error,
								20000,
								true,
								false
							);
						}
					);
				}
				else
				{
					return;
				}
			});
		}
	}
	update_(dataO: SurveyListModel) {
		if (this.demsoluongfilepdf > 0)
		{
			const dialogRef = this.layoutUtilsService.deleteElement(
				this.translate.instant("MENU_MEETING.MEETING_SENDCA"),
				this.translate.instant(
					"MENU_MEETING.MEETING_SEND_YKIENLAICA"
				)
			);
			// dialogRef.afterClosed().subscribe((res) => {
			// 	if (res) {
			// 	const dialogReff = this.dialog.open(KySimDialogComponent, {
			// 		data: { IdKhaoSat: this.dataI.IdKhaoSat, data: this.filesToCA },
			// 		width: "50%",
			// 		height: "370px",
			// 	});
			// 	dialogReff.disableClose = true;

			// 	dialogReff.afterClosed().subscribe((res) => {
			// 		if (res) {
			// 		this.service.updatekhaosat(dataO).subscribe(
			// 			(res) => {
			// 				if (res && res.status == 1) {
			// 					this.dialogRef.close(res);
			// 					this.layoutUtilsService.showActionNotification(
			// 						res.error.message,
			// 						MessageType.Create,
			// 						2000,
			// 						true,
			// 						false
			// 					);
			// 				} else {
			// 					this.layoutUtilsService.showActionNotification(
			// 						res.error.message,
			// 						MessageType.Error,
			// 						2000,
			// 						true,
			// 						false
			// 					);
			// 				}
			// 			},
			// 			(error) => {
			// 				this.layoutUtilsService.showActionNotification(
			// 					error.error.error.message,
			// 					MessageType.Error,
			// 					20000,
			// 					true,
			// 					false
			// 				);
			// 			}
			// 		);}
			// 		else
			// 		{
			// 			return;
			// 		}
			// 	});
			// }
			// else
			// {
			// 	this.service.updatekhaosat(dataO).subscribe(
			// 		(res) => {
			// 			if (res && res.status == 1) {
			// 				this.dialogRef.close(res);
			// 				this.layoutUtilsService.showActionNotification(
			// 					res.error.message,
			// 					MessageType.Create,
			// 					2000,
			// 					true,
			// 					false
			// 				);
			// 			} else {
			// 				this.layoutUtilsService.showActionNotification(
			// 					res.error.message,
			// 					MessageType.Error,
			// 					2000,
			// 					true,
			// 					false
			// 				);
			// 			}
			// 		},
			// 		(error) => {
			// 			this.layoutUtilsService.showActionNotification(
			// 				error.error.error.message,
			// 				MessageType.Error,
			// 				20000,
			// 				true,
			// 				false
			// 			);
			// 		}
			// 	);
			// 		return;
			// 	}
			// });
		}
		else
		 {
			const dialogRef = this.layoutUtilsService.deleteElement(
				this.translate.instant("MENU_MEETING.MEETING_SEND"),
				this.translate.instant(
					"MENU_MEETING.MEETING_SEND_YKIENLAI"
				)
			);
			dialogRef.afterClosed().subscribe((res) => {
				if (res) {
					this.service.updatekhaosat(dataO).subscribe(
						(res) => {
							if (res && res.status == 1) {
								// this.dialogRef.close(res);
								this.layoutUtilsService.showActionNotification(
									res.error.message,
									MessageType.Create,
									2000,
									true,
									false
								);
								return;
							} else {
								this.layoutUtilsService.showActionNotification(
									res.error.message,
									MessageType.Error,
									2000,
									true,
									false
								);
								return;
							}
						},
						(error) => {
							this.layoutUtilsService.showActionNotification(
								error.error.error.message,
								MessageType.Error,
								20000,
								true,
								false
							);
						}
					);
				}
				else
				{
					return;
				}
			});
		}
	}
	chartKhaoSat(item: any) {
		//
		this.dem++;
		this.titlechart = item.NoiDungCauHoi;
		this.pieChartLabels = [];
		this.pieChartData = [];
		this.listLabels = [];
		this.pieChartColors[0].backgroundColor = [];
		this.datasets[0].data = [];
		var ArrColor: any[] = [];
		var ArrBorderColor: any[] = [];

		if (+item.DSCauTraLoi.length > 0) {
			for (var i = 0; i < item.DSCauTraLoi.length; i++) {
				this.pieChartLabels.push(
					"(" +
						item.DSCauTraLoi[i].NoiDungCauTraLoi +
						": " +
						item.DSCauTraLoi[i].SoLuong +
						")"
				);
				this.pieChartData.push(+item.DSCauTraLoi[i].SoLuong);
				this.listLabels.push(item.DSCauTraLoi[i].NoiDungCauTraLoi);
				ArrColor.push(this.getRandomColor());
				ArrBorderColor.push(this.primary_color);
			}
		}

		this.datasets[0].data = this.pieChartData;
		this.pieChartColors[0].backgroundColor = ArrColor;
		this.pieChartColors[0].borderColor = ArrBorderColor;
		this.changeDetectorRefs.detectChanges();

		if (this.pieChartType == "pie") {
			this.pieChartOptions.scales.yAxes = [
				{
					display: false,
				},
			];
			this.pieChartOptions.scales.xAxes = [
				{
					display: false,
				},
			];
		} else {
			this.pieChartOptions.scales.yAxes = [
				{
					display: true,
					ticks: {
						beginAtZero: true,
					},
				},
			];
		}
		if (this.chart && this.chart.chart) {
			this.chart.chart.data.datasets[0].borderWidth = 1;
			this.chart.chart.config.type = this.pieChartType;
			if (this.chart.chart.config.options.scales) {
				if (this.pieChartType == "pie") {
					this.chart.chart.config.options.scales.xAxes = [
						{
							display: false,
						},
					];
					this.chart.chart.config.options.scales.yAxes = [
						{
							display: false,
						},
					];
				} else {
					this.chart.chart.config.options.scales.xAxes = [
						{
							display: true,
							ticks: {
								fontColor: this.primary_color,
							},
						},
					];
					this.chart.chart.config.options.scales.yAxes = [
						{
							display: true,
							ticks: {
								beginAtZero: true,
								fontColor: this.primary_color,
							},
						},
					];
				}
			}
			//this.chart.chart.update();
		}
	}

	removeFile(index) {
		this.ListFileDinhKem[index].IsDel = true;
		this.changeDetectorRefs.detectChanges();
	}
	remove(index) {
		var name;
		name = this.files[index].data.filename;
		this.files.splice(index, 1);
		for (var i = 0; i < this.filesToCA.length; i++) {
			if (this.filesToCA[i].data && this.filesToCA[i].data.name == name) {
				this.filesToCA.splice(i, 1);
				this.demsoluongfilepdf -= 1;
			}
		}
		this.changeDetectorRefs.detectChanges();
	}
	new_row() {
		this.files.push({ data: {} });
		this.filesToCA.push({ data: {} });
	}

	selectFile(i) {
		let f = document.getElementById("FileUpLoad" + i);
		f.click();
	}

	FileChoose(evt: any, index) {
		evt.stopPropagation();
		if (evt.target.files && evt.target.files.length) {
			let file = evt.target.files[0];
			var condition_type = file.type.split("/")[0];
			var condition_name = file.name.split(".").pop();
			if (condition_type == "image") {
				if (file.size > environment.DungLuong) {
					var a = environment.DungLuong / 1048576;
					const message =
						this.translate.instant(
							"MODULE_FEEDBACK.FileError",
							{ file: this.file }
						) + ` ${a} MB.`;
					this.layoutUtilsService.showActionNotification(
						message,
						MessageType.Warning,
						10000,
						true,
						false
					);
					return;
				}
				condition_name = condition_name.toLowerCase();
				const index_ = this.ExtensionImg.findIndex(
					(ex) => ex === condition_name
				);
				if (index_ < 0) {
					const message =
						this.translate.instant(
							"MODULE_FEEDBACK.ChooseFileExtension",
							{ file: this.file }
						) + ` (.${this.strExtensionImg})`;
					this.layoutUtilsService.showActionNotification(
						message,
						MessageType.Warning,
						10000,
						true,
						false
					);
					return;
				}
			} else if (condition_type == "video") {
				if (file.size > environment.DungLuong) {
					var a = environment.DungLuong / 1048576;
					const message =
						this.translate.instant(
							"MODULE_FEEDBACK.FileError",
							{ file: this.file1 }
						) + ` ${a} MB.`;
					this.layoutUtilsService.showActionNotification(
						message,
						MessageType.Warning,
						10000,
						true,
						false
					);
					return;
				}
				condition_name = condition_name.toLowerCase();
				const index_ = this.ExtensionVideo.findIndex(
					(ex) => ex === condition_name
				);
				if (index_ < 0) {
					const message =
						this.translate.instant(
							"MODULE_FEEDBACK.ChooseFileExtension",
							{ file: this.file1 }
						) + ` (.${this.strExtensionVideo})`;
					this.layoutUtilsService.showActionNotification(
						message,
						MessageType.Warning,
						10000,
						true,
						false
					);
					return;
				}
			} else {
				if (file.size > environment.DungLuong) {
					var a = environment.DungLuong / 1048576;
					const message =
						this.translate.instant(
							"MODULE_FEEDBACK.FileError",
							{ file: this.file2 }
						) + ` ${a} MB.`;
					this.layoutUtilsService.showActionNotification(
						message,
						MessageType.Warning,
						10000,
						true,
						false
					);
					return;
				}
				condition_name = condition_name.toLowerCase();
				const index_ = this.ExtensionFile.findIndex(
					(ex) => ex === condition_name
				);
				if (index_ < 0) {
					const message =
						this.translate.instant(
							"MODULE_FEEDBACK.ChooseFileExtension",
							{ file: this.file2 }
						) + ` (.${this.strExtensionFile})`;
					this.layoutUtilsService.showActionNotification(
						message,
						MessageType.Warning,
						10000,
						true,
						false
					);
					return;
				}
			}
			var filename = `${evt.target.files[0].name}`;
			let extension = "";
			for (var i = 0; i < this.files.length; i++) {
				if (
					this.files[i].data &&
					this.files[i].data.filename == filename
				) {
					const message =
						`"${filename}" ` +
						this.translate.instant("MODULE_FEEDBACK.Added");
					this.layoutUtilsService.showActionNotification(
						message,
						MessageType.Update,
						10000,
						true,
						false
					);
					evt.target.value = "";
					return;
				}
			}
			let reader = new FileReader();
			reader.readAsDataURL(evt.target.files[0]);
			let base64Str;
			reader.onload = function () {
				base64Str = reader.result as String;
				let lengName = evt.target.files[0].name.split(".").length;
				extension = `.${
					evt.target.files[0].name.split(".")[lengName - 1]
				}`;
				var metaIdx = base64Str.indexOf(";base64,");
				base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
			};
			setTimeout((res) => {
				var _file: any = {};
				_file.strBase64 = base64Str;
				_file.filename = filename;
				_file.extension = extension;
				_file.type = evt.target.files[0].type.includes("image") ? 1 : 2;
				_file.isnew = true;
				this.files[index].data = _file;
				if ((_file.extension == ".pdf")) {
					//Dành cho phần ký
					this.filesToCA[index].data = file;
					this.demsoluongfilepdf++;
				}
				this.changeDetectorRefs.detectChanges();
			}, 1000);
		}
	}
}
