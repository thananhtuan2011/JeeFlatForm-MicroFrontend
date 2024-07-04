import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { BehaviorSubject, Subscription, of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GuideSystemService } from '../guide-system.service';
import { Router } from '@angular/router';
import { AccountManagementService } from './Services/account-management.service';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { PostImgModel } from './Model/account-management.model';
import { AuthService } from 'src/app/modules/auth';
import { ResultModel } from 'src/app/modules/auth/models/_base.model';
import { catchError, tap } from 'rxjs/operators';
import { ChangeTinhTrangEditDialogComponent } from './change-tinh-trang-edit-dialog/change-tinh-trang-edit-dialog.component';
import { DeleteEntityDialogComponent } from 'src/app/modules/crud';
import { AccountManagementJeeHRAddStaffDialogComponent } from './account-management-jeehr-add-staff-dialog/account-management-jeehr-add-staff-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { AccountManagementChinhSuaNoJeeHRDialogComponent } from './account-management-chinhsua-nojeehr-dialog/account-management-chinhsua-nojeehr-dialog.component';
import { AccountManagementChinhSuaJeeHRDialogComponent } from './account-management-chinhsua-jeehr-dialog/account-management-chinhsua-jeehr-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { AccountManagementJeeHRActivatedComponent } from './account-management-jeehr-activated/account-management-jeehr-activated.component';
import { PaginatorState } from 'src/app/modules/crud/models/paginator.model';
import { SortState } from 'src/app/modules/crud/models/sort.model';
import { GroupingState } from 'src/app/modules/crud/models/grouping.model';
import { AccountManagementJeeHRUpdateInfoDialogComponent } from './account-management-jeehr-update-info/account-management-jeehr-update-info.component';
@Component({
  selector: 'app-kich-hoat-tai-khoan',
  templateUrl: './kich-hoat-tai-khoan.component.html',
  styleUrls: ['./kich-hoat-tai-khoan.component.scss']
})
export class KichHoatTaiKhoanComponent implements OnInit {
  chatConversation: any[] = [];
  response!: any | undefined;
  promptText: string = "";
  _loading$ = new BehaviorSubject<boolean>(
    false
  );
  paginator: PaginatorState;
  sorting: SortState;
  grouping: GroupingState;

  img: string = "";
  imgFile: string = '';
  isJeeHR: boolean;
  isAdminHeThong: boolean;
  isCreateAcc: boolean = false;
  version: string = "2.0";
  private subscriptions: Subscription[] = [];
  isLoading: boolean = false;
  listApp: any[] = [];

  data: string = '<span>Hệ thống đã tạo sẵn tài khoản quản trị bằng số điện thoại bạn đã cung cấp và 5 tài khoản dùng mẫu. Bạn có thể chỉnh sửa các tài khoản</span><br/><span>người dùng mẫu này cho phù hợp và kích hoạt để sử dụng, hoặc có thê xóa các tài khoản không cần thiết. Để kích hoạt tài khoản bạn click vào</span><br/><span> "Kích hoạt" tài khoản tương ứng và nhập số điện thoại cho tài khoản này. Tin nhắn sẽ được gửi đến số điện thoại, người dùng mở liên kết trong</span><br/><span>tin nhắn, nhập mã kích hoạt trong tin nhắn để bắt đầu sử dụng. Dưới đây là danh sách tài khoản:</span>';
  constructor(public _GuideSystemService: GuideSystemService,
    private changeDetectorRefs: ChangeDetectorRef,
    public accountManagementService: AccountManagementService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private auth: AuthService,
    private router: Router,) {
  }

