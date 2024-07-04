import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
// RXJS
import { fromEvent, merge, ReplaySubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/jeeworkflow/src/modules/crud/utils/layout-utils.service';
import { DanhMucChungService } from '../../../services/danhmuc.service';
import { ProcessWorkService } from '../../../services/process-work.service';

@Component({
	selector: 'kt-cong-viec-dialog-update',
	templateUrl: './cong-viec-dialog-update.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class CongViecDialogUpdateComponent implements OnInit {
	item: any;
	oldItem: any
	Type: number
	//Cập nhật deadline ----- Type = 1
	//Cập nhật mô tả ----- Type = 2
	//Cập nhật kết quả công việc ----- Type = 3
	//Cập nhật người theo dõi ----- Type = 4
	//Cập nhật ghi chú khi tam dừng công việc ----- Type = 5
	//Cập nhật người thực hiện ----- Type = 6
	itemForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	disabledBtn: boolean = false;
	//==================================================

	constructor(public dialogRef: MatDialogRef<CongViecDialogUpdateComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private changeDetectorRefs: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private danhMucChungService: DanhMucChungService,
		public dialog: MatDialog,
		public _ProcessWorkService: ProcessWorkService) { }
	/** LOAD DATA */
	ngOnInit() {
		this.item = this.data._item;
		this.Type = this.data._type;
		if (this.Type == 1) {
			setTimeout(function () { document.getElementById('thoigian').focus(); }, 100);
		}
		if (this.Type == 2) {
			setTimeout(function () { document.getElementById('tencongviec').focus(); }, 100);
		}
		if (this.Type == 3) {
			setTimeout(function () { document.getElementById('ketquacongviec').focus(); }, 100);
		}
		if (this.Type == 4) {
			let dt_follower = [];
			this.data._item.Data_Follower.map((item, index) => {
				dt_follower.push('' + item.ObjectID);
			});
			this.dataTheoDoi = dt_follower;
			this.loadData();
		}
		if (this.Type == 5) {
			setTimeout(function () { document.getElementById('lydo').focus(); }, 100);
		}
		if (this.Type == 6) {
			let dt_thuchien = [];
			this.data._item.Data_Implementer.map((item, index) => {
				dt_thuchien.push('' + item.ObjectID);
			});
			this.dataThucHien = dt_thuchien;
			this.loadData();
		}
		this.createForm();
	}

	createForm() {
		//==========================Type = 1==================
		if (this.Type == 1) {
			this.itemForm = this.fb.group({
				time: [this.item.HanChot != null && this.item.HanChot != '' ? this.item.HanChot : '', Validators.required],
			});
			this.itemForm.controls["time"].markAsTouched();
		}

		//==========================Type = 2==================
		if (this.Type == 2) {
			this.itemForm = this.fb.group({
				tencongviec: [this.item.ToDo, Validators.required],
				motacongviec: [this.item.Description],
			});
			this.itemForm.controls["tencongviec"].markAsTouched();
		}

		//==========================Type = 3==================
		if (this.Type == 3) {
			this.itemForm = this.fb.group({
				ketquacongviec: [''],
			});
		}

		//=========================Type = 4 ===================
		if (this.Type == 4) {
			this.itemForm = this.fb.group({
				theodoi: [this.dataTheoDoi],
			});
		}

		//=========================Type = 5===================
		if (this.Type == 5) {
			this.itemForm = this.fb.group({
				lydo: ['', Validators.required],
			});
			this.itemForm.controls["lydo"].markAsTouched();
		}

		//=========================Type = 6===================
		if (this.Type == 6) {
			this.itemForm = this.fb.group({
				nguoithuchien: [this.dataThucHien, Validators.required],
			});
			this.itemForm.controls["nguoithuchien"].markAsTouched();
		}

	}
	//====================================Type == 1===============================================
	prepareHanChot(): any {
		const controls = this.itemForm.controls;
		let _item = {
			RowID: this.item.RowID,
			TaskName: controls['tencongviec'].value,
			Description: controls['motacongviec'].value,
		};
		return _item;
	}

	UpdateHanChot(_item: any) {
		this.disabledBtn = true;
		this._ProcessWorkService.updateToDo(_item).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.dialogRef.close({
					_item
				});
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	//====================================Type == 2===============================================
	prepareCongViecChiTiet(): any {
		const controls = this.itemForm.controls;
		let _item = {
			RowID: this.item.RowID,
			TaskName: controls['tencongviec'].value,
			Description: controls['motacongviec'].value,
		};
		return _item;
	}

	UpdateCongViecChiTiet(_item: any) {
		this.disabledBtn = true;
		this._ProcessWorkService.updateToDo(_item).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.dialogRef.close({
					_item
				});
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	//====================================Type == 4===========================================================
	public bankFilterCtrlTD: FormControl = new FormControl();
	public filteredBanksTD: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	listTheoDoi: any[] = [];
	dataTheoDoi: any[] = [];

	loadData() {
		this.danhMucChungService.GetDSNguoiTheoDoi().subscribe(res => {
			if (res.data && res.data.length > 0) {
				this.listTheoDoi = res.data;
				this.setUpDropSearcTheoDoi();
				this.changeDetectorRefs.detectChanges();
			}
		});
	}

	setUpDropSearcTheoDoi() {
		this.bankFilterCtrlTD.setValue('');
		this.filterBanksTD();
		this.bankFilterCtrlTD.valueChanges
			.pipe()
			.subscribe(() => {
				this.filterBanksTD();
			});
	}

	protected filterBanksTD() {
		if (!this.listTheoDoi) {
			return;
		}
		// get the search keyword
		let search = this.bankFilterCtrlTD.value;
		if (!search) {
			this.filteredBanksTD.next(this.listTheoDoi.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		// filter the banks
		this.filteredBanksTD.next(
			this.listTheoDoi.filter(bank => bank.Title.toLowerCase().indexOf(search) > -1)
		);
	}

	prepareTheoDoi(): any {
		const controls = this.itemForm.controls;
		let _item = {
			ID: this.item.RowID,/// 1: id node; 2: id todo; 3: id process 
			Type: 3,  /// 1: người thực hiện, 2: người theo dõi (quy trình); 3: người theo dõi (công việc chi tiết) 
			WorkType: 2,  /// 1: công việc; 2: công việc chi tiết; 3: quy trình
			NVIDList: controls['theodoi'].value
		}
		return _item;
	}

	UpdateTheoDoi(_item: any) {
		this._ProcessWorkService.updateImplementer(_item).subscribe(res => {
			if (res && res.status == 1) {
				this.dialogRef.close({
					_item
				});
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	//==============================================Type == 5===============================================
	prepareLyDo(): any {
		const controls = this.itemForm.controls;
		let _item = {
			ID: +this.item.RowID,
			Status: 0,
			Note: controls['lydo'].value,
		}
		return _item;
	}
	UpdateLyDo(_item: any) {
		this._ProcessWorkService.updateStatusToDo(_item).subscribe(res => {
			if (res && res.status == 1) {
				this.dialogRef.close({
					_item
				});
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	//==================================================Type == 6===================================
	dataThucHien: any[] = [];
	prepareNguoiThucHien(): any {
		const controls = this.itemForm.controls;
		let _item = {
			ID: this.item.RowID,/// 1: id node; 2: id todo; 3: id process 
			Type: 1,  /// 1: người thực hiện, 2: người theo dõi (quy trình); 3: người theo dõi (công việc chi tiết) 
			WorkType: 2,  /// 1: công việc; 2: công việc chi tiết; 3: quy trình
			NVIDList: controls['nguoithuchien'].value
		}
		return _item;
	}

	UpdateNguoiThucHien(_item: any) {
		this._ProcessWorkService.updateImplementer(_item).subscribe(res => {
			if (res && res.status == 1) {
				this.dialogRef.close({
					_item
				});
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	//==============================================================================================
	/** ACTIONS */

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		const controls = this.itemForm.controls;
		/* check form */
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}
		if (this.Type == 2) {
			const updatedegree = this.prepareCongViecChiTiet();
			this.UpdateCongViecChiTiet(updatedegree);
		}

		if (this.Type == 4) {
			const updatedegree = this.prepareTheoDoi();
			this.UpdateTheoDoi(updatedegree);
		}

		if (this.Type == 5) {
			const updatedegree = this.prepareLyDo();
			this.UpdateLyDo(updatedegree);
		}

		if (this.Type == 6) {
			const updatedegree = this.prepareNguoiThucHien();
			this.UpdateNguoiThucHien(updatedegree);
		}

	}

	goBack() {
		this.dialogRef.close();
	}
}
