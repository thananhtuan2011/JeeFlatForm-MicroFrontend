//https://fullcalendar.io/docs
//https://www.npmjs.com/package/ngx-contextmenu
import { Component, ViewChild, ChangeDetectorRef, Renderer2, AfterViewInit, HostListener, OnInit } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { Moment } from 'moment';
import * as _moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { DangKyDialogComponent } from './dang-ky/dang-ky.dialog.component';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { Subscription } from 'rxjs';
// import { LoaiTaskEditDialogComponent } from './loai-task-edit/loai-task-edit.dialog.component';
import { CalendarService } from './services/tasks.service';
import { MatCalendar } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { QueryParamsModel } from '../../models/query-models/query-params.model';
import { NghiPhepInfoComponent } from './nghi-phep-info/nghi-phep-info.component';
import { OvertimeRegistrationInfoComponent } from './Overtime-registration-info/Overtime-registration-info.component';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { LayoutUtilsService } from 'projects/jeehr/src/modules/crud/utils/layout-utils.service';
import { environment } from 'projects/jeehr/src/environments/environment';
import { TranslationService } from "projects/jeehr/src/modules/i18n/translation.service";
import { locale as viLang } from '../../../../../src/modules/i18n/vocabs/vi';
export enum MessageType {
	Create,
	Read,
	Update,
	Delete
}
const moment = _moment;

@Component({
	selector: 'm-calendar',
	templateUrl: './calendar.component.html',
	// styleUrls: ['./calendar.component.scss']
})
export class LichDangKyComponent {

	@ViewChild('calendar', { static: true }) calendar: FullCalendarComponent; // the #calendar in the template
	@ViewChild('miniCalendar', { static: true }) miniCalendar: MatCalendar<Moment>;

	calendarOptions: CalendarOptions = {
		initialView: 'dayGridMonth',
		nowIndicator: true,
		navLinks: false,
		selectMirror: true,
		allDayText: 'Cả ngày',
		selectable: true,
		locale: 'vi',
		eventTimeFormat: {
			hour: '2-digit',
			minute: '2-digit',
		},
		headerToolbar: {
			left: 'prev,next today',
			center: 'title',
			right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
		},
		buttonText: {
			today: 'Hôm nay',
			month: 'Tháng',
			week: 'Tuần',
			day: 'Ngày',
			list: 'Lịch biểu'
		},
		weekends: true,
		// height: this.getHeightCalendar(),
		firstDay: 1,
		datesSet: this.datesRender.bind(this),
		select: this.handleDateClick.bind(this),
		eventClick: this.eventClick.bind(this),
	};

	calendarEvents: EventInput[] = [

	];
	calendarTasks: EventInput[] = [
	];

	types = [];

	typeworks = [

	];

	status = [
		{ checked: true, Id: 1, Title: 'Đã duyệt' },
		{ checked: true, Id: 0, Title: 'Chờ duyệt' },
	]

	types_khac = [
		{ checked: true, Id: 4, Title: 'Ngày lễ ở công ty', class: "loaikhac" },
	]

	disabledEvents: any[] = [];
	ID_NV: string = '';
	Thang: string = '';
	Nam: string = '';
	LoaiLich: string = '';

	Visible: boolean = true;
	//==============================Sử dụng cho task===================================
	@ViewChild('sidenav', { static: false }) sidenav: MatSidenav;
	taskTypes = []
	tasksNew: any[] = [];
	tasksSuccess: any[] = [];
	Loai: '0';
	disabledBtn: boolean = false;
	orderBy: string = 'Sort';
	order: string = 'desc';
	subs = new Subscription();
	//=======================================================================================
	LoaiHinh: number;
	CustemerID: number = 0;
	listCapCoCau: any[] = [];
	filter_capcocau: string = "0";
	//=====================================================================================
	calendarJeeWWEvents: EventInput[] = [
	];
	isgov: boolean = false;
	listAppCode = [];
	//=======================Bổ sung load sử dụng tài sản======================
	typeMeet = [
	];
	calendarJeeMeetEvents: any[] = [
	];
	constructor(
		public dialog: MatDialog,
		private changeDetectorRef: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private calendarService: CalendarService,
		private danhMucService: DanhMucChungService,
		private router: Router,
		private translationService: TranslationService,
        private translate: TranslateService,
	) {
		this.translationService.loadTranslations(
            viLang,
        );
        var langcode = localStorage.getItem('language');
        if (langcode == null)
            langcode = this.translate.getDefaultLang();
        this.translationService.setLanguage(langcode);
	}

