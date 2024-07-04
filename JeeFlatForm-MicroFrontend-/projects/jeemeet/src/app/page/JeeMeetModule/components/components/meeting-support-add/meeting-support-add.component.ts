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
// RxJS
import { Observable, Subscription } from "rxjs";
import { QuanLyCuocHopService } from "../../../_services/quan-ly-cuoc-hop.service";
import { LayoutUtilsService, MessageType } from "projects/jeemeet/src/modules/crud/utils/layout-utils.service";



@Component({
	selector: "app-meeting-support-add",
	templateUrl: "./meeting-support-add.component.html",
	changeDetection: ChangeDetectionStrategy.OnPush,
})


export class MeetingSupportAddComponent implements OnInit {
	MeetingSupportForm: FormGroup;
	hasFormErrors: boolean = false;
	viewLoading: boolean = false;
	@ViewChild("scrollMe", { static: true }) myScrollContainer: ElementRef;
	private componentSubscriptions: Subscription;
	id: number = 0;
	require: string = "";
	note: string = "";
	isView: boolean = false;


	constructor(
		public dialogRef: MatDialogRef<MeetingSupportAddComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private MeetingSupportFB: FormBuilder,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private service: QuanLyCuocHopService,
		private changeDetectorRefs: ChangeDetectorRef,
		private translate: TranslateService
	) { }


	ngOnInit() {
		this.id = this.data._data.Id;
		this.isView = this.data._data.isView ? this.data._data.isView : false;

	}


	ngOnDestroy() {
		if (this.componentSubscriptions) {
			this.componentSubscriptions.unsubscribe();
		}

	}


	getTitle(): string {
		return this.translate.instant("OBJECT.ADD.TITLE", {
			name: this.translate
				.instant("QL_CUOCHOP.CUOCHOP.SUPPORTREQUIRE").toLowerCase(),
		});

	}


	isControlInvalid(controlName: string): boolean {
		const control = this.MeetingSupportForm.controls[controlName];
		const result = control.invalid && control.touched;
		return result;

	}


	validateAllFormFields(MeetingSupportForm: FormGroup) {
		Object.keys(MeetingSupportForm.controls).forEach((field) => {
			const control = MeetingSupportForm.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});

	}


	onSubmit() {
		this.hasFormErrors = false;
		let check = /\S/.test(this.require);
		if (!check) {
			const mes = this.translate.instant('QL_CUOCHOP.CUOCHOP.SUPPORTREQUIREWARNING');
			this.layoutUtilsService.showActionNotification(
				mes,
				MessageType.Delete,
				2000,
				true,
				false
			);
			return;
		}
		let data = this.prepareData();
		this.add(data);

	}


	add(data) {
		this.viewLoading = true;
		this.service.addMeetingSupport(data).subscribe((res) => {
			this.viewLoading = false;
			if (res.status == 1) {
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Delete,
					2000,
					true,
					false
				);
				this.dialogRef.close(true);
			} else
				this.layoutUtilsService.showActionNotification(
					res.error.message,
					MessageType.Delete,
					2000,
					true,
					false
				);
		});

	}


	closeForm() {
		// const dialogRef = this.layoutUtilsService.deleteElement_close(this.translate.instant('ComMon.XACNHANDONG'), this.translate.instant('ComMon.CLOSE_U'));
		// dialogRef.afterClosed().subscribe(res => {
		// 	if (!res) {
		// 		return;
		// 	}
		// 	this.dialogRef.close();
		// });
    this.dialogRef.close();
	}


	prepareData() {
		const _data: any = {};

		if (this.id > 0) {
			_data.Id = this.id;
		}
		_data.Require = this.require;
		_data.Note = this.note;
		_data.IdMeeting = this.data._data.IdM;

		return _data;

	}


	onAlertClose($event) {
		this.hasFormErrors = false;

	}


}
