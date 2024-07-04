import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import moment from 'moment';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { QuanLyCuocHopEditComponent } from '../../components/quan-ly-cuoc-hop-edit/quan-ly-cuoc-hop-edit.component';
import { QLCuocHopModel } from '../../_models/quan-ly-cuoc-hop.model';
import { CalendarService } from '../_services/lich-hop-don-vi.service';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { QuanLyDuyetCuocHopEditComponent } from './quan-ly-duyet-lich-hop-edit/quan-ly-duyet-lich-hop-edit.component';

@Component({
    selector: 'app-lich-hop-don-vi-page',
    templateUrl: './lich-hop-don-vi-page.component.html',
    styleUrls: ['./lich-hop-don-vi-page.component.scss']
})
export class LichHopDonViPageComponent implements OnInit {
    calendarJeeMeetEvents: any[] = [
    ];
    Visible: boolean = true;
    TuNgay: string = '';
    DenNgay: string = '';
    filterPhong: string = '';
    listPhongHop: any[] = [];
    filterTinhTrang: string = "";
    TitleCalendar: string = "";
    TenPhong: string;
    calendarEvents: EventInput[] = [
    ];
    @ViewChild('calendar') calendarComponent: FullCalendarComponent;
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
        select: this.eventClicked.bind(this),
        eventClick: this.eventClick.bind(this),
    };
    // calendarOptions: CalendarOptions = {
    //     initialView: 'timeGridWeek',
    //     slotMinTime: "06:00",
    //     slotMaxTime: "23:00",
    //     firstDay: 1,
    //     locale: 'vi',
    //     eventTimeFormat: {
    //         hour: '2-digit',
    //         minute: '2-digit',
    //     },
    //     nowIndicator: true,
    //     selectMirror: true,
    //     selectAllow: (el) => {
    //         let now = new Date();
    //         if (el.start > now) {
    //             const diffTime = Math.abs(+el.end - +el.start);
    //             const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    //             if (diffDays > 1) {
    //                 return false;
    //             }
    //             return true;
    //         }
    //         return false;
    //     },
    //     selectable: true,
    //     weekends: true,
    //     editable: false,
    //     allDaySlot: false,
    //     navLinks: false,
    //     height: window.innerHeight - 150,
    //     headerToolbar: false,
    //     selectOverlap: false,
    //     displayEventTime: true,
    //     displayEventEnd: true,
    //     eventOverlap: false,
    //     select: this.eventClicked.bind(this),
    //     eventSources: this.datesRender.bind(this),
    //     eventClick: this.eventClick.bind(this),
    // };
    types = [
        { checked: true, Id: -1, Title: 'Đã đặt', class: "loai-1" },
        { checked: true, Id: 0, Title: 'Đang chờ xác nhận', class: "loai0" },
        { checked: true, Id: 1, Title: 'Đã được xác nhận', class: "loai1" }
    ]
    constructor(private changeDetectorRef: ChangeDetectorRef, private layoutUtilsService: LayoutUtilsService, public dialog: MatDialog, private calendarService: CalendarService) { }

    ngOnInit(): void {
        this.LoadDataMeet()
    }
    eventClicked(arg) {
        debugger
        const QLCuocHop = new QLCuocHopModel();
        QLCuocHop.clear();
        let phut = moment(arg.end, "HH:mm").diff(
            moment(arg.start, "HH:mm"),
            "minute"
        );

        QLCuocHop.ThoiLuongPhut = phut + ''
        QLCuocHop.GioBatDau = arg.start
        QLCuocHop.TypeMeeting = arg.view.type == "dayGridMonth" ? '2' : '1'
        const dialogRef = this.dialog.open(QuanLyCuocHopEditComponent, {
            disableClose: true,
            panelClass: 'no-padding', data: { QLCuocHop }, width: '60%'
        });
        dialogRef.afterClosed().subscribe(res => {
            this.LoadDataMeet()
        });
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
        this.TuNgay = event.start.getDate() + "/" + (event.start.getMonth() + 1) + "/" + event.start.getFullYear();
        this.DenNgay = event.end.getDate() + "/" + (event.end.getMonth() + 1) + "/" + event.end.getFullYear();
        this.changeDetectorRef.detectChanges();
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
        const dialogRef = this.dialog.open(QuanLyDuyetCuocHopEditComponent, {
            disableClose: true,
            panelClass: 'no-padding', data: { _item, }, width: '50%'
        });
        dialogRef.afterClosed().subscribe(res => {

            this.LoadDataMeet();
        })
        info.jsEvent.preventDefault();
    }


    handleDateClick(arg) {

    }

    filterConfigurationMeet(): any {
        const filter: any = {};
        // filter.TuNgay = this.TuNgay;
        // filter.DenNgay = this.DenNgay;
        return filter;
    }

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
                        color: item.type == 2 ? '#9900cc' : '#00B3FF',
                        extendedProps: {
                            type: 51,
                            typeMeet: item.type - 1,//1:Tôi tạo 2:Tôi tham gia
                            meetid: item.id_row,
                        },
                    });
                })
                let calendarApi = this.calendarComponent.getApi();
                calendarApi.removeAllEventSources();
                calendarApi.addEventSource(this.calendarJeeMeetEvents);
            } else {
                let calendarApi = this.calendarComponent.getApi();
                calendarApi.removeAllEventSources();
                calendarApi.addEventSource(this.calendarJeeMeetEvents);
            }
        });
    }
}
