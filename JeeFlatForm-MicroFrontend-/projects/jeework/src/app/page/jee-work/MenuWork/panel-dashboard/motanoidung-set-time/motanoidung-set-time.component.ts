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
import { WorksbyprojectService } from "../Services/worksbyproject.service";

@Component({
  selector: 'app-motanoidung-set-time',
  templateUrl: './motanoidung-set-time.component.html',
  styleUrls: ['./motanoidung-set-time.component.scss']
})
export class MotanoidungSetTimeComponent implements OnInit {
  item:any;
  constructor(
    public _WorksbyprojectService: WorksbyprojectService,
    public dialogRef: MatDialogRef<MotanoidungSetTimeComponent>,
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
