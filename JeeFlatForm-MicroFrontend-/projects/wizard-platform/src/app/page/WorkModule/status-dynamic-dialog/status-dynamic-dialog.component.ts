import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";
import { Component, OnInit, Inject, ChangeDetectorRef, HostListener } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Route, Router } from '@angular/router';
import { LayoutUtilsService, MessageType } from "projects/wizard-platform/src/modules/crud/utils/layout-utils.service";
import { WorkwizardChungService } from "../work.service";
import { BaseModel } from "../_base.model_new";
@Component({
  selector: 'app-status-dynamic-dialog',
  templateUrl: './status-dynamic-dialog.component.html',
  styleUrls: ['./status-dynamic-dialog.component.scss']
})
export class StatusDynamicDialogComponent implements OnInit {

  color_status: string = "";
  selectedStatusForUpdate = new FormControl("");
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;
  description: string = "";
  title:any='';
  constructor(
    public dialogRef: MatDialogRef<StatusDynamicDialogComponent>,
    private layoutUtilsService: LayoutUtilsService,
    private _service: WorkwizardChungService,
    private translate: TranslateService,
    private changeDetectorRefs: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private router: Router,

  ) { }
  id_template: number;
  ngOnInit() {
    if (this.data.isThem) {
      this.id_template = this.data.id_row;
    } else {
      this.id_template = this.data.item.id_group;
      this.description=this.data.item.description;
      this.title=this.data.item.title;
      if (this.data.item.id_row > 0) {
        this.ShowButton = false;
      }
    }
    if (this.data.item.color != undefined) {
      this.color_status = this.data.item.color
    }
    else {
      this.color_status = "#aaa";
    }
    this.changeDetectorRefs.detectChanges();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit(withBack: boolean = false) {
    const item = new StatusModel();
    item.clear();
    item.Id_row = this.data.item.id_row;
    item.StatusName = this.title;
    item.Color = this.color_status;

    item.Description = this.description;
    // item.id_template = this.id_template;
    item.CategoryID = this.id_template;
    // if(this.data.Follower==null)
    // {
    //   item.Follower=undefined;
    // }
    // else
    // item.Follower = this.data.Follower;
    // item.Type = "1";
    if (this.data.item.id_row > 0 && !this.data.isThem) {
      // item.CategoryType = 1 ;
      this.UpdateStatus(item);
    } else {
      item.Type = "2";
      this.InsertStatus(item, withBack);
    }
  }

  InsertStatus(item, withBack: boolean) {
    this._service.InsertStatusConfig(item).subscribe((res) => {
      if (res && res.status == 1) {
        // this.layoutUtilsService.showActionNotification(
        //   this.translate.instant("JeeWork.themthanhcong"),
        //   MessageType.Read,
        //   3000,
        //   true,
        //   false,
        //   3000,
        //   "top",
        //   1
        // );
        // this.dialogRef.close(true);


        if (withBack == true) {
          this.layoutUtilsService.showActionNotification(
            this.translate.instant("JeeWork.themthanhcong"),
            MessageType.Read,
            3000,
            true,
            false,
            3000,
            "top",
            1
          );
          this.dialogRef.close(true);
        } else {
          this.ClearData();
          this.ShowMessage();
        }

      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          "top",
          0
        );
      }
    });
  }
  UpdateStatus(item) {
    this._service.UpdateStatusConfig(item).subscribe((res) => {
      if (res && res.status == 1) {
        this.layoutUtilsService.showActionNotification(
          this.translate.instant("JeeWork.capnhatthanhcong"),
          MessageType.Read,
          3000,
          true,
          false,
          3000,
          "top",
          1
        );
        this.dialogRef.close(true);
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          "top",
          0
        );
      }
    });
  }

  getTitle() {
    if (this.data.statusname) {
      return this.translate.instant("JeeWork.chinhsua");
    }

    return this.translate.instant("JeeWork.themmoi");
  }

  ColorPickerStatus(val) {
    this.color_status = val;
  }
  listUser: any[];
  LoadListAccount() {
    const filter: any = {};
    filter.id_project_team = this.id_template;
    this._service.list_account(filter).subscribe((res) => {
      if (res && res.status === 1) {
        this.listUser = res.data;
        this.changeDetectorRefs.detectChanges();
        // this.setUpDropSearchNhanVien();
      }
    });
  }
  disabledBtn: boolean = false;
  ShowButton: boolean = true;
  goBack() {
    this.dialogRef.close(true);
  }
  ClearData() {
    this.title = "";
    this.description = "";
  }
  ShowMessage() {
    let saveMessageTranslateParam = '';
    saveMessageTranslateParam +=
      this.data.id_row > 0
        ? this.translate.instant('JeeWork.capnhatthanhcong')
        : this.translate.instant('JeeWork.themthanhcong');
    const _saveMessage = this.translate.instant(saveMessageTranslateParam);
    const _messageType = this.data.id_row > 0 ? MessageType.Update : MessageType.Create;
    this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
  }
  //=========================================================
  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    if (event.ctrlKey && event.keyCode == 13)//phím Enter
    {
      if (this.ShowButton == true) {
        this.onSubmit(false);
      }
      else {
        this.onSubmit(true);
      }

    }
  }
}
export class StatusModel extends BaseModel {
  Id_row: number;
  StatusName: string;
  Description: string;
  Type: string;
  Color: string;
  IsDefault: boolean;
  Position: number;
  CategoryID: number;
  CategoryType: number;
  id_status: number;

  Title: string;
  Id_project_team: number;
  id_department: number;
  id_template: number;
  id_group: number
  clear() {
    this.Id_row = 0;
    this.id_status = 0;
    this.StatusName = '';
    // this.Title = '';
    // this.Id_project_team = 0;
    // this.id_department = 0;
    // this.id_template = 0;
    this.Type = '2';
    this.Description = '';
    this.Color = '';
    this.IsDefault = true;
    this.Position = 0;

    this.CategoryID = 0;
    this.CategoryType = 0;

    this.IsDefault = false;
    this.id_group = 0;
  }
}
export interface IEdit {
  _isEditMode: boolean;
  _isNew: boolean;
  _isDeleted: boolean;
  _isUpdated: boolean;
  _prevState: any;
}
export interface IFilter {
  _defaultFieldName: string; // Field which should filtered first
}
export interface ILog {
  _userId: number; // user who did changes
  _createdDate: string; // date when entity were created => format: 'mm/dd/yyyy'
  _updatedDate: string; // date when changed were applied => format: 'mm/dd/yyyy'
}
