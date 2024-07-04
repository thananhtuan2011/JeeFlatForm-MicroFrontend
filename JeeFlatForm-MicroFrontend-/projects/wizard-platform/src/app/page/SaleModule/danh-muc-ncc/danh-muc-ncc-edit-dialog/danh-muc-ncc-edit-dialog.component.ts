import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, from, of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DM_NCCModel } from '../Model/danh-muc-ncc.model';
import { DanhMucNCCService } from '../Services/danh-muc-ncc.service';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { DungChungService } from '../../dungchung.service';
@Component({
    selector: 'app-danh-muc-ncc-edit-dialog',
    templateUrl: './danh-muc-ncc-edit-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DanhMucNCCEditDialogComponent implements OnInit {
    item: DM_NCCModel;
    oldItem: DM_NCCModel;
    selectedTab: number = 0;
    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    itemForm: FormGroup;
    viewLoading: boolean = false;
    hasFormErrors: boolean = false;
    disabledBtn: boolean = false;
    @ViewChild("focusInput", {static: true}) focusInput: ElementRef;

    listIdTinhThanh: any[] = [];
	FilterTH: string = '';
	filteredTinhThanh: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	listIdQuanHuyen: any[] = [];
	FilterQH: string = '';
	filteredQuanHuyen: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	listIdPhuongXa: any[] = [];
	FilterPX: string = '';
	filteredPhuongXa: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

    constructor(public dialogRef: MatDialogRef<DanhMucNCCEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _DanhMucNCCService: DanhMucNCCService,
        private dungchungService: DungChungService,
        private itemFB: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private changeDetectorRefs: ChangeDetectorRef,
        private translate: TranslateService) { }


    ngOnInit() {
        this.reset();
        this.item = this.data._item;
        this.ListIdTinhThanh();
        if (this.item.IDNhaCungCap > 0) {
            this.viewLoading = true;
            this._DanhMucNCCService.getDM_NCCById(this.item.IDNhaCungCap).subscribe(async res => {
				this.viewLoading = false;
				if (res.status == 1 && res.data) {
					this.item = res.data;
					if (this.item.IDTinhThanh > 0)
						await this.ListIdQuanHuyen(this.item.IDTinhThanh);
					if (this.item.IDQuanHuyen > 0)
						await this.ListIdPhuongXa(this.item.IDQuanHuyen);	
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
			maKNN: [this.item.MaNhaCungCap == null ? '' : this.item.MaNhaCungCap],
			tenKNN: [this.item.TenNhaCungCap == null ? '' : this.item.TenNhaCungCap, Validators.required],
			diaChi: [this.item.DiaChi == null ? '' : this.item.DiaChi],
			email: [this.item.Email == null ? '' : this.item.Email, Validators.email],
			dienThoai: [this.item.DienThoai == null ? '' : this.item.DienThoai
				, [Validators.maxLength(11), Validators.minLength(10), Validators.pattern(/^-?([0-9]\d*)?$/)]],
			ghiChu: [this.item.GhiChu == null ? '' : this.item.GhiChu],
			idQuanHuyen: [this.item.IDQuanHuyen == null ? '0' : this.item.IDQuanHuyen.toString()],
			idTinhThanh: [this.item.IDTinhThanh == null ? '0' : this.item.IDTinhThanh.toString()],
			idPhuongXa: [this.item.IDPhuongXa == null ? '0' : this.item.IDPhuongXa.toString()],
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

    ListIdTinhThanh() {
		this.dungchungService.getListProvince().subscribe(res => {
			if (res && res.status === 1) {
				this.listIdTinhThanh = res.data;
				this.filteredTinhThanh.next(this.listIdTinhThanh);
				this.changeDetectorRefs.detectChanges();
			};
		})
	}
	filterTH() {
		if (!this.listIdTinhThanh) {
			return;
		}
		let search = this.FilterTH;
		if (!search) {
			this.filteredTinhThanh.next(this.listIdTinhThanh.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filteredTinhThanh.next(
			this.listIdTinhThanh.filter(ts =>
				ts.TenTinhThanh.toLowerCase().indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();
	}

	async ListIdQuanHuyen(id = 0) {
		this.listIdQuanHuyen = [];
		let res = await this.dungchungService.getListDistrict(+id).toPromise()
		if (res && res.status === 1) {
			this.listIdQuanHuyen = res.data;
		}
		this.filteredQuanHuyen.next(this.listIdQuanHuyen);
		this.changeDetectorRefs.detectChanges();
	}
	filterQH() {
		if (!this.listIdQuanHuyen) {
			return;
		}
		let search = this.FilterQH;
		if (!search) {
			this.filteredQuanHuyen.next(this.listIdQuanHuyen.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filteredQuanHuyen.next(
			this.listIdQuanHuyen.filter(ts =>
				ts.TenQuanHuyen.toLowerCase().indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();
	}

	async ListIdPhuongXa(id = 0) {
		this.listIdPhuongXa = [];
		let res = await this.dungchungService.getListWard(+id).toPromise()
		if (res && res.status === 1) {
			this.listIdPhuongXa = res.data;
		}
		this.filteredPhuongXa.next(this.listIdPhuongXa);
		this.changeDetectorRefs.detectChanges();
	}
	filterPX() {
		if (!this.listIdPhuongXa) {
			return;
		}
		let search = this.FilterPX;
		if (!search) {
			this.filteredPhuongXa.next(this.listIdPhuongXa.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filteredPhuongXa.next(
			this.listIdPhuongXa.filter(ts =>
				ts.TenPhuongXa.toLowerCase().indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();
	}


    prepareCustomer(): DM_NCCModel {
        const controls = this.itemForm.controls;
		const _DM_NCC = new DM_NCCModel();
		_DM_NCC.clear();
		_DM_NCC.MaNhaCungCap = controls['maKNN'].value;
		_DM_NCC.TenNhaCungCap = controls['tenKNN'].value;
		_DM_NCC.DiaChi = controls['diaChi'].value;
		_DM_NCC.Email = controls['email'].value;
		_DM_NCC.DienThoai = controls['dienThoai'].value;
		_DM_NCC.GhiChu = controls['ghiChu'].value;
		_DM_NCC.IDTinhThanh = controls['idTinhThanh'].value;
		_DM_NCC.IDQuanHuyen = controls['idQuanHuyen'].value;
		_DM_NCC.IDPhuongXa = controls['idPhuongXa'].value;

		//gán lại giá trị id
		if (this.item.IDNhaCungCap > 0) {
			_DM_NCC.IDNhaCungCap = this.item.IDNhaCungCap;
		}
		return _DM_NCC;
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
        if (EditChucVu.IDNhaCungCap > 0) {
            this.Update(EditChucVu, withBack);
        } else {
            this.Create(EditChucVu, withBack);
        }
    }

    Update(_item: DM_NCCModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucNCCService.Update(_item).subscribe(res => {
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

    Create(_item: DM_NCCModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucNCCService.Update(_item).subscribe(res => {
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
		if (!this.item || !this.item.IDNhaCungCap) {
			return result;
		}
		result = this.translate.instant('JeeHR.capnhat');
		return result;
	}
}
