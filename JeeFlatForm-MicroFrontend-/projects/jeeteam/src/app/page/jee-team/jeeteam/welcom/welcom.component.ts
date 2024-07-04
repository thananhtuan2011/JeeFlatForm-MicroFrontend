import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-welcom',
  templateUrl: './welcom.component.html',
  styleUrls: ['./welcom.component.scss']
})
export class WelcomComponent implements OnInit {
  themdark: boolean = false
  constructor(config: NgbCarouselConfig) {
    // customize default values of carousels used by this component tree
    config.interval = 5000;
    config.keyboard = true;
    config.pauseOnHover = true;
  }
  Event() {
    fromEvent(window, 'event').subscribe((res: any) => {

      if (res.detail == "UpdateTheme") {
        let them = localStorage.getItem('user-theme');

        if (them == 'dark-mode') {
          this.themdark = true
        }
        else {
          this.themdark = false
        }
      }
    })
  }
  getHeight(): any {
    let tmp_height = window.innerHeight - 70;
    return tmp_height + "px";
  }
  ngOnInit(): void {
    this.Event()
    let them = localStorage.getItem('user-theme');
    if (them == 'dark-mode') {
      this.themdark = true
    }
    else {
      this.themdark = false
    }
  }

}
