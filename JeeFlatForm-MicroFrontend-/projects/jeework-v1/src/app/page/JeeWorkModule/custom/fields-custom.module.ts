import { MatInputModule } from '@angular/material/input';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from "@angular/material/menu";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { PopoverModule } from "ngx-smart-popover";
import { AvatarModule } from "ngx-avatar";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { TranslateModule } from "@ngx-translate/core";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { DynamicComponentModule } from "dps-lib";
import { EditorModule } from "@tinymce/tinymce-angular";
import { ChartsModule } from "ng2-charts";
import { MatChipsModule } from "@angular/material/chips";
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { MatTooltipModule } from "@angular/material/tooltip";
import { TaskCommentComponent } from './field-custom/task-comment/task-comment.component';
import { CustomPipesModule } from '../component/custom/custom-pipe.module';
import { WeWorkService } from '../component/Jee-Work/jee-work.servide';
import { CommentTaskUpdateStatusComponent } from './comment-task-update-status/comment-task-update-status.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatDialogModule,
    TranslateModule,
    MatTooltipModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatExpansionModule,
    DynamicComponentModule,
    MatFormFieldModule,
    MatInputModule,
    EditorModule,
    MatMenuModule,
    ChartsModule,
    AvatarModule,
    PopoverModule,
    MatToolbarModule,
    MatChipsModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    CustomPipesModule,
    // JeeCommentModule,
  ],
  providers: [WeWorkService],
  entryComponents: [
    TaskCommentComponent,
    CommentTaskUpdateStatusComponent
  ],
  declarations: [
    TaskCommentComponent,
    CommentTaskUpdateStatusComponent,
  ],
  exports: [
    TaskCommentComponent,
    CommentTaskUpdateStatusComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
})
export class FieldsCustomModule {}
