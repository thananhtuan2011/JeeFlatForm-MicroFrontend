import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, from, of, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChucVuModel } from '../Model/danh-muc-chuc-vu.model';
import { DanhMucChucVuService } from '../Services/danh-muc-chuc-vu.service';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
@Component({
    selector: 'app-danh-muc-chuc-vu-edit-dialog',
    templateUrl: './danh-muc-chuc-vu-edit-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DanhMucChucVuEditDialogComponent implements OnInit {
    item: ChucVuModel;
    oldItem: ChucVuModel;
    selectedTab: number = 0;
    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    itemForm: FormGroup;
    viewLoading: boolean = false;
    hasFormErrors: boolean = false;
    listchucdanh: any[] = [];
    disabledBtn: boolean = false;
    @ViewChild("focusInput", {static: true}) focusInput: ElementRef;

    constructor(public dialogRef: MatDialogRef<DanhMucChucVuEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _DanhMucChucVuService: DanhMucChucVuService,
        private itemFB: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private changeDetectorRefs: ChangeDetectorRef,
        private translate: TranslateService) { }


    ngOnInit() {
        this.reset();
        this.item = this.data._item;
        if (this.item.Id_row > 0) {
            this.viewLoading = true;
        }
        else {
            this.viewLoading = false;
        }
        this.createForm();
        this.focusInput.nativeElement.focus();
        this._DanhMucChucVuService.getAllChucdanh().subscribe(res => {
            this.listchucdanh = res.data;
            this.changeDetectorRefs.detectChanges();
        });
    }

    createForm() {
        this.itemForm = this.itemFB.group({
            Tenchucdanh: [this.item.Tenchucdanh, Validators.required],
            chucdanh: ['' + this.item.Id_CV, Validators.required],
        });
        this.itemForm.controls["Tenchucdanh"].markAsTouched();
        this.itemForm.controls["chucdanh"].markAsTouched();
    }

    reset() {
        this.item = Object.assign({}, this.oldItem);
        this.createForm();
        this.hasFormErrors = false;
        this.itemForm.markAsPristine();
        this.itemForm.markAsUntouched();
        this.itemForm.updateValueAndValidity();
    }

    prepareCustomer(): ChucVuModel {
        const controls = this.itemForm.controls;
        const _item = new ChucVuModel();
        _item.Id_row = this.item.Id_row;
        _item.Tenchucdanh = controls['Tenchucdanh'].value; // lấy tên biến trong formControlName
        _item.Id_CV = controls['chucdanh'].value;
        return _item;
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
        if (EditChucVu.Id_row > 0) {
            this.UpdateChucVu(EditChucVu, withBack);
        } else {
            this.CreateChucVu(EditChucVu, withBack);
        }
    }

    UpdateChucVu(_item: ChucVuModel, withBack: boolean) {

        this.disabledBtn = true;
        this._DanhMucChucVuService.UpdateChucVu(_item).subscribe(res => {
            /* Server loading imitation. Remove this on real code */
            this.disabledBtn = false;
            this.changeDetectorRefs.detectChanges();
            if (res && res.status === 1) {
                this.dialogRef.close({
                    _item
                });
            }
            else {
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
            }
        });
    }

    CreateChucVu(_item: ChucVuModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucChucVuService.CreateChucVu(_item).subscribe(res => {
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
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
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
		if (!this.item || !this.item.Id_row) {
			return result;
		}
		result = this.translate.instant('JeeHR.capnhat') + `- Tên chức vụ: ${this.item.Tenchucdanh}`;
		return result;
	}
}
