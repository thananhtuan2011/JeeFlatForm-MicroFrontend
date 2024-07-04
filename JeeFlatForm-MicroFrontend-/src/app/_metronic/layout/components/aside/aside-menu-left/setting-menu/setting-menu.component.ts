import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// RXJS
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AsideService } from '../../aside.service';

@Component({
  selector: 'm-setting-menu',
  templateUrl: './setting-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingMenuComponent implements OnInit, OnDestroy {
  // Table fields
  loadingSubject = new BehaviorSubject<boolean>(false);
  listMenu: any[] = [];
  private subscriptions: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<SettingMenuComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    private _TranslateService: TranslateService,
    private asideService: AsideService,
  ) { }

  ngOnDestroy(): void {
    this.subscriptions.forEach((element) => {
      element.unsubscribe();
    });
  }
  /** LOAD DATA */
  ngOnInit() {
    this.LoadDataList();
  }

  LoadDataList() {
    this.listMenu = [];
    const sb = this.asideService.Get_MenuLeftConfig().subscribe((res) => {
      if (res && res.status == 1 && res.data.length > 0) {
        this.listMenu = res.data;
      } else {
        this.listMenu = [];
      }
      this.changeDetectorRefs.detectChanges();
    });
    this.subscriptions.push(sb);
  }


  ChangInfo(row: any) {
    if (row.IsShow) {
      row.ViTri = "";
    } else {//Bật true
      row.ViTri = 1;
    }
    this.changeDetectorRefs.detectChanges();
  }

  ChangTitle(row: any) {
    // let wid = this.listWidget.find((x) => x.id == row.Id);
    // wid.name = row.Note
    // let widget = new WidgetModel(wid);
    // widget = this.getPositionIfOccupied(widget);

    // this.pageGirdtersDashboardService.PostUpdateTitleWidget(widget).subscribe((res) => {
    //   if (res && res.status === 1) {
    //     this.LoadDataList();
    //   }
    //   this.loadingSubject.next(true);
    // });
  }

  // this.pageGirdtersDashboardService.createWidget(widget).subscribe((res) => {
  //   if (res && res.status === 1) {
  //     this.LoadDataList();
  //     this.LoadWidgetDashboard();
  //   }
  //   this.loadingSubject.next(true);
  // });
  //==========================================================
  goBack() {
    this.dialogRef.close();
  }

  onSubmit() {
    let data = [];
    this.listMenu.forEach(ele => {
      if(ele.IsShow){
        let item = {
          RowID: ele.RowID,
          Position: (ele.ViTri != "" && ele.ViTri != null) ? ele.ViTri : 1
        }
        data.push(item);
      }
    });
    this.asideService.Update_MenuThuongDung(data).subscribe((res) => {
      if (res && res.status === 1) {
        this.dialogRef.close({
          data
        })
      }
    });
  }
}
