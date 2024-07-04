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

import { DanhMucLoaiNhanVienService } from '../Services/danh-muc-loai-nhan-vien.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { DanhMucLoaiNhanVienEditDialogComponent } from '../danh-muc-loai-nhan-vien-edit-dialog/danh-muc-loai-nhan-vien-edit-dialog.component';
import { StaffTypeModel } from '../Model/danh-muc-loai-nhan-vien.model';
import { DanhMucChungService } from '../../hr.service';


@Component({
  selector: 'app-danh-muc-loai-nhan-vien-list',
  templateUrl: './danh-muc-loai-nhan-vien-list.component.html',
  styleUrls: ["./danh-muc-loai-nhan-vien-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhMucLoaiNhanVienListComponent implements OnInit {
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
  textPhanLoai: string = ""
  constructor(
    public _DanhMucLoaiNhanVienService: DanhMucLoaiNhanVienService,
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private changeDetectorRefs: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private router: Router,
    public _DanhMucChungService : DanhMucChungService,
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

    this._DanhMucChungService.getStrConfig(1,"hr_loainhanvien").subscribe(res => {
			if (res && res.status == 1 && res.data.length > 0) {
				this._DanhMucChungService.textHR4 = res.data[0] ? res.data[0].Mota : "";
			}
			this.changeDetectorRefs.detectChanges();
		})
  }

  getHeight(): any {
    let tmp_height = 600 - 302 ;
    return tmp_height + "px";
  }

  TroLai() {
    this.router.navigate([`/WizardHR/JobTitle`]);
  }

  TiepTuc() {
    this.router.navigate([`/WizardHR/ContractType`]);
  }

  Add() {
    const chucvuModels = new StaffTypeModel();
    chucvuModels.clear(); // Set all defaults fields
    this.Edit(chucvuModels);
  }

  Edit(_item: StaffTypeModel) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += _item.Id_row > 0 ? 'JeeHR.capnhatthanhcong' : 'JeeHR.themthanhcong';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = _item.Id_row > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(DanhMucLoaiNhanVienEditDialogComponent, { data: { _item }, panelClass: ['hr-padding-0', 'width600'] });
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

  Delete(_item: StaffTypeModel) {
    const _title = this.translate.instant('JeeHR.xoa');
    const _description = this.translate.instant('JeeHR.bancochacchanmuonxoakhong');
    const _waitDesciption = this.translate.instant('JeeHR.dulieudangduocxoa');
    const _deleteMessage = this.translate.instant('JeeHR.xoathanhcong');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this._DanhMucLoaiNhanVienService.deleteItem(_item.Id_row).subscribe(res => {
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
    this._DanhMucLoaiNhanVienService.getAllItems().subscribe(
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
    if(this.textPhanLoai != null && this.textPhanLoai != ""){
      const capcocau = this.prepareCustomer();
      this.Create(capcocau);
    }
  }

  prepareCustomer(): StaffTypeModel {
		const _item = new StaffTypeModel();
		_item.Id_row = 0;
    _item.Code = "";
		_item.Tenloai = this.textPhanLoai;
		_item.IsBHXH = false;
		_item.IsAnnualLeave = false;
		return _item;
	}
  
  Create(_item: StaffTypeModel) {
		this._DanhMucLoaiNhanVienService.Create(_item).subscribe(res => {
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.textPhanLoai = "";
        this.LoadData();
        this.changeDetectorRefs.detectChanges();
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
}