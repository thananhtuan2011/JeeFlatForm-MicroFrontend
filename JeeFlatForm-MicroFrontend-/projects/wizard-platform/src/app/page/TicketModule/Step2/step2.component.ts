import {
  ChangeDetectorRef,
  Component,
  OnInit,

} from '@angular/core';
import { TicKetService } from '../ticket.service';
import { LayoutUtilsService,MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { LinhvucyeucauModel } from '../component/Model/linh-vuc-yeu-cau-management.model';
import { QueryParamsModel } from '../../models/query-models/query-params.model';

@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit {

  wizard:any;
  constructor(
    private TicKetService:TicKetService,
    private ChangeDetectorRef:ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public cd: ChangeDetectorRef,
  ) {

  }
  isloadding = false;
  data:any;
  title:string = '';
  ngOnInit(): void {
   this.getwizard();
   this.loadData();
  }
  loadData(){
    let queryParams;
    queryParams = new QueryParamsModel(
      this.filter(),
      '',
      '',
      1,
      10,
      
      true
    );
    this.TicKetService.GetListLinhvucyeucauManagement(queryParams).subscribe(res=>{
      if(res && res.status ==1){
        this.data = res.data;
        this.ChangeDetectorRef.detectChanges();
      }
     })
  }
  filter(): any {
    const filterNew: any = {

    };
    return filterNew;
  }
  getwizard(){
    this.TicKetService.getWizard(2).subscribe(res=>{
      if(res && res.status==1){
        this.wizard=res.data;
        this.isloadding=true;
        this.ChangeDetectorRef.detectChanges();
      }
    })
  }
  delete(RowID: number) {
    this.TicKetService.DeleteLinhvucyeucau(RowID).subscribe((res) => {
      if(res && res.statusCode ===1){
        this.loadData();
      }
      else{
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
  });
  }
  create(){
    let model = new LinhvucyeucauModel();
    model.clear();
    model.Title = this.title;
    this.TicKetService.CreateLinhvucyeucau(model).subscribe((res) => {
      if (res && res.status === 1) {
        this.title = '';
        this.loadData();
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });  }
}
