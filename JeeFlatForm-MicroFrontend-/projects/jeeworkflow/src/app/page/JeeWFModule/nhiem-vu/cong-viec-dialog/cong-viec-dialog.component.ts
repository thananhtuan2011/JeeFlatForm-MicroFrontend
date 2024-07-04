import { Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// Material
// RXJS
import { catchError, debounceTime, distinctUntilChanged, finalize, share, takeUntil, tap } from 'rxjs/operators';
import { fromEvent, merge, of, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
// Services
// Models
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { ProcessWorkService } from '../../../services/process-work.service';
import { CongViecDialogUpdateComponent } from '../../component/cong-viec-dialog-update/cong-viec-dialog-update.component';

@Component({
	selector: 'kt-cong-viec-dialog',
	templateUrl: './cong-viec-dialog.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})

export class CongViecDialogComponent implements OnInit {
	item: any;
	oldItem: any
	itemForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	loadingAfterSubmit: boolean = false;
	disabledBtn: boolean = false;
	listProcess: any[] = [];
	ShowDF: boolean = false;
	ProcessID: number;
	ID_ToDo: number = 0;
	//=====================================Thông tin data hiển thị=====================
	TenQuyTrinh: string = '';
	TenNhiemVu: string = '';
	TenCongViec: string = '';
	NguoiTao: string = '';
	ThoiGianTao: string = '';
	//==================Sử dụng comment=======================================
	topicObjectID: string;
	private readonly onDestroy = new Subject<void>();

	constructor(public dialogRef: MatDialogRef<CongViecDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private fb: FormBuilder,
		private changeDetectorRefs: ChangeDetectorRef,
		private layoutUtilsService: LayoutUtilsService,
		private translate: TranslateService,
		private router: Router,
		public dialog: MatDialog,
		public _ProcessWorkService: ProcessWorkService) { }
	/** LOAD DATA */
	ngOnInit() {
		this.ID_ToDo = this.data._item.RowID;
		this.InitComment("kt-cong-viec-dialog" + this.ID_ToDo);
		this._ProcessWorkService.getToDoDetail(this.ID_ToDo).subscribe(res => {
			if (res && res.status == 1) {
				this.item = res.data;
				this.TenQuyTrinh = res.data.Process;
				this.TenNhiemVu = res.data.Tasks;
				this.TenCongViec = res.data.ToDo;
				this.NguoiTao = res.data.CreatedBy;
				this.ThoiGianTao = res.data.CreatedDate;
				this.changeDetectorRefs.detectChanges();
			} else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		})
	}

	InitComment(id:string){
		this._ProcessWorkService.getTopicObjectIDByComponentName(id).pipe(
			tap((res) => {
				this.topicObjectID = res;
				this.changeDetectorRefs.detectChanges();
			}),
			catchError(err => {
				console.log(err);
				return of();
			}),
			finalize(() => { }),
			share(),
			takeUntil(this.onDestroy),
		).subscribe();
	}

	ngOnDestroy(): void {
		this.onDestroy.next();
	}

	/** UI */
	getTitle() {

	}
	/** ACTIONS */

	onSubmit(withBack: boolean = false) {
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

	}

	//===============Các hàm xử lý tạo class===============
	getItemStatusString(status: number): string {
		switch (status) {
			case 0:
				return 'Đang tạm dừng';
			case 1:
				return 'Đang thực hiện';
			case 2:
				return 'Hoàn thành';
		}
		return 'Chưa thực hiện';
	}


	getRight(p: any) {
		return p == 1 ? 'tt-danglam-right' : 'tt-hoanthanh-right';
	}



	goBack() {
		this.dialogRef.close();
	}
	//=====================================================Xóa công việc chi tiết==================================
	XoaCongViecCT() {
		if (this.item.IsEdit) {
			const _title = this.translate.instant('GeneralKey.xoa');
			const _description = this.translate.instant('GeneralKey.bancochacchanmuonxoakhong');
			const _waitDesciption = this.translate.instant('GeneralKey.dulieudangduocxoa');
			const _deleteMessage = this.translate.instant('GeneralKey.xoathanhcong');

			const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}

				this._ProcessWorkService.delToDo(this.item.RowID).subscribe(res => {
					if (res && res.status === 1) {
						this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete, 4000, true, false, 3000, 'top', 1);
						this.dialogRef.close({
							_item: this.item
						});
					}
					else {
						this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
					}
				});
			});
		}
	}
	//=====================================================Cập nhật công việc chi tiết==================================
	CapNhatCongViec(val) {
		const _title = this.translate.instant('workprocess.capnhatcongviec');
		let _description: any;
		if (val == 0) {
			_description = this.translate.instant('workprocess.bancochacchanmuontamdungcongviec');
		}
		if (val == 1) {
			_description = this.translate.instant('workprocess.bancochacchanmuonthuchiencongviec');
		}
		if (val == 2) {
			_description = this.translate.instant('workprocess.bancochacchanmuonhoanthanhcongviec');
		}
		const _waitDesciption = this.translate.instant('workprocess.dulieudangduocxyly');

		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			if (val == 0) {
				const dialogRef = this.dialog.open(CongViecDialogUpdateComponent, {
					data: { _item: this.item, _type: 5 }
				});
				dialogRef.afterClosed().subscribe(res => {
					if (!res) {
						return;
					}
					this.ngOnInit();
				});
			} else {
				let item = {
					ID: +this.item.RowID,
					Status: +val,
				}
				this._ProcessWorkService.updateStatusToDo(item).subscribe(res => {
					if (res && res.status == 1) {
						this.ngOnInit();
					} else {
						this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
					}
				});
			}
		});

	}
	///============================================================================================================
	TenFile: string = '';
	File: string = ''
	@ViewChild('myInput', { static: true }) myInputVariable: ElementRef;
	FileSelected(evt: any) {
		if (evt.target.files && evt.target.files.length) {//Nếu có file	
			var size = evt.target.files[0].size;
			if (size / 1024 / 1024 > 3) {
				this.layoutUtilsService.showActionNotification("File upload không được vượt quá 3 MB", MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
				return;
			}
			let file = evt.target.files[0]; // Ví dụ chỉ lấy file đầu tiên
			this.TenFile = file.name;
			let reader = new FileReader();
			reader.readAsDataURL(evt.target.files[0]);
			let base64Str;

			setTimeout(() => {
				base64Str = reader.result as String;
				var metaIdx = base64Str.indexOf(';base64,');
				base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
				this.File = base64Str;
			}, 1000);
		} else {
			this.File = "";
		}
	}

	//=======================================Chỉnh sửa=====================================
	CapNhat(val) {
		if (this.item.IsEdit) {
			const _saveMessage = this.translate.instant('GeneralKey.capnhatthanhcong');
			const _messageType = MessageType.Update;
			const dialogRef = this.dialog.open(CongViecDialogUpdateComponent, { data: { _item: this.item, _type: val }, width: '500px' });
			dialogRef.afterClosed().subscribe(res => {
				if (!res) {
					return;
				}
				else {
					this.ngOnInit();
					this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
				}
			});
		}
	}

	//=======================================Thêm người theo dõi chi tiết công việc====================================
	ThemNguoiTheoDoi(val) {
		const _saveMessage = this.translate.instant('GeneralKey.capnhatthanhcong');
		const _messageType = MessageType.Update;
		const dialogRef = this.dialog.open(CongViecDialogUpdateComponent, { data: { _item: this.item, _type: val }, width: '500px' });
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			else {
				this.ngOnInit();
				this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
			}
		});
	}

	//======================Xóa người theo dõi chi tiết công việc======================================
	XoaNguoiTheoDoi(_item) {
		this._ProcessWorkService.delFollower(this.item.RowID, _item.ObjectID, 2).subscribe(res => {
			if (res && res.status === 1) {
				this.ngOnInit();
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	//======================Follow chi tiết công việc======================================
	TheoDoi() {
		this._ProcessWorkService.FollowNode(this.item.RowID, !this.item.IsFollow, 2).subscribe(res => {
			if (res && res.status === 1) {
				this.ngOnInit();
			}
			else {
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 9999999999, true, false, 3000, 'top', 0);
			}
		});
	}

	//==========================Cập nhật người thực hiện====================================
	CapNhatNguoiThucHien() {
		let saveMessageTranslateParam = '';
		saveMessageTranslateParam = 'GeneralKey.capnhatthanhcong';
		const _saveMessage = this.translate.instant(saveMessageTranslateParam);
		const _messageType = MessageType.Create;
		const dialogRef = this.dialog.open(CongViecDialogUpdateComponent, {
			data: { _item: this.item, _type: 6 }

		});
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.layoutUtilsService.showActionNotification(_saveMessage, _messageType, 4000, true, false);
			this.ngOnInit();
		});
	}
}
