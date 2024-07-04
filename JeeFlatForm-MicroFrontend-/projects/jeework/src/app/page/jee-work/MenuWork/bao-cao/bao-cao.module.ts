import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { NgbDatepickerModule, NgbModalModule, NgbButtonsModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
// import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatRippleModule, MatNativeDateModule, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { AvatarModule } from 'ngx-avatar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatSliderModule } from '@angular/material/slider';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatStepperModule } from '@angular/material/stepper';
import { MatChipsModule } from '@angular/material/chips';
import { MatTreeModule } from '@angular/material/tree';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule, Routes } from '@angular/router';
import { BaoCaoListComponent } from './bao-cao-list/bao-cao-list.component';
import { BaoCaoService } from './services/bao-cao.services';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { EditorModule } from '@tinymce/tinymce-angular';
import { JeeCommentModule } from '../../JeeCommentModule/jee-comment/jee-comment.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { BaoCaoRoutingModule } from './bao-cao-routing.module';
import { BaoCaoRefModule } from './bao-cao-ref.module';
import { BaoCaoComponent } from './bao-cao.component';
import { BaoCaoCongViecComponent } from './bao-cao-cong-viec/bao-cao-cong-viec.component';
import { BaoCaoDuAnComponent } from './bao-cao-du-an/bao-cao-du-an.component';
import { BaoCaoTheoDoiTinhHinhTHNVComponent } from './bao-cao-thoe-doi-tinh-hinh-thuc-hien-nhiem-vu/bao-cao-thoe-doi-tinh-hinh-thuc-hien-nhiem-vu.component';
import { BaoCaoNhiemVuDuocGiaoComponent } from './bao-cao-nhiem-vu-duoc-giao/bao-cao-nhiem-vu-duoc-giao.component';
import { BaoCaoNhiemVuDuocTaoComponent } from './bao-cao-nhiem-vu-duoc-tao/bao-cao-nhiem-vu-duoc-tao.component';
import { BaoCaoChiTietTheoThanhVienComponent } from './bao-cao-chi-tiet-theo-thanh-vien/bao-cao-chi-tiet-theo-thanh-vien.component';
import { CrossbarChartComponent } from './crossbar-chart/crossbar-chart.component';
import { BaoCaoThoiHanNhiemVuComponent } from './bao-cao-thoi-han-nhiem-vu/bao-cao-thoi-han-nhiem-vu.component';
import { ChartsModule } from 'ng2-charts';
import { BieuDoTrangThaiNhiemVuComponent } from './bieu-do-trang-thai-nhiem-vu/bieu-do-trang-thai-nhiem-vu.component';
import { BieuDoTheoDoiTinhHinhThucHienNhiemVuComponent } from './bieu-do-theo-doi-tinh-hinh-thuc-hien-nhiem-vu/bieu-do-theo-doi-tinh-hinh-thuc-hien-nhiem-vu.component';
import { BaoCaoTheoDoiNhiemVuDaGiaoComponent } from './bao-cao-theo-doi-nhiem-vu-da-giao/bao-cao-theo-doi-nhiem-vu-da-giao.component';
import { BaoCaoNhiemVuTheoNguoiGiaoComponent } from './bao-cao-nhiem-vu-theo-nguoi-giao/bao-cao-nhiem-vu-theo-nguoi-giao.component';
import { BaoCaoTongGioLamComponent } from './bao-cao-tong-gio-lam/bao-cao-tong-gio-lam.component';
import { AvatarWorkFlowModule } from './avatar-workflow/avatar-wf.module';
import { DynamicFormModule } from './dynamic-form/dynamic-form.module';
import { AddTaskModule } from './add-task/add-task.module';
import { CustomPipesModule } from './custom/custom-pipe.module';
import { DynamicSearchFormModule } from './dynamic-search-form/dynamic-search-form.module';
import { ProcessWorkService } from './services/process-work.service';
import { PageWorkDetailStore } from '../../services/page-work-detail.store';
import { ProjectsTeamService, WeWorkService } from './services/jee-work.service';
import { FormatCSSTimeService } from './services/jee-format-css-time.component';
import { JeeWorkModule } from '../../../jee-work.module';
import { FieldsCustomModule } from './custom/fields-custom.module';
import { FormatTimeService } from '../../services/jee-format-time.component';
import { JeeChooseMemberModule } from './jee-choose-member/jee-choose-member.module';
import { WidgetWork22Service } from './services/works-widget-22.service';
import { AuthService } from './services/auth.service';
import { TokenStorage } from './services/token-storage.service';
import { WidgetNhiemVuTheoNguoiGiaoService } from './services/widget-nhiem-vu-theo-nguoi-giao.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { AuthHTTPService } from './services/auth-fake-http.service';
import { HttpUtilsService } from 'projects/jeework/src/modules/crud/utils/http-utils.service';
import { BieuDoTheoDoiService } from './services/bieu-do-theo-doi-widget.service';
import { CongViecTheoDuAnService } from './services/cong-viec-theo-du-an.services';
import { JeeMeetingService } from './services/jee-meeting.service';
import { PageWorksService } from './services/page-works.service';
import { TrangThaiCongViecService } from './services/trang-thai-cong-viec-widget.service';
import { WidgetCongViecQuanTrongService } from './services/widget-cong-viec-quan-trong.service';
import { TranslationService } from 'projects/jeework/src/modules/i18n/translation.service';
import { BaoCaoNhiemVuQuanTrongComponent } from './bao-cao-nhiem-vu-quan-trong/bao-cao-nhiem-vu-quan-trong.component';
import { PanelDashboardModuleRef } from '../panel-dashboard/panel-dashboard-ref.module';
import { BaoCaoNhiemVuCanBoComponent } from './bao-cao-nhiem-vu-can-bo/bao-cao-nhiem-vu-can-bo.component';
import { BaoCaoTheoDoiNhiemVuDuocGiaoComponent } from './bao-cao-theo-doi-nhiem-vu-duoc-giao/bao-cao-theo-doi-nhiem-vu-duoc-giao.component';
import { BaoCaoNhiemVuDaXoaComponent } from './bao-cao-nhiem-vu-da-xoa/bao-cao-nhiem-vu-da-xoa.component';

