import { catchError, finalize, share, tap } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Optional,
  SimpleChanges,
} from '@angular/core';
import moment from 'moment';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';

import { formatDate } from '@angular/common';

import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { TicKetService } from '../ticket.service';
import { LayoutUtilsService } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';

@Component({
  selector: 'app-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss'],
})
export class Step1Component implements OnInit {

  wizard: any;
  constructor(
    private router: Router,
    private TicKetService: TicKetService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
  ) {

  }
  listApp: any[] = [];
  isloadding = false;
  ngOnInit(): void {
    this.getwizard();
    this.TicKetService.getListApp().subscribe(res => {
      if (res && res.status == 1) {
        this.listApp = res.data
      }
      this.ChangeDetectorRef.detectChanges();
    })
  }
  getwizard() {
    this.TicKetService.getWizard(1).subscribe(res => {
      if (res && res.status == 1) {
        this.wizard = res.data;
        this.isloadding = true;
        this.ChangeDetectorRef.detectChanges();
      }
    })
  }

  //=====================Bổ sung nút Sử dụng dữ liệu măc định - Thiên (05/04/2024)=======
  ClickDataDefault() {
    this.layoutUtilsService.Confirm_Wizard('Sử dụng dữ liệu mặc định',
      'Hệ thống sẽ khởi tạo dữ liệu mặc định cho các thiết lập và sẽ đánh dấu hoàn thành thiết lập cho phân hệ này. Bạn có thể thay đổi các thiết lập này sau bằng cách vào ứng dụng bằng quyền admin hệ thống hoặc admin của ứng dụng. Có đúng là bạn muốn dùng dữ liệu mặc định và bỏ qua thiết lập?',
      "Đóng", "Đồng ý")
      .then((res) => {
        if (res) {
          this.TicKetService.UpdateInitStatusApp().subscribe(res => {
            if (res && res.statusCode === 1) {
              let obj = this.listApp.find(x => x.AppID == 20);
              if (obj) {
                window.location.href = obj.BackendURL;
              } else {
                this.router.navigate([`Config-System/3`]);
              }
            }
          })
        }
      })
      .catch((err) => { });
  }
}
