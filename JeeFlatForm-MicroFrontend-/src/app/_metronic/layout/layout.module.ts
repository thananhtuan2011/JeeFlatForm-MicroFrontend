import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InlineSVGModule } from 'ng-inline-svg';
import { RouterModule, Routes } from '@angular/router';
import {
  NgbDropdownModule,
  NgbProgressbarModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationModule } from '../../modules/i18n';
import { LayoutComponent } from './layout.component';
import { ExtrasModule } from '../partials/layout/extras/extras.module';
import { Routing } from '../../pages/routing';
import { AsideComponent } from './components/aside/aside.component';
import { HeaderComponent } from './components/header/header.component';
import { ContentComponent } from './components/content/content.component';
import { FooterComponent } from './components/footer/footer.component';
import { ScriptsInitComponent } from './components/scripts-init/scripts-init.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { AsideMenuComponent } from './components/aside/aside-menu/aside-menu.component';
import { TopbarComponent } from './components/topbar/topbar.component';
import { PageTitleComponent } from './components/header/page-title/page-title.component';
import { HeaderMenuComponent } from './components/header/header-menu/header-menu.component';
import { DrawersModule, DropdownMenusModule, ModalsModule, EngagesModule } from '../partials';
import { EngagesComponent } from "../partials/layout/engages/engages.component";
import { AsideMenuLeftComponent } from './components/aside/aside-menu-left/aside-menu-left.component';
import { MenuServices } from '../core/services/menu.service';
import { AvatarModule } from "ngx-avatar";
import { MatIconRegistry, MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { TopbarProfileComponent } from './components/topbar-profile/topbar-profile.component';
import { TopbarNotifyComponent } from './components/topbar-notify/topbar-notify.component';
import { TopbarQuickActComponent } from './components/topbar-quickact/topbar-quickact.component';
import { LayoutService } from './core/layout.service';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { SettingMenuComponent } from './components/aside/aside-menu-left/setting-menu/setting-menu.component';
import { MatButtonModule } from '@angular/material/button';
const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: Routing,
  },
];

@NgModule({
  declarations: [
    LayoutComponent,
    AsideComponent,

    HeaderComponent,
    ContentComponent,
    FooterComponent,
    ScriptsInitComponent,
    ToolbarComponent,
    AsideMenuComponent,
    TopbarComponent,
    PageTitleComponent,
    HeaderMenuComponent,
    EngagesComponent,
    AsideMenuLeftComponent,//Thiên menu left 
    TopbarProfileComponent,//Thiên - thay đổi giao diện (27/02/2023)
    TopbarNotifyComponent,//Thiên - thay đổi giao diện (27/02/2023)
    TopbarQuickActComponent,//Thiên - thay đổi giao diện (27/02/2023)
    SettingMenuComponent,//Thiên - Thiết lập menu thường dùng
  ],
  imports: [
    CommonModule,
    PerfectScrollbarModule,
    RouterModule.forChild(routes),
    TranslationModule,
    InlineSVGModule,
    NgbDropdownModule,
    NgbProgressbarModule,
    ExtrasModule,
    ModalsModule,
    DrawersModule,
    EngagesModule,
    DropdownMenusModule,
    NgbTooltipModule,
    TranslateModule,
    AvatarModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    MatBadgeModule,
    MatSlideToggleModule,
    FormsModule,
    MatButtonModule,
  ],
  entryComponents: [
    SettingMenuComponent,//Thiên - Thiết lập menu thường dùng
  ],
  providers: [
    MatIconRegistry,
    MenuServices,
  ],
  exports: [RouterModule, AsideMenuLeftComponent],
})
export class LayoutModule { }
