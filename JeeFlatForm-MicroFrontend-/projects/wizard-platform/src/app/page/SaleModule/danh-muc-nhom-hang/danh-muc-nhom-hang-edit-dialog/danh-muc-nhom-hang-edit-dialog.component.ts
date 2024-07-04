import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, from, of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DM_LoaiMatHangModel, ListImageModel } from '../Model/danh-muc-nhom-hang.model';
import { DanhMucNhomHangService } from '../Services/danh-muc-nhom-hang.service';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { DungChungService } from '../../dungchung.service';
@Component({
    selector: 'app-danh-muc-nhom-hang-edit-dialog',
    templateUrl: './danh-muc-nhom-hang-edit-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DanhMucNhomHangEditDialogComponent implements OnInit {
    item: DM_LoaiMatHangModel;
    oldItem: DM_LoaiMatHangModel;
    selectedTab: number = 0;
    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    itemForm: FormGroup;
    viewLoading: boolean = false;
    hasFormErrors: boolean = false;
    disabledBtn: boolean = false;
    @ViewChild("focusInput", {static: true}) focusInput: ElementRef;

	listIdLMHParent: any[] = [];
	filteredIdLMHParents: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	selectIdLMHParent: string = '0';
	btnClear: boolean = true

	imagedata: any;
	imgvl: any[] = [];
	API_ROOT_URL = ""// environment.HOST_CDNSERVER_API
	isLoai: string = "2"; //1: loại hàng, 2: danh mục hàng

    constructor(public dialogRef: MatDialogRef<DanhMucNhomHangEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _DanhMucNhomHangService: DanhMucNhomHangService,
        private dungchungService: DungChungService,
        private itemFB: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private changeDetectorRefs: ChangeDetectorRef,
        private translate: TranslateService) { }


    async ngOnInit() {
        this.reset();
        this.item = this.data._item;
		this.isLoai = this.data.isLoai;
		this.changeLoai()
        this.imagedata = {
			RowID: "",
			Title: "",
			Description: "",
			Required: false,
			Files: []
		}
        await this.ListIdLMHParent();
        if (this.item.IDLoaiMatHang > 0) {
            this.viewLoading = true;
            this._DanhMucNhomHangService.getDM_LoaiMatHangById(this.item.IDLoaiMatHang).subscribe(res => {
				this.viewLoading = false;
				if (res.status == 1 && res.data) {
					this.item = res.data;
					this.imagedata = {
						RowID: "",
						Title: "",
						Description: "",
						Required: false,
						Files: []
					}
					if (this.item.HinhAnh != null || this.item.HinhAnh != "") {
						let a = {
							strBase64: "",
							filename: "",
							extension: "",
							Type: 1,
							type: "image/png",
							src: this.API_ROOT_URL + this.item.HinhAnh,
							IsAdd: false,
							IsDel: false
						};
						this.imagedata.Files.push(a)
					}
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

	ten = this.translate.instant("Tên danh mục hàng")
	cha = this.translate.instant("Tên loại mặt hàng");
	changeLoai() {
		if (this.isLoai == "1") {
			this.ten = this.translate.instant("Tên loại mặt hàng") 
			this.cha = this.translate.instant("Tên loại mặt hàng cha");
		}
		else {
			this.ten = this.translate.instant("Tên danh mục hàng")
			this.cha = this.translate.instant("Tên danh mục cha");
		}
	}

    createForm() {
        this.itemForm = this.itemFB.group({
			tenLMH: [this.item.TenLoaiMatHang == null ? '' : this.item.TenLoaiMatHang, Validators.required],
			mota: [this.item.MoTaLMH == null ? '' : this.item.MoTaLMH],
			doUuTien: [this.item.DoUuTien == null ? '0' : this.dungchungService.f_currency_V2(this.item.DoUuTien.toString())],
			idLMHParent: [this.item.IDCha == null ? '0' : this.item.IDCha.toString()],
			imageControl: [this.item.HinhAnh],
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

	Filter1: string = '';
	async ListIdLMHParent() {
		let res = await this.dungchungService.getListTypeGoods(false, +this.isLoai).toPromise();
		if (res) {
			this.loadingSubject.next(false);
			if (res && res.status === 1 && res.data != null) {
				this.listIdLMHParent = res.data;
				this.selectIdLMHParent = '' + this.listIdLMHParent[0].IdLMH;
				this.filteredIdLMHParents.next(this.listIdLMHParent);
				this.changeDetectorRefs.detectChanges();
			};
		};
	}
	filter1() {
		if (!this.listIdLMHParent) {
			return;
		}
		let search = this.Filter1;
		if (!search) {
			this.filteredIdLMHParents.next(this.listIdLMHParent.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filteredIdLMHParents.next(
			this.listIdLMHParent.filter(ts =>
				ts.TenLoaiMH.toLowerCase().indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();
	}

    prepareCustomer(): DM_LoaiMatHangModel {
        const controls = this.itemForm.controls;
		const _DM_LoaiMatHang = new DM_LoaiMatHangModel();
		_DM_LoaiMatHang.clear();
		_DM_LoaiMatHang.TenLoaiMatHang = controls['tenLMH'].value;
		_DM_LoaiMatHang.MoTaLMH = controls['mota'].value;
		_DM_LoaiMatHang.GhiChu = controls['ghiChu'].value;
		_DM_LoaiMatHang.DoUuTien = controls['doUuTien'].value;
		_DM_LoaiMatHang.IDCha = controls['idLMHParent'].value;
		// _DM_LoaiMatHang.IDLoaiRef = controls['thuocTinh'].value;
		_DM_LoaiMatHang.Loai = +this.isLoai;

		//gán lại giá trị id
		if (this.item.IDLoaiMatHang > 0) {
			_DM_LoaiMatHang.IDLoaiMatHang = this.item.IDLoaiMatHang;
		}

		this.imgvl = controls['imageControl'].value == null ? [] : controls['imageControl'].value;
		_DM_LoaiMatHang.listLinkImage = [];

		if (controls['imageControl'].value != this.item.HinhAnh) {
			if (this.imgvl.length > 0) {
				for (let i = 0; i < this.imgvl.length; i++) {
					if (this.imgvl[i].IsAdd == true) {
						const md = new ListImageModel();
						md.strBase64 = this.imgvl[i].strBase64;
						md.filename = this.imgvl[i].filename;
						md.src = this.imgvl[i].src;
						md.IsAdd = this.imgvl[i].IsAdd;
						md.IsDel = this.imgvl[i].IsDel;
						_DM_LoaiMatHang.listLinkImage.push(md);
					}
				}
			}
		}
		else {
			const md = new ListImageModel();
			md.strBase64 = "";
			md.filename = "";
			md.src = controls['imageControl'].value == null ? '' : controls['imageControl'].value;
			md.IsAdd = true;
			md.IsDel = false;
			_DM_LoaiMatHang.listLinkImage.push(md);
		}
		return _DM_LoaiMatHang;
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
        if (EditChucVu.IDLoaiMatHang > 0) {
            this.Update(EditChucVu, withBack);
        } else {
            this.Create(EditChucVu, withBack);
        }
    }

    Update(_item: DM_LoaiMatHangModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucNhomHangService.Update(_item).subscribe(res => {
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

    Create(_item: DM_LoaiMatHangModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucNhomHangService.Update(_item).subscribe(res => {
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
		if (!this.item || !this.item.IDLoaiMatHang) {
			return result;
		}
		result = this.translate.instant('JeeHR.capnhat');
		return result;
	}
}
