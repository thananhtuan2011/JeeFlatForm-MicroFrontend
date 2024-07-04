import { ListStatusModel } from './../Model/list-status-list-managament.model';
import { MatSelect } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ChangeDetectionStrategy, Component, EventEmitter, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, Input, Output, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, fromEvent, merge, Observable, Subscription } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  LayoutUtilsService,
  MessageType,
} from "projects/wizard-platform/src/modules/crud/utils/layout-utils.service";
import { debounceTime, map, startWith } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { TicKetService } from '../../ticket.service';
export enum KEY_CODE {
  ENTER = 13,
}
@Component({
  selector: 'app-list-status-edit-dialog',
  templateUrl: './list-status-edit-dialog.component.html',
  styleUrls: ['./list-status-edit-dialog.component.scss'],

  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusManagementEditDialogComponent implements OnInit {
  
  item: ListStatusModel;
  filter: any = {};
  selected: string = '';

  itemForm = this.fb.group({
    Title: ['', [Validators.required,Validators.maxLength(50)]]
    });

  // Mat chip area
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  // End
  @ViewChild('focus') focus: ElementRef;
  @ViewChild('divElement') el: ElementRef;
  // ngx-mat-search area
  isLoadingSubmit$: BehaviorSubject<boolean>;
  isLoading$: BehaviorSubject<boolean>;
  private subscriptions: Subscription[] = [];
  // End
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<StatusManagementEditDialogComponent>,
    private fb: FormBuilder,
    private TranslateService: TranslateService,
    private TicKetService: TicKetService,
    private layoutUtilsService: LayoutUtilsService,
    public cd: ChangeDetectorRef,

  ) { }


  tieude: string = '';
  ngOnInit(): void {
    this.itemForm.controls["Title"].markAsTouched();
    this.isLoadingSubmit$ = new BehaviorSubject(false);
    this.isLoading$ = new BehaviorSubject(true);
    this.item = this.data.item;

    if (this.item.RowID > 0) {

      this.selected = this.item.Color;

      this.tieude = 'Chỉnh sửa'


      this.isLoading$.next(true);
      const sb2 = this.TicKetService.GetStatusByRowID(this.item.RowID).subscribe(
        (res) => {
          this.item = res;
          this.isLoading$.next(false);
          this.cd.detectChanges();
          this.initData();
        },
        (error) => {
          console.log(error);
        }
      );
      this.subscriptions.push(sb2);
      this.initData();
    } else {
      this.tieude = 'Thêm mới'

      this.item = new ListStatusModel();
    }
  }
  ngAfterViewInit(): void {
    this.handleClickAndDoubleClick();
  }
  handleClickAndDoubleClick(){
    const el = this.el.nativeElement;
    const clickEvent = fromEvent<MouseEvent>(el, 'click');
    const dblClickEvent = fromEvent<MouseEvent>(el, 'dblclick');
    const eventsMerged = merge(clickEvent, dblClickEvent).pipe(debounceTime(300));
    eventsMerged.subscribe(
      (event:any) => {
        if(event.type != 'click'){
          this.selected = '';
        }
        //dblclick
      }
    );
  }
  initData() {

    this.itemForm.controls.Title.patchValue(this.item.Title);
    this.itemForm.controls.Color.patchValue(this.item.Color);


  }

  Selected_Color(event): any {
    this.selected = event.value;
    this.item.Color = event;
    this.selected = event;
  }


  onSubmit(check: boolean) {
    if (this.itemForm.valid) {
      const status = this.initDataFromFB();
      if (status.Color != "") {
        if (this.item.RowID > 0) {
          this.update(status);
        } else {
          this.create(status, check);
        }
      }
      else {
        this.layoutUtilsService.showActionNotification("Bắt buộc phải chọn màu !", MessageType.Read, 999999999, true, false, 3000, 'top', 0);

      }

    } else {
      this.validateAllFormFields(this.itemForm);
    }
  }
  update(status: ListStatusModel) {
    this.isLoadingSubmit$.next(true);
    this.TicKetService.UpdateStatus(status).subscribe(
      (res) => {
        this.isLoadingSubmit$.next(false);
        this.dialogRef.close(true);
      },
      (error) => {
        this.isLoadingSubmit$.next(false);
        this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    );
  }
  create(tags: ListStatusModel, check: boolean) {
    
    this.isLoadingSubmit$.next(true);
    this.TicKetService.CreateStatus(tags).subscribe(
      (res) => {
      if (res && res.status === 1) {
        this.isLoadingSubmit$.next(false);
        if (check == true) { 
          this.layoutUtilsService.showActionNotification("Thêm thành công",  MessageType.Read, 4000, true, false);

          this.initData(); this.focus.nativeElement.focus(); 
        }
        else { this.dialogRef.close(true); }
      } else {
        this.isLoadingSubmit$.next(false);

        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);

      }
    },
    (error) => {
      this.isLoadingSubmit$.next(false);
      this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
    }
    )
    
  }
  initDataFromFB(): ListStatusModel {
    const status = new ListStatusModel();
    status.clear();
    status.RowID = this.item.RowID;
    status.Title = this.itemForm.controls.Title.value;
    status.Color = this.selected;
    // if (this.item) {
    //     status.RowID = this.item.RowID;
    // }
    return status;
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



  checkDataBeforeClose(): boolean {
    const model = this.initDataFromFB();
    if (this.item.RowID === 0) {
      const empty = new ListStatusModel();
      empty.clear();
      return this.TicKetService.isEqual(empty, model);
    };
    return this.TicKetService.isEqual(model, this.item);
  }



  goBack() {
    this.dialogRef.close(false);
  }


  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
    if (event.keyCode === KEY_CODE.ENTER && event.ctrlKey) {
      this.onSubmit(true);
    }
  }
}
//