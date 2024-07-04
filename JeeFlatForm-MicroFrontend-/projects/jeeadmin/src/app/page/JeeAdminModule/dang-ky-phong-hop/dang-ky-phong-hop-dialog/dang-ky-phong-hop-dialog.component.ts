import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { ReplaySubject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { DatPhongService } from '../../Services/dat-phong.service';
import { JeeAdminService } from '../../Services/jeeadmin.service';

@Component({
	selector: 'm-dang-ky-phong-hop-dialog',
	templateUrl: './dang-ky-phong-hop-dialog.component.html',
})

export class DangKyPhongHopDialogComponent implements OnInit {
	item: any;
	oldItem: any;
	itemForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	@ViewChild("focusInput") focusInput: ElementRef;
	@ViewChild(MatDatepicker) picker;

	GioNghi: any[] = [];
	DenGio: any[] = [];

	//====================Dropdown search============================
	bankFilterCtrl: FormControl = new FormControl();
	filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	bankTuGio: FormControl = new FormControl();
	filteredBanksTuGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	bankDenGio: FormControl = new FormControl();
	filteredBanksDenGio: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

	RoomID: number = 0;
	disabledBtn: boolean;
	filterPhong: string = '0';
	listPhongHop: any[] = [];

	/* Keyboard Shortcut Keys */
	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13) {//phím Enter
			this.GuiDangKy();
		}
	}

	constructor(public dialogRef: MatDialogRef<DangKyPhongHopDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private changeDetectorRefs: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private itemFB: FormBuilder,
		private dungChungService: JeeAdminService,
		private _DangKyPhongHopService: DatPhongService,
	) { }

	/** LOAD DATA */
	ngOnInit() {
		this.filterPhong = this.data._RoomID;
		this.XuLyDuLieuAdd(this.data._item);
		this.createForm();

		this.dungChungService.GetListPhongHop().subscribe(res => {
			if (res.data.length > 0) {
				this.listPhongHop = res.data;
			}
			this.changeDetectorRefs.detectChanges();
		});

		this.dungChungService.Get_GioDatPhongHop('').subscribe(res => {
			this.GioNghi = res.data;
			this.DenGio = res.data;
			if (this.item.FromTime != "") {
				this.itemForm.controls["FromTime"].setValue('' + this.item.FromTime);
			}

			if (this.item.ToTime != "") {
				this.itemForm.controls["ToTime"].setValue('' + this.item.ToTime);
			}

			this.setUpDropSearchTuGio();
			this.setUpDropSearchDenGio()
			this.changeDetectorRefs.detectChanges();
		});
	}

	XuLyDuLieuAdd(val: any) {
		let tmp = Object.assign({}, this.item);
		tmp.BookingDate = this.f_convertDate(val.start);
		tmp.FromTime = this.f_convertHour(val.start);
		tmp.ToTime = this.f_convertHour(val.end);
		tmp.MeetingContent = val.extendedProps.reason;
		this.item = tmp;
	}

	createForm() {
		this.itemForm = this.itemFB.group({
			BookingDate: [this.item.BookingDate, [Validators.required]],
			MeetingContent: [this.item.MeetingContent, Validators.required],
			FromTime: ['', Validators.required],
			ToTime: ['', Validators.required],
		});
		this.itemForm.markAsTouched();
	}

	GuiDangKy(withBack: boolean = false) {
		this.hasFormErrors = false;
		this.loadingAfterSubmit = false;
		const controls = this.itemForm.controls;
		/* check form */
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}
		if(this.filterPhong == '0') {
			let mess = "Hãy chọn tài sản đăng ký!!"
			this.layoutUtilsService.showActionNotification(mess, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			return;
		}
		const item = this.prepareItem();
		this.CreateRoom(item, withBack);
	}

	prepareItem(): any {
		const controls = this.itemForm.controls;
		const _item = Object.assign({}, this.item);
		_item.RoomID = this.filterPhong;
		_item.BookingDate = controls['BookingDate'].value;
		_item.FromTime = controls['FromTime'].value;
		_item.ToTime = controls['ToTime'].value;
		_item.MeetingContent = controls['MeetingContent'].value;
		return _item;
	}

	CreateRoom(_item: any, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.disabledBtn = true;
		this._DangKyPhongHopService.Insert_DatPhongHop(_item).subscribe(re => {
			this.disabledBtn = false;
			if (re && re.status == 1) {
				this.dialogRef.close({
					_item
				});
			} else {
				this.layoutUtilsService.showActionNotification(re.error.msg, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		})
	}

	//=================================================================================================================================
	goBack() {
		this.dialogRef.close();
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
}
