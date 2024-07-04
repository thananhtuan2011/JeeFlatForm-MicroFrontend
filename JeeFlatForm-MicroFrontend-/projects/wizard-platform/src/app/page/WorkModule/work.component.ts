import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy, Inject } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, fromEvent } from 'rxjs';
import { locale as viLang } from '../../../../src/modules/i18n/vocabs/vi';
import { TranslationService } from 'projects/wizard-platform/src/modules/i18n/translation.service';
import { LayoutUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { WorkwizardChungService } from './work.service';
import { Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
@Component({
	selector: 'm-work',
	templateUrl: './work.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkComponent implements OnInit, OnDestroy {
	listApp: any[] = [];
	constructor(
		private translationService: TranslationService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private router: Router,
		private layoutUtilsService: LayoutUtilsService,
		public _WorkwizardChungService: WorkwizardChungService,
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
	step: number = 1;
	next_step: number = 2;
	pre_step: number = 0;
	param: any[];
	private _subscriptions: Subscription[] = [];
	ngOnInit() {
		this._WorkwizardChungService.getLogoApp(3).subscribe(res => {
			if (res && res.status == 1) {
				let iconApp = res.data.IconApp;
				this._document.getElementById('iconApp').setAttribute('href', iconApp);//fav Icon
				this.titleService.setTitle(res.data.TitleApp);
			}
		})
		this._WorkwizardChungService.getListApp().subscribe(res => {
			if (res && res.status == 1) {
				this.listApp = res.data
			}
			this.changeDetectorRefs.detectChanges();
		})
		this.param = window.location.href.split('/');
		this.step = Number(this.param[this.param.length - 1]);
	}
	ngOnDestroy() {
		if (this._subscriptions) {
			this._subscriptions.forEach((sb) => sb.unsubscribe());
		}
	}
	NextStep() {
		if (this.step <= 5) {
			if (this.next_step != 5) {
				this.pre_step = this.step;
				this.step = this.next_step;
				this.next_step += 1;
			}
			else {
				this.pre_step = this.step;
				this.step = this.next_step;
			}
			this.router.navigate([`WizardWork/${this.step}`]);
		}
	}
	PreviousStep() {
		if (this.step > 1) {
			this.next_step = this.step;
			this.step = this.step - 1;
			this.pre_step = this.step - 1;

			this.router.navigate([`WizardWork/${this.step}`]);
		}
	}
	getFont(val) {
		if (val == this.step) return '#3699ff';
		return '';
	}
	Done() {
		this._WorkwizardChungService.UpdateInitStatusApp().subscribe(res => {
			if (res && res.statusCode === 1) {
				let obj = this.listApp.find(x => x.AppID == 34);
                if (obj) {
                    window.location.href = obj.BackendURL;
                } else {
                    this.router.navigate([`Config-System/3`]);
                }
			}
		})
	}
}
