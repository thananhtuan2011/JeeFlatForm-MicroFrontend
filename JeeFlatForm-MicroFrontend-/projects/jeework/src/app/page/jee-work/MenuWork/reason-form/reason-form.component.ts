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
import { DanhMucChungService } from '../../services/danhmuc.service';
import { LayoutUtilsService, MessageType } from 'projects/jeework/src/modules/crud/utils/layout-utils.service';


@Component({
	selector: 'm-reason-form',
	templateUrl: './reason-form.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ReasonFormComponent implements OnInit {
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
		public dialogRef: MatDialogRef<ReasonFormComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog,
		public datepipe: DatePipe,
		private itemFB: FormBuilder,
		private changeDetectorRefs: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		public DanhMucChungService: DanhMucChungService,
	) { }

	/** LOAD DATA */
	ngOnInit() {
		this.ID = this.data._id;
		this.createForm();
	}
	//---------------------------------------------------------



	createForm() {
		this.itemForm = this.itemFB.group({
			note: ['', Validators.required],
		});
		this.itemForm.controls["note"].markAsTouched();
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


	filterConfiguration(): any {
		const filter: any = {};
		return filter;
	}
	//===================================================
	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
			this.onSubmit();
		}
	}

	onSubmit() {
		const controls = this.itemForm.controls;
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}
		let item = {
			id_row: this.ID,
			DeletedReason: controls["note"].value
		}
		this.DeleteNhiemVu(item);
	}

	DeleteNhiemVu(val: any) {
		this.disabledBtn = true;
		this.DanhMucChungService.DeleteTask(val).subscribe((res) => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.dialogRef.close({
					val
				});
			} else {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Read,
					9999999999,
					true,
					false,
					3000,
					'top',
					0
				);
			}
			this.changeDetectorRefs.detectChanges();
		});
	}

	goBack() {
		this.dialogRef.close();
	}
}
