import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { fromEvent, merge, BehaviorSubject, Subscription } from 'rxjs';
// RXJS
// Services

// Models
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

import { HinhThucChamCongService } from '../Services/hinh-thuc-cham-cong.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { StaffTypeModel } from '../Model/hinh-thuc-cham-cong.model';


@Component({
  selector: 'app-hinh-thuc-cham-cong-list',
  templateUrl: './hinh-thuc-cham-cong-list.component.html',
  styleUrls: ["./hinh-thuc-cham-cong-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HinhThucChamCongListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'STT',
    'Title',
    'IsAnnualLeave',
    'actions',
  ];
  sortOrder: string;
  sortField: string;
  page: number;
  record: number;
  more: boolean;
  AllPage: any;
  flag: boolean;
  //============================================================
  listData: any[] = [];
  constructor(
    public _HinhThucChamCongService: HinhThucChamCongService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private changeDetectorRefs: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private router: Router,
  ) { }
  daTV: boolean = false;
  /** LOAD DATA */
  ngOnInit() {
    this.sortOrder = 'asc';
    this.sortField = '';
    this.page = 0;
    this.record = 50;
    this.more = false;
    this.flag = true;
    this.LoadData();
  }

  getHeight(): any {
    let tmp_height = 600 - 192;
    return tmp_height + "px";
  }

  TroLai() {
    this.router.navigate([`/WizardHR/Calendar`]);
  }

  TiepTuc() {
    let obj = this.listData.find(x => x.isCheck);
    if (obj) {
      if (obj.type == "") {
        this._HinhThucChamCongService.Update().subscribe(
          (res) => {
            if (res && res.status == 1) {
              this.router.navigate([`/WizardHR/Complete`]);
            }
            this.changeDetectorRefs.detectChanges();
          }
        );
      } else {
        this.router.navigate([`/WizardHR/Config/` + obj.type]);
      }
    }
  }

  //==================================================================
  LoadData() {
    let _data = [{
      "id": "1",
      "title": 'Chấm công bằng wifi trên ứng dụng di động',
      "description": 'Bạn tạo địa điểm (ví dụ văn phòng) -> khai báo các wifi tại địa điểm (một địa điểm có thể có nhiều wifi) -> Thêm nhận được phép chấm công vào danh sách chấm công tại địa điểm đó.Nhân viên sẽ đến địa điểm, kết nối vào 1 trong các wifi đã được khai báo cho phép chấm công công, mở ứng dụng DP247 và thực hiện chấm công.',
      "isCheck": true,
      "type": "Wifi"
    },
    {
      "id": "2",
      "title": 'Chấm công tự động',
      "description": 'Hệ thống sẽ mặc định nhân viên có đi làm tất cả các ngày theo quy định. Nếu nhân sự vắng mặt sẽ gửi đơn trên hệ thống hoặc nhân viên chấm công sẽ nhập vào phần mềm, nếu nhân viên đi trễ thì nhân viên chấm công sẽ chính sửa giờ theo giờ đi làm thực tế',
      "isCheck": false,
      "type": ""
    },
    {
      "id": "3",
      "title": 'Chấm công bằng máy quét vân tay',
      "description": 'Tải ứng dụng kết nối máy chấm công, cài đặt và phân quyền theo hướng dẫn đính kèm, cập nhật mã chấm công tương ứng với nhân viên. Hàng ngày bạn mở ứng dụng kết nối máy chấm công, đăng nhập và bấm tải dữ liệu chấm công để đẩy dữ liệu từ máy vân tay lên phần mềm',
      "isCheck": false,
      "type": "FingerPrint"
    },
    {
      "id": "4",
      "title": 'Chấm công bằng camera Al',
      "description": 'Bạn mua hoặc sẵn có camera chấm công AI của Hanet. Dữ liệu chấm công từ Camera sẽ được đẩy về hệ thống (thời gian đẩy về phụ thuộc vào hệ thống của Hanet). Thực hiện kết nối giữa hệ thống DP247 và Hanet khi bạn đã có sẵn tài khoản Hanet.',
      "isCheck": false,
      "type": "Hanet"
    }]
    this.listData = _data;
  }

  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop + 110 >=
      event.target.scrollHeight
    ) {
      if (this.page + 1 < this.AllPage && this.flag) {
        this.flag = false;
        this.page++;
        // this.LoadDataLazy();
      }
    }
  }

  filter(): any {
    const filterNew: any = {};
    return filterNew;
  }
  //===============================================================
  change(item) {
    this.listData.forEach(res => {
      if (res.id == item.id) {
        res.isCheck = true;
      } else {
        res.isCheck = false;
      }
    })
    this.changeDetectorRefs.detectChanges();
  }
}