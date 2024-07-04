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

import { DanhMucNCCService } from '../Services/danh-muc-ncc.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { DM_NCCModel } from '../Model/danh-muc-ncc.model';
import { DanhMucNCCEditDialogComponent } from '../danh-muc-ncc-edit-dialog/danh-muc-ncc-edit-dialog.component';


@Component({
  selector: 'app-danh-muc-ncc-list',
  templateUrl: './danh-muc-ncc-list.component.html',
  styleUrls: ["./danh-muc-ncc-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhMucNCCListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'STT',
    'MaNhaCungCap', 'TenNhaCungCap', 'DiaChi', 'DienThoai', 'Email', 'GhiChu',
    'actions',
  ];
  sortOrder: string;
  sortField: string;
  page: number;
  record: number;
  more: boolean;
  AllPage: any;
  flag: boolean;
  constructor(
    public _DanhMucNCCService: DanhMucNCCService,
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
    let tmp_height = 600 - 169;
    return tmp_height + "px";
  }

  TroLai() {
    this.router.navigate([`/WizardSale/Depot`]);
  }

  TiepTuc() {
    this.router.navigate([`/WizardSale/GroupItems`]);
  }

  Add() {
    const chucvuModels = new DM_NCCModel();
    chucvuModels.clear(); // Set all defaults fields
    this.Edit(chucvuModels);
  }

  Edit(_item: DM_NCCModel) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += _item.IDNhaCungCap > 0 ? 'JeeHR.capnhatthanhcong' : 'JeeHR.themthanhcong';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = _item.IDNhaCungCap > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(DanhMucNCCEditDialogComponent, { data: { _item }, panelClass: ['hr-padding-0', 'width600'] });
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

  Delete(_item: DM_NCCModel) {
    const _title = this.translate.instant('JeeHR.xoa');
    const _description = this.translate.instant('JeeHR.bancochacchanmuonxoakhong');
    const _waitDesciption = this.translate.instant('JeeHR.dulieudangduocxoa');
    const _deleteMessage = this.translate.instant('JeeHR.xoathanhcong');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this._DanhMucNCCService.Delete(_item.IDNhaCungCap).subscribe(res => {
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
    this._DanhMucNCCService.findData(queryParams).subscribe(
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
    this._DanhMucNCCService.findData(queryParams).subscribe((res) => {
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
}