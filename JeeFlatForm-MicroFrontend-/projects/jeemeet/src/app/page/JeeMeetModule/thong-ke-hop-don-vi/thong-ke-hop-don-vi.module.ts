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
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import { MatExpansionModule } from '@angular/material/expansion';
import { AvatarModule } from 'ngx-avatar';
import { ThongKeHopDonViRoutingModule } from './thong-ke-hop-don-vi-routing.module';
import { ThongKeHopDonViComponent } from './thong-ke-hop-don-vi.component';
import { ThongKeHopDonViPageComponent } from './components/thong-ke-hop-don-vi-page/thong-ke-hop-don-vi-page.component';
import { ThongKeCuocHop1Service } from './_services/thong-ke-cuoc-hop1.service';
import { ThongKeCuocHopService } from './_services/thong-ke-cuoc-hop.service';
import { ThongKeCuocHop2Service } from './_services/thong-ke-cuoc-hop2.service';
import { ThongKeCuocHop2EditComponent } from './components/thong-ke-cuoc-hop2-edit/thong-ke-cuoc-hop2-edit.component';
import { ThongKeCuocHopListComponent } from './components/thong-ke-cuoc-hop-list/thong-ke-cuoc-hop-list.component';
import { ThongKeCuocHopViewFileEditComponent } from './components/thong-ke-cuoc-hop-view-file-edit/thong-ke-cuoc-hop2-edit.component';
import { ThongKeHopDaXuLyPageComponent } from './components/thong-ke-hop-da-xu-ly-page/thong-ke-hop-don-vi-page.component';
import { ThongKeCuocHopDaXLListComponent } from './components/thong-ke-cuoc-hop-da-xl-list/thong-ke-cuoc-hop-list.component';
import { ThongKeCuocHopThamGiaListComponent } from './components/thong-ke-cuoc-hop-tham-gia-list/thong-ke-cuoc-hop-list.component';
import { ThongKeHopDonViThamGiaPageComponent } from './components/thong-ke-hop-don-vi-tg-page/thong-ke-hop-don-vi-page.component';
import { ThongKeHopTheoChucVuPageComponent } from './components/thong-ke-hop-theo-chuc-vu-page/thong-ke-hop-don-vi-page.component';
import { ThongKeCuocHopTheoChucVuListComponent } from './components/thong-ke-cuoc-hop-theo-chuc-vu-list/thong-ke-cuoc-hop-list.component';
@NgModule({
  declarations: [
    ThongKeHopDonViComponent,
    ThongKeHopDonViPageComponent,
    ThongKeHopDaXuLyPageComponent,
    ThongKeCuocHop2EditComponent,
    ThongKeCuocHopViewFileEditComponent,
    ThongKeCuocHopListComponent,
    ThongKeCuocHopDaXLListComponent,
    ThongKeHopDonViThamGiaPageComponent,
    ThongKeCuocHopThamGiaListComponent,
    ThongKeCuocHopTheoChucVuListComponent,
    ThongKeHopTheoChucVuPageComponent
  ],
  providers: [
    { provide: MAT_DIALOG_DATA, useValue: {} },
    ThongKeCuocHop2Service,
    ThongKeCuocHop1Service,
    ThongKeCuocHopService
  ],
  entryComponents: [
  ],
  imports: [
    CommonModule,
    ThongKeHopDonViRoutingModule,
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
    MatExpansionModule,
    MatMenuModule,
    AvatarModule
  ]
})
export class ThongKeHopDonViModule { }
