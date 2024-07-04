import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-call-orther',
  templateUrl: './call-orther.component.html',
  styleUrls: ['./call-orther.component.scss']
})
export class CallOrtherComponent implements OnInit {

  constructor(  private dialogRef:MatDialogRef<CallOrtherComponent>,    @Inject(MAT_DIALOG_DATA) public data: any,) { }
  AvatarSend:string;
  NameCall:string;
  BgColorSend:string
  ngOnInit(): void {
    this.AvatarSend=this.data.avatar;
    this.NameCall=this.data.CallPeople;
    this.BgColorSend=this.data.BgColorSend;
  }
  Close()
  {
    this.dialogRef.close();
  }
}
