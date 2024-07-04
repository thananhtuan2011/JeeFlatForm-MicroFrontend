import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';

import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DynamicFormComponent, DynamicFormMoveComponent, DynamicFormCreateComponent, DynamicFormCopyComponent} from './dynamic-form.component'
import { DynamicFormService } from './dynamic-form.service'
import { DateAdapter, MatNativeDateModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { EditorModule } from '@tinymce/tinymce-angular';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { DropdownTreeModule, ImageControlModule } from 'dps-lib';
import { AvatarModule } from 'ngx-avatar';
import { DynamicFormViewComponent } from './dynamic-form-view.component';
import { JeeChooseMemberModule } from '../jee-choose-member/jee-choose-member.module';
import { CustomPipesModule } from '../custom/custom-pipe.module';
import { HttpUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/http-utils.service';
import { LayoutUtilsService } from 'projects/jeeworkflow/src/modules/crud/utils/layout-utils.service';
import { ProcessWorkService } from '../../../services/process-work.service';

@NgModule({
    imports: [
        MatDialogModule,
        CommonModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        TranslateModule,
        MatButtonModule,
        MatMenuModule,
        MatSelectModule,
        MatInputModule,
        MatTableModule,
        MatAutocompleteModule,
        MatRadioModule,
        MatIconModule,
        MatNativeDateModule,
        MatProgressBarModule,
        MatDatepickerModule,
        MatCardModule,
        MatPaginatorModule,
        MatSortModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTabsModule,
        MatTooltipModule,
        DropdownTreeModule,
        MatSlideToggleModule,
        ImageControlModule,
        EditorModule,
        NgxMatSelectSearchModule,
        AvatarModule,
        JeeChooseMemberModule,
        CustomPipesModule,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'vi' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
        HttpUtilsService,
        LayoutUtilsService,
        DynamicFormService,
        ProcessWorkService,
    ],
    entryComponents: [
        DynamicFormComponent,
        DynamicFormMoveComponent,
        DynamicFormCreateComponent,
        DynamicFormCopyComponent,
        DynamicFormViewComponent,//Xem dữ liệu đầu vào
    ],
    declarations: [
        DynamicFormComponent,
        DynamicFormMoveComponent,
        DynamicFormCreateComponent,
        DynamicFormCopyComponent,
        DynamicFormViewComponent,//Xem dữ liệu đầu vào
    ],
    exports: [
        DynamicFormComponent,
        DynamicFormMoveComponent,
        DynamicFormCreateComponent,
        DynamicFormCopyComponent,
        DynamicFormViewComponent,//Xem dữ liệu đầu vào
    ]
})
export class DynamicFormModule { }
