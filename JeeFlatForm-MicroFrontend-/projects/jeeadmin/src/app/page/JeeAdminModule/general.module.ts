import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatTabsModule } from '@angular/material/tabs';
import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonModule } from '@angular/material/button';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarModule } from 'ngx-avatar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslationService } from 'projects/jeeadmin/src/modules/i18n/translation.service';
import { ActionNotificationComponent } from 'projects/jeeadmin/src/modules/crud/action-natification/action-notification.component';
import { DeleteEntityDialogComponent } from 'projects/jeeadmin/src/modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { DynamicSearchFormModule } from './component/dynamic-search-form/dynamic-search-form.module';
import { DynamicSearchFormService } from './component/dynamic-search-form/dynamic-search-form.service';
import { LayoutUtilsService } from 'projects/jeeadmin/src/modules/crud/utils/layout-utils.service';
import { HttpUtilsService } from 'projects/jeeadmin/src/modules/crud/utils/http-utils.service';
import { DropdownTreeModule } from 'dps-lib';
import { TimeAgoPipe } from './Services/jeeadmin-time-ago.pipe';
import { DateFormatsDirective, MY_FORMATS } from './Services/custom-date-format';
import { JeeAdminService } from './Services/jeeadmin.service';
import { DateAgoPipe } from './Services/date.pipe';

@NgModule({ 
  declarations: [
    TimeAgoPipe,
    DateAgoPipe,
    DateFormatsDirective,
    ActionNotificationComponent,
    DeleteEntityDialogComponent
  ],
  entryComponents: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgbModule,
    InlineSVGModule,
    NgbTooltipModule,
    HttpClientModule,  
    FormsModule,
    ReactiveFormsModule,  
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSelectModule,
    MatMenuModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatBadgeModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatSnackBarModule,
    NgxMatSelectSearchModule,
    TranslateModule,
    AvatarModule,
    PerfectScrollbarModule,
    ScrollingModule,
    DropdownTreeModule,
    DynamicSearchFormModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    NgbModule,
    InlineSVGModule,
    NgbTooltipModule,
    HttpClientModule,  
    FormsModule,
    ReactiveFormsModule,  
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSelectModule,
    MatMenuModule,
    MatButtonModule,
    MatRadioModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatSlideToggleModule,
    MatSidenavModule,
    MatBadgeModule,
    MatCardModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatTabsModule,
    MatSnackBarModule,
    NgxMatSelectSearchModule,
    TranslateModule,
    AvatarModule,
    PerfectScrollbarModule,
    ScrollingModule,
    DropdownTreeModule,
    DynamicSearchFormModule,
    TimeAgoPipe,
    DateAgoPipe,
    DateFormatsDirective
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    LayoutUtilsService,
    HttpUtilsService,
    DatePipe,
    DynamicSearchFormService,
    TranslateService,
    TranslationService,
    JeeAdminService
  ],
})
export class GeneralModule { }
