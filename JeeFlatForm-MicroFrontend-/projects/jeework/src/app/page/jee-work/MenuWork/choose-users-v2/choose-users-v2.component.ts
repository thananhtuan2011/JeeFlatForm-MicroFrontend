import {
  LayoutUtilsService,
  MessageType,
} from 'src/app/modules/crud/utils/layout-utils.service';
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
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
// Material
import { MatDialog } from '@angular/material/dialog';
// RxJS
import { ReplaySubject } from 'rxjs';
// NGRX
// Service
//Models

import { DanhMucChungService } from '../../services/danhmuc.service';

@Component({
  selector: 'app-choose-users',
  templateUrl: './choose-users-v2.component.html',
  styleUrls: ['../danh-sach-nhiem-vu/danh-sach-nhiem-vu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None,
})
export class ChooseUsersV2Component implements OnInit, OnChanges {
  // Public properties
  // @Input() options: any = {
  // 	showSearch: true,//hiển thị search input hoặc truyền keyword
  // 	keyword: '',
  // 	data: []
  // };
  @Input() isNewView = false;
  @Input() idDept: any;
  @Input() data:any=[];
  @Output() ItemSelected = new EventEmitter<any>();
  @Output() IsSearch = new EventEmitter<any>();

  listUserFull: any[] = [];
  listUser: any[] = [];
  customStyle: any = [];
  idDeptTemp:any;
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public userFilterCtrl: FormControl = new FormControl();
  constructor(
    private FormControlFB: FormBuilder,
    public dialog: MatDialog,
    private layoutUtilsService: LayoutUtilsService,
    public weworkService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}

  /**
   * On init
   */
  ngOnInit() {
    this.loadNguoiThamGia();
    this.userFilterCtrl.valueChanges.pipe().subscribe(() => {
      this.filterUsers();
    });
  }
  ngOnChanges() {
    // if (this.idDept!=this.idDeptTemp) {
    //   this.loadNguoiThamGia();
    // }
    this.loadNguoiThamGia();
    // this.userFilterCtrl.setValue('');
    // this.filterUsers();
    // this.changeDetectorRefs.detectChanges();
    
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
    this.ItemSelected.emit(user);
  }
  stopPropagation(event) {
    this.IsSearch.emit(event);
  }

  loadNguoiThamGia() {
    const filter: any = {};
    if(this.data){
      this.listUserFull = this.data;
      this.listUser = this.data;
    }
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
