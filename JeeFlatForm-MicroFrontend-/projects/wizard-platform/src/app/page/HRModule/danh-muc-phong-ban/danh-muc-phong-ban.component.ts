import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { TranslationService } from "projects/wizard-platform/src/modules/i18n/translation.service";
import { locale as viLang } from '../../../../../src/modules/i18n/vocabs/vi';

@Component({
    selector: 'app-danh-muc-phong-ban',
    templateUrl: './danh-muc-phong-ban.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DanhMucPhongBanComponent implements OnInit {
    constructor(
        private translationService: TranslationService,
        private translate: TranslateService,
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
    }
}