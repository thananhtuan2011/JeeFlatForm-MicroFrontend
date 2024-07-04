import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { TagsModel } from '../../_models/listtag-management.model'; 
import { TicketTagsModel } from '../../_models/ticket-tags-management.model';
import { TagsManagementService } from '../../_services/listtag-management.service';
import { TicketTagsManagementService } from '../../_services/ticket-tags-management.service';
import { LayoutUtilsService, MessageType } from 'projects/jeeticket/src/app/modules/crud/utils/layout-utils.service';
@Component({
  selector: 'kt-cu-tag-detail-ticket',
  templateUrl: './cu-tag-detail-ticket.component.html',
  styleUrls: ['./cu-tag-detail-ticket.component.scss']
})
export class CuTagDetailTicketComponent implements OnInit {

    @Input() no_update:boolean=true;
    @Input() node: any = [];
    @Input() tag: any = [];
    @Input() role: boolean = true;
    @Input() detail: boolean = false;
    @Output() RemoveTag = new EventEmitter<any>();
    @Output() loadData = new EventEmitter<any>();
    isRename = false;
    colorbg = "rgb(128, 0, 0)";
    constructor(
      //private WorkService: WorkService,
      //private _service: TagsService,
      private layoutUtilsService: LayoutUtilsService,
      public tagsManagementService: TagsManagementService,
      public ticketTagService: TicketTagsManagementService,
      private changeDetectorRefs: ChangeDetectorRef,
    ) { }
    model: TicketTagsModel;
    ngOnInit() {
      // this.colorbg = this.Opaciti_color(this.color)
  
    }
  
    Opaciti_color(color) {
      if (!color) {
        color = 'rgb(0,0,0)';
      }
      var result = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
      return result;
    }
  
    RemoveTags() {
      this.model = new TicketTagsModel();
      this.model.TicketID = this.node.id_row;
      this.model.TagID = this.tag.id_row;
      // this.layoutUtilsService.showWaitingDiv();
      this.ticketTagService.UpdateTicketTags(this.model).subscribe((res) => {
        // this.layoutUtilsService.OffWaitingDiv();
        if (res && res.statusCode == 1) {
          this.RemoveTag.emit(true);
          this.changeDetectorRefs.detectChanges();
          
          //this.layoutUtilsService.showActionNotification(this.translate.instant('work.dachon'), MessageType.Read, 1000, false, false, 3000, 'top', 1);
        } else {
          this.layoutUtilsService.showActionNotification(
            res.error.message,
            MessageType.Read,
            9999999999,
            true,
            false,
            3000,
            "top",
            0
          );
        }
      });
    }
  
    Rename() {
      this.isRename = true;
      // var result = document.getElementById('renameText');
      // result.focus();
      var idname = "renameText" + this.tag.id_row + this.node.id_row + (this.detail ? '1' : '0');
      let ele = (<HTMLInputElement>document.getElementById(idname));
      ele.value = this.tag.title;
      setTimeout(() => {
        ele.focus();
      }, 10);
    }
  
    prepare(): TagsModel {
      const item = new TagsModel();
      item.RowID = this.tag.id_row;
      item.Tag =this.tag.title;
      item.Color = this.tag.color;
      // item.id_project_team = this.node.id_project_team;
      // item.title = this.tag.title;
      // item.color = this.tag.color;
      return item;
    }
  
    checkUpdate() {
      var idname = "renameText" + this.tag.id_row + this.node.id_row + (this.detail ? '1' : '0');
     
      let ele = (<HTMLInputElement>document.getElementById(idname));
      if (ele.value.trim() == this.tag.title.trim() || ele.value == "") {
        this.isRename = false;
        return;
      }
      this.isRename = false;
      this.tag.title = ele.value;
      this.onSubmit();
    }
  
    onSubmit(withBack: boolean = false) {
      const modelUpdate = this.prepare();
      // if (updatedegree.RowID > 0) {
      //   this.Update(updatedegree, withBack);
      // } else {
      //   this.Create(updatedegree, withBack);
      // }
      this.Update(modelUpdate, withBack);
    }
  
    ColorPickerStatus(val) {
      this.tag.color = val;
      this.onSubmit();
    }
  
    Update(_item: TagsModel, withBack: boolean) {
      this.tagsManagementService.UpdateTags(_item).subscribe(res => {

        if (res && res.statusCode === 1) {
          this.loadData.emit(true);
          this.RemoveTag.emit(true);
        }
        else {
          this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Update, 9999999999, true, false, 3000, 'top', 0);
        }
      });
    }
    getColorText(_color) {
      if (_color == '#848E9E') {
        return 'white';
      }
      else return _color;
    }
    getbackgroundColor(_color) {
      if (_color == 'rgb(132, 142, 158)') {
        return '#B5BBC0';
      }
      else return _color;
    }
    Create(_item: TagsModel, withBack: boolean) {
      // this._service.Insert(_item).subscribe(res => {
      //   if (res && res.status === 1) {
      //     this.layoutUtilsService.showActionNotification('add success')
      //   }
      //   else {
      //     this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
      //   }
      // });
    
    }
  
  }
  