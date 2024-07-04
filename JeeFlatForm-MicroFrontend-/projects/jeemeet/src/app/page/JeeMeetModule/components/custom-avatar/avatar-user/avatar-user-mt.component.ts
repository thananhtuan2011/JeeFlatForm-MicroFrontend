
import { Component, OnInit, Input } from '@angular/core'; 
import { DangKyCuocHopService } from '../../../_services/dang-ky-cuoc-hop.service';

@Component({
  selector: 'kt-avatar-user-mt',
  templateUrl: './avatar-user-mt.component.html', 
})
export class AvatarUserMTComponent implements OnInit {

  @Input() image:string = '';
  @Input() name:string = '';
  @Input() info:string = '';
  @Input() size:number = 25;
  @Input() textcolor:any = 'black';
  @Input() showFull:boolean = false;
  constructor(
    public dangKyCuocHopService: DangKyCuocHopService
  ) { }

  ngOnInit() {
  }

}
