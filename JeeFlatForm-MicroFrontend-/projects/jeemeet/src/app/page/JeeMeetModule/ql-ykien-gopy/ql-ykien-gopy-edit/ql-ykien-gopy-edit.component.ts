// Angular
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, Inject, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
// Material
// import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
// RxJS
import { Observable, Subscription, ReplaySubject } from 'rxjs';
// NGRX
// Service
// import { LayoutUtilsService, MessageType } from '../../../../../../core/_base/crud';
// import { QuanLyYKienGopYModel } from '../_model/ql-ykien-gopy.model';
// import { QuanLyYKienGopYService } from '../-service/ql-ykien-gopy.service';
// import { TokenStorage } from '../../../../../../../app/core/auth/_services/token-storage.service';
import { VoteDetailComponent } from '../vote-detail/vote-detail.component'
import { QuanLyYKienGopYModel } from '../_model/ql-ykien-gopy.model';
import { QuanLyYKienGopYService } from '../_service/ql-ykien-gopy.service';
import { LayoutUtilsService } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
import { environment } from 'projects/jeemeet/src/environments/environment';

@Component({
	selector: 'app-kt-ql-ykien-gopy-edit',
	templateUrl: './ql-ykien-gopy-edit.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuanLyYKienGopYEditComponent implements OnInit {

	// Public properties
	QuanLyYKienGopY: QuanLyYKienGopYModel;
	QuanLyYKienGopYForm: FormGroup;
	hasFormErrors: boolean = false;
	filterStatic: Observable<string[]>;
	disabledBtn: boolean = false;
	isShowImage: boolean = false;
	IsXem: boolean = false;
	viewLoading: boolean = false;
	@ViewChild('inputSDT', { static: true }) inputSDT: ElementRef;
	@ViewChild('scrollMe', { static: true }) myScrollContainer: ElementRef;
	accs: any[] = [];
	dataI:any;
	dataSource: any[] = [];
	dataNguoiDung: any[] = [];
	searchNguoiDung: string = '';
	filteredNguoiDungs: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
	isEdit:boolean;
  domain = environment.CDN_DOMAIN ;

	// Private password
	private componentSubscriptions: Subscription;
	/**
	 * Component constructor
	 *
	 * @param dialog: MatDialog
	 * @param data: any
	 * @param QuanLyYKienGopYFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService,
	 * @param QuanLyYKienGopYService: QuanLyYKienGopYService, *
	 * @param changeDetectorRefs: ChangeDetectorRef
	 */
	constructor(

		public dialogRef: MatDialogRef<QuanLyYKienGopYEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private QuanLyYKienGopYFB: FormBuilder,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private quanLyYKienGopYService: QuanLyYKienGopYService,
		private changeDetectorRefs: ChangeDetectorRef,
		private translate: TranslateService,


	) { }

	/**
	 * On init
	 */
	ngOnInit() {

		//lấy data đối tượng dc truyền từ QuanLyYKienGopYlistcomponent qua
		//this.loadNguoiDung();
		this.QuanLyYKienGopY = this.data.QuanLyYKienGopY;
		this.isEdit=this.data.QuanLyYKienGopY.allowEdit;
	//	this.createForm();

		if (this.QuanLyYKienGopY.RowID > 0) {
			this.viewLoading = true;
			this.QuanLyYKienGopY.IdCuocHop=this.QuanLyYKienGopY.RowID
			this.quanLyYKienGopYService.getQuanLyYKienGopYById(this.data.QuanLyYKienGopY.IdCuocHop).subscribe(res => {
				this.viewLoading = false;
				if (res && res.status == 1) {
					this.QuanLyYKienGopY = res.data;
					this.dataI = res.data;
					this.dataSource= res.data[0].DanhSachYKien;
					this.accs = res.data.accs;
					this.createForm();
					this.changeDetectorRefs.detectChanges();
				} else
				this.layoutUtilsService.showError(res.error.message);;
			})
		}

	}

	// loadData(){
	// 	this.quanLyYKienGopYService.getQuanLyYKienGopYById(this.QuanLyYKienGopY.IdCuocHop).subscribe(res => {
	// 		if (res.data.length > 0) {
	// 			this.dataSource = res.data;
	//   		}
	//   this.changeDetectorRefs.detectChanges()
	// 	});
	//   }
	/**
	 * On destroy
	 */
	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}
	}





	/**
	 * Create form
	 */
	createForm() {

		this.IsXem = !this.data.QuanLyYKienGopY.allowEdit;
		this.QuanLyYKienGopYForm = this.QuanLyYKienGopYFB.group({
			NoiDung: [this.QuanLyYKienGopY.NoiDung],
			//CreatedDate: [this.QuanLyYKienGopY.CreatedDate],
		});
		if (this.IsXem)
			this.QuanLyYKienGopYForm.disable();
		this.changeDetectorRefs.detectChanges();
	}

	/**
	 * Returns page title
	 */
	getTitle(): string {



				//return this.translate.instant('OBJECT.DETAIL.TITLE', { name: this.translate.instant('MENU_YKIENGOPY.NAME').toLowerCase()})+" - "+this.QuanLyYKienGopY.MeetingContent;//`Xem chi tiết nhóm cư dân ${this.QuanLyYKienGopY.NhomCuDan}`
				return this.translate.instant('MENU_YKIENGOPY.TITLE_DS')+" - "+this.data.QuanLyYKienGopY.MeetingContent;

	}


	/**
	* Check control is invalid
	* @param controlName: string
	*/
	isControlInvalid(controlName: string): boolean {
		const control = this.QuanLyYKienGopYForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;
	}

	/**
	 * Save data
	 * @param withBack: boolean
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.QuanLyYKienGopYForm.controls;
		if (this.QuanLyYKienGopYForm.invalid) {
			Object.keys(controls).forEach(controlName => {
				controls[controlName].markAsTouched();

			}
			);

			this.hasFormErrors = true;
			let element = this.myScrollContainer.nativeElement

			this.myScrollContainer.nativeElement.scrollTop = 0;
			this.changeDetectorRefs.detectChanges();
			return;
		}

		// tslint:disable-next-line:prefer-const
		let editedQuanLyYKienGopY = this.prepareQuanLyYKienGopY();
		// if (this.QuanLyYKienGopY.RowID > 0) {
		// 	this.updateQuanLyYKienGopY(editedQuanLyYKienGopY)
		// 	return;
		// }
		// this.addQuanLyYKienGopY(editedQuanLyYKienGopY);
	}
	close() {
		this.dialogRef.close();
	}
  close_ask() {
    const dialogRef = this.layoutUtilsService.deleteElement(this.translate.instant('COMMON.XACNHANDONG'), this.translate.instant('COMMON.CLOSED'));
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.dialogRef.close();
		});
  }
	/**
	 * Returns object for saving
	 */
	prepareQuanLyYKienGopY(): QuanLyYKienGopYModel {

		const controls = this.QuanLyYKienGopYForm.controls;
//		const _QuanLyYKienGopY = new QuanLyYKienGopYModel();
		var data: any = {}
		//gán lại giá trị id
		if (this.data.RowID > 0) {
			data.RowID = this.QuanLyYKienGopY.RowID;
		}

		data.NoiDung = controls['NoiDung'].value;
		return data;
	}


	editAcTive(QuanLyYKienGopY: any) {

		const _message: string = this.translate.instant("object.config.message", {
			name: this.translate.instant("MENU_YKIENGOPY.ACTIVE")
		});
		const _title: string = !QuanLyYKienGopY.IsActive ? this.translate.instant('MENU_KHAOSAT.TITLE', {name: this.translate.instant('MENU_YKIENGOPY.NAME')}) : this.translate.instant('MENU_KHAOSAT.TITLE_', {name: this.translate.instant('MENU_YKIENGOPY.NAME')});
		const _description: string = !QuanLyYKienGopY.IsActive ? this.translate.instant('MENU_KHAOSAT.DESCRIPTION', {name: this.translate.instant('MENU_YKIENGOPY.NAME')}) : this.translate.instant('MENU_KHAOSAT.DESCRIPTION_', {name: this.translate.instant('MENU_YKIENGOPY.NAME')});
		const _waitDesciption: string = !QuanLyYKienGopY.IsActive ? this.translate.instant('MENU_KHAOSAT.WAIT_DESCRIPTION', {name: this.translate.instant('MENU_YKIENGOPY.NAME')}) : this.translate.instant('MENU_KHAOSAT.WAIT_DESCRIPTION_', {name: this.translate.instant('MENU_YKIENGOPY.NAME')});
		const _deleteMessage: string = !QuanLyYKienGopY.IsActive ? this.translate.instant('MENU_KHAOSAT.MESSAGE', {name: this.translate.instant('MENU_YKIENGOPY.NAME')}) : this.translate.instant('MENU_KHAOSAT.MESSAGE_', {name: this.translate.instant('MENU_YKIENGOPY.NAME')});
		const _deleteMessageno: string = !QuanLyYKienGopY.IsActive ? this.translate.instant('MENU_KHAOSAT.MESSAGENO', {name: this.translate.instant('MENU_YKIENGOPY.NAME')}) : this.translate.instant('MENU_KHAOSAT.MESSAGENO_', {name: this.translate.instant('MENU_YKIENGOPY.NAME')});
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.quanLyYKienGopYService.activeDetail(QuanLyYKienGopY.IdRow, !QuanLyYKienGopY.IsActive).subscribe(res => {
				if (res.status > 0) {
					this.layoutUtilsService.showInfo(_message);
				}
				else {
					this.layoutUtilsService.showError(res.error.message);;
				}
				this.ngOnInit();
			});

		});
	}



	/**
	 * Close alert
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;
	}

	numberOnly(event): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;
	}


	viewDetailVoteYes(item) {
		let _data = Object.assign({}, item);
		_data.VoteStatus = 1;
		this.voteDetail(_data);

	}


	viewDetailVoteNo(item) {
		let _data = Object.assign({}, item);
		_data.VoteStatus = 0;
		this.voteDetail(_data);

	}


	voteDetail(_data) {
		const dialogRef = this.dialog.open(VoteDetailComponent, {
			data: { _data },
			// width: "900px",
		});
		dialogRef.afterClosed().subscribe((res) => { });

	}


}
