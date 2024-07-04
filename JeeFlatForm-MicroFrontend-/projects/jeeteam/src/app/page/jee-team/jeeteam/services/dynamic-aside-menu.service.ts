import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
// import { DynamicAsideMenuConfig } from '../../configs/dynamic-aside-menu.config';
import * as objectPath from 'object-path';
import { MenuConfigService } from './menu-config.service';
const emptyMenuConfig = {
  items: []
};

@Injectable({
  providedIn: 'root'
})
export class DynamicAsideMenuService {
  private menuConfigSubject = new BehaviorSubject<any>(emptyMenuConfig);
  menuConfig$: Observable<any>;
  constructor(private menuConfigService: MenuConfigService) {
    this.menuConfig$ = this.menuConfigSubject.asObservable();
    // this.loadMenu();
  }

  // Here you able to load your menu from server/data-base/localStorage
  // Default => from DynamicAsideMenuConfig
  public loadMenu(keysearch: any) {
    this.setMenu(keysearch);
  }

  public async setMenu(keysearch: any) {
    let menuConfig = {
      items: []
    };
    const menuItems: any[] = objectPath.get(await this.menuConfigService.getMenus(keysearch), 'aside.items');
    menuConfig.items = menuItems;
    this.menuConfigSubject.next(menuConfig);
    // this.menuConfigSubject.next(menuConfig);
  }
  public async ReloadMenu() {

    let menuConfig = {
      items: []
    };
    const menuItems: any[] = objectPath.get(await this.menuConfigService.getMenus(""), 'aside.items');
    menuConfig.items = menuItems;
    this.menuConfigSubject.next(menuConfig);
  }

  private getMenu(): any {
    return this.menuConfigSubject.value;
  }
}
