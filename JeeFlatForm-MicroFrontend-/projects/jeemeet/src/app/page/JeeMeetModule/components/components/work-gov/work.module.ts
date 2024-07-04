import { ChooseUsersForCreateTaskComponent } from './choose-users-for-create-task/choose-users-for-create-task.component';
import { FormatTimeService } from './services/jee-format-time.component';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { TranslationService } from 'src/app/modules/i18n/translation.service';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarModule } from 'ngx-avatar';
import { MatTooltipDefaultOptions, MatTooltipModule } from '@angular/material/tooltip';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

import { FormsModule, ReactiveFormsModule } from '@angular/forms'; import { MatDatepickerModule } from '@angular/material/datepicker';

import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { QuillModule } from 'ngx-quill';

import { NgxDocViewerModule } from 'ngx-doc-viewer';


import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChartsModule } from 'ng2-charts';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';

import {MatTabsModule} from '@angular/material/tabs';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { SafeHtmlPipe } from '../../SafeHtmlPipe';
import { TimezonePipe } from './pipe/timezone.pipe';
import { DialogSelectdayComponent } from './dialog-selectday/dialog-selectday.component';
import { ThemMoiCongViecComponent } from './them-moi-cong-viec/them-moi-cong-viec.component';
import { DanhSachNhiemVuComponent } from './danh-sach-nhiem-vu/danh-sach-nhiem-vu.component';
import { TaskCommentComponent } from './task-comment/task-comment.component';
import { CuTagComponent } from './cu-tag/cu-tag.component';
import { ChooseMilestoneAndTagComponent } from './choose-milestone-and-tags/choose-milestone-and-tags.component';
import { ChooseUsersGovComponent } from './choose-users/choose-users.component';
import { MenuWorkService } from './services/menu-work.services';
import { DanhMucChungService } from './services/danhmuc.service';
import { ChooseProjectComponent } from './choose-project/choose-project.component';
import { placeholder, quillConfig } from './editor/Quill_config';
import { JeeCommentModule } from 'projects/jeework/src/app/page/jee-work/JeeCommentModule/jee-comment/jee-comment.module';
@NgModule({
  declarations: [
    DialogSelectdayComponent,
    ThemMoiCongViecComponent,
    DanhSachNhiemVuComponent,
    TaskCommentComponent,
    ChooseUsersGovComponent,
    CuTagComponent,
    ChooseMilestoneAndTagComponent,
    ChooseProjectComponent,
    ChooseUsersForCreateTaskComponent
  ],
  entryComponents: [
    MatDialogRef,

  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    TranslateModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRippleModule,
    MatSelectModule,
    MatTableModule,
    MatMenuModule,
    AvatarModule,
    MatTooltipModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    FormsModule,
    // BrowserAnimationsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,

    QuillModule.forRoot({
      modules: quillConfig,
      placeholder: placeholder,
    }),
    NgxDocViewerModule,
    MatExpansionModule,
    MatSlideToggleModule,
    ChartsModule,//Thiên

    NgbDropdownModule,//Thiên
    MatCheckboxModule,//Thiên
    MatSidenavModule,

    MatTabsModule,
    JeeCommentModule,
  ],
  providers: [
    TranslationService,
    TimezonePipe,
    SafeHtmlPipe,
    FormatTimeService,
    NgbDropdown,
    MenuWorkService,
    DanhMucChungService,
    {
			provide: MAT_DIALOG_DEFAULT_OPTIONS,
			useValue: {
				hasBackdrop: true,
        panelClass: ['sky-padding-0'],
        height: "fit-content"
			}
		},
  ],
  exports: [
    // TimezonePipe,
    // SafeHtmlPipe
    DanhSachNhiemVuComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class WorkModule { }
