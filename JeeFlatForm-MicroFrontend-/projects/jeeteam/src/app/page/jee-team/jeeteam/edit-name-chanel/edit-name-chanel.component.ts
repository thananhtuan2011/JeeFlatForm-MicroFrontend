import { JeeTeamService } from './../services/jeeteam.service';
import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-name-chanel',
  templateUrl: './edit-name-chanel.component.html',
  styleUrls: ['./edit-name-chanel.component.scss']
})
export class EditNameChanelComponent implements OnInit {

  Teamname: string = "";
  isprivate: boolean;
  Id: number
  constructor(private changeDetectorRefs: ChangeDetectorRef,
    private services: JeeTeamService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditNameChanelComponent>,) { }

  ngOnInit(): void {
    // console.log("datadatadatadata", this.data)
    this.Teamname = this.data.title
    if (this.data.RowIdSubChild == -1 || this.data.RowIdSubChild == undefined) {
      this.isprivate = false;
      this.Id = this.data.RowId;
    }
    if (this.data.RowId == undefined) {
      this.isprivate = true;
      this.Id = this.data.RowIdSubChild;
    }
  }
  CloseDia(data = undefined) {
    this.dialogRef.close(data);
  }
  goBack() {

    this.dialogRef.close();

  }


  EditGroupName() {

    this.services.EditNameMenuChanel(this.Id, this.Teamname, this.isprivate).subscribe(res => {
      if (res && res.status === 1) {
        this.CloseDia(res);
      }
    })

  }

  submit() {
    this.EditGroupName();
  }

}
