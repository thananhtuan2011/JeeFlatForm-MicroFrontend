// Angular
import { Injectable } from '@angular/core';
// RxJS
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MenuJeeTeamServices } from './menu_jeeteam.service';

@Injectable()
export class MenuConfigService {
	// Public properties
	onConfigUpdated$: Subject<any>;
	// Private properties
	private menuConfig: any;

	/**
	 * Service Constructor
	 */
	constructor(
		private menuPhanQuyenServices: MenuJeeTeamServices,
		private translate: TranslateService) {
		// register on config changed event and set default config
		this.onConfigUpdated$ = new Subject();
	}

	/**
	 * Returns the menuConfig
	 */
	async getMenus(keysearch: any) {
		//lấy menu phân quyền
		let res = await this.layMenu(keysearch).then();
		// console.log("bbbbb", res.data)
		let menu;
		menu = this.fs_Assign(res.data);
		// console.log("menu", menu)
		return menu;
	}

	layMenu(keysearch: any) {
		try {

			return this.menuPhanQuyenServices.layMenuChucNang(keysearch).toPromise();
		}
		catch (Ex) {

		}
	}

	fs_Assign(dt: any) {
		let config = {
			header: {
				self: {},
				items: []
			},
			aside: {
				self: {},
				items: []
			}
		};
		// let arr = [];
		dt.forEach((item, index) => {
			let _module = {
				title: this.translate.instant(item.title),
				root: item.submenu ? item.submenu.length > 0 : true,
				icon: '' + item.Icon,
				svg: '',
				isMember: item.isMember,
				RowId: '' + item.RowId,
				page: '/Group/team/' + item.RowId + "/",
				isAdmin: item.isAdmin,
			}
			if (item.submenu.length > 0) {
				if (item.submenu.length > 0) {
					_module["bullet"] = 'dot';
					_module["submenu"] = [];
					item.submenu.forEach((itemE, indexE) => {

						let _mainmenu = {
							title: itemE.isPrivate ? this.translate.instant('JEETEAM.' + '' + itemE.title) : itemE.title,
							page: itemE.isPrivate ? `/Group/team/${item.RowId}` : `/Group/team/${item.RowId}/chanel/` + itemE.RowIdSub,
							RowIdSub: '' + itemE.RowIdSub,
							AlowEdit: '' + itemE.AlowEdit,
							LengthChild: '' + item.submenuhi.length,
							RowId: '' + itemE.RowId,
							isPrivate: itemE.isPrivate

						};


						if (item.submenu.length == 0 && itemE.isPrivate) {
							_module["submenu"] = [];

						}
						else {

							_module["submenu"].push(_mainmenu);
						}

						if (itemE.submenu) {
							if (itemE.submenu.length > 0) {
								_mainmenu["bullet"] = 'dot';
								_mainmenu["submenu"] = [];
								itemE.submenu.forEach((itemchild, indexE) => {
									let _mainmenuchild = {
										title: itemchild.RowIdSub == 0 ? itemchild.title : this.translate.instant(itemchild.title),
										page: `/Group/team/${item.RowId}/chanel/private/` + itemE.RowIdSub + '/' + itemchild.RowIdSub,
										RowIdSubChild: '' + itemchild.RowIdSub,
										isPrivateChanel: true,
										AlowEdit: itemchild.AlowEdit,
										RowId: '' + itemchild.RowId
									};
									_module["submenu"].push(_mainmenuchild);
									// phần dành cho kênh ẩn
									if (item.submenuhi.length > 0) {
										_mainmenu["bullet"] = 'dot';
										_mainmenu["submenu"] = [];
										item.submenuhi.forEach((itemchildhi, indexE) => {
											let _mainmenuchildhi = {
												title: itemchildhi.title,
												page: itemchildhi.page.replace('dashboard', '/Group'),
												RowIdSubChild: '' + itemchildhi.RowIdSubChild,
												RowIdSub: '' + itemchildhi.RowIdSub,
												RowId: '' + itemchildhi.RowId
											};
											_mainmenu["submenu"].push(_mainmenuchildhi);

										});
									}



								});
							}
							else {

								if (item.submenuhi && itemE.isPrivate) {

									if (item.submenuhi.length > 0) {
										_mainmenu["bullet"] = 'dot';
										_mainmenu["submenu"] = [];
										item.submenuhi.forEach((itemchildhi, indexE) => {
											let _mainmenuchildhi = {
												title: itemchildhi.title,
												page: itemchildhi.page.replace('dashboard', '/Group'),
												RowIdSubChild: '' + itemchildhi.RowIdSubChild,
												RowIdSub: '' + itemchildhi.RowIdSub,
												RowId: '' + itemchildhi.RowId
											};

											_mainmenu["submenu"].push(_mainmenuchildhi);

										});
									}
								}
							}


						}
					});
				}


			}
			config.aside.items.push(_module);
		});
		return config;
	}
	// async GetHCRolesToLocalStorage() {
	// 	let res = await this.menuPhanQuyenServices.HCRoles().toPromise().then();
	// 	/* Check Role */
	// 	if (res.length == 0) {
	// 		alert('Bạn chưa có quyền trong hệ thống !');
	// 		window.location.href = environment.RootWeb;
	// 	}
	// 	/*------------*/
	// 	localStorage.setItem('HC_Roles', JSON.stringify(res));
	// }

	/**
	 * Load config
	 *
	 * @param config: any
	 */
	loadConfigs(config: any) {
		this.menuConfig = config;
		this.onConfigUpdated$.next(this.menuConfig);
	}
}
