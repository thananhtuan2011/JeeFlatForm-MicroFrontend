import { DanhSachHoTroService } from '../_services/danh-sach-ho-tro.service';
import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BehaviorSubject, Subscription, SubscriptionLike } from "rxjs";

import { TicketManagementModel } from "../_models/ticket-management.model";
import { TicketRequestManagementService } from "../_services/ticket-request-management.service";
import { ActivatedRoute } from "@angular/router";
import { MessageService } from "../_services/message.service";
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../_services/auth.service';
import { LayoutUtilsService, MessageType } from '../../modules/crud/utils/layout-utils.service';
import { TranslationService } from '../../modules/i18n/translation.service';


@Component({
  selector: 'app-rating-popup',
  templateUrl: './rating-popup.component.html',
  styleUrls: ['./rating-popup.component.scss']
})
export class RatingPopupComponent implements OnInit {
  vang: string = '#FFFF00';
  trang: string = '#E6E6FA';
  mau: string = '#E6E6FA';
  value_rating: number = 0;
  rangting_text: string;
  TicKetID: number
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
  subscription: SubscriptionLike;
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
    public danhSachHoTroService: DanhSachHoTroService,
    private translateService: TranslationService,
    private translate:TranslateService,
  ) { }
  ngOnInit(): void {
    this.item = this.data.item;
    this.value_rating = this.item.Rating;
  }

  ItemUpdateRating(): TicketManagementModel {
    const item = new TicketManagementModel();
    item.RowID = this.item.RowID;
    item.Rating = this.value_rating;
    item.AppID = this.translateService.instant("ACCESS.APPID");
    item.AppKey = this.translateService.instant("ACCESS.APPKEY");
    item.CustomerID = this.translateService.instant("ACCESS.CUSTOMERID");
    return item;
  }
  UpdateRating() {
    let item = this.ItemUpdateRating();
    if (item.Rating != 0) {
        this.TicketRequestManagementService.updateRatingThirdPartyApp(item).subscribe((res) => {
          if(res && res.status == 1){
            console.log("resource",res)
          }
        });        
      this.goBack();

    }
    else
      this.layoutUtilsService.showActionNotification('Chưa chọn sao đánh giá', MessageType.Read, 999999999, true, false, 3000, 'top', 0);


  }




  ClickRating(id: number) {
    if (id == 1) {
      this.value_rating = 1;
      this.rangting_text = 'Bạn đã đánh giá 1 sao';
    }
    else if (id == 2) {
      this.value_rating = 2;
      this.rangting_text = 'Bạn đã đánh giá 2 sao';

    }
    else if (id == 3) {
      this.value_rating = 3;
      this.rangting_text = 'Bạn đã đánh giá 3 sao';

    }
    else if (id == 4) {
      this.value_rating = 4;
      this.rangting_text = 'Bạn đã đánh giá 4 sao';

    }
    else {
      this.value_rating = 5;
      this.rangting_text = 'Bạn đã đánh giá 5 sao';

    }

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
    this.dialogRef.close();
  }
  //====================Dự án====================

}