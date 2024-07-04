import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QueryParamsModel } from '../../models/query-models/query-params.model';
import { DanhMucChungService } from '../../services/danhmuc.service';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-nhac-nho-nhiem-vu',
  templateUrl: './nhac-nho-nhiem-vu.component.html',
  styleUrls: ['./nhac-nho-nhiem-vu.component.scss'],
})

export class NhacNhoNhiemVuComponent implements OnInit {
  text: any;
  projectname: any;
  tagid: any;
  listmenu: any[];
  listdatao: any;
  listdagiao: any;
  listduocgiao: any;
  listtheodoi: any;

  dg_quahan = 0;
  dg_toihan = 0;
  dg_saptoihan = 0;
  dg_conhan = 0;

  dcg_quahan = 0;
  dcg_toihan = 0;
  dcg_saptoihan = 0;
  dcg_conhan = 0;

  dt_quahan = 0;
  dt_toihan = 0;
  dt_saptoihan = 0;
  dt_conhan = 0;

  pj_tongnv = 0;
  pj_httronghan = 0;
  pj_conhan = 0;
  pj_saptoihan = 0;
  pj_toihan = 0;
  pj_quahan = 0;
  pj_htquahan = 0;

  class_size;
  all_list = [1, 2, 3];
  id_menu = 0; // id = 1: đã giao; 2: được giao; 3: đã tạo; 0: tất cả; 5:theo dõi
  menu_nhiemvucuatoi = -1; // id = 1: đã giao; 2: được giao; 3: đã tạo; 5:theo dõi - luôn lấy theo mục tất cả ở các menu khác

