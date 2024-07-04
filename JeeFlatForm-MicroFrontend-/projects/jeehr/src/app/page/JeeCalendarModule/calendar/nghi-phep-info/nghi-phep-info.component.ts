import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
// RXJS
import { fromEvent, merge, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService } from 'src/app/modules/crud/utils/layout-utils.service';
import { LeavePersonalService } from '../services/dang-ky-phep-ca-nhan.service';


@Component({
	selector: 'm-nghi-phep-info',
	templateUrl: './nghi-phep-info.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class NghiPhepInfoComponent implements OnInit {
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
	id_row: string = '';
	loai: string = '';
	songay: string = '';
	enableBT: boolean = false;
	disabledBtn: boolean = false;
	//[=======================================================]
	ChoDuyet: string = 'Chờ duyệt';
	constructor(
		public dialogRef: MatDialogRef<NghiPhepInfoComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public leavePersonalService : LeavePersonalService,
		public dialog: MatDialog,
		private itemFB: FormBuilder,
		private changeDetectorRefs: ChangeDetectorRef,
		private translate: TranslateService,
		public datePipe: DatePipe,
	) { }

	/** LOAD DATA */
	ngOnInit() {
		this.reset();
		this.leavePersonalService.Get_ChiTietDuyetPhep(+this.data._item.ID_Row, 1).subscribe(res => {
			
			this.item = res;
			this.listData_CapDuyet = this.item.Data_CapDuyet;
			this.listData_ApprovingUser = this.item.Data_ApprovingUser;
			this.oldItem = Object.assign({}, res);
			this.changeDetectorRefs.detectChanges();
		});
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

			ghiChu: [this.item.GhiChu],

		});
	}

	goBack() {
		this.dialogRef.close();
	}
	//---------------------------------------------------------
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
			if(value.Checker != null){
				latest_date = this.translate.instant("duyetdontu.choduyet");
			}
		}
		return latest_date;
	}

}
