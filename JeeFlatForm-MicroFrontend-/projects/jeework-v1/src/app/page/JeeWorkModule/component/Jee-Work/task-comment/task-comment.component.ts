import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { WeWorkService } from "../jee-work.servide";
import { HttpUtilsService } from "projects/jeework-v1/src/modules/crud/utils/http-utils.service";


@Component({
  selector: "app-task-comment-v1",
  templateUrl: "./task-comment.component.html",
  styleUrls: ["./task-comment.component.scss"],
})
export class TaskCommentWorkV1Component implements OnInit {
  @Output() submit = new EventEmitter<any>();
  @Input() value = 0;
  @Input() id_row = 0;
  topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  //dùng cho update status sau khi comment (trường hợp có status nào có IsComment=1)
  @Input() task;
  @Input() status;
  @Input() checkhide = false;
  UserID = 0;
  //end 
  private readonly componentName: string = "kt-task_";
  showcomment = false;
  compopnent = "";
  isSendComment: false;
  UserCurrent_lib: string = '';
  constructor(private weworkService: WeWorkService,
    private httpUtils: HttpUtilsService,) {
    this.UserCurrent_lib = this.httpUtils.getUsername();
  }

  ngOnInit(): void {
    if (this.checkhide) {
      this.showcomment = true;
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

  NotifyComent(event) {
    this.submit.emit(event);
    const objSave: any = {};
    objSave.comment = event.Text ? event.Text : 'has comment';
    objSave.id_parent = 0;
    objSave.object_type = 0;
    objSave.object_id_new = event.TopicCommentID;
    this.Luulogcomment(objSave);
  }

  Luulogcomment(model) {
    this.weworkService.LuuLogcomment(model)
      .subscribe(() => {
      });
  }
}