  project_id: any;
  config_filter: any;
  listproject: any;
  filter: any;
  isShow = [
    'nhacnhonhiemvudagiao',
    'nhacnhonhiemvuduocgiao',
    'nhacnhonhiemvudatao',
  ]
  show_dagiao: boolean = true;
  show_duocgiao: boolean = true;
  show_datao: boolean = true;
  constructor(
    private activatedRoute: ActivatedRoute,
    public DanhMucChungService: DanhMucChungService,
    private changeDetectorRefs: ChangeDetectorRef,
    private router: Router // private changeDetectorRefs: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    if (this.DanhMucChungService.send$.subscribe(res => {
      if (res == "LoadItem") {
        this.loadData();
        this.DanhMucChungService.send$.next('');
      }
    }))
      this.activatedRoute.params.subscribe((params) => {
        this.menu_nhiemvucuatoi = -1 ;
        if (params.loaimenu != undefined) {
          this.id_menu = params.loaimenu;
        }
        if (params.projectid != undefined) {
          this.project_id = params.projectid;
        }
        // if (params.projectname != undefined) {
        //   this.projectname = params.projectname;
        // }
        if (this.id_menu == 4) {
          this.projectname = localStorage.getItem('titleDept');
          //Xử lý lại filter tien_do -> thay bằng 
          let _dataConfig = JSON.parse(localStorage.getItem("config"));
          let id = _dataConfig.map(a => a);
          let tr = id.toString();
          this.config_filter = tr;
        }
        if (this.id_menu == 7) {
          this.projectname = localStorage.getItem('titleProject');
          this.project_id = params.projectid;
          this.tagid = params.advance;
        }
        if (this.id_menu != 4 && this.id_menu != 7) {
          // let _dataStatus = JSON.parse(localStorage.getItem("config_status"));
          // if (_dataStatus != "") {
          //   this.config_filter = _dataStatus;
          // }
          // this.filter = params.filter;
        }
        if (this.id_menu == 13) {
          this.filter = params.filter;
        }
        switch (params.loaimenu) {
          case '1':
            this.text = 'Nhắc nhở nhiệm vụ đã giao';
            break;
          case '2':
            this.text = 'Nhắc nhở nhiệm vụ được giao';
            break;
          case '3':
            this.text = 'Nhắc nhở nhiệm vụ đã tạo';
          case '4':
            this.text = 'Đơn vị thực hiện nhiệm vụ';
            break;
          default:
            break;
        }
        this.loadData();
      });
    const $eventloadgoback = fromEvent<CustomEvent>(window, 'event-list-task').subscribe((e) => this.onEventCountNew(e));
  }
  loadData() {
    switch (Number(this.id_menu)) {
      case 1: {
        this.listdagiao = this.loadList(1);
        // this.changeDetectorRefs.detectChanges();
        break;
      }
      case 2: {
        this.listduocgiao = this.loadList(2);
        // this.changeDetectorRefs.detectChanges();
        break;
      }
      case 3: {
        this.listdatao = this.loadList(3);
        // this.changeDetectorRefs.detectChanges();
        break;
      }
      case 4: {
        this.listproject = this.loadList(4);
        // this.changeDetectorRefs.detectChanges();
        break;
      }
      case 0: {
        this.listdagiao = this.loadList(2);
        this.listduocgiao = this.loadList(1);
        this.listdatao = this.loadList(3);
        // this.changeDetectorRefs.detectChanges();
      }
      case 5: {
        this.listtheodoi = this.loadList(5);
        // this.changeDetectorRefs.detectChanges();
        break;
      }
      case 7: {
        this.listproject = this.loadList(7);
        // this.changeDetectorRefs.detectChanges();
        break;
      }
      case 8: {
        this.listduocgiao = this.loadList(8);
        break;
      }
      case 9: {
        this.listduocgiao = this.loadList(9);
        break;
      }
      case 10: {
        this.listduocgiao = this.loadList(10);
        break;
      }
      case 13: {
        if (this.filter == 5)//Đã giao
        {
          this.menu_nhiemvucuatoi =5;
          this.listduocgiao = this.loadList(1);
        }
        else if (this.filter == 0)//Được giao
        {
          this.menu_nhiemvucuatoi =0;
          this.listduocgiao = this.loadList(2);
        }
        else  if (this.filter == 1)//Theo dõi ==1
        {
          this.menu_nhiemvucuatoi =1;
          this.listduocgiao = this.loadList(5);
        }
        break;
      }
    }
  }
  loadList(loaicongviec) {
    let result;
    let queryParams;
    if (loaicongviec == 4) {
      queryParams = new QueryParamsModel(
        this.filterConfiguration(this.project_id, 5, loaicongviec, 0, 1, this.config_filter)
      );
    }
    else if (loaicongviec == 7) {
      queryParams = new QueryParamsModel(
        this.filterConfiguration(0, 5, loaicongviec, this.tagid)
      );
    }

    else {

      queryParams = new QueryParamsModel(
        this.filterConfiguration(0, 5, loaicongviec)
      );
    }
    this.DanhMucChungService.getWorkSumaryByProject(queryParams).subscribe(
      (res) => {
        if (res && res.status == 1) {
          result = res.data;
          switch (Number(loaicongviec)) {
            case 1: {
              this.dg_quahan = result.find((t) => t.key == 'sum_quahan').count;
              this.dg_toihan = result.find((t) => t.key == 'sum_toihan').count;
              this.dg_saptoihan = result.find(
                (t) => t.key == 'sum_saptoihan'
              ).count;
              this.dg_conhan = result.find(
                (t) => t.key == 'sum_contronghan'
              ).count;
              break;
            }
            case 2: {
              this.dcg_quahan = result.find((t) => t.key == 'sum_quahan').count;
              this.dcg_toihan = result.find((t) => t.key == 'sum_toihan').count;
              this.dcg_saptoihan = result.find(
                (t) => t.key == 'sum_saptoihan'
              ).count;
              this.dcg_conhan = result.find(
                (t) => t.key == 'sum_contronghan'
              ).count;
              break;
            }
            case 3: {
              this.dt_quahan = result.find((t) => t.key == 'sum_quahan').count;
              this.dt_toihan = result.find((t) => t.key == 'sum_toihan').count;
              this.dt_saptoihan = result.find(
                (t) => t.key == 'sum_saptoihan'
              ).count;
              this.dt_conhan = result.find(
                (t) => t.key == 'sum_contronghan'
              ).count;
              this.changeDetectorRefs.detectChanges();
              break;
            }
            case 4: {
              this.pj_tongnv = result.find((t) => t.key == 'sum_nhiemvu').count;
              this.pj_httronghan = result.find(
                (t) => t.key == 'sum_hoanthanhtronghan'
              ).count;
              this.pj_quahan = result.find((t) => t.key == 'sum_quahan').count;
              this.pj_toihan = result.find((t) => t.key == 'sum_toihan').count;
              this.pj_saptoihan = result.find(
                (t) => t.key == 'sum_saptoihan'
              ).count;
              this.pj_conhan = result.find(
                (t) => t.key == 'sum_contronghan'
              ).count;
              this.pj_htquahan = result.find(
                (t) => t.key == 'sum_hoanthanhquahan'
              ).count;
              this.changeDetectorRefs.detectChanges();
              break;
            }
            case 5: {
              this.dt_quahan = result.find((t) => t.key == 'sum_quahan').count;
              this.dt_toihan = result.find((t) => t.key == 'sum_toihan').count;
              this.dt_saptoihan = result.find(
                (t) => t.key == 'sum_saptoihan'
              ).count;
              this.dt_conhan = result.find(
                (t) => t.key == 'sum_contronghan'
              ).count;
              this.changeDetectorRefs.detectChanges();
              break;
            }
            case 7: {
              this.pj_tongnv = result.find((t) => t.key == 'sum_nhiemvu').count;
              this.pj_httronghan = result.find(
                (t) => t.key == 'sum_hoanthanhtronghan'
              ).count;
              this.pj_quahan = result.find((t) => t.key == 'sum_quahan').count;
              this.pj_toihan = result.find((t) => t.key == 'sum_toihan').count;
              this.pj_saptoihan = result.find(
                (t) => t.key == 'sum_saptoihan'
              ).count;
              this.pj_conhan = result.find(
                (t) => t.key == 'sum_contronghan'
              ).count;
              this.pj_htquahan = result.find(
                (t) => t.key == 'sum_hoanthanhquahan'
              ).count;
              this.changeDetectorRefs.detectChanges();
              break;
            }
            case 8: {
              this.dcg_quahan = result.find((t) => t.key == 'sum_quahan').count;
              this.dcg_toihan = result.find((t) => t.key == 'sum_toihan').count;
              this.dcg_saptoihan = result.find(
                (t) => t.key == 'sum_saptoihan'
              ).count;
              this.dcg_conhan = result.find(
                (t) => t.key == 'sum_contronghan'
              ).count;
              break;
            }
            case 9: {
              this.dcg_quahan = result.find((t) => t.key == 'sum_quahan').count;
              this.dcg_toihan = result.find((t) => t.key == 'sum_toihan').count;
              this.dcg_saptoihan = result.find(
                (t) => t.key == 'sum_saptoihan'
              ).count;
              this.dcg_conhan = result.find(
                (t) => t.key == 'sum_contronghan'
              ).count;
              break;
            }
            case 10: {
              this.dcg_quahan = result.find((t) => t.key == 'sum_quahan').count;
              this.dcg_toihan = result.find((t) => t.key == 'sum_toihan').count;
              this.dcg_saptoihan = result.find(
                (t) => t.key == 'sum_saptoihan'
              ).count;
              this.dcg_conhan = result.find(
                (t) => t.key == 'sum_contronghan'
              ).count;
              break;
            }
          }
          this.changeDetectorRefs.detectChanges();
          return result;
        }
      }
    );
  }
  onEventCountNew(e: CustomEvent) {
    if (e.detail.eventType === 'update-task') {
      this.loadData();
    }
  }
  loadWidget(langkey, key) {
    try {
      let result;
      switch (langkey) {
        case 1:
          result = this.listduocgiao.find((t) => t.key == key).count;
          break;
        case 2:
          result = this.listdagiao.find((t) => t.key == key).count;
          break;
        case 3:
          result = this.listdatao.find((t) => t.key == key).count;
          break;
        case 4:
          result = this.listproject.find((t) => t.key == key).count;
          break;
        case 5:
          result = this.listtheodoi.find((t) => t.key == key).count;
          break;
        default:
          break;
      }
      this.changeDetectorRefs.detectChanges();
      // let result=this.listmenu.find(t => t.Langkey==langkey).ListFillter.find(t=>t.FilterID==FilterID).sum_works;
      return result;
    } catch (error) {
      return 0;
    }
  }
  filterConfiguration(
    id_project_team: any,
    filter: any,
    loaicongviec: any,
    tagid: any = 0,
    use_roleconfig = 0,
    config_filter: any = 0,
  ): any {
    const filterNew: any = {
      id_project_team: id_project_team,
      loaicongviec: loaicongviec,
      filter: filter,
      tagid: tagid,
      use_roleconfig: use_roleconfig,
      config_filter: config_filter
    };
    return filterNew;
  }
  onClickWidget(idMenu, filter, avand) {
    this.router.navigate(['/WorkV2/list', idMenu, 'none', avand]);
  }
  onClickWidgetProject(idMenu, filter) {
    this.router.navigate([
      '/WorkV2/list',
      idMenu,
      filter,
      this.project_id,
      this.projectname,
    ]);
  }
  onClickWidgetTags(idMenu, filter) {
    this.router.navigate([
      '/WorkV2/list',
      idMenu,
      filter,
      this.project_id,
      this.tagid,
      -1
    ]);
  }
  calWid() {
    let num_widget = this.countShow(this.isShow);
    return (79 / num_widget).toString() + 'vw';
  }
  countShow(array) {
    let cout = 0;
    array.forEach(element => {

      if (localStorage.getItem(element) == 'true') {
        cout++;
      }
    });
    return cout;
  }

  check_show(name) {
    return localStorage.getItem(name) == 'true' ? true : false;
  }
}
