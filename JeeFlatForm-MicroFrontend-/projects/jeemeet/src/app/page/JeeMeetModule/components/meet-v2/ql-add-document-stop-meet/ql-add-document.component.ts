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
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { LayoutUtilsService, MessageType } from "projects/jeemeet/src/modules/crud/utils/layout-utils.service";
// Material
// RxJS
import { Observable, Subscription } from "rxjs";
import { QuanLyCuocHopService } from "../../../_services/quan-ly-cuoc-hop.service";
import { environment } from "projects/jeemeet/src/environments/environment";
// Service


@Component({
	selector: "app-meeting-stop-add",
	templateUrl: "./ql-add-document.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})


export class QuanLyDocumentAddStopMeetingComponent implements OnInit {
	MeetingFeedbackForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	@ViewChild("scrollMe", { static: true }) myScrollContainer: ElementRef;
	private componentSubscriptions: Subscription;
	idRow: number = 0;
	feedbackContent: string = "";
	isXem: boolean = false;
	ListFileDinhKem: any[] = [];
	files: any[] = [{ data: {} }];
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
	constructor(
		public dialogRef: MatDialogRef<QuanLyDocumentAddStopMeetingComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private MeetingFeedbackFB: FormBuilder,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private service: QuanLyCuocHopService,
		private changeDetectorRefs: ChangeDetectorRef,
		private translate: TranslateService
	) { }


	ngOnInit() {
		this.idRow = this.data.idMeeting;
		this.isXem = false
		if (this.idRow > 0) {
			this.viewLoading = true;
			this.service.getDetailHoanHop(this.idRow).subscribe((res) => {
				this.viewLoading = false;
				if (res && res.data && res.status == 1) {
					this.feedbackContent = res.data.NoiDung;
					this.ListFileDinhKem = res.data.FileDinhKem;
					this.changeDetectorRefs.detectChanges();
				} else
					this.layoutUtilsService.showActionNotification(
						res.error.message,
						MessageType.Read,
						2000,
						true,
						false
					);
			});
		}

	}


	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}

	}


	isControlInvalid(controlName: string): boolean {
		const control = this.MeetingFeedbackForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;

	}


	validateAllFormFields(MeetingFeedbackForm: FormGroup) {
		Object.keys(MeetingFeedbackForm.controls).forEach((field) => {
			const control = MeetingFeedbackForm.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});

	}


	onSubmit() {
		this.hasFormErrors = false;
		let check = /\S/.test(this.feedbackContent);
		if (!check) {
			const mes = this.translate.instant('QL_CUOCHOP.CUOCHOP.FEEDBACKCONTENTWARNING');
			this.layoutUtilsService.showActionNotification(
				mes,
				MessageType.Read,
				2000,
				true,
				false
			);
			return;
		}
		let data = this.prepare();
		if (this.idRow > 0) {
			this.update(data);
			return;
		}
		else {
			this.add(data);
		}

	}


	add(data) {
		this.viewLoading = true;
		this.service.addUpdateHoanHop(data).subscribe((res) => {
			this.viewLoading = false;
			if (res.status == 1) {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Delete,
					2000,
					true,
					false
				);
				this.dialogRef.close(res);
			} else
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Read,
					2000,
					true,
					false
				);
		});

	}


	update(data) {
		this.viewLoading = true;
		this.service.addUpdateHoanHop(data).subscribe((res) => {
			this.viewLoading = false;
			if (res.status == 1) {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Delete,
					2000,
					true,
					false
				);
				this.dialogRef.close(res);
			} else
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Read,
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


	prepare() {
		const _data: any = {};
		if (this.idRow > 0) {
			_data.IdRow = this.idRow;
		}
		_data.NoiDung = this.feedbackContent;
		_data.IdCuocHop = this.data.idMeeting;

		_data.FileDinhKem = [];
		if (this.ListFileDinhKem) {
			_data.FileDinhKem = this.ListFileDinhKem.filter(x => x.IsDel);
			for (var i = 0; i < this.files.length; i++) {
				if (this.files[i].data && this.files[i].data.strBase64) {
					_data.FileDinhKem.push(Object.assign({}, this.files[i].data));
				}
			}
		}
		return _data;

	}


	onAlertClose($event) {
		this.hasFormErrors = false;

	}
	new_row() {
		this.files.push({ data: {} });
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
			// let size = file.size;
			// if (size >= environment.DungLuong) {
			// 	const message = `Không thể upload hình dung lượng cao hơn ${environment.DungLuong / 1000000}MB.`;
			// 	this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, false);
			// 	return;
			// }
			var filename = `${evt.target.files[0].name}`;
			let extension = "";
			for (var i = 0; i < this.files.length; i++) {
				if (this.files[i].data && this.files[i].data.filename == filename) {
					const message = `"${filename}" this.Translate.instant('QL_SOS.DATHEM_1')`;
					this.layoutUtilsService.showActionNotification(message, MessageType.Update, 10000, true, false);
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
				var _file: any = {};
				_file.strBase64 = base64Str;
				_file.filename = filename;
				_file.extension = extension;
				_file.type = evt.target.files[0].type.includes('image') ? 1 : 2;
				_file.isnew = true;
				this.files[index].data = _file;
				this.changeDetectorRefs.detectChanges();
			}, 1000);
		}
	}
	remove(index) {
		this.files.splice(index, 1);
		this.changeDetectorRefs.detectChanges();
	}
	removeFile(index) {
		this.ListFileDinhKem[index].IsDel = true;
		this.changeDetectorRefs.detectChanges();
	}
}
