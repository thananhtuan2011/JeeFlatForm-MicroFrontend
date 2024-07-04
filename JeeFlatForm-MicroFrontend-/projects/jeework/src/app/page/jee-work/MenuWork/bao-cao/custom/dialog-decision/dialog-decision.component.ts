import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { DndDropEvent, DropEffect } from "ngx-drag-drop";
import { Observable, ReplaySubject, Subscription } from "rxjs";
import { CongViecTheoQuyTrinhService } from "../service/cong-viec-theo-quy-trinh.services";
import { LayoutUtilsService,MessageType } from "projects/jeework/src/modules/crud/utils/layout-utils.service";
import { ProcessWorkService } from "../../services/process-work.service";
import { DanhMucChungService } from "../../../../services/danhmuc.service";

@Component({
	selector: 'dialog-decision',
	templateUrl: 'dialog-decision.component.html',
})
export class DialogDecision implements OnInit {
	IDQuyTrinh: string;
	IDGiaiDoan: string;
	IDNhiemVuGiaiDoan: string;
	Type: number; //0: Chuyển giai đoạn; 1:Giao người thực hiện; 2:Nhập lý do khi tạm dừng giai đoạn; 3: Cập nhật hạn chót; 4: Thêm người theo dõi quy trình
	//5: Cập nhât giai đoạn là công viêc chưa thực hiện
	//6: Quản lý tùy chọn kéo ngược
	//7: Chuyển về giai đoạn trước (chọn giai đoạn để chuyển về)
	//8: Xem chi tiết quy trình con
	//9: Xem quyết định
	//10:Chỉnh sửa nhiệm vụ
	//11:Chỉnh sửa lý do thất bại hoặc hoàn thành (typereason: 0: Thất bại; 1: Hoàn thành)
	//12:Đánh dẫu hoàn thành hay thất bại của nhiệm vụ (typereason: 0: Thất bại; 1: Hoàn thành)
	//13: Chỉnh sửa giai đoạn của nhiệm vụ tương ứng
	//18:Thay đổi người quản lý giai đoạn nhiệm vụ (WorkType:1 Type:2)
	//Loại giai đoạn 0: Bắt đầu, 1: Công việc, 2: Quyết định, 3: Kết quả quyết định, 4: Quy trình khác, 5: Đồng thời, 6: Kết thúc; 7: Gửi mail
	//===========================Chuyển giai đoạn===============
	NoiDung: string = '';
	//====================Người Thực Hiện====================
	listNguoiThucHien: any[] = [];
	IDNguoiThucHien: string = '';
	public bankFilterCtrlNTH: FormControl = new FormControl();
	public filteredBanksNTH: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	//========================Lý do tạm dừng giai đoạn==========
	@ViewChild("focusInput", { static: true }) focusInput: ElementRef;
	item: any;
	oldItem: any
	itemForm: FormGroup;

	//====================Người theo dõi===================
	ID: string;
	public bankFilterCtrlTD: FormControl = new FormControl();
	public filteredBanksTD: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	listTheoDoi: any[] = [];
	dataTheoDoi: any[] = [];

	//=====================Quản lý tùy chọn kéo ngược=======
	OptionBackward: string = '';
	StageBackward: string = '';
	listStageBackward: any[] = [];
	listGiaiDoan: any[] = [];

	//=====================Chuyển về giai đoạn trước========
	NodeID: number;
	NodeListID: number;
	ListNodes: any[] = [];

	//=====================Xem chi tiết quy trình con========
	ListQuyTrinh: any[] = [];

	//=====================Xem quyết định========
	TemplateStr: string = '';

	//=====================Cập nhật nhiệm vụ Type = 10========
	itemTask: any;
	TenNhiemVu: string = '';
	tinyMCE = {};
	//====================Người theo dõi===================
	listNguoiTheoDoi: any[] = [];
	public bankFilterCtrlNTD: FormControl = new FormControl();
	public filteredBanksNTD: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	//====================Người quản lý===================
	listNguoiQuanLy: any[] = [];
	public bankFilterCtrlNQL: FormControl = new FormControl();
	public filteredBanksNQL: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	//================Check goBack form======================
	isDirty$: Observable<boolean>;
	sub: Subscription;
	store: any;
	isBack: boolean;
	//==========Khai báo File================
	itemFile = {
		RowID: "",
		Title: "",
		Description: "",
		Required: false,
		Files: []
	};
	Files: string = '';
	//======================================
	listBieuMau: any[] = [];

	ID_NguoiThucHien: number = 0;//Type = 1

