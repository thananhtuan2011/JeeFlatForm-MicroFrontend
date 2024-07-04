import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, from, of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DM_KhoModel } from '../Model/danh-muc-kho.model';
import { DanhMucKhoService } from '../Services/danh-muc-kho.service';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { DungChungService } from '../../dungchung.service';
@Component({
    selector: 'app-danh-muc-kho-edit-dialog',
    templateUrl: './danh-muc-kho-edit-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DanhMucKhoEditDialogComponent implements OnInit {
    item: DM_KhoModel;
    oldItem: DM_KhoModel;
    selectedTab: number = 0;
    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    itemForm: FormGroup;
    viewLoading: boolean = false;
    hasFormErrors: boolean = false;
    disabledBtn: boolean = false;
    @ViewChild("focusInput", {static: true}) focusInput: ElementRef;

	listIdCN: any[] = [];
	filteredIdCNs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    constructor(public dialogRef: MatDialogRef<DanhMucKhoEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _DanhMucKhoService: DanhMucKhoService,
        private dungchungService: DungChungService,
        private itemFB: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private changeDetectorRefs: ChangeDetectorRef,
        private translate: TranslateService) { }


    ngOnInit() {
        this.reset();
        this.item = this.data._item;
        this.ListIdCN();
        if (this.item.IDKho > 0) {
            this.viewLoading = true;
            this._DanhMucKhoService.getDM_KhoById(this.item.IDKho).subscribe(res => {
				this.viewLoading = false;
				if (res.status == 1 && res.data) {
					this.item = res.data;
					this.createForm();
                    this.changeDetectorRefs.detectChanges();
				}
				else {
					this.layoutUtilsService.showActionNotification(res.error.msg, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
				}
				this.changeDetectorRefs.detectChanges();
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
			maK: [this.item.MaKho == null ? '' : this.item.MaKho, Validators.required],
			tenK: [this.item.TenKho == null ? '' : this.item.TenKho, Validators.required],
			idCN: [this.item.IDChiNhanh == null ? '' : this.item.IDChiNhanh.toString(), Validators.required],
			diaChi: [this.item.DiaChi == null ? '' : this.item.DiaChi],
			dienThoai: [this.item.DienThoai == null ? '' : this.item.DienThoai, [Validators.maxLength(11), Validators.minLength(10), 
				Validators.pattern(/^(([0-9][0-9]{0,2},([0-9]{3},)*)[0-9]{3}(\.[0-9]{1,})?|([0-9]([0-9]+)?)(\.[0-9]{1,})?|[0](\.([1-9][0-9]?|[0][1-9])))$/)]],
			ghiChu: [this.item.GhiChu == null ? '' : this.item.GhiChu],
			trangThai: [this.item.TrangThai == null ? '0' : this.item.TrangThai.toString()],
			isTon: [this.item.IsXetTon == null ? true : this.item.IsXetTon]
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

	FilterCtrl: string = '';
	async ListIdCN() { //chọn chi nhánh
		let res = await this.dungchungService.getListAgency(false).toPromise();
		if (res) {
			this.loadingSubject.next(false);
			if (res && res.status === 1 && res.data != null) {
				this.listIdCN = res.data;
				this.filteredIdCNs.next(this.listIdCN);
				this.changeDetectorRefs.detectChanges();
			};
		};
	}
	filterCN() {
		if (!this.listIdCN) {
			return;
		}
		let search = this.FilterCtrl;
		if (!search) {
			this.filteredIdCNs.next(this.listIdCN.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filteredIdCNs.next(
			this.listIdCN.filter(ts =>
				ts.TenChiNhanh.toLowerCase().indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();
	}

    prepareCustomer(): DM_KhoModel {
        const controls = this.itemForm.controls;
		const _DM_Kho = new DM_KhoModel();
		_DM_Kho.clear();
		_DM_Kho.MaKho = controls['maK'].value;
		_DM_Kho.TenKho = controls['tenK'].value;
		_DM_Kho.IDChiNhanh = controls['idCN'].value;
		_DM_Kho.DiaChi = controls['diaChi'].value;
		_DM_Kho.DienThoai = controls['dienThoai'].value;
		_DM_Kho.GhiChu = controls['ghiChu'].value;
		_DM_Kho.TrangThai = controls['trangThai'].value;
		_DM_Kho.IsXetTon = controls['isTon'].value;

		//gán lại giá trị id
		if (this.item.IDKho > 0) {
			_DM_Kho.IDKho = this.item.IDKho;
		}
		return _DM_Kho;
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
        if (EditChucVu.IDKho > 0) {
            this.Update(EditChucVu, withBack);
        } else {
            this.Create(EditChucVu, withBack);
        }
    }

    Update(_item: DM_KhoModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucKhoService.Update(_item).subscribe(res => {
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

    Create(_item: DM_KhoModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucKhoService.Update(_item).subscribe(res => {
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
		if (!this.item || !this.item.IDKho) {
			return result;
		}
		result = this.translate.instant('JeeHR.capnhat');
		return result;
	}
}
