import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, fromEvent } from 'rxjs';
import { MenuServices } from '../services/menu.service';
import { TranslationService } from 'projects/jeehr/src/modules/i18n/translation.service';
import { locale as viLang } from '../../../../src/modules/i18n/vocabs/vi';
import { SocketioService } from '../services/socketio.service';
import { environment } from 'projects/jeehr/src/environments/environment';
import { LayoutUtilsService, MessageType } from 'projects/jeehr/src/modules/crud/utils/layout-utils.service';

@Component({
	selector: 'm-jeehr',
	templateUrl: './jeehr.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class JeeHRComponent implements OnInit, OnDestroy {
	constructor(
		private menuServices: MenuServices,
		private translationService: TranslationService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private router: Router,
		private socketService: SocketioService,
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
	private _subscriptions: Subscription[] = [];
	ngOnInit() {
		this.GetListMenu();
		this.socketService.connect();
		this.socketService.listen().subscribe((res: any) => {
			this.GetListMenu();
		})
		setTimeout(() => {
			let obj = this.listMenu.find(x => x.ALink === this.__selectedNode);
			if (obj && obj.SoLuong > 0) {
				this.updateReadMenu(obj);
			}
		}, 10000);
		//=====Bổ sung store load submenu====
		const $eventload = fromEvent<CustomEvent>(window, 'event-submenu').subscribe((e) => this.onEventLoadMenu(e));
		//=====Bổ sung api check version web=====
		this.GetVersionWeb();
	}
	ngOnDestroy() {
		if (this._subscriptions) {
			this._subscriptions.forEach((sb) => sb.unsubscribe());
		}
	}
	//===================Menu===============================
	listMenu: any[] = [];
	GetListMenu() {
		this.menuServices.GetListMenu("HR").subscribe(res => {
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
	__selectedNode = "/DonTu";
	RouterLink(val) {
		let obj = this.listMenu.find(x => x.ALink === val.ALink);
		if (obj && obj.SoLuong > 0) {
			this.updateReadMenu(obj);
		}
		this.__selectedNode = val.ALink;
		let link = "/HR" + val.ALink;
		this.router.navigate([`${link}`]);
	}

	updateReadMenu(item) {
		let _item = {
			"appCode": "JeeHR",
			"mainMenuID": 5,
			"subMenuID": item.RowID,
		}
		this.socketService.readNotification_menu(_item).subscribe(res => {
			this.GetListMenu();
			const busEvent = new CustomEvent('event-mainmenu', {
				bubbles: true,
				detail: {
					eventType: 'update-main',
					customData: 'some data here'
				}
			});
			dispatchEvent(busEvent);
		})
	}

	getSelectNode(): string {
		this.__selectedNode = window.location.pathname.split("/HR")[1];
		let split = this.__selectedNode.split("/");
		if (split.length > 2) {
			this.__selectedNode = "/" + this.__selectedNode.split("/")[1];
		}
		return this.__selectedNode;
	}

	onEventLoadMenu(e: CustomEvent) {
		if (e.detail.eventType === 'update-sub-jeehr') {
			this.GetListMenu();
		}
	}

	//=================Ngày 03/01/2024====================
	GetVersionWeb() {
		this.menuServices.Get_VerWeb(5).subscribe(res => {
			if (res && res.status == 1 && environment.VERSION_WEB == res.data) {
				return;
			} else {
				let message = "Phiên bản phần mềm đã quá cũ. Vui lòng nhấn tổ hợp phím Ctrl + F5 để tiếp tục sử dụng."
				this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		})
	}
}
