import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, of, ReplaySubject, Subject, throwError } from "rxjs";
import { BaoCaoService } from "../services/bao-cao.services";
import {
  AttachmentService,
  ProjectsTeamService,
  WeWorkService,
  WorkService,
} from "../../component/Jee-Work/jee-work.servide";
import { TranslateService } from "@ngx-translate/core";
import { FormControl } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { HttpParams } from "@angular/common/http";
import { TheoDoiNVModel } from "../Model/baocao.model";
import { QueryParamsModel } from "../../../models/query-models/query-params.model";

@Component({
  selector: "app-bao-cao-thoe-doi-tinh-hinh-thuc-hien-nhiem-vu",
  templateUrl: "./bao-cao-thoe-doi-tinh-hinh-thuc-hien-nhiem-vu.component.html",
  styleUrls: ["./bao-cao-thoe-doi-tinh-hinh-thuc-hien-nhiem-vu.component.scss"],
})
export class BaoCaoTheoDoiTinhHinhTHNVComponent implements OnInit {

  dt: TheoDoiNVModel;
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

  id_department: number;

  colorCrossbar = ['#3699ff', '#EEB108', '#EC641B', '#FF0000', '#13C07C'];
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public BaoCaoService: BaoCaoService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    
    const id = this.route.snapshot.paramMap.get("id");
    this.id_department = Number.parseInt(id);

    setInterval(() => {
      this.isnew = !this.isnew;
      this.changeDetectorRef.detectChanges();
    }, 1000);
    this.getdata();
    this.route.params.subscribe((params) => {
      this.id_department = +params.id;
      this.getdata();
    });
    this.changeDetectorRef.detectChanges();
  }

  getdata(){
    const queryParams = new QueryParamsModel(
      this.filterConfiguration(),
      "asc",
      "",
      this.crr_page,
      this.page_size
    );
    this.BaoCaoService.ReportByDepartment(queryParams).subscribe((res) => {
      if (res && res.status == 1) {
        this.listData = res.data;
        this.listData_Tong = res.isgov;
        this.dt = new TheoDoiNVModel();
        this.dt.Data = this.listData;
        this.dt.Tong_data=this.listData_Tong;

      }
    });
  }
  Export() {
    this.BaoCaoService.ExcelReportByDep(this.dt).subscribe((response) => {
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

  filterConfiguration(): any {
    // let filter: any = {};
    this.filter.id_department = this.id_department;

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

  view(type, item) {
  this.router.navigateByUrl(`Work/CongViecTheoDuAn?IDDrop=4&&IDPr=${item.id_row}&&ID=${type}`);//
  }
  
}


