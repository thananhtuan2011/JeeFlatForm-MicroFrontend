import { Component, OnInit, AfterViewInit, Input, SimpleChange } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../Model/user.model';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-topbar-notify',
  templateUrl: './topbar-notify.component.html',
  styleUrls: ['./topbar-notify.component.scss'],
})
export class TopbarNotifyComponent implements OnInit {
  user$: Observable<UserModel>;
  // tobbar extras
  extrasNotificationsDisplay: boolean;
  extrasNotificationsLayout: 'offcanvas' | 'dropdown';
  @Input() numberInfo: any;
  number: number = 0;
  constructor(private auth: AuthService) {
  }

  ngOnChanges(changes: SimpleChange) {
    if (changes['numberInfo']) {
      this.number = +changes['numberInfo'].currentValue;
    }
  }

  ngOnInit(): void {
   
  }
}
