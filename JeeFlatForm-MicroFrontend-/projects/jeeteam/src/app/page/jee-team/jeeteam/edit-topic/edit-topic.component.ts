import { TopicService } from './../services/topic.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tinyMCE_MT } from '../tinyMCE-MT';
import { TopicModel } from '../model/topic';
import { quillConfig } from '../Quill_config';

@Component({
  selector: 'app-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.scss']
})
export class EditTopicComponent implements OnInit {
  content: string;
  public quillConfig: {};
  public editorStyles1 = {
    'min-height': '120px',
    // 'max-height': '400px',
    'border-radius': '5px',
    'border': '2px solid #ece5e5',
    'height': '100%',
    'font-size': '12pt',
    'overflow-y': 'auto',
  };
  isprivate: boolean;
  id: number;
  tinyMCE = {};
  constructor(private dialogRef: MatDialogRef<EditTopicComponent>,
    private topicServic: TopicService,
    @Inject(MAT_DIALOG_DATA) public data: any) { this.tinyMCE = tinyMCE_MT; }

  ngOnInit(): void {
    this.quillConfig = quillConfig;
    this.content = this.data.it.NoiDung;
    if (this.data.chanel.idchildmenu) {
      this.isprivate = true;
      this.id = this.data.chanel.idchildmenu;
    }
    else {
      this.isprivate = false;
      this.id = this.data.chanel.id;
    }
  }
  CloseDia(data = undefined) {
    this.dialogRef.close(data);
  }
  closeDilog() {
    this.dialogRef.close();
  }
  ItemTopic(): TopicModel {

    const item = new TopicModel();


    item.NoiDung = this.content;
    item.RowIdSub = this.id
    item.IsPrivate = this.isprivate
    // item.UserName=this.userCurrent;
    // item.IdGroup=idGroup;

    return item;
  }
  Submit() {

    let item = this.ItemTopic()
    this.topicServic.UpdateTopic(this.data.it.Id_Topic, item).subscribe(res => {
      if (res && res.status === 1) {
        this.CloseDia(res.data);
      }
    })
  }
  DeleteText() {
    this.content = "";

  }
}
