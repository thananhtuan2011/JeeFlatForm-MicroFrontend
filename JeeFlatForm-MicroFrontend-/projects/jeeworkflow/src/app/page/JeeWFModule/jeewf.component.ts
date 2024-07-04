import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, fromEvent } from 'rxjs';
import { MenuServices } from '../services/menu.service';
import { locale as viLang } from '../../../../src/modules/i18n/vocabs/vi';
import { TranslationService } from 'projects/jeeworkflow/src/modules/i18n/translation.service';
import { SocketioService } from '../services/socketio.service';

@Component({
	selector: 'm-jeewf',
	templateUrl: './jeewf.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class JeeWFComponent implements OnInit, OnDestroy {
	constructor(
		private menuServices: MenuServices,
		private translationService: TranslationService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private socketService: SocketioService,
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
		this.GetListMenu();
		this.socketService.listen().subscribe((res: any) => {
			this.GetListMenu();
		})
		//=====Bổ sung store load submenu====
		const $eventload = fromEvent<CustomEvent>(window, 'event-submenu').subscribe((e) => this.onEventLoadMenu(e));
	}
	ngOnDestroy() {
		if (this._subscriptions) {
			this._subscriptions.forEach((sb) => sb.unsubscribe());
		}
		// this.messageService.Newmessage.unsubscribe();
	}

	onEventLoadMenu(e: CustomEvent) {
		if (e.detail.eventType === 'update-sub-jeewf') {
		  this.GetListMenu();
		}
	  }
	
	//===================Menu===============================
	listMenu: any[] = [];
	GetListMenu() {
		this.menuServices.GetListMenu("Workflow").subscribe(res => {
			if (res && res.status == 1) {
				this.listMenu = res.data;
				this.listMenu.map((item, index) => {
					let _title = "";
					if (item.Title != "") {
						_title = this.translate.instant('SubMenu.' + '' + item.Title);
					}
					item.Title = _title;
				})
				this.changeDetectorRefs.detectChanges();
			}
		})
	}
	//========================================================
	__selectedNode = "/CongViecTheoQuyTrinh";
	RouterLink(val) {
		this.__selectedNode = val.ALink;
		let link = "/Workflow" + val.ALink;
		this.router.navigate([`${link}`]);
	}

	getSelectNode(): string {
		this.__selectedNode = window.location.pathname.split("/Workflow")[1];
		let split = this.__selectedNode.split("/");
		if (split.length > 2) {
			this.__selectedNode = "/" + this.__selectedNode.split("/")[1];
		}
		return this.__selectedNode;
	}
}
