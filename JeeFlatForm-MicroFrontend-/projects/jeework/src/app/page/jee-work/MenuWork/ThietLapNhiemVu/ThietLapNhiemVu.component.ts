import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { MatAccordion } from '@angular/material/expansion';
import { ThemePalette } from '@angular/material/core';
import { ListPositionModelBasic, MenuModel, PositionModelBasic } from './model/ThietLapNhiemVu.model';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { ThietLapThe } from '../ThietLapThe/ThietLapThe.component';
@Component({
  selector: 'thiet-lap-nhiem-vu',
  templateUrl: './ThietLapNhiemVu.component.html',
  styleUrls: ['./ThietLapNhiemVu.component.scss']
})
export class ThietLapNhiemVuComponent implements OnInit {
  listDropDown: any;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public DanhMucChungService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialogRef: MatDialogRef<ThietLapNhiemVuComponent>,
    private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog,
  ) {
    this.filterID = this.data.filterID;
    this.landkey = this.data.landkey;
    this.id_priority = this.data.id_priority;
  }
  color_accent: ThemePalette = 'accent';
  color_warn: ThemePalette = 'warn';
  color_primary: ThemePalette = 'primary';
  checked = false;
  disabled = false;
  _dataConfig: MenuModel[] = [];
  _data: any = [];
  showFiller = false;
  isUpdate: boolean = false;
  _isThietLapTrangChu: boolean = false;
  _dataDashboard = [
    {
      id_priority: -1,
      loainhiemvu: 'Nhắc nhở nhiệm vụ đã giao',
      langkey: 'nhacnhonhiemvudagiao',
      isHidden: false
    },
    {
      id_priority: -2,
      loainhiemvu: 'Nhắc nhở nhiệm vụ được giao',
      langkey: 'nhacnhonhiemvuduocgiao',
      isHidden: false
    },
    {
      id_priority: -3,
      loainhiemvu: 'Nhắc nhở nhiệm vụ đã tạo',
      langkey: 'nhacnhonhiemvudatao',
      isHidden: false
    }
  ]
  lstLoaiTrangThai: any = []
  lstTagConfigByUser: any = []
  id_priority: any;
  landkey: string;
  filterID: any;
  link: any;
  rowid: any;
  idmenu: any;
  ngOnInit(): void {
    this.link = window.location.href.split('/');
    if (this.link.length == 9) {
      this.idmenu = this.link[5];
      this.rowid = this.link[8];
    }
    this.getConfig();
  }
  getConfig() {
    this._dataDashboard.forEach((ele) => {
      ele.isHidden = localStorage.getItem(ele.langkey) == 'true' ? false : true;
    })
    this.DanhMucChungService.getConfigMenu().subscribe((res) => {
      if (res.status == 1) {
        let stt = 1;
        res.data.forEach(element => {
          element.Position = stt;
          stt++;
        });
        this._data = res.data;
        this._task = this._data[0];
        this.changeDetectorRefs.detectChanges();
      }
    })
    this.DanhMucChungService.getListStatusType().subscribe(res => {
      if (res.status == 1) {
        this.lstLoaiTrangThai = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
    this.LoadTag();
  }
  LoadTag(){
    this.DanhMucChungService.ListTagAll().subscribe(res => {
      if (res.status == 1) {
        this.lstTagConfigByUser = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    })
  }

  showType() {
    if (this._task.langkey == "nhiemvudagiao" || this._task.langkey == "nhiemvuduocgiao"
      || this._task.langkey == "nhiemvudatao" || this._task.langkey == "nhiemvutheodoi"
      || this._task.langkey == "nhiemvuthamgia" || this._task.langkey == "nhiemvucuadonvi" || this._task.langkey == "nhiemvucuatoi")
      return true;
    return false;
  }

  listType(value) {
    if (value == null) return '';
    return value.split(',');
  }

  listType2(value) {
    var find = this._task.Filter_StatusTags.find(x => x.Id == value.toString());
    if (find != null) {
      return this.listType(find.Value);
    }
    return '';
  }

  _task: any = {}
  selectNhiemVu(val, isThietLapTrangChu: boolean = false) {
    debugger
    this._isThietLapTrangChu = isThietLapTrangChu;
    this._task = val;
  }

  selectTrangThai(event, index) {
    let value = event.toString();
    let ind = this._data.findIndex(x => x.id_priority == this._task.id_priority);
    switch (index) {
      case 0: {
        this._data[ind].Filter_StatusTypeID0 = value;
        break;
      }
      case 1: {
        this._data[ind].Filter_StatusTypeID1 = value;
        break;
      }
      case 2: {
        this._data[ind].Filter_StatusTypeID2 = value;
        break;
      }
      case 3: {
        this._data[ind].Filter_StatusTypeID3 = value;
        break;
      }
      case 4: {
        this._data[ind].Filter_StatusTypeID4 = value;
        break;
      }
      case 5: {
        this._data[ind].Filter_StatusTypeID5 = value;
        break;
      }
      case 6: {
        this._data[ind].Filter_StatusTypeID6 = value;
        break;
      }
      case 7: {
        this._data[ind].Filter_StatusTypeID7 = value;
        break;
      }
      case 8: {
        this._data[ind].Filter_StatusTypeID8 = value;
        break;
      }
    }
  }

  selectTrangThai2(event, id_tag) {
    let value = event.toString();
    let ind = this._data.findIndex(x => x.id_priority == this._task.id_priority);
    var idx = this._data[ind].Filter_StatusTags.findIndex(x => x.Id == id_tag.toString());
    if (idx > -1) {
      this._data[ind].Filter_StatusTags[idx].Value = value
    }
    else { //chưa có
      let tagg = {
        Id: id_tag.toString(),
        Value: value
      }
      this._data[ind].Filter_StatusTags.push(tagg);
    }
  }

  chageOption(index) {
    let ind = this._data.findIndex(x => x.id_priority == this._task.id_priority);
    switch (index) {
      case 0: {
        this._task.FilterID0 = !this._task.FilterID0;
        this._data[ind].FilterID0 = this._task.FilterID0;
        if (!this._task.FilterID0)
          this._data[ind].Filter_StatusTypeID0 = null
        break;
      }
      case 1: {
        this._task.FilterID1 = !this._task.FilterID1;
        this._data[ind].FilterID1 = this._task.FilterID1;
        if (!this._task.FilterID1)
          this._data[ind].Filter_StatusTypeID1 = null
        break;
      }
      case 2: {
        this._task.FilterID2 = !this._task.FilterID2;
        this._data[ind].FilterID2 = this._task.FilterID2;
        if (!this._task.FilterID2)
          this._data[ind].Filter_StatusTypeID2 = null
        break;
      }
      case 3: {
        this._task.FilterID3 = !this._task.FilterID3;
        this._data[ind].FilterID3 = this._task.FilterID3;
        if (!this._task.FilterID3)
          this._data[ind].Filter_StatusTypeID3 = null
        break;
      }
      case 4: {
        this._task.FilterID4 = !this._task.FilterID4;
        this._data[ind].FilterID4 = this._task.FilterID4;
        if (!this._task.FilterID4)
          this._data[ind].Filter_StatusTypeID4 = null
        break;
      }
      case 5: {
        this._task.FilterID5 = !this._task.FilterID5;
        this._data[ind].FilterID5 = this._task.FilterID5;
        if (!this._task.FilterID5)
          this._data[ind].Filter_StatusTypeID5 = null
        break;
      }
      case 6: {
        this._task.FilterID6 = !this._task.FilterID6;
        this._data[ind].FilterID6 = this._task.FilterID6;
        if (!this._task.FilterID6)
          this._data[ind].Filter_StatusTypeID6 = null
        break;
      }
      case 7: {
        this._task.FilterID7 = !this._task.FilterID7;
        this._data[ind].FilterID7 = this._task.FilterID7;
        if (!this._task.FilterID7)
          this._data[ind].Filter_StatusTypeID7 = null
        break;
      }
      case 8: {
        this._task.FilterID8 = !this._task.FilterID8;
        this._data[ind].FilterID8 = this._task.FilterID8;
        if (!this._task.FilterID8)
          this._data[ind].Filter_StatusTypeID8 = null
        break;
      }
    }
  }

  close() {
    if (this.isUpdate) {
      this.dialogRef.close(this.isUpdate);
    } else {
      this.dialogRef.close();
    }
  }
  getstatusname(rowid) {
    let lstStatus = "Trạng thái: ";
    let ind = this.lstLoaiTrangThai.findIndex(x => x.RowID == rowid)
    if (ind != undefined) {
      let count = this.lstLoaiTrangThai[ind].StatusList.length;
      if (count == undefined || count == 0) {
        return "";
      }
      else {
        for (let i = 0; i < count; i++) {
          if (i <= 0) {
            lstStatus += this.lstLoaiTrangThai[ind].StatusList[i].StatusName;
          }
          else {
            lstStatus += ', ' + this.lstLoaiTrangThai[ind].StatusList[i].StatusName;
          }
        }
        return lstStatus;
      }
    }
  }
  index: any;
  StatusSetting() {
    let ind;
    ind = this._data.findIndex(x => x.id_priority == this._task.id_priority);
    if (this.link.length > 8) {
      if (this._data[ind].Filter_StatusTags != undefined && this._data[ind].Filter_StatusTags!=null) {
        let ind2;
        ind2 = this._data[ind].Filter_StatusTags.findIndex(x => x.Id == this.rowid);
        if (ind2 != undefined && ind2 != -1) {
          localStorage.setItem('config_status', JSON.stringify(this._data[ind].Filter_StatusTags[ind2].Value));
        }
      }
    }
    else {
      if (ind != undefined && ind != -1) {
        switch (this.filterID) {
          case '5': { localStorage.setItem('config_status', JSON.stringify(this._data[ind].Filter_StatusTypeID0)); break; }
          case '0': { localStorage.setItem('config_status', JSON.stringify(this._data[ind].Filter_StatusTypeID1)); break; }
          case '1': { localStorage.setItem('config_status', JSON.stringify(this._data[ind].Filter_StatusTypeID2)); break; }
          case '2': { localStorage.setItem('config_status', JSON.stringify(this._data[ind].Filter_StatusTypeID3)); break; }
          case '3': { localStorage.setItem('config_status', JSON.stringify(this._data[ind].Filter_StatusTypeID4)); break; }
          case '4': { localStorage.setItem('config_status', JSON.stringify(this._data[ind].Filter_StatusTypeID5)); break; }
          case '-1': { localStorage.setItem('config_status', JSON.stringify(this._data[ind].Filter_StatusTypeID6)); break; }
          case '-2': { localStorage.setItem('config_status', JSON.stringify(this._data[ind].Filter_StatusTypeID7)); break; }
          case '-3': { localStorage.setItem('config_status', JSON.stringify(this._data[ind].Filter_StatusTypeID8)); break; }
        }
      }
    }
  }

  subMit() {
    this._dataDashboard.forEach((ele) => {
      localStorage.setItem(ele.langkey, String(!ele.isHidden));
    });
    this.StatusSetting();
    this.DanhMucChungService.updateConfigMenu(this._data).subscribe((res) => {
      if (res.status == 1) {
        this.isUpdate = true;
        this.layoutUtilsService.showActionNotification(
          "Thay đổi thiết lập thành công",
          MessageType.Update,
          10000,
          true,
          false
        );
        this.dialogRef.close({
          _item: this._data
        })
      }
    })
  }

  //======================================================================
  listSTT: any = [];
  dropList(event: CdkDragDrop<string[]>) {
    const previous = this._data[event.previousIndex];
    const curent = this._data[event.currentIndex];

    this.MoveItem2(curent, previous);

    var listModel = new ListPositionModelBasic();
    listModel.clear();
    this._data.forEach(item => {
      var model = new PositionModelBasic();
      model.clear();
      model.position = item.Position;
      model.id_row = item.id_row;
      listModel.data.push(model);
    });


    this.updateAllPosition(listModel);
  }

  MoveItem2(curent, previous) {
    //curent. vi tri bat dau keo chuot
    //previous: vi tri keo chuot xuong
    const position_from = previous.Position;
    const position_to = curent.Position;
    const indexcurent = this._data.findIndex(
      (x) => x.id_priority == curent.id_priority
    );
    const indexprevious = this._data.findIndex(
      (x) => x.id_priority == previous.id_priority
    );

    //Keo tu tren keo xuong
    if (position_to > position_from) {
      var length = position_to - position_from;
      length += indexprevious;
      var newPosition = this._data[indexprevious].Position;
      var keepPostition;
      for (var i = indexprevious; i < length; i++) {
        keepPostition = this._data[i + 1].Position;
        this._data[i + 1].Position = newPosition;
        newPosition = keepPostition;
        var c = this._data[i + 1].Position;
        this._data[i] = this._data[i + 1];
      }
      previous.Position = position_to;
      if (indexcurent >= 0) {
        this._data[indexcurent] = previous;
      }

    }
    //Keo tu duoi keo len
    else {
      var length = position_from - position_to;
      length += indexcurent;
      var keep1 = this._data[indexcurent];
      var keep2;
      for (var i = indexcurent; i < length; i++) {

        keep2 = this._data[i + 1];
        keep1.Position = this._data[i + 1].Position;
        this._data[i + 1] = keep1;
        keep1 = keep2;
      }
      previous.Position = position_to;
      if (indexcurent >= 0) {
        this._data[indexcurent] = previous;
      }

    }
  }

  updateAllPosition(_item) {

  }
  SettingTag(){
    const dialogRef = this.dialog.open(ThietLapThe, {
      disableClose: true,
      width: '60vw', height: '55vh', panelClass: ['pn-thietlap'],
      autoFocus:false,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      } else {
        this.LoadTag();
      }
    });
  }
}
