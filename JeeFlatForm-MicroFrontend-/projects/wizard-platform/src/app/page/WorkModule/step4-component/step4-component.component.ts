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
import { QueryParamsModel } from '../../models/query-models/query-params.model';
import { MatTableDataSource } from '@angular/material/table';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { ProjectTeamModel } from '../model/danh-muc-du-an.model';
import { MatDialog } from '@angular/material/dialog';
import { ProjectTeamEditComponent } from '../project-team-edit/project-team-edit.component';
import { TranslateService } from '@ngx-translate/core';
import { DepartmentModel } from '../view-config-status/view-config-status.component';
@Component({
  selector: 'app-step4-component',
  templateUrl: './step4-component.component.html',
  styleUrls: ['./step4-component.component.scss'],
})
export class Step4ComponentComponent implements OnInit {
  constructor(
    public _WorkwizardChungService:WorkwizardChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog,
    private translate: TranslateService,
  ) {
  }
  Data:any;
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
    'TenDuAn',
    'TenPhongBan',
    'ThanhVien',
    'actions',
  ];
  isLoad:boolean=false;
  ngOnInit(): void {
    this._WorkwizardChungService.GetWizard(4).subscribe(res=>{
      if(res && res.status==1){
        this.isLoad=true;
        this.Data=res.data;
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
    this._WorkwizardChungService.findDataProjectMiniAPP(queryParams).subscribe(
      (res) => {
        this.layoutUtilsService.OffWaitingDiv();
        if (res && res.status == 1) {
          this.AllPage = res.panigator.AllPage;
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
  getHeight(): any {
    let tmp_height = 597 - 310;
    return tmp_height + "px";
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
    this._WorkwizardChungService.findDataProjectMiniAPP(queryParams).subscribe((res) => {
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
  Add(is_project: boolean){
		const _project = new ProjectTeamModel();
		_project.clear(); // Set all defaults fields
		_project.is_project = is_project;
		this.UpdateProject(_project);
	}
	UpdateProject(_item: ProjectTeamModel) {
		const dialogRef = this.dialog.open(ProjectTeamEditComponent, { data: { _item, _IsEdit: _item.IsEdit, is_project: _item.is_project },
    width:'700px',
    height:'auto',
    panelClass:['sky-padding-0'] });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			else {
				this.LoadData();
			}
		});
	}
  Edit(_item: ProjectTeamModel) {
    // this.layoutUtilsService.showActionNotification("Updating");
    //_item = this.item;
    let saveMessageTranslateParam = "";

    saveMessageTranslateParam +=
      _item.id_row > 0
        ? "JeeWork.capnhatthanhcong"
        : "JeeWork.themthanhcong";
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType =
      _item.id_row > 0 ? MessageType.Update : MessageType.Create;
    const dialogRef = this.dialog.open(ProjectTeamEditComponent, {
      data: { _item, _IsEdit: _item.IsEdit, is_project: false },
      width:'700px',
      height:'auto',
      panelClass:['sky-padding-0'],
    });
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      } else {
        this.LoadData();
        this.changeDetectorRefs.detectChanges();
      }
    });
  }
  Deleted(item) {
    const ObjectModels = new DepartmentModel();
    ObjectModels.clear();
    this.Delete(ObjectModels, item.id_row);
  }

  Delete(_item: DepartmentModel, ID_Project) {
    _item.RowID = ID_Project;
    const _title = this.translate.instant('JeeWork.xoa');
    const _description = 'Bạn có chắc muốn xoá ' + this._WorkwizardChungService.ts_duan + ' này? Các ' + this._WorkwizardChungService.ts_congviec + '/nhóm ' + this._WorkwizardChungService.ts_congviec + ' liên quan cũng sẽ bị xoá và KHÔNG THỂ khôi phục.';
    const _waitDesciption = this.translate.instant(
      'JeeWork.dulieudangduocxoa'
    );
    const _deleteMessage = this.translate.instant('JeeWork.xoathanhcong');
    const dialogRef = this.layoutUtilsService.deleteElement(
      _title,
      _description,
      _waitDesciption
    );
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        this.ngOnInit();
        return;
      }

      this._WorkwizardChungService.DeleteProject(_item.RowID).subscribe((res) => {
        if (res && res.status === 1) {
          this.LoadData();
          this.layoutUtilsService.showActionNotification(
            _deleteMessage,
            MessageType.Delete,
            4000,
            true,
            false,
            3000,
            'top',
            1
          );
        } else {
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Read,
            9999999999,
            true,
            false,
            3000,
            'top',
            0
          );
        }
      });

    });
  }
}