import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MenuWorkModule } from './jee-work/MenuWork/menu-work.module';
import { MenuWorkRoutingkModule } from './jee-work/MenuWork/menu-work-routing.module';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DanhMucChungService } from './jee-work/services/danhmuc.service';
import { HttpClientModule } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from '../../modules/i18n/translation.service';
import { LayoutUtilsService } from '../../modules/crud/utils/layout-utils.service';
import { HttpUtilsService } from '../../modules/crud/utils/http-utils.service';
import { DynamicSearchFormService } from 'projects/jeehr/src/app/page/JeeHRModule/component/dynamic-search-form/dynamic-search-form.service';
import '../../../../jeework/src/styles.scss';
import { UploadFileService } from './jee-work/service-upload-files/service-upload-files.service';
@NgModule({
  declarations: [
  ],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    TranslateService,
    DanhMucChungService,
    TranslationService,
    LayoutUtilsService,
    HttpUtilsService,
    DatePipe,
    DynamicSearchFormService,
    LayoutUtilsService,
    UploadFileService
  ],
  imports: [
    CommonModule,
    MenuWorkModule,
    HttpClientModule,
    MenuWorkRoutingkModule,
  ]
})
export class JeeWorkModule { }
