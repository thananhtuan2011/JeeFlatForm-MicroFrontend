import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, from, of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DM_DVTModel } from '../Model/danh-muc-dvt.model';
import { DanhMucDVTService } from '../Services/danh-muc-dvt.service';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
@Component({
    selector: 'app-danh-muc-dvt-edit-dialog',
    templateUrl: './danh-muc-dvt-edit-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DanhMucDVTEditDialogComponent implements OnInit {
    item: DM_DVTModel;
    oldItem: DM_DVTModel;
    selectedTab: number = 0;
    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    itemForm: FormGroup;
    viewLoading: boolean = false;
    hasFormErrors: boolean = false;
    disabledBtn: boolean = false;
    @ViewChild("focusInput", {static: true}) focusInput: ElementRef;

    constructor(public dialogRef: MatDialogRef<DanhMucDVTEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _DanhMucDVTService: DanhMucDVTService,
        private itemFB: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private changeDetectorRefs: ChangeDetectorRef,
        private translate: TranslateService) { }


    ngOnInit() {
        this.reset();
        this.item = this.data._item;
        if (this.item.IDDVT > 0) {
            this.viewLoading = true;
        }
        else {
            this.viewLoading = false;
        }
        this.createForm();
        this.focusInput.nativeElement.focus();
    }

    createForm() {
        this.itemForm = this.itemFB.group({
			tenDVT: [this.item.DonViTinh == null ? '' : this.item.DonViTinh, Validators.required],
			ghiChu: [this.item.GhiChu == null ? '' : this.item.GhiChu],
        });
		this.itemForm.markAllAsTouched();
    }

    reset() {
        this.item = Object.assign({}, this.oldItem);
        this.createForm();
        this.hasFormErrors = false;
        this.itemForm.markAsPristine();
        this.itemForm.markAsUntouched();
        this.itemForm.updateValueAndValidity();
    }

    prepareCustomer(): DM_DVTModel {
        const controls = this.itemForm.controls;
		const _DM_DVT = new DM_DVTModel();
		_DM_DVT.clear();
		_DM_DVT.DonViTinh = controls['tenDVT'].value;
		_DM_DVT.GhiChu = controls['ghiChu'].value;

		//gán lại giá trị id
		if (this.item.IDDVT > 0) {
			_DM_DVT.IDDVT = this.item.IDDVT;
		}
		return _DM_DVT;
    }

    onSubmit(withBack: boolean = false) {
        this.hasFormErrors = false;
        const controls = this.itemForm.controls;
        /* check form */
        if (this.itemForm.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }
        const EditChucVu = this.prepareCustomer();
        if (EditChucVu.IDDVT > 0) {
            this.Update(EditChucVu, withBack);
        } else {
            this.Create(EditChucVu, withBack);
        }
    }

    Update(_item: DM_DVTModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucDVTService.Update(_item).subscribe(res => {
            /* Server loading imitation. Remove this on real code */
            this.disabledBtn = false;
            this.changeDetectorRefs.detectChanges();
            if (res && res.status === 1) {
                this.dialogRef.close({
                    _item
                });
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    Create(_item: DM_DVTModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucDVTService.Update(_item).subscribe(res => {
            this.disabledBtn = false;
            this.changeDetectorRefs.detectChanges();
            if (res && res.status === 1) {
                if (withBack == true) {
                    this.dialogRef.close({
                        _item
                    });
                }
                else {
                    const _messageType = this.translate.instant('JeeHR.themthanhcong');
                    this.layoutUtilsService.showActionNotification(_messageType, MessageType.Update, 4000, true, false).afterDismissed().subscribe(tt => {
                    });
                    this.focusInput.nativeElement.focus();
                    this.ngOnInit();
                }
            }
            else {
                this.viewLoading = false;
                this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    goBack() {
        this.dialogRef.close();
    }

    text(e: any) {
        if (!((e.keyCode > 95 && e.keyCode < 106)
            || (e.keyCode > 46 && e.keyCode < 58)
            || e.keyCode == 8 || e.keyCode == 45)) {
            e.preventDefault();
        }
    }

    getTitle(): string {
		let result = this.translate.instant('JeeHR.themmoi');
		if (!this.item || !this.item.IDDVT) {
			return result;
		}
		result = this.translate.instant('JeeHR.capnhat');
		return result;
	}
}
