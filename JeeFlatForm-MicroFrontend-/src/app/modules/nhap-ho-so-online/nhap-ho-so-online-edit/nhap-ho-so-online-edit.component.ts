import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, HostListener, Pipe, PipeTransform } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NhapHoSoOnlineModel } from '../Model/nhap-ho-so-online.model';
import { NhapHoSoOnlineService } from '../Services/nhap-ho-so-online.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from '../../crud/utils/layout-utils.service';
import { DanhMucChungService } from 'src/app/_metronic/core/services/danhmuc.service';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
	constructor(private sanitized: DomSanitizer) { }
	transform(value) {
		return this.sanitized.bypassSecurityTrustHtml(value);
	}
}

@Component({
	selector: 'm-nhap-ho-so-online-edit',
	templateUrl: './nhap-ho-so-online-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NhapHoSoOnlineEditComponent implements OnInit {
	//Form cập nhật mật khẩu
	itemFormPW: FormGroup;
	showPW: boolean = true;
	//Form cập nhật thông tin
	itemForm: FormGroup;

	item: NhapHoSoOnlineModel;
	oldItem: NhapHoSoOnlineModel;
	loadingAfterSubmit: boolean = false;

	listNoiSinh: any[] = [];
	listNoiCapCMND: any[] = [];
	listBangCap: any[] = [];
	listDanToc: any[] = [];
	listTonGiao: any[] = [];
	listHonNhan: any[] = [];


	disabledBtn: boolean = false;
	showTrinhDo: boolean = false;
	ageDefaule: string = '';


	@ViewChild('myInput') myInputVariable: ElementRef;

	//====================================================================
	token: string = '';
	username: string = '';
	fieldTextType: boolean;
	fieldTextType_new: boolean;

	mindate: Date;
	maxdate: Date;
	maxdate_cur: Date;
	maxdate_pp: Date;
	mindate_pp: Date;
	date_pp: Date;

	showND: boolean = false;
	lstItem: any = '';

	constructor(public dialogRef: MatDialogRef<NhapHoSoOnlineEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private nhapHoSoOnlineService: NhapHoSoOnlineService,
		private danhMucService: DanhMucChungService,
		public dialog: MatDialog,
		public datepipe: DatePipe,
		private layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
		private itemFB: FormBuilder,
		private itemFBPW: FormBuilder,
	) { }

	/** LOAD DATA */
	ngOnInit() {
		this.token = this.data._token;
		this.username = this.data._username;
		this.resetPW();
		this.createFormPW();

		var date = new Date()
		this.maxdate_cur = date;

		this.date_pp = new Date();
		this.date_pp.setDate(this.date_pp.getDate() + 1);
		this.maxdate_pp = date;
		this.loadData();
	}
	//---------------------------------------------------------
	resetPW() {
		this.item = Object.assign({}, this.oldItem);
		this.createFormPW();
		this.itemFormPW.markAsPristine();
		this.itemFormPW.markAsUntouched();
		this.itemFormPW.updateValueAndValidity();
	}
	createFormPW() {
		this.itemFormPW = this.itemFBPW.group({
			tendangnhap: [this.username, [Validators.required]],
			matkhau: ['', [Validators.required]],
			Retype_new_password: ['', [Validators.required]],
		});
		this.itemFormPW.controls["tendangnhap"].markAsTouched();
		this.itemFormPW.controls["matkhau"].markAsTouched();
		this.itemFormPW.controls["Retype_new_password"].markAsTouched();
	}

	toggleFieldTextType() {
		this.fieldTextType = !this.fieldTextType;
	}
	toggleFieldTextType_new() {
		this.fieldTextType_new = !this.fieldTextType_new;
	}

	dis: boolean = false;
	checkPass() {
		const controls = this.itemFormPW.controls;
		this.dis = controls['matkhau'].value != controls['Retype_new_password'].value ? true : false;
		if (controls['matkhau'].value == "" || controls['matkhau'].value == undefined) {
			this.dis = true;
		}
	}

	TiepTuc() {
		const controls = this.itemFormPW.controls;
		let pw = controls['matkhau'].value;
		this.nhapHoSoOnlineService.checkPass(pw).subscribe(res => {
			if (res && res.status == 1) {
				this.showPW = false;
				this.reset();
				this.createForm();
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
			this.changeDetectorRefs.detectChanges();
		})
	}

	//=======================================================================================================
	loadData() {
		this.nhapHoSoOnlineService.GetListProvincesByToken(this.token).subscribe(res => {
			this.listNoiSinh = res.data;
			this.listNoiCapCMND = res.data;
			this.changeDetectorRefs.detectChanges();
		})
		this.nhapHoSoOnlineService.GetListNationByToken(this.token).subscribe(res => {
			this.listDanToc = res.data;
			this.changeDetectorRefs.detectChanges();
		});
		this.nhapHoSoOnlineService.GetListReligionByToken(this.token).subscribe(res => {
			this.listTonGiao = res.data;
			this.changeDetectorRefs.detectChanges();
		});
		this.nhapHoSoOnlineService.GetListDegreeByToken(this.token).subscribe(res => {
			this.listBangCap = res.data;
			this.changeDetectorRefs.detectChanges();
		});
		this.nhapHoSoOnlineService.GetListMaritalStatusByToken(this.token).subscribe(res => {
			this.listHonNhan = res.data;
			this.changeDetectorRefs.detectChanges();
		});
	}
	createForm() {
		this.itemForm = this.itemFB.group({
			hoTen: [this.item.fullName, [Validators.required]],
			gioiTinh: [this.item.gender, [Validators.required]],

			ngaySinh: [this.item.dob, [Validators.required]],
			noiSinh: [this.item.podId, [Validators.required]],

			diDong: [this.item.phone, [Validators.required, Validators.pattern(/^[0-9]{10}$|^[0-9]{11}$/)]],
			email: [this.item.email, [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
			quoctich: [this.item.nationality, [Validators.required]],

			cmnd: [this.item.id, [Validators.pattern(/^[0-9]{9}$|^[0-9]{12}$/), Validators.required]],
			ngayCapCMND: [this.item.issuedDate, [Validators.required]],
			noiCapCMND: [this.item.issuedPlaceId, [Validators.required]],

			sonha: [this.item.permanentAddress, [Validators.required]],
			Province: ['', [Validators.required]],

			diaChiTamTru: [this.item.currentAddress],

			danToc: [this.item.nattionId, [Validators.required]],
			tonGiao: [this.item.religionId, [Validators.required]],

			bangCap: [this.item.trainLevelId, [Validators.required]],
			tinhTrangHonNhan: [this.item.maritalStatusId, [Validators.required]],

			mst: [this.item.taxCode],
			ngayCapMST: [this.item.taxCode_IssuedDate],
			noicapmst: [this.item.taxCode_IssuedPlace],

			soHoChieu: [this.item.passport],
			noicaphochieu:[this.item.passport_IssuedPlace],
			ngayCapHoChieu: [this.item.passport_IssuedDate],
			ngayHetHan: [this.item.passport_ExpirationDate],

			soTK: [this.item.accountNumber],
			chuTK: [this.item.accountHolder],

			nganHang: [this.item.bank],
			chinhanhnganHang: [this.item.bank_Branch],

			SoSo: [this.item.socialInsurance],
			ngaycapsoBHXH: [this.item.socialInsurance_IssuedDate],

			nguoiLienHe: [this.item.contact_FullName],
			quanHeNguoiLienHe: [this.item.contact_Relationship],
			soDienThoaiNguoiLienHe: [this.item.contact_Phone, [Validators.pattern(/^[0-9]{10}$|^[0-9]{11}$/)]],
		});

		this.itemForm.controls["hoTen"].markAsTouched();
		this.itemForm.controls["gioiTinh"].markAsTouched();
		this.itemForm.controls["ngaySinh"].markAsTouched();
		this.itemForm.controls["noiSinh"].markAsTouched();
		this.itemForm.controls["diDong"].markAsTouched();
		this.itemForm.controls["email"].markAsTouched();
		this.itemForm.controls["quoctich"].markAsTouched();
		this.itemForm.controls["cmnd"].markAsTouched();
		this.itemForm.controls["ngayCapCMND"].markAsTouched();
		this.itemForm.controls["noiCapCMND"].markAsTouched();
		this.itemForm.controls["sonha"].markAsTouched();
		this.itemForm.controls["Province"].markAsTouched();
		this.itemForm.controls["danToc"].markAsTouched();
		this.itemForm.controls["tonGiao"].markAsTouched();
		this.itemForm.controls["bangCap"].markAsTouched();
		this.itemForm.controls["tinhTrangHonNhan"].markAsTouched();
	}

	reset() {
		this.item = Object.assign({}, this.oldItem);
		this.createForm();
		this.itemForm.markAsPristine();
		this.itemForm.markAsUntouched();
		this.itemForm.updateValueAndValidity();
	}

	soTienChanged(v: any) {
		var regex = /[a-zA-Z ]/g;
		var found = v.match(regex);
		if (found == null) {
			let tien = '';
			tien = this.f_currency(v);
			this.itemForm.controls["mucLuong"].setValue(tien);
		}
		else {
			this.itemForm.controls["mucLuong"].setValue('');
			// const message = 'Số tiền không gồm chữ';
			// this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			return;
		}
	}

	f_number(value: any) {
		return Number((value + '').replace(/,/g, ""));
	}

	f_currency(value: any, args?: any): any {
		let nbr = Number((value + '').replace(/,|-/g, ""));
		return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	}

	DateChangeMin(val: any) {
		this.mindate = val.value;
		if (val.value > this.maxdate) {
			this.mindate = this.maxdate;
		}
	}
	DateChangeMax(val: any) {
		this.maxdate = val.value;
		if (val.value < this.mindate) {
			this.maxdate = this.mindate;
		}
	}
	DateChangeMinHoChieu(val: any) {
		this.mindate_pp = val.value;
	}
	DateChangeMaxHoChieu(val: any) {
		this.maxdate_pp = val.value;
	}

	goBack() {
		this.showPW = true;
		this.changeDetectorRefs.detectChanges();
	}

	onSubmit(withBack: boolean = false) {
		const controls = this.itemForm.controls;
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			return;
		}

		let updatedonvi = this.Prepareleave();
		this.AddItem(updatedonvi, withBack);
	}

	Prepareleave(): NhapHoSoOnlineModel {

		const controlsPW = this.itemFormPW.controls;
		const controls = this.itemForm.controls;
		const wh = new NhapHoSoOnlineModel();
		wh.token = this.token;

		wh.username = controlsPW['tendangnhap'].value;
		wh.password = controlsPW['matkhau'].value;

		wh.fullName = controls['hoTen'].value;
		wh.gender = controls['gioiTinh'].value;

		wh.dob = this.danhMucService.f_convertDateUTC(controls['ngaySinh'].value);
		wh.podId = controls['noiSinh'].value;

		wh.phone = controls['diDong'].value;
		wh.email = controls['email'].value;
		wh.nationality = controls['quoctich'].value;

		wh.id = controls['cmnd'].value;
		wh.issuedDate = this.danhMucService.f_convertDateUTC(controls['ngayCapCMND'].value);
		wh.issuedPlaceId = controls['noiCapCMND'].value;

		wh.permanentAddress = controls['sonha'].value;
		wh.permanentWardsId = controls['Province'].value;

		wh.currentAddress = controls['diaChiTamTru'].value;

		wh.nattionId = controls['danToc'].value;
		wh.religionId = controls['tonGiao'].value;

		wh.trainLevelId = controls['bangCap'].value;
		wh.maritalStatusId = controls['tinhTrangHonNhan'].value;

		wh.taxCode = controls['mst'].value;
		wh.taxCode_IssuedDate = this.danhMucService.f_convertDateUTC(controls['ngayCapMST'].value);
		wh.taxCode_IssuedPlace = controls['noicapmst'].value;


		wh.passport = controls['soHoChieu'].value;
		wh.passport_IssuedPlace = controls['noicaphochieu'].value;
		wh.passport_IssuedDate = this.danhMucService.f_convertDateUTC(controls['ngayCapHoChieu'].value);
		wh.passport_ExpirationDate = this.danhMucService.f_convertDateUTC(controls['ngayHetHan'].value);

		wh.accountNumber = controls['soTK'].value;
		wh.accountHolder = controls['chuTK'].value;
		wh.bank = controls['nganHang'].value;
		wh.bank_Branch = controls['chinhanhnganHang'].value;

		wh.socialInsurance = controls['SoSo'].value;
		wh.socialInsurance_IssuedDate = this.danhMucService.f_convertDateUTC(controls['ngaycapsoBHXH'].value);

		wh.contact_FullName = controls['nguoiLienHe'].value;
		wh.contact_Phone = controls['soDienThoaiNguoiLienHe'].value;
		wh.contact_Relationship = controls['quanHeNguoiLienHe'].value;

		return wh;
	}
	AddItem(item: NhapHoSoOnlineModel, withBack: boolean) {
		this.layoutUtilsService.showWaitingDiv();
		this.nhapHoSoOnlineService.CreateItem(item).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.showND = true;
				this.lstItem = res.data;
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 10000, true, false, 3000, 'top', 0);
			}
			this.changeDetectorRefs.detectChanges();
		});
	}

	Dong() {
		this.dialogRef.close();
	}

	//===================================================
	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
			this.onSubmit(false);
		}
	}
	
	//=============Kiểm tra tuổi thêm cán bộ===============
	CheckAge() {
		let year = new Date();
		let tuoi = 0;
		const controls = this.itemForm.controls;
		if (controls["ngaySinh"].status == "VALID") {
			tuoi = +year.getFullYear() - (+controls['ngaySinh'].value._d.getFullYear());
			if (tuoi < +this.ageDefaule) {
				let message = 'Nhân viên không đủ tuổi tham gia vào công ty';
				this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
				this.itemForm.controls['ngaySinh'].setValue("");
				this.changeDetectorRefs.detectChanges();
			}
		}
	}
	//=====================================================================================
	getHeight(){
		let tmp_height = 0;
		tmp_height = window.innerHeight - 120;
		return tmp_height + 'px';
	}
}
