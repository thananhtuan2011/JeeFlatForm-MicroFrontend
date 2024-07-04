import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountManagementModel, AppListDTO, JobtitleManagementDTO } from '../Model/account-management.model';
import { AccountManagementService } from '../Services/account-management.service';
import { ReplaySubject, of, BehaviorSubject, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { catchError, finalize, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { ResultModel } from 'src/app/modules/auth/models/_base.model';

@Component({
  selector: 'app-account-management-jeehr-add-staff-dialog',
  templateUrl: './account-management-jeehr-add-staff-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountManagementJeeHRAddStaffDialogComponent implements OnInit, OnDestroy {
  item: AccountManagementModel;
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
    public dialogRef: MatDialogRef<AccountManagementJeeHRAddStaffDialogComponent>,
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
      PhongBan: ['', [Validators.required]],
      ChucVuFilterCtrl: [],
      ChucVu: ['', [Validators.required]],
      SoDienThoai: ['', Validators.compose([Validators.required, Validators.pattern(/^-?(0|[0-9]\d*)?$/)])],
      AppsCheckbox: new FormArray([]),
      file: [],
      NgaySinh: [''],
      NgayVaoLam: [this.f_convertDate(this.date), [Validators.required]],
      GioiTinh: ['0'],
      NoiSinh: [''],
      NoiSinhFilterCtrl: [],
      LoaiNhanVien: [''],
    });

    this.itemForm.controls["PhongBan"].markAsTouched();
    this.itemForm.controls["ChucVu"].markAsTouched();
    this.itemForm.controls["HoTen"].markAsTouched();
    this.itemForm.controls["SoDienThoai"].markAsTouched();
    this.itemForm.controls["NgayVaoLam"].markAsTouched();
    this.itemForm.controls["LoaiNhanVien"].markAsTouched();
  }

  ngOnInit(): void {
    this.createForm();
    this._isFirstLoading$.next(true);
    if (this.data._IsCopy) 
      this.isCopy = this.data._IsCopy;

    if (this.data.item) {
      this.isAdd = false;
      this.loadChiTietNhanVienJeeHR();
    } else {
      this.item = new AccountManagementModel();
      if (this.data._DepartmentID) {
        this.itemForm.controls.PhongBan.patchValue(this.data._DepartmentID);
      }
    }
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
          this.loadPhongBan();
          this.loadChucVu();
          this.loadDataGeneral();
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
      .getDSChucvu_HR()
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
    this.filterChucVus.next(this.chucvus.filter((item) => item.tenchucdanh.toLowerCase().indexOf(search) > -1));
  }

  onSubmit(withBack: boolean) {
    if (this.itemForm.valid) {
      const acc = this.prepareDataFromFB();
      if (this.isAdd || this.isCopy) 
        this.create(acc, withBack);
      else 
        this.capnhat(acc);
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
    //==================================================
    acc.staffId = (this.isAdd || this.isCopy) ? -1 : this.staffId;
    acc.phoneNumber = this.itemForm.controls.SoDienThoai.value;
    acc.departmemtId = +this.itemForm.controls.PhongBan.value;
    acc.jobtitleId = +this.itemForm.controls.ChucVu.value;

    acc.gender = +this.itemForm.controls.GioiTinh.value;
    acc.email = this.itemForm.controls.Email.value;
    acc.fullName = this.itemForm.controls.HoTen.value;
    acc.avatar = this.imgFile ? this.imgFile.split(',')[1] : '';
    acc.staffTypeId = +this.itemForm.controls.LoaiNhanVien.value;
    acc.startDate = this.f_convertDate(this.itemForm.controls.NgayVaoLam.value);
    acc.placeOfBirth = (this.itemForm.controls.NoiSinh.value != "" && this.itemForm.controls.NoiSinh.value != undefined) ? this.itemForm.controls.NoiSinh.value : "";
    acc.dateOfBirth = this.f_convertDate(this.itemForm.controls.NgaySinh.value);

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
        this.changeDetect.detectChanges();
      };
      reader.readAsDataURL(event.target.files[0]);
    } else {
      this.imgFile = "../assets/media/Img/NoImage.jpg";
      this.changeDetect.detectChanges();
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
              saveMessageTranslateParam += 'landingpagekey.THEMTHANHCONG';
              const saveMessage = 'Thêm thành công';
              const messageType = MessageType.Create;
              this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
              this.itemForm.reset();
              this.createForm();
              this.setValueCheckboxes();
            }
          } else {
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
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

  capnhat(acc: any) {
    this.isLoadingSubmit$.next(true);
    acc._jobtitleId = acc.jobtitleId;
    const sb = this.accountManagementService
      .capNhatThongTinNV(acc)
      .pipe(
        tap((res) => {
          this.isLoadingSubmit$.next(false);
          if (res && res.status == 1) {
            if (this.isActive) {
              acc.jobtitleId = res.data.jobtitleId;
              acc.managerUsername = res.data.managerUsername;
              acc.departmemt = res.data.departmemt;
              acc.jobtitle = res.data.jobtitle;
              this.create(acc, true);
            } else {
              this.dialogRef.close(res);
            }
          } else {
            this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
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
    // empty.AppCode = this.listApp.filter((item) => item.IsDefaultApp).map((item) => item.AppCode);
    // empty.AppID = this.listApp.filter((item) => item.IsDefaultApp).map((item) => item.AppID);
    // return this.danhmuc.isEqual(empty, model);
    return true;
  }

  f_convertDate(v: any) {
    if (v != "" && v != undefined) {
      let a = new Date(v);
      return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
    }
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
    this.DepartmentName = val.Title;
  }
  //=================================================================
  loadDataGeneral() {
    this.accountManagementService.GetListLoaiNhanVien().subscribe(res => {
      if (res && res.status == 1) {
        this.listLoaiNhanVien = res.data;
        let obj = this.listLoaiNhanVien.find(x => x.IsDefault);
        if (obj) {
          this.itemForm.controls.LoaiNhanVien.patchValue(obj.RowID);
        }
      } else {
        this.listLoaiNhanVien = [];
      }
      this.changeDetect.detectChanges();
    })

    this.accountManagementService.GetListNoiSinh().subscribe(res => {
      if (res && res.status == 1) {
        this.listNoiSinh = [...res.data];
        this.filterNoiSinhs.next([...res.data]);
        this.itemForm.controls.NoiSinhFilterCtrl.valueChanges.subscribe(() => {
          this.profilterNoiSinhs();
        });
      } else {
        this.listNoiSinh = [];
      }
      this.changeDetect.detectChanges();
    })
  }

  protected profilterNoiSinhs() {
    if (!this.itemForm.controls.NoiSinh) {
      return;
    }
    let search = this.itemForm.controls.NoiSinhFilterCtrl.value;
    if (!search) {
      this.filterNoiSinhs.next([...this.listNoiSinh]);
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filterNoiSinhs.next(this.listNoiSinh.filter((item) => item.Province.toLowerCase().indexOf(search) > -1));
  }

  //=============================================================================
  loadChiTietNhanVienJeeHR() {
    const sb3 = this.accountManagementService
      .DetailsStaffID(this.data.item.staffId)
      .pipe(
        tap((res) => {
          this.staffId = this.data.item.staffId;
          this.item = new AccountManagementModel();
          this.item.departmemtId = res.departmemtId;
          this.item.departmemt = res.departmemt;
          this.item.jobtitleId = res.jobtitleId;
          this.item.jobtitle = res.jobtitle;
          this.item.gender = res.gender;
          this.item.email = res.email;
          this.item.managerUsername = res.managerUsername;
          this.itemForm.controls.HoTen.patchValue(res.fullName);
          this.itemForm.controls.SoDienThoai.patchValue(res.phoneNumber != null && res.phoneNumber != "" ? res.phoneNumber : '');
          // if (res.phoneNumber != null && res.phoneNumber != "") {
          //   this.itemForm.controls.SoDienThoai.disable();
          // }
          this.itemForm.controls.PhongBan.patchValue(res.departmemtId);
          this.itemForm.controls.ChucVu.patchValue(res._jobtitleId);
          this.itemForm.controls.GioiTinh.patchValue('' + res.gender);
          this.itemForm.controls.Email.patchValue(res.email);
          this.itemForm.controls.LoaiNhanVien.patchValue(+res.staffTypeId);
          this.itemForm.controls.NoiSinh.patchValue(+res.placeOfBirth);
          this.imgFile ? this.imgFile.split(',')[1] : '';
          this.itemForm.controls.NgayVaoLam.patchValue(res.startDate);
          if (res.dateOfBirth != null && res.dateOfBirth != '') {
            let date = this.f_convertDate(res.dateOfBirth);
            this.itemForm.controls.NgaySinh.patchValue(date);
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
}
