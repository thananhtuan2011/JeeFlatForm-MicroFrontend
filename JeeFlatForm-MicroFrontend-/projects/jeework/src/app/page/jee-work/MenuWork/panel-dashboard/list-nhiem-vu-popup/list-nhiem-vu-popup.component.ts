import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import moment from 'moment';
import { MAT_DIALOG_DATA, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {
  LayoutUtilsService,
  MessageType,
} from 'projects/jeework/src/modules/crud/utils/layout-utils.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DanhMucChungService } from '../../../services/danhmuc.service';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { DetailTaskComponentComponent } from '../../../detail-task-component/detail-task-component.component';
import { WorksbyprojectService } from '../Services/worksbyproject.service';
import { TongHopCongViecService } from '../../bao-cao-doanh-nghiep/Services/tong-hop-cong-viec.service';
interface dropdown {
  value: string;
  viewValue: string;
}
interface dropdownintable {
  value: string;
  viewValue: string;
  color: string;
}
interface dropdownintable1 {
  value: string;
  viewValue: string;
  color: string;
  icon: string;
}
interface modelUpdate {
  values: [];
  id_row: number;
  key: string;
  value: string;
}
interface statusdropdown {
  color: any;
  description: any;
  follower: any;
  id_department: any;
  id_project_team: any;
  id_row: any;
  isComment: any;
  isdefault: any;
  position: any;
  statusname: any;
  type: any;
}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}
@Component({
  selector: 'app-list-nhiem-vu-popup',
  templateUrl: './list-nhiem-vu-popup.component.html',
  styleUrls: ['./list-nhiem-vu-popup.component.scss'],
})
export class ListNhiemVuPopupComponent implements OnInit {
  displayedColumns: string[] = [
    'nhiemvu',
    'tinhtrang',
    'giaocho',
    'hanchot',
    'binhluan',
    'nguoitao',
  ];
  douutien;

