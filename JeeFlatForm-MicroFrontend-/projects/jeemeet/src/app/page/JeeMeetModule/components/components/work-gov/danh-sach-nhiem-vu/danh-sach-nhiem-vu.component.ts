import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from 'src/app/modules/auth';

import moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DanhMucChungService } from '../services/danhmuc.service';

import { MatTableDataSource } from '@angular/material/table';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { QueryParamsModel } from '../models/query-models/query-params.model';
import { ThemMoiCongViecComponent } from '../them-moi-cong-viec/them-moi-cong-viec.component';
import { ReportModel } from '../models/JeeWorkModel';
import { fromEvent } from 'rxjs';
interface dropdown {
  value: string;
  viewValue: string;
}
// interface dropdownintable {
//   value: string;
//   viewValue: string;
//   color: string;
// }
// interface dropdownintable1 {
//   value: string;
//   viewValue: string;
//   color: string;
//   icon: string;
// }
interface modelUpdate {
  values: [];
  id_row: number;
  key: string;
  value: string;
}
// interface Task {
//   name: string;
//   completed: boolean;
//   // color: ThemePalette;
//   subtasks?: Task[];
// }
interface statusdropdown {
  color: any;
  description: any;
  follower: any;
  id_department: any;
  id_project_team: any;
  id_row: any;
  isComment: any;
  isdeadline: any;
  isdefault: any;
  isfinal: any;
  istodo: any;
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
  selector: 'app-danh-sach-nhiem-vu-meet',
  templateUrl: './danh-sach-nhiem-vu.component.html',
  styleUrls: ['./danh-sach-nhiem-vu.component.scss'],
})
export class DanhSachNhiemVuComponent implements OnInit {
  @Input() meetingid: number;
  displayedColumns: string[] = [
    'nhiemvu',
    'tinhtrang',
    'giaocho',
    'hanchot',
    // 'binhluan',
    'nguoitao',
  ];
  douutien;
  TinhTrang = [];
  // douutien: dropdown[] = [
  //   { value: '0', viewValue: 'Tất cả' },
  //   { value: '1', viewValue: 'Khẩn cấp' },
  //   { value: '2', viewValue: 'Cao' },
  //   { value: '3', viewValue: 'Bình thường' },
  //   { value: '4', viewValue: 'Thấp' },
  //   { value: '5', viewValue: 'Không chọn' },
  // ];
  filterTinhTrang;
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
  douutienintable: any[] = [
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
  TagsIDFilter: any;
  tien_do: any;
  loaicongviec: any;
  clickup_prioritize: any;
  id_tag: any;
  IsProgress: any;
  keyword: any;
  issearch: true;
  options_assign: any = {};
  options_assign_new: any = [];
  item: modelUpdate;
  param: any[];
  idMenu: any;
  uutien: any;
  quahan: any;
  khancap: any;
  filter: any;
  tungay: any;
  denngay: any;
  tinhtrangSelected: any = { viewValue: '', value: '' };
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
  idDept: any = 0;
  idUser: any = 0;
  idProject: any = 0;
  CollectBy: any = '';
  loaicv: any = 0;
  id_user_giao: any = 0;
  id_user_tao: any = 0;
  all: boolean = true;
  findtag: string = "";
  data: any;

  constructor(
    public DanhMucChungService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog, // private layoutUtilsService: LayoutUtilsService // public auth: AuthService, // private layoutUtilsService: LayoutUtilsService,
    // private socketioService: SocketioService,
  ) { }
  ngOnInit(): void {
    this.douutienintable = this.DanhMucChungService.list_priority;
    // this.param = window.location.href.split('/');
    // this.idMenu = this.param[this.param.length - 4];
    // this.uutien = this.param[this.param.length - 3];
    // this.quahan = this.param[this.param.length - 2];
    // this.khancap = this.param[this.param.length - 1];
    this.douutien = this.list_priority;
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

    this.sortOrder = 'asc';
    this.sortField = '';
    this.page = 0;
    this.record = 12;
    this.more = false;
    this.flag = true;

    this.DanhMucChungService.ListAllTag(this.findtag).subscribe((res) => {
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
    this.activatedRoute.params.subscribe((params) => {
      this.douutien = this.list_priority;
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

      this.sortOrder = 'asc';
      this.sortField = '';
      this.page = 0;
      this.record = 12;
      this.more = false;
      this.flag = true;
      this.theSelected = undefined;
      this.tinhtrangSelected = this.tinhtrang[0];
      this.tiendoSelected = undefined;
      this.idMenu = params.loaimenu;
      if (this.idMenu == 4) {
        this.id_project_team = params.projectid;
        this.tien_do = params.filter;
        this.tiendoSelected = this.tiendo.find((t) => t.value == this.tien_do);
        this.listTagByProject(this.id_project_team);
      }
      else if (this.idMenu == 7) {
        this.IsProgress = '';
        this.id_project_team = params.projectid;
        this.TagsIDFilter = params.advance;
        this.tien_do = params.filter;
        this.tiendoSelected = this.tiendo.find((t) => t.value == this.tien_do);
        this.tiendoSelected = this.tiendo.find((t) => t.value == this.tien_do);
        this.listTagByProject(this.id_project_team);
      } else {
        if (params.IDep) {

          var data = new ReportModel();
          data.clear();
          data = JSON.parse(localStorage.getItem("DataReport"));
          this.loaicv = data.loaicv;
          this.idDept = data.id_department;
          this.tien_do = data.tien_do;
          this.id_user_giao = data.id_user_giao;
          this.id_user_tao = data.id_user_tao;
          this.tungay = data.TuNgay;
          this.denngay = data.DenNgay;
          this.CollectBy = data.collect_by;
          this.filter = data.filter;
          this.id_project_team = data.id_project_team;
          this.all = data.all;
        }
        else if (params.advance) {
          this.tien_do = params.advance;
          this.tiendoSelected = this.tiendo.find(
            (t) => t.value == this.tien_do
          );
          this.filter = 5;
        } else {
          this.filter = params.filter;
          if (this.filter >= 0 && this.filter <= 4) {
            let a = Number(this.filter) + 1;
            this.clickup_prioritizeSelected = this.douutien[a];
          } else {
            switch (Number(this.filter)) {
              case -1:
                this.tiendoSelected = this.tiendo[6];
                break;
              case -2:
                this.tiendoSelected = this.tiendo[5];
                break;
              case -3:
                this.tiendoSelected = this.tiendo[4];
                break;
              default:
                break;
            }
          }
          this.id_project_team = 0;
        }
        this.listAllTag(this.findtag);
        this.loaicongviec = params.loaimenu;

      }
      this.LoadData();
      if (this.id_project_team || this.id_project_team != 0) {
        this.loadlistTinhTrangbyProject();
      }
      // this.ngOnInit();
    });
    //============Bổ sung load lại danh sách nếu xem nhiệm vụ mới=============
    const $eventload = fromEvent<CustomEvent>(window, 'event-list-task').subscribe((e) => this.onEventLoadListTask(e));
    const $eventloadcount = fromEvent<CustomEvent>(window, 'event-count-isnew').subscribe((e) => this.onEventLoadListTask(e));
  }
  listAllTag(keyword) {
    this.DanhMucChungService.ListAllTag(keyword).subscribe((res) => {
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
  }
  listTagByProject(id_project) {
    if (this.idMenu != 7) {
      this.DanhMucChungService.ListTagByProject(id_project).subscribe((res) => {
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
    } else {
      this.DanhMucChungService.ListTagByProject(id_project).subscribe((res) => {
        this.the = [];
        if (res && res.status == 1) {
          this.dstag = res.data;
          // this.the.push({ value: '', viewValue: 'Tất cả' });
          this.dstag.forEach((element) => {
            if (element.rowid == this.TagsIDFilter) {
              let item = {
                value: element.rowid,
                viewValue: element.title,
                color: element.color,
              };
              this.the.push(item);
            }
          });
        }
        this.changeDetectorRefs.detectChanges();
      });
    }
  }
  ListAllStatusDynamic: any = [];
  UserID = 0;
  LoadData() {
    let queryParams;
    //this.layoutUtilsService.showWaitingDiv();
    if (this.idMenu == 4) {
      queryParams = new QueryParamsModel(
        this.filterConfigurationForProject(
          this.id_project_team,
          this.tien_do,
          this.loaicongviec,
          this.clickup_prioritize,
          this.id_tag,
          this.IsProgress,
          this.keyword,
          5
        )
      );
      queryParams.sortOrder = this.sortOrder;
      queryParams.sortField = this.sortField;
      queryParams.pageNumber = this.page;
      queryParams.pageSize = this.record;
      queryParams.more = this.more;
      this.DanhMucChungService.getDSNhiemVuByProject(queryParams).subscribe(
        (res) => {
          //this.layoutUtilsService.OffWaitingDiv();
          if (res && res.status == 1) {
            this.dscongviec = res.data;
            this.dscongviec.forEach((element) => {
              if (element.deadline == "" || element.deadline == undefined) {
                element.deadline = undefined;
              } else {
                element.deadline = moment(element.deadline, [
                  'HH:mm DD/MM/YYYY',
                ]).format();
              }
              element.oldDeadline = element.deadline;
              element.editTitle = false;
            });
            this.isGov = res.isgov;
            this.AllPage = res.page.AllPage;
          } else {
            this.isGov = res.isgov;
            this.AllPage = 0;

            this.dscongviec = [];
          }
          this.dataSource.data = this.dscongviec;
          this.changeDetectorRefs.detectChanges();
        }
      );
    }
    else if (this.idMenu == 7) {
      queryParams = new QueryParamsModel(
        this.filterConfigurationForProject(
          this.id_project_team,
          this.tien_do,
          this.loaicongviec,
          this.clickup_prioritize,
          this.TagsIDFilter,
          this.IsProgress,
          this.keyword,
          5
        )
      );
      queryParams.sortOrder = this.sortOrder;
      queryParams.sortField = this.sortField;
      queryParams.pageNumber = this.page;
      queryParams.pageSize = this.record;
      queryParams.more = this.more;
      this.DanhMucChungService.getDSNhiemVuByProject(queryParams).subscribe(
        (res) => {
          //this.layoutUtilsService.OffWaitingDiv();
          if (res && res.status == 1) {
            this.dscongviec = res.data;
            this.dscongviec.forEach((element) => {
              if (element.deadline == "" || element.deadline == undefined) {
                element.deadline = undefined;
              } else {
                element.deadline = moment(element.deadline, [
                  'HH:mm DD/MM/YYYY',
                ]).format();
              }
              element.oldDeadline = element.deadline;
              element.editTitle = false;
            });
            this.isGov = res.isgov;
            this.AllPage = res.page.AllPage;
          } else {
            this.isGov = res.isgov;
            this.AllPage = 0;

            this.dscongviec = [];
          }
          this.dataSource.data = this.dscongviec;
          this.changeDetectorRefs.detectChanges();
        }
      );
    }
    //if (this.idMenu != 4)
    else {
      queryParams = new QueryParamsModel(
        this.filterConfiguration(
          this.id_project_team,
          this.filter,
          this.tungay,
          this.denngay,
          this.tien_do,
          this.loaicongviec,
          this.clickup_prioritize,
          this.id_tag,
          this.IsProgress,
          this.keyword,
          this.loaicv,
          this.idDept,
          this.id_user_giao,
          this.CollectBy,
          this.all,
          this.id_user_tao,
          this.meetingid
        )
      );
      queryParams.sortOrder = this.sortOrder;
      queryParams.sortField = this.sortField;
      queryParams.pageNumber = this.page;
      queryParams.pageSize = this.record;
      queryParams.more = this.more;
      this.DanhMucChungService.getDSCongViec(queryParams).subscribe((res) => {
        //this.layoutUtilsService.OffWaitingDiv();
        if (res && res.status == 1) {
          this.isGov = res.isgov;
          this.AllPage = res.page.AllPage;
          this.dscongviec = res.data;
          this.dscongviec.forEach((element) => {
            if (element.deadline == "" || element.deadline == undefined) {
              element.deadline = undefined;
            } else {
              element.deadline = moment(element.deadline, [
                'HH:mm DD/MM/YYYY',
              ]).format();
            }
            element.editTitle = false;
            element.oldDeadline = element.deadline;
          });
        } else {
          this.dscongviec = [];
        }
        this.dataSource.data = this.dscongviec;
        this.changeDetectorRefs.detectChanges();
      });
    }

  }
  loadFilterTrinhTrang() {
    this.lsttinhtrang.forEach(ele => {
      let t = {
        name: ele.StatusName,
        checked: false,
        id: ele.RowID,
      }
      let index = this.TinhTrang.findIndex(x => x.id == ele.id_row);
      if (index == -1) {
        this.TinhTrang.push(t);
      }
    })
  }
  lsttinhtrang;
  loadlistTinhTrangbyProject() {
    this.DanhMucChungService.getListStatusByProject(this.id_project_team).subscribe((res) => {
      if (res) {
        if (res.status == 1) {
          this.lsttinhtrang = res.data;
          this.TinhTrang = [];
          this.loadFilterTrinhTrang();
        } else {
          this.layoutUtilsService.showError(res.error.message);
        }
      }
    })
  }
  CheckDeadLine(element) {
    if (!element.deadline) {
      return true;
    }
    return false;
  }
  filterConfiguration(
    id_project_team: any,
    filter: any,
    TuNgay: any,
    DenNgay: any,
    tien_do: any,
    loaicongviec: any,
    clickup_prioritize: any,
    id_tag: any,
    IsProgress: any,
    keyword: any,
    loaicv: any,
    id_department: any,
    id_user_giao: any,
    collect_by: any,
    all: any,
    id_user_tao: any,
    meetingid: number
  ): any {
    const filterNew: any = {
      id_project_team: id_project_team,
      filter: filter,
      TuNgay: TuNgay,
      DenNgay: DenNgay,
      tien_do: tien_do,
      loaicongviec: loaicongviec,
      clickup_prioritize: clickup_prioritize,
      id_tag: id_tag,
      IsProgress: IsProgress,
      keyword: keyword,
      loaicv: loaicv,
      meetingid: meetingid,
      id_department: id_department,
      id_user_giao: id_user_giao,
      collect_by: collect_by,
      all: all,
      id_user_tao: id_user_tao
    };
    return filterNew;
  }
  filterConfigurationForProject(
    id_project_team: any,
    tien_do: any,
    loaicongviec: any,
    clickup_prioritize: any,
    id_tag: any,
    IsProgress: any,
    keyword: any,
    filter: any,
  ): any {
    const filterNew: any = {
      id_project_team: id_project_team,
      tien_do: tien_do,
      loaicongviec: loaicongviec,
      clickup_prioritize: clickup_prioritize,
      id_tag: id_tag,
      IsProgress: IsProgress,
      keyword: keyword,
      filter: filter,
    };
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
    // let listScroll = document.getElementById('listScroll');
    // if (listScroll !== null) {
    //   listScroll.scrollIntoView();
    //   listScroll = null;
    // }
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

    if (this.idMenu == '4' || this.idMenu == '7') {
      let t = this.TinhTrang.filter(t => t.checked);
      let a = '';
      for (let index = 0; index < t.length; index++) {
        const element = t[index];
        a = a + element.name;
        if (index != t.length - 1) {
          a = a + ', '
        }
      }
      this.tinhtrangSelected.viewValue = a;
      if (this.tinhtrangSelected.viewValue == "") {
        this.tinhtrangSelected = { value: '0', viewValue: 'Tất cả' };
      }
      let id = t.map(a => a.id);
      let tr = id.toString();
      this.IsProgress = tr;
    } else {
      this.tinhtrangSelected = val;
      this.IsProgress = this.tinhtrangSelected.value;
    }
    this.LoadData();
  }
  allComplete;
  updateAllComplete() {
    this.allComplete = this.TinhTrang != null && this.TinhTrang.every(t => t.checked);
  }
  someComplete(): boolean {
    if (this.TinhTrang == null) {
      return false;
    }
    return this.TinhTrang.filter(t => t.checked).length > 0 && !this.allComplete;
  }
  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.TinhTrang == null) {
      return;
    }
    this.TinhTrang.forEach(t => (t.checked = completed));
  }
  searchByKeyword(val) {
    this.page = 0;
    this.flag = true;
    this.keyword = val.target.value;
    this.LoadData();
  }
  searchTags(val) {
    this.findtag = val.target.value;
    this.listAllTag(this.findtag);
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
    this.router.navigateByUrl(`WorkV2/detail/${val}`);
  }
  getoptions_assign(val) {
    this.DanhMucChungService.gov_account_assignee_by_project(val).subscribe((res) => {
      if (res && res.status == 1) {
        this.options_assign_new = res.data;
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
    // val.clickup_prioritize = Number(clickup_prioritize.value);
    // this.changeDetectorRefs.detectChanges();
  }
  changeTinhTrangInTable(val, val1) {
    this.updateItem(val, Number(val1.id_row), 'status');
    // val.StatusInfo[0].color = val1.color;
    // val.StatusInfo[0].statusname = val1.statusname;
    // val.StatusInfo[0].typeid = val1.typeid;

    // this.changeDetectorRefs.detectChanges();
  }
  changeHanChotInTable(val, val1) {
    this.updateItem(val, val1, 'deadline');
    // val.StatusInfo[0].color = val1.color;
    // val.StatusInfo[0].statusname = val1.statusname;
    // val.StatusInfo[0].typeid = val1.typeid;
    // this.changeDetectorRefs.detectChanges();
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
    // if (val.id_nv) {
    //     val.userid = val.id_nv;
    // }
    // this.UpdateByKeyNew(task, 'assign', val.userid);
  }
  updateItem(val: any, newvalue: any, key: any) {
    this.item = { values: [], id_row: val.id_row, key: key, value: newvalue };
    //this.layoutUtilsService.showWaitingDiv();
    this.DanhMucChungService.updateTask(this.item).subscribe((res) => {
      //this.layoutUtilsService.OffWaitingDiv();
      if (res && res.status == 1) {
        this.page = 0;
        this.LoadData();
        // this.DanhMucChungService.send$.next('LoadMenu');
      } else {
        val.deadline = val.oldDeadline;
        this.changeDetectorRefs.detectChanges();
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
    this.DanhMucChungService.listTinhTrangDuAn(
      val.id_project_team,
      val.id_row
    ).subscribe((res) => {
      if (res && res.status == 1) {
        this.listStatus = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }
  themMoiNhiemVu() {
    var data = null; //call api
    this.openModal(
      'Title1',
      'Message Test',
      () => {
        //confirmed
        // console.log('Yes');
      },
      () => {
        //not confirmed
        // console.log('No');
      }
    );
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
      idMeeting: this.meetingid
    };
    dialogConfig.disableClose = true;
    // dialogConfig.width = '40vw';
    // dialogConfig.panelClass = 'my-custom-dialog-class';
    let dialogRef;
    if (this.isGov) {
      dialogConfig.panelClass = ['my-custom-dialog-class', 'width900']
      dialogRef = this.dialog.open(ThemMoiCongViecComponent, dialogConfig);
    }

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
    let result = text.length > 100 ? text.slice(0, 100) + '...' : text;
    return result;
  }
  submit(val, element) {
    // if (val != true) {
    //   if (!element.num_comment) {
    //     element.num_comment = 0;
    //   }
    //   element.num_comment = element.num_comment + 1;
    // }
  }
  minimizeText(text) {
    if (text) {
      if (text.length > 16) {
        return text.slice(0, 16) + '...';
      }
      return text;
    }
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
    const ele = document.getElementById(
      'task' + element.id_row
    ) as HTMLInputElement;
    element.title = ele.value;

    this.updateItem(element, element.title, 'title');
  }
  changeTitleInTable(event, element) {
    // let temp = event.target.value;
    // if (temp != element.title) {
    //   element.title = temp;
    // }
    // element.editTitle = false;
    const ele = document.getElementById(
      'task' + element.id_row
    ) as HTMLInputElement;
    element.title = ele.value;
    this.updateItem(element, element.title, 'title');
  }
  //====================Start Các hàm xét quyền để sử dụng==============================
  CheckRules1(RuleID: number, element) {
    // if (element.IsAdmin) {
    //   return true;
    // }
    // const x = element.Rule.find(x => x.id_row === id_project_team);
    // if (x) {
    //     if (x.locked) {
    //         return false;
    //     }
    // }
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
    return true;
    // if (element.IsAdmin) {
    //   return true;
    // }
    // if (element.Rule) {
    //   if (element) {
    //     if (
    //       element.IsAdmin === true ||
    //       +element.admin === 1 ||
    //       +element.owner === 1 ||
    //       +element.parentowner === 1
    //     ) {
    //       return true;
    //     } else {
    //       if (
    //         key === 'title' ||
    //         key === 'description' ||
    //         key === 'status' ||
    //         key === 'checklist' ||
    //         key === 'delete'
    //       ) {
    //         if (element.Rule.find((r) => r.id_Rule === 15)) {
    //           return false;
    //         }
    //       }
    //       if (key === 'deadline') {
    //         if (element.Rule.find((r) => r.id_Rule === 16)) {
    //           return false;
    //         }
    //       }
    //       if (key === 'id_nv' || key === 'assign') {
    //         if (element.Rule.find((r) => r.id_Rule === 17)) {
    //           return false;
    //         }
    //       }
    //       const r = element.Rule.find((Rule) => Rule.keypermit == key);
    //       if (r) {
    //         return true;
    //       } else {
    //         return false;
    //       }
    //     }
    //   } else {
    //     return false;
    //   }
    // }
    // return false;
  }

  CheckClosedTask(element) {
    if (element.closed) {
      return false;
    } else {
      return true;
    }
  }
  openPopupDetail(element) {
    // var data = null; //call api
    // this.openModalDetail(
    //   'Title1',
    //   'Message Test',
    //   element,
    // );
    this.router.navigate([
      '',
      { outlets: { auxName: 'auxWork/DetailsGOV/' + element.id_row } },
    ]);
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
    // dialogConfig.panelClass = 'popup';
    // const dialogRef = this.dialog.open(
    //   DetailTaskComponentComponent,
    //   dialogConfig
    // );

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result != undefined) {
    //     this.ngOnInit();
    //   }
    // });
  }
  RemoveTag(value, element) {
    // let index = element.Tags.indexOf(value);
    // element.Tags.splice(index, 1);
    this.updateItem(element, value.id_row, 'Tags');
  }
  // ReloadData(event){

  // }
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
    this.updateItem(element, val.rowid, 'Tags');
  }
  DeleteTask(element) {
    this.DanhMucChungService.DeleteTask(element.id_row).subscribe((res) => {
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
      // this.CheckRules(13, element) ||
      this.CheckRuleskeypermit('update_storage', element)
      // this.CheckRules(7, element)
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
    //this.layoutUtilsService.showWaitingDiv();
    if (this.idMenu != 4) {
      queryParams = new QueryParamsModel(
        this.filterConfiguration(
          this.id_project_team,
          this.filter,
          this.tungay,
          this.denngay,
          this.tien_do,
          this.loaicongviec,
          this.clickup_prioritize,
          this.id_tag,
          this.IsProgress,
          this.keyword,
          this.idMenu,
          this.idDept,
          this.idUser,
          this.CollectBy,
          this.all,
          this.id_user_tao,
          this.meetingid
        )
      );
      queryParams.sortOrder = this.sortOrder;
      queryParams.sortField = this.sortField;
      queryParams.pageNumber = this.page;
      queryParams.pageSize = this.record;
      queryParams.more = this.more;
      this.DanhMucChungService.getDSCongViec(queryParams).subscribe((res) => {
        //this.layoutUtilsService.OffWaitingDiv();
        if (res && res.status == 1) {
          this.isGov = res.isgov;
          // this.isGov=true;
          let newList = res.data;
          newList.forEach((element) => {
            if (element.deadline == "" || element.deadline == undefined) {
              element.deadline = '';
            } else {
              element.deadline = moment(element.deadline, [
                'HH:mm DD/MM/YYYY',
              ]).format();
            }
            element.editTitle = false;
            this.dataSource.data.push(element);
          });
          this.dataSource._updateChangeSubscription();
          this.flag = true;
        }
      });
    } else {
      queryParams = new QueryParamsModel(
        this.filterConfigurationForProject(
          this.id_project_team,
          this.tien_do,
          this.loaicongviec,
          this.clickup_prioritize,
          this.id_tag,
          this.IsProgress,
          this.keyword,
          this.filter
        )
      );
      queryParams.sortOrder = this.sortOrder;
      queryParams.sortField = this.sortField;
      queryParams.pageNumber = this.page;
      queryParams.pageSize = this.record;
      queryParams.more = this.more;
      this.DanhMucChungService.getDSNhiemVuByProject(queryParams).subscribe(
        (res) => {
          //this.layoutUtilsService.OffWaitingDiv();
          if (res && res.status == 1) {
            this.isGov = res.isgov;
            // this.isGov=true;
            let newList = res.data;
            newList.forEach((element) => {
              if (element.deadline == "" || element.deadline == undefined) {
                element.deadline = '';
              } else {
                element.deadline = moment(element.deadline, [
                  'HH:mm DD/MM/YYYY',
                ]).format();
              }
              element.editTitle = false;
              this.dataSource.data.push(element);
            });
            this.dataSource._updateChangeSubscription();
            this.flag = true;
          }
        }
      );
    }
  }
  checkOverTime(deadline) {
    let date = Date();
    let a = 0;
    // let dateOne = new Date(moment(deadline, ["HH:mm DD/MM/YYYY"]).format("HH:mm DD/MM/YYYY"));
    let dateTwo: any = moment(date).format('HH:mm DD/MM/YYYY');
    let dldate = moment(deadline).format();
    let currdate = moment(date).format();
    if (currdate > dldate) {
      return true;
    }
    return false;
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
  list_priority = [
    {
      name: 'All',
      value: 0,
      icon: '',
    },
    {
      name: 'Noset',
      value: 5,
      icon: 'grey-flag',
    },
    {
      name: 'Urgent',
      value: 1,
      icon: 'red-flag',
    },
    {
      name: 'High',
      value: 2,
      icon: 'yellow-flag',
    },
    {
      name: 'Normal',
      value: 3,
      icon: 'blue-flag',
    },
    {
      name: 'Low',
      value: 4,
      icon: 'low-flag',
    },
  ];
  //======================Bổ sung gọi load lại list task nếu xem task new==================
  onEventLoadListTask(e: CustomEvent) {
    if (e.detail.eventType === 'update-task') {
      this.LoadData();
    }
    if (e.detail.eventType === 'count-isnew') {
      this.LoadData();
    }
  }

  checkViewAll() {
    // if (this.idMenu == "6") {
    //   let _item = {
    //     "appCode": "WORKV2",
    //     "mainMenuID": 12,
    //     "subMenuID": 7,
    //     "itemID": 0,
    //   }
    //   this.socketioService.readNotification_menu(_item).subscribe(res => {
    //     //event để reload lại mainmenu
    //     const busEvent = new CustomEvent('event-mainmenu', {
    //       bubbles: true,
    //       detail: {
    //         eventType: 'update-main',
    //         customData: 'some data here'
    //       }
    //     });
    //     dispatchEvent(busEvent);
    //     this.LoadData();
    //   })
    // } else {
    //   if (this.dataSource.data.length > 0) {
    //     for (let i = 0; i < this.dataSource.data.length; i++) {
    //       const element = this.dataSource.data[i];
    //       if (element.isnewchange) {
    //         let _item = {
    //           "appCode": "WORKV2",
    //           "mainMenuID": 12,
    //           "subMenuID": 7,
    //           "itemID": element.id_row,
    //         }
    //         this.socketioService.readNotification_menu(_item).subscribe(res => {
    //           //event để reload lại mainmenu
    //           const busEvent = new CustomEvent('event-mainmenu', {
    //             bubbles: true,
    //             detail: {
    //               eventType: 'update-main',
    //               customData: 'some data here'
    //             }
    //           });
    //           dispatchEvent(busEvent);
    //         })
    //       }
    //     }
    //     this.LoadData();
    //   }
    // }
  }
}
