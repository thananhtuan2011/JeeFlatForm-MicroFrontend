import { Component, OnInit, Inject, ChangeDetectionStrategy, HostListener, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import * as _moment from 'moment';
import { Observable, ReplaySubject } from 'rxjs';
import { CalendarService } from '../services/tasks.service';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { LeavePersonalModel, OvertimeRegistrationModel, UserInfoModel } from '../Model/calendar.model';
import { LeavePersonalService } from '../services/dang-ky-phep-ca-nhan.service';
import { OvertimeRegistrationService } from '../services/Overtime-registration.service';
import { DanhMucChungService } from '../../../services/danhmuc.service';
import { LayoutUtilsService, MessageType } from 'projects/jeehr/src/modules/crud/utils/layout-utils.service';
// import { MyProjectsService } from '../services/my-projects.service';

const moment = _moment;

@Component({
	selector: 'm-dang-ky-dialog',
	templateUrl: './dang-ky.dialog.component.html',
})
export class DangKyDialogComponent implements OnInit {
	// item: any;
	// oldItem: any;
	// itemForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	types: any[] = [];
	@ViewChild("focusInput", { static: true }) focusInput: ElementRef;
	@ViewChild(MatDatepicker, { static: true }) picker;
	date = new FormControl();
	disabledBtn: boolean = false;
	disabledBtnPhep: boolean = false;
	disabledBtnTC: boolean = false;
	selectedTab: number = 0;
	changeTab: boolean = false;
	showTabNP: boolean = false;
	showTabTC: boolean = false;
	showTabCT: boolean = false;
	showTabTask: boolean = false;

	Status: string = '';

	//============================Phép===============================
	itemPhep: LeavePersonalModel;
	oldItemPhep: LeavePersonalModel;
	itemFormPhep: FormGroup;
	listGioNghi: Observable<any[]>;
	isNewGN: Observable<boolean>;
	listDenGio: Observable<any[]>;
	isNewDG: Observable<boolean>;

	ngaynghi: string;
	denngay: string;
	gionghi: string = '';
	dengio: string = '';
	hinhthuc: string = '';
	buoi1: string = '';
	buoi2: string = '';

	NguoiDuyet: string = '';
	disableBt: boolean = true;
	showButton: boolean = true;
	showGio: boolean = true;
	GioNghi: any[] = [];
	DenGio: any[] = [];
	DSPhep: any[] = [];
	listHinhThuc: any[] = [];

	ngayBatDauNghiToiThieu: Date = new Date();
	cauhinhToiThieuNgayNghi: any = 4; // ngày do api trả về
	SoNgay: string = '0';
	ShowText: boolean = false;
	//====================Dropdown search============================
	//====================Hình thức====================
	public bankFilterCtrl: FormControl = new FormControl();
	public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	//====================Từ Giờ====================
	public bankTuGio: FormControl = new FormControl();
	public filteredBanksTuGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	//====================Đến giờ====================
	public bankDenGio: FormControl = new FormControl();
	public filteredBanksDenGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

	//============================Tăng ca==============================
	itemTangCa: any;
	oldItemTangCa: any;
	itemFormTC: FormGroup;
	listGioNghiTC: Observable<any[]>;
	isNewGNTC: Observable<boolean>;
	listDenGioTC: Observable<any[]>;
	isNewDGTC: Observable<boolean>;
	GioNghiTC: any[] = [];
	DenGioTC: any[] = [];

	listproject: any[] = [];
	NgayTangCa: string;
	GioBatDau: string = '';
	GioKetThuc: string = '';

	NguoiDuyetTC: string = '';
	disableBtTC: boolean = true;
	isSaiGio: boolean = true;
	SoGio: string = '';
	minDate: Date;
	//=========================Task================================
	itemTask: any;
	oldItemTask: any;
	itemFormTask: FormGroup;

	//=======================bổ sung chức năng cho shipper
	ShowShipper: boolean = false;
	//=======================bổ sung chức năng cho viên chức
	ShowVienChuc: boolean = false;
	//======================================================
	CustemerID: number = 0;
	isgov: boolean = false;
	//Sử dụng cho tab Công việc=================================================
	roleassign: boolean = true;//Quyền người thực hiện
	rolefollower: boolean = true;//Quyền người theo dõi
	roleprioritize: boolean = true;//Quyền độ ưu tiên
	roledeadline: boolean = true;// Quyền thời hạn làm việc
	loadTags = false;

	UserID = 0;

	labelDuAn: string = "";
	idDuAn: string = "";
	listDuAn: any[] = [];

	Assign: any = [];
	id_nv_selected = 0
	Followers: any = [];
	options_assign: any = [];
	priority = 0;
	title: string = '';

	selectedDate: any = {
		startDate: '',
		endDate: '',
	};

	list_role: any[] = [];
	IsAdminGroup = false;

	list_priority: any[] = [];

	// load task
	list_Tag: any = [];
	project_team: any = "";

	tinyMCE = {};
	description_tiny: string;

	type: string = ""//nếu là việc dự án (type = 4) thì chọn dự án truyền từ trang list

	AssignGOV: any = [];

	//================================================================================================
	constructor(public dialogRef: MatDialogRef<DangKyDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public danhMucChungService: DanhMucChungService,
		private changeDetectorRefs: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private itemFBPhep: FormBuilder,
		private itemFBTangCa: FormBuilder,
		private itemFBTask: FormBuilder,
		private leavePersonalService: LeavePersonalService,
		public calendarService: CalendarService,
		private _overtimeRegistrationService: OvertimeRegistrationService,
		public dialog: MatDialog,
		// public congViecTheoDuAnService: CongViecTheoDuAnService,
		// private menuServices: MenuPhanQuyenServices,
		// private weworkService: WeWorkService,

	) {
	}

	/** LOAD DATA */
	//_hinhthuc: 0: Thêm mới. 1:Chỉnh sửa
	ngOnInit() {
		if (this.data._hinhthuc == '0') {
			this.ShowShipper = this.data._isshipper;
			this.ShowVienChuc = this.data._isvienChuc;
			this.CustemerID = this.data._CustemerID;
			this.isgov = this.data._isgov;
			this.XuLyDuLieuAdd(this.data._item);
			this.createForm();
			if (this.ShowShipper || this.ShowVienChuc) {
				this.itemFormPhep.controls['gioNghi'].setValue('00:00');
				this.itemFormPhep.controls['denGio'].setValue('00:00');
			} else {
				this.itemFormPhep.controls['buoi1'].setValue('AM');
				this.itemFormPhep.controls['buoi2'].setValue('AM');
			}
			for (let i = 0; i < this.data._loailich.length; i++) {
				if (this.data._loailich[i].checked == true) {
					if (this.data._loailich[i].Id == 11 || this.data._loailich[i].Id == 12) {
						this.showTabNP = true;
					}
					if (this.data._loailich[i].Id == 2) {
						this.showTabTC = true;
					}
					if (this.data._loailich[i].Id == 3) {
						this.showTabCT = true;
					}
					if (this.data._loailich[i].Id == 41) {
						this.showTabTask = true;
					}
				}
			}
			if (this.showTabNP == true) {
				this.selectedTab = 0;
				this.danhMucChungService.GetListTypeLeaveByTitle().subscribe(res => {
					this.listHinhThuc = res.data;
					this.setUpDropSearchHinhThuc();
					this.itemFormPhep.controls['hinhThuc'].setValue('');
					this.changeDetectorRefs.detectChanges();
				});

			} else if (this.showTabTC == true) {
				this.selectedTab = 1;
				this._overtimeRegistrationService.getTenNguoiDuyet().subscribe(res => {
					this.NguoiDuyetTC = res.NguoiDuyet;
					if (this.NguoiDuyetTC != "" && this.NguoiDuyetTC != undefined) {
						this.disableBtTC = false;
					}
					else {
						this.disableBtTC = true;
					}
				})
				this.TinhSoGioOTCanCuVaoGioOT();
				setTimeout(function () { document.getElementById('ngaytangca').focus(); }, 100);

			} else if (this.showTabCT == true) {

			} else {
				this.selectedTab = 2;
			}
			//Thêm mới phép - tăng ca
			var minCurrentDate = new Date();
			this.minDate = minCurrentDate;
			this.showButton = true;
			this.danhMucChungService.getAllGio('').subscribe(res => {
				this.GioNghi = res.data;
				this.DenGio = res.data;
				if (this.itemPhep.GioBatDau != "") {
					this.itemFormPhep.controls["gioNghi"].setValue('' + this.itemPhep.GioBatDau);
				}

				if (this.itemPhep.GioKetThuc != "") {
					this.itemFormPhep.controls["denGio"].setValue('' + this.itemPhep.GioKetThuc);
				}

				this.GioNghiTC = res.data;
				if (this.itemTangCa.GioBatDau != "") {
					this.itemFormTC.controls["tugio"].setValue('' + this.itemTangCa.GioBatDau);
				}

				this.DenGioTC = res.data;
				if (this.data._type != "dayGridMonth") {
					this.itemFormTC.controls["dengio"].setValue('' + this.itemTangCa.GioKetThuc);
				}

				this.setUpDropSearchTuGio();
				this.setUpDropSearchDenGio()
				this.changeDetectorRefs.detectChanges();
			});
		} else {
			this.ShowShipper = this.data._isshipper;
			this.ShowVienChuc = this.data._isvienChuc;
			this.CustemerID = this.data._CustemerID;
			this.isgov = this.data._isgov;
			this.XuLyDuLieuUpdate(this.data._item);
			this.Status = this.data._item.extendedProps.statusid;
			if (this.data._loailich == "1") {
				this.showTabNP = true;
				this.showTabTC = false;
				this.showTabCT = false;
				this.showTabTask = false;
				this.selectedTab = 0;

				if (this.itemPhep.ID_Row > 0) {
					this.showButton = false;
					this.showGio = false;
					this.oldItemPhep = Object.assign({}, this.itemPhep);
					this.danhMucChungService.GetListTypeLeaveByTitle().subscribe(res => {
						this.listHinhThuc = res.data;
						this.setUpDropSearchHinhThuc();
						this.CheckDuLich(this.itemPhep.ID_HinhThuc);
						this.changeDetectorRefs.detectChanges();
					});
					this.createFormPhep();
				}
			} else if (this.data._loailich == "2") {
				this.showTabTC = true;
				this.showTabNP = false;
				this.showTabCT = false;
				this.showTabTask = false;
				this.selectedTab = 1;

				this.showButton = false;
				this.showGio = false;
				this.oldItemTangCa = Object.assign({}, this.itemTangCa);
				this.createFormTangCa();
			} else if (this.data._loailich == "3") {

			} else {
				this.showTabTask = true;
				this.showTabCT = false;
				this.showTabNP = false;
				this.showTabTC = false;
				this.selectedTab = 2;
				this.showButton = false;
			}
		}
		//=====================================Phép===================================
		this.leavePersonalService.getDSPhep().subscribe(res => {
			this.DSPhep = res.data;
		});
		//====================================Sử dụng cho Công việc====================
		// this.UserID = this.authService.getUserId();
		// this.tinyMCE = tinyMCE;
		// if (this.isgov) {
		// 	this.LoadDataDuAnGOV();
		// } else {
		// 	this.LoadDataDuAn();
		// }
		// setTimeout(() => {
		// 	this.ResetData();
		// }, 1000);
		// this.list_priority = this.weworkService.list_priority;
	}
	//=================================================================================================================================
	goBack() {
		this.dialogRef.close();
	}
	getTieuDeButton() {
		let name = "";
		if (this.NguoiDuyet != "") {
			name = this.translate.instant('phepcanhan.guicho') + " " + this.NguoiDuyet + " " + this.translate.instant('phepcanhan.duyet');
		}
		else {
			name = this.translate.instant('phepcanhan.khongtimthaynguoi') + " " + this.translate.instant('phepcanhan.duyet');
		}
		return name;
	}
	//=======================Tăng ca======================
	TenNguoiDuyet() {
		let name = "";
		if (this.NguoiDuyetTC != "" && this.NguoiDuyetTC != undefined) {
			name = this.translate.instant('landingpagekey.gui') + " " + this.NguoiDuyetTC + " " + this.translate.instant('landingpagekey.duyet');
		}
		else {
			name = this.translate.instant('landingpagekey.khongtimthaynguoiduyet');
		}
		return name;
	}
	//-----------------------------------------------
	onLinkClick(v: any, eventTab: MatTabChangeEvent) {
		if (eventTab.index == 0) {
			this.selectedTab = 0;
		} else if (eventTab.index == 1) {
			this.selectedTab = 1;
			this._overtimeRegistrationService.getTenNguoiDuyet().subscribe(res => {
				this.NguoiDuyetTC = res.NguoiDuyet;
				if (this.NguoiDuyetTC != "") {
					this.disableBtTC = false;
				}
				else {
					this.disableBtTC = true;
				}
			})
			this.TinhSoGioOTCanCuVaoGioOT();
		} else if (eventTab.index == 2) {
			this.ResetData();
			this.selectedTab = 2;
		} else {
		}
	}
	XuLyDuLieuAdd(val: any) {
		let tmp_phep = Object.assign({}, this.itemPhep);
		tmp_phep.NgayBatDau = this.f_convertDate(val.start);
		tmp_phep.NgayKetThuc = this.f_convertDate(val.end);
		tmp_phep.GioBatDau = this.data._type == "dayGridMonth" ? val.extendedProps.tugio : this.f_convertHour(val.start);
		tmp_phep.GioKetThuc = this.data._type == "dayGridMonth" ? val.extendedProps.dengio : this.f_convertHour(val.end);
		tmp_phep.ID_HinhThuc = '' + val.extendedProps.formid;
		tmp_phep.ID_Row = val.extendedProps.requestid;
		tmp_phep.GhiChu = val.extendedProps.reason;
		tmp_phep.SoNgay = val.extendedProps.numberofdays;
		this.itemPhep = tmp_phep;

		let tmp_tangca = Object.assign({}, this.itemTangCa);
		tmp_tangca.NgayTangCa = this.f_convertDate(val.start);
		tmp_tangca.GioBatDau = this.data._type == "dayGridMonth" ? val.extendedProps.tugiotc : this.f_convertHour(val.start);
		tmp_tangca.GioKetThuc = this.f_convertHour(val.end);
		tmp_tangca.SoGio = val.extendedProps.numberofdays;
		tmp_tangca.LyDo = val.extendedProps.reason;
		this.itemTangCa = tmp_tangca;

		let tmp_task = Object.assign({}, this.itemTask);
		tmp_task.RowID = val.extendedProps.requestid;
		tmp_task.Start = this.f_convertDate(val.start);
		tmp_task.deadline = this.f_convertDate(val.end);
		tmp_task.Start_Time = this.f_convertHour(val.start);
		tmp_task.AllDay = val.allDay;
		tmp_task.Title = val.title;
		tmp_task.Loai = '';
		this.itemTask = tmp_task;

	}
	XuLyDuLieuUpdate(val: any) {
		if (this.data._loailich == '1') {
			let tmp_phep = Object.assign({}, this.itemPhep);
			tmp_phep.NgayBatDau = this.f_convertDate(val.start);
			tmp_phep.NgayKetThuc = this.f_convertDate(val.end);
			tmp_phep.GioBatDau = this.f_convertHour(val.start);
			tmp_phep.GioKetThuc = this.f_convertHour(val.end);
			tmp_phep.ID_HinhThuc = '' + val.extendedProps.formid;
			tmp_phep.ID_Row = val.extendedProps.requestid;
			tmp_phep.GhiChu = val.extendedProps.reason;
			tmp_phep.SoNgay = val.extendedProps.numberofdays;
			tmp_phep.IsNghiDiDuLich = val.extendedProps.IsNghiDiDuLich;
			tmp_phep.DiaDiem = val.extendedProps.DiaDiem;
			this.itemPhep = tmp_phep;
		} else if (this.data._loailich == '2') {
			let tmp_tangca = Object.assign({}, this.itemTangCa);
			tmp_tangca.NgayTangCa = this.f_convertDate(val.start);
			tmp_tangca.GioBatDau = this.f_convertHour(val.start);
			tmp_tangca.GioKetThuc = this.f_convertHour(val.end);
			tmp_tangca.SoGio = val.extendedProps.numberofdays;
			tmp_tangca.LyDo = val.extendedProps.reason;
			// tmp_tangca.id_duan = val.extendedProps.projectid;
			tmp_tangca.OverTime = val.extendedProps.overtime;
			tmp_tangca.IsFixHours = val.extendedProps.isfixhours;
			this.itemTangCa = tmp_tangca;
		} else if (this.data._loailich == '3') {

		} else {
			let tmp_task = Object.assign({}, this.itemTask);
			tmp_task.Start = this.f_convertDate(val.start);
			tmp_task.Start_Time = this.f_convertHour(val.start);
			tmp_task.Loai = val.extendedProps.taskType;
			tmp_task.AllDay = val.allDay;
			tmp_task.Detail = val.extendedProps.detail;
			tmp_task.RowID = val.id;
			tmp_task.Sort = val.extendedProps.sort;
			tmp_task.Title = val.title;
			this.itemTask = tmp_task;
		}
	}
	f_convertDate(v: any) {
		if (v != "" && v != null) {
			let a = new Date(v);
			return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
		}
	}
	f_convertHour(v: any) {
		if (v != "" && v != null) {
			let a = new Date(v);
			return ("0" + (a.getHours())).slice(-2) + ":" + ("0" + (a.getMinutes())).slice(-2);
		}
	}
	f_number(value: any) {
		return Number((value + '').replace(/,/g, ""));
	}

	f_currency(value: any, args?: any): any {
		let nbr = Number((value + '').replace(/,|-/g, ""));
		return (nbr + '').replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
	}
	//=============================Lưu dữ liệu====================================
	onSumbit(withBack: boolean = false, type: string) {
		this.hasFormErrors = false;
		const controls = this.itemFormPhep.controls;
		/** check form */
		if (type == '0') {
			if (this.CustemerID != 1219) {
				this.itemFormPhep.controls["diadiem"].clearValidators();
				this.itemFormPhep.controls["diadiem"].updateValueAndValidity();
			}
			if (this.itemFormPhep.invalid) {
				Object.keys(controls).forEach(controlName =>
					controls[controlName].markAsTouched()
				);

				this.hasFormErrors = true;
				this.selectedTab = 0
				return;
			}
			let updatedonvi = this.Prepareleave();
			if (this.ShowShipper) {
				this.AddItemShipper(updatedonvi, withBack);
			} else {
				if (this.ShowVienChuc) {
					this.AddItemCCVC(updatedonvi, withBack);
				} else {
					this.AddItem(updatedonvi, withBack);
				}
			}
		} else if (type == '1') {
			if (this.itemFormTC.invalid) {
				Object.keys(controls).forEach(controlName =>
					controls[controlName].markAsTouched()
				);

				this.hasFormErrors = true;
				this.selectedTab = 1
				return;
			}
			if (this.listChon.length > 0) {//Chọn công việc đăng ký tăng ca
				let _work = [];
				let _task = [];
				let _taskWork = [];
				this.listChon.map((item, index) => {
					if (item.type == 1) {
						_work.push(item);
					} else if (item.type == 2) {
						_task.push(item);
					} else {
						_taskWork.push(item);
					}
				})
				this.listWork = _work;
				this.listTask = _task;
				this.listTaskWork = _taskWork;
			}
			let updatedonvi = this.PrepareleaveTC();
			this.AddItemTC(updatedonvi, withBack);
		} else {

		}

	}
	//===============================================Đăng ký phép cá nhân=====================================================
	createForm() {
		//Dùng cho phần phép
		this.itemFormPhep = this.itemFBPhep.group({
			ngayBatDauNghi: [this.itemPhep.NgayBatDau, [Validators.required]],
			denNgay: [this.itemPhep.NgayKetThuc, [Validators.required]],
			soNgay: [this.itemPhep.SoNgay],
			ghiChu: [this.itemPhep.GhiChu, Validators.required],
			hinhThuc: ['' + this.itemPhep.ID_HinhThuc, Validators.required],
			gioNghi: ['', Validators.required],
			denGio: ['', Validators.required],
			//====Dùng cho shipper
			buoi1: [this.itemPhep.Buoi_NgayNghi, Validators.required],
			buoi2: [this.itemPhep.Buoi_NgayVaoLam, Validators.required],
			nghididulich: [this.itemPhep.IsNghiDiDuLich],
			diadiem: [this.itemPhep.DiaDiem, Validators.required],
		});
		this.itemFormPhep.controls["ngayBatDauNghi"].markAsTouched();
		this.itemFormPhep.controls["denNgay"].markAsTouched();
		this.itemFormPhep.controls["hinhThuc"].markAsTouched();
		this.itemFormPhep.controls["gioNghi"].markAsTouched();
		this.itemFormPhep.controls["denGio"].markAsTouched();
		this.itemFormPhep.controls["ghiChu"].markAsTouched();
		this.itemFormPhep.controls["buoi1"].markAsTouched();
		this.itemFormPhep.controls["buoi2"].markAsTouched();
		this.itemFormPhep.controls["diadiem"].markAsTouched();
		if (this.itemPhep.ID_Row > 0) {
			this.itemFormPhep.controls["ngayBatDauNghi"].disable();
			this.itemFormPhep.controls["denNgay"].disable();
			this.itemFormPhep.controls["hinhThuc"].disable();
			this.itemFormPhep.controls["gioNghi"].disable();
			this.itemFormPhep.controls["denGio"].disable();
		}


		//===============Dùng cho phần tăng ca
		this.itemFormTC = this.itemFBTangCa.group({
			NgayTangCa: [this.itemTangCa.NgayTangCa, [Validators.required]],
			Hours: [this.itemTangCa.SoGio, Validators.required],
			ghiChu: [this.itemTangCa.LyDo, Validators.required],
			tugio: ['', Validators.required],
			dengio: ['', Validators.required],
			OverTime: [this.itemTangCa.OverTime],
			IsFixHours: [this.itemTangCa.IsFixHours],
		});
		this.itemFormTC.controls["NgayTangCa"].markAsTouched();
		this.itemFormTC.controls["tugio"].markAsTouched();
		this.itemFormTC.controls["dengio"].markAsTouched();
		this.itemFormTC.controls["ghiChu"].markAsTouched();

	}

	createFormPhep() {
		//Dùng cho phần phép
		this.itemFormPhep = this.itemFBPhep.group({
			ngayBatDauNghi: [this.itemPhep.NgayBatDau, [Validators.required]],
			denNgay: [this.itemPhep.NgayKetThuc, [Validators.required]],
			soNgay: [this.itemPhep.SoNgay],
			ghiChu: [this.itemPhep.GhiChu],
			hinhThuc: ['' + this.itemPhep.ID_HinhThuc, Validators.required],
			gioNghi: ['', Validators.required],
			denGio: ['', Validators.required],
			buoi1: ['', Validators.required],
			buoi2: ['', Validators.required],
			nghididulich: [this.itemPhep.IsNghiDiDuLich],
			diadiem: [this.itemPhep.DiaDiem, Validators.required],
		});
		this.itemFormPhep.controls["ngayBatDauNghi"].markAsTouched();
		this.itemFormPhep.controls["denNgay"].markAsTouched();
		this.itemFormPhep.controls["hinhThuc"].markAsTouched();
		this.itemFormPhep.controls["gioNghi"].markAsTouched();
		this.itemFormPhep.controls["denGio"].markAsTouched();
		this.itemFormPhep.controls["buoi1"].markAsTouched();
		this.itemFormPhep.controls["buoi2"].markAsTouched();
		this.itemFormPhep.controls["diadiem"].markAsTouched();
		if (this.itemPhep.ID_Row > 0) {
			this.itemFormPhep.controls["ngayBatDauNghi"].disable();
			this.itemFormPhep.controls["denNgay"].disable();
			this.itemFormPhep.controls["hinhThuc"].disable();
			this.itemFormPhep.controls["gioNghi"].disable();
			this.itemFormPhep.controls["denGio"].disable();
			this.itemFormPhep.controls["nghididulich"].disable();
			this.itemFormPhep.controls["diadiem"].disable();
		}
	}

	createFormTangCa() {
		//===============Dùng cho phần tăng ca
		this.itemFormTC = this.itemFBTangCa.group({
			NgayTangCa: [this.itemTangCa.NgayTangCa, [Validators.required]],
			Hours: [this.itemTangCa.SoGio, Validators.required],
			ghiChu: [this.itemTangCa.LyDo, Validators.required],
			tugio: ['', Validators.required],
			dengio: ['', Validators.required],
			// id_duan: [this.itemTangCa.id_duan],
			OverTime: [this.itemTangCa.OverTime],
			IsFixHours: [this.itemTangCa.IsFixHours],
		});
		this.itemFormTC.controls["NgayTangCa"].markAsTouched();
		this.itemFormTC.controls["tugio"].markAsTouched();
		this.itemFormTC.controls["dengio"].markAsTouched();
		this.itemFormTC.controls["ghiChu"].markAsTouched();
	}


	displayGioNghi(gn?: any): string | undefined {
		return gn ? gn.Gio : undefined;
	}
	displayDenGio(dg?: any): string | undefined {
		return dg ? dg.Gio : undefined;
	}

	ChangeHinhThuc(val: string) {
		this.ShowText = true;
		let obj = this.listHinhThuc.find(x => x.ID_type === +val);
		if (obj) {
			this.SoNgay = obj.SoNgay;
		}
		this.loadNgayNghi();
		this.CheckDuLich(val);
	}

	loadNgayNghi() {
		if (this.ShowShipper || this.ShowVienChuc) {
			const _product = new LeavePersonalModel();
			const controls = this.itemFormPhep.controls;
			this.ngaynghi = controls["ngayBatDauNghi"].value;
			this.denngay = controls["denNgay"].value;
			this.buoi1 = controls["buoi1"].value;
			this.buoi2 = controls["buoi2"].value;
			this.hinhthuc = controls["hinhThuc"].value;
			if (this.ngaynghi != undefined && this.denngay != undefined && this.buoi1 != undefined && this.buoi2 != undefined) {
				{
					if (this.ngaynghi != "" && this.denngay != "" && this.ngaynghi != "" && this.denngay != "") {
						_product.NgayBatDau = this.ngaynghi;
						_product.NgayKetThuc = this.denngay;
						_product.Buoi_NgayNghi = this.buoi1;
						_product.Buoi_NgayVaoLam = this.buoi2;
						_product.ID_HinhThuc = this.hinhthuc;
						if (this.ShowShipper) {
							this.tinhSoNgayShipper(_product, false);
						}
						if (this.ShowVienChuc) {
							this.tinhSoNgayCCVC(_product, false);
						}
					}
				}
			}
		} else {
			const _product = new LeavePersonalModel();
			const controls = this.itemFormPhep.controls;
			this.ngaynghi = controls["ngayBatDauNghi"].value;
			this.denngay = controls["denNgay"].value;
			this.gionghi = controls["gioNghi"].value;
			this.dengio = controls["denGio"].value;
			this.hinhthuc = controls["hinhThuc"].value;

			if (this.ngaynghi != undefined && this.denngay != undefined && this.gionghi != undefined && this.dengio != undefined && this.hinhthuc != undefined) {
				{
					if (this.ngaynghi != "" && this.denngay != "" && this.gionghi != "" && this.dengio != "" && this.hinhthuc != "") {
						_product.NgayBatDau = this.ngaynghi;
						_product.NgayKetThuc = this.denngay;
						_product.GioBatDau = this.gionghi;
						_product.GioKetThuc = this.dengio;
						_product.ID_HinhThuc = this.hinhthuc;
						this.tinhSoNgay(_product, false);
					}
				}
			}
		}
	}

	tinhSoNgayShipper(product: LeavePersonalModel, withBack: boolean = false) {
		// this.layoutUtilsService.showWaitingDiv();
		this.leavePersonalService.getSoNgayShipper(product).subscribe(res => {
			// this.layoutUtilsService.OffWaitingDiv();
			if (res && res.status === 1) {
				this.NguoiDuyet = res.NguoiDuyet;
				if (this.NguoiDuyet != "") {
					this.disableBt = false;
				}
				else {
					this.disableBt = true;
				}
				this.itemFormPhep.controls["soNgay"].setValue(res.SoNgay);
				this.changeDetectorRefs.detectChanges();
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	tinhSoNgay(product: LeavePersonalModel, withBack: boolean = false) {
		// this.layoutUtilsService.showWaitingDiv();
		this.leavePersonalService.getSoNgay(product).subscribe(res => {
			// this.layoutUtilsService.OffWaitingDiv();
			if (res && res.status === 1) {
				this.NguoiDuyet = res.NguoiDuyet;
				if (this.NguoiDuyet != "") {
					this.disableBt = false;
				}
				else {
					this.disableBt = true;
				}
				this.itemFormPhep.controls["soNgay"].setValue(res.SoNgay);
				this.changeDetectorRefs.detectChanges();
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	tinhSoNgayCCVC(product: any, withBack: boolean = false) {
		// this.layoutUtilsService.showWaitingDiv();
		// this.leavePersonalCBCCService.getSoNgay(product).subscribe(res => {
		// 	this.layoutUtilsService.OffWaitingDiv();
		// 	if (res && res.status === 1) {
		// 		this.NguoiDuyet = res.NguoiDuyet;
		// 		if (this.NguoiDuyet != "") {
		// 			this.disableBt = false;
		// 		}
		// 		else {
		// 			this.disableBt = true;
		// 		}
		// 		this.itemFormPhep.controls["soNgay"].setValue(res.SoNgay);
		// 		this.changeDetectorRefs.detectChanges();
		// 	}
		// 	else {
		// 		this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
		// 	}
		// });
	}



	Prepareleave(): LeavePersonalModel {
		const controls = this.itemFormPhep.controls;
		const bhxh = new LeavePersonalModel();
		bhxh.NgayBatDau = controls['ngayBatDauNghi'].value;
		bhxh.NgayKetThuc = controls['denNgay'].value;
		bhxh.GioBatDau = controls['gioNghi'].value;
		bhxh.GioKetThuc = controls['denGio'].value;
		bhxh.ID_HinhThuc = controls['hinhThuc'].value;
		let obj = this.listHinhThuc.find(x => +x.ID_type == +controls['hinhThuc'].value)
		bhxh.HinhThuc = obj.title;
		bhxh.GhiChu = controls['ghiChu'].value;
		bhxh.Buoi_NgayNghi = controls['buoi1'].value;
		bhxh.Buoi_NgayVaoLam = controls['buoi2'].value;
		bhxh.SoNgay = controls['soNgay'].value;
		bhxh.IsNghiDiDuLich = controls['nghididulich'].value;
		bhxh.DiaDiem = controls['diadiem'].value;
		return bhxh;
	}
	AddItem(item: LeavePersonalModel, withBack: boolean) {
		this.disabledBtnPhep = true;
		// this.layoutUtilsService.showWaitingDiv();
		this.leavePersonalService.GuiDonXinPhep(item).subscribe(res => {
			// this.layoutUtilsService.OffWaitingDiv();
			this.disabledBtnPhep = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.dialogRef.close({
					item
				});
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}
	AddItemShipper(item: LeavePersonalModel, withBack: boolean) {
		this.viewLoading = true;
		this.disabledBtnPhep = true;
		// this.layoutUtilsService.showWaitingDiv();
		this.leavePersonalService.GuiDonXinPhepShipper(item).subscribe(res => {
			// this.layoutUtilsService.OffWaitingDiv();
			this.disabledBtnPhep = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.dialogRef.close({
					item
				});
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	AddItemCCVC(item: any, withBack: boolean) {
		this.viewLoading = true;
		this.disabledBtnPhep = true;
		// this.leavePersonalCBCCService.GuiDonXinPhep(item).subscribe(res => {
		// 	this.disabledBtnPhep = false;
		// 	this.changeDetectorRefs.detectChanges();
		// 	if (res && res.status === 1) {
		// 		this.dialogRef.close({
		// 			item
		// 		});
		// 	}
		// 	else {
		// 		this.viewLoading = false;
		// 		this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
		// 	}
		// });
	}
	//============================================================================= 
	onUpdate(withBack: boolean = false, type: string) {
		this.hasFormErrors = false;
		const controls = this.itemFormPhep.controls;

		//================Clear require========================
		this.ClearRequired();
		//=====================================================

		if (this.itemFormPhep.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}


		let updatedonvi = this.PrepareleaveUpdate();
		this.UpdateItem(updatedonvi, withBack);
	}

	PrepareleaveUpdate(): LeavePersonalModel {
		const controls = this.itemFormPhep.controls;
		const phep = new LeavePersonalModel();
		phep.ID_Row = this.itemPhep.ID_Row;
		phep.GhiChu = controls['ghiChu'].value;
		return phep;
	}
	UpdateItem(item: LeavePersonalModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.leavePersonalService.UpdateDonXinPhep(item).subscribe(res => {
			if (res && res.status === 1) {
				this.dialogRef.close({
					item
				});
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	IsDuLich: boolean = false;
	IsDidDiem: boolean = false;

	CheckDuLich(val) {
		let obj = this.listHinhThuc.find(x => x.ID_type === +val);
		if (obj) {
			this.IsDuLich = obj.IsPhepNam;
		}
	}
	NghiDiDuLichChange(val: any) {
		if (val.checked) {
			this.IsDidDiem = true;
		}
		else {
			this.IsDidDiem = false;
		}
	}

	ClearRequired() {
		this.itemFormPhep.controls["ngayBatDauNghi"].clearValidators();
		this.itemFormPhep.controls["ngayBatDauNghi"].updateValueAndValidity();
		this.itemFormPhep.controls["denNgay"].clearValidators();
		this.itemFormPhep.controls["denNgay"].updateValueAndValidity();
		this.itemFormPhep.controls["hinhThuc"].clearValidators();
		this.itemFormPhep.controls["hinhThuc"].updateValueAndValidity();
		this.itemFormPhep.controls["buoi1"].clearValidators();
		this.itemFormPhep.controls["buoi1"].updateValueAndValidity();
		this.itemFormPhep.controls["buoi2"].clearValidators();
		this.itemFormPhep.controls["buoi2"].updateValueAndValidity();
		this.itemFormPhep.controls["diadiem"].clearValidators();
		this.itemFormPhep.controls["diadiem"].updateValueAndValidity();
		this.itemFormPhep.controls["gioNghi"].clearValidators();
		this.itemFormPhep.controls["gioNghi"].updateValueAndValidity();
		this.itemFormPhep.controls["denGio"].clearValidators();
		this.itemFormPhep.controls["denGio"].updateValueAndValidity();
	}

	//=================================================Dùng cho tăng ca==================================================================
	displayGioNghiTC(gn?: any): string | undefined {
		return gn ? gn.Gio : undefined;
	}
	displayDenGioTC(dg?: any): string | undefined {
		return dg ? dg.Gio : undefined;
	}

	GetSoGioTangCa(sogiotangca: OvertimeRegistrationModel, withBack: boolean = false) {
		// this.layoutUtilsService.showWaitingDiv();
		this._overtimeRegistrationService.Get_SoGioTangCa(sogiotangca).subscribe(res => {
			// this.layoutUtilsService.OffWaitingDiv();
			if (res && res.status === 1) {
				this.itemFormTC.controls["Hours"].setValue(res.S_SoGio);
				this.SoGio = res.SoGio;
				this.changeDetectorRefs.detectChanges();
				this.isSaiGio = true;
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Create, 999999999, true, false, 0, 'top', 0);
				this.itemFormTC.controls["Hours"].setValue(res.S_SoGio);
				this.SoGio = res.SoGio;
				this.isSaiGio = false;
			}
		});
	}

	TinhSoGioOTCanCuVaoGioOT() {
		const sogiotangca = new OvertimeRegistrationModel();
		const controls = this.itemFormTC.controls;
		this.NgayTangCa = controls["NgayTangCa"].value;
		this.GioBatDau = controls["tugio"].value;
		this.GioKetThuc = controls["dengio"].value;
		if (this.NgayTangCa != undefined && this.GioBatDau != undefined && this.GioKetThuc != undefined) {
			{
				if (this.NgayTangCa != "" && this.GioBatDau != "" && this.GioKetThuc != "") {
					sogiotangca.NgayTangCa = this.NgayTangCa;
					sogiotangca.GioBatDau = this.GioBatDau;
					sogiotangca.GioKetThuc = this.GioKetThuc;
					sogiotangca.OverTime = controls["OverTime"].value ? controls["OverTime"].value : false;
					sogiotangca.IsFixHours = controls["IsFixHours"].value ? controls["IsFixHours"].value : false;
					this.GetSoGioTangCa(sogiotangca, false);
				}
			}
		}
	}

	PrepareleaveTC(): OvertimeRegistrationModel {
		const controls = this.itemFormTC.controls;
		const guitangca = new OvertimeRegistrationModel();
		guitangca.NgayTangCa = controls['NgayTangCa'].value;
		guitangca.GioBatDau = controls['tugio'].value;
		guitangca.GioKetThuc = controls['dengio'].value;
		guitangca.LyDo = controls['ghiChu'].value;
		guitangca.SoGio = this.SoGio;
		guitangca.OverTime = controls["OverTime"].value ? controls["OverTime"].value : false;
		guitangca.IsFixHours = controls["IsFixHours"].value ? controls["IsFixHours"].value : false;
		if (this.listWork.length > 0) {
			let id = "";
			this.listWork.forEach(element => {
				id += "," + element.id_row;
			});
			guitangca.workId = id.substring(1);
		}
		if (this.listTask.length > 0) {
			let id = "";
			this.listTask.forEach(element => {
				id += "," + element.stageid;
			});
			guitangca.taskId = id.substring(1);
		}
		if (this.listTaskWork.length > 0) {
			let id = "";
			this.listTaskWork.forEach(element => {
				id += "," + element.stageid;
			});
			guitangca.task_WorkId = id.substring(1);
		}
		return guitangca;
	}
	AddItemTC(item: OvertimeRegistrationModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.disabledBtnTC = true;
		// this.layoutUtilsService.showWaitingDiv();
		this._overtimeRegistrationService.GuiTangCa(item).subscribe(res => {
			// this.layoutUtilsService.OffWaitingDiv();
			this.disabledBtnTC = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				this.dialogRef.close({
					item
				});
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 0, 'top', 0);
			}
		});
	}

	listChon: any[] = [];
	listWork: any[] = [];
	listTask: any[] = [];
	listTaskWork: any[] = [];
	ChonCongViec() {
		// const dialogRef = this.dialog.open(DonTuPopupCongViecComponent, {
		// 	data: {}, panelClass: ['sky-padding-0', 'width900'],
		// 	disableClose: true
		// });
		// dialogRef.afterClosed().subscribe((res) => {
		// 	if (!res) {
		// 		return
		// 	}
		// 	this.listChon = res.listChon;
		// });
	}

	removeWork(item: any): void {
		const index = this.listChon.indexOf(item);
		if (index >= 0) {
			this.listChon.splice(index, 1);
			this.changeDetectorRefs.detectChanges();
		}
	}

	//==================================Dropdown search===========================================
	//===================Phép================================
	//=============================Xét dropdown search=================================
	setUpDropSearchHinhThuc() {
		this.bankFilterCtrl.setValue('');
		this.filterBanks();
		this.bankFilterCtrl.valueChanges
			.pipe()
			.subscribe(() => {
				this.filterBanks();
			});
	}

	protected filterBanks() {
		if (!this.listHinhThuc) {
			return;
		}
		// get the search keyword
		let search = this.bankFilterCtrl.value;
		if (!search) {
			this.filteredBanks.next(this.listHinhThuc.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		// filter the banks
		this.filteredBanks.next(
			this.listHinhThuc.filter(bank => bank.title.toLowerCase().indexOf(search) > -1)
		);
	}
	//=========================
	setUpDropSearchTuGio() {
		this.bankTuGio.setValue('');
		this.filterBanksTuGio();
		this.bankTuGio.valueChanges
			.pipe()
			.subscribe(() => {
				this.filterBanksTuGio();
			});
	}

	protected filterBanksTuGio() {
		if (!this.GioNghi) {
			return;
		}
		// get the search keyword
		let search = this.bankTuGio.value;
		if (!search) {
			this.filteredBanksTuGio.next(this.GioNghi.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		// filter the banks
		this.filteredBanksTuGio.next(
			this.GioNghi.filter(bank => bank.Gio.toLowerCase().indexOf(search) > -1)
		);
	}
	//===========================
	setUpDropSearchDenGio() {
		this.bankDenGio.setValue('');
		this.filterBanksDenGio();
		this.bankDenGio.valueChanges
			.pipe()
			.subscribe(() => {
				this.filterBanksDenGio();
			});
	}

	protected filterBanksDenGio() {
		if (!this.DenGio) {
			return;
		}
		// get the search keyword
		let search = this.bankDenGio.value;
		if (!search) {
			this.filteredBanksDenGio.next(this.DenGio.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		// filter the banks
		this.filteredBanksDenGio.next(
			this.DenGio.filter(bank => bank.Gio.toLowerCase().indexOf(search) > -1)
		);
	}
	//Start======================================Chỉnh sửa Tab công việc thành JeeWork==================================
	onSumbitCongViec(val) {

	}
	//Start DPS===================
	LoadDataDuAn() {
		// this.congViecTheoDuAnService.listDuAn().subscribe(res => {
		// 	if (res && res.status == 1) {
		// 		if (res.data.length > 0) {
		// 			this.listDuAn = res.data.filter(x => x.locked == false);
		// 			this.idDuAn = this.listDuAn[0].id_row;
		// 			this.labelDuAn = this.listDuAn[0].title_full;
		// 			if (this.listDuAn[0].is_use_template) {
		// 				this.description_tiny = this.listDuAn[0].template_description;
		// 			} else {
		// 				this.description_tiny = "";
		// 			}
		// 			this.setUpDropSearchDuAn();
		// 			this.loadDataForDuAn();
		// 		}
		// 	}
		// 	this.changeDetectorRefs.detectChanges();
		// })
	}

	getRoles() {
		this.roleassign = this.CheckRoles(14);
		this.roleprioritize = this.CheckRoleskeypermit('clickup_prioritize');
		this.roledeadline = this.CheckRoles(10);
	}
	//====================Dự án====================
	public bankFilterCtrlDuAn: FormControl = new FormControl();
	public filteredBanksDuAn: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	setUpDropSearchDuAn() {
		this.bankFilterCtrlDuAn.setValue('');
		this.filterBanksDuAn();
		this.bankFilterCtrlDuAn.valueChanges
			.pipe()
			.subscribe(() => {
				this.filterBanksDuAn();
			});
	}

	protected filterBanksDuAn() {
		if (!this.listDuAn) {
			return;
		}
		// get the search keyword
		let search = this.bankFilterCtrlDuAn.value;
		if (!search) {
			this.filteredBanksDuAn.next(this.listDuAn.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		// filter the banks
		this.filteredBanksDuAn.next(
			this.listDuAn.filter(bank => bank.title_full.toLowerCase().indexOf(search) > -1)
		);
	}

	loadDataForDuAn() {
		// this.weworkService.lite_tag(this.idDuAn).subscribe((res) => {
		// 	if (res && res.status === 1) {
		// 		this.list_Tag = res.data;
		// 		this.changeDetectorRefs.detectChanges();
		// 	}
		// });
		// this.menuServices.GetRoleWeWork("" + this.UserID).subscribe((res) => {
		// 	if (res && res.status == 1) {

		// 		// this.list_role = res.data.dataRole;
		// 		this.list_role = res.data.dataRole ? res.data.dataRole : [];
		// 		this.IsAdminGroup = res.data.IsAdminGroup;
		// 		//================Các biến cần xét quyền===========
		// 		this.getRoles();
		// 		this.LoadListAccount();
		// 	}
		// });
	}

	listUser: any[];
	LoadListAccount() {
		// const filter: any = {};
		// filter.id_project_team = this.idDuAn;
		// this.weworkService.list_account(filter).subscribe(res => {
		// 	if (res && res.status === 1) {
		// 		this.listUser = res.data;
		// 		//Xử lý cho phần công việc liên quan đến chat 12/08/2022
		// 		//Nếu có id chat thì chỉ chọn user theo id, ngược lại tạo bình thường
		// 		if (this.data._messageid && this.data._messageid > 0) {
		// 			this.Assign = [];
		// 			this.Assign.push(this.data._itemid);
		// 		} else {
		// 			if (!this.roleassign) {
		// 				this.id_nv_selected = +localStorage.getItem("idUser");
		// 			}
		// 			if (this.id_nv_selected > 0) {
		// 				var x = this.listUser.find(x => x.id_nv == this.id_nv_selected)
		// 				if (x) {
		// 					this.Assign.push(x);
		// 				}
		// 			}
		// 		}
		// 		this.options_assign = this.getOptions_Assign();
		// 		this.changeDetectorRefs.detectChanges();
		// 	};

		// });
	}

	getOptions_Assign() {
		var options_assign: any = {
			showSearch: true,
			keyword: '',
			data: this.listUser,
		};
		return options_assign;
	}

	ResetData() {
		const ele = document.getElementById("txttitle") as HTMLInputElement;
		ele.value = "";
		this.title = "";
		this.Assign = [];
		this.Followers = [];
		this.selectedDate = {
			startDate: '',
			endDate: '',
		}
		this.priority = 0;
		this.listTagChoose = [];
		this.listGiaoCho = [];
		this.listGiaoCho_Finish = [];
		this.NguoiGiaoViec = [];
		if (this.isgov) {
			//=================Cập nhật field mới================
			let date = new Date();
			const ele2 = document.getElementById("txtsokyhieu") as HTMLInputElement;
			ele2.value = "";
			const ele3 = document.getElementById("txtngayvanban") as HTMLInputElement;
			ele3.value = date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + ("0" + (date.getDate())).slice(-2);
			const ele4 = document.getElementById("txttrichyeu") as HTMLInputElement;
			ele4.value = "";
		}
	}

	//===========================Check role=================================
	CheckRoles(roleID: number) {
		const x = this.list_role.find((res) => res.id_row == this.idDuAn);
		if (x) {
			if (x.locked) {
				return false;
			}
		}
		if (this.IsAdminGroup) {
			return true;
		}
		if (this.list_role) {
			const x = this.list_role.find(
				(res) => res.id_row == this.idDuAn
			);
			if (x) {
				if (
					x.admin == true ||
					x.admin == 1 ||
					+x.owner == 1 ||
					+x.parentowner == 1
				) {
					return true;
				} else {
					if (
						roleID == 7 ||
						roleID == 9 ||
						roleID == 11 ||
						roleID == 12 ||
						roleID == 13
					) {
						if (x.Roles.find((r) => r.id_role == 15)) {
							return false;
						}
					}
					if (roleID == 10) {
						if (x.Roles.find((r) => r.id_role == 16)) {
							return false;
						}
					}
					if (roleID == 4 || roleID == 14) {
						if (x.Roles.find((r) => r.id_role == 17)) {
							return false;
						}
					}
					const r = x.Roles.find((r) => r.id_role == roleID);
					if (r) {
						return true;
					} else {
						return false;
					}
				}
			} else {
				return false;
			}
		}
		return false;
	}

	CheckRoleskeypermit(key) {
		const x = this.list_role.find((res) => res.id_row == this.idDuAn);
		if (x) {
			if (x.locked) {
				return false;
			}
		}
		if (this.IsAdminGroup) {
			return true;
		}
		if (this.list_role) {
			if (x) {
				if (
					x.admin == true ||
					x.admin == 1 ||
					+x.owner == 1 ||
					+x.parentowner == 1
				) {
					return true;
				} else {
					if (
						key == "title" ||
						key == "description" ||
						key == "status" ||
						key == "checklist" ||
						key == "delete"
					) {
						if (x.Roles.find((r) => r.id_role == 15)) {
							return false;
						}
					}
					if (key == "deadline") {
						if (x.Roles.find((r) => r.id_role == 16)) {
							return false;
						}
					}
					if (key == "id_nv" || key == "assign") {
						if (x.Roles.find((r) => r.id_role == 17)) {
							return false;
						}
					}

					const r = x.Roles.find((r) => r.keypermit == key);
					if (r) {
						return true;
					} else {
						return false;
					}
				}
			} else {
				return false;
			}
		}
		return false;
	}

	//=======================================================================
	changeDuAn(item) {
		this.labelDuAn = item.title_full;
		this.idDuAn = item.id_row;
		this.bankFilterCtrlDuAn.setValue("");
		if (item.is_use_template) {
			this.description_tiny = item.template_description;
		} else {
			this.description_tiny = "";
		}
		// if (this.isgov) {
		// 	this.loadDataForDuAnGOV();
		// } else {
		// 	this.loadDataForDuAn();
		// }
	}

	//============Xử lý người thực hiện và người theo dõi công việc==================
	getAssignees() {
		return this.Assign;
	}
	getFollowers() {
		return this.Followers;
	}
	stopPropagation(event) {
		event.stopPropagation();
	}
	ItemSelected(val: any, loai) {
		if (loai == 1) {
			var index = this.Assign.findIndex(x => x.id_nv == val.id_nv)
			if (index < 0) {
				this.Assign[0] = val;
			} else {
				this.Assign.splice(index, 1);
			}
		}
		else {
			var index = this.Followers.findIndex(x => x.id_nv == val.id_nv)
			if (index < 0) {
				this.Followers.push(val);
			} else {
				this.Followers.splice(index, 1);
			}
		}
	}
	//==========================Xử lý chọn độ ưu tiên================================
	getPriority(id) {
		if (id > 0) {
			const item = this.list_priority.find((x) => x.value === id);
			if (item) {
				return item.icon;
			}
			return "far fa-flag";
		} else {
			return "far fa-flag";
		}
	}
	//======================Xử lý chon tags=================================
	listTagChoose: any[] = [];
	ReloadDatasTag(event) {
		this.listTagChoose.push(event);
	}

	RemoveTag(tag) {
		const index = this.listTagChoose.indexOf(tag, 0);
		this.listTagChoose.splice(index, 1);
	}

	//=====================Xử lý chọn thời gian thực hiên==================
	estimates: string = '';
	Updateestimates(event) {
		this.estimates = event;
	}

	//=====================Xử lý thơi gian bắt đầu kết thúc=================
	viewdate() {
		if (this.selectedDate.startDate == '' && this.selectedDate.endDate == '') {
			return this.translate.instant('work.chonthoigian')
		}
		else {
			var start = this.work_f_convertDate(this.selectedDate.startDate) ? this.work_f_convertDate(this.selectedDate.startDate) : '...';
			var end = this.work_f_convertDate(this.selectedDate.endDate) ? this.work_f_convertDate(this.selectedDate.endDate) : '...';
			return 'Ngày bắt đầu: ' + start + ' - ' + 'Deadline: ' + end
		}
	}

	work_f_convertDate(v: any) {
		if (v != "" && v != undefined) {
			let a = new Date(v);
			return ("0" + (a.getDate())).slice(-2) + "/" + ("0" + (a.getMonth() + 1)).slice(-2) + "/" + a.getFullYear();
		}
	}

	Selectdate() {
		// const dialogRef = this.dialog.open(DialogSelectdayComponent, {
		// 	width: '500px',
		// 	data: this.selectedDate,
		// 	panelClass: 'sky-padding-0'
		// });

		// dialogRef.afterClosed().subscribe(result => {
		// 	if (result != undefined) {
		// 		if (moment(result.startDate).format('MM/DD/YYYY') != "Invalid date")
		// 			this.selectedDate.startDate = moment(this.selectedDate.startDate).format('MM/DD/YYYY');
		// 		if (moment(result.endDate).format('MM/DD/YYYY') != "Invalid date") {
		// 			this.selectedDate.endDate = moment(this.selectedDate.endDate).format('MM/DD/YYYY');
		// 		}
		// 	}
		// });
	}

	//=======================Xử lý cho phần chọn tài liệu=====================
	AttFile: any[] = [];
	@ViewChild('myInput') myInput;
	indexItem: number;
	ObjImage: any = { h1: "", h2: "" };
	Image: any;
	TenFile: string = '';

	selectFile() {
		let el: HTMLElement = this.myInput.nativeElement as HTMLElement;
		el.click();
	}

	images = [];
	myForm = new FormGroup({
		file: new FormControl(''),
		fileSource: new FormControl('')
	});

	FileSelected(evt: any) {
		if (evt.target.files && evt.target.files.length) {//Nếu có file
			var filesAmount = evt.target.files.length;
			let isFlag = true;
			if (isFlag) {
				this.UploadFileForm(evt);
			}
		}
	}

	UploadFileForm(evt) {
		let ind = 0;
		if (this.AttFile.length > 0) {
			ind = this.AttFile.length;
		}
		if (evt.target.files && evt.target.files[0]) {
			var filesAmount = evt.target.files.length;
			for (let i = 0; i < filesAmount; i++) {
				var reader = new FileReader();

				reader.onload = (event: any) => {
					let base64Str = event.target.result;
					var metaIdx = base64Str.indexOf(';base64,');
					base64Str = base64Str.substr(metaIdx + 8);
					this.AttFile[ind].strBase64 = base64Str;
					ind++;
				}

				reader.readAsDataURL(evt.target.files[i]);

				this.AttFile.push({
					filename: evt.target.files[i].name,
					type: evt.target.files[i].name.split(".")[evt.target.files[i].name.split(".").length - 1],
					strBase64: '',
					IsAdd: true,
					IsDel: false,
					IsImagePresent: false,
				})
			}
		}
	}

	getIcon(type) {
		let icon = "";
		if (type == "doc" || type == "docx") {
			icon = "./../../../../../assets/media/mime/word.png"
		}
		if (type == "pdf") {
			icon = "./../../../../../assets/media/mime/pdf.png"
		}
		if (type == "rar") {
			icon = "./../../../../../assets/media/mime/text2.png"
		}
		if (type == "zip") {
			icon = "./../../../../../assets/media/mime/text2.png"
		}
		if (type == "jpg") {
			icon = "./../../../../../assets/media/mime/jpg.png"
		}
		if (type == "png") {
			icon = "./../../../../../assets/media/mime/png.png"
		}
		return icon;
	}

	deleteFile(file: any) {
		this.AttFile.splice(file, 1);
		this.myInput.nativeElement.value = "";
		this.changeDetectorRefs.detectChanges();
	}

	getHeight() {
		let height = 0;
		height = window.innerHeight - 380;
		return height + "px";
	}

	onSubmit(withBack: boolean = false) {
		const ele = document.getElementById("txttitle") as HTMLInputElement;
		if (ele.value.toString().trim() == "") {
			this.layoutUtilsService.showActionNotification('Tên công việc không được bỏ trống', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
			return;
		}
		// const updatedegree = this.prepareCustomer();
		// this.CreateTask(updatedegree, withBack);
	}

	// prepareCustomer(): WorkModel {
	// 	const task = new WorkModel();
	// 	const ele = document.getElementById("txttitle") as HTMLInputElement;
	// 	task.title = ele.value;
	// 	let data_Users = [];
	// 	task.Users = [];
	// 	this.Assign.forEach(element => {
	// 		var assign = this.AssignInsert(element.id_nv, 1);
	// 		data_Users.push(assign);
	// 	});

	// 	this.Followers.forEach(element => {
	// 		var follower = this.AssignInsert(element.id_nv, 2);
	// 		data_Users.push(follower);
	// 	});
	// 	task.Users = data_Users;
	// 	task.urgent = this.priority;
	// 	this.listTagChoose.map((item, index) => {
	// 		let listTag = [];
	// 		let _item = {
	// 			id_row: 0,
	// 			id_work: 0,
	// 			id_tag: item.id_row,
	// 		}
	// 		listTag.push(_item);
	// 		task.Tags = listTag;
	// 	})

	// 	task.estimates = this.estimates;
	// 	const start = moment();
	// 	if (moment(this.selectedDate.startDate).format('MM/DD/YYYY') != "Invalid date")
	// 		task.start_date = moment(this.selectedDate.startDate).utc().format('MM/DD/YYYY HH:mm:ss');
	// 	if (moment(this.selectedDate.endDate).format('MM/DD/YYYY') != "Invalid date") {
	// 		task.deadline = moment(this.selectedDate.endDate).utc().format('MM/DD/YYYY HH:mm:ss');
	// 		task.end_date = moment(this.selectedDate.endDate).utc().format('MM/DD/YYYY HH:mm:ss');
	// 	}
	// 	task.id_project_team = +this.idDuAn;
	// 	task.description = this.description_tiny;
	// 	task.Attachments = this.AttFile;

	// 	task.messageid = 0;
	// 	task.groupid = 0;
	// 	return task;
	// }

	AssignInsert(id_nv, loai) {
		var NV = new UserInfoModel();
		NV.id_user = id_nv;
		NV.loai = loai;
		return NV;
	}

	CreateTask(val, withBack: boolean) {
		// this.layoutUtilsService.showWaitingDiv();
		// this.congViecTheoDuAnService.InsertTask(val).subscribe((res) => {
		// 	this.layoutUtilsService.OffWaitingDiv();
		// 	if (res && res.status === 1) {
		// 		if (withBack == true) {
		// 			this.dialogRef.close({
		// 				_item: res.data
		// 			});
		// 		}
		// 		else {
		// 			this.AttFile = [];
		// 			this.description_tiny = "";
		// 			this.ResetData();
		// 		}
		// 	}
		// 	else {
		// 		this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
		// 	}
		// });
	}
	//Start GOV===================
	//=========================Xử lý giao diện mới=====================
	listGiaoCho: any[] = [];
	listGiaoCho_Finish: any[] = [];
	// LoadDataDuAnGOV() {
	// 	this.congViecTheoDuAnService.lite_project_by_manager().subscribe(res => {
	// 		if (res && res.status == 1) {
	// 			if (res.data.length > 0) {
	// 				this.listDuAn = res.data.filter(x => x.locked == false);
	// 				this.idDuAn = this.listDuAn[0].id_row;
	// 				this.labelDuAn = this.listDuAn[0].title;
	// 				if (this.listDuAn[0].is_use_template) {
	// 					this.description_tiny = this.listDuAn[0].template_description;
	// 				} else {
	// 					this.description_tiny = "";
	// 				}
	// 				this.setUpDropSearchDuAn();
	// 				this.loadDataForDuAnGOV();
	// 			}
	// 		}
	// 		this.changeDetectorRefs.detectChanges();
	// 	})
	// }
	// loadDataForDuAnGOV() {
	// 	this.menuServices.GetRoleWeWork("" + this.UserID).subscribe((res) => {
	// 		if (res && res.status == 1) {
	// 			// this.list_role = res.data.dataRole;
	// 			this.list_role = res.data.dataRole ? res.data.dataRole : [];
	// 			this.IsAdminGroup = res.data.IsAdminGroup;
	// 			//================Các biến cần xét quyền===========
	// 			this.getRoles();
	// 			this.LoadListAccountGOV()
	// 		}
	// 	});
	// }
	// LoadListAccountGOV() {
	// 	this.weworkService.list_account_gov(this.idDuAn).subscribe(res => {
	// 		if (res && res.status === 1) {
	// 			this.listUser = res.data;
	// 			this.AssignGOV = [];
	// 			let obj = this.listUser.find(x => x.IsOwner);
	// 			if (obj) {
	// 				this.AssignGOV.push(obj);
	// 			}
	// 			this.options_assign = this.getOptions_Assign();
	// 			this.changeDetectorRefs.detectChanges();
	// 		};
	// 		this.LoadDataNguoiGiaoViec();
	// 	});
	// }
	// getAssigneesGOV() {
	// 	return this.AssignGOV;
	// }
	// ItemSelectedGOV(val: any, loai) {
	// 	if (loai == 1) {
	// 		var index = this.AssignGOV.findIndex(x => x.id_nv == val.id_nv)
	// 		if (index < 0) {
	// 			this.AssignGOV[0] = val;
	// 		} else {
	// 			this.AssignGOV.splice(index, 1);
	// 		}
	// 	} else {//người giao việc
	// 		var index = this.NguoiGiaoViec.findIndex(x => x.userid == val.userid)
	// 		if (index < 0) {
	// 			this.NguoiGiaoViec[0] = val;
	// 		} else {
	// 			this.NguoiGiaoViec.splice(index, 1);
	// 		}
	// 	}
	// }
	// Them() {
	// 	let obj = this.listUser.find(x => x.IsOwner);
	// 	let item = {
	// 		idDuAn: this.idDuAn,
	// 		labelDuAn: this.labelDuAn,
	// 		Assign: obj ? [obj] : [],
	// 		options_assign: this.getOptions_Assign_Dynamic(this.listUser),
	// 	};
	// 	this.listGiaoCho.push(item);
	// }

	// deleteRow(vi) {
	// 	this.listGiaoCho.splice(vi, 1);
	// 	this.changeDetectorRefs.detectChanges();
	// }

	// ItemSelectedDynamic(val: any, loai, index, data) {
	// 	if (loai == 1) {
	// 		var ind = data.Assign.findIndex(x => x.userid == val.userid)
	// 		if (ind < 0) {
	// 			data.Assign[0] = val;
	// 		}
	// 	}
	// 	this.changeDetectorRefs.detectChanges();
	// }

	// changeDuAnDynamic(item, data, i) {
	// 	data.labelDuAn = item.title;
	// 	data.idDuAn = item.id_row;
	// 	data.Assign = [];
	// 	this.bankFilterCtrlDuAn.setValue("");
	// 	this.LoadListAccountDynacmic(data);
	// }

	// LoadListAccountDynacmic(data) {
	// 	const filter: any = {};
	// 	filter.id_project_team = data.idDuAn;
	// 	this.weworkService.list_account(filter).subscribe(res => {
	// 		if (res && res.status === 1) {
	// 			let listUser = res.data;
	// 			data.Assign.push(listUser[0]);
	// 			data.options_assign = {
	// 				showSearch: true,
	// 				keyword: '',
	// 				data: listUser,
	// 			}
	// 			this.changeDetectorRefs.detectChanges();
	// 		};

	// 	});
	// }

	// getOptions_Assign_Dynamic(data) {
	// 	var options_assign: any = {
	// 		showSearch: true,
	// 		keyword: '',
	// 		data: data,
	// 	};
	// 	return options_assign;
	// }

	// viewdateDynamic() {
	// 	if (this.selectedDate.startDate == '' && this.selectedDate.endDate == '') {
	// 		return ""
	// 	}
	// 	else {
	// 		var start = this.work_f_convertDate(this.selectedDate.startDate) ? this.work_f_convertDate(this.selectedDate.startDate) : '...';
	// 		var end = this.work_f_convertDate(this.selectedDate.endDate) ? this.work_f_convertDate(this.selectedDate.endDate) : '...';
	// 		return 'Ngày bắt đầu: ' + start + ' - ' + 'Deadline: ' + end + ' ';
	// 	}
	// }
	// onSubmitGOV(withBack: boolean = false) {
	// 	let isFlag = true;
	// 	//Kiêm tra dữ liệu bắt buộc
	// 	const ele = document.getElementById("txttitle") as HTMLInputElement;
	// 	if (ele.value.toString().trim() == "") {
	// 		this.layoutUtilsService.showActionNotification('Nhiệm vụ không được bỏ trống', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
	// 		return;
	// 	}
	// 	if (this.NguoiGiaoViec.length == 0) {
	// 		isFlag = false;
	// 		this.layoutUtilsService.showActionNotification('Vui lòng chọn người giao nhiệm vụ', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
	// 		return;
	// 	}
	// 	const ele2 = document.getElementById("txtsokyhieu") as HTMLInputElement;
	// 	if (ele2.value.toString().trim() == "") {
	// 		isFlag = false;
	// 		this.layoutUtilsService.showActionNotification('Số, ký hiệu văn bản không được bỏ trống', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
	// 		return;
	// 	}
	// 	const ele3 = document.getElementById("txtngayvanban") as HTMLInputElement;
	// 	if (ele3.value.toString().trim() == "") {
	// 		isFlag = false;
	// 		this.layoutUtilsService.showActionNotification('Ngày văn bản không được bỏ trống', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
	// 		return;
	// 	}
	// 	const ele4 = document.getElementById("txttrichyeu") as HTMLInputElement;
	// 	if (ele4.value.toString().trim() == "") {
	// 		isFlag = false;
	// 		this.layoutUtilsService.showActionNotification('Trích yếu văn bản không được bỏ trống', MessageType.Read, 9999999999, true, false, 3000, "top", 0);
	// 		return;
	// 	}
	// 	//Add data dự án và người thực hiện đầu tiên vào list
	// 	this.listGiaoCho_Finish = [];
	// 	let _item = {
	// 		id_project_team: +this.idDuAn,
	// 		id_user: this.AssignGOV.length > 0 ? this.AssignGOV[0].id_nv : '',
	// 	}
	// 	this.listGiaoCho_Finish.push(_item);
	// 	if (this.listGiaoCho.length > 0) {
	// 		this.listGiaoCho.forEach(element => {
	// 			let obj = this.listGiaoCho_Finish.find(x => +x.id_project_team == +element.idDuAn);
	// 			if (obj) {
	// 				isFlag = false;
	// 				let message = "Lỗi dữ liệu giao cho bị trùng";
	// 				this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
	// 				return;
	// 			} else {
	// 				let _itemChild = {
	// 					id_project_team: +element.idDuAn,
	// 					id_user: element.Assign.length > 0 ? element.Assign[0].id_nv : '',
	// 				}
	// 				this.listGiaoCho_Finish.push(_itemChild);
	// 			}

	// 		})
	// 	}

	// 	if (this.selectedDate.endDate == "" || this.selectedDate.endDate == null) {
	// 		isFlag = false;
	// 		let message = "Vui lòng chọn ngày kết thúc của hạn xử lý";
	// 		this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
	// 		return;
	// 	}
	// 	if (isFlag) {
	// 		const updatedegree = this.prepareCustomerGOV();
	// 		this.CreateTaskGOV(updatedegree, withBack);
	// 	}
	// }

	// prepareCustomerGOV(): WorkModel {
	// 	const task = new WorkModel();
	// 	const ele = document.getElementById("txttitle") as HTMLInputElement;
	// 	task.title = ele.value;

	// 	let project = [];
	// 	let user = [];
	// 	this.listGiaoCho_Finish.forEach(element => {
	// 		user = [];
	// 		if(element.id_user != "" && element.id_user != null){
    //             let _user = {
    //                 id_user: element.id_user,
    //                 loai: 1,
    //             };
    //             user.push(_user)
    //         }
	// 		let _project = {
	// 			id_project_team: element.id_project_team,
	// 			Users: user,
	// 		};
	// 		project.push(_project);
	// 	});
	// 	task.Projects = project;

	// 	task.clickup_prioritize = this.priority;

	// 	const start = moment();
	// 	if (moment(this.selectedDate.startDate).format('MM/DD/YYYY') != "Invalid date")
	// 		task.start_date = moment(this.selectedDate.startDate).utc().format('MM/DD/YYYY HH:mm:ss');
	// 	if (moment(this.selectedDate.endDate).format('MM/DD/YYYY') != "Invalid date") {
	// 		task.deadline = moment(this.selectedDate.endDate).utc().format('MM/DD/YYYY HH:mm:ss');
	// 		task.end_date = moment(this.selectedDate.endDate).utc().format('MM/DD/YYYY HH:mm:ss');
	// 	}

	// 	task.description = this.description_tiny;

	// 	task.Attachments = this.AttFile;

	// 	task.messageid = 0;
	// 	task.groupid = 0;

	// 	//Bổ sung thêm 4 field thông tin
	// 	task.Userid_nguoigiao = this.NguoiGiaoViec[0].userid;
	// 	const ele2 = document.getElementById("txtsokyhieu") as HTMLInputElement;
	// 	task.Gov_SoHieuVB = ele2.value;
	// 	const ele3 = document.getElementById("txtngayvanban") as HTMLInputElement;
	// 	task.Gov_NgayVB = moment(ele3.value).utc().format('MM/DD/YYYY HH:mm:ss');
	// 	const ele4 = document.getElementById("txttrichyeu") as HTMLInputElement;
	// 	task.Gov_TrichYeuVB = ele4.value;

	// 	return task;
	// }

	// CreateTaskGOV(val, withBack: boolean) {
	// 	this.layoutUtilsService.showWaitingDiv();
	// 	this.congViecTheoDuAnService.InsertTask_Gov(val).subscribe((res) => {
	// 		this.layoutUtilsService.OffWaitingDiv();
	// 		if (res && res.status === 1) {
	// 			if (withBack == true) {
	// 				this.dialogRef.close({
	// 					_item: res.data
	// 				});
	// 			}
	// 			else {
	// 				this.AttFile = [];
	// 				this.description_tiny = "";
	// 				this.ngOnInit();
	// 			}
	// 		}
	// 		else {
	// 			this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
	// 		}
	// 	});
	// }

	//=======================Bổ sung chọn người giao việc 07/11/2022=================
	NguoiGiaoViec: any = [];
	options_nguoigiaoviec: any = [];
	listNguoiGiaoViec: any = [];
	labelNGNV: string = "";
    idNGNV: string = "";
    public bankFilterCtrlNGNV: FormControl = new FormControl();
    public filteredBanksNGNV: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

	getNguoiGiaoViec() {
		return this.NguoiGiaoViec;
	}
	LoadDataNguoiGiaoViec() {
		// this.weworkService.list_gov_acc_join_dept('').subscribe(res => {
		// 	if (res && res.status === 1) {
		// 		this.listNguoiGiaoViec = res.data;
		// 		if (this.listNguoiGiaoViec.length == 0) {
        //             let obj = this.listUser.find(x => x.userid == this.UserID);
        //             if (obj) {
        //                 this.labelNGNV = obj.tenchucdanh + " - " + obj.fullname;
        //                 this.idNGNV = obj.userid;
        //             }
        //         } else {
        //             this.labelNGNV = res.data[0].tenchucdanh + " - " + res.data[0].fullname;
        //             this.idNGNV = res.data[0].userid;
        //         }
        //         this.setUpDropSearchNGNV();
		// 		this.changeDetectorRefs.detectChanges();
		// 	};

		// });
	}
	getOptions_NguoiGiaoViec() {
		var options_nguoigiaoviec: any = {
			showSearch: true,
			keyword: '',
			data: this.listNguoiGiaoViec,
		};
		return options_nguoigiaoviec;
	}

	setUpDropSearchNGNV() {
        this.bankFilterCtrlNGNV.setValue('');
        this.filterBanksNGNV();
        this.bankFilterCtrlNGNV.valueChanges
            .pipe()
            .subscribe(() => {
                this.filterBanksNGNV();
            });
    }

    protected filterBanksNGNV() {
        if (!this.listNguoiGiaoViec) {
            return;
        }
        // get the search keyword
        let search = this.bankFilterCtrlNGNV.value;
        if (!search) {
            this.filteredBanksNGNV.next(this.listNguoiGiaoViec.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredBanksNGNV.next(
            this.listNguoiGiaoViec.filter(bank => bank.hoten.toLowerCase().indexOf(search) > -1 || bank.tenchucdanh.toLowerCase().indexOf(search) > -1)
        );
    }

    changeNGNV(item) {
        this.labelNGNV = item.tenchucdanh + " - " + item.fullname;
        this.idNGNV = item.userid;
        this.bankFilterCtrlNGNV.setValue("");
    }
	//End======================================Chỉnh sửa Tab công việc thành JeeWork==================================
}
