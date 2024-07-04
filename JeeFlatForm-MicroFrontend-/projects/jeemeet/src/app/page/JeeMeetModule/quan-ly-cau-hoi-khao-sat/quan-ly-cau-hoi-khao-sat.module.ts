
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanLyCauHoiKhaoSatRoutingModule } from './quan-ly-cau-hoi-khao-sat-routing.module';
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
import { QuanLyCauHoiKhaoSatComponent } from './quan-ly-cau-hoi-khao-sat.component';
import { QuanLyCauHoiKhaoSatListComponent } from './quan-ly-cau-hoi-khao-sat-list/quan-ly-cau-hoi-khao-sat-list.component';
import { QuanLyCauHoiKhaoSatEditComponent } from './quan-ly-cau-hoi-khao-sat-edit/quan-ly-cau-hoi-khao-sat-edit.component';
import { QuanLyCauHoiKhaoSatService } from './_services/quan-ly-cau-hoi-khao-sat.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { CRUDTableModule } from '../../share/crud-table.module';

@NgModule({
  declarations: [
    QuanLyCauHoiKhaoSatComponent, QuanLyCauHoiKhaoSatListComponent, QuanLyCauHoiKhaoSatEditComponent
  ],
  providers: [
    QuanLyCauHoiKhaoSatService
	],
  entryComponents: [
		QuanLyCauHoiKhaoSatEditComponent
	],
  imports: [
    CommonModule,
    QuanLyCauHoiKhaoSatRoutingModule,
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
  ]
})
export class QuanLyCauHoiKhaoSatModule { }
