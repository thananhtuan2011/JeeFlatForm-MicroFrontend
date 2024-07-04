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
import { JeeWorkLiteService } from "../../services/wework.services";
import { SetUpWidgetTimeV1Component } from "../set-up-widget-time-v1/set-up-widget-time-v1.component";
@Component({
  selector: 'app-edit-popup-widget-time-v1',
  templateUrl: './edit-popup-widget-time-v1.component.html',
  styleUrls: ['./edit-popup-widget-time-v1.component.scss']
})
export class EditPopupWidgetTimeV1Component implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditPopupWidgetTimeV1Component>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    public weworkService: JeeWorkLiteService,
  ) {

  }
  id_widget: any;
  ListDK: any = [];
  ngOnInit(): void {
    this.id_widget = this.data.item.id;
    this.load_list_dk();
  }
  load_list_dk() {
    this.weworkService.Get_listCustomWidgetByUser(this.id_widget).subscribe(res => {
      if (res && res.status == 1) {
        this.ListDK = res.data;
      }
    })
  }
  delete_dk(id) {
    this.weworkService.Delete_Custom_Widget(id).subscribe(res => {
      if (res && res.status == 1) {
        this.load_list_dk();
      }
    })
  }
  Update_SetTime(id) {
    let item = this.data.item;
    let id_custom = id;
    let saveMessageTranslateParam = '';
    const dialogRef = this.dialog.open(SetUpWidgetTimeV1Component, {
      data: { item, id_custom },
      panelClass:'sky-padding-0',
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
