import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'jeeteam';
  listAppCode: any;
  constructor(

  ) { this.listAppCode = JSON.parse(localStorage.getItem('appCode')) }
}
