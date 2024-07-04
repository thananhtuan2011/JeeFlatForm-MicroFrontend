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

import { DanhMucChucVuService } from '../Services/danh-muc-chuc-vu.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { ChucVuModel } from '../Model/danh-muc-chuc-vu.model';
import { DanhMucChucVuEditDialogComponent } from '../danh-muc-chuc-vu-edit-dialog/danh-muc-chuc-vu-edit-dialog.component';
import { DanhMucChungService } from '../../hr.service';


@Component({
  selector: 'app-danh-muc-chuc-vu-list',
  templateUrl: './danh-muc-chuc-vu-list.component.html',
  styleUrls: ["./danh-muc-chuc-vu-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhMucChucVuListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'STT',
    'Title',
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
    public _DanhMucChucVuService: DanhMucChucVuService,
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
    this._DanhMucChungService.getStrConfig(1,"hr_chucvu").subscribe(res => {
			if (res && res.status == 1 && res.data.length > 0) {
				this._DanhMucChungService.textHR3 = res.data[0] ? res.data[0].Mota : "";
			}
			this.changeDetectorRefs.detectChanges();
		})
  }

  getHeight(): any {
    let tmp_height = 600 - 239;
    return tmp_height + "px";
  }

  TroLai() {
    this.router.navigate([`/WizardHR/Department`]);
  }

  TiepTuc() {
    this.router.navigate([`/WizardHR/StaffType`]);
  }

  Add() {
    const chucvuModels = new ChucVuModel();
    chucvuModels.clear(); // Set all defaults fields
    this.Edit(chucvuModels);
  }

  Edit(_item: ChucVuModel) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += _item.Id_row > 0 ? 'JeeHR.capnhatthanhcong' : 'JeeHR.themthanhcong';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = _item.Id_row > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(DanhMucChucVuEditDialogComponent, { data: { _item }, panelClass: ['hr-padding-0', 'width600'] });
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

  Delete(_item: ChucVuModel) {
    const _title = this.translate.instant('JeeHR.xoa');
    const _description = this.translate.instant('JeeHR.bancochacchanmuonxoakhong');
    const _waitDesciption = this.translate.instant('JeeHR.dulieudangduocxoa');
    const _deleteMessage = this.translate.instant('JeeHR.xoathanhcong');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this._DanhMucChucVuService.deleteItem(_item.Id_row).subscribe(res => {
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
    this._DanhMucChucVuService.findData(queryParams).subscribe(
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
    this._DanhMucChucVuService.findData(queryParams).subscribe((res) => {
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