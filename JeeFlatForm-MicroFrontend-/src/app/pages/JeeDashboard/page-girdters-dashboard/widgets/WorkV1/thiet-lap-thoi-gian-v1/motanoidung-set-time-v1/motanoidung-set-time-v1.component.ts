// Angular
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  ElementRef,
} from "@angular/core";
import {
  FormBuilder,
} from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: 'app-motanoidung-set-time-v1',
  templateUrl: './motanoidung-set-time-v1.component.html',
  styleUrls: ['./motanoidung-set-time-v1.component.scss']
})
export class MotanoidungSetTimeV1Component implements OnInit {
  item:any;
  constructor(
    public dialogRef: MatDialogRef<MotanoidungSetTimeV1Component>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
  }
  dataSource = this.data.item;;
  displayedColumns: string[] = ['title', 'desception'];
  ngOnInit(): void {
    this.item=this.data.item;
  }
  goback(){
    this.dialogRef.close();
  }
}
