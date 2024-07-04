import { Component, OnInit, Inject, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { XepCaLamViecService } from "../Services/xep-ca-lam-viec.service";
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';
import { LayoutUtilsService, MessageType } from 'projects/jeehr/src/modules/crud/utils/layout-utils.service';

export class CustomDateAdapter2 extends NativeDateAdapter {
	format(date: Date, displayFormat: Object): string {
		var formatString = 'DD/MM/YYYY';
		return moment(date).format(formatString);
	}
}

@Component({
	selector: 'm-download-camera',
	templateUrl: './download-camera-hanet.component.html',
	providers: [
		{
			provide: DateAdapter, useClass: CustomDateAdapter2
		}
	]
})
export class DownloadCameraHanetComponent implements OnInit {
	isLoading: boolean = false;
	itemForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	
	constructor(public dialogRef: MatDialogRef<DownloadCameraHanetComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog,
		private _XepCaLamViecService: XepCaLamViecService,
		public datePipe: DatePipe,
		private translate: TranslateService,
		public layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
		private fb: FormBuilder) { }

	/** LOAD DATA */
	ngOnInit() {
		this.createForm();
		this.loadDiaDiem();
	}

	lstDiaDiem: any[] = [];
	loadDiaDiem() {
		this._XepCaLamViecService.getDSDiaDiemChamCong().subscribe(res => {
			if (res && res.status === 1) {
				this.lstDiaDiem = res.data;
				this.changeDetectorRefs.detectChanges();
			};
		})
	}

	createForm() {
		let item: any = {
			DiaDiem: ['', Validators.required],
			Ngay: [moment().format('YYYY-MM-DD'), Validators.required]
		}
		this.itemForm = this.fb.group(item);
		this.itemForm.markAllAsTouched();
	}

	getHeight(): any {
		let tmp_height = 0;
		tmp_height = window.innerHeight - 340;
		return tmp_height + 'px';
	}

	onSubmit() {
		const controls = this.itemForm.controls;
		if (controls['DiaDiem'].value == '') {
			let message = "Vui lòng chọn địa điểm chấm công";
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
		}

		let placeID = controls['DiaDiem'].value;
		let ngay = moment(controls['Ngay'].value).format('yyyy-MM-DD') + 'T00:00:00.0000000';
		let customerId = localStorage.getItem('customerID');
		let userName = localStorage.getItem('userName');

		this.layoutUtilsService.showWaitingDiv();
		this._XepCaLamViecService.DownloadCameraHanet(placeID, customerId, userName, ngay).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			if (res && res.status === 1) {
				this.layoutUtilsService.showActionNotification(res.message, MessageType.Create, 4000, true, false);
				this.changeDetectorRefs.detectChanges();
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);

			};
		})
	}


	goBack() {
		this.dialogRef.close();
	}


	f_date(value: any, args?: any): any {
		let latest_date = this.datePipe.transform(value, 'dd/MM/yyyy');
		return latest_date;
	}
}
