import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { DatPhongService } from '../../Services/dat-phong.service';
import { QuanLyPhongHopGhiChuComponent } from '../quan-ly-phong-hop-ghi-chu/quan-ly-phong-hop-ghi-chu.component';
import { QuanLyPhongHopDialogComponent } from '../quan-ly-phong-hop-dialog/quan-ly-phong-hop-dialog.component';
import { LayoutUtilsService, MessageType } from 'projects/jeeadmin/src/modules/crud/utils/layout-utils.service';

@Component({
	selector: 'm-quan-ly-phong-hop-info',
	templateUrl: './quan-ly-phong-hop-info.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuanLyPhongHopInfoComponent implements OnInit {
	//Form
	itemForm: FormGroup;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loadingControl = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	hasFormErrors: boolean = false;
	item: any;
	oldItem: any;
	selectedTab: number = 0;
	luu: boolean = true;
	capnhat: boolean = false;
	RowID: string = '';
	loadingAfterSubmit: boolean = false;
	// Selection
	viewLoading: boolean = false;
	IsXacNhan: number;
	isDel: boolean = false
	IsEdit: boolean = false;

	constructor(private QuanLyPhongHopService: DatPhongService,
		public dialogRef: MatDialogRef<QuanLyPhongHopInfoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog,
		public datepipe: DatePipe,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,) { }

	/** LOAD DATA */
	ngOnInit() {
		this.item = this.data._item;
		if (this.item.extendedProps.type == 0) { //chờ xác nhận
			this.IsXacNhan = 0;
		} else if (this.item.extendedProps.type == 2) { //hủy
			this.IsXacNhan = -1;
		}
		else {
			this.IsXacNhan = 1; //đã xác nhận
		}

		this.IsEdit = this.item.extendedProps.isedit;
		this.isDel = this.item.extendedProps.isdel
	}

	reset() {
		this.item = Object.assign({}, this.oldItem);
		this.hasFormErrors = false;
		this.itemForm.markAsPristine();
		this.itemForm.markAsUntouched();
		this.itemForm.updateValueAndValidity();
	}

	onSumbit() {
		this.hasFormErrors = false;
		const controls = this.itemForm.controls;
		/** check form */
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}


		let updatedonvi = this.Prepareleave();
		this.AddItem(updatedonvi);
	}

	Prepareleave(): any {
		const controls = this.itemForm.controls;
		let item = {
			RowID: this.RowID,
			Status: 2,
			LyDo: controls['ghichu'].value,
		};
		return item;
	}

	AddItem(item: any) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.QuanLyPhongHopService.Delete_PhongHop(item).subscribe(res => {
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.dialogRef.close({
					item
				});
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	deleteItem() {
		const _title = this.translate.instant('COMMON.Huy');
		const _description = this.translate.instant('datphonghop.bancochacchanmuonhuykhong');
		const _waitDesciption = this.translate.instant('datphonghop.dulieudangduocxuly');
		const _deleteMessage = this.translate.instant('datphonghop.huythanhcong');

		// const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		// dialogRef.afterClosed().subscribe(res => {
		// 	if (!res) {
		// 		return;
		// 	}
			const dialogRef = this.dialog.open(QuanLyPhongHopGhiChuComponent, { disableClose: true,  panelClass: ['sky-padding-0'],
  				data: { _item: this.item }, width: '50%' });
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}
				else {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Update, 4000, true, false);
					this.dialogRef.close({
						_item: this.item
					})
				}
			});
		// });
	}

	update() {
		let mess = this.translate.instant('COMMON.suathanhcong');
		const dialogRef = this.dialog.open(QuanLyPhongHopDialogComponent, { disableClose: true, panelClass: ['sky-padding-0'],
			data: { _item: this.item }, width: '50%' });
		dialogRef.afterClosed().subscribe(res => {
			if (res) {
				this.dialogRef.close({
					_item: this.item
				})
				this.layoutUtilsService.showActionNotification(mess, MessageType.Create, 4000, true, false);
			}
		});
	}

	getString(val: number, isDel: boolean) {
		if(isDel) {
			return "Đã hủy"
		}
		switch(val) {
			case 0:
				return "Đang chờ xác nhận"
			case 1:
				return "Đã đặt"
			case 2:
				return "Đã hủy"
		}
	}

	XacNhan() {
		const _title = this.translate.instant('Xác nhận');
		const _description = this.translate.instant('datphonghop.bancochacchanmuonxacnhan');
		const _waitDesciption = this.translate.instant('datphonghop.dulieudangduocxuly');
		const _deleteMessage = this.translate.instant('Xác nhận thành công');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption, '');
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			let item = {
				RowID: this.item.id,
				Status: 1,
			}
			this.QuanLyPhongHopService.Confirm_DatPhongHop(item).subscribe(res => {
				this.changeDetectorRefs.detectChanges();
				if (res && res.status === 1) {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Update, 4000, true, false);
					this.dialogRef.close({
						_item: this.item
					})
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
				}
			});
		});
	}

	//===================================================
	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
			this.onSumbit();
		}
	}

	goBack() {
		this.dialogRef.close();
	}
}
