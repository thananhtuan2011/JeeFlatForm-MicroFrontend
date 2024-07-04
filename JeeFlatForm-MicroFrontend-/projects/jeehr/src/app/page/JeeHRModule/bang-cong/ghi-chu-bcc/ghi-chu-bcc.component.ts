import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, from, of, BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BangCongModel } from '../Model/bang-cong.model';
import { BangCongService } from '../Services/bang-cong.service';
import { LayoutUtilsService, MessageType } from 'projects/jeehr/src/modules/crud/utils/layout-utils.service';
@Component({
    selector: 'm-ghi-chu-bcc',
    templateUrl: './ghi-chu-bcc.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GhiChuBCCComponent implements OnInit {
    item: BangCongModel;
    oldItem: BangCongModel;
    selectedTab: number = 0;
    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    itemForm: FormGroup;
    viewLoading: boolean = false;
    hasFormErrors: boolean = false;
    loadingAfterSubmit: boolean = false;
    tieude: string;
    IsNew: string;
    listInterview: any[] = [];
    TinhTrang: string = '';
    showLyDo: boolean = false;
    thang: string = '';
    nam: string = '';
    //======================
    disabledBtn: boolean = false;
    constructor(public dialogRef: MatDialogRef<GhiChuBCCComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _BangCongService: BangCongService,
        private itemFB: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private changeDetectorRefs: ChangeDetectorRef,
        private translate: TranslateService) { }


    ngOnInit() {
        this.reset();
        this.item = this.data._item;
        if (this.data._item.ID > 0) {
            this.thang = this.data._item.Thang;
            this.nam = this.data._item.Nam;
        }
        else {
            this.thang = this.data._item.thang;
            this.nam = this.data._item.nam;
        }
        this.createForm();
        this.itemForm.controls["GhiChu"].setValue(this.item.Noidung);
        setTimeout(function () { document.getElementById('id').focus(); }, 100);
    }

    createForm() {
        this.itemForm = this.itemFB.group({
            GhiChu: [this.item.Comment, [Validators.required]],
        });
        this.itemForm.controls["GhiChu"].markAsTouched();
    }

    reset() {
        this.item = Object.assign({}, this.oldItem);
        this.createForm();
        this.hasFormErrors = false;
        this.itemForm.markAsPristine();
        this.itemForm.markAsUntouched();
        this.itemForm.updateValueAndValidity();
    }
    onSumbit(withBack: boolean = false) {
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
        let updatenote = this.Prepare();
        this.CapNhatGhiChu(updatenote, withBack);
    }

    Prepare(): BangCongModel {
        const wh = new BangCongModel();
        const controls = this.itemForm.controls;
        wh.ID = this.data._item.ID_Nv;
        wh.thang = this.thang;
        wh.nam = this.nam;
        wh.ID = this.data._item.ID;
        wh.Comment = controls['GhiChu'].value;
        // wh.StatusID = this.item.StatusID;
        return wh;
    }
    CapNhatGhiChu(item: BangCongModel, withBack: boolean) {
        this.loadingAfterSubmit = true;
        this.viewLoading = true;
        this.disabledBtn = true;
        this._BangCongService.SendComment(item).subscribe(res => {
            this.disabledBtn = false;
            this.changeDetectorRefs.detectChanges();
            if (res && res.status === 1) {
                this.dialogRef.close({
                    item
                });
            }
            else {
                this.viewLoading = false;
                this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 99999999999, true, false, 3000, 'top', 0);
            }
        });
    }
    goBack() {
        this.dialogRef.close();
    }
    //=============================================================================

    getComponentTitle() {
        let result = '';
        result = 'Ghi chú bảng chấm công tháng ' + this.thang + '/' + this.nam;
        return result;
    }
    text(e: any) {

        if (!((e.keyCode > 95 && e.keyCode < 106)
            || (e.keyCode > 46 && e.keyCode < 58)
            || e.keyCode == 8 || e.keyCode == 45)) {
            e.preventDefault();
        }
    }
}
