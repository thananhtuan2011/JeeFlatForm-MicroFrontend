import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// Material
import { SelectionModel } from '@angular/cdk/collections';
// RXJS
import { fromEvent, merge, BehaviorSubject, ReplaySubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { NhanHoSoOnlineModel } from '../Model/nhan-ho-so-online.model';
import { NhanHoSoOnlineService } from '../Services/nhan-ho-so-online.service';
import { RecaptchaComponent } from 'ng-recaptcha';
import { DanhMucChungService } from 'src/app/_metronic/core/services/danhmuc.service';
import { LayoutUtilsService, MessageType } from '../../crud/utils/layout-utils.service';


@Component({
	selector: 'm-nhan-ho-so-online-edit',
	templateUrl: './nhan-ho-so-online-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})

export class NhanHoSoOnlineEditComponent implements OnInit {
	//Form
	itemForm: FormGroup;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loadingControl = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	hasFormErrors: boolean = false;
	item: NhanHoSoOnlineModel;
	oldItem: NhanHoSoOnlineModel;
	selectedTab: number = 0;
	luu: boolean = true;
	capnhat: boolean = false;
	loadingAfterSubmit: boolean = false;
	// Selection
	selection = new SelectionModel<NhanHoSoOnlineModel>(true, []);
	productsResult: NhanHoSoOnlineModel[] = [];
	productsResult1: NhanHoSoOnlineModel[] = [];
	viewLoading: boolean = false;
	//--------hình ảnh--------------
	indexItem: number;
	ObjImage: any = { h1: "", h2: "" };
	Image: NhanHoSoOnlineModel;
	Image1: NhanHoSoOnlineModel;
	isShowINFO: boolean = false;
	isShowSEO: boolean = false;
	TenFile: string = '';

	listNoiSinh: any[] = [];
	listNoiCapCMND: any[] = [];
	listBangCap: any[] = [];
	listDiaChi: any[] = [];
	listSchool: any[] = [];


	disabledBtn: boolean = false;
	showTrinhDo: boolean = false;
	mindate: Date;
	ageDefaule: string = '';

	ID_KH: string = '';
	ID_KenhTD: string = '';
	ID_Vacancy: string = '';

	@ViewChild('myInput') myInputVariable: ElementRef;

	recapcha: string = '';

	@ViewChild('captchaElem') captchaElem: RecaptchaComponent;
	noidung: string = '';

	public bankSchool: FormControl = new FormControl();
	public filteredBankShool: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

	ShowBTLuu: boolean = false;

	constructor(private NhanHoSoOnlineService: NhanHoSoOnlineService,
		private danhMucService: DanhMucChungService,
		public datepipe: DatePipe,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private changeDetectorRefs: ChangeDetectorRef,
		private itemFB: FormBuilder,
		private activatedRoute: ActivatedRoute,
	) { }

	/** LOAD DATA */
	ngOnInit() {
		this.activatedRoute.params.subscribe(params => {
			this.ID_KH = params.idkh;
			this.ID_KenhTD = params.id;
			this.ID_Vacancy = params.id_vc;

			this.reset();
			var cur = new Date();
			this.mindate = cur;
			this.NhanHoSoOnlineService.GetListProvincesByVacancyID(this.ID_Vacancy,this.ID_KH).subscribe(res => {
				if (res && res.data.length > 0) {
					this.listNoiSinh = res.data;
					this.listNoiCapCMND = res.data;
					this.listDiaChi = res.data;
				} else {
					this.listNoiSinh = [];
					this.listNoiCapCMND = [];
					this.listDiaChi = [];
				}
				this.changeDetectorRefs.detectChanges();
			})

			this.NhanHoSoOnlineService.GetListDegreeByVacancyID(this.ID_Vacancy,this.ID_KH).subscribe(res => {
				if (res && res.data.length > 0) {
					this.listBangCap = res.data;
				} else {
					this.listBangCap = [];
				}
				this.changeDetectorRefs.detectChanges();
			})

			this.NhanHoSoOnlineService.GetListSchoolByVacancyID(this.ID_Vacancy,this.ID_KH).subscribe(res => {
				if (res && res.data.length > 0) {
					this.listSchool = res.data;
					this.setUpDropSearchSchool();
				} else {
					this.listSchool = [];
				}
				this.changeDetectorRefs.detectChanges();
			})

			this.NhanHoSoOnlineService.GetContentVacancyID(this.ID_Vacancy,this.ID_KH).subscribe(res => {
				if (res && res.status == 1) {
					this.ShowBTLuu = true;
					if (res.data[0].Gen_Requirements != null && res.data[0].Gen_Requirements != "") {
						this.noidung = res.data[0].Gen_Requirements;
					} else {
						this.noidung = "";
					}
				} else {
					this.ShowBTLuu = false;
					this.noidung = '';
					this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
				}
				this.changeDetectorRefs.detectChanges();
			})
		});
		this.createForm();
	}

	//---------------------------------------------------------



	createForm() {
		this.itemForm = this.itemFB.group({
			hoTen: [this.item.fullName, [Validators.required]],
			gioiTinh: [this.item.gender, [Validators.required]],
			ngaySinh: [this.item.DOB, [Validators.required]],// [Validators.pattern(/^((((0[1-9])|([1-2][0-9])|(3[0])|([1-9]))(\/)(4|04|6|06|9|09|11)(\/)([1-2]\d{3})))|((((0[1-9])|([1-2][0-9])|(3[0-1])|([1-9]))(\/)(1|3|5|7|8|10|12|01|03|05|07|08)(\/)([1-2]\d{3})))|((((0[1-9])|([1-2][0-9])|([1-9]))(\/)(2|02)(\/)([1-2]\d{3})))$|^[0-9]{4}$/)
			noiSinh: [this.item.POBId, [Validators.required]],
			cmnd: [this.item.ID, [Validators.pattern(/^[0-9]{9}$|^[0-9]{12}$/), Validators.required]],
			ngayCapCMND: [this.item.issuedDate, [Validators.required]],
			noiCapCMND: [this.item.issuedPlaceId, [Validators.required]],
			Province: ['', [Validators.required]],
			sonha: [this.item.permanentAddress, [Validators.required]],
			email: [this.item.email, [Validators.required, Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)]],
			diaChiTamTru: [this.item.currentAddress, [Validators.required]],
			diDong: [this.item.phone, [Validators.required, Validators.pattern(/^[0-9]{10}$|^[0-9]{11}$/)]],
			mucLuong: [this.item.salary, [Validators.required]],
			thoiGianDiLam: [this.item.workDate, [Validators.required]],
			trinhDoHV: [this.item.Train_Level, [Validators.required]],

			namTN: [this.item.graduationYear, [Validators.required, Validators.pattern(/^[1-9]\d{3}$/)]],
			truongTN: [this.item.school, [Validators.required]],
			nganhHoc: [this.item.major, [Validators.required]],
			chuyenMon: [this.item.specialize, [Validators.required]],
			recentJob: [''],
		});
		this.itemForm.controls["hoTen"].markAsTouched();
		this.itemForm.controls["gioiTinh"].markAsTouched();
		this.itemForm.controls["ngaySinh"].markAsTouched();
		this.itemForm.controls["noiSinh"].markAsTouched();
		this.itemForm.controls["cmnd"].markAsTouched();
		this.itemForm.controls["ngayCapCMND"].markAsTouched();
		this.itemForm.controls["noiCapCMND"].markAsTouched();
		this.itemForm.controls["diaChiTamTru"].markAsTouched();
		this.itemForm.controls["Province"].markAsTouched();
		this.itemForm.controls["sonha"].markAsTouched();
		this.itemForm.controls["email"].markAsTouched();
		this.itemForm.controls["diDong"].markAsTouched();
		this.itemForm.controls["ngayCapCMND"].markAsTouched();
		this.itemForm.controls["mucLuong"].markAsTouched();
		this.itemForm.controls["thoiGianDiLam"].markAsTouched();
		this.itemForm.controls["trinhDoHV"].markAsTouched();

		this.itemForm.controls["namTN"].markAsTouched();
		this.itemForm.controls["truongTN"].markAsTouched();
		this.itemForm.controls["nganhHoc"].markAsTouched();
		this.itemForm.controls["chuyenMon"].markAsTouched();
	}

	reset() {
		this.item = Object.assign({}, this.oldItem);
		this.createForm();
		this.hasFormErrors = false;
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

	onSubmit(withBack: boolean = false) {
		this.hasFormErrors = false;
		const controls = this.itemForm.controls;
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			this.selectedTab = 0;
			return;
		}
		let updatedonvi = this.Prepareleave();
		this.AddItem(updatedonvi, withBack);
	}

	Prepareleave(): NhanHoSoOnlineModel {
		const controls = this.itemForm.controls;
		const wh = new NhanHoSoOnlineModel();
		wh.vacancyId = this.ID_Vacancy;
		wh.infoSourcesId = +this.ID_KenhTD;
		wh.customerID = +this.ID_KH;

		wh.fullName = controls['hoTen'].value;
		wh.gender = controls['gioiTinh'].value;
		wh.DOB = this.danhMucService.f_convertDate(controls['ngaySinh'].value);
		wh.POB = controls['noiSinh'].value;
		wh.ID = controls['cmnd'].value;
		wh.issuedDate = this.danhMucService.f_convertDate(controls['ngayCapCMND'].value);
		wh.issuedPlaceId = controls['noiCapCMND'].value;
		wh.ID_Phuong = controls['Province'].value;
		wh.permanentAddress = controls['sonha'].value;
		wh.email = controls['email'].value;
		wh.currentAddress = controls['diaChiTamTru'].value;
		wh.phone = controls['diDong'].value;
		wh.salary = this.f_number(controls['mucLuong'].value);
		wh.workDate = controls['thoiGianDiLam'].value;
		wh.Train_Level = controls['trinhDoHV'].value;

		if (this.showTrinhDo == true) {
			wh.graduationYear = controls['namTN'].value;
			wh.school = controls['truongTN'].value;
			wh.major = controls['nganhHoc'].value;
			wh.specialize = controls['chuyenMon'].value;
		}
		wh.GCCode = this.recapcha;
		if (this.Image != undefined && this.Image.strBase64 != "") {
			wh.File = this.Image.strBase64;
			wh.FileName = this.TenFile;
		}
		wh.LangCode = 'vi';
		wh.recentJob = controls['recentJob'].value;
		return wh;
	}
	AddItem(item: NhanHoSoOnlineModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.disabledBtn = true;
		this.NhanHoSoOnlineService.CreateItem(item).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.resetFile();
				this.ngOnInit();
				this.captchaElem.reset();
				const _messageType = this.translate.instant('nhanhoso.nophosothanhcong');
				this.layoutUtilsService.showActionNotification(_messageType, MessageType.Create, 4000, true, false);
			}
			else {
				this.viewLoading = false;
				this.disabledBtn = false;
				this.captchaElem.reset();
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 10000, true, false, 3000, 'top', 0);
			}
		});
	}
	//==============Xử lý file============================
	selectFile(index: number) {
		this.indexItem = index;
		let f = document.getElementById("imgInpdd" + index);
		f.click();
	}

	FileSelected(evt: any) {//Bổ sung loading chọn file
		if (evt.target.files && evt.target.files.length) {//Nếu có file
			let file = evt.target.files[0]; // Ví dụ chỉ lấy file đầu tiên
			let size = file.size;
			if (size >= 3145728) {
				this.resetFile();
				const message = `Không thể upload file dung lượng lớn hơn 3MB.`;
				this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
				return;
			}
			this.TenFile = file.name;
			let reader = new FileReader();
			reader.readAsDataURL(evt.target.files[0]);

			let base64Str;
			this.disabledBtn = true;
			setTimeout(() => {
				base64Str = reader.result as String;
				var metaIdx = base64Str.indexOf(';base64,');
				base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
				this.ObjImage.h1 = base64Str;
				this.disabledBtn = false;
			}, 1000);

			var hinhanh = new NhanHoSoOnlineModel();
			setInterval(() => {
				let v;
				v = this.ObjImage.h1

				if (v) {
					if (v != "") {
						hinhanh.strBase64 = v;
						this.ObjImage.h1 = ""
					}
					if (hinhanh.strBase64 != "") {
						this.Image = hinhanh;
						if (this.Image.strBase64 != '') { this.isShowINFO = true; }
					}
					this.changeDetectorRefs.detectChanges();
				}
			}, 100);
		}
		else {
			this.resetFile();
		}
	}
	loadImage(reader: any) {
		let base64Str;
		base64Str = reader.result as String;
		var metaIdx = base64Str.indexOf(';base64,');
		base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64

		return {
			vSRC: "data:image/png;base64," + base64Str,
			base64Str: base64Str
		}
	}

	//===================================================
	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
			this.onSubmit(false);
		}
	}

	resetFile() {
		this.myInputVariable.nativeElement.value = "";
		if (this.Image != undefined) {
			this.Image.strBase64 = "";
		}
	}

	resolved(captchaResponse: string) {
		this.recapcha = captchaResponse;
	}

	//=============Kiểm tra tuổi thêm cán bộ===============
	// CheckAge() {
	// 	let year = new Date();
	// 	let tuoi = 0;
	// 	const controls = this.itemForm.controls;
	// 	if (controls["ngaySinh"].status == "VALID") {
	// 		if (controls['ngaySinh'].value.split("/").length == 3) {
	// 			tuoi = +year.getFullYear() - (+controls['ngaySinh'].value.split("/")[2]);
	// 			if (tuoi < +this.ageDefaule) {
	// 				let message = 'Nhân viên không đủ tuổi tham gia vào công ty';
	// 				this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
	// 				this.itemForm.controls['ngaySinh'].setValue("");
	// 				this.changeDetectorRefs.detectChanges();
	// 			}
	// 		}
	// 		else {
	// 			tuoi = +year.getFullYear() - (+controls['ngaySinh'].value);
	// 			if (tuoi < +this.ageDefaule) {
	// 				let message = 'Nhân viên không đủ tuổi tham gia vào công ty';
	// 				this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
	// 				this.itemForm.controls['ngaySinh'].setValue("");
	// 				this.changeDetectorRefs.detectChanges();
	// 			}
	// 		}
	// 	}

	// }
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
	//===========================Các hàm change========================
	trinhDoChange(val: any) {
		let obj = this.listBangCap.find(x => x.ID_Row === +val);
		if (obj.Range > 3) {
			this.showTrinhDo = true;
			this.itemForm.controls["namTN"].setValue("");
			this.itemForm.controls["truongTN"].setValue("");
			this.itemForm.controls["nganhHoc"].setValue("");
			this.itemForm.controls["chuyenMon"].setValue("");
		} else {
			this.showTrinhDo = false;
			this.itemForm.controls["namTN"].setValue("1000");
			this.itemForm.controls["truongTN"].setValue(" ");
			this.itemForm.controls["nganhHoc"].setValue(" ");
			this.itemForm.controls["chuyenMon"].setValue(" ");
		}
		this.changeDetectorRefs.detectChanges();
	}
	//================================Xet dropdown search Type===============================
	setUpDropSearchSchool() {
		this.bankSchool.setValue('');
		this.filteredBanksShool();
		this.bankSchool.valueChanges
			.pipe()
			.subscribe(() => {
				this.filteredBanksShool();
			});
	}

	protected filteredBanksShool() {
		if (!this.listSchool) {
			return;
		}
		// get the search keyword
		let search = this.bankSchool.value;
		if (!search) {
			this.filteredBankShool.next(this.listSchool.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		// filter the banks
		this.filteredBankShool.next(
			this.listSchool.filter(bank => bank.Title.toLowerCase().indexOf(search) > -1)
		);
	}
	//=====================================================================================
}