  tinhtrang: dropdown[] = [
    { value: '0', viewValue: 'Tất cả' },
    { value: '1', viewValue: 'Mới tạo' },
    { value: '2', viewValue: 'Đang thực hiện' },
    { value: '3', viewValue: 'Hoàn thành' },
  ];
  tiendo: dropdown[] = [
    { value: '0', viewValue: 'Tất cả' },
    { value: '1', viewValue: 'Hoàn thành đúng hạn' },
    { value: '2', viewValue: 'Hoàn thành quá hạn' },
    { value: '3', viewValue: 'Còn trong hạn' },
    { value: '4', viewValue: 'Sắp tới hạn' },
    { value: '5', viewValue: 'Tới hạn' },
    { value: '6', viewValue: 'Quá hạn' },
  ];
  the: Array<dropdown> = [];
  douutienintable: dropdownintable1[] = [
    {
      value: '1',
      viewValue: 'Khẩn cấp',
      color: '#FF0000',
      icon: 'fa fa-flag fab pd-r-10 text-danger',
    },
    {
      value: '2',
      viewValue: 'Cao',
      color: '#FFA800',
      icon: 'fa fa-flag fab pd-r-10 text-warning',
    },
    {
      value: '3',
      viewValue: 'Bình thường',
      color: '#0A86FF',
      icon: 'fa fa-flag fab pd-r-10 text-info',
    },
    {
      value: '4',
      viewValue: 'Thấp',
      color: '#B5B5C3',
      icon: 'fa fa-flag fab pd-r-10 text-muted',
    },
    {
      value: '0',
      viewValue: 'Xóa',
      color: '#B5B5C3',
      icon: 'fa fa-times fas pd-r-10 text-danger',
    },
  ];
  listStatus: statusdropdown[];
  dscongviec: any[];
  dstag: any[];
  id_project_team: any;
  id_department: any;
  tien_do: any;
  loaicongviec: any;
  clickup_prioritize: any;
  id_tag: any;
  IsProgress: any;
  keyword: any;
  issearch: true;
  options_assign: any = {};
  item: modelUpdate;
  param: any[];
  idMenu: any;
  uutien: any;
  quahan: any;
  khancap: any;
  filter: any;
  tungay: any;
  denngay: any;
  tinhtrangSelected: any;
  tiendoSelected: any;
  theSelected: any;
  clickup_prioritizeSelected: any;
  isGov: any;
  sortOrder: string;
  sortField: string;
  page: number;
  record: number;
  more: boolean;
  AllPage: any;
  flag: boolean;
  id_user: any;
  isDN: boolean = false;
  TuNgay: any;
  DenNgay: any;
  constructor(
    public dialogRef: MatDialogRef<ListNhiemVuPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _DanhMucChungService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog, // private layoutUtilsService: LayoutUtilsService // public auth: AuthService, // private layoutUtilsService: LayoutUtilsService,
    public _WorksbyprojectService: WorksbyprojectService,
    public _TongHopCongViecService: TongHopCongViecService,
  ) { }
  ngOnInit(): void {
    this._DanhMucChungService.getthamso();
    this.douutien = this._DanhMucChungService.list_priority;
    this.clickup_prioritizeSelected = this.douutien[0];
    this.id_project_team = 0;
    this.tien_do = 0;
    this.loaicongviec = 0;
    this.clickup_prioritize = 0;
    this.id_tag = 0;
    this.IsProgress = 0;
    this.keyword = '';
    this.tungay = '';
    this.denngay = '';
    this.id_user = 0;

    this.sortOrder = 'asc';
    this.sortField = '';
    this.page = 0;
    this.record = 10;
    this.more = false;
    this.flag = true;

    this._DanhMucChungService.ListAllTag().subscribe((res) => {
      this.the = [];
      if (res && res.status == 1) {
        this.dstag = res.data;
        this.the.push({ value: '', viewValue: 'Tất cả' });
        this.dstag.forEach((element) => {
          let item = {
            value: element.rowid,
            viewValue: element.title,
            color: element.color,
          };
          this.the.push(item);
        });
      }
      this.changeDetectorRefs.detectChanges();
    });
    this.douutien = this._DanhMucChungService.list_priority;
    this.clickup_prioritizeSelected = this.douutien[0];
    this.id_department = this.data.id_department;
    this.id_project_team = this.data.id_project_team;
    this.tien_do = this.data.tien_do;
    this.loaicongviec = this.data.loaicongviec;
    this.id_user = this.data.id_user;
    this.isDN = this.data.isDN != undefined ? this.data.isDN : false;

    this.sortOrder = 'asc';
    this.sortField = '';
    this.page = 0;
    this.record = 20;
    this.more = false;
    this.flag = true;
    this.theSelected = undefined;
    this.tinhtrangSelected = undefined;
    this.tiendoSelected = undefined;
    this.LoadData();
  }
  ListAllStatusDynamic: any = [];
  UserID = 0;
  LoadData() {
    let queryParams;
    this.layoutUtilsService.showWaitingDiv();
    if (this.isDN) {
      queryParams = new QueryParamsModel(
        this.filterConfiguration()
      );
      queryParams.sortOrder = this.sortOrder;
      queryParams.sortField = this.sortField;
      queryParams.pageNumber = this.page;
      queryParams.pageSize = this.record;
      queryParams.more = this.more;
      this._TongHopCongViecService.loadDSTongHopCongViec(queryParams).subscribe(res=>{
        this.layoutUtilsService.OffWaitingDiv();
          if (res && res.status == 1) {
            this.dscongviec = res.data;
            this.dscongviec.forEach((element) => {
              element.editTitle = false;
            });
          }
          this.isGov = res.isgov;
          this.AllPage = res.page.AllPage;
          this.dataSource.data = this.dscongviec;
          this.changeDetectorRefs.detectChanges();
      })
    }
    else {
      queryParams = new QueryParamsModel(
        this.filterConfigurationForProject(
          this.id_project_team,
          this.tien_do,
          this.loaicongviec,
          this.id_user,
          this.id_department
        )
      );
      queryParams.sortOrder = this.sortOrder;
      queryParams.sortField = this.sortField;
      queryParams.pageNumber = this.page;
      queryParams.pageSize = this.record;
      queryParams.more = this.more;
      this._WorksbyprojectService.loadList(queryParams).subscribe(
        (res) => {
          this.layoutUtilsService.OffWaitingDiv();
          if (res && res.status == 1) {
            this.dscongviec = res.data;
            this.dscongviec.forEach((element) => {
              element.editTitle = false;
            });
          }
          this.isGov = res.isgov;
          this.AllPage = res.page.AllPage;
          this.dataSource.data = this.dscongviec;
          this.changeDetectorRefs.detectChanges();
        }
      );
    }
  }
  filterConfiguration() {
    this.filter={};
    this.filter.type_filter = this.data.type_filter;
    this.filter.type_staff = this.data.type_staff;
    this.filter.id_project_team = this.id_project_team;
    this.filter.status=this.data.tien_do;
    this.filter.id_nv=this.data.id_nv;
    this.filter.TuNgay = this.data.TuNgay;
    this.filter.DenNgay = this.data.DenNgay;
    return this.filter;
  }


