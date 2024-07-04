import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PersionalInfoDTO, AppListDTO, JobtitleManagementDTO } from '../Model/account-management.model';
import { AccountManagementService } from '../Services/account-management.service';
import { ReplaySubject, of, BehaviorSubject, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { catchError, finalize, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { ResultModel } from 'src/app/modules/auth/models/_base.model';

@Component({
  selector: 'app-account-management-jeehr-update-info',
  templateUrl: './account-management-jeehr-update-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountManagementJeeHRUpdateInfoDialogComponent implements OnInit, OnDestroy {
  item: PersionalInfoDTO;
  itemForm: FormGroup;

  listApp: AppListDTO[] = [];
  CompanyCode: string;
  imgFile = '../assets/images/NoImage.jpg';
  // ngx-mat-search area
  chucvus: JobtitleManagementDTO[] = [];
  filterChucVus: ReplaySubject<JobtitleManagementDTO[]> = new ReplaySubject<JobtitleManagementDTO[]>();
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  private _errorMessage$ = new BehaviorSubject<string>('');
  private subscriptions: Subscription[] = [];
  public isLoadingSubmit$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
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
  listLoaiNhanVien: any[] = [];
  listNoiSinh: any[] = [];
  filterNoiSinhs: ReplaySubject<any[]> = new ReplaySubject<any[]>();
  //===========================Đổi sử dụng cây cơ cấu - phòng ban============
  public datatree: BehaviorSubject<any[]> = new BehaviorSubject([]);
  title: string = '';
  selectedNode: BehaviorSubject<any> = new BehaviorSubject([]);
  //==========================================================================
  date: Date = new Date();
  staffId: number = -1;
  isAdd: boolean = true;
  isActive: boolean = false;
  isCopy: boolean = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountManagementJeeHRUpdateInfoDialogComponent>,
    private fb: FormBuilder,
    public accountManagementService: AccountManagementService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    // public danhmuc: DanhMucChungService,
    public datepipe: DatePipe,
    private translateService: TranslateService
  ) { }

  ngOnDestroy(): void {
    this.accountManagementService.ngOnDestroy();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  createForm() {
    this.itemForm = this.fb.group({
      HoTen: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      Email: ['', Validators.compose([Validators.email])],
      GioiTinh: ['0'],
    });

    this.itemForm.controls["HoTen"].markAsTouched();
  }

  ngOnInit(): void {
    this.item = this.data.item;
    this.createForm();
    // this.loadChiTietNhanVienJeeHR();
    this.item.userID = this.data.item.userId;
    this.itemForm.controls.HoTen.patchValue(this.item.fullName);
    this.itemForm.controls.GioiTinh.patchValue('' + this.item.gender);
    this.itemForm.controls.Email.patchValue('' + this.item.email);
  }

  loadChiTietNhanVienJeeHR() {
    const sb3 = this.accountManagementService
      .DetailsStaffID(this.data.item.staffId)
      .pipe(
        tap((res) => {
          this.item = new PersionalInfoDTO();
          this.item.userID = this.data.item.userId;
          this.itemForm.controls.HoTen.patchValue(res.fullName);
          this.itemForm.controls.SoDienThoai.patchValue(res.phoneNumber != null && res.phoneNumber != "" ? res.phoneNumber : '');
          this.itemForm.controls.GioiTinh.patchValue('' + res.gender);
          this.itemForm.controls.Email.patchValue(res.email);
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
      this.capnhat(acc);
    } else {
      this.validateAllFormFields(this.itemForm);
    }
  }

  prepareDataFromFB(): PersionalInfoDTO {
    const acc = new PersionalInfoDTO();
    //==================================================
    acc.userID = +this.item.userID;
    acc.gender = +this.itemForm.controls.GioiTinh.value;
    acc.email = this.itemForm.controls.Email.value;
    acc.fullName = this.itemForm.controls.HoTen.value;
    acc.staffId = this.item.staffId;
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


  capnhat(acc: any) {
    this.isLoadingSubmit$.next(true);
    const sb = this.accountManagementService
      .capNhatThongTinNV_V2(acc)
      .pipe(
        tap((res) => {
          this.isLoadingSubmit$.next(false);
          if (res && res.Susscess) {
            this.dialogRef.close(res);
          } else {
            this.layoutUtilsService.showActionNotification(res.ErrorMessgage, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
          }
        })
      )
      .subscribe(
        () => { },
        (error) => {
          this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
          console.log(error);
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


  f_convertDate(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {

  }

}
