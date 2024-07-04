import { CommonModule, DatePipe } from "@angular/common";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule, MatRippleModule, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatDialogModule } from "@angular/material/dialog";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { RouterModule, Routes } from "@angular/router";
import { NgbDatepickerModule, NgbModalModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { AvatarModule } from "ngx-avatar";
import { DanhMucLoaiHopDongListComponent } from "./danh-muc-loai-hop-dong-list/danh-muc-loai-hop-dong-list.component";
import { DanhMucLoaiHopDongService } from "./Services/danh-muc-loai-hop-dong.service";
import { HttpUtilsService } from "projects/wizard-platform/src/modules/crud/utils/http-utils.service";
import { DanhMucLoaiHopDongComponent } from "./danh-muc-loai-hop-dong.component";
import { LayoutUtilsService } from "projects/wizard-platform/src/modules/crud/utils/layout-utils.service";
import { TranslationService } from "projects/wizard-platform/src/modules/i18n/translation.service";
import { DanhMucLoaiHopDongEditDialogComponent } from "./danh-muc-loai-hop-dong-edit-dialog/danh-muc-loai-hop-dong-edit-dialog.component";
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

const routes: Routes = [
  {
    path: '',
    component: DanhMucLoaiHopDongComponent,
    children: [
      {
        path: '',
        component: DanhMucLoaiHopDongListComponent,
      },
    ]
  }
];

@NgModule({
  declarations: [
    DanhMucLoaiHopDongComponent,
    DanhMucLoaiHopDongListComponent,
    DanhMucLoaiHopDongEditDialogComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule,
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
    MatSnackBarModule,
    MatTableModule,
    MatExpansionModule,
    MatSortModule,
    MatChipsModule,
    MatPaginatorModule,
    MatDialogModule,
    MatRippleModule,
    MatRadioModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    AvatarModule,
    MatTooltipModule,
    NgbModalModule,
    NgbDatepickerModule,
    HttpClientModule,
    TranslateModule.forRoot(),
    HttpClientModule,
  ],
  entryComponents: [
    DanhMucLoaiHopDongEditDialogComponent,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS_EDIT },
    DanhMucLoaiHopDongService,
    HttpUtilsService,
    LayoutUtilsService,
    TranslationService,
  ],
})
export class DanhMucLoaiHopDongModule { }
