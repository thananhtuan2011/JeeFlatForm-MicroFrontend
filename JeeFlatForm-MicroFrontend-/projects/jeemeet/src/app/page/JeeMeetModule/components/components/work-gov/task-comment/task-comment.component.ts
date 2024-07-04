import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";

import { BehaviorSubject } from "rxjs";
import { DanhMucChungService } from "../services/danhmuc.service";
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { JeeCommentService } from "projects/jeemeet/src/app/page/JeeCommentModule/jee-comment/jee-comment.service";


@Component({
  selector: "app-task-comment",
  templateUrl: "./task-comment.component.html",
  styleUrls: ["./task-comment.component.scss"],
})
export class TaskCommentComponent implements OnInit {
  // eslint-disable-next-line @angular-eslint/no-output-native
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
  constructor(private weworkService: JeeCommentService,
    private layoutUtilsService: LayoutUtilsService,
    private projectsTeamService: DanhMucChungService,) { }

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
      this.weworkService
        .getTopicObjectIDByComponentName(this.compopnent)
        .subscribe((res) => {
          this.topicObjectID$.next(res);
        });
    }
  }

  ChangComment(val) {
    this.submit.emit(val);
    this.value++;
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
