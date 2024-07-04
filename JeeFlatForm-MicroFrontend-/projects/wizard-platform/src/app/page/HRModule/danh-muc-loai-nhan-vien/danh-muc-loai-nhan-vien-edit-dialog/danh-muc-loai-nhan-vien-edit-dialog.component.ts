import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, from, of, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DanhMucLoaiNhanVienService } from '../Services/danh-muc-loai-nhan-vien.service';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { StaffTypeModel } from '../Model/danh-muc-loai-nhan-vien.model';
@Component({
    selector: 'app-danh-muc-loai-nhan-vien-edit-dialog',
    templateUrl: './danh-muc-loai-nhan-vien-edit-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DanhMucLoaiNhanVienEditDialogComponent implements OnInit {
    item: StaffTypeModel;
    oldItem: StaffTypeModel;
    selectedTab: number = 0;
    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    itemForm: FormGroup;
    viewLoading: boolean = false;
    hasFormErrors: boolean = false;
    listchucdanh: any[] = [];
    disabledBtn: boolean = false;
    @ViewChild("focusInput", { static: true }) focusInput: ElementRef;
    listorgstructure: any[] = [];
    constructor(public dialogRef: MatDialogRef<DanhMucLoaiNhanVienEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _DanhMucLoaiNhanVienService: DanhMucLoaiNhanVienService,
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
    }

    createForm() {
        this.itemForm = this.itemFB.group({
            Tenloai: [this.item.Tenloai, Validators.required],
			Code: [this.item.Code, Validators.required],
			IsBHXH: [this.item.IsBHXH],
			IsAnnualLeave: [this.item.IsAnnualLeave],
        });
        this.itemForm.controls["Tenloai"].markAsTouched();
		this.itemForm.controls["Code"].markAsTouched();
    }

    reset() {
        this.item = Object.assign({}, this.oldItem);
        this.createForm();
        this.hasFormErrors = false;
        this.itemForm.markAsPristine();
        this.itemForm.markAsUntouched();
        this.itemForm.updateValueAndValidity();
    }

    prepareCustomer(): StaffTypeModel {
        const controls = this.itemForm.controls;
        const _item = new StaffTypeModel();
        _item.Id_row = this.item.Id_row;
		_item.Tenloai = controls['Tenloai'].value; // lấy tên biến trong formControlName	
		_item.Code = controls['Code'].value; // lấy tên biến trong formControlName
		_item.IsBHXH = controls['IsBHXH'].value; // lấy tên biến trong formControlName
		_item.IsAnnualLeave = controls['IsAnnualLeave'].value; // lấy tên biến trong formControlName
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
            this.Update(EditChucVu, withBack);
        }
    }

    Update(_item: StaffTypeModel, withBack: boolean) {

        this.disabledBtn = true;
        this._DanhMucLoaiNhanVienService.Update(_item).subscribe(res => {
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

    CreateChucVu(_item: StaffTypeModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucLoaiNhanVienService.Create(_item).subscribe(res => {
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
            || (e.keyCode > 45 && e.keyCode < 58)
            || e.keyCode == 8 || e.keyCode == 45)) {
            e.preventDefault();
        }
    }
}
