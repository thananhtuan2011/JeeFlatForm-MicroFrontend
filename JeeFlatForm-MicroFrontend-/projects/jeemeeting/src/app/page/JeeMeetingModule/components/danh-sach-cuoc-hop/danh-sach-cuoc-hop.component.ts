import { ChangeDetectorRef, Component, Input, OnInit, Type } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { Subscription } from 'rxjs';

import { DangKyCuocHopService } from '../../_services/dang-ky-cuoc-hop.service';
import { MeetingStore } from '../../_services/meeting.store';
import { LayoutUtilsService } from 'projects/jeemeeting/src/modules/crud/utils/layout-utils.service';
import { environment } from 'projects/jeemeeting/src/environments/environment';
import { PaginatorState } from '../../../share/models/paginator.model';
import { SortState } from '../../../share/models/sort.model';
import { GroupingState } from '../../../share/models/grouping.model';

@Component({
  selector: 'app-danh-sach-cuoc-hop',
  templateUrl: './danh-sach-cuoc-hop.component.html',
  styleUrls: ['./danh-sach-cuoc-hop.component.scss']
})
export class DanhSachCuocHopComponent implements OnInit {
  @Input() keyword?: any;
  @Input() tinhTrang?: string = "0";
  @Input() isLoad?: string = "";
  @Input() status?: string = ""
  //type: 1: cuộc họp tôi tạo, 2: cuộc họp tôi tham gia, 3: cuộc họp tôi viết tóm tắt
  @Input() Type?: string
  list_yeucau: any;
  _dataAll: any;
  pageSize: number;

  //=================PageSize Table=====================
  paginator: PaginatorState = new PaginatorState();
  sorting: SortState;
  grouping: GroupingState;
  isLoading: boolean = false;
  TypeRouter: number = 0
  //=======================URL default================
  URL: string = ''
  private subscriptions: Subscription[] = [];

  constructor(
    public dialog: MatDialog,
    private router: Router,
    public dangKyCuocHopService: DangKyCuocHopService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private store: MeetingStore,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    this.store.data_shareLoad$.subscribe((data: any) => {
      this.loadDataList()
    })
  }
  loadDataList() {
    this.grouping = this.dangKyCuocHopService.grouping;
    this.paginator = this.dangKyCuocHopService.paginator;
    this.sorting = this.dangKyCuocHopService.sorting;
    const sb = this.dangKyCuocHopService.isLoading$.subscribe((res) => {
      this.isLoading = res
      this.changeDetectorRefs.detectChanges();
    });
    this.subscriptions.push(sb);
    switch (this.Type) {
      case '1':
        this.URL = this.dangKyCuocHopService.loadListCuocHopCuaToi;
        this.TypeRouter = 0
        break;

      case '2':
        this.URL = this.dangKyCuocHopService.loadListCuocHopToiThamGia;
        this.TypeRouter = 1
        break;

      case '3':
        this.URL = this.dangKyCuocHopService.loadListCuocHopToiThamGia;
        this.TypeRouter = 2
        break;

      default:
        break;
    }
    const filter = this.filterConfiguration()
    const sorting = this.sorting
    sorting.column = 'FromTime';
    sorting.direction = 'desc';
    const paginator = this.paginator
    paginator.pageSize = 10000
    const searchTerm = this.keyword
    if (this.URL) {
      this.dangKyCuocHopService.patchStateURL(
        { filter, sorting, paginator, searchTerm },
        environment.HOST_JEEMEETING_API + this.URL
      );
    }
  }

  ngOnChanges() {
    this.loadDataList();
  }

  getColor2(condition: number = 0): string {
    //Thiên thay đổi code để đồng bộ color theo custemer
    const styles = window.getComputedStyle(document.body);
    let _color = styles.getPropertyValue("--btn-add-plus");
    switch (condition) {
      case 1:
        return _color;
      // return "#0A9562";
      case -2:
        return _color;
      // return "#0A9562";
    }
    return "#ff6a00";
  }

  filterConfiguration(): any {
    const filter = {};
    if (this.Type == '3') {
      filter["status"] = '4';
    }
    return filter;
  }

  convertDate(d: any) {
    return moment(d + 'z').format("DD/MM/YYYY hh:mm");
  }

  convertDateExpired(d: any, t: number) {
    if (d == null || d == "") return ""
    let now = new Date(new Date().toString());
    let date = new Date(moment(d).add(t, 'minutes').toString());
    let dateAdd = new Date(moment(now).add(t, 'minutes').toString());
    if (date >= now && date <= dateAdd) return 1;
    return 0
  }

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 100;
    return tmp_height + 'px';
  }
  onScroll(event) {
    this.pageSize += 1;
    this.loadDataListLayzy(this.pageSize);
  }
  loadDataListLayzy(page: number) {

  }
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
