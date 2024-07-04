import { Component, OnInit, Output, Input, EventEmitter } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { JeeWorkLiteService } from "../../widgets/WorkV1/services/wework.services";
import { AuthService } from "src/app/modules/auth/services/auth.service";


@Component({
  selector: "app-task-comment-v1",
  templateUrl: "./task-comment-v1.component.html",
  styleUrls: ["./task-comment-v1.component.scss"],
})
export class TaskCommentDashboardV1Component implements OnInit {
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
  constructor(private _JeeWorkLiteService: JeeWorkLiteService,
    private _AuthService: AuthService) {
    this.UserCurrent_lib = this._AuthService.getUsername();
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
      this._JeeWorkLiteService
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
    this._JeeWorkLiteService.LuuLogcomment(model)
      .subscribe(() => {
      });
  }
}
