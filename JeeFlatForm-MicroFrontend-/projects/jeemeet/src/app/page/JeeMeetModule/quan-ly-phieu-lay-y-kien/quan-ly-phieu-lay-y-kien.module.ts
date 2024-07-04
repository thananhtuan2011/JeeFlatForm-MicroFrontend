import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanLyPhieuLayYKienRoutingModule } from './quan-ly-phieu-lay-y-kien-routing.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { QuanLyPhieuLayYKienComponent } from './quan-ly-phieu-lay-y-kien.component';
import { QuanLyPhieuLayYKienListComponent } from './quan-ly-phieu-lay-y-kien-list/quan-ly-phieu-lay-y-kien-list.component';
import { QuanLyPhieuLayYKienEditComponent } from './quan-ly-phieu-lay-y-kien-edit/quan-ly-phieu-lay-y-kien-edit.component';
import { SurveyPhieuKhaoSatListComponent } from './ds-phieu-khao-sat/ds-phieu-khao-sat.component';
import { PhieuLayYKienService } from './_services/quan-ly-phieu-lay-y-kien.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { QuanLyPhieuLayYKienListDialogComponent } from './quan-ly-phieu-lay-y-kien-list-dialog/quan-ly-phieu-lay-y-kien-list.component';
import { CRUDTableModule } from '../../share/crud-table.module';

@NgModule({
  declarations: [
    QuanLyPhieuLayYKienComponent, QuanLyPhieuLayYKienListComponent, QuanLyPhieuLayYKienEditComponent,SurveyPhieuKhaoSatListComponent,QuanLyPhieuLayYKienListDialogComponent
  ],
  providers: [
    PhieuLayYKienService
	],
  entryComponents: [
		QuanLyPhieuLayYKienEditComponent,
    SurveyPhieuKhaoSatListComponent
	],
  imports: [
    MatSelectModule,
    CommonModule,
    QuanLyPhieuLayYKienRoutingModule,
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
    MatDatepickerModule
  ],
  exports:[QuanLyPhieuLayYKienListDialogComponent,SurveyPhieuKhaoSatListComponent]
})
export class QuanLyPhieuLayYkienModule { }