  filterConfigurationForProject(
    id_project_team: any,
    tien_do: any,
    loaicongviec: any,
    id_user: any,
    id_department: any,
  ): any {
    let filterNew = {};
    if (id_user && id_user > 0) {
      filterNew = {
        id_project_team: id_project_team,
        id_department: id_department,
        tien_do: tien_do,
        loaicongviec: loaicongviec,
        id_user: id_user,
        assign: (id_user && id_user > 0) ? true : false,
        get_check: false,
      };
    } else {
      filterNew = {
        id_project_team: id_project_team,
        id_department: id_department,
        tien_do: tien_do,
        loaicongviec: loaicongviec,
        get_check: false,
      };
    }
    return filterNew;
  }
  filterConfigurationAvatar(BaoGomUserLogin: any): any {
    const filter: any = {
      BaoGomUserLogin: BaoGomUserLogin,
    };
    return filter;
  }
  changeDoUuTien(val) {
    this.page = 0;
    this.flag = true;
    this.clickup_prioritizeSelected = val;
    this.clickup_prioritize = this.clickup_prioritizeSelected.value;
    this.LoadData();
  }
  changeTienDo(val) {
    this.page = 0;
    this.flag = true;
    this.tiendoSelected = val;
    this.tien_do = this.tiendoSelected.value;
    this.LoadData();
    let listScroll = document.getElementById('listScroll');
    if (listScroll !== null) {
      listScroll.scrollIntoView();
      listScroll = null;
    }
  }
  changeThe(val) {
    this.page = 0;
    this.flag = true;
    this.theSelected = val;
    this.id_tag = this.theSelected.value;
    this.LoadData();
  }
  changeTinhTrang(val) {
    this.page = 0;
    this.flag = true;
    this.tinhtrangSelected = val;
    this.IsProgress = this.tinhtrangSelected.value;
    this.LoadData();
  }
  searchByKeyword(val) {
    this.page = 0;
    this.flag = true;
    this.keyword = val.target.value;
    this.LoadData();
  }
  get_flag_color(val) {
    switch (val) {
      case 0:
        return 'grey-flag_list';
      case 1:
        return 'red-flag_list';
      case 2:
        return 'yellow-flag_list';
      case 3:
        return 'blue-flag_list';
      case 4:
        return 'low-flag_list';
    }
  }
  formatdatehour(val) {
    if (val == '') {
      return '12/12/2022';
    }
    let a = moment(val, ['HH:mm DD/MM/YYYY']).format('HH:mm DD/MM/YYYY');
    if (a == 'Invalid date') {
      a = moment(val).format('HH:mm DD/MM/YYYY');
    }
    let splitted;
    if (a == 'Invalid date') {
      splitted = val.split(' ', 2);
    } else {
      let b = a.split(' ', 3);
      return b[0];
    }

    return splitted[0];
  }
  formatdatedate(val) {
    let a = moment(val, ['HH:mm DD/MM/YYYY']).format('HH:mm DD/MM/YYYY');
    if (a == 'Invalid date') {
      a = moment(val).format('HH:mm DD/MM/YYYY');
    }
    let splitted;
    if (a == 'Invalid date') {
      splitted = val.split(' ', 2);
    } else {
      let b = a.split(' ', 3);
      return b[1];
    }
    return splitted[1];
  }
  getTwentyFourHourTime(amPmString) {
    var d = new Date('1/1/2013 ' + amPmString);
    return d.getHours() + ':' + d.getMinutes();
  }
  openTaskDetail(val) {
    this.router.navigate(['', { outlets: { auxName: 'auxWork/DetailsGOV/' + val }, }]);
  }
  loadNguoiThamGia(val) {
    this._DanhMucChungService.gov_account_assignee_by_project(val).subscribe((res) => {
      if (res && res.status == 1) {
        this.options_assign = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }
  changeDoUuTienInTable(val, clickup_prioritize) {
    this.updateItem(
      val,
      Number(clickup_prioritize.value),
      'clickup_prioritize'
    );
  }
  changeTinhTrangInTable(val, val1) {
    this.updateItem(val, Number(val1.id_row), 'status');
  }
  changeHanChotInTable(val, val1) {
    this.updateItem(val, val1, 'deadline');
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
  ItemSelected(val: any, task) {
    let check = true;
    if (task.User.hoten != undefined) {
      if (task.User.id_nv == val.id_nv) {
        check = false;
      }
      task.User = '';
    }
    if (check) {
      task.User = val;
    }
    this.updateItem(task, Number(val.id_nv), 'assign');
  }
  updateItem(val: any, newvalue: any, key: any) {
    this.item = { values: [], id_row: val.id_row, key: key, value: newvalue };
    this.layoutUtilsService.showWaitingDiv();
    this._DanhMucChungService.updateTask(this.item).subscribe((res) => {
      this.layoutUtilsService.OffWaitingDiv();
      if (res && res.status == 1) {
        this.page = 0;
        this.LoadData();
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          'top',
          0
        );
      }
    });
  }
  loadTinhTrang(val: any) {
    this._DanhMucChungService.listTinhTrangDuAn(
      val.id_project_team,
      val.id_row
    ).subscribe((res) => {
      if (res && res.status == 1) {
        this.listStatus = res.data;
      }
    });
  }
  onclickReturn() {
    this.dialogRef.close();
  }
  openModal(
    title: string,
    message: string,
    yes: Function = null,
    no: Function = null
  ) {
    const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title,
      message: message,
    };
    dialogConfig.width = '40vw';
    dialogConfig.panelClass = 'my-custom-dialog-class';
    let dialogRef;

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.ngOnInit();
      }
    });
  }
  RemoveAssign(element) {
    this.updateItem(element, Number(element.User.id_nv), 'assign');
    // element.User = [];
  }
  getTitle(text) {
    let result = text.length > 40 ? text.slice(0, 40) + '...' : text;
    return result;
  }
  submit(val, element) {
    if (val != true) {
      if (val == "delete") {
        element.num_comment = element.num_comment - 1;
      } else {
        element.num_comment = element.num_comment + 1;
      }
    }
  }
  minimizeText(text) {
    if (text.length > 20) {
      return text.slice(0, 20) + '...';
    }
    return text;
  }
  editTitle(element) {
    element.editTitle = true;
    setTimeout(() => {
      const ele = document.getElementById(
        'task' + element.id_row
      ) as HTMLInputElement;
      ele.focus();
    }, 100);
  }
  focusOutFunction(element) {
    element.editTitle = false;
  }
  changeTitleInTable(event, element) {
    if (
      event.target.value.trim() == element.title.trim() ||
      event.target.value.trim() == ""
    ) {
      event.target.value = element.title;
      return;
    } else {
      element.title = event.target.value;
    }
    this.updateItem(element, element.title, 'title');
  }
  //====================Start Các hàm xét quyền để sử dụng==============================
  CheckRules(RuleID: number, element) {
    if (element.Rule) {
      if (element) {
        if (
          element.IsAdmin === true ||
          +element.admin === 1 ||
          +element.owner === 1 ||
          +element.parentowner === 1
        ) {
          return true;
        } else {
          if (
            RuleID === 7 ||
            RuleID === 9 ||
            RuleID === 11 ||
            RuleID === 12 ||
            RuleID === 13
          ) {
            if (element.Rule.find((element) => element == 15)) {
              return false;
            }
          }
          if (RuleID === 10) {
            if (element.Rule.find((element) => element == 16)) {
              return false;
            }
          }
          if (RuleID === 4 || RuleID === 14) {
            if (element.Rule.find((element) => element == 17)) {
              return false;
            }
          }
          const r = element.Rule.find((element) => element == RuleID);
          if (r) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    }
    return false;
  }

  CheckRuleskeypermit(key, element) {
    if (element.IsAdmin) {
      return true;
    }
    if (element.Rule) {
      if (element) {
        if (
          element.IsAdmin === true ||
          +element.admin === 1 ||
          +element.owner === 1 ||
          +element.parentowner === 1
        ) {
          return true;
        } else {
          if (
            key === 'title' ||
            key === 'description' ||
            key === 'status' ||
            key === 'checklist' ||
            key === 'delete'
          ) {
            if (element.Rule.find((r) => r.id_Rule === 15)) {
              return false;
            }
          }
          if (key === 'deadline') {
            if (element.Rule.find((r) => r.id_Rule === 16)) {
              return false;
            }
          }
          if (key === 'id_nv' || key === 'assign') {
            if (element.Rule.find((r) => r.id_Rule === 17)) {
              return false;
            }
          }
          const r = element.Rule.find((Rule) => Rule.keypermit == key);
          if (r) {
            return true;
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    }
    return false;
  }

  CheckClosedTask(element) {
    if (element.closed) {
      return false;
    } else {
      return true;
    }
  }
  openPopupDetail(element) {
    var data = null; //call api
    this.openModalDetail(
      'Title1',
      'Message Test',
      element,
    );
  }
  openModalDetail(
    title: string,
    message: string,
    element,
    yes: Function = null,
    no: Function = null
  ) {
    const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: title,
      message: message,
      id_row: element.id_row,
      isPopup: true,
    };
    dialogConfig.panelClass = 'popup';
    const dialogRef = this.dialog.open(
      DetailTaskComponentComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result != undefined) {
        this.ngOnInit();
      }
    });
  }

  RemoveTag(value, element, remove = false) {
    if (!remove) {
      return false;
    }
    this.updateItem(element, value.id_row, 'Tags');
  }

  stopPropagation1(event) {
    event.stopPropagation();
  }
  ItemSelected1(val: any, element) {
    // if (element.Tags.length > 0) {
    //   let a = element.Tags.find((i) => i.rowid == val.rowid);
    //   if (a) {
    //     let index = element.Tags.indexOf(a);
    //     element.Tags.splice(index, 1);
    //   } else {
    //     element.Tags.push(val);
    //   }
    // } else {
    //   element.Tags.push(val);
    // }
    // debugger
    this.updateItem(element, val.rowid, 'Tags');
  }
  DeleteTask(element) {
    this._DanhMucChungService.DeleteTask(element.id_row).subscribe((res) => {
      if (res && res.status === 1) {
        this.LoadData();
      } else {
        this.layoutUtilsService.showActionNotification(
          res.error.message,
          MessageType.Read,
          9999999999,
          true,
          false,
          3000,
          'top',
          0
        );
      }
      this.changeDetectorRefs.detectChanges();
    });
  }
  SaveWork(element) {
    if (!element.isStorage) {
      this.updateItem(element, 1, 'isStorage');
    }
  }
  ClosedTask(element, check) {
    this.updateItem(element, check, 'closed');
  }
  CheckShow(element) {
    if (
      this.CheckRules(13, element) ||
      this.CheckRuleskeypermit('update_storage', element) ||
      this.CheckRules(7, element)
    ) {
      return true;
    }
    return false;
  }
  dataSource = new MatTableDataSource<any>([]);
  onScroll(event: any) {
    if (
      event.target.offsetHeight + event.target.scrollTop + 110 >=
      event.target.scrollHeight
    ) {
      if (this.page + 1 < this.AllPage && this.flag) {
        this.flag = false;
        this.page++;
        this.LoadDataLazy();
      }
    }
  }
  LoadDataLazy() {
    let queryParams;
    this.layoutUtilsService.showWaitingDiv();

    queryParams = new QueryParamsModel(
      this.filterConfigurationForProject(
        this.id_project_team,
        this.tien_do,
        this.loaicongviec,
        this.id_user,
        this.id_department
      )
    );
    queryParams.sortOrder = this.sortOrder;
    queryParams.sortField = this.sortField;
    queryParams.pageNumber = this.page;
    queryParams.pageSize = this.record;
    queryParams.more = this.more;
    this._DanhMucChungService.getDSNhiemVuByProject(queryParams).subscribe(
      (res) => {
        this.layoutUtilsService.OffWaitingDiv();
        if (res && res.status == 1) {
          this.isGov = res.isgov;
          // this.isGov=true;
          let newList = res.data;
          newList.forEach((element) => {
            element.editTitle = false;
            this.dataSource.data.push(element);
          });
          this.dataSource._updateChangeSubscription();
          this.flag = true;
        }
      }
    );
    console.log('=========================================ver---->', this.dataSource);

  }
  checkOverTime(deadline) {
    let date = Date();
    let a = 0;
    // let dateOne = new Date(moment(deadline, ["HH:mm DD/MM/YYYY"]).format("HH:mm DD/MM/YYYY"));
    let dateTwo: any = moment(date).format('HH:mm DD/MM/YYYY');
    let dldate = moment(deadline).format(
    );
    let currdate = moment(date).format();
    if (currdate > dldate) {
      return true;
    }
    return false;
  }

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 300;
    return tmp_height + 'px';
  }

  getDeadlineColor(TienDo) {
    switch (TienDo) {
      case '1':
        return '#3699FF';
      case '2':
        return '#385C69';
      case '3':
        return '#13C07C';
      case '4':
        return '#EEB108';
      case '5':
        return '#EC641B';
      case '6':
        return '#FF0000';
      default:
        return '#272524';
    }
  }
}
