import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'projects/jeerequest/src/modules/i18n/translation.service';
import { locale as viLang } from '../../../../src/modules/i18n/vocabs/vi';
@Component({
	selector: 'm-jeerequest',
	templateUrl: './jeerequest.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class JeeRequestComponent implements OnInit {
	constructor(private translationService: TranslationService,
    private translate: TranslateService,
	) {
    debugger
    this.translationService.loadTranslations(
      viLang,
  );
  var langcode = localStorage.getItem('language');
  if (langcode == null)
      langcode = this.translate.getDefaultLang();
  this.translationService.setLanguage(langcode);
  }
	ngOnInit() {
	}
}
