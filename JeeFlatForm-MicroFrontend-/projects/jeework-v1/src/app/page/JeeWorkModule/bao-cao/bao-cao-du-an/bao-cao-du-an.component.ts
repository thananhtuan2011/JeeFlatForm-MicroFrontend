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

import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { QueryParamsModel } from "../../../models/query-models/query-params.model";
import { BaoCaoDuAnModel } from "../../../models/jee-work.model";

@Component({
  selector: "app-bao-cao-du-an",
  templateUrl: "./bao-cao-du-an.component.html",
  styleUrls: ["./bao-cao-du-an.component.scss"],
})
export class BaoCaoDuAnComponent implements OnInit {
  listData: any[] = [];
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

  filterDay = {
    startDate: "",
    endDate: "",
  };
  type_sort: any;


  @Input() startDate: "";
  @Input() endDate: "";
  @Input() id_project_team = 0;
  @Input() collect_by = "";
  @Input() id_department = 0;
  Team = 0;
  Departmemnt = 0;
  type_collect = "";

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    public BaoCaoService: BaoCaoService,
    public datepipe: DatePipe,
    public dialog: MatDialog,
    private translate: TranslateService,
  ) {}
  ngOnInit(): void {
    


    setInterval(() => {
      this.isnew = !this.isnew;
      this.changeDetectorRef.detectChanges();
    }, 1000);

    if(this.Departmemnt != undefined){
      this.getdata();
    }
   
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

    if(this.Departmemnt != undefined){
      this.getdata();
    }
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

    this.BaoCaoService.getListProjectReport(queryParams).subscribe((res) => {
      if (res && res.status == 1) {
        this.listData = res.data;
      }
    });
  }
  f_convertDate(p_Val: any) {
    let a = p_Val === "" ? new Date() : new Date(p_Val);
    var date = moment(a).isValid();
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
    this.filter.id_department = this.id_department;
    this.filter.collect_by = this.type_collect;
    this.filter.TuNgay = this.f_convertDate(this.filterDay.startDate).toString();
    this.filter.DenNgay = this.f_convertDate(this.filterDay.endDate).toString();
    
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

  ExportExcel() {
    const list = new Array<BaoCaoDuAnModel>();
    this.listData.forEach(i => {
      const item = new BaoCaoDuAnModel(
        i.id_row,
        i.title,
        i.num_work,
        i.hoanthanh,
        i.hoanthanh_dunghan,
        i.hoanthanh_cham,
        i.chuahoanthanh,
        i.chuahoanthanh_quahan,
        i.chuahoanthanh_conhan,
        i.chatluong,
        i.ghichu,
        i.tongvanban
      );
      list.push(item);
  });
    this.BaoCaoService.ExportExcelProjectByDepartment(list).subscribe((res) => {
        const linkSource = `data:application/octet-stream;base64,${res.data.FileContents}`;
        const downloadLink = document.createElement('a');
        const fileName = res.data.FileDownloadName;

        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
    });

 }
  
}


