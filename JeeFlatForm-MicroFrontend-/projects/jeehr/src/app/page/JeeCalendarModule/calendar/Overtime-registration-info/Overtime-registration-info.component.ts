import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Material
// RXJS
import { fromEvent, merge, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OvertimeRegistrationService } from '../services/Overtime-registration.service';
import { DanhMucChungService } from '../../../services/danhmuc.service';
@Component({
	selector: 'm-Overtime-registration-info',
	templateUrl: './Overtime-registration-info.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class OvertimeRegistrationInfoComponent implements OnInit {
	// Table fields
	// Filter fields
	//Form
	itemForm: FormGroup;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loadingControl = new BehaviorSubject<boolean>(false);
	loading1$ = this.loadingSubject.asObservable();
	hasFormErrors: boolean = false;
	selectedTab: number = 0;
	hoten: string = '';
	// Selection
	ID_NV: string = '';

	//===============Khai báo value chi tiêt==================
	item: any;
	oldItem: any;
	listData_CapDuyet: any[] = [];
	listData_ApprovingUser: any[] = [];
	tennguoiduyet: string = '';
	vitriduyet: string = '';
	thongbao: string = '';
	showduyet: boolean = false;
	ID: number = 0;
	loai: string = '';
	songay: string = '';
	enableBT: boolean = false;
	disabledBtn: boolean = false;
	ShowHinhThuc: boolean = false;
	GhiChu: string = '';
	//====================================================
	listCachTinhTangCa: any[] = [];
	constructor(
		public dialogRef: MatDialogRef<OvertimeRegistrationInfoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private overtimeRegistrationService: OvertimeRegistrationService,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private itemFB: FormBuilder,
		private changeDetectorRefs: ChangeDetectorRef,
		private translate: TranslateService,
		public datePipe: DatePipe,
		private danhMucChungService: DanhMucChungService,) { }

	/** LOAD DATA */
	ngOnInit() {
		this.loadingSubject.next(true);
		this.reset();
		this.ID = this.data._item.RowID;
		this.overtimeRegistrationService.Get_ChiTietDuyetTangCa(this.ID).subscribe(res => {
			this.item = res;

			if (this.item.HinhThucChiTra == "") {
				this.item.HinhThucChiTra = "1";
			}
			this.oldItem = Object.assign({}, res);
			if (res.IsFinal) {
				this.ShowHinhThuc = true;
				this.itemForm.controls["hinhthuc"].setValue('1');
				this.changeDetectorRefs.detectChanges();
			}
			else {
				this.ShowHinhThuc = false;
			}
			this.listData_CapDuyet = this.item.Data_CapDuyet;
			this.listData_ApprovingUser = this.item.Data_ApprovingUser;
			this.initProduct();
			this.changeDetectorRefs.detectChanges();
		});

		this.createForm();

		this.danhMucChungService.GetListCachTinhTangCa().subscribe(res => {
			this.listCachTinhTangCa = res.data;
			this.changeDetectorRefs.detectChanges();
		})
	}

	/** ACTIONS */
	getFirstDay_LastDay(b_firstday) {
		var date = new Date(), y = date.getFullYear(), m = date.getMonth();
		var firstDay = new Date(y, m, 1); // ngày đầu tháng
		var lastDay = new Date(y, m + 1, 0); // ngày cuối tháng
		var curent = new Date(); // ngày hiện tại
		return b_firstday ? this.datePipe.transform(firstDay, 'dd/MM/yyyy') : this.datePipe.transform(curent, 'dd/MM/yyyy');
	}
	reset() {
		this.item = Object.assign({}, this.oldItem);
		this.createForm();
		this.hasFormErrors = false;
		this.itemForm.markAsPristine();
		this.itemForm.markAsUntouched();
		this.itemForm.updateValueAndValidity();
	}

	initProduct() {
		this.createForm();
		this.loadingSubject.next(false);
		this.loadingControl.next(true);
	}
	createForm() {
		this.itemForm = this.itemFB.group({
			NgayGui: [this.item.NgayGui],
			NgayTangCa: [this.item.NgayTangCa + ' (' + this.item.ThoiGian + ' - ' + this.translate.instant("duyettangca.SoGio") + ': ' + this.item.SoGio + ')'],
			DuAn: [this.item.DuAn],
			lyDo: [this.item.Lydo],
			ghichu: [this.item.GhiChu],
			hinhthuc: [this.item.HinhThucChiTra, [Validators.required]],
			IsFixHours: [this.item.IsFixHours],
		});
		this.itemForm.controls["hinhthuc"].markAsTouched();
	}
	goBack() {
		this.dialogRef.close();
	}
	//---------------------------------------------------------
	ChoDuyet: string = 'Chờ duyệt';
	f_date(value: any, args?: any): any {
		let latest_date = this.datePipe.transform(value, 'dd/MM/yyyy');
		return latest_date;
	}
	f_duyet(value: any): any {
		let latest_date = ''
		if (value.Valid == true) {
			latest_date = this.translate.instant("duyetdontu.daduyet");
		} else if (value.Valid == false) {
			latest_date = this.translate.instant("duyetdontu.khongduyet");
		} else {
			if (value.Checker != null) {
				latest_date = this.translate.instant("duyetdontu.choduyet");
			}
		}
		return latest_date;
	}
}
