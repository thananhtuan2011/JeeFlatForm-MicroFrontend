import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { WorkGeneralService } from '../../Services/work-general.services';
import { TagsModel } from '../../Model/work-general.model';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
@Component({
  selector: 'kt-cu-tag-v2',
  templateUrl: './v2-cu-tag.component.html',
  styleUrls: ['./v2-cu-tag.component.scss']
})
export class CuTagV2Component implements OnInit {

  @Input() node: any = [];
  @Input() tag: any = [];
  @Input() Rule: boolean = true;
  @Input() detail: boolean = false;
  @Output() RemoveTag = new EventEmitter<any>();
  @Output() loadData = new EventEmitter<any>();
  isRename = false;
  colorbg = "rgb(128, 0, 0)";
  constructor(
    private _WorkGeneralService: WorkGeneralService,
    private layoutUtilsService: LayoutUtilsService,
  ) { }

  ngOnInit() {
    // this.colorbg = this.Opaciti_color(this.color)
  }

  Opaciti_color(color) {
    if (!color) {
      color = 'rgb(0,0,0)';
    }
    if (!color.includes('rgb')) {
      var r=this.hexToRgbA(color);
      return r;
    }
    var result = color.replace(')', ', 0.2)').replace('rgb', 'rgba');
    return result;
  }

  hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',0.2)';
    }
  }

  RemoveTags() {
    this.RemoveTag.emit(true);
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
    item.id_row = this.tag.id_row;
    item.id_project_team = this.node.id_project_team;
    item.title = this.tag.title;
    item.color = this.tag.color;
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

    const updatedegree = this.prepare();
    if (updatedegree.id_row > 0) {
      this.Update(updatedegree, withBack);
    } else {
      this.Create(updatedegree, withBack);
    }
  }

  ColorPickerStatus(val) {
    this.tag.color = val;
    this.onSubmit();
  }

  Update(_item: TagsModel, withBack: boolean) {
    this._WorkGeneralService.Update(_item).subscribe(res => {
      if (res && res.status === 1) {
        this.loadData.emit(true);
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
    this._WorkGeneralService.Insert(_item).subscribe(res => {
      if (res && res.status === 1) {
        this.layoutUtilsService.showActionNotification('add success')
      }
      else {
        this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
      }
    });
  }

}
