import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MatSliderModule } from '@angular/material/slider';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NgbModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { MatTreeModule } from '@angular/material/tree';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { EditorModule } from '@tinymce/tinymce-angular';
import { MatChipsModule } from '@angular/material/chips';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AvatarModule } from 'ngx-avatar';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { JeeCommentModule } from '../JeeCommentModule/jee-comment/jee-comment.module';
import { AuxiliaryRouterAddWorkComponent } from './auxiliary-router-add-work.component';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { LayoutUtilsService } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { ThemMoiRef } from '../MenuWork/them-moi-ref.module';
import '../../../../../src/styles.scss';
import { TranslationService } from 'projects/jeework/src/modules/i18n/translation.service';
import { QuillModule } from 'ngx-quill';
import { placeholder, quillConfig } from '../editor/Quill_config';
import { AuxiliaryRouterAddWorkGOVComponent } from './auxiliary-router-add-work-gov.component';
import { AuxiliaryRouterDetailsWorkGOVComponent } from './auxiliary-router-details-work.component';
import { AuxiliaryRouterListWorkGOVComponent } from './auxiliary-router-list-work.component';
import { SocketioService } from '../services/socketio.service';
import { AuxiliaryRouterAddWorkChatComponent } from './auxiliary-router-add-work-chat.component';
import { AUXServiceV2 } from './aux_service.service';
import { AuxiliaryRouterAddWorkGOV2Component } from './auxiliary-router-add-work-gov-fast.component';
import { AuxiliaryRouterListWorkGOVChildComponent } from './auxiliary-router-list-work-child.component';
import { DashboardAuxiliaryRouterUpdateTienDoComponent } from './dashboard-auxiliary-router-update-tiendo.component';
import { DashboardAuxiliaryRouterAddWorkGOV2ChildComponent } from './dashboard-auxiliary-router-add-work-gov2-child.component';
import { DashboardAuxiliaryRouterChuyenXuLyComponent } from './dashboard-auxiliary-router-chuyenxuly.component';
import { DashboardAuxiliaryRouterListWorkGOVChildComponent } from './dashboard-auxiliary-router-list-work-child.component';
import { DashboardAuxiliaryRouterUpdateDonDocComponent } from './dashboard-auxiliary-router-update-dondoc.component';
import { DashboardAuxiliaryRouterDeleteTaskComponent } from './dashboard-auxiliary-router-delete-task.component';

const routes: Routes = [
    {
        path: 'Add',
        component: AuxiliaryRouterAddWorkComponent,
    },
    {
        path: 'AddGOV/:id',
        component: AuxiliaryRouterAddWorkGOVComponent,
    },
    {
        path: 'AddGOV2/:id',
        component: AuxiliaryRouterAddWorkGOV2Component,
    },
    {
        path: 'DetailsGOV/:id',
        component: AuxiliaryRouterDetailsWorkGOVComponent,
    },
    {
        path: 'List/:loaicongviec/:id_project_team/:tien_do',
        component: AuxiliaryRouterListWorkGOVComponent,
    },
    {
        path: 'List/:loaicongviec/:id_project_team/:tien_do/:id_user',
        component: AuxiliaryRouterListWorkGOVComponent,
    },
    {
        path: 'List/:loaicongviec/:id_department/:id_project_team/:tien_do/:id_user',
        component: AuxiliaryRouterListWorkGOVComponent,
    },
    {
        path: 'List/:loaicongviec/:id_project_team/:tien_do/:id_nv/:type_filter/:type_staff',
        component: AuxiliaryRouterListWorkGOVComponent,
    },
    {
        path: 'createTask/:idgov/:id/:idgroup',
        component: AuxiliaryRouterAddWorkChatComponent,
    },
    {
        path: 'ListChild/:id',
        component: AuxiliaryRouterListWorkGOVChildComponent,
    },
    //Start - Sử dụng widget ngoài dashboard gọi vào mfe workv2 - Thiên 30/11/2023
    {
        //Thêm mới công việc con (icon + trên danh sách)
        path: 'DashAddChillGOV2/:id',
        component: DashboardAuxiliaryRouterAddWorkGOV2ChildComponent,
    },
    {
        //Cập nhật tiến độ
        path: 'DashUpdateProgress/:type/:id',
        component: DashboardAuxiliaryRouterUpdateTienDoComponent,
    },
    {
        //Cập nhật tiến độ
        path: 'DashUpdateProgress/:type/:id/:idSTT/:nameSTT',
        component: DashboardAuxiliaryRouterUpdateTienDoComponent,
    },
    {
        //Chuyển xử lý
        path: 'DashChangeUser/:id',
        component: DashboardAuxiliaryRouterChuyenXuLyComponent,
    },
    {
        path: 'DashListChild/:id',
        component: DashboardAuxiliaryRouterListWorkGOVChildComponent,
    },
    {
        //Cập nhật đôn đốc
        path: 'DashUpdateUrges/:type/:id',
        component: DashboardAuxiliaryRouterUpdateDonDocComponent,
    },
    {
        //Xóa nhiệm vụ
        path: 'DashDeleteTask/:type/:id',
        component: DashboardAuxiliaryRouterDeleteTaskComponent,
    },
    //End - Sử dụng widget ngoài dashboard gọi vào mfe workv2 - Thiên 30/11/2023
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        JeeCommentModule,
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
        QuillModule.forRoot({
            modules: quillConfig,
            placeholder: placeholder,
        }),
        ThemMoiRef,
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
        TranslationService,
        SocketioService,
        AUXServiceV2,
    ],
    entryComponents: [],
    declarations: [
        AuxiliaryRouterAddWorkComponent,
        AuxiliaryRouterAddWorkGOVComponent,
        AuxiliaryRouterDetailsWorkGOVComponent,//Chi tiết thông tin
        AuxiliaryRouterListWorkGOVComponent,//Danh sách theo số lượng
        AuxiliaryRouterAddWorkChatComponent,//Tạo công việc từ chat
    ]
})
export class AuxiliaryWorkRouterModule {
}
