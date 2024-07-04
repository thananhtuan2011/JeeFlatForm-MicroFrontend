import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, of, ReplaySubject, Subject, throwError } from "rxjs";
import { BaoCaoService } from "../services/bao-cao.services";
import { TranslateService } from "@ngx-translate/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import * as moment from "moment";
import { QueryParamsModel } from "../../../models/query-models/query-params.model";
import { NhiemVuDuocGiaoModel } from "../../../models/jee-work.model";
import { environment } from "projects/jeework-v1/src/environments/environment";
import { HttpUtilsService } from "projects/jeework-v1/src/modules/crud/utils/http-utils.service";

@Component({
  selector: "app-bao-cao-theo-doi-nhiem-vu-da-giao",
  templateUrl: "./bao-cao-theo-doi-nhiem-vu-da-giao.component.html",
  styleUrls: ["./bao-cao-theo-doi-nhiem-vu-da-giao.component.scss"],
})
export class BaoCaoTheoDoiNhiemVuDaGiaoComponent implements OnInit {

  dt: NhiemVuDuocGiaoModel;
  listData: any[] = [];
  listData_Tong: any[] = [];
  dataLazyLoad: any = [];
  dataLazyLoad_ID: any = []; //Bổ sung ngày 11/10/2022 dùng để lấy danh sách id đánh dấu đã xem

  listDropDown: any = [];
  public IDDrop: string = "";
  labelCongViec: string = "";

  labelTimKiem: string = "Tìm kiếm";
  keyword = "";

  labelDuAn: string = "";
  idDuAn: string = "";
  listDuAn: any[] = [];
  labelTienDo: string = "Tất cả";
  idTienDo: string = "0";

  listNhanVien: any[] = [];
  ID_NV: number = 0;
  List_ID_NV: string = "";
  label_NV: string = "Tất cả";

  labelTinhTrang: string = "Tất cả";
  idTinhTrang: string = "1";
  listTinhTrang: any[] = [];
  labelTinhTrangDuAn: string = "Tất cả";
  idTinhTrangDuAN: string = "";

  ShowMain: boolean = false;
  DataID: any = 0;
  DataID_Project: any = 0;
  UserID = 0;
  isclosed = true;
  disabledBtn = false;
  showsuccess = false;
  loading = true;
  loadTags = false;
  chinhsuamota = false;
  newtask = true;
  topicObjectID$: BehaviorSubject<string> = new BehaviorSubject<string>("");

  isnew: boolean = false; //Ẩn hiện nhấp nháy

  //====================Dự án====================
  public bankFilterCtrlDuAn: FormControl = new FormControl();
  public filteredBanksDuAn: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  //====================Nhân viên cấp dưới====================
  public bankFilterCtrlNhanVien: FormControl = new FormControl();
  public filteredBanksNhanVien: ReplaySubject<any[]> = new ReplaySubject<any[]>(
    1
  );
  //==========Dropdown Search==============
  filter: any = {};
  //============================================================
  listField: any[] = [];
  isEdittitle = -1;
  list_role: any = [];
  IsAdminGroup = false;
  filterCongvieccon: boolean = false;
  crr_page = 0;
  page_size = 20;


  public column_sort: any = [];
  type_sort: any;

  @Input() startDate: "";
  @Input() endDate: "";
  @Input() id_project_team = 0;
  @Input() collect_by = "";
  @Input() id_department = 0;


  Team = 0;
  Departmemnt = 0;
  type_collect = "";

