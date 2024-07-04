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

import { CauHinhChamCongService } from '../Services/cau-hinh-cham-cong.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { DanhMucChungService } from '../../hr.service';


@Component({
  selector: 'app-cau-hinh-cham-cong-hanet-list',
  templateUrl: './cau-hinh-cham-cong-hanet-list.component.html',
  styleUrls: ["./cau-hinh-cham-cong-hanet-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CauHinhChamCongHanetListComponent implements OnInit {
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
    public _CauHinhChamCongService: CauHinhChamCongService,
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

    this._DanhMucChungService.getStrConfig(1,"hr_hanet").subscribe(res => {
			if (res && res.status == 1 && res.data.length > 0) {
				//Giới thiệu
				this._DanhMucChungService.textHR8_4 = res.data[0] ? res.data[0].Mota : "";
			}
			this.changeDetectorRefs.detectChanges();
		})
  }

  TroLai() {
    this.router.navigate([`/WizardHR/Timekeeping`]);
  }

  TiepTuc() {
    this.router.navigate([`/WizardHR/Complete`]);
  }



  getHeight(): any {
    let tmp_height = 600 - 133;
    return tmp_height + "px";
  }
  //==================================================================
  LoadData() {
    this._CauHinhChamCongService.getAllItems().subscribe(
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
}