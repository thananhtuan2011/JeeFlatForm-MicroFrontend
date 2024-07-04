import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { DropdownTreeModule, DynamicComponentModule } from 'dps-lib';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatListModule } from '@angular/material/list';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DndModule } from 'ngx-drag-drop';
import { MatSliderModule } from '@angular/material/slider';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTreeModule } from '@angular/material/tree';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EditorModule } from '@tinymce/tinymce-angular';
import { PopoverModule } from 'ngx-smart-popover';
import { MatChipsModule } from '@angular/material/chips';
import { ChartsModule } from 'ng2-charts';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AvatarModule } from 'ngx-avatar';
import { NgxPrintModule } from 'ngx-print';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { JeeWorkV1Module } from '../jeework.module';
import { CongViecTheoDuAnRefModule } from '../cong-viec-theo-du-an/cong-viec-theo-du-an-ref.module';
import { HttpUtilsService } from 'projects/jeework-v1/src/modules/crud/utils/http-utils.service';
import { LayoutUtilsService } from 'projects/jeework-v1/src/modules/crud/utils/layout-utils.service';
import { FormatTimeService } from '../../services/jee-format-time.component';
import { SocketioService } from '../../services/socketio.service';
import { AuxiliaryRouterJeeWorkNewComponent } from './auxiliary-router-jeeworkNew.component';
import { TranslationService } from 'projects/jeework-v1/src/modules/i18n/translation.service';
import { CustomPipesModule } from '../component/custom/custom-pipe.module';
import { AuxiliaryRouterJeeWorkComponent } from './auxiliary-router-jeework.component';
import { AuxiliaryRouterAddJeeWorkComponent } from './auxiliary-router-add-jeeworkcomponent';
import { AUXService } from './aux_service.service';
import { AuxiliaryRouterAddJeeWorkV1Component } from './auxiliary-router-add-jeework-v1.component';
const routes: Routes = [
    {
        path: 'detailWork/:id',
        component: AuxiliaryRouterJeeWorkComponent,
    },
    {
        path: 'detailWorkNew/:paramid',
        component: AuxiliaryRouterJeeWorkNewComponent,
    },
    {
        path: 'createTask/:idgov/:id/:idgroup',
        component: AuxiliaryRouterAddJeeWorkComponent,
    },
    {
        path: 'createTask/:idgov',
        component: AuxiliaryRouterAddJeeWorkV1Component,
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        MatFormFieldModule,
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        TranslateModule.forChild(),
        MatDialogModule,
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
        MatListModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTabsModule,
        MatStepperModule,
        MatTooltipModule,
        MatMomentDateModule,
        NgxMatSelectSearchModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSidenavModule,
        DndModule,
        MatSliderModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        DragDropModule,
        NgbModule,
        NgbProgressbarModule,
        MatProgressBarModule,
        DropdownTreeModule,
        MatTreeModule,
        MatSnackBarModule,
        MatTabsModule,
        MatTooltipModule,
        MatMomentDateModule,
        NgxMatSelectSearchModule,
        MatExpansionModule,
        DynamicComponentModule,
        PerfectScrollbarModule,
        EditorModule,
        MatChipsModule,
        MatToolbarModule,
        AvatarModule,
        JeeWorkV1Module,
        CongViecTheoDuAnRefModule,
        CustomPipesModule,
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'vi' },
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        {
            provide: MAT_DIALOG_DEFAULT_OPTIONS,
            useValue: {
                hasBackdrop: true,
                panelClass: 'kt-mat-dialog-container__wrapper',
                height: 'auto',
                width: '700px'
            }
        },
        MatIconRegistry,
        { provide: MatBottomSheetRef, useValue: {} },
        { provide: MAT_BOTTOM_SHEET_DATA, useValue: {} },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        HttpUtilsService,
        LayoutUtilsService,
        FormatTimeService,
        SocketioService,
        AUXService,
        TranslationService,
    ],
    entryComponents: [],
    declarations: [AuxiliaryRouterJeeWorkComponent, AuxiliaryRouterJeeWorkNewComponent, AuxiliaryRouterAddJeeWorkComponent,
        AuxiliaryRouterAddJeeWorkV1Component,]
})
export class AuxiliaryWorkV1RouterModule {
}
