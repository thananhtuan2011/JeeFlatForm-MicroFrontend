import { catchError, finalize, share, tap } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Optional,
  SimpleChanges,
} from '@angular/core';
import moment from 'moment';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';

import { formatDate } from '@angular/common';

import {
  MatDialog
} from '@angular/material/dialog';
import { BehaviorSubject, of } from 'rxjs';
import { TicKetService } from '../ticket.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../models/query-models/query-params.model';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { ListStatusModel } from '../component/Model/list-status-list-managament.model';
import { TranslateService } from '@ngx-translate/core';
import { StatusManagementEditDialogComponent } from '../component/list-status-edit-dialog/list-status-edit-dialog.component';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss'],
})
export class Step4Component implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'STT',
    'Title',
    'Description',
    'nguoinhap',
    'ngaynhap',
    'thaotac',
  ];
  wizard: any;
  Visible: boolean = false;
  constructor(
    private router: Router,
    private TicKetService: TicKetService,
    private ChangeDetectorRef: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private translateService: TranslateService,
    public dialog: MatDialog,
  ) {

  }
  isloadding = false;
  data: any;
  sortOrder: string;
  sortField: string;
  flag: boolean;
  page: number;
  record: number;
  more: boolean;
  AllPage: number = 0;
  ngOnInit(): void {
    this.sortOrder = 'asc';
    this.sortField = '';
    this.page = 0;
    this.record = 15;
    this.more = false;
    this.flag = true;
    this.getwizard();
    this.loadData();
  }
  getwizard() {
    this.TicKetService.getWizard(4).subscribe(res => {
      if (res && res.status == 1) {
        this.wizard = res.data;
        this.isloadding = true;
        this.ChangeDetectorRef.detectChanges();
      }
    })
  }
  loadData() {
    let queryParams;
    queryParams = new QueryParamsModel(
      this.filter(),
      this.sortOrder,
      this.sortField,
      this.page,
      this.record,
      
      true
    );
    this.TicKetService.GetListStatus(queryParams).subscribe(res => {
      if (res && res.status == 1) {
        this.Visible = res.Visible;
        this.dataSource.data = res.data;
        this.AllPage = res.panigator.AllPage;
        this.ChangeDetectorRef.detectChanges();
      }
    })
  }
  getHeight(): any {
    let tmp_height = 597 - 290;
    return tmp_height + "px";
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
    queryParams = new QueryParamsModel(
      this.filter(),
      this.sortOrder,
      this.sortField,
      this.page,
      this.record, 
      true
    );

    this.TicKetService.GetListStatus(queryParams).subscribe(res => {
      if (res && res.status == 1) {
        this.dataSource.data = res.data;
        this.Visible = res.Visible;
        this.flag = true;
        this.ChangeDetectorRef.detectChanges();
      }
    })
  }


  create() {
    const item = new ListStatusModel();
    item.clear(); // Set all defaults fields
    this.update(item);
  }

  update(item) {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam += item.RowID > 0 ? 'Cập nhật thành công' : 'Thêm thành công';
    const saveMessage = this.translateService.instant(saveMessageTranslateParam);
    const messageType = item.RowID > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(StatusManagementEditDialogComponent, {
       data: { item }, 
       width:'600px'
      });
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.layoutUtilsService.showActionNotification(saveMessage, messageType, 4000, true, false);
        this.loadData();
      } 
    });
  }
  delete(RowID) {
    const _title = 'Xóa trạng thái';
    const _description = 'Bạn có chắc muốn xóa trạng thái này không?';
    const _waitDesciption = "Dữ liệu đang được xử lý";

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.TicKetService.DeleteStatus(RowID).subscribe((res) => {
        if (res && res.statusCode === 1) {
          this.loadData();
        }
        else {
          this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
        }
      }
      );
    });

  }
}
