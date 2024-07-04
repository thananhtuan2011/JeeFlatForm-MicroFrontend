import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-meet-detai-empty',
  templateUrl: './meet-detai-empty.component.html',
  styleUrls: ['../meet-detail/meet-detail.component.scss']
})
export class MeetDetaiEmptyComponent implements OnInit {
  color: string = "#00b3ff"
  constructor() { }

  ngOnInit(): void {
  }

}
