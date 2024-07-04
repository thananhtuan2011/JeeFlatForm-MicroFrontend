import { catchError, finalize, share, tap } from 'rxjs/operators';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Optional,
  SimpleChanges,
} from '@angular/core';
import { WorkwizardChungService } from '../work.service';
import { MatTableDataSource } from '@angular/material/table';
import { QueryParamsModel } from '../../models/query-models/query-params.model';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { DepartmentModel } from '../view-config-status/view-config-status.component';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { DepartmentEditV2Component } from '../department-edit-v2/department-edit-v2.component';
import { DepartmentModelV2 } from '../model/danh-muc-du-an.model';
@Component({
  selector: 'app-step3-component',
  templateUrl: './step3-component.component.html',
  styleUrls: ['./step3-component.component.scss'],
})
export class Step3ComponentComponent implements OnInit {
  constructor(
    public _WorkwizardChungService: WorkwizardChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    public dialog: MatDialog,
  ) {
  }
  Data: any;
  dataSource = new MatTableDataSource<any>([]);
  sortOrder: string;
  sortField: string;
  page: number;
  record: number;
  more: boolean;
  AllPage: any;
  flag: boolean;
  displayedColumns: string[] = [
    'STT',
    'TenPhongBan',
    'ThanhVien',
    'actions',
  ];
  isLoad: boolean = false;
  ngOnInit(): void {
    this._WorkwizardChungService.GetWizard(3).subscribe(res => {
      if (res && res.status == 1) {
        this.isLoad = true;
        this.Data = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
    this.sortOrder = 'asc';
    this.sortField = '';
    this.page = 0;
    this.record = 50;
    this.more = false;
    this.flag = true;
    this.LoadData();

  }
  Edit(item) {

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
  getHeight(): any {
    let tmp_height = 597 - 300;
    return tmp_height + "px";
  }
  filter(): any {
    const filterNew: any = {

    };
    return filterNew;
  }
  LoadData() {
    let queryParams;
    //Start - Load lại cho thanh scroll lên đầu - 19/01/2024
    // document.getElementById("listScroll").scrollTop = 0;
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
    this._WorkwizardChungService.findDataDept(queryParams).subscribe(
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
    this._WorkwizardChungService.findDataDept(queryParams).subscribe((res) => {
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
  // Add() {
  //   const ObjectModels = new DepartmentModel();
  //   ObjectModels.clear(); // Set all defaults fields
  //   this.Update(ObjectModels);
  // }
  Add(ID_Department = 0) {
		const ObjectModels = new DepartmentModelV2();
		ObjectModels.clear(); // Set all defaults fields
		if (ID_Department > 0) {
			ObjectModels.RowID = ID_Department;
			this.Update(ObjectModels);
		} else {
			this.Create(ObjectModels);
		}
	}
  Create(_item: DepartmentModelV2) {
		let saveMessageTranslateParam = '';
		saveMessageTranslateParam += _item.RowID > 0 ? 'JeeWork.capnhatthanhcong' : 'JeeWork.themthanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = _item.RowID > 0 ? MessageType.Update : MessageType.Create;

		const dialogRef = this.dialog.open(DepartmentEditV2Component, { data: { _item, _IsEdit: _item.IsEdit },
      minWidth: '650px',
      maxWidth:'50vw',
      panelClass:['sky-padding-0'], 
      disableClose: true });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			else {
				this.LoadData();
				this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
				this.changeDetectorRefs.detectChanges();
			}
		});
	}
  Update(_item: DepartmentModelV2) {
		let saveMessageTranslateParam = '';
		saveMessageTranslateParam += _item.RowID > 0 ? 'JeeWork.capnhatthanhcong' : 'JeeWork.themthanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = _item.RowID > 0 ? MessageType.Update : MessageType.Create;
		const IsUpdate = _item.RowID > 0 ? true : false;
		const dialogRef = this.dialog.open(DepartmentEditV2Component, {
			// minHeight: '50vh',
			data: { _item, _IsEdit: _item.IsEdit, IsUpdate },
			minWidth: '650px',
      maxWidth:'50vw',
      panelClass:['sky-padding-0'], 
			disableClose: true
		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			else {
				this.LoadData();
				this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
				this.changeDetectorRefs.detectChanges();
			}
		});
	}
  Delete(ID_Department) {

    var ObjectModels = new DepartmentModel();
    ObjectModels.clear();
    const _title = this.translate.instant('JeeWork.xoa');
    const _description = this.translate.instant('department.confirmxoa');
    const _waitDesciption = this.translate.instant('JeeWork.dulieudangduocxoa');
    const _deleteMessage = this.translate.instant('JeeWork.xoathanhcong');
    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this._WorkwizardChungService.Delete_Dept(ID_Department).subscribe(res => {
        if (res && res.status === 1) {
          this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
          this.LoadData();
        }
        else {
          this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
        }
      });
    });
  }
}