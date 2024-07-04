import { Component, OnInit, Inject, ViewChild, ElementRef, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import * as _moment from 'moment';
import { LayoutUtilsService, MessageType } from 'projects/jeeadmin/src/modules/crud/utils/layout-utils.service';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { DatPhongService } from '../../Services/dat-phong.service';
import { JeeAdminService } from '../../Services/jeeadmin.service';

@Component({
	selector: 'm-quan-ly-phong-hop-dialog',
	templateUrl: './quan-ly-phong-hop-dialog.component.html',
})
export class QuanLyPhongHopDialogComponent implements OnInit {
	item: any;
	oldItem: any;
	itemForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	types: any[] = [];
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

	disabledBtn: boolean;

	public datatree: BehaviorSubject<any[]> = new BehaviorSubject([]);
	title: string = '';
	selectedNode: BehaviorSubject<any> = new BehaviorSubject([]);
	ID_Struct: string = '';

	filterPhong: string = '0';
	listPhongHop: any[] = [];
	IsEdit: boolean = false;

	/* Keyboard Shortcut Keys */
	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13) {//phím Enter
			this.GuiDangKy();
		}
	}

	constructor(public dialogRef: MatDialogRef<QuanLyPhongHopDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private changeDetectorRefs: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private itemFB: FormBuilder,
		private _QuanLyPhongHopService: DatPhongService,
		private dungChungService: JeeAdminService,
		private changeDetectorRef: ChangeDetectorRef) { }

	/** LOAD DATA */
	ngOnInit() {
		this.title = "Chọn cơ cấu tổ chức";
		this.getTreeValue();
		this.filterPhong = this.data._RoomID;
		this.XuLyDuLieuAdd(this.data._item);

		this.dungChungService.GetListPhongHop().subscribe(res => {
			if (res.data.length > 0) {
				this.listPhongHop = res.data;
			}
			this.changeDetectorRef.detectChanges();
		});

		this.createForm();
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

	getTitle() {
		return this.IsEdit ? this.translate.instant("datphonghop.suadangky") 
			: this.translate.instant("datphonghop.thongtindangky");
	}

	listPB: any = []
	getListPB() {
		this.listPB = [];
		this.dungChungService.getList_PhongBan().subscribe(res => {
			if (res.status == 1) {
				this.listPB = res.data;
				this.changeDetectorRef.detectChanges();
			}
		})
	}

	change(event: any) {
		this.LoadNhanVien(event.value)
	}

	RowID: number = 0;
	UserID: number = 0;
	disableTree = false;
	XuLyDuLieuAdd(val: any) {
		this.IsEdit = val.extendedProps.isedit;
		this.RowID = val.id;
		let tmp = Object.assign({}, this.item);
		tmp.BookingDate = this.f_convertDate(val.start);
		tmp.FromTime = this.f_convertHour(val.start);
		tmp.ToTime = this.f_convertHour(val.end);
		if (this.IsEdit) {
			tmp.MeetingContent = val.extendedProps.title;
			this.filterPhong = ""+val.extendedProps.propertyid;
			tmp.IdPhongBan = val.extendedProps.departmentid;
			this.disableTree = true;
			this.UserID = val.extendedProps.subscriberid;
			this.LoadNhanVien(tmp.IdPhongBan);
		}
		this.item = tmp;
	}

	createForm() {
		this.itemForm = this.itemFB.group({
			BookingDate: [this.item.BookingDate, [Validators.required]],
			MeetingContent: [this.item.MeetingContent, Validators.required],
			FromTime: ['', Validators.required],
			ToTime: ['', Validators.required],
			NVID:[this.item.NVID != null ? this.item.NVID : "",Validators.required],
			LyDoSua: [''],
			IdPhongBan: [this.item.IdPhongBan != null ? this.item.IdPhongBan : ""]
		});
		this.itemForm.controls["BookingDate"].markAsTouched();
		this.itemForm.controls["MeetingContent"].markAsTouched();
		this.itemForm.controls["FromTime"].markAsTouched();
		this.itemForm.controls["ToTime"].markAsTouched();
		this.itemForm.controls["NVID"].markAsTouched();
		if (this.IsEdit) {
			this.itemForm.controls["LyDoSua"].setValidators(Validators.required);
			this.itemForm.controls["LyDoSua"].markAsTouched();
			this.itemForm.controls["MeetingContent"].disable();
			this.itemForm.controls["NVID"].disable();
			this.itemForm.controls["NVID"].setValue(this.UserID.toString());
		}
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
		if(this.filterPhong === "0") {
			var mess = "Hãy chọn tài sản đăng ký"
			this.layoutUtilsService.showActionNotification(mess, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			return;
		}
		const item = this.prepareItem();
		if(this.IsEdit) {
			this.UpdateRoom(item, withBack);
		}
		else {
			this.CreateRoom(item, withBack);
		}
	}

	prepareItem(): any {
		const controls = this.itemForm.controls;
		const _item = Object.assign({}, this.item);
		_item.RoomID = this.filterPhong;
		if(controls['BookingDate'].value)
			_item.BookingDate = this.f_convertDate(controls['BookingDate'].value);
		_item.FromTime = controls['FromTime'].value;
		_item.ToTime = controls['ToTime'].value;
		_item.MeetingContent = controls['MeetingContent'].value;
		_item.NVID = controls['NVID'].value;
		if(this.IsEdit) {
			_item.LyDo = controls['LyDoSua'].value;
			_item.RowID = this.RowID;
		}
		return _item;
	}

	CreateRoom(_item: any, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.disabledBtn = true;
		let saveMessageTranslateParam = this.translate.instant('COMMON.themthanhcong');
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = MessageType.Create;
		this._QuanLyPhongHopService.Insert_DatPhongHop(_item).subscribe(re => {
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

	UpdateRoom(_item: any, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.disabledBtn = true;
		this._QuanLyPhongHopService.Update_DatPhongHop(_item).subscribe(re => {
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

	filterBanksDenGio() {
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

	//===================================Sử dung cho nhân viên========================
	getTreeValue() {
		this.dungChungService.getList_PhongBan().subscribe(res => {
			if (res.data && res.data.length > 0) {
				this.datatree.next(res.data);
				this.selectedNode.next({
					RowID: "" + res.data[0].RowID,
				});
				this.ID_Struct = "" + res.data[0].RowID;
				// this.LoadNhanVien();
			}
			else {
				this.datatree.next([]);
			}
		});
	}

	GetValueNode(val: any) {
		this.ID_Struct = val.RowID;
		this.LoadNhanVien(val.RowID);
	}

	listNhanVien: any[] = [];
	LoadNhanVien(id: number) {
		this.dungChungService.getUsersByPhong(id).subscribe(res => {
			if (res && res.status == 1) {
				this.listNhanVien = res.data;
				// if(this.IsEdit) {
				// 	this.filteredBanks.next(
				// 		this.listNhanVien.filter(bank => bank.UserId == this.UserID )
				// 	);
				// 	var idx = this.listNhanVien.findIndex(x => x.UserId == this.UserID)
				// 	this.bankFilterCtrl.setValue(this.listNhanVien[idx].FullName);
				// }
				// else
					this.setUpDropSearchNhanVien();
			} else {
				this.listNhanVien = [];
			}
			this.changeDetectorRefs.detectChanges();
		});
	}

	filterConfiguration(): any {
		const filter: any = {};
		filter.StructureID = '' + this.ID_Struct;
		return filter;
	}

	setUpDropSearchNhanVien() {
		this.bankFilterCtrl.setValue('');
		this.filterBanks();
		this.bankFilterCtrl.valueChanges
			.pipe()
			.subscribe(() => {
				this.filterBanks();
			});
	}

	filterBanks() {
		if (!this.listNhanVien) {
			this.filteredBanks.next([])
			return;
		}
		// get the search keyword
		let search = this.bankFilterCtrl.value;
		if (!search) {
			this.filteredBanks.next(this.listNhanVien.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		// filter the banks
		this.filteredBanks.next(
			this.listNhanVien.filter(bank => bank.FullName.toLowerCase().indexOf(search) > -1)
		);
	}
}
