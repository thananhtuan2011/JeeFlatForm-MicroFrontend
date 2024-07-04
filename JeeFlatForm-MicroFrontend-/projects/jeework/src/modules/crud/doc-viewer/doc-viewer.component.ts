import { Component, Inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { timeout, delay } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'kt-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.scss']
})
export class DocViewerComponent implements OnInit {

  constructor(
    // @Inject(MAT_SNACK_BAR_DATA) public data: any
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { 
    if(this.data.type!=undefined){
      this.url=this.data.url;
      this.viewer=this.data.type;
    }
  }
  url='';
  viewer="google";
	ngOnInit() {
    if(this.data.type==undefined){
      this.url = this.data;
    }
	}
}
