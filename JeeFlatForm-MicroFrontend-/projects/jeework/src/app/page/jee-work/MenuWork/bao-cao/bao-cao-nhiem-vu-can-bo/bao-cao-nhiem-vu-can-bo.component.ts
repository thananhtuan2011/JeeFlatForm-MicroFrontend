import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, of, ReplaySubject, Subject, throwError } from "rxjs";
import { BaoCaoService } from "../services/bao-cao.services";
import { TranslateService } from "@ngx-translate/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { NhiemVuDuocTaoModel, ReportModel } from "../Model/jee-work.model";
import { QueryParamsModel } from "../../../models/query-models/query-params.model";
import { TranslationService } from "projects/jeework/src/modules/i18n/translation.service";
import { locale as viLang } from 'projects/jeework/src/modules/i18n/vocabs/vi';

@Component({
  selector: "app-bao-cao-nhiem-vu-can-bo",
  templateUrl: "./bao-cao-nhiem-vu-can-bo.component.html",
  styleUrls: ["./bao-cao-nhiem-vu-can-bo.component.scss"],
})
export class BaoCaoNhiemVuCanBoComponent implements OnInit {

  dt: NhiemVuDuocTaoModel;
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
  @Input() id_role = 0;
  @Input() IsAllDonVi = false;

  Team = 0;
  Departmemnt = 0;
  type_collect = "";
  roleId = 0;
  alldonvi = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public BaoCaoService: BaoCaoService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translate: TranslateService,
    private router: Router,
    private route: ActivatedRoute,
    private transtation:TranslationService,
    //private TokenStorage: TokenStorage,
  ) {
    this.transtation.loadTranslations(viLang);
    var langcode = localStorage.getItem('language');
    if (langcode == null) {
        langcode = this.translate.getDefaultLang();
        this.transtation.setLanguage(langcode);
    }
  }

  ngOnInit(): void {
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
    if (changes.id_role != null && changes.id_role != undefined) {
      this.roleId = changes.id_role.currentValue;
    }
    if (changes.IsAllDonVi != null && changes.IsAllDonVi != undefined) {
      this.alldonvi = changes.IsAllDonVi.currentValue;
    }
    if (this.Departmemnt != undefined) {
      this.getdata();
    }
    this.changeDetectorRef.detectChanges();

    // You can also use categoryId.previousValue and
    // categoryId.firstChange for comparing old and new values
  }

  clearData(){
    this.listData = [];
    this.listData_Tong = [];
  }

  getdata(){
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      "asc",
      "",
      this.crr_page,
      this.page_size
    );
    this.listData_Tong = [];
    this.listData = [];
    this.BaoCaoService.getListReportTaskAssignee(queryParams).subscribe((res) => {
      if (res && res.status == 1) {
        this.listData = res.data;
        this.listData_Tong = res.isgov;
        this.dt = new NhiemVuDuocTaoModel();
        this.dt.Data = this.listData;
        this.dt.Tong_data = this.listData_Tong;
      }
    });
  }
  ExportExcel() {
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      "asc",
      "",
      this.crr_page,
      this.page_size
    );
    this.BaoCaoService.ExcelReportListTaskAssignee(this.dt,queryParams).subscribe((response) => {

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

  chon:number=0;
  filterConfiguration(): any {
    // // let filter: any = {};
    // this.filter.id_department = this.id_department;
    // this.filter.collect_by = this.type_sort;
    // this.filter.TuNgay = this.datepipe.transform(this.filterDay.startDate,"yyy-MM-dd");
    // this.filter.DenNgay = this.datepipe.transform(this.filterDay.endDate,"yyyy-MM-dd");
    // this.filter.id_project_team = this.id_project_team;
    // return this.filter;
    this.filter.id_role = this.id_role;
    this.filter.id_department = this.id_department;
    this.filter.collect_by = this.type_collect;
    this.filter.TuNgay = this.f_convertDate(this.filterDay.startDate).toString();
    this.filter.DenNgay = this.f_convertDate(this.filterDay.endDate).toString();
    this.filter.IsAllDonVi = this.IsAllDonVi;

    if (this.id_project_team==-1) {
      this.id_project_team=0
    }
    this.filter.id_project_team = this.id_project_team;
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
    for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

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

  view2(type, item) {
    return;
    if (this.id_project_team == 0)
      this.id_project_team = -1;
    this.chon = this.id_role;
    switch(this.chon){
      case 0:
        this.chon=13
        break;
      case 1:
        this.chon=14;
        break;
      case 2:
        this.chon=15;
        break;
      case 3:
        this.chon=16;
        break;
    }
    this.router.navigate(['', { outlets: { auxName: 'auxWork/List/'+this.chon+'/' + this.id_department + '/' + this.id_project_team + '/' + type + '/' + item.id_nguoitao }, }]);
  }

  view(type, item) {
    return;
    this.setItemLocalStorate(type, item);
    // //Thiên thao tác lần cuối 6/1/2023
    // // localStorage.setItem('id_project_team', this.id_project_team.toString());
    // // localStorage.setItem('collect_by', this.type_collect);
    // localStorage.setItem('TuNgay', this.f_convertDateDDMMYYY(this.filterDay.startDate).toString());
    // localStorage.setItem('DenNgay', this.f_convertDateDDMMYYY(this.filterDay.endDate).toString());
    // // this.router.navigateByUrl(`Work/CongViecTheoDuAn?IDDrop=7&&IDep=${this.id_department}&&IDUser=${item.id_nguoitao}&&ID=${type}&&IDPr=${this.id_project_team}`);
    let url='Work/list/0/5/'+this.id_project_team+'/'+item.id_nguoitao+'/'+type+'/'+this.id_department+'/'+this.type_sort;
    this.router.navigateByUrl(url);
    // this.router.navigateByUrl(`Work/CongViecTheoDuAn?IDDrop=7&&IDep=${this.id_department}&&IDUser=${item.id_nguoitao}&&ID=${type}`);//
  }

  setItemLocalStorate(type, item){
    var data = new ReportModel();
    data.clear();
    data.loaicv = 4;
    data.id_department = this.id_department;
    data.tien_do = type;
    data.id_user_tao = item.id_nguoitao
    data.TuNgay = this.f_convertDateDDMMYYY(this.filterDay.startDate).toString();
    data.DenNgay = this.f_convertDateDDMMYYY(this.filterDay.endDate).toString();
    data.collect_by = this.type_sort;
    data.filter = 5;
    data.id_project_team = this.id_project_team;
    data.all = true;
    localStorage.setItem('DataReport', JSON.stringify(data));
  }

  f_convertDateDDMMYYY(p_Val: any) {
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

}


