// Angular
import {
	Component,
	OnInit,
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Inject,
	ViewChild,
	ElementRef,
	HostListener,
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
import { Observable, Subscription } from "rxjs";
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { QuanLyCuocHopService } from '../../_services/quan-ly-cuoc-hop.service';
import { environment } from "projects/jeemeet/src/environments/environment.prod";
import { LayoutUtilsService, MessageType } from "projects/jeemeet/src/modules/crud/utils/layout-utils.service";
// Service

@Component({
	selector: "app-khong-duyet-file-dialog",
	templateUrl: "./khong-duyet-file-dialog.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KhongDuyetFileDialogComponent implements OnInit {
	toppings = new FormControl("");
	// Public properties
	KhongDuyetFileCuocHop: any = {};
	KhongDuyetFileCuocHopForm: FormGroup;
	hasFormErrors: boolean = false;
	filterStatic: Observable<string[]>;
	viewLoading: boolean = false;
	@ViewChild("inputSDT", { static: true }) inputSDT: ElementRef;
	@ViewChild("scrollMe", { static: true }) myScrollContainer: ElementRef;
	selectIDCuocHop: string = "0";
	IdCuocHop: string = "0";
	dataSource: any[] = [];
	displayedColumns: string[] = ["STT", "Id", "action"];
	private componentSubscriptions: Subscription;
	lstCuocHop: any[] = [];
	RowID: number = 1;
	tabIndexValue = 0;
	dataTem = {
		Id: 0,
		NoiDungCauHoi: '',
	};
  lydo:string;
	@ViewChild('matFocus', { static: false }) matFocus: ElementRef;
	inputId: any[] = [];
	/**
	 * Component constructor
	 *
	 * @param dialog: MatDialog
	 * @param data: any
	 * @param KhongDuyetFileCuocHopFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService,
	 * @param KhongDuyetFileCuocHopService: KhongDuyetFileCuocHopService, *
	 * @param changeDetectorRefs: ChangeDetectorRef
	 */
	constructor(
		public dialogRef: MatDialogRef<KhongDuyetFileDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private KhongDuyetFileCuocHopFB: FormBuilder,
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
		this.KhongDuyetFileCuocHop = this.data.KhongDuyetFileCuocHop;
		this.createForm();
	//	this.lstCuocHop = [];
		if (this.KhongDuyetFileCuocHop.Id > 0) {
			this.viewLoading = true;
			// this.QLCuocHopService.getKhongDuyetFileCuocHopById(
			// 	this.KhongDuyetFileCuocHop.Id
			// ).subscribe((res) => {
			// 	this.viewLoading = false;
			// 	if (res && res.status == 1) {
			// 		this.KhongDuyetFileCuocHop = res.data;
			// 		this.createForm();
			// 		this.changeDetectorRefs.detectChanges();
			// 	} else
			// 		this.layoutUtilsService.showActionNotification(
			// 			res.error.message,
			// 			MessageType.Error,
			// 			2000,
			// 			true,
			// 			false
			// 		);
			// });
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
	createForm() {
		setTimeout(() => this.matFocus.nativeElement.focus());
		this.KhongDuyetFileCuocHopForm = this.KhongDuyetFileCuocHopFB.group({
			NoiDungGhiChu: ["", [Validators.required, Validators.pattern(/[\S]/)]],
		});
		this.changeDetectorRefs.detectChanges();

	}



	/**
	 * Returns page title
	 */
	getTitle(): string {

		return this.translate.instant("OBJECT.ADD.TITLE", {
			name: this.translate
				.instant("sổ tay cuộc họp").toLowerCase(),
		}); //Thêm mới nhóm cư dân

	}



	/**
	 * Check control is invalid
	 * @param controlName: string
	 */
	isControlInvalid(controlName: string): boolean {
		const control = this.KhongDuyetFileCuocHopForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;

	}


	validateAllFormFields(KhongDuyetFileCuocHopForm: FormGroup) {
		Object.keys(KhongDuyetFileCuocHopForm.controls).forEach((field) => {
			const control = KhongDuyetFileCuocHopForm.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});

	}

	@HostListener('keydown.enter')
	onEnterKeyDown() {

	  this.onSubmit();
	}
	/**
	 * Save data
	 * @param withBack: boolean
	 */
	onSubmit() {
		this.hasFormErrors = false;
		const controls = this.KhongDuyetFileCuocHopForm.controls;
		/** check form */
		if (controls['NoiDungGhiChu'].value == ''||!controls['NoiDungGhiChu'].value) {
			const mes = this.translate.instant('QL_CUOCHOP.CUOCHOP.VUILONGNHAP_NOIDUNGGHICHU');
			this.layoutUtilsService.showActionNotification(
				mes,
				MessageType.Delete,
				2000,
				true,
				false
			);
			return;
		}
		if (this.KhongDuyetFileCuocHopForm.invalid) {
			Object.keys(controls).forEach((controlName) => {
				controls[controlName].markAsTouched();

			});
			this.hasFormErrors = true;
			let element = this.myScrollContainer.nativeElement;
			this.myScrollContainer.nativeElement.scrollTop = 0;
			this.changeDetectorRefs.detectChanges();
			return;

		}
		let editedKhongDuyetFileCuocHop = this.prepareKhongDuyetFileCuocHop();

			this.addSoTayGhiChu(editedKhongDuyetFileCuocHop);

	}

	addSoTayGhiChu(
		_SoTayGhiChu: any,
		withBack: boolean = false
	) {
		this.viewLoading = true;
		this.QLCuocHopService.DuyetTaiLieu(this.data.item.IdDocument,2,this.lydo).subscribe((res) => {
			this.viewLoading = false;
			if (res.status == 1) {
				this.layoutUtilsService.showActionNotification(
					"Cập nhật thành công",
					MessageType.Delete,
					2000,
					true,
					false
				);
				this.dialogRef.close({ _SoTayGhiChu , isEdit: false });
			} else
				this.layoutUtilsService.showActionNotification(
					"Cập nhật không thành công",
					MessageType.Delete,
					2000,
					true,
					false
				);
		});
	}
	DongForm() {

		// const dialogRef = this.layoutUtilsService.deleteElement_close(this.translate.instant('ComMon.XACNHANDONG'), this.translate.instant('ComMon.CLOSE_U'));
		// dialogRef.afterClosed().subscribe(res => {
		// 	if (!res) {
		// 		return;
		// 	}
		// 	this.dialogRef.close();
		// });
    this.dialogRef.close();
	}
	/**
	 * Returns object for saving
	 */
	prepareKhongDuyetFileCuocHop(){
		const controls = this.KhongDuyetFileCuocHopForm.controls;
		this.lydo = controls["NoiDungGhiChu"].value;

	}


	removeFile(index) {
		// this.ListFileDinhKem[index].IsDel = true;
		this.changeDetectorRefs.detectChanges();

	}
	selectEvent(event) {
	}

	updateKhongDuyetFileCuocHop(_KhongDuyetFileCuocHop: any,withBack: boolean = false) {
		this.viewLoading = true;

	}


	/**
	 * Close alert
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;

	}



	selectFile(i) {
		let f = document.getElementById("FileUpLoad" + i);
		f.click();

	}



	numberOnly(event): boolean {
		const charCode = event.which ? event.which : event.keyCode;
		if (charCode > 31 && (charCode < 48 || charCode > 57)) {
			return false;
		}
		return true;

	}


	detectChanges() {
		this.inputId.push(this.dataTem.Id);
		this.dataSource.push(this.dataTem);
		// this.DSDanhGiaTam = this.dataSource;
		// this.dataSource = this.DSDanhGiaTam.filter((x) => !x.IsDel);
		this.KhongDuyetFileCuocHopForm.controls['Id'].setValue(this.inputId);
		this.changeDetectorRefs.detectChanges();

	}


}
