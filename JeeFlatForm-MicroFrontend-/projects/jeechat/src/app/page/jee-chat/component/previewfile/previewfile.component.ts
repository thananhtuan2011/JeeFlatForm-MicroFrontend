import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-previewfile',
  templateUrl: './previewfile.component.html',
  styleUrls: ['./previewfile.component.scss']
})
export class PreviewfileComponent implements OnInit {
loading:boolean=true;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any,private dialogRef:MatDialogRef<PreviewfileComponent>,) { }

  goBack() {

    this.dialogRef.close();

  }
  contentLoaded()
  {
this.loading=false;
  }
  ngOnInit(): void {
  }

}