	constructor(
		public congViecTheoQuyTrinhService: CongViecTheoQuyTrinhService,
		public dialogRef: MatDialogRef<DialogDecision>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private layoutUtilsService: LayoutUtilsService,
		private fb: FormBuilder,
		public dialog: MatDialog,
		public processWorkService: ProcessWorkService,
		private changeDetectorRefs: ChangeDetectorRef,
		private danhMucChungService: DanhMucChungService,) { }
	ngOnInit() {
		this.Type = this.data._type;

		if (this.Type == 1) {
			this.IDGiaiDoan = this.data._GiaiDoanID;
			if (this.data._DataThucHien.length > 0) {
				this.ID_NguoiThucHien = this.data._DataThucHien[0].NVID
			}
			this.createForm();
			this.loadDataNguoiThucHien(this.IDGiaiDoan);
		}

		if (this.Type == 2) {
			this.IDGiaiDoan = this.data._GiaiDoanID;
			this.createForm();
			this.focusInput.nativeElement.focus();
		}

		if (this.Type == 12) {
			this.ID = this.data._TaskID;
			this.IDQuyTrinh = this.data._ProcessID;
			this.TypeReason = this.data._TypeReason;
			this.LoadListReason();
			this.createForm();
		}

		if (this.Type == 13) {
			this.DatField = this.data._DatField;
		}

		if (this.Type == 15) {
			this.IDQuyTrinh = this.data._ProcessID;
			this.danhMucChungService.GetDSGiaiDoan(+this.IDQuyTrinh).subscribe(res => {
				if (res.data && res.data.length > 0) {
					this.listGiaiDoan = res.data;
					this.changeDetectorRefs.detectChanges();
				}
			});
		}

		if (this.Type == 16) {
			this.itemFile = {
				RowID: "",
				Title: "",
				Description: "",
				Required: false,
				Files: []
			};
			this.ID = this.data._TaskID;
			this.createForm();
		}

		if (this.Type == 17) {
			this.itemFile = {
				RowID: "",
				Title: "",
				Description: "",
				Required: false,
				Files: []
			};
			this.ID = this.data._TaskID;
			this.Loai = this.data._Loai;
			this.createForm();
		}

		if (this.Type == 18) {
			this.IDGiaiDoan = this.data._GiaiDoanID;
			this.createForm();
			this.loadDataQLGD();
		}
	}

	goBack() {
		this.dialogRef.close();
	}
	ngOnDestroy() {
		this.sub && this.sub.unsubscribe();
	}


	//Dùng chung
	createForm() {
		if (this.Type == 1) {
			this.itemForm = this.fb.group({
				nguoithuchien: [this.ID_NguoiThucHien > 0 ? '' + this.ID_NguoiThucHien : '', Validators.required],
			});
			this.itemForm.controls["nguoithuchien"].markAsTouched();
		}

		if (this.Type == 2) {
			this.itemForm = this.fb.group({
				lydo: ['', Validators.required],
			});
			this.itemForm.controls["lydo"].markAsTouched();
		}

		if (this.Type == 12) {
			this.itemForm = this.fb.group({
				reason: ['', Validators.required],
			});
			this.itemForm.controls["reason"].markAsTouched();
		}

		if (this.Type == 16) {
			this.itemForm = this.fb.group({
				fileControl: [this.itemFile.Files],
			});
		}

		if (this.Type == 17) {
			this.itemForm = this.fb.group({
				fileControl: [this.itemFile.Files],
			});
		}

		if (this.Type == 18) {
			this.itemForm = this.fb.group({
				quanlygiaidoan: ['', Validators.required],
			});
			this.itemForm.controls["quanlygiaidoan"].markAsTouched();
		}
	}

	//=============================Type = 1============================================
	loadDataNguoiThucHien(id: string) {
		this.processWorkService.getNguoiThucHienDuKien(+id).subscribe(res => {
			if (res.data && res.data.length > 0) {
				this.listNguoiThucHien = res.data;
				this.setUpDropSearcNTH();
				this.changeDetectorRefs.detectChanges();
			}
		});
	}
	setUpDropSearcNTH() {
		this.bankFilterCtrlNTH.setValue('');
		this.filterBanksNTH();
		this.bankFilterCtrlNTH.valueChanges
			.pipe()
			.subscribe(() => {
				this.filterBanksNTH();
			});
	}

