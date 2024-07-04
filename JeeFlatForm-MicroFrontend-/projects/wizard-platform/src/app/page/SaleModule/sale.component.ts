import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Inject } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, fromEvent } from 'rxjs';
import { locale as viLang } from '../../../../src/modules/i18n/vocabs/vi';
import { TranslationService } from 'projects/wizard-platform/src/modules/i18n/translation.service';
import { LayoutUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { DanhMucChungService } from './sale.service';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
@Component({
	selector: 'm-sale',
	templateUrl: './sale.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SaleComponent implements OnInit, OnDestroy {
	constructor(
		private translationService: TranslationService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		private _DanhMucChungService: DanhMucChungService,
		private titleService: Title,
		@Inject(DOCUMENT) private _document: HTMLDocument,

	) {
		this.translationService.loadTranslations(
			viLang,
		);
		var langcode = localStorage.getItem('language');
		if (langcode == null)
			langcode = this.translate.getDefaultLang();
		this.translationService.setLanguage(langcode);
	}
	private _subscriptions: Subscription[] = [];
	ngOnInit() {
		this._DanhMucChungService.getLogoApp(3).subscribe(res => {
			if (res && res.status == 1) {
				let iconApp = res.data.IconApp;
				this._document.getElementById('iconApp').setAttribute('href', iconApp);//fav Icon
				this.titleService.setTitle(res.data.TitleApp);
			}
		})
	}
	ngOnDestroy() {
		if (this._subscriptions) {
			this._subscriptions.forEach((sb) => sb.unsubscribe());
		}
	}

	getColor(text) {
		let Alink = window.location.pathname.split('/');
		let _count = 0;
		Alink.forEach(ele => {
			switch (ele) {
				case text:
					_count++
					break;
				default:
					break;
			}
		});
		if (_count > 0) {
			return "#3699ff";
		} else {
			return "";
		}
	}

	getWidth(): any {
		let tmp_height = 1360 - 270;
		return tmp_height + "px";
	}
}
