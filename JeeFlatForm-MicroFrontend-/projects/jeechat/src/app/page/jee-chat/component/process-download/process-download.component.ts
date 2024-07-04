import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-process-download',
  templateUrl: './process-download.component.html',
  styleUrls: ['./process-download.component.scss']
})
export class ProcessDownloadComponent implements OnInit {
  @Input() datadown: any;
  
  @Input() idatt: any;
  @Input() name: any;
  intervaldownload:any
  progressdown:number=0;
  constructor( private changeDetectorRefs: ChangeDetectorRef,) { }

  ngOnInit(): void {
       console.log("this.datadownload",this.datadown)
      // this.id_attprocess=item.id_att
      //  this.filenameprocess=item.filename;
     
  }

}