	ngAfterViewInit() {
		this.ID_NV = localStorage.getItem('staffID');
		this.Loai = '0';
		const roles: any = JSON.parse(localStorage.getItem('appCode'));
		this.listAppCode = roles;
		this.loadDataCapCoCau();
	}

	ngOnInit() {
		this.loadTaskTypes();
	}

	onRightClick(event: any, item: any) {
		this.onContextMenu(event, item);
	}

	public onContextMenu($event: MouseEvent, item: any): void {
		if ((item.extendedProps && item.extendedProps.statusid == 1) || item.id == "4" || +item.extendedProps.ID_NV != +this.ID_NV) { return; }
		this.deleteItem(item);
		$event.preventDefault();
		$event.stopPropagation();
	}

	gotoDate(date) {
		let str = moment(date).format("YYYY-MM-DD");
		let calendarApi = this.calendar.getApi();
		calendarApi.gotoDate(str); // call a method on the Calendar object
		let tmp_thang = date.month() + 1;
		this.Thang = tmp_thang;
		this.ngAfterViewInit();
	}
	navLinkDayClick = function (date) {
		let str = moment(date).format("YYYY-MM-DD");
		let calendarApi = this.calendar.getApi();
		calendarApi.changeView("timeGridDay");
		calendarApi.gotoDate(str); // call a method on the Calendar object
	}
	handleDateClick(arg) {
		let dem = 0;
		for (var i = 0; i < this.types.length; i++) {
			if (this.types[i].checked == false) {
				dem++;
			}
		}
		for (var i = 0; i < this.typeworks.length; i++) {
			if (this.typeworks[i].checked == false && this.typeworks[i].Id == 41) {
				dem++;
			}
		}
		if (dem == 3) {
			let message = 'Vui lòng chọn loại lịch';
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			return;
		}
		//Kiểm tra trong disabled evetns
		for (var i = 0; i < this.disabledEvents.length; i++) {
			if (arg.start >= moment(this.disabledEvents[i].start).toDate() && arg.end <= moment(this.disabledEvents[i].end).toDate()) {
				return;
			}
		}

		let saveMessageTranslateParam = this.translate.instant('landingpagekey.themthanhcong');
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = MessageType.Create;
		let _item = {};
		if (this.LoaiLich == "dayGridMonth") {
			var dt = new Date(arg.end);
			dt.setDate(dt.getDate() - 1);
			let tungay = arg.start;
			let denngay = dt;
			this.calendarService.Get_ThoiGian(this.f_convertDate(tungay), this.f_convertDate(denngay)).subscribe(res => {
				if (res && res.status == 1) {
					_item = {
						id: 0,
						title: '',
						start: arg.start,
						end: dt,
						allDay: arg.allDay,
						extendedProps: {
							numberofdays: '',
							formid: '',
							statusid: 0,
							requestid: 0,
							reason: '',
							tugio: res.TuGio,
							dengio: res.DenGio,
							tugiotc: res.TuGioTC,
						},
					}
				} else {
					_item = {
						id: 0,
						title: '',
						start: arg.start,
						end: dt,
						allDay: arg.allDay,
						extendedProps: {
							numberofdays: '',
							formid: '',
							statusid: 0,
							requestid: 0,
							reason: '',
							tugio: '',
							dengio: '',
							tugiotc: '',
						},
					}
				}
				let dataLoaiLich = [];
				for (var i = 0; i < this.types.length; i++) {
					dataLoaiLich.push(this.types[i]);
				}
				for (var i = 0; i < this.typeworks.length; i++) {
					dataLoaiLich.push(this.typeworks[i]);
				}
				const dialogRef = this.dialog.open(DangKyDialogComponent, {
					data: { _item, _loailich: dataLoaiLich, _hinhthuc: '0', _type: this.LoaiLich, _isshipper: res.IsShipper, _isvienChuc: res.IsvienChuc, _CustemerID: this.CustemerID, _isgov: this.isgov },
					panelClass: ['sky-padding-0', 'width900'],
					disableClose: true
				});
				dialogRef.afterClosed().subscribe(res => {

					if (res) {
						this.ngAfterViewInit();
						this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
					} else {
						this.ngAfterViewInit();
					}
				});
			})
		} else {
			let tungay = arg.start;
			let denngay = arg.end;
			this.calendarService.Get_ThoiGian(this.f_convertDate(tungay), this.f_convertDate(denngay)).subscribe(res => {
				if (res && res.status == 1) {
					_item = {
						id: 0,
						title: '',
						start: arg.start,
						end: arg.end,
						allDay: arg.allDay,
						extendedProps: {
							numberofdays: '',
							formid: '',
							statusid: 0,
							requestid: 0,
							reason: '',
						},
					}
				} else {
					_item = {
						id: 0,
						title: '',
						start: arg.start,
						end: arg.end,
						allDay: arg.allDay,
						extendedProps: {
							numberofdays: '',
							formid: '',
							statusid: 0,
							requestid: 0,
							reason: '',
						},
					}
				}
				let dataLoaiLich = [];
				for (var i = 0; i < this.types.length; i++) {
					dataLoaiLich.push(this.types[i]);
				}
				for (var i = 0; i < this.typeworks.length; i++) {
					dataLoaiLich.push(this.typeworks[i]);
				}
				const dialogRef = this.dialog.open(DangKyDialogComponent, {
					data: { _item, _loailich: dataLoaiLich, _hinhthuc: '0', _type: this.LoaiLich, _isshipper: res.IsShipper, _isvienChuc: res.IsvienChuc, _CustemerID: this.CustemerID, _isgov: this.isgov },
					panelClass: ['sky-padding-0', 'width900'],
					disableClose: true,
				});
				dialogRef.afterClosed().subscribe(res => {

					if (res) {
						this.loadTaskByType();
						this.ngAfterViewInit();
						this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
					} else {
						this.loadTaskByType();
						this.ngAfterViewInit();
					}
				});
			});
		}
	}
	datesRender(event) {
		this.LoaiLich = event.view.type;
		this.miniCalendar._goToDateInView(moment(event.view.currentStart), 'month');
		let tmp_thang = event.view.currentStart.getMonth() + 1;
		this.Thang = tmp_thang;
		let tmp_nam = event.view.currentStart.getFullYear();
		this.Nam = tmp_nam;
		//=====Bổ sung sử dụng Meeting=========
		this.TuNgay = ("0" + (event.view.activeStart.getDate())).slice(-2) + "/" + ("0" + ((event.view.activeStart.getMonth() + 1))).slice(-2) + "/" + event.view.activeStart.getFullYear();
		this.DenNgay = ("0" + (event.view.activeEnd.getDate())).slice(-2) + "/" + ("0" + ((event.view.activeEnd.getMonth() + 1))).slice(-2) + "/" + event.view.activeEnd.getFullYear();
		this.ngAfterViewInit();
	}
	filter = function (item, khac = false) {
		let calendarApi = this.calendar.getApi();
		let allEvents = calendarApi.getEvents();
		for (var i = 0; i < allEvents.length; i++) {
			let event = allEvents[i];

			if (item.Id == event.extendedProps.type) {
				let arr = ["loai" + item.Id];
				for (var j = 0; j < this.status.length; j++) {
					if (!item.checked) {
						arr.push("hideEvent");
					} else {
						if (!this.status[j].checked && this.status[j].Id == event.extendedProps.statusid) {
							arr.push("hideEvent");
						}
					}
					if (event.extendedProps.status == 1) {
						arr.push("task-success");
					}
					var _event = calendarApi.getEventById(event.id);
					_event.setProp('classNames', arr);
				}

			}
		}
	}
	filterwork = function (item) {
		this.calendarJeeWWEvents = [];
		this.LoadDataCongViec();
		this.calendarJeeMeetEvents = [];
		if (this.typeMeet[0].checked) {
			this.LoadDataMeet();
		}
	}
	filterStatus = function (item) {
		let calendarApi = this.calendar.getApi();
		let allEvents = calendarApi.getEvents();
		for (var i = 0; i < allEvents.length; i++) {
			let event = allEvents[i];
			if (item.Id == event.extendedProps.statusid) {
				let arr = ["loai" + event.extendedProps.type];
				for (var j = 0; j < this.types.length; j++) {
					if (!item.checked) {
						arr.push("hideEvent");
					} else {
						if (!this.types[j].checked && this.types[j].Id == event.extendedProps.type) {
							arr.push("hideEvent");
						}
					}
					var _event = calendarApi.getEventById(event.id);
					_event.setProp('classNames', arr);
				}
			}
		}
	}
	filterLoad = function () {
		let calendarApi = this.calendar.getApi();
		let allEvents = calendarApi.getEvents();
		for (var i = 0; i < allEvents.length; i++) {
			let event = allEvents[i];
			for (var j = 0; j < this.types.length; j++) {
				let arr = ["loai" + this.types[j].Id];
				if (this.types[j].Id == event.extendedProps.type && !this.types[j].checked) {
					arr.push("hideEvent");
					var _event = calendarApi.getEventById(event.id);
					_event.setProp('classNames', arr);
				}
			}
			for (var k = 0; k < this.status.length; k++) {
				let arr = [];
				if (this.status[k].Id == event.extendedProps.statusid && !this.status[k].checked) {
					arr.push("hideEvent");
					var _event = calendarApi.getEventById(event.id);
					_event.setProp('classNames', arr);
				}
			}
		}
	}
	eventClick(info) {
		let _item = info.event;
		if (info.event.url) {
			info.jsEvent.preventDefault();
			return;
		}
		if (_item.extendedProps.type == 11 || _item.extendedProps.type == 12) {//Loại phép 
			if (this.LoaiHinh == 1) {
				if (+_item.extendedProps.ID_NV == +this.ID_NV) {
					const dialogRef = this.dialog.open(NghiPhepInfoComponent, { data: { _item: { ID_Row: _item.extendedProps.requestid } }, panelClass: ['sky-padding-0', 'width70'] });
					dialogRef.afterClosed().subscribe(res => {
						if (!res) {
							return;
						}
					});
				}
			} else {
				if (+_item.extendedProps.ID_NV == +this.ID_NV) {
					// const dialogRef = this.dialog.open(NghiPhepCBCCInfoComponent, { data: { _item: { ID_Row: _item.extendedProps.requestid } }, panelClass: ['mat-dialog-popup', 'with70'] });
					// dialogRef.afterClosed().subscribe(res => {
					// 	if (!res) {
					// 		return;
					// 	}
					// });
				}
			}
		} else if (_item.extendedProps.type == 2) {//tăng ca (type = 2)
			if (+_item.extendedProps.ID_NV == +this.ID_NV) {
				const dialogRef = this.dialog.open(OvertimeRegistrationInfoComponent, { data: { _item: { RowID: _item.extendedProps.requestid } }, panelClass: ['sky-padding-0', 'width70'] });
				dialogRef.afterClosed().subscribe(res => {
					if (!res) {
						return;
					}
				});
			}
		} else if (_item.extendedProps.type == 51) {// Lịch họp
			// this.router.navigateByUrl(
			// 	`Meeting/${_item.id}?Type=${_item.extendedProps.typeMeet}`
			// );
		}
		else {//Công việc jeework và jeeworkflow
			if (_item.extendedProps.type == "4") {
				this.router.navigate(['', { outlets: { auxName: 'auxWork/DetailsGOV/' + _item.id }, }]);
			}
		}
		info.jsEvent.preventDefault();
	}
	eventClickTask = function (info) {
		let _item = info;
		let saveMessageTranslateParam = this.translate.instant('landingpagekey.capnhatthanhcong');
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = MessageType.Update;
		const dialogRef = this.dialog.open(DangKyDialogComponent, { data: { _item, _hinhthuc: '1', _loailich: _item.extendedProps.type, _CustemerID: this.CustemerID }, panelClass: 'sky-padding-0' });
		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				if (!res.isDeleted) {
					this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
					const queryParam = new QueryParamsModel({}, '', '', 1, 10, true)
					this.calendarService.findData(queryParam).subscribe(res => {
						this.calendarTasks = [];
						if (res) {
							this.calendarTasks = res.data;
							this.changeDetectorRef.detectChanges();
						}
					});
					this.LoadDataDangKy();
					this.loadTaskByType();
				} else {
					this.deleteItem(_item);
				}
			} else {
			}
		})
	}

	/** Delete */
	deleteItem(_item) {
		const _title = this.translate.instant('landingpagekey.xoa');
		const _description = this.translate.instant('landingpagekey.bancochacchanmuonxoakhong');
		const _waitDesciption = this.translate.instant('landingpagekey.dulieudangduocxoa');
		const _deleteMessage = this.translate.instant('landingpagekey.xoathanhcong');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			if (_item.extendedProps.type == 1) {
				let LangCode = localStorage.getItem('language');
			} else if (_item.extendedProps.type == 2) {
				let LangCode = localStorage.getItem('language');
			} else if (_item.extendedProps.type == 3) {
			} else {
				this.calendarService.DeleteItem(_item.id).subscribe(re => {
					if (re && re.status == 1) {
						this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false);
						this.loadTaskByType();
					} else {
						this.layoutUtilsService.showActionNotification(re.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
						return;
					}
					this.ngAfterViewInit();
				})
			}



		});
	}
	//========================================================================================================================

	filterConfiguration(): any {
		const filter: any = {};
		filter.IDNV = this.ID_NV;
		filter.Thang = this.Thang;
		filter.Nam = this.Nam;
		return filter;
	}
	//========================================================================================================================
	async loadDataCapCoCau() {
		this.danhMucService.GetListDanhMuc_CapCoCau().subscribe(res => {
			if (res && res.status == 1) {
				this.listCapCoCau = res.data;
				this.changeDetectorRef.detectChanges();
			}
		})
		if (this.listAppCode.length > 0) {
			let obj = this.listAppCode.find(x => x == environment.APPCODE_JEEHR)
			if (obj && +this.ID_NV > 0) {
				await this.LoadDataDangKy();
			}
			let obj_ww = this.listAppCode.find(x => x == environment.APPCODE_JEEWORK);
			if (obj_ww) {
				this.typeworks = [];
				this.typeworks.push(
					{ checked: true, Id: 41, Title: 'Việc tôi làm', class: "loai41", color: "#3699FF" },
					{ checked: false, Id: 42, Title: 'Việc tôi giao', class: "loai41", color: "#3699FF" },
					{ checked: false, Id: 43, Title: 'Việc tôi theo dõi', class: "loai41", color: "#3699FF" }
				)
				await this.LoadDataCongViec();
			}
			let obj_ad = this.listAppCode.find(x => x == environment.APPCODE_JEEMEETING);
			if (obj_ad) {
				this.typeMeet = [];
				this.typeMeet.push(
					{ checked: true, Id: 5, Title: 'Lịch họp', class: "loai51", color: "#9900cc" },
				)
				await this.LoadDataMeet();
			}
		}

	}
	LoadDataDangKy() {
		const queryParams = new QueryParamsModel(
			this.filterConfigurationDK(),
		);
		this.calendarService.findDataCalendar(queryParams).subscribe(res => {
			if (res && res.status == 1 && res.data.length > 0) {
				this.calendarEvents = [];
				this.Visible = res.Visible;
				this.CustemerID = res.CustemerID;
				this.LoaiHinh = res.LoaiHinh;
				if (this.LoaiHinh == 1) {
					this.types = [];
					this.types.push(
						{ checked: true, Id: 11, Title: 'Lịch nghỉ phép', class: "loai11" },
						{ checked: true, Id: 2, Title: 'Lịch tăng ca', class: "loai2" }
					)
				} else {
					this.types = [];
					this.types.push(
						{ checked: true, Id: 12, Title: 'Lịch nghỉ phép', class: "loai12" },
						{ checked: true, Id: 2, Title: 'Lịch tăng ca', class: "loai2" }
					)
				}
				this.changeDetectorRef.detectChanges();
				res.data.map((item, index) => {
					if (item.id == 11 || item.id == 12) {
						this.calendarEvents.push({
							id: item.requestid,
							title: item.title,
							start: item.start,
							end: item.end,
							extendedProps: {
								type: item.id,
								numberofdays: item.numberofdays,
								formid: item.formid,
								statusid: item.statusid,
								requestid: item.requestid,
								reason: item.reason,
								IsNghiDiDuLich: item.IsNghiDiDuLich,
								DiaDiem: item.DiaDiem,
								ID_NV: item.id_nv,
							},
							classNames: ["loai1" + this.LoaiHinh],
							color: '#FFA800',

						});
					} else if (item.id == 2) {
						this.calendarEvents.push({
							id: item.requestid,
							title: item.title,
							start: item.start,
							end: item.end,
							extendedProps: {
								type: item.id,
								numberofdays: item.numberofdays,
								formid: item.formid,
								statusid: item.statusid,
								requestid: item.requestid,
								reason: item.reason,
								projectid: item.projectid,
								overtime: item.overtime,
								isfixhours: item.isfixhours,
								ID_NV: item.id_nv,
							},
							classNames: ["loai2"],
							color: '#1BC5BD',

						});
					} else {
						this.calendarEvents.push({
							id: item.id,
							title: item.title,
							start: item.start,
							end: item.end,
							allDay: true,
							classNames: ["loaikhac"],
							// color: 'red',

						});
					}

				})
				let calendarApi = this.calendar.getApi();
				calendarApi.removeAllEventSources();
				calendarApi.addEventSource(this.calendarEvents);
				calendarApi.addEventSource(this.calendarJeeWWEvents);
				calendarApi.addEventSource(this.calendarJeeMeetEvents);
				this.filterLoad();
			} else {
				let calendarApi = this.calendar.getApi();
				calendarApi.removeAllEventSources();
				calendarApi.addEventSource(this.calendarJeeWWEvents);
				calendarApi.addEventSource(this.calendarJeeMeetEvents);
				this.filterLoad();
			}
		});
	}

	filterConfigurationDK(): any {
		const filter: any = {};
		filter.IDNV = this.ID_NV;
		filter.Thang = this.Thang;
		filter.Nam = this.Nam;
		filter.LoaiLich = this.filter_capcocau;
		return filter;
	}

	LoadDataCongViec() {
		const queryParams = new QueryParamsModel(
			this.filterConfigurationWork(),
		);
		this.calendarService.findDataJeeWork(queryParams).subscribe(res => {
			this.calendarJeeWWEvents = [];
			this.isgov = res.isgov;
			if (res && res.status == 1 && res.data.length > 0) {
				res.data.map((item, index) => {
					this.calendarJeeWWEvents.push({
						id: item.id_row,
						title: item.title,
						start: item.start != null ? item.start + '+00:00' : '',
						end: item.deadline != null ? item.deadline + '+00:00' : '',
						classNames: ["loai41"],//Công việc tôi làm
						color: '#3699FF',
						extendedProps: {
							type: "4",//Công việc liên quan jeework
						},

					});
				})
				let calendarApi = this.calendar.getApi();
				calendarApi.removeAllEventSources();
				calendarApi.addEventSource(this.calendarJeeWWEvents);
				calendarApi.addEventSource(this.calendarEvents);
				calendarApi.addEventSource(this.calendarJeeMeetEvents);
				this.filterLoad();
			} else {
				let calendarApi = this.calendar.getApi();
				calendarApi.removeAllEventSources();
				calendarApi.addEventSource(this.calendarJeeWWEvents);
				calendarApi.addEventSource(this.calendarEvents);
				calendarApi.addEventSource(this.calendarJeeMeetEvents);
				this.filterLoad();
			}
		});
	}


	filterConfigurationWork(): any {
		const filter: any = {};
		filter.TuNgay = this.TuNgay;
		filter.DenNgay = this.DenNgay;
		if (this.typeworks[0].checked) {
			filter.forme = "1";
		}
		if (this.typeworks[1].checked) {
			filter.assign = "2"
		}
		if (this.typeworks[2].checked) {
			filter.following = "3";
		}
		return filter;
	}
	//============================================================================
	f_convertDate(v: any) {
		if (v != "" && v != null) {
			let a = new Date(v);
			return ("0" + (a.getDate())).slice(-2) + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + a.getFullYear();
		}
	}
	//===============================================Sử dụng theo Task==============================================
	toggleSidenav() {
		this.sidenav.toggle()
		this.changeDetectorRef.detectChanges();
	}
	//#region task
	loadTaskByType() {
		const queryParam = new QueryParamsModel(
			{
				Loai: this.Loai
			}, this.order, this.orderBy, 1, 10, true)
		this.calendarService.findData(queryParam).subscribe(res => {
			if (res) {
				if (!res.data)
					res.data = [];
				this.tasksNew = res.data.filter(x => x.extendedProps.status == 0);
				this.tasksSuccess = res.data.filter(x => x.extendedProps.status == 1);
				this.changeDetectorRef.detectChanges();
			}
		});
	}
	initCreateTask() {
		let _item = {
			id: 0,
			title: '',
			detail: '',
			type: this.Loai,
			start: null,
			allDay: true,
			extendedProps: {
				type: 0, detail: '', taskType: ''
			},
			classNames: ["loai0"]
		}
		this.disabledBtn = true;
		this.calendarService.CreateItem(_item).subscribe(res => {
			this.disabledBtn = false;
			if (res && res.status) {
				_item.id = res.data.id;
				_item.extendedProps.taskType = '' + this.Loai;
				this.tasksNew.unshift(_item);
				this.changeDetectorRef.detectChanges();
				let ele = document.getElementById(_item.id.toString());
				if (ele)
					(<HTMLElement>ele).focus();
			}
		})
	}

	updateItem(_item) {
		_item.id_row = _item.id;
		_item.Type = this.Loai;
		this.disabledBtn = true;
		this.calendarService.UpdateItem(_item).subscribe(res => {
			this.disabledBtn = false;
			if (res && res.status) {
				this.changeDetectorRef.detectChanges();
			}
		})
	}
	deleteEventsByType(status) {
		let calendarApi = this.calendar.getApi();
		let events = calendarApi.getEvents();
		for (var i = 0; i < events.length; i++) {
			if (events[i].extendedProps.taskType == this.Loai && events[i].extendedProps.status == status)
				events[i].remove();
		}
	}

	changeStatus(_item, status) {
		if (status == 1 && !_item.title) {
			this.deleteItem(_item);
			return;
		}
		_item.id_row = _item.id;
		_item.Type = _item.extendedProps.taskType;
		_item.status = status;
		let saveMessageTranslateParam = this.translate.instant('landingpagekey.capnhatthanhcong');
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = MessageType.Update;
		this.calendarService.ChangeStatusTask(_item).subscribe(re => {
			if (re && re.status == 1) {
				this.loadTaskByType();
				let calendarApi = this.calendar.getApi();
				let e: any = calendarApi.getEventById(_item.id);
				let cls = ["loai0"];
				if (status == 1)
					cls.push("task-success");
				e.setProp("classNames", cls);
				this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
			} else {
				this.layoutUtilsService.showActionNotification(re.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		})
	}
	//#endregion


	//#region task type
	loadTaskTypes() {
		this.calendarService.getTypes().subscribe(res => {
			if (res && res.data) {
				this.taskTypes = res.data;
				this.changeDetectorRef.detectChanges();
			}
		});
	}
	initCreateType(loai = '0') {
		let _item = { Id: 0 };
		if (+loai > 0) {
			for (var i = 0; i < this.taskTypes.length; i++) {
				if (this.taskTypes[i].Id == +loai)
					_item = this.taskTypes[i]
			}
		}
		// const dialogRef = this.dialog.open(LoaiTaskEditDialogComponent, { data: { _item }, panelClass: 'mat-dialog-popup' });
		// dialogRef.afterClosed().subscribe(res => {
		// 	this.loadTaskTypes();
		// })
	}
	xoaType(id) {
		const _title = this.translate.instant('landingpagekey.xoa');
		const _description = this.translate.instant('landingpagekey.bancochacchanmuonxoakhong');
		const _waitDesciption = this.translate.instant('landingpagekey.dulieudangduocxoa');
		const _deleteMessage = this.translate.instant('landingpagekey.xoathanhcong');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			//this.viewLoading = true;
			this.calendarService.DeleteType(id).subscribe(re => {
				if (re && re.status == 1) {
					this.deleteEventsByType(0);
					this.loadTaskTypes();
					this.Loai = '0';
					this.loadTaskByType();
					this.changeDetectorRef.detectChanges();
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false);
				} else {
					this.layoutUtilsService.showActionNotification(re.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}
			})
		});
	}
	xoaHoanThanh(id) {
		const _title = this.translate.instant('landingpagekey.xoa');
		const _description = this.translate.instant('landingpagekey.bancochacchanmuonxoakhong');
		const _waitDesciption = this.translate.instant('landingpagekey.dulieudangduocxoa');
		const _deleteMessage = this.translate.instant('landingpagekey.xoathanhcong');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.calendarService.DeleteSuccess(id).subscribe(re => {
				if (re && re.status == 1) {
					this.loadTaskTypes();
					this.loadTaskByType()
					this.deleteEventsByType(1);
					this.ngAfterViewInit();
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false);
				} else {
					this.layoutUtilsService.showActionNotification(re.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				}
			})
		});
	}
	//#endregion
	//#region khác
	formatDate(item: any) {
		let v = item.start;
		if (!v)
			return v;
		let t = moment(v).format("HH:mm")
		t = (t != "00:00") ? (", " + t) : "";
		let str = moment(v).format("DD/MM/YYYY");
		if (str == moment().format("DD/MM/YYYY"))
			return "Hôm nay" + t;
		if (str == moment(new Date()).add(1, 'days').format("DD/MM/YYYY"))
			return "Ngày mai" + t;
		if (str == moment(new Date()).add(-1, 'days').format("DD/MM/YYYY"))
			return "Hôm qua";
		return moment(v) < moment() ? str : str + t;
	}
	sort(loai) {
		if (loai == 1) {
			this.orderBy = "Sort";
			this.order = "desc";
		} else {
			this.orderBy = "Start";
			this.order = "asc";
		}
		this.loadTaskByType();
	}

	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím ctrl + Enter
		{
			this.initCreateTask();
		}
	}

	//============================================================
	getHeightCalendar(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight;
		return tmp_height;
	}
	//============================================================
	ChangeLoaiLich(val) {
		this.filter_capcocau = val.value;
		if (+this.filter_capcocau > 0) {
			this.calendarJeeWWEvents = [];
			this.typeworks = [];
		} else {
			this.typeworks = [];
			this.typeworks.push(
				{ checked: true, Id: 41, Title: 'Việc tôi làm', class: "loai41", color: "#3699FF" },
				{ checked: false, Id: 42, Title: 'Việc tôi giao', class: "loai41", color: "#3699FF" },
				{ checked: false, Id: 43, Title: 'Việc tôi theo dõi', class: "loai41", color: "#3699FF" }
			)
			this.LoadDataCongViec();
		}
		this.LoadDataDangKy();
	}

	//===================================Bổ sung load data meeting=================
	TuNgay: string;
	DenNgay: string;
	LoadDataMeet() {
		const queryParams = new QueryParamsModel(
			this.filterConfigurationMeet(),
		);
		this.calendarService.findDataJeeMeet(queryParams).subscribe(res => {
			this.calendarJeeMeetEvents = [];
			if (res && res.status == 1 && res.data.length > 0) {
				res.data.map((item, index) => {
					this.calendarJeeMeetEvents.push({
						id: item.id_row,
						title: item.title,
						start: item.start,
						end: item.end,
						classNames: ["loai51"],
						color: '#9900cc',
						extendedProps: {
							type: 51,
							typeMeet: item.type - 1,//1:Tôi tạo 2:Tôi tham gia
							meetid: item.id_row,
						},
					});
				})
				let calendarApi = this.calendar.getApi();
				calendarApi.removeAllEventSources();
				calendarApi.addEventSource(this.calendarJeeWWEvents);
				calendarApi.addEventSource(this.calendarEvents);
				calendarApi.addEventSource(this.calendarJeeMeetEvents);
				this.filterLoad();
			} else {
				let calendarApi = this.calendar.getApi();
				calendarApi.removeAllEventSources();
				calendarApi.addEventSource(this.calendarJeeWWEvents);
				calendarApi.addEventSource(this.calendarEvents);
				calendarApi.addEventSource(this.calendarJeeMeetEvents);
				this.filterLoad();
			}
		});
	}


	filterConfigurationMeet(): any {
		const filter: any = {};
		filter.TuNgay = this.TuNgay;
		filter.DenNgay = this.DenNgay;
		return filter;
	}

	filtermeet = function (item) {
		this.calendarJeeWWEvents = [];
		this.LoadDataCongViec();
		this.calendarJeeMeetEvents = [];
		if (this.typeMeet[0].checked) {
			this.LoadDataMeet();
		}
	}
}
