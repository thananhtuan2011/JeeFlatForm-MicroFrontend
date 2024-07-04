import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { catchError, finalize, tap } from 'rxjs/operators';
import { fromEvent, merge, BehaviorSubject, ReplaySubject, of, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { DanhMucNhanVienService } from '../Services/danh-muc-nhan-vien.service';
import { DanhMucChungService } from '../../hr.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'projects/wizard-platform/src/modules/crud/utils/layout-utils.service';
import { JobtitleManagementDTO, PersonalInfoModel } from '../Model/danh-muc-nhan-vien.model';


@Component({
	selector: 'm-danh-muc-nhan-vien-edit',
	templateUrl: './danh-muc-nhan-vien-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class DanhMucNhanVienEditComponent implements OnInit {
	//Form
	itemForm: FormGroup;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loadingControl = new BehaviorSubject<boolean>(false);
	loading1$ = this.loadingSubject.asObservable();
	hasFormErrors: boolean = false;
	item: PersonalInfoModel;
	oldItem: PersonalInfoModel;
	selectedTab: number = 0;
	hoten: string = '';
	// Selection
	selection = new SelectionModel<PersonalInfoModel>(true, []);
	productsResult: PersonalInfoModel[] = [];
	ID_NV: string = '';
	ListDSHopDong: any[] = [];
	//===============Khai báo value chi tiêt==================
	listNoiCapCMND: any[] = [];
	listDanToc: any[] = [];
	listTonGiao: any[] = [];
	listHonNhan: any[] = [];
	listLoaiNhanVien: any[] = [];
	listLoaiHopDong: any[] = [];
	listDonVi: any[] = [];
	listPhongBan: any[] = [];
	listBoPhan: any[] = [];
	listChucDanh: any[] = [];
	listChucVu: any[] = [];
	listDiaDiemLamViec: any[] = [];
	listNganHang: any[] = [];
	listNoiSinh: any[] = [];
	id_provinces: string = '';
	id_district: string = '';
	id_dv: string = '';
	id_pb: string = '';
	id_cd: string = '';
	id_donvi: string = '';
	//========================================================
	LaLaoDongNuocNgoai: boolean = false;
	EnableChucVu: boolean = false;
	Visible: boolean = false;
	QuyenHopDong: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	//[=======================================================]
	public datatree: BehaviorSubject<any[]> = new BehaviorSubject([]);
	title: string = '';
	selectedNode: BehaviorSubject<any> = new BehaviorSubject([]);
	ID_Struct: string = '';
	Structure: number = 0;
	//======================================================
	ageDefaule: string = '';
	mindate: Date;
	maxdate: Date;
	maxdate_cur: Date;
	maxdate_pp: Date;
	mindate_pp: Date;
	date_pp: Date;
	KhongThoiHan: boolean = false;
	disabledBtn: boolean = false;
	//==================================================
	FileIn: string = '';
	//==================================================
	chucvus: JobtitleManagementDTO[] = [];
	filterChucVus: ReplaySubject<JobtitleManagementDTO[]> = new ReplaySubject<JobtitleManagementDTO[]>();
	private _isLoading$ = new BehaviorSubject<boolean>(false);
	private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
	private _errorMessage$ = new BehaviorSubject<string>('');
	private subscriptions: Subscription[] = [];
	get isLoading$() {
		return this._isLoading$.asObservable();
	}
	get isFirstLoading$() {
		return this._isFirstLoading$.asObservable();
	}
	get errorMessage$() {
		return this.errorMessage$.asObservable();
	}

	constructor(private _DanhMucNhanVienService: DanhMucNhanVienService,
		private danhMucService: DanhMucChungService,
		public dialog: MatDialog,
		private route: ActivatedRoute,
		private itemFB: FormBuilder,
		private layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
		private translate: TranslateService,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public dialogRef: MatDialogRef<DanhMucNhanVienEditComponent>,
	) { }

	/** LOAD DATA */
	ngOnInit() {
		this.reset();

		this.ID_NV = this.data._IDNV;

		this.title = this.translate.instant("JeeHR.cocautochuc") + " *";
		var date = new Date()
		this.maxdate_cur = date;

		this.date_pp = new Date();
		this.date_pp.setDate(this.date_pp.getDate() + 1);
		this.maxdate_pp = date;


		this._DanhMucNhanVienService.DetailsStaffID(this.ID_NV).subscribe(res => {
			if (res) {
				this.item = res;
				this.item.StructureID = this.item.departmemtId;
				this.item.staffTypeId = +res.staffTypeId;
				this.oldItem = Object.assign({}, res);
				this.initProduct();
				this.loadList();
				this.getTreeValue();
				this.changeDetectorRefs.detectChanges();
			} else {
				this.item = Object.assign({}, this.oldItem);
				this.initProduct();
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});


	}
	getTreeValue() {
		this.danhMucService.Get_CoCauToChuc().subscribe(res => {
			if (res.data && res.data.length > 0) {
				this.datatree.next(res.data);
				this.selectedNode.next({
					RowID: "" + this.item.StructureID,
				});
				this.ID_Struct = '' + this.item.StructureID;
			}
		});
	}

	loadList() {
		this.danhMucService.GetListStaffType().subscribe(res => {
			this.listLoaiNhanVien = res.data;
			this.changeDetectorRefs.detectChanges();
		});

		const sb3 = this.danhMucService
			.getDSChucvu_HR()
			.pipe(
				tap((res) => {
					this.chucvus = [...res.data];
					this.filterChucVus.next([...res.data]);
					this.itemForm.controls.ChucVuFilterCtrl.valueChanges.subscribe(() => {
						this.profilterChucVus();
					});
				}),
				finalize(() => {
					this._isFirstLoading$.next(false);
					this._isLoading$.next(false);
				}),
				catchError((err) => {
					console.log(err);
					this._errorMessage$.next(err);
					return of();
				})
			)
			.subscribe();
		this.subscriptions.push(sb3);
	}

	protected profilterChucVus() {
		if (!this.itemForm.controls.chucVu) {
			return;
		}
		let search = this.itemForm.controls.ChucVuFilterCtrl.value;
		if (!search) {
			this.filterChucVus.next([...this.chucvus]);
			return;
		} else {
			search = search.toLowerCase();
		}
		this.filterChucVus.next(this.chucvus.filter((item) => item.tenchucdanh.toLowerCase().indexOf(search) > -1));
	}

	loadListChucVu() {
		this.danhMucService.GetListPositionbyStructure(this.ID_Struct).subscribe(res => {
			this.listChucDanh = res.data;
			if (res.data.length > 0) {
				this.id_cd = '' + this.item.ID_ChucVu;
				this.danhMucService.GetListJobtitleByStructure(this.id_cd, this.ID_Struct).subscribe(res => {
					this.listChucVu = res.data;
					this.changeDetectorRefs.detectChanges();
				});
			}
		});
		this.danhMucService.GetListWorkplaceByBranch("0").subscribe(res => {
			this.listDiaDiemLamViec = res.data;
			this.changeDetectorRefs.detectChanges();
		})
	}

	loadChucDanhChange(idcd: any) {
		let id_st = this.ID_Struct;
		this.danhMucService.GetListJobtitleByStructure(idcd, id_st).subscribe(res => {
			this.listChucVu = res.data;
			if (this.listChucVu.length > 0) {
				this.itemForm.controls['chucVu'].setValue('' + res.data[0].ID);
				this.changeDetectorRefs.detectChanges();
			}
			else {
				this.itemForm.controls['chucVu'].setValue('');
				this.changeDetectorRefs.detectChanges();
			}

		});
	}

	GetValueNode(val: any) {
		this.ID_Struct = val.RowID;
		this.changeDetectorRefs.detectChanges();
		// this.danhMucService.GetListPositionbyStructure(this.ID_Struct).subscribe(res => {
		// 	this.listChucDanh = res.data;
		// 	if (res.data.length > 0) {
		// 		this.id_cd = '' + res.data[0].ID;
		// 		this.itemForm.controls['chucDanh'].setValue(this.id_cd);
		// 		this.danhMucService.GetListJobtitleByStructure(this.id_cd, this.ID_Struct).subscribe(res => {
		// 			this.listChucVu = res.data;
		// 			if (res.data.length > 0) {
		// 				this.itemForm.controls['chucVu'].setValue('' + res.data[0].ID);
		// 			}
		// 			this.changeDetectorRefs.detectChanges();
		// 		});
		// 	} else {
		// 		this.itemForm.controls['chucDanh'].setValue('');
		// 		this.itemForm.controls['chucVu'].setValue('');
		// 	}
		// });
	}

	/** ACTIONS */

	initProduct() {
		this.createForm();
		this.loadingSubject.next(false);
		this.loadingControl.next(true);
	}
	createForm() {
		this.itemForm = this.itemFB.group({
			loaiNhanVien: [this.item.staffTypeId, [Validators.required]],
			ngayBatDauLamViec: [this.danhMucService.f_convertDate(this.item.startDate), [Validators.required]],
			chucVu: [this.item._jobtitleId, [Validators.required]],
			ChucVuFilterCtrl: [],
		});
	}
	reset() {
		this.item = Object.assign({}, this.oldItem);
		this.createForm();
		this.hasFormErrors = false;
		this.itemForm.markAsPristine();
		this.itemForm.markAsUntouched();
	}
	onAlertClose($event) {
		this.hasFormErrors = false;
	}
	//---------------------------------------------------------
	f_number(value: any) {
		return Number((value + '').replace(/,/g, ""));
	}

	f_currency(value: any, args?: any): any {
		let nbr = Number((value + '').replace(/,|-/g, ""));
		return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	}
	textPres(e: any, vi: any) {
		if (isNaN(e.key)
			//&& e.keyCode != 8 // backspace
			//&& e.keyCode != 46 // delete
			&& e.keyCode != 32 // space
			&& e.keyCode != 189
			&& e.keyCode != 45
		) {// -
			e.preventDefault();
		}
	}
	checkDate(e: any, vi: any) {
		if (!((e.keyCode > 95 && e.keyCode < 106)
			|| (e.keyCode > 46 && e.keyCode < 58)
			|| e.keyCode == 8)) {
			e.preventDefault();
		}
	}
	checkValue(e: any, vi: any) {
		if (!((e.keyCode > 95 && e.keyCode < 106)
			|| (e.keyCode > 47 && e.keyCode < 58)
			|| e.keyCode == 8)) {
			e.preventDefault();
		}
	}
	f_convertDate(v: any) {
		if (v != "" && v != null) {
			let a = new Date(v);
			return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
		}
	}

	//=============================Lưu cập nhật thông tin cán bộ==============================================
	onSubmit(withBack: boolean = false) {

		this.hasFormErrors = false;
		const controls = this.itemForm.controls;
		/** check form */
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		// if (this.f_convertDate(controls["ngayHetHanThuViec"].value) != undefined) {
		// 	if (this.f_convertDate(controls["ngayBatDauLamViec"].value) > this.f_convertDate(controls["ngayHetHanThuViec"].value)) {
		// 		let message = 'Ngày bắt đầu công việc phải nhỏ hơn hoặc bằng ngày hết hạn thử việc';
		// 		this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
		// 		return;
		// 	}
		// }
		// if (this.f_convertDate(controls["ngayVaoChinhThuc"].value) != undefined) {
		// 	if (this.f_convertDate(controls["ngayBatDauLamViec"].value) > this.f_convertDate(controls["ngayVaoChinhThuc"].value)) {
		// 		let message = 'Ngày bắt đầu công việc phải nhỏ hơn hoặc bằng ngày vào chính thức';
		// 		this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
		// 		return;
		// 	}
		// }
		// if (this.f_convertDate(controls["ngayHetHanThuViec"].value) != undefined && this.f_convertDate(controls["ngayVaoChinhThuc"].value) != undefined) {
		// 	if (this.f_convertDate(controls["ngayHetHanThuViec"].value) > this.f_convertDate(controls["ngayVaoChinhThuc"].value)) {
		// 		let message = 'Ngày hết hạn thử việc phải nhỏ hơn ngày vào chính thức';
		// 		this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
		// 		return;
		// 	}
		// }
		let editedProduct = this.prepareProduct();
		this.updateProduct(editedProduct, withBack)
	}

	prepareProduct(): PersonalInfoModel {
		const _product = new PersonalInfoModel();
		const controls = this.itemForm.controls;
		_product.staffId = +this.ID_NV;
		_product.staffTypeId = controls["loaiNhanVien"].value;
		_product.startDate = this.danhMucService.f_convertDate(controls['ngayBatDauLamViec'].value);
		_product.departmemtId = +this.ID_Struct;
		_product._jobtitleId = +this.itemForm.controls.chucVu.value;
		return _product;
	}

	updateProduct(_product: PersonalInfoModel, withBack: boolean = false) {
		this.loadingSubject.next(true);
		this.disabledBtn = true;
		this._DanhMucNhanVienService.Update_NhanVien_TTCV(_product).subscribe(res => {
			this.loadingSubject.next(false);
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.dialogRef.close({
					_product
				});
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	//==========================================================
	goBack() {
		this.dialogRef.close();
	}

	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
			this.onSubmit(false);
		}
	}

	//=================================================================
	getTitle(): string {
		let result = this.translate.instant('JeeHR.capnhat');
		return result;
	}
}
