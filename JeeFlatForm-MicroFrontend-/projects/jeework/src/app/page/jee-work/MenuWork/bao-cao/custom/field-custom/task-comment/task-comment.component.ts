import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { LayoutUtilsService } from "projects/jeework/src/modules/crud/utils/layout-utils.service";
import { UpdateWorkModel } from "../../../../../models/JeeWorkModel";
import { ProjectsTeamService, WeWorkService } from "../../../services/jee-work.service";


@Component({
  selector: "app-task-comment",
  templateUrl: "./task-comment.component.html",
  styleUrls: ["./task-comment.component.scss"],
})
export class TaskCommentComponent implements OnInit {
  @Output() submit = new EventEmitter<any>();
  @Input() value = 0;
  @Input() id_row = 0;
  topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  //dùng cho update status sau khi comment (trường hợp có status nào có IsComment=1)
  @Input() task;
  @Input() status;
  @Input() checkhide=false;
  UserID = 0;
  //end 
  private readonly componentName: string = "kt-task_";
  showcomment = false;
  compopnent = "";
  constructor(private weworkService: WeWorkService,
    private layoutUtilsService: LayoutUtilsService,
    private projectsTeamService: ProjectsTeamService,) { }

  ngOnInit(): void {
    if(this.checkhide){
      this.showcomment=true;
    }
    if(this.task){
    }
    if(this.status){
    }
    this.compopnent = this.componentName + this.id_row;
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
    if (this.task && this.status) {
      this.UpdateStatus_BeforComment(this.task, this.status)
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

}
