import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jeechat';
  usertheme: any;
  constructor(

  ) { this.usertheme = JSON.parse(localStorage.getItem('user-theme')) }
}
