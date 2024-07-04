import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { BehaviorSubject, of, ReplaySubject, Subject, throwError } from "rxjs";
import { BaoCaoService } from "../services/bao-cao.services";
import {
  ProjectsTeamService,
  WeWorkService,
} from "../../component/Jee-Work/jee-work.servide";
import { TranslateService } from "@ngx-translate/core";
import { FormControl } from "@angular/forms";

import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { SocketioStore } from "src/app/_metronic/core/services/socketio.store";
import { SocketioService } from "src/app/_metronic/core/services/socketio.service";
import { TheoDoiNVModel } from "../Model/baocao.model";
import { QueryParamsModelNew } from "../../../models/query-models/query-params.model";

@Component({
  selector: "app-bao-cao-chi-tiet-theo-thanh-vien",
  templateUrl: "./bao-cao-chi-tiet-theo-thanh-vien.component.html",
  styleUrls: ["./bao-cao-chi-tiet-theo-thanh-vien.component.scss"],
})
export class BaoCaoChiTietTheoThanhVienComponent implements OnInit {
  public column_sort: any = [];
  dt: TheoDoiNVModel;
  listData: any[] = [];
  listData_Tong: any[] = [];
  dataLazyLoad: any = [];
  dataLazyLoad_ID: any = []; //Bổ sung ngày 11/10/2022 dùng để lấy danh sách id đánh dấu đã xem
  Staff: any[] = [];
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


  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public BaoCaoService: BaoCaoService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translate: TranslateService,
    public socketioStore: SocketioStore,
    //private TokenStorage: TokenStorage,
  ) { }
  id: number;
  selectedDate = {
    startDate: new Date('09/01/2020'),
    endDate: new Date('09/30/2020'),
  };
  public filterCVC: any = [];
  trangthai: any;
  filter_dept: any = {};
  
  @Input() startDate: "";
  @Input() endDate: "";
  @Input() id_project_team = 0;
  @Input() collect_by = "";
  @Input() id_department = 0;

  
  Team = 0;
  Departmemnt = 0;
  type_collect = "";
  filterDay = {
    startDate: "",
    endDate: "",
  };
  
  ngOnInit(): void {
    this.SetUp();
    setInterval(() => {
      this.isnew = !this.isnew;
      this.changeDetectorRef.detectChanges();
    }, 1000);
    this.ReportByStaff();
  
    this.changeDetectorRef.detectChanges();
  }
  ngOnChanges(changes: SimpleChanges) {
    
    
   
   
   
    
    if(changes.id_department != null && changes.id_department != undefined){
      this.Departmemnt = changes.id_department.currentValue;
    }

    

    this.ReportByStaff();
    this.changeDetectorRef.detectChanges();
    
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values
    
}



  _filterCV = [
    {
      title: this.translate.instant('filter.khongtinhcongvieccon'),
      value: '0',
      loai: 'displayChild'
    },
    {
      title: this.translate.instant('filter.congviecvacongvieccon'),
      value: '1',
      loai: 'displayChild'
    },
  ];
  sortField = [
    {
      title: this.translate.instant('day.theongaytao'),
      value: 'CreatedDate',
    },
    {
      title: this.translate.instant('day.theothoihan'),
      value: 'Deadline',
    },
    {
      title: this.translate.instant('day.theongaybatdau'),
      value: 'start_date',
    },
  ];
  _filterTT = [
    {
      title: this.translate.instant('filter.tatcatrangthai'),
      value: 'status',
      id_row: '',
      loai: 'trangthai'
    },
    {
      title: 'Công việc đang thực hiện',
      value: 'status',
      id_row: '1',
      loai: 'trangthai'
    },
    {
      title: 'Công việc đã hoàn thành',
      value: 'status',
      id_row: '2',
      loai: 'trangthai'
    },
  ];

  SetUp() {
    this.filter_dept = {
      title: this.translate.instant('filter.tatcaphongban'),
      id_row: ''
    };
    const today = new Date();
    let set_thang = today.getMonth() - 10;
    // if (today.getDate() < 10)
    //     set_thang = today.getMonth() - 10;
    this.selectedDate = {
      startDate: new Date(today.getFullYear(), set_thang, 1),
      endDate: new Date(today.setMonth(today.getMonth())),
    };
    this.filterCVC = this._filterCV[0];
    this.trangthai = this._filterTT[0];
    this.column_sort = this.sortField[0];
  }

  
  // Report by staff
  colorCrossbar = ['red', 'blue', '#ff9900', 'green', 'violet'];

  ReportByStaff() {
    const queryParams = new QueryParamsModelNew(
      this.filterConfiguration(),
    );
    //queryParams.sortField = this.column_sort.value;
    this.BaoCaoService.ReportByStaff(queryParams).subscribe(data => {
      if (data && data.status == 1) {
        this.Staff = data.data;
        console.log('dât-------------------------------------------------',this.Staff)
        for (let i of this.Staff) {
          i.datasets = [
            i.hoanthanh,
            i.ht_quahan,
            i.quahan,
            i.danglam,
          ];
        }
      }
      this.changeDetectorRef.detectChanges();
    });
  }

  // f_convertDate(p_Val: any) {
  //   let a = p_Val === '' ? new Date() : new Date(p_Val);
  //   return ('0' + (a.getDate())).slice(-2) + '/' + ('0' + (a.getMonth() + 1)).slice(-2) + '/' + a.getFullYear();
  // }
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
    // if (date) {
    //   return (
    //     ("0" + (a.getMonth() + 1)).slice(-2) +
    //     "/" +
    //     ("0" + a.getDate()).slice(-2) +
    //     "/" +
    //     a.getFullYear()
    //   );
    // }
    // else
    //   return null;
  }
  filterConfiguration(): any {
    // const filter: any = {};
    // filter.TuNgay = (this.f_convertDate(this.selectedDate.startDate)).toString();
    // filter.DenNgay = (this.f_convertDate(this.selectedDate.endDate)).toString();
    // filter.id_department = this.id_department;
    // filter.collect_by = this.column_sort.value;
    // filter.displayChild = this.filterCVC.value;
    // return filter;

    this.filter.id_department = this.id_department;
    this.filter.collect_by = this.type_collect;
    this.filter.TuNgay = this.f_convertDate(this.filterDay.startDate).toString();
    this.filter.DenNgay = this.f_convertDate(this.filterDay.endDate).toString();
    
    this.filter.id_project_team = this.id_project_team;
    return this.filter;
  }

  getHeight(): any {
    let tmp_height = window.innerHeight - 300;
    return tmp_height + "px";
  }
  ExportExcel(filename: string) {
    const queryParams = new QueryParamsModelNew(
      this.filterConfiguration(),
    );
    this.BaoCaoService.ExportExcel(queryParams,filename).subscribe((response) => {
        var headers = response.headers;
        let filename = headers.get('x-filename');
        let type = headers.get('content-type');
        let blob = new Blob([response.body], { type: type });
        const fileURL = URL.createObjectURL(blob);
        var link = document.createElement('a');
        link.href = fileURL;
        link.download = filename;
        link.click();
    });
}
}


