
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
import { LayoutUtilsService } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';

@Component({
  selector: 'kt-choose-project-nvph',
  templateUrl: './choose-project-nvph.component.html',
  styleUrls: ['../danh-sach-nhiem-vu/danh-sach-nhiem-vu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooseProjectNVPHComponent implements OnInit, OnChanges {

  @Input() isNewView = false;
  @Input() idDept: any = 0;
  @Output() ItemSelected = new EventEmitter<any>();
  @Output() IsSearch = new EventEmitter<any>();

  listUserFull: any[] = [];
  listUser: any[] = [];
  customStyle: any = [];
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public userFilterCtrl: FormControl = new FormControl();
  constructor(
    public dialog: MatDialog,
    public weworkService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }

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
    this.loadNguoiThamGia();
    this.userFilterCtrl.setValue('');
    this.filterUsers();
    this.changeDetectorRefs.detectChanges();
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
            bank.title_full.toLowerCase().indexOf(search.replace('@', '')) > -1
        )
      );
    } else {
      this.filteredUsers.next(
        this.listUser.filter(
          (bank) => bank.title_full.toLowerCase().indexOf(search) > -1
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
    this.weworkService.lite_project_by_manager(this.idDept).subscribe((res) => {
      if (res && res.status === 1) {
        this.listUserFull = res.data;
        this.listUser = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }



  keyup(event) {
    event = event.toLowerCase();
    if (event[0] == '@') {
      this.listUser = this.listUserFull.filter(
        (bank) => bank.title_full.toLowerCase().indexOf(event.replace('@', '')) > -1
      );
    } else if (event == '') {
      this.listUser = this.listUserFull;
    }else {
      this.listUser = this.listUserFull.filter(
        (bank) => bank.title_full.toLowerCase().indexOf(event) > -1
      );
    }
  }
}
