import { catchError, finalize, share, tap } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { WorkwizardChungService } from '../work.service';
@Component({
  selector: 'app-step5-component',
  templateUrl: './step5-component.component.html',
  styleUrls: ['./step5-component.component.scss'],
})
export class Step5ComponentComponent implements OnInit {
  constructor(
    private _WorkwizardChungService:WorkwizardChungService,
    private changeDetectorRefs: ChangeDetectorRef,
  ) {
  }
  Data:any;
  isLoad:boolean=false;
  ngOnInit(): void {
    this._WorkwizardChungService.GetWizard(5).subscribe(res=>{
      if(res && res.status==1){
        this.Data=res.data;
        this.isLoad=true;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  
}