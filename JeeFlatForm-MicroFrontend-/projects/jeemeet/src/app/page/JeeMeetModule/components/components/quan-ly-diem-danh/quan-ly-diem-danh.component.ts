

import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { SelectionModel } from "@angular/cdk/collections";
import { BehaviorSubject, Subscription, fromEvent, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CuocHopInfoComponent } from '../cuoc-hop-info/cuoc-hop-info.component';
import { FormGroup } from '@angular/forms';
import { PaginatorState } from '../../../../share/models/paginator.model';
import { GroupingState } from '../../../../share/models/grouping.model';
import { SortState } from '../../../../share/models/sort.model';
import { QuanLyCuocHopService, QuanLyDiemDanhService, QuanLyPhatBieuService } from '../../../_services/quan-ly-cuoc-hop.service';
import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';

const root = '/Get_DanhSachDiemDanh';
@Component({
  selector: 'app-quan-ly-diem-danh',
  templateUrl: './quan-ly-diem-danh.component.html',
  styleUrls: ['./quan-ly-diem-danh.component.scss']
})
export class QuanLyDiemDanhComponent implements OnInit {
  loadingSubject = new BehaviorSubject<boolean>(false);
	filterGroup: FormGroup;
	searchGroup: FormGroup;
	paginator: PaginatorState;
	sorting: SortState;
	grouping: GroupingState;
	isLoading: boolean = false;
	private subscriptions: Subscription[] = [];
	// Filter fields
	// @ViewChild("searchInput", { static: true }) searchInput: ElementRef;
	filterStatus: string = "";
	filterCondition: string = "";
	filterKeyWord: string = "";
	listPage: BehaviorSubject<number[]> = new BehaviorSubject<number[]>(
		Array.from(new Array(10), (val, index) => index)
	);
	QuanLyKhaoSatResult: any = [];
  constructor(
		public dialogRef: MatDialogRef<QuanLyDiemDanhComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public productsService: QuanLyDiemDanhService,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private router: Router,
		private translate: TranslateService,
		private layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
  ) { }

  ngOnInit() {
		// this.loadDataList();
		this.grouping = this.productsService.grouping;
		this.paginator = this.productsService.paginator;
		this.sorting = this.productsService.sorting;
		const sb = this.productsService.isLoading$.subscribe((res) => (this.isLoading = res));
    this.productsService.items$.subscribe(
      (res) =>
      (
        this.QuanLyKhaoSatResult = res

      )
    );
		this.subscriptions.push(sb);
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
	XacNhanThamGia(type: number, it:any) {
		var item = {
			meetingid: this.data._item,
			Note: "",
			Status: 1,
			UserID: it.UserID,
			Type: it.Type
		}
		if(type == 3){
			const dialogRef = this.dialog.open(CuocHopInfoComponent, { data: {  }, width: '40%' });
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}else{
					item.Note = res._item
					item.Status = 2
					this.SaveXacNhan(item)
				}
			});
		}else if(type == 1){
			this.SaveXacNhan(item)
		}
    // else if(type == 3){
		// 	const _title: string = 'Xác nhận vắng mặt ';
		// 	const _description: string = 'Bạn muốn xác nhận thành viên vắng mặt?';
		// 	const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

		// 	const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		// 	dialogRef.afterClosed().subscribe(res => {
		// 	if (!res) {
		// 		return;
		// 	}
		// 	item.Status = 3
		// 	this.SaveXacNhan(item)
		// 	});
		// }
    else if(type == 4){
			const _title: string = 'Từ chối vắng mặt ';
			const _description: string = 'Bạn muốn từ chối thành viên này vắng mặt?';
			const _waitDesciption: string = 'Dữ liệu đang được cập nhật...';

			const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
			dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const dialogRef = this.dialog.open(CuocHopInfoComponent, { data: {  }, width: '40%' });
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}else{
					item.Note = res._item
					item.Status = 0
					this.SaveXacNhan(item)
				}
			});
			});
		}
	}

	SaveXacNhan(item:any){
		this.productsService.XacNhanThamGiaCuocHop(item).subscribe(res => {
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

	getTrangThaiText(item){

		var text = "";
		switch(item){
			case 0:
				text = "Chờ xác nhận"
				break;
			case 1:
				text = "Xác nhận tham gia"
                break;
            case 2:
				text = "Báo vắng"
				break;
			case 3:
				text = "Vắng"
				break;
		}
		return text
	}

  getHeight(): any {
    let tmp_height = 0;
    tmp_height = window.innerHeight - 250;
    return tmp_height + 'px';
  }
}
