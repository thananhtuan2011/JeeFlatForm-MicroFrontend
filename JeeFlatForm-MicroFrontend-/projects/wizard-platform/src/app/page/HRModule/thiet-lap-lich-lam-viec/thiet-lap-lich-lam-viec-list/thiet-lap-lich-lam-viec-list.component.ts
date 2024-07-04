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

import { ThietLapLichLamViecService } from '../Services/thiet-lap-lich-lam-viec.service';
import { MatDialog } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { StaffTypeModel } from '../Model/thiet-lap-lich-lam-viec.model';
import { DanhMucChungService } from '../../hr.service';


@Component({
  selector: 'app-thiet-lap-lich-lam-viec-list',
  templateUrl: './thiet-lap-lich-lam-viec-list.component.html',
  styleUrls: ["./thiet-lap-lich-lam-viec-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThietLapLichLamViecListComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'STT',
    'Title',
    'MoTa',
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
    public _ThietLapLichLamViecService: ThietLapLichLamViecService,
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

    this._DanhMucChungService.getStrConfig(1,"hr_lichlamviec").subscribe(res => {
			if (res && res.status == 1 && res.data.length > 0) {
				this._DanhMucChungService.textHR6 = res.data[0] ? res.data[0].Mota : "";
			}
			this.changeDetectorRefs.detectChanges();
		})
  }

  getHeight(): any {
    let tmp_height = 600 - 273;
    return tmp_height + "px";
  }

  TroLai() {
    this.router.navigate([`/WizardHR/Staff`]);
  }

  TiepTuc() {
    let obj = this.dataSource.data.find(x=>x.isCheck);
    if(obj){
      this.Update(obj);
    }
  }

  //==================================================================
  LoadData() {
    this._ThietLapLichLamViecService.getAllItems().subscribe(
      (res) => {
        if (res && res.status == 1) {
          let _data = [];
          res.data.map((res, index) => {
            if (index == 0) {
              res.isCheck = true;
            } else {
              res.isCheck = false;
            }
            _data.push(res);
          })
          this.dataSource.data = _data;
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

  Update(_item: any) {
    this._ThietLapLichLamViecService.Update(_item.id).subscribe(res => {
      if (res && res.status === 1) {
        this.router.navigate([`/WizardHR/Timekeeping`]);
        this.changeDetectorRefs.detectChanges();
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
      }
    });
  }

  //===============================================
  change(item) {
    this.dataSource.data.forEach(res=>{
      if(res.id == item.id){
        res.isCheck = true;
      }else{
        res.isCheck = false;
      }
    })
    this.changeDetectorRefs.detectChanges();
  }
}