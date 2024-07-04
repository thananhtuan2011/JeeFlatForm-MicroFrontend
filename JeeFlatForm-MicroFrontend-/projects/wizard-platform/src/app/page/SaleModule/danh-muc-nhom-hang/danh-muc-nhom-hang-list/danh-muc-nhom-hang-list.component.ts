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

import { DanhMucNhomHangService } from '../Services/danh-muc-nhom-hang.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { DM_LoaiMatHangModel } from '../Model/danh-muc-nhom-hang.model';
import { DanhMucNhomHangEditDialogComponent } from '../danh-muc-nhom-hang-edit-dialog/danh-muc-nhom-hang-edit-dialog.component';


@Component({
  selector: 'app-danh-muc-nhom-hang-list',
  templateUrl: './danh-muc-nhom-hang-list.component.html',
  styleUrls: ["./danh-muc-nhom-hang-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhMucNhomHangListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'STT',
    'TenLoaiMatHang', 'TenLoaiMatHangCha', 'GhiChu', 'actions'
  ];
  sortOrder: string;
  sortField: string;
  page: number;
  record: number;
  more: boolean;
  AllPage: any;
  flag: boolean;
  isLoai: string = "2"; //1: phân loại, 2: danh mục

  constructor(
    public _DanhMucNhomHangService: DanhMucNhomHangService,
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
    this.router.navigate([`/WizardSale/Supplier`]);
  }

  TiepTuc() {
    this.router.navigate([`/WizardSale/Unit`]);
  }

  Add() {
    const chucvuModels = new DM_LoaiMatHangModel();
    chucvuModels.clear(); // Set all defaults fields
    this.Edit(chucvuModels);
  }

  Edit(_item: DM_LoaiMatHangModel) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += _item.IDLoaiMatHang > 0 ? 'JeeHR.capnhatthanhcong' : 'JeeHR.themthanhcong';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = _item.IDLoaiMatHang > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(DanhMucNhomHangEditDialogComponent, { data: { _item, isLoai: this.isLoai }, panelClass: ['hr-padding-0', 'width600'] });
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

  Delete(_item: DM_LoaiMatHangModel) {
    const _title = this.translate.instant('JeeHR.xoa');
    const _description = this.translate.instant('JeeHR.bancochacchanmuonxoakhong');
    const _waitDesciption = this.translate.instant('JeeHR.dulieudangduocxoa');
    const _deleteMessage = this.translate.instant('JeeHR.xoathanhcong');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this._DanhMucNhomHangService.Delete(_item.IDLoaiMatHang).subscribe(res => {
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

  ten = this.translate.instant("Tên danh mục hàng")
	cha = this.translate.instant("Tên loại mặt hàng");
	changeLoai() {
		if (this.isLoai == "1") {
			this.ten = this.translate.instant("Tên loại mặt hàng") 
			this.cha = this.translate.instant("Tên loại mặt hàng cha");
		}
		else {
			this.ten = this.translate.instant("Tên danh mục hàng")
			this.cha = this.translate.instant("Tên danh mục cha");
		}
		this.LoadData();
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
    this._DanhMucNhomHangService.findData(queryParams).subscribe(
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
      loai: +this.isLoai
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
    this._DanhMucNhomHangService.findData(queryParams).subscribe((res) => {
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