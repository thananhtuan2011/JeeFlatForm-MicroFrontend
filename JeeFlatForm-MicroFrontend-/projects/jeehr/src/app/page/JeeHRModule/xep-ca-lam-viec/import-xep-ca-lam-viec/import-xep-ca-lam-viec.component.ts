import { Component, OnInit, Inject, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ImportXepCaModel } from '../Model/xep-ca-lam-viec.model';
import { LayoutUtilsService, MessageType } from 'src/app/modules/crud/utils/layout-utils.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { XepCaLamViecService } from '../Services/xep-ca-lam-viec.service';
import { MatDatepicker } from '@angular/material/datepicker';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { DateAdapter, NativeDateAdapter } from '@angular/material/core';

const moment = _rollupMoment || _moment;

export class CustomDateAdapter extends NativeDateAdapter {
	format(date: Date, displayFormat: Object): string {
		var formatString = 'MM/YYYY';
		return moment(date).format(formatString);
	}
}

@Component({
	selector: 'm-import-xep-ca-lam-viec',
	templateUrl: './import-xep-ca-lam-viec.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: DateAdapter, useClass: CustomDateAdapter
		}
	]
})
export class ImportXepCaLamViecComponent implements OnInit {
	item: any;
	oldItem: any;
	selectedTab: number = 0;
	loadingSubject = new BehaviorSubject<boolean>(false);
	loading$ = this.loadingSubject.asObservable();
	itemForm: FormGroup;
	viewLoading: boolean = false;
	hasFormErrors: boolean = false;
	loadingAfterSubmit: boolean = false;
	ShowButton: boolean = true;
	//--------Import--------------
	indexItem: number;
	ObjImage: any = { h1: "", h2: "" };
	Image: any;
	isShowINFO: boolean = false;
	isShowSEO: boolean = false;
	TenFile: string = '';
	@ViewChild('tensheet', { static: true }) tensheet: ElementRef;
	message: string = '';
	loi_thanhcong: string = '';
	loi_format: string = '';
	loi_manv: string = '';

	constructor(public dialogRef: MatDialogRef<ImportXepCaLamViecComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private _XepCaLamViecService: XepCaLamViecService,
		public dialog: MatDialog,
		private layoutUtilsService: LayoutUtilsService,
		private changeDetectorRefs: ChangeDetectorRef,
		private translate: TranslateService,
	) { }


	ngOnInit() {
		this.year.setValue(new Date(this.data._nam, this.data._thang - 1, 1));
		this.tensheet.nativeElement.value = "Sheet1";
	}

	goBack() {
		this.dialogRef.close();
	}

	getComponentTitle() {
		let result = this.translate.instant('thunhap_truluong.themmoicot');

		result = this.translate.instant('thunhap_truluong.chinhsuacot');
		return result;
	}


	text(e: any) {
		if (!((e.keyCode > 95 && e.keyCode < 106)
			|| (e.keyCode > 47 && e.keyCode < 58)
			|| e.keyCode == 8)) {
			e.preventDefault();
		}
	}
	f_convertDate(v: any) {

		if (v != "") {
			let a = new Date(v);
			return a.getFullYear() + "-" + ("0" + (a.getMonth() + 1)).slice(-2) + "-" + ("0" + (a.getDate())).slice(-2) + "T00:00:00.0000000";
		}
	}

	year = new FormControl();
	@ViewChild(MatDatepicker) picker;
	monthSelected(params) {
		this.year.setValue(params);
		this.picker.close();
	}
	//======================================================================================================
	//=============Xử lý import===================
	FileSelected(evt: any) {
		if (evt.target.files && evt.target.files.length) {//Nếu có file
			let file = evt.target.files[0]; // Ví dụ chỉ lấy file đầu tiên
			this.TenFile = file.name;
			let reader = new FileReader();
			reader.readAsDataURL(evt.target.files[0]);
			let base64Str;
			var b = this.indexItem;

			setTimeout(() => {
				base64Str = reader.result as String;
				var metaIdx = base64Str.indexOf(';base64,');
				base64Str = base64Str.substr(metaIdx + 8); // Cắt meta data khỏi chuỗi base64
				this.ObjImage.h1 = base64Str;

			}, 1000);
			var hinhanh = new ImportXepCaModel();
			setInterval(() => {
				let v;
				v = this.ObjImage.h1

				if (v) {
					if (v != "") {
						hinhanh.strBase64 = v;
						this.changeDetectorRefs.detectChanges();
						this.ObjImage.h1 = ""
					}
					if (hinhanh.strBase64 != "") {
						this.Image = hinhanh;
						if (this.Image.strBase64 != '') { this.isShowINFO = true; }
						this.changeDetectorRefs.detectChanges();
					}
				}
			}, 100);
		}
		else {
			this.Image.strBase64 = "";
		}
	}

	Import() {
		if (this.Image != undefined && this.Image.strBase64 != "") {
			if (this.tensheet.nativeElement.value != "") {
				let updatedonvi = this.Prepareleave_Import();
				this.AddItem_Import(updatedonvi);
			}
			else {
				const message = "Vui lòng nhập tên sheet";
				this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
				return;
			}
		}
		else {
			const message = "Vui lòng chọn file import";
			this.layoutUtilsService.showActionNotification(message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			return;
		}
	}

	Prepareleave_Import(): ImportXepCaModel {
		const ts = new ImportXepCaModel();
		ts.File = this.Image.strBase64;
		ts.FileName = this.TenFile;
		ts.Sheet = this.tensheet.nativeElement.value;
		ts.Month = moment(this.year.value).format("MM");
		ts.Year = moment(this.year.value).format("YYYY");
		return ts;
	}
	AddItem_Import(item: ImportXepCaModel) {
		this.loadingAfterSubmit = true;
		this.viewLoading = true;
		this.layoutUtilsService.showWaitingDiv();
		this._XepCaLamViecService.ImportData(item).subscribe(res => {
			this.layoutUtilsService.OffWaitingDiv();
			if (res && res.status === 1) {
				this.dialogRef.close({
					item
				})
			}
			else {
				this.viewLoading = false;
				this.loi_format = res.errordata;
				this.layoutUtilsService.showActionNotification(res.error.message, MessageType.Read, 999999999, true, false, 3000, 'top', 0);
			}
			this.changeDetectorRefs.detectChanges();
		});
	}
	@ViewChild('myInput') myInputVariable: ElementRef;
	resetFile() {
		this.myInputVariable.nativeElement.value = "";
		this.tensheet.nativeElement.value = "";
		if (this.Image != undefined) {
			this.Image.strBase64 = "";
		}
	}

	DownloadImportForm() {
		this._XepCaLamViecService.DownloadFileMauImport_Shift().subscribe(response => {
			var headers = response.headers;
			let filename = headers.get('x-filename');
			let type = headers.get('content-type');
			let blob = new Blob([response.body], { type: type });
			const fileURL = URL.createObjectURL(blob);
			var link = document.createElement('a');
			link.href = fileURL;
			link.download = filename;
			link.click();
		});
	}
}