	protected filterBanksNTH() {
		if (!this.listNguoiThucHien) {
			return;
		}
		// get the search keyword
		let search = this.bankFilterCtrlNTH.value;
		if (!search) {
			this.filteredBanksNTH.next(this.listNguoiThucHien.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		// filter the banks
		this.filteredBanksNTH.next(
			this.listNguoiThucHien.filter(bank => bank.FullName.toLowerCase().indexOf(search) > -1)
		);
	}
	CapNhatNguoiThucHien(item: any) {
		this.processWorkService.updateImplementer(item).subscribe(res => {
			if (res && res.status == 1) {
				this.dialogRef.close({
					res
				})
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	NguoiThucHien() {
		const controls = this.itemForm.controls;
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}
		const updatedegree = this.prepareNTH();
		this.CapNhatNguoiThucHien(updatedegree);
	}

	prepareNTH(): any {
		const controls = this.itemForm.controls;
		let listnv = [];
		listnv.push(controls['nguoithuchien'].value);
		let _item = {
			ID: this.IDGiaiDoan,/// 1: id node; 2: id todo; 3: id process 
			Type: 1,  /// 1: người thực hiện (công việc), 2: người theo dõi (quy trình); 3: người theo dõi (công việc chi tiết); 2: Người quản lý giai đoạn (công việc) 
			WorkType: 1,  /// 1: Nhiệm vụ; 2: công việc chi tiết; 3: quy trình
			NVIDList: listnv
		}
		return _item;
	}

	//=============================Type = 2============================================
	prepareLyDo(): any {
		const controls = this.itemForm.controls;
		let _item = {
			ID: +this.IDGiaiDoan,
			Status: 0,
			Note: controls['lydo'].value,
		}
		return _item;
	}
	LyDo() {
		const controls = this.itemForm.controls;
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}
		const updatedegree = this.prepareLyDo();
		this.UpdateLyDo(updatedegree);
	}

	UpdateLyDo(_item: any) {
		this.processWorkService.updateStatusNode(_item).subscribe(res => {
			if (res && res.status == 1) {
				this.dialogRef.close({
					_item
				});
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	//=============================Cập nhật tình trạng nhiệm vụ Type == 12 ============================================
	TypeReason: number = 0;
	listReason: any[] = [];
	LoadListReason() {
		this.listReason = [];
		this.processWorkService.getReasonList(this.TypeReason, this.IDQuyTrinh).subscribe(res => {
			if (res && res.status == 1) {
				if (res.data.length > 0) {
					this.listReason = res.data;
				} else {
					this.listReason = [];
				}
			}
			this.changeDetectorRefs.detectChanges();
		})
	}

	prepareTTNV(): any {
		const controls = this.itemForm.controls;
		let _item = {
			TasksID: +this.ID,
			Type: this.TypeReason,
			ReasonID: controls['reason'].value,
		}
		return _item;
	}
	CapNhatTinhTrangNhiemVu() {
		const controls = this.itemForm.controls;
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		const updatedegree = this.prepareTTNV();
		this.UpdateTTNV(updatedegree);

	}
	UpdateTTNV(_item: any) {
		this.processWorkService.updateStatusTasks(_item).subscribe(res => {
			if (res && res.status == 1) {
				this.dialogRef.close({
					_item
				});
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	//=============================Xử lý type == 13 (2/2/2021)=================================
	DatField: any[] = [];
	goBackForm() {
		this.dialogRef.close({
			item: true
		})
	}

	//===============================Xử lý type == 15=========================================
	onMoved_Columns(item: any, list: any[], effect: DropEffect) {
		const index = list.indexOf(item);
		list.splice(index, 1);
	}

	onDrop_Columns(event: DndDropEvent, list?: any[]) {
		if (list) {
			let index = event.index;
			if (typeof index === "undefined") {
				index = list.length;
			}
			list.splice(index, 0, event.data);
		}
	}

	LuuViTriGiaiDoan() {
		let data = [];
		this.listGiaiDoan.map((item, index) => {
			let dt = {
				RowID: item.RowID,
				Priority: index + 1
			}
			data.push(dt);
		})
		this.layoutUtilsService.showWaitingDiv();
		this.processWorkService.Update_Priority(data).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			if (res && res.status == 1) {
				this.dialogRef.close({
					data
				});
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	//=============================Type = 16============================================

	prepareTaiLieu(): any {
		const controls = this.itemForm.controls;
		let Data_File = [];
		if (controls['fileControl'].value.length > 0) {
			for (var i = 0; i < controls['fileControl'].value.length; i++) {
				let _file = {
					File: controls["fileControl"].value[i].strBase64,
					FileName: controls["fileControl"].value[i].filename,
					ContentType: controls["fileControl"].value[i].type,
				}
				Data_File.push(_file);
			}
		}

		let _item = {
			RowID: +this.ID,
			DescriptionFileList: Data_File,
			isAdd: true,
		}
		return _item;
	}

	LuuTaiLieu() {
		const controls = this.itemForm.controls;
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		if (controls['fileControl'].value.length == 0) {
			let message = 'Vui lòng bổ sung tài liệu';
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			return;
		}

		const updatedegree = this.prepareTaiLieu();
		this.UpdateTaiLieu(updatedegree);
	}

	UpdateTaiLieu(_item: any) {
		this.processWorkService.updateTaiLieu(_item).subscribe(res => {
			if (res && res.status == 1) {
				this.dialogRef.close({
					_item
				});
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	//=============================Type = 17============================================
	Loai: number;//1 Tài liệu 2 Tài lieuek kết quả
	prepareTaiLieuCV(): any {
		const controls = this.itemForm.controls;
		let Data_File = [];
		if (controls['fileControl'].value.length > 0) {
			for (var i = 0; i < controls['fileControl'].value.length; i++) {
				let _file = {
					File: controls["fileControl"].value[i].strBase64,
					FileName: controls["fileControl"].value[i].filename,
					ContentType: controls["fileControl"].value[i].type,
				}
				Data_File.push(_file);
			}
		}

		let _item = {
			RowID: +this.ID,
			DescriptionFileList: Data_File,
			isAdd: true,
			Type: this.Loai
		}
		return _item;
	}

	LuuTaiLieuCV() {
		const controls = this.itemForm.controls;
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}

		if (controls['fileControl'].value.length == 0) {
			let message = 'Vui lòng bổ sung tài liệu';
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			return;
		}

		const updatedegree = this.prepareTaiLieuCV();
		this.UpdateTaiLieuCV(updatedegree);
	}

	UpdateTaiLieuCV(_item: any) {
		this.processWorkService.updateTaiLieuCongViec(_item).subscribe(res => {
			if (res && res.status == 1) {
				this.dialogRef.close({
					_item
				});
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	getTypeCV() {
		let text = "";
		if (this.Loai == 1) {
			text = "Tài liệu đính kèm";
		} else {
			text = "Kết quả công việc";
		}
		return text;
	}

	//=====================Type 18 - Thay đổi người quản lý giai đoạn=================================
	public bankFilterCtrlQL: FormControl = new FormControl();
	public filteredBanksQL: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	listQuanLy: any[] = [];
	dataQuanLy: any[] = [];

	loadDataQLGD() {
		this.danhMucChungService.GetDSNguoiTheoDoi().subscribe(res => {
			if (res.data && res.data.length > 0) {
				this.listQuanLy = res.data;
				this.setUpDropSearcQLGD();
				this.changeDetectorRefs.detectChanges();
			}
		});
	}

	setUpDropSearcQLGD() {
		this.bankFilterCtrlQL.setValue('');
		this.filterBanksQL();
		this.bankFilterCtrlQL.valueChanges
			.pipe()
			.subscribe(() => {
				this.filterBanksQL();
			});
	}

	protected filterBanksQL() {
		if (!this.listQuanLy) {
			return;
		}
		// get the search keyword
		let search = this.bankFilterCtrlQL.value;
		if (!search) {
			this.filteredBanksQL.next(this.listQuanLy.slice());
			return;
		} else {
			search = search.toLowerCase();
		}
		// filter the banks
		this.filteredBanksQL.next(
			this.listQuanLy.filter(bank => bank.Title.toLowerCase().indexOf(search) > -1)
		);
	}

	QuanLyGiaiDoan(){
		const controls = this.itemForm.controls;
		if (this.itemForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);
			return;
		}
		const updatedegree = this.prepareQLGD();
		this.UpdateQLGD(updatedegree);
	}

	prepareQLGD(): any {
		const controls = this.itemForm.controls;
		let _item = {
			ID: this.IDGiaiDoan,/// 1: id node; 2: id todo; 3: id process 
			Type: 2,  /// 1: người thực hiện (công việc), 2: người theo dõi (quy trình); 3: người theo dõi (công việc chi tiết); 2: Người quản lý giai đoạn (công việc) 
			WorkType: 1,  /// 1: Nhiệm vụ; 2: công việc chi tiết; 3: quy trình
			NVIDList: controls['quanlygiaidoan'].value
		}
		return _item;
	}

	UpdateQLGD(_item: any) {
		this.processWorkService.updateImplementer(_item).subscribe(res => {
			if (res && res.status == 1) {
				this.dialogRef.close({
					_item
				});
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}
}
