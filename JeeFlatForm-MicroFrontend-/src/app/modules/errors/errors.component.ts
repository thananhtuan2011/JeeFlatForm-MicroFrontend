import { Component, HostBinding, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  DrawerComponent,
  MenuComponent,
  ScrollComponent,
  ScrollTopComponent,
  StickyComponent,
  ToggleComponent,
} from '../../_metronic/kt/components';
import { AsideService } from 'src/app/_metronic/layout/components/aside/aside.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss'],
})
export class ErrorsComponent implements OnInit {
  @HostBinding('class') class = 'd-flex flex-column flex-root';
  LogoApp: string;
  constructor(private router: Router,
    private aside_service: AsideService,
    private titleService: Title,
  ) { }

  ngOnInit(): void {
    //this.LogoApp = localStorage.getItem('logoApp');
    let domain = this.getDomainRedirect();
    if (domain == 'dp247.vn')
      this.LogoApp = './assets/logo/DP247-Text.png';
    else
      this.LogoApp = './assets/logo/Jee_Landing-Text.png'; //mặc định

    this.aside_service.getLogoApp(3).subscribe(res => {
      if (res && res.status == 1) {
        let iconApp = res.data.IconApp;
        document.getElementById('iconApp').setAttribute('href', iconApp);//fav Icon
        this.titleService.setTitle(localStorage.getItem('titleApp'));
      }
    })
  }

  getDomainRedirect(): string {
    let domain = '';
    let _hostname = window.location.hostname;
    if (_hostname == 'localhost') {
      domain = 'jee.vn'
    } else {
      let hostname = ''
      hostname = _hostname.replace(_hostname.split('.')[0] + '.', '');
      domain = hostname
    }
    return domain;
  }

  routeToDashboard() {
    this.router.navigate(['Dashboard']);
    setTimeout(() => {
      ToggleComponent.bootstrap();
      ScrollTopComponent.bootstrap();
      DrawerComponent.bootstrap();
      StickyComponent.bootstrap();
      MenuComponent.bootstrap();
      ScrollComponent.bootstrap();
    }, 200);
  }
}
