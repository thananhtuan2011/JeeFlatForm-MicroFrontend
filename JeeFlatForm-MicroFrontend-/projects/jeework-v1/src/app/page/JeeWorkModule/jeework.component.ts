import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuServices } from '../services/menu.service';
import { SocketioService } from '../services/socketio.service';
import { locale as viLang } from '../../../../src/modules/i18n/vocabs/vi';
import { TranslationService } from 'projects/jeework-v1/src/modules/i18n/translation.service';
import { environment } from 'projects/jeework-v1/src/environments/environment.prod';
import { fromEvent } from 'rxjs';
@Component({
	selector: 'm-jeework',
	templateUrl: './jeework.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class JeeWorkComponent implements OnInit {
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

	ngOnInit() {
		// this.GetListMenu();
		// this.socketService.listen().subscribe((res: any) => {
		// 	this.GetListMenu();
		// })
		//=====Bổ sung store load submenu====
		// const $eventload = fromEvent<CustomEvent>(window, 'event-submenu').subscribe((e) => this.onEventLoadMenu(e));
	}

	onEventLoadMenu(e: CustomEvent) {
		if (e.detail.eventType === 'update-sub-jeeworkv1') {
			this.GetListMenu();
		}
	}
	//===================Menu===============================
	listMenu: any[] = [];
	// langcode = 'vi';
	GetListMenu() {
		this.menuServices.GetListMenu("Work").subscribe(res => {
			if (res && res.status == 1) {
				this.listMenu = res.data;
				this.listMenu.map((item, index) => {
					let _title = "";
					// if (item.Title != "") {
					// 	_title = this.translate.instant('SubMenu.' + '' + item.Title);
					// }
					item.Title = item.Title_Res;
				})
				this.changeDetectorRefs.detectChanges();
			}
		})
	}
	//========================================================
	__selectedNode = "/CongViecTheoDuAn";
	RouterLink(val) {
		this.__selectedNode = val.ALink;
		let link = "";
		link = "/" + environment.HOST_ALINK + val.ALink;
		this.router.navigate([`${link}`]);
	}
	RouterLink1(val) {
		this.__selectedNode = val;
		let link = "";
		link = "/" + environment.HOST_ALINK + val;
		this.router.navigate([`${link}`]);
		console.log(link);
	}

	updateReadMenu(item) {
		let _item = {
			"appCode": "WORK",
			"mainMenuID": 2,
			"subMenuID": item.RowID,
		}
		// this.socketioStore.updateMain = false;
		// this.socketService.readNotification_menu(_item).subscribe(res => {
		// 	this.socketioStore.updateMain = true;
		// 	this.GetListMenu();
		// })
	}

	getSelectNode(): string {
		this.__selectedNode = window.location.pathname.split("/" + environment.HOST_ALINK)[1];
		let split = this.__selectedNode.split("/");
		if (split.length > 2) {
			this.__selectedNode = "/" + this.__selectedNode.split("/")[1];
		}
		return this.__selectedNode;
	}
}
