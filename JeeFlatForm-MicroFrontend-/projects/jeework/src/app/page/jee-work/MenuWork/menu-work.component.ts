import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'src/app/modules/i18n';
import { DanhMucChungService } from '../services/danhmuc.service';
import { QueryParamsModelNew } from '../../models/query-models/query-params.model';
import { MenuWorkService } from './services/menu-work.services';
import { locale as viLang } from '../../../../../src/modules/i18n/vocabs/vi';
import { environment } from 'projects/jeework/src/environments/environment';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'jee-work',
  templateUrl: './menu-work.component.html',
})
export class MenuWorkComponent implements OnInit {

  constructor(
    private translationService: TranslationService,
    private translate: TranslateService,
    public _menuWorkSerVices: MenuWorkService,
    private layoutUtilsService: LayoutUtilsService,
  ) {
    this.translationService.loadTranslations(
      viLang,
    );
    var langcode = localStorage.getItem('language');
    if (langcode == null)
      langcode = this.translate.getDefaultLang();
    this.translationService.setLanguage(langcode);
  }
  ngOnInit(): void {
    //=====Bổ sung api check version web=====
    this.GetVersionWeb();
  }

  //=================Ngày 03/01/2024====================
  GetVersionWeb() {
    this._menuWorkSerVices.Get_VerWeb(12).subscribe(res => {
      if (res && res.status == 1) {
        let data: any = environment.VERSION_WEB;
        let data_web = data.replaceAll(".", "")
        let data_api = res.data.replaceAll(".", "");
        if (+data_api > +data_web) {
          let message = "Phiên bản phần mềm đã quá cũ. Vui lòng tải lại trang để tiếp tục sử dụng."
          this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        }
        else {
          return;
        }
      }
    })
  }
}
