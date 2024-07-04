import { JeeAccountService } from './../../services/jee-account.service';
import { MatSelect } from '@angular/material/select';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { ChangeDetectionStrategy, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { TranslateService } from '@ngx-translate/core';
import { ForgetPasswordDP247Model } from '../../models/jee-account.model';

@Component({
  selector: 'app-forget-password-dialog-dp247',
  templateUrl: './forget-password-dialog-dp247.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgetPasswordDP247EditDialogComponent implements OnInit, OnDestroy {
  item: ForgetPasswordDP247Model = new ForgetPasswordDP247Model();
  itemForm = this.fb.group(
    {
      MatKhau: ['', [Validators.required]],
      NhapLaiMatKhau: ['', [Validators.required]],
    },
    { validator: this.checkPasswords }
  );
  // ngx-mat-search area
  isLoadingSubmit$: BehaviorSubject<boolean>;
  isLoading$: BehaviorSubject<boolean>;
  private subscriptions: Subscription[] = [];
  // End
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ForgetPasswordDP247EditDialogComponent>,
    private fb: FormBuilder,
    private accountManagementService: JeeAccountService,
    private layoutUtilsService: LayoutUtilsService,
    public cd: ChangeDetectorRef,
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.isLoadingSubmit$ = new BehaviorSubject(false);
    this.isLoading$ = new BehaviorSubject(true);
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.MatKhau.value;
    let confirmPass = group.controls.NhapLaiMatKhau.value;
    return pass === confirmPass ? null : { notSame: true };
  }

  onSubmit() {
    if (this.itemForm.valid) {
      const job = this.initDataFromFB();
      this.update(job);
    } else {
      this.validateAllFormFields(this.itemForm);
    }
  }
  update(item: ForgetPasswordDP247Model) {
    this.isLoadingSubmit$.next(true);
    this.layoutUtilsService.OnWaitingRouter();
    this.accountManagementService.ForgetPasswordByPhone(item).subscribe(
      (res) => {
        this.isLoadingSubmit$.next(false);
        this.layoutUtilsService.OffWaitingRouter();
        this.dialogRef.close(res);
      },
      (error) => {
        this.isLoadingSubmit$.next(false);
        this.layoutUtilsService.OffWaitingRouter();
        this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
      },
      () => {
        this.isLoadingSubmit$.next(false);
        this.layoutUtilsService.OffWaitingRouter();
      }
    );
  }

  initDataFromFB(): ForgetPasswordDP247Model {
    const acc = new ForgetPasswordDP247Model();
    acc.Code = this.data.code;
    acc.Phone = this.data.username;
    acc.Hash = this.data.hash;
    acc.DeviceName = this.data.devicename;
    acc.PaswordNew = this.itemForm.controls.MatKhau.value;
    return acc;
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

  //============================================================
  fieldTextType_new: boolean;
  fieldTextType_new_repeat: boolean;
 
  toggleFieldTextType_new() {
    this.fieldTextType_new = !this.fieldTextType_new;
  }
  toggleFieldTextType_new_repeat() {
    this.fieldTextType_new_repeat = !this.fieldTextType_new_repeat;
  }
}
