import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountManagementModel, AppListDTO } from '../Model/account-management.model';
import { AccountManagementService } from '../Services/account-management.service';
import { ReplaySubject, of, BehaviorSubject, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { catchError, finalize, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { ResultModel } from 'src/app/modules/auth/models/_base.model';

@Component({
  selector: 'app-account-management-jeehr-activated',
  templateUrl: './account-management-jeehr-activated.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountManagementJeeHRActivatedComponent implements OnInit, OnDestroy {
  item: AccountManagementModel;
  itemForm: FormGroup;
  listApp: AppListDTO[] = [];
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _errorMessage$ = new BehaviorSubject<string>('');
  private subscriptions: Subscription[] = [];
  public isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private translate: TranslateService;
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this.errorMessage$.asObservable();
  }
  // End
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountManagementJeeHRActivatedComponent>,
    private fb: FormBuilder,
    public accountManagementService: AccountManagementService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public datepipe: DatePipe,
    private translateService: TranslateService
  ) { }

  ngOnDestroy(): void {
    this.accountManagementService.ngOnDestroy();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  createForm() {
    this.itemForm = this.fb.group({
      HoTen: [''],
      Phone: ['', [Validators.required, Validators.compose([Validators.pattern(/^-?(0|[0-9]\d*)?$/)])]],
      AppsCheckbox: new FormArray([]),
    });
  }

  ngOnInit(): void {
    this.createForm();
    this._isFirstLoading$.next(true);
    const sb = this.accountManagementService
      .GetListAppByCustomerID()
      .pipe(
        tap((res: ResultModel<AppListDTO>) => {
          if (res) {
            this.listApp = res.data;
            this.addCheckboxes();
          }
        }),
        finalize(() => {
          this._isFirstLoading$.next(true);
          this.loadChiTietNhanVienJeeHR();
        }),
        catchError((err) => {
          console.log(err);
          this._errorMessage$.next(err);
          return of();
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  get AppsFromArray() {
    return this.itemForm.get('AppsCheckbox') as FormArray;
  }

  private addCheckboxes() {
    this.listApp.forEach((item) => this.AppsFromArray.push(new FormControl(item.IsDefaultApp)));
  }

  private setValueCheckboxes() {
    const lst = this.listApp.map((item) => item.IsDefaultApp);
    this.AppsFromArray.setValue(lst);
  }

  loadChiTietNhanVienJeeHR() {
    const sb3 = this.accountManagementService
      .DetailsStaffID(this.data.item.staffId)
      .pipe(
        tap((res) => {
          this.item = new AccountManagementModel();
          this.item.staffId = this.data.item.staffId;
          this.item.departmemtId = res.departmemtId;
          this.item.departmemt = res.departmemt;
          this.item.jobtitleId = res.jobtitleId;
          this.item.jobtitle = res.jobtitle;
          this.item.gender = res.gender;
          this.item.email = res.email;
          this.item.managerUsername = res.managerUsername;
          this.itemForm.controls.HoTen.patchValue(res.fullName);
          this.itemForm.controls.Phone.patchValue(res.phoneNumber != null && res.phoneNumber != "" ? res.phoneNumber : '');
          if (res.phoneNumber != null && res.phoneNumber != "") {
            this.itemForm.controls.Phone.disable();
          }

          this.changeDetect.detectChanges();
        }),
        finalize(() => {
          this._isFirstLoading$.next(false);
          this._isLoading$.next(false);
        }),
        catchError((err) => {
          console.log(err);
          this._errorMessage$.next(err);
          return of();
        })
      )
      .subscribe();
    this.subscriptions.push(sb3);
  }

  onSubmit(withBack: boolean) {
    if (this.itemForm.valid) {
      const acc = this.prepareDataFromFB();
      this.create(acc, withBack);
    } else {
      this.validateAllFormFields(this.itemForm);
    }
  }

  prepareDataFromFB(): AccountManagementModel {
    const acc = new AccountManagementModel();
    const AppCode: string[] = [];
    const AppID: number[] = [];
    for (let index = 0; index < this.AppsFromArray.controls.length; index++) {
      if (this.AppsFromArray.controls[index].value === true) {
        AppCode.push(this.listApp[index].AppCode);
        AppID.push(this.listApp[index].AppID);
      }
    }
    acc.appCode = AppCode;
    acc.appID = AppID;

    acc.staffId = this.item.staffId;
    acc.departmemtId = this.item.departmemtId;
    acc.departmemt = this.item.departmemt;
    acc.jobtitleId = this.item.jobtitleId;
    acc.jobtitle = this.item.jobtitle;
    acc.gender = this.item.gender;
    acc.email = this.item.email;
    acc.managerUsername = this.item.managerUsername;
    acc.phoneNumber = this.itemForm.controls.Phone.value;
    acc.fullName = this.itemForm.controls.HoTen.value;

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

  create(acc: AccountManagementModel, withBack: boolean = false) {
    this.isLoadingSubmit$.next(true);
    const sb = this.accountManagementService
      .createAccount_V2(acc)
      .pipe(
        tap((res) => {
          if (res && res.statusCode == 1) {
            this.dialogRef.close(res);
          } else {
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            this.isLoadingSubmit$.next(false);
          }
        })
      )
      .subscribe(
        () => { },
        (error) => {
          this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
          this.isLoadingSubmit$.next(false);
          this._errorMessage$.next(error);
        }
      );
    this.subscriptions.push(sb);
  }
  goBack() {
    this.dialogRef.close();
  }

  format_date(value: any, args?: any): any {
    let latest_date = this.datepipe.transform(value, 'dd/MM/yyyy');
    return latest_date;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {
    e.preventDefault(); //for Firefox
    return (e.returnValue = ''); //for Chorme
  }
}
