import { Component, ViewChild, ChangeDetectorRef, Renderer2, AfterViewInit, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction'; // for dateClick
import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';

import { QuanLyPhongHopInfoComponent } from './quan-ly-phong-hop-info/quan-ly-phong-hop-info.component';
import { QuanLyPhongHopDialogComponent } from './quan-ly-phong-hop-dialog/quan-ly-phong-hop-dialog.component';
import { QuanLyPhongHopGhiChuComponent } from './quan-ly-phong-hop-ghi-chu/quan-ly-phong-hop-ghi-chu.component';
import { DatPhongService } from '../Services/dat-phong.service';
import { LayoutUtilsService } from 'src/app/modules/crud/utils/layout-utils.service';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { TranslationService } from 'projects/jeeadmin/src/modules/i18n/translation.service';
import { locale as viLang } from 'projects/jeeadmin/src/modules/i18n/vocabs/vi';
import { JeeAdminService } from '../Services/jeeadmin.service';

export enum MessageType {
	Create,
	Read,
	Update,
	Delete
}
const moment = _rollupMoment || _moment;

@Component({
	selector: 'app-quan-ly-phong-hop',
	templateUrl: './quan-ly-phong-hop.component.html',
	styleUrls: ['./quan-ly-phong-hop.component.scss']
})

export class QuanLyPhongHopComponent {

	@ViewChild('calendar') calendarComponent: FullCalendarComponent; // the #calendar in the template
	@ViewChild('miniCalendar') miniCalendar: MatCalendar<Moment>;

	calendarLocale = 'vi';
	calendarVisible = true;
	calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin, listPlugin];
	calendarWeekends = true;// 
	calendarEvents: EventInput[] = [];

	minTime = "06:00";
	maxTime = "19:00";
	firstDay = 1;

	types = [
		{ checked: true, Id: -2, Title: 'Tất cả', class: ""},
		{ checked: false, Id: 0, Title: 'Đang chờ xác nhận', class: "loai0" },
		{ checked: false, Id: 1, Title: 'Đã đặt', class: "loai-1" },
		{ checked: false, Id: 2, Title: 'Đã hủy', class: "loai1" }
	]

	status = [
		{ checked: true, Id: 1, Title: 'Đã duyệt' },
		{ checked: true, Id: 0, Title: 'Chờ duyệt' },
	]

	calendarOptions: CalendarOptions = {
		initialView: 'dayGridMonth', // 'timeGridDay': tg ngày hiện tại, 'dayGridMonth': tháng, 'listWeek': lịch biểu
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

	eventTimeFormat = { // like '14:30:00'
		hour: '2-digit',
		minute: '2-digit',
		//second: '2-digit'
	}
	// THIS KEY WON'T WORK IN PRODUCTION!!!
	// To make your own Google API key, follow the directions here:
	// http://fullcalendar.io/docs/google_calendar/
	googleCalendarApiKey = 'AIzaSyDcnW6WejpTOCffshGDDb4neIrXVUA1EAE'
	events = {
		googleCalendarId: 'vi.vietnamese#holiday@group.v.calendar.google.com',
		className: 'loaikhac',
	}
	disabledEvents: any[] = [];
	// @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;
	ID_NV: string = '';
	Thang: string = '';
	Nam: string = '';
	LoaiLich: string = '';
	Visible: boolean = true;
	//======================================================
	TuNgay: string = '';
	DenNgay: string = '';
	filterPhong: string = '0';
	listPhongHop: any[] = [];
	filterTinhTrang: string = '';
	TitleCalendar:string = "";

	constructor(
		public dialog: MatDialog,
		private changeDetectorRef: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private translationService: TranslationService,
		private dungChungService: JeeAdminService,
		private dangKyPhongHopService: DatPhongService, 
		private activatedRoute: ActivatedRoute) {
			this.translationService.loadTranslations(
				viLang,
			);
			var langcode = localStorage.getItem('language');
			if (langcode == null)
				langcode = this.translate.getDefaultLang();
			this.translationService.setLanguage(langcode);
	}

	ngAfterViewInit() {
		this.dungChungService.GetListPhongHop().subscribe(res => {
			if (res.data.length > 0) {
				this.listPhongHop = res.data;
			}
			this.LoadDataDangKy();
			this.activatedRoute.params.subscribe(params => {
				const id = params['id'];
				if (id && id > 0) {
					this.dangKyPhongHopService.getDetailAdmin(id).subscribe(res => { 
						if (res.status == 1 && res.data) {
							let data = res.data
							let _item = {
								id: data.requestid,
								title: data.fullname + "\n" + data.title,
								start: data.start,
								end: data.end,
								extendedProps: {
									type: data.id,
									title: data.title,
									fullname: data.fullname,
									department: data.department,
									property: data.property,
									status: data.id,
									isedit: data.isedit,
									isdel: data.isdel,
									subscriberid: data.subscriberid,
									departmentid: data.departmentid,
									propertyid: data.propertyid,
									createddate: data.createddate
								},		
							}
							const dialogRef = this.dialog.open(QuanLyPhongHopInfoComponent, { disableClose: true,
 								data: { _item }, panelClass: ['sky-padding-0'], width: '50%' });
							dialogRef.afterClosed().subscribe(res => {
								if (!res) {
									return;
								}
								this.LoadDataDangKy();
							})
						}
						else {
							let msg = "Đăng ký không tồn tại !"
							this.layoutUtilsService.showActionNotification(msg, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
						}
					})
				}
			});
			this.changeDetectorRef.detectChanges();
		});
	}
	
	getColor(loai): string{
		let mau = ""
		switch(loai) {
			case 1:
				mau = "#e8c374"
				break
			case 0:
				mau = "#9699a2"
				break
			case 2:
				mau = "rgb(255, 118, 118)"
				break
		}
		return mau
	}

	navLinkDayClick = function (date) {
		let str = moment(date).format("YYYY-MM-DD");
		let calendarApi = this.calendarComponent.getApi();
		calendarApi.changeView("timeGridDay");
		calendarApi.gotoDate(str); // call a method on the Calendar object
	}

	handleDateClick(arg) {
		for (var i = 0; i < this.disabledEvents.length; i++) {
			if (arg.start >= moment(this.disabledEvents[i].start).toDate() && arg.end <= moment(this.disabledEvents[i].end).toDate()) {
				return;
			}
		}

		let saveMessageTranslateParam = this.translate.instant('COMMON.themthanhcong');
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = MessageType.Create;
		let _item = {};
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
		const dialogRef = this.dialog.open(QuanLyPhongHopDialogComponent, { disableClose: true,
			data: { _item, _hinhthuc: '0', _RoomID: this.filterPhong }, panelClass: ['sky-padding-0'], width: '50%' });
		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				this.LoadDataDangKy();
				this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
			} else {
				this.LoadDataDangKy();
			}
		});
	}

	async datesRender(event) {
		this.TitleCalendar = moment(event.view.activeStart).date() + " - " + moment(event.view.activeEnd - 1).date() + " THG " + (event.view.activeEnd.getMonth() + 1) +", " + moment(event.view.activeEnd).year();
		this.TuNgay = event.view.activeStart.getDate() + "/" + (event.view.activeStart.getMonth() + 1) + "/" + event.view.activeStart.getFullYear();
		this.DenNgay = event.view.activeEnd.getDate() + "/" + (event.view.activeEnd.getMonth() + 1) + "/" + event.view.activeEnd.getFullYear();
		this.LoadDataDangKy();
	}

	filter(item) {
		this.types.forEach(x=> {
			if(x.Id != item.Id)
			 	x.checked = false
		})
		if(item.checked) {
			this.filterTinhTrang = item.Id
			if(item.Id == -2) {
				this.filterTinhTrang = ''
			}
		}
			
		this.LoadDataDangKy();
	}

	filterLoad = function () {
		let calendarApi = this.calendarComponent.getApi();
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
		}
	}

	eventRender = function (event) {
		var __item = event.event;
		// if(__item.extendedProps.fullname != '')
		// {  
		//     event.el.find("fc-title").append("<br/><b>"+__item.extendedProps.fullname+"</b>");
		// }
		this.renderer.listen(event.el, 'contextmenu', ($event) => {
			this.onContextMenu($event, __item);
		});
	}
	
	/** Delete */
	deleteItem(_item) {
		let _name = this.translate.instant("Hủy đăng ký tài sản")
		let _type = ''
		const _title: string = this.translate.instant("OBJECT.XACNHAN.TITLE", { name: _name });
		const _description: string = this.translate.instant("OBJECT.XACNHAN.DESCRIPTION", { type: _type, name: _name });
		const _waitDesciption: string = this.translate.instant("OBJECT.XACNHAN.WAIT_DESCRIPTION", { name: _name });
		const _checkMessage = this.translate.instant("datphonghop.huythanhcong");

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const dialogRef = this.dialog.open(QuanLyPhongHopGhiChuComponent, { disableClose: true,
				data: { _item }, panelClass: ['sky-padding-0'], width: '50%' });
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}
				else {
					this.layoutUtilsService.showActionNotification(_checkMessage, MessageType.Update, 4000, true, false, 3000, 'top', 0);
					this.LoadDataDangKy();
				}
			});
		});
	}
	//========================================================================================================================
	LoadDataDangKy() {
		const queryParams = new QueryParamsModel(
			this.filterConfigurationDK(),
		);
		this.dangKyPhongHopService.getDataQuanLy(queryParams).subscribe(res => {
			this.calendarEvents = [];
			if (res && res.status == 1 && res.data != null) {
				this.Visible = res.Visible;
				res.data.map((item, index) => {
					var mau = '', lop = "";
					if (item.id == 0) {
						lop = "loai0"
						mau = '#9699a2'
					} else if (item.id == 1) {
						lop = "loai-1"
						mau = '#e8c374'
					} else {
						lop = "loai1"
						mau = 'rgb(255, 118, 118)'
					}
					this.calendarEvents.push({
						id: item.requestid,
						title: item.fullname + "\n" + item.title,
						start: item.start,
						end: item.end,
						extendedProps: {
							type: item.id,
							title: item.title,
							fullname: item.fullname,
							department: item.department,
							property: item.property,
							status: item.id,
							isedit: item.isedit,
							subscriberid: item.subscriberid,
							departmentid: item.departmentid,
							propertyid: item.propertyid,
							createddate: item.createddate
						},
						classNames: [lop],
						color: mau,

					});
				})
				let calendarApi = this.calendarComponent.getApi();
				calendarApi.removeAllEventSources();
				calendarApi.addEventSource(this.calendarEvents);
				// this.filterLoad();
			} else {
				let calendarApi = this.calendarComponent.getApi();
				calendarApi.removeAllEventSources();
				// this.filterLoad();
			}
		});
	}

	filterConfigurationDK(): any {
		const filter: any = {};
		if (this.filterPhong != '0') {
			filter.RoomID = this.filterPhong;
		}
		if (this.filterTinhTrang !== '') {
			filter.StatusID = this.filterTinhTrang;
		}
		filter.TuNgay = this.TuNgay;
		filter.DenNgay = this.DenNgay;
		return filter;
	}

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

	//============================================================
	getHeightCalendar(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 232;
		return tmp_height;
	}
	//=============================================================
	selectAllow(el) {
		let now = new Date();
		if (el.start > now) {
			const diffTime = Math.abs(el.end - el.start);
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			if (diffDays > 1) {
				return false;
			}
			return true;
		}
		return false;
	};
	//==============================================================
	eventClick(info) {
		if (info.event.url) {
			info.jsEvent.preventDefault();
			return;
		}

		let _item = info.event;
		const dialogRef = this.dialog.open(QuanLyPhongHopInfoComponent, { disableClose: true,
 			data: { _item}, panelClass: ['sky-padding-0'], width: '50%' });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			} 
			this.LoadDataDangKy();
		})
		info.jsEvent.preventDefault();
	}

	//======================================================================
	Before() {
		let calendarApi = this.calendarComponent.getApi();
		calendarApi.prev();
	}

	Next() {
		let calendarApi = this.calendarComponent.getApi();
		calendarApi.next();
	}
}
