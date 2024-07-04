import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription, fromEvent } from 'rxjs';
import { JeeAdminService } from './Services/jeeadmin.service';
import { MenuServices } from './Services/menu.service';
import { SocketioService } from './Services/socketio.service';
import { TranslationService } from 'projects/jeeadmin/src/modules/i18n/translation.service';
import { locale as viLang } from 'projects/jeeadmin/src/modules/i18n/vocabs/vi';

@Component({
	selector: 'm-jeeadmin',
	templateUrl: './jeeadmin.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class JeeAdminComponent implements OnInit, OnDestroy {

	private _subscriptions: Subscription[] = [];

	constructor(
		private menuServices: MenuServices,
		private translate: TranslateService,
		private jeeAdminService: JeeAdminService,
		private changeDetectorRefs: ChangeDetectorRef,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private socketService: SocketioService,
		private translationService: TranslationService,
		) { 
			this.translationService.loadTranslations(
				viLang,
			);
			var langcode = localStorage.getItem('language');
			if (langcode == null)
				langcode = this.translate.getDefaultLang();
			this.translationService.setLanguage(langcode);
		}

	async ngOnInit() {
		await this.checkAdmin();
		this.GetListMenu();
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

	}

	isAdmin: boolean = false;
	async checkAdmin() { 
		let res = await this.jeeAdminService.checkAdmin().toPromise();
		if(res) {
			if (res && res.status == 1) {
				this.isAdmin = res.data;
				this.changeDetectorRefs.detectChanges();
			}
		}
	}

	ngOnDestroy() {
		if (this._subscriptions) {
			this._subscriptions.forEach((sb) => sb.unsubscribe());
		}
	}

	//===================Menu===============================
	listMenu: any[] = [];
	GetListMenu() {
		this.menuServices.GetListMenu("Admin").subscribe(res => {
			if (res && res.status == 1) {
				this.listMenu = res.data;
				this.listMenu.map((item, index) => {
					let _title = "";
					if (item.Title != "") {
						_title = this.translate.instant('SubMenu.' + '' + item.Title);
					}
					item.Title = _title;
				})
				if (!this.isAdmin) {
					let idx = this.listMenu.findIndex(x => x.RowID == 12);
					this.listMenu.splice(idx, 1);
				}

				this.changeDetectorRefs.detectChanges();
			}

			// this.listMenu = [
			// 	{
			// 		RowID: 12,
			// 		Title: "Quản lý tài sản",
			// 		Icon: "",
			// 		ALink: "/quan-ly-tai-san"
			// 	},
			// 	{
			// 		RowID: 11,
			// 		Title: "Yêu cầu văn phòng phẩm",
			// 		Icon: "",
			// 		ALink: "/yeucau-vpp"
			// 	},
			// 	{
			// 		RowID: 10,
			// 		Title: "Đăng ký tài sản",
			// 		Icon: "",
			// 		ALink: "/dang-ky-tai-san"
			// 	}
			// ]
		})
	}

	//========================================================
	__selectedNode = "/dang-ky-tai-san";
	RouterLink(val) {
		let obj = this.listMenu.find(x => x.ALink === val.ALink);
		if (obj && obj.SoLuong > 0) {
			this.updateReadMenu(obj);
		}
		this.__selectedNode = val.ALink;
		let link = "/Admin" + val.ALink;
		this.router.navigate([`${link}`]);
	}

	updateReadMenu(item) {
		let _item = {
			"appCode": "ADMIN",
			"mainMenuID": 6,
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
		this.__selectedNode = window.location.pathname.split("/Admin")[1];
		let split = this.__selectedNode.split("/");
		if (split.length > 2) {
			this.__selectedNode = "/" + this.__selectedNode.split("/")[1];
		}
		return this.__selectedNode;
	}

	onEventLoadMenu(e: CustomEvent) {
		if (e.detail.eventType === 'update-sub-admin') {
			this.GetListMenu();
		}
	}
}
