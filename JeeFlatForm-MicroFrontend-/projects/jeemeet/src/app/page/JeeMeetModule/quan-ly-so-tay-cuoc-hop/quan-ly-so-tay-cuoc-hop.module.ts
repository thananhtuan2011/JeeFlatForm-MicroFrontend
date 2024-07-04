import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanLySoTayCuocHopRoutingModule } from './quan-ly-so-tay-cuoc-hop-routing.module';
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
import { QuanLySoTayCuocHopComponent } from './quan-ly-so-tay-cuoc-hop.component';
import { QuanLySoTayCuocHopListComponent } from './quan-ly-so-tay-cuoc-hop-list/quan-ly-so-tay-cuoc-hop-list.component';
import { QuanLySoTayCuocHopEditComponent } from './quan-ly-so-tay-cuoc-hop-edit/quan-ly-so-tay-cuoc-hop-edit.component';
import { QuanLySoTayCuocHopService } from './_services/quan-ly-so-tay-cuoc-hop.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { CRUDTableModule } from '../../share/crud-table.module';
import { QuanLySoTayCuocHopListV2Component } from './quan-ly-so-tay-cuoc-hop-list-v2/quan-ly-so-tay-cuoc-hop-list-v2.component';
import { QuanLySoTayCuocHopPageComponent } from './quan-ly-so-tay-cuoc-hop-page/quan-ly-so-tay-cuoc-hop-list.component';


@NgModule({
  declarations: [
    QuanLySoTayCuocHopComponent, QuanLySoTayCuocHopListComponent, QuanLySoTayCuocHopEditComponent, QuanLySoTayCuocHopListV2Component, QuanLySoTayCuocHopPageComponent
  ],
  providers: [
    QuanLySoTayCuocHopService
  ],
  entryComponents: [
    QuanLySoTayCuocHopEditComponent
  ],
  imports: [
    CommonModule,
    QuanLySoTayCuocHopRoutingModule,
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
    MatCheckboxModule
  ],
  exports: [QuanLySoTayCuocHopPageComponent]
})
export class QuanLySoTayCuocHopModule { }
