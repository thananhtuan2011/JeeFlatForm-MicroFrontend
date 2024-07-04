import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Configuration, OpenAIApi } from 'openai';
import { BehaviorSubject, Subscription } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { GuideSystemService } from '../guide-system.service';
import { Router } from '@angular/router';
import { PhanQuyenTaiKhoanService } from './Services/permision-admin-app.service';
import { PaginatorState } from 'src/app/modules/crud/models/paginator.model';
import { SortState } from 'src/app/modules/crud/models/sort.model';
import { GroupingState } from 'src/app/modules/crud/models/grouping.model';
import { MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { LayoutUtilsService } from 'src/app/modules/crud/utils/layout-utils.service';
@Component({
  selector: 'app-phan-quyen-tai-khoan',
  templateUrl: './phan-quyen-tai-khoan.component.html',
  styleUrls: ['./phan-quyen-tai-khoan.component.scss']
})
export class PhanQuyenTaiKhoanComponent implements OnInit {
  chatConversation: any[] = [];
  response!: any | undefined;
  promptText: string = "";
  _loading$ = new BehaviorSubject<boolean>(
    false
  );
  public data: any = [];
  displayedColumns: any[] = [];
  columnsToDisplay: any[] = [];
  constructor(public _GuideSystemService: GuideSystemService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private _PhanQuyenTaiKhoanService: PhanQuyenTaiKhoanService,
    private layoutUtilsService: LayoutUtilsService,
  ) {
  }

  ngOnInit(): void {
    this._GuideSystemService.checkAdmin().subscribe(res => {
      if (res && res.status == 1 && res.data.Type == 1) {
        this._GuideSystemService.getStrConfig(14, "Admin_step3").subscribe(res => {
          if (res && res.status == 1 && res.data.length > 0) {
            this._GuideSystemService.textStep3 = res.data[0] ? res.data[0].Mota : "";
          }
          this.changeDetectorRefs.detectChanges();
        })
        let _item = {
          StepID: 2
        }
        this._GuideSystemService.updateStepCustomer(_item).subscribe(res => { })
        this.loadDataList();
      } else {
        this.router.navigate(['/Dashboard']);
      }
    })
  }

  loadDataList() {
    this._PhanQuyenTaiKhoanService.getAllItems().subscribe((res) => {
      if (res && res.data.length > 0) {
        this.data = res.data;
        this.buildDisplayedColumns();
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  buildDisplayedColumns() {
    this.displayedColumns = [];
    this.columnsToDisplay = [];
    let _data = this.data[0];
    if (_data == undefined) {
      return null;
    }
    this.columnsToDisplay = ["STT", "Title", "Phone"];
    _data.Apps.forEach((result) => {
      if (result.AppID != 3 && result.AppID != 14) {
        this.displayedColumns.push(result);
        this.columnsToDisplay.push('' + result.AppID);
      }
    });
    this.changeDetectorRefs.detectChanges();
  }

  getCheck(item, column): boolean {
    let obj = item.Apps.find(x => x.AppID == column.AppID);
    if (obj) {
      return obj.IsAdmin;
    }
    return false;
  }

  change(item, column) {
    let obj = item.Apps.find(x => x.AppID == column.AppID);
    if (obj.IsAdmin) {
      //Xóa dữ liệu
      this._PhanQuyenTaiKhoanService.RemoveAdminApp(item.UserId, column.AppID).subscribe(
        (res) => {
          if (res.statusCode != 1) {
            this.layoutUtilsService.showActionNotification(res.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
          }
          this.loadDataList();
        },
      );
    } else {
      //Thêm dữ liêu
      let _item = {
        "Username": item.Username,
        "Fullname": item.FullName,
        "Display": item.FullName + "(" + item.Username + ")",
        "UserId": item.UserId
      }
      this._PhanQuyenTaiKhoanService.createAdminApp(_item, column.AppID).subscribe(
        (res) => {
          if (res.statusCode != 1) {
            this.layoutUtilsService.showActionNotification(res.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
          }
          this.loadDataList();
        },
      );
    }
  }
  //========================================================================

  getHeightFull(): any {
    let tmp_height = 0;
    let text = document.getElementById("text").clientHeight;
    tmp_height = window.innerHeight - (text + 195);
    return tmp_height + 'px';
  }

  TiepTuc() {
    this.router.navigate([`/Config-System/3`]);
  }

  TroLai() {
    this.router.navigate([`/Config-System/1`]);
  }
}