const MY_FORMATS_EDIT: any = {
  parse: {
    dateInput: 'D/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM Y',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Y',
  },
};


@NgModule({
    declarations: [
        BaoCaoComponent,
        BaoCaoListComponent,
        BaoCaoCongViecComponent,
        BaoCaoDuAnComponent,
        BaoCaoTheoDoiTinhHinhTHNVComponent,
        BaoCaoNhiemVuDuocGiaoComponent,
        BaoCaoNhiemVuDuocTaoComponent,
        BaoCaoChiTietTheoThanhVienComponent,
        CrossbarChartComponent,
        BaoCaoThoiHanNhiemVuComponent,
        BieuDoTrangThaiNhiemVuComponent,
        BieuDoTheoDoiTinhHinhThucHienNhiemVuComponent,
        BaoCaoTheoDoiNhiemVuDaGiaoComponent,
        BaoCaoNhiemVuTheoNguoiGiaoComponent,
        BaoCaoTongGioLamComponent,
        BaoCaoNhiemVuQuanTrongComponent,
        BaoCaoNhiemVuCanBoComponent,
        BaoCaoTheoDoiNhiemVuDuocGiaoComponent,
        BaoCaoNhiemVuDaXoaComponent,
    ],
    entryComponents: [],
    exports: [],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'vi' },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_EDIT },
        BaoCaoService,
        ProcessWorkService,
        PageWorkDetailStore,
        ProjectsTeamService,
        FormatTimeService,
        FormatCSSTimeService,
        WidgetWork22Service,
        AuthService,
        TokenStorage,
        WidgetNhiemVuTheoNguoiGiaoService,
        AuthHTTPService,
        HttpUtilsService,
        BieuDoTheoDoiService,
        CongViecTheoDuAnService,
        JeeMeetingService,
        PageWorksService,
        TrangThaiCongViecService,
        WidgetCongViecQuanTrongService,
        WeWorkService,
        TranslationService,
    ],
    imports: [
        BaoCaoRoutingModule,
        CommonModule,
        MatInputModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatAutocompleteModule,
        MatListModule,
        MatSliderModule,
        MatCardModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatNativeDateModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatMenuModule,
        MatTabsModule,
        MatTooltipModule,
        MatSidenavModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatTableModule,
        MatGridListModule,
        MatToolbarModule,
        MatBottomSheetModule,
        MatExpansionModule,
        MatDividerModule,
        MatSortModule,
        MatStepperModule,
        MatChipsModule,
        MatPaginatorModule,
        MatDialogModule,
        MatRippleModule,
        MatRadioModule,
        MatTreeModule,
        MatButtonToggleModule,
        FormsModule,
        ReactiveFormsModule,
        MatMenuModule,
        AvatarModule,
        MatTooltipModule,
        NgbModalModule,
        NgbDatepickerModule,
        TranslateModule,
        NgxMatSelectSearchModule,
        EditorModule,
        AvatarWorkFlowModule,
        DynamicFormModule,
        AddTaskModule,
        JeeWorkModule,
        JeeCommentModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        CustomPipesModule,
        DynamicSearchFormModule,
        BaoCaoRefModule,
        FieldsCustomModule,
        ChartsModule,
        JeeChooseMemberModule,
        MatSnackBarModule,
        NgbModule,
        PanelDashboardModuleRef, //for nv quan trọng
    ]
})
export class BaoCaoModule {}
