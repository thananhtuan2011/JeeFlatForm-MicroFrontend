import { Component, OnInit, Inject, ChangeDetectionStrategy, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { ContractTypeModel } from '../Model/danh-muc-loai-hop-dong.model';
import { DanhMucLoaiHopDongService } from '../Services/danh-muc-loai-hop-dong.service';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
@Component({
	selector: 'app-danh-muc-loai-hop-dong-edit-dialog',
	templateUrl: './danh-muc-loai-hop-dong-edit-dialog.component.html',
})
export class DanhMucLoaiHopDongEditDialogComponent implements OnInit {
	item: ContractTypeModel;
	oldItem: ContractTypeModel
	itemForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	ListMauIn: any[] = [];
	listtypestaff: any[] = [];
	listdonvi: any[] = [];
	disabledBtn: boolean = false;
	IsShowExpire: boolean = false;
	@ViewChild("focusInput", { static: true }) focusInput: ElementRef;
	ListMauDanhGia: any[] = [];
	constructor(public dialogRef: MatDialogRef<DanhMucLoaiHopDongEditDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		public _DanhMucLoaiHopDongService: DanhMucLoaiHopDongService,
		private layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
		private translate: TranslateService) { }

	/** LOAD DATA */
	ngOnInit() {
		this.item = this.data._item;
		if (this.item.Id_Row > 0) {
			this.viewLoading = true;
		}
		else {
			this.viewLoading = false;
		}
		this.createForm();
		this._DanhMucLoaiHopDongService.GetListStaffType().subscribe(res => {
			this.listtypestaff = res.data;
		});
		this._DanhMucLoaiHopDongService.GetListPrintedForm('1').subscribe(res => {
			this.ListMauIn = res.data;
			this.changeDetectorRefs.detectChanges();
		})
		this._DanhMucLoaiHopDongService.GetListMauDanhGia().subscribe(res => {
			this.ListMauDanhGia = res.data;
			this.changeDetectorRefs.detectChanges();
		})
		let LangCode = localStorage.getItem('language');
		this._DanhMucLoaiHopDongService.GetDSDonViThoiHanHD(LangCode).subscribe(res => {
			this.listdonvi = res.data;
		});
		this.focusInput.nativeElement.focus();

		if (this.item.Id_Row > 0) {
			if (this.item.KhongXacDinhThoiHan) {
				this.IsShowExpire = true;
				this.itemForm.controls["thoihanhopdong"].setValue("1");
				this.itemForm.controls["dv_thoihan"].setValue(" ");
				this.itemForm.controls["nhacnhotruocngay"].setValue(" ");
			} else {
				this.IsShowExpire = false;
			}
		}
		else {
			if (this.data._item.KhongXacDinhThoiHan) {
				this.IsShowExpire = true;
				this.itemForm.controls["thoihanhopdong"].setValue("1");
				this.itemForm.controls["dv_thoihan"].setValue(" ");
				this.itemForm.controls["nhacnhotruocngay"].setValue(" ");
				this.changeDetectorRefs.detectChanges();
			} else {
				this.IsShowExpire = false;
				this.itemForm.controls["thoihanhopdong"].setValue("");
				this.itemForm.controls["dv_thoihan"].setValue("");
				this.itemForm.controls["nhacnhotruocngay"].setValue("");
				this.changeDetectorRefs.detectChanges();
			}
		}
	}

	createForm() {

		this.itemForm = this.fb.group({
			TenLoai: [this.item.TenLoai, Validators.required],
			MaLoai: [this.item.MaLoai, Validators.required],
			KhongXacDinhThoiHan: [this.item.KhongXacDinhThoiHan],

			LaHopDongThuViec: [this.item.LaHopDongThuViec],
			thoihanhopdong: [this.item.ThoiHanHD, Validators.required],
			dv_thoihan: ['' + this.item.DVThoiHanHD, Validators.required],

			BatDauDongBH: [this.item.BatDauDongBH],
			ThoiHanBaoTruoc: [this.item.ThoiHanBaoTruoc],
			FileIn: [this.item.ID_FileIn > 0 ? '' + this.item.ID_FileIn : ""],
			LoaiNhanVien: [this.item.ID_LoaiNhanVien > 0 ? '' + this.item.ID_LoaiNhanVien : "", Validators.required],
			nhacnhotruocngay: [this.item.NhacNhoHetHanHD, Validators.required],
			FileDanhGia: [this.item.MauDanhGiaID > 0 ? '' + this.item.MauDanhGiaID : ""]
			// ThuTuKyHD: [this.item.ThuTuKyHD, Validators.required],


		});
		this.itemForm.controls["TenLoai"].markAsTouched();
		this.itemForm.controls["MaLoai"].markAsTouched();
		this.itemForm.controls["LoaiNhanVien"].markAsTouched();

		this.itemForm.controls["thoihanhopdong"].markAsTouched();
		this.itemForm.controls["dv_thoihan"].markAsTouched();
		this.itemForm.controls["nhacnhotruocngay"].markAsTouched();
	}
	Change(val: any) {

		if (val.checked) {
			this.IsShowExpire = true;
			this.itemForm.controls["thoihanhopdong"].setValue("1");
			this.itemForm.controls["dv_thoihan"].setValue(" ");
			this.itemForm.controls["nhacnhotruocngay"].setValue(" ");

		}
		else {
			this.IsShowExpire = false;
			this.itemForm.controls["thoihanhopdong"].setValue("");
			this.itemForm.controls["dv_thoihan"].setValue("");
			this.itemForm.controls["nhacnhotruocngay"].setValue("");

		}
	}
	/** UI */
	getTitle(): string {
		let result = this.translate.instant('JeeHR.themmoi');
		if (!this.item || !this.item.Id_Row) {
			return result;
		}
		result = this.translate.instant('JeeHR.capnhat') + ` - Tên loại hợp đồng: ${this.item.TenLoai}`;
		return result;
	}
	/** ACTIONS */
	prepareCustomer(): ContractTypeModel {

		const controls = this.itemForm.controls;
		const _item = new ContractTypeModel();
		_item.Id_Row = this.item.Id_Row;
		_item.TenLoai = controls['TenLoai'].value; // lấy tên biến trong formControlName	
		_item.MaLoai = controls['MaLoai'].value;
		_item.LaHopDongThuViec = controls['LaHopDongThuViec'].value;
		_item.BatDauDongBH = controls['BatDauDongBH'].value;
		_item.KhongXacDinhThoiHan = controls['KhongXacDinhThoiHan'].value;
		_item.ID_FileIn = +controls['FileIn'].value;
		_item.ID_LoaiNhanVien = +controls['LoaiNhanVien'].value;
		_item.NhacNhoHetHanHD = controls['nhacnhotruocngay'].value;
		_item.ThoiHanBaoTruoc = controls['ThoiHanBaoTruoc'].value;

		if (!this.IsShowExpire) {
			_item.ThoiHanHD = controls['thoihanhopdong'].value;
			_item.DVThoiHanHD = controls['dv_thoihan'].value;

		} else {
			_item.DVThoiHanHD = 0;
			_item.ThoiHanHD = 0;
		}

		_item.MauDanhGiaID = +controls['FileDanhGia'].value;
		return _item;
	}
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
		const ContractType = this.prepareCustomer();
		if (ContractType.Id_Row > 0) {
			this.Update(ContractType, withBack);
		} else {
			this.Create(ContractType, withBack);
		}
	}
	Update(_item: ContractTypeModel, withBack: boolean) {

		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.disabledBtn = true;
		this._DanhMucLoaiHopDongService.Create(_item).subscribe(res => {
			/* Server loading imitation. Remove this on real code */
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
	reset() {
		this.item = Object.assign({}, this.item);
		this.createForm();
		this.hasFormErrors = false;
		this.itemForm.markAsPristine();
		this.itemForm.markAsUntouched();
		this.itemForm.updateValueAndValidity();
	}
	Create(_item: ContractTypeModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		//	this.viewLoading = true;
		this.disabledBtn = true;
		this._DanhMucLoaiHopDongService.Create(_item).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				if (withBack == true) {
					this.dialogRef.close({
						_item
					});
				}
				else {
					const _messageType = this.translate.instant('JeeHR.themthanhcong');
					this.layoutUtilsService.showActionNotification(_messageType, MessageType.Update, 4000, true, false).afterDismissed().subscribe(tt => {
					});
					this.focusInput.nativeElement.focus();
					this.ngOnInit();
				}
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	goBack() {
		this.dialogRef.close();
	}

	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
			this.item = this.data._item;
			if (this.viewLoading == true) {
				this.onSubmit(true);
			}
			else {
				this.onSubmit(false);
			}
		}
	}
	CheckThoiGianBaoTruoc(e: any) {
		if (e.target.value <= 0) {
			this.layoutUtilsService.showActionNotification("Thời gian báo trước phải lớn hơn 0", MessageType.Read, 99999999999, true, false, 0, 'top', 0);
			return null;
		}
	};
	text(e: any) {
		if (!((e.keyCode > 95 && e.keyCode < 106)
			|| (e.keyCode > 45 && e.keyCode < 58)
			|| e.keyCode == 8)) {
			e.preventDefault();
		}
	}
}
