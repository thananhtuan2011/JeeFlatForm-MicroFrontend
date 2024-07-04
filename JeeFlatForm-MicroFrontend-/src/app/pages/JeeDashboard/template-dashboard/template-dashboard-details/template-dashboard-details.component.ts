import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { DisplayGrid, GridsterConfig, GridsterItem } from 'angular-gridster2';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';

import * as _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { TemplateDashboardService } from '../Services/template-dashboard.service';
import { PageGirdtersDashboardService } from '../../page-girdters-dashboard/Services/page-girdters-dashboard.service';
import { Dashboard, Widget, WidgetModel } from '../../page-girdters-dashboard/Model/page-girdters-dashboard.model';
import { ActivatedRoute } from '@angular/router';
import { AddCloseWidgetTemplateDialogComponent } from '../add-close-widget-dialog/add-close-widget-dialog.component';
import { ResultModel } from 'src/app/modules/auth/models/_base.model';
const moment = _rollupMoment || _moment;

@Component({
  selector: 'm-template-dashboard-details',
  templateUrl: './template-dashboard-details.component.html',
  styleUrls: ['template-dashboard-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TemplateDashboardDetailsComponent implements OnInit, OnDestroy {
  public listWidget: Widget[] = [];
  public options: GridsterConfig;
  public WidgetDashboard: Dashboard;
  public dashboard: Array<GridsterItem>;
  private btnThemMoiEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  private btnAddJAdminEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  private btnThemMoiJeeRequestEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  public showConfig: boolean = false;
  campaignOne: FormGroup;
  campaignTwo: FormGroup;
  campaign17: FormGroup;
  campaign18: FormGroup;
  campaign19: FormGroup;
  filterLoaibieudo: string = '0';
  filterYCCN: string = "Chờ duyệt";
  filterYCCD: string = "Tất cả";
  private resizeEvent: EventEmitter<any> = new EventEmitter<any>();
  public inputs = {
    widget: '',
  };
  // phong add for unsubcribe
  subject = new Subject();
  // end phong add
  public title_Dash: string;
  public istaskbar: string = '0';
  public image: string;
  //========================================================
  isUseWidget: boolean = true;
  constructor(
    private changeDetect: ChangeDetectorRef,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private pageGirdtersDashboardService: PageGirdtersDashboardService,
    private _TemplateDashboardService: TemplateDashboardService,
    private activatedRoute: ActivatedRoute,
  ) {
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month - 1, 1)),
      end: new FormControl(new Date(year, month, today.getDate())),
    });

    this.campaignTwo = new FormGroup({
      start: new FormControl('null'),
      end: new FormControl(new Date('null')),
    });

    this.campaign17 = new FormGroup({
      start: new FormControl('null'),
      end: new FormControl(new Date('null')),
    });

    this.campaign18 = new FormGroup({
      start: new FormControl('null'),
      end: new FormControl(new Date('null')),
    });

    this.campaign19 = new FormGroup({
      start: new FormControl('null'),
      end: new FormControl(new Date('null')),
    });
  }

  ngOnDestroy(): void {
    this.subject.next();
    this.subject.complete();
  }
  data_dk: any[] = [];
  TempID: number;
  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.TempID = +params.id;
      this.listWidget = this.pageGirdtersDashboardService.getWidgets();
      this.WidgetDashboard = new Dashboard();
      this.options = this.pageGirdtersDashboardService.getDashBoardOptions();
      this.options.displayGrid = DisplayGrid.OnDragAndResize;
      this.options.itemChangeCallback = (item: Widget) => {
        const widget = new WidgetModel(item);
        this._TemplateDashboardService
          .postUpdateWidget_Template(widget, this.TempID)
          .pipe(takeUntil(this.subject))
          .subscribe((res) => {
            this.resizeEvent.emit(item);
          });
      };

      this._TemplateDashboardService
        .getDSWidget_Template(this.TempID)
        .pipe(takeUntil(this.subject))
        .subscribe((res: ResultModel<Widget>) => {
          if (res.data.length > 0) {
            this.WidgetDashboard.widgets = res.data;
            this.WidgetDashboard.widgets.forEach((widget: Widget) => {
              for (let index = 0; index < this.listWidget.length; index++) {
                if (widget.componentName === this.listWidget[index].componentName) {
                  widget.componentType = this.listWidget[index].componentType;
                }
              }
            });
          } else {
            this.dashboard = [];
          }
          this.dashboard = this.WidgetDashboard.widgets;

          this.changeDetectorRefs.detectChanges();
        });
    });


    //widget load set-time

    //end
    // this.options.itemResizeCallback = (item: Widget) => {
    //   const widget = new WidgetModel(item);
    //   this.pageGirdtersDashboardService
    //     .postUpdateWidget(widget)
    //     .pipe(takeUntil(this.subject))
    //     .subscribe((res) => {
    //       this.resizeEvent.emit(item);
    //     });
    // };
  }

  changedOptions() {
    this.options.api.optionsChanged();
  }

  closeWidget(id: number) {
    this._TemplateDashboardService
      .deleteWidget_Template(id, this.TempID)
      .pipe(takeUntil(this.subject))
      .subscribe((res) => {
        if (res && res.status === 1) {
          this.ngOnInit();
          this.changeDetect.detectChanges();
        }
      });
  }

  AddCloseWidget() {
    const dialogRef = this.dialog.open(AddCloseWidgetTemplateDialogComponent, {
      data: { dashboard: this.dashboard, _TempID: this.TempID },
      position: { top: '60px' },
      panelClass: 'no-padding',
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.subject))
      .subscribe((res) => {
        this.ngOnInit();
        setTimeout(() => {
        }, 500);
        this.changeDetect.detectChanges();
      });
  }

  getInput(wiget: Widget): any {
    const inputs = {
      widget: wiget,
      resizeEvent: this.resizeEvent,
    };
    return inputs;
  }
}
