import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { QuanLyPhongHopGhiChuComponent } from '../quan-ly-phong-hop-ghi-chu/quan-ly-phong-hop-ghi-chu.component';
import { LayoutUtilsService, MessageType } from 'projects/jeemeeting/src/modules/crud/utils/layout-utils.service';

@Component({
  selector: 'app-quan-ly-phong-hop-info',
  templateUrl: './quan-ly-phong-hop-info.component.html'
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




	constructor(
		public dialogRef: MatDialogRef<QuanLyPhongHopInfoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog,
		public datepipe: DatePipe,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private itemFB: FormBuilder,
	) { }

	/** LOAD DATA */
	ngOnInit() {

		this.item = this.data._item;
	}

	//---------------------------------------------------------



	createForm() {
		this.itemForm = this.itemFB.group({
			ghichu: [this.item.GhiChu, Validators.required],
		});
		this.itemForm.controls["ghichu"].markAsTouched();
	}

	reset() {
		this.item = Object.assign({}, this.oldItem);
		this.createForm();
		this.hasFormErrors = false;
		this.itemForm.markAsPristine();
		this.itemForm.markAsUntouched();
		this.itemForm.updateValueAndValidity();
	}


	f_number(value: any) {
		return Number((value + '').replace(/,/g, ""));
	}

	f_currency(value: any, args?: any): any {
		let nbr = Number((value + '').replace(/,|-/g, ""));
		return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	}
	/** Delete */
	deleteItem() {
		const _title = this.translate.instant('Hủy');
		const _description = this.translate.instant('Bạn có chắc chắn muốn hủy không');
		const _waitDesciption = this.translate.instant('Dữ liệu đang xử lý');
		const _deleteMessage = this.translate.instant('Hủy thành công');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			const dialogRef = this.dialog.open(QuanLyPhongHopGhiChuComponent, {
				disableClose:true,
 panelClass:'no-padding',
 data: { _item: this.item }, width: '50%' });
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}
				else {
					this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Update, 4000, true, false);
					this.dialogRef.close({
						_item: this.item
					});
				}
			});
		});
	}
	//===================================================
	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
		}
	}

	goBack() {
		this.dialogRef.close();
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
}
