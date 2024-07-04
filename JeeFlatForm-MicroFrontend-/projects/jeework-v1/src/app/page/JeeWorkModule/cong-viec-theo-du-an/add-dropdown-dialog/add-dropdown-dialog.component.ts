import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// RXJS
import { BehaviorSubject, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GridsterItem } from 'angular-gridster2';
import { CongViecTheoDuAnService } from '../services/cong-viec-theo-du-an.services';

@Component({
  selector: 'm-add-dropdown-dialog',
  templateUrl: './add-dropdown-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddDropDownDialogComponent implements OnInit, OnDestroy {
  // Table fields
  loadingSubject = new BehaviorSubject<boolean>(false);
  showWidgets: WidgetShow[] = [];
  dashboard: Array<GridsterItem>;
  private subscriptions: Subscription[] = [];
  constructor(
    public dialogRef: MatDialogRef<AddDropDownDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private changeDetectorRefs: ChangeDetectorRef,
    public congViecTheoDuAnService: CongViecTheoDuAnService,
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
    this.showWidgets = [];
    const sb = this.congViecTheoDuAnService.getDSWorkConfig().subscribe((res) => {
      this.showWidgets = res;
      this.changeDetectorRefs.detectChanges();
    });
    this.subscriptions.push(sb);
  }

  ChangInfo(val: any, row: WidgetShow) {
    this.loadingSubject.next(true);
    if (val.checked === false) {
      this.congViecTheoDuAnService.Delete_Drd(+row.Id).subscribe((res) => {
        if (res && res.status === 1) {
          this.LoadDataList();
        }
        this.loadingSubject.next(true);
      });
    } else {
      let item = {
        id: row.Id,
        name: row.Note
      }
      this.congViecTheoDuAnService.Create_Drd(item).subscribe((res) => {
        if (res && res.status === 1) {
          this.LoadDataList();
        }
        this.loadingSubject.next(true);
      });
    }
  }


  ChangTitle(row: WidgetShow) {
    let item = {
      id: row.Id,
      name: row.Note
    }
    this.congViecTheoDuAnService.Post_UpdateTitleDrd(item).subscribe((res) => {
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

export class WidgetShow {
	Id: string;
	Title: string;
	IsShow: boolean;
	IsHienThi: boolean;
	Note: string;
}
