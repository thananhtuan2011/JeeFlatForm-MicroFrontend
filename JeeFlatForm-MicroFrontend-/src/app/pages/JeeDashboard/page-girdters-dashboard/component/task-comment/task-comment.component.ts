import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";

import { BehaviorSubject } from "rxjs";
import { JeeCommentService } from "src/app/pages/JeeCommentModule/jee-comment/jee-comment.service";


@Component({
  selector: "app-task-comment",
  templateUrl: "./task-comment.component.html",
  styleUrls: ["./task-comment.component.scss"],
})
export class TaskCommentDashboardComponent implements OnInit {
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
  isSendComment:false;
  //==============================================================
  @Input() isviewcomment: boolean = true;
  @Input() iscomment: boolean = true;
  constructor(private _JeeCommentService: JeeCommentService,) { }

  ngOnInit(): void {
    if(this.checkhide){
      this.showcomment=true;
    }
    this.compopnent = this.componentName + this.id_row;
    this.LoadObjectID();
  }

  LoadObjectID() {
    this.topicObjectID$.next("");
    if (this.compopnent) {
      this._JeeCommentService
        .getTopicObjectIDByComponentName(this.compopnent)
        .subscribe((res) => {
          this.topicObjectID$.next(res);
        });
    }
  } 

  ChangComment(val) {
    this.submit.emit(val);
  }
  // UpdateStatus_BeforComment(task, status) {
  //   if (+task.status == +status) {

  //     return;
  //   }
  //   this.UpdateByKeyNew(task, "status", status);
  // }
  // UpdateByKeyNew(task, key, value) {

  //   const item = new UpdateWorkModel();
  //   item.id_row = task.id_row;
  //   item.key = key;
  //   item.value = value;
  //   if (task.assign && task.assign.id_nv > 0) {
  //     item.IsStaff = true;
  //   }
  //   this.projectsTeamService.updateTask(item).subscribe(res=>{
  //     if(!res && res.status!=1){
  //       this.layoutUtilsService.showError(res.error.message);
  //     }
  //     })
  // }

}
