import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanLyBangKhaoSatRoutingModule } from './quan-ly-bang-khao-sat-routing.module';
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
import { QuanLyBangKhaoSatComponent } from './quan-ly-bang-khao-sat.component';
import { QuanLyBangKhaoSatListComponent } from './quan-ly-bang-khao-sat-list/quan-ly-bang-khao-sat-list.component';
import { QuanLyBangKhaoSatEditComponent } from './quan-ly-bang-khao-sat-edit/quan-ly-bang-khao-sat-edit.component';
import { QuanLyBangKhaoSatService } from './_services/quan-ly-bang-khao-sat.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatRadioButton, MatRadioModule } from '@angular/material/radio';
import { JeeChooseMemberModule } from './components/jee-choose-member/jee-choose-member.module';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { QuanLyGiaHanKhaoSatComponent } from './quan-ly-khao-sat-giahan/quan-ly-khao-sat-giahan.component';
import { CRUDTableModule } from '../../share/crud-table.module';

@NgModule({
  declarations: [
    QuanLyBangKhaoSatComponent, QuanLyBangKhaoSatListComponent, QuanLyBangKhaoSatEditComponent,QuanLyGiaHanKhaoSatComponent
  ],
  providers: [
    QuanLyBangKhaoSatService,
    {provide: MAT_DIALOG_DATA, useValue: {}},
	],
  entryComponents: [
		QuanLyBangKhaoSatEditComponent
	],
  imports: [
    CommonModule,
    QuanLyBangKhaoSatRoutingModule,
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
    JeeChooseMemberModule,
    NgxMatSelectSearchModule,
    MatMenuModule
  ]
})
export class QuanLyBangKhaoSatModule { }
