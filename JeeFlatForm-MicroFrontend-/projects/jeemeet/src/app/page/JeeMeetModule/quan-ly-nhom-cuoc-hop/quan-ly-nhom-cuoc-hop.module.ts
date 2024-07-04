import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuanLyNhomCuocHopRoutingModule } from './quan-ly-nhom-cuoc-hop-routing.module';
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
import { QuanLyNhomCuocHopComponent } from './quan-ly-nhom-cuoc-hop.component';
import { QuanLyNhomCuocHopListComponent } from './quan-ly-nhom-cuoc-hop-list/quan-ly-nhom-cuoc-hop-list.component';
import { QuanLyNhomCuocHopEditComponent } from './quan-ly-nhom-cuoc-hop-edit/quan-ly-nhom-cuoc-hop-edit.component';
import { QuanLyNhomCuocHopService } from './_services/quan-ly-nhom-cuoc-hop.service';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule} from '@angular/material/checkbox';
import { CRUDTableModule } from '../../share/crud-table.module';
import { AvatarUserModule } from '../components/custom-avatar/custom-avatar/avatar-user.module';
import { AvatarUserDeptModule } from '../components/custom-avatar/custom-avatar-dept/avatar-user-dept.module';


@NgModule({
  declarations: [
    QuanLyNhomCuocHopComponent, QuanLyNhomCuocHopListComponent, QuanLyNhomCuocHopEditComponent
  ],
  providers: [
    QuanLyNhomCuocHopService
	],
  entryComponents: [
		QuanLyNhomCuocHopEditComponent
	],
  imports: [
    CommonModule,
    QuanLyNhomCuocHopRoutingModule,
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
    AvatarUserModule,
    AvatarUserDeptModule
  ],
})
export class QuanLyNhomCuocHopModule { }
