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
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { LayoutUtilsService } from 'projects/jeeadmin/src/modules/crud/utils/layout-utils.service';

import { DatPhongService } from '../Services/dat-phong.service';
import { DangKyPhongHopDialogComponent } from './dang-ky-phong-hop-dialog/dang-ky-phong-hop-dialog.component';
import { GhiChuPhongHopEditComponent } from './ghi-chu-edit/ghi-chu-edit.component';
import { DanhSachPhongHuyListComponent } from './danh-sach-phong-huy-list/danh-sach-phong-huy-list.component';
import { DangKyPhongHopInfoComponent } from './dang-ky-phong-hop-info/dang-ky-phong-hop-info.component';
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
	selector: 'app-dang-ky-phong-hop',
	templateUrl: './dang-ky-phong-hop.component.html',
	styleUrls: ['./dang-ky-phong-hop.component.scss']
})

export class DangKyPhongHopComponent {

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
		// { checked: true, Id: -1, Title: 'Đã đặt', class: "loai-1", style:"{'color':'#e8c374'}" },
		{ checked: false, Id: 0, Title: 'Đang chờ xác nhận', class: "loai0", style: "{'color':'#9699a2'}" },
		{ checked: false, Id: 1, Title: 'Đã được xác nhận', class: "loai1" , style: "{'color':'#74baf0'}"}
	]

	status = [
		{ checked: true, Id: 1, Title: 'Đã duyệt' },
		{ checked: true, Id: 0, Title: 'Chờ duyệt' },
	]

	calendarOptions: CalendarOptions = {
		initialView: 'listWeek', // 'timeGridDay': tg ngày hiện tại, 'dayGridMonth': tháng, 'listWeek': lịch biểu
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
				//this.filterPhong = '' + res.data[0].RowID;
			}
			this.LoadDataDangKy();
			this.activatedRoute.params.subscribe(params => {
				const id = params['id'];
				if (id && id > 0) {
					this.dangKyPhongHopService.getDetail(id).subscribe(res => { 
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
									createddate: data.createddate
								},		
							}
							const dialogRef = this.dialog.open(DangKyPhongHopInfoComponent, { data: { _item }, panelClass: ['sky-padding-0'], width: '50%' });
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
				mau = "#74baf0"
				break
			case 0:
				mau = "#9699a2"
				break
			case -1:
				mau = "#e8c374"
				break
		}
		return mau
	}

	// public onContextMenu($event: MouseEvent, item: any): void {
	// 	if (item.url || item.extendedProps.type == -1) { return; }
	// 	this.contextMenuService.show.next({
	// 		// Optional - if unspecified, all context menu components will open
	// 		contextMenu: this.basicMenu,
	// 		event: $event,
	// 		item: item,
	// 	});
	// 	$event.preventDefault();
	// 	$event.stopPropagation();
	// }

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
		// if(moment(arg.end).format("DD/MM/YYYY") != moment(arg.start).format("DD/MM/YYYY")){
		// 	let message = "Khoảng thời gian không hợp lệ";
		// 	this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
		// 	return;
		// }
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
		const dialogRef = this.dialog.open(DangKyPhongHopDialogComponent, { data: { _item, _hinhthuc: '0', _RoomID: this.filterPhong }, panelClass: ['sky-padding-0'], width: '50%' });
		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				this.LoadDataDangKy();
				this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
				//this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false, 3000, 'top', 0)
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
		if (item.checked) {
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
			const dialogRef = this.dialog.open(GhiChuPhongHopEditComponent, { data: { _item }, panelClass: ['sky-padding-0'], width: '50%' });
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
		this.dangKyPhongHopService.getDataDangKy(queryParams).subscribe(res => {
			this.calendarEvents = [];
			if (res && res.status == 1 && res.data != null) {
				this.Visible = res.Visible;
				res.data.map((item, index) => {
					var mau = '', lop = "";
					if (item.id == 0){
						lop = "loai0"
						mau = '#9699a2'
					} else if (item.id == 1) {
						lop = "loai1"
						mau = '#329bc8'
					} else {
						lop = "loai-1"
						mau = '#E1E5EC'
					}
					this.calendarEvents.push({
						id: item.requestid,
						title: item.title,
						start: item.start,
						end: item.end,
						extendedProps: {
							type: item.id,
							fullname: item.fullname,
							title: item.title,
							department: item.department,
							property: item.property,
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
	XemPhongHuy() {
		const dialogRef = this.dialog.open(DanhSachPhongHuyListComponent, { data: { _TuNgay: this.TuNgay, _DenNgay: this.DenNgay }, panelClass: ['sky-padding-0'], width: '50%', height: '70%' });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
		});
	}

	eventClick(info) {
		if (info.event.url) {
			info.jsEvent.preventDefault();
			return;
		}

		let _item = info.event;
		const dialogRef = this.dialog.open(DangKyPhongHopInfoComponent, { data: { _item}, 
			panelClass: ['sky-padding-0'], width: '50%' });
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
