
import { Component, OnInit, Input } from '@angular/core';
import { QuanLyCuocHopService } from '../../../_services/quan-ly-cuoc-hop.service';

@Component({
  selector: 'app-avatar-user-dept',
  templateUrl: './avatar-user-dept.component.html',
})
export class AvatarUserDeptComponent implements OnInit {

  @Input() image:string = '';
  @Input() name:string = '';
  @Input() info:string = '';
  @Input() size:number = 25;
  @Input() textcolor:any = 'black';
  @Input() showFull:boolean = false;
  constructor(
    public qLCuocHopService: QuanLyCuocHopService
  ) { }

  ngOnInit() {
  }

}
