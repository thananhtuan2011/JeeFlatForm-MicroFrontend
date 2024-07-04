import { Component, OnInit, ViewChild, Renderer2, AfterViewInit, HostListener, ChangeDetectorRef } from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CalendarOptions, EventApi, EventInput, FullCalendarComponent } from '@fullcalendar/angular';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { CuocHopModel } from '../../_models/DuLieuCuocHop.model';
import { DangKyCuocHopService } from '../../_services/dang-ky-cuoc-hop.service';
import { StateService } from '../../_services/state.service';
import { DanhSachDangKyHuyComponent } from '../danh-sach-dang-ky-huy/danh-sach-dang-ky-huy.component';
import { QuanLyPhongHopDialogComponent } from '../quan-ly-phong-hop-dialog/quan-ly-phong-hop-dialog.component';
import { QuanLyPhongHopInfoComponent } from '../quan-ly-phong-hop-info/quan-ly-phong-hop-info.component';
import { LayoutUtilsService, MessageType } from 'projects/jeemeeting/src/modules/crud/utils/layout-utils.service';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
@Component({
  selector: 'app-dang-ky-tai-san',
  templateUrl: './dang-ky-tai-san.component.html',
  styleUrls: ['./dang-ky-tai-san.component.scss']
})
export class DangKyTaiSanComponent implements OnInit {
	Visible: boolean = true;
	TuNgay: string = '';
	DenNgay: string = '';
	filterPhong: string = '';
	listPhongHop: any[] = [];
	filterTinhTrang: string = "";
	TitleCalendar: string = "";
	TenPhong :string;
	calendarEvents: EventInput[] = [
	];
  	@ViewChild('calendar') calendarComponent: FullCalendarComponent;
	calendarOptions: CalendarOptions = {
  		initialView: 'timeGridWeek',
		// slotMinTime: "06:00",
		// slotMaxTime: "19:00",
		firstDay: 1,
		locale: 'vi',
		eventTimeFormat: {
			hour: '2-digit',
			minute: '2-digit',
		},
		nowIndicator:true,
		selectMirror:true,
		selectAllow: (el) => {
			let now = new Date();
			if (el.start > now) {
			  const diffTime = Math.abs(+el.end - +el.start);
			  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
			  if (diffDays > 1) {
				return false;
			  }
			  return true;
			}
			return false;
		  },
		selectable:true,
		weekends: true,
		editable:false,
		allDaySlot:false,
		navLinks:false,
		height: window.innerHeight - 150,
		headerToolbar: false,
		selectOverlap: false,
		displayEventTime: true,
		displayEventEnd: true,
		eventOverlap: false,
		select: this.eventClicked.bind(this),
		eventSources  : this.datesRender.bind(this),
		eventClick: this.eventClick.bind(this),
	  };
	  types = [
		{ checked: true, Id: -1, Title: 'Đã đặt', class: "loai-1" },
		{ checked: true, Id: 0, Title: 'Đang chờ xác nhận', class: "loai0" },
		{ checked: true, Id: 1, Title: 'Đã được xác nhận', class: "loai1" }
	]
	loaiTaiSan:number = 1
	state: CuocHopModel;
  	constructor(private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService,
		private router: Router,
		private changeDetectorRef: ChangeDetectorRef,
		public dialog: MatDialog,
		private dangKyCuocHopService: DangKyCuocHopService,
		private stateService: StateService) { }
	  ngAfterViewInit() {
		this.dangKyCuocHopService.GetListPhongHop(this.loaiTaiSan).subscribe(res => {
			if (res.data.length > 0) {
				this.listPhongHop = res.data;
				this.filterPhong = '' + res.data[0].RowID;
			}
			this.LoadDataDangKy();
			this.changeDetectorRef.detectChanges();
		});
		}
	ngOnInit(): void {
		this.state = this.stateService.state$.getValue() || null;
	if(this.state == null){
		this.loaiTaiSan = 1
	}else{
		this.loaiTaiSan = this.state.LoaiTaiSan
	}
	}
	eventClicked(arg) {
		if(this.Visible){
			// for (var i = 0; i < this.disabledEvents.length; i++) {
			// 	if (arg.start >= moment(this.disabledEvents[i].start).toDate() && arg.end <= moment(this.disabledEvents[i].end).toDate()) {
			// 		return;
			// 	}
			// }
			if (moment(arg.end).format("DD/MM/YYYY") != moment(arg.start).format("DD/MM/YYYY")) {
				let message = "Khoảng thời gian không hợp lệ";
				this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
				return;
			}
			let saveMessageTranslateParam = this.translate.instant('JeeHR.themthanhcong');
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
			const dialogRef = this.dialog.open(QuanLyPhongHopDialogComponent, { 
				disableClose:true,
 panelClass:'no-padding',
				data: { _item, _hinhthuc: '0', _RoomID: this.filterPhong,_TenPhong:this.TenPhong }, width: '50%', height: '50%' });
			dialogRef.afterClosed().subscribe(res => {
				if (res) {
					// this.navigation.back()
					// this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
					this.goBack()
				} else {
					this.LoadDataDangKy();
				}
			});
		}
	}
	Before() {
		let calendarApi = this.calendarComponent.getApi();
		calendarApi.prev();
	}

