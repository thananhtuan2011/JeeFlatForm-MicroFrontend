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

import { DanhMucPhongBanService } from '../Services/danh-muc-phong-ban.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { OrgStructureModel } from '../Model/danh-muc-phong-ban.model';
import { DanhMucPhongBanEditDialogComponent } from '../danh-muc-phong-ban-edit-dialog/danh-muc-phong-ban-edit-dialog.component';
import { DanhMucChungService } from '../../hr.service';


@Component({
  selector: 'app-danh-muc-phong-ban-list',
  templateUrl: './danh-muc-phong-ban-list.component.html',
  styleUrls: ["./danh-muc-phong-ban-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DanhMucPhongBanListComponent implements OnInit {
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
  //============================================================
  textPhongBan: string = ""
  constructor(
    public _DanhMucPhongBanService: DanhMucPhongBanService,
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

    this._DanhMucChungService.getStrConfig(1,"hr_phongban").subscribe(res => {
			if (res && res.status == 1 && res.data.length > 0) {
				this._DanhMucChungService.textHR2 = res.data[0] ? res.data[0].Mota : "";
			}
			this.changeDetectorRefs.detectChanges();
		})
  }

  getHeight(): any {
    // let tmp_height = window.innerHeight - document.getElementById("height1").clientHeight - document.getElementById("height2").clientHeight - 190;
    let tmp_height = 600 - (190 + 65);
    return tmp_height + "px";
  }

  TroLai() {
    this.router.navigate([`/WizardHR/Introduce`]);
  }

  TiepTuc() {
    this.router.navigate([`/WizardHR/JobTitle`]);
  }

  Add() {
    const chucvuModels = new OrgStructureModel();
    chucvuModels.clear(); // Set all defaults fields
    this.Edit(chucvuModels);
  }

  Edit(_item: OrgStructureModel) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += _item.RowID > 0 ? 'JeeHR.capnhatthanhcong' : 'JeeHR.themthanhcong';
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = _item.RowID > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(DanhMucPhongBanEditDialogComponent, { data: { _item }, panelClass: ['hr-padding-0', 'width600'] });
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

  Delete(_item: OrgStructureModel) {
    const _title = this.translate.instant('JeeHR.xoa');
    const _description = this.translate.instant('JeeHR.bancochacchanmuonxoakhong');
    const _waitDesciption = this.translate.instant('JeeHR.dulieudangduocxoa');
    const _deleteMessage = this.translate.instant('JeeHR.xoathanhcong');

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }

      this._DanhMucPhongBanService.deleteItem(_item.RowID, _item.Title).subscribe(res => {
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
    this._DanhMucPhongBanService.getListPhongBan().subscribe(
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
    if(this.textPhongBan != null && this.textPhongBan != ""){
      const capcocau = this.prepareCustomer();
      this.Create(capcocau);
    }
  }

  prepareCustomer(): OrgStructureModel {
		const _item = new OrgStructureModel();
		_item.RowID = 0;
		_item.ParentID = "0";
    _item.Code = "";
		_item.Title = this.textPhongBan;
		_item.Position = "1";
		return _item;
	}
  
  Create(_item: OrgStructureModel) {
		this._DanhMucPhongBanService.Create(_item).subscribe(res => {
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.textPhongBan = "";
        this.changeDetectorRefs.detectChanges();
        this.LoadData();
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
}