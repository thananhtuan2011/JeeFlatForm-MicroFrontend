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

import { DanhMucKhachService } from '../Services/danh-muc-khach.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { DM_KHModel } from '../Model/danh-muc-khach.model';
import { DanhMucKhachEditDialogComponent } from '../danh-muc-khach-edit-dialog/danh-muc-khach-edit-dialog.component';
import { DanhMucChungService } from '../../sale.service';


@Component({
  selector: 'app-danh-muc-khach-list',
  templateUrl: './danh-muc-khach-list.component.html',
  styleUrls: ["./danh-muc-khach-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhMucKhachListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'STT',
    'MaKhachHang', 'TenKhachHang', 'DiaChi', 'DienThoai', 'actions'
  ];
  sortOrder: string;
  sortField: string;
  page: number;
  record: number;
  more: boolean;
  AllPage: any;
  flag: boolean;
  listApp: any[] = [];
  constructor(
    public _DanhMucKhachService: DanhMucKhachService,
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
    this._DanhMucChungService.getListApp().subscribe(res => {
      if (res && res.status == 1) {
        this.listApp = res.data
      }
      this.changeDetectorRefs.detectChanges();
    })
  }

  getHeight(): any {
    let tmp_height = 600 - 169;
    return tmp_height + "px";
  }

  TroLai() {
    this.router.navigate([`/WizardSale/GroupCustomer`]);
  }

  TiepTuc() {
    this.router.navigate([`/WizardSale/Supplier`]);
  }

  Add() {
    const chucvuModels = new DM_KHModel();
    chucvuModels.clear(); // Set all defaults fields
    this.Edit(chucvuModels);
  }

  Edit(_item: DM_KHModel) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += _item.IDKhachHang > 0 ? 'JeeHR.capnhatthanhcong' : 'JeeHR.themthanhcong';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = _item.IDKhachHang > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(DanhMucKhachEditDialogComponent, { data: { _item }, panelClass: ['hr-padding-0', 'width600'] });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.LoadData();
      }
      else {
        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
        this.LoadData();
      }
    });
  }

  Delete(_item: DM_KHModel) {
    const _title = this.translate.instant('JeeHR.xoa');
    const _description = this.translate.instant('JeeHR.bancochacchanmuonxoakhong');
    const _waitDesciption = this.translate.instant('JeeHR.dulieudangduocxoa');
    const _deleteMessage = this.translate.instant('JeeHR.xoathanhcong');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this._DanhMucKhachService.Delete(_item.IDKhachHang).subscribe(res => {
        if (res && res.status === 1) {
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
        }
        else {
          this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
        }
        this.LoadData();
      });
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
    this._DanhMucKhachService.findData(queryParams).subscribe(
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

  filter(): any {
    const filterNew: any = {

    };
    return filterNew;
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
    this._DanhMucKhachService.findData(queryParams).subscribe((res) => {
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

  HoanThanh() {
    this._DanhMucKhachService.UpdateInitStatusApp().subscribe(res => {
      if (res && res.statusCode === 1) {
        let obj = this.listApp.find(x => x.AppID == 38);
        if (obj) {
          window.location.href = obj.BackendURL;
        } else {
          this.router.navigate([`Config-System/3`]);
        }
      }
    })
  }
}