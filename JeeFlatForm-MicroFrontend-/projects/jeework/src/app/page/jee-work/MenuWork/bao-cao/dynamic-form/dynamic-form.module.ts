import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
// Core
// Core => Utils

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';

import { MomentDateAdapter, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import { DynamicFormComponent} from './dynamic-form.component'
import { DynamicFormService } from './dynamic-form.service'

import { DropdownTreeModule } from 'dps-lib';
import { ImageControlModule } from 'dps-lib'; 
import { MatSlideToggleModule } from '@angular/material/slide-toggle';  
import { DynamicFormCopyComponent } from './dynamic-form-copy/dynamic-form-copy.component';
import { DynamicFormEditComponent } from './dynamic-form-edit/dynamic-form-edit.component';
import { EditorModule } from '@tinymce/tinymce-angular';

@NgModule({
    imports: [
      EditorModule,
      MatDialogModule,
      CommonModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      TranslateModule.forChild(),
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
     
      MatSlideToggleModule,
      ImageControlModule,
      DropdownTreeModule
    ],
    providers: [
      
        DynamicFormService,
    ],
    entryComponents: [
		DynamicFormComponent,
		DynamicFormCopyComponent,
    DynamicFormEditComponent
    ],
    declarations: [
		DynamicFormComponent,
		DynamicFormCopyComponent,
    DynamicFormEditComponent
    ],
    exports: [
		DynamicFormComponent,
		DynamicFormCopyComponent,
    DynamicFormEditComponent
    ]
})
export class DynamicFormModule { }
