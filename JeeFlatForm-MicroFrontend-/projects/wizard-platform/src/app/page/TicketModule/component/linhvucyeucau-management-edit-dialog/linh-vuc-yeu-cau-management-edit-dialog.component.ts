import { MatSelect } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ChangeDetectorRef, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { LinhvucyeucauModel } from './../Model/linh-vuc-yeu-cau-management.model';
import {
  LayoutUtilsService,
  MessageType,
} from "projects/wizard-platform/src/modules/crud/utils/layout-utils.service";
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { TicKetService } from '../../ticket.service';

export enum KEY_CODE {
  ENTER = 13,
}
@Component({
  selector: 'app-linh-vuc-yeu-cau-management-edit-dialog',
  templateUrl: './linh-vuc-yeu-cau-management-edit-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class LinhvucyeucauEditDialogComponent implements OnInit {
  item: LinhvucyeucauModel;
  itemForm = this.fb.group({
    Title: ['', [Validators.required, Validators.maxLength(200)]],
  });
  @ViewChild('focus') focus: ElementRef;

  // ngx-mat-search area
  isLoadingSubmit$: BehaviorSubject<boolean>;
  isLoading$: BehaviorSubject<boolean>;
  private subscriptions: Subscription[] = [];
  // End
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<LinhvucyeucauEditDialogComponent>,
    private fb: FormBuilder,
    private TicKetService: TicKetService,
    private layoutUtilsService: LayoutUtilsService,
    public cd: ChangeDetectorRef,
    private translateService: TranslateService,
  ) { }

  ngOnInit(): void {
    this.itemForm.controls["Title"].markAsTouched();
    this.isLoadingSubmit$ = new BehaviorSubject(false);
    this.isLoading$ = new BehaviorSubject(true);
    this.item = this.data.item;
    if (this.item.RowID > 0) {
      this.isLoading$.next(true);
      this.initData();
    } else {
      this.item = new LinhvucyeucauModel();
    }
  }

  initData() {
    this.itemForm.controls.Title.patchValue(this.item.Title);
  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    console.log(event);
    if (event.keyCode === KEY_CODE.ENTER && event.ctrlKey) {
      this.onSubmit(true);
    }
  }
  onSubmit(check: boolean) {
    if (this.itemForm.valid) {
      const linhvuc = this.initDataFromFB();
      if (this.item.RowID > 0) {
        this.update(linhvuc, check);
      } else {
        this.create(linhvuc, check);
      }
    } else {
      this.validateAllFormFields(this.itemForm);
    }
  }
  getTitle() {
    if (this.item.RowID > 0) {
      return this.translateService.instant('Chỉnh sửa');
    }
    return this.translateService.instant('Thêm mới');
  }
  create(jobtitle: LinhvucyeucauModel, check: boolean) {
    this.isLoadingSubmit$.next(true);
    this.TicKetService.CreateLinhvucyeucau(jobtitle).subscribe((res) => {
      if (res && res.status === 1) {
        this.isLoadingSubmit$.next(false);
        if (check == true) {
          this.layoutUtilsService.showActionNotification("Thêm thành công", MessageType.Read, 4000, true, false);
          this.initData();
          this.focus.nativeElement.focus();
        }
        else { this.dialogRef.close(res.data); }
      } else {
        this.isLoadingSubmit$.next(false);
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  update(jobtitle: LinhvucyeucauModel, check: boolean) {
    this.isLoadingSubmit$.next(true);
    this.TicKetService.UpdateLinhvucyeucau(jobtitle).subscribe((res) => {
      if (res.status == 1) {
        this.isLoadingSubmit$.next(false);
        this.dialogRef.close(res.data);
      } else {
        this.isLoadingSubmit$.next(false);
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  initDataFromFB(): LinhvucyeucauModel {
    const job = new LinhvucyeucauModel();
    job.clear();
    job.Title = this.itemForm.controls.Title.value;
    if (this.item) {
      job.RowID = this.item.RowID;
    }
    return job;
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


  @HostListener("keydown", ["$event"])
  onKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && e.ctrlKey) {
      // Do nothing
      this.onSubmit(true);
    }
  }
}
