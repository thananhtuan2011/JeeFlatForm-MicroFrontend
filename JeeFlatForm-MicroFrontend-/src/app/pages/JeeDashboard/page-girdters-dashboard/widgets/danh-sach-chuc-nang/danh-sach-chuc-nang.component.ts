import { Component, OnInit, ChangeDetectorRef, Input, EventEmitter, OnDestroy, Output } from '@angular/core';
// Material
// RXJS
import { Subscription } from 'rxjs';
import { DanhMucChungService } from 'src/app/_metronic/core/services/danhmuc.service';
import { PageGirdtersDashboardService } from '../../Services/page-girdters-dashboard.service';
// Services
// Models
@Component({
  selector: 'm-danh-sach-chuc-nang',
  templateUrl: './danh-sach-chuc-nang.component.html',
})
export class DanhSachChucNangWidgetComponent implements OnInit, OnDestroy {
  @Input()
  widget;

  listTruyCap: any[] = [];
  @Input()
  resizeEvent: EventEmitter<any> = new EventEmitter<any>();
  private subscriptions: Subscription[] = [];

  heightRow = 75;
  numberRow: number;
  constructor(private changeDetectorRefs: ChangeDetectorRef, private _PageGirdtersDashboardService: PageGirdtersDashboardService) {}

  ngOnInit() {
    this.loadDataTruyCap();

    const sb = this.resizeEvent.subscribe((res) => {
      this.numberRow = res.rows;
      this.getHeight();
      this.changeDetectorRefs.detectChanges();
    });
    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.subscriptions.forEach((element) => {
      element.unsubscribe();
    });
  }

  loadDataTruyCap() {
    const sb = this._PageGirdtersDashboardService.getChucNang().subscribe((res) => {
      if (res.status == 1) {
        this.listTruyCap = res.data;
      } else {
        this.listTruyCap = [];
      }
      this.changeDetectorRefs.detectChanges();
    });
    this.subscriptions.push(sb);
  }

  getHeight(): any {
    let tmp_height = document.getElementById('gridster-height1').clientHeight;
    tmp_height = tmp_height - 100;
    return tmp_height + 'px';
  }
}
