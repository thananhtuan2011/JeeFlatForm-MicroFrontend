import { LayoutUtilsService, MessageType } from 'projects/jeemeet/src/modules/crud/utils/layout-utils.service';
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
import { environment } from './../../../../../environments/environment';
import { QuanLyCuocHopService } from '../../_services/quan-ly-cuoc-hop.service';
// Service

@Component({
	selector: "app-ql-add-document",
	templateUrl: "./ql-add-document.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuanLyDocumentAddComponent implements OnInit {
	toppings = new FormControl("");
	// Public properties
	QuanLyDocument: any = {};
	QuanLyDocumentForm: FormGroup;
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
	@ViewChild('matFocus', { static: false }) matFocus: ElementRef;
	inputId: any[] = [];
	idmeeting: number;
	files: any[] = [];
	ExtensionImg = ['png', 'gif', 'jpeg', 'jpg'];
	strExtensionImg = 'png, .gif, .jpeg, .jpg';
	ExtensionVideo = [
		'mp4',
		'mov',
		'avi',
		'gif',
		'mpeg',
		'flv',
		'wmv',
		'divx',
		'mkv',
		'rmvb',
		'dvd',
		'3gp',
		'webm',
	];
	strExtensionVideo =
		'mp4, .mov, .avi, .gif, .mpeg, .flv, .wmv, .divx, .mkv, .rmvb, .dvd, .3gp, .webm';
	ExtensionFile = [
		'xls',
		'xlsx',
		'doc',
		'docx',
		'pdf',
		'mp3',
		'zip',
		'7zip',
		'rar',
		'txt',
	];
	strExtensionFile =
		'xls, .xlsx, .doc, .docx, .pdf, .mp3, .zip, .7zip, .rar, .txt';
	/**
	 * Component constructor
	 *
	 * @param dialog: MatDialog
	 * @param data: any
	 * @param QuanLyDocumentFB: FormBuilder
	 * @param subheaderService: SubheaderService
	 * @param layoutUtilsService: LayoutUtilsService,
	 * @param QuanLyDocumentService: QuanLyDocumentService, *
	 * @param changeDetectorRefs: ChangeDetectorRef
	 */
	constructor(
		public dialogRef: MatDialogRef<QuanLyDocumentAddComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private QuanLyDocumentFB: FormBuilder,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private QLCuocHopService: QuanLyCuocHopService,
		private changeDetectorRefs: ChangeDetectorRef,
		private translate: TranslateService
	) {
		this.idmeeting = data.idMeeting;
	}

	/**
	 * On init
	 */
	ngOnInit() {
		if (this.idmeeting > 0) {
			this.viewLoading = true;
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
		this.QuanLyDocumentForm = this.QuanLyDocumentFB.group({
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
		const control = this.QuanLyDocumentForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;

	}


	validateAllFormFields(QuanLyDocumentForm: FormGroup) {
		Object.keys(QuanLyDocumentForm.controls).forEach((field) => {
			const control = QuanLyDocumentForm.get(field);
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
		if (this.files[0].name == undefined) {
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

		let editedQuanLyDocument = this.prepareQuanLyDocument();
		this.createFile(editedQuanLyDocument);
		return;
	}


	DongForm() {
		this.dialogRef.close();
	}
	/**
	 * Returns object for saving
	 */
	prepareQuanLyDocument() {
		var Data: any = new FormData();
		for (var i = 0; i < this.files.length; i++) {
			if (this.files[i]) {
				Data.append("FileDinhKem" + i, this.files[i]);
			}
		}
		Data.append("IdMeeting", this.idmeeting);
		return Data;
	}

	createFile(item: any, withBack: boolean = false) {
		this.viewLoading = true;

		this.QLCuocHopService.createFile(item).subscribe(
			(res) => {
				this.viewLoading = false;
				// if (res.status == 1) {
				// 	this.layoutUtilsService.showActionNotification(
				// 		"Cập nhật thành công",
				// 		MessageType.Delete,
				// 		2000,
				// 		true,
				// 		false
				// 	);
				// 	this.dialogRef.close({ item, isEdit: true });
				// }
				if (res) {
					this.layoutUtilsService.showActionNotification(
						"Cập nhật thành công!",
						MessageType.Delete,
						2000,
						true,
						false
					);
					this.dialogRef.close();
				}
				else if (res.status == 2) {
					this.layoutUtilsService.showActionNotification(
						"Cập nhật thất bại do tên thư mục đã tồn tại!",
						MessageType.Delete,
						2000,
						true,
						false
					);
					this.dialogRef.close();
				}

				else
					this.layoutUtilsService.showActionNotification(
						res.error.message,
						MessageType.Error,
						20000,
						true,
						false
					);
			}
		);

	}

	removeFile(index) {
		// this.ListFileDinhKem[index].IsDel = true;
		this.changeDetectorRefs.detectChanges();

	}
	selectEvent(event) {
	}

	updateQuanLyDocument(_QuanLyDocument: any, withBack: boolean = false) {
		this.viewLoading = true;

	}


	/**
	 * Close alert
	 * @param $event
	 */
	onAlertClose($event) {
		this.hasFormErrors = false;

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
		this.QuanLyDocumentForm.controls['Id'].setValue(this.inputId);
		this.changeDetectorRefs.detectChanges();

	}

	remove(index) {
		this.files.splice(index, 1);
		this.changeDetectorRefs.detectChanges();
	}

	new_row() {
		this.files.push({});
	}
	selectFile(i) {
		let f = document.getElementById("FileUpLoad" + i);
		f.click();
	}
	FileChoose(evt: any, index) {
		evt.stopPropagation();
		if (evt.target.files && evt.target.files.length) {
			let file = evt.target.files[0];
			var condition_type = file.type.split('/')[0];
			var condition_name = file.name.split('.').pop();
			if (condition_type == 'image') {
				if (file.size > environment.DungLuong) {
					var a = environment.DungLuong / 1048576;
					const message = this.translate.instant('QL_SOS.NOTI_REFUSE_HINHANH_1') + ` ${a} MB.`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
					return;
				}
				condition_name = condition_name.toLowerCase();
				const index_ = this.ExtensionImg.findIndex(ex => ex === condition_name);
				if (index_ < 0) {
					const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_HINHANH_1') + ` (.${this.strExtensionImg})`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
					return;
				}
			}
			else if (condition_type == 'video') {
				if (file.size > environment.DungLuong) {
					var a = environment.DungLuong / 1048576;
					const message = this.translate.instant('QL_SOS.NOTI_REFUSE_VIDEO_1') + `  ${a} MB.`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
					return;
				}
				condition_name = condition_name.toLowerCase();
				const index_ = this.ExtensionVideo.findIndex(ex => ex === condition_name);
				if (index_ < 0) {
					const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_VIDEO_1') + ` (.${this.strExtensionVideo})`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
					return;
				}
			}
			else {
				if (file.size > environment.DungLuong) {
					var a = environment.DungLuong / 1048576;
					const message = this.translate.instant('QL_SOS.NOTI_REFUSE_FILE_1') + ` ${a} MB.`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
					return;
				}
				condition_name = condition_name.toLowerCase();
				const index_ = this.ExtensionFile.findIndex(ex => ex === condition_name);
				if (index_ < 0) {
					const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_FILE_1') + `  (.${this.strExtensionFile})`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
					return;
				}
			}
			var filename = `${evt.target.files[0].name}`;
			let extension = "";
			for (var i = 0; i < this.files.length; i++) {
				if (this.files[i] && this.files[i].filename == filename) {
					const message = `"${filename}" this.Translate.instant('QL_SOS.DATHEM_1')`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
					evt.target.value = '';
					return;
				}
			}
			let reader = new FileReader();
			reader.readAsDataURL(evt.target.files[0]);
			let base64Str;
			reader.onload = function () {
				base64Str = reader.result as String;
				let lengName = evt.target.files[0].name.split('.').length;
				extension = `.${evt.target.files[0].name.split('.')[lengName - 1]}`;
				var metaIdx = base64Str.indexOf(';base64,');
				base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
			};
			setTimeout(res => {
				this.files[index] = evt.target.files[0]
				this.changeDetectorRefs.detectChanges();
			}, 1000);
		}
	}

	FileChooses(evt: any, index) {
		evt.stopPropagation();
		if (evt.target.files && evt.target.files.length) {
			const newFiles = [];

			for (let i = 0; i < evt.target.files.length; i++) {
				const file = evt.target.files[i];
				const filename = `${file.name}`;
				var condition_type = file.type.split('/')[0];
				var condition_name = file.name.split('.').pop();
				if (condition_type == 'image') {
					if (file.size > environment.DungLuong) {
						var a = environment.DungLuong / 1048576;
						const message = this.translate.instant('QL_SOS.NOTI_REFUSE_HINHANH_1') + ` ${a} MB.`;
						this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
						return;
					}
					condition_name = condition_name.toLowerCase();
					const index_ = this.ExtensionImg.findIndex(ex => ex === condition_name);
					if (index_ < 0) {
						const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_HINHANH_1') + ` (.${this.strExtensionImg})`;
						this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
						return;
					}
				}
				else if (condition_type == 'video') {
					if (file.size > environment.DungLuong) {
						var a = environment.DungLuong / 1048576;
						const message = this.translate.instant('QL_SOS.NOTI_REFUSE_VIDEO_1') + `  ${a} MB.`;
						this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
						return;
					}
					condition_name = condition_name.toLowerCase();
					const index_ = this.ExtensionVideo.findIndex(ex => ex === condition_name);
					if (index_ < 0) {
						const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_VIDEO_1') + ` (.${this.strExtensionVideo})`;
						this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
						return;
					}
				}
				else {
					if (file.size > environment.DungLuong) {
						var a = environment.DungLuong / 1048576;
						const message = this.translate.instant('QL_SOS.NOTI_REFUSE_FILE_1') + ` ${a} MB.`;
						this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
						return;
					}
					condition_name = condition_name.toLowerCase();
					const index_ = this.ExtensionFile.findIndex(ex => ex === condition_name);
					if (index_ < 0) {
						const message = this.translate.instant('QL_SOS.NOTI_CHOOSE_FILE_1') + `  (.${this.strExtensionFile})`;
						this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
						return;
					}
				}
				// Check if the file with the same filename already exists
				if (this.files.some(item => item && item.filename === filename)) {
					const message = `"${filename}" this.Translate.instant('QL_SOS.DATHEM_1')`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Warning, 10000, true, false);
					evt.target.value = '';
					break;
				}

				const reader = new FileReader();

				reader.onload = () => {
					const base64Str = (reader.result as string).split(';base64,')[1];
					const lengName = file.name.split('.').length;
					const extension = `.${file.name.split('.')[lengName - 1]}`;

					newFiles.push(evt.target.files[i]);
					this.changeDetectorRefs.detectChanges();

					if (i === evt.target.files.length - 1) {
						// If this is the last file, update the main array
						this.files = [...this.files, ...newFiles];
					}
					this.changeDetectorRefs.detectChanges();
				};

				// Read the file as data URL
				reader.readAsDataURL(file);
			}
		}
	}
}
