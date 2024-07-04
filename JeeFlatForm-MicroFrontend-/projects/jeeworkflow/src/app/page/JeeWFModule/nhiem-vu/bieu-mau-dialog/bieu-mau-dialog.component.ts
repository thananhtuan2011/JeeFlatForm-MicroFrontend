import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent, merge, Observable, of, Subject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TemplateModel } from '../Model/process-work.model';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { ProcessWorkService } from '../../../services/process-work.service';


@Component({
	selector: 'kt-bieu-mau-dialog',
	templateUrl: './bieu-mau-dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class BieuMauDialogComponent implements OnInit {
	item: any;
	oldItem: any
	itemForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	disabledBtn: boolean = false;
	ProcessID: number;
	@ViewChild("focusInput", { static: true }) focusInput: ElementRef;
	//================Check goBack form======================
	isDirty$: Observable<boolean>;
	sub: Subscription;
	store: any;
	isBack: boolean;
	itemFile: any;
	ID_QuyTrinh: number;
	constructor(public dialogRef: MatDialogRef<BieuMauDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private changeDetectorRefs: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		public dialog: MatDialog,
		public _ProcessWorkService: ProcessWorkService) { }

	ngOnInit() {
		this.item = this.data._item;
		this.ID_QuyTrinh = this.data._ID_QuyTrinh;
		if (this.item.RowID > 0) {
			this.viewLoading = true;
			if (this.item.strBase64 != "" && this.item.strBase64 != null) {
				this.itemFile = {
					RowID: "",
					Title: "",
					Description: "",
					Required: false,
					Files: [
						{
							strBase64: this.item.strBase64,
							filename: this.item.TenFile,
							type: this.item.ContentType,
						}
					]
				};
			} else {
				this.itemFile = {
					RowID: "",
					Title: "",
					Description: "",
					Required: false,
					Files: []
				};
			}
			this.createForm();
		}
		else {
			this.viewLoading = false;
			this.itemFile = {
				RowID: "",
				Title: "",
				Description: "",
				Required: false,
				Files: []
			};
			this.createForm();

		}
		this.focusInput.nativeElement.focus();
	}

	/** LOAD DATA */
	createForm() {

		this.itemForm = this.fb.group({
			title: ['' + this.item.Title, Validators.required],
			template: [this.itemFile.Files],
		});
		this.itemForm.controls["title"].markAsTouched();


	}

	/** UI */
	getTitle(): string {
		let result = this.translate.instant('landingpagekey.themmoi');
		if (!this.item || !this.item.RowID) {
			return result;
		}

		result = this.translate.instant('landingpagekey.capnhat');
		return result;
	}
	/** ACTIONS */
	prepareCustomer(): TemplateModel {
		const controls = this.itemForm.controls;
		const _item = new TemplateModel();
		_item.RowID = this.item.RowID;
		_item.ProcessID = this.ID_QuyTrinh;
		_item.Title = controls['title'].value;
		if (controls['template'].value.length > 0) {
			_item.File = controls['template'].value[controls['template'].value.length - 1].strBase64;
			_item.FileName = controls['template'].value[controls['template'].value.length - 1].filename;
			_item.ContentType = controls['template'].value[controls['template'].value.length - 1].type;
		}
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

		let IsFlag = true;
		if (controls['template'].value.length > 0) {
			controls['template'].value.map((item) => {
				if (item.IsAdd) {
					if (item.type != "application/msword" && item.type != "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
						this.layoutUtilsService.showActionNotification("Vui lòng chọn file word", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
						IsFlag = false;
						return;
					}
				}
			})
		}
		if (IsFlag) {
			const updatedegree = this.prepareCustomer();
			if (updatedegree.RowID > 0) {
				this.Update(updatedegree, withBack);
			} else {
				this.Create(updatedegree, withBack);
			}
		}
	}

	Update(_item: TemplateModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.disabledBtn = true;
		this._ProcessWorkService.Update_Template(_item).subscribe(res => {
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
					const _messageType = this.translate.instant('landingpagekey.capnhatthanhcong');
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

	Create(_item: TemplateModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.disabledBtn = true;
		this._ProcessWorkService.Update_Template(_item).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				if (withBack == true) {
					this.dialogRef.close({
						_item
					});
				} else {
					this.ngOnInit();
					const _messageType = this.translate.instant('landingpagekey.themthanhcong');
					this.layoutUtilsService.showActionNotification(_messageType, MessageType.Update, 4000, true, false).afterDismissed().subscribe(tt => {
					});
					this.focusInput.nativeElement.focus();
				}
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	close() {
		if (this.isBack) {
			const _title = this.translate.instant("landingpagekey.xacnhan");
			const _description = this.translate.instant("landingpagekey.bancomuonthoatkhong");
			const dialogRef = this.layoutUtilsService.updateStatusForCustomersNew(_title, _description);
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				} else {
					this.isDirty$ = new Observable(observer => {
						observer.next(false);
					});
					this.dialogRef.close();
				}
			})
		} else {
			this.dialogRef.close();
		}
	}
}
