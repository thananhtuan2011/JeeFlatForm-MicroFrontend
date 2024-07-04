import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LayoutUtilsService } from 'projects/jeeteam/src/modules/crud/utils/layout-utils.service';
import { TopicService } from '../services/topic.service';
import { JeeTeamService } from '../services/jeeteam.service';

@Component({
  selector: 'app-load-comment',
  templateUrl: './load-comment.component.html',
  styleUrls: ['./load-comment.component.scss']
})
export class LoadCommentComponent implements OnInit {
  userCurrent: string;
  appCode = "TEAM"
  listreaction: any[] = []
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<LoadCommentComponent>,
    private layoutUtilsService: LayoutUtilsService,
    private dashboar_service: JeeTeamService,
    private changeDetectorRefs: ChangeDetectorRef,
    private topic_service: TopicService,) {
    const dt = this.dashboar_service.getAuthFromLocalStorage();
    this.userCurrent = dt.user.username;
  }

  ngOnInit(): void {

  }
  goBack() {
    this.dialogRef.close()
  }
  reverseString(item) {
    let dt = item.split(" ")
    return dt[dt.length - 1];
  }
  ShowMode(id: number) {
    this.data.showMore = false;
    this.changeDetectorRefs.detectChanges();
  }
  toggleWithGreeting(idtopic: number, type: number) {


    this.topic_service.GetUserReaction(idtopic, type).subscribe
      (res => {
        this.listreaction = res.data;

        this.changeDetectorRefs.detectChanges();
      })

  }

}
