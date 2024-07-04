import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DanhMucChungService } from '../../services/danhmuc.service';

@Component({
  selector: 'app-tasks-group',
  templateUrl: './tasks-group.component.html',
  styleUrls: ['./tasks-group.component.scss']
})
export class TasksGroupComponent implements OnInit {

  @Input() ListGroup: any = [];
  @Input() viewdetail = false;
  @Input() value: any = [];
  @Output() valueChange = new EventEmitter<any>();
  @Input() role = false;
  @Input() role2 = false;  //Check quyền 21
  @Input() id_project_team: number = 0;
  constructor(public _DanhMucChungService: DanhMucChungService,
    public dialog: MatDialog,) { }

  ngOnInit(): void {
    if (this.role2) {
      this._DanhMucChungService.getthamso();
    }
    this.LoadNhomCongViec(this.id_project_team);
    this._DanhMucChungService.send$.subscribe((res: any) => {
      if (res == "LoadTaskGroup") {
        this.LoadNhomCongViec(this.id_project_team);
        this._DanhMucChungService.send$.next('');
      }
    });
  }

  UpdateGroup(id) {
    this.LoadNhomCongViec(id);
    this.valueChange.emit(id);
  }
  lstCongViec: any = [];
  isChon:boolean=false;
  LoadNhomCongViec(id) {
    this.isChon=false;
    if (!this.ListGroup) return;
    this.lstCongViec = this.ListGroup.find((x) => x.id_row == id);
    if (this.lstCongViec) {
      this.lstCongViec = this.lstCongViec.title;
    }
    else {
      this.isChon=true;
      this.lstCongViec = "Chọn nhóm";
    }

  }
  color="grey"
}
