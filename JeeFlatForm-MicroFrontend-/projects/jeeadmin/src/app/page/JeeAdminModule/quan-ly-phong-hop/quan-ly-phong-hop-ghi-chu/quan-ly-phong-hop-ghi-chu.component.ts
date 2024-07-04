import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { DatPhongService } from '../../Services/dat-phong.service';

@Component({
	selector: 'm-quan-ly-phong-hop-ghi-chu',
	templateUrl: './quan-ly-phong-hop-ghi-chu.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class QuanLyPhongHopGhiChuComponent implements OnInit {
	//Form
	itemForm: FormGroup;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loadingControl = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	hasFormErrors: boolean = false;
	item: any;
	oldItem: any;
	RowID: string = '';
	viewLoading: boolean = false;

	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13) { //phím Enter
			this.onSumbit();
		}
	}

	constructor(private QuanLyPhongHopService: DatPhongService,
		public dialogRef: MatDialogRef<QuanLyPhongHopGhiChuComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog,
		public datepipe: DatePipe,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private itemFB: FormBuilder) { }

	/** LOAD DATA */
	ngOnInit() {
		this.item = this.data._item;
		this.RowID = this.item.id;
		this.createForm();
	}

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

	onSumbit() {
		this.hasFormErrors = false;
		const controls = this.itemForm.controls;
		/** check form */
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		let updatedonvi = this.Prepareleave();
		this.AddItem(updatedonvi);
	}

	Prepareleave(): any {
		const controls = this.itemForm.controls;
		let item = {
			RowID: this.RowID,
			Status: 2,
			LyDo: controls['ghichu'].value,
		};
		return item;
	}

	AddItem(item: any) {
		this.viewLoading = true;
		this.QuanLyPhongHopService.Confirm_DatPhongHop(item).subscribe(res => {
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.dialogRef.close({
					item
				});
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	goBack() {
		this.dialogRef.close();
	}
}
