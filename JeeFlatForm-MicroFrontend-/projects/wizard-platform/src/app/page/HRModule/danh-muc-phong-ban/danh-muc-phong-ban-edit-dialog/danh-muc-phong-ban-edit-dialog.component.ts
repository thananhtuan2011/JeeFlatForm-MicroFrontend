import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, from, of, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DanhMucPhongBanService } from '../Services/danh-muc-phong-ban.service';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { OrgStructureModel } from '../Model/danh-muc-phong-ban.model';
@Component({
    selector: 'app-danh-muc-phong-ban-edit-dialog',
    templateUrl: './danh-muc-phong-ban-edit-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DanhMucPhongBanEditDialogComponent implements OnInit {
    item: OrgStructureModel;
    oldItem: OrgStructureModel;
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
    constructor(public dialogRef: MatDialogRef<DanhMucPhongBanEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _DanhMucPhongBanService: DanhMucPhongBanService,
        private itemFB: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private changeDetectorRefs: ChangeDetectorRef,
        private translate: TranslateService) { }


    ngOnInit() {
        this.reset();
        this.item = this.data._item;
        if (this.item.RowID > 0) {
            this.viewLoading = true;
        }
        else {
            this.viewLoading = false;
        }
        this.createForm();
        this.focusInput.nativeElement.focus();

        this._DanhMucPhongBanService.GetListDanhMuc_CapCoCau().subscribe(res => {
            this.listorgstructure = res.data;
        });
    }

    createForm() {
        this.itemForm = this.itemFB.group({
            Code: [this.item.Code, Validators.required],
            Title: [this.item.Title, Validators.required],
            Vitri: [this.item.Position, Validators.required],
            CapCoCau: [+this.item.CapCoCau > 0 ? '' + this.item.CapCoCau : ""],
        });
        this.itemForm.controls["Code"].markAsTouched();
        this.itemForm.controls["Title"].markAsTouched();
        this.itemForm.controls["Vitri"].markAsTouched();
    }

    reset() {
        this.item = Object.assign({}, this.oldItem);
        this.createForm();
        this.hasFormErrors = false;
        this.itemForm.markAsPristine();
        this.itemForm.markAsUntouched();
        this.itemForm.updateValueAndValidity();
    }

    prepareCustomer(): OrgStructureModel {
        const controls = this.itemForm.controls;
        const _item = new OrgStructureModel();
        _item.RowID = this.item.RowID;
        _item.ParentID = this.item.ParentID;
        _item.Title = controls['Title'].value;
        _item.Code = controls['Code'].value;
        _item.Position = controls['Vitri'].value;
        _item.Level = controls['CapCoCau'].value != "" ? controls['CapCoCau'].value : "0";
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
        if (+this.itemForm.controls["Vitri"].value <= 0) {
            const message = 'Vị trí phải lớn hơn 0';
            this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
            this.itemForm.controls["Vitri"].setValue("");
            return;
        }
        const EditChucVu = this.prepareCustomer();
        if (EditChucVu.RowID > 0) {
            this.UpdateChucVu(EditChucVu, withBack);
        }
    }

    UpdateChucVu(_item: OrgStructureModel, withBack: boolean) {

        this.disabledBtn = true;
        this._DanhMucPhongBanService.Create(_item).subscribe(res => {
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

    CreateChucVu(_item: OrgStructureModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucPhongBanService.Create(_item).subscribe(res => {
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
