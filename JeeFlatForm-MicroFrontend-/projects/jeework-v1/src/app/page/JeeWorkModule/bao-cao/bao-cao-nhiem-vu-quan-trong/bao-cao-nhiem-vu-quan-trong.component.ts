import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from "@angular/core";
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

import { ActivatedRoute, NavigationStart, Router } from "@angular/router";
import * as moment from "moment";
import { ExcelModel } from "../../../models/jee-work.model";
import { QueryParamsModel } from "../../../models/query-models/query-params.model";

@Component({
  selector: "app-bao-cao-nhiem-vu-quan-trong",
  templateUrl: "./bao-cao-nhiem-vu-quan-trong.component.html",
  styleUrls: ["./bao-cao-nhiem-vu-quan-trong.component.scss"],
})
export class BaoCaoNhiemVuQuanTrongComponent implements OnInit {

  dt: ExcelModel;
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
  @Input() loai_cv = 0;

  
  Team = 0;
  Departmemnt = 0;
  type_collect = "";
  loai_CV = 0;

  colorCrossbar = ['#3699ff', '#EEB108', '#EC641B', '#FF0000', '#13C07C'];
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public BaoCaoService: BaoCaoService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translate: TranslateService,
    private weworkService: WeWorkService,
    private router: Router,
  ) { }
  ngOnInit(): void {
    // set ngày filter
    setInterval(() => {
      this.isnew = !this.isnew;
      this.changeDetectorRef.detectChanges();
    }, 1000);

    if(this.loai_CV != 0){
      this.getdata();
    }
    this.getDataInit();
    
    this.changeDetectorRef.detectChanges();

  }

  ngOnChanges(changes: SimpleChanges) {
    
    if(changes.startDate != null && changes.startDate != undefined){
      this.filterDay.startDate = changes.startDate.currentValue;
    }
    if(changes.endDate != null && changes.endDate != undefined){
      this.filterDay.endDate = changes.endDate.currentValue;
    }
   
   
    if(changes.id_project_team != null && changes.id_project_team != undefined){
      this.Team = changes.id_project_team.currentValue;
    }
    if(changes.collect_by != null && changes.collect_by != undefined){
      this.type_collect = changes.collect_by.currentValue;
    }
    if(changes.id_department != null && changes.id_department != undefined){
      this.Departmemnt = changes.id_department.currentValue;
    }

    if(changes.loai_cv != null && changes.loai_cv != undefined){
      this.loai_CV = changes.loai_cv.currentValue;
    }

    
    if(this.loai_CV != 0){
      this.getdata();
    }
    
    this.changeDetectorRef.detectChanges();
    
    // You can also use categoryId.previousValue and 
    // categoryId.firstChange for comparing old and new values
    
}
getDataInit(){
  this.BaoCaoService.ListAllStatusDynamic().subscribe((res) => {
    if (res && res.status === 1) {
      this.ListAllStatusDynamic = res.data;
      this.changeDetectorRef.detectChanges();
    }
  });
}



  clearData() {
    this.listData = [];
    this.listData_Tong = [];
  }

  getdata() {
    
    const queryParams = new QueryParamsModel(
      this.filterConfiguration2(),
      "asc",
      "",
      this.crr_page,
      this.page_size
    );
    this.BaoCaoService.getReportCongViecQuanTrong(queryParams).subscribe((res) => {
      if (res && res.status == 1) {
    
        this.listData = res.data;
        console.log("list data 123456789", this.listData);
        this.listData_Tong = res.isgov;
        this.dt = new ExcelModel();
        this.dt.Data = this.listData;
        
        
        this.dt.Tong_data = this.listData_Tong;

      }
    });
  }
  ExportExcel() {
    this.dt.Data.forEach(item => {
 
      item.deadline = moment(item.deadline + 'z').format('DD/MM/YYYY')
      if(item.deadline == "Invalid date"){
        item.deadline = "";
      }
    })
    this.BaoCaoService.ExcelBaoCaoNVQT(this.dt).subscribe((response) => {
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

  filterConfiguration2(): any {
    const filter: any = {};
    filter.loaicongviec = this.loai_CV;
    filter.collect_by = "CreatedDate";
    filter.important = 1;
    return filter;
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


  view(type, item) {
    this.router.navigateByUrl(`Work/CongViecTheoDuAn?IDDrop=6&&IDep=${this.id_department}&&IDUser=${item.id_nguoigiao}&&ID=${type}`);//
  }
  Xemchitiet(item) {
    this.router.navigate(['', { outlets: { auxNameV1: 'auxWorkV1/detailWorkNew/' + item.id_row + '|' + item.id_project_team }, }]);
  }
  ListAllStatusDynamic: any = [];
  FindStatus(id_project_team, id_status) {
    var item = this.ListAllStatusDynamic.find(
      (x) => +x.id_row == id_project_team
    );
    var index;
    if (item) {
      index = item.status.find((x) => x.id_row == id_status);
    }
    if (index) {
      return index.statusname;
    }
    return this.translate.instant("widgets.chuagantinhtrang");
  }
  getStyleSTT(id_project_team, id_status) {
    var item = this.ListAllStatusDynamic.find(
      (x) => +x.id_row == id_project_team
    );
    var index;
    if (item) {
      index = item.status.find((x) => x.id_row == id_status);
    }
    if (index) {
      return {
        color: "white",
        backgroundColor: index.color,
      };
    }
    return {
      color: "rgb(0, 0, 0)",
      backgroundColor: this.Opaciti_color("rgb(0, 0, 0)"),
    };
  }
  Opaciti_color(color = "rgb(0, 0, 0)") {
    var result = color.replace(")", ", 0.2)").replace("rgb", "rgba");
    return result;
  }
  public listDataStatus: any[] = [];
  statusChange(val) {
    this.listDataStatus = [];
    this.weworkService.ListStatusDynamicNew(val.id_project_team, val.id_row).subscribe(res => {
      if (res && res.status == 1) {
        this.listDataStatus = res.data;
      }
      this.changeDetectorRef.detectChanges();
    })
  }
  
  
}


