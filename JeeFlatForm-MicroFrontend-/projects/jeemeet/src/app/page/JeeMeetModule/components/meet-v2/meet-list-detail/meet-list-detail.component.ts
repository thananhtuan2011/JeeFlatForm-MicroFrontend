import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges, Type, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { Subscription } from 'rxjs';

import { DangKyCuocHopService } from '../../../_services/dang-ky-cuoc-hop.service';
import { MeetingStore } from '../../../_services/meeting.store';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { environment } from 'projects/jeemeet/src/environments/environment';
import { PaginatorState } from '../../../../share/models/paginator.model';
import { SortState } from '../../../../share/models/sort.model';
import { GroupingState } from '../../../../share/models/grouping.model';
import { QuanLyCuocHopService } from '../../../_services/quan-ly-cuoc-hop.service';
import { PhieuLayYKienService } from '../../../quan-ly-phieu-lay-y-kien/_services/quan-ly-phieu-lay-y-kien.service';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-meet-list-detail',
  templateUrl: './meet-list-detail.component.html',
  styleUrls: ['./meet-list-detail.component.scss']
})
export class MeetListDetailComponent implements OnInit {
  @ViewChild(MatMenuTrigger)
  contextMenu: MatMenuTrigger;
  @Input() keyword?: any;
  @Input() tinhTrang?: string = "0";
  @Input() isLoad?: string = "";
  @Input() status?: string = ""
  @Input() sapDang?: number = 0
  @Input() TuNgay: string = ''
  @Input() DenNgay: string = ''
  @Input() SoKyHieu: string = ''
  @Input() KeyNguoiTao: string = ''
  @Input() DonVi: string = ''
  @Input() KeyView: string = ''
  //type: 1: cuộc họp tôi tạo, 2: cuộc họp tôi tham gia, 3: cuộc họp tôi viết tóm tắt
  @Input() Type?: string
  list_yeucau: any;
  _dataAll: any = [];
  pageSize: number;
  Status: number = 1;
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
    private activatedRoute: ActivatedRoute,
    public dangKyCuocHopService: QuanLyCuocHopService,
    public cuocHopService: DangKyCuocHopService,
    public phieuLayYKienService: PhieuLayYKienService,
    private layoutUtilsService: LayoutUtilsService,
    private translate: TranslateService,
    private store: MeetingStore,
    private changeDetectorRefs: ChangeDetectorRef) { }

  ngOnInit() {
    // this.router.events.subscribe(()=>{
    //   console.log(this.router)
    // })
    const sb = this.dangKyCuocHopService.isLoading$.subscribe((res) => {
      this.isLoading = res
      this.changeDetectorRefs.detectChanges();
    });
    this.subscriptions.push(sb);
    this.store.data_shareLoad$.subscribe((data: any) => {
      if (data) {
        this.loadDataList()
      }
    })

    // this.cuocHopService.data_shareLoad$.subscribe((data: any) => {
    //   if (data && data != '') {
    //     if (data.RowID) {
    //       this.Type = '1'
    //       this.router.navigate(
    //         [
    //           `/Meet/${data.RowID}`
    //         ],
    //         { queryParams: { Type: 0 } }
    //       );
    //     }
    //     this.loadDataList()
    //   }
    // })
    const sb2 = this.dangKyCuocHopService.items$.subscribe((res) => {
      this._dataAll = res
      const now = new Date();
      this._dataAll = this._dataAll.sort((a, b) => {
        if (a.SapHoacDangDienRa == 1 && b.SapHoacDangDienRa == 1) {
          const timeDiffA = Math.abs(new Date(a.FromTime).getTime() - now.getTime());
          const timeDiffB = Math.abs(new Date(b.FromTime).getTime() - now.getTime());
          return timeDiffA - timeDiffB;
        } else {
          return 0;
        }
      });
      if (this.tinhTrang == '1') {
        if (this.sapDang == 1 || this.sapDang == 2) {
          if (this.sapDang == 2) {
            this._dataAll = this._dataAll.filter(item => this.convertDateExpired(item.FromTime, item.ThoiLuongPhut) == 1)
          } else {
            this._dataAll = this._dataAll.filter(item => this.convertDateExpired(item.FromTime, item.ThoiLuongPhut) != 1)
          }
        }
      }
      if (this.tinhTrang == '1') {
        if (this.sapDang == 3) {
          this._dataAll = this._dataAll.filter(item => item.SapHoacDangDienRa == 1)
        }
      }
      this.changeDetectorRefs.detectChanges();
    });
    this.subscriptions.push(sb2);
  }
  loadDataList() {
    this.grouping = this.dangKyCuocHopService.grouping;
    this.paginator = this.dangKyCuocHopService.paginator;
    this.sorting = this.dangKyCuocHopService.sorting;
    switch (this.Type) {
      case '1':
        this.URL = '/GetList_CuocHop';
        this.TypeRouter = 0
        this.Status = 0
        break;

      case '2':
        this.URL = '/GetList_CuocHop';
        this.TypeRouter = 1
        this.Status = 0
        break;
      case '3':
        this.URL = '/GetList_CuocHop';
        this.TypeRouter = 3
        this.Status = 0
        break;
      default:
        break;
    }
    const filter = this.filterConfiguration()
    const sorting = this.sorting
    if (sorting) {
      sorting.column = 'BookingDate';
      sorting.direction = 'desc';
    }
    const more = true
    if (this.URL) {
      this.dangKyCuocHopService.patchState(
        { filter, more },
        this.URL
      );
      this.changeDetectorRefs.detectChanges();
    }


  }
  ngOnChanges(changes: SimpleChanges): void {
    this.loadDataList();
  }

  getColor2(condition: number = 0): string {
    switch (condition) {
      case 1:
        return "#0A9562";
      case -2:
        return "#B4BECB";
      case 3:
        return "#f44336";
    }
    return "#ff6a00";
  }
  getTextStatus(condition: number = 0): string {
    switch (condition) {
      case 1:
      case -2:
        return "Đã qua thời gian diễn ra";
      case 3:
        return "Đã hoãn";
    }
    return "Sắp hoặc đang diễn ra";
  }
  filterConfiguration(): any {
    debugger
    const filter: any = {};
    if (this.keyword != undefined) {
      filter["keyword"] = this.keyword;
    }
    if (this.TuNgay) {
      filter["TuNgay"] = this.TuNgay;
    }
    if (this.DenNgay) {
      filter["DenNgay"] = this.DenNgay;
    }

    if (this.SoKyHieu) {
      filter["SoKyHieu"] = this.SoKyHieu;
    }

    if (this.KeyNguoiTao) {
      filter["KeyNguoiTao"] = this.KeyNguoiTao;
    }

    if (this.KeyView) {
      filter["KeyView"] = this.KeyView;
    }

    if (this.DonVi) {
      filter["DonVi"] = this.DonVi;
    }

    filter.Status = Number(this.tinhTrang);
    filter.Type = this.Type;
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
    tmp_height = window.innerHeight - 180;
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

  XacNhanThamGia(item, status: number) {
    const _title: string = 'Xác nhận tham gia cuộc họp được ủy quyền ';
    const _description: string = status == 1 ? 'Bạn có chắc muốn tham gia?' : 'Bạn có chắc không tham gia?';
    const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      var data =
      {
        Id: item.RowID,
        XacNhanThamGiaCuocHopThongQuaUyQuyen: status
      };
      this.dangKyCuocHopService
        .XacNhanThamGiaThongQuaUyQuyen(data)
        .subscribe((res: any) => {
          if (res && res.status === 1) {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              "Xác nhận tham gia thành công",
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
            this.loadDataList();
            this.changeDetectorRefs.detectChanges()
          }
          else {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
          }
        });
    });
  }
  XacNhanCuocHop(ID_Meeting) {
    const _title: string = 'Xác nhận hoàn tất chuẩn bị cuộc họp ';
    const _description: string = 'Bạn có chắc muốn xác nhận này?';
    const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, '', false);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dangKyCuocHopService
        .XacNhanCuocHop(ID_Meeting)
        .subscribe((res: any) => {
          if (res && res.status === 1) {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              "Xác nhận thành công",
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
            this.loadDataList()
            this.cuocHopService.data_shareLoadChiTiet$.next(res)
          } else {
            this.changeDetectorRefs.detectChanges();
            this.layoutUtilsService.showActionNotification(
              res.error.message,
              MessageType.Read,
              4000,
              true,
              false,
              3000,
              "top"
            );
          }
        });
    });
  }

  Detail(evt: any, id: any) {
    if (id.DaXacNhanUyQuyenTuHaiBen == 0 && id.NguoiDuocUyQuyen == 1)
      evt.stopPropagation();
    return;
  }

  danhDauDaXuLy(item) {
    const _title: string = 'Xác nhận đã xử lý cuộc họp ';
    const _description: string = 'Bạn có chắc muốn đưa cuộc họp này vào danh sách đã xử lý?';
    const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, '', false);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.dangKyCuocHopService.danhDauDaXuLy(item.RowID).subscribe((res: any) => {
        if (res && res.status === 1) {
          this.layoutUtilsService.showActionNotification(
            'Lưu trữ thành công',
            MessageType.Read,
            4000,
            true,
            false,
            3000,
            "top"
          );
          this.loadDataList();
          this.changeDetectorRefs.detectChanges()
        } else {
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Read,
            9999999999,
            true,
            false,
          );
          this.changeDetectorRefs.detectChanges()
        }
      });
    });

  }


  contextMenuPosition = { x: '0px', y: '0px' };

  onContextMenu(event: MouseEvent, item: any) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    this.contextMenu.menuData = { 'item': item };
    this.contextMenu.menu.focusFirstItem('mouse');
    this.contextMenu.openMenu();
  }
}