  colorCrossbar = ['#3699ff', '#EEB108', '#EC641B', '#FF0000', '#13C07C'];
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public BaoCaoService: BaoCaoService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translate: TranslateService,
    private router: Router,
    private httpUtils: HttpUtilsService
  ) { }
  ngOnInit(): void {
    // set ngày filter
    setInterval(() => {
      this.isnew = !this.isnew;
      this.changeDetectorRef.detectChanges();
    }, 1000);


    if (this.Departmemnt != undefined) {
      this.getdata();
    }

    this.changeDetectorRef.detectChanges();

  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.startDate != null && changes.startDate != undefined) {
      this.filterDay.startDate = changes.startDate.currentValue;
    }
    if (changes.endDate != null && changes.endDate != undefined) {
      this.filterDay.endDate = changes.endDate.currentValue;
    }


    if (changes.id_project_team != null && changes.id_project_team != undefined) {
      this.Team = changes.id_project_team.currentValue;
    }
    if (changes.collect_by != null && changes.collect_by != undefined) {
      this.type_collect = changes.collect_by.currentValue;
    }
    if (changes.id_department != null && changes.id_department != undefined) {
      this.Departmemnt = changes.id_department.currentValue;
    }


    if (this.Departmemnt != undefined) {
      this.getdata();
    }


    this.changeDetectorRef.detectChanges();

    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values

  }



  clearData() {
    this.listData = [];
    this.listData_Tong = [];
  }

  getdata() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      "asc",
      "",
      this.crr_page,
      this.page_size
    );
    this.BaoCaoService.getReportTheoDoiNhiemVuDaGiao(queryParams).subscribe((res) => {
      if (res && res.status == 1) {

        this.listData = res.data;
        console.log("list data 123456789", this.listData);
        this.listData_Tong = res.isgov;
        this.dt = new NhiemVuDuocGiaoModel();
        this.dt.Data = this.listData;
        this.dt.Tong_data = this.listData_Tong;

      }
    });
  }
  ExportExcel() {
    this.BaoCaoService.ExcelBaoCaoTDNVDG(this.dt).subscribe((response) => {
      var headers = response.headers;
      let filename = headers.get('x-filename');
      let type = headers.get('content-type');
      let blob = new Blob([response.body], { type: type });
      const fileURL = URL.createObjectURL(blob);
      var link = document.createElement('a');
      link.href = fileURL;
      link.download = filename;
      link.click();
      //window.open(fileURL, '_blank');
    });
  }

  f_convertDate(p_Val: any) {
    let a = p_Val === "" ? new Date() : new Date(p_Val);
    var date = moment(a).isValid();
    // if (date) {
    //   return (
    //     ("0" + a.getDate()).slice(-2) +
    //     "/" +
    //     ("0" + (a.getMonth() + 1)).slice(-2) +
    //     "/" +
    //     a.getFullYear()
    //   );
    // }
    // else
    //   return null;
    if (date) {
      return (
        ("0" + (a.getMonth() + 1)).slice(-2) +
        "/" +
        ("0" + a.getDate()).slice(-2) +
        "/" +
        a.getFullYear()
      );
    }
    else
      return null;
  }

  filterConfiguration(): any {
    // // let filter: any = {};
    // this.filter.id_department = this.id_department;
    // this.filter.collect_by = this.type_sort;
    // this.filter.TuNgay = this.filterDay.startDate;
    // this.filter.DenNgay = this.filterDay.endDate;
    // this.filter.id_project_team = this.id_project_team;
    // return this.filter;

    this.filter.id_department = this.id_department;
    this.filter.collect_by = this.type_collect;
    this.filter.TuNgay = this.f_convertDate(this.filterDay.startDate).toString();
    this.filter.DenNgay = this.f_convertDate(this.filterDay.endDate).toString();
    this.filter.loaicongviec = 3;
    this.filter.id_project_team = this.id_project_team;
    this.filter.displayChild = 0;
    return this.filter;
  }

  ChangeResult(data: any) {
    if (data == 1) return "X";
    return "";
  }
  getHeight(): any {
    let tmp_height = window.innerHeight - 300;
    return tmp_height + "px";
  }
  Change123(s) {
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  // ExportExcel() {
  //   let filter = this.filterConfiguration();
  //   var request = new XMLHttpRequest();
  //   //var salt = this.datePipe.transform(this.nowDate, "yyyyMMdd");
  //   const API_REPORT = environment.HOST_JEEWORK_API + '/api/report';
  //   var link = API_REPORT + `/Excel-list-task-report?filter.keys=id_department&filter.vals=${this.filter.id_department}`;
  //   link += `&more=${filter.more}&page=${filter.page}&record=${filter.record}`;
  //   request.open("GET", link);
  //   const data = this.auth.getAuthFromLocalStorage();
  //   var _token = data.access_token;
  //   request.setRequestHeader("Authorization", _token);
  //   request.responseType = "arraybuffer";
  //   request.onload = function (e) {
  //     debugger
  //     var file;
  //     let name = "";

  //     if (this.status == 200) {
  //       file = new Blob([this.response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  //       // name = "DanhSachDKKinhDoanh_" + salt + ".xlsx";
  //       name = "ThongKeCongViecTheoPhongBan" + ".xlsx";
  //     } else {
  //       file = new Blob([this.response], { type: 'text/plain' });
  //       name = "ErrorsLog.txt";
  //     }

  //     if (navigator.msSaveBlob) {
  //       return navigator.msSaveBlob(file);
  //     }
  //     console.log("length", file.length);
  //     var df = document.getElementById("downloadFile");
  //     var url = window.URL.createObjectURL(file);
  //     df.setAttribute("href", url);
  //     df.setAttribute("download", name);
  //     df.click();
  //     window.URL.revokeObjectURL(url);
  //   }
  //   request.send();
  // }

  sortField = [
    {
      title: this.translate.instant("day.theongaytao"),
      value: "CreatedDate",
    },
    {
      title: this.translate.instant("day.theothoihan"),
      value: "deadline",
    },
    {
      title: this.translate.instant("day.theongaybatdau"),
      value: "start_date",
    },
  ];
  SelectedField(item) {
    this.column_sort.title = item.title;
    this.type_sort = item.value
    //this.UpdateInfoProject();
    //this.LoadData();
    this.clearData();
    this.getdata();
    this.sortField = [
      {
        title: this.translate.instant("day.theongaytao"),
        value: "CreatedDate",
      },
      {
        title: this.translate.instant("day.theothoihan"),
        value: "deadline",
      },
      {
        title: this.translate.instant("day.theongaybatdau"),
        value: "start_date",
      },
    ];
  }
  filterDay = {
    startDate: "",
    endDate: "",
  };
  // SelectFilterDate(){
  //   const dialogRef = this.dialog.open(DialogSelectdayComponent, {
  //     width: "500px",
  //     data: this.filterDay,
  //   });

  //   dialogRef.afterClosed().subscribe((result) => {
  //     if (result != undefined) {
  //       this.filterDay.startDate = new Date(result.startDate);
  //       this.filterDay.endDate = new Date(result.endDate);
  //       //this.UpdateInfoProject();
  //       // this.LoadDataTaskNew();
  //       this.clearData()
  //       this.getdata();
  //     }
  //   });
  // }


  view(type, item) {
    //Thiên cập nhật lần cuối 6/1/2023
    // this.router.navigateByUrl(`Work/CongViecTheoDuAn?IDDrop=6&&IDep=${this.id_department}&&IDUser=${item.id_nguoigiao}&&ID=${type}`);//
    localStorage.removeItem("TuNgay");//remove để khỏi bị ảnh hưởng từ link báo cáo
    localStorage.removeItem("DenNgay");//remove để khỏi bị ảnh hưởng từ link báo cáo
    this.router.navigateByUrl(environment.HOST_ALINK + `/CongViecTheoDuAn?IDDrop=6&&IDep=${this.id_department}&&IDUser=${this.httpUtils.getUserID()}&&ID=${type}&&IDPr=${item.id_row}`);//
  }
  // open(type, item) {
  //   const dialogRef = this.dialog.open(CongViecTheoWidgetPopupComponent, {
  //     data: { IDDrop: 4, IDPr: item.id_row, type: type, assign: true },
  //     width: '1400px',
  //   });
  //   dialogRef.afterClosed().subscribe((res) => {
  //   });
  // }
}


