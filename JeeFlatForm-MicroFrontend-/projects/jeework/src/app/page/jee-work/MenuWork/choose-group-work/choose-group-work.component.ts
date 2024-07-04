import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PaginatorState } from '../bao-cao/Model/paginator.model';
import { SortState } from '../bao-cao/Model/sort.model';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { QueryParamsModelNew } from '../../models/query-models/query-params.model';
import { WorkService } from '../bao-cao/services/jee-work.service';
import { DanhMucChungService } from '../../services/danhmuc.service';


@Component({
  selector: 'app-choose-group-work',
  templateUrl: './choose-group-work.component.html',
  styleUrls: ['./choose-group-work.component.scss']
})
export class ChooseGroupWorkComponent implements OnInit {

  ID_Project: 0;
  sorting: SortState = new SortState();
  paginatorNew: PaginatorState = new PaginatorState();
  list_Group: any[] = [];
  list_GroupFull: any[] = [];
  @Input() id_project_team: number = 0;
  @Output() IsSearch = new EventEmitter<any>();
  constructor(private _service: WorkService,
    private changeDetectorRefs: ChangeDetectorRef,
    public _LayoutUtilsService: LayoutUtilsService,
    public _DanhMucChungService: DanhMucChungService,) { }
  public userFilterCtrl: FormControl = new FormControl();

  ngOnInit(): void {
    this._DanhMucChungService.getthamso();
    this.loadWorkGroup();
    this.userFilterCtrl.valueChanges.pipe().subscribe(() => {
      this.filterUsers();
    });
    this._DanhMucChungService.send$.subscribe((res: any) => {
      if (res == "LoadTaskGroup") {
        this.loadWorkGroup();
        this._DanhMucChungService.send$.next('');
      }
    });
  }
  loadWorkGroup() {
    const queryParams = new QueryParamsModelNew(
      this.filterConfiguration(),
      this.sorting.direction,
      this.sorting.column,
      this.paginatorNew.page - 1,
      this.paginatorNew.pageSize
    );
    this._service.ListWorkGroupV2(queryParams).subscribe(res => {
      if (res && res.status == 1) {
        this.list_Group = res.data;
        this.list_GroupFull = res.data;
        const ele1 = document.getElementById('searchfield') as HTMLInputElement;
        if (ele1 && ele1.value) {
          this.keyup(ele1.value);
        }
        this.changeDetectorRefs.detectChanges();
      }
    })
  }
  createTaskGroup(event) {
    let title = event.target.value;
    if (title.trim().length > 0) {
      const _item = new WorkGroupModel();
      _item.title = title;
      _item.id_project_team = '' + this.id_project_team;
      this._service.UpdateWorkGroupV2(_item).subscribe(res => {
        this.changeDetectorRefs.detectChanges();
        if (res && res.status === 1) {
          this._DanhMucChungService.send$.next("LoadGroup");
          this.loadWorkGroup();
          this.changeDetectorRefs.detectChanges();
        }
        else {
          this._LayoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
        }
      });
    }
  }
  keyup(event) {
    event = event.toLowerCase();
    this.list_Group = this.list_GroupFull.filter(
      (bank) => bank.title.toLowerCase().indexOf(event) > -1
    );
  }
  filterConfiguration(): any {
    const filter: any = {};
    filter.id_project_team = this.id_project_team;
    return filter;
  }
  UpdateTitle(event, id_row) {
    let title = event.target.value;
    if (title.trim().length > 0) {
      const _item = new WorkGroupModel();
      _item.id_row = id_row;
      _item.title = title;
      _item.id_project_team = '' + this.id_project_team;
      this._service.UpdateWorkGroupV2(_item).subscribe(res => {
        this.changeDetectorRefs.detectChanges();
        if (res && res.status === 1) {
          this._DanhMucChungService.send$.next("LoadGroup");
          this.loadWorkGroup();
          this.changeDetectorRefs.detectChanges();
        }
        else {
          this._LayoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
        }
      });
    }
  }
  DeleteGroup(item) {
    if (item.Count.tong > 0 || item.Count.tong > 0) {
      this._LayoutUtilsService.showError('Nhóm công có ' + this._DanhMucChungService.ts_congviec + ' đang thực hiện không thể xóa.');
    }
    else {
      this._service.CloseWorkGroupV2(item.id_row, 0).subscribe(res => {
        if (res && res.status === 1) {
          this._DanhMucChungService.send$.next("LoadGroup");
          this.loadWorkGroup();
        }
        else {
          this._LayoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 9999999, 'top', 0);
        }
      });
    }
  }
  Rename(id) {
    var idname = "renameText" + id;
    let ele = (<HTMLInputElement>document.getElementById(idname));
    setTimeout(() => {
      ele.focus();
    }, 10);
  }
  listUser: any[] = [];
  protected filterUsers() {
    if (!this.listUser) {
      return;
    }
  }
}
export class WorkGroupModel {
  id_row: number;
  title: string;
  description: string;
  id_project_team: string;
  reviewer: string;
  id: number;

  clear() {
      this.id_row = 0;
      this.title = '';
      this.description = '';
      this.id_project_team = '';
      // this.reviewer = [];
      this.id = 0;
  }
}
