import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, forkJoin, from, of, BehaviorSubject, ReplaySubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DM_MatHangModel, ListImageModel } from '../Model/danh-muc-hang.model';
import { DanhMucHangService } from '../Services/danh-muc-hang.service';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { DungChungService } from '../../dungchung.service';
import { environment } from 'projects/wizard-platform/src/environments/environment';
@Component({
    selector: 'app-danh-muc-hang-edit-dialog',
    templateUrl: './danh-muc-hang-edit-dialog.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DanhMucHangEditDialogComponent implements OnInit {
    item: DM_MatHangModel;
    oldItem: DM_MatHangModel;
    selectedTab: number = 0;
    loadingSubject = new BehaviorSubject<boolean>(false);
    loading$ = this.loadingSubject.asObservable();
    itemForm: FormGroup;
    viewLoading: boolean = false;
    hasFormErrors: boolean = false;
    disabledBtn: boolean = false;
    @ViewChild("focusInput", {static: true}) focusInput: ElementRef;

	listIdLMH: any[] = [];
	listIdDM: any[] = [];
	filteredIdLMHs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	filteredIdDMs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	//----------------------------------------------------------
	listIdNhanHieu: any[] = [];
	filteredIdNHs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	//----------------------------------------------------------
	listIdXuatXu: any[] = [];
	filteredIdXXs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

	listIdDVT: any[] = [];
	filteredDVT: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	listIdDVTCap2: any[] = [];
	filteredDVT2: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

	filteredKHOs: Observable<string[]>;
	listIdKho: any = [];
	listMaMatHang: any = [];
	listIdNCC: any[] = [];
	selectIdNCC: string = '0';

	imagedata: any;
	listimagedata: any;
	imgvl: any[] = [];

    API_ROOT_URL = environment.HOST_CDNSERVER_API

    constructor(public dialogRef: MatDialogRef<DanhMucHangEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _DanhMucHangService: DanhMucHangService,
		private dungchungService: DungChungService,
        private itemFB: FormBuilder,
        public dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private changeDetectorRefs: ChangeDetectorRef,
        private translate: TranslateService) { }


    async ngOnInit() {
		this.imagedata = {
			RowID: "",
			Title: "",
			Description: "",
			Required: false,
			Files: []
		}
        this.reset();
        this.item = this.data._item;

		this.ListIdDVT();
		this.ListIdNCC();
		this.GetThueVATMD()
		await this.ListIdLMH();
		await this.ListIdNhanHieu();
		await this.ListIdXuatXu();

        if (this.item.IDMatHang > 0) {
            this.viewLoading = true;
			this._DanhMucHangService.getDM_MatHangById(this.item.IDMatHang).subscribe(res => {
				this.viewLoading = false;
				if (res.status == 1 && res.data) {
					this.item = res.data;
					if (this.item.HinhAnh != null && this.item.HinhAnh != "") {
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
			maHang: [this.item.MaHang == null? '' : this.item.MaHang], 
			tenMatHang: [this.item.TenMatHang == null ? '' : this.item.TenMatHang, Validators.required], 
			idLMH: [(this.item.IDLoaiMatHang == 0 || this.item.IDLoaiMatHang == null) ? '' : this.item.IDLoaiMatHang.toString()], 
			idDM: [(this.item.IDDanhMuc == 0 || this.item.IDDanhMuc == null) ? '' : this.item.IDDanhMuc.toString()],
			idDVT: [(this.item.IDDVCB == 0 || this.item.IDDVCB == null) ? '' : this.item.IDDVCB.toString(), Validators.required], 
			mota: [this.item.MoTa == null ? '' : this.item.MoTa], 
			donGia: [this.item.DonGia == null ? '0' : this.item.DonGia], 
			giaVon: [this.item.GiaVon == null ? '0' : this.item.GiaVon], 
			// giaSi: [this.item.GiaSi == null ? '0' : this.item.GiaSi], 
			// giaKhuyenMai: [this.item.GiaKhuyenMai == null ? '0' : this.item.GiaKhuyenMai], 
			vAT: [this.item.VAT == null ? '0' : this.item.VAT.toString()], 
			barcode: [this.item.Barcode == null ? '' : this.item.Barcode], 
			ngungKinhDoanh: [this.item.NgungKinhDoanh == null ? '' : this.item.NgungKinhDoanh],
			isHanSuDung: [this.item.IsHanSuDung == null ? '' : this.item.IsHanSuDung],
			idDVTCap2: [this.item.IDDVTCapHai == null ? '0' : this.item.IDDVTCapHai.toString()], 
			// quyDoiDVTCap2: [this.item.QuyDoi_DVT_Ban == null ? '0' : this.item.QuyDoi_DVT_Ban], 
			quyDoi: [this.item.QuyDoi == null ? '0' : this.item.QuyDoi], 
			giaQuyDoi : [this.item.GiaQuyDoi == null ? '0' : this.item.GiaQuyDoi], 
			idNCC: [this.item.ChiTietNhaCungCap == null ? [] : this.item.ChiTietNhaCungCap],
			tenOnSite: [this.item.TenHienThiWebsite == null ? '' : this.item.TenHienThiWebsite], 
			idNhanHieu: [this.item.IDNhanHieu == null ? '0' : this.item.IDNhanHieu.toString()],
			idXuatXu: [this.item.IDXuatXu == null ? '0' : this.item.IDXuatXu.toString()],
			chiTietMoTa: [this.item.ChiTietMoTa == null ? '' : this.item.ChiTietMoTa], 
			tenKhac: [this.item.TenKhac == null ? '' : this.item.TenKhac], 
			doUuTien: [(this.item.Priority == 0 || this.item.Priority == null) ? '' : this.item.Priority.toString()], 
			tonMin: [this.item.TonToiThieu == null ? '0' : this.item.TonToiThieu], 
			tonMax: [this.item.TonToiDa == null ? '0' : this.item.TonToiDa],
			imageControl: [], //chèn null lỗi
			isDepot: [this.item.IsDepot == null ? '' : this.item.IsDepot],
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

	thuemd: number = 0
	GetThueVATMD() {
		this._DanhMucHangService.getThueVATMacDinh().subscribe( res => {
			this.loadingSubject.next(false);
			if (res && res.status === 1) {
				this.thuemd = res.data
				this.itemForm.controls.vAT.setValue(this.thuemd.toString())
				this.changeDetectorRefs.detectChanges();
			};
		});
	}

	ListIdNCC() {
		this.dungchungService.getListSupp().subscribe( res => {
			this.loadingSubject.next(false);
			if (res && res.status === 1) {
				this.listIdNCC = res.data;
				this.changeDetectorRefs.detectChanges();
			};
		});
	}

	Filter3: string = '';
	Filter4: string = '';
	ListIdDVT() {
		this.dungchungService.getListCalUnit().subscribe( res => {
			this.loadingSubject.next(false);
			if (res && res.status === 1) {
				this.listIdDVT = res.data;
				this.listIdDVTCap2 = res.data;
				this.filteredDVT.next(this.listIdDVT);
				this.filteredDVT2.next(this.listIdDVT);
				this.changeDetectorRefs.detectChanges();
			};
		});
	}
	filter3() {
		if (!this.listIdDVT) {
			return;
		}
		let search = this.Filter3;
		if (!search) {
			this.filteredDVT.next(this.listIdDVT.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filteredDVT.next(
			this.listIdDVT.filter(ts =>
				ts.TenDVT.toLowerCase().indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();
	}
	filter4() {
		if (!this.listIdDVTCap2) {
			return;
		}
		let search = this.Filter4;
		if (!search) {
			this.filteredDVT2.next(this.listIdDVTCap2.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filteredDVT2.next(
			this.listIdDVTCap2.filter(ts =>
				ts.TenDVT.toLowerCase().indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();
	}


	//#region Loại mặt hàng
	Filter1: string = '';
	Filter2: string = '';
	async ListIdLMH() {
		let res = await this.dungchungService.getListTypeGoods(false).toPromise();
		if (res) {
			this.loadingSubject.next(false);
			if (res && res.status === 1) {
				let data = res.data;
				this.listIdLMH = data.filter(x => x.Loai == 1);
				this.listIdDM = data.filter(x => x.Loai == 2);
				this.filteredIdLMHs.next(this.listIdLMH);
				this.filteredIdDMs.next(this.listIdDM);
				this.changeDetectorRefs.detectChanges();
			};
		};
	}
	filter1() {
		if (!this.listIdLMH) {
			return;
		}
		let search = this.Filter1;
		if (!search) {
			this.filteredIdLMHs.next(this.listIdLMH.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filteredIdLMHs.next(
			this.listIdLMH.filter(ts =>
				ts.TenLoaiMH.toLowerCase().indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();
	}
	filter2() {
		if (!this.listIdDM) {
			return;
		}
		let search = this.Filter2;
		if (!search) {
			this.filteredIdDMs.next(this.listIdDM.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filteredIdDMs.next(
			this.listIdDM.filter(ts =>
				ts.TenLoaiMH.toLowerCase().indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();
	}
	//#endregion

	//#region Nhãn hiệu
	FilterNH: string = '';
	async ListIdNhanHieu() {
		let res = await this.dungchungService.getListTradeMark().toPromise();
		if (res) {
			this.loadingSubject.next(false);
			if (res && res.status === 1) {
				this.listIdNhanHieu = res.data;
				this.filteredIdNHs.next(this.listIdNhanHieu);
				this.changeDetectorRefs.detectChanges();
			};
		};
	}
	filterNH() {
		if (!this.listIdNhanHieu) {
			return;
		}
		let search = this.FilterNH;
		if (!search) {
			this.filteredIdNHs.next(this.listIdNhanHieu.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filteredIdNHs.next(
			this.listIdNhanHieu.filter(ts =>
				ts.TenNhanHieu.toLowerCase().indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();
	}
	//#endregion

	//#region Xuất xứ
	FilterXX: string = '';
	async ListIdXuatXu() {
		let res = await this.dungchungService.getListOrigin().toPromise();
		if (res) {
			this.loadingSubject.next(false);
			if (res && res.status === 1) {
				this.listIdXuatXu = res.data;
				this.filteredIdXXs.next(this.listIdXuatXu);
				this.changeDetectorRefs.detectChanges();
			};
		};
	}
	filterXX() {
		if (!this.listIdXuatXu) {
			return;
		}
		let search = this.FilterXX;
		if (!search) {
			this.filteredIdXXs.next(this.listIdXuatXu.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filteredIdXXs.next(
			this.listIdXuatXu.filter(ts =>
				ts.TenXuatXu.toLowerCase().indexOf(search) > -1)
		);
		this.changeDetectorRefs.detectChanges();
	}
	//#endregion

    prepareCustomer(): DM_MatHangModel {
        const controls = this.itemForm.controls;
		const _DM_MatHang = new DM_MatHangModel();
		_DM_MatHang.clear();
		_DM_MatHang.MaHang = controls['maHang'].value;
		_DM_MatHang.TenMatHang = controls['tenMatHang'].value;
		_DM_MatHang.IDLoaiMatHang = +controls['idLMH'].value;
		_DM_MatHang.IDDVCB = +controls['idDVT'].value;
		_DM_MatHang.MoTa = controls['mota'].value;
		_DM_MatHang.GiaVon = +controls['giaVon'].value;
		_DM_MatHang.DonGia = +controls['donGia'].value;
		_DM_MatHang.VAT = +controls['vAT'].value;
		_DM_MatHang.Barcode = controls['barcode'].value;
		_DM_MatHang.NgungKinhDoanh = controls['ngungKinhDoanh'].value ? true : false;
		_DM_MatHang.IDDVTCapHai = +controls['idDVTCap2'].value;
		_DM_MatHang.QuyDoi = +controls['quyDoi'].value;
		// _DM_MatHang.QuyDoi_DVT_Ban = +controls['quyDoiDVTCap2'].value;
		_DM_MatHang.GiaQuyDoi = +controls['giaQuyDoi'].value;
		_DM_MatHang.TenHienThiWebsite = controls['tenOnSite'].value;
		_DM_MatHang.IDNhanHieu = +controls['idNhanHieu'].value;
		_DM_MatHang.IDXuatXu = +controls['idXuatXu'].value;
		_DM_MatHang.ChiTietMoTa = controls['chiTietMoTa'].value;
		_DM_MatHang.TenKhac = controls['tenKhac'].value;
		_DM_MatHang.Priority = +controls['doUuTien'].value;
		_DM_MatHang.ChiTietNhaCungCap = controls['idNCC'].value;
		_DM_MatHang.GiaQuyDoi = +controls['giaQuyDoi'].value;
		_DM_MatHang.TonToiThieu = +controls['tonMin'].value;
		_DM_MatHang.TonToiDa = +controls['tonMax'].value;
		_DM_MatHang.IsDepot = controls['isDepot'].value ? true : false;
		_DM_MatHang.IDDanhMuc = +controls['idDM'].value;
		_DM_MatHang.IsHanSuDung = controls['isHanSuDung'].value ? true : false;
		// _DM_MatHang.GiaSi = +controls['giaSi'].value;
		// _DM_MatHang.GiaKhuyenMai = +controls['giaKhuyenMai'].value;

		// gán lại giá trị id
		if (+this.item.IDMatHang > 0) {
			_DM_MatHang.IDMatHang = this.item.IDMatHang;
		}

		this.imgvl = controls['imageControl'].value == null ? [] : controls['imageControl'].value;
		_DM_MatHang.listLinkImage = [];
		if (controls['imageControl'].value != this.item.HinhAnh && this.imgvl.length > 0) {
			for (let i = 0; i < this.imgvl.length; i++) {
				if (this.imgvl[i].IsAdd == true) {
					const md = new ListImageModel();
					md.strBase64 = this.imgvl[i].strBase64;
					md.filename = this.imgvl[i].filename;
					md.src = this.imgvl[i].src;
					md.IsAdd = this.imgvl[i].IsAdd;
					md.IsDel = this.imgvl[i].IsDel;
					_DM_MatHang.listLinkImage.push(md);
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
			_DM_MatHang.listLinkImage.push(md);
		}
		_DM_MatHang.HinhAnh = this.item.HinhAnh;
		return _DM_MatHang;
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
        if (EditChucVu.IDMatHang > 0) {
            this.Update(EditChucVu, withBack);
        } else {
            this.Create(EditChucVu, withBack);
        }
    }

    Update(_item: DM_MatHangModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucHangService.Update(_item).subscribe(res => {
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

    Create(_item: DM_MatHangModel, withBack: boolean) {
        this.disabledBtn = true;
        this._DanhMucHangService.Update(_item).subscribe(res => {
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
		if (!this.item || !this.item.IDMatHang) {
			return result;
		}
		result = this.translate.instant('JeeHR.capnhat');
		return result;
	}
}
