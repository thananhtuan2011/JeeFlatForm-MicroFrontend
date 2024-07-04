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
import { PageGirdtersDashboardService } from '../../Services/page-girdters-dashboard.service';
import { WorkGeneralService } from '../../Services/work-general.services';
// NGRX
// Service
//Models


@Component({
  selector: 'kt-choose-users-v2',
  templateUrl: './v2-choose-users.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChooseUsersV2Component implements OnInit, OnChanges {
 
  @Input() isNewView = false;
  @Input() idDept: any;
  @Output() ItemSelected = new EventEmitter<any>();
  @Output() IsSearch = new EventEmitter<any>();
  @Output() ItemSelectedDefault = new EventEmitter<any>();

  listUserFull: any[] = [];
  listUser: any[] = [];
  customStyle: any = [];
  idDeptTemp:any;
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public userFilterCtrl: FormControl = new FormControl();
  constructor(
    private FormControlFB: FormBuilder,
    public dialog: MatDialog,
    public _WorkGeneralService: WorkGeneralService,
    private changeDetectorRefs: ChangeDetectorRef,
  ) {}

  /**
   * On init
   */
  ngOnInit() {
    this.userFilterCtrl.valueChanges.pipe().subscribe(() => {
      this.filterUsers();
    });
  }
  ngOnChanges() {
    this.loadNguoiThamGia();
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
    this._WorkGeneralService.gov_account_assignee_by_project(this.idDept).subscribe((res) => {
      if (res && res.status == 1) {
        this.listUserFull = res.data;
        this.listUser = res.data;
        if(res.data.length > 0){
          this.ItemSelectedDefault.emit(res.data);
        }
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
