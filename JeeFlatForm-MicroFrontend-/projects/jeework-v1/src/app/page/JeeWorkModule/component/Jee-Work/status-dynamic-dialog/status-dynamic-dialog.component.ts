import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormControl } from "@angular/forms";
import { Component, OnInit, Inject, ChangeDetectorRef } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { ProjectsTeamService, WeWorkService } from "../jee-work.servide";
import { StatusDynamicModel } from "../jee-work.model";
import { LayoutUtilsService, MessageType } from 'projects/jeework-v1/src/modules/crud/utils/layout-utils.service';

@Component({
  selector: "kt-status-dynamic-dialog",
  templateUrl: "./status-dynamic-dialog.component.html",
  styleUrls: ["./status-dynamic-dialog.component.scss"],
})
export class StatusDynamicDialogComponent implements OnInit {
  color_status: string = "";
  selectedStatusForUpdate = new FormControl("");
  viewLoading: boolean = false;
  loadingAfterSubmit: boolean = false;
  description: string = "";
  constructor(
    public dialogRef: MatDialogRef<StatusDynamicDialogComponent>,
    private layoutUtilsService: LayoutUtilsService,
    private _service: ProjectsTeamService,
    private translate: TranslateService,
    private WeWorkService: WeWorkService,
    private changeDetectorRefs: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.color_status = this.data.color ? this.data.color : "#aaa";
    this.LoadListAccount();
    if (this.data.Follower) {
      this.data.Follower = this.data.Follower.toString();
    }
    this.changeDetectorRefs.detectChanges();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSubmit() {
    const item = new StatusDynamicModel();
    item.clear();
    item.Id_row = this.data.id_row;
    item.StatusName = this.data.statusname;
    item.Color = this.color_status;

    item.Description = this.data.description;
    item.Id_project_team = this.data.id_project_team;
    item.Follower = this.data.Follower;
    // item.Type = "1";
    if (item.Id_row > 0) {
      this.UpdateStatus(item);
    } else {
      item.Type = "2";
      this.InsertStatus(item);
    }
  }

  InsertStatus(item) {
    this._service.InsertStatus(item).subscribe((res) => {
      if (res && res.status == 1) {
        this.layoutUtilsService.showActionNotification(
          this.translate.instant("landingpagekey.themthanhcong"),
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
  UpdateStatus(item) {
    this._service.UpdateStatus(item).subscribe((res) => {
      if (res && res.status == 1) {
        this.layoutUtilsService.showActionNotification(
          this.translate.instant("landingpagekey.capnhatthanhcong"),
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
      return this.translate.instant("landingpagekey.chinhsua");
    }

    return this.translate.instant("landingpagekey.themmoi");
  }

  ColorPickerStatus(val) {
    this.color_status = val;
  }
  listUser: any[];
  LoadListAccount() {
    const filter: any = {};
    filter.id_project_team = this.data.id_project_team;
    this.WeWorkService.list_account(filter).subscribe((res) => {
      if (res && res.status === 1) {
        this.listUser = res.data;
        this.changeDetectorRefs.detectChanges();
        // this.setUpDropSearchNhanVien();
      }
    });
  }
}
