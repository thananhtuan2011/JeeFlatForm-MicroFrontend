import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountManagementModel, AppListDTO, DepartmentManagementDTO, JobtitleManagementDTO } from '../Model/account-management.model';
import { AccountManagementService } from '../Services/account-management.service';
import { ReplaySubject, of, BehaviorSubject, Subscription } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { DatePipe } from '@angular/common';
import { catchError, finalize, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { ResultModel } from 'src/app/modules/auth/models/_base.model';

@Component({
  selector: 'app-account-management-add-staff-dialog',
  templateUrl: './account-management-add-staff-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountManagementAddStaffDialogComponent implements OnInit, OnDestroy {
  item: AccountManagementModel;
  itemForm: FormGroup;

  listApp: AppListDTO[] = [];
  CompanyCode: string;
  imgFile = '../assets/media/Img/NoImage.jpg';
  // ngx-mat-search area
  phongBans: DepartmentManagementDTO[] = [];
  filterPhongBans: ReplaySubject<DepartmentManagementDTO[]> = new ReplaySubject<DepartmentManagementDTO[]>();
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
  listCapDonVi: any[] = [];
  //===========================Đổi sử dụng cây cơ cấu - phòng ban============
  public datatree: BehaviorSubject<any[]> = new BehaviorSubject([]);
  title: string = '';
  selectedNode: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountManagementAddStaffDialogComponent>,
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
      HoTen: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(100)])],
      Email: ['', Validators.compose([Validators.email])],
      PhongBan: ['', [Validators.required]],
      AnhDaiDien: [''],
      ChucVuFilterCtrl: [],
      ChucVu: ['', [Validators.required]],
      SoDienThoai: ['', Validators.compose([Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)])],
      AppsCheckbox: new FormArray([]),
      file: [],
      NgaySinh: ['', [Validators.required]],
      GioiTinh: ['0'],
    });

    this.itemForm.controls["PhongBan"].markAsTouched();
    this.itemForm.controls["ChucVu"].markAsTouched();
    this.itemForm.controls["HoTen"].markAsTouched();
    this.itemForm.controls["SoDienThoai"].markAsTouched();
    this.itemForm.controls["NgaySinh"].markAsTouched();
  }

  ngOnInit(): void {
    this.createForm();
    this._isFirstLoading$.next(true);
    if (this.data.item) {
      this.item = this.data.item;
    } else {
      this.item = new AccountManagementModel();
      if (this.data._DepartmentID) {
        this.itemForm.controls.PhongBan.patchValue(this.data._DepartmentID);
      }
      if (this.data._DepartmentName) {
        this.DepartmentName = this.data._DepartmentName;
      }
    }
    const sb = this.accountManagementService
      .GetListAppByCustomerID()
      .pipe(
        tap((res: ResultModel<AppListDTO>) => {
          if (res) {
            // const index = res.data.findIndex((item) => item.AppID === 14);
            // res.data.splice(index, 1);
            this.listApp = res.data;
            this.addCheckboxes();
          }
        }),
        finalize(() => {
          this.loadPhongBan();
          this.loadChucVu();
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

  loadChucVu() {
    const sb3 = this.accountManagementService
      .getDSChucvu()
      .pipe(
        tap((res) => {
          this.chucvus = [...res.data];
          this.filterChucVus.next([...res.data]);
          this.itemForm.controls.ChucVuFilterCtrl.valueChanges.subscribe(() => {
            this.profilterChucVus();
          });
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
  loadPhongBan() {
    const sb2 = this.accountManagementService
      .getDSPhongBan()
      .pipe(
        tap((res) => {
          this.datatree.next(res.data.tree);
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
    this.subscriptions.push(sb2);
  }
  protected profilterPhongBans() {
    if (!this.itemForm.controls.PhongBan) {
      return;
    }

    let search = this.itemForm.controls.PhongBanFilterCtrl.value;
    if (!search) {
      this.filterPhongBans.next([...this.phongBans]);
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filterPhongBans.next(this.phongBans.filter((item) => item.DepartmentName.toLowerCase().indexOf(search) > -1));
  }

  protected profilterChucVus() {
    if (!this.itemForm.controls.ChucVu) {
      return;
    }
    let search = this.itemForm.controls.ChucVuFilterCtrl.value;
    if (!search) {
      this.filterChucVus.next([...this.chucvus]);
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filterChucVus.next(this.chucvus.filter((item) => item.Title.toLowerCase().indexOf(search) > -1));
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
    acc.AppCode = AppCode;
    acc.AppID = AppID;
    acc.fullName = this.itemForm.controls.HoTen.value;
    acc.email = this.itemForm.controls.Email.value;
    acc.phoneNumber = this.itemForm.controls.SoDienThoai.value;
    acc.gender = +this.itemForm.controls.GioiTinh.value;
    acc.departmemtId = +this.itemForm.controls.PhongBan.value;
    if (acc.departmemtId != 0) acc.departmemt = this.DepartmentName;
    acc.jobtitleId = +this.itemForm.controls.ChucVu.value;
    if (acc.jobtitleId != 0) acc.jobtitle = this.chucvus.find((item) => item.RowID == acc.jobtitleId).Title;
    acc.avatar = this.imgFile ? this.imgFile.split(',')[1] : '';
    acc.dateOfBirth = this.itemForm.controls.NgaySinh.value != undefined ? this.format_date(this.itemForm.controls.NgaySinh.value) : '';
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

  onFileChange(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgFile = e.target.result;
        const filename = event.target.files[0].name;
        this.itemForm.controls.AnhDaiDien.setValue(filename);
        this.changeDetect.detectChanges();
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }
  create(acc: AccountManagementModel, withBack: boolean = false) {
    this.isLoadingSubmit$.next(true);
    const sb = this.accountManagementService
      .createAccount_V2(acc)
      .pipe(
        tap((res) => {
          this.isLoadingSubmit$.next(false);
          if (res && res.statusCode == 1) {
            if (withBack) {
              this.dialogRef.close(res);
            } else {
              let saveMessageTranslateParam = '';
              saveMessageTranslateParam += 'COMMOM.THEMTHANHCONG';
              const saveMessage = 'Thêm thành công';
              const messageType = MessageType.Create;
              this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
              this.itemForm.reset();
              this.createForm();
              this.setValueCheckboxes();
            }
          } else {
            this.layoutUtilsService.showActionNotification(res.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
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
    if (this.checkDataBeforeClose()) {
      this.dialogRef.close();
    } else {
      const _title = this.translateService.instant('CHECKPOPUP.TITLE');
      const _description = this.translateService.instant('CHECKPOPUP.DESCRIPTION');
      const _waitDesciption = this.translateService.instant('CHECKPOPUP.WAITDESCRIPTION');
      const popup = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
      popup.afterClosed().subscribe((res) => {
        res ? this.dialogRef.close() : undefined;
      });
    }
  }

  format_date(value: any, args?: any): any {
    let latest_date = this.datepipe.transform(value, 'dd/MM/yyyy');
    return latest_date;
  }

  checkDataBeforeClose(): boolean {
    // const model = this.prepareDataFromFB();
    // const empty = new AccountManagementModel();
    // empty.Username = `${this.CompanyCode}.`;
    // empty.AppCode = this.listApp.filter((item) => item.IsDefaultApp).map((item) => item.AppCode);
    // empty.AppID = this.listApp.filter((item) => item.IsDefaultApp).map((item) => item.AppID);
    // return this.accountManagementService.isEqual(empty, model);
    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {
    if (!this.checkDataBeforeClose()) {
      e.preventDefault(); //for Firefox
      return (e.returnValue = ''); //for Chorme
    }
  }

  //================================================================
  DepartmentName: string = '';
  GetValueNode(val: any) {
    this.DepartmentName = val.DepartmentName;
  }
}
