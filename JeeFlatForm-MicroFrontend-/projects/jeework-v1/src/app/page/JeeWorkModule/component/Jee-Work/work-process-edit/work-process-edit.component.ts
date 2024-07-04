import { TranslateService } from "@ngx-translate/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Component, OnInit, ChangeDetectorRef, Inject } from "@angular/core";
import { WeWorkService, WorkService } from "../jee-work.servide";
import { LayoutUtilsService, MessageType } from "projects/jeework-v1/src/modules/crud/utils/layout-utils.service";
@Component({
  selector: "app-work-process-edit",
  templateUrl: "./work-process-edit.component.html",
  styleUrls: ["./work-process-edit.component.scss"],
})
export class WorkProcessEditComponent implements OnInit {
  viewLoading = false;
  listUser: any = [];
  Process: any = [];
  constructor(
    public dialogRef: MatDialogRef<WorkProcessEditComponent>,
    private layoutUtilsService: LayoutUtilsService,
    private _service: WorkService,
    private WeWorkService: WeWorkService,
    private changeDetectorRefs: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    // Process
    this.LoadListAccount();
  }
  getTitle() {
    return "Chỉnh sửa người theo dõi công việc";
  }

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
  UpdateWorkProcess(Item) {
    //update-work-process
    // this.layoutUtilsService.showWaitingDiv();
    this._service.UpdateWorkProcess(Item).subscribe((res) => {
      // this.layoutUtilsService.OffWaitingDiv();
      if (res && res.status === 1) {
      } else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
      }
    });
  }
  LuuItem(item) {
    const Item = new WorkProcessModel(
      item.id_row,
      this.data.id_project_team,
      item.statusid,
      item.workid,
      item.checker,
      item.change_note
    );
    this.UpdateWorkProcess(Item);
  }
}

/*
public class WorkProcessModel
    {
        public long id_row { get; set; }
        public long id_project_team { get; set; }
        public long statusid { get; set; }
        public long workid { get; set; }
        public string checker { get; set; }
        public string change_note { get; set; }
    }
*/

export class WorkProcessModel {
  id_row: number;
  id_project_team: number;
  statusid: number;
  workid: number;
  checker: string;
  change_note: string;
  constructor(
    id_row: number,
    id_project_team: number,
    statusid: number,
    workid: number,
    checker: string,
    change_note: string
  ) {
    this.id_row = id_row;
    this.id_project_team = id_project_team;
    this.statusid = statusid;
    this.workid = workid;
    this.checker = checker ? checker : '';
    this.change_note = change_note ? change_note : '';
  }
}
