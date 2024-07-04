import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'kt-avatar-list-users-mt',
  templateUrl: './avatar-list-users-mt.component.html',
})
export class AvatarListUsersMTComponent implements OnInit {

  @Input() ListUser:any = [];
  @Input() MaxSize:number = 3;
  @Input() iconSize:number = 35;
  constructor() { }

  ngOnInit() {
  }

}
