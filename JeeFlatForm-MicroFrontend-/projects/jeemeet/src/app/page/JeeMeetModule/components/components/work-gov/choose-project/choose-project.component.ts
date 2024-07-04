
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

import { DanhMucChungService } from '../services/danhmuc.service';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'kt-choose-project',
  templateUrl: './choose-project.component.html',
  styleUrls: ['../danh-sach-nhiem-vu/danh-sach-nhiem-vu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.None,
})
export class ChooseProjectComponent implements OnInit, OnChanges {
  // Public properties
  // @Input() options: any = {
  // 	showSearch: true,//hiển thị search input hoặc truyền keyword
  // 	keyword: '',
  // 	data: []
  // };
  @Input() isNewView = false;
  @Input() idDept: any;
  @Output() ItemSelected = new EventEmitter<any>();
  @Output() IsSearch = new EventEmitter<any>();

  listUserFull: any[] = [];
  listUser: any[] = [];
  customStyle: any = [];
  public filteredUsers: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  public userFilterCtrl: FormControl = new FormControl();
  listDuAn: any;
  listDuAn_full: any;
  constructor(
    private FormControlFB: FormBuilder,
    public dialog: MatDialog,
    // private layoutUtilsService: LayoutUtilsService,
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
    this.userFilterCtrl.setValue('');
    // this.listUser = [];

    // if (this.options.showSearch == undefined)
    // 	this.options.showSearch = true;
    // if (this.options != undefined) {
    // if (this.options.data) {
    // this.listUser = this.options.data;
    this.filterUsers();
    this.changeDetectorRefs.detectChanges();
    // } else {
    // this.weworkService.list_account({}).subscribe(res => {
    // 	if (res && res.status === 1) {
    // 		this.listUser = res.data;
    // 		// mảng idnv exclude
    // 		if (this.options.excludes && this.options.excludes.length > 0) {
    // 			var arr = this.options.excludes;
    // 			this.listUser = this.listUser.filter(x => !arr.includes(x.id_nv));
    // 		}
    // 		this.filterUsers();
    // 		// this.changeDetectorRefs.detectChanges();
    // 	};
    // });
    // }
    // }
    // if (!this.options.showSearch)
    // 	this.filterUsers();
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
        this.listDuAn.filter(
          (bank) =>
            bank.title_full.toLowerCase().indexOf(search.replace('@', '')) > -1
        )
      );
    } else {
      this.filteredUsers.next(
        this.listDuAn.filter(
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
    // const filter: any = {};
    // filter.id_project_team = this.idDept;
    // this.weworkService.getDSThanhVienTheoDuAn(filter).subscribe((res) => {
    //   if (res && res.status == 1) {
    //     this.listUserFull = res.data;
    //     this.listUser = res.data;
    //     this.changeDetectorRefs.detectChanges();
    //   }
    // });
    this.weworkService.lite_project_by_manager().subscribe(res => {
      if (res && res.status == 1) {
          if (res.data.length > 0) {
              this.listDuAn = res.data;
              this.listDuAn_full = res.data;
          }
      }
      this.changeDetectorRefs.detectChanges();
  })
  }
  keyup(event) {
    event = event.toLowerCase().trim();
    if (event[0] == '@') {
      this.listDuAn = this.listDuAn_full.filter(
        (bank) => bank.title_full.toLowerCase().indexOf(event.replace('@', '')) > -1
      );
    }else if(event==''){
this.listDuAn=this.listDuAn_full;
    }
     else {
      debugger
      this.listDuAn = this.listDuAn_full.filter(
        (bank) => bank.title_full.toLowerCase().indexOf(event) > -1
      );
    }
  }
}