  ngOnInit(): void {
    this._GuideSystemService.checkAdmin().subscribe(res => {
      if (res && res.status == 1 && res.data.Type == 1) {
        this.accountManagementService.fetch(this.version);
        this.grouping = this.accountManagementService.grouping;
        this.paginator = this.accountManagementService.paginator;
        this.sorting = this.accountManagementService.sorting;
        const sb = this.accountManagementService.isLoading$.subscribe((res) => (this.isLoading = res));
        this.subscriptions.push(sb);
        this.loadListApp();
        const userid = +this.auth.getAuthFromLocalStorage()['user']['customData']['jee-account']['userID'];
        this.accountManagementService.isAdminHeThong(userid).subscribe((res) => {
          this.isAdminHeThong = res.IsAdmin;
        });
        this.accountManagementService.CheckRoles(6).subscribe((res) => {
          this.isCreateAcc = res.isUserRole;
        });
        this._GuideSystemService.getStrConfig(14, "Admin_step2").subscribe(res => {
          if (res && res.status == 1 && res.data.length > 0) {
            this._GuideSystemService.textStep2 = res.data[0] ? res.data[0].Mota : "";
          }
          this.changeDetectorRefs.detectChanges();
        })
        let _item = {
          StepID: 1
        }
        this._GuideSystemService.updateStepCustomer(_item).subscribe(res => { })
      } else {
        this.router.navigate(['/Dashboard']);
      }
    })
  }

  loadListApp() {
    const sb = this.accountManagementService
      .GetListAppByCustomerID()
      .pipe(
        tap((res: ResultModel<any>) => {
          if (res) {
            this.listApp = res.data;
            this.isJeeHR = this.listApp.map((item) => item.AppCode).includes('JeeHR');
          }
        })
      )
      .subscribe();
    this.subscriptions.push(sb);
  }

  getHeightFull(): any {
    let tmp_height = 0;
    let text = document.getElementById("text").clientHeight;
    tmp_height = window.innerHeight - (text + 195);
    return tmp_height + 'px';
  }

  getHeightFull2(): any {
    let tmp_height = 0;
    let text = document.getElementById("text").clientHeight;
    tmp_height = window.innerHeight - (text + 230);
    return tmp_height + 'px';
  }

