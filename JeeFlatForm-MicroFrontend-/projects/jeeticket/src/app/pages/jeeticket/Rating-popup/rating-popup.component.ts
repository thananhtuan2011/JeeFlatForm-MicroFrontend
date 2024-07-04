
import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component,  Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BehaviorSubject,  Subscription } from "rxjs";
import { TicketManagementModel } from "../_models/ticket-management.model";
import { TicketRequestManagementService } from "../_services/ticket-request-management.service";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "../_services/message.service";
import { AuthService } from "../_services/auth.service";
import { LayoutUtilsService, MessageType } from "../../../modules/crud/utils/layout-utils.service";

@Component({
    selector: 'app-rating-popup',
    templateUrl: './rating-popup.component.html',
      styleUrls: ['./rating-popup.component.scss']
  })
export class RatingPopupComponent implements OnInit {
    vang:string='#FFFF00';
    trang:string='#E6E6FA';
    mau:string='#E6E6FA';
  value_rating:number=0;
  rangting_text:string;
  TicKetID: number
  Content_rating:string='';
  isupdate=false;

  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _errorMessage$ = new BehaviorSubject<string>("");
  private subscriptions: Subscription[] = [];
  public isLoadingSubmit$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this.errorMessage$.asObservable();
  }

;
item: TicketManagementModel;
buocthuchien:number = 1;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RatingPopupComponent>,
    private fb: FormBuilder,
    public TicketRequestManagementService: TicketRequestManagementService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public datepipe: DatePipe,
    public auth: AuthService,
    private activatedRoute: ActivatedRoute,
    public messageService: MessageService,
    ) {}
  ngOnInit(): void {
      this.item=this.data.item;
      this.value_rating = this.item.Rating;
      if(this.item.Content_rating) this.Content_rating = this.item.Content_rating;
      this.changeDetect.detectChanges();
  }

  ItemUpdateRating():TicketManagementModel{
    const item = new TicketManagementModel();
    item.RowID=this.item.RowID;
    item.Rating=this.value_rating;
    item.Content_rating=this.Content_rating;
    return item;
  }
  UpdateRating(){
      let item=this.ItemUpdateRating();
      if(item.Rating!=0)
      {
        this.TicketRequestManagementService.updateRating(item).subscribe((res) => {
          if(res && res.statusCode == 1){
            this.isupdate=true;
            this.buoctieptheo();
            this.changeDetect.detectChanges();
          }
        });      
      }
      else      
         this.layoutUtilsService.showActionNotification('Chưa chọn sao đánh giá', MessageType.Read, 999999999, true, false, 3000, 'top', 0);

  
}

buoctieptheo(){
  this.buocthuchien += 1;
}



  ClickRating(id:number)
  {
    this.value_rating=id;
    this.changeDetect.detectChanges();
  }


 
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((field) => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }




  goBack() {
    this.dialogRef.close(this.isupdate);
  }
}