	Next() {
		let calendarApi = this.calendarComponent.getApi();
		calendarApi.next();
	}
	datesRender(event) {
		this.TitleCalendar = event.start.getDate() + " - " + event.end.getDate() + " THG " + (event.end.getMonth() + 1) + ", " + event.end.getFullYear();
		this.TuNgay =  event.start.getDate() + "/" + (event.start.getMonth() + 1) + "/" + event.start.getFullYear();
		this.DenNgay = event.end.getDate() + "/" + (event.end.getMonth() + 1) + "/" + event.end.getFullYear();
	}
	filter = function (item, khac = false) {
		let calendarApi = this.calendarComponent.getApi();
		let allEvents = calendarApi.getEvents();
		for (var i = 0; i < allEvents.length; i++) {
			let event = allEvents[i];
			if (item.Id == event.extendedProps.type) {
				let arr = ["loai" + item.Id];
				if (!item.checked) {
					arr.push("hideEvent");
				}
				var _event = calendarApi.getEventById(event.id);
				_event.setProp('classNames', arr);
			}
		}
	}
	eventClick(info) {
		if (info.event.url || !this.Visible) {
			info.jsEvent.preventDefault();
			return;
		}

		let _item = info.event;
		let saveMessageTranslateParam = this.translate.instant('JeeHR.capnhatthanhcong');
		const dialogRef = this.dialog.open(QuanLyPhongHopInfoComponent, { 
			disableClose:true,
 panelClass:'no-padding',data: { _item, }, width: '50%' });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.LoadDataDangKy();
		})
		info.jsEvent.preventDefault();
	}
	//========================================================================================================================
	filterConfigurationDK(): any {
		const filter: any = {};
		filter.RoomID = this.filterPhong;
		// filter.TuNgay = this.TuNgay;
		// filter.DenNgay = this.DenNgay;
		filter.StatusID = this.filterTinhTrang;
		filter.LoaiID  = this.loaiTaiSan
		return filter;
	}
	LoadDataDangKy() {
		const itemPhong = this.listPhongHop.find(x =>x.RowID == this.filterPhong)
		this.TenPhong = itemPhong==null?'':itemPhong.Title
		const queryParams = new QueryParamsModel(
			this.filterConfigurationDK(),
		);
		this.dangKyCuocHopService.findData(queryParams).subscribe(res => {
		if(res && res.data !=null){
			if (res && res.status == 1 && res.data.length > 0) {
				this.calendarEvents = [];
				// this.Visible = res.Visible;
				res.data.map((item, index) => {
					if (item.id == 1) {
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
							},
							classNames: ["loai1"],
							color: '#74baf0',

						});
					} else if (item.id == 0) {
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
							},
							classNames: ["loai0"],
							color: '#9699a2',

						});
					} else {
						this.calendarEvents.push({
							id: item.requestid,
							title: item.fullname + "\n" + item.title,
							start: item.start,
							end: item.end,
							extendedProps: {
								type: item.id,
								fullname: item.fullname,
								title: item.title,
								department: item.department,
							},
							classNames: ["loai-1"],
							color: '#e8c374',
						});
					}

				})
				let calendarApi = this.calendarComponent.getApi();
				calendarApi.removeAllEventSources();
				calendarApi.addEventSource(this.calendarEvents);
				this.filterLoad();
			} else {
				let calendarApi = this.calendarComponent.getApi();
				calendarApi.removeAllEventSources();
				this.filterLoad();
			}
		}else{
			let calendarApi = this.calendarComponent.getApi();
				calendarApi.removeAllEventSources();
				this.filterLoad();
		}
		});
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
	goBack(){
		if(this.state && this.state.RowID != 0 && this.state.RowID){
			// this.router.navigate(['/meeting/edit',this.stateEdit.RowID]);
      this.router.navigate(['/Meeting/edit/',this.state.RowID]);
      this.dangKyCuocHopService.data_share$.next('load')
		}else{
			// this.router.navigateByUrl('/meeting/tao-cuoc-hop')
      this.router.navigate(['/Meeting/create/',0]);
      this.dangKyCuocHopService.data_share$.next('load')
		}

	}
	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 20;
		return tmp_height + "px";
	  }



	XemPhongHuy() {
		const dialogRef = this.dialog.open(DanhSachDangKyHuyComponent, { data: { _TuNgay: this.TuNgay, _DenNgay: this.DenNgay }, width: '50%', height: '70%' });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
		});
	}
}

