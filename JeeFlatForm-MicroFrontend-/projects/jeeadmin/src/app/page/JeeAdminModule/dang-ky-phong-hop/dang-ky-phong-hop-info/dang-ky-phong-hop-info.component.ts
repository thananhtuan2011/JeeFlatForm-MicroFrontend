import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DatePipe } from '@angular/common';
import { LayoutUtilsService, MessageType } from 'projects/jeeadmin/src/modules/crud/utils/layout-utils.service';
import { GhiChuPhongHopEditComponent } from '../ghi-chu-edit/ghi-chu-edit.component';

@Component({
	selector: 'm-dang-ky-phong-hop-info',
	templateUrl: './dang-ky-phong-hop-info.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class DangKyPhongHopInfoComponent implements OnInit {

	loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	item: any;
	loadingAfterSubmit: boolean = false;
	viewLoading: boolean = false;

	constructor(
		public dialogRef: MatDialogRef<DangKyPhongHopInfoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog,
		public datepipe: DatePipe,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService) { }


	ngOnInit() {	
		this.item = this.data._item;
	}

	getTenTrangThai(id: number) {
		if	(id	==	-1) 
			return "Đã được đặt"
		if	(id	==	0) 
			return "Chưa xác nhận"
		if	(id	==	1) 
			return "Đã xác nhận"
		if	(id	==	2) 
			return "Không xác nhận"
	}

	//Hủy đăng ký tài sản
	deleteItem() {
		const _checkMessage = this.translate.instant("datphonghop.huythanhcong");
		const dialogRef = this.dialog.open(GhiChuPhongHopEditComponent, { data: { _item: this.item }, panelClass: ['sky-padding-0'], width: '50%' });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			else {
				this.layoutUtilsService.showActionNotification(_checkMessage, MessageType.Update, 4000, true, false, 3000, 'top', 0);
				this.dialogRef.close({
					_item: this.item
				});
			}
		});
	}

	goBack() {
		this.dialogRef.close();
	}
}
