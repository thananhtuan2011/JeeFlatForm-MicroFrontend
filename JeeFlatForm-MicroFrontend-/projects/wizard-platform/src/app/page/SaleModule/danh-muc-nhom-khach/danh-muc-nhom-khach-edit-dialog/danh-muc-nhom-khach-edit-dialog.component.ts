import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, from, of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DM_Loai_KHModel } from '../Model/danh-muc-nhom-khach.model';
import { DanhMucNhomKhachService } from '../Services/danh-muc-nhom-khach.service';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
@Component({
    selector: 'app-danh-muc-nhom-khach-edit-dialog',
    templateUrl: './danh-muc-nhom-khach-edit-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DanhMucNhomKhachEditDialogComponent implements OnInit {
    item: DM_Loai_KHModel;
    oldItem: DM_Loai_KHModel;
    selectedTab: number = 0;
    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    itemForm: FormGroup;
    viewLoading: boolean = false;
    hasFormErrors: boolean = false;
    disabledBtn: boolean = false;
    @ViewChild("focusInput", {static: true}) focusInput: ElementRef;

    constructor(public dialogRef: MatDialogRef<DanhMucNhomKhachEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _DanhMucNhomKhachService: DanhMucNhomKhachService,
        private itemFB: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private changeDetectorRefs: ChangeDetectorRef,
        private translate: TranslateService) { }


    ngOnInit() {
        this.reset();
        this.item = this.data._item;
        if (this.item.IDNhomKH > 0) {
            this.viewLoading = true;
            this._DanhMucNhomKhachService.getDM_Loai_KHById(this.item.IDNhomKH).subscribe(res => {
				this.viewLoading = false;
				if (res.status == 1 && res.data) {
					this.item = res.data;
					this.createForm();
                    this.changeDetectorRefs.detectChanges();
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
				}
			});
        }
        else {
            this.viewLoading = false;
        }
        this.createForm();
        this.focusInput.nativeElement.focus();
    }

    createForm() {
        this.itemForm = this.itemFB.group({
			maNhom: [this.item.MaNhomKH == null ? '' : this.item.MaNhomKH],
			tenNhom: [this.item.TenNhomKH == null ? '' : this.item.TenNhomKH, Validators.required],
			ghiChu: [this.item.GhiChu == null ? '': this.item.GhiChu]
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


    prepareCustomer(): DM_Loai_KHModel {
        const controls = this.itemForm.controls;
		const _DM_Loai_KH = new DM_Loai_KHModel();
		_DM_Loai_KH.clear();
		_DM_Loai_KH.MaNhomKH = controls['maNhom'].value;
		_DM_Loai_KH.TenNhomKH = controls['tenNhom'].value;
		_DM_Loai_KH.GhiChu = controls['ghiChu'].value;
		//gán lại giá trị id
		if (this.item.IDNhomKH > 0) {
			_DM_Loai_KH.IDNhomKH = this.item.IDNhomKH;
		}
		return _DM_Loai_KH;
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
        if (EditChucVu.IDNhomKH > 0) {
            this.Update(EditChucVu, withBack);
        } else {
            this.Create(EditChucVu, withBack);
        }
    }

    Update(_item: DM_Loai_KHModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucNhomKhachService.Update(_item).subscribe(res => {
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

    Create(_item: DM_Loai_KHModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucNhomKhachService.Update(_item).subscribe(res => {
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
		if (!this.item || !this.item.IDNhomKH) {
			return result;
		}
		result = this.translate.instant('JeeHR.capnhat');
		return result;
	}
}
