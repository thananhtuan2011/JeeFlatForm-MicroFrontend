import { Component, OnInit, Output, Input, EventEmitter, OnDestroy } from "@angular/core";

import { BehaviorSubject, Subscription } from "rxjs";
import { LayoutUtilsService } from "src/app/modules/crud/utils/layout-utils.service";
// import { UpdateWorkModel } from "../../../component/Jee-Work/jee-work.model";
import { JeeCommentService } from "../../JeeCommentModule/jee-comment/jee-comment.service";
import { DanhMucChungService } from "../../services/danhmuc.service";


@Component({
  selector: "app-task-comment",
  templateUrl: "./task-comment.component.html",
  styleUrls: ["./task-comment.component.scss"],
})
export class TaskCommentComponent implements OnInit, OnDestroy {
  @Output() submit = new EventEmitter<any>();
  @Input() value = 0;
  @Input() id_row = 0;
  objectid: string;
  topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  //dùng cho update status sau khi comment (trường hợp có status nào có IsComment=1)
  @Input() task;
  private subscriptions: Subscription[] = [];
  @Input() status;
  @Input() checkhide = false;
  UserID = 0;
  //end 
  private readonly componentName: string = "kt-task_";
  showcomment = false;
  compopnent = "";
  isSendComment: false;
  //==============================================================
  @Input() isviewcomment: boolean = true;
  @Input() iscomment: boolean = true;
  constructor(private weworkService: JeeCommentService,
    private layoutUtilsService: LayoutUtilsService,
    private projectsTeamService: DanhMucChungService,) { }
  ngOnDestroy(): void {
    if (this.subscriptions) {
      this.subscriptions.forEach(element => {
        element.unsubscribe()
      });
    }
  }

  ngOnInit(): void {
    if (this.checkhide) {
      this.showcomment = true;
    }
    this.compopnent = this.componentName + this.id_row;
    this.LoadObjectID();
    this.EventCount();
  }
  EventCount() {
    const sb = this.weworkService._countComment$.subscribe(res => {
      if (res != null && res.Id == this.objectid) {

        this.value = res.Comments.length;

      }
    })
    this.subscriptions.push(sb)
  }

  LoadObjectID() {
    this.topicObjectID$.next("");
    if (this.compopnent) {
      this.weworkService
        .getTopicObjectIDByComponentName(this.compopnent)
        .subscribe((res) => {
          this.objectid = res;
          this.topicObjectID$.next(res);
        });
    }
  }

  ChangComment(val) {
    this.submit.emit(val);
    if (val != "delete") {
      this.value++;

    }
    else {
      if (this.value > 0) {
        this.value--;
        console.log("thjiss", this.value)
      }
      else {
        this.value = 0;
      }


    }
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
