import { Component, OnInit, Output, Input, EventEmitter, Inject } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BehaviorSubject } from "rxjs";
import { LayoutUtilsService } from "projects/jeework/src/modules/crud/utils/layout-utils.service";
import { UpdateWorkModel } from "../../../panel-dashboard/Model/jee-work.model";
import { ProjectsTeamService, WeWorkService } from "../../services/jee-work.service";

@Component({
  selector: 'app-comment-task-update-status',
  templateUrl: './comment-task-update-status.component.html',
  styleUrls: ['./comment-task-update-status.component.scss']
})
export class CommentTaskUpdateStatusComponent implements OnInit {

  @Output() submit = new EventEmitter<any>();
  topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  //dùng cho update status sau khi comment (trường hợp có status nào có IsComment=1)
  //end 
  item:any;
  private readonly componentName: string = "kt-task_";
  showcomment = false;
  compopnent = "";
  constructor(
    public dialogRef: MatDialogRef<CommentTaskUpdateStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialog,
    private weworkService: WeWorkService,
    private layoutUtilsService: LayoutUtilsService,
    private projectsTeamService: ProjectsTeamService,) { }

  ngOnInit(): void {
    this.item=this.data.task;
    if(this.data.checkhide){
      this.showcomment=true;
    }
    this.compopnent = this.componentName + this.item.id_row;
    this.LoadObjectID();
  }

  LoadObjectID() {
    this.topicObjectID$.next("");
    if (this.compopnent) {
      this.weworkService
        .getTopicObjectIDByComponentName(this.compopnent)
        .subscribe((res) => {
          this.topicObjectID$.next(res);
        });
    }
  } 

  ChangComment() {
    if (this.data.task && this.data.status) {
      this.UpdateStatus_BeforComment(this.data.task, this.data.status)
    }
  }
  UpdateStatus_BeforComment(task, status) {
    if (+task.status == +status) {

      return;
    }
    this.UpdateByKeyNew(task, "status", status);
  }
  UpdateByKeyNew(task, key, value) {

    const item = new UpdateWorkModel();
    item.id_row = task.id_row;
    item.key = key;
    item.value = value;
    if (task.assign && task.assign.id_nv > 0) {
      item.IsStaff = true;
    }
    this.projectsTeamService._UpdateByKey(item).subscribe(res=>{
      if(!res && res.status!=1){
        this.layoutUtilsService.showError(res.error.message);
      }
      })
  }
  close() {
    this.dialog.closeAll();
}
}
