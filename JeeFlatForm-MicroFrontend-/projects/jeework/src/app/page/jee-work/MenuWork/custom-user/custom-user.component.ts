import { Component, OnInit,Input } from '@angular/core';
import { DanhMucChungService } from '../../services/danhmuc.service';
@Component({
  selector: 'kt-custom-user',
  templateUrl: './custom-user.component.html',
  styleUrls: ['./custom-user.component.scss']
})
export class CustomUserComponent implements OnInit {

  @Input() image:string = '';
  @Input() name:string = '';
  @Input() info:string = '';
  @Input() textcolor:any = undefined;
  @Input() style:boolean = false;
  constructor(
    public WeWorkService:DanhMucChungService,
  ) { }

  ngOnInit() {
  }

}