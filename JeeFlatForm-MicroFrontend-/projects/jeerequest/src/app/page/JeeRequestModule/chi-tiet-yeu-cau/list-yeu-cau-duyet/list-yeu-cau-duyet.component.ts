import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import moment from 'moment';
import { YeuCauService } from '../../_services/yeu-cau.services';
import { QueryParamsModelNew } from '../../../models/query-models/query-params.model';

@Component({
  selector: 'app-list-yeu-cau-duyet',
  templateUrl: './list-yeu-cau-duyet.component.html',
  styleUrls: ['./list-yeu-cau-duyet.component.scss']
})
export class ListYeuCauDuyetComponent implements OnInit {
  @Input() keyword?: any;
  @Input() tuNgay?: any;
  @Input() denNgay?: any;
  @Input() loaiYeuCau?: any;
  @Input() tinhTrang?: string = "0";
  @Input() isLoad?: string = "";
  isLoading: boolean = false;
  list_yeucau: any;
  _dataAll: any;
  pageSize: number;
  constructor(private requestsService: YeuCauService,
    private changeDetectorRefs: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadDataList()
    this.requestsService.data_shareDuyet$.subscribe((data: any) => {
      if (data && data.length != 0 && this.list_yeucau) {
        let vitri = this.list_yeucau.findIndex(x => x.RowID === data.data[0].RowID)
        this.list_yeucau.splice(vitri, 1, data.data[0]);
        this.changeDetectorRefs.detectChanges();
      }
    })
    this.requestsService.data_shareLoad$.subscribe((data: any) => {
      this.loadDataList()
    })
  }
  loadDataList() {
    this.isLoading = true
    const queryParams1 = new QueryParamsModelNew(
      this.filterConfiguration(),
      "",
      "",
      (this.pageSize = 0),
      100,
      false
    );
    this.requestsService
      .getDSYeuCauDuyet(queryParams1)
      .subscribe((res) => {
        this._dataAll = res.data;
        this.list_yeucau = this._dataAll.slice();
        this.isLoading = false
        this.changeDetectorRefs.detectChanges();
      });
  }

  ngOnChanges() {
    this.loadDataList();
  }

  getColor2(condition: number = 0): string {
    switch (condition) {
      case 1:
        //Thiên thay đổi code để đồng bộ color theo custemer
        const styles = window.getComputedStyle(document.body);
        let _color = styles.getPropertyValue("--btn-add-plus");
        return _color;
      case 2:
        return "#DC3545";
    }
    return "#F48120";
  }
  danhDauQuanTrong(idDanhDau: number, idyeucau: number, vitri: number) {

    this.requestsService.DanhDauYeuCauDuyet(
      idDanhDau,
      idyeucau
    ).subscribe((res) => {
      if (!res) {
      } else {
        this.list_yeucau.splice(vitri, 1, res.data[0]);
        this.requestsService.data_shareLoadDetail$.next('load')
        this.changeDetectorRefs.detectChanges();
      }
    });

  }
  filterConfiguration(): any {
    const filter: any = {};
    filter.status = this.tinhTrang;
    filter.keyWord = this.keyword
    filter.TuNgay = this.tuNgay
    filter.DenNgay = this.denNgay
    filter.LoaiYeuCau = this.loaiYeuCau
    return filter;
  }
  convertDate(d: any) {
    return moment(d + 'z').format("DD/MM/YYYY hh:mm");
  }
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 115;
    return tmp_height + 'px';
  }
  onScroll(event) {
    this.pageSize += 1;
    this.loadDataListLayzy(this.pageSize);
  }
  loadDataListLayzy(page: number) {
    const queryParams1 = new QueryParamsModelNew(
      this.filterConfiguration(),
      "",
      "",
      page,
      5,
      false
    );
    this.requestsService
      .getDSYeuCauDuyet(queryParams1)
      .subscribe((res) => {
        if (res.data != null) {
          if (this.list_yeucau.length >= res.page.TotalCount) {
            return;
          } else {
            for (let i = 0; i < res.data.length; i++) {
              this.list_yeucau.push(res.data[i]);
              this.changeDetectorRefs.detectChanges();
            }
          }

        }
      });
  }
}
