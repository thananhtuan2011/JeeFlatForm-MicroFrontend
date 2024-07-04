import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PickerModule } from '@ctrl/ngx-emoji-mart';
import { TranslateModule } from '@ngx-translate/core';
import { AvatarModule } from 'ngx-avatar';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { AddTaskComponent } from './add-task.component';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarWorkFlowModule } from '../avatar-workflow/avatar-wf.module';
import { ProcessWorkService } from '../services/process-work.service';

@NgModule({
    declarations: [
        AddTaskComponent,
    ],
    imports: [CommonModule, MatChipsModule, NgxMatSelectSearchModule, InlineSVGModule, MatIconModule, MatInputModule,
        MatFormFieldModule, MatTooltipModule, FormsModule, PickerModule, TranslateModule, MatChipsModule, ReactiveFormsModule, AvatarModule,
        NgbModule, PerfectScrollbarModule, MatMenuModule, AvatarWorkFlowModule
    ],
    providers: [
        ProcessWorkService,
    ],
    entryComponents: [
        AddTaskComponent,
    ],
    exports: [
        AddTaskComponent,
    ],
})
export class AddTaskModule { }
