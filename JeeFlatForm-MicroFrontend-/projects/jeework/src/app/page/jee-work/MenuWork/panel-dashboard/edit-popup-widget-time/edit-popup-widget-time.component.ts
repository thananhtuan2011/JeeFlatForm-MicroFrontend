// Angular
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  ElementRef,
} from "@angular/core";
import {
  FormBuilder,
} from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DatePipe } from '@angular/common';
import { SetUpWidgetTimeComponent } from "../set-up-widget-time/set-up-widget-time.component";
import { WorksbyprojectService } from "../Services/worksbyproject.service";
import { PanelDashboardService } from "../Services/panel-dashboard.service";
@Component({
  selector: 'app-edit-popup-widget-time',
  templateUrl: './edit-popup-widget-time.component.html',
  styleUrls: ['./edit-popup-widget-time.component.scss']
})
export class EditPopupWidgetTimeComponent implements OnInit {

  constructor(
    public _WorksbyprojectService: WorksbyprojectService,
    public dialogRef: MatDialogRef<EditPopupWidgetTimeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public _PanelDashboardService: PanelDashboardService,
  ) {

  }
  id_widget: any;
  ListDK: any = [];
  ngOnInit(): void {
    this.id_widget = this.data.item.id;
    this.load_list_dk();
  }
  load_list_dk() {
    this._PanelDashboardService.Get_listCustomWidgetByUser(this.id_widget).subscribe(res => {
      if (res && res.status == 1) {
        this.ListDK = res.data;
      }
    })
  }
  delete_dk(id) {
    this._PanelDashboardService.Delete_Custom_Widget(id).subscribe(res => {
      if (res && res.status == 1) {
        this.load_list_dk();
      }
    })
  }
  Update_SetTime(id) {
    let item = this.data.item;
    let id_custom = id;
    let saveMessageTranslateParam = '';
    const dialogRef = this.dialog.open(SetUpWidgetTimeComponent, {
      data: { item, id_custom },
      width: '700px'
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        this.load_list_dk();
        return;
      } else {
      }
    });
  }
  goBack() {
    this.dialogRef.close();
  }
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 126;
    return tmp_height + 'px';
  }

}
