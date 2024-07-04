import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from '../Model/user.model';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

@Component({
  selector: 'app-topbar-profile',
  templateUrl: './topbar-profile.component.html',
  styleUrls: ['./topbar-profile.component.scss'],
})
export class TopbarProfileComponent implements OnInit {
  user$: Observable<UserModel>;
  // tobbar extras
  extrasUserDisplay: boolean;
  extrasUserLayout: 'offcanvas' | 'dropdown';
  // layout
  Avatar: string;
  BgColor: string;
  name: string;
  constructor(private auth: AuthService) {
    const user = this.auth.getAuthFromLocalStorage()['user'];
    this.name = user['customData']['personalInfo']['Name'];
    this.Avatar = user['customData']['personalInfo']['Avatar'];
    this.BgColor = user['customData']['personalInfo']['BgColor'];
  }

  ngOnInit(): void {

  }
}
