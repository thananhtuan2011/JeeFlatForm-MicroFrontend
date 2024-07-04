import { Component, OnInit, Inject, ChangeDetectionStrategy, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplateDashboardService } from '../Services/template-dashboard.service';
import { TemplateDashboardModel } from '../Model/template-dashboard.model';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';

@Component({
	selector: 'kt-template-dashboard-edit',
	templateUrl: './template-dashboard-edit.component.html',
})
export class TemplateDashboardEditComponent implements OnInit {
	item: TemplateDashboardModel;
	oldItem: TemplateDashboardModel
	itemForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	@ViewChild("focusInput", { static: true }) focusInput: ElementRef;
	disabledBtn: boolean = false;
	listObject: any[] = [];
	listTheoDoi: any[] = [];
	listApDung: any[] = [];
	//====================Người Áp dụng====================
	public bankFilterCtrlAD: FormControl = new FormControl();
	public filteredBanksAD: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

	//====================Người theo dõi===================
	public bankFilterCtrlTD: FormControl = new FormControl();
	public filteredBanksTD: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

	//====================Thanh viên quản trị===================
	listQuanTri: any[] = [];
	public bankFilterCtrlQT: FormControl = new FormControl();
	public filteredBanksQT: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

	//====================Nhóm thành viên tạo nhiệm vụ===================
	listTaoNhiemVu: any[] = [];
	public bankFilterCtrlTaoNV: FormControl = new FormControl();
	public filteredBanksTaoNV: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

	listFailReason: any[] = [];
	ShowAddFail: boolean = false;
	listDoneReason: any[] = [];
	ShowAddDone: boolean = false;
	//================Check goBack form======================
	isDirty$: Observable<boolean>;
	sub: Subscription;
	store: any;
	isBack: boolean;
	//=================Check sử dụng JeeHR==================
	isJeeHR: boolean = false;
	constructor(public dialogRef: MatDialogRef<TemplateDashboardEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private changeDetectorRefs: ChangeDetectorRef,
		private _TemplateDashboardService: TemplateDashboardService,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private router: Router,) { }
	/** LOAD DATA */
	ngOnInit() {
		this.item = this.data._item;
		if (this.item.RowID > 0) {
			this.viewLoading = true;
			this.createForm();
		}
		else {
			this.viewLoading = false;
			this.createForm();
		}
		this.focusInput.nativeElement.focus();
	}

	createForm() {

		this.itemForm = this.fb.group({
			title: ['' + this.item.title, Validators.required],
		});
		this.itemForm.controls["title"].markAsTouched();
	}

	prepareCustomer(): TemplateDashboardModel {
		const controls = this.itemForm.controls;
		const _item = new TemplateDashboardModel();
		_item.RowID = this.item.RowID;
		_item.title = controls['title'].value;
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

		const updatedegree = this.prepareCustomer();
		if (updatedegree.RowID > 0) {
			this.Update(updatedegree, withBack);
		} else {
			this.Create(updatedegree, withBack);
		}
	}

	Update(_item: TemplateDashboardModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.disabledBtn = true;
		this._TemplateDashboardService.Update_Template(_item).subscribe(res => {
			/* Server loading imitation. Remove this on real code */
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				if (withBack == true) {
					this.dialogRef.close({
						_item
					});
				}
				else {
					this.ngOnInit();
					const _messageType = this.translate.instant('GeneralKey.capnhatthanhcong');
					this.layoutUtilsService.showActionNotification(_messageType, MessageType.Update, 4000, true, false).afterDismissed().subscribe(tt => {
					});
					this.focusInput.nativeElement.focus();
				}
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	Create(_item: TemplateDashboardModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.disabledBtn = true;
		this._TemplateDashboardService.Update_Template(_item).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				if (withBack == true) {
					this.dialogRef.close({
						_item
					});
				}
				else {
					this.dialogRef.close();
					this.router.navigate([`Template/${res.data.RowID}`]);
				}
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	close() {
		this.dialogRef.close();
	}

	getTitle(): string {
		let result = "Thêm mới";
		if (!this.item || !this.item.RowID) {
			return result;
		}

		result = "Chỉnh sửa";
		return result;
	}

	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	ngOnDestroy() {
		this.sub && this.sub.unsubscribe();
	}
	reset() {
		this.item = Object.assign({}, this.item);
		this.createForm();
		this.hasFormErrors = false;
		this.itemForm.markAsPristine();
		this.itemForm.markAsUntouched();
		this.itemForm.updateValueAndValidity();
	}
	//===============================================================================================================
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
}
