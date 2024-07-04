import { Component, OnInit, Input } from '@angular/core';
import { WorkGeneralService } from '../../Services/work-general.services';

@Component({
  selector: 'kt-avatar-user',
  templateUrl: './avatar-user.component.html',
})
export class AvatarUserComponent implements OnInit {

  @Input() image: string = '';
  @Input() name: string = '';
  @Input() info: string = '';
  @Input() size: number = 25;
  @Input() textcolor: any = 'black';
  @Input() showFull: boolean = false;
  @Input() chucvu: string = '';
  constructor(
    public _WorkGeneralService: WorkGeneralService,
  ) { }

  ngOnInit() {
  }

  getMoreInformation(): string {
    return this.name + ' \n ' + this.chucvu;
  }

  getMoreInformation1(): string {
    let htmlStr = this.name + ' \n ' + "<span class=\"color-red\">" + this.chucvu + "</span>";
    const parser = new DOMParser();
    let  document = parser.parseFromString(htmlStr, "text/html");
    return document.documentElement.innerText;
  }
}
