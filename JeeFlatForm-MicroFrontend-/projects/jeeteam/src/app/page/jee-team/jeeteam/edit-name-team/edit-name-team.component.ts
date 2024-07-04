import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JeeTeamService } from '../services/jeeteam.service';

@Component({
  selector: 'app-edit-name-team',
  templateUrl: './edit-name-team.component.html',
  styleUrls: ['./edit-name-team.component.scss']
})
export class EditNameTeamComponent implements OnInit {
  Teamname:string="";
  constructor( private changeDetectorRefs: ChangeDetectorRef,
    private services:JeeTeamService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef:MatDialogRef<EditNameTeamComponent>,) { }

  ngOnInit(): void {
    console.log
    this.Teamname=this.data.title
  }
  CloseDia(data = undefined)
  {
      this.dialogRef.close(data);
  }
  goBack() {
  
     this.dialogRef.close();
   
   }
 
   EditGroupName()
   {
 
     this.services.EditNameMenu(this.data.RowId,this.Teamname).subscribe(res=>
       {
         if (res && res.status === 1) {
           this.CloseDia(res);
         }
       })
     
   }
   
submit()
{  this.EditGroupName();
}

}