  changeTinhTrang(Username: string) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Thay đổi tình trạng thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(ChangeTinhTrangEditDialogComponent, {
      data: { Username: Username }, width: '500px', panelClass: ['padding-0']
    });
    const sb = dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.accountManagementService.fetch(this.version);
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.accountManagementService.fetch(this.version);
      }
    });
    this.subscriptions.push(sb);
  }

  onFileChange(event, username: string) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Thêm thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imgFile = e.target.result.split(',')[1];
        const postimg = new PostImgModel();
        postimg.imgFile = this.imgFile;
        postimg.Username = username;
        const sb = this.accountManagementService
          .UpdateAvatarWithChangeUrlAvatar(postimg)
          .pipe(
            tap((res) => {
              this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
              this.imgFile = '';
              this.accountManagementService.fetch(this.version);
            }),
            catchError((err) => {
              console.log(err);
              this.layoutUtilsService.showActionNotification(err.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
              this.imgFile = '';
              return of();
            })
          )
          .subscribe();
        this.subscriptions.push(sb);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  DepartmentName: string = '';
  DepartmentID: number = 0;
  update(item) {
    // let saveMessageTranslateParam = 'COMMOM.THEMMOITHANHCONG';
    const saveMessage = "Thành công";
    const messageType = MessageType.Create;
    if (!this.isJeeHR) {
      if (item.userId > 0) {

      } else {
        const dialogRef = this.dialog.open(AccountManagementChinhSuaNoJeeHRDialogComponent, {
          data: { item: item, _isAdminHeThong: this.isAdminHeThong, _isCreateAcc: this.isCreateAcc }, panelClass: ['padding-0']
        });
        const sb = dialogRef.afterClosed().subscribe((res) => {
          if (!res) {
            this.accountManagementService.fetch(this.version);
          } else {
            this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
            this.accountManagementService.fetch(this.version);
          }
        });
        this.subscriptions.push(sb);
      }
    }
    if (this.isJeeHR) {
      if (item.userId > 0) {
        // const dialogRef = this.dialog.open(AccountManagementChinhSuaJeeHRDialogComponent, {
        //   data: { item: item },
        //   width: '700px',
        //   panelClass: ['padding-0']
        // });
        // const sb = dialogRef.afterClosed().subscribe((res) => {
        //   if (!res) {
        //     this.accountManagementService.fetch(this.version);
        //   } else {
        //     this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        //     this.accountManagementService.fetch(this.version);
        //   }
        // });
        // this.subscriptions.push(sb);
        const dialogRef = this.dialog.open(AccountManagementJeeHRUpdateInfoDialogComponent, {
          data: { item: item },
          width: '700px',
          panelClass: ['padding-0']
        });
        const sb = dialogRef.afterClosed().subscribe((res) => {
          if (!res) {
            this.accountManagementService.fetch(this.version);
          } else {
            this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
            this.accountManagementService.fetch(this.version);
          }
        });
        this.subscriptions.push(sb);
      } else {
        const dialogRef = this.dialog.open(AccountManagementJeeHRAddStaffDialogComponent, {
          data: { _DepartmentID: this.DepartmentID, _DepartmentName: this.DepartmentName, item },
          width: '700px',
          panelClass: ['padding-0']
        });
        const sb = dialogRef.afterClosed().subscribe((res) => {
          if (!res) {
            this.accountManagementService.fetch(this.version);
          } else {
            this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
            this.accountManagementService.fetch(this.version);
          }
        });
        this.subscriptions.push(sb);
      }
    }
  }

  copy(item) {
    let saveMessageTranslateParam = 'COMMOM.CAPNHATTHANHCONG';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(AccountManagementJeeHRAddStaffDialogComponent, {
      data: { _IsCopy: true, _DepartmentID: this.DepartmentID, _DepartmentName: this.DepartmentName, item },
      width: '700px',
      panelClass: ['padding-0']
    });
    const sb = dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.accountManagementService.fetch(this.version);
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.accountManagementService.fetch(this.version);
      }
    });
    this.subscriptions.push(sb);
  }

  delete(item) {
    let saveMessageTranslateParam = 'COMMOM.XOATHANHCONG';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const _title: string = this.translate.instant("Xác nhận xóa");
    const _description: string = this.translate.instant("Bạn có chắc muốn xóa ?");
    const _waitDesciption: string = this.translate.instant("Đang xử lý...");
    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption)
    const sb = dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.accountManagementService.fetch(this.version);
      } else {
        if (item.userId > 0) {
          this.accountManagementService.Delete(item.userId).subscribe(
            (res) => {
              this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
            },
            (error) => {
              this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            },
            () => {
              this.accountManagementService.fetch(this.version);
            }
          );
        }
        else {
          this.accountManagementService.DeleteHR(item.staffId).subscribe(
            (res) => {
              this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
            },
            (error) => {
              this.layoutUtilsService.showActionNotification(error.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            },
            () => {
              this.accountManagementService.fetch(this.version);
            }
          );
        }
      }
    });
  }

  //=================================================================================
  getTextStatus(status) {
    switch (status) {
      case -3:
        return "Chưa kích hoạt";
      case -2:
        return "Chờ kích hoạt";
      case -1:
        return "Chưa xác thực";
      case 0:
        return "Đã khóa";
      default:
        return "Đã kích hoạt";
    }
  }

  getColorStatus(status) {
    switch (status) {
      case -3:
        return "#808080";
      case -2:
        return "#FF00FF";
      case -1:
        return "#FF6A00";
      case 0:
        return "#F64D60";
      default:
        return "#50CD89";
    }
  }

  UpdateStatus(item) {
    switch (item.status) {
      case -3:
        this.activeAccount(item);
      case -2:
        return "#FF00FF";
      default:
        if (item._username) {
          this.changeTinhTrang(item._username);
        }
    }
  }

  activeAccount(item) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += 'Kích hoạt thành công';
    const saveMessage = this.translate.instant(saveMessageTranslateParam);
    const messageType = MessageType.Create;
    const dialogRef = this.dialog.open(AccountManagementJeeHRActivatedComponent, {
      data: { item }, width: '700px', panelClass: ['padding-0']
    });
    const sb = dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.accountManagementService.fetch(this.version);
      } else {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.accountManagementService.fetch(this.version);
      }
    });
    this.subscriptions.push(sb);
  }

  sort(column: string): void {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this.accountManagementService.patchState({ sorting }, this.version);
  }

  paginate(paginator: PaginatorState) {
    this.accountManagementService.patchState({ paginator }, this.version);
  }

  TiepTuc() {
    this.router.navigate([`/Config-System/2`]);
  }

  TroLai() {
    this.router.navigate([`/Config-System/4`]);
  }
}
