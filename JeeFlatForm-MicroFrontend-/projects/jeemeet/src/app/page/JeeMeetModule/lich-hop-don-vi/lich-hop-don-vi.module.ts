import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { NgbModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { CRUDTableModule } from '../../share/crud-table.module';
import { LichHopDonViComponent } from './lich-hop-don-vi.component';
import { LichHopDonViRoutingModule } from './lich-hop-don-vi-routing.module';
import { LichHopDonViPageComponent } from './components/lich-hop-don-vi-page.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { CalendarService } from './_services/lich-hop-don-vi.service';
import { QuanLyDuyetCuocHopEditComponent } from './components/quan-ly-duyet-lich-hop-edit/quan-ly-duyet-lich-hop-edit.component';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin,
  listPlugin,
  timeGridPlugin
]);
@NgModule({
  declarations: [
    LichHopDonViComponent,
    LichHopDonViPageComponent,
    QuanLyDuyetCuocHopEditComponent
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    CalendarService
  ],
  entryComponents: [
  ],
  imports: [
    CommonModule,
    LichHopDonViRoutingModule,
    InlineSVGModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatIconModule,
    TranslateModule,
    MatTooltipModule,
    CRUDTableModule,
    MatCheckboxModule,
    MatChipsModule,
    // MatListModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    // SidenavListModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MatProgressSpinnerModule,
    NgbTimepickerModule,
    MatDatepickerModule,
    MatRadioModule,
    MatDialogModule,
    NgxMatSelectSearchModule,
    MatMenuModule,
    FullCalendarModule,
  ]
})
export class LichHopDonViModule { }
