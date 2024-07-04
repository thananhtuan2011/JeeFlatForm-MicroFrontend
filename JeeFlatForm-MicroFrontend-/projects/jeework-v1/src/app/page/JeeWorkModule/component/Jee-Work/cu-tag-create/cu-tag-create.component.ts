import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TagsModel } from '../jee-work.model';
import { TagsService } from '../jee-work.servide';
import { LayoutUtilsService, MessageType } from 'projects/jeework-v1/src/modules/crud/utils/layout-utils.service';

@Component({
  selector: 'kt-cu-tag-create',
  templateUrl: './cu-tag-create.component.html',
  styleUrls: ['./cu-tag-create.component.scss']
})
export class CuTagCreateComponent implements OnInit {

  @Input() node: any = [];
  @Input() tag: any = [];
  @Input() role: boolean = true;
  @Input() detail: boolean = false;
  @Output() RemoveTag = new EventEmitter<any>();
  @Output() loadData = new EventEmitter<any>();
  isRename = false;
  colorbg = "rgb(128, 0, 0)";
  constructor(
    private _service: TagsService,
    private layoutUtilsService: LayoutUtilsService,
  ) { }

  ngOnInit() {
  }

  Opaciti_color(color) {
    if (!color) {
      color = 'rgb(0,0,0)';
    }
    var result = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
    return result;
  }

  RemoveTags(event) {
    this.RemoveTag.emit(event);
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
    this._service.Insert(_item).subscribe(res => {
      if (res && res.status === 1) {
        this.layoutUtilsService.showActionNotification('add success')
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
      }
    });
  }

}
