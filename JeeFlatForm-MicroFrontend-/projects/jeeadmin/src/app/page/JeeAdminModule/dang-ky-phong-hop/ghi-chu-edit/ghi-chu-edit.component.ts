import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { LayoutUtilsService, MessageType } from 'projects/jeeadmin/src/modules/crud/utils/layout-utils.service';
import { DatPhongService } from '../../Services/dat-phong.service';

@Component({
	selector: 'm-ghi-chu-edit',
	templateUrl: './ghi-chu-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class GhiChuPhongHopEditComponent implements OnInit {

	itemForm: FormGroup;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loadingControl = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	hasFormErrors: boolean = false;
	item: any;
	oldItem: any;
	RowID: string = '';
	viewLoading: boolean = false;

	constructor(private DangKyPhongHopService: DatPhongService,
		public dialogRef: MatDialogRef<GhiChuPhongHopEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog,
		public datepipe: DatePipe,
		private layoutUtilsService: LayoutUtilsService,
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

	onSumbit() {
		this.hasFormErrors = false;
		const controls = this.itemForm.controls;

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
			LyDo: controls['ghichu'].value,
		};
		return item;
	}

	AddItem(item: any) {
		this.viewLoading = true;
		this.DangKyPhongHopService.Delete_PhongHop(item).subscribe(res => {
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

	//===================================================
	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13) {//phím Enter
			this.onSumbit();
		}
	}

	goBack() {
		this.dialogRef.close();
	}
}
