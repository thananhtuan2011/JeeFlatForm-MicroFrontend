

import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
// import { QLCuocHopService } from '../../quan-ly-cuoc-hop-service/quan-ly-cuoc-hop.service';
// import { TokenStorage } from "./../../../../../../../core/auth/_services/token-storage.service";
import { SelectionModel } from "@angular/cdk/collections";
import { BehaviorSubject, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { ChangeDetectorRef, Component, Inject, NgZone, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QuanLyCuocHopService, QuanLyPhatBieuService } from '../../../_services/quan-ly-cuoc-hop.service';
import { FormGroup } from '@angular/forms';
import { PaginatorState } from '../../../../share/models/paginator.model';
import { GroupingState } from '../../../../share/models/grouping.model';
import { SortState } from '../../../../share/models/sort.model';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
// import { QueryParamsModel } from './../../../../../../../core/_base/crud/models/query-models/query-params.model';
// import { DanhSachPhatBieuDataSource } from './danh-sach-phat-bieu-datasource/danh-sach-phat-bieu-datasource';
const root = '/Get_DanhSachPhatBieu';
@Component({
  selector: 'app-danh-sach-phat-bieu',
  templateUrl: './danh-sach-phat-bieu.component.html',
  styleUrls: ['./danh-sach-phat-bieu.component.scss']
})
export class DanhSachPhatBieuComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(false);
	filterGroup: FormGroup;
	searchGroup: FormGroup;
	paginator: PaginatorState;
	sorting: SortState;
	grouping: GroupingState;
	isLoading: boolean = false;
	private subscriptions: Subscription[] = [];
	filterStatus: string = "";
	filterCondition: string = "";
	filterKeyWord: string = "";
	listPage: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(
		Array.from(new Array(10), (val, index) => index)
	);
	QuanLyKhaoSatResult: any[] = [];
  constructor(
    public dialogRef: MatDialogRef<DanhSachPhatBieuComponent>,
	@Inject(MAT_DIALOG_DATA) public data: any,
	public productsService: QuanLyPhatBieuService,
  public dangKyCuocHopService: QuanLyCuocHopService,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private router: Router,
		private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
    private _ngZone: NgZone
	) { }
  ngOnInit() {
		// this.loadDataList();
		this.grouping = this.productsService.grouping;
		this.paginator = this.productsService.paginator;
		this.sorting = this.productsService.sorting;
		const sb = this.productsService.isLoading$.subscribe((res) => (this.isLoading = res));
    this.productsService.items$.subscribe(
      (res) => (this.QuanLyKhaoSatResult = res)
    );
		this.subscriptions.push(sb);


    this.dangKyCuocHopService.NewMess$.subscribe((message: any) => {
      this._ngZone.run(() => {
        if (message) {
          if(message.type == 2){
            let data = message.data
            console.log(data)
            if (data.userID === 0) {
              this.loadDataList();
            }
          }
          this.changeDetectorRefs.detectChanges()
        }
      });
    });
  }
	loadDataList() {
		const filter = this.filterConfiguration();
		this.productsService.patchState({ filter }, root);

	}
  paginate(paginator: PaginatorState) {
    const filter = this.filterConfiguration();
		this.productsService.patchState({ filter, paginator }, root);
	}
	filterConfiguration(): any {
		const filter: any = {};
    filter.IDMeeting = +this.data._item;
		return filter;
	}

	getTitleStatus(item){
		if(item == 1){
			return "Chờ phát biểu"
		}else if(item == 2){
			return "Đã phát biểu"
		}
		return "Đã hủy"
	}

	XinPhatBieu(UserID:any, type:any){
		var item = {
			meetingid: this.data._item,
			PhatBieu: false,
			Status: type,
			UserID: UserID
		}
		this.productsService.XinPhatBieuCuocHop(item).subscribe(res => {
			if (res && res.status === 1) {
				this.layoutUtilsService.showActionNotification(
					this.translate.instant("QL_CUOCHOP.CUOCHOP.UPDATE_THANHCONG"),
					MessageType.Read,
					4000,
					true,
					false,
				);
				this.loadDataList();
				this.changeDetectorRefs.detectChanges()
			} else {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Read,
					9999999999,
					true,
					false,
				);
				this.changeDetectorRefs.detectChanges()
			}
		});
	}
  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 250;
    return tmp_height + 'px';
  }
}
