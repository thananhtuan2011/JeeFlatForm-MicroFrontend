import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { tap } from 'rxjs/operators';
import { fromEvent, merge, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DangKyCuocHopService } from '../../_services/dang-ky-cuoc-hop.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/jeemeeting/src/modules/crud/utils/layout-utils.service';


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
	selectedTab: number = 0;
	luu: boolean = true;
	capnhat: boolean = false;
	RowID: string = '';
	loadingAfterSubmit: boolean = false;
	// Selection
	viewLoading: boolean = false;




	constructor(private dangKyCuocHopService: DangKyCuocHopService,
		public dialogRef: MatDialogRef<QuanLyPhongHopGhiChuComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialog: MatDialog,
		public datepipe: DatePipe,
		private itemFB: FormBuilder,
		private changeDetectorRefs : ChangeDetectorRef,
		private layoutUtilsService : LayoutUtilsService
	) { }

	/** LOAD DATA */
	ngOnInit() {
		this.item = this.data._item;
		this.RowID = this.item.id;
		this.createForm();
	}

	//---------------------------------------------------------



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


	f_number(value: any) {
		return Number((value + '').replace(/,/g, ""));
	}

	f_currency(value: any, args?: any): any {
		let nbr = Number((value + '').replace(/,|-/g, ""));
		return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
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
			this.selectedTab = 0;
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
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.dangKyCuocHopService.Confirm_DatPhongHop(item).subscribe(res => {
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.dialogRef.close({
					item
				});
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	//===================================================
	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
			this.onSumbit();
		}
	}

	goBack() {
		this.dialogRef.close();
	}
}
