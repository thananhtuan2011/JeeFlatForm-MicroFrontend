import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'kt-dialog-deadline',
  templateUrl: './dialog-deadline.component.html',
})
export class DialogDeadlineComponent implements OnInit {
  start_temp: any;
  end_temp: any;
  constructor(
    public dialogRef: MatDialogRef<DialogDeadlineComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.start_temp = this.data.startDate;
    this.end_temp = this.data.endDate;
  }

  onNoClick(): void {
    this.data.startDate = this.start_temp;
    this.data.endDate = this.end_temp;
    this.dialogRef.close();
  }

}
