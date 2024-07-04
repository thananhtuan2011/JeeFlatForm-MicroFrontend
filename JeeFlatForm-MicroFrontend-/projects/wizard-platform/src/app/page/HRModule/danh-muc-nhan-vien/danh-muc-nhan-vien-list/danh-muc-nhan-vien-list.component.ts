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

import { DanhMucNhanVienService } from '../Services/danh-muc-nhan-vien.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { DanhMucChungService } from '../../hr.service';
import { DanhMucNhanVienEditComponent } from '../danh-muc-nhan-vien-edit/danh-muc-nhan-vien-edit.component';


@Component({
  selector: 'app-danh-muc-nhan-vien-list',
  templateUrl: './danh-muc-nhan-vien-list.component.html',
  styleUrls: ["./danh-muc-nhan-vien-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhMucNhanVienListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'STT',
    'HoTen',
    'PhongBan',
    'ChucVu',
    'DienThoai',
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
  textLoaiHopDong: string = ""
  listtypestaff: any[] = [];
  constructor(
    public _DanhMucNhanVienService: DanhMucNhanVienService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private changeDetectorRefs: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private router: Router,
    public _DanhMucChungService: DanhMucChungService,
  ) { }
  /** LOAD DATA */
  ngOnInit() {
    this.sortOrder = 'asc';
    this.sortField = '';
    this.page = 0;
    this.record = 50;
    this.more = false;
    this.flag = true;
    this.LoadData();

    // this._DanhMucChungService.getStrConfig(1,"hr_nhanvien").subscribe(res => {
    // 	if (res && res.status == 1 && res.data.length > 0) {
    // 		this._DanhMucChungService.textHR5 = res.data[0] ? res.data[0].Mota : "";
    // 	}
    // 	this.changeDetectorRefs.detectChanges();
    // })
  }

  getHeight(): any {
    let tmp_height = 600 - 325;
    return tmp_height + "px";
  }

  TroLai() {
    this.router.navigate([`/WizardHR/ContractType`]);
  }

  TiepTuc() {
    this.router.navigate([`/WizardHR/Calendar`]);
  }


  Edit(_item: any) {
    const _saveMessage = this.translate.instant('JeeHR.capnhatthanhcong');
    const _messageType = MessageType.Update;
    const dialogRef = this.dialog.open(DanhMucNhanVienEditComponent, {
      data: { _item, _IDNV: _item.ID_NV },
      panelClass: ['hr-padding-0', 'width600'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
      }
      else {
        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
        this.ngOnInit();
      }
    });
  }
  //==================================================================
  LoadData() {
    let queryParams;
    //Start - Load lại cho thanh scroll lên đầu - 19/01/2024
    document.getElementById("listScroll").scrollTop = 0;
    //End - Load lại cho thanh scroll lên đầu - 19/01/2024
    this.layoutUtilsService.showWaitingDiv();
    queryParams = new QueryParamsModel(
      this.filter()
    );
    queryParams.sortOrder = this.sortOrder;
    queryParams.sortField = this.sortField;
    queryParams.pageNumber = this.page;
    queryParams.pageSize = this.record;
    queryParams.more = this.more;
    this._DanhMucNhanVienService.findData(queryParams).subscribe(
      (res) => {
        this.layoutUtilsService.OffWaitingDiv();
        if (res && res.status == 1) {
          this.AllPage = res.page.AllPage;
        } else {
          this.AllPage = 0;
        }
        this.dataSource.data = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    );
  }

  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop + 110 >=
      event.target.scrollHeight
    ) {
      if (this.page + 1 < this.AllPage && this.flag) {
        this.flag = false;
        this.page++;
        this.LoadDataLazy();
      }
    }
  }

  LoadDataLazy() {
    let queryParams;
    this.layoutUtilsService.showWaitingDiv();
    queryParams = new QueryParamsModel(
      this.filter()
    );
    queryParams.sortOrder = this.sortOrder;
    queryParams.sortField = this.sortField;
    queryParams.pageNumber = this.page;
    queryParams.pageSize = this.record;
    queryParams.more = this.more;
    this._DanhMucNhanVienService.findData(queryParams).subscribe((res) => {
      this.layoutUtilsService.OffWaitingDiv();
      if (res && res.status == 1) {
        let newList = res.data;
        newList.forEach((element) => {
          this.dataSource.data.push(element);
        });
        this.dataSource._updateChangeSubscription();
        this.flag = true;
      }
    });
  }

  filter(): any {
    const filterNew: any = {};
    return filterNew;
  }
  //===============================================================
}