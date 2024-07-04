import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TranslationService } from 'projects/jeeteam/src/modules/i18n/translation.service';
import { locale as viLang } from 'projects/jeeteam/src/modules/i18n/vocabs/vi';
import { JeeTeamService } from './services/jeeteam.service';
import { MenuJeeTeamServices } from './services/menu_jeeteam.service';
import { fromEvent } from 'rxjs';
// import KTLayoutAsideMenu from '../../../../assets';
@Component({
  selector: 'app-jeeteam',
  templateUrl: './jeeteam.component.html',
  styleUrls: ['./jeeteam.component.scss']
})
export class JeeteamComponent implements OnInit {
  searchText: string = ''
  Admin: any

  constructor(private menu_services: MenuJeeTeamServices, private dashboar_service: JeeTeamService, private translationService: TranslationService, private translate: TranslateService,) { }
  GetPhanQuyen() {
    this.dashboar_service.GetPhanQuyen().subscribe(res => {

      if (res) {
        if (res.data.length > 0)
          this.Admin = res.data[0].IdGroup
      }

    })
  }

  ClearSearch() {
    this.searchText = ''
    this.dashboar_service.data_share__Search = undefined
  }
  search() {
    this.dashboar_service.data_share__Search = (this.searchText)
  }
  Add() {
    this.dashboar_service.created_group.next(true);
  }
  ngOnInit(): void {

    this.GetPhanQuyen();
    this.translationService.loadTranslations(
      viLang,
    );
    var langcode = localStorage.getItem('language');
    if (langcode == null)
      langcode = this.translate.getDefaultLang();
    this.translationService.setLanguage(langcode);
  }
  onKeydownHandler() {

  }


  getWidth() {
    let tmp_width = 0;
    tmp_width = window.innerWidth - 420;
    return tmp_width + 'px';
  }
}
