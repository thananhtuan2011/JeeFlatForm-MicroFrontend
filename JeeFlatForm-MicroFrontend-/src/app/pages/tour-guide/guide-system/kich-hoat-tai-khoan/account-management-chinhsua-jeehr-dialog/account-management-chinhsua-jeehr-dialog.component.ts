import { AccountManagementDTO, CheckEditAppListByDTO } from './../Model/account-management.model';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountManagementModel, AppListDTO, JeeHRNhanVien } from '../Model/account-management.model';
import { AccountManagementService } from '../Services/account-management.service';
import { ReplaySubject, of, BehaviorSubject, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { catchError, finalize, tap } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { DeleteEntityDialogComponent } from 'src/app/modules/crud';
import { ResultModel } from 'src/app/modules/auth/models/_base.model';

@Component({
  selector: 'app-account-management-chinhsua-jeehr-dialog',
  templateUrl: './account-management-chinhsua-jeehr-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountManagementChinhSuaJeeHRDialogComponent implements OnInit, OnDestroy {
  item: AccountManagementModel;
  itemData: AccountManagementDTO;
  userid: number;
  staffid: number = 0;
  itemForm = this.fb.group({
    NhanVien: ['', [Validators.required]],
    NhanVienFilterCtrl: [],
    AppsCheckbox: new FormArray([]),
  });
  listApp: CheckEditAppListByDTO[] = [];
  CompanyCode: string;
  imgFile = '../assets/media/Img/NoImage.jpg';
  // ngx-mat-search area
  NhanViens: JeeHRNhanVien[] = [];
  newpassword: string;
  filterNhanViens: ReplaySubject<JeeHRNhanVien[]> = new ReplaySubject<JeeHRNhanVien[]>();
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
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AccountManagementChinhSuaJeeHRDialogComponent>,
    private fb: FormBuilder,
    public accountManagementService: AccountManagementService,
    private changeDetect: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public datepipe: DatePipe,
    private translateService: TranslateService,
    public dialog: MatDialog,
    public cd: ChangeDetectorRef
  ) { }

  ngOnDestroy(): void {
    this.accountManagementService.ngOnDestroy();
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  createForm() {
    this.itemForm = this.fb.group({
      NhanVien: ['', [Validators.required]],
      NhanVienFilterCtrl: [],
      AppsCheckbox: new FormArray([]),
    });
  }

  currentUser: any = {};
  ngOnInit(): void {
    this._isFirstLoading$.next(true);
    if (this.data.item) {
      this.item = new AccountManagementModel();
      this.itemData = this.data.item;
      this.userid = this.itemData.userId;
      this.initItemData();
      this.getPassword();
    } else {
      this.item = new AccountManagementModel();
    }
    const sb = this.accountManagementService
      .GetEditListAppByUserIDByListCustomerId(this.userid)
      .pipe(
        tap((res: ResultModel<CheckEditAppListByDTO>) => {
          if (res) {
            // const index = res.data.findIndex((item) => item.AppID === 14);
            // if (index > -1) res.data.splice(index, 1);
            this.listApp = res.data;
            this.accountManagementService.GetListAppByCustomerID().subscribe((x) => {
              const lstAppCustomer = x.data;
              lstAppCustomer.forEach((app) => {
                let isExist = false;
                this.listApp.forEach((item) => {
                  if (item.AppID === app.AppID) {
                    isExist = true;
                  }
                });
                //thiên đóng if (!isExist && app.AppID !== 14) {
                if (!isExist) {
                  const noApp: CheckEditAppListByDTO = {
                    AppID: app.AppID,
                    AppCode: app.AppCode,
                    AppName: app.AppName,
                    Disable: false,
                    IsUsed: false,
                  };
                  this.listApp.push(noApp);
                }
              });
              this.addCheckboxes();
              this.initItemListApp();
            });
          }
        }),
        finalize(() => {
          this._isFirstLoading$.next(true);
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

  GetCommonInfo(userid: number) {
    const sb5 = this.accountManagementService
      .GetCommonAccount(userid)
      .pipe(
        tap((res) => {
          this.staffid = res.StaffID;
          this.itemForm.controls.NhanVien.patchValue(this.staffid);
        }),
        finalize(() => {
          this._isLoading$.next(false);
        }),
        catchError((err) => {
          console.log(err);
          this._errorMessage$.next(err);
          return of();
        })
      )
      .subscribe();
    this.subscriptions.push(sb5);
  }
  getPassword() {
    var out = [];
    for (var i = 0; i < this.itemData.username.length; i++) {
      out.push('*');
    }
    this.newpassword = out.join('');
  }
  resetPassword() {
    let saveMessageTranslateParam = 'COMMOM.MATKHAUMOI';
    let saveMessage = this.translateService.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const _title = this.translateService.instant('COMMOM.RESETMATKHAU');
    const _description = this.translateService.instant('COMMOM.RESETMATKHAUDESCRIPTION');
    const dialogRef = this.dialog.open(DeleteEntityDialogComponent, {
      data: { description: _description, title: _title },
      width: '450px',
    });
    const sb = dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.accountManagementService.ResetPassword(this.itemData._username).subscribe(
          (res) => {
            this.newpassword = res.newpassword;
            saveMessage += ': ' + this.newpassword;
            this.cd.detectChanges();
            this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
          },
          (error) => {
            this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
          },
          () => {
            // this.accountManagementService.fetch();
          }
        );
      }
    });
    this.subscriptions.push(sb);
  }
  initItemData() {
    const sb3 = this.accountManagementService
      .DetailsStaffID(this.data.item.staffId)
      .pipe(
        tap((res) => {
          debugger
          this.currentUser = {
            Email: res.email ? res.email : "",
            HoTen: res.fullName,
            IDNV: this.data.item.staffId,
            MaNV: '',
            NgaySinh: res.dateOfBirth ? res.dateOfBirth : "",
            Phai: res.gender,
            PhoneNumber: res.phoneNumber ? res.phoneNumber : "",
            structureid: res.departmemtId,
            Structure: res.departmemt,
            jobtitleid: res.jobtitleId,
            TenChucVu: res.jobtitle,
            Title: '',
            avatar: res.avatar,
            username: this.data.item._username
          };
          this.loadNhanVienJeeHR();
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
  initItemListApp() {
    let lstUserd = this.listApp.filter((item) => item.IsUsed);
    let appId = lstUserd.map((item) => item.AppID);
    let appCode = lstUserd.map((item) => item.AppCode);
    this.item.AppID = appId;
    this.item.AppCode = appCode;
  }

  get AppsFromArray() {
    return this.itemForm.get('AppsCheckbox') as FormArray;
  }

  private addCheckboxes() {
    this.listApp.forEach((item) => this.AppsFromArray.push(new FormControl(item.IsUsed)));
  }

  loadNhanVienJeeHR() {
    const sb3 = this.accountManagementService
      .GetListJeeHR()
      .pipe(
        tap((res) => {
          this.NhanViens = [...res];
          this.NhanViens.push(this.currentUser);
          this.filterNhanViens.next([...this.NhanViens]);
          this.itemForm.controls.NhanVienFilterCtrl.valueChanges.subscribe(() => {
            this.profilterNhanViens();
          });
          this.GetCommonInfo(this.userid);
        }),
        finalize(() => {
          this._isFirstLoading$.next(false);
          this._isLoading$.next(false);
        }),
        catchError((err) => {
          console.log(err);
          this.NhanViens.push(this.currentUser); //api tra lo van co
          this.filterNhanViens.next([...this.NhanViens]);
          this._errorMessage$.next(err);
          return of();
        })
      )
      .subscribe();
    this.subscriptions.push(sb3);
  }

  protected profilterNhanViens() {
    if (!this.itemForm.controls.NhanVien) {
      return;
    }
    let search = this.itemForm.controls.NhanVienFilterCtrl.value;
    if (!search) {
      this.filterNhanViens.next([...this.NhanViens]);
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filterNhanViens.next(this.NhanViens.filter((item) => item.HoTen.toLowerCase().indexOf(search) > -1));
  }

  onSubmit(withBack: boolean) {
    debugger
    if (this.itemForm.valid) {
      const acc = this.prepareDataFromFB();
      this.update(acc, withBack);
    } else {
      this.validateAllFormFields(this.itemForm);
    }
  }

  prepareDataFromFB(): AccountManagementModel {
    const acc = new AccountManagementModel();
    acc.Username = this.itemData._username;
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
    if (this.itemForm.controls.NhanVien.value) {
      const indexNhanvien = +this.itemForm.controls.NhanVien.value;
      let obj = this.NhanViens.find(x => x.IDNV == +this.itemForm.controls.NhanVien.value);
      let nhanvien = this.NhanViens.find((item) => item.IDNV == indexNhanvien);
      acc.Fullname = nhanvien.HoTen;
      acc.Email = nhanvien.Email;
      acc.Phonemumber = '';
      acc.DepartmemtID = nhanvien.structureid;
      if (nhanvien.structureid != 0) acc.Departmemt = nhanvien.Structure;
      acc.JobtitleID = nhanvien.jobtitleid;
      if (nhanvien.jobtitleid != 0) acc.Jobtitle = nhanvien.TenChucVu;
      acc.ImageAvatar = nhanvien.avatar;
      acc.Birthday = nhanvien.NgaySinh;
      acc.StaffID = nhanvien.IDNV;
      acc.staffId = nhanvien.IDNV;
    }
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
  update(acc: AccountManagementModel, withBack: boolean = false) {
    this.isLoadingSubmit$.next(true);
    const sb = this.accountManagementService
      .UpdateAccount(acc)
      .pipe(
        tap((res) => {
          this.isLoadingSubmit$.next(false);
          if (withBack) {
            this.dialogRef.close(res);
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
    // if (this.checkDataBeforeClose()) {
    //   this.dialogRef.close();
    // } else {
    //   const _title = this.translateService.instant('CHECKPOPUP.TITLE');
    //   const _description = this.translateService.instant('CHECKPOPUP.DESCRIPTION');
    //   const _waitDesciption = this.translateService.instant('CHECKPOPUP.WAITDESCRIPTION');
    //   const popup = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    //   popup.afterClosed().subscribe((res) => {
    //     res ? this.dialogRef.close() : undefined;
    //   });
    // }
    this.dialogRef.close();
  }

  format_date(value: any, args?: any): any {
    let latest_date = this.datepipe.transform(value, 'dd/MM/yyyy');
    return latest_date;
  }

  checkDataBeforeClose(): boolean {
    const model = this.prepareDataFromFB();
    if (this.item.AppID.length !== model.AppID.length || model.Username !== this.item.Username) return false;
    return true;
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeunloadHandler(e) {
    if (!this.checkDataBeforeClose()) {
      e.preventDefault(); //for Firefox
      return (e.returnValue = ''); //for Chorme
    }
  }
}
