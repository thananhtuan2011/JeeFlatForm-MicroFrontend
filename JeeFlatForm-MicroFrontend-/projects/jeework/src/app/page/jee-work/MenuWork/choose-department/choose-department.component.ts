
// Angular
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  OnDestroy,
  ChangeDetectorRef,
  Inject,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation,
  OnChanges,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { DanhMucChungService } from '../../services/danhmuc.service';

@Component({
  selector: 'kt-choose-department',
  templateUrl: './choose-department.component.html',
  styleUrls: ['../danh-sach-nhiem-vu/danh-sach-nhiem-vu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooseDepartmentComponent implements OnInit, OnChanges {
  
  @Input() isNewView = false;
  @Input() listPhongBan: any;
  @Output() ItemSelected = new EventEmitter<any>();
  @Output() IsSearch = new EventEmitter<any>();

  customStyle: any = [];
  phongban_full:any;
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public userFilterCtrl: FormControl = new FormControl();
  constructor(
    public dialog: MatDialog,
    public weworkService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}

  /**
   * On init
   */
  ngOnInit() {
    this.loaddonvigiaonhiemvu();
    this.userFilterCtrl.valueChanges.pipe().subscribe(() => {
      this.filterUsers();
    });
  }
  ngOnChanges() {
    this.userFilterCtrl.setValue('');
    this.filterUsers();
    this.changeDetectorRefs.detectChanges();
  }
  protected filterUsers() {
    if (this.listPhongBan.length == 0) {
      return;
    }

    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUsers.next(this.listPhongBan.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    if (search[0] == '@') {
      this.filteredUsers.next(
        this.listPhongBan.filter(
          (bank) =>
            bank.title.toLowerCase().indexOf(search.replace('@', '')) > -1
        )
      );
    } else {
      this.filteredUsers.next(
        this.listPhongBan.filter(
          (bank) => bank.title.toLowerCase().indexOf(search) > -1
        )
      );
    }
  }
  select(user) {
    this.ItemSelected.emit(user);
  }
  stopPropagation(event) {
    this.IsSearch.emit(event);
  }
  loaddonvigiaonhiemvu(){
    this.weworkService.list_department_gov_rule42().subscribe(res=>{
      if(res&&res.status==1){
        this.phongban_full=res.data;
      }
      this.changeDetectorRefs.detectChanges();
    })
  }
  keyup(event) {
    event = event.toLowerCase();
    if (event[0] == '@') {
      this.listPhongBan = this.listPhongBan.filter(
        (bank) => bank.title.toLowerCase().indexOf(event.replace('@', '')) > -1
      );
    } else if(event==''){
      this.listPhongBan=this.phongban_full;
    }
    else {
      this.listPhongBan = this.listPhongBan.filter(
        (bank) => bank.title.toLowerCase().indexOf(event) > -1
      );
    }
  }
}
