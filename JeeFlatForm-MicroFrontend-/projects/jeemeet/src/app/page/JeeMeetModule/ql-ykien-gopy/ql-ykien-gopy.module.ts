import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanLyYKienGopYRoutingModule } from './ql-ykien-gopy-routing.module';
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
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { QuanLyYKienGopYComponent } from './ql-ykien-gopy.component';
import { QuanLyYKienGopYListComponent } from './ql-ykien-gopy-list/ql-ykien-gopy-list.component';
import { QuanLyYKienGopYEditComponent } from './ql-ykien-gopy-edit/ql-ykien-gopy-edit.component';
import { QuanLyYKienGopYService } from './_service/ql-ykien-gopy.service';
import { VoteDetailComponent } from './vote-detail/vote-detail.component';
import { CRUDTableModule } from '../../share/crud-table.module';

@NgModule({
  declarations: [
    QuanLyYKienGopYComponent, QuanLyYKienGopYListComponent,QuanLyYKienGopYEditComponent,VoteDetailComponent
  ],
  providers: [
    QuanLyYKienGopYService
	],
  entryComponents: [
		QuanLyYKienGopYEditComponent,VoteDetailComponent
	],
  imports: [
    CommonModule,
    QuanLyYKienGopYRoutingModule,
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
  ]
})
export class QuanLyYKienGopYModule { }
