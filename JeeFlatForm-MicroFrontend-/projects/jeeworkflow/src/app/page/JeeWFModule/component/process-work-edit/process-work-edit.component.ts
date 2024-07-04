import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
// RXJS
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'kt-process-work-edit',
	templateUrl: './process-work-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProcessWorkEditComponent implements OnInit {
	itemForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	disabledBtn: boolean = false;
	listProcess: any[] = [];
	ShowDF: boolean = false;
	ProcessID: number;
	ShowType: number; //0:Thêm; 1:Chuyển giai đoạn; 2:Nhân bản nhiệm vụ
	IsNext:boolean;//Biến chuyển giai đoạn trong kanban
	NodeListID :number = 0; //ID giai đoạn chuyển tới

	constructor(public dialogRef: MatDialogRef<ProcessWorkEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private translate: TranslateService,) { }
	/** LOAD DATA */
	ngOnInit() {
		this.ShowType = this.data._type;
		this.ProcessID = +this.data._val;
		if(this.ShowType == 0 || this.ShowType ==1){
			this.IsNext = this.data._IsNext;
			this.NodeListID = this.data._NodeListID;
		}
	}


	/** UI */
	getTitle(): string {
		let result = "";
		if (this.ShowType == 0) {
			result = this.translate.instant('workprocess.taonhiemvu');
		} else if (this.ShowType == 1){
			result = this.translate.instant('workprocess.chuyengiaidoan');
		}else{
			result = this.translate.instant('workprocess.nhanbannhiemvu');
		}
		return result;
	}
	/** ACTIONS */

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

	}

	goBackCreate(WorkID: any) {
		this.dialogRef.close({ WorkID });
	}

	goBack() {
		this.dialogRef.close();
	}

	goBackMove(){
		this.dialogRef.close(1);
	}
}
