import { ChangeDetectorRef, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { QueryParamsModelNew } from '../../../../models/query-models/query-params.model';
import { WidgetTongHopDuAnService } from '../../Services/tong-hop-du-an-widget.service';
import { WorksbyprojectService } from '../../Services/worksbyproject.service';
import { DanhMucChungService } from '../../../../services/danhmuc.service';
import { QueryParamsModel } from 'projects/jeework/src/app/page/models/query-models/query-params.model';
@Component({
  selector: 'nhac-nho-nhiem-vu-duoc-giao-widget',
  templateUrl: './nhac-nho-nhiem-vu-duoc-giao-widget.component.html',
  styleUrls: ['./nhac-nho-nhiem-vu-duoc-giao-widget.component.scss'],
})
export class NhacNhoNhiemVuDuocGiaoWidgetComponent
  implements
  OnInit {
    text: any;
    projectname: any;
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
    project_id: any;
    listproject: any;
  
    isShow = [
      'nhacnhonhiemvudagiao',
      'nhacnhonhiemvuduocgiao',
      'nhacnhonhiemvudatao',
    ]
    show_dagiao: boolean = true;
    show_duocgiao: boolean = true;
    show_datao: boolean = true;
  constructor(
    private fb: FormBuilder,
    private changeDetectorRefs: ChangeDetectorRef,
    public _WidgetTongHopDuAnService: WidgetTongHopDuAnService,
    private translate: TranslateService,
    public dialog: MatDialog,
    public workService: WorksbyprojectService,
      private activatedRoute: ActivatedRoute,
    public DanhMucChungService: DanhMucChungService,
    private router: Router // private changeDetectorRefs: ChangeDetectorRef,

  ) { }
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
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
    }
  }
  loadList(loaicongviec) {
    let result;
    let queryParams;
    if (loaicongviec != 4) {
      queryParams = new QueryParamsModel(
        this.filterConfiguration(0, 5, loaicongviec)
      );
    } else {
      queryParams = new QueryParamsModel(
        this.filterConfiguration(this.project_id, 5, 0)
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
          }
          this.changeDetectorRefs.detectChanges();
          return result;
        }
      }
    );
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
    loaicongviec: any
  ): any {
    const filterNew: any = {
      id_project_team: id_project_team,
      loaicongviec: loaicongviec,
      filter: filter,
    };
    return filterNew;
  }
  onClickWidget(idMenu, filter) {
    this.router.navigate(['/WorkV2/list', idMenu, 'none', filter]);
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

  View(type) {
    let id = 1;
    this.router.navigate(['', { outlets: { auxName: 'auxWork/List/' + id + '/-1/' + type }, }]);
  }
}
