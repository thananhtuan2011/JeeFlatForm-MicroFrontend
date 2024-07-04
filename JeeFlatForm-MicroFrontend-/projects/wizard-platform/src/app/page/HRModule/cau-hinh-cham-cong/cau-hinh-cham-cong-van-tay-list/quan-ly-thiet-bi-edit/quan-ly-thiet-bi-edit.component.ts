import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, from, of, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CauHinhChamCongService } from '../../Services/cau-hinh-cham-cong.service';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { QuanLyThietBiModel } from '../../Model/cau-hinh-cham-cong.model';

@Component({
	selector: 'm-quan-ly-thiet-bi-edit',
	templateUrl: './quan-ly-thiet-bi-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuanLyThietBiEditComponent implements OnInit {
	item: QuanLyThietBiModel;
	oldItem: QuanLyThietBiModel;
	selectedTab: number = 0;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	itemForm: FormGroup;
	viewLoading: boolean = false;
	hasFormErrors: boolean = false;
	loadingAfterSubmit: boolean = false;

	listLoaiTaiSan: any[] = [];
	showTaiSan: boolean = false;
	ID_NV: string = '';
	ShowButton: boolean = false;
	//--------File --------------
	indexItem: number;
	ObjImage: any = { h1: "", h2: "" };
	Image: QuanLyThietBiModel;
	TenFile: string = '';
	disabledBtn: boolean = false;



	constructor(public dialogRef: MatDialogRef<QuanLyThietBiEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private router: Router,
		public _CauHinhChamCongService: CauHinhChamCongService,
		private itemFB: FormBuilder,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
		private translate: TranslateService,) { }


	ngOnInit() {
		this.reset();
		this.item = this.data._item;

		if (this.item.ID > 0) {
			this.ShowButton = false;
		}
		else {
			this.ShowButton = true;
		}
		this.createForm();
		setTimeout(function () {document.getElementById('diachi').focus(); }, 100);
	}

	createForm() {
		this.itemForm = this.itemFB.group({
			diaChi: [this.item.IP, [Validators.required]],
			port: [this.item.Port, [Validators.required]],
			tenMay: [this.item.Name, [Validators.required]],
			loaiMay: [this.item.Type, [Validators.required]],
			madiadiem: [this.item.madiadiem, [Validators.required]],
			matkhau: [this.item.matkhau],
		});
		this.itemForm.controls["diaChi"].markAsTouched();
		this.itemForm.controls["port"].markAsTouched();
		this.itemForm.controls["tenMay"].markAsTouched();
		this.itemForm.controls["loaiMay"].markAsTouched();
		this.itemForm.controls["madiadiem"].markAsTouched();
	}


	reset() {
		this.item = Object.assign({}, this.oldItem);
		this.createForm();
		this.hasFormErrors = false;
		this.itemForm.markAsPristine();
		this.itemForm.markAsUntouched();
		this.itemForm.updateValueAndValidity();
	}




	onSubmit(withBack: boolean = false) {

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
		if (+controls['port'].value < 0) {
			let message = "Port không hợp lệ";
			this.itemForm.controls['port'].setValue('');
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			return;
		}
		let updatedonvi = this.Prepareleave();
		if (updatedonvi.ID > 0) {
			this.UpdateItem(updatedonvi, withBack);
			return;
		}
		this.AddItem(updatedonvi, withBack);
	}

	Prepareleave(): QuanLyThietBiModel {
		const controls = this.itemForm.controls;
		const ts = new QuanLyThietBiModel();
		ts.ID = this.item.ID;
		ts.IP = controls['diaChi'].value;
		ts.Port = controls['port'].value;
		ts.Name = controls['tenMay'].value;
		ts.Type = controls['loaiMay'].value;
		ts.madiadiem = controls['madiadiem'].value;
		ts.matkhau = controls['matkhau'].value;
		return ts;
	}
	AddItem(item: QuanLyThietBiModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.disabledBtn = true;
		this._CauHinhChamCongService.Create(item).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				if (withBack == true) {
					this.dialogRef.close({
						item
					});
				}
				else {
					this.ngOnInit();
					document.getElementById('diachi').focus();
					const _messageType = this.translate.instant('JeeHR.themthanhcong');
					this.layoutUtilsService.showActionNotification(_messageType, MessageType.Create, 4000, true, false);

				}
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	UpdateItem(_item: QuanLyThietBiModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.disabledBtn = true;
		this._CauHinhChamCongService.Create(_item).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				if (withBack == true) {
					this.dialogRef.close({
						_item
					});
				}
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	goBack() {
		this.dialogRef.close();
	}
	getComponentTitle() {
		let result = this.translate.instant('JeeHR.themmoi');
		if (!this.item || !this.item.ID) {
			return result;
		}

		result = this.translate.instant('JeeHR.capnhat');
		return result;
	}


	text(e: any) {
		if (!((e.keyCode > 95 && e.keyCode < 106)
			|| (e.keyCode > 47 && e.keyCode < 58)
			|| e.keyCode == 8)) {
			e.preventDefault();
		}
	}
	f_convertDate(v: any) {

		if (v != "") {
			let a = new Date(v);
			return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
		}
	}

	//======================================================================================================

	//==============Xử lý file============================
	//=========================================================
	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
			if (this.item.ID > 0) {
				this.onSubmit(true);
			}
			else {
				this.onSubmit(false);
			}
		}
	}
	//=========================Bổ sung thêm field mã địa điểm và mật khẩu 04/08/2021 - Thiên=====================
	fieldTextType: boolean;
	toggleFieldTextType() {
		this.fieldTextType = !this.fieldTextType;
	}
}
