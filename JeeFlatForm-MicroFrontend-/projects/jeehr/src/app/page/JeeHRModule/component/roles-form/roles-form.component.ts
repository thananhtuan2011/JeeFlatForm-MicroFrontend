import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Material
// RXJS
import { fromEvent, merge, BehaviorSubject, ReplaySubject } from 'rxjs';
// Services
// Models
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { DonTuService } from '../../don-tu/services/don-tu.services';
import { DanhMucChungService } from '../../../services/danhmuc.service';
import { QuanLyDuyetService } from '../../../JeeCalendarModule/calendar/services/quan-ly-duyet.service';
import { QueryParamsModel } from '../../../models/query-models/query-params.model';
import { ChangeApproverData } from '../../../JeeCalendarModule/calendar/Model/calendar.model';


@Component({
	selector: 'm-roles-form',
	templateUrl: './roles-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class RolesFormComponent implements OnInit {
	//Form
	itemForm: FormGroup;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loadingControl = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	hasFormErrors: boolean = false;
	item: any;
	oldItem: any;
	ID_NV: string = '';
	disabledBtn: boolean = false;
	//====================Nhân viên====================
	public bankFilterCtrl: FormControl = new FormControl();
	public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	ID: number = 0;
	TypeID: string;
	RoleID: number = 0;
	constructor(
		public dialogRef: MatDialogRef<RolesFormComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog,
		public datepipe: DatePipe,
		private itemFB: FormBuilder,
		private danhMucChungService: DanhMucChungService,
		private changeDetectorRefs: ChangeDetectorRef,
		private quanLyDuyetService: QuanLyDuyetService,
		public donTuServices: DonTuService,
		private layoutUtilsService: LayoutUtilsService,
	) { }

	/** LOAD DATA */
	ngOnInit() {
		this.ID = this.data._id;
		this.RoleID = this.data._roleid;
		this.TypeID = this.data._typeid;
		this.createForm();
		this.LoadNhanVien();
	}
	//---------------------------------------------------------



	createForm() {
		this.itemForm = this.itemFB.group({
			note: ['', Validators.required],
			approverId: ['', Validators.required],
			role: [this.data._role],
		});
		this.itemForm.controls["note"].markAsTouched();
		this.itemForm.controls["approverId"].markAsTouched();
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


	listNhanVien: any[] = [];
	LoadNhanVien() {
		const queryParams = new QueryParamsModel(
			this.filterConfiguration(),
		);
		this.danhMucChungService.Get_DSNhanVien_All(queryParams).subscribe(res => {
			if (res && res.status == 1) {
				this.listNhanVien = res.data;
				this.setUpDropSearchNhanVien();
			} else {
				this.listNhanVien = [];
			}
			this.changeDetectorRefs.detectChanges();
		});
	}

	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}

	setUpDropSearchNhanVien() {
		this.bankFilterCtrl.setValue('');
		this.filterBanks();
		this.bankFilterCtrl.valueChanges
			.pipe()
			.subscribe(() => {
				this.filterBanks();
			});
	}

	protected filterBanks() {
		if (!this.listNhanVien) {
			return;
		}
		// get the search keyword
		let search = this.bankFilterCtrl.value;
		if (!search) {
			this.filteredBanks.next(this.listNhanVien.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		// filter the banks
		this.filteredBanks.next(
			this.listNhanVien.filter(bank => bank.HoTen.toLowerCase().indexOf(search) > -1)
		);
	}
	//===================================================
	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
			this.onSumbit();
		}
	}

	onSumbit() {
		const controls = this.itemForm.controls;
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		let _prod: ChangeApproverData = new ChangeApproverData();
		_prod.id = '' + this.ID;
		_prod.roleId = '' + this.RoleID;
		_prod.note = controls["note"].value;
		_prod.approverId = controls["approverId"].value;
		_prod.formId = this.data._formId;
		if (this.TypeID == "1") {
			this.ChuyenPhep(_prod);
		}
		if (this.TypeID == "12") {
			this.ChuyenTangCa(_prod);
		}
		if (this.TypeID == "13") {
			this.ChuyenThoiViec(_prod);
		}
		if (this.TypeID == "18") {
			this.ChuyenDoiCa(_prod);
		}
		if (this.TypeID == "19") {
			this.ChuyenGiaiTrinh(_prod);
		}

	}

	ChuyenPhep(val: ChangeApproverData) {
		this.disabledBtn = true;
		this.quanLyDuyetService.ChuyenPhep(val).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status == 1) {
				this.donTuServices.data_IsLoad$.next('Load');
				this.dialogRef.close({
					val
				});
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	ChuyenTangCa(val: ChangeApproverData) {
		this.disabledBtn = true;
		this.quanLyDuyetService.ChuyenTangCa(val).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status == 1) {
				this.donTuServices.data_IsLoad$.next('Load');
				this.dialogRef.close({
					val
				});
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	ChuyenThoiViec(val: ChangeApproverData) {
		this.disabledBtn = true;
		this.quanLyDuyetService.ChuyenThoiViec(val).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status == 1) {
				this.donTuServices.data_IsLoad$.next('Load');
				this.dialogRef.close({
					val
				});
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	ChuyenDoiCa(val: ChangeApproverData) {
		this.disabledBtn = true;
		this.quanLyDuyetService.ChuyenDoiCa(val).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status == 1) {
				this.donTuServices.data_IsLoad$.next('Load');
				this.dialogRef.close({
					val
				});
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	ChuyenGiaiTrinh(val: ChangeApproverData) {
		this.disabledBtn = true;
		this.quanLyDuyetService.ChuyenGiaiTrinh(val).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status == 1) {
				this.donTuServices.data_IsLoad$.next('Load');
				this.dialogRef.close({
					val
				});
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	goBack() {
		this.dialogRef.close();
	}
}
