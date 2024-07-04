import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgApexchartsModule } from 'ng-apexcharts';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbDatepickerModule, NgbDropdownModule, NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { GridsterModule } from 'angular-gridster2';
import { DynamicModule } from 'ng-dynamic-component';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMenuModule } from '@angular/material/menu';
import { AvatarModule } from 'ngx-avatar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ChartsModule } from 'ng2-charts';
import { GuideSystemComponent } from './guide-system.component';
import { GuideSystemService } from './guide-system.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { SafeHtmlPipe, ThietLapBanDauComponent } from './thiet-lap-ban-dau/thiet-lap-ban-dau.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatRadioModule } from '@angular/material/radio';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DEFAULT_OPTIONS, MatDialogModule } from '@angular/material/dialog';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTabsModule } from '@angular/material/tabs';
import { MatBadgeModule } from '@angular/material/badge';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { KichHoatTaiKhoanComponent } from './kich-hoat-tai-khoan/kich-hoat-tai-khoan.component';
import { PhanQuyenTaiKhoanComponent } from './phan-quyen-tai-khoan/phan-quyen-tai-khoan.component';
import { HoanThanhKhoiTaoComponent } from './hoan-thanh-khoi-tao/hoan-thanh-khoi-tao.component';
import { ChangeTinhTrangEditDialogComponent } from './kich-hoat-tai-khoan/change-tinh-trang-edit-dialog/change-tinh-trang-edit-dialog.component';
import { AccountManagementChinhSuaNoJeeHRDialogComponent } from './kich-hoat-tai-khoan/account-management-chinhsua-nojeehr-dialog/account-management-chinhsua-nojeehr-dialog.component';
import { AccountManagementChinhSuaJeeHRDialogComponent } from './kich-hoat-tai-khoan/account-management-chinhsua-jeehr-dialog/account-management-chinhsua-jeehr-dialog.component';
import { AccountManagementJeeHRActivatedComponent } from './kich-hoat-tai-khoan/account-management-jeehr-activated/account-management-jeehr-activated.component';
import { AccountManagementJeeHRAddStaffDialogComponent } from './kich-hoat-tai-khoan/account-management-jeehr-add-staff-dialog/account-management-jeehr-add-staff-dialog.component';
import { AccountManagementAddStaffDialogComponent } from './kich-hoat-tai-khoan/account-management-add-staff-dialog/account-management-add-staff-dialog.component';
import { AccountManagementService } from './kich-hoat-tai-khoan/Services/account-management.service';
import { PaginatorComponent } from 'src/app/modules/crud/paginator/paginator.component';
import { NgPagination } from 'src/app/modules/crud/paginator/ng-pagination/ng-pagination.component';
import { DropdownStructHRDetailsModule } from 'src/app/modules/components/dropdown-struct-hr-details/dropdown-struct-hr-details.module';
import { DropdownStructDetailsModule } from 'src/app/modules/components/dropdown-struct-details/dropdown-struct-details.module';
import { PhanQuyenTaiKhoanService } from './phan-quyen-tai-khoan/Services/permision-admin-app.service';
import { MatTableModule } from '@angular/material/table';
import { AccountManagementJeeHRUpdateInfoDialogComponent } from './kich-hoat-tai-khoan/account-management-jeehr-update-info/account-management-jeehr-update-info.component';
import { ThongTinDoanhNghiepComponent } from './thong-tin-doanh-nghiep/thong-tin-doanh-nghiep.component';

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
    GuideSystemComponent,
    ThietLapBanDauComponent,
    ThongTinDoanhNghiepComponent,
    KichHoatTaiKhoanComponent,
    PhanQuyenTaiKhoanComponent,
    HoanThanhKhoiTaoComponent,
    SafeHtmlPipe,
    //kích hoạt tài khoản
    PaginatorComponent,
    NgPagination,
    ChangeTinhTrangEditDialogComponent,
    AccountManagementChinhSuaNoJeeHRDialogComponent,
    AccountManagementChinhSuaJeeHRDialogComponent,
    AccountManagementJeeHRActivatedComponent,//Form kích hoạt tài khoản
    AccountManagementJeeHRAddStaffDialogComponent,//Tạo hồ sơ mới có sử dụng HR
    AccountManagementAddStaffDialogComponent,//Tạo hồ sơ mới không có sử dụng HR
    AccountManagementJeeHRUpdateInfoDialogComponent,//Cập nhật thông tin
    // ==========================================
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    NgApexchartsModule,
    NgbDropdownModule,
    GridsterModule,
    DynamicModule,
    MatIconModule,
    MatButtonToggleModule,
    MatSlideToggleModule,
    PerfectScrollbarModule,
    MatIconModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    NgbDatepickerModule,
    MatMenuModule,
    AvatarModule,
    MatTooltipModule,
    MatFormFieldModule,
    FormsModule,
    ChartsModule,
    MatExpansionModule,
    //======================
    NgxMatSelectSearchModule,
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatMomentDateModule,
    MatRadioModule,
    MatSidenavModule,
    TranslateModule,
    NgbModule,
    MatInputModule,
    MatDialogModule,
    ScrollingModule,
    MatTabsModule,
    NgbTooltipModule,
    MatBadgeModule,
    MatCardModule,
    MatInputModule,
    MatDialogModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatButtonModule,
    ScrollingModule,
    HttpClientModule,
    MatSnackBarModule,
    MatTableModule,
    DropdownStructHRDetailsModule,
    DropdownStructDetailsModule,
    //======================
    RouterModule.forChild([
      {
        path: '',
        component: GuideSystemComponent,
        children: [
          {
            path: '',
            component: ThietLapBanDauComponent,
          },
          {
            path: '1',
            component: KichHoatTaiKhoanComponent,
          },
          {
            path: '2',
            component: PhanQuyenTaiKhoanComponent,
          },
          {
            path: '3',
            component: HoanThanhKhoiTaoComponent,
          },
          {
            path: '4',
            component: ThongTinDoanhNghiepComponent,
          },
        ]
      },
    ]),
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_EDIT },
    GuideSystemService,
    AccountManagementService,
    PhanQuyenTaiKhoanService,
  ],
  entryComponents: [
    //kích hoạt tài khoản
    ChangeTinhTrangEditDialogComponent,
    AccountManagementChinhSuaNoJeeHRDialogComponent,
    AccountManagementChinhSuaJeeHRDialogComponent,
    AccountManagementJeeHRActivatedComponent,//Form kích hoạt tài khoản
    AccountManagementJeeHRAddStaffDialogComponent,//Tạo hồ sơ mới có sử dụng HR
    AccountManagementAddStaffDialogComponent,//Tạo hồ sơ mới không có sử dụng HR
    AccountManagementJeeHRUpdateInfoDialogComponent,//Cập nhật thông tin
    // ==========================================
  ],
})
export class GuideSystemModule { }
