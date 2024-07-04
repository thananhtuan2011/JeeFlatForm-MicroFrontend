import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import moment from 'moment';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';

@Component({
    selector: 'app-thong-ke-hop-don-vi-page',
    templateUrl: './thong-ke-hop-don-vi-page.component.html',
    styleUrls: ['./thong-ke-hop-don-vi-page.component.scss']
})
export class ThongKeHopDaXuLyPageComponent implements OnInit {
    constructor(private changeDetectorRef: ChangeDetectorRef, private layoutUtilsService: LayoutUtilsService) { }

    ngOnInit(): void {
    }

}
