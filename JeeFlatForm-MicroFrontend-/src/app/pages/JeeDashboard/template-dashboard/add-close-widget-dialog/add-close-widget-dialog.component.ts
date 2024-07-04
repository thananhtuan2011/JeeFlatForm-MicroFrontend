import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// RXJS
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridsterItem } from 'angular-gridster2';
import { Widget, WidgetModel, WidgetShow } from '../../page-girdters-dashboard/Model/page-girdters-dashboard.model';
import { TemplateDashboardService } from '../Services/template-dashboard.service';
import { PageGirdtersDashboardService } from '../../page-girdters-dashboard/Services/page-girdters-dashboard.service';
import { ResultModel } from 'src/app/modules/auth/models/_base.model';

@Component({
  selector: 'm-add-close-widget-dialog',
  templateUrl: './add-close-widget-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCloseWidgetTemplateDialogComponent implements OnInit, OnDestroy {
  public listWidget: Widget[] = [];
  // Table fields
  loadingSubject = new BehaviorSubject<boolean>(false);
  showWidgets: WidgetShow[] = [];
  dashboard: Array<GridsterItem>;
  private subscriptions: Subscription[] = [];
  TempID: number;
  constructor(
    public dialogRef: MatDialogRef<AddCloseWidgetTemplateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private _TemplateDashboardService: TemplateDashboardService,
    public pageGirdtersDashboardService: PageGirdtersDashboardService,
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((element) => {
      element.unsubscribe();
    });
  }
  /** LOAD DATA */
  ngOnInit() {
    this.TempID = this.data._TempID;
    this.LoadDataList();
    this.listWidget = this.pageGirdtersDashboardService.getWidgets();
    this.dashboard = this.data.dashboard;
    this.dashboard.sort((a, b) => a.y - b.y);
  }

  LoadDataList() {
    this.showWidgets = [];
    const sb = this._TemplateDashboardService.getDSWidgetConfig_Template(this.TempID).subscribe((res) => {
      this.showWidgets = res;
      this.changeDetectorRefs.detectChanges();
    });
    this.subscriptions.push(sb);
  }

  LoadWidgetDashboard() {
    this.pageGirdtersDashboardService
      .getDSWidget().subscribe((res: ResultModel<Widget>) => {
        if (res.data.length > 0) {
          this.dashboard = res.data;
          this.dashboard.sort((a, b) => a.y - b.y);
        } else {
          this.dashboard = [];
        }
      });

  }

  ChangInfo(val: any, row: WidgetShow) {
    this.loadingSubject.next(true);
    if (val.checked === false) {
      this._TemplateDashboardService.deleteWidget_Template(+row.Id, this.TempID).subscribe((res) => {
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

      this._TemplateDashboardService.createWidget_template(widget, this.TempID).subscribe((res) => {
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

    this._TemplateDashboardService.PostUpdateTitleWidget_Template(widget, this.TempID).subscribe((res) => {
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
