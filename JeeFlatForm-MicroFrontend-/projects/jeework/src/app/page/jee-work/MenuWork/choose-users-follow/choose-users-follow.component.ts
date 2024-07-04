import {
  LayoutUtilsService,
} from 'src/app/modules/crud/utils/layout-utils.service';
import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Input,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ReplaySubject } from 'rxjs';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { MenuWorkService } from '../services/menu-work.services';

@Component({
  selector: 'kt-choose-users-follow',
  templateUrl: './choose-users-follow.component.html',
  styleUrls: ['../danh-sach-nhiem-vu/danh-sach-nhiem-vu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooseUsersFollowComponent implements OnInit, OnChanges {

  @Input() isNewView = false;
  @Output() ItemFollow = new EventEmitter<any>();
  @Output() IsSearch = new EventEmitter<any>();
  @Output() ItemFollowDefault = new EventEmitter<any>();
  @Input() idDept: any = 0;

  listUserFull: any[] = [];
  listUser: any[] = [];
  customStyle: any = [];
  UserID: any;
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public userFilterCtrl: FormControl = new FormControl();
  constructor(
    public dialog: MatDialog,
    public _DanhMucChungService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    public _MenuWorkService: MenuWorkService,
  ) {
    this.UserID =
      this._MenuWorkService.getAuthFromLocalStorage().user.customData[
        'jee-account'
      ].userID;
  }

  /**
   * On init
   */
  ngOnInit() {
  }

  ngOnChanges() {
    if(this.idDept > 0){
      this.loadNguoiThamGia();
      this.changeDetectorRefs.detectChanges();
    }
  }
  
  protected filterUsers() {
    if (!this.listUser) {
      return;
    }

    let search = this.userFilterCtrl.value;
    if (!search) {
      this.filteredUsers.next(this.listUser.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    if (search[0] == '@') {
      this.filteredUsers.next(
        this.listUser.filter(
          (bank) =>
            bank.hoten.toLowerCase().indexOf(search.replace('@', '')) > -1
        )
      );
    } else {
      this.filteredUsers.next(
        this.listUser.filter(
          (bank) => bank.hoten.toLowerCase().indexOf(search) > -1
        )
      );
    }
  }
  select(user) {
    this.ItemFollow.emit(user);
  }
  stopPropagation(event) {
    this.IsSearch.emit(event);
  }

  loadNguoiThamGia() {
    this._DanhMucChungService.gov_account_follower_by_department(this.idDept).subscribe((res) => {
      if (res && res.status == 1) {
        this.listUserFull = res.data;
        this.listUser = res.data;
        if (res.data.length > 0) {
          let obj = res.data.find(x => +x.id_nv == +this.UserID);
          if (obj) {
            this.ItemFollowDefault.emit(obj);
          } else {
            this.ItemFollowDefault.emit(res.data[0]);
          }
        }
        this.userFilterCtrl.valueChanges.pipe().subscribe(() => {
          this.filterUsers();
        });
        this.changeDetectorRefs.detectChanges();
      }
    });
  }
  keyup(event) {
    event = event.toLowerCase();
    if (event[0] == '@') {
      this.listUser = this.listUserFull.filter(
        (bank) => bank.hoten.toLowerCase().indexOf(event.replace('@', '')) > -1
      );
    } else {
      this.listUser = this.listUserFull.filter(
        (bank) => bank.hoten.toLowerCase().indexOf(event) > -1
      );
    }
  }
}
