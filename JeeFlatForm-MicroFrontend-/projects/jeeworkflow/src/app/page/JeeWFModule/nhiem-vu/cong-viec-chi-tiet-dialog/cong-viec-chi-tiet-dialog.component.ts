import { Component, OnInit, Inject, ChangeDetectionStrategy, HostListener, ViewChild, ElementRef, ChangeDetectorRef, Input, SimpleChange, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, ReplaySubject, Subscription } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToDoDataModel } from '../Model/process-work.model';
import { DynamicFormService } from '../../component/dynamic-form/dynamic-form.service';
import { JeeChooseMemberComponent } from '../../component/jee-choose-member/jee-choose-member.component';
import { tinyMCE } from '../../component/tinyMCE/tinyMCE';
import { LayoutUtilsService, MessageType } from 'projects/jeeworkflow/src/modules/crud/utils/layout-utils.service';
import { DanhMucChungService } from '../../../services/danhmuc.service';
import { ProcessWorkService } from '../../../services/process-work.service';
@Component({
	selector: 'kt-cong-viec-chi-tiet-dialog',
	templateUrl: './cong-viec-chi-tiet-dialog.component.html',
})
export class CongViecChiTietDialogComponent implements OnInit {
	item: ToDoDataModel;
	oldItem: ToDoDataModel
	itemForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	@ViewChild("focusInput", { static: true }) focusInput: ElementRef;
	disabledBtn: boolean = false;
	selectedTab: number = 0;

	NodeID: number;

	listNguoiThucHien: any[] = [];
	listNguoiGiaoViec: any[] = [];
	listNguoiTheoDoi: any[] = [];
	listCachGiaoViec: any[] = [];
	//====================Người Thực Hiện====================
	public bankFilterCtrlNTH: FormControl = new FormControl();
	public filteredBanksNTH: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	//================Check goBack form======================
	isDirty$: Observable<boolean>;
	sub: Subscription;
	store: any;
	isBack: boolean;
	//=========================================================
	ListNguoiThucHien: any[] = [];
	ListNguoiTheoDoi: any;

	constructor(public dialogRef: MatDialogRef<CongViecChiTietDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private changeDetectorRefs: ChangeDetectorRef,
		private _ProcessWorkService: ProcessWorkService,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private danhMucChungService: DanhMucChungService,
		public dialog: MatDialog,
		public dynamicFormService: DynamicFormService,) { }
	/** LOAD DATA */

	ngOnInit() {
		this.reset();
		this.tinyMCE = tinyMCE;
		this.item = this.data._item;
		this.NodeID = this.data._NodeID;
		if (this.item.RowID > 0) {
			this.viewLoading = true;
			this.priority = this.item.Priority;
			if(+this.item.Time_Type != 3){
				this.time = this.item.NumberofTime;
			}else{
				this.time = "";
			}
			this.ListNguoiThucHien = this.item.Data_Implementer;
			this.ListNguoiTheoDoi = this.item.Data_Follower;
			this.createForm();
		}
		else {
			this.viewLoading = false;
			this.createForm();
		}
		this.focusInput.nativeElement.focus();
	}

	createForm() {
		this.itemForm = this.fb.group({
			tencongviec: [this.item.TaskName, Validators.required],
			mota: [this.item.Description],
		});
		this.itemForm.controls["tencongviec"].markAsTouched();
		
		this.store = new BehaviorSubject({
			tencongviec: this.item.TaskName,
			mota: this.item.Description,
		});
	}

	loadData1() {
		this.danhMucChungService.GetDSNguoiTheoDoi().subscribe(res => {
			if (res.data && res.data.length > 0) {
				this.listNguoiThucHien = res.data;
				this.setUpDropSearcThucHien();
				this.changeDetectorRefs.detectChanges();
			}
		});
	}

