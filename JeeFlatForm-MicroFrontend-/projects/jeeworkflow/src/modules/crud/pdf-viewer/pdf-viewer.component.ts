import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'kt-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss']
})
export class PdfViewerComponent implements OnInit {

  link: string = '';
  constructor(
    // @Inject(MAT_SNACK_BAR_DATA) public data: any
    @Inject(MAT_DIALOG_DATA) public data: any,
    private changeDetectorRefs: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.link = this.data;
    this.changeDetectorRefs.detectChanges();
  }
}
