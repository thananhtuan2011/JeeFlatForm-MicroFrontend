import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, of, ReplaySubject, Subject, throwError } from "rxjs";
import {
  catchError,
  finalize,
  map,
  share,
  takeUntil,
  tap,
} from "rxjs/operators";

import { BaoCaoService } from "../services/bao-cao.services";
import { TranslateService } from "@ngx-translate/core";
import { FormControl } from "@angular/forms";

import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import * as moment from "moment";
import { SocketioStore } from "src/app/_metronic/core/services/socketio.store";
import { SocketioService } from "src/app/_metronic/core/services/socketio.service";
import { HttpParams } from "@angular/common/http";
import { NhiemVuDuocGiaoModel, ReportModel } from "../Model/jee-work.model";
import { AuthService } from "../services/auth.service";
import { QueryParamsModel } from "../../../models/query-models/query-params.model";
import { CongViecTheoWidgetPopupComponent } from "../cong-viec-theo-widget-popup/cong-viec-theo-widget-popup.component";
import { JeeWorkStore } from "../../services/auxiliary-router-jw.store";
import { TranslationService } from "projects/jeework/src/modules/i18n/translation.service";
import { locale as viLang } from 'projects/jeework/src/modules/i18n/vocabs/vi';


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
    public jeeWorkStore: JeeWorkStore,
    public socketioStore: SocketioStore,
    private authService: AuthService,
    private transtation: TranslationService,
  ) {
    this.transtation.loadTranslations(viLang);
    var langcode = localStorage.getItem('language');
    if (langcode == null) {
      langcode = this.translate.getDefaultLang();
      this.transtation.setLanguage(langcode);
    }
  }
  ngOnInit(): void {
    // const queryParams = new QueryParamsModel(
    //   this.filterConfiguration(),
    //   "asc",
    //   "",
    //   this.crr_page,
    //   this.page_size
    // );
    // set ngày filter
    setInterval(() => {
      this.isnew = !this.isnew;
      this.changeDetectorRef.detectChanges();
    }, 1000);


    if (this.Departmemnt != undefined) {
      this.getdata();
    }

    // this.BaoCaoService.getListTaskReport(queryParams).subscribe((res) => {
    //   if (res && res.status == 1) {
    //     console.log("res zzzzzzz", res);
    //     this.listData = res.data;
    //     console.log("list data", this.listData);
    //   }
    // });
    //   this.router.events.subscribe(event =>{
    //     if (event instanceof NavigationStart){
    //       //console.log(event.url)
    //       var collect_by = this.route.snapshot.paramMap.get("type");
    //       var start = this.route.snapshot.paramMap.get("start");
    //       var end = this.route.snapshot.paramMap.get("end");
    //       this.filterDay.startDate = start;
    //       this.filterDay.endDate = end;
    //    }
    //  })

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
        this.listData_Tong = res.isgov;
        this.dt = new NhiemVuDuocGiaoModel();
        this.dt.Data = this.listData;
        this.dt.Tong_data = this.listData_Tong;

      }
    });
  }
  ExportExcel() {
    const queryParams = new QueryParamsModel(
      this.filterConfigurationExport(),
      "asc",
      "",
      this.crr_page,
      this.page_size
    );
    this.BaoCaoService.ExcelBaoCaoTDNVDG(this.dt,queryParams).subscribe((response) => {
      const linkSource = `data:application/octet-stream;base64,${response.data.FileContents}`;
      const downloadLink = document.createElement('a');
      const fileName = response.data.FileDownloadName;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    });
  }
  f_convertDate(p_Val: any) {
    let a = p_Val === "" ? new Date() : new Date(p_Val);
    var date = moment(a).isValid();
    if (date) {
      return (
        ("0" + a.getDate()).slice(-2) +
        "/" +
        ("0" + (a.getMonth() + 1)).slice(-2) +
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
    this.filter.loaicongviec = 10;
    this.filter.id_project_team = this.id_project_team;
    this.filter.displayChild = 1;
    return this.filter;
  }
  filterConfigurationExport(): any {
    this.filter.TuNgay = this.f_convertDate(this.filterDay.startDate).toString();
    this.filter.DenNgay = this.f_convertDate(this.filterDay.endDate).toString();

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

  filterDay = {
    startDate: "",
    endDate: "",
  };

  view2(type, item) {
    let tungay = this.f_convertDate(this.filterDay.startDate).toString();
    let denngay = this.f_convertDate(this.filterDay.endDate).toString();
    this.router.navigate(['', { outlets: { auxName: 'auxWork/List/11/' + this.Departmemnt + '/' + item.id_row + '/' + type + '/' + 0 }, }], { state: { TuNgay: tungay, DenNgay: denngay, collect_by: this.type_collect } });
  }


  view(type, item) {
    this.setItemLocalStorate(type, item)

    //this.router.navigateByUrl(`Work/CongViecTheoDuAn?IDDrop=6&&IDep=${this.id_department}&&IDUser=${this.authService.getUserId()}&&ID=${type}&&IDPr=${item.id_row}`);//

    let url = 'Work/list/0/5/' + this.id_project_team + '/' + item.id_nguoigiao + '/' + type + '/' + this.id_department + '/' + this.type_sort;

    //mo ta url:  'list/:loaimenu/:filter/:projectid/:IDUser/:ID/:IDep/:CollectBy/:StartDate/:EndDate',
    this.router.navigateByUrl(url);

  }

  setItemLocalStorate(type, item) {
    var data = new ReportModel();
    data.clear();
    data.loaicv = 4;
    data.id_department = this.id_department;
    data.tien_do = type;
    data.filter = 5;
    data.id_project_team = item.id_row;
    data.all = true;
    data.collect_by = this.type_sort;
    localStorage.setItem('DataReport', JSON.stringify(data));

  }

  open(type, item) {
    const dialogRef = this.dialog.open(CongViecTheoWidgetPopupComponent, {
      data: { IDDrop: 4, IDPr: item.id_row, type: type, assign: true },
      width: '1400px',
      // panelClass: ["sky-padding-0", "width700"],
      // disableClose: true,
    });
    dialogRef.afterClosed().subscribe((res) => {
      // if (!res) {
      //     this.loadDataList();
      // }
      // else {
      //     this.loadDataList();
      // }
      // this.btnAdd = false;
    });
  }
}


