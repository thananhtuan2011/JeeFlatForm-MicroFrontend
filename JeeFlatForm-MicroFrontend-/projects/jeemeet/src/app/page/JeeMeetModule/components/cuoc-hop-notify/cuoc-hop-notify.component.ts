// Angular
import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Inject,
	ViewChild,
	ElementRef,
} from "@angular/core";
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators,
} from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
// Material

// RxJS
import { Observable, Subscription, ReplaySubject } from "rxjs";
// Service
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { QuanLyCuocHopService } from "../../_services/quan-ly-cuoc-hop.service";
import { LayoutUtilsService } from "projects/jeemeet/src/modules/crud/utils/layout-utils.service";
import { environment } from "projects/jeemeet/src/environments/environment";
@Component({
	selector: "kt-cuoc-hop-notify",
	templateUrl: "./cuoc-hop-notify.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CuocHopNotiFyComponent implements OnInit {
	toppings = new FormControl("");
	// Public properties
	NotifyCH: any = {};
	NotifyForm: FormGroup;
	hasFormErrors: boolean = false;
	filterStatic: Observable<string[]>;
	ListTieuChiPL3: any[] = [];
	isShowImage: boolean = false;
	IsXem: boolean = false;
	IsDel: boolean = false;
	viewLoading: boolean = false;
	@ViewChild("scrollMe", { static: true }) myScrollContainer: ElementRef;

	// Private password
	selectIDCuocHop: string = "0";
	IdCuocHop: string = "0";
	Type: number = 0
	DSDanhGiaTam: any[] = [];
	dataSource: any[] = [];
	DSCauHoi: any[] = [];
	DSCauHoiTam: any[] = [];
	ListFileDinhKem: any[] = [];
	displayedColumns: string[] = ["STT", "Id", "action"];
	private componentSubscriptions: Subscription;

	file: string = "";
	file1: string = "";
	file2: string = "";
	lstCuocHop: any[] = [];
	RowID: number = 1;
	IdThongBao: number = 0;

	dataTem = {
		Id: 0,
		NoiDungCauHoi: '',
	};

	inputId: any[] = [];

	domain = environment.APIROOT;

	/**
	 * Component constructor
	 *
	 * @param dialog: MatDialog
	 * @param data: any
	 * @param NotifyCHFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService,
	 * @param QLCuocHopService: QLCuocHopService, *
	 * @param changeDetectorRefs: ChangeDetectorRef
	 */
	constructor(
		public dialogRef: MatDialogRef<CuocHopNotiFyComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private NotifyCHFB: FormBuilder,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private QLCuocHopService: QuanLyCuocHopService,
		private changeDetectorRefs: ChangeDetectorRef,
		private translate: TranslateService
	) { }

	/**
	 * On init
	 */
	ngOnInit() {
		this.NotifyCH = this.data._data;
		this.createForm();
		this.getTitle();
		if (this.NotifyCH.IdThongBao > 0) {
			this.IdThongBao = this.NotifyCH.IdThongBao
			this.QLCuocHopService.getDetailNotify(this.IdThongBao).subscribe(res => {
				if (res && res.status == 1) {
					this.NotifyCH = res.data;
					this.createForm();
					this.getTitle();
				}
				else {
					return;
				}
				this.changeDetectorRefs.detectChanges();
			});
		}

	}


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
	createForm(flag: boolean = false) {
		this.NotifyForm = this.NotifyCHFB.group({
			TieuDe: [this.NotifyCH.TieuDe ? this.NotifyCH.TieuDe : "", Validators.required],
			NoiDung: [this.NotifyCH.NoiDung ? this.NotifyCH.NoiDung : "", Validators.required],
		});
		this.changeDetectorRefs.detectChanges();

	}
	/**
		 * Returns object for saving
		 */
	prepareNotifyCH() {

		const controls = this.NotifyForm.controls;
		var data: any = {};
		//gán lại giá trị id
		data.IdCuocHop = this.NotifyCH.IdM;
		data.TieuDeThongBao = controls["TieuDe"].value;
		data.NoiDungThongBao = controls["NoiDung"].value;

		return data;
	}


	/**
	 * Returns page title
	 */
	getTitle(): string {
		if (this.IdThongBao > 0)
			return 'Nội dung thông báo';
		return 'Gửi thông báo';
	}



	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.NotifyForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;

	}


	validateAllFormFields(NotifyForm: FormGroup) {
		Object.keys(NotifyForm.controls).forEach((field) => {
			const control = NotifyForm.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});

	}


	/**
	 * Save data
	 * @param withBack: boolean
	 */
	onSubmit() {

		// this.hasFormErrors = false;
		// const controls = this.NotifyForm.controls;
		// /** check form */

		// if (this.NotifyForm.invalid) {
		// 	Object.keys(controls).forEach((controlName) => {
		// 		controls[controlName].markAsTouched();

		// 	});
		// 	this.hasFormErrors = true;
		// 	let element = this.myScrollContainer.nativeElement;
		// 	this.myScrollContainer.nativeElement.scrollTop = 0;
		// 	this.changeDetectorRefs.detectChanges();
		// 	return;

		// }
		this.hasFormErrors = false;
		const controls = this.NotifyForm.controls;
		/* check form */
		if (this.NotifyForm.invalid) {
			Object.keys(controls).forEach(controlName =>
				controls[controlName].markAsTouched()
			);

			this.hasFormErrors = true;
			return;
		}

		let editedNotifyCH = this.prepareNotifyCH();
		this.updateNotifyCH(editedNotifyCH);
		return;
		// this.addNotifyCH(editedNotifyCH);

	}

	removeFile(index) {
		this.ListFileDinhKem[index].IsDel = true;
		this.changeDetectorRefs.detectChanges();

	}
	selectEvent(event) {
	}


	// DongForm() {

	// 	const dialogRef = this.layoutUtilsService.deleteElement_close(this.translate.instant('ComMon.XACNHANDONG'), this.translate.instant('ComMon.CLOSE_U'));
	// 	dialogRef.afterClosed().subscribe(res => {
	// 		if (!res) {
	// 			return;
	// 		}
	// 		this.dialogRef.close();
	// 	});
	// }
	close_ask() {
		const dialogRef = this.layoutUtilsService.deleteElement(this.translate.instant('COMMON.XACNHANDONG'), this.translate.instant('COMMON.CLOSED'));
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.dialogRef.close();
		});
	}
	updateNotifyCH(_NotifyCH: any) {

		const _title: string = 'Gửi thông báo cuộc họp';
		const _description: string = 'Bạn có chắc muốn gửi thông báo không?';
		const _waitDesciption: string = 'Đang gửi...';
		const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
		dialogRef.afterClosed().subscribe(res => {
			if (!res) {
				return;
			}
			this.viewLoading = true;
			// this.QLCuocHopService.SendNotify(_NotifyCH).subscribe((res) => {
			// 	this.viewLoading = false;
			// 	if (res.status == 1) {
			// 		// this.layoutUtilsService.showActionNotification(
			// 		// 	res.error.message,
			// 		// 	MessageType.Delete,
			// 		// 	2000,
			// 		// 	true,
			// 		// 	false
			// 		// );
			// 		this.layoutUtilsService.showInfo('Gửi thành công');
			// 		this.dialogRef.close({ _NotifyCH });
			// 	}
			// 	else {
			// 		this.layoutUtilsService.showInfo('Gưi thất bại');
			// 		// this.layoutUtilsService.showActionNotification(
			// 		// 	res.error.message,
			// 		// 	MessageType.Error,
			// 		// 	20000,
			// 		// 	true,
			// 		// 	false
			// 		// );
			// 	}
			// }
			// );
			this.QLCuocHopService.SendNotify(_NotifyCH).subscribe(res => {
				//this.disabledBtn = false;
				this.changeDetectorRefs.detectChanges();
				if (res && res.status === 1) {
			this.layoutUtilsService.showInfo('Cập nhật thành công');
					this.dialogRef.close({
						_NotifyCH
			});
				}
				else {
					this.layoutUtilsService.showError(res.error.message);;
				}
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
}