	setUpDropSearcThucHien() {
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
			this.listNguoiThucHien.filter(bank => bank.Title.toLowerCase().indexOf(search) > -1)
		);
	}

	/** UI */
	getTitle(): string {
		let result = this.translate.instant('process.themmoicongviec');
		if (!this.item || !this.item.RowID) {
			return result;
		}

		result = this.translate.instant('process.chinhsuacongviec');
		return result;
	}
	/** ACTIONS */
	prepareCustomer(): ToDoDataModel {

		const controls = this.itemForm.controls;
		const _item = new ToDoDataModel();
		_item.RowID = this.item.RowID;
		_item.NodeID = +this.NodeID;
		_item.TaskName = controls['tencongviec'].value;
		if(this.time == ""){
			_item.Time_Type = "3";//Không giới hạn thời gian
		}else{
			_item.Time_Type = "1";
			_item.NumberofTime = this.time;
		}
		_item.Priority = this.priority;
		 //============Xử lý cho phần lưu người thực hiện============
		 let dataThucHien = [];
		 if (this.ListNguoiThucHien.length > 0) {
			 this.ListNguoiThucHien.map((item, index) => {
				 let dt = {
					 ObjectID: item.ObjectID,
					 ObjectType: "3",
				 }
				 dataThucHien.push(dt);
			 });
		 }
		_item.Data_Implementer = dataThucHien;

		//============Xử lý cho phần lưu người theo dõi============
		let dataTheoDoi = [];
		this.ListNguoiTheoDoi.map((item, index) => {
			let dt = {
				ObjectID: item.ObjectID,
				ObjectType: "3",
			}
			dataTheoDoi.push(dt);
		});
		_item.Data_Follower = dataTheoDoi;

		_item.Description = controls['mota'].value;
		return _item;
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

		if (this.ListNguoiThucHien.length == 0) {
			let message = 'Vui lòng chọn người thực hiện công việc';
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			return;
		}

		const updatedegree = this.prepareCustomer();
		if (updatedegree.RowID > 0) {
			this.Update(updatedegree, withBack);
		} else {
			this.Create(updatedegree, withBack);
		}
	}

	Update(_item: ToDoDataModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.disabledBtn = true;
		this._ProcessWorkService.updateToDo(_item).subscribe(res => {
			/* Server loading imitation. Remove this on real code */
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				if (withBack == true) {
					this.dialogRef.close({
						_item
					});
				}
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	Create(_item: ToDoDataModel, withBack: boolean) {
		this.loadingAfterSubmit = true;
		this.disabledBtn = true;
		this._ProcessWorkService.updateToDo(_item).subscribe(res => {
			this.disabledBtn = false;
			this.changeDetectorRefs.detectChanges();
			if (res && res.status === 1) {
				if (withBack == true) {
					this.dialogRef.close({
						_item
					});
				}
				else {
					this.ListNguoiThucHien = [];
					this.ngOnInit();
				}
			}
			else {
				this.viewLoading = false;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	reset() {
		this.item = Object.assign({}, this.oldItem);
		this.createForm();
		this.ListNguoiThucHien = [];
		this.ListNguoiTheoDoi = [];
		this.priority = 0;
		this.time = '';
		this.hasFormErrors = false;
		this.itemForm.markAsPristine();
		this.itemForm.markAsUntouched();
		this.itemForm.updateValueAndValidity();
	}

	DonViChange(val: any) {
		if (+val == 3) {
			this.itemForm.controls["thoigian"].setValue("0");
		} else {
			if (this.item.NumberofTime != "" && this.item.NumberofTime != null) {
				this.itemForm.controls["thoigian"].setValue("" + this.item.NumberofTime);
			} else {
				this.itemForm.controls["thoigian"].setValue("");

			}
		}
	}

	@HostListener('document:keydown', ['$event'])
	onKeydownHandler(event: KeyboardEvent) {
		if (event.ctrlKey && event.keyCode == 13)//phím Enter
		{
			this.item = this.data._item;
			if (this.viewLoading == true) {
				this.onSubmit(true);
			}
			else {
				this.onSubmit(false);
			}
		}
	}

	//===============================================Tab công việc chi tiêt===============================
	goBack() {
		if (this.isBack) {
			const _title = this.translate.instant("landingpagekey.xacnhan");
			const _description = this.translate.instant("landingpagekey.bancomuonthoatkhong");
			const dialogRef = this.layoutUtilsService.updateStatusForCustomersNew(_title, _description);
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				} else {
					this.isDirty$ = new Observable(observer => {
						observer.next(false);
					});
					this.dialogRef.close();
				}
			})
		} else {
			this.dialogRef.close();
		}
	}
	ngOnDestroy() {
		this.sub && this.sub.unsubscribe();
	}

	AddNguoiThucHien() {
		let _item = [];
		this.ListNguoiThucHien.map((item, index) => {
			_item.push('' + item.ObjectID);
		});
		const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item }, panelClass: ['sky-padding-0', 'width600'], });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			if (res.data.length > 0) {
				this.ListNguoiThucHien = [];
				res.data.map((item, index) => {
					let data = {
						ObjectID: item.UserId,
						ObjectName: item.FullName,
						FirstName: item.FirstName,
						AvartarImgURL: item.AvartarImgURL,
						Jobtitle: item.Jobtitle,

					}
					this.ListNguoiThucHien.push(data);
				})
			} else {
				this.ListNguoiThucHien = [];
			}
			this.changeDetectorRefs.detectChanges();
		});
	}

	AddNguoiTheoDoi() {
		let _item = [];
		this.ListNguoiTheoDoi.map((item, index) => {
			_item.push('' + item.ObjectID);
		});
		const dialogRef = this.dialog.open(JeeChooseMemberComponent, { data: { _item }, panelClass: ['sky-padding-0', 'width600'], });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			if (res.data.length > 0) {
				this.ListNguoiTheoDoi = [];
				res.data.map((item, index) => {
					let data = {
						ObjectID: item.UserId,
						ObjectName: item.FullName,
						FirstName: item.FirstName,
						AvartarImgURL: item.AvartarImgURL,
						Jobtitle: item.Jobtitle,

					}
					this.ListNguoiTheoDoi.push(data);
				})
			} else {
				this.ListNguoiTheoDoi = [];
			}
			this.changeDetectorRefs.detectChanges();
		});
	}
	//============================Gán độ ưu tiên==========================
	list_priority: any = [
		{
			name: 'Urgent',
			value: 1,
			icon: 'fab fa-font-awesome-flag text-danger',
		},
		{
			name: 'High',
			value: 2,
			icon: 'fab fa-font-awesome-flag text-warning',
		},
		{
			name: 'Normal',
			value: 3,
			icon: 'fab fa-font-awesome-flag text-info',
		},
		{
			name: 'Low',
			value: 4,
			icon: 'fab fa-font-awesome-flag text-muted',
		},
		{
			name: 'Clear',
			value: 0,
			icon: 'fas fa-times text-danger',
		},
	];
	public priority = 0
	getPriority(id) {
		if (id > 0) {
			var item = this.list_priority.find(x => x.value == id)
			if (item)
				return item.icon;
			return 'far fa-flag';
		} else {
			return 'far fa-flag'
		}
	}

	//=============================Thời gian hoàn thành====================
	@ViewChild("times", { static: false }) times: ElementRef;
	public time: string = '';

	submitOut() {
		this.time = this.times.nativeElement.value;
	}
	//==========================Mô tả======================================
	public tinyMCE = {};
}
