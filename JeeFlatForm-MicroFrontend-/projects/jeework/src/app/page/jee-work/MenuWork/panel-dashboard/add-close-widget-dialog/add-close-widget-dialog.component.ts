import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// RXJS
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridsterItem } from 'angular-gridster2';
import { Widget, WidgetModel, WidgetShow } from '../Model/panel-dashboard.model';
import { PanelDashboardService } from '../Services/panel-dashboard.service';
import { ResultModel } from '../../../models/_base.model';

@Component({
  selector: 'm-add-close-widget-dialog',
  templateUrl: './add-close-widget-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCloseWidgetDialogComponent implements OnInit, OnDestroy {
  public listWidget: Widget[] = [];
  // Table fields
  loadingSubject = new BehaviorSubject<boolean>(false);
  showWidgets: WidgetShow[] = [];
  dashboard: Array<GridsterItem>;
  private subscriptions: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddCloseWidgetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _PanelDashboardService: PanelDashboardService,
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
    debugger
    this.listWidget = this._PanelDashboardService.getWidgets();
    this.dashboard = this.data.dashboard;
    this.dashboard.sort((a, b) => a.y - b.y);
  }

  LoadDataList() {
    this.showWidgets = [];
    const sb = this._PanelDashboardService.getDSWidgetConfig().subscribe((res) => {
      this.showWidgets = res;
      this.changeDetectorRefs.detectChanges();
    });
    this.subscriptions.push(sb);
  }

  LoadWidgetDashboard() {
    this._PanelDashboardService
    .getDSWidget().subscribe((res: ResultModel<Widget>) => {
      debugger
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
      this._PanelDashboardService.deleteWidget(+row.Id).subscribe((res) => {
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

      this._PanelDashboardService.createWidget(widget).subscribe((res) => {
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

    this._PanelDashboardService.PostUpdateTitleWidget(widget).subscribe((res) => {
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
