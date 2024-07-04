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

import { DanhMucLoaiHopDongService } from '../Services/danh-muc-loai-hop-dong.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { ContractTypeModel } from '../Model/danh-muc-loai-hop-dong.model';
import { DanhMucLoaiHopDongEditDialogComponent } from '../danh-muc-loai-hop-dong-edit-dialog/danh-muc-loai-hop-dong-edit-dialog.component';
import { DanhMucChungService } from '../../hr.service';


@Component({
  selector: 'app-danh-muc-loai-hop-dong-list',
  templateUrl: './danh-muc-loai-hop-dong-list.component.html',
  styleUrls: ["./danh-muc-loai-hop-dong-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhMucLoaiHopDongListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'STT',
    'Title',
    'LaHopDongThuViec',
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
    public _DanhMucLoaiHopDongService: DanhMucLoaiHopDongService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private changeDetectorRefs: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private router: Router,
    public _DanhMucChungService : DanhMucChungService,
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
    this._DanhMucLoaiHopDongService.GetListStaffType().subscribe(res => {
      this.listtypestaff = res.data;
    });

    this._DanhMucChungService.getStrConfig(1,"hr_loaihopdong").subscribe(res => {
			if (res && res.status == 1 && res.data.length > 0) {
				this._DanhMucChungService.textHR5 = res.data[0] ? res.data[0].Mota : "";
			}
			this.changeDetectorRefs.detectChanges();
		})
  }

  getHeight(): any {
    let tmp_height = 600 - 325;
    return tmp_height + "px";
  }

  TroLai() {
    this.router.navigate([`/WizardHR/StaffType`]);
  }

  TiepTuc() {
    this.router.navigate([`/WizardHR/Staff`]);
  }

  Add() {
    const chucvuModels = new ContractTypeModel();
    chucvuModels.clear(); // Set all defaults fields
    this.Edit(chucvuModels);
  }

  Edit(_item: ContractTypeModel) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += _item.Id_Row > 0 ? 'JeeHR.capnhatthanhcong' : 'JeeHR.themthanhcong';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = _item.Id_Row > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(DanhMucLoaiHopDongEditDialogComponent, { data: { _item }, panelClass: ['hr-padding-0', 'width600'] });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      else {
        this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
        this.LoadData();
      }
    });
  }

  Delete(_item: ContractTypeModel) {
    const _title = this.translate.instant('JeeHR.xoa');
    const _description = this.translate.instant('JeeHR.bancochacchanmuonxoakhong');
    const _waitDesciption = this.translate.instant('JeeHR.dulieudangduocxoa');
    const _deleteMessage = this.translate.instant('JeeHR.xoathanhcong');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this._DanhMucLoaiHopDongService.deleteItem(_item.Id_Row, _item.TenLoai).subscribe(res => {
        if (res && res.status === 1) {
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
        }
        else {
          this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
        }
        this.LoadData();
      });
    });
  }
  //==================================================================
  LoadData() {
    this._DanhMucLoaiHopDongService.getAllItems().subscribe(
      (res) => {
        if (res && res.status == 1) {
          this.dataSource.data = res.data;
        } else {
          this.dataSource.data = [];
        }
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
        // this.LoadDataLazy();
      }
    }
  }

  filter(): any {
    const filterNew: any = {};
    return filterNew;
  }
  //===============================================================
  SavePhongBan() {
    if (this.textLoaiHopDong != null && this.textLoaiHopDong != "") {
      const capcocau = this.prepareCustomer();
      this.Create(capcocau);
    }
  }

  prepareCustomer(): ContractTypeModel {
    const _item = new ContractTypeModel();
    _item.Id_Row = 0;
    _item.TenLoai = this.textLoaiHopDong; // lấy tên biến trong formControlName	
    _item.MaLoai = "";
    _item.LaHopDongThuViec = false;
    _item.BatDauDongBH = false;
    _item.KhongXacDinhThoiHan = true;
    _item.ID_FileIn = 0;
    let obj = this.listtypestaff.find(x => x.IsDefault);
    if (obj) {
      _item.ID_LoaiNhanVien = obj.RowID;
    } else {
      _item.ID_LoaiNhanVien = 0;
    }
    _item.NhacNhoHetHanHD = "";
    _item.ThoiHanBaoTruoc = "";

    _item.DVThoiHanHD = 0;
    _item.ThoiHanHD = 0;
    return _item;
  }

  Create(_item: ContractTypeModel) {
    this._DanhMucLoaiHopDongService.Create(_item).subscribe(res => {
      this.changeDetectorRefs.detectChanges();
      if (res && res.status === 1) {
        this.textLoaiHopDong = "";
        this.LoadData();
        this.changeDetectorRefs.detectChanges();
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
      }
    });
  }
}