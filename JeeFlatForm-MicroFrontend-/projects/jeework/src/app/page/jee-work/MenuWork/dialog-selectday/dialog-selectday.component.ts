import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatDateFormats } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  startDate: string;
  endDate: string;
}

export const MY_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'D/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM Y',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM Y'
  }
};

@Component({
  selector: 'kt-dialog-selectday',
  templateUrl: './dialog-selectday.component.html',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'vi' },
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ]
})
export class DialogSelectdayComponent implements OnInit {
  start_temp: any;
  end_temp: any;
  constructor(
    public dialogRef: MatDialogRef<DialogSelectdayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private changeDetectorRefs: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.start_temp = this.data.startDate;
    if (this.start_temp != '') {
      let _start = this.start_temp.split(" ");
      if (_start.length > 1) {
        this.start_temp.setHours(this.start_temp.getHours() + 7)
      }
    }

    this.end_temp = this.data.endDate;
    if (this.end_temp != '') {
      let _end = this.start_temp.split(" ");
      if (_end.length > 1) {
        this.end_temp.setHours(this.end_temp.getHours() + 7)
      }
    }
  }

  onNoClick(): void {
    this.data.startDate = this.start_temp;
    this.data.endDate = this.end_temp;
    this.dialogRef.close();
  }

}
