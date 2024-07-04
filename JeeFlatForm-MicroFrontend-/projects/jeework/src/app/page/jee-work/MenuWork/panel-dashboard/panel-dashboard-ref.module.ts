import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { TranslateModule } from '@ngx-translate/core';
import { MatNativeDateModule, MatRippleModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarModule } from 'ngx-avatar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgbDropdown, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ChartsModule } from 'ng2-charts';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AvatarUserComponent } from './component/avatar-user/avatar-user.component';
import { TaskDatetimeComponent } from './component/task-datetime/task-datetime.component';
import { TaskDatetimePCComponent } from './component/task-datetime-pc/task-datetime-pc.component';
import { TaskCommentDashboardComponent } from './component/task-comment/task-comment.component';
import { Timezone } from './component/pipe/timezone.pipe';
import { JeeCommentModule } from '../../JeeCommentModule/jee-comment/jee-comment.module';
import '../../../../../../src/styles.scss';
@NgModule({
  declarations: [
    AvatarUserComponent,
    TaskDatetimeComponent,
    TaskDatetimePCComponent,
    TaskCommentDashboardComponent,
    Timezone,
  ],
  entryComponents: [
    // AvatarUserComponent,
    // TaskDatetimeComponent,
    // TaskDatetimePCComponent,
    // TaskCommentDashboardComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatListModule,
    TranslateModule.forRoot(),
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
    MatDatepickerModule,
    MatNativeDateModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    JeeCommentModule,
    MatExpansionModule,
    MatSlideToggleModule,
    ChartsModule,//Thiên
    GridsterModule,//Thiên
    DynamicModule,//Thiên
    NgbDropdownModule,//Thiên
    MatCheckboxModule,//Thiên
    MatSidenavModule
  ],
  providers: [
    NgbDropdown,
  ],
  exports: [
    AvatarUserComponent,
    TaskDatetimeComponent,
    TaskDatetimePCComponent,
    TaskCommentDashboardComponent,
    Timezone,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ]
})
export class PanelDashboardModuleRef { }
