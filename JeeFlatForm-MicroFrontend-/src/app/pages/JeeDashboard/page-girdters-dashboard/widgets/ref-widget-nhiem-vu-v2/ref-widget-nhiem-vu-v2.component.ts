import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
// import { _WorkGeneralService } from '../../services/danhmuc.service';
import moment from 'moment';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
// import { UpdateModel } from '../../detail-task-component/detail-task-component.component';
// import { ThemMoiCongViecKhongVanBanComponent } from '../them-moi-cong-viec-khong-van-ban/them-moi-cong-viec-khong-van-ban.component';
import { MatTableDataSource } from '@angular/material/table';
import { fromEvent } from 'rxjs';
import { WorkGeneralService } from '../../Services/work-general.services';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { PageGirdtersDashboardService } from '../../Services/page-girdters-dashboard.service';
// import { ThemMoiCongViecVer2Component } from '../them-moi-cong-viec-ver2/them-moi-cong-viec-ver2.component';
// import { SwitchHandlerComponent } from '../switch-handler/switch-handler.component';
interface dropdown {
  value: string;
  viewValue: string;
}

interface dropdownTienDo {
  value: string;
  viewValue: string;
  checked: boolean;
}

interface modelUpdate {
  values: [];
  id_row: number;
  key: string;
  value: string;
  ReasonRefuse: string;
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
  selector: 'ref-app-widget-nhiem-vu-v2',
  templateUrl: './ref-widget-nhiem-vu-v2.component.html',
  styleUrls: ['./ref-widget-nhiem-vu-v2.component.scss'],
})
export class RefWidgetNhiemVuVer2Component implements OnInit, OnChanges {
  displayedColumns: string[] = [
    'nhiemvu',
    'donvithuchien',
    'hanchot',
    'tiendo',
    'taonhiemvu',
    'binhluan',
    // 'tinhtrang',
    // 'giaocho',
    // 'nguoitao',
    'dondoc',
    'actions',
  ];
  douutien;
  TinhTrang = [];
  filterTinhTrang;
  tinhtrang: dropdown[] = [
    { value: '0', viewValue: 'Tất cả' },
    { value: '1', viewValue: 'Mới tạo' },
    { value: '2', viewValue: 'Đang thực hiện' },
    { value: '3', viewValue: 'Hoàn thành' },
  ];

