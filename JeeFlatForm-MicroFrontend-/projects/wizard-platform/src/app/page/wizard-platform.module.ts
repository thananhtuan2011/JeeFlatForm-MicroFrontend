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
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { LayoutUtilsService } from '../../modules/crud/utils/layout-utils.service';
import { HttpUtilsService } from '../../modules/crud/utils/http-utils.service';
import { ActionNotificationComponent } from '../../modules/crud/action-natification/action-notification.component';
import { TranslationService } from '../../modules/i18n/translation.service';
import { DeleteEntityDialogComponent } from '../../modules/crud/delete-entity-dialog/delete-entity-dialog.component';
import { ConfirmConfigDialogComponent } from '../../modules/crud/action-confirm-config/action-confirm-config.component';

@NgModule({
  declarations: [
    ActionNotificationComponent,
    DeleteEntityDialogComponent,
    ConfirmConfigDialogComponent,
  ],
  entryComponents: [
    ActionNotificationComponent,
    ConfirmConfigDialogComponent,
  ],
  imports: [
    NgxMatSelectSearchModule,
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatRadioModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatSidenavModule,
    TranslateModule,
    MatMenuModule,
    NgbModule,
    RouterModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    AvatarModule,
    ScrollingModule,
    MatIconModule,
    FormsModule,
    InlineSVGModule,
    MatTabsModule,
    NgbTooltipModule,
    MatBadgeModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    PerfectScrollbarModule,
    MatButtonModule,
    ScrollingModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    LayoutUtilsService,
    HttpUtilsService,
    DatePipe,
    TranslateService,
    TranslationService,
  ],
  exports: [
    MatSidenavModule,
    MatExpansionModule,
    NgxMatSelectSearchModule,
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatMomentDateModule,
    MatDatepickerModule,
    MatRadioModule,
    MatExpansionModule,
    MatSlideToggleModule,
    MatSidenavModule,
    TranslateModule,
    MatMenuModule,
    NgbModule,
    RouterModule,
    MatInputModule,
    MatDialogModule,
    MatTooltipModule,
    AvatarModule,
    ScrollingModule,
    MatIconModule,
    FormsModule,
    InlineSVGModule,
    MatTabsModule,
    NgbTooltipModule,
    MatBadgeModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatChipsModule,
    MatAutocompleteModule,
    PerfectScrollbarModule,
    MatButtonModule,
    ScrollingModule,
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatSnackBarModule,
  ],
})
export class WizardPlatformModule { }
