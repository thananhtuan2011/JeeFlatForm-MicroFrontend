import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService, MessageType } from 'projects/jeeteam/src/modules/crud/utils/layout-utils.service';
import { SortState } from '../model/sort.model';
import { GroupingState } from '../model/grouping.model';
import { PaginatorState } from '../model/paginator.model';
import { JeeTeamService } from '../services/jeeteam.service';
import { ActivatedRoute } from '@angular/router';
import { TopicService } from '../services/topic.service';
import { environment } from 'projects/jeeteam/src/environments/environment';

@Component({
  selector: 'app-load-tailieu-group',
  templateUrl: './load-tailieu-group.component.html',
  styleUrls: ['./load-tailieu-group.component.scss']
})
export class LoadTailieuGroupComponent implements OnInit {

  api = environment.HOST_JEETEAM_API;
  api_allfile = this.api + "/api/topic/getAllFile"
  paginator: PaginatorState;
  subheaderCSSClasses = '';
  subheaderContainerCSSClasses = '';
  subheaderMobileToggle = false;
  subheaderDisplayDesc = false;
  subheaderDisplayDaterangepicker = false;
  searchtext: string
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean;
  user: any
  constructor(
    private translate: TranslateService,
    private layoutUtilsService: LayoutUtilsService,
    private dialog: MatDialog,
    public _team_services: JeeTeamService,
    private cdr: ChangeDetectorRef,
    private _top_services: TopicService

  ) {
    this.user = JSON.parse(localStorage.getItem("user"));
  }
  formatBytesInsert(bytes) {
    if (bytes === 0) {
      return '0 KB';
    }
    const k = 1024;
    const dm = 2 <= 0 ? 0 : 2 || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  reverseString(item) {
    let dt = item.split(" ")
    return dt[dt.length - 1];
  }
  paginate(paginator: PaginatorState) {
    this._team_services.patchStateAllfile({ paginator }, this.api_allfile, this.RowId);
  }
  sort(column: string) {
    const sorting = this.sorting;
    const isActiveColumn = sorting.column === column;
    if (!isActiveColumn) {
      sorting.column = column;
      sorting.direction = 'asc';
    } else {
      sorting.direction = sorting.direction === 'asc' ? 'desc' : 'asc';
    }
    this._team_services.patchStateAllfile({ sorting }, this.api_allfile, this.RowId);
  }

  LoadAllFile(rowid) {
    const filter = {};
    this._team_services.patchStateAllfile({ filter }, this.api_allfile, rowid);
  }


  Delete(id) {
    const _title = this.translate.instant('Xóa File');
    const _description = this.translate.instant('Bạn có muốn xóa không ?');
    const _waitDesciption = this.translate.instant('Dữ liệu đang được xử lý');
    const _deleteMessage = this.translate.instant('Xóa thành công !');
    const _erroMessage = this.translate.instant('Thất bại !');
    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe((res) => {
      if (!res) {
        return;
      }
      else {
        this._top_services.DeleteFile(id).subscribe(res => {
          if (res) {
            this.LoadAllFile(this.RowId);
            this.layoutUtilsService.showActionNotification("Thành công", MessageType.Delete, 400000000, true, false, 3000, 'top', 1);
          }

        })
      }

    });
  }

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 200;
    return tmp_height + 'px';
  }
  keymenu: any
  RowId: number
  ngOnInit(): void {
    this.keymenu = localStorage.getItem("KeyIdMenu");
    var dt = JSON.parse(this.keymenu)
    console.log("ddd", dt)
    this.RowId = dt[0].Idmenu
    this.LoadAllFile(dt[0].Idmenu);
    this.paginator = this._team_services.paginator;

  }

  saverange(value) {
    this.search(value)

  }

  search(value) {
    // filter.HOTEN =filter;
    //  this.accountManagementService.patchState({ filter }

    if (value != "") {


      const filter = {};
      filter['filename'] = value
      this._team_services.patchStateAllfile({ filter }, this.api_allfile, this.RowId);
    }
    else {

      const filter = {};
      this._team_services.patchStateAllfile({ filter }, this.api_allfile, this.RowId);

    }

  }

  RouterLink(link) {
    window.open(
      link,
      'Independent Window'
    );
  }

}
