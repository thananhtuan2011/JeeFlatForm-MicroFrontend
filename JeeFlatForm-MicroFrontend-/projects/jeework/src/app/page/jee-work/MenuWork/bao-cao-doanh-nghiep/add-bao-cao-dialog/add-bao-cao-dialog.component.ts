import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
// RXJS
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridsterItem } from 'angular-gridster2';
import { ResultModel } from '../../../models/_base.model';
import { Widget, WidgetModel, WidgetShow } from '../Model/bao-cao-doanh-nghiep.model';
import { BaoCaoDoanhNghiepService } from '../Services/bao-cao-doanh-nghiep.service';

@Component({
  selector: 'm-add-bao-cao-dialog',
  templateUrl: './add-bao-cao-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddBaoCaoDialogComponent implements OnInit, OnDestroy {
  public listWidget: Widget[] = [];
  // Table fields
  loadingSubject = new BehaviorSubject<boolean>(false);
  showWidgets: WidgetShow[] = [];
  dashboard: Array<GridsterItem>;
  private subscriptions: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddBaoCaoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _BaoCaoDoanhNghiepService: BaoCaoDoanhNghiepService,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((element) => {
      element.unsubscribe();
    });
  }
  /** LOAD DATA */
  ngOnInit() {
    this.LoadDataList();
    this.listWidget = this._BaoCaoDoanhNghiepService.getWidgets();
    this.dashboard = this.data.dashboard;
    this.dashboard.sort((a, b) => a.y - b.y);
  }

  LoadDataList() {
    this.showWidgets = [];
    const sb = this._BaoCaoDoanhNghiepService.getDSReportConfig().subscribe((res) => {
      this.showWidgets = res.data;
      this.changeDetectorRefs.detectChanges();
    });
    this.subscriptions.push(sb);
  }

  LoadWidgetDashboard() {
    this._BaoCaoDoanhNghiepService
    .getDSReport().subscribe((res: ResultModel<Widget>) => {
      if (res.data.length > 0) {
        this.dashboard = res.data;
        this.dashboard.sort((a, b) => a.y - b.y);
      } else {
        this.dashboard = [];
      }
    });

  }

  ChangInfo(row: WidgetShow) {
    this.loadingSubject.next(true);
    if (row.IsShow) {
      this._BaoCaoDoanhNghiepService.deleteWidget(+row.Id).subscribe((res) => {
        if (res && res.status === 1) {
          this.LoadDataList();
        }
        this.loadingSubject.next(true);
      });
    } else {
      let wid = this.listWidget.find((x) => x.id == row.Id);
      wid.name = row.Note
      let widget = new WidgetModel(wid);
      widget = this.getPositionIfOccupied(widget);

      this._BaoCaoDoanhNghiepService.createWidget(widget).subscribe((res) => {
        if (res && res.status === 1) {
          this.LoadDataList();
          this.LoadWidgetDashboard();
        }
        this.loadingSubject.next(true);
      });
    }
  }

  public getPositionIfOccupied(widget): WidgetModel {
    for (let item of this.dashboard) {
      if (item.x === widget.x && item.y === widget.y) {
        widget.y = this.dashboard[this.dashboard.length - 1].y + this.dashboard[this.dashboard.length - 1].rows;
        return widget;
      }
    }
    return widget;
  }

  ChangTitle(row: WidgetShow) {
    let wid = this.listWidget.find((x) => x.id == row.Id);
    wid.name = row.Note
    let widget = new WidgetModel(wid);
    widget = this.getPositionIfOccupied(widget);

    this._BaoCaoDoanhNghiepService.PostUpdateTitleWidget(widget).subscribe((res) => {
      if (res && res.status === 1) {
        this.LoadDataList();
      }
      this.loadingSubject.next(true);
    });
  }
  //==========================================================
  goBack() {
    this.dialogRef.close();
  }
}
