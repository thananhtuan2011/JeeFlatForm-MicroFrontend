import { environment } from './../../../../../../environments/environment';
import { Observable } from "rxjs";
// State
import {
	Component,
	Inject,
	OnInit,
	ViewChild,
	ChangeDetectorRef,
	ChangeDetectionStrategy,
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
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SurveyListModel } from '../../../_models/quan-ly-cuoc-hop.model';
import { QuanLyCuocHopService } from '../../../_services/quan-ly-cuoc-hop.service';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
@Component({
	selector: "app-survey-list",
	templateUrl: "./survey-list.component.html",
	styleUrls: ["./survey-list.component.css"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyListComponent implements OnInit {
	// Public properties
	@ViewChild(BaseChartDirective, { static: true })
	public chart: BaseChartDirective;
	dataI: any;
	check: boolean = false;
	title: string = "";
	titlechart: string = "";
	type: number = 1;
	idM: number = 0;
	idS: number = 0;
	dem: number = 0;
	listData: any[] = [];
	isNull: boolean = false;
	domain = environment.APIROOT;
	listLabels: any[] = [];
	public now = new Date();
	R: any = {};
	// Pie
	pieChartLegend = true;
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
				label: function (tooltipItem, data): string | string[] {
					let label = data.labels[tooltipItem.index];
					let value = data.datasets[0].data[tooltipItem.index];
					// let label = data.labels[tooltipItems.index];
					// let value = data.datasets[0].data[tooltipItems.index];
					// return label + ' (' + value + ')';
					return label.toString();
				}
			}
		}
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
	isObligate: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<SurveyListComponent>,
		private translate: TranslateService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private service: QuanLyCuocHopService,
		private changeDetectorRefs: ChangeDetectorRef,
		public fb: FormBuilder
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

	//	this.GetRolesCurrentUser();
		this.dem = 0;
		if (this.data.objData.IdS) {
			this.idS = this.data.objData.IdS;
		}
		this.type = this.data.type;
		this.idM = this.data.objData.Id;
		// this.isObligate = this.data.isObligate ? this.data.isObligate : false;

		if (this.idM > 0 && this.type == 1) {
			this.service.getSurveyList(this.idM).subscribe((res:any) => {
				if (res && res.data) {
					this.dataI = res.data;
					this.isObligate = res.data.IsBatBuoc ? res.data.IsBatBuoc : false
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
							}
							else if (this.dataI.DanhSachCauHoi[i].Type == 1) {
								this.dataI.DanhSachCauHoi[i]["GhiChu"] = "";
							}
							else if (this.dataI.DanhSachCauHoi[i].Type == 2) {
								if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length > 0)
								{
									let lA = this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length,j;
									for (j = 0; j < lA; j++) {
										this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j]["Checked"]=false;
									}
								}
							}
							else if (this.dataI.DanhSachCauHoi[i].Type == 4) {
								this.dataI.DanhSachCauHoi[i]["GhiChu"] = "";
								this.dataI.DanhSachCauHoi[i]["Checked"] = false;
								if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length > 0)
								{
									let lA = this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length,j;
									for (j = 0; j < lA; j++) {
										this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j]["Checked"]=false;
									}
								}
							}
							else if (this.dataI.DanhSachCauHoi[i].Type == 5) {
								let listAns = [
									{
										CauTraLoi: this.translate.instant("QL_CUOCHOP.LEVEL1"),
										Checked: false,
										Point:5,
									},
									{
										CauTraLoi: this.translate.instant("QL_CUOCHOP.LEVEL2"),
										Checked: false,
										Point:4,
									},
									{
										CauTraLoi: this.translate.instant("QL_CUOCHOP.LEVEL3"),
										Checked: false,
										Point:3,
									},
									{
										CauTraLoi: this.translate.instant("QL_CUOCHOP.LEVEL4"),
										Checked: false,
										Point:2,
									},
									{
										CauTraLoi: this.translate.instant("QL_CUOCHOP.LEVEL5"),
										Checked: false,
										Point:1,
									},
								];
								this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi = listAns;
							}
							else {
								// == 6
								let listAns = [
									{
										IdCauTraLoi:
                    this.dataI.DanhSachCauHoi[i].NoiDungCauHoi +
                    this.dataI.DanhSachCauHoi[i].Id +
                    i+"1",
										CauTraLoi: this.translate.instant(
											"QL_CUOCHOP.CUOCHOP.ANSWERYES"
										),
										Checked: false,
									},
									{
										IdCauTraLoi:
                    this.dataI.DanhSachCauHoi[i].NoiDungCauHoi +
										this.dataI.DanhSachCauHoi[i].Id +i+"0",
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
			})
		}
		else if (this.idM > 0 && this.type == 2) {
			//
			// this.chartKhaoSat();
			this.service
				.getResultSurveyList(this.idM, this.idS)
				.subscribe((res) => {
					if (res && res.data) {
						this.dataI = res.data;
						this.title = this.dataI.TieuDe ? this.dataI.TieuDe : "";
					}
					this.changeDetectorRefs.detectChanges();
				});
		} else if (this.idM > 0 && this.type == 3) {
			this.service.getSurveyLists(this.idM).subscribe((res) => {
				if (res && res.data) {
					this.dataI = res.data;
				}
				this.changeDetectorRefs.detectChanges();
			});
		}
	}

	onSubmit() {
		let dataO = this.isObligate ? this.prepareData() : this.prepareData_();
		if (dataO) {
			this.isObligate ? this.add(dataO) : this.add_(dataO);
			// this.add(dataO);
		} else {
			const mesWar = this.translate.instant(
				"QL_CUOCHOP.CUOCHOP.MESWAR"
			);
			this.layoutUtilsService.showActionNotification(
				mesWar,
				MessageType.Create,
				2000,
				true,
				false
			);
		}
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
				}
				else if (this.dataI.DanhSachCauHoi[i].Type == 1) {
						let _data: any = {};
						_data.Id = this.dataI.DanhSachCauHoi[i].Id;
						_data.KetQua = 0;
						_data.IdCauTraLoi = 0;
						_data.GhiChu = this.dataI.DanhSachCauHoi[i].GhiChu;
						_data.IdCauTraLois = [];

						let check = /\S/.test(_data.GhiChu);
						if (!_data.GhiChu||_data.GhiChu==""|| !check) {
							return;
						}

						_dataO.DanhSachKetQua.push(_data);
				}
				else if (this.dataI.DanhSachCauHoi[i].Type == 2)
				{
					if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length >0)
					{
						let lA =this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length,j;
						let _data: any = {};
						_data.Id = this.dataI.DanhSachCauHoi[i].Id;
						_data.KetQua = 0;
						_data.IdCauTraLoi = 0;
						_data.GhiChu = "";
						_data.IdCauTraLois = [];
						for (j = 0; j < lA; j++) {
							if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Checked) {
								_data.IdCauTraLoi=this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].IdCauTraLoi;
								break;
							}
						}
						if (_data.IdCauTraLoi == 0) {
							return;
						}
						_dataO.DanhSachKetQua.push(_data);
					}
				}
				else if (this.dataI.DanhSachCauHoi[i].Type == 4)
				{
					if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length >0)
					{
						let lA =this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length,j;
						let _data: any = {};
						_data.Id = this.dataI.DanhSachCauHoi[i].Id;
						_data.KetQua = 0;
						_data.IdCauTraLoi = 0;
						_data.GhiChu = "";
						_data.IdCauTraLois = [];
						if(this.dataI.DanhSachCauHoi[i].Checked)
						{
							_data.GhiChu =this.dataI.DanhSachCauHoi[i].GhiChu;

							let check = /\S/.test(_data.GhiChu);
							if (!_data.GhiChu || !check) {
								return;
							}
						}
						else
						{
							for (j = 0; j < lA; j++) {
								if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Checked) {
									_data.IdCauTraLoi=this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].IdCauTraLoi;
									break;
								}
							}
							if (_data.IdCauTraLoi == 0) {
								return;
							}
						}
						_dataO.DanhSachKetQua.push(_data);
					}
				}
				else if (this.dataI.DanhSachCauHoi[i].Type == 5)
				{
						let lA =this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length,j;
						let len = _dataO.DanhSachKetQua.length;
						let _data: any = {};
						for (j = 0; j < lA; j++) {
							_data = {};
							if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Checked) {
								_data.Id = this.dataI.DanhSachCauHoi[i].Id;
								_data.KetQua = this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Point;
								_data.IdCauTraLoi = 0;
								_data.GhiChu ="";
								_data.IdCauTraLois = [];
								_dataO.DanhSachKetQua.push(_data);
								break;
							}
						}
						if (_dataO.DanhSachKetQua.length == len) {
							return;
						}
				}
				else {
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
						for (j = 0; j < lA; j++)
						{
							_data = {};
							if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Checked) {
								_data.Id = this.dataI.DanhSachCauHoi[i].Id;
								_data.KetQua = j == 0 ? 1 : 0;
								_data.IdCauTraLoi = 0;
								_data.GhiChu =this.dataI.DanhSachCauHoi[i].GhiChu;
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
				}
				else if (this.dataI.DanhSachCauHoi[i].Type == 1) {
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
						}
						else {
							_dataO.DanhSachKetQua.push(_data);
						}

				}
				else if (this.dataI.DanhSachCauHoi[i].Type == 2)
				{
					if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length >0)
					{
						let lA =this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length,j;
						let _data: any = {};
						_data.Id = this.dataI.DanhSachCauHoi[i].Id;
						_data.KetQua = 0;
						_data.IdCauTraLoi = 0;
						_data.GhiChu = "";
						_data.IdCauTraLois = [];
						for (j = 0; j < lA; j++) {
							if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Checked) {
								_data.IdCauTraLoi=this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].IdCauTraLoi;
								_dataO.DanhSachKetQua.push(_data);
								break;
							}
						}
						// if (_data.IdCauTraLoi == 0) {
						// 	return;
						// }
					}
				}
				else if (this.dataI.DanhSachCauHoi[i].Type == 4)
				{
					if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi &&this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length >0)
					{
						let lA =this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length,j;
						let _data: any = {};
						_data.Id = this.dataI.DanhSachCauHoi[i].Id;
						_data.KetQua = 0;
						_data.IdCauTraLoi = 0;
						_data.GhiChu = "";
						_data.IdCauTraLois = [];
						if(this.dataI.DanhSachCauHoi[i].Checked)
						{
							_data.GhiChu =this.dataI.DanhSachCauHoi[i].GhiChu;
							let check = /\S/.test(_data.GhiChu);
							if (!_data.GhiChu || !check) {
								continue
							}
							else {
								_dataO.DanhSachKetQua.push(_data);
							}
						}
						else
						{
							for (j = 0; j < lA; j++) {
								if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Checked) {
									_data.IdCauTraLoi=this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].IdCauTraLoi;
									_dataO.DanhSachKetQua.push(_data);
									break;
								}
							}
							// if (_data.IdCauTraLoi == 0) {
							// 	return;
							// }
						}
					}
				}
				else if (this.dataI.DanhSachCauHoi[i].Type == 5)
				{
						let lA =this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length,j;
						// let len = _dataO.DanhSachKetQua.length;
						let _data: any = {};
						for (j = 0; j < lA; j++) {
							_data = {};
							if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Checked) {
								_data.Id = this.dataI.DanhSachCauHoi[i].Id;
								_data.KetQua = this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Point;
								_data.IdCauTraLoi = 0;
								_data.GhiChu ="";
								_data.IdCauTraLois = [];
								_dataO.DanhSachKetQua.push(_data);
								break;
							}
						}
						// if (_dataO.DanhSachKetQua.length == len) {
						// 	return;
						// }
				}
				else {
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
							_data.GhiChu =this.dataI.DanhSachCauHoi[i].GhiChu;
							_data.IdCauTraLois = [];
							_data.KetQua = 999;
							if (this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Checked) {
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

		return _dataO;

	}

	close() {
		this.dialogRef.close();
	}
	printCanvas()
	{
		var canvas = document.getElementById("chartpie") as HTMLCanvasElement;
		var img    = canvas.toDataURL();

		let tmp = window.open();
			// this.updatecolorChart("#141414");
			setTimeout(() => {

				let _html = '<html>' +
					'<head>' +
					'<style>' +
					'h4 {text-align: center;}' +
					'img.center { display: block; margin: 0 auto;}' +
					'</style>' +
					'</head>' +
					'<body >' +
					'<h4>' + this.translate.instant('QL_CUOCHOP.CUOCHOP.SURVEYTABLERESULTCHART')+'&nbsp'+this.titlechart + '</h4>' +
					'<img class="center" src="' + img + '" onload="window.print()" />' +
					'</body>' +
					'</html>';
				tmp.document.write(_html);
				// this.updatecolorChart(this.primary_color);
				// setTimeout(() => {
				// 	this.updatecolorChart(this.primary_color);
				// }, 500);
			}, 500);

	}
	add(dataO: SurveyListModel) {

			const dialogRef = this.layoutUtilsService.deleteElement("Gửi khảo sát"
			,"Khảo sát sẽ được gửi đi. Bạn đồng ý gửi hay không?");
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}
				this.service.add(dataO).subscribe((res) => {
						if (res && res.status == 1) {
							this.dialogRef.close(res);
							this.layoutUtilsService.showActionNotification(
								res.error.message,
								MessageType.Create,
								2000,
								true,
								false
							);
						} else {
							this.layoutUtilsService.showActionNotification(
								res.error.message,
								MessageType.Error,
								2000,
								true,
								false
							);
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
			});



		// const dialogRef = this.layoutUtilsService.deleteElement_close(this.translate.instant('MENU_MEETING.MEETING_SEND')
		// , this.translate.instant('MENU_MEETING.MEETING_QUESED'));
		// dialogRef.afterClosed().subscribe(res => {
		// 	if (!res) {
		// 		return;
		// 	}
		// 	this.service.add(dataO).subscribe((res) => {
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
		// 					MessageType.Create,
		// 					2000,
		// 					true,
		// 					false
		// 				);
		// 			}
		// 		},
		// 		(error) => {
		// 			this.layoutUtilsService.showActionNotification(
		// 				error.error.error.message,
		// 				MessageType.Create,
		// 				20000,
		// 				true,
		// 				false
		// 			);
		// 		}
		// 	);
		// });

	}


	add_(dataO: SurveyListModel) {
		this.service.add(dataO).subscribe((res) => {
			if (res && res.status == 1) {
				this.dialogRef.close(res);
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Create,
					2000,
					true,
					false
				);
			} else {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Create,
					2000,
					true,
					false
				);
			}
		},
		(error) => {
			this.layoutUtilsService.showActionNotification(
				error.error.error.message,
				MessageType.Create,
				20000,
				true,
				false
			);
		}
		);

	}

	isChanges() {}
	isChangeoneoptionDif(value:any,i:number) {

		this.dataI.DanhSachCauHoi[i].Checked =value;
		let a;
		for (a = 0; a < this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length; a++)
		{
				this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[a].Checked =false;
		}
	}

	isChangeoneoption4(value:any,i:number,j:number) {

		this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Checked =value;
		this.dataI.DanhSachCauHoi[i].Checked =false;
		let a;
		for (a = 0; a < this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length; a++)
		{
			if(a!=j)
				this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[a].Checked =false;
		}
	}
	isChangeoneoption(value:any,i:number,j:number) {
		this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[j].Checked =value;
		let a;
		for (a = 0; a < this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi.length; a++)
		{
			if(a!=j)
				this.dataI.DanhSachCauHoi[i].DanhSachCauTraLoi[a].Checked =false;
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
		var objData = { Id: 0, IdS: 0 };
		objData.Id = this.idM;
		objData.IdS = idS;
		const dialogRef = this.dialog.open(SurveyListComponent, {
			data: { objData, type },
			height: "100vh",
			width: "50vw",
		});
		dialogRef.afterClosed().subscribe((res) => {
			if (!res) {
				return;
			}
		});
	}
	xemListFile() {

		// var Id=this.idS;
		// const dialogRef = this.dialog.open(DanhSachFileDinhkemCuaTungNguoiThamGiaComponent, {
		// 	data: {Id},
		// 	width: "700px",
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
	GetRolesCurrentUser() {
		// this.R = this.TokenStorage.getUserRoleObject();


		return this.R;
	}
	getRandomColor1() {
		return "#e3eb09";
	}

	getRandomColor2() {
		return "#33691E";
	}
	// ExportWord(){
	// 	var params = {
	// 		IdMeeeting: this.idM,
	// 		lstKhaoSat: this.dataI
	// 	}
	// 	var request = new XMLHttpRequest();
	// 	var salt =moment( new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()), "yyyyMMdd");
	// 	var link = environment.apiUrl + `/quanlycuochop/XuatWordKhaoSat`;
	// 	request.open("POST", link, true);
	// 	request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
	// 	request.responseType = "arraybuffer";
	// 	request.onload = function (e) {
	// 		var file;
	// 		let name = "";
	// 		if (this.status == 200) {
	// 			file = new Blob([this.response], { type: 'application/msword' });
	// 			name = "KhaoSatCuocHop_" + salt + ".doc";
	// 		} else {
	// 			file = new Blob([this.response], { type: 'text/plain' });
	// 			name = "ErrorsLog.txt";
	// 		}
	// 		// if (navigator.msSaveBlob) {
	// 		// 	return navigator.msSaveBlob(file);
	// 		// }

	// 		var url = window.URL.createObjectURL(file);
	// 		var df = document.getElementById("downloadFile");
	// 		df.setAttribute("href", url);
	// 		df.setAttribute("download", name);
	// 		df.click();
	// 		window.URL.revokeObjectURL(url);
	// 	}
	// 	request.send(JSON.stringify(params));
	// }
	ExportWord(){

		var params = {
			IdMeeeting: this.idM,
	 		lstKhaoSat: this.dataI
		}
			this.service.ExportWord(params).subscribe(res => {
			if (res && res.status == 1) {
				const linkSource = `data:application/octet-stream;base64,${res.data}`;
				const downloadLink = document.createElement("a");
				const fileName = res.data_FileName;
				downloadLink.href = linkSource;
				downloadLink.download = fileName;
				downloadLink.click();
			}
			else
				this.layoutUtilsService.showInfo(this.translate.instant('GeneralKey.ERROREXPORTFILE'));
		});
	}
	ExportWordKetQuaKhaoSat(item:any){
		var params = {
			IdMeeeting: this.idM,
			IdBangKhaoSat: item,
			lstKhaoSat: this.dataI
		}
		this.service.XuatWordKetQuaKhaoSat(params).subscribe(res => {
			if (res && res.status == 1) {
				const linkSource = `data:application/octet-stream;base64,${res.data}`;
				const downloadLink = document.createElement("a");
				const fileName = res.data_FileName;
				downloadLink.href = linkSource;
				downloadLink.download = fileName;
				downloadLink.click();
			}
			else
				this.layoutUtilsService.showInfo(this.translate.instant('GeneralKey.ERROREXPORTFILE'));
		});
		// var request = new XMLHttpRequest();
		// var salt =moment( new Date(this.now.getFullYear(), this.now.getMonth(), this.now.getDate()), "yyyyMMdd");
		// var link = environment.apiUrl + `/quanlycuochop/XuatWordKetQuaKhaoSat`;
		// request.open("POST", link, true);
		// request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
		// request.responseType = "arraybuffer";
		// request.onload = function (e) {
		// 	var file;
		// 	let name = "";
		// 	if (this.status == 200) {
		// 		file = new Blob([this.response], { type: 'application/msword' });
		// 		name = "KetQuaKhaoSatCuocHop_" + salt + ".docx";
		// 	} else {
		// 		file = new Blob([this.response], { type: 'text/plain' });
		// 		name = "ErrorsLog.txt";
		// 	}
		// 	// if (navigator.msSaveBlob) {
		// 	// 	return navigator.msSaveBlob(file);
		// 	// }

		// 	var url = window.URL.createObjectURL(file);
		// 	var df = document.getElementById("downloadFileword");
		// 	df.setAttribute("href", url);
		// 	df.setAttribute("download", name);
		// 	df.click();
		// 	window.URL.revokeObjectURL(url);
		// }
		// request.send(JSON.stringify(params));
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

				let _html = '<html>' +
					'<head>' +
					'<style>' +
					'h4 {text-align: center;}' +
					'img.center { display: block; margin: 0 auto;}' +
					'</style>' +
					'</head>' +
					'<body >' +
					'<h4>' + this.translate.instant('MENU_BIEUDOGIAMSAT.BDGS_BIEUDOTONGHOP') + '</h4>' +
					'<img class="center" src="' + b64 + '" onload="window.print()" />' +
					'</body>' +
					'</html>';
				tmp.document.write(_html);
				// this.updatecolorChart(this.primary_color);
				setTimeout(() => {
				}, 500);
			}, 500);
	}


	chartKhaoSat(item:any) {
		//
		this.dem++;
		this.titlechart=item.NoiDungCauHoi;
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
			this.pieChartOptions.scales.yAxes = [{
				display: false
			}]
			this.pieChartOptions.scales.xAxes = [{
				display: false
			}]
		}
		else {
			this.pieChartOptions.scales.yAxes = [{
				display: true,
				ticks: {
					beginAtZero: true
				}
			}]
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
	getStringFromHtml(text:String) {
		return	text.replace(/\r?\n|\r/g, '<br/>')
	}
}