  tiendo: dropdownTienDo[] = [
    { value: '1', viewValue: 'Hoàn thành đúng hạn', checked: false },
    { value: '2', viewValue: 'Hoàn thành quá hạn', checked: false },
    { value: '3', viewValue: 'Còn trong hạn', checked: false },
    { value: '4', viewValue: 'Sắp tới hạn', checked: false },
    { value: '5', viewValue: 'Tới hạn', checked: false },
    { value: '6', viewValue: 'Quá hạn', checked: false },
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
  id_project_team: any;
  TagsIDFilter: any;
  tien_do: any;
  config_filter: any;//Thay thế tiến độ -> chọn nhiều
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
  isReadAll: boolean = false;
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
  param1: string;
  //===============================================
  isClickNhacNho: boolean = false;// 28/11/2023
  @Input() dataLazyLoad: any = [];
  @Input() isgov: any = false;
  @Input() crr_page: any;
  @Input() total_page: any;
  @Input() isLoading: any;
  @Output() LoadDataLazy = new EventEmitter<any>();
  constructor(
    public _WorkGeneralService: WorkGeneralService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router,
    private layoutUtilsService: LayoutUtilsService,
    public dialog: MatDialog,
    private _PageGirdtersDashboardService: PageGirdtersDashboardService,
  ) {
    this.UserID = this._PageGirdtersDashboardService.getAuthFromLocalStorage().user.customData["jee-account"].userID;
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.LoadData();
  }
  ngOnInit(): void {
    this._WorkGeneralService.getthamso();
    this.douutienintable = this._WorkGeneralService.list_priority;
    this.douutien = this.list_priority;
    this.clickup_prioritizeSelected = this.douutien[0];
    //============Bổ sung load lại danh sách nếu xem nhiệm vụ mới=============
    const $eventload = fromEvent<CustomEvent>(window, 'event-list-task').subscribe((e) => this.onEventLoadListTask(e));
    const $eventloadstatus = fromEvent<CustomEvent>(window, 'event-list-task-status').subscribe((e) => this.onEventLoadListTask(e));
  }

  countNV: number = 0;
  ListAllStatusDynamic: any = [];
  UserID = 0;
  LoadData() {
    this.isGov = this.isgov;
    this.dataSource.data = this.dataLazyLoad;
    this.changeDetectorRefs.detectChanges();
  }

  CheckDeadLine(element) {
    if (!element.deadline) {
      return true;
    }
    return false;
  }

  changeDoUuTien(val) {
    this.page = 0;
    this.flag = true;
    this.clickup_prioritizeSelected = val;
    this.clickup_prioritize = this.clickup_prioritizeSelected.value;
    this.LoadData();
  }
  //==========Start - Xử lý tiến độ======
  changeTienDo() {
    this.page = 0;
    this.flag = true;

    let t = this.tiendo.filter(t => t.checked);
    let a = '';
    for (let index = 0; index < t.length; index++) {
      const element = t[index];
      a = a + element.viewValue;
      if (index != t.length - 1) {
        a = a + ', '
      }
    }
    this.tiendoSelected.viewValue = a;
    if (this.tiendoSelected.viewValue == "") {
      this.tiendoSelected = { value: '0', viewValue: 'Tất cả' };
    }

    let id = t.map(a => a.value);
    let tr = id.toString();
    this.config_filter = tr;

    this.LoadData();
  }
  allTienDo;
  updateAllTienDo() {
    this.allTienDo = this.tiendo != null && this.tiendo.every(t => t.checked);
  }

  someCompleteTienDo(): boolean {
    if (this.tiendo == null) {
      return false;
    }
    return this.tiendo.filter(t => t.checked).length > 0 && !this.allTienDo;
  }
  setAllTienDo(completed: boolean) {
    this.allTienDo = completed;
    if (this.tiendo == null) {
      return;
    }
    this.tiendo.forEach(t => (t.checked = completed));
  }
  //==========End - Xử lý tiến độ======
  changeThe(val) {
    this.page = 0;
    this.flag = true;
    this.theSelected = val;
    this.id_tag = this.theSelected.value;
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
    let a = moment(val + 'Z', ['HH:mm DD/MM/YYYY']).format('HH:mm DD/MM/YYYY');
    if (a == 'Invalid date') {
      a = moment(val + 'Z').format('HH:mm DD/MM/YYYY');
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
    let a = moment(val + 'Z', ['HH:mm DD/MM/YYYY']).format('HH:mm DD/MM/YYYY');
    if (a == 'Invalid date') {
      a = moment(val + 'Z').format('HH:mm DD/MM/YYYY');
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

  changeDoUuTienInTable(val, clickup_prioritize) {
    this.updateItem(
      val,
      Number(clickup_prioritize.value),
      'clickup_prioritize'
    );
  }
  changeTinhTrangInTable(val, val1) {
    if (val1.isRefuse == 1) {
      this.router.navigate(['', { outlets: { auxName: 'auxWork/DashUpdateProgress/status/' + val.id_row + '/' + val1.id_row + '/' + val1.statusname }, }]);
      // const dialogRef = this.dialog.open(EditorJeeWorkComponent, {
      //   data: { _value: 'status', statusname: val1.statusname },
      //   width: '55%',
      //   panelClass: ['editor-v2']
      // });
      // dialogRef.componentInstance.is_status = true;
      // dialogRef.afterClosed().subscribe((res) => {
      //   if (!res) {
      //     return;
      //   }
      //   val.ReasonRefuse = res._result;
      //   this.updateItem(val, Number(val1.id_row), 'status');
      // });
      // return false;
    } else {
      this.updateItem(val, Number(val1.id_row), 'status');
    }
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
    this.item = { values: [], id_row: val.id_row, key: key, value: newvalue, ReasonRefuse: val.ReasonRefuse };
    this.layoutUtilsService.showWaitingDiv();
    this._WorkGeneralService.updateTask(this.item).subscribe((res) => {
      this.layoutUtilsService.OffWaitingDiv();
      if (res && res.status == 1) {
        this.eventReloadWidget();
      } else {
        if (key == 'title') {
          this.LoadData();
        }
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
    this._WorkGeneralService.ListStatusDynamicNew(
      val.id_project_team,
      val.id_row
    ).subscribe((res) => {
      if (res && res.status == 1) {
        this.listStatus = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  RemoveAssign(element) {
    this.updateItem(element, Number(element.User.id_nv), 'assign');
  }
  getTitle(text) {
    let result = text.length > 100 ? text.slice(0, 100) + '...' : text;
    return result;
  }
  submit(val, element) {
    if (val != true) {
      if (val == "delete") {
        element.comments = element.comments - 1;
      } else {
        element.comments = element.comments + 1;
      }
    }
  }
  getminimizenText(text) {
    let cd = 16;
    let c = window.innerWidth;
    if (c < 1920) {
      if (c <= 1280) {
        cd = 5;
      } else {
        cd = 10;
      }
    }
    if (text) {
      if (text.length > cd) {
        return text;
      }
      return "";
    }
    return "";
  }
  minimizeText(text) {
    let cd = 16;
    let c = window.innerWidth;
    if (c < 1920) {
      if (c <= 1280) {
        cd = 5;
      } else {
        cd = 10;
      }
    }
    if (text) {
      if (text.length > cd) {
        return text.slice(0, cd) + '...';
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
    const ele = document.getElementById(
      'task' + element.id_row
    ) as HTMLInputElement;
    element.title = ele.value;
    this.updateItem(element, element.title, 'title');
  }
  //====================Start Các hàm xét quyền để sử dụng==============================
  CheckRules1(RuleID: number, element) {
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
  }

  CheckClosedTask(element) {
    if (element.closed) {
      return false;
    } else {
      return true;
    }
  }
  openPopupDetail(element) {
    this.router.navigate([
      '',
      { outlets: { auxName: 'auxWork/DetailsGOV/' + element.id_row } },
    ]);
  }

  checkRule: boolean = false;
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
    this.updateItem(element, val.rowid, 'Tags');
  }

  
  SaveWork(element) {
    if (!element.isStorage) {
      this.updateItem(element, 1, 'isStorage');
    }
  }

  chuyenXuLy(element) {
    if (this.isGov) {
      this.router.navigate(['', { outlets: { auxName: 'auxWork/DashChangeUser/' + element.id_row }, }]);
    }
  }

  UpdateTienDo(element) {
    this.router.navigate(['', { outlets: { auxName: 'auxWork/DashUpdateProgress/progress/' + element.id_row }, }]);
  }
  ClosedTask(element, check) {
    this.updateItem(element, check, 'closed');
  }
  CheckShow(element) {
    if (
      this.CheckRuleskeypermit('update_storage', element)
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
      if (this.crr_page + 1 < this.total_page && !this.isLoading) {
        this.LoadDataLazy.emit(true);
      }
    }
  }

  checkOverTime(deadline) {
    let date = Date();
    let a = 0;
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
        return '#50CD89';//old - #3699FF
      case '2':
        return '#A0522D';//old - #385C69
      case '3':
        return '#3E97FF';//old - #13C07C
      case '4':
        return '#8A50FC';//old - #EEB108
      case '5':
        return '#FFA800';//old - #EC641B
      case '6':
        return '#F64D60';//old - #FF0000
      default:
        return '#272524';//old - #272524
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
      this.LoadDataLazy.emit(false);
    }
    if (e.detail.eventType === 'update-task-status') {
      setTimeout(() => {
        this.LoadDataLazy.emit(false);
      }, 500);
    }
  }
  //==============Xử lý cho phần hiển thị tài liệu====================
  ShowXemTruoc(item) {
    let show = false;
    let obj = item.filename.split('.')[item.filename.split('.').length - 1];
    if (
      obj == 'jpg' ||
      obj == 'png' ||
      obj == 'jpeg' ||
      obj == 'xls' ||
      obj == 'xlsx' ||
      obj == 'doc' ||
      obj == 'docx' ||
      obj == 'pdf'
    ) {
      show = true;
    }
    return show;
  }

  preview(file) {
    if (file.isImage || file.type == 'png') {
      this.DownloadFile(file.path);
    } else {
      // this.layoutUtilsService.ViewDoc(file.path);
    }
  }

  DownloadFile(link) {
    window.open(link);
  }

  //=====================Xử lý cho column tạo công việc==================
  viewChild(item) {
    this.router.navigate(['', { outlets: { auxName: 'auxWork/DashListChild/' + item.id_row }, }]);
  }

  themMoiNhiemVuChild(item) {
    this.router.navigate(['', { outlets: { auxName: 'auxWork/DashAddChillGOV2/' + item.id_row }, }]);
  }
  openModalChild(
    title: string,
    message: string,
    yes: Function = null,
    no: Function = null,
    data: any
  ) {
    // let dataDetailTask = {
    //   Gov_SoHieuVB: data.Gov_SoHieuVB,
    //   Gov_TrichYeuVB: data.Gov_TrichYeuVB,
    //   Gov_NgayVB: data.Gov_NgayVB,
    //   Gov_Nguoiky: data.Gov_Nguoiky,
    //   Gov_Donvibanhanh: data.Gov_Donvibanhanh,
    //   IsGiaoVB: data.IsGiaoVB,
    //   deadline: moment(data.deadline).format(
    //     'MM/DD/YYYY HH:mm'
    //   ),
    //   clickup_prioritize: data.clickup_prioritize,
    //   id_row: data.id_row,
    // }
    // const dialogConfig = new MatDialogConfig();
    // dialogConfig.autoFocus = true;
    // dialogConfig.disableClose = true;
    // dialogConfig.data = {
    //   title: title,
    //   message: message,
    //   dataDetailTask: dataDetailTask,
    // };
    // dialogConfig.width = '40vw';
    // let item;
    // if (this.isGov) {
    //   item = ThemMoiCongViecVer2Component;
    // } else {
    //   item = ThemMoiCongViecKhongVanBanComponent;
    // }
    // const dialogRef = this.dialog.open(item, dialogConfig);

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (result != undefined) {
    //     this.eventReloadWidget();
    //   }
    // });
  }
  //=================================================================================
  getTienDo(element, type) {
    if (type == "style") {
      if (element.StatusInfo.length > 0 && element.StatusInfo[0].Type == 4) {
        return '#3E97FF';
      } else {
        return 'orange';
      }
    } else {
      return element.progress;
    }
  }

  //=================================================================
  //==================Xử lý ẩn button===================
  getDisplay(element, stt) {
    if (element) {
      if (element.StatusInfo.length > 0 && element.StatusInfo[0].id_row == stt.id_row) {
        return 'none'
      }
      return 'content';
    }
    return 'none';
  }

  //====================================================================
  CheckRefuse(_data) {
    if (_data && (_data.User && _data.User.id_nv == +this.UserID) && _data.StatusInfo.length > 0 && _data.StatusInfo[0].Type != 4) return true;
    return false;
  }

  RefuseWork(_data) {
    const _title = 'Từ chối nhiệm vụ';
    const _description = 'Bạn có chắc muốn từ chối nhiệm vụ này không?';
    const _waitDesciption = "Dữ liệu đang được xử lý";

    const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
    dialogRef.afterClosed().subscribe(res => {
      if (!res) {
        return;
      }
      this.update('refuse_work', _data);
    });
  }

  update(key: string, val) {

    // let model = new UpdateModel();
    // model.emty();
    // model.key = key;
    // model.id_row = val.id_row;

    // this._WorkGeneralService.updateTask(model).subscribe((res) => {
    //   if (res) {
    //     if (res.status == 1) {
    //       this.eventReloadWidget();
    //     } else {
    //       this.layoutUtilsService.showActionNotification(
    //         res.error.message,
    //         MessageType.Read,
    //         9999999999,
    //         true,
    //         false,
    //         3000,
    //         'top',
    //         0
    //       );
    //     }
    //   }
    // });
  }

  eventReloadWidget() {
    //Xử lý reload data các widget khác khi cập nhật trên widget hiện tại 29/11/2023
    const busEvent1 = new CustomEvent('event-reload-widget', {
      bubbles: true,
      detail: {
        eventType: 'load-data',
        customData: 'some data here'
      }
    });
    dispatchEvent(busEvent1);
  }

  getoptions_assign(val) {
    this._WorkGeneralService.gov_account_assignee_by_project(val).subscribe((res) => {
      if (res && res.status == 1) {
        this.options_assign_new = res.data;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  //===============Bổ sung cột đôn đốc yêu cầu 11/1/2024==================================================================
  getDonDoc(element, type) {
    if (type == "style") {
      if (element.StatusInfo.length > 0 && element.StatusInfo[0].Type == 4) {
        return '#3E97FF';
      } else {
        return '#orange';
      }
    } else {
      if (+element.Urges.length > 0) {
        return element.Urges[0].NgayVB;
      } else {
        return '';
      }
    }
  }

  UpdateDonDoc(element) {
    this.router.navigate(['', { outlets: { auxName: 'auxWork/DashUpdateUrges/urges/' + element.id_row }, }]);
  }

  DeleteTask(element) {
    this.router.navigate(['', { outlets: { auxName: 'auxWork/DashDeleteTask/delete/' + element.id_row }, }]);
  }
}
